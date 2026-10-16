import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";

//#region dist/domain/jsonSerialization.js
/** Encode ordinary JSON as bounded string parts without a document-sized allocation. */
function* jsonParts(value, pretty = false) {
	yield* encodeValue(value, pretty, false);
}
/** Encode validated JSON with canonical key ordering without allocating the whole document. */
function* canonicalJsonParts(value) {
	yield* encodeValue(value, false, true);
}
/** Buffer JSON parts while preserving complete UTF-16 surrogate pairs. */
function* bufferedJsonParts(parts) {
	let buffer = "";
	for (const part of parts) {
		if (buffer.length + part.length > 64 * 1024 && buffer !== "") {
			yield buffer;
			buffer = "";
		}
		buffer += part;
	}
	if (buffer !== "") yield buffer;
}
function* encodeString(value) {
	if (value.length <= 8192) {
		yield JSON.stringify(value);
		return;
	}
	yield "\"";
	for (let start = 0; start < value.length;) {
		let end = Math.min(start + 8192, value.length);
		const last = value.charCodeAt(end - 1);
		const next = value.charCodeAt(end);
		if (end < value.length && last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end -= 1;
		yield JSON.stringify(value.slice(start, end)).slice(1, -1);
		start = end;
	}
	yield "\"";
}
/**
* Encode iteratively into bounded parts. Recursive `yield*` delegation passed
* every token through one generator frame per nesting level, which dominated
* the cost of writing large nested results.
*/
function* encodeValue(root, pretty, canonical) {
	const ancestors = new Set();
	const stack = [];
	let buffer = "";
	let pending = root;
	let hasPending = true;
	while (true) {
		if (hasPending) {
			hasPending = false;
			const text = scalarText(pending);
			if (text !== undefined) buffer += text;
			else if (typeof pending === "string") {
				if (buffer !== "") yield buffer;
				buffer = "";
				yield* encodeString(pending);
			} else {
				const frame = openContainer(pending, stack.length, ancestors, canonical);
				stack.push(frame);
				buffer += frame.array ? "[" : "{";
			}
		}
		if (buffer.length >= PART_CHARACTERS) {
			yield buffer;
			buffer = "";
		}
		const frame = stack.at(-1);
		if (frame === undefined) break;
		const member = nextMember(frame);
		if (member === undefined) {
			if (pretty && frame.written > 0) buffer += indent(frame.depth);
			buffer += frame.array ? "]" : "}";
			ancestors.delete(frame.value);
			stack.pop();
			continue;
		}
		if (frame.written > 0) buffer += ",";
		if (pretty) buffer += indent(frame.depth + 1);
		if (member.key !== undefined) {
			const key = scalarText(member.key);
			if (key !== undefined) buffer += key;
			else {
				if (buffer !== "") yield buffer;
				buffer = "";
				yield* encodeString(member.key);
			}
			buffer += pretty ? ": " : ":";
		}
		frame.written += 1;
		pending = member.item;
		hasPending = true;
	}
	if (buffer !== "") yield buffer;
}
var PART_CHARACTERS, indentation, indent, scalarText, openContainer, nextMember;
function init_jsonSerialization() {
	return (init_jsonSerialization = __esmMin((() => {
		PART_CHARACTERS = 16 * 1024;
		indentation = [];
		indent = (depth) => indentation[depth] ??= `\n${"  ".repeat(depth)}`;
		scalarText = (value) => {
			if (typeof value === "string") return value.length <= 8192 ? JSON.stringify(value) : undefined;
			if (value === null) return "null";
			if (typeof value === "boolean") return String(value);
			if (typeof value === "number" && Number.isFinite(value)) return String(value);
			return undefined;
		};
		openContainer = (value, depth, ancestors, canonical) => {
			if (typeof value !== "object" || value === null) throw new TypeError("JSON output requires ordinary JSON values");
			if (ancestors.has(value)) throw new TypeError("JSON output contains a circular reference");
			const array = Array.isArray(value);
			if (!array && Object.prototype.toString.call(value) !== "[object Object]") throw new TypeError("JSON output requires ordinary JSON objects");
			ancestors.add(value);
			const keys = array ? undefined : Object.keys(value);
			if (canonical) keys?.sort();
			const count = array ? value.length : keys?.length ?? 0;
			return {
				value,
				array,
				keys,
				count,
				depth,
				index: 0,
				written: 0
			};
		};
		nextMember = (frame) => {
			while (frame.index < frame.count) {
				const index = frame.index;
				frame.index += 1;
				if (frame.array) return {
					key: undefined,
					item: Reflect.get(frame.value, index)
				};
				const key = frame.keys?.[index];
				if (key === undefined) throw new TypeError("JSON object changed during serialization");
				const item = Reflect.get(frame.value, key);
				if (item !== undefined && typeof item !== "function" && typeof item !== "symbol") return {
					key,
					item
				};
			}
			return undefined;
		};
	})))();
}

//#endregion
export { jsonParts as i, canonicalJsonParts as n, init_jsonSerialization as r, bufferedJsonParts as t };