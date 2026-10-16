import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/application/UpdateFailure.js
var isUpdateFailure;
function init_UpdateFailure() {
	return (init_UpdateFailure = __esmMin((() => {
		isUpdateFailure = (result) => {
			if (result.cleanupFailure !== undefined) return true;
			const status = result.status;
			switch (status) {
				case "current":
				case "updated": return false;
				case "failed": return true;
				default: {
					const exhaustive = status;
					throw new TypeError(`Unhandled update result status: ${String(exhaustive)}`);
				}
			}
		};
	})))();
}

//#endregion
export { init_UpdateFailure, isUpdateFailure };