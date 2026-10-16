import { z } from "zod";
import { AnalysisCancelledError, AnalysisInputError, } from "../domain/analysisErrorCore.js";
import { createEvidence } from "../domain/evidence.js";
import { jsonObjectSchema } from "../domain/jsonValue.js";
import { err, ok } from "../domain/result.js";
/**
 * Shared CLI/MCP admission, execution, and Evidence composition for
 * single-request providers. The caller retains its operation vocabulary and
 * confidence; this normalizes cancellation, input validation, and Evidence
 * assembly once instead of per provider.
 */
export const executeProviderOperation = async (operation, input, options, schema, provider, confidence) => {
    if (options?.signal?.aborted)
        return err(new AnalysisCancelledError(operation));
    const request = schema.safeParse({ operation, input });
    if (!request.success)
        return err(new AnalysisInputError(operation, { cause: request.error }));
    const executed = await provider.execute(request.data, options);
    if (!executed.ok)
        return executed;
    const execution = executed.value;
    const evidence = createEvidence(execution.subject ?? undefined, execution.provider, {
        operation,
        parameters: jsonObjectSchema.parse(request.data.input),
        result: execution.result,
        rawResult: execution.rawResult,
        limitations: execution.limitations,
        locations: execution.locations,
        confidence,
    });
    // A provider that cannot observe the signal may finish its work after the
    // caller cancelled, so re-check rather than reporting a completed operation
    // the caller no longer wants. The observation it completed is still this
    // provider's Evidence, so the cancellation carries it as the partial
    // observation instead of discarding a finished result.
    if (options?.signal?.aborted)
        return err(new AnalysisCancelledError(operation, { partialObservation: evidence }));
    return ok(evidence);
};
