import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { OwnedFileHandle, RegularFileAdmissionFailure, RegularFileChangedError, init_OwnedFileHandle, init_RegularFile, openRegularFile, sameRegularFileState } from "./RegularFile-B_6KPCNQ.js";
import { init_BoundedFileBytes, readBoundedFileBytes } from "./BoundedFileBytes-BU30odTm.js";
import { lstat, stat } from "node:fs/promises";

//#region dist/application/RegularFileRead.js
var InvalidUtf8FileError, RegularFileCleanupFailure, retryRegularFileCleanup, failureMessage, withRegularFile, withRegularFileOwned, readRegularFile, readRegularFileText, readRegularFileContent;
function init_RegularFileRead() {
	return (init_RegularFileRead = __esmMin((() => {
		init_RegularFile();
		init_OwnedFileHandle();
		init_BoundedFileBytes();
		InvalidUtf8FileError = class extends TypeError {
			path;
			_tag = "InvalidUtf8FileError";
			constructor(path, cause) {
				super(`File is not valid UTF-8: ${path}`, { cause });
				this.path = path;
				this.name = this._tag;
			}
		};
		RegularFileCleanupFailure = class extends Error {
			path;
			owner;
			outcome;
			cleanupCause;
			constructor(path, owner, outcome, cleanupCause) {
				super(`Regular file cleanup failed: ${path}`, { cause: outcome.kind === "failed" ? outcome.cause : cleanupCause });
				this.path = path;
				this.owner = owner;
				this.outcome = outcome;
				this.cleanupCause = cleanupCause;
				this.name = "RegularFileCleanupFailure";
			}
		};
		retryRegularFileCleanup = async (failure, resources) => {
			const released = await resources.release({
				kind: "file-handle",
				handle: failure.owner,
				resource: failure.path
			});
			if (released.kind === "released") return { outcome: failure.outcome };
			return {
				outcome: failure.outcome,
				cleanup: {
					reason: `${failureMessage(failure.cleanupCause)}; retry: ${failureMessage(released.cause)}`,
					resources: [failure.path]
				}
			};
		};
		failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		withRegularFile = async (path, read, options = {}) => options.resources === undefined ? withRegularFileOwned(path, read, options) : options.resources.run(() => withRegularFileOwned(path, read, options));
		withRegularFileOwned = async (path, read, options) => {
			const { signal } = options;
			let handle;
			try {
				handle = await openRegularFile(path, {
					symlinks: options.symlinks ?? "follow",
					signal
				});
			} catch (cause) {
				if (!(cause instanceof RegularFileAdmissionFailure)) throw cause;
				const failure = new RegularFileCleanupFailure(path, cause.owner, {
					kind: "failed",
					cause: cause.cause
				}, cause.cleanupCause);
				if (options.resources === undefined) throw failure;
				const retry = await retryRegularFileCleanup(failure, options.resources);
				if (retry.cleanup !== undefined) throw failure;
				throw cause.cause;
			}
			const owner = new OwnedFileHandle(handle);
			let outcome;
			try {
				const stats = await handle.stat();
				signal?.throwIfAborted();
				const value = await read(handle, stats);
				signal?.throwIfAborted();
				const [opened, currentPath] = await Promise.all([handle.stat(), options.symlinks === "reject" ? lstat(path) : stat(path)]);
				if (!sameRegularFileState(stats, opened) || !sameRegularFileState(stats, currentPath)) throw new RegularFileChangedError(path);
				outcome = {
					kind: "completed",
					value
				};
			} catch (cause) {
				outcome = {
					kind: "failed",
					cause
				};
			}
			try {
				await owner.close();
			} catch (cleanupCause) {
				const failure = new RegularFileCleanupFailure(path, owner, outcome, cleanupCause);
				if (options.resources === undefined) throw failure;
				const retry = await retryRegularFileCleanup(failure, options.resources);
				if (retry.cleanup !== undefined) throw failure;
				if (retry.outcome.kind === "failed") throw retry.outcome.cause;
				return retry.outcome.value;
			}
			if (outcome.kind === "failed") throw outcome.cause;
			return outcome.value;
		};
		readRegularFile = (path, options = {}) => readRegularFileContent(path, (bytes) => bytes, options);
		readRegularFileText = (path, options = {}) => readRegularFileContent(path, (bytes) => {
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes);
			} catch (cause) {
				if (!(cause instanceof TypeError)) throw cause;
				throw new InvalidUtf8FileError(path, cause);
			}
		}, options);
		readRegularFileContent = (path, decode, options) => withRegularFile(path, async (handle, stats) => {
			const bytes = await readBoundedFileBytes(handle, stats.size, options.signal);
			if (bytes === undefined || bytes.length !== stats.size) throw new RegularFileChangedError(path);
			return decode(bytes);
		}, options);
	})))();
}

//#endregion
export { InvalidUtf8FileError, RegularFileCleanupFailure, init_RegularFileRead, readRegularFile, readRegularFileText, retryRegularFileCleanup, withRegularFile };