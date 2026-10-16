import { compareUnicodeCodePoints } from "../domain/unicodeCodePointOrder.js";
import { err, ok } from "../domain/result.js";
import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { traverseDirectory } from "./ReferenceSourceReaderEntries.js";
import { isAborted, noFollowOpenSupported, prepareRoot, } from "./ReferenceSourceReaderValidate.js";
const PATH_RACE_LIMITATION = "Path identity is revalidated around operations; Node lacks portable descriptor-relative openat traversal, so a syscall-boundary pathname race remains.";
/** Read a source tree without intentionally following symbolic links. */
export const readReferenceSource = async (root, resources, options = {}) => {
    try {
        return await resources.run(() => readSource(root, resources, options));
    }
    catch (cause) {
        if (!(cause instanceof ArtifactReaderFailure))
            throw cause;
        return err({
            tag: "reference-source-reader",
            code: cause.reason === "cancelled" ? "cancelled" : "io",
            message: cause.message,
            ...(cause.cleanup === undefined ? {} : { cleanup: cause.cleanup }),
            cause,
        });
    }
};
const readSource = async (root, resources, options) => {
    if (!noFollowOpenSupported())
        return err({
            tag: "reference-source-reader",
            code: "unsupported",
            message: "Safe no-follow file opens are unavailable",
        });
    const prepared = await prepareRoot(root, options.signal);
    if (!prepared.ok)
        return prepared;
    const { canonicalRoot, rootIdentity } = prepared.value;
    const state = {
        resources,
        root: canonicalRoot,
        rootIdentity,
        ...(options.signal === undefined ? {} : { signal: options.signal }),
        ...(options.shouldExclude === undefined
            ? {}
            : { shouldExclude: options.shouldExclude }),
        entries: [],
        pending: [{ path: canonicalRoot }],
        bytesRead: 0,
    };
    const traversal = await traverse(state);
    state.entries.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
    const read = {
        root: canonicalRoot,
        entries: state.entries,
        bytesRead: state.bytesRead,
        limitations: [PATH_RACE_LIMITATION],
    };
    return traversal.ok ? ok(read) : err({ ...traversal.error, partial: read });
};
const traverse = async (state) => {
    while (state.pending.length > 0) {
        if (isAborted(state.signal))
            return err({
                tag: "reference-source-reader",
                code: "cancelled",
                message: "Reference source traversal cancelled",
            });
        const current = state.pending.pop();
        if (current === undefined)
            break;
        const result = await traverseDirectory(state, current);
        if (!result.ok)
            return result;
    }
    return ok(undefined);
};
