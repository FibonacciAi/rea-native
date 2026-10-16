import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";
import { parse } from "plist";
import { DOMParser, normalizeLineEndings } from "@xmldom/xmldom";

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
export { decodeXmlText, init_plistValue, init_propertyListKeys, omitPrototypeKeys, omittedPrototypeKeysLimitation, parseXmlPropertyList, projectPlistValue };