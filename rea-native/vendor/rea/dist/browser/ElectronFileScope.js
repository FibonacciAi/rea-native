import { open, realpath, stat } from "node:fs/promises";
import { isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { admitAsarHeader, MAX_ASAR_HEADER_BYTES, } from "../artifacts/AsarHeader.js";
/** Resolve one local file URL while rejecting remote hosts and encoded separators. */
export const authorizedElectronFile = async (value) => {
    if (/%(?:2f|5c)/iu.test(value))
        return undefined;
    let url;
    try {
        url = new URL(value);
    }
    catch (cause) {
        // Non-URL input cannot authorize a local file.
        void cause;
        return undefined;
    }
    if (url.protocol !== "file:" ||
        url.hostname !== "" ||
        url.username !== "" ||
        url.password !== "")
        return undefined;
    let path;
    try {
        path = fileURLToPath(url);
    }
    catch (cause) {
        // Unconvertible file URLs cannot authorize a local file.
        void cause;
        return undefined;
    }
    if (!isAbsolute(path) || path.includes("\0"))
        return undefined;
    try {
        if ((await stat(path)).isFile())
            return await realpath(path);
    }
    catch (cause) {
        // Electron serves packaged pages from inside app.asar, which the host
        // filesystem cannot stat; resolve those through the archive header below.
        void cause;
    }
    return await authorizedAsarMember(path);
};
/**
 * Resolve `<archive>.asar/<member>` the way Electron's file protocol does: the
 * first `.asar` path component that is a regular file is the archive, and the
 * remainder must name a regular file in its header (packed or unpacked).
 */
const authorizedAsarMember = async (path) => {
    const segments = path.split(sep);
    for (let index = 1; index < segments.length - 1; index += 1) {
        if (!(segments[index] ?? "").toLowerCase().endsWith(".asar"))
            continue;
        const archive = segments.slice(0, index + 1).join(sep);
        const member = segments.slice(index + 1);
        if (member.some((part) => part === "" || part === "." || part === ".."))
            return undefined;
        try {
            const metadata = await stat(archive);
            if (!metadata.isFile())
                continue;
            const canonical = await realpath(archive);
            const files = await asarFiles(canonical, metadata);
            return isAsarRegularFile(files, member)
                ? join(canonical, ...member)
                : undefined;
        }
        catch (cause) {
            // An unreadable or malformed archive cannot authorize its members.
            void cause;
            return undefined;
        }
    }
    return undefined;
};
// This is a retained-memory budget for JSON headers, shared across all archives.
const MAX_CACHED_HEADERS = 8;
const headerCache = new Map();
const archiveIdentity = (metadata) => `${String(metadata.dev)}:${String(metadata.ino)}:${String(metadata.size)}:${String(metadata.mtimeMs)}`;
/** Read the two Chromium pickle headers on one handle before allocating JSON. */
const asarFiles = async (archive, metadata) => {
    const identity = archiveIdentity(metadata);
    const cached = headerCache.get(archive);
    if (cached?.identity === identity)
        return cached.files;
    const handle = await open(archive, "r");
    let files;
    let jsonBytes;
    try {
        const opened = await handle.stat();
        if (!opened.isFile() || archiveIdentity(opened) !== identity)
            throw new Error("ASAR identity changed before header read");
        const admitted = await admitAsarHeader(handle);
        jsonBytes = admitted.jsonBytes;
        const json = Buffer.alloc(jsonBytes);
        let offset = 0;
        while (offset < json.length) {
            const part = await handle.read(json, offset, json.length - offset, 16 + offset);
            if (part.bytesRead === 0)
                throw new Error("Truncated ASAR JSON header");
            offset += part.bytesRead;
        }
        if (archiveIdentity(await handle.stat()) !== identity)
            throw new Error("ASAR identity changed during header read");
        const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(json));
        if (!isRecord(parsed) || !isRecord(parsed.files))
            throw new Error("ASAR header has no file tree");
        files = parsed.files;
    }
    finally {
        await handle.close();
    }
    headerCache.delete(archive);
    headerCache.set(archive, { identity, files, bytes: jsonBytes });
    const retainedBytes = () => [...headerCache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
    while (headerCache.size > MAX_CACHED_HEADERS ||
        retainedBytes() > MAX_ASAR_HEADER_BYTES)
        headerCache.delete(headerCache.keys().next().value ?? archive);
    return files;
};
const isAsarRegularFile = (files, member) => {
    let node = { files };
    for (const part of member) {
        const children = isRecord(node) ? node.files : undefined;
        if (!isRecord(children) || !Object.hasOwn(children, part))
            return false;
        node = children[part];
    }
    return (isRecord(node) &&
        typeof node.size === "number" &&
        !("files" in node) &&
        !("link" in node));
};
const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
