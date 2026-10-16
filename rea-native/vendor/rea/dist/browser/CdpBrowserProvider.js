import { sanitizeBrowserUrl, } from "../domain/browserObservation.js";
import { browserTargetListSchema, webPageInspectionSchema, } from "../domain/browserObservationSchemas.js";
import { analyzeCapturedWebBundle } from "../domain/webBundleAnalyzer.js";
import { webBundleAnalysisSchema, } from "../domain/webBundleAnalysis.js";
import { webObservationSessionSchema, } from "../domain/browserSession.js";
import { webMcpDiscoverySchema, } from "../domain/webMcpDiscovery.js";
import { browserCaptureComparisonSchema, compareBrowserCaptures, } from "../domain/browserCaptureComparison.js";
import { webScreenshotDiffSchema, webScreenshotSchema, } from "../domain/webScreenshot.js";
import { AnalysisError } from "../domain/analysisErrorBase.js";
import { AnalysisCancelledError, AnalysisInputError, } from "../domain/analysisErrorCore.js";
import { BrowserObservationError } from "../domain/browserObservationError.js";
import { ProviderAdapterError } from "../domain/providerAdapterError.js";
import { err, ok } from "../domain/result.js";
import { hasCdpTargetWebSocket, } from "./CdpEndpoint.js";
import { attachCdpTargetSession, closeCdpTargetSession, openCdpEndpoint, openCdpTargetSession, } from "./CdpTargetSession.js";
import { capturePage } from "./CdpPageCapture.js";
import { fetchWebSourceMaps } from "./WebSourceMapFetcher.js";
import { authorizeCdpTarget } from "./CdpAuthorizedTarget.js";
import { observeCdpSession } from "./CdpObservationSession.js";
import { discoverWebMcp } from "./CdpWebMcpDiscovery.js";
import { captureCdpScreenshot } from "./CdpScreenshot.js";
import { comparePngScreenshots } from "./PngVisualDiff.js";
import { CDP_BROWSER_PROVIDER_IDENTITY } from "./providerIdentities.js";
import { compareUnicodeCodePoints } from "../domain/unicodeCodePointOrder.js";
const CLEANUP_DOMAINS = ["Network", "Debugger", "Runtime", "Page"];
/** Passive browser observation through a selected user-owned CDP endpoint. */
export class CdpBrowserProvider {
    identity() {
        return CDP_BROWSER_PROVIDER_IDENTITY;
    }
    async listTargets(input, options = {}) {
        try {
            const endpoint = await openCdpEndpoint(input.cdp_endpoint, "list_browser_targets", options.signal);
            await endpoint.connection?.close();
            const { discovery } = endpoint;
            const selected = selectTargets(discovery, input.allowed_origins.length === 0
                ? undefined
                : new Set(input.allowed_origins));
            return ok(browserTargetListSchema.parse({
                browser: discovery.version,
                targets: selected.allowed,
                excluded: selected.excluded,
                limitations: [
                    input.allowed_origins.length === 0
                        ? "All page targets with supported HTTP(S) URLs are listed."
                        : "Only page targets whose current URL matches an explicitly requested exact origin are listed.",
                    ...(selected.unconnectable === 0
                        ? []
                        : [
                            `${String(selected.unconnectable)} otherwise allowed page target(s) lacked a validated direct CDP WebSocket and were excluded.`,
                        ]),
                    ...(selected.allowed.some((target) => target.attached === null)
                        ? [
                            "CDP discovery omitted attachment state for one or more targets; attached is reported as unknown.",
                        ]
                        : []),
                ],
            }));
        }
        catch (cause) {
            return err(providerError(cause, "list_browser_targets", options.signal));
        }
    }
    async inspectPage(input, options = {}) {
        try {
            const captured = await this.#capture(input, options, "inspect_web_page");
            return ok(webPageInspectionSchema.parse(captured.inspection));
        }
        catch (cause) {
            return err(providerError(cause, "inspect_web_page", options.signal));
        }
    }
    async analyzeBundle(input, options = {}) {
        try {
            const captured = await this.#capture(input, options, "analyze_web_bundle");
            const sourceMaps = input.fetch_source_maps
                ? await fetchWebSourceMaps(captured.sourceMapRequests, {
                    ...input,
                    allowed_origins: input.allowed_origins.length > 0
                        ? input.allowed_origins
                        : [captured.inspection.target.origin],
                }, options.signal)
                : undefined;
            return ok(webBundleAnalysisSchema.parse(analyzeCapturedWebBundle(captured.inspection, sourceMaps)));
        }
        catch (cause) {
            // fetchWebSourceMaps rethrows the exact abort reason. Preserve cancellation
            // even when a caller supplied an AnalysisError as that reason.
            if (options.signal?.aborted === true && cause === options.signal.reason) {
                return err(new AnalysisCancelledError("analyze_web_bundle", { cause }));
            }
            return err(providerError(cause, "analyze_web_bundle", options.signal));
        }
    }
    async observeSession(input, options = {}) {
        try {
            return ok(webObservationSessionSchema.parse(await withTargetSession(input, "observe_web_session", options, observeCdpSession)));
        }
        catch (cause) {
            return err(providerError(cause, "observe_web_session", options.signal));
        }
    }
    async discoverWebMcpTools(input, options = {}) {
        try {
            return ok(webMcpDiscoverySchema.parse(await withTargetSession(input, "discover_webmcp_tools", options, discoverWebMcp)));
        }
        catch (cause) {
            return err(providerError(cause, "discover_webmcp_tools", options.signal));
        }
    }
    async compareCaptures(input) {
        try {
            return ok(browserCaptureComparisonSchema.parse(compareBrowserCaptures(input)));
        }
        catch (cause) {
            return err(providerError(cause, "compare_web_captures"));
        }
    }
    async captureScreenshot(input, options = {}) {
        try {
            return ok(webScreenshotSchema.parse(await withTargetSession(input, "capture_web_screenshot", options, captureCdpScreenshot)));
        }
        catch (cause) {
            return err(providerError(cause, "capture_web_screenshot", options.signal));
        }
    }
    async compareScreenshots(input) {
        try {
            return ok(webScreenshotDiffSchema.parse(comparePngScreenshots(input)));
        }
        catch (cause) {
            if (cause instanceof TypeError)
                return err(new AnalysisInputError("compare_web_screenshots", { cause }, [
                    { path: [], reason: "invalid_format", message: cause.message },
                ]));
            return err(providerError(cause, "compare_web_screenshots"));
        }
    }
    async #capture(input, options, operation) {
        return await withTargetSession(input, operation, options, async (session) => await capturePage({ ...session, operation }));
    }
}
/** Authorize one discovered target, run work in its session, and close REA's socket. */
const withTargetSession = async (input, operation, options, work) => {
    const endpoint = await openCdpEndpoint(input.cdp_endpoint, operation, options.signal);
    let targetSession;
    let output;
    try {
        const target = authorizeTarget(endpoint.discovery, input);
        const scopedInput = scopeToTargetOrigin(input, target);
        targetSession =
            endpoint.connection === undefined
                ? await openCdpTargetSession(endpoint.discovery, target, operation, options.signal)
                : await attachCdpTargetSession(endpoint.connection, target, operation, options.signal);
        output = await work({
            connection: targetSession.connection,
            sessionId: targetSession.sessionId,
            discovery: endpoint.discovery,
            target,
            input: scopedInput,
            ...(options.signal === undefined ? {} : { signal: options.signal }),
            ...(options.progress === undefined ? {} : { progress: options.progress }),
        });
    }
    finally {
        if (targetSession !== undefined)
            await closeCdpTargetSession(targetSession, CLEANUP_DOMAINS, options.signal);
        // An unadopted browser socket is closed here; closing is idempotent.
        await endpoint.connection?.close();
    }
    // Cancellation during teardown must not publish the completed observation.
    // Errors from work or cleanup still propagate through the try/finally above.
    if (options.signal?.aborted === true)
        throw new AnalysisCancelledError(operation, {
            cause: options.signal.reason,
        });
    return output;
};
const selectTargets = (discovery, allowedOrigins) => {
    const allowed = [];
    let disallowedOrigin = 0;
    let unsupportedUrl = 0;
    let nonPage = 0;
    let unconnectable = 0;
    for (const target of discovery.targets) {
        if (target.type !== "page") {
            nonPage += 1;
            continue;
        }
        const url = sanitizeBrowserUrl(target.url);
        if (url.origin === null) {
            unsupportedUrl += 1;
            continue;
        }
        if (allowedOrigins !== undefined && !allowedOrigins.has(url.origin)) {
            disallowedOrigin += 1;
            continue;
        }
        if (!hasCdpTargetWebSocket(discovery, target)) {
            unconnectable += 1;
            continue;
        }
        allowed.push({
            target_id: target.id,
            type: target.type,
            title: target.title,
            url: url.url,
            origin: url.origin,
            attached: target.attached,
        });
    }
    allowed.sort((left, right) => compareUnicodeCodePoints(left.target_id, right.target_id));
    return {
        allowed,
        excluded: {
            disallowed_origin: disallowedOrigin,
            unsupported_url: unsupportedUrl,
            non_page: nonPage,
        },
        unconnectable,
    };
};
const authorizeTarget = (discovery, input) => {
    return authorizeCdpTarget(discovery, input, "inspect_web_page").target;
};
const scopeToTargetOrigin = (input, target) => {
    if (input.allowed_origins.length > 0)
        return input;
    const origin = sanitizeBrowserUrl(target.url).origin;
    if (origin === null)
        throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
    return { ...input, allowed_origins: [origin] };
};
const providerError = (cause, operation, signal) => cause instanceof BrowserObservationError && cause.operation !== operation
    ? new BrowserObservationError(operation, cause.reason, { cause })
    : cause instanceof AnalysisError
        ? cause
        : signal?.aborted === true
            ? new AnalysisCancelledError(operation, { cause })
            : new ProviderAdapterError(CDP_BROWSER_PROVIDER_IDENTITY.id, operation, {
                cause,
            });
