import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { canonicalJson, compareUnicodeCodePoints, digestCanonicalValue, digestSchema, emptyArraySchema, evidenceSchema, init_canonicalDigest, init_comparisonSemantics, init_digests, init_emptyArraySchema, init_evidence, init_unicodeCodePointOrder, prefixedDigestSchema, providerSchema } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { JAVASCRIPT_APPLICATION_NODE_KINDS, init_javascriptApplicationGraph, init_javascriptApplicationGraphSchemas, isValidatedImmutableJavaScriptApplicationGraph, javascriptApplicationGraphSchema } from "./javascriptApplicationAnalysis-HgMzVMQw.js";
import { z } from "zod";
import { posix } from "node:path";

//#region dist/domain/referenceSourcePathIdentity.js
var createReferenceSourcePathLookup, isPortableAbsoluteReferenceTarget;
function init_referenceSourcePathIdentity() {
	return (init_referenceSourcePathIdentity = __esmMin((() => {
		createReferenceSourcePathLookup = (paths) => {
			const exact = new Set(paths);
			const canonical = new Map();
			for (const path of exact) {
				const key = path.normalize("NFC");
				canonical.set(key, canonical.has(key) ? null : path);
			}
			const equivalent = (path) => canonical.get(path.normalize("NFC")) ?? undefined;
			const resolve = (path) => exact.has(path) ? path : equivalent(path);
			return {
				resolve,
				resolveCandidates: (candidates) => candidates.find((path) => exact.has(path)) ?? candidates.map(equivalent).find((path) => path !== undefined),
				resolveAncestor: (path) => {
					for (let candidate = path; candidate !== "." && candidate !== "/"; candidate = posix.dirname(candidate)) {
						const found = resolve(candidate);
						if (found !== undefined) return found;
					}
					return undefined;
				}
			};
		};
		isPortableAbsoluteReferenceTarget = (target) => target.startsWith("/") || /^[A-Za-z]:[\\/]/u.test(target) || /^\\\\[^\\/]+[\\/][^\\/]+/u.test(target);
	})))();
}

