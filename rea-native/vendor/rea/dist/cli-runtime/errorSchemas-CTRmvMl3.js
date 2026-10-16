import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";
import { types } from "node:util";

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
//#region dist/domain/immutableJson.js
/**
* Seal exclusively owned JSON in bounded steps, authenticating only completion.
* Abandonment or failure can leave the provisional input partly frozen.
*/
function* freezeOwnedJsonSnapshotSteps(value) {
	const pending = [{
		value,
		exiting: false
	}];
	const visited = new Set();
	const ancestors = new Set();
	let examined = 0;
	try {
		while (pending.length > 0) {
			if (examined++ === 4096) {
				examined = 0;
				yield;
			}
			const entry = pending.pop();
			if (entry === undefined) break;
			const item = entry.value;
			if (entry.exiting && typeof item === "object" && item !== null) {
				ancestors.delete(item);
				visited.add(item);
				continue;
			}
			if (isImmutableJsonSnapshot(item)) continue;
			if (typeof item !== "object" || item === null) throw new TypeError("Immutable JSON snapshots require JSON values");
			if (ancestors.has(item)) throw new TypeError("Immutable JSON snapshots cannot contain circular references");
			if (visited.has(item)) continue;
			ancestors.add(item);
			pending.push({
				value: item,
				exiting: true
			});
			pushSnapshotChildren(item, pending);
			Object.freeze(item);
		}
		if (typeof value === "object" && value !== null) immutableSnapshots.add(value);
		return value;
	} finally {
		pending.length = 0;
		visited.clear();
		ancestors.clear();
	}
}
var immutableSnapshots, isImmutableJsonSnapshot, freezeJsonSnapshot, pushSnapshotChildren;
function init_immutableJson() {
	return (init_immutableJson = __esmMin((() => {
		immutableSnapshots = new WeakSet();
		isImmutableJsonSnapshot = (value) => value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value) || typeof value === "object" && immutableSnapshots.has(value);
		freezeJsonSnapshot = (value) => {
			const pending = [{
				value,
				exiting: false
			}];
			const visited = new Set();
			const ancestors = new Set();
			const objects = [];
			while (pending.length > 0) {
				const entry = pending.pop();
				if (entry === undefined) break;
				const item = entry.value;
				if (entry.exiting && typeof item === "object" && item !== null) {
					ancestors.delete(item);
					visited.add(item);
					objects.push(item);
					continue;
				}
				if (isImmutableJsonSnapshot(item)) continue;
				if (typeof item !== "object" || item === null) throw new TypeError("Immutable JSON snapshots require JSON values");
				if (ancestors.has(item)) throw new TypeError("Immutable JSON snapshots cannot contain circular references");
				if (visited.has(item)) continue;
				ancestors.add(item);
				pending.push({
					value: item,
					exiting: true
				});
				pushSnapshotChildren(item, pending);
			}
			for (const item of objects) Object.freeze(item);
			if (typeof value === "object" && value !== null) immutableSnapshots.add(value);
			return value;
		};
		pushSnapshotChildren = (item, pending) => {
			const prototype = Object.getPrototypeOf(item);
			if (!Array.isArray(item) && prototype !== Object.prototype && prototype !== null) throw new TypeError("Immutable JSON snapshots require ordinary objects");
			if (Array.isArray(item)) {
				for (let index = 0; index < item.length; index += 1) if (!Object.hasOwn(item, index)) throw new TypeError("Immutable JSON snapshots cannot contain sparse arrays");
			}
			for (const key of Object.getOwnPropertyNames(item)) {
				const descriptor = Object.getOwnPropertyDescriptor(item, key);
				if (descriptor === undefined || !Object.hasOwn(descriptor, "value")) throw new TypeError("Immutable JSON snapshots cannot contain accessors");
				const child = descriptor.value;
				pending.push({
					value: child,
					exiting: false
				});
			}
		};
	})))();
}

