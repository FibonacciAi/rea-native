import { AnalysisCapabilityUnavailableError } from "../../domain/analysisErrorCore.js";
import { ProviderCleanupError } from "../../domain/providerCleanupError.js";
import { ProviderAdapterError } from "../../domain/providerAdapterError.js";
import { err, ok } from "../../domain/result.js";
import { closeAnalysisClient } from "./AnalysisClientCleanup.js";
import { compareUnicodeCodePoints } from "../../domain/unicodeCodePointOrder.js";
/** Synthetic identity for a deterministic provider set. */
const compositeProviderIdentity = (identities) => ({
    id: `composite:${identities
        .map(({ id }) => id)
        .sort()
        .join("+")}`,
    name: "REA composite analysis provider",
    version: null,
});
const closeCompositeClients = (identity, clients) => async (options) => {
    const outcomes = await Promise.all([...clients.entries()].map(([provider, client]) => closeAnalysisClient(client, provider.identity().id, options).then((result) => ({ providerId: provider.identity().id, result }))));
    const failures = outcomes.flatMap(({ providerId, result }) => result.ok ? [] : [{ providerId, error: result.error }]);
    if (failures.length === 0)
        return ok(null);
    if (failures.length === 1) {
        const failure = failures[0];
        if (failure !== undefined)
            return err(failure.error);
    }
    const resources = [
        ...new Set(failures.flatMap(({ error }) => error.cleanupResources)),
    ];
    return err(new ProviderCleanupError(identity.id, resources, {
        reason: "Multiple composed provider clients could not be confirmed closed.",
        failures: failures.map(({ providerId, error }) => ({
            provider_id: providerId,
            message: error.message,
            resources: [...error.cleanupResources],
            ...(error.diagnostics === undefined
                ? {}
                : { diagnostics: error.diagnostics }),
        })),
    }, {
        cause: new AggregateError(failures.map(({ error }) => error), "Composed provider cleanup failed."),
    }));
};
const executeCompositeHealth = async (identity, clients, options) => {
    for (const [provider, client] of clients) {
        const health = client.operationHealthSnapshot?.();
        if (health !== undefined &&
            health.state !== "idle" &&
            health.state !== "busy")
            return err(new ProviderAdapterError(provider.identity().id, "health", {
                diagnostics: {
                    reason: `instantiated provider client is ${health.state}`,
                },
            }));
        const checked = await client.execute("health", {}, options);
        if (!checked.ok)
            return checked;
    }
    return ok({
        result: null,
        rawResult: null,
        provider: identity,
        limitations: [],
        locations: [],
        subject: null,
    });
};
/** Deterministically route disjoint operations without eagerly starting children. */
export class CompositeProvider {
    providers;
    #identity;
    #capabilities;
    #providerByOperation;
    constructor(providers) {
        this.providers = providers;
        if (providers.length === 0)
            throw new RangeError("CompositeProvider requires at least one provider");
        this.#identity = Object.freeze(compositeProviderIdentity(providers.map((provider) => provider.identity())));
        const routes = new Map();
        const capabilities = [];
        for (const provider of providers) {
            for (const descriptor of provider.capabilities()) {
                if (routes.has(descriptor.operation))
                    throw new TypeError(`Multiple providers declare operation ${descriptor.operation}`);
                routes.set(descriptor.operation, provider);
                capabilities.push(descriptor);
            }
        }
        this.#providerByOperation = routes;
        this.#capabilities = Object.freeze(capabilities.sort((left, right) => compareUnicodeCodePoints(left.operation, right.operation) ||
            compareUnicodeCodePoints(left.provider.id, right.provider.id)));
    }
    identity() {
        return this.#identity;
    }
    capabilities() {
        return this.#capabilities;
    }
    createClient(target, profile, context) {
        const clients = new Map();
        const clientFor = (provider) => {
            const existing = clients.get(provider);
            if (existing !== undefined)
                return existing;
            const created = provider.createClient(target, profile?.provider.id === provider.identity().id ? profile : undefined, context);
            clients.set(provider, created);
            return created;
        };
        const close = closeCompositeClients(this.#identity, clients);
        return {
            executeIfReady: (operation, parameters, options) => {
                const provider = this.#providerByOperation.get(operation);
                const client = provider === undefined ? undefined : clients.get(provider);
                return (client?.executeIfReady?.(operation, parameters, options) ??
                    Promise.resolve(undefined));
            },
            execute: async (operation, parameters, options) => {
                if (operation === "health")
                    return executeCompositeHealth(this.#identity, clients, options);
                const provider = this.#providerByOperation.get(operation);
                return provider === undefined
                    ? Promise.resolve(err(new AnalysisCapabilityUnavailableError(this.#identity.id, operation, "operation is not declared by this provider set")))
                    : clientFor(provider).execute(operation, parameters, options);
            },
            runtimeLineageSnapshots: () => [...clients.values()]
                .flatMap((client) => client.runtimeLineageSnapshots?.() ?? [])
                .sort((left, right) => compareUnicodeCodePoints(left.provider.id, right.provider.id)),
            requestActivitySnapshots: () => [...clients.values()]
                .flatMap((client) => client.requestActivitySnapshots?.() ?? [])
                .sort((left, right) => compareUnicodeCodePoints(left.provider.id, right.provider.id)),
            operationHealthSnapshot: () => {
                const snapshots = [...clients.values()].map((client) => client.operationHealthSnapshot?.());
                if (snapshots.some((snapshot) => snapshot === undefined))
                    return undefined;
                return (snapshots.find((snapshot) => snapshot !== undefined && snapshot.state !== "idle") ?? snapshots[0]);
            },
            close,
        };
    }
}
