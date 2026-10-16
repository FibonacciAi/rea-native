import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, f as init_analysisErrorCore, g as init_result, h as err, s as AnalysisOutputError } from "./analysisErrorCore-DXRTvF_m.js";

//#region dist/application/ProcedureAddressResolution.js
var resolveProcedureAddress;
function init_ProcedureAddressResolution() {
	return (init_ProcedureAddressResolution = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		resolveProcedureAddress = async (call, procedure, signal) => {
			const result = await call("procedure_address", { procedure }, signal);
			if (!result.ok) return result;
			return typeof result.value === "string" && result.value.length > 0 ? ok(result.value) : err(new AnalysisOutputError("procedure_address", "provider returned no canonical procedure address"));
		};
	})))();
}

//#endregion
export { resolveProcedureAddress as n, init_ProcedureAddressResolution as t };