import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileBoundedOutput } from "../process/ExecFileBoundedOutput.js";
import { execFileOutput } from "../process/ExecFileOutput.js";
import { downloadHopperPackage, HOPPER_DOWNLOAD_BYTES, } from "./HopperDownload.js";
/** Package-manager output retained per stream without stopping the command. */
const PACKAGE_MANAGER_OUTPUT_BYTES = 64 * 1024;
const DOWNLOAD_PREFIX = "https://www.hopperapp.com:443/downloader/public/";
const SUPPORTED_HOPPER_SHA256 = new Set([
    "0294ced141cc373468ee22d8343e7dac41980cb05a937994ca81c9f09afe7ded",
    "1339f9e58377442b0c6fcb0dfc3cec20d593cc557408521fad9a00dbc6b8da13",
]);
const SUPPORTED_RELEASES = {
    deb: {
        filename: `${DOWNLOAD_PREFIX}Hopper-6.4.2-Linux-demo.deb`,
        file_length: "35755772",
        file_hash: "e4f79dff602648a8ff4a88b773875b6bfac0dc65",
    },
    rpm: {
        filename: `${DOWNLOAD_PREFIX}Hopper-6.4.2-Linux-demo.rpm`,
        file_length: "32264475",
        file_hash: "b9a65f2f583a386d440d4401d9140aef3bf305de",
    },
    arch: {
        filename: `${DOWNLOAD_PREFIX}Hopper-6.4.2-Linux-demo.pkg.tar.xz`,
        file_length: "29405968",
        file_hash: "92d780b61cab38eda95dc4112dee4fbeb0920f46",
    },
};
/** Describe the release and package-manager commands without downloading or writing. */
export const linuxHopperInstallDisclosure = (family, isRoot) => {
    const release = SUPPORTED_RELEASES[family];
    return {
        downloadUrl: release.filename,
        expectedBytes: Number(release.file_length),
        expectedSha1: release.file_hash,
        commands: linuxPackageManagerCommands(family, `<verified-hopper.${family}>`, isRoot).map(({ executable, args }) => formatCommandForDisplay(executable, args)),
    };
};
/**
 * Whether REA's analysis providers run on this distribution. A recognized
 * package family means a glibc host with a known package layout, which is what
 * the providers need; downloading and installing the official Hopper package
 * additionally requires a distribution on its tested list.
 */
