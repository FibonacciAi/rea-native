import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";

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
export { safeParseJson as n, init_safeJson as t };