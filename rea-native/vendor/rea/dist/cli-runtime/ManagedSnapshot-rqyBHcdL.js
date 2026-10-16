import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisCancelledError, AnalysisError, AnalysisResourceConstraintError, init_analysisErrorBase, init_analysisErrorCore } from "./errorSchemas-CTRmvMl3.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-BXkffc1D.js";
import { RegularFileChangedError, init_RegularFile } from "./RegularFile-B_6KPCNQ.js";
import { EvidenceIntegrityError, init_evidenceErrors } from "./analysisErrorPresentation-DGt7TdsH.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-Do6YeeoD.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-Ceq8f0wK.js";
import { MANAGED_STATIC_PROVIDER, init_InvestigationProviders } from "./InvestigationProviders-DoQRIHii.js";
import { init_BoundedFileBytes, readBoundedFileBytes } from "./BoundedFileBytes-BU30odTm.js";
import { RegularFileCleanupFailure, init_RegularFileRead, withRegularFile } from "./RegularFileRead-DVlC5faM.js";
import { init_managedArtifact, managedMemberInspectionSchema } from "./managedApplicationGraph-B08jb3jq.js";
import { classifyBinaryTargetFilesystemFailure, decodePeMachine, init_BinaryTargetResolver, init_peMachine } from "./BinaryTargetResolver-CVIJ_s1A.js";
import { createHash } from "node:crypto";

