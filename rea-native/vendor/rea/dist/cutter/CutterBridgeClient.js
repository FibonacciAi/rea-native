import { randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { createConnection } from "node:net";
import { lstat, open, opendir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { z } from "zod";
import { AnalysisCapabilityUnavailableError, AnalysisOutputError, AnalysisResourceConstraintError, } from "../domain/analysisErrorCore.js";
import { err, ok } from "../domain/result.js";
import { requireWindowsNativeAuthority } from "../windows/WindowsNativeLoader.js";
import { readBoundedFileBytes } from "../process/BoundedFileBytes.js";
const descriptorSchema = z.object({
    session_id: z.string().uuid(),
    pid: z.number().int().positive(),
    host: z.literal("127.0.0.1"),
    port: z.number().int().min(1).max(65535),
    token: z.string().min(20),
    document_generation: z.number().int().nonnegative(),
    current_file: z.string().nullable(),
    cutter_version: z.string().nullable(),
    identity_status: z.literal("partial"),
});
export const CUTTER_PROVIDER_IDENTITY = {
    id: "cutter.python-plugin",
    name: "Cutter Python plugin",
    version: null,
};
const responseSchema = z.object({
    ok: z.boolean(),
    session_id: z.string().uuid().optional(),
    output: z.unknown().optional(),
    current_file: z.string().nullable().optional(),
    cutter_version: z.string().nullable().optional(),
    document_generation: z.number().int().nonnegative().optional(),
    identity_status: z.literal("partial").optional(),
    error: z.string().optional(),
    message: z.string().optional(),
    execution_state: z
        .enum(["not_started", "running", "complete", "failed", "unknown"])
        .optional(),
    output_truncated: z.boolean().optional(),
    completed_commands: z
        .array(z.object({
        request_id: z.string().uuid(),
        execution_state: z.enum(["not_started", "complete", "failed"]),
    }))
        .max(64)
        .optional(),
    completed_connection: z
        .string()
        .regex(/^[0-9a-f]{16}$/)
        .optional(),
});
const acknowledgementSchema = z.object({
    ok: z.literal(true),
    acknowledged: z.boolean(),
});
const MAX_DESCRIPTOR_BYTES = 64 * 1024;
const MAX_FRAME_BYTES = 16 * 1024 * 1024;
const FRAME_PAGE_BYTES = 64 * 1024;
// Bound admitted descriptor input bytes and concurrent file/socket handles.
const MAX_DESCRIPTOR_CANDIDATES = MAX_FRAME_BYTES / MAX_DESCRIPTOR_BYTES;
const DISCOVERY_CONCURRENCY = 8;
const serializeRequest = (descriptor, request) => {
    const requestBytes = JSON.stringify({
        ...request,
        session_id: descriptor.session_id,
    });
    let frameBytes = Buffer.byteLength(JSON.stringify({ request: "", proof: "0".repeat(64) })) +
        Buffer.byteLength(requestBytes);
    for (const character of requestBytes)
        if (character === '"' || character === "\\")
            frameBytes += 1;
    if (frameBytes > MAX_FRAME_BYTES)
        throw new AnalysisResourceConstraintError("cutter_command", "transport", "Cutter request exceeds its authenticated frame limit; no command was sent.", { frame_bytes: frameBytes, max_frame_bytes: MAX_FRAME_BYTES });
    return requestBytes;
};
class CutterBridgeResponseFrames {
    #parts = [];
    #page = Buffer.allocUnsafe(FRAME_PAGE_BYTES);
    #pageLength = 0;
    #contentBytes = 0;
    #framesRead = 0;
    push(chunk, onFrame) {
        let offset = 0;
        while (offset < chunk.length) {
            const delimiter = chunk.indexOf(0x0a, offset);
            const end = delimiter < 0 ? chunk.length : delimiter;
            const segment = chunk.subarray(offset, end);
            if (this.#contentBytes + segment.length + (delimiter < 0 ? 1 : 0) >
                MAX_FRAME_BYTES)
                throw new Error("Cutter bridge response exceeded its framed transport limit");
            this.#append(segment);
            if (delimiter < 0)
                return;
            if (++this.#contentBytes > MAX_FRAME_BYTES)
                throw new Error("Cutter bridge response exceeded its framed transport limit");
            if (this.#pageLength > 0)
                this.#parts.push(this.#page.subarray(0, this.#pageLength));
            const line = Buffer.concat(this.#parts, this.#contentBytes - 1);
            this.#reset();
            if (++this.#framesRead > 2)
                throw new Error("Cutter bridge sent more than two protocol frames");
            offset = delimiter + 1;
            if (!onFrame(line))
                return;
        }
    }
    #append(segment) {
        let copied = 0;
        while (copied < segment.length) {
            const length = Math.min(segment.length - copied, FRAME_PAGE_BYTES - this.#pageLength);
            segment.copy(this.#page, this.#pageLength, copied, copied + length);
            this.#pageLength += length;
            this.#contentBytes += length;
            copied += length;
            if (this.#pageLength === FRAME_PAGE_BYTES) {
                this.#parts.push(this.#page);
                this.#page = Buffer.allocUnsafe(FRAME_PAGE_BYTES);
                this.#pageLength = 0;
            }
        }
    }
    #reset() {
        this.#parts = [];
        this.#page = Buffer.allocUnsafe(FRAME_PAGE_BYTES);
        this.#pageLength = 0;
        this.#contentBytes = 0;
    }
}
const mapDiscovery = async (inputs, operation) => {
    const results = new Array(inputs.length);
    let next = 0;
    await Promise.all(Array.from({ length: Math.min(inputs.length, DISCOVERY_CONCURRENCY) }, async () => {
        while (next < inputs.length) {
            const index = next++;
            results[index] = await operation(inputs[index]);
        }
    }));
    return results;
};
class CutterBridgeRequestFailure extends Error {
    requestSent;
    constructor(message, requestSent) {
        super(message);
        this.requestSent = requestSent;
    }
}
/** Discovers and communicates with REA Python bridge plugins in live Cutter processes. */
export class CutterBridgeClient {
    #directory;
    #platform;
    #windowsPrivateReader;
    #pendingAcknowledgements = new Map();
    constructor(environment = process.env, options = {}) {
        const configured = environment.REA_CUTTER_BRIDGE_DIR;
        const localAppData = environment.LOCALAPPDATA;
        this.#platform = options.platform ?? process.platform;
        this.#windowsPrivateReader =
            options.windowsPrivateReader ??
                (this.#platform === "win32"
                    ? {
                        verifyDirectory: (directory) => z
                            .object({ privateDacl: z.literal(true) })
                            .safeParse(requireWindowsNativeAuthority().call("cutter_bridge_verify_directory", [directory])).success,
                        readDescriptor: (directory, name, maxBytes) => z
                            .instanceof(Buffer)
                            .parse(requireWindowsNativeAuthority().call("cutter_bridge_read_descriptor", [directory, name, maxBytes])),
                    }
                    : undefined);
        this.#directory =
            configured ??
                (this.#platform === "win32" && localAppData
                    ? join(localAppData, "REA", "CutterBridge")
                    : join(homedir(), ".cache", "rea", "cutter-bridge"));
    }
    async listSessions() {
        const loaded = await this.#readDescriptors();
        if (loaded.error !== undefined)
            return {
                sessions: [],
                bridge_directory: this.#directory,
                discovery_status: loaded.error,
                bridge_directory_security: loaded.security,
            };
        const descriptors = await mapDiscovery(loaded.descriptors, async (descriptor) => {
            try {
                const status = responseSchema.safeParse(await this.#request(descriptor, serializeRequest(descriptor, {
                    kind: "status",
                    session_id: descriptor.session_id,
                })));
                if (!status.success ||
                    !status.data.ok ||
                    status.data.session_id !== descriptor.session_id)
                    return undefined;
                return {
                    session_id: descriptor.session_id,
                    pid: descriptor.pid,
                    document_generation: status.data.document_generation ?? descriptor.document_generation,
                    current_file: status.data.current_file === undefined
                        ? descriptor.current_file
                        : status.data.current_file,
                    cutter_version: status.data.cutter_version ?? descriptor.cutter_version,
                    identity_status: "partial",
                };
            }
            catch {
                return undefined;
            }
        });
        const sessions = descriptors.filter((value) => value !== undefined);
        return {
            sessions,
            bridge_directory: this.#directory,
            discovery_status: sessions.length > 0 ? "sessions_found" : "no_live_bridge_found",
            bridge_directory_security: loaded.security,
        };
    }
    async execute(input) {
        input.signal?.throwIfAborted();
        const descriptor = await this.#find(input.sessionId);
        input.signal?.throwIfAborted();
        const requestId = randomUUID();
        const commandRequest = serializeRequest(descriptor, {
            kind: "command",
            request_id: requestId,
            expected_generation: input.expectedGeneration,
            command: input.command,
            json: input.json,
        });
        await this.#recoverCompletedCommands(descriptor, input.signal);
        await this.#retryPendingAcknowledgements(descriptor);
        input.signal?.throwIfAborted();
        let completionToken;
        let rawResponse;
        try {
            rawResponse = await this.#request(descriptor, commandRequest, input.signal, (ordinal) => {
                completionToken = ordinal;
            });
        }
        catch (cause) {
            if (!(cause instanceof CutterBridgeRequestFailure) || !cause.requestSent)
                throw cause;
            return {
                requestId,
                output: null,
                currentFile: descriptor.current_file,
                documentGeneration: input.expectedGeneration,
                identityStatus: "partial",
                cutterVersion: descriptor.cutter_version,
                executionState: "unknown",
                error: "transport-response-missing",
                message: `${cause.message}; the command may have completed; do not retry automatically`,
                outputTruncated: false,
                ...(completionToken === undefined ? {} : { completionToken }),
            };
        }
        const parsed = responseSchema.safeParse(rawResponse);
        if (!parsed.success)
            return {
                requestId,
                output: null,
                currentFile: descriptor.current_file,
                documentGeneration: input.expectedGeneration,
                identityStatus: "partial",
                cutterVersion: descriptor.cutter_version,
                executionState: "unknown",
                error: "malformed-bridge-response",
                message: "Cutter may have completed the command, but its response was invalid; do not retry automatically",
                outputTruncated: false,
                ...(completionToken === undefined ? {} : { completionToken }),
            };
        const response = parsed.data;
        const executionState = response.ok
            ? response.execution_state === undefined ||
                response.execution_state === "complete"
                ? "complete"
                : response.execution_state === "not_started"
                    ? "not_started"
                    : "unknown"
            : response.execution_state === "failed"
                ? "failed"
                : response.execution_state === "not_started"
                    ? "not_started"
                    : "unknown";
        if (executionState !== "unknown")
            await this.#acknowledgeCompletion(descriptor, requestId);
        if (response.error === "active-document-generation-changed")
            throw new Error("Cutter's active document generation changed. List sessions again and select the current generation.");
        return {
            requestId,
            output: response.output ?? null,
            currentFile: response.current_file === undefined
                ? descriptor.current_file
                : response.current_file,
            documentGeneration: response.document_generation ?? input.expectedGeneration,
            identityStatus: "partial",
            cutterVersion: response.cutter_version ?? descriptor.cutter_version,
            executionState,
            error: response.ok ? null : (response.error ?? "cutter-command-failed"),
            message: response.message ?? null,
            outputTruncated: response.output_truncated ?? false,
            ...(completionToken === undefined ? {} : { completionToken }),
        };
    }
    /** Confirm completion by exact receipt or authenticated connection watermark. */
    async confirmCommandCompletion(sessionId, requestId, completionToken) {
        let descriptor;
        try {
            descriptor = await this.#find(sessionId);
        }
        catch (cause) {
            return err(new AnalysisCapabilityUnavailableError("cutter", "cutter_command", cause instanceof Error ? cause.message : "Cutter session unavailable", { cause }));
        }
        try {
            const raw = await this.#request(descriptor, serializeRequest(descriptor, {
                kind: "status",
                session_id: sessionId,
            }));
            const parsed = responseSchema.safeParse(raw);
            if (!parsed.success ||
                !parsed.data.ok ||
                parsed.data.session_id !== sessionId)
                return err(new AnalysisOutputError("cutter_command_status", "The bridge status response did not contain a valid session identity.", { cause: parsed.success ? undefined : parsed.error }));
            const completed = (parsed.data.completed_commands ?? []).some((receipt) => receipt.request_id === requestId);
            if (completed)
                await this.#acknowledgeCompletion(descriptor, requestId);
            return ok(completed ||
                (completionToken !== undefined &&
                    parsed.data.completed_connection !== undefined &&
                    parsed.data.completed_connection >= completionToken));
        }
        catch (cause) {
            return err(new AnalysisCapabilityUnavailableError("cutter", "cutter_command_status", cause instanceof Error ? cause.message : "Cutter status failed", { cause }));
        }
    }
    async #recoverCompletedCommands(descriptor, signal) {
        const raw = await this.#request(descriptor, serializeRequest(descriptor, {
            kind: "status",
            session_id: descriptor.session_id,
        }), signal);
        const status = responseSchema.safeParse(raw);
        if (!status.success ||
            !status.data.ok ||
            status.data.session_id !== descriptor.session_id)
            throw new AnalysisOutputError("cutter_command_status", "The bridge status response did not contain a valid session identity.", { cause: status.success ? undefined : status.error });
        if (status.data.completed_connection === undefined)
            throw new AnalysisOutputError("cutter_command_status", "The bridge did not provide authenticated proof that earlier connections reached a terminal state.");
        const pending = this.#pendingAcknowledgements.get(descriptor.session_id) ?? new Set();
        for (const receipt of status.data.completed_commands ?? [])
            pending.add(receipt.request_id);
        if (pending.size > 0)
            this.#pendingAcknowledgements.set(descriptor.session_id, pending);
    }
    async #acknowledgeCompletion(descriptor, requestId) {
        try {
            const raw = await this.#request(descriptor, serializeRequest(descriptor, {
                kind: "ack",
                request_id: requestId,
            }));
            const acknowledged = acknowledgementSchema.safeParse(raw);
            if (!acknowledged.success)
                throw new Error("Cutter did not confirm the completion receipt acknowledgement.");
            const pending = this.#pendingAcknowledgements.get(descriptor.session_id);
            pending?.delete(requestId);
            if (pending?.size === 0)
                this.#pendingAcknowledgements.delete(descriptor.session_id);
            return true;
        }
        catch {
            const pending = this.#pendingAcknowledgements.get(descriptor.session_id) ??
                new Set();
            pending.add(requestId);
            this.#pendingAcknowledgements.set(descriptor.session_id, pending);
            return false;
        }
    }
    async #retryPendingAcknowledgements(descriptor) {
        const pending = this.#pendingAcknowledgements.get(descriptor.session_id);
        if (pending === undefined)
            return;
        for (const requestId of pending) {
            if (!(await this.#acknowledgeCompletion(descriptor, requestId)))
                throw new AnalysisCapabilityUnavailableError("cutter", "cutter_command", "A retained Cutter completion receipt could not be acknowledged; no new command was sent.");
        }
    }
    async #find(sessionId) {
        const loaded = await this.#readDescriptors();
        if (loaded.error === "bridge_directory_capacity_exceeded")
            throw new AnalysisResourceConstraintError("cutter_command", "transport", "Cutter descriptor discovery exceeded its candidate budget; no command was sent.", {
                max_descriptor_candidates: MAX_DESCRIPTOR_CANDIDATES,
                bridge_directory: this.#directory,
            });
        if (loaded.error !== undefined)
            throw new AnalysisCapabilityUnavailableError("cutter", "cutter_command", `Cutter descriptor discovery failed: ${loaded.error}`);
        const descriptor = loaded.descriptors.find((candidate) => candidate.session_id === sessionId);
        if (descriptor === undefined)
            throw new Error("Cutter bridge session is unavailable or stale");
        return descriptor;
    }
    async listDescriptors() {
        const loaded = await this.#readDescriptors();
        return loaded.descriptors;
    }
    async #readDescriptors() {
        let directoryInfo;
        try {
            directoryInfo = await lstat(this.#directory);
        }
        catch (cause) {
            const code = cause.code;
            if (code === "ENOENT")
                return { descriptors: [], security: "not_checked" };
            return {
                descriptors: [],
                security: "not_checked",
                error: "bridge_directory_unavailable",
            };
        }
        if (!directoryInfo.isDirectory() || directoryInfo.isSymbolicLink())
            return {
                descriptors: [],
                security: "not_private",
                error: "bridge_directory_insecure",
            };
        const currentUid = this.#platform !== "win32" ? process.getuid?.() : undefined;
        const posix = currentUid !== undefined;
        if (posix &&
            (directoryInfo.uid !== currentUid || (directoryInfo.mode & 0o077) !== 0))
            return {
                descriptors: [],
                security: "not_private",
                error: "bridge_directory_insecure",
            };
        let security = posix
            ? "private_verified"
            : "unverified_platform_acl";
        const windowsPrivateReader = this.#windowsPrivateReader;
        if (!posix) {
            if (this.#platform !== "win32" || windowsPrivateReader === undefined)
                return {
                    descriptors: [],
                    security,
                    error: "bridge_directory_insecure",
                };
            try {
                if (!windowsPrivateReader.verifyDirectory(this.#directory))
                    return {
                        descriptors: [],
                        security: "not_private",
                        error: "bridge_directory_insecure",
                    };
                security = "private_verified";
            }
            catch {
                return {
                    descriptors: [],
                    security,
                    error: "bridge_directory_insecure",
                };
            }
        }
        const entries = [];
        try {
            const directory = await opendir(this.#directory);
            for await (const entry of directory) {
                if (!/^cutter-\d+-[0-9a-f-]{36}\.json$/iu.test(entry.name))
                    continue;
                if (entries.length === MAX_DESCRIPTOR_CANDIDATES)
                    return {
                        descriptors: [],
                        security,
                        error: "bridge_directory_capacity_exceeded",
                    };
                entries.push(entry.name);
            }
        }
        catch {
            return {
                descriptors: [],
                security: "not_checked",
                error: "bridge_directory_unavailable",
            };
        }
        const loaded = await mapDiscovery(entries, async (entry) => {
            let file;
            try {
                let bytes;
                if (this.#platform === "win32") {
                    bytes = windowsPrivateReader.readDescriptor(this.#directory, entry, MAX_DESCRIPTOR_BYTES);
                }
                else {
                    const flags = fsConstants.O_RDONLY | (fsConstants.O_NOFOLLOW ?? 0);
                    file = await open(join(this.#directory, entry), flags);
                    const info = await file.stat();
                    if (!info.isFile() ||
                        info.size > MAX_DESCRIPTOR_BYTES ||
                        info.uid !== currentUid ||
                        (info.mode & 0o077) !== 0)
                        return undefined;
                    const boundedBytes = await readBoundedFileBytes(file, MAX_DESCRIPTOR_BYTES);
                    if (boundedBytes === undefined)
                        return undefined;
                    bytes = boundedBytes;
                }
                if (bytes.byteLength > MAX_DESCRIPTOR_BYTES)
                    return undefined;
                const parsed = descriptorSchema.safeParse(JSON.parse(bytes.toString("utf8")));
                if (!parsed.success ||
                    entry !== `cutter-${parsed.data.pid}-${parsed.data.session_id}.json`)
                    return undefined;
                return parsed.data;
            }
            catch {
                return undefined;
            }
            finally {
                await file?.close().catch(() => undefined);
            }
        });
        return {
            descriptors: loaded.filter((value) => value !== undefined),
            security,
        };
    }
    #request(descriptor, requestBytes, signal, onAuthenticated) {
        return new Promise((resolve, reject) => {
            const connection = createConnection({
                host: descriptor.host,
                port: descriptor.port,
            });
            const frames = new CutterBridgeResponseFrames();
            let settled = false;
            let requestSent = false;
            let authenticated = false;
            const clientNonce = randomBytes(32).toString("hex");
            let serverNonce = "";
            let connectionOrdinal;
            const finish = (complete) => {
                if (settled)
                    return;
                settled = true;
                clearTimeout(timer);
                signal?.removeEventListener("abort", onAbort);
                complete();
            };
            const rejectRequest = (message) => finish(() => reject(new CutterBridgeRequestFailure(message, requestSent)));
            const timer = setTimeout(() => {
                rejectRequest("Cutter bridge request timed out");
                connection.destroy();
            }, 25_000);
            const onAbort = () => {
                rejectRequest("Cutter bridge request was cancelled");
                connection.destroy();
            };
            signal?.addEventListener("abort", onAbort, { once: true });
            if (signal?.aborted)
                onAbort();
            connection.once("connect", () => {
                connection.write(`${JSON.stringify({ kind: "rea-auth-v2", nonce: clientNonce })}\n`);
            });
            connection.on("data", (chunk) => {
                try {
                    frames.push(chunk, (line) => {
                        const frame = JSON.parse(line.toString("utf8"));
                        if (!authenticated) {
                            const challenge = z
                                .object({
                                session_id: z.string().uuid(),
                                nonce: z.string().regex(/^[0-9a-f]{64}$/),
                                proof: z.string().regex(/^[0-9a-f]{64}$/),
                            })
                                .parse(frame);
                            if (challenge.session_id !== descriptor.session_id)
                                throw new Error("unexpected peer session");
                            serverNonce = challenge.nonce;
                            connectionOrdinal = challenge.nonce.slice(0, 16);
                            const expected = createHmac("sha256", descriptor.token)
                                .update(`rea-cutter-server-v2:${descriptor.session_id}:${clientNonce}:${challenge.nonce}`)
                                .digest();
                            if (!timingSafeEqual(expected, Buffer.from(challenge.proof, "hex")))
                                throw new Error("peer proof failed");
                            onAuthenticated?.(connectionOrdinal);
                            const proof = createHmac("sha256", descriptor.token)
                                .update(`rea-cutter-client-v2:${descriptor.session_id}:${clientNonce}:${challenge.nonce}:${requestBytes}`)
                                .digest("hex");
                            authenticated = true;
                            requestSent = true;
                            connection.write(`${JSON.stringify({ request: requestBytes, proof })}\n`);
                            return true;
                        }
                        else {
                            const envelope = z
                                .object({
                                response: z.string(),
                                proof: z.string().regex(/^[0-9a-f]{64}$/),
                            })
                                .parse(frame);
                            const expected = createHmac("sha256", descriptor.token)
                                .update(`rea-cutter-response-v2:${descriptor.session_id}:${clientNonce}:${serverNonce}:${envelope.response}`)
                                .digest();
                            if (!timingSafeEqual(expected, Buffer.from(envelope.proof, "hex")))
                                throw new Error("response proof failed");
                            const response = JSON.parse(envelope.response);
                            connection.end();
                            finish(() => resolve(response));
                            return false;
                        }
                    });
                }
                catch {
                    rejectRequest("Cutter bridge peer authentication or response failed");
                    connection.destroy();
                }
            });
            connection.once("error", (cause) => rejectRequest(`Cutter bridge is unavailable: ${cause.message}`));
            connection.once("close", () => rejectRequest("Cutter bridge closed before returning a complete response"));
        });
    }
}
