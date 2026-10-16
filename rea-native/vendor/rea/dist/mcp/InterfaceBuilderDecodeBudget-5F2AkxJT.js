import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, g as init_result, h as err } from "./analysisErrorCore-DXRTvF_m.js";
import { Xt as init_analysisProfile, Yt as createAnalysisProfile } from "./nativeValueTrace-DR9UE62L.js";

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
//#region dist/application/InvestigationProviders.js
var REA_WORKFLOW_PROVIDER, workflowAnalysisProfile, ARTIFACT_GRAPH_PROVIDER, MANAGED_STATIC_PROVIDER, PE_RESOURCES_PROVIDER, MANAGED_WORKFLOW_PROVIDER, APPLE_APPLICATION_PROVIDER, ANDROID_APPLICATION_PROVIDER, HARMONY_APPLICATION_PROVIDER, WEB_SCRIPT_EXPORT_PROVIDER, JAVASCRIPT_APPLICATION_PROVIDER, JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, ANALYSIS_VIEW_PROVIDER, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, ARTIFACT_COMPARISON_PROVIDER, FUNCTION_COMPARISON_PROVIDER, BUNDLE_COMPARISON_PROVIDER, CHANGED_BEHAVIOR_PROVIDER, CALL_PATH_PROVIDER, STATIC_RUNTIME_PROVIDER, RECONSTRUCTION_PROVIDER;
function init_InvestigationProviders() {
	return (init_InvestigationProviders = __esmMin((() => {
		init_analysisProfile();
		REA_WORKFLOW_PROVIDER = {
			id: "rea-workflow",
			name: "REA composed investigation workflow",
			version: "1"
		};
		workflowAnalysisProfile = (upstream, operation) => createAnalysisProfile(REA_WORKFLOW_PROVIDER, {
			upstream_analysis_profile: upstream,
			...operation === "binary_overview" ? { workflow_revision: 3 } : operation === "batch_decompile" || operation === "get_call_graph" || operation === "trace_feature" ? { workflow_revision: 2 } : {}
		});
		ARTIFACT_GRAPH_PROVIDER = Object.freeze({
			id: "rea-artifact-graph",
			name: "REA safe artifact graph provider",
			version: "1"
		});
		MANAGED_STATIC_PROVIDER = Object.freeze({
			id: "rea-dotnet-static",
			name: "REA managed static analysis provider",
			version: "1"
		});
		PE_RESOURCES_PROVIDER = Object.freeze({
			id: "rea-pe-resources",
			name: "REA PE resource parser",
			version: "1"
		});
		MANAGED_WORKFLOW_PROVIDER = {
			id: "rea-dotnet-workflows",
			name: "REA managed-code workflows",
			version: "1"
		};
		APPLE_APPLICATION_PROVIDER = {
			id: "rea-apple-application",
			name: "REA Apple application workflows",
			version: "1"
		};
		ANDROID_APPLICATION_PROVIDER = {
			id: "rea-android-application",
			name: "REA Android application workflows",
			version: "1"
		};
		HARMONY_APPLICATION_PROVIDER = {
			id: "rea-harmony-application",
			name: "REA HarmonyOS application workflows",
			version: "1"
		};
		WEB_SCRIPT_EXPORT_PROVIDER = {
			id: "rea-web-script-export",
			name: "REA captured script export",
			version: "1"
		};
		JAVASCRIPT_APPLICATION_PROVIDER = {
			id: "rea-javascript-application",
			name: "REA JavaScript application analyzer",
			version: "1"
		};
		JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER = {
			id: "rea-javascript-runtime-reconciliation",
			name: "REA JavaScript runtime reconciliation",
			version: "1"
		};
		ANALYSIS_VIEW_PROVIDER = {
			id: "rea-analysis-view",
			name: "REA analysis view projection",
			version: "1"
		};
		JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER = {
			id: "rea-javascript-application-workflows",
			name: "REA JavaScript application workflows",
			version: "1"
		};
		ARTIFACT_COMPARISON_PROVIDER = {
			id: "rea-artifact-comparison",
			name: "REA artifact comparison",
			version: "1"
		};
		FUNCTION_COMPARISON_PROVIDER = {
			id: "rea-function-comparison",
			name: "REA function comparison",
			version: "1"
		};
		BUNDLE_COMPARISON_PROVIDER = {
			id: "rea-bundle-comparison",
			name: "REA Evidence bundle comparison",
			version: "1"
		};
		CHANGED_BEHAVIOR_PROVIDER = {
			id: "rea-changed-behavior",
			name: "REA changed behavior investigation",
			version: "1"
		};
		CALL_PATH_PROVIDER = {
			id: "rea-call-path",
			name: "REA call path reconstruction",
			version: "1"
		};
		STATIC_RUNTIME_PROVIDER = {
			id: "rea-static-runtime-correlation",
			name: "REA static/runtime correlation",
			version: "1"
		};
		RECONSTRUCTION_PROVIDER = {
			id: "rea-reconstruction-verifier",
			name: "REA reconstruction verifier",
			version: "1"
		};
	})))();
}

