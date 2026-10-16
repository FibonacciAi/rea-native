import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { analysisInputErrorFromIssues, createEvidence, err, init_evidence, init_hopperValues, init_inputIssueProjection, init_result, ok, parseFunctionDossier } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { init_jsonValue, jsonObjectSchema } from "./errorSchemas-CTRmvMl3.js";
import { init_toolContracts, toolContract } from "./toolContracts-D2FOG_Nb.js";

//#region dist/application/FunctionAnalysisEvidence.js
var executeFunctionAnalysisEvidence;
function init_FunctionAnalysisEvidence() {
	return (init_FunctionAnalysisEvidence = __esmMin((() => {
		init_toolContracts();
		init_evidence();
		init_hopperValues();
		init_jsonValue();
		init_result();
		init_inputIssueProjection();
		executeFunctionAnalysisEvidence = async (analysis, parameters, target, options) => {
			const input = toolContract("analyze_function").inputSchema.safeParse(parameters);
			if (!input.success) return err(analysisInputErrorFromIssues("analyze_function", input.error.issues, parameters, { cause: input.error }));
			const arguments_ = jsonObjectSchema.parse(input.data);
			const execution = await analysis.execute("analyze_function", arguments_, options);
			if (!execution.ok) return execution;
			const dossier = parseFunctionDossier(execution.value.result);
			if (!dossier.ok) return dossier;
			const observation = execution.value;
			return ok(createEvidence(observation.subject ?? target, observation.provider, {
				operation: "analyze_function",
				parameters: arguments_,
				result: dossier.value,
				rawResult: observation.rawResult,
				limitations: observation.limitations,
				locations: observation.locations,
				...observation.relationshipCoverage === undefined ? {} : { relationshipCoverage: observation.relationshipCoverage },
				...observation.analysisProfile === undefined ? {} : { analysisProfile: observation.analysisProfile }
			}));
		};
	})))();
}

//#endregion
init_FunctionAnalysisEvidence();
export { executeFunctionAnalysisEvidence };