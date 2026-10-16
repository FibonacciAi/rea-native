import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { PRODUCT_IDENTITY, init_identity } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-DQWTcUwE.js";
import { InvalidUtf8FileError, RegularFileCleanupFailure, init_RegularFileRead, readRegularFileText } from "./RegularFileRead-DVlC5faM.js";
import { appDataRedirection, homeDirectoryFromEnvironment, init_ClientRegistrationIdentity, init_MsixPackageStorage, init_SupportedClients, init_homeDirectory, isOwnedClientRegistrationCommand, manualRegistrationRemediation, redirectedWriteBlocker, registrationWriteBlocker, supportedClients } from "./SupportedClients-DaX6Lt2d.js";
import { init_UninstallFailure, isUninstallFailure } from "./UninstallFailure-1blyKXHE.js";
import { CURRENT_ENTRYPOINT_PATH, init_CurrentEntrypointPath } from "./CurrentEntrypointPath-D5FRNdkq.js";
import { ClientConfigurationShapeError, MANAGED_SKILL_FILES, clientServerPath, dshDocument, init_ClientConfigurationDocument, init_DshCordisPatch, init_SetupSkill, isManagedSkillManifest, legacyClientServerPath, parseClientConfiguration, readSkillFile, serializeClientConfiguration, skillDestinations, withClientServers } from "./ClientConfigurationDocument-ffQ9X0Se.js";
import { init_ClientConfigPath, resolveClientConfigTransactionPath } from "./ClientConfigPath-c6jr6INc.js";
import { z } from "zod";
import { join } from "node:path";
import { copyFile, lstat, realpath, rm, rmdir } from "node:fs/promises";
import { constants } from "node:fs";
import writeFileAtomic from "write-file-atomic";

