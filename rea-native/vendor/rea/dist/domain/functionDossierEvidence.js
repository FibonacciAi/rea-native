import { parseEvidence } from "./evidence.js";
import { compareUnicodeCodePoints } from "./unicodeCodePointOrder.js";
import { functionDossierSchema } from "./hopperValues.js";
import { functionCallCoverageLimitations } from "./functionCallCoverage.js";
/** Parse one complete analyze_function Evidence record for comparison workflows. */
export const parseFunctionEvidence = (input) => {
    const evidence = parseEvidence(input);
    if (evidence.operation !== "analyze_function")
        throw new TypeError("Function comparison requires analyze_function Evidence");
    if (evidence.subject === null)
        throw new TypeError("Function comparison requires artifact-bound Evidence");
    const dossier = functionDossierSchema.parse(evidence.normalized_result);
    const callCoverageLimitations = functionCallCoverageLimitations(evidence.relationship_coverage, dossier);
    return {
        evidence,
        subject: evidence.subject,
        dossier,
        limitations: [
            ...new Set([...evidence.limitations, ...dossier.limitations]),
        ].sort((left, right) => compareUnicodeCodePoints(left, right)),
        callCoverageLimitations,
    };
};
