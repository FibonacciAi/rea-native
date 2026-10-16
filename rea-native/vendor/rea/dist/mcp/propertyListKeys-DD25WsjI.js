import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { constants } from "node:fs";
import { z } from "zod";
import { constants as constants$1 } from "node:os";
import { lstat, open, stat } from "node:fs/promises";
import { DOMParser, normalizeLineEndings } from "@xmldom/xmldom";
import { parse } from "plist";

//#region dist/domain/apple/machoContainer.js
var FAT_MAGIC, FAT_MAGIC_64, FAT_CIGAM, FAT_CIGAM_64, MAX_FAT_ARCHITECTURES, KNOWN_MACHO_CPU_TYPES, MACHO_HEADER_MAGICS, readFatContainerHeader, classifyFatContainerIdentity, readFatSliceDeclarations, validateFatSlice, inspectFatSliceRange, validateFatSliceIdentity, safeNumber;
function init_machoContainer() {
	return (init_machoContainer = __esmMin((() => {
		FAT_MAGIC = 3405691582;
		FAT_MAGIC_64 = 3405691583;
		FAT_CIGAM = 3199925962;
		FAT_CIGAM_64 = 3216703178;
		MAX_FAT_ARCHITECTURES = 128;
		KNOWN_MACHO_CPU_TYPES = [
			7,
			16777223,
			12,
			16777228,
			33554444,
			18,
			16777234
		];
		MACHO_HEADER_MAGICS = [
			4277009102,
			4277009103,
			3472551422,
			3489328638
		];
		readFatContainerHeader = (bytes, fileSize) => {
			if (bytes.byteLength < 4) return { state: "not-fat" };
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const magic = view.getUint32(0, false);
			if (![
				FAT_MAGIC,
				FAT_MAGIC_64,
				FAT_CIGAM,
				FAT_CIGAM_64
			].includes(magic)) return { state: "not-fat" };
			if (!Number.isSafeInteger(fileSize) || fileSize < bytes.byteLength) return {
				state: "malformed",
				reason: "FAT file size is invalid or contradicts retained bytes"
			};
			if (bytes.byteLength < 8) {
				return fileSize < 8 ? {
					state: "malformed",
					reason: "FAT header is truncated"
				} : {
					state: "needs-data",
					requiredBytes: 8
				};
			}
			const littleEndian = magic === FAT_CIGAM || magic === FAT_CIGAM_64;
			const wide = magic === FAT_MAGIC_64 || magic === FAT_CIGAM_64;
			const count = view.getUint32(4, littleEndian);
			if (count === 0) return {
				state: "malformed",
				reason: "FAT header declares no architectures"
			};
			if (count > MAX_FAT_ARCHITECTURES) return { state: "not-fat" };
			const tableEnd = 8 + count * (wide ? 32 : 20);
			if (tableEnd > fileSize) return { state: "not-fat" };
			if (tableEnd > bytes.byteLength) return {
				state: "needs-data",
				requiredBytes: tableEnd
			};
			const declarations = readFatSliceDeclarations(bytes.subarray(8, tableEnd), {
				count,
				wide,
				littleEndian
			});
			return declarations.status === "parsed" ? {
				state: "parsed",
				magic,
				count,
				wide,
				littleEndian,
				tableEnd,
				slices: declarations.slices,
				rangeIssues: declarations.slices.map((slice) => inspectFatSliceRange(slice, fileSize, tableEnd))
			} : {
				state: "malformed",
				reason: declarations.reason
			};
		};
		classifyFatContainerIdentity = (header, sliceHeaderAt) => {
			const hasKnownCpu = header.slices.some(({ cpuType }) => KNOWN_MACHO_CPU_TYPES.includes(cpuType));
			const invalidRange = header.rangeIssues.find((issue) => issue !== null);
			if (hasKnownCpu) return invalidRange === undefined ? { state: "mach-o" } : {
				state: "malformed",
				...invalidRange
			};
			const validRanges = header.slices.filter((_slice, index) => header.rangeIssues[index] === null);
			const missingHeaders = [];
			let observedMachO = false;
			for (const slice of validRanges) {
				const magic = sliceHeaderAt(slice.offset);
				if (magic === undefined) missingHeaders.push(slice.offset);
				else if (magic !== null && MACHO_HEADER_MAGICS.includes(magic)) observedMachO = true;
			}
			if (observedMachO) {
				return invalidRange === undefined ? { state: "mach-o" } : {
					state: "malformed",
					...invalidRange
				};
			}
			if (missingHeaders.length > 0) return {
				state: "needs-slice-header",
				offsets: missingHeaders
			};
			return { state: "not-mach-o" };
		};
		readFatSliceDeclarations = (tableBytes, options) => {
			const { count, wide, littleEndian } = options;
			const entrySize = wide ? 32 : 20;
			if (tableBytes.byteLength < count * entrySize) return {
				status: "malformed",
				reason: "FAT table is truncated"
			};
			const view = new DataView(tableBytes.buffer, tableBytes.byteOffset, tableBytes.byteLength);
			const slices = [];
			for (let index = 0; index < count; index++) {
				const base = index * entrySize;
				const offset = wide ? safeNumber(view.getBigUint64(base + 8, littleEndian)) : view.getUint32(base + 8, littleEndian);
				const size = wide ? safeNumber(view.getBigUint64(base + 16, littleEndian)) : view.getUint32(base + 12, littleEndian);
				if (offset === null || size === null) return {
					status: "malformed",
					reason: "FAT offset or size exceeds the safe range"
				};
				slices.push({
					index,
					offset,
					size,
					alignmentExponent: view.getUint32(base + (wide ? 24 : 16), littleEndian),
					cpuType: view.getUint32(base, littleEndian),
					cpuSubtype: view.getUint32(base + 4, littleEndian)
				});
			}
			return {
				status: "parsed",
				slices
			};
		};
		validateFatSlice = (declaration, containerSize, tableEnd, embedded) => {
			const rangeIssue = inspectFatSliceRange(declaration, containerSize, tableEnd);
			if (rangeIssue !== null) return rangeIssue.reason;
			return embedded === undefined ? null : validateFatSliceIdentity(declaration, embedded);
		};
		inspectFatSliceRange = (declaration, containerSize, tableEnd) => {
			const { index, offset, size, alignmentExponent } = declaration;
			if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || size <= 0 || offset < tableEnd) return {
				category: "malformed",
				reason: `FAT architecture ${index} has an invalid slice range`
			};
			if (offset > containerSize || size > containerSize - offset) return {
				category: "malformed",
				reason: `FAT architecture ${index} slice range extends beyond the file`
			};
			if (!Number.isInteger(alignmentExponent) || alignmentExponent < 0 || alignmentExponent > 52) return {
				category: "unsupported",
				reason: `FAT architecture ${index} alignment exponent ${alignmentExponent} is unsupported`
			};
			if (offset % 2 ** alignmentExponent !== 0) return {
				category: "malformed",
				reason: `FAT architecture ${index} offset is not aligned to 2^${alignmentExponent}`
			};
			return null;
		};
		validateFatSliceIdentity = (declaration, embedded) => embedded.cpuType === declaration.cpuType && embedded.cpuSubtype === declaration.cpuSubtype ? null : `FAT architecture ${declaration.index} CPU type/subtype disagrees with its Mach-O header`;
		safeNumber = (value) => value > BigInt(Number.MAX_SAFE_INTEGER) ? null : Number(value);
	})))();
}

