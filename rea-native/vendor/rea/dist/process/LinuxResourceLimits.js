import { open } from "node:fs/promises";
import { ArtifactReaderFailure } from "../artifacts/ArtifactReader.js";
import { OwnedFileHandle } from "../filesystem/OwnedFileHandle.js";
const rows = {
    address_space_bytes: "Max address space",
    file_bytes: "Max file size",
    cpu_seconds: "Max cpu time",
};
/** Bound the resident input copy and retained text before allocation/collection. */
export const BOUNDED_PRODUCER_LIMITS = {
    input_bytes: 32 * 1024 * 1024,
    output_bytes: 4 * 1024 * 1024,
    command_timeout_ms: 30_000,
    address_space_bytes: 1024 * 1024 * 1024,
    file_bytes: 64 * 1024 * 1024,
    cpu_seconds: 30,
};
/** Pin soft and hard ceilings together, then hand the producer argv to the limiter. */
export const prlimitArgumentVector = (limits, command) => [
    `--as=${limits.address_space_bytes}:${limits.address_space_bytes}`,
    `--fsize=${limits.file_bytes}:${limits.file_bytes}`,
    `--cpu=${limits.cpu_seconds}:${limits.cpu_seconds}`,
    "--core=0:0",
    "--",
    command,
];
/** Never raise either inherited soft policy or hard ceiling. */
export const clampLinuxResourceLimits = (configured, report) => {
    const effective = { ...configured };
    for (const key of Object.keys(rows)) {
        const matches = report
            .split("\n")
            .filter((line) => line.startsWith(`${rows[key]} `));
        const values = matches[0]?.slice(rows[key].length).trim().split(/\s+/u);
        if (matches.length !== 1 || values === undefined || values.length !== 3)
            throw new Error(`Cannot establish inherited Linux limit: ${rows[key]}`);
        let ceiling = BigInt(configured[key]);
        for (const token of values.slice(0, 2)) {
            if (token === "unlimited")
                continue;
            if (!/^[0-9]+$/u.test(token))
                throw new Error(`Invalid inherited Linux limit: ${rows[key]}`);
            const value = BigInt(token);
            if (value < ceiling)
                ceiling = value;
        }
        effective[key] = Number(ceiling);
    }
    return effective;
};
/** Read the trusted kernel report with a fixed allocation before spawning. */
export const readLinuxResourceLimits = async (configured, resourceScope) => {
    const file = await open("/proc/self/limits", "r");
    const owner = new OwnedFileHandle(file);
    let failure;
    try {
        const buffer = Buffer.alloc(16 * 1024);
        const { bytesRead } = await file.read(buffer, 0, buffer.length, 0);
        if (bytesRead === buffer.length)
            throw new Error("Inherited Linux limits exceed the report budget.");
        return clampLinuxResourceLimits(configured, buffer.subarray(0, bytesRead).toString("utf8"));
    }
    catch (cause) {
        failure = cause;
        throw cause;
    }
    finally {
        if (resourceScope === undefined)
            await file.close();
        else {
            const cleaned = await resourceScope.release({
                kind: "file-handle",
                resource: "/proc/self/limits",
                handle: owner,
            });
            if (cleaned.kind === "failed")
                throw ArtifactReaderFailure.withCleanup(failure ?? cleaned.cause, ArtifactReaderFailure.cleanupObservation(cleaned.cause, "/proc/self/limits"));
        }
    }
};
