import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, evaluateReconstructionClosure, init_reconstructionCoverage, init_reconstructionCoverageInput, init_result, ok, reconstructionCoverageEvaluationInputSchema } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisInputError, init_analysisErrorCore, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { init_workflowInputError, requestInputError, workflowInputError } from "./workflowInputError-n8Oo-bLA.js";
import { z } from "zod";

//#region dist/application/ReconstructionCoverageService.js
var OPERATION, evaluateReconstructionCoverage;
function init_ReconstructionCoverageService() {
	return (init_ReconstructionCoverageService = __esmMin((() => {
		init_reconstructionCoverageInput();
		init_analysisErrorCore();
		init_reconstructionCoverage();
		init_jsonValue();
		init_result();
		init_workflowInputError();
		OPERATION = "evaluate_reconstruction_coverage";
		evaluateReconstructionCoverage = (rawInput, nowEpochMs = Date.now()) => {
			const parsed = reconstructionCoverageEvaluationInputSchema.safeParse(rawInput);
			if (!parsed.success) return err(requestInputError(OPERATION, parsed.error, rawInput));
			try {
				return ok(jsonValueSchema.parse(evaluateReconstructionClosure(parsed.data.coverage, parsed.data.boundary_id, nowEpochMs)));
			} catch (cause) {
				return err(cause instanceof TypeError || cause instanceof z.ZodError ? workflowInputError(OPERATION, cause) : new AnalysisInputError(OPERATION, { cause }));
			}
		};
	})))();
}

//#endregion
init_ReconstructionCoverageService();
export { evaluateReconstructionCoverage };