//#endregion
//#region dist/domain/jsonValue.js
/** Validate JSON in bounded steps; cache only authenticated immutable roots. */
function* jsonValueValidationSteps(root) {
	const immutable = typeof root === "object" && root !== null && isImmutableJsonSnapshot(root) ? root : undefined;
	if (immutable !== undefined && immutableValidation.has(immutable)) return immutableValidation.get(immutable);
	const finish = (issue) => {
		if (immutable !== undefined) immutableValidation.set(immutable, issue);
		return issue;
	};
	const pending = [{
		value: root,
		depth: 0
	}];
	let examined = 0;
	while (pending.length > 0) {
		if (examined++ === 4096) {
			examined = 0;
			yield;
		}
		const item = pending.pop();
		if (item === undefined) break;
		if (item.depth > 1e3) return finish(`JSON value exceeds maximum nesting depth of ${MAX_JSON_DEPTH}`);
		const value = item.value;
		if (typeof value === "object" && value !== null && types.isProxy(value)) return finish("JSON values cannot contain proxies");
		if (value === null || typeof value === "string" || typeof value === "boolean") continue;
		if (typeof value === "number") {
			if (!Number.isFinite(value)) return finish("JSON numbers must be finite");
		} else if (Array.isArray(value)) {
			for (let index = 0; index < value.length; index += 1) {
				const descriptor = Object.getOwnPropertyDescriptor(value, index);
				if (descriptor === undefined || !Object.hasOwn(descriptor, "value")) return finish("JSON arrays require dense data properties without accessors");
				pending.push({
					value: descriptor.value,
					depth: item.depth + 1
				});
			}
		} else if (isRecord(value)) {
			const prototype = Object.getPrototypeOf(value);
			if (prototype !== Object.prototype && prototype !== null) return finish("JSON objects require ordinary data properties");
			for (const key of Reflect.ownKeys(value)) {
				const descriptor = Object.getOwnPropertyDescriptor(value, key);
				if (descriptor?.enumerable !== true) continue;
				if (typeof key !== "string") return finish("JSON object keys must be strings");
				if (!Object.hasOwn(descriptor, "value")) return finish("JSON objects cannot contain accessors");
				pending.push({
					value: descriptor.value,
					depth: item.depth + 1
				});
			}
		} else return finish("Invalid JSON value");
	}
	return finish(undefined);
}
var MAX_JSON_DEPTH, isRecord, immutableValidation, jsonValueValidationIssue, preserveJsonValue, validatedJsonValue, jsonValueSchema, objectValidation, objectProjection, jsonObjectSchema;
function init_jsonValue() {
	return (init_jsonValue = __esmMin((() => {
		init_immutableJson();
		MAX_JSON_DEPTH = 1e3;
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		immutableValidation = new WeakMap();
		jsonValueValidationIssue = (root) => {
			const steps = jsonValueValidationSteps(root);
			for (;;) {
				const step = steps.next();
				if (step.done) return step.value;
			}
		};
		preserveJsonValue = (value) => {
			const immutableCandidate = value;
			if (isImmutableJsonSnapshot(immutableCandidate)) return value;
			if (Array.isArray(value)) {
				const copy = [];
				for (let index = 0; index < value.length; index += 1) copy.push(preserveJsonValue(value[index]));
				return copy;
			}
			if (value !== null && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, preserveJsonValue(child)]));
			return value;
		};
		validatedJsonValue = z.unknown().superRefine((value, context) => {
			const issue = jsonValueValidationIssue(value);
			if (issue !== undefined) context.addIssue({
				code: "custom",
				message: issue,
				continue: false
			});
		}).transform((value) => value);
		validatedJsonValue._zod.toJSONSchema = () => ({});
		jsonValueSchema = z.unknown().nonoptional().pipe(validatedJsonValue).transform(preserveJsonValue);
		jsonValueSchema._zod.toJSONSchema = () => ({});
		objectValidation = z.custom(isRecord, "Expected JSON object");
		objectProjection = () => ({
			type: "object",
			additionalProperties: {}
		});
		objectValidation._zod.toJSONSchema = objectProjection;
		jsonObjectSchema = jsonValueSchema.pipe(objectValidation);
		jsonObjectSchema._zod.toJSONSchema = objectProjection;
	})))();
}

