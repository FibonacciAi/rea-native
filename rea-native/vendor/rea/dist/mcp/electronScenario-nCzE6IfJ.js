import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, g as init_result, h as err, m as init_analysisErrorBase, p as AnalysisError } from "./analysisErrorCore-DXRTvF_m.js";
import { a as verifyNoTokenOwnedProcesses, b as init_ProcessOwnershipProcessTree, c as observeOwnedProcessLineage, f as prepareProcessOwnershipInspection, m as systemProcessOwnershipHost, n as cleanupWindowsProcessTree, o as init_ProcessOwnershipObservation, r as init_ProcessOwnership, t as cleanupOwnedProcessGroup, x as selectCapturedProcessGroupIds } from "./ProcessOwnership-Bl_3ejLe.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { i as init_electronActiveObservation, n as electronActiveObservationResultSchema, r as electronActiveTimelineEventSchema } from "./electronActiveObservation-lDvQTMR0.js";
import { a as init_providerIdentities, i as PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY } from "./providerIdentities--ptAh481.js";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { randomUUID } from "node:crypto";

//#region dist/browser/PlaywrightElectronActiveActions.js
var OPERATION$1, hookSnapshotSchema, metricSchema, windowMetadataSchema, runElectronActions, runAction, actionWindowIndex, waitForWindow, emitDeepLink, readApplicationState, runWithExecutionLimits, safeActionErrorMessage;
function init_PlaywrightElectronActiveActions() {
	return (init_PlaywrightElectronActiveActions = __esmMin((() => {
		init_browserObservationError();
		init_electronActiveObservation();
		OPERATION$1 = "capture_electron_scenario";
		hookSnapshotSchema = z.strictObject({
			events: z.array(electronActiveTimelineEventSchema),
			retention_budget_bytes: z.number().int().min(0),
			estimated_retained_bytes: z.number().int().min(0),
			event_serialized_byte_upper_bound: z.number().int().min(0),
			retained: z.number().int().min(0),
			dropped: z.number().int().min(0),
			dropped_ipc: z.number().int().min(0),
			dropped_runtime: z.number().int().min(0),
			dropped_event_families: z.array(z.strictObject({
				family: z.string().min(1),
				count: z.number().int().min(1)
			})),
			dropped_event_roles: z.array(z.strictObject({
				role: z.string().min(1),
				count: z.number().int().min(1)
			})),
			observed: z.number().int().min(0),
			observed_ipc: z.number().int().min(0),
			observed_runtime: z.number().int().min(0),
			hook_error: z.boolean()
		});
		metricSchema = z.strictObject({
			pid: z.number().int().min(1),
			type: z.string().min(1),
			name: z.string().nullable(),
			service_name: z.string().nullable()
		});
		windowMetadataSchema = z.strictObject({
			window_id: z.string(),
			web_contents_id: z.string(),
			url: z.string(),
			title: z.string(),
			visible: z.boolean().nullable(),
			destroyed: z.boolean()
		});
		runElectronActions = async (application, input, options) => {
			const actions = [];
			for (const action of input.actions) {
				const actionStartedAt = performance.now();
				const windowIndex = actionWindowIndex(action);
				let selectedWindow;
				try {
					if (options.signal?.aborted === true) throw new BrowserObservationError(OPERATION$1, "cancelled");
					selectedWindow = windowIndex === null ? undefined : await waitForWindow({
						application,
						windowIndex,
						signal: options.signal
					});
					if ((action.kind === "click" || action.kind === "renderer-reload" || action.kind === "renderer-crash") && selectedWindow === undefined) throw new BrowserObservationError(OPERATION$1, "window_not_found");
					await runAction({
						application,
						action,
						selectedWindow,
						options
					});
					actions.push({
						step_id: action.step_id,
						kind: action.kind,
						window_index: windowIndex,
						target: selectedWindow === undefined ? null : `window:${String(windowIndex)}`,
						status: "completed",
						elapsed_ms: Math.max(0, Math.round(performance.now() - actionStartedAt)),
						error: null
					});
				} catch (cause) {
					actions.push({
						step_id: action.step_id,
						kind: action.kind,
						window_index: windowIndex,
						target: selectedWindow === undefined ? null : `window:${String(windowIndex)}`,
						status: options.signal?.aborted ? "cancelled" : "failed",
						elapsed_ms: Math.max(0, Math.round(performance.now() - actionStartedAt)),
						error: safeActionErrorMessage(cause)
					});
					break;
				}
			}
			return actions;
		};
		runAction = async ({ application, action, selectedWindow, options }) => {
			switch (action.kind) {
				case "click":
					if (selectedWindow === undefined) throw new BrowserObservationError(OPERATION$1, "window_not_found");
					await runWithExecutionLimits(selectedWindow.locator(action.selector).click({ timeout: 0 }), options.signal);
					return;
				case "wait": {
					const page = selectedWindow ?? await application.firstWindow({ timeout: 0 });
					await runWithExecutionLimits(page.waitForTimeout(action.duration_ms), options.signal);
					return;
				}
				case "renderer-reload":
					if (selectedWindow === undefined) throw new BrowserObservationError(OPERATION$1, "window_not_found");
					await runWithExecutionLimits(selectedWindow.reload({ timeout: 0 }), options.signal);
					return;
				case "renderer-crash": {
					const crashed = await runWithExecutionLimits(application.evaluate(({ BrowserWindow }, index) => {
						const candidate = BrowserWindow.getAllWindows()[index];
						if (candidate === undefined || candidate.isDestroyed()) return false;
						candidate.webContents.forcefullyCrashRenderer();
						return true;
					}, action.window_index), options.signal);
					if (!crashed) throw new BrowserObservationError(OPERATION$1, "window_not_found");
					return;
				}
				case "deep-link":
					await runWithExecutionLimits(emitDeepLink(application, action), options.signal);
					return;
			}
		};
		actionWindowIndex = (action) => {
			switch (action.kind) {
				case "click":
				case "renderer-reload":
				case "renderer-crash": return action.window_index;
				case "wait": return action.window_index ?? null;
				case "deep-link": return null;
			}
		};
		waitForWindow = async ({ application, windowIndex, signal }) => {
			while (true) {
				if (signal?.aborted === true) throw new BrowserObservationError(OPERATION$1, "cancelled");
				const window = application.windows()[windowIndex];
				if (window !== undefined) return window;
				await runWithExecutionLimits(new Promise((resolve) => setTimeout(resolve, 25)), signal);
			}
		};
		emitDeepLink = (application, action) => application.evaluate(({ app }, payload) => {
			if (payload.delivery === "open-url") return app.emit("open-url", { preventDefault: () => undefined }, payload.url);
			return app.emit("second-instance", {}, [payload.url], "", {});
		}, {
			delivery: action.delivery,
			url: action.url
		});
		readApplicationState = async (application) => {
			const windowMetadataPromise = application.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows().map((window) => ({
				window_id: `window:${String(window.id)}`,
				web_contents_id: `webContents:${String(window.webContents.id)}`,
				url: window.webContents.getURL(),
				title: window.webContents.getTitle(),
				visible: window.isDestroyed() ? null : window.isVisible(),
				destroyed: window.isDestroyed()
			}))).then((value) => z.array(windowMetadataSchema).parse(value));
			const processMetricsPromise = application.evaluate(({ app }) => app.getAppMetrics().map((metric) => ({
				pid: metric.pid,
				type: metric.type,
				name: metric.name ?? null,
				service_name: metric.serviceName ?? null
			}))).then((value) => z.array(metricSchema).parse(value));
			const electronVersionPromise = application.evaluate(() => process.versions.electron).then((value) => z.string().parse(value));
			const hookSnapshotPromise = application.evaluate(() => {
				const candidate = Reflect.get(globalThis, "__reaElectronActiveSnapshot");
				return typeof candidate === "function" ? candidate() : {
					events: [],
					retention_budget_bytes: 0,
					estimated_retained_bytes: 0,
					event_serialized_byte_upper_bound: 0,
					retained: 0,
					dropped: 0,
					dropped_ipc: 0,
					dropped_runtime: 0,
					dropped_event_families: [],
					dropped_event_roles: [],
					observed: 0,
					observed_ipc: 0,
					observed_runtime: 0,
					hook_error: true
				};
			}).then((value) => hookSnapshotSchema.parse(value));
			const [windowMetadata, processMetrics, electronVersion, hookSnapshot] = await Promise.all([
				windowMetadataPromise,
				processMetricsPromise,
				electronVersionPromise,
				hookSnapshotPromise
			]);
			return {
				windows: windowMetadata,
				metrics: processMetrics,
				electronVersion,
				hookSnapshot
			};
		};
		runWithExecutionLimits = async (operation, signal, deadline) => {
			if (signal?.aborted === true) throw new BrowserObservationError(OPERATION$1, "cancelled");
			if (signal === undefined && deadline === undefined) return operation;
			let timer;
			let abortListener;
			const interruptions = [];
			if (deadline !== undefined) interruptions.push(new Promise((_, reject) => {
				timer = setTimeout(() => reject(new BrowserObservationError(OPERATION$1, "timeout")), Math.max(1, deadline - performance.now()));
			}));
			if (signal !== undefined) interruptions.push(new Promise((_, reject) => {
				abortListener = () => reject(new BrowserObservationError(OPERATION$1, "cancelled"));
				signal.addEventListener("abort", abortListener, { once: true });
			}));
			try {
				return interruptions.length === 0 ? await operation : await Promise.race([operation, ...interruptions]);
			} finally {
				if (timer !== undefined) clearTimeout(timer);
				if (abortListener !== undefined) signal?.removeEventListener("abort", abortListener);
			}
		};
		safeActionErrorMessage = (cause) => {
			return cause instanceof Error ? cause.message : "Electron action failed";
		};
	})))();
}