//#endregion
//#region dist/domain/referenceSourceGraph.js
function checkGraphInvariants(graph, context) {
	checkSortedUnique(graph.entries.map(({ path }) => path), "entries", context);
	for (const [index, entry] of graph.entries.entries()) checkSortedUnique(entry.classifications, `entries.${index}.classifications`, context);
	checkSortedUnique(graph.languages, "languages", context);
	checkSortedUnique(graph.manifests, "manifests", context);
	checkSortedUnique(graph.relationships.map(relationshipKey), "relationships", context);
	checkSortedUnique(graph.parse_failures.map(historicalSourceParseFailureKey), "parse_failures", context);
	checkSortedUnique(graph.exclusions.map((exclusion) => `${exclusion.path}\u0000${exclusion.reason}\u0000${"pattern" in exclusion ? exclusion.pattern : ""}`), "exclusions", context);
	if (canonicalJson(graph.languages, "Reference source graph") !== canonicalJson(historicalSourceLanguages(graph.entries), "Reference source graph")) context.addIssue({
		code: "custom",
		message: "languages must be derived from file entries",
		path: ["languages"]
	});
	if (canonicalJson(graph.manifests, "Reference source graph") !== canonicalJson(historicalSourceManifests(graph.entries), "Reference source graph")) context.addIssue({
		code: "custom",
		message: "manifests must be derived from classified file entries",
		path: ["manifests"]
	});
	const paths = new Set(graph.entries.map(({ path }) => path));
	checkRelationships(graph, paths, context);
	checkSymlinks(graph, paths, context);
	checkCompleteInventory(graph, context);
}
var boundedTextSchema$1, relativePathSchema, classificationSchema, entryBaseShape, sourceFileBaseShape, sourceFileSchema, sourceDirectorySchema, symlinkTargetSchema, sourceSymlinkSchema, sourceEntrySchema, sourceRelationshipSchema, parseFailureSchema, exclusionSchema, vcsSchema, graphShape, historicalSourceGraphStructureSchema, historicalSourceGraphSchema, historicalSourceGraphInputSchema, historicalSourceManifestBaseSchema, historicalSourceParseFailureKey, relationshipKey, checkSortedUnique, historicalSourceLanguages, historicalSourceManifests, checkRelationships, checkSymlinks, checkCompleteInventory, rootCommitment, computeRootSha256, createHistoricalSourceGraph, parseHistoricalSourceGraph, computeHistoricalSourceGraphSha256, createHistoricalSourceManifest, parseHistoricalSourceManifest;
function init_referenceSourceGraph() {
	return (init_referenceSourceGraph = __esmMin((() => {
		init_comparisonSemantics();
		init_canonicalDigest();
		init_referenceSourcePathIdentity();
		init_unicodeCodePointOrder();
		init_digests();
		boundedTextSchema$1 = z.string().min(1);
		relativePathSchema = z.string().min(1).refine((path) => !path.startsWith("/") && !path.includes("\0") && path.split("/").every((part) => part !== "" && part !== "." && part !== ".."), "Expected a normalized relative POSIX path without traversal");
		classificationSchema = z.enum([
			"source",
			"test",
			"config",
			"manifest",
			"generated",
			"vendor",
			"documentation",
			"unknown"
		]);
		entryBaseShape = {
			path: relativePathSchema,
			classifications: z.array(classificationSchema).min(1),
			limitations: z.array(boundedTextSchema$1)
		};
		sourceFileBaseShape = {
			...entryBaseShape,
			kind: z.literal("file"),
			language: z.string().min(1).nullable()
		};
		sourceFileSchema = z.union([z.strictObject({
			...sourceFileBaseShape,
			sha256: digestSchema,
			size: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			content_state: z.literal("hashed")
		}), z.strictObject({
			...sourceFileBaseShape,
			sha256: z.null(),
			size: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			content_state: z.enum([
				"redacted-secret",
				"excluded",
				"unreadable",
				"unknown"
			])
		})]);
		sourceDirectorySchema = z.strictObject({
			...entryBaseShape,
			kind: z.literal("directory"),
			tree_state: z.enum([
				"enumerated",
				"partial",
				"excluded",
				"unreadable",
				"unknown"
			])
		});
		symlinkTargetSchema = z.string().min(1).refine((target) => !target.includes("\0") && (isPortableAbsoluteReferenceTarget(target) || !target.startsWith("/") && posix.normalize(target) === target), "Expected a normalized POSIX symlink target");
		sourceSymlinkSchema = z.union([z.strictObject({
			...entryBaseShape,
			kind: z.literal("symlink"),
			target: symlinkTargetSchema,
			target_state: z.enum([
				"internal",
				"external",
				"missing"
			])
		}), z.strictObject({
			...entryBaseShape,
			kind: z.literal("symlink"),
			target: z.null(),
			target_state: z.enum(["unreadable", "unknown"])
		})]);
		sourceEntrySchema = z.union([
			sourceFileSchema,
			sourceDirectorySchema,
			sourceSymlinkSchema,
			z.strictObject({
				...entryBaseShape,
				kind: z.literal("unknown")
			})
		]);
		sourceRelationshipSchema = z.strictObject({
			from_path: relativePathSchema,
			to: z.string().min(1),
			kind: z.enum([
				"imports",
				"requires",
				"references",
				"declares-module"
			]),
			resolution: z.enum([
				"internal",
				"external",
				"unresolved",
				"unknown"
			]),
			parse_state: z.enum([
				"parsed",
				"partial",
				"unknown"
			])
		});
		parseFailureSchema = z.strictObject({
			path: relativePathSchema,
			parser: z.string().min(1),
			reason: boundedTextSchema$1
		});
		exclusionSchema = z.discriminatedUnion("reason", [z.strictObject({
			path: relativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"other",
				"unknown"
			]).exactOptional(),
			reason: z.enum([
				"configured-secret",
				"project-ignored",
				"default-ignored",
				"caller-excluded"
			]),
			pattern: boundedTextSchema$1
		}), z.strictObject({
			path: relativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"other",
				"unknown"
			]).exactOptional(),
			reason: z.enum(["symlink-escape", "unreadable"])
		})]);
		vcsSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("git"),
				head: z.string().regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u),
				dirty: z.boolean().nullable()
			}),
			z.strictObject({
				kind: z.literal("none"),
				head: z.null(),
				dirty: z.null()
			}),
			z.strictObject({
				kind: z.literal("unknown"),
				head: z.null(),
				dirty: z.null()
			})
		]).nullable();
		graphShape = {
			schema: z.literal("HistoricalSourceGraph"),
			authority: z.literal("historical-reference"),
			root_alias: z.literal("$REFERENCE_ROOT"),
			root_sha256: digestSchema,
			inventory_state: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			entries: z.array(sourceEntrySchema),
			relationships: z.array(sourceRelationshipSchema),
			parse_failures: z.array(parseFailureSchema),
			exclusions: z.array(exclusionSchema),
			languages: z.array(z.string().min(1)),
			manifests: z.array(relativePathSchema),
			vcs: vcsSchema,
			provenance: z.strictObject({
				importer: z.string().min(1),
				importer_version: z.string().min(1).nullable(),
				caller: z.string().min(1).regex(/^[\w .:@\x2f+\x2d]+$/u)
			}),
			limitations: z.array(boundedTextSchema$1)
		};
		historicalSourceGraphStructureSchema = z.strictObject(graphShape).superRefine(checkGraphInvariants);
		historicalSourceGraphSchema = historicalSourceGraphStructureSchema.superRefine((graph, context) => {
			if (computeRootSha256(graph.entries, graph.exclusions) !== graph.root_sha256) context.addIssue({
				code: "custom",
				message: "Historical source root commitment does not match entries",
				path: ["root_sha256"]
			});
		});
		historicalSourceGraphInputSchema = z.strictObject({
			...graphShape,
			root_sha256: z.never().optional()
		});
		historicalSourceManifestBaseSchema = z.strictObject({
			schema: z.literal("HistoricalSourceManifest"),
			authority: z.literal("historical-reference"),
			manifest_id: prefixedDigestSchema("hsm"),
			graph_sha256: digestSchema,
			root_sha256: digestSchema,
			inventory_state: z.enum([
				"complete",
				"partial",
				"unknown"
			]),
			entry_count: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			relationship_count: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)
		});
		historicalSourceParseFailureKey = (failure) => `${failure.path}\u0000${failure.parser}\u0000${failure.reason}`;
		relationshipKey = (relationship) => `${relationship.from_path}\u0000${relationship.to}\u0000${relationship.kind}\u0000${relationship.resolution}\u0000${relationship.parse_state}`;
		checkSortedUnique = (values, field, context) => {
			for (let index = 1; index < values.length; index += 1) if (compareUnicodeCodePoints(values[index - 1] ?? "", values[index] ?? "") >= 0) {
				context.addIssue({
					code: "custom",
					message: `${field} must be sorted and unique by Unicode code point`,
					path: [field, index]
				});
				return;
			}
		};
		historicalSourceLanguages = (entries) => [...new Set(entries.flatMap((entry) => entry.kind === "file" && entry.language !== null ? [entry.language] : []))].sort(compareUnicodeCodePoints);
		historicalSourceManifests = (entries) => entries.flatMap((entry) => entry.kind === "file" && entry.classifications.includes("manifest") ? [entry.path] : []).sort(compareUnicodeCodePoints);
		checkRelationships = (graph, paths, context) => {
			const files = new Set(graph.entries.flatMap((entry) => entry.kind === "file" ? [entry.path] : []));
			for (const [index, relationship] of graph.relationships.entries()) {
				if (!files.has(relationship.from_path)) context.addIssue({
					code: "custom",
					message: "Relationship source must name an inventoried file",
					path: [
						"relationships",
						index,
						"from_path"
					]
				});
				if (relationship.resolution !== "internal") continue;
				const parsed = relativePathSchema.safeParse(relationship.to);
				if (!parsed.success || !paths.has(parsed.data)) context.addIssue({
					code: "custom",
					message: "Internal relationship target must be normalized and inventoried",
					path: [
						"relationships",
						index,
						"to"
					]
				});
			}
		};
		checkSymlinks = (graph, paths, context) => {
			const lookupPath = createReferenceSourcePathLookup(paths);
			const excludedPaths = createReferenceSourcePathLookup(graph.exclusions.map(({ path }) => path));
			const excludedKinds = new Map();
			for (const { path, entry_kind } of graph.exclusions) {
				const kinds = excludedKinds.get(path) ?? new Set();
				kinds.add(entry_kind);
				excludedKinds.set(path, kinds);
			}
			for (const [index, entry] of graph.entries.entries()) {
				if (entry.kind !== "symlink") continue;
				if (entry.target === null) continue;
				const resolved = posix.normalize(posix.join(posix.dirname(entry.path), entry.target));
				const escapesRoot = resolved.startsWith("../") || resolved === "..";
				const inventoried = resolved === "." || lookupPath.resolve(resolved) !== undefined;
				const exactExcluded = excludedPaths.resolve(resolved);
				let excluded = exactExcluded !== undefined;
				for (let candidate = posix.dirname(resolved); candidate !== "." && candidate !== "/"; candidate = posix.dirname(candidate)) {
					const excludedAncestor = excludedPaths.resolve(candidate);
					if (excludedAncestor === undefined) continue;
					const kinds = excludedKinds.get(excludedAncestor);
					if (kinds?.size !== 1 || !kinds.has("directory")) {
						excluded = false;
						break;
					}
					excluded = true;
				}
				const ownedRelativeTarget = !entry.target.startsWith("/") && !escapesRoot && inventoried;
				const absolute = isPortableAbsoluteReferenceTarget(entry.target) && !(entry.target_state === "internal" && ownedRelativeTarget);
				if (entry.target_state === "external" && !absolute || entry.target_state === "internal" && absolute) context.addIssue({
					code: "custom",
					message: "Symlink target path does not match its target state",
					path: [
						"entries",
						index,
						"target"
					]
				});
				if (entry.target_state !== "internal") continue;
				if (escapesRoot || !inventoried && !excluded) context.addIssue({
					code: "custom",
					message: "Internal symlink target must resolve to an inventoried entry or a recorded exclusion",
					path: [
						"entries",
						index,
						"target"
					]
				});
			}
		};
		checkCompleteInventory = (graph, context) => {
			if (graph.inventory_state !== "complete") return;
			const partialEntry = graph.entries.some((entry) => entry.limitations.length > 0 || entry.kind === "file" && entry.content_state !== "hashed" || entry.kind === "directory" && entry.tree_state !== "enumerated" || entry.kind === "symlink" && entry.target_state !== "internal" || entry.kind === "unknown");
			const partialRelationship = graph.relationships.some(({ parse_state, resolution }) => parse_state !== "parsed" || ["unresolved", "unknown"].includes(resolution));
			if (!partialEntry && !partialRelationship && graph.parse_failures.length === 0 && graph.exclusions.length === 0 && graph.limitations.length === 0) return;
			context.addIssue({
				code: "custom",
				message: "Complete inventory cannot contain partial states, exclusions, failures, or limitations",
				path: ["inventory_state"]
			});
		};
		rootCommitment = (entries, exclusions) => ({
			entries: entries.map((entry) => {
				switch (entry.kind) {
					case "file": return {
						kind: entry.kind,
						path: entry.path,
						sha256: entry.sha256,
						size: entry.size,
						content_state: entry.content_state
					};
					case "directory": return {
						kind: entry.kind,
						path: entry.path,
						tree_state: entry.tree_state
					};
					case "symlink": return {
						kind: entry.kind,
						path: entry.path,
						target: entry.target,
						target_state: entry.target_state
					};
					case "unknown": return {
						kind: entry.kind,
						path: entry.path
					};
				}
			}),
			exclusions
		});
		computeRootSha256 = (entries, exclusions) => digestCanonicalValue(rootCommitment(entries, exclusions), "Reference source graph");
		createHistoricalSourceGraph = (input) => {
			const parsed = historicalSourceGraphInputSchema.parse(input);
			return historicalSourceGraphSchema.parse({
				...parsed,
				root_sha256: computeRootSha256(parsed.entries, parsed.exclusions)
			});
		};
		parseHistoricalSourceGraph = (input) => historicalSourceGraphSchema.parse(input);
		computeHistoricalSourceGraphSha256 = (input) => digestCanonicalValue(parseHistoricalSourceGraph(input), "Reference source graph");
		createHistoricalSourceManifest = (input) => {
			const graph = parseHistoricalSourceGraph(input);
			const semantic = {
				schema: "HistoricalSourceManifest",
				authority: "historical-reference",
				graph_sha256: computeHistoricalSourceGraphSha256(graph),
				root_sha256: graph.root_sha256,
				inventory_state: graph.inventory_state,
				entry_count: graph.entries.length,
				relationship_count: graph.relationships.length
			};
			return historicalSourceManifestBaseSchema.parse({
				...semantic,
				manifest_id: `hsm_${digestCanonicalValue(semantic, "Reference source graph")}`
			});
		};
		parseHistoricalSourceManifest = (input) => {
			const manifest = historicalSourceManifestBaseSchema.parse(input);
			const { manifest_id: manifestId, ...semantic } = manifest;
			if (`hsm_${digestCanonicalValue(semantic, "Reference source graph")}` !== manifestId) throw new TypeError("Historical source manifest identifier does not match");
			return manifest;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptFeatureTraceSchemas.js
var evidenceIdSchema$3, nodeIdSchema$3, edgeIdSchema, boundedTextSchema, featureSeedMatchMode, apiSeedSchema, apiPathSeedSchema, applicationFeatureSeedSchema, validateApplicationTraceIdentities, applicationTraceIdentitiesSchema, traceApplicationFeatureInputSchema, seedMatchSchema, tracePathSchema, nativeHandoffSchema, applicationFeatureTraceResultSchema;
function init_javascriptFeatureTraceSchemas() {
	return (init_javascriptFeatureTraceSchemas = __esmMin((() => {
		init_evidence();
		init_javascriptApplicationGraph();
		init_digests();
		evidenceIdSchema$3 = prefixedDigestSchema("ev");
		nodeIdSchema$3 = prefixedDigestSchema("jag_node");
		edgeIdSchema = prefixedDigestSchema("jag_edge");
		boundedTextSchema = z.string().min(1);
		featureSeedMatchMode = (seed) => seed.match ?? (seed.kind === "string" ? "contains" : "exact");
		apiSeedSchema = z.union([z.strictObject({
			kind: z.literal("api"),
			value: boundedTextSchema,
			match: z.enum(["exact", "contains"]).nullable().default(null),
			case_sensitive: z.boolean().default(false)
		}), z.strictObject({
			kind: z.literal("api"),
			value: z.literal(""),
			match: z.literal("exact"),
			case_sensitive: z.boolean().default(false)
		})]);
		apiPathSeedSchema = z.union([z.strictObject({
			kind: z.literal("api"),
			value: boundedTextSchema,
			match: z.enum(["exact", "contains"]).nullable().default(null),
			case_sensitive: z.boolean().default(false),
			entry_path: z.array(z.string()).min(1)
		}), z.strictObject({
			kind: z.literal("api"),
			value: z.literal(""),
			match: z.literal("exact"),
			case_sensitive: z.boolean().default(false),
			entry_path: z.array(z.string()).min(1)
		})]);
		applicationFeatureSeedSchema = z.union([
			z.strictObject({
				kind: z.enum([
					"node-id",
					"route",
					"string",
					"channel",
					"module",
					"native-export"
				]),
				value: boundedTextSchema,
				match: z.enum(["exact", "contains"]).nullable().default(null),
				case_sensitive: z.boolean().default(false)
			}),
			z.strictObject({
				kind: z.enum([
					"route",
					"string",
					"channel",
					"module",
					"native-export"
				]),
				value: z.literal(""),
				match: z.literal("exact"),
				case_sensitive: z.boolean().default(false)
			}),
			apiSeedSchema,
			apiPathSeedSchema
		]);
		validateApplicationTraceIdentities = (input, context) => {
			const ids = input.native_observations.map(({ evidence_id: id }) => id);
			if (new Set(ids).size !== ids.length) context.addIssue({
				code: "custom",
				path: ["native_observations"],
				message: "Native observations must be unique"
			});
		};
		applicationTraceIdentitiesSchema = z.object({ native_observations: z.array(z.object({ evidence_id: evidenceIdSchema$3 })) }).superRefine(validateApplicationTraceIdentities);
		traceApplicationFeatureInputSchema = z.strictObject({
			application: evidenceSchema,
			native_observations: z.array(evidenceSchema).default([]),
			seed: applicationFeatureSeedSchema,
			direction: z.enum([
				"outgoing",
				"incoming",
				"both"
			]).default("both")
		}).superRefine(validateApplicationTraceIdentities);
		seedMatchSchema = z.strictObject({
			node_id: nodeIdSchema$3,
			kind: z.string().min(1),
			basis: z.enum([
				"node-id",
				"label",
				"identity",
				"property"
			]),
			field: z.string().min(1)
		});
		tracePathSchema = z.strictObject({
			path_id: prefixedDigestSchema("jatp"),
			start_node_id: nodeIdSchema$3,
			end_node_id: nodeIdSchema$3,
			end_kind: z.string().min(1),
			node_ids: z.array(nodeIdSchema$3).min(1),
			edge_ids: z.array(edgeIdSchema),
			authorities: z.array(z.string().min(1)),
			contains_inference: z.boolean()
		});
		nativeHandoffSchema = z.strictObject({
			native_node_id: nodeIdSchema$3,
			artifact_sha256: digestSchema,
			artifact_path: z.string().min(1).nullable(),
			export_node_ids: z.array(nodeIdSchema$3),
			requested_exports: z.array(boundedTextSchema),
			status: z.enum(["evidence-linked", "requires-provider-analysis"]),
			providers: z.array(providerSchema),
			evidence_ids: z.array(evidenceIdSchema$3),
			recommended_tools: z.array(z.enum([
				"open_binary",
				"binary_overview",
				"search_procedures",
				"analyze_function",
				"xrefs"
			]))
		});
		applicationFeatureTraceResultSchema = z.strictObject({
			trace_id: prefixedDigestSchema("jatr"),
			source_evidence_id: evidenceIdSchema$3,
			source_graph_id: prefixedDigestSchema("jag"),
			seed: applicationFeatureSeedSchema,
			direction: z.enum([
				"outgoing",
				"incoming",
				"both"
			]),
			seed_matches: z.array(seedMatchSchema),
			graph: javascriptApplicationGraphSchema.nullable(),
			paths: z.array(tracePathSchema),
			native_handoffs: z.array(nativeHandoffSchema),
			summary: z.strictObject({
				matched_seeds: z.number().int().min(0),
				traced_nodes: z.number().int().min(0),
				traced_edges: z.number().int().min(0),
				terminal_paths: z.number().int().min(0),
				native_handoffs: z.number().int().min(0),
				observed_facts: z.number().int().min(0),
				inferred_facts: z.number().int().min(0),
				unknown_facts: z.number().int().min(0),
				unavailable_facts: z.number().int().min(0)
			}),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-source",
					"partial",
					"no-match"
				]),
				source_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				total_seed_matches: z.number().int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema$3).min(1),
			limitations: z.array(boundedTextSchema)
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptApplicationVersionComparisonSchemas.js
var evidenceIdSchema$2, nodeIdSchema$2, textSchema$2, validateApplicationVersionIdentities, evidenceIdentitySchema$1, applicationVersionIdentitiesSchema, compareApplicationVersionsInputSchema, candidateNodesSchema, exactMatchSchema, sourceMapMatchSchema, inferredMatchSchema, matchedItemMatchSchema, unmatchedItemMatchSchema, leftAmbiguousMatchSchema, rightAmbiguousMatchSchema, comparisonItemContextShape, comparisonItemSchema, comparisonCoverageSchema, applicationVersionComparisonResultSchema, ownedApplicationVersionComparisonResultSchema;
function init_javascriptApplicationVersionComparisonSchemas() {
	return (init_javascriptApplicationVersionComparisonSchemas = __esmMin((() => {
		init_emptyArraySchema();
		init_evidence();
		init_javascriptApplicationGraph();
		init_javascriptApplicationGraphSchemas();
		init_digests();
		evidenceIdSchema$2 = prefixedDigestSchema("ev");
		nodeIdSchema$2 = prefixedDigestSchema("jag_node");
		textSchema$2 = z.string().min(1);
		validateApplicationVersionIdentities = (input, context) => {
			if (input.left.evidence_id === input.right.evidence_id) context.addIssue({
				code: "custom",
				path: ["right"],
				message: "Application version Evidence must be distinct"
			});
			for (const side of ["left_native_observations", "right_native_observations"]) {
				const ids = input[side].map(({ evidence_id: id }) => id);
				if (new Set(ids).size !== ids.length) context.addIssue({
					code: "custom",
					path: [side],
					message: "Native observations must be unique on each side"
				});
			}
		};
		evidenceIdentitySchema$1 = z.object({ evidence_id: evidenceIdSchema$2 });
		applicationVersionIdentitiesSchema = z.object({
			left: evidenceIdentitySchema$1,
			right: evidenceIdentitySchema$1,
			left_native_observations: z.array(evidenceIdentitySchema$1),
			right_native_observations: z.array(evidenceIdentitySchema$1)
		}).superRefine(validateApplicationVersionIdentities);
		compareApplicationVersionsInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema,
			left_native_observations: z.array(evidenceSchema).default([]),
			right_native_observations: z.array(evidenceSchema).default([])
		}).superRefine(validateApplicationVersionIdentities);
		candidateNodesSchema = z.tuple([nodeIdSchema$2]).rest(nodeIdSchema$2);
		exactMatchSchema = z.strictObject({
			status: z.literal("matched"),
			basis: z.enum([
				"exact-node-identity",
				"exact-content-digest",
				"exact-module-source-digest"
			]),
			confidence: z.literal("exact"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		sourceMapMatchSchema = z.strictObject({
			status: z.literal("matched"),
			basis: z.literal("source-map-identity"),
			confidence: z.literal("high"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		inferredMatchSchema = z.strictObject({
			status: z.literal("matched"),
			basis: z.enum(["structural-fingerprint", "semantic-key"]),
			confidence: z.literal("medium"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		matchedItemMatchSchema = z.union([
			exactMatchSchema,
			sourceMapMatchSchema,
			inferredMatchSchema
		]);
		unmatchedItemMatchSchema = z.strictObject({
			status: z.literal("unmatched"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: emptyArraySchema
		});
		leftAmbiguousMatchSchema = z.strictObject({
			status: z.literal("ambiguous"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_node_ids: emptyArraySchema,
			candidate_right_node_ids: candidateNodesSchema
		});
		rightAmbiguousMatchSchema = z.strictObject({
			status: z.literal("ambiguous"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_node_ids: candidateNodesSchema,
			candidate_right_node_ids: emptyArraySchema
		});
		comparisonItemContextShape = {
			item_id: prefixedDigestSchema("javc_item"),
			node_kind: z.enum(JAVASCRIPT_APPLICATION_NODE_KINDS),
			dimensions: z.array(z.enum([
				"content",
				"location",
				"properties",
				"relationships",
				"availability",
				"coverage"
			])),
			evidence_links: z.array(evidenceIdSchema$2).min(2),
			limitations: z.array(textSchema$2)
		};
		comparisonItemSchema = z.union([
			z.strictObject({
				...comparisonItemContextShape,
				status: z.enum([
					"unchanged",
					"changed",
					"unknown"
				]),
				left_node_id: nodeIdSchema$2,
				right_node_id: nodeIdSchema$2,
				match: matchedItemMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.enum(["removed", "unknown"]),
				left_node_id: nodeIdSchema$2,
				right_node_id: z.null(),
				match: unmatchedItemMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.enum(["added", "unknown"]),
				left_node_id: z.null(),
				right_node_id: nodeIdSchema$2,
				match: unmatchedItemMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.literal("unknown"),
				left_node_id: nodeIdSchema$2,
				right_node_id: z.null(),
				match: leftAmbiguousMatchSchema
			}),
			z.strictObject({
				...comparisonItemContextShape,
				status: z.literal("unknown"),
				left_node_id: z.null(),
				right_node_id: nodeIdSchema$2,
				match: rightAmbiguousMatchSchema
			})
		]);
		comparisonCoverageSchema = z.strictObject({
			left_graph_status: z.enum([
				"complete",
				"partial",
				"unknown",
				"unavailable"
			]),
			right_graph_status: z.enum([
				"complete",
				"partial",
				"unknown",
				"unavailable"
			]),
			left_graph_omitted_count: z.number().int().min(0).nullable(),
			right_graph_omitted_count: z.number().int().min(0).nullable(),
			status: z.enum([
				"complete-within-inputs",
				"partial",
				"truncated"
			])
		});
		applicationVersionComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("javc"),
			left: z.strictObject({
				evidence_id: evidenceIdSchema$2,
				graph_id: prefixedDigestSchema("jag"),
				root_artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			right: z.strictObject({
				evidence_id: evidenceIdSchema$2,
				graph_id: prefixedDigestSchema("jag"),
				root_artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			summary: z.strictObject({
				unchanged: z.number().int().min(0),
				added: z.number().int().min(0),
				removed: z.number().int().min(0),
				changed: z.number().int().min(0),
				unknown: z.number().int().min(0)
			}),
			matching: z.strictObject({
				exact_node_identity: z.number().int().min(0),
				exact_content_digest: z.number().int().min(0),
				exact_module_source_digest: z.number().int().min(0),
				source_map_identity: z.number().int().min(0),
				structural_fingerprint: z.number().int().min(0),
				semantic_key: z.number().int().min(0),
				ambiguous: z.number().int().min(0),
				unmatched: z.number().int().min(0)
			}),
			items: z.array(comparisonItemSchema),
			graph: javascriptApplicationGraphSchema,
			coverage: comparisonCoverageSchema,
			evidence_links: z.array(evidenceIdSchema$2).min(2),
			limitations: z.array(textSchema$2)
		}).superRefine((result, context) => {
			const sourceGraphsComplete = result.coverage.left_graph_status === "complete" && result.coverage.right_graph_status === "complete";
			if (result.coverage.status === "complete-within-inputs" !== sourceGraphsComplete) context.addIssue({
				code: "custom",
				path: ["coverage", "status"],
				message: "Comparison coverage must match source graph completeness"
			});
		});
		ownedApplicationVersionComparisonResultSchema = applicationVersionComparisonResultSchema.safeExtend({ graph: z.custom(isValidatedImmutableJavaScriptApplicationGraph) });
	})))();
}

//#endregion
//#region dist/domain/javascript/sourceToBundleComparisonSchemas.js
var evidenceIdSchema$1, nodeIdSchema$1, textSchema$1, SOURCE_TO_BUNDLE_SIGNAL_WEIGHTS, sourceToBundleSignalKindSchema, compareSourceToBundleInputSchema, sourceToBundleSignalSchema, sourceToBundleCandidateSchema, sourceToBundleItemSchema, sourceToBundleComparisonResultSchema;
function init_sourceToBundleComparisonSchemas() {
	return (init_sourceToBundleComparisonSchemas = __esmMin((() => {
		init_evidence();
		init_javascriptApplicationGraphSchemas();
		init_referenceSourceGraph();
		init_digests();
		evidenceIdSchema$1 = prefixedDigestSchema("ev");
		nodeIdSchema$1 = prefixedDigestSchema("jag_node");
		textSchema$1 = z.string().min(1);
		SOURCE_TO_BUNDLE_SIGNAL_WEIGHTS = [
			["exact-source-digest", 100],
			["source-map-original-path", 70],
			["current-path-exact", 60],
			["current-path-suffix", 40],
			["unicode-equivalent-path", 20],
			["basename-match", 20],
			["language-extension", 5]
		];
		sourceToBundleSignalKindSchema = z.enum([
			"exact-source-digest",
			"source-map-original-path",
			"current-path-exact",
			"current-path-suffix",
			"unicode-equivalent-path",
			"basename-match",
			"language-extension"
		]);
		compareSourceToBundleInputSchema = z.strictObject({
			reference: historicalSourceGraphSchema,
			application: evidenceSchema
		});
		sourceToBundleSignalSchema = z.strictObject({
			kind: sourceToBundleSignalKindSchema,
			weight: z.number().int().min(1).max(100),
			source_value: textSchema$1,
			current_values: z.array(textSchema$1).min(1)
		});
		sourceToBundleCandidateSchema = z.strictObject({
			current_node_id: nodeIdSchema$1,
			current_node_kind: z.enum(JAVASCRIPT_APPLICATION_NODE_KINDS),
			score: z.number().int().min(1),
			confidence: z.enum([
				"exact",
				"high",
				"medium",
				"low"
			]),
			signals: z.array(sourceToBundleSignalSchema).min(1)
		});
		sourceToBundleItemSchema = z.strictObject({
			mapping_id: prefixedDigestSchema("stbc_item"),
			source_path: textSchema$1,
			source_sha256: digestSchema.nullable(),
			source_language: textSchema$1.nullable(),
			status: z.enum([
				"unchanged",
				"modified",
				"removed",
				"split",
				"merged",
				"duplicated",
				"unknown"
			]),
			confidence: z.enum([
				"exact",
				"high",
				"medium",
				"unknown"
			]),
			current_node_ids: z.array(nodeIdSchema$1),
			candidates: z.array(sourceToBundleCandidateSchema),
			limitations: z.array(textSchema$1)
		});
		sourceToBundleComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("stbc"),
			reference: z.strictObject({
				root_sha256: digestSchema,
				inventory_state: z.enum([
					"complete",
					"partial",
					"unknown"
				])
			}),
			application: z.strictObject({
				evidence_id: evidenceIdSchema$1,
				graph_id: prefixedDigestSchema("jag"),
				root_artifact_sha256: digestSchema
			}),
			scoring: z.strictObject({
				algorithm: z.literal("rea-source-to-bundle-signals"),
				minimum_candidate_score: z.literal(20),
				weights: z.array(z.strictObject({
					signal: sourceToBundleSignalKindSchema,
					weight: z.number().int().min(1).max(100)
				}))
			}),
			summary: z.strictObject({
				unchanged: z.number().int().min(0),
				modified: z.number().int().min(0),
				removed: z.number().int().min(0),
				split: z.number().int().min(0),
				merged: z.number().int().min(0),
				duplicated: z.number().int().min(0),
				unknown: z.number().int().min(0)
			}),
			items: z.array(sourceToBundleItemSchema),
			unmapped_current_node_ids: z.array(nodeIdSchema$1),
			coverage: z.strictObject({
				status: z.enum(["complete-within-inputs", "partial"]),
				reference_inventory_state: z.enum([
					"complete",
					"partial",
					"unknown"
				]),
				application_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				retained_source_files: z.number().int().min(0),
				retained_application_nodes: z.number().int().min(0),
				candidate_evaluations: z.number().int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema$1).length(1),
			limitations: z.array(textSchema$1)
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptExportShapeComparisonSchemas.js
function isJsonPointer(value) {
	if (value === "") return true;
	if (!value.startsWith("/")) return false;
	for (let index = 0; index < value.length; index += 1) {
		if (value[index] !== "~") continue;
		const escaped = value[index + 1];
		if (escaped !== "0" && escaped !== "1") return false;
		index += 1;
	}
	return true;
}
var evidenceIdSchema, graphIdSchema, nodeIdSchema, textSchema, exportNameSchema, semanticPrimitiveSchema, jsonPointerSchema, sourcePointSchema, sourceRangeSchema, validateJavaScriptExportShapeIdentities, evidenceIdentitySchema, javaScriptExportShapeIdentitiesSchema, compareJavaScriptExportShapesInputSchema, projectedReturnFieldShape, projectedReturnFieldSchema, projectedPropertyCoverageSchema, projectedReturnShapeSchema, projectedExportReturnShapesSchema, exportCandidateSchema, selectorResultShape, selectorResultSchema, valueAvailabilitySchema, discriminantSchema, propertyPresenceSchema, javaScriptExportShapeComparisonChangeSchema, inventoryPropertyCoverageSchema, propertyInventorySchema, javaScriptExportShapeComparisonResultSchema;
function init_javascriptExportShapeComparisonSchemas() {
	return (init_javascriptExportShapeComparisonSchemas = __esmMin((() => {
		init_evidence();
		init_digests();
		evidenceIdSchema = prefixedDigestSchema("ev");
		graphIdSchema = prefixedDigestSchema("jag");
		nodeIdSchema = prefixedDigestSchema("jag_node");
		textSchema = z.string().min(1);
		exportNameSchema = z.string();
		semanticPrimitiveSchema = z.union([
			z.string(),
			z.number().finite(),
			z.boolean(),
			z.null()
		]);
		jsonPointerSchema = z.string().refine(isJsonPointer, "Expected an RFC 6901 JSON Pointer");
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
		validateJavaScriptExportShapeIdentities = (input, context) => {
			if (input.left.evidence_id === input.right.evidence_id) context.addIssue({
				code: "custom",
				path: ["right"],
				message: "JavaScript export shape Evidence must be distinct"
			});
		};
		evidenceIdentitySchema = z.object({ evidence_id: evidenceIdSchema });
		javaScriptExportShapeIdentitiesSchema = z.object({
			left: evidenceIdentitySchema,
			right: evidenceIdentitySchema
		}).superRefine(validateJavaScriptExportShapeIdentities);
		compareJavaScriptExportShapesInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema,
			left_module_path: textSchema,
			left_export_name: exportNameSchema,
			right_module_path: textSchema,
			right_export_name: exportNameSchema
		}).superRefine(validateJavaScriptExportShapeIdentities);
		projectedReturnFieldShape = {
			path: jsonPointerSchema,
			presence: z.enum([
				"present",
				"absent",
				"unknown-coverage"
			])
		};
		projectedReturnFieldSchema = z.discriminatedUnion("state", [
			z.strictObject({
				...projectedReturnFieldShape,
				state: z.literal("literal"),
				value: semanticPrimitiveSchema,
				reason: z.null()
			}),
			z.strictObject({
				...projectedReturnFieldShape,
				state: z.literal("union"),
				value: z.array(semanticPrimitiveSchema).min(1),
				reason: z.null()
			}),
			z.strictObject({
				...projectedReturnFieldShape,
				state: z.literal("unknown"),
				value: z.null(),
				reason: textSchema
			})
		]);
		projectedPropertyCoverageSchema = z.discriminatedUnion("status", [z.strictObject({
			path: jsonPointerSchema,
			status: z.literal("complete"),
			omitted: z.literal(0)
		}), z.strictObject({
			path: jsonPointerSchema,
			status: z.literal("partial"),
			omitted: z.union([z.number().int().positive(), z.null()])
		})]);
		projectedReturnShapeSchema = z.strictObject({
			source_range: sourceRangeSchema,
			value_status: z.enum([
				"literal",
				"union",
				"object",
				"array",
				"unknown",
				"ambiguous",
				"cycle"
			]),
			fields: z.array(projectedReturnFieldSchema),
			property_coverage: z.array(projectedPropertyCoverageSchema)
		}).superRefine((shape, context) => {
			const fieldPaths = shape.fields.map(({ path }) => path);
			if (new Set(fieldPaths).size !== fieldPaths.length) context.addIssue({
				code: "custom",
				path: ["fields"],
				message: "Projected return field paths must be unique"
			});
			const coveragePaths = shape.property_coverage.map(({ path }) => path);
			if (new Set(coveragePaths).size !== coveragePaths.length) context.addIssue({
				code: "custom",
				path: ["property_coverage"],
				message: "Projected property coverage paths must be unique"
			});
		});
		projectedExportReturnShapesSchema = z.strictObject({
			semantic_role: z.literal("export-return-shapes"),
			module_path: textSchema,
			exported_name: exportNameSchema,
			callable_id: textSchema,
			callable_kind: z.enum([
				"function",
				"class",
				"method"
			]),
			static_return_shapes: z.array(projectedReturnShapeSchema),
			return_shape_coverage: z.strictObject({
				status: z.enum([
					"complete",
					"partial",
					"truncated"
				]),
				retained_return_sites: z.number().int().min(0),
				omitted_return_sites: z.number().int().min(0).nullable(),
				omitted_fields: z.number().int().min(0),
				omitted_property_coverage: z.number().int().min(0),
				projection_complete: z.boolean()
			})
		}).superRefine((projection, context) => {
			if (projection.return_shape_coverage.retained_return_sites !== projection.static_return_shapes.length) context.addIssue({
				code: "custom",
				path: ["return_shape_coverage", "retained_return_sites"],
				message: "Retained return-site count must match projected shapes"
			});
		});
		exportCandidateSchema = z.strictObject({
			node_id: nodeIdSchema,
			module_path: textSchema,
			export_name: exportNameSchema,
			matches_requested_module: z.boolean(),
			matches_requested_export: z.boolean()
		});
		selectorResultShape = {
			evidence_id: evidenceIdSchema,
			graph_id: graphIdSchema,
			requested_module_path: textSchema,
			requested_export_name: exportNameSchema,
			candidates: z.array(exportCandidateSchema),
			omitted_candidates: z.number().int().min(0)
		};
		selectorResultSchema = z.union([
			z.strictObject({
				...selectorResultShape,
				status: z.literal("selected"),
				selected_node_id: nodeIdSchema
			}),
			z.strictObject({
				...selectorResultShape,
				status: z.enum(["missing", "ambiguous"]),
				selected_node_id: z.null()
			}),
			z.strictObject({
				...selectorResultShape,
				status: z.literal("unavailable"),
				selected_node_id: nodeIdSchema.nullable()
			})
		]);
		valueAvailabilitySchema = z.discriminatedUnion("availability", [
			z.strictObject({ availability: z.literal("absent") }),
			z.strictObject({
				availability: z.literal("literal"),
				value: semanticPrimitiveSchema
			}),
			z.strictObject({
				availability: z.literal("union"),
				values: z.array(semanticPrimitiveSchema).min(1)
			}),
			z.strictObject({
				availability: z.literal("unknown"),
				reason: textSchema
			})
		]);
		discriminantSchema = z.strictObject({
			path: jsonPointerSchema,
			value: semanticPrimitiveSchema
		});
		propertyPresenceSchema = z.enum([
			"present",
			"absent",
			"unknown-coverage"
		]);
		javaScriptExportShapeComparisonChangeSchema = z.strictObject({
			change_id: prefixedDigestSchema("jesc_change"),
			status: z.enum([
				"added",
				"removed",
				"changed",
				"unknown"
			]),
			path: jsonPointerSchema,
			discriminant: discriminantSchema.nullable(),
			presence: z.strictObject({
				left: propertyPresenceSchema,
				right: propertyPresenceSchema
			}),
			left: valueAvailabilitySchema,
			right: valueAvailabilitySchema,
			left_source_range: sourceRangeSchema.nullable(),
			right_source_range: sourceRangeSchema.nullable(),
			evidence_links: z.array(evidenceIdSchema).length(2),
			limitations: z.array(textSchema)
		});
		inventoryPropertyCoverageSchema = z.strictObject({
			path: jsonPointerSchema,
			status: z.enum(["complete", "partial"])
		});
		propertyInventorySchema = z.strictObject({
			side: z.enum(["left", "right"]),
			variant_index: z.number().int().nonnegative(),
			discriminant: discriminantSchema.nullable(),
			paired: z.boolean(),
			source_range: sourceRangeSchema,
			properties: z.array(jsonPointerSchema),
			property_coverage: z.array(inventoryPropertyCoverageSchema)
		});
		javaScriptExportShapeComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("jesc"),
			left: selectorResultSchema,
			right: selectorResultSchema,
			property_inventories: z.array(propertyInventorySchema),
			summary: z.strictObject({
				added: z.number().int().min(0),
				removed: z.number().int().min(0),
				changed: z.number().int().min(0),
				unknown: z.number().int().min(0)
			}),
			changes: z.array(javaScriptExportShapeComparisonChangeSchema),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-inputs",
					"partial",
					"truncated"
				]),
				left_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				right_graph_status: z.enum([
					"complete",
					"partial",
					"unknown",
					"unavailable"
				]),
				paired_variants: z.number().int().min(0),
				unpaired_left_variants: z.number().int().min(0),
				unpaired_right_variants: z.number().int().min(0),
				omitted_left_variants: z.number().int().min(0),
				omitted_right_variants: z.number().int().min(0),
				left_source_omitted_variants: z.number().int().min(0).nullable(),
				right_source_omitted_variants: z.number().int().min(0).nullable(),
				left_omitted_fields: z.number().int().min(0),
				right_omitted_fields: z.number().int().min(0),
				left_omitted_property_coverage: z.number().int().min(0),
				right_omitted_property_coverage: z.number().int().min(0),
				omitted_candidates: z.number().int().min(0),
				omitted_changes: z.number().int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema).length(2),
			limitations: z.array(textSchema)
		});
	})))();
}

//#endregion
export { SOURCE_TO_BUNDLE_SIGNAL_WEIGHTS, applicationFeatureSeedSchema, applicationFeatureTraceResultSchema, applicationTraceIdentitiesSchema, applicationVersionComparisonResultSchema, applicationVersionIdentitiesSchema, compareApplicationVersionsInputSchema, compareJavaScriptExportShapesInputSchema, compareSourceToBundleInputSchema, createHistoricalSourceGraph, createHistoricalSourceManifest, createReferenceSourcePathLookup, featureSeedMatchMode, historicalSourceLanguages, historicalSourceManifests, historicalSourceParseFailureKey, init_javascriptApplicationVersionComparisonSchemas, init_javascriptExportShapeComparisonSchemas, init_javascriptFeatureTraceSchemas, init_referenceSourceGraph, init_referenceSourcePathIdentity, init_sourceToBundleComparisonSchemas, isPortableAbsoluteReferenceTarget, javaScriptExportShapeComparisonResultSchema, javaScriptExportShapeIdentitiesSchema, ownedApplicationVersionComparisonResultSchema, projectedExportReturnShapesSchema, sourceToBundleComparisonResultSchema, traceApplicationFeatureInputSchema };