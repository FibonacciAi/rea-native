import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, f as init_analysisErrorCore, g as init_result, h as err, i as AnalysisCancelledError, m as init_analysisErrorBase, p as AnalysisError } from "./analysisErrorCore-DXRTvF_m.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { _ as init_urlComponents, c as init_browserObservation, m as sanitizeBrowserUrl, s as browserOriginSchema, v as urlDeclaresQueryOrFragment } from "./webContentArtifact-Dzjc1z-R.js";
import { i as javascriptRuntimeTargetListSchema, r as javascriptRuntimeObservationSchema, t as init_javascriptRuntimeObservation$1 } from "./javascriptRuntimeObservation-PIUoLfX6.js";
import { d as scriptMetadataValues, i as init_CdpCaptureValues, n as cdpStringValue, o as numberValue, r as delayWithCancellation, s as recordValue } from "./CdpCaptureValues-M-j6CIh1.js";
import { d as readCdpJson, l as init_CdpEndpoint, n as init_CdpConnection, t as CdpConnection, u as parseCdpEndpointValue } from "./CdpConnection-BpDfz4MK.js";
import { n as init_providerIdentity, t as V8_INSPECTOR_PROVIDER_IDENTITY } from "./providerIdentity-BCQ5n5tw.js";
import { n as init_ElectronFileScope, t as authorizedElectronFile } from "./ElectronFileScope-BPG_YoyU.js";
import { pathToFileURL } from "node:url";
import { z } from "zod";
import { createHash } from "node:crypto";

//#region dist/inspector/JavaScriptRuntimeScope.js
var throwIfRuntimeObservationCancelled, inspectorExclusionKey, authorizeRuntimeLocation, projectReportedRuntimeUrl, authorizeRuntimeTargetLocation;
function init_JavaScriptRuntimeScope() {
	return (init_JavaScriptRuntimeScope = __esmMin((() => {
		init_browserObservation();
		init_analysisErrorCore();
		init_ElectronFileScope();
		throwIfRuntimeObservationCancelled = (signal) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError("observe_javascript_runtime");
		};
		inspectorExclusionKey = (reason) => {
			void reason;
			return "unsupported_location";
		};
		authorizeRuntimeLocation = async (value, signal) => {
			throwIfRuntimeObservationCancelled(signal);
			if (value.startsWith("file:")) {
				const filePath = await authorizedElectronFile(value);
				throwIfRuntimeObservationCancelled(signal);
				return filePath === undefined ? {
					allowed: false,
					reason: "not_approved"
				} : {
					allowed: true,
					location: {
						kind: "file",
						file_path: filePath
					}
				};
			}
			return projectReportedRuntimeUrl(value);
		};
		projectReportedRuntimeUrl = (value) => {
			if (value.startsWith("node:") && value.length > 0) return {
				allowed: true,
				location: {
					kind: "builtin",
					specifier: value
				}
			};
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return {
					allowed: false,
					reason: "unsupported_url"
				};
			}
			if (!["http:", "https:"].includes(url.protocol)) return {
				allowed: false,
				reason: "unsupported_url"
			};
			const parsedOrigin = browserOriginSchema.safeParse(url.origin);
			if (!parsedOrigin.success) return {
				allowed: false,
				reason: "unsupported_url"
			};
			return {
				allowed: true,
				location: {
					kind: "url",
					origin: parsedOrigin.data,
					sanitized_url: sanitizeBrowserUrl(value).url
				}
			};
		};
		authorizeRuntimeTargetLocation = async (value, context) => {
			if (context.type !== "node" || !/^node\.js\/v/iu.test(context.product) || !value.startsWith("file://")) return authorizeRuntimeLocation(value);
			const reportedPath = value.slice("file://".length);
			if (!reportedPath.startsWith("/") && !/^[a-z]:[/\\_]/iu.test(reportedPath)) return authorizeRuntimeLocation(value);
			if (process.platform !== "win32" && !/[_"\\]/u.test(reportedPath)) {
				if (reportedPath.startsWith("/")) {
					const decision = await authorizeRuntimeLocation(pathToFileURL(reportedPath).href);
					if (decision.allowed) return decision;
				}
			}
			return {
				allowed: true,
				location: {
					kind: "unresolved",
					reported_url: value,
					reason: "unverifiable-file-location"
				}
			};
		};
	})))();
}