//#region dist/dotnet/ManagedReaderFailure.js
var ManagedReaderFailure, managedFailure, readManagedValue, uniqueManagedParseIssues, appendManagedParseIssues;
function init_ManagedReaderFailure() {
	return (init_ManagedReaderFailure = __esmMin((() => {
		ManagedReaderFailure = class extends Error {
			issue;
			constructor(issue, options) {
				super(issue.detail, options);
				this.issue = issue;
			}
		};
		managedFailure = (code, scope, detail, offset = null) => new ManagedReaderFailure({
			code,
			scope,
			offset,
			detail
		});
		readManagedValue = (operation, issues) => {
			try {
				return operation();
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure) || cause.issue.code === "resource-limit") throw cause;
				issues.push(cause.issue);
				return undefined;
			}
		};
		uniqueManagedParseIssues = (issues) => [...new Map(issues.map((issue) => [JSON.stringify(issue), issue])).values()];
		appendManagedParseIssues = (issues, ...found) => {
			for (const list of found) for (const issue of list) issues.push(issue);
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedDecodeBudget.js
var MAX_METADATA_REPRESENTATION_BYTES, ManagedDecodeBudget, budgets, attachManagedDecodeBudget, managedDecodeBudget, managedJsonStringBytes, jsonBytes, admitManagedProjection;
function init_ManagedDecodeBudget() {
	return (init_ManagedDecodeBudget = __esmMin((() => {
		init_ManagedReaderFailure();
		MAX_METADATA_REPRESENTATION_BYTES = 64 * 1024 * 1024;
		ManagedDecodeBudget = class {
			#remaining = MAX_METADATA_REPRESENTATION_BYTES;
			#transient = 0;
			#rows = new Map();
			#strings = new Map();
			#digests = new WeakMap();
			reserve(bytes, offset) {
				this.#admit(bytes, offset);
				this.#remaining -= bytes;
			}
			/** Retain one bookkeeping reservation per physical row, independently of lookup replay. */
			reserveRow(table, row, offset) {
				let rows = this.#rows.get(table);
				if (rows?.has(row) === true) return;
				this.reserve(256, offset);
				if (rows === undefined) {
					rows = new Set();
					this.#rows.set(table, rows);
				}
				rows.add(row);
			}
			/** Bound a decoding allocation that stays live until `releaseTransient`; only retained output is reserved. */
			admitTransient(bytes, offset) {
				this.#admit(bytes, offset);
				this.#transient += bytes;
			}
			/** End the current item's decoding; its bookkeeping is unreachable and only reserved output remains. */
			releaseTransient() {
				this.#transient = 0;
			}
			#admit(bytes, offset) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remaining - this.#transient) throw managedFailure("resource-limit", "metadata.representation", `Managed metadata exceeds the ${String(MAX_METADATA_REPRESENTATION_BYTES)} byte representation budget`, offset);
			}
			/** UTF-8 cannot decode to more UTF-16 units than bytes; JSON uses at most six bytes per unit. */
			reserveString(encodedBytes, offset) {
				this.reserve(encodedBytes * 6 + 2, offset);
			}
			/** Snapshot buffers are immutable within a layout; cache exact backing-buffer ranges. */
			digest(bytes, algorithm) {
				let ranges = this.#digests.get(bytes.buffer);
				if (ranges === undefined) {
					ranges = new Map();
					this.#digests.set(bytes.buffer, ranges);
				}
				const key = `${algorithm}:${String(bytes.byteOffset)}:${String(bytes.byteLength)}`;
				const cached = ranges.get(key);
				if (cached !== undefined) return cached;
				this.reserve(256, null);
				const digest = createHash(algorithm).update(bytes).digest("hex");
				ranges.set(key, digest);
				return digest;
			}
			cachedString(index) {
				return this.#strings.get(index);
			}
			cacheString(index, value, encodedBytes) {
				this.#strings.set(index, {
					value,
					encodedBytes
				});
			}
		};
		budgets = new WeakMap();
		attachManagedDecodeBudget = (layout, budget) => {
			budgets.set(layout, budget);
		};
		managedDecodeBudget = (layout) => {
			let budget = budgets.get(layout);
			if (budget === undefined) {
				budget = new ManagedDecodeBudget();
				budgets.set(layout, budget);
			}
			return budget;
		};
		managedJsonStringBytes = (value) => {
			let bytes = 2;
			for (let index = 0; index < value.length; index++) {
				const unit = value.charCodeAt(index);
				if (unit === 34 || unit === 92) bytes += 2;
				else if (unit < 32) bytes += [
					8,
					9,
					10,
					12,
					13
				].includes(unit) ? 2 : 6;
				else if (unit < 128) bytes += 1;
				else if (unit < 2048) bytes += 2;
				else if (unit >= 55296 && unit <= 56319) {
					const next = value.charCodeAt(index + 1);
					if (next >= 56320 && next <= 57343) {
						bytes += 4;
						index++;
					} else bytes += 6;
				} else if (unit >= 56320 && unit <= 57343) bytes += 6;
				else bytes += 3;
			}
			return bytes;
		};
		jsonBytes = (item) => typeof item === "string" ? managedJsonStringBytes(item) : Buffer.byteLength(JSON.stringify(item) ?? "null");
		admitManagedProjection = (value, budget = new ManagedDecodeBudget()) => {
			const visit = (item) => {
				if (Array.isArray(item)) {
					budget.reserve(item.length + 2, null);
					for (const child of item) visit(child);
				} else if (item !== null && typeof item === "object") {
					budget.reserve(2, null);
					for (const key of Object.keys(item)) {
						budget.reserve(jsonBytes(key) + 2, null);
						visit(Reflect.get(item, key));
					}
				} else {
					budget.reserve(jsonBytes(item), null);
				}
			};
			visit(value);
			return value;
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedPeReader.js
var managedCli32BitRequirement, requireRange$1, add, architectureFor, resolveRva, mapRva, readDirectory, readCliHeader, readCoffHeader, readOptionalHeader, readSections, readCliDirectory, readManagedPeLayout;
function init_ManagedPeReader() {
	return (init_ManagedPeReader = __esmMin((() => {
		init_peMachine();
		init_ManagedReaderFailure();
		managedCli32BitRequirement = (flags) => {
			const pair = flags & 131074;
			if (pair === 2) return "required";
			return pair === 131074 ? "preferred" : "none";
		};
		requireRange$1 = (bytes, offset, length, scope) => {
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset > bytes.length - length) throw managedFailure("invalid-directory", scope, `${scope} leaves the artifact byte range`, Number.isSafeInteger(offset) && offset >= 0 ? offset : null);
		};
		add = (left, right, scope) => {
			const result = left + right;
			if (!Number.isSafeInteger(result) || result < left) throw managedFailure("invalid-directory", scope, `${scope} offset arithmetic overflowed`, left);
			return result;
		};
		architectureFor = (machine, managed) => {
			const decoded = decodePeMachine(machine);
			if (decoded === undefined || decoded.nativeOsOverride && !managed) throw managedFailure("invalid-directory", "pe.machine", `Unsupported PE machine 0x${machine.toString(16).padStart(4, "0")}`);
			return decoded.architecture;
		};
		resolveRva = (mapping) => {
			const { bytes, sections, rva, size, scope } = mapping;
			if (!Number.isSafeInteger(rva) || !Number.isSafeInteger(size) || rva < 0 || size < 0 || rva > 4294967295 || size > 0 && size > 4294967296 - rva) throw managedFailure("invalid-directory", scope, `${scope} has an invalid RVA range`);
			const selected = sections.find((section) => {
				const within = rva - section.virtualAddress;
				return section.virtualSize > 0 && within >= 0 && within < section.virtualSize && size <= section.virtualSize - within;
			});
			if (selected === undefined) throw managedFailure("invalid-directory", scope, `${scope} RVA is not covered by one PE section`);
			for (const section of sections) {
				if (section === selected || section.virtualSize === 0) continue;
				const end = section.virtualAddress + section.virtualSize;
				const intersects = size === 0 ? rva >= section.virtualAddress && rva < end : rva < end && rva + size > section.virtualAddress;
				if (intersects) throw managedFailure("invalid-directory", scope, `${scope} RVA range has ambiguous overlapping PE section mappings`);
			}
			const within = rva - selected.virtualAddress;
			if (within > selected.rawSize || size > selected.rawSize - within) throw managedFailure("invalid-directory", scope, `${scope} occupies virtual bytes without file-backed data`);
			const offset = add(selected.rawOffset, within, scope);
			requireRange$1(bytes, offset, size, scope);
			let available = Math.min(selected.virtualSize - within, selected.rawSize - within, bytes.length - offset, 4294967296 - rva);
			for (const section of sections) if (section !== selected && section.virtualAddress > rva && section.virtualSize > 0) available = Math.min(available, section.virtualAddress - rva);
			return {
				offset,
				available
			};
		};
		mapRva = (mapping) => mapping.rva === 0 && mapping.size === 0 ? 0 : resolveRva(mapping).offset;
		readDirectory = (bytes, offset) => {
			requireRange$1(bytes, offset, 8, "pe.data-directory");
			return {
				rva: bytes.readUInt32LE(offset),
				size: bytes.readUInt32LE(offset + 4)
			};
		};
		readCliHeader = (bytes, sections, directory) => {
			if (directory.size < 72) throw managedFailure("invalid-cli-header", "cli.header", "CLI header is shorter than the required 72 bytes");
			const offset = mapRva({
				bytes,
				sections,
				rva: directory.rva,
				size: 72,
				scope: "cli.header"
			});
			const headerSize = bytes.readUInt32LE(offset);
			if (headerSize < 72 || headerSize > directory.size) throw managedFailure("invalid-cli-header", "cli.header", "CLI header size is outside its PE data directory", offset);
			const metadata = readDirectory(bytes, offset + 8);
			if (metadata.rva === 0 || metadata.size === 0) throw managedFailure("invalid-cli-header", "cli.metadata", "CLI metadata directory is absent", offset + 8);
			const flags = bytes.readUInt32LE(offset + 16);
			const managedNativeHeader = readDirectory(bytes, offset + 64);
			let readyToRunSignature = false;
			if (managedNativeHeader.rva !== 0 && managedNativeHeader.size >= 4) {
				const nativeOffset = mapRva({
					bytes,
					sections,
					rva: managedNativeHeader.rva,
					size: 4,
					scope: "cli.managed-native-header"
				});
				readyToRunSignature = bytes.readUInt32LE(nativeOffset) === 5395538;
			}
			return {
				headerOffset: offset,
				headerSize,
				runtimeMajor: bytes.readUInt16LE(offset + 4),
				runtimeMinor: bytes.readUInt16LE(offset + 6),
				metadata,
				flags,
				entryPoint: bytes.readUInt32LE(offset + 20),
				resources: readDirectory(bytes, offset + 24),
				strongName: readDirectory(bytes, offset + 32),
				managedNativeHeader,
				readyToRunSignature
			};
		};
		readCoffHeader = (bytes) => {
			const peOffset = bytes.readUInt32LE(60);
			requireRange$1(bytes, peOffset, 24, "pe.coff-header");
			if (bytes.readUInt32LE(peOffset) !== 17744) throw managedFailure("invalid-directory", "pe.signature", "PE signature is invalid", peOffset);
			const coff = peOffset + 4;
			const machine = bytes.readUInt16LE(coff);
			const sectionCount = bytes.readUInt16LE(coff + 2);
			if (sectionCount === 0) throw managedFailure("invalid-directory", "pe.sections", "PE section count must be positive", coff + 2);
			const optionalSize = bytes.readUInt16LE(coff + 16);
			const characteristics = bytes.readUInt16LE(coff + 18);
			return {
				coff,
				machine,
				sectionCount,
				optionalSize,
				characteristics
			};
		};
		readOptionalHeader = (bytes, coff) => {
			const optionalOffset = coff.coff + 20;
			requireRange$1(bytes, optionalOffset, coff.optionalSize, "pe.optional-header");
			if (coff.optionalSize < 96) throw managedFailure("invalid-directory", "pe.optional-header", "PE optional header is too short", optionalOffset);
			const magic = bytes.readUInt16LE(optionalOffset);
			const optionalHeader = magic === 267 ? "pe32" : magic === 523 ? "pe32-plus" : undefined;
			if (optionalHeader === undefined) throw managedFailure("invalid-directory", "pe.optional-header", "PE optional header magic is unsupported", optionalOffset);
			return {
				optionalOffset,
				optionalHeader,
				directoryCountOffset: optionalOffset + (optionalHeader === "pe32" ? 92 : 108),
				directoryOffset: optionalOffset + (optionalHeader === "pe32" ? 96 : 112)
			};
		};
		readSections = (bytes, coff, optional) => {
			const sectionOffset = add(optional.optionalOffset, coff.optionalSize, "pe.sections");
			requireRange$1(bytes, sectionOffset, coff.sectionCount * 40, "pe.sections");
			const sections = [];
			for (let index = 0; index < coff.sectionCount; index += 1) {
				const offset = sectionOffset + index * 40;
				const section = {
					virtualSize: bytes.readUInt32LE(offset + 8),
					virtualAddress: bytes.readUInt32LE(offset + 12),
					rawSize: bytes.readUInt32LE(offset + 16),
					rawOffset: bytes.readUInt32LE(offset + 20)
				};
				if (section.rawSize > 0) requireRange$1(bytes, section.rawOffset, section.rawSize, "pe.section-data");
				sections.push(section);
			}
			return sections;
		};
		readCliDirectory = (bytes, coff, optional) => {
			const countOffset = optional.directoryCountOffset - optional.optionalOffset;
			if (countOffset + 4 > coff.optionalSize) return {
				kind: "unreadable",
				issue: {
					code: "invalid-directory",
					scope: "pe.optional-header",
					detail: "PE optional header does not contain its directory count",
					offset: optional.directoryCountOffset
				}
			};
			const directoryCount = bytes.readUInt32LE(optional.directoryCountOffset);
			if (directoryCount <= 14) return { kind: "absent" };
			const availableDirectoryCount = Math.floor((coff.optionalSize - (optional.directoryOffset - optional.optionalOffset)) / 8);
			if (availableDirectoryCount < 15) return {
				kind: "unreadable",
				issue: {
					code: "invalid-directory",
					scope: "pe.data-directories",
					detail: "PE data-directory count exceeds the optional-header extent",
					offset: optional.directoryCountOffset
				}
			};
			const directory = readDirectory(bytes, optional.directoryOffset + 14 * 8);
			return directory.rva !== 0 || directory.size !== 0 ? {
				kind: "present",
				directory
			} : { kind: "absent" };
		};
		readManagedPeLayout = (bytes) => {
			requireRange$1(bytes, 0, 64, "pe.dos-header");
			if (bytes[0] !== 77 || bytes[1] !== 90) throw managedFailure("invalid-directory", "pe.dos-header", "Artifact does not start with an MZ header", 0);
			const coff = readCoffHeader(bytes);
			const optional = readOptionalHeader(bytes, coff);
			const sections = readSections(bytes, coff, optional);
			const cliDirectoryRead = readCliDirectory(bytes, coff, optional);
			const cliDirectoryState = cliDirectoryRead.kind;
			let cli = null;
			let cliIssue = cliDirectoryRead.kind === "unreadable" ? cliDirectoryRead.issue : null;
			if (cliDirectoryRead.kind === "present") {
				try {
					cli = readCliHeader(bytes, sections, cliDirectoryRead.directory);
				} catch (cause) {
					if (!(cause instanceof ManagedReaderFailure)) throw cause;
					cliIssue = cause.issue;
				}
			}
			return {
				machine: coff.machine,
				architecture: architectureFor(coff.machine, cliDirectoryState !== "absent"),
				optionalHeader: optional.optionalHeader,
				sectionCount: coff.sectionCount,
				characteristics: coff.characteristics,
				sections,
				cli,
				cliDirectoryState,
				cliIssue,
				rvaToOffset: (rva, size, scope) => mapRva({
					bytes,
					sections,
					rva,
					size,
					scope
				}),
				rvaAvailableBytes: (rva, scope) => resolveRva({
					bytes,
					sections,
					rva,
					size: 1,
					scope
				}).available
			};
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMetadataRowSizes.js
var ROW_SIZE_FACTORIES, computeRowSize;
function init_ManagedMetadataRowSizes() {
	return (init_ManagedMetadataRowSizes = __esmMin((() => {
		init_ManagedReaderFailure();
		ROW_SIZE_FACTORIES = [
			({ stringSize: s, guidSize: g }) => 2 + s + g * 3,
			({ codedSize: c, stringSize: s }) => c("ResolutionScope") + s * 2,
			({ tableSize: t, codedSize: c, stringSize: s }) => 4 + s * 2 + c("TypeDefOrRef") + Math.max(t(3), t(4)) + Math.max(t(5), t(6)),
			({ tableSize: t }) => t(4),
			({ stringSize: s, blobSize: b }) => 2 + s + b,
			({ tableSize: t }) => t(6),
			({ tableSize: t, stringSize: s, blobSize: b }) => 8 + s + b + t(8),
			({ tableSize: t }) => t(8),
			({ stringSize: s }) => 4 + s,
			({ tableSize: t, codedSize: c }) => t(2) + c("TypeDefOrRef"),
			({ codedSize: c, stringSize: s, blobSize: b }) => c("MemberRefParent") + s + b,
			({ codedSize: c, blobSize: b }) => 2 + c("HasConstant") + b,
			({ codedSize: c, blobSize: b }) => c("HasCustomAttribute") + c("CustomAttributeType") + b,
			({ codedSize: c, blobSize: b }) => c("HasFieldMarshal") + b,
			({ codedSize: c, blobSize: b }) => 2 + c("HasDeclSecurity") + b,
			({ tableSize: t }) => 6 + t(2),
			({ tableSize: t }) => 4 + t(4),
			({ blobSize: b }) => b,
			({ tableSize: t }) => t(2) + t(20),
			({ tableSize: t }) => t(20),
			({ stringSize: s, codedSize: c }) => 2 + s + c("TypeDefOrRef"),
			({ tableSize: t }) => t(2) + t(23),
			({ tableSize: t }) => t(23),
			({ stringSize: s, blobSize: b }) => 2 + s + b,
			({ tableSize: t, codedSize: c }) => 2 + t(6) + c("HasSemantics"),
			({ tableSize: t, codedSize: c }) => t(2) + c("MethodDefOrRef") * 2,
			({ stringSize: s }) => s,
			({ blobSize: b }) => b,
			({ tableSize: t, codedSize: c, stringSize: s }) => 2 + c("MemberForwarded") + s + t(26),
			({ tableSize: t }) => 4 + t(4),
			() => 8,
			() => 4,
			({ blobSize: b, stringSize: s }) => 16 + b + s * 2,
			() => 4,
			() => 12,
			({ blobSize: b, stringSize: s }) => 12 + b * 2 + s * 2,
			({ tableSize: t }) => 4 + t(35),
			({ tableSize: t }) => 12 + t(35),
			({ stringSize: s, blobSize: b }) => 4 + s + b,
			({ stringSize: s, codedSize: c }) => 8 + s * 2 + c("Implementation"),
			({ stringSize: s, codedSize: c }) => 8 + s + c("Implementation"),
			({ tableSize: t }) => t(2) * 2,
			({ stringSize: s, codedSize: c }) => 4 + c("TypeOrMethodDef") + s,
			({ codedSize: c, blobSize: b }) => c("MethodDefOrRef") + b,
			({ tableSize: t, codedSize: c }) => t(42) + c("TypeDefOrRef")
		];
		computeRowSize = (table, context) => {
			const factory = ROW_SIZE_FACTORIES[table];
			if (factory === undefined) throw managedFailure("invalid-tables", "metadata.tables", `Metadata table ${String(table)} is unsupported`);
			return factory(context);
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMetadataLayout.js
var METADATA_TABLE_NAMES, CODED_INDEXES, SUPPORTED_TABLE_MASK, requireRange, align4, readStreamName, streamByName, requireStream, codedSize, tableSize, readMetadataStreams, readTablesHeader, readRowCounts, buildRowSizeContext, buildMetadataTables, readManagedMetadataLayout, metadataRowOffset;
function init_ManagedMetadataLayout() {
	return (init_ManagedMetadataLayout = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedReaderFailure();
		init_ManagedMetadataRowSizes();
		METADATA_TABLE_NAMES = [
			"Module",
			"TypeRef",
			"TypeDef",
			"FieldPtr",
			"Field",
			"MethodPtr",
			"MethodDef",
			"ParamPtr",
			"Param",
			"InterfaceImpl",
			"MemberRef",
			"Constant",
			"CustomAttribute",
			"FieldMarshal",
			"DeclSecurity",
			"ClassLayout",
			"FieldLayout",
			"StandAloneSig",
			"EventMap",
			"EventPtr",
			"Event",
			"PropertyMap",
			"PropertyPtr",
			"Property",
			"MethodSemantics",
			"MethodImpl",
			"ModuleRef",
			"TypeSpec",
			"ImplMap",
			"FieldRVA",
			"ENCLog",
			"ENCMap",
			"Assembly",
			"AssemblyProcessor",
			"AssemblyOS",
			"AssemblyRef",
			"AssemblyRefProcessor",
			"AssemblyRefOS",
			"File",
			"ExportedType",
			"ManifestResource",
			"NestedClass",
			"GenericParam",
			"MethodSpec",
			"GenericParamConstraint"
		];
		CODED_INDEXES = {
			TypeDefOrRef: {
				bits: 2,
				tables: [
					2,
					1,
					27
				]
			},
			HasConstant: {
				bits: 2,
				tables: [
					4,
					8,
					23
				]
			},
			HasCustomAttribute: {
				bits: 5,
				tables: [
					6,
					4,
					1,
					2,
					8,
					9,
					10,
					0,
					14,
					23,
					20,
					17,
					26,
					27,
					32,
					35,
					38,
					39,
					40,
					42,
					44,
					43
				]
			},
			HasFieldMarshal: {
				bits: 1,
				tables: [4, 8]
			},
			HasDeclSecurity: {
				bits: 2,
				tables: [
					2,
					6,
					32
				]
			},
			MemberRefParent: {
				bits: 3,
				tables: [
					2,
					1,
					26,
					6,
					27
				]
			},
			HasSemantics: {
				bits: 1,
				tables: [20, 23]
			},
			MethodDefOrRef: {
				bits: 1,
				tables: [6, 10]
			},
			MemberForwarded: {
				bits: 1,
				tables: [4, 6]
			},
			Implementation: {
				bits: 2,
				tables: [
					38,
					35,
					39
				]
			},
			CustomAttributeType: {
				bits: 3,
				tables: [6, 10]
			},
			ResolutionScope: {
				bits: 2,
				tables: [
					0,
					26,
					35,
					1
				]
			},
			TypeOrMethodDef: {
				bits: 1,
				tables: [2, 6]
			}
		};
		SUPPORTED_TABLE_MASK = (1n << BigInt(METADATA_TABLE_NAMES.length)) - 1n;
		requireRange = (bytes, offset, length, scope) => {
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(length) || offset < 0 || length < 0 || offset > bytes.length - length) throw managedFailure("invalid-metadata-root", scope, `${scope} leaves the metadata byte range`, Number.isSafeInteger(offset) && offset >= 0 ? offset : null);
		};
		align4 = (value) => Math.ceil(value / 4) * 4;
		readStreamName = (bytes, offset) => {
			const endLimit = Math.min(bytes.length, offset + 32);
			let end = offset;
			while (end < endLimit && bytes[end] !== 0) end += 1;
			if (end === endLimit) throw managedFailure("invalid-stream", "metadata.stream-name", "Metadata stream name is missing a bounded terminator", offset);
			const nameBytes = bytes.subarray(offset, end);
			if (nameBytes.some((byte) => byte < 32 || byte > 126)) throw managedFailure("invalid-stream", "metadata.stream-name", "Metadata stream name is not printable ASCII", offset);
			return {
				name: nameBytes.toString("ascii"),
				next: align4(end + 1)
			};
		};
		streamByName = (streams, names) => {
			for (const name of names) {
				const stream = streams.get(name);
				if (stream !== undefined) return stream;
			}
			return undefined;
		};
		requireStream = (streams, name) => {
			const stream = streams.get(name);
			if (stream === undefined) throw managedFailure("missing-stream", `metadata.${name}`, `Required metadata stream ${name} is absent`);
			return stream;
		};
		codedSize = (name, rowCounts) => {
			const descriptor = CODED_INDEXES[name];
			let maximum = 0;
			for (const table of descriptor.tables) maximum = Math.max(maximum, rowCounts[table] ?? 0);
			return maximum < 2 ** (16 - descriptor.bits) ? 2 : 4;
		};
		tableSize = (index, rows) => (rows[index] ?? 0) < 65536 ? 2 : 4;
		readMetadataStreams = (bytes, rootOffset, budget) => {
			if (bytes.readUInt32LE(0) !== 1112167234) throw managedFailure("invalid-metadata-root", "metadata.signature", "CLI metadata signature is not BSJB", rootOffset);
			const versionLength = bytes.readUInt32LE(12);
			requireRange(bytes, 16, versionLength, "metadata.version");
			const versionBytes = bytes.subarray(16, 16 + versionLength);
			const zero = versionBytes.indexOf(0);
			const decodedVersionLength = zero < 0 ? versionBytes.length : zero;
			budget.reserveString(decodedVersionLength, rootOffset + 16);
			const version = versionBytes.subarray(0, decodedVersionLength).toString("utf8");
			let cursor = align4(16 + versionLength);
			requireRange(bytes, cursor, 4, "metadata.stream-count");
			const streamCount = bytes.readUInt16LE(cursor + 2);
			if (streamCount === 0 || streamCount > 64) throw managedFailure("invalid-stream", "metadata.stream-count", "Metadata stream count is outside the admitted range", rootOffset + cursor + 2);
			cursor += 4;
			const streams = new Map();
			for (let index = 0; index < streamCount; index += 1) {
				requireRange(bytes, cursor, 8, "metadata.stream-header");
				const relativeOffset = bytes.readUInt32LE(cursor);
				const streamSize = bytes.readUInt32LE(cursor + 4);
				const named = readStreamName(bytes, cursor + 8);
				if (streams.has(named.name)) throw managedFailure("invalid-stream", "metadata.stream-header", `Duplicate metadata stream ${named.name}`, rootOffset + cursor);
				requireRange(bytes, relativeOffset, streamSize, `metadata.${named.name}`);
				streams.set(named.name, {
					name: named.name,
					offset: rootOffset + relativeOffset,
					size: streamSize
				});
				cursor = named.next;
			}
			return {
				streams,
				version
			};
		};
		readTablesHeader = (bytes, streams) => {
			const tablesStream = streamByName(streams, ["#~", "#-"]);
			if (tablesStream === undefined) throw managedFailure("missing-stream", "metadata.tables", "Required metadata table stream #~ or #- is absent");
			const tableBytes = bytes.subarray(tablesStream.offset, tablesStream.offset + tablesStream.size);
			requireRange(tableBytes, 0, 24, "metadata.tables-header");
			const heapSizes = tableBytes[6] ?? 0;
			const heaps = {
				string: (heapSizes & 1) === 0 ? 2 : 4,
				guid: (heapSizes & 2) === 0 ? 2 : 4,
				blob: (heapSizes & 4) === 0 ? 2 : 4
			};
			const valid = tableBytes.readBigUInt64LE(8);
			if ((valid & ~SUPPORTED_TABLE_MASK) !== 0n) throw managedFailure("invalid-tables", "metadata.valid-mask", "Metadata valid mask names unsupported tables outside the admitted ECMA-335 range", tablesStream.offset + 8);
			return {
				tableBytes,
				tablesOffset: tablesStream.offset,
				heaps,
				valid
			};
		};
		readRowCounts = (tableBytes, valid) => {
			const rowCounts = Array(METADATA_TABLE_NAMES.length).fill(0);
			let tableCursor = 24;
			for (let index = 0; index < METADATA_TABLE_NAMES.length; index += 1) {
				if ((valid & 1n << BigInt(index)) === 0n) continue;
				requireRange(tableBytes, tableCursor, 4, "metadata.table-row-count");
				const count = tableBytes.readUInt32LE(tableCursor);
				rowCounts[index] = count;
				tableCursor += 4;
			}
			return rowCounts;
		};
		buildRowSizeContext = (rowCounts, heaps) => ({
			tableSize: (index) => tableSize(index, rowCounts),
			codedSize: (name) => codedSize(name, rowCounts),
			stringSize: heaps.string,
			guidSize: heaps.guid,
			blobSize: heaps.blob
		});
		buildMetadataTables = ({ tableBytes, rowCounts, heaps, valid, tablesOffset }) => {
			const tables = new Map();
			const context = buildRowSizeContext(rowCounts, heaps);
			let tableCursor = 24;
			for (let index = 0; index < METADATA_TABLE_NAMES.length; index += 1) {
				if ((valid & 1n << BigInt(index)) === 0n) continue;
				tableCursor += 4;
			}
			if (((tableBytes[6] ?? 0) & 64) !== 0) {
				if (tableCursor > tableBytes.length - 4) throw managedFailure("invalid-metadata-root", "metadata.tables-extra-data", "Metadata tables extra-data word is truncated", tablesOffset + tableCursor);
				tableCursor += 4;
			}
			for (let index = 0; index < METADATA_TABLE_NAMES.length; index += 1) {
				const count = rowCounts[index] ?? 0;
				if ((valid & 1n << BigInt(index)) === 0n) continue;
				const sizeOfRow = computeRowSize(index, context);
				const byteLength = count * sizeOfRow;
				if (!Number.isSafeInteger(byteLength)) throw managedFailure("invalid-tables", "metadata.tables", "Metadata table byte size overflowed", tablesOffset + tableCursor);
				requireRange(tableBytes, tableCursor, byteLength, "metadata.table-data");
				tables.set(index, {
					index,
					name: METADATA_TABLE_NAMES[index] ?? `Table${String(index)}`,
					rowCount: count,
					rowSize: sizeOfRow,
					offset: tablesOffset + tableCursor
				});
				tableCursor += byteLength;
			}
			return tables;
		};
		readManagedMetadataLayout = (artifact, rootOffset, size) => {
			if (size < 20 || rootOffset < 0 || rootOffset > artifact.length - size) throw managedFailure("invalid-metadata-root", "metadata.root", "CLI metadata directory leaves the artifact byte range", rootOffset);
			const bytes = artifact.subarray(rootOffset, rootOffset + size);
			const budget = new ManagedDecodeBudget();
			const { streams, version } = readMetadataStreams(bytes, rootOffset, budget);
			const { tableBytes, tablesOffset, heaps, valid } = readTablesHeader(artifact, streams);
			const rowCounts = readRowCounts(tableBytes, valid);
			const tables = buildMetadataTables({
				tableBytes,
				rowCounts,
				heaps,
				valid,
				tablesOffset
			});
			const layout = {
				rootOffset,
				size,
				version,
				streamNames: [...streams.keys()].sort(),
				strings: requireStream(streams, "#Strings"),
				guid: requireStream(streams, "#GUID"),
				blob: requireStream(streams, "#Blob"),
				userStrings: streams.get("#US") ?? null,
				tables,
				rowCounts,
				stringIndexSize: heaps.string,
				guidIndexSize: heaps.guid,
				blobIndexSize: heaps.blob,
				table: (index) => tables.get(index),
				tableIndexSize: (index) => tableSize(index, rowCounts),
				codedIndexSize: (name) => codedSize(name, rowCounts)
			};
			attachManagedDecodeBudget(layout, budget);
			return layout;
		};
		metadataRowOffset = (layout, table, row) => {
			const descriptor = layout.table(table);
			if (descriptor === undefined || row < 1 || row > descriptor.rowCount) throw managedFailure("invalid-row", `metadata.${METADATA_TABLE_NAMES[table] ?? String(table)}`, `Metadata row ${String(row)} is outside its table`);
			return descriptor.offset + (row - 1) * descriptor.rowSize;
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMemberPointers.js
var lookups$1, memberListTable, memberListIndexSize, validatedMemberListStart, memberListRowLookup;
function init_ManagedMemberPointers() {
	return (init_ManagedMemberPointers = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedReaderFailure();
		lookups$1 = new WeakMap();
		memberListTable = (layout, table) => {
			const pointers = layout.table(table - 1);
			return pointers !== undefined && pointers.rowCount > 0 ? pointers : layout.table(table);
		};
		memberListIndexSize = (layout, table) => layout.tableIndexSize(table - 1) === 4 || layout.tableIndexSize(table) === 4 ? 4 : 2;
		validatedMemberListStart = (start, table) => {
			const total = table?.rowCount ?? 0;
			return Number.isSafeInteger(start) && start >= 1 && start <= total + 1 ? start : null;
		};
		memberListRowLookup = (bytes, layout, table) => {
			const pointers = layout.table(table - 1);
			if (pointers === undefined || pointers.rowCount === 0) return (row) => row;
			let byTable = lookups$1.get(layout);
			const cached = byTable?.get(table);
			if (cached instanceof ManagedReaderFailure) throw cached;
			if (cached !== undefined) return cached;
			const definitionCount = layout.table(table)?.rowCount ?? 0;
			managedDecodeBudget(layout).reserve((definitionCount + 1) * Uint32Array.BYTES_PER_ELEMENT + 256, pointers.offset);
			if (byTable === undefined) {
				byTable = new Map();
				lookups$1.set(layout, byTable);
			}
			const positions = new Uint32Array(definitionCount + 1);
			try {
				const width = layout.tableIndexSize(table);
				for (let row = 1; row <= pointers.rowCount; row += 1) {
					const offset = pointers.offset + (row - 1) * pointers.rowSize;
					const definition = width === 2 ? bytes.readUInt16LE(offset) : bytes.readUInt32LE(offset);
					if (definition === 0 || definition > definitionCount) throw managedFailure("invalid-row", `metadata.${pointers.name}`, `Pointer row ${String(row)} names an out-of-range definition row ${String(definition)}`, offset);
					if (positions[definition] !== 0) throw managedFailure("invalid-row", `metadata.${pointers.name}`, `Definition row ${String(definition)} has more than one pointer row; its declaring type is ambiguous`, offset);
					positions[definition] = row;
				}
				const lookup = (definition) => {
					const position = positions[definition] ?? 0;
					if (position === 0) throw managedFailure("invalid-row", `metadata.${pointers.name}`, `Definition row ${String(definition)} has no pointer row identifying its declaring type`, pointers.offset);
					return position;
				};
				byTable.set(table, lookup);
				return lookup;
			} catch (cause) {
				if (cause instanceof ManagedReaderFailure) byTable.set(table, cause);
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMemberOwnership.js
var lookups, memberDeclaringTypeRowLookup;
function init_ManagedMemberOwnership() {
	return (init_ManagedMemberOwnership = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMemberPointers();
		init_ManagedReaderFailure();
		lookups = new WeakMap();
		memberDeclaringTypeRowLookup = (bytes, layout, table, facts) => {
			let byTable = lookups.get(facts);
			const cached = byTable?.get(table);
			if (cached instanceof ManagedReaderFailure) throw cached;
			if (cached !== undefined) return cached;
			if (byTable === undefined) {
				byTable = new Map();
				lookups.set(facts, byTable);
			}
			try {
				const positionOf = memberListRowLookup(bytes, layout, table);
				const positions = memberListTable(layout, table)?.rowCount ?? 0;
				const types = layout.table(2)?.rowCount ?? 0;
				managedDecodeBudget(layout).reserve((2 * positions + 3) * Uint32Array.BYTES_PER_ELEMENT + 256, layout.table(2)?.offset ?? null);
				const owners = new Uint32Array(positions + 1);
				const next = Uint32Array.from({ length: positions + 2 }, (_, p) => p);
				const unowned = (position) => {
					let root = position;
					while (next[root] !== root) root = next[root] ?? root;
					for (let p = position; p !== root;) {
						const following = next[p] ?? root;
						next[p] = root;
						p = following;
					}
					return root;
				};
				for (let row = 1; row <= types; row += 1) {
					const memberStart = table === 4 ? facts.entries[row - 1]?.field : facts.entries[row - 1]?.method;
					const start = memberStart?.start.value ?? null;
					const end = memberStart?.end ?? null;
					if (start !== null && end !== null) {
						const limit = Math.min(end, positions + 1);
						for (let p = unowned(Math.min(start, positions + 1)); p < limit; p = unowned(p + 1)) {
							owners[p] = row;
							next[p] = p + 1;
						}
					}
				}
				const definitions = layout.table(table)?.rowCount ?? 0;
				const lookup = (definition) => definition < 1 || definition > definitions ? 0 : owners[positionOf(definition)] ?? 0;
				byTable.set(table, lookup);
				return lookup;
			} catch (cause) {
				if (cause instanceof ManagedReaderFailure) byTable.set(table, cause);
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMetadataHeaps.js
var MetadataRowCursor, PREFIXED_ITEMS, compressedLength, readMetadataString, readMetadataBlob, readMetadataUserString, readMetadataGuid, metadataToken, sha256Bytes, metadataRowCursor, metadataCodedToken, metadataCodedTokenInvalidReason;
function init_ManagedMetadataHeaps() {
	return (init_ManagedMetadataHeaps = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMetadataLayout();
		init_ManagedReaderFailure();
		MetadataRowCursor = class {
			bytes;
			start;
			end;
			scope;
			#offset;
			constructor(bytes, start, end, scope) {
				this.bytes = bytes;
				this.start = start;
				this.end = end;
				this.scope = scope;
				this.#offset = start;
			}
			get offset() {
				return this.#offset;
			}
			readUInt16() {
				this.require(2);
				const value = this.bytes.readUInt16LE(this.#offset);
				this.#offset += 2;
				return value;
			}
			readUInt32() {
				this.require(4);
				const value = this.bytes.readUInt32LE(this.#offset);
				this.#offset += 4;
				return value;
			}
			readIndex(size) {
				return size === 2 ? this.readUInt16() : this.readUInt32();
			}
			require(length) {
				if (this.#offset < this.start || this.#offset > this.end - length) throw managedFailure("invalid-row", this.scope, `${this.scope} row ended before all declared columns`, this.#offset);
			}
		};
		PREFIXED_ITEMS = {
			blob: {
				code: "invalid-blob",
				label: "Metadata blob"
			},
			userString: {
				code: "invalid-string",
				label: "User string"
			}
		};
		compressedLength = (bytes, offset, scope, item) => {
			const { code, label } = PREFIXED_ITEMS[item];
			const requirePrefix = (size) => {
				if (offset < 0 || offset > bytes.length - size) throw managedFailure(code, scope, `${label} length prefix leaves the artifact byte range`, offset >= 0 ? offset : null);
			};
			requirePrefix(1);
			const first = bytes[offset] ?? 0;
			if ((first & 128) === 0) return {
				length: first,
				prefix: 1,
				minimal: true
			};
			if ((first & 192) === 128) {
				requirePrefix(2);
				const length = (first & 63) << 8 | (bytes[offset + 1] ?? 0);
				return {
					length,
					prefix: 2,
					minimal: length >= 128
				};
			}
			if ((first & 224) === 192) {
				requirePrefix(4);
				const length = (first & 31) * 16777216 + (bytes[offset + 1] ?? 0) * 65536 + (bytes[offset + 2] ?? 0) * 256 + (bytes[offset + 3] ?? 0);
				return {
					length,
					prefix: 4,
					minimal: length >= 16384
				};
			}
			throw managedFailure(code, scope, `${label} uses a reserved compressed-length prefix`, offset);
		};
		readMetadataString = (bytes, layout, index, heapExtent) => {
			if (index === 0) return "";
			if (index < 0 || index >= layout.strings.size) throw managedFailure("invalid-heap-index", "metadata.#Strings", "String heap index is outside #Strings", layout.strings.offset + Math.max(index, 0));
			const start = layout.strings.offset + index;
			const cached = managedDecodeBudget(layout).cachedString(index);
			if (cached !== undefined && cached.encodedBytes <= heapExtent) {
				managedDecodeBudget(layout).reserveString(cached.encodedBytes, start);
				return cached.value;
			}
			const maximum = Math.min(layout.strings.offset + layout.strings.size, start + heapExtent + 1);
			let end = start;
			while (end < maximum && bytes[end] !== 0) end += 1;
			if (end === maximum) throw managedFailure("invalid-string", "metadata.#Strings", "String heap item has no terminator within #Strings", start);
			managedDecodeBudget(layout).reserveString(end - start, start);
			try {
				const value = new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes.subarray(start, end));
				managedDecodeBudget(layout).cacheString(index, value, end - start);
				return value;
			} catch (cause) {
				void cause;
				throw managedFailure("invalid-string", "metadata.#Strings", "String heap item is not valid UTF-8", start);
			}
		};
		readMetadataBlob = (bytes, layout, index, heapExtent) => {
			if (index === 0) return Buffer.alloc(0);
			if (index < 0 || index >= layout.blob.size) throw managedFailure("invalid-heap-index", "metadata.#Blob", "Blob heap index is outside #Blob", layout.blob.offset + Math.max(index, 0));
			const start = layout.blob.offset + index;
			const decoded = compressedLength(bytes, start, "metadata.#Blob", "blob");
			if (decoded.length > heapExtent) throw managedFailure("invalid-blob", "metadata.#Blob", "Blob length exceeds the admitted heap extent", start);
			const content = start + decoded.prefix;
			if (content > layout.blob.offset + layout.blob.size - decoded.length) throw managedFailure("invalid-blob", "metadata.#Blob", "Blob heap item leaves #Blob", start);
			return bytes.subarray(content, content + decoded.length);
		};
		readMetadataUserString = (bytes, layout, token) => {
			const heap = layout.userStrings;
			const scope = `metadata.#US:${token}`;
			if (heap === null) throw managedFailure("missing-stream", scope, "ldstr references #US, but the metadata has no #US stream");
			const index = Number.parseInt(token.slice(4), 16);
			if (index >= heap.size) throw managedFailure("invalid-heap-index", scope, "ldstr operand does not name an item inside #US", heap.offset + index);
			const start = heap.offset + index;
			const decoded = compressedLength(bytes, start, scope, "userString");
			const content = start + decoded.prefix;
			if (content > heap.offset + heap.size - decoded.length) throw managedFailure("invalid-string", scope, "User string leaves #US", start);
			const budget = managedDecodeBudget(layout);
			const conformance = () => {
				if (decoded.minimal) return [];
				budget.reserve(512, start);
				return [{
					code: "invalid-string",
					scope,
					offset: start,
					detail: `User string length ${String(decoded.length)} uses a ${String(decoded.prefix)}-byte prefix wider than ECMA-335 II.23.2 assigns; readable UTF-16 is preserved and runtime acceptance is not assessed`
				}];
			};
			if (index === 0) {
				if (decoded.length === 0) return {
					offset: start,
					value: "",
					issues: conformance()
				};
				throw managedFailure("invalid-string", scope, `#US offset 0 is the reserved empty entry, but it encodes ${String(decoded.length)} byte(s)`, start);
			}
			if (decoded.length % 2 !== 1) throw managedFailure("invalid-string", scope, "User string length is not UTF-16 code units plus one terminal flag byte", start);
			const units = (decoded.length - 1) / 2;
			budget.reserveString(units, start);
			let expectedFlag = 0;
			for (let unitIndex = 0; unitIndex < units; unitIndex++) {
				const unit = bytes.readUInt16LE(content + unitIndex * 2);
				if (unit > 255 || unit >= 1 && unit <= 8 || unit >= 14 && unit <= 31 || unit === 39 || unit === 45 || unit === 127) {
					expectedFlag = 1;
					break;
				}
			}
			const flagOffset = content + units * 2;
			const actualFlag = bytes[flagOffset];
			const issues = conformance();
			if (actualFlag !== expectedFlag) {
				budget.reserve(512, flagOffset);
				issues.push({
					code: "invalid-string",
					scope,
					offset: flagOffset,
					detail: `User string terminal flag ${String(actualFlag)} differs from ECMA-335 II.24.2.4 value ${String(expectedFlag)}; readable UTF-16 is preserved and runtime acceptance is not assessed`
				});
			}
			return {
				offset: start,
				value: bytes.subarray(content, flagOffset).toString("utf16le"),
				issues
			};
		};
		readMetadataGuid = (bytes, layout, index) => {
			if (index === 0) return null;
			const relative = (index - 1) * 16;
			if (relative < 0 || relative > layout.guid.size - 16) throw managedFailure("invalid-guid", "metadata.#GUID", "GUID heap index is outside #GUID", layout.guid.offset + Math.max(relative, 0));
			const offset = layout.guid.offset + relative;
			const part1 = bytes.readUInt32LE(offset).toString(16).padStart(8, "0");
			const part2 = bytes.readUInt16LE(offset + 4).toString(16).padStart(4, "0");
			const part3 = bytes.readUInt16LE(offset + 6).toString(16).padStart(4, "0");
			const part4 = bytes.subarray(offset + 8, offset + 10).toString("hex");
			const part5 = bytes.subarray(offset + 10, offset + 16).toString("hex");
			return `${part1}-${part2}-${part3}-${part4}-${part5}`;
		};
		metadataToken = (table, row) => `0x${(table * 16777216 + row).toString(16).padStart(8, "0")}`;
		sha256Bytes = (bytes) => createHash("sha256").update(bytes).digest("hex");
		metadataRowCursor = (bytes, layout, table, row) => {
			const descriptor = layout.table(table);
			const start = metadataRowOffset(layout, table, row);
			if (descriptor === undefined) throw managedFailure("invalid-row", `metadata.${String(table)}`, "Metadata table is absent", start);
			managedDecodeBudget(layout).reserveRow(table, row, start);
			return new MetadataRowCursor(bytes, start, start + descriptor.rowSize, `metadata.${descriptor.name}`);
		};
		metadataCodedToken = (raw, bits, tables, rowCounts) => {
			if (raw === 0) return null;
			const tag = raw & 2 ** bits - 1;
			const row = Math.floor(raw / 2 ** bits);
			const table = tables[tag];
			return table === undefined || row === 0 || row > (rowCounts[table] ?? 0) ? null : metadataToken(table, row);
		};
		metadataCodedTokenInvalidReason = (raw, bits, tables, rowCounts) => {
			if (raw === 0) return null;
			const tag = raw & 2 ** bits - 1;
			const row = Math.floor(raw / 2 ** bits);
			const table = tables[tag];
			if (table === undefined) return `coded index tag ${tag} is not defined`;
			if (row === 0) return `coded index selects row zero in table ${table}`;
			const count = rowCounts[table] ?? 0;
			return row > count ? `coded index selects row ${row} in table ${table}, which has ${count} rows` : null;
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMetadataInventoryRows.js
var HAS_CUSTOM_ATTRIBUTE_TABLES, CUSTOM_ATTRIBUTE_TYPE_TABLES, publicKeyIdentity, readModule, readAssembly, readAssemblyReference, readTypeName, declaringTypeForMethod, attributeTypeName, decodeCompressedLength, decodeFixedString, readCustomAttribute, readResource;
function init_ManagedMetadataInventoryRows() {
	return (init_ManagedMetadataInventoryRows = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMemberOwnership();
		init_ManagedMetadataLayout();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		HAS_CUSTOM_ATTRIBUTE_TABLES = [
			6,
			4,
			1,
			2,
			8,
			9,
			10,
			0,
			14,
			23,
			20,
			17,
			26,
			27,
			32,
			35,
			38,
			39,
			40,
			42,
			44,
			43
		];
		CUSTOM_ATTRIBUTE_TYPE_TABLES = [
			undefined,
			undefined,
			6,
			10
		];
		publicKeyIdentity = (bytes, kind, layout) => ({
			kind: bytes.length === 0 ? "none" : kind,
			byte_length: bytes.length,
			sha256: bytes.length === 0 ? null : managedDecodeBudget(layout).digest(bytes, "sha256"),
			token: bytes.length === 0 ? null : kind === "public-key" ? Buffer.from(managedDecodeBudget(layout).digest(bytes, "sha1"), "hex").subarray(-8).reverse().toString("hex") : bytes.length === 8 ? bytes.toString("hex") : null
		});
		readModule = (bytes, layout, heapExtent) => {
			const table = layout.table(0);
			if (table === undefined || table.rowCount === 0) return null;
			const cursor = metadataRowCursor(bytes, layout, 0, 1);
			const generation = cursor.readUInt16();
			const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			const mvid = readMetadataGuid(bytes, layout, cursor.readIndex(layout.guidIndexSize));
			const encId = readMetadataGuid(bytes, layout, cursor.readIndex(layout.guidIndexSize));
			const encBaseId = readMetadataGuid(bytes, layout, cursor.readIndex(layout.guidIndexSize));
			return {
				name,
				generation,
				mvid,
				enc_id: encId,
				enc_base_id: encBaseId,
				token: metadataToken(0, 1),
				row_offset: table.offset
			};
		};
		readAssembly = (bytes, layout, heapExtent) => {
			const table = layout.table(32);
			if (table === undefined || table.rowCount === 0) return null;
			const cursor = metadataRowCursor(bytes, layout, 32, 1);
			const hashAlgorithm = cursor.readUInt32();
			const version = [
				cursor.readUInt16(),
				cursor.readUInt16(),
				cursor.readUInt16(),
				cursor.readUInt16()
			].join(".");
			const flags = cursor.readUInt32();
			const key = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), heapExtent);
			const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			const culture = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			return {
				name,
				version,
				culture: culture.length === 0 ? null : culture,
				flags,
				hash_algorithm: hashAlgorithm,
				public_key: publicKeyIdentity(key, (flags & 1) === 0 ? "public-key-token" : "public-key", layout),
				token: metadataToken(32, 1),
				row_offset: table.offset
			};
		};
		readAssemblyReference = (bytes, layout, row, heapExtent) => {
			const cursor = metadataRowCursor(bytes, layout, 35, row);
			const version = [
				cursor.readUInt16(),
				cursor.readUInt16(),
				cursor.readUInt16(),
				cursor.readUInt16()
			].join(".");
			const flags = cursor.readUInt32();
			const keyOrToken = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), heapExtent);
			const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			const culture = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			const hashValue = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), heapExtent);
			return {
				name,
				version,
				culture: culture.length === 0 ? null : culture,
				flags,
				public_key_or_token: publicKeyIdentity(keyOrToken, (flags & 1) === 0 ? "public-key-token" : "public-key", layout),
				hash_value_sha256: hashValue.length === 0 ? null : managedDecodeBudget(layout).digest(hashValue, "sha256"),
				hash_value_length: hashValue.length,
				token: metadataToken(35, row),
				row_offset: metadataRowOffset(layout, 35, row)
			};
		};
		readTypeName = ({ bytes, layout, table, row, heapExtent }) => {
			const descriptor = layout.table(table);
			if (descriptor === undefined || row < 1 || row > descriptor.rowCount) return null;
			const cursor = metadataRowCursor(bytes, layout, table, row);
			if (table === 1) cursor.readIndex(layout.codedIndexSize("ResolutionScope"));
			else cursor.readUInt32();
			const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			const namespace = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), heapExtent);
			return namespace.length === 0 ? name : `${namespace}.${name}`;
		};
		declaringTypeForMethod = (bytes, layout, methodRow, heapExtent, memberLists) => {
			const owner = memberDeclaringTypeRowLookup(bytes, layout, 6, memberLists)(methodRow);
			if (owner === 0) return null;
			return readTypeName({
				bytes,
				layout,
				table: 2,
				row: owner,
				heapExtent
			});
		};
		attributeTypeName = (bytes, layout, rawType, heapExtent, memberLists) => {
			const tag = rawType & 7;
			const row = Math.floor(rawType / 8);
			if (row === 0) return null;
			if (tag === 2) return declaringTypeForMethod(bytes, layout, row, heapExtent, memberLists);
			if (tag !== 3) return null;
			const memberRefs = layout.table(10);
			if (memberRefs === undefined || row > memberRefs.rowCount) return null;
			const cursor = metadataRowCursor(bytes, layout, 10, row);
			const parent = cursor.readIndex(layout.codedIndexSize("MemberRefParent"));
			const parentTag = parent & 7;
			const parentRow = Math.floor(parent / 8);
			if (parentTag === 0) return readTypeName({
				bytes,
				layout,
				table: 2,
				row: parentRow,
				heapExtent
			});
			if (parentTag === 1) return readTypeName({
				bytes,
				layout,
				table: 1,
				row: parentRow,
				heapExtent
			});
			if (parentTag === 3) return declaringTypeForMethod(bytes, layout, parentRow, heapExtent, memberLists);
			return null;
		};
		decodeCompressedLength = (blob, offset) => {
			const first = blob[offset];
			if (first === undefined) return undefined;
			if ((first & 128) === 0) return {
				length: first,
				prefix: 1
			};
			if ((first & 192) === 128 && blob[offset + 1] !== undefined) return {
				length: (first & 63) << 8 | (blob[offset + 1] ?? 0),
				prefix: 2
			};
			if ((first & 224) === 192 && blob[offset + 1] !== undefined && blob[offset + 2] !== undefined && blob[offset + 3] !== undefined) return {
				length: (first & 31) * 16777216 + (blob[offset + 1] ?? 0) * 65536 + (blob[offset + 2] ?? 0) * 256 + (blob[offset + 3] ?? 0),
				prefix: 4
			};
			return undefined;
		};
		decodeFixedString = (blob, layout) => {
			if (blob.length < 3 || blob.readUInt16LE(0) !== 1 || blob[2] === 255) return null;
			const length = decodeCompressedLength(blob, 2);
			if (length === undefined) return null;
			const start = 2 + length.prefix;
			if (start > blob.length - length.length) return null;
			managedDecodeBudget(layout).reserveString(length.length, layout.blob.offset);
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(blob.subarray(start, start + length.length));
			} catch (cause) {
				void cause;
				return null;
			}
		};
		readCustomAttribute = (bytes, layout, row, heapExtent, issues, memberLists) => {
			const cursor = metadataRowCursor(bytes, layout, 12, row);
			const parentRaw = cursor.readIndex(layout.codedIndexSize("HasCustomAttribute"));
			const typeOffset = cursor.offset;
			const typeRaw = cursor.readIndex(layout.codedIndexSize("CustomAttributeType"));
			const value = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), heapExtent);
			const parent = metadataCodedToken(parentRaw, 5, HAS_CUSTOM_ATTRIBUTE_TABLES, layout.rowCounts);
			if (parent === null) {
				const parentReason = metadataCodedTokenInvalidReason(parentRaw, 5, HAS_CUSTOM_ATTRIBUTE_TABLES, layout.rowCounts);
				throw managedFailure("invalid-row", `metadata.CustomAttribute:${metadataToken(12, row)}`, `CustomAttribute parent coded index 0x${parentRaw.toString(16)} is invalid${parentReason === null ? " because the required parent is null" : `: ${parentReason}`}`, cursor.start);
			}
			const constructor = metadataCodedToken(typeRaw, 3, CUSTOM_ATTRIBUTE_TYPE_TABLES, layout.rowCounts);
			if (constructor === null) {
				const typeReason = metadataCodedTokenInvalidReason(typeRaw, 3, CUSTOM_ATTRIBUTE_TYPE_TABLES, layout.rowCounts);
				issues.push({
					code: "invalid-row",
					scope: `metadata.CustomAttribute:${metadataToken(12, row)}`,
					offset: typeOffset,
					detail: typeReason === null ? "CustomAttribute constructor coded index 0x0 is null, but Type must reference a MethodDef or MemberRef row" : `CustomAttribute constructor coded index 0x${typeRaw.toString(16)} is invalid: ${typeReason}`
				});
			}
			let typeName = null;
			if (constructor !== null) typeName = readManagedValue(() => attributeTypeName(bytes, layout, typeRaw, heapExtent, memberLists), issues) ?? null;
			return {
				parent_token: parent,
				constructor_token: constructor,
				type_name: typeName,
				value_length: value.length,
				value_sha256: managedDecodeBudget(layout).digest(value, "sha256"),
				decoded_fixed_string: typeName === "System.Runtime.Versioning.TargetFrameworkAttribute" ? decodeFixedString(value, layout) : null,
				token: metadataToken(12, row),
				row_offset: cursor.start
			};
		};
		readResource = ({ bytes, layout, row, directory, issues }) => {
			const cursor = metadataRowCursor(bytes, layout, 40, row);
			const declaredOffset = cursor.readUInt32();
			const flags = cursor.readUInt32();
			const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), Math.max(layout.strings.size, layout.blob.size));
			const implementationOffset = cursor.offset;
			const implementationRaw = cursor.readIndex(layout.codedIndexSize("Implementation"));
			const implementationToken = metadataCodedToken(implementationRaw, 2, [
				38,
				35,
				39
			], layout.rowCounts);
			const implementationReason = metadataCodedTokenInvalidReason(implementationRaw, 2, [
				38,
				35,
				39
			], layout.rowCounts);
			if (implementationReason !== null) issues.push({
				code: "invalid-row",
				scope: `metadata.ManifestResource:${metadataToken(40, row)}`,
				offset: implementationOffset,
				detail: `ManifestResource implementation coded index 0x${implementationRaw.toString(16)} is invalid: ${implementationReason}`
			});
			let dataLength = null;
			let dataSha256 = null;
			if (implementationRaw === 0) {
				if (directory === null || declaredOffset > directory.size - 4) {
					issues.push({
						code: "invalid-resource",
						scope: `metadata.ManifestResource:${metadataToken(40, row)}`,
						offset: directory?.offset ?? null,
						detail: "Embedded resource offset leaves the CLI resources directory"
					});
				} else {
					const start = directory.offset + declaredOffset;
					dataLength = bytes.readUInt32LE(start);
					if (dataLength > directory.size - declaredOffset - 4) {
						issues.push({
							code: "invalid-resource",
							scope: `metadata.ManifestResource:${metadataToken(40, row)}`,
							offset: start,
							detail: "Embedded resource length leaves the CLI resources directory"
						});
					} else {
						dataSha256 = managedDecodeBudget(layout).digest(bytes.subarray(start + 4, start + 4 + dataLength), "sha256");
					}
				}
			}
			return {
				name,
				flags,
				visibility: (flags & 7) === 1 ? "public" : (flags & 7) === 2 ? "private" : "unknown",
				implementation_token: implementationToken,
				embedded: implementationRaw === 0,
				declared_offset: declaredOffset,
				data_length: dataLength,
				data_sha256: dataSha256,
				token: metadataToken(40, row),
				row_offset: cursor.start
			};
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMetadataInventory.js
var readManagedResourceDirectory, readRows, heapExtent, validateIdentityTableCounts, readReferences, readResources, readAttributes, readManagedMetadataInventory, managedTableRowCounts;
function init_ManagedMetadataInventory() {
	return (init_ManagedMetadataInventory = __esmMin((() => {
		init_ManagedMetadataLayout();
		init_ManagedMetadataInventoryRows();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		readManagedResourceDirectory = (pe, issues) => {
			const resources = pe.cli?.resources;
			if (resources === undefined || resources.rva === 0 && resources.size === 0) return null;
			return readManagedValue(() => ({
				offset: pe.rvaToOffset(resources.rva, resources.size, "cli.resources"),
				size: resources.size
			}), issues) ?? null;
		};
		readRows = (descriptor, read) => {
			const total = descriptor?.rowCount ?? 0;
			const items = [];
			for (let index = 0; index < total; index += 1) {
				const item = read(index + 1);
				if (item !== undefined) items.push(item);
			}
			return items;
		};
		heapExtent = (layout) => Math.max(layout.strings.size, layout.blob.size);
		validateIdentityTableCounts = (layout, issues) => {
			const moduleRows = layout.table(0)?.rowCount ?? 0;
			if (moduleRows !== 1) issues.push({
				code: "invalid-row",
				scope: "metadata.Module",
				offset: layout.table(0)?.offset ?? null,
				detail: `Module table must contain exactly one row; found ${String(moduleRows)}`
			});
			const assemblyRows = layout.table(32)?.rowCount ?? 0;
			if (assemblyRows > 1) issues.push({
				code: "invalid-row",
				scope: "metadata.Assembly",
				offset: layout.table(32)?.offset ?? null,
				detail: `Assembly table can contain at most one row; found ${String(assemblyRows)}`
			});
		};
		readReferences = (bytes, layout, issues) => {
			const references = readRows(layout.table(35), (row) => readManagedValue(() => readAssemblyReference(bytes, layout, row, heapExtent(layout)), issues));
			return {
				references,
				referenceNames: [...new Set(references.map(({ name }) => name))].sort()
			};
		};
		readResources = ({ bytes, layout, resourceDirectory, issues }) => readRows(layout.table(40), (row) => readManagedValue(() => readResource({
			bytes,
			layout,
			row,
			directory: resourceDirectory,
			issues
		}), issues));
		readAttributes = (bytes, layout, issues, memberLists) => {
			const attributes = readRows(layout.table(12), (row) => readManagedValue(() => readCustomAttribute(bytes, layout, row, heapExtent(layout), issues, memberLists), issues));
			const targetFrameworks = new Set();
			for (const attribute of attributes) {
				if (attribute.parent_token === metadataToken(32, 1) && attribute.type_name === "System.Runtime.Versioning.TargetFrameworkAttribute" && attribute.decoded_fixed_string !== null) targetFrameworks.add(attribute.decoded_fixed_string);
			}
			return {
				attributes,
				targetFrameworks: [...targetFrameworks].sort()
			};
		};
		readManagedMetadataInventory = (bytes, layout, resourceDirectory, memberLists) => {
			const issues = [...memberLists.issues];
			validateIdentityTableCounts(layout, issues);
			const module = readManagedValue(() => readModule(bytes, layout, heapExtent(layout)), issues) ?? null;
			const assembly = readManagedValue(() => readAssembly(bytes, layout, heapExtent(layout)), issues) ?? null;
			const { references, referenceNames } = readReferences(bytes, layout, issues);
			const resources = readResources({
				bytes,
				layout,
				resourceDirectory,
				issues
			});
			const { attributes, targetFrameworks } = readAttributes(bytes, layout, issues, memberLists);
			return {
				module,
				assembly,
				targetFrameworks,
				referenceNames,
				references,
				resources,
				attributes,
				issues: uniqueManagedParseIssues(issues)
			};
		};
		managedTableRowCounts = (layout) => Object.fromEntries([...layout.tables.values()].map(({ index, rowCount }) => [METADATA_TABLE_NAMES[index] ?? `Table${String(index)}`, rowCount]));
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMemberInspectorCore.js
var rowRange, fullName, readTypeRange, typeRanges, parseTypes, readCompressed, ELEMENT_TYPES, readSignedCompressed, malformedSignature, MEMBER_METHOD_HEADERS, FUNCTION_POINTER_CONVENTIONS, readMethodSignatureHeader, MAX_ARRAY_RANK, arrayShape, currentPosition, POSITION_ELEMENTS, readTypeOperand, readTypeSignature, CALLING_CONVENTION_NAMES, callingConvention, specSignature, decodeSignature, methodGenericArity, signatureGenericArity, signature;
function init_ManagedMemberInspectorCore() {
	return (init_ManagedMemberInspectorCore = __esmMin((() => {
		init_ManagedReaderFailure();
		init_ManagedDecodeBudget();
		init_ManagedMetadataHeaps();
		init_ManagedMemberPointers();
		rowRange = (table, start, end) => {
			const total = table?.rowCount ?? 0;
			if (start === null || end === null) return {
				first: null,
				last: null,
				count: 0
			};
			const lastExclusive = Math.min(end, total + 1);
			if (start >= lastExclusive) return {
				first: null,
				last: null,
				count: 0
			};
			return {
				first: start,
				last: lastExclusive - 1,
				count: lastExclusive - start
			};
		};
		fullName = (namespace, name) => namespace.length === 0 ? name : `${namespace}.${name}`;
		readTypeRange = (bytes, layout, row, issues, memberLists) => {
			const cursor = metadataRowCursor(bytes, layout, 2, row);
			cursor.readUInt32();
			const nameIndex = cursor.readIndex(layout.stringIndexSize);
			const namespaceIndex = cursor.readIndex(layout.stringIndexSize);
			const declaredName = readManagedValue(() => fullName(readMetadataString(bytes, layout, namespaceIndex, layout.strings.size), readMetadataString(bytes, layout, nameIndex, layout.strings.size)), issues) ?? null;
			cursor.readIndex(layout.codedIndexSize("TypeDefOrRef"));
			const current = memberLists.entries[row - 1];
			return {
				token: metadataToken(2, row),
				fullName: declaredName,
				fieldStart: current?.field.start.value ?? null,
				fieldEnd: current?.field.end ?? null,
				methodStart: current?.method.start.value ?? null,
				methodEnd: current?.method.end ?? null
			};
		};
		typeRanges = (bytes, layout, issues, memberLists) => {
			issues.push(...memberLists.issues);
			const typeTable = layout.table(2);
			const ranges = [];
			for (let row = 1; row <= (typeTable?.rowCount ?? 0); row += 1) ranges.push(readTypeRange(bytes, layout, row, issues, memberLists));
			return ranges;
		};
		parseTypes = (bytes, layout, ranges) => {
			const typeTable = layout.table(2);
			const fields = memberListTable(layout, 4);
			const methods = memberListTable(layout, 6);
			const items = [];
			const issues = [];
			for (let row = 1; row <= (typeTable?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 2, row);
					const flags = cursor.readUInt32();
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const namespace = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const extendsOffset = cursor.offset;
					const extendsRaw = cursor.readIndex(layout.codedIndexSize("TypeDefOrRef"));
					const currentRange = ranges[row - 1] ?? null;
					const fieldRange = rowRange(fields, currentRange?.fieldStart ?? null, currentRange?.fieldEnd ?? null);
					const methodRange = rowRange(methods, currentRange?.methodStart ?? null, currentRange?.methodEnd ?? null);
					const extendsReason = metadataCodedTokenInvalidReason(extendsRaw, 2, [
						2,
						1,
						27
					], layout.rowCounts);
					if (extendsReason !== null) issues.push({
						code: "invalid-row",
						scope: `metadata.TypeDef:${metadataToken(2, row)}`,
						offset: extendsOffset,
						detail: `TypeDef Extends coded index 0x${extendsRaw.toString(16)} is invalid: ${extendsReason}`
					});
					items.push({
						token: metadataToken(2, row),
						row_offset: cursor.start,
						namespace,
						name,
						full_name: fullName(namespace, name),
						flags,
						extends_token: metadataCodedToken(extendsRaw, 2, [
							2,
							1,
							27
						], layout.rowCounts),
						field_list: {
							first_row: fieldRange.first,
							last_row: fieldRange.last,
							count: fieldRange.count
						},
						method_list: {
							first_row: methodRange.first,
							last_row: methodRange.last,
							count: methodRange.count
						}
					});
				}, issues);
			}
			return {
				types: items,
				issues
			};
		};
		readCompressed = (bytes, offset) => {
			const first = bytes[offset];
			if (first === undefined) throw managedFailure("invalid-blob", "signature", "truncated compressed integer", offset);
			if ((first & 128) === 0) return {
				value: first,
				next: offset + 1
			};
			const second = bytes[offset + 1];
			if ((first & 192) === 128 && second !== undefined) return {
				value: (first & 63) << 8 | second,
				next: offset + 2
			};
			const b1 = bytes[offset + 1];
			const b2 = bytes[offset + 2];
			const b3 = bytes[offset + 3];
			if ((first & 224) === 192 && b1 !== undefined && b2 !== undefined && b3 !== undefined) return {
				value: (first & 31) * 16777216 + b1 * 65536 + b2 * 256 + b3,
				next: offset + 4
			};
			throw managedFailure("invalid-blob", "signature", "reserved compressed integer", offset);
		};
		ELEMENT_TYPES = new Map([
			[1, "void"],
			[2, "bool"],
			[3, "char"],
			[4, "i1"],
			[5, "u1"],
			[6, "i2"],
			[7, "u2"],
			[8, "i4"],
			[9, "u4"],
			[10, "i8"],
			[11, "u8"],
			[12, "r4"],
			[13, "r8"],
			[14, "string"],
			[24, "native-int"],
			[25, "native-uint"],
			[28, "object"]
		]);
		readSignedCompressed = (bytes, offset) => {
			const encoded = readCompressed(bytes, offset);
			const width = encoded.next - offset === 1 ? 7 : encoded.next - offset === 2 ? 14 : 29;
			const magnitude = Math.floor(encoded.value / 2);
			return {
				value: encoded.value % 2 === 0 ? magnitude : magnitude - 2 ** (width - 1),
				next: encoded.next
			};
		};
		malformedSignature = (detail, offset) => {
			throw managedFailure("invalid-blob", "signature", detail, offset);
		};
		MEMBER_METHOD_HEADERS = new Set([
			0,
			5,
			16
		]);
		FUNCTION_POINTER_CONVENTIONS = new Set([
			0,
			1,
			2,
			3,
			4,
			5,
			9
		]);
		readMethodSignatureHeader = (blob, offset, context) => {
			const first = blob[offset];
			if (first === undefined) return malformedSignature("truncated method signature", offset);
			const allowed = context === "member" ? MEMBER_METHOD_HEADERS.has(first & 159) : (first & 128) === 0 && FUNCTION_POINTER_CONVENTIONS.has(first & 15);
			if (!allowed || (first & 64) !== 0 && (first & 32) === 0) return malformedSignature(`calling convention 0x${first.toString(16)} does not head a ${context} method signature`, offset);
			let next = offset + 1;
			let genericParameterCount = null;
			if ((first & 16) !== 0) {
				const generic = readCompressed(blob, next);
				genericParameterCount = generic.value;
				next = generic.next;
			}
			const parameterCount = readCompressed(blob, next);
			return {
				first,
				genericParameterCount,
				parameterCount: parameterCount.value,
				next: parameterCount.next
			};
		};
		MAX_ARRAY_RANK = 32;
		arrayShape = (blob, offset) => {
			const rank = readCompressed(blob, offset);
			if (rank.value === 0) return malformedSignature("array rank is zero", offset);
			if (rank.value > MAX_ARRAY_RANK) throw managedFailure("unsupported-signature", "signature", `array rank ${String(rank.value)} exceeds the ${String(MAX_ARRAY_RANK)} dimensions the CLR supports`, offset);
			const sizeCount = readCompressed(blob, rank.next);
			if (sizeCount.value > rank.value) return malformedSignature("array has more sizes than dimensions", offset);
			const sizes = [];
			let next = sizeCount.next;
			for (let index = 0; index < sizeCount.value; index += 1) {
				const size = readCompressed(blob, next);
				sizes.push(size.value);
				next = size.next;
			}
			const boundCount = readCompressed(blob, next);
			if (boundCount.value > rank.value) return malformedSignature("array has more lower bounds than dimensions", offset);
			const lowerBounds = [];
			next = boundCount.next;
			for (let index = 0; index < boundCount.value; index += 1) {
				const bound = readSignedCompressed(blob, next);
				lowerBounds.push(bound.value);
				next = bound.next;
			}
			const dimensions = Array.from({ length: rank.value }, (_, index) => {
				const size = sizes[index];
				const lower = lowerBounds[index];
				if (lower !== undefined) return size === undefined ? `${String(lower)}...` : `${String(lower)}...${String(lower + size - 1)}`;
				if (size !== undefined) return String(size);
				return rank.value === 1 ? "..." : "";
			});
			return {
				value: `[${dimensions.join(",")}]`,
				next
			};
		};
		currentPosition = (stack, base) => {
			const frame = stack.findLast(({ kind }) => kind !== "modifiers");
			if (frame === undefined) return base;
			if (frame.kind === "suffix") return frame.suffix === "*" ? "pointee" : "type";
			if (frame.kind === "list" && frame.signatureItems) return frame.items.length === 0 ? "return" : "parameter";
			return "type";
		};
		POSITION_ELEMENTS = new Map([
			[1, ["return", "pointee"]],
			[22, ["return", "parameter"]],
			[16, [
				"return",
				"parameter",
				"field"
			]]
		]);
		readTypeOperand = (blob, offset, layout, tables = [
			2,
			1,
			27
		]) => {
			const token = readCompressed(blob, offset);
			if (layout !== undefined) {
				const reason = token.value === 0 ? "type operand is null" : metadataCodedTokenInvalidReason(token.value, 2, tables, layout.rowCounts);
				if (reason !== null) throw managedFailure("invalid-row", "signature", `TypeDefOrRefOrSpec operand 0x${token.value.toString(16)} is invalid: ${reason}`, offset);
			}
			return token;
		};
		readTypeSignature = (blob, offset, base, layout) => {
			const stack = [];
			let cursor = offset;
			for (;;) {
				let value;
				const kind = blob[cursor];
				if (kind === undefined) return malformedSignature("truncated type signature", cursor);
				const positions = POSITION_ELEMENTS.get(kind);
				if (positions !== undefined && !positions.includes(currentPosition(stack, base))) return malformedSignature(`element type 0x${kind.toString(16)} is not valid in a ${currentPosition(stack, base)} position`, cursor);
				const named = ELEMENT_TYPES.get(kind);
				if (named !== undefined) {
					value = named;
					cursor += 1;
				} else if (kind === 15 || kind === 16 || kind === 29) {
					const suffix = kind === 15 ? "*" : kind === 16 ? "&" : "[]";
					stack.push({
						kind: "suffix",
						suffix
					});
					cursor += 1;
				} else if (kind === 31 || kind === 32) {
					const token = readTypeOperand(blob, cursor + 1, layout);
					const modifier = `${kind === 31 ? "modreq" : "modopt"}:${String(token.value)}`;
					const top = stack.at(-1);
					if (top?.kind === "modifiers") top.modifiers.push(modifier);
					else stack.push({
						kind: "modifiers",
						modifiers: [modifier]
					});
					cursor = token.next;
				} else if (kind === 17 || kind === 18) {
					const token = readTypeOperand(blob, cursor + 1, layout);
					value = `${kind === 17 ? "valuetype" : "class"}:${String(token.value)}`;
					cursor = token.next;
				} else if (kind === 30 || kind === 19) {
					const variable = readCompressed(blob, cursor + 1);
					value = `${kind === 30 ? "mvar" : "var"}:${String(variable.value)}`;
					cursor = variable.next;
				} else if (kind === 22) {
					value = "typedbyref";
					cursor += 1;
				} else if (kind === 20) {
					stack.push({ kind: "array" });
					cursor += 1;
				} else if (kind === 21) {
					const generic = blob[cursor + 1];
					if (generic !== 17 && generic !== 18) return malformedSignature("generic instantiation does not name a class or value type", cursor + 1);
					const token = readTypeOperand(blob, cursor + 2, layout, [2, 1]);
					const argumentCount = readCompressed(blob, token.next);
					if (argumentCount.value === 0) return malformedSignature("generic instantiation has no type arguments", token.next);
					const head = `${generic === 17 ? "valuetype" : "class"}:${String(token.value)}`;
					stack.push({
						kind: "list",
						remaining: argumentCount.value,
						items: [],
						signatureItems: false,
						render: (items) => `${head}<${items.join(",")}>`
					});
					cursor = argumentCount.next;
				} else if (kind === 27) {
					const header = readMethodSignatureHeader(blob, cursor + 1, "function-pointer");
					const convention = callingConvention(header.first);
					const head = header.genericParameterCount === null ? convention : `${convention};${String(header.genericParameterCount)}`;
					stack.push({
						kind: "list",
						remaining: header.parameterCount + 1,
						items: [],
						signatureItems: true,
						render: ([returnType, ...parameters]) => `fnptr[${head}](${parameters.join(",")})->${returnType ?? ""}`
					});
					cursor = header.next;
				} else {
					throw managedFailure("unsupported-signature", "signature", `unsupported element type 0x${kind.toString(16)}`, cursor);
				}
				while (value !== undefined) {
					const top = stack.pop();
					if (top === undefined) return {
						value,
						next: cursor
					};
					if (top.kind === "suffix") value += top.suffix;
					else if (top.kind === "modifiers") value = `${value} ${top.modifiers.join(" ")}`;
					else if (top.kind === "array") {
						const shape = arrayShape(blob, cursor);
						value += shape.value;
						cursor = shape.next;
					} else {
						top.items.push(value);
						top.remaining -= 1;
						if (top.remaining === 0) value = top.render(top.items);
						else {
							value = undefined;
							stack.push(top);
						}
					}
				}
			}
		};
		CALLING_CONVENTION_NAMES = new Map([
			[0, "default"],
			[1, "c"],
			[2, "stdcall"],
			[3, "thiscall"],
			[4, "fastcall"],
			[5, "vararg"],
			[6, "field"],
			[9, "unmanaged"]
		]);
		callingConvention = (value) => {
			const base = value & 15;
			const flags = [
				(value & 32) === 0 ? null : "has-this",
				(value & 64) === 0 ? null : "explicit-this",
				(value & 16) === 0 ? null : "generic"
			].filter((flag) => flag !== null);
			const name = CALLING_CONVENTION_NAMES.get(base) ?? `unknown:${String(base)}`;
			return flags.length === 0 ? name : `${name} ${flags.join(" ")}`;
		};
		specSignature = (layout, blob, owner) => {
			const budget = managedDecodeBudget(layout);
			budget.admitTransient(blob.length * 256, owner.offset);
			try {
				let cursor = 0;
				let count = 1;
				if (owner.form === "instantiation") {
					if (blob[0] !== 10) malformedSignature("MethodSpec instantiation is not GENERICINST", 0);
					const header = readCompressed(blob, 1);
					if (header.value === 0) malformedSignature("MethodSpec instantiation has no type arguments", 1);
					count = header.value;
					cursor = header.next;
				}
				const types = [];
				for (let index = 0; index < count; index += 1) {
					const type = readTypeSignature(blob, cursor, "type", layout);
					types.push(type.value);
					cursor = type.next;
				}
				if (cursor !== blob.length) malformedSignature("Trailing signature data", cursor);
				return types;
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure) || cause.issue.code !== "invalid-blob" && cause.issue.code !== "invalid-row" && cause.issue.code !== "unsupported-signature") throw cause;
				throw managedFailure(cause.issue.code, owner.scope, cause.issue.detail, owner.offset);
			} finally {
				budget.releaseTransient();
			}
		};
		decodeSignature = (blob) => {
			try {
				if (blob.length === 0) throw managedFailure("invalid-blob", "signature", "empty signature", 0);
				const first = blob[0] ?? 0;
				if (first === 6) {
					const fieldType = readTypeSignature(blob, 1, "field");
					return {
						kind: "field",
						parse_status: fieldType.next === blob.length ? "decoded" : "partial",
						calling_convention: callingConvention(first),
						generic_parameter_count: null,
						parameter_count: null,
						return_type: null,
						parameter_types: [],
						field_type: fieldType.value,
						issue: fieldType.next === blob.length ? null : "Trailing signature data"
					};
				}
				const header = readMethodSignatureHeader(blob, 0, "member");
				const returnType = readTypeSignature(blob, header.next, "return");
				let offset = returnType.next;
				const parameters = [];
				for (let index = 0; index < header.parameterCount; index += 1) {
					const parameter = readTypeSignature(blob, offset, "parameter");
					parameters.push(parameter.value);
					offset = parameter.next;
				}
				return {
					kind: "method",
					parse_status: offset === blob.length ? "decoded" : "partial",
					calling_convention: callingConvention(first),
					generic_parameter_count: header.genericParameterCount,
					parameter_count: header.parameterCount,
					return_type: returnType.value,
					parameter_types: parameters,
					field_type: null,
					issue: offset === blob.length ? null : "Trailing signature data"
				};
			} catch (cause) {
				if (!(cause instanceof ManagedReaderFailure)) throw cause;
				if (cause.issue.code !== "invalid-blob" && cause.issue.code !== "unsupported-signature") throw cause;
				return {
					kind: "unknown",
					parse_status: cause.issue.code === "unsupported-signature" ? "unsupported" : "malformed",
					calling_convention: null,
					generic_parameter_count: null,
					parameter_count: null,
					return_type: null,
					parameter_types: [],
					field_type: null,
					issue: cause.issue.detail
				};
			}
		};
		methodGenericArity = (layout, blob) => {
			const budget = managedDecodeBudget(layout);
			budget.admitTransient(blob.length * 256, layout.blob.offset);
			try {
				return signatureGenericArity(decodeSignature(blob));
			} finally {
				budget.releaseTransient();
			}
		};
		signatureGenericArity = (decoded) => decoded.kind === "method" && decoded.parse_status === "decoded" ? decoded.generic_parameter_count ?? 0 : null;
		signature = (blob, rawSha256) => ({
			raw_length: blob.length,
			raw_sha256: rawSha256 ?? sha256Bytes(blob),
			...decodeSignature(blob)
		});
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMethodSpecs.js
var edgeTargets, readMethodSpec, methodSignatureBlob;
function init_ManagedMethodSpecs() {
	return (init_ManagedMethodSpecs = __esmMin((() => {
		init_ManagedMemberInspectorCore();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		edgeTargets = (bytes, layout, methods, cores) => {
			const members = new Map(cores.flatMap((core) => [...core]));
			const issues = [];
			const seen = new Set();
			const arities = new Map();
			for (const method of methods) for (const { operand } of method.body.anchors) {
				if (operand?.startsWith("0x2b") !== true || seen.has(operand)) continue;
				seen.add(operand);
				readManagedValue(() => readMethodSpec({
					bytes,
					layout,
					members,
					issues,
					arities
				}, operand), issues);
			}
			return {
				members,
				issues
			};
		};
		readMethodSpec = ({ bytes, layout, members, issues, arities }, token) => {
			const scope = `metadata.MethodSpec:${token}`;
			const cursor = metadataRowCursor(bytes, layout, 43, Number.parseInt(token.slice(4), 16));
			const methodRaw = cursor.readIndex(layout.codedIndexSize("MethodDefOrRef"));
			const instantiation = cursor.readIndex(layout.blobIndexSize);
			const methodReason = metadataCodedTokenInvalidReason(methodRaw, 1, [6, 10], layout.rowCounts);
			if (methodReason !== null || methodRaw === 0) issues.push({
				code: "invalid-row",
				scope,
				offset: cursor.start,
				detail: methodReason === null ? "MethodSpec method coded index 0x0 is null, but the Method column must reference a row" : `MethodSpec method coded index 0x${methodRaw.toString(16)} is invalid: ${methodReason}`
			});
			const generic = metadataCodedToken(methodRaw, 1, [6, 10], layout.rowCounts);
			const target = generic === null ? undefined : members.get(generic);
			if (target !== undefined && target.kind !== "field") members.set(token, {
				...target,
				token
			});
			const types = specSignature(layout, readMetadataBlob(bytes, layout, instantiation, layout.blob.size), {
				form: "instantiation",
				scope,
				offset: cursor.start
			});
			if (generic === null) return;
			if (target?.genericArity === undefined && !arities.has(generic)) arities.set(generic, methodGenericArity(layout, methodSignatureBlob(bytes, layout, generic)));
			const arity = target?.genericArity === undefined ? arities.get(generic) ?? null : target.genericArity;
			if (arity !== types.length) throw managedFailure("invalid-row", scope, arity === null ? "MethodSpec method does not have a decodable method signature" : `MethodSpec supplies ${String(types.length)} type argument(s), but its method declares ${String(arity)} generic parameter(s)`, cursor.start);
		};
		methodSignatureBlob = (bytes, layout, token) => {
			const table = Number.parseInt(token.slice(2, 4), 16);
			const cursor = metadataRowCursor(bytes, layout, table, Number.parseInt(token.slice(4), 16));
			if (table === 6) {
				cursor.readUInt32();
				cursor.readUInt16();
				cursor.readUInt16();
			} else cursor.readIndex(layout.codedIndexSize("MemberRefParent"));
			cursor.readIndex(layout.stringIndexSize);
			return readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), layout.blob.size);
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedTypeNames.js
var typeNameLookup;
function init_ManagedTypeNames() {
	return (init_ManagedTypeNames = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMemberInspectorCore();
		init_ManagedMetadataLayout();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		typeNameLookup = (bytes, layout, ranges, issues) => {
			const names = new Map();
			const checkedScopes = new Set();
			const validateScopeChain = (row) => {
				const path = new Set();
				let current = row;
				while (!checkedScopes.has(current)) {
					const cursor = metadataRowCursor(bytes, layout, 1, current);
					if (path.has(current)) {
						issues.push({
							code: "invalid-row",
							scope: `metadata.TypeRef:${metadataToken(1, current)}`,
							offset: cursor.start,
							detail: "TypeRef ResolutionScope chain contains a cycle"
						});
						break;
					}
					managedDecodeBudget(layout).reserve(128, cursor.start);
					path.add(current);
					const raw = cursor.readIndex(layout.codedIndexSize("ResolutionScope"));
					const reason = metadataCodedTokenInvalidReason(raw, 2, [
						0,
						26,
						35,
						1
					], layout.rowCounts);
					if (reason !== null) {
						issues.push({
							code: "invalid-row",
							scope: `metadata.TypeRef:${metadataToken(1, current)}`,
							offset: cursor.start,
							detail: `TypeRef ResolutionScope coded index 0x${raw.toString(16)} is invalid: ${reason}`
						});
						break;
					}
					if (raw === 0 || (raw & 3) !== 3) break;
					current = Math.floor(raw / 4);
				}
				for (const visited of path) checkedScopes.add(visited);
			};
			const definitionName = (table, row) => {
				if (table === 2) {
					metadataRowOffset(layout, 2, row);
					return ranges[row - 1]?.fullName ?? null;
				}
				const cursor = metadataRowCursor(bytes, layout, 1, row);
				cursor.readIndex(layout.codedIndexSize("ResolutionScope"));
				readManagedValue(() => validateScopeChain(row), issues);
				const name = cursor.readIndex(layout.stringIndexSize);
				const namespace = cursor.readIndex(layout.stringIndexSize);
				return fullName(readMetadataString(bytes, layout, namespace, layout.strings.size), readMetadataString(bytes, layout, name, layout.strings.size));
			};
			const specName = (row) => {
				const cursor = metadataRowCursor(bytes, layout, 27, row);
				const spec = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), layout.blob.size);
				const owner = {
					form: "type",
					scope: `metadata.TypeSpec:${metadataToken(27, row)}`,
					offset: cursor.start
				};
				specSignature(layout, spec, owner);
				if (spec[0] !== 21) return null;
				const encoded = readCompressed(spec, 2).value;
				const table = [2, 1][encoded & 3];
				if (table === undefined) throw managedFailure("invalid-blob", owner.scope, "Generic instantiation does not name a TypeDef or TypeRef", owner.offset);
				return definitionName(table, Math.floor(encoded / 4));
			};
			return (token) => {
				if (token === null) return null;
				if (names.has(token)) return names.get(token) ?? null;
				const table = Number.parseInt(token.slice(2, 4), 16);
				const row = Number.parseInt(token.slice(4), 16);
				const name = readManagedValue(() => table === 27 ? specName(row) : table === 1 || table === 2 ? definitionName(table, row) : null, issues) ?? null;
				names.set(token, name);
				return name;
			};
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedUserStrings.js
var inventory, USER_STRING_TOKEN_BYTES, parseUserStrings;
function init_ManagedUserStrings() {
	return (init_ManagedUserStrings = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		inventory = (literals, issues, scanned) => ({
			state: issues.length === 0 && scanned ? "complete" : "partial",
			literals,
			issues
		});
		USER_STRING_TOKEN_BYTES = 128;
		parseUserStrings = (bytes, layout, parsed) => {
			const { methods } = parsed;
			const budget = managedDecodeBudget(layout);
			const scanned = parsed.unscannedMethods === 0 && (parsed.unreadableSelectedTypes ?? 0) === 0;
			const userStrings = [];
			const issues = [];
			const tokens = new Set();
			try {
				for (const method of methods) for (const { opcode, operand } of method.body.anchors) if (opcode === "ldstr" && operand !== null && !tokens.has(operand)) {
					budget.admitTransient(USER_STRING_TOKEN_BYTES, null);
					tokens.add(operand);
				}
				const references = [];
				for (const token of [...tokens].sort()) {
					if (token.startsWith("0x70")) references.push(token);
					else issues.push(admitManagedProjection({
						code: "invalid-heap-index",
						scope: `metadata.#US:${token}`,
						offset: null,
						detail: "ldstr operand does not name an item inside #US"
					}, budget));
				}
				if (references.length > 0 && layout.userStrings === null) {
					issues.push(admitManagedProjection({
						code: "missing-stream",
						scope: "metadata.#US",
						offset: null,
						detail: `${String(references.length)} distinct ldstr operand(s) reference #US, but the metadata has no #US stream`
					}, budget));
					return inventory(userStrings, issues, scanned);
				}
				for (const token of references) {
					const failures = [];
					readManagedValue(() => {
						const { offset, value, issues: observed } = readMetadataUserString(bytes, layout, token);
						for (const issue of observed) failures.push(issue);
						userStrings.push(admitManagedProjection({
							token,
							offset,
							value
						}, budget));
					}, failures);
					for (const failure of failures) issues.push(admitManagedProjection(failure, budget));
				}
				return inventory(userStrings, issues, scanned);
			} finally {
				budget.releaseTransient();
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedTypeMemberLists.js
var readTypeMemberListFacts;
function init_ManagedTypeMemberLists() {
	return (init_ManagedTypeMemberLists = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMetadataHeaps();
		init_ManagedMemberPointers();
		readTypeMemberListFacts = (bytes, layout) => {
			const fields = memberListTable(layout, 4);
			const methods = memberListTable(layout, 6);
			const rows = [];
			const issues = [];
			const types = layout.table(2);
			const typeCount = types?.rowCount ?? 0;
			managedDecodeBudget(layout).reserve(typeCount * 512 + 256, types?.offset ?? null);
			for (let row = 1; row <= typeCount; row += 1) {
				const cursor = metadataRowCursor(bytes, layout, 2, row);
				cursor.readUInt32();
				cursor.readIndex(layout.stringIndexSize);
				cursor.readIndex(layout.stringIndexSize);
				cursor.readIndex(layout.codedIndexSize("TypeDefOrRef"));
				const field = {
					offset: cursor.offset,
					raw: cursor.readIndex(memberListIndexSize(layout, 4))
				};
				const method = {
					offset: cursor.offset,
					raw: cursor.readIndex(memberListIndexSize(layout, 6))
				};
				const entry = {
					field: {
						...field,
						value: validatedMemberListStart(field.raw, fields)
					},
					method: {
						...method,
						value: validatedMemberListStart(method.raw, methods)
					}
				};
				rows.push(entry);
				for (const [name, start, table] of [[
					"FieldList",
					entry.field,
					fields
				], [
					"MethodList",
					entry.method,
					methods
				]]) if (start.value === null) {
					managedDecodeBudget(layout).reserve(512, start.offset);
					issues.push({
						code: "invalid-row",
						scope: `metadata.TypeDef:${metadataToken(2, row)}`,
						offset: start.offset,
						detail: `TypeDef ${name} start ${String(start.raw)} is outside the one-based list range 1..${String((table?.rowCount ?? 0) + 1)}`
					});
				}
			}
			const nonmonotonicFields = new Set();
			const nonmonotonicMethods = new Set();
			for (let index = 0; index + 1 < rows.length; index += 1) {
				const current = rows[index];
				const next = rows[index + 1];
				if (current === undefined || next === undefined) continue;
				for (const [name, before, after, affected] of [[
					"FieldList",
					current.field,
					next.field,
					nonmonotonicFields
				], [
					"MethodList",
					current.method,
					next.method,
					nonmonotonicMethods
				]]) if (before.value !== null && after.value !== null && after.value < before.value) {
					managedDecodeBudget(layout).reserve(512, after.offset);
					affected.add(index);
					affected.add(index + 1);
					issues.push({
						code: "invalid-row",
						scope: `metadata.TypeDef:${metadataToken(2, index + 2)}`,
						offset: after.offset,
						detail: `TypeDef ${name} start ${String(after.raw)} decreases from preceding start ${String(before.raw)}; adjacent member ranges are unknown`
					});
				}
			}
			const entries = rows.map((entry, index) => {
				const next = rows[index + 1];
				return {
					field: {
						start: {
							...entry.field,
							value: nonmonotonicFields.has(index) ? null : entry.field.value
						},
						end: next === undefined ? (fields?.rowCount ?? 0) + 1 : nonmonotonicFields.has(index) || nonmonotonicFields.has(index + 1) ? null : next.field.value
					},
					method: {
						start: {
							...entry.method,
							value: nonmonotonicMethods.has(index) ? null : entry.method.value
						},
						end: next === undefined ? (methods?.rowCount ?? 0) + 1 : nonmonotonicMethods.has(index) || nonmonotonicMethods.has(index + 1) ? null : next.method.value
					}
				};
			});
			return {
				entries,
				issues
			};
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMemberInstructionDecoder.js
var PREFIX_OPCODES, OPCODES, tokenKind, floatingPointOperand, fixed, FIXED_OPERAND_READERS, TOKEN_OPERAND_KINDS, TOKEN_OPERAND_WIDTH, operandExtent, readOperand, decodeInstructions, parseExceptionRegions, malformedExceptionRegions, readExceptionClauses;
function init_ManagedMemberInstructionDecoder() {
	return (init_ManagedMemberInstructionDecoder = __esmMin((() => {
		init_ManagedReaderFailure();
		PREFIX_OPCODES = new Set([
			"unaligned.",
			"volatile.",
			"tail.",
			"constrained.",
			"readonly.",
			"no."
		]);
		OPCODES = new Map([
			[0, {
				name: "nop",
				operand: "none"
			}],
			[1, {
				name: "break",
				operand: "none"
			}],
			[2, {
				name: "ldarg.0",
				operand: "none"
			}],
			[3, {
				name: "ldarg.1",
				operand: "none"
			}],
			[4, {
				name: "ldarg.2",
				operand: "none"
			}],
			[5, {
				name: "ldarg.3",
				operand: "none"
			}],
			[6, {
				name: "ldloc.0",
				operand: "none"
			}],
			[7, {
				name: "ldloc.1",
				operand: "none"
			}],
			[8, {
				name: "ldloc.2",
				operand: "none"
			}],
			[9, {
				name: "ldloc.3",
				operand: "none"
			}],
			[10, {
				name: "stloc.0",
				operand: "none"
			}],
			[11, {
				name: "stloc.1",
				operand: "none"
			}],
			[12, {
				name: "stloc.2",
				operand: "none"
			}],
			[13, {
				name: "stloc.3",
				operand: "none"
			}],
			[14, {
				name: "ldarg.s",
				operand: "short-var"
			}],
			[15, {
				name: "ldarga.s",
				operand: "short-var"
			}],
			[16, {
				name: "starg.s",
				operand: "short-var"
			}],
			[17, {
				name: "ldloc.s",
				operand: "short-var"
			}],
			[18, {
				name: "ldloca.s",
				operand: "short-var"
			}],
			[19, {
				name: "stloc.s",
				operand: "short-var"
			}],
			[20, {
				name: "ldnull",
				operand: "none"
			}],
			[21, {
				name: "ldc.i4.m1",
				operand: "none"
			}],
			[22, {
				name: "ldc.i4.0",
				operand: "none"
			}],
			[23, {
				name: "ldc.i4.1",
				operand: "none"
			}],
			[24, {
				name: "ldc.i4.2",
				operand: "none"
			}],
			[25, {
				name: "ldc.i4.3",
				operand: "none"
			}],
			[26, {
				name: "ldc.i4.4",
				operand: "none"
			}],
			[27, {
				name: "ldc.i4.5",
				operand: "none"
			}],
			[28, {
				name: "ldc.i4.6",
				operand: "none"
			}],
			[29, {
				name: "ldc.i4.7",
				operand: "none"
			}],
			[30, {
				name: "ldc.i4.8",
				operand: "none"
			}],
			[31, {
				name: "ldc.i4.s",
				operand: "short-i"
			}],
			[32, {
				name: "ldc.i4",
				operand: "i"
			}],
			[33, {
				name: "ldc.i8",
				operand: "i8"
			}],
			[34, {
				name: "ldc.r4",
				operand: "r4"
			}],
			[35, {
				name: "ldc.r8",
				operand: "r8"
			}],
			[37, {
				name: "dup",
				operand: "none"
			}],
			[38, {
				name: "pop",
				operand: "none"
			}],
			[39, {
				name: "jmp",
				operand: "method"
			}],
			[40, {
				name: "call",
				operand: "method"
			}],
			[41, {
				name: "calli",
				operand: "signature"
			}],
			[42, {
				name: "ret",
				operand: "none"
			}],
			[43, {
				name: "br.s",
				operand: "short-branch"
			}],
			[44, {
				name: "brfalse.s",
				operand: "short-branch"
			}],
			[45, {
				name: "brtrue.s",
				operand: "short-branch"
			}],
			[46, {
				name: "beq.s",
				operand: "short-branch"
			}],
			[47, {
				name: "bge.s",
				operand: "short-branch"
			}],
			[48, {
				name: "bgt.s",
				operand: "short-branch"
			}],
			[49, {
				name: "ble.s",
				operand: "short-branch"
			}],
			[50, {
				name: "blt.s",
				operand: "short-branch"
			}],
			[51, {
				name: "bne.un.s",
				operand: "short-branch"
			}],
			[52, {
				name: "bge.un.s",
				operand: "short-branch"
			}],
			[53, {
				name: "bgt.un.s",
				operand: "short-branch"
			}],
			[54, {
				name: "ble.un.s",
				operand: "short-branch"
			}],
			[55, {
				name: "blt.un.s",
				operand: "short-branch"
			}],
			[56, {
				name: "br",
				operand: "branch"
			}],
			[57, {
				name: "brfalse",
				operand: "branch"
			}],
			[58, {
				name: "brtrue",
				operand: "branch"
			}],
			[59, {
				name: "beq",
				operand: "branch"
			}],
			[60, {
				name: "bge",
				operand: "branch"
			}],
			[61, {
				name: "bgt",
				operand: "branch"
			}],
			[62, {
				name: "ble",
				operand: "branch"
			}],
			[63, {
				name: "blt",
				operand: "branch"
			}],
			[64, {
				name: "bne.un",
				operand: "branch"
			}],
			[65, {
				name: "bge.un",
				operand: "branch"
			}],
			[66, {
				name: "bgt.un",
				operand: "branch"
			}],
			[67, {
				name: "ble.un",
				operand: "branch"
			}],
			[68, {
				name: "blt.un",
				operand: "branch"
			}],
			[69, {
				name: "switch",
				operand: "switch"
			}],
			[70, {
				name: "ldind.i1",
				operand: "none"
			}],
			[71, {
				name: "ldind.u1",
				operand: "none"
			}],
			[72, {
				name: "ldind.i2",
				operand: "none"
			}],
			[73, {
				name: "ldind.u2",
				operand: "none"
			}],
			[74, {
				name: "ldind.i4",
				operand: "none"
			}],
			[75, {
				name: "ldind.u4",
				operand: "none"
			}],
			[76, {
				name: "ldind.i8",
				operand: "none"
			}],
			[77, {
				name: "ldind.i",
				operand: "none"
			}],
			[78, {
				name: "ldind.r4",
				operand: "none"
			}],
			[79, {
				name: "ldind.r8",
				operand: "none"
			}],
			[80, {
				name: "ldind.ref",
				operand: "none"
			}],
			[81, {
				name: "stind.ref",
				operand: "none"
			}],
			[82, {
				name: "stind.i1",
				operand: "none"
			}],
			[83, {
				name: "stind.i2",
				operand: "none"
			}],
			[84, {
				name: "stind.i4",
				operand: "none"
			}],
			[85, {
				name: "stind.i8",
				operand: "none"
			}],
			[86, {
				name: "stind.r4",
				operand: "none"
			}],
			[87, {
				name: "stind.r8",
				operand: "none"
			}],
			[88, {
				name: "add",
				operand: "none"
			}],
			[89, {
				name: "sub",
				operand: "none"
			}],
			[90, {
				name: "mul",
				operand: "none"
			}],
			[91, {
				name: "div",
				operand: "none"
			}],
			[92, {
				name: "div.un",
				operand: "none"
			}],
			[93, {
				name: "rem",
				operand: "none"
			}],
			[94, {
				name: "rem.un",
				operand: "none"
			}],
			[95, {
				name: "and",
				operand: "none"
			}],
			[96, {
				name: "or",
				operand: "none"
			}],
			[97, {
				name: "xor",
				operand: "none"
			}],
			[98, {
				name: "shl",
				operand: "none"
			}],
			[99, {
				name: "shr",
				operand: "none"
			}],
			[100, {
				name: "shr.un",
				operand: "none"
			}],
			[101, {
				name: "neg",
				operand: "none"
			}],
			[102, {
				name: "not",
				operand: "none"
			}],
			[103, {
				name: "conv.i1",
				operand: "none"
			}],
			[104, {
				name: "conv.i2",
				operand: "none"
			}],
			[105, {
				name: "conv.i4",
				operand: "none"
			}],
			[106, {
				name: "conv.i8",
				operand: "none"
			}],
			[107, {
				name: "conv.r4",
				operand: "none"
			}],
			[108, {
				name: "conv.r8",
				operand: "none"
			}],
			[109, {
				name: "conv.u4",
				operand: "none"
			}],
			[110, {
				name: "conv.u8",
				operand: "none"
			}],
			[111, {
				name: "callvirt",
				operand: "method"
			}],
			[112, {
				name: "cpobj",
				operand: "type"
			}],
			[113, {
				name: "ldobj",
				operand: "type"
			}],
			[114, {
				name: "ldstr",
				operand: "string"
			}],
			[115, {
				name: "newobj",
				operand: "method"
			}],
			[116, {
				name: "castclass",
				operand: "type"
			}],
			[117, {
				name: "isinst",
				operand: "type"
			}],
			[118, {
				name: "conv.r.un",
				operand: "none"
			}],
			[121, {
				name: "unbox",
				operand: "type"
			}],
			[122, {
				name: "throw",
				operand: "none"
			}],
			[123, {
				name: "ldfld",
				operand: "field"
			}],
			[124, {
				name: "ldflda",
				operand: "field"
			}],
			[125, {
				name: "stfld",
				operand: "field"
			}],
			[126, {
				name: "ldsfld",
				operand: "field"
			}],
			[127, {
				name: "ldsflda",
				operand: "field"
			}],
			[128, {
				name: "stsfld",
				operand: "field"
			}],
			[129, {
				name: "stobj",
				operand: "type"
			}],
			[130, {
				name: "conv.ovf.i1.un",
				operand: "none"
			}],
			[131, {
				name: "conv.ovf.i2.un",
				operand: "none"
			}],
			[132, {
				name: "conv.ovf.i4.un",
				operand: "none"
			}],
			[133, {
				name: "conv.ovf.i8.un",
				operand: "none"
			}],
			[134, {
				name: "conv.ovf.u1.un",
				operand: "none"
			}],
			[135, {
				name: "conv.ovf.u2.un",
				operand: "none"
			}],
			[136, {
				name: "conv.ovf.u4.un",
				operand: "none"
			}],
			[137, {
				name: "conv.ovf.u8.un",
				operand: "none"
			}],
			[138, {
				name: "conv.ovf.i.un",
				operand: "none"
			}],
			[139, {
				name: "conv.ovf.u.un",
				operand: "none"
			}],
			[140, {
				name: "box",
				operand: "type"
			}],
			[141, {
				name: "newarr",
				operand: "type"
			}],
			[142, {
				name: "ldlen",
				operand: "none"
			}],
			[143, {
				name: "ldelema",
				operand: "type"
			}],
			[144, {
				name: "ldelem.i1",
				operand: "none"
			}],
			[145, {
				name: "ldelem.u1",
				operand: "none"
			}],
			[146, {
				name: "ldelem.i2",
				operand: "none"
			}],
			[147, {
				name: "ldelem.u2",
				operand: "none"
			}],
			[148, {
				name: "ldelem.i4",
				operand: "none"
			}],
			[149, {
				name: "ldelem.u4",
				operand: "none"
			}],
			[150, {
				name: "ldelem.i8",
				operand: "none"
			}],
			[151, {
				name: "ldelem.i",
				operand: "none"
			}],
			[152, {
				name: "ldelem.r4",
				operand: "none"
			}],
			[153, {
				name: "ldelem.r8",
				operand: "none"
			}],
			[154, {
				name: "ldelem.ref",
				operand: "none"
			}],
			[155, {
				name: "stelem.i",
				operand: "none"
			}],
			[156, {
				name: "stelem.i1",
				operand: "none"
			}],
			[157, {
				name: "stelem.i2",
				operand: "none"
			}],
			[158, {
				name: "stelem.i4",
				operand: "none"
			}],
			[159, {
				name: "stelem.i8",
				operand: "none"
			}],
			[160, {
				name: "stelem.r4",
				operand: "none"
			}],
			[161, {
				name: "stelem.r8",
				operand: "none"
			}],
			[162, {
				name: "stelem.ref",
				operand: "none"
			}],
			[163, {
				name: "ldelem",
				operand: "type"
			}],
			[164, {
				name: "stelem",
				operand: "type"
			}],
			[165, {
				name: "unbox.any",
				operand: "type"
			}],
			[179, {
				name: "conv.ovf.i1",
				operand: "none"
			}],
			[180, {
				name: "conv.ovf.u1",
				operand: "none"
			}],
			[181, {
				name: "conv.ovf.i2",
				operand: "none"
			}],
			[182, {
				name: "conv.ovf.u2",
				operand: "none"
			}],
			[183, {
				name: "conv.ovf.i4",
				operand: "none"
			}],
			[184, {
				name: "conv.ovf.u4",
				operand: "none"
			}],
			[185, {
				name: "conv.ovf.i8",
				operand: "none"
			}],
			[186, {
				name: "conv.ovf.u8",
				operand: "none"
			}],
			[194, {
				name: "refanyval",
				operand: "type"
			}],
			[195, {
				name: "ckfinite",
				operand: "none"
			}],
			[198, {
				name: "mkrefany",
				operand: "type"
			}],
			[208, {
				name: "ldtoken",
				operand: "token"
			}],
			[209, {
				name: "conv.u2",
				operand: "none"
			}],
			[210, {
				name: "conv.u1",
				operand: "none"
			}],
			[211, {
				name: "conv.i",
				operand: "none"
			}],
			[212, {
				name: "conv.ovf.i",
				operand: "none"
			}],
			[213, {
				name: "conv.ovf.u",
				operand: "none"
			}],
			[214, {
				name: "add.ovf",
				operand: "none"
			}],
			[215, {
				name: "add.ovf.un",
				operand: "none"
			}],
			[216, {
				name: "mul.ovf",
				operand: "none"
			}],
			[217, {
				name: "mul.ovf.un",
				operand: "none"
			}],
			[218, {
				name: "sub.ovf",
				operand: "none"
			}],
			[219, {
				name: "sub.ovf.un",
				operand: "none"
			}],
			[220, {
				name: "endfinally",
				operand: "none"
			}],
			[221, {
				name: "leave",
				operand: "branch"
			}],
			[222, {
				name: "leave.s",
				operand: "short-branch"
			}],
			[223, {
				name: "stind.i",
				operand: "none"
			}],
			[224, {
				name: "conv.u",
				operand: "none"
			}],
			[65024, {
				name: "arglist",
				operand: "none"
			}],
			[65025, {
				name: "ceq",
				operand: "none"
			}],
			[65026, {
				name: "cgt",
				operand: "none"
			}],
			[65027, {
				name: "cgt.un",
				operand: "none"
			}],
			[65028, {
				name: "clt",
				operand: "none"
			}],
			[65029, {
				name: "clt.un",
				operand: "none"
			}],
			[65030, {
				name: "ldftn",
				operand: "method"
			}],
			[65031, {
				name: "ldvirtftn",
				operand: "method"
			}],
			[65033, {
				name: "ldarg",
				operand: "var"
			}],
			[65034, {
				name: "ldarga",
				operand: "var"
			}],
			[65035, {
				name: "starg",
				operand: "var"
			}],
			[65036, {
				name: "ldloc",
				operand: "var"
			}],
			[65037, {
				name: "ldloca",
				operand: "var"
			}],
			[65038, {
				name: "stloc",
				operand: "var"
			}],
			[65039, {
				name: "localloc",
				operand: "none"
			}],
			[65041, {
				name: "endfilter",
				operand: "none"
			}],
			[65042, {
				name: "unaligned.",
				operand: "short-i"
			}],
			[65043, {
				name: "volatile.",
				operand: "none"
			}],
			[65044, {
				name: "tail.",
				operand: "none"
			}],
			[65045, {
				name: "initobj",
				operand: "type"
			}],
			[65046, {
				name: "constrained.",
				operand: "type"
			}],
			[65047, {
				name: "cpblk",
				operand: "none"
			}],
			[65048, {
				name: "initblk",
				operand: "none"
			}],
			[65049, {
				name: "no.",
				operand: "short-i"
			}],
			[65050, {
				name: "rethrow",
				operand: "none"
			}],
			[65052, {
				name: "sizeof",
				operand: "type"
			}],
			[65053, {
				name: "refanytype",
				operand: "none"
			}],
			[65054, {
				name: "readonly.",
				operand: "none"
			}]
		]);
		tokenKind = (token) => {
			if (token.startsWith("0x06") || token.startsWith("0x0a") || token.startsWith("0x2b")) return "method";
			if (token.startsWith("0x04")) return "field";
			if (token.startsWith("0x70")) return "string";
			if (token.startsWith("0x11")) return "signature";
			if (token.startsWith("0x01") || token.startsWith("0x02") || token.startsWith("0x1b")) return "type";
			return "token";
		};
		floatingPointOperand = (value) => Object.is(value, -0) ? "-0" : String(value);
		fixed = (width, read) => ({
			width,
			read
		});
		FIXED_OPERAND_READERS = new Map([
			["none", fixed(0, (_il, offset) => ({
				next: offset,
				anchorKind: "none",
				value: null
			}))],
			["short-var", fixed(1, (il, offset) => ({
				next: offset + 1,
				anchorKind: "variable",
				value: String(il.readUInt8(offset))
			}))],
			["var", fixed(2, (il, offset) => ({
				next: offset + 2,
				anchorKind: "variable",
				value: String(il.readUInt16LE(offset))
			}))],
			["short-i", fixed(1, (il, offset) => ({
				next: offset + 1,
				anchorKind: "constant",
				value: String(il.readInt8(offset))
			}))],
			["i", fixed(4, (il, offset) => ({
				next: offset + 4,
				anchorKind: "constant",
				value: String(il.readInt32LE(offset))
			}))],
			["i8", fixed(8, (il, offset) => ({
				next: offset + 8,
				anchorKind: "constant",
				value: il.readBigInt64LE(offset).toString()
			}))],
			["r4", fixed(4, (il, offset) => ({
				next: offset + 4,
				anchorKind: "constant",
				value: floatingPointOperand(il.readFloatLE(offset))
			}))],
			["r8", fixed(8, (il, offset) => ({
				next: offset + 8,
				anchorKind: "constant",
				value: floatingPointOperand(il.readDoubleLE(offset))
			}))],
			["short-branch", fixed(1, (il, offset) => ({
				next: offset + 1,
				anchorKind: "branch",
				value: String(offset + 1 + il.readInt8(offset))
			}))],
			["branch", fixed(4, (il, offset) => ({
				next: offset + 4,
				anchorKind: "branch",
				value: String(offset + 4 + il.readInt32LE(offset))
			}))]
		]);
		TOKEN_OPERAND_KINDS = new Map([
			["method", "method"],
			["field", "field"],
			["type", "type"],
			["string", "string"],
			["signature", "signature"]
		]);
		TOKEN_OPERAND_WIDTH = 4;
		operandExtent = (il, offset, kind) => {
			const fixedOperand = FIXED_OPERAND_READERS.get(kind);
			if (fixedOperand !== undefined) return fixedOperand.width;
			if (kind === "switch") {
				if (offset > il.length - 4) return null;
				return 4 + il.readUInt32LE(offset) * 4;
			}
			return TOKEN_OPERAND_KINDS.has(kind) || kind === "token" ? TOKEN_OPERAND_WIDTH : 0;
		};
		readOperand = (il, offset, kind) => {
			const fixedOperand = FIXED_OPERAND_READERS.get(kind);
			if (fixedOperand !== undefined) return fixedOperand.read(il, offset);
			if (kind === "switch") {
				const count = il.readUInt32LE(offset);
				return {
					next: offset + 4 + count * 4,
					anchorKind: "switch",
					value: String(count)
				};
			}
			if (!TOKEN_OPERAND_KINDS.has(kind) && kind !== "token") return {
				next: offset,
				anchorKind: "unknown",
				value: null
			};
			const raw = il.readUInt32LE(offset);
			const token = `0x${raw.toString(16).padStart(8, "0")}`;
			return {
				next: offset + TOKEN_OPERAND_WIDTH,
				anchorKind: TOKEN_OPERAND_KINDS.get(kind) ?? tokenKind(token),
				value: token
			};
		};
		decodeInstructions = (il, admitInstruction) => {
			const parsed = [];
			const instructionStarts = [];
			let offset = 0;
			let prefixStart = null;
			let issue = null;
			try {
				while (offset < il.length) {
					const start = offset;
					const first = il.readUInt8(offset);
					offset += 1;
					if (first === 254 && offset >= il.length) {
						issue = `Two-byte CIL opcode at IL offset ${String(start)} leaves method body`;
						break;
					}
					const code = first === 254 ? 65024 + il.readUInt8(offset++) : first;
					const descriptor = OPCODES.get(code);
					if (descriptor === undefined) {
						issue = `Unsupported CIL opcode 0x${code.toString(16)} at IL offset ${String(start)}`;
						break;
					}
					const extent = operandExtent(il, offset, descriptor.operand);
					if (extent === null || offset + extent > il.length) {
						issue = `Instruction ${descriptor.name} at IL offset ${String(start)} leaves method body`;
						break;
					}
					const operand = readOperand(il, offset, descriptor.operand);
					admitInstruction?.(start);
					offset = operand.next;
					if (PREFIX_OPCODES.has(descriptor.name)) {
						prefixStart ??= start;
					} else {
						instructionStarts.push(prefixStart ?? start);
						prefixStart = null;
					}
					parsed.push({
						offset: start,
						opcode: descriptor.name,
						operandKind: operand.anchorKind,
						operand: operand.value
					});
				}
			} catch (cause) {
				if (cause instanceof ManagedReaderFailure) throw cause;
				issue = cause instanceof Error ? cause.message : "Instruction decode failed";
			}
			const truncated = offset < il.length && issue === null ? 1 : 0;
			return {
				parsed,
				instructionStarts,
				count: parsed.length,
				truncated,
				issue
			};
		};
		parseExceptionRegions = (bytes, offset, methodEnd, budget) => {
			const regions = [];
			let sectionOffset = offset;
			let hasMoreSections = true;
			while (hasMoreSections) {
				if (!Number.isSafeInteger(sectionOffset) || sectionOffset < 0 || sectionOffset > methodEnd - 4 || sectionOffset > bytes.length - 4) return malformedExceptionRegions("Exception section header leaves artifact", regions);
				const kind = bytes.readUInt8(sectionOffset);
				if ((kind & 63) !== 1) return malformedExceptionRegions(`Unsupported method data section kind ${String(kind & 63)}`, regions);
				const fat = (kind & 64) !== 0;
				const size = fat ? bytes.readUInt8(sectionOffset + 1) | bytes.readUInt8(sectionOffset + 2) << 8 | bytes.readUInt8(sectionOffset + 3) << 16 : bytes.readUInt8(sectionOffset + 1);
				const clauseSize = fat ? 24 : 12;
				if (size < 4 || sectionOffset > methodEnd - size || sectionOffset > bytes.length - size) return malformedExceptionRegions("Exception section size leaves artifact", regions);
				let count;
				let sectionSize = size;
				if (fat) {
					if ((size - 4) % clauseSize !== 0) return malformedExceptionRegions("Exception section size does not contain whole clauses", regions);
					count = (size - 4) / clauseSize;
				} else if ((size - 4) % clauseSize === 0) {
					count = (size - 4) / clauseSize;
				} else if (size >= clauseSize && size % clauseSize === 0) {
					count = size / clauseSize;
					sectionSize = 4 + count * clauseSize;
				} else {
					return malformedExceptionRegions("Exception section size does not contain whole clauses", regions);
				}
				if (sectionOffset > methodEnd - sectionSize || sectionOffset > bytes.length - sectionSize) return malformedExceptionRegions("Exception section size leaves artifact", regions);
				if (!fat && (bytes[sectionOffset + 2] !== 0 || bytes[sectionOffset + 3] !== 0)) return malformedExceptionRegions("Small exception section reserved bytes are nonzero", regions);
				budget?.admitTransient(count * 256, sectionOffset);
				for (const region of readExceptionClauses(bytes, sectionOffset + 4, count, fat)) regions.push(region);
				hasMoreSections = (kind & 128) !== 0;
				sectionOffset += sectionSize;
			}
			return {
				status: "complete",
				regions
			};
		};
		malformedExceptionRegions = (issue, regions = []) => ({
			status: "malformed",
			regions,
			issue
		});
		readExceptionClauses = (bytes, start, count, fat) => {
			const regions = [];
			const clauseSize = fat ? 24 : 12;
			for (let index = 0; index < count; index += 1) {
				const clause = start + index * clauseSize;
				const flags = fat ? bytes.readUInt32LE(clause) : bytes.readUInt16LE(clause);
				const extra = bytes.readUInt32LE(clause + (fat ? 20 : 8));
				regions.push({
					flags,
					try_offset: fat ? bytes.readUInt32LE(clause + 4) : bytes.readUInt16LE(clause + 2),
					try_length: fat ? bytes.readUInt32LE(clause + 8) : bytes.readUInt8(clause + 4),
					handler_offset: fat ? bytes.readUInt32LE(clause + 12) : bytes.readUInt16LE(clause + 5),
					handler_length: fat ? bytes.readUInt32LE(clause + 16) : bytes.readUInt8(clause + 7),
					class_token: flags === 0 ? `0x${extra.toString(16).padStart(8, "0")}` : null,
					filter_offset: flags === 1 ? extra : null
				});
			}
			return regions;
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedExceptionRegionValidation.js
var clauseFlagsIssue, methodExtentIssue, instructionBoundaryIssue, filterOrderingIssue, clauseIssue, validateExceptionRegionRanges;
function init_ManagedExceptionRegionValidation() {
	return (init_ManagedExceptionRegionValidation = __esmMin((() => {
		clauseFlagsIssue = (region) => [
			0,
			1,
			2,
			4
		].includes(region.flags) ? null : `Exception clause has unsupported flags 0x${region.flags.toString(16)}`;
		methodExtentIssue = (start, length, ilSize, name) => start <= ilSize && length <= ilSize - start ? null : `Exception clause ${name} range leaves the method IL body`;
		instructionBoundaryIssue = (start, length, boundaries, name) => {
			const end = start + length;
			return boundaries.has(start) && boundaries.has(end) ? null : `Exception clause ${name} range does not align with CIL instruction boundaries`;
		};
		filterOrderingIssue = (region, ilSize) => {
			if (region.flags !== 1) return null;
			const offset = region.filter_offset;
			return offset !== null && offset < ilSize && offset < region.handler_offset ? null : "Exception clause filter must start before its handler within the method IL body";
		};
		clauseIssue = (region, ilSize, boundaries) => clauseFlagsIssue(region) ?? methodExtentIssue(region.try_offset, region.try_length, ilSize, "try") ?? instructionBoundaryIssue(region.try_offset, region.try_length, boundaries, "try") ?? methodExtentIssue(region.handler_offset, region.handler_length, ilSize, "handler") ?? instructionBoundaryIssue(region.handler_offset, region.handler_length, boundaries, "handler") ?? (region.flags === 1 && region.filter_offset !== null ? instructionBoundaryIssue(region.filter_offset, 0, boundaries, "filter") : null) ?? filterOrderingIssue(region, ilSize);
		validateExceptionRegionRanges = (parsed, ilSize, instructionOffsets) => {
			if (parsed.status === "malformed") return parsed;
			const boundaries = new Set([...instructionOffsets, ilSize]);
			for (const region of parsed.regions) {
				const issue = clauseIssue(region, ilSize, boundaries);
				if (issue !== null) return {
					status: "malformed",
					regions: parsed.regions,
					issue
				};
			}
			return parsed;
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMethodBodyReader.js
var bodyStatus, readMethodBodyHeader, methodBody, emptyMethodBody;
function init_ManagedMethodBodyReader() {
	return (init_ManagedMethodBodyReader = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMemberInstructionDecoder();
		init_ManagedExceptionRegionValidation();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		bodyStatus = (decodedIssue, truncatedInstructions, exceptionRegions) => {
			if (decodedIssue !== null || exceptionRegions?.status === "malformed") return "malformed";
			if (truncatedInstructions > 0) return "partial";
			return "present";
		};
		readMethodBodyHeader = (bytes, offset) => {
			const first = bytes.readUInt8(offset);
			if ((first & 3) === 2) return {
				format: "tiny",
				size: 1,
				flags: 0,
				maxStack: 8,
				ilSize: first >> 2,
				localSig: 0
			};
			if ((first & 3) !== 3) throw new RangeError("Unsupported method body header");
			if (offset > bytes.length - 12) throw new RangeError("Fat method body header leaves artifact");
			const flagsAndSize = bytes.readUInt16LE(offset);
			const headerDwords = flagsAndSize >>> 12;
			if (headerDwords < 3) throw new RangeError("Fat method body header is smaller than 12 bytes");
			const size = headerDwords * 4;
			if (offset > bytes.length - size) throw new RangeError("Method body header leaves artifact");
			return {
				format: "fat",
				size,
				flags: flagsAndSize & 4095,
				maxStack: bytes.readUInt16LE(offset + 2),
				ilSize: bytes.readUInt32LE(offset + 4),
				localSig: bytes.readUInt32LE(offset + 8)
			};
		};
		methodBody = (bytes, pe, rva, implementation = {
			implFlags: 0,
			flags: 0
		}, budget) => {
			if (rva === 0) return {
				body: emptyMethodBody(rva, "absent", null),
				scanned: true
			};
			const native = (implementation.implFlags & 7) !== 0 || (implementation.flags & 8192) !== 0;
			if (native) {
				const issue = "CIL decoding is unavailable for native, runtime, unmanaged, or P/Invoke implementations";
				return {
					body: emptyMethodBody(rva, "partial", issue),
					scanned: true
				};
			}
			try {
				const offset = pe.rvaToOffset(rva, 1, "method.body");
				const methodExtent = pe.rvaAvailableBytes(rva, "method.body");
				const header = readMethodBodyHeader(bytes, offset);
				if (header.size > methodExtent || header.ilSize > methodExtent - header.size) throw new RangeError("Method body leaves file-backed PE section data");
				const ilOffset = offset + header.size;
				if (ilOffset > bytes.length - header.ilSize) throw new RangeError("Method IL bytes leave artifact");
				const il = bytes.subarray(ilOffset, ilOffset + header.ilSize);
				const decoded = decodeInstructions(il, budget === undefined ? undefined : (start) => budget.admitTransient(256, ilOffset + start));
				const opcodeCounts = {};
				for (const instruction of decoded.parsed) opcodeCounts[instruction.opcode] = (opcodeCounts[instruction.opcode] ?? 0) + 1;
				const anchors = decoded.parsed.filter((instruction) => instruction.operandKind !== "none").map((instruction) => ({
					il_offset: instruction.offset,
					opcode: instruction.opcode,
					operand_kind: instruction.operandKind,
					operand: instruction.operand
				}));
				const normalized = Buffer.from(JSON.stringify(decoded.parsed.map(({ opcode, operandKind, operand }) => [
					opcode,
					operandKind,
					operand
				])), "utf8");
				const methodEnd = ilOffset + header.ilSize;
				const sectionOffset = Math.ceil(methodEnd / 4) * 4;
				const exceptionRegions = header.format === "fat" && (header.flags & 8) !== 0 ? validateExceptionRegionRanges(parseExceptionRegions(bytes, sectionOffset, offset + methodExtent, budget), header.ilSize, decoded.instructionStarts) : null;
				const status = bodyStatus(decoded.issue, decoded.truncated, exceptionRegions);
				const body = {
					status,
					header_format: header.format,
					rva,
					file_offset: offset,
					max_stack: header.maxStack,
					init_locals: (header.flags & 16) !== 0,
					local_var_sig_token: header.localSig === 0 ? null : `0x${header.localSig.toString(16).padStart(8, "0")}`,
					il_size: header.ilSize,
					il_sha256: sha256Bytes(il),
					normalized_il_sha256: status === "present" ? sha256Bytes(normalized) : null,
					instruction_count: decoded.count,
					decoded_instruction_count: decoded.parsed.length,
					truncated_instructions: decoded.truncated,
					opcode_counts: opcodeCounts,
					anchors,
					exception_regions: exceptionRegions?.regions ?? [],
					issue: decoded.issue ?? (exceptionRegions?.status === "malformed" ? exceptionRegions.issue : null) ?? (decoded.truncated > 0 ? "Instruction decoding stopped before the end of the method body" : null)
				};
				return {
					body: budget === undefined ? body : admitManagedProjection(body, budget),
					scanned: decoded.issue === null && decoded.truncated === 0
				};
			} catch (cause) {
				if (cause instanceof ManagedReaderFailure && cause.issue.code === "resource-limit") throw cause;
				if (!(cause instanceof ManagedReaderFailure) && !(cause instanceof RangeError)) throw cause;
				return {
					body: emptyMethodBody(rva, "malformed", cause instanceof Error ? cause.message : "Method body parse failed"),
					scanned: false
				};
			} finally {
				budget?.releaseTransient();
			}
		};
		emptyMethodBody = (rva, status, issue) => ({
			status,
			header_format: status === "absent" ? "none" : "unknown",
			rva,
			file_offset: null,
			max_stack: null,
			init_locals: null,
			local_var_sig_token: null,
			il_size: 0,
			il_sha256: null,
			normalized_il_sha256: null,
			instruction_count: 0,
			decoded_instruction_count: 0,
			truncated_instructions: 0,
			opcode_counts: {},
			anchors: [],
			exception_regions: [],
			issue
		});
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMemberRows.js
var isSelected, parseFields, TYPE_FORWARDER_FLAG, parseExportedTypes, parseMemberRefs, parseMethods, NAMEABLE_KINDS, targetKind, namedTarget, edges, callerName, callerNameBytes, budgetedSignature;
function init_ManagedMemberRows() {
	return (init_ManagedMemberRows = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_ManagedMemberInspectorCore();
		init_ManagedMetadataHeaps();
		init_ManagedReaderFailure();
		init_ManagedMethodBodyReader();
		init_ManagedMemberOwnership();
		isSelected = (selected, declared) => selected === null || declared !== undefined && selected.has(declared.token);
		parseFields = (bytes, layout, ranges, memberLists, selected = null) => {
			const fields = [];
			const core = new Map();
			const issues = [];
			const table = layout.table(4);
			const ownerRow = readManagedValue(() => memberDeclaringTypeRowLookup(bytes, layout, 4, memberLists), issues);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 4, row);
					const flags = cursor.readUInt16();
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const owner = ownerRow === undefined ? 0 : readManagedValue(() => ownerRow(row), issues) ?? 0;
					const declared = ranges[owner - 1];
					const token = metadataToken(4, row);
					core.set(token, {
						token,
						name,
						declaringType: declared?.fullName ?? null,
						kind: "field"
					});
					if (!isSelected(selected, declared)) return;
					const sig = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), layout.blob.size);
					fields.push({
						token,
						row_offset: cursor.start,
						declaring_type_token: declared?.token ?? null,
						declaring_type: declared?.fullName ?? null,
						name,
						flags,
						signature: budgetedSignature(sig, layout)
					});
				}, issues);
			}
			return {
				fields,
				core,
				issues
			};
		};
		TYPE_FORWARDER_FLAG = 2097152;
		parseExportedTypes = (bytes, layout) => {
			const exportedTypes = [];
			const issues = [];
			const table = layout.table(39);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 39, row);
					const flags = cursor.readUInt32();
					const typeDefId = cursor.readUInt32();
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const namespace = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const implementationOffset = cursor.offset;
					const implementationRaw = cursor.readIndex(layout.codedIndexSize("Implementation"));
					const token = metadataToken(39, row);
					const implementationReason = metadataCodedTokenInvalidReason(implementationRaw, 2, [
						38,
						35,
						39
					], layout.rowCounts);
					if (implementationReason !== null || implementationRaw === 0) issues.push({
						code: "invalid-row",
						scope: `metadata.ExportedType:${token}`,
						offset: implementationOffset,
						detail: implementationReason === null ? "ExportedType implementation coded index 0x0 is null, but the Implementation column must reference a row" : `ExportedType implementation coded index 0x${implementationRaw.toString(16)} is invalid: ${implementationReason}`
					});
					exportedTypes.push({
						token,
						row_offset: cursor.start,
						namespace,
						name,
						flags,
						forwarder: (flags & TYPE_FORWARDER_FLAG) !== 0,
						type_def_id: typeDefId,
						implementation_token: metadataCodedToken(implementationRaw, 2, [
							38,
							35,
							39
						], layout.rowCounts)
					});
				}, issues);
			}
			return {
				exportedTypes,
				issues
			};
		};
		parseMemberRefs = (bytes, layout, typeName) => {
			const refs = [];
			const core = new Map();
			const issues = [];
			const table = layout.table(10);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 10, row);
					const parentRaw = cursor.readIndex(layout.codedIndexSize("MemberRefParent"));
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const sig = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), layout.blob.size);
					const token = metadataToken(10, row);
					const parentReason = metadataCodedTokenInvalidReason(parentRaw, 3, [
						2,
						1,
						26,
						6,
						27
					], layout.rowCounts);
					if (parentReason !== null || parentRaw === 0) issues.push({
						code: "invalid-row",
						scope: `metadata.MemberRef:${token}`,
						offset: cursor.start,
						detail: parentReason === null ? "MemberRef parent coded index 0x0 is null, but the Class column must reference a row" : `MemberRef parent coded index 0x${parentRaw.toString(16)} is invalid: ${parentReason}`
					});
					const parentToken = metadataCodedToken(parentRaw, 3, [
						2,
						1,
						26,
						6,
						27
					], layout.rowCounts);
					const parentName = typeName(parentToken);
					const decoded = budgetedSignature(sig, layout);
					refs.push({
						token,
						row_offset: cursor.start,
						parent_token: parentToken,
						parent_name: parentName,
						name,
						signature: decoded
					});
					core.set(token, {
						token,
						name,
						declaringType: parentName,
						kind: decoded.kind,
						genericArity: signatureGenericArity(decoded)
					});
				}, issues);
			}
			return {
				refs,
				core,
				issues
			};
		};
		parseMethods = ({ bytes, layout, pe, ranges, memberLists, selected = null, methodOffset = 0, methodLimit = Number.MAX_SAFE_INTEGER }) => {
			const methods = [];
			const core = new Map();
			const issues = [];
			let unscannedMethods = 0;
			const table = layout.table(6);
			const ownerRow = readManagedValue(() => memberDeclaringTypeRowLookup(bytes, layout, 6, memberLists), issues);
			for (let row = 1; row <= (table?.rowCount ?? 0); row += 1) {
				const owner = ownerRow === undefined ? undefined : readManagedValue(() => ownerRow(row), issues);
				const declared = owner === undefined ? undefined : ranges[owner - 1];
				const inPage = row > methodOffset && row - methodOffset <= methodLimit;
				const mayBeSelected = inPage && (selected === null || owner === undefined || isSelected(selected, declared) || declared?.fullName === null);
				const produced = methods.length;
				readManagedValue(() => {
					const cursor = metadataRowCursor(bytes, layout, 6, row);
					const rva = cursor.readUInt32();
					const implFlags = cursor.readUInt16();
					const flags = cursor.readUInt16();
					const name = readMetadataString(bytes, layout, cursor.readIndex(layout.stringIndexSize), layout.strings.size);
					const token = metadataToken(6, row);
					const member = {
						token,
						name,
						declaringType: declared?.fullName ?? null,
						kind: "method"
					};
					core.set(token, member);
					if (!inPage) return;
					if (!isSelected(selected, declared)) return;
					const sig = readMetadataBlob(bytes, layout, cursor.readIndex(layout.blobIndexSize), layout.blob.size);
					cursor.readIndex(layout.tableIndexSize(8));
					const decoded = budgetedSignature(sig, layout);
					core.set(token, {
						...member,
						genericArity: signatureGenericArity(decoded)
					});
					const read = methodBody(bytes, pe, rva, {
						implFlags,
						flags
					}, managedDecodeBudget(layout));
					if (!read.scanned) unscannedMethods += 1;
					methods.push({
						token,
						row_offset: cursor.start,
						declaring_type_token: declared?.token ?? null,
						declaring_type: declared?.fullName ?? null,
						name,
						rva,
						impl_flags: implFlags,
						flags,
						signature: decoded,
						body: read.body
					});
				}, issues);
				if (mayBeSelected && methods.length === produced) unscannedMethods += 1;
			}
			return {
				methods,
				core,
				issues,
				unscannedMethods
			};
		};
		NAMEABLE_KINDS = new Map([["method", new Set(["method", "unknown"])], ["field", new Set(["field"])]]);
		targetKind = (token) => token.startsWith("0x06") ? "method-def" : token.startsWith("0x0a") ? "member-ref" : token.startsWith("0x2b") ? "method-spec" : "unknown";
		namedTarget = (members, operandKind, operand) => {
			const member = members.get(operand);
			return member !== undefined && NAMEABLE_KINDS.get(operandKind)?.has(member.kind) === true ? member : undefined;
		};
		edges = (methods, members, budget) => {
			const callEdges = [];
			const fieldAccesses = [];
			for (const method of methods) {
				const derives = method.body.anchors.some((anchor) => anchor.opcode !== "ldtoken" && anchor.operand !== null && (anchor.operand_kind === "method" || anchor.operand_kind === "field"));
				if (derives) budget.admitTransient(callerNameBytes(method), null);
				const caller = derives ? callerName(method) : method.name;
				for (const anchor of method.body.anchors) {
					if (anchor.opcode === "ldtoken") continue;
					const { operand } = anchor;
					if (operand === null) continue;
					const target = namedTarget(members, anchor.operand_kind, operand);
					if (anchor.operand_kind === "method") {
						callEdges.push(admitManagedProjection({
							caller_token: method.token,
							caller,
							opcode: anchor.opcode,
							target_token: operand,
							target_kind: targetKind(operand),
							target_name: target?.name ?? null,
							target_declaring_type: target?.declaringType ?? null
						}, budget));
					}
					if (anchor.operand_kind === "field") {
						fieldAccesses.push(admitManagedProjection({
							method_token: method.token,
							method: caller,
							opcode: anchor.opcode,
							field_token: operand,
							field_name: target?.name ?? null,
							field_declaring_type: target?.declaringType ?? null
						}, budget));
					}
				}
				if (derives) budget.releaseTransient();
			}
			return {
				callEdges,
				fieldAccesses
			};
		};
		callerName = (method) => method.declaring_type === null ? method.name : `${method.declaring_type}.${method.name}`;
		callerNameBytes = (method) => method.declaring_type === null ? managedJsonStringBytes(method.name) : managedJsonStringBytes(method.declaring_type) + managedJsonStringBytes(method.name) - 1;
		budgetedSignature = (bytes, layout) => {
			const budget = managedDecodeBudget(layout);
			budget.admitTransient(bytes.length * 256, layout.blob.offset);
			try {
				return admitManagedProjection(signature(bytes, budget.digest(bytes, "sha256")), budget);
			} finally {
				budget.releaseTransient();
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedMemberInspector.js
var unavailable, readMemberInventory, selectTypes, inspectManagedMembersBytes;
function init_ManagedMemberInspector() {
	return (init_ManagedMemberInspector = __esmMin((() => {
		init_ManagedDecodeBudget();
		init_managedArtifact();
		init_ManagedPeReader();
		init_ManagedMetadataInventory();
		init_ManagedMetadataLayout();
		init_ManagedReaderFailure();
		init_ManagedMemberInspectorCore();
		init_ManagedMethodSpecs();
		init_ManagedTypeNames();
		init_ManagedUserStrings();
		init_ManagedTypeMemberLists();
		init_ManagedMemberRows();
		unavailable = (target, bytes, issue, typeNames) => managedMemberInspectionSchema.parse(admitManagedProjection({
			artifact: {
				path: target.path,
				sha256: target.sha256,
				byte_length: bytes.length,
				format: "pe"
			},
			module: null,
			metadata: {
				status: issue === null ? "absent" : issue.code === "resource-limit" ? "partial" : "malformed",
				version: null,
				table_row_counts: {}
			},
			identity_scope: {
				token_identity: "build-local",
				requires_artifact_sha256: target.sha256,
				requires_mvid: null
			},
			types: [],
			exported_types: null,
			user_strings: null,
			fields: [],
			methods: [],
			member_refs: [],
			call_edges: [],
			field_accesses: [],
			selection: typeNames === undefined ? null : {
				type_names: [...typeNames],
				unmatched_type_names: []
			},
			coverage: {
				state: "unavailable",
				issues: issue === null ? [] : [issue]
			},
			limitations: [issue === null ? "The PE has no admitted CLI metadata; managed member inspection is unavailable." : "The CLI metadata could not be admitted; managed member inspection is unavailable."]
		}));
		readMemberInventory = (bytes, pe, issues) => {
			const cli = pe.cli;
			if (cli === null) throw new TypeError("Managed inventory requires CLI metadata");
			const rootOffset = pe.rvaToOffset(cli.metadata.rva, cli.metadata.size, "cli.metadata");
			const layout = readManagedMetadataLayout(bytes, rootOffset, cli.metadata.size);
			const memberLists = readTypeMemberListFacts(bytes, layout);
			const inventory = readManagedMetadataInventory(bytes, layout, readManagedResourceDirectory(pe, issues), memberLists);
			return {
				layout,
				inventory,
				memberLists
			};
		};
		selectTypes = (ranges, typeNames) => {
			if (typeNames === undefined) return {
				tokens: null,
				selection: null,
				unreadableNames: 0
			};
			const requested = new Set(typeNames);
			const tokens = new Set();
			const matched = new Set();
			for (const range of ranges) {
				if (range.fullName === null || !requested.has(range.fullName)) continue;
				tokens.add(range.token);
				matched.add(range.fullName);
			}
			return {
				tokens,
				unreadableNames: ranges.filter(({ fullName }) => fullName === null).length,
				selection: {
					type_names: [...typeNames],
					unmatched_type_names: typeNames.filter((name) => !matched.has(name))
				}
			};
		};
		inspectManagedMembersBytes = (bytes, target, { typeNames, methodOffset = 0, methodLimit = Number.MAX_SAFE_INTEGER, userStrings: readUserStrings = true } = {}) => {
			if (!Number.isSafeInteger(methodOffset) || methodOffset < 0 || !Number.isSafeInteger(methodLimit) || methodLimit < 0) throw new RangeError("methodOffset and methodLimit must be non-negative safe integers");
			const pe = readManagedPeLayout(bytes);
			if (pe.cli === null) return unavailable(target, bytes, pe.cliIssue, typeNames);
			const issues = [];
			try {
				const { layout, inventory, memberLists } = readMemberInventory(bytes, pe, issues);
				appendManagedParseIssues(issues, inventory.issues);
				const ranges = typeRanges(bytes, layout, issues, memberLists);
				const { tokens: selected, selection, unreadableNames } = selectTypes(ranges, typeNames);
				const parsedTypes = parseTypes(bytes, layout, ranges);
				appendManagedParseIssues(issues, parsedTypes.issues);
				const exportedTypes = parseExportedTypes(bytes, layout);
				appendManagedParseIssues(issues, exportedTypes.issues);
				const fields = parseFields(bytes, layout, ranges, memberLists, selected);
				const memberRefs = parseMemberRefs(bytes, layout, typeNameLookup(bytes, layout, ranges, issues));
				appendManagedParseIssues(issues, memberRefs.issues);
				const methods = parseMethods({
					bytes,
					layout,
					pe,
					ranges,
					memberLists,
					selected,
					methodOffset,
					methodLimit
				});
				appendManagedParseIssues(issues, fields.issues, methods.issues);
				const userStrings = readUserStrings ? parseUserStrings(bytes, layout, {
					...methods,
					unreadableSelectedTypes: unreadableNames
				}) : null;
				const targets = edgeTargets(bytes, layout, methods.methods, [
					fields.core,
					memberRefs.core,
					methods.core
				]);
				appendManagedParseIssues(issues, targets.issues);
				const coverageIssues = uniqueManagedParseIssues(issues);
				const incompleteMembers = [
					...fields.fields,
					...memberRefs.refs,
					...methods.methods
				].some((member) => member.signature.parse_status !== "decoded") || methods.methods.some((method) => method.body.status === "partial" || method.body.status === "malformed");
				const related = edges(methods.methods, targets.members, managedDecodeBudget(layout));
				return managedMemberInspectionSchema.parse(admitManagedProjection({
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
					types: selected === null ? parsedTypes.types : parsedTypes.types.filter((type) => selected.has(type.token)),
					exported_types: exportedTypes.exportedTypes,
					fields: fields.fields,
					methods: methods.methods,
					member_refs: memberRefs.refs,
					call_edges: related.callEdges,
					field_accesses: related.fieldAccesses,
					user_strings: userStrings,
					selection,
					coverage: {
						state: issues.length === 0 && !incompleteMembers ? "complete" : "partial",
						issues: coverageIssues
					},
					limitations: [
						"Metadata tokens are build-local coordinates and are only meaningful with the reported artifact SHA-256 and MVID.",
						"CIL instruction anchors are decoded from file-backed method bodies only; no target assembly is loaded or executed.",
						"Exported types are reported from ExportedType rows as declared; forwarded types are not resolved in their implementing assemblies.",
						"User strings are the #US literals loaded by ldstr in the inspected method bodies, with their own coverage; instruction anchors and normalized CIL digests keep their build-local tokens.",
						"Member signatures decode ECMA-335 primitive, class, valuetype, generic instantiation, generic variable, pointer, byref, single-dimension and general array, function pointer, custom modifier, and typed reference forms; class and valuetype operands keep their encoded TypeDefOrRefOrSpec values, and unsupported forms such as vararg sentinels retain raw signature hashes.",
						...selection === null ? [] : ["Types, fields, methods, call edges, field accesses, and user strings cover only the selected declaring types; coverage describes that selection. Edge targets outside it keep their names but are not described."],
						...unreadableNames === 0 ? [] : [`${String(unreadableNames)} TypeDef name(s) could not be read; a name in selection.unmatched_type_names may belong to one of them, so its absence is not observed.`]
					]
				}, managedDecodeBudget(layout)));
			} catch (cause) {
				if (cause instanceof ManagedReaderFailure) return unavailable(target, bytes, cause.issue, typeNames);
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/dotnet/ManagedSnapshot.js
var MAX_MANAGED_SNAPSHOT_BYTES, managedSnapshotCapacityError, readManagedSnapshot, hashManagedSource, readManagedFile, normalizeManagedReadFailure, managedCleanupError, normalizeReadFailure;
function init_ManagedSnapshot() {
	return (init_ManagedSnapshot = __esmMin((() => {
		init_InvestigationProviders();
		init_BinaryTargetResolver();
		init_RegularFileRead();
		init_ArtifactReader();
		init_analysisErrorCleanup();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_evidenceErrors();
		init_providerCleanupError();
		init_RegularFile();
		init_BoundedFileBytes();
		MAX_MANAGED_SNAPSHOT_BYTES = 128 * 1024 * 1024;
		managedSnapshotCapacityError = (operation) => new AnalysisResourceConstraintError(operation, "memory", "Managed static inspection requires an eagerly retained PE snapshot within its input byte budget.", { max_snapshot_bytes: MAX_MANAGED_SNAPSHOT_BYTES });
		readManagedSnapshot = async (path, operation, options = {}) => {
			return readManagedFile(path, operation, async (handle, metadata) => {
				const signal = options.signal;
				if (metadata.size > 134217728) throw managedSnapshotCapacityError(operation);
				const bytes = await readBoundedFileBytes(handle, MAX_MANAGED_SNAPSHOT_BYTES, signal);
				if (bytes === undefined) throw managedSnapshotCapacityError(operation);
				signal?.throwIfAborted();
				return {
					byteLength: bytes.length,
					sha256: createHash("sha256").update(bytes).digest("hex"),
					bytes
				};
			}, options);
		};
		hashManagedSource = async (path, operation, options = {}) => readManagedFile(path, operation, async (handle, metadata) => {
			const signal = options.signal;
			if (metadata.size > 134217728) throw managedSnapshotCapacityError(operation);
			const digest = createHash("sha256");
			let byteLength = 0;
			const stream = handle.createReadStream({
				autoClose: false,
				...signal === undefined ? {} : { signal }
			});
			for await (const chunk of stream) {
				signal?.throwIfAborted();
				if (!Buffer.isBuffer(chunk)) throw new TypeError("Managed source stream returned non-buffer data");
				if (chunk.length > 134217728 - byteLength) throw managedSnapshotCapacityError(operation);
				byteLength += chunk.length;
				digest.update(chunk);
			}
			return {
				byteLength,
				sha256: digest.digest("hex")
			};
		}, options);
		readManagedFile = (path, operation, read, options) => withRegularFile(path, read, options).catch((cause) => {
			throw normalizeManagedReadFailure(cause, path, operation, options.signal);
		});
		normalizeManagedReadFailure = (cause, fallbackPath, operation, signal) => {
			const cleanupError = managedCleanupError(cause, fallbackPath, operation, signal);
			if (cleanupError !== undefined) return cleanupError;
			return normalizeReadFailure(cause, fallbackPath, operation, signal);
		};
		managedCleanupError = (cause, fallbackPath, operation, signal) => {
			if (cause instanceof RegularFileCleanupFailure) {
				const cleanup = new ProviderCleanupError(MANAGED_STATIC_PROVIDER.id, [cause.path], { reason: "A managed input file handle could not be closed" }, {
					cause,
					operation
				});
				const failure = cause.outcome.kind === "failed" ? normalizeReadFailure(cause.outcome.cause, cause.path, operation, signal) : undefined;
				return failure instanceof AnalysisError ? analysisErrorWithCleanupFailure(failure, cleanup, operation) : cleanup;
			}
			if (cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined) return new ProviderCleanupError(MANAGED_STATIC_PROVIDER.id, cause.cleanup.resources.length > 0 ? cause.cleanup.resources : [fallbackPath], { reason: cause.cleanup.reason }, {
				cause,
				operation
			});
			return undefined;
		};
		normalizeReadFailure = (cause, path, operation, signal) => cause instanceof RegularFileChangedError ? new EvidenceIntegrityError(`Managed source changed while ${operation} was reading ${path}.`, { cause }) : cause instanceof AnalysisError ? cause : classifyBinaryTargetFilesystemFailure(path, cause) ?? (signal?.aborted === true ? new AnalysisCancelledError(operation, { cause }) : cause);
	})))();
}

//#endregion
export { ManagedReaderFailure, admitManagedProjection, hashManagedSource, init_ManagedDecodeBudget, init_ManagedMemberInspector, init_ManagedMetadataHeaps, init_ManagedMetadataInventory, init_ManagedMetadataLayout, init_ManagedPeReader, init_ManagedReaderFailure, init_ManagedSnapshot, init_ManagedTypeMemberLists, inspectManagedMembersBytes, managedCleanupError, managedCli32BitRequirement, managedDecodeBudget, managedTableRowCounts, metadataCodedToken, metadataCodedTokenInvalidReason, metadataRowCursor, metadataToken, readManagedMetadataInventory, readManagedMetadataLayout, readManagedPeLayout, readManagedResourceDirectory, readManagedSnapshot, readManagedValue, readMetadataString, readTypeMemberListFacts };