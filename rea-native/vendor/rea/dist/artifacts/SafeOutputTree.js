import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { mkdir, open, readdir, realpath, } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { OwnedFileHandle } from "../filesystem/OwnedFileHandle.js";
import { streamChunkToBuffer } from "./StreamBytes.js";
import { ArtifactPathRegistry, destinationCaseCollisionMessage, normalizeArtifactPath, } from "./ArtifactPaths.js";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { SafeOutputTreeCreationFailure } from "./SafeOutputTreeCreationFailure.js";
import { hashOutputFile } from "./SafeOutputTreeReadback.js";
import { removeOwnedTree } from "./SafeOutputTreeCleanup.js";
import { assertHandleIdentity, assertFilePathIdentity, assertPathIdentity, isAbsent, readDirectoryIdentity, readFileIdentity, replacedDirectory, } from "./SafeOutputTreeIdentity.js";
/**
 * Materialize files in a tree created by this operation.
 *
 * Path identities are revalidated around operations, but Node has no portable
 * descriptor-relative traversal; a syscall-boundary pathname race remains.
 */
export class SafeOutputTree {
    platform;
    #registry = new ArtifactPathRegistry();
    #outputRoot;
    #rootIdentity;
    #nestedDirectories = new Map();
    #unknownDirectories = new Set();
    #ownedFiles = new Map();
    #openFiles = new Map();
    #openHandles = new Set();
    #published = false;
    #cleanup = {
        status: "not-required",
    };
    constructor(outputRoot, platform) {
        this.platform = platform;
        this.#outputRoot = outputRoot;
    }
    /**
     * Exclusively create the absent destination as this operation's owned tree.
     *
     * POSIX mode bits and directory `fchmod`/`fsync` have no Windows equivalent:
     * `mkdir` already applies the requested mode, so the redundant handle
     * `chmod` is skipped there to avoid an `EPERM` on the directory descriptor.
     */
    static async create(outputRoot, platform = process.platform) {
        if (!isAbsolute(outputRoot))
            throw new ArtifactReaderFailure("path", "Extraction output root must be absolute");
        const requested = resolve(outputRoot);
        const name = basename(requested);
        if (name === "." || name === "..")
            throw new ArtifactReaderFailure("path", "Invalid extraction output root");
        const parent = await realpath(dirname(requested)).catch((cause) => {
            throw new ArtifactReaderFailure("unavailable", "Extraction output parent is unavailable", { cause });
        });
        const canonicalOutput = join(parent, name);
        await mkdir(canonicalOutput, { mode: 0o700 }).catch((cause) => {
            if (isAlreadyExists(cause))
                throw new ArtifactReaderFailure("path", "Extraction output root already exists", { cause });
            throw cause;
        });
        const tree = new SafeOutputTree(canonicalOutput, platform);
        try {
            const rootIdentity = await readDirectoryIdentity(canonicalOutput);
            tree.#rootIdentity = rootIdentity;
            if (platform !== "win32") {
                const stagingHandle = tree.#trackHandle(await open(canonicalOutput, constants.O_RDONLY | constants.O_DIRECTORY));
                let setup = { kind: "ready" };
                try {
                    await assertHandleIdentity(stagingHandle.handle, rootIdentity, canonicalOutput);
                    await stagingHandle.handle.chmod(0o700);
                }
                catch (cause) {
                    setup = { kind: "failed", cause };
                }
                try {
                    await tree.#closeHandle(stagingHandle);
                }
                catch (closeCause) {
                    if (setup.kind === "failed")
                        throw ArtifactReaderFailure.withCleanup(setup.cause, ArtifactReaderFailure.cleanupObservation(closeCause, canonicalOutput));
                    throw closeCause;
                }
                if (setup.kind === "failed")
                    throw setup.cause;
            }
            await assertPathIdentity(canonicalOutput, rootIdentity);
            return tree;
        }
        catch (cause) {
            throw new SafeOutputTreeCreationFailure(cause, tree);
        }
    }
    get outputRoot() {
        return this.#outputRoot;
    }
    /** The output was durably committed, even if descriptor cleanup later failed. */
    get published() {
        return this.#published;
    }
    get cleanup() {
        return structuredClone(this.#cleanup);
    }
    /** Stream one regular file with exact byte and digest verification. */
    async write(relativePath, source, expected, signal) {
        try {
            this.#assertWritable();
            if (!Number.isSafeInteger(expected.bytes) || expected.bytes < 0)
                throw new ArtifactReaderFailure("format", `Invalid expected extraction size for ${relativePath}`);
            const path = normalizeDestinationPath(relativePath, this.platform);
            this.#registry.add(path, "file");
            const lineage = await this.#prepareParent(path);
            const parent = lineage.at(-1);
            if (parent === undefined)
                throw replacedDirectory(this.#outputRoot);
            const fileName = path.slice(path.lastIndexOf("/") + 1);
            const destination = join(parent.path, fileName);
            const handle = await open(destination, constants.O_CREAT |
                constants.O_EXCL |
                constants.O_WRONLY |
                constants.O_NOFOLLOW, 0o600).catch(async (cause) => {
                await throwIfDestinationCaseCollision(parent.path, path, cause);
                throw new ArtifactReaderFailure("path", `Could not exclusively create extraction path: ${path}`, { cause });
            });
            const ownedHandle = this.#trackHandle(handle);
            this.#openFiles.set(destination, ownedHandle);
            const fileIdentity = await readFileIdentity(ownedHandle.handle, destination);
            await assertFilePathIdentity(destination, fileIdentity);
            this.#ownedFiles.set(destination, fileIdentity);
            const hash = createHash("sha256");
            let bytes = 0;
            await this.#assertLineage(lineage);
            for await (const raw of source) {
                abortIfNeeded(signal);
                const chunk = streamChunkToBuffer(raw);
                if (chunk.length > expected.bytes - bytes)
                    throw new ArtifactReaderFailure("integrity", `Extracted content exceeds the inventoried size: ${path}`);
                bytes += chunk.length;
                hash.update(chunk);
                await writeAll(ownedHandle.handle, chunk);
            }
            if (bytes !== expected.bytes)
                throw new ArtifactReaderFailure("integrity", `Extracted content size disagrees with inventory: ${path}`);
            const sha256 = hash.digest("hex");
            if (sha256 !== expected.sha256)
                throw new ArtifactReaderFailure("integrity", `Extracted content disagrees with inventory: ${path}`);
            await this.#assertLineage(lineage);
            await assertFilePathIdentity(destination, fileIdentity);
            await ownedHandle.handle.sync();
            await this.#closeFileHandle(destination, ownedHandle);
            const readbackHandle = this.#trackHandle(await open(destination, constants.O_RDONLY | constants.O_NOFOLLOW));
            const readback = await hashOutputFile(readbackHandle, destination, fileIdentity, { maximum: bytes, signal });
            await this.#closeHandle(readbackHandle);
            await this.#assertLineage(lineage);
            await assertFilePathIdentity(destination, fileIdentity);
            if (readback.sha256 !== sha256 || readback.bytes !== bytes)
                throw new ArtifactReaderFailure("integrity", `Durable readback verification failed: ${path}`);
            return { relativePath: path, sha256, bytesWritten: bytes };
        }
        catch (cause) {
            try {
                source.destroy();
            }
            catch {
                // Preserve the write refusal or failure as the caller-visible error.
            }
            throw cause;
        }
    }
    /** Sync the owned output tree and prevent further writes through this instance. */
    async commit(signal) {
        this.#assertWritable();
        abortIfNeeded(signal);
        await this.#assertOwnedDirectories();
        abortIfNeeded(signal);
        // Windows has no directory fsync; file contents are already synced in write().
        if (this.platform === "win32") {
            this.#published = true;
            return;
        }
        const parent = this.#trackHandle(await open(dirname(this.#outputRoot), constants.O_RDONLY | constants.O_DIRECTORY));
        let output;
        let sync = { kind: "synced" };
        try {
            output = this.#trackHandle(await open(this.#outputRoot, constants.O_RDONLY | constants.O_DIRECTORY));
            await assertHandleIdentity(output.handle, this.#requireRootIdentity(), this.#outputRoot);
            await output.handle.sync();
            await parent.handle.sync();
            abortIfNeeded(signal);
            this.#published = true;
        }
        catch (cause) {
            sync = { kind: "failed", cause };
        }
        const closeResults = await Promise.allSettled([parent, output]
            .filter(isDefined)
            .map((handle) => this.#closeHandle(handle)));
        const closeFailures = closeResults
            .filter(isRejected)
            .map(({ reason }) => reason);
        if (closeFailures.length > 0) {
            const closeFailure = new AggregateError(closeFailures, "Extraction output directory handles could not be closed");
            const cleanup = ArtifactReaderFailure.cleanupObservation(closeFailure, this.#outputRoot);
            if (sync.kind === "failed") {
                const primary = isCancellationFailure(sync.cause)
                    ? sync.cause
                    : new ArtifactReaderFailure("path", "Could not durably sync extraction output", { cause: sync.cause });
                throw ArtifactReaderFailure.withCleanup(primary, cleanup);
            }
            throw ArtifactReaderFailure.withCleanup(closeFailure, cleanup);
        }
        if (sync.kind === "failed") {
            if (isCancellationFailure(sync.cause))
                throw sync.cause;
            throw new ArtifactReaderFailure("path", "Could not durably sync extraction output", { cause: sync.cause });
        }
    }
    /** Remove only this operation's unsealed tree and verify absence. */
    async rollback() {
        if (this.#published) {
            await this.#closePendingHandles();
            return structuredClone(this.#cleanup);
        }
        if (this.#cleanup.status === "complete")
            return structuredClone(this.#cleanup);
        this.#cleanup = {
            status: "incomplete",
            residualPaths: [basename(this.#outputRoot)],
        };
        let removalFailure;
        try {
            await this.#admitPendingFiles();
            await this.#closePendingHandles();
            await this.#assertOwnedDirectories();
            await removeOwnedTree({
                outputRoot: this.#outputRoot,
                rootIdentity: this.#requireRootIdentity(),
                directories: this.#nestedDirectories,
                files: this.#ownedFiles,
            });
        }
        catch (cause) {
            removalFailure = cause;
        }
        const absent = removalFailure === undefined && (await isAbsent(this.#outputRoot));
        this.#cleanup = absent
            ? { status: "complete", residualPaths: [] }
            : {
                status: "incomplete",
                residualPaths: [basename(this.#outputRoot)],
            };
        if (!absent)
            throw new ArtifactReaderFailure("integrity", `Extraction output cleanup could not be verified${removalFailure === undefined ? "" : `: ${removalFailure instanceof Error ? removalFailure.message : String(removalFailure)}`}`, {
                cause: removalFailure,
                cleanup: {
                    reason: removalFailure instanceof Error
                        ? removalFailure.message
                        : "Extraction output root remains after rollback",
                    resources: [this.#outputRoot],
                },
            });
        return structuredClone(this.#cleanup);
    }
    async #prepareParent(relativePath) {
        const parts = relativePath.split("/");
        if (parts.pop() === undefined)
            throw new ArtifactReaderFailure("path", "Invalid extraction path");
        let current = this.#outputRoot;
        let logicalParent = "";
        const lineage = [
            { path: this.#outputRoot, identity: this.#requireRootIdentity() },
        ];
        if (parts.length === 0)
            await assertPathIdentity(this.#outputRoot, this.#requireRootIdentity());
        for (const part of parts) {
            const parent = lineage.at(-1);
            if (parent === undefined)
                throw replacedDirectory(this.#outputRoot);
            const logicalPath = logicalParent.length === 0 ? part : `${logicalParent}/${part}`;
            current = join(current, part);
            await assertPathIdentity(parent.path, parent.identity);
            let created = true;
            await mkdir(current, { mode: 0o700 }).catch((cause) => {
                if (!isAlreadyExists(cause))
                    throw cause;
                created = false;
            });
            if (!created) {
                await throwIfDestinationCaseCollision(parent.path, logicalPath);
                const identity = this.#nestedDirectories.get(current);
                if (identity === undefined)
                    throw replacedDirectory(current);
                await assertPathIdentity(current, identity);
            }
            else {
                try {
                    const identity = await readDirectoryIdentity(current);
                    this.#nestedDirectories.set(current, identity);
                }
                catch (cause) {
                    this.#unknownDirectories.add(current);
                    throw cause;
                }
            }
            await assertPathIdentity(parent.path, parent.identity);
            const identity = this.#nestedDirectories.get(current);
            if (identity === undefined)
                throw replacedDirectory(current);
            await assertPathIdentity(current, identity);
            lineage.push({ path: current, identity });
            logicalParent = logicalPath;
        }
        return lineage;
    }
    async #assertLineage(lineage) {
        for (const { path, identity } of lineage)
            await assertPathIdentity(path, identity);
    }
    async #assertOwnedDirectories() {
        const rootIdentity = this.#requireRootIdentity();
        await assertPathIdentity(this.#outputRoot, rootIdentity);
        for (const [path, identity] of this.#nestedDirectories)
            await assertPathIdentity(path, identity);
        if (this.#unknownDirectories.size > 0)
            throw new ArtifactReaderFailure("path", `Extraction directory ownership is unknown: ${[...this.#unknownDirectories].join(", ")}`);
    }
    #requireRootIdentity() {
        if (this.#rootIdentity === undefined)
            throw new ArtifactReaderFailure("path", `Extraction output root identity is unknown: ${this.#outputRoot}`);
        return this.#rootIdentity;
    }
    #assertWritable() {
        if (this.#published)
            throw new ArtifactReaderFailure("integrity", "Extraction tree is already committed");
        if (this.#cleanup.status !== "not-required")
            throw new ArtifactReaderFailure("integrity", "Extraction tree cleanup has already started");
    }
    #trackHandle(handle) {
        const owner = new OwnedFileHandle(handle);
        this.#openHandles.add(owner);
        return owner;
    }
    async #closeHandle(owner) {
        await owner.close();
        this.#openHandles.delete(owner);
    }
    async #closePendingHandles() {
        const failures = [];
        for (const owner of this.#openHandles) {
            try {
                await this.#closeHandle(owner);
            }
            catch (cause) {
                failures.push(cause);
            }
        }
        if (failures.length > 0)
            throw new AggregateError(failures, "Output tree handles remain open");
    }
    async #closeFileHandle(path, owner) {
        await this.#closeHandle(owner);
        this.#openFiles.delete(path);
    }
    async #admitPendingFiles() {
        for (const [path, owner] of this.#openFiles) {
            let identity = this.#ownedFiles.get(path);
            if (identity === undefined) {
                identity = await readFileIdentity(owner.handle, path);
                await assertFilePathIdentity(path, identity);
                this.#ownedFiles.set(path, identity);
            }
        }
    }
}
const isDefined = (value) => value !== undefined;
const isRejected = (result) => result.status === "rejected";
const writeAll = async (handle, chunk) => {
    let offset = 0;
    while (offset < chunk.length) {
        const { bytesWritten } = await handle.write(chunk, offset, chunk.length - offset);
        if (bytesWritten === 0)
            throw new ArtifactReaderFailure("unavailable", "Extraction output stopped accepting bytes");
        offset += bytesWritten;
    }
};
const normalizeDestinationPath = (relativePath, platform) => {
    const path = normalizeArtifactPath(relativePath);
    if (platform === "win32" && path.includes("\\"))
        throw new ArtifactReaderFailure("path", `Windows destination cannot materialize artifact path: ${JSON.stringify(path)}; backslashes denote path separators.`);
    if (platform === "win32" && path.includes(":"))
        throw new ArtifactReaderFailure("path", `Windows destination cannot materialize artifact path as a regular file: ${path}; ':' denotes alternate data stream syntax.`);
    if (platform === "win32" && /[\u0001-\u001f]/u.test(path))
        throw new ArtifactReaderFailure("path", `Windows destination cannot materialize artifact path: ${JSON.stringify(path)}; Windows names cannot contain U+0001-U+001F.`);
    return path;
};
const abortIfNeeded = (signal) => {
    if (signal?.aborted === true)
        throw new ArtifactReaderFailure("cancelled", "Artifact extraction cancelled");
};
const isCancellationFailure = (cause) => cause instanceof ArtifactReaderFailure && cause.reason === "cancelled";
const isAlreadyExists = (cause) => cause instanceof Error && "code" in cause && cause.code === "EEXIST";
/** Fail when this directory already holds another spelling of the requested segment. */
const throwIfDestinationCaseCollision = async (parentDirectory, logicalPath, cause) => {
    const names = await readdir(parentDirectory).catch(() => undefined);
    if (names === undefined)
        return;
    const message = destinationCaseCollisionMessage(logicalPath, names);
    if (message === undefined)
        return;
    throw new ArtifactReaderFailure("path", message, cause === undefined ? undefined : { cause });
};