//#endregion
//#region dist/inspector/V8InspectorCaptureProjection.js
var createInspectorExclusionCounts, describeInspectorTargetLimitations, LOCATION_AUTHORIZATION_WORKERS, finalizeInspectorCapture, scriptFromDraft, partialScriptLocation;
function init_V8InspectorCaptureProjection() {
	return (init_V8InspectorCaptureProjection = __esmMin((() => {
		init_JavaScriptRuntimeScope();
		createInspectorExclusionCounts = () => ({ unsupported_location: 0 });
		describeInspectorTargetLimitations = (attachmentStateUnknown = false) => [
			"REA attaches to an already-running exact target and never launches, resumes, evaluates, pauses, or mutates it.",
			"Only Runtime.enable and Debugger.enable are sent; source text, object values, EventEmitter activity, and Electron IPC are not inspected.",
			"The selected endpoint and target ID authorize observation; discovery file locations can remain unresolved and do not prove filesystem identity.",
			"Node discovery reports a best-effort pathname rather than an encoded file URL; lossy Windows paths and ambiguous underscores are preserved without guessing a file path.",
			"Every target exposed by the selected Inspector endpoint is eligible for observation; target IDs and locations are not authenticated as operating-system process identity.",
			...attachmentStateUnknown ? ["Inspector discovery did not report the target's current debugger attachment state; it is retained as unknown, and observation rejects only targets explicitly marked attached."] : [],
			"No runtime graph depth is traversed because passive Inspector events do not establish require/import caller edges."
		];
		LOCATION_AUTHORIZATION_WORKERS = 8;
		finalizeInspectorCapture = async ({ input, runtime, target, state, authorizeLocation = authorizeRuntimeLocation, locationMode = "verify", signal }) => {
			if (locationMode === "verify") throwIfRuntimeObservationCancelled(signal);
			const exclusions = createInspectorExclusionCounts();
			const scripts = new Map();
			const draftsByUrl = new Map();
			if (locationMode === "verify") for (const draft of state.scripts) {
				const drafts = draftsByUrl.get(draft.rawUrl) ?? [];
				drafts.push(draft);
				draftsByUrl.set(draft.rawUrl, drafts);
			}
			const groups = [...draftsByUrl];
			const authorizedGroups = new Array(groups.length);
			let nextGroup = 0;
			let stopScheduling = false;
			let unresolvedScripts = 0;
			const worker = async () => {
				try {
					for (;;) {
						if (stopScheduling) return;
						throwIfRuntimeObservationCancelled(signal);
						const index = nextGroup;
						nextGroup += 1;
						const group = groups[index];
						if (group === undefined) return;
						const [rawUrl, drafts] = group;
						authorizedGroups[index] = {
							drafts,
							decision: await authorizeLocation(rawUrl, signal)
						};
						throwIfRuntimeObservationCancelled(signal);
					}
				} catch (cause) {
					stopScheduling = true;
					throw cause;
				}
			};
			const workerResults = locationMode === "verify" ? await Promise.allSettled(Array.from({ length: Math.min(LOCATION_AUTHORIZATION_WORKERS, groups.length) }, worker)) : [];
			const failedWorker = workerResults.find((result) => result.status === "rejected");
			if (locationMode === "verify") throwIfRuntimeObservationCancelled(signal);
			if (failedWorker?.status === "rejected") throw failedWorker.reason;
			for (const group of authorizedGroups) {
				if (group === undefined) continue;
				const { drafts, decision } = group;
				for (const draft of drafts) {
					if (!decision.allowed) {
						exclusions[inspectorExclusionKey(decision.reason)] += 1;
						continue;
					}
					const script = scriptFromDraft(draft, decision.location);
					scripts.set(script.script_key, script);
				}
			}
			if (locationMode === "reported") for (const draft of state.scripts) {
				const location = partialScriptLocation(draft.rawUrl);
				if (location.kind === "unresolved") unresolvedScripts += 1;
				const script = scriptFromDraft(draft, location);
				scripts.set(script.script_key, script);
			}
			const items = [...scripts.values()].sort((left, right) => left.script_key < right.script_key ? -1 : left.script_key > right.script_key ? 1 : 0);
			const contexts = [...state.contexts.values()].map((context) => ({
				context_key: context.contextKey,
				state: context.state,
				name: context.name,
				origin: context.origin
			})).sort((left, right) => left.context_key < right.context_key ? -1 : left.context_key > right.context_key ? 1 : 0);
			if (locationMode === "verify") throwIfRuntimeObservationCancelled(signal);
			return {
				runtime,
				target: {
					target_id: target.id,
					protocol_type: target.type,
					attached: target.attached,
					location: target.location,
					runtime_kind: input.runtime_kind ?? "unknown",
					runtime_kind_authority: input.runtime_kind === undefined ? "not-declared" : "caller-declared-unverified"
				},
				capture: {
					observation_ms: input.observation_ms,
					events_observed: state.eventsObserved,
					events_retained: state.eventsRetained,
					events_dropped: state.eventsDropped,
					metadata_bytes_retained: state.metadataBytes,
					truncated: state.truncated,
					truncation_reasons: [...state.truncationReasons].sort()
				},
				scripts: {
					items,
					observed_total: state.scriptsObserved,
					excluded: {
						...exclusions,
						invalid_protocol_value: state.invalidScripts
					}
				},
				execution_contexts: contexts,
				directly_observed: ["Debugger.scriptParsed established script presence within the bounded capture window.", "Runtime execution-context lifecycle events established context creation, destruction, or clearing."],
				unavailable_without_instrumentation: [
					"require/import caller-to-callee edges",
					"EventEmitter emissions and listener invocation",
					"Electron IPC messages and handlers",
					"script unload events"
				],
				unknowns: [
					...target.location.kind === "unresolved" ? ["The discovery-reported file location cannot be verified; loaded script locations are resolved independently from Debugger.scriptParsed."] : [],
					...unresolvedScripts === 0 ? [] : [`${String(unresolvedScripts)} observed script location${unresolvedScripts === 1 ? " remains" : "s remain"} unverified; raw URLs and script metadata are retained.`],
					"Scripts collected before attachment may have been garbage-collected and therefore omitted.",
					"A bounded observation window cannot establish that an unobserved script or behavior never occurs.",
					"The declared Node/Electron process role is not authenticated by the Inspector protocol."
				],
				limitations: describeInspectorTargetLimitations(target.attached === null)
			};
		};
		scriptFromDraft = (draft, location) => {
			const stable = JSON.stringify({
				location,
				execution_context_key: draft.executionContextKey,
				cdp_hash: draft.cdpHash,
				length: draft.length,
				is_module: draft.isModule
			});
			return {
				script_key: `v8_script_${createHash("sha256").update(stable).digest("hex")}`,
				location,
				execution_context_key: draft.executionContextKey,
				cdp_hash: draft.cdpHash,
				length: draft.length,
				is_module: draft.isModule,
				status: "observed-loaded"
			};
		};
		partialScriptLocation = (reportedUrl) => {
			const projection = projectReportedRuntimeUrl(reportedUrl);
			if (projection.allowed) return projection.location;
			return {
				kind: "unresolved",
				reported_url: reportedUrl,
				reason: "location-authorization-not-attempted"
			};
		};
	})))();
}

