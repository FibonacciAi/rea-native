import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { execFileOutput, init_ExecFileOutput } from "./ExecFileOutput-BEQs-lDD.js";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createReadStream, readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";

//#region dist/process/ExecFileBoundedOutput.js
var execFileBoundedOutput, retainedOutput;
function init_ExecFileBoundedOutput() {
	return (init_ExecFileBoundedOutput = __esmMin((() => {
		execFileBoundedOutput = (executable, args, options) => new Promise((resolve) => {
			const child = spawn(executable, [...args], {
				env: options.env,
				stdio: [
					"ignore",
					"pipe",
					"pipe"
				]
			});
			const headLimit = Math.ceil(options.limit / 2);
			const tailLimit = options.limit - headLimit;
			const stdout = {
				head: Buffer.alloc(0),
				tail: Buffer.alloc(0),
				total: 0
			};
			const stderr = {
				head: Buffer.alloc(0),
				tail: Buffer.alloc(0),
				total: 0
			};
			let outputTruncated = false;
			const capture = (stream) => (chunk) => {
				stream.total += chunk.length;
				const headCount = Math.min(chunk.length, Math.max(0, headLimit - stream.head.length));
				if (headCount > 0) stream.head = Buffer.concat([stream.head, chunk.subarray(0, headCount)]);
				const rest = chunk.subarray(headCount);
				if (rest.length > 0 && tailLimit > 0) stream.tail = Buffer.concat([stream.tail, rest]).subarray(-tailLimit);
				if (stream.total > options.limit) outputTruncated = true;
			};
			child.stdout.on("data", capture(stdout));
			child.stderr.on("data", capture(stderr));
			let spawnError;
			child.on("error", (error) => {
				spawnError = error;
			});
			child.on("close", (code, signal) => {
				resolve({
					exitCode: spawnError?.code ?? code ?? signal,
					stdout: retainedOutput(stdout, options.limit),
					stderr: retainedOutput(stderr, options.limit),
					outputTruncated
				});
			});
		});
		retainedOutput = (stream, limit) => stream.total > limit ? `${stream.head.toString("utf8")} … [output omitted] … ${stream.tail.toString("utf8")}` : Buffer.concat([stream.head, stream.tail]).toString("utf8");
	})))();
}

//#endregion
//#region dist/application/HopperDownload.js
var HOPPER_DOWNLOAD_BYTES, downloadHopperPackage;
function init_HopperDownload() {
	return (init_HopperDownload = __esmMin((() => {
		HOPPER_DOWNLOAD_BYTES = 1e8;
		downloadHopperPackage = async (url, options = {}) => {
			const deadline = AbortSignal.timeout(12e4);
			const response = await fetch(url, {
				headers: {
					accept: "application/json",
					"user-agent": "rea-installer"
				},
				signal: options.signal === undefined ? deadline : AbortSignal.any([options.signal, deadline])
			});
			const refused = {
				ok: false,
				bytes: new Uint8Array()
			};
			if (!response.ok || Number(response.headers.get("content-length")) > 1e8) {
				await response.body?.cancel();
				return refused;
			}
			if (response.body === null) return {
				ok: true,
				bytes: new Uint8Array()
			};
			const reader = response.body.getReader();
			const chunks = [];
			let bytes = 0;
			try {
				while (true) {
					const chunk = await reader.read();
					if (chunk.done) return {
						ok: true,
						bytes: Buffer.concat(chunks, bytes)
					};
					if (chunk.value.byteLength > 1e8 - bytes) {
						await reader.cancel();
						return refused;
					}
					chunks.push(chunk.value);
					bytes += chunk.value.byteLength;
				}
			} finally {
				reader.releaseLock();
			}
		};
	})))();
}

