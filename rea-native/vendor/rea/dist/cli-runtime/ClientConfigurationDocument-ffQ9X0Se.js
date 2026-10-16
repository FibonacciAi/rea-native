import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { PRODUCT_IDENTITY, compareUnicodeCodePoints, err, init_identity, init_result, init_unicodeCodePointOrder, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ConfigurationError, init_configurationErrors } from "./errorSchemas-CTRmvMl3.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-BXkffc1D.js";
import { NonRegularFileReadError, RegularFileChangedError, init_RegularFile } from "./RegularFile-B_6KPCNQ.js";
import { init_BoundedFileBytes, readBoundedFileBytes } from "./BoundedFileBytes-BU30odTm.js";
import { RegularFileCleanupFailure, init_RegularFileRead, readRegularFile, withRegularFile } from "./RegularFileRead-DVlC5faM.js";
import { clientSkillDirectories, init_SupportedClients, init_environment, parseEnvironment, parseEnvironmentValues } from "./SupportedClients-DaX6Lt2d.js";
import { z } from "zod";
import { dirname, join } from "node:path";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { copyFile, lstat, mkdir, readFile, rm } from "node:fs/promises";
import { constants } from "node:fs";
import { Document, Schema, isAlias, isMap, isNode, isScalar, isSeq, parseDocument, visit } from "yaml";
import writeFileAtomic from "write-file-atomic";
import { applyEdits, findNodeAtLocation, modify, parse, parseTree, printParseErrorCode } from "jsonc-parser";
import { parse as parse$1, stringify } from "smol-toml";

//#region dist/application/SetupRecoveryBackup.js
var isMissing, errorDetail, selectCurrentRecoveryBackup, preserveRecoveryBackup;
function init_SetupRecoveryBackup() {
	return (init_SetupRecoveryBackup = __esmMin((() => {
		init_result();
		init_RegularFileRead();
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
		errorDetail = (cause) => cause instanceof Error ? cause.message : String(cause);
		selectCurrentRecoveryBackup = async (firstBackupPath, original) => {
			const expected = Buffer.isBuffer(original) ? original : Buffer.from(original, "utf8");
			let firstBackup;
			try {
				firstBackup = await readRegularFile(firstBackupPath, { symlinks: "reject" });
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (!isMissing(cause)) return err({
					kind: "unreadable",
					path: firstBackupPath,
					detail: `The recovery backup could not be checked: ${errorDetail(cause)}`
				});
			}
			if (firstBackup === undefined) return ok({
				backupPath: firstBackupPath,
				present: false
			});
			if (firstBackup.equals(expected)) return ok({
				backupPath: firstBackupPath,
				present: true
			});
			const digest = createHash("sha256").update(expected).digest("hex");
			const recoveryPath = `${firstBackupPath}.${digest}.recovery`;
			let recovery;
			try {
				recovery = await readRegularFile(recoveryPath, { symlinks: "reject" });
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (!isMissing(cause)) return err({
					kind: "unreadable",
					path: recoveryPath,
					detail: `The recovery backup could not be checked: ${errorDetail(cause)}`
				});
			}
			if (recovery !== undefined && !recovery.equals(expected)) return err({
				kind: "occupied",
				path: recoveryPath,
				detail: `The recovery path already contains different data: ${recoveryPath}`
			});
			return ok({
				backupPath: recoveryPath,
				present: recovery !== undefined
			});
		};
		preserveRecoveryBackup = async (source, destination) => {
			try {
				await copyFile(source, destination, constants.COPYFILE_EXCL);
				return true;
			} catch (cause) {
				return cause instanceof Error && "code" in cause && cause.code === "EEXIST";
			}
		};
	})))();
}

