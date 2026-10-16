import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { createEvidence, err, init_evidence, init_result, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCapabilityUnavailableError, init_analysisErrorCore, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";

//#region dist/application/javascript/ElectronEvidence.js
var createElectronEvidence, parameters;
function init_ElectronEvidence() {
	return (init_ElectronEvidence = __esmMin((() => {
		init_evidence();
		init_jsonValue();
		createElectronEvidence = (operation, input, result, provider) => createEvidence(undefined, provider, {
			predicateType: operation === "list_electron_targets" ? "rea.electron-target-list" : "rea.electron-page-inspection",
			operation,
			parameters: parameters(input),
			result: jsonValueSchema.parse(result),
			confidence: "observed",
			authority: "external-service",
			environment: "target" in result ? {
				id: `${result.browser.product}@${result.browser.revision}`,
				platform: "unknown",
				architecture: "unknown",
				isolation: "none"
			} : null,
			limitations: [...result.limitations, ..."target" in result ? ["Browser host platform and architecture were not observed."] : []]
		});
		parameters = (input) => ({
			cdp_endpoint: input.cdp_endpoint,
			..."target_id" in input ? {
				target_id: input.target_id,
				observation_ms: input.observation_ms,
				include_script_sources: input.include_script_sources
			} : {}
		});
	})))();
}

//#endregion
//#region dist/application/javascript/ElectronObservationService.js
var listElectronTargets, inspectElectronPage, requireProvider;
function init_ElectronObservationService() {
	return (init_ElectronObservationService = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_ElectronEvidence();
		listElectronTargets = async (provider, input, options = {}) => {
			const ready = requireProvider(provider, "list_electron_targets");
			if (!ready.ok) return ready;
			const result = await ready.value.listTargets(input, options);
			return result.ok ? ok(createElectronEvidence("list_electron_targets", input, result.value, ready.value.identity())) : result;
		};
		inspectElectronPage = async (provider, input, options = {}) => {
			const ready = requireProvider(provider, "inspect_electron_page");
			if (!ready.ok) return ready;
			const result = await ready.value.inspectPage(input, options);
			return result.ok ? ok(createElectronEvidence("inspect_electron_page", input, result.value, ready.value.identity())) : result;
		};
		requireProvider = (provider, operation) => provider === undefined ? err(new AnalysisCapabilityUnavailableError("rea-cdp-electron", operation, "Electron observation provider is not configured")) : ok(provider);
	})))();
}

//#endregion
init_ElectronObservationService();
export { inspectElectronPage, listElectronTargets };