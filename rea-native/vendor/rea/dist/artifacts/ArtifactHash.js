import { createHash } from "node:crypto";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
import { streamChunkToBuffer } from "./StreamBytes.js";
import { createXmlPlistSignatureProbe, MAX_XML_PLIST_PROBE_BYTES, } from "../domain/apple/appleArchiveFormat.js";
/** Bounded classification evidence; this is not an executable format size limit. */
export const ARTIFACT_CLASSIFICATION_PREFIX_BYTES = 8_192;
/** Preserve the inventory cancellation reason at a stream boundary. */
export const abortIfNeeded = (signal) => {
    if (signal?.aborted === true)
        throw new ArtifactReaderFailure("cancelled", "Artifact inventory cancelled");
};
/** Hash every stream byte and retain its bounded classification prefix. */
export const hashReadable = async (stream, signal) => {
    const hash = createHash("sha256");
    const prefixes = [];
    let prefixBytes = 0;
    const xmlProbe = createXmlPlistSignatureProbe();
    let bytes = 0;
    for await (const raw of stream) {
        abortIfNeeded(signal);
        const chunk = streamChunkToBuffer(raw);
        bytes += chunk.length;
        hash.update(chunk);
        let chunkOffset = 0;
        while (chunkOffset < chunk.length &&
            (prefixBytes < ARTIFACT_CLASSIFICATION_PREFIX_BYTES ||
                (xmlProbe.state === "pending" &&
                    prefixBytes < MAX_XML_PLIST_PROBE_BYTES))) {
            const limit = prefixBytes < ARTIFACT_CLASSIFICATION_PREFIX_BYTES
                ? ARTIFACT_CLASSIFICATION_PREFIX_BYTES
                : MAX_XML_PLIST_PROBE_BYTES;
            const selected = chunk.subarray(chunkOffset, Math.min(chunkOffset + limit - prefixBytes, chunk.length));
            prefixes.push(selected);
            prefixBytes += selected.length;
            chunkOffset += selected.length;
            xmlProbe.write(selected);
        }
    }
    return { sha256: hash.digest("hex"), bytes, prefix: Buffer.concat(prefixes) };
};