//#endregion
//#region dist/application/SetupSkill.js
var MANAGED_SKILL_FILES, isManagedSkillManifest, readSkillFile, readSkillFileState, canonicalSkillContent, SetupSkillInstallError, systemSkillInstallFileOperations, skillDestinations, existingSkillDestinations, readOptionalSkillState, inspectSkillDirectory, skillDirectoryIssues, skillDirectoryFailure, validateCanonicalSkillDirectories, canonicalSkillFiles, inspectCanonicalSkill, canonicalSkillNeedsInstall, causeReason, causePath, restoreSkillFiles, preserveCurrentSkillBackup, installCanonicalSkill, readInstalledSkillIdentity;
function init_SetupSkill() {
	return (init_SetupSkill = __esmMin((() => {
		init_result();
		init_BoundedFileBytes();
		init_ArtifactReader();
		init_identity();
		init_RegularFile();
		init_RegularFileRead();
		init_SupportedClients();
		init_SetupRecoveryBackup();
		MANAGED_SKILL_FILES = [
			"SKILL.md",
			"references/connection-and-recovery.md",
			"references/native-and-artifacts.md",
			"references/javascript-applications.md",
			"references/android-applications.md",
			"references/runtime-observation.md",
			"references/evidence-workflows.md"
		];
		isManagedSkillManifest = (content) => content.startsWith(`---\nname: ${PRODUCT_IDENTITY.skillName}\n`) || content.startsWith(`---\r\nname: ${PRODUCT_IDENTITY.skillName}\r\n`);
		readSkillFile = (path, resources) => readSkillFileState(path, resources).then(({ bytes }) => bytes.toString("utf8"));
		readSkillFileState = async (path, resources) => withRegularFile(path, async (handle, stats) => {
			const bytes = await readBoundedFileBytes(handle, stats.size, undefined, stats.size);
			if (bytes === undefined || bytes.length !== stats.size) throw new RegularFileChangedError(path);
			return {
				bytes,
				mode: stats.mode & 4095
			};
		}, {
			symlinks: "reject",
			...resources === undefined ? {} : { resources }
		});
		canonicalSkillContent = (relativePath) => readFile(new URL(`../../skills/${PRODUCT_IDENTITY.skillName}/${relativePath}`, new URL("../application/SetupSkill.js", import.meta.url).href), "utf8");
		SetupSkillInstallError = class extends Error {
			_tag = "SetupSkillInstallError";
			path;
			stage;
			reason;
			rollbackFailures;
			recoveryBackupPaths;
			constructor(input) {
				const message = [`REA skill ${input.stage} failed at ${input.path}: ${input.reason}.`, ...input.rollbackFailures.length === 0 ? [] : [`Rollback also failed for ${input.rollbackFailures.map(({ path, reason }) => `${path} (${reason})`).join(", ")}.`, ...input.recoveryBackupPaths.length === 0 ? [] : [`Existing-file backups remain at ${input.recoveryBackupPaths.join(", ")}.`]]].join(" ");
				super(message, { cause: input.cause });
				this.path = input.path;
				this.stage = input.stage;
				this.reason = input.reason;
				this.rollbackFailures = input.rollbackFailures;
				this.recoveryBackupPaths = input.recoveryBackupPaths;
			}
			get remediation() {
				return `${this.message} Check permissions and rerun setup.`;
			}
		};
		systemSkillInstallFileOperations = {
			mkdir: async (path) => {
				await mkdir(path, { recursive: true });
			},
			backup: async (source, destination) => {
				try {
					await copyFile(source, destination, constants.COPYFILE_EXCL);
				} catch (cause) {
					if (cause instanceof Error && "code" in cause && cause.code === "EEXIST") return;
					throw cause;
				}
			},
			write: (path, content, mode) => writeFileAtomic(path, content, {
				encoding: "utf8",
				mode
			}),
			remove: (path) => rm(path, { force: true })
		};
		skillDestinations = (home, clientIds, environment = {}, platform = process.platform) => clientSkillDirectories(home, clientIds, environment, platform).map(({ client, directory }) => ({
			client,
			path: join(directory, PRODUCT_IDENTITY.skillName)
		}));
		existingSkillDestinations = async (home, environment = {}, platform = process.platform, resources) => {
			const existing = [];
			for (const destination of skillDestinations(home, undefined, environment, platform)) {
				try {
					const issues = await skillDirectoryIssues([destination]);
					if (issues.some(({ kind }) => kind === "unreadable")) throw skillDirectoryFailure(issues);
					if (issues.length > 0) continue;
					const manifest = join(destination.path, "SKILL.md");
					const content = await readSkillFile(manifest, resources);
					if (isManagedSkillManifest(content)) existing.push(destination);
				} catch (cause) {
					if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") continue;
					if (cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure) throw cause;
					if (cause instanceof NonRegularFileReadError) continue;
					throw cause;
				}
			}
			return existing;
		};
		readOptionalSkillState = async (path, resources) => {
			try {
				return await readSkillFileState(path, resources);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") return undefined;
				throw cause;
			}
		};
		inspectSkillDirectory = async (path) => {
			try {
				const directory = await lstat(path);
				if (directory.isSymbolicLink()) return err({
					path,
					kind: "symbolic_link",
					detail: "Skill directory is a symbolic link."
				});
				if (!directory.isDirectory()) return err({
					path,
					kind: "not_directory",
					detail: "Skill path is not a directory."
				});
				return ok(undefined);
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && cause.code === "ENOENT") return ok(undefined);
				return err({
					path,
					kind: "unreadable",
					detail: cause instanceof Error ? cause.message : String(cause)
				});
			}
		};
		skillDirectoryIssues = async (destinations) => {
			const issues = [];
			for (const { path } of destinations) {
				const root = await inspectSkillDirectory(path);
				if (!root.ok) {
					issues.push(root.error);
					continue;
				}
				const references = await inspectSkillDirectory(join(path, "references"));
				if (!references.ok) issues.push(references.error);
			}
			return issues;
		};
		skillDirectoryFailure = (issues) => new SetupSkillInstallError({
			path: issues[0]?.path ?? "skill bundle",
			stage: "prepare",
			reason: `${issues.map(({ path, detail }) => `${detail} (${path})`).join(" ")} Use a regular skill directory, or run setup with --skill=false to configure the client without installing the skill`,
			rollbackFailures: [],
			recoveryBackupPaths: [],
			cause: issues
		});
		validateCanonicalSkillDirectories = async (home, clientIds, environment = {}, platform = process.platform) => {
			const issues = await skillDirectoryIssues(skillDestinations(home, clientIds, environment, platform));
			return issues.length === 0 ? ok(undefined) : err(skillDirectoryFailure(issues));
		};
		canonicalSkillFiles = async (home, clientIds, environment = {}, platform = process.platform, resources) => {
			const destinations = skillDestinations(home, clientIds, environment, platform);
			const admission = await validateCanonicalSkillDirectories(home, clientIds, environment, platform);
			if (!admission.ok) throw admission.error;
			return Promise.all(destinations.flatMap(({ path: root }) => MANAGED_SKILL_FILES.map(async (relativePath) => {
				const destination = join(root, relativePath);
				return {
					destination,
					content: await canonicalSkillContent(relativePath),
					original: await readOptionalSkillState(destination, resources)
				};
			})));
		};
		inspectCanonicalSkill = async (home, clientIds, environment, platform, resources) => {
			const destinations = skillDestinations(home, clientIds, environment, platform);
			const issues = clientIds === undefined ? [] : [...await skillDirectoryIssues(destinations)];
			if (issues.length > 0) return err({
				_tag: "SkillInspectionFailure",
				issues,
				cause: issues,
				manifest: undefined
			});
			let canonical = true;
			let manifest;
			let failureCause;
			let installedDestination = false;
			for (const destination of destinations) {
				const { path: root } = destination;
				const pathIssues = clientIds === undefined ? await skillDirectoryIssues([destination]) : [];
				if (pathIssues.length > 0) {
					issues.push(...pathIssues);
					if (failureCause === undefined) failureCause = pathIssues;
					installedDestination = true;
					canonical = false;
					continue;
				}
				let rootCanonical = true;
				let rootHasFiles = false;
				const rootIssues = [];
				for (const relativePath of MANAGED_SKILL_FILES) {
					const destination = join(root, relativePath);
					let original;
					try {
						original = await readOptionalSkillState(destination, resources);
					} catch (cause) {
						if (cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure) throw cause;
						rootIssues.push({
							path: destination,
							kind: "unreadable",
							detail: causeReason(cause)
						});
						if (failureCause === undefined) failureCause = cause;
						rootCanonical = false;
						rootHasFiles = true;
						continue;
					}
					if (original !== undefined) rootHasFiles = true;
					if (relativePath === "SKILL.md" && manifest === undefined) manifest = original?.bytes.toString("utf8");
					if (original === undefined) rootCanonical = false;
					else if (rootCanonical) {
						const content = await canonicalSkillContent(relativePath);
						rootCanonical = original.bytes.equals(Buffer.from(content, "utf8"));
					}
				}
				if (clientIds !== undefined || rootHasFiles || rootIssues.length > 0) {
					installedDestination = true;
					canonical = canonical && rootCanonical;
					issues.push(...rootIssues);
				}
			}
			return issues.length === 0 ? ok({
				canonical,
				manifest,
				installedDestination
			}) : err({
				_tag: "SkillInspectionFailure",
				issues,
				cause: failureCause,
				manifest
			});
		};
		canonicalSkillNeedsInstall = async (home, clientIds = [], environment = {}, platform = process.platform, resources) => {
			try {
				const inspection = await inspectCanonicalSkill(home, clientIds, environment, platform, resources);
				return !inspection.ok || !inspection.value.canonical;
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure) throw cause;
				void cause;
				return true;
			}
		};
		causeReason = (cause) => cause instanceof Error ? cause.message : String(cause);
		causePath = (cause) => cause instanceof Error && "path" in cause && typeof cause.path === "string" ? cause.path : undefined;
		restoreSkillFiles = async (attempted, operations) => {
			const failures = [];
			for (const { destination, original } of [...attempted].reverse()) {
				try {
					if (original === undefined) await operations.remove(destination);
					else await operations.write(destination, original.bytes, original.mode);
				} catch (cause) {
					failures.push({
						path: destination,
						reason: causeReason(cause)
					});
				}
			}
			return failures;
		};
		preserveCurrentSkillBackup = async (destination, original, operations) => {
			const firstBackupPath = `${destination}.rea.backup`;
			const selection = await selectCurrentRecoveryBackup(firstBackupPath, original);
			if (!selection.ok) throw new Error(selection.error.detail);
			if (selection.value.present) return selection.value.backupPath;
			await operations.backup(destination, selection.value.backupPath);
			const verified = await selectCurrentRecoveryBackup(firstBackupPath, original);
			if (!verified.ok || verified.value.backupPath !== selection.value.backupPath || !verified.value.present) throw new Error(`The current file was not preserved at ${selection.value.backupPath}`);
			return verified.value.backupPath;
		};
		installCanonicalSkill = async (home, clientIds = [], environment = {}, platform = process.platform, operations = systemSkillInstallFileOperations, resources) => {
			let attempted = [];
			let stage = "prepare";
			let failingPath = "skill bundle";
			const recoveryPaths = new Map();
			try {
				const canonical = await canonicalSkillFiles(home, clientIds, environment, platform, resources);
				const changed = canonical.filter(({ content, original }) => original?.bytes.equals(Buffer.from(content, "utf8")) !== true);
				if (changed.length === 0) return ok("unchanged");
				stage = "backup";
				for (const { destination, original } of changed) {
					failingPath = destination;
					await operations.mkdir(dirname(destination));
					if (original !== undefined) {
						recoveryPaths.set(destination, await preserveCurrentSkillBackup(destination, original.bytes, operations));
					}
				}
				stage = "write";
				for (const file of changed) {
					failingPath = file.destination;
					attempted.push(file);
					await operations.write(file.destination, file.content, file.original?.mode ?? 384);
				}
				stage = "readback";
				for (const { destination, content } of changed) {
					failingPath = destination;
					if (!(await readSkillFileState(destination, resources)).bytes.equals(Buffer.from(content, "utf8"))) throw new Error(`skill readback mismatch: ${destination}`);
				}
				return ok("installed");
			} catch (cause) {
				if (stage === "prepare" && cause instanceof SetupSkillInstallError) return err(cause);
				failingPath = causePath(cause) ?? failingPath;
				const rollbackFailures = await restoreSkillFiles(attempted, operations);
				return err(new SetupSkillInstallError({
					path: failingPath,
					stage,
					reason: causeReason(cause),
					rollbackFailures,
					recoveryBackupPaths: attempted.flatMap(({ destination, original }) => original === undefined || recoveryPaths.get(destination) === undefined ? [] : [recoveryPaths.get(destination)]),
					cause
				}));
			}
		};
		readInstalledSkillIdentity = async (home, clientIds, environment = {}, platform = process.platform, resources) => {
			const inspection = await inspectCanonicalSkill(home, clientIds, environment, platform, resources);
			if (inspection.ok && !inspection.value.installedDestination) return undefined;
			const content = inspection.ok ? inspection.value.manifest : inspection.error.manifest;
			const issues = inspection.ok ? [] : inspection.error.issues;
			if (content === undefined && issues.length === 0) return undefined;
			const toolCount = content === undefined ? undefined : /^\s{2}tool_count:\s*(\d+)\s*$/mu.exec(content)?.[1];
			return {
				canonical: inspection.ok && inspection.value.canonical,
				version: content === undefined ? null : /^\s{2}version:\s*"([^"]+)"\s*$/mu.exec(content)?.[1] ?? null,
				toolCount: toolCount === undefined ? null : Number.parseInt(toolCount, 10),
				...issues.length === 0 ? {} : { issues }
			};
		};
	})))();
}