//#endregion
//#region dist/browser/PlaywrightElectronActiveProjection.js
var observableEventFamilies, ipcEventKinds, eventFamily, normalizeObservations, createCoverage, hasUnattributedDroppedPreloadFamily, hasObservedPreloadConfiguration, projectElectronActiveCapture;
function init_PlaywrightElectronActiveProjection() {
	return (init_PlaywrightElectronActiveProjection = __esmMin((() => {
		init_electronActiveObservation();
		observableEventFamilies = [
			"app-lifecycle",
			"window-lifecycle",
			"web-contents-lifecycle",
			"navigation",
			"shell-attempt",
			"process-lifecycle",
			"permission",
			"popup-attempt",
			"download",
			"protocol",
			"preload",
			"preload-configuration",
			"renderer-ipc",
			"native-addon",
			"updater",
			"error",
			"ipc"
		];
		ipcEventKinds = new Set([
			"main-handler-invocation",
			"main-event-invocation",
			"utility-process-fork",
			"utility-process-message",
			"ipc-main-to-renderer",
			"ipc-utility-to-main",
			"ipc-renderer-send",
			"ipc-renderer-invoke",
			"ipc-renderer-post-message"
		]);
		eventFamily = (kind, processType) => {
			if (kind === "preload" && (processType === "main" || processType === "browser")) return "preload-configuration";
			if (kind.startsWith("ipc-renderer")) return processType === "renderer" ? "renderer-ipc" : "ipc";
			return ipcEventKinds.has(kind) ? "ipc" : kind;
		};
		normalizeObservations = (hookSnapshot) => {
			const observedEventFamilies = [...new Set([...hookSnapshot.events.map(({ kind, process_type }) => eventFamily(kind, process_type)), ...hookSnapshot.dropped_event_families.map(({ family }) => family)])].sort();
			const observedRoles = [...new Set([...hookSnapshot.events.flatMap(({ process_type, kind }) => [
				...process_type === null ? [] : [process_type],
				...kind === "window-lifecycle" ? ["window"] : [],
				...kind === "web-contents-lifecycle" || kind === "navigation" ? ["web_contents"] : [],
				...kind === "preload" && process_type === "preload" ? ["preload"] : [],
				...kind.startsWith("ipc-renderer") && process_type === "renderer" ? ["renderer"] : []
			]), ...hookSnapshot.dropped_event_roles.map(({ role }) => role)])].sort();
			return {
				observedEventFamilies,
				observedRoles
			};
		};
		createCoverage = (hookSnapshot, observations) => {
			const { observedEventFamilies, observedRoles } = observations;
			const unavailableEventFamilies = new Set(observableEventFamilies.filter((family) => !observedEventFamilies.includes(family)));
			if (!observedRoles.includes("preload")) unavailableEventFamilies.add("preload");
			if (!observedRoles.includes("renderer")) unavailableEventFamilies.add("renderer-ipc");
			return {
				status: hookSnapshot.hook_error ? "hook_conflict" : "partial_attach",
				observed_event_families: observedEventFamilies,
				unavailable_event_families: [...unavailableEventFamilies].sort(),
				observed_roles: observedRoles,
				pre_capture_activity: "unavailable"
			};
		};
		hasUnattributedDroppedPreloadFamily = (hookSnapshot) => hookSnapshot.dropped_event_families.some(({ family, count }) => family === "preload" && count > 0);
		hasObservedPreloadConfiguration = (observations) => observations.observedEventFamilies.includes("preload-configuration");
		projectElectronActiveCapture = (paths, actions, state) => {
			const { hookSnapshot } = state;
			const observations = normalizeObservations(hookSnapshot);
			const ipcEvents = hookSnapshot.events.filter(({ kind }) => ipcEventKinds.has(kind));
			return electronActiveObservationResultSchema.parse({
				application: {
					executable_path: paths.executable,
					application_path: paths.application,
					electron_version: state.electronVersion,
					process_ownership: "provider-owned",
					cleanup: "terminated-owned-process"
				},
				actions,
				windows: state.windows,
				processes: { items: state.metrics },
				ipc: {
					events: ipcEvents,
					observed: hookSnapshot.observed_ipc,
					dropped: hookSnapshot.dropped_ipc
				},
				timeline: {
					events: hookSnapshot.events,
					observed: hookSnapshot.observed,
					dropped: hookSnapshot.dropped
				},
				retention: {
					budget_bytes: hookSnapshot.retention_budget_bytes,
					estimated_retained_bytes: hookSnapshot.estimated_retained_bytes,
					event_serialized_byte_upper_bound: hookSnapshot.event_serialized_byte_upper_bound,
					retained: hookSnapshot.retained,
					dropped: hookSnapshot.dropped,
					dropped_event_families: hookSnapshot.dropped_event_families,
					dropped_event_roles: hookSnapshot.dropped_event_roles,
					observed_ipc: hookSnapshot.observed_ipc,
					dropped_ipc: hookSnapshot.dropped_ipc,
					observed_runtime: hookSnapshot.observed_runtime,
					dropped_runtime: hookSnapshot.dropped_runtime
				},
				coverage: createCoverage(hookSnapshot, observations),
				limitations: [
					"IPC payloads are represented by value shapes; payload values are never retained.",
					"IPC direction and sender/receiver identifiers are observed only where Electron exposes them at the hooked boundary.",
					"The runtime timeline records lifecycle, navigation, shell, permission, popup, download, protocol, preload, native-addon, process, and IPC events; activity before hook installation is unavailable.",
					"The preload and renderer process contexts are not instrumented by the main-process -r hook; preload configuration and contextBridge API-shape events are main-boundary observations, not proof of renderer-side execution.",
					...!hasObservedPreloadConfiguration(observations) ? ["Preload configuration was not exposed by the observed Electron window metadata. Preload paths and execution remain unavailable."] : [],
					...hasUnattributedDroppedPreloadFamily(hookSnapshot) ? ["Dropped preload-family events were not attributed to preload configuration; independently aggregated event families and roles cannot establish that relationship."] : [],
					"Process metrics are an Electron API snapshot and do not prove hostile-local-user isolation.",
					...hookSnapshot.dropped > 0 ? [`The active hook retained ${hookSnapshot.retained} of ${hookSnapshot.observed} observed events within a ${hookSnapshot.retention_budget_bytes}-byte retained-data budget; ${hookSnapshot.dropped} events were dropped (${hookSnapshot.dropped_ipc} IPC, ${hookSnapshot.dropped_runtime} runtime).`] : [],
					"External shell opens, external navigation, permission grants, downloads, popup windows, updater relaunches, and OS integration are blocked and recorded by the active hook; other application filesystem and network behavior is not sandboxed by this provider.",
					...hookSnapshot.hook_error ? ["The active IPC hook could not be installed."] : []
				]
			});
		};
	})))();
}

