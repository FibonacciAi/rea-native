import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { access, mkdir, mkdtemp, readdir, rename, rm, writeFile, } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";
import { homeDirectoryFromEnvironment } from "../config/homeDirectory.js";
import { HOPPER_PUBLISHER } from "../domain/hopperPublisher.js";
import { macDeveloperIdRequirement } from "../process/MacCodeSignature.js";
import { macHopperUserApplicationPath } from "./MacHopperPaths.js";
import { downloadHopperPackage, HOPPER_DOWNLOAD_BYTES, } from "./HopperDownload.js";
const execFileAsync = promisify(execFile);
const RELEASES_URL = "https://www.hopperapp.com/include/files-api.php?request=releases&public=true";
const DOWNLOAD_PREFIX = "https://www.hopperapp.com:443/downloader/public/";
const HOPPER_PUBLISHER_REQUIREMENT = macDeveloperIdRequirement(HOPPER_PUBLISHER.bundleIdentifier, HOPPER_PUBLISHER.teamIdentifier);
/** Stable network and command effects disclosed before macOS Hopper setup. */
export const macHopperInstallDisclosure = {
    networkOrigins: [RELEASES_URL, DOWNLOAD_PREFIX],
    commands: [
        "hdiutil attach -readonly -nobrowse -mountpoint <private-mount> <verified-hopper.dmg>",
        "codesign --verify --deep --strict <mounted-hopper.app>",
        `codesign --verify --strict '-R${HOPPER_PUBLISHER_REQUIREMENT}' <mounted-hopper.app>`,
        "ditto <mounted-hopper.app> <user-Applications-stage>",
        "open <installed-hopper.app>",
    ],
};
/** Download, verify, and install Hopper into the current user's Applications directory. */
export const installMacHopper = async (options = {}, host = systemMacHopperInstallHost(homeDirectoryFromEnvironment(process.env, process.platform), process.env)) => {
    let temporary;
    let mounted = false;
    let result;
    try {
        result = await (async () => {
            const metadata = await host.download(RELEASES_URL);
            if (!metadata.ok)
                return { status: "failed", reason: "release_metadata" };
            const parsed = releasesSchema.safeParse(parseJson(metadata.bytes));
            if (!parsed.success)
                return { status: "failed", reason: "release_metadata" };
            const release = parsed.data["OS X"];
            if (!release.filename.startsWith(DOWNLOAD_PREFIX))
                return { status: "failed", reason: "release_metadata" };
            const archive = await host.download(release.filename);
            if (!archive.ok)
                return { status: "failed", reason: "download" };
            if (!integrityMatches(archive.bytes, release))
                return { status: "failed", reason: "integrity" };
            const destination = host.destination();
            const destinationExists = await host.destinationExists(destination);
            if (destinationExists && options.replaceExisting !== true)
                return { status: "failed", reason: "destination_exists" };
            temporary = await host.createTemporaryDirectory();
            const packagePath = join(temporary, "hopper.dmg");
            const mountPath = join(temporary, "mounted");
            await host.createMountDirectory(mountPath);
            await host.writePackage(packagePath, archive.bytes);
            if (!(await host.mount(packagePath, mountPath)))
                return { status: "failed", reason: "mount" };
            mounted = true;
            const source = await host.appBundle(mountPath);
            if (source === undefined)
                return { status: "failed", reason: "bundle" };
            const verification = await host.validBundle(source);
            if (verification === "invalid_signature")
                return { status: "failed", reason: "bundle" };
            if (verification === "unverified_publisher")
                return { status: "failed", reason: "publisher_verification_failed" };
            const stage = `${destination}.rea-stage`;
            if (!(await host.installBundle(source, destination, stage, destinationExists)))
                return { status: "failed", reason: "copy" };
            const launcherPath = join(destination, "Contents/MacOS/hopper");
            if (!(await host.launcherReady(launcherPath)))
                return { status: "failed", reason: "launcher_missing" };
            await host.openApplication(destination);
            return { status: "installed", launcherPath };
        })();
    }
    catch (cause) {
        // Install-stage failures share the download reason; the stage is cleaned below.
        void cause;
        result = { status: "failed", reason: "download" };
    }
    let cleanupFailure;
    if (temporary !== undefined) {
        const temporaryPath = temporary;
        const mountPath = join(temporary, "mounted");
        const cleanup = async () => {
            if (mounted) {
                await host.unmount(mountPath);
                mounted = false;
            }
            await host.cleanup(temporaryPath);
        };
        try {
            await cleanup();
        }
        catch (cause) {
            cleanupFailure = `Hopper DMG cleanup failed: ${failureMessage(cause)}`;
            host.retainCleanup?.(cleanup);
        }
    }
    return cleanupFailure === undefined ? result : { ...result, cleanupFailure };
};
/** Compose installer paths and subprocesses from one selected caller context. */
export const systemMacHopperInstallHost = (homeDirectory, environment) => {
    const pendingCleanup = new Set();
    return {
        download: downloadHopperPackage,
        createTemporaryDirectory: () => mkdtemp(join(tmpdir(), "rea-hopper-mac-")),
        createMountDirectory: (path) => mkdir(path),
        writePackage: (path, bytes) => writeFile(path, bytes, { mode: 0o600 }),
        async mount(packagePath, mountPath) {
            return commandSucceeds("hdiutil", [
                "attach",
                "-readonly",
                "-nobrowse",
                "-mountpoint",
                mountPath,
                packagePath,
            ], environment);
        },
        async unmount(mountPath) {
            if (!(await commandSucceeds("hdiutil", ["detach", mountPath, "-force"], environment)))
                throw new Error(`hdiutil detach failed for ${JSON.stringify(mountPath)}`);
        },
        async appBundle(mountPath) {
            const entries = await readdir(mountPath, { withFileTypes: true });
            const app = entries.find((entry) => entry.isDirectory() && /^Hopper.*\.app$/iu.test(entry.name));
            return app === undefined ? undefined : join(mountPath, app.name);
        },
        async validBundle(appPath) {
            if (!(await commandSucceeds("codesign", ["--verify", "--deep", "--strict", appPath], environment)))
                return "invalid_signature";
            if (!(await commandSucceeds("codesign", [
                "--verify",
                "--strict",
                `-R${HOPPER_PUBLISHER_REQUIREMENT}`,
                appPath,
            ], environment)))
                return "unverified_publisher";
            return "verified";
        },
        async destinationExists(path) {
            try {
                await access(path);
                return true;
            }
            catch (cause) {
                // best-effort cleanup: optional existence probing; absence means missing.
                void cause;
                return false;
            }
        },
        async installBundle(source, destination, stage, replaceExisting) {
            const previous = `${stage}-previous`;
            try {
                await mkdir(join(homeDirectory, "Applications"), { recursive: true });
                await rm(stage, { recursive: true, force: true });
                await rm(previous, { recursive: true, force: true });
                await execFileAsync("ditto", [source, stage], { env: environment });
                await access(join(stage, "Contents/MacOS/hopper"));
                if (replaceExisting)
                    await rename(destination, previous);
                await rename(stage, destination);
                if (replaceExisting)
                    await rm(previous, { recursive: true, force: true });
                return true;
            }
            catch (cause) {
                // Install failure rolls back below; the false return reports it.
                void cause;
                await rm(stage, { recursive: true, force: true });
                if (replaceExisting) {
                    try {
                        await rename(previous, destination);
                    }
                    catch (rollbackCause) {
                        // The original destination was not moved, or rollback is impossible.
                        void rollbackCause;
                    }
                }
                return false;
            }
        },
        async launcherReady(path) {
            try {
                await access(path);
                return true;
            }
            catch (cause) {
                // best-effort cleanup: optional launcher probing; absence means not ready.
                void cause;
                return false;
            }
        },
        async openApplication(path) {
            await execFileAsync("open", [path], { env: environment });
        },
        cleanup: (path) => rm(path, { recursive: true, force: true }),
        retainCleanup: (cleanup) => pendingCleanup.add(cleanup),
        async close() {
            let failure;
            for (const cleanup of pendingCleanup) {
                try {
                    await cleanup();
                    pendingCleanup.delete(cleanup);
                }
                catch (cause) {
                    failure ??= `Hopper DMG cleanup remains incomplete: ${failureMessage(cause)}`;
                }
            }
            return failure;
        },
        destination: () => macHopperUserApplicationPath(homeDirectory),
    };
};
const parseJson = (bytes) => JSON.parse(new TextDecoder().decode(bytes));
const integrityMatches = (bytes, release) => bytes.byteLength === Number(release.file_length) &&
    bytes.byteLength <= HOPPER_DOWNLOAD_BYTES &&
    createHash("sha1").update(bytes).digest("hex") === release.file_hash;
const commandSucceeds = async (command, args, environment) => {
    try {
        await execFileAsync(command, args, { env: environment });
        return true;
    }
    catch (cause) {
        // best-effort cleanup: optional command probing; failure means unavailable.
        void cause;
        return false;
    }
};
const failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
const releaseSchema = z.object({
    filename: z.string().url(),
    file_length: z.string().regex(/^\d+$/u),
    file_hash: z.string().regex(/^[a-f0-9]{40}$/u),
});
const releasesSchema = z.object({ "OS X": releaseSchema });