//#endregion
//#region dist/inspector/V8InspectorEndpoint.js
var versionSchema, targetSchema, targetsSchema, discoverV8Inspector, validatedInspectorWebSocket;
function init_V8InspectorEndpoint() {
	return (init_V8InspectorEndpoint = __esmMin((() => {
		init_browserObservationError();
		init_urlComponents();
		init_CdpEndpoint();
		versionSchema = z.object({
			Browser: z.string().min(1),
			"Protocol-Version": z.string().min(1),
			"V8-Version": z.string().optional()
		}).passthrough();
		targetSchema = z.object({
			id: z.string().min(1),
			type: z.string().min(1),
			url: z.string(),
			attached: z.boolean().nullable().optional(),
			webSocketDebuggerUrl: z.unknown().optional()
		}).passthrough();
		targetsSchema = z.array(targetSchema);
		discoverV8Inspector = async (endpoint, operation, signal) => {
			const [versionInput, targetsInput] = await Promise.all([readCdpJson(new URL("/json/version", endpoint), operation, signal), readCdpJson(new URL("/json/list", endpoint), operation, signal)]);
			const version = parseCdpEndpointValue(versionSchema, versionInput, operation);
			const targets = parseCdpEndpointValue(targetsSchema, targetsInput, operation);
			return {
				runtime: {
					product: version.Browser,
					protocol_version: version["Protocol-Version"],
					v8_version: version["V8-Version"] ?? null
				},
				targets: targets.map((target) => ({
					id: target.id,
					type: target.type,
					url: target.url,
					attached: target.attached ?? null,
					webSocketUrl: validatedInspectorWebSocket(endpoint, target.id, target.webSocketDebuggerUrl)
				}))
			};
		};
		validatedInspectorWebSocket = (endpoint, targetId, reported) => {
			if (typeof reported !== "string" || reported.length === 0) return null;
			let socket;
			try {
				socket = new URL(reported);
			} catch {
				return null;
			}
			const trusted = new URL(endpoint);
			const allowedPaths = new Set([
				`/${targetId}`,
				`/devtools/node/${targetId}`,
				`/devtools/page/${targetId}`
			]);
			if (socket.protocol !== "ws:" || socket.port !== trusted.port || socket.username !== "" || socket.password !== "" || urlDeclaresQueryOrFragment(socket) || !allowedPaths.has(socket.pathname)) return null;
			socket.hostname = trusted.hostname;
			return socket.href;
		};
	})))();
}

