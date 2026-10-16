import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { lstat, realpath } from "node:fs/promises";

//#region dist/application/ClientConfigPath.js
var systemFileSystem, resolveClientConfigTransactionPath, isMissing;
function init_ClientConfigPath() {
	return (init_ClientConfigPath = __esmMin((() => {
		systemFileSystem = {
			lstat,
			realpath
		};
		resolveClientConfigTransactionPath = async (requestedPath, fileSystem = systemFileSystem) => {
			let requestedStats;
			try {
				requestedStats = await fileSystem.lstat(requestedPath);
			} catch (cause) {
				return isMissing(cause) ? requestedPath : undefined;
			}
			if (!requestedStats.isSymbolicLink()) return requestedPath;
			const currentUid = typeof process.getuid === "function" ? process.getuid() : undefined;
			if (currentUid === undefined || requestedStats.uid !== currentUid || fileSystem.realpath === undefined) return undefined;
			try {
				const canonicalPath = await fileSystem.realpath(requestedPath);
				const targetStats = await fileSystem.lstat(canonicalPath);
				return targetStats.isFile?.() === true && targetStats.uid === currentUid ? canonicalPath : undefined;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
	})))();
}

//#endregion
export { init_ClientConfigPath, resolveClientConfigTransactionPath };