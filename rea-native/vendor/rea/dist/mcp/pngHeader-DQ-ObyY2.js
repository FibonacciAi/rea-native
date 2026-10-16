import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { posix } from "node:path";
import { domainToASCII, fileURLToPath, pathToFileURL } from "node:url";
import { z } from "zod";
import { TraceMap } from "@jridgewell/trace-mapping";

//#region dist/domain/javascript/javascriptSourceMapPaths.js
var javascriptSourceMapReferenceSchema, resolveJavaScriptSourceMapReferences, resolveJavaScriptSourceMapUrl, resolveSourceMapUrls, resolveJavaScriptSourceMapPath, unusableHost, carriesUsableHost, windowsFileUrl, decodedUrlPath;
function init_javascriptSourceMapPaths() {
	return (init_javascriptSourceMapPaths = __esmMin((() => {
		javascriptSourceMapReferenceSchema = z.strictObject({
			source_name: z.string(),
			source_root: z.string().nullable(),
			map_path: z.string().min(1),
			resolution: z.discriminatedUnion("kind", [z.strictObject({
				kind: z.enum(["artifact-relative", "suffix"]),
				path: z.string().min(1)
			}), z.strictObject({
				kind: z.literal("unresolved"),
				reason: z.string().min(1)
			})])
		});
		resolveJavaScriptSourceMapReferences = (sourceNames, sourceRoot, mapPath) => {
			if (sourceNames.length === 0) return [];
			const resolvedSources = resolveSourceMapUrls(sourceNames.map((sourceName) => sourceName ?? ""), sourceRoot, "");
			return sourceNames.map((sourceName, index) => {
				if (sourceName === null) return null;
				const reference = resolvedSources[index];
				if (reference === undefined) throw new TypeError(`TraceMap did not resolve source declaration ${String(index)}`);
				return {
					source_name: sourceName,
					source_root: sourceRoot,
					map_path: mapPath,
					resolution: resolveJavaScriptSourceMapPath(reference, mapPath)
				};
			});
		};
		resolveJavaScriptSourceMapUrl = (source, sourceRoot, mapUrl) => {
			const resolved = resolveSourceMapUrls([source ?? ""], sourceRoot, mapUrl)[0];
			if (resolved === undefined) throw new TypeError("TraceMap did not resolve its single source declaration");
			return resolved;
		};
		resolveSourceMapUrls = (sources, sourceRoot, mapUrl) => new TraceMap({
			version: 3,
			names: [],
			sources,
			...sourceRoot == null ? {} : { sourceRoot },
			mappings: ""
		}, mapUrl).resolvedSources;
		resolveJavaScriptSourceMapPath = (source, mapPath) => {
			const portable = source.replaceAll("\\", "/");
			const windowsPath = /^[a-z]:\//iu.test(portable) || source.startsWith("\\\\");
			const anchor = `/${"source/".repeat(portable.split("/").length + 1)}`;
			const directory = posix.join(anchor, posix.dirname(mapPath));
			const base = pathToFileURL(`${directory}/`, { windows: false });
			const absolute = windowsPath ? windowsFileUrl(source) : URL.parse(source);
			const resolved = windowsPath ? absolute : URL.parse(source, base);
			if (resolved === null) return {
				kind: "unresolved",
				reason: "Source reference is not a valid URL or filesystem path."
			};
			if (!resolved.pathname.startsWith("/")) return {
				kind: "unresolved",
				reason: "Source reference uses a non-hierarchical URL without a file pathname."
			};
			if (resolved.pathname.endsWith("/")) return {
				kind: "unresolved",
				reason: "Source reference names a directory rather than a file."
			};
			const declaredPath = windowsPath ? absolute?.pathname ?? "" : URL.parse(source, "file:///")?.pathname ?? "";
			if (/%(?:2f|5c)/iu.test(declaredPath)) return {
				kind: "unresolved",
				reason: "Source reference contains an encoded path separator."
			};
			const relative = absolute === null ? !portable.startsWith("/") : absolute.href !== resolved.href;
			const path = decodedUrlPath(resolved);
			if (path === null) return {
				kind: "unresolved",
				reason: "Source reference has malformed URL encoding or an invalid file URL."
			};
			const value = relative ? posix.relative(anchor, path) : path.replace(/^\/+/, "");
			if (value === "" || value === ".." || value.startsWith("../")) return {
				kind: "unresolved",
				reason: "Source reference resolves outside the inventoried artifact."
			};
			return {
				path: value,
				kind: relative ? "artifact-relative" : "suffix"
			};
		};
		unusableHost = /[\0\t\n\r #/:<>?@[\\\]^|%]/u;
		carriesUsableHost = (host) => !unusableHost.test(host) && domainToASCII(host) !== "";
		windowsFileUrl = (path) => {
			if (path.startsWith("\\\\") && !carriesUsableHost(path.slice(2).split("\\")[0] ?? "")) return null;
			try {
				return pathToFileURL(path, { windows: true });
			} catch (cause) {
				if (cause instanceof TypeError) return null;
				throw cause;
			}
		};
		decodedUrlPath = (url) => {
			try {
				if (url.protocol === "file:") {
					const windows = url.hostname !== "" && url.hostname !== "localhost";
					const path = fileURLToPath(url, { windows });
					return windows ? path.replaceAll("\\", "/") : path;
				}
				return `${url.host}${decodeURIComponent(url.pathname)}`;
			} catch (cause) {
				if (cause instanceof URIError || cause instanceof TypeError) return null;
				throw cause;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/pngHeader.js
var PNG_SIGNATURE, IHDR_TYPE, readPngHeaderDimensions;
function init_pngHeader() {
	return (init_pngHeader = __esmMin((() => {
		PNG_SIGNATURE = Buffer.from([
			137,
			80,
			78,
			71,
			13,
			10,
			26,
			10
		]);
		IHDR_TYPE = Buffer.from("IHDR");
		readPngHeaderDimensions = (bytes) => {
			if (bytes.byteLength < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE) || bytes.readUInt32BE(8) !== 13 || !bytes.subarray(12, 16).equals(IHDR_TYPE)) return undefined;
			const width = bytes.readUInt32BE(16);
			const height = bytes.readUInt32BE(20);
			return width === 0 || height === 0 || width > 2147483647 || height > 2147483647 ? undefined : {
				width,
				height
			};
		};
	})))();
}

//#endregion
export { resolveJavaScriptSourceMapReferences as a, javascriptSourceMapReferenceSchema as i, readPngHeaderDimensions as n, resolveJavaScriptSourceMapUrl as o, init_javascriptSourceMapPaths as r, init_pngHeader as t };