//#endregion
//#region dist/application/LinuxHopper.js
var PACKAGE_MANAGER_OUTPUT_BYTES, DOWNLOAD_PREFIX, SUPPORTED_HOPPER_SHA256, SUPPORTED_RELEASES, linuxHopperInstallDisclosure, supportsReaHost, LinuxHopperTemporaryCleanupOwner, parseLinuxDistribution, readLinuxDistribution, installLinuxHopper, linuxHopperLauncherPath, REA_MANAGED_LINUX_HOPPER_LAUNCHER, systemLinuxHopperLauncherCandidates, linuxHopperLauncherCandidates, systemLinuxHopperInstallHost, linuxHopperBinarySupported, linuxHopperLauncherDigestSupported, linuxSharedLibrariesAvailable, installSystemPackage, formatCommandForDisplay, linuxPackageManagerCommands, packageIntegrityMatches, packageFamilyFor, versionAtLeast, isAbortCause;
function init_LinuxHopper() {
	return (init_LinuxHopper = __esmMin((() => {
		init_ExecFileBoundedOutput();
		init_ExecFileOutput();
		init_HopperDownload();
		PACKAGE_MANAGER_OUTPUT_BYTES = 64 * 1024;
		DOWNLOAD_PREFIX = "https://www.hopperapp.com:443/downloader/public/";
		SUPPORTED_HOPPER_SHA256 = new Set(["0294ced141cc373468ee22d8343e7dac41980cb05a937994ca81c9f09afe7ded", "1339f9e58377442b0c6fcb0dfc3cec20d593cc557408521fad9a00dbc6b8da13"]);
		SUPPORTED_RELEASES = {
			deb: {
				filename: `${DOWNLOAD_PREFIX}Hopper-6.4.2-Linux-demo.deb`,
				file_length: "35755772",
				file_hash: "e4f79dff602648a8ff4a88b773875b6bfac0dc65"
			},
			rpm: {
				filename: `${DOWNLOAD_PREFIX}Hopper-6.4.2-Linux-demo.rpm`,
				file_length: "32264475",
				file_hash: "b9a65f2f583a386d440d4401d9140aef3bf305de"
			},
			arch: {
				filename: `${DOWNLOAD_PREFIX}Hopper-6.4.2-Linux-demo.pkg.tar.xz`,
				file_length: "29405968",
				file_hash: "92d780b61cab38eda95dc4112dee4fbeb0920f46"
			}
		};
		linuxHopperInstallDisclosure = (family, isRoot) => {
			const release = SUPPORTED_RELEASES[family];
			return {
				downloadUrl: release.filename,
				expectedBytes: Number(release.file_length),
				expectedSha1: release.file_hash,
				commands: linuxPackageManagerCommands(family, `<verified-hopper.${family}>`, isRoot).map(({ executable, args }) => formatCommandForDisplay(executable, args))
			};
		};
		supportsReaHost = (distribution) => distribution?.packageFamily !== undefined;
		LinuxHopperTemporaryCleanupOwner = class {
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
					} catch (cause) {
						const reason = cause instanceof Error ? cause.message : String(cause);
						failures.push(`Linux Hopper temporary cleanup failed for ${path}: ${reason}`);
					}
				}
				return failures.length === 0 ? undefined : failures.join("; ");
			}
		};
		parseLinuxDistribution = (text) => {
			const fields = new Map();
			for (const line of text.split("\n")) {
				const match = /^([A-Z_]+)=(.*)$/u.exec(line.trim());
				if (match === null) continue;
				const key = match[1];
				const encoded = match[2];
				if (key === undefined || encoded === undefined) continue;
				const quote = encoded[0];
				const quoted = (quote === "'" || quote === "\"") && encoded.endsWith(quote);
				const value = !quoted ? encoded : quote === "'" ? encoded.slice(1, -1) : encoded.slice(1, -1).replace(/\\(["\\$`])/gu, "$1");
				fields.set(key, value);
			}
			const id = (fields.get("ID") ?? "unknown").toLowerCase();
			const versionId = fields.get("VERSION_ID");
			const packageFamily = packageFamilyFor(id, fields.get("ID_LIKE"));
			const hopperSetupSupported = packageFamily !== undefined && (id === "arch" || id === "cachyos" || id === "omarchy" && packageFamily === "arch" || id === "ubuntu" && versionAtLeast(versionId, 24) || id === "fedora" && versionAtLeast(versionId, 41) || id === "nobara" && versionAtLeast(versionId, 44));
			const identity = {
				id,
				...versionId === undefined ? {} : { versionId }
			};
			return hopperSetupSupported ? {
				...identity,
				packageFamily,
				hopperSetupSupported: true
			} : {
				...identity,
				packageFamily,
				hopperSetupSupported: false
			};
		};
		readLinuxDistribution = async () => {
			try {
				return parseLinuxDistribution(await readFile("/etc/os-release", "utf8"));
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		installLinuxHopper = async (host = systemLinuxHopperInstallHost(process.env), options = {}) => {
			if (options.signal?.aborted === true) return {
				status: "failed",
				reason: "cancelled"
			};
			const distribution = await host.distribution();
			if (distribution?.hopperSetupSupported !== true) return {
				status: "failed",
				reason: "unsupported_host"
			};
			let temporary;
			let result;
			try {
				result = await (async () => {
					const release = (options.releases ?? SUPPORTED_RELEASES)[distribution.packageFamily];
					const archiveDownload = await host.download(release.filename, options);
					if (!archiveDownload.ok) return {
						status: "failed",
						reason: "download"
					};
					if (!packageIntegrityMatches(archiveDownload.bytes, release)) return {
						status: "failed",
						reason: "integrity"
					};
					temporary = await host.createTemporaryDirectory();
					const archive = join(temporary, `hopper.${distribution.packageFamily}`);
					await host.writeArchive(archive, archiveDownload.bytes);
					const install = await host.installPackage(distribution.packageFamily, archive);
					if (install.status === "failed") return {
						status: "failed",
						reason: "authorization_or_package_manager",
						packageFailure: install.failure
					};
					const launcherPath = "/opt/hopper/bin/Hopper";
					const launcherStatus = await host.launcherStatus(launcherPath);
					if (launcherStatus !== "ready") return {
						status: "failed",
						reason: launcherStatus === "missing" ? "launcher_missing" : launcherStatus
					};
					return {
						status: "installed",
						launcherPath
					};
				})();
			} catch (cause) {
				result = {
					status: "failed",
					reason: isAbortCause(cause) ? "cancelled" : "download"
				};
			}
			if (temporary === undefined) return result;
			try {
				await host.cleanup(temporary);
				return result;
			} catch (cause) {
				return {
					...result,
					cleanupFailure: {
						path: temporary,
						reason: cause instanceof Error ? cause.message : String(cause)
					}
				};
			}
		};
		linuxHopperLauncherPath = (home) => join(home, ".local/share/rea/hopper/bin/Hopper");
		REA_MANAGED_LINUX_HOPPER_LAUNCHER = "/opt/hopper/bin/Hopper";
		systemLinuxHopperLauncherCandidates = ["/opt/hopper-v4/bin/hopper", "/usr/bin/hopper"];
		linuxHopperLauncherCandidates = (home) => [
			REA_MANAGED_LINUX_HOPPER_LAUNCHER,
			linuxHopperLauncherPath(home),
			...systemLinuxHopperLauncherCandidates
		];
		systemLinuxHopperInstallHost = (environment) => ({
			distribution: readLinuxDistribution,
			download: downloadHopperPackage,
			createTemporaryDirectory: () => mkdtemp(join(tmpdir(), "rea-hopper-")),
			writeArchive: (path, bytes) => writeFile(path, bytes, { mode: 384 }),
			installPackage: (family, archive) => installSystemPackage(family, archive, environment),
			async launcherStatus(path) {
				try {
					await access(path);
					const linked = await execFileOutput("ldd", [path], { env: environment });
					if (!linuxSharedLibrariesAvailable(`${linked.stdout}\n${linked.stderr}`)) return "runtime_dependencies";
					return await linuxHopperBinarySupported(path) ? "ready" : "unsupported_hopper_build";
				} catch (cause) {
					void cause;
					return "missing";
				}
			},
			cleanup: (path) => rm(path, {
				recursive: true,
				force: true
			})
		});
		linuxHopperBinarySupported = async (path) => {
			try {
				const hash = createHash("sha256");
				for await (const chunk of createReadStream(path)) hash.update(chunk);
				return linuxHopperLauncherDigestSupported(hash.digest("hex"));
			} catch (cause) {
				void cause;
				return false;
			}
		};
		linuxHopperLauncherDigestSupported = (digest) => SUPPORTED_HOPPER_SHA256.has(digest);
		linuxSharedLibrariesAvailable = (output) => !/(?:=>\s+not found|error while loading shared libraries)/iu.test(output);
		installSystemPackage = async (family, archive, environment) => {
			for (const command of linuxPackageManagerCommands(family, archive, process.getuid?.() === 0)) {
				const output = await execFileBoundedOutput(command.executable, command.args, {
					env: environment,
					limit: PACKAGE_MANAGER_OUTPUT_BYTES
				});
				if (output.exitCode !== 0) {
					return {
						status: "failed",
						failure: {
							command: formatCommandForDisplay(command.executable, command.args),
							exitCode: output.exitCode,
							stdout: output.stdout,
							stderr: output.stderr,
							outputTruncated: output.outputTruncated
						}
					};
				}
			}
			return { status: "installed" };
		};
		formatCommandForDisplay = (executable, args) => [executable, ...args].map((part) => /^[A-Za-z0-9_./:@%+=,-]+$/u.test(part) ? part : JSON.stringify(part)).join(" ");
		linuxPackageManagerCommands = (family, archive, isRoot) => {
			const runtimeDependencies = family === "deb" ? [
				"xvfb",
				"xauth",
				"python3",
				"libx11-6",
				"libxtst6"
			] : family === "rpm" ? [
				"xorg-x11-server-Xvfb",
				"xorg-x11-xauth",
				"python3",
				"libX11",
				"libXtst"
			] : [
				"xorg-server-xvfb",
				"xorg-xauth",
				"python",
				"libx11",
				"libxtst"
			];
			const commands = family === "deb" ? [[
				"apt-get",
				"install",
				"-y",
				archive,
				...runtimeDependencies
			]] : family === "rpm" ? [[
				"dnf",
				"install",
				"-y",
				archive,
				...runtimeDependencies
			]] : [[
				"pacman",
				"-S",
				"--needed",
				"--noconfirm",
				...runtimeDependencies
			], [
				"pacman",
				"-U",
				"--noconfirm",
				archive
			]];
			return commands.map((command) => {
				const executable = isRoot ? command[0] : "pkexec";
				if (executable === undefined) throw new Error("package command is empty");
				return {
					executable,
					args: isRoot ? command.slice(1) : command
				};
			});
		};
		packageIntegrityMatches = (bytes, release) => bytes.byteLength === Number(release.file_length) && bytes.byteLength <= 1e8 && createHash("sha1").update(bytes).digest("hex") === release.file_hash;
		packageFamilyFor = (id, idLike) => {
			const identities = new Set([id, ...idLike?.toLowerCase().split(/\s+/u) ?? []]);
			if (identities.has("ubuntu") || identities.has("debian")) return "deb";
			if (identities.has("fedora") || identities.has("rhel")) return "rpm";
			if (identities.has("arch")) return "arch";
			return undefined;
		};
		versionAtLeast = (version, minimum) => version !== undefined && Number.parseInt(version.split(".")[0] ?? "0", 10) >= minimum;
		isAbortCause = (cause) => cause instanceof Error && cause.name === "AbortError";
	})))();
}

//#endregion
//#region dist/application/MacHopperPaths.js
/** Yield canonical paths first; enumerate renamed bundles only if needed. */
function* macHopperLauncherCandidates(homeDirectory) {
	yield* macHopperCanonicalLauncherCandidates(homeDirectory);
	for (const root of macHopperApplicationRoots(homeDirectory)) yield* macHopperRenamedLauncherCandidates(homeDirectory, new Map([[root, localBundleNames(root)]]));
}
var MAC_HOPPER_APPLICATION_DIRECTORY, MAC_HOPPER_APPLICATION_NAME, MAC_HOPPER_USER_APPLICATIONS_DIRECTORY, MAC_HOPPER_SYSTEM_LAUNCHER, macHopperUserApplicationPath, macHopperApplicationRoots, macHopperCanonicalLauncherCandidates, macHopperRenamedLauncherCandidates, localBundleNames;
function init_MacHopperPaths() {
	return (init_MacHopperPaths = __esmMin((() => {
		MAC_HOPPER_APPLICATION_DIRECTORY = "/Applications";
		MAC_HOPPER_APPLICATION_NAME = "Hopper Disassembler.app";
		MAC_HOPPER_USER_APPLICATIONS_DIRECTORY = "Applications";
		MAC_HOPPER_SYSTEM_LAUNCHER = join(MAC_HOPPER_APPLICATION_DIRECTORY, MAC_HOPPER_APPLICATION_NAME, "Contents/MacOS/hopper");
		macHopperUserApplicationPath = (homeDirectory) => join(homeDirectory, MAC_HOPPER_USER_APPLICATIONS_DIRECTORY, MAC_HOPPER_APPLICATION_NAME);
		macHopperApplicationRoots = (homeDirectory) => [MAC_HOPPER_APPLICATION_DIRECTORY, join(homeDirectory, MAC_HOPPER_USER_APPLICATIONS_DIRECTORY)];
		macHopperCanonicalLauncherCandidates = (homeDirectory) => [MAC_HOPPER_SYSTEM_LAUNCHER, join(macHopperUserApplicationPath(homeDirectory), "Contents/MacOS/hopper")];
		macHopperRenamedLauncherCandidates = (homeDirectory, bundleNamesByRoot) => macHopperApplicationRoots(homeDirectory).flatMap((root) => [...new Set(bundleNamesByRoot.get(root) ?? [])].filter((name) => /^Hopper.*\.app$/iu.test(name) && name.toLocaleLowerCase("en-US") !== "Hopper Disassembler.app".toLocaleLowerCase("en-US")).sort().map((name) => join(root, name, "Contents/MacOS/hopper")));
		localBundleNames = (root) => {
			try {
				return readdirSync(root, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^Hopper.*\.app$/iu.test(entry.name)).map(({ name }) => name);
			} catch (cause) {
				void cause;
				return [];
			}
		};
	})))();
}

//#endregion
export { HOPPER_DOWNLOAD_BYTES, LinuxHopperTemporaryCleanupOwner, MAC_HOPPER_SYSTEM_LAUNCHER, REA_MANAGED_LINUX_HOPPER_LAUNCHER, downloadHopperPackage, init_HopperDownload, init_LinuxHopper, init_MacHopperPaths, installLinuxHopper, linuxHopperBinarySupported, linuxHopperInstallDisclosure, linuxHopperLauncherCandidates, linuxSharedLibrariesAvailable, macHopperApplicationRoots, macHopperCanonicalLauncherCandidates, macHopperLauncherCandidates, macHopperRenamedLauncherCandidates, macHopperUserApplicationPath, readLinuxDistribution, supportsReaHost, systemLinuxHopperInstallHost, systemLinuxHopperLauncherCandidates };