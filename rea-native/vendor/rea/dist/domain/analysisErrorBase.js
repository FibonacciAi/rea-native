/** Stable tags exposed by safe analysis-error projections. */
const ANALYSIS_ERROR_TAGS = [
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
    "BinaryTargetError",
];
/** Base class for expected analysis, provider, and session failures. */
export class AnalysisError extends Error {
    diagnostics;
    capturedOutput;
    cleanup;
    cleanupIncomplete;
    cleanupResources;
    constructor(message, options) {
        super(message, options);
        this.diagnostics =
            options?.diagnostics === undefined
                ? undefined
                : structuredClone(options.diagnostics);
        this.capturedOutput =
            options?.capturedOutput === undefined
                ? undefined
                : { ...options.capturedOutput };
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
        // Secondary resources remain owned by their cleanup lifecycle; preserve
        // the primary error's live cleanup status and original output.
        Object.assign(this, {
            diagnostics: structuredClone({ ...this.diagnostics, ...diagnostics }),
            cause: new AggregateError(this.cause === undefined ? [failure] : [this.cause, failure], "Analysis failed and a later lifecycle operation also failed.", { cause: this.cause }),
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
}
