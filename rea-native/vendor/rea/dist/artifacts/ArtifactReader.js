/** Compare captured filesystem identity and mutable metadata at a read boundary. */
export const sameArtifactSourceIdentity = (expected, observed) => expected !== undefined &&
    observed.dev === expected.device &&
    observed.ino === expected.inode &&
    observed.size === expected.size &&
    observed.mode === expected.mode &&
    observed.mtimeNs === expected.mtimeNs &&
    observed.ctimeNs === expected.ctimeNs;
/** Snapshot mutable entry metadata before the producer later validates open(). */
export const copyArtifactEntry = (entry) => ({
    ...entry,
    limitations: [...entry.limitations],
    ...(entry.sourceIdentity === undefined
        ? {}
        : { sourceIdentity: { ...entry.sourceIdentity } }),
});
/** Compare every portable and adapter-owned fact supplied with an entry. */
export const sameArtifactEntry = (entry, produced) => entry.path === produced.path &&
    entry.kind === produced.kind &&
    entry.declaredSize === produced.declaredSize &&
    entry.compressedSize === produced.compressedSize &&
    entry.executable === produced.executable &&
    entry.encrypted === produced.encrypted &&
    entry.byteOffset === produced.byteOffset &&
    entry.declaredSha256 === produced.declaredSha256 &&
    entry.unpacked === produced.unpacked &&
    entry.adapterKey === produced.adapterKey &&
    entry.limitations.length === produced.limitations.length &&
    entry.limitations.every((limitation, index) => limitation === produced.limitations[index]) &&
    entry.sourceIdentity?.device === produced.sourceIdentity?.device &&
    entry.sourceIdentity?.inode === produced.sourceIdentity?.inode &&
    entry.sourceIdentity?.size === produced.sourceIdentity?.size &&
    entry.sourceIdentity?.mode === produced.sourceIdentity?.mode &&
    entry.sourceIdentity?.mtimeNs === produced.sourceIdentity?.mtimeNs &&
    entry.sourceIdentity?.ctimeNs === produced.sourceIdentity?.ctimeNs;
/** Typed adapter failure translated at provider boundary. */
export class ArtifactReaderFailure extends Error {
    reason;
    details;
    cleanup;
    partialObservation;
    constructor(reason, message, options, details) {
        super(message, options);
        this.reason = reason;
        this.details = details;
        this.name = "ArtifactReaderFailure";
        this.cleanup = options?.cleanup;
        this.partialObservation = options?.partialObservation;
    }
    /** Preserve the primary failure while attaching cleanup and any complete observation. */
    static withCleanup(cause, cleanup, partialObservation) {
        const primary = cause instanceof ArtifactReaderFailure
            ? cause
            : new ArtifactReaderFailure("io", errorMessage(cause), { cause });
        const mergedObservation = partialObservation ?? primary.partialObservation;
        return new ArtifactReaderFailure(primary.reason, primary.message, {
            cause: primary,
            cleanup: combineCleanup(primary.cleanup, cleanup),
            ...(mergedObservation === undefined
                ? {}
                : { partialObservation: mergedObservation }),
        }, primary.details);
    }
    /** Give otherwise opaque cleanup failures a concrete owned resource. */
    static cleanupObservation(cause, resource) {
        if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined)
            return cause.cleanup;
        return { reason: errorMessage(cause), resources: [resource] };
    }
}
const combineCleanup = (primary, cleanup) => primary === undefined || primary === cleanup
    ? cleanup
    : {
        reason: `${primary.reason}; ${cleanup.reason}`,
        resources: [...new Set([...primary.resources, ...cleanup.resources])],
    };
const errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
