import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_result, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";

//#region dist/domain/dosMz.js
var observeMzWindowsHeader, windowsHeaderSignature, parseDosMzHeader, validateRelocations;
function init_dosMz() {
	return (init_dosMz = __esmMin((() => {
		init_result();
		observeMzWindowsHeader = (bytes, fileSize = bytes.length, signatureAtOffset) => {
			if (bytes.length < 64) return fileSize >= 64 ? { state: "header-needed" } : { state: "absent" };
			const headerBytes = bytes.readUInt16LE(8) * 16;
			const relocationCount = bytes.readUInt16LE(6);
			const tableStart = bytes.readUInt16LE(24);
			if (headerBytes !== 0 && relocationCount > 0 && tableStart < 64 && tableStart + relocationCount * 4 > 60) return { state: "absent" };
			const offset = bytes.readUInt32LE(60);
			if (offset === 0) return { state: "absent" };
			const inlineSignature = offset < bytes.length ? bytes.subarray(offset, Math.min(offset + 4, bytes.length)) : undefined;
			const available = signatureAtOffset ?? inlineSignature;
			const signature = windowsHeaderSignature(available);
			if (headerBytes === 0 || headerBytes >= 64) return {
				state: "declared",
				offset,
				signature
			};
			if (signature !== "other" && signature !== "unobserved") return {
				state: "declared",
				offset,
				signature
			};
			if (signature === "other") return { state: "absent" };
			const observedPePrefix = available !== undefined && available.length >= 2 && available.toString("latin1", 0, 2) === "PE";
			if (fileSize - offset < (observedPePrefix ? 4 : 2)) return { state: "absent" };
			return {
				state: "signature-needed",
				offset
			};
		};
		windowsHeaderSignature = (bytes) => {
			if (bytes === undefined || bytes.length < 2) return "unobserved";
			const first = bytes[0];
			const second = bytes[1];
			if (first === 78 && second === 69) return "NE";
			if (first === 76 && second === 69) return "LE";
			if (first === 76 && second === 88) return "LX";
			if (first !== 80 || second !== 69) return "other";
			if (bytes.length < 4) return "unobserved";
			return bytes[2] === 0 && bytes[3] === 0 ? "PE" : "other";
		};
		parseDosMzHeader = (bytes, fileSize = bytes.length, signatureAtOffset) => {
			if (bytes.length < 28 || bytes.toString("latin1", 0, 2) !== "MZ") return err("invalid or truncated DOS MZ header");
			if (!Number.isSafeInteger(fileSize) || fileSize < bytes.length) return err("invalid DOS MZ file length");
			const windowsHeader = observeMzWindowsHeader(bytes, fileSize, signatureAtOffset);
			if (windowsHeader.state === "declared") return err("MZ declares a Windows new header; it is not a DOS-only image");
			if (windowsHeader.state === "signature-needed") return err("MZ Windows new-header signature is outside the bounded prefix");
			const lastPageBytes = bytes.readUInt16LE(2);
			const pages = bytes.readUInt16LE(4);
			if (pages === 0 || lastPageBytes > 511) return err("invalid DOS MZ page count or final-page size");
			const imageBytes = (pages - 1) * 512 + (lastPageBytes === 0 ? 512 : lastPageBytes);
			const headerBytes = bytes.readUInt16LE(8) * 16;
			if (headerBytes < 28 || headerBytes >= imageBytes) return err("invalid DOS MZ header size or empty load module");
			if (imageBytes > fileSize) return err("truncated DOS MZ load module");
			const relocationCount = bytes.readUInt16LE(6);
			const relocationTableOffset = bytes.readUInt16LE(24);
			const tableEnd = relocationTableOffset + relocationCount * 4;
			if (relocationCount > 0 && (relocationTableOffset < 28 || tableEnd > headerBytes)) return err("DOS MZ relocation table lies outside its header");
			if (relocationCount > 0 && tableEnd > bytes.length) return err("truncated DOS MZ relocation table");
			if (windowsHeader.state === "header-needed") return err("MZ Windows new-header pointer is outside the bounded prefix");
			const moduleBytes = imageBytes - headerBytes;
			const relocations = validateRelocations(bytes, relocationTableOffset, relocationCount, moduleBytes);
			if (!relocations.ok) return relocations;
			const entryOffset = bytes.readUInt16LE(20);
			const entrySegment = bytes.readUInt16LE(22);
			if (entrySegment * 16 + entryOffset >= moduleBytes) return err("DOS MZ entry point lies outside its initialized load module");
			return ok({
				headerBytes,
				imageBytes,
				moduleBytes,
				overlayBytes: fileSize - imageBytes,
				relocationCount,
				relocationTableOffset,
				entrySegment,
				entryOffset
			});
		};
		validateRelocations = (bytes, relocationTableOffset, relocationCount, moduleBytes) => {
			for (let index = 0; index < relocationCount; index += 1) {
				const record = relocationTableOffset + index * 4;
				const offset = bytes.readUInt16LE(record);
				const segment = bytes.readUInt16LE(record + 2);
				if (segment * 16 + offset + 2 > moduleBytes) return err(`DOS MZ relocation ${index} points outside its load module`);
			}
			return ok(undefined);
		};
	})))();
}