//#endregion
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
//#region dist/domain/providerOperationHealth.js
var PROVIDER_OPERATION_STATES, PROVIDER_RETRY_ACTIONS, PROVIDER_FAILURE_STAGES, providerRetryAction, sharedProviderFailureStage;
function init_providerOperationHealth() {
	return (init_providerOperationHealth = __esmMin((() => {
		PROVIDER_OPERATION_STATES = [
			"idle",
			"busy",
			"exited",
			"unreachable",
			"not_started",
			"unknown"
		];
		PROVIDER_RETRY_ACTIONS = [
			"retry",
			"wait",
			"restart_provider",
			"unknown"
		];
		PROVIDER_FAILURE_STAGES = [
			"launch",
			"connection",
			"analysis",
			"decompilation",
			"unknown"
		];
		providerRetryAction = (state, startupFailure = false) => {
			if (state === "idle") return null;
			if (startupFailure && state === "exited") return "retry";
			switch (state) {
				case "busy": return "wait";
				case "exited":
				case "unreachable": return "restart_provider";
				case "not_started": return "retry";
				case "unknown": return "unknown";
			}
		};
		sharedProviderFailureStage = (requests) => {
			const first = requests[0]?.stage;
			if (first === undefined) return null;
			return requests.every((request) => request.stage === first) ? first : "unknown";
		};
	})))();
}

//#endregion
//#region dist/contracts/errorSchemas.js
var categorySchema, remediationSchema, common, genericDetails, generic, analysisErrorProjectionSchema, analysisCliErrorEnvelopeSchema, analysisErrorJsonSchema;
function init_errorSchemas() {
	return (init_errorSchemas = __esmMin((() => {
		init_jsonValue();
		categorySchema = z.enum([
			"invalid_input",
			"unsupported_provider",
			"unsupported_target",
			"integrity_mismatch",
			"truncated",
			"cancelled",
			"timeout",
			"resource_constraint",
			"unavailable",
			"execution_failure"
		]);
		remediationSchema = z.object({ action: z.string().min(1) }).strict();
		common = {
			category: categorySchema,
			message: z.string().min(1),
			retryable: z.boolean(),
			remediation: remediationSchema
		};
		genericDetails = z.record(z.string(), jsonValueSchema).optional();
		generic = (code) => z.object({
			code: z.literal(code),
			...common,
			details: genericDetails
		}).strict();
		analysisErrorProjectionSchema = z.discriminatedUnion("code", [
			generic("invalid_request"),
			generic("access_denied"),
			generic("artifact_changed"),
			generic("unreadable_output"),
			generic("capability_unavailable"),
			generic("unsupported_target"),
			generic("provider_unavailable"),
			generic("provider_timeout"),
			generic("resource_constraint"),
			generic("cancelled"),
			z.object({
				code: z.literal("artifact_integrity_mismatch"),
				...common,
				details: z.object({
					logical_path: z.string(),
					declared_sha256: z.string().nullable(),
					calculated_sha256: z.string().nullable(),
					unpacked: z.boolean()
				}).strict()
			}).strict(),
			generic("artifact_operation_failed"),
			generic("evidence_integrity_mismatch"),
			generic("truncated"),
			generic("process_capture_failed"),
			generic("cleanup_incomplete"),
			generic("revision_conflict"),
			generic("configuration_invalid"),
			generic("target_unavailable"),
			generic("execution_failure")
		]);
		analysisCliErrorEnvelopeSchema = z.object({
			error: z.string().min(1),
			input_path: z.string().optional(),
			input_reason: z.enum([
				"invalid-json",
				"read-failed",
				"too-large"
			]).optional()
		}).passthrough().superRefine((value, context) => {
			const { error: _label, input_path: _inputPath, input_reason: _inputReason, ...projection } = value;
			const parsed = analysisErrorProjectionSchema.safeParse(projection);
			if (!parsed.success) {
				context.addIssue({
					code: "custom",
					message: "CLI error envelope must contain a canonical analysis error projection"
				});
			}
		});
		analysisErrorJsonSchema = z.toJSONSchema(analysisErrorProjectionSchema);
	})))();
}

//#endregion
export { ANALYSIS_RESOURCE_KINDS, AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisProtocolError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, BinaryTargetError, ConfigurationError, MAX_JSON_DEPTH, NoBinaryOpenError, PROVIDER_FAILURE_STAGES, PROVIDER_OPERATION_STATES, PROVIDER_RETRY_ACTIONS, analysisCliErrorEnvelopeSchema, analysisErrorProjectionSchema, freezeJsonSnapshot, freezeOwnedJsonSnapshotSteps, init_analysisErrorBase, init_analysisErrorCore, init_configurationErrors, init_errorSchemas, init_immutableJson, init_jsonValue, init_providerOperationHealth, isImmutableJsonSnapshot, jsonObjectSchema, jsonValueSchema, jsonValueValidationIssue, jsonValueValidationSteps, providerRetryAction, sharedProviderFailureStage };