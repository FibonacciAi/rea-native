import { ProviderCleanupError } from "../../domain/providerCleanupError.js";
import { err } from "../../domain/result.js";
import { AnalysisError } from "../../domain/analysisErrorBase.js";
/** Close one provider client and normalize unexpected adapter rejection. */
export const closeAnalysisClient = async (client, providerId, options = {}) => {
    try {
        return await client.close(options);
    }
    catch (cause) {
        // A typed cleanup failure already names its leftover resources.
        if (cause instanceof AnalysisError && cause.cleanupIncomplete)
            return err(cause);
        return err(new ProviderCleanupError(providerId, ["provider-client"], { reason: "provider client close rejected unexpectedly" }, { cause }));
    }
};
