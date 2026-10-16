import { captureNetworkBody, captureNetworkHeaders, } from "./PlaywrightNetworkContent.js";
/** Captures correlated network phases and drains selected content before browser cleanup. */
export class PlaywrightScenarioNetwork {
    options;
    transactions = new Map();
    pending = [];
    gaps = new Set();
    accepting = true;
    activeReads = 0;
    readOptions;
    constructor(options) {
        this.options = options;
        this.readOptions = {
            timeoutMs: options.readTimeoutMs ?? 5_000,
            ...(options.signal === undefined ? {} : { signal: options.signal }),
        };
    }
    /** Observe a request start, retaining the producer's redirect relationship when known. */
    request(request) {
        if (!this.accepting)
            return;
        const transaction = this.transaction(request);
        if (transaction === undefined || transaction.requestObserved)
            return;
        if (!this.admitMetadata(request))
            return;
        transaction.requestObserved = true;
        const sequence = this.options.emit({
            ...this.metadata(request, transaction),
            kind: "request",
            status: null,
            failure: null,
        });
        if (sequence === 0)
            return;
        if (this.options.selection.request_body ||
            this.options.selection.header_values)
            this.collect(transaction, sequence, "request", request, () => this.options.selection.request_body
                ? captureNetworkBody(async () => request.postDataBuffer(), "request", request, this.options.secrets, this.readOptions)
                : Promise.resolve({ state: "not_requested" }));
    }
    /** Observe response metadata without starting a potentially unfinished body read. */
    response(response) {
        if (!this.accepting)
            return;
        const request = response.request();
        const transaction = this.transaction(request);
        if (transaction === undefined ||
            !this.admitMetadata(request, undefined, [], [{ source: response, url: response.url() }]))
            return;
        const sequence = this.options.emit({
            ...this.metadata(request, transaction),
            kind: "response",
            url: this.options.secrets.sanitizeUrl(response.url()),
            status: response.status(),
            header_names: this.headerNames(response),
            failure: null,
        });
        if (sequence === 0)
            return;
        transaction.response = { source: response, sequence };
    }
    /** Record completion and read selected content through the response API. */
    finished(request) {
        if (!this.accepting)
            return;
        const transaction = this.transaction(request);
        if (transaction === undefined || !this.admitMetadata(request))
            return;
        transaction.terminal = "finished";
        const sequence = this.options.emit({
            ...this.metadata(request, transaction),
            kind: "request-finished",
            status: null,
            failure: null,
        });
        if (sequence === 0) {
            transaction.responseScheduled = true;
            return;
        }
        this.responseContent(transaction);
    }
    /** Preserve request failure separately from missing or unreadable response content. */
    failed(request) {
        if (!this.accepting)
            return;
        const transaction = this.transaction(request);
        if (transaction === undefined)
            return;
        transaction.terminal = "failed";
        const failure = request.failure()?.errorText || "Unknown request failure";
        if (!this.admitMetadata(request, undefined, [failure]))
            return;
        const message = this.options.secrets.redact(failure);
        const sequence = this.options.emit({
            ...this.metadata(request, transaction),
            kind: "request-failed",
            status: null,
            failure: message,
        });
        if (sequence === 0) {
            transaction.responseScheduled = true;
            return;
        }
        this.responseContent(transaction, {
            state: "unavailable",
            reason: "request-failed",
            message,
        });
    }
    /** Stop observing, mark unfinished transactions, and settle bounded content reads. */
    async finish() {
        if (!this.accepting) {
            await Promise.all(this.pending);
            return;
        }
        this.accepting = false;
        for (const [request, transaction] of this.transactions) {
            if (transaction.terminal === undefined) {
                if (!this.admitMetadata(request))
                    continue;
                this.gaps.add("Some network requests had not completed when capture ended; later activity is unknown.");
                const sequence = this.options.emit({
                    ...this.metadata(request, transaction),
                    kind: "request-unfinished",
                    status: null,
                    failure: null,
                    reason: this.options.signal?.aborted === true
                        ? "cancelled"
                        : "capture-ended",
                });
                if (sequence === 0) {
                    transaction.responseScheduled = true;
                    continue;
                }
                this.responseContent(transaction, {
                    state: "unavailable",
                    reason: this.options.signal?.aborted === true
                        ? "cancelled"
                        : "response-unfinished",
                    message: "The response had not finished at the capture cutoff; no body read or refetch was attempted.",
                });
            }
        }
        await Promise.all(this.pending);
    }
    /** Missing selected content contributes to aggregate completeness. */
    limitations() {
        return [...this.gaps];
    }
    transaction(request) {
        const known = this.transactions.get(request);
        if (known !== undefined)
            return known;
        if (this.transactions.size >= 1024) {
            this.gaps.add("Network collection reached its 1024-transaction resource budget; further transactions were omitted.");
            return undefined;
        }
        const predecessor = request.redirectedFrom();
        const predecessorTransaction = predecessor === null ? undefined : this.transactions.get(predecessor);
        const transaction = {
            id: `request-${this.transactions.size + 1}`,
            redirectedFrom: predecessorTransaction?.id ?? null,
            redirectedFromState: predecessor === null
                ? "root"
                : predecessorTransaction === undefined
                    ? "unknown"
                    : undefined,
            responseScheduled: false,
            requestObserved: false,
        };
        this.transactions.set(request, transaction);
        return transaction;
    }
    admitProducerStrings(values) {
        const collected = [];
        let cost = 0;
        for (const value of values) {
            cost += this.options.secrets.redactionAllocationCost(value.length) + 128;
            if (cost > 1024 * 1024) {
                this.gaps.add("Some network metadata exceeded its allocation budget and was omitted.");
                return false;
            }
            collected.push(value);
        }
        if (this.options.admitText?.(collected) ?? true)
            return true;
        this.gaps.add("Some network metadata was omitted because the aggregate browser event budget was reached; affected transactions are incomplete.");
        return false;
    }
    admitMetadata(source, url, additionalStrings = [], additionalSources = []) {
        return this.admitProducerStrings(this.metadataStrings(source, url, additionalStrings, additionalSources));
    }
    *metadataStrings(source, url, additionalStrings, additionalSources) {
        yield* this.retainedMetadataStrings(source, source.headers(), url);
        yield* additionalStrings;
        for (const extra of additionalSources)
            yield* this.retainedMetadataStrings(extra.source, extra.source.headers(), extra.url);
    }
    *retainedMetadataStrings(source, headers, url) {
        if (url !== undefined)
            yield url;
        for (const name in headers) {
            if (!Object.hasOwn(headers, name))
                continue;
            yield name;
            // Names are always retained in metadata. Values are retained only in
            // selected header-value content; do not charge discarded values.
            if (this.options.selection.header_values)
                yield headers[name];
        }
        if ("method" in source) {
            const request = source;
            yield request.method();
            yield request.url();
            yield request.resourceType();
        }
    }
    headerNames(source) {
        return Object.keys(source.headers())
            .map((name) => this.options.secrets.redact(name))
            .sort();
    }
    metadata(request, transaction) {
        return {
            transaction_id: transaction.id,
            redirected_from_transaction_id: transaction.redirectedFrom,
            ...(transaction.redirectedFromState === undefined
                ? {}
                : {
                    redirected_from_transaction_state: transaction.redirectedFromState,
                }),
            method: this.options.secrets.redact(request.method()),
            url: this.options.secrets.sanitizeUrl(request.url()),
            resource_type: this.options.secrets.redact(request.resourceType()),
            header_names: this.headerNames(request),
        };
    }
    responseContent(transaction, unavailable) {
        const response = transaction.response;
        if (response === undefined ||
            transaction.responseScheduled ||
            (!this.options.selection.response_body &&
                !this.options.selection.header_values))
            return;
        transaction.responseScheduled = true;
        this.collect(transaction, response.sequence, "response", response.source, () => this.options.selection.response_body
            ? unavailable === undefined
                ? captureNetworkBody(() => response.source.body(), "response", response.source, this.options.secrets, this.readOptions)
                : Promise.resolve(unavailable)
            : Promise.resolve({ state: "not_requested" }));
    }
    collect(transaction, sequence, phase, source, body) {
        if (this.activeReads >= 16) {
            const message = "Network content exceeds the 16 concurrent-read budget.";
            this.gaps.add(message);
            this.options.emit({
                kind: "network-content",
                transaction_id: transaction.id,
                source_event_sequence: sequence,
                phase,
                headers: this.options.selection.header_values
                    ? { state: "unavailable", message }
                    : { state: "not_requested" },
                body: this.options.selection[phase === "request" ? "request_body" : "response_body"]
                    ? { state: "unavailable", reason: "body-read-failed", message }
                    : { state: "not_requested" },
            });
            return;
        }
        this.activeReads += 1;
        const headers = this.options.selection.header_values
            ? captureNetworkHeaders(source, this.options.secrets, this.readOptions)
            : Promise.resolve({ state: "not_requested" });
        this.pending.push(Promise.all([headers, body()])
            .then(([retainedHeaders, retainedBody]) => {
            if (retainedHeaders.state === "unavailable" ||
                retainedBody.state === "unavailable" ||
                retainedBody.state === "not_exposed")
                this.gaps.add("Some selected network content was unavailable; per-transaction content states retain the reason.");
            this.options.emit({
                kind: "network-content",
                transaction_id: transaction.id,
                source_event_sequence: sequence,
                phase,
                headers: retainedHeaders,
                body: retainedBody,
            });
        })
            .finally(() => {
            this.activeReads -= 1;
        }));
    }
}
