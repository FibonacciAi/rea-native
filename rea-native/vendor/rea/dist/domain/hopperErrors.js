import { AnalysisError, } from "./analysisErrorBase.js";
import { hopperStartupFailure, } from "./hopperStartupFailure.js";
/** Base class for failures produced specifically by the Hopper provider. */
export class HopperError extends AnalysisError {
}
/** Hopper did not respond within the configured operation deadline. */
export class HopperTimeoutError extends HopperError {
    timeoutMs;
    operation;
    requestId;
    providerState;
    stage;
    launcherOutcome;
    _tag = "HopperTimeoutError";
    constructor(timeoutMs, operation, requestId, providerState = "not_started", stage = operation === undefined
        ? "launch"
        : "analysis", launcherOutcome) {
        super(`Hopper ${operation === undefined ? "startup" : operation} timed out after ${String(timeoutMs)}ms`);
        this.timeoutMs = timeoutMs;
        this.operation = operation;
        this.requestId = requestId;
        this.providerState = providerState;
        this.stage = stage;
        this.launcherOutcome = launcherOutcome;
    }
}
/** The caller cancelled a Hopper operation before it completed. */
export class HopperCancelledError extends HopperError {
    _tag = "HopperCancelledError";
    constructor() {
        super("Hopper operation was cancelled");
    }
}
/** Hopper returned bytes or JSON that do not satisfy the NDJSON RPC contract. */
export class HopperProtocolError extends HopperError {
    _tag = "HopperProtocolError";
}
export class HopperRemoteError extends HopperError {
    code;
    safeMessage;
    _tag = "HopperRemoteError";
    diagnosticType;
    operation;
    requestId;
    constructor(code, safeMessage, context = {}) {
        super(`Hopper request failed (${String(code)}): ${safeMessage}`, context);
        this.code = code;
        this.safeMessage = safeMessage;
        this.diagnosticType = context.diagnosticType ?? "remote";
        this.operation = context.operation;
        this.requestId = context.requestId;
    }
}
export class HopperProcessError extends HopperError {
    exitCode;
    _tag = "HopperProcessError";
    failureCode;
    userMessage;
    providerState;
    stage;
    diagnostic;
    operation;
    requestId;
    launcherFailure;
    constructor(exitCode, context = {}) {
        super(`Hopper bridge stopped unexpectedly with code ${String(exitCode)}`, context);
        this.exitCode = exitCode;
        this.diagnostic = context.diagnostic;
        this.operation = context.operation;
        this.requestId = context.requestId;
        this.launcherFailure = context.launcherFailure;
        const failure = hopperStartupFailure(exitCode);
        this.stage =
            context.stage ??
                (failure === undefined
                    ? context.operation === undefined
                        ? "connection"
                        : "analysis"
                    : "launch");
        this.failureCode = failure?.code;
        this.userMessage = failure?.message;
        this.providerState =
            context.providerState ?? (exitCode === null ? "unknown" : "exited");
    }
}
/** Hopper or the repository bridge could not be started. */
export class HopperStartError extends HopperError {
    _tag = "HopperStartError";
    userMessage;
    ownerRunId;
    launcherFailure;
    constructor(options) {
        super("Hopper application bridge could not be started", options);
        this.userMessage = options?.userMessage;
        this.ownerRunId = options?.ownerRunId;
        this.launcherFailure = options?.launcherFailure;
    }
}
