import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { a as AnalysisCapabilityUnavailableError, d as AnalysisUnsupportedTargetError, f as init_analysisErrorCore, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, m as init_analysisErrorBase, n as AnalysisAccessDeniedError, o as AnalysisInputError, p as AnalysisError, r as AnalysisArtifactChangedError, s as AnalysisOutputError, u as AnalysisTimeoutError } from "./analysisErrorCore-DXRTvF_m.js";
import { c as jsonValueSchema, m as isImmutableJsonSnapshot, o as init_jsonValue, p as init_immutableJson } from "./digests-BFoWUT_-.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";
import { n as init_artifactOperationError, t as ArtifactOperationError } from "./artifactOperationError-CkHMMaf7.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { a as providerRetryAction, i as init_providerOperationHealth } from "./providerOperationHealth-CTYa3iLf.js";

//#region dist/domain/configurationErrors.js
var ConfigurationError, NoBinaryOpenError, BinaryTargetError, readPermissionCode;
function init_configurationErrors() {
	return (init_configurationErrors = __esmMin((() => {
		init_analysisErrorBase();
		ConfigurationError = class extends AnalysisError {
			_tag = "ConfigurationError";
			settings;
			constructor(message, options) {
				super(message, options);
				this.settings = (options?.settings ?? []).map(({ setting, constraint }) => ({
					setting,
					constraint
				}));
			}
		};
		NoBinaryOpenError = class extends AnalysisError {
			_tag = "NoBinaryOpenError";
			constructor() {
				super("No app is open. Ask the user which app to investigate, then call open_binary with its local path.");
			}
		};
		BinaryTargetError = class extends AnalysisError {
			path;
			reason;
			_tag = "BinaryTargetError";
			constraint;
			/** The OS read-permission code of the cause, when the host denied access. */
			systemCode;
			constructor(path, reason, options) {
				super(`Cannot open artifact: ${reason}`, options);
				this.path = path;
				this.reason = reason;
				this.constraint = options?.constraint;
				this.systemCode = readPermissionCode(options?.cause);
			}
		};
		readPermissionCode = (cause) => {
			const code = cause instanceof Error ? Reflect.get(cause, "code") : undefined;
			return code === "EACCES" || code === "EPERM" ? code : undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/hopperStartupFailure.js
var failures, HOPPER_STARTUP_FAILURES, hopperStartupFailure, hopperStartupExitCode, isHopperStartupFailureCode;
function init_hopperStartupFailure() {
	return (init_hopperStartupFailure = __esmMin((() => {
		failures = [
			[
				70,
				"private_display_unavailable",
				"REA could not start its private Linux display. Install Xvfb, then rerun rea doctor."
			],
			[
				71,
				"x11_authorization_failed",
				"REA could not authorize its private Linux display. Install xauth, then rerun rea doctor."
			],
			[
				72,
				"unsupported_hopper_build",
				"This Hopper build is not supported for unattended Linux analysis. Unset HOPPER_LAUNCHER_PATH and rerun rea setup --yes --install-hopper, or update REA."
			],
			[
				73,
				"invalid_launch_command",
				"REA refused an unexpected Hopper launch command. Check HOPPER_LAUNCHER_PATH and rerun rea doctor."
			],
			[
				74,
				"process_ownership_mismatch",
				"REA could not verify ownership of the launched Hopper process and stopped safely. Close other Hopper sessions and retry."
			],
			[
				75,
				"hopper_exited_during_startup",
				"Hopper exited before the REA bridge was ready. In CI, run rea doctor --provider hopper --json; if Hopper showed a UI or license prompt, complete it in the runner user session, otherwise close stale Hopper sessions and retry."
			],
			[
				76,
				"unsupported_demo_dialog",
				"This Hopper demo dialog is not supported for unattended Linux analysis. Update REA or use a supported Hopper build."
			],
			[
				77,
				"unexpected_display_geometry",
				"REA's private Linux display did not match the validated layout. Close custom display overrides and retry."
			],
			[
				78,
				"x11_input_failed",
				"REA could not activate Hopper's validated demo control. Install the XTEST runtime, then rerun rea doctor."
			],
			[
				79,
				"runtime_dependency_unavailable",
				"A Linux demo-session dependency is unavailable. Rerun rea setup --yes --install-hopper, then rea doctor."
			],
			[
				80,
				"x11_socket_directory_unusable",
				"REA cannot use the host X11 socket directory for a private display. Run rea doctor --provider hopper for exact mount and namespace diagnostics."
			]
		];
		HOPPER_STARTUP_FAILURES = new Map(failures.map(([exitCode, code, message]) => [exitCode, {
			code,
			message
		}]));
		hopperStartupFailure = (exitCode) => exitCode === null ? undefined : HOPPER_STARTUP_FAILURES.get(exitCode);
		hopperStartupExitCode = (code) => failures.find(([, candidate]) => candidate === code)?.[0];
		isHopperStartupFailureCode = (value) => failures.some(([, candidate]) => candidate === value);
	})))();
}

//#endregion
//#region dist/domain/hopperErrors.js
var HopperError, HopperTimeoutError, HopperCancelledError, HopperProtocolError, HopperRemoteError, HopperProcessError, HopperStartError;
function init_hopperErrors() {
	return (init_hopperErrors = __esmMin((() => {
		init_analysisErrorBase();
		init_hopperStartupFailure();
		HopperError = class extends AnalysisError {};
		HopperTimeoutError = class extends HopperError {
			timeoutMs;
			operation;
			requestId;
			providerState;
			stage;
			launcherOutcome;
			_tag = "HopperTimeoutError";
			constructor(timeoutMs, operation, requestId, providerState = "not_started", stage = operation === undefined ? "launch" : "analysis", launcherOutcome) {
				super(`Hopper ${operation === undefined ? "startup" : operation} timed out after ${String(timeoutMs)}ms`);
				this.timeoutMs = timeoutMs;
				this.operation = operation;
				this.requestId = requestId;
				this.providerState = providerState;
				this.stage = stage;
				this.launcherOutcome = launcherOutcome;
			}
		};
		HopperCancelledError = class extends HopperError {
			_tag = "HopperCancelledError";
			constructor() {
				super("Hopper operation was cancelled");
			}
		};
		HopperProtocolError = class extends HopperError {
			_tag = "HopperProtocolError";
		};
		HopperRemoteError = class extends HopperError {
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
		};
		HopperProcessError = class extends HopperError {
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
				this.stage = context.stage ?? (failure === undefined ? context.operation === undefined ? "connection" : "analysis" : "launch");
				this.failureCode = failure?.code;
				this.userMessage = failure?.message;
				this.providerState = context.providerState ?? (exitCode === null ? "unknown" : "exited");
			}
		};
		HopperStartError = class extends HopperError {
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
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceErrors.js
var EvidenceIntegrityError, AnalysisSnapshotMismatchError, EvidenceReferenceError, EvidenceFileError;
function init_evidenceErrors() {
	return (init_evidenceErrors = __esmMin((() => {
		init_analysisErrorBase();
		EvidenceIntegrityError = class extends AnalysisError {
			_tag = "EvidenceIntegrityError";
			userMessage;
			constructor(message, options) {
				super(message, options);
				this.userMessage = options?.userMessage;
			}
		};
		AnalysisSnapshotMismatchError = class extends EvidenceIntegrityError {};
		EvidenceReferenceError = class extends EvidenceIntegrityError {
			evidenceId;
			reason;
			expected;
			actual;
			constructor(evidenceId, reason, expected, actual) {
				super(`Evidence reference ${reason}: ${evidenceId}`);
				this.evidenceId = evidenceId;
				this.reason = reason;
				this.expected = expected;
				this.actual = actual;
			}
		};
		EvidenceFileError = class extends AnalysisError {
			operation;
			reason;
			_tag = "EvidenceFileError";
			userMessage;
			/** Caller-selected path that failed, resolved against the working directory. */
			path;
			/** Present only when a write committed before cleanup failed. */
			published;
			constructor(operation, reason, options) {
				super(`Evidence bundle ${operation} failed: ${reason}`, options);
				this.operation = operation;
				this.reason = reason;
				this.path = options?.path;
				this.published = options?.published;
				this.userMessage = options?.userMessage;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/providerSelectionError.js
var ProviderSelectionError, providerSelectionDiagnostic, providerSelectionUserMessage;
function init_providerSelectionError() {
	return (init_providerSelectionError = __esmMin((() => {
		init_analysisErrorBase();
		ProviderSelectionError = class extends AnalysisError {
			_tag = "ProviderSelectionError";
			operation;
			reason;
			requestedProviderId;
			candidateIds;
			rejections;
			userMessage;
			constructor(options) {
				const operation = options.operation ?? "open_binary";
				super(providerSelectionDiagnostic(options), options.capturedOutput === undefined ? undefined : { capturedOutput: options.capturedOutput });
				this.operation = operation;
				this.reason = options.reason;
				this.requestedProviderId = options.requestedProviderId;
				this.candidateIds = [...options.candidateIds];
				this.rejections = [...options.rejections ?? []].map((rejection) => ({
					...rejection,
					diagnostics: structuredClone(rejection.diagnostics)
				}));
				this.userMessage = options.userMessage ?? providerSelectionUserMessage(options);
			}
		};
		providerSelectionDiagnostic = (options) => {
			const candidates = options.candidateIds.length === 0 ? "none" : options.candidateIds.join(", ");
			return `Analysis provider selection failed (${options.reason}) for ${options.requestedProviderId}; candidates: ${candidates}`;
		};
		providerSelectionUserMessage = (options) => {
			switch (options.reason) {
				case "ambiguous": return "Multiple analysis providers support this target. Choose one with provider_id, --provider, or REA_ANALYSIS_PROVIDER.";
				case "unknown_provider": return `The requested analysis provider is unknown. Choose one of: ${options.candidateIds.join(", ") || "no configured providers"}.`;
				case "provider_unavailable": return "The selected analysis provider is unavailable. Review the reported local diagnostics or run `rea doctor`, then retry.";
				case "target_unsupported": return "The selected analysis provider does not support this target. Choose another provider or open a supported extracted binary.";
				case "invalid_options": return "The analysis provider selection or open options are invalid. Correct them and try again.";
			}
		};
	})))();
}

//#endregion
//#region dist/domain/unknownRegistryError.js
var UnknownRegistryError;
function init_unknownRegistryError() {
	return (init_unknownRegistryError = __esmMin((() => {
		init_analysisErrorBase();
		UnknownRegistryError = class extends AnalysisError {
			reason;
			_tag = "UnknownRegistryError";
			constructor(reason, options) {
				super(`Residual unknown registry mutation failed: ${reason}`, options);
				this.reason = reason;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/analysisErrorPresentation.js
var analysisErrorRemediationAction, analysisErrorCategory, browserErrorCategory, artifactErrorCategory, STATIC_ERROR_CATEGORIES, analysisErrorUserMessage, hopperErrorUserMessage, RESTART_OWNED_PROVIDER, hopperProcessRemediation, hopperProcessMessage, standardErrorMessage, UNREADABLE_OUTPUT_TAGS, UNSUPPORTED_PROVIDER_TAGS, CANCELLED_TAGS, TIMEOUT_TAGS, ADAPTER_FAILURE_TAGS, START_FAILURE_TAGS, INTEGRITY_POLICY_OPERATIONS, artifactMessage, evidenceFileMessage, KNOWN_ERROR_TAGS, assertKnownAnalysisErrorTag;
function init_analysisErrorPresentation() {
	return (init_analysisErrorPresentation = __esmMin((() => {
		init_analysisErrorCore();
		init_artifactOperationError();
		init_configurationErrors();
		init_browserObservationError();
		init_evidenceErrors();
		init_hopperErrors();
		init_providerSelectionError();
		init_unknownRegistryError();
		init_providerOperationHealth();
		analysisErrorRemediationAction = (error) => {
			if (error instanceof AnalysisCapabilityUnavailableError && error.retryable) return "Review details.reason, then retry the same analysis after the condition clears.";
			if (error instanceof EvidenceFileError && error.published !== undefined) return "Use the published file at details.published_path and resolve the reported staging cleanup failure.";
			if (error instanceof AnalysisSnapshotMismatchError) return "Run analysis without this snapshot, then save a fresh snapshot using the intended artifact, provider, and analysis profile.";
			if (error instanceof AnalysisUnsupportedTargetError) return error.remediationAction ?? "Select a target supported by this operation or choose an operation supporting the reported target format.";
			if (error instanceof AnalysisResourceConstraintError) return error.remediationAction ?? (error.resource === "capacity" ? "Wait for an active analysis to complete, then retry within the reported admission limits." : error.resource === "transport" ? "Discover retained records with get_evidence_bundle and detail: summary, then inspect compatible records through inspect_analysis_view using an exact Evidence reference. Export complete retained session evidence through export_evidence_bundle to a caller-selected path, or use complete CLI JSON output. The connection remains usable." : error.resource === "cpu" ? "Review the reported worker CPU limits and observed signal. Retry with sufficient CPU time or a smaller artifact; REA retains tighter inherited limits." : error.resource === "file-size" ? "Review the reported worker file-size limits and write failure. Retry with a sufficient file-size allowance for the evidence reply; REA retains tighter inherited limits." : "Review the reported worker memory limits and available host memory. Retry with sufficient memory or a smaller artifact; REA retains tighter inherited limits.");
			if (error instanceof HopperTimeoutError) return error.operation === undefined ? "Inspect Hopper for a loader or license dialog and review details.launcher. Correct the loader configuration or complete Hopper setup, then open the target again." : error.providerState === "busy" ? "Check binary_session.analysis_activity, wait for the active Hopper request to finish, then retry." : "Check binary_session for Hopper health, then retry the operation.";
			if (error instanceof HopperProcessError) return hopperProcessRemediation(error);
			if (error instanceof HopperStartError) return error.ownerRunId === undefined ? "Check the Hopper launcher and target details, then retry opening the target." : `Use the active REA session ${error.ownerRunId} or close it before opening this target again.`;
			if (error instanceof HopperRemoteError) return error.diagnosticType === "invalid_request" ? "Correct the reported address, document, or arguments and retry." : "Review the Hopper diagnostic details and correct the request or target; run `rea doctor` if the provider itself is failing. Repeating the unchanged request is not expected to succeed.";
			if (error instanceof EvidenceReferenceError) return "Use an exact Evidence reference retained by this session, supply the complete inline Evidence, re-run its producer, or import its Evidence bundle. close_binary clears retained records.";
			if (error instanceof BinaryTargetError && error.constraint === "directory_requires_file") return "For a JavaScript/Electron application directory, call analyze_javascript_application with input_path or run `rea analyze <directory>`. For binary analysis, select its executable file.";
			if (error instanceof BinaryTargetError && error.constraint === "load_selection_rejected") return "Correct the reported load argument (--target-format, --architecture, or --entry-point on the CLI; format, architecture, or entry_point through MCP) and retry.";
			if (error instanceof BinaryTargetError && error.constraint === "file_format_rejected") return "Review the reported file-format reason and select a supported, well-formed target.";
			if (error instanceof BinaryTargetError && error.constraint === "wasm_requires_static_inspection") return `For static inspection, call inspect_wasm_artifact with ${JSON.stringify({ path: error.path })} or run \`rea inspect-wasm-artifact <path> --format json\`. This separate lane requires caller-supplied WABT 1.0.42 via absolute REA_WABT_BIN_DIRECTORY; check its availability in binary_session. REA does not execute WASM or install tools, and the header alone does not establish that the complete module is valid.`;
			if (error instanceof AnalysisAccessDeniedError || error instanceof BinaryTargetError && error.systemCode !== undefined) return "Check the current process's read access to the selected path. Retry with a readable local file.";
			if (error instanceof AnalysisArtifactChangedError) return "Wait until the selected file is stable. For an active binary session, reopen the target with open_binary before retrying so REA acquires its current identity; for a CLI command or target-free tool, rerun the operation.";
			if (error instanceof ConfigurationError && error.settings.length > 0) return `Correct ${[...new Set(error.settings.map(({ setting }) => setting))].join(", ")} in the environment that starts REA (your shell or the MCP client's registration), then rerun.`;
			if (error instanceof AnalysisInputError) return "Correct the listed arguments and retry.";
			if (error instanceof AnalysisOutputError && error.remediationAction !== undefined) return error.remediationAction;
			if (error instanceof UnknownRegistryError && error.reason === "not-found") return "Check that the unknown_id belongs to this session, then retry.";
			return analysisErrorUserMessage(error);
		};
		analysisErrorCategory = (error) => {
			if (error instanceof AnalysisCapabilityUnavailableError && error.retryable) return "unavailable";
			if (error instanceof BinaryTargetError && error.constraint === "load_selection_rejected") return "invalid_input";
			if (error instanceof BinaryTargetError && (error.constraint === "wasm_requires_static_inspection" || error.constraint === "file_format_rejected")) return "unsupported_target";
			if (error instanceof ProviderSelectionError && error.reason === "provider_unavailable") return "unavailable";
			if (error._tag === "ProcessCaptureError") return error.userCategory ?? "execution_failure";
			if (error instanceof BrowserObservationError) return error.userCategory ?? browserErrorCategory(error.reason);
			if (error instanceof HopperRemoteError && error.diagnosticType === "invalid_request") return "invalid_input";
			if (error instanceof HopperRemoteError && error.diagnosticType === "authorization") return "unavailable";
			if (error instanceof HopperProcessError || error instanceof HopperStartError) return "unavailable";
			if (error instanceof ArtifactOperationError) return artifactErrorCategory(error.reason);
			if (error instanceof EvidenceFileError && (error.reason === "missing" || error.reason === "not-file" || error.reason === "wrong-kind" || error.reason === "exists")) return "invalid_input";
			return STATIC_ERROR_CATEGORIES[error._tag] ?? "execution_failure";
		};
		browserErrorCategory = (reason) => {
			if (reason === "cancelled") return "cancelled";
			if (reason === "timeout") return "timeout";
			if (reason === "payload_limit") return "truncated";
			if (reason === "target_not_found" || reason === "target_not_allowed" || reason === "target_changed" || reason === "endpoint_unreachable" || reason === "disconnected") return "unavailable";
			return "execution_failure";
		};
		artifactErrorCategory = (reason) => {
			if (reason === "integrity") return "integrity_mismatch";
			if (reason === "limit") return "truncated";
			if (reason === "cancelled") return "cancelled";
			if (reason === "unavailable") return "unavailable";
			return "execution_failure";
		};
		STATIC_ERROR_CATEGORIES = {
			ConfigurationError: "invalid_input",
			AnalysisInputError: "invalid_input",
			AnalysisAccessDeniedError: "unavailable",
			AnalysisArtifactChangedError: "integrity_mismatch",
			AnalysisCapabilityUnavailableError: "unsupported_provider",
			AnalysisUnsupportedTargetError: "unsupported_target",
			ProviderSelectionError: "unsupported_provider",
			EvidenceIntegrityError: "integrity_mismatch",
			AnalysisCancelledError: "cancelled",
			HopperCancelledError: "cancelled",
			AnalysisTimeoutError: "timeout",
			AnalysisResourceConstraintError: "resource_constraint",
			HopperTimeoutError: "timeout",
			NoBinaryOpenError: "unavailable",
			BinaryTargetError: "unavailable"
		};
		analysisErrorUserMessage = (error) => {
			if (error instanceof AnalysisSnapshotMismatchError) return error.message;
			if (error instanceof AnalysisUnsupportedTargetError) return error.message;
			if (error instanceof AnalysisResourceConstraintError) return error.reason;
			if (error instanceof AnalysisAccessDeniedError) return "Host filesystem permissions denied read access to the selected path.";
			if (error instanceof AnalysisArtifactChangedError) return "The selected artifact changed during acquisition; no stable snapshot was decoded.";
			if (error instanceof AnalysisInputError) return error.userMessage ?? "Analysis input is invalid. Check the arguments and try again.";
			const hopperMessage = hopperErrorUserMessage(error);
			if (hopperMessage !== undefined) return hopperMessage;
			if (error.userMessage !== undefined) return error.userMessage;
			if (error instanceof AnalysisCapabilityUnavailableError && error.retryable) return "Required runtime controls are unavailable for this attempt.";
			const standardMessage = standardErrorMessage(error._tag);
			if (standardMessage !== undefined) return standardMessage;
			if (error instanceof ArtifactOperationError) return artifactMessage(error);
			if (error instanceof EvidenceReferenceError) return error.reason === "missing" ? `Evidence ${error.evidenceId} is not retained in this session. Supply complete inline Evidence, re-run its producer, or import its bundle before using this reference.` : `Evidence ${error.evidenceId} does not match the requested reference (${error.reason}). Check the expected and actual identity in the diagnostic details.`;
			if (error instanceof EvidenceIntegrityError) return "Evidence is invalid or has changed. Recreate or re-import it, then try again.";
			if (error instanceof EvidenceFileError) return evidenceFileMessage(error);
			if (error instanceof UnknownRegistryError && error.reason === "not-found") return "The requested residual unknown does not exist in this session. Check the unknown_id and try again.";
			if (error instanceof UnknownRegistryError) return "Evidence state changed before the update completed. Refresh the current state and try again.";
			if (error instanceof ConfigurationError) return error.settings.length === 0 ? "REA configuration is invalid. Run `rea doctor` and fix the reported setting." : `REA configuration is invalid: ${error.settings.map(({ setting, constraint }) => constraint.includes(setting) ? constraint.replace(/\.$/u, "") : `${setting}: ${constraint}`).join("; ")}.`;
			if (error instanceof NoBinaryOpenError) return error.message;
			if (error instanceof BinaryTargetError && error.constraint === "wasm_requires_static_inspection") return `${error.message}. Static WebAssembly inspection uses a separate optional WABT lane, not a native analysis engine.`;
			if (error instanceof BinaryTargetError) return error.constraint === "directory_requires_file" ? "open_binary accepts files and macOS app bundles. This target is a directory; JavaScript/Electron application directories can be analyzed directly with analyze_javascript_application or `rea analyze <directory>`." : error.constraint === "file_format_rejected" || error.constraint === "load_selection_rejected" ? `${error.message}.` : `${error.message}. Check that the path exists, is readable, and points to a supported file.`;
			if (error._tag === "ProcessCaptureError") return error.userMessage ?? "Process capture could not complete. Run `rea doctor`, then review capture policy and try again.";
			return "Analysis could not complete. Run `rea doctor`, then try again.";
		};
		hopperErrorUserMessage = (error) => {
			if (error instanceof HopperTimeoutError) {
				if (error.operation === undefined) return "REA timed out waiting for Hopper bridge readiness. Hopper may be waiting for a loader or license dialog; inspect its window and the captured launcher outcome before retrying.";
				const request = error.operation;
				return error.providerState === "busy" ? `Hopper timed out during ${request} while the provider remained busy. Check binary_session.analysis_activity, wait for the active request to finish, then retry.` : `Hopper timed out during ${request} before it started. Check binary_session for provider health, then retry.`;
			}
			if (error instanceof HopperProcessError) return hopperProcessMessage(error);
			if (error instanceof HopperStartError) return error.userMessage ?? "Hopper could not start. Check the launcher and target details, then retry opening the target.";
			if (error instanceof HopperRemoteError) return `Hopper ${error.operation ?? "analysis"} failed (${String(error.code)}, ${error.diagnosticType}): ${error.safeMessage}`;
			return undefined;
		};
		RESTART_OWNED_PROVIDER = "Restart the owned provider by calling close_binary, then open the target again and retry.";
		hopperProcessRemediation = (error) => {
			if (error.failureCode !== undefined && error.userMessage !== undefined) return error.userMessage;
			if (error.stage === "launch") return "Review the captured launcher diagnostics and Hopper setup, then retry opening the target.";
			if (providerRetryAction(error.providerState) === "restart_provider") return RESTART_OWNED_PROVIDER;
			return "Read binary_session.provider_operation_health for this request before retrying or restarting the owned provider.";
		};
		hopperProcessMessage = (error) => {
			const stage = error.stage;
			const where = error.operation ?? stage;
			const request = error.requestId === undefined ? "" : ` Request id ${String(error.requestId)}.`;
			const startup = error.userMessage === undefined ? "" : ` ${error.userMessage}`;
			if (error.providerState === "exited") {
				const signal = error.launcherFailure?.signal;
				const exit = error.exitCode === null ? signal === undefined || signal === null ? "no exit code was observed" : `signal ${signal}` : `exit code ${String(error.exitCode)}`;
				const recovery = error.failureCode === undefined && stage !== "launch" ? ` ${RESTART_OWNED_PROVIDER}` : "";
				return `Hopper exited during ${where} (${exit}).${startup}${recovery}${request}`;
			}
			if (error.providerState === "unreachable") return `Hopper became unreachable during ${where}; its process exit was not observed. ${RESTART_OWNED_PROVIDER}${startup}${request}`;
			return `Hopper failed during ${where} and REA could not determine whether the provider is busy, exited, or unreachable.${startup} Read binary_session.provider_operation_health for this request before retrying or restarting.${request}`;
		};
		standardErrorMessage = (tag) => {
			if (UNREADABLE_OUTPUT_TAGS.has(tag)) return "Analysis returned an unreadable result. Run `rea doctor` and review the reported details; repeating the unchanged request is not expected to succeed.";
			if (UNSUPPORTED_PROVIDER_TAGS.has(tag)) return "This analysis is unavailable for the current target. Choose another analysis or target.";
			if (CANCELLED_TAGS.has(tag)) return "Analysis was cancelled. Start it again when ready.";
			if (TIMEOUT_TAGS.has(tag)) return "Analysis took too long. Try a smaller request, then run `rea doctor` if it continues.";
			if (ADAPTER_FAILURE_TAGS.has(tag)) return "Analysis could not complete. Run `rea doctor` and review the reported details; repeating the unchanged request is not expected to succeed.";
			if (START_FAILURE_TAGS.has(tag)) return "Analysis could not start or stopped unexpectedly. Run `rea doctor`, then try again.";
			return undefined;
		};
		UNREADABLE_OUTPUT_TAGS = new Set([
			"AnalysisProtocolError",
			"AnalysisOutputError",
			"HopperProtocolError"
		]);
		UNSUPPORTED_PROVIDER_TAGS = new Set(["AnalysisCapabilityUnavailableError", "ProviderSelectionError"]);
		CANCELLED_TAGS = new Set(["AnalysisCancelledError", "HopperCancelledError"]);
		TIMEOUT_TAGS = new Set(["AnalysisTimeoutError", "HopperTimeoutError"]);
		ADAPTER_FAILURE_TAGS = new Set(["ProviderAdapterError", "HopperRemoteError"]);
		START_FAILURE_TAGS = new Set(["HopperProcessError", "HopperStartError"]);
		INTEGRITY_POLICY_OPERATIONS = new Set([
			"inventory_artifact",
			"inspect_artifact",
			"extract_artifact",
			"analyze_javascript_application"
		]);
		artifactMessage = ({ operation, reason, artifactDetails: details, detail }) => {
			if (reason === "cancelled") return "Artifact operation was cancelled. Start it again when ready.";
			if (reason === "limit") return "Artifact is too large to process safely. Narrow the requested path or use a smaller artifact.";
			if (reason === "path") return detail ?? "Artifact contains a conflicting internal path. Inspect the reported path before retrying.";
			if (reason === "unavailable" && details?.unpacked === true) return `ASAR unpacked companion bytes are unavailable for ${details.logicalPath}. Select the archive in place with its .unpacked directory beside it, then retry.`;
			if (reason === "unavailable") return "Artifact processing is unavailable for the current target or host. Check artifact support and required tools.";
			if (reason === "integrity" && INTEGRITY_POLICY_OPERATIONS.has(operation)) return `${details?.unpacked === true && details.calculatedSha256 !== null ? `Declared ASAR integrity for unpacked entry ${details.logicalPath} contradicts its companion file; packaging tools commonly sign or strip unpacked native binaries after writing the archive.` : "Artifact bytes contradict declared integrity."} If expected, rerun ${operation === "inventory_artifact" ? "inspect_artifact" : operation} with integrity_policy=record-and-continue (CLI: --integrity-policy record-and-continue) to retain observed bytes as untrusted; otherwise get a fresh copy.`;
			if (reason === "format" || reason === "integrity") return "Artifact is invalid or has changed. Get a fresh copy and try again.";
			return "Artifact could not be read or written. Check file access and try again.";
		};
		evidenceFileMessage = ({ operation, reason, published }) => {
			if (published !== undefined) return "The output file was published, but staging cleanup remains incomplete.";
			if (reason === "missing") return operation === "read" ? "Evidence file does not exist at the selected path. Check the path and try again." : "Evidence output directory does not exist. Choose an existing directory and try again.";
			if (reason === "not-file") return "Evidence path does not point to a regular file. Choose a file and try again.";
			if (reason === "exists") return "Evidence file already exists. Choose another path or allow overwrite.";
			if (reason === "invalid-json") return "Evidence file is not valid JSON. Repair or recreate the file and try again.";
			return "Evidence file could not be accessed. Check file permissions and try again.";
		};
		KNOWN_ERROR_TAGS = {
			AnalysisProtocolError: true,
			AnalysisInputError: true,
			AnalysisAccessDeniedError: true,
			AnalysisArtifactChangedError: true,
			AnalysisOutputError: true,
			AnalysisCapabilityUnavailableError: true,
			AnalysisUnsupportedTargetError: true,
			AnalysisCancelledError: true,
			AnalysisTimeoutError: true,
			AnalysisResourceConstraintError: true,
			ProviderSelectionError: true,
			ProviderAdapterError: true,
			BrowserObservationError: true,
			ArtifactOperationError: true,
			ProcessCaptureError: true,
			EvidenceIntegrityError: true,
			EvidenceFileError: true,
			UnknownRegistryError: true,
			HopperTimeoutError: true,
			HopperCancelledError: true,
			HopperProtocolError: true,
			HopperRemoteError: true,
			HopperProcessError: true,
			HopperStartError: true,
			ConfigurationError: true,
			NoBinaryOpenError: true,
			BinaryTargetError: true
		};
		assertKnownAnalysisErrorTag = (tag) => {
			if (KNOWN_ERROR_TAGS[tag] !== true) throw new TypeError("Unknown analysis error tag");
		};
	})))();
}

//#endregion
//#region dist/domain/analysisErrorProjection.js
var projectAnalysisError, underlyingErrorCode, browserErrorCode, artifactOperationCode, evidenceFileCode, unknownRegistryCode, processCaptureCode, STATIC_ERROR_CODES, staticErrorCode, errorDetails, requestErrorDetails, artifactStateErrorDetails, providerErrorDetails, primaryBrowserFailureReason, lifecycleErrorDetails, RETRYABLE_CODES;
function init_analysisErrorProjection() {
	return (init_analysisErrorProjection = __esmMin((() => {
		init_jsonValue();
		init_immutableJson();
		init_analysisErrorPresentation();
		init_analysisErrorCore();
		init_artifactOperationError();
		init_configurationErrors();
		init_browserObservationError();
		init_evidenceErrors();
		init_hopperErrors();
		init_providerAdapterError();
		init_providerSelectionError();
		init_unknownRegistryError();
		init_providerOperationHealth();
		projectAnalysisError = (error) => {
			assertKnownAnalysisErrorTag(error._tag);
			const underlyingCode = underlyingErrorCode(error);
			const code = error.cleanupIncomplete ? "cleanup_incomplete" : underlyingCode;
			const primaryDetails = errorDetails(error);
			const details = {
				...primaryDetails,
				...error.diagnostics === undefined ? {} : { diagnostics: error.diagnostics },
				...error.cleanupIncomplete ? {
					cleanup: "incomplete",
					resources: [...error.cleanupResources],
					...error.cleanup === undefined ? {} : { cleanup_reason: error.cleanup.reason },
					execution_failure: primaryDetails?.execution_failure ?? underlyingCode
				} : {},
				...error.capturedOutput === undefined ? {} : { captured_output: { ...error.capturedOutput } },
				...error.partialObservation === undefined ? {} : { partial_observation: isImmutableJsonSnapshot(error.partialObservation) ? error.partialObservation : jsonValueSchema.parse(error.partialObservation) }
			};
			return {
				code,
				category: analysisErrorCategory(error),
				message: analysisErrorUserMessage(error),
				retryable: RETRYABLE_CODES.has(code) || error instanceof AnalysisCapabilityUnavailableError && error.retryable || code === "resource_constraint" && error instanceof AnalysisResourceConstraintError && error.resource === "capacity",
				remediation: { action: analysisErrorRemediationAction(error) },
				...Object.keys(details).length === 0 ? {} : { details }
			};
		};
		underlyingErrorCode = (error) => {
			if (error instanceof HopperRemoteError && error.diagnosticType === "invalid_request") return "invalid_request";
			if (error instanceof ProviderSelectionError) return error.reason === "provider_unavailable" ? "provider_unavailable" : "capability_unavailable";
			if (error instanceof BrowserObservationError) return error.userCategory === "cancelled" ? "cancelled" : browserErrorCode(error.reason);
			if (error instanceof ArtifactOperationError) return artifactOperationCode(error);
			if (error instanceof BinaryTargetError) return error.constraint === "load_selection_rejected" ? "invalid_request" : error.systemCode === undefined ? "target_unavailable" : "access_denied";
			if (error instanceof EvidenceFileError) return evidenceFileCode(error.reason);
			if (error instanceof UnknownRegistryError) return unknownRegistryCode(error.reason);
			if (error._tag === "ProcessCaptureError") return processCaptureCode(error);
			return staticErrorCode(error._tag);
		};
		browserErrorCode = (reason) => {
			if (reason === "cancelled") return "cancelled";
			if (reason === "timeout") return "provider_timeout";
			if (reason === "payload_limit") return "truncated";
			if (reason === "target_not_found" || reason === "target_not_allowed" || reason === "target_changed") return "target_unavailable";
			if (reason === "endpoint_unreachable" || reason === "disconnected") return "provider_unavailable";
			return "unreadable_output";
		};
		artifactOperationCode = (error) => {
			if (error.reason === "integrity" && error.artifactDetails !== undefined) return "artifact_integrity_mismatch";
			if (error.reason === "limit") return "truncated";
			if (error.reason === "cancelled") return "cancelled";
			return "artifact_operation_failed";
		};
		evidenceFileCode = (reason) => {
			if (reason === "invalid-json") return "evidence_integrity_mismatch";
			if (reason === "io") return "execution_failure";
			return "invalid_request";
		};
		unknownRegistryCode = (reason) => {
			if (reason === "revision-conflict" || reason === "already-exists") return "revision_conflict";
			if (reason === "limit") return "truncated";
			if (reason === "integrity") return "evidence_integrity_mismatch";
			return "execution_failure";
		};
		processCaptureCode = (error) => {
			if (error.cleanupIncomplete) return "cleanup_incomplete";
			if (error.userCategory === "cancelled") return "cancelled";
			return "process_capture_failed";
		};
		STATIC_ERROR_CODES = {
			AnalysisProtocolError: "unreadable_output",
			AnalysisOutputError: "unreadable_output",
			HopperProtocolError: "unreadable_output",
			AnalysisInputError: "invalid_request",
			AnalysisAccessDeniedError: "access_denied",
			AnalysisArtifactChangedError: "artifact_changed",
			AnalysisCapabilityUnavailableError: "capability_unavailable",
			AnalysisUnsupportedTargetError: "unsupported_target",
			AnalysisCancelledError: "cancelled",
			HopperCancelledError: "cancelled",
			AnalysisTimeoutError: "provider_timeout",
			AnalysisResourceConstraintError: "resource_constraint",
			HopperTimeoutError: "provider_timeout",
			HopperProcessError: "provider_unavailable",
			HopperStartError: "provider_unavailable",
			ConfigurationError: "configuration_invalid",
			NoBinaryOpenError: "target_unavailable",
			EvidenceIntegrityError: "evidence_integrity_mismatch",
			ProviderAdapterError: "execution_failure",
			HopperRemoteError: "execution_failure"
		};
		staticErrorCode = (tag) => {
			switch (tag) {
				case "ArtifactOperationError":
				case "BinaryTargetError":
				case "BrowserObservationError":
				case "EvidenceFileError":
				case "ProcessCaptureError":
				case "ProviderSelectionError":
				case "UnknownRegistryError": throw new TypeError(`Unhandled specialized analysis error: ${tag}`);
				default: return STATIC_ERROR_CODES[tag];
			}
		};
		errorDetails = (error) => requestErrorDetails(error) ?? artifactStateErrorDetails(error) ?? providerErrorDetails(error) ?? lifecycleErrorDetails(error);
		requestErrorDetails = (error) => {
			if (error instanceof AnalysisUnsupportedTargetError) return {
				operation: error.operation,
				path: error.path,
				reason: error.reason
			};
			if (error instanceof AnalysisResourceConstraintError) return {
				operation: error.operation,
				resource: error.resource,
				reason: error.reason,
				reported_limits: error.reportedLimits
			};
			if (error instanceof AnalysisArtifactChangedError) return {
				operation: error.operation,
				path: error.path,
				reason: error.reason,
				boundary: "stable-artifact-read"
			};
			if (error instanceof AnalysisAccessDeniedError) return {
				operation: error.operation,
				path: error.path,
				system_code: error.systemCode,
				boundary: "filesystem-read"
			};
			if (error instanceof AnalysisOutputError) return {
				operation: error.operation,
				reason: error.reason,
				...error.diagnostics === undefined ? {} : { diagnostics: error.diagnostics }
			};
			if (error instanceof AnalysisInputError && error.issues.length > 0) return {
				operation: error.operation,
				issues: error.issues.map((issue) => ({
					path: [...issue.path],
					reason: issue.reason,
					...issue.message === undefined ? {} : { message: issue.message },
					...issue.expected === undefined ? {} : { expected: issue.expected },
					...issue.minimum === undefined ? {} : { minimum: issue.minimum },
					...issue.maximum === undefined ? {} : { maximum: issue.maximum }
				}))
			};
			if (error instanceof EvidenceReferenceError) return {
				evidence_id: error.evidenceId,
				reason: error.reason,
				expected: error.expected,
				actual: error.actual
			};
			if (error instanceof EvidenceIntegrityError) return { reason: error.message };
			return undefined;
		};
		artifactStateErrorDetails = (error) => {
			if (error instanceof ArtifactOperationError && error.artifactDetails) return {
				logical_path: error.artifactDetails.logicalPath,
				declared_sha256: error.artifactDetails.declaredSha256,
				calculated_sha256: error.artifactDetails.calculatedSha256,
				unpacked: error.artifactDetails.unpacked
			};
			if (error instanceof ArtifactOperationError) return {
				operation: error.operation,
				reason: error.reason,
				...error.reason === "limit" ? { truncated: true } : {},
				...error.detail === undefined ? {} : { detail: error.detail }
			};
			if (error instanceof UnknownRegistryError) return { reason: error.reason };
			if (error instanceof EvidenceFileError) return {
				operation: error.operation,
				reason: error.reason,
				...error.path === undefined ? {} : { path: error.path },
				...error.published === undefined ? {} : {
					published: true,
					bytes: error.published.bytes,
					published_path: error.published.path
				}
			};
			return undefined;
		};
		providerErrorDetails = (error) => {
			if (error instanceof AnalysisCapabilityUnavailableError) return {
				provider_id: error.providerId,
				operation: error.operation,
				reason: error.reason
			};
			if (error instanceof ProviderSelectionError) return {
				operation: error.operation,
				selection_reason: error.reason,
				requested_provider_id: error.requestedProviderId,
				candidate_ids: [...error.candidateIds],
				rejections: error.rejections.map((rejection) => ({
					provider_id: rejection.providerId,
					code: rejection.code,
					reason: rejection.reason,
					diagnostics: rejection.diagnostics
				}))
			};
			if (error instanceof ProviderAdapterError) return {
				provider_id: error.providerId,
				operation: error.operation,
				...error.cleanupIncomplete ? {
					cleanup: "incomplete",
					resources: [...error.cleanupResources]
				} : {}
			};
			if (error instanceof BrowserObservationError) {
				const primaryReason = primaryBrowserFailureReason(error);
				return {
					operation: error.operation,
					reason: error.reason,
					...error.cleanupIncomplete ? {
						cleanup: "incomplete",
						resources: [...error.cleanupResources],
						...primaryReason === undefined ? {} : { primary_reason: primaryReason }
					} : {}
				};
			}
			if (error instanceof HopperRemoteError) return {
				stage: "analysis",
				provider_code: error.code,
				diagnostic_type: error.diagnosticType,
				...error.operation === undefined ? {} : { operation: error.operation },
				...error.requestId === undefined ? {} : { request_id: error.requestId }
			};
			if (error instanceof HopperProcessError) {
				const stage = error.stage;
				return {
					exit_code: error.exitCode,
					stage,
					provider_state: error.providerState,
					retry_action: providerRetryAction(error.providerState, error.failureCode !== undefined || error.stage === "launch"),
					...error.failureCode === undefined ? {} : { failure_code: error.failureCode },
					...error.operation === undefined ? {} : { operation: error.operation },
					...error.requestId === undefined ? {} : { request_id: error.requestId },
					...error.diagnostic === undefined ? {} : { diagnostics: { ...error.diagnostic } },
					...error.launcherFailure === undefined ? {} : { launcher: error.launcherFailure }
				};
			}
			if (error instanceof HopperStartError) return {
				stage: "launch",
				provider_state: "unknown",
				retry_action: error.ownerRunId === undefined ? "retry" : "unknown",
				...error.ownerRunId === undefined ? {} : { owner_run_id: error.ownerRunId },
				...error.launcherFailure === undefined ? {} : { launcher: error.launcherFailure }
			};
			return undefined;
		};
		primaryBrowserFailureReason = (error) => {
			if (!(error.cause instanceof AggregateError)) return undefined;
			const primary = error.cause.errors[0];
			if (primary instanceof BrowserObservationError) return primary.reason;
			if (primary instanceof AnalysisCancelledError) return "cancelled";
			if (primary instanceof AnalysisTimeoutError) return "timeout";
			if (typeof primary === "object" && primary !== null && "_tag" in primary) return typeof primary._tag === "string" ? primary._tag : "execution_failure";
			return "execution_failure";
		};
		lifecycleErrorDetails = (error) => {
			if (error instanceof AnalysisCancelledError) return {
				operation: error.operation,
				cleanup: error.cleanupIncomplete ? "incomplete" : "complete",
				...error.cleanup === undefined || !error.cleanupIncomplete ? {} : {
					cleanup_reason: error.cleanup.reason,
					resources: [...error.cleanup.resources],
					execution_failure: "cancelled"
				}
			};
			if (error instanceof HopperCancelledError) return {
				operation: "hopper",
				cleanup: "complete"
			};
			if (error instanceof AnalysisTimeoutError) return {
				operation: error.operation,
				timeout_ms: error.timeoutMs,
				...error.cleanup === undefined || !error.cleanupIncomplete ? {} : {
					cleanup: "incomplete",
					cleanup_reason: error.cleanup.reason,
					resources: [...error.cleanup.resources]
				}
			};
			if (error instanceof HopperTimeoutError) return {
				stage: error.operation === undefined ? "startup" : error.stage,
				timeout_ms: error.timeoutMs,
				...error.launcherOutcome === undefined ? {} : { launcher: error.launcherOutcome },
				provider_state: error.providerState,
				retry_action: error.providerState === "busy" ? "wait" : "retry",
				...error.operation === undefined ? {} : { operation: error.operation },
				...error.requestId === undefined ? {} : { request_id: error.requestId }
			};
			if (error._tag === "ProcessCaptureError" && error.cleanupIncomplete) return {
				cleanup: "incomplete",
				resources: [...error.cleanupResources],
				...error.cleanupReport === undefined ? {} : { cleanup_report: jsonValueSchema.parse(error.cleanupReport) },
				...error.executionFailure === undefined ? {} : { execution_failure: error.executionFailure }
			};
			if (error._tag === "ProcessCaptureError") {
				const details = {
					...error.userCategory === "cancelled" ? {
						operation: "process_capture",
						cleanup: "complete"
					} : {},
					...error.cleanupReport === undefined ? {} : { cleanup_report: jsonValueSchema.parse(error.cleanupReport) },
					...error.executionFailure === undefined ? {} : { execution_failure: error.executionFailure }
				};
				return Object.keys(details).length === 0 ? undefined : details;
			}
			if (error instanceof ConfigurationError && error.settings.length > 0) return { settings: error.settings.map(({ setting, constraint }) => ({
				setting,
				constraint
			})) };
			if (error instanceof BinaryTargetError) return {
				path: error.path,
				reason: error.reason,
				...error.constraint === undefined ? {} : { constraint: error.constraint },
				...error.systemCode === undefined ? {} : {
					system_code: error.systemCode,
					boundary: "filesystem-read"
				}
			};
			return undefined;
		};
		RETRYABLE_CODES = new Set([
			"artifact_changed",
			"invalid_request",
			"provider_timeout",
			"cancelled",
			"revision_conflict",
			"provider_unavailable"
		]);
	})))();
}

//#endregion
export { BinaryTargetError as C, init_configurationErrors as E, isHopperStartupFailureCode as S, NoBinaryOpenError as T, HopperTimeoutError as _, ProviderSelectionError as a, hopperStartupFailure as b, EvidenceFileError as c, init_evidenceErrors as d, HopperCancelledError as f, HopperStartError as g, HopperRemoteError as h, init_unknownRegistryError as i, EvidenceIntegrityError as l, HopperProtocolError as m, projectAnalysisError as n, init_providerSelectionError as o, HopperProcessError as p, UnknownRegistryError as r, AnalysisSnapshotMismatchError as s, init_analysisErrorProjection as t, EvidenceReferenceError as u, init_hopperErrors as v, ConfigurationError as w, init_hopperStartupFailure as x, hopperStartupExitCode as y };