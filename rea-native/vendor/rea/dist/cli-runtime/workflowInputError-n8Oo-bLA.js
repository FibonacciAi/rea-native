import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { analysisInputErrorFromIssues, init_inputIssueProjection } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisInputError, init_analysisErrorCore } from "./errorSchemas-CTRmvMl3.js";
import { z } from "zod";

//#region dist/application/workflowInputError.js
var requestInputError, workflowInputError;
function init_workflowInputError() {
	return (init_workflowInputError = __esmMin((() => {
		init_analysisErrorCore();
		init_inputIssueProjection();
		requestInputError = (operation, cause, input) => analysisInputErrorFromIssues(operation, cause.issues, input, { cause });
		workflowInputError = (operation, cause) => new AnalysisInputError(operation, { cause }, cause instanceof z.ZodError ? cause.issues.map((issue) => ({
			path: [],
			reason: "invalid_value",
			message: `A nested value failed validation at ${issue.path.length === 0 ? "its root" : issue.path.map(String).join(".")}: ${issue.message}`
		})) : [{
			path: [],
			reason: "invalid_value",
			message: cause.message
		}]);
	})))();
}

//#endregion
export { init_workflowInputError, requestInputError, workflowInputError };