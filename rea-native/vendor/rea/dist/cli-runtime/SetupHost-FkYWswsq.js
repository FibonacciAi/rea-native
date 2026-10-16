import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { PRODUCT_IDENTITY, compareUnicodeCodePoints, err, init_identity, init_result, init_unicodeCodePointOrder, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ConfigurationError, init_configurationErrors } from "./errorSchemas-CTRmvMl3.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-BXkffc1D.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-DQWTcUwE.js";
import { RegularFileCleanupFailure, init_RegularFileRead, readRegularFileText, retryRegularFileCleanup } from "./RegularFileRead-DVlC5faM.js";
import { clientEvidencePaths, homeDirectoryFromEnvironment, init_ClientRegistrationIdentity, init_MsixPackageStorage, init_SupportedClients, init_homeDirectory, invokingPackageRunner, msixPackagesDirectory, npxRegistrationCommand, packagePrivateLauncherBlocker, packageReadTargetChanged, packageRunnerRegistrationCommand, registrationWriteBlocker, supportedClients } from "./SupportedClients-DaX6Lt2d.js";
import { HOPPER_DOWNLOAD_BYTES, LinuxHopperTemporaryCleanupOwner, downloadHopperPackage, init_HopperDownload, init_LinuxHopper, init_MacHopperPaths, installLinuxHopper, macHopperUserApplicationPath, readLinuxDistribution, systemLinuxHopperInstallHost } from "./MacHopperPaths-CwL5lYPX.js";
import { SUPPORTED_NODE_VERSION_PROSE, init_runtimeVersion, supportsNodeVersion } from "./runtimeVersion-CMGd0bDu.js";
import { MCP_STARTUP_POLICY, init_mcpStartupPolicy } from "./mcpStartupPolicy-CVVSOmRc.js";
import { CURRENT_ENTRYPOINT_PATH, init_CurrentEntrypointPath } from "./CurrentEntrypointPath-D5FRNdkq.js";
import { init_Doctor, runDoctor, systemDoctorHost } from "./Doctor-DIpf_I7N.js";
import { DshCordisDocument, OMP_DISABLED_SERVERS_KEY, canonicalSkillNeedsInstall, clientConfigurationValuesEqual, clientRegistrationEntry, clientServerListedDisabled, clientServerPath, dshDocument, init_ClientConfigurationDocument, init_DshCordisPatch, init_SetupRecoveryBackup, init_SetupSkill, installCanonicalSkill, legacyClientServerPath, parseClientConfiguration, parseZcodeFallbackConfiguration, preserveRecoveryBackup, selectCurrentRecoveryBackup, serializeClientConfiguration, skillDestinations, validateCanonicalSkillDirectories, withClientServers } from "./ClientConfigurationDocument-ffQ9X0Se.js";
import { clientRegistrationEnvironment, effectiveClientConfiguration, init_ClientConfigurationFiles, init_ClientRegistrationEnvironment, init_GeminiClientSettings, readClientConfigurationFiles, readClientPolicyBlock, readConfigurationText } from "./ClientRegistrationStatus-DszCyPEU.js";
import { HOPPER_PUBLISHER, init_MacCodeSignature, init_hopperPublisher, macDeveloperIdRequirement } from "./MacCodeSignature-MgYbRK_H.js";
import { init_ClientConfigPath, resolveClientConfigTransactionPath } from "./ClientConfigPath-c6jr6INc.js";
import { z } from "zod";
import { dirname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { promisify } from "node:util";
import { access, mkdir, mkdtemp, readdir, rename, rm, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { tmpdir } from "node:os";
import writeFileAtomic from "write-file-atomic";

//#region dist/application/SetupClients.js
var failedConfigurationMessage, configureDetectedClients;
function init_SetupClients() {
	return (init_SetupClients = __esmMin((() => {
		failedConfigurationMessage = (result) => {
			if (result.reason === "target_changed") return "The client began reading a different configuration file after the plan was shown, so no change was made. Rerun setup to review the new target.";
			if (result.reason === "path") return "Agent configuration path could not be safely verified. Check its permissions and, if it is a symbolic link, verify that the link resolves to a regular file owned by the current user, then rerun setup.";
			if (result.reason === "backup") return "Agent configuration could not be backed up, so no change was made. Check file permissions, then rerun setup.";
			if (result.reason === "write") return "Agent configuration could not be updated. Check file permissions, then rerun setup.";
			if (result.reason === "rollback") return result.backupPath === undefined ? `Agent configuration rollback failed at ${result.failure.path}: ${result.failure.detail}; the failed first-run file may remain. Remove or repair it before rerunning setup.` : `Agent configuration rollback failed at ${result.failure.path}: ${result.failure.detail}. Inspect the preserved backup at ${result.backupPath} and restore the intended configuration, then rerun setup.`;
			return "Agent configuration could not be verified after writing. Repair the configuration file or restore its `.rea.backup`, then rerun setup.";
		};
		configureDetectedClients = async (options) => {
			let failure;
			for (const client of options.detectedClients) {
				const actionId = `configure_client:${client.name}`;
				const label = client.displayName ?? client.name;
				options.onProgress?.({
					actionId,
					label,
					state: "started"
				});
				const result = await options.host.configureClient(client, options.providerEnvironment, options.command);
				options.clients[client.name] = result;
				if (result.status === "failed") {
					failure ??= failedConfigurationMessage(result);
					options.onProgress?.({
						actionId,
						label,
						state: "failed",
						detail: failedConfigurationMessage(result)
					});
				} else if (result.status === "configured") {
					options.appliedActions.push(`configured_${client.name}`);
					options.onProgress?.({
						actionId,
						label,
						state: "completed"
					});
				} else {
					options.onProgress?.({
						actionId,
						label,
						state: "warning",
						detail: result.status === "unchanged" ? "Already current" : "Manual configuration required"
					});
				}
			}
			return failure;
		};
	})))();
}

//#endregion
//#region dist/application/MacHopper.js
var execFileAsync, RELEASES_URL, DOWNLOAD_PREFIX, HOPPER_PUBLISHER_REQUIREMENT, macHopperInstallDisclosure, installMacHopper, systemMacHopperInstallHost, parseJson, integrityMatches, commandSucceeds, failureMessage, releaseSchema, releasesSchema;
function init_MacHopper() {
	return (init_MacHopper = __esmMin((() => {
		init_homeDirectory();
		init_hopperPublisher();
		init_MacCodeSignature();
		init_MacHopperPaths();
		init_HopperDownload();
		execFileAsync = promisify(execFile);
		RELEASES_URL = "https://www.hopperapp.com/include/files-api.php?request=releases&public=true";
		DOWNLOAD_PREFIX = "https://www.hopperapp.com:443/downloader/public/";
		HOPPER_PUBLISHER_REQUIREMENT = macDeveloperIdRequirement(HOPPER_PUBLISHER.bundleIdentifier, HOPPER_PUBLISHER.teamIdentifier);
		macHopperInstallDisclosure = {
			networkOrigins: [RELEASES_URL, DOWNLOAD_PREFIX],
			commands: [
				"hdiutil attach -readonly -nobrowse -mountpoint <private-mount> <verified-hopper.dmg>",
				"codesign --verify --deep --strict <mounted-hopper.app>",
				`codesign --verify --strict '-R${HOPPER_PUBLISHER_REQUIREMENT}' <mounted-hopper.app>`,
				"ditto <mounted-hopper.app> <user-Applications-stage>",
				"open <installed-hopper.app>"
			]
		};
		installMacHopper = async (options = {}, host = systemMacHopperInstallHost(homeDirectoryFromEnvironment(process.env, process.platform), process.env)) => {
			let temporary;
			let mounted = false;
			let result;
			try {
				result = await (async () => {
					const metadata = await host.download(RELEASES_URL);
					if (!metadata.ok) return {
						status: "failed",
						reason: "release_metadata"
					};
					const parsed = releasesSchema.safeParse(parseJson(metadata.bytes));
					if (!parsed.success) return {
						status: "failed",
						reason: "release_metadata"
					};
					const release = parsed.data["OS X"];
					if (!release.filename.startsWith(DOWNLOAD_PREFIX)) return {
						status: "failed",
						reason: "release_metadata"
					};
					const archive = await host.download(release.filename);
					if (!archive.ok) return {
						status: "failed",
						reason: "download"
					};
					if (!integrityMatches(archive.bytes, release)) return {
						status: "failed",
						reason: "integrity"
					};
					const destination = host.destination();
					const destinationExists = await host.destinationExists(destination);
					if (destinationExists && options.replaceExisting !== true) return {
						status: "failed",
						reason: "destination_exists"
					};
					temporary = await host.createTemporaryDirectory();
					const packagePath = join(temporary, "hopper.dmg");
					const mountPath = join(temporary, "mounted");
					await host.createMountDirectory(mountPath);
					await host.writePackage(packagePath, archive.bytes);
					if (!await host.mount(packagePath, mountPath)) return {
						status: "failed",
						reason: "mount"
					};
					mounted = true;
					const source = await host.appBundle(mountPath);
					if (source === undefined) return {
						status: "failed",
						reason: "bundle"
					};
					const verification = await host.validBundle(source);
					if (verification === "invalid_signature") return {
						status: "failed",
						reason: "bundle"
					};
					if (verification === "unverified_publisher") return {
						status: "failed",
						reason: "publisher_verification_failed"
					};
					const stage = `${destination}.rea-stage`;
					if (!await host.installBundle(source, destination, stage, destinationExists)) return {
						status: "failed",
						reason: "copy"
					};
					const launcherPath = join(destination, "Contents/MacOS/hopper");
					if (!await host.launcherReady(launcherPath)) return {
						status: "failed",
						reason: "launcher_missing"
					};
					await host.openApplication(destination);
					return {
						status: "installed",
						launcherPath
					};
				})();
			} catch (cause) {
				void cause;
				result = {
					status: "failed",
					reason: "download"
				};
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
				} catch (cause) {
					cleanupFailure = `Hopper DMG cleanup failed: ${failureMessage(cause)}`;
					host.retainCleanup?.(cleanup);
				}
			}
			return cleanupFailure === undefined ? result : {
				...result,
				cleanupFailure
			};
		};
		systemMacHopperInstallHost = (homeDirectory, environment) => {
			const pendingCleanup = new Set();
			return {
				download: downloadHopperPackage,
				createTemporaryDirectory: () => mkdtemp(join(tmpdir(), "rea-hopper-mac-")),
				createMountDirectory: (path) => mkdir(path),
				writePackage: (path, bytes) => writeFile(path, bytes, { mode: 384 }),
				async mount(packagePath, mountPath) {
					return commandSucceeds("hdiutil", [
						"attach",
						"-readonly",
						"-nobrowse",
						"-mountpoint",
						mountPath,
						packagePath
					], environment);
				},
				async unmount(mountPath) {
					if (!await commandSucceeds("hdiutil", [
						"detach",
						mountPath,
						"-force"
					], environment)) throw new Error(`hdiutil detach failed for ${JSON.stringify(mountPath)}`);
				},
				async appBundle(mountPath) {
					const entries = await readdir(mountPath, { withFileTypes: true });
					const app = entries.find((entry) => entry.isDirectory() && /^Hopper.*\.app$/iu.test(entry.name));
					return app === undefined ? undefined : join(mountPath, app.name);
				},
				async validBundle(appPath) {
					if (!await commandSucceeds("codesign", [
						"--verify",
						"--deep",
						"--strict",
						appPath
					], environment)) return "invalid_signature";
					if (!await commandSucceeds("codesign", [
						"--verify",
						"--strict",
						`-R${HOPPER_PUBLISHER_REQUIREMENT}`,
						appPath
					], environment)) return "unverified_publisher";
					return "verified";
				},
				async destinationExists(path) {
					try {
						await access(path);
						return true;
					} catch (cause) {
						void cause;
						return false;
					}
				},
				async installBundle(source, destination, stage, replaceExisting) {
					const previous = `${stage}-previous`;
					try {
						await mkdir(join(homeDirectory, "Applications"), { recursive: true });
						await rm(stage, {
							recursive: true,
							force: true
						});
						await rm(previous, {
							recursive: true,
							force: true
						});
						await execFileAsync("ditto", [source, stage], { env: environment });
						await access(join(stage, "Contents/MacOS/hopper"));
						if (replaceExisting) await rename(destination, previous);
						await rename(stage, destination);
						if (replaceExisting) await rm(previous, {
							recursive: true,
							force: true
						});
						return true;
					} catch (cause) {
						void cause;
						await rm(stage, {
							recursive: true,
							force: true
						});
						if (replaceExisting) {
							try {
								await rename(previous, destination);
							} catch (rollbackCause) {
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
					} catch (cause) {
						void cause;
						return false;
					}
				},
				async openApplication(path) {
					await execFileAsync("open", [path], { env: environment });
				},
				cleanup: (path) => rm(path, {
					recursive: true,
					force: true
				}),
				retainCleanup: (cleanup) => pendingCleanup.add(cleanup),
				async close() {
					let failure;
					for (const cleanup of pendingCleanup) {
						try {
							await cleanup();
							pendingCleanup.delete(cleanup);
						} catch (cause) {
							failure ??= `Hopper DMG cleanup remains incomplete: ${failureMessage(cause)}`;
						}
					}
					return failure;
				},
				destination: () => macHopperUserApplicationPath(homeDirectory)
			};
		};
		parseJson = (bytes) => JSON.parse(new TextDecoder().decode(bytes));
		integrityMatches = (bytes, release) => bytes.byteLength === Number(release.file_length) && bytes.byteLength <= 1e8 && createHash("sha1").update(bytes).digest("hex") === release.file_hash;
		commandSucceeds = async (command, args, environment) => {
			try {
				await execFileAsync(command, args, { env: environment });
				return true;
			} catch (cause) {
				void cause;
				return false;
			}
		};
		failureMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		releaseSchema = z.object({
			filename: z.string().url(),
			file_length: z.string().regex(/^\d+$/u),
			file_hash: z.string().regex(/^[a-f0-9]{40}$/u)
		});
		releasesSchema = z.object({ "OS X": releaseSchema });
	})))();
}

//#endregion
//#region dist/application/SetupClientConfiguration.js
var ClientConfigurationCleanupRollbackFailure, configureClientConfiguration, configureClientDocument, persistClientConfiguration, clientConfigurationAligned, inspectClientConfiguration, inspectClientDocument, isMissing, throwCleanupFailure, readZcodeFallbackServers, restoreConfig, rollbackOrReadbackFailure, errorDetail, registrationCurrent, clientConfigurationDesired;
function init_SetupClientConfiguration() {
	return (init_SetupClientConfiguration = __esmMin((() => {
		init_GeminiClientSettings();
		init_ClientConfigurationFiles();
		init_result();
		init_ClientConfigurationDocument();
		init_DshCordisPatch();
		init_ClientRegistrationEnvironment();
		init_identity();
		init_ClientRegistrationIdentity();
		init_mcpStartupPolicy();
		init_ClientConfigPath();
		init_MsixPackageStorage();
		init_RegularFileRead();
		init_SetupRecoveryBackup();
		init_SupportedClients();
		ClientConfigurationCleanupRollbackFailure = class extends RegularFileCleanupFailure {
			configurationFailure;
			constructor(failure, configurationFailure) {
				super(failure.path, failure.owner, failure.outcome, new AggregateError([failure.cleanupCause, new Error(configurationFailure.failure.detail)], `Configuration readback cleanup and rollback failed: ${configurationFailure.failure.path}`));
				this.configurationFailure = configurationFailure;
			}
		};
		configureClientConfiguration = (client, environment = {}, command = npxRegistrationCommand()) => {
			if (client.configPathError !== undefined) return Promise.resolve({
				status: "failed",
				reason: "path"
			});
			return configureClientDocument(client, environment, command);
		};
		configureClientDocument = async (client, environment, command) => {
			const format = client.format;
			if (format === undefined || format === "unsupported") return {
				status: "failed",
				reason: "readback"
			};
			const files = await readClientConfigurationFiles(client);
			if (!files.ok) {
				throwCleanupFailure(files.error);
				return {
					status: "failed",
					reason: "readback"
				};
			}
			const existing = files.value.find(({ sourcePath }) => sourcePath === client.configPath);
			const editabilityError = existing?.dialect === "dsh" ? dshDocument(existing.document).editabilityError : undefined;
			if (editabilityError !== undefined) return {
				status: "failed",
				reason: "readback"
			};
			const policy = await readClientPolicyBlock(client, undefined, clientConfigurationDesired(client, environment, command, existing, files.value));
			if (!policy.ok) {
				throwCleanupFailure(policy.error);
				return {
					status: "failed",
					reason: "readback"
				};
			}
			if (policy.value !== undefined) return {
				status: "failed",
				reason: "readback"
			};
			const transactionPath = await resolveClientConfigTransactionPath(client.configPath);
			if (transactionPath === undefined) return {
				status: "failed",
				reason: "path"
			};
			let original;
			try {
				original = await readRegularFileText(transactionPath);
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (!isMissing(cause)) return {
					status: "failed",
					reason: "readback"
				};
			}
			let parsed;
			try {
				parsed = parseClientConfiguration(original ?? (format === "toml" || format === "grok" || format === "dsh" ? "" : "{}"), format);
				const policy = await readClientPolicyBlock(client, parsed, clientConfigurationDesired(client, environment, command, parsed, files.value));
				if (!policy.ok) {
					throwCleanupFailure(policy.error);
					return {
						status: "failed",
						reason: "readback"
					};
				}
				if (policy.value !== undefined) return {
					status: "failed",
					reason: "readback"
				};
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				void cause;
				return {
					status: "failed",
					reason: "readback"
				};
			}
			const fallback = await readZcodeFallbackServers(client, parsed);
			if (!fallback.ok) {
				throwCleanupFailure(fallback.error);
				return {
					status: "failed",
					reason: "readback"
				};
			}
			const desired = clientConfigurationDesired(client, environment, command, {
				...parsed,
				servers: {
					...fallback.value,
					...parsed.servers
				}
			}, files.value);
			if (registrationCurrent(parsed, desired)) return { status: "unchanged" };
			return persistClientConfiguration({
				client,
				transactionPath,
				format,
				original,
				parsed,
				desired,
				fallbackServers: fallback.value
			});
		};
		persistClientConfiguration = async ({ client, transactionPath, format, original, parsed, desired, fallbackServers }) => {
			if (client.msixPackage !== undefined && await packageReadTargetChanged(client.msixPackage, client.configPath)) return {
				status: "failed",
				reason: "target_changed"
			};
			const backupPath = original === undefined ? undefined : `${client.configPath}.rea.backup`;
			let recoveryBackupPath;
			if (backupPath !== undefined && original !== undefined) {
				const selection = await selectCurrentRecoveryBackup(backupPath, original);
				if (!selection.ok) return {
					status: "failed",
					reason: "backup"
				};
				if (!await preserveRecoveryBackup(transactionPath, selection.value.backupPath)) return {
					status: "failed",
					reason: "backup"
				};
				const verified = await selectCurrentRecoveryBackup(backupPath, original);
				if (!verified.ok || verified.value.backupPath !== selection.value.backupPath || !verified.value.present) return {
					status: "failed",
					reason: "backup"
				};
				recoveryBackupPath = verified.value.backupPath;
			}
			const legacyPath = legacyClientServerPath(parsed, PRODUCT_IDENTITY.mcpServerKey);
			const registered = withClientServers(parsed, {
				...fallbackServers,
				...parsed.servers,
				[PRODUCT_IDENTITY.mcpServerKey]: desired
			}, PRODUCT_IDENTITY.mcpServerKey);
			const ompDisabled = parsed.dialect === "omp" ? parsed.document[OMP_DISABLED_SERVERS_KEY] : undefined;
			const enableOmp = Array.isArray(ompDisabled) && ompDisabled.includes(PRODUCT_IDENTITY.mcpServerKey);
			const document = enableOmp && Array.isArray(ompDisabled) ? {
				...registered,
				[OMP_DISABLED_SERVERS_KEY]: ompDisabled.filter((name) => name !== PRODUCT_IDENTITY.mcpServerKey)
			} : registered;
			try {
				await mkdir(dirname(client.configPath), { recursive: true });
				await writeFileAtomic(transactionPath, serializeClientConfiguration(document, format, original, [
					...Object.keys(fallbackServers).filter((name) => name !== PRODUCT_IDENTITY.mcpServerKey).map((name) => clientServerPath(parsed, name)),
					clientServerPath(parsed, PRODUCT_IDENTITY.mcpServerKey),
					...legacyPath === undefined ? [] : [legacyPath],
					...enableOmp ? [[OMP_DISABLED_SERVERS_KEY]] : []
				]), {
					encoding: "utf8",
					mode: 384
				});
			} catch (cause) {
				void cause;
				return {
					status: "failed",
					reason: "write"
				};
			}
			try {
				const readback = parseClientConfiguration(await readRegularFileText(transactionPath), format);
				if (!registrationCurrent(readback, desired) || Object.entries(fallbackServers).some(([name, entry]) => name !== PRODUCT_IDENTITY.mcpServerKey && !clientConfigurationValuesEqual(readback.servers[name], entry))) {
					return rollbackOrReadbackFailure(transactionPath, original, recoveryBackupPath);
				}
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) {
					const rollback = await restoreConfig(transactionPath, original);
					if (!rollback.ok) throw new ClientConfigurationCleanupRollbackFailure(cause, {
						status: "failed",
						reason: "rollback",
						...recoveryBackupPath === undefined ? {} : { backupPath: recoveryBackupPath },
						failure: rollback.error
					});
					throw cause;
				}
				void cause;
				return rollbackOrReadbackFailure(transactionPath, original, recoveryBackupPath);
			}
			return {
				status: "configured",
				...recoveryBackupPath === undefined ? {} : { backupPath: recoveryBackupPath }
			};
		};
		clientConfigurationAligned = async (client, providerEnvironment, command) => {
			if (client.configPathError !== undefined) return false;
			try {
				const files = await readClientConfigurationFiles(client);
				if (!files.ok) {
					throwCleanupFailure(files.error);
					return false;
				}
				const original = await readRegularFileText(client.configPath);
				const parsed = parseClientConfiguration(original, client.format);
				const policy = await readClientPolicyBlock(client, parsed, clientConfigurationDesired(client, providerEnvironment, command, parsed, files.value));
				if (!policy.ok) {
					throwCleanupFailure(policy.error);
					return false;
				}
				return policy.value === undefined && registrationCurrent(parsed, clientConfigurationDesired(client, providerEnvironment, command, parsed, files.value));
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				void cause;
				return false;
			}
		};
		inspectClientConfiguration = async (client, providerEnvironment, command) => {
			const inspection = await inspectClientDocument(client, providerEnvironment, command);
			if (inspection.status !== "create" && inspection.status !== "update") return inspection;
			const blocker = registrationWriteBlocker(client, "setup");
			return blocker === undefined ? inspection : {
				status: "invalid",
				remediation: blocker
			};
		};
		inspectClientDocument = async (client, providerEnvironment, command) => {
			if (client.configPathError !== undefined) return {
				status: "invalid",
				remediation: client.configPathError
			};
			if (client.format === "unsupported") return { status: "already_current" };
			const files = await readClientConfigurationFiles(client);
			if (!files.ok) {
				throwCleanupFailure(files.error);
				return {
					status: "invalid",
					remediation: files.error.detail
				};
			}
			const existing = files.value.find(({ sourcePath }) => sourcePath === client.configPath);
			const editabilityError = existing?.dialect === "dsh" ? dshDocument(existing.document).editabilityError : undefined;
			if (editabilityError !== undefined) return {
				status: "invalid",
				remediation: editabilityError.message
			};
			const policy = await readClientPolicyBlock(client, undefined, clientConfigurationDesired(client, providerEnvironment, command, existing, files.value));
			if (!policy.ok) {
				throwCleanupFailure(policy.error);
				return {
					status: "invalid",
					remediation: policy.error.detail
				};
			}
			if (policy.value !== undefined) return {
				status: "invalid",
				remediation: policy.value
			};
			const transactionPath = await resolveClientConfigTransactionPath(client.configPath);
			if (transactionPath === undefined) return {
				status: "invalid",
				remediation: "The configuration path is unsafe or unresolved. Check ownership and symbolic links before rerunning setup."
			};
			let original;
			try {
				original = await readRegularFileText(transactionPath);
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (isMissing(cause)) {
					const fallback = await readZcodeFallbackServers(client);
					if (!fallback.ok) {
						throwCleanupFailure(fallback.error);
						return {
							status: "invalid",
							remediation: fallback.error.detail
						};
					}
					return { status: "create" };
				}
				return {
					status: "invalid",
					remediation: `The configuration file could not be read. Check its permissions before rerunning setup. ${cause instanceof Error ? cause.message : String(cause)}`
				};
			}
			try {
				const parsed = parseClientConfiguration(original, client.format);
				const policy = await readClientPolicyBlock(client, parsed, clientConfigurationDesired(client, providerEnvironment, command, parsed, files.value));
				if (!policy.ok) {
					throwCleanupFailure(policy.error);
					return {
						status: "invalid",
						remediation: policy.error.detail
					};
				}
				if (policy.value !== undefined) return {
					status: "invalid",
					remediation: policy.value
				};
				const desired = clientConfigurationDesired(client, providerEnvironment, command, parsed, files.value);
				if (registrationCurrent(parsed, desired)) return { status: "already_current" };
				const fallback = await readZcodeFallbackServers(client, parsed);
				if (!fallback.ok) {
					throwCleanupFailure(fallback.error);
					return {
						status: "invalid",
						remediation: fallback.error.detail
					};
				}
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				void cause;
				return {
					status: "invalid",
					remediation: "The existing configuration is malformed. Repair it before setup applies any other changes."
				};
			}
			const backupSelection = await selectCurrentRecoveryBackup(`${client.configPath}.rea.backup`, original);
			if (!backupSelection.ok) return {
				status: "invalid",
				remediation: backupSelection.error.detail
			};
			return {
				status: "update",
				backupPath: backupSelection.value.backupPath
			};
		};
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
		throwCleanupFailure = (error) => {
			if (error.cleanupFailure !== undefined) throw error.cleanupFailure;
		};
		readZcodeFallbackServers = async (client, parsed) => {
			if (client.format !== "zcode" || parsed !== undefined && Object.keys(parsed.servers).length > 0) return ok({});
			const path = client.zcodeFallbackPath;
			const detail = `The ZCode fallback configuration ${path ?? "path"} is unresolved, malformed or unreadable. Repair it before rerunning setup: the first native server would suppress that fallback.`;
			if (path === undefined) return err({
				kind: "unreadable",
				path: client.configPath,
				detail
			});
			const transactionPath = await resolveClientConfigTransactionPath(path);
			if (transactionPath === undefined) return err({
				kind: "unreadable",
				path,
				detail
			});
			const source = await readConfigurationText(transactionPath);
			if (!source.ok) return err({
				...source.error,
				detail: `${detail} ${source.error.detail}`
			});
			if (source.value === undefined) return ok({});
			try {
				const parsed = parseZcodeFallbackConfiguration(source.value);
				const environment = clientRegistrationEnvironment(parsed);
				if (!environment.ok) return err({
					kind: "malformed",
					path,
					detail: `${detail} ${environment.error.settings.map(({ setting, constraint }) => `${setting}: ${constraint}`).join("; ")}`
				});
				return ok(parsed.servers);
			} catch (cause) {
				return err({
					kind: "malformed",
					path,
					detail: `${detail} ${cause instanceof Error ? cause.message : String(cause)}`
				});
			}
		};
		restoreConfig = async (path, original) => {
			try {
				if (original === undefined) await rm(path, { force: true });
				else await writeFile(path, original, {
					encoding: "utf8",
					mode: 384
				});
				return ok(undefined);
			} catch (cause) {
				return err({
					kind: "restore",
					path,
					detail: errorDetail(cause)
				});
			}
		};
		rollbackOrReadbackFailure = async (targetPath, original, backupPath) => {
			const rollback = await restoreConfig(targetPath, original);
			return rollback.ok ? {
				status: "failed",
				reason: "readback"
			} : {
				status: "failed",
				reason: "rollback",
				...backupPath === undefined ? {} : { backupPath },
				failure: rollback.error
			};
		};
		errorDetail = (cause) => cause instanceof Error ? cause.message : String(cause);
		registrationCurrent = (parsed, desired) => (parsed.dialect !== "dsh" || dshDocument(parsed.document).ready) && clientConfigurationValuesEqual(parsed.servers[PRODUCT_IDENTITY.mcpServerKey], desired) && !Object.hasOwn(parsed.legacyServers, PRODUCT_IDENTITY.mcpServerKey) && !clientServerListedDisabled(parsed, PRODUCT_IDENTITY.mcpServerKey);
		clientConfigurationDesired = (client, providerEnvironment, command, parsed, sources) => {
			const effective = effectiveClientConfiguration(sources, {
				client,
				document: parsed
			});
			const validated = clientRegistrationEnvironment(effective, providerEnvironment);
			if (!validated.ok) throw validated.error;
			const format = parsed?.dialect ?? client.format ?? "json";
			const launcher = command.length === 0 ? [PRODUCT_IDENTITY.cliBinary, "mcp"] : command;
			if (format === "dsh") {
				const desired = (parsed === undefined ? new DshCordisDocument("") : dshDocument(parsed.document)).desired(launcher, providerEnvironment);
				if (!desired.ok) throw desired.error;
				return desired.value;
			}
			const environment = clientRegistrationEnvironment(parsed, providerEnvironment, "fragment");
			if (!environment.ok) throw environment.error;
			const registration = clientRegistrationEntry(format, launcher, environment.value);
			const previous = parsed?.servers[PRODUCT_IDENTITY.mcpServerKey];
			if (client.name === "kimi" && typeof previous === "object" && previous !== null && "enabledTools" in previous) registration.enabledTools = previous.enabledTools;
			return {
				...registration,
				...client.name === "codex" || client.name === "grok_build" ? { startup_timeout_sec: MCP_STARTUP_POLICY.codexStartupTimeoutSeconds } : {},
				...client.name === "kimi" ? {
					startupTimeoutMs: MCP_STARTUP_POLICY.kimiStartupTimeoutMs,
					toolTimeoutMs: MCP_STARTUP_POLICY.kimiToolTimeoutMs
				} : {}
			};
		};
	})))();
}

//#endregion
//#region dist/application/SetupInstallFailure.js
var normalizePackageOutput, packageOutputExcerpt, packageManagerRemediation, setupInstallFailure;
function init_SetupInstallFailure() {
	return (init_SetupInstallFailure = __esmMin((() => {
		init_hopperPublisher();
		normalizePackageOutput = (output) => output.replace(/\u001b(?:\[[0-9;?]*[ -/]*[@-~]|\([0-9A-Za-z]|[@-Z\\^_])/gu, "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/gu, "").replace(/\s+/gu, " ").trim();
		packageOutputExcerpt = (failure, limit = 400) => {
			const output = [failure.stderr, failure.stdout].map(normalizePackageOutput).filter((text) => text !== "").join(" ");
			const suffix = failure.outputTruncated ? " (output truncated)" : "";
			const bodyLimit = limit - suffix.length;
			if (output.length <= bodyLimit) return `${output}${suffix}`;
			const half = Math.floor((bodyLimit - 3) / 2);
			const head = output.slice(0, half).replace(/\s+\S*$/u, "").trimEnd();
			const tail = output.slice(-half).replace(/^\S*\s+/u, "").trimStart();
			return `${head} … ${tail}${suffix}`;
		};
		packageManagerRemediation = (failure) => {
			if (failure === undefined) return "Allow the system package-manager operation or install the planned Hopper package and Linux runtime dependencies, then rerun rea setup.";
			const status = failure.exitCode === null ? "no exit status" : `exit ${failure.exitCode}`;
			const excerpt = packageOutputExcerpt(failure);
			const observed = excerpt === "" ? "no output was captured." : `its output: ${excerpt}`;
			return `The system package-manager command failed (${failure.command}; ${status}); ${observed} Resolve the reported problem, grant the authorization the command needs, or install the planned Hopper package and Linux runtime dependencies manually, then rerun rea setup.`;
		};
		setupInstallFailure = (reason, packageFailure) => {
			switch (reason) {
				case "unsupported_host": return {
					status: "failed",
					code: "unsupported_host",
					remediation: "Use a supported host, then rerun rea setup."
				};
				case "integrity": return {
					status: "failed",
					code: "integrity_mismatch",
					remediation: "The Hopper download failed integrity verification. Retry setup; if it repeats, update REA before installing."
				};
				case "authorization_or_package_manager": return {
					status: "failed",
					code: "authorization_or_package_manager_failed",
					remediation: packageManagerRemediation(packageFailure)
				};
				case "launcher_missing": return {
					status: "failed",
					code: "launcher_missing",
					remediation: "The package operation completed but Hopper is not runnable. Run rea doctor and repair the reported launcher issue."
				};
				case "runtime_dependencies": return {
					status: "failed",
					code: "runtime_dependency_unavailable",
					remediation: "Hopper was installed but required shared libraries are missing. Rerun rea setup, then apply the hopper-demo-runtime remediation from rea doctor."
				};
				case "unsupported_hopper_build": return {
					status: "failed",
					code: "unsupported_hopper_build",
					remediation: "The installed Hopper launcher does not match the build supported by this REA release. Unset HOPPER_LAUNCHER_PATH, reinstall through rea setup, or update REA."
				};
				case "cancelled": return {
					status: "failed",
					code: "setup_cancelled",
					remediation: "Setup was cancelled before Hopper was installed. Rerun rea setup when ready."
				};
				case "destination_exists": return {
					status: "failed",
					code: "destination_exists",
					remediation: "The Hopper installation destination already exists and was not replaced. Reuse the existing installation or move it aside, then rerun rea setup."
				};
				case "mount": return {
					status: "failed",
					code: "mount_failed",
					remediation: "The verified Hopper disk image could not be mounted. Eject any stale Hopper image, check local disk access, then rerun rea setup."
				};
				case "bundle": return {
					status: "failed",
					code: "bundle_invalid",
					remediation: "The mounted package did not contain the expected Hopper application bundle. Retry setup; if it repeats, update REA before installing."
				};
				case "publisher_verification_failed": return {
					status: "failed",
					code: "publisher_verification_failed",
					remediation: `The mounted Hopper application is not signed by the publisher REA pins (${HOPPER_PUBLISHER.bundleIdentifier}, Apple team ${HOPPER_PUBLISHER.teamIdentifier}); nothing was copied or launched. Install Hopper yourself and set HOPPER_LAUNCHER_PATH to its launcher, then rerun rea setup.`
				};
				case "copy": return {
					status: "failed",
					code: "copy_failed",
					remediation: "The verified Hopper application could not be copied to the installation destination. Check destination permissions and free space, then rerun rea setup."
				};
				default: return {
					status: "failed",
					code: "download_failed",
					remediation: "REA could not download or unpack the official Hopper package. Check network and filesystem access, then retry setup."
				};
			}
		};
	})))();
}

//#endregion
//#region dist/application/SetupRegistrationEnvironment.js
var providerRegistrationEnvironment;
function init_SetupRegistrationEnvironment() {
	return (init_SetupRegistrationEnvironment = __esmMin((() => {
		init_unicodeCodePointOrder();
		providerRegistrationEnvironment = (inspections) => Object.fromEntries(inspections.flatMap(({ registrationEnvironment }) => Object.entries(registrationEnvironment)).sort(([left], [right]) => compareUnicodeCodePoints(left, right)));
	})))();
}

//#endregion
//#region dist/application/SetupHost.js
var SetupHost_exports = /* @__PURE__ */ __exportAll({
	detectClients: () => detectClients,
	filterClientsNeedingConfigure: () => filterClientsNeedingConfigure,
	hostRemediation: () => hostRemediation,
	setupRegistrationCommand: () => setupRegistrationCommand,
	systemSetupHost: () => systemSetupHost
});
var setupRegistrationCommand, setupRegistration, filterClientsNeedingConfigure, hostRemediation, systemSetupHost, clientConfigurationOperations, closeSetupResources, runClientConfigurationOperation, configurationCleanupError, errorMessage, detectClients, major, clientEvidencePresent, exists;
function init_SetupHost() {
	return (init_SetupHost = __esmMin((() => {
		init_ArtifactResourceScope();
		init_ArtifactReader();
		init_configurationErrors();
		init_identity();
		init_ClientRegistrationIdentity();
		init_runtimeVersion();
		init_Doctor();
		init_LinuxHopper();
		init_MacHopper();
		init_SupportedClients();
		init_SetupSkill();
		init_SetupClientConfiguration();
		init_SetupClients();
		init_SetupInstallFailure();
		init_RegularFileRead();
		init_SetupRegistrationEnvironment();
		init_MsixPackageStorage();
		init_CurrentEntrypointPath();
		setupRegistrationCommand = (platform, packageRunner, entrypointPath) => {
			if (packageRunner !== undefined) return packageRunnerRegistrationCommand(packageRunner, platform);
			if (entrypointPath === undefined || entrypointPath.length === 0) return [];
			return platform === "win32" ? [
				process.execPath,
				entrypointPath,
				"mcp"
			] : [entrypointPath, "mcp"];
		};
		setupRegistration = (platform, homeDirectory, environment) => {
			const registrationCommand = setupRegistrationCommand(platform, invokingPackageRunner(environment, platform), CURRENT_ENTRYPOINT_PATH);
			const registrationCommandBlocker = registrationCommand.length === 0 ? "REA could not determine the current executable entrypoint. Run setup through the installed REA CLI or a supported package runner before configuring clients." : platform === "win32" ? packagePrivateLauncherBlocker(registrationCommand, msixPackagesDirectory(homeDirectory, environment)) : undefined;
			return registrationCommandBlocker === undefined ? { registrationCommand } : {
				registrationCommand,
				registrationCommandBlocker
			};
		};
		filterClientsNeedingConfigure = async (host, detectedClients, providerEnvironment, command) => {
			const needs = await Promise.all(detectedClients.map((client) => host.clientNeedsConfigure(client, providerEnvironment, command)));
			return detectedClients.filter((_, index) => needs[index]);
		};
		hostRemediation = async (host, installHopper) => {
			if (!supportsNodeVersion(host.nodeVersion)) return `Install ${SUPPORTED_NODE_VERSION_PROSE} and rerun setup.`;
			if (!installHopper) return undefined;
			if (host.platform !== "darwin" && host.platform !== "linux") return "REA supports Hopper on macOS and selected 64-bit Linux distributions.";
			if (host.platform === "darwin") {
				const version = await host.macosVersion();
				return version === undefined || major(version) < 12 ? "Upgrade to macOS 12 or newer." : undefined;
			}
			if ((await host.linuxDistribution())?.hopperSetupSupported === true) return undefined;
			return "Automated Hopper setup supports Ubuntu 24.04+, Fedora 41+, Nobara 44+, 64-bit Arch Linux, CachyOS, and Omarchy; configure an existing supported provider instead.";
		};
		systemSetupHost = (selectedDoctorHost = undefined, environment = process.env) => {
			const doctorHost = selectedDoctorHost ?? systemDoctorHost({ environment });
			const platform = doctorHost.platform;
			const { homeDirectory } = doctorHost;
			const macHopperHost = platform === "darwin" ? systemMacHopperInstallHost(homeDirectory, environment) : undefined;
			const resources = new ArtifactResourceScope();
			const linuxHopperHost = systemLinuxHopperInstallHost(environment);
			const pendingLinuxHopperCleanup = new LinuxHopperTemporaryCleanupOwner();
			return {
				platform,
				homeDirectory,
				skillDestinations: (clientIds) => skillDestinations(homeDirectory, clientIds, environment, platform),
				...setupRegistration(platform, homeDirectory, environment),
				nodeVersion: process.versions.node,
				macosVersion: () => doctorHost.macosVersion(),
				linuxDistribution: readLinuxDistribution,
				close: () => closeSetupResources(resources, macHopperHost, doctorHost, () => pendingLinuxHopperCleanup.retry(linuxHopperHost.cleanup)),
				initialSetupState: async (scope) => {
					const diagnosis = await runDoctor(undefined, doctorHost, scope);
					return {
						...diagnosis.hopperPath === undefined ? {} : { hopperPath: diagnosis.hopperPath },
						...typeof environment.HOPPER_LAUNCHER_PATH === "string" && environment.HOPPER_LAUNCHER_PATH.trim() !== "" && diagnosis.hopperPath === environment.HOPPER_LAUNCHER_PATH ? { hopperLauncherConfigured: true } : {},
						providerEnvironment: {
							...providerRegistrationEnvironment(diagnosis.providerInspections ?? []),
							...doctorHost.providerRegistrationEnvironment?.(),
							...diagnosis.hopperPath === undefined ? {} : { HOPPER_LAUNCHER_PATH: diagnosis.hopperPath }
						},
						doctor: diagnosis
					};
				},
				installHopper: async (replaceExisting) => {
					if (platform === "linux") {
						const result = await installLinuxHopper(linuxHopperHost);
						if (result.cleanupFailure !== undefined) pendingLinuxHopperCleanup.retain(result.cleanupFailure);
						return result.status === "installed" ? {
							status: "installed",
							launcherPath: result.launcherPath
						} : setupInstallFailure(result.reason, result.packageFailure);
					}
					if (macHopperHost === undefined) return setupInstallFailure("unsupported_host");
					const result = await installMacHopper({ replaceExisting }, macHopperHost);
					if (result.status === "installed") return {
						status: "installed",
						launcherPath: result.launcherPath,
						...result.cleanupFailure === undefined ? {} : { cleanupFailure: result.cleanupFailure }
					};
					const failure = setupInstallFailure(result.reason);
					if (result.cleanupFailure === undefined) return failure;
					return failure.status === "failed" ? {
						...failure,
						remediation: `${failure.remediation} ${result.cleanupFailure}`
					} : failure;
				},
				detectedClients: () => detectClients(homeDirectory, platform, environment),
				supportedClients: () => Promise.resolve(supportedClients(homeDirectory, platform, environment)),
				...clientConfigurationOperations(resources),
				skillNeedsInstall: (clientIds) => canonicalSkillNeedsInstall(homeDirectory, clientIds, environment, platform, resources),
				validateSkillDirectories: (clientIds) => validateCanonicalSkillDirectories(homeDirectory, clientIds, environment, platform),
				installSkill: (clientIds) => installCanonicalSkill(homeDirectory, clientIds, environment, platform, undefined, resources),
				doctor: (scope) => runDoctor(undefined, doctorHost, scope)
			};
		};
		clientConfigurationOperations = (resources) => ({
			configureClient: (client, providerEnvironment, command) => runClientConfigurationOperation(resources, async () => client.format === "unsupported" ? { status: "skipped" } : configureClientConfiguration(client, providerEnvironment, command)),
			clientNeedsConfigure: (client, providerEnvironment, command) => runClientConfigurationOperation(resources, async () => client.format === "unsupported" ? false : !await clientConfigurationAligned(client, providerEnvironment, command)),
			inspectClientConfiguration: (client, providerEnvironment, command) => runClientConfigurationOperation(resources, () => inspectClientConfiguration(client, providerEnvironment, command))
		});
		closeSetupResources = async (resources, macHopperHost, doctorHost, retryLinuxHopperCleanup) => {
			const [resourceCleanup, hopperCleanup, doctorCleanup, linuxCleanup] = await Promise.allSettled([
				resources.close(),
				Promise.resolve().then(() => macHopperHost?.close()),
				Promise.resolve().then(() => doctorHost.close?.()),
				retryLinuxHopperCleanup()
			]);
			const failures = [];
			if (hopperCleanup.status === "rejected") failures.push(`Hopper host cleanup failed: ${errorMessage(hopperCleanup.reason)}`);
			else if (hopperCleanup.value !== undefined) failures.push(hopperCleanup.value);
			if (doctorCleanup.status === "rejected") failures.push(`Doctor host cleanup failed: ${errorMessage(doctorCleanup.reason)}`);
			else if (doctorCleanup.value !== undefined) failures.push(doctorCleanup.value);
			if (linuxCleanup.status === "rejected") failures.push(`Linux Hopper cleanup retry failed: ${errorMessage(linuxCleanup.reason)}`);
			else if (linuxCleanup.value !== undefined) failures.push(linuxCleanup.value);
			if (resourceCleanup.status === "rejected") failures.push(errorMessage(resourceCleanup.reason));
			return failures.length === 0 ? undefined : failures.join("; ");
		};
		runClientConfigurationOperation = async (resources, operation) => {
			try {
				return await resources.run(async () => {
					try {
						return await operation();
					} catch (cause) {
						if (!(cause instanceof RegularFileCleanupFailure)) throw cause;
						const cleanup = await retryRegularFileCleanup(cause, resources);
						const primary = cleanup.outcome.kind === "failed" ? cleanup.outcome.cause : cause.cleanupCause;
						const rollbackMessage = cause instanceof ClientConfigurationCleanupRollbackFailure ? ` ${failedConfigurationMessage(cause.configurationFailure)}` : "";
						throw configurationCleanupError(`Could not safely access client configuration at ${cause.path}: ${errorMessage(primary)}.${rollbackMessage}`, cause, cleanup.cleanup);
					}
				});
			} catch (cause) {
				if (cause instanceof ArtifactReaderFailure) throw configurationCleanupError(cause.message, cause, cause.cleanup);
				throw cause;
			}
		};
		configurationCleanupError = (message, cause, cleanup) => new ConfigurationError(message, {
			cause,
			settings: [{
				setting: "client configuration",
				constraint: message
			}],
			...cleanup === undefined ? {} : { cleanup }
		});
		errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
		detectClients = async (home, platform = process.platform, environment = process.env) => {
			const detected = [];
			for (const candidate of supportedClients(home, platform, environment)) {
				if (candidate.configPathError !== undefined) continue;
				if (await clientEvidencePresent(candidate)) detected.push(candidate);
			}
			return detected;
		};
		major = (version) => Number.parseInt(version.split(".")[0] ?? "0", 10);
		clientEvidencePresent = async (client) => {
			for (const path of clientEvidencePaths(client)) if (await exists(path)) return true;
			return false;
		};
		exists = async (path) => {
			try {
				await access(path);
				return true;
			} catch (cause) {
				void cause;
				return false;
			}
		};
	})))();
}

//#endregion
export { SetupHost_exports, configureDetectedClients, filterClientsNeedingConfigure, hostRemediation, init_MacHopper, init_SetupClients, init_SetupHost, macHopperInstallDisclosure, systemSetupHost };