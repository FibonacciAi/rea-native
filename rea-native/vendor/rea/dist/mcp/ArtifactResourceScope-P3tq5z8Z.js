import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { rn as relationshipCoverageSchema, tn as init_relationshipCoverage } from "./nativeValueTrace-DR9UE62L.js";
import { c as jsonValueSchema, o as init_jsonValue } from "./digests-BFoWUT_-.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";
import { r as init_ArtifactReader, t as ArtifactReaderFailure } from "./ArtifactReader-OyM03Gjn.js";

//#region dist/application/AnalysisProvider.js
function createAnalysisExecution(result, provider, options = {}) {
	return {
		result: jsonValueSchema.parse(result),
		rawResult: options.rawResult === undefined ? null : jsonValueSchema.parse(options.rawResult),
		provider,
		...options.analysisProfile === undefined ? {} : { analysisProfile: structuredClone(options.analysisProfile) },
		limitations: [...options.limitations ?? []],
		...options.relationshipCoverage === undefined ? {} : { relationshipCoverage: relationshipCoverageSchema.parse(options.relationshipCoverage) },
		...options.referencesTruncated === undefined ? {} : { referencesTruncated: options.referencesTruncated },
		locations: [...options.locations ?? []],
		subject: options.subject ?? null
	};
}
function init_AnalysisProvider() {
	return (init_AnalysisProvider = __esmMin((() => {
		init_jsonValue();
		init_relationshipCoverage();
	})))();
}

//#endregion
//#region dist/domain/providerCleanupError.js
var ProviderCleanupError;
function init_providerCleanupError() {
	return (init_providerCleanupError = __esmMin((() => {
		init_providerAdapterError();
		ProviderCleanupError = class extends ProviderAdapterError {
			cleanupIncomplete = true;
			cleanupResources;
			userMessage = "Provider cleanup could not be fully confirmed. Review the reported local resources before opening another target.";
			constructor(providerId, resources, diagnostics, options) {
				const { operation = "close_binary", partialObservation, ...errorOptions } = options ?? {};
				super(providerId, operation, {
					...errorOptions,
					...partialObservation === undefined ? {} : { partialObservation },
					diagnostics
				});
				this.cleanupResources = [...resources];
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactResourceScope.js
var ArtifactResourceScope, cleanup;
function init_ArtifactResourceScope() {
	return (init_ArtifactResourceScope = __esmMin((() => {
		init_ArtifactReader();
		ArtifactResourceScope = class {
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
					if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Artifact resource scope is closed");
					if (this.#draining !== undefined) await this.#draining;
					if (this.#closed) throw new ArtifactReaderFailure("unavailable", "Artifact resource scope is closed");
					if (this.#pending.size > 0) {
						await this.retryCleanup();
						continue;
					}
					const running = Promise.resolve().then(operation);
					this.#active.add(running);
					try {
						return await running;
					} finally {
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
				} catch (cause) {
					this.#pending.add(owner);
					return {
						kind: "failed",
						cause
					};
				}
			}
			/** Retry retained owners without closing resource admission. */
			retryCleanup() {
				if (this.#draining !== undefined) return this.#draining;
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
				while (this.#active.size > 0) await Promise.allSettled(this.#active);
				const failures = [];
				for (const owner of this.#pending) {
					try {
						await cleanup(owner);
						this.#pending.delete(owner);
					} catch (cause) {
						failures.push({
							owner,
							cause
						});
					}
				}
				if (failures.length === 0) return;
				const observations = failures.map(({ owner, cause }) => ArtifactReaderFailure.cleanupObservation(cause, owner.resource));
				const resources = [...new Set(observations.flatMap(({ resources }) => resources))];
				throw new ArtifactReaderFailure("unavailable", `Artifact cleanup remains incomplete: ${resources.join(", ")}`, {
					cause: new AggregateError(failures.map(({ cause }) => cause), "One or more artifact resources remain owned"),
					cleanup: {
						reason: observations.map(({ reason }) => reason).join("; "),
						resources
					}
				});
			}
		};
		cleanup = async (owner) => {
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
				case "private-runtime-root": await owner.root.close();
			}
		};
	})))();
}

//#endregion
export { createAnalysisExecution as a, init_providerCleanupError as i, init_ArtifactResourceScope as n, init_AnalysisProvider as o, ProviderCleanupError as r, ArtifactResourceScope as t };