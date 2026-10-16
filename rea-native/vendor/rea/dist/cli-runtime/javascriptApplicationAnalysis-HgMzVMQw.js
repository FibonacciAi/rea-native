import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { canonicalJson, canonicalJsonDigestSteps, compareUnicodeCodePoints, digestCanonicalValue, digestSchema, init_artifactGraph, init_canonicalDigest, init_canonicalJsonDigestSteps, init_canonicalOrdering, init_comparisonSemantics, init_digests, init_localPath, init_unicodeCodePointOrder, integrityContradictionSchema, localPathStringSchema, prefixedDigestSchema, uniqueSorted } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { freezeJsonSnapshot, freezeOwnedJsonSnapshotSteps, init_immutableJson, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { z } from "zod";
import { posix } from "node:path";
import { domainToASCII, fileURLToPath, pathToFileURL } from "node:url";
import { TraceMap } from "@jridgewell/trace-mapping";

//#region dist/domain/javascript/javascriptSourceSelection.js
var javaScriptSourcePathsSchema, javaScriptSourceSelectionSchema;
function init_javascriptSourceSelection() {
	return (init_javascriptSourceSelection = __esmMin((() => {
		javaScriptSourcePathsSchema = z.array(z.string().min(1)).min(1).describe("Exact relevant file paths from the artifact inventory, relative to the application root, analyzed in first-request order before unselected scopes; no globs or implicit dependencies. Omit to analyze all sources.");
		javaScriptSourceSelectionSchema = z.strictObject({
			requested_paths: javaScriptSourcePathsSchema,
			unselected_files: z.number().int().min(0)
		});
	})))();
}

//#endregion
//#region dist/domain/zodCollectionSteps.js
/** Elements validated between yields, in the issues and paths a whole-array parse reports. */
function* parseElementSteps(element, values, path, issues) {
	const parsed = [];
	for (const [index, value] of values.entries()) {
		if (index % 64 === 0) yield;
		const result = element.safeParse(value);
		if (result.success) parsed.push(result.data);
		else issues.push(...result.error.issues.map((issue) => ({
			...issue,
			path: [
				...path,
				index,
				...issue.path
			]
		})));
	}
	return parsed;
}
var arrayContainerSchema;
function init_zodCollectionSteps() {
	return (init_zodCollectionSteps = __esmMin((() => {
		arrayContainerSchema = (array) => array.clone({
			...array.def,
			element: z.unknown()
		});
	})))();
}

//#endregion
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
//#region dist/domain/javascript/javascriptApplicationEvidenceSchemas.js
var boundedTextSchema$2, boundedKeySchema, unsafePathSegments, isSafeRelativePath, relativePathSchema$1, applicationEvidenceAuthoritySchema, applicationFactStateSchema, applicationConfidenceSchema, applicationUnavailableReasonSchema, unavailableFactSchema, availableArtifactSchema, applicationArtifactReferenceSchema, sourceRangeSchema$1, fileOffsetRangeSchema, applicationLocationSchema, applicationLocationReferenceSchema, applicationExtractorSchema, applicationLimitSchema, coverageLimitsSchema, omittedCountSchema, applicationCoverageSchema, completeApplicationCoverage, partialApplicationCoverage, truncatedApplicationCoverage, applicationGraphEvidenceBaseSchema, applicationGraphEvidenceContextSchema, applicationGraphEvidenceLocationSchema, checkAuthorityState, checkStateConfidence, checkTraceability, checkArtifactBacking, applicationGraphEvidenceSchema, applicationNodeIdentitySchema;
function init_javascriptApplicationEvidenceSchemas() {
	return (init_javascriptApplicationEvidenceSchemas = __esmMin((() => {
		init_digests();
		boundedTextSchema$2 = z.string().min(1);
		boundedKeySchema = z.string().min(1);
		unsafePathSegments = new Set([
			"",
			".",
			".."
		]);
		isSafeRelativePath = (path) => {
			if (path.startsWith("/")) return false;
			return path.split("/").every((part) => !unsafePathSegments.has(part));
		};
		relativePathSchema$1 = z.string().min(1).refine(isSafeRelativePath, "Expected a normalized relative POSIX path without traversal");
		applicationEvidenceAuthoritySchema = z.enum([
			"artifact-bytes",
			"ast-static-analysis",
			"static-relationship-inference",
			"passive-cdp-runtime",
			"cross-layer-reconciliation",
			"cross-version-comparison",
			"controlled-replay",
			"native-analysis-provider",
			"managed-static-analysis",
			"historical-reference",
			"user-assertion",
			"unknown"
		]);
		applicationFactStateSchema = z.enum([
			"observed",
			"inferred",
			"unknown",
			"unavailable"
		]);
		applicationConfidenceSchema = z.enum([
			"exact",
			"high",
			"medium",
			"low",
			"unknown"
		]);
		applicationUnavailableReasonSchema = z.enum([
			"not-applicable",
			"not-observed",
			"truncated",
			"provider-unavailable",
			"unresolved",
			"unknown"
		]);
		unavailableFactSchema = z.strictObject({
			available: z.literal(false),
			reason: applicationUnavailableReasonSchema,
			detail: boundedTextSchema$2
		});
		availableArtifactSchema = z.strictObject({
			available: z.literal(true),
			artifact_id: prefixedDigestSchema("art"),
			sha256: digestSchema
		}).superRefine((artifact, context) => {
			if (artifact.artifact_id !== `art_${artifact.sha256}`) context.addIssue({
				code: "custom",
				path: ["artifact_id"],
				message: "Artifact identifier must commit the same SHA-256 digest"
			});
		});
		applicationArtifactReferenceSchema = z.discriminatedUnion("available", [availableArtifactSchema, unavailableFactSchema]);
		sourceRangeSchema$1 = z.strictObject({
			kind: z.literal("source-range"),
			source: boundedTextSchema$2,
			start: z.strictObject({
				line: z.number().int().min(1),
				column: z.number().int().min(0)
			}),
			end: z.strictObject({
				line: z.number().int().min(1),
				column: z.number().int().min(0)
			})
		}).superRefine((location, context) => {
			if (location.end.line < location.start.line || location.end.line === location.start.line && location.end.column < location.start.column) context.addIssue({
				code: "custom",
				path: ["end"],
				message: "Source range end must not precede its start"
			});
		});
		fileOffsetRangeSchema = z.strictObject({
			kind: z.literal("file-offset-range"),
			start: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			end: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)
		}).superRefine((location, context) => {
			if (location.end < location.start) context.addIssue({
				code: "custom",
				path: ["end"],
				message: "File offset range end must not precede its start"
			});
		});
		applicationLocationSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("artifact-path"),
				path: relativePathSchema$1
			}),
			sourceRangeSchema$1,
			fileOffsetRangeSchema,
			z.strictObject({
				kind: z.literal("url"),
				url: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("runtime"),
				capture_sha256: digestSchema,
				target_key: boundedKeySchema,
				frame_key: boundedKeySchema.nullable(),
				script_key: boundedKeySchema.nullable()
			}),
			z.strictObject({
				kind: z.literal("native-address"),
				address: boundedKeySchema,
				symbol: boundedTextSchema$2.nullable()
			}),
			z.strictObject({
				kind: z.literal("package-export"),
				package_name: boundedKeySchema,
				export_path: boundedTextSchema$2
			})
		]);
		applicationLocationReferenceSchema = z.discriminatedUnion("available", [z.strictObject({
			available: z.literal(true),
			value: applicationLocationSchema
		}), unavailableFactSchema]);
		applicationExtractorSchema = z.strictObject({
			name: z.string().min(1),
			version: z.string().min(1),
			operation: z.string().min(1),
			executable_sha256: digestSchema.nullable()
		});
		applicationLimitSchema = z.strictObject({
			name: z.string().min(1),
			value: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			unit: z.enum([
				"items",
				"bytes",
				"milliseconds",
				"depth",
				"characters",
				"instructions",
				"other"
			])
		});
		coverageLimitsSchema = z.array(applicationLimitSchema);
		omittedCountSchema = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
		applicationCoverageSchema = z.union([
			z.strictObject({
				status: z.literal("complete"),
				truncated: z.literal(false),
				omitted_count: z.literal(0),
				limits: coverageLimitsSchema
			}),
			z.strictObject({
				status: z.literal("partial"),
				truncated: z.literal(false),
				omitted_count: omittedCountSchema.nullable(),
				limits: coverageLimitsSchema
			}),
			z.strictObject({
				status: z.literal("partial"),
				truncated: z.literal(true),
				omitted_count: z.union([omittedCountSchema.positive(), z.null()]),
				limits: z.array(applicationLimitSchema).min(1)
			}),
			z.strictObject({
				status: z.enum(["unknown", "unavailable"]),
				truncated: z.literal(false),
				omitted_count: z.null(),
				limits: coverageLimitsSchema
			})
		]);
		completeApplicationCoverage = (limits = []) => applicationCoverageSchema.parse({
			status: "complete",
			truncated: false,
			omitted_count: 0,
			limits
		});
		partialApplicationCoverage = (limits, omittedCount) => applicationCoverageSchema.parse({
			status: "partial",
			truncated: false,
			omitted_count: omittedCount,
			limits
		});
		truncatedApplicationCoverage = (limits, omittedCount) => applicationCoverageSchema.parse({
			status: "partial",
			truncated: true,
			omitted_count: omittedCount,
			limits
		});
		applicationGraphEvidenceBaseSchema = z.strictObject({
			authority: applicationEvidenceAuthoritySchema,
			state: applicationFactStateSchema,
			confidence: applicationConfidenceSchema,
			artifact: applicationArtifactReferenceSchema,
			location: applicationLocationReferenceSchema,
			extractor: applicationExtractorSchema,
			coverage: applicationCoverageSchema,
			limitations: z.array(boundedTextSchema$2),
			evidence_ids: z.array(prefixedDigestSchema("ev"))
		});
		applicationGraphEvidenceContextSchema = applicationGraphEvidenceBaseSchema.omit({ location: true });
		applicationGraphEvidenceLocationSchema = applicationLocationReferenceSchema;
		checkAuthorityState = (evidence, context) => {
			if (evidence.authority === "static-relationship-inference" && evidence.state !== "inferred") context.addIssue({
				code: "custom",
				path: ["state"],
				message: "Static relationship authority must remain inferred"
			});
			if (evidence.authority === "cross-layer-reconciliation" && evidence.state !== "inferred") context.addIssue({
				code: "custom",
				path: ["state"],
				message: "Cross-layer reconciliation authority must remain inferred"
			});
			if (evidence.authority === "cross-version-comparison" && evidence.state !== "inferred") context.addIssue({
				code: "custom",
				path: ["state"],
				message: "Cross-version comparison authority must remain inferred"
			});
			if (evidence.authority === "unknown" && !["unknown", "unavailable"].includes(evidence.state)) context.addIssue({
				code: "custom",
				path: ["state"],
				message: "Unknown authority cannot claim an observed fact"
			});
		};
		checkStateConfidence = (evidence, context) => {
			if (["unknown", "unavailable"].includes(evidence.state) && (evidence.confidence !== "unknown" || evidence.limitations.length === 0)) context.addIssue({
				code: "custom",
				message: "Unknown and unavailable facts require unknown confidence and an explicit limitation"
			});
			if (evidence.state === "observed" && evidence.confidence === "unknown") context.addIssue({
				code: "custom",
				path: ["confidence"],
				message: "Observed facts require a bounded non-unknown confidence"
			});
			if (evidence.state === "inferred" && ![
				"high",
				"medium",
				"low"
			].includes(evidence.confidence)) context.addIssue({
				code: "custom",
				path: ["confidence"],
				message: "Inferred facts require high, medium, or low confidence"
			});
			if (evidence.confidence === "exact" && evidence.state !== "observed") context.addIssue({
				code: "custom",
				path: ["confidence"],
				message: "Exact confidence is reserved for observed facts"
			});
		};
		checkTraceability = (evidence, context) => {
			if (evidence.state === "observed" && !evidence.location.available) context.addIssue({
				code: "custom",
				path: ["location"],
				message: "Observed facts require an actionable location"
			});
			if (evidence.state === "inferred" && evidence.limitations.length === 0) context.addIssue({
				code: "custom",
				path: ["limitations"],
				message: "Inferred facts require an explicit limitation"
			});
			if (evidence.coverage.status !== "complete" && evidence.limitations.length === 0) context.addIssue({
				code: "custom",
				path: ["limitations"],
				message: "Non-complete coverage requires an explicit limitation"
			});
		};
		checkArtifactBacking = (evidence, context) => {
			const artifactBacked = [
				"artifact-bytes",
				"ast-static-analysis",
				"controlled-replay",
				"native-analysis-provider",
				"managed-static-analysis"
			].includes(evidence.authority);
			if (artifactBacked && evidence.state !== "unavailable" && !evidence.artifact.available) context.addIssue({
				code: "custom",
				path: ["artifact"],
				message: "Artifact-backed facts require a content digest"
			});
		};
		applicationGraphEvidenceSchema = applicationGraphEvidenceBaseSchema.superRefine((evidence, context) => {
			checkAuthorityState(evidence, context);
			checkStateConfidence(evidence, context);
			checkTraceability(evidence, context);
			checkArtifactBacking(evidence, context);
		});
		applicationNodeIdentitySchema = z.discriminatedUnion("strategy", [
			z.strictObject({
				strategy: z.literal("content-digest"),
				stability: z.literal("global-exact"),
				sha256: digestSchema
			}),
			z.strictObject({
				strategy: z.literal("source-map-original"),
				stability: z.literal("source-map-exact"),
				source_map_sha256: digestSchema,
				original_source: z.string(),
				source_root: z.string().nullable(),
				source_sha256: digestSchema.nullable()
			}),
			z.strictObject({
				strategy: z.literal("canonical-path"),
				stability: z.literal("artifact-version"),
				artifact_sha256: digestSchema,
				path: relativePathSchema$1
			}),
			z.strictObject({
				strategy: z.literal("structural-fingerprint"),
				stability: z.literal("cross-version-inference"),
				algorithm: z.string().min(1),
				fingerprint_sha256: digestSchema,
				basis: z.array(z.enum([
					"syntax-tree",
					"control-flow",
					"imports",
					"exports",
					"literals",
					"api-usage"
				])).min(1)
			}),
			z.strictObject({
				strategy: z.literal("artifact-local-key"),
				stability: z.literal("artifact-version"),
				artifact_sha256: digestSchema,
				namespace: boundedKeySchema,
				key: z.string()
			}),
			z.strictObject({
				strategy: z.literal("runtime-instance"),
				stability: z.literal("capture-only"),
				capture_sha256: digestSchema,
				runtime_key: boundedTextSchema$2
			}),
			z.strictObject({
				strategy: z.literal("observation-fingerprint"),
				stability: z.literal("observation-only"),
				observation_sha256: digestSchema,
				scope: boundedTextSchema$2
			})
		]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptApplicationGraphSchemas.js
var boundedTextSchema$1, JAVASCRIPT_APPLICATION_NODE_KINDS, applicationNodeKindSchema, JAVASCRIPT_APPLICATION_RELATIONS, applicationRelationSchema, applicationPropertiesSchema, applicationNodeObservationBaseSchema, applicationNodeObservationInputSchema, applicationNodeObservationSchema, applicationNodeInputSchema, applicationNodeSchema, applicationEdgeInputSchema, applicationEdgeSchema, javascriptApplicationGraphInputSchema, javascriptApplicationGraphRecordSchema;
function init_javascriptApplicationGraphSchemas() {
	return (init_javascriptApplicationGraphSchemas = __esmMin((() => {
		init_javascriptSourceMapPaths();
		init_javascriptApplicationEvidenceSchemas();
		init_jsonValue();
		init_digests();
		boundedTextSchema$1 = z.string().min(1);
		JAVASCRIPT_APPLICATION_NODE_KINDS = [
			"package",
			"installer",
			"artifact",
			"asar-entry",
			"electron-main",
			"electron-preload",
			"electron-renderer",
			"electron-utility",
			"javascript-asset",
			"javascript-chunk",
			"javascript-module",
			"javascript-expression",
			"source-map",
			"source-module",
			"browser-window",
			"frame",
			"target",
			"context-bridge-api",
			"ipc-channel",
			"ipc-handler",
			"worker",
			"service-worker",
			"endpoint",
			"storage",
			"native-addon",
			"native-export",
			"managed-assembly",
			"managed-module",
			"managed-type",
			"managed-method",
			"managed-field",
			"managed-pinvoke-import",
			"managed-native-implementation",
			"runtime-script-instance",
			"unknown"
		];
		applicationNodeKindSchema = z.enum(JAVASCRIPT_APPLICATION_NODE_KINDS);
		JAVASCRIPT_APPLICATION_RELATIONS = [
			"contains",
			"loads",
			"imports",
			"maps_to",
			"exposes",
			"sends",
			"invokes",
			"handles",
			"calls",
			"persists_to",
			"observed_as",
			"changed_from"
		];
		applicationRelationSchema = z.enum(JAVASCRIPT_APPLICATION_RELATIONS);
		applicationPropertiesSchema = z.record(z.string().min(1), jsonValueSchema);
		applicationNodeObservationBaseSchema = z.strictObject({
			label: z.string().min(1).nullable(),
			source_map_reference: javascriptSourceMapReferenceSchema.nullable(),
			properties: applicationPropertiesSchema,
			evidence: applicationGraphEvidenceSchema
		});
		applicationNodeObservationInputSchema = applicationNodeObservationBaseSchema.extend({ source_map_reference: javascriptSourceMapReferenceSchema.nullable().default(null) });
		applicationNodeObservationSchema = applicationNodeObservationBaseSchema.extend({
			observation_id: prefixedDigestSchema("jag_observation"),
			identifier_strategy: z.strictObject({
				strategy: z.literal("semantic-content-sha256"),
				stability: z.literal("observation-exact")
			})
		});
		applicationNodeInputSchema = z.strictObject({
			kind: applicationNodeKindSchema,
			identity: applicationNodeIdentitySchema,
			observations: z.array(applicationNodeObservationInputSchema).min(1)
		});
		applicationNodeSchema = z.strictObject({
			node_id: prefixedDigestSchema("jag_node"),
			kind: applicationNodeKindSchema,
			identity: applicationNodeIdentitySchema,
			observations: z.array(applicationNodeObservationSchema).min(1)
		});
		applicationEdgeInputSchema = z.strictObject({
			source_node_id: prefixedDigestSchema("jag_node"),
			target_node_id: prefixedDigestSchema("jag_node"),
			relation: applicationRelationSchema,
			properties: applicationPropertiesSchema,
			evidence: applicationGraphEvidenceSchema
		});
		applicationEdgeSchema = applicationEdgeInputSchema.extend({
			edge_id: prefixedDigestSchema("jag_edge"),
			identifier_strategy: z.strictObject({
				strategy: z.literal("semantic-content-sha256"),
				stability: z.literal("relationship-exact")
			})
		});
		javascriptApplicationGraphInputSchema = z.strictObject({
			schema: z.literal("JavaScriptApplicationGraph"),
			root_node_ids: z.array(prefixedDigestSchema("jag_node")).min(1),
			nodes: z.array(applicationNodeSchema).min(1),
			edges: z.array(applicationEdgeSchema),
			coverage: applicationCoverageSchema,
			limitations: z.array(boundedTextSchema$1)
		});
		javascriptApplicationGraphRecordSchema = javascriptApplicationGraphInputSchema.extend({ graph_id: prefixedDigestSchema("jag") });
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptApplicationGraph.js
function* checkGraphContentSteps$1(graph, context) {
	sortedUniqueIssue$1(graph.root_node_ids, ["root_node_ids"], "Root nodes", context);
	sortedUniqueIssue$1(graph.nodes.map(({ node_id: id }) => id), ["nodes"], "Nodes", context);
	sortedUniqueIssue$1(graph.edges.map(({ edge_id: id }) => id), ["edges"], "Edges", context);
	sortedUniqueIssue$1(graph.limitations, ["limitations"], "Graph limitations", context);
	sortedUniqueIssue$1(graph.coverage.limits.map(limitKey), ["coverage", "limits"], "Graph limits", context);
	if (graph.coverage.status !== "complete" && graph.limitations.length === 0) context.addIssue({
		code: "custom",
		message: "Non-complete graph coverage requires an explicit limitation",
		path: ["limitations"]
	});
	const nodesById = new Map(graph.nodes.map((node) => [node.node_id, node]));
	for (const root of graph.root_node_ids) if (!nodesById.has(root)) context.addIssue({
		code: "custom",
		message: "Root identifier must name a graph node",
		path: ["root_node_ids"]
	});
	for (const [index, node] of graph.nodes.entries()) {
		if (index % 64 === 0) yield;
		checkNode(node, index, context);
	}
	for (const [index, edge] of graph.edges.entries()) {
		if (index % 64 === 0) yield;
		const { edge_id: identifier, ...semantic } = edge;
		if (identifier !== edgeId(semantic)) context.addIssue({
			code: "custom",
			message: "Edge identifier does not match its semantic content",
			path: [
				"edges",
				index,
				"edge_id"
			]
		});
		if (!nodesById.has(edge.source_node_id) || !nodesById.has(edge.target_node_id)) context.addIssue({
			code: "custom",
			message: "Edge endpoints must name graph nodes",
			path: ["edges", index]
		});
		if (edge.source_node_id === edge.target_node_id) context.addIssue({
			code: "custom",
			message: "Application graph edges cannot be self-referential",
			path: ["edges", index]
		});
		if (edge.relation === "changed_from" && nodesById.get(edge.source_node_id)?.kind !== nodesById.get(edge.target_node_id)?.kind) context.addIssue({
			code: "custom",
			message: "changed_from endpoints must have the same node kind",
			path: [
				"edges",
				index,
				"relation"
			]
		});
		checkEvidenceNormalization(edge.evidence, [
			"edges",
			index,
			"evidence"
		], context);
	}
}
function* parseAndSealApplicationGraphSteps(container) {
	const issues = [];
	const parsed = {
		...container,
		nodes: yield* parseElementSteps(applicationGraphShape.nodes.element, container.nodes, ["nodes"], issues),
		edges: yield* parseElementSteps(applicationGraphShape.edges.element, container.edges, ["edges"], issues)
	};
	if (issues.length > 0) throw new z.ZodError(issues);
	const content = normalizeGraphInput$1(parsed);
	let invalid = false;
	yield* checkGraphContentSteps$1(content, { addIssue: () => {
		invalid = true;
	} });
	if (invalid) {
		javascriptApplicationGraphContentSchema.parse(content);
		throw new TypeError("Application graph checks disagree with its schema");
	}
	return yield* sealValidatedApplicationGraphSteps({
		...content,
		graph_id: `jag_${yield* canonicalJsonDigestSteps(content)}`
	});
}
function* sealValidatedApplicationGraphSteps(graph) {
	yield* freezeOwnedJsonSnapshotSteps(graph);
	validatedImmutableApplicationGraphs.add(graph);
	return graph;
}
var OBSERVATION_IDENTIFIER_STRATEGY, EDGE_IDENTIFIER_STRATEGY, limitKey, normalizeLimits, normalizeEvidence$1, normalizeIdentity, nodeSemantic, nodeId, observationSemantic, observationId, edgeId, sortedUniqueIssue$1, checkEvidenceNormalization, sourceMapObservationMatchesIdentity, observationMatchesIdentity, checkNode, checkGraphContent$1, checkGraphInvariants, javascriptApplicationGraphSchema, javascriptApplicationGraphContentSchema, createJavaScriptApplicationNode, createJavaScriptApplicationEdge, createJavaScriptApplicationGraph, normalizeGraphInput$1, validatedImmutableApplicationGraphs, createImmutableJavaScriptApplicationGraphSteps, applicationGraphShape, applicationGraphContainerSchema, sealTransferredJavaScriptApplicationGraphSteps, isValidatedImmutableJavaScriptApplicationGraph, parseJavaScriptApplicationGraph, computeJavaScriptApplicationGraphSha256, serializeJavaScriptApplicationGraph;
function init_javascriptApplicationGraph() {
	return (init_javascriptApplicationGraph = __esmMin((() => {
		init_zodCollectionSteps();
		init_canonicalJsonDigestSteps();
		init_comparisonSemantics();
		init_canonicalDigest();
		init_canonicalOrdering();
		init_unicodeCodePointOrder();
		init_immutableJson();
		init_javascriptApplicationGraphSchemas();
		OBSERVATION_IDENTIFIER_STRATEGY = {
			strategy: "semantic-content-sha256",
			stability: "observation-exact"
		};
		EDGE_IDENTIFIER_STRATEGY = {
			strategy: "semantic-content-sha256",
			stability: "relationship-exact"
		};
		limitKey = (limit) => canonicalJson(limit, "JavaScript Application Graph");
		normalizeLimits = (limits) => [...new Map(limits.map((limit) => [limitKey(limit), limit])).values()].sort((left, right) => compareUnicodeCodePoints(limitKey(left), limitKey(right)));
		normalizeEvidence$1 = (evidence) => ({
			...evidence,
			coverage: {
				...evidence.coverage,
				limits: normalizeLimits(evidence.coverage.limits)
			},
			limitations: uniqueSorted(evidence.limitations),
			evidence_ids: uniqueSorted(evidence.evidence_ids)
		});
		normalizeIdentity = (identity) => identity.strategy === "structural-fingerprint" ? {
			...identity,
			basis: uniqueSorted(identity.basis)
		} : identity;
		nodeSemantic = (node) => ({
			kind: node.kind,
			identity: node.identity
		});
		nodeId = (node) => `jag_node_${digestCanonicalValue(nodeSemantic(node), "JavaScript Application Graph")}`;
		observationSemantic = (nodeIdentifier, observation) => ({
			node_id: nodeIdentifier,
			...observation
		});
		observationId = (nodeIdentifier, observation) => `jag_observation_${digestCanonicalValue(observationSemantic(nodeIdentifier, observation))}`;
		edgeId = (edge) => `jag_edge_${digestCanonicalValue(edge, "JavaScript Application Graph")}`;
		sortedUniqueIssue$1 = (values, path, label, context) => {
			for (let index = 1; index < values.length; index += 1) {
				if (compareUnicodeCodePoints(values[index - 1] ?? "", values[index] ?? "") < 0) continue;
				context.addIssue({
					code: "custom",
					message: `${label} must be sorted and unique by Unicode code point`,
					path: [...path, index]
				});
				return;
			}
		};
		checkEvidenceNormalization = (evidence, path, context) => {
			sortedUniqueIssue$1(evidence.limitations, [...path, "limitations"], "Evidence limitations", context);
			sortedUniqueIssue$1(evidence.evidence_ids, [...path, "evidence_ids"], "Evidence identifiers", context);
			sortedUniqueIssue$1(evidence.coverage.limits.map(limitKey), [
				...path,
				"coverage",
				"limits"
			], "Evidence limits", context);
			const runtimeLocation = evidence.location.available && evidence.location.value.kind === "runtime";
			const staticAuthority = [
				"artifact-bytes",
				"ast-static-analysis",
				"static-relationship-inference",
				"native-analysis-provider"
			].includes(evidence.authority);
			if (runtimeLocation && staticAuthority) context.addIssue({
				code: "custom",
				message: "Static and native authorities cannot claim a runtime location",
				path: [...path, "location"]
			});
		};
		sourceMapObservationMatchesIdentity = (identity, observation) => {
			const { evidence, source_map_reference: reference } = observation;
			const sourceDigests = [observation.properties.content_sha256, observation.properties.source_sha256];
			const hasKnownSourceDigest = identity.source_sha256 !== null;
			const sourceDigestMatches = sourceDigests.every((digest) => digest === undefined || digest === null || digest === identity.source_sha256) && (!hasKnownSourceDigest || sourceDigests.includes(identity.source_sha256));
			const contentAvailabilityMatches = (observation.properties.content_available !== true || hasKnownSourceDigest) && (observation.properties.content_available !== false || !hasKnownSourceDigest);
			return sourceDigestMatches && contentAvailabilityMatches && reference !== null && evidence.state === "observed" && evidence.artifact.available && evidence.artifact.sha256 === identity.source_map_sha256 && reference.source_name === identity.original_source && reference.source_root === identity.source_root && evidence.location.available && evidence.location.value.kind === "artifact-path" && reference.map_path === evidence.location.value.path;
		};
		observationMatchesIdentity = (node, observation) => {
			const { identity } = node;
			const { evidence } = observation;
			if (identity.strategy === "content-digest") return evidence.state === "observed" && evidence.artifact.available && evidence.artifact.sha256 === identity.sha256;
			if (identity.strategy === "source-map-original") return sourceMapObservationMatchesIdentity(identity, observation);
			if (identity.strategy === "canonical-path") return evidence.artifact.available && evidence.artifact.sha256 === identity.artifact_sha256 && evidence.location.available && evidence.location.value.kind === "artifact-path" && evidence.location.value.path === identity.path;
			if (identity.strategy === "artifact-local-key") return evidence.artifact.available && evidence.artifact.sha256 === identity.artifact_sha256;
			if (identity.strategy === "runtime-instance") {
				if (!["passive-cdp-runtime", "controlled-replay"].includes(evidence.authority) || !evidence.location.available || evidence.location.value.kind !== "runtime") return false;
				const location = evidence.location.value;
				return location.capture_sha256 === identity.capture_sha256 && [
					location.target_key,
					location.frame_key,
					location.script_key
				].includes(identity.runtime_key);
			}
			if (identity.strategy === "structural-fingerprint") return evidence.state === "inferred";
			return evidence.state === "observed";
		};
		checkNode = (node, index, context) => {
			if (node.node_id !== nodeId(node)) context.addIssue({
				code: "custom",
				message: "Node identifier does not match its kind and identity",
				path: [
					"nodes",
					index,
					"node_id"
				]
			});
			if (node.identity.strategy === "structural-fingerprint" && canonicalJson(node.identity.basis, "JavaScript Application Graph") !== canonicalJson(uniqueSorted(node.identity.basis), "JavaScript Application Graph")) context.addIssue({
				code: "custom",
				message: "Structural fingerprint basis must be sorted and unique",
				path: [
					"nodes",
					index,
					"identity",
					"basis"
				]
			});
			sortedUniqueIssue$1(node.observations.map(({ observation_id: id }) => id), [
				"nodes",
				index,
				"observations"
			], "Node observations", context);
			for (const [observationIndex, observation] of node.observations.entries()) {
				const { observation_id: identifier, ...semantic } = observation;
				if (identifier !== observationId(node.node_id, semantic)) context.addIssue({
					code: "custom",
					message: "Observation identifier does not match its semantic content",
					path: [
						"nodes",
						index,
						"observations",
						observationIndex,
						"observation_id"
					]
				});
				if (node.identity.strategy === "source-map-original" && !observationMatchesIdentity(node, observation)) context.addIssue({
					code: "custom",
					message: "Source-map observation must retain its exact declaration and map location",
					path: [
						"nodes",
						index,
						"observations",
						observationIndex,
						"source_map_reference"
					]
				});
				checkEvidenceNormalization(observation.evidence, [
					"nodes",
					index,
					"observations",
					observationIndex,
					"evidence"
				], context);
			}
			if (!node.observations.some((observation) => observationMatchesIdentity(node, observation))) context.addIssue({
				code: "custom",
				message: "Node identity is not supported by a compatible observation",
				path: [
					"nodes",
					index,
					"identity"
				]
			});
		};
		checkGraphContent$1 = (graph, context) => {
			const steps = checkGraphContentSteps$1(graph, context);
			while (steps.next().done !== true);
		};
		checkGraphInvariants = (graph, context) => {
			checkGraphContent$1(graph, context);
			const { graph_id: identifier, ...semantic } = graph;
			if (identifier !== `jag_${digestCanonicalValue(semantic, "JavaScript Application Graph")}`) context.addIssue({
				code: "custom",
				message: "Graph identifier does not match its semantic content",
				path: ["graph_id"]
			});
		};
		javascriptApplicationGraphSchema = javascriptApplicationGraphRecordSchema.superRefine(checkGraphInvariants);
		javascriptApplicationGraphContentSchema = javascriptApplicationGraphInputSchema.superRefine(checkGraphContent$1);
		createJavaScriptApplicationNode = (input) => {
			const parsed = applicationNodeInputSchema.parse(input);
			for (const observation of parsed.observations) freezeJsonSnapshot(observation.properties);
			const identity = normalizeIdentity(parsed.identity);
			const identifier = nodeId({
				kind: parsed.kind,
				identity
			});
			const observations = parsed.observations.map((observation) => {
				const semantic = {
					...observation,
					evidence: normalizeEvidence$1(observation.evidence),
					identifier_strategy: OBSERVATION_IDENTIFIER_STRATEGY
				};
				return applicationNodeObservationSchema.parse({
					...semantic,
					observation_id: observationId(identifier, semantic)
				});
			}).sort((left, right) => compareUnicodeCodePoints(left.observation_id, right.observation_id));
			return applicationNodeSchema.parse({
				node_id: identifier,
				kind: parsed.kind,
				identity,
				observations
			});
		};
		createJavaScriptApplicationEdge = (input) => {
			const parsed = applicationEdgeInputSchema.parse(input);
			freezeJsonSnapshot(parsed.properties);
			const semantic = {
				...parsed,
				evidence: normalizeEvidence$1(parsed.evidence),
				identifier_strategy: EDGE_IDENTIFIER_STRATEGY
			};
			return applicationEdgeSchema.parse({
				...semantic,
				edge_id: edgeId(semantic)
			});
		};
		createJavaScriptApplicationGraph = (input) => {
			const semantic = normalizeGraphInput$1(javascriptApplicationGraphInputSchema.parse(input));
			const content = javascriptApplicationGraphContentSchema.parse(semantic);
			return {
				...content,
				graph_id: `jag_${digestCanonicalValue(content, "JavaScript Application Graph")}`
			};
		};
		normalizeGraphInput$1 = (parsed) => ({
			...parsed,
			root_node_ids: uniqueSorted(parsed.root_node_ids),
			nodes: [...parsed.nodes].sort((left, right) => compareUnicodeCodePoints(left.node_id, right.node_id)),
			edges: [...parsed.edges].sort((left, right) => compareUnicodeCodePoints(left.edge_id, right.edge_id)),
			coverage: {
				...parsed.coverage,
				limits: normalizeLimits(parsed.coverage.limits)
			},
			limitations: uniqueSorted(parsed.limitations)
		});
		validatedImmutableApplicationGraphs = new WeakSet();
		createImmutableJavaScriptApplicationGraphSteps = (input) => sealValidatedApplicationGraphSteps(createJavaScriptApplicationGraph(input));
		applicationGraphShape = javascriptApplicationGraphInputSchema.shape;
		applicationGraphContainerSchema = javascriptApplicationGraphInputSchema.extend({
			nodes: arrayContainerSchema(applicationGraphShape.nodes),
			edges: arrayContainerSchema(applicationGraphShape.edges)
		});
		sealTransferredJavaScriptApplicationGraphSteps = (input) => parseAndSealApplicationGraphSteps(applicationGraphContainerSchema.parse(input));
		isValidatedImmutableJavaScriptApplicationGraph = (value) => typeof value === "object" && value !== null && validatedImmutableApplicationGraphs.has(value);
		parseJavaScriptApplicationGraph = (input) => javascriptApplicationGraphSchema.parse(input);
		computeJavaScriptApplicationGraphSha256 = (input) => digestCanonicalValue(parseJavaScriptApplicationGraph(input), "JavaScript Application Graph");
		serializeJavaScriptApplicationGraph = (input) => canonicalJson(parseJavaScriptApplicationGraph(input), "JavaScript Application Graph");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticGraphSchemas.js
var boundedTextSchema, semanticNodeIdSchema, semanticRelationIdSchema, semanticUnknownIdSchema, semanticEvidenceContextIdSchema, javaScriptSemanticEvidenceContextSchema, javaScriptSemanticEvidenceReferenceSchema, JAVASCRIPT_SEMANTIC_NODE_KINDS, JAVASCRIPT_SEMANTIC_RELATION_FAMILIES, JAVASCRIPT_SEMANTIC_RELATIONS, JAVASCRIPT_SEMANTIC_RELATION_FAMILY, relativePathSchema, sourcePointSchema, sourceRangeSchema, semanticPropertiesSchema, semanticNodeIdentitySchema, javaScriptSemanticNodeInputSchema, javaScriptSemanticNodeSchema, javaScriptSemanticRelationInputSchema, javaScriptSemanticRelationSchema, JAVASCRIPT_SEMANTIC_UNKNOWN_REASONS, javaScriptSemanticUnknownInputSchema, javaScriptSemanticUnknownSchema, fingerprintComponentsSchema, javaScriptSemanticFingerprintInputSchema, javaScriptSemanticFingerprintSchema, familyCoverageSchema, graphCoverageSchema, javaScriptSemanticGraphInputSchema, javaScriptSemanticGraphRecordSchema;
function init_javascriptSemanticGraphSchemas() {
	return (init_javascriptSemanticGraphSchemas = __esmMin((() => {
		init_javascriptApplicationEvidenceSchemas();
		init_jsonValue();
		init_digests();
		boundedTextSchema = z.string().min(1);
		semanticNodeIdSchema = prefixedDigestSchema("jsrg_node");
		semanticRelationIdSchema = z.string().regex(/^jsrg_relation_[a-f0-9]{64}$/u);
		semanticUnknownIdSchema = z.string().regex(/^jsrg_unknown_[a-f0-9]{64}$/u);
		semanticEvidenceContextIdSchema = z.string().regex(/^jsrg_evidence_[a-f0-9]{64}$/u);
		javaScriptSemanticEvidenceContextSchema = applicationGraphEvidenceContextSchema.extend({ context_id: semanticEvidenceContextIdSchema });
		javaScriptSemanticEvidenceReferenceSchema = z.strictObject({
			context_id: semanticEvidenceContextIdSchema,
			location: applicationGraphEvidenceLocationSchema
		});
		JAVASCRIPT_SEMANTIC_NODE_KINDS = [
			"module",
			"function",
			"parameter",
			"binding",
			"expression",
			"literal",
			"property-slot",
			"call-site",
			"return-site",
			"closure-capture",
			"promise",
			"task",
			"event",
			"listener",
			"timer",
			"child-process",
			"stdio",
			"signal",
			"config-source",
			"request",
			"response",
			"boundary",
			"resource",
			"unknown-frontier"
		];
		JAVASCRIPT_SEMANTIC_RELATION_FAMILIES = [
			"boundary",
			"call-flow",
			"child-process",
			"closure",
			"configuration",
			"data-flow",
			"event",
			"object-flow",
			"promise-ownership",
			"request",
			"resource-lifecycle",
			"timer"
		];
		JAVASCRIPT_SEMANTIC_RELATIONS = [
			"acquires",
			"aggregates",
			"aliases",
			"argument-to-parameter",
			"awaits",
			"calls",
			"cancels-timer",
			"captures",
			"chains",
			"coerces",
			"connects-stdio",
			"consumed-by",
			"constructs-request",
			"creates-promise",
			"defaults",
			"defines",
			"destructures",
			"detaches-task",
			"dispatches-candidate",
			"forwards-signal",
			"listens-error",
			"listens-exit",
			"owns",
			"overrides",
			"parses",
			"reads",
			"reads-argv",
			"reads-config",
			"reads-environment",
			"reads-property",
			"registers-listener",
			"releases",
			"removes-listener",
			"returns-task",
			"returns-to-call",
			"schedules-timer",
			"spawns",
			"spreads",
			"supplies-argv",
			"supplies-env",
			"supplies-request-field",
			"validates",
			"writes",
			"writes-property"
		];
		JAVASCRIPT_SEMANTIC_RELATION_FAMILY = {
			acquires: "resource-lifecycle",
			aggregates: "promise-ownership",
			aliases: "data-flow",
			"argument-to-parameter": "call-flow",
			awaits: "promise-ownership",
			calls: "call-flow",
			"cancels-timer": "timer",
			captures: "closure",
			chains: "promise-ownership",
			coerces: "boundary",
			"connects-stdio": "child-process",
			"consumed-by": "request",
			"constructs-request": "request",
			"creates-promise": "promise-ownership",
			defaults: "configuration",
			defines: "data-flow",
			destructures: "object-flow",
			"detaches-task": "promise-ownership",
			"dispatches-candidate": "event",
			"forwards-signal": "child-process",
			"listens-error": "child-process",
			"listens-exit": "child-process",
			owns: "promise-ownership",
			overrides: "configuration",
			parses: "boundary",
			reads: "data-flow",
			"reads-argv": "configuration",
			"reads-config": "configuration",
			"reads-environment": "configuration",
			"reads-property": "object-flow",
			"registers-listener": "event",
			releases: "resource-lifecycle",
			"removes-listener": "event",
			"returns-task": "promise-ownership",
			"returns-to-call": "call-flow",
			"schedules-timer": "timer",
			spawns: "child-process",
			spreads: "object-flow",
			"supplies-argv": "child-process",
			"supplies-env": "child-process",
			"supplies-request-field": "request",
			validates: "boundary",
			writes: "data-flow",
			"writes-property": "object-flow"
		};
		relativePathSchema = z.string().min(1).refine((path) => !path.startsWith("/") && path.split("/").every((part) => ![
			"",
			".",
			".."
		].includes(part)), "Expected a normalized relative POSIX path without traversal");
		sourcePointSchema = z.strictObject({
			line: z.number().int().min(1),
			column: z.number().int().min(0)
		});
		sourceRangeSchema = z.strictObject({
			start: sourcePointSchema,
			end: sourcePointSchema
		}).superRefine((range, context) => {
			if (range.end.line < range.start.line || range.end.line === range.start.line && range.end.column < range.start.column) context.addIssue({
				code: "custom",
				path: ["end"],
				message: "Source range end must not precede its start"
			});
		});
		semanticPropertiesSchema = z.record(z.string().min(1), jsonValueSchema);
		semanticNodeIdentitySchema = z.strictObject({
			artifact_sha256: digestSchema,
			module_path: relativePathSchema,
			source_range: sourceRangeSchema.nullable(),
			role_key: z.string().min(1)
		});
		javaScriptSemanticNodeInputSchema = z.strictObject({
			kind: z.enum(JAVASCRIPT_SEMANTIC_NODE_KINDS),
			identity: semanticNodeIdentitySchema,
			function_node_id: semanticNodeIdSchema.nullable(),
			application_node_ids: z.array(prefixedDigestSchema("jag_node")),
			label: z.string().min(1).nullable(),
			properties: semanticPropertiesSchema,
			evidence: applicationGraphEvidenceSchema
		});
		javaScriptSemanticNodeSchema = javaScriptSemanticNodeInputSchema.extend({
			evidence: javaScriptSemanticEvidenceReferenceSchema,
			node_id: semanticNodeIdSchema.describe("SHA-256 of the node kind and identity; stable for one artifact version.")
		});
		javaScriptSemanticRelationInputSchema = z.strictObject({
			source_node_id: semanticNodeIdSchema,
			target_node_id: semanticNodeIdSchema,
			relation: z.enum(JAVASCRIPT_SEMANTIC_RELATIONS),
			resolution: z.enum(["resolved", "candidate"]),
			properties: semanticPropertiesSchema,
			evidence: applicationGraphEvidenceSchema
		});
		javaScriptSemanticRelationSchema = javaScriptSemanticRelationInputSchema.extend({
			evidence: javaScriptSemanticEvidenceReferenceSchema,
			relation_id: semanticRelationIdSchema.describe("SHA-256 of the exact relation content, including its evidence reference.")
		});
		JAVASCRIPT_SEMANTIC_UNKNOWN_REASONS = [
			"ambiguous-target",
			"bound-reached",
			"dynamic-call",
			"dynamic-property",
			"dynamic-scope",
			"eval-or-generated-code",
			"incomplete-module",
			"missing-source",
			"resource-limit",
			"unknown-value",
			"unsupported-syntax"
		];
		javaScriptSemanticUnknownInputSchema = z.strictObject({
			node_id: semanticNodeIdSchema.nullable(),
			family: z.enum(JAVASCRIPT_SEMANTIC_RELATION_FAMILIES),
			relation_kinds: z.array(z.enum(JAVASCRIPT_SEMANTIC_RELATIONS)).min(1),
			reason: z.enum(JAVASCRIPT_SEMANTIC_UNKNOWN_REASONS),
			detail: boundedTextSchema,
			candidate_node_ids: z.array(semanticNodeIdSchema),
			evidence: applicationGraphEvidenceSchema
		});
		javaScriptSemanticUnknownSchema = javaScriptSemanticUnknownInputSchema.extend({
			evidence: javaScriptSemanticEvidenceReferenceSchema,
			unknown_id: semanticUnknownIdSchema
		});
		fingerprintComponentsSchema = z.strictObject({
			parameter_arity: z.number().int().min(0),
			normalized_ast_sha256: digestSchema,
			control_flow_sha256: digestSchema,
			relation_shape_sha256: digestSchema,
			literal_set_sha256: digestSchema,
			effects: z.array(z.enum([
				"async",
				"child-process",
				"event",
				"network",
				"promise",
				"resource",
				"timer"
			]))
		});
		javaScriptSemanticFingerprintInputSchema = z.strictObject({
			function_node_id: semanticNodeIdSchema,
			algorithm: z.literal("rea.javascript-semantic-function"),
			status: z.enum([
				"complete",
				"partial",
				"unavailable"
			]),
			components: fingerprintComponentsSchema,
			limitations: z.array(boundedTextSchema),
			evidence: applicationGraphEvidenceSchema
		});
		javaScriptSemanticFingerprintSchema = javaScriptSemanticFingerprintInputSchema.extend({
			evidence: javaScriptSemanticEvidenceReferenceSchema,
			fingerprint_id: prefixedDigestSchema("jsrg_fingerprint"),
			fingerprint_sha256: digestSchema
		});
		familyCoverageSchema = z.strictObject({
			family: z.enum(JAVASCRIPT_SEMANTIC_RELATION_FAMILIES),
			status: z.enum([
				"complete",
				"partial",
				"unknown",
				"unsupported"
			]),
			retained_relations: z.number().int().min(0),
			omitted_relations: z.number().int().min(0).nullable(),
			unknown_ids: z.array(semanticUnknownIdSchema)
		});
		graphCoverageSchema = z.strictObject({
			status: z.enum([
				"complete",
				"partial",
				"unknown",
				"unavailable"
			]),
			truncated: z.boolean(),
			omitted_nodes: z.number().int().min(0).nullable(),
			omitted_relations: z.number().int().min(0).nullable(),
			limits: z.array(z.strictObject({
				name: z.string().min(1),
				value: z.number().int().min(0),
				unit: z.enum([
					"items",
					"bytes",
					"milliseconds",
					"depth",
					"other"
				])
			})),
			families: z.array(familyCoverageSchema).length(12)
		});
		javaScriptSemanticGraphInputSchema = z.strictObject({
			schema: z.literal("JavaScriptSemanticRelationGraph"),
			root_artifact_sha256: digestSchema,
			application_graph_id: prefixedDigestSchema("jag"),
			root_node_ids: z.array(semanticNodeIdSchema).min(1),
			evidence_contexts: z.array(javaScriptSemanticEvidenceContextSchema),
			nodes: z.array(javaScriptSemanticNodeSchema).min(1),
			relations: z.array(javaScriptSemanticRelationSchema),
			fingerprints: z.array(javaScriptSemanticFingerprintSchema),
			unknowns: z.array(javaScriptSemanticUnknownSchema),
			coverage: graphCoverageSchema,
			limitations: z.array(boundedTextSchema)
		});
		javaScriptSemanticGraphRecordSchema = javaScriptSemanticGraphInputSchema.extend({ graph_id: prefixedDigestSchema("jsrg") });
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticGraph.js
function* checkCoverageSteps(graph, context) {
	const families = graph.coverage.families.map(({ family }) => family);
	if (canonicalJson(families, "JavaScript semantic graph") !== canonicalJson(JAVASCRIPT_SEMANTIC_RELATION_FAMILIES, "JavaScript semantic graph")) context.addIssue({
		code: "custom",
		path: ["coverage", "families"],
		message: "Coverage must name every semantic relation family once in canonical order"
	});
	if (graph.coverage.status === "complete" && (graph.coverage.truncated || graph.coverage.omitted_nodes !== 0 || graph.coverage.omitted_relations !== 0 || graph.coverage.families.some(({ status }) => status !== "complete"))) context.addIssue({
		code: "custom",
		path: ["coverage"],
		message: "Complete graph coverage cannot omit or truncate semantic facts"
	});
	if (graph.coverage.truncated && graph.coverage.limits.length === 0) context.addIssue({
		code: "custom",
		path: ["coverage", "limits"],
		message: "Truncated graph coverage must identify an effective limit"
	});
	const relationsByFamily = new Map(JAVASCRIPT_SEMANTIC_RELATION_FAMILIES.map((family) => [family, 0]));
	for (const [index, relation] of graph.relations.entries()) {
		if (index % 256 === 0) yield;
		const family = JAVASCRIPT_SEMANTIC_RELATION_FAMILY[relation.relation];
		relationsByFamily.set(family, (relationsByFamily.get(family) ?? 0) + 1);
	}
	const unknownsById = new Map();
	const unknownFamilies = new Set();
	for (const [index, unknown] of graph.unknowns.entries()) {
		if (index % 256 === 0) yield;
		unknownsById.set(unknown.unknown_id, unknown);
		unknownFamilies.add(unknown.family);
	}
	for (const [index, family] of graph.coverage.families.entries()) {
		if (family.retained_relations !== relationsByFamily.get(family.family)) context.addIssue({
			code: "custom",
			path: [
				"coverage",
				"families",
				index,
				"retained_relations"
			],
			message: "Family retained relation count does not match graph content"
		});
		if (family.unknown_ids.some((identifier) => unknownsById.get(identifier)?.family !== family.family)) context.addIssue({
			code: "custom",
			path: [
				"coverage",
				"families",
				index,
				"unknown_ids"
			],
			message: "Family coverage references an unknown from another family"
		});
		if (family.status === "complete" && (family.omitted_relations !== 0 || family.unknown_ids.length > 0 || unknownFamilies.has(family.family))) context.addIssue({
			code: "custom",
			path: [
				"coverage",
				"families",
				index
			],
			message: "Complete family coverage cannot omit or retain unknown facts"
		});
	}
}
function* checkEvidenceContextReferencesSteps(graph, context) {
	const contexts = new Map(graph.evidence_contexts.map((value) => [value.context_id, value]));
	const referenced = new Set();
	const validateReferences = function* (entities, entityKind) {
		for (const [index, { evidence }] of entities.entries()) {
			if (index % 256 === 0) yield;
			referenced.add(evidence.context_id);
			const evidenceContext = contexts.get(evidence.context_id);
			if (evidenceContext === undefined) {
				context.addIssue({
					code: "custom",
					path: [
						entityKind,
						index,
						"evidence",
						"context_id"
					],
					message: "Evidence reference names an absent context"
				});
				continue;
			}
			const { context_id: _contextId, ...evidenceValue } = evidenceContext;
			if (!applicationGraphEvidenceSchema.safeParse({
				...evidenceValue,
				location: evidence.location
			}).success) context.addIssue({
				code: "custom",
				path: [
					entityKind,
					index,
					"evidence"
				],
				message: "Evidence context is incompatible with its fact location"
			});
		}
	};
	yield* validateReferences(graph.nodes, "nodes");
	yield* validateReferences(graph.relations, "relations");
	yield* validateReferences(graph.unknowns, "unknowns");
	yield* validateReferences(graph.fingerprints, "fingerprints");
	for (const [index, evidenceContext] of graph.evidence_contexts.entries()) {
		if (index % 256 === 0) yield;
		const { context_id: identifier, ...value } = evidenceContext;
		if (identifier !== evidenceContextId(value)) context.addIssue({
			code: "custom",
			path: [
				"evidence_contexts",
				index,
				"context_id"
			],
			message: "Evidence context identifier is stale"
		});
		if (!referenced.has(identifier)) context.addIssue({
			code: "custom",
			path: ["evidence_contexts", index],
			message: "Evidence context is not referenced by a graph fact"
		});
	}
}
function* checkNodesSteps(graph, nodes, context) {
	for (const [index, node] of graph.nodes.entries()) {
		if (index % 256 === 0) yield;
		if (node.node_id !== javaScriptSemanticNodeId(node)) context.addIssue({
			code: "custom",
			path: [
				"nodes",
				index,
				"node_id"
			],
			message: "Node identifier is stale"
		});
		if (node.function_node_id !== null && nodes.get(node.function_node_id)?.kind !== "function") context.addIssue({
			code: "custom",
			path: [
				"nodes",
				index,
				"function_node_id"
			],
			message: "Function owner must name a function node"
		});
	}
}
function* checkRootsSteps(graph, nodes, context) {
	for (const [index, root] of graph.root_node_ids.entries()) {
		if (index % 256 === 0) yield;
		if (!nodes.has(root)) context.addIssue({
			code: "custom",
			path: ["root_node_ids"],
			message: "Root identifier must name a semantic node"
		});
	}
}
function* checkRelationsSteps(graph, nodes, evidenceContexts, context) {
	for (const [index, relation] of graph.relations.entries()) {
		if (index % 256 === 0) yield;
		const { relation_id: identifier, ...semantic } = relation;
		if (identifier !== "jsrg_relation_" + digestCanonicalValue(semantic, "JavaScript semantic graph")) context.addIssue({
			code: "custom",
			path: [
				"relations",
				index,
				"relation_id"
			],
			message: "Relation identifier is stale"
		});
		if (!nodes.has(relation.source_node_id) || !nodes.has(relation.target_node_id)) context.addIssue({
			code: "custom",
			path: ["relations", index],
			message: "Relation endpoints must name semantic nodes"
		});
		if (relation.source_node_id === relation.target_node_id) context.addIssue({
			code: "custom",
			path: ["relations", index],
			message: "Semantic relations cannot be self-referential"
		});
		if (relation.resolution === "candidate" && evidenceContexts.get(relation.evidence.context_id)?.state === "observed") context.addIssue({
			code: "custom",
			path: [
				"relations",
				index,
				"evidence",
				"state"
			],
			message: "Candidate relations cannot claim observed resolution"
		});
	}
}
function* checkUnknownsSteps(graph, nodes, evidenceContexts, context) {
	for (const [index, unknown] of graph.unknowns.entries()) {
		if (index % 256 === 0) yield;
		const { unknown_id: identifier, ...semantic } = unknown;
		if (identifier !== "jsrg_unknown_" + digestCanonicalValue(semantic, "JavaScript semantic graph")) context.addIssue({
			code: "custom",
			path: [
				"unknowns",
				index,
				"unknown_id"
			],
			message: "Unknown frontier identifier is stale"
		});
		if (unknown.node_id !== null && !nodes.has(unknown.node_id)) context.addIssue({
			code: "custom",
			path: [
				"unknowns",
				index,
				"node_id"
			],
			message: "Unknown frontier node is absent"
		});
		if (unknown.candidate_node_ids.some((nodeId) => !nodes.has(nodeId))) context.addIssue({
			code: "custom",
			path: [
				"unknowns",
				index,
				"candidate_node_ids"
			],
			message: "Unknown frontier candidate node is absent"
		});
		if (unknown.relation_kinds.some((kind) => JAVASCRIPT_SEMANTIC_RELATION_FAMILY[kind] !== unknown.family)) context.addIssue({
			code: "custom",
			path: [
				"unknowns",
				index,
				"relation_kinds"
			],
			message: "Unknown relation kinds must belong to their declared family"
		});
		const evidenceState = evidenceContexts.get(unknown.evidence.context_id)?.state;
		if (evidenceState !== "unknown" && evidenceState !== "unavailable") context.addIssue({
			code: "custom",
			path: [
				"unknowns",
				index,
				"evidence",
				"state"
			],
			message: "Unknown frontiers require unknown or unavailable evidence"
		});
	}
}
function* checkFingerprintsSteps(graph, nodes, context) {
	for (const [index, fingerprint] of graph.fingerprints.entries()) {
		if (index % 256 === 0) yield;
		if (nodes.get(fingerprint.function_node_id)?.kind !== "function") context.addIssue({
			code: "custom",
			path: [
				"fingerprints",
				index,
				"function_node_id"
			],
			message: "Fingerprint must name a function node"
		});
		if (fingerprint.fingerprint_sha256 !== digestCanonicalValue(fingerprint.components, "JavaScript semantic graph")) context.addIssue({
			code: "custom",
			path: [
				"fingerprints",
				index,
				"fingerprint_sha256"
			],
			message: "Fingerprint component commitment is stale"
		});
		const expectedIdentifier = "jsrg_fingerprint_" + digestCanonicalValue({
			function_node_id: fingerprint.function_node_id,
			algorithm: fingerprint.algorithm,
			fingerprint_sha256: fingerprint.fingerprint_sha256
		}, "JavaScript semantic graph");
		if (fingerprint.fingerprint_id !== expectedIdentifier) context.addIssue({
			code: "custom",
			path: [
				"fingerprints",
				index,
				"fingerprint_id"
			],
			message: "Fingerprint identifier is stale"
		});
		if (fingerprint.status !== "complete" && fingerprint.limitations.length === 0) context.addIssue({
			code: "custom",
			path: [
				"fingerprints",
				index,
				"limitations"
			],
			message: "Incomplete fingerprints require a limitation"
		});
	}
}
function* checkGraphContentSteps(graph, context) {
	checkCanonicalOrder(graph, context);
	yield* checkEvidenceContextReferencesSteps(graph, context);
	const evidenceContexts = new Map(graph.evidence_contexts.map((evidenceContext) => [evidenceContext.context_id, evidenceContext]));
	const nodes = new Map();
	for (const [index, node] of graph.nodes.entries()) {
		if (index % 256 === 0) yield;
		nodes.set(node.node_id, node);
	}
	yield* checkNodesSteps(graph, nodes, context);
	yield* checkRootsSteps(graph, nodes, context);
	yield* checkRelationsSteps(graph, nodes, evidenceContexts, context);
	yield* checkUnknownsSteps(graph, nodes, evidenceContexts, context);
	checkUnknownReferences(graph, context);
	yield* checkFingerprintsSteps(graph, nodes, context);
	yield* checkCoverageSteps(graph, context);
	if (graph.coverage.status !== "complete" && graph.limitations.length === 0) context.addIssue({
		code: "custom",
		path: ["limitations"],
		message: "Non-complete graph coverage requires a limitation"
	});
}
function* parseAndSealSemanticGraphSteps(container) {
	const issues = [];
	const parsed = {
		...container,
		evidence_contexts: yield* parseElementSteps(semanticGraphShape.evidence_contexts.element, container.evidence_contexts, ["evidence_contexts"], issues),
		nodes: yield* parseElementSteps(semanticGraphShape.nodes.element, container.nodes, ["nodes"], issues),
		relations: yield* parseElementSteps(semanticGraphShape.relations.element, container.relations, ["relations"], issues),
		fingerprints: yield* parseElementSteps(semanticGraphShape.fingerprints.element, container.fingerprints, ["fingerprints"], issues),
		unknowns: yield* parseElementSteps(semanticGraphShape.unknowns.element, container.unknowns, ["unknowns"], issues)
	};
	if (issues.length > 0) throw new z.ZodError(issues);
	return yield* validateAndSealSemanticGraphSteps(normalizeGraphInput(parsed));
}
function* validateAndSealSemanticGraphSteps(semantic) {
	const graph = {
		...semantic,
		graph_id: `jsrg_${yield* canonicalJsonDigestSteps(semantic)}`
	};
	const issues = [];
	yield* checkGraphContentSteps(graph, { addIssue: (issue) => {
		issues.push(issue);
	} });
	if (issues.length > 0) throw new z.ZodError(issues);
	yield* freezeOwnedJsonSnapshotSteps(graph);
	validatedImmutableSemanticGraphs.add(graph);
	return graph;
}
var normalizeEvidence, evidenceContextId, JavaScriptSemanticEvidenceContextRegistry, javaScriptSemanticNodeId, createJavaScriptSemanticGraphNode, createJavaScriptSemanticGraphRelation, createJavaScriptSemanticGraphUnknown, createJavaScriptSemanticFingerprint, sortedUniqueIssue, checkCanonicalOrder, checkUnknownReferences, checkGraphContent, checkGraph, javaScriptSemanticGraphSchema, resolveJavaScriptSemanticEvidence, normalizeGraphInput, createJavaScriptSemanticGraph, validatedImmutableSemanticGraphs, semanticGraphShape, semanticGraphContainerSchema, createImmutableJavaScriptSemanticGraphSteps, sealTransferredJavaScriptSemanticGraphSteps, isValidatedImmutableJavaScriptSemanticGraph;
function init_javascriptSemanticGraph() {
	return (init_javascriptSemanticGraph = __esmMin((() => {
		init_comparisonSemantics();
		init_canonicalDigest();
		init_canonicalOrdering();
		init_unicodeCodePointOrder();
		init_canonicalJsonDigestSteps();
		init_immutableJson();
		init_zodCollectionSteps();
		init_javascriptApplicationEvidenceSchemas();
		init_javascriptSemanticGraphSchemas();
		normalizeEvidence = (evidence) => ({
			...evidence,
			coverage: {
				...evidence.coverage,
				limits: [...evidence.coverage.limits].sort((left, right) => compareUnicodeCodePoints(canonicalJson(left, "JavaScript semantic graph"), canonicalJson(right, "JavaScript semantic graph")))
			},
			limitations: uniqueSorted(evidence.limitations),
			evidence_ids: uniqueSorted(evidence.evidence_ids)
		});
		evidenceContextId = (context) => `jsrg_evidence_${digestCanonicalValue(context, "JavaScript semantic evidence context")}`;
		JavaScriptSemanticEvidenceContextRegistry = class {
			#contexts = new Map();
			#idsByCanonicalContext = new Map();
			/** Intern normalized non-location provenance at fact construction. */
			intern(evidence) {
				const normalized = normalizeEvidence(evidence);
				const { location, ...context } = normalized;
				const canonicalContext = canonicalJson(context, "JavaScript semantic graph");
				const internedId = this.#idsByCanonicalContext.get(canonicalContext);
				if (internedId !== undefined) return {
					context_id: internedId,
					location
				};
				const contextId = evidenceContextId(context);
				if (this.#contexts.has(contextId)) throw new TypeError("JavaScript semantic evidence context digest collision");
				this.#contexts.set(contextId, {
					...context,
					context_id: contextId
				});
				this.#idsByCanonicalContext.set(canonicalContext, contextId);
				return {
					context_id: contextId,
					location
				};
			}
			/** Resolve one already interned fact reference for derived evidence. */
			resolve(reference) {
				const context = this.#contexts.get(reference.context_id);
				if (context === undefined) throw new TypeError("Semantic evidence reference names an absent context");
				const { context_id: _contextId, ...evidenceContext } = context;
				return {
					...evidenceContext,
					location: reference.location
				};
			}
			/** Return the deterministic context table owned by this graph projection. */
			get contexts() {
				return [...this.#contexts.values()].sort((left, right) => compareUnicodeCodePoints(left.context_id, right.context_id));
			}
			/** Release interned contexts after the owning graph is finalized. */
			clear() {
				this.#contexts.clear();
				this.#idsByCanonicalContext.clear();
			}
			/** Validate and intern provenance decoded in this realm from an analysis worker. */
			adopt(input) {
				const context = javaScriptSemanticEvidenceContextSchema.parse(input);
				const { context_id: identifier, ...value } = context;
				if (identifier !== evidenceContextId(value)) throw new TypeError("Transferred semantic evidence context identifier is stale");
				const canonical = canonicalJson(value, "JavaScript semantic evidence context");
				const existing = this.#contexts.get(identifier);
				if (existing !== undefined) {
					const { context_id: _existingIdentifier, ...existingValue } = existing;
					if (canonical !== canonicalJson(existingValue, "JavaScript semantic evidence context")) throw new TypeError("Transferred semantic evidence context digest collision");
				}
				this.#contexts.set(identifier, context);
				this.#idsByCanonicalContext.set(canonical, identifier);
			}
		};
		javaScriptSemanticNodeId = (node) => `jsrg_node_${digestCanonicalValue({
			kind: node.kind,
			identity: node.identity
		}, "JavaScript semantic graph")}`;
		createJavaScriptSemanticGraphNode = (input, evidenceContexts) => {
			const parsed = javaScriptSemanticNodeInputSchema.parse(input);
			const semantic = {
				...parsed,
				application_node_ids: uniqueSorted(parsed.application_node_ids),
				evidence: evidenceContexts.intern(parsed.evidence)
			};
			return {
				...semantic,
				node_id: javaScriptSemanticNodeId(semantic)
			};
		};
		createJavaScriptSemanticGraphRelation = (input, evidenceContexts) => {
			const parsed = javaScriptSemanticRelationInputSchema.parse(input);
			const semantic = {
				...parsed,
				evidence: evidenceContexts.intern(parsed.evidence)
			};
			return {
				...semantic,
				relation_id: `jsrg_relation_${digestCanonicalValue(semantic, "JavaScript semantic graph")}`
			};
		};
		createJavaScriptSemanticGraphUnknown = (input, evidenceContexts) => {
			const parsed = javaScriptSemanticUnknownInputSchema.parse(input);
			const semantic = {
				...parsed,
				relation_kinds: uniqueSorted(parsed.relation_kinds),
				candidate_node_ids: uniqueSorted(parsed.candidate_node_ids),
				evidence: evidenceContexts.intern(parsed.evidence)
			};
			return {
				...semantic,
				unknown_id: `jsrg_unknown_${digestCanonicalValue(semantic, "JavaScript semantic graph")}`
			};
		};
		createJavaScriptSemanticFingerprint = (input, evidenceContexts) => {
			const parsed = javaScriptSemanticFingerprintInputSchema.parse(input);
			const semantic = {
				...parsed,
				components: {
					...parsed.components,
					effects: uniqueSorted(parsed.components.effects)
				},
				limitations: uniqueSorted(parsed.limitations),
				evidence: evidenceContexts.intern(parsed.evidence)
			};
			const fingerprintSha256 = digestCanonicalValue(semantic.components, "JavaScript semantic graph");
			return {
				...semantic,
				fingerprint_sha256: fingerprintSha256,
				fingerprint_id: `jsrg_fingerprint_${digestCanonicalValue({
					function_node_id: semantic.function_node_id,
					algorithm: semantic.algorithm,
					fingerprint_sha256: fingerprintSha256
				}, "JavaScript semantic graph")}`
			};
		};
		sortedUniqueIssue = (values, path, label, context) => {
			for (let index = 1; index < values.length; index += 1) {
				if (compareUnicodeCodePoints(values[index - 1] ?? "", values[index] ?? "") < 0) continue;
				context.addIssue({
					code: "custom",
					path: [...path, index],
					message: `${label} must be sorted and unique`
				});
				return;
			}
		};
		checkCanonicalOrder = (graph, context) => {
			sortedUniqueIssue(graph.root_node_ids, ["root_node_ids"], "Root nodes", context);
			sortedUniqueIssue(graph.evidence_contexts.map(({ context_id }) => context_id), ["evidence_contexts"], "Evidence contexts", context);
			sortedUniqueIssue(graph.nodes.map(({ node_id }) => node_id), ["nodes"], "Nodes", context);
			sortedUniqueIssue(graph.relations.map(({ relation_id }) => relation_id), ["relations"], "Relations", context);
			sortedUniqueIssue(graph.fingerprints.map(({ fingerprint_id }) => fingerprint_id), ["fingerprints"], "Fingerprints", context);
			sortedUniqueIssue(graph.unknowns.map(({ unknown_id }) => unknown_id), ["unknowns"], "Unknown frontiers", context);
			sortedUniqueIssue(graph.limitations, ["limitations"], "Limitations", context);
		};
		checkUnknownReferences = (graph, context) => {
			const unknownIds = new Set(graph.unknowns.map(({ unknown_id }) => unknown_id));
			for (const [index, family] of graph.coverage.families.entries()) if (family.unknown_ids.some((identifier) => !unknownIds.has(identifier))) context.addIssue({
				code: "custom",
				path: [
					"coverage",
					"families",
					index,
					"unknown_ids"
				],
				message: "Family coverage references an absent unknown frontier"
			});
		};
		checkGraphContent = (graph, context) => {
			const steps = checkGraphContentSteps(graph, context);
			while (!steps.next().done) {}
		};
		checkGraph = (graph, context) => {
			checkGraphContent(graph, context);
			const { graph_id: identifier, ...semantic } = graph;
			if (identifier !== "jsrg_" + digestCanonicalValue(semantic, "JavaScript semantic graph")) context.addIssue({
				code: "custom",
				path: ["graph_id"],
				message: "Graph identifier is stale"
			});
		};
		javaScriptSemanticGraphSchema = javaScriptSemanticGraphRecordSchema.superRefine(checkGraph);
		resolveJavaScriptSemanticEvidence = (graph, reference) => {
			const context = graph.evidence_contexts.find(({ context_id }) => context_id === reference.context_id);
			if (context === undefined) throw new TypeError("Semantic evidence reference names an absent context");
			const { context_id: _contextId, ...evidenceContext } = context;
			return {
				...evidenceContext,
				location: reference.location
			};
		};
		normalizeGraphInput = (parsed) => ({
			...parsed,
			root_node_ids: uniqueSorted(parsed.root_node_ids),
			evidence_contexts: [...parsed.evidence_contexts].sort((left, right) => compareUnicodeCodePoints(left.context_id, right.context_id)),
			nodes: [...parsed.nodes].sort((left, right) => compareUnicodeCodePoints(left.node_id, right.node_id)),
			relations: [...parsed.relations].sort((left, right) => compareUnicodeCodePoints(left.relation_id, right.relation_id)),
			fingerprints: [...parsed.fingerprints].sort((left, right) => compareUnicodeCodePoints(left.fingerprint_id, right.fingerprint_id)),
			unknowns: [...parsed.unknowns].sort((left, right) => compareUnicodeCodePoints(left.unknown_id, right.unknown_id)),
			coverage: {
				...parsed.coverage,
				limits: [...parsed.coverage.limits].sort((left, right) => compareUnicodeCodePoints(canonicalJson(left, "JavaScript semantic graph"), canonicalJson(right, "JavaScript semantic graph"))),
				families: [...parsed.coverage.families].map((family) => ({
					...family,
					unknown_ids: uniqueSorted(family.unknown_ids)
				})).sort((left, right) => compareUnicodeCodePoints(left.family, right.family))
			},
			limitations: uniqueSorted(parsed.limitations)
		});
		createJavaScriptSemanticGraph = (input) => {
			const semantic = normalizeGraphInput(javaScriptSemanticGraphInputSchema.parse(input));
			const record = {
				...semantic,
				graph_id: `jsrg_${digestCanonicalValue(semantic, "JavaScript semantic graph")}`
			};
			const issues = [];
			checkGraphContent(record, { addIssue: (issue) => {
				issues.push(issue);
			} });
			if (issues.length > 0) throw new z.ZodError(issues);
			return record;
		};
		validatedImmutableSemanticGraphs = new WeakSet();
		semanticGraphShape = javaScriptSemanticGraphInputSchema.shape;
		semanticGraphContainerSchema = javaScriptSemanticGraphInputSchema.extend({
			evidence_contexts: arrayContainerSchema(semanticGraphShape.evidence_contexts),
			nodes: arrayContainerSchema(semanticGraphShape.nodes),
			relations: arrayContainerSchema(semanticGraphShape.relations),
			fingerprints: arrayContainerSchema(semanticGraphShape.fingerprints),
			unknowns: arrayContainerSchema(semanticGraphShape.unknowns)
		});
		createImmutableJavaScriptSemanticGraphSteps = (input) => validateAndSealSemanticGraphSteps(normalizeGraphInput(javaScriptSemanticGraphInputSchema.parse(input)));
		sealTransferredJavaScriptSemanticGraphSteps = (input) => parseAndSealSemanticGraphSteps(semanticGraphContainerSchema.parse(input));
		isValidatedImmutableJavaScriptSemanticGraph = (value) => typeof value === "object" && value !== null && validatedImmutableSemanticGraphs.has(value);
	})))();
}

//#endregion
//#region dist/domain/artifactIntegrityPolicy.js
var artifactIntegrityPolicySchema;
function init_artifactIntegrityPolicy() {
	return (init_artifactIntegrityPolicy = __esmMin((() => {
		artifactIntegrityPolicySchema = z.enum(["fail", "record-and-continue"]).default("fail");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptAnalysisResourceControls.js
var JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS, JAVASCRIPT_SEMANTIC_NODE_MAXIMUM, javaScriptAnalysisCoverageLimits, javaScriptAnalysisResourceControlsSchema;
function init_javascriptAnalysisResourceControls() {
	return (init_javascriptAnalysisResourceControls = __esmMin((() => {
		JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS = {
			heapMb: 1024,
			timeoutMs: 3e5,
			semanticNodes: 1e5,
			semanticNodesPerFile: 2e4
		};
		JAVASCRIPT_SEMANTIC_NODE_MAXIMUM = 1e6;
		javaScriptAnalysisCoverageLimits = (limits) => {
			const result = [];
			for (const key of [
				"worker_heap_limit_bytes",
				"worker_process_memory_limit_bytes",
				"worker_timeout_ms",
				"parent_result_budget_bytes",
				"parent_available_result_budget_bytes",
				"semantic_result_budget_bytes",
				"transfer_record_bytes",
				"transfer_file_bytes"
			]) {
				const value = limits?.[key];
				if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) continue;
				result.push({
					name: `javascript_analysis_${key}`,
					value,
					unit: key.endsWith("_ms") ? "milliseconds" : "bytes"
				});
			}
			return result;
		};
		javaScriptAnalysisResourceControlsSchema = z.strictObject({
			max_semantic_nodes: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_NODE_MAXIMUM).optional().describe("Maximum retained semantic nodes across the application; defaults to 100000. Worker heap and parent result admission remain enforced."),
			max_semantic_nodes_per_file: z.number().int().min(1).max(JAVASCRIPT_SEMANTIC_NODE_MAXIMUM).optional().describe("Maximum retained semantic nodes per source file; defaults to 20000, additionally bounded by max_semantic_nodes and memory/transfer limits."),
			max_heap_mb: z.number().int().min(128).max(16384).optional().describe("Maximum V8 old-space heap in MiB for the isolated JavaScript source analyzer; defaults to 1024. This does not change the CLI/MCP process heap. When REA runs on Bun, which ignores V8 heap flags, Windows instead limits the analyzer's committed memory to this budget plus a 512 MiB runtime reserve; other Bun hosts enforce no limit."),
			analysis_timeout_ms: z.number().int().min(1).max(2147483647).optional().describe("Maximum startup, analysis and transfer time per JavaScript source, in milliseconds; defaults to 300000. On timeout, return collected partial Evidence and stop the analysis.")
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptApplicationAnalysis.js
function* checkApplicationBindingsSteps(result, context) {
	if (result.semantic_graph.application_graph_id !== result.graph.graph_id) context.addIssue({
		code: "custom",
		path: ["semantic_graph", "application_graph_id"],
		message: "Semantic graph must commit the containing application graph"
	});
	if (result.semantic_graph.root_artifact_sha256 !== result.root_artifact_sha256) context.addIssue({
		code: "custom",
		path: ["semantic_graph", "root_artifact_sha256"],
		message: "Semantic graph must commit the containing root artifact"
	});
	const applicationNodeIds = new Set();
	let examined = 0;
	try {
		for (const node of result.graph.nodes) {
			applicationNodeIds.add(node.node_id);
			if (++examined === 4096) {
				examined = 0;
				yield;
			}
		}
		for (const [nodeIndex, node] of result.semantic_graph.nodes.entries()) {
			if (++examined === 4096) {
				examined = 0;
				yield;
			}
			for (const [identifierIndex, identifier] of node.application_node_ids.entries()) {
				if (!applicationNodeIds.has(identifier)) context.addIssue({
					code: "custom",
					path: [
						"semantic_graph",
						"nodes",
						nodeIndex,
						"application_node_ids",
						identifierIndex
					],
					message: "Semantic node references an absent application node"
				});
				if (++examined === 4096) {
					examined = 0;
					yield;
				}
			}
		}
	} finally {
		applicationNodeIds.clear();
	}
}
/** Reuse exact owned graphs while validating metadata and cross-graph bindings. */
function* parseOwnedJavaScriptApplicationAnalysisSteps(input) {
	const prepared = ownedAnalysisResultShape.safeParse(input);
	if (!prepared.success) return javascriptApplicationAnalysisResultSchema.parse(input);
	const issues = [];
	yield* checkApplicationBindingsSteps(prepared.data, { addIssue: (issue) => {
		issues.push(issue);
	} });
	if (issues.length > 0) throw new z.ZodError(issues);
	return prepared.data;
}
var countSchema, analyzeJavaScriptApplicationInputSchema, electronBoundarySummarySchema, reconstructionStatisticsSchema, applicationAnalysisResultShape, javascriptApplicationAnalysisResultSchema, ownedAnalysisResultShape;
function init_javascriptApplicationAnalysis() {
	return (init_javascriptApplicationAnalysis = __esmMin((() => {
		init_javascriptApplicationGraph();
		init_javascriptSemanticGraph();
		init_digests();
		init_artifactGraph();
		init_artifactIntegrityPolicy();
		init_localPath();
		init_javascriptAnalysisResourceControls();
		init_javascriptSourceSelection();
		countSchema = z.number().int().min(0);
		analyzeJavaScriptApplicationInputSchema = z.strictObject({
			input_path: localPathStringSchema,
			format: z.enum([
				"auto",
				"asar",
				"directory"
			]).default("auto"),
			integrity_policy: artifactIntegrityPolicySchema,
			source_paths: javaScriptSourcePathsSchema.optional(),
			...javaScriptAnalysisResourceControlsSchema.shape
		});
		electronBoundarySummarySchema = z.strictObject({
			browser_windows: countSchema,
			explicit_web_preferences: countSchema,
			preload_entrypoints: countSchema,
			context_bridge_apis: countSchema,
			exposed_api_members: countSchema,
			ipc: z.strictObject({
				operations: countSchema,
				literal_channels: countSchema,
				dynamic_channel_operations: countSchema,
				renderer_transmissions: countSchema,
				renderer_listeners: countSchema,
				main_handlers: countSchema,
				paired_renderer_transmissions: countSchema,
				ambiguous_renderer_transmissions: countSchema,
				unpaired_literal_renderer_transmissions: countSchema
			}),
			sender_validation_observations: countSchema,
			utility_processes: countSchema,
			resolved_utility_entrypoints: countSchema,
			native_addon_bindings: countSchema,
			resolved_native_addon_bindings: countSchema
		});
		reconstructionStatisticsSchema = z.strictObject({
			relevant_files: countSchema,
			nested_asar_containers: countSchema,
			text_bytes_read: countSchema,
			invalid_utf8_files: countSchema,
			parsed_javascript_files: countSchema,
			visited_ast_nodes: countSchema,
			findings: countSchema,
			modules: countSchema,
			parse_failures: countSchema
		});
		applicationAnalysisResultShape = z.strictObject({
			input_path: z.string().min(1),
			format: z.enum(["asar", "directory"]),
			root_artifact_sha256: digestSchema,
			inventory_manifest_id: prefixedDigestSchema("agm"),
			inventory_graph_sha256: digestSchema,
			integrity_contradictions: z.array(integrityContradictionSchema),
			source_selection: javaScriptSourceSelectionSchema.exactOptional(),
			graph: javascriptApplicationGraphSchema,
			summary: electronBoundarySummarySchema,
			statistics: reconstructionStatisticsSchema,
			limitations: z.array(z.string().min(1)),
			semantic_graph: javaScriptSemanticGraphSchema
		});
		javascriptApplicationAnalysisResultSchema = applicationAnalysisResultShape.superRefine((result, context) => {
			const steps = checkApplicationBindingsSteps(result, context);
			while (!steps.next().done) {}
		});
		ownedAnalysisResultShape = applicationAnalysisResultShape.extend({
			graph: z.custom(isValidatedImmutableJavaScriptApplicationGraph),
			semantic_graph: z.custom(isValidatedImmutableJavaScriptSemanticGraph)
		});
	})))();
}

//#endregion
export { JAVASCRIPT_ANALYSIS_RESOURCE_DEFAULTS, JAVASCRIPT_APPLICATION_NODE_KINDS, JAVASCRIPT_SEMANTIC_NODE_KINDS, JAVASCRIPT_SEMANTIC_NODE_MAXIMUM, JAVASCRIPT_SEMANTIC_RELATIONS, JAVASCRIPT_SEMANTIC_RELATION_FAMILIES, JAVASCRIPT_SEMANTIC_RELATION_FAMILY, JavaScriptSemanticEvidenceContextRegistry, analyzeJavaScriptApplicationInputSchema, artifactIntegrityPolicySchema, completeApplicationCoverage, createImmutableJavaScriptApplicationGraphSteps, createJavaScriptApplicationEdge, createJavaScriptApplicationGraph, createJavaScriptApplicationNode, createJavaScriptSemanticFingerprint, createJavaScriptSemanticGraph, createJavaScriptSemanticGraphNode, createJavaScriptSemanticGraphRelation, createJavaScriptSemanticGraphUnknown, init_artifactIntegrityPolicy, init_javascriptAnalysisResourceControls, init_javascriptApplicationAnalysis, init_javascriptApplicationEvidenceSchemas, init_javascriptApplicationGraph, init_javascriptApplicationGraphSchemas, init_javascriptSemanticGraph, init_javascriptSemanticGraphSchemas, init_javascriptSourceMapPaths, init_javascriptSourceSelection, isValidatedImmutableJavaScriptApplicationGraph, javaScriptAnalysisCoverageLimits, javaScriptAnalysisResourceControlsSchema, javaScriptSemanticEvidenceContextSchema, javaScriptSemanticFingerprintSchema, javaScriptSemanticNodeId, javaScriptSemanticNodeSchema, javaScriptSemanticRelationSchema, javaScriptSemanticUnknownSchema, javaScriptSourcePathsSchema, javaScriptSourceSelectionSchema, javascriptApplicationAnalysisResultSchema, javascriptApplicationGraphSchema, parseOwnedJavaScriptApplicationAnalysisSteps, partialApplicationCoverage, resolveJavaScriptSourceMapReferences, resolveJavaScriptSourceMapUrl, sealTransferredJavaScriptApplicationGraphSteps, sealTransferredJavaScriptSemanticGraphSteps, truncatedApplicationCoverage };