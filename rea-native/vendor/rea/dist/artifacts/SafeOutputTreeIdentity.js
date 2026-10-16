import { lstat } from "node:fs/promises";
import { ArtifactReaderFailure } from "./ArtifactReader.js";
export const readDirectoryIdentity = async (path) => {
    const metadata = await lstat(path, { bigint: true });
    if (!metadata.isDirectory())
        throw replacedDirectory(path);
    return { dev: metadata.dev, ino: metadata.ino };
};
export const assertPathIdentity = async (path, expected) => {
    const metadata = await lstat(path, { bigint: true });
    if (!metadata.isDirectory() ||
        metadata.dev !== expected.dev ||
        metadata.ino !== expected.ino)
        throw replacedDirectory(path);
};
export const assertHandleIdentity = async (handle, expected, path) => {
    const metadata = await handle.stat({ bigint: true });
    if (!metadata.isDirectory() ||
        metadata.dev !== expected.dev ||
        metadata.ino !== expected.ino)
        throw replacedDirectory(path);
};
export const readFileIdentity = async (handle, path) => {
    const metadata = await handle.stat({ bigint: true });
    if (!metadata.isFile())
        throw new ArtifactReaderFailure("path", `Extraction file identity changed: ${path}`);
    return { dev: metadata.dev, ino: metadata.ino };
};
export const assertFilePathIdentity = async (path, expected) => {
    const metadata = await lstat(path, { bigint: true });
    if (!metadata.isFile() ||
        metadata.dev !== expected.dev ||
        metadata.ino !== expected.ino)
        throw new ArtifactReaderFailure("path", `Extraction file identity changed: ${path}`);
};
export const isAbsent = async (path) => lstat(path).then(() => false, (cause) => {
    if (isNotFound(cause))
        return true;
    throw cause;
});
export const replacedDirectory = (path) => new ArtifactReaderFailure("path", `Extraction directory identity changed: ${path}`);
const isNotFound = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
