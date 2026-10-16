import { browserScenarioEventSchema, } from "../domain/browserScenarioCaptureValues.js";
import { PlaywrightScenarioNetwork } from "./network/PlaywrightScenarioNetwork.js";
// Conservative allocation accounting includes UTF-16 storage and worst-case
// JSON escaping. Reserve before schema cloning; never serialize to measure.
const MAX_EVENT_COST = 4 * 1024 * 1024;
const MAX_CAPTURE_COST = 16 * 1024 * 1024;
const MAX_EVENTS = 10_000;
const MAX_LISTENER_OWNERS = 2048;
const allocationCost = (value, remaining) => {
    if (typeof value === "string")
        return value.length * 8 + 2;
    if (value === null || typeof value !== "object")
        return 32;
    let cost = 2;
    for (const key in value) {
        if (!Object.hasOwn(value, key))
            continue;
        const item = value[key];
        cost += key.length * 8 + 4 + allocationCost(item, remaining - cost);
        if (cost > remaining)
            break;
    }
    return cost;
};
/** Arrival-ordered Playwright event capture with current-step attribution. */
export class PlaywrightScenarioEvents {
    items = [];
    retainedCost = 0;
    dropped = 0;
    stepIndex = 0;
    sequence = 0;
    enabled;
    secrets;
    ownsContext;
    pages = new WeakSet();
    incompleteFamilies = new Set();
    network;
    stopNetwork;
    stopListeners = new Map();
    sealed = false;
    constructor(options) {
        const network = options.network ?? {
            request_body: false,
            response_body: false,
            header_values: false,
        };
        this.enabled = new Set(options.enabled);
        if (network.request_body || network.response_body || network.header_values)
            this.enabled = new Set([...this.enabled, "network"]);
        this.secrets = options.secrets;
        this.ownsContext = options.ownsContext === true;
        this.pages.add(options.page);
        if (this.ownsContext && this.enabled.size > 0) {
            const context = options.context ?? options.page.context();
            const onPage = (page) => this.popup(page);
            context.on("page", onPage);
            this.retainListener(context, () => context.off("page", onPage));
        }
        if (this.enabled.has("network")) {
            const context = options.context ?? options.page.context();
            const collector = new PlaywrightScenarioNetwork({
                selection: network,
                secrets: options.secrets,
                emit: (event) => this.push(event),
                admitText: (values) => this.admitProducerText(values),
                ...(options.signal === undefined ? {} : { signal: options.signal }),
            });
            this.network = collector;
            const inScope = (request) => {
                if (this.ownsContext)
                    return true;
                try {
                    return this.pages.has(request.frame().page());
                }
                catch (cause) {
                    // Initial popup navigations can lack a frame. Never guess ownership
                    // from a URL in a shared context; connect captures are attach-limited.
                    void cause;
                    return false;
                }
            };
            const onRequest = (request) => {
                if (inScope(request))
                    collector.request(request);
            };
            const onResponse = (response) => {
                if (inScope(response.request()))
                    collector.response(response);
            };
            const onFailed = (request) => {
                if (inScope(request))
                    collector.failed(request);
            };
            const onFinished = (request) => {
                if (inScope(request))
                    collector.finished(request);
            };
            context.on("request", onRequest);
            context.on("response", onResponse);
            context.on("requestfailed", onFailed);
            context.on("requestfinished", onFinished);
            this.stopNetwork = () => {
                context.off("request", onRequest);
                context.off("response", onResponse);
                context.off("requestfailed", onFailed);
                context.off("requestfinished", onFinished);
            };
        }
        this.observePage(options.page);
    }
    setStep(index) {
        this.stepIndex = index;
    }
    nextSequence() {
        return this.sequence + 1;
    }
    lastSequence() {
        return this.sequence;
    }
    /** Drain selected network content and freeze the result before browser teardown. */
    async finish() {
        this.stopNetwork?.();
        this.stopNetwork = undefined;
        for (const owner of this.stopListeners.keys())
            this.releaseListeners(owner);
        this.pages = new WeakSet();
        try {
            await this.network?.finish();
        }
        finally {
            this.sealed = true;
        }
    }
    /** Report selected popup event families with unrecoverable pre-discovery gaps. */
    limitations() {
        const popupGaps = [...this.incompleteFamilies].map((family) => `Popup ${family} events before Page discovery are unavailable; later events are retained.`);
        const gaps = [...popupGaps, ...(this.network?.limitations() ?? [])];
        if (this.dropped > 0)
            gaps.push("Browser event collection reached its resource budget; omitted events and descendant observations are unknown.");
        return this.enabled.has("network") && !this.ownsContext
            ? [
                "Shared-context network capture excludes requests without a known root or descendant Page frame.",
                ...gaps,
            ]
            : gaps;
    }
    result() {
        return {
            retained: this.items.length,
            dropped: this.dropped,
            items: this.items,
        };
    }
    push(event) {
        if (this.sealed)
            return 0;
        this.sequence += 1;
        if (this.items.length >= MAX_EVENTS) {
            this.dropped += 1;
            return 0;
        }
        const cost = allocationCost(event, MAX_EVENT_COST) + 128;
        if (cost > MAX_EVENT_COST || this.retainedCost + cost > MAX_CAPTURE_COST) {
            this.dropped += 1;
            return 0;
        }
        this.retainedCost += cost;
        const parsed = browserScenarioEventSchema.parse({
            ...event,
            sequence: this.sequence,
            step_index: this.stepIndex,
        });
        this.items.push(parsed);
        return this.sequence;
    }
    admitText(...values) {
        return this.admitProducerText(values);
    }
    /** Admit conservative output cost before running redaction or cloning. */
    admitProducerText(values) {
        if (this.sealed)
            return false;
        let cost = 4096;
        for (const value of values) {
            cost += this.secrets.redactionAllocationCost(value.length);
            if (cost > MAX_EVENT_COST ||
                cost > MAX_CAPTURE_COST - this.retainedCost) {
                this.sequence += 1;
                this.dropped += 1;
                return false;
            }
        }
        if (this.items.length >= MAX_EVENTS ||
            cost > MAX_EVENT_COST ||
            cost > MAX_CAPTURE_COST - this.retainedCost) {
            this.sequence += 1;
            this.dropped += 1;
            return false;
        }
        return true;
    }
    admitOwner() {
        if (this.sealed)
            return false;
        if (this.stopListeners.size < MAX_LISTENER_OWNERS)
            return true;
        this.dropped += 1;
        return false;
    }
    retainListener(owner, stop) {
        let stops = this.stopListeners.get(owner);
        if (stops === undefined) {
            stops = new Set();
            this.stopListeners.set(owner, stops);
        }
        stops.add(stop);
    }
    releaseListeners(owner) {
        const stops = this.stopListeners.get(owner);
        this.stopListeners.delete(owner);
        for (const stop of stops ?? [])
            stop();
    }
    observePage(page) {
        if (this.enabled.size > 0) {
            const onClose = () => {
                this.releaseListeners(page);
            };
            page.on("close", onClose);
            this.retainListener(page, () => page.off("close", onClose));
        }
        if (this.enabled.has("console")) {
            const onConsole = (message) => this.console(message);
            page.on("console", onConsole);
            this.retainListener(page, () => page.off("console", onConsole));
        }
        if (this.enabled.has("page-errors")) {
            const onError = (error) => {
                if (!this.admitText(error.message, error.stack ?? ""))
                    return;
                this.push({
                    kind: "page-error",
                    message: this.secrets.redact(error.message),
                    stack: error.stack === undefined ? null : this.secrets.redact(error.stack),
                });
            };
            page.on("pageerror", onError);
            this.retainListener(page, () => page.off("pageerror", onError));
        }
        if (this.enabled.has("websockets")) {
            const onWebSocket = (socket) => this.webSocket(socket);
            page.on("websocket", onWebSocket);
            this.retainListener(page, () => page.off("websocket", onWebSocket));
        }
        if (this.enabled.has("frames")) {
            const onAttached = (frame) => this.frame("frame-attached", frame);
            const onDetached = (frame) => this.frame("frame-detached", frame);
            const onNavigated = (frame) => this.frame("frame-navigated", frame);
            page.on("frameattached", onAttached);
            page.on("framedetached", onDetached);
            page.on("framenavigated", onNavigated);
            this.retainListener(page, () => page.off("frameattached", onAttached));
            this.retainListener(page, () => page.off("framedetached", onDetached));
            this.retainListener(page, () => page.off("framenavigated", onNavigated));
        }
        if (this.enabled.has("workers")) {
            const onWorker = (worker) => this.worker(worker);
            page.on("worker", onWorker);
            this.retainListener(page, () => page.off("worker", onWorker));
        }
        // Any selected family needs descendant discovery in shared contexts.
        // Popup lifecycle records remain gated on their own selector below.
        if (this.enabled.size > 0) {
            const onPopup = (popup) => this.popup(popup);
            page.on("popup", onPopup);
            this.retainListener(page, () => page.off("popup", onPopup));
        }
        if (this.enabled.has("downloads")) {
            const onDownload = (download) => this.download(download);
            page.on("download", onDownload);
            this.retainListener(page, () => page.off("download", onDownload));
        }
    }
    safeUrl(value) {
        return this.secrets.sanitizeUrl(value);
    }
    console(message) {
        const rawText = message.text();
        const location = message.location();
        if (!this.admitText(rawText, location.url, message.type()))
            return;
        this.push({
            kind: "console",
            level: this.secrets.redact(message.type()),
            text: this.secrets.redact(rawText),
            url: location.url === "" ? null : this.safeUrl(location.url),
        });
    }
    webSocket(socket) {
        if (!this.admitOwner())
            return;
        if (!this.admitText(socket.url()))
            return;
        const url = this.safeUrl(socket.url());
        this.push({ kind: "websocket-opened", url });
        const onSent = ({ payload }) => this.webSocketFrame("websocket-frame-sent", url, payload);
        const onReceived = ({ payload }) => this.webSocketFrame("websocket-frame-received", url, payload);
        const onClose = () => {
            this.push({ kind: "websocket-closed", url });
            this.releaseListeners(socket);
        };
        socket.on("framesent", onSent);
        socket.on("framereceived", onReceived);
        socket.on("close", onClose);
        this.retainListener(socket, () => socket.off("framesent", onSent));
        this.retainListener(socket, () => socket.off("framereceived", onReceived));
        this.retainListener(socket, () => socket.off("close", onClose));
    }
    webSocketFrame(kind, url, payload) {
        const bytes = Buffer.byteLength(payload);
        const isText = typeof payload === "string";
        if (!isText) {
            this.push({
                kind,
                url,
                payload_type: "binary",
                payload_bytes: bytes,
                payload_text: null,
                truncated: false,
            });
            return;
        }
        if (!this.admitText(payload))
            return;
        const text = this.secrets.redact(payload);
        this.push({
            kind,
            url,
            payload_type: "text",
            payload_bytes: bytes,
            payload_text: text,
            truncated: false,
        });
    }
    frame(kind, frame) {
        if (!this.admitText(frame.url(), frame.name()))
            return;
        this.push({
            kind,
            url: frame.url() === "" ? null : this.safeUrl(frame.url()),
            name: frame.name() === "" ? null : this.secrets.redact(frame.name()),
        });
    }
    worker(worker) {
        if (!this.admitOwner() || !this.admitText(worker.url()))
            return;
        const details = {
            url: this.safeUrl(worker.url()),
            name: null,
        };
        this.push({ kind: "worker-created", ...details });
        const onClose = () => {
            this.push({ kind: "worker-closed", ...details });
            this.releaseListeners(worker);
        };
        worker.on("close", onClose);
        this.retainListener(worker, () => worker.off("close", onClose));
    }
    popup(page) {
        if (this.pages.has(page))
            return;
        if (!this.admitOwner() || !this.admitText(page.url()))
            return;
        this.pages.add(page);
        for (const family of [
            "frames",
            "workers",
            "websockets",
            "downloads",
        ])
            if (this.enabled.has(family))
                this.incompleteFamilies.add(family);
        const opened = {
            url: page.url() === "" ? null : this.safeUrl(page.url()),
            name: null,
        };
        if (this.enabled.has("popups")) {
            this.push({ kind: "popup-opened", ...opened });
            const onClose = () => {
                if (!this.admitText(page.url()))
                    return;
                this.push({
                    kind: "popup-closed",
                    url: page.url() === "" ? null : this.safeUrl(page.url()),
                    name: null,
                });
            };
            page.on("close", onClose);
            this.retainListener(page, () => page.off("close", onClose));
        }
        this.observePage(page);
    }
    download(download) {
        if (this.admitText(download.suggestedFilename(), download.url()))
            this.push({
                kind: "download-cancelled",
                suggested_filename: this.secrets.redact(download.suggestedFilename()),
                url: this.safeUrl(download.url()),
            });
        void download.cancel().catch((cause) => {
            // best-effort cleanup: download cancellation must not reject unhandled.
            void cause;
        });
    }
}
