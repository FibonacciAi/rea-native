import { ArtifactReaderFailure } from "./ArtifactReader.js";
/** Caller-owned scope that retains failed artifact cleanup for a later close. */
export class ArtifactResourceScope {
    #pending = new Set();
    #active = new Set();
    #draining;
    #closed = false;
    get hasPending() {
        return this.#pending.size > 0;
    }
    /** Admit a resource operation while the scope remains open. */
    async run(operation) {
        while (true) {
            if (this.#closed)
                throw new ArtifactReaderFailure("unavailable", "Artifact resource scope is closed");
            if (this.#draining !== undefined)
                await this.#draining;
            if (this.#closed)
                throw new ArtifactReaderFailure("unavailable", "Artifact resource scope is closed");
            if (this.#pending.size > 0) {
                await this.retryCleanup();
                continue;
            }
            const running = Promise.resolve().then(operation);
            this.#active.add(running);
            try {
                return await running;
            }
            finally {
                this.#active.delete(running);
            }
        }
    }
    /** Attempt cleanup now and retain the same owner if it fails. */
    async release(owner) {
        try {
            await cleanup(owner);
            this.#pending.delete(owner);
            return { kind: "released" };
        }
        catch (cause) {
            this.#pending.add(owner);
            return { kind: "failed", cause };
        }
    }
    /** Retry retained owners without closing resource admission. */
    retryCleanup() {
        if (this.#draining !== undefined)
            return this.#draining;
        this.#draining = this.#drainAndRetry().finally(() => {
            this.#draining = undefined;
        });
        return this.#draining;
    }
    /** Stop admission, wait for active operations, and retry every retained owner. */
    close() {
        this.#closed = true;
        return this.retryCleanup();
    }
    async #drainAndRetry() {
        while (this.#active.size > 0)
            await Promise.allSettled(this.#active);
        const failures = [];
        for (const owner of this.#pending) {
            try {
                await cleanup(owner);
                this.#pending.delete(owner);
            }
            catch (cause) {
                failures.push({ owner, cause });
            }
        }
        if (failures.length === 0)
            return;
        const observations = failures.map(({ owner, cause }) => ArtifactReaderFailure.cleanupObservation(cause, owner.resource));
        const resources = [
            ...new Set(observations.flatMap(({ resources }) => resources)),
        ];
        throw new ArtifactReaderFailure("unavailable", `Artifact cleanup remains incomplete: ${resources.join(", ")}`, {
            cause: new AggregateError(failures.map(({ cause }) => cause), "One or more artifact resources remain owned"),
            cleanup: {
                reason: observations.map(({ reason }) => reason).join("; "),
                resources,
            },
        });
    }
}
const cleanup = async (owner) => {
    switch (owner.kind) {
        case "javascript-source-analysis":
            await owner.analysis.close();
            return;
        case "reader":
            await owner.reader.close();
            return;
        case "file-handle":
        case "directory-handle":
            await owner.handle.close();
            return;
        case "output-tree":
            await owner.tree.rollback();
            return;
        case "staged-output":
            await owner.output.close();
            return;
        case "private-runtime-root":
            await owner.root.close();
    }
};
