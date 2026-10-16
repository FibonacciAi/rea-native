import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { AnalysisError, } from "../domain/analysisErrorBase.js";
import { analysisErrorWithCleanupFailure } from "../domain/analysisErrorCleanup.js";
import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { ProviderAdapterError } from "../domain/providerAdapterError.js";
import { ProviderCleanupError } from "../domain/providerCleanupError.js";
/** Finish a one-shot CLI operation without discarding its primary result on close failure. */
export const finishAnalysisCommand = async (run, service, providerId, canonicalOperation, fallbackResource) => {
    let result;
    try {
        result = await run();
    }
    catch (cause) {
        result = {
            ok: false,
            error: cause instanceof AnalysisError
                ? cause
                : new ProviderAdapterError(providerId, canonicalOperation, { cause }),
        };
    }
    try {
        await service.close();
    }
    catch (cause) {
        let cleanup;
        if (cause instanceof AnalysisError)
            cleanup = cause;
        else {
            const observation = cause instanceof ArtifactReaderFailure
                ? ArtifactReaderFailure.cleanupObservation(cause, fallbackResource ?? `${canonicalOperation} resources`)
                : {
                    reason: cause instanceof Error ? cause.message : String(cause),
                    resources: [],
                };
            cleanup = new ProviderCleanupError(providerId, observation.resources, { reason: observation.reason }, { cause, operation: canonicalOperation });
        }
        if (result.ok)
            cleanup.retainPartialObservation(result.value);
        return projectAnalysisError(result.ok
            ? cleanup
            : analysisErrorWithCleanupFailure(result.error, cleanup, canonicalOperation));
    }
    return result.ok ? result.value : projectAnalysisError(result.error);
};
