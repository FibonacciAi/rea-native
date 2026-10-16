import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisCancelledError, AnalysisError, init_analysisErrorBase, init_analysisErrorCore } from "./errorSchemas-CTRmvMl3.js";

//#region dist/domain/browserObservationError.js
var BrowserObservationError, observationFailureMessage;
function init_browserObservationError() {
	return (init_browserObservationError = __esmMin((() => {
		init_analysisErrorBase();
		init_analysisErrorCore();
		BrowserObservationError = class extends AnalysisError {
			operation;
			reason;
			_tag = "BrowserObservationError";
			cleanupIncomplete;
			cleanupResources;
			userCategory;
			userMessage;
			constructor(operation, reason, options) {
				super(`Browser observation ${operation} failed: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.userMessage = options?.detail ?? observationFailureMessage(operation, reason);
				this.cleanupIncomplete = this.cleanup !== undefined || reason === "cleanup_failed";
				this.cleanupResources = this.cleanup?.resources ?? (reason === "cleanup_failed" ? ["browser_transport"] : []);
				this.userCategory = reason === "cancelled" || options?.cause instanceof AnalysisCancelledError || options?.cause instanceof AnalysisError && options.cause.userCategory === "cancelled" ? "cancelled" : undefined;
			}
		};
		observationFailureMessage = (operation, reason) => {
			if (reason === "cancelled") return `${operation} was cancelled. Collected observations and cleanup status are reported when available.`;
			if (reason === "timeout") return `${operation} exceeded its execution deadline. Review the target's responsiveness and retained observations before retrying.`;
			if (reason === "endpoint_unreachable") return `${operation} could not reach the selected loopback debugging endpoint. Verify that the target process is running with debugging enabled and that the endpoint's port matches it, then retry.`;
			if (reason === "target_not_found") return `${operation} could not find the selected target at the debugging endpoint. Refresh target discovery for that endpoint and retry with a returned target ID.`;
			if (reason === "disconnected") return `${operation} lost its debugging connection. Verify that the target process is still running, refresh target discovery, and retry the observation.`;
			return undefined;
		};
	})))();
}

//#endregion
export { BrowserObservationError, init_browserObservationError };