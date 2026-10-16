import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, hasZipSignature, init_localPath, init_result, init_zipPackageFormat, isPathWithinRoot, isZipPackageFormat, ok, zipPackageFormatForPath } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCancelledError, BinaryTargetError, init_analysisErrorCore, init_configurationErrors } from "./errorSchemas-CTRmvMl3.js";
import { init_RegularFile, openRegularFile, sameRegularFileState } from "./RegularFile-B_6KPCNQ.js";
import { admitRawBinary, init_rawBinary, rawBinarySelectionError } from "./toolOutputSchemaGroups-DRiYs1je.js";
import { classifyFatContainerIdentity, init_machoContainer, readFatContainerHeader } from "./machoContainer-C8BIkkq3.js";
import { MAX_XML_PLIST_PROBE_BYTES, createXmlPlistSignatureProbe, hasBinaryPlistSignature, init_appleArchiveFormat, init_dosMz, observeMzWindowsHeader, parseDosMzHeader } from "./appleArchiveFormat-tVoI2ykA.js";
import { init_dosCom, validateDosComLength } from "./managedToolContracts-D60QmIYj.js";
import { decodeXmlPlistText, init_InterfaceBuilderDecodeBudget, init_propertyListXmlText, preflightPropertyListDecode } from "./InterfaceBuilderDecodeBudget-D4omRUe4.js";
import { init_propertyListKeys, omitPrototypeKeys, parseXmlPropertyList } from "./propertyListKeys-G8e74YWb.js";
import { z } from "zod";
import { extname, isAbsolute, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { access, lstat, opendir, readFile, realpath, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { parseBinary } from "plist";

//#region dist/domain/elfFixedHeader.js
var readElfFixedHeader;
function init_elfFixedHeader() {
	return (init_elfFixedHeader = __esmMin((() => {
		init_result();
		readElfFixedHeader = (bytes, totalBytes = bytes.length) => {
			if (bytes.length >= 4 && bytes.toString("hex", 0, 4) !== "7f454c46") return err("not an ELF image");
			if (bytes.length < 16) return err("ELF identification is truncated");
			const classByte = bytes[4];
			if (classByte !== 1 && classByte !== 2) return err("unsupported ELF class");
			const dataByte = bytes[5];
			if (dataByte !== 1 && dataByte !== 2) return err("unsupported ELF endianness");
			if (bytes[6] !== 1) return err("unsupported ELF identification version");
			const elfClass = classByte === 1 ? 32 : 64;
			const minimumSize = elfClass === 32 ? 52 : 64;
			if (!Number.isSafeInteger(totalBytes) || totalBytes < bytes.length || totalBytes < minimumSize || bytes.length < minimumSize) return err(`truncated ELF header: an ELF${elfClass} header needs ${minimumSize} bytes; the file has ${totalBytes}`);
			const littleEndian = dataByte === 1;
			const readU16 = (offset) => littleEndian ? bytes.readUInt16LE(offset) : bytes.readUInt16BE(offset);
			const readU32 = (offset) => littleEndian ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
			if (readU32(20) !== 1) return err("unsupported ELF header version");
			const headerSize = readU16(elfClass === 32 ? 40 : 52);
			if (headerSize < minimumSize || headerSize > totalBytes) return err("invalid ELF header size");
			return ok({
				elfClass,
				byteOrder: littleEndian ? "little" : "big",
				headerSize
			});
		};
	})))();
}

//#endregion
//#region dist/application/MipsElfSharedLoad.js
var readMipsElfSharedLoad;
function init_MipsElfSharedLoad() {
	return (init_MipsElfSharedLoad = __esmMin((() => {
		init_result();
		readMipsElfSharedLoad = async (programHeaders, little, fileSize, read, checkCancelled, sections) => {
			const u32 = (bytes, offset) => little ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
			const loads = [];
			let dynamic;
			for (let position = 0; position < programHeaders.length; position += 32) {
				checkCancelled();
				const type = u32(programHeaders, position);
				const offset = u32(programHeaders, position + 4);
				const size = u32(programHeaders, position + 16);
				if (type === 1) {
					const address = u32(programHeaders, position + 8);
					const memorySize = u32(programHeaders, position + 20);
					if (offset > fileSize - size || size > memorySize || address + memorySize > 4294967296) return err("invalid or incomplete MIPS PT_LOAD range");
					loads.push({
						offset,
						address,
						size,
						memorySize
					});
				}
				if (type === 2) {
					if (dynamic !== undefined) return err("duplicate MIPS PT_DYNAMIC tables");
					dynamic = {
						offset,
						address: u32(programHeaders, position + 8),
						size
					};
				}
			}
			if (dynamic === undefined) return err("MIPS shared image has no PT_DYNAMIC table");
			if (dynamic.size === 0 || dynamic.size % 8 !== 0) return err("invalid MIPS ELF32 dynamic table size");
			if (dynamic.offset > fileSize - dynamic.size) return err("MIPS PT_DYNAMIC range extends beyond the file");
			const ranges = loads.filter((load) => load.memorySize > 0).sort((left, right) => left.address - right.address);
			for (let i = 1; i < ranges.length; i += 1) {
				checkCancelled();
				const previous = ranges[i - 1];
				if (ranges[i].address < previous.address + previous.memorySize) return err("overlapping MIPS PT_LOAD memory ranges require separate mapping verification");
			}
			const mapped = (address, length, fileBacked) => {
				let low = 0;
				let high = ranges.length;
				while (low < high) {
					const middle = Math.floor((low + high) / 2);
					if (ranges[middle].address <= address) low = middle + 1;
					else high = middle;
				}
				const range = ranges[low - 1];
				return range !== undefined && address - range.address <= (fileBacked ? range.size : range.memorySize) - length ? range : undefined;
			};
			const dynamicMapping = mapped(dynamic.address, dynamic.size, true);
			if (dynamicMapping === undefined || dynamicMapping.offset + dynamic.address - dynamicMapping.address !== dynamic.offset) return err("MIPS PT_DYNAMIC has no unique matching file-backed PT_LOAD range");
			const chunkBytes = 64 * 1024;
			const relevant = new Set([
				2,
				7,
				8,
				9,
				17,
				18,
				19,
				20,
				23
			]);
			const tags = new Map();
			let terminated = false;
			for (let offset = 0; offset < dynamic.size && !terminated; offset += chunkBytes) {
				const chunk = await read(dynamic.offset + offset, Math.min(chunkBytes, dynamic.size - offset), "dynamic table");
				if (!chunk.ok) return chunk;
				for (let position = 0; position < chunk.value.length; position += 8) {
					checkCancelled();
					const tag = u32(chunk.value, position);
					if (tag === 0) {
						terminated = true;
						break;
					}
					if (!relevant.has(tag)) continue;
					if (tags.has(tag)) return err(`duplicate MIPS dynamic tag ${tag}`);
					tags.set(tag, u32(chunk.value, position + 4));
				}
			}
			if (!terminated) return err("MIPS dynamic table has no DT_NULL terminator");
			if ([
				2,
				7,
				8,
				9,
				23
			].some((tag) => (tags.get(tag) ?? 0) !== 0)) return err("MIPS shared RELA or PLT relocation declarations require separate verification");
			const address = tags.get(17);
			const size = tags.get(18);
			const stride = tags.get(19);
			const checkSections = (offset, length) => {
				let observed = 0;
				for (const section of sections) {
					checkCancelled();
					if (section.size === 0) continue;
					if (section.type !== 9 || section.entrySize !== 8 || section.offset !== offset || section.size !== length) return "MIPS section relocation declarations outside the dynamic REL table require separate verification";
					observed += 1;
				}
				return observed > 1 ? "duplicate MIPS section relocation declarations require separate verification" : undefined;
			};
			const emptyRelocations = () => {
				const reason = checkSections(0, 0);
				return reason === undefined ? ok({
					status: "complete",
					relocationCount: 0,
					relocationTypes: [],
					symbolRelativeCount: 0
				}) : err(reason);
			};
			if (address === undefined && size === undefined && stride === undefined) return emptyRelocations();
			if (address === undefined || size === undefined || stride !== 8 || size % 8 !== 0) return err("incomplete or invalid MIPS DT_REL/DT_RELSZ/DT_RELENT declaration");
			if (size === 0) return emptyRelocations();
			const mapping = mapped(address, size, true);
			if (mapping === undefined) return err("MIPS DT_REL range has no unique complete file-backed PT_LOAD mapping");
			const fileOffset = mapping.offset + address - mapping.address;
			const sectionReason = checkSections(fileOffset, size);
			if (sectionReason !== undefined) return err(sectionReason);
			let symbolRelativeCount = 0;
			const types = new Set();
			for (let offset = 0; offset < size; offset += chunkBytes) {
				const chunk = await read(fileOffset + offset, Math.min(chunkBytes, size - offset), "dynamic REL records");
				if (!chunk.ok) return chunk;
				for (let position = 0; position < chunk.value.length; position += 8) {
					checkCancelled();
					const info = u32(chunk.value, position + 4);
					const type = info & 255;
					const relocationAddress = u32(chunk.value, position);
					if (type === 3 && mapped(relocationAddress, 4, false) === undefined) return err("MIPS REL32 destination has no unique complete PT_LOAD memory range");
					types.add(type);
					if (type === 3 && info >>> 8 !== 0) symbolRelativeCount += 1;
				}
			}
			return ok({
				status: "complete",
				relocationCount: size / 8,
				relocationTypes: [...types].sort((left, right) => left - right),
				symbolRelativeCount
			});
		};
	})))();
}

//#endregion
//#region dist/application/MipsGnuAttributes.js
var MIPS_GNU_ATTRIBUTES_MAX_BYTES, FORMAT_VERSION, TAG_FILE, TAG_GNU_MIPS_ABI_FP, TAG_GNU_MIPS_ABI_MSA, parseMipsGnuAttributes;
function init_MipsGnuAttributes() {
	return (init_MipsGnuAttributes = __esmMin((() => {
		init_result();
		MIPS_GNU_ATTRIBUTES_MAX_BYTES = 4096;
		FORMAT_VERSION = 65;
		TAG_FILE = 1;
		TAG_GNU_MIPS_ABI_FP = 4;
		TAG_GNU_MIPS_ABI_MSA = 8;
		parseMipsGnuAttributes = (bytes, littleEndian) => {
			if (bytes.length === 0 || bytes[0] !== FORMAT_VERSION) return err("unsupported MIPS GNU attribute section format version");
			const readU32 = (offset) => littleEndian ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
			const readUleb = (offset, end) => {
				let value = 0;
				for (let index = 0; index < 5 && offset + index < end; index += 1) {
					const byte = bytes[offset + index];
					value += (byte & 127) * 2 ** (7 * index);
					if ((byte & 128) === 0) return value <= 4294967295 ? {
						value,
						next: offset + index + 1
					} : undefined;
				}
				return undefined;
			};
			let fpAbi = null;
			let msa = null;
			let vendorSeen = false;
			let position = 1;
			while (position < bytes.length) {
				if (bytes.length - position < 4) return err("truncated MIPS GNU attribute subsection length");
				const length = readU32(position);
				if (length < 4 || length > bytes.length - position) return err("MIPS GNU attribute subsection length does not fit the section");
				const end = position + length;
				const vendorEnd = bytes.indexOf(0, position + 4);
				if (vendorEnd < 0 || vendorEnd >= end) return err("unterminated MIPS GNU attribute vendor name");
				if (bytes.toString("latin1", position + 4, vendorEnd) !== "gnu") return err("MIPS ELF declares non-GNU vendor attributes that REA does not inspect");
				if (vendorSeen) return err("duplicate MIPS GNU attribute vendor subsections");
				vendorSeen = true;
				let cursor = vendorEnd + 1;
				while (cursor < end) {
					const scopeStart = cursor;
					const scope = readUleb(cursor, end);
					if (scope === undefined) return err("malformed MIPS GNU attribute scope tag");
					if (scope.value !== TAG_FILE) return err("MIPS GNU attributes scoped to sections or symbols are not inspected by REA");
					if (end - scope.next < 4) return err("truncated MIPS GNU attribute scope length");
					const scopeLength = readU32(scope.next);
					if (scopeLength < scope.next + 4 - scopeStart || scopeLength > end - scopeStart) return err("MIPS GNU attribute scope length does not fit its subsection");
					const scopeEnd = scopeStart + scopeLength;
					cursor = scope.next + 4;
					while (cursor < scopeEnd) {
						const tag = readUleb(cursor, scopeEnd);
						if (tag === undefined) return err("malformed MIPS GNU attribute tag");
						if (tag.value !== TAG_GNU_MIPS_ABI_FP && tag.value !== TAG_GNU_MIPS_ABI_MSA) return err(`MIPS ELF declares GNU attribute tag ${tag.value}, which REA does not inspect`);
						const value = readUleb(tag.next, scopeEnd);
						if (value === undefined) return err("malformed MIPS GNU attribute value");
						if (tag.value === TAG_GNU_MIPS_ABI_FP) {
							if (fpAbi !== null) return err("duplicate MIPS GNU floating-point ABI attributes");
							fpAbi = value.value;
						} else {
							if (msa !== null) return err("duplicate MIPS GNU MSA ABI attributes");
							msa = value.value;
						}
						cursor = value.next;
					}
					cursor = scopeEnd;
				}
				position = end;
			}
			return ok({
				fpAbi,
				msa
			});
		};
	})))();
}

//#endregion
//#region dist/application/MipsElfMetadata.js
var SHT_GNU_ATTRIBUTES, readMipsElfMetadata;
function init_MipsElfMetadata() {
	return (init_MipsElfMetadata = __esmMin((() => {
		init_elfFixedHeader();
		init_result();
		init_MipsElfSharedLoad();
		init_MipsGnuAttributes();
		SHT_GNU_ATTRIBUTES = 1879048181;
		readMipsElfMetadata = async (handle, metadata, checkCancelled) => {
			checkCancelled();
			if (metadata.elfClass !== 32) return err("MIPS ABI record inspection currently supports ELF32 only");
			const fileSize = (await handle.stat()).size;
			checkCancelled();
			const read = async (offset, length, label) => {
				checkCancelled();
				if (!Number.isSafeInteger(fileSize) || offset < 0 || length < 0 || offset > fileSize - length) return err(`MIPS ${label} lies outside the file`);
				const bytes = Buffer.alloc(length);
				let total = 0;
				while (total < length) {
					checkCancelled();
					const observed = await handle.read(bytes, total, length - total, offset + total);
					checkCancelled();
					if (observed.bytesRead === 0) return err(`truncated MIPS ${label}`);
					total += observed.bytesRead;
				}
				return ok(bytes);
			};
			const header = await read(0, 52, "ELF32 header");
			if (!header.ok) return header;
			const bytes = header.value;
			const fixedHeader = readElfFixedHeader(bytes, fileSize);
			if (!fixedHeader.ok) return fixedHeader;
			const little = metadata.byteOrder === "little";
			const u16 = (data, offset) => little ? data.readUInt16LE(offset) : data.readUInt16BE(offset);
			const u32 = (data, offset) => little ? data.readUInt32LE(offset) : data.readUInt32BE(offset);
			if (fixedHeader.value.elfClass !== 32 || fixedHeader.value.byteOrder !== metadata.byteOrder || u16(bytes, 18) !== 8 || u16(bytes, 16) !== metadata.type || u32(bytes, 36) !== metadata.flags) return err("MIPS ELF header no longer matches the resolved identity");
			if (fixedHeader.value.headerSize !== 52) return err("invalid MIPS ELF32 version or header size");
			const tables = [{
				label: "program header table",
				offset: u32(bytes, 28),
				count: u16(bytes, 44),
				stride: u16(bytes, 42),
				entrySize: 32,
				typeOffset: 0,
				dataOffset: 4,
				sizeOffset: 16,
				recordType: 1879048195,
				optional: false
			}, {
				label: "section header table",
				offset: u32(bytes, 32),
				count: u16(bytes, 48),
				stride: u16(bytes, 46),
				entrySize: 40,
				typeOffset: 4,
				dataOffset: 16,
				sizeOffset: 20,
				recordType: 1879048234,
				optional: true
			}];
			if (u16(bytes, 44) === 65535 || u16(bytes, 48) >= 65280) return err("extended or reserved MIPS ELF table numbering is unsupported");
			let record;
			let sharedLoad;
			let programHeaders;
			const relocationSections = [];
			const limitations = [];
			let gnuAttributes = null;
			for (const table of tables) {
				if (table.count === 0) {
					if (table.offset !== 0) return err(`unsupported extended or inconsistent MIPS ${table.label}`);
					continue;
				}
				if (table.offset < 52 || table.stride !== table.entrySize) return err(`invalid MIPS ${table.label} offset or entry size`);
				const count = table.optional ? Math.min(table.count, Math.max(0, Math.floor((fileSize - table.offset) / table.entrySize))) : table.count;
				if (count < table.count) limitations.push(`MIPS ${table.label} at file offset ${table.offset} extends beyond the captured file: examined ${count} of ${table.count} complete headers. ABI declarations in unavailable headers remain unknown.`);
				if (count === 0) continue;
				const contents = await read(table.offset, count * table.entrySize, table.label);
				if (!contents.ok) return contents;
				if (!table.optional && metadata.type === 3) programHeaders = contents.value;
				let found = false;
				for (let i = 0; i < count; i += 1) {
					checkCancelled();
					const position = i * table.entrySize;
					const type = u32(contents.value, position + table.typeOffset);
					if (table.optional && type === SHT_GNU_ATTRIBUTES) {
						if (gnuAttributes !== null) return err("duplicate MIPS GNU attribute sections");
						const size = u32(contents.value, position + 20);
						if (size === 0 || size > 4096) return err(`MIPS GNU attribute section size ${size} is outside REA's inspected bound of ${MIPS_GNU_ATTRIBUTES_MAX_BYTES} bytes`);
						const section = await read(u32(contents.value, position + 16), size, "GNU attribute section");
						if (!section.ok) return section;
						const parsed = parseMipsGnuAttributes(section.value, little);
						if (!parsed.ok) return parsed;
						gnuAttributes = parsed.value;
						continue;
					}
					if (metadata.type === 3 && table.optional && (type === 4 || type === 9)) relocationSections.push({
						type,
						offset: u32(contents.value, position + 16),
						size: u32(contents.value, position + 20),
						entrySize: u32(contents.value, position + 36)
					});
					if (type !== table.recordType) continue;
					if (found) return err(`duplicate MIPS ABI records in ${table.label}`);
					found = true;
					const offset = u32(contents.value, position + table.dataOffset);
					const size = u32(contents.value, position + table.sizeOffset);
					if (size !== 24) return err("unsupported MIPS ABI record size; expected 24 bytes");
					const candidate = await read(offset, 24, "ABI record");
					if (!candidate.ok) return candidate;
					if (record !== undefined && !record.equals(candidate.value)) return err("conflicting MIPS program/section ABI declarations");
					record = candidate.value;
				}
			}
			if (metadata.type === 3 && programHeaders !== undefined) {
				if (limitations.length > 0) sharedLoad = {
					status: "unavailable",
					reason: `MIPS shared-image relocation declaration sources are incomplete. ${limitations.join(" ")}`
				};
				else {
					const shared = await readMipsElfSharedLoad(programHeaders, little, fileSize, read, checkCancelled, relocationSections);
					sharedLoad = shared.ok ? shared.value : {
						status: "unavailable",
						reason: shared.error
					};
				}
			}
			const shared = metadata.type === 3 ? { sharedLoad: sharedLoad ?? {
				status: "unavailable",
				reason: "MIPS shared image has no inspected program header table"
			} } : {};
			if (record === undefined) return ok({
				abiFlags: null,
				gnuAttributes,
				limitations,
				...shared
			});
			const abiFlags = {
				version: u16(record, 0),
				isaLevel: record.readUInt8(2),
				isaRevision: record.readUInt8(3),
				gprSize: record.readUInt8(4),
				cpr1Size: record.readUInt8(5),
				cpr2Size: record.readUInt8(6),
				fpAbi: record.readUInt8(7),
				isaExtension: u32(record, 8),
				ases: u32(record, 12),
				flags1: u32(record, 16),
				flags2: u32(record, 20)
			};
			if (gnuAttributes !== null && gnuAttributes.fpAbi !== null && gnuAttributes.fpAbi !== 0 && gnuAttributes.fpAbi !== abiFlags.fpAbi) return err("conflicting MIPS ABI flags and GNU floating-point ABI declarations");
			return ok({
				abiFlags,
				gnuAttributes,
				limitations,
				...shared
			});
		};
	})))();
}

//#endregion
//#region dist/application/AppBundleExecutable.js
var BINARY_PLIST_DECODE_BYTES, BUNDLE_LAYOUTS, defaultFileSystem, resolveAppBundleExecutable, presentLayout, layoutPlistPresent, isAbsence, errorCode, codeDescription, isSystemErrorCode, isPermissionDenied, errorReason, wrappedBundle, resolveLayoutExecutable, parseXmlPlistExecutable, executableName, executableEntrySchema, parseBinaryPlistExecutable, isSafeExecutableName;
function init_AppBundleExecutable() {
	return (init_AppBundleExecutable = __esmMin((() => {
		init_InterfaceBuilderDecodeBudget();
		init_configurationErrors();
		init_localPath();
		init_propertyListKeys();
		init_propertyListXmlText();
		init_appleArchiveFormat();
		init_result();
		BINARY_PLIST_DECODE_BYTES = 16 * 1024 * 1024;
		BUNDLE_LAYOUTS = [{
			plist: ["Contents", "Info.plist"],
			programs: ["Contents", "MacOS"],
			programsLabel: "Contents/MacOS"
		}, {
			plist: ["Info.plist"],
			programs: [],
			programsLabel: "the bundle root"
		}];
		defaultFileSystem = {
			readFile,
			realpath
		};
		resolveAppBundleExecutable = async (path, fileSystem = defaultFileSystem) => {
			try {
				const layout = await presentLayout(path);
				if (layout !== undefined) return resolveLayoutExecutable(path, layout, fileSystem);
				const wrapped = await wrappedBundle(path);
				if (wrapped !== undefined) {
					const wrappedLayout = await presentLayout(wrapped);
					if (wrappedLayout !== undefined) return resolveLayoutExecutable(wrapped, wrappedLayout, fileSystem);
				}
			} catch (cause) {
				if (cause instanceof BinaryTargetError) return err(cause);
				return err(new BinaryTargetError(path, errorReason(cause, path), { cause }));
			}
			return err(new BinaryTargetError(path, `app Info.plist is missing or no supported bundle layout was found: ${path}`, { cause: new Error("No Contents/Info.plist, root Info.plist, or single Wrapper/*.app bundle was found") }));
		};
		presentLayout = async (bundle) => {
			for (const layout of BUNDLE_LAYOUTS) if (await layoutPlistPresent(join(bundle, ...layout.plist))) return layout;
			return undefined;
		};
		layoutPlistPresent = async (path) => {
			try {
				return (await stat(path)).isFile();
			} catch (cause) {
				if (isAbsence(cause)) return false;
				if (isPermissionDenied(cause)) throw new BinaryTargetError(path, `permission denied inspecting app Info.plist ${path}`, { cause });
				throw cause;
			}
		};
		isAbsence = (cause) => {
			const code = errorCode(cause);
			return code === "ENOENT" || code === "ENOTDIR";
		};
		errorCode = (cause) => cause instanceof Error ? Reflect.get(cause, "code") : undefined;
		codeDescription = (cause) => {
			const code = errorCode(cause);
			return typeof code === "string" || typeof code === "number" ? ` (${String(code)})` : "";
		};
		isSystemErrorCode = (cause) => {
			const code = errorCode(cause);
			return typeof code === "string" && /^[A-Z][A-Z0-9_]+$/u.test(code) && !code.startsWith("ERR_");
		};
		isPermissionDenied = (cause) => errorCode(cause) === "EACCES" || errorCode(cause) === "EPERM";
		errorReason = (cause, path) => isPermissionDenied(cause) ? `permission denied accessing app bundle path ${path}` : isAbsence(cause) ? `app bundle path is missing: ${path}` : `could not inspect app bundle path ${path}`;
		wrappedBundle = async (bundle) => {
			const wrapper = join(bundle, "Wrapper");
			try {
				if (!(await lstat(wrapper)).isDirectory()) return undefined;
			} catch (cause) {
				if (isAbsence(cause)) return undefined;
				throw cause;
			}
			let app;
			for await (const entry of await opendir(wrapper)) {
				if (!entry.isDirectory() || !entry.name.toLowerCase().endsWith(".app")) continue;
				if (app !== undefined) return undefined;
				app = join(wrapper, entry.name);
			}
			return app;
		};
		resolveLayoutExecutable = async (bundle, layout, fileSystem) => {
			const plistPath = join(bundle, ...layout.plist);
			let plist;
			try {
				plist = await fileSystem.readFile(plistPath);
			} catch (cause) {
				return err(new BinaryTargetError(plistPath, isPermissionDenied(cause) ? `permission denied reading app Info.plist ${plistPath}` : isAbsence(cause) ? `app Info.plist is missing: ${plistPath}` : `could not read app Info.plist ${plistPath}${codeDescription(cause)}`, { cause }));
			}
			let name;
			try {
				name = hasBinaryPlistSignature(plist) ? await (fileSystem.decodeBinaryPlist?.(plistPath) ?? parseBinaryPlistExecutable(plist)) : parseXmlPlistExecutable(decodeXmlPlistText(plist));
			} catch (cause) {
				return err(new BinaryTargetError(plistPath, isPermissionDenied(cause) ? `permission denied decoding app Info.plist ${plistPath}${codeDescription(cause)}` : isSystemErrorCode(cause) ? `could not decode app Info.plist ${plistPath}${codeDescription(cause)}` : `app Info.plist is malformed, unsupported, or lacks CFBundleExecutable: ${plistPath}${cause instanceof Error ? ` (${cause.message})` : ""}`, { cause }));
			}
			if (!isSafeExecutableName(name)) return err(new BinaryTargetError(bundle, "app has an unsafe CFBundleExecutable"));
			const programs = join(bundle, ...layout.programs);
			const executable = join(programs, name);
			try {
				const [canonicalPrograms, canonicalExecutable] = await Promise.all([fileSystem.realpath(programs), fileSystem.realpath(executable)]);
				if (!isPathWithinRoot(canonicalPrograms, canonicalExecutable)) return err(new BinaryTargetError(bundle, `app program file leaves ${layout.programsLabel}`));
				return ok({
					executable: canonicalExecutable,
					infoPlist: plistPath
				});
			} catch (cause) {
				return err(new BinaryTargetError(executable, isPermissionDenied(cause) ? `permission denied resolving app program file ${executable}` : isAbsence(cause) ? `app program file is missing: ${executable}` : `could not resolve app program file ${executable}`, { cause }));
			}
		};
		parseXmlPlistExecutable = (plist) => {
			const { value } = parseXmlPropertyList(plist);
			return executableName(value);
		};
		executableName = (value) => {
			const executable = executableEntrySchema.safeParse(value);
			if (!executable.success) throw new Error("CFBundleExecutable is missing");
			return executable.data.CFBundleExecutable;
		};
		executableEntrySchema = z.looseObject({ CFBundleExecutable: z.string() });
		parseBinaryPlistExecutable = (plist) => {
			preflightPropertyListDecode(plist, BINARY_PLIST_DECODE_BYTES);
			return executableName(omitPrototypeKeys(parseBinary(plist)).value);
		};
		isSafeExecutableName = (name) => name.length > 0 && name !== "." && name !== ".." && !name.includes("\0") && !/[/\\]/u.test(name);
	})))();
}

//#endregion
//#region dist/domain/peMachine.js
var architectureForMachine, NATIVE_OS_OVERRIDES, decodePeMachine;
function init_peMachine() {
	return (init_peMachine = __esmMin((() => {
		architectureForMachine = (machine) => {
			switch (machine) {
				case 332: return "x86";
				case 34404: return "x86_64";
				case 448:
				case 450:
				case 452: return "arm";
				case 43620: return "arm64";
			}
			return undefined;
		};
		NATIVE_OS_OVERRIDES = [
			17988,
			44484,
			44485,
			31609,
			6547,
			6546
		];
		decodePeMachine = (machine) => {
			const direct = architectureForMachine(machine);
			if (direct !== undefined) return {
				architecture: direct,
				nativeOsOverride: false
			};
			for (const override of NATIVE_OS_OVERRIDES) {
				const architecture = architectureForMachine(machine ^ override);
				if (architecture !== undefined) return {
					architecture,
					nativeOsOverride: true
				};
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/binaryTarget.js
var parseExecutableHeader, parseThinMachO, parseFatMachO, fatHostArchitecture, fatIdentityError, parseElf, parseMz, parsePeRecord, parseCodeViewData, peDebugDirectoryEntry, peRvaToFileOffset, parsePeCodeViewFromBuffer, peManagedStatus, machArchitecture, elfArchitecture;
function init_binaryTarget() {
	return (init_binaryTarget = __esmMin((() => {
		init_result();
		init_elfFixedHeader();
		init_dosMz();
		init_peMachine();
		init_machoContainer();
		parseExecutableHeader = (bytes, hostArchitecture, fileSize = bytes.length, mzWindowsHeaderSignature) => {
			if (bytes.length >= 4 && bytes.subarray(0, 4).equals(Buffer.from([
				127,
				69,
				76,
				70
			]))) return parseElf(bytes, fileSize);
			if (bytes.length >= 2 && bytes[0] === 77 && bytes[1] === 90) return parseMz(bytes, fileSize, mzWindowsHeaderSignature);
			if (bytes.length < 8) return err("truncated or unsupported binary header");
			const magic = bytes.readUInt32BE(0);
			if ([
				4277009102,
				4277009103,
				3472551422,
				3489328638
			].includes(magic)) return parseThinMachO(bytes, magic, fileSize);
			const fatHeader = readFatContainerHeader(bytes, fileSize);
			if (fatHeader.state !== "not-fat") return parseFatMachO(bytes, hostArchitecture, fatHeader);
			return err("unsupported binary format");
		};
		parseThinMachO = (bytes, magic, fileSize) => {
			const is64 = magic === 4277009103 || magic === 3489328638;
			const headerSize = is64 ? 32 : 28;
			if (bytes.length < headerSize) return err(`truncated Mach-O header: a ${is64 ? 64 : 32}-bit header needs ${headerSize} bytes; the file has ${fileSize}`);
			const little = magic === 3472551422 || magic === 3489328638;
			const read = (offset) => little ? bytes.readUInt32LE(offset) : bytes.readUInt32BE(offset);
			const architecture = machArchitecture(read(4));
			if (architecture === undefined) return err("unsupported Mach-O architecture");
			const commandBytes = read(20);
			if (headerSize + commandBytes > fileSize) return err(`truncated Mach-O load commands: the header declares ${commandBytes} bytes after its ${headerSize}-byte header; the file has ${fileSize}`);
			return ok({
				format: "mach-o",
				architecture,
				availableArchitectures: [architecture]
			});
		};
		parseFatMachO = (bytes, host, header) => {
			if (header.state === "needs-data") return err("truncated or invalid FAT architecture table");
			if (header.state === "malformed") return err(header.reason);
			const identityError = fatIdentityError(bytes, header);
			if (identityError !== null) return err(identityError);
			const architectures = [];
			const slices = new Map();
			for (const declaration of header.slices) {
				const architecture = machArchitecture(declaration.cpuType);
				if (architecture === undefined || architectures.includes(architecture)) continue;
				architectures.push(architecture);
				slices.set(architecture, {
					offset: declaration.offset,
					size: declaration.size
				});
			}
			const preferred = fatHostArchitecture(host);
			const slice = preferred === undefined ? undefined : slices.get(preferred);
			if (preferred === undefined || slice === undefined) return err(`FAT binary has no host-compatible ${host} architecture`);
			const minimumHeaderSize = preferred === "arm64" || preferred === "x86_64" ? 32 : 28;
			if (slice.size < minimumHeaderSize) return err(`FAT slice for ${preferred} is shorter than its Mach-O header`);
			return ok({
				format: "mach-o-universal",
				architecture: preferred,
				availableArchitectures: architectures,
				universalSlice: {
					offset: slice.offset,
					size: slice.size
				}
			});
		};
		fatHostArchitecture = (host) => {
			switch (host) {
				case "arm64": return "arm64";
				case "x64": return "x86_64";
				case "ia32": return "x86";
				case "arm": return "arm";
				default: return undefined;
			}
		};
		fatIdentityError = (bytes, header) => {
			const identity = classifyFatContainerIdentity(header, (offset) => {
				if (offset >= bytes.length) return undefined;
				if (offset + 4 > bytes.length) return null;
				return bytes.readUInt32BE(offset);
			});
			if (identity.state === "needs-slice-header") return "FAT slice identity is outside the bounded prefix";
			if (identity.state === "not-mach-o") return "FAT table does not identify a Mach-O image";
			if (identity.state === "malformed") return identity.reason;
			return null;
		};
		parseElf = (bytes, fileSize) => {
			const fixedHeader = readElfFixedHeader(bytes, fileSize);
			if (!fixedHeader.ok) return fixedHeader;
			const { elfClass, byteOrder } = fixedHeader.value;
			const little = byteOrder === "little";
			const machine = little ? bytes.readUInt16LE(18) : bytes.readUInt16BE(18);
			const architecture = elfArchitecture(machine);
			if (architecture === undefined) return err("unsupported ELF architecture");
			if (architecture === "mips" || architecture === "riscv" || architecture === "powerpc") {
				const flagsOffset = elfClass === 32 ? 36 : 48;
				const metadata = {
					elfClass,
					byteOrder: little ? "little" : "big",
					type: little ? bytes.readUInt16LE(16) : bytes.readUInt16BE(16),
					flags: little ? bytes.readUInt32LE(flagsOffset) : bytes.readUInt32BE(flagsOffset)
				};
				if (architecture === "powerpc") return ok({
					format: "elf",
					architecture,
					availableArchitectures: [architecture],
					powerpc: metadata
				});
				return architecture === "mips" ? ok({
					format: "elf",
					architecture,
					availableArchitectures: [architecture],
					mips: metadata
				}) : ok({
					format: "elf",
					architecture,
					availableArchitectures: [architecture],
					riscv: metadata
				});
			}
			return ok({
				format: "elf",
				architecture,
				availableArchitectures: [architecture]
			});
		};
		parseMz = (bytes, fileSize, signatureAtOffset) => {
			const windowsHeader = observeMzWindowsHeader(bytes, fileSize, signatureAtOffset);
			if (windowsHeader.state === "header-needed" || windowsHeader.state === "signature-needed") return err("Windows new-header pointer or signature is outside the bounded prefix");
			if (windowsHeader.state === "declared") {
				const { offset } = windowsHeader;
				if (offset < 64 || offset > bytes.length - 24) return err("invalid or truncated Windows executable header in MZ image");
				if ([
					"NE",
					"LE",
					"LX"
				].includes(windowsHeader.signature)) return err(`unsupported ${windowsHeader.signature} executable in MZ image`);
				if (windowsHeader.signature !== "PE") return err("invalid or truncated Windows executable header in MZ image");
				const codeView = parsePeCodeViewFromBuffer(bytes, offset);
				return parsePeRecord(bytes.subarray(offset), codeView);
			}
			const parsed = parseDosMzHeader(bytes, fileSize, signatureAtOffset);
			return parsed.ok ? ok({
				format: "dos-mz",
				architecture: "x86",
				availableArchitectures: ["x86"]
			}) : parsed;
		};
		parsePeRecord = (record, codeView) => {
			if (record.length < 24 || record.toString("binary", 0, 4) !== "PE\0\0") return err("invalid or truncated PE header");
			const machineType = record.readUInt16LE(4);
			const machine = decodePeMachine(machineType);
			if (machine === undefined) return err(`unsupported PE architecture (COFF machine 0x${machineType.toString(16).padStart(4, "0")})`);
			const { architecture } = machine;
			const optionalHeaderSize = record.readUInt16LE(20);
			if (optionalHeaderSize > 4096 || record.length < 24 + optionalHeaderSize) return err("invalid or truncated PE optional header");
			const optionalHeader = record.subarray(24, 24 + optionalHeaderSize);
			const managed = peManagedStatus(optionalHeader, architecture);
			if (!managed.ok) return managed;
			if (machine.nativeOsOverride && !managed.value) return err("unsupported PE architecture");
			const characteristics = record.readUInt16LE(22);
			return ok({
				format: "pe",
				architecture,
				availableArchitectures: [architecture],
				executableRole: (characteristics & 2) === 0 ? "non-executable" : (characteristics & 8192) === 0 ? "application" : "shared-library",
				managed: managed.value,
				...codeView !== undefined ? { codeView } : {}
			});
		};
		parseCodeViewData = (buffer, sizeOfData) => {
			if (sizeOfData < 16 || buffer.length < 16) return undefined;
			const magic = buffer.subarray(0, 4).toString("binary");
			const pathOffset = magic === "RSDS" ? 24 : magic === "NB10" ? 16 : undefined;
			if (pathOffset === undefined || sizeOfData <= pathOffset || buffer.length <= pathOffset) return undefined;
			const end = buffer.indexOf(0, pathOffset);
			if (end <= pathOffset || end >= sizeOfData) return undefined;
			const pdbPath = buffer.toString("utf8", pathOffset, end);
			const pdbFileName = pdbPath.split(/[/\\]/u).pop() ?? pdbPath;
			if (magic === "RSDS" && sizeOfData >= 24 && buffer.length >= 24) {
				const part1 = buffer.readUInt32LE(4).toString(16).padStart(8, "0");
				const part2 = buffer.readUInt16LE(8).toString(16).padStart(4, "0");
				const part3 = buffer.readUInt16LE(10).toString(16).padStart(4, "0");
				const part4 = buffer.subarray(12, 14).toString("hex");
				const part5 = buffer.subarray(14, 20).toString("hex");
				const guid = `${part1}-${part2}-${part3}-${part4}-${part5}`;
				const age = buffer.readUInt32LE(20);
				return {
					pdbPath,
					pdbFileName,
					guid,
					age
				};
			}
			if (magic === "NB10") {
				const age = buffer.readUInt32LE(12);
				return {
					pdbPath,
					pdbFileName,
					guid: null,
					age
				};
			}
			return undefined;
		};
		peDebugDirectoryEntry = (optionalHeader) => {
			if (optionalHeader.length < 2) return undefined;
			const magic = optionalHeader.readUInt16LE(0);
			if (magic !== 267 && magic !== 523) return undefined;
			const directoryOffset = magic === 523 ? 112 : 96;
			const directoryCountOffset = directoryOffset - 4;
			if (optionalHeader.length < directoryCountOffset + 4) return undefined;
			const directoryCount = optionalHeader.readUInt32LE(directoryCountOffset);
			if (directoryCount <= 6) return undefined;
			const debugEntryOffset = directoryOffset + 6 * 8;
			if (optionalHeader.length < debugEntryOffset + 8) return undefined;
			const debugRva = optionalHeader.readUInt32LE(debugEntryOffset);
			const debugSize = optionalHeader.readUInt32LE(debugEntryOffset + 4);
			if (debugRva === 0 || debugSize < 28) return undefined;
			return {
				debugRva,
				debugSize,
				sizeOfHeaders: optionalHeader.readUInt32LE(60)
			};
		};
		peRvaToFileOffset = (rva, sectionTable, numberOfSections, sizeOfHeaders, size = 1) => {
			if (rva < sizeOfHeaders && size <= sizeOfHeaders - rva) return rva;
			for (let i = 0; i < numberOfSections; i++) {
				const offset = i * 40;
				if (sectionTable.length < offset + 40) break;
				const virtualAddress = sectionTable.readUInt32LE(offset + 12);
				const sizeOfRawData = sectionTable.readUInt32LE(offset + 16);
				const pointerToRawData = sectionTable.readUInt32LE(offset + 20);
				if (pointerToRawData > 0 && rva >= virtualAddress && rva - virtualAddress < sizeOfRawData && size <= sizeOfRawData - (rva - virtualAddress)) {
					return pointerToRawData + (rva - virtualAddress);
				}
			}
			return undefined;
		};
		parsePeCodeViewFromBuffer = (fileBytes, peOffset) => {
			if (fileBytes.length < peOffset + 24) return undefined;
			const numberOfSections = fileBytes.readUInt16LE(peOffset + 6);
			const optionalHeaderSize = fileBytes.readUInt16LE(peOffset + 20);
			if (optionalHeaderSize > 4096 || fileBytes.length < peOffset + 24 + optionalHeaderSize) return undefined;
			const optionalHeader = fileBytes.subarray(peOffset + 24, peOffset + 24 + optionalHeaderSize);
			const debugDir = peDebugDirectoryEntry(optionalHeader);
			if (debugDir === undefined) return undefined;
			const sectionTableOffset = peOffset + 24 + optionalHeaderSize;
			const sectionTableSize = numberOfSections * 40;
			if (fileBytes.length < sectionTableOffset + sectionTableSize) return undefined;
			const sectionTable = fileBytes.subarray(sectionTableOffset, sectionTableOffset + sectionTableSize);
			const debugFileOffset = peRvaToFileOffset(debugDir.debugRva, sectionTable, numberOfSections, debugDir.sizeOfHeaders, Math.min(debugDir.debugSize, 4096));
			if (debugFileOffset === undefined || fileBytes.length < debugFileOffset + 28) return undefined;
			const maxDebugBytes = Math.min(debugDir.debugSize, fileBytes.length - debugFileOffset);
			const numEntries = Math.floor(maxDebugBytes / 28);
			for (let j = 0; j < numEntries; j++) {
				const entryOffset = debugFileOffset + j * 28;
				const type = fileBytes.readUInt32LE(entryOffset + 12);
				if (type !== 2) continue;
				const sizeOfData = fileBytes.readUInt32LE(entryOffset + 16);
				let pointerToRawData = fileBytes.readUInt32LE(entryOffset + 24);
				if (pointerToRawData === 0) {
					const addressOfRawData = fileBytes.readUInt32LE(entryOffset + 20);
					const mapped = peRvaToFileOffset(addressOfRawData, sectionTable, numberOfSections, debugDir.sizeOfHeaders, Math.min(sizeOfData, 4096));
					if (mapped === undefined) continue;
					pointerToRawData = mapped;
				}
				if (sizeOfData < 16 || fileBytes.length < pointerToRawData + Math.min(sizeOfData, 24)) continue;
				const codeViewData = fileBytes.subarray(pointerToRawData, Math.min(fileBytes.length, pointerToRawData + sizeOfData));
				const parsed = parseCodeViewData(codeViewData, sizeOfData);
				if (parsed !== undefined) return parsed;
			}
			return undefined;
		};
		peManagedStatus = (optionalHeader, architecture) => {
			if (optionalHeader.length < 2) return err("truncated PE optional header");
			const magic = optionalHeader.readUInt16LE(0);
			const expectedMagic = architecture === "x86_64" || architecture === "arm64" ? 523 : 267;
			if (magic !== expectedMagic) return err("PE optional-header magic does not match its architecture");
			const directoryOffset = magic === 523 ? 112 : 96;
			const directoryCountOffset = directoryOffset - 4;
			if (optionalHeader.length < directoryCountOffset + 4) return err("truncated PE optional header");
			const directoryCount = optionalHeader.readUInt32LE(directoryCountOffset);
			const requiredBytes = directoryOffset + directoryCount * 8;
			if (!Number.isSafeInteger(requiredBytes) || requiredBytes > optionalHeader.length) return err("truncated PE data-directory table");
			if (directoryCount <= 14) return ok(false);
			const cliDirectory = directoryOffset + 14 * 8;
			return ok(optionalHeader.readUInt32LE(cliDirectory) !== 0 || optionalHeader.readUInt32LE(cliDirectory + 4) !== 0);
		};
		machArchitecture = (cpu) => {
			switch (cpu) {
				case 7: return "x86";
				case 16777223: return "x86_64";
				case 12: return "arm";
				case 16777228: return "arm64";
			}
			return undefined;
		};
		elfArchitecture = (machine) => {
			switch (machine) {
				case 3: return "x86";
				case 62: return "x86_64";
				case 8: return "mips";
				case 20: return "powerpc";
				case 40: return "arm";
				case 183: return "arm64";
				case 243: return "riscv";
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/application/BinaryTargetResolver.js
var XML_PLIST_PROBE_CHUNK_BYTES, parseBinaryTarget, classifyBinaryTargetFilesystemFailure, filesystemErrorCode, targetFailureReason, throwIfTargetResolutionCancelled, detectArtifactFormat, namedArtifactFormat, isArchiveFormat, sha256Handle, resolveAppBundle, readExecutableMetadata, readPeMetadata, readPeCodeView;
function init_BinaryTargetResolver() {
	return (init_BinaryTargetResolver = __esmMin((() => {
		init_configurationErrors();
		init_RegularFile();
		init_analysisErrorCore();
		init_result();
		init_MipsElfMetadata();
		init_AppBundleExecutable();
		init_dosCom();
		init_rawBinary();
		init_dosMz();
		init_appleArchiveFormat();
		init_zipPackageFormat();
		init_binaryTarget();
		XML_PLIST_PROBE_CHUNK_BYTES = 64 * 1024;
		parseBinaryTarget = async (input, options = {}) => {
			const cwd = options.cwd ?? process.cwd();
			const hostArchitecture = options.hostArchitecture ?? process.arch;
			const { targetKind, formatHint, signal, architecture, entryPoint } = options;
			const candidate = isAbsolute(input) ? input : resolve(cwd, input);
			try {
				throwIfTargetResolutionCancelled(signal);
				await access(candidate, constants.R_OK);
				throwIfTargetResolutionCancelled(signal);
				const canonical = await realpath(candidate);
				const sourcePath = process.platform === "win32" ? candidate : canonical;
				throwIfTargetResolutionCancelled(signal);
				const resolved = await resolveAppBundle(canonical);
				throwIfTargetResolutionCancelled(signal);
				if (!resolved.ok) return err(resolved.error);
				const { executable: path, infoPlist } = resolved.value;
				const bundle = infoPlist === undefined ? {} : { bundleInfoPlist: infoPlist };
				const handle = await openRegularFile(path, {
					symlinks: "reject",
					signal
				});
				try {
					throwIfTargetResolutionCancelled(signal);
					const metadata = await handle.stat();
					throwIfTargetResolutionCancelled(signal);
					if (formatHint === "raw-binary") {
						if (targetKind !== undefined && targetKind !== "executable") return err(new BinaryTargetError(path, "raw-binary format requires an executable target kind", { constraint: "load_selection_rejected" }));
						const admitted = admitRawBinary({
							architecture,
							entryPoint,
							fileBytes: metadata.size
						});
						if (!admitted.ok) return err(new BinaryTargetError(path, admitted.error.reason, { constraint: admitted.error.constraint }));
						return ok({
							path,
							sourcePath,
							sha256: await sha256Handle(handle, path, metadata, signal),
							kind: "executable",
							format: "raw-binary",
							architecture: admitted.value.architecture,
							availableArchitectures: [admitted.value.architecture],
							entryPoint: admitted.value.entryPoint,
							entryPointSource: admitted.value.entryPointSource
						});
					}
					const pairing = rawBinarySelectionError({
						...formatHint === undefined ? {} : { format: formatHint },
						architecture,
						entryPoint
					});
					if (pairing !== undefined) return err(new BinaryTargetError(path, pairing, { constraint: "load_selection_rejected" }));
					if (formatHint === "dos-com") {
						if (targetKind !== undefined && targetKind !== "executable") return err(new BinaryTargetError(path, "DOS COM format requires an executable target kind", { constraint: "load_selection_rejected" }));
						const length = validateDosComLength(metadata.size);
						if (!length.ok) return err(new BinaryTargetError(path, length.error, { constraint: "file_format_rejected" }));
						return ok({
							path,
							sourcePath,
							sha256: await sha256Handle(handle, path, metadata, signal),
							kind: "executable",
							format: "dos-com",
							architecture: "x86",
							availableArchitectures: ["x86"]
						});
					}
					const artifactFormat = targetKind === "database" ? undefined : await detectArtifactFormat(path, handle, signal);
					if (targetKind === "database" || targetKind === undefined && path.toLowerCase().endsWith(".hop")) return ok({
						path,
						sourcePath,
						sha256: await sha256Handle(handle, path, metadata, signal),
						kind: "database",
						format: "analysis-database"
					});
					if (artifactFormat !== undefined) {
						const identity = {
							path,
							sourcePath,
							sha256: await sha256Handle(handle, path, metadata, signal)
						};
						return isArchiveFormat(artifactFormat) ? ok({
							...identity,
							kind: "archive",
							format: artifactFormat
						}) : ok({
							...identity,
							kind: "artifact",
							format: artifactFormat
						});
					}
					const detected = await readExecutableMetadata(handle, hostArchitecture, signal);
					if (!detected.ok) return err(new BinaryTargetError(path, detected.error, { constraint: "file_format_rejected" }));
					return ok({
						path,
						sourcePath,
						...bundle,
						sha256: await sha256Handle(handle, path, metadata, signal),
						kind: "executable",
						...detected.value
					});
				} finally {
					await handle.close();
				}
			} catch (cause) {
				if (cause instanceof AnalysisCancelledError) return err(cause);
				if (signal?.aborted === true && cause === signal.reason) return err(new AnalysisCancelledError("resolve_binary_target", { cause }));
				if (cause instanceof BinaryTargetError) return err(cause);
				if (!(cause instanceof Error)) throw cause;
				const failure = classifyBinaryTargetFilesystemFailure(candidate, cause);
				if (failure === undefined) throw cause;
				return err(failure);
			}
		};
		classifyBinaryTargetFilesystemFailure = (path, cause) => {
			if (!(cause instanceof Error)) return undefined;
			const code = filesystemErrorCode(cause);
			return code === undefined ? undefined : new BinaryTargetError(path, targetFailureReason(code, cause.message), { cause });
		};
		filesystemErrorCode = (cause) => {
			const code = Reflect.get(cause, "code");
			return typeof code === "string" ? code : undefined;
		};
		targetFailureReason = (code, detail) => {
			switch (code) {
				case "ENOENT":
				case "ENOTDIR": return `target does not exist or a path component is not a directory: ${detail}`;
				case "EACCES":
				case "EPERM": return `permission denied while reading target: ${detail}`;
				case "EISDIR": return `target is a directory, not a readable file: ${detail}`;
				case "ENOTFILE": return "target is not a regular file";
				case "ELOOP": return `target changed while being opened: ${detail}`;
				default: return `target could not be read (${code}): ${detail}`;
			}
		};
		throwIfTargetResolutionCancelled = (signal) => {
			if (signal?.aborted === true) throw new AnalysisCancelledError("resolve_binary_target");
		};
		detectArtifactFormat = async (path, handle, signal) => {
			throwIfTargetResolutionCancelled(signal);
			const lower = path.toLowerCase();
			const magic = Buffer.alloc(4096);
			const observed = await handle.read(magic, 0, magic.length, 0);
			throwIfTargetResolutionCancelled(signal);
			if (observed.bytesRead >= 8 && magic.subarray(0, 8).equals(Buffer.from([
				0,
				97,
				115,
				109,
				1,
				0,
				0,
				0
			]))) throw new BinaryTargetError(path, "WebAssembly v1 artifacts are not supported by the native opening route", { constraint: "wasm_requires_static_inspection" });
			if (hasZipSignature(magic.subarray(0, observed.bytesRead))) {
				if (lower.endsWith(".app")) return "app-pack";
				return zipPackageFormatForPath(lower) ?? "zip";
			}
			if (hasBinaryPlistSignature(magic.subarray(0, observed.bytesRead))) return "plist";
			const named = namedArtifactFormat(lower);
			if (named !== undefined) return named;
			if (lower.endsWith(".pkg") && observed.bytesRead >= 4 && magic.subarray(0, 4).equals(Buffer.from("xar!"))) return "pkg";
			if (lower.endsWith(".dmg")) {
				throwIfTargetResolutionCancelled(signal);
				const size = (await handle.stat()).size;
				throwIfTargetResolutionCancelled(signal);
				if (size >= 512) {
					const trailer = Buffer.alloc(4);
					const read = await handle.read(trailer, 0, trailer.length, size - 512);
					throwIfTargetResolutionCancelled(signal);
					if (read.bytesRead === 4 && trailer.equals(Buffer.from("koly"))) return "dmg";
				}
			}
			const xmlProbe = createXmlPlistSignatureProbe();
			let xmlState = xmlProbe.write(magic.subarray(0, observed.bytesRead));
			if (xmlState === "matched") return "plist";
			const chunk = Buffer.alloc(XML_PLIST_PROBE_CHUNK_BYTES);
			let bytesRead = observed.bytesRead;
			while (xmlState === "pending" && bytesRead < 1048576) {
				throwIfTargetResolutionCancelled(signal);
				const read = await handle.read(chunk, 0, Math.min(chunk.length, MAX_XML_PLIST_PROBE_BYTES - bytesRead), bytesRead);
				throwIfTargetResolutionCancelled(signal);
				if (read.bytesRead === 0) break;
				bytesRead += read.bytesRead;
				xmlState = xmlProbe.write(chunk.subarray(0, read.bytesRead));
				if (xmlState === "matched") return "plist";
			}
			if (bytesRead === 1048576) {
				const { size } = await handle.stat();
				throwIfTargetResolutionCancelled(signal);
				if (size > bytesRead) throw new BinaryTargetError(path, "XML plist prolog was not found within the 1 MiB format probe limit", { constraint: "file_format_rejected" });
			}
			return undefined;
		};
		namedArtifactFormat = (lowerPath) => {
			if (lowerPath.endsWith(".asar")) return "asar";
			if (lowerPath.endsWith(".plist")) return "plist";
			if (lowerPath.endsWith(".map")) return "source-map";
			return /\.(?:m?js|cjs)$/u.test(lowerPath) ? "javascript" : undefined;
		};
		isArchiveFormat = (format) => isZipPackageFormat(format) || [
			"asar",
			"dmg",
			"pkg"
		].includes(format);
		sha256Handle = async (handle, path, initial, signal) => {
			const hash = createHash("sha256");
			const chunk = Buffer.allocUnsafe(64 * 1024);
			let position = 0;
			while (true) {
				throwIfTargetResolutionCancelled(signal);
				const observed = await handle.read(chunk, 0, Math.min(chunk.length, initial.size - position + 1), position);
				throwIfTargetResolutionCancelled(signal);
				if (observed.bytesRead === 0) break;
				hash.update(chunk.subarray(0, observed.bytesRead));
				position += observed.bytesRead;
				if (position > initial.size) throw new BinaryTargetError(path, "target grew while being read");
			}
			throwIfTargetResolutionCancelled(signal);
			const [opened, currentPath] = await Promise.all([handle.stat(), lstat(path)]);
			if (!sameRegularFileState(initial, opened) || !sameRegularFileState(initial, currentPath) || position !== initial.size) throw new BinaryTargetError(path, "target changed while being read");
			return hash.digest("hex");
		};
		resolveAppBundle = async (path) => {
			const metadata = await stat(path);
			if (!metadata.isDirectory()) return ok({ executable: path });
			if (extname(path).toLowerCase() !== ".app") return err(new BinaryTargetError(path, "this opening route requires a file or app bundle", { constraint: "directory_requires_file" }));
			return resolveAppBundleExecutable(path);
		};
		readExecutableMetadata = async (handle, hostArchitecture, signal) => {
			throwIfTargetResolutionCancelled(signal);
			const prefix = Buffer.alloc(4096);
			const prefixRead = await handle.read(prefix, 0, prefix.length, 0);
			throwIfTargetResolutionCancelled(signal);
			const bytes = prefix.subarray(0, prefixRead.bytesRead);
			const fileSize = (await handle.stat()).size;
			throwIfTargetResolutionCancelled(signal);
			if (bytes.length >= 2 && bytes[0] === 77 && bytes[1] === 90) {
				let windowsHeader = observeMzWindowsHeader(bytes, fileSize);
				let signatureBytes;
				if (windowsHeader.state === "signature-needed") {
					const { offset } = windowsHeader;
					const signature = Buffer.alloc(Math.min(4, fileSize - offset));
					const observedSignature = await handle.read(signature, 0, signature.length, offset);
					throwIfTargetResolutionCancelled(signal);
					signatureBytes = signature.subarray(0, observedSignature.bytesRead);
					windowsHeader = observeMzWindowsHeader(bytes, fileSize, signatureBytes);
				}
				if (windowsHeader.state === "declared") {
					if (windowsHeader.offset < 64) return err("invalid Windows new-header offset in MZ image");
					return readPeMetadata(handle, windowsHeader.offset, bytes, fileSize, signal);
				}
				const tableEnd = bytes.length >= 28 ? bytes.readUInt16LE(24) + bytes.readUInt16LE(6) * 4 : 0;
				const headerBytes = bytes.length >= 28 ? bytes.readUInt16LE(8) * 16 : 0;
				if (tableEnd > bytes.length && tableEnd <= headerBytes && tableEnd <= fileSize) {
					const table = Buffer.alloc(tableEnd);
					const observed = await handle.read(table, 0, table.length, 0);
					throwIfTargetResolutionCancelled(signal);
					return parseExecutableHeader(table.subarray(0, observed.bytesRead), hostArchitecture, fileSize);
				}
				return parseExecutableHeader(bytes, hostArchitecture, fileSize, signatureBytes);
			}
			if (bytes.length >= 8) {
				const magic = bytes.readUInt32BE(0);
				if ([3405691583, 3216703178].includes(magic)) {
					const little = magic === 3216703178;
					const count = little ? bytes.readUInt32LE(4) : bytes.readUInt32BE(4);
					const required = 8 + count * 32;
					if (count <= 128 && required > bytes.length) {
						const header = Buffer.alloc(required);
						const headerRead = await handle.read(header, 0, header.length, 0);
						throwIfTargetResolutionCancelled(signal);
						return parseExecutableHeader(header.subarray(0, headerRead.bytesRead), hostArchitecture, fileSize);
					}
				}
			}
			const parsed = parseExecutableHeader(bytes, hostArchitecture, fileSize);
			if (!parsed.ok || parsed.value.architecture !== "mips" || parsed.value.mips.elfClass !== 32) return parsed;
			const declarations = await readMipsElfMetadata(handle, parsed.value.mips, () => throwIfTargetResolutionCancelled(signal));
			if (!declarations.ok) return declarations;
			return ok({
				...parsed.value,
				mips: {
					...parsed.value.mips,
					abiFlags: declarations.value.abiFlags,
					gnuAttributes: declarations.value.gnuAttributes,
					...declarations.value.sharedLoad === undefined ? {} : { sharedLoad: declarations.value.sharedLoad },
					...declarations.value.limitations.length === 0 ? {} : { limitations: declarations.value.limitations }
				}
			});
		};
		readPeMetadata = async (handle, offset, mzPrefix, fileSize, signal) => {
			throwIfTargetResolutionCancelled(signal);
			const fileHeader = Buffer.alloc(24);
			const fileHeaderRead = await handle.read(fileHeader, 0, fileHeader.length, offset);
			throwIfTargetResolutionCancelled(signal);
			if (fileHeaderRead.bytesRead !== fileHeader.length) return err("invalid or truncated PE header");
			const windowsHeader = observeMzWindowsHeader(mzPrefix, fileSize, fileHeader.subarray(0, 4));
			if (windowsHeader.state !== "declared") return err("invalid Windows new-header signature in MZ image");
			if ([
				"NE",
				"LE",
				"LX"
			].includes(windowsHeader.signature)) return err(`unsupported ${windowsHeader.signature} executable in MZ image`);
			const optionalHeaderSize = fileHeader.readUInt16LE(20);
			if (optionalHeaderSize > 4096) return err("invalid PE optional header size");
			const numberOfSections = fileHeader.readUInt16LE(6);
			const record = Buffer.alloc(24 + optionalHeaderSize);
			const recordRead = await handle.read(record, 0, record.length, offset);
			throwIfTargetResolutionCancelled(signal);
			if (recordRead.bytesRead !== record.length) return err("invalid or truncated PE header");
			const codeView = await readPeCodeView(handle, offset, numberOfSections, record.subarray(24), optionalHeaderSize, signal);
			return parsePeRecord(record, codeView);
		};
		readPeCodeView = async (handle, peOffset, numberOfSections, optionalHeader, optionalHeaderSize, signal) => {
			throwIfTargetResolutionCancelled(signal);
			const debugDir = peDebugDirectoryEntry(optionalHeader);
			if (debugDir === undefined || numberOfSections > 96) return undefined;
			const sectionTableOffset = peOffset + 24 + optionalHeaderSize;
			const sectionTableSize = numberOfSections * 40;
			const sectionTable = Buffer.alloc(sectionTableSize);
			const sectionRead = await handle.read(sectionTable, 0, sectionTableSize, sectionTableOffset);
			throwIfTargetResolutionCancelled(signal);
			if (sectionRead.bytesRead !== sectionTableSize) return undefined;
			const debugFileOffset = peRvaToFileOffset(debugDir.debugRva, sectionTable, numberOfSections, debugDir.sizeOfHeaders, Math.min(debugDir.debugSize, 4096));
			if (debugFileOffset === undefined) return undefined;
			const maxDebugSize = Math.min(debugDir.debugSize, 4096);
			const debugDirectoryBuffer = Buffer.alloc(maxDebugSize);
			const debugDirRead = await handle.read(debugDirectoryBuffer, 0, maxDebugSize, debugFileOffset);
			throwIfTargetResolutionCancelled(signal);
			const numEntries = Math.floor(debugDirRead.bytesRead / 28);
			for (let j = 0; j < numEntries; j++) {
				const entryOffset = j * 28;
				const type = debugDirectoryBuffer.readUInt32LE(entryOffset + 12);
				if (type !== 2) continue;
				const sizeOfData = debugDirectoryBuffer.readUInt32LE(entryOffset + 16);
				let pointerToRawData = debugDirectoryBuffer.readUInt32LE(entryOffset + 24);
				if (pointerToRawData === 0) {
					const addressOfRawData = debugDirectoryBuffer.readUInt32LE(entryOffset + 20);
					const mapped = peRvaToFileOffset(addressOfRawData, sectionTable, numberOfSections, debugDir.sizeOfHeaders, Math.min(sizeOfData, 4096));
					if (mapped === undefined) continue;
					pointerToRawData = mapped;
				}
				if (sizeOfData < 16) continue;
				const maxCodeViewRead = Math.min(sizeOfData, 4096);
				const codeViewBuffer = Buffer.alloc(maxCodeViewRead);
				const codeViewRead = await handle.read(codeViewBuffer, 0, maxCodeViewRead, pointerToRawData);
				throwIfTargetResolutionCancelled(signal);
				const parsed = parseCodeViewData(codeViewBuffer.subarray(0, codeViewRead.bytesRead), sizeOfData);
				if (parsed !== undefined) return parsed;
			}
			return undefined;
		};
	})))();
}

//#endregion
export { classifyBinaryTargetFilesystemFailure, decodePeMachine, init_BinaryTargetResolver, init_binaryTarget, init_elfFixedHeader, init_peMachine, parseBinaryTarget, parseExecutableHeader, readElfFixedHeader };