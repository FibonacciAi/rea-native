import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { createAnalysisProfile, init_analysisProfile } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";

//#region dist/application/InvestigationProviders.js
var REA_WORKFLOW_PROVIDER, workflowAnalysisProfile, ARTIFACT_GRAPH_PROVIDER, MANAGED_STATIC_PROVIDER, PE_RESOURCES_PROVIDER, MANAGED_WORKFLOW_PROVIDER, APPLE_APPLICATION_PROVIDER, ANDROID_APPLICATION_PROVIDER, HARMONY_APPLICATION_PROVIDER, WEB_SCRIPT_EXPORT_PROVIDER, JAVASCRIPT_APPLICATION_PROVIDER, JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, ANALYSIS_VIEW_PROVIDER, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, ARTIFACT_COMPARISON_PROVIDER, FUNCTION_COMPARISON_PROVIDER, BUNDLE_COMPARISON_PROVIDER, CHANGED_BEHAVIOR_PROVIDER, CALL_PATH_PROVIDER, STATIC_RUNTIME_PROVIDER, RECONSTRUCTION_PROVIDER;
function init_InvestigationProviders() {
	return (init_InvestigationProviders = __esmMin((() => {
		init_analysisProfile();
		REA_WORKFLOW_PROVIDER = {
			id: "rea-workflow",
			name: "REA composed investigation workflow",
			version: "1"
		};
		workflowAnalysisProfile = (upstream, operation) => createAnalysisProfile(REA_WORKFLOW_PROVIDER, {
			upstream_analysis_profile: upstream,
			...operation === "binary_overview" ? { workflow_revision: 3 } : operation === "batch_decompile" || operation === "get_call_graph" || operation === "trace_feature" ? { workflow_revision: 2 } : {}
		});
		ARTIFACT_GRAPH_PROVIDER = Object.freeze({
			id: "rea-artifact-graph",
			name: "REA safe artifact graph provider",
			version: "1"
		});
		MANAGED_STATIC_PROVIDER = Object.freeze({
			id: "rea-dotnet-static",
			name: "REA managed static analysis provider",
			version: "1"
		});
		PE_RESOURCES_PROVIDER = Object.freeze({
			id: "rea-pe-resources",
			name: "REA PE resource parser",
			version: "1"
		});
		MANAGED_WORKFLOW_PROVIDER = {
			id: "rea-dotnet-workflows",
			name: "REA managed-code workflows",
			version: "1"
		};
		APPLE_APPLICATION_PROVIDER = {
			id: "rea-apple-application",
			name: "REA Apple application workflows",
			version: "1"
		};
		ANDROID_APPLICATION_PROVIDER = {
			id: "rea-android-application",
			name: "REA Android application workflows",
			version: "1"
		};
		HARMONY_APPLICATION_PROVIDER = {
			id: "rea-harmony-application",
			name: "REA HarmonyOS application workflows",
			version: "1"
		};
		WEB_SCRIPT_EXPORT_PROVIDER = {
			id: "rea-web-script-export",
			name: "REA captured script export",
			version: "1"
		};
		JAVASCRIPT_APPLICATION_PROVIDER = {
			id: "rea-javascript-application",
			name: "REA JavaScript application analyzer",
			version: "1"
		};
		JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER = {
			id: "rea-javascript-runtime-reconciliation",
			name: "REA JavaScript runtime reconciliation",
			version: "1"
		};
		ANALYSIS_VIEW_PROVIDER = {
			id: "rea-analysis-view",
			name: "REA analysis view projection",
			version: "1"
		};
		JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER = {
			id: "rea-javascript-application-workflows",
			name: "REA JavaScript application workflows",
			version: "1"
		};
		ARTIFACT_COMPARISON_PROVIDER = {
			id: "rea-artifact-comparison",
			name: "REA artifact comparison",
			version: "1"
		};
		FUNCTION_COMPARISON_PROVIDER = {
			id: "rea-function-comparison",
			name: "REA function comparison",
			version: "1"
		};
		BUNDLE_COMPARISON_PROVIDER = {
			id: "rea-bundle-comparison",
			name: "REA Evidence bundle comparison",
			version: "1"
		};
		CHANGED_BEHAVIOR_PROVIDER = {
			id: "rea-changed-behavior",
			name: "REA changed behavior investigation",
			version: "1"
		};
		CALL_PATH_PROVIDER = {
			id: "rea-call-path",
			name: "REA call path reconstruction",
			version: "1"
		};
		STATIC_RUNTIME_PROVIDER = {
			id: "rea-static-runtime-correlation",
			name: "REA static/runtime correlation",
			version: "1"
		};
		RECONSTRUCTION_PROVIDER = {
			id: "rea-reconstruction-verifier",
			name: "REA reconstruction verifier",
			version: "1"
		};
	})))();
}

//#endregion
export { ANALYSIS_VIEW_PROVIDER, ANDROID_APPLICATION_PROVIDER, APPLE_APPLICATION_PROVIDER, ARTIFACT_COMPARISON_PROVIDER, ARTIFACT_GRAPH_PROVIDER, HARMONY_APPLICATION_PROVIDER, JAVASCRIPT_APPLICATION_PROVIDER, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, MANAGED_STATIC_PROVIDER, MANAGED_WORKFLOW_PROVIDER, PE_RESOURCES_PROVIDER, REA_WORKFLOW_PROVIDER, WEB_SCRIPT_EXPORT_PROVIDER, init_InvestigationProviders, workflowAnalysisProfile };