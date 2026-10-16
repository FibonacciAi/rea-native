import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ProviderAdapterError, init_providerAdapterError } from "./providerAdapterError-DAjhICdr.js";
import { init_analysisErrorProjection, projectAnalysisError } from "./cliResultOutput-DsRMI8CJ.js";

//#region dist/domain/analysisErrorCleanup.js
var analysisErrorWithCleanupFailure;
function init_analysisErrorCleanup() {
	return (init_analysisErrorCleanup = __esmMin((() => {
		init_providerAdapterError();
		init_analysisErrorProjection();
		analysisErrorWithCleanupFailure = (primary, cleanup, operation = "close_binary") => {
			const projected = projectAnalysisError(cleanup);
			return new ProviderAdapterError(cleanup instanceof ProviderAdapterError ? cleanup.providerId : "rea", operation, {
				cause: new AggregateError([primary, cleanup], "Analysis failed and cleanup remains incomplete.", { cause: primary }),
				userMessage: projectAnalysisError(primary).message,
				...primary.capturedOutput === undefined ? {} : { capturedOutput: primary.capturedOutput },
				...primary.partialObservation === undefined ? {} : { partialObservation: primary.partialObservation },
				cleanup: {
					reason: projected.message,
					resources: [...new Set([...primary.cleanupResources, ...cleanup.cleanupResources])]
				},
				diagnostics: {
					primary_error: projectAnalysisError(primary),
					cleanup_error: projected
				}
			});
		};
	})))();
}

//#endregion
export { analysisErrorWithCleanupFailure, init_analysisErrorCleanup };