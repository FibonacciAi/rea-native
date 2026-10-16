import { lstat, stat } from "node:fs/promises";
import { RegularFileAdmissionFailure, openRegularFile, sameRegularFileState, RegularFileChangedError, } from "../filesystem/RegularFile.js";
import { OwnedFileHandle } from "../filesystem/OwnedFileHandle.js";
import { readBoundedFileBytes } from "../process/BoundedFileBytes.js";
export class InvalidUtf8FileError extends TypeError {
    path;
    _tag = "InvalidUtf8FileError";
    constructor(path, cause) {
        super(`File is not valid UTF-8: ${path}`, { cause });
        this.path = path;
        this.name = this._tag;
    }
}
/** A close failed after reading; this error transfers the exact handle owner. */
export class RegularFileCleanupFailure extends Error {
    path;
    owner;
    outcome;
    cleanupCause;
    constructor(path, owner, outcome, cleanupCause) {
        super(`Regular file cleanup failed: ${path}`, {
            cause: outcome.kind === "failed" ? outcome.cause : cleanupCause,
        });
        this.path = path;
        this.owner = owner;
        this.outcome = outcome;
        this.cleanupCause = cleanupCause;
        this.name = "RegularFileCleanupFailure";
    }
}
/** Retry a failed close through its retained owner and report any remaining cleanup. */
export const retryRegularFileCleanup = async (failure, resources) => {
    const released = await resources.release({
        kind: "file-handle",
        handle: failure.owner,
        resource: failure.path,
    });
    if (released.kind === "released")
        return { outcome: failure.outcome };
    return {
        outcome: failure.outcome,
        cleanup: {
            reason: `${failureMessage(failure.cleanupCause)}; retry: ${failureMessage(released.cause)}`,
            resources: [failure.path],
        },
    };
};
const failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
/** Admit one regular-file handle, retain it through the consumer, and always close it. */
export const withRegularFile = async (path, read, options = {}) => options.resources === undefined
    ? withRegularFileOwned(path, read, options)
    : options.resources.run(() => withRegularFileOwned(path, read, options));
const withRegularFileOwned = async (path, read, options) => {
    const { signal } = options;
    let handle;
    try {
        handle = await openRegularFile(path, {
            symlinks: options.symlinks ?? "follow",
            signal,
        });
    }
    catch (cause) {
        if (!(cause instanceof RegularFileAdmissionFailure))
            throw cause;
        const failure = new RegularFileCleanupFailure(path, cause.owner, { kind: "failed", cause: cause.cause }, cause.cleanupCause);
        if (options.resources === undefined)
            throw failure;
        const retry = await retryRegularFileCleanup(failure, options.resources);
        if (retry.cleanup !== undefined)
            throw failure;
        throw cause.cause;
    }
    const owner = new OwnedFileHandle(handle);
    let outcome;
    try {
        const stats = await handle.stat();
        signal?.throwIfAborted();
        const value = await read(handle, stats);
        signal?.throwIfAborted();
        const [opened, currentPath] = await Promise.all([
            handle.stat(),
            options.symlinks === "reject" ? lstat(path) : stat(path),
        ]);
        if (!sameRegularFileState(stats, opened) ||
            !sameRegularFileState(stats, currentPath))
            throw new RegularFileChangedError(path);
        outcome = { kind: "completed", value };
    }
    catch (cause) {
        outcome = { kind: "failed", cause };
    }
    try {
        await owner.close();
    }
    catch (cleanupCause) {
        const failure = new RegularFileCleanupFailure(path, owner, outcome, cleanupCause);
        if (options.resources === undefined)
            throw failure;
        const retry = await retryRegularFileCleanup(failure, options.resources);
        if (retry.cleanup !== undefined)
            throw failure;
        if (retry.outcome.kind === "failed")
            throw retry.outcome.cause;
        return retry.outcome.value;
    }
    if (outcome.kind === "failed")
        throw outcome.cause;
    return outcome.value;
};
/** Admit a regular file without waiting for a pipe, then read its verified handle. */
export const readRegularFile = (path, options = {}) => readRegularFileContent(path, (bytes) => bytes, options);
/** Read valid UTF-8 without replacing source bytes or stripping an initial BOM. */
export const readRegularFileText = (path, options = {}) => readRegularFileContent(path, (bytes) => {
    try {
        return new TextDecoder("utf-8", {
            fatal: true,
            ignoreBOM: true,
        }).decode(bytes);
    }
    catch (cause) {
        if (!(cause instanceof TypeError))
            throw cause;
        throw new InvalidUtf8FileError(path, cause);
    }
}, options);
const readRegularFileContent = (path, decode, options) => withRegularFile(path, async (handle, stats) => {
    const bytes = await readBoundedFileBytes(handle, stats.size, options.signal);
    if (bytes === undefined || bytes.length !== stats.size)
        throw new RegularFileChangedError(path);
    return decode(bytes);
}, options);