export const supportsReaHost = (distribution) => distribution?.packageFamily !== undefined;
/** Own failed temporary cleanup until a later retry succeeds. */
export class LinuxHopperTemporaryCleanupOwner {
    pending = new Map();
    retain(failure) {
        this.pending.set(failure.path, failure);
    }
    async retry(cleanup) {
        const failures = [];
        for (const path of this.pending.keys()) {
            try {
                await cleanup(path);
                this.pending.delete(path);
            }
            catch (cause) {
                const reason = cause instanceof Error ? cause.message : String(cause);
                failures.push(`Linux Hopper temporary cleanup failed for ${path}: ${reason}`);
            }
        }
        return failures.length === 0 ? undefined : failures.join("; ");
    }
}
/** Parse an os-release document without executing its shell syntax. */
export const parseLinuxDistribution = (text) => {
    const fields = new Map();
    for (const line of text.split("\n")) {
        const match = /^([A-Z_]+)=(.*)$/u.exec(line.trim());
        if (match === null)
            continue;
        const key = match[1];
        const encoded = match[2];
        if (key === undefined || encoded === undefined)
            continue;
        const quote = encoded[0];
        const quoted = (quote === "'" || quote === '"') && encoded.endsWith(quote);
        const value = !quoted
            ? encoded
            : quote === "'"
                ? encoded.slice(1, -1)
                : encoded.slice(1, -1).replace(/\\(["\\$`])/gu, "$1");
        fields.set(key, value);
    }
    const id = (fields.get("ID") ?? "unknown").toLowerCase();
    const versionId = fields.get("VERSION_ID");
    const packageFamily = packageFamilyFor(id, fields.get("ID_LIKE"));
    const hopperSetupSupported = packageFamily !== undefined &&
        (id === "arch" ||
            id === "cachyos" ||
            (id === "omarchy" && packageFamily === "arch") ||
            (id === "ubuntu" && versionAtLeast(versionId, 24)) ||
            (id === "fedora" && versionAtLeast(versionId, 41)) ||
            (id === "nobara" && versionAtLeast(versionId, 44)));
    const identity = {
        id,
        ...(versionId === undefined ? {} : { versionId }),
    };
    return hopperSetupSupported
        ? { ...identity, packageFamily, hopperSetupSupported: true }
        : { ...identity, packageFamily, hopperSetupSupported: false };
};
/** Read and classify the current Linux distribution. */
export const readLinuxDistribution = async () => {
    try {
        return parseLinuxDistribution(await readFile("/etc/os-release", "utf8"));
    }
    catch (cause) {
        // best-effort cleanup: optional host probing; unknown distribution means unsupported.
        void cause;
        return undefined;
    }
};
/** Download, verify, install, and read back the official Hopper Linux package. */
export const installLinuxHopper = async (host = systemLinuxHopperInstallHost(process.env), options = {}) => {
    if (options.signal?.aborted === true)
        return { status: "failed", reason: "cancelled" };
    const distribution = await host.distribution();
    if (distribution?.hopperSetupSupported !== true)
        return { status: "failed", reason: "unsupported_host" };
    let temporary;
    let result;
    try {
        result = await (async () => {
            const release = (options.releases ?? SUPPORTED_RELEASES)[distribution.packageFamily];
            const archiveDownload = await host.download(release.filename, options);
            if (!archiveDownload.ok)
                return { status: "failed", reason: "download" };
            if (!packageIntegrityMatches(archiveDownload.bytes, release))
                return { status: "failed", reason: "integrity" };
            temporary = await host.createTemporaryDirectory();
            const archive = join(temporary, `hopper.${distribution.packageFamily}`);
            await host.writeArchive(archive, archiveDownload.bytes);
            const install = await host.installPackage(distribution.packageFamily, archive);
            if (install.status === "failed")
                return {
                    status: "failed",
                    reason: "authorization_or_package_manager",
                    packageFailure: install.failure,
                };
            const launcherPath = "/opt/hopper/bin/Hopper";
            const launcherStatus = await host.launcherStatus(launcherPath);
            if (launcherStatus !== "ready")
                return {
                    status: "failed",
                    reason: launcherStatus === "missing" ? "launcher_missing" : launcherStatus,
                };
            return { status: "installed", launcherPath };
        })();
    }
    catch (cause) {
        result = {
            status: "failed",
            reason: isAbortCause(cause) ? "cancelled" : "download",
        };
    }
    if (temporary === undefined)
        return result;
    try {
        await host.cleanup(temporary);
        return result;
    }
    catch (cause) {
        return {
            ...result,
            cleanupFailure: {
                path: temporary,
                reason: cause instanceof Error ? cause.message : String(cause),
            },
        };
    }
};
/** Canonical launcher path for a legacy user-local Linux Hopper installation. */
export const linuxHopperLauncherPath = (home) => join(home, ".local/share/rea/hopper/bin/Hopper");
/** REA's managed Linux install path, preferred when no explicit launcher is set. */
export const REA_MANAGED_LINUX_HOPPER_LAUNCHER = "/opt/hopper/bin/Hopper";
/** Other system-wide Hopper paths used by package installations. */
export const systemLinuxHopperLauncherCandidates = [
    "/opt/hopper-v4/bin/hopper",
    "/usr/bin/hopper",
];
/** Probe REA-managed and user-local installs before arbitrary system builds. */
export const linuxHopperLauncherCandidates = (home) => [
    REA_MANAGED_LINUX_HOPPER_LAUNCHER,
    linuxHopperLauncherPath(home),
    ...systemLinuxHopperLauncherCandidates,
];
/** Compose package-manager and linker checks from the selected caller environment. */
export const systemLinuxHopperInstallHost = (environment) => ({
    distribution: readLinuxDistribution,
    download: downloadHopperPackage,
    createTemporaryDirectory: () => mkdtemp(join(tmpdir(), "rea-hopper-")),
    writeArchive: (path, bytes) => writeFile(path, bytes, { mode: 0o600 }),
    installPackage: (family, archive) => installSystemPackage(family, archive, environment),
    async launcherStatus(path) {
        try {
            await access(path);
            const linked = await execFileOutput("ldd", [path], { env: environment });
            if (!linuxSharedLibrariesAvailable(`${linked.stdout}\n${linked.stderr}`))
                return "runtime_dependencies";
            return (await linuxHopperBinarySupported(path))
                ? "ready"
                : "unsupported_hopper_build";
        }
        catch (cause) {
            // best-effort cleanup: optional launcher probing; unreadable means missing.
            void cause;
            return "missing";
        }
    },
    cleanup: (path) => rm(path, { recursive: true, force: true }),
});
/** Match the Linux Hopper build validated by the packaged demo-dialog adapter. */
export const linuxHopperBinarySupported = async (path) => {
    try {
        const hash = createHash("sha256");
        for await (const chunk of createReadStream(path))
            hash.update(chunk);
        return linuxHopperLauncherDigestSupported(hash.digest("hex"));
    }
    catch (cause) {
        // best-effort cleanup: optional build probing; unreadable means unsupported.
        void cause;
        return false;
    }
};
/** Match a launcher extracted from one of the pinned official Linux packages. */
export const linuxHopperLauncherDigestSupported = (digest) => SUPPORTED_HOPPER_SHA256.has(digest);
/** Interpret ldd output conservatively so a present but broken launcher is unhealthy. */
export const linuxSharedLibrariesAvailable = (output) => !/(?:=>\s+not found|error while loading shared libraries)/iu.test(output);
const installSystemPackage = async (family, archive, environment) => {
    for (const command of linuxPackageManagerCommands(family, archive, process.getuid?.() === 0)) {
        const output = await execFileBoundedOutput(command.executable, command.args, {
            env: environment,
            limit: PACKAGE_MANAGER_OUTPUT_BYTES,
        });
        if (output.exitCode !== 0) {
            return {
                status: "failed",
                failure: {
                    command: formatCommandForDisplay(command.executable, command.args),
                    exitCode: output.exitCode,
                    // The streams stay separate; their original interleaved order
                    // is not recoverable after capture.
                    stdout: output.stdout,
                    stderr: output.stderr,
                    outputTruncated: output.outputTruncated,
                },
            };
        }
    }
    return { status: "installed" };
};
/** Preserve argument boundaries in a command shown to the user. */
export const formatCommandForDisplay = (executable, args) => [executable, ...args]
    .map((part) => /^[A-Za-z0-9_./:@%+=,-]+$/u.test(part) ? part : JSON.stringify(part))
    .join(" ");
/** Select the native package manager and authorization boundary without shell evaluation. */
export const linuxPackageManagerCommands = (family, archive, isRoot) => {
    const runtimeDependencies = family === "deb"
        ? ["xvfb", "xauth", "python3", "libx11-6", "libxtst6"]
        : family === "rpm"
            ? [
                "xorg-x11-server-Xvfb",
                "xorg-x11-xauth",
                "python3",
                "libX11",
                "libXtst",
            ]
            : ["xorg-server-xvfb", "xorg-xauth", "python", "libx11", "libxtst"];
    const commands = family === "deb"
        ? [["apt-get", "install", "-y", archive, ...runtimeDependencies]]
        : family === "rpm"
            ? [["dnf", "install", "-y", archive, ...runtimeDependencies]]
            : [
                ["pacman", "-S", "--needed", "--noconfirm", ...runtimeDependencies],
                ["pacman", "-U", "--noconfirm", archive],
            ];
    return commands.map((command) => {
        const executable = isRoot ? command[0] : "pkexec";
        if (executable === undefined)
            throw new Error("package command is empty");
        return { executable, args: isRoot ? command.slice(1) : command };
    });
};
const packageIntegrityMatches = (bytes, release) => bytes.byteLength === Number(release.file_length) &&
    bytes.byteLength <= HOPPER_DOWNLOAD_BYTES &&
    createHash("sha1").update(bytes).digest("hex") === release.file_hash;
const packageFamilyFor = (id, idLike) => {
    const identities = new Set([
        id,
        ...(idLike?.toLowerCase().split(/\s+/u) ?? []),
    ]);
    if (identities.has("ubuntu") || identities.has("debian"))
        return "deb";
    if (identities.has("fedora") || identities.has("rhel"))
        return "rpm";
    if (identities.has("arch"))
        return "arch";
    return undefined;
};
const versionAtLeast = (version, minimum) => version !== undefined &&
    Number.parseInt(version.split(".")[0] ?? "0", 10) >= minimum;
const isAbortCause = (cause) => cause instanceof Error && cause.name === "AbortError";