//#endregion
//#region dist/domain/apple/appleArchiveFormat.js
var BINARY_PLIST_MAGIC, NIB_ARCHIVE_MAGIC, MAX_XML_PLIST_PROBE_BYTES, hasBinaryPlistSignature, createXmlPlistSignatureProbe, hasXmlPlistSignature, createXmlPlistPrologScanner, tokenAt, isXmlWhitespace, hasNibArchiveSignature;
function init_appleArchiveFormat() {
	return (init_appleArchiveFormat = __esmMin((() => {
		BINARY_PLIST_MAGIC = [
			98,
			112,
			108,
			105,
			115,
			116,
			48,
			48
		];
		NIB_ARCHIVE_MAGIC = [
			78,
			73,
			66,
			65,
			114,
			99,
			104,
			105,
			118,
			101
		];
		MAX_XML_PLIST_PROBE_BYTES = 1024 * 1024;
		hasBinaryPlistSignature = (bytes) => BINARY_PLIST_MAGIC.every((byte, index) => bytes[index] === byte);
		createXmlPlistSignatureProbe = () => {
			let state = "pending";
			let preview;
			let validator;
			let utf16 = false;
			let bomBytes = 0;
			let fedBytes = 0;
			let decodedBytes = 0;
			let preamble = new Uint8Array();
			const scanner = createXmlPlistPrologScanner();
			const encodedLength = (text) => utf16 ? text.length * 2 : new TextEncoder().encode(text).length;
			return {
				get state() {
					return state;
				},
				write(bytes) {
					if (state !== "pending" || bytes.length === 0) return state;
					let selected = bytes.subarray(0, MAX_XML_PLIST_PROBE_BYTES - fedBytes - preamble.length);
					if (preview === undefined) {
						if (preamble.length !== 0 || selected.length < 4) {
							const joined = new Uint8Array(preamble.length + selected.length);
							joined.set(preamble);
							joined.set(selected, preamble.length);
							selected = joined;
							if (selected.length < 4) {
								preamble = selected;
								return state;
							}
							preamble = new Uint8Array();
						}
						const little = selected[0] === 255 && selected[1] === 254;
						const big = selected[0] === 254 && selected[1] === 255;
						utf16 = little || big;
						bomBytes = utf16 ? 2 : selected[0] === 239 && selected[1] === 187 && selected[2] === 191 ? 3 : 0;
						const encoding = little ? "utf-16le" : big ? "utf-16be" : "utf-8";
						preview = new TextDecoder(encoding);
						validator = new TextDecoder(encoding, { fatal: true });
					}
					const text = preview.decode(selected, { stream: true });
					const result = scanner(text);
					const through = result.state === "matched" ? bomBytes + decodedBytes + encodedLength(text.slice(0, result.consumed)) - fedBytes : selected.length;
					try {
						validator.decode(selected.subarray(0, through), { stream: true });
						state = result.state;
					} catch {
						state = "rejected";
					}
					decodedBytes += encodedLength(text);
					fedBytes += selected.length;
					if (fedBytes === 1048576 && state === "pending") state = "rejected";
					return state;
				}
			};
		};
		hasXmlPlistSignature = (bytes) => createXmlPlistSignatureProbe().write(bytes) === "matched";
		createXmlPlistPrologScanner = () => {
			let text = "";
			let totalCharacters = 0;
			let pending;
			let doctypeName = false;
			return (chunk) => {
				const before = totalCharacters;
				totalCharacters += chunk.length;
				text += chunk;
				let cursor = 0;
				const result = (state, through = cursor) => ({
					state,
					consumed: totalCharacters - text.length + through - before
				});
				while (true) {
					if (pending !== undefined) {
						const end = text.indexOf(pending, cursor);
						if (end < 0) {
							text = text.slice(Math.max(cursor, text.length - pending.length + 1));
							return result("pending");
						}
						cursor = end + pending.length;
						pending = undefined;
					}
					while (cursor < text.length && isXmlWhitespace(text[cursor])) cursor++;
					if (cursor === text.length) {
						text = "";
						return result("pending");
					}
					if (doctypeName) {
						const token = tokenAt(text, cursor, "plist");
						if (token === "partial" || token === "match" && cursor + 5 === text.length) {
							text = text.slice(cursor);
							return result("pending");
						}
						const delimiter = text[cursor + 5];
						return result(token === "match" && (delimiter === ">" || delimiter === "[" || delimiter !== undefined && isXmlWhitespace(delimiter)) ? "matched" : "rejected", cursor + 6);
					}
					for (const [token, terminator] of [["<!--", "-->"], ["<?", "?>"]]) {
						const match = tokenAt(text, cursor, token);
						if (match === "partial") {
							text = text.slice(cursor);
							return result("pending");
						}
						if (match === "match") {
							pending = terminator;
							cursor += token.length;
							break;
						}
					}
					if (pending !== undefined) continue;
					const doctype = tokenAt(text, cursor, "<!DOCTYPE");
					if (doctype === "partial" || doctype === "match" && cursor + 9 === text.length) {
						text = text.slice(cursor);
						return result("pending");
					}
					if (doctype === "match") {
						if (!isXmlWhitespace(text[cursor + 9])) return result("rejected");
						cursor += 10;
						doctypeName = true;
						continue;
					}
					const root = tokenAt(text, cursor, "<plist");
					if (root === "partial" || root === "match" && cursor + 6 === text.length) {
						text = text.slice(cursor);
						return result("pending");
					}
					const delimiter = text[cursor + 6];
					return result(root === "match" && (delimiter === "/" || delimiter === ">" || delimiter !== undefined && isXmlWhitespace(delimiter)) ? "matched" : "rejected", cursor + 7);
				}
			};
		};
		tokenAt = (text, offset, token) => {
			const available = text.slice(offset, offset + token.length);
			return available === token ? "match" : token.startsWith(available) ? "partial" : "none";
		};
		isXmlWhitespace = (character) => character === " " || character === "	" || character === "\r" || character === "\n";
		hasNibArchiveSignature = (bytes) => NIB_ARCHIVE_MAGIC.every((byte, index) => bytes[index] === byte);
	})))();
}

//#endregion
export { MAX_XML_PLIST_PROBE_BYTES, createXmlPlistSignatureProbe, hasBinaryPlistSignature, hasNibArchiveSignature, hasXmlPlistSignature, init_appleArchiveFormat, init_dosMz, observeMzWindowsHeader, parseDosMzHeader };