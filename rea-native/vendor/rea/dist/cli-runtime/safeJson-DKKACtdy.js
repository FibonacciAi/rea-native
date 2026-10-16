import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/domain/safeJson.js
var safeParseJson;
function init_safeJson() {
	return (init_safeJson = __esmMin((() => {
		safeParseJson = (value) => {
			try {
				return {
					ok: true,
					value: JSON.parse(value)
				};
			} catch (cause) {
				return {
					ok: false,
					error: cause instanceof Error ? cause.message : String(cause),
					cause
				};
			}
		};
	})))();
}

//#endregion
export { init_safeJson, safeParseJson };