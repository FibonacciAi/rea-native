import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { AnalysisError } from "../domain/analysisErrorBase.js";
import { BrowserObservationError } from "../domain/browserObservationError.js";
import { ProviderAdapterError } from "../domain/providerAdapterError.js";
import { err, ok } from "../domain/result.js";
import { cleanupOwnedProcessGroup, cleanupWindowsProcessTree, verifyNoTokenOwnedProcesses, } from "../process/ProcessOwnership.js";
import { observeOwnedProcessLineage, prepareProcessOwnershipInspection, systemProcessOwnershipHost, } from "../process/ProcessOwnershipObservation.js";
import { selectCapturedProcessGroupIds } from "../process/ProcessOwnershipProcessTree.js";
import { runElectronActions, readApplicationState, runWithExecutionLimits, } from "./PlaywrightElectronActiveActions.js";
import { projectElectronActiveCapture } from "./PlaywrightElectronActiveProjection.js";
const OPERATION = "capture_electron_scenario";
const STARTUP_TIMEOUT_MS = 60_000;
import { PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY } from "./providerIdentities.js";
const hookPath = fileURLToPath(new URL("../../scripts/electron-active-hook.cjs", import.meta.url));
/** Launch an owned Electron application through the official Playwright API. */
export class PlaywrightElectronActiveProvider {
    environment;
    launch;
    constructor(environment, 
    // Load Playwright only when a capture launches; MCP startup stays off its module graph.
    launch = async (options) => (await import("playwright-core"))._electron.launch(options)) {
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
            if (options.signal?.aborted === true)
                throw new BrowserObservationError(OPERATION, "cancelled");
            await prepareProcessOwnershipInspection(options.signal);
            const startupDeadline = performance.now() + STARTUP_TIMEOUT_MS;
            paths = {
                executable: input.executable_path,
                application: input.application_path,
                root: input.application_root,
            };
            const captureBaseline = await systemProcessOwnershipHost.captureBaseline?.(options.signal);
            if (options.signal?.aborted)
                throw new BrowserObservationError(OPERATION, "cancelled");
            const launchOptions = {
                executablePath: paths.executable,
                cwd: paths.root,
                env: safeElectronEnvironment(this.environment, runId),
                args: ["-r", hookPath, paths.application, ...input.args],
                timeout: Math.max(1, startupDeadline - performance.now()),
            };
            application = await containLaunchRejections(() => this.launch(launchOptions));
            const leaderPid = application.process().pid;
            if (typeof leaderPid !== "number" ||
                !Number.isSafeInteger(leaderPid) ||
                leaderPid <= 0)
                throw new BrowserObservationError(OPERATION, "process_ownership_unavailable");
            ownership = {
                runId,
                leaderPid,
                processGroupId: leaderPid,
                expectedParentPid: process.pid,
                expectedCommand: paths.executable,
                sweepTokenOwnedProcesses: true,
                ...(captureBaseline === undefined ? {} : { captureBaseline }),
            };
            lineage = await observeOwnedProcessLineage(ownership);
            initialState = await readApplicationState(application);
            actions = await runElectronActions(application, input, options);
            const state = await runWithExecutionLimits(readApplicationState(application), undefined, options.signal?.aborted ? performance.now() + 5_000 : undefined);
            capture = projectElectronActiveCapture(paths, actions, state);
            outcome = options.signal?.aborted
                ? err(new BrowserObservationError(OPERATION, "cancelled", {
                    partialObservation: {
                        kind: "electron-active-observation",
                        capture,
                    },
                }))
                : ok(capture);
        }
        catch (cause) {
            if (paths !== undefined && initialState !== undefined) {
                const retainedCapture = projectElectronActiveCapture(paths, actions, initialState);
                capture = {
                    ...retainedCapture,
                    limitations: [
                        ...retainedCapture.limitations,
                        `Capture stopped after the initial pre-action snapshot: ${cause instanceof Error ? cause.message : String(cause)}. Final Windows, metrics, IPC, and timeline state is unknown; the retained snapshot may omit action effects.`,
                    ],
                };
            }
            if (options.signal?.aborted === true)
                outcome = err(new BrowserObservationError(OPERATION, "cancelled", {
                    cause,
                    ...(capture === undefined
                        ? {}
                        : {
                            partialObservation: {
                                kind: "electron-active-observation",
                                capture,
                            },
                        }),
                }));
            else {
                const error = providerError(cause);
                if (capture !== undefined)
                    error.retainPartialObservation({
                        kind: "electron-active-observation",
                        capture,
                    });
                outcome = err(error);
            }
        }
        if (application !== undefined) {
            if (ownership !== undefined) {
                const currentLineage = await observeOwnedProcessLineage(ownership);
                if (currentLineage.status === "verified" || lineage === undefined)
                    lineage = currentLineage;
            }
            let closeError;
            try {
                await runWithExecutionLimits(application.close(), undefined, performance.now() + 5_000);
            }
            catch (cause) {
                closeError = cause;
            }
            const cleanup = ownership === undefined
                ? {
                    cleaned: false,
                    reason: "owned Electron process identity was unavailable",
                }
                : await cleanupElectronProcesses(ownership, lineage);
            if (!cleanup.cleaned)
                return err(new BrowserObservationError(OPERATION, "cleanup_failed", {
                    cause: outcome.ok ? new Error(cleanup.reason) : outcome.error,
                    detail: `Electron cleanup could not be verified: ${cleanup.reason}.${capture !== undefined ? " Collected observations are retained in partial_observation." : ""}${outcome.ok ? "" : ` Capture also failed: ${outcome.error.message}.`} Inspect the reported process resources before launching another capture.`,
                    cleanup: {
                        reason: cleanup.reason,
                        resources: ownership === undefined
                            ? ["owned_process_group"]
                            : [
                                "owned_process_group",
                                `run:${ownership.runId}`,
                                `process-group:${String(ownership.processGroupId)}`,
                            ],
                    },
                    ...(capture !== undefined
                        ? {
                            partialObservation: {
                                kind: "electron-active-observation",
                                capture: {
                                    ...capture,
                                    application: {
                                        ...capture.application,
                                        cleanup: "unverified",
                                    },
                                },
                            },
                        }
                        : {}),
                }));
            if (closeError !== undefined)
                return err(new BrowserObservationError(OPERATION, "cleanup_failed", {
                    cause: outcome.ok ? closeError : outcome.error,
                    detail: `Electron transport teardown failed after process cleanup: ${closeError instanceof Error ? closeError.message : String(closeError)}.${capture !== undefined ? " Collected observations are retained in partial_observation." : ""}${outcome.ok ? "" : ` Capture also failed: ${outcome.error.message}.`}`,
                    ...(capture !== undefined
                        ? {
                            partialObservation: {
                                kind: "electron-active-observation",
                                capture,
                            },
                        }
                        : {}),
                }));
            if (outcome.ok && cleanup.unverified !== undefined)
                outcome = ok({
                    ...outcome.value,
                    limitations: [
                        ...outcome.value.limitations,
                        ...cleanup.unverified.map(({ pid, diagnostic }) => `Ownership of unrelated process ${String(pid)} could not be verified; it was left untouched: ${diagnostic}`),
                    ],
                });
        }
        return outcome;
    }
}
/** Clean up an Electron launch. Windows signals a process only after lineage is verified. */
export const cleanupElectronProcesses = async (ownership, lineage, host = {
    platform: process.platform,
    terminateTree: cleanupWindowsProcessTree,
}) => {
    if (host.platform === "win32") {
        // An empty Windows process table is not ownership proof for this PID.
        if (lineage?.status !== "verified")
            return {
                cleaned: false,
                reason: "owned Electron lineage was unavailable; helper cleanup was not proven",
            };
        const root = await host.terminateTree(ownership.leaderPid);
        if (!root.cleaned)
            return root;
        for (const descendant of lineage.lineage.descendants) {
            const result = await host.terminateTree(descendant.pid);
            if (!result.cleaned)
                return result;
        }
        return root;
    }
    if (lineage?.status !== "verified") {
        const root = await cleanupOwnedProcessGroup(ownership);
        return root.cleaned
            ? {
                cleaned: false,
                reason: "owned Electron lineage was unavailable; helper cleanup was not proven",
            }
            : root;
    }
    const groupIds = selectCapturedProcessGroupIds(ownership.leaderPid, lineage.lineage.descendants.map(({ pid, processGroupId }) => ({
        pid,
        process_group_id: processGroupId,
    })));
    let signaled = false;
    const unverified = [];
    for (const processGroupId of groupIds) {
        const cleanupOwnership = processGroupId === ownership.processGroupId
            ? { ...ownership, leaderPid: processGroupId, processGroupId }
            : {
                runId: ownership.runId,
                leaderPid: processGroupId,
                processGroupId,
            };
        const result = await cleanupOwnedProcessGroup(cleanupOwnership);
        if (!result.cleaned)
            return result;
        signaled ||= result.signaled;
        unverified.push(...(result.unverified ?? []));
    }
    const remaining = await verifyNoTokenOwnedProcesses(ownership.runId, undefined, ownership.captureBaseline, {
        leaderPid: ownership.leaderPid,
        processGroupId: ownership.processGroupId,
        ...(ownership.sampledProcessGroupIds === undefined
            ? {}
            : { sampledProcessGroupIds: ownership.sampledProcessGroupIds }),
    });
    if (!remaining.cleaned)
        return remaining;
    unverified.push(...(remaining.unverified ?? []));
    return {
        cleaned: true,
        signaled,
        ...(unverified.length === 0
            ? {}
            : {
                unverified: [
                    ...new Map(unverified.map((item) => [
                        `${String(item.pid)}:${item.diagnostic}`,
                        item,
                    ])).values(),
                ],
            }),
    };
};
export const safeElectronEnvironment = (environment, runId, platform = process.platform) => Object.fromEntries([
    ...[
        "HOME",
        "LANG",
        "PATH",
        "TMP",
        "TMPDIR",
        "USER",
        "DISPLAY",
        "WAYLAND_DISPLAY",
        ...(platform === "win32"
            ? [
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
                "HOMEPATH",
            ]
            : []),
    ]
        .map((name) => [name, environment[name]])
        .filter((entry) => entry[1] !== undefined),
    ["REA_PROCESS_RUN_ID", runId],
]);
const PLAYWRIGHT_INTERNAL_FRAME = /playwright-core[\\/]lib[\\/]/;
const activeLaunches = new Set();
const heldLaunchRejections = new Map();
const holdLaunchRejection = (reason, promise) => {
    if (!(reason instanceof Error) ||
        !PLAYWRIGHT_INTERNAL_FRAME.test(reason.stack ?? ""))
        throw reason;
    if (!heldLaunchRejections.has(promise))
        heldLaunchRejections.set(promise, {
            reason,
            candidates: new Set(activeLaunches),
            hadExternalListener: process
                .listeners("unhandledRejection")
                .some((listener) => listener !== holdLaunchRejection),
        });
};
const forwardLaunchRejection = (reason, hadExternalListener) => {
    // Listeners present at the original event already observed it. When the
    // holding listener was the only listener, restore Node's fatal behavior.
    if (!hadExternalListener)
        process.nextTick(() => {
            throw reason;
        });
};
/** Playwright leaves rejected launch promises unhandled; absorb only those that repeat this launch's failure. */
const containLaunchRejections = async (launch) => {
    const scope = {};
    if (activeLaunches.size === 0)
        process.on("unhandledRejection", holdLaunchRejection);
    activeLaunches.add(scope);
    try {
        return await launch();
    }
    catch (cause) {
        scope.failure = cause;
        throw cause;
    }
    finally {
        await new Promise((resolve) => setImmediate(resolve));
        activeLaunches.delete(scope);
        if (activeLaunches.size === 0)
            process.off("unhandledRejection", holdLaunchRejection);
        for (const [promise, { reason, candidates, hadExternalListener },] of heldLaunchRejections) {
            if (!candidates.delete(scope))
                continue;
            if (scope.failure instanceof Error &&
                reason.message !== "" &&
                scope.failure.message.includes(reason.message))
                heldLaunchRejections.delete(promise);
            else if (candidates.size === 0) {
                heldLaunchRejections.delete(promise);
                forwardLaunchRejection(reason, hadExternalListener);
            }
        }
    }
};
const providerError = (cause) => cause instanceof AnalysisError
    ? cause
    : new ProviderAdapterError(PLAYWRIGHT_ELECTRON_ACTIVE_PROVIDER_IDENTITY.id, OPERATION, {
        cause,
        diagnostics: {
            message: cause instanceof Error ? cause.message : String(cause),
        },
    });
