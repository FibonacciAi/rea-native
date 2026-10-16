import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, g as init_result } from "./analysisErrorCore-DXRTvF_m.js";
import { i as init_unknownRegistryError, r as UnknownRegistryError } from "./analysisErrorProjection-BN0EPM-3.js";
import { Jt as committedProviderSchema, Kt as analysisProfileSchema, Xt as init_analysisProfile, it as createEvidence, lt as init_evidence } from "./nativeValueTrace-DR9UE62L.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { A as REA_WORKFLOW_PROVIDER, F as workflowAnalysisProfile, P as init_InvestigationProviders } from "./InterfaceBuilderDecodeBudget-5F2AkxJT.js";

//#region dist/application/WorkflowEvidence.js
var executeComposedWorkflow, createWorkflowEvidence, batchProcedureLocations, workflowSnapshotRecord, recordWorkflowUnknowns;
function init_WorkflowEvidence() {
	return (init_WorkflowEvidence = __esmMin((() => {
		init_InvestigationProviders();
		init_result();
		init_analysisProfile();
		init_evidence();
		init_unknownRegistryError();
		init_unicodeCodePointOrder();
		executeComposedWorkflow = async (analysis, execute) => {
			const limitations = new Set();
			const result = await execute({ execute: async (operation, parameters, options) => {
				const execution = await analysis.execute(operation, parameters, options);
				if (execution.ok) execution.value.limitations.forEach((limitation) => limitations.add(limitation));
				return execution;
			} });
			if (!result.ok) return result;
			return ok({
				result: result.value,
				limitations: [...limitations].sort(compareUnicodeCodePoints)
			});
		};
		createWorkflowEvidence = (input) => createEvidence(input.target, REA_WORKFLOW_PROVIDER, {
			operation: input.operation,
			parameters: input.parameters,
			result: input.result,
			...input.upstreamProfile === undefined ? {} : { analysisProfile: workflowAnalysisProfile(input.upstreamProfile, input.operation) },
			confidence: "derived",
			limitations: ["Derived by an REA composed workflow.", ...input.upstreamLimitations],
			...input.operation === "batch_decompile" ? { locations: batchProcedureLocations(input.result) } : {}
		});
		batchProcedureLocations = (result) => {
			if (result === null || typeof result !== "object" || Array.isArray(result) || !Array.isArray(result.items)) return [];
			const addresses = new Set();
			for (const item of result.items) {
				if (item === null || typeof item !== "object" || Array.isArray(item)) continue;
				const procedure = item.procedure;
				if (procedure !== null && typeof procedure === "object" && !Array.isArray(procedure) && procedure.status === "resolved" && typeof procedure.address === "string") addresses.add(procedure.address);
			}
			return [...addresses].map((address) => ({
				kind: "address",
				address
			}));
		};
		workflowSnapshotRecord = (evidence, operation) => {
			if (evidence.analysis_profile === null) return undefined;
			return {
				operation,
				parameters: evidence.parameters,
				execution: {
					result: evidence.normalized_result,
					rawResult: evidence.raw_result,
					provider: committedProviderSchema.parse(evidence.provider),
					analysisProfile: analysisProfileSchema.parse(evidence.analysis_profile),
					limitations: evidence.limitations,
					locations: evidence.locations,
					subject: evidence.subject === null ? null : {
						path: evidence.subject.local_path,
						sha256: evidence.subject.digest.sha256,
						format: evidence.subject.format,
						...evidence.subject.architecture === null ? {} : { architecture: evidence.subject.architecture }
					}
				}
			};
		};
		recordWorkflowUnknowns = ({ name, result, evidenceId, recordUnknown }) => {
			if (![
				"trace_feature",
				"trace_call_path",
				"inspect_native_api"
			].includes(name) || recordUnknown === undefined || typeof result !== "object" || result === null || Array.isArray(result) || !Array.isArray(result.residual_unknowns)) return {
				ok: true,
				value: null
			};
			for (const question of result.residual_unknowns) {
				if (typeof question !== "string") continue;
				const recorded = recordUnknown({
					question,
					severity: "medium",
					domain: name === "inspect_native_api" ? "native-api" : "control-flow",
					supporting_evidence_ids: [evidenceId],
					contradicting_evidence_ids: [],
					required_authority: "shipped-artifact",
					required_confidence: "observed",
					required_environment: null,
					recommended_probes: [{
						operation: name,
						rationale: name === "inspect_native_api" ? "Confirm the unsupported boundary with a capable provider or ABI probe." : "Continue with a focused query or another available provider."
					}],
					relationships: []
				});
				if (!recorded.ok && !(recorded.error instanceof UnknownRegistryError && recorded.error.reason === "already-exists")) return recorded;
			}
			return {
				ok: true,
				value: null
			};
		};
	})))();
}

//#endregion
export { workflowSnapshotRecord as a, recordWorkflowUnknowns as i, executeComposedWorkflow as n, init_WorkflowEvidence as r, createWorkflowEvidence as t };