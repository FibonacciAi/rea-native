import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, BinaryTargetError, ConfigurationError, analysisCliErrorEnvelopeSchema, analysisErrorProjectionSchema, init_analysisErrorBase, init_analysisErrorCore, init_configurationErrors, init_errorSchemas, init_immutableJson, init_jsonValue, init_providerOperationHealth, isImmutableJsonSnapshot, jsonValueSchema, providerRetryAction } from "./errorSchemas-CTRmvMl3.js";
import { ProviderAdapterError, init_providerAdapterError } from "./providerAdapterError-DAjhICdr.js";
import { ArtifactOperationError, init_artifactOperationError } from "./artifactOperationError-B7n03FbD.js";
import { BrowserObservationError, init_browserObservationError } from "./browserObservationError-Dx6xRTjb.js";
import { EvidenceFileError, EvidenceIntegrityError, EvidenceReferenceError, HopperCancelledError, HopperProcessError, HopperRemoteError, HopperStartError, HopperTimeoutError, ProviderSelectionError, UnknownRegistryError, analysisErrorCategory, analysisErrorRemediationAction, analysisErrorUserMessage, assertKnownAnalysisErrorTag, init_analysisErrorPresentation, init_evidenceErrors, init_hopperErrors, init_providerSelectionError, init_unknownRegistryError } from "./analysisErrorPresentation-DGt7TdsH.js";
import { init_cliOutput, parseCliOutputArguments, validateCliOutputArguments } from "./cliOutput-BC1BdAcB.js";
import { Cli, Filter, Formatter } from "incur";
import { constants } from "node:buffer";
import { estimateTokenCount, sliceByTokens } from "tokenx";

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
//#region dist/cliLogging.js
var isRecord, loggedFailures, projectCliOperationFailure, inferCliOperationFailure, cliOperationFailurePayload, isCliOperationFailure, logCliCommand;
function init_cliLogging() {
	return (init_cliLogging = __esmMin((() => {
		init_errorSchemas();
		init_analysisErrorBase();
		init_analysisErrorProjection();
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		loggedFailures = new WeakMap();
		projectCliOperationFailure = (value) => {
			if (!isRecord(value)) return undefined;
			const direct = analysisErrorProjectionSchema.safeParse(value);
			if (direct.success) return value;
			const envelope = analysisCliErrorEnvelopeSchema.safeParse(value);
			if (envelope.success) {
				const { error: _label, input_path: inputPath, input_reason: inputReason, ...projection } = value;
				const parsed = projection;
				if (typeof inputPath !== "string" && typeof inputReason !== "string") return parsed;
				return {
					...parsed,
					details: {
						...parsed.details,
						...typeof inputPath === "string" ? { input_path: inputPath } : {},
						...typeof inputReason === "string" ? { input_reason: inputReason } : {}
					}
				};
			}
			if (isRecord(value.error)) {
				const nested = analysisErrorProjectionSchema.safeParse(value.error);
				if (nested.success) return value.error;
			}
			return undefined;
		};
		inferCliOperationFailure = (value) => {
			const projection = projectCliOperationFailure(value);
			if (projection !== undefined) return projection;
			if (isRecord(value) && value.healthy === false) return value;
			return undefined;
		};
		cliOperationFailurePayload = (value) => {
			if (isRecord(value) && loggedFailures.has(value)) return loggedFailures.get(value);
			return inferCliOperationFailure(value);
		};
		isCliOperationFailure = (value) => cliOperationFailurePayload(value) !== undefined;
		logCliCommand = async (logger, command, execute, isCommandFailure) => {
			const startedAt = performance.now();
			try {
				const value = await execute();
				const inferredFailure = inferCliOperationFailure(value);
				const failed = isCommandFailure?.(value) ?? inferredFailure !== undefined;
				if (isRecord(value)) loggedFailures.set(value, failed ? inferredFailure ?? value : undefined);
				logger[failed ? "error" : "info"]({
					command,
					durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
					status: failed ? "error" : "ok"
				}, failed ? "CLI command failed" : "CLI command completed");
				if (failed) process.exitCode = 1;
				return value;
			} catch (cause) {
				process.exitCode = 1;
				logger.error({
					command,
					durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
					status: "error"
				}, "CLI command failed");
				if (cause instanceof AnalysisError) {
					process.exitCode = 1;
					return projectAnalysisError(cause);
				}
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/jsonSerialization.js
/** Encode ordinary JSON as bounded string parts without a document-sized allocation. */
function* jsonParts(value, pretty = false) {
	yield* encodeValue(value, pretty, false);
}
/** Encode validated JSON with canonical key ordering without allocating the whole document. */
function* canonicalJsonParts(value) {
	yield* encodeValue(value, false, true);
}
/** Buffer JSON parts while preserving complete UTF-16 surrogate pairs. */
function* bufferedJsonParts(parts) {
	let buffer = "";
	for (const part of parts) {
		if (buffer.length + part.length > 64 * 1024 && buffer !== "") {
			yield buffer;
			buffer = "";
		}
		buffer += part;
	}
	if (buffer !== "") yield buffer;
}
function* encodeString(value) {
	if (value.length <= 8192) {
		yield JSON.stringify(value);
		return;
	}
	yield "\"";
	for (let start = 0; start < value.length;) {
		let end = Math.min(start + 8192, value.length);
		const last = value.charCodeAt(end - 1);
		const next = value.charCodeAt(end);
		if (end < value.length && last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end -= 1;
		yield JSON.stringify(value.slice(start, end)).slice(1, -1);
		start = end;
	}
	yield "\"";
}
/**
* Encode iteratively into bounded parts. Recursive `yield*` delegation passed
* every token through one generator frame per nesting level, which dominated
* the cost of writing large nested results.
*/
function* encodeValue(root, pretty, canonical) {
	const ancestors = new Set();
	const stack = [];
	let buffer = "";
	let pending = root;
	let hasPending = true;
	while (true) {
		if (hasPending) {
			hasPending = false;
			const text = scalarText(pending);
			if (text !== undefined) buffer += text;
			else if (typeof pending === "string") {
				if (buffer !== "") yield buffer;
				buffer = "";
				yield* encodeString(pending);
			} else {
				const frame = openContainer(pending, stack.length, ancestors, canonical);
				stack.push(frame);
				buffer += frame.array ? "[" : "{";
			}
		}
		if (buffer.length >= PART_CHARACTERS) {
			yield buffer;
			buffer = "";
		}
		const frame = stack.at(-1);
		if (frame === undefined) break;
		const member = nextMember(frame);
		if (member === undefined) {
			if (pretty && frame.written > 0) buffer += indent(frame.depth);
			buffer += frame.array ? "]" : "}";
			ancestors.delete(frame.value);
			stack.pop();
			continue;
		}
		if (frame.written > 0) buffer += ",";
		if (pretty) buffer += indent(frame.depth + 1);
		if (member.key !== undefined) {
			const key = scalarText(member.key);
			if (key !== undefined) buffer += key;
			else {
				if (buffer !== "") yield buffer;
				buffer = "";
				yield* encodeString(member.key);
			}
			buffer += pretty ? ": " : ":";
		}
		frame.written += 1;
		pending = member.item;
		hasPending = true;
	}
	if (buffer !== "") yield buffer;
}
var PART_CHARACTERS, indentation, indent, scalarText, openContainer, nextMember;
function init_jsonSerialization() {
	return (init_jsonSerialization = __esmMin((() => {
		PART_CHARACTERS = 16 * 1024;
		indentation = [];
		indent = (depth) => indentation[depth] ??= `\n${"  ".repeat(depth)}`;
		scalarText = (value) => {
			if (typeof value === "string") return value.length <= 8192 ? JSON.stringify(value) : undefined;
			if (value === null) return "null";
			if (typeof value === "boolean") return String(value);
			if (typeof value === "number" && Number.isFinite(value)) return String(value);
			return undefined;
		};
		openContainer = (value, depth, ancestors, canonical) => {
			if (typeof value !== "object" || value === null) throw new TypeError("JSON output requires ordinary JSON values");
			if (ancestors.has(value)) throw new TypeError("JSON output contains a circular reference");
			const array = Array.isArray(value);
			if (!array && Object.prototype.toString.call(value) !== "[object Object]") throw new TypeError("JSON output requires ordinary JSON objects");
			ancestors.add(value);
			const keys = array ? undefined : Object.keys(value);
			if (canonical) keys?.sort();
			const count = array ? value.length : keys?.length ?? 0;
			return {
				value,
				array,
				keys,
				count,
				depth,
				index: 0,
				written: 0
			};
		};
		nextMember = (frame) => {
			while (frame.index < frame.count) {
				const index = frame.index;
				frame.index += 1;
				if (frame.array) return {
					key: undefined,
					item: Reflect.get(frame.value, index)
				};
				const key = frame.keys?.[index];
				if (key === undefined) throw new TypeError("JSON object changed during serialization");
				const item = Reflect.get(frame.value, key);
				if (item !== undefined && typeof item !== "function" && typeof item !== "symbol") return {
					key,
					item
				};
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/cli/jsonOutput.js
/** The exact formatted document, including its final newline. */
function* jsonOutputParts(value, format, pretty = true) {
	if (format === "jsonl" && Array.isArray(value)) {
		for (const item of value) {
			yield* jsonParts(item);
			yield "\n";
		}
		return;
	}
	yield* jsonParts(value, pretty && format === "json");
	yield "\n";
}
var writeJsonOutput, isTerminal, writeOutputText;
function init_jsonOutput() {
	return (init_jsonOutput = __esmMin((() => {
		init_jsonSerialization();
		writeJsonOutput = async (value, destination, format = "json") => {
			for (const part of bufferedJsonParts(jsonOutputParts(value, format, isTerminal(destination)))) await writeOutputText(destination, part);
		};
		isTerminal = (destination) => "isTTY" in destination && destination.isTTY === true;
		writeOutputText = (destination, part) => new Promise((resolve, reject) => {
			const onError = (cause) => reject(cause);
			destination.once("error", onError);
			try {
				destination.write(part, (cause) => {
					if (cause) {
						setImmediate(() => destination.off("error", onError));
						reject(cause);
					} else {
						destination.off("error", onError);
						resolve();
					}
				});
			} catch (cause) {
				destination.off("error", onError);
				reject(cause);
			}
		});
	})))();
}

//#endregion
//#region dist/cli/cliResultOutput.js
var registeredCommands, streamCliCommandResults, wrapCommands, wrapCommand, createCliResultOutput, fullFailureEnvelope;
function init_cliResultOutput() {
	return (init_cliResultOutput = __esmMin((() => {
		init_cliOutput();
		init_cliLogging();
		init_analysisErrorCore();
		init_analysisErrorProjection();
		init_jsonOutput();
		registeredCommands = Cli.toCommands;
		streamCliCommandResults = (cli, output) => {
			const commands = registeredCommands.get(cli);
			if (commands !== undefined) wrapCommands(commands, [], output);
		};
		wrapCommands = (commands, parents, output) => {
			for (const [name, entry] of commands) {
				const path = [...parents, name];
				if ("_group" in entry) {
					wrapCommands(entry.commands, path, output);
					if (entry.root !== undefined) wrapCommand(entry.root, path.join(" "), output);
				} else if (!("_alias" in entry) && !("_fetch" in entry)) wrapCommand(entry, path.join(" "), output);
			}
		};
		wrapCommand = (command, name, output) => {
			const run = command.run;
			command.run = (context) => {
				const started = performance.now();
				const result = run(context);
				if (typeof result === "object" && result !== null && Symbol.asyncIterator in result) return result;
				return Promise.resolve(result).then(async (value) => {
					if (typeof value === "object" && value !== null && Symbol.for("incur.sentinel") in value) return value;
					if (!await output.write(value, {
						command: name,
						format: context.format,
						duration: `${Math.round(performance.now() - started)}ms`
					})) return value;
					if (output.error !== undefined) return context.error({
						code: output.error.code,
						message: output.error.message
					});
					return undefined;
				});
			};
		};
		createCliResultOutput = (arguments_, destination) => {
			const options = parseCliOutputArguments(arguments_);
			if (options.parseError || !validateCliOutputArguments(arguments_).ok) return undefined;
			const format = options.format;
			let handled = false;
			let failed = false;
			let error;
			return {
				get handled() {
					return handled;
				},
				get failed() {
					return failed;
				},
				get error() {
					return error;
				},
				async write(value, metadata) {
					if (metadata.format !== format) return false;
					const failure = options.fullOutput ? cliOperationFailurePayload(value) : undefined;
					const filtered = options.filterOutput ? Filter.apply(value, Filter.parse(options.filterOutput)) : value;
					if (format !== "json" && format !== "jsonl" && failure === undefined) return false;
					if (options.tokenCount) {
						const tokenValue = failure ?? filtered;
						let characters = 0;
						if (tokenValue !== undefined && tokenValue !== null && typeof tokenValue !== "function" && typeof tokenValue !== "symbol") {
							if (format === "json" || format === "jsonl") {
								for (const part of jsonOutputParts(tokenValue, format, format === "json")) characters += part.length;
								characters = Math.max(0, characters - 1);
							}
						}
						if (characters <= constants.MAX_STRING_LENGTH) {
							if (failure === undefined) return false;
							handled = true;
							try {
								await writeOutputText(destination, `${estimateTokenCount(Formatter.format(failure, format))}\n`);
								return true;
							} catch (cause) {
								failed = true;
								throw cause;
							}
						}
						error = projectAnalysisError(new AnalysisResourceConstraintError(metadata.command, "memory", "Token counting requires a formatted string larger than the runtime permits.", {
							formatted_characters: characters,
							max_string_characters: constants.MAX_STRING_LENGTH
						}, { remediationAction: "Remove --token-count to stream the complete JSON result, or narrow it with --filter-output." }));
					}
					const meta = {
						command: metadata.command,
						duration: metadata.duration
					};
					const errorDocument = options.fullOutput && failure !== undefined ? fullFailureEnvelope(failure, meta, format, options.tokenLimit, options.tokenOffset) : undefined;
					const document = options.fullOutput ? failure !== undefined ? errorDocument : filtered === undefined ? {
						ok: true,
						meta
					} : {
						ok: true,
						data: filtered,
						meta
					} : filtered === undefined || typeof filtered === "function" || typeof filtered === "symbol" ? {} : filtered;
					handled = true;
					try {
						if (failure !== undefined && format !== "json" && format !== "jsonl") {
							await writeOutputText(destination, `${Formatter.format(document, format)}\n`);
						} else {
							await writeJsonOutput(error === undefined ? document : options.fullOutput ? {
								ok: false,
								error,
								meta
							} : error, destination, format);
						}
					} catch (cause) {
						failed = true;
						throw cause;
					}
					return true;
				}
			};
		};
		fullFailureEnvelope = (failure, meta, format, tokenLimit, tokenOffset) => {
			if (tokenLimit === undefined && tokenOffset === undefined) return {
				ok: false,
				error: failure,
				meta
			};
			const formatted = Formatter.format(failure, format);
			const total = estimateTokenCount(formatted);
			const offset = tokenOffset ?? 0;
			const end = tokenLimit === undefined ? total : offset + tokenLimit;
			if (offset === 0 && end >= total) return {
				ok: false,
				error: failure,
				meta
			};
			const actualEnd = Math.min(end, total);
			const nextOffset = actualEnd < total ? actualEnd : undefined;
			return {
				ok: false,
				error: `${sliceByTokens(formatted, offset, end)}\n[truncated: showing tokens ${offset}–${actualEnd} of ${total}]`,
				meta: {
					...meta,
					...nextOffset === undefined ? {} : { nextOffset }
				}
			};
		};
	})))();
}

//#endregion
export { bufferedJsonParts, canonicalJsonParts, createCliResultOutput, init_analysisErrorProjection, init_cliLogging, init_cliResultOutput, init_jsonSerialization, isCliOperationFailure, jsonParts, logCliCommand, projectAnalysisError, streamCliCommandResults };