//#endregion
//#region dist/domain/propertyListXmlText.js
var XmlPlistTextDecodeError, decodeXmlPlistText;
function init_propertyListXmlText() {
	return (init_propertyListXmlText = __esmMin((() => {
		XmlPlistTextDecodeError = class extends TypeError {
			reason;
			declaredEncoding;
			constructor(reason, message, declaredEncoding, options) {
				super(message, options);
				this.reason = reason;
				this.declaredEncoding = declaredEncoding;
				this.name = "XmlPlistTextDecodeError";
			}
		};
		decodeXmlPlistText = (bytes) => {
			const encoding = bytes[0] === 255 && bytes[1] === 254 ? "utf-16le" : bytes[0] === 254 && bytes[1] === 255 ? "utf-16be" : "utf-8";
			let text;
			try {
				text = new TextDecoder(encoding, { fatal: true }).decode(bytes);
			} catch (cause) {
				throw new XmlPlistTextDecodeError("invalid-bytes", "XML text bytes are invalid for the detected encoding", undefined, { cause });
			}
			const declaration = /^<\?xml\s[^?]*\bencoding\s*=\s*["']([^"']+)["']/u.exec(text)?.[1];
			const declared = declaration?.toLowerCase();
			if (declared !== undefined && ![
				"utf-8",
				"utf-16",
				"utf-16le",
				"utf-16be"
			].includes(declared)) throw new XmlPlistTextDecodeError("unsupported-encoding", `Unsupported XML encoding declaration: ${declaration}. Supported encodings are UTF-8 and BOM-marked UTF-16 in either byte order.`, declaration);
			if (declared !== undefined && declared !== encoding && !(encoding !== "utf-8" && declared === "utf-16")) throw new XmlPlistTextDecodeError("encoding-mismatch", "XML encoding declaration disagrees with its bytes", declaration);
			return text;
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
//#region dist/artifacts/apple/InterfaceBuilderDecodeBudget.js
/** Consume each XML span once; malformed tokens cannot restart suffix scans. */
function* xmlPreflightTokens(xml) {
	let cursor = 0;
	while (cursor < xml.length) {
		const start = xml.indexOf("<", cursor);
		if (start < 0) return;
		const opaqueEnd = xml.startsWith("<!--", start) ? "-->" : xml.startsWith("<![CDATA[", start) ? "]]>" : xml.startsWith("<?", start) ? "?>" : undefined;
		if (opaqueEnd !== undefined) {
			const end = xml.indexOf(opaqueEnd, start + 2);
			if (end < 0) return;
			cursor = end + opaqueEnd.length;
			continue;
		}
		const doctype = /^<!DOCTYPE\b/iu.test(xml.slice(start, start + 10));
		const element = /^<\/?[A-Za-z]/u.test(xml.slice(start, start + 4));
		let quote;
		let internalSubset = false;
		let end = start + 1;
		for (; end < xml.length; end += 1) {
			const character = xml[end];
			if (quote !== undefined) {
				if (character === quote) quote = undefined;
			} else if (character === "\"" || character === "'") quote = character;
			else if (character === ">") break;
			else if (doctype && character === "[") internalSubset = true;
		}
		if (end === xml.length) return;
		cursor = end + 1;
		if (doctype || element) yield {
			doctype,
			internalSubset,
			closing: xml[start + 1] === "/",
			selfClosing: xml[end - 1] === "/"
		};
	}
}
var InterfaceBuilderDecodeBudgetExceeded, InterfaceBuilderDecodeBudget, preflightPropertyListDecode, estimateXmlPlistExpansion, interfaceBuilderBudgetFailure, PROTOTYPE_KEY, estimateBinaryPlistExpansion;
function init_InterfaceBuilderDecodeBudget() {
	return (init_InterfaceBuilderDecodeBudget = __esmMin((() => {
		init_propertyListXmlText();
		init_appleArchiveFormat();
		InterfaceBuilderDecodeBudgetExceeded = class extends Error {
			reason;
			constructor(reason, message) {
				super(message);
				this.reason = reason;
				this.name = "InterfaceBuilderDecodeBudgetExceeded";
			}
		};
		InterfaceBuilderDecodeBudget = class {
			#initialBytes;
			#remainingBytes;
			constructor(maxBytes) {
				this.#initialBytes = maxBytes;
				this.#remainingBytes = maxBytes;
			}
			/** Representation bytes still available for the current inspection. */
			get remainingBytes() {
				return this.#remainingBytes;
			}
			/** Representation bytes reserved so far. */
			get usedBytes() {
				return this.#initialBytes - this.#remainingBytes;
			}
			/** Reserve representation bytes before allocation, or report exhaustion. */
			reserve(bytes, message) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remainingBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", message);
				this.#remainingBytes -= bytes;
			}
			/** Reserve an upper bound for one JSON-serialized string occurrence. */
			reserveJsonStringOccurrence(value) {
				this.reserve(value.length * 6 + 2, "projected JSON strings exceed the aggregate Interface Builder decode budget");
			}
			/** Reserve the exact JSON string length for a base64 value from Buffer. */
			reserveBase64JsonStringOccurrence(value) {
				this.reserve(value.length + 2, "projected NIB base64 values exceed the aggregate Interface Builder decode budget");
			}
			/** Reserve an upper bound for one JSON object property name occurrence. */
			reserveJsonPropertyNameOccurrence(value) {
				this.reserve(value.length * 6 + 3, "projected JSON property names exceed the aggregate Interface Builder decode budget");
			}
			/** Reserve bytes for an optional projection without throwing on exhaustion. */
			tryReserve(bytes) {
				if (!Number.isSafeInteger(bytes) || bytes < 0 || bytes > this.#remainingBytes) return false;
				this.#remainingBytes -= bytes;
				return true;
			}
		};
		preflightPropertyListDecode = (bytes, maxBytes, xmlText) => {
			const expansion = hasBinaryPlistSignature(bytes) ? estimateBinaryPlistExpansion(bytes, maxBytes) : {
				estimatedBytes: estimateXmlPlistExpansion(bytes, maxBytes, xmlText),
				binaryPrototypeKeyObserved: false
			};
			if (expansion.estimatedBytes > maxBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "plist representation exceeds the aggregate Interface Builder decode budget");
			return expansion;
		};
		estimateXmlPlistExpansion = (bytes, maxBytes, xmlText) => {
			const xml = xmlText ?? decodeXmlPlistText(bytes);
			const decodedSourceBytes = xml.length * 2;
			let elementCount = 0;
			let xmlDepth = 0;
			for (const token of xmlPreflightTokens(xml)) {
				if (token.doctype) {
					if (token.internalSubset) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "XML plist internal entity expansion exceeds the aggregate Interface Builder decode budget");
					continue;
				}
				elementCount += 1;
				if (token.closing) xmlDepth -= 1;
				else if (!token.selfClosing) {
					xmlDepth += 1;
					if (xmlDepth > 128) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "XML plist nesting exceeds the aggregate Interface Builder decode budget");
				}
				if (decodedSourceBytes * 2 + elementCount * 128 > maxBytes) return maxBytes + 1;
			}
			return decodedSourceBytes * 2 + elementCount * 128;
		};
		interfaceBuilderBudgetFailure = (_kind, message) => new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", message);
		PROTOTYPE_KEY = "__proto__";
		estimateBinaryPlistExpansion = (bytes, maxBytes, { budget = "the aggregate Interface Builder decode budget", fail = interfaceBuilderBudgetFailure, bounds = "strict" } = {}) => {
			if (bytes.length < 40) throw new TypeError("binary plist trailer is truncated");
			const trailer = bytes.length - 32;
			const offsetSize = bytes[trailer + 6] ?? 0;
			const referenceSize = bytes[trailer + 7] ?? 0;
			if (![
				1,
				2,
				4,
				8
			].includes(offsetSize) || ![
				1,
				2,
				4,
				8
			].includes(referenceSize)) throw new TypeError("binary plist trailer integer sizes are invalid");
			const readInteger = (offset, size) => {
				if (offset < 0 || size < 1 || offset + size > bytes.length) return -1;
				let value = 0;
				for (let index = 0; index < size; index += 1) value = value * 256 + (bytes[offset + index] ?? 0);
				return Number.isSafeInteger(value) ? value : -1;
			};
			const objectCount = readInteger(trailer + 8, 8);
			const topObject = readInteger(trailer + 16, 8);
			const offsetTable = readInteger(trailer + 24, 8);
			const tableEnd = bounds === "strict" ? trailer : bytes.length;
			const objectsEnd = bounds === "strict" ? offsetTable : bytes.length;
			if (objectCount < 1 || topObject < 0 || topObject >= objectCount || offsetTable < 8 || offsetTable + objectCount * offsetSize > tableEnd) throw new TypeError("binary plist trailer or object table is invalid");
			let estimate = bytes.length * 2 + objectCount * 16;
			let binaryPrototypeKeyObserved = false;
			if (estimate > maxBytes) throw fail("expansion", `binary plist object table exceeds ${budget}`);
			const active = new Set();
			const pending = [{
				object: topObject,
				depth: 0,
				exit: false,
				dictionaryKey: false
			}];
			let pendingObjectCount = 1;
			while (pending.length > 0) {
				const entry = pending.pop();
				if (entry === undefined) break;
				if (entry.exit) {
					active.delete(entry.object);
					continue;
				}
				pendingObjectCount -= 1;
				if (entry.depth > 128) throw fail("depth", `binary plist nesting exceeds ${budget}`);
				if (active.has(entry.object)) throw fail("cycle", `binary plist reference cycle exceeds ${budget}`);
				estimate += 96;
				if (estimate > maxBytes) throw fail("expansion", `binary plist reference expansion exceeds ${budget}`);
				const offset = readInteger(offsetTable + entry.object * offsetSize, offsetSize);
				if (offset < 8 || offset >= objectsEnd) throw new TypeError("binary plist object offset is invalid");
				const marker = bytes[offset] ?? 0;
				const type = marker >> 4;
				if (entry.dictionaryKey && type !== 5 && type !== 6) throw new TypeError("binary plist dictionary key is not a string");
				let size = marker & 15;
				let cursor = offset + 1;
				if (size === 15 && type !== 0 && type !== 8) {
					const extMarker = bytes[cursor] ?? 0;
					if (extMarker >> 4 !== 1 || (extMarker & 15) > 3) throw new TypeError("binary plist extended object size is invalid");
					cursor += 1;
					const integerSize = 1 << (extMarker & 15);
					size = readInteger(cursor, integerSize);
					cursor += integerSize;
					if (size < 0 || cursor > objectsEnd) throw new TypeError("binary plist extended object size is invalid");
				}
				if (type === 4 || type === 5 || type === 6) {
					const byteLength = type === 6 ? size * 2 : size;
					if (cursor + byteLength > objectsEnd) throw new TypeError("binary plist scalar object is truncated");
					if (!binaryPrototypeKeyObserved && entry.dictionaryKey && (type === 5 || type === 6) && size === PROTOTYPE_KEY.length) {
						let matches = true;
						for (let index = 0; index < PROTOTYPE_KEY.length; index += 1) {
							const codeUnit = type === 5 ? bytes[cursor + index] ?? 0 : (bytes[cursor + index * 2] ?? 0) << 8 | (bytes[cursor + index * 2 + 1] ?? 0);
							if (codeUnit !== PROTOTYPE_KEY.charCodeAt(index)) {
								matches = false;
								break;
							}
						}
						if (matches) binaryPrototypeKeyObserved = true;
					}
					estimate += type === 4 ? size + 4 * Math.ceil(size / 3) : byteLength * 2;
					if (estimate > maxBytes) throw fail("expansion", `binary plist scalar expansion exceeds ${budget}`);
					continue;
				}
				if (type !== 10 && type !== 13) continue;
				const childCount = type === 13 ? size * 2 : size;
				const refsEnd = cursor + childCount * referenceSize;
				if (!Number.isSafeInteger(refsEnd) || refsEnd > objectsEnd) throw new TypeError("binary plist reference table is truncated");
				const availableNodes = Math.floor((maxBytes - estimate) / 96);
				if (childCount > availableNodes - pendingObjectCount) throw fail("expansion", `binary plist reference expansion exceeds ${budget}`);
				active.add(entry.object);
				pending.push({
					object: entry.object,
					depth: entry.depth,
					exit: true,
					dictionaryKey: false
				});
				for (let index = childCount - 1; index >= 0; index -= 1) {
					const reference = readInteger(cursor + index * referenceSize, referenceSize);
					if (reference < 0 || reference >= objectCount) throw new TypeError("binary plist reference is invalid");
					pending.push({
						object: reference,
						depth: entry.depth + 1,
						exit: false,
						dictionaryKey: type === 13 && index < size
					});
				}
				pendingObjectCount += childCount;
			}
			return {
				estimatedBytes: estimate,
				binaryPrototypeKeyObserved
			};
		};
	})))();
}

//#endregion
export { REA_WORKFLOW_PROVIDER as A, HARMONY_APPLICATION_PROVIDER as C, MANAGED_STATIC_PROVIDER as D, JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER as E, workflowAnalysisProfile as F, init_dosMz as I, observeMzWindowsHeader as L, STATIC_RUNTIME_PROVIDER as M, WEB_SCRIPT_EXPORT_PROVIDER as N, MANAGED_WORKFLOW_PROVIDER as O, init_InvestigationProviders as P, parseDosMzHeader as R, FUNCTION_COMPARISON_PROVIDER as S, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER as T, ARTIFACT_COMPARISON_PROVIDER as _, preflightPropertyListDecode as a, CALL_PATH_PROVIDER as b, hasBinaryPlistSignature as c, init_appleArchiveFormat as d, decodeXmlPlistText as f, APPLE_APPLICATION_PROVIDER as g, ANDROID_APPLICATION_PROVIDER as h, init_InterfaceBuilderDecodeBudget as i, RECONSTRUCTION_PROVIDER as j, PE_RESOURCES_PROVIDER as k, hasNibArchiveSignature as l, ANALYSIS_VIEW_PROVIDER as m, InterfaceBuilderDecodeBudgetExceeded as n, MAX_XML_PLIST_PROBE_BYTES as o, init_propertyListXmlText as p, estimateBinaryPlistExpansion as r, createXmlPlistSignatureProbe as s, InterfaceBuilderDecodeBudget as t, hasXmlPlistSignature as u, ARTIFACT_GRAPH_PROVIDER as v, JAVASCRIPT_APPLICATION_PROVIDER as w, CHANGED_BEHAVIOR_PROVIDER as x, BUNDLE_COMPARISON_PROVIDER as y };