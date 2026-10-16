import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { compareUnicodeCodePoints, init_artifactIdentity, init_machoCpuIdentity, init_unicodeCodePointOrder, logicalPathNfc, machoCpuSubtypeBase } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ArtifactReaderFailure, init_ArtifactReader } from "./ArtifactReader-BXkffc1D.js";
import { classifyFatContainerIdentity, init_machoContainer, readFatContainerHeader, validateFatSliceIdentity } from "./machoContainer-C8BIkkq3.js";
import { posix } from "node:path";

//#region dist/filesystem/OwnedDirectoryHandle.js
var OwnedDirectoryHandle;
function init_OwnedDirectoryHandle() {
	return (init_OwnedDirectoryHandle = __esmMin((() => {
		OwnedDirectoryHandle = class {
			handle;
			#state = { kind: "open" };
			constructor(handle) {
				this.handle = handle;
			}
			close() {
				if (this.#state.kind === "closed") return Promise.resolve();
				if (this.#state.kind === "closing") return this.#state.attempt;
				if (this.#state.kind === "failed") return Promise.reject(this.#state.cause);
				const attempt = Promise.resolve().then(async () => {
					try {
						await this.handle.close();
						this.#state = { kind: "closed" };
					} catch (cause) {
						this.#state = {
							kind: "failed",
							cause
						};
						throw cause;
					}
				});
				this.#state = {
					kind: "closing",
					attempt
				};
				return attempt;
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/StreamBytes.js
var streamChunkToBuffer;
function init_StreamBytes() {
	return (init_StreamBytes = __esmMin((() => {
		streamChunkToBuffer = (value) => {
			if (Buffer.isBuffer(value)) return value;
			if (value instanceof Uint8Array) return Buffer.from(value);
			if (typeof value === "string") return Buffer.from(value);
			throw new TypeError("Readable stream emitted a non-byte chunk");
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactPaths.js
var DRIVE_PREFIX, ENGLISH_UNICODE_CASE_NOTE, ENGLISH_UNICODE_CASE_INVENTORY_LIMITATION, DESTINATION_CASE_COLLISION_PREFIX, normalizeArtifactPath, ArtifactPathRegistry, emptyCaseNode, englishCaseFold, annotateEnglishUnicodeCaseCollisions, caseCollisionLimitation, destinationCaseCollisionMessage, englishUnicodeCaseCollisions, collisionsAlong;
function init_ArtifactPaths() {
	return (init_ArtifactPaths = __esmMin((() => {
		init_artifactIdentity();
		init_unicodeCodePointOrder();
		init_ArtifactReader();
		DRIVE_PREFIX = /^[A-Za-z]:/u;
		ENGLISH_UNICODE_CASE_NOTE = "This comparison is not a filesystem observation.";
		ENGLISH_UNICODE_CASE_INVENTORY_LIMITATION = `Logical archive names collide under English (en-US) Unicode case folding; a case-insensitive destination cannot store both spellings. ${ENGLISH_UNICODE_CASE_NOTE}`;
		DESTINATION_CASE_COLLISION_PREFIX = "Destination filesystem cannot store both ";
		normalizeArtifactPath = (input) => {
			if (input.includes("\0") || input.startsWith("/") || DRIVE_PREFIX.test(input)) throw new ArtifactReaderFailure("path", `Artifact path is absolute or unsafe: ${JSON.stringify(input)}`);
			const normalized = logicalPathNfc(input).replace(/\/+$/u, "");
			const parts = normalized.split("/");
			if (normalized.length === 0 || parts.some((part) => part === "" || part === "." || part === "..") || posix.normalize(normalized) !== normalized) throw new ArtifactReaderFailure("path", `Artifact path is not normalized: ${JSON.stringify(input)}`);
			return normalized;
		};
		ArtifactPathRegistry = class {
			#root = {
				kind: undefined,
				children: new Map()
			};
			add(path, kind) {
				const parts = path.split("/");
				let node = this.#root;
				for (const [index, part] of parts.entries()) {
					if (node.kind !== undefined && node.kind !== "directory") throw new ArtifactReaderFailure("path", `Artifact prefix conflict: ${path}`);
					let child = node.children.get(part);
					if (child === undefined) {
						child = {
							kind: undefined,
							children: new Map()
						};
						node.children.set(part, child);
					}
					node = child;
					if (index === parts.length - 1) {
						if (node.kind !== undefined && node.kind !== kind) throw new ArtifactReaderFailure("path", `Artifact path collision: ${path}`);
						if (kind !== "directory" && node.children.size > 0) throw new ArtifactReaderFailure("path", `Artifact prefix conflict: ${path}`);
					}
				}
				node.kind = kind;
			}
		};
		emptyCaseNode = () => ({
			bySpelling: new Map(),
			spellingsByFold: new Map(),
			terminals: []
		});
		englishCaseFold = (part) => part.toLocaleLowerCase("en-US");
		annotateEnglishUnicodeCaseCollisions = (occurrences) => {
			const collisions = englishUnicodeCaseCollisions(occurrences.map(({ logical_path }) => logical_path));
			if (collisions.size === 0) return undefined;
			for (const occurrence of occurrences) for (const collision of collisions.get(occurrence.logical_path) ?? []) occurrence.limitations.push(caseCollisionLimitation(occurrence.logical_path, collision));
			return ENGLISH_UNICODE_CASE_INVENTORY_LIMITATION;
		};
		caseCollisionLimitation = (path, { prefix, other, additional }) => {
			const others = additional === 0 ? other : `${other} and ${String(additional)} other spelling${additional === 1 ? "" : "s"}`;
			const subject = prefix === path ? `Logical path ${path} collides` : `Logical path ${path} is under ${prefix}, which collides`;
			return `${subject} under English (en-US) Unicode case folding with ${others}; a case-insensitive destination cannot store both. ${ENGLISH_UNICODE_CASE_NOTE}`;
		};
		destinationCaseCollisionMessage = (requestedPath, existingNames) => {
			const slash = requestedPath.lastIndexOf("/");
			const segment = slash < 0 ? requestedPath : requestedPath.slice(slash + 1);
			if (existingNames.includes(segment)) return undefined;
			const folded = englishCaseFold(segment);
			const existing = existingNames.filter((name) => englishCaseFold(name) === folded).sort(compareUnicodeCodePoints)[0];
			if (existing === undefined) return undefined;
			const parent = slash < 0 ? "" : requestedPath.slice(0, slash + 1);
			return `${DESTINATION_CASE_COLLISION_PREFIX}${requestedPath} and ${parent}${existing}; inventory retains both logical names.`;
		};
		englishUnicodeCaseCollisions = (paths) => {
			const root = emptyCaseNode();
			for (const path of paths) {
				if (path.length === 0 || path === ".") continue;
				let node = root;
				for (const part of path.split("/")) {
					let child = node.bySpelling.get(part);
					if (child === undefined) {
						const folded = englishCaseFold(part);
						const spellings = node.spellingsByFold.get(folded);
						if (spellings === undefined) node.spellingsByFold.set(folded, [part]);
						else spellings.push(part);
						child = emptyCaseNode();
						node.bySpelling.set(part, child);
					}
					node = child;
				}
				node.terminals.push(path);
			}
			const collisions = new Map();
			const pending = [{
				node: root,
				prefix: undefined,
				chain: undefined
			}];
			for (let item = pending.pop(); item !== undefined; item = pending.pop()) {
				const { node, prefix, chain } = item;
				if (chain !== undefined) for (const path of node.terminals) collisions.set(path, collisionsAlong(chain));
				for (const spellings of node.spellingsByFold.values()) spellings.sort(compareUnicodeCodePoints);
				for (const [spelling, child] of node.bySpelling) {
					const childPrefix = prefix === undefined ? spelling : `${prefix}/${spelling}`;
					const spellings = node.spellingsByFold.get(englishCaseFold(spelling)) ?? [];
					const other = spellings[0] === spelling ? spellings[1] : spellings[0];
					pending.push({
						node: child,
						prefix: childPrefix,
						chain: other === undefined ? chain : {
							collision: {
								prefix: childPrefix,
								other: prefix === undefined ? other : `${prefix}/${other}`,
								additional: spellings.length - 2
							},
							parent: chain
						}
					});
				}
			}
			return collisions;
		};
		collisionsAlong = (chain) => {
			const collisions = [];
			let link = chain;
			while (link !== undefined) {
				collisions.push(link.collision);
				link = link.parent;
			}
			return collisions.reverse();
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/MachoLoadCommandReader.js
var MAX_LOAD_COMMAND_BYTES, MH_MAGIC, MH_MAGIC_64, MH_CIGAM, MH_CIGAM_64, FAT_MAGIC, FAT_MAGIC_64, FAT_CIGAM, FAT_CIGAM_64, LC_ID_DYLIB, LC_LOAD_DYLIB, LC_LOAD_WEAK_DYLIB, LC_REEXPORT_DYLIB, LC_LAZY_LOAD_DYLIB, LC_LOAD_UPWARD_DYLIB, LC_RPATH, LC_DYLD_ENVIRONMENT, LC_CODE_SIGNATURE, LC_VERSION_MIN_MACOSX, LC_VERSION_MIN_IPHONEOS, LC_VERSION_MIN_TVOS, LC_VERSION_MIN_WATCHOS, LC_BUILD_VERSION, PLATFORM_MACOS, PLATFORM_IOS, PLATFORM_TVOS, PLATFORM_WATCHOS, PLATFORM_IOSSIMULATOR, PLATFORM_TVOSSIMULATOR, PLATFORM_WATCHOSSIMULATOR, CPU_TYPE_I386, CPU_TYPE_X86_64, legacyVersionMinPlatform, DYLIB_USE_MARKER, DYLIB_USE_WEAK_LINK, DYLIB_USE_REEXPORT, DYLIB_USE_UPWARD, DYLIB_USE_DELAYED_INIT, DEPENDENCY_COMMANDS, MachoFormatIssue, hasMachoMagic, readMachoImage, readFatSlices, readSlice, decodeCommands, decodeCommand, decodeDependency, commandString, readExact, CPU_ARCH_ABI64, CPU_ARCH_ABI64_32, CPU_TYPE_X86, CPU_TYPE_ARM, CPU_SUBTYPE_ARM64E, CPU_SUBTYPE_ARM64E_X1, CPU_SUBTYPE_X86_64_H, architectureName, fileTypeName, version, swap, viewOf;
function init_MachoLoadCommandReader() {
	return (init_MachoLoadCommandReader = __esmMin((() => {
		init_machoCpuIdentity();
		init_machoContainer();
		MAX_LOAD_COMMAND_BYTES = 16 * 1024 * 1024;
		MH_MAGIC = 4277009102;
		MH_MAGIC_64 = 4277009103;
		MH_CIGAM = 3472551422;
		MH_CIGAM_64 = 3489328638;
		FAT_MAGIC = 3405691582;
		FAT_MAGIC_64 = 3405691583;
		FAT_CIGAM = 3199925962;
		FAT_CIGAM_64 = 3216703178;
		LC_ID_DYLIB = 13;
		LC_LOAD_DYLIB = 12;
		LC_LOAD_WEAK_DYLIB = 2147483672;
		LC_REEXPORT_DYLIB = 2147483679;
		LC_LAZY_LOAD_DYLIB = 32;
		LC_LOAD_UPWARD_DYLIB = 2147483683;
		LC_RPATH = 2147483676;
		LC_DYLD_ENVIRONMENT = 39;
		LC_CODE_SIGNATURE = 29;
		LC_VERSION_MIN_MACOSX = 36;
		LC_VERSION_MIN_IPHONEOS = 37;
		LC_VERSION_MIN_TVOS = 47;
		LC_VERSION_MIN_WATCHOS = 48;
		LC_BUILD_VERSION = 50;
		PLATFORM_MACOS = 1;
		PLATFORM_IOS = 2;
		PLATFORM_TVOS = 3;
		PLATFORM_WATCHOS = 4;
		PLATFORM_IOSSIMULATOR = 7;
		PLATFORM_TVOSSIMULATOR = 8;
		PLATFORM_WATCHOSSIMULATOR = 9;
		CPU_TYPE_I386 = 7;
		CPU_TYPE_X86_64 = 16777223;
		legacyVersionMinPlatform = (command, cpuType) => {
			const isIntel = cpuType === CPU_TYPE_I386 || cpuType === CPU_TYPE_X86_64;
			switch (command) {
				case LC_VERSION_MIN_MACOSX: return PLATFORM_MACOS;
				case LC_VERSION_MIN_IPHONEOS: return isIntel ? PLATFORM_IOSSIMULATOR : PLATFORM_IOS;
				case LC_VERSION_MIN_TVOS: return cpuType === CPU_TYPE_X86_64 ? PLATFORM_TVOSSIMULATOR : PLATFORM_TVOS;
				case LC_VERSION_MIN_WATCHOS: return isIntel ? PLATFORM_WATCHOSSIMULATOR : PLATFORM_WATCHOS;
				default: return undefined;
			}
		};
		DYLIB_USE_MARKER = 443815936;
		DYLIB_USE_WEAK_LINK = 1;
		DYLIB_USE_REEXPORT = 2;
		DYLIB_USE_UPWARD = 4;
		DYLIB_USE_DELAYED_INIT = 8;
		DEPENDENCY_COMMANDS = new Map([
			[LC_LOAD_DYLIB, "LC_LOAD_DYLIB"],
			[LC_LOAD_WEAK_DYLIB, "LC_LOAD_WEAK_DYLIB"],
			[LC_REEXPORT_DYLIB, "LC_REEXPORT_DYLIB"],
			[LC_LAZY_LOAD_DYLIB, "LC_LAZY_LOAD_DYLIB"],
			[LC_LOAD_UPWARD_DYLIB, "LC_LOAD_UPWARD_DYLIB"]
		]);
		MachoFormatIssue = class extends Error {
			status;
			constructor(status, message) {
				super(message);
				this.status = status;
			}
		};
		hasMachoMagic = (head) => {
			if (head.byteLength < 4) return false;
			const magic = new DataView(head.buffer, head.byteOffset, head.byteLength).getUint32(0, false);
			return [
				MH_MAGIC,
				MH_MAGIC_64,
				MH_CIGAM,
				MH_CIGAM_64,
				FAT_MAGIC,
				FAT_MAGIC_64,
				FAT_CIGAM,
				FAT_CIGAM_64
			].includes(magic);
		};
		readMachoImage = async (readAt, size) => {
			try {
				const head = await readAt(0, Math.min(size, 8));
				if (head.byteLength < 8) return hasMachoMagic(head) ? {
					status: "malformed",
					reason: "Mach-O header is truncated"
				} : { status: "not-mach-o" };
				const view = viewOf(head);
				const magic = view.getUint32(0, false);
				let header = readFatContainerHeader(head, size);
				if (header.state !== "not-fat") {
					if (header.state === "needs-data") {
						header = readFatContainerHeader(await readAt(0, header.requiredBytes), size);
					}
					if (header.state === "not-fat") return { status: "not-mach-o" };
					if (header.state === "needs-data") throw new MachoFormatIssue("malformed", "FAT table is truncated");
					if (header.state === "malformed") throw new MachoFormatIssue("malformed", header.reason);
					let identity = classifyFatContainerIdentity(header, () => undefined);
					if (identity.state === "needs-slice-header") {
						const sliceHeaders = new Map();
						for (const offset of identity.offsets) {
							const bytes = await readAt(offset, 4);
							sliceHeaders.set(offset, bytes.byteLength < 4 ? null : viewOf(bytes).getUint32(0, false));
						}
						identity = classifyFatContainerIdentity(header, (offset) => sliceHeaders.get(offset));
					}
					if (identity.state === "not-mach-o") return { status: "not-mach-o" };
					if (identity.state === "malformed") throw new MachoFormatIssue(identity.category, identity.reason);
					if (identity.state === "needs-slice-header") return { status: "not-mach-o" };
					return {
						status: "parsed",
						slices: await readFatSlices(readAt, header.slices)
					};
				}
				if (magic === MH_CIGAM || magic === MH_CIGAM_64) return {
					status: "parsed",
					slices: [await readSlice(readAt, 0, size)]
				};
				if (magic === MH_MAGIC || magic === MH_MAGIC_64) throw new MachoFormatIssue("unsupported", "big-endian Mach-O images are not supported");
				return { status: "not-mach-o" };
			} catch (cause) {
				if (cause instanceof MachoFormatIssue) return {
					status: cause.status,
					reason: cause.message
				};
				throw cause;
			}
		};
		readFatSlices = async (readAt, declarations) => {
			const slices = [];
			let unsupported;
			for (const declaration of declarations) {
				const { offset, size: length, cpuType, cpuSubtype } = declaration;
				let slice;
				try {
					slice = await readSlice(readAt, offset, length, {
						fatCpuType: cpuType,
						fatCpuSubtype: cpuSubtype,
						alignmentExponent: declaration.alignmentExponent
					});
				} catch (cause) {
					if (!(cause instanceof MachoFormatIssue) || cause.status !== "unsupported") throw cause;
					unsupported ??= cause;
					continue;
				}
				const identityIssue = validateFatSliceIdentity(declaration, {
					cpuType: slice.cpu_type,
					cpuSubtype: slice.cpu_subtype
				});
				if (identityIssue !== null) throw new MachoFormatIssue("malformed", identityIssue);
				slices.push(slice);
			}
			if (unsupported !== undefined) throw unsupported;
			return slices;
		};
		readSlice = async (readAt, base, length, fat = null) => {
			const header = viewOf(await readExact(readAt, base, 28, "Mach-O header"));
			const magic = header.getUint32(0, true);
			if (magic === MH_MAGIC_64 || magic === MH_MAGIC) {
				const wide = magic === MH_MAGIC_64;
				const headerSize = wide ? 32 : 28;
				const commandCount = header.getUint32(16, true);
				const commandBytes = header.getUint32(20, true);
				if (commandBytes > 16777216) throw new MachoFormatIssue("unsupported", `load commands occupy ${commandBytes} bytes, above the ${MAX_LOAD_COMMAND_BYTES}-byte limit`);
				if (headerSize + commandBytes > length) throw new MachoFormatIssue("malformed", "load commands extend beyond the Mach-O slice");
				const commands = await readExact(readAt, base + headerSize, commandBytes, "load commands");
				const slice = decodeCommands(commands, {
					wide,
					cpuType: header.getUint32(4, true),
					cpuSubtype: header.getUint32(8, true),
					fileType: header.getUint32(12, true),
					commandCount,
					sliceOffset: base,
					sliceSize: length,
					fatCpuType: fat?.fatCpuType ?? null,
					fatCpuSubtype: fat?.fatCpuSubtype ?? null,
					fatAlignmentExponent: fat?.alignmentExponent ?? null
				});
				const distinctPlatforms = [...new Set(slice.platforms)];
				slice.platform = distinctPlatforms.length === 1 ? distinctPlatforms[0] ?? null : null;
				return slice;
			}
			throw new MachoFormatIssue(magic === swap(MH_MAGIC) || magic === swap(MH_MAGIC_64) ? "unsupported" : "malformed", magic === swap(MH_MAGIC) || magic === swap(MH_MAGIC_64) ? "big-endian Mach-O slices are not supported" : `slice at offset ${base} has no Mach-O header`);
		};
		decodeCommands = (bytes, header) => {
			const alignment = header.wide ? 8 : 4;
			const view = viewOf(bytes);
			const slice = {
				architecture: architectureName(header.cpuType, header.cpuSubtype),
				slice_offset: header.sliceOffset,
				slice_size: header.sliceSize,
				cpu_type: header.cpuType,
				cpu_subtype: header.cpuSubtype,
				fat_cpu_type: header.fatCpuType,
				fat_cpu_subtype: header.fatCpuSubtype,
				fat_alignment_exponent: header.fatAlignmentExponent,
				file_type: fileTypeName(header.fileType),
				file_type_code: header.fileType,
				platform: null,
				platforms: [],
				install_name: null,
				dependencies: [],
				rpaths: [],
				dyld_environment: [],
				code_signature_present: false
			};
			let offset = 0;
			for (let index = 0; index < header.commandCount; index++) {
				if (offset + 8 > bytes.byteLength) throw new MachoFormatIssue("malformed", `load command ${index} starts beyond sizeofcmds`);
				const command = view.getUint32(offset, true);
				const size = view.getUint32(offset + 4, true);
				if (size < 8 || size % alignment !== 0 || offset + size > bytes.byteLength) throw new MachoFormatIssue("malformed", `load command ${index} at offset ${offset} has invalid cmdsize ${size}`);
				const body = bytes.subarray(offset, offset + size);
				decodeCommand(command, body, index, slice);
				offset += size;
			}
			if (offset !== bytes.byteLength) throw new MachoFormatIssue("malformed", `load commands declare ${header.commandCount} commands but sizeofcmds holds ${bytes.byteLength} bytes`);
			return slice;
		};
		decodeCommand = (command, body, index, slice) => {
			if (command === LC_ID_DYLIB) {
				slice.install_name = commandString(body, 24, index);
				return;
			}
			if (command === LC_RPATH) {
				slice.rpaths.push(commandString(body, 12, index));
				return;
			}
			if (command === LC_DYLD_ENVIRONMENT) {
				slice.dyld_environment.push(commandString(body, 12, index));
				return;
			}
			if (command === LC_CODE_SIGNATURE) {
				if (body.byteLength < 16) throw new MachoFormatIssue("malformed", `load command ${index} is too short for LC_CODE_SIGNATURE`);
				slice.code_signature_present = true;
				return;
			}
			if (command === LC_BUILD_VERSION) {
				if (body.byteLength < 24) throw new MachoFormatIssue("malformed", `load command ${index} is too short for LC_BUILD_VERSION`);
				const view = viewOf(body);
				const toolCount = view.getUint32(20, true);
				if (toolCount > Math.floor((body.byteLength - 24) / 8)) throw new MachoFormatIssue("malformed", `load command ${index} LC_BUILD_VERSION tool records exceed cmdsize`);
				const platform = view.getUint32(8, true);
				slice.platforms.push(platform);
				return;
			}
			const legacyPlatform = legacyVersionMinPlatform(command, slice.cpu_type);
			if (legacyPlatform !== undefined) {
				if (body.byteLength < 16) throw new MachoFormatIssue("malformed", `load command ${index} is too short for a version-min command`);
				slice.platforms.push(legacyPlatform);
				return;
			}
			const name = DEPENDENCY_COMMANDS.get(command);
			if (name !== undefined) slice.dependencies.push(decodeDependency(name, body, index));
		};
		decodeDependency = (command, body, index) => {
			if (body.byteLength < 24) throw new MachoFormatIssue("malformed", `load command ${index} is too short for a dylib command`);
			const view = viewOf(body);
			const nameOffset = view.getUint32(8, true);
			const usesFlags = nameOffset === 28 && body.byteLength >= 28 && view.getUint32(12, true) === DYLIB_USE_MARKER;
			const flags = usesFlags ? view.getUint32(24, true) : 0;
			return {
				command,
				encoding: usesFlags ? "dylib_use_command" : "dylib_command",
				install_name: commandString(body, usesFlags ? 28 : 24, index),
				weak: command === "LC_LOAD_WEAK_DYLIB" || (flags & DYLIB_USE_WEAK_LINK) !== 0,
				upward: command === "LC_LOAD_UPWARD_DYLIB" || (flags & DYLIB_USE_UPWARD) !== 0,
				reexport: command === "LC_REEXPORT_DYLIB" || (flags & DYLIB_USE_REEXPORT) !== 0,
				delayed_init: (flags & DYLIB_USE_DELAYED_INIT) !== 0,
				current_version: version(view.getUint32(16, true)),
				compatibility_version: version(view.getUint32(20, true))
			};
		};
		commandString = (body, minimumOffset, index) => {
			if (body.byteLength < 12) throw new MachoFormatIssue("malformed", `load command ${index} is too short to hold a string offset`);
			const offset = viewOf(body).getUint32(8, true);
			if (offset < minimumOffset || offset >= body.byteLength) throw new MachoFormatIssue("malformed", `load command ${index} has string offset ${offset} outside the command`);
			const end = body.indexOf(0, offset);
			if (end < 0) throw new MachoFormatIssue("malformed", `load command ${index} has an unterminated string`);
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(body.subarray(offset, end));
			} catch {
				throw new MachoFormatIssue("malformed", `load command ${index} has a string that is not UTF-8`);
			}
		};
		readExact = async (readAt, offset, length, label) => {
			const bytes = await readAt(offset, length);
			if (bytes.byteLength < length) throw new MachoFormatIssue("malformed", `${label} is truncated`);
			return bytes;
		};
		CPU_ARCH_ABI64 = 16777216;
		CPU_ARCH_ABI64_32 = 33554432;
		CPU_TYPE_X86 = 7;
		CPU_TYPE_ARM = 12;
		CPU_SUBTYPE_ARM64E = 2;
		CPU_SUBTYPE_ARM64E_X1 = 12;
		CPU_SUBTYPE_X86_64_H = 8;
		architectureName = (cpuType, cpuSubtype) => {
			const subtype = machoCpuSubtypeBase(cpuSubtype);
			if (cpuType === (CPU_TYPE_ARM | CPU_ARCH_ABI64)) return subtype === CPU_SUBTYPE_ARM64E || subtype === CPU_SUBTYPE_ARM64E_X1 ? "arm64e" : "arm64";
			if (cpuType === (CPU_TYPE_ARM | CPU_ARCH_ABI64_32)) return "arm64_32";
			if (cpuType === (CPU_TYPE_X86 | CPU_ARCH_ABI64)) return subtype === CPU_SUBTYPE_X86_64_H ? "x86_64h" : "x86_64";
			if (cpuType === CPU_TYPE_X86) return "i386";
			if (cpuType === CPU_TYPE_ARM) return "arm";
			return `cpu-${cpuType.toString(16)}`;
		};
		fileTypeName = (fileType) => fileType === 2 ? "execute" : fileType === 6 ? "dylib" : fileType === 8 ? "bundle" : "other";
		version = (value) => `${value >>> 16}.${value >>> 8 & 255}.${value & 255}`;
		swap = (value) => ((value & 255) << 24 | (value & 65280) << 8 | value >>> 8 & 65280 | value >>> 24) >>> 0;
		viewOf = (bytes) => new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	})))();
}

//#endregion
export { ArtifactPathRegistry, DESTINATION_CASE_COLLISION_PREFIX, OwnedDirectoryHandle, annotateEnglishUnicodeCaseCollisions, destinationCaseCollisionMessage, hasMachoMagic, init_ArtifactPaths, init_MachoLoadCommandReader, init_OwnedDirectoryHandle, init_StreamBytes, normalizeArtifactPath, readMachoImage, streamChunkToBuffer };