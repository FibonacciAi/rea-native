import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/application/UninstallFailure.js
var isUninstallFailure;
function init_UninstallFailure() {
	return (init_UninstallFailure = __esmMin((() => {
		isUninstallFailure = (result) => {
			const status = result.status;
			switch (status) {
				case "complete": return false;
				case "failed": return true;
				default: {
					const exhaustive = status;
					throw new TypeError(`Unhandled uninstall result status: ${String(exhaustive)}`);
				}
			}
		};
	})))();
}

//#endregion
export { init_UninstallFailure, isUninstallFailure };