//#endregion
//#region dist/application/DshCordisYaml.js
var CordisExpression, DshCordisYaml;
function init_DshCordisYaml() {
	return (init_DshCordisYaml = __esmMin((() => {
		init_configurationErrors();
		CordisExpression = class {
			source;
			kind = "cordis-expression";
			constructor(source) {
				this.source = source;
			}
		};
		DshCordisYaml = class {
			document;
			#values = new Map();
			#visiting = new Set();
			constructor(text) {
				this.document = parseDocument(text, {
					customTags: [{
						tag: "tag:yaml.org,2002:js",
						resolve: (source) => source
					}],
					logLevel: "silent"
				});
				if (this.document.errors.length > 0 || this.document.warnings.length > 0) throw new ConfigurationError("Invalid or unsupported Cordis YAML", { cause: this.document.errors[0] ?? this.document.warnings[0] });
				if (this.document.contents === null) this.document.contents = this.document.createNode([]);
				if (!isSeq(this.document.contents)) throw new ConfigurationError("Cordis patches must be a YAML operation list");
				this.value(this.document.contents);
				try {
					this.document.toJS();
				} catch (cause) {
					throw new ConfigurationError("Unsafe Cordis YAML alias expansion", { cause });
				}
			}
			resolve(node) {
				if (!isAlias(node)) return node;
				const resolved = node.resolve(this.document);
				if (resolved === undefined) throw new ConfigurationError("Cordis YAML contains an unresolved alias");
				return resolved;
			}
			value(node) {
				const resolved = this.resolve(node);
				if (!isNode(resolved)) return resolved;
				if (this.#values.has(resolved)) return this.#values.get(resolved);
				if (this.#visiting.has(resolved)) throw new ConfigurationError("Cyclic Cordis YAML cannot be safely edited");
				this.#visiting.add(resolved);
				let value;
				if (isScalar(resolved)) value = resolved.tag === "tag:yaml.org,2002:js" ? new CordisExpression(String(resolved.value)) : resolved.value;
				else if (isSeq(resolved)) value = resolved.items.map((item) => this.value(item));
				else if (isMap(resolved)) {
					const entries = [];
					for (const pair of resolved.items) {
						entries.push([this.#key(pair.key), this.value(pair.value)]);
					}
					value = Object.fromEntries(entries);
				}
				this.#visiting.delete(resolved);
				this.#values.set(resolved, value);
				return value;
			}
			#key(node) {
				const key = this.value(node);
				if (typeof key === "object" && key !== null) throw new ConfigurationError("Cordis YAML mapping keys must be literal scalars");
				return key === null ? "" : String(key);
			}
			field(map, key) {
				return map?.items.findLast((pair) => this.#key(pair.key) === key)?.value;
			}
			/** Preserve unchanged nodes and carry their comments when replacing values. */
			setValue(map, key, value) {
				const original = this.field(map, key);
				if (isDeepStrictEqual(this.value(original), value)) return;
				const replacement = this.document.createNode(value);
				if (isNode(original) && isNode(replacement)) {
					if (original.comment !== undefined) replacement.comment = original.comment;
					if (original.commentBefore !== undefined) replacement.commentBefore = original.commentBefore;
				}
				map.set(key, replacement);
			}
			/** Copy from the source before edits; materialized nodes own no anchors. */
			copy(node, invalidated) {
				if (isAlias(node)) {
					const target = this.resolve(node);
					return invalidated === undefined || isNode(target) && invalidated.has(target) ? this.copy(target) : node.clone();
				}
				if (!isNode(node)) return node;
				const copied = node.clone();
				if ((invalidated === undefined || invalidated.has(node)) && (isScalar(copied) || isMap(copied) || isSeq(copied))) delete copied.anchor;
				if (isSeq(node) && isSeq(copied)) copied.items = node.items.map((item) => this.copy(item, invalidated));
				if (isMap(node) && isMap(copied)) copied.items.forEach((pair, index) => {
					pair.key = this.copy(node.items[index].key, invalidated);
					pair.value = this.copy(node.items[index].value, invalidated);
				});
				return copied;
			}
			/** Replacing an anchor must not change untouched consumers of its old value. */
			detach(node, invalidated) {
				const copied = this.copy(node, invalidated);
				if (isNode(copied)) visit(copied, {
					Pair: (_key, pair) => {
						if (isAlias(pair.key)) pair.key = this.copy(this.resolve(pair.key));
					},
					Value: (_key, value) => {
						delete value.anchor;
					}
				});
				return copied;
			}
			anchors(node) {
				if (!isNode(node)) return [];
				const anchors = [];
				visit(node, { Value: (_key, value) => {
					if (value.anchor) anchors.push(value);
				} });
				return anchors;
			}
		};
	})))();
}

//#endregion
//#region dist/application/DshCordisPatch.js
var DSH_ENTRY_ID, DSH_CLIENT_PACKAGE, LAUNCHER_KEYS, SELECTOR_KEYS, isRecord, DshCordisDocument, DshCordisEdit, dshDocument, parseDshCordisDocument, editDshDocument, serializeDshDocument, dshClientRegistrationEntry;
function init_DshCordisPatch() {
	return (init_DshCordisPatch = __esmMin((() => {
		init_environment();
		init_configurationErrors();
		init_result();
		init_DshCordisYaml();
		DSH_ENTRY_ID = "rea-mcp";
		DSH_CLIENT_PACKAGE = "@deepseek-ai/dsh-mcp-client";
		LAUNCHER_KEYS = new Set([
			"serverName",
			"transport",
			"command",
			"args"
		]);
		SELECTOR_KEYS = new Set(["id", "name"]);
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof CordisExpression);
		DshCordisDocument = class {
			#yaml;
			#operations;
			#fields = new Map();
			#entryNode;
			#insertions;
			#unknownSelector = false;
			#unknownStructure = false;
			#editabilityError;
			config;
			constructor(text) {
				this.#yaml = new DshCordisYaml(text);
				const root = this.#yaml.document.contents;
				if (!isSeq(root)) throw new ConfigurationError("Cordis patches must be a list");
				const operations = [];
				let insertions = 0;
				let malformedStructure = false;
				for (const source of root.items) {
					const map = this.#map(source);
					if (map === undefined) {
						if (this.#yaml.value(source) instanceof CordisExpression) this.#unknownStructure = true;
						else malformedStructure = true;
						continue;
					}
					const inserted = this.#yaml.resolve(this.#yaml.field(map, "insert"));
					const targetId = this.#id(map);
					const unknownApplicability = targetId !== undefined;
					const insertedValue = this.#yaml.value(inserted);
					const invalidEntries = isSeq(inserted) ? inserted.items.filter((entry) => this.#map(entry) === undefined) : [];
					if (insertedValue instanceof CordisExpression || invalidEntries.some((entry) => this.#yaml.value(entry) instanceof CordisExpression)) this.#unknownStructure = true;
					else if (insertedValue != null && !isSeq(inserted)) malformedStructure = true;
					else if (invalidEntries.length > 0) malformedStructure = true;
					const ownedRows = isSeq(inserted) ? inserted.items.flatMap((entry, index) => this.#id(entry) === "rea-mcp" ? [index] : []) : [];
					const direct = !isSeq(inserted) && targetId === "rea-mcp";
					operations.push({
						source,
						map,
						ownedRows,
						direct,
						unknownApplicability
					});
					if (isSeq(inserted)) {
						for (const index of ownedRows) {
							const entry = this.#map(inserted.items[index]);
							if (entry === undefined) continue;
							insertions += 1;
							this.#entryNode = entry;
							this.#fields.clear();
							this.#unknownSelector = false;
							this.#readFields(entry);
						}
					} else if (direct) {
						if (insertions === 0) continue;
						const selector = this.#yaml.value(this.#yaml.field(map, "name"));
						if (selector instanceof CordisExpression || selector && this.#field("name") instanceof CordisExpression) {
							this.#unknownSelector = true;
							continue;
						}
						if (selector && selector !== this.#field("name")) continue;
						this.#readFields(map, new Set(["id", "name"]));
					}
				}
				this.#operations = operations;
				this.#insertions = insertions;
				this.#editabilityError = this.#unknownStructure ? new ConfigurationError("Expression-backed Cordis patches have unknown structure; use literal patches before setup") : malformedStructure ? new ConfigurationError("Malformed Cordis patches cannot be edited safely; use mapping entries and insert lists before setup") : operations.some((op) => op.unknownApplicability && op.ownedRows.length > 0) ? new ConfigurationError("Cordis REA insertion targets a group with unknown activity; use a direct insertion before setup") : this.#unknownSelector ? new ConfigurationError("Expression-backed Cordis name selectors have unknown applicability; use literal selectors before setup", { settings: [{
					setting: "name",
					constraint: "Use literal selectors before setup"
				}] }) : undefined;
				const config = this.#field("config");
				this.config = insertions === 0 ? undefined : isRecord(config) ? config : {};
			}
			#map(node) {
				const map = this.#yaml.resolve(node);
				return isMap(map) ? map : undefined;
			}
			#id(node) {
				const id = this.#yaml.value(this.#yaml.field(this.#map(node), "id"));
				if (id instanceof CordisExpression) throw new ConfigurationError("Expression-backed Cordis IDs have unknown ownership; use literal IDs before changing registrations");
				return id;
			}
			#field(key) {
				return this.#yaml.value(this.#fields.get(key));
			}
			#readFields(map, omitted = new Set()) {
				for (const pair of map.items) {
					const key = this.#yaml.value(pair.key);
					if (typeof key === "string" && !omitted.has(key)) this.#fields.set(key, pair.value);
				}
			}
			get carriesEntry() {
				return this.#operations.some((op) => op.direct || op.ownedRows.length > 0);
			}
			get hasUnknownStructure() {
				return this.#unknownStructure;
			}
			get editabilityError() {
				return this.#editabilityError;
			}
			get ready() {
				const disabled = this.#field("disabled");
				return this.#insertions === 1 && this.#editabilityError === undefined && this.#field("name") === "@deepseek-ai/dsh-mcp-client" && (disabled === undefined || disabled === false);
			}
			/** Validate literals without treating expression source as an environment value. */
			environment(overrides = {}, validation = "effective") {
				const config = this.#field("config");
				if (config instanceof CordisExpression) return err(new ConfigurationError("Expression-backed Cordis config cannot be safely edited", { settings: [{
					setting: "config",
					constraint: "Use a literal mapping to preserve caller fields during setup"
				}] }));
				if (config !== undefined && !isRecord(config)) return err(new ConfigurationError("Cordis REA config must be a mapping", { settings: [{
					setting: "config",
					constraint: "Use a literal mapping before setup"
				}] }));
				const raw = this.config?.env;
				if (raw !== undefined && !isRecord(raw)) return err(new ConfigurationError("Cordis server environment must be a mapping"));
				const literals = {};
				const unresolvedSettings = new Set();
				for (const [key, value] of Object.entries(raw ?? {})) {
					if (value instanceof CordisExpression) {
						if (overrides[key] === undefined) unresolvedSettings.add(key);
						continue;
					}
					if (typeof value !== "string") return err(new ConfigurationError("Invalid Cordis server environment", { settings: [{
						setting: `env.${key}`,
						constraint: "Environment values must be strings or Cordis expressions"
					}] }));
					literals[key] = value;
				}
				const environment = {
					...literals,
					...overrides
				};
				const validated = validation === "fragment" ? parseEnvironmentValues(environment) : parseEnvironment(environment, unresolvedSettings);
				return validated.ok ? ok(environment) : validated;
			}
			desired(command, overrides) {
				if (this.#editabilityError !== undefined) return err(this.#editabilityError);
				const environment = this.environment(overrides);
				if (!environment.ok) return environment;
				const env = {
					...isRecord(this.config?.env) ? this.config.env : {},
					...overrides
				};
				const desired = {
					...this.config,
					...dshClientRegistrationEntry(command)
				};
				delete desired.env;
				if (Object.keys(env).length > 0) desired.env = env;
				return ok(desired);
			}
			/** Plan every replacement from source snapshots before changing an output tree. */
			serialize(desired) {
				if (this.#editabilityError !== undefined && (this.#unknownStructure || desired !== undefined)) throw this.#editabilityError;
				const root = this.#yaml.document.contents;
				if (!isSeq(root)) throw new ConfigurationError("Cordis patches must be a list");
				const replacements = new Map();
				const invalidated = new Set(this.#operations.flatMap((op) => op.direct || op.ownedRows.length > 0 ? this.#yaml.anchors(op.source) : []));
				let carried = false;
				for (const op of this.#operations) {
					if (op.direct) {
						replacements.set(op.source, undefined);
						continue;
					}
					if (op.ownedRows.length === 0) continue;
					const copy = this.#yaml.detach(op.map, invalidated);
					if (!isMap(copy)) throw new ConfigurationError("Cordis operation is not a mapping");
					const inserted = this.#yaml.detach(this.#yaml.resolve(this.#yaml.field(op.map, "insert")), invalidated);
					if (!isSeq(inserted)) throw new ConfigurationError("Cordis insertion is not a list");
					copy.set("insert", inserted);
					const owned = new Set(op.ownedRows);
					inserted.items = inserted.items.flatMap((entry, index) => {
						if (!owned.has(index)) return [entry];
						if (carried || desired === undefined) return [];
						carried = true;
						return [this.#entry(desired, invalidated)];
					});
					if (inserted.items.length === 0) copy.delete("insert");
					const kept = inserted.items.length > 0 || this.#id(op.map) !== "rea-mcp" && copy.items.some((pair) => !SELECTOR_KEYS.has(this.#yaml.value(pair.key)));
					replacements.set(op.source, kept ? copy : undefined);
				}
				const output = this.#yaml.document.clone();
				const outputRoot = output.contents;
				if (!isSeq(outputRoot)) throw new ConfigurationError("Cordis patches must be a list");
				outputRoot.items = root.items.flatMap((source) => {
					const copy = replacements.has(source) ? replacements.get(source) : this.#yaml.copy(source, invalidated);
					return copy === undefined ? [] : [copy];
				});
				if (!carried && desired !== undefined) outputRoot.items.push(output.createNode({ insert: [{
					id: DSH_ENTRY_ID,
					name: DSH_CLIENT_PACKAGE,
					config: desired
				}] }));
				return output.toString({ lineWidth: 0 });
			}
			#entry(desired, invalidated) {
				const entry = this.#yaml.detach(this.#entryNode, invalidated);
				if (!isMap(entry)) throw new ConfigurationError("Cordis entry is not a mapping");
				this.#yaml.setValue(entry, "id", DSH_ENTRY_ID);
				this.#yaml.setValue(entry, "name", DSH_CLIENT_PACKAGE);
				entry.delete("disabled");
				for (const [key, value] of this.#fields) {
					if ([
						"id",
						"name",
						"config",
						"disabled"
					].includes(key)) continue;
					entry.set(key, this.#yaml.detach(value, invalidated));
				}
				const sourceConfig = this.#map(this.#fields.get("config"));
				const config = sourceConfig === undefined ? this.#yaml.document.createNode({}) : this.#yaml.detach(sourceConfig, invalidated);
				if (!isMap(config)) throw new ConfigurationError("Cordis registration config is not a mapping");
				for (const key of LAUNCHER_KEYS) this.#yaml.setValue(config, key, desired[key]);
				const env = this.#map(this.#yaml.field(sourceConfig, "env"));
				const desiredEnv = desired.env;
				if (isRecord(desiredEnv)) {
					const nextEnv = env === undefined ? this.#yaml.document.createNode({}) : this.#yaml.detach(env, invalidated);
					if (!isMap(nextEnv)) throw new ConfigurationError("Cordis environment is not a mapping");
					for (const [key, value] of Object.entries(desiredEnv)) {
						this.#yaml.setValue(nextEnv, key, value);
					}
					config.set("env", nextEnv);
				} else config.delete("env");
				entry.set("config", config);
				return entry;
			}
		};
		DshCordisEdit = class {
			source;
			desired;
			constructor(source, desired) {
				this.source = source;
				this.desired = desired;
			}
		};
		dshDocument = (document) => {
			if (!(document.cordis instanceof DshCordisDocument)) throw new ConfigurationError("Missing Cordis document owner");
			return document.cordis;
		};
		parseDshCordisDocument = (text) => {
			const source = new DshCordisDocument(text);
			return {
				document: { cordis: source },
				servers: source.config === undefined ? {} : { rea: source.config },
				serversPath: [],
				dialect: "dsh",
				legacyServers: {}
			};
		};
		editDshDocument = (parsed, desired) => ({ cordis: new DshCordisEdit(dshDocument(parsed.document), desired) });
		serializeDshDocument = (document) => {
			if (!(document.cordis instanceof DshCordisEdit)) throw new ConfigurationError("Missing Cordis edit plan");
			return document.cordis.source.serialize(document.cordis.desired);
		};
		dshClientRegistrationEntry = (command, environment = {}) => {
			const [executable = "rea", ...args] = command;
			return {
				serverName: "rea",
				transport: "stdio",
				command: executable,
				args,
				...Object.keys(environment).length === 0 ? {} : { env: { ...environment } }
			};
		};
	})))();
}

//#endregion
//#region dist/application/HermesConfigurationYaml.js
var SOURCE_SCALAR_TAGS, timestampTag, timestampSource, hermesTimestampImplicit, floorDivide, civilDay, parseHermesTimestamp, numericValue, numericValuesEqual, sameResolvedScalarValue, keepScalarSource, createHermesYamlOptions, stringifyHermesConfigurationYaml, isEmptyYamlRoot, parseHermesDocument, parseHermesConfigurationYaml, editHermesConfigurationYaml;
function init_HermesConfigurationYaml() {
	return (init_HermesConfigurationYaml = __esmMin((() => {
		SOURCE_SCALAR_TAGS = new Set([
			"tag:yaml.org,2002:int",
			"tag:yaml.org,2002:float",
			"tag:yaml.org,2002:timestamp"
		]);
		timestampTag = new Schema({ schema: "yaml-1.1" }).tags.find((tag) => tag.tag === "tag:yaml.org,2002:timestamp" && tag.collection === undefined);
		if (timestampTag === undefined) throw new Error("The YAML 1.1 schema must provide its timestamp tag");
		timestampSource = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:(?:[Tt]|[ \t]+)(\d{1,2}):(\d{2}):(\d{2})(?:\.([0-9]*))?(?:[ \t]*(Z|([-+])(\d{1,2})(?::(\d{2}))?))?)?$/;
		hermesTimestampImplicit = /^(?:\d{4}-\d{2}-\d{2}|\d{4}-\d{1,2}-\d{1,2}(?:[Tt]|[ \t]+)\d{1,2}:\d{2}:\d{2}(?:\.[0-9]*)?(?:[ \t]*(?:Z|[-+]\d{1,2}(?::\d{2})?))?)$/;
		floorDivide = (value, divisor) => Math.floor(value / divisor);
		civilDay = (year, month, day) => {
			const adjustedYear = year - (month <= 2 ? 1 : 0);
			const era = floorDivide(adjustedYear, 400);
			const yearOfEra = adjustedYear - era * 400;
			const adjustedMonth = month + (month > 2 ? -3 : 9);
			const dayOfYear = floorDivide(153 * adjustedMonth + 2, 5) + day - 1;
			const dayOfEra = yearOfEra * 365 + floorDivide(yearOfEra, 4) - floorDivide(yearOfEra, 100) + dayOfYear;
			return era * 146097 + dayOfEra - 719468;
		};
		parseHermesTimestamp = (source) => {
			const match = timestampSource.exec(source);
			if (match === null) return undefined;
			const [, yearText, monthText, dayText, hourText, minuteText, secondText, fraction, zone, sign, zoneHourText, zoneMinuteText] = match;
			if (yearText === undefined || monthText === undefined || dayText === undefined) return undefined;
			const year = Number(yearText);
			const month = Number(monthText);
			const dayOfMonth = Number(dayText);
			if (year < 1 || year > 9999 || month < 1 || month > 12) return undefined;
			const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
			const monthDays = [
				31,
				leapYear ? 29 : 28,
				31,
				30,
				31,
				30,
				31,
				31,
				30,
				31,
				30,
				31
			];
			if (dayOfMonth < 1 || dayOfMonth > (monthDays[month - 1] ?? 0)) return undefined;
			const date = `${yearText}-${monthText.padStart(2, "0")}-${dayText.padStart(2, "0")}`;
			const day = civilDay(year, month, dayOfMonth);
			if (hourText === undefined) {
				const micros = BigInt(day) * 86400000000n;
				return {
					key: `date:${date}`,
					value: new Date(Number(micros / 1000n))
				};
			}
			const hour = Number(hourText);
			const minute = Number(minuteText);
			const second = Number(secondText);
			if (hour > 23 || minute > 59 || second > 59) return undefined;
			const zoneHour = Number(zoneHourText ?? 0);
			const zoneMinute = Number(zoneMinuteText ?? 0);
			if (zoneHour > 23 || zoneMinute > 59) return undefined;
			let microseconds = 0;
			if (fraction !== undefined && fraction.length > 0) {
				microseconds = Number((fraction.slice(0, 6) + "000000").slice(0, 6));
				if (fraction.length > 6 && Number(fraction[6]) > 4) microseconds += 1;
			}
			const wholeSeconds = hour * 3600 + minute * 60 + second;
			if (year === 9999 && month === 12 && dayOfMonth === 31 && wholeSeconds === 86399 && microseconds === 1e6) return undefined;
			let micros = BigInt(day) * 86400000000n + BigInt(wholeSeconds) * 1000000n + BigInt(microseconds);
			if (zone !== undefined && zone !== "Z") {
				const offset = (zoneHour * 60 + zoneMinute) * (sign === "+" ? 1 : -1);
				micros -= BigInt(offset) * 60000000n;
			}
			return {
				key: zone === undefined ? `datetime-local:${micros}` : `datetime-utc:${micros}`,
				value: new Date(Number(micros / 1000n - (micros % 1000n < 0n ? 1n : 0n)))
			};
		};
		numericValue = (value) => {
			if (typeof value === "boolean") return value ? 1n : 0n;
			if (typeof value === "bigint" || typeof value === "number") return value;
			return undefined;
		};
		numericValuesEqual = (left, right) => {
			if (typeof left === "bigint" && typeof right === "bigint") return left === right;
			if (typeof left === "number" && typeof right === "number") return left === right || Number.isNaN(left) && Number.isNaN(right);
			const integer = typeof left === "bigint" ? left : right;
			const number = typeof left === "number" ? left : right;
			return Number.isFinite(number) && Number.isInteger(number) && BigInt(number) === integer;
		};
		sameResolvedScalarValue = (left, right) => Object.is(left, right) || left instanceof Date && right instanceof Date && left.getTime() === right.getTime();
		keepScalarSource = (tag) => {
			if (typeof tag === "string" || tag.collection !== undefined) return tag;
			const { stringify } = tag;
			if (!SOURCE_SCALAR_TAGS.has(tag.tag) || stringify === undefined) return tag;
			return {
				...tag,
				stringify: (item, context, ...rest) => {
					const { source } = item;
					if (source === undefined) return stringify(item, context, ...rest);
					const reader = context.doc.schema.tags.find((candidate) => candidate.default === true && candidate.test?.test(source) === true);
					const read = reader?.resolve(source, () => undefined, context.doc.options);
					return sameResolvedScalarValue(isScalar(read) ? read.value : read, item.value) ? source : stringify(item, context, ...rest);
				}
			};
		};
		createHermesYamlOptions = () => {
			const timestamps = new Map();
			const timestampFacts = (source) => {
				if (timestamps.has(source)) return timestamps.get(source);
				const facts = parseHermesTimestamp(source);
				timestamps.set(source, facts);
				return facts;
			};
			const hermesTimestampTag = {
				...timestampTag,
				test: hermesTimestampImplicit,
				resolve: (source) => {
					const facts = timestampFacts(source);
					if (facts === undefined) throw new Error(`Invalid Hermes YAML timestamp: ${source}`);
					return facts.value;
				}
			};
			const keyFacts = new WeakMap();
			const hermesKey = (node) => {
				const cached = keyFacts.get(node);
				if (cached !== undefined) return cached;
				if (!isScalar(node)) return {
					kind: "other",
					value: node
				};
				const numeric = numericValue(node.value);
				const key = numeric !== undefined ? {
					kind: "numeric",
					value: numeric
				} : node.value instanceof Date ? {
					kind: "timestamp",
					value: timestampFacts(node.source ?? "")?.key ?? `invalid:${node.source ?? ""}`
				} : {
					kind: "other",
					value: node.value
				};
				keyFacts.set(node, key);
				return key;
			};
			/** Python dict key equality is Hermes' duplicate-key behavior (bool is int). */
			const hermesKeysEqual = (leftNode, rightNode) => {
				const left = hermesKey(leftNode);
				const right = hermesKey(rightNode);
				if (left.kind !== right.kind) return false;
				if (left.kind === "numeric" && right.kind === "numeric") return numericValuesEqual(left.value, right.value);
				return left.value === right.value;
			};
			return {
				version: "1.1",
				intAsBigInt: true,
				customTags: (tags) => {
					const hasTimestamp = tags.some((tag) => typeof tag !== "string" && tag.tag === timestampTag.tag);
					const withHermesTimestamp = hasTimestamp ? tags.map((tag) => typeof tag !== "string" && tag.tag === timestampTag.tag ? hermesTimestampTag : tag) : [...tags, hermesTimestampTag];
					return withHermesTimestamp.map(keepScalarSource);
				},
				uniqueKeys: hermesKeysEqual
			};
		};
		stringifyHermesConfigurationYaml = (document) => new Document(document, createHermesYamlOptions()).toString({ lineWidth: 0 });
		isEmptyYamlRoot = (root) => root === null || isScalar(root) && root.value === null && root.source === "" && root.tag === undefined && root.anchor === undefined;
		parseHermesDocument = (text) => {
			const document = parseDocument(text, createHermesYamlOptions());
			const error = document.errors[0];
			if (error !== undefined) throw error;
			return document;
		};
		parseHermesConfigurationYaml = (text) => {
			const document = parseHermesDocument(text);
			return isEmptyYamlRoot(document.contents) ? {} : document.toJS({ reviver: (_key, value) => typeof value === "bigint" ? Number(value) : value });
		};
		editHermesConfigurationYaml = (text, path, value) => {
			const document = parseHermesDocument(text);
			const root = document.contents;
			if (isEmptyYamlRoot(root)) {
				const map = document.createNode({});
				if (isScalar(root)) map.commentBefore = [root.commentBefore, root.comment].filter((comment) => comment !== undefined).join("\n");
				document.contents = map;
			}
			if (value === undefined) document.deleteIn(path);
			else {
				for (let length = 1; length < path.length; length++) {
					const parent = path.slice(0, length);
					if (!document.hasIn(parent)) document.setIn(parent, document.createNode({}));
				}
				document.setIn(path, value);
			}
			return document.toString({ lineWidth: 0 });
		};
	})))();
}

//#endregion
//#region dist/application/ClientConfigurationDocument.js
var objectSchema, clientConfigurationValuesEqual, normalizeConfigurationValue, clientConfigurationServersKey, isEmptyClientConfigurationText, parseDocument$1, ClientConfigurationShapeError, requireObject, parseZcodeFallbackConfiguration, OPENCODE_V2_MCP_SETTINGS, parseClientConfiguration, effectiveClientServer, withClientServers, valueAt, TOML_BASIC_ESCAPES, skipHorizontalSpace, decodeBasicEscape, parseQuotedKey, parseBareKey, parseTomlTableHeader, tomlStringModeAfter, closeMultiline, isBlankOrComment, looksLikeTomlHeader, isTomlServerTable, parseKeyPath, parseAssignment, skipWsAndComments, endOfTomlValue, endOfContainer, tomlBasicString, tomlInlineKey, tomlInlineValue, readTrivia, commasOutsideComments, hasSeparatorComma, editInlineServerTable, rebuildInlineTable, rebuildDelimitedEntries, tomlStringValue, tomlArrayWithoutString, disabledServerListEdit, disabledServerListLines, upsertTomlServerSection, tomlServerEntry, grokServerListedDisabled, OMP_DISABLED_SERVERS_KEY, ompServerListedDisabled, OMP_ENABLED_SERVERS_KEY, clientServerForcedEnabled, clientServerListedDisabled, serializeGrokConfiguration, withoutEmptyServerTable, serializeCodexConfiguration, tomlTextHolds, commentsBetweenProperties, deleteJsonPropertyPreservingComments, serializeClientConfiguration, clientServerPath, legacyClientServerPath, serializeHermesConfiguration, clientRegistrationEntry, parseGeminiMcpPolicy, normalizeGeminiServerName, geminiServerPolicyBlock;
function init_ClientConfigurationDocument() {
	return (init_ClientConfigurationDocument = __esmMin((() => {
		init_DshCordisPatch();
		init_HermesConfigurationYaml();
		init_identity();
		init_unicodeCodePointOrder();
		objectSchema = z.record(z.string(), z.unknown());
		clientConfigurationValuesEqual = (left, right) => isDeepStrictEqual(normalizeConfigurationValue(left), normalizeConfigurationValue(right));
		normalizeConfigurationValue = (value) => {
			if (Array.isArray(value)) return value.map(normalizeConfigurationValue);
			if (typeof value !== "object" || value === null || value instanceof Date) return value;
			return Object.fromEntries(Object.entries(value).sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([key, nested]) => [key, normalizeConfigurationValue(nested)]));
		};
		clientConfigurationServersKey = (format) => {
			switch (format) {
				case "toml":
				case "grok":
				case "hermes": return "mcp_servers";
				case "opencode":
				case "zcode": return "mcp";
				case "vscode": return "servers";
				default: return "mcpServers";
			}
		};
		isEmptyClientConfigurationText = (text) => text.replace(/^\uFEFF/, "").trim() === "";
		parseDocument$1 = (text, format) => {
			if (format === "toml" || format === "grok") return requireObject(parse$1(text), "The configuration root");
			if (format === "pi" || format === "kimi") {
				if (format === "kimi" && text.trim().length === 0) return {};
				return requireObject(JSON.parse(text), "The configuration root");
			}
			if (isEmptyClientConfigurationText(text)) return {};
			if (format === "hermes") return requireObject(parseHermesConfigurationYaml(text), "The configuration root");
			if (format === "zcode") return requireObject(JSON.parse(text), "The configuration root");
			const errors = [];
			const jsonText = text.startsWith("﻿") ? ` ${text.slice(1)}` : text;
			const document = parse(jsonText, errors, { allowTrailingComma: true });
			const firstError = errors[0];
			if (firstError !== undefined) throw new SyntaxError(`Invalid JSON/JSONC at offset ${firstError.offset}: ${printParseErrorCode(firstError.error)}`);
			return requireObject(document, "The configuration root");
		};
		ClientConfigurationShapeError = class extends TypeError {};
		requireObject = (value, description) => {
			const parsed = objectSchema.safeParse(value);
			if (parsed.success) return parsed.data;
			throw new ClientConfigurationShapeError(`${description} must be an object`, { cause: parsed.error });
		};
		parseZcodeFallbackConfiguration = (text) => {
			const document = requireObject(JSON.parse(text), "ZCode fallback root");
			return {
				document,
				servers: document.mcpServers === undefined ? {} : requireObject(document.mcpServers, "ZCode fallback mcpServers"),
				serversPath: ["mcpServers"],
				dialect: "zcode_fallback",
				legacyServers: {}
			};
		};
		OPENCODE_V2_MCP_SETTINGS = new Set(["servers", "timeout"]);
		parseClientConfiguration = (text, format) => {
			if (format === undefined || format === "unsupported") throw new TypeError("client does not have a supported MCP config format");
			if (format === "zcode_fallback") return parseZcodeFallbackConfiguration(text);
			if (format === "dsh") return parseDshCordisDocument(text);
			const document = parseDocument$1(text, format);
			const serversKey = clientConfigurationServersKey(format);
			const value = document[serversKey];
			const servers = value === undefined ? {} : requireObject(value, `"${serversKey}"`);
			if (format === "zcode") {
				const nested = servers.servers;
				return {
					document,
					servers: nested === undefined ? {} : requireObject(nested, `"${serversKey}.servers"`),
					serversPath: [serversKey, "servers"],
					dialect: format,
					legacyServers: {}
				};
			}
			const native = servers.servers;
			if (format !== "opencode" || native === undefined || typeof native === "object" && native !== null && "type" in native && typeof native.type === "string") return {
				document,
				servers,
				serversPath: [serversKey],
				dialect: format,
				legacyServers: {}
			};
			return {
				document,
				servers: requireObject(native, `"${serversKey}.servers"`),
				serversPath: [serversKey, "servers"],
				dialect: "opencode_v2",
				legacyServers: Object.fromEntries(Object.entries(servers).filter(([name]) => !OPENCODE_V2_MCP_SETTINGS.has(name)))
			};
		};
		effectiveClientServer = (parsed, name) => Object.hasOwn(parsed.servers, name) ? parsed.servers[name] : parsed.legacyServers[name];
		withClientServers = (parsed, servers, removeLegacy) => {
			if (parsed.dialect === "dsh") return Object.hasOwn(servers, PRODUCT_IDENTITY.mcpServerKey) ? editDshDocument(parsed, objectSchema.parse(servers[PRODUCT_IDENTITY.mcpServerKey])) : editDshDocument(parsed);
			const [key = "", nested] = parsed.serversPath;
			if (nested === undefined) return {
				...parsed.document,
				[key]: servers
			};
			const outerValue = parsed.document[key];
			const outer = outerValue === undefined ? {} : { ...objectSchema.parse(outerValue) };
			if (parsed.dialect === "opencode_v2" && removeLegacy !== undefined && !OPENCODE_V2_MCP_SETTINGS.has(removeLegacy)) delete outer[removeLegacy];
			return {
				...parsed.document,
				[key]: {
					...outer,
					[nested]: servers
				}
			};
		};
		valueAt = (document, path) => {
			let current = document;
			for (const key of path) {
				const object = objectSchema.safeParse(current);
				if (!object.success || !Object.hasOwn(object.data, key)) return undefined;
				current = object.data[key];
			}
			return current;
		};
		TOML_BASIC_ESCAPES = {
			b: "\b",
			t: "	",
			n: "\n",
			f: "\f",
			r: "\r",
			e: "\x1B",
			"\"": "\"",
			"\\": "\\"
		};
		skipHorizontalSpace = (line, index) => {
			let next = index;
			while (line[next] === " " || line[next] === "	") next += 1;
			return next;
		};
		decodeBasicEscape = (line, slash) => {
			const escape = line[slash + 1];
			if (escape === undefined) return undefined;
			const simple = TOML_BASIC_ESCAPES[escape];
			if (simple !== undefined) return {
				value: simple,
				next: slash + 2
			};
			if (escape === "x") {
				const hex = line.slice(slash + 2, slash + 4);
				if (!/^[0-9A-Fa-f]{2}$/u.test(hex)) return undefined;
				return {
					value: String.fromCodePoint(Number.parseInt(hex, 16)),
					next: slash + 4
				};
			}
			if (escape !== "u" && escape !== "U") return undefined;
			const length = escape === "u" ? 4 : 8;
			const hex = line.slice(slash + 2, slash + 2 + length);
			if (!new RegExp(`^[0-9A-Fa-f]{${String(length)}}$`, "u").test(hex)) return undefined;
			const code = Number.parseInt(hex, 16);
			if (code > 1114111 || code >= 55296 && code <= 57343) return undefined;
			return {
				value: String.fromCodePoint(code),
				next: slash + 2 + length
			};
		};
		parseQuotedKey = (line, start) => {
			const quote = line[start];
			if (quote !== "\"" && quote !== "'" || line.startsWith(quote === "\"" ? "\"\"\"" : "'''", start)) return undefined;
			if (quote === "'") {
				const end = line.indexOf("'", start + 1);
				if (end < 0 || line.slice(start + 1, end).includes("\n")) return undefined;
				return {
					value: line.slice(start + 1, end),
					next: end + 1
				};
			}
			let value = "";
			let index = start + 1;
			while (index < line.length) {
				const char = line[index];
				if (char === "\n" || char === "\r") return undefined;
				if (char === "\"") return {
					value,
					next: index + 1
				};
				if (char !== "\\") {
					value += char ?? "";
					index += 1;
					continue;
				}
				const decoded = decodeBasicEscape(line, index);
				if (decoded === undefined) return undefined;
				value += decoded.value;
				index = decoded.next;
			}
			return undefined;
		};
		parseBareKey = (line, start) => {
			let index = start;
			while (/[A-Za-z0-9_-]/u.test(line[index] ?? "")) index += 1;
			if (index === start) return undefined;
			return {
				value: line.slice(start, index),
				next: index
			};
		};
		parseTomlTableHeader = (line) => {
			let index = skipHorizontalSpace(line, 0);
			const array = line.startsWith("[[", index);
			if (!array && line[index] !== "[") return undefined;
			index += array ? 2 : 1;
			const path = [];
			for (;;) {
				index = skipHorizontalSpace(line, index);
				const key = line[index] === "\"" || line[index] === "'" ? parseQuotedKey(line, index) : parseBareKey(line, index);
				if (key === undefined) return undefined;
				path.push(key.value);
				index = skipHorizontalSpace(line, key.next);
				if (line[index] !== ".") break;
				index += 1;
			}
			const close = array ? "]]" : "]";
			if (!line.startsWith(close, index)) return undefined;
			index = skipHorizontalSpace(line, index + close.length);
			if (index < line.length && line[index] !== "#") return undefined;
			return { path };
		};
		tomlStringModeAfter = (line, mode, start = 0) => {
			if (mode === "ml-basic" || mode === "ml-literal") {
				const delimiter = mode === "ml-basic" ? "\"\"\"" : "'''";
				const closed = closeMultiline(line, start, delimiter, mode === "ml-basic");
				if (closed === undefined) return mode;
				return tomlStringModeAfter(line, "none", closed);
			}
			let index = start;
			while (index < line.length) {
				if (line[index] === "#") return "none";
				if (line.startsWith("\"\"\"", index)) {
					const closed = closeMultiline(line, index + 3, "\"\"\"", true);
					if (closed === undefined) return "ml-basic";
					index = closed;
					continue;
				}
				if (line.startsWith("'''", index)) {
					const closed = closeMultiline(line, index + 3, "'''", false);
					if (closed === undefined) return "ml-literal";
					index = closed;
					continue;
				}
				const quote = line[index];
				if (quote === "\"" || quote === "'") {
					const quoted = parseQuotedKey(line, index);
					if (quoted === undefined) return "none";
					index = quoted.next;
					continue;
				}
				index += 1;
			}
			return "none";
		};
		closeMultiline = (line, start, delimiter, escapes) => {
			let index = start;
			while (index < line.length) {
				if (escapes && line[index] === "\\") {
					if (line[index + 1] === undefined) return undefined;
					index += 2;
					continue;
				}
				if (line.startsWith(delimiter, index)) {
					let end = index + delimiter.length;
					const quote = delimiter[0];
					let extra = 0;
					while (extra < 2 && line[end] === quote) {
						extra += 1;
						end += 1;
					}
					return end;
				}
				index += 1;
			}
			return undefined;
		};
		isBlankOrComment = (line) => {
			const trimmed = line.trimStart();
			return trimmed === "" || trimmed.startsWith("#");
		};
		looksLikeTomlHeader = (line) => line.trimStart().startsWith("[");
		isTomlServerTable = (path, serverKey) => path[0] === "mcp_servers" && path[1] === serverKey;
		parseKeyPath = (text, start) => {
			const segments = [];
			let index = start;
			for (;;) {
				index = skipHorizontalSpace(text, index);
				const current = text[index];
				if (current === undefined || current === "\n" || current === "\r") return undefined;
				const key = current === "\"" || current === "'" ? parseQuotedKey(text, index) : parseBareKey(text, index);
				if (key === undefined) return undefined;
				segments.push(key.value);
				index = skipHorizontalSpace(text, key.next);
				if (text[index] !== ".") return {
					segments,
					next: index
				};
				index += 1;
			}
		};
		parseAssignment = (line) => {
			const key = parseKeyPath(line, 0);
			if (key === undefined) return undefined;
			const equals = skipHorizontalSpace(line, key.next);
			if (line[equals] !== "=") return undefined;
			return {
				segments: key.segments,
				equals
			};
		};
		skipWsAndComments = (text, start) => {
			let index = start;
			while (index < text.length) {
				const char = text[index];
				if (char === " " || char === "	" || char === "\n" || char === "\r") {
					index += 1;
					continue;
				}
				if (char === "#") {
					while (index < text.length && text[index] !== "\n") index += 1;
					continue;
				}
				return index;
			}
			return index;
		};
		endOfTomlValue = (text, start) => {
			const index = skipWsAndComments(text, start);
			if (index >= text.length) return index;
			if (text.startsWith("\"\"\"", index)) {
				const closed = closeMultiline(text, index + 3, "\"\"\"", true);
				return closed ?? text.length;
			}
			if (text.startsWith("'''", index)) {
				const closed = closeMultiline(text, index + 3, "'''", false);
				return closed ?? text.length;
			}
			const quote = text[index];
			if (quote === "\"" || quote === "'") {
				const quoted = parseQuotedKey(text, index);
				return quoted === undefined ? text.length : quoted.next;
			}
			if (quote === "{" || quote === "[") return endOfContainer(text, index);
			let cursor = index;
			while (cursor < text.length) {
				const char = text[cursor];
				if (char === "\n" || char === "#" || char === "," || char === "}" || char === "]") break;
				cursor += 1;
			}
			return cursor;
		};
		endOfContainer = (text, open) => {
			const closers = [text[open] === "{" ? "}" : "]"];
			let index = open + 1;
			while (index < text.length && closers.length > 0) {
				if (text.startsWith("\"\"\"", index)) {
					const closed = closeMultiline(text, index + 3, "\"\"\"", true);
					if (closed === undefined) return text.length;
					index = closed;
					continue;
				}
				if (text.startsWith("'''", index)) {
					const closed = closeMultiline(text, index + 3, "'''", false);
					if (closed === undefined) return text.length;
					index = closed;
					continue;
				}
				const quote = text[index];
				if (quote === "\"" || quote === "'") {
					const quoted = parseQuotedKey(text, index);
					if (quoted === undefined) return text.length;
					index = quoted.next;
					continue;
				}
				if (quote === "#") {
					while (index < text.length && text[index] !== "\n") index += 1;
					continue;
				}
				if (quote === "{" || quote === "[") {
					closers.push(quote === "{" ? "}" : "]");
					index += 1;
					continue;
				}
				if (quote === closers[closers.length - 1]) {
					closers.pop();
					index += 1;
					continue;
				}
				index += 1;
			}
			return index;
		};
		tomlBasicString = (value) => JSON.stringify(value).replaceAll("", "\\u007f");
		tomlInlineKey = (key) => /^[A-Za-z0-9_-]+$/u.test(key) ? key : tomlBasicString(key);
		tomlInlineValue = (value) => {
			if (typeof value === "string") return tomlBasicString(value);
			if (typeof value === "boolean") return value ? "true" : "false";
			if (typeof value === "number" && Number.isFinite(value)) return String(value);
			if (Array.isArray(value)) return `[${value.map((item) => tomlInlineValue(item)).join(", ")}]`;
			if (typeof value === "object" && value !== null) {
				const body = Object.entries(value).map(([key, nested]) => `${tomlInlineKey(key)} = ${tomlInlineValue(nested)}`).join(", ");
				return `{ ${body} }`;
			}
			return "\"\"";
		};
		readTrivia = (text, start, limit) => {
			let index = start;
			while (index < limit) {
				const char = text[index];
				if (char === " " || char === "	" || char === "\n" || char === "\r" || char === ",") {
					index += 1;
					continue;
				}
				if (char === "#") {
					while (index < limit && text[index] !== "\n") index += 1;
					continue;
				}
				break;
			}
			return {
				text: text.slice(start, index),
				next: index
			};
		};
		commasOutsideComments = (trivia) => trivia.split("\n").map((part) => {
			const comment = part.indexOf("#");
			if (comment < 0) return part.replaceAll(",", "");
			return `${part.slice(0, comment).replaceAll(",", "")}${part.slice(comment)}`;
		}).join("\n");
		hasSeparatorComma = (trivia) => trivia.split("\n").some((part) => {
			const comment = part.indexOf("#");
			const code = comment < 0 ? part : part.slice(0, comment);
			return code.includes(",");
		});
		editInlineServerTable = (table, serverKey, entry) => {
			if (!table.startsWith("{")) return undefined;
			const end = endOfContainer(table, 0);
			if (table[end - 1] !== "}") return undefined;
			const pairs = [];
			let index = 1;
			let trailing = "";
			while (index < end - 1) {
				const trivia = readTrivia(table, index, end - 1);
				if (trivia.next >= end - 1) {
					trailing = trivia.text;
					break;
				}
				const key = parseKeyPath(table, trivia.next);
				if (key === undefined) return undefined;
				const equals = skipWsAndComments(table, key.next);
				if (table[equals] !== "=") return undefined;
				const valueEnd = endOfTomlValue(table, equals + 1);
				if (valueEnd > end - 1) return undefined;
				pairs.push({
					leading: trivia.text,
					text: table.slice(trivia.next, valueEnd),
					drop: key.segments[0] === serverKey
				});
				index = valueEnd;
			}
			const insertion = entry === undefined ? undefined : `${tomlInlineKey(serverKey)} = ${tomlInlineValue(entry)}`;
			if (insertion === undefined && pairs.every((pair) => !pair.drop)) return table;
			return rebuildInlineTable(pairs, trailing, insertion);
		};
		rebuildInlineTable = (pairs, trailing, insertion) => rebuildDelimitedEntries(pairs, trailing, insertion, "{", "}");
		rebuildDelimitedEntries = (pairs, trailing, insertion, open, close) => {
			const parts = [open];
			let emitted = false;
			let separatorPending = false;
			for (const pair of pairs) {
				if (pair.drop) {
					if (!pair.leading.includes("#")) continue;
					const dropped = !emitted || separatorPending ? commasOutsideComments(pair.leading) : pair.leading;
					parts.push(dropped);
					separatorPending = separatorPending || hasSeparatorComma(dropped);
					continue;
				}
				const kept = emitted ? pair.leading : commasOutsideComments(pair.leading);
				parts.push(separatorPending ? commasOutsideComments(kept) : kept);
				if (emitted && !separatorPending && !pair.leading.includes(",")) parts.push(", ");
				separatorPending = false;
				parts.push(pair.text);
				emitted = true;
			}
			if (insertion !== undefined) {
				if (!(emitted && separatorPending)) parts.push(emitted ? ", " : " ");
				parts.push(insertion);
				emitted = true;
			}
			if (!emitted) {
				const retained = `${parts.slice(1).join("")}${commasOutsideComments(trailing)}`;
				return retained.includes("#") ? `${open}${retained}${close}` : `${open}${close}`;
			}
			const tail = commasOutsideComments(trailing);
			parts.push(tail);
			if (tail === "" && open === "{") parts.push(" ");
			parts.push(close);
			return parts.join("");
		};
		tomlStringValue = (text) => {
			try {
				const value = parse$1(`value = ${text}`)["value"];
				return typeof value === "string" ? value : undefined;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		tomlArrayWithoutString = (array, serverKey) => {
			if (!array.startsWith("[")) return undefined;
			const end = endOfContainer(array, 0);
			if (end !== array.length || array[end - 1] !== "]") return undefined;
			const pairs = [];
			let index = 1;
			let trailing = "";
			while (index < end - 1) {
				const trivia = readTrivia(array, index, end - 1);
				if (trivia.next >= end - 1) {
					trailing = trivia.text;
					break;
				}
				const valueEnd = endOfTomlValue(array, trivia.next);
				if (valueEnd > end - 1) return undefined;
				const text = array.slice(trivia.next, valueEnd);
				pairs.push({
					leading: trivia.text,
					text,
					drop: tomlStringValue(text) === serverKey
				});
				index = valueEnd;
			}
			if (pairs.every((pair) => !pair.drop)) return array;
			const rebuilt = rebuildDelimitedEntries(pairs, trailing, undefined, "[", "]");
			return rebuilt === "[]" ? "" : rebuilt;
		};
		disabledServerListEdit = (input) => {
			if (input.entry === undefined || input.tablePath.length !== 0 || input.segments.length !== 1 || input.segments[0] !== "disabled_mcp_servers") return { kind: "ignore" };
			const open = skipWsAndComments(input.text, input.valueOffset);
			if (input.text[open] !== "[") return { kind: "ignore" };
			const arrayText = input.text.slice(open, input.valueEnd);
			const edited = tomlArrayWithoutString(arrayText, input.serverKey);
			if (edited === undefined || edited === arrayText) return { kind: "keep" };
			if (edited === "") {
				const suffix = input.text.slice(input.valueEnd, input.statementEnd);
				const hash = suffix.indexOf("#");
				return {
					kind: "delete",
					comment: hash < 0 ? undefined : suffix.slice(hash)
				};
			}
			return {
				kind: "replace",
				text: `${input.text.slice(input.lineStart, open)}${edited}${input.text.slice(input.valueEnd, input.statementEnd)}`
			};
		};
		disabledServerListLines = (edit, lines, lineIndex, endLine) => {
			switch (edit.kind) {
				case "ignore": return undefined;
				case "keep": return lines.slice(lineIndex, endLine + 1);
				case "replace": return edit.text.split("\n");
				case "delete": return edit.comment === undefined ? [] : [edit.comment];
				default: {
					const unreachable = edit;
					return unreachable;
				}
			}
		};
		upsertTomlServerSection = (originalText, serverKey, entry, format) => {
			const bom = originalText.startsWith("﻿");
			const source = bom ? originalText.slice(1) : originalText;
			const crlf = source.includes("\r\n") && !source.replaceAll("\r\n", "").includes("\n");
			const text = source;
			const lines = text.split("\n");
			const lineStarts = [];
			let cursor = 0;
			for (const line of lines) {
				lineStarts.push(cursor);
				cursor += line.length + 1;
			}
			const kept = [];
			const pending = [];
			let skipping = false;
			let inlineServerTable = false;
			let mode = "none";
			let tablePath = [];
			const discardPending = () => {
				pending.length = 0;
			};
			const flushPending = () => {
				kept.push(...pending);
				pending.length = 0;
			};
			const lineIndexAt = (offset) => {
				let line = 0;
				for (let index = 0; index < lineStarts.length; index += 1) if ((lineStarts[index] ?? 0) <= offset) line = index;
				return line;
			};
			let lineIndex = 0;
			while (lineIndex < lines.length) {
				const physical = lines[lineIndex] ?? "";
				const line = physical.endsWith("\r") ? physical.slice(0, -1) : physical;
				if (mode !== "none") {
					mode = tomlStringModeAfter(line, mode);
					if (skipping) discardPending();
					else kept.push(physical);
					lineIndex += 1;
					continue;
				}
				const header = parseTomlTableHeader(line);
				if (header !== undefined) {
					tablePath = header.path;
					if (isTomlServerTable(header.path, serverKey)) {
						discardPending();
						skipping = true;
						lineIndex += 1;
						continue;
					}
					skipping = false;
					flushPending();
					kept.push(physical);
					lineIndex += 1;
					continue;
				}
				const assignment = parseAssignment(line);
				if (assignment !== undefined) {
					const lineStart = lineStarts[lineIndex] ?? 0;
					const valueOffset = lineStart + assignment.equals + 1;
					const valueEnd = endOfTomlValue(text, valueOffset);
					let statementEnd = valueEnd;
					while (statementEnd < text.length && text[statementEnd] !== "\n") statementEnd += 1;
					const endLine = lineIndexAt(Math.max(statementEnd - 1, lineStart));
					if (skipping) {
						discardPending();
						lineIndex = endLine + 1;
						mode = "none";
						continue;
					}
					const disabledLines = format === "grok" ? disabledServerListLines(disabledServerListEdit({
						text,
						lineStart,
						valueOffset,
						valueEnd,
						statementEnd,
						tablePath,
						segments: assignment.segments,
						serverKey,
						entry
					}), lines, lineIndex, endLine) : undefined;
					if (disabledLines !== undefined) {
						flushPending();
						kept.push(...disabledLines);
						lineIndex = endLine + 1;
						mode = "none";
						continue;
					}
					const absolute = [...tablePath, ...assignment.segments];
					const open = skipWsAndComments(text, valueOffset);
					const closesServerTable = absolute.length === 1 && absolute[0] === "mcp_servers" && text[open] === "{";
					if (closesServerTable || isTomlServerTable(absolute, serverKey)) {
						if (closesServerTable) {
							flushPending();
							const edited = editInlineServerTable(text.slice(open, valueEnd), serverKey, entry);
							const prefix = text.slice(lineStart, open);
							const suffix = text.slice(valueEnd, statementEnd);
							const replacement = edited === undefined ? text.slice(lineStart, statementEnd) : `${prefix}${edited}${suffix}`;
							kept.push(...replacement.split("\n"));
							inlineServerTable = true;
						} else discardPending();
					} else {
						flushPending();
						for (let index = lineIndex; index <= endLine; index += 1) kept.push(lines[index] ?? "");
					}
					lineIndex = endLine + 1;
					mode = "none";
					continue;
				}
				if (isBlankOrComment(line)) {
					if (format === "toml" && line.trimStart().startsWith("#")) {
						flushPending();
						kept.push(physical);
					} else pending.push(physical);
					lineIndex += 1;
					continue;
				}
				mode = tomlStringModeAfter(line, "none");
				if (skipping) {
					if (looksLikeTomlHeader(line)) {
						flushPending();
						skipping = false;
						tablePath = ["\0"];
						kept.push(physical);
					} else discardPending();
				} else {
					flushPending();
					kept.push(physical);
				}
				lineIndex += 1;
			}
			if (!skipping) flushPending();
			let body = kept.join("\n");
			if (body.endsWith("\r")) body += "\n";
			if (entry !== undefined && !inlineServerTable) {
				let fragment = stringify({ mcp_servers: { [serverKey]: entry } }).replace(/\n+$/u, "");
				if (crlf) fragment = fragment.replaceAll("\n", "\r\n");
				const nl = crlf ? "\r\n" : "\n";
				const endedWithNewline = body.endsWith("\n");
				const base = body.replace(/\n+$/u, "");
				const trimmed = endedWithNewline && base.endsWith("\r") ? base.slice(0, -1) : base;
				body = trimmed.length === 0 ? `${fragment}${nl}` : `${trimmed}${nl}${nl}${fragment}${nl}`;
			}
			return bom ? `\uFEFF${body}` : body;
		};
		tomlServerEntry = (document, serverKey) => {
			const servers = objectSchema.safeParse(document.mcp_servers);
			if (!servers.success || !Object.hasOwn(servers.data, serverKey)) return undefined;
			return servers.data[serverKey];
		};
		grokServerListedDisabled = (document, serverKey) => Array.isArray(document.disabled_mcp_servers) && document.disabled_mcp_servers.includes(serverKey);
		OMP_DISABLED_SERVERS_KEY = "disabledServers";
		ompServerListedDisabled = (document, serverKey) => {
			const listed = document[OMP_DISABLED_SERVERS_KEY];
			return Array.isArray(listed) && listed.includes(serverKey);
		};
		OMP_ENABLED_SERVERS_KEY = "enabledServers";
		clientServerForcedEnabled = (parsed, serverKey) => {
			if (parsed.dialect !== "omp") return false;
			const listed = parsed.document[OMP_ENABLED_SERVERS_KEY];
			return Array.isArray(listed) && listed.includes(serverKey);
		};
		clientServerListedDisabled = (parsed, serverKey) => parsed.dialect === "grok" && grokServerListedDisabled(parsed.document, serverKey) || parsed.dialect === "omp" && ompServerListedDisabled(parsed.document, serverKey);
		serializeGrokConfiguration = (document, originalText) => {
			const entry = tomlServerEntry(document, PRODUCT_IDENTITY.mcpServerKey);
			if (originalText === undefined) return stringify(document);
			return upsertTomlServerSection(originalText, PRODUCT_IDENTITY.mcpServerKey, entry, "grok");
		};
		withoutEmptyServerTable = (document) => {
			const servers = objectSchema.safeParse(document.mcp_servers);
			if (!servers.success || Object.keys(servers.data).length > 0) return document;
			const { mcp_servers: empty, ...rest } = document;
			void empty;
			return rest;
		};
		serializeCodexConfiguration = (document, originalText) => {
			if (originalText === undefined || isEmptyClientConfigurationText(originalText)) return stringify(document);
			const upserted = upsertTomlServerSection(originalText, PRODUCT_IDENTITY.mcpServerKey, tomlServerEntry(document, PRODUCT_IDENTITY.mcpServerKey), "toml");
			const edited = originalText.endsWith("\n") && !upserted.endsWith("\n") ? `${upserted}${originalText.endsWith("\r\n") ? "\r\n" : "\n"}` : upserted;
			return tomlTextHolds(edited, document) ? edited : stringify(document);
		};
		tomlTextHolds = (text, document) => {
			try {
				return clientConfigurationValuesEqual(withoutEmptyServerTable(objectSchema.parse(parse$1(text))), withoutEmptyServerTable(document));
			} catch (cause) {
				void cause;
				return false;
			}
		};
		commentsBetweenProperties = (gap) => {
			const pieces = [];
			let index = 0;
			while (index < gap.length) {
				const line = gap.indexOf("//", index);
				const block = gap.indexOf("/*", index);
				if (line < 0 && block < 0) break;
				const start = line < 0 ? block : block < 0 ? line : Math.min(line, block);
				const lineComment = start === line;
				const close = lineComment ? gap.indexOf("\n", start) : gap.indexOf("*/", start + 2);
				if (!lineComment && close < 0) return undefined;
				const end = lineComment ? close < 0 ? gap.length : close : close + 2;
				const comment = gap.slice(start, end);
				const lineBreak = gap.lastIndexOf("\n", start - 1);
				if (lineBreak < 0) pieces.push(` ${comment}`);
				else {
					const prefix = gap.slice(lineBreak + 1, start);
					let indentEnd = 0;
					while (prefix[indentEnd] === " " || prefix[indentEnd] === "	") indentEnd += 1;
					const newline = lineBreak > 0 && gap[lineBreak - 1] === "\r" ? "\r\n" : "\n";
					pieces.push(`${newline}${prefix.slice(0, indentEnd)}${comment}`);
				}
				index = end;
			}
			return pieces.length === 0 ? undefined : pieces.join("");
		};
		deleteJsonPropertyPreservingComments = (text, path) => {
			const root = parseTree(text, [], { allowTrailingComma: true });
			const value = root === undefined ? undefined : findNodeAtLocation(root, [...path]);
			const property = value?.parent;
			const parent = property?.parent;
			if (property === undefined || parent?.type !== "object" || property.type !== "property" || parent.children === undefined) return undefined;
			const propertyIndex = parent.children.indexOf(property);
			const previous = parent.children[propertyIndex - 1];
			if (propertyIndex <= 0 || previous === undefined) return undefined;
			const comments = commentsBetweenProperties(text.slice(previous.offset + previous.length, property.offset));
			if (comments === undefined) return undefined;
			let removeEnd = property.offset + property.length;
			const hasNext = parent.children[propertyIndex + 1] !== undefined;
			if (hasNext) {
				let comma = removeEnd;
				while (comma < text.length) {
					const char = text[comma];
					if (char === " " || char === "	" || char === "\r" || char === "\n") {
						comma += 1;
						continue;
					}
					if (text.startsWith("/*", comma)) {
						const close = text.indexOf("*/", comma + 2);
						if (close < 0) return undefined;
						comma = close + 2;
						continue;
					}
					if (text.startsWith("//", comma)) {
						while (comma < text.length && text[comma] !== "\n" && text[comma] !== "\r") comma += 1;
						continue;
					}
					break;
				}
				if (text[comma] !== ",") return undefined;
				removeEnd = comma + 1;
			}
			const remainder = text.slice(removeEnd);
			let suffix = `${hasNext ? "," : ""}${comments}`;
			if (suffix.includes("//") && !suffix.endsWith("\n") && !suffix.endsWith("\r") && !remainder.startsWith("\n") && !remainder.startsWith("\r")) suffix += "\n";
			return `${text.slice(0, previous.offset + previous.length)}${suffix}${remainder}`;
		};
		serializeClientConfiguration = (document, format, originalText, editedPaths) => {
			if (format === undefined || format === "unsupported") throw new TypeError("client does not have a supported MCP config format");
			if (format === "toml") return serializeCodexConfiguration(document, originalText);
			if (format === "grok") return serializeGrokConfiguration(document, originalText);
			if (format === "hermes") return serializeHermesConfiguration(document, originalText);
			if (format === "dsh") return serializeDshDocument(document);
			if (originalText !== undefined && !isEmptyClientConfigurationText(originalText) && editedPaths !== undefined) return editedPaths.reduce((text, path) => {
				const value = valueAt(document, path);
				if (value === undefined) {
					const preserved = deleteJsonPropertyPreservingComments(text, path);
					if (preserved !== undefined) return preserved;
				}
				return applyEdits(text, modify(text, [...path], value, { formattingOptions: {
					insertSpaces: true,
					tabSize: 2,
					eol: "\n"
				} }));
			}, originalText);
			return `${JSON.stringify(document, null, 2)}\n`;
		};
		clientServerPath = (parsed, name) => [...parsed.serversPath, name];
		legacyClientServerPath = (parsed, name) => Object.hasOwn(parsed.legacyServers, name) ? [parsed.serversPath[0] ?? "mcp", name] : undefined;
		serializeHermesConfiguration = (document, originalText) => {
			if (originalText === undefined || isEmptyClientConfigurationText(originalText)) return stringifyHermesConfigurationYaml(document);
			const serversKey = clientConfigurationServersKey("hermes");
			const servers = document[serversKey];
			const entry = typeof servers === "object" && servers !== null ? servers[PRODUCT_IDENTITY.mcpServerKey] : undefined;
			return editHermesConfigurationYaml(originalText, [serversKey, PRODUCT_IDENTITY.mcpServerKey], entry);
		};
		clientRegistrationEntry = (format, command, environment) => {
			const [executable = "rea", ...args] = command;
			switch (format) {
				case "opencode": return {
					type: "local",
					command: [...command],
					enabled: true,
					...Object.keys(environment).length === 0 ? {} : { environment: { ...environment } }
				};
				case "kimi": return {
					command: executable,
					args,
					...Object.keys(environment).length === 0 ? {} : { env: environment }
				};
				case "opencode_v2": return {
					type: "local",
					command: [...command],
					...Object.keys(environment).length === 0 ? {} : { environment: { ...environment } }
				};
				case "vscode":
				case "omp":
				case "pi": return {
					type: "stdio",
					command: executable,
					args,
					...Object.keys(environment).length === 0 ? {} : { env: environment }
				};
				case "copilot_cli": return {
					type: "stdio",
					command: executable,
					args,
					tools: ["*"],
					...Object.keys(environment).length === 0 ? {} : { env: environment }
				};
				case "commandcode": return {
					transport: "stdio",
					enabled: true,
					command: executable,
					args,
					...Object.keys(environment).length === 0 ? {} : { env: environment }
				};
				case "dsh": return dshClientRegistrationEntry(command, environment);
				case "hermes": return {
					command: executable,
					args,
					...Object.keys(environment).length === 0 ? {} : { env: environment },
					enabled: true
				};
				default: return {
					command: executable,
					args,
					...Object.keys(environment).length === 0 ? {} : { env: environment }
				};
			}
		};
		parseGeminiMcpPolicy = (parsed) => z.object({
			allowed: z.array(z.string()).optional(),
			excluded: z.array(z.string()).optional()
		}).passthrough().parse(parsed.document.mcp ?? {});
		normalizeGeminiServerName = (name) => name.toLowerCase().trim();
		geminiServerPolicyBlock = (policies, serverKey) => {
			const key = normalizeGeminiServerName(serverKey);
			if (policies.some(({ excluded }) => excluded?.some((name) => normalizeGeminiServerName(name) === key))) return `Gemini mcp.excluded blocks ${serverKey}. Review the selected settings policies before rerunning setup.`;
			const allowlists = policies.flatMap(({ allowed }) => allowed === undefined ? [] : [allowed]);
			const allowed = allowlists.reduce((previous, current) => {
				if (previous === undefined) return current;
				const normalized = new Set(current.map(normalizeGeminiServerName));
				return previous.filter((name) => normalized.has(normalizeGeminiServerName(name)));
			}, undefined);
			if (allowed !== undefined && allowed.length > 0 && !allowed.some((name) => normalizeGeminiServerName(name) === key)) return `Gemini mcp.allowed does not include ${serverKey}. Review the selected settings policies before rerunning setup.`;
			return undefined;
		};
	})))();
}

//#endregion
export { ClientConfigurationShapeError, DshCordisDocument, MANAGED_SKILL_FILES, OMP_DISABLED_SERVERS_KEY, canonicalSkillNeedsInstall, clientConfigurationValuesEqual, clientRegistrationEntry, clientServerForcedEnabled, clientServerListedDisabled, clientServerPath, dshDocument, effectiveClientServer, existingSkillDestinations, geminiServerPolicyBlock, init_ClientConfigurationDocument, init_DshCordisPatch, init_SetupRecoveryBackup, init_SetupSkill, installCanonicalSkill, isManagedSkillManifest, legacyClientServerPath, parseClientConfiguration, parseGeminiMcpPolicy, parseZcodeFallbackConfiguration, preserveRecoveryBackup, readInstalledSkillIdentity, readSkillFile, selectCurrentRecoveryBackup, serializeClientConfiguration, skillDestinations, validateCanonicalSkillDirectories, withClientServers };