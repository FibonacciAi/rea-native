import { lstat, realpath, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import ignore from "ignore";
import { readRegularFileText, RegularFileCleanupFailure, retryRegularFileCleanup, } from "./RegularFileRead.js";
import { err, ok } from "../domain/result.js";
import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { DEFAULT_REFERENCE_SOURCE_IGNORE_PATTERNS, } from "./ReferenceSourceImportTypes.js";
import { rootFilesystemFailure } from "../reference/ReferenceSourceReaderErrors.js";
const failure = (code, message) => ({
    tag: "reference-source-import",
    code,
    message,
});
const isAborted = (signal) => signal?.aborted === true;
const addMarkedPatterns = (matcher, patterns, mark) => {
    for (const pattern of patterns)
        for (const line of pattern.split(/\r?\n/u))
            matcher.add({ pattern: line, mark });
};
const resolveRoot = async (requestedRoot, signal) => {
    if (isAborted(signal))
        return err(failure("cancelled", "Reference source import cancelled"));
    try {
        const metadata = await stat(requestedRoot);
        if (isAborted(signal))
            return err(failure("cancelled", "Reference source import cancelled"));
        if (!metadata.isDirectory())
            return err(failure("invalid-root", `Reference source root is not a directory: ${requestedRoot}`));
        const canonicalRoot = await realpath(resolve(requestedRoot));
        if (isAborted(signal))
            return err(failure("cancelled", "Reference source import cancelled"));
        return ok(canonicalRoot);
    }
    catch (cause) {
        if (isAborted(signal))
            return err(failure("cancelled", "Reference source import cancelled"));
        const rootFailure = rootFilesystemFailure(cause, "Reference source root could not be resolved");
        if (rootFailure === undefined)
            throw cause;
        return err({ ...failure(rootFailure.code, rootFailure.message), cause });
    }
};
const buildIgnored = async (root, excludePaths, resources, signal) => {
    const ignored = ignore();
    const policyPath = join(root, ".gitignore");
    let present = true;
    try {
        await lstat(policyPath);
    }
    catch (cause) {
        if (!(typeof cause === "object" &&
            cause !== null &&
            "code" in cause &&
            cause.code === "ENOENT"))
            throw cause;
        present = false;
    }
    signal?.throwIfAborted();
    if (present) {
        let text;
        try {
            text = await readRegularFileText(policyPath, { signal });
        }
        catch (cause) {
            if (!(cause instanceof RegularFileCleanupFailure))
                throw cause;
            const retry = await retryRegularFileCleanup(cause, resources);
            if (retry.cleanup !== undefined) {
                const primary = cause.outcome.kind === "failed"
                    ? cause.outcome.cause
                    : cause.cleanupCause;
                return err({
                    ...failure(signal?.aborted === true ? "cancelled" : "io", `Reference source ignore policy could not be read at ${policyPath}: ${errorMessage(primary)}`),
                    cleanup: retry.cleanup,
                    cause: primary,
                });
            }
            if (retry.outcome.kind === "failed")
                throw retry.outcome.cause;
            text = retry.outcome.value;
        }
        addMarkedPatterns(ignored, [text], "project-ignored");
    }
    addMarkedPatterns(ignored, DEFAULT_REFERENCE_SOURCE_IGNORE_PATTERNS, "default-ignored");
    for (const path of excludePaths) {
        addMarkedPatterns(ignored, [path, `${path}/`], "caller-excluded");
    }
    return ok(ignored);
};
/** Resolve the caller-selected directory and build path filters. */
export const prepareReferenceSourceImport = async (options, resources) => {
    try {
        return await resources.run(async () => {
            const root = await resolveRoot(options.root, options.signal);
            if (!root.ok)
                return root;
            try {
                const ignored = await buildIgnored(root.value, options.excludePaths ?? [], resources, options.signal);
                if (!ignored.ok)
                    return ignored;
                return ok({
                    root: root.value,
                    ignored: ignored.value,
                    secrets: ignore().add([...options.policy.secretPatterns]),
                });
            }
            catch (cause) {
                return err({
                    ...failure(options.signal?.aborted === true ? "cancelled" : "io", `Reference source ignore policy could not be read at ${join(root.value, ".gitignore")}: ${errorMessage(cause)}`),
                    cause,
                });
            }
        });
    }
    catch (cause) {
        if (!(cause instanceof ArtifactReaderFailure))
            throw cause;
        return err({
            ...failure(cause.reason === "cancelled" ? "cancelled" : "io", cause.message),
            ...(cause.cleanup === undefined ? {} : { cleanup: cause.cleanup }),
            cause,
        });
    }
};
const errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
