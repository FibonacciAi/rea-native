import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { artifactExtractionResultSchema, artifactInventoryOutputSchema, buildInterfaceBuilderAnalysis, compareUnicodeCodePoints, createArtifactInspection, createEvidence, digestCanonicalValue, err, init_artifactGraph, init_artifactInspection, init_binaryTargetTypes, init_canonicalDigest, init_evidence, init_inputIssueProjection, init_interfaceBuilderGraph, init_interfaceBuilderKeyedArchive, init_result, init_unicodeCodePointOrder, init_zipPackageFormat, interfaceBuilderConnectionFieldNames, interfaceBuilderLimitsSchema, isMachOFormat, isUIKitRuntimeConnectionClass, isZipPackageFormat, ok, projectInputIssues } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCapabilityUnavailableError, AnalysisInputError, AnalysisUnsupportedTargetError, freezeJsonSnapshot, init_analysisErrorCore, init_immutableJson, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { ArtifactReaderFailure, init_ArtifactReader, sameArtifactSourceIdentity } from "./ArtifactReader-BXkffc1D.js";
import { createAnalysisExecution, init_AnalysisProvider } from "./AnalysisProvider-D0Us2OTk.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-DQWTcUwE.js";
import { ArtifactOperationError, init_artifactOperationError } from "./artifactOperationError-B7n03FbD.js";
import { ProviderCleanupError, init_providerCleanupError } from "./providerCleanupError-Ceq8f0wK.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-D_tWyOub.js";
import { execFileOutput, init_ExecFileOutput } from "./ExecFileOutput-BEQs-lDD.js";
import { KeyedArchiveKindError, appleAssetCatalogInputSchema, appleResourceKeyFields, dylibResolutionInputSchema, dylibResolutionResultSchema, init_appleAssetCatalog, init_dyldPaths, init_dylibResolution, init_keyedArchive, keyedArchiveInputSchema, keyedArchiveResultSchema, parseAppleAssetCatalogRecords, projectAppleAssetCatalogPage, projectKeyedArchive, resolveTreePath, traceDylibLoading } from "./toolOutputSchemaGroups-DRiYs1je.js";
import { ARTIFACT_GRAPH_PROVIDER, init_InvestigationProviders } from "./InvestigationProviders-DoQRIHii.js";
import { hasBinaryPlistSignature, hasNibArchiveSignature, init_appleArchiveFormat } from "./appleArchiveFormat-tVoI2ykA.js";
import { ArtifactPathRegistry, hasMachoMagic, init_ArtifactPaths, init_MachoLoadCommandReader, normalizeArtifactPath, readMachoImage } from "./MachoLoadCommandReader-C7e074Ze.js";
import { InterfaceBuilderDecodeBudget, InterfaceBuilderDecodeBudgetExceeded, decodeXmlPlistText, estimateBinaryPlistExpansion, init_InterfaceBuilderDecodeBudget, init_propertyListXmlText, preflightPropertyListDecode } from "./InterfaceBuilderDecodeBudget-D4omRUe4.js";
import { decodeXmlText, init_plistValue, init_propertyListKeys, omittedPrototypeKeysLimitation, parseXmlPropertyList, projectPlistValue } from "./propertyListKeys-G8e74YWb.js";
import { SafeOutputTree, SafeOutputTreeCreationFailure, init_SafeOutputTree, init_SafeOutputTreeCreationFailure } from "./SafeOutputTree-D6U15GXd.js";
import { ZipArtifactReader, init_ZipArtifactReader } from "./ZipArtifactReader-B8ZgNe4D.js";
import { ARTIFACT_ANALYSIS_OPERATIONS, artifactExtractionExecutionSchema, artifactInventoryInputSchema, init_artifactToolContracts } from "./officialToolContracts-CCFF0an9.js";
import { AsarArtifactReader, DirectoryArtifactReader, MachOSliceArtifactReader, abortIfNeeded, init_ArtifactHash, init_AsarArtifactReader, init_DirectoryArtifactReader, init_MachOSliceArtifactReader, init_scanCanonical, scanCanonicalArtifactInventoryInScope } from "./scanCanonical-KP4T9jSl.js";
import { artifactCapabilities, init_ArtifactProviderMetadata } from "./binary-BVOr2mgE.js";
import { z } from "zod";
import { basename, dirname, join, relative, sep } from "node:path";
import { createHash } from "node:crypto";
import { TextDecoder } from "node:util";
import { lstat, open, readlink, realpath } from "node:fs/promises";
import { constants } from "node:fs";
import { parseBinary } from "plist";

