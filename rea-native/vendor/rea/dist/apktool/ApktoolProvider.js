import { createHash, randomUUID } from "node:crypto";
import { createWriteStream } from "node:fs";
import { access, chmod, mkdir, mkdtemp, opendir, open, rm, stat, } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { providerConfigurationRefusal } from "../domain/providerConfigurationRefusal.js";
import { createAnalysisExecution, } from "../application/AnalysisProvider.js";
import { androidLocaleQualifierSchema, } from "../domain/apktool/apktoolResourceAnalysis.js";
import { AnalysisCapabilityUnavailableError, AnalysisCancelledError, AnalysisInputError, AnalysisProtocolError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, } from "../domain/analysisErrorCore.js";
import { analysisErrorWithCleanupFailure } from "../domain/analysisErrorCleanup.js";
import { err, ok } from "../domain/result.js";
import { ProviderCleanupError } from "../domain/providerCleanupError.js";
import { openRegularFile, sameRegularFileState, } from "../filesystem/RegularFile.js";
import { OwnedCommandFailure, runOwnedCommand, } from "../process/OwnedCommand.js";
import { snapshotEnvironment } from "../process/snapshotEnvironment.js";
import { WindowsBatchCommandError } from "../process/WindowsBatchCommand.js";
import { APKTOOL_COMMAND_ENV, ApktoolConfigurationFailure, apktoolConfigurationAvailability, apktoolInvocation, inspectApktoolClient, resolveApktoolCommand, } from "./ApktoolConfiguration.js";
import { parseApktoolYml, parseDecodedStrings, parseManifestPackage, } from "./ApktoolDecodeOutput.js";
/** Stable identity for the Apktool resource-decoding provider. */
export const APKTOOL_PROVIDER_IDENTITY = {
    id: "apktool",
    name: "Apktool",
    version: null,
};
const DECODE_TIMEOUT_MS = 600_000;
const DECODE_MAX_OUTPUT_BYTES = 4 * 1024 * 1024;
const MANIFEST_MAX_BYTES = 512 * 1024;
const STRINGS_XML_MAX_BYTES = 8 * 1024 * 1024;
const MAX_STRINGS = 2_000;
const MAX_DECODED_ENTRIES_VISITED = 100_000;
const STDERR_EXCERPT_BYTES = 512;
const throwIfCancelled = (operation, signal) => {
    if (signal?.aborted === true)
        throw new AnalysisCancelledError(operation);
};
/** Read at most the byte budget plus one byte, before decoding UTF-8. */
const readBoundedText = async (path, budget, operation, signal) => {
    const file = await open(path, "r").catch((cause) => {
        if (cause.code === "ENOENT")
            return null;
        throw cause;
    });
    if (file === null)
        return { text: null, truncated: false };
    try {
        throwIfCancelled(operation, signal);
        const bytes = Buffer.alloc(budget + 1);
        let length = 0;
        while (length < bytes.length) {
            throwIfCancelled(operation, signal);
            const result = await file.read(bytes, length, bytes.length - length, null);
            if (result.bytesRead === 0)
                break;
            length += result.bytesRead;
        }
        throwIfCancelled(operation, signal);
        const truncated = length > budget;
        // A prefix may end within a UTF-8 character; omit those trailing bytes.
        try {
            const decoder = new TextDecoder("utf-8", { fatal: true });
            return {
                text: decoder.decode(bytes.subarray(0, Math.min(length, budget)), {
                    stream: truncated,
                }),
                truncated,
            };
        }
        catch (cause) {
            throw new AnalysisProtocolError(`apktool produced invalid UTF-8 in ${path}`, { cause });
        }
    }
    finally {
        await file.close();
    }
};
const localeQualifier = (locale) => locale.replace(/^([a-z]{2,3})-([A-Z]{2}|[0-9]{3})$/u, "$1-r$2");
const runApktool = async (operation, selection, arguments_, limits, signal, environment, onCleanupOwner) => {
    if (signal?.aborted === true)
        return err(new AnalysisCancelledError(operation));
    let invocation;
    try {
        invocation = apktoolInvocation(selection, arguments_, environment);
    }
    catch (cause) {
        if (!(cause instanceof WindowsBatchCommandError))
            throw cause;
        const reason = `The apktool batch launcher cannot receive REA's decode paths through cmd.exe: ${cause.message}`;
        return err(new AnalysisCapabilityUnavailableError(APKTOOL_PROVIDER_IDENTITY.id, operation, reason, { cause, userMessage: reason }));
    }
    try {
        const output = await runOwnedCommand({
            command: invocation.command,
            arguments: invocation.arguments,
            windowsVerbatimArguments: invocation.windowsVerbatimArguments,
            runId: randomUUID(),
            hostEnvironment: environment,
        }, {
            timeoutMs: limits.timeoutMs,
            diagnosticBytes: limits.maxOutputBytes,
        }, signal === undefined ? {} : { signal });
        return ok({ stdout: output.stdout.text, stderr: output.stderr.text });
    }
    catch (cause) {
        if (!(cause instanceof OwnedCommandFailure))
            return err(new AnalysisProtocolError(`apktool failed for ${operation}`, { cause }));
        if (cause.cleanupOwner !== undefined)
            onCleanupOwner(cause.cleanupOwner);
        const output = cause.snapshot;
        const capturedOutput = output === null
            ? undefined
            : {
                stdout: output.stdout.text,
                stderr: output.stderr.text,
                truncated: output.diagnosticTruncated === true,
                stdout_bytes: output.stdout.bytes,
                stderr_bytes: output.stderr.bytes,
                exit_code: output.exitCode ?? null,
                signal: output.signal ?? null,
            };
        const cleanup = cause.cleanupFailure === null
            ? undefined
            : {
                reason: cause.cleanupFailure,
                resources: cause.resources,
            };
        if (cause.reason === "cancelled")
            return err(new AnalysisCancelledError(operation, {
                cause,
                ...(cleanup === undefined ? {} : { cleanup }),
                ...(capturedOutput === undefined ? {} : { capturedOutput }),
            }));
        if (cause.reason === "timeout")
            return err(new AnalysisTimeoutError(operation, limits.timeoutMs, {
                cause,
                ...(cleanup === undefined ? {} : { cleanup }),
                ...(capturedOutput === undefined ? {} : { capturedOutput }),
            }));
        if (cause.reason === "output-limit")
            return err(new AnalysisResourceConstraintError(operation, "memory", `apktool output exceeded the ${String(limits.maxOutputBytes)}-byte capture budget`, { max_output_bytes: limits.maxOutputBytes }, {
                cause,
                ...(cleanup === undefined ? {} : { cleanup }),
                ...(capturedOutput === undefined ? {} : { capturedOutput }),
            }));
        return err(new AnalysisUnsupportedTargetError(operation, selection.command, output?.stderr.text.trim().slice(0, STDERR_EXCERPT_BYTES) ||
            `apktool exited with code ${String(output?.exitCode ?? "unknown")} for ${operation}`, {
            cause,
            ...(cleanup === undefined ? {} : { cleanup }),
            ...(capturedOutput === undefined ? {} : { capturedOutput }),
        }));
    }
};
/** Count files while bounding streamed directory-entry traversal. */
const countDecodedFiles = async (root, signal, operation) => {
    let count = 0;
    let capped = false;
    let visited = 0;
    const directories = [root];
    const locales = [];
    while (directories.length > 0 && !capped) {
        throwIfCancelled(operation, signal);
        const directory = directories.pop();
        for await (const entry of await opendir(directory)) {
            throwIfCancelled(operation, signal);
            if (visited >= MAX_DECODED_ENTRIES_VISITED) {
                capped = true;
                break;
            }
            visited += 1;
            const path = join(directory, entry.name);
            if (entry.isDirectory()) {
                directories.push(path);
                if (directory === join(root, "res")) {
                    const match = /^values-(.+)$/u.exec(entry.name);
                    if (match !== null &&
                        androidLocaleQualifierSchema.safeParse(match[1]).success &&
                        (await access(join(path, "strings.xml")).then(() => true, () => false)))
                        locales.push(match[1]);
                }
            }
            else if (entry.isFile())
                count += 1;
        }
    }
    return { count, capped, locales: locales.sort() };
};
/**
 * Apktool resource decoding over a caller-selected launcher.
 *
 * Decoding happens in a provider-owned temporary workspace that is removed
 * once the requested facts are projected; smali production is skipped
 * (`--no-src`) because Java-source recovery belongs to the JADX family.
 */