//#endregion
//#region dist/filesystem/OwnedFileHandle.js
var OwnedFileHandle;
function init_OwnedFileHandle() {
	return (init_OwnedFileHandle = __esmMin((() => {
		OwnedFileHandle = class {
			handle;
			#state = { kind: "open" };
			constructor(handle) {
				this.handle = handle;
			}
			/** Close the owned handle, retaining an unconfirmed close as a sticky failure. */
			close() {
				if (this.#state.kind === "closed") return Promise.resolve();
				if (this.#state.kind === "closing") return this.#state.attempt;
				if (this.#state.kind === "failed") return Promise.reject(this.#state.cause);
				if (this.handle.fd < 0) {
					const cause = new Error("File handle was invalidated before this owner confirmed its close");
					this.#state = {
						kind: "failed",
						cause
					};
					return Promise.reject(cause);
				}
				const attempt = Promise.resolve().then(() => this.#attemptClose());
				this.#state = {
					kind: "closing",
					attempt
				};
				return attempt;
			}
			async #attemptClose() {
				try {
					await this.handle.close();
					this.#state = { kind: "closed" };
				} catch (cause) {
					this.#state = this.handle.fd < 0 ? {
						kind: "failed",
						cause
					} : { kind: "open" };
					throw cause;
				}
			}
		};
	})))();
}