//#region dist/application/Uninstall.js
var systemFileSystem, runUninstall, removeAll, systemUninstallHost, uninstallConfigPaths, registrationPresent, readClientConfiguration, itemRead, clientRegistrationRemoval, removeClient, resolveUninstallConfigPath, isOwnedRegistration, purgeManagedData, removeManagedPath, removeManagedSkills, inspectManagedSkill, removeManagedSkill, MANAGED_SKILL_DIRECTORIES, removeEmptyManagedDirectories, isKeptDirectory, removeManagedSkillFile, item, collapseUninstallItems, mergeUninstallItems, preferredUninstallStatus, uninstallStatusPriority, registrationSchema, isMissing;
function init_Uninstall() {
	return (init_Uninstall = __esmMin((() => {
		init_ClientConfigurationDocument();
		init_homeDirectory();
		init_identity();
		init_SetupSkill();
		init_ClientRegistrationIdentity();
		init_CurrentEntrypointPath();
		init_DshCordisPatch();
		init_ClientConfigPath();
		init_RegularFileRead();
		init_ArtifactResourceScope();
		init_SupportedClients();
		init_MsixPackageStorage();
		init_UninstallFailure();
		systemFileSystem = (resources) => ({
			readText: (path) => readRegularFileText(path, { resources }),
			readRegularText: (path) => readSkillFile(path, resources),
			copy: (source, destination) => copyFile(source, destination, constants.COPYFILE_EXCL),
			writeText: (path, contents) => writeFileAtomic(path, contents, { encoding: "utf8" }),
			stat: (path) => lstat(path),
			realpath: (path) => realpath(path),
			remove: (path, recursive = true) => rm(path, { recursive }),
			removeEmptyDirectory: (path) => rmdir(path)
		});
		runUninstall = async (purgeData, host = systemUninstallHost()) => {
			let result;
			let primaryFailure;
			let failed = false;
			try {
				const clients = await host.clients();
				const blocked = [];
				for (const client of clients) {
					const blocking = await host.inspectClient(client);
					if (blocking !== undefined) blocked.push(blocking);
				}
				const skillBlocker = await host.inspectSkill?.();
				if (skillBlocker !== undefined) blocked.push(skillBlocker);
				const items = blocked.length > 0 ? [...blocked, item("uninstall", "skipped", "No REA registration, skill, or data was removed. Repair each failed configuration, then rerun uninstall.")] : await removeAll(clients, purgeData, host);
				items.push({
					name: "analysis_engine",
					status: "retained",
					detail: "Hopper is not owned by REA uninstall."
				});
				const reported = collapseUninstallItems(items);
				result = {
					status: reported.some(({ status }) => status === "failed") ? "failed" : "complete",
					items: reported
				};
			} catch (cause) {
				failed = true;
				primaryFailure = cause;
			}
			let cleanupFailure;
			try {
				cleanupFailure = await host.close?.();
			} catch (cause) {
				cleanupFailure = `Uninstall resource cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
			}
			if (failed) {
				if (cleanupFailure !== undefined) throw new AggregateError([primaryFailure, new Error(cleanupFailure)], "Uninstall failed and its resource cleanup remains incomplete.", { cause: primaryFailure });
				throw primaryFailure;
			}
			if (result === undefined) throw new Error("Uninstall result was not produced.");
			if (cleanupFailure === undefined) return result;
			const items = collapseUninstallItems([...result.items, item("uninstall_cleanup", "failed", cleanupFailure)]);
			return {
				status: "failed",
				items
			};
		};
		removeAll = async (clients, purgeData, host) => {
			const items = [];
			for (const client of clients) {
				const removed = await host.removeClient(client);
				items.push(removed);
				if (removed.status === "failed") return [...items, item("uninstall", "skipped", "Uninstall stopped at this failure; the items above report what changed. Repair the failed configuration, then rerun uninstall.")];
			}
			items.push(await host.removeSkill());
			if (purgeData) items.push(...await host.purgeData());
			return items;
		};
		systemUninstallHost = (selectedHome = undefined, selectedFileSystem = undefined, environment = process.env, platform = process.platform) => {
			const home = selectedHome ?? homeDirectoryFromEnvironment(environment, platform);
			const resources = new ArtifactResourceScope();
			const fileSystem = selectedFileSystem ?? systemFileSystem(resources);
			let redirection;
			const clientWriteBlocker = (client) => registrationWriteBlocker(client, "uninstall") ?? redirectedWriteBlocker(redirection, [client.configPath], "uninstall");
			const skillWriteBlocker = (path) => redirectedWriteBlocker(redirection, [path], "uninstall");
			return {
				clients: () => {
					const clients = supportedClients(home, platform, environment);
					redirection = appDataRedirection(clients);
					return Promise.resolve(clients.flatMap((client) => [...uninstallConfigPaths(client).map((configPath) => ({
						...client,
						configPath
					})), ...client.zcodeFallbackPath === undefined ? [] : [{
						...client,
						configPath: client.zcodeFallbackPath,
						format: "zcode_fallback"
					}]]));
				},
				inspectClient: async (client) => {
					const read = await readClientConfiguration(client, fileSystem);
					if (read.kind === "item") return read.item.status === "failed" ? read.item : undefined;
					const removal = clientRegistrationRemoval(read.parsed, client);
					if (!removal.removeNative && removal.legacyPath === undefined) return undefined;
					const blocker = clientWriteBlocker(client);
					return blocker === undefined ? undefined : item(client.name, "failed", blocker);
				},
				removeClient: (client) => removeClient(client, fileSystem, () => clientWriteBlocker(client)),
				inspectSkill: async () => {
					for (const destination of skillDestinations(home, undefined, environment, platform)) {
						const inspected = await inspectManagedSkill(destination.path, destination.client, fileSystem);
						if (inspected?.status === "failed") return inspected;
						if (inspected !== undefined) continue;
						const blocker = skillWriteBlocker(destination.path);
						if (blocker !== undefined) return item("skill", "failed", blocker);
					}
					return undefined;
				},
				removeSkill: () => removeManagedSkills(home, fileSystem, environment, platform, skillWriteBlocker),
				purgeData: () => purgeManagedData(join(home, ".rea"), fileSystem),
				close: async () => {
					try {
						await resources.close();
						return undefined;
					} catch (cause) {
						return `Uninstall resource cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
					}
				}
			};
		};
		uninstallConfigPaths = (client) => [...new Set([...client.configPaths ?? [client.configPath], ...client.msixPackage === undefined ? [] : [client.msixPackage.privateConfigPath, client.msixPackage.appDataConfigPath]])];
		registrationPresent = (parsed) => {
			const name = PRODUCT_IDENTITY.mcpServerKey;
			return Object.hasOwn(parsed.servers, name) || legacyClientServerPath(parsed, name) !== undefined || parsed.dialect === "dsh" && dshDocument(parsed.document).carriesEntry;
		};
		readClientConfiguration = async (client, fileSystem) => {
			if (client.configPathError !== undefined) return itemRead(item(client.name, "failed", client.configPathError));
			if (client.format === "unsupported") return itemRead(item(client.name, "skipped", manualRegistrationRemediation(client.name) ?? "This client has no documented local MCP configuration boundary."));
			const resolved = await resolveUninstallConfigPath(client, fileSystem);
			if (typeof resolved !== "string") return itemRead(resolved);
			const transactionPath = resolved;
			let original;
			try {
				original = await fileSystem.readText(transactionPath);
			} catch (cause) {
				const readFailure = cause instanceof RegularFileCleanupFailure ? cause.cause : cause;
				return itemRead(isMissing(cause) ? item(client.name, "skipped", "Configuration does not exist.") : item(client.name, "failed", readFailure instanceof InvalidUtf8FileError ? "Configuration is not valid UTF-8 and was not changed. Repair it, then rerun uninstall." : "Configuration could not be read. Check file permissions, then rerun uninstall."));
			}
			try {
				const parsed = parseClientConfiguration(original, client.format);
				return {
					kind: "configuration",
					transactionPath,
					original,
					parsed
				};
			} catch (cause) {
				return itemRead(item(client.name, "failed", cause instanceof ClientConfigurationShapeError ? `Configuration was not changed: ${cause.message}. Repair it, then rerun uninstall.` : `Configuration is not valid ${client.format === "toml" || client.format === "grok" ? "TOML" : client.format === "opencode" ? "JSONC" : client.format === "hermes" || client.format === "dsh" ? "YAML" : "JSON"} and was not changed. Repair it, then rerun uninstall.`));
			}
		};
		itemRead = (result) => ({
			kind: "item",
			item: result
		});
		clientRegistrationRemoval = (parsed, client) => {
			const name = PRODUCT_IDENTITY.mcpServerKey;
			if (parsed.dialect === "dsh" && dshDocument(parsed.document).hasUnknownStructure) return {
				removeNative: false,
				legacyPath: undefined
			};
			const legacyPath = legacyClientServerPath(parsed, name);
			return {
				removeNative: parsed.dialect === "dsh" && dshDocument(parsed.document).carriesEntry || Object.hasOwn(parsed.servers, name) && isOwnedRegistration(parsed.servers[name], client),
				legacyPath: legacyPath !== undefined && isOwnedRegistration(parsed.legacyServers[name], client) ? legacyPath : undefined
			};
		};
		removeClient = async (client, fileSystem, writeBlocker) => {
			const read = await readClientConfiguration(client, fileSystem);
			if (read.kind === "item") return read.item;
			const { transactionPath, original, parsed } = read;
			const name = PRODUCT_IDENTITY.mcpServerKey;
			if (parsed.dialect === "dsh" && dshDocument(parsed.document).hasUnknownStructure) return item(client.name, "retained", "A Cordis expression may produce registration rows, so the patch was retained without changes.");
			if (!registrationPresent(parsed)) return item(client.name, "skipped", "REA registration is absent.");
			const { removeNative, legacyPath } = clientRegistrationRemoval(parsed, client);
			const removeLegacy = legacyPath !== undefined;
			if (!removeNative && !removeLegacy) return item(client.name, "retained", "The rea-named registration is not REA-owned.");
			const blocker = writeBlocker?.();
			if (blocker !== undefined) return item(client.name, "failed", blocker);
			const remaining = { ...parsed.servers };
			if (removeNative) delete remaining[name];
			const document = withClientServers(parsed, remaining, removeLegacy ? name : undefined);
			const editedPaths = [...removeNative ? [clientServerPath(parsed, name)] : [], ...legacyPath === undefined ? [] : [legacyPath]];
			const backupPath = `${client.configPath}.rea.backup`;
			try {
				await fileSystem.copy(transactionPath, backupPath);
			} catch (cause) {
				if (!(cause instanceof Error && "code" in cause && cause.code === "EEXIST")) return item(client.name, "failed", "Configuration could not be backed up, so no change was made. Check file permissions, then rerun uninstall.");
			}
			try {
				await fileSystem.writeText(transactionPath, serializeClientConfiguration(document, client.format, original, editedPaths));
				const readback = parseClientConfiguration(await fileSystem.readText(transactionPath), client.format);
				if (removeNative && Object.hasOwn(readback.servers, name) || readback.dialect === "dsh" && dshDocument(readback.document).carriesEntry || removeLegacy && Object.hasOwn(readback.legacyServers, name)) throw new Error("registration readback mismatch");
				return item(client.name, "removed", `Removed registration from ${client.configPath}.`);
			} catch (cause) {
				void cause;
				try {
					await fileSystem.writeText(transactionPath, original);
				} catch (restoreCause) {
					void restoreCause;
					return item(client.name, "failed", "Configuration could not be updated or restored. Restore its `.rea.backup` manually, then rerun uninstall.");
				}
				return item(client.name, "failed", "Configuration could not be updated. The original was restored and its `.rea.backup` was retained. Repair the configuration or restore the backup, then rerun uninstall.");
			}
		};
		resolveUninstallConfigPath = async (client, fileSystem) => {
			const path = await resolveClientConfigTransactionPath(client.configPath, fileSystem.realpath === undefined ? { lstat: fileSystem.stat } : {
				lstat: fileSystem.stat,
				realpath: fileSystem.realpath
			});
			return path ?? item(client.name, "failed", "Configuration path could not be safely verified. Check its permissions and, if it is a symbolic link, verify that the link resolves to a regular file owned by the current user, then rerun uninstall.");
		};
		isOwnedRegistration = (value, client) => {
			if (client.format === "opencode") {
				const parsed = z.object({
					type: z.literal("local"),
					command: z.array(z.string()).min(1)
				}).passthrough().safeParse(value);
				if (!parsed.success) return false;
				const command = parsed.data.command;
				return isOwnedClientRegistrationCommand(command, CURRENT_ENTRYPOINT_PATH);
			}
			const parsed = registrationSchema.safeParse(value);
			if (!parsed.success) return false;
			const { command, args } = parsed.data;
			return isOwnedClientRegistrationCommand([command, ...args], CURRENT_ENTRYPOINT_PATH);
		};
		purgeManagedData = async (root, fileSystem) => {
			const names = ["cache", "state"];
			try {
				const stats = await fileSystem.stat(root);
				const linked = stats.isSymbolicLink();
				if (linked || stats.isDirectory?.() !== true) return names.map((name) => item(name, "retained", `REA did not remove this item because its managed data root ${root} is ${linked ? "a symbolic link" : "not a directory"}. Verify the root before removing its data manually.`));
			} catch (cause) {
				return names.map((name) => isMissing(cause) ? item(name, "skipped", `${join(root, name)} does not exist.`) : item(name, "failed", `The managed data root ${root} could not be verified. Check its permissions, then rerun uninstall.`));
			}
			const items = [];
			for (const name of names) items.push(await removeManagedPath(join(root, name), name, fileSystem));
			return items;
		};
		removeManagedPath = async (path, name, fileSystem) => {
			try {
				const stats = await fileSystem.stat(path);
				if (stats.isSymbolicLink()) return item(name, "retained", "REA did not remove this item because its managed path is a symbolic link. Verify the link target before removing it manually.");
				await fileSystem.remove(path);
				return item(name, "removed", `Removed ${path}.`);
			} catch (cause) {
				return isMissing(cause) ? item(name, "skipped", `${path} does not exist.`) : item(name, "failed", "This item could not be removed. Check file permissions, then rerun uninstall.");
			}
		};
		removeManagedSkills = async (home, fileSystem, environment, platform, writeBlocker) => {
			const results = await Promise.all(skillDestinations(home, undefined, environment, platform).map(({ client, path }) => removeManagedSkill(path, `${client} (${path})`, fileSystem, writeBlocker)));
			const failed = results.find(({ status }) => status === "failed");
			if (failed !== undefined) return item("skill", "failed", results.map(({ name, status, detail }) => `${name}: ${status} (${detail})`).join(" "));
			const status = results.some(({ status: resultStatus }) => resultStatus === "removed") ? "removed" : results.some(({ status: resultStatus }) => resultStatus === "retained") ? "retained" : "skipped";
			return item("skill", status, results.map(({ name, status: resultStatus, detail }) => `${name}: ${resultStatus} (${detail})`).join(" "));
		};
		inspectManagedSkill = async (path, name, fileSystem) => {
			let root;
			try {
				root = await fileSystem.stat(path);
			} catch (cause) {
				return isMissing(cause) ? item(name, "skipped", "Skill directory does not exist.") : item(name, "failed", "Skill directory could not be inspected.");
			}
			if (root.isSymbolicLink()) return item(name, "retained", "Skill directory is a symbolic link.");
			if (root.isDirectory?.() !== true) return item(name, "retained", "Skill path is not a directory.");
			const manifestPath = join(path, "SKILL.md");
			try {
				const manifest = await fileSystem.stat(manifestPath);
				if (manifest.isSymbolicLink()) return item(name, "retained", "Skill manifest is a symbolic link.");
				if (manifest.isFile?.() !== true) return item(name, "retained", "Skill manifest is not a regular file.");
			} catch (cause) {
				return isMissing(cause) ? item(name, "retained", "Skill ownership could not be established.") : item(name, "failed", "Skill manifest could not be inspected.");
			}
			let content;
			try {
				content = await (fileSystem.readRegularText?.(manifestPath) ?? fileSystem.readText(manifestPath));
			} catch (cause) {
				return isMissing(cause) ? item(name, "retained", "Skill ownership could not be established.") : item(name, "failed", "Skill manifest could not be read.");
			}
			if (!isManagedSkillManifest(content)) return item(name, "retained", "Skill manifest is not REA-owned.");
			return undefined;
		};
		removeManagedSkill = async (path, name, fileSystem, writeBlocker) => {
			const inspection = await inspectManagedSkill(path, name, fileSystem);
			if (inspection !== undefined) return inspection;
			const blocker = writeBlocker?.(path);
			if (blocker !== undefined) return item(name, "failed", blocker);
			const manifestName = "SKILL.md";
			const otherFiles = MANAGED_SKILL_FILES.filter((relativePath) => relativePath !== manifestName);
			const results = [];
			for (const relativePath of otherFiles) results.push(await removeManagedSkillFile(path, relativePath, name, fileSystem));
			if (results.some(({ status }) => status === "failed" || status === "retained")) results.push(item(name, "retained", "REA ownership manifest was retained because a managed file could not be safely removed."));
			else {
				const manifest = await removeManagedSkillFile(path, manifestName, name, fileSystem);
				results.push(manifest);
				const directories = manifest.status === "removed" ? await removeEmptyManagedDirectories(path, name, fileSystem) : undefined;
				if (directories !== undefined) results.push(directories);
			}
			const failed = results.find(({ status }) => status === "failed");
			if (failed !== undefined) return item(name, "failed", results.map(({ detail }) => detail).join(" "));
			if (results.some(({ status }) => status === "retained")) return item(name, "retained", [...new Set(results.map(({ detail }) => detail))].join(" "));
			const removed = results.some(({ status }) => status === "removed");
			return item(name, removed ? "removed" : "skipped", "REA-managed skill files were removed; other files were preserved.");
		};
		MANAGED_SKILL_DIRECTORIES = [...new Set(MANAGED_SKILL_FILES.map((relativePath) => relativePath.split("/").slice(0, -1).join("/")).filter((directory) => directory.length > 0))].sort((left, right) => right.split("/").length - left.split("/").length);
		removeEmptyManagedDirectories = async (root, name, fileSystem) => {
			if (fileSystem.removeEmptyDirectory === undefined) return undefined;
			for (const directory of [...MANAGED_SKILL_DIRECTORIES.map((relative) => join(root, relative)), root]) {
				try {
					await fileSystem.removeEmptyDirectory(directory);
				} catch (cause) {
					if (!isKeptDirectory(cause)) return item(name, "failed", `Managed skill directory could not be removed: ${directory}.`);
				}
			}
			return undefined;
		};
		isKeptDirectory = (cause) => cause instanceof Error && "code" in cause && [
			"ENOTEMPTY",
			"EEXIST",
			"ENOENT",
			"ENOTDIR"
		].includes(String(cause.code));
		removeManagedSkillFile = async (root, relativePath, name, fileSystem) => {
			const segments = relativePath.split(/[\\/]/u);
			let parent = root;
			for (const segment of segments.slice(0, -1)) {
				parent = join(parent, segment);
				try {
					const stats = await fileSystem.stat(parent);
					if (stats.isSymbolicLink() || stats.isDirectory?.() !== true) return item(name, "retained", `Managed path parent was retained: ${parent}.`);
				} catch (cause) {
					return isMissing(cause) ? item(name, "skipped", `${join(parent, segments.at(-1) ?? "")} does not exist.`) : item(name, "failed", `Managed path parent could not be inspected: ${parent}.`);
				}
			}
			const target = join(root, relativePath);
			let stats;
			try {
				stats = await fileSystem.stat(target);
			} catch (cause) {
				return isMissing(cause) ? item(name, "skipped", `${target} does not exist.`) : item(name, "failed", `Managed file could not be inspected: ${target}.`);
			}
			if (stats.isSymbolicLink()) return item(name, "retained", `Managed file is a symbolic link: ${target}.`);
			if (stats.isFile?.() !== true) return item(name, "retained", `Managed path is not a regular file: ${target}.`);
			try {
				await fileSystem.remove(target, false);
				return item(name, "removed", `Removed ${target}.`);
			} catch (cause) {
				return isMissing(cause) ? item(name, "skipped", `${target} does not exist.`) : item(name, "failed", `Managed file could not be removed: ${target}.`);
			}
		};
		item = (name, status, detail) => ({
			name,
			status,
			detail
		});
		collapseUninstallItems = (items) => {
			const collapsed = [];
			for (const next of items) {
				const index = collapsed.findIndex(({ name }) => name === next.name);
				const current = collapsed[index];
				if (current === undefined) {
					collapsed.push(next);
					continue;
				}
				collapsed[index] = mergeUninstallItems(current, next);
			}
			return collapsed;
		};
		mergeUninstallItems = (current, next) => {
			const status = preferredUninstallStatus(current.status, next.status);
			const details = [current, next].filter((entry) => entry.status === status || status === "removed" && entry.status === "retained").map(({ detail }) => detail);
			return item(current.name, status, [...new Set(details)].join(" "));
		};
		preferredUninstallStatus = (current, next) => uninstallStatusPriority(next) > uninstallStatusPriority(current) ? next : current;
		uninstallStatusPriority = (status) => {
			switch (status) {
				case "failed": return 3;
				case "removed": return 2;
				case "retained": return 1;
				case "skipped": return 0;
				default: {
					const exhaustive = status;
					throw new TypeError(`Unhandled uninstall item status: ${String(exhaustive)}`);
				}
			}
		};
		registrationSchema = z.object({
			command: z.string(),
			args: z.array(z.string())
		}).passthrough();
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
	})))();
}

//#endregion
init_Uninstall();
export { runUninstall, systemUninstallHost };