import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";

//#region dist/domain/result.js
var ok, err;
function init_result() {
	return (init_result = __esmMin((() => {
		ok = (value) => ({
			ok: true,
			value
		});
		err = (error) => ({
			ok: false,
			error
		});
	})))();
}

//#endregion
//#region dist/domain/analysisErrorBase.js
var ANALYSIS_ERROR_TAGS, AnalysisError;
function init_analysisErrorBase() {
	return (init_analysisErrorBase = __esmMin((() => {
		ANALYSIS_ERROR_TAGS = [
			"AnalysisProtocolError",
			"AnalysisInputError",
			"AnalysisAccessDeniedError",
			"AnalysisArtifactChangedError",
			"AnalysisOutputError",
			"AnalysisCapabilityUnavailableError",
			"AnalysisUnsupportedTargetError",
			"AnalysisCancelledError",
			"AnalysisTimeoutError",
			"AnalysisResourceConstraintError",
			"ProviderSelectionError",
			"ProviderAdapterError",
			"BrowserObservationError",
			"ArtifactOperationError",
			"ProcessCaptureError",
			"EvidenceIntegrityError",
			"EvidenceFileError",
			"UnknownRegistryError",
			"HopperTimeoutError",
			"HopperCancelledError",
			"HopperProtocolError",
			"HopperRemoteError",
			"HopperProcessError",
			"HopperStartError",
			"ConfigurationError",
			"NoBinaryOpenError",
			"BinaryTargetError"
		];
		AnalysisError = class extends Error {
			diagnostics;
			capturedOutput;
			cleanup;
			cleanupIncomplete;
			cleanupResources;
			constructor(message, options) {
				super(message, options);
				this.diagnostics = options?.diagnostics === undefined ? undefined : structuredClone(options.diagnostics);
				this.capturedOutput = options?.capturedOutput === undefined ? undefined : { ...options.capturedOutput };
				this.cleanup = options?.cleanup;
				this.cleanupIncomplete = options?.cleanup !== undefined;
				this.cleanupResources = options?.cleanup?.resources ?? [];
				this.partialObservation = options?.partialObservation;
			}
			userMessage = undefined;
			userCategory = undefined;
			executionFailure = undefined;
			partialObservation;
			cleanupReport = undefined;
			/** Retain a later lifecycle failure without replacing the original typed error. */
			retainSecondaryFailure(failure, diagnostics) {
				Object.assign(this, {
					diagnostics: structuredClone({
						...this.diagnostics,
						...diagnostics
					}),
					cause: new AggregateError(this.cause === undefined ? [failure] : [this.cause, failure], "Analysis failed and a later lifecycle operation also failed.", { cause: this.cause })
				});
				return this;
			}
			/** Clear live cleanup status only after its owning resource confirms retry success. */
			resolveCleanup() {
				this.cleanupIncomplete = false;
				return this;
			}
			/** Retain a completed observation when a later step fails. */
			retainPartialObservation(observation) {
				this.partialObservation ??= observation;
				return this;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/analysisErrorCore.js
var AnalysisUnsupportedTargetError, ANALYSIS_RESOURCE_KINDS, AnalysisResourceConstraintError, AnalysisProtocolError, AnalysisInputError, AnalysisOutputError, AnalysisCapabilityUnavailableError, AnalysisCancelledError, AnalysisTimeoutError, AnalysisAccessDeniedError, AnalysisArtifactChangedError;
function init_analysisErrorCore() {
	return (init_analysisErrorCore = __esmMin((() => {
		init_analysisErrorBase();
		AnalysisUnsupportedTargetError = class extends AnalysisError {
			operation;
			path;
			reason;
			_tag = "AnalysisUnsupportedTargetError";
			/** Refusal-specific recovery, when the producer knows an available workflow. */
			remediationAction;
			constructor(operation, path, reason, options) {
				super(`Unsupported target for ${operation} at ${path}: ${reason}`, options);
				this.operation = operation;
				this.path = path;
				this.reason = reason;
				this.remediationAction = options?.remediationAction;
			}
		};
		ANALYSIS_RESOURCE_KINDS = [
			"memory",
			"cpu",
			"file-size",
			"transport",
			"capacity"
		];
		AnalysisResourceConstraintError = class extends AnalysisError {
			operation;
			resource;
			reason;
			reportedLimits;
			_tag = "AnalysisResourceConstraintError";
			remediationAction;
			constructor(operation, resource, reason, reportedLimits, options) {
				super(`Resource constraint during ${operation}: ${reason}`, options);
				this.operation = operation;
				this.resource = resource;
				this.reason = reason;
				this.reportedLimits = reportedLimits;
				this.remediationAction = options?.remediationAction;
			}
		};
		AnalysisProtocolError = class extends AnalysisError {
			_tag = "AnalysisProtocolError";
		};
		AnalysisInputError = class extends AnalysisError {
			operation;
			issues;
			_tag = "AnalysisInputError";
			userMessage;
			constructor(operation, options, issues = []) {
				super(`Invalid analysis input for ${operation}`, options);
				this.operation = operation;
				this.issues = issues;
				this.userMessage = options?.userMessage;
			}
		};
		AnalysisOutputError = class extends AnalysisError {
			operation;
			reason;
			_tag = "AnalysisOutputError";
			userMessage;
			remediationAction;
			cleanupOnly;
			constructor(operation, reason, options) {
				super(`Invalid analysis output for ${operation}: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.userMessage = options?.userMessage;
				this.remediationAction = options?.remediationAction;
				this.cleanupOnly = options?.cleanupOnly ?? false;
			}
		};
		AnalysisCapabilityUnavailableError = class extends AnalysisError {
			providerId;
			operation;
			reason;
			_tag = "AnalysisCapabilityUnavailableError";
			userMessage;
			/** Incomplete cleanup must settle before the operation can be retried. */
			retryable;
			constructor(providerId, operation, reason, options) {
				super(`Provider ${providerId} cannot execute ${operation}: ${reason}`, options);
				this.providerId = providerId;
				this.operation = operation;
				this.reason = reason;
				this.userMessage = options?.userMessage;
				this.retryable = options?.retryable === true && !this.cleanupIncomplete;
			}
		};
		AnalysisCancelledError = class extends AnalysisError {
			operation;
			_tag = "AnalysisCancelledError";
			constructor(operation, options) {
				super(`Analysis operation was cancelled: ${operation}`, options);
				this.operation = operation;
			}
		};
		AnalysisTimeoutError = class extends AnalysisError {
			operation;
			timeoutMs;
			_tag = "AnalysisTimeoutError";
			constructor(operation, timeoutMs, options) {
				super(`Analysis operation timed out after ${String(timeoutMs)}ms: ${operation}`, options);
				this.operation = operation;
				this.timeoutMs = timeoutMs;
			}
		};
		AnalysisAccessDeniedError = class extends AnalysisError {
			operation;
			path;
			systemCode;
			_tag = "AnalysisAccessDeniedError";
			constructor(operation, path, systemCode, options) {
				super(`Host filesystem read access denied (${systemCode}) for ${path} during ${operation}`, options);
				this.operation = operation;
				this.path = path;
				this.systemCode = systemCode;
			}
		};
		AnalysisArtifactChangedError = class extends AnalysisError {
			operation;
			path;
			reason;
			_tag = "AnalysisArtifactChangedError";
			constructor(operation, path, reason, options) {
				super(`Selected artifact changed during acquisition: ${reason}`, options);
				this.operation = operation;
				this.path = path;
				this.reason = reason;
			}
		};
	})))();
}

//#endregion
export { ok as _, AnalysisCapabilityUnavailableError as a, AnalysisProtocolError as c, AnalysisUnsupportedTargetError as d, init_analysisErrorCore as f, init_result as g, err as h, AnalysisCancelledError as i, AnalysisResourceConstraintError as l, init_analysisErrorBase as m, AnalysisAccessDeniedError as n, AnalysisInputError as o, AnalysisError as p, AnalysisArtifactChangedError as r, AnalysisOutputError as s, ANALYSIS_RESOURCE_KINDS as t, AnalysisTimeoutError as u };