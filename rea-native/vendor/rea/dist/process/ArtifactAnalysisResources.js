import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { readStableArtifact } from "../artifacts/readStableArtifact.js";
import { AnalysisError, } from "../domain/analysisErrorBase.js";
import { AnalysisCancelledError, AnalysisResourceConstraintError, AnalysisOutputError, AnalysisTimeoutError, } from "../domain/analysisErrorCore.js";
import { analysisErrorWithCleanupFailure } from "../domain/analysisErrorCleanup.js";
import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { ProviderAdapterError } from "../domain/providerAdapterError.js";
import { ProviderCleanupError } from "../domain/providerCleanupError.js";
import { err } from "../domain/result.js";
import { readLinuxResourceLimits, } from "./LinuxResourceLimits.js";
import { OwnedCommandFailure, ownedCommandResources } from "./OwnedCommand.js";
/** Own admission, artifact descriptors, producer cleanup and private workspaces together. */
export class ArtifactAnalysisResources {
    providerId;
    operation;
    readArtifact;
    readKernelLimits;
    capacity;
    #artifacts;
    #pending = new Map();
    #tail = Promise.resolve();
    #busy = false;
    #closed = false;
    constructor(providerId, operation, readArtifact, readKernelLimits, capacity) {
        this.providerId = providerId;
        this.operation = operation;
        this.readArtifact = readArtifact;
        this.readKernelLimits = readKernelLimits;
        this.capacity = capacity;
        this.#artifacts = { scope: new ArtifactResourceScope(), operation };
    }
    run(work, signal, operation = this.operation) {
        if (this.#closed || signal?.aborted)
            return Promise.resolve(err(new AnalysisCancelledError(operation)));
        if (this.#busy)
            return Promise.resolve(err(new AnalysisResourceConstraintError(operation, "capacity", this.capacity.message, this.capacity.details)));
        this.#busy = true;
        const running = this.#tail
            .then(() => this.#artifacts.scope.run(() => {
            // Failed descriptor cleanup still belongs to the preceding request until
            // this scope has drained it and admits acquisition for the new request.
            this.#artifacts.operation = operation;
            return work();
        }))
            .catch((cause) => err(this.#artifactFailure(cause)))
            .finally(() => {
            this.#busy = false;
        });
        this.#tail = running.then(() => undefined, () => undefined);
        return running;
    }
    read(path, maximumBytes, signal) {
        return this.readArtifact(path, maximumBytes, signal, undefined, this.#artifacts.scope);
    }
    readLimits(limits) {
        return this.readKernelLimits(limits, this.#artifacts.scope);
    }
    retain(root, owner) {
        this.#pending.set(root, {
            owner,
            operation: this.#pending.get(root)?.operation ?? this.#artifacts.operation,
        });
    }
    get pendingPaths() {
        return [...this.#pending.keys()].map((root) => root.path);
    }
    #resourcesFor(root) {
        const ownership = this.#pending.get(root)?.owner?.launch.ownership;
        return ownership === undefined
            ? [root.path]
            : ownedCommandResources(ownership, root.path);
    }
    get #pendingResources() {
        return [...this.#pending.keys()].flatMap((root) => this.#resourcesFor(root));
    }
    async release() {
        for (const [root, retained] of this.#pending) {
            try {
                const { owner } = retained;
                if (owner !== undefined) {
                    const stopped = await owner.stop();
                    if (stopped.status === "incomplete") {
                        const cleanup = stopped.cleanupResult;
                        throw new ProviderCleanupError(this.providerId, this.#resourcesFor(root), {
                            reason: stopped.reason,
                            ...(cleanup?.failures === undefined
                                ? {}
                                : {
                                    failures: cleanup.failures.map((failure) => ({
                                        ...failure,
                                    })),
                                }),
                            ...(cleanup?.unverified === undefined
                                ? {}
                                : {
                                    unverified: cleanup.unverified.map((process) => ({
                                        ...process,
                                    })),
                                }),
                        }, { operation: retained.operation });
                    }
                    this.#pending.set(root, { ...retained, owner: undefined });
                }
                await root.close();
                this.#pending.delete(root);
            }
            catch (cause) {
                const diagnostics = cause instanceof ProviderCleanupError ? cause.diagnostics : undefined;
                throw new ProviderCleanupError(this.providerId, this.#resourcesFor(root), {
                    ...diagnostics,
                    reason: cause instanceof ProviderCleanupError
                        ? String(diagnostics?.reason ?? cause.message)
                        : String(cause),
                }, { operation: retained.operation, cause });
            }
        }
    }
    cleanupFailure(observation, cause, capturedOutput, operation = this.operation) {
        return new ProviderCleanupError(this.providerId, observation.resources, {
            reason: observation.reason,
            ...(capturedOutput === undefined
                ? {}
                : { captured_output: { ...capturedOutput } }),
        }, { operation, cause });
    }
    commandFailure(cause, limits, effectiveLimits, operation = this.operation) {
        const capturedOutput = cause.snapshot === null
            ? undefined
            : {
                stdout: cause.snapshot.stdout.text,
                stderr: cause.snapshot.stderr.text,
                truncated: cause.snapshot.diagnosticTruncated ?? false,
                exit_code: cause.snapshot.exitCode ?? null,
                signal: cause.snapshot.signal ?? null,
            };
        const detail = {
            cause,
            ...(capturedOutput === undefined ? {} : { capturedOutput }),
        };
        if (cause.reason === "cancelled")
            return new AnalysisCancelledError(operation, detail);
        if (cause.reason === "timeout")
            return new AnalysisTimeoutError(operation, limits.command_timeout_ms, detail);
        if (cause.reason === "output-limit")
            return new AnalysisResourceConstraintError(operation, "memory", cause.message, { output_bytes: limits.output_bytes }, detail);
        if (cause.reason === "process" &&
            (cause.snapshot?.signal === "SIGXFSZ" ||
                cause.snapshot?.signal === "SIGXCPU"))
            return new AnalysisResourceConstraintError(operation, cause.snapshot.signal === "SIGXFSZ" ? "file-size" : "cpu", `Producer terminated with ${cause.snapshot.signal}; the signal's exact cause is not independently established.`, effectiveLimits === undefined ? null : { ...effectiveLimits }, detail);
        return new AnalysisOutputError(operation, cause.message, detail);
    }
    async finish(result, observation, operation = this.operation) {
        try {
            await this.release();
            return result;
        }
        catch (cause) {
            const partialObservation = result.ok
                ? observation(result.value)
                : result.error.partialObservation;
            const cleanupDiagnostics = cause instanceof ProviderCleanupError ? cause.diagnostics : undefined;
            return err(new ProviderCleanupError(this.providerId, this.#pendingResources, {
                ...cleanupDiagnostics,
                reason: cause instanceof ProviderCleanupError
                    ? String(cleanupDiagnostics?.reason ?? cause.message)
                    : String(cause),
                previous_error: result.ok
                    ? null
                    : projectAnalysisError(result.error),
            }, {
                operation,
                cause,
                ...(partialObservation === undefined ? {} : { partialObservation }),
            }));
        }
    }
    close() {
        this.#closed = true;
        const work = this.#tail.then(() => this.#closeResources());
        this.#tail = work.catch(() => undefined);
        return work;
    }
    async #closeResources() {
        let descriptorFailure;
        try {
            await this.#artifacts.scope.close();
        }
        catch (cause) {
            descriptorFailure = this.#artifactFailure(cause);
        }
        try {
            await this.release();
        }
        catch (cause) {
            if (descriptorFailure !== undefined && cause instanceof AnalysisError)
                throw analysisErrorWithCleanupFailure(descriptorFailure, cause, this.#artifacts.operation);
            throw cause;
        }
        if (descriptorFailure !== undefined)
            throw descriptorFailure;
    }
    #artifactFailure(cause, operation = this.#artifacts.operation) {
        if (cause instanceof AnalysisError)
            return cause;
        if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined)
            return this.cleanupFailure(cause.cleanup, cause, undefined, operation);
        return new ProviderAdapterError(this.providerId, operation, {
            cause,
            diagnostics: { stage: "artifact-resources", reason: String(cause) },
        });
    }
}