export class ApktoolProvider {
    selectedEnvironment;
    workspaces = new Set();
    removeWorkspace;
    #pendingCommandOwners = new Map();
    #shutdown = new AbortController();
    #active = new Set();
    #closing = false;
    #closePromise;
    constructor(options = {}) {
        this.selectedEnvironment =
            options.environment === undefined
                ? undefined
                : snapshotEnvironment(options.environment);
        this.removeWorkspace =
            options.removeWorkspace ??
                ((path) => rm(path, { recursive: true, force: true }));
    }
    operationEnvironment() {
        const ambient = snapshotEnvironment(process.env);
        if (this.selectedEnvironment === undefined)
            return ambient;
        // Child inheritance is sampled per operation. An explicit map keeps its
        // launcher choice authoritative, including an omitted command selecting PATH.
        return snapshotEnvironment({
            ...ambient,
            ...this.selectedEnvironment,
            [APKTOOL_COMMAND_ENV]: this.selectedEnvironment[APKTOOL_COMMAND_ENV],
        });
    }
    /** Probe the selected apktool launcher; decodes nothing. */
    inspectAvailability(signal) {
        if (this.#closing)
            return Promise.reject(new AnalysisCancelledError("inspect_apktool_client"));
        const operationSignal = signal === undefined
            ? this.#shutdown.signal
            : AbortSignal.any([signal, this.#shutdown.signal]);
        return this.#track(this.#inspectAvailability(operationSignal));
    }
    async #inspectAvailability(signal) {
        const environment = this.operationEnvironment();
        try {
            const selection = await resolveApktoolCommand(environment, process.platform, signal);
            await inspectApktoolClient(selection, signal, environment);
            throwIfCancelled("inspect_apktool_client", signal);
            return {
                status: "available",
                code: null,
                reason: null,
                diagnostics: {
                    selected_command: selection.command,
                    command_source: selection.commandSource,
                },
            };
        }
        catch (cause) {
            if (cause instanceof ApktoolConfigurationFailure)
                return apktoolConfigurationAvailability(cause);
            throw cause;
        }
    }
    /** Retain failed cleanup ownership and retry it on close. */
    async close() {
        this.#closing = true;
        this.#shutdown.abort();
        this.#closePromise ??= this.#drainAndClean().catch((cause) => {
            this.#closePromise = undefined;
            throw cause;
        });
        return this.#closePromise;
    }
    execute(request, options) {
        if (this.#closing)
            return Promise.resolve(err(new AnalysisCancelledError(request.operation)));
        const signal = options?.signal === undefined
            ? this.#shutdown.signal
            : AbortSignal.any([options.signal, this.#shutdown.signal]);
        return this.#track(this.#execute(request, signal));
    }
    async #execute(request, signal) {
        if (signal?.aborted === true)
            return err(new AnalysisCancelledError(request.operation));
        const environment = this.operationEnvironment();
        let selection;
        let identity;
        try {
            selection = await resolveApktoolCommand(environment, process.platform, signal);
            identity = await inspectApktoolClient(selection, signal, environment);
        }
        catch (cause) {
            if (cause instanceof AnalysisCancelledError ||
                cause instanceof AnalysisTimeoutError)
                return err(cause);
            if (cause instanceof ApktoolConfigurationFailure) {
                return err(providerConfigurationRefusal(APKTOOL_PROVIDER_IDENTITY.id, request.operation, cause));
            }
            return err(new AnalysisProtocolError(`apktool version probe failed for ${request.operation}`, { cause }));
        }
        if (signal.aborted)
            return err(new AnalysisCancelledError(request.operation));
        const client = {
            command: selection.command,
            command_source: selection.commandSource,
            apktool_version: identity.version,
        };
        const provider = {
            ...APKTOOL_PROVIDER_IDENTITY,
            version: identity.version,
        };
        if (request.operation === "inspect_apktool_client")
            return ok(createAnalysisExecution({ client }, provider));
        return this.decodeResources(request.operation, selection, environment, client, provider, request.input, signal);
    }
    #track(operation) {
        const settled = operation.then(() => undefined, () => undefined);
        this.#active.add(settled);
        void settled.then(() => this.#active.delete(settled));
        return operation;
    }
    async #drainAndClean() {
        await Promise.all(this.#active);
        const failures = [];
        for (const [owner, root] of this.#pendingCommandOwners) {
            try {
                const stopped = await owner.stop();
                if (stopped.status === "incomplete")
                    throw new Error(stopped.reason);
                this.#pendingCommandOwners.delete(owner);
            }
            catch (cause) {
                failures.push(new Error(`apktool process cleanup remains incomplete for ${root}: ${cause instanceof Error ? cause.message : String(cause)}`, { cause }));
            }
        }
        if (failures.length > 0)
            throw new AggregateError(failures, "Apktool process cleanup failed");
        for (const path of this.workspaces) {
            try {
                await this.removeWorkspace(path);
                this.workspaces.delete(path);
            }
            catch (cause) {
                failures.push(cause);
            }
        }
        if (failures.length > 0)
            throw new AggregateError(failures, "Apktool workspace cleanup failed");
    }
    async decodeResources(operation, selection, environment, client, provider, input, signal) {
        const root = await mkdtemp(join(tmpdir(), "rea-apktool-"));
        this.workspaces.add(root);
        const workspace = join(root, "decoded");
        const snapshot = join(root, "input.apk");
        const framework = join(root, "framework");
        let cleanupFailure = null;
        // The workspace is removed before the result is returned, so an
        // unremovable workspace is reported instead of silently abandoned.
        const removeWorkspace = async () => {
            if ([...this.#pendingCommandOwners.values()].includes(root)) {
                cleanupFailure = `The decode workspace is retained until its apktool process stops: ${root}`;
                return;
            }
            try {
                await this.removeWorkspace(root);
                this.workspaces.delete(root);
            }
            catch {
                cleanupFailure = `The decode workspace could not be removed: ${root}`;
            }
        };
        const failureWithCleanup = (failure) => cleanupFailure === null
            ? failure
            : analysisErrorWithCleanupFailure(failure, new ProviderCleanupError(APKTOOL_PROVIDER_IDENTITY.id, [root], { reason: cleanupFailure }, { operation }), operation);
        let source;
        let sourceAdmissionFailed = false;
        try {
            throwIfCancelled(operation, signal);
            sourceAdmissionFailed = true;
            source = await openRegularFile(input.path, {
                symlinks: "follow",
                ...(signal === undefined ? {} : { signal }),
            });
            const sourceInfo = await source.stat();
            sourceAdmissionFailed = false;
            const sourceSize = sourceInfo.size;
            let copiedBytes = 0;
            const sourceHash = createHash("sha256");
            const boundedSource = new Transform({
                transform(chunk, _encoding, callback) {
                    copiedBytes += chunk.length;
                    if (copiedBytes > sourceSize) {
                        callback(new AnalysisInputError(operation, {
                            cause: new Error(`The selected APK changed while being copied: ${input.path}`),
                        }));
                        return;
                    }
                    sourceHash.update(chunk);
                    callback(null, chunk);
                },
            });
            await pipeline(source.createReadStream({
                start: 0,
                end: sourceSize,
                autoClose: false,
                ...(signal === undefined ? {} : { signal }),
            }), boundedSource, createWriteStream(snapshot, { flags: "wx", mode: 0o600 }), signal === undefined ? {} : { signal });
            const finalSourceInfo = await source.stat();
            if (copiedBytes !== sourceSize ||
                !sameRegularFileState(sourceInfo, finalSourceInfo))
                throw new AnalysisInputError(operation, {
                    cause: new Error(`The selected APK changed while being copied: ${input.path}`),
                });
            const sha256 = sourceHash.digest("hex");
            await source.close();
            source = undefined;
            await chmod(snapshot, 0o400);
            throwIfCancelled(operation, signal);
            const snapshotInfo = await stat(snapshot);
            await mkdir(workspace);
            await mkdir(framework);
            const decoded = await runApktool(operation, selection, [
                "d",
                "--no-src",
                "-f",
                "-o",
                workspace,
                "--frame-path",
                framework,
                snapshot,
            ], {
                timeoutMs: DECODE_TIMEOUT_MS,
                maxOutputBytes: DECODE_MAX_OUTPUT_BYTES,
            }, signal, environment, (owner) => this.#pendingCommandOwners.set(owner, root));
            if (!decoded.ok) {
                await removeWorkspace();
                return err(failureWithCleanup(decoded.error));
            }
            throwIfCancelled(operation, signal);
            const yml = await readBoundedText(join(workspace, "apktool.yml"), MANIFEST_MAX_BYTES, operation, signal);
            if (yml.text === null || yml.truncated) {
                throw new AnalysisProtocolError(`apktool produced missing or oversized apktool.yml: ${input.path}`);
            }
            const metadata = parseApktoolYml(yml.text);
            const manifestRead = await readBoundedText(join(workspace, "AndroidManifest.xml"), MANIFEST_MAX_BYTES, operation, signal);
            const manifest = manifestRead.text;
            const packageName = manifest === null || manifestRead.truncated
                ? null
                : parseManifestPackage(manifest);
            const stringsDirectory = input.locale === undefined
                ? "values"
                : `values-${localeQualifier(input.locale)}`;
            const stringsRead = input.include_strings
                ? await readBoundedText(join(workspace, "res", stringsDirectory, "strings.xml"), STRINGS_XML_MAX_BYTES, operation, signal)
                : { text: null, truncated: false };
            // Do not parse an incomplete XML document as though its projection were complete.
            const stringsXml = stringsRead.truncated ? null : stringsRead.text;
            const parsedStrings = stringsXml === null
                ? { entries: [], unparsedCount: 0 }
                : parseDecodedStrings(stringsXml);
            const bounded = parsedStrings.entries.slice(0, MAX_STRINGS);
            const files = await countDecodedFiles(workspace, signal, operation);
            throwIfCancelled(operation, signal);
            const coverage = (stringsXml !== null && parsedStrings.entries.length > MAX_STRINGS) ||
                manifestRead.truncated ||
                stringsRead.truncated ||
                parsedStrings.unparsedCount > 0 ||
                files.capped
                ? "partial"
                : "complete";
            await removeWorkspace();
            return ok(createAnalysisExecution({
                client,
                target: { path: input.path, bytes: snapshotInfo.size, sha256 },
                metadata: {
                    version_name: metadata.versionName,
                    version_code: metadata.versionCode,
                    min_sdk_version: metadata.minSdkVersion,
                    target_sdk_version: metadata.targetSdkVersion,
                    package_name: packageName,
                },
                manifest,
                strings: bounded,
                locale: input.locale ?? null,
                locales: files.locales,
                decoded_file_count: files.count,
                coverage,
            }, provider, {
                limitations: [
                    "Decoding skips smali (--no-src); Java-source recovery belongs to the JADX family",
                    ...(input.locale !== undefined &&
                        stringsRead.text === null &&
                        input.include_strings
                        ? [`No strings.xml was found for locale ${input.locale}`]
                        : []),
                    ...(input.include_strings &&
                        stringsRead.text === null &&
                        input.locale === undefined
                        ? [
                            "No default res/values/strings.xml was found in the decoded workspace",
                        ]
                        : []),
                    ...(parsedStrings.unparsedCount > 0
                        ? [
                            `String entries omitted due to malformed XML or unsupported markup: ${String(parsedStrings.unparsedCount)}`,
                        ]
                        : []),
                    ...(parsedStrings.entries.length > MAX_STRINGS
                        ? [
                            `strings reports the first ${String(MAX_STRINGS)} of ${String(parsedStrings.entries.length)} entries`,
                        ]
                        : []),
                    ...(manifestRead.truncated
                        ? [
                            `manifest is truncated at ${String(MANIFEST_MAX_BYTES)} bytes`,
                        ]
                        : []),
                    ...(stringsRead.truncated
                        ? [
                            `strings.xml exceeds the ${String(STRINGS_XML_MAX_BYTES)}-byte projection budget`,
                        ]
                        : []),
                    ...(files.capped
                        ? [
                            `Decoded workspace enumeration stopped after ${String(MAX_DECODED_ENTRIES_VISITED)} entries; decoded_file_count and locales may be partial`,
                        ]
                        : []),
                    ...(cleanupFailure === null ? [] : [cleanupFailure]),
                ],
            }));
        }
        catch (cause) {
            await removeWorkspace();
            return err(failureWithCleanup(signal?.aborted === true
                ? new AnalysisCancelledError(operation, { cause })
                : sourceAdmissionFailed
                    ? new AnalysisInputError(operation, { cause })
                    : cause instanceof AnalysisInputError
                        ? cause
                        : cause instanceof AnalysisCancelledError ||
                            cause instanceof AnalysisProtocolError
                            ? cause
                            : new AnalysisProtocolError("Apktool resource projection failed", {
                                cause,
                            })));
        }
        finally {
            await source?.close().catch(() => undefined);
        }
    }
}
