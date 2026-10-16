import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { lstat, open, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { constants as constants$1 } from "node:os";

//#region dist/filesystem/OwnedFileHandle.js
var OwnedFileHandle;
function init_OwnedFileHandle() {
	return (init_OwnedFileHandle = __esmMin((() => {
		OwnedFileHandle = class {
			handle;
			#state = { kind: "open" };
			constructor(handle) {
				this.handle = handle;
			}
			/** Close the owned handle, retaining an unconfirmed close as a sticky failure. */
			close() {
				if (this.#state.kind === "closed") return Promise.resolve();
				if (this.#state.kind === "closing") return this.#state.attempt;
				if (this.#state.kind === "failed") return Promise.reject(this.#state.cause);
				if (this.handle.fd < 0) {
					const cause = new Error("File handle was invalidated before this owner confirmed its close");
					this.#state = {
						kind: "failed",
						cause
					};
					return Promise.reject(cause);
				}
				const attempt = Promise.resolve().then(() => this.#attemptClose());
				this.#state = {
					kind: "closing",
					attempt
				};
				return attempt;
			}
			async #attemptClose() {
				try {
					await this.handle.close();
					this.#state = { kind: "closed" };
				} catch (cause) {
					this.#state = this.handle.fd < 0 ? {
						kind: "failed",
						cause
					} : { kind: "open" };
					throw cause;
				}
			}
		};
	})))();
}

//#endregion
//#region dist/filesystem/RegularFile.js
var NonRegularFileReadError, RegularFileAdmissionFailure, RegularFileChangedError, openRegularFile, nonRegularOpenFailure, errnos, UNOPENABLE_FILE_TYPE_ERRNOS, isUnopenableFileTypeError, sameRegularFileState;
function init_RegularFile() {
	return (init_RegularFile = __esmMin((() => {
		init_OwnedFileHandle();
		NonRegularFileReadError = class extends Error {
			path;
			code;
			constructor(path, directory) {
				super(`Selected input must be a regular file: ${path}`);
				this.path = path;
				this.name = "NonRegularFileReadError";
				this.code = directory ? "EISDIR" : "ENOTFILE";
			}
		};
		RegularFileAdmissionFailure = class extends Error {
			path;
			cleanupCause;
			owner;
			cause;
			constructor(path, admissionCause, cleanupCause, owner) {
				super(`Selected input failed admission and its descriptor close failed: ${path}`);
				this.path = path;
				this.cleanupCause = cleanupCause;
				this.owner = owner;
				this.name = "RegularFileAdmissionFailure";
				this.cause = admissionCause;
			}
		};
		RegularFileChangedError = class extends Error {
			path;
			code = "ESTALE";
			constructor(path) {
				super(`Selected input changed while being read: ${path}`);
				this.path = path;
				this.name = "RegularFileChangedError";
			}
		};
		openRegularFile = async (path, options) => {
			options.signal?.throwIfAborted();
			const handle = await open(path, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0) | (constants.O_NOCTTY ?? 0) | (options.symlinks === "reject" ? constants.O_NOFOLLOW ?? 0 : 0)).catch(async (cause) => {
				const nonRegular = await nonRegularOpenFailure(path, options.symlinks, cause);
				if (nonRegular === undefined) throw cause;
				options.signal?.throwIfAborted();
				throw nonRegular;
			});
			const owner = new OwnedFileHandle(handle);
			try {
				options.signal?.throwIfAborted();
				const metadata = await handle.stat();
				options.signal?.throwIfAborted();
				if (!metadata.isFile()) throw new NonRegularFileReadError(path, metadata.isDirectory());
				if (options.symlinks === "reject" && (constants.O_NOFOLLOW ?? 0) === 0) {
					const named = await lstat(path);
					options.signal?.throwIfAborted();
					if (named.isSymbolicLink()) throw new NonRegularFileReadError(path, false);
					if (!sameRegularFileState(metadata, named)) throw new RegularFileChangedError(path);
				}
				return handle;
			} catch (cause) {
				try {
					await owner.close();
				} catch (cleanupCause) {
					throw new RegularFileAdmissionFailure(path, cause, cleanupCause, owner);
				}
				throw cause;
			}
		};
		nonRegularOpenFailure = async (path, symlinks, cause) => {
			if (!isUnopenableFileTypeError(cause)) return undefined;
			const metadata = await (symlinks === "reject" ? lstat : stat)(path).catch(() => undefined);
			if (metadata === undefined || metadata.isFile()) return undefined;
			return new NonRegularFileReadError(path, metadata.isDirectory());
		};
		errnos = constants$1.errno;
		UNOPENABLE_FILE_TYPE_ERRNOS = new Set([
			errnos.ENXIO,
			errnos.EOPNOTSUPP,
			errnos.ENOTSUP
		].flatMap((errno) => errno === undefined ? [] : [-errno]));
		isUnopenableFileTypeError = (cause) => cause instanceof Error && "errno" in cause && typeof cause.errno === "number" && UNOPENABLE_FILE_TYPE_ERRNOS.has(cause.errno);
		sameRegularFileState = (expected, observed) => observed.isFile() && expected.dev === observed.dev && expected.ino === observed.ino && expected.size === observed.size && expected.mode === observed.mode && ("mtimeNs" in expected && "mtimeNs" in observed ? expected.mtimeNs === observed.mtimeNs && expected.ctimeNs === observed.ctimeNs : expected.mtimeMs === observed.mtimeMs && expected.ctimeMs === observed.ctimeMs);
	})))();
}

//#endregion
export { NonRegularFileReadError, OwnedFileHandle, RegularFileAdmissionFailure, RegularFileChangedError, init_OwnedFileHandle, init_RegularFile, openRegularFile, sameRegularFileState };