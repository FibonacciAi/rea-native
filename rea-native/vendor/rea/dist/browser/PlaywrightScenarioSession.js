import { BrowserObservationError } from "../domain/browserObservationError.js";
import { BrowserScenarioSecrets } from "./BrowserScenarioSecrets.js";
import { failBrowserScenarioOperation, openPlaywrightScenarioBrowser, } from "./PlaywrightScenarioBrowser.js";
import { performPlaywrightScenarioAction } from "./PlaywrightScenarioActions.js";
import { capturePlaywrightStepArtifacts } from "./PlaywrightScenarioArtifacts.js";
import { PlaywrightScenarioEvents } from "./PlaywrightScenarioEvents.js";
import { PlaywrightScenarioStorage } from "./PlaywrightScenarioStorage.js";
import { PlaywrightScenarioServiceWorkers } from "./PlaywrightScenarioServiceWorkers.js";
import { withPlaywrightExecutionBoundary } from "./PlaywrightExecutionBoundary.js";
import { browserScenarioCaptureData, browserScenarioOperationFailure, } from "./BrowserScenarioPartialObservation.js";
const OPERATION = "capture_browser_scenario";
const throwIfScenarioCancelled = (signal) => {
    if (signal?.aborted === true)
        throw new BrowserObservationError(OPERATION, "cancelled");
};
const throwCleanupFailures = (failures) => {
    if (failures.length === 1)
        throw failures[0];
    if (failures.length > 1)
        throw new AggregateError(failures, "Browser scenario cleanup failed");
};
const installCookies = async (context, scenario, secrets) => {
    await context.addCookies(scenario.storage.cookies.map((cookie) => ({
        name: cookie.name,
        value: secrets.value(cookie.value),
        url: secrets.url(cookie.destination),
        httpOnly: cookie.http_only,
        secure: cookie.secure,
        sameSite: cookie.same_site,
    })));
};
const initializePage = async (context, scenario, secrets) => {
    context.setDefaultTimeout(0);
    context.setDefaultNavigationTimeout(0);
    await installCookies(context, scenario, secrets);
};
export class PlaywrightScenarioSession {
    opened;
    mode;
    processOwnership;
    product = "Chromium";
    version;
    initialUrl;
    secrets;
    eventCapture;
    storage;
    serviceWorkers;
    signal;
    #storageReleased = false;
    constructor(opened, options) {
        this.opened = opened;
        this.mode = options.mode;
        this.processOwnership =
            options.mode === "launch" ? "provider-owned" : "external";
        this.secrets = options.secrets;
        this.eventCapture = options.eventCapture;
        this.storage = options.storage;
        this.serviceWorkers = options.serviceWorkers;
        this.signal = options.signal;
        this.version = opened.browser.version();
        this.initialUrl = opened.page.url();
    }
    static async open(scenario, environment, options) {
        throwIfScenarioCancelled(options.signal);
        const secrets = BrowserScenarioSecrets.resolve(scenario, environment);
        if (secrets === undefined)
            throw new BrowserObservationError(OPERATION, "secret_unavailable");
        const startedAt = performance.now();
        const opening = openPlaywrightScenarioBrowser(scenario, environment, {
            signal: options.signal,
            ...(options.retainCleanup === undefined
                ? {}
                : { retainCleanup: options.retainCleanup }),
        });
        let opened;
        try {
            opened = await withPlaywrightExecutionBoundary(() => opening, undefined, options.signal);
        }
        catch (cause) {
            const lateCleanup = () => opening.then((lateOpened) => lateOpened.cleanup.close(), () => undefined);
            options.retainCleanup?.(() => withPlaywrightExecutionBoundary(lateCleanup, 1_000));
            void lateCleanup().catch((cleanupCause) => {
                // best-effort cleanup: retainCleanup keeps the retry capability.
                void cleanupCause;
            });
            throw cause;
        }
        const session = await this.initializeSession(opened, scenario, secrets, options);
        try {
            await withPlaywrightExecutionBoundary(() => opened.page.goto(secrets.url(scenario.start_url), {
                waitUntil: "load",
                timeout: 0,
            }), undefined, options.signal);
            await withPlaywrightExecutionBoundary(() => session.serviceWorkers?.assertBlocked() ?? Promise.resolve(), undefined, options.signal);
            await withPlaywrightExecutionBoundary(() => session.storage?.settle() ?? Promise.resolve(), undefined, options.signal);
            return session;
        }
        catch (cause) {
            let cleanup;
            let cleanupFailure;
            try {
                cleanup = await session.close(true);
            }
            catch (failure) {
                cleanup = "incomplete";
                cleanupFailure = { cause: failure };
                options.retainCleanup?.(() => session.close());
            }
            throw browserScenarioOperationFailure(cause, {
                kind: "browser-scenario-observation",
                capture: browserScenarioCaptureData({
                    session,
                    scenario,
                    startedAt,
                    steps: [],
                    cleanup,
                    limitations: [
                        "Scenario navigation failed before the initial state was captured.",
                    ],
                }),
            }, cleanupFailure);
        }
    }
    static async initializeSession(opened, scenario, secrets, options) {
        let events;
        let storage;
        const serviceWorkers = scenario.browser.mode === "connect" &&
            scenario.environment.service_workers === "block"
            ? new PlaywrightScenarioServiceWorkers(opened.page, scenario.browser.cdp_endpoint, scenario.browser.target_id)
            : undefined;
        try {
            await withPlaywrightExecutionBoundary(async () => {
                await serviceWorkers?.initialize();
                await initializePage(opened.context, scenario, secrets);
            }, undefined, options.signal);
            storage = await PlaywrightScenarioStorage.create(opened, scenario, secrets, {
                ...(options.signal === undefined ? {} : { signal: options.signal }),
                ...(options.retainCleanup === undefined
                    ? {}
                    : { retainCleanup: options.retainCleanup }),
            });
            await storage?.initialize(opened.page, opened.context);
            throwIfScenarioCancelled(options.signal);
            events = new PlaywrightScenarioEvents({
                page: opened.page,
                context: opened.context,
                ownsContext: scenario.browser.mode === "launch",
                enabled: new Set(scenario.capture.events),
                secrets,
                network: scenario.capture.network,
                ...(options.signal === undefined ? {} : { signal: options.signal }),
            });
            return new PlaywrightScenarioSession(opened, {
                mode: scenario.browser.mode,
                secrets,
                eventCapture: events,
                storage,
                serviceWorkers,
                signal: options.signal,
            });
        }
        catch (cause) {
            let storageReleased = false;
            const cleanup = async () => {
                let storageFailure;
                let policyFailure;
                let browserFailure;
                if (!storageReleased) {
                    try {
                        await storage?.close(options.signal?.aborted === true);
                    }
                    catch (failure) {
                        storageFailure = { cause: failure };
                    }
                }
                try {
                    if (!opened.cleanup.browserClosed)
                        await serviceWorkers?.close(true);
                }
                catch (failure) {
                    policyFailure = { cause: failure };
                }
                if (policyFailure === undefined) {
                    try {
                        await opened.cleanup.close(events === undefined
                            ? undefined
                            : () => events?.finish() ?? Promise.resolve());
                    }
                    catch (failure) {
                        browserFailure = { cause: failure };
                    }
                }
                else {
                    try {
                        await events?.finish();
                    }
                    catch (failure) {
                        browserFailure = { cause: failure };
                    }
                }
                if (opened.cleanup.browserClosed)
                    storageReleased = true;
                throwCleanupFailures([
                    ...(policyFailure === undefined ? [] : [policyFailure.cause]),
                    ...(storageReleased || storageFailure === undefined
                        ? []
                        : [storageFailure.cause]),
                    ...(browserFailure === undefined ? [] : [browserFailure.cause]),
                ]);
            };
            try {
                return await failBrowserScenarioOperation(cleanup, cause);
            }
            catch (failure) {
                if (failure !== cause)
                    options.retainCleanup?.(cleanup);
                throw failure;
            }
        }
    }
    currentUrl() {
        return this.opened.page.url();
    }
    sanitizeUrl(value) {
        return this.secrets.sanitizeUrl(value);
    }
    setStep(index) {
        this.eventCapture.setStep(index);
    }
    nextEventSequence() {
        return this.eventCapture.nextSequence();
    }
    lastEventSequence() {
        return this.eventCapture.lastSequence();
    }
    events() {
        return this.eventCapture.result();
    }
    /** Preserve event coverage gaps for the aggregate capture's completeness. */
    eventLimitations() {
        return this.eventCapture.limitations();
    }
    async perform(action, signal) {
        await withPlaywrightExecutionBoundary(() => performPlaywrightScenarioAction({
            page: this.opened.page,
            action,
            secrets: this.secrets,
        }), "timeout_ms" in action ? action.timeout_ms : undefined, signal);
        await withPlaywrightExecutionBoundary(() => this.storage?.settle() ?? Promise.resolve(), undefined, signal);
    }
    async capture(requested, signal) {
        await withPlaywrightExecutionBoundary(() => this.serviceWorkers?.assertBlocked() ?? Promise.resolve(), undefined, signal);
        await withPlaywrightExecutionBoundary(() => this.storage?.settle() ?? Promise.resolve(), undefined, signal);
        return withPlaywrightExecutionBoundary(() => capturePlaywrightStepArtifacts({
            context: this.opened.context,
            page: this.opened.page,
            secrets: this.secrets,
            requested,
        }), undefined, signal);
    }
    async close(stopLoading = this.signal?.aborted === true) {
        let storageFailure;
        let policyFailure;
        let browserFailure;
        if (!this.#storageReleased) {
            try {
                await this.storage?.close(stopLoading);
            }
            catch (failure) {
                storageFailure = { cause: failure };
            }
        }
        try {
            if (!this.opened.cleanup.browserClosed)
                await this.serviceWorkers?.close(stopLoading);
        }
        catch (failure) {
            policyFailure = { cause: failure };
        }
        if (policyFailure === undefined) {
            try {
                await this.opened.cleanup.close(() => this.eventCapture.finish());
            }
            catch (failure) {
                browserFailure = { cause: failure };
            }
        }
        else {
            try {
                await this.eventCapture.finish();
            }
            catch (failure) {
                browserFailure = { cause: failure };
            }
        }
        if (this.opened.cleanup.browserClosed)
            this.#storageReleased = true;
        throwCleanupFailures([
            ...(policyFailure === undefined ? [] : [policyFailure.cause]),
            ...(this.#storageReleased || storageFailure === undefined
                ? []
                : [storageFailure.cause]),
            ...(browserFailure === undefined ? [] : [browserFailure.cause]),
        ]);
        return this.mode === "launch"
            ? "terminated-owned-process"
            : "disconnected-external";
    }
    redactError(error) {
        return this.secrets.redact(error instanceof Error ? error.message : "browser action failed");
    }
}
