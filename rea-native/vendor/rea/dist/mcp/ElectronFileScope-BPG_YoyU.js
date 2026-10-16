import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as admitAsarHeader, r as init_AsarHeader, t as MAX_ASAR_HEADER_BYTES } from "./AsarHeader-WsPgoooH.js";
import { isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { open, realpath, stat } from "node:fs/promises";

//#region dist/browser/ElectronFileScope.js
var authorizedElectronFile, authorizedAsarMember, MAX_CACHED_HEADERS, headerCache, archiveIdentity, asarFiles, isAsarRegularFile, isRecord;
function init_ElectronFileScope() {
	return (init_ElectronFileScope = __esmMin((() => {
		init_AsarHeader();
		authorizedElectronFile = async (value) => {
			if (/%(?:2f|5c)/iu.test(value)) return undefined;
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (url.protocol !== "file:" || url.hostname !== "" || url.username !== "" || url.password !== "") return undefined;
			let path;
			try {
				path = fileURLToPath(url);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (!isAbsolute(path) || path.includes("\0")) return undefined;
			try {
				if ((await stat(path)).isFile()) return await realpath(path);
			} catch (cause) {
				void cause;
			}
			return await authorizedAsarMember(path);
		};
		authorizedAsarMember = async (path) => {
			const segments = path.split(sep);
			for (let index = 1; index < segments.length - 1; index += 1) {
				if (!(segments[index] ?? "").toLowerCase().endsWith(".asar")) continue;
				const archive = segments.slice(0, index + 1).join(sep);
				const member = segments.slice(index + 1);
				if (member.some((part) => part === "" || part === "." || part === "..")) return undefined;
				try {
					const metadata = await stat(archive);
					if (!metadata.isFile()) continue;
					const canonical = await realpath(archive);
					const files = await asarFiles(canonical, metadata);
					return isAsarRegularFile(files, member) ? join(canonical, ...member) : undefined;
				} catch (cause) {
					void cause;
					return undefined;
				}
			}
			return undefined;
		};
		MAX_CACHED_HEADERS = 8;
		headerCache = new Map();
		archiveIdentity = (metadata) => `${String(metadata.dev)}:${String(metadata.ino)}:${String(metadata.size)}:${String(metadata.mtimeMs)}`;
		asarFiles = async (archive, metadata) => {
			const identity = archiveIdentity(metadata);
			const cached = headerCache.get(archive);
			if (cached?.identity === identity) return cached.files;
			const handle = await open(archive, "r");
			let files;
			let jsonBytes;
			try {
				const opened = await handle.stat();
				if (!opened.isFile() || archiveIdentity(opened) !== identity) throw new Error("ASAR identity changed before header read");
				const admitted = await admitAsarHeader(handle);
				jsonBytes = admitted.jsonBytes;
				const json = Buffer.alloc(jsonBytes);
				let offset = 0;
				while (offset < json.length) {
					const part = await handle.read(json, offset, json.length - offset, 16 + offset);
					if (part.bytesRead === 0) throw new Error("Truncated ASAR JSON header");
					offset += part.bytesRead;
				}
				if (archiveIdentity(await handle.stat()) !== identity) throw new Error("ASAR identity changed during header read");
				const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(json));
				if (!isRecord(parsed) || !isRecord(parsed.files)) throw new Error("ASAR header has no file tree");
				files = parsed.files;
			} finally {
				await handle.close();
			}
			headerCache.delete(archive);
			headerCache.set(archive, {
				identity,
				files,
				bytes: jsonBytes
			});
			const retainedBytes = () => [...headerCache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
			while (headerCache.size > MAX_CACHED_HEADERS || retainedBytes() > 16777216) headerCache.delete(headerCache.keys().next().value ?? archive);
			return files;
		};
		isAsarRegularFile = (files, member) => {
			let node = { files };
			for (const part of member) {
				const children = isRecord(node) ? node.files : undefined;
				if (!isRecord(children) || !Object.hasOwn(children, part)) return false;
				node = children[part];
			}
			return isRecord(node) && typeof node.size === "number" && !("files" in node) && !("link" in node);
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
	})))();
}

//#endregion
export { init_ElectronFileScope as n, authorizedElectronFile as t };