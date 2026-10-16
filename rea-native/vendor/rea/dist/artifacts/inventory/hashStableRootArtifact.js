import { lstat } from "node:fs/promises";
import { readFileHandleChunks } from "../../filesystem/readFileHandleChunks.js";
import { OwnedFileHandle } from "../../filesystem/OwnedFileHandle.js";
import { ArtifactReaderFailure } from "../ArtifactReader.js";
import { NonRegularFileReadError, RegularFileAdmissionFailure, openRegularFile, sameRegularFileState, } from "../../filesystem/RegularFile.js";
import { abortIfNeeded, hashReadable, } from "../ArtifactHash.js";
/** Admit a root descriptor without losing ownership when validation cleanup fails. */
export const openRootArtifact = async (path, resourceScope, signal) => {
    try {
        return new OwnedFileHandle(await openRegularFile(path, { symlinks: "reject", signal }));
    }
    catch (cause) {
        const primary = cause instanceof RegularFileAdmissionFailure ? cause.cause : cause;
        const failure = primary instanceof NonRegularFileReadError
            ? new ArtifactReaderFailure("format", `Artifact root is not a regular file: ${path}`, { cause: primary })
            : primary;
        if (cause instanceof RegularFileAdmissionFailure) {
            const resource = `root artifact descriptor for ${path}`;
            const cleanup = await resourceScope.release({
                kind: "file-handle",
                resource,
                handle: cause.owner,
            });
            if (cleanup.kind === "failed")
                throw ArtifactReaderFailure.withCleanup(failure, ArtifactReaderFailure.cleanupObservation(cleanup.cause, resource));
        }
        throw failure;
    }
};
/** Hash one stable regular root file from the same descriptor that was checked. */
export const hashStableRootArtifact = async (path, resourceScope, signal) => {
    const owner = await openRootArtifact(path, resourceScope, signal);
    const handle = owner.handle;
    let outcome;
    try {
        const initial = await handle.stat();
        outcome = {
            kind: "completed",
            value: await hashStableRootArtifactHandle(path, handle, initial, signal),
        };
    }
    catch (cause) {
        outcome = { kind: "failed", cause };
    }
    const resource = `root artifact descriptor for ${path}`;
    const cleanup = await resourceScope.release({
        kind: "file-handle",
        resource,
        handle: owner,
    });
    if (cleanup.kind === "failed")
        throw ArtifactReaderFailure.withCleanup(outcome.kind === "failed" ? outcome.cause : cleanup.cause, ArtifactReaderFailure.cleanupObservation(cleanup.cause, resource));
    if (outcome.kind === "failed")
        throw outcome.cause;
    return outcome.value;
};
/** Hash and revalidate the same open descriptor used for root classification. */
export const hashStableRootArtifactHandle = async (path, handle, initial, signal) => {
    const digest = await hashReadable(
    // Read at most the admitted extent plus one byte to detect growth without
    // following an actively appended file indefinitely.
    readFileHandleChunks(handle, { start: 0, end: initial.size }), signal);
    abortIfNeeded(signal);
    const [opened, currentPath] = await Promise.all([handle.stat(), lstat(path)]);
    if (!sameRegularFileState(initial, opened) ||
        !sameRegularFileState(initial, currentPath) ||
        digest.bytes !== initial.size)
        throw new ArtifactReaderFailure("integrity", `Root artifact changed during inventory: ${path}`);
    return digest;
};
