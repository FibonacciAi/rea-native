import { jsonValueSchema } from "../domain/jsonValue.js";
import { relationshipCoverageSchema, } from "../domain/relationshipCoverage.js";
export function createAnalysisExecution(result, provider, options = {}) {
    return {
        result: jsonValueSchema.parse(result),
        rawResult: options.rawResult === undefined
            ? null
            : jsonValueSchema.parse(options.rawResult),
        provider,
        ...(options.analysisProfile === undefined
            ? {}
            : { analysisProfile: structuredClone(options.analysisProfile) }),
        limitations: [...(options.limitations ?? [])],
        ...(options.relationshipCoverage === undefined
            ? {}
            : {
                relationshipCoverage: relationshipCoverageSchema.parse(options.relationshipCoverage),
            }),
        ...(options.referencesTruncated === undefined
            ? {}
            : { referencesTruncated: options.referencesTruncated }),
        locations: [...(options.locations ?? [])],
        subject: options.subject ?? null,
    };
}
