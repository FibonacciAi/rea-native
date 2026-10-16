import { isAbsolute } from "node:path";
import { annotateEnglishUnicodeCaseCollisions, ArtifactPathRegistry, normalizeArtifactPath, } from "../ArtifactPaths.js";
import { ArtifactReaderFailure, } from "../ArtifactReader.js";
import { AsarArtifactReader } from "../AsarArtifactReader.js";
import { compareUnicodeCodePoints } from "../../domain/unicodeCodePointOrder.js";
import { classifyArtifactContent, classifyArtifactBytes, createArtifactNode, createOccurrence, noteUnreadContainerSuffix, indexOccurrencesByPath, resolveOccurrenceParents, } from "./ArtifactGraphConstruction.js";
import { STRICT_INTEGRITY_POLICY, } from "./types.js";
import { hashReadable } from "../ArtifactHash.js";
const UNAVAILABLE_UNPACKED_LIMITATION = "ASAR unpacked companion bytes were unavailable; no content hash or child artifact was produced.";
const emptyScan = () => ({ nodes: new Map(), occurrences: [], pendingContradictions: [] });
export const scanReader = async (reader, ownedReaders, signal, integrity = STRICT_INTEGRITY_POLICY) => {
    const { nodes, occurrences, pendingContradictions } = emptyScan();
    if (reader === undefined)
        return {
            nodes,
            occurrences,
            pendingContradictions,
            caseCollisionLimitation: undefined,
            unknownParentOccurrences: new Set(),
            traversal: { status: "complete", limitations: [] },
        };
    const context = {
        reader,
        signal,
        integrity,
        nodes,
        occurrences,
        pendingContradictions,
        occurrenceCountByPath: new Map(),
        registry: new ArtifactPathRegistry(),
        expandedContainerIds: new Set(),
        ownedReaders,
        omissions: [],
    };
    await visitArtifactEntries(context, reader, "");
    // Archive directories may appear after their children. Resolve containment
    // against the complete index before directory identities are materialized.
    const byPath = indexOccurrencesByPath(occurrences);
    const parentResolution = resolveOccurrenceParents(occurrences, byPath, context.expandedContainerIds);
    const structuralLimitations = [...parentResolution.limitations];
    return {
        nodes,
        occurrences,
        pendingContradictions,
        caseCollisionLimitation: annotateEnglishUnicodeCaseCollisions(occurrences),
        unknownParentOccurrences: parentResolution.unknownParentOccurrences,
        traversal: {
            status: context.omissions.length === 0 && structuralLimitations.length === 0
                ? "complete"
                : "unknown",
            limitations: [
                ...new Set([
                    ...context.omissions.map(({ path, kind }) => `Artifact traversal omitted ${kind} at ${JSON.stringify(path)}.`),
                    ...structuralLimitations,
                ]),
            ].sort(compareUnicodeCodePoints),
        },
    };
};
const inventoryEntries = (context, reader, prefix) => reader
    .entries(context.signal, {
    onOmission: (omission) => context.omissions.push({
        ...omission,
        path: normalizeArtifactPath(prefix.length === 0 ? omission.path : `${prefix}/${omission.path}`),
    }),
})[Symbol.asyncIterator]();
const visitArtifactEntries = async (context, currentReader, prefix) => {
    const stack = [
        {
            reader: currentReader,
            prefix,
            iterator: inventoryEntries(context, currentReader, prefix),
        },
    ];
    let failure;
    try {
        while (stack.length > 0) {
            const frame = stack.at(-1);
            if (frame === undefined)
                break;
            const next = await frame.iterator.next();
            if (next.done) {
                stack.pop();
                continue;
            }
            const entry = next.value;
            const logicalPath = normalizeArtifactPath(frame.prefix.length === 0
                ? entry.path
                : `${frame.prefix}/${entry.path}`);
            const expandableAsar = isExpandableAsar(entry, logicalPath);
            context.registry.add(logicalPath, expandableAsar ? "directory" : entry.kind);
            const duplicateOrdinal = context.occurrenceCountByPath.get(logicalPath) ?? 0;
            context.occurrenceCountByPath.set(logicalPath, duplicateOrdinal + 1);
            const occurrence = createOccurrence(entry, logicalPath, null, duplicateOrdinal);
            let digested;
            try {
                digested = await digestArtifactEntry(context, frame.reader, entry, logicalPath, occurrence);
            }
            catch (cause) {
                if (!isUnavailableUnpackedEntry(cause, entry))
                    throw cause;
                occurrence.hash_status = "unavailable";
                occurrence.limitations.push(UNAVAILABLE_UNPACKED_LIMITATION);
            }
            if (digested === undefined)
                noteUnreadContainerSuffix(occurrence);
            else {
                context.nodes.set(digested.node.artifact_id, digested.node);
                occurrence.artifact_id = digested.node.artifact_id;
                occurrence.artifact_kind = digested.classification.kind;
                occurrence.artifact_format = digested.classification.format;
                occurrence.hash_status = digested.mismatched
                    ? "mismatched"
                    : "verified";
                if (digested.mismatched)
                    occurrence.limitations.push("Declared integrity metadata contradicts observed bytes.");
            }
            context.occurrences.push(occurrence);
            if (expandableAsar &&
                digested !== undefined &&
                digested.classification.format === "asar" &&
                !digested.mismatched) {
                const nested = new AsarArtifactReader(entry.adapterKey);
                context.ownedReaders.push(nested);
                await nested.prepareContainer(digested.node.sha256, context.signal);
                // Only traversed containers can own members, not opaque ASAR-named files.
                context.expandedContainerIds.add(occurrence.occurrence_id);
                stack.push({
                    reader: nested,
                    prefix: logicalPath,
                    iterator: inventoryEntries(context, nested, logicalPath),
                });
            }
        }
    }
    catch (cause) {
        failure = { cause };
    }
    finally {
        // Readers remain owned by the inventory until its complete observation is built.
        for (const { iterator, prefix, reader } of stack.reverse()) {
            try {
                await iterator.return?.();
            }
            catch (cause) {
                failure = {
                    cause: ArtifactReaderFailure.withCleanup(failure === undefined ? cause : failure.cause, ArtifactReaderFailure.cleanupObservation(cause, `artifact traversal for ${prefix || reader.format}`)),
                };
            }
        }
    }
    if (failure !== undefined)
        throw failure.cause;
};
const digestArtifactEntry = async (context, currentReader, entry, logicalPath, occurrence) => {
    if ((entry.kind !== "file" && entry.kind !== "slice") || entry.encrypted)
        return undefined;
    const digest = await hashReadable(await currentReader.open(entry, context.signal), context.signal);
    const mismatched = entry.declaredSha256 !== null && entry.declaredSha256 !== digest.sha256;
    if (mismatched && entry.declaredSha256 !== null) {
        if (context.integrity.mode === "fail")
            throw new ArtifactReaderFailure("integrity", `Artifact integrity metadata disagrees with content: ${logicalPath}`, undefined, {
                logicalPath,
                declaredSha256: entry.declaredSha256,
                calculatedSha256: digest.sha256,
                unpacked: entry.unpacked,
            });
        context.pendingContradictions.push({
            occurrence,
            declaredSha256: entry.declaredSha256,
            observedSha256: digest.sha256,
            entryKind: entry.kind,
            unpacked: entry.unpacked,
        });
    }
    const classified = entry.kind === "slice"
        ? { kind: "universal-slice", format: "mach-o" }
        : classifyArtifactContent(logicalPath, digest.prefix, digest.bytes);
    return {
        node: createArtifactNode({
            sha256: digest.sha256,
            size: digest.bytes,
            format: classifyArtifactBytes(digest.prefix, digest.bytes),
            contentState: "embedded",
        }),
        mismatched,
        classification: classified,
    };
};
const isExpandableAsar = (entry, logicalPath) => entry.kind === "file" &&
    logicalPath.toLowerCase().endsWith(".asar") &&
    isAbsolute(entry.adapterKey);
const isUnavailableUnpackedEntry = (cause, entry) => entry.unpacked &&
    cause instanceof ArtifactReaderFailure &&
    cause.reason === "unavailable";
