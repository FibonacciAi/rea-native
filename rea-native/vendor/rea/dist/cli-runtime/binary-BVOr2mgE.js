import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { analysisInputErrorFromIssues, analysisProfileSchema, analysisProfilesEqual, analysisProviderIdSchema, analysisProviderSelectorSchema, analysisStringSchema, compareUnicodeCodePoints, createAnalysisProfile, createEvidence, createEvidenceBundle, createImmutableEvidenceBundle, createResidualUnknown, describeEvidenceBundleFailure, err, evidenceBundleForTarget, functionBodyEntryAgrees, functionBodySchema, functionDossierSchema, functionInstructionWindowSchema, immutableEvidence, init_analysisProfile, init_binaryTargetTypes, init_evidence, init_evidenceBundle, init_hopperValues, init_inputIssueProjection, init_machoCpuIdentity, init_nativeApiBoundary, init_nativeInstruction, init_nativeValueFlow, init_providerSelection, init_relationshipCoverage, init_residualUnknown, init_result, init_unicodeCodePointOrder, isElfMetadataArchitecture, isMachOFormat, machoCpuSubtypeBase, nativeApiBoundarySchema, nativeCallTargetsSchema, nativeInstructionSchema, nativeValueFlowSchema, ok, parseEvidenceBundle, projectInputIssues, relationshipCoverageSchema, updateResidualUnknown, validateResidualUnknownAddition } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { NATIVE_TOOL_CONTRACTS, init_nativeToolContracts } from "./cutterToolContracts-TZH9EHr5.js";
import { AnalysisAccessDeniedError, AnalysisArtifactChangedError, AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisError, AnalysisInputError, AnalysisOutputError, AnalysisProtocolError, AnalysisResourceConstraintError, AnalysisTimeoutError, AnalysisUnsupportedTargetError, BinaryTargetError, ConfigurationError, NoBinaryOpenError, init_analysisErrorBase, init_analysisErrorCore, init_configurationErrors, init_jsonValue, init_providerOperationHealth, jsonObjectSchema, jsonValueSchema, providerRetryAction, sharedProviderFailureStage } from "./errorSchemas-CTRmvMl3.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-BXkffc1D.js";
import { OwnedFileHandle, RegularFileAdmissionFailure, RegularFileChangedError, init_OwnedFileHandle, init_RegularFile, openRegularFile, sameRegularFileState } from "./RegularFile-B_6KPCNQ.js";
import { createAnalysisExecution, init_AnalysisProvider } from "./AnalysisProvider-D0Us2OTk.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-DQWTcUwE.js";
import { ProviderAdapterError, init_providerAdapterError } from "./providerAdapterError-DAjhICdr.js";
import { AnalysisSnapshotMismatchError, EvidenceFileError, EvidenceIntegrityError, HopperCancelledError, HopperProcessError, HopperProtocolError, HopperRemoteError, HopperStartError, HopperTimeoutError, ProviderSelectionError, UnknownRegistryError, hopperStartupFailure, init_evidenceErrors, init_hopperErrors, init_hopperStartupFailure, init_providerSelectionError, init_unknownRegistryError } from "./analysisErrorPresentation-DGt7TdsH.js";
import { bufferedJsonParts, init_jsonSerialization } from "./cliResultOutput-DsRMI8CJ.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-Do6YeeoD.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-Ceq8f0wK.js";
import { ProviderProcessSupervisor, init_ProviderProcess, init_snapshotEnvironment, snapshotEnvironment, spawnOwnedProviderProcess } from "./snapshotEnvironment-D_tWyOub.js";
import { DarwinProcessOwnershipInspectionError, boundedUtf8Text, cleanupOwnedProcessGroup, cleanupWindowsProcessTree, init_DarwinProcessRunTokenReader, init_ProcessOwnership, init_ProcessOwnershipObservation, init_boundedUtf8Text, observeOwnedProcessLineage, observeProcessStartIdentity, observeProcessStartIdentityExit } from "./ProcessOwnership-DXC5-UWt.js";
import { execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-BEQs-lDD.js";
import { DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS, init_providerStartupTimeout } from "./providerStartupTimeout-B2tF2LtZ.js";
import { init_safeJson, safeParseJson } from "./safeJson-DKKACtdy.js";
import { ProviderStartupDeadline, init_ProviderDeadline, waitForAbortableDelay } from "./ProviderDeadline-8m2pFRDc.js";
import { PrivateRuntimeRoot, init_PrivateRuntimeRoot, init_WindowsAuthority, init_WindowsPrivateRuntime, inspectWindowsNativeReadiness, privateRuntimeRootCapability, readWindowsPrivateRuntimeFile, windowsNativeCapabilities, windowsPrivateRuntime } from "./PrivateRuntimeRoot-DAy0PiBM.js";
import { bytePatternFields, byteSearchResultSchema, init_bytePattern, init_nativeDataType, init_nativeFunctionAnnotations, init_nativeLoadImage, nativeDataTypeSchema, nativeFunctionAnnotationsInputSchema, nativeFunctionAnnotationsSchema, nativeLoadImageObservationSchema, nativeLoadImageSchema, validateBytePattern } from "./toolOutputSchemaGroups-DRiYs1je.js";
import { ARTIFACT_GRAPH_PROVIDER, MANAGED_STATIC_PROVIDER, init_InvestigationProviders } from "./InvestigationProviders-DoQRIHii.js";
import { init_BoundedFileBytes, readBoundedFileBytes } from "./BoundedFileBytes-BU30odTm.js";
import { RegularFileCleanupFailure, init_RegularFileRead } from "./RegularFileRead-DVlC5faM.js";
import { init_managedArtifact, managedArtifactInspectionSchema, managedNativeBoundaryInspectionSchema } from "./managedApplicationGraph-B08jb3jq.js";
import { init_machoContainer, readFatSliceDeclarations, validateFatSlice } from "./machoContainer-C8BIkkq3.js";
import { init_BinaryTargetResolver, parseBinaryTarget } from "./BinaryTargetResolver-CVIJ_s1A.js";
import { init_dosMz, parseDosMzHeader } from "./appleArchiveFormat-tVoI2ykA.js";
import { ABORTED, PendingOperations, WindowsBatchCommandError, init_AbortablePromise, init_PendingOperations, init_WindowsBatchCommand, quoteWindowsBatchToken, waitForAbortable, windowsBatchCommand } from "./AbortablePromise-BVBemxbD.js";
import { init_logger, silentLogger } from "./logger-CQQCI4a2.js";
import { MANAGED_TOOL_CONTRACTS, init_dosCom, init_managedToolContracts, managedMembersInputSchema, managedTargetInputSchema, validateDosComLength } from "./managedToolContracts-D60QmIYj.js";
import { ManagedReaderFailure, admitManagedProjection, hashManagedSource, init_ManagedDecodeBudget, init_ManagedMemberInspector, init_ManagedMetadataHeaps, init_ManagedMetadataInventory, init_ManagedMetadataLayout, init_ManagedPeReader, init_ManagedReaderFailure, init_ManagedSnapshot, init_ManagedTypeMemberLists, inspectManagedMembersBytes, managedCleanupError, managedCli32BitRequirement, managedDecodeBudget, managedTableRowCounts, metadataCodedToken, metadataCodedTokenInvalidReason, metadataRowCursor, metadataToken, readManagedMetadataInventory, readManagedMetadataLayout, readManagedPeLayout, readManagedResourceDirectory, readManagedSnapshot, readManagedValue, readMetadataString, readTypeMemberListFacts } from "./ManagedSnapshot-rqyBHcdL.js";
import { init_readFileHandleChunks, readFileHandleChunks } from "./readFileHandleChunks-dp60iZ6v.js";
import { ENHANCED_TOOL_CONTRACTS, TOOL_CONTRACTS, init_enhancedToolContracts, init_toolContracts } from "./toolContracts-D2FOG_Nb.js";
import { ARTIFACT_ANALYSIS_OPERATIONS, OFFICIAL_TOOL_CONTRACTS, analysisSearchInput, combineFunctionRelationshipCoverage, init_analysisSearchContract, init_artifactToolContracts, init_functionCallCoverage, init_officialToolContracts } from "./officialToolContracts-CCFF0an9.js";
import { AnalysisSnapshotCache, init_AnalysisSnapshotCache, init_AnalysisSnapshotFiles, init_analysisSnapshot, isSnapshotCacheable, requiresNativeSourceAdmissionBeforeReplay, snapshotMatchesBinding, snapshotMatchesTarget, snapshotTarget, writeAnalysisSnapshot } from "./AnalysisSnapshotCache-BXS0wRd2.js";
import { binarySessionStatus, init_BinarySessionStatus } from "./BinarySessionStatus-DnMxMk-r.js";
import { HOPPER_PUBLISHER, init_MacCodeSignature, init_hopperPublisher, macDeveloperIdRequirement } from "./MacCodeSignature-MgYbRK_H.js";
import { ghidraInstallationDiagnostics, ghidraJavaEnvironment, idaConfigurationError, idaProtocol, init_GhidraInstallation, init_GhidraInstallationPolicy, init_GhidraJavaProperties, init_IdaConfiguration, init_LinuxPrivateDisplayDiagnostic, init_LinuxPrivateDisplayProbe, inspectGhidraInstallation, parseGhidraJavaProperties, parseLinuxPrivateDisplayDiagnostic, readIdaConfiguration, selectLinuxPrivateDisplayStrategy, unverifiedGhidraBuildLimitation } from "./IdaConfiguration-CtGP7EKo.js";
import { ZodError, z } from "zod";
import { basename, dirname, extname, isAbsolute, join, normalize, posix, resolve, sep, win32 } from "node:path";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import canonicalize from "canonicalize";
import { promisify } from "node:util";
import { access, chmod, lstat, mkdir, open, opendir, readFile, readdir, realpath, rm, rmdir, writeFile } from "node:fs/promises";
import { accessSync, constants, createReadStream, statSync } from "node:fs";
import { ChildProcess, execFile } from "node:child_process";
import { Transform } from "node:stream";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { constants as constants$2 } from "node:buffer";
import { pipeline } from "node:stream/promises";
import { DOMParser, onWarningStopParsing } from "@xmldom/xmldom";
import { Client, ProtocolError, SdkErrorCode, SdkHttpError, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { Socket, createConnection, createServer } from "node:net";
import { DEFAULT_INHERITED_ENV_VARS, StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import writeFileAtomic from "write-file-atomic";
import { createScanner } from "jsonc-parser";
import { Worker } from "node:worker_threads";

//#region dist/artifacts/ArtifactProviderMetadata.js
var artifactCapabilities;
function init_ArtifactProviderMetadata() {
	return (init_ArtifactProviderMetadata = __esmMin((() => {
		init_InvestigationProviders();
		init_artifactToolContracts();
		artifactCapabilities = (platform = process.platform) => Object.freeze(ARTIFACT_ANALYSIS_OPERATIONS.map((operation) => {
			const common = {
				provider: ARTIFACT_GRAPH_PROVIDER,
				operation,
				effects: Object.freeze({
					mutatesArtifact: false,
					launchesProcess: operation !== "decode_interface_builder" && operation !== "inspect_keyed_archive" && operation !== "trace_dylib_resolution",
					mayShowUi: false,
					mayAccessNetwork: false,
					mayWriteFilesystem: operation === "extract_artifact" || operation === "inspect_artifact" || operation === "inventory_artifact",
					changesPermissions: false,
					requiresRoot: false
				}),
				limitations: Object.freeze(["DMG child inventory automatically uses a read-only native macOS mount; PKG remains root-hash-only.", "ASAR files discovered in filesystem-backed inventories are expanded without bulk extraction; other nested containers remain recorded only."])
			};
			return Object.freeze(operation === "inspect_asset_catalog" && platform !== "darwin" ? {
				...common,
				available: false,
				availabilityCode: "unsupported_host",
				reason: "Apple asset catalogs require macOS assetutil."
			} : {
				...common,
				available: true,
				reason: null
			});
		}));
	})))();
}

//#endregion
//#region dist/hopper/HopperMachOImage.js
var hopperMachOImageSchema, resolveHopperMachOImage, selectHopperSlice, prepareHopperMachOImage;
function init_HopperMachOImage() {
	return (init_HopperMachOImage = __esmMin((() => {
		init_configurationErrors();
		init_analysisErrorCore();
		init_machoContainer();
		init_machoCpuIdentity();
		init_hopperErrors();
		init_result();
		hopperMachOImageSchema = z.strictObject({
			method: z.union([z.literal("fat32_thin_slice"), z.literal("fat64_thin_slice")]),
			architecture_count: z.number().int().min(1).max(128),
			container_table_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			source_offset: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
			byte_length: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
			cpu_type: z.number().int().nonnegative(),
			cpu_subtype: z.number().int().nonnegative()
		});
		resolveHopperMachOImage = async (target, signal) => {
			const invalid = (reason, cause) => err(new BinaryTargetError(target.path, reason, cause === undefined ? undefined : { cause }));
			if (signal?.aborted) return err(new AnalysisCancelledError("open_binary"));
			if (target.format !== "mach-o" && target.format !== "mach-o-universal") return invalid("Hopper FAT image preparation requires a Mach-O target");
			let file;
			try {
				file = await open(target.path, "r");
			} catch (cause) {
				return invalid(`Cannot read FAT source for Hopper image preparation: ${cause instanceof Error ? cause.message : String(cause)}`, cause);
			}
			try {
				const read = async (offset, length) => {
					const bytes = Buffer.alloc(length);
					const { bytesRead } = await file.read(bytes, 0, length, offset);
					return bytes.subarray(0, bytesRead);
				};
				const header = await read(0, 8);
				const magic = header.length === 8 ? header.readUInt32BE(0) : 0;
				const isFatMagic = [
					3405691582,
					3405691583,
					3199925962,
					3216703178
				].includes(magic);
				if (!isFatMagic) return invalid("FAT source header changed before Hopper image preparation");
				const wide = magic === 3405691583 || magic === 3216703178;
				const littleEndian = magic === 3199925962 || magic === 3216703178;
				const entrySize = wide ? 32 : 20;
				const count = littleEndian ? header.readUInt32LE(4) : header.readUInt32BE(4);
				const size = (await file.stat()).size;
				const tableEnd = 8 + count * entrySize;
				if (count === 0 || count > 128 || tableEnd > size) return invalid("FAT architecture table is truncated or exceeds the supported 128 entries");
				const table = await read(8, count * entrySize);
				const parsed = readFatSliceDeclarations(table, {
					count,
					wide,
					littleEndian
				});
				if (parsed.status === "malformed") return invalid(parsed.reason);
				const cpuTypes = {
					x86: 7,
					x86_64: 16777223,
					arm: 12,
					arm64: 16777228
				};
				const matches = [];
				const ranges = [];
				for (const slice of parsed.slices) {
					if (signal?.aborted) return err(new AnalysisCancelledError("open_binary"));
					const rangeError = validateFatSlice(slice, size, tableEnd);
					if (rangeError !== null) return invalid(rangeError);
					if (wide) {
						const reserved = littleEndian ? table.readUInt32LE(slice.index * 32 + 28) : table.readUInt32BE(slice.index * 32 + 28);
						if (reserved !== 0) return invalid(`FAT64 architecture ${slice.index} has a nonzero reserved field`);
					}
					if (slice.size < 12) return invalid(`FAT architecture ${slice.index} has a truncated Mach-O header`);
					const embedded = await read(slice.offset, 12);
					if (embedded.length !== 12) return invalid(`FAT architecture ${slice.index} became truncated`);
					const thinMagic = embedded.readUInt32BE(0);
					if (![
						4277009102,
						4277009103,
						3472551422,
						3489328638
					].includes(thinMagic)) return invalid(`FAT architecture ${slice.index} does not contain a Mach-O image`);
					const little = thinMagic === 3472551422 || thinMagic === 3489328638;
					const identity = {
						cpuType: little ? embedded.readUInt32LE(4) : embedded.readUInt32BE(4),
						cpuSubtype: little ? embedded.readUInt32LE(8) : embedded.readUInt32BE(8)
					};
					const identityError = validateFatSlice(slice, size, tableEnd, identity);
					if (identityError !== null) return invalid(identityError);
					ranges.push(slice);
					if (slice.cpuType === cpuTypes[target.architecture]) matches.push(slice);
				}
				ranges.sort((a, b) => a.offset - b.offset);
				for (let index = 1; index < ranges.length; index++) {
					const previous = ranges[index - 1];
					const current = ranges[index];
					if (previous !== undefined && current !== undefined && current.offset < previous.offset + previous.size) return invalid("FAT slices overlap");
				}
				const selected = selectHopperSlice(matches, target.architecture);
				if (selected === undefined) return invalid(`FAT selection for ${target.architecture} is ${matches.length === 0 ? "missing" : "ambiguous"}; extract the exact architecture into a thin image before opening it`);
				return ok({
					method: wide ? "fat64_thin_slice" : "fat32_thin_slice",
					architecture_count: count,
					container_table_sha256: createHash("sha256").update(header).update(table).digest("hex"),
					source_offset: selected.offset,
					byte_length: selected.size,
					cpu_type: selected.cpuType,
					cpu_subtype: selected.cpuSubtype
				});
			} catch (cause) {
				return invalid(`Cannot validate FAT image: ${cause instanceof Error ? cause.message : String(cause)}`);
			} finally {
				await file.close();
			}
		};
		selectHopperSlice = (matches, architecture) => {
			if (matches.length === 1) return matches[0];
			if (architecture !== "arm64") return undefined;
			for (const cpuSubtype of [0, 2]) {
				const preferred = matches.filter((slice) => machoCpuSubtypeBase(slice.cpuSubtype) === cpuSubtype);
				if (preferred.length === 1) return preferred[0];
				if (preferred.length > 1) return undefined;
			}
			return undefined;
		};
		prepareHopperMachOImage = async (sourcePath, sourceSha256, image, destination, signal) => {
			if (signal?.aborted) return err(new HopperCancelledError());
			const tableEntrySize = image.method === "fat64_thin_slice" ? 32 : 20;
			try {
				const source = await open(sourcePath, "r");
				try {
					const output = await open(destination, "wx", 384);
					try {
						const hash = createHash("sha256");
						const tableHash = createHash("sha256");
						const tableEnd = 8 + image.architecture_count * tableEntrySize;
						const thinHeader = [];
						let position = 0;
						let copied = 0;
						for await (const chunk of source.createReadStream({ autoClose: false })) {
							if (signal?.aborted) return err(new HopperCancelledError());
							const bytes = Buffer.from(chunk);
							hash.update(bytes);
							if (position < tableEnd) tableHash.update(bytes.subarray(0, Math.min(bytes.length, tableEnd - position)));
							const start = Math.max(0, image.source_offset - position);
							const end = Math.min(bytes.length, image.source_offset + image.byte_length - position);
							if (end > start) {
								if (copied < 12) thinHeader.push(bytes.subarray(start, Math.min(end, start + 12 - copied)));
								await output.writeFile(bytes.subarray(start, end));
								copied += end - start;
							}
							position += bytes.length;
						}
						const observed = hash.digest("hex");
						const header = Buffer.concat(thinHeader);
						const magic = header.length === 12 ? header.readUInt32BE(0) : 0;
						const little = magic === 3472551422 || magic === 3489328638;
						const headerMatches = header.length === 12 && [
							4277009102,
							4277009103,
							3472551422,
							3489328638
						].includes(magic) && (little ? header.readUInt32LE(4) : header.readUInt32BE(4)) === image.cpu_type && (little ? header.readUInt32LE(8) : header.readUInt32BE(8)) === image.cpu_subtype;
						if (tableHash.digest("hex") !== image.container_table_sha256 || !headerMatches) return err(new HopperStartError({ userMessage: `FAT source ${sourcePath} no longer agrees with its committed architecture table or selected Mach-O header. Open the stable source again.` }));
						if (observed !== sourceSha256 || copied !== image.byte_length) return err(new HopperStartError({ userMessage: `FAT source ${sourcePath} changed before launch: expected SHA-256 ${sourceSha256}, observed ${observed}; copied ${copied} of ${image.byte_length} selected bytes. Open the stable source again.` }));
						return ok(destination);
					} finally {
						await output.close();
					}
				} finally {
					await source.close();
				}
			} catch (cause) {
				return signal?.aborted ? err(new HopperCancelledError()) : err(new HopperStartError({
					cause,
					userMessage: `Cannot prepare the selected FAT image from ${sourcePath}: ${cause instanceof Error ? cause.message : String(cause)}`
				}));
			}
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperTargetLease.js
var HOPPER_TARGET_LEASE_DIRECTORY, acquireHopperTargetLease, acquireLinuxHopperApplicationLease, acquireLease, reserveRecovery, tryAcquireLease, ensureLeaseDirectory, bind, sendOwner, readOwner, closeServer;
function init_HopperTargetLease() {
	return (init_HopperTargetLease = __esmMin((() => {
		init_hopperErrors();
		init_safeJson();
		HOPPER_TARGET_LEASE_DIRECTORY = join("/tmp", `rea-hopper-${process.getuid?.() ?? 0}`);
		acquireHopperTargetLease = async (input) => {
			let targetPath;
			try {
				targetPath = await realpath(input.targetPath);
			} catch (cause) {
				throw new HopperStartError({
					cause,
					userMessage: `REA could not resolve Hopper target ${JSON.stringify(input.targetPath)} to a canonical path before reserving the document. Confirm that the target exists and its path is accessible.`
				});
			}
			return acquireLease({
				...input,
				identity: {
					targetPath,
					targetKind: input.targetKind,
					loaderArgs: input.loaderArgs
				}
			});
		};
		acquireLinuxHopperApplicationLease = (input) => acquireLease({
			...input,
			identity: { application: "linux-hopper-demo" }
		});
		acquireLease = async (input) => {
			const directory = input.directory ?? HOPPER_TARGET_LEASE_DIRECTORY;
			await ensureLeaseDirectory(directory);
			const key = createHash("sha256").update(JSON.stringify(input.identity)).digest("hex").slice(0, 32);
			const socketPath = join(directory, `${key}.sock`);
			const owner = {
				runId: input.runId,
				processId: process.pid
			};
			const acquisition = await tryAcquireLease(socketPath, owner);
			if (typeof acquisition !== "string") return acquisition;
			const recoveryPath = `${socketPath}.recovery`;
			await reserveRecovery(recoveryPath);
			let recovered;
			try {
				recovered = await tryAcquireLease(socketPath, owner);
				if (recovered === "stale") await rm(socketPath, { force: true });
				if (typeof recovered === "string") recovered = await tryAcquireLease(socketPath, owner);
				if (typeof recovered !== "string") return recovered;
				throw new HopperStartError({ userMessage: "REA could not reserve Hopper for this request. Close competing REA sessions and retry." });
			} finally {
				try {
					await rmdir(recoveryPath);
				} catch (cause) {
					if (typeof recovered !== "string" && recovered?.acquired) await recovered.lease.release();
					throw new HopperStartError({
						cause,
						userMessage: `REA could not remove its Hopper recovery directory at ${JSON.stringify(recoveryPath)}. Check this directory's write access before retrying.`
					});
				}
			}
		};
		reserveRecovery = async (recoveryPath) => {
			try {
				await mkdir(recoveryPath, { mode: 448 });
			} catch (cause) {
				const busy = typeof cause === "object" && cause !== null && Reflect.get(cause, "code") === "EEXIST";
				throw new HopperStartError({
					cause,
					userMessage: busy ? `REA could not reserve Hopper lease recovery at ${JSON.stringify(recoveryPath)}; the existing socket was left unchanged. Retry after concurrent startup finishes. If recovery was interrupted, stop REA sessions and remove this recovery directory before retrying.` : `REA could not create its Hopper recovery directory at ${JSON.stringify(recoveryPath)}; the existing socket was left unchanged. Check the parent directory's write access before retrying.`
				});
			}
		};
		tryAcquireLease = async (socketPath, owner) => {
			const server = createServer((socket) => sendOwner(socket, owner));
			server.unref();
			if (!await bind(server, socketPath)) {
				const existingOwner = await readOwner(socketPath);
				return typeof existingOwner === "string" ? existingOwner : {
					acquired: false,
					owner: existingOwner
				};
			}
			try {
				await chmod(socketPath, 384);
			} catch (cause) {
				await closeServer(server);
				throw cause;
			}
			let released = false;
			return {
				acquired: true,
				lease: { release: async () => {
					if (released) return;
					await closeServer(server);
					released = true;
				} }
			};
		};
		ensureLeaseDirectory = async (directory) => {
			try {
				await mkdir(directory, {
					recursive: true,
					mode: 448
				});
			} catch (cause) {
				throw new HopperStartError({
					cause,
					userMessage: "REA could not create its private Hopper lease directory."
				});
			}
			let handle;
			try {
				handle = await open(directory, constants.O_RDONLY | (constants.O_DIRECTORY ?? 0) | (constants.O_NOFOLLOW ?? 0));
				const directoryStat = await handle.stat();
				if (directoryStat.isSymbolicLink() || directoryStat.isDirectory() === false || process.getuid !== undefined && directoryStat.uid !== process.getuid()) throw new HopperStartError({ userMessage: "REA's Hopper lease directory is not a private directory owned by this user." });
				const posixPermissionsApply = process.getuid !== undefined;
				if (posixPermissionsApply && (directoryStat.mode & 63) !== 0) {
					await handle.chmod(448);
					const afterChmod = await handle.stat();
					if (afterChmod.isSymbolicLink() || afterChmod.isDirectory() === false || (afterChmod.mode & 63) !== 0) throw new HopperStartError({ userMessage: "REA's Hopper lease directory permissions could not be secured." });
				}
			} catch (cause) {
				if (cause instanceof HopperStartError) throw cause;
				const accessDenied = process.getuid !== undefined && cause instanceof Error && "code" in cause && cause.code === "EACCES";
				throw new HopperStartError({
					cause,
					userMessage: accessDenied ? `REA could not access its Hopper lease directory at ${JSON.stringify(directory)}. Check its ownership and parent-directory access. For a directory you own, restore owner-only read, write, and search permissions (0700), then retry.` : "REA could not inspect its private Hopper lease directory."
				});
			} finally {
				await handle?.close();
			}
		};
		bind = (server, socketPath) => new Promise((resolveBind, reject) => {
			const onError = (error) => {
				server.removeListener("listening", onListening);
				if (error.code === "EADDRINUSE") resolveBind(false);
				else reject(error);
			};
			const onListening = () => {
				server.removeListener("error", onError);
				resolveBind(true);
			};
			server.once("error", onError);
			server.once("listening", onListening);
			server.listen(socketPath);
		});
		sendOwner = (socket, owner) => {
			socket.end(`${JSON.stringify(owner)}\n`);
		};
		readOwner = (socketPath) => new Promise((resolveOwner, rejectOwner) => {
			const socket = createConnection(socketPath);
			let response = "";
			let settled = false;
			const fail = (reason, cause) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				socket.destroy();
				rejectOwner(new HopperStartError({
					cause,
					userMessage: `REA could not verify the existing Hopper lease (${reason}); it was left unchanged. Retry when the owning REA session is responsive.`
				}));
			};
			const timer = setTimeout(() => fail("owner response timed out"), 250);
			const finish = (owner) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				socket.destroy();
				resolveOwner(owner);
			};
			socket.on("data", (chunk) => {
				response += chunk.toString("utf8");
				const newline = response.indexOf("\n");
				if (newline < 0) return;
				const parsed = safeParseJson(response.slice(0, newline));
				if (!parsed.ok) {
					fail("malformed owner response");
					return;
				}
				const value = parsed.value;
				const runId = typeof value === "object" && value !== null ? Reflect.get(value, "runId") : undefined;
				const processId = typeof value === "object" && value !== null ? Reflect.get(value, "processId") : undefined;
				if (typeof runId === "string" && runId.length > 0 && typeof processId === "number" && Number.isSafeInteger(processId) && processId > 0) finish({
					runId,
					processId
				});
				else fail("invalid owner identity");
			});
			socket.on("error", (cause) => {
				if (cause.code === "ENOENT") finish("missing");
				else if (cause.code === "ECONNREFUSED") finish("stale");
				else fail(cause.code ?? "owner connection failed", cause);
			});
			socket.on("end", () => fail("owner closed without a complete response"));
		});
		closeServer = (server) => new Promise((resolveClose, reject) => {
			if (!server.listening) {
				resolveClose();
				return;
			}
			server.close((error) => error ? reject(error) : resolveClose());
		});
	})))();
}

//#endregion
//#region dist/hopper/HopperSessionValues.js
var HOPPER_SHUTDOWN_TIMEOUT_MS, parseHopperServerInfo, isHopperShutdownAcknowledgement, isHopperCleanupRequired;
function init_HopperSessionValues() {
	return (init_HopperSessionValues = __esmMin((() => {
		init_hopperErrors();
		init_result();
		HOPPER_SHUTDOWN_TIMEOUT_MS = 3e4;
		parseHopperServerInfo = (value, expectedRunId) => {
			if (typeof value === "object" && value !== null && !Array.isArray(value) && value.name === "REA Hopper bridge" && typeof value.version === "string" && typeof value.process_id === "number" && Number.isSafeInteger(value.process_id) && value.process_id > 0 && value.run_id === expectedRunId) return ok({
				name: value.name,
				version: value.version,
				processId: value.process_id
			});
			return err(new HopperProtocolError("Hopper bridge health result is invalid"));
		};
		isHopperShutdownAcknowledgement = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
			if (value.shutdown !== true) return false;
			return value.analysis_stopped === true && value.document_closed === true || value.document_closed === false && value.document_retained === true;
		};
		isHopperCleanupRequired = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && value.shutdown === true && value.cleanup_required === true;
	})))();
}

//#endregion
//#region dist/hopper/HopperMacPublisher.js
var verifyMacHopperNativeHelper;
function init_HopperMacPublisher() {
	return (init_HopperMacPublisher = __esmMin((() => {
		init_hopperPublisher();
		init_MacCodeSignature();
		init_ExecFileOutput();
		verifyMacHopperNativeHelper = async (launcherPath, environment, signal) => {
			if (!launcherPath.includes("/")) return "unknown";
			try {
				await execFileOutput("/usr/bin/codesign", [
					"--verify",
					"--strict",
					`-R${macDeveloperIdRequirement("hopper", HOPPER_PUBLISHER.teamIdentifier)}`,
					launcherPath
				], {
					env: environment,
					...signal === undefined ? {} : { signal },
					timeout: 5e3,
					stopSignal: "SIGKILL"
				});
				return "verified";
			} catch (cause) {
				void cause;
				return "unknown";
			}
		};
	})))();
}

//#endregion
//#region dist/hopper/BridgeLauncher.js
var execFileAsync, HOPPER_BACKGROUND_STARTUP_MS, HopperApplicationLauncher, bridgeBootstrapSource, launchHopperProcess, linuxDemoLaunch, hopperLaunchFailure, usesLinuxDemo, prepareHopperApplication, hopperApplicationBundle, processIsRunning;
function init_BridgeLauncher() {
	return (init_BridgeLauncher = __esmMin((() => {
		init_hopperErrors();
		init_result();
		init_ProcessOwnership();
		init_ExecFileOutput();
		init_ProviderProcess();
		init_ProviderDeadline();
		init_LinuxPrivateDisplayProbe();
		init_HopperMachOImage();
		init_HopperTargetLease();
		init_HopperSessionValues();
		init_HopperMacPublisher();
		execFileAsync = promisify(execFile);
		HOPPER_BACKGROUND_STARTUP_MS = 5e3;
		HopperApplicationLauncher = class {
			options;
			dependencies;
			constructor(options, dependencies = {}) {
				this.options = options;
				this.dependencies = dependencies;
			}
			async launch(session, options = {}) {
				const leaseResult = await this.#acquireLaunchLease(session.runId);
				if (!leaseResult.ok) return leaseResult;
				const lease = leaseResult.value;
				let leaseTransferred = false;
				try {
					let loadedPath = this.options.targetPath;
					if (this.options.preparedImage !== undefined) {
						const prepared = await prepareHopperMachOImage(this.options.targetPath, this.options.preparedImage.sourceSha256, this.options.preparedImage.image, join(session.directory, "image.macho"), options.signal);
						if (!prepared.ok) return prepared;
						loadedPath = prepared.value;
					}
					const ownsProcessLifetime = usesLinuxDemo(this.options);
					const bootstrap = await this.#writeBootstrap(session, ownsProcessLifetime, loadedPath);
					if (!bootstrap.ok) return bootstrap;
					const launched = await this.#launchPreparedTarget({
						session,
						signal: options.signal,
						bootstrapPath: bootstrap.value,
						loadedPath,
						ownsProcessLifetime,
						lease
					});
					leaseTransferred = launched.ok;
					return launched;
				} finally {
					if (!leaseTransferred) await lease?.release();
				}
			}
			async #launchPreparedTarget(input) {
				const { session, signal, bootstrapPath, ownsProcessLifetime, lease } = input;
				const action = this.options.targetKind === "database" ? "--database" : "--executable";
				const argumentsForTarget = [
					...this.options.loaderArgs,
					"--analysis",
					"-Y",
					bootstrapPath,
					action,
					input.loadedPath
				];
				let launched = false;
				try {
					if (signal?.aborted === true) return err(new HopperCancelledError());
					const display = await this.#privateDisplay(signal);
					if (!display.ok) return err(display.error);
					const nativeHelperVerified = (this.dependencies.platform ?? process.platform) === "darwin" && this.options.launchMode === "native" && await (this.dependencies.verifyNativeHelper ?? verifyMacHopperNativeHelper)(this.options.launcherPath, this.options.environment, signal) === "verified";
					const prepared = await prepareHopperApplication(this.options.launcherPath, this.options.environment, signal);
					if (!prepared) return err(new HopperCancelledError());
					const linuxDemo = linuxDemoLaunch(this.options, session, argumentsForTarget, display.strategy);
					const started = await launchHopperProcess({
						options: this.options,
						session,
						bootstrapPath,
						ownsProcessLifetime,
						argumentsForTarget,
						linuxDemo,
						signal
					});
					if (started === null) return err(new HopperCancelledError());
					launched = true;
					const cleanup = () => cleanupOwnedProcessGroup(started.ownership);
					const ownedLauncher = {
						...this.options.preparedImage === undefined ? {} : { preparedImagePath: input.loadedPath },
						process: started.process,
						ownsProcessLifetime: true,
						ownership: started.ownership,
						cleanup,
						launcherCommand: linuxDemo?.command ?? this.options.launcherPath,
						...lease === undefined ? {} : { releaseLease: () => lease.release() }
					};
					return ownsProcessLifetime ? ok({
						...ownedLauncher,
						providerLifetime: "launcher-process",
						shutdownMode: "process-cleanup"
					}) : ok({
						...ownedLauncher,
						providerLifetime: "external-application",
						shutdownMode: "bridge-request",
						...nativeHelperVerified ? { nativeHelperVerified: true } : {},
						...(this.dependencies.platform ?? process.platform) === "darwin" && ![this.options.launcherPath, ...argumentsForTarget].some((value) => /["\\\r\n]/u.test(value)) ? { authorizationDenialBeforeHandoff: true } : {}
					});
				} catch (cause) {
					return err(hopperLaunchFailure(cause, signal));
				} finally {
					if (!launched) await rm(bootstrapPath, { force: true }).catch(() => undefined);
				}
			}
			async #acquireLaunchLease(runId) {
				const platform = this.dependencies.platform ?? process.platform;
				const applicationLease = platform === "linux" && usesLinuxDemo(this.options);
				if (!applicationLease && platform !== "darwin") return ok(undefined);
				try {
					const acquisition = applicationLease ? await (this.dependencies.acquireApplicationLease ?? acquireLinuxHopperApplicationLease)({ runId }) : await (this.dependencies.acquireTargetLease ?? acquireHopperTargetLease)({
						targetPath: this.options.targetPath,
						targetKind: this.options.targetKind,
						loaderArgs: this.options.loaderArgs,
						runId
					});
					if (!acquisition.acquired) return err(new HopperStartError({
						ownerRunId: acquisition.owner.runId,
						userMessage: applicationLease ? `Linux Hopper is already active in REA session ${acquisition.owner.runId}; it cannot open ${this.options.targetPath} in another session. This build forwards new launches to the existing application. Use the owning REA session to switch targets, or close it before retrying.` : `This Hopper target is already open in REA session ${acquisition.owner.runId}. ` + "Use that REA session or close it before opening this target again."
					}));
					return ok(acquisition.lease);
				} catch (cause) {
					return err(cause instanceof HopperStartError ? cause : new HopperStartError({ cause }));
				}
			}
			async #writeBootstrap(session, ownsProcessLifetime, loadedPath) {
				const bootstrapPath = `${session.directory}/bootstrap.py`;
				try {
					await writeFile(bootstrapPath, bridgeBootstrapSource(session, this.options, ownsProcessLifetime, loadedPath), {
						encoding: "utf8",
						mode: 384
					});
					await chmod(bootstrapPath, 384);
					return ok(bootstrapPath);
				} catch (cause) {
					await rm(bootstrapPath, { force: true }).catch(() => undefined);
					return err(new HopperStartError({ cause }));
				}
			}
			async #privateDisplay(signal) {
				if (!usesLinuxDemo(this.options)) return {
					ok: true,
					strategy: undefined
				};
				const selection = await (this.dependencies.selectPrivateDisplay ?? selectLinuxPrivateDisplayStrategy)({
					helperPath: this.options.demoHelperPath,
					environment: this.options.environment,
					...signal === undefined ? {} : { signal }
				});
				if (signal?.aborted === true) return {
					ok: false,
					error: new HopperCancelledError()
				};
				return selection.ok ? {
					ok: true,
					strategy: selection.strategy
				} : {
					ok: false,
					error: new HopperProcessError(selection.exitCode, { diagnostic: selection.diagnostic })
				};
			}
		};
		bridgeBootstrapSource = (session, options, ownsProcessLifetime, loadedPath) => [
			`REA_SOCKET = ${JSON.stringify(session.socketPath)}`,
			`REA_TOKEN = ${JSON.stringify(session.token)}`,
			`REA_RUN_ID = ${JSON.stringify(session.runId)}`,
			`REA_TARGET_PATH = ${JSON.stringify(loadedPath)}`,
			`REA_OWNS_PROCESS_LIFETIME = ${ownsProcessLifetime ? "True" : "False"}`,
			`REA_RECONNECT_TIMEOUT_SECONDS = ${HOPPER_SHUTDOWN_TIMEOUT_MS / 1e3}`,
			`exec(compile(open(${JSON.stringify(options.bridgeScriptPath)}, 'rb').read(), ${JSON.stringify(options.bridgeScriptPath)}, 'exec'))`,
			""
		].join("\n");
		launchHopperProcess = async (input) => {
			const ownershipCommand = input.linuxDemo?.ownershipCommand ?? input.options.launcherPath;
			const spawn = (arguments_) => spawnOwnedProviderProcess({
				command: input.options.launcherPath,
				arguments: arguments_,
				runId: input.session.runId,
				expectedCommand: ownershipCommand,
				hostEnvironment: input.options.environment,
				...input.signal === undefined ? {} : { signal: input.signal }
			});
			if (input.linuxDemo !== undefined) return spawnOwnedProviderProcess({
				command: input.linuxDemo.command,
				arguments: input.linuxDemo.args,
				runId: input.session.runId,
				expectedCommand: ownershipCommand,
				hostEnvironment: input.options.environment,
				stdin: "pipe",
				...input.signal === undefined ? {} : { signal: input.signal }
			});
			return spawn(input.argumentsForTarget);
		};
		linuxDemoLaunch = (options, session, hopperArgs, strategy) => {
			if (!usesLinuxDemo(options) || options.demoHelperPath === undefined) return undefined;
			const helperArguments = [
				options.demoHelperPath,
				"--owner-stdin",
				"--strategy",
				strategy ?? "direct",
				...strategy === "user-mount-namespace" ? ["--mount-private-x11"] : [],
				"--hopper",
				options.launcherPath,
				"--socket",
				session.socketPath,
				"--",
				options.launcherPath,
				...hopperArgs
			];
			if (strategy === "user-mount-namespace") return {
				command: "/usr/bin/unshare",
				ownershipCommand: "/usr/bin/python3",
				args: [
					"--user",
					"--map-root-user",
					"--mount",
					"--propagation",
					"private",
					"/usr/bin/python3",
					...helperArguments
				]
			};
			return {
				command: "/usr/bin/python3",
				ownershipCommand: "/usr/bin/python3",
				args: helperArguments
			};
		};
		hopperLaunchFailure = (cause, signal) => signal?.aborted === true ? new HopperCancelledError() : new HopperStartError({ cause });
		usesLinuxDemo = (options) => options.launchMode === "verified_linux_demo";
		prepareHopperApplication = async (launcherPath, environment, signal) => {
			const appBundle = hopperApplicationBundle(launcherPath);
			if (appBundle === undefined) return signal?.aborted !== true;
			const executablePath = join(appBundle, "Contents/MacOS/Hopper Disassembler");
			if (await processIsRunning(executablePath, environment)) return signal?.aborted !== true;
			await execFileAsync("/usr/bin/open", [
				"--hide",
				"--background",
				"-a",
				appBundle
			], { env: environment });
			return await waitForAbortableDelay(HOPPER_BACKGROUND_STARTUP_MS, signal) === "elapsed";
		};
		hopperApplicationBundle = (launcherPath) => {
			if (basename(launcherPath) !== "hopper") return undefined;
			const candidate = dirname(dirname(dirname(launcherPath)));
			return extname(candidate) === ".app" ? candidate : undefined;
		};
		processIsRunning = async (executablePath, environment) => {
			try {
				const processes = await execFileOutput("/bin/ps", [
					"-ax",
					"-o",
					"command="
				], { env: environment });
				return processes.stdout.split("\n").some((command) => command.trim() === executablePath);
			} catch (cause) {
				void cause;
				return false;
			}
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperAnalysisProfile.js
var resolveHopperAnalysisProfile, HOPPER_DECLINED_ARCHITECTURE_LABELS, hopperLoaderArgsForTarget, hopperArchitectureFlag, readMachoMagic, sha256File, signalIsAborted$2;
function init_HopperAnalysisProfile() {
	return (init_HopperAnalysisProfile = __esmMin((() => {
		init_analysisProfile();
		init_binaryTargetTypes();
		init_analysisErrorCore();
		init_configurationErrors();
		init_providerAdapterError();
		init_result();
		init_HopperMachOImage();
		resolveHopperAnalysisProfile = async (target, options) => {
			if (target.kind !== "executable" && target.kind !== "database") return ok({ profile: null });
			let machoContainer;
			if (target.kind === "executable" && isMachOFormat(target.format)) {
				const header = await readMachoMagic(target.path, options.signal);
				if (!header.ok) return header;
				machoContainer = [3405691583, 3216703178].includes(header.value) ? "fat64" : [3405691582, 3199925962].includes(header.value) ? "fat32" : "thin";
			}
			let preparedImage;
			if (target.kind === "executable" && (machoContainer === "fat64" || machoContainer === "fat32") && options.loaderArgsOverride.length === 0) {
				const resolved = await resolveHopperMachOImage(target, options.signal);
				if (!resolved.ok) return resolved;
				preparedImage = resolved.value;
			}
			const derived = hopperLoaderArgsForTarget(target, preparedImage === undefined ? machoContainer : "thin");
			if (!derived.ok) return derived;
			const loaderArgs = options.loaderArgsOverride.length === 0 ? derived.value : [...options.loaderArgsOverride];
			const launcherDigest = await sha256File(options.launcherPath, options.signal);
			if (!launcherDigest.ok) return launcherDigest;
			if (launcherDigest.value === undefined) return ok({ profile: null });
			const provider = {
				id: options.provider.id,
				name: options.provider.name,
				version: `launcher-sha256:${launcherDigest.value}`
			};
			return ok({ profile: createAnalysisProfile(provider, {
				target_kind: target.kind,
				target_format: target.format,
				function_dossier_coverage: "observed-facets-and-call-relationships-v1",
				architecture: target.architecture ?? null,
				available_architectures: [...target.availableArchitectures ?? []].sort(),
				...machoContainer === undefined ? {} : { macho_container: machoContainer },
				...preparedImage === undefined ? {} : { prepared_image: { ...preparedImage } },
				loader: {
					source: options.loaderArgsOverride.length === 0 ? "derived" : "configured_override",
					arguments: [...loaderArgs]
				}
			}) });
		};
		HOPPER_DECLINED_ARCHITECTURE_LABELS = {
			mips: "MIPS",
			riscv: "RISC-V",
			powerpc: "PowerPC"
		};
		hopperLoaderArgsForTarget = (target, machoContainer) => {
			if (target.kind === "database") return ok([]);
			if (target.kind !== "executable") return err(new ProviderAdapterError("hopper", "resolve_analysis_profile"));
			if (target.format === "raw-binary") return err(new ProviderAdapterError("hopper", "resolve_analysis_profile"));
			const architecture = target.architecture;
			if (isElfMetadataArchitecture(architecture)) return err(new AnalysisCapabilityUnavailableError("hopper", "resolve_analysis_profile", `REA's Hopper adapter does not admit ${HOPPER_DECLINED_ARCHITECTURE_LABELS[architecture]} targets. Select a verified Ghidra ${HOPPER_DECLINED_ARCHITECTURE_LABELS[architecture]} profile instead.`));
			const flag = hopperArchitectureFlag(architecture);
			if (isMachOFormat(target.format)) {
				if (machoContainer === undefined) return err(new AnalysisCapabilityUnavailableError("hopper", "resolve_analysis_profile", "Mach-O container kind is unknown; resolve the Hopper analysis profile before starting its client."));
				return ok(machoContainer === "fat32" || machoContainer === "fat64" ? [
					"-l",
					"FAT",
					flag,
					"-l",
					"Mach-O"
				] : [
					"-l",
					"Mach-O",
					flag
				]);
			}
			switch (target.format) {
				case "elf": return ok([
					"-l",
					"ELF",
					flag
				]);
				case "pe": return ok([
					"-l",
					"WinPE",
					flag
				]);
				case "dos-mz":
				case "dos-com": return err(new ProviderAdapterError("hopper", "resolve_analysis_profile"));
			}
		};
		hopperArchitectureFlag = (architecture) => {
			switch (architecture) {
				case "x86": return "--intel-32";
				case "x86_64": return "--intel-64";
				case "arm": return "--armv7";
				case "arm64": return "--aarch64";
			}
		};
		readMachoMagic = async (path, signal) => {
			if (signalIsAborted$2(signal)) return err(new AnalysisCancelledError("open_binary"));
			const stream = createReadStream(path, {
				start: 0,
				end: 3
			});
			const onAbort = () => {
				stream.destroy();
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			try {
				const chunks = [];
				for await (const chunk of stream) chunks.push(Buffer.from(chunk));
				if (signalIsAborted$2(signal)) return err(new AnalysisCancelledError("open_binary"));
				const bytes = Buffer.concat(chunks);
				return bytes.length === 4 ? ok(bytes.readUInt32BE(0)) : err(new BinaryTargetError(path, "Mach-O header became truncated before Hopper loader selection"));
			} catch (cause) {
				return signalIsAborted$2(signal) ? err(new AnalysisCancelledError("open_binary")) : err(new BinaryTargetError(path, `Cannot read the Mach-O container header: ${cause instanceof Error ? cause.message : String(cause)}`, { cause }));
			} finally {
				signal?.removeEventListener("abort", onAbort);
			}
		};
		sha256File = async (path, signal) => {
			if (signalIsAborted$2(signal)) return err(new AnalysisCancelledError("open_binary"));
			const stream = createReadStream(path);
			const onAbort = () => {
				stream.destroy();
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			try {
				const hash = createHash("sha256");
				for await (const chunk of stream) hash.update(chunk);
				return signalIsAborted$2(signal) ? err(new AnalysisCancelledError("open_binary")) : ok(hash.digest("hex"));
			} catch (cause) {
				void cause;
				return signalIsAborted$2(signal) ? err(new AnalysisCancelledError("open_binary")) : ok(undefined);
			} finally {
				signal?.removeEventListener("abort", onAbort);
			}
		};
		signalIsAborted$2 = (signal) => signal?.aborted === true;
	})))();
}

//#endregion
//#region dist/hopper/HopperFileOffset.js
/** Bind native image-relative offsets to coordinates in the admitted source bytes. */
async function mapHopperFileOffset(target, value, signal) {
	const parsed = observationSchema.safeParse(value);
	if (!parsed.success) return err(new AnalysisOutputError(OPERATION, "Hopper's native file mapping observation is malformed"));
	const observation = parsed.data;
	const partial = (reason) => ({
		operation: OPERATION,
		...observation,
		original_file_offset: {
			available: false,
			reason
		}
	});
	const unavailable = (reason) => err(new AnalysisCapabilityUnavailableError("hopper", OPERATION, reason, { partialObservation: partial(reason) }));
	if (target.kind !== "executable") return unavailable("The selected database digest does not identify its original executable bytes. Open that executable to verify original-file coordinates; read_bytes still exposes the database's native bytes.");
	if (signal?.aborted) return err(new AnalysisCancelledError(OPERATION, { partialObservation: partial("Source verification was cancelled") }));
	try {
		const captured = await snapshotFromPath(target.path, signal);
		if (!captured.ok) return err(new AnalysisArtifactChangedError(OPERATION, target.path, captured.error, { partialObservation: partial(captured.error) }));
		const snapshot = captured.value;
		if (signal?.aborted) return err(new AnalysisCancelledError(OPERATION, { partialObservation: partial("Source verification was cancelled") }));
		if (snapshot.sha256 !== target.sha256) {
			const reason = `Source ${target.path} differs from the admitted artifact: expected SHA-256 ${target.sha256}, observed ${snapshot.sha256}. Reopen the changed source for a new analysis identity.`;
			return err(new AnalysisArtifactChangedError(OPERATION, target.path, reason, { partialObservation: partial(reason) }));
		}
		const mapped = originalOffset(snapshot, observation);
		if (!mapped.ok) return unavailable(mapped.error);
		return ok({
			address: observation.address,
			file_offset: mapped.value + observation.provider_file_offset,
			provider_file_offset: observation.provider_file_offset,
			image_base_file_offset: mapped.value,
			source_path: target.path
		});
	} catch (cause) {
		if (signal?.aborted) return err(new AnalysisCancelledError(OPERATION, {
			cause,
			partialObservation: partial("Source verification was cancelled")
		}));
		const reason = `Cannot verify original source bytes: ${cause instanceof Error ? cause.message : String(cause)}`;
		const code = typeof cause === "object" && cause !== null && "code" in cause ? cause.code : undefined;
		if (code === "EACCES" || code === "EPERM") return err(new AnalysisAccessDeniedError(OPERATION, target.path, code, {
			cause,
			partialObservation: partial(reason)
		}));
		return err(new BinaryTargetError(target.path, reason, {
			cause,
			partialObservation: partial(reason)
		}));
	}
}
async function snapshotFromPath(path, signal) {
	const file = await open(path, constants.O_RDONLY | constants.O_NONBLOCK);
	try {
		if (!(await file.stat()).isFile()) return err(`Source ${path} is no longer a regular file. Restore the admitted executable or reopen a regular source.`);
		return ok(await readSourceSnapshot(file, signal));
	} finally {
		await file.close();
	}
}
function fatLayout(prefix) {
	const magic = prefix.length < 4 ? 0 : prefix.readUInt32BE(0);
	if (![
		3405691582,
		3199925962,
		3405691583,
		3216703178
	].includes(magic)) return ok(null);
	if (prefix.length < 8) return err("The original FAT header is truncated");
	const littleEndian = magic === 3199925962 || magic === 3216703178;
	const wide = magic === 3405691583 || magic === 3216703178;
	const count = littleEndian ? prefix.readUInt32LE(4) : prefix.readUInt32BE(4);
	if (count === 0 || count > MAX_FAT_ARCHITECTURES) return err("FAT architecture count is outside the supported 1..128 range");
	const tableEnd = 8 + count * (wide ? 32 : 20);
	const table = prefix.subarray(8, tableEnd);
	const parsed = readFatSliceDeclarations(table, {
		count,
		wide,
		littleEndian
	});
	if (parsed.status !== "parsed") return err(parsed.reason);
	if (wide) {
		for (const slice of parsed.slices) if ((littleEndian ? table.readUInt32LE(slice.index * 32 + 28) : table.readUInt32BE(slice.index * 32 + 28)) !== 0) return err(`FAT64 architecture ${slice.index} has a nonzero reserved field`);
	}
	return ok({
		slices: parsed.slices,
		tableEnd
	});
}
async function readSourceSnapshot(file, signal) {
	const prefix = Buffer.alloc(PREFIX_BYTES);
	const hash = createHash("sha256");
	let size = 0;
	let layout;
	const headers = new Map();
	const capture = (bytes, position) => {
		if (layout?.ok !== true || layout.value === null) return;
		for (const slice of layout.value.slices) {
			const start = Math.max(position, slice.offset);
			const end = Math.min(position + bytes.length, slice.offset + 12);
			if (end <= start) continue;
			let header = headers.get(slice.index);
			if (header === undefined) {
				header = Buffer.alloc(12);
				headers.set(slice.index, header);
			}
			bytes.copy(header, start - slice.offset, start - position, end - position);
		}
	};
	for await (const chunk of file.createReadStream({
		start: 0,
		autoClose: false,
		...signal === undefined ? {} : { signal }
	})) {
		const bytes = Buffer.from(chunk);
		hash.update(bytes);
		if (size < prefix.length) bytes.copy(prefix, size, 0, Math.min(bytes.length, prefix.length - size));
		if (layout === undefined && size + bytes.length >= prefix.length) {
			layout = fatLayout(prefix);
			capture(prefix, 0);
		}
		capture(bytes, size);
		size += bytes.length;
	}
	if (layout === undefined) {
		layout = fatLayout(prefix.subarray(0, size));
		capture(prefix.subarray(0, size), 0);
	}
	return {
		layout,
		headers,
		size,
		sha256: hash.digest("hex")
	};
}
function originalOffset(snapshot, observation) {
	const { layout, size, headers } = snapshot;
	if (!layout.ok) return layout;
	if (layout.value === null) return observation.provider_file_offset < size ? ok(0) : err("Provider mapping lies outside the admitted executable bytes");
	const header = observation.provider_image_header_hex === null ? null : Buffer.from(observation.provider_image_header_hex, "hex");
	const loadedMagic = header?.readUInt32BE(0);
	if (header === null || loadedMagic === undefined || ![
		4277009102,
		4277009103,
		3472551422,
		3489328638
	].includes(loadedMagic)) return err("Hopper did not expose the loaded Mach-O header needed to identify its FAT slice");
	const little = loadedMagic === 3472551422 || loadedMagic === 3489328638;
	const cpu = little ? header.readUInt32LE(4) : header.readUInt32BE(4);
	const subtype = little ? header.readUInt32LE(8) : header.readUInt32BE(8);
	const matches = [];
	const ranges = [...layout.value.slices].sort((a, b) => a.offset - b.offset);
	for (let index = 1; index < ranges.length; index++) {
		const previous = ranges[index - 1];
		const current = ranges[index];
		if (previous !== undefined && current !== undefined && current.offset < previous.offset + previous.size) return err("Original FAT slices overlap");
	}
	for (const slice of layout.value.slices) {
		const reason = validateFatSlice(slice, size, layout.value.tableEnd);
		if (reason !== null) return err(reason);
		const embedded = headers.get(slice.index);
		if (slice.size < 12 || embedded === undefined) return err(`FAT architecture ${slice.index} has a truncated Mach-O header`);
		const embeddedMagic = embedded.readUInt32BE(0);
		if (![
			4277009102,
			4277009103,
			3472551422,
			3489328638
		].includes(embeddedMagic)) return err(`FAT architecture ${slice.index} does not contain a Mach-O image`);
		const embeddedLittle = embeddedMagic === 3472551422 || embeddedMagic === 3489328638;
		const identityError = validateFatSlice(slice, size, layout.value.tableEnd, {
			cpuType: embeddedLittle ? embedded.readUInt32LE(4) : embedded.readUInt32BE(4),
			cpuSubtype: embeddedLittle ? embedded.readUInt32LE(8) : embedded.readUInt32BE(8)
		});
		if (identityError !== null) return err(identityError);
		if (slice.cpuType === cpu && slice.cpuSubtype === subtype) matches.push(slice);
	}
	const selected = matches.length === 1 ? matches[0] : undefined;
	if (selected === undefined) return err(`Original FAT slice matching Hopper's loaded header is ${matches.length === 0 ? "missing" : "ambiguous"}`);
	if (headers.get(selected.index)?.equals(header) !== true) return err("Original FAT slice header disagrees with Hopper's loaded header");
	if (observation.provider_file_offset >= selected.size) return err("Provider mapping lies outside the loaded FAT slice");
	if (!Number.isSafeInteger(selected.offset + observation.provider_file_offset)) return err("Original file offset exceeds the exact JSON integer range");
	return ok(selected.offset);
}
var OPERATION, MAX_FAT_ARCHITECTURES, PREFIX_BYTES, observationSchema;
function init_HopperFileOffset() {
	return (init_HopperFileOffset = __esmMin((() => {
		init_analysisErrorCore();
		init_configurationErrors();
		init_machoContainer();
		init_result();
		OPERATION = "address_to_file_offset";
		MAX_FAT_ARCHITECTURES = 128;
		PREFIX_BYTES = 8 + MAX_FAT_ARCHITECTURES * 32;
		observationSchema = z.strictObject({
			address: z.string().regex(/^0x[0-9a-f]+$/u),
			provider_file_offset: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
			provider_source_path: z.string().nullable(),
			provider_image_header_hex: z.string().regex(/^[a-f0-9]{24}$/u).nullable()
		});
	})))();
}

//#endregion
//#region dist/hopper/HopperRegexSearch.js
var MATCHING_DEADLINE_MS, inputSchema, replySchema, HopperRegexSearch;
function init_HopperRegexSearch() {
	return (init_HopperRegexSearch = __esmMin((() => {
		init_analysisErrorCore();
		init_hopperValues();
		init_hopperErrors();
		init_result();
		init_analysisSearchContract();
		MATCHING_DEADLINE_MS = 5e3;
		inputSchema = z.strictObject({
			...analysisSearchInput,
			mode: z.literal("regex")
		});
		replySchema = z.discriminatedUnion("status", [z.strictObject({
			status: z.literal("matched"),
			indices: z.array(z.number().int().nonnegative())
		}), z.strictObject({
			status: z.literal("invalid_pattern"),
			reason: z.string()
		})]);
		HopperRegexSearch = class {
			client;
			#active = new Map();
			constructor(client) {
				this.client = client;
			}
			execute(operation, parameters, options) {
				const controller = new AbortController();
				const signal = options?.signal === undefined ? controller.signal : AbortSignal.any([controller.signal, options.signal]);
				const pending = this.#execute(operation, parameters, {
					...options,
					signal
				});
				this.#active.set(controller, pending);
				void pending.then(() => this.#active.delete(controller), () => this.#active.delete(controller));
				return pending;
			}
			/** Abort matching workers before their provider session closes. */
			async close() {
				for (const controller of this.#active.keys()) controller.abort();
				await Promise.all(this.#active.values());
			}
			async #execute(operation, parameters, options) {
				const input = inputSchema.safeParse(parameters);
				if (!input.success) return err(new HopperRemoteError(-32e3, `Invalid search arguments: ${input.error.message}`, {
					diagnosticType: "invalid_request",
					operation
				}));
				const inventoryOptions = {
					...options,
					...options.progress === undefined ? {} : { progress: { report: (update) => options.progress?.report({
						...update,
						completed: update.total === null || update.total === 0 ? 0 : Math.min(.5, update.completed / update.total / 2),
						total: 1
					}) ?? Promise.resolve() } }
				};
				const inventory = await this.client.callTool(operation === "search_strings" ? "list_strings" : "list_procedures", input.data.document === undefined ? {} : { document: input.data.document }, inventoryOptions);
				if (!inventory.ok) return inventory;
				const parsed = z.array(analysisStringSchema).safeParse(inventory.value);
				if (!parsed.success) return err(new AnalysisOutputError(operation, "Hopper search inventory is malformed"));
				if (options.signal?.aborted) return err(new AnalysisCancelledError(operation));
				await options.progress?.report({
					phase: "hopper_regex",
					completed: .5,
					total: 1,
					message: "Matching inventory in cancellable regex worker"
				}).catch(() => undefined);
				if (options.signal?.aborted) return err(new AnalysisCancelledError(operation));
				let worker;
				try {
					worker = new Worker(new URL("./HopperRegexWorker.js", new URL("../hopper/HopperRegexSearch.js", import.meta.url).href), { workerData: {
						pattern: input.data.pattern,
						caseSensitive: input.data.case_sensitive,
						values: parsed.data.map((item) => item.value)
					} });
				} catch (cause) {
					return err(new AnalysisOutputError(operation, `Cannot start regex worker: ${cause instanceof Error ? cause.message : String(cause)}`, { cause }));
				}
				try {
					return await new Promise((resolve) => {
						const finish = (result) => {
							clearTimeout(timer);
							options.signal?.removeEventListener("abort", onAbort);
							resolve(result);
						};
						const onAbort = () => finish(err(new AnalysisCancelledError(operation)));
						const timer = setTimeout(() => finish(err(new AnalysisResourceConstraintError(operation, "cpu", "Regex matching exceeded its supervised deadline; the Hopper API thread remains available.", { matching_deadline_ms: MATCHING_DEADLINE_MS }, { remediationAction: "Simplify the ECMAScript Unicode regex or use literal mode, then retry in the same session." }))), MATCHING_DEADLINE_MS);
						options.signal?.addEventListener("abort", onAbort, { once: true });
						if (options.signal?.aborted) onAbort();
						worker.once("message", (message) => {
							const reply = replySchema.safeParse(message);
							if (!reply.success) return finish(err(new AnalysisOutputError(operation, "Regex worker reply is malformed")));
							if (reply.data.status === "invalid_pattern") return finish(err(new HopperRemoteError(-32e3, `Invalid regex pattern: ${reply.data.reason}`, {
								diagnosticType: "invalid_request",
								operation
							})));
							const indices = reply.data.indices;
							if (indices.some((index, position) => index >= parsed.data.length || position > 0 && index <= (indices[position - 1] ?? -1))) return finish(err(new AnalysisOutputError(operation, "Regex worker returned invalid inventory indices")));
							const selected = new Set(indices);
							finish(ok(parsed.data.filter((_, index) => selected.has(index))));
						});
						worker.once("error", (cause) => finish(err(new AnalysisOutputError(operation, `Regex worker failed: ${cause.message}`, { cause }))));
						worker.once("exit", (code) => finish(err(new AnalysisOutputError(operation, `Regex worker exited without a result (${code})`))));
					});
				} finally {
					await worker.terminate();
				}
			}
		};
	})))();
}

//#endregion
//#region dist/process/ProviderDiagnosticRedaction.js
var redactCapturedTransportCredential;
function init_ProviderDiagnosticRedaction() {
	return (init_ProviderDiagnosticRedaction = __esmMin((() => {
		redactCapturedTransportCredential = (stream, token, replacement) => {
			if (token === undefined || token.length === 0) return stream.text;
			const { text } = stream;
			const cutOff = stream.observedBytes > stream.bytes;
			if (cutOff && !text.endsWith(token)) {
				const maximumPrefixLength = Math.min(text.length, token.length - 1);
				for (let prefixLength = maximumPrefixLength; prefixLength > 0; prefixLength -= 1) {
					if (text.endsWith(token.slice(0, prefixLength))) return `${text.slice(0, text.length - prefixLength).replaceAll(token, replacement)}${replacement}`;
				}
			}
			return text.replaceAll(token, replacement);
		};
	})))();
}

//#endregion
//#region dist/process/ProviderRunLineage.js
var ProviderRunLineage;
function init_ProviderRunLineage() {
	return (init_ProviderRunLineage = __esmMin((() => {
		init_ProcessOwnershipObservation();
		ProviderRunLineage = class {
			#observation = null;
			/** Clear stale lineage before a new launch attempt. */
			reset() {
				this.#observation = null;
			}
			/** Observe a token-owned launcher without signaling it. */
			async observe(launch) {
				if (launch?.ownership === undefined) return;
				this.#observation = await observeOwnedProcessLineage(launch.ownership);
			}
			/** Return a detached copy suitable for caller-visible status. */
			snapshot() {
				return this.#observation === null ? null : structuredClone(this.#observation);
			}
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperOperationStage.js
var hopperOperationStage;
function init_HopperOperationStage() {
	return (init_HopperOperationStage = __esmMin((() => {
		hopperOperationStage = (operation) => {
			if (operation === "health") return "connection";
			return operation === "procedure_pseudo_code" ? "decompilation" : "analysis";
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperDiagnostics.js
var createOwnedHopperShutdownDiagnostic, providerCleanupFailure;
function init_HopperDiagnostics() {
	return (init_HopperDiagnostics = __esmMin((() => {
		createOwnedHopperShutdownDiagnostic = (launch, stopped, cleanup) => ({
			type: "owned-shutdown",
			status: stopped.status,
			launcher_pid: launch.ownership?.leaderPid ?? launch.process.pid ?? null,
			process_group_id: launch.ownership?.processGroupId ?? null,
			cleanup_signaled: cleanup?.cleaned === true ? cleanup.signaled : null,
			reason: stopped.status === "incomplete" ? stopped.reason : null
		});
		providerCleanupFailure = (_cause) => ({
			cleaned: false,
			reason: "owned provider cleanup failed"
		});
	})))();
}

//#endregion
//#region dist/hopper/HopperCleanup.js
var cleanupHopperSession, confirmExternalApplicationExit, requestShutdown, fallbackDocumentShutdown, shutdownRequestFailure, shutdownFailureDetails, describeFailureCause, stopProcess, recordUnconfirmedDocument, closeRuntimeRoot, cleanupOutcome, cleanupIssueDetails, activityDetails, report$1;
function init_HopperCleanup() {
	return (init_HopperCleanup = __esmMin((() => {
		init_hopperErrors();
		init_providerCleanupError();
		init_result();
		init_ProcessOwnershipObservation();
		init_HopperDiagnostics();
		init_HopperSessionValues();
		cleanupHopperSession = async (input) => {
			const state = {
				issues: [],
				resources: new Set(),
				cleanupResult: undefined,
				processStopped: input.resources.processSupervisor === undefined
			};
			await confirmExternalApplicationExit(input.resources, input.socket, input.releaseTransport);
			await report$1(input.progress, 0, input.retainDocument && input.resources.launch?.preparedImagePath === undefined ? "detaching REA from the Hopper document" : "requesting Hopper document shutdown");
			await requestShutdown(input, state);
			await report$1(input.progress, .35, "releasing Hopper bridge transport");
			if (input.resources.shutdownConfirmed || input.resources.launch?.providerLifetime !== "external-application") input.releaseTransport(input.socket);
			await stopProcess(input, state);
			recordUnconfirmedDocument(input, state);
			await report$1(input.progress, .75, "removing Hopper private runtime files");
			if (input.resources.runtimeRoot !== undefined && (!state.processStopped || !input.resources.shutdownConfirmed && (input.resources.launch?.preparedImagePath !== undefined || input.resources.launch?.providerLifetime === "external-application"))) {
				const resource = input.resources.runtimeRoot.path;
				state.resources.add(resource);
				state.issues.push({
					resource,
					reason: "Private runtime retained because process or native document closure was not confirmed"
				});
			} else {
				await closeRuntimeRoot(input, state);
			}
			if (state.processStopped && input.resources.shutdownConfirmed) {
				const launch = input.resources.launch;
				try {
					await launch?.releaseLease?.();
					input.resources.launch = undefined;
				} catch (cause) {
					state.resources.add("hopper-lease");
					state.issues.push({
						resource: "hopper-lease",
						reason: cause instanceof Error ? cause.message : String(cause)
					});
				}
			}
			return cleanupOutcome(input, state);
		};
		confirmExternalApplicationExit = async (resources, socket, releaseTransport, observeExit = observeProcessStartIdentityExit) => {
			const application = resources.externalApplication;
			if (resources.shutdownConfirmed || resources.launch?.providerLifetime !== "external-application" || application?.identity.state !== "readable") return;
			if (await observeExit(application.pid, application.identity.identity) === "exited") {
				resources.shutdownConfirmed = true;
				releaseTransport(socket);
			}
		};
		requestShutdown = async (input, state) => {
			if (input.resources.shutdownConfirmed || input.socket === undefined || input.socket.destroyed || input.activeRequest !== null) {
				if (input.activeRequest !== null) input.logger.warn({
					method: input.activeRequest.operation,
					callerState: input.activeRequest.callerState
				}, "Hopper shutdown skipped because a bridge operation remained active");
				return;
			}
			const method = input.retainDocument && input.resources.launch?.preparedImagePath === undefined || input.resources.launch?.shutdownMode === "process-cleanup" ? "shutdown" : "shutdown_document";
			const shutdown = await input.request(method).catch((cause) => err(shutdownRequestFailure(method, cause)));
			if (shutdown.ok && isHopperCleanupRequired(shutdown.value) && input.resources.launch?.shutdownMode === "process-cleanup") {
				state.cleanupResult = await input.resources.launch.cleanup().catch(providerCleanupFailure);
				if (!state.cleanupResult.cleaned) {
					input.resources.shutdownConfirmed = await fallbackDocumentShutdown(input);
				}
			} else if (shutdown.ok) {
				input.resources.shutdownConfirmed = isHopperShutdownAcknowledgement(shutdown.value);
			}
			if (!shutdown.ok || !input.resources.shutdownConfirmed && state.cleanupResult === undefined) input.logger.warn({
				status: shutdown.ok ? "invalid-acknowledgement" : "failed",
				...shutdown.ok ? {} : shutdownFailureDetails(shutdown.error)
			}, "Hopper document shutdown was not confirmed");
		};
		fallbackDocumentShutdown = async (input) => {
			const fallback = await input.request("shutdown_document").catch((cause) => err(shutdownRequestFailure("shutdown_document", cause)));
			const confirmed = fallback.ok && isHopperShutdownAcknowledgement(fallback.value);
			if (!confirmed) input.logger.warn({
				status: fallback.ok ? "invalid-acknowledgement" : "failed",
				...fallback.ok ? {} : shutdownFailureDetails(fallback.error)
			}, "Hopper document shutdown fallback was not confirmed");
			return confirmed;
		};
		shutdownRequestFailure = (operation, cause) => {
			return new HopperProcessError(null, {
				operation,
				cause
			});
		};
		shutdownFailureDetails = (error) => ({
			errorTag: error._tag,
			...error instanceof HopperProcessError && error.operation !== undefined ? { operation: error.operation } : {},
			...error instanceof HopperProcessError && error.requestId !== undefined ? { requestId: error.requestId } : {},
			...error.cause === undefined ? {} : { failure_cause: describeFailureCause(error.cause) }
		});
		describeFailureCause = (cause) => {
			if (cause instanceof Error) {
				const code = "code" in cause ? cause.code : undefined;
				return {
					name: cause.name,
					message: cause.message,
					...typeof code === "string" || typeof code === "number" && Number.isFinite(code) ? { code } : {}
				};
			}
			if (typeof cause === "string") return {
				type: "string",
				message: cause
			};
			if (cause === null || typeof cause === "boolean" || typeof cause === "number" && Number.isFinite(cause)) return {
				type: cause === null ? "null" : typeof cause,
				value: cause
			};
			return { type: typeof cause };
		};
		stopProcess = async (input, state) => {
			const supervisor = input.resources.processSupervisor;
			if (supervisor === undefined) return;
			const stopped = await supervisor.stop(state.cleanupResult === undefined ? {} : { cleanupResult: state.cleanupResult });
			const diagnostic = createOwnedHopperShutdownDiagnostic(supervisor.launch, stopped, state.cleanupResult);
			try {
				input.onDiagnostic?.(diagnostic);
			} catch (cause) {
				void cause;
			}
			input.logger.info(diagnostic, "Owned Hopper launcher shutdown completed");
			if (stopped.status !== "incomplete") {
				if (input.resources.launch?.providerLifetime === "launcher-process" && stopped.status !== "not-owned") input.resources.shutdownConfirmed = true;
				state.processStopped = true;
				input.resources.processSupervisor = undefined;
				return;
			}
			const processGroupId = supervisor.launch.ownership?.processGroupId;
			const resource = processGroupId === undefined ? "hopper-process" : `process-group:${String(processGroupId)}`;
			state.resources.add(resource);
			state.issues.push({
				resource,
				reason: stopped.reason
			});
			input.logger.warn({ reason: stopped.reason }, "Owned launcher cleanup failed closed");
		};
		recordUnconfirmedDocument = (input, state) => {
			if (input.socket === undefined && state.processStopped && input.resources.launch?.providerLifetime === "launcher-process") {
				input.resources.shutdownConfirmed = true;
			}
			if (input.socket === undefined && input.resources.launch === undefined || input.resources.shutdownConfirmed) return;
			state.resources.add("hopper-document");
			state.issues.push({
				resource: "hopper-document",
				reason: input.activeRequest === null ? "authenticated shutdown acknowledgement was not observed" : `bridge operation ${input.activeRequest.operation} remained active after caller ${input.activeRequest.callerState}`
			});
		};
		closeRuntimeRoot = async (input, state) => {
			const runtimeRoot = input.resources.runtimeRoot;
			try {
				await runtimeRoot?.close();
				input.resources.runtimeRoot = undefined;
			} catch (cause) {
				const resource = runtimeRoot?.path ?? "hopper-runtime-root";
				state.resources.add(resource);
				state.issues.push({
					resource,
					reason: cause instanceof Error ? cause.message : "private runtime root cleanup failed"
				});
			}
		};
		cleanupOutcome = (input, state) => {
			if (state.issues.length === 0) return ok(null);
			return err(new ProviderCleanupError("hopper", [...state.resources], {
				issues: cleanupIssueDetails(state.issues),
				...input.resources.runtimeRoot === undefined ? {} : { runtime_root: input.resources.runtimeRoot.path },
				...input.activeRequest === null ? {} : { active_request: activityDetails(input.activeRequest) }
			}));
		};
		cleanupIssueDetails = (issues) => issues.map((issue) => ({
			resource: issue.resource,
			reason: issue.reason
		}));
		activityDetails = (activity) => ({
			request_id: activity.requestId,
			operation: activity.operation,
			elapsed_ms: activity.elapsedMs,
			caller_state: activity.callerState,
			queued_requests: activity.queuedRequests
		});
		report$1 = async (progress, completed, message) => {
			await progress?.report({
				phase: "hopper_cleanup",
				completed,
				total: 1,
				message
			}).catch(() => undefined);
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperSocketConnection.js
var connectHopperSocketOnce;
function init_HopperSocketConnection() {
	return (init_HopperSocketConnection = __esmMin((() => {
		init_hopperErrors();
		init_result();
		connectHopperSocketOnce = (socketPath, signal) => new Promise((resolve) => {
			const socket = createConnection(socketPath);
			const detach = () => {
				socket.off("connect", onConnect);
				socket.off("error", onError);
				signal.removeEventListener("abort", onAbort);
			};
			const onConnect = () => {
				detach();
				resolve(ok(socket));
			};
			const onError = (cause) => {
				detach();
				socket.destroy();
				resolve(err(new HopperStartError({ cause })));
			};
			const onAbort = () => {
				detach();
				socket.destroy();
				resolve(err(new HopperCancelledError()));
			};
			socket.once("connect", onConnect);
			socket.once("error", onError);
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
		});
	})))();
}

//#endregion
//#region dist/hopper/HopperProcessDiagnostic.js
var hasCompleteLauncherOutput, nativeHopperLaunchWasDenied, hopperLauncherReportedApplicationNotFound, hopperLauncherFailureDiagnostic;
function init_HopperProcessDiagnostic() {
	return (init_HopperProcessDiagnostic = __esmMin((() => {
		init_hopperStartupFailure();
		init_LinuxPrivateDisplayDiagnostic();
		hasCompleteLauncherOutput = (outcome) => outcome.output_closed && !outcome.diagnostic_truncated && outcome.stdout.text === "" && outcome.stdout.bytes === 0 && outcome.stdout.retained_bytes === 0;
		nativeHopperLaunchWasDenied = (outcome) => outcome !== undefined && outcome.exit_code === 2 && outcome.signal === null && hasCompleteLauncherOutput(outcome) && /^Cannot launch Hopper!\r?\nNot authorized to send Apple events to [^\r\n]+\.\r?\n?$/u.test(outcome.stderr.text);
		hopperLauncherReportedApplicationNotFound = (outcome) => outcome !== undefined && outcome.exit_code === 3 && outcome.signal === null && hasCompleteLauncherOutput(outcome) && /^Hopper has not been found\.\r?\nPlease make sure that Spotlight is active in order for this tool to find Hopper's executable\.\r?\n?$/u.test(outcome.stderr.text);
		hopperLauncherFailureDiagnostic = (event) => {
			const parsed = parseLinuxPrivateDisplayDiagnostic(event.snapshot.stderr.text);
			if (!parsed.ok) return undefined;
			const expected = hopperStartupFailure(event.code)?.code;
			return parsed.value.operation === "launch" && parsed.value.status === "error" && parsed.value.failure_code === expected ? parsed.value : undefined;
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperRequestQueue.js
var MAX_TIMEOUT_MS, HopperRequestQueue, withRequestContext;
function init_HopperRequestQueue() {
	return (init_HopperRequestQueue = __esmMin((() => {
		init_HopperOperationStage();
		init_hopperErrors();
		init_result();
		MAX_TIMEOUT_MS = 2147483647;
		HopperRequestQueue = class {
			send;
			#queue = [];
			#active;
			constructor(send) {
				this.send = send;
			}
			/** Settle the caller on reply, cancellation, or deadline; retain active wire work. */
			run(id, method, params, options) {
				if (options.signal?.aborted === true) return Promise.resolve(err(new HopperCancelledError()));
				const timeoutMs = options.timeoutMs;
				if (timeoutMs !== undefined && (!Number.isInteger(timeoutMs) || timeoutMs < 0 || timeoutMs > MAX_TIMEOUT_MS)) return Promise.resolve(err(new HopperProtocolError(`Hopper timeoutMs must be an integer between 0 and ${String(MAX_TIMEOUT_MS)}`)));
				if (timeoutMs === 0) return Promise.resolve(err(new HopperTimeoutError(0, method, id, "not_started", hopperOperationStage(method))));
				return new Promise((resolve) => {
					let entry;
					const onAbort = options.signal === undefined ? undefined : () => this.#cancel(entry);
					entry = {
						id,
						method,
						params,
						signal: options.signal,
						progress: options.progress,
						resolve,
						onAbort,
						callerState: "waiting",
						callerSettled: false,
						transmitted: false,
						startedAt: undefined,
						heartbeat: undefined,
						deadline: undefined,
						deadlineAt: timeoutMs === undefined ? undefined : performance.now() + timeoutMs,
						timeoutMs
					};
					this.#queue.push(entry);
					if (onAbort !== undefined) options.signal?.addEventListener("abort", onAbort, { once: true });
					if (timeoutMs !== undefined) entry.deadline = setTimeout(() => this.#cancel(entry, this.#timeoutError(entry, timeoutMs)), timeoutMs);
					if (this.#active !== undefined || this.#queue.length > 1) this.#report(entry, `${method} queued behind ${String(this.#size() - 1)} Hopper request(s)`);
					this.#drain();
				});
			}
			/** Settle the active wire request. False identifies an unexpected response id. */
			accept(id, result) {
				const entry = this.#active;
				if (entry === undefined || entry.id !== id) return false;
				this.#expireIfElapsed(entry);
				this.#releaseWire(entry);
				if (!entry.callerSettled) this.#settleCaller(entry, result.ok ? result : err(withRequestContext(result.error, entry)), "waiting");
				this.#active = undefined;
				this.#drain();
				return true;
			}
			/** Forward one correlated bridge event without releasing the wire request. */
			acceptEvent(event) {
				const entry = this.#active;
				if (entry === undefined || entry.id !== event.id) return false;
				if (event.event.type === "progress" && !entry.callerSettled) {
					if (event.event.terminal === true && entry.heartbeat !== undefined) {
						clearInterval(entry.heartbeat);
						entry.heartbeat = undefined;
					}
					this.#reportUpdate(entry, {
						phase: event.event.phase,
						completed: event.event.completed,
						total: event.event.total,
						message: event.event.message,
						...event.event.terminal === undefined ? {} : { terminal: event.event.terminal }
					});
				}
				return true;
			}
			/** Fail the active wire request and every request still waiting in the FIFO. */
			failAll(error) {
				const active = this.#active;
				this.#active = undefined;
				if (active !== undefined) {
					this.#releaseWire(active);
					if (!active.callerSettled) this.#settleCaller(active, err(withRequestContext(error, active)), "waiting");
				}
				for (const entry of this.#queue.splice(0)) this.#settleCaller(entry, err(withRequestContext(error, entry)), "waiting");
			}
			/** Snapshot the one request still occupying Hopper's serial Python thread. */
			activity() {
				const active = this.#active;
				if (active === undefined || active.startedAt === undefined) return null;
				return {
					requestId: active.id,
					operation: active.method,
					elapsedMs: Math.max(0, Math.round(performance.now() - active.startedAt)),
					callerState: active.callerState,
					queuedRequests: this.#queue.length
				};
			}
			/** Return whether an id belongs to a request that has not crossed the wire. */
			hasQueued(id) {
				return this.#queue.some((entry) => entry.id === id);
			}
			/** Number of caller requests waiting behind the active bridge operation. */
			queuedCount() {
				return this.#queue.length;
			}
			#size() {
				return this.#queue.length + (this.#active === undefined ? 0 : 1);
			}
			#drain() {
				if (this.#active !== undefined) return;
				const entry = this.#queue.shift();
				if (entry === undefined) return;
				if (this.#expireIfElapsed(entry)) {
					this.#drain();
					return;
				}
				if (entry.signal?.aborted === true) {
					this.#settleCaller(entry, err(new HopperCancelledError()), "cancelled");
					this.#drain();
					return;
				}
				this.#active = entry;
				entry.startedAt = performance.now();
				this.#report(entry, `${entry.method} started on Hopper's serial bridge`);
				this.#expireIfElapsed(entry);
				if (this.#active !== entry || entry.callerSettled) {
					if (this.#active === entry) {
						this.#active = undefined;
						this.#releaseWire(entry);
						this.#drain();
					}
					return;
				}
				entry.heartbeat = setInterval(() => {
					if (entry.callerSettled || entry.startedAt === undefined) return;
					const elapsed = Math.round(performance.now() - entry.startedAt);
					this.#report(entry, `${entry.method} is still running in Hopper (${String(elapsed)} ms elapsed)`);
				}, 1e3);
				try {
					entry.transmitted = true;
					this.send({
						id: entry.id,
						method: entry.method,
						params: entry.params
					}, () => this.accept(entry.id, err(new HopperProcessError(null, {
						operation: entry.method,
						requestId: entry.id,
						providerState: "unreachable",
						stage: hopperOperationStage(entry.method)
					}))));
				} catch (cause) {
					this.accept(entry.id, err(new HopperProtocolError("Hopper socket write failed", { cause })));
				}
			}
			#timeoutError(entry, timeoutMs) {
				return new HopperTimeoutError(timeoutMs, entry.method, entry.id, entry.transmitted ? "busy" : "not_started", hopperOperationStage(entry.method));
			}
			#expireIfElapsed(entry) {
				if (entry.deadlineAt !== undefined && entry.timeoutMs !== undefined && performance.now() >= entry.deadlineAt) this.#settleCaller(entry, err(this.#timeoutError(entry, entry.timeoutMs)), "cancelled");
				return entry.callerSettled;
			}
			#cancel(entry, error = new HopperCancelledError()) {
				if (entry.callerSettled) return;
				if (this.#active === entry) {
					this.#settleCaller(entry, err(error), "cancelled");
					return;
				}
				const index = this.#queue.indexOf(entry);
				if (index < 0) return;
				this.#queue.splice(index, 1);
				this.#settleCaller(entry, err(error), "cancelled");
			}
			#settleCaller(entry, result, callerState) {
				if (entry.callerSettled) return;
				entry.callerSettled = true;
				entry.callerState = callerState;
				if (entry.deadline !== undefined) clearTimeout(entry.deadline);
				entry.deadline = undefined;
				if (this.#active === entry && entry.heartbeat !== undefined) {
					clearInterval(entry.heartbeat);
					entry.heartbeat = undefined;
				}
				if (entry.signal !== undefined && entry.onAbort !== undefined) entry.signal.removeEventListener("abort", entry.onAbort);
				entry.resolve(result);
			}
			#releaseWire(entry) {
				if (entry.heartbeat !== undefined) clearInterval(entry.heartbeat);
				entry.heartbeat = undefined;
				if (entry.signal !== undefined && entry.onAbort !== undefined) entry.signal.removeEventListener("abort", entry.onAbort);
			}
			#report(entry, message) {
				this.#reportUpdate(entry, {
					phase: "hopper_request",
					completed: 0,
					total: 1,
					message
				});
			}
			#reportUpdate(entry, update) {
				try {
					void Promise.resolve(entry.progress?.report(update)).catch((cause) => {
						void cause;
					});
				} catch (cause) {
					void cause;
				}
			}
		};
		withRequestContext = (error, entry) => {
			if (error instanceof HopperProcessError) return new HopperProcessError(error.exitCode, {
				...error,
				cause: error.cause,
				operation: error.operation ?? entry.method,
				requestId: error.requestId ?? entry.id,
				stage: error.operation === undefined && error.stage === "connection" ? hopperOperationStage(entry.method) : error.stage
			});
			if (error instanceof HopperRemoteError) return new HopperRemoteError(error.code, error.safeMessage, {
				...error,
				cause: error.cause,
				operation: error.operation ?? entry.method,
				requestId: error.requestId ?? entry.id
			});
			return error;
		};
	})))();
}

//#endregion
//#region dist/hopper/protocol.js
var remoteErrorSchema, responseSchema$1, eventSchema, messageSchema, parseBridgeMessageLine, responseResult;
function init_protocol() {
	return (init_protocol = __esmMin((() => {
		init_hopperErrors();
		init_jsonValue();
		init_result();
		init_safeJson();
		remoteErrorSchema = z.object({
			code: z.number().int(),
			message: z.string(),
			type: z.enum([
				"remote",
				"authorization",
				"invalid_request",
				"capability_unavailable",
				"bridge_exception"
			]).default("remote")
		}).strict();
		responseSchema$1 = z.union([z.object({
			id: z.number().int().nonnegative(),
			result: jsonValueSchema
		}).strict(), z.object({
			id: z.number().int().nonnegative(),
			error: remoteErrorSchema
		}).strict()]);
		eventSchema = z.object({
			id: z.number().int().nonnegative(),
			event: z.discriminatedUnion("type", [z.object({
				type: z.literal("progress"),
				phase: z.string().min(1),
				completed: z.number().nonnegative().finite(),
				total: z.number().nonnegative().finite().nullable(),
				message: z.string().min(1),
				terminal: z.boolean().optional()
			}).strict(), z.object({
				type: z.literal("diagnostic"),
				error: remoteErrorSchema
			}).strict()])
		}).strict().superRefine((message, context) => {
			if (message.event.type === "progress" && message.event.total !== null && message.event.completed > message.event.total) {
				context.addIssue({
					code: "custom",
					message: "Progress total cannot be less than completed",
					path: ["event", "total"]
				});
			}
		});
		messageSchema = z.union([responseSchema$1, eventSchema]);
		parseBridgeMessageLine = (line) => {
			const decodedResult = safeParseJson(line);
			if (!decodedResult.ok) return err(new HopperProtocolError("Hopper returned malformed JSON", { cause: decodedResult.cause }));
			const decoded = decodedResult.value;
			const parsed = messageSchema.safeParse(decoded);
			return parsed.success ? ok(parsed.data) : err(new HopperProtocolError("Hopper returned a message outside the bridge contract", { cause: parsed.error }));
		};
		responseResult = (response) => "error" in response ? err(new HopperRemoteError(response.error.code, response.error.message, { diagnosticType: response.error.type })) : ok(response.result);
	})))();
}

//#endregion
//#region dist/hopper/HopperResponseStream.js
var HopperResponseStream;
function init_HopperResponseStream() {
	return (init_HopperResponseStream = __esmMin((() => {
		init_protocol();
		HopperResponseStream = class {
			options;
			#buffer = "";
			#fragments = [];
			constructor(options) {
				this.options = options;
			}
			push(chunk) {
				this.#fragments.push(chunk);
				if (!chunk.includes("\n")) return;
				this.#buffer += this.#fragments.join("");
				this.#fragments = [];
				let newline = this.#buffer.indexOf("\n");
				while (newline >= 0) {
					const line = this.#buffer.slice(0, newline).trim();
					this.#buffer = this.#buffer.slice(newline + 1);
					if (line.length > 0 && !this.#acceptLine(line)) return;
					newline = this.#buffer.indexOf("\n");
				}
			}
			reset() {
				this.#buffer = "";
				this.#fragments = [];
			}
			#acceptLine(line) {
				const parsed = parseBridgeMessageLine(line);
				if (!parsed.ok) {
					this.options.abort(parsed.error.message, parsed.error);
					return false;
				}
				if (this.options.accept(parsed.value)) return true;
				if (parsed.value.id >= this.options.nextRequestId() || this.options.hasQueued(parsed.value.id)) {
					this.options.abort("Hopper returned an unknown response id");
					return false;
				}
				return true;
			}
		};
	})))();
}

//#endregion
//#region dist/hopper/HopperClient.js
var HOPPER_PROCESS_DIAGNOSTIC_BYTES, SESSION_ROOT$1, HopperClient, PROCESS_FAILURE_RANK, processFailureState, mergeFailedRequests, isAborted$3;
function init_HopperClient() {
	return (init_HopperClient = __esmMin((() => {
		init_analysisErrorCleanup();
		init_analysisErrorCore();
		init_hopperErrors();
		init_hopperStartupFailure();
		init_providerOperationHealth();
		init_result();
		init_logger();
		init_PrivateRuntimeRoot();
		init_ProviderDeadline();
		init_ProviderDiagnosticRedaction();
		init_ProviderRunLineage();
		init_ProviderProcess();
		init_ProcessOwnershipObservation();
		init_HopperOperationStage();
		init_HopperCleanup();
		init_HopperSessionValues();
		init_HopperSocketConnection();
		init_HopperProcessDiagnostic();
		init_providerStartupTimeout();
		init_HopperRequestQueue();
		init_HopperResponseStream();
		init_protocol();
		HOPPER_PROCESS_DIAGNOSTIC_BYTES = 8 * 1024 * 1024;
		SESSION_ROOT$1 = process.platform === "darwin" ? "/tmp" : tmpdir();
		HopperClient = class {
			#options;
			#requests;
			#responses;
			#logger;
			#socket;
			#resources = {
				launch: undefined,
				processSupervisor: undefined,
				runtimeRoot: undefined,
				shutdownConfirmed: false,
				externalApplication: undefined
			};
			#token;
			#lineage = new ProviderRunLineage();
			#nextId = 1;
			#closing = false;
			#launcherExitCode;
			#launcherFailureDiagnostic;
			#operationFailure;
			#startupController;
			#ready = false;
			#startupFailureResult;
			#runId;
			#startPromise;
			#closePromise;
			#onSocketData = (chunk) => {
				this.#responses.push(chunk);
			};
			#onSocketError = () => {
				const error = new HopperProcessError(null, { providerState: "unreachable" });
				this.#failAll(error);
				this.#rememberProcessFailure(error, []);
			};
			#onSocketClose = () => {
				if (this.#closing) return;
				const launch = this.#resources.launch;
				if (launch?.providerLifetime === "launcher-process" && this.#launcherExitCode !== undefined) return;
				if (launch?.providerLifetime === "launcher-process") {
					setImmediate(() => {
						if (this.#closing || this.#launcherExitCode !== undefined) return;
						const exitCode = launch.process.exitCode ?? null;
						const error = new HopperProcessError(exitCode, {
							diagnostic: this.#launcherFailureDiagnostic,
							providerState: exitCode !== null ? "exited" : "unreachable"
						});
						this.#failAll(error);
						this.#rememberProcessFailure(error, []);
					});
					return;
				}
				const error = new HopperProcessError(null, { providerState: "unreachable" });
				this.#failAll(error);
				this.#rememberProcessFailure(error, []);
			};
			constructor(options) {
				this.#logger = options.logger ?? silentLogger;
				this.#options = {
					...options,
					startupTimeoutMs: options.startupTimeoutMs ?? 12e4
				};
				this.#requests = new HopperRequestQueue(({ id, method, params }, failed) => {
					const socket = this.#socket;
					const token = this.#token;
					if (socket === undefined || socket.destroyed || token === undefined) {
						failed();
						return;
					}
					socket.write(`${JSON.stringify({
						id,
						token,
						method,
						params
					})}\n`, (cause) => {
						if (cause !== undefined && cause !== null) failed();
					});
				});
				this.#responses = new HopperResponseStream({
					accept: (message) => this.#acceptBridgeMessage(message),
					hasQueued: (id) => this.#requests.hasQueued(id),
					nextRequestId: () => this.#nextId,
					abort: (message, cause) => this.#abortProtocol(message, cause)
				});
			}
			/** Latest token-verified launcher lineage for the active run. */
			runtimeLineage() {
				return this.#lineage.snapshot();
			}
			/** Observe a request that still occupies Hopper after caller timeout/cancel. */
			requestActivity() {
				return this.#requests.activity();
			}
			/**
			* Latest operational health for this owned bridge.
			* A recorded exit remains visible after request activity returns to idle.
			*/
			operationHealth() {
				const failure = this.#operationFailure;
				if (failure !== undefined) {
					const requests = failure.requests.map((request) => ({
						...request,
						stage: failure.startupFailure ? "launch" : hopperOperationStage(request.operation)
					}));
					return {
						state: failure.state,
						stage: requests.length === 0 ? failure.startupFailure ? "launch" : "connection" : sharedProviderFailureStage(requests),
						retryAction: providerRetryAction(failure.state, failure.startupFailure),
						exitCode: failure.exitCode,
						requests
					};
				}
				const activity = this.requestActivity();
				if (activity !== null) {
					const stage = hopperOperationStage(activity.operation);
					return {
						state: "busy",
						stage,
						retryAction: "wait",
						exitCode: null,
						requests: [{
							requestId: activity.requestId,
							operation: activity.operation,
							stage
						}]
					};
				}
				return {
					state: "idle",
					stage: null,
					retryAction: null,
					exitCode: null,
					requests: []
				};
			}
			/** True only after the authenticated health handshake has completed. */
			isReady() {
				return this.#ready && this.#socket !== undefined && !this.#socket.destroyed && this.#closePromise === undefined;
			}
			/** Launch the bridge once and complete its authenticated health handshake. */
			start(signal) {
				if (this.#closePromise !== undefined) {
					return this.#closePromise.then((closed) => closed.ok ? this.start(signal) : closed);
				}
				if (this.#startPromise !== undefined) return this.#startPromise;
				const controller = new AbortController();
				const onAbort = () => controller.abort(signal?.reason);
				if (signal?.aborted === true) onAbort();
				else signal?.addEventListener("abort", onAbort, { once: true });
				const started = this.#start(controller.signal);
				this.#startupController = controller;
				this.#startPromise = started;
				const release = () => {
					signal?.removeEventListener("abort", onAbort);
				};
				const reset = () => {
					if (this.#startPromise === started) {
						this.#startPromise = undefined;
						if (this.#startupController === controller) {
							this.#startupController = undefined;
						}
					}
				};
				void started.then((result) => {
					release();
					if (!result.ok) {
						this.#rememberStartupFailure(result.error);
						reset();
					} else this.#ready = true;
				}, (cause) => {
					this.#logger.debug({ error: cause instanceof Error ? cause.message : String(cause) }, "Hopper startup promise rejected during bookkeeping");
					release();
					reset();
				});
				return started;
			}
			async #start(signal) {
				if (isAborted$3(signal)) return err(new HopperCancelledError());
				if (this.#socket !== undefined || this.#resources.launch !== undefined || this.#resources.runtimeRoot !== undefined) {
					return err(this.#startupFailureResult ?? new HopperProtocolError("Hopper client is already started"));
				}
				this.#operationFailure = undefined;
				this.#startupFailureResult = undefined;
				this.#resources.shutdownConfirmed = false;
				const deadline = new ProviderStartupDeadline(this.#options.startupTimeoutMs, signal);
				try {
					return await this.#startWithin(deadline);
				} finally {
					deadline.dispose();
				}
			}
			async #startWithin(deadline) {
				try {
					this.#resources.runtimeRoot = await PrivateRuntimeRoot.create({
						parent: SESSION_ROOT$1,
						prefix: "rea-"
					});
				} catch (cause) {
					return err(new HopperStartError({ cause }));
				}
				if (deadline.signal.aborted) {
					return this.#startupFailure(await this.#startupInterruption(deadline));
				}
				const socketPath = join(this.#resources.runtimeRoot.path, "bridge.sock");
				this.#token = randomBytes(32).toString("hex");
				this.#lineage.reset();
				this.#launcherExitCode = undefined;
				this.#launcherFailureDiagnostic = undefined;
				const runId = this.#options.runId ?? randomUUID();
				this.#runId = runId;
				const launched = await this.#options.launcher.launch({
					directory: this.#resources.runtimeRoot.path,
					socketPath,
					token: this.#token,
					runId
				}, { signal: deadline.signal }).catch((cause) => err(new HopperStartError({ cause })));
				if (!launched.ok) {
					return this.#startupFailure(deadline.signal.aborted ? await this.#startupInterruption(deadline) : launched.error);
				}
				this.#resources.launch = launched.value;
				this.#attachLauncher(launched.value);
				const ownership = launched.value.ownership;
				if (ownership !== undefined) {
					try {
						await writeFileAtomic(join(this.#resources.runtimeRoot.path, "ownership.json"), `${JSON.stringify({
							run_id: runId,
							pid: ownership.leaderPid,
							process_group_id: ownership.processGroupId,
							parent_pid: process.pid,
							launcher: launched.value.launcherCommand ?? null,
							created_at: new Date().toISOString()
						})}\n`, {
							encoding: "utf8",
							mode: 384
						});
					} catch (cause) {
						return this.#startupFailure(new HopperStartError({ cause }));
					}
				}
				const connected = await this.#connect(socketPath, deadline);
				if (!connected.ok) {
					return this.#startupFailure(connected.error);
				}
				const remainingMs = deadline.remainingMs();
				if (remainingMs <= 0) {
					return this.#startupFailure(await this.#startupInterruption(deadline));
				}
				const health = await this.#request("health", {}, {
					timeoutMs: remainingMs,
					signal: deadline.signal
				});
				if (!health.ok) {
					return this.#startupFailure(deadline.signal.aborted || health.error instanceof HopperTimeoutError ? await this.#startupInterruption(deadline) : health.error);
				}
				const parsed = parseHopperServerInfo(health.value, runId);
				if (!parsed.ok) return this.#startupFailure(parsed.error);
				if (this.#resources.launch?.providerLifetime === "external-application") {
					let identity;
					try {
						identity = await observeProcessStartIdentity(parsed.value.processId);
					} catch (cause) {
						identity = {
							state: "unavailable",
							reason: cause instanceof Error ? cause.message : "process identity observation failed"
						};
					}
					this.#resources.externalApplication = {
						pid: parsed.value.processId,
						identity: identity ?? {
							state: "unavailable",
							reason: "process identity was not returned while Hopper was running"
						}
					};
				}
				await this.#lineage.observe(this.#resources.launch);
				return parsed;
			}
			async #startupFailure(primary) {
				this.#rememberStartupFailure(primary);
				this.#releaseTransport();
				const closed = await this.#cleanup();
				const failure = closed.ok ? primary : analysisErrorWithCleanupFailure(primary, closed.error, "open_binary");
				this.#startupFailureResult = failure;
				return err(failure);
			}
			#rememberStartupFailure(failure) {
				if (failure instanceof HopperProcessError) this.#rememberProcessFailure(failure, []);
				else if (this.#operationFailure === undefined) this.#operationFailure = {
					state: failure instanceof HopperTimeoutError ? "not_started" : "unknown",
					exitCode: null,
					startupFailure: true,
					requests: []
				};
			}
			/** Invoke one declared operation, returning timeout and cancellation as values. */
			async callTool(name, arguments_ = {}, options = {}) {
				const started = await this.start(options.signal);
				if (!started.ok) return started;
				return this.#normalizeToolResult(name, await this.#request(name, arguments_, options));
			}
			/** Dispatch against the connected bridge without invoking startup or retry. */
			callToolIfReady(name, arguments_ = {}, options = {}) {
				if (!this.isReady()) return Promise.resolve(undefined);
				return this.#request(name, arguments_, options).then((result) => this.#normalizeToolResult(name, result));
			}
			#normalizeToolResult(name, result) {
				return !result.ok && result.error instanceof HopperRemoteError && result.error.diagnosticType === "capability_unavailable" ? err(new AnalysisCapabilityUnavailableError("hopper", name, result.error.safeMessage)) : result;
			}
			/** Stop the bridge and report whether every owned resource was verified clean. */
			close(options = {}) {
				const starting = this.#startPromise;
				const controller = this.#startupController;
				controller?.abort();
				this.#closePromise ??= Promise.resolve().then(() => this.#close(starting, controller, options));
				return this.#closePromise;
			}
			async #close(starting, controller, options) {
				try {
					await starting?.catch(() => undefined);
					await confirmExternalApplicationExit(this.#resources, this.#socket, () => this.#releaseTransport());
					await this.#reconnectForCleanup();
					return await this.#cleanup(options);
				} finally {
					if (this.#startPromise === starting) this.#startPromise = undefined;
					if (this.#startupController === controller) {
						this.#startupController = undefined;
					}
					this.#closePromise = undefined;
				}
			}
			/** Reauthenticate this run after late readiness or a lost transport. */
			async #reconnectForCleanup() {
				if (this.#socket?.destroyed === true) this.#releaseTransport();
				const root = this.#resources.runtimeRoot;
				const runId = this.#runId;
				if (this.#socket !== undefined || root === undefined || runId === undefined || this.#token === undefined || this.#resources.shutdownConfirmed || this.#resources.launch?.providerLifetime !== "external-application") return;
				const controller = new AbortController();
				const timer = setTimeout(() => controller.abort(), HOPPER_SHUTDOWN_TIMEOUT_MS);
				this.#closing = true;
				try {
					const socketPath = join(root.path, "bridge.sock");
					let connected = await connectHopperSocketOnce(socketPath, controller.signal);
					while (!connected.ok) {
						const cause = connected.error.cause;
						if (!(cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ECONNREFUSED"))) return;
						if (await waitForAbortableDelay(50, controller.signal) === "aborted") return;
						connected = await connectHopperSocketOnce(socketPath, controller.signal);
					}
					const socket = connected.value;
					this.#socket = socket;
					this.#attachSocket(socket);
					const health = await this.#request("health", {}, {
						signal: controller.signal,
						timeoutMs: HOPPER_SHUTDOWN_TIMEOUT_MS
					});
					if (health.ok && parseHopperServerInfo(health.value, runId).ok) return;
					this.#releaseTransport();
				} finally {
					this.#closing = false;
					clearTimeout(timer);
				}
			}
			async #cleanup(options = {}) {
				this.#closing = true;
				this.#ready = false;
				try {
					return await cleanupHopperSession({
						socket: this.#socket,
						resources: this.#resources,
						activeRequest: this.#requests.activity(),
						progress: options.progress,
						logger: this.#logger,
						onDiagnostic: this.#options.onDiagnostic,
						request: (method) => this.#request(method, {}, { timeoutMs: HOPPER_SHUTDOWN_TIMEOUT_MS }),
						retainDocument: options.retainDocument === true,
						releaseTransport: () => this.#releaseTransport()
					});
				} finally {
					if (this.#socket?.destroyed === true) this.#socket = undefined;
					if (this.#resources.runtimeRoot === undefined) {
						this.#token = undefined;
						this.#runId = undefined;
					}
					if (this.#socket === undefined) this.#responses.reset();
					if (this.#resources.processSupervisor === undefined) {
						this.#launcherExitCode = undefined;
						this.#launcherFailureDiagnostic = undefined;
					}
					this.#closing = false;
				}
			}
			async #connect(socketPath, deadline) {
				while (deadline.remainingMs() > 0) {
					if (deadline.signal.aborted) return err(await this.#startupInterruption(deadline));
					if (this.#closing) return err(new HopperProcessError(null));
					if (this.#launcherExitCode !== undefined && this.#resources.launch !== undefined && (this.#resources.launch.providerLifetime === "launcher-process" || this.#launcherExitCode !== 0)) {
						const failure = await this.#launcherStartupFailure(this.#resources.launch.providerLifetime === "launcher-process", this.#launcherExitCode, deadline);
						return deadline.interruption === "cancelled" ? err(await this.#startupInterruption(deadline)) : err(failure);
					}
					try {
						await access(socketPath);
					} catch (cause) {
						void cause;
						if (await deadline.wait(50) === "aborted") return err(await this.#startupInterruption(deadline));
						continue;
					}
					const attempt = await connectHopperSocketOnce(socketPath, deadline.signal);
					if (attempt.ok) {
						this.#socket = attempt.value;
						this.#attachSocket(attempt.value);
						return ok(undefined);
					}
					if (await deadline.wait(50) === "aborted") return err(await this.#startupInterruption(deadline));
				}
				return err(await this.#startupInterruption(deadline));
			}
			async #startupInterruption(deadline) {
				if (deadline.interruption === "cancelled") return new HopperCancelledError();
				return new HopperTimeoutError(deadline.timeoutMs, undefined, undefined, "not_started", "launch", this.#launcherOutcome(await this.#resources.processSupervisor?.waitForOutputClose(0) ?? false));
			}
			#launcherOutcome(outputClosed) {
				const snapshot = this.#resources.processSupervisor?.snapshot();
				const token = this.#token;
				if (snapshot === undefined) return undefined;
				return {
					exit_code: snapshot.exitCode ?? null,
					signal: snapshot.signal ?? null,
					stdout: {
						text: redactCapturedTransportCredential(snapshot.stdout, token, "[redacted transport credential]"),
						bytes: snapshot.stdout.observedBytes,
						retained_bytes: snapshot.stdout.bytes
					},
					stderr: {
						text: redactCapturedTransportCredential(snapshot.stderr, token, "[redacted transport credential]"),
						bytes: snapshot.stderr.observedBytes,
						retained_bytes: snapshot.stderr.bytes
					},
					output_closed: outputClosed,
					diagnostic_truncated: snapshot.diagnosticTruncated === true
				};
			}
			async #launcherStartupFailure(ownsProviderLifetime, exitCode, deadline) {
				const process = this.#resources.processSupervisor;
				const outputClosed = await process?.waitForOutputClose(Math.min(1e3, deadline.remainingMs())) ?? false;
				const launcherFailure = this.#launcherOutcome(outputClosed);
				if (ownsProviderLifetime) return new HopperProcessError(exitCode, {
					diagnostic: this.#launcherFailureDiagnostic,
					providerState: "exited",
					stage: "launch",
					launcherFailure
				});
				if (this.#resources.launch?.authorizationDenialBeforeHandoff === true && nativeHopperLaunchWasDenied(launcherFailure)) {
					this.#resources.shutdownConfirmed = true;
					return new HopperStartError({
						userMessage: "macOS denied permission to send Apple Events to Hopper. Allow the application that starts REA under System Settings > Privacy & Security > Automation, then retry opening the target.",
						launcherFailure
					});
				}
				if (hopperLauncherReportedApplicationNotFound(launcherFailure)) {
					if (this.#resources.launch?.nativeHelperVerified === true) this.#resources.shutdownConfirmed = true;
					return new HopperStartError({
						userMessage: "Hopper's launcher could not find Hopper because it relies on Spotlight. Enable Spotlight indexing for the volume that contains Hopper (for example: sudo mdutil -i on /System/Volumes/Data), wait for indexing to finish, then retry opening the target.",
						launcherFailure
					});
				}
				return new HopperStartError({
					userMessage: "Hopper's launcher helper failed before bridge readiness. Review details.launcher and complete Hopper setup before retrying.",
					...launcherFailure === undefined ? {} : { launcherFailure }
				});
			}
			async #request(method, params, options) {
				const id = this.#nextId++;
				if (this.#resources.launch?.providerLifetime === "launcher-process" && this.#launcherExitCode !== undefined) {
					return this.#unavailableRequest(new HopperProcessError(this.#launcherExitCode, {
						diagnostic: this.#launcherFailureDiagnostic,
						operation: method,
						requestId: id,
						providerState: "exited",
						stage: hopperOperationStage(method),
						launcherFailure: this.#launcherOutcome(await this.#resources.processSupervisor?.waitForOutputClose(0) ?? false)
					}));
				}
				const socket = this.#socket;
				const token = this.#token;
				if (socket === undefined || socket.destroyed || token === undefined) {
					return this.#unavailableRequest(new HopperProcessError(null, {
						operation: method,
						requestId: id,
						providerState: "unreachable",
						stage: hopperOperationStage(method)
					}));
				}
				if (options.signal?.aborted === true) return err(new HopperCancelledError());
				const startedAt = performance.now();
				const result = await this.#requests.run(id, method, params, {
					...options.signal === undefined ? {} : { signal: options.signal },
					...options.timeoutMs === undefined ? {} : { timeoutMs: options.timeoutMs },
					...options.progress !== undefined ? { progress: options.progress } : {}
				});
				this.#retainRequestHealth(result, id, method);
				this.#logger[result.ok ? "debug" : "warn"]({
					method,
					durationMs: Math.round((performance.now() - startedAt) * 100) / 100,
					status: result.ok ? "ok" : "error",
					...result.ok ? {} : { errorTag: result.error._tag }
				}, "Hopper bridge request completed");
				return result;
			}
			#attachSocket(socket) {
				socket.setEncoding("utf8");
				socket.on("data", this.#onSocketData);
				socket.on("error", this.#onSocketError);
				socket.on("close", this.#onSocketClose);
			}
			#acceptBridgeMessage(message) {
				if (!("event" in message)) return this.#requests.accept(message.id, responseResult(message));
				if (!this.#requests.acceptEvent(message)) return false;
				this.#emitBridgeDiagnostic(message);
				return true;
			}
			#emitBridgeDiagnostic(message) {
				if (message.event.type !== "diagnostic") return;
				try {
					this.#options.onDiagnostic?.({
						type: "bridge-diagnostic",
						request_id: message.id,
						code: message.event.error.code,
						category: message.event.error.type,
						message: message.event.error.message
					});
				} catch (cause) {
					void cause;
					this.#logger.warn({ requestId: message.id }, "Hopper bridge diagnostic consumer rejected an event");
				}
			}
			#detachSocket(socket) {
				socket.off("data", this.#onSocketData);
				socket.off("error", this.#onSocketError);
				socket.off("close", this.#onSocketClose);
			}
			#releaseTransport() {
				const socket = this.#socket;
				this.#socket = undefined;
				this.#failAll(new HopperProcessError(null));
				if (socket !== undefined) this.#detachSocket(socket);
				socket?.destroy();
				this.#responses.reset();
			}
			#attachLauncher(launch) {
				this.#resources.processSupervisor = new ProviderProcessSupervisor(launch, {
					maxDiagnosticBytes: HOPPER_PROCESS_DIAGNOSTIC_BYTES,
					onDiagnostic: (event) => this.#onLauncherDiagnostic(launch, event)
				});
			}
			#onLauncherDiagnostic(launch, event) {
				if (event.type === "output" && event.stream === "stderr") {
					this.#options.onDiagnostic?.({
						type: "launcher-stderr",
						bytes: event.bytes
					});
					return;
				}
				if (event.type === "error") {
					this.#logger.warn({ message: event.message }, "Hopper launcher process emitted an error");
					return;
				}
				if (event.type !== "exit") return;
				this.#launcherExitCode = event.code;
				this.#launcherFailureDiagnostic = hopperLauncherFailureDiagnostic(event);
				this.#options.onDiagnostic?.({
					type: "launcher-exit",
					code: event.code
				});
				if (launch.providerLifetime === "launcher-process" && !this.#closing) {
					this.#rememberExit(event.code);
					this.#failAll(new HopperProcessError(event.code, {
						diagnostic: this.#launcherFailureDiagnostic,
						providerState: "exited",
						launcherFailure: this.#launcherOutcome(false)
					}));
				}
			}
			#abortProtocol(message, cause) {
				this.#failAll(new HopperProtocolError(message, { cause }));
				this.#socket?.destroy();
			}
			#failAll(error) {
				this.#requests.failAll(error);
			}
			#unavailableRequest(error) {
				this.#rememberProcessFailure(error, error.requestId === undefined || error.operation === undefined ? [] : [{
					requestId: error.requestId,
					operation: error.operation
				}]);
				return err(error);
			}
			#retainRequestHealth(result, requestId, operation) {
				if (this.#closing) return;
				if (result.ok) return;
				if (!(result.error instanceof HopperProcessError)) return;
				this.#rememberProcessFailure(result.error, [{
					requestId: result.error.requestId ?? requestId,
					operation: result.error.operation ?? operation
				}]);
			}
			#rememberExit(code) {
				if (this.#closing) return;
				const previous = this.#operationFailure;
				this.#operationFailure = {
					state: "exited",
					exitCode: code ?? previous?.exitCode ?? null,
					startupFailure: hopperStartupFailure(code) !== undefined || previous?.startupFailure === true,
					requests: previous?.requests ?? []
				};
			}
			#rememberProcessFailure(error, requests) {
				if (this.#closing) return;
				const previous = this.#operationFailure;
				const state = processFailureState(error);
				const startupFailure = error.stage === "launch" || error.failureCode !== undefined || previous?.startupFailure === true;
				const merged = mergeFailedRequests(previous?.requests ?? [], requests);
				if (previous !== undefined && PROCESS_FAILURE_RANK[previous.state] > PROCESS_FAILURE_RANK[state]) {
					this.#operationFailure = {
						...previous,
						startupFailure,
						requests: merged
					};
					return;
				}
				this.#operationFailure = {
					state,
					exitCode: state === "exited" ? error.exitCode ?? previous?.exitCode ?? null : null,
					startupFailure,
					requests: merged
				};
			}
		};
		PROCESS_FAILURE_RANK = {
			not_started: 0,
			unknown: 0,
			unreachable: 1,
			exited: 2
		};
		processFailureState = (error) => error.providerState === "exited" || error.exitCode !== null ? "exited" : error.providerState;
		mergeFailedRequests = (current, added) => {
			const byId = new Map();
			for (const request of [...current, ...added]) byId.set(request.requestId, request);
			return [...byId.values()].sort((left, right) => left.requestId - right.requestId);
		};
		isAborted$3 = (signal) => signal?.aborted === true;
	})))();
}

//#endregion
//#region dist/hopper/HopperProviderCapabilities.js
var HOPPER_PROVIDER_IDENTITY, HOPPER_OPERATIONS, MUTATING_OPERATIONS, CAPABILITIES$1;
function init_HopperProviderCapabilities() {
	return (init_HopperProviderCapabilities = __esmMin((() => {
		HOPPER_PROVIDER_IDENTITY = Object.freeze({
			id: "hopper",
			name: "Hopper Disassembler",
			version: null
		});
		HOPPER_OPERATIONS = Object.freeze([
			"address_name",
			"comment",
			"current_address",
			"current_procedure",
			"current_document",
			"goto_address",
			"inline_comment",
			"list_bookmarks",
			"list_documents",
			"list_names",
			"list_procedures",
			"list_segments",
			"list_strings",
			"next_address",
			"prev_address",
			"procedure_address",
			"procedure_assembly",
			"procedure_callees",
			"procedure_callers",
			"procedure_info",
			"read_function_instructions",
			"read_bytes",
			"address_to_file_offset",
			"procedure_references",
			"procedure_pseudo_code",
			"resolve_containing_procedure",
			"search_procedures",
			"search_strings",
			"set_address_name",
			"set_addresses_names",
			"set_bookmark",
			"set_comment",
			"set_inline_comment",
			"unset_bookmark",
			"xrefs",
			"analyze_function"
		]);
		MUTATING_OPERATIONS = new Set([
			"set_address_name",
			"set_addresses_names",
			"set_bookmark",
			"set_comment",
			"set_inline_comment",
			"unset_bookmark"
		]);
		CAPABILITIES$1 = Object.freeze([...HOPPER_OPERATIONS, "search_bytes"].map((operation) => Object.freeze({
			provider: HOPPER_PROVIDER_IDENTITY,
			operation,
			...operation === "search_bytes" ? {
				available: false,
				reason: "Masked byte search has not been verified for Hopper."
			} : {
				available: true,
				reason: null
			},
			effects: Object.freeze({
				mutatesArtifact: MUTATING_OPERATIONS.has(operation),
				launchesProcess: true,
				mayShowUi: true,
				mayAccessNetwork: false,
				mayWriteFilesystem: MUTATING_OPERATIONS.has(operation),
				changesPermissions: false,
				requiresRoot: false
			}),
			limitations: Object.freeze([
				"Results depend on Hopper's completed static analysis.",
				...operation === "address_to_file_offset" ? ["Original-file coordinates require source bytes matching the selected executable digest. A changed, unavailable, or database-only source retains native mapping facts in partial error evidence."] : [],
				...operation === "search_strings" || operation === "search_procedures" ? ["Regex mode uses ECMAScript Unicode semantics in a supervised worker with a five-second matching deadline. Cancellation or deadline failure stops matching without blocking Hopper; literal mode retains native casefold semantics."] : [],
				...operation === "list_strings" || operation === "search_strings" || operation === "analyze_function" ? [
					"String values cover native typed objects. Hopper may split long literals into adjacent unterminated fragments; string searches match each object independently.",
					"Undecodable typed objects retain native display text with an explicit decoding unknown; these values do not establish decoded source literals.",
					"Reported string encodings are inferred from typed bytes and native display; the original source's intended encoding is unknown."
				] : []
			])
		})));
	})))();
}

//#endregion
//#region dist/hopper/HopperProvider.js
var HopperProvider;
function init_HopperProvider() {
	return (init_HopperProvider = __esmMin((() => {
		init_snapshotEnvironment();
		init_AnalysisProvider();
		init_binaryTargetTypes();
		init_analysisErrorCore();
		init_result();
		init_BridgeLauncher();
		init_HopperAnalysisProfile();
		init_HopperFileOffset();
		init_HopperRegexSearch();
		init_HopperClient();
		init_HopperMachOImage();
		init_HopperProviderCapabilities();
		HopperProvider = class {
			config;
			logger;
			platform;
			environment;
			/**
			* Host platform, injected so availability and launch-mode decisions can be
			* exercised for any host rather than only the machine running the suite.
			* Mirrors `GhidraProvider`, which already threads its installation host's
			* platform the same way.
			*/
			constructor(config, logger, environment, platform = process.platform) {
				this.config = config;
				this.logger = logger;
				this.platform = platform;
				this.environment = snapshotEnvironment(environment, platform);
			}
			identity() {
				return HOPPER_PROVIDER_IDENTITY;
			}
			capabilities() {
				return CAPABILITIES$1;
			}
			inspectAvailability() {
				const diagnostics = {
					launcher_path: this.config.hopperLauncherPath,
					platform: this.platform
				};
				if (this.platform !== "darwin" && this.platform !== "linux") return {
					status: "unavailable",
					code: "unsupported_host",
					reason: `Hopper integration is not supported on ${this.platform}.`,
					diagnostics
				};
				try {
					accessSync(this.config.hopperLauncherPath, constants.X_OK);
					if (!statSync(this.config.hopperLauncherPath).isFile()) throw new TypeError("Hopper launcher is not a regular file");
					return {
						status: "available",
						code: null,
						reason: null,
						diagnostics
					};
				} catch (cause) {
					void cause;
					return {
						status: "unavailable",
						code: "executable_missing",
						reason: `Hopper launcher is missing or not executable: ${this.config.hopperLauncherPath}`,
						diagnostics
					};
				}
			}
			inspectTargetSupport(target) {
				const diagnostics = {
					target_kind: target.kind,
					target_format: target.format,
					architecture: target.architecture ?? null
				};
				if (target.kind !== "executable" && target.kind !== "database") return {
					status: "unsupported",
					code: "target_kind_unsupported",
					reason: `Hopper cannot directly analyze ${target.kind} targets.`,
					diagnostics
				};
				if (target.kind === "database" && this.platform === "darwin") return {
					status: "unsupported",
					code: "target_kind_unsupported",
					reason: "This Hopper macOS launcher cannot start REA's analysis bridge when opening a saved Hopper database. Open an executable target instead; saved-database analysis is unavailable until Hopper exposes a database launch route that runs the bridge script.",
					diagnostics
				};
				if (target.kind === "database") return {
					status: "supported",
					code: null,
					reason: null,
					diagnostics
				};
				if (isElfMetadataArchitecture(target.architecture)) return {
					status: "unsupported",
					code: "architecture_unsupported",
					reason: `REA's Hopper adapter does not admit ${target.architecture === "mips" ? "MIPS" : target.architecture === "riscv" ? "RISC-V" : "PowerPC"} targets.`,
					diagnostics
				};
				if (target.format === "raw-binary") return {
					status: "unsupported",
					code: "target_format_unsupported",
					reason: "Headerless raw-binary analysis requires the Ghidra adapter with a caller-supplied architecture and entry point.",
					diagnostics
				};
				if (target.format === "dos-mz" || target.format === "dos-com") return {
					status: "unsupported",
					code: "target_format_unsupported",
					reason: "DOS MZ/COM analysis requires the Ghidra 16-bit real-mode adapter.",
					diagnostics
				};
				return {
					status: "supported",
					code: null,
					reason: null,
					diagnostics
				};
			}
			resolveAnalysisProfile(target, options) {
				return resolveHopperAnalysisProfile(target, {
					launcherPath: this.config.hopperLauncherPath,
					loaderArgsOverride: this.config.hopperLoaderArgs,
					provider: HOPPER_PROVIDER_IDENTITY,
					...options?.signal === undefined ? {} : { signal: options.signal }
				});
			}
			createClient(target, profile, context) {
				if (target.kind !== "executable" && target.kind !== "database") return {
					execute: (operation) => Promise.resolve(err(new AnalysisCapabilityUnavailableError(HOPPER_PROVIDER_IDENTITY.id, operation, `Hopper cannot open ${target.kind} targets directly. Inventory or extract the artifact first.`))),
					close: () => Promise.resolve(ok(null))
				};
				const preparation = profile?.parameters.prepared_image;
				const parsedImage = preparation === undefined ? undefined : hopperMachOImageSchema.safeParse(preparation);
				if (parsedImage?.success === false) return {
					execute: (operation) => Promise.resolve(err(new AnalysisCapabilityUnavailableError(HOPPER_PROVIDER_IDENTITY.id, operation, "Hopper prepared-image profile is malformed; resolve the analysis profile again."))),
					close: () => Promise.resolve(ok(null))
				};
				const preparedImage = parsedImage?.data;
				const container = preparedImage === undefined ? profile?.parameters.macho_container : "thin";
				const derivedLoaderArgs = hopperLoaderArgsForTarget(target, container === "thin" || container === "fat32" || container === "fat64" ? container : undefined);
				if (!derivedLoaderArgs.ok) return {
					execute: () => Promise.resolve(err(derivedLoaderArgs.error)),
					close: () => Promise.resolve(ok(null))
				};
				const executionProvider = profile?.provider ?? HOPPER_PROVIDER_IDENTITY;
				const client = new HopperClient({
					launcher: new HopperApplicationLauncher({
						environment: this.environment,
						launcherPath: this.config.hopperLauncherPath,
						targetPath: target.path,
						targetKind: target.kind,
						...preparedImage === undefined ? {} : { preparedImage: {
							image: preparedImage,
							sourceSha256: target.sha256
						} },
						loaderArgs: this.config.hopperLoaderArgs.length > 0 ? this.config.hopperLoaderArgs : derivedLoaderArgs.value,
						bridgeScriptPath: fileURLToPath(new URL("../../bridge/hopper_bridge.py", new URL("../hopper/HopperProvider.js", import.meta.url).href)),
						...this.platform === "linux" ? {
							launchMode: "verified_linux_demo",
							demoHelperPath: fileURLToPath(new URL("../../scripts/hopper-demo-x11.py", new URL("../hopper/HopperProvider.js", import.meta.url).href))
						} : { launchMode: "native" }
					}),
					...context === undefined ? {} : { runId: context.runId },
					startupTimeoutMs: this.config.hopperStartupTimeoutMs,
					logger: this.logger.child({ layer: "bridge" }),
					onDiagnostic: (diagnostic) => this.logger.info(diagnostic, "Hopper bridge reported a diagnostic")
				});
				const regexSearch = new HopperRegexSearch(client);
				const projectExecution = (operation, normalized, rawResult = null) => createAnalysisExecution(normalized, executionProvider, {
					rawResult,
					...profile === undefined ? {} : { analysisProfile: profile },
					...operation === "procedure_callers" || operation === "procedure_callees" || operation === "analyze_function" ? { relationshipCoverage: { status: "complete" } } : {},
					limitations: [
						...preparedImage === undefined ? [] : ["REA loaded a verified thin Mach-O slice from the original FAT source. Identity and file offsets refer to the original file. The owned temporary image and its Hopper document close together, including on MCP shutdown."],
						...CAPABILITIES$1.find((descriptor) => descriptor.operation === operation)?.limitations ?? [],
						...operation === "read_bytes" ? ["Hopper byte reads stop at the containing segment's exclusive end; a readable prefix is returned with complete=false when the requested range crosses it."] : [],
						...operation === "procedure_references" ? ["Native CallReference classifications and unresolved targets are preserved. Detailed reference flags and coverage beyond reported CallReference objects remain unknown."] : []
					]
				});
				return {
					execute: async (operation, parameters, options) => {
						const result = (operation === "search_strings" || operation === "search_procedures") && parameters.mode === "regex" ? await regexSearch.execute(operation, parameters, options) : await client.callTool(operation, parameters, options);
						if (!result.ok) return result;
						const mapped = operation === "address_to_file_offset" ? await mapHopperFileOffset(target, result.value, options?.signal) : result;
						return mapped.ok ? ok(projectExecution(operation, mapped.value, mapped === result ? null : result.value)) : mapped;
					},
					executeIfReady: async (operation, parameters, options) => {
						if (operation !== "list_documents" && operation !== "list_procedures") return undefined;
						const result = await client.callToolIfReady(operation, parameters, options?.signal === undefined ? {} : { signal: options.signal });
						if (result === undefined || !result.ok) return result;
						return ok(projectExecution(operation, result.value));
					},
					runtimeLineageSnapshots: () => {
						const observation = client.runtimeLineage();
						return observation === null ? [] : [{
							provider: executionProvider,
							observation
						}];
					},
					requestActivitySnapshots: () => {
						const activity = client.requestActivity();
						return [{
							provider: executionProvider,
							active: activity === null ? null : {
								requestId: activity.requestId,
								operation: activity.operation,
								elapsedMs: activity.elapsedMs,
								callerState: activity.callerState
							},
							queuedRequests: activity?.queuedRequests ?? 0
						}];
					},
					operationHealthSnapshot: () => client.operationHealth(),
					close: async (options) => {
						await regexSearch.close();
						return client.close(options);
					}
				};
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraDiagnostics.js
var GHIDRA_PROCESS_DIAGNOSTIC_BYTES, createGhidraDiagnostics, boundedStream;
function init_GhidraDiagnostics() {
	return (init_GhidraDiagnostics = __esmMin((() => {
		init_ProviderDiagnosticRedaction();
		GHIDRA_PROCESS_DIAGNOSTIC_BYTES = 8 * 1024 * 1024;
		createGhidraDiagnostics = (options) => {
			if (options.runtimeRoot === undefined && options.launch === undefined && Object.keys(options.previous).length > 0) return options.previous;
			return {
				target_path: options.targetPath,
				target_sha256: options.targetSha256,
				...options.targetAdmission === undefined ? {} : { target_admission: options.targetAdmission },
				transport: options.transport,
				provider_version: options.providerVersion,
				profile_digest: options.profileDigest,
				...options.runId === undefined ? {} : { run_id: options.runId },
				...options.runtimeRoot === undefined ? {} : { runtime_root: options.runtimeRoot },
				...options.socketRoot === undefined ? {} : { socket_root: options.socketRoot },
				...options.endpointPath === undefined ? {} : { endpoint_path: options.endpointPath },
				...options.launch === undefined ? {} : {
					project_root: options.launch.projectRoot,
					ghidra_log_path: options.launch.ghidraLogPath,
					script_log_path: options.launch.scriptLogPath,
					process_id: options.launch.process.pid ?? null,
					...options.launch.launchSupport === undefined ? {} : { launch_support: options.launch.launchSupport.map((output) => ({ ...output })) }
				},
				...options.snapshot === undefined ? {} : {
					exit_code: options.snapshot.exitCode ?? null,
					exit_signal: options.snapshot.signal ?? null,
					diagnostic_truncated: options.snapshot.diagnosticTruncated === true,
					stdout: boundedStream(options.snapshot.stdout, options.token),
					stderr: boundedStream(options.snapshot.stderr, options.token)
				}
			};
		};
		boundedStream = (stream, token) => ({
			text: redactCapturedTransportCredential(stream, token, "[REDACTED]"),
			bytes: stream.observedBytes,
			retained_bytes: stream.bytes
		});
	})))();
}

//#endregion
//#region dist/ghidra/GhidraAnalysisSeeds.js
var GHIDRA_SEED_FORMAT, GHIDRA_SEED_SCRIPT, MAX_GHIDRA_SEED_BYTES, MAX_GHIDRA_SEED_ENTRIES, MAX_SEED_NAME_LENGTH, digest$1, count, ghidraSeedCommitmentSchema, ghidraSeedReportSchema, seedLineError, parseGhidraSeeds, normalizedSeeds, readSeedFile, sha256$1, decodeSeeds, resolveGhidraAnalysisSeeds, snapshotGhidraAnalysisSeeds, totalEntries, ghidraSeedFailure, ghidraSeedLimitations;
function init_GhidraAnalysisSeeds() {
	return (init_GhidraAnalysisSeeds = __esmMin((() => {
		init_configurationErrors();
		init_providerAdapterError();
		init_result();
		GHIDRA_SEED_FORMAT = "rea-ghidra-seeds-v1";
		GHIDRA_SEED_SCRIPT = "ReaGhidraApplySeeds.java";
		MAX_GHIDRA_SEED_BYTES = 32 * 1024 * 1024;
		MAX_GHIDRA_SEED_ENTRIES = 1e6;
		MAX_SEED_NAME_LENGTH = 2e3;
		digest$1 = z.string().regex(/^[a-f0-9]{64}$/u);
		count = z.number().int().nonnegative();
		ghidraSeedCommitmentSchema = z.strictObject({
			format: z.literal(GHIDRA_SEED_FORMAT),
			path: z.string().refine(isAbsolute, "Seed path must be absolute"),
			configured_path: z.string().refine(isAbsolute, "Seed path must be absolute"),
			sha256: digest$1,
			entries: z.strictObject({
				function: count,
				code: count,
				label: count
			})
		});
		ghidraSeedReportSchema = z.strictObject({
			format: z.literal(GHIDRA_SEED_FORMAT),
			sha256: digest$1,
			entries: count,
			function_created: count,
			function_existing: count,
			function_failed: count,
			code_decoded: count,
			code_failed: count,
			label_applied: count,
			label_failed: count,
			unmapped: count
		});
		seedLineError = (line, constraint) => new ConfigurationError("Invalid REA environment configuration", { settings: [{
			setting: "REA_GHIDRA_SEED_FILE",
			constraint: `line ${line}: ${constraint}`
		}] });
		parseGhidraSeeds = (text) => {
			const entries = [];
			const seen = new Set();
			const lines = text.split("\n");
			for (const [index, raw] of lines.entries()) {
				const line = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
				if (line.trim() === "" || line.startsWith("#")) continue;
				const number = index + 1;
				const fields = line.split("	");
				if (fields.length < 2 || fields.length > 3) return err(seedLineError(number, "expected address<TAB>kind[<TAB>name]"));
				const [address, kind, name] = fields;
				if (address === undefined || !/^0x[0-9a-fA-F]{1,16}$/u.test(address)) return err(seedLineError(number, "address must be 0x-prefixed hex"));
				if (kind !== "function" && kind !== "code" && kind !== "label") return err(seedLineError(number, "kind must be function, code or label"));
				if (name !== undefined && (name.length === 0 || name.length > MAX_SEED_NAME_LENGTH || /[\s\0]/u.test(name))) return err(seedLineError(number, `name must be 1..${MAX_SEED_NAME_LENGTH} characters without whitespace`));
				if (kind === "label" && name === undefined) return err(seedLineError(number, "a label seed requires a name"));
				if (kind === "code" && name !== undefined) return err(seedLineError(number, "a code seed takes no name; add a label seed"));
				const value = BigInt(address);
				const key = `${value.toString(16)}:${kind}`;
				if (seen.has(key)) return err(seedLineError(number, `duplicate ${kind} seed at ${address}`));
				seen.add(key);
				entries.push({
					address: value,
					kind,
					...name === undefined ? {} : { name }
				});
				if (entries.length > 1e6) return err(seedLineError(number, `more than ${MAX_GHIDRA_SEED_ENTRIES} seed entries`));
			}
			return ok(entries);
		};
		normalizedSeeds = (entries) => entries.map((entry) => `0x${entry.address.toString(16)}\t${entry.kind}${entry.name === undefined ? "" : `\t${entry.name}`}\n`).join("");
		readSeedFile = async (path) => {
			const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
			try {
				const stat = await file.stat();
				if (!stat.isFile() || stat.size > 33554432) throw new Error(`Ghidra seed file must be a regular file of at most ${MAX_GHIDRA_SEED_BYTES} bytes: ${path}`);
				const bytes = Buffer.alloc(stat.size);
				let offset = 0;
				while (offset < bytes.length) {
					const read = await file.read(bytes, offset, bytes.length - offset, offset);
					if (read.bytesRead === 0) throw new Error(`Incomplete Ghidra seed file read: ${path}`);
					offset += read.bytesRead;
				}
				return bytes;
			} finally {
				await file.close();
			}
		};
		sha256$1 = (bytes) => createHash("sha256").update(bytes).digest("hex");
		decodeSeeds = (bytes) => {
			const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
			return parseGhidraSeeds(text);
		};
		resolveGhidraAnalysisSeeds = async (configured) => {
			if (configured === undefined) return ok(undefined);
			let bytes;
			let path;
			try {
				path = await realpath(configured);
				bytes = await readSeedFile(path);
			} catch (cause) {
				return err(new ProviderAdapterError("ghidra", "resolve_analysis_profile", {
					cause,
					diagnostics: {
						setting: "REA_GHIDRA_SEED_FILE",
						path: configured,
						reason: cause instanceof Error ? cause.message : String(cause)
					}
				}));
			}
			let parsed;
			try {
				parsed = decodeSeeds(bytes);
			} catch {
				return err(seedLineError(0, "file is not valid UTF-8"));
			}
			if (!parsed.ok) return parsed;
			const normalized = normalizedSeeds(parsed.value);
			const tally = {
				function: 0,
				code: 0,
				label: 0
			};
			for (const entry of parsed.value) tally[entry.kind] += 1;
			return ok({
				format: GHIDRA_SEED_FORMAT,
				path,
				configured_path: configured,
				sha256: sha256$1(normalized),
				entries: tally
			});
		};
		snapshotGhidraAnalysisSeeds = async (commitment, runtimeRoot) => {
			ghidraSeedCommitmentSchema.parse(commitment);
			if (await realpath(commitment.configured_path) !== commitment.path) throw new Error("Ghidra seed file resolved path differs from explicit configuration");
			const parsed = decodeSeeds(await readSeedFile(commitment.path));
			if (!parsed.ok) throw parsed.error;
			const normalized = normalizedSeeds(parsed.value);
			if (sha256$1(normalized) !== commitment.sha256) throw new Error(`Ghidra seed file changed after the analysis profile was committed: ${commitment.path}`);
			const directory = join(runtimeRoot, "seeds");
			await mkdir(directory, { mode: 448 });
			const path = join(directory, "seeds.tsv");
			await writeFile(path, normalized, {
				flag: "wx",
				mode: 384
			});
			return path;
		};
		totalEntries = (commitment) => commitment.entries.function + commitment.entries.code + commitment.entries.label;
		ghidraSeedFailure = (commitment, report, operation) => {
			if (commitment === undefined && report === undefined) return undefined;
			const reason = commitment === undefined ? "The Ghidra session reported analysis seeds that the profile did not commit." : report === undefined ? "The Ghidra session did not report the committed analysis seeds." : report.sha256 !== commitment.sha256 || report.entries !== totalEntries(commitment) ? "The Ghidra session applied analysis seeds that differ from the committed profile." : undefined;
			return reason === undefined ? undefined : new ProviderAdapterError("ghidra", operation, { diagnostics: { reason } });
		};
		ghidraSeedLimitations = (commitment, report) => commitment === undefined ? [] : [`Ghidra analysis was seeded before auto-analysis from ${commitment.path} (sha256 ${commitment.sha256}: ${commitment.entries.function} function, ${commitment.entries.code} code, ${commitment.entries.label} label entries). Seeded functions, code and names are caller assertions, not Ghidra discoveries.`, ...report === undefined ? [] : [`Seed outcome: ${report.function_created} functions created, ${report.function_existing} already present, ${report.function_failed} failed; ${report.code_decoded} code seeds decoded, ${report.code_failed} failed; ${report.label_applied} labels applied, ${report.label_failed} failed; ${report.unmapped} seeds outside initialized memory.`]];
	})))();
}

//#endregion
//#region dist/ghidra/GhidraJavaLaunch.js
var GHIDRA_LAUNCH_SUPPORT_CAPTURE_BYTES, GhidraLaunchSupportError, jvmEnvironmentArguments, rejectJvmPlatformOverrides, ghidraJavaLaunch;
function init_GhidraJavaLaunch() {
	return (init_GhidraJavaLaunch = __esmMin((() => {
		init_snapshotEnvironment();
		init_ExecFileOutput();
		GHIDRA_LAUNCH_SUPPORT_CAPTURE_BYTES = 64 * 1024;
		GhidraLaunchSupportError = class extends Error {
			outcome;
			constructor(phase, cause) {
				super(`Ghidra LaunchSupport ${phase} failed`, { cause });
				this.name = "GhidraLaunchSupportError";
				const outcome = execFileOutputFailure(cause);
				this.outcome = outcome === undefined ? undefined : {
					...outcome,
					killed: outcome.code === "ABORT_ERR" ? null : outcome.killed,
					outputTruncated: outcome.code === "ABORT_ERR" ? null : outcome.outputTruncated
				};
			}
		};
		jvmEnvironmentArguments = (value) => {
			const arguments_ = [];
			let argument = "";
			let quote;
			for (const character of value) {
				if (quote !== undefined) {
					if (character === quote) quote = undefined;
					else argument += character;
				} else if (character === "'" || character === "\"") quote = character;
				else if (/\s/u.test(character)) {
					if (argument !== "") arguments_.push(argument);
					argument = "";
				} else argument += character;
			}
			if (quote !== undefined) throw new Error("Invalid quoted Ghidra LaunchSupport JVM environment option");
			if (argument !== "") arguments_.push(argument);
			return arguments_;
		};
		rejectJvmPlatformOverrides = (arguments_) => {
			if (arguments_.some((argument) => /^-Dos\.(?:arch|name)(?:=|$)/u.test(argument))) throw new Error("Ghidra LaunchSupport may not override os.arch or os.name; the native decompiler was validated for the inspected JVM platform.");
		};
		ghidraJavaLaunch = async (options) => {
			const supportRoot = dirname(options.analyzeHeadlessPath);
			const installRoot = dirname(supportRoot);
			const selectedJavaHome = options.javaHome ?? options.environment.JAVA_HOME;
			const command = selectedJavaHome === undefined ? options.platform === "win32" ? "java.exe" : "java" : join(selectedJavaHome, "bin", options.platform === "win32" ? "java.exe" : "java");
			const isolatedProperties = [`-Duser.home=${options.homeRoot}`, `-Djava.io.tmpdir=${options.tempRoot}`];
			const supportArguments = [
				...isolatedProperties,
				.../^(?:OpenJDK|Java HotSpot\(TM\)) (?:64-Bit )?(?:Server|Client|Zero) VM$/u.test(options.javaVmName ?? "") ? ["-Xlog:disable", "-Xlog:all=warning:stderr"] : [],
				"-cp",
				join(supportRoot, "LaunchSupport.jar"),
				"LaunchSupport",
				installRoot
			];
			const environment = { ...snapshotEnvironment(options.environment, options.platform) };
			const supportOutput = async (phase) => {
				try {
					return await execFileOutput(command, [...supportArguments, phase], {
						env: environment,
						maxBuffer: GHIDRA_LAUNCH_SUPPORT_CAPTURE_BYTES,
						stopSignal: "SIGTERM",
						...options.signal === undefined ? {} : { signal: options.signal }
					});
				} catch (cause) {
					throw new GhidraLaunchSupportError(phase, cause);
				}
			};
			const configuredEnvironment = await supportOutput("-envvars");
			options.onStderr("-envvars", configuredEnvironment.stderr);
			for (const line of configuredEnvironment.stdout.split(/\r?\n/u)) {
				if (line === "") continue;
				const separator = line.indexOf("=");
				const sourceKey = line.slice(0, separator);
				const key = options.platform === "win32" ? sourceKey.toUpperCase() : sourceKey;
				if (separator < 1 || !/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key)) throw new Error(`Invalid Ghidra LaunchSupport environment entry: ${line}`);
				if ((environment[key] ?? "") === "") environment[key] = line.slice(separator + 1);
			}
			for (const key of [
				"JAVA_TOOL_OPTIONS",
				"_JAVA_OPTIONS",
				"JDK_JAVA_OPTIONS"
			]) {
				rejectJvmPlatformOverrides(jvmEnvironmentArguments(environment[key] ?? ""));
			}
			const configuredArguments = await supportOutput("-vmargs");
			options.onStderr("-vmargs", configuredArguments.stderr);
			const vmArguments = configuredArguments.stdout.split(/\r?\n/u).filter((line) => line !== "");
			if (vmArguments.some((argument) => !argument.startsWith("-") || argument.includes("\0"))) throw new Error("Invalid Ghidra LaunchSupport JVM argument");
			rejectJvmPlatformOverrides(vmArguments);
			return {
				command,
				environment,
				arguments: [
					...vmArguments,
					...options.platform === "darwin" ? ["-Xdock:name=Ghidra-Headless"] : [],
					`-Xmx${environment.GHIDRA_HEADLESS_MAXMEM || environment.GHIDRA_MAXMEM || "2G"}`,
					"-XX:ParallelGCThreads=2",
					"-XX:CICompilerCount=2",
					"-Djava.awt.headless=true",
					...isolatedProperties,
					"-showversion",
					"-cp",
					join(installRoot, "Ghidra", "Framework", "Utility", "lib", "Utility.jar"),
					"ghidra.Ghidra",
					"ghidra.app.util.headless.AnalyzeHeadless",
					...options.arguments
				]
			};
		};
	})))();
}

//#endregion
//#region dist/ghidra/extensions/nativeaot/NativeAotReport.js
var report, validateNonRecoveryMetadata, validateNativeAotReport, validateRecoveredMetadata;
function init_NativeAotReport() {
	return (init_NativeAotReport = __esmMin((() => {
		report = z.object({
			id: z.literal("nativeaot"),
			integration_api: z.literal(1),
			source_revision: z.literal("effeb734fc570c32650f88b159608979dc7b423e"),
			source_revision_authority: z.literal("build-reported-unattested"),
			status: z.enum([
				"complete",
				"partial",
				"not_applicable",
				"unsupported",
				"failed"
			]),
			reason: z.string().nullable(),
			method_tables: z.number().int().nonnegative(),
			diagnostics: z.array(z.string()),
			header_address: z.string().regex(/^0x[0-9a-f]+$/u).optional(),
			discovery: z.enum(["symbol", "signature-heuristic"]).optional(),
			format_major: z.number().int().optional(),
			format_minor: z.number().int().optional(),
			derived_memory: z.object({
				address: z.string().regex(/^0x[0-9a-f]+$/u),
				size_bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				file_offset: z.null()
			}).optional(),
			coverage: z.strictObject({
				frozen_object_candidates: z.number().int().nonnegative(),
				frozen_objects_annotated: z.number().int().nonnegative(),
				basis: z.literal("rehydrated-pointer-candidates-and-committed-instance-types")
			}).optional(),
			types: z.array(z.object({
				address: z.string().regex(/^0x[0-9a-f]+$/u),
				type: z.string().min(1)
			})).optional()
		}).strict();
		validateNonRecoveryMetadata = (value, recovered) => {
			if (recovered) return null;
			if (value.reason === null || value.reason.trim().length === 0) return "NativeAOT non-recovery status omits its required reason.";
			return value.method_tables !== 0 || value.types !== undefined || value.derived_memory !== undefined || value.coverage !== undefined ? "NativeAOT non-recovery status carries recovered metadata." : null;
		};
		validateNativeAotReport = (value) => {
			if (value.status === "failed" && typeof value.result.loader_failure === "string" && value.result.loader_failure === value.reason) return null;
			const parsed = report.safeParse(value.result);
			if (!parsed.success || parsed.data.status !== value.status || parsed.data.reason !== value.reason) return "NativeAOT extension returned a malformed or inconsistent producer report.";
			return validateRecoveredMetadata(parsed.data);
		};
		validateRecoveredMetadata = (value) => {
			const recovered = ["complete", "partial"].includes(value.status);
			if (recovered && (value.method_tables === 0 || value.format_major !== 9 || value.format_minor !== 1 || value.types?.length !== value.method_tables || value.derived_memory === undefined || value.header_address === undefined || value.discovery === undefined || value.coverage === undefined || value.reason !== null)) return "NativeAOT recovery omitted its supported format, method-table inventory or derived-memory identity.";
			const nonRecoveryInvalid = validateNonRecoveryMetadata(value, recovered);
			if (nonRecoveryInvalid !== null) return nonRecoveryInvalid;
			const coverage = value.coverage;
			if (coverage !== undefined && (coverage.frozen_objects_annotated > coverage.frozen_object_candidates || value.status === "complete" && coverage.frozen_objects_annotated !== coverage.frozen_object_candidates)) return "NativeAOT recovery coverage contradicts its reported completion status.";
			const types = value.types ?? [];
			if (new Set(types.map((type) => type.address)).size !== types.length) return "NativeAOT recovery repeated a method-table identity.";
			return null;
		};
	})))();
}

//#endregion
//#region dist/ghidra/extensions/nativeaot/NativeAotAdapter.js
var nativeAotAdapter;
function init_NativeAotAdapter() {
	return (init_NativeAotAdapter = __esmMin((() => {
		init_NativeAotReport();
		nativeAotAdapter = {
			id: "nativeaot",
			entryClass: "rea.extensions.nativeaot.NativeAotExtension",
			configuredPath: (config) => config.ghidraNativeAotJar,
			unsupportedReason: (target, platform) => platform !== "linux" ? {
				constraint: "host",
				reason: "NativeAOT recovery is verified on Linux only; omit REA_GHIDRA_NATIVEAOT_JAR for ordinary native analysis."
			} : !["elf", "pe"].includes(target.format) || target.architecture !== "x86_64" || target.managed === true ? {
				constraint: "target",
				reason: "NativeAOT recovery requires an x86-64 ELF or native PE target on Linux; PE/CLI and ReadyToRun assemblies use inspect_managed_artifact; omit REA_GHIDRA_NATIVEAOT_JAR for ordinary native analysis."
			} : null,
			validate: validateNativeAotReport,
			limitations: [
				"Optional NativeAOT recovery is verified for .NET 8.0.22 RTR 9.1 Linux x64 ELF and Windows x64 PE targets on a Linux host. Other runtime layouts, target architectures and hosts are unsupported.",
				"Type names and relationships use recovery heuristics; original C# source and custom field layouts are not recovered. Rehydrated analysis-memory bytes are derived, without original file offsets or runtime observations.",
				"Method prototypes are Ghidra inferences, not original signatures. Pre-recovery conventions are retained; new functions use the loaded compiler default. Verify parameter roles against instructions and call sites.",
				"The configured extension retains its actual JAR digest. Its reported source revision is not an attestation of caller-supplied build bytes."
			]
		};
	})))();
}

//#endregion
//#region dist/ghidra/extensions/GhidraExtensions.js
var digest, ghidraExtensionSchema, ghidraExtensionResultSchema, adapters, MAX_EXTENSION_BYTES, readJar, resolveGhidraExtensions, validateGhidraExtensionProfile, extensionRefusalError, snapshotGhidraExtensions, validateGhidraExtensionResults, ghidraExtensionLimitations;
function init_GhidraExtensions() {
	return (init_GhidraExtensions = __esmMin((() => {
		init_analysisErrorCore();
		init_providerAdapterError();
		init_jsonValue();
		init_result();
		init_NativeAotAdapter();
		digest = z.string().regex(/^[a-f0-9]{64}$/u);
		ghidraExtensionSchema = z.strictObject({
			id: z.string().regex(/^[a-z][a-z0-9\x2d]*$/u),
			path: z.string().refine(isAbsolute, "Extension path must be absolute"),
			configured_path: z.string().refine(isAbsolute, "Extension path must be absolute"),
			sha256: digest,
			entry_class: z.string().min(1),
			integration_api: z.literal(1)
		});
		ghidraExtensionResultSchema = z.strictObject({
			id: z.string().min(1),
			sha256: digest,
			status: z.enum([
				"complete",
				"partial",
				"not_applicable",
				"unsupported",
				"failed"
			]),
			reason: z.string().nullable(),
			result: jsonObjectSchema
		});
		adapters = [nativeAotAdapter];
		MAX_EXTENSION_BYTES = 8 * 1024 * 1024;
		readJar = async (path) => {
			const file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
			try {
				const stat = await file.stat();
				if (!stat.isFile() || stat.size < 4 || stat.size > MAX_EXTENSION_BYTES) throw new Error(`Ghidra extension must be a regular JAR of 4..${MAX_EXTENSION_BYTES} bytes: ${path}`);
				const bytes = Buffer.alloc(stat.size);
				let offset = 0;
				while (offset < bytes.length) {
					const read = await file.read(bytes, offset, bytes.length - offset, offset);
					if (read.bytesRead === 0) throw new Error(`Incomplete Ghidra extension read: ${path}`);
					offset += read.bytesRead;
				}
				const extra = Buffer.alloc(1);
				if ((await file.read(extra, 0, 1, offset)).bytesRead !== 0 || bytes.readUInt32LE(0) !== 67324752) throw new Error(`Ghidra extension changed during read or is not a JAR: ${path}`);
				return bytes;
			} finally {
				await file.close();
			}
		};
		resolveGhidraExtensions = async (config, target, platform, signal) => {
			const extensions = [];
			for (const adapter of adapters) {
				if (signal?.aborted) return err(new AnalysisCancelledError("open_binary"));
				const configured = adapter.configuredPath(config);
				if (configured === undefined) continue;
				const refusal = adapter.unsupportedReason(target, platform);
				if (refusal !== null) return err(extensionRefusalError(refusal, target));
				try {
					const path = await realpath(configured);
					const bytes = await readJar(path);
					extensions.push({
						id: adapter.id,
						path,
						configured_path: configured,
						sha256: createHash("sha256").update(bytes).digest("hex"),
						entry_class: adapter.entryClass,
						integration_api: 1
					});
				} catch (cause) {
					return err(new ProviderAdapterError("ghidra", "resolve_analysis_profile", {
						cause,
						diagnostics: {
							extension: adapter.id,
							path: configured,
							reason: cause instanceof Error ? cause.message : String(cause)
						}
					}));
				}
			}
			if (signal?.aborted) return err(new AnalysisCancelledError("open_binary"));
			return ok(extensions);
		};
		validateGhidraExtensionProfile = (extensions, config, target, platform) => {
			const enabled = adapters.filter((adapter) => adapter.configuredPath(config) !== undefined);
			if (enabled.length !== extensions.length || new Set(extensions.map((extension) => extension.id)).size !== extensions.length) return "Configured Ghidra extension inventory differs from the resolved analysis profile.";
			for (const extension of extensions) {
				const adapter = enabled.find((value) => value.id === extension.id);
				if (adapter === undefined || adapter.entryClass !== extension.entry_class || adapter.configuredPath(config) !== extension.configured_path) return `Ghidra extension profile lacks matching explicit local configuration: ${extension.id}`;
				const refusal = adapter.unsupportedReason(target, platform);
				if (refusal !== null) return refusal.reason;
			}
			return null;
		};
		extensionRefusalError = (refusal, target) => refusal.constraint === "host" ? new AnalysisCapabilityUnavailableError("ghidra", "resolve_analysis_profile", refusal.reason, { userMessage: refusal.reason }) : new AnalysisUnsupportedTargetError("resolve_analysis_profile", target.path, refusal.reason, { remediationAction: refusal.reason });
		snapshotGhidraExtensions = async (extensions, runtimeRoot) => {
			if (extensions.length === 0) return [];
			for (const extension of extensions) {
				ghidraExtensionSchema.parse(extension);
				const adapter = adapters.find((value) => value.id === extension.id);
				if (adapter === undefined || adapter.entryClass !== extension.entry_class) throw new Error(`Unregistered Ghidra extension identity: ${extension.id}`);
				if (await realpath(extension.configured_path) !== extension.path) throw new Error(`Ghidra extension resolved path differs from explicit configuration: ${extension.id}`);
			}
			const directory = join(runtimeRoot, "extensions");
			await mkdir(directory, { mode: 448 });
			const result = [];
			for (const extension of extensions) {
				const bytes = await readJar(extension.path);
				if (createHash("sha256").update(bytes).digest("hex") !== extension.sha256) throw new Error(`Ghidra extension digest differs from committed profile: ${extension.id} (${extension.path})`);
				const path = join(directory, `${extension.id}.jar`);
				await writeFile(path, bytes, {
					flag: "wx",
					mode: 384
				});
				result.push({
					...extension,
					path
				});
			}
			return result;
		};
		validateGhidraExtensionResults = (expected, results) => {
			if (results.length !== expected.length || new Set(results.map((result) => result.id)).size !== results.length) return "Ghidra extension result inventory differs from its committed profile.";
			for (const extension of expected) {
				const result = results.find((value) => value.id === extension.id);
				const adapter = adapters.find((value) => value.id === extension.id);
				if (result === undefined || adapter === undefined || result.sha256 !== extension.sha256) return `Ghidra extension identity mismatch: ${extension.id}`;
				const invalid = adapter.validate(result);
				if (invalid !== null) return invalid;
			}
			return null;
		};
		ghidraExtensionLimitations = (extensions) => adapters.filter((adapter) => extensions.some((extension) => extension.id === adapter.id)).flatMap((adapter) => adapter.limitations);
	})))();
}

//#endregion
//#region dist/ghidra/GhidraPspExtension.js
var ghidraPspExtensionSchema, MAX_ENTRIES, MAX_BYTES, MAX_DEPTH, REQUIRED, inspectGhidraPspExtension, resolveGhidraPspExtension;
function init_GhidraPspExtension() {
	return (init_GhidraPspExtension = __esmMin((() => {
		init_RegularFile();
		init_analysisErrorCore();
		init_result();
		init_GhidraJavaProperties();
		ghidraPspExtensionSchema = z.strictObject({
			id: z.literal("ghidra-allegrex"),
			root: z.string().refine(isAbsolute),
			ghidra_version: z.string().min(1),
			sha256: z.string().regex(/^[a-f0-9]{64}$/u)
		});
		MAX_ENTRIES = 1024;
		MAX_BYTES = 64 * 1024 * 1024;
		MAX_DEPTH = 16;
		REQUIRED = [
			"Module.manifest",
			"extension.properties",
			"data/languages/allegrex.ldefs",
			"data/languages/allegrex.sla",
			"data/languages/allegrex.pspec",
			"data/languages/allegrex.cspec"
		];
		inspectGhidraPspExtension = async (root, ghidraVersion, signal) => {
			signal?.throwIfAborted();
			if (!isAbsolute(root) || await realpath(root) !== root) throw new Error("The installed Allegrex directory must be a canonical non-symlink path.");
			const files = [];
			let entries = 1;
			const visit = async (relative, depth) => {
				signal?.throwIfAborted();
				if (depth > MAX_DEPTH) throw new Error("Allegrex extension directory nesting exceeds the inspection limit.");
				const path = join(root, relative);
				const metadata = await lstat(path);
				if (metadata.isDirectory()) {
					const children = [];
					for await (const child of await opendir(path)) {
						signal?.throwIfAborted();
						if (++entries > MAX_ENTRIES) throw new Error("Allegrex extension inventory exceeds the inspection limit.");
						children.push(child.name);
					}
					children.sort();
					for (const child of children) await visit(relative === "" ? child : `${relative}/${child}`, depth + 1);
				} else if (metadata.isFile()) {
					files.push(relative);
				} else throw new Error(`Allegrex extension entries must be regular files or directories: ${relative}`);
			};
			await visit("", 0);
			for (const required of REQUIRED) if (!files.includes(required)) throw new Error(`Missing installed Allegrex component: ${required}`);
			if (!files.some((path) => path.startsWith("lib/") && path.endsWith(".jar"))) throw new Error("The installed Allegrex extension has no loader JAR.");
			const hash = createHash("sha256");
			let bytesRead = 0;
			let properties = Buffer.alloc(0);
			for (const relative of files) {
				signal?.throwIfAborted();
				const path = join(root, relative);
				const handle = await openRegularFile(path, {
					symlinks: "reject",
					signal
				});
				try {
					const before = await handle.stat();
					if (!Number.isSafeInteger(before.size) || before.size > MAX_BYTES - bytesRead) throw new Error("Allegrex extension bytes exceed the inspection limit.");
					if (relative === "extension.properties" && before.size > 65536) throw new Error("Allegrex extension properties exceed the inspection limit.");
					hash.update(JSON.stringify([relative, before.size]));
					const buffer = Buffer.alloc(Math.min(65536, before.size + 1));
					let offset = 0;
					const chunks = [];
					while (offset < before.size) {
						signal?.throwIfAborted();
						const read = await handle.read(buffer, 0, Math.min(buffer.length, before.size - offset), offset);
						if (read.bytesRead === 0) throw new Error(`Truncated Allegrex component: ${relative}`);
						const chunk = buffer.subarray(0, read.bytesRead);
						hash.update(chunk);
						if (relative === "extension.properties") chunks.push(Buffer.from(chunk));
						offset += read.bytesRead;
					}
					if (!sameRegularFileState(before, await handle.stat()) || !sameRegularFileState(before, await lstat(path))) throw new Error(`Allegrex component changed during inspection: ${relative}`);
					bytesRead += before.size;
					if (relative === "extension.properties") properties = Buffer.concat(chunks);
				} finally {
					await handle.close();
				}
			}
			const parsedProperties = parseGhidraJavaProperties(properties.toString("latin1"));
			if (!parsedProperties.ok) throw new Error(`Invalid Allegrex extension properties: ${parsedProperties.error}`);
			const property = (name) => parsedProperties.value.get(name);
			if (property("name") !== "ghidra-allegrex" || property("version") !== ghidraVersion) throw new Error(`Allegrex extension metadata does not match the selected Ghidra ${ghidraVersion}; install or rebuild a compatible extension.`);
			signal?.throwIfAborted();
			return {
				id: "ghidra-allegrex",
				root,
				ghidra_version: ghidraVersion,
				sha256: hash.digest("hex")
			};
		};
		resolveGhidraPspExtension = async (installation, signal) => {
			if (signal?.aborted) return err(new AnalysisCancelledError("resolve_analysis_profile"));
			try {
				if (installation.status !== "available" || installation.platform !== "linux" || installation.architecture !== "x64") throw new Error("The initial PSP profile requires a supported Linux x64 Ghidra installation.");
				const root = join(await realpath(installation.installDir), "Ghidra", "Extensions", "ghidra-allegrex");
				return ok(await inspectGhidraPspExtension(root, installation.providerVersion, signal));
			} catch (cause) {
				if (signal?.aborted) return err(new AnalysisCancelledError("resolve_analysis_profile"));
				const reason = `PSP_EXTENSION_UNAVAILABLE: ${cause instanceof Error ? cause.message : String(cause)} Use a compatible caller-installed ghidra-allegrex under GHIDRA_INSTALL_DIR/Ghidra/Extensions; REA does not install it.`;
				return err(new AnalysisCapabilityUnavailableError("ghidra", "resolve_analysis_profile", reason, {
					cause,
					userMessage: reason
				}));
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraLauncher.js
var GHIDRA_LAUNCH_COMMAND_OUTPUT_BYTES, GhidraLaunchError, ghidraLaunchCommandOutput, GhidraHeadlessLauncher, ownedGhidraLaunch, ownedGhidraProcess, ghidraHeadlessCommand, ghidraBatchStep, cleanupStartedProcess, ghidraHeadlessArguments, ghidraRuntimePaths, ghidraConfigReleaseDirectory, createGhidraRuntimeDirectories, writeGhidraRuntimeFile, ghidraLaunchEnvironment, ghidraHeadlessJavaOptions, isAborted$2;
function init_GhidraLauncher() {
	return (init_GhidraLauncher = __esmMin((() => {
		init_GhidraJavaProperties();
		init_GhidraAnalysisSeeds();
		init_snapshotEnvironment();
		init_WindowsPrivateRuntime();
		init_WindowsBatchCommand();
		init_analysisErrorCore();
		init_result();
		init_ExecFileOutput();
		init_boundedUtf8Text();
		init_ProviderDiagnosticRedaction();
		init_ProcessOwnership();
		init_ProviderProcess();
		init_GhidraInstallation();
		init_GhidraJavaLaunch();
		init_GhidraExtensions();
		init_GhidraPspExtension();
		GHIDRA_LAUNCH_COMMAND_OUTPUT_BYTES = 8 * 1024;
		GhidraLaunchError = class extends Error {
			#partialLaunch;
			#capturedOutput;
			launchSupport;
			constructor(message, options) {
				const { partialLaunch, capturedOutput, launchSupport, ...errorOptions } = options ?? {};
				super(message, errorOptions);
				this.name = "GhidraLaunchError";
				this.#partialLaunch = partialLaunch;
				this.#capturedOutput = capturedOutput === undefined ? undefined : { ...capturedOutput };
				this.launchSupport = (launchSupport ?? []).map((output) => ({ ...output }));
			}
			/** Process ownership retained for the client to retry an incomplete rollback. */
			get partialLaunch() {
				return this.#partialLaunch;
			}
			/** Launcher command outcome retained when a launch command reported one. */
			get capturedOutput() {
				return this.#capturedOutput === undefined ? undefined : { ...this.#capturedOutput };
			}
		};
		ghidraLaunchCommandOutput = (cause) => {
			const failure = execFileOutputFailure(cause);
			if (failure === undefined) return undefined;
			return {
				stdout: failure.stdout,
				stderr: failure.stderr,
				truncated: failure.outputTruncated,
				exit_code: typeof failure.code === "number" ? failure.code : null,
				signal: failure.signal
			};
		};
		GhidraHeadlessLauncher = class {
			options;
			constructor(options) {
				this.options = {
					...options,
					environment: snapshotEnvironment(options.environment, options.platform)
				};
			}
			async launch(session, options = {}) {
				if (isAborted$2(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				const paths = ghidraRuntimePaths(session.runtimeRoot);
				const platform = this.options.platform ?? process.platform;
				let started;
				const launchSupport = [];
				try {
					const psp = this.options.pspExtension;
					if (psp !== undefined) {
						const installedRoot = await realpath(join(dirname(this.options.analyzeHeadlessPath), "..", "Ghidra", "Extensions", "ghidra-allegrex"));
						if (installedRoot !== psp.root) throw new GhidraLaunchError("Allegrex profile does not belong to the selected Ghidra installation.");
						const inspected = await inspectGhidraPspExtension(psp.root, psp.ghidra_version, options.signal);
						if (inspected.sha256 !== psp.sha256) throw new GhidraLaunchError("Installed Allegrex content changed since profile resolution; reopen the target to resolve a fresh profile.");
					}
					await createGhidraRuntimeDirectories(paths, platform, await ghidraConfigReleaseDirectory(this.options.analyzeHeadlessPath));
					const seedPath = this.options.analysisSeeds === undefined ? undefined : await snapshotGhidraAnalysisSeeds(this.options.analysisSeeds, session.runtimeRoot);
					const extensions = await snapshotGhidraExtensions(this.options.analysisExtensions ?? [], session.runtimeRoot);
					await writeGhidraRuntimeFile(paths.descriptorPath, `${JSON.stringify({
						transport: session.transport,
						endpoint_path: session.endpointPath,
						token: session.token,
						run_id: session.runId,
						target_sha256: session.targetSha256,
						provider_version: session.providerVersion,
						profile_digest: session.profileDigest,
						...extensions.length === 0 ? {} : { analysis_extensions: extensions }
					})}\n`, platform);
					if (isAborted$2(options.signal)) return err(new AnalysisCancelledError("open_binary"));
					const headlessArguments = ghidraHeadlessArguments({
						platform,
						...psp === undefined ? {} : { psp: true },
						...this.options.mipsSoftFloat === undefined ? {} : { mipsSoftFloat: this.options.mipsSoftFloat },
						projectRoot: paths.projectRoot,
						targetPath: session.targetPath,
						bridgeScriptPath: this.options.bridgeScriptPath,
						descriptorPath: paths.descriptorPath,
						ghidraLogPath: paths.ghidraLogPath,
						scriptLogPath: paths.scriptLogPath,
						...this.options.dosCom === undefined ? {} : { dosCom: this.options.dosCom },
						...this.options.dosMz === undefined ? {} : { dosMz: this.options.dosMz },
						...this.options.rawBinary === undefined ? {} : { rawBinary: this.options.rawBinary },
						...this.options.languageOverride === undefined ? {} : { languageOverride: this.options.languageOverride },
						...seedPath === undefined ? {} : { seedPath },
						...this.options.disabledAnalyzers === undefined ? {} : { disabledAnalyzers: this.options.disabledAnalyzers }
					});
					const scriptCommand = ghidraHeadlessCommand({
						environment: this.options.environment,
						platform,
						analyzeHeadlessPath: this.options.analyzeHeadlessPath,
						arguments: headlessArguments,
						...this.options.comSpec === undefined ? {} : { comSpec: this.options.comSpec }
					});
					const environment = ghidraLaunchEnvironment(paths, this.options.javaHome, platform, scriptCommand.command, this.options.environment);
					if (platform !== "win32" && this.options.javaHome === undefined) throw new GhidraLaunchError("POSIX Ghidra requires its inspected JDK home");
					const inspectedJavaLaunch = await (this.options.javaLaunch ?? ghidraJavaLaunch)({
						platform,
						analyzeHeadlessPath: this.options.analyzeHeadlessPath,
						...this.options.javaHome === undefined ? {} : { javaHome: this.options.javaHome },
						...this.options.javaVmName === undefined ? {} : { javaVmName: this.options.javaVmName },
						homeRoot: paths.homeRoot,
						tempRoot: paths.tempRoot,
						arguments: headlessArguments,
						environment,
						onStderr: (mode, stderr) => {
							if (stderr === "") return;
							const bytes = Buffer.byteLength(stderr);
							const redacted = redactCapturedTransportCredential({
								text: stderr,
								bytes,
								observedBytes: bytes
							}, session.token, "[REDACTED]");
							const bounded = boundedUtf8Text(redacted, GHIDRA_LAUNCH_COMMAND_OUTPUT_BYTES);
							launchSupport.push({
								mode,
								stderr: bounded.text,
								stderr_bytes: bytes,
								stderr_truncated: bounded.truncated
							});
						},
						...options.signal === undefined ? {} : { signal: options.signal }
					});
					const command = platform === "win32" ? {
						...scriptCommand,
						environment
					} : inspectedJavaLaunch;
					started = await (this.options.spawnProcess ?? spawnOwnedProviderProcess)({
						command: command.command,
						arguments: command.arguments,
						runId: session.runId,
						expectedCommand: platform !== "win32" ? command.command : null,
						windowsVerbatimArguments: platform === "win32",
						platform,
						env: command.environment,
						hostEnvironment: {},
						...options.signal === undefined ? {} : { signal: options.signal }
					});
					const partialLaunch = ownedGhidraLaunch(started, paths, platform, launchSupport);
					await writeGhidraRuntimeFile(paths.ownershipPath, `${JSON.stringify({
						run_id: session.runId,
						transport: session.transport,
						endpoint_path: session.endpointPath,
						pid: started.ownership.leaderPid,
						process_group_id: started.ownership.processGroupId,
						parent_pid: process.pid,
						ownership_kind: platform === "win32" ? "windows-job-object" : "posix-process-group",
						launcher: command.command,
						headless_script: this.options.analyzeHeadlessPath,
						created_at: new Date().toISOString()
					})}\n`, platform);
					if (isAborted$2(options.signal)) {
						throw new AnalysisCancelledError("open_binary");
					}
					return ok(partialLaunch);
				} catch (cause) {
					const capturedOutput = ghidraLaunchCommandOutput(cause);
					const launchFailure = new GhidraLaunchError("Ghidra headless launch failed", {
						cause,
						launchSupport,
						...capturedOutput === undefined ? {} : { capturedOutput }
					});
					const primary = isAborted$2(options.signal) ? new AnalysisCancelledError("open_binary", { cause: launchFailure }) : launchFailure;
					if (started === undefined) return err(primary);
					let cleanupFailure;
					try {
						const cleanup = await cleanupStartedProcess(started, platform);
						if (!cleanup.cleaned) cleanupFailure = new Error(`Ghidra process cleanup was incomplete: ${cleanup.reason}`);
					} catch (failure) {
						cleanupFailure = failure;
					}
					if (cleanupFailure !== undefined) {
						const partialLaunch = ownedGhidraLaunch(started, paths, platform, launchSupport);
						const primaryMessage = isAborted$2(options.signal) ? primary.message : `Ghidra headless launch failed: ${cause instanceof Error ? cause.message : String(cause)}`;
						return err(new GhidraLaunchError(`${primaryMessage}; process cleanup remains incomplete`, {
							cause: new AggregateError([primary, cleanupFailure], "Ghidra launch rollback did not release its process", { cause: primary }),
							partialLaunch,
							launchSupport,
							...capturedOutput === undefined ? {} : { capturedOutput }
						}));
					}
					return err(primary);
				}
			}
		};
		ownedGhidraLaunch = (spawned, paths, platform, launchSupport) => ({
			...ownedGhidraProcess(spawned, platform),
			projectRoot: paths.projectRoot,
			ghidraLogPath: paths.ghidraLogPath,
			scriptLogPath: paths.scriptLogPath,
			...launchSupport.length === 0 ? {} : { launchSupport: [...launchSupport] }
		});
		ownedGhidraProcess = (spawned, platform) => ({
			process: spawned.process,
			ownsProcessLifetime: true,
			ownership: spawned.ownership,
			cleanup: () => cleanupStartedProcess(spawned, platform)
		});
		ghidraHeadlessCommand = (options) => {
			if (options.platform !== "win32") return {
				command: options.analyzeHeadlessPath,
				arguments: [...options.arguments]
			};
			const command = ghidraBatchStep(() => windowsBatchCommand({
				environment: options.environment,
				batchPath: options.analyzeHeadlessPath,
				arguments: options.arguments,
				...options.comSpec === undefined ? {} : { comSpec: options.comSpec }
			}));
			if ((command.arguments.at(-1)?.length ?? 0) > 3e4) throw new GhidraLaunchError("Windows Ghidra command exceeds the P0 length limit");
			return command;
		};
		ghidraBatchStep = (step) => {
			try {
				return step();
			} catch (cause) {
				if (!(cause instanceof WindowsBatchCommandError)) throw cause;
				throw new GhidraLaunchError(cause.reason === "metacharacter" ? "Windows Ghidra P0 paths cannot contain command-interpreter metacharacters" : cause.message, { cause });
			}
		};
		cleanupStartedProcess = (started, platform) => started.cleanup !== undefined ? started.cleanup() : platform === "win32" ? cleanupWindowsProcessTree(started.ownership.leaderPid) : cleanupOwnedProcessGroup(started.ownership);
		ghidraHeadlessArguments = (options) => {
			const scriptPath = (options.platform ?? process.platform) === "win32" ? win32 : posix;
			const bridgeDirectory = scriptPath.dirname(options.bridgeScriptPath);
			const override = options.languageOverride;
			const rawBinary = options.rawBinary;
			if (options.psp === true && (options.dosMz === true || options.dosCom === true || override !== undefined)) throw new Error("A PSP ELF import cannot be combined with DOS or a generic Ghidra language override.");
			if (options.psp === true && rawBinary !== undefined) throw new Error("A PSP ELF import cannot be combined with a raw-binary import.");
			if (options.mipsSoftFloat === true && (options.psp === true || options.dosMz === true || options.dosCom === true || rawBinary !== undefined)) throw new Error("MIPS soft-float storage applies only to a generic MIPS ELF import.");
			if (override !== undefined && (options.dosMz === true || options.dosCom === true)) throw new Error("A Ghidra language override cannot be combined with a DOS import.");
			if (override !== undefined && rawBinary !== undefined) throw new Error("A Ghidra language override cannot be combined with a raw-binary import.");
			if (rawBinary !== undefined && (options.dosMz === true || options.dosCom === true)) throw new Error("A raw-binary import cannot be combined with a DOS import.");
			return [
				options.projectRoot,
				"rea-project",
				"-import",
				options.targetPath,
				...options.dosMz === true ? [
					"-loader",
					"MzLoader",
					"-processor",
					"x86:LE:16:Real Mode",
					"-cspec",
					"default"
				] : options.dosCom === true ? [
					"-loader",
					"BinaryLoader",
					"-loader-baseAddr",
					"1000:0100",
					"-processor",
					"x86:LE:16:Real Mode",
					"-cspec",
					"default"
				] : rawBinary === undefined ? options.psp === true ? [
					"-loader",
					"PspElfLoader",
					"-processor",
					"Allegrex:LE:32:default",
					"-cspec",
					"default"
				] : override !== undefined ? [
					"-processor",
					override.languageId,
					...override.compilerSpecId === undefined ? [] : ["-cspec", override.compilerSpecId]
				] : [] : [
					"-loader",
					"BinaryLoader",
					"-loader-baseAddr",
					rawBinary.baseAddr,
					"-processor",
					rawBinary.languageId,
					"-cspec",
					rawBinary.compilerSpecId
				],
				"-readOnly",
				"-deleteProject",
				"-log",
				options.ghidraLogPath,
				"-scriptlog",
				options.scriptLogPath,
				"-scriptPath",
				bridgeDirectory,
				...options.dosCom === true ? ["-preScript", scriptPath.join(bridgeDirectory, "ReaGhidraPrepareCom.java")] : [],
				...rawBinary === undefined ? [] : [
					"-preScript",
					scriptPath.join(bridgeDirectory, "ReaGhidraPrepareRaw.java"),
					rawBinary.languageId,
					rawBinary.baseAddr
				],
				...options.seedPath === undefined ? [] : [
					"-preScript",
					scriptPath.join(bridgeDirectory, GHIDRA_SEED_SCRIPT),
					options.seedPath
				],
				...options.disabledAnalyzers === undefined || options.disabledAnalyzers.length === 0 ? [] : [
					"-preScript",
					scriptPath.join(bridgeDirectory, "ReaGhidraAnalysisOptions.java"),
					options.disabledAnalyzers.join(",")
				],
				...(options.platform ?? process.platform) === "win32" ? [] : ["-postScript", scriptPath.join(bridgeDirectory, "ReaGhidraNoReturnFix.java")],
				...options.mipsSoftFloat === true ? ["-postScript", scriptPath.join(bridgeDirectory, "ReaGhidraMipsSoftFloat.java")] : [],
				"-postScript",
				options.bridgeScriptPath,
				options.descriptorPath
			];
		};
		ghidraRuntimePaths = (runtimeRoot) => ({
			projectRoot: join(runtimeRoot, "project"),
			homeRoot: join(runtimeRoot, "home"),
			tempRoot: join(runtimeRoot, "tmp"),
			cacheRoot: join(runtimeRoot, "cache"),
			configRoot: join(runtimeRoot, "config"),
			dataRoot: join(runtimeRoot, "data"),
			descriptorPath: join(runtimeRoot, "session.json"),
			ownershipPath: join(runtimeRoot, "ownership.json"),
			ghidraLogPath: join(runtimeRoot, "ghidra.log"),
			scriptLogPath: join(runtimeRoot, "script.log")
		});
		ghidraConfigReleaseDirectory = async (analyzeHeadlessPath) => {
			const installRoot = dirname(dirname(analyzeHeadlessPath));
			try {
				const properties = await readFile(join(installRoot, "Ghidra", "application.properties"), "latin1");
				const parsed = parseGhidraJavaProperties(properties);
				if (!parsed.ok) return basename(installRoot);
				const version = parsed.value.get("application.version");
				const release = parsed.value.get("application.release.name");
				return version === undefined || release === undefined || release.length === 0 ? basename(installRoot) : `ghidra_${version}_${release}`;
			} catch (cause) {
				void cause;
				return basename(installRoot);
			}
		};
		createGhidraRuntimeDirectories = async (paths, platform, configReleaseDirectory) => {
			if (platform === "win32") {
				const runtime = windowsPrivateRuntime(dirname(paths.projectRoot));
				for (const path of [
					paths.projectRoot,
					paths.homeRoot,
					paths.tempRoot,
					paths.cacheRoot,
					paths.configRoot,
					paths.dataRoot
				]) runtime.mkdir(basename(path));
				const configRoot = basename(paths.configRoot);
				runtime.mkdir(win32.join(configRoot, "ghidra"));
				runtime.mkdir(win32.join(configRoot, "ghidra", configReleaseDirectory));
				return;
			}
			await Promise.all([
				paths.projectRoot,
				paths.homeRoot,
				paths.tempRoot,
				paths.cacheRoot,
				paths.configRoot,
				paths.dataRoot,
				join(paths.configRoot, "ghidra", configReleaseDirectory)
			].map((path) => mkdir(path, {
				recursive: true,
				mode: 448
			})));
		};
		writeGhidraRuntimeFile = async (path, content, platform) => {
			if (platform === "win32") {
				windowsPrivateRuntime(dirname(path)).writeFile(basename(path), content);
				return;
			}
			await writeFileAtomic(path, content, {
				encoding: "utf8",
				mode: 384
			});
		};
		ghidraLaunchEnvironment = (paths, javaHome, platform, executable, selectedEnvironment) => {
			return {
				...ghidraJavaEnvironment(javaHome, selectedEnvironment, platform),
				...ghidraHeadlessJavaOptions(paths.homeRoot, paths.tempRoot, platform),
				HOME: paths.homeRoot,
				TMPDIR: paths.tempRoot,
				...platform === "win32" ? {
					ComSpec: executable.replaceAll("/", "\\"),
					USERPROFILE: paths.homeRoot,
					APPDATA: paths.configRoot,
					LOCALAPPDATA: paths.cacheRoot,
					TEMP: paths.tempRoot,
					TMP: paths.tempRoot
				} : {},
				XDG_CACHE_HOME: paths.cacheRoot,
				XDG_CONFIG_HOME: paths.configRoot,
				XDG_DATA_HOME: paths.dataRoot
			};
		};
		ghidraHeadlessJavaOptions = (homeRoot, tempRoot, platform) => {
			const options = [`-Duser.home=${homeRoot}`, `-Djava.io.tmpdir=${tempRoot}`];
			if (platform === "win32") return {
				JDK_JAVA_OPTIONS: [...options, "-XX:-UsePerfData"].map((option) => ghidraBatchStep(() => quoteWindowsBatchToken(option))).join(" "),
				GHIDRA_HEADLESS_JAVA_OPTIONS: ""
			};
			return {
				JDK_JAVA_OPTIONS: "",
				GHIDRA_HEADLESS_JAVA_OPTIONS: ""
			};
		};
		isAborted$2 = (signal) => signal?.aborted === true;
	})))();
}

//#endregion
//#region dist/ghidra/GhidraResponseBuffer.js
var GhidraResponseBuffer;
function init_GhidraResponseBuffer() {
	return (init_GhidraResponseBuffer = __esmMin((() => {
		GhidraResponseBuffer = class {
			#options;
			#buffer = "";
			#fragments = [];
			constructor(options) {
				this.#options = options;
			}
			/** Consume one decoded socket chunk. */
			push(chunk) {
				this.#fragments.push(chunk);
				if (!chunk.includes("\n")) return;
				this.#buffer += this.#fragments.join("");
				this.#fragments = [];
				let newline = this.#buffer.indexOf("\n");
				while (newline >= 0) {
					const encodedLine = this.#buffer.slice(0, newline);
					this.#buffer = this.#buffer.slice(newline + 1);
					const line = encodedLine.trim();
					if (line.length > 0) this.#options.onLine(line);
					newline = this.#buffer.indexOf("\n");
				}
			}
			/** Drop any incomplete line when a session closes. */
			reset() {
				this.#buffer = "";
				this.#fragments = [];
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/protocol.js
var responseSchema, GhidraRemoteError, parseGhidraResponseLine, ghidraResponseResult;
function init_protocol$1() {
	return (init_protocol$1 = __esmMin((() => {
		init_jsonValue();
		init_result();
		responseSchema = z.discriminatedUnion("ok", [z.strictObject({
			id: z.number().int().positive(),
			ok: z.literal(true),
			result: jsonValueSchema
		}), z.strictObject({
			id: z.number().int().positive(),
			ok: z.literal(false),
			error: z.object({
				code: z.string().min(1),
				message: z.string().min(1)
			}).strict()
		})]);
		GhidraRemoteError = class extends Error {
			code;
			constructor(code, message) {
				super(message);
				this.code = code;
				this.name = "GhidraRemoteError";
			}
		};
		parseGhidraResponseLine = (line) => {
			try {
				const parsed = JSON.parse(line);
				const response = responseSchema.safeParse(parsed);
				return response.success ? ok(response.data) : err(new Error("Ghidra bridge response has an invalid shape"));
			} catch (cause) {
				return err(new Error("Ghidra bridge response is not valid JSON", { cause }));
			}
		};
		ghidraResponseResult = (response) => response.ok ? ok(response.result) : err(new GhidraRemoteError(response.error.code, response.error.message));
	})))();
}

//#endregion
//#region dist/ghidra/GhidraResponseRouter.js
var GhidraResponseRouter;
function init_GhidraResponseRouter() {
	return (init_GhidraResponseRouter = __esmMin((() => {
		init_result();
		init_protocol$1();
		GhidraResponseRouter = class {
			#options;
			constructor(options) {
				this.#options = options;
			}
			/** Parse and settle one complete response line. */
			route(line) {
				const parsed = parseGhidraResponseLine(line);
				if (!parsed.ok) {
					this.#options.protocolFailure(parsed.error.message, parsed.error);
					return;
				}
				if (!this.#options.pending.has(parsed.value.id)) {
					if (parsed.value.id >= this.#options.nextId()) this.#options.protocolFailure("Ghidra returned an unknown response id");
					return;
				}
				const result = ghidraResponseResult(parsed.value);
				this.#options.pending.settle(parsed.value.id, result.ok ? result : err(this.#options.remoteFailure(result.error)));
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraRequestQueue.js
var GhidraRequestQueue;
function init_GhidraRequestQueue() {
	return (init_GhidraRequestQueue = __esmMin((() => {
		init_result();
		GhidraRequestQueue = class {
			execute;
			failure;
			onActiveCancellation;
			#queue = [];
			#active = false;
			#closedFailure;
			constructor(execute, failure, onActiveCancellation) {
				this.execute = execute;
				this.failure = failure;
				this.onActiveCancellation = onActiveCancellation;
			}
			/** Queue one request until it completes, is cancelled, or the session closes. */
			run(method, parameters, options) {
				if (this.#closedFailure !== undefined) return Promise.resolve(err(this.#closedFailure));
				if (options.signal?.aborted === true) return Promise.resolve(err(this.failure("cancelled", "Ghidra request was cancelled")));
				return new Promise((resolve) => {
					let entry;
					const onAbort = options.signal === undefined ? undefined : () => this.#rejectQueued(entry, err(this.failure("cancelled", "Ghidra request was cancelled")));
					entry = {
						method,
						parameters,
						signal: options.signal,
						resolve,
						onAbort
					};
					this.#queue.push(entry);
					if (onAbort !== undefined) options.signal?.addEventListener("abort", onAbort, { once: true });
					this.#drain();
				});
			}
			/** Fail requests that have not crossed the socket during session cleanup. */
			failQueued(failure) {
				this.#closedFailure = failure;
				for (const entry of this.#queue.splice(0)) {
					this.#release(entry);
					entry.resolve(err(failure));
				}
			}
			/** Admit requests after the owning client completes a new session startup. */
			reopen() {
				this.#closedFailure = undefined;
			}
			#drain() {
				if (this.#active) return;
				const entry = this.#queue.shift();
				if (entry === undefined) return;
				this.#release(entry);
				if (entry.signal?.aborted === true) {
					entry.resolve(err(this.failure("cancelled", "Ghidra request was cancelled")));
					this.#drain();
					return;
				}
				this.#active = true;
				let executionSettled = false;
				let activeCancellation;
				const onAbort = entry.signal === undefined ? undefined : () => {
					if (executionSettled) return;
					this.failQueued(this.failure("process", "Ghidra session closed after active request cancellation"));
					activeCancellation = this.onActiveCancellation();
				};
				if (onAbort !== undefined) entry.signal?.addEventListener("abort", onAbort, { once: true });
				void this.execute(entry.method, entry.parameters, entry.signal === undefined ? {} : { signal: entry.signal }).then(async (result) => {
					if (activeCancellation !== undefined) {
						try {
							await activeCancellation;
						} catch (cause) {
							result = err(this.failure("process", cause instanceof Error ? `Ghidra cleanup after cancellation failed: ${cause.message}` : "Ghidra cleanup after cancellation failed", cause));
						}
					}
					executionSettled = true;
					entry.resolve(result);
				}).catch((cause) => {
					executionSettled = true;
					entry.resolve(err(this.failure("protocol", "Ghidra serial request execution rejected unexpectedly", cause)));
				}).finally(() => {
					if (entry.signal !== undefined && onAbort !== undefined) entry.signal.removeEventListener("abort", onAbort);
					this.#active = false;
					if (this.#closedFailure === undefined) this.#drain();
				});
			}
			#rejectQueued(entry, result) {
				const index = this.#queue.indexOf(entry);
				if (index < 0) return;
				this.#queue.splice(index, 1);
				this.#release(entry);
				entry.resolve(result);
			}
			#release(entry) {
				if (entry.signal !== undefined && entry.onAbort !== undefined) entry.signal.removeEventListener("abort", entry.onAbort);
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraSessionError.js
var MAX_CAUSE_DEPTH, MAX_CAUSE_MESSAGE_BYTES, MAX_CAUSE_FIELD_BYTES, MAX_COMPILER_STDERR_BYTES, MAX_COMMAND_OUTPUT_BYTES, GhidraSessionError, createGhidraSessionError, bindGhidraSessionFailure, describeCause, describeErrorCause, causeCommandOutcome, causeCode, causeSignal, causeCompilerOutcome, boundedCompilerField, causeLaunchOutcome, nestedErrorCause;
function init_GhidraSessionError() {
	return (init_GhidraSessionError = __esmMin((() => {
		init_DarwinProcessRunTokenReader();
		init_boundedUtf8Text();
		init_GhidraJavaLaunch();
		init_GhidraLauncher();
		MAX_CAUSE_DEPTH = 3;
		MAX_CAUSE_MESSAGE_BYTES = 2 * 1024;
		MAX_CAUSE_FIELD_BYTES = 1024;
		MAX_COMPILER_STDERR_BYTES = 8 * 1024;
		MAX_COMMAND_OUTPUT_BYTES = 8 * 1024;
		GhidraSessionError = class extends Error {
			kind;
			diagnostics;
			timeoutMs;
			remoteCode;
			cleanupFailure;
			constructor(kind, message, diagnostics = {}, options = {}) {
				super(message, options);
				this.kind = kind;
				this.name = "GhidraSessionError";
				this.diagnostics = structuredClone(diagnostics);
				this.timeoutMs = options.timeoutMs;
				this.remoteCode = options.remoteCode;
				this.cleanupFailure = options.cleanupFailure;
			}
		};
		createGhidraSessionError = (failure) => new GhidraSessionError(failure.kind, failure.message, {
			...failure.diagnostics,
			failure_kind: failure.kind,
			failure_message: failure.message,
			...failure.remoteCode === undefined ? {} : {
				remote_code: failure.redact(failure.remoteCode),
				remote_message: failure.message
			}
		}, {
			...failure.cause === undefined ? {} : { cause: failure.cause },
			...failure.timeoutMs === undefined ? {} : { timeoutMs: failure.timeoutMs },
			...failure.remoteCode === undefined ? {} : { remoteCode: failure.remoteCode }
		});
		bindGhidraSessionFailure = (diagnostics, redact = (value) => value) => (kind, message, cause, options = {}) => createGhidraSessionError({
			kind,
			message: redact(message),
			diagnostics: {
				...diagnostics(),
				...cause === undefined ? {} : { failure_cause: describeCause(cause, redact) }
			},
			redact,
			...cause === undefined ? {} : { cause },
			...options
		});
		describeCause = (cause, redact, depth = 0) => {
			if (cause instanceof Error) {
				return describeErrorCause(cause, redact, depth);
			}
			if (typeof cause === "string") {
				const message = boundedUtf8Text(redact(cause), MAX_CAUSE_MESSAGE_BYTES);
				return {
					type: "string",
					message: message.text,
					...message.truncated ? { message_truncated: true } : {}
				};
			}
			if (cause === null || typeof cause === "boolean") return {
				type: cause === null ? "null" : "boolean",
				value: cause
			};
			if (typeof cause === "number" && Number.isFinite(cause)) return {
				type: "number",
				value: cause
			};
			return { type: typeof cause };
		};
		describeErrorCause = (cause, redact, depth) => {
			const message = boundedUtf8Text(redact(cause.message), MAX_CAUSE_MESSAGE_BYTES);
			const name = boundedUtf8Text(redact(cause.name), MAX_CAUSE_FIELD_BYTES);
			return {
				name: name.text,
				...name.truncated ? { name_truncated: true } : {},
				message: message.text,
				...message.truncated ? { message_truncated: true } : {},
				...causeCode(cause, redact),
				...causeSignal(cause, redact),
				...causeCommandOutcome(cause, redact),
				...causeCompilerOutcome(cause, redact),
				...causeLaunchOutcome(cause, redact),
				...nestedErrorCause(cause, redact, depth)
			};
		};
		causeCommandOutcome = (cause, redact) => {
			if (!(cause instanceof GhidraLaunchSupportError)) return {};
			const outcome = cause.outcome;
			if (outcome === undefined) return {};
			const stdout = boundedUtf8Text(redact(outcome.stdout, outcome.outputTruncated !== false), MAX_COMMAND_OUTPUT_BYTES);
			const stderr = boundedUtf8Text(redact(outcome.stderr, outcome.outputTruncated !== false), MAX_COMMAND_OUTPUT_BYTES);
			return { command_outcome: {
				stdout: stdout.text,
				stderr: stderr.text,
				stdoutBytes: outcome.stdoutBytes ?? Buffer.byteLength(outcome.stdout),
				stderrBytes: outcome.stderrBytes ?? Buffer.byteLength(outcome.stderr),
				stdoutTruncated: stdout.truncated,
				stderrTruncated: stderr.truncated,
				outputTruncated: outcome.outputTruncated,
				killed: outcome.killed
			} };
		};
		causeCode = (cause, redact) => {
			const code = "code" in cause ? cause.code : undefined;
			if (typeof code === "string") {
				const bounded = boundedUtf8Text(redact(code), MAX_CAUSE_FIELD_BYTES);
				return {
					code: bounded.text,
					...bounded.truncated ? { code_truncated: true } : {}
				};
			}
			if (typeof code === "number" && Number.isFinite(code)) return { code };
			return {};
		};
		causeSignal = (cause, redact) => {
			const signal = "signal" in cause ? cause.signal : undefined;
			if (typeof signal === "string") {
				const bounded = boundedUtf8Text(redact(signal), MAX_CAUSE_FIELD_BYTES);
				return {
					signal: bounded.text,
					...bounded.truncated ? { signal_truncated: true } : {}
				};
			}
			if (signal === null) return { signal: null };
			return {};
		};
		causeCompilerOutcome = (cause, redact) => {
			if (!(cause instanceof DarwinProcessOwnershipInspectionError)) return {};
			const outcome = cause.compilerOutcome;
			if (outcome === undefined) return {};
			const stderr = boundedUtf8Text(redact(outcome.stderr), MAX_COMPILER_STDERR_BYTES);
			const code = boundedCompilerField(outcome.code, redact);
			const signal = boundedCompilerField(outcome.signal, redact);
			return { compiler_outcome: {
				...outcome,
				code: code.value,
				signal: signal.value,
				stderr: stderr.text,
				stderrTruncated: outcome.stderrTruncated || stderr.truncated,
				...code.truncated ? { codeTruncated: true } : {},
				...signal.truncated ? { signalTruncated: true } : {}
			} };
		};
		boundedCompilerField = (value, redact) => {
			if (typeof value !== "string") return {
				value,
				truncated: false
			};
			const bounded = boundedUtf8Text(redact(value), MAX_CAUSE_FIELD_BYTES);
			return {
				value: bounded.text,
				truncated: bounded.truncated
			};
		};
		causeLaunchOutcome = (cause, redact) => {
			if (!(cause instanceof GhidraLaunchError)) return {};
			const launchSupport = cause.launchSupport.length === 0 ? {} : { launch_support: cause.launchSupport.map((output) => ({
				...output,
				stderr: redact(output.stderr)
			})) };
			if (cause.cause instanceof GhidraLaunchSupportError) return launchSupport;
			const output = cause.capturedOutput;
			if (output === undefined) return launchSupport;
			const stdout = boundedUtf8Text(redact(output.stdout), GHIDRA_LAUNCH_COMMAND_OUTPUT_BYTES);
			const stderr = boundedUtf8Text(redact(output.stderr), GHIDRA_LAUNCH_COMMAND_OUTPUT_BYTES);
			const truncated = output.truncated || stdout.truncated || stderr.truncated;
			return {
				...launchSupport,
				launch_outcome: {
					stdout: stdout.text,
					stderr: stderr.text,
					truncated,
					...truncated ? {
						stdout_bytes: Buffer.byteLength(output.stdout),
						stderr_bytes: Buffer.byteLength(output.stderr)
					} : {},
					...output.exit_code === undefined ? {} : { exit_code: output.exit_code },
					...output.signal === undefined ? {} : { signal: output.signal }
				}
			};
		};
		nestedErrorCause = (cause, redact, depth) => {
			if (!("cause" in cause)) return {};
			if (depth >= MAX_CAUSE_DEPTH) return { cause_truncated: true };
			return { cause: describeCause(cause.cause, redact, depth + 1) };
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraInventoryValues.js
var GHIDRA_INVENTORY_OPERATIONS, GHIDRA_NAMING_OPERATIONS, operationSet$2, isGhidraInventoryOperation, ghidraIdentifierSchema, identifier, document$1, ghidraInputAddressSchema, explicitAddress, filteredAddress, searchInput, inputSchemas$1, parseGhidraInventoryInput, ghidraCanonicalAddressSchema, canonicalAddress, symbolFacts, procedureFacts, ghidraFunctionClassificationSchema, ghidraFunctionBodySchema, ghidraProcedureIdentitySchema, stringFacts, baseItem, symbolItem, procedureItem, stringItem, searchItem, availablePermissions, memoryRegion, segment, containingProcedure, resultSchemas$1, parseGhidraInventoryResult;
function init_GhidraInventoryValues() {
	return (init_GhidraInventoryValues = __esmMin((() => {
		init_bytePattern();
		init_nativeLoadImage();
		init_analysisErrorCore();
		init_hopperValues();
		init_jsonValue();
		init_result();
		init_inputIssueProjection();
		GHIDRA_INVENTORY_OPERATIONS = [
			"inspect_native_load_image",
			"read_bytes",
			"search_bytes",
			"address_to_file_offset",
			"address_name",
			"list_documents",
			"list_names",
			"list_procedures",
			"list_segments",
			"list_strings",
			"procedure_address",
			"resolve_containing_procedure",
			"search_procedures",
			"search_strings",
			"set_address_name",
			"set_addresses_names"
		];
		GHIDRA_NAMING_OPERATIONS = ["set_address_name", "set_addresses_names"];
		operationSet$2 = new Set(GHIDRA_INVENTORY_OPERATIONS);
		isGhidraInventoryOperation = (operation) => operationSet$2.has(operation);
		ghidraIdentifierSchema = z.string().min(1);
		identifier = ghidraIdentifierSchema;
		document$1 = identifier.nullable().default(null);
		ghidraInputAddressSchema = z.string().regex(/^(?:(?:0[xX])?[0-9a-fA-F]+|(?:[A-Za-z0-9._~-]|%[0-9a-fA-F]{2})+:0[xX][0-9a-fA-F]+)$/u, "Use hexadecimal digits, optionally prefixed with 0x, or an encoded address-space name followed by :0x and hexadecimal digits");
		explicitAddress = ghidraInputAddressSchema;
		filteredAddress = explicitAddress.nullable().default(null);
		searchInput = {
			pattern: z.string().min(1),
			mode: z.enum(["literal", "regex"]).default("literal"),
			case_sensitive: z.boolean().default(false),
			document: document$1
		};
		inputSchemas$1 = {
			search_bytes: z.strictObject({
				...bytePatternFields,
				document: document$1,
				start: explicitAddress.optional(),
				end: explicitAddress.optional(),
				limit: z.number().int().min(1).max(1e3).default(100),
				cursor: z.string().min(1).optional()
			}).superRefine(validateBytePattern),
			inspect_native_load_image: z.strictObject({}),
			read_bytes: z.strictObject({
				document: document$1,
				address: explicitAddress,
				length: z.number().int().min(1).max(Number.MAX_SAFE_INTEGER).default(256)
			}),
			address_to_file_offset: z.strictObject({
				document: document$1,
				address: explicitAddress
			}),
			address_name: z.object({
				document: document$1,
				address: explicitAddress
			}).strict(),
			list_documents: z.object({}).strict(),
			list_names: z.object({
				document: document$1,
				address: filteredAddress
			}).strict(),
			list_procedures: z.object({ document: document$1 }).strict(),
			list_segments: z.object({ document: document$1 }).strict(),
			list_strings: z.object({
				document: document$1,
				address: filteredAddress
			}).strict(),
			procedure_address: z.object({
				document: document$1,
				procedure: identifier
			}).strict(),
			resolve_containing_procedure: z.object({
				document: document$1,
				address: explicitAddress
			}).strict(),
			search_procedures: z.object(searchInput).strict(),
			search_strings: z.object(searchInput).strict(),
			set_address_name: z.object({
				document: document$1,
				address: explicitAddress,
				name: z.string().min(1)
			}).strict(),
			set_addresses_names: z.object({
				document: document$1,
				names: z.record(explicitAddress, z.string().min(1))
			}).strict().refine((value) => Object.keys(value.names).length > 0, "Supply at least one address name")
		};
		parseGhidraInventoryInput = (operation, value) => {
			const parsed = inputSchemas$1[operation].safeParse(value);
			if (!parsed.success) return err(analysisInputErrorFromIssues(operation, parsed.error.issues, value, { cause: parsed.error }));
			return ok(parsed.data);
		};
		ghidraCanonicalAddressSchema = z.string().regex(/^(?:0x[0-9a-f]+|(?:[A-Za-z0-9._~-]|%[0-9A-F]{2})+:0x[0-9a-f]+)$/u);
		canonicalAddress = ghidraCanonicalAddressSchema;
		symbolFacts = z.object({
			primary: z.boolean(),
			dynamic: z.boolean(),
			external: z.boolean(),
			type: z.string().min(1),
			source: z.enum([
				"default",
				"analysis",
				"ai",
				"imported",
				"user_defined"
			])
		}).strict();
		procedureFacts = z.object({
			external: z.boolean(),
			thunk: z.boolean(),
			thunk_target: canonicalAddress.nullable()
		}).strict();
		ghidraFunctionClassificationSchema = procedureFacts.extend({ provenance: z.literal("ghidra-function-manager") }).strict();
		ghidraFunctionBodySchema = functionBodySchema.superRefine((body, context) => {
			if (!body.available || body.provenance !== "ghidra-function-body-address-set" || body.ranges.some(({ start, end }) => !ghidraCanonicalAddressSchema.safeParse(start).success || !ghidraCanonicalAddressSchema.safeParse(end).success)) context.addIssue({
				code: "custom",
				message: "Ghidra omitted complete canonical function-body AddressSet evidence"
			});
		});
		ghidraProcedureIdentitySchema = z.object({
			address: ghidraCanonicalAddressSchema,
			name: z.string().min(1),
			classification: ghidraFunctionClassificationSchema,
			body: ghidraFunctionBodySchema
		}).strict().superRefine((value, context) => {
			if (!functionBodyEntryAgrees(value.body, value.address) || value.body.available && !value.classification.external && !value.body.contains_entry) context.addIssue({
				code: "custom",
				message: "Ghidra function body disagrees with its entry point"
			});
		});
		stringFacts = z.object({
			encoding: z.string().min(1),
			termination: z.enum(["missing", "present_or_not_required"]),
			byte_length: z.number().int().min(0)
		}).strict();
		baseItem = {
			address: canonicalAddress,
			value: z.string()
		};
		symbolItem = z.object({
			...baseItem,
			symbol: symbolFacts
		}).strict();
		procedureItem = z.object({
			...baseItem,
			procedure: procedureFacts
		}).strict();
		stringItem = z.object({
			...baseItem,
			string: stringFacts
		}).strict();
		searchItem = z.object(baseItem).strict();
		availablePermissions = z.object({
			available: z.literal(true),
			source: z.literal("ghidra-memory-block")
		}).strict();
		memoryRegion = z.object({
			name: z.string(),
			start: canonicalAddress,
			end: canonicalAddress,
			readable: z.boolean(),
			writable: z.boolean(),
			executable: z.boolean(),
			permissions: availablePermissions,
			provenance: z.literal("ghidra-memory-block"),
			address_space: z.string().min(1),
			image_base: canonicalAddress,
			initialized: z.boolean(),
			overlay: z.boolean()
		}).strict();
		segment = memoryRegion.extend({ sections: z.array(memoryRegion) }).strict();
		containingProcedure = z.discriminatedUnion("found", [z.object({
			query_address: canonicalAddress,
			found: z.literal(true),
			procedure: ghidraProcedureIdentitySchema
		}).strict().superRefine((value, context) => {
			const body = value.procedure.body;
			const exactExternalEntry = value.procedure.classification.external && value.query_address === value.procedure.address;
			if (!exactExternalEntry && body.available && !functionBodyEntryAgrees({
				...body,
				contains_entry: true
			}, value.query_address)) context.addIssue({
				code: "custom",
				message: "Found containing procedure body does not contain the query address"
			});
		}), z.object({
			query_address: canonicalAddress,
			found: z.literal(false),
			procedure: z.null(),
			reason: z.enum(["outside_segments", "not_in_procedure"])
		}).strict()]);
		resultSchemas$1 = {
			search_bytes: byteSearchResultSchema.superRefine((value, context) => {
				const addresses = [...value.matches.flatMap((match) => [match.address, ...match.procedure === null ? [] : [match.procedure.address]]), ...[
					...value.searched.blocks,
					...value.searched.skipped_uninitialized,
					...value.searched.skipped_not_loaded
				].flatMap((block) => [block.start, block.end])];
				if (addresses.some((value) => !canonicalAddress.safeParse(value).success)) context.addIssue({
					code: "custom",
					message: "Byte search addresses must be canonical"
				});
			}),
			inspect_native_load_image: nativeLoadImageObservationSchema,
			read_bytes: z.strictObject({
				address: canonicalAddress,
				requested_bytes: z.number().int().min(1),
				returned_bytes: z.number().int().min(0),
				bytes_hex: z.string().regex(/^(?:[a-f0-9]{2})*$/u),
				complete: z.boolean()
			}).superRefine((value, context) => {
				if (value.returned_bytes * 2 !== value.bytes_hex.length || value.returned_bytes > value.requested_bytes || value.complete !== (value.returned_bytes === value.requested_bytes)) context.addIssue({
					code: "custom",
					message: "Read-byte length and completeness disagree"
				});
			}),
			address_to_file_offset: z.strictObject({
				address: canonicalAddress,
				file_offset: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)
			}),
			address_name: z.string().nullable(),
			list_documents: z.array(z.string().min(1)).length(1),
			list_names: z.array(symbolItem),
			list_procedures: z.array(procedureItem),
			list_segments: z.array(segment),
			list_strings: z.array(stringItem),
			procedure_address: canonicalAddress,
			resolve_containing_procedure: containingProcedure,
			search_procedures: z.array(searchItem),
			search_strings: z.array(searchItem),
			set_address_name: z.boolean(),
			set_addresses_names: z.record(z.string(), z.boolean())
		};
		parseGhidraInventoryResult = (operation, value) => {
			const parsed = resultSchemas$1[operation].safeParse(value);
			return parsed.success ? ok(jsonValueSchema.parse(parsed.data)) : err(new AnalysisOutputError(operation, "Ghidra bridge output did not match the inventory contract", { cause: parsed.error }));
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraFunctionValues.js
var GHIDRA_FUNCTION_OPERATIONS, operationSet$1, isGhidraFunctionOperation, document, procedure, directProcedure, inputSchemas, parseGhidraFunctionInput, localVariable, referenceKind, referenceEdge, procedureReferences, procedureInfo, ghidraNativeApiBoundary, ghidraNativeValueFlow, ghidraFunctionDossier, ghidraFunctionInstructionWindow, resultSchemas, functionBoundaryObservationOperations, functionObservationEnvelope, parseGhidraFunctionResult, referenceAddresses, referenceProcedures;
function init_GhidraFunctionValues() {
	return (init_GhidraFunctionValues = __esmMin((() => {
		init_nativeFunctionAnnotations();
		init_nativeDataType();
		init_nativeInstruction();
		init_analysisErrorCore();
		init_hopperValues();
		init_jsonValue();
		init_nativeApiBoundary();
		init_nativeValueFlow();
		init_relationshipCoverage();
		init_result();
		init_inputIssueProjection();
		init_GhidraInventoryValues();
		GHIDRA_FUNCTION_OPERATIONS = [
			"annotate_native_function",
			"inspect_native_data_type",
			"inspect_native_instruction",
			"resolve_native_call_targets",
			"analyze_function",
			"procedure_assembly",
			"procedure_callees",
			"procedure_callers",
			"procedure_info",
			"procedure_pseudo_code",
			"read_function_instructions",
			"procedure_references",
			"xrefs"
		];
		operationSet$1 = new Set(GHIDRA_FUNCTION_OPERATIONS);
		isGhidraFunctionOperation = (operation) => operationSet$1.has(operation);
		document = ghidraIdentifierSchema.nullable().default(null);
		procedure = ghidraIdentifierSchema;
		directProcedure = {
			document,
			procedure
		};
		inputSchemas = {
			annotate_native_function: nativeFunctionAnnotationsInputSchema,
			inspect_native_data_type: z.object({
				document,
				type: z.string().min(1).nullable().default(null),
				address: ghidraInputAddressSchema.nullable().default(null)
			}).strict().refine((value) => value.type === null !== (value.address === null), "Supply exactly one of type or address"),
			inspect_native_instruction: z.object({
				document,
				address: ghidraInputAddressSchema
			}).strict(),
			resolve_native_call_targets: z.object({
				document,
				address: ghidraInputAddressSchema
			}).strict(),
			analyze_function: z.object({ procedure }).strict(),
			procedure_assembly: z.object(directProcedure).strict(),
			procedure_callees: z.object(directProcedure).strict(),
			procedure_callers: z.object(directProcedure).strict(),
			procedure_info: z.object(directProcedure).strict(),
			procedure_pseudo_code: z.object(directProcedure).strict(),
			read_function_instructions: z.object(directProcedure).strict(),
			procedure_references: z.object({
				...directProcedure,
				direction: z.enum(["incoming", "outgoing"]).default("outgoing")
			}).strict(),
			xrefs: z.object({
				document,
				address: ghidraInputAddressSchema
			}).strict()
		};
		parseGhidraFunctionInput = (operation, value) => {
			const parsed = inputSchemas[operation].safeParse(value);
			return parsed.success ? ok(jsonObjectSchema.parse(Object.fromEntries(Object.entries(parsed.data).filter(([, value]) => value !== undefined)))) : err(analysisInputErrorFromIssues(operation, parsed.error.issues, value, { cause: parsed.error }));
		};
		localVariable = z.object({
			description: z.string(),
			provenance: z.literal("ghidra-function-database")
		}).strict();
		referenceKind = z.object({
			available: z.literal(true),
			provenance: z.literal("ghidra-reference-manager"),
			type: z.string().min(1),
			flow: z.boolean(),
			call: z.boolean(),
			jump: z.boolean(),
			data: z.boolean(),
			read: z.boolean(),
			write: z.boolean(),
			indirect: z.boolean(),
			computed: z.boolean(),
			conditional: z.boolean(),
			terminal: z.boolean(),
			primary: z.boolean(),
			operand_index: z.number().int(),
			external: z.boolean()
		}).strict();
		referenceEdge = z.object({
			source_address: ghidraCanonicalAddressSchema,
			target_address: ghidraCanonicalAddressSchema,
			source_procedure: ghidraProcedureIdentitySchema.nullable(),
			target_procedure: ghidraProcedureIdentitySchema.nullable(),
			kind: referenceKind
		}).strict();
		procedureReferences = z.object({
			procedure: ghidraProcedureIdentitySchema,
			direction: z.enum(["incoming", "outgoing"]),
			references: z.array(referenceEdge),
			reference_kinds_available: z.boolean(),
			unresolved_calls: z.array(z.strictObject({
				address: ghidraCanonicalAddressSchema,
				reason: z.string()
			}))
		}).strict();
		procedureInfo = z.object({
			name: z.string().min(1),
			entrypoint: ghidraCanonicalAddressSchema,
			basicblock_count: z.number().int().min(0),
			length: z.number().int().min(0),
			signature: z.string().nullable(),
			locals: z.array(localVariable),
			classification: ghidraFunctionClassificationSchema,
			body: ghidraFunctionBodySchema
		}).strict().superRefine((value, context) => {
			if (!functionBodyEntryAgrees(value.body, value.entrypoint) || value.body.available && (value.length !== value.body.total_bytes || !value.classification.external && !value.body.contains_entry)) context.addIssue({
				code: "custom",
				message: "Ghidra function body disagrees with entry point or length"
			});
		});
		ghidraNativeApiBoundary = nativeApiBoundarySchema.superRefine((value, context) => {
			if (!value.available) return;
			if (value.provenance !== "ghidra-high-function") context.addIssue({
				code: "custom",
				message: "Ghidra native API observations require HighFunction provenance"
			});
			const addresses = value.jump_tables.flatMap((table) => [
				table.dispatch_address,
				...table.data_sources.map(({ address }) => address),
				...table.mappings.map(({ target_address }) => target_address),
				...table.default_targets.map(({ target_address }) => target_address)
			]);
			if (addresses.some((address) => !ghidraCanonicalAddressSchema.safeParse(address).success)) context.addIssue({
				code: "custom",
				message: "Ghidra native API observation contains a non-canonical address"
			});
		});
		ghidraNativeValueFlow = nativeValueFlowSchema.superRefine((value, context) => {
			if (!value.available) return;
			const operations = value.operations;
			const addresses = operations.flatMap((operation) => [
				operation.address,
				...operation.inputs.flatMap(({ location }) => location === null ? [] : [location]),
				...operation.output?.location == null ? [] : [operation.output.location]
			]);
			if (addresses.some((address) => !ghidraCanonicalAddressSchema.safeParse(address).success)) context.addIssue({
				code: "custom",
				message: "Ghidra p-code flow contains a non-canonical address"
			});
			const operationIds = new Set(operations.map(({ id }) => id));
			if (operationIds.size !== operations.length) context.addIssue({
				code: "custom",
				message: "Ghidra p-code operation identifiers are not unique"
			});
			if (value.def_use.some(({ definition, use }) => !operationIds.has(definition) || !operationIds.has(use)) || value.effects.some(({ operation }) => !operationIds.has(operation))) context.addIssue({
				code: "custom",
				message: "Ghidra p-code relationship references a missing operation"
			});
			if (value.truncated !== (value.omitted_operations_lower_bound > 0 || value.known_omitted_inputs > 0 || value.known_omitted_edges > 0)) context.addIssue({
				code: "custom",
				message: "Ghidra p-code truncation flag contradicts omitted counts"
			});
		});
		ghidraFunctionDossier = functionDossierSchema.extend({
			procedure: functionDossierSchema.shape.procedure.safeExtend({
				classification: ghidraFunctionClassificationSchema,
				body: ghidraFunctionBodySchema
			}),
			native_api: ghidraNativeApiBoundary,
			native_value_flow: ghidraNativeValueFlow
		}).strict().superRefine((value, context) => {
			if (value.swift_string_literals === undefined !== (value.swift_string_literal_omissions === undefined)) context.addIssue({
				code: "custom",
				message: "Ghidra dossier must record Swift literals and their omissions together"
			});
			const addresses = [
				value.procedure.address,
				...value.comments.map(({ address }) => address),
				...value.callers.map(({ address }) => address),
				...value.callees.map(({ address }) => address),
				...(value.unresolved_calls ?? []).map(({ address }) => address),
				...value.incoming_references.flatMap(referenceAddresses),
				...value.outgoing_references.flatMap(referenceAddresses),
				...value.referenced_strings.flatMap(({ address, source_address }) => [address, source_address]),
				...value.referenced_names.flatMap(({ address, source_address }) => [address, source_address]),
				...(value.swift_string_literals ?? []).flatMap(({ address, source_address }) => address === null ? [source_address] : [address, source_address]),
				...(value.swift_string_literal_omissions ?? []).flatMap(({ address, source_address }) => address === null ? [source_address] : [address, source_address]),
				...value.basic_blocks.flatMap(({ start, end, successors }) => [
					start,
					end,
					...successors
				])
			];
			if (addresses.some((address) => !ghidraCanonicalAddressSchema.safeParse(address).success)) context.addIssue({
				code: "custom",
				message: "Ghidra dossier contains a non-canonical address"
			});
			const identities = [
				value.procedure,
				...value.callers,
				...value.callees,
				...value.incoming_references.flatMap(referenceProcedures),
				...value.outgoing_references.flatMap(referenceProcedures)
			];
			if (identities.some((identity) => !ghidraFunctionClassificationSchema.safeParse(identity.classification).success || !ghidraFunctionBodySchema.safeParse(identity.body).success || !functionBodyEntryAgrees(identity.body, identity.address) || identity.body.available && identity.classification?.external === false && !identity.body.contains_entry)) context.addIssue({
				code: "custom",
				message: "Ghidra dossier omitted function classification"
			});
			if (value.procedure.locals.some((variable) => !localVariable.safeParse(variable).success) || [...value.incoming_references, ...value.outgoing_references].some(({ kind }) => !referenceKind.safeParse(kind).success)) context.addIssue({
				code: "custom",
				message: "Ghidra dossier contains invalid provenance"
			});
			if (!value.limitations.some((item) => /indirect|computed/u.test(item)) || !value.limitations.some((item) => /provider|Ghidra|Hopper/u.test(item))) context.addIssue({
				code: "custom",
				message: "Ghidra dossier omitted required uncertainty limitations"
			});
		});
		ghidraFunctionInstructionWindow = functionInstructionWindowSchema.extend({ procedure: ghidraProcedureIdentitySchema }).strict();
		resultSchemas = {
			annotate_native_function: nativeFunctionAnnotationsSchema.safeExtend({ dossier: ghidraFunctionDossier }),
			analyze_function: ghidraFunctionDossier,
			procedure_assembly: z.string(),
			procedure_callees: z.array(ghidraCanonicalAddressSchema),
			procedure_callers: z.array(ghidraCanonicalAddressSchema),
			procedure_info: procedureInfo,
			procedure_pseudo_code: z.string().nullable(),
			read_function_instructions: ghidraFunctionInstructionWindow,
			inspect_native_instruction: nativeInstructionSchema,
			inspect_native_data_type: nativeDataTypeSchema,
			resolve_native_call_targets: nativeCallTargetsSchema,
			procedure_references: procedureReferences,
			xrefs: z.array(ghidraCanonicalAddressSchema)
		};
		functionBoundaryObservationOperations = new Set([
			"analyze_function",
			"procedure_assembly",
			"procedure_callees",
			"procedure_callers",
			"procedure_info",
			"procedure_pseudo_code",
			"read_function_instructions"
		]);
		functionObservationEnvelope = z.strictObject({
			value: z.unknown(),
			limitations: z.array(z.string()),
			relationship_coverage: relationshipCoverageSchema.exactOptional(),
			selection: z.strictObject({
				file_offset: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
				mapped_address: ghidraCanonicalAddressSchema,
				procedure_address: ghidraCanonicalAddressSchema
			}).exactOptional()
		});
		parseGhidraFunctionResult = (operation, value) => {
			let observation;
			if (functionBoundaryObservationOperations.has(operation)) {
				const envelope = functionObservationEnvelope.safeParse(value);
				if (!envelope.success || operation !== "analyze_function" && operation !== "procedure_callers" && operation !== "procedure_callees" && envelope.data.relationship_coverage !== undefined || operation !== "procedure_pseudo_code" && envelope.data.selection !== undefined) return err(new AnalysisOutputError(operation, "Ghidra bridge returned an invalid function observation envelope for this operation", envelope.success ? undefined : { cause: envelope.error }));
				observation = envelope.data;
			} else {
				observation = {
					value,
					limitations: []
				};
			}
			const parsed = resultSchemas[operation].safeParse(observation.value);
			return parsed.success ? ok({
				value: jsonValueSchema.parse(parsed.data),
				limitations: observation.limitations,
				...observation.relationship_coverage === undefined ? {} : { relationshipCoverage: observation.relationship_coverage },
				...observation.selection === undefined ? {} : { locations: [
					{
						kind: "file-offset",
						offset: observation.selection.file_offset
					},
					{
						kind: "address",
						address: observation.selection.mapped_address
					},
					{
						kind: "address",
						address: observation.selection.procedure_address
					}
				] }
			}) : err(new AnalysisOutputError(operation, "Ghidra bridge output did not match the function-analysis contract", { cause: parsed.error }));
		};
		referenceAddresses = (edge) => [
			edge.source_address,
			edge.target_address,
			...edge.source_procedure === null ? [] : [edge.source_procedure.address],
			...edge.target_procedure === null ? [] : [edge.target_procedure.address]
		];
		referenceProcedures = (edge) => [...edge.source_procedure === null ? [] : [edge.source_procedure], ...edge.target_procedure === null ? [] : [edge.target_procedure]];
	})))();
}

//#endregion
//#region dist/ghidra/GhidraMipsProfile.js
var MIPS_FP_ABI_SOFT, MIPS_ET_REL, MIPS_ET_EXEC, MIPS_ET_DYN, MIPS16_HEADER_ASE, isGhidraMips16SharedTarget, ghidraMipsLanguageOverride, hasLegacyMipsHeaderShape, ghidraMipsGnuAttributesUnsupportedReason, ghidraMipsUnsupportedReason, isLegacyMipsAdmission, GHIDRA_MIPS_SOFT_FLOAT_STORAGE, isGhidraMipsSoftFloatTarget, ghidraMipsSoftFloatFailure, ghidraMipsSoftFloatLimitations, ghidraMipsRelocatableLimitations, ghidraMipsSharedLimitations, ghidraMipsProfileParameters, ghidraPinnedMipsLanguage;
function init_GhidraMipsProfile() {
	return (init_GhidraMipsProfile = __esmMin((() => {
		MIPS_FP_ABI_SOFT = 3;
		MIPS_ET_REL = 1;
		MIPS_ET_EXEC = 2;
		MIPS_ET_DYN = 3;
		MIPS16_HEADER_ASE = 67108864;
		isGhidraMips16SharedTarget = (target) => target.kind === "executable" && target.architecture === "mips" && target.mips.type === MIPS_ET_DYN && (target.mips.flags & 251658240) === MIPS16_HEADER_ASE;
		ghidraMipsLanguageOverride = (target) => (isGhidraMips16SharedTarget(target) || hasLegacyMipsHeaderShape(target)) && ghidraMipsUnsupportedReason(target) === null && target.architecture === "mips" ? {
			languageId: `MIPS:${target.mips.byteOrder === "little" ? "LE" : "BE"}:32:default`,
			compilerSpecId: "default"
		} : undefined;
		hasLegacyMipsHeaderShape = (target) => {
			if (target.kind !== "executable" || target.architecture !== "mips" || target.format !== "elf" || target.mips === undefined) return false;
			const { flags, abiFlags, limitations } = target.mips;
			const arch = flags & 4026531840;
			return target.mips.elfClass === 32 && target.mips.type === MIPS_ET_EXEC && (arch === 1342177280 || arch === 1879048192) && (flags & 61440) === 0 && (flags & 32) === 0 && (flags & 64) === 0 && (flags & 256) === 0 && abiFlags === null && (limitations === undefined || limitations.length === 0);
		};
		ghidraMipsGnuAttributesUnsupportedReason = (metadata) => {
			const attributes = metadata.gnuAttributes;
			if (attributes === undefined) return "GNU MIPS ABI attribute inspection is unavailable; provider selection cannot treat it as absent.";
			if (attributes === null) return null;
			if (attributes.msa !== null && attributes.msa !== 0) return "The GNU MIPS MSA ABI attribute declares an unsupported or unknown vector argument ABI.";
			if (metadata.abiFlags === null && attributes.fpAbi !== null && attributes.fpAbi !== 0 && attributes.fpAbi !== 1 && attributes.fpAbi !== 5) return "Without a MIPS ABI flags record, the GNU floating-point ABI attribute must be absent, any, double-precision, or FPXX for the verified recordless lane.";
			return null;
		};
		ghidraMipsUnsupportedReason = (target) => {
			if (target.kind !== "executable" || target.architecture !== "mips") return null;
			const metadata = target.mips;
			if (target.format !== "elf" || metadata === undefined) return "MIPS analysis requires ELF header metadata; a family name alone does not select an ISA or ABI.";
			const shared = isGhidraMips16SharedTarget(target);
			if (metadata.elfClass !== 32) return "This Ghidra MIPS lane supports ELF32 only; MIPS64 and n64 remain unsupported.";
			const gnuAttributesReason = ghidraMipsGnuAttributesUnsupportedReason(metadata);
			if (gnuAttributesReason !== null) return gnuAttributesReason;
			if (metadata.type !== MIPS_ET_EXEC && metadata.type !== MIPS_ET_REL && !shared) return "This Ghidra MIPS lane supports ET_EXEC and ET_REL only; shared images and PSP PRX need separate load verification.";
			if ((metadata.flags & 251658240) !== 0 && !shared) return "MIPS16, microMIPS and other ASE encodings are outside this standard-instruction MIPS lane.";
			if ((metadata.flags & 16711680) !== 0) return "Machine-specific MIPS variants, including PSP Allegrex, need a separately supported processor profile.";
			const arch = metadata.flags & 4026531840;
			if (arch !== 1879048192 && arch !== 1342177280) return "This Ghidra MIPS lane requires EF_MIPS_ARCH_32R2 or a recordless legacy EF_MIPS_ARCH_32 header; other ISA revisions need separate verification.";
			const recordlessShape = (metadata.flags & 61440) === 0 && (metadata.flags & 32) === 0 && metadata.abiFlags === null;
			if (recordlessShape) {
				if ((metadata.flags & 256) !== 0) return "EF_MIPS_32BITMODE declares code for a 64-bit processor in 32-bit mode; it is outside the recordless MIPS32 admission.";
				if ((metadata.flags & 64) !== 0) return "EF_MIPS_ABI_ON32 declares the n32 ABI; recordless headers carrying it are outside the recordless legacy admission.";
				if ((metadata.flags & 512) !== 0) return "EF_MIPS_FP64 requires separate verification of 64-bit floating-point register semantics in this Ghidra lane.";
				if ((metadata.flags & 1024) !== 0) return "EF_MIPS_NAN2008 requires separate verification of NaN encoding semantics in this Ghidra lane.";
				if (hasLegacyMipsHeaderShape(target)) return null;
				if (metadata.type !== MIPS_ET_EXEC) return "The recordless legacy admission covers ET_EXEC firmware images only; recordless relocatable objects need their own verified build, and the declared-ABI lane requires an ABI flags record.";
				return ["This recordless legacy admission requires a complete ABI-record inspection; ABI declarations in unavailable headers remain unknown.", ...metadata.limitations ?? []].join(" ");
			}
			if ((metadata.flags & 61440) !== 4096 || (metadata.flags & 32) !== 0) return "This Ghidra MIPS lane requires an explicit o32 ABI or a recordless legacy header with an unspecified ABI; n32, EABI and mixed declarations remain unsupported.";
			if (arch !== 1879048192) return "This Ghidra MIPS lane requires EF_MIPS_ARCH_32R2 for headers that declare an ABI; EF_MIPS_ARCH_32 headers are admitted only through the recordless legacy admission.";
			if ((metadata.flags & 512) !== 0) return "EF_MIPS_FP64 requires separate verification of 64-bit floating-point register semantics in this Ghidra lane.";
			if ((metadata.flags & 1024) !== 0) return "EF_MIPS_NAN2008 requires separate verification of NaN encoding semantics in this Ghidra lane.";
			if (shared) {
				if ((metadata.flags & 64) !== 0) return "EF_MIPS_ABI_ON32 declares an unverified ABI for the MIPS16 shared-image lane.";
				const load = metadata.sharedLoad;
				if (load === undefined || load.status !== "complete") return `MIPS16 shared images require complete dynamic relocation inspection. ${load?.reason ?? "The source declarations have not been inspected."}`;
				if (load.relocationTypes.some((type) => type !== 0 && type !== 3)) return "This MIPS16 shared-image lane verifies R_MIPS_NONE and R_MIPS_REL32 only; other dynamic relocation types require separate verification.";
				if (load.symbolRelativeCount !== 0) return "Symbol-bearing R_MIPS_REL32 is unsupported: Ghidra normalizes MIPS16 function addresses and can lose the source function-pointer mode tag. Symbol-index-zero REL32 is verified separately.";
			}
			if ((metadata.limitations?.length ?? 0) > 0) return ["MIPS ABI declaration inspection is incomplete; unsupported attributes or conflicting declaration sources may remain unknown.", ...metadata.limitations ?? []].join(" ");
			const abi = metadata.abiFlags;
			if (shared && abi === null && (metadata.limitations?.length ?? 0) === 0) return null;
			if (abi === undefined || abi === null) return ["This Ghidra MIPS lane requires an inspected ABI flags record; header flags alone do not establish the floating-point ABI.", ...metadata.limitations ?? []].join(" ");
			if (abi.version !== 0) return "This Ghidra MIPS lane requires ABI flags version 0; newer record semantics are unsupported.";
			if (abi.isaLevel !== 32 || abi.isaRevision !== 2) return "MIPS ABI flags must agree with the declared MIPS32r2 ISA.";
			if (abi.gprSize !== 1 || abi.cpr2Size !== 0) return "This Ghidra MIPS lane requires 32-bit GPRs and no CPR2; other register modes need separate verification.";
			const hardFloat = abi.cpr1Size === 1 && (abi.fpAbi === 1 || abi.fpAbi === 5);
			const softFloat = abi.cpr1Size === 0 && abi.fpAbi === MIPS_FP_ABI_SOFT;
			if (!hardFloat && !softFloat) return "This Ghidra MIPS lane admits double-precision or FPXX ABI declarations with 32-bit CPR1, or soft-float without CPR1; single-float, FP64 and unspecified modes need separate verification.";
			if (abi.isaExtension !== 0 || abi.ases !== (shared ? 1024 : 0)) return "MIPS ABI flags declare an ISA extension or ASE outside this profile's verified instruction declarations.";
			if ((abi.flags1 & ~1) !== 0 || abi.flags2 !== 0) return "MIPS ABI flags contain unsupported general flags.";
			return null;
		};
		isLegacyMipsAdmission = (target) => hasLegacyMipsHeaderShape(target) && ghidraMipsUnsupportedReason(target) === null;
		GHIDRA_MIPS_SOFT_FLOAT_STORAGE = "o32-soft-float-prototype-v1";
		isGhidraMipsSoftFloatTarget = (target) => target.kind === "executable" && target.architecture === "mips" && target.mips?.abiFlags?.cpr1Size === 0 && target.mips.abiFlags.fpAbi === MIPS_FP_ABI_SOFT;
		ghidraMipsSoftFloatFailure = (expected, report) => expected === (report !== undefined) ? undefined : expected ? "The Ghidra session did not report the committed MIPS soft-float prototype." : "The Ghidra session reported MIPS soft-float storage that the profile did not commit.";
		ghidraMipsSoftFloatLimitations = (expected, report) => expected ? ["Soft-float o32: Ghidra's MIPS32 compiler specifications model hard-float o32 only. After analysis REA installs a program-specific `__rea_soft_float` prototype, derived from the default o32 model without its floating-point registers and rules, and assigns it to every function, external function and function-pointer definition whose declared types use float or double, so those values keep their types and use integer registers and stack slots.", ...report === undefined ? [] : [`Soft-float prototype outcome: ${report.functions} functions and ${report.definitions} function-pointer definitions use __rea_soft_float.`]] : [];
		ghidraMipsRelocatableLimitations = (target) => target.kind === "executable" && target.architecture === "mips" && target.mips?.type === MIPS_ET_REL ? ["Relocatable MIPS ELF: Ghidra assigns each allocated section an analysis address and applies the object's relocations there. Returned addresses are analysis coordinates, not the addresses a kernel or linker would choose at load time.", "Undefined symbols (for example kernel exports used by a module) are placed in Ghidra's EXTERNAL block; their definitions are outside this artifact. inspect_native_load_image reports each relocation with Ghidra's status; HI16 entries report PARTIAL because Ghidra applies them together with their paired LO16."] : [];
		ghidraMipsSharedLimitations = (target) => isGhidraMips16SharedTarget(target) && target.architecture === "mips" ? [
			"MIPS16 shared ELF: the endian-matched generic MIPS32 language uses the provider's per-address ISA_MODE context. The program language variant is not the instruction's encoding mode.",
			"Shared-image addresses are Ghidra analysis coordinates, not runtime addresses. The source bytes remain unchanged; inspect_native_load_image retains original relocation bytes, loaded memory bytes and provider relocation status. External GOT bindings remain unverified without their defining images.",
			...target.mips.abiFlags === null ? ["No MIPS ABI flags record was found in the completely examined declaration tables. The header declares o32 but does not establish the floating-point ABI; the default compiler specification does not verify floating-point argument or return storage."] : []
		] : [];
		ghidraMipsProfileParameters = (target, languageOverride) => {
			if (target.kind !== "executable" || target.architecture !== "mips" || target.mips === undefined) return {};
			const abi = target.mips.abiFlags;
			const legacy = isLegacyMipsAdmission(target);
			const language = ghidraMipsLanguageOverride(target);
			const pinnedLanguage = legacy && languageOverride === undefined && language !== undefined ? {
				language_id: language.languageId,
				compiler_spec_id: language.compilerSpecId ?? "default",
				language_selection: "provider-pinned-v1"
			} : {};
			return {
				mips_elf: {
					elf_class: target.mips.elfClass,
					byte_order: target.mips.byteOrder,
					type: target.mips.type,
					flags: target.mips.flags,
					...target.mips.limitations === undefined ? {} : { abi_flags_limitations: [...target.mips.limitations] },
					abi_flags: abi === undefined || abi === null ? null : {
						version: abi.version,
						isa_level: abi.isaLevel,
						isa_revision: abi.isaRevision,
						gpr_size: abi.gprSize,
						cpr1_size: abi.cpr1Size,
						cpr2_size: abi.cpr2Size,
						fp_abi: abi.fpAbi,
						isa_extension: abi.isaExtension,
						ases: abi.ases,
						flags1: abi.flags1,
						flags2: abi.flags2
					},
					...target.mips.gnuAttributes === undefined ? {} : { gnu_attributes: target.mips.gnuAttributes === null ? null : {
						fp_abi: target.mips.gnuAttributes.fpAbi,
						msa: target.mips.gnuAttributes.msa
					} },
					...target.mips.sharedLoad === undefined ? {} : { shared_load: target.mips.sharedLoad.status === "complete" ? {
						status: "complete",
						relocation_count: target.mips.sharedLoad.relocationCount,
						relocation_types: [...target.mips.sharedLoad.relocationTypes],
						symbol_relative_count: target.mips.sharedLoad.symbolRelativeCount
					} : {
						status: "unavailable",
						reason: target.mips.sharedLoad.reason
					} }
				},
				...isGhidraMipsSoftFloatTarget(target) ? { mips_soft_float_storage: GHIDRA_MIPS_SOFT_FLOAT_STORAGE } : {},
				instruction_context_evidence: "per-address-isa-mode-v1",
				mips_support_lane: legacy ? "elf32-exec-arch32-legacy-pinned-v1" : isGhidraMips16SharedTarget(target) ? "elf32-dyn-o32-arch32r2-mips16-local-rel32-v1" : target.mips.type === MIPS_ET_REL ? "elf32-rel-o32-arch32r2-standard-v1" : "elf32-exec-o32-arch32r2-standard-v3",
				...legacy ? { mips_abi_basis: "inferred-o32-assumption-v1" } : {},
				...pinnedLanguage
			};
		};
		ghidraPinnedMipsLanguage = (parameters) => {
			if (parameters.language_selection !== "provider-pinned-v1") return undefined;
			const languageId = parameters.language_id;
			const compilerSpecId = parameters.compiler_spec_id;
			if (typeof languageId !== "string" || typeof compilerSpecId !== "string") return undefined;
			return compilerSpecId === "language-default" ? { languageId } : {
				languageId,
				compilerSpecId
			};
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraSessionValues.js
var GHIDRA_SESSION_CAPABILITIES, GHIDRA_MUTATING_OPERATIONS, PDB_ATTRIBUTE_UTF16_BUDGET, pdbAttributeSchema, capabilitySchema, sessionInfoSchema, ghidraPdbLimitations, parseGhidraSessionInfo, isGhidraShutdownAcknowledgement;
function init_GhidraSessionValues() {
	return (init_GhidraSessionValues = __esmMin((() => {
		init_GhidraAnalysisSeeds();
		init_result();
		init_GhidraInventoryValues();
		init_GhidraFunctionValues();
		init_GhidraExtensions();
		init_GhidraMipsProfile();
		GHIDRA_SESSION_CAPABILITIES = [
			"ping",
			"shutdown",
			...GHIDRA_INVENTORY_OPERATIONS,
			...GHIDRA_FUNCTION_OPERATIONS
		];
		GHIDRA_MUTATING_OPERATIONS = new Set(["annotate_native_function", ...GHIDRA_NAMING_OPERATIONS]);
		PDB_ATTRIBUTE_UTF16_BUDGET = 4096;
		pdbAttributeSchema = z.string().max(PDB_ATTRIBUTE_UTF16_BUDGET).nullable();
		capabilitySchema = z.enum(GHIDRA_SESSION_CAPABILITIES);
		sessionInfoSchema = z.object({
			name: z.literal("REA Ghidra bridge"),
			run_id: z.string().uuid(),
			profile_digest: z.string().regex(/^[a-f0-9]{64}$/u),
			provider: z.object({
				id: z.literal("ghidra"),
				version: z.string().min(1)
			}).strict(),
			read_only: z.boolean(),
			analysis_complete: z.boolean(),
			analysis_timed_out: z.boolean(),
			/** Program Information attributes; absent load state remains unknown. */
			pdb: z.strictObject({
				file: pdbAttributeSchema,
				guid: pdbAttributeSchema,
				/** Ghidra stores CodeView age as a hexadecimal string. */
				age: pdbAttributeSchema,
				signature: pdbAttributeSchema,
				version: pdbAttributeSchema,
				loaded: z.boolean().nullable(),
				resource_limit: z.strictObject({
					utf16_budget: z.literal(PDB_ATTRIBUTE_UTF16_BUDGET),
					omitted_attributes: z.array(z.enum([
						"file",
						"guid",
						"age",
						"signature",
						"version"
					])).min(1).max(5)
				}).optional()
			}).refine((pdb) => [
				pdb.file,
				pdb.guid,
				pdb.age,
				pdb.signature,
				pdb.version
			].reduce((sum, value) => sum + (value?.length ?? 0), 0) <= PDB_ATTRIBUTE_UTF16_BUDGET, "PDB attributes exceed the aggregate wire budget").optional(),
			analysis_extensions: z.array(ghidraExtensionResultSchema).optional(),
			analysis_seeds: ghidraSeedReportSchema.optional(),
			mips_soft_float_storage: z.object({
				policy: z.literal(GHIDRA_MIPS_SOFT_FLOAT_STORAGE),
				functions: z.number().int().nonnegative(),
				definitions: z.number().int().nonnegative()
			}).strict().optional(),
			capabilities: z.array(capabilitySchema),
			target: z.object({
				name: z.string().min(1),
				language_id: z.string().min(1),
				compiler_spec_id: z.string().min(1),
				image_base: z.string().regex(/^0x[0-9a-f]+$/u),
				default_address_space: z.string().min(1),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}).strict()
		}).strict();
		ghidraPdbLimitations = (pdb) => {
			if (pdb === undefined) return ["Ghidra did not report PDB attributes; debug-symbol coverage is unknown."];
			const limitations = [];
			if (pdb.resource_limit !== undefined) limitations.push(`PDB attributes ${pdb.resource_limit.omitted_attributes.join(", ")} were omitted because the handshake's ${pdb.resource_limit.utf16_budget}-UTF-16-unit PDB attribute budget was exhausted. Omitted values remain unknown; they were not truncated or reported as absent.`);
			if (pdb.loaded === true) return [...limitations, "Ghidra reports a loaded PDB; this is not an independent PDB identity or complete symbol/type-coverage attestation. Original names and types may still be missing; an empty name search does not prove a procedure is absent. Use list_procedures and address-based analysis to inspect recovered functions."];
			if ([
				pdb.file,
				pdb.guid,
				pdb.age,
				pdb.signature,
				pdb.version
			].every((value) => value === null)) return limitations;
			const state = pdb.loaded === false ? "not loaded" : "load state unknown";
			return [...limitations, `The target references PDB ${pdb.file ?? "(file unknown)"} (GUID ${pdb.guid ?? "unknown"}, age (hex) ${pdb.age ?? "unknown"}, signature ${pdb.signature ?? "unknown"}, version ${pdb.version ?? "unknown"}); Ghidra reports ${state}. Original names and types may be missing; an empty name search does not prove a procedure is absent. Use list_procedures and address-based analysis to inspect recovered functions. REA does not admit a caller-selected PDB companion.`];
		};
		parseGhidraSessionInfo = (value, expected) => {
			const parsed = sessionInfoSchema.safeParse(value);
			const readOnly = expected.expectedReadOnly ?? false;
			const expectedCapabilities = GHIDRA_SESSION_CAPABILITIES.filter((capability) => !readOnly || !GHIDRA_MUTATING_OPERATIONS.has(capability));
			if (!parsed.success || parsed.data.run_id !== expected.runId || parsed.data.read_only !== readOnly || parsed.data.capabilities.length !== expectedCapabilities.length || parsed.data.provider.version !== expected.providerVersion || parsed.data.profile_digest !== expected.profileDigest || parsed.data.target.sha256 !== expected.targetSha256 || expected.expectedLanguageId !== undefined && parsed.data.target.language_id !== expected.expectedLanguageId || expected.expectedCompilerSpecId !== undefined && parsed.data.target.compiler_spec_id !== expected.expectedCompilerSpecId || new Set(parsed.data.capabilities).size !== expectedCapabilities.length || expectedCapabilities.some((capability) => !parsed.data.capabilities.includes(capability)) || parsed.data.analysis_complete === parsed.data.analysis_timed_out) return err(new Error("Ghidra bridge handshake identity is invalid"));
			return ok(parsed.data);
		};
		isGhidraShutdownAcknowledgement = (value) => typeof value === "object" && value !== null && !Array.isArray(value) && value.shutdown === true && value.project_ephemeral === true;
	})))();
}

//#endregion
//#region dist/ghidra/GhidraTargetSnapshot.js
var createGhidraTargetSnapshot, openSnapshotSource, safeExtension;
function init_GhidraTargetSnapshot() {
	return (init_GhidraTargetSnapshot = __esmMin((() => {
		init_analysisErrorCore();
		init_WindowsPrivateRuntime();
		createGhidraTargetSnapshot = async (sourcePath, runtimeRoot, expectedSha256, options = {}) => {
			if (!/^[a-f0-9]{64}$/u.test(expectedSha256)) throw new TypeError("Ghidra target SHA-256 commitment is invalid");
			const suffix = safeExtension(sourcePath);
			const snapshotPath = join(runtimeRoot, `target-${expectedSha256.slice(0, 12)}${suffix}`);
			if ((options.platform ?? process.platform) === "win32") {
				const observed = await windowsPrivateRuntime(runtimeRoot).snapshot(sourcePath, `target-${expectedSha256.slice(0, 12)}${suffix}`, options.signal);
				if (observed.sha256 !== expectedSha256) throw new AnalysisArtifactChangedError("open_binary", sourcePath, `Ghidra target snapshot digest mismatch: expected ${expectedSha256}, observed ${observed.sha256}`);
				return {
					path: snapshotPath,
					sha256: observed.sha256,
					admission: {
						source: observed.source,
						snapshot: observed.snapshot
					}
				};
			}
			let source;
			let destination;
			try {
				source = await openSnapshotSource(sourcePath);
				if (!(await source.stat()).isFile()) throw new AnalysisArtifactChangedError("open_binary", sourcePath, "The selected Ghidra source is no longer a regular file");
				destination = await open(snapshotPath, "wx", 384);
				await destination.chmod(384);
				const hash = createHash("sha256");
				const digest = new Transform({ transform(chunk, _encoding, done) {
					if (!Buffer.isBuffer(chunk)) {
						done(new TypeError("Ghidra snapshot stream must contain bytes"));
						return;
					}
					hash.update(chunk);
					done(null, chunk);
				} });
				await pipeline(source.createReadStream(), digest, destination.createWriteStream(), options.signal === undefined ? {} : { signal: options.signal });
				const observedSha256 = hash.digest("hex");
				if (observedSha256 !== expectedSha256) throw new AnalysisArtifactChangedError("open_binary", sourcePath, `Ghidra target snapshot digest mismatch: expected ${expectedSha256}, observed ${observedSha256}`);
				return {
					path: snapshotPath,
					sha256: observedSha256
				};
			} catch (cause) {
				if (destination !== undefined) await rm(snapshotPath, { force: true }).catch((cause) => {
					void cause;
				});
				throw cause;
			} finally {
				await Promise.all([source?.close(), destination?.close()]);
			}
		};
		openSnapshotSource = async (path) => {
			try {
				return await open(path, constants.O_RDONLY | constants.O_NONBLOCK);
			} catch (cause) {
				const code = cause instanceof Error && "code" in cause ? cause.code : undefined;
				if (code === "EACCES" || code === "EPERM") throw new AnalysisAccessDeniedError("open_binary", path, code, { cause });
				if (code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP") throw new AnalysisArtifactChangedError("open_binary", path, `The selected Ghidra source could not be opened (${code})`, { cause });
				throw cause;
			}
		};
		safeExtension = (path) => {
			const extension = extname(path);
			return /^\.[A-Za-z0-9]{1,12}$/u.test(extension) ? extension : ".bin";
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraTransport.js
var createGhidraEndpoint, observeGhidraEndpoint, parseTcpEndpoint, hasExactKeys, endpointFailure, isMissing, isWindowsEndpointWriterBusy;
function init_GhidraTransport() {
	return (init_GhidraTransport = __esmMin((() => {
		init_PrivateRuntimeRoot();
		init_WindowsPrivateRuntime();
		init_result();
		init_GhidraSessionError();
		init_unicodeCodePointOrder();
		createGhidraEndpoint = async (runtimeRoot, transport, platform) => {
			const path = join(runtimeRoot, transport === "unix-socket" ? "bridge.sock" : "bridge-endpoint.json");
			const maximumPathBytes = platform === "darwin" ? 103 : 107;
			if (transport !== "unix-socket" || Buffer.byteLength(path, "utf8") <= maximumPathBytes) return { endpoint: {
				transport,
				path
			} };
			const socketRoot = await PrivateRuntimeRoot.create({
				parent: "/tmp",
				prefix: "rea-ghidra-socket-",
				platform
			});
			return {
				endpoint: {
					transport,
					path: join(socketRoot.path, "s")
				},
				socketRoot
			};
		};
		observeGhidraEndpoint = async (endpoint) => {
			if (endpoint.transport === "unix-socket") {
				try {
					await access(endpoint.path);
					return ok({ path: endpoint.path });
				} catch (cause) {
					return isMissing(cause) ? ok(null) : err(endpointFailure(endpoint, "Ghidra socket observation failed", cause));
				}
			}
			if (process.platform === "win32") {
				try {
					return parseTcpEndpoint(endpoint, readWindowsPrivateRuntimeFile(endpoint.path));
				} catch (cause) {
					return isMissing(cause) || isWindowsEndpointWriterBusy(cause) ? ok(null) : err(endpointFailure(endpoint, "Ghidra endpoint observation failed", cause));
				}
			}
			let handle;
			try {
				handle = await open(endpoint.path, "r");
			} catch (cause) {
				return isMissing(cause) ? ok(null) : err(endpointFailure(endpoint, "Ghidra endpoint observation failed", cause));
			}
			try {
				const encoded = await handle.readFile("utf8");
				if (encoded.length === 0) return err(endpointFailure(endpoint, "Ghidra TCP endpoint is invalid"));
				return parseTcpEndpoint(endpoint, encoded);
			} catch (cause) {
				return err(endpointFailure(endpoint, "Ghidra endpoint read failed", cause));
			} finally {
				await handle.close();
			}
		};
		parseTcpEndpoint = (endpoint, encoded) => {
			try {
				const value = JSON.parse(encoded);
				if (typeof value !== "object" || value === null || Array.isArray(value) || !hasExactKeys(value, ["host", "port"]) || value.host !== "127.0.0.1" || !Number.isSafeInteger(value.port) || typeof value.port !== "number" || value.port < 1 || value.port > 65535) return err(endpointFailure(endpoint, "Ghidra TCP endpoint is invalid"));
				return ok({
					host: "127.0.0.1",
					port: value.port
				});
			} catch (cause) {
				return err(endpointFailure(endpoint, "Ghidra TCP endpoint is invalid", cause));
			}
		};
		hasExactKeys = (value, expected) => {
			const keys = Object.keys(value).sort((left, right) => compareUnicodeCodePoints(left, right));
			return keys.length === expected.length && keys.every((key, index) => key === expected[index]);
		};
		endpointFailure = (endpoint, message, cause) => new GhidraSessionError("start", message, {
			transport: endpoint.transport,
			endpoint_path: endpoint.path,
			...cause instanceof Error ? { error: cause.message } : {}
		}, cause instanceof Error ? { cause } : undefined);
		isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
		isWindowsEndpointWriterBusy = (cause) => cause instanceof Error && "win32Code" in cause && cause.win32Code === 32;
	})))();
}

//#endregion
//#region dist/ghidra/GhidraSocketConnection.js
var attachGhidraSocket, connectGhidraSocket, connectGhidraSocketOnce, interruptionFailure$1;
function init_GhidraSocketConnection() {
	return (init_GhidraSocketConnection = __esmMin((() => {
		init_result();
		init_GhidraSessionError();
		init_GhidraTransport();
		attachGhidraSocket = (socket, handlers) => {
			socket.setEncoding("utf8");
			socket.on("data", handlers.data);
			socket.on("error", handlers.error);
			socket.on("close", handlers.close);
			return () => {
				socket.off("data", handlers.data);
				socket.off("error", handlers.error);
				socket.off("close", handlers.close);
			};
		};
		connectGhidraSocket = async (options) => {
			while (options.deadline.remainingMs() > 0) {
				if (options.deadline.signal.aborted) return err(interruptionFailure$1(options));
				if (options.isClosed()) return err(options.failure("cancelled", "Ghidra startup was closed"));
				if (options.processExited()) return err(options.failure("process", "Ghidra exited before bridge startup"));
				const observed = await observeGhidraEndpoint(options.endpoint);
				if (!observed.ok) return observed;
				if (observed.value === null) {
					if (await options.deadline.wait(50) === "aborted") return err(interruptionFailure$1(options));
					continue;
				}
				const connected = await connectGhidraSocketOnce(observed.value, options.deadline.signal);
				if (connected.ok) {
					const detach = attachGhidraSocket(connected.value, options.handlers);
					return ok({
						socket: connected.value,
						detach
					});
				}
				if (await options.deadline.wait(50) === "aborted") return err(interruptionFailure$1(options));
			}
			return err(options.failure("timeout", "Ghidra startup deadline elapsed", undefined, { timeoutMs: options.startupTimeoutMs }));
		};
		connectGhidraSocketOnce = (target, signal) => new Promise((resolve) => {
			const socket = "path" in target ? createConnection(target.path) : createConnection({
				host: target.host,
				port: target.port
			});
			const detach = () => {
				socket.off("connect", onConnect);
				socket.off("error", onError);
				signal.removeEventListener("abort", onAbort);
			};
			const onConnect = () => {
				detach();
				resolve(ok(socket));
			};
			const onError = (cause) => {
				detach();
				socket.destroy();
				resolve(err(new GhidraSessionError("start", "Ghidra bridge connection failed", {
					endpoint: target,
					error: cause.message
				})));
			};
			const onAbort = () => {
				detach();
				socket.destroy();
				resolve(err(new GhidraSessionError("cancelled", "Ghidra bridge connection was cancelled", { endpoint: target })));
			};
			socket.once("connect", onConnect);
			socket.once("error", onError);
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
		});
		interruptionFailure$1 = (options) => options.deadline.interruption === "cancelled" ? options.failure("cancelled", "Ghidra startup was cancelled") : options.failure("timeout", "Ghidra startup deadline elapsed", undefined, { timeoutMs: options.startupTimeoutMs });
	})))();
}

//#endregion
//#region dist/ghidra/GhidraClientWire.js
var GhidraWire;
function init_GhidraClientWire() {
	return (init_GhidraClientWire = __esmMin((() => {
		init_result();
		GhidraWire = class {
			#options;
			constructor(options) {
				this.#options = options;
			}
			/** Write one authenticated request and return its correlated reply. */
			async request(method, params, options) {
				const socket = this.#options.getSocket();
				const token = this.#options.getToken();
				if (socket === undefined || socket.destroyed || token === undefined) return err(this.#options.failure("process", "Ghidra bridge is unavailable"));
				if (options.signal?.aborted === true) return err(this.#options.failure("cancelled", "Ghidra request was cancelled"));
				const id = this.#options.nextId();
				if (options.timeoutMs !== undefined && options.timeoutMs <= 0) return err(this.#options.failure("timeout", "Ghidra request deadline elapsed", undefined, { timeoutMs: options.timeoutMs }));
				const timeoutMs = options.timeoutMs;
				const response = this.#options.pending.wait(id, {
					...timeoutMs === undefined ? {} : {
						timeoutMs,
						timeoutValue: () => err(this.#options.failure("timeout", "Ghidra bridge request timed out", undefined, { timeoutMs }))
					},
					...options.signal === undefined ? {} : { signal: options.signal },
					cancelledValue: () => err(this.#options.failure("cancelled", "Ghidra request was cancelled"))
				});
				socket.write(`${JSON.stringify({
					id,
					token,
					method,
					params
				})}\n`, (cause) => {
					if (cause !== undefined && cause !== null) this.#options.pending.settle(id, err(this.#options.failure("process", "Ghidra bridge write failed", cause)));
				});
				const result = await response;
				this.#options.logger[result.ok ? "debug" : "warn"]({
					method,
					status: result.ok ? "ok" : "error"
				}, "Ghidra bridge request completed");
				return result;
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraClientStartup.js
/** Ping and validate the bridge after its socket is attached. */
async function completeGhidraStartupHandshake(options) {
	const ping = await options.request("ping", {}, {
		signal: options.deadline.signal,
		timeoutMs: options.deadline.remainingMs()
	});
	if (!ping.ok) {
		const failure = options.deadline.signal.aborted ? interruptionFailure(options) : ping.error;
		return err(failure);
	}
	const parsed = options.parseSessionInfo(ping.value);
	if (!parsed.ok || parsed.value.analysis_timed_out) {
		const failure = parsed.ok ? options.failure("analysis_timeout", "Ghidra auto-analysis reached its per-file deadline") : parsed.error;
		return err(failure);
	}
	return parsed;
}
var interruptionFailure;
function init_GhidraClientStartup() {
	return (init_GhidraClientStartup = __esmMin((() => {
		init_result();
		interruptionFailure = (options) => options.deadline.interruption === "cancelled" ? options.failure("cancelled", "Ghidra startup was cancelled") : options.failure("timeout", "Ghidra startup deadline elapsed", undefined, { timeoutMs: options.startupTimeoutMs });
	})))();
}

//#endregion
//#region dist/ghidra/GhidraSessionRoot.js
var hasDotPrefixElement, nearestSafeAncestor, ghidraSessionRoot;
function init_GhidraSessionRoot() {
	return (init_GhidraSessionRoot = __esmMin((() => {
		hasDotPrefixElement = (directory) => resolve(directory).split(sep).some((element) => element.startsWith("."));
		nearestSafeAncestor = (directory) => {
			let current = resolve(directory);
			for (;;) {
				if (!hasDotPrefixElement(current)) return current;
				const parent = dirname(current);
				if (parent === current) return undefined;
				current = parent;
			}
		};
		ghidraSessionRoot = (options = {}) => {
			const base = resolve(options.base ?? tmpdir());
			if (!hasDotPrefixElement(base)) return base;
			const platform = options.platform ?? process.platform;
			const fallback = options.fallback ?? (platform === "win32" ? undefined : "/tmp");
			if (fallback !== undefined && isAbsolute(fallback) && !hasDotPrefixElement(fallback)) return resolve(fallback);
			return nearestSafeAncestor(base) ?? base;
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraClient.js
var SHUTDOWN_TIMEOUT_MS, SESSION_ROOT, GhidraClient;
function init_GhidraClient() {
	return (init_GhidraClient = __esmMin((() => {
		init_analysisErrorBase();
		init_providerCleanupError();
		init_providerOperationHealth();
		init_result();
		init_logger();
		init_PendingOperations();
		init_PrivateRuntimeRoot();
		init_ProviderDeadline();
		init_ProviderRunLineage();
		init_ProviderProcess();
		init_providerStartupTimeout();
		init_GhidraDiagnostics();
		init_GhidraLauncher();
		init_GhidraResponseBuffer();
		init_GhidraResponseRouter();
		init_GhidraRequestQueue();
		init_GhidraSessionError();
		init_GhidraSessionValues();
		init_GhidraTargetSnapshot();
		init_readFileHandleChunks();
		init_BoundedFileBytes();
		init_RegularFile();
		init_OwnedFileHandle();
		init_ProviderDiagnosticRedaction();
		init_GhidraSocketConnection();
		init_GhidraTransport();
		init_GhidraClientWire();
		init_GhidraClientStartup();
		init_GhidraSessionRoot();
		SHUTDOWN_TIMEOUT_MS = 1e4;
		SESSION_ROOT = ghidraSessionRoot();
		GhidraClient = class {
			#options;
			#logger;
			#pending = new PendingOperations();
			#socket;
			#detachSocket;
			#launch;
			#process;
			#runtimeRoot;
			#socketRoot;
			#endpointPath;
			#snapshotPath;
			#snapshotOwners = new Set();
			#targetAdmission;
			#token;
			#authenticationTokens = new Set();
			#runId;
			#lineage = new ProviderRunLineage();
			#nextId = 1;
			#closing = false;
			#processSnapshot;
			#lastDiagnostics = {};
			#startupController;
			#startPromise;
			#ready = false;
			#closePromise;
			#failure = bindGhidraSessionFailure(() => this.#diagnostics(), (value, incomplete) => this.#redactAuthentication(value, incomplete));
			#wire;
			#requestQueue;
			#responseRouter = new GhidraResponseRouter({
				pending: this.#pending,
				nextId: () => this.#nextId,
				remoteFailure: (failure) => this.#failure("remote", failure.message, failure, { remoteCode: failure.code }),
				protocolFailure: (message, cause) => this.#abortProtocol(message, cause)
			});
			#responseBuffer = new GhidraResponseBuffer({ onLine: (line) => this.#responseRouter.route(line) });
			#onSocketData = (chunk) => this.#responseBuffer.push(chunk);
			#onSocketError = () => {
				this.#failAll(this.#failure("process", "Ghidra bridge socket failed"));
			};
			#onSocketClose = () => {
				if (!this.#closing) this.#failAll(this.#failure("process", "Ghidra bridge socket closed"));
			};
			constructor(options) {
				this.#options = {
					...options,
					startupTimeoutMs: options.startupTimeoutMs ?? 33e4,
					platform: options.platform ?? process.platform,
					transport: options.transport ?? "unix-socket"
				};
				this.#logger = options.logger ?? silentLogger;
				this.#wire = new GhidraWire({
					getSocket: () => this.#socket,
					getToken: () => this.#token,
					nextId: () => this.#nextId++,
					pending: this.#pending,
					logger: this.#logger,
					failure: this.#failure
				});
				this.#requestQueue = new GhidraRequestQueue((method, parameters, requestOptions) => this.#wire.request(method, parameters, requestOptions), (kind, message, cause) => this.#failure(kind, message, cause), () => this.#stopAfterActiveCancellation());
			}
			/** Launch Ghidra once and require its exact post-analysis handshake. */
			start(signal, progress) {
				if (progress !== undefined) return this.#reportStartupWait(this.start(signal), signal, progress);
				if (this.#closePromise !== undefined) return this.#closePromise.then(() => this.start(signal), (cause) => err(new GhidraSessionError("process", "Ghidra cleanup remains incomplete", this.#diagnostics(), {
					cause,
					cleanupFailure: this.#cleanupError(cause)
				})));
				if (this.#startPromise !== undefined) {
					if (this.#startupController?.signal.aborted && !signal?.aborted) return this.#startPromise.then((result) => result.ok || result.error.cleanupFailure !== undefined ? result : this.start(signal));
					return this.#startPromise;
				}
				const controller = new AbortController();
				const onAbort = () => controller.abort(signal?.reason);
				if (signal?.aborted === true) onAbort();
				else signal?.addEventListener("abort", onAbort, { once: true });
				const started = this.#start(controller.signal);
				this.#startupController = controller;
				this.#startPromise = started;
				const reset = () => {
					signal?.removeEventListener("abort", onAbort);
					if (this.#startPromise === started) {
						this.#startPromise = undefined;
						if (this.#startupController === controller) this.#startupController = undefined;
					}
				};
				void started.then((result) => {
					signal?.removeEventListener("abort", onAbort);
					if (result.ok) this.#ready = true;
					else reset();
				}, (cause) => {
					this.#logger.debug({ error: cause instanceof Error ? cause.message : String(cause) }, "Ghidra startup promise rejected during bookkeeping");
					reset();
				});
				return started;
			}
			async #reportStartupWait(started, signal, progress) {
				const startedAt = performance.now();
				let active = true;
				let reporting = false;
				const timer = setInterval(() => {
					if (!active || reporting || signal?.aborted) return;
					reporting = true;
					void Promise.resolve().then(() => {
						if (!active || signal?.aborted) return;
						return progress.report({
							phase: "ghidra_startup",
							completed: 0,
							total: null,
							message: `Waiting for Ghidra startup (${String(Math.floor((performance.now() - startedAt) / 1e3))}s elapsed); import, auto-analysis and bridge readiness may still be pending`
						});
					}).catch(() => {}).finally(() => {
						reporting = false;
					});
				}, 1e4);
				try {
					return await started;
				} finally {
					active = false;
					clearInterval(timer);
				}
			}
			/** Revalidate live bridge, provider, run, and profile metadata. */
			async ping(options = {}) {
				const started = await this.start(options.signal);
				if (!started.ok) return started;
				const result = await this.#wire.request("ping", {}, options);
				if (!result.ok) return result;
				return this.#parseSessionInfo(result.value);
			}
			/** Execute one admitted operation through the serial per-Program queue. */
			async callTool(operation, parameters, options = {}) {
				const started = await this.start(options.signal, options.progress);
				if (!started.ok) return started;
				return this.#requestQueue.run(operation, parameters, options.signal === undefined ? {} : { signal: options.signal });
			}
			/** Dispatch against the connected bridge without invoking startup or retry. */
			callToolIfReady(operation, parameters, options = {}) {
				if (!this.isReady()) return Promise.resolve(undefined);
				return this.#requestQueue.run(operation, parameters, options.signal === undefined ? {} : { signal: options.signal });
			}
			/** Read the private immutable source for format parsers that require captured bytes. */
			readTargetSnapshot(maximumBytes, signal) {
				return this.#withTargetSnapshot(async (handle, initial, path) => {
					if (maximumBytes !== undefined && (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0)) throw new RangeError("Snapshot byte limit must be a safe integer");
					if (maximumBytes !== undefined && initial.size > maximumBytes) return {
						kind: "over-capacity",
						sourceBytesAtLeast: initial.size,
						maximumBytes
					};
					const bytes = await readBoundedFileBytes(handle, maximumBytes ?? initial.size, signal, initial.size);
					if (bytes === undefined || bytes.length !== initial.size) throw new RegularFileChangedError(path);
					return {
						kind: "captured",
						bytes
					};
				}, signal);
			}
			/** Measure the complete snapshot identity without retaining its bytes in memory. */
			hashTargetSnapshot(signal) {
				return this.#withTargetSnapshot(async (handle, initial, path) => {
					const hash = createHash("sha256");
					let bytes = 0;
					for await (const chunk of readFileHandleChunks(handle, {
						end: initial.size,
						signal
					})) {
						bytes += chunk.length;
						if (bytes > initial.size) throw new RegularFileChangedError(path);
						hash.update(chunk);
					}
					if (bytes !== initial.size) throw new RegularFileChangedError(path);
					return {
						sha256: hash.digest("hex"),
						bytes
					};
				}, signal);
			}
			async #withTargetSnapshot(read, signal) {
				const path = this.#snapshotPath;
				if (path === undefined) return err(this.#failure("protocol", "Ghidra target snapshot is unavailable before startup or after close"));
				try {
					const handle = await openRegularFile(path, {
						symlinks: "reject",
						signal
					});
					const owner = new OwnedFileHandle(handle);
					this.#snapshotOwners.add(owner);
					let result;
					try {
						const initial = await handle.stat();
						signal?.throwIfAborted();
						if (!Number.isSafeInteger(initial.size) || initial.size < 0) throw new RangeError("Snapshot size must be a safe integer");
						const value = await read(handle, initial, path);
						signal?.throwIfAborted();
						const after = await handle.stat();
						signal?.throwIfAborted();
						if (!sameRegularFileState(initial, after)) throw new RegularFileChangedError(path);
						result = ok(value);
					} catch (cause) {
						result = err(cause);
					}
					try {
						await owner.close();
						this.#snapshotOwners.delete(owner);
					} catch (closeFailure) {
						throw new AggregateError(result.ok ? [closeFailure] : [result.error, closeFailure], "Ghidra target snapshot read or descriptor cleanup failed");
					}
					if (!result.ok) throw result.error;
					return result;
				} catch (cause) {
					if (cause instanceof RegularFileAdmissionFailure) this.#snapshotOwners.add(cause.owner);
					return err(this.#failure(signal?.aborted === true ? "cancelled" : "protocol", "Ghidra target snapshot could not be read for load-image verification", cause));
				}
			}
			/** Stop the owned process group and remove all project/runtime artifacts. */
			async close() {
				try {
					await this.#requestClose(false);
					return ok(null);
				} catch (cause) {
					return err(this.#cleanupError(cause));
				}
			}
			/** True only after the authenticated startup handshake has completed. */
			isReady() {
				return this.#ready && this.#socket !== undefined && !this.#socket.destroyed && this.#closePromise === undefined;
			}
			#cleanupError(cause) {
				if (cause instanceof AnalysisError && cause.cleanupIncomplete) return cause;
				return new ProviderCleanupError("ghidra", [...this.#process === undefined ? [] : ["ghidra-process"], ...[this.#runtimeRoot, this.#socketRoot].flatMap((root) => root === undefined ? [] : [root.path])], {
					reason: cause instanceof Error ? cause.message : String(cause),
					diagnostics: this.#diagnostics()
				}, { cause });
			}
			async #startupFailure(primary) {
				try {
					await this.#cleanup();
					return err(primary);
				} catch (cause) {
					return err(new GhidraSessionError(primary.kind, primary.message, primary.diagnostics, {
						...primary.cause === undefined ? {} : { cause: primary.cause },
						...primary.timeoutMs === undefined ? {} : { timeoutMs: primary.timeoutMs },
						...primary.remoteCode === undefined ? {} : { remoteCode: primary.remoteCode },
						cleanupFailure: this.#cleanupError(cause)
					}));
				}
			}
			#requestClose(forceStop) {
				this.#ready = false;
				const starting = this.#startPromise;
				const controller = this.#startupController;
				controller?.abort();
				this.#closePromise ??= Promise.resolve().then(() => this.#close(starting, controller, forceStop));
				return this.#closePromise;
			}
			#stopAfterActiveCancellation() {
				return this.#requestClose(true).catch((cause) => {
					this.#logger.error({ error: cause instanceof Error ? cause.message : String(cause) }, "Ghidra cleanup after active request cancellation failed");
					throw cause;
				});
			}
			/** Observed failures that prevent a retained session from being reused. */
			operationHealthSnapshot() {
				const exit = this.#process?.observedExit();
				const state = exit !== undefined ? "exited" : this.#socket?.destroyed === true ? "unreachable" : this.#startPromise === undefined && (this.#process !== undefined || this.#socket !== undefined || this.#runtimeRoot !== undefined || this.#socketRoot !== undefined || this.#snapshotOwners.size > 0) ? "unknown" : undefined;
				if (state === undefined) return undefined;
				return {
					state,
					stage: null,
					retryAction: providerRetryAction(state),
					exitCode: exit?.code ?? null,
					requests: []
				};
			}
			/** Latest bounded local diagnostics, with bearer material redacted. */
			diagnostics() {
				return structuredClone(this.#diagnostics());
			}
			/** Latest token-verified launcher lineage for the active run. */
			runtimeLineage() {
				return this.#lineage.snapshot();
			}
			async #start(signal) {
				if (signal.aborted) return err(this.#failure("cancelled", "Ghidra startup was cancelled"));
				if (this.#socket !== undefined || this.#runtimeRoot !== undefined) return err(this.#failure("protocol", "Ghidra client is already started"));
				this.#processSnapshot = undefined;
				const deadline = new ProviderStartupDeadline(this.#options.startupTimeoutMs, signal);
				try {
					return await this.#startWithin(deadline);
				} catch (cause) {
					if (cause instanceof GhidraSessionError) return err(cause);
					throw cause;
				} finally {
					deadline.dispose();
				}
			}
			async #startWithin(deadline) {
				try {
					this.#runtimeRoot = await PrivateRuntimeRoot.create({
						parent: SESSION_ROOT,
						prefix: "rea-ghidra-",
						platform: this.#options.platform
					});
				} catch (cause) {
					return err(this.#failure("start", "Ghidra runtime root creation failed", cause));
				}
				if (deadline.signal.aborted) return this.#startupInterrupted(deadline);
				let endpoint;
				try {
					const allocated = await createGhidraEndpoint(this.#runtimeRoot.path, this.#options.transport, this.#options.platform);
					endpoint = allocated.endpoint;
					this.#socketRoot = allocated.socketRoot;
					this.#endpointPath = endpoint.path;
				} catch (cause) {
					const failure = this.#failure("start", "Ghidra private endpoint allocation failed", cause);
					return this.#startupFailure(failure);
				}
				try {
					const snapshot = await createGhidraTargetSnapshot(this.#options.targetPath, this.#runtimeRoot.path, this.#options.targetSha256, {
						signal: deadline.signal,
						platform: this.#options.platform
					});
					this.#snapshotPath = snapshot.path;
					this.#targetAdmission = snapshot.admission;
				} catch (cause) {
					if (deadline.signal.aborted) return this.#startupInterrupted(deadline);
					const failure = this.#failure("start", "Ghidra target snapshot failed admission", cause);
					return this.#startupFailure(failure);
				}
				if (deadline.signal.aborted) return this.#startupInterrupted(deadline);
				this.#token = randomBytes(32).toString("hex");
				this.#authenticationTokens.add(this.#token);
				this.#lineage.reset();
				this.#runId = this.#options.runId ?? randomUUID();
				const launched = await this.#options.launcher.launch({
					runtimeRoot: this.#runtimeRoot.path,
					transport: endpoint.transport,
					endpointPath: endpoint.path,
					token: this.#token,
					runId: this.#runId,
					targetPath: this.#snapshotPath,
					targetSha256: this.#options.targetSha256,
					providerVersion: this.#options.providerVersion,
					profileDigest: this.#options.profileDigest
				}, { signal: deadline.signal }).catch((cause) => err(this.#failure("start", "Ghidra launcher failed", cause)));
				if (!launched.ok) {
					const partialLaunch = launched.error instanceof GhidraLaunchError ? launched.error.partialLaunch : undefined;
					if (partialLaunch !== undefined) {
						this.#launch = partialLaunch;
						this.#process = new ProviderProcessSupervisor(partialLaunch, {
							maxDiagnosticBytes: GHIDRA_PROCESS_DIAGNOSTIC_BYTES,
							onDiagnostic: (event) => this.#onProcessDiagnostic(event)
						});
					}
					const failure = deadline.signal.aborted ? this.#interruptionFailure(deadline, launched.error) : launched.error instanceof GhidraSessionError ? launched.error : this.#failure("start", launched.error.message, launched.error);
					return this.#startupFailure(failure);
				}
				this.#launch = launched.value;
				this.#process = new ProviderProcessSupervisor(launched.value, {
					maxDiagnosticBytes: GHIDRA_PROCESS_DIAGNOSTIC_BYTES,
					onDiagnostic: (event) => this.#onProcessDiagnostic(event)
				});
				const completed = await this.#connectAndHandshake(endpoint, deadline);
				if (!completed.ok) return this.#startupFailure(completed.error);
				await this.#lineage.observe(this.#launch);
				this.#requestQueue.reopen();
				return completed;
			}
			async #connectAndHandshake(endpoint, deadline) {
				for (let attempt = 0;; attempt += 1) {
					const connected = await this.#connect(endpoint, deadline);
					if (!connected.ok) return connected;
					const completed = await completeGhidraStartupHandshake({
						deadline,
						request: (method, params, requestOptions) => this.#wire.request(method, params, requestOptions),
						parseSessionInfo: (value) => this.#parseSessionInfo(value),
						failure: this.#failure,
						startupTimeoutMs: this.#options.startupTimeoutMs
					});
					if (completed.ok || completed.error.kind !== "process" || endpoint.transport !== "authenticated-loopback-tcp" || attempt >= 2 || deadline.signal.aborted || this.#closing || this.#process?.observedExit() !== undefined) return completed;
					this.#detachSocket?.();
					this.#detachSocket = undefined;
					this.#socket?.destroy();
					this.#socket = undefined;
					this.#responseBuffer.reset();
				}
			}
			async #connect(endpoint, deadline) {
				const connected = await connectGhidraSocket({
					endpoint,
					deadline,
					failure: this.#failure,
					isClosed: () => this.#closing,
					processExited: () => this.#process?.observedExit() !== undefined,
					startupTimeoutMs: this.#options.startupTimeoutMs,
					handlers: {
						data: this.#onSocketData,
						error: this.#onSocketError,
						close: this.#onSocketClose
					}
				});
				if (!connected.ok) return connected;
				this.#socket = connected.value.socket;
				this.#detachSocket = connected.value.detach;
				return ok(undefined);
			}
			#parseSessionInfo(value) {
				const runId = this.#runId;
				if (runId === undefined) return err(this.#failure("protocol", "Ghidra run identity is missing"));
				const parsed = parseGhidraSessionInfo(value, {
					runId,
					expectedReadOnly: this.#options.transport === "authenticated-loopback-tcp",
					providerVersion: this.#options.providerVersion,
					profileDigest: this.#options.profileDigest,
					targetSha256: this.#options.targetSha256,
					...this.#targetAdmission === undefined ? {} : { targetAdmission: this.#targetAdmission },
					...this.#options.expectedLanguageId === undefined ? {} : { expectedLanguageId: this.#options.expectedLanguageId },
					...this.#options.expectedCompilerSpecId === undefined ? {} : { expectedCompilerSpecId: this.#options.expectedCompilerSpecId }
				});
				if (parsed.ok) return parsed;
				return err(this.#failure("protocol", "Ghidra bridge handshake is invalid", parsed.error));
			}
			async #close(starting, controller, forceStop) {
				try {
					await starting?.catch(() => undefined);
					await this.#cleanup(forceStop);
				} finally {
					if (this.#startPromise === starting) this.#startPromise = undefined;
					if (this.#startupController === controller) this.#startupController = undefined;
					this.#closePromise = undefined;
				}
			}
			async #cleanup(forceStop = false) {
				this.#closing = true;
				let forcedStopFailure;
				try {
					this.#requestQueue.failQueued(this.#failure("process", "Ghidra session closed"));
					const socket = this.#socket;
					if (!forceStop && socket !== undefined && !socket.destroyed) {
						const shutdown = await this.#wire.request("shutdown", {}, { timeoutMs: SHUTDOWN_TIMEOUT_MS }).catch((cause) => err(this.#failure("process", "Ghidra shutdown request failed", cause)));
						if (!shutdown.ok || !isGhidraShutdownAcknowledgement(shutdown.value)) this.#logger.warn({
							status: shutdown.ok ? "invalid-acknowledgement" : "failed",
							...shutdown.ok ? {} : {
								kind: shutdown.error.kind,
								message: shutdown.error.message,
								diagnostics: shutdown.error.diagnostics
							}
						}, "Ghidra bridge shutdown was not confirmed");
					}
					this.#failAll(this.#failure("process", "Ghidra session closed"));
					this.#detachSocket?.();
					this.#detachSocket = undefined;
					socket?.destroy();
					this.#socket = undefined;
					if (this.#process !== undefined) {
						await this.#process.waitForExit(500);
						this.#processSnapshot = this.#process.snapshot();
						const stopped = await this.#process.stop();
						this.#processSnapshot = this.#process.snapshot();
						if (stopped.status === "incomplete") {
							this.#options.onDiagnostic?.({
								type: "cleanup-incomplete",
								reason: stopped.reason
							});
							this.#logger.warn({ reason: stopped.reason }, "Ghidra process cleanup failed closed");
							throw this.#failure("process", `Ghidra process cleanup was incomplete: ${stopped.reason}`);
						}
					}
					this.#lastDiagnostics = this.#diagnostics();
					this.#process = undefined;
					this.#launch = undefined;
					for (const owner of this.#snapshotOwners) {
						await owner.close();
						this.#snapshotOwners.delete(owner);
					}
					try {
						await this.#removeRuntimeRoots();
					} catch (cause) {
						if (forceStop) forcedStopFailure ??= this.#failure("process", "Ghidra runtime cleanup after cancellation failed", cause);
						else throw cause;
					}
					this.#snapshotPath = undefined;
					this.#endpointPath = undefined;
					this.#token = undefined;
					this.#runId = undefined;
					this.#responseBuffer.reset();
					if (forcedStopFailure !== undefined) throw forcedStopFailure;
				} finally {
					this.#closing = false;
				}
			}
			/**
			* Remove the runtime and socket roots, keeping each one that could not be
			* removed so a later close retries it rather than reporting success.
			*/
			async #removeRuntimeRoots() {
				const roots = [{
					root: this.#runtimeRoot,
					release: () => this.#runtimeRoot = undefined
				}, {
					root: this.#socketRoot,
					release: () => this.#socketRoot = undefined
				}];
				const leftovers = [];
				let firstCause;
				for (const { root, release } of roots) {
					if (root === undefined) continue;
					try {
						await root.close();
						release();
					} catch (cause) {
						firstCause ??= cause;
						leftovers.push({
							path: root.path,
							reason: cause instanceof Error ? cause.message : String(cause)
						});
					}
				}
				if (leftovers.length > 0) throw new ProviderCleanupError("ghidra", leftovers.map(({ path }) => path), {
					reason: "Ghidra's private runtime directory could not be removed; it is retained for a later close.",
					leftover_paths: leftovers.map(({ path }) => path),
					failures: leftovers.map(({ path, reason }) => `${path}: ${reason}`)
				}, { cause: firstCause });
			}
			#redactAuthentication(value, incomplete = false) {
				for (const token of this.#authenticationTokens) {
					const bytes = Buffer.byteLength(value);
					value = redactCapturedTransportCredential({
						text: value,
						bytes,
						observedBytes: bytes + (incomplete ? 1 : 0)
					}, token, "[REDACTED]");
				}
				return value;
			}
			#onProcessDiagnostic(event) {
				if (event.type === "output") {
					this.#options.onDiagnostic?.({
						type: "launcher-output",
						stream: event.stream,
						bytes: event.bytes,
						totalBytes: event.totalBytes
					});
					return;
				}
				if (event.type === "error") {
					this.#logger.warn({ message: event.message }, "Ghidra process emitted an error");
					return;
				}
				this.#processSnapshot = event.snapshot;
				this.#options.onDiagnostic?.({
					type: "launcher-exit",
					code: event.code,
					signal: event.signal
				});
				if (!this.#closing) this.#failAll(this.#failure("process", "Ghidra process exited"));
			}
			#abortProtocol(message, cause) {
				this.#failAll(this.#failure("protocol", message, cause));
				this.#socket?.destroy();
			}
			#failAll(error) {
				this.#pending.failAll(() => err(error));
			}
			async #startupInterrupted(deadline) {
				const failure = this.#interruptionFailure(deadline);
				return this.#startupFailure(failure);
			}
			#interruptionFailure(deadline, cause) {
				return deadline.interruption === "cancelled" ? this.#failure("cancelled", "Ghidra startup was cancelled", cause) : this.#failure("timeout", "Ghidra startup deadline elapsed", cause, { timeoutMs: deadline.timeoutMs });
			}
			#diagnostics() {
				const snapshot = this.#process?.snapshot() ?? this.#processSnapshot;
				return createGhidraDiagnostics({
					targetPath: this.#options.targetPath,
					targetSha256: this.#options.targetSha256,
					...this.#targetAdmission === undefined ? {} : { targetAdmission: this.#targetAdmission },
					transport: this.#options.transport,
					providerVersion: this.#options.providerVersion,
					profileDigest: this.#options.profileDigest,
					...this.#runId === undefined ? {} : { runId: this.#runId },
					...this.#runtimeRoot === undefined ? {} : { runtimeRoot: this.#runtimeRoot.path },
					...this.#socketRoot === undefined ? {} : { socketRoot: this.#socketRoot.path },
					...this.#endpointPath === undefined ? {} : { endpointPath: this.#endpointPath },
					...this.#launch === undefined ? {} : { launch: this.#launch },
					...snapshot === undefined ? {} : { snapshot },
					...this.#token === undefined ? {} : { token: this.#token },
					previous: this.#lastDiagnostics
				});
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraRiscvProfile.js
var EF_RISCV_RVC, EF_RISCV_FLOAT_ABI, EF_RISCV_FLOAT_ABI_DOUBLE, EF_RISCV_RVE, EF_RISCV_TSO, ET_REL, ET_EXEC, ET_DYN, EF_RISCV_DECLARED_BITS, riscvUnsupportedFloatAbi, ghidraRiscvUnsupportedReason, ghidraRiscvLanguageOverride, ghidraRiscvProfileParameters, ghidraRiscvLimitations;
function init_GhidraRiscvProfile() {
	return (init_GhidraRiscvProfile = __esmMin((() => {
		EF_RISCV_RVC = 1;
		EF_RISCV_FLOAT_ABI = 6;
		EF_RISCV_FLOAT_ABI_DOUBLE = 4;
		EF_RISCV_RVE = 8;
		EF_RISCV_TSO = 16;
		ET_REL = 1;
		ET_EXEC = 2;
		ET_DYN = 3;
		EF_RISCV_DECLARED_BITS = EF_RISCV_RVC | EF_RISCV_FLOAT_ABI;
		riscvUnsupportedFloatAbi = (abi) => abi === 0 ? "unspecified (soft-float convention)" : abi === 2 ? "single-float" : "quad-float";
		ghidraRiscvUnsupportedReason = (target) => {
			if (target.kind !== "executable" || target.architecture !== "riscv") return null;
			const metadata = target.riscv;
			if (target.format !== "elf") return "RISC-V analysis requires ELF header metadata; a family name alone does not select an ISA or ABI.";
			if (metadata.byteOrder !== "little") return "This Ghidra RISC-V lane supports little-endian images only; Ghidra 12.1.4 ships no big-endian RISC-V language.";
			if (metadata.elfClass !== 32 && metadata.elfClass !== 64) return "This Ghidra RISC-V lane requires ELF32 or ELF64; the class decides which generic language is pinned.";
			if ((metadata.flags & EF_RISCV_RVE) !== 0) return "EF_RISCV_RVE declares the embedded 15-register ABI, which needs its own processor specification and compiler verification.";
			if ((metadata.flags & EF_RISCV_TSO) !== 0) return "EF_RISCV_TSO declares the total-store-order memory model; this lane verifies the baseline model only.";
			if (metadata.type !== ET_EXEC) return `This Ghidra RISC-V lane supports fixed-address ET_EXEC only; ${metadata.type === ET_REL ? "relocatable" : metadata.type === ET_DYN ? "shared and position-independent" : `e_type ${metadata.type}`} images need separate load verification. ET_EXEC alone does not establish static linkage, which this lane does not inspect.`;
			const abi = metadata.flags & EF_RISCV_FLOAT_ABI;
			if (abi !== EF_RISCV_FLOAT_ABI_DOUBLE) return `This Ghidra RISC-V lane requires the EF_RISCV_FLOAT_ABI_DOUBLE declaration (${riscvUnsupportedFloatAbi(abi)} observed); the pinned generic language uses the double-float compiler specification.`;
			const unsupportedFlags = (metadata.flags & ~EF_RISCV_DECLARED_BITS) >>> 0;
			if (unsupportedFlags !== 0) return `RISC-V e_flags declares bits outside the verified lane (0x${unsupportedFlags.toString(16)}); reserved or newer declarations are not treated as compatible with this profile.`;
			return null;
		};
		ghidraRiscvLanguageOverride = (target) => target.kind === "executable" && target.architecture === "riscv" && ghidraRiscvUnsupportedReason(target) === null ? {
			languageId: `RISCV:LE:${target.riscv.elfClass}:default`,
			compilerSpecId: "gcc"
		} : undefined;
		ghidraRiscvProfileParameters = (target) => target.kind === "executable" && target.architecture === "riscv" && target.riscv !== undefined ? {
			riscv_elf: {
				elf_class: target.riscv.elfClass,
				byte_order: target.riscv.byteOrder,
				type: target.riscv.type,
				flags: target.riscv.flags,
				float_abi_double: (target.riscv.flags & EF_RISCV_FLOAT_ABI) === EF_RISCV_FLOAT_ABI_DOUBLE,
				rvc_declared: (target.riscv.flags & EF_RISCV_RVC) !== 0,
				rve_declared: (target.riscv.flags & EF_RISCV_RVE) !== 0,
				tso_declared: (target.riscv.flags & EF_RISCV_TSO) !== 0
			},
			riscv_support_lane: target.riscv.elfClass === 32 ? "elf32-exec-le-double-float-generic-v1" : "elf64-exec-le-double-float-generic-v1"
		} : {};
		ghidraRiscvLimitations = (target) => target.kind === "executable" && target.architecture === "riscv" ? [
			`RISC-V ELF: REA pins Ghidra's generic \`RISCV:LE:${target.riscv.elfClass}:default\` language with the \`gcc\` compiler specification instead of accepting the loader's header-based choice, which selects \`RISCV:LE:32:AndeStar_v5\` for ordinary RV32 images on Ghidra 12.1.4.`,
			"The pinned generic language models the double-float ABI declared by `e_flags`; the declaration is recorded as an ELF fact and is not evidence of the original compiler or of verified instruction semantics.",
			"Admission reads `e_type` only: a fixed-address ET_EXEC declaration does not establish static linkage, and program headers (`PT_INTERP`, dynamic dependencies) are not inspected by this lane."
		] : [];
	})))();
}

//#endregion
//#region dist/ghidra/GhidraPowerPcProfile.js
var GHIDRA_POWERPC_LANGUAGE, ghidraPowerPcUnsupportedReason, ghidraPowerPcLanguage, ghidraPowerPcProfileParameters;
function init_GhidraPowerPcProfile() {
	return (init_GhidraPowerPcProfile = __esmMin((() => {
		GHIDRA_POWERPC_LANGUAGE = {
			languageId: "PowerPC:BE:32:default",
			compilerSpecId: "default"
		};
		ghidraPowerPcUnsupportedReason = (target) => {
			if (target.kind !== "executable" || target.architecture !== "powerpc") return null;
			const metadata = target.powerpc;
			if (target.format !== "elf" || metadata === undefined) return "PowerPC analysis requires ELF header metadata; a family name alone does not select a processor variant.";
			if (metadata.elfClass !== 32) return "This Ghidra PowerPC lane supports ELF32 only; PPC64 remains unsupported.";
			if (metadata.byteOrder !== "big") return "This Ghidra PowerPC lane supports big-endian ELF32 only; little-endian PowerPC needs separate verification.";
			if (metadata.type !== 2) return "This Ghidra PowerPC lane supports ET_EXEC only; relocatable objects and shared images need separate load verification.";
			if ((metadata.flags & 2147483648) !== 0) return "EF_PPC_EMB declares an embedded PowerPC variant that needs a separately supported processor profile.";
			return null;
		};
		ghidraPowerPcLanguage = (target) => target.kind === "executable" && target.architecture === "powerpc" ? GHIDRA_POWERPC_LANGUAGE : undefined;
		ghidraPowerPcProfileParameters = (target) => {
			if (target.kind !== "executable" || target.architecture !== "powerpc" || target.powerpc === undefined) return {};
			return {
				powerpc_elf: {
					elf_class: target.powerpc.elfClass,
					byte_order: target.powerpc.byteOrder,
					type: target.powerpc.type,
					flags: target.powerpc.flags
				},
				powerpc_support_lane: "elf32-be-exec-generic-v1"
			};
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraRawBinaryLanguage.js
var ghidraRawBinaryLanguage;
function init_GhidraRawBinaryLanguage() {
	return (init_GhidraRawBinaryLanguage = __esmMin((() => {
		ghidraRawBinaryLanguage = (architecture) => {
			switch (architecture) {
				case "6502": return {
					languageId: "6502:LE:16:default",
					compilerSpecId: "default",
					defaultAddressSpace: "RAM"
				};
				case "x86": return {
					languageId: "x86:LE:32:default",
					compilerSpecId: "gcc",
					defaultAddressSpace: "ram"
				};
				case "x86_64": return {
					languageId: "x86:LE:64:default",
					compilerSpecId: "gcc",
					defaultAddressSpace: "ram"
				};
				case "arm": return {
					languageId: "ARM:LE:32:v7",
					compilerSpecId: "default",
					defaultAddressSpace: "ram"
				};
				case "arm64": return {
					languageId: "AARCH64:LE:64:v8A",
					compilerSpecId: "default",
					defaultAddressSpace: "ram"
				};
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraPspProfile.js
var isGhidraPspTarget, ghidraProcessorUnsupportedReason, GHIDRA_PSP_LIMITATIONS;
function init_GhidraPspProfile() {
	return (init_GhidraPspProfile = __esmMin((() => {
		init_GhidraMipsProfile();
		init_GhidraPowerPcProfile();
		init_GhidraRiscvProfile();
		isGhidraPspTarget = (target) => target.kind === "executable" && target.format === "elf" && target.architecture === "mips" && target.mips !== undefined && (target.mips.flags & 16711680) === 10616832;
		ghidraProcessorUnsupportedReason = (target) => {
			if (target.kind === "executable" && target.architecture === "powerpc") return ghidraPowerPcUnsupportedReason(target);
			if (target.kind === "executable" && target.architecture === "riscv") return ghidraRiscvUnsupportedReason(target);
			if (target.kind !== "executable" || target.architecture !== "mips" || !isGhidraPspTarget(target)) return ghidraMipsUnsupportedReason(target);
			const metadata = target.mips;
			if (metadata === undefined) return "PSP analysis requires ELF metadata.";
			const gnuAttributesReason = ghidraMipsGnuAttributesUnsupportedReason(metadata);
			if (gnuAttributesReason !== null) return gnuAttributesReason;
			if (metadata.elfClass !== 32 || metadata.byteOrder !== "little") return "The PSP Allegrex profile requires little-endian ELF32.";
			if (metadata.type !== 2) return "The PSP Allegrex profile supports static ET_EXEC only; PRX, shared and relocatable images require separate verification.";
			if (metadata.flags !== 279064577) return "The PSP Allegrex profile requires the verified PSPSDK ELF declaration 0x10a23001; other ISA/ABI/ASE flags are not inferred.";
			const abi = metadata.abiFlags;
			if (abi === undefined || abi === null) return "The PSP Allegrex profile requires an inspected separate MIPS ABI flags record; missing declarations are not inferred.";
			if (abi.version !== 0 || abi.isaLevel !== 2 || abi.isaRevision !== 0 || abi.gprSize !== 1 || abi.cpr1Size !== 1 || abi.cpr2Size !== 0 || abi.fpAbi !== 2 || abi.isaExtension !== 0 || abi.ases !== 0 || abi.flags1 !== 1 || abi.flags2 !== 0) return "The separate MIPS ABI flags record does not match the verified PSP MIPS-II/32-bit/single-float declaration; other versions, register modes and extension flags require separate verification.";
			return null;
		};
		GHIDRA_PSP_LIMITATIONS = [
			"PSP/Allegrex analysis uses the caller-installed ghidra-allegrex extension. ELF declarations and selected instruction checks are not proof of runtime semantics.",
			"ghidra-allegrex does not model VFPU prefix effects completely in decompiled output. Verify vector behavior independently; pseudocode is not an execution oracle.",
			"This PSP profile covers static ELF32 ET_EXEC only. PRX relocations, PBP/ISO containers, live overlays and PSP emulation are outside this verified lane."
		];
	})))();
}

//#endregion
//#region dist/domain/native/nativeAotPe.js
var RTR_SIGNATURE, RTR_ROW_SIZE, RTR_ROW_TYPE, DEHYDRATED_DATA, FROZEN_OBJECT_REGION, NATIVE_AOT_MAX_SOURCE_BYTES, NATIVE_AOT_MAX_REPORT_BYTES, NATIVE_AOT_MAX_WORK_UNITS, NATIVE_AOT_MAX_WORKING_MEMORY_BYTES, NATIVE_AOT_PROFILE_CONTRACT_REVISION, DEFAULT_NATIVE_AOT_PARSER_LIMITS, NativeAotParserBudget, virtualExtent, fileBackedVirtualExtent, METHOD_TABLE_RECORD_BYTES, MethodTableIndex, nativeAotSnapshotOverCapacity, assertNativeAotReportFits, parsedSummary, PeImage, hex, readU64, readU32, notApplicable, findDirectory, parseMethodTable, readRelativePointer, jsonUtf16StringBytes, hydrate, discoverTables, parseNativeAotPe;
function init_nativeAotPe() {
	return (init_nativeAotPe = __esmMin((() => {
		RTR_SIGNATURE = 5395538;
		RTR_ROW_SIZE = 24;
		RTR_ROW_TYPE = 1;
		DEHYDRATED_DATA = 207;
		FROZEN_OBJECT_REGION = 206;
		NATIVE_AOT_MAX_SOURCE_BYTES = 128 * 1024 * 1024;
		NATIVE_AOT_MAX_REPORT_BYTES = 4 * 1024 * 1024;
		NATIVE_AOT_MAX_WORK_UNITS = 64 * 1024 * 1024;
		NATIVE_AOT_MAX_WORKING_MEMORY_BYTES = 64 * 1024 * 1024;
		NATIVE_AOT_PROFILE_CONTRACT_REVISION = "rtr-9.1-x64-pe-read-only-v3";
		DEFAULT_NATIVE_AOT_PARSER_LIMITS = {
			sourceBytes: NATIVE_AOT_MAX_SOURCE_BYTES,
			workUnits: NATIVE_AOT_MAX_WORK_UNITS,
			workingMemoryBytes: NATIVE_AOT_MAX_WORKING_MEMORY_BYTES
		};
		NativeAotParserBudget = class {
			limits;
			workUnits = 0;
			workingMemoryBytes = 0;
			workingMemoryBytesPeak = 0;
			truncationReason;
			constructor(limits) {
				this.limits = limits;
			}
			consumeWork(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.limits.workUnits - this.workUnits) {
					this.truncationReason ??= "work-unit-budget";
					return false;
				}
				this.workUnits += bytes;
				return true;
			}
			reserveWorkingMemory(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.limits.workingMemoryBytes - this.workingMemoryBytes) {
					this.truncationReason ??= "working-memory-budget";
					return false;
				}
				this.workingMemoryBytes += bytes;
				this.workingMemoryBytesPeak = Math.max(this.workingMemoryBytesPeak, this.workingMemoryBytes);
				return true;
			}
			releaseWorkingMemory(bytes) {
				this.workingMemoryBytes = Math.max(0, this.workingMemoryBytes - bytes);
			}
		};
		virtualExtent = (section) => section.virtualSize === 0 ? section.rawSize : section.virtualSize;
		fileBackedVirtualExtent = (section) => Math.min(virtualExtent(section), section.rawSize);
		METHOD_TABLE_RECORD_BYTES = 32;
		MethodTableIndex = class {
			budget;
			#records = Buffer.alloc(0);
			#count = 0;
			#includedCount = 0;
			constructor(budget) {
				this.budget = budget;
			}
			get count() {
				return this.#count;
			}
			get includedCount() {
				return this.#includedCount;
			}
			append(table) {
				if (!this.#ensureCapacity(this.#count + 1)) return false;
				const offset = this.#count * METHOD_TABLE_RECORD_BYTES;
				this.#records.writeBigUInt64LE(table.address, offset);
				this.#records.writeUInt32LE(table.flags, offset + 8);
				this.#records.writeUInt32LE(table.baseSize, offset + 12);
				this.#records.writeBigUInt64LE(table.related, offset + 16);
				this.#records.writeUInt16LE(table.slotsCount, offset + 24);
				this.#records.writeUInt16LE(table.interfacesCount, offset + 26);
				this.#records.writeUInt8(0, offset + 28);
				this.#records.writeUInt8(0, offset + 29);
				this.#records.writeUInt16LE(0, offset + 30);
				this.#count++;
				return true;
			}
			at(index) {
				if (!Number.isSafeInteger(index) || index < 0 || index >= this.#count) return undefined;
				const offset = index * METHOD_TABLE_RECORD_BYTES;
				return {
					address: this.#records.readBigUInt64LE(offset),
					flags: this.#records.readUInt32LE(offset + 8),
					baseSize: this.#records.readUInt32LE(offset + 12),
					related: this.#records.readBigUInt64LE(offset + 16),
					slotsCount: this.#records.readUInt16LE(offset + 24),
					interfacesCount: this.#records.readUInt16LE(offset + 26)
				};
			}
			isIncluded(index) {
				return index >= 0 && index < this.#count && this.#records.readUInt8(index * METHOD_TABLE_RECORD_BYTES + 28) !== 0;
			}
			include(index) {
				if (!this.isIncluded(index)) {
					this.#records.writeUInt8(1, index * METHOD_TABLE_RECORD_BYTES + 28);
					this.#includedCount++;
				}
			}
			find(address, budget) {
				let low = 0;
				let high = this.#count;
				while (low < high) {
					if (!budget.consumeWork(8)) return -1;
					const middle = low + (high - low >>> 1);
					const record = middle * METHOD_TABLE_RECORD_BYTES;
					const candidate = this.#records.readBigUInt64LE(record);
					if (candidate < address) low = middle + 1;
					else high = middle;
				}
				return low < this.#count && this.#records.readBigUInt64LE(low * METHOD_TABLE_RECORD_BYTES) === address ? low : -1;
			}
			forEach(callback) {
				for (let index = 0; index < this.#count; index++) {
					const table = this.at(index);
					if (table !== undefined) callback(table, index);
				}
			}
			forEachIncluded(callback) {
				for (let index = 0; index < this.#count; index++) {
					if (!this.isIncluded(index)) continue;
					const table = this.at(index);
					if (table !== undefined) callback(table, index);
				}
			}
			#ensureCapacity(requiredRecords) {
				const requiredBytes = requiredRecords * METHOD_TABLE_RECORD_BYTES;
				if (requiredBytes <= this.#records.byteLength) return true;
				const capacityBytes = Math.min(this.budget.limits.workingMemoryBytes, Math.max(requiredBytes, this.#records.byteLength * 2 || 4096));
				if (capacityBytes < requiredBytes || !this.budget.reserveWorkingMemory(capacityBytes)) return false;
				const expanded = Buffer.allocUnsafe(capacityBytes);
				this.#records.copy(expanded, 0, 0, this.#count * METHOD_TABLE_RECORD_BYTES);
				this.budget.releaseWorkingMemory(this.#records.byteLength);
				this.#records = expanded;
				return true;
			}
		};
		nativeAotSnapshotOverCapacity = (sha256, sourceBytesAtLeast, maximumSummaryBytes, limits = DEFAULT_NATIVE_AOT_PARSER_LIMITS) => assertNativeAotReportFits({
			format: "dotnet-nativeaot",
			status: "partial",
			reason: "The captured PE exceeds the read-only NativeAOT snapshot byte budget.",
			analysis_artifact_sha256: sha256,
			analysis_mode: "read-only-derived-overlay",
			header_address: null,
			discovery: null,
			format_major: null,
			format_minor: null,
			method_tables: 0,
			types: [],
			frozen_strings: [],
			truncated: true,
			types_omitted: 0,
			frozen_strings_omitted: 0,
			output_budget_bytes: maximumSummaryBytes,
			derived_overlay: null,
			derived_memory: null,
			coverage: {
				pointer_candidates_examined: 0,
				scan_bytes_examined: 0,
				scan_bytes_omitted: 0,
				method_table_validation_items_examined: 0,
				work_units_examined: 0,
				method_tables_recovered: 0,
				frozen_string_candidates: 0,
				frozen_scan_bytes_examined: 0,
				frozen_scan_bytes_omitted: 0,
				frozen_string_data_bytes_examined: 0,
				source_bytes_examined: 0,
				work_budget_units: limits.workUnits,
				source_byte_budget_bytes: limits.sourceBytes,
				working_memory_budget_bytes: limits.workingMemoryBytes,
				working_memory_bytes_peak: 0,
				truncation_reason: "source-byte-budget",
				basis: "unsupported-layout"
			},
			diagnostics: [`The private snapshot was observed to contain at least ${sourceBytesAtLeast} bytes, above the ${limits.sourceBytes} byte NativeAOT source limit; no parser snapshot was admitted.`],
			limitations: [
				"NativeAOT metadata was not inspected because the captured snapshot exceeded the local source-byte budget.",
				"The artifact digest identifies the selected target; no metadata facts are inferred from the omitted snapshot.",
				"No Ghidra database types, labels, functions, or bytes are created or changed."
			]
		}, maximumSummaryBytes);
		assertNativeAotReportFits = (report, maximumBytes) => {
			if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0 || Buffer.byteLength(JSON.stringify(report)) > maximumBytes) throw new Error("NativeAOT report-byte budget is too small for the minimum truthful report");
			return report;
		};
		parsedSummary = (summary, maximumBytes) => ({
			summary: assertNativeAotReportFits(summary, maximumBytes),
			readTypeDetail: () => undefined
		});
		PeImage = class {
			imageBase;
			sizeOfImage;
			sections;
			#bytes;
			#sizeOfHeaders;
			#machine;
			#overlays = [];
			#budget;
			constructor(bytes) {
				this.#bytes = bytes;
				if (bytes.length < 64 || bytes.toString("latin1", 0, 2) !== "MZ") throw new Error("Not a PE image");
				const peOffset = this.#u32(60);
				this.#range(peOffset, 24);
				if (bytes.toString("latin1", peOffset, peOffset + 4) !== "PE\0\0") throw new Error("Invalid PE signature");
				this.#machine = this.#u16(peOffset + 4);
				const count = this.#u16(peOffset + 6);
				if (count > 96) throw new Error("PE image exceeds the Windows 96-section limit");
				const optionalSize = this.#u16(peOffset + 20);
				const optional = peOffset + 24;
				this.#range(optional, optionalSize);
				const magic = this.#u16(optional);
				if (magic !== 523 || this.#machine !== 34404) throw new Error("Only x64 PE32+ is supported");
				this.imageBase = this.#u64(optional + 24);
				this.sizeOfImage = this.#u32(optional + 56);
				this.#sizeOfHeaders = this.#u32(optional + 60);
				if (count < 1 || this.sizeOfImage === 0) throw new Error("Unsupported PE image extent");
				const sectionOffset = optional + optionalSize;
				this.#range(sectionOffset, count * 40);
				this.sections = Array.from({ length: count }, (_, index) => {
					const p = sectionOffset + index * 40;
					const name = bytes.toString("ascii", p, p + 8).replace(/\0.*$/u, "");
					return {
						name,
						virtualSize: this.#u32(p + 8),
						rva: this.#u32(p + 12),
						rawSize: this.#u32(p + 16),
						rawOffset: this.#u32(p + 20),
						characteristics: this.#u32(p + 36)
					};
				});
				for (const section of this.sections) {
					this.#range(section.rawOffset, section.rawSize);
					if (section.rva + virtualExtent(section) > this.sizeOfImage) throw new Error("PE section exceeds the declared image extent");
				}
			}
			addressForRva(rva) {
				return this.imageBase + BigInt(rva);
			}
			setBudget(budget) {
				this.#budget = budget;
			}
			hasImageRange(start, end) {
				return end >= start && start >= this.imageBase && end - this.imageBase <= BigInt(this.sizeOfImage);
			}
			read(address, size) {
				if (address < this.imageBase || !Number.isSafeInteger(size) || size < 0) return null;
				for (const overlay of this.#overlays) {
					const offset = address - overlay.base;
					if (offset >= 0n && offset <= BigInt(overlay.sizeBytes - size)) {
						const start = Number(offset);
						return overlay.bytes.subarray(start, start + size);
					}
				}
				const rva = address - this.imageBase;
				if (rva > BigInt(Number.MAX_SAFE_INTEGER)) return null;
				const relative = Number(rva);
				if (relative < this.#sizeOfHeaders && relative <= this.#bytes.length - size) return this.#bytes.subarray(relative, relative + size);
				for (const section of this.sections) {
					if (this.#budget !== undefined && !this.#budget.consumeWork(1)) return null;
					const extent = virtualExtent(section);
					if (relative < section.rva || relative - section.rva > extent - size) continue;
					const delta = relative - section.rva;
					if (delta > section.rawSize - size) return null;
					const offset = section.rawOffset + delta;
					return this.#bytes.subarray(offset, offset + size);
				}
				return null;
			}
			isExecutable(address) {
				if (address < this.imageBase) return false;
				const rva = address - this.imageBase;
				for (const section of this.sections) {
					if (this.#budget !== undefined && !this.#budget.consumeWork(1)) return false;
					if ((section.characteristics & 536870912) !== 0 && rva >= BigInt(section.rva) && rva < BigInt(section.rva + virtualExtent(section))) return true;
				}
				return false;
			}
			addOverlay(overlay) {
				this.#overlays.push(overlay);
			}
			virtualBytesRemaining(address) {
				if (address < this.imageBase) return 0;
				const rva = address - this.imageBase;
				let section;
				for (const candidate of this.sections) {
					if (this.#budget !== undefined && !this.#budget.consumeWork(1)) return 0;
					if (rva >= BigInt(candidate.rva) && rva < BigInt(candidate.rva + virtualExtent(candidate))) {
						section = candidate;
						break;
					}
				}
				return section === undefined ? 0 : section.rva + virtualExtent(section) - Number(rva);
			}
			#range(offset, size) {
				if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || offset < 0 || size < 0 || offset > this.#bytes.length - size) throw new Error("PE field leaves the captured file");
			}
			#u16(offset) {
				this.#range(offset, 2);
				return this.#bytes.readUInt16LE(offset);
			}
			#u32(offset) {
				this.#range(offset, 4);
				return this.#bytes.readUInt32LE(offset);
			}
			#u64(offset) {
				this.#range(offset, 8);
				return this.#bytes.readBigUInt64LE(offset);
			}
		};
		hex = (value) => `0x${value.toString(16)}`;
		readU64 = (bytes, offset = 0) => bytes === null || offset > bytes.length - 8 ? null : bytes.readBigUInt64LE(offset);
		readU32 = (bytes, offset = 0) => bytes === null || offset > bytes.length - 4 ? null : bytes.readUInt32LE(offset);
		notApplicable = (sha, reason, basis) => ({
			format: "dotnet-nativeaot",
			status: "not_applicable",
			reason,
			analysis_artifact_sha256: sha,
			analysis_mode: "read-only-derived-overlay",
			header_address: null,
			discovery: null,
			format_major: null,
			format_minor: null,
			method_tables: 0,
			types: [],
			frozen_strings: [],
			derived_overlay: null,
			derived_memory: null,
			coverage: {
				pointer_candidates_examined: 0,
				method_tables_recovered: 0,
				frozen_string_candidates: 0,
				basis
			},
			diagnostics: [],
			limitations: ["This report is derived from the admitted file snapshot; it does not define or annotate Ghidra database types."]
		});
		findDirectory = (image, bytes, budget) => {
			let found = null;
			let matches = 0;
			let scanBytesExamined = 0;
			let totalScanBytes = 0;
			let truncated = false;
			scan: for (const section of image.sections) {
				if ((section.characteristics & 1073741824) === 0 || (section.characteristics & 536870912) !== 0) continue;
				const begin = section.rawOffset;
				const end = begin + fileBackedVirtualExtent(section);
				const first = begin + 7 & ~7;
				const candidateBytes = first <= end - 16 ? (Math.floor((end - 16 - first) / 8) + 1) * 8 : 0;
				totalScanBytes += candidateBytes;
				for (let offset = first; offset <= end - 16; offset += 8) {
					if (!budget.consumeWork(8)) {
						truncated = true;
						break scan;
					}
					scanBytesExamined += 8;
					if (bytes.readUInt32LE(offset) !== RTR_SIGNATURE) continue;
					if (!budget.consumeWork(16)) {
						truncated = true;
						break scan;
					}
					const count = bytes.readUInt16LE(offset + 12);
					if (bytes.readUInt8(offset + 14) !== RTR_ROW_SIZE || bytes.readUInt8(offset + 15) !== RTR_ROW_TYPE || count < 1 || offset > end - (16 + count * RTR_ROW_SIZE)) continue;
					const rows = [];
					let valid = true;
					for (let row = 0; row < count; row++) {
						if (!budget.consumeWork(RTR_ROW_SIZE)) {
							truncated = true;
							break scan;
						}
						const p = offset + 16 + row * RTR_ROW_SIZE;
						const type = bytes.readUInt32LE(p);
						const start = bytes.readBigUInt64LE(p + 8);
						const finish = bytes.readBigUInt64LE(p + 16);
						const isConsumedRange = type === FROZEN_OBJECT_REGION || type === DEHYDRATED_DATA;
						const isTypeManagerIndirection = type === 204;
						if (isConsumedRange && finish !== start && !image.hasImageRange(start, finish)) {
							valid = false;
							break;
						}
						if (isTypeManagerIndirection && start !== 0n && image.read(start, 8) === null) {
							valid = false;
							break;
						}
						if (isConsumedRange || isTypeManagerIndirection) {
							if (rows.some((existing) => existing.type === type)) {
								valid = false;
								break;
							}
							rows.push({
								type,
								flags: bytes.readUInt32LE(p + 4),
								start,
								end: finish
							});
						}
					}
					if (valid) {
						matches++;
						if (found === null) found = {
							address: image.addressForRva(section.rva + offset - begin),
							major: bytes.readUInt16LE(offset + 4),
							minor: bytes.readUInt16LE(offset + 6),
							sections: rows
						};
					}
				}
			}
			return {
				directory: found,
				matches,
				scanBytesExamined,
				scanBytesOmitted: Math.max(0, totalScanBytes - scanBytesExamined),
				truncated
			};
		};
		parseMethodTable = (image, address, remainingValidationItems) => {
			const header = image.read(address, 16);
			if (header === null) return null;
			const flags = header.readUInt32LE(0), baseSize = header.readUInt32LE(4), related = header.readBigUInt64LE(8);
			const counts = image.read(address + 16n, 4);
			if (counts === null) return null;
			const slotsCount = counts.readUInt16LE(0), interfacesCount = counts.readUInt16LE(2);
			if (baseSize > 268435456 || baseSize !== 0 && baseSize < 16) return null;
			const itemCount = slotsCount + interfacesCount;
			if (itemCount > remainingValidationItems) return null;
			const tableBytes = 24 + itemCount * 8;
			const table = image.read(address, tableBytes);
			if (table === null) return null;
			for (let slot = 0; slot < slotsCount; slot++) {
				const target = table.readBigUInt64LE(24 + slot * 8);
				if (target !== 0n && !image.isExecutable(target)) return null;
			}
			for (let index = 0; index < interfacesCount; index++) {
				const iface = table.readBigUInt64LE(24 + (slotsCount + index) * 8);
				if (iface !== 0n && image.read(iface, 20) === null) return null;
			}
			return {
				address,
				flags,
				baseSize,
				related,
				slotsCount,
				interfacesCount
			};
		};
		readRelativePointer = (image, address) => {
			const raw = image.read(address, 4);
			return raw === null ? null : address + BigInt(raw.readInt32LE(0));
		};
		jsonUtf16StringBytes = (bytes, codeUnits) => {
			let total = 2;
			for (let index = 0; index < codeUnits; index++) {
				const value = bytes.readUInt16LE(index * 2);
				if (value === 34 || value === 92) total += 2;
				else if (value < 32) total += value === 8 || value === 9 || value === 10 || value === 12 || value === 13 ? 2 : 6;
				else if (value >= 55296 && value <= 56319) {
					const next = index + 1 < codeUnits ? bytes.readUInt16LE((index + 1) * 2) : 0;
					if (next >= 56320 && next <= 57343) {
						total += 4;
						index++;
					} else total += 6;
				} else if (value >= 56320 && value <= 57343) total += 6;
				else if (value <= 127) total++;
				else if (value <= 2047) total += 2;
				else total += 3;
			}
			return total;
		};
		hydrate = (image, dehydrated, budget) => {
			const length = dehydrated.end - dehydrated.start;
			if (length < 5n || length > BigInt(image.virtualBytesRemaining(dehydrated.start))) throw new Error("DEHYDRATED_DATA length is outside its mapped section");
			const first = image.read(dehydrated.start, Number(length));
			if (first === null) throw new Error("DEHYDRATED_DATA leaves captured PE sections");
			const base = readRelativePointer(image, dehydrated.start);
			if (base === null) throw new Error("DEHYDRATED_DATA has no hydration base pointer");
			const outputLimit = Math.min(image.virtualBytesRemaining(base), budget.limits.workUnits - budget.workUnits, budget.limits.workingMemoryBytes - budget.workingMemoryBytes);
			if (outputLimit === 0) throw new Error("DEHYDRATED_DATA hydration base is outside mapped PE sections");
			let output = Buffer.alloc(Math.min(outputLimit, 64 * 1024));
			if (!budget.reserveWorkingMemory(output.byteLength)) throw new Error("NativeAOT working-memory budget is exhausted");
			let outputLength = 0;
			let cursor = 4;
			const ensureOutput = (length) => {
				if (!Number.isSafeInteger(length) || length < 0 || length > outputLimit - outputLength) {
					if (length > budget.limits.workUnits - budget.workUnits) throw new Error("NativeAOT parser work budget is exhausted");
					throw new Error("Hydrated metadata exceeds its mapped PE section");
				}
				const start = outputLength;
				const required = start + length;
				if (required > output.length) {
					const capacity = Math.min(outputLimit, Math.max(required, Math.min(outputLimit, output.length * 2 || 64 * 1024)));
					if (!budget.reserveWorkingMemory(capacity)) throw new Error("NativeAOT working-memory budget is exhausted");
					const expanded = Buffer.allocUnsafe(capacity);
					output.copy(expanded, 0, 0, outputLength);
					budget.releaseWorkingMemory(output.byteLength);
					output = expanded;
				}
				outputLength = required;
				return start;
			};
			const append = (chunk) => {
				if (!budget.consumeWork(chunk.length)) throw new Error("NativeAOT parser work budget is exhausted");
				chunk.copy(output, ensureOutput(chunk.length));
			};
			const appendZero = (length) => {
				if (!budget.consumeWork(length)) throw new Error("NativeAOT parser work budget is exhausted");
				const start = ensureOutput(length);
				output.fill(0, start, outputLength);
			};
			const appendRel = (target) => {
				if (!budget.consumeWork(4)) throw new Error("NativeAOT parser work budget is exhausted");
				const delta = target - (base + BigInt(outputLength));
				if (delta < -2147483648n || delta > 2147483647n) throw new Error("Hydrated relative pointer does not fit int32");
				const offset = ensureOutput(4);
				output.writeInt32LE(Number(delta), offset);
			};
			const appendPtr = (target) => {
				if (!budget.consumeWork(8)) throw new Error("NativeAOT parser work budget is exhausted");
				const offset = ensureOutput(8);
				output.writeBigUInt64LE(target, offset);
			};
			const readFixup = (index) => {
				const fixupLocation = dehydrated.end + BigInt(index * 4);
				const target = readRelativePointer(image, fixupLocation);
				if (target === null) throw new Error("DEHYDRATED_DATA fixup leaves captured PE sections");
				return target;
			};
			try {
				while (cursor < first.length) {
					if (!budget.consumeWork(1)) throw new Error("NativeAOT parser work budget is exhausted");
					const encoded = first[cursor];
					if (encoded === undefined) break;
					cursor++;
					const command = encoded & 7;
					let payload = encoded >>> 3;
					const extraBytes = payload - 28;
					if (extraBytes > 0) {
						if (extraBytes > 3 || cursor > first.length - extraBytes) throw new Error("Invalid DEHYDRATED_DATA payload encoding");
						payload = 0;
						for (let i = 0; i < extraBytes; i++) payload += (first[cursor++] ?? 0) * 2 ** (8 * i);
						payload += 28;
					}
					switch (command) {
						case 0: {
							if (cursor > first.length - payload) throw new Error("DEHYDRATED_DATA COPY leaves its section");
							append(first.subarray(cursor, cursor + payload));
							cursor += payload;
							break;
						}
						case 1:
							appendZero(payload);
							break;
						case 2:
							appendRel(readFixup(payload));
							break;
						case 3:
							appendPtr(readFixup(payload));
							break;
						case 4:
							if (!budget.consumeWork(payload * 4)) throw new Error("NativeAOT parser work budget is exhausted");
							if (payload > Math.floor((first.length - cursor) / 4) || payload > Math.floor((outputLimit - outputLength) / 4)) throw new Error("Inline relative fixups leave DEHYDRATED_DATA");
							for (let i = 0; i < payload; i++) {
								const target = readRelativePointer(image, dehydrated.start + BigInt(cursor));
								if (target === null) throw new Error("Invalid inline relative pointer");
								cursor += 4;
								appendRel(target);
							}
							break;
						case 5:
							if (!budget.consumeWork(payload * 4)) throw new Error("NativeAOT parser work budget is exhausted");
							if (payload > Math.floor((first.length - cursor) / 4) || payload > Math.floor((outputLimit - outputLength) / 8)) throw new Error("Inline pointer fixups leave DEHYDRATED_DATA");
							for (let i = 0; i < payload; i++) {
								const target = readRelativePointer(image, dehydrated.start + BigInt(cursor));
								if (target === null) throw new Error("Invalid inline pointer");
								cursor += 4;
								appendPtr(target);
							}
							break;
						default: throw new Error(`Unsupported DEHYDRATED_DATA command ${command}`);
					}
				}
			} catch (cause) {
				budget.releaseWorkingMemory(output.byteLength);
				throw cause;
			}
			const hydrated = output.subarray(0, outputLength);
			const sha256 = createHash("sha256").update(hydrated).digest("hex");
			image.addOverlay({
				base,
				sizeBytes: outputLength,
				sha256,
				bytes: hydrated
			});
			return {
				base,
				sizeBytes: outputLength,
				sha256
			};
		};
		discoverTables = (image, hydrated, budget) => {
			const ranges = [];
			for (const section of image.sections) {
				if ((section.characteristics & 1073741824) === 0 || (section.characteristics & 536870912) !== 0) continue;
				const extent = fileBackedVirtualExtent(section);
				if (extent > 0) {
					ranges.push({
						start: image.addressForRva(section.rva),
						end: image.addressForRva(section.rva + extent)
					});
				}
			}
			if (hydrated !== null) {
				const section = image.sections.find((candidate) => (candidate.characteristics & 1073741824) !== 0 && (candidate.characteristics & 536870912) === 0 && hydrated.base >= image.addressForRva(candidate.rva) && hydrated.base + BigInt(hydrated.sizeBytes) <= image.addressForRva(candidate.rva + virtualExtent(candidate)));
				if (section !== undefined) ranges.push({
					start: hydrated.base,
					end: hydrated.base + BigInt(hydrated.sizeBytes)
				});
			}
			ranges.sort((left, right) => left.start < right.start ? -1 : 1);
			const merged = [];
			for (const range of ranges) {
				const previous = merged.at(-1);
				if (previous !== undefined && range.start <= previous.end) {
					if (range.end > previous.end) previous.end = range.end;
				} else {
					merged.push({ ...range });
				}
			}
			const totalScanBytes = merged.reduce((total, range) => total + Number(range.end - range.start), 0);
			let pointerCount = 0, pointerSlotsExamined = 0, scanBytesExamined = 0, validationItems = 0, workBytesExamined = 0, truncated = false;
			const candidates = new MethodTableIndex(budget);
			scan: for (const range of merged) {
				let address = range.start + 7n & ~7n;
				while (address + 8n <= range.end) {
					if (!budget.consumeWork(8)) {
						truncated = true;
						break scan;
					}
					const value = readU64(image.read(address, 8));
					pointerSlotsExamined++;
					scanBytesExamined += 8;
					workBytesExamined += 8;
					if (value !== null && value !== 0n) pointerCount++;
					const candidateAddress = address - 8n;
					const header = candidateAddress >= image.imageBase ? image.read(candidateAddress, 24) : null;
					if (header !== null) {
						const flags = header.readUInt32LE(0);
						const elementType = (flags & 2080374784) >>> 26;
						const baseSize = header.readUInt32LE(4);
						const related = header.readBigUInt64LE(8);
						const plausibleHeader = (elementType === 20 || elementType === 21) && baseSize >= 16 && baseSize <= 268435456 && (related === 0n || image.read(related, 24) !== null);
						if (!plausibleHeader) {
							address += 8n;
							continue;
						}
						const counts = image.read(candidateAddress + 16n, 4);
						if (counts === null) {
							address += 8n;
							continue;
						}
						const itemCount = counts.readUInt16LE(0) + counts.readUInt16LE(2);
						if (!budget.consumeWork(itemCount * 8)) {
							truncated = true;
							break scan;
						}
						validationItems += itemCount;
						workBytesExamined += itemCount * 8;
						const candidate = parseMethodTable(image, candidateAddress, itemCount);
						if (candidate !== null) {
							if (!candidates.append(candidate)) {
								truncated = true;
								break scan;
							}
						}
					}
					address += 8n;
				}
			}
			let objectRoot = -1;
			let objectCount = 0;
			candidates.forEach((candidate, index) => {
				if (candidate.flags !== 1342177280 || candidate.baseSize !== 24 || candidate.related !== 0n || candidate.slotsCount !== 3 || candidate.interfacesCount !== 0) return;
				if (!budget.consumeWork(32)) {
					truncated = true;
					return;
				}
				const vtable = image.read(candidate.address + 24n, 32);
				if (vtable !== null && image.isExecutable(vtable.readBigUInt64LE(0)) && image.isExecutable(vtable.readBigUInt64LE(8)) && image.isExecutable(vtable.readBigUInt64LE(16)) && !image.isExecutable(vtable.readBigUInt64LE(24))) {
					objectRoot = index;
					objectCount++;
				}
			});
			if (objectCount !== 1 || objectRoot < 0 || truncated) return {
				tables: candidates,
				pointerCount,
				pointerSlotsExamined,
				scanBytesExamined,
				scanBytesOmitted: Math.max(0, totalScanBytes - scanBytesExamined),
				methodTableValidationItemsExamined: validationItems,
				workBytesExamined,
				truncated
			};
			candidates.include(objectRoot);
			let changed = true;
			while (changed && !truncated) {
				changed = false;
				candidates.forEach((base, baseIndex) => {
					if (truncated || !candidates.isIncluded(baseIndex)) return;
					for (let candidateIndex = 0; candidateIndex < candidates.count; candidateIndex++) {
						if (!budget.consumeWork(8)) {
							truncated = true;
							return;
						}
						const candidate = candidates.at(candidateIndex);
						if (candidate !== undefined && candidate.related === base.address && !candidates.isIncluded(candidateIndex)) {
							candidates.include(candidateIndex);
							changed = true;
						}
					}
					for (let index = 0; index < base.interfacesCount; index++) {
						if (!budget.consumeWork(8)) {
							truncated = true;
							return;
						}
						const ifaceAddress = readU64(image.read(base.address + 24n + BigInt((base.slotsCount + index) * 8), 8));
						if (ifaceAddress === null) continue;
						const interfaceIndex = candidates.find(ifaceAddress, budget);
						if (budget.truncationReason !== undefined) {
							truncated = true;
							return;
						}
						if (interfaceIndex >= 0 && !candidates.isIncluded(interfaceIndex)) {
							candidates.include(interfaceIndex);
							changed = true;
						}
					}
				});
			}
			return {
				tables: candidates,
				pointerCount,
				pointerSlotsExamined,
				scanBytesExamined,
				scanBytesOmitted: Math.max(0, totalScanBytes - scanBytesExamined),
				methodTableValidationItemsExamined: validationItems,
				workBytesExamined,
				truncated
			};
		};
		parseNativeAotPe = (bytes, expectedSha256, maximumSummaryBytes, loadedImageBase, limits = DEFAULT_NATIVE_AOT_PARSER_LIMITS) => {
			if (!Number.isSafeInteger(maximumSummaryBytes) || maximumSummaryBytes < 0) throw new Error("NativeAOT summary budget must be a non-negative safe integer");
			for (const limit of Object.values(limits)) if (!Number.isSafeInteger(limit) || limit < 0) throw new Error("NativeAOT parser limits must be non-negative safe integers");
			if (bytes.byteLength > limits.sourceBytes) return parsedSummary(nativeAotSnapshotOverCapacity(expectedSha256, bytes.byteLength, maximumSummaryBytes, limits), maximumSummaryBytes);
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			if (sha256 !== expectedSha256) throw new Error("NativeAOT snapshot digest does not match the admitted artifact identity");
			let image;
			try {
				image = new PeImage(bytes);
			} catch (cause) {
				return parsedSummary(notApplicable(sha256, cause instanceof Error ? cause.message : "Unsupported PE image", "unsupported-layout"), maximumSummaryBytes);
			}
			if (loadedImageBase !== undefined && BigInt(loadedImageBase) !== image.imageBase) return parsedSummary(notApplicable(sha256, "Ghidra loaded the PE at a base different from its preferred image base; relocation-aware metadata mapping is not implemented.", "unsupported-layout"), maximumSummaryBytes);
			const budget = new NativeAotParserBudget(limits);
			image.setBudget(budget);
			const directorySearch = findDirectory(image, bytes, budget);
			if (directorySearch.truncated) return parsedSummary({
				...notApplicable(sha256, "RTR signature scanning reached the NativeAOT parser work budget; a unique ReadyToRun directory was not established.", "no-rtr-header"),
				status: "partial",
				truncated: true,
				output_budget_bytes: maximumSummaryBytes,
				coverage: {
					pointer_candidates_examined: 0,
					pointer_slots_examined: 0,
					scan_bytes_examined: directorySearch.scanBytesExamined,
					scan_bytes_omitted: directorySearch.scanBytesOmitted,
					rtr_signature_scan_bytes_examined: directorySearch.scanBytesExamined,
					rtr_signature_scan_bytes_omitted: directorySearch.scanBytesOmitted,
					method_tables_recovered: 0,
					frozen_string_candidates: 0,
					work_units_examined: budget.workUnits,
					work_budget_units: budget.limits.workUnits,
					source_byte_budget_bytes: budget.limits.sourceBytes,
					working_memory_budget_bytes: budget.limits.workingMemoryBytes,
					working_memory_bytes_peak: budget.workingMemoryBytesPeak,
					...budget.truncationReason === undefined ? {} : { truncation_reason: budget.truncationReason },
					basis: "no-rtr-header"
				},
				diagnostics: ["No metadata hydration was attempted because signature coverage was incomplete."]
			}, maximumSummaryBytes);
			if (directorySearch.directory === null && directorySearch.matches === 0) return parsedSummary(notApplicable(sha256, "No supported ReadyToRun directory signature was found in initialized non-executable PE sections.", "no-rtr-header"), maximumSummaryBytes);
			if (directorySearch.matches !== 1 || directorySearch.directory === null) return parsedSummary(notApplicable(sha256, "Multiple plausible ReadyToRun directories were found; metadata identity is ambiguous.", "unsupported-layout"), maximumSummaryBytes);
			const directory = directorySearch.directory;
			if (directory.major !== 9 || directory.minor !== 1) return parsedSummary({
				...notApplicable(sha256, `RTR ${directory.major}.${directory.minor} is detected but this parser supports only the .NET 8 RTR 9.1 method-table layout.`, "unsupported-layout"),
				status: "partial",
				header_address: hex(directory.address),
				discovery: "signature-heuristic",
				format_major: directory.major,
				format_minor: directory.minor
			}, maximumSummaryBytes);
			const dehydrated = directory.sections.filter((section) => section.type === DEHYDRATED_DATA);
			if (dehydrated.length !== 1) return parsedSummary({
				...notApplicable(sha256, "RTR 9.1 directory does not contain exactly one DEHYDRATED_DATA section; metadata recovery is incomplete.", "unsupported-layout"),
				status: "partial",
				header_address: hex(directory.address),
				discovery: "signature-heuristic",
				format_major: directory.major,
				format_minor: directory.minor
			}, maximumSummaryBytes);
			let overlay = null;
			let hydrationError = null;
			try {
				overlay = hydrate(image, dehydrated[0], budget);
			} catch (cause) {
				hydrationError = cause instanceof Error ? cause.message : "DEHYDRATED_DATA could not be hydrated";
			}
			const discovered = discoverTables(image, overlay, budget);
			const frozen = directory.sections.find((section) => section.type === FROZEN_OBJECT_REGION);
			const isRecoveredStringTable = (address) => {
				const index = discovered.tables.find(address, budget);
				if (budget.truncationReason !== undefined || index < 0 || !discovered.tables.isIncluded(index)) return false;
				const table = discovered.tables.at(index);
				if (table === undefined || (table.flags & 2080374784) >>> 26 !== 20 || table.baseSize !== 22 || table.related === 0n) return false;
				const related = discovered.tables.find(table.related, budget);
				if (budget.truncationReason !== undefined) return false;
				return related >= 0 && discovered.tables.isIncluded(related);
			};
			const types = [];
			const frozenStrings = [];
			let frozenCandidates = 0;
			let frozenStringsOmitted = 0;
			let frozenScanBytesExamined = 0;
			let frozenStringDataBytesExamined = 0;
			let frozenScanTruncated = false;
			const frozenFirstCandidate = frozen === undefined ? 0n : frozen.start + 7n & ~7n;
			const frozenCandidateBound = frozen === undefined || frozen.end < frozenFirstCandidate + 14n ? 0 : Number((frozen.end - 14n - frozenFirstCandidate) / 8n + 1n);
			const recoveryReason = discovered.truncated && discovered.tables.includedCount === 0 ? "RTR 9.1 was found, but method-table discovery reached its resource budget before determining whether a unique System.Object root exists." : discovered.tables.includedCount === 0 ? "RTR 9.1 was found, but no unique System.Object method-table root could be recovered from the fully examined image pointers." : hydrationError;
			const reportLimitations = [
				"Only x64 PE32+ with RTR 9.1 is supported.",
				"No Ghidra database types, labels, functions, or bytes are created or changed.",
				"Names are address identities; original managed type names are unavailable.",
				"Metadata rows omitted to fit the NativeAOT report-byte budget are counted explicitly.",
				"Parser work, parser-owned typed buffers, NativeAOT report JSON, and MCP delivery have separate byte budgets; incomplete scans report examined and unexamined coverage.",
				...frozen === undefined ? ["The RTR directory has no FROZEN_OBJECT_REGION section."] : []
			];
			const budgetSkeleton = {
				format: "dotnet-nativeaot",
				status: "complete",
				reason: recoveryReason,
				analysis_artifact_sha256: sha256,
				analysis_mode: "read-only-derived-overlay",
				header_address: hex(directory.address),
				discovery: "signature-heuristic",
				format_major: directory.major,
				format_minor: directory.minor,
				method_tables: discovered.tables.includedCount,
				types: [],
				frozen_strings: [],
				truncated: true,
				types_omitted: discovered.tables.includedCount,
				frozen_strings_omitted: frozenCandidateBound,
				output_budget_bytes: maximumSummaryBytes,
				derived_overlay: overlay === null ? null : {
					address: hex(overlay.base),
					size_bytes: overlay.sizeBytes,
					sha256: overlay.sha256
				},
				derived_memory: null,
				coverage: {
					pointer_candidates_examined: discovered.pointerCount,
					pointer_slots_examined: discovered.pointerSlotsExamined,
					scan_bytes_examined: discovered.scanBytesExamined,
					scan_bytes_omitted: discovered.scanBytesOmitted,
					rtr_signature_scan_bytes_examined: directorySearch.scanBytesExamined,
					rtr_signature_scan_bytes_omitted: directorySearch.scanBytesOmitted,
					method_table_validation_items_examined: discovered.methodTableValidationItemsExamined,
					work_units_examined: budget.limits.workUnits,
					work_budget_units: budget.limits.workUnits,
					source_byte_budget_bytes: budget.limits.sourceBytes,
					working_memory_budget_bytes: budget.limits.workingMemoryBytes,
					working_memory_bytes_peak: budget.limits.workingMemoryBytes,
					truncation_reason: "response-budget",
					method_tables_recovered: discovered.tables.includedCount,
					frozen_string_candidates: 0,
					frozen_scan_bytes_examined: frozenCandidateBound * 8,
					frozen_string_data_bytes_examined: frozen === undefined ? 0 : Number(frozen.end - frozen.start),
					frozen_scan_bytes_omitted: frozenCandidateBound * 8,
					basis: overlay === null ? "raw-image-pointer-scan" : "raw-image-and-rehydrated-pointer-scan"
				},
				diagnostics: hydrationError === null ? [] : [`Read-only hydration stopped: ${hydrationError}`],
				limitations: reportLimitations
			};
			let remainingSummaryBytes = maximumSummaryBytes - Buffer.byteLength(JSON.stringify(budgetSkeleton));
			if (remainingSummaryBytes < 0) throw new Error("NativeAOT metadata summary exceeds its report-byte budget");
			let typesOmitted = 0;
			discovered.tables.forEachIncluded((table) => {
				const row = {
					address: hex(table.address),
					type: null
				};
				const rowBytes = Buffer.byteLength(JSON.stringify(row)) + (types.length > 0 ? 1 : 0);
				if (rowBytes > remainingSummaryBytes) {
					typesOmitted++;
					return;
				}
				types.push(row);
				remainingSummaryBytes -= rowBytes;
			});
			if (frozen !== undefined) {
				let address = frozenFirstCandidate;
				while (address + 14n <= frozen.end) {
					if (!budget.consumeWork(8)) {
						frozenScanTruncated = true;
						break;
					}
					frozenScanBytesExamined += 8;
					const table = readU64(image.read(address, 8));
					if (table === null || !isRecoveredStringTable(table)) {
						address += 8n;
						continue;
					}
					frozenCandidates++;
					const length = readU32(image.read(address + 8n, 4));
					if (length === null || address + 14n + BigInt(length) * 2n > frozen.end) {
						address += 8n;
						continue;
					}
					const stringBytes = length * 2 + 2;
					if (!budget.consumeWork(stringBytes)) {
						frozenScanTruncated = true;
						break;
					}
					frozenStringDataBytesExamined += stringBytes;
					const raw = image.read(address + 12n, stringBytes);
					if (raw === null || raw.readUInt16LE(length * 2) !== 0) {
						address += 8n;
						continue;
					}
					if (!budget.consumeWork(stringBytes)) {
						frozenScanTruncated = true;
						break;
					}
					const rowPrefixBytes = Buffer.byteLength(JSON.stringify({
						address: hex(address),
						value: ""
					}));
					const rowBytes = rowPrefixBytes - 2 + jsonUtf16StringBytes(raw, length) + (frozenStrings.length > 0 ? 1 : 0);
					if (rowBytes > remainingSummaryBytes) {
						frozenStringsOmitted++;
						address += 8n;
						continue;
					}
					const row = {
						address: hex(address),
						value: raw.toString("utf16le", 0, length * 2)
					};
					frozenStrings.push(row);
					remainingSummaryBytes -= rowBytes;
					address += 8n;
				}
			}
			const truncated = discovered.truncated || frozenScanTruncated || typesOmitted > 0 || frozenStringsOmitted > 0;
			const truncationReason = budget.truncationReason ?? (typesOmitted > 0 || frozenStringsOmitted > 0 ? "response-budget" : undefined);
			const summary = {
				format: "dotnet-nativeaot",
				status: truncated || hydrationError !== null || discovered.tables.includedCount === 0 ? "partial" : "complete",
				reason: recoveryReason,
				analysis_artifact_sha256: sha256,
				analysis_mode: "read-only-derived-overlay",
				header_address: hex(directory.address),
				discovery: "signature-heuristic",
				format_major: directory.major,
				format_minor: directory.minor,
				method_tables: discovered.tables.includedCount,
				types,
				frozen_strings: frozenStrings,
				truncated,
				types_omitted: typesOmitted,
				frozen_strings_omitted: frozenStringsOmitted,
				output_budget_bytes: maximumSummaryBytes,
				derived_overlay: overlay === null ? null : {
					address: hex(overlay.base),
					size_bytes: overlay.sizeBytes,
					sha256: overlay.sha256
				},
				derived_memory: null,
				coverage: {
					pointer_candidates_examined: discovered.pointerCount,
					pointer_slots_examined: discovered.pointerSlotsExamined,
					scan_bytes_examined: discovered.scanBytesExamined,
					scan_bytes_omitted: discovered.scanBytesOmitted,
					rtr_signature_scan_bytes_examined: directorySearch.scanBytesExamined,
					rtr_signature_scan_bytes_omitted: directorySearch.scanBytesOmitted,
					method_table_validation_items_examined: discovered.methodTableValidationItemsExamined,
					work_units_examined: budget.workUnits,
					work_budget_units: budget.limits.workUnits,
					source_byte_budget_bytes: budget.limits.sourceBytes,
					working_memory_budget_bytes: budget.limits.workingMemoryBytes,
					working_memory_bytes_peak: budget.workingMemoryBytesPeak,
					...budget.truncationReason === undefined ? truncationReason === undefined ? {} : { truncation_reason: truncationReason } : { truncation_reason: budget.truncationReason },
					method_tables_recovered: discovered.tables.includedCount,
					frozen_string_candidates: frozenCandidates,
					frozen_scan_bytes_examined: frozenScanBytesExamined,
					frozen_string_data_bytes_examined: frozenStringDataBytesExamined,
					frozen_scan_bytes_omitted: Math.max(0, frozenCandidateBound * 8 - frozenScanBytesExamined),
					basis: overlay === null ? "raw-image-pointer-scan" : "raw-image-and-rehydrated-pointer-scan"
				},
				diagnostics: hydrationError === null ? [] : [`Read-only hydration stopped: ${hydrationError}`],
				limitations: reportLimitations
			};
			if (Buffer.byteLength(JSON.stringify(summary)) > maximumSummaryBytes) throw new Error("NativeAOT metadata summary exceeded its report-byte budget after serialization");
			const readTypeDetail = (address, maximumBytes) => {
				if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 0) return undefined;
				if (!/^0x[0-9a-f]+$/iu.test(address)) return undefined;
				let tableAddress;
				try {
					tableAddress = BigInt(address);
				} catch {
					return undefined;
				}
				const detailBudget = new NativeAotParserBudget(limits);
				const tableIndex = discovered.tables.find(tableAddress, detailBudget);
				if (tableIndex < 0 || !discovered.tables.isIncluded(tableIndex)) return undefined;
				const table = discovered.tables.at(tableIndex);
				if (table === undefined) return undefined;
				const metadata = {
					source: "read-only-derived-overlay",
					format: "dotnet-nativeaot",
					status: "complete",
					header_address: hex(directory.address),
					format_major: directory.major,
					format_minor: directory.minor,
					method_table_address: hex(table.address),
					name_origin: "generated",
					original_name: null,
					base_size_bytes: table.baseSize,
					related_type: table.related === 0n ? null : {
						address: hex(table.related),
						type: null
					},
					interfaces: [],
					virtual_slots: [],
					derived_memory: null,
					truncated: true,
					virtual_slots_omitted: table.slotsCount,
					interfaces_omitted: table.interfacesCount,
					output_budget_bytes: maximumBytes,
					diagnostics: [],
					limitations: [
						"Address-derived MethodTable identity; no original managed type name is available.",
						"This result is parser-derived and does not claim that Ghidra defined a database DataType.",
						"Slot and interface details are generated only for the requested address and bounded by the NativeAOT report-byte budget."
					]
				};
				let remaining = maximumBytes - Buffer.byteLength(JSON.stringify(metadata));
				if (remaining < 0) {
					metadata.diagnostics.push("The NativeAOT detail report budget is too small for the requested MethodTable summary.");
					metadata.truncated = true;
					metadata.status = "partial";
					return Buffer.byteLength(JSON.stringify(metadata)) <= maximumBytes ? metadata : undefined;
				}
				const maxInterfaceRowBytes = Buffer.byteLength(JSON.stringify({
					address: `0x${"f".repeat(16)}`,
					type: null
				}));
				let interfacesOmitted = 0;
				for (let index = 0; index < table.interfacesCount; index++) {
					if (remaining < maxInterfaceRowBytes) {
						interfacesOmitted += table.interfacesCount - index;
						break;
					}
					if (!detailBudget.consumeWork(8)) {
						interfacesOmitted += table.interfacesCount - index;
						break;
					}
					const row = {
						address: hex(table.address),
						type: null
					};
					const value = readU64(image.read(table.address + 24n + BigInt((table.slotsCount + index) * 8), 8));
					if (value === null) {
						interfacesOmitted += table.interfacesCount - index;
						break;
					}
					row.address = hex(value);
					const rowBytes = Buffer.byteLength(JSON.stringify(row)) + (metadata.interfaces.length > 0 ? 1 : 0);
					if (rowBytes > remaining) {
						interfacesOmitted++;
						continue;
					}
					metadata.interfaces.push(row);
					remaining -= rowBytes;
				}
				const maxVirtualSlotRowBytes = Buffer.byteLength(JSON.stringify({
					slot: 65535,
					slot_address: `0x${"f".repeat(16)}`,
					target_address: `0x${"f".repeat(16)}`,
					procedure_name: null,
					basis: "method-table-pointer"
				}));
				let slotsOmitted = 0;
				for (let slot = 0; slot < table.slotsCount; slot++) {
					if (remaining < maxVirtualSlotRowBytes) {
						slotsOmitted += table.slotsCount - slot;
						break;
					}
					if (!detailBudget.consumeWork(8)) {
						slotsOmitted += table.slotsCount - slot;
						break;
					}
					const value = readU64(image.read(table.address + 24n + BigInt(slot * 8), 8));
					if (value === null) {
						slotsOmitted += table.slotsCount - slot;
						break;
					}
					const row = {
						slot,
						slot_address: hex(table.address + 24n + BigInt(slot * 8)),
						target_address: value === 0n ? null : hex(value),
						procedure_name: null,
						basis: "method-table-pointer"
					};
					const rowBytes = Buffer.byteLength(JSON.stringify(row)) + (metadata.virtual_slots.length > 0 ? 1 : 0);
					if (rowBytes > remaining) {
						slotsOmitted++;
						continue;
					}
					metadata.virtual_slots.push(row);
					remaining -= rowBytes;
				}
				const tableBytes = 24 + (table.slotsCount + table.interfacesCount) * 8;
				const descriptor = {
					address: hex(table.address),
					size_bytes: tableBytes,
					sha256: "0".repeat(64),
					file_offset: null
				};
				const withDescriptor = {
					...metadata,
					derived_memory: descriptor
				};
				const descriptorBytes = Buffer.byteLength(JSON.stringify(withDescriptor)) - Buffer.byteLength(JSON.stringify(metadata));
				if (descriptorBytes <= remaining && detailBudget.consumeWork(tableBytes)) {
					const raw = image.read(table.address, tableBytes);
					if (raw !== null) {
						metadata.derived_memory = {
							...descriptor,
							sha256: createHash("sha256").update(raw).digest("hex")
						};
						remaining -= descriptorBytes;
					}
				}
				if (detailBudget.truncationReason !== undefined) metadata.diagnostics.push("MethodTable memory hashing stopped at the parser work budget.");
				metadata.interfaces_omitted = interfacesOmitted;
				metadata.virtual_slots_omitted = slotsOmitted;
				metadata.truncated = discovered.truncated || hydrationError !== null || detailBudget.truncationReason !== undefined || interfacesOmitted > 0 || slotsOmitted > 0 || metadata.derived_memory === null;
				if (metadata.truncated) metadata.status = "partial";
				if (Buffer.byteLength(JSON.stringify(metadata)) > maximumBytes) {
					metadata.derived_memory = null;
					metadata.interfaces_omitted += metadata.interfaces.length;
					metadata.interfaces.length = 0;
					metadata.virtual_slots_omitted += metadata.virtual_slots.length;
					metadata.virtual_slots.length = 0;
					metadata.diagnostics.push("MethodTable detail rows were omitted because the final serialized report exceeded its byte budget.");
					metadata.truncated = true;
					metadata.status = "partial";
					if (Buffer.byteLength(JSON.stringify(metadata)) > maximumBytes) return undefined;
				}
				return metadata;
			};
			return {
				summary,
				readTypeDetail
			};
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraAnalysisProfile.js
var callRelationshipCoverage, ghidraPinnedLanguage, resolveGhidraAnalysisProfile, ghidraProfileLanguageOverride, sameGhidraLanguageOverride, ghidraProfileDisabledAnalyzers, sameGhidraDisabledAnalyzers;
function init_GhidraAnalysisProfile() {
	return (init_GhidraAnalysisProfile = __esmMin((() => {
		init_analysisProfile();
		init_analysisErrorCore();
		init_providerAdapterError();
		init_result();
		init_GhidraMipsProfile();
		init_GhidraRiscvProfile();
		init_GhidraPowerPcProfile();
		init_GhidraRawBinaryLanguage();
		init_GhidraPspProfile();
		init_GhidraPspExtension();
		init_nativeAotPe();
		callRelationshipCoverage = "function-body-call-coverage-v5";
		ghidraPinnedLanguage = (target) => ghidraMipsLanguageOverride(target) ?? ghidraRiscvLanguageOverride(target) ?? ghidraPowerPcLanguage(target);
		resolveGhidraAnalysisProfile = async (target, identity, installation, signal, languageOverride, disabledAnalyzers) => {
			if (signal?.aborted === true) return Promise.resolve(err(new AnalysisCancelledError("open_binary")));
			if (target.kind !== "executable") return Promise.resolve(ok({ profile: null }));
			if (installation.status === "unavailable") return Promise.resolve(err(new ProviderAdapterError(identity.id, "resolve_analysis_profile")));
			const mipsReason = ghidraProcessorUnsupportedReason(target);
			if (mipsReason !== null) return Promise.resolve(err(new AnalysisUnsupportedTargetError("resolve_analysis_profile", target.path, mipsReason)));
			if (isGhidraPspTarget(target) && languageOverride !== undefined) return err(new AnalysisUnsupportedTargetError("resolve_analysis_profile", target.path, "The bounded PSP Allegrex profile does not accept REA_GHIDRA_LANGUAGE_ID overrides."));
			const pspExtension = isGhidraPspTarget(target) ? await resolveGhidraPspExtension(installation, signal) : null;
			if (pspExtension !== null && !pspExtension.ok) return pspExtension;
			const provider = {
				...identity,
				version: installation.providerVersion
			};
			const analyzerParameters = disabledAnalyzers === undefined || disabledAnalyzers.length === 0 ? { analyzer_preset: "ghidra-default" } : {
				analyzer_preset: `ghidra-default+disabled:${disabledAnalyzers.join(",")}`,
				analysis_options: { disabled_analyzers: [...disabledAnalyzers] }
			};
			if (target.format === "raw-binary") {
				if (languageOverride !== undefined) return Promise.resolve(err(new AnalysisUnsupportedTargetError("resolve_analysis_profile", target.path, "REA_GHIDRA_LANGUAGE_ID cannot override the admitted raw-binary import.")));
				const language = ghidraRawBinaryLanguage(target.architecture);
				return Promise.resolve(ok({ profile: createAnalysisProfile(provider, {
					target_kind: target.kind,
					target_format: target.format,
					architecture: target.architecture,
					available_architectures: [...target.availableArchitectures].sort(),
					import_mode: "ephemeral-source-immutable",
					annotation_policy: "atomic-function-entry-metadata-v1",
					load_image_observations: "source-mappings-entry-context-v2",
					function_body_evidence: "complete-inclusive-ranges-v1",
					function_references: "complete-body-and-entry-reference-manager-v2",
					call_relationship_coverage: callRelationshipCoverage,
					function_dossier_coverage: "observed-facets-and-call-relationships-v1",
					string_inventory_evidence: "defined-data-coverage-v1",
					location_resolution: "explicit-address-exact-entry-symbol-first-v3",
					procedure_file_offset_resolution: "address-first-unique-target-source-mapping-v2",
					instruction_flow_evidence: "decoded-return-pcode-v1",
					instruction_references: "exact-address-incoming-v1",
					function_boundary_observations: "ghidra-function-boundary-limitations-v3",
					no_return_repair: installation.platform === "win32" ? "disabled-windows-p0" : "returning-imports-decoded-return-v2",
					process_launch: installation.platform === "win32" ? "official-headless-script-v1" : "inspected-jvm-launch-support-v1",
					load_image_evidence: "independent-raw-mapping-context-v4",
					jump_table_evidence: "typed-case-default-blocks-v1",
					decompiler_jump_loads: true,
					loader: "BinaryLoader",
					language_id: language.languageId,
					compiler_spec_id: language.compilerSpecId,
					language_selection: "caller-supplied-v1",
					entry_point: target.entryPoint,
					entry_seed: "external-entry-and-function-before-analysis-v1",
					...analyzerParameters
				}) }));
			}
			const dosMz = target.format === "dos-mz";
			const dosCom = target.format === "dos-com";
			const dos = dosMz || dosCom;
			const pinnedLanguage = ghidraPinnedLanguage(target);
			if (pinnedLanguage !== undefined && target.architecture !== "powerpc" && languageOverride !== undefined && (languageOverride.languageId !== pinnedLanguage.languageId || languageOverride.compilerSpecId !== undefined && languageOverride.compilerSpecId !== pinnedLanguage.compilerSpecId)) return err(new AnalysisUnsupportedTargetError("resolve_analysis_profile", target.path, `The caller-selected processor or compiler specification is outside the verified ${target.architecture === "riscv" ? "generic little-endian RISC-V" : "endian-matched MIPS32"} profile. The requested override has not been changed.`));
			const selectedLanguage = languageOverride ?? pinnedLanguage;
			if (dos && languageOverride !== undefined) return Promise.resolve(err(new AnalysisUnsupportedTargetError("resolve_analysis_profile", target.path, "REA_GHIDRA_LANGUAGE_ID cannot override the admitted DOS real-mode import.")));
			return Promise.resolve(ok({ profile: createAnalysisProfile(provider, {
				target_kind: target.kind,
				target_format: target.format,
				...target.format === "pe" ? {
					executable_role: target.executableRole ?? null,
					managed: target.managed ?? null,
					native_aot_metadata: {
						contract_revision: NATIVE_AOT_PROFILE_CONTRACT_REVISION,
						source_bytes: NATIVE_AOT_MAX_SOURCE_BYTES,
						work_units: NATIVE_AOT_MAX_WORK_UNITS,
						working_memory_bytes: NATIVE_AOT_MAX_WORKING_MEMORY_BYTES,
						report_bytes: NATIVE_AOT_MAX_REPORT_BYTES
					}
				} : {},
				architecture: target.architecture ?? null,
				available_architectures: [...target.availableArchitectures ?? []].sort(),
				import_mode: "ephemeral-source-immutable",
				...target.format === "pe" ? { pdb_observations: "program-info-v1" } : {},
				annotation_policy: "atomic-function-entry-metadata-v1",
				load_image_observations: "source-mappings-entry-context-v2",
				function_body_evidence: "complete-inclusive-ranges-v1",
				function_references: "complete-body-and-entry-reference-manager-v2",
				call_relationship_coverage: callRelationshipCoverage,
				function_dossier_coverage: "observed-facets-and-call-relationships-v1",
				string_inventory_evidence: "defined-data-coverage-v1",
				location_resolution: "explicit-address-exact-entry-symbol-first-v3",
				procedure_file_offset_resolution: "address-first-unique-target-source-mapping-v2",
				instruction_flow_evidence: "decoded-return-pcode-v1",
				instruction_references: "exact-address-incoming-v1",
				function_boundary_observations: "ghidra-function-boundary-limitations-v3",
				no_return_repair: installation.platform === "win32" ? "disabled-windows-p0" : "returning-imports-decoded-return-v2",
				process_launch: installation.platform === "win32" ? "official-headless-script-v1" : "inspected-jvm-launch-support-v1",
				...dos ? { load_image_evidence: dosCom ? "independent-com-mapping-context-v1" : "independent-mz-mapping-relocations-v1" } : {},
				jump_table_evidence: "typed-case-default-blocks-v1",
				decompiler_jump_loads: true,
				loader: dosMz ? "MzLoader" : dosCom ? "BinaryLoader" : "auto-from-header",
				language_id: dos ? "x86:LE:16:Real Mode" : selectedLanguage?.languageId ?? "auto-from-header",
				compiler_spec_id: dos ? "default" : selectedLanguage === undefined ? "auto-default" : selectedLanguage.compilerSpecId ?? "language-default",
				...languageOverride === undefined ? pinnedLanguage === undefined ? {} : { language_selection: "provider-pinned-v1" } : { language_selection: "configured-v1" },
				...dos ? {
					load_segment: "0x1000",
					address_coordinates: "linear-byte-offset"
				} : {},
				...dosCom ? {
					entry_offset: "0x100",
					register_context: {
						CS: "0x1000",
						DS: "0x1000",
						ES: "0x1000",
						SS: "0x1000"
					},
					entry_seed: "external-entry-and-function-before-analysis-v1"
				} : {},
				...analyzerParameters,
				...ghidraMipsProfileParameters(target, languageOverride),
				...ghidraRiscvProfileParameters(target),
				...ghidraPowerPcProfileParameters(target),
				...pspExtension?.ok === true ? {
					mips_support_lane: "psp-elf32-exec-eabi32-allegrex-v2",
					loader: "PspElfLoader",
					language_id: "Allegrex:LE:32:default",
					compiler_spec_id: "default",
					psp_extension: { ...pspExtension.value }
				} : {}
			}) }));
		};
		ghidraProfileLanguageOverride = (parameters) => {
			if (parameters.language_selection !== "configured-v1" && parameters.language_selection !== "provider-pinned-v1") return undefined;
			const languageId = parameters.language_id;
			const compilerSpecId = parameters.compiler_spec_id;
			if (typeof languageId !== "string" || typeof compilerSpecId !== "string") return undefined;
			return compilerSpecId === "language-default" ? { languageId } : {
				languageId,
				compilerSpecId
			};
		};
		sameGhidraLanguageOverride = (left, right) => left?.languageId === right?.languageId && left?.compilerSpecId === right?.compilerSpecId;
		ghidraProfileDisabledAnalyzers = (parameters) => {
			const options = parameters.analysis_options;
			if (typeof options !== "object" || options === null) return undefined;
			const disabled = options.disabled_analyzers;
			if (!Array.isArray(disabled)) return undefined;
			return disabled.every((name) => typeof name === "string") ? disabled : undefined;
		};
		sameGhidraDisabledAnalyzers = (left, right) => left === undefined || right === undefined ? left === right : left.length === right.length && left.every((name, index) => name === right[index]);
	})))();
}

//#endregion
//#region dist/ghidra/GhidraLanguageCatalog.js
var MAX_LDEFS_BYTES, LANGUAGE_ROOTS, pendingLanguageFileCleanup, GhidraLanguageCatalogCleanupError, closeLanguageFile, retryLanguageFileCleanup, parseGhidraLanguageDefinitions, languageDirectories, readLanguageDefinitionFile, readGhidraLanguageCatalog, admitGhidraLanguageOverride;
function init_GhidraLanguageCatalog() {
	return (init_GhidraLanguageCatalog = __esmMin((() => {
		init_configurationErrors();
		init_OwnedFileHandle();
		init_BoundedFileBytes();
		MAX_LDEFS_BYTES = 4 * 1024 * 1024;
		LANGUAGE_ROOTS = ["Ghidra/Processors", "Ghidra/Extensions"];
		pendingLanguageFileCleanup = new Set();
		GhidraLanguageCatalogCleanupError = class extends Error {
			paths;
			causes;
			readFailure;
			constructor(paths, causes, readFailure) {
				super(`Language definition cleanup is unconfirmed: ${paths.join(", ")}`, readFailure === undefined ? undefined : { cause: readFailure });
				this.paths = paths;
				this.causes = causes;
				this.readFailure = readFailure;
			}
		};
		closeLanguageFile = async (file) => {
			try {
				await file.owner.close();
				pendingLanguageFileCleanup.delete(file);
				return undefined;
			} catch (cause) {
				pendingLanguageFileCleanup.add(file);
				return cause;
			}
		};
		retryLanguageFileCleanup = async () => {
			const failed = [];
			for (const file of pendingLanguageFileCleanup) {
				const cause = await closeLanguageFile(file);
				if (cause !== undefined) failed.push({
					path: file.path,
					cause
				});
			}
			if (failed.length > 0) throw new GhidraLanguageCatalogCleanupError(failed.map(({ path }) => path), failed.map(({ cause }) => cause));
		};
		parseGhidraLanguageDefinitions = (text) => {
			const definitions = [];
			const document = new DOMParser({ onError: onWarningStopParsing }).parseFromString(text, "application/xml");
			const root = document.documentElement;
			if (root?.tagName !== "language_definitions") throw new SyntaxError("Expected Ghidra language_definitions XML root");
			for (const language of Array.from(root.getElementsByTagName("language"))) {
				if (language.parentNode !== root) continue;
				const id = language.getAttribute("id");
				if (id === null) continue;
				const compilerSpecIds = [];
				for (const compiler of Array.from(language.getElementsByTagName("compiler"))) {
					if (compiler.parentNode !== language) continue;
					const compilerId = compiler.getAttribute("id");
					if (compilerId !== null) compilerSpecIds.push(compilerId);
				}
				definitions.push({
					id,
					compilerSpecIds
				});
			}
			return definitions;
		};
		languageDirectories = async (installDir) => {
			const directories = [];
			for (const root of LANGUAGE_ROOTS) {
				let modules;
				try {
					modules = await readdir(join(installDir, root));
				} catch {
					continue;
				}
				for (const module of modules.sort()) directories.push(join(installDir, root, module, "data", "languages"));
			}
			return directories;
		};
		readLanguageDefinitionFile = async (path) => {
			await retryLanguageFileCleanup();
			const file = {
				path,
				owner: new OwnedFileHandle(await open(path, "r"))
			};
			let read;
			try {
				read = {
					ok: true,
					bytes: await readBoundedFileBytes(file.owner.handle, MAX_LDEFS_BYTES)
				};
			} catch (cause) {
				read = {
					ok: false,
					cause
				};
			}
			const cleanup = await closeLanguageFile(file);
			if (cleanup !== undefined) throw new GhidraLanguageCatalogCleanupError([path], [cleanup], read.ok ? undefined : read.cause);
			if (!read.ok) throw read.cause;
			return read.bytes;
		};
		readGhidraLanguageCatalog = async (installDir) => {
			await retryLanguageFileCleanup();
			const definitions = [];
			for (const directory of await languageDirectories(installDir)) {
				let entries;
				try {
					entries = await readdir(directory);
				} catch {
					continue;
				}
				for (const entry of entries.sort()) {
					if (!entry.endsWith(".ldefs")) continue;
					const bytes = await readLanguageDefinitionFile(join(directory, entry));
					if (bytes === undefined) continue;
					definitions.push(...parseGhidraLanguageDefinitions(new TextDecoder().decode(bytes)));
				}
			}
			return definitions;
		};
		admitGhidraLanguageOverride = (override, catalog, providerVersion) => {
			const language = catalog.find((value) => value.id === override.languageId);
			if (language === undefined) return new ConfigurationError("Invalid REA environment configuration", { settings: [{
				setting: "REA_GHIDRA_LANGUAGE_ID",
				constraint: `is not a language defined by Ghidra ${providerVersion}`
			}] });
			if (override.compilerSpecId !== undefined && !language.compilerSpecIds.includes(override.compilerSpecId)) return new ConfigurationError("Invalid REA environment configuration", { settings: [{
				setting: "REA_GHIDRA_COMPILER_SPEC_ID",
				constraint: `must be one of the selected language's compiler specs: ${language.compilerSpecIds.join(", ")}`
			}] });
			return null;
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraProviderCapabilities.js
var GHIDRA_PROVIDER_IDENTITY, GHIDRA_OPERATIONS, healthLimitations, windowsP0Limitations, stringInventoryLimitation, searchLimitation, limitationsFor$1, CAPABILITIES, windowsP0Capabilities;
function init_GhidraProviderCapabilities() {
	return (init_GhidraProviderCapabilities = __esmMin((() => {
		init_WindowsAuthority();
		init_GhidraFunctionValues();
		init_GhidraInventoryValues();
		init_GhidraSessionValues();
		GHIDRA_PROVIDER_IDENTITY = Object.freeze({
			id: "ghidra",
			name: "Ghidra",
			version: null
		});
		GHIDRA_OPERATIONS = Object.freeze([...GHIDRA_INVENTORY_OPERATIONS, ...GHIDRA_FUNCTION_OPERATIONS]);
		healthLimitations = Object.freeze([
			"The session serves operations only after Ghidra reports default auto-analysis complete; incomplete analysis does not expose partial results.",
			"The imported Program and temporary project are ephemeral and deleted on close. Annotation operations edit session database metadata; original executable bytes are never written.",
			"Cancelling an active Ghidra request terminates its ephemeral database and discards session annotations. The selected target remains open; the next provider query imports the original artifact again."
		]);
		windowsP0Limitations = Object.freeze([
			"Windows Ghidra P0 accepts native x86 and x86-64 PE applications and DLLs, and explicitly selected raw 6502 images; managed, hostile, sensitive, and mutable-path targets are unsupported.",
			"The Windows bridge uses authenticated IPv4 loopback because Node path-based IPC does not expose Java AF_UNIX sockets; the endpoint file contains no bearer token.",
			"Windows sessions require the matching packaged Windows x64 native addon, local NTFS targets and runtimes, and Windows 10 or later. Native handles enforce path admission, private DACLs, and Job Object ownership automatically."
		]);
		stringInventoryLimitation = "Only Ghidra-defined string Data is observed; packed or undefined string bytes may be absent. Completeness applies to that inventory, and an empty search does not establish that text is absent from the artifact. If an address is known, use read_bytes and xrefs to inspect bytes and references.";
		searchLimitation = "Regex mode uses Java Pattern semantics. Matcher or compiler stack exhaustion returns a resource constraint without closing the session; literal mode avoids regex recursion and returns complete matching values.";
		limitationsFor$1 = (operation) => {
			const common = [...healthLimitations, "Default-space addresses use lowercase 0x-prefixed hexadecimal; other address spaces use <percent-encoded-space>:0x<hex>."];
			switch (operation) {
				case "annotate_native_function": return [
					...common,
					"Names use Ghidra USER_DEFINED source. Name writes accept a leaf name or a fully qualified name within the existing namespace; readback uses the fully qualified name and can be reused without adding namespace prefixes. Edits retain the current namespace; other namespace-like text remains literal leaf-name text. Regular comments map to PRE and inline comments to EOL at the exact function entry. Changes commit together after readback and refreshed analysis; failure rolls them all back.",
					"Annotation text rejects NUL and unpaired Unicode surrogates before mutation, with the field and UTF-16 index in the error. Supported Unicode and line endings are preserved.",
					"Metadata edits invalidate immutable analysis snapshots and are discarded on close. CLI returns the updated dossier before session cleanup; this is not a saved Ghidra project."
				];
				case "set_address_name":
				case "set_addresses_names": return [
					...common,
					"Names use Ghidra USER_DEFINED source. A local function entry renames that function; any other mapped address receives a new or renamed primary label. Existing symbols retain their namespace and accept leaf names or qualified names within that namespace; qualified readback can be reused without adding namespace prefixes. Readback compares the primary symbol name.",
					"set_addresses_names applies each address in its own transaction and reports per-address success; invalid names, unmapped addresses, and readback mismatches roll back only that address.",
					"Metadata edits invalidate immutable analysis snapshots and are discarded on close; this is not a saved Ghidra project."
				];
				case "inspect_native_load_image": return [...common, "Independent verification covers admitted DOS MZ, explicitly selected COM with measured entry context, and caller-supplied raw-binary imports. Measured source mappings use inclusive end addresses and complete region digests; no target execution or project mutation occurs."];
				case "read_bytes": return [...common, "Bytes reflect Ghidra's initialized memory, including loader fixups. Reads stop at an unmapped or uninitialized byte and report completeness explicitly."];
				case "search_bytes": return [...common, "Searches initialized loader-adjusted memory independently per block, in provider address order. Bounds and page coverage ends are inclusive. Uninitialized blocks are listed separately. Overlapping matches are included; patterns never cross block boundaries. A cursor resumes the same target, profile and query. Cancellation discards the active search and returns no successful partial page."];
				case "address_to_file_offset": return [...common, "Offsets come from Ghidra source-byte mappings, not virtual-address arithmetic. Uninitialized memory, missing mappings and ambiguous mappings fail explicitly."];
				case "list_documents": return [...common, "A headless Ghidra session contains exactly one imported Program, unlike Hopper's multi-document GUI session."];
				case "list_names": return [...common, "The symbol inventory includes memory and external symbols, including dynamic symbols, but excludes variable and no-address namespace records."];
				case "list_procedures":
				case "procedure_address": return [...common, "External functions and local thunks are distinct; procedure metadata identifies both and preserves a thunk target when Ghidra resolves one."];
				case "list_strings": return [
					...common,
					stringInventoryLimitation,
					"Charset is reported, while a non-missing terminator cannot distinguish a present terminator from a fixed or Pascal layout."
				];
				case "resolve_containing_procedure": return [...common, "An exact external entry resolves to its observed function identity even when its body is empty. This does not establish mapped executable bytes or containment of nearby external addresses."];
				case "list_segments": return [...common, "Memory-block end addresses are exclusive; permissions come from Ghidra MemoryBlock flags rather than inference from section names."];
				case "search_procedures": return [...common, searchLimitation];
				case "search_strings": return [
					...common,
					stringInventoryLimitation,
					searchLimitation
				];
				case "procedure_pseudo_code": return [
					...common,
					"Pseudocode is Ghidra decompiler output, not original source and not text-equivalent to Hopper output.",
					"External functions and functions without an analyzable body return null; other decompiler failures remain explicit."
				];
				case "read_function_instructions": return [
					...common,
					"This fast path reads only the requested function and does not invoke the decompiler or whole-program string/name inventories.",
					"Instruction text is Ghidra-specific and does not claim textual equivalence with Hopper output."
				];
				case "procedure_assembly": return [...common, "Assembly is Ghidra Listing text and does not claim textual equivalence with Hopper output."];
				case "procedure_callers":
				case "procedure_callees": return common;
				case "xrefs": return [
					...common,
					"The direct address list projects exact Ghidra references to one address but does not expose their kinds; procedure_references and analyze_function preserve available kind metadata.",
					"Synthetic Ghidra entry-point references without actionable memory sources are omitted."
				];
				case "procedure_references": return [
					...common,
					"References cover the complete Ghidra function-body AddressSet and exact entry, including instruction-interior destinations and embedded-data sources; an enclosing address span does not establish function ownership.",
					"Reference kinds are direct Ghidra ReferenceManager observations; unresolved computed flows without a target are absent and remain unknown.",
					"Synthetic Ghidra entry-point references without actionable memory sources are omitted."
				];
				case "analyze_function": return [
					...common,
					"References cover the complete Ghidra function-body AddressSet and exact entry. Dossier incoming edges omit sources owned by that function; procedure_references also retains those internal edges.",
					"The dossier combines Ghidra FunctionManager, Listing, ReferenceManager, BasicBlockModel, and decompiler observations; provider-specific pseudocode and assembly are not cross-provider text invariants.",
					"Resolved reference metadata identifies computed, indirect, external, call, jump, and data edges; unresolved targetless flows remain unknown, and function classifications distinguish thunks and externals.",
					"Synthetic Ghidra entry-point references without actionable memory sources are omitted.",
					"The Java bridge serializes one function request per Program and lets each decompilation run until it completes or the caller cancels."
				];
				default: return common;
			}
		};
		CAPABILITIES = Object.freeze(GHIDRA_OPERATIONS.map((operation) => {
			return Object.freeze({
				provider: GHIDRA_PROVIDER_IDENTITY,
				operation,
				available: true,
				reason: null,
				...GHIDRA_MUTATING_OPERATIONS.has(operation) || operation === "list_documents" ? {} : { cachePolicy: "snapshot" },
				effects: Object.freeze({
					mutatesArtifact: GHIDRA_MUTATING_OPERATIONS.has(operation),
					launchesProcess: true,
					mayShowUi: false,
					mayAccessNetwork: false,
					mayWriteFilesystem: true,
					changesPermissions: false,
					requiresRoot: false
				}),
				limitations: Object.freeze(limitationsFor$1(operation))
			});
		}));
		windowsP0Capabilities = (readiness = inspectWindowsNativeReadiness("win32")) => {
			return Object.freeze(CAPABILITIES.map((capability) => {
				const limitations = Object.freeze([...capability.limitations, ...windowsP0Limitations]);
				if (capability.effects.mutatesArtifact) return Object.freeze({
					...capability,
					available: false,
					reason: "Windows Ghidra P0 does not admit database mutation.",
					availabilityCode: "unsupported_host",
					limitations
				});
				return readiness.available ? Object.freeze({
					...capability,
					limitations
				}) : Object.freeze({
					...capability,
					available: false,
					reason: readiness.reason,
					availabilityCode: readiness.code,
					limitations
				});
			}));
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraPeProfile.js
var ghidraPeCodeViewLimitations;
function init_GhidraPeProfile() {
	return (init_GhidraPeProfile = __esmMin((() => {
		ghidraPeCodeViewLimitations = (target, pdbLoaded) => {
			if (target.format !== "pe" || target.codeView === undefined || pdbLoaded !== false) {
				return [];
			}
			const { pdbFileName, guid, age } = target.codeView;
			return [guid !== null ? `The target references debug symbols "${pdbFileName}" (GUID ${guid}, age ${age}) that were not applied; procedure names are analysis-generated.` : `The target references debug symbols "${pdbFileName}" (age ${age}) that were not applied; procedure names are analysis-generated.`];
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraLoadImageValues.js
var sha256, address, limitations, attestGhidraDosLoadImage, checkMappings, attestGhidraDosComLoadImage, hexAddress, attestGhidraRawBinaryLoadImage;
function init_GhidraLoadImageValues() {
	return (init_GhidraLoadImageValues = __esmMin((() => {
		init_nativeLoadImage();
		init_dosMz();
		init_dosCom();
		init_result();
		init_GhidraRawBinaryLanguage();
		sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
		address = (offset) => `0x${offset.toString(16)}`;
		limitations = [
			"Verification covers original/modified FileBytes, every initialized target-backed header/module mapping, relocation records and the external entry point. Mapping ends are inclusive.",
			"Appended overlay bytes are identified by file extent and included in FileBytes identity; they must not be mapped as initialized header/module memory. Uninitialized allocations are reported but their contents and DOS runtime behavior are not verified.",
			"The fixed load segment 0x1000 describes Ghidra's analysis image, not a running DOS process. Verified import does not establish original source ownership or recovered program behavior.",
			"A mismatching memory digest identifies the reported source range; it does not locate the first differing byte inside that range."
		];
		attestGhidraDosLoadImage = (bytes, targetSha256, observations) => {
			if (sha256(bytes) !== targetSha256) return err("Ghidra load-image snapshot digest does not match the admitted target");
			const parsed = parseDosMzHeader(bytes);
			if (!parsed.ok) return parsed;
			const header = parsed.value;
			const loadSegment = 4096;
			const modified = Buffer.from(bytes);
			const expectedRelocations = [];
			for (let index = 0; index < header.relocationCount; index += 1) {
				const table = header.relocationTableOffset + index * 4;
				const offset = bytes.readUInt16LE(table);
				const segment = bytes.readUInt16LE(table + 2);
				const fileOffset = header.headerBytes + segment * 16 + offset;
				const original = modified.subarray(fileOffset, fileOffset + 2).toString("hex");
				const relocated = modified.readUInt16LE(fileOffset) + loadSegment & 65535;
				modified.writeUInt16LE(relocated, fileOffset);
				expectedRelocations.push({
					address: address(loadSegment * 16 + segment * 16 + offset),
					segment: loadSegment + segment & 65535,
					offset,
					status: "APPLIED",
					type: 0,
					values: [
						segment,
						offset,
						relocated
					],
					original_bytes_hex: original,
					memory_bytes_hex: modified.subarray(fileOffset, fileOffset + 2).toString("hex")
				});
			}
			const checks = [];
			const check = (name, expected, observed, fileOffset = null, location = null) => {
				checks.push({
					name,
					matched: JSON.stringify(expected) === JSON.stringify(observed),
					expected,
					observed,
					file_offset: fileOffset,
					address: location
				});
			};
			check("executable_format", "Old-style DOS Executable (MZ)", observations.executable_format);
			check("language_id", "x86:LE:16:Real Mode", observations.language_id);
			check("compiler_spec_id", "default", observations.compiler_spec_id);
			check("image_base", "0x0", observations.image_base);
			check("default_address_space", "ram", observations.default_address_space);
			check("source_file_count", 1, observations.source_files.length);
			const source = observations.source_files[0];
			check("source_file_size", bytes.length, source?.size ?? null);
			check("original_file_sha256", targetSha256, source?.original_sha256 ?? null);
			check("modified_file_sha256", sha256(modified), source?.modified_sha256 ?? null);
			const entryAddress = address((loadSegment + header.entrySegment & 65535) * 16 + header.entryOffset);
			check("entry_points", [entryAddress], [...observations.entry_points].sort());
			const rows = (values) => values.map(({ segment: _segment, offset: _offset, ...value }) => JSON.stringify(value)).sort();
			check("relocation_address_aliases", [], observations.relocations.filter((row) => row.segment === null || row.offset === null || address(row.segment * 16 + row.offset) !== row.address));
			check("relocation_records", rows(expectedRelocations), rows(observations.relocations));
			checkMappings(header, loadSegment * 16, bytes, modified, observations, check);
			return ok(nativeLoadImageSchema.parse({
				status: checks.every((item) => item.matched) ? "verified" : "mismatch",
				format: "dos-mz",
				target_sha256: targetSha256,
				load_segment: loadSegment,
				header_bytes: header.headerBytes,
				module_bytes: header.moduleBytes,
				overlay_bytes: header.overlayBytes,
				entry: {
					relative_segment: header.entrySegment,
					offset: header.entryOffset,
					linear_address: entryAddress
				},
				observations,
				checks,
				limitations
			}));
		};
		checkMappings = (header, loadBase, bytes, modified, observations, check) => {
			const backed = observations.mappings.filter((mapping) => mapping.source_file_index !== null);
			const sorted = [...backed].sort((left, right) => (left.file_offset ?? -1) - (right.file_offset ?? -1));
			let covered = 0;
			for (let index = 0; index < sorted.length; index += 1) {
				const mapping = sorted[index];
				if (mapping === undefined) continue;
				const start = mapping.file_offset;
				const end = start === null ? null : start + mapping.length;
				const headerMapping = start !== null && end !== null && start >= 0 && end <= header.headerBytes;
				const moduleMapping = start !== null && end !== null && start >= header.headerBytes && end <= header.imageBytes;
				const at = `mapping[${index}]`;
				check(`${at}.source_file_index`, 0, mapping.source_file_index, start, mapping.start);
				check(`${at}.file_coverage_start`, covered, start, start, mapping.start);
				check(`${at}.partition`, true, headerMapping || moduleMapping, start, mapping.start);
				check(`${at}.initialized`, true, mapping.initialized, start, mapping.start);
				check(`${at}.loaded`, moduleMapping, mapping.loaded, start, mapping.start);
				check(`${at}.overlay`, headerMapping, mapping.overlay, start, mapping.start);
				check(`${at}.address_space`, headerMapping ? "HEADER" : observations.default_address_space, mapping.address_space, start, mapping.start);
				const expectedStart = start === null ? null : headerMapping ? `HEADER:${address(start)}` : address(loadBase + start - header.headerBytes);
				const expectedEnd = start === null ? null : headerMapping ? `HEADER:${address(start + mapping.length - 1)}` : address(loadBase + start - header.headerBytes + mapping.length - 1);
				check(`${at}.start`, expectedStart, mapping.start, start, mapping.start);
				check(`${at}.end`, expectedEnd, mapping.end, start, mapping.end);
				check(`${at}.memory_sha256`, start !== null && end !== null && end <= bytes.length ? sha256(modified.subarray(start, end)) : null, mapping.sha256, start, mapping.start);
				covered = end ?? covered;
			}
			check("initialized_file_coverage_end", header.imageBytes, covered);
			check("initialized_unbacked_mappings", [], observations.mappings.filter((mapping) => mapping.initialized && mapping.source_file_index === null));
		};
		attestGhidraDosComLoadImage = (bytes, targetSha256, observations) => {
			if (sha256(bytes) !== targetSha256) return err("Ghidra COM snapshot digest does not match the admitted target");
			const length = validateDosComLength(bytes.length);
			if (!length.ok) return length;
			const checks = [];
			const check = (name, expected, observed, fileOffset = null, location = null) => {
				checks.push({
					name,
					matched: JSON.stringify(expected) === JSON.stringify(observed),
					expected,
					observed,
					file_offset: fileOffset,
					address: location
				});
			};
			const source = observations.source_files[0];
			check("executable_format", "Raw Binary", observations.executable_format);
			check("language_id", "x86:LE:16:Real Mode", observations.language_id);
			check("compiler_spec_id", "default", observations.compiler_spec_id);
			check("image_base", "0x0", observations.image_base);
			check("default_address_space", "ram", observations.default_address_space);
			check("source_file_count", 1, observations.source_files.length);
			check("source_file_size", bytes.length, source?.size ?? null);
			check("original_file_sha256", targetSha256, source?.original_sha256 ?? null);
			check("modified_file_sha256", targetSha256, source?.modified_sha256 ?? null);
			check("entry_points", ["0x10100"], [...observations.entry_points].sort());
			check("entry_context", [{
				address: "0x10100",
				registers: [
					"CS",
					"DS",
					"ES",
					"SS"
				].map((name) => ({
					name,
					value_hex: "0x1000"
				}))
			}], observations.entry_context);
			check("relocation_records", [], observations.relocations);
			checkMappings({
				headerBytes: 0,
				imageBytes: bytes.length
			}, 65792, bytes, bytes, observations, check);
			return ok(nativeLoadImageSchema.parse({
				status: checks.every((item) => item.matched) ? "verified" : "mismatch",
				format: "dos-com",
				target_sha256: targetSha256,
				load_segment: 4096,
				header_bytes: 0,
				module_bytes: bytes.length,
				overlay_bytes: 0,
				entry: {
					relative_segment: 0,
					offset: 256,
					linear_address: "0x10100"
				},
				observations,
				checks,
				limitations: [
					"DOS COM is a headerless interpretation explicitly selected by the caller, not format identification from file bytes.",
					"Verification covers complete original/modified source identity, mapped file bytes, entry and measured CS/DS/ES/SS entry context. Context 0x1000 is imposed for analysis; it is not an observed running process.",
					"The PSP, initial stack contents/registers, DOS interrupts, PC-98 devices and runtime behavior are not modeled or verified. No original executable bytes are changed.",
					"Mapping ends are inclusive; a mismatching digest identifies its source range, not the first differing byte."
				]
			}));
		};
		hexAddress = (value) => `0x${value.toString(16)}`;
		attestGhidraRawBinaryLoadImage = (snapshot, target, observations) => {
			if (snapshot.sha256 !== target.sha256) return err("Ghidra raw-binary snapshot digest does not match the admitted target");
			const language = ghidraRawBinaryLanguage(target.architecture);
			const base = BigInt(target.entryPoint);
			const last = hexAddress(base + BigInt(snapshot.bytes) - 1n);
			const checks = [];
			const check = (name, expected, observed, fileOffset = null, location = null) => {
				checks.push({
					name,
					matched: JSON.stringify(expected) === JSON.stringify(observed),
					expected,
					observed,
					file_offset: fileOffset,
					address: location
				});
			};
			const source = observations.source_files[0];
			const fileMappings = observations.mappings.filter((item) => item.source_file_index !== null);
			const mapping = fileMappings[0];
			check("executable_format", "Raw Binary", observations.executable_format);
			check("language_id", language.languageId, observations.language_id);
			check("compiler_spec_id", language.compilerSpecId, observations.compiler_spec_id);
			check("image_base", "0x0", observations.image_base);
			check("default_address_space", language.defaultAddressSpace, observations.default_address_space);
			check("source_file_count", 1, observations.source_files.length);
			check("source_file_size", snapshot.bytes, source?.size ?? null);
			check("original_file_sha256", target.sha256, source?.original_sha256 ?? null);
			check("modified_file_sha256", target.sha256, source?.modified_sha256 ?? null);
			check("mapping_count", 1, fileMappings.length);
			check("initialized_unbacked_mappings", 0, observations.mappings.filter((item) => item.initialized && item.source_file_index === null).length);
			check("mapping.source_file_index", 0, mapping?.source_file_index ?? null);
			check("mapping.initialized", true, mapping?.initialized ?? null);
			check("mapping.loaded", true, mapping?.loaded ?? null);
			check("mapping.overlay", false, mapping?.overlay ?? null);
			check("mapping.address_space", observations.default_address_space, mapping?.address_space ?? null);
			check("mapping.file_offset", 0, mapping?.file_offset ?? null, 0, mapping?.start ?? null);
			check("mapping.start", target.entryPoint, mapping?.start ?? null, 0, mapping?.start ?? null);
			check("mapping.end", last, mapping?.end ?? null, 0, mapping?.end ?? null);
			check("mapping.length", snapshot.bytes, mapping?.length ?? null, 0, mapping?.start ?? null);
			check("mapping.sha256", snapshot.sha256, mapping?.sha256 ?? null, 0, mapping?.start ?? null);
			check("entry_point", target.entryPoint, observations.entry_points.find((entry) => entry === target.entryPoint) ?? null);
			check("relocation_records", [], observations.relocations);
			return ok(nativeLoadImageSchema.parse({
				status: checks.every((item) => item.matched) ? "verified" : "mismatch",
				format: "raw-binary",
				target_sha256: target.sha256,
				architecture: target.architecture,
				language_id: language.languageId,
				compiler_spec_id: language.compilerSpecId,
				base_address: target.entryPoint,
				file_bytes: snapshot.bytes,
				entry: {
					address: target.entryPoint,
					file_offset: 0
				},
				observations,
				checks,
				limitations: [
					"Raw binary is a headerless interpretation explicitly selected by the caller, not format identification from file bytes.",
					"Verification covers complete original/modified source identity, initialized and loaded non-overlay file bytes in the default address space, the caller-supplied entry, and the bound little-endian Ghidra language. File offset 0 is mapped at the entry address.",
					"Ghidra may report additional language-defined external entries outside the mapped image. They are preserved as observations; verification requires the caller-supplied entry and does not attest other entries.",
					"Language-defined uninitialized memory, such as 6502 zero page and stack, is preserved as observations but is not attested as file-backed bytes.",
					"Reset vectors, memory-mapped I/O, big-endian and Thumb-only variants, and runtime boot behavior are not modeled or verified. No original executable bytes are changed.",
					"Mapping ends are inclusive; a mismatching digest identifies its source range, not the first differing byte."
				]
			}));
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraLoadImageAttest.js
var isSignalAborted, attestGhidraNativeLoadImage;
function init_GhidraLoadImageAttest() {
	return (init_GhidraLoadImageAttest = __esmMin((() => {
		init_analysisErrorCore();
		init_jsonValue();
		init_nativeLoadImage();
		init_providerAdapterError();
		init_result();
		init_GhidraLoadImageValues();
		isSignalAborted = (signal) => signal?.aborted === true;
		attestGhidraNativeLoadImage = async (input) => {
			const { target, operation, measured, client, mapSessionError, nativeAotResult, signal } = input;
			if (isSignalAborted(signal)) return err(new AnalysisCancelledError(operation));
			const observations = nativeLoadImageObservationSchema.parse(measured);
			if (target.format === "pe") {
				if (nativeAotResult === undefined) return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: "The Ghidra provider did not produce read-only NativeAOT metadata for this admitted PE snapshot." } }));
				if (isSignalAborted(signal)) return err(new AnalysisCancelledError(operation));
				try {
					return ok(jsonValueSchema.parse(nativeLoadImageSchema.parse({
						status: "unsupported",
						reason: "Independent load-image verification currently supports DOS MZ, explicit DOS COM, and caller-supplied raw-binary targets only.",
						observations: {
							...observations,
							metadata_recovery: [...observations.metadata_recovery ?? [], nativeAotResult.summary]
						},
						limitations: ["Load-image verification is not performed for PE targets; NativeAOT metadata observations are derived separately from the exact admitted snapshot."]
					})));
				} catch (cause) {
					return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: cause instanceof Error ? cause.message : "NativeAOT metadata could not be represented in the load-image result" } }));
				}
			}
			if (target.format !== "dos-mz" && target.format !== "dos-com" && target.format !== "raw-binary") {
				return ok(jsonValueSchema.parse(nativeLoadImageSchema.parse({
					status: "unsupported",
					reason: "Independent load-image verification currently supports DOS MZ, explicit DOS COM, and caller-supplied raw-binary targets only.",
					observations,
					limitations: ["Other formats expose measured mappings and source identities; no format-specific verification was performed."]
				})));
			}
			if (target.format === "raw-binary") {
				if (client.hashTargetSnapshot === undefined) return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: "The Ghidra client does not expose its immutable target snapshot identity for independent raw-binary load-image verification." } }));
				const snapshot = await client.hashTargetSnapshot(signal);
				if (!snapshot.ok) return err(mapSessionError(snapshot.error));
				if (isSignalAborted(signal)) return err(new AnalysisCancelledError(operation));
				const attested = attestGhidraRawBinaryLoadImage(snapshot.value, target, observations);
				return attested.ok ? ok(jsonValueSchema.parse(attested.value)) : err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: attested.error } }));
			}
			if (client.readTargetSnapshot === undefined) return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: "The Ghidra client does not expose its immutable target snapshot for independent load-image verification." } }));
			const snapshot = await client.readTargetSnapshot(undefined, signal);
			if (!snapshot.ok) return err(mapSessionError(snapshot.error));
			if (snapshot.value.kind !== "captured") return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: "The uncapped load-image snapshot was unexpectedly not captured." } }));
			const attested = (target.format === "dos-com" ? attestGhidraDosComLoadImage : attestGhidraDosLoadImage)(snapshot.value.bytes, target.sha256 ?? "", observations);
			if (!attested.ok) return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: attested.error } }));
			return ok(jsonValueSchema.parse(attested.value));
		};
	})))();
}

//#endregion
//#region dist/ghidra/extensions/GhidraExtensionFailures.js
var ghidraExtensionFailure;
function init_GhidraExtensionFailures() {
	return (init_GhidraExtensionFailures = __esmMin((() => {
		init_analysisErrorCore();
		init_providerAdapterError();
		init_jsonValue();
		init_GhidraExtensions();
		ghidraExtensionFailure = (extensions, results, operation) => {
			const reports = results;
			const invalid = validateGhidraExtensionResults(extensions, reports);
			const failed = reports.find((value) => value.status === "unsupported" || value.status === "failed");
			if (invalid === null && failed === undefined) return undefined;
			return invalid === null && failed?.status === "unsupported" ? new AnalysisCapabilityUnavailableError("ghidra", operation, `${failed.id}: ${failed.reason}. Omit REA_GHIDRA_NATIVEAOT_JAR to continue ordinary native analysis.`) : new ProviderAdapterError("ghidra", operation, { diagnostics: {
				reason: invalid ?? failed?.reason ?? "Ghidra extension failed",
				analysis_extensions: jsonValueSchema.parse(reports)
			} });
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraProviderClient.js
var createNativeAotSnapshotOwner, createGhidraProviderClient, ghidraClientPrerequisites, unavailableClient, projectSessionError, projectPrimarySessionError, exitedProviderMessage;
function init_GhidraProviderClient() {
	return (init_GhidraProviderClient = __esmMin((() => {
		init_analysisErrorCleanup();
		init_AnalysisProvider();
		init_GhidraAnalysisSeeds();
		init_GhidraAnalysisProfile();
		init_GhidraMipsProfile();
		init_analysisErrorCore();
		init_providerOperationHealth();
		init_jsonValue();
		init_providerAdapterError();
		init_result();
		init_GhidraClient();
		init_GhidraFunctionValues();
		init_GhidraInventoryValues();
		init_GhidraInstallation();
		init_GhidraPspProfile();
		init_GhidraPspExtension();
		init_GhidraRiscvProfile();
		init_GhidraPeProfile();
		init_GhidraInstallationPolicy();
		init_GhidraLauncher();
		init_GhidraLoadImageAttest();
		init_nativeAotPe();
		init_AbortablePromise();
		init_nativeLoadImage();
		init_GhidraProviderCapabilities();
		init_GhidraSessionValues();
		init_GhidraExtensionFailures();
		init_GhidraExtensions();
		init_WindowsAuthority();
		init_GhidraRawBinaryLanguage();
		createNativeAotSnapshotOwner = (input) => {
			const { client, target, startupTimeoutMs } = input;
			const controller = new AbortController();
			let identity;
			let result;
			let pending;
			let closed = false;
			let identityConflict = false;
			let identityConflictObservation;
			const identityError = (operation, reason, observedBase, observations) => new ProviderAdapterError("ghidra", operation, { diagnostics: {
				reason,
				artifact_sha256: target.sha256,
				bound_image_base: identity === undefined ? null : `0x${identity.slice(target.sha256.length + 1)}`,
				observed_image_base: observedBase,
				measured_observation: observations,
				conflicting_image_base: identityConflictObservation?.imageBase ?? null,
				conflicting_observation: identityConflictObservation?.observations ?? null
			} });
			const identityConflictFailure = (operation, observedBase, observations) => {
				return err(identityError(operation, "The Ghidra session reported conflicting loaded image bases; reopen the analysis session to establish a new identity.", observedBase, observations));
			};
			const derive = async (imageBase, operation, callerSignal, observations) => {
				if (callerSignal?.aborted || closed) return err(new AnalysisCancelledError(operation));
				if (identityConflict) return identityConflictFailure(operation, imageBase, observations);
				if (controller.signal.aborted) return err(new AnalysisCancelledError(operation));
				let normalizedBase;
				try {
					normalizedBase = BigInt(imageBase).toString(16);
				} catch (cause) {
					return err(new ProviderAdapterError("ghidra", operation, {
						diagnostics: {
							reason: "Ghidra returned an invalid loaded image base for NativeAOT identity binding.",
							artifact_sha256: target.sha256,
							observed_image_base: imageBase,
							measured_observation: observations
						},
						cause
					}));
				}
				const key = `${target.sha256}:${normalizedBase}`;
				if (identity !== undefined && identity !== key) {
					identityConflict = true;
					identityConflictObservation = {
						imageBase,
						observations
					};
					result = undefined;
					controller.abort();
					return err(identityError(operation, "The Ghidra session reported a different loaded image base after NativeAOT metadata was bound to its captured snapshot; reopen the analysis session to establish a new identity.", imageBase, observations));
				}
				identity ??= key;
				if (result !== undefined) {
					const settled = await waitForAbortable(Promise.resolve(ok(result)), callerSignal);
					if (closed) return err(new AnalysisCancelledError(operation));
					if (identityConflict) return identityConflictFailure(operation, imageBase, observations);
					if (controller.signal.aborted) return err(new AnalysisCancelledError(operation));
					return settled === ABORTED ? err(new AnalysisCancelledError(operation)) : settled;
				}
				if (pending !== undefined && pending.identity !== key) return err(identityError(operation, "A NativeAOT snapshot derivation is already bound to a different loaded image base.", imageBase, observations));
				if (pending === undefined) {
					const promise = (async () => {
						try {
							if (client.readTargetSnapshot === undefined) return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: "The Ghidra client does not expose its immutable target snapshot for NativeAOT metadata inspection." } }));
							const snapshot = await client.readTargetSnapshot(NATIVE_AOT_MAX_SOURCE_BYTES, controller.signal);
							if (!snapshot.ok) return err(projectSessionError(operation, snapshot.error, startupTimeoutMs));
							if (closed) return err(new AnalysisCancelledError(operation));
							if (identityConflict) return identityConflictFailure(operation, imageBase, observations);
							if (controller.signal.aborted) return err(new AnalysisCancelledError(operation));
							const parsed = snapshot.value.kind === "over-capacity" ? {
								summary: nativeAotSnapshotOverCapacity(target.sha256, snapshot.value.sourceBytesAtLeast, NATIVE_AOT_MAX_REPORT_BYTES),
								readTypeDetail: () => undefined
							} : parseNativeAotPe(snapshot.value.bytes, target.sha256, NATIVE_AOT_MAX_REPORT_BYTES, imageBase);
							if (closed) return err(new AnalysisCancelledError(operation));
							if (identityConflict) return identityConflictFailure(operation, imageBase, observations);
							if (controller.signal.aborted) return err(new AnalysisCancelledError(operation));
							return ok(parsed);
						} catch (cause) {
							return err(new ProviderAdapterError("ghidra", operation, {
								diagnostics: { reason: cause instanceof Error ? cause.message : "NativeAOT metadata could not be derived from the captured target snapshot." },
								cause
							}));
						}
					})();
					const current = {
						identity: key,
						promise
					};
					pending = current;
					void promise.then((settled) => {
						if (pending !== current) return;
						pending = undefined;
						if (settled.ok && !closed && !identityConflict) result = settled.value;
					});
				}
				const settled = await waitForAbortable(pending.promise, callerSignal);
				if (closed) return err(new AnalysisCancelledError(operation));
				if (identityConflict) return identityConflictFailure(operation, imageBase, observations);
				if (controller.signal.aborted) return err(new AnalysisCancelledError(operation));
				return settled === ABORTED ? err(new AnalysisCancelledError(operation)) : settled;
			};
			return {
				derive,
				readTypeDetail: (address) => result?.readTypeDetail(address, NATIVE_AOT_MAX_REPORT_BYTES),
				close: () => {
					closed = true;
					controller.abort();
					result = undefined;
					pending = undefined;
				}
			};
		};
		createGhidraProviderClient = (input) => {
			const { config, logger, clientFactory, target, context, installation } = input;
			const prerequisites = ghidraClientPrerequisites(target, input.profile, installation);
			if (!prerequisites.ok) return unavailableClient(prerequisites.error);
			const committedProfile = prerequisites.value.profile;
			const psp = isGhidraPspTarget(target);
			const pspExtension = psp ? ghidraPspExtensionSchema.safeParse(committedProfile.parameters.psp_extension) : null;
			if (pspExtension !== null && (!pspExtension.success || committedProfile.parameters.language_id !== "Allegrex:LE:32:default" || committedProfile.parameters.loader !== "PspElfLoader")) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "Resolve the supported PSP profile and installed Allegrex extension before opening the session." } }));
			const softFloat = isGhidraMipsSoftFloatTarget(target);
			if (softFloat !== (committedProfile.parameters.mips_soft_float_storage === "o32-soft-float-prototype-v1")) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "Resolve the soft-float MIPS storage policy into the analysis profile before opening the session." } }));
			const extensionProfile = ghidraExtensionSchema.array().safeParse(committedProfile.parameters.analysis_extensions ?? []);
			if (!extensionProfile.success || config.ghidraNativeAotJar !== undefined && extensionProfile.data.length === 0) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "Resolve the configured Ghidra extensions into an analysis profile before opening the session." } }));
			const extensions = extensionProfile.data;
			const seedProfile = ghidraSeedCommitmentSchema.optional().safeParse(committedProfile.parameters.analysis_seeds);
			if (!seedProfile.success || config.ghidraSeedFile === undefined !== (seedProfile.data === undefined)) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "Resolve REA_GHIDRA_SEED_FILE into an analysis profile before opening the session." } }));
			const seeds = seedProfile.data;
			const parameterLanguage = ghidraProfileLanguageOverride(committedProfile.parameters);
			const pinnedLanguage = ghidraPinnedMipsLanguage(committedProfile.parameters);
			const targetLanguage = ghidraPinnedLanguage(target);
			if (pinnedLanguage !== undefined && targetLanguage === undefined) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "The committed profile pins a MIPS language that the current target does not establish; reopen an admitted target to resolve a new profile." } }));
			if (pinnedLanguage !== undefined && config.ghidraLanguageOverride !== undefined) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "The committed legacy MIPS profile pins its import language; REA_GHIDRA_LANGUAGE_ID/REA_GHIDRA_COMPILER_SPEC_ID cannot be combined with it. Reopen the target without the override." } }));
			if (!sameGhidraLanguageOverride(parameterLanguage, config.ghidraLanguageOverride ?? targetLanguage)) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "The committed analysis profile and REA_GHIDRA_LANGUAGE_ID/REA_GHIDRA_COMPILER_SPEC_ID differ; reopen the target to resolve a new profile." } }));
			const importLanguage = parameterLanguage;
			const disabledAnalyzers = ghidraProfileDisabledAnalyzers(committedProfile.parameters);
			if (!sameGhidraDisabledAnalyzers(disabledAnalyzers, config.ghidraDisabledAnalyzers)) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: "The committed analysis profile and REA_GHIDRA_DISABLED_ANALYZERS differ; reopen the target to resolve a new profile." } }));
			const invalidProfile = validateGhidraExtensionProfile(extensions, config, target, installation.platform);
			if (invalidProfile !== null) return unavailableClient(new ProviderAdapterError("ghidra", "open_binary", { diagnostics: { reason: invalidProfile } }));
			let extensionFailure;
			const seedLimitations = [...ghidraSeedLimitations(seeds)];
			const pdbLimitations = [];
			let pdbLoaded;
			const softFloatLimitations = [...ghidraMipsSoftFloatLimitations(softFloat)];
			const rawLanguage = target.format === "raw-binary" ? ghidraRawBinaryLanguage(target.architecture) : undefined;
			const targetLimitations = [
				...target.format === "dos-mz" ? ["DOS MZ uses 16-bit x86 real mode with the Ghidra load segment 0x1000. Returned addresses are linear byte coordinates; they do not identify a unique segment:offset alias.", "Static DOS analysis does not emulate BIOS, DOS interrupts, device ports, or self-modifying unpacking code. Packed targets require a separately identified unpacked artifact for original-program analysis; appended overlays are not the initialized load module."] : [],
				...target.format === "raw-binary" ? [
					"Headerless raw-binary analysis uses the caller-supplied architecture and entry address; file offset 0 is mapped at that address. Headers are not discovered from file bytes.",
					"Little-endian generic Ghidra languages are used for x86, x86_64, arm, arm64, and NMOS 6502. Big-endian, Thumb-only, Cortex-M, 65C02, 65816, and other processor variants are unsupported in this increment.",
					"Static analysis does not emulate reset vectors, memory-mapped I/O, or firmware boot sequences."
				] : [],
				...target.kind === "executable" && target.architecture === "mips" ? target.mips.limitations ?? [] : [],
				...committedProfile.parameters.mips_abi_basis === "inferred-o32-assumption-v1" ? ["The ELF header declares no ABI field and no ABI flags record was observed; o32 calling conventions are an analysis assumption of this lane, not a declared fact.", "Floating-point ABI semantics are unverified for this recordless legacy admission."] : [],
				...ghidraMipsRelocatableLimitations(target),
				...ghidraMipsSharedLimitations(target),
				...ghidraRiscvLimitations(target)
			];
			const providerLimitations = installation.platform === "win32" ? windowsP0Limitations : installation.platform === "darwin" ? ["macOS sessions require a matching executable Ghidra native decompiler; REA checks for it but does not build native components or change Gatekeeper quarantine state."] : [];
			const client = clientFactory({
				startupTimeoutMs: config.ghidraStartupTimeoutMs,
				platform: installation.platform,
				launcher: new GhidraHeadlessLauncher({
					environment: input.environment,
					analyzeHeadlessPath: prerequisites.value.analyzeHeadlessPath,
					javaHome: prerequisites.value.javaHome,
					...installation.javaVmName === undefined ? {} : { javaVmName: installation.javaVmName },
					bridgeScriptPath: fileURLToPath(new URL("../../bridge/ghidra/ReaGhidraBridge.java", new URL("../ghidra/GhidraProviderClient.js", import.meta.url).href)),
					...pspExtension?.success === true ? { pspExtension: pspExtension.data } : {},
					...softFloat ? { mipsSoftFloat: true } : {},
					...target.format === "dos-mz" ? { dosMz: true } : {},
					...target.format === "dos-com" ? { dosCom: true } : {},
					...rawLanguage === undefined || target.format !== "raw-binary" ? {} : { rawBinary: {
						languageId: rawLanguage.languageId,
						compilerSpecId: rawLanguage.compilerSpecId,
						baseAddr: target.entryPoint
					} },
					...importLanguage === undefined ? {} : { languageOverride: importLanguage },
					...config.ghidraDisabledAnalyzers === undefined ? {} : { disabledAnalyzers: config.ghidraDisabledAnalyzers },
					...seeds === undefined ? {} : { analysisSeeds: seeds },
					platform: installation.platform,
					...extensions.length === 0 ? {} : { analysisExtensions: extensions }
				}),
				targetPath: installation.platform === "win32" ? target.sourcePath ?? target.path : target.path,
				targetSha256: target.sha256,
				transport: installation.platform === "win32" ? "authenticated-loopback-tcp" : "unix-socket",
				providerVersion: prerequisites.value.providerVersion,
				profileDigest: committedProfile.digest,
				...["dos-mz", "dos-com"].includes(target.format) ? {
					expectedLanguageId: "x86:LE:16:Real Mode",
					expectedCompilerSpecId: "default"
				} : rawLanguage === undefined ? importLanguage === undefined ? {} : {
					expectedLanguageId: importLanguage.languageId,
					...importLanguage.compilerSpecId === undefined ? {} : { expectedCompilerSpecId: importLanguage.compilerSpecId }
				} : {
					expectedLanguageId: rawLanguage.languageId,
					expectedCompilerSpecId: rawLanguage.compilerSpecId
				},
				...psp ? {
					expectedLanguageId: "Allegrex:LE:32:default",
					expectedCompilerSpecId: "default"
				} : {},
				...context === undefined ? {} : { runId: context.runId },
				logger: logger.child({ layer: "ghidra-bridge" })
			});
			let providerStarted = false;
			const lostProviderHealth = () => providerStarted ? client.operationHealthSnapshot?.() : undefined;
			const checkSessionObservations = async (operation, info) => {
				if (target.format === "pe") {
					pdbLoaded = info.pdb?.loaded;
					pdbLimitations.splice(0, pdbLimitations.length, ...ghidraPdbLimitations(info.pdb));
				}
				const softFloatReason = ghidraMipsSoftFloatFailure(softFloat, info.mips_soft_float_storage);
				extensionFailure = ghidraExtensionFailure(extensions, info.analysis_extensions ?? [], operation) ?? ghidraSeedFailure(seeds, info.analysis_seeds, operation) ?? (softFloatReason === undefined ? undefined : new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: softFloatReason } }));
				if (extensionFailure === undefined && info.analysis_seeds !== undefined) seedLimitations.splice(0, seedLimitations.length, ...ghidraSeedLimitations(seeds, info.analysis_seeds));
				if (extensionFailure === undefined) softFloatLimitations.splice(0, softFloatLimitations.length, ...ghidraMipsSoftFloatLimitations(softFloat, info.mips_soft_float_storage));
				if (extensionFailure === undefined) return undefined;
				const closed = await client.close();
				return closed.ok ? extensionFailure : analysisErrorWithCleanupFailure(extensionFailure, closed.error, operation);
			};
			const releaseLimitation = unverifiedGhidraBuildLimitation(prerequisites.value.providerVersion);
			const sessionLimitations = () => [
				...providerLimitations,
				...targetLimitations,
				...psp ? GHIDRA_PSP_LIMITATIONS : [],
				...softFloatLimitations,
				...ghidraExtensionLimitations(extensions),
				...seedLimitations,
				...pdbLimitations,
				...ghidraPeCodeViewLimitations(target, pdbLoaded),
				...releaseLimitation === undefined ? [] : [releaseLimitation]
			];
			const nativeAotOwner = target.format === "pe" ? createNativeAotSnapshotOwner({
				client,
				target,
				startupTimeoutMs: config.ghidraStartupTimeoutMs
			}) : undefined;
			const projectExecution = (operation, normalized, rawResult, observationLimitations = [], locations = [], relationshipCoverage) => {
				return createAnalysisExecution(normalized, committedProfile.provider, {
					rawResult,
					locations,
					analysisProfile: committedProfile,
					...relationshipCoverage === undefined ? {} : { relationshipCoverage },
					limitations: [
						...limitationsFor$1(operation),
						...observationLimitations,
						...sessionLimitations()
					]
				});
			};
			const inventoryExecution = (operation, called) => {
				if (!called.ok) return err(projectSessionError(operation, called.error, config.ghidraStartupTimeoutMs, lostProviderHealth()));
				const parsed = parseGhidraInventoryResult(operation, called.value);
				if (!parsed.ok) return parsed;
				return ok(projectExecution(operation, parsed.value, called.value));
			};
			return {
				execute: async (operation, parameters, options) => {
					if (extensionFailure !== undefined) return err(extensionFailure);
					if (operation !== "health" && !isGhidraInventoryOperation(operation) && !isGhidraFunctionOperation(operation)) return err(new AnalysisCapabilityUnavailableError(GHIDRA_PROVIDER_IDENTITY.id, operation, "The Ghidra adapter does not declare this operation."));
					if (operation === "health") {
						const started = await client.start(options?.signal, options?.progress);
						if (started.ok) providerStarted = true;
						if (!started.ok) return err(projectSessionError(operation, started.error, config.ghidraStartupTimeoutMs, lostProviderHealth()));
						const failed = await checkSessionObservations(operation, started.value);
						if (failed !== undefined) return err(failed);
						return ok(createAnalysisExecution(started.value, committedProfile.provider, {
							analysisProfile: committedProfile,
							limitations: [...healthLimitations, ...sessionLimitations()]
						}));
					}
					const input = isGhidraFunctionOperation(operation) ? parseGhidraFunctionInput(operation, parameters) : parseGhidraInventoryInput(operation, parameters);
					if (!input.ok) return input;
					if (target.format === "pe" || extensions.length > 0 || seeds !== undefined || softFloat) {
						const started = await client.start(options?.signal, options?.progress);
						if (started.ok) providerStarted = true;
						if (!started.ok) return err(projectSessionError(operation, started.error, config.ghidraStartupTimeoutMs, lostProviderHealth()));
						const failed = await checkSessionObservations(operation, started.value);
						if (failed !== undefined) return err(failed);
					}
					const called = await client.callTool(operation, input.value, {
						...options?.signal === undefined ? {} : { signal: options.signal },
						...options?.progress === undefined ? {} : { progress: options.progress }
					});
					if (called.ok) providerStarted = true;
					if (operation === "list_documents" || operation === "list_procedures") return inventoryExecution(operation, called);
					if (!called.ok) return err(projectSessionError(operation, called.error, config.ghidraStartupTimeoutMs, lostProviderHealth()));
					let normalized;
					let observationLimitations = [];
					let observationLocations = [];
					let relationshipCoverage;
					if (isGhidraFunctionOperation(operation)) {
						const result = parseGhidraFunctionResult(operation, called.value);
						if (!result.ok) return result;
						normalized = result.value.value;
						observationLimitations = result.value.limitations;
						observationLocations = result.value.locations ?? [];
						relationshipCoverage = result.value.relationshipCoverage;
					} else {
						const result = parseGhidraInventoryResult(operation, called.value);
						if (!result.ok) return result;
						normalized = result.value;
					}
					if (operation === "inspect_native_data_type") {
						const address = input.value.address;
						if (typeof address === "string") {
							if (target.format === "pe" && nativeAotOwner !== undefined) {
								const started = await client.start(options?.signal, options?.progress);
								if (!started.ok) return err(projectSessionError(operation, started.error, config.ghidraStartupTimeoutMs, lostProviderHealth()));
								const derived = await nativeAotOwner.derive(started.value.target.image_base, operation, options?.signal, normalized);
								if (!derived.ok) return derived;
							}
							let metadata;
							metadata = nativeAotOwner?.readTypeDetail(address);
							if (metadata !== undefined && normalized !== null && typeof normalized === "object" && !Array.isArray(normalized)) {
								const nativeResult = normalized;
								if (nativeResult.metadata_recovery === undefined) normalized = jsonValueSchema.parse({
									...nativeResult,
									metadata_recovery: metadata
								});
							}
						}
					}
					if (operation === "inspect_native_load_image") {
						let derived;
						if (target.format === "pe") {
							const observations = nativeLoadImageObservationSchema.parse(normalized);
							if (nativeAotOwner === undefined) return err(new ProviderAdapterError("ghidra", operation, { diagnostics: { reason: "The admitted PE session has no read-only NativeAOT snapshot owner." } }));
							const result = await nativeAotOwner.derive(observations.image_base, operation, options?.signal, normalized);
							if (!result.ok) return result;
							derived = result.value;
						}
						const attested = await attestGhidraNativeLoadImage({
							target,
							operation,
							measured: normalized,
							client,
							mapSessionError: (failure) => projectSessionError(operation, failure, config.ghidraStartupTimeoutMs, lostProviderHealth()),
							nativeAotResult: derived,
							signal: options?.signal
						});
						if (!attested.ok) return attested;
						normalized = attested.value;
					}
					return ok(projectExecution(operation, normalized, called.value, observationLimitations, observationLocations, relationshipCoverage));
				},
				executeIfReady: async (operation, parameters, options) => {
					if (operation !== "list_documents" && operation !== "list_procedures") return undefined;
					if (extensionFailure !== undefined) return err(extensionFailure);
					const input = parseGhidraInventoryInput(operation, parameters);
					if (!input.ok) return input;
					if (client.callToolIfReady === undefined) return undefined;
					const called = await client.callToolIfReady(operation, input.value, options?.signal === undefined ? {} : { signal: options.signal });
					if (called === undefined) return undefined;
					return inventoryExecution(operation, called);
				},
				operationHealthSnapshot: () => client.operationHealthSnapshot?.(),
				runtimeLineageSnapshots: () => {
					const observation = client.runtimeLineage?.() ?? null;
					return observation === null ? [] : [{
						provider: committedProfile.provider,
						observation
					}];
				},
				close: async () => {
					nativeAotOwner?.close();
					return client.close();
				}
			};
		};
		ghidraClientPrerequisites = (target, profile, installation) => {
			if (target.kind !== "executable") return err(new AnalysisCapabilityUnavailableError("ghidra", "health", `Ghidra cannot import ${target.kind} targets through this adapter.`));
			if (installation.status === "unavailable") return err(new ProviderAdapterError("ghidra", "health", { diagnostics: ghidraInstallationDiagnostics(installation) }));
			const readiness = installation.platform === "win32" ? inspectWindowsNativeReadiness(installation.platform) : undefined;
			if (readiness?.available === false) return err(new AnalysisCapabilityUnavailableError("ghidra", "health", readiness.reason));
			if (profile === undefined || profile.provider.id !== "ghidra") return err(new ProviderAdapterError("ghidra", "health"));
			return ok({
				analyzeHeadlessPath: installation.analyzeHeadlessPath,
				javaHome: installation.javaHome,
				providerVersion: installation.providerVersion,
				profile
			});
		};
		unavailableClient = (failure) => ({
			execute: () => Promise.resolve(err(failure)),
			close: () => Promise.resolve(ok(null))
		});
		projectSessionError = (operation, failure, startupTimeoutMs, health) => {
			const primary = projectPrimarySessionError(operation, failure, startupTimeoutMs, health);
			return failure.cleanupFailure === undefined ? primary : analysisErrorWithCleanupFailure(primary, failure.cleanupFailure, operation);
		};
		projectPrimarySessionError = (operation, failure, startupTimeoutMs, health) => {
			const context = {
				cause: failure,
				diagnostics: failure.diagnostics
			};
			if (failure.cause instanceof AnalysisAccessDeniedError) return new AnalysisAccessDeniedError(operation, failure.cause.path, failure.cause.systemCode, context);
			if (failure.cause instanceof AnalysisArtifactChangedError) return new AnalysisArtifactChangedError(operation, failure.cause.path, failure.cause.reason, context);
			if (operation === "annotate_native_function" && failure.kind === "remote" && failure.remoteCode === "invalid_function_name") return new AnalysisInputError(operation, context, [{
				path: ["name"],
				reason: "invalid_value",
				message: failure.message
			}]);
			if (failure.kind === "cancelled" || failure.kind === "remote" && failure.remoteCode === "decompile_cancelled") return new AnalysisCancelledError(operation, context);
			if (failure.kind === "timeout" || failure.kind === "analysis_timeout") return new AnalysisTimeoutError(operation, failure.timeoutMs ?? startupTimeoutMs, context);
			if (failure.kind === "remote" && failure.remoteCode === "regex_stack_exhausted") return new AnalysisResourceConstraintError(operation, "memory", failure.message, null, {
				...context,
				remediationAction: "Retry this search in literal mode or simplify the regex. The active analysis session and annotations remain available."
			});
			if (failure.kind === "remote" && [
				"invalid_request",
				"not_found",
				"ambiguous"
			].includes(failure.remoteCode ?? "")) return new AnalysisInputError(operation, context, [{
				path: [],
				reason: "invalid_value",
				message: failure.message
			}]);
			if (failure.kind === "remote" && failure.remoteCode === "method_unavailable") return new AnalysisCapabilityUnavailableError("ghidra", operation, failure.message, context);
			const exited = exitedProviderMessage(operation, failure, health);
			if (exited !== undefined) return new ProviderAdapterError("ghidra", operation, {
				...context,
				userMessage: exited
			});
			return new ProviderAdapterError("ghidra", operation, context);
		};
		exitedProviderMessage = (operation, failure, health) => {
			if (failure.kind !== "process" && failure.kind !== "protocol") return undefined;
			if (health === undefined || providerRetryAction(health.state) !== "restart_provider") return undefined;
			const observed = health.state === "exited" ? `exited${health.exitCode === null ? "" : ` with code ${String(health.exitCode)}`}` : "became unreachable";
			return `The Ghidra provider for this session ${observed} before ${operation} could complete. Call open_binary for the same target to start a new Ghidra session, then retry; session-only annotations from the previous provider are not retained.`;
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraProvider.js
var SUPPORTED_ARCHITECTURES, GhidraProvider, providerFailureText, inspectWindowsP0TargetSupport;
function init_GhidraProvider() {
	return (init_GhidraProvider = __esmMin((() => {
		init_snapshotEnvironment();
		init_analysisProfile();
		init_binaryTargetTypes();
		init_jsonValue();
		init_result();
		init_providerAdapterError();
		init_providerCleanupError();
		init_GhidraClient();
		init_GhidraInstallation();
		init_GhidraAnalysisProfile();
		init_analysisErrorCore();
		init_GhidraAnalysisSeeds();
		init_GhidraLanguageCatalog();
		init_GhidraPspProfile();
		init_GhidraExtensions();
		init_GhidraProviderCapabilities();
		init_GhidraProviderClient();
		init_WindowsAuthority();
		SUPPORTED_ARCHITECTURES = new Set([
			"x86",
			"x86_64",
			"arm",
			"arm64",
			"mips",
			"6502",
			"riscv",
			"powerpc"
		]);
		GhidraProvider = class {
			config;
			logger;
			installationHost;
			clientFactory;
			#installation;
			environment;
			constructor(config, logger, environment, installationHost, clientFactory = (options) => new GhidraClient(options)) {
				this.config = config;
				this.logger = logger;
				this.installationHost = installationHost;
				this.clientFactory = clientFactory;
				this.environment = snapshotEnvironment(environment, installationHost?.platform);
			}
			identity() {
				return GHIDRA_PROVIDER_IDENTITY;
			}
			capabilities() {
				return (this.installationHost?.platform ?? process.platform) === "win32" ? windowsP0Capabilities() : CAPABILITIES;
			}
			inspectAvailability() {
				return this.inspectReadinessSnapshot().availability;
			}
			inspectReadinessSnapshot() {
				const installation = this.#inspectInstallation();
				const readiness = installation.platform === "win32" ? inspectWindowsNativeReadiness(installation.platform) : undefined;
				return {
					availability: this.#availability(installation, readiness),
					capabilities: readiness === undefined ? CAPABILITIES : windowsP0Capabilities(readiness)
				};
			}
			#availability(installation, readiness) {
				const diagnostics = ghidraInstallationDiagnostics(installation);
				if (installation.status === "available" && readiness?.available === false) return {
					status: "unavailable",
					code: readiness.code,
					reason: readiness.reason,
					diagnostics: {
						...diagnostics,
						windows_security: jsonObjectSchema.parse(windowsNativeCapabilities(installation.platform, readiness)),
						windows_native_failure: {
							stage: readiness.failureStage,
							remediation: readiness.remediation
						}
					}
				};
				return installation.status === "available" ? {
					status: "available",
					code: null,
					reason: null,
					diagnostics
				} : {
					status: "unavailable",
					code: installation.rejection.code,
					reason: installation.rejection.reason,
					diagnostics
				};
			}
			inspectTargetSupport(target) {
				const hostPlatform = this.installationHost?.platform ?? process.platform;
				const diagnostics = {
					host_platform: hostPlatform,
					target_kind: target.kind,
					target_format: target.format,
					architecture: target.architecture ?? null,
					available_architectures: target.kind === "executable" ? [...target.availableArchitectures] : null,
					executable_role: target.executableRole ?? null,
					managed: target.managed ?? null
				};
				if (target.kind !== "executable") return {
					status: "unsupported",
					code: "target_kind_unsupported",
					reason: `Ghidra v1 imports executable targets, not ${target.kind} targets.`,
					diagnostics
				};
				if (hostPlatform === "win32") return inspectWindowsP0TargetSupport(target, diagnostics);
				const mipsReason = isGhidraPspTarget(target) && (hostPlatform !== "linux" || (this.installationHost?.architecture ?? process.arch) !== "x64") ? "The initial PSP Allegrex profile is verified on Linux x64 only." : ghidraProcessorUnsupportedReason(target);
				if (mipsReason !== null) return {
					status: "unsupported",
					code: "architecture_unsupported",
					reason: mipsReason,
					diagnostics
				};
				if (isMachOFormat(target.format) && target.availableArchitectures.length > 1) return {
					status: "unsupported",
					code: "architecture_unsupported",
					reason: "Ghidra v1 cannot enforce the selected architecture when importing a universal Mach-O; analyze a thinned Mach-O slice instead.",
					diagnostics
				};
				if (!SUPPORTED_ARCHITECTURES.has(target.architecture)) return {
					status: "unsupported",
					code: "architecture_unsupported",
					reason: "Ghidra v1 requires a supported x86, x86_64, arm, arm64, MIPS, RISC-V, or raw 6502 target profile.",
					diagnostics
				};
				return {
					status: "supported",
					code: null,
					reason: null,
					diagnostics
				};
			}
			async resolveAnalysisProfile(target, options) {
				const installation = this.#inspectInstallation();
				const resolved = await resolveGhidraAnalysisProfile(target, GHIDRA_PROVIDER_IDENTITY, installation, options?.signal, this.config.ghidraLanguageOverride, this.config.ghidraDisabledAnalyzers);
				if (!resolved.ok || resolved.value.profile === null) return resolved;
				const override = this.config.ghidraLanguageOverride;
				if (override !== undefined && installation.status === "available") {
					let catalog;
					try {
						catalog = await readGhidraLanguageCatalog(installation.installDir);
					} catch (cause) {
						if (cause instanceof GhidraLanguageCatalogCleanupError) return err(new ProviderCleanupError("ghidra", cause.paths, {
							reason: cause.message,
							paths: [...cause.paths],
							close_failures: cause.causes.map(providerFailureText),
							...cause.readFailure === undefined ? {} : { read_failure: providerFailureText(cause.readFailure) }
						}, {
							operation: "resolve_analysis_profile",
							cause
						}));
						return err(new ProviderAdapterError("ghidra", "resolve_analysis_profile", {
							cause,
							diagnostics: { reason: "Could not read the installed Ghidra language definitions." }
						}));
					}
					const refused = admitGhidraLanguageOverride(override, catalog, installation.providerVersion);
					if (refused !== null) return err(refused);
				}
				const extensions = await resolveGhidraExtensions(this.config, target, installation.platform, options?.signal);
				if (!extensions.ok) return extensions;
				if (options?.signal?.aborted === true) return err(new AnalysisCancelledError("open_binary"));
				const seeds = await resolveGhidraAnalysisSeeds(this.config.ghidraSeedFile);
				if (!seeds.ok) return seeds;
				if (extensions.value.length === 0 && seeds.value === undefined) return resolved;
				return ok({
					...resolved.value,
					profile: createAnalysisProfile(resolved.value.profile.provider, {
						...resolved.value.profile.parameters,
						...extensions.value.length === 0 ? {} : { analysis_extensions: jsonValueSchema.parse(extensions.value) },
						...seeds.value === undefined ? {} : { analysis_seeds: jsonValueSchema.parse(seeds.value) }
					})
				});
			}
			createClient(target, profile, context) {
				return createGhidraProviderClient({
					config: this.config,
					environment: this.environment,
					logger: this.logger,
					clientFactory: this.clientFactory,
					target,
					...profile === undefined ? {} : { profile },
					...context === undefined ? {} : { context },
					installation: this.#inspectInstallation()
				});
			}
			#inspectInstallation() {
				const options = {
					environment: this.environment,
					...this.config.ghidraInstallDir === undefined ? {} : { installDir: this.config.ghidraInstallDir },
					...this.config.ghidraJavaHome === undefined ? {} : { javaHome: this.config.ghidraJavaHome },
					...this.installationHost?.platform === undefined ? {} : { platform: this.installationHost.platform },
					...this.installationHost?.architecture === undefined ? {} : { architecture: this.installationHost.architecture }
				};
				this.#installation ??= this.installationHost === undefined ? inspectGhidraInstallation(options) : inspectGhidraInstallation(options, this.installationHost);
				return this.#installation;
			}
		};
		providerFailureText = (cause) => cause instanceof Error ? cause.message : String(cause);
		inspectWindowsP0TargetSupport = (target, diagnostics) => {
			if (target.format === "raw-binary" && target.architecture === "6502") return {
				status: "supported",
				code: null,
				reason: null,
				diagnostics
			};
			if (target.format !== "pe") return {
				status: "unsupported",
				code: "target_format_unsupported",
				reason: "Windows Ghidra P0 accepts native PE and explicitly selected raw 6502 targets only.",
				diagnostics
			};
			if (target.architecture !== "x86" && target.architecture !== "x86_64") return {
				status: "unsupported",
				code: "architecture_unsupported",
				reason: "Windows Ghidra P0 accepts x86 and x86-64 PE targets only.",
				diagnostics
			};
			if (target.executableRole !== "application" && target.executableRole !== "shared-library") return {
				status: "unsupported",
				code: "target_role_unsupported",
				reason: "Windows Ghidra P0 accepts PE applications and DLLs, not non-executable or unclassified images.",
				diagnostics
			};
			if (target.managed !== false) return {
				status: "unsupported",
				code: "managed_target_unsupported",
				reason: "Windows Ghidra P0 accepts native PE applications and DLLs; managed or unclassified PE targets are unsupported.",
				diagnostics
			};
			return {
				status: "supported",
				code: null,
				reason: null,
				diagnostics
			};
		};
	})))();
}

//#endregion
//#region dist/ida/IdaDiagnosticWriter.js
var IDA_REDACTION_MARKER, IdaDiagnosticResourceError, joinIdaDiagnosticParts, writeIdaDiagnostic;
function init_IdaDiagnosticWriter() {
	return (init_IdaDiagnosticWriter = __esmMin((() => {
		init_analysisErrorCore();
		init_jsonSerialization();
		IDA_REDACTION_MARKER = "[redacted transport credential]";
		IdaDiagnosticResourceError = class extends AnalysisResourceConstraintError {
			constructor(inputCodeUnits, representedCodeUnits, representation = "redacted-output") {
				super("ida_diagnostic_redaction", "memory", representation === "redacted-output" ? "Redacted IDA diagnostics exceed the runtime's maximum string length." : "Temporary IDA diagnostic JSON character decoding exceeds the runtime's maximum string length.", {
					boundary: "ida-diagnostic-redaction",
					representation,
					input_code_units: inputCodeUnits,
					...representation === "redacted-output" ? { output_code_units_at_least: representedCodeUnits } : { json_decoding_code_units_at_least: representedCodeUnits },
					max_string_code_units: constants$2.MAX_STRING_LENGTH
				});
			}
		};
		joinIdaDiagnosticParts = (parts, inputCodeUnits) => {
			function* checkedParts() {
				let outputCodeUnits = 0;
				for (const part of parts) {
					outputCodeUnits += part.length;
					if (outputCodeUnits > constants$2.MAX_STRING_LENGTH) throw new IdaDiagnosticResourceError(inputCodeUnits, outputCodeUnits);
					yield part;
				}
			}
			return [...bufferedJsonParts(checkedParts())].join("");
		};
		writeIdaDiagnostic = (text, matches, replacement = IDA_REDACTION_MARKER) => {
			function* parts() {
				let cursor = 0;
				let pending;
				for (const match of matches) {
					if (pending !== undefined && match.start < pending.end) {
						pending = {
							start: pending.start,
							end: Math.max(pending.end, match.end)
						};
						continue;
					}
					if (pending !== undefined) {
						yield text.slice(cursor, pending.start);
						yield replacement;
						cursor = pending.end;
					}
					pending = match;
				}
				if (pending !== undefined) {
					yield text.slice(cursor, pending.start);
					yield replacement;
					cursor = pending.end;
				}
				yield text.slice(cursor);
			}
			return joinIdaDiagnosticParts(parts(), text.length);
		};
	})))();
}

//#endregion
//#region dist/ida/IdaJsonDiagnostic.js
function* stringMatches(encoded, decoded, offset, matches) {
	let sourceCursor = 0;
	let decodedCursor = 0;
	const sourceOffset = (boundary) => {
		while (decodedCursor < boundary) {
			sourceCursor += encoded[sourceCursor] === "\\" ? encoded[sourceCursor + 1] === "u" ? 6 : 2 : 1;
			decodedCursor++;
		}
		return offset + sourceCursor;
	};
	for (const match of matches(decoded)) yield {
		start: sourceOffset(match.start),
		end: sourceOffset(match.end)
	};
}
function* characterRunMatches(encoded, offset, matches, inputCodeUnits) {
	for (const run of encoded.matchAll(JSON_CHARACTER_RUN)) {
		const decodingCodeUnits = run[0].length + 2;
		if (decodingCodeUnits > constants$2.MAX_STRING_LENGTH) throw new IdaDiagnosticResourceError(inputCodeUnits, decodingCodeUnits, "json-character-run");
		const decoded = JSON.parse("\"" + run[0] + "\"");
		if (typeof decoded !== "string") throw new TypeError("A JSON character run did not decode to a string.");
		yield* stringMatches(run[0], decoded, offset + run.index, matches);
	}
}
function* decodedMatches(text, matches) {
	let scannedEnd = 0;
	const scanner = createScanner(text);
	while (scanner.scan() !== JSON_EOF) {
		if (scanner.getToken() !== JSON_STRING_LITERAL) continue;
		const start = scanner.getTokenOffset();
		const end = start + scanner.getTokenLength();
		if (scannedEnd < start) yield* characterRunMatches(text.slice(scannedEnd, start), scannedEnd, matches, text.length);
		if (scanner.getTokenError() === JSON_NO_ERROR) yield* stringMatches(text.slice(start + 1, end - 1), scanner.getTokenValue(), start + 1, matches);
		else yield* characterRunMatches(text.slice(start + 1, end), start + 1, matches, text.length);
		scannedEnd = end;
	}
	yield* characterRunMatches(text.slice(scannedEnd), scannedEnd, matches, text.length);
}
function* literalMatches(text, matches, validDocument) {
	if (!validDocument) {
		yield* matches(text);
		return;
	}
	const scanner = createScanner(text);
	let complete;
	let ended = false;
	for (const match of matches(text)) {
		while (!ended && (complete === undefined || complete.end <= match.start)) {
			complete = undefined;
			while (scanner.scan() !== JSON_EOF) {
				if (scanner.getToken() !== JSON_STRING_LITERAL) continue;
				const start = scanner.getTokenOffset();
				complete = {
					start,
					end: start + scanner.getTokenLength()
				};
				break;
			}
			if (complete === undefined) ended = true;
		}
		if (complete === undefined || match.start < complete.start || match.end > complete.end) yield match;
	}
}
function* mergeMatches(left, right) {
	const leftIterator = left[Symbol.iterator]();
	const rightIterator = right[Symbol.iterator]();
	try {
		let leftMatch = leftIterator.next();
		let rightMatch = rightIterator.next();
		while (!leftMatch.done || !rightMatch.done) {
			if (rightMatch.done || !leftMatch.done && leftMatch.value.start <= rightMatch.value.start) {
				if (leftMatch.done) break;
				yield leftMatch.value;
				leftMatch = leftIterator.next();
			} else {
				yield rightMatch.value;
				rightMatch = rightIterator.next();
			}
		}
	} finally {
		try {
			leftIterator.return?.();
		} finally {
			rightIterator.return?.();
		}
	}
}
var JSON_STRING_LITERAL, JSON_EOF, JSON_NO_ERROR, JSON_CHARACTER_RUN, redactIdaJsonDiagnostic, redactIdaUnclassifiedDiagnostic;
function init_IdaJsonDiagnostic() {
	return (init_IdaJsonDiagnostic = __esmMin((() => {
		init_IdaDiagnosticWriter();
		JSON_STRING_LITERAL = 10;
		JSON_EOF = 17;
		JSON_NO_ERROR = 0;
		JSON_CHARACTER_RUN = /(?:[^"\\\u0000-\u001f]|\\(?:["\\/bfnrt]|u[\dA-Fa-f]{4}))+/gu;
		redactIdaJsonDiagnostic = (text, matches, replacement = IDA_REDACTION_MARKER) => {
			let validDocument = false;
			try {
				JSON.parse(text);
				validDocument = true;
			} catch {}
			return writeIdaDiagnostic(text, mergeMatches(literalMatches(text, matches, validDocument), decodedMatches(text, matches)), replacement);
		};
		redactIdaUnclassifiedDiagnostic = (text, matches, replacement = IDA_REDACTION_MARKER) => writeIdaDiagnostic(text, mergeMatches(matches(text), decodedMatches(text, matches)), replacement);
	})))();
}

//#endregion
//#region dist/ida/IdaDiagnosticRedactor.js
var IDA_DIAGNOSTIC_SOURCE_BYTES, omittedDiagnostic, boundedDiagnostic, basicPayloads, authorizationPayloads, cookiePayloads, redactionMarker, createIdaDiagnosticRedactor;
function init_IdaDiagnosticRedactor() {
	return (init_IdaDiagnosticRedactor = __esmMin((() => {
		init_IdaJsonDiagnostic();
		init_IdaDiagnosticWriter();
		init_analysisErrorCore();
		IDA_DIAGNOSTIC_SOURCE_BYTES = 64 * 1024;
		omittedDiagnostic = "[IDA diagnostic omitted: exceeds 65536 UTF-8 bytes]";
		boundedDiagnostic = (redact) => (message) => Buffer.byteLength(message, "utf8") > 65536 ? redact(omittedDiagnostic) : redact(message);
		basicPayloads = (payload) => {
			if (!/^[A-Za-z\d+/]+={0,2}$/u.test(payload)) return [];
			const octets = Buffer.from(payload, "base64");
			const canonical = octets.toString("base64");
			if (canonical.replace(/=+$/u, "") !== payload.replace(/=+$/u, "") || octets.indexOf(58) < 0) return [];
			if (octets.some((value) => value < 32 || value === 127)) return [];
			const candidates = [octets.toString("latin1")];
			try {
				candidates.push(new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(octets));
			} catch {}
			return [
				canonical,
				canonical.replace(/=+$/u, ""),
				...candidates.flatMap((pair) => {
					const separator = pair.indexOf(":");
					return [pair, pair.slice(separator + 1)].filter((value) => value.length > 0);
				})
			];
		};
		authorizationPayloads = (header) => {
			const credentials = header.match(/^([!#$%&'*+.^_`|~\dA-Za-z-]+)[ \t]+([\s\S]+)$/u);
			const payload = credentials?.[2];
			if (payload === undefined) return [];
			if (credentials?.[1]?.toLowerCase() === "basic") return [payload, ...basicPayloads(payload)];
			const values = [payload];
			const parameter = /[ \t,]*[!#$%&'*+.^_`|~\dA-Za-z-]+[ \t]*=[ \t]*("(?:[^"\\\r\n]|\\[^\r\n])*"|[!#$%&'*+.^_`|~\dA-Za-z-]+)[ \t]*(?:,|$)/uy;
			let cursor = 0;
			while (cursor < payload.length) {
				parameter.lastIndex = cursor;
				const match = parameter.exec(payload);
				if (match === null) break;
				cursor = parameter.lastIndex;
				const value = match[1] ?? "";
				if (!value.startsWith("\"")) {
					values.push(value);
					continue;
				}
				const quoted = value.slice(1, -1);
				if (quoted.length > 0) values.push(value, quoted, quoted.replace(/\\([^\r\n])/gu, "$1"));
			}
			return values;
		};
		cookiePayloads = (header) => header.split(";").flatMap((pair) => {
			const value = pair.match(/^[ \t]*[!#$%&'*+.^_`|~\dA-Za-z-]+[ \t]*=[ \t]*(.*?)[ \t]*$/u)?.[1];
			if (value === undefined) return [];
			const payload = value.startsWith("\"") && value.endsWith("\"") ? value.slice(1, -1) : value;
			if (!/^[\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]+$/u.test(payload)) return [];
			return [value, payload];
		});
		redactionMarker = (secrets) => {
			if (secrets.every((secret) => !secret.includes("[") && !secret.includes("]") && !"[redacted transport credential]".includes(secret))) return IDA_REDACTION_MARKER;
			const characters = new Set();
			for (const secret of secrets) for (const character of secret) characters.add(character);
			const graphic = /[\p{L}\p{N}\p{P}\p{S}]/u;
			for (let point = 9247; point <= 1114111; point++) {
				if (point >= 55296 && point <= 57343) continue;
				const character = String.fromCodePoint(point);
				if (graphic.test(character) && !characters.has(character)) return character;
			}
			throw new AnalysisProtocolError("Configured IDA credentials leave no available diagnostic redaction character.");
		};
		createIdaDiagnosticRedactor = (config) => {
			const headers = config !== undefined && "headers" in config ? Object.entries(config.headers) : [];
			const values = headers.flatMap(([name, value]) => {
				if (!/^(?:authorization|proxy-authorization|cookie)$/iu.test(name)) return [];
				const normalized = value.replace(/^[ \t\r\n]+|[ \t\r\n]+$/gu, "");
				if (normalized.length === 0) return [];
				return [
					value,
					normalized,
					...name.toLowerCase() === "cookie" ? cookiePayloads(normalized) : authorizationPayloads(normalized)
				];
			});
			const secrets = [...new Set(values.filter((value) => value.length > 0))].sort((left, right) => right.length - left.length);
			const replacement = secrets.length === 0 ? IDA_REDACTION_MARKER : redactionMarker(secrets);
			const alternatives = secrets.map((secret) => secret.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")).join("|");
			const pattern = alternatives.length === 0 ? undefined : new RegExp("(?=(" + alternatives + "))", "gu");
			const matches = function* (value) {
				if (pattern === undefined) return;
				let pending;
				for (const match of value.matchAll(pattern)) {
					const credential = match[1];
					if (credential === undefined || credential.length === 0) throw new AnalysisProtocolError("IDA diagnostic matching omitted its credential span.");
					const span = {
						start: match.index,
						end: match.index + credential.length
					};
					if (pending !== undefined && span.start < pending.end) {
						pending = {
							start: pending.start,
							end: Math.max(pending.end, span.end)
						};
					} else {
						if (pending !== undefined) yield pending;
						pending = span;
					}
				}
				if (pending !== undefined) yield pending;
			};
			const text = boundedDiagnostic((message) => writeIdaDiagnostic(message, matches(message), replacement));
			const json = boundedDiagnostic((message) => secrets.length === 0 ? message : redactIdaJsonDiagnostic(message, matches, replacement));
			return {
				text,
				json,
				blocks(messages) {
					let bytes = 0;
					let sourceUnits = 0;
					for (let index = 0; index < messages.length; index++) {
						const value = messages[index];
						bytes += Buffer.byteLength(value, "utf8") + (index === 0 ? 0 : 1);
						sourceUnits += value.length + (index === 0 ? 0 : 1);
						if (bytes > 65536) return text(omittedDiagnostic);
					}
					function* parts() {
						for (let index = 0; index < messages.length; index++) {
							if (index > 0) yield "\n";
							const value = messages[index];
							yield secrets.length === 0 || value.length === 0 ? value : redactIdaUnclassifiedDiagnostic(value, matches, replacement);
						}
					}
					return joinIdaDiagnosticParts(parts(), sourceUnits);
				},
				message(prefix, ownedBody) {
					return joinIdaDiagnosticParts([
						text(prefix),
						"\n",
						ownedBody
					], prefix.length + 1 + ownedBody.length);
				}
			};
		};
	})))();
}

//#endregion
//#region dist/ida/IdaMcpConnection.js
var toolResultSchema, IDA_STDIO_MAX_MESSAGE_BYTES, parseIdaJsonText, decodeIdaToolResult, IdaHttpJsonError, httpQuotedOctet, parseIdaContentType, httpErrorBody, readBoundedResponseText, diagnosticFetch, retainedTransportCause, createIdaMcpConnection;
function init_IdaMcpConnection() {
	return (init_IdaMcpConnection = __esmMin((() => {
		init_IdaDiagnosticRedactor();
		init_IdaDiagnosticWriter();
		init_snapshotEnvironment();
		init_jsonValue();
		init_result();
		init_analysisErrorCore();
		init_providerAdapterError();
		toolResultSchema = z.object({
			isError: z.boolean().optional(),
			structuredContent: z.record(z.string(), z.unknown()).optional(),
			content: z.array(z.object({
				type: z.string(),
				text: z.string().optional()
			}).passthrough()),
			_meta: z.object({ ida_mcp: z.object({
				output_truncated: z.boolean().optional(),
				download_hint: z.string().optional()
			}).passthrough().optional() }).passthrough().optional()
		});
		IDA_STDIO_MAX_MESSAGE_BYTES = 64 * 1024 * 1024;
		parseIdaJsonText = (text) => {
			let value;
			try {
				value = JSON.parse(text);
			} catch {
				throw new AnalysisProtocolError("IDA MCP returned malformed JSON text.");
			}
			return jsonValueSchema.parse(value);
		};
		decodeIdaToolResult = (input, protocol, diagnostic = createIdaDiagnosticRedactor()) => {
			const result = toolResultSchema.parse(input);
			const blocks = result.content.flatMap((block) => block.type === "text" && block.text !== undefined ? [block.text] : []);
			if (result.isError === true) {
				const reason = diagnostic.blocks(blocks);
				throw new AnalysisProtocolError(diagnostic.message("IDA MCP tool failed: ", reason), { diagnostics: { reason } });
			}
			if (result._meta?.ida_mcp?.output_truncated === true) throw new AnalysisProtocolError(diagnostic.message("IDA MCP truncated its output; the preview cannot establish a complete observation. ", diagnostic.blocks([result._meta.ida_mcp.download_hint ?? "Use the upstream output download workflow to retrieve the full result."])));
			if (protocol === "native") {
				if (blocks.length !== 1) throw new AnalysisProtocolError("Native IDA MCP omitted its complete JSON text result.");
				return parseIdaJsonText(blocks[0] ?? "");
			}
			if (result.structuredContent !== undefined) {
				const value = result.structuredContent;
				return jsonValueSchema.parse(Object.keys(value).length === 1 && "result" in value ? value.result : value);
			}
			if (blocks.length !== 1) throw new AnalysisProtocolError("IDA MCP omitted a single structured or text result; unsupported content cannot establish an empty observation.");
			const values = blocks.map((text) => {
				try {
					return jsonValueSchema.parse(JSON.parse(text));
				} catch {
					return text;
				}
			});
			return values[0] ?? null;
		};
		IdaHttpJsonError = class extends Error {
			constructor(text, redactor) {
				super(redactor.message("IDA MCP returned malformed HTTP JSON. Response body: ", text));
			}
		};
		httpQuotedOctet = (code) => code === 9 || code === 32 || code >= 33 && code <= 126 || code >= 128 && code <= 255;
		parseIdaContentType = (text) => {
			let cursor = 0;
			const token = new RegExp("[!#$%&'*+.^_`|~0-9A-Za-z-]+", "y");
			const readToken = () => {
				token.lastIndex = cursor;
				const match = token.exec(text);
				if (match === null) return undefined;
				cursor = token.lastIndex;
				return match[0];
			};
			const readOws = () => {
				while (text[cursor] === " " || text[cursor] === "	") cursor++;
			};
			const readQuoted = () => {
				cursor++;
				let value = "";
				while (cursor < text.length) {
					let code = text.charCodeAt(cursor++);
					if (code === 34) return value;
					if (code === 92) {
						code = text.charCodeAt(cursor++);
						if (!httpQuotedOctet(code)) return undefined;
					} else if (!httpQuotedOctet(code)) return undefined;
					value += String.fromCharCode(code);
				}
				return undefined;
			};
			readOws();
			const type = readToken()?.toLowerCase();
			if (type === undefined || text[cursor++] !== "/") return err("malformed");
			const subtype = readToken()?.toLowerCase();
			if (subtype === undefined) return err("malformed");
			const parameters = new Map();
			let ambiguous = false;
			while (true) {
				readOws();
				if (cursor === text.length) break;
				if (text[cursor++] !== ";") return err("malformed");
				readOws();
				if (cursor === text.length || text[cursor] === ";") continue;
				const name = readToken()?.toLowerCase();
				if (name === undefined || text[cursor++] !== "=") return err("malformed");
				const value = text[cursor] === "\"" ? readQuoted() : readToken();
				if (value === undefined) return err("malformed");
				if (parameters.has(name)) ambiguous = true;
				else parameters.set(name, value);
			}
			return ambiguous ? err("ambiguous") : ok({
				essence: type + "/" + subtype,
				subtype,
				charset: parameters.get("charset"),
				parameters
			});
		};
		httpErrorBody = (response, text, redactor) => {
			const omitted = redactor.text("IDA MCP response body omitted: unsupported or unknown format or character encoding.");
			const contentType = response.headers.get("content-type");
			if (contentType === null) return omitted;
			const mediaType = parseIdaContentType(contentType);
			if (!mediaType.ok) return omitted;
			const charset = mediaType.value.charset?.toLowerCase();
			if (charset !== undefined && ![
				"utf-8",
				"utf8",
				"us-ascii",
				"ascii"
			].includes(charset)) return omitted;
			if (mediaType.value.subtype === "json" || mediaType.value.subtype.endsWith("+json")) return redactor.json(text);
			if (mediaType.value.essence === "text/plain") return redactor.text(text);
			return omitted;
		};
		readBoundedResponseText = async (response) => {
			if (response.body === null) return "";
			const reader = response.body.getReader();
			const chunks = [];
			let total = 0;
			try {
				for (;;) {
					const { done, value } = await reader.read();
					if (done) return Buffer.concat(chunks, total).toString("utf8");
					total += value.byteLength;
					if (total > 65536) {
						await reader.cancel().catch(() => undefined);
						return undefined;
					}
					chunks.push(Buffer.from(value));
				}
			} finally {
				reader.releaseLock();
			}
		};
		diagnosticFetch = (redactor) => async (input, init) => {
			const response = await fetch(input, init);
			const readText = response.text.bind(response);
			let safeBody;
			if (!response.ok) {
				const sourceBody = await readBoundedResponseText(response);
				safeBody = sourceBody === undefined ? redactor.text(`IDA MCP response body omitted: exceeds ${IDA_DIAGNOSTIC_SOURCE_BYTES} UTF-8 bytes.`) : httpErrorBody(response, sourceBody, redactor);
				const body = safeBody;
				Object.defineProperty(response, "text", { value: async () => body });
			}
			Object.defineProperty(response, "json", { value: async () => {
				const text = safeBody ?? await readText();
				try {
					const value = JSON.parse(text);
					return value;
				} catch {
					throw new IdaHttpJsonError(safeBody ?? httpErrorBody(response, text, redactor), redactor);
				}
			} });
			return response;
		};
		retainedTransportCause = (cause, message) => {
			if (cause instanceof SdkHttpError) return new SdkHttpError(cause.code, message, {
				status: cause.data.status,
				statusText: ""
			});
			if (cause instanceof ProtocolError) return new ProtocolError(cause.code, message);
			return new Error(message);
		};
		createIdaMcpConnection = (config, environment) => {
			const client = new Client({
				name: "rea-ida-provider",
				version: "1"
			});
			const redactor = createIdaDiagnosticRedactor(config);
			let stderr = Buffer.alloc(0);
			let stderrBytes = 0;
			const transportFailure = (cause, operation = "ida_mcp_response") => {
				const bufferLimit = cause instanceof Error ? /ReadBuffer exceeded maximum size of (\d+) bytes/u.exec(cause.message) : null;
				if (cause instanceof IdaDiagnosticResourceError) throw cause;
				let failure;
				if (cause instanceof IdaHttpJsonError) failure = new Error(cause.message, { cause });
				else {
					const message = cause instanceof Error ? cause.message : "Unknown IDA MCP transport failure";
					const body = cause instanceof SdkHttpError ? cause.data.text : undefined;
					const prefix = "Error POSTing to endpoint: ";
					const ownedPostBody = cause instanceof SdkHttpError && cause.code === SdkErrorCode.ClientHttpNotImplemented && typeof body === "string" && message === prefix + body;
					const safeMessage = ownedPostBody ? redactor.message(prefix, body) : redactor.blocks([message]);
					failure = new Error(safeMessage, { cause: retainedTransportCause(cause, safeMessage) });
				}
				let start = 0;
				if (stderrBytes > stderr.length) while (start < stderr.length && (stderr[start] & 192) === 128) start++;
				const capturedOutput = {
					stdout: "",
					stderr: redactor.blocks([stderr.subarray(start).toString("utf8")]),
					truncated: stderrBytes > stderr.length - start,
					stdout_bytes: 0,
					stderr_bytes: stderrBytes
				};
				if (bufferLimit !== null) throw new AnalysisResourceConstraintError(operation, "transport", `Upstream IDA MCP reply exceeded the ${bufferLimit[1]}-byte transport limit; no partial Evidence was returned.`, { max_response_bytes: Number(bufferLimit[1]) }, {
					cause,
					capturedOutput
				});
				if (stderrBytes === 0) throw failure;
				throw new ProviderAdapterError("ida", "transport", {
					cause: failure,
					diagnostics: { reason: failure.message },
					capturedOutput
				});
			};
			const transport = "command" in config ? new StdioClientTransport({
				command: config.command,
				args: config.args,
				env: {
					...Object.fromEntries(DEFAULT_INHERITED_ENV_VARS.map((key) => [key, ""])),
					...Object.fromEntries(Object.entries(snapshotEnvironment(environment)).filter((entry) => entry[1] !== undefined)),
					IDA_MCP_MAX_WORKERS: "1",
					...snapshotEnvironment(config.env)
				},
				stderr: "pipe",
				maxBufferSize: IDA_STDIO_MAX_MESSAGE_BYTES
			}) : new StreamableHTTPClientTransport(new URL(config.url), {
				requestInit: {
					headers: config.headers,
					redirect: "error"
				},
				fetch: diagnosticFetch(redactor)
			});
			if (transport instanceof StdioClientTransport) transport.stderr?.on("data", (chunk) => {
				stderrBytes += chunk.length;
				const combined = Buffer.concat([stderr, chunk]);
				stderr = Buffer.from(combined.subarray(Math.max(0, combined.length - 16384)));
			});
			return {
				async connect() {
					await client.connect(transport, { timeout: config.timeoutMs }).catch(transportFailure);
					const catalog = await client.listTools(undefined, { timeout: config.timeoutMs }).catch(transportFailure);
					return catalog.tools.map(({ name }) => name);
				},
				async call(name, args) {
					return decodeIdaToolResult(await client.callTool({
						name,
						arguments: args
					}, { timeout: config.timeoutMs }).catch((cause) => transportFailure(cause, name)), config.protocol, redactor);
				},
				async readResource(uri) {
					const response = await client.readResource({ uri }, { timeout: config.timeoutMs }).catch(transportFailure);
					const resource = z.object({ contents: z.array(z.object({
						uri: z.literal(uri),
						mimeType: z.literal("application/json"),
						text: z.string()
					})).length(1) }).parse(response);
					return parseIdaJsonText(resource.contents[0]?.text ?? "");
				},
				serverInfo: () => jsonValueSchema.parse(client.getServerVersion() ?? null),
				close: () => client.close().catch(transportFailure),
				detach() {
					if (!(transport instanceof StdioClientTransport)) return;
					const child = Reflect.get(transport, "_process");
					if (!(child instanceof ChildProcess)) return;
					child.unref();
					for (const stream of [
						child.stdin,
						child.stdout,
						child.stderr
					]) if (stream instanceof Socket) stream.unref();
				}
			};
		};
	})))();
}

//#endregion
//#region dist/ida/IdaProviderCapabilities.js
var IDA_PROVIDER_IDENTITY, IDA_OPERATIONS, HEADLESS_ONLY_OPERATIONS, idaProfileAdmits, IDA_LIMITATIONS, IDA_NATIVE_STRING_LIMITATION, ATTACHED_GUI_NAVIGATION_OPERATIONS, idaCapabilities;
function init_IdaProviderCapabilities() {
	return (init_IdaProviderCapabilities = __esmMin((() => {
		IDA_PROVIDER_IDENTITY = Object.freeze({
			id: "ida",
			name: "IDA MCP adapter",
			version: "1"
		});
		IDA_OPERATIONS = Object.freeze([
			"list_procedures",
			"search_procedures",
			"list_strings",
			"search_strings",
			"procedure_address",
			"procedure_pseudo_code",
			"procedure_assembly",
			"procedure_callers",
			"procedure_callees",
			"read_function_instructions",
			"xrefs",
			"analyze_function",
			"resolve_containing_procedure",
			"list_documents"
		]);
		HEADLESS_ONLY_OPERATIONS = new Set(["resolve_containing_procedure"]);
		idaProfileAdmits = (operation, mode) => mode === "headless" || !HEADLESS_ONLY_OPERATIONS.has(operation);
		IDA_LIMITATIONS = Object.freeze([
			"Provider version identifies the REA IDA adapter. IDA engine and upstream distribution versions are unknown unless separately observed; MCP serverInfo is reported independently.",
			"Results describe the current IDA analysis database. Input identity does not prove an unmodified database; patches, annotations, analysis completeness, and database revision remain unknown.",
			"Live results are never replayed from analysis snapshots. Target checks before and after a request do not provide an atomic lock against external GUI changes.",
			"Caller cancellation drains the in-flight MCP request before cleanup; it does not prove that IDA engine work was interrupted.",
			"Headless workers are released through the upstream database lifecycle. Abrupt termination of REA, its proxy, or the supervisor cannot prove worker cleanup; inspect upstream inventory after an interrupted process.",
			"Complete function body ranges, typed references, unresolved indirect calls, referenced data, and basic blocks are unavailable in this adapter. Empty unsupported dossier facets are unknown, not observed absence."
		]);
		IDA_NATIVE_STRING_LIMITATION = "Native string observations use upstream C-string rendering; other string representations remain unknown.";
		ATTACHED_GUI_NAVIGATION_OPERATIONS = new Set([
			"procedure_pseudo_code",
			"procedure_assembly",
			"read_function_instructions",
			"analyze_function"
		]);
		idaCapabilities = (mode, stdio, native = false) => IDA_OPERATIONS.filter((operation) => idaProfileAdmits(operation, mode)).map((operation) => ({
			provider: IDA_PROVIDER_IDENTITY,
			operation,
			...(mode === "headless" || native) && operation === "procedure_callers" ? {
				available: false,
				reason: native ? "The native upstream profile reports code references without proving direct call edges." : "The modern upstream profile reports code references without proving direct call edges."
			} : {
				available: true,
				reason: null
			},
			cachePolicy: "live",
			effects: {
				mutatesArtifact: false,
				launchesProcess: stdio || mode === "headless",
				mayShowUi: mode === "attached" && (native ? operation === "procedure_pseudo_code" || operation === "analyze_function" : ATTACHED_GUI_NAVIGATION_OPERATIONS.has(operation)),
				mayAccessNetwork: true,
				mayWriteFilesystem: stdio || mode === "headless",
				changesPermissions: false,
				requiresRoot: false
			},
			limitations: native && (operation === "list_strings" || operation === "search_strings") ? [...IDA_LIMITATIONS, IDA_NATIVE_STRING_LIMITATION] : IDA_LIMITATIONS
		}));
	})))();
}

//#endregion
//#region dist/ida/IdaProtocolValues.js
var idaAddressSchema, idaFunctionSchema, legacyMetadataSchema, busyHealthSchema, modernHealthSchema, cursorSchema, nextOffset, legacyPageSchema, modernPageSchema, modernLookupRowSchema, modernLookupBatchSchema, modernLookupSchema, instructionSchema, disassemblySchema, modernDisassemblySchema, modernDecompileSchema, legacyStringSchema, modernStringsSchema, legacyXrefsSchema, modernXrefsSchema, modernCalleesSchema, modernCallGraphSchema, legacyCalleesSchema, openDatabaseSchema, rejectedOpenDatabaseSchema, databaseListSchema, closeDatabaseSchema, absentDatabaseCloseSchema, hexCoordinate, surveySegmentsSchema;
function init_IdaProtocolValues() {
	return (init_IdaProtocolValues = __esmMin((() => {
		init_jsonValue();
		init_analysisErrorCore();
		idaAddressSchema = z.string().regex(/^(?:0x)?[0-9a-f]+$/iu).transform((value) => `0x${BigInt(value.startsWith("0x") || value.startsWith("0X") ? value : `0x${value}`).toString(16)}`);
		idaFunctionSchema = z.union([z.object({
			address: idaAddressSchema,
			name: z.string().min(1),
			size: z.string()
		}), z.object({
			addr: idaAddressSchema,
			name: z.string().min(1),
			size: z.string()
		}).transform(({ addr, ...rest }) => ({
			address: addr,
			...rest
		}))]);
		legacyMetadataSchema = z.object({
			path: z.string().min(1),
			module: z.string(),
			sha256: z.string().regex(/^[0-9a-f]{64}$/iu),
			base: idaAddressSchema
		}).passthrough();
		busyHealthSchema = z.object({
			status: z.literal("busy"),
			busy_tool: z.string().optional()
		}).passthrough();
		modernHealthSchema = z.object({
			status: z.literal("ok"),
			input_path: z.string().min(1),
			idb_path: z.string().nullable(),
			imagebase: idaAddressSchema,
			auto_analysis_ready: z.boolean().nullable(),
			module: z.string()
		}).passthrough();
		cursorSchema = z.union([z.object({ next: z.number().int().nonnegative() }), z.object({ done: z.literal(true) })]);
		nextOffset = (cursor, current) => {
			if ("done" in cursor) return null;
			if (cursor.next <= current) throw new AnalysisProtocolError("IDA MCP pagination did not advance its offset.");
			return cursor.next;
		};
		legacyPageSchema = z.object({
			data: z.array(jsonValueSchema),
			next_offset: z.number().int().nonnegative().nullable()
		});
		modernPageSchema = z.array(z.object({
			data: z.array(jsonValueSchema),
			next_offset: z.number().int().nonnegative().nullable()
		})).length(1);
		modernLookupRowSchema = z.object({
			query: z.string(),
			fn: idaFunctionSchema.nullable(),
			error: z.string().nullable()
		});
		modernLookupBatchSchema = z.array(modernLookupRowSchema);
		modernLookupSchema = modernLookupBatchSchema.length(1);
		instructionSchema = z.union([z.object({
			address: idaAddressSchema,
			instruction: z.string(),
			comments: z.array(z.string()).nullish()
		}), z.object({
			addr: idaAddressSchema,
			instruction: z.string(),
			comments: z.array(z.string()).nullish()
		}).transform(({ addr, ...rest }) => ({
			address: addr,
			...rest
		}))]);
		disassemblySchema = z.object({
			name: z.string(),
			start_ea: idaAddressSchema,
			lines: z.array(instructionSchema),
			return_type: z.string().nullish(),
			arguments: z.array(z.object({
				name: z.string(),
				type: z.string()
			})).nullish()
		});
		modernDisassemblySchema = z.object({
			asm: disassemblySchema.nullable(),
			error: z.string().optional(),
			cursor: cursorSchema
		});
		modernDecompileSchema = z.object({
			code: z.string().nullable(),
			error: z.string().optional(),
			cursor: cursorSchema,
			line_count: z.number().int().nonnegative().optional(),
			total_lines: z.number().int().nonnegative().optional()
		});
		legacyStringSchema = z.object({
			address: idaAddressSchema,
			string: z.string(),
			length: z.number().int().nonnegative()
		});
		modernStringsSchema = z.object({
			matches: z.array(z.object({
				addr: idaAddressSchema,
				string: z.string()
			})),
			cursor: cursorSchema
		});
		legacyXrefsSchema = z.array(z.object({
			address: idaAddressSchema,
			type: z.string(),
			function: idaFunctionSchema.nullable()
		}));
		modernXrefsSchema = z.array(z.object({
			xrefs: z.array(z.object({
				addr: idaAddressSchema,
				type: z.string(),
				fn: idaFunctionSchema.nullable()
			})).nullable(),
			error: z.string().optional(),
			more: z.boolean().optional()
		})).length(1);
		modernCalleesSchema = z.array(z.object({
			callees: z.array(z.object({
				addr: idaAddressSchema,
				name: z.string(),
				type: z.enum(["internal", "external"])
			})).nullable(),
			error: z.string().optional(),
			more: z.boolean().optional()
		})).length(1);
		modernCallGraphSchema = z.array(z.object({
			root: z.string(),
			error: z.string().optional(),
			nodes: z.array(z.object({
				addr: idaAddressSchema,
				name: z.string().nullable()
			})),
			edges: z.array(z.object({
				from: idaAddressSchema,
				to: idaAddressSchema,
				type: z.string()
			})),
			truncated: z.boolean().optional(),
			limit_reason: z.string().nullable().optional(),
			max_edges_per_func: z.number().int().positive().optional(),
			per_func_capped: z.boolean().optional()
		}).passthrough()).length(1);
		legacyCalleesSchema = z.array(z.object({
			address: idaAddressSchema,
			name: z.string()
		}).passthrough());
		openDatabaseSchema = z.object({
			success: z.literal(true),
			session: z.object({
				session_id: z.string().min(1),
				input_path: z.string().min(1)
			}).passthrough()
		}).passthrough();
		rejectedOpenDatabaseSchema = z.object({
			error: z.string().min(1),
			success: z.never().optional()
		}).passthrough();
		databaseListSchema = z.object({ sessions: z.array(z.object({
			session_id: z.string(),
			input_path: z.string(),
			owned: z.boolean(),
			backend: z.enum(["worker", "gui"]),
			is_active: z.boolean()
		}).passthrough()) }).passthrough();
		closeDatabaseSchema = z.object({
			success: z.literal(true),
			session_id: z.string(),
			saved: z.boolean().nullable().optional(),
			owned: z.boolean(),
			backend: z.enum(["worker", "gui"])
		}).passthrough();
		absentDatabaseCloseSchema = (sessionId) => z.object({ error: z.literal(`Session not found: ${sessionId}`) }).passthrough();
		hexCoordinate = z.string().regex(/^0x[0-9a-f]+$/iu).pipe(z.transform((value) => BigInt(value)));
		surveySegmentsSchema = z.object({
			statistics: z.object({ total_segments: z.number().int().nonnegative().optional() }).passthrough().optional(),
			segments: z.array(z.object({
				start: hexCoordinate,
				end: hexCoordinate,
				size: hexCoordinate.optional()
			}).passthrough()).min(1)
		}).passthrough().superRefine(({ statistics, segments }, context) => {
			if (statistics?.total_segments !== undefined && statistics.total_segments !== segments.length) context.addIssue({
				code: "custom",
				message: "survey segment count disagrees with its statistics"
			});
			for (const { start, end, size } of segments) {
				if (typeof start !== "bigint" || typeof end !== "bigint") continue;
				if (start >= end || size !== undefined && size !== end - start) context.addIssue({
					code: "custom",
					message: "survey segment bounds are reversed or inconsistent"
				});
			}
		});
	})))();
}

//#endregion
//#region dist/ida/IdaNativeProtocol.js
var nativeAssemblySchema, nativeDisassemblySchema, nativeDecompileSchema, nativeErrorSchema, nativeCalleesSchema, nativeXrefsSchema, nativeStringsSchema, nativeLiteralSearchPattern, nativeTools;
function init_IdaNativeProtocol() {
	return (init_IdaNativeProtocol = __esmMin((() => {
		init_analysisErrorCore();
		init_IdaProtocolValues();
		nativeAssemblySchema = disassemblySchema.omit({ lines: true }).extend({ lines: z.string() }).transform((asm) => {
			const [header, ...body] = asm.lines.split("\n");
			const match = header?.match(/^(.+) \((.*) @ (0x[0-9a-f]+)\):$/iu);
			if (match?.[1] !== asm.name || idaAddressSchema.parse(match?.[3]) !== asm.start_ea) throw new AnalysisProtocolError("Native IDA assembly header contradicts its function identity.");
			return {
				...asm,
				lines: body.map((line) => {
					const item = line.match(/^([0-9a-f]+)  (.*)$/iu);
					if (item === null) throw new AnalysisProtocolError("Native IDA returned an unsupported assembly line.");
					return {
						address: idaAddressSchema.parse(item[1]),
						instruction: item[2] ?? ""
					};
				})
			};
		});
		nativeDisassemblySchema = z.object({
			asm: nativeAssemblySchema.nullable(),
			error: z.string().optional(),
			cursor: cursorSchema
		});
		nativeDecompileSchema = z.object({
			addr: idaAddressSchema,
			ok: z.boolean(),
			pseudocode: z.string().min(1).optional(),
			lines: z.number().int().nonnegative().optional(),
			error: z.string().optional()
		});
		nativeErrorSchema = z.string().nullish().transform((value) => value ?? undefined);
		nativeCalleesSchema = z.array(modernCalleesSchema.element.extend({ error: nativeErrorSchema }).transform((page) => {
			if (page.error === undefined && page.callees !== null && page.more === undefined) throw new AnalysisProtocolError("Native IDA callees omitted an explicit truncation marker.");
			return page;
		})).length(1);
		nativeXrefsSchema = z.array(modernXrefsSchema.element.extend({ error: nativeErrorSchema })).length(1);
		nativeStringsSchema = modernStringsSchema.extend({ error: z.string().optional() }).transform((page) => {
			if (page.error !== undefined) throw new AnalysisProtocolError(`Native IDA string search failed: ${page.error}`);
			return page;
		});
		nativeLiteralSearchPattern = (pattern, caseSensitive) => {
			if (/[\uD800-\uDFFF]/u.test(pattern)) return undefined;
			let literal = (caseSensitive ? pattern : pattern.toLowerCase()).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
			if (!caseSensitive) literal = literal.replace(/[a-z]/gu, (char) => `[${char}${char.toUpperCase()}]`);
			return caseSensitive ? literal : `(?:${literal})|[\\x80-\\xff]`;
		};
		nativeTools = [
			"list_funcs",
			"lookup_funcs",
			"find_regex",
			"decompile",
			"disasm",
			"callees",
			"xrefs_to"
		];
	})))();
}

//#endregion
//#region dist/ida/IdaBusyHealth.js
var BUSY_HEALTH_RETRY_MS, BUSY_TOOL_NAME, monotonicClock, busyToolName, isBusyStatus, readSettledHealth;
function init_IdaBusyHealth() {
	return (init_IdaBusyHealth = __esmMin((() => {
		init_analysisErrorCore();
		init_IdaProtocolValues();
		BUSY_HEALTH_RETRY_MS = 100;
		BUSY_TOOL_NAME = /^[A-Za-z0-9_.:-]{1,64}$/u;
		monotonicClock = {
			now: () => performance.now(),
			delay: (ms, signal) => setTimeout$1(ms, undefined, { signal })
		};
		busyToolName = (tool) => tool !== undefined && BUSY_TOOL_NAME.test(tool) ? tool : "unknown";
		isBusyStatus = (raw) => typeof raw === "object" && raw !== null && !Array.isArray(raw) && raw["status"] === "busy";
		readSettledHealth = async (connection, { database, timeoutMs, signal, clock = monotonicClock }) => {
			const started = clock.now();
			const remaining = () => timeoutMs - (clock.now() - started);
			for (;;) {
				const raw = await connection.call("server_health", { database });
				const busy = busyHealthSchema.safeParse(raw);
				if (!busy.success) {
					if (isBusyStatus(raw)) throw busy.error;
					return raw;
				}
				const expired = () => new AnalysisTimeoutError(`server_health: headless worker still busy in ${busyToolName(busy.data.busy_tool)}`, timeoutMs, { cause: raw });
				if (remaining() <= 0) throw expired();
				await clock.delay(Math.min(BUSY_HEALTH_RETRY_MS, remaining()), signal);
				signal?.throwIfAborted();
				if (remaining() <= 0) throw expired();
			}
		};
	})))();
}

//#endregion
//#region dist/ida/IdaCallGraph.js
var UNRECOGNIZED_CALLEE_LIMITATION, TRUNCATED_LIMITATION, POSSIBLY_TRUNCATED_LIMITATION, expectedReadFailure, errorReason, X86_FAMILIES, isX86OnlyTarget, unavailableCallGraph, readCallGraphCallees;
function init_IdaCallGraph() {
	return (init_IdaCallGraph = __esmMin((() => {
		init_analysisErrorCore();
		init_IdaProtocolValues();
		UNRECOGNIZED_CALLEE_LIMITATION = "This relationship read does not establish calls to targets IDA does not recognize as functions; imports and other non-function call targets remain unknown.";
		TRUNCATED_LIMITATION = "Upstream callgraph was truncated; additional callees remain unknown.";
		POSSIBLY_TRUNCATED_LIMITATION = "Upstream callgraph may be truncated; additional callees may remain unknown.";
		expectedReadFailure = (cause) => cause instanceof AnalysisProtocolError || cause instanceof AnalysisOutputError || cause instanceof ZodError;
		errorReason = (cause) => cause instanceof Error ? cause.message : "Unknown upstream read failure";
		X86_FAMILIES = new Set(["x86", "x86_64"]);
		isX86OnlyTarget = (target) => target.kind === "executable" && !(target.format === "pe" && target.managed) && X86_FAMILIES.has(target.architecture) && target.availableArchitectures.every((family) => X86_FAMILIES.has(family));
		unavailableCallGraph = (reason) => ({
			callees: [],
			limitations: [UNRECOGNIZED_CALLEE_LIMITATION, `Upstream callgraph was unavailable (${reason}); callee edges remain unknown.`],
			coverage: {
				status: "unknown",
				reason: `Upstream callgraph was unavailable (${reason}); callee edges remain unknown.`,
				diagnostics: [UNRECOGNIZED_CALLEE_LIMITATION]
			}
		});
		readCallGraphCallees = async (call, address) => {
			const raw = await call("callgraph", {
				roots: [address],
				max_depth: 0
			});
			const parsed = modernCallGraphSchema.safeParse(raw);
			const row = parsed.success ? parsed.data[0] : undefined;
			if (row === undefined) throw new AnalysisProtocolError("IDA callgraph reply was unreadable.");
			if (row.error !== undefined) throw new AnalysisProtocolError(`IDA callgraph failed: ${row.error}`);
			const rootAddress = idaAddressSchema.safeParse(row.root);
			if (!rootAddress.success || rootAddress.data !== address) throw new AnalysisProtocolError(`IDA callgraph answered for a different root than ${address}.`);
			const edges = row.edges.filter(({ type, from }) => type === "call" && from === address);
			const targets = [...new Set(edges.map(({ to }) => to))].sort((left, right) => BigInt(left) < BigInt(right) ? -1 : BigInt(left) > BigInt(right) ? 1 : 0);
			const limitations = [UNRECOGNIZED_CALLEE_LIMITATION];
			const diagnostics = [UNRECOGNIZED_CALLEE_LIMITATION];
			const coverageLimitations = [];
			const truncated = row.truncated === true || row.per_func_capped === true || (row.limit_reason ?? null) !== null;
			const saturated = row.max_edges_per_func !== undefined && edges.length >= row.max_edges_per_func;
			if (truncated) {
				limitations.push(TRUNCATED_LIMITATION);
				coverageLimitations.push(TRUNCATED_LIMITATION);
			} else if (saturated) {
				limitations.push(POSSIBLY_TRUNCATED_LIMITATION);
				coverageLimitations.push(POSSIBLY_TRUNCATED_LIMITATION);
			}
			const names = new Map();
			if (targets.length > 0) {
				try {
					const raw = await call("lookup_funcs", { queries: targets });
					const parsed = modernLookupBatchSchema.safeParse(raw);
					if (!parsed.success) {
						const limitation = "IDA observed callee addresses but returned an unreadable name lookup result; the addresses are retained.";
						limitations.push(limitation);
						diagnostics.push(limitation);
					} else {
						const rows = new Map();
						for (const item of parsed.data) {
							const query = idaAddressSchema.safeParse(item.query);
							if (!query.success || !targets.includes(query.data)) continue;
							rows.set(query.data, rows.has(query.data) ? null : item);
						}
						for (const target of targets) {
							const item = rows.get(target);
							if (item?.fn?.address === target && item.error === null) names.set(target, item.fn.name);
							else {
								const limitation = `IDA observed callee address ${target} but could not resolve its name${item?.error == null ? "" : `: ${item.error}`}; the address is retained.`;
								limitations.push(limitation);
								diagnostics.push(limitation);
							}
						}
					}
				} catch (cause) {
					if (cause instanceof AnalysisCancelledError) throw cause;
					if (!expectedReadFailure(cause)) throw cause;
					const limitation = `IDA observed callee addresses but the name lookup failed (${errorReason(cause)}); the addresses are retained.`;
					limitations.push(limitation);
					diagnostics.push(limitation);
				}
			}
			return {
				callees: targets.map((to) => {
					return {
						address: to,
						name: names.get(to) ?? to
					};
				}),
				limitations,
				coverage: {
					...coverageLimitations.length === 0 ? { status: "complete" } : {
						status: "partial",
						limitations: coverageLimitations
					},
					diagnostics
				}
			};
		};
	})))();
}

//#endregion
//#region dist/ida/IdaOperationRunner.js
var unknownBody, identity, MISSING_PROCEDURE_ANSWERS, lines, searchQuerySchema, IdaOperationRunner;
function init_IdaOperationRunner() {
	return (init_IdaOperationRunner = __esmMin((() => {
		init_IdaNativeProtocol();
		init_analysisSearchContract();
		init_analysisErrorCore();
		init_hopperValues();
		init_functionCallCoverage();
		init_IdaCallGraph();
		init_IdaProviderCapabilities();
		init_IdaProtocolValues();
		unknownBody = {
			available: false,
			reason: "IDA MCP does not report complete function body ranges."
		};
		identity = (fn) => ({
			address: fn.address,
			name: fn.name,
			classification: null,
			body: unknownBody
		});
		MISSING_PROCEDURE_ANSWERS = new Set(["Not found", "Not a function"]);
		lines = (asm) => asm.lines.map(({ address, instruction }) => `${address}: ${instruction}`);
		searchQuerySchema = z.object(analysisSearchInput);
		IdaOperationRunner = class {
			connection;
			protocol;
			database;
			options;
			raw = [];
			locations = [];
			limitations = [];
			relationshipCoverage;
			/** The upstream cap flag of the last `xrefs_to` read, when the producer reported one. */
			referencesTruncated;
			constructor(connection, protocol, database, options = {}) {
				this.connection = connection;
				this.protocol = protocol;
				this.database = database;
				this.options = options;
			}
			async call(tool, args) {
				if (this.options.signal?.aborted) throw new AnalysisCancelledError(tool);
				const scoped = this.database === undefined ? args : {
					...args,
					database: this.database
				};
				const result = await this.connection.call(tool, scoped);
				this.raw.push({
					tool,
					arguments: scoped,
					result
				});
				if (this.options.signal?.aborted) throw new AnalysisCancelledError(tool);
				return result;
			}
			async functions() {
				const result = [];
				let offset = 0;
				while (offset !== null) {
					const current = offset;
					const value = this.protocol === "legacy" ? legacyPageSchema.parse(await this.call("list_functions", {
						offset,
						count: 100
					})) : modernPageSchema.parse(await this.call("list_funcs", { queries: {
						offset,
						count: 100
					} }))[0];
					if (value === undefined) throw new AnalysisProtocolError("IDA MCP omitted its function page.");
					result.push(...value.data.map((fn) => idaFunctionSchema.parse(fn)));
					offset = value.next_offset;
					if (offset !== null && offset <= current) throw new AnalysisProtocolError("IDA MCP function pagination did not advance.");
				}
				return result;
			}
			/**
			* Resolves a procedure. When `requestedBy` names the caller's operation, an
			* upstream "not found" or "not a function" answer is reported as invalid
			* input; every other failed lookup stays a producer fault. `run()` passes
			* `requestedBy` only for caller-supplied selectors. Provider-derived
			* selectors, such as the addresses composed workflows revisit, and the
			* callee resolution inside `relationships()` pass none, because those
			* addresses were reported by IDA itself.
			*/
			async resolve(query, requestedBy) {
				if (this.protocol !== "legacy") {
					const item = modernLookupSchema.parse(await this.call("lookup_funcs", { queries: [query] }))[0];
					return this.lookupFunction(query, item, requestedBy);
				}
				const address = idaAddressSchema.safeParse(/^0x/iu.test(query) ? query : undefined);
				const found = idaFunctionSchema.parse(await this.call(address.success ? "get_function_by_address" : "get_function_by_name", address.success ? { address: address.data } : { name: query }));
				const entry = idaFunctionSchema.parse(await this.call("get_function_by_name", { name: found.name }));
				if (entry.name !== found.name) throw new AnalysisProtocolError("IDA function identity changed during lookup.");
				return entry;
			}
			/** Parse one lookup row: a function, an expected "missing" answer, or a producer failure. */
			lookupOutcome(query, item) {
				if (item?.query !== query) throw new AnalysisProtocolError(`IDA function lookup answered for a different query than ${JSON.stringify(query)}.`);
				if (item.fn === null && item.error !== null && MISSING_PROCEDURE_ANSWERS.has(item.error)) return { missing: item.error };
				if (item.fn === null || item.error !== null) throw new AnalysisProtocolError(`IDA function lookup failed for ${query}: ${item.error ?? "missing function"}`);
				return { fn: item.fn };
			}
			lookupFunction(query, item, requestedBy) {
				const outcome = this.lookupOutcome(query, item);
				if ("fn" in outcome) return outcome.fn;
				if (requestedBy === undefined) throw new AnalysisProtocolError(`IDA function lookup failed for ${query}: ${outcome.missing}`);
				throw new AnalysisInputError(requestedBy, { cause: new AnalysisProtocolError(`IDA function lookup failed for ${query}: ${outcome.missing}`) }, [{
					path: [],
					reason: "invalid_value",
					message: `IDA could not resolve procedure ${JSON.stringify(query)}: ${outcome.missing}.`
				}]);
			}
			/** The containing function of an address, or why none contains it. */
			async containingProcedure(address) {
				const item = modernLookupSchema.parse(await this.call("lookup_funcs", { queries: [address] }))[0];
				const outcome = this.lookupOutcome(address, item);
				if ("fn" in outcome) return {
					query_address: address,
					found: true,
					procedure: identity(outcome.fn)
				};
				return {
					query_address: address,
					found: false,
					procedure: null,
					reason: await this.addressInSegment(address) ? "not_in_procedure" : "outside_segments"
				};
			}
			/** Segment membership from the database-scoped minimal survey; a missing fact is a failure. */
			async addressInSegment(address) {
				if (this.options.surveyAvailable === false) throw new AnalysisProtocolError("The upstream server does not advertise survey_binary, so segment membership cannot be established.");
				const { segments } = surveySegmentsSchema.parse(await this.call("survey_binary", { detail_level: "minimal" }));
				const value = BigInt(address);
				return segments.some(({ start, end }) => start <= value && value < end);
			}
			/** True only for modern callee reads on targets not proven x86-only; x86 reads never reach the graph code. */
			readsCallGraph(direction) {
				return this.protocol === "modern" && direction === "callees" && this.options.x86Only === false;
			}
			/** Add processor-neutral function callees on targets where upstream `callees` is unsound. */
			async addCallGraphCallees(fn, result) {
				const graph = this.options.callGraphAvailable === false ? unavailableCallGraph("the upstream server does not advertise it") : await readCallGraphCallees((tool, args) => this.call(tool, args), fn.address);
				this.limitations.push(...graph.limitations);
				for (const callee of graph.callees) if (!result.has(callee.address)) result.set(callee.address, identity({
					...callee,
					size: "unknown"
				}));
				return graph.coverage;
			}
			async strings(nativePattern) {
				if (this.protocol === "native") this.limitations.push(IDA_NATIVE_STRING_LIMITATION);
				const result = [];
				let offset = 0;
				while (offset !== null) {
					const current = offset;
					if (this.protocol === "legacy") {
						const page = legacyPageSchema.parse(await this.call("list_strings", {
							offset,
							count: 0
						}));
						for (const item of page.data) {
							const s = legacyStringSchema.parse(item);
							result.push({
								address: s.address,
								value: s.string
							});
						}
						offset = page.next_offset;
					} else {
						const page = (this.protocol === "native" ? nativeStringsSchema : modernStringsSchema).parse(await this.call("find_regex", {
							pattern: this.protocol === "native" ? nativePattern ?? "[\\s\\S]*" : "(?s).*",
							offset,
							limit: 100
						}));
						result.push(...page.matches.map((s) => ({
							address: s.addr,
							value: s.string
						})));
						offset = nextOffset(page.cursor, current);
					}
					if (offset !== null && offset <= current) throw new AnalysisProtocolError("IDA MCP string pagination did not advance.");
				}
				return result;
			}
			async assembly(fn) {
				if (this.protocol === "legacy") {
					const result = disassemblySchema.parse(await this.call("disassemble_function", { start_address: fn.address }));
					this.verifyAssembly(fn, result);
					return result;
				}
				let result;
				let offset = 0;
				while (offset !== null) {
					const page = (this.protocol === "native" ? nativeDisassemblySchema : modernDisassemblySchema).parse(await this.call("disasm", {
						addr: fn.address,
						offset,
						max_instructions: 100
					}));
					if (page.asm === null || page.error !== undefined) throw new AnalysisProtocolError(`IDA disassembly failed: ${page.error ?? "missing assembly"}`);
					this.verifyAssembly(fn, page.asm);
					if (result === undefined) result = page.asm;
					else result.lines.push(...page.asm.lines);
					offset = nextOffset(page.cursor, offset);
				}
				if (result === undefined) throw new AnalysisProtocolError("IDA omitted assembly.");
				return result;
			}
			verifyAssembly(fn, asm) {
				if (asm.start_ea !== fn.address || asm.name !== fn.name) throw new AnalysisProtocolError("IDA disassembly identifies a different function than the resolved entry.");
			}
			async pseudocode(fn) {
				if (this.protocol === "legacy") return z.string().nullable().parse(await this.call("decompile_function", { address: fn.address }));
				if (this.protocol === "native") {
					const page = nativeDecompileSchema.parse(await this.call("decompile", { addr: fn.address }));
					if (page.addr !== fn.address) throw new AnalysisProtocolError("Native IDA pseudocode identifies a different function than the resolved entry.");
					if (!page.ok || page.error !== undefined || page.pseudocode === undefined) throw new AnalysisProtocolError(`Native IDA decompilation failed: ${page.error ?? "missing pseudocode"}`);
					this.limitations.push("Native pseudocode is rendered GUI text; the upstream viewer traversal is bounded and does not establish complete source recovery.");
					return page.pseudocode;
				}
				const result = [];
				let offset = 0;
				while (offset !== null) {
					const page = modernDecompileSchema.parse(await this.call("decompile", {
						addr: fn.address,
						offset,
						max_lines: 100
					}));
					if (page.code === null || page.error !== undefined) throw new AnalysisProtocolError(`IDA decompilation failed: ${page.error ?? "missing code"}`);
					result.push(page.code);
					offset = nextOffset(page.cursor, offset);
				}
				return result.join("\n");
			}
			async xrefs(address) {
				if (this.protocol === "legacy") return legacyXrefsSchema.parse(await this.call("get_xrefs_to", { address }));
				const page = (this.protocol === "native" ? nativeXrefsSchema : modernXrefsSchema).parse(await this.call("xrefs_to", {
					addrs: [address],
					limit: 1e3
				}))[0];
				if (page?.xrefs == null || page.error !== undefined) throw new AnalysisProtocolError(`IDA xrefs failed: ${page?.error ?? "missing references"}`);
				if (page.more !== undefined) this.referencesTruncated = page.more;
				if (page.more === true) this.limitations.push("Upstream xrefs_to capped results at 1000 references; additional references remain unknown.");
				return page.xrefs.map((xref) => ({
					address: xref.addr,
					type: xref.type,
					function: xref.fn
				}));
			}
			async relationships(fn, direction) {
				const queries = [];
				const result = new Map();
				let coverage = {
					status: "unknown",
					reason: "The legacy relationship response does not report coverage."
				};
				if (this.readsCallGraph(direction)) {
					coverage = await this.addCallGraphCallees(fn, result);
					return {
						items: [...result.values()],
						coverage,
						availability: coverage.status === "unknown" ? {
							available: false,
							reason: coverage.reason
						} : { available: true }
					};
				}
				if (this.protocol === "legacy") {
					const value = await this.call(direction === "callers" ? "get_callers" : "get_callees", { function_address: fn.address });
					const items = direction === "callers" ? z.array(idaFunctionSchema).parse(value) : legacyCalleesSchema.parse(value);
					for (const item of items) {
						if ("type" in item && item.type === "external") result.set(item.address, identity({
							...item,
							size: "unknown"
						}));
						else queries.push(item.name);
					}
				} else if (direction === "callers") {
					this.limitations.push("Upstream xrefs classify references as code or data, without proving call edges. Direct callers are unavailable in this profile.");
					return {
						items: [],
						availability: {
							available: false,
							reason: "Upstream xrefs do not establish direct caller relationships."
						},
						coverage: {
							status: "unknown",
							reason: "Upstream xrefs do not establish direct caller relationships."
						}
					};
				} else {
					const page = (this.protocol === "native" ? nativeCalleesSchema : modernCalleesSchema).parse(await this.call("callees", {
						addrs: [fn.address],
						limit: 500
					}))[0];
					if (page?.callees == null || page.error !== undefined) throw new AnalysisProtocolError(`IDA callees failed: ${page?.error ?? "missing callees"}`);
					if (page.more === true) this.limitations.push("Upstream callees capped results at 500; additional callees remain unknown.");
					coverage = page.more === true ? {
						status: "partial",
						limitations: ["Upstream callees capped results at 500; additional callees remain unknown."]
					} : { status: "complete" };
					for (const item of page.callees) {
						if ("type" in item && item.type === "external") result.set(item.addr, identity({
							address: item.addr,
							name: item.name,
							size: "unknown"
						}));
						else queries.push(item.addr);
					}
				}
				const querySet = new Set(queries);
				if (this.protocol === "native" && querySet.size > 0) {
					const rows = modernLookupBatchSchema.parse(await this.call("lookup_funcs", { queries: [...querySet] }));
					const byQuery = new Map(rows.map((row) => [row.query, row]));
					if (rows.length !== querySet.size || byQuery.size !== rows.length || rows.some((row) => !querySet.has(row.query))) throw new AnalysisProtocolError("Native IDA returned an inconsistent callee lookup batch.");
					for (const query of querySet) {
						const resolved = identity(this.lookupFunction(query, byQuery.get(query)));
						result.set(resolved.address, resolved);
					}
				} else {
					for (const query of querySet) {
						const resolved = identity(await this.resolve(query));
						result.set(resolved.address, resolved);
					}
				}
				return {
					items: [...result.values()],
					coverage,
					availability: { available: true }
				};
			}
			async run(operation, parameters) {
				const query = operation === "search_procedures" || operation === "search_strings" ? searchQuerySchema.parse(parameters) : undefined;
				const matches = query === undefined ? undefined : this.searchPredicate(query);
				if (operation === "list_procedures" || operation === "search_procedures") {
					const items = (await this.functions()).map((fn) => ({
						address: fn.address,
						value: fn.name
					}));
					return matches === undefined ? items : items.filter(({ value }) => matches(value));
				}
				if (operation === "list_strings" || operation === "search_strings") {
					const nativePattern = this.protocol === "native" && query?.mode === "literal" ? nativeLiteralSearchPattern(query.pattern, query.case_sensitive) : undefined;
					const items = await this.strings(nativePattern);
					return matches !== undefined ? items.filter(({ value }) => matches(value)) : parameters.address === undefined ? items : items.filter(({ address }) => address === idaAddressSchema.parse(parameters.address));
				}
				if (operation === "list_documents") {
					if (this.options.admittedDocument === undefined) throw new AnalysisProtocolError("The admitted IDA program is unknown.");
					return [this.options.admittedDocument];
				}
				if (operation === "resolve_containing_procedure") {
					const queried = idaAddressSchema.parse(parameters.address);
					this.locations.push({
						kind: "address",
						address: queried
					});
					return this.containingProcedure(queried);
				}
				if (operation === "xrefs") {
					const inspectedAddress = idaAddressSchema.parse(parameters.address);
					this.locations.push({
						kind: "address",
						address: inspectedAddress
					});
					return (await this.xrefs(inspectedAddress)).map(({ address }) => address);
				}
				const fn = await this.resolve(z.string().min(1).parse(parameters.procedure), this.options.selectorOrigin === "provider" ? undefined : operation);
				this.locations.push({
					kind: "address",
					address: fn.address
				});
				switch (operation) {
					case "procedure_address": return fn.address;
					case "procedure_pseudo_code": return this.pseudocode(fn);
					case "procedure_assembly": return lines(await this.assembly(fn)).join("\n");
					case "procedure_callers":
					case "procedure_callees": {
						if (operation === "procedure_callers" && this.protocol !== "legacy") throw new AnalysisProtocolError("This IDA MCP profile cannot distinguish direct callers from other code references.");
						const relationships = await this.relationships(fn, operation === "procedure_callers" ? "callers" : "callees");
						this.relationshipCoverage = relationships.coverage;
						return relationships.items.map(({ address }) => address);
					}
					case "read_function_instructions": return functionInstructionWindowSchema.parse({
						procedure: identity(fn),
						instructions: lines(await this.assembly(fn)),
						limitations: IDA_LIMITATIONS
					});
					case "analyze_function": return this.dossier(fn);
				}
			}
			searchPredicate(query) {
				let matches;
				if (query.mode === "regex") {
					try {
						const regex = new RegExp(query.pattern, query.case_sensitive ? "u" : "iu");
						matches = (value) => regex.test(value);
					} catch (cause) {
						throw new AnalysisInputError("search", { cause });
					}
				} else {
					const needle = query.case_sensitive ? query.pattern : query.pattern.toLowerCase();
					matches = (value) => (query.case_sensitive ? value : value.toLowerCase()).includes(needle);
				}
				return matches;
			}
			async dossier(fn) {
				const asm = await this.assembly(fn);
				const pseudocode = await this.pseudocode(fn);
				const callers = await this.relationships(fn, "callers");
				const callees = await this.relationships(fn, "callees");
				this.relationshipCoverage = combineFunctionRelationshipCoverage(callers.coverage, callees.coverage);
				const signature = asm.return_type == null || asm.arguments == null ? null : `${asm.return_type} ${fn.name}(${asm.arguments.map((arg) => `${arg.type} ${arg.name}`).join(", ")})`;
				return functionDossierSchema.parse({
					procedure: {
						...identity(fn),
						signature,
						locals: []
					},
					pseudocode: pseudocode ?? "",
					assembly: lines(asm),
					comments: [],
					callers: callers.items,
					callees: callees.items,
					incoming_references: [],
					outgoing_references: [],
					referenced_strings: [],
					referenced_names: [],
					basic_blocks: [],
					native_api: null,
					native_value_flow: null,
					facet_availability: {
						pseudocode: pseudocode === null ? {
							available: false,
							reason: "IDA did not supply pseudocode."
						} : { available: true },
						assembly: { available: true },
						comments: {
							available: false,
							reason: "IDA adapter does not expose typed comments."
						},
						callers: callers.availability,
						callees: callees.availability,
						references: {
							available: false,
							reason: "IDA adapter does not expose typed reference edges."
						},
						strings_names: {
							available: false,
							reason: "IDA adapter does not expose function-referenced strings and names."
						},
						cfg: {
							available: false,
							reason: "IDA adapter does not expose basic blocks."
						}
					},
					limitations: [
						...IDA_LIMITATIONS,
						...this.limitations,
						"Stack frame records are not evidence of source locals. Rendered comments do not identify regular versus inline origin.",
						...pseudocode === null ? ["Pseudocode is unavailable."] : []
					]
				});
			}
		};
	})))();
}

//#endregion
//#region dist/ida/IdaWorkspace.js
var idaFileDigest, sameIdaHostPath, IdaWorkspace;
function init_IdaWorkspace() {
	return (init_IdaWorkspace = __esmMin((() => {
		init_analysisErrorCore();
		init_PrivateRuntimeRoot();
		idaFileDigest = async (path) => {
			const hash = createHash("sha256");
			for await (const chunk of createReadStream(path)) hash.update(chunk);
			return hash.digest("hex");
		};
		sameIdaHostPath = (left, right) => process.platform === "win32" ? normalize(left).toLowerCase() === normalize(right).toLowerCase() : normalize(left) === normalize(right);
		IdaWorkspace = class IdaWorkspace {
			runtime;
			inputPath;
			target;
			sessionId = `rea-${randomUUID()}`;
			#inputSha256;
			constructor(runtime, inputPath, target) {
				this.runtime = runtime;
				this.inputPath = inputPath;
				this.target = target;
			}
			/** Filesystem root owned exclusively by this headless session. */
			get directory() {
				return this.runtime.path;
			}
			/** SHA-256 of the private input bytes copyInput admitted; undefined until prepared. */
			get inputSha256() {
				return this.#inputSha256;
			}
			/** Allocate a protected workspace so its owner can retain it before input preparation. */
			static async allocate(target, root = tmpdir()) {
				const runtime = await PrivateRuntimeRoot.create({
					parent: await realpath(normalize(root)),
					prefix: "rea-ida-"
				});
				const inputPath = join(runtime.path, basename(target.path));
				return new IdaWorkspace(runtime, inputPath, target);
			}
			/**
			* Copy and verify admitted bytes after the session owns this workspace's
			* cleanup. Universal Mach-O containers are thinned to the selected slice so
			* the upstream engine analyzes the architecture admission reported; the
			* whole-source digest still anchors the copy against admission-time changes.
			*/
			async copyInput() {
				const slice = this.target.format === "mach-o-universal" ? this.target.universalSlice : undefined;
				const source = await open(this.target.path, "r");
				try {
					const input = await open(this.inputPath, "wx");
					try {
						const sourceHash = createHash("sha256");
						const inputHash = createHash("sha256");
						const chunk = Buffer.allocUnsafe(64 * 1024);
						let position = 0;
						for (;;) {
							const observed = await source.read(chunk, 0, chunk.length, position);
							if (observed.bytesRead === 0) break;
							const bytes = chunk.subarray(0, observed.bytesRead);
							sourceHash.update(bytes);
							const start = slice === undefined ? position : Math.max(position, slice.offset);
							const end = slice === undefined ? position + bytes.length : Math.min(position + bytes.length, slice.offset + slice.size);
							if (end > start) {
								const admitted = bytes.subarray(start - position, end - position);
								inputHash.update(admitted);
								await input.write(admitted);
							}
							position += observed.bytesRead;
						}
						if (sourceHash.digest("hex") !== this.target.sha256) throw new AnalysisProtocolError("IDA target changed between admission and the private input copy; reopen the target.");
						this.#inputSha256 = inputHash.digest("hex");
					} finally {
						await input.close();
					}
				} finally {
					await source.close();
				}
			}
			/** Delete only this object's privately allocated directory after worker cleanup. */
			async remove() {
				await this.runtime.close();
			}
		};
	})))();
}

//#endregion
//#region dist/ida/IdaInput.js
var parseIdaInput;
function init_IdaInput() {
	return (init_IdaInput = __esmMin((() => {
		init_toolContracts();
		init_analysisErrorCore();
		init_jsonValue();
		init_result();
		init_IdaProtocolValues();
		init_inputIssueProjection();
		parseIdaInput = (operation, parameters) => {
			const contract = TOOL_CONTRACTS.find(({ name }) => name === operation);
			const parsed = contract?.inputSchema.safeParse(parameters);
			if (parsed?.success !== true) return err(new AnalysisInputError(operation, { cause: parsed?.error }, parsed?.error === undefined ? [] : projectInputIssues(parsed.error.issues, parameters)));
			if (operation === "xrefs" && typeof parameters.address !== "string") return err(new AnalysisInputError(operation, undefined, [{
				path: ["address"],
				reason: "missing_argument",
				message: "IDA requires an explicit hexadecimal address."
			}]));
			if (parameters.address !== undefined && !idaAddressSchema.safeParse(parameters.address).success) return err(new AnalysisInputError(operation, undefined, [{
				path: ["address"],
				reason: "invalid_format",
				message: "IDA requires a hexadecimal address."
			}]));
			if (typeof parameters.procedure === "string" && parameters.procedure.length === 0) return err(new AnalysisInputError(operation, undefined, [{
				path: ["procedure"],
				reason: "invalid_value",
				message: "Supply a function name or address."
			}]));
			if (parameters.mode === "regex" && typeof parameters.pattern === "string") {
				try {
					new RegExp(parameters.pattern, parameters.case_sensitive === true ? "u" : "iu");
				} catch (cause) {
					return err(new AnalysisInputError(operation, { cause }, [{
						path: ["pattern"],
						reason: "invalid_format",
						message: "Supply a valid regular expression."
					}]));
				}
			}
			return ok(jsonObjectSchema.parse(parsed.data));
		};
	})))();
}

//#endregion
//#region dist/ida/IdaSessionClient.js
var legacyTools, modernTools, operationSet, isIdaOperation, wasCancelled, IdaCleanupError, IdaSessionClient;
function init_IdaSessionClient() {
	return (init_IdaSessionClient = __esmMin((() => {
		init_AbortablePromise();
		init_AnalysisProvider();
		init_analysisErrorCore();
		init_analysisErrorBase();
		init_providerAdapterError();
		init_jsonValue();
		init_result();
		init_IdaConfiguration();
		init_IdaNativeProtocol();
		init_IdaBusyHealth();
		init_IdaCallGraph();
		init_IdaOperationRunner();
		init_IdaProviderCapabilities();
		init_IdaProtocolValues();
		init_IdaWorkspace();
		init_IdaInput();
		init_evidence();
		legacyTools = [
			"get_metadata",
			"list_functions",
			"list_strings",
			"get_function_by_name",
			"get_function_by_address",
			"decompile_function",
			"disassemble_function",
			"get_callers",
			"get_callees",
			"get_xrefs_to"
		];
		modernTools = [
			"idb_open",
			"idb_list",
			"idb_close",
			"server_health",
			"list_funcs",
			"lookup_funcs",
			"find_regex",
			"decompile",
			"disasm",
			"callees",
			"xrefs_to"
		];
		operationSet = new Set(IDA_OPERATIONS);
		isIdaOperation = (operation) => operationSet.has(operation);
		wasCancelled = (options) => options?.signal?.aborted === true;
		IdaCleanupError = class extends ProviderAdapterError {
			cleanupIncomplete = true;
			cleanupResources;
			constructor(path, cause, sessions) {
				super("ida", "close", {
					cause,
					capturedOutput: cause instanceof AnalysisError ? cause.capturedOutput : undefined,
					diagnostics: {
						...cause instanceof AnalysisError ? cause.diagnostics : undefined,
						reason: "IDA cleanup could not be verified; the remaining connection or private workspace is retained for retry.",
						failure_reason: cause instanceof AnalysisError ? cause.diagnostics?.reason ?? cause.message : cause instanceof Error ? cause.message : String(cause),
						workspace: path,
						...sessions === undefined ? {} : { upstream_sessions: {
							state: "unverified",
							sessions: sessions.map(({ session_id, backend, owned, input_path, is_active }) => ({
								session_id,
								backend,
								owned,
								input_path,
								is_active
							})),
							reason: "Release of upstream sessions matching the requested session ID or private input was not confirmed; input_path preserves the last observed binding and is null when no inventory has reported it. is_active preserves registry activity and is null when unknown; it does not establish process liveness. A worker outlives its supervisor and may keep running until it finishes and reaches its idle timeout; exiting REA does not stop it. A gui session belongs to an IDA instance REA does not control. An empty session_id means upstream reported none; owned is null when no inventory has reported ownership; an empty list means the requested worker's close was confirmed but no inventory has identified any remaining session."
						} }
					}
				});
				this.cleanupResources = [path];
			}
		};
		IdaSessionClient = class {
			config;
			target;
			connection;
			profile;
			#tail = Promise.resolve();
			#startup;
			#closed = false;
			#closing = false;
			#closePromise;
			#workspace;
			#database;
			#databaseCloseCompleted = false;
			#openAttempted = false;
			#openCompleted = false;
			#ready = false;
			#blockingSessions;
			#openRejected = false;
			#callGraphAdvertised = false;
			#surveyAdvertised = false;
			#initialIdentity;
			#metadata = null;
			#lifecycle = [];
			constructor(config, target, connection, profile) {
				this.config = config;
				this.target = target;
				this.connection = connection;
				this.profile = profile;
			}
			execute(operation, parameters, options) {
				const call = this.#tail.then(() => this.#execute(operation, parameters, options));
				this.#tail = call.then(() => undefined, () => undefined);
				return call;
			}
			async executeIfReady(operation, parameters, options) {
				if (!this.#ready || this.#closed || this.#closing) return Promise.resolve(undefined);
				const call = this.#tail.then(() => {
					if (!this.#ready || this.#closed || this.#closing) return undefined;
					if (wasCancelled(options)) return err(new AnalysisCancelledError(operation));
					return this.#execute(operation, parameters, options, true);
				});
				this.#tail = call.then(() => undefined, () => undefined);
				const result = await waitForAbortable(call, options?.signal);
				return result === ABORTED ? err(new AnalysisCancelledError(operation)) : result;
			}
			async #execute(operation, parameters, options, readyOnly = false) {
				if (this.#closed || this.#closing) return err(new AnalysisProtocolError("IDA session is closing or closed; reopen the target."));
				if (wasCancelled(options)) return err(new AnalysisCancelledError(operation));
				if (operation !== "health" && !isIdaOperation(operation)) return err(new AnalysisCapabilityUnavailableError("ida", operation, "This integration admits read-only analysis operations only."));
				if (operation !== "health" && !idaProfileAdmits(operation, this.config.mode)) return err(new AnalysisCapabilityUnavailableError("ida", operation, "This operation is available for the modern headless profile only."));
				if (operation === "procedure_callers" && idaProtocol(this.config) !== "legacy") return err(new AnalysisCapabilityUnavailableError("ida", operation, "This upstream profile does not prove direct callers."));
				if (operation !== "health") {
					const parsed = parseIdaInput(operation, parameters);
					if (!parsed.ok) return parsed;
					parameters = parsed.value;
				}
				const document = parameters.document;
				if (document !== undefined && (typeof document !== "string" || !sameIdaHostPath(document, this.target.path) && (this.target.sourcePath === undefined || !sameIdaHostPath(document, this.target.sourcePath)))) return err(new AnalysisInputError(operation, undefined, [{
					path: ["document"],
					reason: "invalid_value",
					expected: this.target.path,
					message: "IDA document must be the REA-bound target; omit document or use its admitted path."
				}]));
				const failureContext = {
					runner: undefined,
					metadataBefore: undefined,
					metadataAfter: undefined,
					postOperationIdentityCheck: "not_attempted",
					parameters
				};
				try {
					if (!readyOnly) await this.#start();
					const before = await this.#observe(options);
					failureContext.metadataBefore = before;
					if (wasCancelled(options)) throw new AnalysisCancelledError(operation);
					if (operation === "health") return this.#health(before);
					if (!isIdaOperation(operation)) throw new AnalysisProtocolError("IDA operation changed after validation.");
					const runner = this.#runner(options);
					failureContext.runner = runner;
					const result = await runner.run(operation, parameters);
					if (wasCancelled(options)) throw new AnalysisCancelledError(operation);
					failureContext.postOperationIdentityCheck = "started";
					const after = await this.#observe(options, (observed) => failureContext.metadataAfter = observed);
					failureContext.postOperationIdentityCheck = "verified";
					if (wasCancelled(options)) throw new AnalysisCancelledError(operation);
					return ok(createAnalysisExecution(result, IDA_PROVIDER_IDENTITY, {
						rawResult: {
							upstream: this.connection.serverInfo(),
							metadata_before: before,
							metadata_after: after,
							observations: jsonValueSchema.parse(runner.raw)
						},
						limitations: [...IDA_LIMITATIONS, ...runner.limitations],
						...runner.relationshipCoverage === undefined ? {} : { relationshipCoverage: runner.relationshipCoverage },
						...runner.referencesTruncated !== undefined ? { referencesTruncated: runner.referencesTruncated } : {},
						locations: [{
							kind: "artifact-path",
							path: this.target.path
						}, ...runner.locations],
						...this.profile === undefined ? {} : { analysisProfile: this.profile }
					}));
				} catch (cause) {
					return this.#failure(operation, cause, options, failureContext);
				}
			}
			#runner(options) {
				return new IdaOperationRunner(this.connection, idaProtocol(this.config), this.#database, {
					signal: options?.signal,
					selectorOrigin: options?.selectorOrigin,
					x86Only: isX86OnlyTarget(this.target),
					callGraphAvailable: this.#callGraphAdvertised,
					surveyAvailable: this.#surveyAdvertised,
					admittedDocument: this.target.path
				});
			}
			#health(metadata) {
				return ok(createAnalysisExecution({
					ready: true,
					mode: this.config.mode,
					database: this.#database ?? null,
					upstream: this.connection.serverInfo(),
					metadata,
					lifecycle: this.#lifecycle
				}, IDA_PROVIDER_IDENTITY, {
					limitations: IDA_LIMITATIONS,
					...this.profile === undefined ? {} : { analysisProfile: this.profile }
				}));
			}
			#failure(operation, cause, options, context) {
				let failure;
				if (wasCancelled(options)) failure = new AnalysisCancelledError(operation, {
					cause,
					...cause instanceof AnalysisError ? {
						capturedOutput: cause.capturedOutput,
						diagnostics: cause.diagnostics,
						partialObservation: cause.partialObservation,
						cleanup: cause.cleanup ?? (cause.cleanupIncomplete ? {
							reason: cause.message,
							resources: cause.cleanupResources
						} : undefined)
					} : {}
				});
				else if (cause instanceof ProviderAdapterError && cause.operation === "transport") failure = new ProviderAdapterError("ida", operation, {
					cause,
					capturedOutput: cause.capturedOutput,
					partialObservation: cause.partialObservation,
					cleanup: cause.cleanup,
					diagnostics: {
						...cause.diagnostics,
						recovery: "Check the configured upstream MCP registration and selected target; see docs/ida-provider.md."
					}
				});
				else if (cause instanceof AnalysisError && (cause.partialObservation !== undefined || cause.cleanupIncomplete || cause.capturedOutput !== undefined)) failure = cause;
				else if (cause instanceof AnalysisError) failure = cause;
				else if (cause instanceof z.ZodError) failure = new AnalysisOutputError(operation, `IDA MCP returned malformed or unsupported producer data: ${cause.issues.map((issue) => `${issue.path.join(".") || "$"}: ${issue.message}`).join("; ")}`, { cause });
				else failure = new ProviderAdapterError("ida", operation, {
					cause,
					diagnostics: {
						reason: cause instanceof Error ? cause.message : "Unknown upstream failure",
						recovery: "Check the configured upstream MCP registration and selected target; see docs/ida-provider.md."
					}
				});
				const { runner, metadataBefore, metadataAfter } = context;
				if (runner !== undefined && runner.raw.length > 0 && metadataBefore !== undefined) {
					const observations = jsonValueSchema.parse(runner.raw);
					const upstream = this.connection.serverInfo();
					const binding = context.postOperationIdentityCheck !== "verified" ? {
						status: "not_verified",
						reason: cause instanceof Error ? cause.message : "Post-operation target identity was not observed."
					} : { status: "verified" };
					failure.retainPartialObservation(createEvidence(this.target, IDA_PROVIDER_IDENTITY, {
						predicateType: "analysis-observation",
						operation,
						parameters: context.parameters,
						result: {
							status: "partial",
							failed_operation: operation,
							observations,
							metadata_before: metadataBefore,
							target_binding: binding,
							...metadataAfter === undefined ? {} : { metadata_after: metadataAfter }
						},
						rawResult: {
							upstream,
							observations,
							metadata_before: metadataBefore,
							...metadataAfter === undefined ? {} : { metadata_after: metadataAfter },
							post_operation_identity_check: context.postOperationIdentityCheck
						},
						confidence: "observed",
						authority: "external-service",
						limitations: [
							...IDA_LIMITATIONS,
							...runner.limitations,
							"The requested IDA operation failed after these completed upstream replies; the partial Evidence does not establish a complete result.",
							"Replies are bound to the selected target only by the pre-operation identity check unless post_operation_identity_check is verified."
						],
						locations: [{
							kind: "artifact-path",
							path: this.target.path
						}, ...runner.locations]
					}));
				}
				return err(failure);
			}
			#start() {
				this.#startup ??= this.#initialize();
				return this.#startup;
			}
			async #initialize() {
				const tools = new Set(await this.connection.connect());
				this.#callGraphAdvertised = tools.has("callgraph");
				this.#surveyAdvertised = tools.has("survey_binary");
				const expected = this.config.protocol === "native" ? nativeTools : this.config.mode === "attached" ? legacyTools : modernTools;
				const missing = expected.filter((name) => !tools.has(name));
				if (missing.length > 0) {
					const summary = `IDA MCP ${this.config.protocol === "native" ? "native attached" : this.config.mode} compatibility profile is missing tools: ${missing.join(", ")}. Native attached mode requires the native IDA MCP tool catalog; legacy attached mode requires the legacy 1.4 profile; headless mode requires the database supervisor profile. See docs/ida-provider.md.`;
					throw new ProviderAdapterError("ida", "initialize", {
						userMessage: summary,
						diagnostics: {
							reason: summary,
							mode: this.config.mode,
							expected_profile: this.config.protocol === "native" ? "native" : this.config.mode === "attached" ? "legacy-1.4" : "database-supervisor",
							missing_tools: [...missing],
							recovery: "Install an IDA MCP build that serves the selected profile; see docs/ida-provider.md."
						}
					});
				}
				if (this.config.mode === "headless") {
					this.#workspace = await IdaWorkspace.allocate(this.target, this.config.workspaceRoot);
					await this.#workspace.copyInput();
					this.#openAttempted = true;
					const raw = await this.connection.call("idb_open", {
						input_path: this.#workspace.inputPath,
						mode: "force_headless",
						run_auto_analysis: true,
						build_caches: true,
						init_hexrays: true,
						preferred_session_id: this.#workspace.sessionId
					});
					this.#openCompleted = true;
					this.#openRejected = rejectedOpenDatabaseSchema.safeParse(raw).success;
					this.#lifecycle.push(raw);
					const opened = openDatabaseSchema.parse(raw);
					if (!sameIdaHostPath(opened.session.input_path, this.#workspace.inputPath)) throw new AnalysisProtocolError("IDA opened a different input than the private admitted target copy.");
					if (opened.session.session_id !== this.#workspace.sessionId) throw new AnalysisProtocolError("IDA returned an adopted or unexpected session instead of the requested private worker.");
					const inventory = databaseListSchema.parse(await this.connection.call("idb_list", {}));
					this.#lifecycle.push(jsonValueSchema.parse(inventory));
					const workspace = this.#workspace;
					this.#recordBlockingSessions(inventory.sessions.filter((entry) => entry.session_id === workspace.sessionId || sameIdaHostPath(entry.input_path, workspace.inputPath)));
					const entry = inventory.sessions.find(({ session_id }) => session_id === opened.session.session_id);
					if (entry?.owned !== true || entry.backend !== "worker" || entry.is_active !== true || !sameIdaHostPath(entry.input_path, this.#workspace.inputPath)) throw new AnalysisProtocolError("IDA did not return an active owned headless worker for the private input copy.");
					this.#database = opened.session.session_id;
				}
				this.#ready = true;
			}
			async #nativeMetadata() {
				if (this.connection.readResource === undefined) throw new AnalysisProtocolError("Native IDA MCP requires resources/read for recorded input metadata.");
				return this.connection.readResource("ida://idb/metadata");
			}
			async #observe(options, onObserved) {
				let identity;
				if (this.config.mode === "attached") {
					const raw = this.config.protocol === "native" ? await this.#nativeMetadata() : await this.connection.call("get_metadata", {});
					const metadata = legacyMetadataSchema.parse(raw);
					this.#metadata = raw;
					onObserved?.(raw);
					if (metadata.sha256.toLowerCase() !== this.target.sha256.toLowerCase()) throw new AnalysisProtocolError(`The attached IDA input SHA-256 does not match the selected target ${this.target.path}; open that target in IDA or use headless mode.`);
					identity = JSON.stringify([
						metadata.path,
						metadata.sha256.toLowerCase(),
						metadata.base
					]);
				} else {
					if (this.#database === undefined || this.#workspace === undefined) throw new AnalysisProtocolError("IDA headless session has no database binding.");
					const raw = await readSettledHealth(this.connection, {
						database: this.#database,
						timeoutMs: this.config.timeoutMs,
						signal: options?.signal
					});
					const metadata = modernHealthSchema.parse(raw);
					this.#metadata = raw;
					onObserved?.(raw);
					if (!sameIdaHostPath(metadata.input_path, this.#workspace.inputPath) || await idaFileDigest(this.#workspace.inputPath) !== this.#workspace.inputSha256) throw new AnalysisProtocolError("IDA headless input identity changed after target admission.");
					if (metadata.auto_analysis_ready !== true) throw new AnalysisProtocolError("IDA auto-analysis is incomplete or readiness is unknown; retry after analysis completes.");
					identity = JSON.stringify([
						this.#database,
						metadata.input_path,
						metadata.idb_path,
						metadata.imagebase
					]);
				}
				if (this.#initialIdentity !== undefined && identity !== this.#initialIdentity) throw new AnalysisProtocolError("The attached IDA target or image base changed during the REA session; reopen the target.");
				this.#initialIdentity = identity;
				return this.#metadata;
			}
			async close() {
				if (this.#closePromise !== undefined) return this.#closePromise;
				const closing = this.#closeOnce();
				const shared = closing.finally(() => {
					if (this.#closePromise === shared) this.#closePromise = undefined;
				});
				this.#closePromise = shared;
				return shared;
			}
			/**
			* Upstream sessions whose release cleanup has not confirmed: the entries
			* the latest successful inventory found blocking release; else the
			* requested private worker until its close is confirmed, and then none
			* known.
			*/
			#unreleasedSessions() {
				if (this.#blockingSessions !== undefined) return this.#blockingSessions;
				if (!this.#openAttempted || this.#workspace === undefined || this.#openRejected) return undefined;
				return this.#databaseCloseCompleted ? [] : [{
					session_id: this.#workspace.sessionId,
					backend: "worker",
					owned: null,
					input_path: null,
					is_active: null
				}];
			}
			/** Drop a session whose release upstream confirmed, keeping other blockers. */
			#forgetReleasedSession(sessionId) {
				const remaining = this.#blockingSessions?.filter(({ session_id }) => session_id !== sessionId);
				this.#blockingSessions = remaining !== undefined && remaining.length > 0 ? remaining : undefined;
			}
			/** Replace blocker evidence from a successful inventory; true when blocked. */
			#recordBlockingSessions(entries) {
				this.#blockingSessions = entries.length > 0 ? entries.map(({ session_id, backend, owned, input_path, is_active }) => ({
					session_id,
					backend,
					owned,
					input_path,
					is_active
				})) : undefined;
				return entries.length > 0;
			}
			async #closeDatabase(database) {
				const response = await this.connection.call("idb_close", {
					database,
					save: false
				});
				const closed = closeDatabaseSchema.safeParse(response);
				if (!closed.success) {
					if (!absentDatabaseCloseSchema(database).safeParse(response).success) throw closed.error;
					return;
				}
				if (closed.data.session_id !== database || closed.data.saved === true || closed.data.owned !== true || closed.data.backend !== "worker") throw new AnalysisProtocolError("IDA database close did not confirm the requested owned, unsaved session release.");
			}
			async #closeOnce() {
				this.#closing = true;
				await this.#tail;
				if (this.#closed) return ok(null);
				try {
					if (this.#workspace !== undefined && this.#openAttempted) {
						if (this.#database === undefined) {
							const inventory = databaseListSchema.parse(await this.connection.call("idb_list", {}));
							const workspace = this.#workspace;
							this.#database = inventory.sessions.find((entry) => entry.owned && entry.backend === "worker" && entry.session_id === workspace.sessionId && sameIdaHostPath(entry.input_path, workspace.inputPath))?.session_id;
							const blocked = this.#recordBlockingSessions(inventory.sessions.filter((entry) => entry.session_id === workspace.sessionId || sameIdaHostPath(entry.input_path, workspace.inputPath)));
							if (this.#database === undefined && blocked) throw new AnalysisProtocolError("A registered session still matches the requested ID or private input without a verified private worker binding; the workspace was retained.");
							if (this.#database === undefined && this.#openCompleted && !this.#openRejected) throw new AnalysisProtocolError("IDA open returned without a verified private worker binding. An empty session inventory does not prove that its Worker exited; the private workspace was retained.");
						}
						if (this.#database !== undefined) {
							if (!this.#databaseCloseCompleted) {
								await this.#closeDatabase(this.#database);
								this.#databaseCloseCompleted = true;
								this.#forgetReleasedSession(this.#database);
							}
							const inventory = databaseListSchema.parse(await this.connection.call("idb_list", {}));
							const remaining = inventory.sessions.filter((entry) => entry.session_id === this.#database || sameIdaHostPath(entry.input_path, this.#workspace?.inputPath ?? ""));
							if (this.#recordBlockingSessions(remaining)) throw new AnalysisProtocolError("IDA worker remains registered after close.");
							this.#database = undefined;
						}
						if (!this.#openCompleted) throw new AnalysisProtocolError("IDA database open did not return a completed response. Worker inventory cannot prove that the request has stopped; the private workspace was retained.");
						this.#openAttempted = false;
					}
					await this.connection.close();
					await this.#workspace?.remove();
					this.#closed = true;
					return ok(null);
				} catch (cause) {
					this.connection.detach();
					return err(new IdaCleanupError(this.#workspace?.directory ?? "IDA MCP connection", cause, this.#unreleasedSessions()));
				}
			}
		};
	})))();
}

//#endregion
//#region dist/ida/IdaProvider.js
var IdaProvider, readIdaConfigurationNotConfigured;
function init_IdaProvider() {
	return (init_IdaProvider = __esmMin((() => {
		init_snapshotEnvironment();
		init_analysisProfile();
		init_binaryTargetTypes();
		init_result();
		init_analysisErrorCore();
		init_IdaConfiguration();
		init_IdaMcpConnection();
		init_IdaProviderCapabilities();
		init_IdaSessionClient();
		init_PrivateRuntimeRoot();
		IdaProvider = class {
			config;
			connectionFactory;
			#registration;
			environment;
			constructor(config, environment, connectionFactory = createIdaMcpConnection) {
				this.config = config;
				this.connectionFactory = connectionFactory;
				this.environment = snapshotEnvironment(environment);
			}
			identity() {
				return IDA_PROVIDER_IDENTITY;
			}
			capabilities() {
				const config = this.#configuration();
				return idaCapabilities(config.ok ? config.value.mode : "attached", config.ok && "command" in config.value, config.ok && config.value.protocol === "native");
			}
			inspectAvailability() {
				const config = this.#configuration();
				if (config.ok && config.value.mode === "headless") {
					const privacy = privateRuntimeRootCapability();
					if (!privacy.available) return {
						status: "unavailable",
						code: privacy.code,
						reason: privacy.reason,
						diagnostics: {
							configured: true,
							mode: "headless",
							live_connection_probed: false,
							private_workspace_available: false,
							windows_native_failure: {
								stage: privacy.failureStage,
								remediation: privacy.remediation
							}
						}
					};
				}
				return config.ok ? {
					status: "available",
					code: null,
					reason: null,
					diagnostics: {
						configured: true,
						mode: config.value.mode,
						transport: "command" in config.value ? "stdio" : "http",
						live_connection_probed: false
					}
				} : {
					status: "unavailable",
					code: this.config.idaMcpConfigPath === undefined ? "not_configured" : "open_options_invalid",
					reason: config.error.message,
					diagnostics: {
						configured: false,
						live_connection_probed: false
					}
				};
			}
			inspectTargetSupport(target) {
				const diagnostics = {
					target_kind: target.kind,
					target_format: target.format
				};
				if (target.kind === "executable" && isElfMetadataArchitecture(target.architecture)) return {
					status: "unsupported",
					code: "architecture_unsupported",
					reason: `REA's IDA adapter has no verified ${target.architecture === "mips" ? "MIPS" : target.architecture === "riscv" ? "RISC-V" : "PowerPC"} lane. Select a supported Ghidra profile instead.`,
					diagnostics
				};
				if (target.kind !== "executable") return {
					status: "unsupported",
					code: "target_kind_unsupported",
					reason: "IDA MCP integration admits executable inputs, not analysis databases. Select the original input binary.",
					diagnostics
				};
				if (target.format === "raw-binary") return {
					status: "unsupported",
					code: "target_format_unsupported",
					reason: "IDA does not admit headerless raw binaries. Open the target with Ghidra and supply architecture and entry_point.",
					diagnostics
				};
				return {
					status: "supported",
					code: null,
					reason: null,
					diagnostics
				};
			}
			async resolveAnalysisProfile(_target, options) {
				if (options?.signal?.aborted === true) return err(new AnalysisCancelledError("ida:profile"));
				const config = this.#configuration();
				if (!config.ok) return config;
				return ok({ profile: createAnalysisProfile(IDA_PROVIDER_IDENTITY, {
					version_scope: "rea-ida-adapter",
					engine_version: null,
					upstream_distribution_version: null,
					mode: config.value.mode,
					compatibility_profile: config.value.protocol === "native" ? "native-ida-mcp" : config.value.mode === "attached" ? "legacy-1.4" : "database-supervisor",
					database_revision: null,
					cache_policy: "live",
					registration_digest: createHash("sha256").update(canonicalize(config.value) ?? "").digest("hex")
				}) });
			}
			createClient(target, profile) {
				const config = this.#configuration();
				if (!config.ok) return {
					execute: async () => err(config.error),
					close: async () => ok(null)
				};
				return new IdaSessionClient(config.value, target, this.connectionFactory(config.value, this.environment), profile);
			}
			#configuration() {
				this.#registration ??= this.config.idaMcpConfigPath === undefined ? readIdaConfigurationNotConfigured() : readIdaConfiguration(this.config.idaMcpConfigPath);
				return this.#registration;
			}
		};
		readIdaConfigurationNotConfigured = () => err(idaConfigurationError("Set REA_IDA_MCP_CONFIG to an upstream IDA MCP JSON registration; see docs/ida-provider.md."));
	})))();
}

//#endregion
//#region dist/dotnet/ManagedStaticProviderMetadata.js
var managedStaticCapabilities, limitationsFor;
function init_ManagedStaticProviderMetadata() {
	return (init_ManagedStaticProviderMetadata = __esmMin((() => {
		init_InvestigationProviders();
		init_managedToolContracts();
		managedStaticCapabilities = () => Object.freeze(MANAGED_TOOL_CONTRACTS.map((contract) => Object.freeze({
			provider: MANAGED_STATIC_PROVIDER,
			operation: contract.name,
			available: true,
			reason: null,
			effects: Object.freeze({
				mutatesArtifact: false,
				launchesProcess: false,
				mayShowUi: false,
				mayAccessNetwork: false,
				mayWriteFilesystem: false,
				changesPermissions: false,
				requiresRoot: false
			}),
			limitations: limitationsFor(contract.name)
		})));
		limitationsFor = (operation) => Object.freeze(operation === "inspect_managed_artifact" ? ["This capability inventories PE/CLI identity only; inspect_managed_members admits metadata members, signatures, and CIL anchors.", "It never loads the target assembly, resolves dependencies through a CLR, decompiles C#, or executes target code."] : operation === "inspect_managed_native_boundaries" ? ["This capability inventories managed declarations for native boundaries only; native exports, thunks, and addresses require separate native-provider evidence.", "It never loads the target assembly, resolves dependencies through a CLR, decompiles C#, or executes target code."] : ["This capability decodes PE/CLI metadata members, signatures, and file-backed method bodies; decompiled C# reconstruction and cross-build member comparison are separate operations.", "It never loads the target assembly, resolves dependencies through a CLR, decompiles C#, or executes target code."]);
	})))();
}

//#endregion
//#region dist/native/NativeMacOSProviderMetadata.js
var NATIVE_MACOS_PROVIDER_IDENTITY, OWNED_PROCESS_OPERATIONS, nativeMacOSCapabilities;
function init_NativeMacOSProviderMetadata() {
	return (init_NativeMacOSProviderMetadata = __esmMin((() => {
		init_nativeToolContracts();
		NATIVE_MACOS_PROVIDER_IDENTITY = Object.freeze({
			id: "native-macos",
			name: "macOS native inspection utilities",
			version: null
		});
		OWNED_PROCESS_OPERATIONS = new Set(["capture_native_ui_scenario", "observe_native_calls"]);
		nativeMacOSCapabilities = (platform = process.platform) => {
			const available = platform === "darwin";
			return Object.freeze([...NATIVE_TOOL_CONTRACTS, { name: "inspect_native_dispatch_metadata" }].map((contract) => {
				const availability = available ? {
					available: true,
					reason: null
				} : {
					available: false,
					availabilityCode: "unsupported_host",
					reason: "Native macOS utilities require macOS."
				};
				return Object.freeze({
					provider: NATIVE_MACOS_PROVIDER_IDENTITY,
					operation: contract.name,
					...availability,
					effects: Object.freeze({
						mutatesArtifact: false,
						launchesProcess: contract.name !== "inspect_native_dispatch_metadata",
						mayShowUi: OWNED_PROCESS_OPERATIONS.has(contract.name),
						mayAccessNetwork: OWNED_PROCESS_OPERATIONS.has(contract.name),
						mayWriteFilesystem: OWNED_PROCESS_OPERATIONS.has(contract.name) || contract.name === "observe_native_ui",
						changesPermissions: false,
						requiresRoot: false
					}),
					limitations: Object.freeze(["Availability and textual formats depend on the installed macOS/Xcode toolchain."])
				});
			}));
		};
	})))();
}

//#endregion
//#region dist/composition/auxiliaryAnalysisProviders.js
var auxiliaryAnalysisProviderDeclarations;
function init_auxiliaryAnalysisProviders() {
	return (init_auxiliaryAnalysisProviders = __esmMin((() => {
		init_snapshotEnvironment();
		init_ArtifactProviderMetadata();
		init_InvestigationProviders();
		init_ManagedStaticProviderMetadata();
		init_NativeMacOSProviderMetadata();
		auxiliaryAnalysisProviderDeclarations = (selectedEnvironment, platform = process.platform) => {
			const environment = snapshotEnvironment(selectedEnvironment, platform);
			return [
				{
					identity: ARTIFACT_GRAPH_PROVIDER,
					capabilities: artifactCapabilities(platform),
					load: async () => {
						const { ArtifactProvider } = await import("./artifacts__ArtifactProvider-zXI0QjSL.js");
						return new ArtifactProvider(environment, platform);
					}
				},
				{
					identity: NATIVE_MACOS_PROVIDER_IDENTITY,
					capabilities: nativeMacOSCapabilities(platform),
					load: async () => {
						const { NativeMacOSProvider } = await import("./native__NativeMacOSProvider-YBTvUeJO.js");
						return new NativeMacOSProvider(environment, undefined, platform);
					}
				},
				{
					identity: MANAGED_STATIC_PROVIDER,
					capabilities: managedStaticCapabilities(),
					load: async () => {
						const { ManagedStaticProvider } = await import("./dotnet__ManagedStaticProvider-C8_yZCDc.js");
						return new ManagedStaticProvider();
					}
				}
			];
		};
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisProviderEvaluation.js
var evaluateAnalysisProviderCandidate, signalIsAborted$1, rejectedProfile;
function init_AnalysisProviderEvaluation() {
	return (init_AnalysisProviderEvaluation = __esmMin((() => {
		init_analysisProfile();
		init_analysisErrorCore();
		init_jsonValue();
		init_result();
		init_AbortablePromise();
		evaluateAnalysisProviderCandidate = async (candidate, status, target, signal) => {
			if (signalIsAborted$1(signal)) return err(new AnalysisCancelledError("open_binary"));
			let resolved;
			try {
				const resolution = await waitForAbortable(candidate.resolveAnalysisProfile(target, signal === undefined ? undefined : { signal }), signal);
				if (resolution === ABORTED) return err(new AnalysisCancelledError("open_binary"));
				resolved = resolution;
			} catch (cause) {
				void cause;
				return ok(rejectedProfile(candidate, status, "Provider profile resolution threw"));
			}
			if (signalIsAborted$1(signal)) return err(new AnalysisCancelledError("open_binary"));
			if (!resolved.ok && resolved.error instanceof AnalysisCancelledError) return err(resolved.error);
			if (!resolved.ok) {
				const error = resolved.error;
				const rejection = error instanceof AnalysisUnsupportedTargetError ? {
					candidate,
					status: {
						...status,
						targetSupport: {
							status: "unsupported",
							code: "target_format_unsupported",
							reason: error.reason,
							diagnostics: {
								path: error.path,
								error_tag: error._tag
							}
						}
					}
				} : rejectedProfile(candidate, status, error.message, { error_tag: error._tag });
				return ok({
					...rejection,
					profileError: error
				});
			}
			try {
				if (resolved.value.profile === null) return ok(rejectedProfile(candidate, status, "Provider version or analysis profile could not be resolved"));
				const profile = analysisProfileSchema.parse(resolved.value.profile);
				const identity = candidate.identity();
				if (profile.provider.id !== identity.id || profile.provider.name !== identity.name || identity.version !== null && profile.provider.version !== identity.version) return ok(rejectedProfile(candidate, status, "Resolved analysis profile has mismatched provider identity"));
				return ok({
					candidate,
					status,
					profile
				});
			} catch (cause) {
				void cause;
				return ok(rejectedProfile(candidate, status, "Provider returned an invalid analysis profile"));
			}
		};
		signalIsAborted$1 = (signal) => signal?.aborted === true;
		rejectedProfile = (candidate, status, reason, diagnostics = {}) => ({
			candidate,
			status: {
				...status,
				availability: {
					status: "unavailable",
					code: "version_unresolved",
					reason,
					diagnostics: jsonObjectSchema.parse({
						...status.availability.diagnostics,
						...diagnostics
					})
				}
			}
		});
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisProviderRegistry.js
var AnalysisProviderRegistry, candidateStatus, signalIsAborted, selectedResult, replaceCandidate, selectionError, candidateRejections, cloneAvailability, cloneTargetSupport;
function init_AnalysisProviderRegistry() {
	return (init_AnalysisProviderRegistry = __esmMin((() => {
		init_providerSelection();
		init_analysisErrorCore();
		init_providerSelectionError();
		init_jsonValue();
		init_result();
		init_AnalysisProviderEvaluation();
		init_unicodeCodePointOrder();
		AnalysisProviderRegistry = class {
			#providers;
			#byId;
			#declaredOperations;
			#defaultSelector;
			constructor(providers, defaultSelector = "auto") {
				this.#defaultSelector = analysisProviderSelectorSchema.parse(defaultSelector);
				const byId = new Map();
				const declaredOperations = new Set();
				for (const provider of providers) {
					const identity = provider.identity();
					if (!analysisProviderIdSchema.safeParse(identity.id).success) throw new TypeError(`Invalid analysis provider ID: ${identity.id}`);
					if (byId.has(identity.id)) throw new TypeError(`Duplicate analysis provider ID: ${identity.id}`);
					const providerOperations = new Set();
					for (const capability of provider.capabilities()) {
						if (capability.provider.id !== identity.id || capability.provider.name !== identity.name || capability.provider.version !== identity.version) throw new TypeError(`Provider ${identity.id} published mismatched capability provenance for ${capability.operation}`);
						if (providerOperations.has(capability.operation)) throw new TypeError(`Provider ${identity.id} declares operation ${capability.operation} more than once`);
						providerOperations.add(capability.operation);
						declaredOperations.add(capability.operation);
					}
					byId.set(identity.id, provider);
				}
				this.#providers = Object.freeze([...providers].sort((left, right) => compareUnicodeCodePoints(left.identity().id, right.identity().id)));
				this.#byId = byId;
				this.#declaredOperations = Object.freeze([...declaredOperations].sort((left, right) => compareUnicodeCodePoints(left, right)));
			}
			/** Return the configured default without interpreting it as priority. */
			defaultSelector() {
				return this.#defaultSelector;
			}
			/** List configured candidate identities in canonical provider-ID order. */
			identities() {
				return this.#providers.map((provider) => structuredClone(provider.identity()));
			}
			/** List the unique deep-operation declarations without probing candidates. */
			declaredOperations() {
				return [...this.#declaredOperations];
			}
			/** Discover candidates for status without resolving profiles or starting clients. */
			candidates(target) {
				return this.#providers.map((provider) => candidateStatus(provider, target));
			}
			/** Select one whole deep-operation family for a parsed target. */
			async select(target, requestedSelector, options = {}) {
				if (signalIsAborted(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				const parsedRequest = requestedSelector === undefined ? undefined : analysisProviderSelectorSchema.safeParse(requestedSelector);
				if (parsedRequest !== undefined && !parsedRequest.success) return err(selectionError("invalid_options", typeof requestedSelector === "string" ? requestedSelector : "<invalid>", this.candidates(target)));
				const request = parsedRequest?.data;
				const selector = request ?? this.#defaultSelector;
				const baseline = this.candidates(target);
				if (signalIsAborted(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				if (request === undefined && this.#byId.has(selector) && baseline.length > 0 && baseline.every(({ targetSupport }) => targetSupport.status === "unsupported")) return ok({
					requestedProviderId: selector,
					binding: null,
					candidates: baseline
				});
				if (selector !== "auto") return this.#selectConcrete({
					target,
					baseline,
					signal: options.signal
				}, selector, request === undefined ? "environment" : "request");
				return this.#selectAutomatically({
					target,
					baseline,
					signal: options.signal
				});
			}
			/** Explain why a deep operation is unavailable on an unbound target. */
			unboundOperationError(operation, selection) {
				const reason = selection.candidates.length > 0 && selection.candidates.every(({ targetSupport }) => targetSupport.status === "unsupported") ? "target_unsupported" : "provider_unavailable";
				return selectionError(reason, selection.requestedProviderId, selection.candidates, operation);
			}
			async #selectConcrete(context, providerId, source) {
				const { baseline, signal, target } = context;
				const provider = this.#byId.get(providerId);
				if (provider === undefined) return err(selectionError("unknown_provider", providerId, baseline));
				const initial = baseline.find(({ provider: identity }) => identity.id === providerId);
				if (initial === undefined) throw new TypeError("Registered provider is absent from discovery output");
				if (initial.targetSupport.status !== "supported") return err(selectionError("target_unsupported", providerId, baseline));
				if (initial.availability.status === "unavailable") return err(selectionError("provider_unavailable", providerId, baseline));
				const evaluation = await evaluateAnalysisProviderCandidate(provider, initial, target, signal);
				if (!evaluation.ok) return evaluation;
				const evaluated = evaluation.value;
				if (evaluated.profileError !== undefined) return err(evaluated.profileError);
				const statuses = replaceCandidate(baseline, evaluated.status);
				if (evaluated.profile === undefined) return err(selectionError("provider_unavailable", providerId, statuses));
				return ok(selectedResult(providerId, source, {
					...evaluated,
					profile: evaluated.profile
				}, statuses));
			}
			async #selectAutomatically(context) {
				const { baseline, signal, target } = context;
				const results = await Promise.all(this.#providers.map(async (provider) => {
					const status = baseline.find(({ provider: identity }) => identity.id === provider.identity().id);
					if (status === undefined) throw new TypeError("Registered provider is absent from discovery output");
					return status.availability.status === "available" && status.targetSupport.status === "supported" ? evaluateAnalysisProviderCandidate(provider, status, target, signal) : ok({
						candidate: provider,
						status
					});
				}));
				const cancelled = results.find((result) => !result.ok);
				if (cancelled !== undefined && !cancelled.ok) return cancelled;
				const evaluations = results.map((result) => {
					if (!result.ok) throw new TypeError("Cancelled candidate evaluation disappeared");
					return result.value;
				});
				const cleanupFailure = evaluations.find(({ profileError }) => profileError?.cleanupIncomplete === true)?.profileError;
				if (cleanupFailure !== undefined) return err(cleanupFailure);
				const statuses = evaluations.map(({ status }) => status);
				const usable = evaluations.filter((evaluation) => evaluation.profile !== undefined);
				if (usable.length === 0) return ok({
					requestedProviderId: "auto",
					binding: null,
					candidates: statuses
				});
				if (usable.length > 1) return err(selectionError("ambiguous", "auto", statuses));
				const selected = usable[0];
				if (selected === undefined) throw new TypeError("Usable provider selection disappeared");
				return ok(selectedResult("auto", "auto-single-candidate", selected, statuses));
			}
		};
		candidateStatus = (provider, target) => {
			const readiness = provider.inspectReadinessSnapshot?.() ?? {
				availability: provider.inspectAvailability(),
				capabilities: provider.capabilities()
			};
			return {
				provider: structuredClone(provider.identity()),
				availability: cloneAvailability(readiness.availability),
				targetSupport: target === undefined ? {
					status: "unknown",
					code: null,
					reason: "No target is open.",
					diagnostics: {}
				} : cloneTargetSupport(provider.inspectTargetSupport(target)),
				selected: false,
				capabilities: readiness.capabilities.map((capability) => structuredClone(capability))
			};
		};
		signalIsAborted = (signal) => signal?.aborted === true;
		selectedResult = (requestedProviderId, source, evaluated, statuses) => {
			const identity = evaluated.profile.provider;
			const capabilities = evaluated.status.capabilities.map((capability) => ({
				...capability,
				provider: structuredClone(identity)
			}));
			const selectedStatus = {
				...evaluated.status,
				provider: structuredClone(identity),
				selected: true,
				capabilities
			};
			return {
				requestedProviderId,
				binding: {
					provider: evaluated.candidate,
					identity: structuredClone(identity),
					selectionSource: source,
					profile: structuredClone(evaluated.profile),
					capabilities
				},
				candidates: replaceCandidate(statuses, selectedStatus)
			};
		};
		replaceCandidate = (statuses, replacement) => statuses.map((status) => status.provider.id === replacement.provider.id ? replacement : status);
		selectionError = (reason, requestedProviderId, candidates, operation = "open_binary") => new ProviderSelectionError({
			operation,
			reason,
			requestedProviderId,
			candidateIds: candidates.map(({ provider }) => provider.id),
			rejections: candidateRejections(candidates)
		});
		candidateRejections = (candidates) => candidates.flatMap((candidate) => [...candidate.availability.status === "unavailable" ? [candidate.availability] : [], ...candidate.targetSupport.status === "unsupported" ? [candidate.targetSupport] : []].map((rejection) => ({
			providerId: candidate.provider.id,
			code: rejection.code,
			reason: rejection.reason,
			diagnostics: structuredClone(rejection.diagnostics)
		})));
		cloneAvailability = (availability) => ({
			...availability,
			diagnostics: jsonObjectSchema.parse(availability.diagnostics)
		});
		cloneTargetSupport = (support) => ({
			...support,
			diagnostics: jsonObjectSchema.parse(support.diagnostics)
		});
	})))();
}

//#endregion
//#region dist/application/investigation/EvidenceLedger.js
var EvidenceLedger, unknownRevisionKey, recordsAgree, withoutLocalPath;
function init_EvidenceLedger() {
	return (init_EvidenceLedger = __esmMin((() => {
		init_evidenceBundle();
		init_analysisErrorCore();
		init_evidenceErrors();
		init_unknownRegistryError();
		init_evidence();
		init_residualUnknown();
		init_result();
		init_unicodeCodePointOrder();
		EvidenceLedger = class {
			#records = new Map();
			#unknownRevisions = new Map();
			#unknownHeads = new Map();
			/** Record evidence idempotently; conflicting content is rejected. */
			record(input) {
				let evidence;
				try {
					evidence = immutableEvidence(input);
				} catch (cause) {
					return err(new EvidenceIntegrityError("Evidence record validation failed", { cause }));
				}
				const existing = this.#records.get(evidence.evidence_id);
				if (existing !== undefined) {
					if (existing === evidence) return ok("duplicate");
					return recordsAgree(existing, evidence) ? ok("duplicate") : err(new EvidenceIntegrityError("Conflicting evidence record"));
				}
				this.#records.set(evidence.evidence_id, evidence);
				return ok("added");
			}
			/** Validate an entire bundle before atomically merging its records. */
			import(input) {
				let bundle;
				try {
					bundle = parseEvidenceBundle(input);
				} catch (cause) {
					const failure = describeEvidenceBundleFailure(input, cause);
					if (failure.kind === "single-record") return err(new AnalysisInputError("import_evidence_bundle", {
						cause,
						userMessage: failure.message
					}));
					return err(new EvidenceIntegrityError("Evidence bundle validation failed", {
						cause,
						userMessage: failure.message
					}));
				}
				if (bundle.unknowns.length === 0) {
					const additions = new Map();
					const replacements = new Map();
					let metadataChanged = false;
					for (const evidence of bundle.records) {
						const existing = this.#records.get(evidence.evidence_id);
						if (existing !== undefined) {
							if (!recordsAgree(existing, evidence)) return err(new EvidenceIntegrityError("Conflicting evidence record"));
							if (canonicalize(existing) !== canonicalize(evidence)) {
								replacements.set(evidence.evidence_id, evidence);
								metadataChanged = true;
							}
							continue;
						}
						additions.set(evidence.evidence_id, evidence);
					}
					for (const [id, evidence] of replacements) this.#records.set(id, immutableEvidence(evidence));
					for (const [id, evidence] of additions) this.#records.set(id, immutableEvidence(evidence));
					return ok({
						recordsAdded: additions.size,
						unknownsAdded: 0,
						changed: additions.size > 0 || metadataChanged,
						metadataChanged
					});
				}
				const pending = new Map(this.#records);
				let metadataChanged = false;
				for (const evidence of bundle.records) {
					const existing = pending.get(evidence.evidence_id);
					if (existing !== undefined && !recordsAgree(existing, evidence)) return err(new EvidenceIntegrityError("Conflicting evidence record"));
					if (existing !== undefined && canonicalize(existing) !== canonicalize(evidence)) metadataChanged = true;
					pending.set(evidence.evidence_id, evidence);
				}
				const pendingUnknowns = new Map(this.#unknownRevisions);
				let unknownsAdded = 0;
				for (const unknown of bundle.unknowns) {
					const key = unknownRevisionKey(unknown);
					const existing = pendingUnknowns.get(key);
					if (existing !== undefined && existing.revision_digest !== unknown.revision_digest) return err(new EvidenceIntegrityError("Conflicting unknown revision"));
					pendingUnknowns.set(key, unknown);
					if (existing === undefined) unknownsAdded += 1;
				}
				const checked = this.#validateCandidate(pending, pendingUnknowns);
				if (!checked.ok) {
					if (checked.error instanceof UnknownRegistryError) return err(new EvidenceIntegrityError("Evidence bundle unknown registry failed", { cause: checked.error }));
					return err(checked.error);
				}
				const added = pending.size - this.#records.size;
				this.#commit(pending, pendingUnknowns);
				return ok({
					recordsAdded: added,
					unknownsAdded,
					changed: added > 0 || unknownsAdded > 0 || metadataChanged,
					metadataChanged
				});
			}
			/** Export records in deterministic, semantically irrelevant ID order. */
			export() {
				return structuredClone(createEvidenceBundle([...this.#records.values()], [...this.#unknownRevisions.values()]));
			}
			/** Borrow a sealed canonical bundle for serialization without copying its records. */
			forSerialization() {
				return createImmutableEvidenceBundle([...this.#records.values()], [...this.#unknownRevisions.values()]);
			}
			/** Check whether one immutable Evidence ID is present in this ledger. */
			has(evidenceId) {
				return this.#records.has(evidenceId);
			}
			/** Return a detached immutable Evidence value by semantic ID. */
			get(evidenceId) {
				const evidence = this.#records.get(evidenceId);
				return evidence === undefined ? undefined : structuredClone(evidence);
			}
			/** Borrow authenticated immutable Evidence for read-only analysis without a full clone. */
			forAnalysis(evidenceId) {
				return this.#records.get(evidenceId);
			}
			/** Create one approved unknown and atomically append its mutation evidence. */
			recordUnknown(input, mutationEvidence) {
				let parsedMutation;
				try {
					parsedMutation = immutableEvidence(mutationEvidence);
				} catch (cause) {
					return err(new EvidenceIntegrityError("Unknown mutation evidence is invalid", { cause }));
				}
				let unknown;
				try {
					unknown = createResidualUnknown(input, parsedMutation.evidence_id, parsedMutation.subject?.digest.sha256 ?? null);
				} catch (cause) {
					return err(new UnknownRegistryError("invalid-transition", { cause }));
				}
				if (this.#unknownHeads.has(unknown.unknown_id)) return err(new UnknownRegistryError("already-exists"));
				return this.#appendUnknown(unknown, parsedMutation);
			}
			/** Atomically record derived Evidence and a linked residual unknown. */
			recordWithUnknown(evidenceInput, input, mutationInput) {
				let evidence;
				let mutation;
				try {
					evidence = immutableEvidence(evidenceInput);
					mutation = immutableEvidence(mutationInput);
				} catch (cause) {
					return err(new EvidenceIntegrityError("Atomic Evidence validation failed", { cause }));
				}
				const existingEvidence = this.#records.get(evidence.evidence_id);
				if (existingEvidence !== undefined && !recordsAgree(existingEvidence, evidence)) return err(new EvidenceIntegrityError("Conflicting evidence record"));
				let unknown;
				try {
					unknown = createResidualUnknown(input, mutation.evidence_id, mutation.subject?.digest.sha256 ?? null);
				} catch (cause) {
					return err(new UnknownRegistryError("invalid-transition", { cause }));
				}
				const existingUnknown = this.#unknownHeads.get(unknown.unknown_id);
				if (existingUnknown !== undefined) {
					if (existingUnknown.revision !== 1 || existingUnknown.revision_digest !== unknown.revision_digest) return err(new UnknownRegistryError("already-exists"));
					const checked = this.#appendIncremental([evidence]);
					if (!checked.ok) return checked;
					return ok(null);
				}
				const checked = this.#appendIncremental([evidence, mutation], unknown);
				if (!checked.ok) return checked;
				return ok(structuredClone(unknown));
			}
			/** Apply one approved full-state update using optimistic revision matching. */
			updateUnknown(input, mutationEvidence) {
				const current = this.#unknownHeads.get(input.unknown_id);
				if (current === undefined) return err(new UnknownRegistryError("not-found"));
				if (current.revision !== input.expected_revision) return err(new UnknownRegistryError("revision-conflict"));
				let unknown;
				try {
					unknown = updateResidualUnknown(current, input, mutationEvidence.evidence_id);
				} catch (cause) {
					return err(new UnknownRegistryError("invalid-transition", { cause }));
				}
				return this.#appendUnknown(unknown, mutationEvidence);
			}
			/** Query current heads in stable ID order. */
			listUnknowns(filters = {}) {
				return this.listUnknownsPage(filters).items;
			}
			/** Select a stable page of current heads before detaching record payloads. */
			listUnknownsPage(query = {}) {
				const offset = query.offset ?? 0;
				const matching = [...this.#unknownHeads.values()].filter((unknown) => (query.status === undefined || unknown.status === query.status) && (query.severity === undefined || unknown.severity === query.severity) && (query.domain === undefined || unknown.domain === query.domain)).sort((left, right) => compareUnicodeCodePoints(left.unknown_id, right.unknown_id));
				const start = Math.min(offset, matching.length);
				const end = query.limit === undefined ? undefined : start + Math.min(query.limit, matching.length - start);
				const page = matching.slice(start, end);
				const nextOffset = offset <= matching.length && start + page.length < matching.length ? start + page.length : null;
				return {
					items: page.map((unknown) => structuredClone(unknown)),
					total: matching.length,
					offset,
					next_offset: nextOffset
				};
			}
			/** Return current resolution validity; imported invalid states are rejected. */
			verifyUnknownResolution(unknownId) {
				const unknown = this.#unknownHeads.get(unknownId);
				if (unknown === undefined) return err(new UnknownRegistryError("not-found"));
				return ok({
					valid: unknown.status === "resolved",
					truthVerified: unknown.resolution?.disposition === "verified",
					unknown: structuredClone(unknown)
				});
			}
			/** Clear records when the owning session closes. */
			clear() {
				this.#records.clear();
				this.#unknownRevisions.clear();
				this.#unknownHeads.clear();
			}
			#appendUnknown(unknown, mutationEvidenceInput) {
				let mutationEvidence;
				try {
					mutationEvidence = immutableEvidence(mutationEvidenceInput);
				} catch (cause) {
					return err(new EvidenceIntegrityError("Unknown mutation evidence is invalid", { cause }));
				}
				const checked = this.#appendIncremental([mutationEvidence], unknown);
				if (!checked.ok) return checked;
				return ok(structuredClone(unknown));
			}
			#appendIncremental(records, unknown) {
				const additions = new Map();
				for (const evidence of records) {
					const existing = additions.get(evidence.evidence_id) ?? this.#records.get(evidence.evidence_id);
					if (existing !== undefined) {
						if (!recordsAgree(existing, evidence)) return err(new EvidenceIntegrityError("Conflicting evidence record"));
						continue;
					}
					additions.set(evidence.evidence_id, evidence);
				}
				const unknownKey = unknown === undefined ? undefined : unknownRevisionKey(unknown);
				if (unknownKey !== undefined && this.#unknownRevisions.has(unknownKey)) return err(new UnknownRegistryError("integrity"));
				if (unknown !== undefined) try {
					validateResidualUnknownAddition(unknown, {
						get: (id) => additions.get(id) ?? this.#records.get(id),
						has: (id) => additions.has(id) || this.#records.has(id)
					}, this.#unknownHeads);
				} catch (cause) {
					return err(new UnknownRegistryError("integrity", { cause }));
				}
				for (const [id, evidence] of additions) this.#records.set(id, immutableEvidence(evidence));
				if (unknown !== undefined && unknownKey !== undefined) {
					this.#unknownRevisions.set(unknownKey, unknown);
					this.#unknownHeads.set(unknown.unknown_id, unknown);
				}
				return ok(undefined);
			}
			#validateCandidate(records, unknowns) {
				try {
					createImmutableEvidenceBundle([...records.values()], [...unknowns.values()]);
				} catch (cause) {
					return err(new UnknownRegistryError("integrity", { cause }));
				}
				return ok(undefined);
			}
			#commit(records, unknowns) {
				this.#records.clear();
				for (const [id, evidence] of records) this.#records.set(id, immutableEvidence(evidence));
				this.#unknownRevisions.clear();
				this.#unknownHeads.clear();
				for (const [key, unknown] of unknowns) {
					this.#unknownRevisions.set(key, unknown);
					const head = this.#unknownHeads.get(unknown.unknown_id);
					if (head === undefined || head.revision < unknown.revision) this.#unknownHeads.set(unknown.unknown_id, unknown);
				}
			}
		};
		unknownRevisionKey = (unknown) => `${unknown.unknown_id}:${String(unknown.revision)}`;
		recordsAgree = (left, right) => canonicalize(withoutLocalPath(left)) === canonicalize(withoutLocalPath(right));
		withoutLocalPath = (evidence) => ({
			...evidence,
			subject: evidence.subject === null ? null : {
				...evidence.subject,
				name: "<non-identity-name>",
				local_path: "<non-identity-local-path>"
			}
		});
	})))();
}

//#endregion
//#region dist/application/investigation/UnknownEvidence.js
var UNKNOWN_REGISTRY_PROVIDER, unknownMutationEvidence, unknownEvidenceLinks;
function init_UnknownEvidence() {
	return (init_UnknownEvidence = __esmMin((() => {
		init_evidence();
		UNKNOWN_REGISTRY_PROVIDER = {
			id: "rea-unknown-registry",
			name: "REA residual unknown registry",
			version: "1"
		};
		unknownMutationEvidence = (target, mutation) => createEvidence(target, UNKNOWN_REGISTRY_PROVIDER, {
			predicateType: "rea.residual-unknown-mutation",
			operation: mutation.operation,
			parameters: { ...mutation.input },
			result: mutation.operation === "record_unknown" ? {
				action: "record",
				question: mutation.input.question,
				required_authority: mutation.input.required_authority,
				required_confidence: mutation.input.required_confidence
			} : {
				action: "update",
				status: mutation.input.status
			},
			confidence: "derived",
			authority: "analyst-inference",
			evidenceLinks: unknownEvidenceLinks(mutation.input),
			limitations: ["Registry mutation evidence records analyst intent, not proof of the answer."]
		});
		unknownEvidenceLinks = (input) => [...new Set([
			...input.supporting_evidence_ids,
			...input.contradicting_evidence_ids,
			..."resolution" in input && input.resolution !== null ? input.resolution.evidence_ids : []
		])];
	})))();
}

//#endregion
//#region dist/application/investigation/InvestigationRecords.js
var InvestigationRecords;
function init_InvestigationRecords() {
	return (init_InvestigationRecords = __esmMin((() => {
		init_EvidenceLedger();
		init_UnknownEvidence();
		InvestigationRecords = class {
			#evidence = new EvidenceLedger();
			/** Record immutable Evidence idempotently; reject conflicting content. */
			recordEvidence(evidence) {
				return this.#evidence.record(evidence);
			}
			/** Check one semantic Evidence ID without exposing stored values. */
			hasEvidence(evidenceId) {
				return this.#evidence.has(evidenceId);
			}
			/** Return a detached Evidence value for one semantic ID. */
			evidenceById(evidenceId) {
				return this.#evidence.get(evidenceId);
			}
			/** Borrow an immutable authenticated record for a read-only application workflow. */
			evidenceForAnalysis(evidenceId) {
				return this.#evidence.forAnalysis(evidenceId);
			}
			/** Export a detached deterministic bundle of Evidence and Unknown revisions. */
			exportEvidenceBundle() {
				return this.#evidence.export();
			}
			/** Borrow a sealed bundle snapshot for complete JSON serialization. */
			evidenceBundleForSerialization() {
				return this.#evidence.forSerialization();
			}
			/** Atomically merge a bundle and report changes for the owner's post-commit observers. */
			mergeEvidenceBundle(bundle) {
				return this.#evidence.import(bundle);
			}
			/** Clear records when the owning runtime applies its existing lifecycle policy. */
			clear() {
				this.#evidence.clear();
			}
			/** Record an Unknown with an explicitly supplied Evidence subject, if any. */
			recordUnknown(input, target) {
				return this.#evidence.recordUnknown(input, unknownMutationEvidence(target, {
					operation: "record_unknown",
					input
				}));
			}
			/** Commit derived Evidence and its Unknown atomically without an implicit subject. */
			recordEvidenceWithUnknown(evidence, input) {
				return this.#evidence.recordWithUnknown(evidence, input, unknownMutationEvidence(undefined, {
					operation: "record_unknown",
					input
				}));
			}
			/** Update an optimistic revision with an explicitly supplied Evidence subject. */
			updateUnknown(input, target) {
				const evidence = unknownMutationEvidence(target, {
					operation: "update_unknown",
					input
				});
				return this.#evidence.updateUnknown(input, evidence);
			}
			/** Return detached current Unknown revisions matching the selected filters. */
			listUnknowns(filters = {}) {
				return this.#evidence.listUnknowns(filters);
			}
			listUnknownsPage(query = {}) {
				return this.#evidence.listUnknownsPage(query);
			}
			/** Verify registry consistency without asserting the answer is true. */
			verifyUnknownResolution(unknownId) {
				return this.#evidence.verifyUnknownResolution(unknownId);
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisClientCleanup.js
var closeAnalysisClient;
function init_AnalysisClientCleanup() {
	return (init_AnalysisClientCleanup = __esmMin((() => {
		init_providerCleanupError();
		init_result();
		init_analysisErrorBase();
		closeAnalysisClient = async (client, providerId, options = {}) => {
			try {
				return await client.close(options);
			} catch (cause) {
				if (cause instanceof AnalysisError && cause.cleanupIncomplete) return err(cause);
				return err(new ProviderCleanupError(providerId, ["provider-client"], { reason: "provider client close rejected unexpectedly" }, { cause }));
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/CompositeProvider.js
var compositeProviderIdentity, closeCompositeClients, executeCompositeHealth, CompositeProvider;
function init_CompositeProvider() {
	return (init_CompositeProvider = __esmMin((() => {
		init_analysisErrorCore();
		init_providerCleanupError();
		init_providerAdapterError();
		init_result();
		init_AnalysisClientCleanup();
		init_unicodeCodePointOrder();
		compositeProviderIdentity = (identities) => ({
			id: `composite:${identities.map(({ id }) => id).sort().join("+")}`,
			name: "REA composite analysis provider",
			version: null
		});
		closeCompositeClients = (identity, clients) => async (options) => {
			const outcomes = await Promise.all([...clients.entries()].map(([provider, client]) => closeAnalysisClient(client, provider.identity().id, options).then((result) => ({
				providerId: provider.identity().id,
				result
			}))));
			const failures = outcomes.flatMap(({ providerId, result }) => result.ok ? [] : [{
				providerId,
				error: result.error
			}]);
			if (failures.length === 0) return ok(null);
			if (failures.length === 1) {
				const failure = failures[0];
				if (failure !== undefined) return err(failure.error);
			}
			const resources = [...new Set(failures.flatMap(({ error }) => error.cleanupResources))];
			return err(new ProviderCleanupError(identity.id, resources, {
				reason: "Multiple composed provider clients could not be confirmed closed.",
				failures: failures.map(({ providerId, error }) => ({
					provider_id: providerId,
					message: error.message,
					resources: [...error.cleanupResources],
					...error.diagnostics === undefined ? {} : { diagnostics: error.diagnostics }
				}))
			}, { cause: new AggregateError(failures.map(({ error }) => error), "Composed provider cleanup failed.") }));
		};
		executeCompositeHealth = async (identity, clients, options) => {
			for (const [provider, client] of clients) {
				const health = client.operationHealthSnapshot?.();
				if (health !== undefined && health.state !== "idle" && health.state !== "busy") return err(new ProviderAdapterError(provider.identity().id, "health", { diagnostics: { reason: `instantiated provider client is ${health.state}` } }));
				const checked = await client.execute("health", {}, options);
				if (!checked.ok) return checked;
			}
			return ok({
				result: null,
				rawResult: null,
				provider: identity,
				limitations: [],
				locations: [],
				subject: null
			});
		};
		CompositeProvider = class {
			providers;
			#identity;
			#capabilities;
			#providerByOperation;
			constructor(providers) {
				this.providers = providers;
				if (providers.length === 0) throw new RangeError("CompositeProvider requires at least one provider");
				this.#identity = Object.freeze(compositeProviderIdentity(providers.map((provider) => provider.identity())));
				const routes = new Map();
				const capabilities = [];
				for (const provider of providers) {
					for (const descriptor of provider.capabilities()) {
						if (routes.has(descriptor.operation)) throw new TypeError(`Multiple providers declare operation ${descriptor.operation}`);
						routes.set(descriptor.operation, provider);
						capabilities.push(descriptor);
					}
				}
				this.#providerByOperation = routes;
				this.#capabilities = Object.freeze(capabilities.sort((left, right) => compareUnicodeCodePoints(left.operation, right.operation) || compareUnicodeCodePoints(left.provider.id, right.provider.id)));
			}
			identity() {
				return this.#identity;
			}
			capabilities() {
				return this.#capabilities;
			}
			createClient(target, profile, context) {
				const clients = new Map();
				const clientFor = (provider) => {
					const existing = clients.get(provider);
					if (existing !== undefined) return existing;
					const created = provider.createClient(target, profile?.provider.id === provider.identity().id ? profile : undefined, context);
					clients.set(provider, created);
					return created;
				};
				const close = closeCompositeClients(this.#identity, clients);
				return {
					executeIfReady: (operation, parameters, options) => {
						const provider = this.#providerByOperation.get(operation);
						const client = provider === undefined ? undefined : clients.get(provider);
						return client?.executeIfReady?.(operation, parameters, options) ?? Promise.resolve(undefined);
					},
					execute: async (operation, parameters, options) => {
						if (operation === "health") return executeCompositeHealth(this.#identity, clients, options);
						const provider = this.#providerByOperation.get(operation);
						return provider === undefined ? Promise.resolve(err(new AnalysisCapabilityUnavailableError(this.#identity.id, operation, "operation is not declared by this provider set"))) : clientFor(provider).execute(operation, parameters, options);
					},
					runtimeLineageSnapshots: () => [...clients.values()].flatMap((client) => client.runtimeLineageSnapshots?.() ?? []).sort((left, right) => compareUnicodeCodePoints(left.provider.id, right.provider.id)),
					requestActivitySnapshots: () => [...clients.values()].flatMap((client) => client.requestActivitySnapshots?.() ?? []).sort((left, right) => compareUnicodeCodePoints(left.provider.id, right.provider.id)),
					operationHealthSnapshot: () => {
						const snapshots = [...clients.values()].map((client) => client.operationHealthSnapshot?.());
						if (snapshots.some((snapshot) => snapshot === undefined)) return undefined;
						return snapshots.find((snapshot) => snapshot !== undefined && snapshot.state !== "idle") ?? snapshots[0];
					},
					close
				};
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/SessionProviderRouter.js
var SessionProviderRouter, selectableRoute, emptyClient, emptyProviderIdentity, capabilityMap, assertDisjoint, assertUniqueProviderIds;
function init_SessionProviderRouter() {
	return (init_SessionProviderRouter = __esmMin((() => {
		init_analysisErrorCore();
		init_providerSelectionError();
		init_result();
		init_AnalysisProviderRegistry();
		init_CompositeProvider();
		SessionProviderRouter = class SessionProviderRouter {
			registry;
			auxiliaryProviders;
			route;
			constructor(registry, auxiliaryProviders, route) {
				this.registry = registry;
				this.auxiliaryProviders = auxiliaryProviders;
				this.route = route;
			}
			/** Create selection-aware routing while keeping auxiliary families disjoint. */
			static selectable(registry, auxiliaryProviders) {
				const identities = [...registry.identities(), ...auxiliaryProviders.map((provider) => provider.identity())];
				assertUniqueProviderIds(identities);
				const auxiliaryOperations = assertDisjoint(auxiliaryProviders);
				for (const operation of registry.declaredOperations()) if (auxiliaryOperations.has(operation)) throw new TypeError(`Deep and auxiliary providers both declare operation ${operation}`);
				const initialRoute = selectableRoute(auxiliaryProviders, undefined);
				return new SessionProviderRouter(registry, [...auxiliaryProviders], initialRoute);
			}
			/** Target-free routes and discovery metadata. */
			initialRoute() {
				return this.route;
			}
			/** Resolve target routes before any provider client is created. */
			async resolve(target, providerId, signal) {
				const resolutionOptions = signal === undefined ? undefined : { signal };
				const selected = await this.registry.select(target, providerId, resolutionOptions);
				return selected.ok ? ok(selectableRoute(this.auxiliaryProviders, selected.value)) : selected;
			}
			/** Candidate status authoritative for the active or target-free route. */
			candidateStatuses(route) {
				return route.selection?.candidates ?? this.registry.candidates();
			}
			/** Produce exact candidate rejections for an intentionally unbound route. */
			unboundOperationError(operation, route) {
				if (route.binding !== null || route.selection === undefined || !this.registry.declaredOperations().includes(operation)) return undefined;
				return this.registry.unboundOperationError(operation, route.selection);
			}
		};
		selectableRoute = (auxiliaryProviders, selection) => {
			const binding = selection?.binding ?? null;
			const providers = [...auxiliaryProviders, ...binding === null ? [] : [binding.provider]];
			const provider = binding === null && providers.length === 1 ? providers[0] : providers.length === 0 ? undefined : new CompositeProvider(providers);
			const identity = provider?.identity() ?? emptyProviderIdentity();
			const capabilities = capabilityMap([...auxiliaryProviders.flatMap((auxiliary) => auxiliary.capabilities()), ...binding?.capabilities ?? []]);
			return {
				identity,
				capabilities,
				profile: binding?.profile ?? null,
				binding,
				selection,
				createClient: (target, context) => provider?.createClient(target, binding?.profile, context) ?? emptyClient(identity)
			};
		};
		emptyClient = (identity) => ({
			execute: (operation) => operation === "health" ? Promise.resolve(ok({
				result: null,
				rawResult: null,
				provider: identity,
				limitations: [],
				locations: [],
				subject: null
			})) : Promise.resolve(err(new AnalysisCapabilityUnavailableError(identity.id, operation, "operation is not declared by this provider set"))),
			close: () => Promise.resolve(ok(null))
		});
		emptyProviderIdentity = () => ({
			id: "composite:none",
			name: "REA composite analysis provider",
			version: null
		});
		capabilityMap = (capabilities) => new Map(capabilities.map((descriptor) => [descriptor.operation, descriptor]));
		assertDisjoint = (providers) => {
			const routes = new Set();
			for (const provider of providers) for (const { operation } of provider.capabilities()) {
				if (routes.has(operation)) throw new TypeError(`Multiple auxiliary providers declare operation ${operation}`);
				routes.add(operation);
			}
			return routes;
		};
		assertUniqueProviderIds = (identities) => {
			const ids = new Set();
			for (const identity of identities) {
				if (ids.has(identity.id)) throw new TypeError(`Duplicate configured provider ID: ${identity.id}`);
				ids.add(identity.id);
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/BinarySessionRecords.js
var SNAPSHOT_MUTATION_RECOVERY, BinarySessionRecords;
function init_BinarySessionRecords() {
	return (init_BinarySessionRecords = __esmMin((() => {
		init_evidenceBundle();
		init_evidenceErrors();
		init_result();
		init_AnalysisSnapshotCache();
		init_InvestigationRecords();
		init_ArtifactResourceScope();
		init_ArtifactReader();
		init_AnalysisSnapshotFiles();
		SNAPSHOT_MUTATION_RECOVERY = "Export session observations through export_evidence_bundle if needed. Close the active target without saving a snapshot, then reopen it before importing or saving a snapshot.";
		BinarySessionRecords = class {
			#records;
			#writeResources = new ArtifactResourceScope();
			#snapshot = new AnalysisSnapshotCache();
			#snapshotInvalidated = false;
			#snapshotListeners = new Set();
			constructor(records = new InvestigationRecords()) {
				this.#records = records;
			}
			/** Observe changes to the mutable current analysis snapshot resource. */
			onAnalysisSnapshotChanged(listener) {
				this.#snapshotListeners.add(listener);
				return () => this.#snapshotListeners.delete(listener);
			}
			recordEvidence(evidence) {
				const recorded = this.#records.recordEvidence(evidence);
				if (recorded.ok && recorded.value === "added") this.#emitSnapshotChanged();
				return recorded;
			}
			hasEvidence(evidenceId) {
				return this.#records.hasEvidence(evidenceId);
			}
			evidenceById(evidenceId) {
				return this.#records.evidenceById(evidenceId);
			}
			/** Borrow immutable investigation Evidence without copying a complete graph. */
			evidenceForAnalysis(evidenceId) {
				return this.#records.evidenceForAnalysis(evidenceId);
			}
			exportEvidenceBundle() {
				return this.#records.exportEvidenceBundle();
			}
			/** Borrow a sealed bundle for complete serialization without cloning retained graphs. */
			evidenceBundleForSerialization() {
				return this.#records.evidenceBundleForSerialization();
			}
			/** Persist one provider-neutral snapshot under this session's resource owner. */
			writeAnalysisSnapshot(snapshot, path, overwrite) {
				return writeAnalysisSnapshot(snapshot, path, overwrite, this.#writeResources);
			}
			/** Retry and release staged snapshot files at the owning session shutdown. */
			async closeWriteResources() {
				try {
					await this.#writeResources.retryCleanup();
					return ok(null);
				} catch (cause) {
					const observation = ArtifactReaderFailure.cleanupObservation(cause, "analysis snapshot staging");
					return err(new EvidenceFileError("write", "io", {
						cause,
						cleanup: {
							reason: observation.reason,
							resources: observation.resources
						}
					}));
				}
			}
			importEvidenceBundle(bundle) {
				const imported = this.#records.mergeEvidenceBundle(bundle);
				if (!imported.ok) return imported;
				if (imported.value.metadataChanged) this.invalidateSnapshot();
				else if (imported.value.changed) this.#emitSnapshotChanged();
				return ok(imported.value.recordsAdded);
			}
			exportAnalysisSnapshot() {
				const active = this.activeAnalysisBinding();
				if (this.#snapshotInvalidated) return err(new EvidenceIntegrityError("Analysis snapshots are unavailable because analysis metadata may have changed", { userMessage: `Analysis snapshots are unavailable because analysis metadata may have changed. ${SNAPSHOT_MUTATION_RECOVERY}` }));
				const target = active?.target;
				const profile = active?.profile ?? undefined;
				if (target !== undefined && profile === undefined) return err(new EvidenceIntegrityError("Analysis snapshots require a concrete provider analysis profile"));
				return this.#snapshot.export(target, profile, target === undefined ? this.#records.exportEvidenceBundle() : evidenceBundleForTarget(this.#records.exportEvidenceBundle(), target.sha256));
			}
			importAnalysisSnapshot(snapshot) {
				const active = this.activeAnalysisBinding();
				if (active !== undefined && this.#snapshotInvalidated) return err(new EvidenceIntegrityError("Analysis snapshots cannot be imported because analysis metadata may have changed", { userMessage: `Analysis snapshots cannot be imported because analysis metadata may have changed. ${SNAPSHOT_MUTATION_RECOVERY}` }));
				if (active?.profile === null) return err(new AnalysisSnapshotMismatchError("Analysis snapshot profile_mismatch: the active target has no concrete analysis profile"));
				const imported = this.#snapshot.import(snapshot, active === undefined ? undefined : {
					target: active.target,
					profile: active.profile
				}, (bundle) => {
					const imported = this.#records.mergeEvidenceBundle(bundle);
					return imported.ok ? ok(imported.value.recordsAdded) : imported;
				});
				if (imported.ok) this.#emitSnapshotChanged();
				return imported;
			}
			matchesSnapshot(target, profile) {
				return this.#snapshot.matches(target, profile ?? undefined);
			}
			selectSnapshot(target, profile) {
				this.#snapshot.select(target, profile);
				this.#emitSnapshotChanged();
			}
			lookupSnapshot(target, profile, operation, parameters) {
				if (this.#snapshotInvalidated) return undefined;
				return this.#snapshot.lookup(target, profile, operation, parameters);
			}
			recordSnapshot(input) {
				if (this.#snapshotInvalidated) return;
				this.#snapshot.record(input);
				this.#emitSnapshotChanged();
			}
			/** Retain one derived workflow result alongside its provider cache entries. */
			recordWorkflowSnapshot(input) {
				const active = this.activeAnalysisBinding();
				if (active === undefined || active.profile === null) return err(new EvidenceIntegrityError("Workflow snapshot entries require an active concrete provider profile"));
				if (this.#snapshotInvalidated) return ok(null);
				try {
					this.#snapshot.recordWorkflow({
						target: active.target,
						profile: active.profile,
						...input
					});
					this.#emitSnapshotChanged();
					return ok(null);
				} catch (cause) {
					return err(new EvidenceIntegrityError(cause instanceof Error ? cause.message : "Workflow snapshot entry validation failed", { cause }));
				}
			}
			invalidateSnapshot() {
				this.#snapshot.clear();
				this.#snapshotInvalidated = true;
				this.#emitSnapshotChanged();
			}
			resetSnapshotInvalidation() {
				if (!this.#snapshotInvalidated) return;
				this.#snapshot.clear();
				this.#snapshotInvalidated = false;
				this.#emitSnapshotChanged();
			}
			clearSnapshot() {
				this.#snapshot.clear();
				this.#emitSnapshotChanged();
			}
			clearSessionRecords() {
				this.#records.clear();
				this.#snapshot.clear();
				this.#snapshotInvalidated = false;
				this.#emitSnapshotChanged();
			}
			#emitSnapshotChanged() {
				for (const listener of this.#snapshotListeners) {
					try {
						const notification = listener();
						if (notification !== undefined) void notification.catch((cause) => {
							void cause;
						});
					} catch (cause) {
						void cause;
					}
				}
			}
			recordUnknown(input) {
				const target = this.activeAnalysisBinding()?.target;
				const recorded = this.#records.recordUnknown(input, target);
				if (recorded.ok) this.#emitSnapshotChanged();
				return recorded;
			}
			recordEvidenceWithUnknown(evidence, input) {
				const recorded = this.#records.recordEvidenceWithUnknown(evidence, input);
				if (recorded.ok) this.#emitSnapshotChanged();
				return recorded;
			}
			updateUnknown(input) {
				const target = this.activeAnalysisBinding()?.target;
				const updated = this.#records.updateUnknown(input, target);
				if (updated.ok) this.#emitSnapshotChanged();
				return updated;
			}
			listUnknowns(filters = {}) {
				return this.#records.listUnknowns(filters);
			}
			listUnknownsPage(query = {}) {
				return this.#records.listUnknownsPage(query);
			}
			verifyUnknownResolution(unknownId) {
				return this.#records.verifyUnknownResolution(unknownId);
			}
		};
	})))();
}

//#endregion
//#region dist/application/binary/BinarySessionOpen.js
var resolveSessionOpen, resolveSessionTarget, validateResolvedSessionTarget, sameSessionTarget, validateSnapshot;
function init_BinarySessionOpen() {
	return (init_BinarySessionOpen = __esmMin((() => {
		init_analysisSnapshot();
		init_BinaryTargetResolver();
		init_evidenceErrors();
		init_result();
		init_SessionProviderRouter();
		resolveSessionOpen = async (input) => {
			const { path, options } = input;
			const parsed = await parseBinaryTarget(path, {
				...options.targetKind === undefined ? {} : { targetKind: options.targetKind },
				...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
				...options.architecture === undefined ? {} : { architecture: options.architecture },
				...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint },
				...options.signal === undefined ? {} : { signal: options.signal }
			});
			if (!parsed.ok) return parsed;
			return resolveSessionTarget({
				...input,
				target: parsed.value
			});
		};
		resolveSessionTarget = async (input) => {
			const { router, current, target, options } = input;
			const sameTarget = sameSessionTarget(current?.target, target);
			const resolvedRoute = sameTarget && options.providerId === undefined && current !== undefined ? {
				ok: true,
				value: current.route
			} : await router.resolve(target, options.providerId, options.signal);
			if (!resolvedRoute.ok) return resolvedRoute;
			return validateResolvedSessionTarget({
				...input,
				route: resolvedRoute.value
			});
		};
		validateResolvedSessionTarget = (input) => {
			const { current, target, route, options, stagedSnapshotMatches } = input;
			const sameTarget = sameSessionTarget(current?.target, target);
			const snapshotError = validateSnapshot({
				snapshot: options.snapshot,
				target,
				profile: route.profile,
				current,
				stagedSnapshotMatches
			});
			if (snapshotError !== undefined) return err(snapshotError);
			return {
				ok: true,
				value: {
					target,
					route,
					sameTarget
				}
			};
		};
		sameSessionTarget = (current, target) => current !== undefined && current.path === target.path && (current.sourcePath ?? current.path) === (target.sourcePath ?? target.path) && snapshotMatchesTarget(snapshotTarget(current), target);
		validateSnapshot = ({ snapshot, target, profile, current, stagedSnapshotMatches }) => {
			if (snapshot !== undefined && (profile === null || !snapshotMatchesBinding(snapshot, target, profile))) return new AnalysisSnapshotMismatchError("Analysis snapshot profile_mismatch: target, provider, or analysis profile does not match the requested binary");
			if (current === undefined && !stagedSnapshotMatches(target, profile)) return new AnalysisSnapshotMismatchError("Analysis snapshot profile_mismatch: staged target, provider, or analysis profile does not match");
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/application/binary/BinarySessionExecution.js
var prepareSessionExecution, commitExecutionProfile, bindExecutionTarget, isArtifactBundleSubject;
function init_BinarySessionExecution() {
	return (init_BinarySessionExecution = __esmMin((() => {
		init_analysisErrorCore();
		init_configurationErrors();
		init_providerAdapterError();
		init_result();
		init_AnalysisSnapshotCache();
		prepareSessionExecution = (input) => {
			const { active, operation, parameters, nativeSourceAdmitted, unboundOperationError, lookupSnapshot } = input;
			if (active === undefined) return err(new NoBinaryOpenError());
			const capability = active.route.capabilities.get(operation);
			if (capability?.available !== true) {
				const selectionError = unboundOperationError(operation, active.route);
				if (selectionError !== undefined) return err(selectionError);
				return err(new AnalysisCapabilityUnavailableError(active.route.binding?.identity.id ?? active.route.identity.id, operation, capability?.reason ?? "operation is not declared by this provider"));
			}
			const profile = active.profile !== null && capability.provider.id === active.profile.provider.id ? active.profile : undefined;
			const cacheable = profile !== undefined && isSnapshotCacheable(operation, capability, parameters);
			const cached = cacheable && (!requiresNativeSourceAdmissionBeforeReplay(capability.provider.id) || nativeSourceAdmitted) ? lookupSnapshot(active.target, profile, operation, parameters) : undefined;
			return ok({
				active,
				capability,
				profile,
				cacheable,
				cached
			});
		};
		commitExecutionProfile = (operation, result, profile) => {
			if (!result.ok || profile === undefined) return result;
			const provider = result.value.provider;
			if (provider.id !== profile.provider.id || provider.name !== profile.provider.name || provider.version !== profile.provider.version) return err(new ProviderAdapterError(profile.provider.id, `${operation}:profile`));
			return ok({
				...result.value,
				analysisProfile: structuredClone(profile)
			});
		};
		bindExecutionTarget = (result, operation, target) => {
			if (!result.ok) return result;
			const subject = {
				path: target.path,
				sha256: target.sha256,
				format: target.format === "analysis-database" ? "analysis-database" : target.format,
				...target.architecture === undefined ? {} : { architecture: target.architecture }
			};
			if (result.value.subject !== null && result.value.subject.sha256 !== target.sha256 && !isArtifactBundleSubject(operation, result.value.subject, target)) return err(new ProviderAdapterError(result.value.provider.id, `${operation}:subject`));
			return ok({
				...result.value,
				subject: result.value.subject ?? subject
			});
		};
		isArtifactBundleSubject = (operation, subject, target) => (operation === "inventory_artifact" || operation === "inspect_artifact" || operation === "extract_artifact") && subject.path === (target.sourcePath ?? target.path);
	})))();
}

//#endregion
//#region dist/application/binary/BinarySession.js
var OFFICIAL_OPERATIONS, ENHANCED_OPERATIONS, BinarySession, isAborted$1;
function init_BinarySession() {
	return (init_BinarySession = __esmMin((() => {
		init_analysisProfile();
		init_analysisErrorCore();
		init_result();
		init_evidence();
		init_officialToolContracts();
		init_enhancedToolContracts();
		init_SessionProviderRouter();
		init_InvestigationRecords();
		init_BinarySessionRecords();
		init_BinarySessionStatus();
		init_BinarySessionOpen();
		init_BinarySessionExecution();
		init_AnalysisClientCleanup();
		init_analysisErrorCleanup();
		OFFICIAL_OPERATIONS = new Set(OFFICIAL_TOOL_CONTRACTS.map(({ name }) => name));
		ENHANCED_OPERATIONS = new Set(ENHANCED_TOOL_CONTRACTS.map(({ name }) => name));
		BinarySession = class extends BinarySessionRecords {
			#active;
			#externalMutationCleanupFailure;
			#pendingCleanup;
			#transition = Promise.resolve();
			#transitionGeneration = 0;
			#transitionPending = 0;
			#calls = new Map();
			#promptCompletionControllers = new Set();
			#providerRouter;
			#runtimeUnavailability = new Map();
			#availabilityListeners = new Set();
			constructor(providerRouter, records = new InvestigationRecords()) {
				super(records);
				this.#providerRouter = providerRouter;
			}
			/**
			* Fast-path liveness gate (#1719): short-circuit only when the retained
			* client is genuinely alive. The probe reads the child's operation health
			* rather than the composite's unconditionally-ok `health`, so a dead child
			* falls through and a real client is started; an aborted caller leaves the
			* session untouched. Returns the fast-path result, or undefined to fall
			* through to the slow path.
			*/
			async #tryRetainedFastPath(retained, target, options) {
				const live = await this.#retainedClientLive(retained.client, options);
				if (isAborted$1(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				if (!live) return undefined;
				if (options.snapshot !== undefined) {
					const imported = this.importAnalysisSnapshot(options.snapshot);
					if (!imported.ok) return imported;
				}
				return ok(target);
			}
			/** Identify the provider producing evidence for this session. */
			providerIdentity(operation) {
				const route = this.#currentRoute();
				let selected = route.binding?.identity ?? route.identity;
				if (operation !== undefined) {
					const exact = route.capabilities.get(operation)?.provider;
					if (exact !== undefined) selected = exact;
					else if (ENHANCED_OPERATIONS.has(operation)) {
						const providers = new Map();
						for (const descriptor of route.capabilities.values()) if (descriptor.available && OFFICIAL_OPERATIONS.has(descriptor.operation)) providers.set(descriptor.provider.id, descriptor.provider);
						if (providers.size === 1) {
							const provider = providers.values().next().value;
							if (provider !== undefined) selected = provider;
						}
					}
				}
				return structuredClone(selected);
			}
			/** External live state cannot be replayed by a direct or composed CLI workflow. */
			allowsSnapshotReplay(operation) {
				const capabilities = this.#active?.route.capabilities;
				const descriptor = capabilities?.get(operation);
				if (descriptor !== undefined) return descriptor.cachePolicy !== "live";
				return ![...capabilities?.values() ?? []].some(({ cachePolicy }) => cachePolicy === "live");
			}
			invalidateSnapshotForExternalMutation() {
				this.invalidateSnapshot();
			}
			/** Return the selected immutable profile, optionally scoped to an operation. */
			analysisProfile(operation) {
				const profile = this.#active?.profile;
				if (profile === null || profile === undefined) return undefined;
				if (operation !== undefined && this.providerIdentity(operation).id !== profile.provider.id) return undefined;
				return structuredClone(profile);
			}
			/** Observe runtime provider-health changes that affect discovery metadata. */
			onAvailabilityChanged(listener) {
				this.#availabilityListeners.add(listener);
				return () => this.#availabilityListeners.delete(listener);
			}
			/** Resolve a target and provider profile without creating a provider client. */
			previewTarget(target, options = {}) {
				if (isAborted$1(options.signal)) return Promise.resolve(err(new AnalysisCancelledError("open_binary")));
				return resolveSessionTarget({
					router: this.#providerRouter,
					current: this.#active,
					target,
					options,
					stagedSnapshotMatches: (target, profile) => this.matchesSnapshot(target, profile)
				}).then((resolved) => isAborted$1(options.signal) ? err(new AnalysisCancelledError("open_binary")) : resolved);
			}
			/**
			* Open or switch targets after draining calls against the current target.
			* Returns the switch failure even if best-effort restoration also fails.
			*/
			open(path, options = {}) {
				return this.#open(() => resolveSessionOpen({
					router: this.#providerRouter,
					current: this.#active,
					path,
					options,
					stagedSnapshotMatches: (target, profile) => this.matchesSnapshot(target, profile)
				}), options);
			}
			/** Open a previewed target without repeating parsing or provider profile discovery. */
			openResolvedTarget(resolved, options = {}) {
				return this.#open(() => Promise.resolve(validateResolvedSessionTarget({
					...resolved,
					current: this.#active,
					options,
					stagedSnapshotMatches: (target, profile) => this.matchesSnapshot(target, profile)
				})), options);
			}
			#open(resolve, options) {
				return this.#serialize((admittedThrough) => this.#openWithinTransition(admittedThrough, resolve, options));
			}
			async #openWithinTransition(admittedThrough, resolve, options) {
				if (this.#externalMutationCleanupFailure?.cleanupIncomplete === true) return err(this.#externalMutationCleanupFailure);
				if (isAborted$1(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				const resolved = await resolve();
				if (!resolved.ok) return resolved;
				const { target, route, sameTarget } = resolved.value;
				const { profile } = route;
				if (isAborted$1(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				const activeProfile = this.#active?.profile;
				const sameProfile = activeProfile === null || activeProfile === undefined ? profile === null : profile !== null && analysisProfilesEqual(activeProfile, profile);
				await this.#drainCalls(admittedThrough);
				if (isAborted$1(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				const pendingClosed = await this.#retryPendingCleanup();
				if (!pendingClosed.ok) return pendingClosed;
				if (isAborted$1(options.signal)) return err(new AnalysisCancelledError("open_binary"));
				const retained = sameTarget && sameProfile ? this.#active : undefined;
				if (retained !== undefined) {
					const fastPath = await this.#tryRetainedFastPath(retained, target, options);
					if (fastPath !== undefined) return fastPath;
				}
				const previous = this.#active;
				this.#active = undefined;
				if (previous !== undefined) {
					const closed = await this.#retireClient(previous.client, previous.route.identity.id);
					if (!closed.ok) {
						this.clearSnapshot();
						this.#clearRuntimeAvailability();
						return closed;
					}
				}
				if (isAborted$1(options.signal)) return err(await this.#restoreAfterFailedOpen(previous, new AnalysisCancelledError("open_binary")));
				const runId = randomUUID();
				const client = route.createClient(target, { runId });
				const started = await client.execute("health", {}, options);
				if (!started.ok) {
					return err(await this.#failedOpen(client, route.identity.id, previous, started.error));
				}
				if (isAborted$1(options.signal)) {
					return err(await this.#failedOpen(client, route.identity.id, previous, new AnalysisCancelledError("open_binary")));
				}
				this.#active = {
					target,
					client,
					profile,
					route,
					runId,
					nativeSourceAdmitted: false
				};
				this.#clearRuntimeAvailability();
				this.resetSnapshotInvalidation();
				if (options.snapshot === undefined) {
					if (profile === null) this.clearSnapshot();
					else this.selectSnapshot(target, profile);
				}
				if (options.snapshot !== undefined) {
					const imported = this.importAnalysisSnapshot(options.snapshot);
					if (!imported.ok) {
						this.#active = undefined;
						return err(await this.#failedOpen(client, route.identity.id, previous, imported.error));
					}
				}
				return ok(target);
			}
			/** Serialize an external mutation and retire the potentially stale analysis. */
			withAdmittedExternalMutation(_path, signal, operation, retirementFailure, operationName = "execute_rizin_command", cleanupRecovery) {
				return this.#serialize(async (admittedThrough) => {
					if (isAborted$1(signal)) return err(new AnalysisCancelledError(operationName));
					await this.#drainCalls(admittedThrough);
					if (isAborted$1(signal)) return err(new AnalysisCancelledError(operationName));
					if (this.#externalMutationCleanupFailure?.cleanupIncomplete === true) {
						if (cleanupRecovery === undefined) return err(this.#externalMutationCleanupFailure);
						const recovered = await cleanupRecovery(this.#externalMutationCleanupFailure);
						if (!recovered.ok) return recovered;
						if (this.#externalMutationCleanupFailure.cleanupIncomplete) return err(this.#externalMutationCleanupFailure);
						this.#externalMutationCleanupFailure = undefined;
					}
					const pendingCleanup = await this.#retryPendingCleanup();
					if (!pendingCleanup.ok) return pendingCleanup;
					const activeAtDispatch = this.#active;
					if (activeAtDispatch?.route.binding?.identity.id === "ghidra") return err(new AnalysisOutputError(operationName, "Close the active Ghidra session explicitly before an external mutation; rebinding would discard its ephemeral analysis edits."));
					const retireTarget = activeAtDispatch !== undefined;
					this.invalidateSnapshot();
					const value = await operation();
					this.#externalMutationCleanupFailure = !value.ok && value.error.cleanupIncomplete ? value.error : undefined;
					if (!retireTarget) return ok(value);
					const retired = await this.#closeActive({}, false);
					if (!retired.ok) return err(retirementFailure(value, retired.error));
					return ok(value);
				});
			}
			/** Close the active target, if any. */
			close(options = {}) {
				return this.#serialize(async (admittedThrough) => {
					await this.#drainCalls(admittedThrough);
					return this.#closeActive(options);
				});
			}
			/** Drain earlier requests, save an immutable snapshot, and close under one lifecycle lock. */
			closeWithSnapshot(path, overwrite, options = {}) {
				return this.#serialize(async (admittedThrough) => {
					await this.#drainCalls(admittedThrough);
					const snapshot = this.exportAnalysisSnapshot();
					if (!snapshot.ok) return snapshot;
					const written = await this.writeAnalysisSnapshot(snapshot.value, path, overwrite);
					if (!written.ok) return written;
					const closed = await this.#closeActive(options);
					return closed.ok ? ok({
						...written.value,
						primitive_entries: snapshot.value.entries.length,
						workflow_entries: snapshot.value.workflow_entries.length,
						evidence_records: snapshot.value.evidence_bundle.records.length
					}) : closed;
				});
			}
			async #closeActive(options, clearRecords = true) {
				const previous = this.#active;
				this.#active = undefined;
				const closed = previous === undefined ? await this.#retryPendingCleanup(options.progress, options.retainProviderDocuments) : await this.#retireClient(previous.client, previous.route.identity.id, {
					...options.progress === undefined ? {} : { progress: options.progress },
					...options.retainProviderDocuments === true ? { retainDocument: true } : {}
				});
				if (clearRecords) this.clearSessionRecords();
				this.#clearRuntimeAvailability();
				const fileResources = await this.closeWriteResources();
				if (!closed.ok && !fileResources.ok) return err(analysisErrorWithCleanupFailure(closed.error, fileResources.error, "close_binary"));
				return closed.ok ? fileResources : closed;
			}
			async #retireClient(client, providerId, options = {}) {
				this.#pendingCleanup = {
					client,
					providerId,
					retainDocument: options.retainDocument === true
				};
				return this.#retryPendingCleanup(options.progress);
			}
			async #retryPendingCleanup(progress, retainDocument) {
				let pending = this.#pendingCleanup;
				if (pending === undefined) return ok(null);
				if (retainDocument !== undefined) {
					pending = {
						...pending,
						retainDocument
					};
					this.#pendingCleanup = pending;
				}
				const closed = await closeAnalysisClient(pending.client, pending.providerId, {
					...progress === undefined ? {} : { progress },
					...pending.retainDocument ? { retainDocument: true } : {}
				});
				if (closed.ok) this.#pendingCleanup = undefined;
				return closed;
			}
			async #failedOpen(client, providerId, previous, primary) {
				const closed = await this.#retireClient(client, providerId);
				if (!closed.ok) return analysisErrorWithCleanupFailure(primary, closed.error, "open_binary");
				return this.#restoreAfterFailedOpen(previous, primary);
			}
			async #restoreAfterFailedOpen(previous, primary) {
				const restored = await this.#restore(previous);
				return restored.ok ? primary : analysisErrorWithCleanupFailure(primary, restored.error, "open_binary");
			}
			/** Describe the active binary session. */
			status() {
				return binarySessionStatus({
					target: this.#active?.target,
					route: this.#currentRoute(),
					router: this.#providerRouter,
					runtimeUnavailability: this.#runtimeUnavailability,
					runId: this.#active?.runId,
					runtimeLineageSnapshots: this.#active?.client.runtimeLineageSnapshots?.() ?? [],
					requestActivitySnapshots: this.#active?.client.requestActivitySnapshots?.() ?? [],
					providerOperationHealth: this.#active?.client.operationHealthSnapshot?.() ?? null
				});
			}
			/** Return the immutable artifact identity captured before its provider started. */
			activeTarget() {
				return this.#active === undefined ? undefined : structuredClone(this.#active.target);
			}
			activeAnalysisBinding() {
				return this.#active;
			}
			/**
			* Invoke a provider operation against the active target.
			* Calls may overlap, but a pending target transition prevents new calls from
			* entering until the transition has settled.
			*/
			execute(name, arguments_, options) {
				const generation = this.#transitionGeneration;
				const call = this.#execute(name, arguments_, options, this.#transition);
				this.#calls.set(call, generation);
				return call.finally(() => this.#calls.delete(call));
			}
			/** Run a prompt lookup only against an already connected provider child. */
			executeIfProviderReady(name, arguments_, options) {
				const active = this.#active;
				if (this.#transitionPending > 0 || active === undefined || active.client.executeIfReady === undefined) return Promise.resolve(undefined);
				const controller = new AbortController();
				this.#promptCompletionControllers.add(controller);
				const signal = options?.signal === undefined ? controller.signal : AbortSignal.any([controller.signal, options.signal]);
				const generation = this.#transitionGeneration;
				const call = active.client.executeIfReady(name, arguments_, {
					...options,
					signal
				});
				this.#calls.set(call, generation);
				return call.finally(() => {
					this.#calls.delete(call);
					this.#promptCompletionControllers.delete(controller);
				});
			}
			/** Admit one composed request until its result and session bookkeeping settle. */
			withAdmittedAnalysis(operationName, signal, operation) {
				const generation = this.#transitionGeneration;
				const transition = this.#transition;
				const call = (async () => {
					const admission = await this.#waitForTransition(operationName, signal, transition);
					if (!admission.ok) return admission;
					return ok(await operation({ execute: (name, arguments_, options) => this.#execute(name, arguments_, options, Promise.resolve()) }));
				})();
				this.#calls.set(call, generation);
				return call.finally(() => this.#calls.delete(call));
			}
			async #execute(name, arguments_, options, transition) {
				const transitioned = await this.#waitForTransition(name, options?.signal, transition);
				if (!transitioned.ok) return transitioned;
				const prepared = prepareSessionExecution({
					active: this.#active,
					operation: name,
					parameters: arguments_,
					nativeSourceAdmitted: this.#active?.nativeSourceAdmitted === true,
					unboundOperationError: (operation, route) => this.#providerRouter.unboundOperationError(operation, route),
					lookupSnapshot: (target, profile, operation, parameters) => operation === "decode_interface_builder" || operation === "inspect_asset_catalog" || operation === "inspect_keyed_archive" || operation === "trace_dylib_resolution" ? undefined : this.lookupSnapshot(target, profile, operation, parameters)
				});
				if (!prepared.ok) return prepared;
				const { active, capability, profile, cacheable, cached } = prepared.value;
				if (cached !== undefined) return ok(cached);
				if (capability.effects.mutatesArtifact) this.invalidateSnapshot();
				const call = active.client.execute(name, arguments_, options);
				const result = await call;
				const profiled = bindExecutionTarget(commitExecutionProfile(name, result, profile), name, active.target);
				const execution = profiled.ok && (name === "procedure_callers" || name === "procedure_callees") && profiled.value.relationshipCoverage === undefined ? ok({
					...profiled.value,
					relationshipCoverage: {
						status: "unknown",
						reason: "Provider did not report relationship coverage for this observation."
					}
				}) : profiled;
				if (execution.ok && capability.provider.id === "ghidra" && this.#active === active) this.#active.nativeSourceAdmitted = true;
				this.#observeRuntimeAvailability(name, execution);
				if (execution.ok && cacheable && profile !== undefined && name !== "decode_interface_builder" && name !== "inspect_asset_catalog" && name !== "inspect_keyed_archive" && name !== "trace_dylib_resolution") {
					const evidence = createEvidence(execution.value.subject ?? active.target, execution.value.provider, {
						operation: name,
						parameters: arguments_,
						result: execution.value.result,
						analysisProfile: profile,
						rawResult: execution.value.rawResult,
						limitations: execution.value.limitations,
						...execution.value.relationshipCoverage === undefined ? {} : { relationshipCoverage: execution.value.relationshipCoverage },
						locations: execution.value.locations
					});
					const recorded = this.recordEvidence(evidence);
					if (!recorded.ok) return recorded;
					this.recordSnapshot({
						target: active.target,
						profile,
						operation: name,
						parameters: arguments_,
						execution: execution.value
					});
				}
				return execution;
			}
			#observeRuntimeAvailability(operation, result) {
				if (result.ok) {
					if (this.#markRuntimeAvailable(operation)) this.#emitAvailabilityChanged();
					return;
				}
				if (result.error._tag === "AnalysisCapabilityUnavailableError") {
					if (this.#markRuntimeUnavailable(operation, result.error.message)) this.#emitAvailabilityChanged();
					return;
				}
				if ([
					"ProviderAdapterError",
					"HopperProcessError",
					"HopperStartError"
				].includes(result.error._tag)) {
					const capabilities = this.#active?.route.capabilities;
					const providerId = capabilities?.get(operation)?.provider.id;
					let changed = false;
					for (const descriptor of capabilities?.values() ?? []) if (providerId !== undefined && descriptor.provider.id === providerId) changed = this.#markRuntimeUnavailable(descriptor.operation, `${result.error._tag}: ${result.error.message}`) || changed;
					if (changed) this.#emitAvailabilityChanged();
				}
			}
			#markRuntimeAvailable(operation) {
				return this.#runtimeUnavailability.delete(operation);
			}
			#markRuntimeUnavailable(operation, reason) {
				const current = this.#runtimeUnavailability.get(operation);
				if (current?.reason === reason) return false;
				this.#runtimeUnavailability.set(operation, { reason });
				return true;
			}
			#clearRuntimeAvailability() {
				if (this.#runtimeUnavailability.size === 0) return;
				this.#runtimeUnavailability.clear();
				this.#emitAvailabilityChanged();
			}
			#emitAvailabilityChanged() {
				for (const listener of this.#availabilityListeners) {
					try {
						const notification = listener();
						if (notification !== undefined) {
							void notification.catch(() => undefined);
						}
					} catch (cause) {
						void cause;
					}
				}
			}
			#currentRoute() {
				return this.#active?.route ?? this.#providerRouter.initialRoute();
			}
			#serialize(operation) {
				for (const controller of this.#promptCompletionControllers) controller.abort();
				this.#transitionPending += 1;
				const admittedThrough = this.#transitionGeneration++;
				const result = this.#transition.then(() => operation(admittedThrough), () => operation(admittedThrough));
				this.#transition = result.then(() => undefined, () => undefined);
				void result.then(() => {
					this.#transitionPending -= 1;
				}, () => {
					this.#transitionPending -= 1;
				});
				return result;
			}
			async #drainCalls(admittedThrough) {
				await Promise.allSettled([...this.#calls].filter(([, generation]) => generation <= admittedThrough).map(([call]) => call));
			}
			/**
			* Probe whether a retained provider client is still live.
			*
			* On production routes the client is a CompositeProvider whose `health`
			* answers unconditionally ok without touching a child, so `health` alone
			* cannot see a dead child. `operationHealthSnapshot` reaches the
			* instantiated children instead. Only the known-live states allow the
			* fast path: `exited`/`unreachable` are dead, `unknown` is never
			* evidence of health (it is what a recorded but uncharacterized failure
			* reports), and `not_started` is a startup that never completed — in the
			* Hopper timeout case the client holds retained resources that block the
			* next `start()` until `close()` retries cleanup, so treating it as live
			* would skip the retire path and hand the wedged client to subsequent
			* analysis. The gate fails closed: without a snapshot signal, fall back
			* to the `health` admission probe.
			*/
			async #retainedClientLive(client, options) {
				const snapshot = client.operationHealthSnapshot?.();
				if (snapshot !== undefined) return snapshot.state === "idle" || snapshot.state === "busy";
				try {
					return (await client.execute("health", {}, options)).ok;
				} catch {
					return false;
				}
			}
			async #restore(previous) {
				if (previous === undefined) return ok(null);
				const runId = randomUUID();
				const client = previous.route.createClient(previous.target, { runId });
				const started = await client.execute("health", {});
				if (started.ok) {
					this.#active = {
						target: previous.target,
						client,
						profile: previous.profile,
						route: previous.route,
						runId,
						nativeSourceAdmitted: false
					};
					this.#clearRuntimeAvailability();
					return ok(null);
				}
				const closed = await this.#retireClient(client, previous.route.identity.id);
				return closed.ok ? ok(null) : err(analysisErrorWithCleanupFailure(started.error, closed.error, "open_binary"));
			}
			async #waitForTransition(operation, signal, transition) {
				if (signal?.aborted === true) return err(new AnalysisCancelledError(operation));
				if (signal === undefined) {
					await transition;
					return ok(undefined);
				}
				return new Promise((resolve) => {
					const onAbort = () => {
						resolve(err(new AnalysisCancelledError(operation)));
					};
					signal.addEventListener("abort", onAbort, { once: true });
					transition.then(() => {
						signal.removeEventListener("abort", onAbort);
						resolve(signal.aborted ? err(new AnalysisCancelledError(operation)) : ok(undefined));
					}, () => {
						signal.removeEventListener("abort", onAbort);
						resolve(signal.aborted ? err(new AnalysisCancelledError(operation)) : ok(undefined));
					});
				});
			}
		};
		isAborted$1 = (signal) => signal?.aborted === true;
	})))();
}

//#endregion
//#region dist/application/binary/BinarySessionComposition.js
var composeBinarySession;
function init_BinarySessionComposition() {
	return (init_BinarySessionComposition = __esmMin((() => {
		init_InvestigationRecords();
		init_AnalysisProviderRegistry();
		init_BinarySession();
		init_SessionProviderRouter();
		composeBinarySession = (registry, auxiliaryProviders = []) => new BinarySession(SessionProviderRouter.selectable(registry, auxiliaryProviders), new InvestigationRecords());
	})))();
}

//#endregion
//#region dist/application/binary/LazyAnalysisProvider.js
var isAborted, LazyAnalysisProvider, LazyAnalysisClient;
function init_LazyAnalysisProvider() {
	return (init_LazyAnalysisProvider = __esmMin((() => {
		init_analysisErrorCore();
		init_analysisErrorBase();
		init_providerAdapterError();
		init_result();
		init_AbortablePromise();
		isAborted = (signal) => signal?.aborted === true;
		LazyAnalysisProvider = class {
			#providerIdentity;
			#capabilityDescriptors;
			#loadProvider;
			#provider;
			constructor(options) {
				this.#providerIdentity = options.identity;
				this.#capabilityDescriptors = options.capabilities;
				this.#loadProvider = options.load;
			}
			/** Return source-declared provider identity without loading its implementation. */
			identity() {
				return this.#providerIdentity;
			}
			/** Return source-declared capability metadata without loading its implementation. */
			capabilities() {
				return this.#capabilityDescriptors;
			}
			/** Create a client whose implementation is loaded on first execution. */
			createClient(target, profile, context) {
				return new LazyAnalysisClient(async () => {
					const provider = await this.#load();
					return provider.createClient(target, profile, context);
				}, this.#providerIdentity.id);
			}
			async #load() {
				this.#provider ??= this.#loadProvider().catch((cause) => {
					this.#provider = undefined;
					throw cause;
				});
				return this.#provider;
			}
		};
		LazyAnalysisClient = class {
			#loadClient;
			#providerId;
			#client;
			#loading;
			#closed = false;
			executeIfReady = (operation, parameters, options) => this.#client?.executeIfReady?.(operation, parameters, options) ?? Promise.resolve(undefined);
			constructor(loadClient, providerId) {
				this.#loadClient = loadClient;
				this.#providerId = providerId;
			}
			execute = async (operation, parameters, options) => {
				try {
					if (isAborted(options?.signal)) return err(new AnalysisCancelledError(operation));
					const loaded = await waitForAbortable(this.#load(operation), options?.signal);
					if (loaded === ABORTED) return err(new AnalysisCancelledError(operation));
					return await loaded.execute(operation, parameters, options);
				} catch (cause) {
					if (cause instanceof AnalysisError) return err(cause);
					return err(new ProviderAdapterError(this.#providerId, operation, { cause }));
				}
			};
			runtimeLineageSnapshots() {
				return this.#client?.runtimeLineageSnapshots?.() ?? [];
			}
			requestActivitySnapshots() {
				return this.#client?.requestActivitySnapshots?.() ?? [];
			}
			operationHealthSnapshot() {
				return this.#client?.operationHealthSnapshot?.();
			}
			close = async (options) => {
				this.#closed = true;
				if (this.#loading === undefined) return ok(null);
				const client = await this.#loading;
				return client.close(options);
			};
			async #load(operation) {
				if (this.#closed) throw new ProviderAdapterError(this.#providerId, operation, { diagnostics: { reason: "client_closed" } });
				this.#loading ??= this.#loadClient().then((client) => {
					this.#client = client;
					return client;
				}).catch((cause) => {
					this.#loading = undefined;
					throw cause;
				});
				return this.#loading;
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedArtifactInspector.js
var flagNames, cliProjection, peProjection, base, unavailableResult, runtimeFamilyFromCliHeader, runtimeFamilyFor, implementationFor, managedArchitectureFor, runtimeClassification, partialMetadataResult, inspectManagedArtifactBytes;
function init_ManagedArtifactInspector() {
	return (init_ManagedArtifactInspector = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_managedArtifact();
		init_ManagedPeReader();
		init_ManagedMetadataInventory();
		init_ManagedMetadataLayout();
		init_ManagedTypeMemberLists();
		init_ManagedReaderFailure();
		flagNames = (flags) => {
			const names = [];
			for (const [mask, name] of [
				[1, "il-only"],
				[2, "32-bit-required"],
				[4, "il-library"],
				[8, "strong-name-signed"],
				[16, "native-entry-point"],
				[65536, "track-debug-data"],
				[131072, "32-bit-preferred"]
			]) if ((flags & mask) !== 0) names.push(name);
			return names;
		};
		cliProjection = (cli) => ({
			header_offset: cli.headerOffset,
			header_size: cli.headerSize,
			runtime_version: `${String(cli.runtimeMajor)}.${String(cli.runtimeMinor)}`,
			flags: cli.flags,
			flag_names: flagNames(cli.flags),
			entry_point: cli.entryPoint === 0 ? {
				kind: "none",
				value: null
			} : (cli.flags & 16) !== 0 ? {
				kind: "native-rva",
				value: `0x${cli.entryPoint.toString(16)}`
			} : {
				kind: "metadata-token",
				value: `0x${cli.entryPoint.toString(16).padStart(8, "0")}`
			},
			metadata_rva: cli.metadata.rva,
			metadata_size: cli.metadata.size,
			resources_rva: cli.resources.rva,
			resources_size: cli.resources.size,
			strong_name_rva: cli.strongName.rva,
			strong_name_size: cli.strongName.size,
			managed_native_header_rva: cli.managedNativeHeader.rva,
			managed_native_header_size: cli.managedNativeHeader.size,
			ready_to_run_signature: cli.readyToRunSignature
		});
		peProjection = (layout) => ({
			machine: layout.machine,
			machine_hex: `0x${layout.machine.toString(16).padStart(4, "0")}`,
			architecture: layout.architecture,
			optional_header: layout.optionalHeader,
			section_count: layout.sectionCount,
			characteristics: layout.characteristics,
			cli: layout.cli === null ? null : cliProjection(layout.cli)
		});
		base = (target, bytes, layout) => ({
			artifact: {
				path: target.path,
				sha256: target.sha256,
				byte_length: bytes.length,
				format: "pe"
			},
			pe: peProjection(layout)
		});
		unavailableResult = (target, bytes, layout) => {
			const malformed = layout.cliDirectoryState !== "absent";
			const issues = layout.cliIssue === null ? [] : [layout.cliIssue];
			const limitations = malformed ? ["The PE declares a CLI directory, but its CLI header could not be admitted."] : ["The PE has no CLI data directory; managed metadata and CIL are unavailable."];
			return managedArtifactInspectionSchema.parse(admitManagedProjection({
				...base(target, bytes, layout),
				classification: {
					status: malformed ? "malformed" : "not-managed",
					container: "pe",
					runtime_family: "unknown",
					implementation: malformed ? "unknown" : "not-managed",
					managed_architecture: "unknown",
					evidence: [{
						code: malformed ? "cli-directory-malformed" : "cli-directory-absent",
						detail: limitations[0],
						file_offset: layout.cliIssue?.offset ?? null
					}]
				},
				metadata: {
					status: malformed ? "malformed" : "absent",
					version: null,
					stream_names: [],
					table_row_counts: {}
				},
				module: null,
				assembly: null,
				target_frameworks: [],
				references: [],
				resources: [],
				attributes: [],
				coverage: {
					state: malformed ? "partial" : "unavailable",
					issues
				},
				limitations
			}));
		};
		runtimeFamilyFromCliHeader = (cli) => cli?.readyToRunSignature === true ? "modern-dotnet" : cli !== null && (cli.flags & 1) === 0 ? "mixed-clr-native" : "unknown";
		runtimeFamilyFor = (cli, inventory, metadata, layout) => {
			const evidence = [{
				code: "cli-header-observed",
				detail: "A file-backed PE CLI header and metadata root were admitted.",
				file_offset: cli.headerOffset
			}];
			const frameworks = inventory.targetFrameworks;
			const hasUnity = inventory.referenceNames.some((name) => name === "UnityEngine" || name.startsWith("UnityEngine."));
			let runtimeFamily = "unknown";
			if (runtimeFamilyFromCliHeader(cli) === "mixed-clr-native") {
				runtimeFamily = "mixed-clr-native";
				evidence.push({
					code: "cli-il-only-clear",
					detail: "COMIMAGE_FLAGS_ILONLY is clear, so managed and native analysis must remain composed.",
					file_offset: cli.headerOffset + 16
				});
			} else if (hasUnity) {
				runtimeFamily = "unity-mono";
				evidence.push({
					code: "unity-reference-observed",
					detail: "The admitted AssemblyRef table contains a UnityEngine reference.",
					file_offset: metadata.table(35)?.offset ?? null
				});
			} else if (frameworks.some((value) => value.startsWith(".NETFramework,"))) {
				runtimeFamily = "dotnet-framework";
				evidence.push({
					code: "target-framework-observed",
					detail: "An assembly-level TargetFrameworkAttribute names .NET Framework.",
					file_offset: metadata.table(12)?.offset ?? null
				});
			} else if (frameworks.some((value) => value.startsWith(".NETCoreApp,")) || cli.readyToRunSignature) {
				runtimeFamily = "modern-dotnet";
				evidence.push({
					code: cli.readyToRunSignature ? "ready-to-run-signature-observed" : "target-framework-observed",
					detail: cli.readyToRunSignature ? "The managed native header has the ReadyToRun signature." : "An assembly-level TargetFrameworkAttribute names modern .NET.",
					file_offset: cli.readyToRunSignature ? layout.rvaToOffset(cli.managedNativeHeader.rva, 4, "cli.managed-native-header") : metadata.table(12)?.offset ?? null
				});
			} else if (frameworks.some((value) => value.startsWith(".NETStandard,"))) {
				evidence.push({
					code: "target-framework-observed",
					detail: "An assembly-level TargetFrameworkAttribute names .NET Standard, an API specification that does not identify a runtime family.",
					file_offset: metadata.table(12)?.offset ?? null
				});
			}
			return {
				runtime_family: runtimeFamily,
				evidence
			};
		};
		implementationFor = (cli, metadata) => {
			if (cli.readyToRunSignature) return "cil-and-ready-to-run";
			if ((cli.flags & 1) === 0) return "cpp-cli-mixed";
			return (metadata.rowCounts[6] ?? 0) === 0 ? "metadata-only" : "cil";
		};
		managedArchitectureFor = (layout, cli) => {
			if (layout.architecture !== "x86" || (cli.flags & 1) === 0) return layout.architecture;
			const requirement = managedCli32BitRequirement(cli.flags);
			if (requirement === "required") return "x86";
			return requirement === "preferred" ? "anycpu-prefer-32" : "anycpu";
		};
		runtimeClassification = ({ layout, metadata, inventory }) => {
			const cli = layout.cli;
			if (cli === null) throw new TypeError("Managed classification requires CLI");
			const { runtime_family: runtimeFamily, evidence } = runtimeFamilyFor(cli, inventory, metadata, layout);
			const implementation = implementationFor(cli, metadata);
			const managedArchitecture = managedArchitectureFor(layout, cli);
			evidence.push({
				code: "managed-architecture-derived",
				detail: `Managed architecture ${managedArchitecture} is derived from PE machine and CLI flags.`,
				file_offset: cli.headerOffset + 16
			});
			return {
				runtime_family: runtimeFamily,
				implementation,
				managed_architecture: managedArchitecture,
				evidence
			};
		};
		partialMetadataResult = ({ target, bytes, layout, issue }) => ({
			...base(target, bytes, layout),
			classification: {
				status: issue.code === "resource-limit" ? "managed" : "malformed",
				container: "pe",
				runtime_family: runtimeFamilyFromCliHeader(layout.cli),
				implementation: "unknown",
				managed_architecture: "unknown",
				evidence: [{
					code: "metadata-not-admitted",
					detail: issue.detail,
					file_offset: issue.offset
				}]
			},
			metadata: {
				status: issue.code === "resource-limit" ? "partial" : "malformed",
				version: null,
				stream_names: [],
				table_row_counts: {}
			},
			module: null,
			assembly: null,
			target_frameworks: [],
			references: [],
			resources: [],
			attributes: [],
			coverage: {
				state: "partial",
				issues: [issue]
			},
			limitations: [issue.code === "resource-limit" ? "CLI metadata inspection stopped at its representation budget; omitted facts are unknown." : "CLI metadata could not be read because the PE/CLI structure is malformed or unsupported."]
		});
		inspectManagedArtifactBytes = (bytes, target) => {
			const layout = readManagedPeLayout(bytes);
			if (layout.cli === null) return unavailableResult(target, bytes, layout);
			const cli = layout.cli;
			let metadata;
			try {
				const metadataOffset = layout.rvaToOffset(cli.metadata.rva, cli.metadata.size, "cli.metadata");
				metadata = readManagedMetadataLayout(bytes, metadataOffset, cli.metadata.size);
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure)) throw cause;
				return managedArtifactInspectionSchema.parse(admitManagedProjection(partialMetadataResult({
					target,
					bytes,
					layout,
					issue: cause.issue
				})));
			}
			const resourceIssues = [];
			const resourceDirectory = readManagedResourceDirectory(layout, resourceIssues);
			try {
				const memberLists = readTypeMemberListFacts(bytes, metadata);
				const inventory = readManagedMetadataInventory(bytes, metadata, resourceDirectory, memberLists);
				const issues = [...resourceIssues, ...inventory.issues];
				const limitations = [...issues.length === 0 ? [] : ["At least one metadata or resource item could not be read; coverage is partial."], "Static inspection did not load the assembly, resolve dependencies through a CLR, decompile C#, or execute target code."];
				return managedArtifactInspectionSchema.parse(admitManagedProjection({
					...base(target, bytes, layout),
					classification: {
						status: "managed",
						container: "pe",
						...runtimeClassification({
							layout,
							metadata,
							inventory
						})
					},
					metadata: {
						status: issues.length === 0 ? "complete" : "partial",
						version: metadata.version,
						stream_names: metadata.streamNames,
						table_row_counts: managedTableRowCounts(metadata)
					},
					module: inventory.module,
					assembly: inventory.assembly,
					target_frameworks: inventory.targetFrameworks,
					references: inventory.references,
					resources: inventory.resources,
					attributes: inventory.attributes,
					coverage: {
						state: issues.length === 0 ? "complete" : "partial",
						issues
					},
					limitations
				}, managedDecodeBudget(metadata)));
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure)) throw cause;
				return managedArtifactInspectionSchema.parse(admitManagedProjection(partialMetadataResult({
					target,
					bytes,
					layout,
					issue: cause.issue
				})));
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedNativeBoundaryHelpers.js
var flagsHex, parseModuleRefs, parseFields, parseMethods, parseImplMaps, charSet, callConvention, bestFit, throwOnUnmappable, nativeImplementations, codeTypeFor, managedKindFor, boundaryKind, cliNative, nativeBoundarySummary, buildNativeBoundaryInspection;
function init_ManagedNativeBoundaryHelpers() {
	return (init_ManagedNativeBoundaryHelpers = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_managedArtifact();
		init_ManagedMetadataHeaps();
		init_ManagedMetadataInventory();
		init_ManagedPeReader();
		init_ManagedReaderFailure();
		flagsHex = (value) => `0x${value.toString(16).padStart(4, "0")}`;
		parseModuleRefs = (bytes, layout, heapExtent, issues) => {
			const refs = [];
			const table = layout.table(26);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 26, row);
					refs.push({
						token: metadataToken(26, row),
						row_offset: cursor.start,
						name: readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent)
					});
				}, issues);
			}
			return refs;
		};
		parseFields = (bytes, layout, heapExtent, issues) => {
			const fields = new Map();
			const table = layout.table(4);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 4, row);
					const flags = cursor.readUInt16();
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
					cursor.readIndex(layout.blobIndexSize);
					const token = metadataToken(4, row);
					fields.set(token, {
						token,
						rowOffset: cursor.start,
						kind: "field",
						name,
						flags,
						implFlags: null,
						rva: null
					});
				}, issues);
			}
			return fields;
		};
		parseMethods = (bytes, layout, heapExtent, issues) => {
			const methods = new Map();
			const table = layout.table(6);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 6, row);
					const rva = cursor.readUInt32();
					const implFlags = cursor.readUInt16();
					const flags = cursor.readUInt16();
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
					cursor.readIndex(layout.blobIndexSize);
					cursor.readIndex(layout.tableIndexSize(8));
					const token = metadataToken(6, row);
					methods.set(token, {
						token,
						rowOffset: cursor.start,
						kind: "method",
						name,
						flags,
						implFlags,
						rva
					});
				}, issues);
			}
			return methods;
		};
		parseImplMaps = ({ bytes, layout, heapExtent, modules, members, issues }) => {
			const moduleNames = new Map(modules.map((module) => [module.token, module]));
			const imports = [];
			const table = layout.table(28);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 28, row);
					const mappingFlags = cursor.readUInt16();
					const memberForwardedOffset = cursor.offset;
					const memberForwardedRaw = cursor.readIndex(layout.codedIndexSize("MemberForwarded"));
					const memberForwardedReason = metadataCodedTokenInvalidReason(memberForwardedRaw, 1, [4, 6], layout.rowCounts);
					if (memberForwardedReason !== null || memberForwardedRaw === 0) issues.push({
						code: "invalid-row",
						scope: `metadata.ImplMap:${metadataToken(28, row)}`,
						offset: memberForwardedOffset,
						detail: memberForwardedReason === null ? "ImplMap MemberForwarded coded index 0x0 is null, but the column must reference a Field or MethodDef row" : `ImplMap MemberForwarded coded index 0x${memberForwardedRaw.toString(16)} is invalid: ${memberForwardedReason}`
					});
					const memberToken = metadataCodedToken(memberForwardedRaw, 1, [4, 6], layout.rowCounts);
					const importName = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
					const importScopeOffset = cursor.offset;
					const importScopeRow = cursor.readIndex(layout.tableIndexSize(26));
					const moduleCount = layout.table(26)?.rowCount ?? 0;
					const validImportScope = importScopeRow > 0 && importScopeRow <= moduleCount;
					if (!validImportScope) issues.push({
						code: "invalid-row",
						scope: `metadata.ImplMap:${metadataToken(28, row)}`,
						offset: importScopeOffset,
						detail: `ImplMap ImportScope row ${String(importScopeRow)} must reference a ModuleRef row between 1 and ${String(moduleCount)}`
					});
					const importScopeToken = validImportScope ? metadataToken(26, importScopeRow) : null;
					const member = memberToken === null ? undefined : members.get(memberToken);
					imports.push({
						token: metadataToken(28, row),
						row_offset: cursor.start,
						mapping_flags: mappingFlags,
						mapping_flags_hex: flagsHex(mappingFlags),
						member_token: memberToken,
						member_kind: member?.kind ?? "unknown",
						member_name: member?.name ?? null,
						import_name: importName,
						import_scope_token: importScopeToken,
						import_scope_name: importScopeToken === null ? null : moduleNames.get(importScopeToken)?.name ?? null,
						no_mangle: (mappingFlags & 1) !== 0,
						char_set: charSet(mappingFlags),
						call_convention: callConvention(mappingFlags),
						supports_last_error: (mappingFlags & 64) !== 0,
						best_fit: bestFit(mappingFlags),
						throw_on_unmappable_char: throwOnUnmappable(mappingFlags),
						verification: "managed-declaration-only"
					});
				}, issues);
			}
			return imports;
		};
		charSet = (flags) => {
			switch (flags & 6) {
				case 0: return "not-specified";
				case 2: return "ansi";
				case 4: return "unicode";
				case 6: return "auto";
				default: return "unknown";
			}
		};
		callConvention = (flags) => {
			switch (flags & 1792) {
				case 0: return "not-specified";
				case 256: return "winapi";
				case 512: return "cdecl";
				case 768: return "stdcall";
				case 1024: return "thiscall";
				case 1280: return "fastcall";
				default: return "unknown";
			}
		};
		bestFit = (flags) => {
			switch (flags & 48) {
				case 0: return "assembly-default";
				case 16: return "enabled";
				case 32: return "disabled";
				default: return "unknown";
			}
		};
		throwOnUnmappable = (flags) => {
			switch (flags & 12288) {
				case 0: return "assembly-default";
				case 4096: return "enabled";
				case 8192: return "disabled";
				default: return "unknown";
			}
		};
		nativeImplementations = (methods, pinvokeTokens) => {
			const implementations = [];
			for (const method of methods) {
				if (method.kind !== "method") continue;
				const implFlags = method.implFlags ?? 0;
				const codeType = codeTypeFor(implFlags);
				const managedKind = managedKindFor(implFlags);
				const pinvokeDeclared = pinvokeTokens.has(method.token) || (method.flags & 8192) !== 0;
				if (!pinvokeDeclared && codeType === "il" && managedKind === "managed") continue;
				implementations.push({
					token: method.token,
					row_offset: method.rowOffset,
					name: method.name,
					rva: method.rva ?? 0,
					flags: method.flags,
					impl_flags: implFlags,
					code_type: codeType,
					managed_kind: managedKind,
					pinvoke_declared: pinvokeDeclared,
					boundary_kind: boundaryKind(pinvokeDeclared, codeType, managedKind),
					body_interpretation: codeType === "il" && managedKind === "managed" && !pinvokeDeclared ? "managed-cil" : method.rva === 0 ? "not-file-backed" : "native-or-runtime"
				});
			}
			return implementations;
		};
		codeTypeFor = (implFlags) => {
			switch (implFlags & 3) {
				case 0: return "il";
				case 1: return "native";
				case 2: return "optil";
				case 3: return "runtime";
				default: return "unknown";
			}
		};
		managedKindFor = (implFlags) => {
			switch (implFlags & 4) {
				case 0: return "managed";
				case 4: return "unmanaged";
				default: return "unknown";
			}
		};
		boundaryKind = (pinvokeDeclared, codeType, managedKind) => {
			if (pinvokeDeclared) return "pinvoke";
			if (codeType === "native") return "native-body";
			if (codeType === "runtime") return "runtime-provided";
			if (managedKind === "unmanaged") return "unmanaged-method";
			return "mixed-or-unknown";
		};
		cliNative = (pe) => {
			if (pe.cli === null) return null;
			return {
				il_only: (pe.cli.flags & 1) !== 0,
				requires_32bit: managedCli32BitRequirement(pe.cli.flags) === "required",
				strong_name_signed: (pe.cli.flags & 8) !== 0,
				native_entry_point: (pe.cli.flags & 16) !== 0,
				ready_to_run_signature: pe.cli.readyToRunSignature,
				managed_native_header_rva: pe.cli.managedNativeHeader.rva,
				managed_native_header_size: pe.cli.managedNativeHeader.size
			};
		};
		nativeBoundarySummary = (native, counts) => ({
			...counts,
			ready_to_run: native?.ready_to_run_signature ?? null,
			mixed_mode_or_native_header: native === null ? null : native.managed_native_header_rva !== 0 || native.managed_native_header_size !== 0 || native.native_entry_point
		});
		buildNativeBoundaryInspection = ({ target, bytes, layout, inventory, moduleRefs, imports, implementations, native, issues }) => managedNativeBoundaryInspectionSchema.parse(admitManagedProjection({
			artifact: {
				path: target.path,
				sha256: target.sha256,
				byte_length: bytes.length,
				format: "pe"
			},
			module: inventory.module,
			metadata: {
				status: issues.length === 0 ? "complete" : "partial",
				version: layout.version,
				table_row_counts: managedTableRowCounts(layout)
			},
			identity_scope: {
				token_identity: "build-local",
				requires_artifact_sha256: target.sha256,
				requires_mvid: inventory.module?.mvid ?? null
			},
			cli_native: native,
			module_refs: moduleRefs,
			pinvoke_imports: imports,
			native_implementations: implementations,
			summary: nativeBoundarySummary(native, {
				module_ref_count: moduleRefs.length,
				pinvoke_import_count: imports.length,
				native_implementation_count: implementations.length
			}),
			coverage: {
				state: issues.length === 0 ? "complete" : "partial",
				issues
			},
			limitations: [
				"P/Invoke rows prove managed import declarations only; this inspection does not verify that a native library, export, thunk, or provider-qualified function exists.",
				"Managed metadata tokens are build-local coordinates and are only meaningful with the reported artifact SHA-256 and MVID.",
				"ReadyToRun, NativeAOT, C++/CLI, and IL2CPP native semantics require separately selected native-provider evidence; this tool does not translate managed tokens into native addresses."
			]
		}, managedDecodeBudget(layout)));
	})))();
}

//#endregion
//#region dist/dotnet/ManagedNativeBoundaryInspector.js
var emptyInspection, readBoundaryInventory, inspectManagedNativeBoundariesBytes;
function init_ManagedNativeBoundaryInspector() {
	return (init_ManagedNativeBoundaryInspector = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_managedArtifact();
		init_ManagedMetadataInventory();
		init_ManagedMetadataLayout();
		init_ManagedTypeMemberLists();
		init_ManagedPeReader();
		init_ManagedReaderFailure();
		init_ManagedNativeBoundaryHelpers();
		emptyInspection = (target, bytes, classification, { native = null, issues = [] } = {}) => {
			return managedNativeBoundaryInspectionSchema.parse(admitManagedProjection({
				artifact: {
					path: target.path,
					sha256: target.sha256,
					byte_length: bytes.length,
					format: "pe"
				},
				module: null,
				metadata: {
					status: issues.some((issue) => issue.code === "resource-limit") ? "partial" : classification === "malformed" ? "malformed" : "absent",
					version: null,
					table_row_counts: {}
				},
				identity_scope: {
					token_identity: "build-local",
					requires_artifact_sha256: target.sha256,
					requires_mvid: null
				},
				cli_native: native,
				module_refs: [],
				pinvoke_imports: [],
				native_implementations: [],
				summary: nativeBoundarySummary(native, {
					module_ref_count: 0,
					pinvoke_import_count: 0,
					native_implementation_count: 0
				}),
				coverage: {
					state: "unavailable",
					issues
				},
				limitations: ["No CLI metadata was admitted; native boundary declarations are unavailable.", "Static inspection does not load or execute target code, so native export resolution is not performed."]
			}));
		};
		readBoundaryInventory = (bytes, pe, cli, issues) => {
			const metadataOffset = pe.rvaToOffset(cli.metadata.rva, cli.metadata.size, "cli.metadata");
			const layout = readManagedMetadataLayout(bytes, metadataOffset, cli.metadata.size);
			const memberLists = readTypeMemberListFacts(bytes, layout);
			const inventory = readManagedMetadataInventory(bytes, layout, readManagedResourceDirectory(pe, issues), memberLists);
			return {
				layout,
				inventory
			};
		};
		inspectManagedNativeBoundariesBytes = (bytes, target) => {
			const pe = readManagedPeLayout(bytes);
			if (pe.cli === null) return emptyInspection(target, bytes, pe.cliDirectoryState !== "absent" ? "malformed" : "not-managed", { issues: pe.cliIssue === null ? [] : [pe.cliIssue] });
			const issues = [];
			let layout;
			let inventory;
			try {
				({layout, inventory} = readBoundaryInventory(bytes, pe, pe.cli, issues));
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure)) throw cause;
				return emptyInspection(target, bytes, "malformed", {
					native: cliNative(pe),
					issues: [cause.issue]
				});
			}
			try {
				const heapExtent = Math.max(layout.strings.size, layout.blob.size);
				issues.push(...inventory.issues);
				const moduleRefs = parseModuleRefs(bytes, layout, heapExtent, issues);
				const members = new Map([...parseFields(bytes, layout, heapExtent, issues), ...parseMethods(bytes, layout, heapExtent, issues)]);
				const imports = parseImplMaps({
					bytes,
					layout,
					heapExtent,
					modules: moduleRefs,
					members,
					issues
				});
				const pinvokeTokens = new Set(imports.map(({ member_token }) => member_token).filter((token) => token !== null));
				const implementations = nativeImplementations(members.values(), pinvokeTokens);
				return buildNativeBoundaryInspection({
					target,
					bytes,
					pe,
					layout,
					inventory,
					moduleRefs,
					imports,
					implementations,
					native: cliNative(pe),
					issues
				});
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure)) throw cause;
				return emptyInspection(target, bytes, "malformed", {
					native: cliNative(pe),
					issues: [...issues, cause.issue]
				});
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedStaticProvider.js
var ManagedStaticProvider, ManagedStaticClient, isCleanupFailure, isManagedOperation, inspectManagedOperation, managedLocations;
function init_ManagedStaticProvider() {
	return (init_ManagedStaticProvider = __esmMin((() => {
		init_AnalysisProvider();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ManagedStaticProviderMetadata();
		init_InvestigationProviders();
		init_managedToolContracts();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_evidenceErrors();
		init_providerAdapterError();
		init_providerCleanupError();
		init_result();
		init_ManagedArtifactInspector();
		init_ManagedMemberInspector();
		init_ManagedNativeBoundaryInspector();
		init_RegularFileRead();
		init_ManagedReaderFailure();
		init_ManagedSnapshot();
		ManagedStaticProvider = class {
			#capabilities = managedStaticCapabilities();
			identity() {
				return MANAGED_STATIC_PROVIDER;
			}
			capabilities() {
				return this.#capabilities;
			}
			createClient(target) {
				return new ManagedStaticClient(target);
			}
		};
		ManagedStaticClient = class {
			target;
			#snapshotBytes;
			#resources = new ArtifactResourceScope();
			constructor(target) {
				this.target = target;
			}
			async execute(operation, parameters, options) {
				if (operation === "health") return ok(createAnalysisExecution(null, MANAGED_STATIC_PROVIDER));
				if (!isManagedOperation(operation)) return err(new AnalysisCapabilityUnavailableError(MANAGED_STATIC_PROVIDER.id, operation, "Operation is not implemented by the managed static provider."));
				if (this.target.format !== "pe") return err(new AnalysisCapabilityUnavailableError(MANAGED_STATIC_PROVIDER.id, operation, `Managed static triage requires a PE target; observed ${this.target.format}.`));
				try {
					if (options?.signal?.aborted === true) return err(new AnalysisCancelledError(operation));
					const snapshot = this.#snapshotBytes;
					const observed = snapshot === undefined ? await readManagedSnapshot(this.target.path, operation, {
						signal: options?.signal,
						resources: this.#resources
					}) : await hashManagedSource(this.target.path, operation, {
						signal: options?.signal,
						resources: this.#resources
					});
					if (observed.sha256 !== this.target.sha256) return err(new EvidenceIntegrityError(`Managed artifact digest changed after open: expected ${this.target.sha256}, observed ${observed.sha256} at ${this.target.path}`));
					const bytes = snapshot ?? observed.bytes;
					if (bytes === undefined) throw new TypeError("Managed snapshot bytes are unavailable");
					this.#snapshotBytes = bytes;
					const result = inspectManagedOperation(operation, parameters, bytes, this.target);
					return ok(createAnalysisExecution(result, MANAGED_STATIC_PROVIDER, {
						rawResult: null,
						limitations: result.limitations,
						subject: this.target,
						locations: managedLocations(result)
					}));
				} catch (cause) {
					if (isCleanupFailure(cause)) return err(this.#cleanupError(operation, cause));
					if (cause instanceof AnalysisError) return err(cause);
					if (options?.signal?.aborted === true) return err(new AnalysisCancelledError(operation));
					if (cause instanceof ManagedReaderFailure && cause.issue.code !== "resource-limit") return err(new AnalysisInputError(operation, { cause }, [{
						path: ["path"],
						reason: "invalid_format",
						message: `Selected artifact ${this.target.path}: ${cause.issue.detail}`
					}]));
					return err(new ProviderAdapterError(MANAGED_STATIC_PROVIDER.id, operation, { cause }));
				}
			}
			async close() {
				this.#snapshotBytes = undefined;
				try {
					await this.#resources.close();
					return ok(null);
				} catch (cause) {
					return err(this.#cleanupError("close", cause));
				}
			}
			#cleanupError(operation, cause) {
				const failure = managedCleanupError(cause, this.target.path, operation);
				if (failure instanceof ProviderCleanupError) return failure;
				const cleanup = cause instanceof ArtifactReaderFailure ? cause.cleanup : undefined;
				return new ProviderCleanupError(MANAGED_STATIC_PROVIDER.id, cleanup?.resources ?? [this.target.path], { reason: cleanup?.reason ?? (cause instanceof Error ? cause.message : String(cause)) }, {
					cause,
					operation
				});
			}
		};
		isCleanupFailure = (cause) => cause instanceof RegularFileCleanupFailure || cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined;
		isManagedOperation = (operation) => MANAGED_TOOL_CONTRACTS.some(({ name }) => name === operation);
		inspectManagedOperation = (operation, parameters, bytes, target) => {
			if (operation === "inspect_managed_members") {
				const { type_names: typeNames } = managedMembersInputSchema.parse(parameters);
				return inspectManagedMembersBytes(bytes, target, typeNames === undefined ? {} : { typeNames });
			}
			managedTargetInputSchema.parse(parameters);
			if (operation === "inspect_managed_artifact") {
				return inspectManagedArtifactBytes(bytes, target);
			}
			return inspectManagedNativeBoundariesBytes(bytes, target);
		};
		managedLocations = (result) => {
			if ("pe" in result) {
				if (result.pe.cli === null) return [{
					kind: "file-offset",
					offset: 0
				}];
				return [{
					kind: "file-offset-range",
					start: result.pe.cli.header_offset,
					end: result.pe.cli.header_offset + result.pe.cli.header_size
				}, ...[result.module, result.assembly].filter((value) => value !== null).map((value) => ({
					kind: "file-offset",
					offset: value.row_offset
				}))];
			}
			if ("methods" in result) return [...result.module === null ? [{
				kind: "file-offset",
				offset: 0
			}] : [{
				kind: "file-offset",
				offset: result.module.row_offset
			}], ...result.methods.filter((method) => method.body.file_offset !== null).map((method) => ({
				kind: "file-offset",
				offset: method.body.file_offset ?? 0
			}))];
			return [...result.module === null ? [{
				kind: "file-offset",
				offset: 0
			}] : [{
				kind: "file-offset",
				offset: result.module.row_offset
			}], ...result.pinvoke_imports.map((mapping) => ({
				kind: "file-offset",
				offset: mapping.row_offset
			}))];
		};
	})))();
}

//#endregion
//#region dist/composition/binary.js
var binary_exports = /* @__PURE__ */ __exportAll({
	createArtifactBinarySession: () => createArtifactBinarySession,
	createBinarySession: () => createBinarySession,
	createManagedBinarySession: () => createManagedBinarySession
});
var createBinarySession, createManagedBinarySession, createArtifactBinarySession;
function init_binary() {
	return (init_binary = __esmMin((() => {
		init_snapshotEnvironment();
		init_HopperProvider();
		init_GhidraProvider();
		init_IdaProvider();
		init_auxiliaryAnalysisProviders();
		init_AnalysisProviderRegistry();
		init_BinarySessionComposition();
		init_LazyAnalysisProvider();
		init_ManagedStaticProvider();
		createBinarySession = (config, logger, selectedEnvironment) => {
			const environment = snapshotEnvironment(selectedEnvironment);
			const hopper = new HopperProvider(config, logger, environment);
			const ghidra = new GhidraProvider(config, logger, environment);
			const ida = new IdaProvider(config, environment);
			return composeBinarySession(new AnalysisProviderRegistry([
				hopper,
				ghidra,
				ida
			], config.analysisProvider), auxiliaryAnalysisProviderDeclarations(environment).map((declaration) => new LazyAnalysisProvider(declaration)));
		};
		createManagedBinarySession = () => composeBinarySession(new AnalysisProviderRegistry([]), [new ManagedStaticProvider()]);
		createArtifactBinarySession = (selectedEnvironment, platform = process.platform) => import("./artifacts__ArtifactProvider-zXI0QjSL.js").then(({ ArtifactProvider }) => composeBinarySession(new AnalysisProviderRegistry([]), [new ArtifactProvider(snapshotEnvironment(selectedEnvironment, platform), platform)]));
	})))();
}

//#endregion
export { ManagedStaticProvider, NATIVE_MACOS_PROVIDER_IDENTITY, artifactCapabilities, binary_exports, init_ArtifactProviderMetadata, init_ManagedStaticProvider, init_NativeMacOSProviderMetadata, init_binary, nativeMacOSCapabilities };