//#endregion
//#region dist/filesystem/RegularFile.js
var NonRegularFileReadError, RegularFileAdmissionFailure, RegularFileChangedError, openRegularFile, nonRegularOpenFailure, errnos, UNOPENABLE_FILE_TYPE_ERRNOS, isUnopenableFileTypeError, sameRegularFileState;
function init_RegularFile() {
	return (init_RegularFile = __esmMin((() => {
		init_OwnedFileHandle();
		NonRegularFileReadError = class extends Error {
			path;
			code;
			constructor(path, directory) {
				super(`Selected input must be a regular file: ${path}`);
				this.path = path;
				this.name = "NonRegularFileReadError";
				this.code = directory ? "EISDIR" : "ENOTFILE";
			}
		};
		RegularFileAdmissionFailure = class extends Error {
			path;
			cleanupCause;
			owner;
			cause;
			constructor(path, admissionCause, cleanupCause, owner) {
				super(`Selected input failed admission and its descriptor close failed: ${path}`);
				this.path = path;
				this.cleanupCause = cleanupCause;
				this.owner = owner;
				this.name = "RegularFileAdmissionFailure";
				this.cause = admissionCause;
			}
		};
		RegularFileChangedError = class extends Error {
			path;
			code = "ESTALE";
			constructor(path) {
				super(`Selected input changed while being read: ${path}`);
				this.path = path;
				this.name = "RegularFileChangedError";
			}
		};
		openRegularFile = async (path, options) => {
			options.signal?.throwIfAborted();
			const handle = await open(path, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0) | (constants.O_NOCTTY ?? 0) | (options.symlinks === "reject" ? constants.O_NOFOLLOW ?? 0 : 0)).catch(async (cause) => {
				const nonRegular = await nonRegularOpenFailure(path, options.symlinks, cause);
				if (nonRegular === undefined) throw cause;
				options.signal?.throwIfAborted();
				throw nonRegular;
			});
			const owner = new OwnedFileHandle(handle);
			try {
				options.signal?.throwIfAborted();
				const metadata = await handle.stat();
				options.signal?.throwIfAborted();
				if (!metadata.isFile()) throw new NonRegularFileReadError(path, metadata.isDirectory());
				if (options.symlinks === "reject" && (constants.O_NOFOLLOW ?? 0) === 0) {
					const named = await lstat(path);
					options.signal?.throwIfAborted();
					if (named.isSymbolicLink()) throw new NonRegularFileReadError(path, false);
					if (!sameRegularFileState(metadata, named)) throw new RegularFileChangedError(path);
				}
				return handle;
			} catch (cause) {
				try {
					await owner.close();
				} catch (cleanupCause) {
					throw new RegularFileAdmissionFailure(path, cause, cleanupCause, owner);
				}
				throw cause;
			}
		};
		nonRegularOpenFailure = async (path, symlinks, cause) => {
			if (!isUnopenableFileTypeError(cause)) return undefined;
			const metadata = await (symlinks === "reject" ? lstat : stat)(path).catch(() => undefined);
			if (metadata === undefined || metadata.isFile()) return undefined;
			return new NonRegularFileReadError(path, metadata.isDirectory());
		};
		errnos = constants$1.errno;
		UNOPENABLE_FILE_TYPE_ERRNOS = new Set([
			errnos.ENXIO,
			errnos.EOPNOTSUPP,
			errnos.ENOTSUP
		].flatMap((errno) => errno === undefined ? [] : [-errno]));
		isUnopenableFileTypeError = (cause) => cause instanceof Error && "errno" in cause && typeof cause.errno === "number" && UNOPENABLE_FILE_TYPE_ERRNOS.has(cause.errno);
		sameRegularFileState = (expected, observed) => observed.isFile() && expected.dev === observed.dev && expected.ino === observed.ino && expected.size === observed.size && expected.mode === observed.mode && ("mtimeNs" in expected && "mtimeNs" in observed ? expected.mtimeNs === observed.mtimeNs && expected.ctimeNs === observed.ctimeNs : expected.mtimeMs === observed.mtimeMs && expected.ctimeMs === observed.ctimeMs);
	})))();
}