//#endregion
//#region dist/browser/PlaywrightElectronActiveProvider.js
var OPERATION, STARTUP_TIMEOUT_MS, hookPath, PlaywrightElectronActiveProvider, cleanupElectronProcesses, safeElectronEnvironment, PLAYWRIGHT_INTERNAL_FRAME, activeLaunches, heldLaunchRejections, holdLaunchRejection, forwardLaunchRejection, containLaunchRejections, providerError;
function init_PlaywrightElectronActiveProvider() {
	return (init_PlaywrightElectronActiveProvider = __esmMin((() => {
		init_analysisErrorBase();
		init_browserObservationError();
		init_providerAdapterError();
		init_result();
		init_ProcessOwnership();
		init_ProcessOwnershipObservation();
		init_ProcessOwnershipProcessTree();
		init_PlaywrightElectronActiveActions();
		init_PlaywrightElectronActiveProjection();
		init_providerIdentities();
		OPERATION = "capture_electron_scenario";
		STARTUP_TIMEOUT_MS = 6e4;
		hookPath = fileURLToPath(new URL("../../scripts/electron-active-hook.cjs", new URL("../browser/PlaywrightElectronActiveProvider.js", import.meta.url).href));
		PlaywrightElectronActiveProvider = class {
			environment;
			launch;
			constructor(environment, launch = async (options) => (await import("playwright-core"))._electron.launch(options)) {
				this.environment = environment;
				this.launch = launch;
			}
			identity() {
				return PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY;
			}
			async capture(input, options = {}) {
				let application;
				let ownership;
				let lineage;
				let capture;
				let paths;
				let initialState;
				let actions = [];
				let outcome;
				const runId = randomUUID();
				try {
					if (options.signal?.aborted === true) throw new BrowserObservationError(OPERATION, "cancelled");
					await prepareProcessOwnershipInspection(options.signal);
					const startupDeadline = performance.now() + STARTUP_TIMEOUT_MS;
					paths = {
						executable: input.executable_path,
						application: input.application_path,
						root: input.application_root
					};
					const captureBaseline = await systemProcessOwnershipHost.captureBaseline?.(options.signal);
					if (options.signal?.aborted) throw new BrowserObservationError(OPERATION, "cancelled");
					const launchOptions = {
						executablePath: paths.executable,
						cwd: paths.root,
						env: safeElectronEnvironment(this.environment, runId),
						args: [
							"-r",
							hookPath,
							paths.application,
							...input.args
						],
						timeout: Math.max(1, startupDeadline - performance.now())
					};
					application = await containLaunchRejections(() => this.launch(launchOptions));
					const leaderPid = application.process().pid;
					if (typeof leaderPid !== "number" || !Number.isSafeInteger(leaderPid) || leaderPid <= 0) throw new BrowserObservationError(OPERATION, "process_ownership_unavailable");
					ownership = {
						runId,
						leaderPid,
						processGroupId: leaderPid,
						expectedParentPid: process.pid,
						expectedCommand: paths.executable,
						sweepTokenOwnedProcesses: true,
						...captureBaseline === undefined ? {} : { captureBaseline }
					};
					lineage = await observeOwnedProcessLineage(ownership);
					initialState = await readApplicationState(application);
					actions = await runElectronActions(application, input, options);
					const state = await runWithExecutionLimits(readApplicationState(application), undefined, options.signal?.aborted ? performance.now() + 5e3 : undefined);
					capture = projectElectronActiveCapture(paths, actions, state);
					outcome = options.signal?.aborted ? err(new BrowserObservationError(OPERATION, "cancelled", { partialObservation: {
						kind: "electron-active-observation",
						capture
					} })) : ok(capture);
				} catch (cause) {
					if (paths !== undefined && initialState !== undefined) {
						const retainedCapture = projectElectronActiveCapture(paths, actions, initialState);
						capture = {
							...retainedCapture,
							limitations: [...retainedCapture.limitations, `Capture stopped after the initial pre-action snapshot: ${cause instanceof Error ? cause.message : String(cause)}. Final Windows, metrics, IPC, and timeline state is unknown; the retained snapshot may omit action effects.`]
						};
					}
					if (options.signal?.aborted === true) outcome = err(new BrowserObservationError(OPERATION, "cancelled", {
						cause,
						...capture === undefined ? {} : { partialObservation: {
							kind: "electron-active-observation",
							capture
						} }
					}));
					else {
						const error = providerError(cause);
						if (capture !== undefined) error.retainPartialObservation({
							kind: "electron-active-observation",
							capture
						});
						outcome = err(error);
					}
				}
				if (application !== undefined) {
					if (ownership !== undefined) {
						const currentLineage = await observeOwnedProcessLineage(ownership);
						if (currentLineage.status === "verified" || lineage === undefined) lineage = currentLineage;
					}
					let closeError;
					try {
						await runWithExecutionLimits(application.close(), undefined, performance.now() + 5e3);
					} catch (cause) {
						closeError = cause;
					}
					const cleanup = ownership === undefined ? {
						cleaned: false,
						reason: "owned Electron process identity was unavailable"
					} : await cleanupElectronProcesses(ownership, lineage);
					if (!cleanup.cleaned) return err(new BrowserObservationError(OPERATION, "cleanup_failed", {
						cause: outcome.ok ? new Error(cleanup.reason) : outcome.error,
						detail: `Electron cleanup could not be verified: ${cleanup.reason}.${capture !== undefined ? " Collected observations are retained in partial_observation." : ""}${outcome.ok ? "" : ` Capture also failed: ${outcome.error.message}.`} Inspect the reported process resources before launching another capture.`,
						cleanup: {
							reason: cleanup.reason,
							resources: ownership === undefined ? ["owned_process_group"] : [
								"owned_process_group",
								`run:${ownership.runId}`,
								`process-group:${String(ownership.processGroupId)}`
							]
						},
						...capture !== undefined ? { partialObservation: {
							kind: "electron-active-observation",
							capture: {
								...capture,
								application: {
									...capture.application,
									cleanup: "unverified"
								}
							}
						} } : {}
					}));
					if (closeError !== undefined) return err(new BrowserObservationError(OPERATION, "cleanup_failed", {
						cause: outcome.ok ? closeError : outcome.error,
						detail: `Electron transport teardown failed after process cleanup: ${closeError instanceof Error ? closeError.message : String(closeError)}.${capture !== undefined ? " Collected observations are retained in partial_observation." : ""}${outcome.ok ? "" : ` Capture also failed: ${outcome.error.message}.`}`,
						...capture !== undefined ? { partialObservation: {
							kind: "electron-active-observation",
							capture
						} } : {}
					}));
					if (outcome.ok && cleanup.unverified !== undefined) outcome = ok({
						...outcome.value,
						limitations: [...outcome.value.limitations, ...cleanup.unverified.map(({ pid, diagnostic }) => `Ownership of unrelated process ${String(pid)} could not be verified; it was left untouched: ${diagnostic}`)]
					});
				}
				return outcome;
			}
		};
		cleanupElectronProcesses = async (ownership, lineage, host = {
			platform: process.platform,
			terminateTree: cleanupWindowsProcessTree
		}) => {
			if (host.platform === "win32") {
				if (lineage?.status !== "verified") return {
					cleaned: false,
					reason: "owned Electron lineage was unavailable; helper cleanup was not proven"
				};
				const root = await host.terminateTree(ownership.leaderPid);
				if (!root.cleaned) return root;
				for (const descendant of lineage.lineage.descendants) {
					const result = await host.terminateTree(descendant.pid);
					if (!result.cleaned) return result;
				}
				return root;
			}
			if (lineage?.status !== "verified") {
				const root = await cleanupOwnedProcessGroup(ownership);
				return root.cleaned ? {
					cleaned: false,
					reason: "owned Electron lineage was unavailable; helper cleanup was not proven"
				} : root;
			}
			const groupIds = selectCapturedProcessGroupIds(ownership.leaderPid, lineage.lineage.descendants.map(({ pid, processGroupId }) => ({
				pid,
				process_group_id: processGroupId
			})));
			let signaled = false;
			const unverified = [];
			for (const processGroupId of groupIds) {
				const cleanupOwnership = processGroupId === ownership.processGroupId ? {
					...ownership,
					leaderPid: processGroupId,
					processGroupId
				} : {
					runId: ownership.runId,
					leaderPid: processGroupId,
					processGroupId
				};
				const result = await cleanupOwnedProcessGroup(cleanupOwnership);
				if (!result.cleaned) return result;
				signaled ||= result.signaled;
				unverified.push(...result.unverified ?? []);
			}
			const remaining = await verifyNoTokenOwnedProcesses(ownership.runId, undefined, ownership.captureBaseline, {
				leaderPid: ownership.leaderPid,
				processGroupId: ownership.processGroupId,
				...ownership.sampledProcessGroupIds === undefined ? {} : { sampledProcessGroupIds: ownership.sampledProcessGroupIds }
			});
			if (!remaining.cleaned) return remaining;
			unverified.push(...remaining.unverified ?? []);
			return {
				cleaned: true,
				signaled,
				...unverified.length === 0 ? {} : { unverified: [...new Map(unverified.map((item) => [`${String(item.pid)}:${item.diagnostic}`, item])).values()] }
			};
		};
		safeElectronEnvironment = (environment, runId, platform = process.platform) => Object.fromEntries([...[
			"HOME",
			"LANG",
			"PATH",
			"TMP",
			"TMPDIR",
			"USER",
			"DISPLAY",
			"WAYLAND_DISPLAY",
			...platform === "win32" ? [
				"SYSTEMROOT",
				"TEMP",
				"APPDATA",
				"LOCALAPPDATA",
				"USERPROFILE",
				"COMSPEC",
				"PATHEXT",
				"PROGRAMDATA",
				"ALLUSERSPROFILE",
				"USERNAME",
				"SYSTEMDRIVE",
				"HOMEDRIVE",
				"HOMEPATH"
			] : []
		].map((name) => [name, environment[name]]).filter((entry) => entry[1] !== undefined), ["REA_PROCESS_RUN_ID", runId]]);
		PLAYWRIGHT_INTERNAL_FRAME = /playwright-core[\\/]lib[\\/]/;
		activeLaunches = new Set();
		heldLaunchRejections = new Map();
		holdLaunchRejection = (reason, promise) => {
			if (!(reason instanceof Error) || !PLAYWRIGHT_INTERNAL_FRAME.test(reason.stack ?? "")) throw reason;
			if (!heldLaunchRejections.has(promise)) heldLaunchRejections.set(promise, {
				reason,
				candidates: new Set(activeLaunches),
				hadExternalListener: process.listeners("unhandledRejection").some((listener) => listener !== holdLaunchRejection)
			});
		};
		forwardLaunchRejection = (reason, hadExternalListener) => {
			if (!hadExternalListener) process.nextTick(() => {
				throw reason;
			});
		};
		containLaunchRejections = async (launch) => {
			const scope = {};
			if (activeLaunches.size === 0) process.on("unhandledRejection", holdLaunchRejection);
			activeLaunches.add(scope);
			try {
				return await launch();
			} catch (cause) {
				scope.failure = cause;
				throw cause;
			} finally {
				await new Promise((resolve) => setImmediate(resolve));
				activeLaunches.delete(scope);
				if (activeLaunches.size === 0) process.off("unhandledRejection", holdLaunchRejection);
				for (const [promise, { reason, candidates, hadExternalListener }] of heldLaunchRejections) {
					if (!candidates.delete(scope)) continue;
					if (scope.failure instanceof Error && reason.message !== "" && scope.failure.message.includes(reason.message)) heldLaunchRejections.delete(promise);
					else if (candidates.size === 0) {
						heldLaunchRejections.delete(promise);
						forwardLaunchRejection(reason, hadExternalListener);
					}
				}
			}
		};
		providerError = (cause) => cause instanceof AnalysisError ? cause : new ProviderAdapterError(PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY.id, OPERATION, {
			cause,
			diagnostics: { message: cause instanceof Error ? cause.message : String(cause) }
		});
	})))();
}

//#endregion
//#region dist/composition/electronScenario.js
var createElectronScenarioProvider;
function init_electronScenario() {
	return (init_electronScenario = __esmMin((() => {
		init_PlaywrightElectronActiveProvider();
		createElectronScenarioProvider = (environment) => new PlaywrightElectronActiveProvider(environment);
	})))();
}

//#endregion
init_electronScenario();
export { createElectronScenarioProvider };