//#endregion
//#region dist/inspector/V8InspectorProvider.js
var INSPECTOR_MAX_PAYLOAD_BYTES, INSPECTOR_MAX_RETAINED_METADATA_BYTES, RETAINED_OBJECT_OVERHEAD_BYTES, V8InspectorProvider, closeInspectorConnection, inspectorCleanupError, projectTarget, authorizedTarget, assertRuntimeKind, emptyCaptureState, ingestEvent, ingestScript, ingestContext, retainEvent, replaceRetainedMetadata, waitForCapture, retainedMetadataBytes, contextKey, providerError;
function init_V8InspectorProvider() {
	return (init_V8InspectorProvider = __esmMin((() => {
		init_javascriptRuntimeObservation$1();
		init_analysisErrorBase();
		init_browserObservationError();
		init_providerAdapterError();
		init_result();
		init_CdpCaptureValues();
		init_CdpConnection();
		init_JavaScriptRuntimeScope();
		init_V8InspectorCaptureProjection();
		init_V8InspectorEndpoint();
		init_providerIdentity();
		INSPECTOR_MAX_PAYLOAD_BYTES = 16 * 1024 * 1024;
		INSPECTOR_MAX_RETAINED_METADATA_BYTES = 8 * 1024 * 1024;
		RETAINED_OBJECT_OVERHEAD_BYTES = 512;
		V8InspectorProvider = class {
			identity() {
				return V8_INSPECTOR_PROVIDER_IDENTITY;
			}
			async listTargets(input, options = {}) {
				try {
					const discovery = await discoverV8Inspector(input.inspector_endpoint, "list_javascript_runtime_targets", options.signal);
					const allowed = [];
					const excluded = createInspectorExclusionCounts();
					let unconnectable = 0;
					for (const target of discovery.targets) {
						const decision = await authorizeRuntimeTargetLocation(target.url, {
							type: target.type,
							product: discovery.runtime.product
						});
						if (!decision.allowed) {
							excluded[inspectorExclusionKey(decision.reason)] += 1;
							continue;
						}
						if (decision.location.kind === "builtin") {
							excluded.unsupported_location += 1;
							continue;
						}
						if (target.webSocketUrl === null) {
							unconnectable += 1;
							continue;
						}
						allowed.push({
							id: target.id,
							type: target.type,
							url: target.url,
							attached: target.attached,
							webSocketUrl: target.webSocketUrl,
							location: decision.location
						});
					}
					allowed.sort((left, right) => left.id < right.id ? -1 : left.id > right.id ? 1 : 0);
					return ok(javascriptRuntimeTargetListSchema.parse({
						runtime: discovery.runtime,
						targets: allowed.map(projectTarget),
						excluded: {
							...excluded,
							unconnectable
						},
						limitations: describeInspectorTargetLimitations(allowed.some((target) => target.attached === null))
					}));
				} catch (cause) {
					return err(providerError(cause, "list_javascript_runtime_targets"));
				}
			}
			async observe(input, options = {}) {
				let connection;
				let discovery;
				let target;
				let state;
				let primaryFailure;
				let failed = false;
				let cleanupFailure;
				let cleanupFailed = false;
				let connectionClosePromise;
				let outcome;
				const closeConnection = () => {
					if (connection === undefined) return Promise.resolve();
					connectionClosePromise ??= closeInspectorConnection(connection, options.signal);
					return connectionClosePromise;
				};
				try {
					discovery = await discoverV8Inspector(input.inspector_endpoint, "observe_javascript_runtime", options.signal);
					target = await authorizedTarget(discovery.targets, input, discovery.runtime.product);
					if (input.runtime_kind !== undefined) assertRuntimeKind(target, input.runtime_kind);
					connection = await CdpConnection.connect(target.webSocketUrl, "observe_javascript_runtime", options.signal, { maxPayloadBytes: INSPECTOR_MAX_PAYLOAD_BYTES });
					const captureState = emptyCaptureState();
					state = captureState;
					const removeListener = connection.onEvent((event) => ingestEvent(event, captureState));
					try {
						await connection.send("Runtime.enable", {}, undefined, options.signal);
						await connection.send("Debugger.enable", {}, undefined, options.signal);
						await waitForCapture(connection, input.observation_ms, options.signal);
					} finally {
						removeListener();
					}
					const result = await finalizeInspectorCapture({
						input,
						runtime: discovery.runtime,
						target,
						state: captureState,
						...options.signal === undefined ? {} : { signal: options.signal }
					});
					outcome = ok(javascriptRuntimeObservationSchema.parse(result));
				} catch (cause) {
					failed = true;
					primaryFailure = cause;
					let error = providerError(cause, "observe_javascript_runtime");
					if (state !== undefined && discovery !== undefined && target !== undefined && (cause instanceof BrowserObservationError || options.signal?.aborted === true)) {
						const reason = options.signal?.aborted === true ? "cancelled" : cause instanceof BrowserObservationError ? cause.reason : "protocol_error";
						try {
							await closeConnection();
						} catch (cause) {
							cleanupFailed = true;
							cleanupFailure = cause;
						}
						try {
							const partialObservation = await finalizeInspectorCapture({
								input,
								runtime: discovery.runtime,
								target,
								state,
								locationMode: "reported"
							});
							error = new BrowserObservationError("observe_javascript_runtime", reason, {
								cause: error,
								...error.userMessage === undefined ? {} : { detail: error.userMessage },
								partialObservation
							});
						} catch (projectionFailure) {
							error = new BrowserObservationError("observe_javascript_runtime", reason, {
								cause: new AggregateError([error, projectionFailure], "Inspector failure and partial-observation projection both failed"),
								detail: `${error.message} Partial observations could not be projected.`
							});
						}
					}
					outcome = err(error);
				} finally {
					if (connection !== undefined) try {
						await closeConnection();
					} catch (cause) {
						cleanupFailed = true;
						cleanupFailure = cause;
					}
				}
				if (cleanupFailed) {
					return err(inspectorCleanupError(primaryFailure, cleanupFailure, failed, outcome?.ok === true ? outcome.value : outcome?.ok === false ? outcome.error.partialObservation : undefined));
				}
				return outcome ?? err(new BrowserObservationError("observe_javascript_runtime", "protocol_error"));
			}
		};
		closeInspectorConnection = async (connection, signal) => {
			const closing = connection.close();
			void closing.catch(() => undefined);
			if (signal === undefined) return await closing;
			let onAbort;
			const cancelled = new Promise((resolve) => {
				onAbort = () => resolve();
				signal.addEventListener("abort", onAbort, { once: true });
				if (signal.aborted) onAbort();
			});
			try {
				await Promise.race([closing, cancelled]);
			} finally {
				if (onAbort !== undefined) signal.removeEventListener("abort", onAbort);
			}
		};
		inspectorCleanupError = (primaryFailure, cleanupFailure, hasPrimaryFailure, partialObservation) => {
			const cause = hasPrimaryFailure ? new AggregateError([primaryFailure, cleanupFailure], "Inspector observation and cleanup both failed") : cleanupFailure;
			const cleanupReason = cleanupFailure instanceof Error ? cleanupFailure.message : String(cleanupFailure);
			return new BrowserObservationError("observe_javascript_runtime", "cleanup_failed", {
				cause,
				cleanup: {
					reason: cleanupReason,
					resources: ["browser_transport"]
				},
				...partialObservation === undefined ? {} : { partialObservation }
			});
		};
		projectTarget = (target) => ({
			target_id: target.id,
			protocol_type: target.type,
			attached: target.attached,
			location: target.location
		});
		authorizedTarget = async (targets, input, product) => {
			const target = targets.find(({ id }) => id === input.target_id);
			if (target === undefined) throw new BrowserObservationError("observe_javascript_runtime", "target_not_found");
			const decision = await authorizeRuntimeTargetLocation(target.url, {
				type: target.type,
				product
			});
			if (target.attached === true || !decision.allowed || decision.location.kind === "builtin") throw new BrowserObservationError("observe_javascript_runtime", "target_not_allowed");
			if (target.webSocketUrl === null) throw new BrowserObservationError("observe_javascript_runtime", "invalid_endpoint_response", { detail: "The selected Inspector target has no validated direct WebSocket endpoint." });
			return {
				id: target.id,
				type: target.type,
				url: target.url,
				attached: target.attached,
				webSocketUrl: target.webSocketUrl,
				location: decision.location
			};
		};
		assertRuntimeKind = (target, kind) => {
			const accepted = kind === "electron-preload" || kind === "electron-renderer" ? target.type === "page" : target.type === "node";
			if (!accepted) throw new BrowserObservationError("observe_javascript_runtime", "target_not_allowed");
		};
		emptyCaptureState = () => ({
			scripts: [],
			contexts: new Map(),
			eventsObserved: 0,
			eventsRetained: 0,
			eventsDropped: 0,
			metadataBytes: 0,
			scriptsObserved: 0,
			invalidScripts: 0,
			truncated: false,
			truncationReasons: new Set()
		});
		ingestEvent = (event, state) => {
			if (event.method !== "Debugger.scriptParsed" && event.method !== "Debugger.scriptFailedToParse" && event.method !== "Runtime.executionContextCreated" && event.method !== "Runtime.executionContextDestroyed" && event.method !== "Runtime.executionContextsCleared") return;
			state.eventsObserved += 1;
			if (event.method === "Debugger.scriptParsed") {
				ingestScript(event, state);
				return;
			}
			if (event.method === "Debugger.scriptFailedToParse") {
				state.invalidScripts += 1;
				retainEvent(state, 0);
				return;
			}
			ingestContext(event, state);
		};
		ingestScript = (event, state) => {
			state.scriptsObserved += 1;
			const value = recordValue(event.params);
			const rawUrl = cdpStringValue(value?.url);
			if (rawUrl === undefined) {
				state.invalidScripts += 1;
				retainEvent(state, 0);
				return;
			}
			const metadata = scriptMetadataValues(value);
			const draft = {
				rawUrl,
				executionContextKey: contextKey(value?.executionContextId),
				cdpHash: metadata.hash,
				length: metadata.length,
				isModule: metadata.isModule
			};
			const bytes = retainedMetadataBytes(draft);
			if (!retainEvent(state, bytes)) return;
			state.scripts.push(draft);
		};
		ingestContext = (event, state) => {
			if (event.method === "Runtime.executionContextsCleared") {
				let byteDelta = 0;
				for (const context of state.contexts.values()) {
					byteDelta += retainedMetadataBytes({
						...context,
						state: "cleared"
					}) - retainedMetadataBytes(context);
				}
				if (replaceRetainedMetadata(state, byteDelta)) {
					for (const context of state.contexts.values()) context.state = "cleared";
					retainEvent(state, 0);
				}
				return;
			}
			const parameters = recordValue(event.params);
			const runtimeContext = event.method === "Runtime.executionContextCreated" ? recordValue(parameters?.context) : parameters;
			const key = contextKey(event.method === "Runtime.executionContextCreated" ? runtimeContext?.id : runtimeContext?.executionContextId);
			if (key === null) {
				retainEvent(state, 0);
				return;
			}
			const previous = state.contexts.get(key);
			const created = event.method === "Runtime.executionContextCreated";
			const draft = {
				contextKey: key,
				state: created ? "created" : "destroyed",
				name: created ? cdpStringValue(runtimeContext?.name) ?? null : previous?.name ?? null,
				origin: created ? cdpStringValue(runtimeContext?.origin) ?? null : previous?.origin ?? null
			};
			const bytes = retainedMetadataBytes(draft) - (previous === undefined ? 0 : retainedMetadataBytes(previous));
			if (!retainEvent(state, bytes)) return;
			state.contexts.set(key, draft);
		};
		retainEvent = (state, bytes) => {
			if (!replaceRetainedMetadata(state, bytes)) return false;
			state.eventsRetained += 1;
			return true;
		};
		replaceRetainedMetadata = (state, byteDelta) => {
			if (state.metadataBytes + byteDelta > 8388608) {
				state.eventsDropped += 1;
				state.truncated = true;
				state.truncationReasons.add("retained_metadata_budget_exceeded");
				return false;
			}
			state.metadataBytes += byteDelta;
			return true;
		};
		waitForCapture = async (connection, observationMs, signal) => {
			let removeDisconnect = () => undefined;
			let removeProtocolFailure = () => undefined;
			const disconnected = new Promise((_resolve, reject) => {
				removeDisconnect = connection.onDisconnect((error) => reject(error));
			});
			const protocolFailure = new Promise((_resolve, reject) => {
				removeProtocolFailure = connection.onProtocolFailure((error) => reject(error));
			});
			const timerOwner = new AbortController();
			const timerSignal = signal === undefined ? timerOwner.signal : AbortSignal.any([signal, timerOwner.signal]);
			try {
				await Promise.race([
					delayWithCancellation(observationMs, "observe_javascript_runtime", timerSignal),
					disconnected,
					protocolFailure
				]);
			} finally {
				timerOwner.abort();
				removeDisconnect();
				removeProtocolFailure();
			}
		};
		retainedMetadataBytes = (value) => {
			const strings = "rawUrl" in value ? [
				value.rawUrl,
				value.rawUrl,
				value.executionContextKey,
				value.cdpHash
			] : [
				value.contextKey,
				value.name,
				value.origin
			];
			return RETAINED_OBJECT_OVERHEAD_BYTES + strings.reduce((total, text) => total + (text?.length ?? 0) * 2, 0);
		};
		contextKey = (value) => {
			const identifier = numberValue(value);
			return identifier !== undefined && Number.isSafeInteger(identifier) ? String(identifier) : null;
		};
		providerError = (cause, operation) => {
			if (cause instanceof AnalysisError) return cause;
			return new ProviderAdapterError(V8_INSPECTOR_PROVIDER_IDENTITY.id, operation, { cause });
		};
	})))();
}

//#endregion
//#region dist/composition/javascriptRuntimeObservation.js
var createJavaScriptRuntimeObservationProvider;
function init_javascriptRuntimeObservation() {
	return (init_javascriptRuntimeObservation = __esmMin((() => {
		init_V8InspectorProvider();
		createJavaScriptRuntimeObservationProvider = () => new V8InspectorProvider();
	})))();
}

//#endregion
init_javascriptRuntimeObservation();
export { createJavaScriptRuntimeObservationProvider };