//#endregion
//#region dist/domain/apple/plistValue.js
var MAX_PLIST_DEPTH, projectPlistValue;
function init_plistValue() {
	return (init_plistValue = __esmMin((() => {
		MAX_PLIST_DEPTH = 128;
		projectPlistValue = (value) => {
			let unknownRealCount = 0;
			const project = (item, depth) => {
				if (depth > 128) throw new RangeError(`Plist exceeds ${String(128)} nesting levels`);
				if (item instanceof Uint8Array) return {
					$plist_type: "data",
					base64: Buffer.from(item).toString("base64")
				};
				if (item instanceof Date) return {
					$plist_type: "date",
					iso8601: item.toISOString()
				};
				if (typeof item === "number" && !Number.isFinite(item)) {
					unknownRealCount += 1;
					return {
						$plist_type: "real",
						value: null
					};
				}
				if (Array.isArray(item)) return item.map((entry) => project(entry, depth + 1));
				if (item !== null && typeof item === "object") return Object.fromEntries(Object.entries(item).map(([key, entry]) => [key, project(entry, depth + 1)]));
				return z.union([
					z.string(),
					z.number(),
					z.boolean(),
					z.null()
				]).parse(item);
			};
			const projected = project(value, 0);
			return {
				value: projected,
				unknownRealCount
			};
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListKeys.js
var PROTOTYPE_KEY, omittedPrototypeKeysLimitation, withoutKey, omitPrototypeKeys, XML_ENTITIES, decodeXmlText, parseXmlPropertyList, consumeOpenStepSeparator, admitsOpenStepCloser, assertOpenStepDepthWithinLimit, skipOpenStepTrivia, skipOpenStepScalar, PLIST_CONTAINER_ELEMENTS, assertXmlPlistDepthWithinLimit, substitutePrototypeKeys;
function init_propertyListKeys() {
	return (init_propertyListKeys = __esmMin((() => {
		init_plistValue();
		PROTOTYPE_KEY = "__proto__";
		omittedPrototypeKeysLimitation = (count) => count === null ? "Dictionary entries keyed __proto__ were omitted because REA results cannot represent that key." : `${String(count)} dictionary ${count === 1 ? "entry" : "entries"} keyed __proto__ ${count === 1 ? "was" : "were"} omitted because REA results cannot represent that key.`;
		withoutKey = (value, key) => {
			let omitted = 0;
			const strip = (item) => {
				if (Array.isArray(item)) return item.map(strip);
				if (item === null || typeof item !== "object" || item instanceof Date || item instanceof Uint8Array) return item;
				return Object.fromEntries(Object.entries(item).flatMap(([name, entry]) => {
					if (name !== key) return [[name, strip(entry)]];
					omitted += 1;
					return [];
				}));
			};
			const stripped = strip(value);
			return {
				value: stripped,
				omittedPrototypeKeys: omitted
			};
		};
		omitPrototypeKeys = (value) => withoutKey(value, PROTOTYPE_KEY);
		XML_ENTITIES = {
			amp: "&",
			apos: "'",
			gt: ">",
			lt: "<",
			quot: "\""
		};
		decodeXmlText = (text) => text.replace(/&(?:#x([\da-f]+)|#(\d+)|([a-z]+));/giu, (entity, hex, decimal, name) => {
			const codePoint = hex !== undefined ? parseInt(hex, 16) : decimal !== undefined ? parseInt(decimal, 10) : undefined;
			if (codePoint !== undefined) return codePoint <= 1114111 ? String.fromCodePoint(codePoint) : entity;
			return (name === undefined ? undefined : XML_ENTITIES[name]) ?? entity;
		});
		parseXmlPropertyList = (text) => {
			const first = text.trimStart()[0];
			if (first === "{" || first === "(") {
				assertOpenStepDepthWithinLimit(text);
				return omitPrototypeKeys(parse(text));
			}
			const normalized = normalizeLineEndings(text);
			const document = new DOMParser().parseFromString(normalized, "text/xml");
			assertXmlPlistDepthWithinLimit(document);
			const { substituted, placeholder } = substitutePrototypeKeys(normalized, document);
			return withoutKey(parse(substituted), placeholder);
		};
		consumeOpenStepSeparator = (parent, character) => {
			if (parent?.next === "after-value") {
				parent.next = "key";
				return character === ";" ? "consumed" : "none";
			}
			if (parent?.next !== "equals" && parent?.next !== "separator") return "none";
			if (character !== (parent.next === "equals" ? "=" : ",")) return "invalid";
			parent.next = "value";
			return "consumed";
		};
		admitsOpenStepCloser = (parent, character) => parent?.end === character && parent.next !== "equals" && !(parent.end === "}" && parent.next === "value");
		assertOpenStepDepthWithinLimit = (text) => {
			const containers = [];
			const completeValue = () => {
				const parent = containers.at(-1);
				if (parent !== undefined) parent.next = parent.next === "key" ? "equals" : parent.end === "}" ? "after-value" : "separator";
			};
			const assertDepth = () => {
				if (containers.length > 128) throw new RangeError(`Plist exceeds ${String(128)} nesting levels`);
			};
			let cursor = 0;
			while (cursor < text.length) {
				const afterTrivia = skipOpenStepTrivia(text, cursor);
				if (afterTrivia !== cursor) {
					cursor = afterTrivia;
					continue;
				}
				const character = text[cursor] ?? "";
				const parent = containers.at(-1);
				if (character === "}" || character === ")") {
					if (!admitsOpenStepCloser(parent, character)) return;
					containers.pop();
					if (containers.length === 0) return;
					completeValue();
					cursor += 1;
					continue;
				}
				const separator = consumeOpenStepSeparator(parent, character);
				if (separator === "invalid") return;
				if (separator === "consumed") {
					cursor += 1;
					continue;
				}
				if (character === "{" || character === "(") {
					assertDepth();
					containers.push({
						end: character === "{" ? "}" : ")",
						next: character === "{" ? "key" : "value"
					});
					cursor += 1;
					continue;
				}
				const end = skipOpenStepScalar(text, cursor);
				if (end === cursor) return;
				if (parent?.next !== "key") assertDepth();
				cursor = end;
				completeValue();
			}
		};
		skipOpenStepTrivia = (text, cursor) => {
			if (/\s/u.test(text[cursor] ?? "")) return cursor + 1;
			if (!text.startsWith("//", cursor) && !text.startsWith("/*", cursor)) return cursor;
			const line = text[cursor + 1] === "/";
			const end = text.indexOf(line ? "\n" : "*/", cursor + 2);
			return end === -1 ? text.length : end + (line ? 1 : 2);
		};
		skipOpenStepScalar = (text, start) => {
			let cursor = start;
			const character = text[cursor];
			if (character === "\"") {
				cursor += 1;
				while (cursor < text.length) {
					const next = text[cursor];
					cursor += next === "\\" ? 2 : 1;
					if (next === "\"") break;
				}
			} else if (character === "<") {
				const end = text.indexOf(">", cursor + 1);
				cursor = end === -1 ? text.length : end + 1;
			} else {
				while (cursor < text.length && /[a-zA-Z0-9._/$:-]/u.test(text[cursor] ?? "")) cursor += 1;
			}
			return cursor;
		};
		PLIST_CONTAINER_ELEMENTS = new Set([
			"plist",
			"dict",
			"array"
		]);
		assertXmlPlistDepthWithinLimit = (document) => {
			const root = document.documentElement;
			if (root === null) return;
			const pending = [{
				node: root,
				depth: -1
			}];
			while (pending.length > 0) {
				const entry = pending.pop();
				if (entry === undefined) break;
				const { node, depth } = entry;
				if (node.nextSibling !== null) pending.push({
					node: node.nextSibling,
					depth
				});
				if (node.nodeType !== node.ELEMENT_NODE) continue;
				if (node.nodeName !== "key" && depth > 128) throw new RangeError(`Plist exceeds ${String(128)} nesting levels`);
				if (PLIST_CONTAINER_ELEMENTS.has(node.nodeName) && node.firstChild !== null) pending.push({
					node: node.firstChild,
					depth: depth + 1
				});
			}
		};
		substitutePrototypeKeys = (text, document) => {
			const keys = Array.from(document.getElementsByTagName("key"));
			const decodedKeys = new Set(keys.map((key) => key.firstChild?.nodeValue));
			let placeholder = "__rea_prototype_key__";
			while (decodedKeys.has(placeholder)) placeholder = `_${placeholder}`;
			const omitted = keys.map((key) => key.firstChild).filter((node) => node?.nodeValue === PROTOTYPE_KEY);
			if (omitted.length === 0) return {
				substituted: text,
				placeholder
			};
			let line = 1;
			let lineStart = 0;
			const parts = [];
			let cursor = 0;
			for (const node of omitted) {
				const nodeLine = node?.lineNumber;
				const column = node?.columnNumber;
				if (nodeLine === undefined || column === undefined) throw new TypeError("XML plist key has no source location");
				while (line < nodeLine) {
					const newline = text.indexOf("\n", lineStart);
					if (newline === -1) throw new TypeError("XML plist key has an invalid source location");
					lineStart = newline + 1;
					line += 1;
				}
				const offset = lineStart + column - 1;
				parts.push(text.slice(cursor, offset), `<![CDATA[${placeholder}]]>`);
				cursor = offset;
			}
			parts.push(text.slice(cursor));
			return {
				substituted: parts.join(""),
				placeholder
			};
		};
	})))();
}

//#endregion
export { init_machoContainer as _, parseXmlPropertyList as a, validateFatSlice as b, NonRegularFileReadError as c, init_RegularFile as d, openRegularFile as f, classifyFatContainerIdentity as g, init_OwnedFileHandle as h, omittedPrototypeKeysLimitation as i, RegularFileAdmissionFailure as l, OwnedFileHandle as m, init_propertyListKeys as n, init_plistValue as o, sameRegularFileState as p, omitPrototypeKeys as r, projectPlistValue as s, decodeXmlText as t, RegularFileChangedError as u, readFatContainerHeader as v, validateFatSliceIdentity as x, readFatSliceDeclarations as y };