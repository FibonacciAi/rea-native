import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { P as init_InvestigationProviders, v as ARTIFACT_GRAPH_PROVIDER } from "./InterfaceBuilderDecodeBudget-5F2AkxJT.js";
import { o as init_artifactToolContracts, t as ARTIFACT_ANALYSIS_OPERATIONS } from "./artifactToolContracts-Di4qZlEt.js";
import { Readable } from "node:stream";

//#region dist/filesystem/readFileHandleChunks.js
var readFileHandleChunks, fileOffset;
function init_readFileHandleChunks() {
	return (init_readFileHandleChunks = __esmMin((() => {
		readFileHandleChunks = (handle, options = {}) => {
			const start = fileOffset(options.start ?? 0);
			const unlimited = options.end === undefined || options.end === Infinity;
			const end = unlimited ? undefined : fileOffset(options.end);
			if (start === undefined || !unlimited && end === undefined || end !== undefined && end < start) throw new RangeError("Invalid file read range");
			return Readable.from((async function* () {
				let position = start;
				while (end === undefined || position <= end) {
					options.signal?.throwIfAborted();
					const remaining = end === undefined ? undefined : end - position + 1n;
					const chunk = Buffer.allocUnsafe(remaining === undefined || remaining > 64n * 1024n ? 64 * 1024 : Number(remaining));
					const { bytesRead } = await handle.read(chunk, 0, chunk.length, position);
					options.signal?.throwIfAborted();
					if (bytesRead === 0) return;
					position += BigInt(bytesRead);
					yield chunk.subarray(0, bytesRead);
				}
			})(), {
				objectMode: false,
				...options.signal === undefined ? {} : { signal: options.signal }
			});
		};
		fileOffset = (value) => {
			if (typeof value === "bigint") return value >= 0n ? value : undefined;
			return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : undefined;
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactProviderMetadata.js
var artifactCapabilities;
function init_ArtifactProviderMetadata() {
	return (init_ArtifactProviderMetadata = __esmMin((() => {
		init_InvestigationProviders();
		init_artifactToolContracts();
		artifactCapabilities = (platform = process.platform) => Object.freeze(ARTIFACT_ANALYSIS_OPERATIONS.map((operation) => {
			const common = {
				provider: ARTIFACT_GRAPH_PROVIDER,
				operation,
				effects: Object.freeze({
					mutatesArtifact: false,
					launchesProcess: operation !== "decode_interface_builder" && operation !== "inspect_keyed_archive" && operation !== "trace_dylib_resolution",
					mayShowUi: false,
					mayAccessNetwork: false,
					mayWriteFilesystem: operation === "extract_artifact" || operation === "inspect_artifact" || operation === "inventory_artifact",
					changesPermissions: false,
					requiresRoot: false
				}),
				limitations: Object.freeze(["DMG child inventory automatically uses a read-only native macOS mount; PKG remains root-hash-only.", "ASAR files discovered in filesystem-backed inventories are expanded without bulk extraction; other nested containers remain recorded only."])
			};
			return Object.freeze(operation === "inspect_asset_catalog" && platform !== "darwin" ? {
				...common,
				available: false,
				availabilityCode: "unsupported_host",
				reason: "Apple asset catalogs require macOS assetutil."
			} : {
				...common,
				available: true,
				reason: null
			});
		}));
	})))();
}

//#endregion
export { readFileHandleChunks as i, init_ArtifactProviderMetadata as n, init_readFileHandleChunks as r, artifactCapabilities as t };