//#region dist/domain/apple/plistNumbers.js
var createPlistNumberProjection;
function init_plistNumbers() {
	return (init_plistNumbers = __esmMin((() => {
		createPlistNumberProjection = (literals) => {
			let exactIntegerCount = 0;
			let ambiguousNumberCount = 0;
			const mapNumber = (item) => {
				if (Number.isSafeInteger(item) || !Number.isInteger(item)) return item;
				if (literals.incomplete) {
					ambiguousNumberCount += 1;
					return item;
				}
				const decimals = literals.integers.get(item);
				if (decimals === undefined) {
					if (!literals.reals.has(item)) ambiguousNumberCount += 1;
					return item;
				}
				const [decimal] = decimals;
				if (decimals.size !== 1 || decimal === undefined || literals.reals.has(item)) {
					ambiguousNumberCount += 1;
					return item;
				}
				exactIntegerCount += 1;
				return {
					$plist_type: "integer",
					decimal
				};
			};
			const map = (item) => {
				if (typeof item === "number") return mapNumber(item);
				if (Array.isArray(item)) return item.map(map);
				if (item !== null && typeof item === "object") {
					const keys = Object.keys(item);
					const marker = item[keys[0] ?? ""];
					const reference = keys.length === 1 && (keys[0] === "UID" || keys[0] === "CF$UID") && typeof marker === "number";
					if (reference) {
						if (typeof marker === "number" && !Number.isSafeInteger(marker) && (literals.integers.has(marker) || !literals.reals.has(marker))) ambiguousNumberCount += 1;
						return item;
					}
					return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, map(child)]));
				}
				return item;
			};
			return {
				project: map,
				limitations: () => [
					...literals.incomplete ? ["Original archive number metadata could not be completely observed; decoded numbers may lose integer precision and exact integer/real association is unavailable."] : [],
					...literals.unsafeIntegerLiterals === 0 ? [] : [`${String(literals.unsafeIntegerLiterals)} observed integer literal(s) in the original archive exceed the exact range of a JSON number. Decoded numbers may lose integer precision unless represented as { "$plist_type": "integer", "decimal": "<exact digits>" }; the original archive bytes retain those literals.`],
					...exactIntegerCount === 0 ? [] : [`${String(exactIntegerCount)} unambiguous integer value(s) are reported with exact decimal text as { "$plist_type": "integer", "decimal": "<exact digits>" }.`],
					...ambiguousNumberCount === 0 ? [] : [`${String(ambiguousNumberCount)} number(s) beyond the exact integer range remain as decoded because their source integer/real type or reference marker cannot be associated unambiguously; integer precision loss remains possible.`]
				]
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/PlistNumberLiterals.js
var collector, XML_TOKEN, OPAQUE_ELEMENTS, xmlPlistNumberLiterals, binaryPlistNumberLiterals;
function init_PlistNumberLiterals() {
	return (init_PlistNumberLiterals = __esmMin((() => {
		init_propertyListKeys();
		init_appleArchiveFormat();
		collector = () => {
			const integers = new Map();
			const reals = new Set();
			let unsafeIntegerLiterals = 0;
			let incompleteMetadata = false;
			return {
				integer: (literal) => {
					if (!/^[+-]?\d+$/u.test(literal)) {
						incompleteMetadata = true;
						return;
					}
					const exact = BigInt(literal);
					if (exact >= BigInt(Number.MIN_SAFE_INTEGER) && exact <= BigInt(Number.MAX_SAFE_INTEGER)) return;
					unsafeIntegerLiterals += 1;
					const rounded = Number(exact);
					integers.set(rounded, (integers.get(rounded) ?? new Set()).add(exact.toString()));
				},
				real: (value) => {
					reals.add(value);
				},
				markIncomplete: () => {
					incompleteMetadata = true;
				},
				result: (incomplete = false) => ({
					incomplete: incomplete || incompleteMetadata,
					integers,
					reals,
					unsafeIntegerLiterals
				})
			};
		};
		XML_TOKEN = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<(?:[^>"']|"[^"]*"|'[^']*')*>/gu;
		OPAQUE_ELEMENTS = new Set([
			"string",
			"key",
			"data",
			"date"
		]);
		xmlPlistNumberLiterals = (xml) => {
			const output = collector();
			const elements = [];
			let number;
			let cursor = 0;
			for (const match of xml.matchAll(XML_TOKEN)) {
				const index = match.index;
				if (number !== undefined) number.text += xml.slice(cursor, index);
				const token = match[0];
				cursor = index + token.length;
				if (token.startsWith("<!--") || token.startsWith("<![CDATA[")) {
					if (number !== undefined) {
						number.plainText = false;
						output.markIncomplete();
					}
					continue;
				}
				const tag = /^<\s*(\/?)\s*([\w:-]+)/u.exec(token);
				if (tag === null) {
					if (number !== undefined) {
						number.plainText = false;
						output.markIncomplete();
					}
					continue;
				}
				const closing = tag[1] === "/";
				const name = tag[2];
				if (name === undefined) continue;
				if (closing) {
					if (number !== undefined && number.kind === name && number.depth === elements.length) {
						if (number.plainText) {
							const text = decodeXmlText(number.text).trim();
							if (number.kind === "integer") output.integer(text);
							else output.real(Number.parseFloat(text));
						}
						number = undefined;
					}
					elements.pop();
					continue;
				}
				if (number !== undefined) {
					number.plainText = false;
					output.markIncomplete();
				}
				if (/\/\s*>$/u.test(token)) continue;
				if (number === undefined && (name === "integer" || name === "real") && !elements.some((parent) => OPAQUE_ELEMENTS.has(parent))) number = {
					kind: name,
					text: "",
					depth: elements.length + 1,
					plainText: true
				};
				elements.push(name);
			}
			return output.result();
		};
		binaryPlistNumberLiterals = (bytes) => {
			const output = collector();
			if (bytes.length < 40 || !hasBinaryPlistSignature(bytes)) return output.result(true);
			const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
			const trailer = bytes.length - 32;
			const offsetWidth = bytes[trailer + 6] ?? 0;
			if (![
				1,
				2,
				4,
				8
			].includes(offsetWidth)) return output.result(true);
			const countRaw = view.getBigUint64(trailer + 8);
			const tableRaw = view.getBigUint64(trailer + 24);
			const safeMaximum = BigInt(Number.MAX_SAFE_INTEGER);
			if (countRaw === 0n || countRaw > safeMaximum || tableRaw > safeMaximum) return output.result(true);
			if (tableRaw < 8n || tableRaw >= BigInt(trailer)) return output.result(true);
			const offsetTable = Number(tableRaw);
			const capacity = Math.floor((trailer - offsetTable) / offsetWidth);
			if (countRaw > BigInt(capacity)) return output.result(true);
			const count = Number(countRaw);
			const unsigned = (offset) => {
				if (offset < offsetTable || offset + offsetWidth > trailer) return undefined;
				if (offsetWidth === 1) return view.getUint8(offset);
				if (offsetWidth === 2) return view.getUint16(offset);
				if (offsetWidth === 4) return view.getUint32(offset);
				const value = view.getBigUint64(offset);
				return value > safeMaximum ? undefined : Number(value);
			};
			for (let index = 0; index < count; index += 1) {
				const offset = unsigned(offsetTable + index * offsetWidth);
				if (offset === undefined || offset < 8 || offset >= offsetTable) return output.result(true);
				const marker = bytes[offset] ?? 0;
				const type = marker >> 4;
				if (type !== 1 && type !== 2) continue;
				const width = 2 ** (marker & 15);
				if (offset + 1 + width > offsetTable) return output.result(true);
				if (type === 1 && width === 8) output.integer(view.getBigInt64(offset + 1).toString());
				else if (type === 1 && width > 4) return output.result(true);
				else if (type === 2 && width === 4) output.real(view.getFloat32(offset + 1));
				else if (type === 2 && width === 8) output.real(view.getFloat64(offset + 1));
				else if (type === 2) return output.result(true);
			}
			return output.result();
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/KeyedArchiveReader.js
var MAX_BYTES, MAX_DECODE_BYTES, decodeKeyedArchiveBytes, keyedArchiveKindRemediation, inspectBundleKeyedArchive, archivePathError;
function init_KeyedArchiveReader() {
	return (init_KeyedArchiveReader = __esmMin((() => {
		init_analysisErrorCore();
		init_plistValue();
		init_plistNumbers();
		init_PlistNumberLiterals();
		init_propertyListKeys();
		init_keyedArchive();
		init_DirectoryArtifactReader();
		init_ArtifactReader();
		init_propertyListXmlText();
		init_appleArchiveFormat();
		init_InterfaceBuilderDecodeBudget();
		MAX_BYTES = 64 * 1024 * 1024;
		MAX_DECODE_BYTES = 8 * MAX_BYTES;
		decodeKeyedArchiveBytes = (bytes, selection) => {
			if (bytes.length > MAX_BYTES) throw new RangeError("Keyed archive exceeds 64 MiB");
			if (hasNibArchiveSignature(bytes)) throw new KeyedArchiveKindError("Selected file is a compiled NIBArchive, not a Foundation plist archive; decode it with decode_interface_builder", "nib-archive");
			const binary = hasBinaryPlistSignature(bytes);
			const xmlText = binary ? undefined : decodeXmlPlistText(bytes);
			const binaryExpansion = binary ? estimateBinaryPlistExpansion(bytes, MAX_DECODE_BYTES, {
				budget: "the keyed archive decode budget",
				fail: (kind, message) => kind === "cycle" ? new TypeError("binary plist object references form a cycle, which a property list cannot represent") : new RangeError(message),
				bounds: "decoder"
			}) : undefined;
			const parsed = binaryExpansion !== undefined ? {
				value: parseBinary(bytes),
				omittedPrototypeKeys: binaryExpansion.binaryPrototypeKeyObserved ? null : 0
			} : parseXmlPropertyList(xmlText ?? "");
			const { value: plistValue, unknownRealCount } = projectPlistValue(parsed.value);
			const graph = projectKeyedArchive(plistValue, selection);
			const numbers = createPlistNumberProjection(binary ? binaryPlistNumberLiterals(bytes) : xmlPlistNumberLiterals(xmlText ?? ""));
			const roots = Object.fromEntries(Object.entries(graph.roots).map(([name, value]) => [name, numbers.project(value)]));
			const objects = graph.objects.map((object) => ({
				...object,
				value: numbers.project(object.value)
			}));
			return {
				archive_format: binary ? "binary-plist" : "xml-plist",
				...graph,
				roots,
				objects,
				limitations: [
					...graph.limitations,
					...numbers.limitations(),
					...parsed.omittedPrototypeKeys === 0 ? [] : [omittedPrototypeKeysLimitation(parsed.omittedPrototypeKeys)],
					...unknownRealCount === 0 ? [] : [`${String(unknownRealCount)} non-finite real value(s) are reported as { "$plist_type": "real", "value": null } because JSON evidence cannot preserve NaN vs infinity.`]
				]
			};
		};
		keyedArchiveKindRemediation = (kind, platform) => {
			if (kind === "nib-archive") return "Decode compiled NIBArchive files with decode_interface_builder on the app bundle.";
			return platform === "darwin" ? "Inspect an ordinary property list with inspect_plist; inspect_keyed_archive decodes NSKeyedArchiver archives only." : "Select an NSKeyedArchiver archive; inspect_keyed_archive decodes only those. inspect_plist, which reads ordinary property lists, requires a macOS host.";
		};
		inspectBundleKeyedArchive = async (input) => {
			const selected = keyedArchiveInputSchema.parse(input.parameters);
			if (selected.path.startsWith("/") || selected.path.split("/").some((part) => part === ".." || part === "." || part.length === 0)) throw archivePathError("invalid_format", selected.path === "." ? "Select a keyed archive path relative to the active app bundle." : `Archive path must be a canonical relative bundle path without empty, '.', or '..' segments: ${selected.path}`);
			const reader = new DirectoryArtifactReader(input.bundlePath);
			try {
				const wanted = selected.path.normalize("NFC");
				let entry;
				for await (const candidate of reader.entries(input.signal, (directory) => wanted.startsWith(`${directory.normalize("NFC")}/`))) {
					if (candidate.path.normalize("NFC") !== wanted) continue;
					if (candidate.kind !== "file") throw archivePathError("invalid_value", `Archive path selects a ${candidate.kind}, not a regular file: ${selected.path}`);
					if ((candidate.declaredSize ?? 0) > MAX_BYTES) throw new ArtifactReaderFailure("limit", "Keyed archive exceeds 64 MiB");
					if (entry !== undefined) throw archivePathError("invalid_value", `Archive path matches multiple Unicode-equivalent bundle entries; selection is ambiguous: ${selected.path}`);
					entry = candidate;
				}
				if (entry === undefined) throw archivePathError("invalid_value", `No regular file exists at ${selected.path} in the active app bundle.`);
				const stream = await reader.open(entry, input.signal);
				const chunks = [];
				let size = 0;
				for await (const chunk of stream) {
					if (input.signal?.aborted) {
						stream.destroy();
						throw new ArtifactReaderFailure("cancelled", "Archive inspection cancelled");
					}
					const bytes = z.instanceof(Buffer).parse(chunk);
					size += bytes.length;
					if (size > MAX_BYTES) {
						stream.destroy();
						throw new ArtifactReaderFailure("limit", "Keyed archive exceeds 64 MiB");
					}
					chunks.push(bytes);
				}
				const bytes = Buffer.concat(chunks, size);
				try {
					return keyedArchiveResultSchema.parse({
						target_sha256: input.targetSha256,
						archive_path: entry.path,
						archive_sha256: createHash("sha256").update(bytes).digest("hex"),
						...decodeKeyedArchiveBytes(bytes, selected)
					});
				} catch (cause) {
					if (cause instanceof AnalysisInputError) throw cause;
					if (cause instanceof KeyedArchiveKindError) throw new AnalysisUnsupportedTargetError("inspect_keyed_archive", join(input.bundlePath, entry.path), cause.message, {
						cause,
						remediationAction: keyedArchiveKindRemediation(cause.kind, input.platform ?? process.platform)
					});
					throw new ArtifactReaderFailure(cause instanceof RangeError ? "limit" : "format", `Cannot decode selected Foundation keyed archive: ${cause instanceof Error ? cause.message : String(cause)}`, { cause });
				}
			} finally {
				await reader.close();
			}
		};
		archivePathError = (reason, message) => new AnalysisInputError("inspect_keyed_archive", undefined, [{
			path: ["path"],
			reason,
			message
		}]);
	})))();
}

//#endregion
//#region dist/artifacts/OrderedReads.js
var consumeWithOrderedReads;
function init_OrderedReads() {
	return (init_OrderedReads = __esmMin((() => {
		consumeWithOrderedReads = async (items, width, read, consume) => {
			const pending = [];
			const consumeNext = async () => {
				const next = pending.shift();
				if (next === undefined) return;
				const result = await next.result;
				if (!result.ok) throw result.error;
				await consume(next.item, result.value);
			};
			const iterator = items[Symbol.asyncIterator]();
			let iterating = true;
			try {
				while (iterating) {
					let step;
					try {
						step = await iterator.next();
					} catch (cause) {
						iterating = false;
						while (pending.length > 0) await consumeNext();
						throw cause;
					}
					if (step.done === true) {
						iterating = false;
						break;
					}
					const started = read(step.value);
					if (started === undefined) continue;
					pending.push({
						item: step.value,
						result: started.then((value) => ({
							ok: true,
							value
						}), (error) => ({
							ok: false,
							error
						}))
					});
					if (pending.length >= width) await consumeNext();
				}
				while (pending.length > 0) await consumeNext();
			} finally {
				if (iterating) await iterator.return?.().catch(() => undefined);
				await Promise.all(pending.map(({ result }) => result));
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/DylibResolutionReader.js
var OPERATION, HASH_CHUNK_BYTES, MAGIC_READ_CONCURRENCY, FilesystemTreeView, traceDylibResolution, executableRoots, compare, requireMachoRoots, startsWithMachoMagic, identityOf, readImage, fileSha256, cancelled, deniedPath, permissionDenied, missing;
function init_DylibResolutionReader() {
	return (init_DylibResolutionReader = __esmMin((() => {
		init_analysisErrorCore();
		init_dyldPaths();
		init_dylibResolution();
		init_inputIssueProjection();
		init_ArtifactReader();
		init_DirectoryArtifactReader();
		init_OrderedReads();
		init_MachoLoadCommandReader();
		OPERATION = "trace_dylib_resolution";
		HASH_CHUNK_BYTES = 1024 * 1024;
		MAGIC_READ_CONCURRENCY = 8;
		FilesystemTreeView = class {
			root;
			signal;
			#entries = new Map();
			#images = new Map();
			#identities = new Map();
			constructor(root, signal) {
				this.root = root;
				this.signal = signal;
			}
			entry(path) {
				const cached = this.#entries.get(path);
				if (cached !== undefined) return cached;
				const pending = this.#readEntry(path);
				this.#entries.set(path, pending);
				return pending;
			}
			image(path) {
				const cached = this.#images.get(path);
				if (cached !== undefined) return cached;
				const pending = readImage(join(this.root, path), this.signal).then(({ facts, identity }) => {
					this.#identities.set(path, identity);
					return facts;
				});
				this.#images.set(path, pending);
				return pending;
			}
			/** Identity of the file whose header bytes `image()` parsed. */
			identity(path) {
				return this.#identities.get(path);
			}
			async #readEntry(path) {
				cancelled(this.signal);
				const absolute = join(this.root, path);
				try {
					const metadata = await lstat(absolute);
					if (metadata.isSymbolicLink()) return {
						kind: "symlink",
						target: await readlink(absolute)
					};
					if (metadata.isDirectory()) return { kind: "directory" };
					return metadata.isFile() ? { kind: "file" } : undefined;
				} catch (cause) {
					if (missing(cause)) return undefined;
					throw cause;
				}
			}
		};
		traceDylibResolution = async (options) => {
			const parsed = dylibResolutionInputSchema.safeParse(options.parameters);
			if (!parsed.success) throw new AnalysisInputError(OPERATION, { cause: parsed.error }, projectInputIssues(parsed.error.issues, options.parameters));
			let root = options.rootPath;
			try {
				root = await realpath(options.rootPath);
				const target = relative(root, await realpath(options.targetPath)).split(sep).join("/");
				const view = new FilesystemTreeView(root, options.signal);
				const { roots: requested, unclassified } = parsed.data.roots !== undefined ? {
					roots: parsed.data.roots,
					unclassified: []
				} : options.enumerateRoots ? await executableRoots(root, view, options.signal) : {
					roots: [target],
					unclassified: []
				};
				const roots = await requireMachoRoots(view, requested, parsed.data.roots !== undefined);
				const trace = await traceDylibLoading(view, {
					roots,
					unclassified,
					...parsed.data.architecture === undefined ? {} : { architecture: parsed.data.architecture },
					...options.signal === undefined ? {} : { signal: options.signal }
				});
				const digests = new Map();
				for (const { path } of trace.images) digests.set(path, await fileSha256(join(root, path), {
					path,
					expected: view.identity(path),
					...options.signal === undefined ? {} : { signal: options.signal }
				}));
				const targetDigest = digests.get(target) ?? await fileSha256(join(root, target), {
					path: target,
					expected: undefined,
					...options.signal === undefined ? {} : { signal: options.signal }
				});
				if (targetDigest !== options.targetSha256) throw new ArtifactReaderFailure("integrity", `Active target digest changed: expected ${options.targetSha256}, observed ${targetDigest}`);
				return dylibResolutionResultSchema.parse({
					...trace,
					root_path: options.rootPath,
					target_sha256: options.targetSha256,
					images: trace.images.map((image) => ({
						...image,
						sha256: digests.get(image.path)
					}))
				});
			} catch (cause) {
				if (options.signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Dylib resolution was cancelled", { cause });
				const denied = permissionDenied(cause);
				if (denied !== undefined) throw new ArtifactReaderFailure("unavailable", `Permission denied (${denied.code}) reading ${deniedPath(root, denied.path)}`, { cause });
				throw cause;
			}
		};
		executableRoots = async (root, view, signal) => {
			const roots = [];
			const unclassified = [];
			await consumeWithOrderedReads(new DirectoryArtifactReader(root).entries(signal), MAGIC_READ_CONCURRENCY, (entry) => entry.kind === "file" ? startsWithMachoMagic(entry.adapterKey) : undefined, async (entry, macho) => {
				if (!macho) return;
				const facts = await view.image(entry.path);
				if (facts.status === "malformed" || facts.status === "unsupported") unclassified.push(entry.path);
				else if (facts.status === "parsed" && facts.slices.some(({ file_type: type }) => type === "execute")) roots.push(entry.path);
			});
			return {
				roots: roots.sort(compare),
				unclassified: unclassified.sort(compare)
			};
		};
		compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
		requireMachoRoots = async (view, roots, callerSelected) => {
			const resolved = [];
			for (const [index, path] of roots.entries()) {
				const reject = (reason, message) => callerSelected ? new AnalysisInputError(OPERATION, undefined, [{
					path: ["roots", index],
					reason: "invalid_value",
					message
				}]) : new ArtifactReaderFailure(reason, message);
				const lookup = await resolveTreePath(view, path);
				if (lookup.kind === "escapes") throw reject("path", `Root ${path} resolves outside the analyzed root`);
				if (lookup.kind !== "file") throw reject("path", `Root ${path} is not a regular file in the analyzed root`);
				if ((await view.image(lookup.path)).status === "not-mach-o") throw reject("format", `Root ${path} is not a Mach-O image`);
				if (!resolved.includes(lookup.path)) resolved.push(lookup.path);
			}
			return resolved;
		};
		startsWithMachoMagic = async (path) => {
			const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
			try {
				const buffer = new Uint8Array(4);
				const { bytesRead } = await handle.read(buffer, 0, 4, 0);
				return hasMachoMagic(buffer.subarray(0, bytesRead));
			} finally {
				await handle.close();
			}
		};
		identityOf = (metadata) => [
			metadata.dev,
			metadata.ino,
			metadata.size,
			metadata.mtimeNs,
			metadata.ctimeNs
		].join(":");
		readImage = async (path, signal) => {
			cancelled(signal);
			const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
			try {
				const metadata = await handle.stat({ bigint: true });
				const size = Number(metadata.size);
				const facts = await readMachoImage(async (offset, length) => {
					cancelled(signal);
					const buffer = new Uint8Array(Math.max(0, Math.min(length, size - offset)));
					const { bytesRead } = await handle.read(buffer, 0, buffer.length, offset);
					return buffer.subarray(0, bytesRead);
				}, size);
				return {
					facts,
					identity: identityOf(metadata)
				};
			} finally {
				await handle.close();
			}
		};
		fileSha256 = async (absolute, options) => {
			const { signal } = options;
			const handle = await open(absolute, constants.O_RDONLY | constants.O_NOFOLLOW);
			const unchanged = async () => {
				if (options.expected !== undefined && identityOf(await handle.stat({ bigint: true })) !== options.expected) throw new ArtifactReaderFailure("integrity", `${options.path} changed while its dyld load commands were traced`);
			};
			try {
				await unchanged();
				const hash = createHash("sha256");
				const buffer = new Uint8Array(HASH_CHUNK_BYTES);
				for (;;) {
					cancelled(signal);
					const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
					if (bytesRead === 0) break;
					hash.update(buffer.subarray(0, bytesRead));
				}
				await unchanged();
				return hash.digest("hex");
			} finally {
				await handle.close();
			}
		};
		cancelled = (signal) => {
			if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Dylib resolution was cancelled");
		};
		deniedPath = (root, path) => {
			if (path === undefined) return "a file in the analyzed root";
			const inside = relative(root, path);
			return inside === "" || inside.startsWith("..") ? path : inside;
		};
		permissionDenied = (cause) => {
			if (!(cause instanceof Error) || !("code" in cause)) return undefined;
			if (cause.code !== "EACCES" && cause.code !== "EPERM") return undefined;
			return {
				code: cause.code,
				path: "path" in cause && typeof cause.path === "string" ? cause.path : undefined
			};
		};
		missing = (cause) => cause instanceof Error && "code" in cause && (cause.code === "ENOENT" || cause.code === "ENOTDIR");
	})))();
}

//#endregion
//#region dist/artifacts/inventory/ArtifactInventory.js
var inventoryArtifact, scanArtifactInventory, scanArtifactInventoryInScope;
function init_ArtifactInventory() {
	return (init_ArtifactInventory = __esmMin((() => {
		init_artifactGraph();
		init_ArtifactHash();
		init_scanCanonical();
		inventoryArtifact = async (inputPath, options) => {
			const snapshot = await scanArtifactInventory(inputPath, options);
			return artifactInventoryOutputSchema.parse(snapshot);
		};
		scanArtifactInventory = async (inputPath, options) => options.resourceScope.run(() => scanArtifactInventoryInScope(inputPath, options));
		scanArtifactInventoryInScope = async (inputPath, options) => {
			abortIfNeeded(options.signal);
			const path = await realpath(inputPath);
			return scanCanonicalArtifactInventoryInScope(path, options);
		};
	})))();
}

//#endregion
//#region dist/artifacts/extraction/ArtifactExtraction.js
var extractArtifact, extractArtifactInScope, materializeArtifactInventory, materializeArtifactInventoryInScope, materializeSelection, writeSelectedEntries, releaseExtractionOwners, createExtractionResult, requireExtractableFormat, createReader, preflight;
function init_ArtifactExtraction() {
	return (init_ArtifactExtraction = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_canonicalDigest();
		init_AsarArtifactReader();
		init_ArtifactPaths();
		init_ArtifactReader();
		init_ArtifactHash();
		init_DirectoryArtifactReader();
		init_SafeOutputTree();
		init_SafeOutputTreeCreationFailure();
		init_ZipArtifactReader();
		init_zipPackageFormat();
		init_MachOSliceArtifactReader();
		init_artifactGraph();
		init_analysisErrorCore();
		init_binaryTargetTypes();
		init_ArtifactInventory();
		extractArtifact = async (input, signal) => input.resourceScope.run(() => extractArtifactInScope(input, signal));
		extractArtifactInScope = async (input, signal) => {
			abortIfNeeded(signal);
			const sourcePath = await realpath(input.inputPath);
			await requireExtractableFormat(sourcePath, input);
			const snapshot = await scanArtifactInventoryInScope(sourcePath, {
				resourceScope: input.resourceScope,
				signal,
				environment: input.environment,
				integrity: { mode: input.integrityPolicy }
			});
			return materializeArtifactInventoryInScope(input, sourcePath, snapshot, signal);
		};
		materializeArtifactInventory = async (input, sourcePath, snapshot, signal) => {
			return input.resourceScope.run(() => materializeArtifactInventoryInScope(input, sourcePath, snapshot, signal));
		};
		materializeArtifactInventoryInScope = async (input, sourcePath, snapshot, signal) => {
			abortIfNeeded(signal);
			const selectedOccurrences = snapshot.occurrences.filter((occurrence) => (occurrence.entry_kind === "file" || occurrence.entry_kind === "slice") && occurrence.logical_path !== ".");
			const regularPaths = new Set(selectedOccurrences.map(({ logical_path: path }) => path));
			const activeOccurrences = selectedOccurrences.filter(({ logical_path }) => {
				let path = logical_path;
				for (let slash = path.lastIndexOf("/"); slash >= 0; slash = path.lastIndexOf("/")) {
					path = path.slice(0, slash);
					if (regularPaths.has(path)) return false;
				}
				return true;
			});
			const selectedIds = new Set(activeOccurrences.map(({ occurrence_id: id }) => id));
			const neededNodes = new Set(activeOccurrences.map(({ artifact_id: id }) => id));
			const nodes = new Map();
			for (const node of snapshot.nodes) if (neededNodes.has(node.artifact_id)) nodes.set(node.artifact_id, node);
			const inventory = {
				manifest: snapshot.manifest,
				integrityContradictions: snapshot.integrity_contradictions.filter(({ occurrence_id: id }) => selectedIds.has(id))
			};
			const selected = activeOccurrences.map((occurrence) => {
				if (occurrence.encrypted) throw new AnalysisUnsupportedTargetError("extract_artifact", input.inputPath, `Archive entry ${occurrence.logical_path} is encrypted; REA does not decrypt archive entries, so the archive cannot be extracted completely`);
				if (occurrence.entry_kind === "file" && occurrence.artifact_id === null && occurrence.hash_status === "unavailable") throw new ArtifactReaderFailure("unavailable", `ASAR unpacked companion bytes are unavailable for ${occurrence.logical_path}`, undefined, {
					logicalPath: occurrence.logical_path,
					declaredSha256: null,
					calculatedSha256: null,
					unpacked: true
				});
				if (occurrence.entry_kind !== "file" && occurrence.entry_kind !== "slice" || occurrence.artifact_id === null || occurrence.logical_path === ".") throw new ArtifactReaderFailure("format", `Selected occurrence is not an extractable regular child file: ${occurrence.logical_path} (${occurrence.occurrence_id})`);
				const node = nodes.get(occurrence.artifact_id);
				if (node === undefined) throw new ArtifactReaderFailure("integrity", `Selected occurrence has no inventory node: ${occurrence.occurrence_id}`);
				return {
					occurrence,
					node
				};
			});
			return materializeSelection({
				input,
				sourcePath,
				inventory,
				selected,
				signal
			});
		};
		materializeSelection = async ({ input, sourcePath, inventory, selected, signal }) => {
			const byPath = new Map(selected.map((item) => [item.occurrence.logical_path, item]));
			const reader = await createReader(sourcePath, input);
			const readerOwner = {
				kind: "reader",
				reader,
				resource: `artifact reader for ${sourcePath}`
			};
			let localReaderOwner = readerOwner;
			let output;
			let completed;
			const extracted = [];
			try {
				try {
					output = await SafeOutputTree.create(input.outputRoot);
				} catch (cause) {
					if (cause instanceof SafeOutputTreeCreationFailure) output = cause.tree;
					throw cause;
				}
				await writeSelectedEntries({
					reader,
					output,
					byPath,
					extracted,
					signal
				});
				localReaderOwner = undefined;
				const closeAttempt = await input.resourceScope.release(readerOwner);
				if (closeAttempt.kind === "failed") throw ArtifactReaderFailure.withCleanup(closeAttempt.cause, ArtifactReaderFailure.cleanupObservation(closeAttempt.cause, readerOwner.resource));
				extracted.sort((left, right) => compareUnicodeCodePoints(left.relative_path, right.relative_path));
				completed = createExtractionResult(input, inventory, selected, extracted);
				await output.commit(signal);
				return completed;
			} catch (cause) {
				const cleanupFailures = await releaseExtractionOwners(input.resourceScope, localReaderOwner, output, input.outputRoot);
				if (cleanupFailures.length > 0) {
					const observations = cleanupFailures.map(({ cause: cleanupCause, resource }) => ArtifactReaderFailure.cleanupObservation(cleanupCause, resource));
					throw ArtifactReaderFailure.withCleanup(cause, {
						reason: observations.map(({ reason }) => reason).join("; "),
						resources: [...new Set(observations.flatMap(({ resources }) => resources))]
					}, output?.published === true && completed !== undefined ? {
						kind: "artifact-extraction",
						extraction: completed
					} : undefined);
				}
				if (output?.published === true && completed !== undefined) return completed;
				throw cause;
			}
		};
		writeSelectedEntries = async ({ reader, output, byPath, extracted, signal }) => {
			const registry = new ArtifactPathRegistry();
			for await (const entry of reader.entries(signal)) {
				const path = normalizeArtifactPath(entry.path);
				registry.add(path, entry.kind);
				const selectedItem = byPath.get(path);
				if (selectedItem === undefined) {
					if (entry.kind === "file" || entry.kind === "slice") throw new ArtifactReaderFailure("integrity", `Regular artifact entry is missing from inventory: ${path}`);
					continue;
				}
				preflight(entry);
				const stream = await reader.open(entry, signal);
				const written = await output.write(path, stream, {
					sha256: selectedItem.node.sha256,
					bytes: selectedItem.node.size
				}, signal);
				extracted.push({
					artifact_id: selectedItem.node.artifact_id,
					relative_path: written.relativePath,
					sha256: written.sha256,
					bytes_written: written.bytesWritten,
					created: true
				});
				byPath.delete(path);
			}
			if (byPath.size > 0) throw new ArtifactReaderFailure("integrity", `Inventoried regular artifact entries were not materialized: ${[...byPath.keys()].sort(compareUnicodeCodePoints).join(", ")}`);
		};
		releaseExtractionOwners = async (resourceScope, readerOwner, output, outputRoot) => {
			const failures = [];
			if (readerOwner !== undefined) {
				const attempt = await resourceScope.release(readerOwner);
				if (attempt.kind === "failed") failures.push({
					cause: attempt.cause,
					resource: readerOwner.resource
				});
			}
			if (output !== undefined) {
				const owner = {
					kind: "output-tree",
					tree: output,
					resource: outputRoot
				};
				const attempt = await resourceScope.release(owner);
				if (attempt.kind === "failed") failures.push({
					cause: attempt.cause,
					resource: owner.resource
				});
			}
			return failures;
		};
		createExtractionResult = (input, inventory, selected, extracted) => {
			const extractionSemantic = {
				source_manifest_id: inventory.manifest.manifest_id,
				selected_occurrence_ids: selected.map(({ occurrence }) => occurrence.occurrence_id).sort(compareUnicodeCodePoints),
				files_sha256: digestCanonicalValue(extracted, "Artifact"),
				output_root_alias: "$OUTPUT_ROOT"
			};
			return artifactExtractionResultSchema.parse({
				manifest: inventory.manifest,
				extraction_manifest: {
					...extractionSemantic,
					extraction_id: `aex_${digestCanonicalValue(extractionSemantic, "Artifact")}`
				},
				output_root: input.outputRoot,
				artifacts: extracted,
				containment_verified: true,
				cleanup: {
					attempted: false,
					verified: true,
					residual_paths: []
				},
				provenance: [],
				integrity_contradictions: inventory.integrityContradictions,
				limitations: ["All regular files in the active artifact were materialized; nested archive contents remain represented by their containing file.", ...inventory.integrityContradictions.length === 0 ? [] : [`${String(inventory.integrityContradictions.length)} extracted file(s) contradict declared integrity metadata; their bytes are observed-untrusted.`]]
			});
		};
		requireExtractableFormat = async (path, input) => {
			const format = input.inputFormat;
			const directory = (await lstat(path)).isDirectory();
			if (!directory && format !== "asar" && !isMachOFormat(format) && !isZipPackageFormat(format)) throw new AnalysisUnsupportedTargetError("extract_artifact", input.inputPath, `Artifact format has no extraction reader: ${format}`);
			return directory;
		};
		createReader = async (path, input) => {
			const format = input.inputFormat;
			if (await requireExtractableFormat(path, input)) return new DirectoryArtifactReader(path);
			if (format === "asar") return new AsarArtifactReader(path);
			if (isZipPackageFormat(format)) return new ZipArtifactReader(path, format);
			return new MachOSliceArtifactReader(path, input.environment);
		};
		preflight = (entry) => {
			if (entry.kind !== "file" && entry.kind !== "slice" || entry.encrypted) throw new ArtifactReaderFailure("format", `Selected artifact entry cannot be read: ${entry.path}`);
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/NibArchive.js
var DEFAULT_DECODE_BUDGET_BYTES, decodeNibArchive, parseObjects, preflightProjectedFieldCount, parseStrings, parseClasses, parseValues, readValue, skipValue, valueIndexes, readCount, readOffset, readU32, decodeUtf8, readVarint, checkedEnd, ensureRange, assertOrderedOffsets;
function init_NibArchive() {
	return (init_NibArchive = __esmMin((() => {
		init_appleArchiveFormat();
		init_InterfaceBuilderDecodeBudget();
		DEFAULT_DECODE_BUDGET_BYTES = 128 * 1024 * 1024;
		decodeNibArchive = (bytes, budget = new InterfaceBuilderDecodeBudget(DEFAULT_DECODE_BUDGET_BYTES)) => {
			if (bytes.length < 50 || !hasNibArchiveSignature(bytes)) throw new TypeError("NIBArchive magic or header is invalid");
			const formatVersion = readU32(bytes, 10);
			const coderVersion = readU32(bytes, 14);
			if (formatVersion !== 1) throw new TypeError(`Unsupported NIBArchive format version ${formatVersion}`);
			const objectCount = readCount(bytes, 18, "object");
			const objectsOffset = readOffset(bytes, 22, bytes.length, "object");
			const keyCount = readCount(bytes, 26, "key");
			const keysOffset = readOffset(bytes, 30, bytes.length, "key");
			const valueCount = readCount(bytes, 34, "value");
			const valuesOffset = readOffset(bytes, 38, bytes.length, "value");
			const classCount = readCount(bytes, 42, "class");
			const classesOffset = readOffset(bytes, 46, bytes.length, "class");
			assertOrderedOffsets(bytes.length, [
				objectsOffset,
				keysOffset,
				valuesOffset,
				classesOffset
			]);
			const projectedFieldCount = preflightProjectedFieldCount(bytes, objectsOffset, keysOffset, objectCount, valueCount, classCount, budget.remainingBytes);
			budget.reserve(objectCount * 96 + projectedFieldCount * 96, "NIBArchive object and projected field counts exceed the aggregate Interface Builder decode budget");
			const objectRecords = parseObjects(bytes, objectsOffset, keysOffset, objectCount, valueCount, classCount);
			const keys = parseStrings(bytes, keysOffset, valuesOffset, keyCount, "key", budget);
			const classes = parseClasses(bytes, classesOffset, bytes.length, classCount, budget);
			const neededValues = valueIndexes(objectRecords, valueCount);
			const values = parseValues(bytes, valuesOffset, classesOffset, valueCount, keyCount, neededValues, budget);
			for (const { value } of values.values()) {
				if (typeof value === "object" && value !== null && !Array.isArray(value) && typeof value.$nib_object_ref === "number" && value.$nib_object_ref >= objectCount) throw new TypeError("NIBArchive object reference is outside the object table");
			}
			const objects = objectRecords.flatMap((object, id) => {
				const className = classes[object.class_index];
				if (className === undefined) return [];
				const fields = {};
				for (let index = object.value_start; index < object.value_start + object.value_count; index += 1) {
					const value = values.get(index);
					if (value === undefined) continue;
					const key = keys[value.key_index];
					if (key !== undefined) Object.defineProperty(fields, key, {
						value: value.value,
						enumerable: true,
						configurable: true,
						writable: true
					});
				}
				return [{
					id,
					class_name: className,
					values: fields
				}];
			});
			let connectionObjectCount = 0;
			for (const object of objects) if (/(?:Outlet|Connection|Segue|ActionConnection)/iu.test(object.class_name)) connectionObjectCount += 1;
			return {
				format_version: formatVersion,
				coder_version: coderVersion,
				object_count: objectCount,
				connection_object_count: connectionObjectCount,
				objects,
				classes,
				limitations: ["NIBArchive class extensions and unsupported value encodings are retained as unavailable fields.", "NIBArchive object relationships are decoded from serialized references; runtime object creation and execution are not performed."]
			};
		};
		parseObjects = (bytes, start, end, count, valueCount, classCount) => {
			const cursor = { offset: start };
			const output = [];
			for (let index = 0; index < count; index += 1) {
				const classIndex = readVarint(bytes, cursor, end);
				const valueStart = readVarint(bytes, cursor, end);
				const countForObject = readVarint(bytes, cursor, end);
				if (classIndex >= classCount || valueStart > valueCount || countForObject > valueCount - valueStart) throw new TypeError(`NIBArchive object ${index} references an invalid table range`);
				output.push({
					class_index: classIndex,
					value_start: valueStart,
					value_count: countForObject
				});
			}
			if (cursor.offset > end) throw new TypeError("NIBArchive object table overlaps the next table");
			return output;
		};
		preflightProjectedFieldCount = (bytes, start, end, objectCount, valueCount, classCount, maxBytes) => {
			if (objectCount * 96 > maxBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "NIBArchive object count exceeds the aggregate Interface Builder decode budget");
			const cursor = { offset: start };
			let projectedFields = 0;
			for (let index = 0; index < objectCount; index += 1) {
				const classIndex = readVarint(bytes, cursor, end);
				const valueStart = readVarint(bytes, cursor, end);
				const fieldCount = readVarint(bytes, cursor, end);
				if (classIndex >= classCount || valueStart > valueCount || fieldCount > valueCount - valueStart) throw new TypeError(`NIBArchive object ${index} references an invalid table range`);
				projectedFields += fieldCount;
				if (!Number.isSafeInteger(projectedFields) || projectedFields * 96 > maxBytes - objectCount * 96) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "NIBArchive projected field ranges exceed the aggregate Interface Builder decode budget");
			}
			return projectedFields;
		};
		parseStrings = (bytes, start, end, count, label, budget) => {
			const cursor = { offset: start };
			const output = [];
			for (let index = 0; index < count; index += 1) {
				const length = readVarint(bytes, cursor, end);
				const next = checkedEnd(cursor.offset, length, end, `${label} ${index}`);
				budget.reserve(32 + length * 2, `NIBArchive ${label} strings exceed the aggregate Interface Builder decode budget`);
				const value = decodeUtf8(bytes, cursor.offset, next, `${label} ${index}`);
				cursor.offset = next;
				output.push(value);
			}
			return output;
		};
		parseClasses = (bytes, start, end, count, budget) => {
			const cursor = { offset: start };
			const output = [];
			for (let index = 0; index < count; index += 1) {
				const length = readVarint(bytes, cursor, end);
				const extraCount = readVarint(bytes, cursor, end);
				if (extraCount > 16) throw new TypeError(`NIBArchive class ${index} has too many extension values`);
				ensureRange(cursor.offset, extraCount * 4, end, `class ${index} extensions`);
				cursor.offset += extraCount * 4;
				const next = checkedEnd(cursor.offset, length, end, `class ${index}`);
				budget.reserve(32 + length * 2, "NIBArchive class names exceed the aggregate Interface Builder decode budget");
				const name = decodeUtf8(bytes, cursor.offset, next, `class ${index}`).replace(/\0+$/u, "");
				cursor.offset = next;
				output.push(name);
			}
			return output;
		};
		parseValues = (bytes, start, end, count, keyCount, needed, budget) => {
			const cursor = { offset: start };
			const output = new Map();
			for (let index = 0; index < count; index += 1) {
				const keyIndex = readVarint(bytes, cursor, end);
				if (keyIndex >= keyCount) throw new TypeError(`NIBArchive value ${index} references an invalid key`);
				ensureRange(cursor.offset, 1, end, `value ${index} type`);
				const type = bytes[cursor.offset++] ?? -1;
				if (!needed.has(index)) {
					skipValue(bytes, cursor, end, type, index);
					continue;
				}
				budget.reserve(64, "NIBArchive decoded values exceed the aggregate Interface Builder decode budget");
				const value = readValue(bytes, cursor, end, type, index, budget);
				output.set(index, {
					key_index: keyIndex,
					value
				});
			}
			if (cursor.offset > end) throw new TypeError("NIBArchive value table overlaps the next table");
			return output;
		};
		readValue = (bytes, cursor, end, type, index, budget) => {
			switch (type) {
				case 0:
					ensureRange(cursor.offset, 1, end, `value ${index}`);
					return bytes.readInt8(cursor.offset++);
				case 1:
					ensureRange(cursor.offset, 2, end, `value ${index}`);
					{
						const value = bytes.readInt16LE(cursor.offset);
						cursor.offset += 2;
						return value;
					}
				case 2:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					{
						const value = bytes.readInt32LE(cursor.offset);
						cursor.offset += 4;
						return value;
					}
				case 3:
					ensureRange(cursor.offset, 8, end, `value ${index}`);
					{
						const value = bytes.readBigInt64LE(cursor.offset);
						cursor.offset += 8;
						return value <= BigInt(Number.MAX_SAFE_INTEGER) && value >= BigInt(Number.MIN_SAFE_INTEGER) ? Number(value) : value.toString();
					}
				case 4: return true;
				case 5: return false;
				case 6:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					{
						const value = bytes.readFloatLE(cursor.offset);
						cursor.offset += 4;
						return Number.isFinite(value) ? value : null;
					}
				case 7:
					ensureRange(cursor.offset, 8, end, `value ${index}`);
					{
						const value = bytes.readDoubleLE(cursor.offset);
						cursor.offset += 8;
						return Number.isFinite(value) ? value : null;
					}
				case 8: {
					const length = readVarint(bytes, cursor, end);
					const next = checkedEnd(cursor.offset, length, end, `value ${index} data`);
					budget.reserve(32 + 4 * Math.ceil(length / 3), `NIBArchive data value ${index} exceeds the aggregate Interface Builder decode budget`);
					const encoded = bytes.subarray(cursor.offset, next).toString("base64");
					cursor.offset = next;
					return { $nib_data_base64: encoded };
				}
				case 9: return null;
				case 10:
					ensureRange(cursor.offset, 4, end, `value ${index} reference`);
					{
						const objectIndex = bytes.readUInt32LE(cursor.offset);
						cursor.offset += 4;
						return { $nib_object_ref: objectIndex };
					}
				default: throw new TypeError(`NIBArchive value ${index} has unsupported type ${type}`);
			}
		};
		skipValue = (bytes, cursor, end, type, index) => {
			switch (type) {
				case 0:
					ensureRange(cursor.offset, 1, end, `value ${index}`);
					cursor.offset += 1;
					return;
				case 1:
					ensureRange(cursor.offset, 2, end, `value ${index}`);
					cursor.offset += 2;
					return;
				case 2:
				case 10:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					cursor.offset += 4;
					return;
				case 3:
				case 7:
					ensureRange(cursor.offset, 8, end, `value ${index}`);
					cursor.offset += 8;
					return;
				case 6:
					ensureRange(cursor.offset, 4, end, `value ${index}`);
					cursor.offset += 4;
					return;
				case 4:
				case 5:
				case 9: return;
				case 8: {
					const length = readVarint(bytes, cursor, end);
					cursor.offset = checkedEnd(cursor.offset, length, end, `value ${index} data`);
					return;
				}
				default: throw new TypeError(`NIBArchive value ${index} has unsupported type ${type}`);
			}
		};
		valueIndexes = (objects, total) => {
			const indexes = new Set();
			for (const object of objects) for (let index = object.value_start; index < object.value_start + object.value_count; index += 1) indexes.add(index);
			if (indexes.size > total) throw new TypeError("NIBArchive object value ranges exceed the value table");
			return indexes;
		};
		readCount = (bytes, offset, label) => {
			const count = readU32(bytes, offset);
			if (count > bytes.length) throw new TypeError(`NIBArchive ${label} count exceeds the archive length`);
			return count;
		};
		readOffset = (bytes, offset, fileLength, label) => {
			const value = readU32(bytes, offset);
			if (value < 50 || value > fileLength) throw new TypeError(`NIBArchive ${label} table offset is invalid`);
			return value;
		};
		readU32 = (bytes, offset) => {
			ensureRange(offset, 4, bytes.length, "header");
			return bytes.readUInt32LE(offset);
		};
		decodeUtf8 = (bytes, start, end, label) => {
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(bytes.subarray(start, end));
			} catch (cause) {
				throw new TypeError(`NIBArchive ${label} is not valid UTF-8`, { cause });
			}
		};
		readVarint = (bytes, cursor, end) => {
			let value = 0;
			let shift = 0;
			for (let index = 0; index < 5; index += 1) {
				ensureRange(cursor.offset, 1, end, "variable integer");
				const byte = bytes[cursor.offset++] ?? 0;
				value += (byte & 127) * 2 ** shift;
				if ((byte & 128) !== 0) {
					if (value > 2147483647) throw new TypeError("NIBArchive variable integer is out of range");
					return value;
				}
				shift += 7;
			}
			throw new TypeError("NIBArchive variable integer is too long");
		};
		checkedEnd = (start, length, limit, label) => {
			if (!Number.isSafeInteger(length) || length < 0 || start + length > limit) throw new TypeError(`NIBArchive ${label} exceeds its table`);
			return start + length;
		};
		ensureRange = (start, length, limit, label) => {
			checkedEnd(start, length, limit, label);
		};
		assertOrderedOffsets = (length, offsets) => {
			let previous = 50;
			for (const offset of offsets) {
				if (offset < previous || offset > length) throw new TypeError("NIBArchive table offsets are out of order");
				previous = offset;
			}
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/NibViewHierarchy.js
var projectNibViewHierarchy, mergeNibHierarchies, wouldCycle, reference, collectNibParents, invalidReference;
function init_NibViewHierarchy() {
	return (init_NibViewHierarchy = __esmMin((() => {
		projectNibViewHierarchy = (objects, retainedIds, reserveNode = () => true, maxNodes = 2e4) => {
			const { parents, involved, invalid } = collectNibParents(objects, retainedIds);
			if (parents.size === 0) return {
				hierarchy: null,
				omitted: invalid
			};
			const children = new Map();
			for (const [child, parent] of parents) {
				if (!retainedIds.has(parent) || !retainedIds.has(child)) continue;
				const siblings = children.get(parent) ?? [];
				siblings.push(child);
				children.set(parent, siblings);
			}
			const roots = [];
			const pending = [];
			for (const id of involved) if (!parents.has(id)) pending.push({
				id,
				depth: 0,
				output: roots
			});
			const visited = new Set();
			while (pending.length > 0) {
				const item = pending.pop();
				if (item === undefined) break;
				if (visited.has(item.id) || item.depth > 128 || visited.size >= maxNodes || !reserveNode()) continue;
				visited.add(item.id);
				const node = {
					objectID: String(item.id),
					children: []
				};
				item.output.push(node);
				for (const child of [...children.get(item.id) ?? []].reverse()) pending.push({
					id: child,
					depth: item.depth + 1,
					output: node.children
				});
			}
			return {
				hierarchy: roots,
				omitted: involved.size - visited.size + invalid
			};
		};
		mergeNibHierarchies = (legacy, recovered, reserveNode = () => true, maxNodes = 2e4) => {
			const existing = new Map();
			const owners = new Map();
			const parents = new Map();
			const pending = legacy.map((node) => ({
				node,
				output: legacy,
				parent: null
			}));
			while (pending.length > 0) {
				const entry = pending.pop();
				if (entry === undefined || existing.has(entry.node.objectID)) continue;
				existing.set(entry.node.objectID, entry.node);
				owners.set(entry.node.objectID, entry.output);
				if (entry.parent !== null) parents.set(entry.node.objectID, entry.parent);
				pending.push(...entry.node.children.map((node) => ({
					node,
					output: entry.node.children,
					parent: entry.node.objectID
				})));
			}
			let omitted = 0;
			const additions = recovered.map((node) => ({
				node,
				output: legacy,
				parent: null
			}));
			while (additions.length > 0) {
				const entry = additions.pop();
				if (entry === undefined) break;
				let target = existing.get(entry.node.objectID);
				if (target === undefined) {
					if (existing.size >= maxNodes || !reserveNode()) {
						omitted += 1;
						continue;
					}
					target = {
						objectID: entry.node.objectID,
						children: []
					};
					existing.set(target.objectID, target);
					entry.output.push(target);
					owners.set(target.objectID, entry.output);
					if (entry.parent !== null) parents.set(target.objectID, entry.parent);
				} else if (entry.parent !== null && owners.get(target.objectID) !== entry.output) {
					const owner = owners.get(target.objectID);
					if (owner !== legacy || wouldCycle(target.objectID, entry.parent, parents)) {
						omitted += 1;
					} else {
						owner.splice(owner.indexOf(target), 1);
						entry.output.push(target);
						owners.set(target.objectID, entry.output);
						parents.set(target.objectID, entry.parent);
					}
				}
				for (const node of [...entry.node.children].reverse()) additions.push({
					node,
					output: target.children,
					parent: target.objectID
				});
			}
			return {
				hierarchy: legacy,
				omitted
			};
		};
		wouldCycle = (child, parent, parents) => {
			const seen = new Set();
			let current = parent;
			while (current !== undefined && !seen.has(current)) {
				if (current === child) return true;
				seen.add(current);
				current = parents.get(current);
			}
			return false;
		};
		reference = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
			return typeof value.$nib_object_ref === "number" ? value.$nib_object_ref : null;
		};
		collectNibParents = (objects, retainedIds) => {
			const parents = new Map();
			const involved = new Set();
			let invalid = 0;
			for (const object of objects) {
				if (!retainedIds.has(object.id)) continue;
				const child = reference(object.values.NSWindowView);
				if (object.class_name.replace(/\0+$/u, "") === "NSWindowTemplate" && invalidReference(object.values.NSWindowView)) invalid += 1;
				if (object.class_name.replace(/\0+$/u, "") === "NSWindowTemplate" && child !== null) {
					parents.set(child, object.id);
					involved.add(object.id);
					involved.add(child);
				}
				const parent = reference(object.values.NSSuperview);
				if (invalidReference(object.values.NSSuperview)) invalid += 1;
				if (parent === null) continue;
				parents.set(object.id, parent);
				involved.add(object.id);
				if (retainedIds.has(parent)) involved.add(parent);
			}
			return {
				parents,
				involved,
				invalid
			};
		};
		invalidReference = (value) => value !== undefined && value !== null && reference(value) === null;
	})))();
}

//#endregion
//#region dist/artifacts/apple/InterfaceBuilderAnalysis.js
var MAX_AGGREGATE_INPUT_BYTES, MAX_AGGREGATE_DECODE_BYTES, MAX_REPORTED_OMITTED_ARCHIVES, analyzeInterfaceBuilderBundle, selectInterfaceBuilderCandidates, retainCandidate, finalizeHierarchyCoverage, projectNibArchive, isInterfaceBuilderArchive, readEntry, decodePlist;
function init_InterfaceBuilderAnalysis() {
	return (init_InterfaceBuilderAnalysis = __esmMin((() => {
		init_appleAssetCatalog();
		init_interfaceBuilderKeyedArchive();
		init_DirectoryArtifactReader();
		init_plistValue();
		init_propertyListKeys();
		init_NibArchive();
		init_InterfaceBuilderDecodeBudget();
		init_interfaceBuilderGraph();
		init_NibViewHierarchy();
		init_jsonValue();
		init_unicodeCodePointOrder();
		init_propertyListXmlText();
		init_appleArchiveFormat();
		MAX_AGGREGATE_INPUT_BYTES = 32 * 1024 * 1024;
		MAX_AGGREGATE_DECODE_BYTES = 256 * 1024 * 1024;
		MAX_REPORTED_OMITTED_ARCHIVES = 64;
		analyzeInterfaceBuilderBundle = async (input) => {
			const limits = interfaceBuilderLimitsSchema.parse(input.limits ?? {});
			const reader = new DirectoryArtifactReader(input.bundlePath);
			const documents = [];
			const invalid = [];
			const omittedArchives = [];
			let unreportedOmittedArchives = 0;
			const incompleteHierarchies = new Map();
			const unresolvedConnections = new Map();
			const prototypeKeyOmissions = new Map();
			let omitted = 0;
			let attempted = 0;
			let aggregateInputBytes = 0;
			const decodeBudget = new InterfaceBuilderDecodeBudget(MAX_AGGREGATE_DECODE_BYTES);
			const recordOmittedArchive = (path, reason) => {
				if (omittedArchives.length < MAX_REPORTED_OMITTED_ARCHIVES) omittedArchives.push({
					path,
					reason
				});
				else unreportedOmittedArchives += 1;
			};
			try {
				const selection = await selectInterfaceBuilderCandidates(reader, input.signal, limits.max_documents);
				omitted = selection.omitted;
				for (const entry of selection.omittedSamples) recordOmittedArchive(entry.path, "max_documents");
				unreportedOmittedArchives += selection.unreportedOmitted;
				for (const entry of selection.selected) {
					try {
						const remainingInputBytes = MAX_AGGREGATE_INPUT_BYTES - aggregateInputBytes;
						if (entry.declaredSize !== null && entry.declaredSize > remainingInputBytes) {
							omitted += 1;
							recordOmittedArchive(entry.path, "aggregate_decode_budget_exhausted");
							continue;
						}
						attempted += 1;
						const bytes = await readEntry(reader, entry, input.signal, remainingInputBytes);
						aggregateInputBytes += bytes.length;
						const isNibArchive = hasNibArchiveSignature(bytes);
						let nib = null;
						let xmlText;
						let binaryPrototypeKeyObserved = false;
						if (isNibArchive) {
							const documentBudget = new InterfaceBuilderDecodeBudget(decodeBudget.remainingBytes);
							nib = projectNibArchive(decodeNibArchive(bytes, documentBudget), documentBudget, limits.max_objects);
							decodeBudget.reserve(documentBudget.usedBytes, "NIBArchive representation exceeds the aggregate Interface Builder decode budget");
						} else {
							if (!hasBinaryPlistSignature(bytes)) xmlText = decodeXmlPlistText(bytes);
							const decodedReservation = preflightPropertyListDecode(bytes, decodeBudget.remainingBytes, xmlText);
							decodeBudget.reserve(decodedReservation.estimatedBytes, "plist representation exceeds the aggregate Interface Builder decode budget");
							binaryPrototypeKeyObserved = decodedReservation.binaryPrototypeKeyObserved;
						}
						const { value: raw, omittedPrototypeKeys } = nib === null ? decodePlist(bytes, xmlText, binaryPrototypeKeyObserved) : {
							value: nib.raw,
							omittedPrototypeKeys: 0
						};
						if (nib !== null && nib.omitted > 0) incompleteHierarchies.set(entry.path, nib.omitted);
						if (nib !== null && nib.unresolvedConnections > 0) unresolvedConnections.set(entry.path, nib.unresolvedConnections);
						if (omittedPrototypeKeys !== 0) prototypeKeyOmissions.set(entry.path, omittedPrototypeKeys);
						const documentHash = createHash("sha256").update(bytes).digest("hex");
						documents.push({
							relativePath: entry.path,
							archiveSha256: documentHash,
							documentKind: entry.path.includes(".storyboardc/") ? "storyboard_scene" : "nib",
							raw,
							...nib === null || nib.omitted === 0 ? {} : { omittedSerializedHierarchyReferences: nib.omitted }
						});
					} catch (cause) {
						if (input.signal?.aborted === true) throw cause;
						if (cause instanceof InterfaceBuilderDecodeBudgetExceeded) {
							omitted += 1;
							recordOmittedArchive(entry.path, cause.reason);
							continue;
						}
						invalid.push(`${entry.path}: ${cause instanceof Error ? cause.message : "archive decode failed"}`);
					}
				}
			} finally {
				await reader.close();
			}
			const result = buildInterfaceBuilderAnalysis({
				targetSha256: input.targetSha256,
				toolVersion: "rea-interface-builder/1",
				documents,
				limits
			});
			return finalizeHierarchyCoverage(result, {
				incompleteHierarchies,
				unresolvedConnections,
				prototypeKeyOmissions,
				invalid,
				omittedArchives,
				unreportedOmittedArchives,
				attempted,
				omitted
			});
		};
		selectInterfaceBuilderCandidates = async (reader, signal, maximumDocuments) => {
			const capacity = maximumDocuments + MAX_REPORTED_OMITTED_ARCHIVES;
			const candidates = [];
			let total = 0;
			for await (const entry of reader.entries(signal)) {
				if (entry.kind !== "file" || !isInterfaceBuilderArchive(entry.path)) continue;
				total += 1;
				retainCandidate(candidates, entry, capacity);
			}
			const omittedSamples = candidates.slice(maximumDocuments, capacity);
			return {
				selected: candidates.slice(0, maximumDocuments),
				omittedSamples,
				omitted: Math.max(0, total - maximumDocuments),
				unreportedOmitted: Math.max(0, total - maximumDocuments - omittedSamples.length)
			};
		};
		retainCandidate = (candidates, entry, maximum) => {
			let low = 0;
			let high = candidates.length;
			while (low < high) {
				const middle = Math.floor((low + high) / 2);
				const existing = candidates[middle];
				if (existing !== undefined && compareUnicodeCodePoints(existing.path, entry.path) < 0) low = middle + 1;
				else high = middle;
			}
			candidates.splice(low, 0, entry);
			if (candidates.length > maximum) candidates.pop();
		};
		finalizeHierarchyCoverage = (result, counts) => {
			const { incompleteHierarchies, unresolvedConnections, prototypeKeyOmissions, invalid, omittedArchives, unreportedOmittedArchives } = counts;
			const archiveDecodePartial = invalid.length > 0 || prototypeKeyOmissions.size > 0 || omittedArchives.length > 0;
			return {
				...result,
				documents: result.documents.map((document) => ({
					...document,
					connection_count: document.connection_count + (unresolvedConnections.get(document.relative_path) ?? 0)
				})),
				graph: {
					...result.graph,
					coverage: [...result.graph.coverage.map((facet) => {
						const omittedConnection = unresolvedConnections.get(facet.facet.replace(/^connections:/u, ""));
						return facet.facet.startsWith("connections:") && omittedConnection !== undefined ? {
							...facet,
							status: "partial",
							reason: facet.reason ?? "connection_unresolved",
							omitted: facet.omitted + omittedConnection
						} : facet;
					}), {
						facet: "archive_decode",
						status: archiveDecodePartial ? "partial" : "complete",
						reason: omittedArchives.some(({ reason }) => reason === "aggregate_decode_budget_exhausted") ? "aggregate_decode_budget_exhausted" : omittedArchives.some(({ reason }) => reason === "max_documents") ? "document_limit_reached" : omittedArchives.length > 0 ? "archive_decode_budget_exhausted" : invalid.length > 0 ? "one_or_more_archives_invalid" : prototypeKeyOmissions.size > 0 ? "dictionary_entries_omitted" : null,
						examined: counts.attempted,
						omitted: counts.omitted
					}],
					truncated: result.graph.truncated || counts.omitted > 0 || archiveDecodePartial || unresolvedConnections.size > 0
				},
				limitations: [
					...result.limitations,
					"Compiled Interface Builder archives are private serialized object graphs. The decoder reports only recognized keyed-archive objects and connections; unrecognized object classes and fields remain unknown.",
					...incompleteHierarchies.size === 0 ? [] : ["Some serialized hierarchy links could not be projected within the bounded hierarchy; their parentage remains unknown."],
					...unresolvedConnections.size === 0 ? [] : ["Some recognized NIBArchive connectors declare no resolvable owner; they carry no connection evidence and are reported as omissions."],
					...invalid.length === 0 ? [] : [`Some Interface Builder archives could not be decoded: ${invalid.slice(0, 16).join("; ")}`],
					...[...prototypeKeyOmissions].map(([path, count]) => `${path}: ${omittedPrototypeKeysLimitation(count)}`),
					...omittedArchives.map(({ path, reason }) => `${path}: omitted because ${reason.replaceAll("_", " ")}.`),
					...unreportedOmittedArchives === 0 ? [] : [`${unreportedOmittedArchives} additional omitted archive path(s) and their reasons were not retained; reporting is bounded to ${MAX_REPORTED_OMITTED_ARCHIVES} paths.`]
				]
			};
		};
		projectNibArchive = (archive, budget, maxHierarchyNodes) => {
			const byId = new Map(archive.objects.map((object) => [object.id, object]));
			const normalizedClassNames = new Map();
			const normalizeClassName = (value) => {
				const known = normalizedClassNames.get(value);
				if (known !== undefined) return known;
				const normalized = value.replace(/\0+$/u, "");
				normalizedClassNames.set(value, normalized);
				return normalized;
			};
			const decodedStrings = new Map();
			const decodedString = (objectId, object) => {
				if (decodedStrings.has(objectId)) return decodedStrings.get(objectId) ?? null;
				const data = object.values["NS.bytes"];
				if (typeof data !== "object" || data === null || Array.isArray(data)) {
					decodedStrings.set(objectId, null);
					return null;
				}
				const encoded = data.$nib_data_base64;
				if (typeof encoded !== "string") {
					decodedStrings.set(objectId, null);
					return null;
				}
				budget.reserve(64 + encoded.length * 2, "NIBArchive string projection exceeds the aggregate Interface Builder decode budget");
				const value = Buffer.from(encoded, "base64").toString("utf8");
				decodedStrings.set(objectId, value);
				return value;
			};
			let projectedFields = 0;
			for (const object of archive.objects) projectedFields += Object.keys(object.values).length;
			budget.reserve(archive.objects.length * 128 + projectedFields * 128, "NIBArchive graph projection exceeds the aggregate Interface Builder decode budget");
			budget.reserve(archive.classes.length * 96, "NIBArchive class projection exceeds the aggregate Interface Builder decode budget");
			const dereference = (value) => {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return value;
				const encodedData = value.$nib_data_base64;
				if (typeof encodedData === "string") {
					budget.reserveBase64JsonStringOccurrence(encodedData);
					return value;
				}
				const ref = value.$nib_object_ref;
				if (typeof ref !== "number") return value;
				const target = byId.get(ref);
				if (target === undefined) return undefined;
				if (normalizeClassName(target.class_name) === "NSString") {
					const string = decodedString(ref, target);
					if (string !== null) {
						budget.reserveJsonStringOccurrence(string);
						return string;
					}
				}
				return { objectID: String(ref) };
			};
			const referencedString = (value) => {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
				const ref = value.$nib_object_ref;
				if (typeof ref !== "number") return null;
				const target = byId.get(ref);
				if (target === undefined || normalizeClassName(target.class_name) !== "NSString") return null;
				const string = decodedString(ref, target);
				if (string === null) return null;
				budget.reserveJsonStringOccurrence(string);
				return string;
			};
			const runtimeClasses = new Map();
			const runtimeClass = (objectId) => {
				if (runtimeClasses.has(objectId)) return runtimeClasses.get(objectId) ?? null;
				const object = byId.get(objectId);
				if (object === undefined) return null;
				const storedClass = normalizeClassName(object.class_name);
				const resolvedClass = storedClass === "NSClassSwapper" ? referencedString(object.values.NSClassName) ?? storedClass : storedClass === "UIClassSwapper" ? referencedString(object.values.UIClassName) ?? storedClass : storedClass;
				runtimeClasses.set(objectId, resolvedClass);
				return resolvedClass;
			};
			const objects = Object.fromEntries(archive.objects.filter((object) => {
				const name = runtimeClass(object.id) ?? "";
				return !/^(?:NSObject|NSIBObjectData|NSString|NSMutableString|NSNumber|NSArray|NSMutableArray|NSSet|NSMutableSet|NSDictionary|NSMutableDictionary|NSApplication|NSNib.*Connector)$/u.test(name) && !isUIKitRuntimeConnectionClass(name);
			}).map((object) => {
				const className = runtimeClass(object.id) ?? normalizeClassName(object.class_name);
				budget.reserveJsonStringOccurrence(className);
				let name = className;
				for (const [key, value] of Object.entries(object.values)) {
					if (!/(?:title|label|identifier|accessibility|name|contents)/iu.test(key)) continue;
					const resolved = dereference(value);
					if (typeof resolved !== "string") continue;
					name = resolved;
					break;
				}
				budget.reserveJsonStringOccurrence(name);
				const nibValues = Object.fromEntries(Object.entries(object.values).map(([key, value]) => {
					budget.reserveJsonPropertyNameOccurrence(key);
					return [key, dereference(value) ?? null];
				}));
				const resourceFields = appleResourceKeyFields(nibValues);
				for (const [field, value] of resourceFields) {
					budget.reserveJsonPropertyNameOccurrence(field);
					budget.reserveJsonStringOccurrence(value);
				}
				return [String(object.id), {
					customClass: className,
					label: name,
					objectID: String(object.id),
					nibValues,
					...Object.fromEntries(resourceFields)
				}];
			}));
			const connections = {};
			const hierarchy = [];
			let unresolvedConnections = 0;
			const reference = (value) => {
				if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
				return typeof value.$nib_object_ref === "number" ? value.$nib_object_ref : null;
			};
			for (const object of archive.objects) {
				const className = normalizeClassName(object.class_name);
				const uiKit = isUIKitRuntimeConnectionClass(className);
				if (!uiKit && !className.includes("Connector")) continue;
				const values = object.values;
				const connectionFields = interfaceBuilderConnectionFieldNames(className);
				const source = reference(values[connectionFields.source]);
				if (source === null) {
					unresolvedConnections += 1;
					continue;
				}
				const destination = reference(values[connectionFields.destination]);
				const label = referencedString(values[connectionFields.label]);
				const type = className.includes("Outlet") ? "outlet" : className.includes("Control") || className.includes("Event") ? "action" : className;
				budget.reserveJsonStringOccurrence(type);
				const eventMask = values.UIEventMask;
				(connections[String(source)] ??= []).push({
					type,
					"destination-id": destination === null ? null : String(destination),
					label,
					source_id: String(source),
					archive_object_id: String(object.id),
					...typeof eventMask === "number" ? { ui_event_mask: eventMask } : {}
				});
			}
			let hierarchyOmitted = 0;
			let hierarchyNodeCount = 0;
			const hierarchyFor = (objectId, seen, depth) => {
				if (depth > 32 || seen.has(objectId)) {
					hierarchyOmitted += 1;
					return null;
				}
				if (hierarchyNodeCount >= maxHierarchyNodes) {
					hierarchyOmitted += 1;
					return null;
				}
				if (!budget.tryReserve(128)) {
					hierarchyOmitted += 1;
					return null;
				}
				const object = byId.get(objectId);
				if (object === undefined) {
					hierarchyOmitted += 1;
					return null;
				}
				hierarchyNodeCount += 1;
				const nextSeen = new Set(seen).add(objectId);
				const children = [];
				for (const [key, value] of Object.entries(object.values)) {
					if (!/(?:subviews|contentview|childviewcontrollers|view)$/iu.test(key)) continue;
					const direct = reference(value);
					if (direct === null) continue;
					const target = byId.get(direct);
					if (target === undefined) {
						hierarchyOmitted += 1;
						continue;
					}
					if (/array|set/iu.test(target.class_name)) {
						for (const candidate of Object.values(target.values)) {
							const child = reference(candidate);
							const nested = child === null ? null : hierarchyFor(child, nextSeen, depth + 1);
							if (nested !== null) children.push(nested);
						}
					} else {
						const nested = hierarchyFor(direct, nextSeen, depth + 1);
						if (nested !== null) children.push(nested);
					}
				}
				return {
					objectID: String(objectId),
					children
				};
			};
			const ibData = archive.objects.find(({ class_name }) => normalizeClassName(class_name) === "NSIBObjectData");
			const rootId = reference(ibData?.values.NSRoot);
			const hierarchyRoots = rootId === null ? [] : [rootId];
			for (const hierarchyRoot of hierarchyRoots) {
				const root = hierarchyFor(hierarchyRoot, new Set(), 0);
				if (root !== null) hierarchy.push(root);
			}
			const viewHierarchy = projectNibViewHierarchy(archive.objects, new Set(Object.keys(objects).map(Number)), () => budget.tryReserve(128), maxHierarchyNodes);
			const merged = mergeNibHierarchies(hierarchy, viewHierarchy.hierarchy ?? [], () => budget.tryReserve(96), maxHierarchyNodes);
			return {
				omitted: viewHierarchy.omitted + hierarchyOmitted + merged.omitted,
				unresolvedConnections,
				raw: jsonValueSchema.parse({
					"com.apple.ibtool.document.objects": objects,
					"com.apple.ibtool.document.connections": connections,
					"com.apple.ibtool.document.hierarchy": merged.hierarchy,
					"com.apple.ibtool.document.classes": Object.fromEntries(archive.classes.map((name) => {
						const className = normalizeClassName(name);
						budget.reserveJsonPropertyNameOccurrence(className);
						return [className, {}];
					}))
				})
			};
		};
		isInterfaceBuilderArchive = (path) => {
			const lower = path.toLowerCase();
			return lower.endsWith(".nib") || lower.endsWith("/objects.nib");
		};
		readEntry = async (reader, entry, signal, maxInputBytes = MAX_AGGREGATE_INPUT_BYTES) => {
			if (entry.declaredSize !== null && entry.declaredSize > maxInputBytes) throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "archive exceeds the aggregate Interface Builder decode budget");
			const stream = await reader.open(entry, signal);
			const chunks = [];
			let length = 0;
			for await (const chunk of stream) {
				const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				length += bytes.length;
				if (length > maxInputBytes) {
					stream.destroy();
					throw new InterfaceBuilderDecodeBudgetExceeded("aggregate_decode_budget_exhausted", "archive exceeded the aggregate Interface Builder decode budget");
				}
				chunks.push(bytes);
			}
			return Buffer.concat(chunks, length);
		};
		decodePlist = (bytes, xmlText, binaryPrototypeKeyObserved) => {
			const binary = hasBinaryPlistSignature(bytes);
			const { value, omittedPrototypeKeys } = binary ? {
				value: parseBinary(bytes),
				omittedPrototypeKeys: binaryPrototypeKeyObserved ? null : 0
			} : parseXmlPropertyList(xmlText ?? decodeXmlPlistText(bytes));
			return {
				value: projectPlistValue(value).value,
				omittedPrototypeKeys
			};
		};
	})))();
}

//#endregion
//#region dist/artifacts/apple/AppleAssetCatalogAnalysis.js
var ASSETUTIL, MAX_CATALOG_BYTES, MAX_TOTAL_METADATA_BYTES, analyzeAppleAssetCatalogs, collectAssetCatalogs, inspectAssetCatalogEntry, collectInterfaceBuilderResourceKeys, runAssetUtil, digestBounded;
function init_AppleAssetCatalogAnalysis() {
	return (init_AppleAssetCatalogAnalysis = __esmMin((() => {
		init_DirectoryArtifactReader();
		init_ArtifactReader();
		init_InterfaceBuilderAnalysis();
		init_appleAssetCatalog();
		init_ExecFileOutput();
		ASSETUTIL = "/usr/bin/assetutil";
		MAX_CATALOG_BYTES = 64 * 1024 * 1024;
		MAX_TOTAL_METADATA_BYTES = 64 * 1024 * 1024;
		analyzeAppleAssetCatalogs = async (input) => {
			if (process.platform !== "darwin" && input.runAssetUtil === undefined) throw new ArtifactReaderFailure("unavailable", "Apple asset catalog inspection requires macOS assetutil");
			const page = appleAssetCatalogInputSchema.parse(input.page ?? {});
			const interfaceBuilderCancel = new AbortController();
			const interfaceBuilderAnalysis = (input.analyzeInterfaceBuilder ?? analyzeInterfaceBuilderBundle)({
				bundlePath: input.bundlePath,
				targetSha256: input.targetSha256,
				signal: input.signal === undefined ? interfaceBuilderCancel.signal : AbortSignal.any([input.signal, interfaceBuilderCancel.signal])
			}).then((value) => ({
				ok: true,
				value
			}), (error) => ({
				ok: false,
				error
			}));
			let catalogs;
			let uninspected;
			try {
				({catalogs, uninspected} = await collectAssetCatalogs(input));
			} catch (cause) {
				interfaceBuilderCancel.abort();
				await interfaceBuilderAnalysis;
				throw cause;
			}
			const analyzed = await interfaceBuilderAnalysis;
			if (!analyzed.ok) throw analyzed.error;
			const interfaceBuilder = analyzed.value;
			const resourceReferences = collectInterfaceBuilderResourceKeys(interfaceBuilder.graph.nodes);
			const result = projectAppleAssetCatalogPage({
				targetSha256: input.targetSha256,
				catalogs,
				offset: page.offset,
				limit: page.limit,
				resourceReferences
			});
			return {
				...result,
				limitations: [
					...result.limitations,
					...catalogs.length === 0 ? ["No compiled Assets.car catalog was found among the app bundle's regular files (symlinks are not followed); any resource keys are reported as unmatched."] : [],
					...uninspected.length === 0 ? [] : [`Asset catalog entries that are not regular files were not inspected, so resource keys reported as unmatched may resolve there: ${uninspected.join(", ")}`],
					"Exact resource-key joins use only recognized image or asset key fields on decoded Interface Builder resource objects; other archive resource references are not inferred.",
					...interfaceBuilder.graph.truncated ? ["Interface Builder resource-key joins may be incomplete because the decoded UI graph was truncated."] : []
				]
			};
		};
		collectAssetCatalogs = async (input) => {
			const reader = new DirectoryArtifactReader(input.bundlePath);
			const catalogs = [];
			const uninspected = [];
			let totalMetadataBytes = 0;
			try {
				for await (const entry of reader.entries(input.signal)) {
					if (!entry.path.endsWith("Assets.car")) continue;
					if (entry.kind !== "file") {
						uninspected.push(`${entry.path} (${entry.kind})`);
						continue;
					}
					const inspected = await inspectAssetCatalogEntry({
						reader,
						entry,
						runAssetUtil: input.runAssetUtil ?? ((path, signal) => runAssetUtil(path, input.environment, signal)),
						...input.signal === undefined ? {} : { signal: input.signal }
					});
					totalMetadataBytes += inspected.metadataBytes;
					if (totalMetadataBytes > MAX_TOTAL_METADATA_BYTES) throw new ArtifactReaderFailure("limit", `Combined asset catalog metadata exceeds ${MAX_TOTAL_METADATA_BYTES} bytes`);
					catalogs.push(inspected.catalog);
				}
			} finally {
				await reader.close();
			}
			if (catalogs.length === 0 && uninspected.length > 0) throw new ArtifactReaderFailure("path", `Asset catalog entries are not regular files and were not inspected: ${uninspected.join(", ")}`);
			return {
				catalogs,
				uninspected
			};
		};
		inspectAssetCatalogEntry = async (input) => {
			const { entry, reader, signal } = input;
			const sha256 = await digestBounded(reader, entry, signal);
			const before = await lstat(entry.adapterKey, { bigint: true });
			if (!before.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, before)) throw new ArtifactReaderFailure("integrity", `Asset catalog changed before inspection: ${entry.path}`);
			const output = await input.runAssetUtil(entry.adapterKey, signal);
			const after = await lstat(entry.adapterKey, { bigint: true });
			if (!after.isFile() || !sameArtifactSourceIdentity(entry.sourceIdentity, after) || await digestBounded(reader, entry, signal) !== sha256) throw new ArtifactReaderFailure("integrity", `Asset catalog changed during inspection: ${entry.path}`);
			let parsed;
			try {
				parsed = JSON.parse(output);
			} catch (cause) {
				throw new ArtifactReaderFailure("format", `assetutil returned invalid JSON for ${entry.path}`, { cause });
			}
			try {
				return {
					catalog: {
						path: entry.path,
						sha256,
						records: parseAppleAssetCatalogRecords(parsed)
					},
					metadataBytes: Buffer.byteLength(output, "utf8")
				};
			} catch (cause) {
				throw new ArtifactReaderFailure("format", `assetutil returned an unsupported record for ${entry.path}`, { cause });
			}
		};
		collectInterfaceBuilderResourceKeys = (nodes) => nodes.flatMap((node) => {
			if (node.kind !== "resource") return [];
			const source = node.evidence.find((item) => item.artifact_path !== null && item.artifact_sha256 !== null);
			const sourcePath = source?.artifact_path;
			const sourceArchiveSha256 = source?.artifact_sha256;
			if (sourcePath == null || sourceArchiveSha256 == null) return [];
			return appleResourceKeyFields(node.attributes).flatMap(([field, value]) => [{
				sourceNodeId: node.id,
				sourcePath,
				sourceArchiveSha256,
				field,
				key: value
			}]);
		});
		runAssetUtil = async (path, environment, signal) => {
			try {
				return (await execFileOutput(ASSETUTIL, ["--info", path], {
					env: environment,
					timeout: 6e4,
					maxBuffer: MAX_CATALOG_BYTES,
					...signal === undefined ? {} : { signal }
				})).stdout;
			} catch (cause) {
				if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Asset catalog inspection cancelled");
				const code = typeof cause === "object" && cause !== null && "code" in cause ? cause.code : undefined;
				throw new ArtifactReaderFailure(code === "ENOENT" ? "unavailable" : code === "ETIMEDOUT" || code === "ERR_CHILD_PROCESS_STDIO_MAXBUFFER" ? "limit" : "io", `assetutil failed${code === undefined ? "" : ` (${String(code)})`}`, { cause });
			}
		};
		digestBounded = async (reader, entry, signal) => {
			if (entry.declaredSize === null || entry.declaredSize > MAX_CATALOG_BYTES) throw new ArtifactReaderFailure("limit", `Asset catalog exceeds ${MAX_CATALOG_BYTES} bytes: ${entry.path}`);
			const stream = await reader.open(entry, signal);
			const hash = createHash("sha256");
			let length = 0;
			for await (const chunk of stream) {
				if (signal?.aborted === true) throw new ArtifactReaderFailure("cancelled", "Asset catalog inspection cancelled");
				const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				length += bytes.length;
				if (length > MAX_CATALOG_BYTES) throw new ArtifactReaderFailure("limit", `Asset catalog exceeds byte limit: ${entry.path}`);
				hash.update(bytes);
			}
			return hash.digest("hex");
		};
	})))();
}

//#endregion
//#region dist/artifacts/ArtifactProvider.js
var ArtifactProvider, ArtifactClient, isArtifactOperation, translateArtifactFailure, subjectFor;
function init_ArtifactProvider() {
	return (init_ArtifactProvider = __esmMin((() => {
		init_snapshotEnvironment();
		init_AnalysisProvider();
		init_KeyedArchiveReader();
		init_DylibResolutionReader();
		init_ArtifactInventory();
		init_ArtifactExtraction();
		init_InterfaceBuilderAnalysis();
		init_AppleAssetCatalogAnalysis();
		init_artifactToolContracts();
		init_binaryTargetTypes();
		init_analysisErrorCore();
		init_artifactOperationError();
		init_interfaceBuilderGraph();
		init_result();
		init_ArtifactReader();
		init_ArtifactResourceScope();
		init_ArtifactProviderMetadata();
		init_InvestigationProviders();
		init_evidence();
		init_immutableJson();
		init_artifactInspection();
		init_providerCleanupError();
		ArtifactProvider = class {
			#capabilities;
			#platform;
			environment;
			constructor(environment, platform = process.platform) {
				this.environment = snapshotEnvironment(environment, platform);
				this.#capabilities = artifactCapabilities(platform);
				this.#platform = platform;
			}
			identity() {
				return ARTIFACT_GRAPH_PROVIDER;
			}
			capabilities() {
				return this.#capabilities;
			}
			createClient(target) {
				return new ArtifactClient(target, this.environment, this.#platform);
			}
		};
		ArtifactClient = class {
			target;
			environment;
			platform;
			#resourceScope = new ArtifactResourceScope();
			constructor(target, environment, platform) {
				this.target = target;
				this.environment = environment;
				this.platform = platform;
			}
			async execute(operation, parameters, options) {
				if (operation === "health") return ok(createAnalysisExecution(null, ARTIFACT_GRAPH_PROVIDER));
				if (!isArtifactOperation(operation)) return err(new AnalysisCapabilityUnavailableError(ARTIFACT_GRAPH_PROVIDER.id, operation, "Operation is not implemented by artifact graph provider."));
				try {
					if (operation === "inspect_artifact") {
						const inspected = await this.inspectArtifact(parameters, options);
						return inspected;
					}
					if (operation === "decode_interface_builder") {
						if (this.target.kind !== "executable" || this.target.sourcePath === undefined || !this.target.sourcePath.toLowerCase().endsWith(".app")) throw this.unsupportedTarget(operation, "decode_interface_builder requires an active .app bundle target");
						const limits = interfaceBuilderLimitsSchema.parse(parameters);
						const result = await analyzeInterfaceBuilderBundle({
							bundlePath: this.target.sourcePath,
							targetSha256: this.target.sha256,
							limits,
							...options?.signal === undefined ? {} : { signal: options.signal }
						});
						return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
							limitations: result.limitations,
							locations: result.documents.map(({ relative_path: path }) => ({
								kind: "artifact-path",
								path
							}))
						}));
					}
					if (operation === "inspect_keyed_archive") {
						const standalone = this.target.kind === "artifact" && this.target.format === "plist";
						if (standalone && parameters.path !== undefined && parameters.path !== "." && parameters.path !== basename(this.target.path)) throw new AnalysisInputError(operation, undefined, [{
							path: ["path"],
							reason: "invalid_value",
							message: "For an active plist, path must select that archive (omit path or use its basename).",
							expected: basename(this.target.path)
						}]);
						const bundlePath = standalone ? dirname(this.target.path) : this.target.sourcePath;
						if (bundlePath === undefined || !standalone && !bundlePath.toLowerCase().endsWith(".app")) throw this.unsupportedTarget(operation, "inspect_keyed_archive requires an active plist or .app bundle");
						const result = await inspectBundleKeyedArchive({
							bundlePath,
							targetSha256: this.target.sha256,
							parameters: standalone ? {
								...parameters,
								path: basename(this.target.path)
							} : parameters,
							platform: this.platform,
							...options?.signal === undefined ? {} : { signal: options.signal }
						});
						if (standalone && result.archive_sha256 !== this.target.sha256) throw new ArtifactReaderFailure("integrity", `Active archive digest changed: expected ${this.target.sha256}, observed ${result.archive_sha256}`);
						return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
							limitations: result.limitations,
							locations: [{
								kind: "artifact-path",
								path: result.archive_path
							}]
						}));
					}
					if (operation === "inspect_asset_catalog") {
						return await this.inspectAssetCatalog(parameters, options);
					}
					if (operation === "trace_dylib_resolution") return await this.traceDylibResolution(parameters, options);
					if (operation === "extract_artifact") {
						const parsed = artifactExtractionExecutionSchema.parse(parameters);
						const result = await extractArtifact({
							inputPath: this.target.sourcePath ?? this.target.path,
							inputFormat: this.target.format,
							outputRoot: parsed.output_root,
							environment: this.environment,
							integrityPolicy: parsed.integrity_policy,
							resourceScope: this.#resourceScope
						}, options?.signal);
						return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
							rawResult: null,
							limitations: result.limitations,
							subject: subjectFor(this.target.sourcePath ?? this.target.path, result.manifest),
							locations: []
						}));
					}
					const parsed = artifactInventoryInputSchema.parse(parameters);
					const result = await this.inventory(parsed, options);
					return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
						rawResult: null,
						limitations: result.limitations,
						subject: subjectFor(this.target.sourcePath ?? this.target.path, result.manifest),
						locations: []
					}));
				} catch (cause) {
					return err(translateArtifactFailure(operation, cause));
				}
			}
			close() {
				return this.#resourceScope.close().then(() => ok(null), (cause) => {
					const failure = cause instanceof ArtifactReaderFailure ? cause : undefined;
					return err(new ProviderCleanupError(ARTIFACT_GRAPH_PROVIDER.id, failure?.cleanup?.resources ?? ["artifact resources"], { reason: failure?.cleanup?.reason ?? (cause instanceof Error ? cause.message : String(cause)) }, {
						cause,
						operation: "close_binary"
					}));
				});
			}
			/** The active target's kind is outside this operation's supported targets. */
			unsupportedTarget(operation, reason) {
				return new AnalysisUnsupportedTargetError(operation, this.target.sourcePath ?? this.target.path, reason);
			}
			async inspectAssetCatalog(parameters, options) {
				const bundlePath = this.target.sourcePath;
				if (this.target.kind !== "executable" || bundlePath === undefined || !bundlePath.toLowerCase().endsWith(".app")) throw this.unsupportedTarget("inspect_asset_catalog", "inspect_asset_catalog requires an active .app bundle target");
				const result = await analyzeAppleAssetCatalogs({
					environment: this.environment,
					bundlePath,
					targetSha256: this.target.sha256,
					page: parameters,
					...options?.signal === undefined ? {} : { signal: options.signal }
				});
				return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
					limitations: result.limitations,
					locations: result.catalogs.map(({ path }) => ({
						kind: "artifact-path",
						path
					}))
				}));
			}
			async traceDylibResolution(parameters, options) {
				if (this.target.kind !== "executable" || !isMachOFormat(this.target.format)) throw this.unsupportedTarget("trace_dylib_resolution", "trace_dylib_resolution requires an active Mach-O or .app bundle target");
				const bundle = this.target.bundleInfoPlist === undefined ? undefined : this.target.sourcePath;
				const result = await traceDylibResolution({
					rootPath: bundle ?? dirname(this.target.path),
					targetPath: this.target.path,
					targetSha256: this.target.sha256,
					enumerateRoots: bundle !== undefined,
					parameters,
					...options?.signal === undefined ? {} : { signal: options.signal }
				});
				return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
					limitations: result.limitations,
					locations: result.images.map(({ path }) => ({
						kind: "artifact-path",
						path
					}))
				}));
			}
			async inspectArtifact(parameters, options) {
				const parsed = artifactInventoryInputSchema.parse(parameters);
				const inventoryParameters = { integrity_policy: parsed.integrity_policy };
				await options?.progress?.report({
					phase: "inspect_artifact.inventory",
					completed: 0,
					total: 1,
					message: "inventory substep started"
				});
				const inventory = freezeJsonSnapshot(await this.inventory(inventoryParameters, options));
				const subject = subjectFor(this.target.sourcePath ?? this.target.path, inventory.manifest);
				const inventoryEvidence = createEvidence(subject, ARTIFACT_GRAPH_PROVIDER, {
					operation: "inventory_artifact",
					parameters: inventoryParameters,
					result: inventory,
					rawResult: null,
					limitations: inventory.limitations,
					locations: []
				});
				const result = freezeJsonSnapshot(createArtifactInspection(inventoryEvidence));
				await options?.progress?.report({
					phase: "inspect_artifact.inventory",
					completed: 1,
					total: 1,
					message: "inventory substep completed"
				});
				return ok(createAnalysisExecution(result, ARTIFACT_GRAPH_PROVIDER, {
					rawResult: null,
					limitations: result.limitations,
					subject,
					locations: []
				}));
			}
			inventory(parsed, options) {
				return inventoryArtifact(this.target.sourcePath ?? this.target.path, {
					resourceScope: this.#resourceScope,
					environment: this.environment,
					...options?.signal === undefined ? {} : { signal: options.signal },
					integrity: { mode: parsed.integrity_policy }
				});
			}
		};
		isArtifactOperation = (operation) => ARTIFACT_ANALYSIS_OPERATIONS.includes(operation);
		translateArtifactFailure = (operation, cause) => {
			if (cause instanceof ArtifactReaderFailure) return new ArtifactOperationError(operation, cause.reason, cause.details, cause.message, {
				...cause.cleanup === undefined ? {} : { cleanup: cause.cleanup },
				...cause.partialObservation === undefined ? {} : { partialObservation: cause.partialObservation }
			});
			if (cause instanceof AnalysisInputError || cause instanceof AnalysisUnsupportedTargetError) return cause;
			return new ArtifactOperationError(operation, "io");
		};
		subjectFor = (path, manifest) => ({
			path,
			sha256: manifest.root_sha256,
			format: manifest.root_format
		});
	})))();
}

//#endregion
init_ArtifactProvider();
export { ArtifactProvider };