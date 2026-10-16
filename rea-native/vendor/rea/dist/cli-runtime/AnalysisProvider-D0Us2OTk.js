import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_relationshipCoverage, relationshipCoverageSchema } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";

//#region dist/application/AnalysisProvider.js
function createAnalysisExecution(result, provider, options = {}) {
	return {
		result: jsonValueSchema.parse(result),
		rawResult: options.rawResult === undefined ? null : jsonValueSchema.parse(options.rawResult),
		provider,
		...options.analysisProfile === undefined ? {} : { analysisProfile: structuredClone(options.analysisProfile) },
		limitations: [...options.limitations ?? []],
		...options.relationshipCoverage === undefined ? {} : { relationshipCoverage: relationshipCoverageSchema.parse(options.relationshipCoverage) },
		...options.referencesTruncated === undefined ? {} : { referencesTruncated: options.referencesTruncated },
		locations: [...options.locations ?? []],
		subject: options.subject ?? null
	};
}
function init_AnalysisProvider() {
	return (init_AnalysisProvider = __esmMin((() => {
		init_jsonValue();
		init_relationshipCoverage();
	})))();
}

//#endregion
export { createAnalysisExecution, init_AnalysisProvider };