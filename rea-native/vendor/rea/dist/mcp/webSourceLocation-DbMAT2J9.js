import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { r as localPathStringSchema, t as init_localPath } from "./localPath-AxvW9aPe.js";
import { c as jsonValueSchema, i as prefixedDigestSchema, n as init_digests, o as init_jsonValue, t as digestSchema } from "./digests-BFoWUT_-.js";
import { n as compositeKey, r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { n as init_canonicalDigest, t as digestCanonicalValue } from "./canonicalDigest-Bi_0_zGi.js";
import { c as init_browserObservation, i as browserAllowedOriginsSchema, n as init_webContentArtifact, o as browserObservationEndpointSchema, r as webTextArtifactSchema, u as inspectWebPageWithSourceInputSchema } from "./webContentArtifact-Dzjc1z-R.js";
import { i as webPageInspectionSchema, l as init_browserCompleteness, n as browserVersionSchema, r as init_browserObservationSchemas, s as browserCompletenessSchema } from "./browserObservationSchemas-tgqjH7aA.js";
import { n as init_emptyArraySchema, t as emptyArraySchema } from "./emptyArraySchema-tL6Qymyd.js";
import { l as init_browserScenarioCaptureValues, n as init_browserScenarioCapture, r as browserScenarioCompletenessSchema, t as browserScenarioCaptureSchema } from "./browserScenarioCapture-CTNFN-FI.js";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { createHash } from "node:crypto";
import * as t from "@babel/types";
import { parse, parseExpression } from "@babel/parser";

//#region dist/domain/webBundleAnalysis.js
var analyzeWebBundleInputSchema, sourceLocationSchema, basisSchema, findingSchema, originalSourceSchema, originalModuleEdgeSchema, sourceMapMappingSchema, sourceMapContextShape, parsedSourceMapShape, sourceMapSchema, webTextArtifactSummarySchema, webSourceMapsSchema, webBundleAnalysisSchema;
function init_webBundleAnalysis() {
	return (init_webBundleAnalysis = __esmMin((() => {
		init_emptyArraySchema();
		init_browserObservation();
		init_webContentArtifact();
		analyzeWebBundleInputSchema = inspectWebPageWithSourceInputSchema.safeExtend({ fetch_source_maps: z.boolean().default(false) });
		sourceLocationSchema = z.object({
			script_key: z.string(),
			line: z.number().int().min(1).nullable(),
			column: z.number().int().min(0).nullable()
		});
		basisSchema = z.object({
			script_key: z.string(),
			artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			line: z.number().int().min(1).nullable(),
			column: z.number().int().min(0).nullable(),
			detector: z.string()
		});
		findingSchema = z.object({
			value: z.string(),
			mechanism: z.string(),
			location: sourceLocationSchema
		});
		originalSourceSchema = z.object({
			source_index: z.number().int().min(0).optional(),
			declaration_index: z.number().int().min(0).optional(),
			source: z.string().nullable(),
			artifact: webTextArtifactSchema.nullable()
		});
		originalModuleEdgeSchema = z.object({
			from_source: z.string(),
			kind: z.enum([
				"static_import",
				"dynamic_import",
				"require"
			]),
			specifier: z.string(),
			resolved_source: z.string().nullable()
		});
		sourceMapMappingSchema = z.object({
			source_index: z.number().int().min(0).optional(),
			declaration_index: z.number().int().min(0).optional(),
			generated_line: z.number().int().min(1),
			generated_column: z.number().int().min(0),
			source: z.string().nullable(),
			original_line: z.number().int().min(1),
			original_column: z.number().int().min(0),
			name: z.string().nullable()
		});
		sourceMapContextShape = {
			script_key: z.string(),
			declared_url: z.string(),
			effective_url: z.string().nullable().optional()
		};
		parsedSourceMapShape = {
			artifact: webTextArtifactSchema,
			original_sources: z.array(originalSourceSchema),
			original_module_edges: z.array(originalModuleEdgeSchema),
			mappings: z.array(sourceMapMappingSchema)
		};
		sourceMapSchema = z.union([
			z.object({
				...sourceMapContextShape,
				...parsedSourceMapShape,
				status: z.literal("included"),
				limitation: z.null()
			}),
			z.object({
				...sourceMapContextShape,
				...parsedSourceMapShape,
				status: z.literal("partial"),
				limitation: z.string()
			}),
			z.object({
				...sourceMapContextShape,
				...parsedSourceMapShape,
				status: z.enum([
					"fetch_failed",
					"invalid",
					"policy_filtered"
				]),
				artifact: z.null(),
				original_sources: emptyArraySchema,
				original_module_edges: emptyArraySchema,
				mappings: emptyArraySchema,
				limitation: z.string()
			})
		]);
		webTextArtifactSummarySchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.number().int().min(0),
			media_type: z.string().min(1),
			charset: z.literal("utf-8"),
			text_available: z.literal(true)
		});
		webSourceMapsSchema = z.object({
			status: z.enum([
				"not_requested",
				"included",
				"partial",
				"unavailable"
			]),
			requested: z.number().int().min(0),
			processed: z.number().int().min(0),
			items: z.array(sourceMapSchema),
			limitation: z.string().min(1).optional()
		}).superRefine((sourceMaps, context) => {
			if (sourceMaps.processed > sourceMaps.requested || sourceMaps.processed !== sourceMaps.items.length) context.addIssue({
				code: "custom",
				message: "Source-map coverage counts are inconsistent"
			});
			if (sourceMaps.processed < sourceMaps.requested && sourceMaps.limitation === undefined) context.addIssue({
				code: "custom",
				message: "Unprocessed source maps require an explicit coverage limitation",
				path: ["limitation"]
			});
			const statuses = sourceMaps.items.map(({ status }) => status);
			const retained = statuses.filter((status) => status === "included" || status === "partial").length;
			const allowedStatuses = sourceMaps.processed < sourceMaps.requested ? retained === 0 ? ["unavailable"] : ["partial"] : sourceMaps.items.length === 0 ? ["not_requested", "unavailable"] : retained === 0 ? ["unavailable"] : retained === sourceMaps.items.length && !statuses.includes("partial") ? ["included"] : ["partial"];
			if (!allowedStatuses.includes(sourceMaps.status)) context.addIssue({
				code: "custom",
				message: "Source-map status contradicts retained coverage",
				path: ["status"]
			});
		});
		webBundleAnalysisSchema = z.object({
			capture: z.object({
				target_url: z.string(),
				scripts_observed: z.number().int().min(0),
				scripts_analyzed: z.number().int().min(0),
				source_artifacts: z.array(webTextArtifactSummarySchema)
			}),
			observations: z.object({
				chunks: z.object({
					nodes: z.array(z.object({
						script_key: z.string(),
						url: z.string(),
						artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
						bytes: z.number().int().min(0)
					})),
					edges: z.array(z.object({
						from_script_key: z.string(),
						kind: z.enum([
							"static_import",
							"dynamic_import",
							"require",
							"worker_import"
						]),
						specifier: z.string(),
						resolved_url: z.string().nullable(),
						location: sourceLocationSchema
					}))
				}),
				routes: z.array(findingSchema),
				endpoints: z.array(findingSchema),
				webmcp_declarations: z.array(z.object({
					name: z.string().nullable(),
					description: z.string().nullable(),
					schema_property_names: z.array(z.string()),
					trust: z.literal("page-declared-untrusted"),
					location: sourceLocationSchema
				})),
				source_maps: webSourceMapsSchema
			}),
			inferences: z.array(z.object({
				kind: z.enum([
					"vendor_fingerprint",
					"route_framework",
					"bundle_runtime",
					"endpoint_candidate"
				]),
				value: z.string(),
				confidence: z.enum([
					"low",
					"medium",
					"high"
				]),
				basis: z.array(basisSchema).min(1)
			})),
			unknowns: z.array(z.object({
				dimension: z.string(),
				reason: z.string(),
				affected_script_keys: z.array(z.string())
			})),
			completeness: z.object({
				status: z.enum(["complete", "partial"]),
				parsed_scripts: z.number().int().min(0),
				parse_failures: z.number().int().min(0),
				visited_ast_nodes: z.number().int().min(0)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/browserSession.js
var observeWebSessionInputSchema, timelineEventSchema, webObservationSessionSchema;
function init_browserSession() {
	return (init_browserSession = __esmMin((() => {
		init_browserObservation();
		init_browserCompleteness();
		init_browserObservationSchemas();
		observeWebSessionInputSchema = z.strictObject({
			cdp_endpoint: browserObservationEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema,
			target_id: z.string().trim().min(1),
			observation_ms: z.number().int().min(1).default(1e4)
		});
		timelineEventSchema = z.object({
			sequence: z.number().int().min(1),
			type: z.enum([
				"navigation_requested",
				"navigation_committed",
				"same_origin_reload",
				"same_document_navigation",
				"redirect",
				"load_failed",
				"lifecycle",
				"target_terminated"
			]),
			timestamp: z.number().min(0),
			frame_id: z.string().nullable(),
			loader_id: z.string().nullable(),
			request_id: z.string().nullable(),
			url: z.string().nullable(),
			destination_scope: z.enum([
				"approved",
				"outside_policy",
				"unsupported"
			]).nullable(),
			detail: z.string().nullable()
		});
		webObservationSessionSchema = z.object({
			browser: browserVersionSchema,
			target: z.object({
				target_id: z.string(),
				initial_url: z.string(),
				final_url: z.string().nullable()
			}),
			window: z.object({
				armed_at: z.iso.datetime(),
				ended_at: z.iso.datetime(),
				requested_ms: z.number().int().min(1),
				end_reason: z.enum([
					"window_elapsed",
					"target_left_scope",
					"target_terminated"
				])
			}),
			timeline: z.array(timelineEventSchema),
			completeness: browserCompletenessSchema,
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/webMcpDiscovery.js
var discoverWebMcpToolsInputSchema, webMcpToolSchema, webMcpDiscoverySchema;
function init_webMcpDiscovery() {
	return (init_webMcpDiscovery = __esmMin((() => {
		init_browserCompleteness();
		init_browserObservation();
		init_browserObservationSchemas();
		init_jsonValue();
		init_digests();
		discoverWebMcpToolsInputSchema = z.strictObject({
			cdp_endpoint: browserObservationEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema,
			target_id: z.string().trim().min(1),
			observation_ms: z.number().int().min(0).default(100)
		});
		webMcpToolSchema = z.object({
			tool_key: prefixedDigestSchema("webmcp"),
			name: z.string(),
			description: z.string(),
			frame_id: z.string(),
			frame_url: z.string(),
			owner_origin: z.string(),
			declaration_kind: z.enum(["declarative", "imperative"]),
			input_schema: jsonValueSchema.nullable(),
			input_schema_sha256: digestSchema.nullable(),
			annotations: z.object({
				read_only: z.boolean().nullable(),
				untrusted_content: z.boolean().nullable(),
				consequential: z.boolean().nullable().optional(),
				autosubmit: z.boolean().nullable()
			}),
			registration_source: z.object({
				url: z.string(),
				line: z.number().int().min(0).nullable(),
				column: z.number().int().min(0).nullable()
			}).nullable(),
			trust: z.literal("page-declared-untrusted")
		});
		webMcpDiscoverySchema = z.object({
			browser: browserVersionSchema,
			target: z.object({
				target_id: z.string(),
				url: z.string(),
				origin: z.string()
			}),
			status: z.enum(["available", "unavailable"]),
			tools: z.object({
				total: z.number().int().min(0),
				items: z.array(webMcpToolSchema)
			}),
			completeness: browserCompletenessSchema,
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/browserScenarioDiffValues.js
var browserScenarioArtifactKindSchema, normalizableArtifactKindSchema, normalizationRuleSchema, normalizationInputSchema, compareBrowserScenariosInputSchema, evidenceStateSchema, artifactDiffSchema, alignmentFailureSchema, BROWSER_SCENARIO_BUILT_IN_NORMALIZATION_RULES, builtInNormalizationSchema, browserScenarioDiffSchema;
function init_browserScenarioDiffValues() {
	return (init_browserScenarioDiffValues = __esmMin((() => {
		init_browserScenarioCapture();
		browserScenarioArtifactKindSchema = z.enum([
			"action_state",
			"screenshot",
			"dom",
			"accessibility",
			"url",
			"history",
			"storage",
			"events"
		]);
		normalizableArtifactKindSchema = z.enum([
			"action_state",
			"dom",
			"accessibility",
			"url",
			"history",
			"storage",
			"events"
		]);
		normalizationRuleSchema = z.strictObject({
			rule_id: z.string().trim().min(1).describe("Stable rule identity; rules execute in rule_id order."),
			artifacts: z.array(normalizableArtifactKindSchema).min(1).describe("Artifact families whose durable string fields use this rule."),
			match: z.string().min(1).describe("Exact public literal to replace; regular expressions are not used."),
			replacement: z.string().describe("Recorded replacement text used in normalized comparison.")
		});
		normalizationInputSchema = z.strictObject({ rules: z.array(normalizationRuleSchema).default([]) }).superRefine((normalization, context) => {
			const ruleIds = new Set();
			for (const [index, rule] of normalization.rules.entries()) {
				if (ruleIds.has(rule.rule_id)) context.addIssue({
					code: "custom",
					path: [
						"rules",
						index,
						"rule_id"
					],
					message: "Normalization rule IDs must be unique"
				});
				ruleIds.add(rule.rule_id);
				if (new Set(rule.artifacts).size !== rule.artifacts.length) context.addIssue({
					code: "custom",
					path: [
						"rules",
						index,
						"artifacts"
					],
					message: "Normalization rule artifact kinds must be unique"
				});
			}
		});
		compareBrowserScenariosInputSchema = z.strictObject({
			before_scenario: browserScenarioCaptureSchema.describe("Earlier complete normalized_result from capture_browser_scenario."),
			after_scenario: browserScenarioCaptureSchema.describe("Later complete normalized_result from capture_browser_scenario."),
			normalization: normalizationInputSchema.default({ rules: [] }).describe("Exact-literal rules committed in the comparison result.")
		});
		evidenceStateSchema = z.enum([
			"captured",
			"not_requested",
			"missing",
			"truncated"
		]);
		artifactDiffSchema = z.strictObject({
			artifact: browserScenarioArtifactKindSchema,
			status: z.enum(["changed", "unknown"]),
			before_state: evidenceStateSchema,
			after_state: evidenceStateSchema,
			before_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			after_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			reason: z.string().min(1).nullable()
		});
		alignmentFailureSchema = z.strictObject({
			code: z.enum([
				"duplicate_before_step_id",
				"duplicate_after_step_id",
				"missing_before_step",
				"missing_after_step",
				"action_mismatch",
				"capture_context_mismatch"
			]),
			step_id: z.string().min(1).nullable(),
			reason: z.string().min(1)
		});
		BROWSER_SCENARIO_BUILT_IN_NORMALIZATION_RULES = [
			"ignore_step_elapsed_ms",
			"ignore_event_sequence",
			"ignore_event_step_index",
			"compare_screenshot_content_digest",
			"compare_normalized_text_content",
			"ignore_capture_local_network_transaction_ids",
			"attribute_network_transactions_to_request_step",
			"compare_network_transactions_as_unordered_collection",
			"preserve_redirect_transaction_ancestry"
		];
		builtInNormalizationSchema = z.enum(BROWSER_SCENARIO_BUILT_IN_NORMALIZATION_RULES);
		browserScenarioDiffSchema = z.strictObject({
			comparison_kind: z.literal("browser_scenario"),
			overall_status: z.enum([
				"changed",
				"unchanged",
				"unknown"
			]),
			normalization: z.strictObject({
				built_in_rules: z.array(builtInNormalizationSchema).length(BROWSER_SCENARIO_BUILT_IN_NORMALIZATION_RULES.length),
				rules: z.array(normalizationRuleSchema),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			alignment: z.strictObject({
				status: z.enum([
					"aligned",
					"partial",
					"failed"
				]),
				aligned_steps: z.number().int().min(0),
				before_only: z.array(z.string().min(1)),
				after_only: z.array(z.string().min(1)),
				failures: z.array(alignmentFailureSchema)
			}),
			steps: z.array(z.strictObject({
				step_id: z.string().min(1),
				before_step_index: z.number().int().min(0),
				after_step_index: z.number().int().min(0),
				before_action: z.string().min(1),
				after_action: z.string().min(1),
				status: z.enum([
					"changed",
					"unchanged",
					"unknown"
				]),
				artifact_diffs: z.array(artifactDiffSchema)
			})),
			artifact_diffs: z.strictObject({ total: z.number().int().min(0) }),
			limitations: z.array(z.string().min(1))
		});
	})))();
}

//#endregion
//#region dist/domain/browserScenarioNormalization.js
var commitBrowserScenarioNormalization, digestNormalizedScenarioValue, normalizeScenarioValue;
function init_browserScenarioNormalization() {
	return (init_browserScenarioNormalization = __esmMin((() => {
		init_canonicalDigest();
		init_browserScenarioDiffValues();
		commitBrowserScenarioNormalization = (input) => {
			const rules = [...input.rules].map((rule) => ({
				...rule,
				artifacts: [...rule.artifacts].sort()
			})).sort((left, right) => left.rule_id < right.rule_id ? -1 : left.rule_id > right.rule_id ? 1 : 0);
			const commitment = {
				built_in_rules: [...BROWSER_SCENARIO_BUILT_IN_NORMALIZATION_RULES],
				rules
			};
			return {
				...commitment,
				sha256: digestCanonicalValue(commitment, "Browser scenario")
			};
		};
		digestNormalizedScenarioValue = (value, artifact, rules, order = (normalized) => normalized) => digestCanonicalValue(order(normalizeScenarioValue(value, artifact, rules)), "Browser scenario");
		normalizeScenarioValue = (value, artifact, rules) => {
			if (artifact === "screenshot") return value;
			if (typeof value === "string") return rules.filter(({ artifacts }) => artifacts.includes(artifact)).reduce((normalized, rule) => normalized.split(rule.match).join(rule.replacement), value);
			if (Array.isArray(value)) return value.map((item) => normalizeScenarioValue(item, artifact, rules));
			if (typeof value !== "object" || value === null) return value;
			return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeScenarioValue(item, artifact, rules)]));
		};
	})))();
}

//#endregion
//#region dist/domain/browserScenarioNetworkComparison.js
var scenarioNetworkTransactionSchema, scenarioNetworkTransactions, scenarioNetworkCoverageReason, fingerprintScenarioNetworkTransactions;
function init_browserScenarioNetworkComparison() {
	return (init_browserScenarioNetworkComparison = __esmMin((() => {
		init_canonicalDigest();
		init_browserScenarioNormalization();
		scenarioNetworkTransactionSchema = z.strictObject({
			events: z.array(z.unknown()),
			predecessor: z.number().int().min(-2),
			step_index: z.number().int().min(0)
		});
		scenarioNetworkTransactions = (capture) => {
			const sourceSteps = new Map(capture.events.items.map((event) => [event.sequence, event.step_index]));
			const requests = new Map(capture.events.items.flatMap((event) => event.kind === "request" ? [[event.transaction_id, event]] : []));
			const grouped = new Map();
			for (const { sequence: _sequence, step_index: step, ...event } of capture.events.items) {
				if (!("transaction_id" in event)) continue;
				const id = event.transaction_id;
				const request = requests.get(id);
				const receiptStep = event.kind === "network-content" ? sourceSteps.get(event.source_event_sequence) : step;
				const requestStep = request?.step_index ?? receiptStep;
				let evidence;
				let predecessor;
				let predecessorState;
				if (event.kind === "network-content") {
					const { transaction_id: _id, source_event_sequence: _source, ...content } = event;
					evidence = content;
					predecessor = request?.redirected_from_transaction_id ?? null;
					predecessorState = request?.redirected_from_transaction_state;
				} else {
					const { transaction_id: _id, redirected_from_transaction_id: parent, redirected_from_transaction_state: _state, ...network } = event;
					evidence = network;
					predecessor = request === undefined ? parent : request.redirected_from_transaction_id;
					predecessorState = request === undefined ? event.redirected_from_transaction_state : request.redirected_from_transaction_state;
				}
				const previous = grouped.get(id);
				if (previous === undefined) grouped.set(id, {
					events: [evidence],
					predecessor,
					predecessorState,
					predecessorConflict: event.kind !== "network-content" && request !== undefined && (event.redirected_from_transaction_id !== null && event.redirected_from_transaction_id !== request.redirected_from_transaction_id || event.redirected_from_transaction_state === "root" && request.redirected_from_transaction_id !== null),
					stepIndex: requestStep ?? step
				});
				else {
					previous.events.push(evidence);
					if (event.kind !== "network-content") {
						const parent = event.redirected_from_transaction_id;
						const state = event.redirected_from_transaction_state;
						const knownParent = previous.predecessor;
						if (parent !== null && (knownParent !== null ? parent !== knownParent : previous.predecessorState === "root")) previous.predecessorConflict = true;
						else if (parent !== null && knownParent === null) {
							previous.predecessor = parent;
							previous.predecessorState = state;
						} else if (parent === null && state === "root" && knownParent !== null) previous.predecessorConflict = true;
						else if (parent === null && state === "root" && previous.predecessorState !== "root") previous.predecessorState = "root";
					}
				}
			}
			const indices = new Map([...grouped.keys()].map((id, index) => [id, index]));
			return [...grouped.values()].map((node) => ({
				events: node.events,
				predecessor: node.predecessorConflict ? -2 : node.predecessor === null ? node.predecessorState === "root" ? -1 : -2 : indices.get(node.predecessor) ?? -2,
				step_index: node.stepIndex
			}));
		};
		scenarioNetworkCoverageReason = (capture, nodes = scenarioNetworkTransactions(capture)) => {
			const finished = new Set();
			for (let start = 0; start < nodes.length; start += 1) {
				const path = new Set();
				let index = start;
				while (index >= 0 && !finished.has(index)) {
					if (path.has(index)) return "Redirect ancestry contains a cycle; network transaction identity remains unknown.";
					path.add(index);
					const node = nodes[index];
					if (node === undefined) return "Redirect predecessor evidence is missing; network transaction identity remains unknown.";
					index = node.predecessor;
				}
				if (index === -2) return "Redirect predecessor evidence is missing; network transaction identity remains unknown.";
				for (const item of path) finished.add(item);
			}
			return undefined;
		};
		fingerprintScenarioNetworkTransactions = (nodes, rules = []) => {
			const own = nodes.map((node) => node.events.map((event) => digestCanonicalValue(normalizeScenarioValue(event, "events", rules), "Browser scenario")).sort());
			const fingerprints = new Map();
			for (let start = 0; start < nodes.length; start += 1) {
				const path = [];
				const positions = new Map();
				let index = start;
				while (index >= 0 && nodes[index] !== undefined && !fingerprints.has(index)) {
					const position = positions.get(index);
					if (position !== undefined) {
						for (const member of path.slice(position)) fingerprints.set(member, digestCanonicalValue({
							events: own[member],
							redirected_from: { state: "cycle" }
						}, "Browser scenario"));
						break;
					}
					positions.set(index, path.length);
					path.push(index);
					index = nodes[index]?.predecessor ?? -2;
				}
				for (const member of path.reverse()) {
					if (fingerprints.has(member)) continue;
					const predecessor = nodes[member]?.predecessor ?? -2;
					const parent = predecessor === -1 ? null : fingerprints.get(predecessor) ?? { state: "missing" };
					fingerprints.set(member, digestCanonicalValue({
						events: own[member],
						redirected_from: parent
					}, "Browser scenario"));
				}
			}
			return nodes.map((_, index) => {
				const fingerprint = fingerprints.get(index);
				if (fingerprint === undefined) throw new Error("Network comparison node has no fingerprint");
				return fingerprint;
			});
		};
	})))();
}

//#endregion
//#region dist/domain/browserScenarioDiffEvidence.js
var includesCompletenessSection, artifactEvidenceState, EVENT_SECTIONS, eventEvidenceState, actionState, prepareScenarioEvents, networkContentCoverageReason, eventFamilyCoverageReason, familyList, captured, screenshotProjection;
function init_browserScenarioDiffEvidence() {
	return (init_browserScenarioDiffEvidence = __esmMin((() => {
		init_browserScenarioNetworkComparison();
		includesCompletenessSection = (completeness, collection, section) => {
			const sections = completeness[collection];
			return sections.includes(section);
		};
		artifactEvidenceState = (artifact, state, step) => {
			if (state.state !== "captured") return state.state;
			const section = artifact === "action_state" ? "action" : artifact;
			if (includesCompletenessSection(step.completeness, "truncated_sections", section)) return "truncated";
			return includesCompletenessSection(step.completeness, "missing_sections", section) ? "missing" : "captured";
		};
		EVENT_SECTIONS = [
			"events",
			"frames",
			"workers",
			"popups",
			"websockets"
		];
		eventEvidenceState = (capture, step) => {
			const listed = (collection) => EVENT_SECTIONS.some((section) => includesCompletenessSection(capture.completeness, collection, section) || includesCompletenessSection(step.completeness, collection, section));
			if (capture.events.dropped > 0 || listed("truncated_sections")) return "truncated";
			return listed("missing_sections") ? "missing" : "captured";
		};
		actionState = (step) => ({
			action: step.action,
			status: step.status,
			before_url: step.before_url,
			after_url: step.after_url,
			error: step.error
		});
		prepareScenarioEvents = (capture, rules) => {
			const eventsByStep = new Map();
			for (const { sequence: _sequence, step_index, ...event } of capture.events.items) {
				if ("transaction_id" in event) continue;
				const events = eventsByStep.get(step_index) ?? [];
				events.push(event);
				eventsByStep.set(step_index, events);
			}
			const nodes = scenarioNetworkTransactions(capture);
			const fingerprints = fingerprintScenarioNetworkTransactions(nodes, rules);
			const networkByStep = new Map();
			for (const [index, node] of nodes.entries()) {
				const step = networkByStep.get(node.step_index) ?? [];
				const fingerprint = fingerprints[index];
				if (fingerprint === undefined) throw new Error("Network comparison node has no fingerprint");
				step.push(fingerprint);
				networkByStep.set(node.step_index, step);
			}
			for (const fingerprintsForStep of networkByStep.values()) fingerprintsForStep.sort();
			return {
				coverageReason: scenarioNetworkCoverageReason(capture, nodes),
				forStep: (stepIndex) => ({
					events: eventsByStep.get(stepIndex) ?? [],
					network_transactions: networkByStep.get(stepIndex) ?? []
				})
			};
		};
		networkContentCoverageReason = (before, after) => {
			const left = before.scenario.network_content;
			const right = after.scenario.network_content;
			return left.request_body !== right.request_body || left.response_body !== right.response_body || left.header_values !== right.header_values ? "Network content selections differ; capture both sides with matching content selection before comparing network evidence." : undefined;
		};
		eventFamilyCoverageReason = (before, after) => {
			const left = before.scenario.event_families;
			const right = after.scenario.event_families;
			if (left === undefined || right === undefined) return "Event family selection is unknown in a legacy capture; capture both sides with matching event families before comparing event evidence.";
			const leftFamilies = new Set(left);
			const rightFamilies = new Set(right);
			return leftFamilies.size === rightFamilies.size && [...leftFamilies].every((family) => rightFamilies.has(family)) ? undefined : `Event family selections differ (${familyList(leftFamilies)} before, ${familyList(rightFamilies)} after); capture both sides with matching event families before comparing event evidence.`;
		};
		familyList = (families) => families.size === 0 ? "none" : [...families].sort().join(", ");
		captured = (value) => ({
			state: "captured",
			value
		});
		screenshotProjection = (screenshot) => ({
			sha256: screenshot.sha256,
			bytes: screenshot.bytes,
			media_type: screenshot.media_type
		});
	})))();
}

//#endregion
//#region dist/domain/browserScenarioDiff.js
var scenarioEventsValueSchema, compareBrowserScenarios, alignScenarioSteps, compareAlignedSteps, duplicateStepIds, uniqueSteps, duplicateFailures, missingFailures, captureContextsMatch, compareStepArtifacts, compareScenarioEvents, digestScenarioEvents, eventCoverageReason, compareCapturedValues, joinIncomparableReasons;
function init_browserScenarioDiff() {
	return (init_browserScenarioDiff = __esmMin((() => {
		init_canonicalDigest();
		init_browserScenarioDiffEvidence();
		init_browserScenarioDiffValues();
		init_browserScenarioNormalization();
		scenarioEventsValueSchema = z.strictObject({
			events: z.array(z.unknown()),
			network_transactions: z.array(z.string())
		});
		compareBrowserScenarios = (input) => {
			const normalization = commitBrowserScenarioNormalization(input.normalization);
			const beforeEvents = prepareScenarioEvents(input.before_scenario, normalization.rules);
			const afterEvents = prepareScenarioEvents(input.after_scenario, normalization.rules);
			const alignment = alignScenarioSteps(input.before_scenario, input.after_scenario);
			const compared = compareAlignedSteps({
				beforeCapture: input.before_scenario,
				afterCapture: input.after_scenario,
				alignment,
				rules: normalization.rules,
				beforeEvents,
				afterEvents
			});
			const failures = [...alignment.failures, ...compared.failures];
			const alignmentStatus = failures.length === 0 ? "aligned" : compared.steps.length === 0 ? "failed" : "partial";
			const stepStatuses = compared.steps.map(({ status }) => status);
			const equalityEligible = input.before_scenario.completeness.equality_eligible && input.after_scenario.completeness.equality_eligible && alignmentStatus === "aligned";
			const overallStatus = stepStatuses.includes("changed") ? "changed" : stepStatuses.includes("unknown") || !equalityEligible ? "unknown" : "unchanged";
			return browserScenarioDiffSchema.parse({
				comparison_kind: "browser_scenario",
				overall_status: overallStatus,
				normalization,
				alignment: {
					status: alignmentStatus,
					aligned_steps: compared.steps.length,
					before_only: alignment.beforeOnly,
					after_only: alignment.afterOnly,
					failures
				},
				steps: compared.steps,
				artifact_diffs: { total: compared.totalArtifactDiffs },
				limitations: [
					"Steps align only by exact, unique step_id; missing, duplicate, or action-mismatched steps are reported and prevent an unchanged claim.",
					"Only declared literal normalization rules are applied, in canonical rule_id order, to already-redacted durable capture fields.",
					"Elapsed time, event sequence/index values and capture-local transaction IDs are excluded as volatile; network transactions are compared as an unordered collection in the step that sent their request; screenshot bytes are compared by content digest.",
					"A changed status proves an observed normalized difference. Missing or truncated evidence, incompatible capture context, or alignment failure prevents an unchanged claim."
				]
			});
		};
		alignScenarioSteps = (beforeCapture, afterCapture) => {
			const beforeDuplicates = duplicateStepIds(beforeCapture.steps);
			const afterDuplicates = duplicateStepIds(afterCapture.steps);
			const before = uniqueSteps(beforeCapture.steps, beforeDuplicates);
			const after = uniqueSteps(afterCapture.steps, afterDuplicates);
			const beforeOnly = [...before.keys()].filter((stepId) => !after.has(stepId)).sort();
			const afterOnly = [...after.keys()].filter((stepId) => !before.has(stepId)).sort();
			const failures = [
				...duplicateFailures("before", beforeDuplicates),
				...duplicateFailures("after", afterDuplicates),
				...missingFailures("before", afterOnly),
				...missingFailures("after", beforeOnly)
			];
			if (!captureContextsMatch(beforeCapture, afterCapture)) failures.push({
				code: "capture_context_mismatch",
				step_id: null,
				reason: "Browser product/version or scenario origin scope differs between captures."
			});
			return {
				before,
				after,
				beforeOnly,
				afterOnly,
				failures,
				orderedStepIds: beforeCapture.steps.map(({ step_id }) => step_id).filter((stepId, index, values) => values.indexOf(stepId) === index && before.has(stepId) && after.has(stepId))
			};
		};
		compareAlignedSteps = (input) => {
			let totalArtifactDiffs = 0;
			const steps = [];
			const failures = [];
			for (const stepId of input.alignment.orderedStepIds) {
				const beforeStep = input.alignment.before.get(stepId);
				const afterStep = input.alignment.after.get(stepId);
				if (beforeStep === undefined || afterStep === undefined) continue;
				if (beforeStep.action !== afterStep.action) failures.push({
					code: "action_mismatch",
					step_id: stepId,
					reason: `Aligned step action changed from ${beforeStep.action} to ${afterStep.action}.`
				});
				const artifacts = compareStepArtifacts({
					beforeCapture: input.beforeCapture,
					beforeStep,
					afterCapture: input.afterCapture,
					afterStep,
					rules: input.rules,
					beforeEvents: input.beforeEvents,
					afterEvents: input.afterEvents
				});
				const reportable = artifacts.flatMap(({ diff }) => diff === null ? [] : [diff]);
				totalArtifactDiffs += reportable.length;
				const statuses = artifacts.map(({ status }) => status);
				steps.push({
					step_id: stepId,
					before_step_index: beforeStep.step_index,
					after_step_index: afterStep.step_index,
					before_action: beforeStep.action,
					after_action: afterStep.action,
					status: statuses.includes("changed") ? "changed" : statuses.includes("unknown") ? "unknown" : "unchanged",
					artifact_diffs: reportable
				});
			}
			return {
				steps,
				failures,
				totalArtifactDiffs
			};
		};
		duplicateStepIds = (steps) => {
			const seen = new Set();
			const duplicates = new Set();
			for (const { step_id: stepId } of steps) {
				if (seen.has(stepId)) duplicates.add(stepId);
				seen.add(stepId);
			}
			return duplicates;
		};
		uniqueSteps = (steps, duplicates) => new Map(steps.flatMap((step) => duplicates.has(step.step_id) ? [] : [[step.step_id, step]]));
		duplicateFailures = (side, duplicates) => [...duplicates].sort().map((stepId) => ({
			code: side === "before" ? "duplicate_before_step_id" : "duplicate_after_step_id",
			step_id: stepId,
			reason: `${side} capture contains duplicate step_id ${stepId}.`
		}));
		missingFailures = (side, stepIds) => stepIds.map((stepId) => ({
			code: side === "before" ? "missing_before_step" : "missing_after_step",
			step_id: stepId,
			reason: `Step ${stepId} is missing from the ${side} capture.`
		}));
		captureContextsMatch = (before, after) => before.browser.product === after.browser.product && before.browser.version === after.browser.version && before.scenario.start_origin === after.scenario.start_origin;
		compareStepArtifacts = (input) => {
			const common = {
				beforeStep: input.beforeStep,
				afterStep: input.afterStep,
				rules: input.rules
			};
			return [
				compareCapturedValues({
					...common,
					artifact: "action_state",
					before: captured(actionState(input.beforeStep)),
					after: captured(actionState(input.afterStep))
				}),
				compareCapturedValues({
					...common,
					artifact: "screenshot",
					before: input.beforeStep.artifacts.screenshot,
					after: input.afterStep.artifacts.screenshot,
					project: screenshotProjection
				}),
				compareCapturedValues({
					...common,
					artifact: "dom",
					before: input.beforeStep.artifacts.dom,
					after: input.afterStep.artifacts.dom,
					project: ({ text }) => text
				}),
				compareCapturedValues({
					...common,
					artifact: "accessibility",
					before: input.beforeStep.artifacts.accessibility,
					after: input.afterStep.artifacts.accessibility,
					project: ({ text }) => text
				}),
				compareCapturedValues({
					...common,
					artifact: "url",
					before: input.beforeStep.artifacts.url,
					after: input.afterStep.artifacts.url
				}),
				compareCapturedValues({
					...common,
					artifact: "history",
					before: input.beforeStep.artifacts.history,
					after: input.afterStep.artifacts.history
				}),
				compareCapturedValues({
					...common,
					artifact: "storage",
					before: input.beforeStep.artifacts.storage,
					after: input.afterStep.artifacts.storage
				}),
				compareScenarioEvents({
					...common,
					artifact: "events",
					before: captured(input.beforeEvents.forStep(input.beforeStep.step_index)),
					after: captured(input.afterEvents.forStep(input.afterStep.step_index)),
					beforeState: eventEvidenceState(input.beforeCapture, input.beforeStep),
					afterState: eventEvidenceState(input.afterCapture, input.afterStep),
					incomparableReason: eventCoverageReason(input.beforeCapture, input.afterCapture, input.beforeEvents.coverageReason, input.afterEvents.coverageReason),
					familyIncomparableReason: eventFamilyCoverageReason(input.beforeCapture, input.afterCapture)
				})
			];
		};
		compareScenarioEvents = (input) => {
			const beforeState = input.beforeState ?? artifactEvidenceState(input.artifact, input.before, input.beforeStep);
			const afterState = input.afterState ?? artifactEvidenceState(input.artifact, input.after, input.afterStep);
			if (beforeState === "not_requested" && afterState === "not_requested") return {
				artifact: input.artifact,
				status: "not_compared",
				diff: null
			};
			const beforeValue = input.before.state === "captured" ? input.before.value : undefined;
			const afterValue = input.after.state === "captured" ? input.after.value : undefined;
			const isCaptured = beforeState === "captured" && afterState === "captured" && beforeValue !== undefined && afterValue !== undefined;
			const ordinaryBeforeDigest = beforeValue === undefined ? null : digestCanonicalValue(normalizeScenarioValue(beforeValue.events, "events", input.rules), "Browser scenario");
			const ordinaryAfterDigest = afterValue === undefined ? null : digestCanonicalValue(normalizeScenarioValue(afterValue.events, "events", input.rules), "Browser scenario");
			const beforeSha256 = beforeState === "captured" && beforeValue !== undefined ? digestScenarioEvents(beforeValue, ordinaryBeforeDigest) : null;
			const afterSha256 = afterState === "captured" && afterValue !== undefined ? digestScenarioEvents(afterValue, ordinaryAfterDigest) : null;
			const changedOrdinaryEvents = isCaptured && ordinaryBeforeDigest !== ordinaryAfterDigest;
			if (changedOrdinaryEvents && input.familyIncomparableReason === undefined) return {
				artifact: input.artifact,
				status: "changed",
				diff: {
					artifact: input.artifact,
					status: "changed",
					before_state: beforeState,
					after_state: afterState,
					before_sha256: beforeSha256,
					after_sha256: afterSha256,
					reason: input.incomparableReason ?? null
				}
			};
			if (!isCaptured || input.incomparableReason !== undefined || input.familyIncomparableReason !== undefined) return {
				artifact: input.artifact,
				status: "unknown",
				diff: {
					artifact: input.artifact,
					status: "unknown",
					before_state: beforeState,
					after_state: afterState,
					before_sha256: beforeSha256,
					after_sha256: afterSha256,
					reason: joinIncomparableReasons(input.familyIncomparableReason, input.incomparableReason) ?? `Artifact coverage is not comparable (${beforeState} before, ${afterState} after).`
				}
			};
			if (beforeSha256 === null || afterSha256 === null) throw new TypeError("Captured event digest refinement failed");
			if (beforeSha256 === afterSha256) return {
				artifact: input.artifact,
				status: "unchanged",
				diff: null
			};
			return {
				artifact: input.artifact,
				status: "changed",
				diff: {
					artifact: input.artifact,
					status: "changed",
					before_state: beforeState,
					after_state: afterState,
					before_sha256: beforeSha256,
					after_sha256: afterSha256,
					reason: null
				}
			};
		};
		digestScenarioEvents = (value, ordinaryEventsDigest) => {
			const parsed = scenarioEventsValueSchema.parse(value);
			return digestCanonicalValue({
				ordinary_events_sha256: ordinaryEventsDigest,
				network_transactions: parsed.network_transactions
			}, "Browser scenario");
		};
		eventCoverageReason = (before, after, beforeNetworkReason, afterNetworkReason) => {
			const reasons = [
				eventFamilyCoverageReason(before, after),
				networkContentCoverageReason(before, after),
				beforeNetworkReason,
				afterNetworkReason
			].filter((reason) => reason !== undefined);
			return reasons.length === 0 ? undefined : reasons.join(" ");
		};
		compareCapturedValues = (input) => {
			const { artifact, before, after, beforeStep, afterStep, rules, project = (value) => value, order } = input;
			const beforeState = input.beforeState ?? artifactEvidenceState(artifact, before, beforeStep);
			const afterState = input.afterState ?? artifactEvidenceState(artifact, after, afterStep);
			if (beforeState === "not_requested" && afterState === "not_requested") return {
				artifact,
				status: "not_compared",
				diff: null
			};
			const beforeSha256 = beforeState === "captured" && before.state === "captured" ? digestNormalizedScenarioValue(project(before.value), artifact, rules, order) : null;
			const afterSha256 = afterState === "captured" && after.state === "captured" ? digestNormalizedScenarioValue(project(after.value), artifact, rules, order) : null;
			if (beforeState !== "captured" || afterState !== "captured" || before.state !== "captured" || after.state !== "captured" || input.incomparableReason !== undefined) return {
				artifact,
				status: "unknown",
				diff: {
					artifact,
					status: "unknown",
					before_state: beforeState,
					after_state: afterState,
					before_sha256: beforeSha256,
					after_sha256: afterSha256,
					reason: joinIncomparableReasons(input.familyIncomparableReason, input.incomparableReason) ?? `Artifact coverage is not comparable (${beforeState} before, ${afterState} after).`
				}
			};
			if (beforeSha256 === null || afterSha256 === null) throw new TypeError("Captured artifact digest refinement failed");
			if (beforeSha256 === afterSha256) return {
				artifact,
				status: "unchanged",
				diff: null
			};
			return {
				artifact,
				status: "changed",
				diff: {
					artifact,
					status: "changed",
					before_state: beforeState,
					after_state: afterState,
					before_sha256: beforeSha256,
					after_sha256: afterSha256,
					reason: null
				}
			};
		};
		joinIncomparableReasons = (...reasons) => {
			const present = reasons.filter((reason) => reason !== undefined);
			return present.length === 0 ? undefined : [...new Set(present)].join(" ");
		};
	})))();
}

//#endregion
//#region dist/domain/webCaptureDiffSchemas.js
var captureSnapshotSchema, compareWebCapturesInputSchema, changeSchema, emptyDimensionShape, dimensionSchema, webCaptureDiffSchema;
function init_webCaptureDiffSchemas() {
	return (init_webCaptureDiffSchemas = __esmMin((() => {
		init_emptyArraySchema();
		init_browserObservationSchemas();
		init_webMcpDiscovery();
		captureSnapshotSchema = z.object({
			inspection: webPageInspectionSchema.describe("Complete normalized_result from inspect_web_page, including capture identity, observations, completeness, and limitations."),
			webmcp: webMcpDiscoverySchema.nullable().default(null).describe("Complete normalized_result from discover_webmcp_tools for this capture, or null when it was not recorded.")
		});
		compareWebCapturesInputSchema = z.strictObject({
			before: captureSnapshotSchema,
			after: captureSnapshotSchema
		});
		changeSchema = z.object({
			identity: z.string(),
			change: z.enum([
				"added",
				"removed",
				"modified"
			])
		});
		emptyDimensionShape = {
			total_changes: z.literal(0),
			changes: emptyArraySchema
		};
		dimensionSchema = z.union([
			z.object({
				status: z.literal("changed"),
				total_changes: z.number().int().min(1),
				changes: z.array(changeSchema),
				reason: z.null()
			}).superRefine((dimension, context) => {
				if (dimension.changes.length !== dimension.total_changes) context.addIssue({
					code: "custom",
					message: "Inline changes must equal total changes",
					path: ["total_changes"]
				});
			}),
			z.object({
				...emptyDimensionShape,
				status: z.literal("unchanged"),
				reason: z.null()
			}),
			z.object({
				...emptyDimensionShape,
				status: z.literal("unknown"),
				reason: z.string()
			})
		]);
		webCaptureDiffSchema = z.object({
			overall_status: z.enum([
				"changed",
				"unchanged",
				"unknown"
			]),
			before_target: z.object({
				target_id: z.string(),
				url: z.string()
			}),
			after_target: z.object({
				target_id: z.string(),
				url: z.string()
			}),
			dimensions: z.object({
				dom_structure: dimensionSchema,
				scripts: dimensionSchema,
				resources: dimensionSchema,
				network: dimensionSchema,
				metadata: dimensionSchema,
				webmcp: dimensionSchema,
				accessibility: dimensionSchema,
				storage: dimensionSchema
			}),
			limitations: z.array(z.string())
		}).superRefine((comparison, context) => {
			const statuses = Object.values(comparison.dimensions).map(({ status }) => status);
			const expected = statuses.includes("changed") ? "changed" : statuses.includes("unknown") ? "unknown" : "unchanged";
			if (comparison.overall_status !== expected) context.addIssue({
				code: "custom",
				message: "Overall status must summarize dimension statuses",
				path: ["overall_status"]
			});
		});
	})))();
}

//#endregion
//#region dist/domain/webCaptureFrameComparison.js
var fingerprintWebCaptureFrames;
function init_webCaptureFrameComparison() {
	return (init_webCaptureFrameComparison = __esmMin((() => {
		init_canonicalDigest();
		fingerprintWebCaptureFrames = (frames) => {
			const byId = new Map(frames.map((frame) => [frame.frame_id, frame]));
			if (byId.size !== frames.length) return null;
			const remaining = new Map(frames.map((frame) => [frame.frame_id, 0]));
			for (const frame of frames) {
				if (frame.parent_frame_id === null) continue;
				const count = remaining.get(frame.parent_frame_id);
				if (count === undefined) return null;
				remaining.set(frame.parent_frame_id, count + 1);
			}
			const ready = frames.filter((frame) => remaining.get(frame.frame_id) === 0);
			const children = new Map();
			const roots = [];
			let examined = 0;
			for (let index = 0; index < ready.length; index += 1) {
				const frame = ready[index];
				if (frame === undefined) throw new Error("Missing ready frame");
				const fingerprint = digestCanonicalValue({
					url: frame.url,
					origin: frame.origin,
					children: (children.get(frame.frame_id) ?? []).sort()
				});
				examined += 1;
				const parentId = frame.parent_frame_id;
				if (parentId === null) {
					roots.push(fingerprint);
					continue;
				}
				const siblings = children.get(parentId) ?? [];
				siblings.push(fingerprint);
				children.set(parentId, siblings);
				const count = (remaining.get(parentId) ?? 0) - 1;
				remaining.set(parentId, count);
				if (count === 0) {
					const parent = byId.get(parentId);
					if (parent === undefined) throw new Error("Missing admitted parent frame");
					ready.push(parent);
				}
			}
			return examined === frames.length ? digestCanonicalValue(roots.sort()) : null;
		};
	})))();
}

//#endregion
//#region dist/domain/webCaptureDiff.js
var compareWebCaptures, compareIdentities, compareDimension, accessibilityDimension, storageDimension, compareWebCaptureDimensions, keyed, bodyShapesSelected, webSocketShapesSelected, networkIdentity, networkResponseFields, sharedNetworkResponseFields, retainSharedResponseFields, redirectNetworkIdentity, networkDimension, networkMap, webSocketGroups, webSocketMetadataMap, webSocketPayloadMaps, webMcpDimension, webMcpComplete, sectionsComplete, incompleteSections, compareAggregate, domDimension, scriptProjection, metadataProjection, singleton, accessibilityComparable, accessibilityProjection, storageKeysComparable, storageComparable, storageMap, storageFingerprintIdentities, completeStorageFingerprints;
function init_webCaptureDiff() {
	return (init_webCaptureDiff = __esmMin((() => {
		init_canonicalDigest();
		init_unicodeCodePointOrder();
		init_webCaptureDiffSchemas();
		init_webCaptureFrameComparison();
		compareWebCaptures = (input) => {
			const before = input.before.inspection;
			const after = input.after.inspection;
			const dimensions = compareWebCaptureDimensions(input);
			const statuses = Object.values(dimensions).map(({ status }) => status);
			return webCaptureDiffSchema.parse({
				overall_status: statuses.includes("changed") ? "changed" : statuses.includes("unknown") ? "unknown" : "unchanged",
				before_target: {
					target_id: before.target.target_id,
					url: before.target.url
				},
				after_target: {
					target_id: after.target.target_id,
					url: after.target.url
				},
				dimensions,
				limitations: [
					"A changed status proves an observed difference; an unknown status means absence could not be established from capture completeness.",
					"Network comparison covers only activity observed after each CDP attachment. WebSocket connections with the same URL are compared as an unordered collection of ordered frame streams, retaining connection counts; their individual identities are not stable across captures.",
					"Accessibility roles, ignored state, text, and hierarchy are compared only when the accessibility tree was fully captured and text capture was selected and not truncated.",
					"Storage key inventories are compared only when selected and complete; usage and quota are compared only when reported. Redacted content is compared through complete SHA-256 fingerprints."
				]
			});
		};
		compareIdentities = (before, after) => {
			const changes = [];
			for (const [identity, fingerprint] of before) {
				const next = after.get(identity);
				if (next === undefined) changes.push({
					identity,
					change: "removed"
				});
				else if (next !== fingerprint) changes.push({
					identity,
					change: "modified"
				});
			}
			for (const identity of after.keys()) if (!before.has(identity)) changes.push({
				identity,
				change: "added"
			});
			return changes.sort((left, right) => compareUnicodeCodePoints(left.identity, right.identity) || compareUnicodeCodePoints(left.change, right.change));
		};
		compareDimension = (before, after, complete, reason, inventoryComplete = complete) => {
			const all = compareIdentities(before, after).filter(({ change }) => inventoryComplete || change === "modified");
			if (all.length > 0) return {
				status: "changed",
				total_changes: all.length,
				changes: all,
				reason: null
			};
			return complete ? {
				status: "unchanged",
				total_changes: 0,
				changes: [],
				reason: null
			} : {
				status: "unknown",
				total_changes: 0,
				changes: [],
				reason
			};
		};
		accessibilityDimension = (before, after) => {
			const beforeAccess = accessibilityComparable(before);
			const afterAccess = accessibilityComparable(after);
			const textComparable = beforeAccess.text && afterAccess.text;
			const nodesComparable = beforeAccess.nodes && afterAccess.nodes;
			return compareDimension(singleton("accessibility_tree", digestCanonicalValue(accessibilityProjection(before.accessibility, textComparable, nodesComparable))), singleton("accessibility_tree", digestCanonicalValue(accessibilityProjection(after.accessibility, textComparable, nodesComparable))), beforeAccess.complete && afterAccess.complete, "Accessibility tree or text capture was incomplete in at least one observation.");
		};
		storageDimension = (before, after) => {
			const keysComplete = storageKeysComparable(before) && storageKeysComparable(after);
			const usageComplete = before.storage.usage_bytes !== null && after.storage.usage_bytes !== null && before.storage.quota_bytes !== null && after.storage.quota_bytes !== null;
			const comparableFingerprints = storageFingerprintIdentities(before.storage, after.storage);
			return compareDimension(storageMap(before.storage, keysComplete, usageComplete, comparableFingerprints), storageMap(after.storage, keysComplete, usageComplete, comparableFingerprints), storageComparable(before, after, keysComplete, usageComplete), "Storage fingerprints, inventories, usage, or quota were unavailable or truncated in at least one observation.", keysComplete);
		};
		compareWebCaptureDimensions = (input) => {
			const before = input.before.inspection;
			const after = input.after.inspection;
			return {
				dom_structure: domDimension(before, after),
				scripts: compareDimension(keyed(before.scripts.items.map(scriptProjection), (item) => item.script_key), keyed(after.scripts.items.map(scriptProjection), (item) => item.script_key), sectionsComplete(before, ["scripts"]) && sectionsComplete(after, ["scripts"]), "Script inventory was incomplete in at least one observation."),
				resources: compareDimension(keyed(before.resources, (item) => item.resource_key), keyed(after.resources, (item) => item.resource_key), sectionsComplete(before, ["resources"]) && sectionsComplete(after, ["resources"]), "Resource inventory was incomplete in at least one observation."),
				network: networkDimension(before, after),
				metadata: compareAggregate("metadata", metadataProjection(before), metadataProjection(after), sectionsComplete(before, ["metadata"]) && sectionsComplete(after, ["metadata"]), "Safe metadata capture was incomplete in at least one observation."),
				webmcp: webMcpDimension(input.before.webmcp, input.after.webmcp),
				accessibility: accessibilityDimension(before, after),
				storage: storageDimension(before, after)
			};
		};
		keyed = (values, identity) => new Map(values.map((value) => [identity(value), digestCanonicalValue(value)]));
		bodyShapesSelected = (inspection) => !inspection.completeness.excluded.some(({ section, reason }) => section === "json_body_shapes" && reason === "not_approved") && (inspection.network.requests.length === 0 || inspection.network.requests.some(({ body_shapes }) => body_shapes.status !== "not_approved"));
		webSocketShapesSelected = (inspection) => !inspection.completeness.excluded.some(({ section, reason }) => section === "websocket_shapes" && reason === "not_approved");
		networkIdentity = (request) => `net_${digestCanonicalValue({
			method: request.method,
			url: request.url,
			resource_type: request.resource_type
		})}`;
		networkResponseFields = [
			"status",
			"mime_type",
			"encoded_data_length"
		];
		sharedNetworkResponseFields = (before, after) => {
			const shared = new Map();
			for (const inspection of [before, after]) for (const request of inspection.network.requests) {
				const identity = networkIdentity(request);
				retainSharedResponseFields(shared, identity, request);
				for (const [index, redirect] of (request.redirects ?? []).entries()) retainSharedResponseFields(shared, redirectNetworkIdentity(identity, index), redirect);
			}
			return shared;
		};
		retainSharedResponseFields = (shared, identity, response) => {
			const fields = shared.get(identity) ?? new Set(networkResponseFields);
			for (const field of networkResponseFields) if (response[field] === null) fields.delete(field);
			shared.set(identity, fields);
		};
		redirectNetworkIdentity = (identity, index) => compositeKey([
			identity,
			"redirect",
			index
		]);
		networkDimension = (before, after) => {
			const responseFields = sharedNetworkResponseFields(before, after);
			const responseFieldsComplete = [...responseFields.values()].every((fields) => fields.size === networkResponseFields.length);
			const selected = bodyShapesSelected(before) && bodyShapesSelected(after);
			const webSocketShapes = webSocketShapesSelected(before) && webSocketShapesSelected(after);
			const sources = new Map();
			if (selected) {
				const observedSources = (inspection) => {
					const result = new Map();
					for (const request of inspection.network.requests) {
						const identity = networkIdentity(request);
						const previous = result.get(identity);
						result.set(identity, {
							request: previous?.request !== false && request.body_shapes.request !== null,
							response: previous?.response !== false && request.body_shapes.response !== null
						});
					}
					return result;
				};
				const left = observedSources(before);
				const right = observedSources(after);
				for (const [identity, coverage] of left) {
					const next = right.get(identity);
					sources.set(identity, {
						request: coverage.request && next?.request === true,
						response: coverage.response && next?.response === true
					});
				}
			}
			const shapesComplete = !selected || [before, after].every((inspection) => sectionsComplete(inspection, ["json_body_shapes"]) && inspection.network.requests.every(({ body_shapes }) => body_shapes.status === "included"));
			const webSocketShapesComplete = !webSocketShapes || [before, after].every((inspection) => sectionsComplete(inspection, ["websocket_shapes"]) && inspection.network.websocket_connections.every((connection) => connection.events.every((event) => event.payload_shape !== null)));
			const webSocketPayloadBytesComplete = [before, after].every((inspection) => inspection.network.websocket_connections.every((connection) => connection.events.every((event) => event.payload_bytes !== null)));
			const beforeWebSockets = webSocketGroups(before);
			const afterWebSockets = webSocketGroups(after);
			const inventoryComplete = [before, after].every((inspection) => sectionsComplete(inspection, [
				"network_requests",
				"websocket_connections",
				"websocket_frames"
			]));
			const [beforeWebSocketPayload, afterWebSocketPayload] = webSocketPayloadMaps(beforeWebSockets, afterWebSockets, webSocketShapes);
			const compared = compareDimension(new Map([
				...networkMap(before, sources, responseFields),
				...webSocketMetadataMap(beforeWebSockets),
				...beforeWebSocketPayload
			]), new Map([
				...networkMap(after, sources, responseFields),
				...webSocketMetadataMap(afterWebSockets),
				...afterWebSocketPayload
			]), inventoryComplete && shapesComplete && webSocketPayloadBytesComplete && webSocketShapesComplete, "Network capture or selected HTTP/WebSocket payload-shape coverage is attach-window limited, unavailable, or incomplete.", inventoryComplete);
			if (responseFieldsComplete) return compared;
			const responseEvidenceReason = "HTTP response or redirect status, MIME type, or byte-count evidence is incomplete.";
			if (compared.status === "changed") return compared;
			return {
				status: "unknown",
				total_changes: 0,
				changes: [],
				reason: compared.reason === null ? responseEvidenceReason : `${responseEvidenceReason} ${compared.reason}`
			};
		};
		networkMap = (inspection, sources, responseFields) => {
			const grouped = new Map();
			for (const request of inspection.network.requests) {
				const identity = networkIdentity(request);
				const shapes = sources.get(identity);
				const values = grouped.get(identity) ?? [];
				const response = {};
				for (const field of responseFields.get(identity) ?? []) response[field] = request[field];
				values.push({
					...response,
					redirects: (request.redirects ?? []).map(({ request_timestamp: _requestTimestamp, redirect_event_timestamp: _redirectEventTimestamp, ...redirect }, index) => {
						const response = {};
						for (const field of responseFields.get(redirectNetworkIdentity(identity, index)) ?? []) if (redirect[field] !== null) response[field] = redirect[field];
						return {
							url: redirect.url,
							response_url: redirect.response_url,
							method: redirect.method,
							resource_type: redirect.resource_type,
							...response
						};
					}),
					initiator: request.initiator,
					...shapes?.request === true ? { request_shape: request.body_shapes.request } : {},
					...shapes?.response === true ? { response_shape: request.body_shapes.response } : {}
				});
				grouped.set(identity, values);
			}
			return new Map([...grouped].map(([identity, values]) => [identity, digestCanonicalValue(values.map((value) => digestCanonicalValue(value)).sort())]));
		};
		webSocketGroups = (inspection) => {
			const groups = new Map();
			for (const connection of inspection.network.websocket_connections) {
				const stream = digestCanonicalValue(connection.events.map(({ direction, opcode }) => ({
					direction,
					opcode
				})));
				const key = digestCanonicalValue({
					url: connection.url,
					stream
				});
				const previous = groups.get(key);
				if (previous !== undefined) previous.connections.push(connection);
				else groups.set(key, {
					url: connection.url,
					stream,
					connections: [connection]
				});
			}
			return groups;
		};
		webSocketMetadataMap = (groups) => {
			const byUrl = new Map();
			for (const group of groups.values()) {
				const streams = byUrl.get(group.url) ?? [];
				for (let index = 0; index < group.connections.length; index += 1) streams.push(group.stream);
				byUrl.set(group.url, streams);
			}
			return new Map([...byUrl].map(([url, streams]) => [`ws_${digestCanonicalValue(url)}`, digestCanonicalValue(streams.sort(compareUnicodeCodePoints))]));
		};
		webSocketPayloadMaps = (beforeGroups, afterGroups, selected) => {
			const left = new Map();
			const right = new Map();
			for (const [groupKey, beforeGroup] of beforeGroups) {
				const afterGroup = afterGroups.get(groupKey);
				if (afterGroup === undefined || beforeGroup.connections.length !== afterGroup.connections.length) continue;
				const eventCount = beforeGroup.connections[0]?.events.length ?? 0;
				const comparableBytes = new Set();
				const comparableShapes = new Set();
				for (let index = 0; index < eventCount; index += 1) {
					if (beforeGroup.connections.every((connection) => connection.events[index]?.payload_bytes !== null) && afterGroup.connections.every((connection) => connection.events[index]?.payload_bytes !== null)) comparableBytes.add(index);
					if (selected && beforeGroup.connections.every((connection) => connection.events[index]?.payload_shape !== null) && afterGroup.connections.every((connection) => connection.events[index]?.payload_shape !== null)) comparableShapes.add(index);
				}
				if (comparableBytes.size === 0 && comparableShapes.size === 0) continue;
				const project = (group) => digestCanonicalValue(group.connections.map((connection) => connection.events.map((event, index) => {
					const comparablePayload = {};
					if (comparableBytes.has(index)) comparablePayload.payload_bytes = event.payload_bytes;
					if (comparableShapes.has(index)) comparablePayload.payload_shape = event.payload_shape;
					return Object.keys(comparablePayload).length === 0 ? null : comparablePayload;
				})).map((stream) => digestCanonicalValue(stream)).sort(compareUnicodeCodePoints));
				const identity = `wss_${groupKey}`;
				left.set(identity, project(beforeGroup));
				right.set(identity, project(afterGroup));
			}
			return [left, right];
		};
		webMcpDimension = (before, after) => {
			const afterTools = new Map(after?.tools.items.map((tool) => [tool.tool_key, tool]));
			const unknownHints = new Set((before?.tools.items ?? []).filter((tool) => {
				const other = afterTools.get(tool.tool_key);
				return other !== undefined && (tool.annotations.consequential === undefined || other.annotations.consequential === undefined);
			}).map((tool) => tool.tool_key));
			const project = (discovery) => keyed((discovery?.tools.items ?? []).map((tool) => {
				if (!unknownHints.has(tool.tool_key)) return tool;
				const { consequential: _unknown, ...annotations } = tool.annotations;
				return {
					...tool,
					annotations
				};
			}), (tool) => tool.tool_key);
			const result = compareDimension(project(before), project(after), webMcpComplete(before) && webMcpComplete(after), "WebMCP discovery was unavailable or incomplete in at least one capture.");
			return result.status === "unchanged" && unknownHints.size > 0 ? {
				...result,
				status: "unknown",
				reason: "Consequential annotations were not recorded or were invalid in at least one capture."
			} : result;
		};
		webMcpComplete = (discovery) => discovery !== null && discovery.status === "available" && !incompleteSections(discovery.completeness).has("webmcp_tools");
		sectionsComplete = (inspection, sections) => {
			const incomplete = incompleteSections(inspection.completeness);
			return sections.every((section) => !incomplete.has(section));
		};
		incompleteSections = (completeness) => new Set([
			...completeness.policy_filtered_sections,
			...completeness.attach_limited_sections,
			...completeness.truncated_sections,
			...completeness.unavailable_sections
		]);
		compareAggregate = (identity, before, after, complete, reason) => compareDimension(complete ? singleton(identity, digestCanonicalValue(before)) : new Map(), complete ? singleton(identity, digestCanonicalValue(after)) : new Map(), complete, reason);
		domDimension = (before, after) => {
			const beforeFrames = fingerprintWebCaptureFrames(before.frames);
			const afterFrames = fingerprintWebCaptureFrames(after.frames);
			const nodesComplete = [before, after].every((inspection) => sectionsComplete(inspection, ["dom"]) && inspection.dom.total_nodes === inspection.dom.nodes.length);
			const framesComplete = beforeFrames !== null && afterFrames !== null && [before, after].every((inspection) => sectionsComplete(inspection, ["frames"]));
			const changes = [];
			if (nodesComplete && digestCanonicalValue(before.dom.nodes) !== digestCanonicalValue(after.dom.nodes)) changes.push({
				identity: "document",
				change: "modified"
			});
			if (framesComplete && beforeFrames !== afterFrames) changes.push({
				identity: "frames",
				change: "modified"
			});
			if (changes.length > 0) return {
				status: "changed",
				total_changes: changes.length,
				changes,
				reason: null
			};
			return nodesComplete && framesComplete ? {
				status: "unchanged",
				total_changes: 0,
				changes: [],
				reason: null
			} : {
				status: "unknown",
				total_changes: 0,
				changes: [],
				reason: "DOM or frame capture was incomplete, or frame ancestry was unresolved in at least one observation."
			};
		};
		scriptProjection = (script) => ({
			script_key: script.script_key,
			url: script.url,
			cdp_hash: script.cdp_hash,
			length: script.length,
			is_module: script.is_module,
			language: script.language,
			source_map_url: script.source_map_url
		});
		metadataProjection = (inspection) => ({
			responses: inspection.metadata.responses.map(({ request_id: _requestId, ...response }) => response).map((value) => digestCanonicalValue(value)).sort(),
			dom_urls: inspection.metadata.dom_urls.map((value) => digestCanonicalValue(value)).sort(),
			agent_hints: inspection.metadata.agent_hints.map((value) => digestCanonicalValue(value)).sort(),
			excluded_dom_urls: inspection.metadata.excluded_dom_urls,
			headers_allowlisted: inspection.metadata.headers_allowlisted
		});
		singleton = (key, value) => new Map([[key, value]]);
		accessibilityComparable = (inspection) => {
			const text = inspection.accessibility.text_capture.status === "included" && inspection.accessibility.text_capture.excluded_fields === 0;
			const nodes = inspection.accessibility.total_nodes === inspection.accessibility.nodes.length;
			const complete = text && nodes && sectionsComplete(inspection, ["accessibility"]);
			return {
				text,
				nodes,
				complete
			};
		};
		accessibilityProjection = (accessibility, includeText, includeNodes) => {
			if (!includeNodes) return { total_nodes: accessibility.total_nodes };
			const nodeIndexes = new Map(accessibility.nodes.map((node, index) => [node.node_id, index]));
			return {
				total_nodes: accessibility.total_nodes,
				nodes: accessibility.nodes.map((node) => ({
					parent_index: node.parent_id === null ? null : nodeIndexes.get(node.parent_id) ?? -1,
					role: node.role,
					ignored: node.ignored,
					states: node.states,
					...includeText ? {
						name: node.name,
						description: node.description
					} : {}
				}))
			};
		};
		storageKeysComparable = (inspection) => sectionsComplete(inspection, ["storage_keys"]);
		storageComparable = (before, after, keysComplete, usageComplete) => keysComplete && usageComplete && before.storage.fingerprints_complete && after.storage.fingerprints_complete;
		storageMap = (storage, includeKeys, includeUsage, fingerprintIdentities) => {
			const map = new Map([["storage:summary", digestCanonicalValue({
				origin: storage.origin,
				values_redacted: storage.values_redacted,
				...includeUsage ? {
					usage_bytes: storage.usage_bytes,
					quota_bytes: storage.quota_bytes
				} : {}
			})]]);
			const add = (kind, keys) => {
				for (const key of keys) {
					map.set(`storage:${kind}:${key}`, digestCanonicalValue(key));
				}
			};
			if (includeKeys) {
				add("local_storage", storage.local_storage_keys);
				add("session_storage", storage.session_storage_keys);
				add("indexed_db", storage.indexed_db_names);
				add("cache", storage.cache_names);
			}
			for (const fingerprint of storage.content_fingerprints) {
				const identity = `${fingerprint.scope}:${fingerprint.identity_sha256}`;
				if (!fingerprintIdentities.has(identity)) continue;
				map.set(`storage:content:${identity}`, digestCanonicalValue(fingerprint.value_sha256));
			}
			return map;
		};
		storageFingerprintIdentities = (before, after) => {
			const beforeComplete = completeStorageFingerprints(before);
			const afterComplete = completeStorageFingerprints(after);
			if (before.fingerprints_complete && after.fingerprints_complete) return new Set([...beforeComplete.keys(), ...afterComplete.keys()]);
			return new Set([...beforeComplete.keys()].filter((identity) => afterComplete.has(identity)));
		};
		completeStorageFingerprints = (storage) => new Map(storage.content_fingerprints.filter(({ complete }) => complete).map(({ scope, identity_sha256, value_sha256 }) => [`${scope}:${identity_sha256}`, value_sha256]));
	})))();
}

//#endregion
//#region dist/domain/browserCaptureComparison.js
var browserCaptureComparisonInputSchema, browserCaptureComparisonSchema, compareBrowserCaptures;
function init_browserCaptureComparison() {
	return (init_browserCaptureComparison = __esmMin((() => {
		init_browserScenarioDiff();
		init_webCaptureDiff();
		init_browserScenarioDiffValues();
		init_webCaptureDiffSchemas();
		browserCaptureComparisonInputSchema = z.union([compareWebCapturesInputSchema, compareBrowserScenariosInputSchema], { error: (issue) => issue.code === "invalid_union" ? z.prettifyError(new z.ZodError(issue.errors.flat())) : undefined });
		browserCaptureComparisonSchema = z.union([browserScenarioDiffSchema, webCaptureDiffSchema]);
		compareBrowserCaptures = (input) => "before_scenario" in input ? compareBrowserScenarios(input) : compareWebCaptures(input);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticIr.js
var failedJavaScriptSemanticIr;
function init_javascriptSemanticIr() {
	return (init_javascriptSemanticIr = __esmMin((() => {
		failedJavaScriptSemanticIr = () => ({
			schema: "JavaScriptSemanticIR",
			scopes: [],
			bindings: [],
			callables: [],
			references: [],
			moduleLinks: [],
			callSites: [],
			argumentFlows: [],
			callReturnFlows: [],
			callResultFlows: [],
			closureCaptures: [],
			promiseOperations: [],
			eventOperations: [],
			timerOperations: [],
			childProcessSpawns: [],
			childProcessInteractions: [],
			configurationOperations: [],
			requestOperations: [],
			boundaryOperations: [],
			resourceOperations: [],
			objectOperations: [],
			functionFingerprints: [],
			frontiers: [],
			coverage: {
				status: "failed",
				omittedCount: null
			},
			limitations: ["JavaScript parsing failed; no semantic absence claim is available.", "No JavaScript was executed."]
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticState.js
var semanticStableInitializer, currentSemanticScope, semanticScopeId, semanticBindingId, resolveSemanticBindingState, semanticResolutionBlocked, semanticScopeForNode, resolveSemanticBindingFromScope, semanticVariableScope, isUnshadowedGlobal, isUnmodifiedCommonJsWrapperBinding;
function init_javascriptSemanticState() {
	return (init_javascriptSemanticState = __esmMin((() => {
		semanticStableInitializer = (binding, state) => {
			const [initializer] = binding?.initializers ?? [];
			const [definition] = binding?.definitions ?? [];
			return binding !== undefined && (definition?.kind === "variable" && binding.definitions.every(({ kind }) => kind === "variable") || binding.definitions.length === 1 && (definition?.kind === "function" || definition?.kind === "class")) && binding.initializers.length === 1 && initializer !== undefined && !state.conditionallySkippedExpressions.has(initializer.node) ? initializer : undefined;
		};
		currentSemanticScope = (stack) => {
			const scope = stack.at(-1);
			if (scope === undefined) throw new TypeError("Missing semantic scope");
			return scope;
		};
		semanticScopeId = (kind, node) => `scope:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		semanticBindingId = (scopeId, name) => `${scopeId}:binding:${encodeURIComponent(name)}`;
		resolveSemanticBindingState = (state, node, name) => {
			let scope = semanticScopeForNode(state, node);
			while (scope !== undefined) {
				const binding = scope.bindings.get(name);
				if (binding !== undefined) return binding;
				if (!scope.bindingsComplete) return undefined;
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return undefined;
		};
		semanticResolutionBlocked = (state, node, name) => {
			let scope = semanticScopeForNode(state, node);
			while (scope !== undefined) {
				if (scope.bindings.has(name)) return false;
				if (!scope.bindingsComplete) return true;
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return false;
		};
		semanticScopeForNode = (state, node) => {
			let candidate = node;
			while (candidate !== undefined) {
				const scope = state.scopeByNode.get(candidate);
				if (scope !== undefined) {
					let descendant = node;
					while (descendant !== undefined && descendant !== candidate) {
						state.scopeByNode.set(descendant, scope);
						descendant = state.parentsByNode.get(descendant);
					}
					return scope;
				}
				candidate = state.parentsByNode.get(candidate);
			}
			return undefined;
		};
		resolveSemanticBindingFromScope = (scope, name, state) => {
			let candidate = scope;
			while (candidate !== undefined) {
				const binding = candidate.bindings.get(name);
				if (binding !== undefined) return binding;
				if (!candidate.bindingsComplete) return undefined;
				candidate = candidate.parentScopeId === null ? undefined : state.scopesById.get(candidate.parentScopeId);
			}
			return undefined;
		};
		semanticVariableScope = (scope, parent, state) => {
			if (!(parent !== null && t.isVariableDeclaration(parent, { kind: "var" }))) return scope;
			let candidate = scope;
			while (candidate.kind === "block" || candidate.kind === "catch") {
				const outer = candidate.parentScopeId === null ? undefined : state.scopesById.get(candidate.parentScopeId);
				if (outer === undefined) break;
				candidate = outer;
			}
			return candidate;
		};
		isUnshadowedGlobal = (node, state, name) => t.isIdentifier(node, { name }) && (resolveSemanticBindingState(state, node, name) === undefined ? !semanticResolutionBlocked(state, node, name) : isUnmodifiedCommonJsWrapperBinding(node, name, state));
		isUnmodifiedCommonJsWrapperBinding = (node, name, state) => {
			if (state.program.sourceType !== "script" || ![
				"module",
				"exports",
				"require"
			].includes(name) || !t.isIdentifier(node, { name })) return false;
			const binding = resolveSemanticBindingState(state, node, name);
			if (binding === undefined || binding.initializers.length !== 0) return false;
			const scope = state.scopesById.get(binding.scopeId);
			return scope?.kind === "program" && binding.declarationKinds.size > 0 && [...binding.declarationKinds].every((kind) => kind === "var");
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticTraversal.js
/**
* {@link traverseJavaScriptAst} with a yield every 1,024 visited nodes, so a
* caller can serve control messages during one large traversal. Visit order
* and callbacks are identical.
*/
function* traverseJavaScriptAstSteps(root, visitor) {
	const ancestors = [];
	const enter = (node, parent) => {
		visitor.enter(node, parent, () => [...ancestors]);
		ancestors.push(node);
		return {
			node,
			parent,
			children: childNodes(node),
			nextIndex: 0
		};
	};
	const pending = [enter(root, null)];
	let visited = 1;
	while (pending.length > 0) {
		const current = pending.at(-1);
		if (current === undefined) break;
		const child = current.children[current.nextIndex];
		if (child !== undefined) {
			current.nextIndex += 1;
			if (visited % 1024 === 0) yield;
			visited += 1;
			if (visitor.skip?.(child) === true) continue;
			pending.push(enter(child, current.node));
		} else {
			visitor.exit?.(current.node, current.parent);
			ancestors.pop();
			pending.pop();
		}
	}
}
var traverseJavaScriptAst, completeSemanticSteps, childNodes, javaScriptAstChildKeys;
function init_javascriptSemanticTraversal() {
	return (init_javascriptSemanticTraversal = __esmMin((() => {
		traverseJavaScriptAst = (root, visitor) => completeSemanticSteps(traverseJavaScriptAstSteps(root, visitor));
		completeSemanticSteps = (steps) => {
			for (;;) {
				const step = steps.next();
				if (step.done === true) return step.value;
			}
		};
		childNodes = (node) => {
			const keys = javaScriptAstChildKeys(node);
			const children = [];
			for (const key of keys) {
				const value = Reflect.get(node, key);
				if (t.isNode(value)) {
					children.push(value);
					continue;
				}
				if (!Array.isArray(value)) continue;
				for (const item of value) {
					if (t.isNode(item)) children.push(item);
				}
			}
			return children;
		};
		javaScriptAstChildKeys = (node) => t.VISITOR_KEYS[node.type] ?? [];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBuiltinResourceMethods.js
var BUILTIN_RESOURCE_METHODS, BUILTIN_RESOURCE_SPECIFIERS;
function init_javascriptBuiltinResourceMethods() {
	return (init_javascriptBuiltinResourceMethods = __esmMin((() => {
		BUILTIN_RESOURCE_METHODS = {
			fs: [
				"open",
				"openSync",
				"createReadStream",
				"createWriteStream"
			],
			"fs/promises": ["open"],
			net: ["connect", "createConnection"],
			tls: ["connect", "createConnection"]
		};
		BUILTIN_RESOURCE_SPECIFIERS = Object.keys(BUILTIN_RESOURCE_METHODS);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptAstValues.js
/** Visit binding and member leaves in direct and destructuring write targets. */
function* semanticWriteTargets(root) {
	const pending = [root];
	while (pending.length > 0) {
		const next = pending.pop();
		if (next === undefined) break;
		const node = unwrapJavaScriptExpression(next).node;
		if (t.isIdentifier(node) || t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) yield node;
		else if (t.isRestElement(node)) pending.push(node.argument);
		else if (t.isAssignmentPattern(node)) pending.push(node.left);
		else if (t.isArrayPattern(node)) {
			for (const element of node.elements.toReversed()) if (element !== null) pending.push(element);
		} else if (t.isObjectPattern(node)) {
			for (const property of node.properties.toReversed()) pending.push(t.isRestElement(property) ? property.argument : property.value);
		}
	}
}
var runtimeFunctionParameters, unwrapJavaScriptExpression, readExactJavaScriptLiteral, propertyName, semanticStaticPropertyName, semanticStaticPropertyKey, semanticObjectPatternKeys, semanticWriteSiteTarget, semanticWriteSiteReadsFirst, semanticWrappedWriteSite, javascriptDisplayText;
function init_javascriptAstValues() {
	return (init_javascriptAstValues = __esmMin((() => {
		runtimeFunctionParameters = (node) => t.isIdentifier(node.params[0], { name: "this" }) ? node.params.slice(1) : node.params;
		unwrapJavaScriptExpression = (node) => {
			let current = node;
			let depth = 0;
			while (t.isParenthesizedExpression(current) || t.isTSAsExpression(current) || t.isTSTypeAssertion(current) || t.isTSNonNullExpression(current) || t.isTSSatisfiesExpression(current) || t.isTSInstantiationExpression(current) || t.isTypeCastExpression(current)) {
				current = current.expression;
				depth += 1;
			}
			return {
				node: current,
				depth
			};
		};
		readExactJavaScriptLiteral = (node) => {
			node = unwrapJavaScriptExpression(node).node;
			if (t.isStringLiteral(node)) return {
				found: true,
				value: node.value
			};
			if (t.isNumericLiteral(node) && Number.isFinite(node.value)) return {
				found: true,
				value: node.value
			};
			if (t.isBooleanLiteral(node)) return {
				found: true,
				value: node.value
			};
			if (t.isNullLiteral(node)) return {
				found: true,
				value: null
			};
			if (t.isTemplateLiteral(node) && node.expressions.length === 0 && node.quasis.length === 1) {
				const cooked = node.quasis[0]?.value.cooked;
				return cooked === null || cooked === undefined ? { found: false } : {
					found: true,
					value: cooked
				};
			}
			return { found: false };
		};
		propertyName = (node) => {
			if (t.isIdentifier(node)) return node.name;
			if (t.isStringLiteral(node) || t.isNumericLiteral(node)) return String(node.value);
			return "";
		};
		semanticStaticPropertyName = (property, computed) => semanticStaticPropertyKey(property, computed) ?? "";
		semanticStaticPropertyKey = (property, computed) => {
			property = unwrapJavaScriptExpression(property).node;
			if (t.isStringLiteral(property) || t.isNumericLiteral(property)) return String(property.value);
			if (t.isBigIntLiteral(property)) return String(property.value);
			if (t.isUnaryExpression(property, { operator: "-" }) && t.isBigIntLiteral(property.argument)) return String(-BigInt(property.argument.value));
			if (t.isTemplateLiteral(property) && property.expressions.length === 0 && property.quasis.length === 1) {
				const cooked = property.quasis[0]?.value.cooked;
				return cooked === null || cooked === undefined ? null : cooked;
			}
			return !computed && t.isIdentifier(property) ? property.name : null;
		};
		semanticObjectPatternKeys = (pattern) => pattern.properties.flatMap((property) => {
			if (t.isRestElement(property)) return [];
			const key = semanticStaticPropertyKey(property.key, property.computed);
			return key === null ? [] : [key];
		});
		semanticWriteSiteTarget = (node) => {
			if (t.isAssignmentExpression(node)) return node.left;
			if (t.isUpdateExpression(node)) return node.argument;
			if (t.isUnaryExpression(node, { operator: "delete" })) return node.argument;
			if (t.isForOfStatement(node) || t.isForInStatement(node)) return node.left;
			return null;
		};
		semanticWriteSiteReadsFirst = (site) => t.isAssignmentExpression(site) && site.operator !== "=" || t.isUpdateExpression(site);
		semanticWrappedWriteSite = (node, parent, ancestors) => {
			const chain = ancestors.at(-1) === parent ? ancestors : [...ancestors, parent];
			for (let index = chain.length - 1; index >= 0; index -= 1) {
				const candidate = chain[index];
				if (candidate === undefined) return null;
				const target = semanticWriteSiteTarget(candidate);
				if (target !== null) return unwrapJavaScriptExpression(target).node === node ? candidate : null;
				if (unwrapJavaScriptExpression(candidate).depth === 0) return null;
			}
			return null;
		};
		javascriptDisplayText = (value) => value === "" ? "\"\"" : value;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPropertyPaths.js
var semanticArrayIndex, semanticPropertyPathKeyMatches, coverageNode, SemanticPropertyPathCoverage, keyCovers;
function init_javascriptSemanticPropertyPaths() {
	return (init_javascriptSemanticPropertyPaths = __esmMin((() => {
		semanticArrayIndex = (key) => {
			const index = Number(key);
			return Number.isInteger(index) && index >= 0 && index < 4294967295 && String(index) === String(key) ? index : null;
		};
		semanticPropertyPathKeyMatches = (key, name) => {
			if (key === null) return true;
			if (typeof key !== "object") return String(key) === name;
			if (key.excludedKeys.includes(name)) return false;
			if (key.startIndex === undefined) return true;
			const index = semanticArrayIndex(name);
			return index !== null && index >= key.startIndex;
		};
		coverageNode = () => ({
			terminal: false,
			exact: new Map(),
			selectors: new Map()
		});
		SemanticPropertyPathCoverage = class {
			#root = coverageNode();
			/** Retain a path only when no previously retained prefix covers it. */
			retain(path) {
				if (this.covers(path)) return false;
				let node = this.#root;
				for (const key of path) {
					if (key !== null && typeof key !== "object") {
						const name = String(key);
						let child = node.exact.get(name);
						if (child === undefined) {
							child = coverageNode();
							node.exact.set(name, child);
						}
						node = child;
					} else {
						const identity = JSON.stringify(key);
						let selected = node.selectors.get(identity);
						if (selected === undefined) {
							selected = {
								key,
								node: coverageNode()
							};
							node.selectors.set(identity, selected);
						}
						node = selected.node;
					}
				}
				node.terminal = true;
				node.exact.clear();
				node.selectors.clear();
				return true;
			}
			/** Query retained prefixes without changing the coverage index. */
			covers(path) {
				const pending = [{
					node: this.#root,
					offset: 0
				}];
				while (pending.length > 0) {
					const current = pending.pop();
					if (current === undefined) break;
					if (current.node.terminal) return true;
					const key = path[current.offset];
					if (key === undefined) continue;
					if (key !== null && typeof key !== "object") {
						const exact = current.node.exact.get(String(key));
						if (exact !== undefined) pending.push({
							node: exact,
							offset: current.offset + 1
						});
					}
					for (const selected of current.node.selectors.values()) {
						if (keyCovers(selected.key, key)) pending.push({
							node: selected.node,
							offset: current.offset + 1
						});
					}
				}
				return false;
			}
		};
		keyCovers = (covering, key) => {
			if (covering === null) return true;
			if (key === null) return false;
			if (typeof key !== "object") return typeof covering === "object" ? semanticPropertyPathKeyMatches(covering, String(key)) : String(covering) === String(key);
			return typeof covering === "object" && covering.excludedKeys.every((name) => key.excludedKeys.includes(name)) && (covering.startIndex === undefined || key.startIndex !== undefined && covering.startIndex <= key.startIndex);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptStaticAnalysisHelpers.js
var failedJavaScriptStaticAnalysis, argumentNode, chunkRuntime, findChunkRuntime, moduleFactory, modulePropertyName, factoryRequireName, staticArrayValues, staticPathResolutionContext, staticPath, staticConcatenation, staticCallPath, staticFileUrlPath, sourceRelativeFileUrlPath, isSourceFileUrl, staticResolvedPath, isFilesystemPathExpression, isDirectoryIdentity, isDirectoryPath, isImportMetaUrl, isFileIdentity, XHR_METHODS, isRequestUrlOrPathLiteral, isRequestUrlReference, WINDOW_OPEN_CALL, FS_OPEN_FLAGS, BROWSING_CONTEXT_KEYWORDS, xhrOpenUrl, KEYED_COLLECTION_CONSTRUCTORS, isKeyedCollectionReceiver, endpointArgument, storageKind, calleeName, memberPropertyName, stringValue, argumentValue, prefixedArgument, sourceSlice, range, rangeForOffsets, sourceRangesEqual, pointForOffset, detectVendors, registrationKey, sortedUnique, sha256Text, STATIC_ROUTE_CALL_NAMES, vendorPatterns;
function init_javascriptStaticAnalysisHelpers() {
	return (init_javascriptStaticAnalysisHelpers = __esmMin((() => {
		init_javascriptAstValues();
		init_unicodeCodePointOrder();
		failedJavaScriptStaticAnalysis = () => ({
			parse_status: "failed",
			parse_error_count: 1,
			visited_ast_nodes: 0,
			references: [],
			endpoints: [],
			storage: [],
			bundler_registrations: [],
			role_paths: [],
			source_map_urls: [],
			vendors: [],
			electron: {
				browser_windows: [],
				context_bridge_apis: [],
				ipc: [],
				sender_validations: [],
				utility_processes: [],
				native_addon_bindings: []
			},
			limitations: ["JavaScript source could not be parsed; absence of findings is not evidence of absence.", "JavaScript syntax was parsed as data and was never evaluated."]
		});
		argumentNode = (argument) => argument !== null && t.isNode(argument) ? argument : undefined;
		chunkRuntime = (call) => {
			if (!t.isMemberExpression(call.callee) && !t.isOptionalMemberExpression(call.callee)) return undefined;
			if (semanticStaticPropertyName(call.callee.property, call.callee.computed) !== "push") return undefined;
			return findChunkRuntime(call.callee.object);
		};
		findChunkRuntime = (node) => {
			const pending = [node];
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined) continue;
				if (t.isIdentifier(current) && /(?:webpack|rspack)Chunk/iu.test(current.name)) return current.name;
				if (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					const property = semanticStaticPropertyName(current.property, current.computed);
					if (/(?:webpack|rspack)Chunk/iu.test(property)) return property;
					if (t.isNode(current.object)) pending.push(current.object);
					continue;
				}
				if (t.isAssignmentExpression(current)) {
					pending.push(current.right, current.left);
					continue;
				}
				if (t.isLogicalExpression(current) || t.isBinaryExpression(current)) {
					pending.push(current.right, current.left);
					continue;
				}
				const unwrapped = unwrapJavaScriptExpression(current).node;
				if (unwrapped !== current) pending.push(unwrapped);
			}
			return undefined;
		};
		moduleFactory = (property) => {
			if (t.isObjectMethod(property)) return property;
			if (t.isObjectProperty(property) && (t.isFunctionExpression(property.value) || t.isArrowFunctionExpression(property.value))) return property.value;
			return undefined;
		};
		modulePropertyName = (property) => {
			if (!t.isObjectMethod(property) && !t.isObjectProperty(property)) return `[unknown@${String(property.start ?? -1)}]`;
			const key = semanticStaticPropertyKey(property.key, property.computed);
			if (key !== null) return key;
			return property.computed ? `[computed@${String(property.start ?? -1)}]` : `[unknown@${String(property.start ?? -1)}]`;
		};
		factoryRequireName = (factory) => {
			const parameter = runtimeFunctionParameters(factory)[2];
			return t.isIdentifier(parameter) ? parameter.name : null;
		};
		staticArrayValues = (array) => {
			const staticValues = array.elements.flatMap((element) => {
				const value = argumentValue(element);
				return value === undefined ? [] : [value];
			});
			const values = [...new Set(staticValues)].sort(compareUnicodeCodePoints);
			return {
				values,
				unknown: array.elements.length - staticValues.length
			};
		};
		staticPathResolutionContext = (node) => isFilesystemPathExpression(node) ? "filesystem-expression" : "module-specifier";
		staticPath = (node) => {
			if (t.isStringLiteral(node)) return node.value;
			if (t.isTemplateLiteral(node) && node.expressions.length === 0) return stringValue(node);
			if (t.isBinaryExpression(node, { operator: "+" })) return staticConcatenation(node);
			if (t.isCallExpression(node) || t.isNewExpression(node)) return staticCallPath(node);
			return undefined;
		};
		staticConcatenation = (node) => {
			const operands = [];
			let current = node;
			while (t.isBinaryExpression(current, { operator: "+" })) {
				operands.push(current.right);
				current = current.left;
			}
			const anchored = isDirectoryPath(current);
			if (!anchored) operands.push(current);
			let text = "";
			for (const operand of operands.reverse()) {
				const value = staticPath(operand);
				if (value === undefined) return undefined;
				text += value;
			}
			if (!anchored) return text;
			return text.startsWith("/") ? posix.join(".", text) : undefined;
		};
		staticCallPath = (node) => {
			const name = calleeName(node.callee);
			if (name === "URL" || name.endsWith(".URL")) return isFileIdentity(argumentNode(node.arguments[1])) ? stringValue(node.arguments[0]) : undefined;
			if (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) {
				return staticFileUrlPath(node);
			}
			if (name.endsWith(".resolve")) return name === "win32.resolve" || name.endsWith(".win32.resolve") ? undefined : staticResolvedPath(node);
			if (!name.endsWith(".join") && name !== "join") return undefined;
			const parts = [];
			for (const argument of node.arguments) {
				if (isDirectoryIdentity(argumentNode(argument))) {
					parts.push(".");
					continue;
				}
				const value = t.isNode(argument) ? staticPath(argument) : undefined;
				if (value === undefined) return undefined;
				parts.push(value);
			}
			return parts.length === 0 ? undefined : posix.join(...parts);
		};
		staticFileUrlPath = (node) => {
			if (node.arguments.length !== 1) return undefined;
			const argument = argumentNode(node.arguments[0]);
			if (argument === undefined) return undefined;
			if (isSourceFileUrl(argument)) return sourceRelativeFileUrlPath(argument);
			const value = staticPath(argument);
			const rawPath = value?.split(/[?#]/u, 1)[0] ?? "";
			if (value === undefined || !/^file:/iu.test(value) || value !== value.trim() || value.includes("\\") || [...value].some((character) => character.charCodeAt(0) < 32) || /%(?:2f|5c)/iu.test(rawPath)) return undefined;
			try {
				const url = new URL(value);
				if (url.protocol !== "file:") return undefined;
				const path = fileURLToPath(url, { windows: false });
				return /^\/[a-z]:/iu.test(path) ? undefined : path;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		sourceRelativeFileUrlPath = (node) => {
			if (!isSourceFileUrl(node)) return undefined;
			const value = stringValue(node.arguments[0]);
			if (value === undefined || (value.split(/[?#]/u, 1)[0] ?? "") === "" || value !== value.trim() || value.includes("\\") || [...value].some((character) => character.charCodeAt(0) < 32) || /^[a-z][a-z0-9+.-]*:/iu.test(value) || value.startsWith("//") || /%(?:2e|2f|5c)/iu.test(value.split(/[?#]/u, 1)[0] ?? "")) return undefined;
			const directory = `/${"source/".repeat(value.split("/").length + 1)}`;
			try {
				const resolved = new URL(value, `file://${directory}entry.js`);
				const path = fileURLToPath(resolved, { windows: false });
				if (value.startsWith("/")) return path;
				const relative = posix.relative(directory, path) || ".";
				return value.startsWith("./") && relative !== "." && !relative.startsWith("../") ? `./${relative}` : relative;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		isSourceFileUrl = (node) => (t.isCallExpression(node) || t.isNewExpression(node)) && (calleeName(node.callee) === "URL" || calleeName(node.callee).endsWith(".URL")) && isFileIdentity(argumentNode(node.arguments[1]));
		staticResolvedPath = (node) => {
			const parts = [];
			for (const argument of node.arguments) {
				if (isDirectoryIdentity(argumentNode(argument))) {
					parts.push(null);
					continue;
				}
				const value = t.isNode(argument) ? staticPath(argument) : undefined;
				if (value === undefined) return undefined;
				parts.push(value);
			}
			const anchor = parts.findLastIndex((part) => part === null || posix.isAbsolute(part));
			if (anchor === -1) return undefined;
			const path = posix.join(...parts.slice(anchor).filter((part) => part !== null));
			return path === "/" ? path : path.replace(/\/$/u, "");
		};
		isFilesystemPathExpression = (node) => {
			if (t.isStringLiteral(node)) return node.value.startsWith("/");
			if (isFileIdentity(node) || isDirectoryIdentity(node)) return true;
			if (t.isBinaryExpression(node, { operator: "+" })) return isFilesystemPathExpression(node.left) || isFilesystemPathExpression(node.right);
			if (t.isCallExpression(node) || t.isNewExpression(node)) {
				const name = calleeName(node.callee);
				if (name.endsWith(".resolve") && staticCallPath(node) !== undefined) return true;
				if (name === "URL" || name.endsWith(".URL")) return isFileIdentity(argumentNode(node.arguments[1]));
				if (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) return staticFileUrlPath(node) !== undefined || node.arguments.some((argument) => {
					const value = argumentNode(argument);
					return value !== undefined && isFilesystemPathExpression(value);
				});
				return node.arguments.some((argument) => {
					const value = argumentNode(argument);
					return value !== undefined && isFilesystemPathExpression(value);
				});
			}
			return false;
		};
		isDirectoryIdentity = (node) => {
			if (isDirectoryPath(node)) return true;
			if (!t.isCallExpression(node) && !t.isNewExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "URL" || name.endsWith(".URL")) && isFileIdentity(argumentNode(node.arguments[1]));
		};
		isDirectoryPath = (node) => {
			if (t.isIdentifier(node, { name: "__dirname" })) return true;
			if (!t.isCallExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "dirname" || name.endsWith(".dirname")) && isFileIdentity(argumentNode(node.arguments[0]));
		};
		isImportMetaUrl = (node) => {
			if (node === undefined) return false;
			const expression = unwrapJavaScriptExpression(node).node;
			if (!t.isMemberExpression(expression)) return false;
			const object = unwrapJavaScriptExpression(expression.object).node;
			return t.isMetaProperty(object) && object.meta.name === "import" && object.property.name === "meta" && semanticStaticPropertyName(expression.property, expression.computed) === "url";
		};
		isFileIdentity = (node) => {
			if (t.isIdentifier(node, { name: "__filename" }) || isImportMetaUrl(node)) return true;
			if (!t.isCallExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) && isFileIdentity(argumentNode(node.arguments[0]));
		};
		XHR_METHODS = new Set([
			"CONNECT",
			"DELETE",
			"GET",
			"HEAD",
			"OPTIONS",
			"PATCH",
			"POST",
			"PUT",
			"TRACE"
		]);
		isRequestUrlOrPathLiteral = (value) => /^(?:https?|wss?):\/\//iu.test(value) || value.startsWith("/") || value.startsWith("./") || value.startsWith("../");
		isRequestUrlReference = (value) => {
			if (isRequestUrlOrPathLiteral(value) || value.startsWith("?") || value.startsWith("#")) return true;
			if (!/^(?:https?|wss?):/iu.test(value)) return false;
			return URL.parse(value) !== null;
		};
		WINDOW_OPEN_CALL = /(?:^|\.)(?:window|self|globalThis|top|parent|opener|frames|document)\.open$/u;
		FS_OPEN_FLAGS = new Set([
			"a",
			"a+",
			"as",
			"as+",
			"ax",
			"ax+",
			"r",
			"r+",
			"rs",
			"rs+",
			"sa",
			"sa+",
			"sr",
			"sr+",
			"w",
			"w+",
			"wx",
			"wx+",
			"xa",
			"xa+",
			"xw",
			"xw+"
		]);
		BROWSING_CONTEXT_KEYWORDS = new Set([
			"_blank",
			"_parent",
			"_self",
			"_top"
		]);
		xhrOpenUrl = (name, methodNode, urlNode, receiverFact) => {
			const url = stringValue(urlNode);
			if (url === undefined) return undefined;
			if (receiverFact === "window") return undefined;
			const method = stringValue(methodNode);
			const storage = receiverFact === "local-indexed-db" || receiverFact === "local-cache-storage" || receiverFact === "indexed-db" || receiverFact === "cache-storage" || storageKind(name) !== undefined;
			if (method === undefined) return storage || receiverFact === undefined && WINDOW_OPEN_CALL.test(name) || FS_OPEN_FLAGS.has(url) || BROWSING_CONTEXT_KEYWORDS.has(url.toLowerCase()) ? undefined : url;
			return XHR_METHODS.has(method.toUpperCase()) || (!storage || receiverFact === "local-indexed-db" || receiverFact === "local-cache-storage") && /^[A-Z][A-Z-]*$/u.test(method) ? url : undefined;
		};
		KEYED_COLLECTION_CONSTRUCTORS = new Set([
			"FormData",
			"Headers",
			"Map",
			"Set",
			"URLSearchParams",
			"WeakMap",
			"WeakSet"
		]);
		isKeyedCollectionReceiver = (callee) => {
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return false;
			const receiver = callee.object;
			if (t.isNewExpression(receiver)) return t.isIdentifier(receiver.callee) && KEYED_COLLECTION_CONSTRUCTORS.has(receiver.callee.name);
			if (!t.isMemberExpression(receiver) && !t.isOptionalMemberExpression(receiver)) return false;
			const property = semanticStaticPropertyName(receiver.property, receiver.computed);
			return property === "headers" || property === "headersList" || property === "searchParams";
		};
		endpointArgument = (name, args, callee, receiverFact) => {
			const literal = (value) => value === undefined ? undefined : {
				kind: "endpoint",
				value
			};
			if (receiverFact === "window") return undefined;
			if (name === "fetch" || name.endsWith(".fetch") || name === "WebSocket" || name === "EventSource" || name.endsWith(".EventSource")) return literal(stringValue(args[0]));
			if (name.endsWith(".open")) {
				const value = xhrOpenUrl(name, args[0], args[1], receiverFact);
				if (value === undefined) return undefined;
				return {
					kind: stringValue(args[0]) !== undefined || isRequestUrlReference(value) ? "endpoint" : "candidate",
					value
				};
			}
			const method = [
				"get",
				"post",
				"put",
				"patch",
				"delete",
				"request"
			].find((candidate) => name === candidate || name.endsWith(`.${candidate}`));
			if (method !== undefined) {
				const value = stringValue(args[0]);
				if (value === undefined) return undefined;
				if ((method === "get" || method === "delete") && !isRequestUrlOrPathLiteral(value) && (isKeyedCollectionReceiver(callee) || method === "get" && (receiverFact === "configuration" || receiverFact === "extension-state"))) return undefined;
				return {
					kind: isRequestUrlReference(value) ? "endpoint" : "candidate",
					value
				};
			}
			if (name === "sendBeacon" || name.endsWith(".sendBeacon")) return literal(stringValue(args[0]));
			if (name === "loadURL" || name.endsWith(".loadURL")) return literal(stringValue(args[0]));
			return undefined;
		};
		storageKind = (name) => {
			if (name.includes("localStorage.")) return "local-storage";
			if (name.includes("sessionStorage.")) return "session-storage";
			if (name.endsWith("indexedDB.open")) return "indexed-db";
			if (name.endsWith("caches.open")) return "cache-storage";
			if (name === "Database" || name.endsWith(".Database")) return "sqlite";
			return undefined;
		};
		calleeName = (node) => {
			const segments = [];
			while (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				segments.push(memberPropertyName(node));
				if (!t.isNode(node.object)) break;
				node = node.object;
			}
			const base = t.isIdentifier(node) ? node.name : t.isImport(node) ? "import" : "";
			segments.push(base);
			segments.reverse();
			const first = segments.findIndex((segment) => segment !== "");
			return first === -1 ? "" : segments.slice(first).join(".");
		};
		memberPropertyName = (node) => node.computed && !t.isStringLiteral(node.property) && !t.isNumericLiteral(node.property) ? `[computed@${String(node.property.start ?? -1)}]` : semanticStaticPropertyName(node.property, node.computed);
		stringValue = (node) => {
			if (node === null || node === undefined) return undefined;
			const literal = readExactJavaScriptLiteral(node);
			return literal.found && typeof literal.value === "string" ? literal.value : undefined;
		};
		argumentValue = (node) => t.isNumericLiteral(node) ? String(node.value) : stringValue(node);
		prefixedArgument = (prefix, node) => {
			const value = argumentValue(node);
			return value === undefined ? undefined : `${prefix}${value}`;
		};
		sourceSlice = (source, node) => typeof node.start !== "number" || typeof node.end !== "number" ? "" : source.slice(node.start, node.end);
		range = (node) => ({
			start: {
				line: node.loc?.start.line ?? 1,
				column: node.loc?.start.column ?? 0
			},
			end: {
				line: node.loc?.end.line ?? node.loc?.start.line ?? 1,
				column: node.loc?.end.column ?? node.loc?.start.column ?? 0
			}
		});
		rangeForOffsets = (source, start, end) => ({
			start: pointForOffset(source, start),
			end: pointForOffset(source, end)
		});
		sourceRangesEqual = (left, right) => left !== null && left.start.line === right.start.line && left.start.column === right.start.column && left.end.line === right.end.line && left.end.column === right.end.column;
		pointForOffset = (source, offset) => {
			const before = source.slice(0, offset);
			const lines = before.split(/\r\n|[\n\r\u2028\u2029]/u);
			return {
				line: lines.length,
				column: lines.at(-1)?.length ?? 0
			};
		};
		detectVendors = (source) => vendorPatterns.flatMap(({ name, patterns }) => patterns.some((pattern) => source.includes(pattern)) ? [name] : []);
		registrationKey = (registration) => compositeKey([
			registration.runtime,
			registration.chunk_keys,
			String(registration.unknown_chunk_keys),
			registration.runtime_require_name,
			registration.runtime_module_cache_status,
			registration.entry_module_keys,
			String(registration.unknown_entry_module_keys),
			registration.async_chunk_keys,
			String(registration.unknown_async_chunk_keys),
			registration.modules.map(({ module_key: key, source_sha256: digest }) => [key, digest])
		]);
		sortedUnique = (values, key) => [...new Map(values.map((value) => [key(value), value])).values()].sort((left, right) => compareUnicodeCodePoints(key(left), key(right)));
		sha256Text = (value) => createHash("sha256").update(value).digest("hex");
		STATIC_ROUTE_CALL_NAMES = [
			"route",
			"addRoute",
			"useRoutes",
			"createBrowserRouter",
			"createHashRouter"
		];
		vendorPatterns = [
			{
				name: "webpack",
				patterns: ["__webpack_require__", "webpackChunk"]
			},
			{
				name: "Rspack",
				patterns: ["__webpack_require__.f", "rspackChunk"]
			},
			{
				name: "Vite",
				patterns: ["__vite__", "import.meta.hot"]
			},
			{
				name: "Rollup",
				patterns: ["ROLLUP_FILE_URL", "import.meta.ROLLUP"]
			},
			{
				name: "esbuild",
				patterns: ["__commonJS", "__esm"]
			},
			{
				name: "React",
				patterns: ["React.createElement", "react/jsx-runtime"]
			},
			{
				name: "Vue",
				patterns: ["__VUE__", "createApp("]
			},
			{
				name: "Next.js",
				patterns: ["__NEXT_DATA__", "/_next/"]
			},
			{
				name: "Angular",
				patterns: ["ɵɵdefineComponent"]
			},
			{
				name: "Svelte",
				patterns: ["svelte/internal"]
			}
		];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMutationInitializers.js
var initializerPositionCaches, initializerPositionCache, statementPosition, positionPrecedes, semanticTopLevelEffectFollowsCapture, expressionEvaluationPrecedes, computeDirectInitializerPosition, directInitializerPosition, computeDirectMutationPosition, directMutationPosition, computeReferenceInitializerPosition, referenceInitializerPosition, semanticMutationInitializers, semanticReadInitializers, selectInitializers, semanticCapturePosition, semanticBindingPrecedesCapture, semanticEscapeFollowsCapture;
function init_javascriptSemanticMutationInitializers() {
	return (init_javascriptSemanticMutationInitializers = __esmMin((() => {
		init_javascriptAstValues();
		initializerPositionCaches = new WeakMap();
		initializerPositionCache = (parents) => {
			const cached = initializerPositionCaches.get(parents);
			if (cached !== undefined) return cached;
			const created = {
				direct: new WeakMap(),
				mutation: new WeakMap(),
				reference: new WeakMap()
			};
			initializerPositionCaches.set(parents, created);
			return created;
		};
		statementPosition = (statement, parents, declarator) => {
			const parent = parents.get(statement);
			if (!t.isProgram(parent) && !t.isBlockStatement(parent)) return null;
			const index = parent.body.indexOf(statement);
			return index < 0 ? null : {
				body: parent.body,
				index,
				declaratorIndex: t.isVariableDeclaration(statement) && declarator !== undefined ? statement.declarations.indexOf(declarator) : -1
			};
		};
		positionPrecedes = (left, right) => left.body === right.body && (left.index < right.index || left.index === right.index && left.declaratorIndex >= 0 && left.declaratorIndex < right.declaratorIndex);
		semanticTopLevelEffectFollowsCapture = (capture, effect, parents) => {
			const position = (node) => {
				let selected = null;
				let declarator;
				let child;
				while (node !== undefined) {
					if (t.isFunction(node) || t.isLoop(node)) return null;
					if ((t.isClassProperty(node) || t.isClassPrivateProperty(node) || t.isClassAccessorProperty(node)) && !node.static && node.value === child) return null;
					if (t.isVariableDeclarator(node)) declarator = node;
					if (selected === null && t.isStatement(node)) selected = statementPosition(node, parents, declarator);
					if (t.isProgram(node)) return selected;
					child = node;
					node = parents.get(node);
				}
				return null;
			};
			const before = position(capture);
			const after = position(effect);
			if (before === null || after === null) return false;
			if (positionPrecedes(before, after)) return true;
			if (before.body !== after.body || before.index !== after.index || before.declaratorIndex !== after.declaratorIndex) return false;
			return expressionEvaluationPrecedes(capture, effect, parents);
		};
		expressionEvaluationPrecedes = (earlier, later, parents) => {
			if (later === undefined) return false;
			const earlierAncestors = new Set();
			let current = earlier;
			while (current !== undefined) {
				earlierAncestors.add(current);
				current = parents.get(current);
			}
			const laterPath = [];
			current = later;
			while (current !== undefined && !earlierAncestors.has(current)) {
				laterPath.push(current);
				current = parents.get(current);
			}
			const common = current;
			if (common === undefined || common === earlier || common === later) return false;
			let earlierChild = earlier;
			while (parents.get(earlierChild) !== common) {
				const parent = parents.get(earlierChild);
				if (parent === undefined) return false;
				earlierChild = parent;
			}
			const laterChild = laterPath.at(-1);
			if (laterChild === undefined) return false;
			const orderedChildren = (() => {
				if (t.isSequenceExpression(common)) return common.expressions;
				if (t.isCallExpression(common) || t.isOptionalCallExpression(common)) return [common.callee, ...common.arguments];
				if (t.isNewExpression(common)) return [common.callee, ...common.arguments];
				if (t.isBinaryExpression(common) || t.isLogicalExpression(common)) return [common.left, common.right];
				if (t.isConditionalExpression(common)) return [common.test];
				return null;
			})();
			if (orderedChildren === null) return false;
			const earlierIndex = orderedChildren.indexOf(earlierChild);
			const laterIndex = orderedChildren.indexOf(laterChild);
			return earlierIndex >= 0 && laterIndex > earlierIndex;
		};
		computeDirectInitializerPosition = (node, parents) => {
			const parent = parents.get(node);
			if (t.isVariableDeclarator(parent) && parent.init === node) {
				const declaration = parents.get(parent);
				return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
			}
			if (t.isAssignmentExpression(parent) && parent.operator === "=" && parent.right === node && t.isIdentifier(parent.left)) {
				const statement = parents.get(parent);
				return t.isExpressionStatement(statement) && statement.expression === parent ? statementPosition(statement, parents) : null;
			}
			return null;
		};
		directInitializerPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.direct.get(node);
			if (cached !== undefined) return cached;
			const computed = computeDirectInitializerPosition(node, parents);
			cache.direct.set(node, computed);
			return computed;
		};
		computeDirectMutationPosition = (node, parents) => {
			if (t.isForOfStatement(node)) return statementPosition(node, parents);
			if (t.isVariableDeclarator(node)) {
				const declaration = parents.get(node);
				return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, node) : null;
			}
			if (t.isSpreadElement(node)) {
				const array = parents.get(node);
				return t.isArrayExpression(array) ? semanticCapturePosition(array, parents) : null;
			}
			if (!t.isAssignmentExpression(node) && !t.isUpdateExpression(node) && !t.isUnaryExpression(node, { operator: "delete" }) && !t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node) && !t.isTaggedTemplateExpression(node)) return null;
			let current = node;
			while (true) {
				const parent = parents.get(current);
				if (parent === undefined || t.isFunction(parent) || t.isLogicalExpression(parent) && parent.right === current || t.isConditionalExpression(parent) && parent.test !== current) return null;
				if (t.isStatement(parent)) return statementPosition(parent, parents);
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
				}
				current = parent;
			}
		};
		directMutationPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.mutation.get(node);
			if (cached !== undefined) return cached;
			const computed = computeDirectMutationPosition(node, parents);
			cache.mutation.set(node, computed);
			return computed;
		};
		computeReferenceInitializerPosition = (node, parents) => {
			let current = node;
			while (true) {
				const direct = directInitializerPosition(current, parents);
				if (direct !== null) return direct;
				const parent = parents.get(current);
				if (parent === undefined || t.isStatement(parent) || t.isFunction(parent)) return null;
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
				}
				current = parent;
			}
		};
		referenceInitializerPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.reference.get(node);
			if (cached !== undefined) return cached;
			const computed = computeReferenceInitializerPosition(node, parents);
			cache.reference.set(node, computed);
			return computed;
		};
		semanticMutationInitializers = (binding, mutation, parents) => {
			const mutationPosition = directMutationPosition(mutation, parents) ?? referenceInitializerPosition(mutation, parents);
			if (mutationPosition === null) return binding;
			const origins = [...binding.initializers.map((initializer) => ({
				initializer,
				position: initializer.entryBody === undefined ? directInitializerPosition(initializer.node, parents) : {
					body: initializer.entryBody.body,
					index: -1,
					declaratorIndex: -1
				}
			})), ...binding.referenceInitializers.map((initializer) => ({
				initializer,
				position: referenceInitializerPosition(initializer.node, parents)
			}))];
			if (origins.some(({ position }) => position === null || !positionPrecedes(position, mutationPosition))) return binding;
			const latest = origins.reduce((latest, { position }) => position !== null && (latest === null || positionPrecedes(latest, position)) ? position : latest, null);
			const retained = new Set(origins.filter(({ position }) => position?.index === latest?.index && position?.declaratorIndex === latest?.declaratorIndex).map(({ initializer }) => initializer));
			return {
				directOrigins: origins.length === 0 ? binding.directOrigins : [],
				initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
				referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer))
			};
		};
		semanticReadInitializers = (binding, read, parents) => {
			let position = null;
			let current = read;
			for (let parent = parents.get(current); parent; parent = parents.get(current)) {
				if (t.isLoop(parent)) return binding;
				if (t.isFunction(parent)) break;
				if (position === null) {
					if (t.isVariableDeclarator(parent)) {
						const declaration = parents.get(parent);
						if (t.isVariableDeclaration(declaration)) position = statementPosition(declaration, parents, parent);
					} else if (t.isStatement(parent)) position = statementPosition(parent, parents);
				}
				current = parent;
			}
			return selectInitializers(binding, position, parents, true);
		};
		selectInitializers = (binding, position, parents, atRead = false) => {
			if (position === null) return binding;
			const origins = [...binding.initializers.map((initializer) => ({
				initializer,
				position: initializer.entryBody === undefined ? directInitializerPosition(initializer.node, parents) : {
					body: initializer.entryBody.body,
					index: -1,
					declaratorIndex: -1
				}
			})), ...binding.referenceInitializers.map((initializer) => ({
				initializer,
				position: referenceInitializerPosition(initializer.node, parents)
			}))];
			if (origins.some(({ position: origin }) => origin === null || origin.body !== position.body || !atRead && !positionPrecedes(origin, position))) return binding;
			const preceding = atRead ? origins.filter(({ position: origin }) => origin !== null && positionPrecedes(origin, position)) : origins;
			const latest = preceding.reduce((latest, { position }) => position !== null && (latest === null || positionPrecedes(latest, position)) ? position : latest, null);
			const retained = new Set(preceding.filter(({ position }) => position?.index === latest?.index && position?.declaratorIndex === latest?.declaratorIndex).map(({ initializer }) => initializer));
			if (binding.initializers.every((initializer) => retained.has(initializer)) && binding.referenceInitializers.every((initializer) => retained.has(initializer))) return binding;
			return {
				initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
				referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer))
			};
		};
		semanticCapturePosition = (node, parents) => {
			let current = node;
			while (true) {
				const direct = directInitializerPosition(current, parents);
				if (direct !== null) return direct;
				const parent = parents.get(current);
				if (t.isObjectProperty(parent) && parent.value === current && semanticStaticPropertyKey(parent.key, parent.computed) !== null) current = parent;
				else if (t.isObjectExpression(parent) || t.isArrayExpression(parent)) current = parent;
				else return null;
			}
		};
		semanticBindingPrecedesCapture = (binding, capture, parents) => {
			const initializer = binding.initializers[0];
			if (binding.initializers.length !== 1 || initializer === undefined) return false;
			const sourcePosition = directInitializerPosition(initializer.node, parents);
			const capturePosition = semanticCapturePosition(capture, parents);
			return sourcePosition !== null && capturePosition !== null && positionPrecedes(sourcePosition, capturePosition);
		};
		semanticEscapeFollowsCapture = (binding, capture, escape, parents) => {
			const initializer = binding.initializers[0];
			if (escape === undefined || initializer === undefined || !semanticBindingPrecedesCapture(binding, capture, parents)) return false;
			const origin = unwrapJavaScriptExpression(initializer.node).node;
			if (!t.isObjectExpression(origin) && !t.isArrayExpression(origin) && !t.isIdentifier(origin) && !t.isMemberExpression(origin) && !t.isOptionalMemberExpression(origin)) return false;
			const capturePosition = semanticCapturePosition(capture, parents);
			const escapePosition = directMutationPosition(escape, parents);
			return capturePosition !== null && escapePosition !== null && positionPrecedes(capturePosition, escapePosition);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptElectronMemberWrites.js
/**
* Index writes through possible lexical object identities. Resolve the complete
* object before appending the written key: self-reference properties can denote
* the same object, while replacing that property is a distinct write.
*/
function* collectJavaScriptIdentityWritesSteps(program, origin, intrinsicInvocation, staticString, freshObject, retain) {
	const objectMutators = new Set([
		"defineProperty",
		"defineProperties",
		"assign",
		"setPrototypeOf"
	]);
	const reflectMutators = new Set([
		"set",
		"deleteProperty",
		"defineProperty",
		"setPrototypeOf"
	]);
	const keyedMutators = new Set([
		"set",
		"deleteProperty",
		"defineProperty"
	]);
	yield* traverseJavaScriptAstSteps(program, { enter: (node) => {
		if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
			const invocation = intrinsicInvocation(node);
			if (invocation?.kind === "opaque") {
				for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
				return;
			}
			const callee = invocation?.path;
			const arguments_ = invocation?.arguments;
			const method = callee?.at(-1);
			const owner = callee?.length === 3 ? callee[1] : undefined;
			if (owner === "Object" && objectMutators.has(method ?? "") || owner === "Reflect" && reflectMutators.has(method ?? "")) {
				const targets = owner === "Reflect" && method === "set" && arguments_ !== undefined && (arguments_.length >= 4 || arguments_.some(t.isSpreadElement)) ? [arguments_[0], arguments_.some(t.isSpreadElement) ? undefined : arguments_[3]] : [arguments_?.[0]];
				for (const target of targets) {
					if (target === undefined || t.isSpreadElement(target)) {
						for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
					}
					if (t.isNode(target) && !t.isSpreadElement(target)) {
						const identities = origin(target, "member", node);
						if (identities.length > 0) {
							const key = keyedMutators.has(method ?? "") ? [staticString(arguments_?.[1]) ?? null] : [];
							for (const identity of identities) retain(node, [...identity, ...key]);
						} else if (!freshObject(target)) {
							for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
						}
					}
				}
			}
		}
		const target = semanticWriteSiteTarget(node);
		if (target === null) return;
		for (const leaf of semanticWriteTargets(target)) {
			if (t.isIdentifier(leaf)) {
				for (const identity of origin(leaf, "binding", node)) retain(node, identity);
				continue;
			}
			const member = unwrapJavaScriptExpression(leaf).node;
			if (!t.isMemberExpression(member) && !t.isOptionalMemberExpression(member)) continue;
			const key = semanticStaticPropertyKey(member.property, member.computed);
			for (const identity of origin(member.object, "member", node)) retain(node, [...identity, key]);
		}
	} });
}
var ELECTRON_MODULE, electronExportPath, ELECTRON_IDENTITY_LIMITATION, electronMemberPath;
function init_javascriptElectronMemberWrites() {
	return (init_javascriptElectronMemberWrites = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticTraversal();
		ELECTRON_MODULE = /^electron(?:\/(?:common|main|renderer|utility))?$/u;
		electronExportPath = (importedPath) => importedPath[0] === "default" ? importedPath.slice(1) : importedPath;
		ELECTRON_IDENTITY_LIMITATION = "Electron API identity follows proven lexical module aliases and structurally verified module-namespace interop. Other reassignments, dynamic selections, and visibly overwritten namespace members are unresolved; missing findings do not establish absence. Arbitrary call side effects and runtime registration are not evaluated.";
		electronMemberPath = (node) => {
			let root = unwrapJavaScriptExpression(node).node;
			const members = [];
			while (t.isMemberExpression(root) || t.isOptionalMemberExpression(root)) {
				members.push(semanticStaticPropertyKey(root.property, root.computed));
				root = unwrapJavaScriptExpression(root.object).node;
			}
			return {
				root,
				members: members.toReversed()
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptIntrinsicInvocation.js
var expandJavaScriptInvocationArguments, arrayArguments, invocationArguments, resolveJavaScriptIntrinsicInvocation;
function init_javascriptIntrinsicInvocation() {
	return (init_javascriptIntrinsicInvocation = __esmMin((() => {
		init_javascriptAstValues();
		expandJavaScriptInvocationArguments = (arguments_) => {
			const expanded = [];
			const pending = [...arguments_].reverse();
			while (pending.length > 0) {
				const argument = pending.pop();
				if (argument === undefined) break;
				const array = t.isSpreadElement(argument) ? unwrapJavaScriptExpression(argument.argument).node : undefined;
				if (t.isArrayExpression(array) && array.elements.every((element) => t.isExpression(element) || t.isSpreadElement(element))) for (let index = array.elements.length - 1; index >= 0; index -= 1) {
					const element = array.elements[index];
					if (element !== null && element !== undefined) pending.push(element);
				}
				else expanded.push(argument);
			}
			return expanded;
		};
		arrayArguments = (node) => {
			const array = node === undefined ? undefined : unwrapJavaScriptExpression(node).node;
			if (!t.isArrayExpression(array) || array.elements.some((element) => element === null)) return undefined;
			const expanded = expandJavaScriptInvocationArguments(array.elements.filter((element) => element !== null));
			return expanded.every((element) => t.isExpression(element)) ? expanded.filter((element) => t.isExpression(element)) : undefined;
		};
		invocationArguments = (method, arguments_) => t.isSpreadElement(arguments_?.[0]) ? undefined : method === "apply" ? arrayArguments(arguments_?.[1]) : arguments_?.slice(1);
		resolveJavaScriptIntrinsicInvocation = (node, intrinsicPath, boundIntrinsic, intrinsicReadChanged) => {
			const visited = new Set();
			let callee = node.callee;
			let arguments_ = expandJavaScriptInvocationArguments(node.arguments);
			let receiver;
			let explicitReceiver = false;
			for (;;) {
				callee = unwrapJavaScriptExpression(callee).node;
				if (t.isSequenceExpression(callee)) {
					const finalExpression = callee.expressions.at(-1);
					if (finalExpression === undefined) return undefined;
					explicitReceiver = true;
					callee = finalExpression;
					continue;
				}
				if (visited.has(callee)) return undefined;
				visited.add(callee);
				let path = intrinsicPath(callee);
				if (path !== undefined && intrinsicReadChanged(callee, path)) return {
					kind: "opaque",
					path,
					arguments: undefined
				};
				if (path === undefined) {
					if (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) {
						const method = semanticStaticPropertyKey(callee.property, callee.computed);
						if (method === "call" || method === "apply") {
							const bound = boundIntrinsic(callee.object);
							if (bound !== undefined && intrinsicReadChanged(callee, [...bound.path, method])) return {
								kind: "opaque",
								path: bound.path,
								arguments: undefined
							};
							receiver = arguments_?.[0];
							explicitReceiver = true;
							callee = callee.object;
							arguments_ = invocationArguments(method, arguments_);
							continue;
						}
					}
					const bound = boundIntrinsic(callee);
					if (bound === undefined) return undefined;
					if (bound.kind === "opaque") return bound;
					path = bound.path;
					receiver = bound.receiver;
					explicitReceiver = true;
					arguments_ = bound.arguments === undefined ? undefined : [...bound.arguments, ...arguments_ ?? []];
				}
				const method = path.length > 3 ? path.at(-1) : undefined;
				if (method === "call" || method === "apply") {
					const callable = explicitReceiver ? receiver : t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee) ? callee.object : undefined;
					if (!t.isExpression(callable)) return {
						kind: "opaque",
						path,
						arguments: undefined
					};
					callee = callable;
					receiver = arguments_?.[0];
					explicitReceiver = true;
					arguments_ = invocationArguments(method, arguments_);
					continue;
				}
				if (path.join(".") === "intrinsic.Reflect.apply") {
					const callable = arguments_?.[0];
					if (!t.isExpression(callable)) return undefined;
					callee = callable;
					receiver = arguments_?.[1];
					explicitReceiver = true;
					arguments_ = arrayArguments(arguments_?.[2]);
					continue;
				}
				return {
					kind: "known",
					path,
					arguments: arguments_,
					...receiver === undefined ? {} : { receiver }
				};
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptModuleInterop.js
var TO_ESM, COPY_PROPS, INTRINSICS, createSemanticModuleInterop, identityFunction, unprojectedInitializer, canonicalRoles, controlBodyOperation;
function init_javascriptModuleInterop() {
	return (init_javascriptModuleInterop = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticTraversal();
		init_javascriptElectronMemberWrites();
		init_javascriptIntrinsicInvocation();
		init_javascriptSemanticPropertyPaths();
		init_javascriptAstValues();
		TO_ESM = parseExpression(`(mod, isNodeMode, target) => (
  target = mod != null ? __create(__getProtoOf(mod)) : {},
  __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default")
    ? __defProp(target, "default", {value: mod, enumerable: true}) : target, mod)
)`);
		COPY_PROPS = parseExpression(`(to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function")
    for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
  return to;
}`);
		INTRINSICS = {
			__create: ["Object", "create"],
			__getProtoOf: ["Object", "getPrototypeOf"],
			__defProp: ["Object", "defineProperty"],
			__getOwnPropNames: ["Object", "getOwnPropertyNames"],
			__getOwnPropDesc: ["Object", "getOwnPropertyDescriptor"],
			__hasOwnProp: [
				"Object",
				"prototype",
				"hasOwnProperty"
			]
		};
		createSemanticModuleInterop = (state, options) => {
			const helpers = new Map();
			const origins = new Map();
			const calls = new WeakMap();
			const intrinsicBindings = new Map();
			const writes = [];
			const invalidatedBindings = new Map();
			const invalidatedCalls = new WeakMap();
			const opaqueMutationPath = (node) => {
				let current = node;
				while (current !== undefined) {
					if (t.isFunction(current)) return ["opaque-intrinsic", semanticScopeId("function", current)];
					current = state.parentsByNode.get(current);
				}
				return ["intrinsic"];
			};
			const intrinsicPath = options?.intrinsicPath ?? ((node) => {
				let current = node;
				const visited = new Set();
				const pending = [];
				let suffix = [];
				const finish = (path) => {
					for (const binding of pending) intrinsicBindings.set(binding.id, path === undefined ? null : path.slice(0, path.length - binding.suffixLength));
					return path;
				};
				for (;;) {
					const { root, members } = electronMemberPath(current);
					if (members.some((member) => member === null)) return finish(undefined);
					suffix = [...members, ...suffix];
					for (const global of [
						"Object",
						"Function",
						"Reflect"
					]) if (isUnshadowedGlobal(root, state, global)) return finish([
						"intrinsic",
						global,
						...suffix
					]);
					for (const global of [
						"globalThis",
						"global",
						"window",
						"self"
					]) if (isUnshadowedGlobal(root, state, global)) return finish(["intrinsic", ...suffix]);
					if (!t.isIdentifier(root)) return finish(undefined);
					const binding = resolveSemanticBindingState(state, root, root.name);
					const cached = binding === undefined ? undefined : intrinsicBindings.get(binding.bindingId);
					if (cached !== undefined) return finish(cached === null ? undefined : [...cached, ...suffix]);
					const initializer = semanticStableInitializer(binding, state);
					if (binding === undefined || initializer === undefined || initializer.projection.some((segment) => segment === null) || visited.has(binding.bindingId)) return finish(undefined);
					visited.add(binding.bindingId);
					pending.push({
						id: binding.bindingId,
						suffixLength: suffix.length
					});
					suffix = [...initializer.projection.map(String), ...suffix];
					current = initializer.node;
				}
			});
			const capturedIntrinsic = (node) => {
				const path = intrinsicPath(node);
				if (path === undefined) return undefined;
				const visited = new Set();
				let current = node;
				let capturedAt = node;
				let suffixLength = 0;
				for (;;) {
					const { root, members } = electronMemberPath(current);
					suffixLength += members.length;
					if (!t.isIdentifier(root)) return undefined;
					const binding = resolveSemanticBindingState(state, root, root.name);
					if (binding === undefined) return {
						path,
						capturedAt
					};
					const initializer = semanticStableInitializer(binding, state);
					if (initializer === undefined || (initializer.node.end ?? Infinity) >= (root.start ?? -1) || visited.has(binding.bindingId)) return undefined;
					visited.add(binding.bindingId);
					if (suffixLength === 0) capturedAt = initializer.node;
					suffixLength += initializer.projection.length;
					current = initializer.node;
				}
			};
			const staticString = (node) => {
				if (node === undefined) return undefined;
				const visited = new Set();
				let current = node;
				for (;;) {
					const literal = readExactJavaScriptLiteral(current);
					if (literal.found) return typeof literal.value === "string" ? literal.value : undefined;
					const expression = unwrapJavaScriptExpression(current).node;
					if (!t.isIdentifier(expression)) return undefined;
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					const initializer = semanticStableInitializer(binding, state);
					if (binding === undefined || initializer === undefined || initializer.projection.length !== 0 || (initializer.node.end ?? Infinity) >= (expression.start ?? -1) || visited.has(binding.bindingId)) return undefined;
					visited.add(binding.bindingId);
					current = initializer.node;
				}
			};
			const intrinsicReadChanged = (node, path) => {
				const capture = capturedIntrinsic(node)?.capturedAt ?? node;
				const scope = opaqueMutationPath(capture).join(".");
				const method = path.at(-1);
				const invocationMethod = method === "bind" || method === "call" || method === "apply";
				return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capture.start ?? -1) && (write.coverage.covers(path) || invocationMethod && write.coverage.covers([
					"intrinsic",
					"Function",
					"prototype",
					method
				])));
			};
			const resolveBoundIntrinsic = (node) => {
				const visited = new Set();
				const argumentGroups = [];
				const bindReads = [];
				let opaqueArguments = false;
				let receiver;
				let current = node;
				for (;;) {
					current = unwrapJavaScriptExpression(current).node;
					if (t.isIdentifier(current)) {
						const binding = resolveSemanticBindingState(state, current, current.name);
						const initializer = semanticStableInitializer(binding, state);
						if (binding === undefined || initializer === undefined || initializer.projection.length !== 0 || (initializer.node.end ?? Infinity) >= (current.start ?? -1) || visited.has(binding.bindingId)) return undefined;
						visited.add(binding.bindingId);
						current = initializer.node;
						continue;
					}
					if (!t.isCallExpression(current)) return undefined;
					const { root, members } = electronMemberPath(current.callee);
					let bindTarget = root;
					let bindingArguments = expandJavaScriptInvocationArguments(current.arguments);
					let captured = capturedIntrinsic(current.callee);
					let terminal = captured?.path.at(-1) === "bind";
					let path = captured?.path.slice(0, -1);
					if (members.at(-1) === "bind") {
						if (!terminal && members.length !== 1) return undefined;
						bindReads.push(captured?.capturedAt ?? current.callee);
					} else {
						const invocation = resolveJavaScriptIntrinsicInvocation(current, intrinsicPath, boundIntrinsic, intrinsicReadChanged);
						if (invocation?.kind !== "known" || invocation.path.join(".") !== "intrinsic.Function.prototype.bind" || invocation.receiver === undefined) return undefined;
						bindTarget = invocation.receiver;
						bindingArguments = invocation.arguments;
						captured = capturedIntrinsic(bindTarget);
						terminal = captured !== undefined;
						path = captured?.path;
					}
					receiver = bindingArguments?.[0];
					const ownArguments = bindingArguments?.slice(1) ?? [];
					opaqueArguments ||= bindingArguments === undefined || t.isSpreadElement(receiver);
					opaqueArguments ||= ownArguments.some((argument) => t.isSpreadElement(argument));
					argumentGroups.push(ownArguments);
					if (!terminal || path === undefined) {
						current = bindTarget;
						continue;
					}
					const boundPath = [...path, "bind"];
					const functionBind = [
						"intrinsic",
						"Function",
						"prototype",
						"bind"
					];
					opaqueArguments ||= bindReads.some((capture) => {
						const scope = opaqueMutationPath(capture).join(".");
						return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capture.start ?? -1) && (write.coverage.covers(boundPath) || write.coverage.covers(functionBind)));
					});
					return {
						kind: opaqueArguments ? "opaque" : "known",
						path,
						...receiver === undefined ? {} : { receiver },
						arguments: opaqueArguments ? undefined : argumentGroups.toReversed().flat()
					};
				}
			};
			const activeBoundValues = new WeakSet();
			const boundIntrinsic = (node) => {
				if (activeBoundValues.has(node)) return undefined;
				activeBoundValues.add(node);
				try {
					return resolveBoundIntrinsic(node);
				} finally {
					activeBoundValues.delete(node);
				}
			};
			const isFreshObject = (node) => {
				const visited = new Set();
				let current = node;
				for (;;) {
					current = unwrapJavaScriptExpression(current).node;
					if (t.isObjectExpression(current) || t.isArrayExpression(current) || t.isFunction(current) || t.isClass(current) && !current.decorators?.length || t.isRegExpLiteral(current)) return true;
					if (!t.isIdentifier(current)) return false;
					const binding = resolveSemanticBindingState(state, current, current.name);
					const initializer = unprojectedInitializer(binding, state);
					if (binding === undefined || initializer === undefined || !t.isFunctionDeclaration(initializer) && (initializer.end ?? Infinity) >= (current.start ?? -1) || visited.has(binding.bindingId)) return false;
					visited.add(binding.bindingId);
					current = initializer;
				}
			};
			const helperProof = (binding) => {
				const cached = helpers.get(binding.bindingId);
				if (cached !== undefined) return cached ?? undefined;
				helpers.set(binding.bindingId, null);
				if (state.scopesById.get(binding.scopeId)?.kind !== "program") return undefined;
				const wrapper = unprojectedInitializer(binding, state);
				if (wrapper === undefined) return undefined;
				if (identityFunction(wrapper, state)) {
					const proof = {
						dependencies: [],
						readyAfter: t.isFunctionDeclaration(wrapper) ? -1 : wrapper.end ?? Infinity,
						identity: true
					};
					helpers.set(binding.bindingId, proof);
					return proof;
				}
				const wrapperRoles = canonicalRoles(wrapper, TO_ESM, state);
				const copyBinding = wrapperRoles?.get("__copyProps");
				const copy = unprojectedInitializer(copyBinding, state);
				const copyRoles = copy === undefined ? undefined : canonicalRoles(copy, COPY_PROPS, state);
				if (wrapperRoles === undefined || copyRoles === undefined || copy === undefined) return undefined;
				const dependencies = [];
				let readyAfter = Math.max(wrapper.end ?? Infinity, copy.end ?? Infinity);
				for (const roles of [wrapperRoles, copyRoles]) for (const [role, dependency] of roles) {
					const expected = INTRINSICS[role];
					if (expected === undefined) continue;
					const initializer = unprojectedInitializer(dependency, state);
					const captured = initializer === undefined ? undefined : capturedIntrinsic(initializer);
					if (initializer === undefined || captured === undefined || JSON.stringify(captured.path) !== JSON.stringify(["intrinsic", ...expected])) return undefined;
					readyAfter = Math.max(readyAfter, initializer.end ?? Infinity);
					dependencies.push(captured);
					if (role === "__hasOwnProp") dependencies.push({ path: [...captured.path, "call"] });
				}
				dependencies.push({ path: [
					"intrinsic",
					"Function",
					"prototype",
					"bind"
				] }, { path: [
					"intrinsic",
					"Function",
					"prototype",
					"call"
				] });
				const proof = {
					dependencies,
					identity: false,
					readyAfter
				};
				helpers.set(binding.bindingId, proof);
				return proof;
			};
			const provenCall = (node) => {
				if (!t.isCallExpression(node) || !t.isIdentifier(node.callee)) return undefined;
				const helper = resolveSemanticBindingState(state, node.callee, node.callee.name);
				const proof = helper === undefined ? undefined : helperProof(helper);
				const input = node.arguments[0];
				const mode = node.arguments[1];
				const literalMode = mode === undefined ? {
					found: true,
					value: false
				} : t.isExpression(mode) ? readExactJavaScriptLiteral(mode) : { found: false };
				if (proof === undefined || proof.readyAfter >= (node.start ?? -1) || !t.isExpression(input) || node.arguments.length > 2 || !literalMode.found) return undefined;
				return {
					input,
					defaultIsModule: !proof.identity && Boolean(literalMode.value),
					dependencies: proof.dependencies.map((dependency) => ({
						...dependency,
						capturedAt: dependency.capturedAt ?? node
					}))
				};
			};
			const callOrigin = (node) => {
				const cached = calls.get(node);
				if (cached !== undefined) return cached;
				const { root, members } = electronMemberPath(node);
				if (!members.every((member) => member !== null)) return undefined;
				const converted = provenCall(root);
				const required = converted === undefined ? undefined : semanticRequireOrigin(converted.input, state)?.origin;
				if (converted === undefined || required === undefined || required.importedPath.length !== 0 || members[0] === "default" && !converted.defaultIsModule) return undefined;
				const result = {
					origin: {
						...required,
						importedPath: members
					},
					dependencies: converted.dependencies,
					defaultIsModule: converted.defaultIsModule
				};
				calls.set(node, result);
				return result;
			};
			const origin = (binding) => {
				const single = semanticStableInitializer(binding, state);
				if (single !== undefined) {
					if (!single.projection.every((key) => typeof key === "string")) return undefined;
					const converted = callOrigin(single.node);
					if (converted?.origin.importedPath.length === 0 && single.projection[0] === "default" && !converted.defaultIsModule) return undefined;
					const result = converted === undefined ? undefined : {
						...converted,
						origin: {
							...converted.origin,
							importedPath: [...converted.origin.importedPath, ...single.projection]
						}
					};
					if (result !== undefined) origins.set(binding.bindingId, result);
					return result;
				}
				const [initial, converted] = binding.initializers;
				if (binding.definitions.length !== 2 || binding.definitions[0]?.kind !== "variable" || binding.definitions[1]?.kind !== "assignment" || binding.initializers.length !== 2 || initial === undefined || converted === undefined || initial.projection.length !== 0 || converted.projection.length !== 0 || state.conditionallySkippedExpressions.has(initial.node)) return undefined;
				const call = converted.node;
				const assignment = state.parentsByNode.get(call);
				const statement = assignment === undefined ? undefined : state.parentsByNode.get(assignment);
				const declaration = state.parentsByNode.get(initial.node);
				const declarationStatement = declaration === undefined ? undefined : state.parentsByNode.get(declaration);
				if (!t.isCallExpression(call) || !t.isIdentifier(call.callee) || !t.isAssignmentExpression(assignment, { operator: "=" }) || assignment.right !== call || !t.isIdentifier(assignment.left, { name: binding.name }) || !t.isExpressionStatement(statement) || !t.isVariableDeclarator(declaration) || !t.isVariableDeclaration(declarationStatement) || state.parentsByNode.get(statement) !== state.parentsByNode.get(declarationStatement) || (initial.node.start ?? Infinity) >= (call.start ?? -1)) return undefined;
				const convertedCall = provenCall(call);
				const input = convertedCall?.input;
				if (!t.isIdentifier(input) || resolveSemanticBindingState(state, input, input.name) !== binding) return undefined;
				const required = semanticRequireOrigin(initial.node, state)?.origin;
				if (required === undefined || required.importedPath.length !== 0) return undefined;
				if (convertedCall === undefined) return undefined;
				const result = {
					origin: required,
					dependencies: convertedCall.dependencies,
					defaultIsModule: convertedCall.defaultIsModule
				};
				origins.set(binding.bindingId, result);
				return result;
			};
			const invalidatedOrigin = (record) => record?.dependencies.some(({ path, capturedAt }) => {
				if (capturedAt === undefined) return true;
				const scope = opaqueMutationPath(capturedAt).join(".");
				return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capturedAt.start ?? -1) && write.coverage.covers(path));
			}) ?? false;
			return {
				origin,
				callOrigin,
				intrinsicPath,
				intrinsicInvocation: (node) => resolveJavaScriptIntrinsicInvocation(node, intrinsicPath, boundIntrinsic, intrinsicReadChanged),
				boundIntrinsic,
				staticString,
				isFreshObject,
				opaqueMutationPath,
				retainWrite: (node, path) => {
					const coverage = new SemanticPropertyPathCoverage();
					coverage.retain(path[0] === "opaque-intrinsic" ? ["intrinsic"] : path);
					writes.push({
						scope: opaqueMutationPath(node).join("."),
						offset: node.start ?? Infinity,
						coverage
					});
				},
				invalidated: (binding) => {
					const cached = invalidatedBindings.get(binding.bindingId);
					if (cached !== undefined) return cached;
					const result = invalidatedOrigin(origins.get(binding.bindingId));
					invalidatedBindings.set(binding.bindingId, result);
					return result;
				},
				invalidatedCall: (node) => {
					const cached = invalidatedCalls.get(node);
					if (cached !== undefined) return cached;
					const result = invalidatedOrigin(calls.get(node));
					invalidatedCalls.set(node, result);
					return result;
				}
			};
		};
		identityFunction = (node, state) => {
			if (!t.isFunction(node) || node.async || node.generator || runtimeFunctionParameters(node).length !== 1) return false;
			const parameter = runtimeFunctionParameters(node)[0];
			const result = t.isBlockStatement(node.body) ? node.body.body.length === 1 && t.isReturnStatement(node.body.body[0]) ? node.body.body[0].argument : undefined : node.body;
			return t.isIdentifier(parameter) && t.isIdentifier(result) && resolveSemanticBindingState(state, parameter, parameter.name) !== undefined && resolveSemanticBindingState(state, parameter, parameter.name) === resolveSemanticBindingState(state, result, result.name);
		};
		unprojectedInitializer = (binding, state) => {
			const initializer = semanticStableInitializer(binding, state);
			return initializer?.projection.length === 0 ? initializer.node : undefined;
		};
		canonicalRoles = (actual, pattern, state) => {
			const roles = new Map();
			const used = new Map();
			const pending = [{
				actual,
				pattern,
				parent: null
			}];
			while (pending.length !== 0) {
				const pair = pending.pop();
				if (pair === undefined) return undefined;
				const { parent } = pair;
				const controlBody = t.isIfStatement(parent) && (parent.consequent === pair.pattern || parent.alternate === pair.pattern) || t.isForStatement(parent) && parent.body === pair.pattern;
				const node = controlBody ? controlBodyOperation(pair.actual) : pair.actual;
				const expected = controlBody ? controlBodyOperation(pair.pattern) : pair.pattern;
				if (node.type !== expected.type) return undefined;
				const literalKey = parent !== null && (t.isMemberExpression(parent) && !parent.computed && parent.property === expected || t.isObjectProperty(parent) && !parent.computed && parent.key === expected);
				if (t.isIdentifier(expected) && t.isIdentifier(node) && !literalKey) {
					const binding = resolveSemanticBindingState(state, node, node.name);
					if (binding === undefined || roles.has(expected.name) && roles.get(expected.name) !== binding || used.has(binding.bindingId) && used.get(binding.bindingId) !== expected.name) return undefined;
					roles.set(expected.name, binding);
					used.set(binding.bindingId, expected.name);
				}
				const visitorKeys = javaScriptAstChildKeys(expected);
				for (const [key, field] of Object.entries(t.NODE_FIELDS[expected.type] ?? {})) {
					if (visitorKeys.includes(key) || t.isIdentifier(expected) && key === "name" && !literalKey) continue;
					const fallback = Reflect.get(field, "default");
					if (JSON.stringify(Reflect.get(node, key) ?? fallback) !== JSON.stringify(Reflect.get(expected, key) ?? fallback)) return undefined;
				}
				const children = childNodes(node), expectedChildren = childNodes(expected);
				if (children.length !== expectedChildren.length) return undefined;
				for (const [index, child] of children.entries()) {
					const expectedChild = expectedChildren[index];
					if (expectedChild !== undefined) pending.push({
						actual: child,
						pattern: expectedChild,
						parent: expected
					});
				}
			}
			return roles;
		};
		controlBodyOperation = (node) => {
			while (t.isBlockStatement(node) && node.directives.length === 0 && node.body.length === 1) {
				const statement = node.body[0];
				if (statement === undefined) break;
				node = statement;
			}
			return node;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticRequireOrigin.js
var semanticRequireLoaderAt, semanticFactoryRequireLoaderAt, semanticFactoryLoaderMemberAt, isSemanticCreateRequireBinding, isWrapperRequireInitializerCall, globalProcessReplacements, moduleRequireWrites, writesModuleRequire, semanticOriginalGlobalProcessAt, semanticGlobalProcessOrigin, semanticGlobalProcessPathOrigin, semanticMemberChain, semanticRequireOrigin, semanticRequireExportsIdentity, MUTABLE_BUILTIN_DEFAULTS, semanticMutableBuiltinOrigin;
function init_javascriptSemanticRequireOrigin() {
	return (init_javascriptSemanticRequireOrigin = __esmMin((() => {
		init_javascriptSemanticTraversal();
		init_javascriptBuiltinResourceMethods();
		init_javascriptSemanticState();
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticMutationInitializers();
		init_javascriptModuleInterop();
		semanticRequireLoaderAt = (node, state, factoryBindingIds) => {
			if (!t.isIdentifier(node.callee, { name: "require" })) return "local";
			const binding = resolveSemanticBindingState(state, node.callee, "require");
			if (binding === undefined) return semanticResolutionBlocked(state, node.callee, "require") ? "unknown" : "commonjs-loader";
			if (factoryBindingIds.has(binding.bindingId)) return binding.initializers.length === 0 ? "factory-loader" : "unknown";
			if (isWrapperRequireInitializerCall(binding, node, state)) return "commonjs-loader";
			if (isUnmodifiedCommonJsWrapperBinding(node.callee, "require", state)) return "commonjs-loader";
			if (isSemanticCreateRequireBinding(binding, state)) return "create-require";
			const initializer = semanticStableInitializer(binding, state)?.node;
			if ((binding.kind === "function" || binding.kind === "class") && initializer !== undefined) return "local";
			if (binding.declarationKinds.size === 1 && binding.declarationKinds.has("const") && (t.isFunctionExpression(initializer) || t.isArrowFunctionExpression(initializer))) return "local";
			return "unknown";
		};
		semanticFactoryRequireLoaderAt = (node, state, bindingIds) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			if (t.isIdentifier(callee)) return semanticFactoryLoaderMemberAt(node, state, bindingIds, null);
			if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === "bind") return semanticFactoryLoaderMemberAt(node, state, bindingIds, "bind");
			return undefined;
		};
		semanticFactoryLoaderMemberAt = (node, state, bindingIds, member) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			let loader;
			if (member === null) {
				if (t.isIdentifier(callee)) loader = callee;
			} else if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === member) {
				const root = unwrapJavaScriptExpression(callee.object).node;
				if (t.isIdentifier(root)) loader = root;
			}
			if (loader === undefined) return undefined;
			const binding = resolveSemanticBindingState(state, loader, loader.name);
			if (binding === undefined || !bindingIds.has(binding.bindingId)) return undefined;
			return binding.initializers.length === 0 ? "factory-loader" : "unknown";
		};
		isSemanticCreateRequireBinding = (binding, state) => {
			if (binding.initializers.length !== 1) return false;
			const initializer = semanticStableInitializer(binding, state)?.node;
			if (!t.isCallExpression(initializer)) return false;
			const callee = unwrapJavaScriptExpression(initializer.callee).node;
			if (t.isIdentifier(callee)) {
				const origins = resolveSemanticBindingState(state, callee, callee.name)?.directOrigins;
				if (origins?.length !== 1) return false;
				const [origin] = origins;
				return origin?.importedPath.at(-1) === "createRequire" && ["module", "node:module"].includes(origin.specifier);
			}
			const chain = semanticMemberChain(callee);
			if (chain === undefined || chain.members.at(-1) !== "createRequire") return false;
			if (!t.isNode(chain.root)) return false;
			const root = unwrapJavaScriptExpression(chain.root).node;
			if (!t.isIdentifier(root)) return false;
			const origins = resolveSemanticBindingState(state, root, root.name)?.directOrigins;
			if (origins?.length !== 1) return false;
			const [origin] = origins;
			return origin?.importedPath.length === 0 && ["module", "node:module"].includes(origin.specifier);
		};
		isWrapperRequireInitializerCall = (binding, node, state) => {
			const scope = state.scopesById.get(binding.scopeId);
			if (scope?.kind !== "program" || binding.kind !== "variable" || binding.declarationKinds.size !== 1 || !binding.declarationKinds.has("var") || binding.initializers.length !== 1 || binding.initializers[0]?.node !== node) return false;
			const assignment = state.parentsByNode.get(node);
			if (!t.isAssignmentExpression(assignment) || assignment.right !== node || state.conditionallySkippedExpressions.has(node)) return false;
			const statement = state.parentsByNode.get(assignment);
			if (!t.isExpressionStatement(statement)) return false;
			if (state.parentsByNode.get(statement) !== state.program) return false;
			const target = unwrapJavaScriptExpression(assignment.left).node;
			return t.isIdentifier(target, { name: "require" }) && resolveSemanticBindingState(state, target, target.name) === binding;
		};
		globalProcessReplacements = new WeakMap();
		moduleRequireWrites = new WeakMap();
		writesModuleRequire = (state) => {
			const cached = moduleRequireWrites.get(state);
			if (cached !== undefined) return cached;
			moduleRequireWrites.set(state, []);
			const writes = [];
			const interop = createSemanticModuleInterop(state);
			const isModuleObject = (node, visited = new Set()) => {
				const value = unwrapJavaScriptExpression(node).node;
				if (!t.isIdentifier(value)) return false;
				if (value.name === "module") return resolveSemanticBindingState(state, value, "module") === undefined ? !semanticResolutionBlocked(state, value, "module") : isUnmodifiedCommonJsWrapperBinding(value, "module", state);
				const binding = resolveSemanticBindingState(state, value, value.name);
				if (binding === undefined || visited.has(binding.bindingId)) return false;
				const next = new Set(visited).add(binding.bindingId);
				return binding.initializers.length > 0 && binding.initializers.every(({ node: init }) => isModuleObject(init, next));
			};
			traverseJavaScriptAst(state.program, { enter: (node) => {
				const target = t.isAssignmentExpression(node) ? node.left : t.isUpdateExpression(node) || t.isUnaryExpression(node, { operator: "delete" }) ? node.argument : undefined;
				if (target !== undefined) {
					const members = [];
					let root = target;
					while (t.isMemberExpression(root) || t.isOptionalMemberExpression(root)) {
						const key = semanticStaticPropertyKey(root.property, root.computed);
						if (key === null) break;
						members.unshift(key);
						root = root.object;
					}
					if (members.length === 1 && members[0] === "require" && isModuleObject(root)) writes.push(node);
					else if (members.length === 0 && (t.isMemberExpression(target) || t.isOptionalMemberExpression(target)) && target.computed && semanticStaticPropertyKey(target.property, true) === null && isModuleObject(target.object)) writes.push(node);
				}
				if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
					const invocation = interop.intrinsicInvocation(node);
					const owner = invocation?.path?.length === 3 ? invocation.path[1] : undefined;
					const method = invocation?.path?.at(-1);
					const args = invocation?.arguments;
					if ((owner === "Object" || owner === "Reflect") && method === "defineProperty" && isModuleObject(args?.[0] ?? t.nullLiteral())) {
						const key = interop.staticString(args?.[1]);
						if (key === "require" || key === undefined) writes.push(node);
					} else if (owner === "Object" && method === "defineProperties" && isModuleObject(args?.[0] ?? t.nullLiteral())) {
						const descriptors = args?.[1];
						if (!t.isObjectExpression(descriptors) || descriptors.properties.some((property) => t.isSpreadElement(property) || t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "require")) writes.push(node);
					} else if (owner === "Object" && method === "assign" && args?.some((arg) => isModuleObject(arg))) {
						const target = args?.[0];
						if (target !== undefined && isModuleObject(target)) {
							const sourceHasRequire = args?.slice(1).some((arg) => t.isObjectExpression(arg) && arg.properties.some((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "require"));
							if (sourceHasRequire || args?.slice(1).some((arg) => !t.isObjectExpression(arg))) writes.push(node);
						}
					}
				}
			} });
			moduleRequireWrites.set(state, writes);
			return writes;
		};
		semanticOriginalGlobalProcessAt = (node, state) => {
			let replacements = globalProcessReplacements.get(state);
			if (replacements === undefined) {
				replacements = [...state.ambientWriteEffects.filter(({ path }) => path.length <= 2 && path.every((key, index) => semanticPropertyPathKeyMatches(key, ["global", "process"][index]))).map(({ node: write }) => write), ...state.ambientBindingWrites.get("process") ?? []];
				globalProcessReplacements.set(state, replacements);
			}
			return !replacements.some((write) => !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode));
		};
		semanticGlobalProcessOrigin = (node, state) => t.isIdentifier(node, { name: "process" }) && resolveSemanticBindingState(state, node, "process") === undefined && !semanticResolutionBlocked(state, node, "process") && semanticOriginalGlobalProcessAt(node, state) ? {
			specifier: "node:process",
			importedPath: [],
			resolutionMode: "require"
		} : undefined;
		semanticGlobalProcessPathOrigin = (node, state) => {
			const members = [];
			let current = unwrapJavaScriptExpression(node).node;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null) return undefined;
				members.unshift(key);
				current = unwrapJavaScriptExpression(current.object).node;
			}
			if (!t.isIdentifier(current) || ![
				"globalThis",
				"global",
				"window",
				"self"
			].includes(current.name) || resolveSemanticBindingState(state, current, current.name) !== undefined || semanticResolutionBlocked(state, current, current.name) || members[0] !== "process" || !semanticOriginalGlobalProcessAt(node, state)) return undefined;
			return {
				specifier: "node:process",
				importedPath: members.slice(1),
				resolutionMode: "require"
			};
		};
		semanticMemberChain = (node) => {
			const members = [];
			let current = node;
			while (current !== null && current !== undefined) {
				current = unwrapJavaScriptExpression(current).node;
				if (!t.isMemberExpression(current) && !t.isOptionalMemberExpression(current)) break;
				const member = semanticStaticPropertyKey(current.property, current.computed);
				if (member === null || !t.isNode(current.object)) return undefined;
				members.push(member);
				current = current.object;
			}
			return {
				root: current,
				members: members.reverse()
			};
		};
		semanticRequireOrigin = (node, state) => {
			const chain = semanticMemberChain(node);
			const current = chain?.root;
			if (chain === undefined || !t.isCallExpression(current) || !t.isIdentifier(current.callee, { name: "require" })) return undefined;
			if (writesModuleRequire(state).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode))) return undefined;
			const requireBinding = resolveSemanticBindingState(state, current.callee, "require");
			if (requireBinding !== undefined && !isUnmodifiedCommonJsWrapperBinding(current.callee, "require", state) && !isWrapperRequireInitializerCall(requireBinding, current, state) || requireBinding === undefined && semanticResolutionBlocked(state, current.callee, "require") || (state.ambientBindingWrites.get("require") ?? []).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode))) return undefined;
			const specifier = stringValue(current.arguments[0]);
			return specifier === undefined ? undefined : {
				origin: {
					specifier,
					importedPath: chain.members,
					resolutionMode: "require"
				},
				call: current
			};
		};
		semanticRequireExportsIdentity = (specifier, path) => {
			const name = specifier.replace(/^node:/u, "");
			if (name === "fs/promises") return {
				specifier: name,
				path
			};
			return name === "fs" && path[0] === "promises" && path.length > 1 ? {
				specifier: "fs/promises",
				path: path.slice(1)
			} : {
				specifier: name,
				path
			};
		};
		MUTABLE_BUILTIN_DEFAULTS = new Set([
			...Object.keys(BUILTIN_RESOURCE_METHODS),
			"http",
			"https",
			"child_process",
			"timers",
			"process"
		]);
		semanticMutableBuiltinOrigin = (origin, selected = []) => {
			const path = [...origin.importedPath, ...selected];
			if (origin.resolutionMode === "require") return {
				specifier: origin.specifier,
				path
			};
			const specifier = origin.specifier.replace(/^node:/u, "");
			if (!MUTABLE_BUILTIN_DEFAULTS.has(specifier)) return undefined;
			if (path[0] === "default") return {
				specifier,
				path: path.slice(1)
			};
			if (specifier === "process" && (path[0] === "env" || path[0] === "argv")) return {
				specifier,
				path
			};
			return specifier === "fs" && path[0] === "promises" ? {
				specifier,
				path
			} : undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDependencies.js
var SemanticDependencyProofs;
function init_javascriptSemanticDependencies() {
	return (init_javascriptSemanticDependencies = __esmMin((() => {
		SemanticDependencyProofs = class {
			indices = new Map();
			singletons = new Map();
			height;
			constructor(bindings) {
				for (const binding of bindings) this.indices.set(binding, this.indices.size);
				this.height = Math.ceil(Math.log2(Math.max(1, this.indices.size)));
			}
			binding(binding) {
				const prior = this.singletons.get(binding);
				if (prior !== undefined) return prior;
				const index = this.index(binding);
				let proof = true;
				for (let bit = 0; bit < this.height; bit++) {
					const one = Math.floor(index / 2 ** bit) % 2 === 1;
					proof = Object.freeze({
						zero: one ? undefined : proof,
						one: one ? proof : undefined
					});
				}
				this.singletons.set(binding, proof);
				return proof;
			}
			union(first, second) {
				if (first === second || second === undefined) return first;
				if (first === undefined) return second;
				if (first === true || second === true) return true;
				const zero = this.union(first.zero, second.zero);
				const one = this.union(first.one, second.one);
				if (zero === first.zero && one === first.one) return first;
				if (zero === second.zero && one === second.one) return second;
				return Object.freeze({
					zero,
					one
				});
			}
			intersects(proof, active) {
				for (const binding of active.keys()) if (this.has(proof, binding)) return true;
				return false;
			}
			has(proof, binding) {
				const index = this.index(binding);
				for (let bit = this.height - 1; bit >= 0; bit--) {
					if (proof === undefined) return false;
					if (proof === true) return true;
					proof = Math.floor(index / 2 ** bit) % 2 === 1 ? proof.one : proof.zero;
				}
				return proof === true;
			}
			index(binding) {
				const index = this.indices.get(binding);
				if (index === undefined) throw new TypeError(`Unindexed semantic dependency: ${binding}`);
				return index;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticSlots.js
function semanticContainer(value) {
	if (value.status === "object") return {
		slots: value.properties,
		coverage: value.unknownProperties ? {
			status: "partial",
			omitted: value.omittedProperties
		} : {
			status: "complete",
			omitted: 0
		}
	};
	if (value.status === "array") return {
		slots: value.items,
		coverage: value.unknownItems ? {
			status: "partial",
			omitted: value.omittedItems
		} : {
			status: "complete",
			omitted: 0
		}
	};
	return null;
}
var semanticSlotAtPath, semanticPropertyPointer;
function init_javascriptSemanticSlots() {
	return (init_javascriptSemanticSlots = __esmMin((() => {
		semanticSlotAtPath = (value, path) => {
			const leafName = path.at(-1) ?? "";
			let current = {
				name: "",
				presence: "present",
				value
			};
			for (const [index, name] of path.entries()) {
				const container = semanticContainer(current.value);
				if (current.presence !== "present" || container === null) return {
					name: leafName,
					presence: "unknown-coverage",
					value: "reason" in current.value ? {
						...current.value,
						reason: `${current.value.reason} Cannot continue ${semanticPropertyPointer(path)} through receiver ${semanticPropertyPointer(path.slice(0, index))}.`
					} : {
						status: "unknown",
						reason: `Cannot resolve ${semanticPropertyPointer(path)} through ${current.value.status} receiver ${semanticPropertyPointer(path.slice(0, index))}.`
					}
				};
				if (current.value.status === "array" && name === "length") {
					current = {
						name,
						presence: "present",
						value: {
							status: "unknown",
							reason: "Array length is present but its value is not retained."
						}
					};
					continue;
				}
				const observed = container.slots.find((slot) => slot.name === name);
				current = observed ?? {
					name,
					presence: container.coverage.status === "complete" ? "absent" : "unknown-coverage",
					value: {
						status: "unknown",
						reason: `Own property ${name} was not observed.`
					}
				};
			}
			return current;
		};
		semanticPropertyPointer = (path) => path.map((key) => `/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`).join("");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMutationValues.js
var invalidateSemanticEscapedPath, invalidateSemanticMutationPaths;
function init_javascriptSemanticMutationValues() {
	return (init_javascriptSemanticMutationValues = __esmMin((() => {
		init_javascriptSemanticPropertyPaths();
		invalidateSemanticEscapedPath = (value, path) => {
			if (value.status !== "object" && value.status !== "array") return value;
			const [key, ...remaining] = path;
			if (key === undefined) return {
				status: "unknown",
				reason: "This object reference may have been mutated by a call."
			};
			const invalidateChild = (property) => semanticPropertyPathKeyMatches(key, property.name) ? {
				...property,
				value: invalidateSemanticEscapedPath(property.value, remaining)
			} : property;
			return value.status === "object" ? {
				...value,
				properties: value.properties.map(invalidateChild)
			} : {
				...value,
				items: value.items.map(invalidateChild)
			};
		};
		invalidateSemanticMutationPaths = (value, paths) => {
			if (paths.length === 0) return value;
			if (value.status !== "object" && value.status !== "array" || paths.some(([key]) => key === undefined || key === null)) return {
				status: "unknown",
				reason: "This property may have been mutated."
			};
			const reset = value.status === "array" ? paths.findLastIndex(([key]) => key === "length") : -1;
			const base = reset < 0 ? value : {
				status: "array",
				items: [],
				unknownItems: true,
				omittedItems: null
			};
			const slots = base.status === "object" ? base.properties : base.items;
			const slotsByName = new Map();
			slots.forEach((property, index) => {
				const indexes = slotsByName.get(property.name) ?? [];
				indexes.push(index);
				slotsByName.set(property.name, indexes);
			});
			const slotPaths = new Map();
			const replacedSlots = new Set();
			const select = (index, remaining) => {
				const selected = slotPaths.get(index) ?? [];
				selected.push(remaining);
				slotPaths.set(index, selected);
				if (remaining.length === 0) replacedSlots.add(index);
			};
			const added = new Set();
			for (const [key, ...remaining] of paths.slice(reset + 1)) {
				if (key === undefined || key === null) continue;
				if (typeof key === "object") {
					slots.forEach((property, index) => {
						if (semanticPropertyPathKeyMatches(key, property.name)) select(index, remaining);
					});
					continue;
				}
				const indexes = slotsByName.get(String(key));
				if (indexes === undefined) added.add(String(key));
				else for (const index of indexes) select(index, remaining);
			}
			const properties = slots.map((property, index) => {
				const selected = slotPaths.get(index);
				return selected === undefined ? property : {
					...property,
					...replacedSlots.has(index) ? { presence: "unknown-coverage" } : {},
					value: invalidateSemanticMutationPaths(property.value, selected)
				};
			});
			for (const name of added) properties.push({
				name,
				value: {
					status: "unknown",
					reason: "This property may have been mutated."
				},
				presence: "unknown-coverage"
			});
			return base.status === "object" ? {
				...base,
				properties
			} : {
				...base,
				items: properties
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProvenance.js
var semanticLocalProvenance, semanticUnresolvedProvenance, semanticAmbiguousProvenance, semanticOriginsProvenance, uniqueSemanticOrigins, semanticOriginKey, semanticPrimitiveKey, semanticBuiltinNamespacePath;
function init_javascriptSemanticProvenance() {
	return (init_javascriptSemanticProvenance = __esmMin((() => {
		init_unicodeCodePointOrder();
		semanticLocalProvenance = () => ({
			status: "local",
			origins: [],
			reason: null
		});
		semanticUnresolvedProvenance = (status, reason) => ({
			status,
			origins: [],
			reason
		});
		semanticAmbiguousProvenance = (origins, reason) => ({
			status: "ambiguous",
			origins,
			reason
		});
		semanticOriginsProvenance = (origins) => {
			const unique = uniqueSemanticOrigins(origins);
			const origin = unique[0];
			return unique.length === 1 && origin !== undefined ? {
				status: "module",
				origins: [origin],
				reason: null
			} : semanticAmbiguousProvenance(unique, "Multiple module origins.");
		};
		uniqueSemanticOrigins = (origins) => [...new Map(origins.map((origin) => [semanticOriginKey(origin), origin])).values()].sort((left, right) => compareUnicodeCodePoints(semanticOriginKey(left), semanticOriginKey(right)));
		semanticOriginKey = (origin) => JSON.stringify([
			origin.specifier,
			origin.importedPath,
			origin.resolutionMode ?? "import"
		]);
		semanticPrimitiveKey = (value) => `${value === null ? "null" : typeof value}:${JSON.stringify(value)}`;
		semanticBuiltinNamespacePath = (importedPath) => importedPath.length === 0 || importedPath.length === 1 && importedPath[0] === "default";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticResourceLimits.js
var SEMANTIC_PRIMITIVE_CANDIDATE_LIMIT, SEMANTIC_EXPRESSION_DEPTH_LIMIT, SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT, RESOURCE_LIMIT_REASON, jsonStringBytesFromLength, exceedsSemanticPrimitiveStringByteBudget, exceedsSemanticPrimitiveAdditionByteBudget, exceedsSemanticTemplateByteBudget, semanticResourceLimitUnknown, semanticResourceLimitsIn, semanticResourceLimitReason;
function init_javascriptSemanticResourceLimits() {
	return (init_javascriptSemanticResourceLimits = __esmMin((() => {
		SEMANTIC_PRIMITIVE_CANDIDATE_LIMIT = 256;
		SEMANTIC_EXPRESSION_DEPTH_LIMIT = 256;
		SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT = 1048576;
		RESOURCE_LIMIT_REASON = {
			"primitive-candidates": "Primitive candidate budget exceeded (maximum 256 alternatives).",
			"primitive-bytes": "Primitive string-byte budget exceeded (maximum 1048576 estimated JSON bytes).",
			"expression-depth": "Semantic expression depth budget exceeded (maximum 256 nested expressions)."
		};
		jsonStringBytesFromLength = (codeUnits) => codeUnits * 6 + 2;
		exceedsSemanticPrimitiveStringByteBudget = (strings) => {
			let total = 0;
			for (const value of strings) {
				total += jsonStringBytesFromLength(value.length);
				if (total > 1048576) return true;
			}
			return false;
		};
		exceedsSemanticPrimitiveAdditionByteBudget = (left, right) => {
			let total = 0;
			for (const leftValue of left) {
				for (const rightValue of right) {
					if (typeof leftValue !== "string" && typeof rightValue !== "string") continue;
					const length = String(leftValue).length + String(rightValue).length;
					total += jsonStringBytesFromLength(length);
					if (total > 1048576) return true;
				}
			}
			return false;
		};
		exceedsSemanticTemplateByteBudget = (prefixes, suffixes) => {
			let total = 0;
			for (const prefix of prefixes) {
				for (const suffix of suffixes) {
					total += jsonStringBytesFromLength(prefix.length + suffix.length);
					if (total > 1048576) return true;
				}
			}
			return false;
		};
		semanticResourceLimitUnknown = (resourceLimit) => ({
			status: "unknown",
			reason: RESOURCE_LIMIT_REASON[resourceLimit],
			resourceLimit
		});
		semanticResourceLimitsIn = (values) => {
			const found = new Set();
			const pending = [...values];
			while (pending.length > 0) {
				const value = pending.pop();
				if (value === undefined) continue;
				if (value.status === "unknown" && value.resourceLimit !== undefined) found.add(value.resourceLimit);
				else if (value.status === "object") for (const property of value.properties) pending.push(property.value);
				else if (value.status === "array") for (const item of value.items) pending.push(item.value);
			}
			return [...found].sort();
		};
		semanticResourceLimitReason = (resourceLimit) => RESOURCE_LIMIT_REASON[resourceLimit];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPrimitives.js
var semanticPrimitiveSet, semanticPrimitiveCandidates;
function init_javascriptSemanticPrimitives() {
	return (init_javascriptSemanticPrimitives = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticResourceLimits();
		semanticPrimitiveSet = (values) => {
			const uniqueValues = new Set();
			for (const value of values) {
				if (typeof value === "number" && !Number.isFinite(value)) return {
					status: "unknown",
					reason: "Nonfinite numbers are outside the JSON primitive lattice."
				};
				if (typeof value === "number" && Object.is(value, -0)) return {
					status: "unknown",
					reason: "Negative zero cannot be preserved by JSON primitive evidence."
				};
				uniqueValues.add(value);
				if (uniqueValues.size > 256) return semanticResourceLimitUnknown("primitive-candidates");
			}
			if (exceedsSemanticPrimitiveStringByteBudget([...uniqueValues].flatMap((value) => typeof value === "string" ? [value] : []))) return semanticResourceLimitUnknown("primitive-bytes");
			const unique = [...uniqueValues].map((value) => ({
				key: semanticPrimitiveKey(value),
				value
			})).sort((left, right) => compareUnicodeCodePoints(left.key, right.key)).map(({ value }) => value);
			const only = unique[0];
			return unique.length === 1 && only !== undefined ? {
				status: "literal",
				value: only
			} : {
				status: "union",
				values: unique
			};
		};
		semanticPrimitiveCandidates = (value) => value.status === "literal" ? [value.value] : value.status === "union" ? value.values : null;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticValues.js
var dependencyProofsByState, createEvaluationMemo, CALLER_INDEPENDENT, EVERY_CALLER, callerIndependentBindingValuesByState, primitiveBindingValuesByState, primitiveExpressionValuesByState, capturedBindingValuesByState, clearSemanticValueCaches, callerIndependentBindingValuesFor, primitiveBindingValuesFor, isSemanticResourceLimit, evaluateSemanticBinding, evaluateSemanticExpression, evaluateSemanticProvenance, evaluateSemanticProvenanceAtRead, readMemoizedEvaluation, retainDependencyProof, recordBindingDependency, collectEvaluationDependencies, evaluateBinding, evaluateExpression, evaluateTemplate, evaluateObject, evaluateArray, evaluateMember, evaluateAddition, addPrimitiveValues, evaluateUnary, projectValue, provenanceForBinding, provenanceForBindingUncached, provenanceForBindingValue, provenanceForExpression, provenanceForBindingAtRead, isLocallyCreatedValue, mergeValues, nestedContext, isPrimitive, primitiveCaptureContext, captureContextAt, evaluateCapturedExpression;
function init_javascriptSemanticValues() {
	return (init_javascriptSemanticValues = __esmMin((() => {
		init_javascriptSemanticDependencies();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticSlots();
		init_javascriptSemanticMutationValues();
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_unicodeCodePointOrder();
		init_javascriptAstValues();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticPrimitives();
		init_javascriptSemanticResourceLimits();
		dependencyProofsByState = new WeakMap();
		createEvaluationMemo = (state) => {
			let dependencies = dependencyProofsByState.get(state);
			if (dependencies === undefined) {
				dependencies = new SemanticDependencyProofs(state.bindingsById.keys());
				dependencyProofsByState.set(state, dependencies);
			}
			return {
				provenance: new Map(),
				dependencyFrames: [],
				dependencies
			};
		};
		CALLER_INDEPENDENT = Number.POSITIVE_INFINITY;
		EVERY_CALLER = -1;
		callerIndependentBindingValuesByState = new WeakMap();
		primitiveBindingValuesByState = new WeakMap();
		primitiveExpressionValuesByState = new WeakMap();
		capturedBindingValuesByState = new WeakMap();
		clearSemanticValueCaches = (state) => {
			primitiveBindingValuesByState.delete(state);
			capturedBindingValuesByState.delete(state);
			primitiveExpressionValuesByState.delete(state);
			callerIndependentBindingValuesByState.delete(state);
		};
		callerIndependentBindingValuesFor = (state) => {
			const existing = callerIndependentBindingValuesByState.get(state);
			if (existing !== undefined) return existing;
			const values = new Map();
			callerIndependentBindingValuesByState.set(state, values);
			return values;
		};
		primitiveBindingValuesFor = (state) => {
			const existing = primitiveBindingValuesByState.get(state);
			if (existing !== undefined) return existing;
			const values = new Map();
			primitiveBindingValuesByState.set(state, values);
			return values;
		};
		isSemanticResourceLimit = (value) => value.status === "unknown" && value.resourceLimit !== undefined;
		evaluateSemanticBinding = (binding, state) => evaluateBinding(binding, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		evaluateSemanticExpression = (node, state, capturePoint) => {
			const context = {
				state,
				bindings: new Map(),
				expressionDepth: 0,
				primitiveBindingValues: primitiveBindingValuesFor(state),
				dependence: { lowest: CALLER_INDEPENDENT },
				memo: createEvaluationMemo(state)
			};
			return evaluateExpression(node, capturePoint === undefined ? context : captureContextAt(capturePoint, context) ?? context);
		};
		evaluateSemanticProvenance = (binding, state) => provenanceForBinding(binding, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		evaluateSemanticProvenanceAtRead = (binding, read, state) => provenanceForBindingAtRead(binding, read, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		readMemoizedEvaluation = (entry, context) => {
			if (entry === undefined || context.memo.dependencies.intersects(entry.dependencies, context.bindings)) return undefined;
			retainDependencyProof(entry.dependencies, context);
			return entry.value;
		};
		retainDependencyProof = (proof, context) => {
			const parent = context.memo.dependencyFrames.at(-1);
			if (parent !== undefined) parent.proof = context.memo.dependencies.union(parent.proof, proof);
		};
		recordBindingDependency = (binding, context) => retainDependencyProof(context.memo.dependencies.binding(binding.bindingId), context);
		collectEvaluationDependencies = (binding, context, evaluate) => {
			const frame = { proof: context.memo.dependencies.binding(binding.bindingId) };
			context.memo.dependencyFrames.push(frame);
			try {
				return {
					value: evaluate(),
					dependencies: frame.proof
				};
			} finally {
				context.memo.dependencyFrames.pop();
				retainDependencyProof(frame.proof, context);
			}
		};
		evaluateBinding = (binding, context) => {
			recordBindingDependency(binding, context);
			const cycleHead = context.bindings.get(binding.bindingId);
			if (cycleHead !== undefined) {
				context.dependence.lowest = Math.min(context.dependence.lowest, cycleHead);
				return {
					status: "cycle",
					reason: `Alias cycle at ${binding.name}.`
				};
			}
			if (context.capturePoint !== undefined && !semanticBindingPrecedesCapture(binding, context.capturePoint, context.state.parentsByNode)) {
				const { capturePoint: _capturePoint, ...liveContext } = context;
				return evaluateBinding(binding, {
					...liveContext,
					primitiveBindingValues: primitiveBindingValuesFor(context.state)
				});
			}
			const cached = context.primitiveBindingValues.get(binding.bindingId);
			if (cached !== undefined) return cached;
			const independent = context.capturePoint === undefined ? callerIndependentBindingValuesFor(context.state) : undefined;
			const retained = independent?.get(binding.bindingId);
			if (retained !== undefined && context.expressionDepth <= retained.expressionDepth) {
				const reusable = readMemoizedEvaluation(retained, context);
				if (reusable !== undefined) return reusable;
			}
			if (binding.initializers.length === 0) return {
				status: "unknown",
				reason: `Binding ${binding.name} has no constant initializer.`
			};
			if (binding.initializers.some(({ node }) => t.isUpdateExpression(node) || t.isAssignmentExpression(node) && node.operator !== "=" && node.operator !== "&&=" && node.operator !== "||=" && node.operator !== "??=")) return {
				status: "unknown",
				reason: `Binding ${binding.name} has a compound or update write.`
			};
			if (binding.initializers.length > 1) return {
				status: "ambiguous",
				reason: `Binding ${binding.name} has multiple possible assignments.`
			};
			const initializer = binding.initializers[0];
			if (initializer === undefined) return {
				status: "unknown",
				reason: "Missing binding initializer."
			};
			if (context.state.conditionallySkippedExpressions.has(initializer.node)) return {
				status: "unknown",
				reason: `Binding ${binding.name} may remain uninitialized.`
			};
			const position = context.bindings.size;
			const callerDependence = context.dependence.lowest;
			context.dependence.lowest = CALLER_INDEPENDENT;
			context.bindings.set(binding.bindingId, position);
			let value;
			let callerIndependent = false;
			let evaluated;
			try {
				evaluated = collectEvaluationDependencies(binding, context, () => {
					const nested = nestedContext(context);
					let value = projectValue(evaluateExpression(initializer.node, nested), initializer.projection);
					if (!isPrimitive(value)) {
						const captureContext = primitiveCaptureContext(initializer.node, nested);
						if (captureContext !== undefined) {
							const captured = projectValue(evaluateExpression(initializer.node, captureContext), initializer.projection);
							if (isPrimitive(captured)) value = captured;
						}
					}
					return value;
				});
				value = evaluated.value;
				callerIndependent = context.dependence.lowest > position;
			} finally {
				context.bindings.delete(binding.bindingId);
				context.dependence.lowest = callerIndependent ? callerDependence : Math.min(callerDependence, context.dependence.lowest);
			}
			let projected = invalidateSemanticMutationPaths(value, binding.memberWrites.map(({ path }) => path));
			for (const escape of binding.escapedPaths) {
				if (projected.status !== "object" && projected.status !== "array") break;
				if (context.capturePoint !== undefined && semanticEscapeFollowsCapture(binding, context.capturePoint, escape.node, context.state.parentsByNode)) continue;
				projected = invalidateSemanticEscapedPath(projected, escape.path);
			}
			if (callerIndependent && independent !== undefined && (retained === undefined || retained.expressionDepth < context.expressionDepth)) independent.set(binding.bindingId, {
				value: projected,
				dependencies: evaluated.dependencies,
				expressionDepth: context.expressionDepth
			});
			if (context.capturePoint !== undefined || projected.status === "literal" || projected.status === "union" || isSemanticResourceLimit(projected) && (projected.resourceLimit === "primitive-bytes" || projected.resourceLimit === "primitive-candidates")) context.primitiveBindingValues.set(binding.bindingId, projected);
			return projected;
		};
		evaluateExpression = (node, context) => {
			if (context.expressionDepth > 256) {
				context.dependence.lowest = EVERY_CALLER;
				return semanticResourceLimitUnknown("expression-depth");
			}
			const unwrapped = unwrapJavaScriptExpression(node);
			if (unwrapped.depth > 0) {
				if (context.expressionDepth + unwrapped.depth > 256) {
					context.dependence.lowest = EVERY_CALLER;
					return semanticResourceLimitUnknown("expression-depth");
				}
				return evaluateExpression(unwrapped.node, {
					...context,
					expressionDepth: context.expressionDepth + unwrapped.depth
				});
			}
			const literal = readExactJavaScriptLiteral(node);
			if (literal.found) return typeof literal.value === "number" ? semanticPrimitiveSet([literal.value]) : {
				status: "literal",
				value: literal.value
			};
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(context.state, node, node.name);
				return binding === undefined ? {
					status: "unknown",
					reason: `Unbound identifier ${node.name}.`
				} : evaluateBinding(binding, nestedContext(context));
			}
			if (t.isTemplateLiteral(node)) return evaluateTemplate(node, context);
			if (t.isConditionalExpression(node)) return mergeValues([evaluateExpression(node.consequent, nestedContext(context)), evaluateExpression(node.alternate, nestedContext(context))]);
			if (t.isLogicalExpression(node)) return mergeValues([evaluateExpression(node.left, nestedContext(context)), evaluateExpression(node.right, nestedContext(context))]);
			if (t.isObjectExpression(node)) return evaluateObject(node, context);
			if (t.isArrayExpression(node)) return evaluateArray(node, context);
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) return evaluateMember(node, context);
			if (t.isBinaryExpression(node, { operator: "+" })) return evaluateAddition(node, context);
			if (t.isUnaryExpression(node)) return evaluateUnary(node, context);
			return {
				status: "unknown",
				reason: `Unsupported ${node.type} value.`
			};
		};
		evaluateTemplate = (node, context) => {
			let candidates = [""];
			for (let index = 0; index < node.quasis.length; index += 1) {
				const quasi = node.quasis[index];
				const text = quasi?.value.cooked;
				if (text === undefined || text === null) return {
					status: "unknown",
					reason: "Template text has no cooked representation."
				};
				if (exceedsSemanticTemplateByteBudget(candidates, [text])) return semanticResourceLimitUnknown("primitive-bytes");
				candidates = candidates.map((prefix) => `${prefix}${text}`);
				const expression = node.expressions[index];
				if (expression === undefined) continue;
				const evaluated = evaluateExpression(expression, nestedContext(context));
				const values = semanticPrimitiveCandidates(evaluated);
				if (values === null) {
					if (isSemanticResourceLimit(evaluated)) return evaluated;
					return {
						status: "unknown",
						reason: "Template expression is not a bounded primitive."
					};
				}
				if (candidates.length > 256 / values.length) return semanticResourceLimitUnknown("primitive-candidates");
				const suffixes = values.map((value) => String(value));
				if (exceedsSemanticTemplateByteBudget(candidates, suffixes)) return semanticResourceLimitUnknown("primitive-bytes");
				candidates = candidates.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`));
			}
			return semanticPrimitiveSet(candidates);
		};
		evaluateObject = (node, context) => {
			const propertiesByName = new Map();
			let unknownProperties = false;
			let omittedProperties = 0;
			const invalidateEarlierProperties = () => {
				for (const [name] of propertiesByName) propertiesByName.set(name, {
					name,
					presence: "present",
					value: {
						status: "unknown",
						reason: "A later property may overwrite this value."
					}
				});
			};
			for (const property of node.properties) {
				if (t.isSpreadElement(property)) {
					unknownProperties = true;
					omittedProperties = null;
					invalidateEarlierProperties();
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					invalidateEarlierProperties();
					continue;
				}
				if (t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__") {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					continue;
				}
				propertiesByName.set(name, {
					name,
					presence: "present",
					value: t.isObjectProperty(property) ? evaluateCapturedExpression(property.value, nestedContext(context)) : {
						status: "unknown",
						reason: "Object method or accessor value is not a primitive."
					}
				});
			}
			const properties = [...propertiesByName.values()].sort((left, right) => compareUnicodeCodePoints(left.name, right.name));
			return unknownProperties ? {
				status: "object",
				properties,
				unknownProperties: true,
				omittedProperties
			} : {
				status: "object",
				properties,
				unknownProperties: false,
				omittedProperties: 0
			};
		};
		evaluateArray = (node, context) => {
			const items = [];
			let unknownItems = false;
			let omittedItems = 0;
			for (const element of node.elements) {
				if (t.isSpreadElement(element)) {
					unknownItems = true;
					omittedItems = null;
					break;
				}
				if (element === null) {
					items.push({
						name: String(items.length),
						presence: "absent",
						value: {
							status: "unknown",
							reason: "Array hole has no own value."
						}
					});
					continue;
				}
				items.push({
					name: String(items.length),
					presence: "present",
					value: evaluateCapturedExpression(element, nestedContext(context))
				});
			}
			return unknownItems ? {
				status: "array",
				items,
				unknownItems: true,
				omittedItems
			} : {
				status: "array",
				items,
				unknownItems: false,
				omittedItems: 0
			};
		};
		evaluateMember = (node, context) => {
			const keys = [];
			let current = node;
			let value;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				if (!t.isNode(current.object)) {
					value = {
						status: "unknown",
						reason: "Unsupported member base."
					};
					break;
				}
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null) {
					value = {
						status: "unknown",
						reason: "Dynamic member key."
					};
					break;
				}
				keys.push(key);
				current = current.object;
			}
			value ??= evaluateExpression(current, nestedContext(context));
			for (const key of keys.reverse()) value = projectValue(value, [key]);
			return value;
		};
		evaluateAddition = (node, context) => {
			const pending = [];
			let current = node;
			while (true) {
				if (t.isBinaryExpression(current, { operator: "+" })) {
					pending.push({
						node: current,
						left: undefined
					});
					current = current.left;
					continue;
				}
				let value = evaluateExpression(current, nestedContext(context));
				while (true) {
					const parent = pending.at(-1);
					if (parent === undefined) return value;
					if (parent.left === undefined) {
						parent.left = value;
						current = parent.node.right;
						break;
					}
					value = addPrimitiveValues(parent.left, value);
					pending.pop();
				}
			}
		};
		addPrimitiveValues = (leftValue, rightValue) => {
			const left = semanticPrimitiveCandidates(leftValue);
			const right = semanticPrimitiveCandidates(rightValue);
			if (left === null || right === null) {
				if (isSemanticResourceLimit(leftValue)) return leftValue;
				if (isSemanticResourceLimit(rightValue)) return rightValue;
				return {
					status: "unknown",
					reason: "Non-primitive addition."
				};
			}
			if (left.length > 256 / right.length) return semanticResourceLimitUnknown("primitive-candidates");
			if (exceedsSemanticPrimitiveAdditionByteBudget(left, right)) return semanticResourceLimitUnknown("primitive-bytes");
			const values = left.flatMap((leftValue) => right.map((rightValue) => typeof leftValue === "string" || typeof rightValue === "string" ? `${String(leftValue)}${String(rightValue)}` : Number(leftValue) + Number(rightValue)));
			return semanticPrimitiveSet(values);
		};
		evaluateUnary = (node, context) => {
			const evaluated = evaluateExpression(node.argument, nestedContext(context));
			const argument = semanticPrimitiveCandidates(evaluated);
			if (argument === null) {
				if (isSemanticResourceLimit(evaluated)) return evaluated;
				return {
					status: "unknown",
					reason: "Non-primitive unary operand."
				};
			}
			if (node.operator === "!") return semanticPrimitiveSet(argument.map((value) => !value));
			if (node.operator === "+") return semanticPrimitiveSet(argument.map((value) => Number(value)));
			if (node.operator === "-") return semanticPrimitiveSet(argument.map((value) => -Number(value)));
			return {
				status: "unknown",
				reason: `Unsupported unary ${node.operator}.`
			};
		};
		projectValue = (value, projection) => {
			if (projection.includes(null)) return {
				status: "unknown",
				reason: "Cannot project a dynamic property."
			};
			const path = projection.map((key) => String(key));
			const slot = semanticSlotAtPath(value, path);
			return slot.presence === "present" ? slot.value : {
				status: "unknown",
				reason: `Own property ${path.join("/")} is ${slot.presence}.`
			};
		};
		provenanceForBinding = (binding, context) => {
			recordBindingDependency(binding, context);
			const cycleHead = context.bindings.get(binding.bindingId);
			if (cycleHead !== undefined) {
				context.dependence.lowest = Math.min(context.dependence.lowest, cycleHead);
				return semanticUnresolvedProvenance("cycle", `Alias cycle at ${binding.name}.`);
			}
			let depths = context.memo.provenance.get(binding.bindingId);
			const prior = readMemoizedEvaluation(depths?.get(context.expressionDepth), context);
			if (prior !== undefined) return prior;
			const position = context.bindings.size;
			const callerDependence = context.dependence.lowest;
			context.dependence.lowest = CALLER_INDEPENDENT;
			let result;
			let callerIndependent = false;
			try {
				result = collectEvaluationDependencies(binding, context, () => provenanceForBindingUncached(binding, context));
				callerIndependent = context.dependence.lowest > position;
			} finally {
				context.dependence.lowest = callerIndependent ? callerDependence : Math.min(callerDependence, context.dependence.lowest);
			}
			if (callerIndependent) {
				if (depths === undefined) {
					depths = new Map();
					context.memo.provenance.set(binding.bindingId, depths);
				}
				depths.set(context.expressionDepth, result);
			}
			return result.value;
		};
		provenanceForBindingUncached = (binding, context) => {
			const provenance = provenanceForBindingValue(binding, context);
			const assigned = binding.definitions.some(({ kind }) => kind === "assignment");
			const conditionallyInitialized = binding.initializers.some(({ node }) => context.state.conditionallySkippedExpressions.has(node));
			if (provenance.status !== "module" || !assigned && !conditionallyInitialized) return provenance;
			return semanticAmbiguousProvenance(provenance.origins, assigned ? `Binding ${binding.name} may be reassigned.` : `Binding ${binding.name} may remain uninitialized.`);
		};
		provenanceForBindingValue = (binding, context) => {
			if (binding.kind === "parameter" || binding.kind === "catch") return semanticUnresolvedProvenance("unknown", binding.kind === "parameter" ? "Parameter provenance depends on caller arguments." : "Catch binding provenance depends on the thrown value.");
			if (binding.directOrigins.length > 0) return semanticOriginsProvenance(binding.directOrigins);
			if (binding.initializers.length === 0) return semanticLocalProvenance();
			if (binding.initializers.length > 1) return semanticAmbiguousProvenance([], `Binding ${binding.name} has multiple possible assignments.`);
			const initializer = binding.initializers[0];
			if (initializer === undefined) return semanticUnresolvedProvenance("unknown", "Missing binding initializer.");
			if (initializer.projection.includes(null)) return semanticUnresolvedProvenance("unknown", "Dynamic provenance projection.");
			context.bindings.set(binding.bindingId, context.bindings.size);
			let resolved;
			try {
				resolved = provenanceForExpression(initializer.node, nestedContext(context));
			} finally {
				context.bindings.delete(binding.bindingId);
			}
			if (resolved.status !== "module" || initializer.projection.length === 0) return resolved;
			return semanticOriginsProvenance(resolved.origins.map((origin) => ({
				...origin,
				importedPath: [...origin.importedPath, ...initializer.projection.map((segment) => String(segment))]
			})));
		};
		provenanceForExpression = (node, context) => {
			if (context.expressionDepth > 256) {
				context.dependence.lowest = EVERY_CALLER;
				return semanticUnresolvedProvenance("unknown", semanticResourceLimitReason("expression-depth"));
			}
			const unwrapped = unwrapJavaScriptExpression(node);
			if (unwrapped.depth > 0) {
				if (context.expressionDepth + unwrapped.depth > 256) {
					context.dependence.lowest = EVERY_CALLER;
					return semanticUnresolvedProvenance("unknown", semanticResourceLimitReason("expression-depth"));
				}
				return provenanceForExpression(unwrapped.node, {
					...context,
					expressionDepth: context.expressionDepth + unwrapped.depth
				});
			}
			const required = semanticRequireOrigin(node, context.state);
			if (required !== undefined) return semanticOriginsProvenance([required.origin]);
			if (t.isSequenceExpression(node)) {
				const finalExpression = node.expressions.at(-1);
				return finalExpression === undefined ? semanticUnresolvedProvenance("unknown", "Empty sequence expression.") : provenanceForExpression(finalExpression, nestedContext(context));
			}
			if (t.isAssignmentExpression(node) && node.operator === "=") return provenanceForExpression(node.right, nestedContext(context));
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(context.state, node, node.name);
				return binding === undefined ? semanticUnresolvedProvenance("unknown", `Unbound identifier ${node.name}.`) : provenanceForBindingAtRead(binding, node, nestedContext(context));
			}
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const members = [];
				let current = node;
				while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					if (!t.isNode(current.object)) return semanticUnresolvedProvenance("unknown", "Unsupported member base.");
					const member = semanticStaticPropertyKey(current.property, current.computed);
					if (member === null) return semanticUnresolvedProvenance("unknown", "Dynamic provenance member.");
					members.push(member);
					current = current.object;
				}
				const base = provenanceForExpression(current, nestedContext(context));
				const path = members.reverse();
				return base.status !== "module" ? base : semanticOriginsProvenance(base.origins.map((origin) => ({
					...origin,
					importedPath: [...origin.importedPath, ...path]
				})));
			}
			if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
				const left = t.isConditionalExpression(node) ? node.consequent : node.left;
				const right = t.isConditionalExpression(node) ? node.alternate : node.right;
				const candidates = [provenanceForExpression(left, nestedContext(context)), provenanceForExpression(right, nestedContext(context))];
				const origins = uniqueSemanticOrigins(candidates.flatMap((candidate) => candidate.origins));
				const allModuleOrigins = candidates.every(({ status }) => status === "module");
				if (allModuleOrigins && origins.length === 1) return semanticOriginsProvenance(origins);
				return origins.length > 0 ? semanticAmbiguousProvenance(origins, allModuleOrigins ? "Multiple module origins." : "Conditional provenance includes a non-module alternative.") : semanticUnresolvedProvenance("unknown", "Conditional provenance is unresolved.");
			}
			if (isLocallyCreatedValue(node)) return semanticLocalProvenance();
			return semanticUnresolvedProvenance("unknown", `Unsupported ${node.type} provenance.`);
		};
		provenanceForBindingAtRead = (binding, read, context) => {
			const selected = semanticReadInitializers(binding, read, context.state.parentsByNode);
			if (selected.initializers === binding.initializers) return provenanceForBinding(binding, context);
			if (context.bindings.has(binding.bindingId)) return semanticUnresolvedProvenance("cycle", `Alias cycle at ${binding.name}.`);
			const snapshot = {
				...binding,
				...selected,
				definitions: binding.definitions.filter(({ kind }) => kind !== "assignment")
			};
			context.bindings.set(binding.bindingId, context.bindings.size);
			try {
				return provenanceForBindingValue(snapshot, context);
			} finally {
				context.bindings.delete(binding.bindingId);
			}
		};
		isLocallyCreatedValue = (node) => readExactJavaScriptLiteral(node).found || t.isObjectExpression(node) || t.isArrayExpression(node) || t.isFunctionExpression(node) || t.isArrowFunctionExpression(node) || t.isClassExpression(node) || t.isTemplateLiteral(node) || t.isUnaryExpression(node) || t.isBinaryExpression(node) || t.isUpdateExpression(node);
		mergeValues = (values) => {
			const resourceLimit = values.find(isSemanticResourceLimit);
			if (resourceLimit !== undefined) return resourceLimit;
			const primitives = values.flatMap((value) => semanticPrimitiveCandidates(value) ?? []);
			return values.every((value) => value.status === "union" || value.status === "literal") ? semanticPrimitiveSet(primitives) : {
				status: "ambiguous",
				reason: "Branches have incompatible values."
			};
		};
		nestedContext = (context) => ({
			state: context.state,
			primitiveBindingValues: context.primitiveBindingValues,
			...context.capturePoint === undefined ? {} : { capturePoint: context.capturePoint },
			expressionDepth: context.expressionDepth + 1,
			bindings: context.bindings,
			dependence: context.dependence,
			memo: context.memo
		});
		isPrimitive = (value) => value.status === "literal" || value.status === "union";
		primitiveCaptureContext = (node, context) => {
			if (t.isObjectExpression(node) || t.isArrayExpression(node)) return undefined;
			return captureContextAt(node, context);
		};
		captureContextAt = (node, context) => {
			if (context.capturePoint !== undefined || semanticCapturePosition(node, context.state.parentsByNode) === null) return undefined;
			let captures = capturedBindingValuesByState.get(context.state);
			if (captures === undefined) {
				captures = new WeakMap();
				capturedBindingValuesByState.set(context.state, captures);
			}
			let values = captures.get(node);
			if (values === undefined) {
				values = new Map();
				captures.set(node, values);
			}
			return {
				...context,
				capturePoint: node,
				primitiveBindingValues: values
			};
		};
		evaluateCapturedExpression = (node, context) => {
			let values = primitiveExpressionValuesByState.get(context.state);
			const cached = values?.get(node);
			if (cached !== undefined) return cached;
			let value = evaluateExpression(node, context);
			if (!isPrimitive(value)) {
				const captureContext = primitiveCaptureContext(node, context);
				if (captureContext !== undefined) {
					const captured = evaluateExpression(node, captureContext);
					if (isPrimitive(captured)) value = captured;
				}
			}
			if (context.capturePoint === undefined && isPrimitive(value)) {
				if (values === undefined) {
					values = new WeakMap();
					primitiveExpressionValuesByState.set(context.state, values);
				}
				values.set(node, value);
			}
			return value;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptModuleDeclaration.js
var isTypeOnlyImportDeclaration, isTypeOnlyExportDeclaration, isTypeOnlyImportSpecifier, isTypeOnlyExportSpecifier, hasOnlyInlineTypeImportSpecifiers, hasOnlyInlineTypeExportSpecifiers, hasUncertainTypeOnlyModuleSideEffect;
function init_javascriptModuleDeclaration() {
	return (init_javascriptModuleDeclaration = __esmMin((() => {
		isTypeOnlyImportDeclaration = (node) => node.importKind === "type" || node.importKind === "typeof";
		isTypeOnlyExportDeclaration = (node) => node.exportKind === "type" || t.isExportNamedDeclaration(node) && node.declaration !== null && (t.isTSInterfaceDeclaration(node.declaration) || t.isTSTypeAliasDeclaration(node.declaration) || t.isTSDeclareFunction(node.declaration));
		isTypeOnlyImportSpecifier = (node) => node.importKind === "type" || node.importKind === "typeof";
		isTypeOnlyExportSpecifier = (node) => node.exportKind === "type";
		hasOnlyInlineTypeImportSpecifiers = (node) => !isTypeOnlyImportDeclaration(node) && node.specifiers.length > 0 && node.specifiers.every((specifier) => t.isImportSpecifier(specifier) && isTypeOnlyImportSpecifier(specifier));
		hasOnlyInlineTypeExportSpecifiers = (node) => !isTypeOnlyExportDeclaration(node) && node.source != null && node.specifiers.length > 0 && node.specifiers.every((specifier) => t.isExportSpecifier(specifier) && isTypeOnlyExportSpecifier(specifier));
		hasUncertainTypeOnlyModuleSideEffect = (program) => program.body.some((node) => t.isImportDeclaration(node) && hasOnlyInlineTypeImportSpecifiers(node) || t.isExportNamedDeclaration(node) && hasOnlyInlineTypeExportSpecifiers(node));
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProjection.js
/** Collect lexical references in steps while preserving resolution and visit order. */
function* collectSemanticReferencesSteps(program, state, name) {
	const output = [];
	const seen = new Set();
	const patterns = [];
	yield* traverseJavaScriptAstSteps(program, {
		enter: (node, parent, readAncestors) => {
			if (isPatternNode(node)) patterns.push(node);
			if (!t.isIdentifier(node) || parent === null || name !== undefined && node.name !== name || isNonReferenceKey(node, parent) && !patterns.some((pattern) => bindsIdentifier(pattern, parent, node))) return;
			const ancestors = readAncestors();
			const role = semanticIdentifierRole(node, parent, ancestors);
			if (role === null) return;
			const roles = role === "write" && semanticReadsBeforeWrite(node, semanticWrappedWriteSite(node, parent, ancestors) ?? parent) ? ["read", "write"] : [role];
			for (const resolvedRole of roles) {
				const key = `${String(node.start)}:${resolvedRole}:${node.name}`;
				if (seen.has(key)) continue;
				seen.add(key);
				const binding = resolveSemanticBindingState(state, node, node.name);
				const blocked = binding === undefined && semanticResolutionBlocked(state, node, node.name);
				output.push({
					name: node.name,
					role: resolvedRole,
					location: range(node),
					bindingId: binding?.bindingId ?? null,
					resolution: binding !== undefined ? "resolved" : blocked ? "unknown" : "unbound"
				});
			}
		},
		exit: (node) => {
			if (isPatternNode(node)) patterns.pop();
		}
	});
	return output;
}
var collectSemanticCallable, collectSemanticModuleLink, collectImportEquals, semanticImportEqualsSpecifier, collectSemanticReferences, immutableSemanticScopes, immutableSemanticBindings, callableKind, callableName, collectImports, collectNamedExports, collectRequireLink, collectUnboundRequireLink, requirePatternBindings, collectCommonJsExport, commonJsExportReceiverEffect, isFreshAssignmentResult, addModuleLink, semanticCallableIdForNode, declarationCallableId, semanticReadsBeforeWrite, semanticIdentifierRole, enclosingPatternAncestor, bindsIdentifier, isPatternNode, isDeleteSite, isPatternOwnerDeclaration, semanticReferenceRole, isDeclarationIdentifier, isNonReferenceKey, patternNames, patternContains, declarationNames, defaultExportLocalName, commonJsExportName, isCommonJsModuleExports;
function init_javascriptSemanticProjection() {
	return (init_javascriptSemanticProjection = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptAstValues();
		init_javascriptModuleDeclaration();
		collectSemanticCallable = (input) => {
			const { node, parent, containerScope, bodyScope, state } = input;
			const kind = callableKind(node);
			if (kind === undefined) return;
			const callableId = semanticCallableIdForNode(node) ?? "callable:unknown:-1:-1";
			state.callables.push({
				callableId,
				kind,
				name: callableName(node, parent),
				containerScopeId: containerScope.scopeId,
				bodyScopeId: bodyScope === undefined || !bodyScope.bindingsComplete ? null : bodyScope.scopeId,
				location: range(node),
				returnSites: [],
				returnCoverage: {
					status: "partial",
					retainedCount: 0,
					omittedCount: null
				}
			});
			state.callableNodesById.set(callableId, node);
		};
		collectSemanticModuleLink = (node, state) => {
			if (t.isTSImportEqualsDeclaration(node)) collectImportEquals(node, state);
			else if (t.isImportDeclaration(node)) collectImports(node, state);
			else if (t.isExportAllDeclaration(node)) addModuleLink(state, {
				kind: isTypeOnlyExportDeclaration(node) ? "type-import" : "re-export",
				specifier: node.source.value,
				importedName: "*",
				localName: null,
				exportedName: "*",
				location: range(node)
			}, node);
			else if (t.isExportNamedDeclaration(node)) collectNamedExports(node, state);
			else if (t.isExportDefaultDeclaration(node)) addModuleLink(state, {
				kind: "export",
				specifier: null,
				importedName: null,
				localName: defaultExportLocalName(node.declaration),
				exportedName: "default",
				callableId: semanticCallableIdForNode(node.declaration),
				location: range(node)
			}, node);
			else if (t.isVariableDeclarator(node)) collectRequireLink(node, state);
			else if (t.isAssignmentExpression(node)) collectCommonJsExport(node, state);
			else if (t.isCallExpression(node)) collectUnboundRequireLink(node, state);
		};
		collectImportEquals = (node, state) => {
			const moduleReference = node.moduleReference;
			const specifier = semanticImportEqualsSpecifier(node) ?? (node.importKind === "type" && t.isTSExternalModuleReference(moduleReference) && t.isStringLiteral(moduleReference.expression) ? moduleReference.expression.value : null);
			if (specifier === null) return;
			addModuleLink(state, {
				kind: node.importKind === "type" ? "type-import" : "require",
				specifier,
				importedName: null,
				localName: node.id.name,
				exportedName: null,
				location: range(node)
			}, node);
		};
		semanticImportEqualsSpecifier = (node) => node.importKind !== "type" && t.isTSExternalModuleReference(node.moduleReference) && t.isStringLiteral(node.moduleReference.expression) ? node.moduleReference.expression.value : null;
		collectSemanticReferences = (program, state, name) => completeSemanticSteps(collectSemanticReferencesSteps(program, state, name));
		immutableSemanticScopes = (state) => state.scopes.map((scope) => ({
			scopeId: scope.scopeId,
			parentScopeId: scope.parentScopeId,
			kind: scope.kind,
			location: scope.location,
			bindingsComplete: scope.bindingsComplete,
			bindingIds: [...scope.bindings.values()].map(({ bindingId }) => bindingId).sort(compareUnicodeCodePoints)
		}));
		immutableSemanticBindings = (state) => [...state.bindingsById.values()].map((binding) => ({
			bindingId: binding.bindingId,
			scopeId: binding.scopeId,
			name: binding.name,
			kind: binding.kind,
			mutable: binding.mutable,
			definitions: binding.definitions,
			value: evaluateSemanticBinding(binding, state),
			provenance: evaluateSemanticProvenance(binding, state)
		})).sort((left, right) => compareUnicodeCodePoints(left.bindingId, right.bindingId));
		callableKind = (node) => {
			if (t.isClassMethod(node) || t.isClassPrivateMethod(node) || t.isObjectMethod(node)) return "method";
			if (t.isFunction(node)) return "function";
			if (t.isClass(node)) return "class";
			return undefined;
		};
		callableName = (node, parent) => {
			if ((t.isFunctionDeclaration(node) || t.isFunctionExpression(node) || t.isClassDeclaration(node) || t.isClassExpression(node)) && t.isIdentifier(node.id)) return node.id.name;
			if (t.isClassMethod(node) || t.isClassPrivateMethod(node) || t.isObjectMethod(node)) {
				if (t.isPrivateName(node.key)) return `#${node.key.id.name}`;
				return semanticStaticPropertyKey(node.key, node.computed) ?? `[computed@${String(node.start ?? -1)}]`;
			}
			if (parent !== null && t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) return parent.id.name;
			return null;
		};
		collectImports = (node, state) => {
			if (node.specifiers.length === 0) addModuleLink(state, {
				kind: isTypeOnlyImportDeclaration(node) ? "type-import" : "import",
				specifier: node.source.value,
				importedName: null,
				localName: null,
				exportedName: null,
				location: range(node)
			}, node);
			for (const specifier of node.specifiers) addModuleLink(state, {
				kind: isTypeOnlyImportDeclaration(node) || t.isImportSpecifier(specifier) && isTypeOnlyImportSpecifier(specifier) ? "type-import" : "import",
				specifier: node.source.value,
				importedName: t.isImportDefaultSpecifier(specifier) ? "default" : t.isImportNamespaceSpecifier(specifier) ? "*" : propertyName(specifier.imported),
				localName: specifier.local.name,
				exportedName: null,
				location: range(specifier)
			}, node);
		};
		collectNamedExports = (node, state) => {
			const declarationTypeOnly = isTypeOnlyExportDeclaration(node);
			if (node.declaration !== null && node.declaration !== undefined) for (const localName of declarationNames(node.declaration)) addModuleLink(state, {
				kind: declarationTypeOnly ? "type-import" : "export",
				specifier: null,
				importedName: null,
				localName,
				exportedName: localName,
				callableId: declarationCallableId(node.declaration, localName),
				location: range(node.declaration)
			}, node);
			for (const specifier of node.specifiers) if (t.isExportSpecifier(specifier) || t.isExportNamespaceSpecifier(specifier) && node.exportKind !== "type") addModuleLink(state, {
				kind: declarationTypeOnly || t.isExportSpecifier(specifier) && isTypeOnlyExportSpecifier(specifier) ? "type-import" : node.source == null ? "export" : "re-export",
				specifier: node.source?.value ?? null,
				importedName: t.isExportNamespaceSpecifier(specifier) ? "*" : propertyName(specifier.local),
				localName: node.source == null && t.isExportSpecifier(specifier) ? propertyName(specifier.local) : null,
				exportedName: propertyName(specifier.exported),
				location: range(specifier)
			}, node);
		};
		collectRequireLink = (node, state) => {
			const required = semanticRequireOrigin(node.init, state);
			if (required === undefined) return;
			const { origin, call } = required;
			const bindings = requirePatternBindings(node.id, origin.importedPath);
			for (const binding of bindings) addModuleLink(state, {
				kind: "require",
				specifier: origin.specifier,
				importedName: binding.importedName,
				localName: binding.localName,
				exportedName: null,
				location: range(node)
			}, node);
			if (bindings.length > 0) state.linkedRequireCalls.add(call);
		};
		collectUnboundRequireLink = (node, state) => {
			if (state.linkedRequireCalls.has(node)) return;
			const required = semanticRequireOrigin(node, state);
			if (required === undefined) return;
			addModuleLink(state, {
				kind: "require",
				specifier: required.origin.specifier,
				importedName: null,
				localName: null,
				exportedName: null,
				location: range(node)
			}, node);
			state.linkedRequireCalls.add(node);
		};
		requirePatternBindings = (pattern, path) => {
			if (t.isTSParameterProperty(pattern)) return requirePatternBindings(pattern.parameter, path);
			if (t.isIdentifier(pattern)) return [{
				importedName: path.at(-1) ?? "*",
				localName: pattern.name
			}];
			if (t.isAssignmentPattern(pattern)) return requirePatternBindings(pattern.left, path);
			if (t.isObjectPattern(pattern)) return pattern.properties.flatMap((property) => {
				if (t.isRestElement(property)) return [];
				const name = semanticStaticPropertyKey(property.key, property.computed);
				return name === null ? [] : requirePatternBindings(property.value, [...path, name]);
			});
			if (t.isArrayPattern(pattern)) return pattern.elements.flatMap((element, index) => element === null ? [] : requirePatternBindings(element, [...path, String(index)]));
			return [];
		};
		collectCommonJsExport = (node, state) => {
			const exportedName = commonJsExportName(node.left, state);
			if (exportedName === undefined) return;
			const receiverEffect = isCommonJsModuleExports(node.left, state) ? null : commonJsExportReceiverEffect(node.right, state);
			if (receiverEffect === "detached") return;
			let value = node.operator === "=" && receiverEffect !== "uncertain" ? node.right : null;
			while (t.isAssignmentExpression(value, { operator: "=" })) value = value.right;
			const required = value === null ? undefined : semanticRequireOrigin(value, state);
			const origin = required?.origin;
			addModuleLink(state, {
				kind: "commonjs-export",
				specifier: origin?.specifier ?? null,
				importedName: origin?.importedPath.at(-1) ?? null,
				localName: value !== null && t.isIdentifier(value) ? value.name : null,
				exportedName,
				callableId: value === null ? null : semanticCallableIdForNode(value),
				location: range(node)
			}, node);
			if (required !== undefined) state.linkedRequireCalls.add(required.call);
		};
		commonJsExportReceiverEffect = (node, state) => {
			let value = node;
			while (t.isAssignmentExpression(value, { operator: "=" })) {
				if (isCommonJsModuleExports(value.left, state)) return isFreshAssignmentResult(value.right) ? "detached" : "uncertain";
				value = value.right;
			}
			return null;
		};
		isFreshAssignmentResult = (node) => {
			let value = node;
			while (t.isAssignmentExpression(value, { operator: "=" })) value = value.right;
			return t.isArrowFunctionExpression(value) || t.isFunctionExpression(value) || t.isClassExpression(value) || t.isObjectExpression(value) || t.isArrayExpression(value);
		};
		addModuleLink = (state, link, referenceNode) => {
			const resolutionMode = link.resolutionMode ?? (link.kind === "import" || link.kind === "re-export" || link.kind === "type-import" ? state.staticImportResolutionMode : link.kind === "require" ? "require" : undefined);
			const collected = {
				...link,
				...resolutionMode === undefined ? {} : { resolutionMode },
				callableId: link.callableId ?? null
			};
			state.moduleLinks.push(collected);
			if (t.isExportDefaultDeclaration(referenceNode) && t.isExpression(referenceNode.declaration)) state.defaultExportExpressions.set(collected, referenceNode.declaration);
			if (link.localName !== null) {
				const binding = resolveSemanticBindingState(state, referenceNode, link.localName);
				if (binding !== undefined) state.moduleLinkBindings.set(collected, binding);
			}
		};
		semanticCallableIdForNode = (node) => {
			const kind = callableKind(node);
			return kind === undefined ? null : `callable:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		};
		declarationCallableId = (declaration, localName) => {
			if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && declaration.id?.name === localName) return semanticCallableIdForNode(declaration);
			if (!t.isVariableDeclaration(declaration)) return null;
			const declarator = declaration.declarations.find(({ id }) => t.isIdentifier(id, { name: localName }));
			return declarator?.init === null || declarator?.init === undefined ? null : semanticCallableIdForNode(declarator.init);
		};
		semanticReadsBeforeWrite = (node, site) => {
			const target = semanticWriteSiteTarget(site);
			return target !== null && unwrapJavaScriptExpression(target).node === node && semanticWriteSiteReadsFirst(site);
		};
		semanticIdentifierRole = (node, parent, ancestors) => {
			const patternAncestor = enclosingPatternAncestor(node, parent, ancestors);
			if (patternAncestor !== null) {
				if (isPatternOwnerDeclaration(patternAncestor)) return null;
				return "write";
			}
			const site = semanticWrappedWriteSite(node, parent, ancestors);
			if (site !== null && site !== parent && !isDeleteSite(site)) return "write";
			return semanticReferenceRole(node, parent);
		};
		enclosingPatternAncestor = (node, parent, ancestors) => {
			const chain = [...ancestors, parent];
			for (let index = chain.length - 1; index >= 0; index -= 1) {
				const ancestor = chain[index];
				if (ancestor === undefined || !isPatternNode(ancestor)) continue;
				if (!bindsIdentifier(ancestor, parent, node)) continue;
				for (let owner = index - 1; owner >= 0; owner -= 1) {
					const candidate = chain[owner];
					if (candidate === undefined) continue;
					if (t.isAssignmentExpression(candidate) || t.isForInStatement(candidate) || t.isForOfStatement(candidate)) return candidate;
					if (isPatternOwnerDeclaration(candidate)) return candidate;
				}
				return null;
			}
			return null;
		};
		bindsIdentifier = (pattern, parent, node) => {
			if (parent === pattern) return patternContains(pattern, node);
			if (t.isObjectPattern(pattern)) return t.isObjectProperty(parent) && (parent.value === node || parent.shorthand && parent.key === node);
			if (t.isArrayPattern(pattern)) return pattern.elements.some((element) => element === parent);
			if (t.isAssignmentPattern(pattern)) return pattern.left === parent;
			return t.isRestElement(pattern) && pattern.argument === parent;
		};
		isPatternNode = (node) => t.isObjectPattern(node) || t.isArrayPattern(node) || t.isAssignmentPattern(node) || t.isRestElement(node);
		isDeleteSite = (site) => t.isUnaryExpression(site, { operator: "delete" });
		isPatternOwnerDeclaration = (node) => t.isVariableDeclarator(node) && t.isPattern(node.id) || t.isFunction(node) && node.params.some((value) => t.isPattern(value)) || t.isCatchClause(node) && node.param !== null && t.isPattern(node.param);
		semanticReferenceRole = (node, parent) => {
			if (isDeclarationIdentifier(node, parent) || isNonReferenceKey(node, parent)) return null;
			if (t.isAssignmentExpression(parent) && parent.left === node || t.isUpdateExpression(parent) || (t.isForInStatement(parent) || t.isForOfStatement(parent)) && parent.left === node) return "write";
			if (t.isExportSpecifier(parent) && parent.local === node) return "export";
			return "read";
		};
		isDeclarationIdentifier = (node, parent) => {
			if (t.isTSImportEqualsDeclaration(parent)) return parent.id === node;
			return t.isVariableDeclarator(parent) && patternContains(parent.id, node) || (t.isFunctionDeclaration(parent) || t.isFunctionExpression(parent)) && parent.id === node || t.isFunction(parent) && parent.params.some((value) => patternContains(value, node)) || (t.isClassDeclaration(parent) || t.isClassExpression(parent)) && parent.id === node || t.isImportSpecifier(parent) && (parent.local === node || parent.imported === node) || t.isImportDefaultSpecifier(parent) && parent.local === node || t.isImportNamespaceSpecifier(parent) && parent.local === node || t.isCatchClause(parent) && parent.param === node;
		};
		isNonReferenceKey = (node, parent) => (t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) && parent.property === node && !parent.computed || (t.isObjectProperty(parent) || t.isObjectMethod(parent)) && parent.key === node && !parent.computed && !(t.isObjectProperty(parent) && parent.shorthand) || t.isExportSpecifier(parent) && parent.exported === node || t.isLabeledStatement(parent) || t.isBreakStatement(parent) || t.isContinueStatement(parent);
		patternNames = (pattern) => {
			if (t.isTSParameterProperty(pattern)) return patternNames(pattern.parameter);
			if (t.isIdentifier(pattern)) return [pattern.name];
			if (t.isAssignmentPattern(pattern)) return patternNames(pattern.left);
			if (t.isRestElement(pattern)) return patternNames(pattern.argument);
			if (t.isObjectPattern(pattern)) return pattern.properties.flatMap((property) => t.isRestElement(property) ? patternNames(property.argument) : patternNames(property.value));
			if (t.isArrayPattern(pattern)) return pattern.elements.flatMap((element) => element === null ? [] : patternNames(element));
			return [];
		};
		patternContains = (pattern, target) => pattern === target || t.isAssignmentPattern(pattern) && patternContains(pattern.left, target) || t.isRestElement(pattern) && patternContains(pattern.argument, target) || t.isObjectPattern(pattern) && pattern.properties.some((property) => t.isRestElement(property) ? patternContains(property.argument, target) : patternContains(property.value, target)) || t.isArrayPattern(pattern) && pattern.elements.some((element) => element !== null && patternContains(element, target));
		declarationNames = (declaration) => {
			if (t.isVariableDeclaration(declaration)) return declaration.declarations.flatMap(({ id }) => patternNames(id));
			if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && t.isIdentifier(declaration.id)) return [declaration.id.name];
			if ((t.isTSInterfaceDeclaration(declaration) || t.isTSTypeAliasDeclaration(declaration) || t.isTSDeclareFunction(declaration)) && t.isIdentifier(declaration.id)) return [declaration.id.name];
			if (t.isTSImportEqualsDeclaration(declaration) && semanticImportEqualsSpecifier(declaration) !== null) return [declaration.id.name];
			return [];
		};
		defaultExportLocalName = (declaration) => {
			const value = unwrapJavaScriptExpression(declaration).node;
			if (t.isIdentifier(value)) return value.name;
			return (t.isFunctionDeclaration(value) || t.isClassDeclaration(value)) && t.isIdentifier(value.id) ? value.id.name : null;
		};
		commonJsExportName = (node, state) => {
			if (!t.isMemberExpression(node) && !t.isOptionalMemberExpression(node)) return undefined;
			const key = semanticStaticPropertyKey(node.property, node.computed);
			if (isUnshadowedGlobal(node.object, state, "exports")) return key === null ? "*" : key;
			if (t.isMemberExpression(node.object) && isCommonJsModuleExports(node.object, state)) return key === null ? "*" : key;
			if (isCommonJsModuleExports(node, state)) return "default";
			return undefined;
		};
		isCommonJsModuleExports = (node, state) => (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && isUnshadowedGlobal(node.object, state, "module") && semanticStaticPropertyKey(node.property, node.computed) === "exports";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBootstrap.js
var javascriptBootstrapAt, dispatchedTableBinding, bindingId$1;
function init_javascriptBootstrap() {
	return (init_javascriptBootstrap = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticState();
		javascriptBootstrapAt = (call, state) => {
			if (!t.isFunctionExpression(call.callee) && !t.isArrowFunctionExpression(call.callee) || !t.isBlockStatement(call.callee.body) || runtimeFunctionParameters(call.callee).length !== 0 || call.arguments.length !== 0) return undefined;
			const body = call.callee.body;
			const tables = new Map();
			for (const statement of body.body) {
				if (!t.isVariableDeclaration(statement)) continue;
				for (const declaration of statement.declarations) {
					if (t.isIdentifier(declaration.id) && t.isObjectExpression(declaration.init) && declaration.init.properties.length > 0 && declaration.init.properties.every((property) => moduleFactory(property) !== undefined)) {
						const binding = resolveSemanticBindingState(state, declaration.id, declaration.id.name);
						if (binding !== undefined && semanticStableInitializer(binding, state)?.node === declaration.init) tables.set(binding.bindingId, declaration.init);
					}
				}
			}
			if (tables.size === 0) return undefined;
			for (const loader of body.body) {
				if (!t.isFunctionDeclaration(loader) || loader.id === null || loader.id === undefined || runtimeFunctionParameters(loader).length !== 1) continue;
				const parameter = runtimeFunctionParameters(loader)[0];
				if (!t.isIdentifier(parameter)) continue;
				const loaderName = loader.id.name;
				const loaderBindingId = bindingId$1(state, loader.id);
				const parameterBindingId = bindingId$1(state, parameter);
				if (loaderBindingId === undefined || parameterBindingId === undefined) continue;
				let tableBindingId;
				traverseJavaScriptAst(loader.body, { enter: (node, _parent, ancestors) => {
					if (!t.isCallExpression(node) || ancestors().some((node) => t.isFunction(node))) return;
					const candidate = dispatchedTableBinding(node, loaderBindingId, parameterBindingId, state);
					if (candidate !== undefined && tables.has(candidate)) tableBindingId = candidate;
				} });
				const table = tableBindingId === undefined ? undefined : tables.get(tableBindingId);
				if (table !== undefined && tableBindingId !== undefined) return {
					body,
					table,
					loaderName,
					loaderBindingId,
					tableBindingId
				};
			}
			return undefined;
		};
		dispatchedTableBinding = (call, loaderBindingId, keyBindingId, state) => {
			const member = call.callee;
			const viaCall = t.isMemberExpression(member) && semanticStaticPropertyKey(member.property, member.computed) === "call";
			const dispatch = viaCall && t.isMemberExpression(member) ? member.object : member;
			if (!t.isMemberExpression(dispatch) || !dispatch.computed || !t.isIdentifier(dispatch.object) || !t.isIdentifier(dispatch.property) || bindingId$1(state, dispatch.property) !== keyBindingId) return undefined;
			const args = viaCall ? call.arguments.slice(1) : call.arguments;
			const [module, exports, require] = args;
			if (args.length !== 3 || !t.isIdentifier(module) || bindingId$1(state, module) === undefined || !t.isMemberExpression(exports) || !t.isIdentifier(exports.object) || bindingId$1(state, exports.object) !== bindingId$1(state, module) || semanticStaticPropertyKey(exports.property, exports.computed) !== "exports" || !t.isIdentifier(require) || bindingId$1(state, require) !== loaderBindingId) return undefined;
			if (viaCall && (!t.isNode(call.arguments[0]) || !t.isNodesEquivalent(call.arguments[0], exports))) return undefined;
			return bindingId$1(state, dispatch.object);
		};
		bindingId$1 = (state, identifier) => resolveSemanticBindingState(state, identifier, identifier.name)?.bindingId;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBootstrapIntegrity.js
var proveJavaScriptBootstrapIntegrity, loaderShape, tableDispatch, moduleCache, startsEmpty, isPlainObject, runsUnconditionally, moduleObjectContained, moduleUse, withCacheReads, returnsModuleExports, sideEffectBeforeReturn, keyedSlot, referencesAreContained, containedUse, isRuntimeExposure, exposedTableUse, exposedSlotWrite, bindingOf;
function init_javascriptBootstrapIntegrity() {
	return (init_javascriptBootstrapIntegrity = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		proveJavaScriptBootstrapIntegrity = (call, bootstrap, loaderIds, state) => {
			if (bootstrap.table.properties.some((property) => t.isSpreadElement(property) ? true : semanticStaticPropertyKey(property.key, property.computed) === null)) return undefined;
			const loader = bootstrap.body.body.find((statement) => t.isFunctionDeclaration(statement) && statement.id !== null && statement.id !== undefined && bindingOf(state, statement.id) === bootstrap.loaderBindingId);
			const shape = loader === undefined ? undefined : loaderShape(loader, bootstrap.tableBindingId, state);
			if (shape === undefined) return undefined;
			return referencesAreContained(call, {
				bootstrap,
				shape,
				loaderIds
			}, state);
		};
		loaderShape = (loader, tableId, state) => {
			const [parameter] = loader.params;
			const parameterId = t.isIdentifier(parameter) ? bindingOf(state, parameter) : undefined;
			if (parameterId === undefined || state.bindingsById.get(parameterId)?.definitions.length !== 1 || loader.async || loader.generator) return undefined;
			const dispatches = new Set();
			const calls = [];
			const modules = new Set();
			const returns = [];
			traverseJavaScriptAst(loader.body, {
				skip: (node) => t.isFunction(node),
				enter: (node) => {
					if (t.isReturnStatement(node)) returns.push(node.argument);
					if (!t.isCallExpression(node)) return;
					const dispatch = tableDispatch(node, tableId, parameterId, state);
					if (dispatch === undefined) return;
					dispatches.add(dispatch.table);
					calls.push(node);
					if (dispatch.moduleId !== undefined) modules.add(dispatch.moduleId);
				}
			});
			const [moduleId] = modules;
			const [dispatch] = calls;
			if (calls.length !== 1 || dispatch === undefined || modules.size !== 1 || moduleId === undefined || !runsUnconditionally(dispatch, loader, state)) return undefined;
			const cache = moduleCache(moduleId, parameterId, state);
			if (cache === null || !moduleObjectContained(loader, moduleId, dispatch, state)) return undefined;
			const shape = {
				parameterId,
				dispatch,
				dispatches,
				moduleId,
				cacheId: cache?.cacheId,
				cacheSites: new Set(cache === undefined ? [] : [cache.site])
			};
			return returns.every((argument) => returnsModuleExports(argument, shape, state)) ? withCacheReads(loader, shape, state) : undefined;
		};
		tableDispatch = (call, tableId, parameterId, state) => {
			const viaCall = t.isMemberExpression(call.callee) && semanticStaticPropertyKey(call.callee.property, call.callee.computed) === "call";
			const slot = viaCall && t.isMemberExpression(call.callee) ? call.callee.object : call.callee;
			if (!t.isMemberExpression(slot) || !slot.computed || !t.isIdentifier(slot.object) || !t.isIdentifier(slot.property) || bindingOf(state, slot.object) !== tableId || bindingOf(state, slot.property) !== parameterId) return undefined;
			const module = call.arguments[viaCall ? 1 : 0];
			const moduleId = t.isIdentifier(module) ? bindingOf(state, module) : undefined;
			return moduleId === undefined ? { table: slot.object } : {
				table: slot.object,
				moduleId
			};
		};
		moduleCache = (moduleId, parameterId, state) => {
			const binding = state.bindingsById.get(moduleId);
			const initializer = semanticStableInitializer(binding, state);
			if (binding?.definitions.length !== 1 || initializer === undefined || initializer.projection.length !== 0) return null;
			const value = initializer.node;
			if (isPlainObject(value)) return undefined;
			if (!t.isAssignmentExpression(value, { operator: "=" }) || !isPlainObject(value.right)) return null;
			const cacheId = keyedSlot(value.left, parameterId, state);
			return cacheId !== undefined && startsEmpty(cacheId, state) ? {
				cacheId,
				site: value.left
			} : null;
		};
		startsEmpty = (cacheId, state) => {
			const binding = state.bindingsById.get(cacheId);
			const initializer = semanticStableInitializer(binding, state);
			return binding?.definitions.length === 1 && initializer?.projection.length === 0 && t.isObjectExpression(initializer.node) && initializer.node.properties.length === 0;
		};
		isPlainObject = (node) => t.isObjectExpression(node) && node.properties.every((property) => t.isObjectProperty(property) && !property.computed && semanticStaticPropertyKey(property.key, false) !== "__proto__");
		runsUnconditionally = (dispatch, loader, state) => {
			let child = dispatch;
			let parent = state.parentsByNode.get(child);
			while (parent !== undefined && child !== loader.body) {
				const ordered = t.isSequenceExpression(parent) || t.isExpressionStatement(parent) || t.isReturnStatement(parent) || t.isBlockStatement(parent) || t.isMemberExpression(parent) && parent.object === child || t.isCallExpression(parent) && parent.callee === child || t.isTryStatement(parent) && parent.block === child;
				if (!ordered) return false;
				child = parent;
				parent = state.parentsByNode.get(parent);
			}
			return child === loader.body;
		};
		moduleObjectContained = (loader, moduleId, dispatch, state) => {
			let contained = true;
			traverseJavaScriptAst(loader.body, { enter: (node, parent, readAncestors) => {
				if (!contained || !t.isIdentifier(node) || parent === null) return;
				const ancestors = readAncestors();
				if (!t.isReferenced(node, parent, ancestors.at(-2))) return;
				if (bindingOf(state, node) !== moduleId) return;
				contained = !ancestors.some((ancestor) => t.isFunction(ancestor)) && moduleUse(node, [parent, ancestors.at(-2)], dispatch);
			} });
			return contained;
		};
		moduleUse = (node, [parent, grandparent], dispatch) => {
			if (parent === dispatch) return dispatch.arguments.includes(node);
			if (!t.isMemberExpression(parent) || parent.object !== node) return false;
			const key = semanticStaticPropertyKey(parent.property, parent.computed);
			const written = t.isAssignmentExpression(grandparent) && grandparent.left === parent || t.isUpdateExpression(grandparent) || t.isUnaryExpression(grandparent, { operator: "delete" });
			if (written) return key !== null && key !== "exports";
			if (key !== "exports") return false;
			return grandparent === dispatch || (parent.start ?? -1) > (dispatch.end ?? Number.POSITIVE_INFINITY);
		};
		withCacheReads = (loader, shape, state) => {
			if (shape.cacheId === undefined) return shape;
			const sites = new Set(shape.cacheSites);
			let contained = true;
			traverseJavaScriptAst(loader.body, {
				skip: (node) => t.isFunction(node),
				enter: (node, parent) => {
					if (!t.isMemberExpression(node) || keyedSlot(node, shape.parameterId, state) !== shape.cacheId) return;
					const read = t.isVariableDeclarator(parent) && parent.init === node;
					const deleted = t.isUnaryExpression(parent, { operator: "delete" });
					if (read || deleted || sites.has(node)) sites.add(node);
					else contained = false;
				}
			});
			return contained ? {
				...shape,
				cacheSites: sites
			} : undefined;
		};
		returnsModuleExports = (argument, shape, state) => {
			const value = t.isSequenceExpression(argument) ? argument.expressions.at(-1) : argument;
			const before = t.isSequenceExpression(argument) ? argument.expressions.slice(0, -1) : [];
			if (!before.every((expression) => sideEffectBeforeReturn(expression, shape, state))) return false;
			if (!t.isMemberExpression(value) || !t.isIdentifier(value.object) || semanticStaticPropertyKey(value.property, value.computed) !== "exports") return false;
			const id = bindingOf(state, value.object);
			if (id === shape.moduleId) return true;
			if (id === undefined || shape.cacheId === undefined) return false;
			const binding = state.bindingsById.get(id);
			const initializer = semanticStableInitializer(binding, state);
			return binding?.definitions.length === 1 && initializer?.projection.length === 0 && keyedSlot(initializer.node, shape.parameterId, state) === shape.cacheId;
		};
		sideEffectBeforeReturn = (expression, shape, state) => {
			if (expression === shape.dispatch) return true;
			if (!t.isAssignmentExpression(expression) || !t.isMemberExpression(expression.left) || !t.isIdentifier(expression.left.object) || bindingOf(state, expression.left.object) !== shape.moduleId) return false;
			const key = semanticStaticPropertyKey(expression.left.property, expression.left.computed);
			return key !== null && key !== "exports";
		};
		keyedSlot = (node, parameterId, state) => t.isMemberExpression(node) && node.computed && t.isIdentifier(node.object) && t.isIdentifier(node.property) && bindingOf(state, node.property) === parameterId ? bindingOf(state, node.object) : undefined;
		referencesAreContained = (call, { bootstrap, shape, loaderIds }, state) => {
			const tracked = new Map([
				[bootstrap.tableBindingId, "table"],
				...shape.cacheId === undefined ? [] : [[shape.cacheId, "cache"]],
				...[...loaderIds].map((id) => [id, "loader"])
			]);
			const names = new Set([...tracked.keys()].flatMap((id) => state.bindingsById.get(id)?.name ?? []));
			const replacedKeys = new Set();
			let contained = true;
			traverseJavaScriptAst(call, {
				skip: () => !contained,
				enter: (node, parent, readAncestors) => {
					if (!t.isIdentifier(node) || !names.has(node.name) || parent === null) return;
					const ancestors = readAncestors();
					if (!t.isReferenced(node, parent, ancestors.at(-2))) return;
					const id = bindingOf(state, node);
					const role = id === undefined ? undefined : tracked.get(id);
					if (role === undefined) return;
					const use = {
						node,
						parent,
						ancestors,
						shape,
						loaderIds,
						state
					};
					if (role !== "loader") contained = containedUse(role, use);
					else if (exposedTableUse(use) === "escaped") contained = false;
					else exposedSlotWrite(use, replacedKeys);
				}
			});
			return contained ? { replacedKeys } : undefined;
		};
		containedUse = (role, use) => {
			if (role === "table" && use.shape.dispatches.has(use.node)) return true;
			if (role === "cache" && use.shape.cacheSites.has(use.parent)) return true;
			return isRuntimeExposure(use, role === "table" ? "m" : "c");
		};
		isRuntimeExposure = (use, key) => {
			const { parent, node, loaderIds, state } = use;
			return t.isAssignmentExpression(parent, { operator: "=" }) && parent.right === node && t.isMemberExpression(parent.left) && t.isIdentifier(parent.left.object) && semanticStaticPropertyKey(parent.left.property, parent.left.computed) === key && loaderIds.has(bindingOf(state, parent.left.object) ?? "");
		};
		exposedTableUse = (use) => {
			const { parent, ancestors } = use;
			if (!t.isMemberExpression(parent) || parent.object !== use.node || !["m", "c"].includes(semanticStaticPropertyKey(parent.property, parent.computed) ?? "")) return "other";
			const outer = ancestors.at(-2);
			const assigned = t.isAssignmentExpression(outer, { operator: "=" }) && outer.left === parent;
			const indexed = t.isMemberExpression(outer) && outer.object === parent && outer.computed;
			if (assigned) return "contained";
			if (!indexed) return "escaped";
			const member = ancestors.at(-3);
			const target = ancestors.at(-4);
			const entryWritten = t.isMemberExpression(member) && member.object === outer && (t.isAssignmentExpression(target) && target.left === member || t.isUpdateExpression(target) || t.isUnaryExpression(target, { operator: "delete" }));
			return entryWritten ? "escaped" : "contained";
		};
		exposedSlotWrite = (use, replacedKeys) => {
			const { parent, ancestors } = use;
			const slot = ancestors.at(-2);
			const write = ancestors.at(-3);
			if (!t.isMemberExpression(parent) || parent.object !== use.node || !["m", "c"].includes(semanticStaticPropertyKey(parent.property, parent.computed) ?? "") || !t.isMemberExpression(slot) || slot.object !== parent || !(t.isAssignmentExpression(write) && write.left === slot || t.isUnaryExpression(write, { operator: "delete" }) || t.isUpdateExpression(write))) return;
			const key = slot.computed ? argumentValue(slot.property) : semanticStaticPropertyKey(slot.property, false);
			if (key !== undefined && key !== null) replacedKeys.add(key);
		};
		bindingOf = (state, identifier) => resolveSemanticBindingState(state, identifier, identifier.name)?.bindingId;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBundledRequireOrigin.js
var proofs, semanticBundledRequireOrigin, canonicalWebpackInteropBindings, isCanonicalGetter, isInstalledBeforeEntryDispatch, bootstrapProofForLoaderCall, sameBinding, getterReturnsDefault, getterReturnsModule, bootstrapExternals, proveBootstrapExternals, externalSpecifier, singleDefinition;
function init_javascriptBundledRequireOrigin() {
	return (init_javascriptBundledRequireOrigin = __esmMin((() => {
		init_javascriptBootstrap();
		init_javascriptBootstrapIntegrity();
		init_javascriptAstValues();
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticState();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticTraversal();
		proofs = new WeakMap();
		semanticBundledRequireOrigin = (node, state) => {
			const chain = semanticMemberChain(node);
			const current = chain?.root;
			if (chain?.members.length === 0 && t.isCallExpression(current) && t.isMemberExpression(current.callee) && semanticStaticPropertyKey(current.callee.property, current.callee.computed) === "n" && t.isIdentifier(current.callee.object) && current.arguments.length === 1) {
				const nested = semanticBundledRequireOrigin(current.arguments[0], state);
				const loaderBinding = resolveSemanticBindingState(state, current.callee.object, current.callee.object.name);
				const proof = nested === undefined || loaderBinding === undefined ? undefined : bootstrapProofForLoaderCall(nested.call, loaderBinding.bindingId, state);
				const nestedCallee = nested?.call.callee;
				const loaderBindingId = loaderBinding?.bindingId;
				if (nested !== undefined && nested.origin.importedPath.length === 0 && t.isIdentifier(nestedCallee) && loaderBindingId !== undefined && loaderBindingId === resolveSemanticBindingState(state, nestedCallee, nestedCallee.name)?.bindingId && proof?.loaderBindingIds.has(loaderBindingId) === true && proof.interopGetterBindingIds.has(loaderBindingId)) return nested;
			}
			if (chain === undefined || !t.isCallExpression(current) || !t.isIdentifier(current.callee) || current.arguments.length !== 1) return undefined;
			const key = argumentValue(current.arguments[0]);
			if (key === undefined) return undefined;
			const loader = current.callee;
			if (semanticResolutionBlocked(state, loader, loader.name)) return undefined;
			const binding = resolveSemanticBindingState(state, loader, loader.name);
			if (binding === undefined || binding.definitions.length !== 1 || binding.definitions[0]?.kind === "assignment") return undefined;
			for (let ancestor = state.parentsByNode.get(current); ancestor !== undefined; ancestor = state.parentsByNode.get(ancestor)) {
				if (!t.isCallExpression(ancestor)) continue;
				const proof = bootstrapExternals(ancestor, state);
				if (proof === null || !proof.loaderBindingIds.has(binding.bindingId)) continue;
				const specifier = proof.externals.get(key);
				return typeof specifier === "string" ? {
					origin: {
						specifier,
						importedPath: chain.members,
						resolutionMode: "require"
					},
					call: current
				} : undefined;
			}
			return undefined;
		};
		canonicalWebpackInteropBindings = (loaderBindingIds, bootstrapBody, state) => {
			const writes = new Map();
			let reflectiveWrite = false;
			traverseJavaScriptAst(state.program, { enter: (node) => {
				if (t.isAssignmentExpression(node) && t.isMemberExpression(node.left)) {
					const target = node.left;
					const bindingId = t.isIdentifier(target.object) ? resolveSemanticBindingState(state, target.object, target.object.name)?.bindingId : undefined;
					if (semanticStaticPropertyKey(target.property, target.computed) === "n" && bindingId !== undefined && loaderBindingIds.has(bindingId)) writes.set(bindingId, [...writes.get(bindingId) ?? [], node]);
				}
				if (!t.isCallExpression(node) || !t.isMemberExpression(node.callee) || !t.isIdentifier(node.callee.object, { name: "Object" }) || ![
					"defineProperty",
					"defineProperties",
					"assign",
					"setPrototypeOf"
				].includes(semanticStaticPropertyKey(node.callee.property, node.callee.computed) ?? "") || !t.isIdentifier(node.arguments[0])) return;
				reflectiveWrite ||= loaderBindingIds.has(resolveSemanticBindingState(state, node.arguments[0], node.arguments[0].name)?.bindingId ?? "");
			} });
			const proven = new Set();
			if (reflectiveWrite) return proven;
			const allWrites = [...writes.values()].flat();
			const [write] = allWrites;
			if (allWrites.length === 1 && write !== undefined && isInstalledBeforeEntryDispatch(write, bootstrapBody, loaderBindingIds, state) && isCanonicalGetter(write, state)) for (const bindingId of loaderBindingIds) proven.add(bindingId);
			return proven;
		};
		isCanonicalGetter = (write, state) => {
			if (!t.isArrowFunctionExpression(write.right) || write.right.params.length !== 1 || !t.isIdentifier(write.right.params[0])) return false;
			const parameter = write.right.params[0];
			const parameterBinding = resolveSemanticBindingState(state, parameter, parameter.name);
			const body = write.right.body;
			return parameterBinding !== undefined && t.isConditionalExpression(body) && t.isLogicalExpression(body.test, { operator: "&&" }) && sameBinding(body.test.left, parameterBinding.bindingId, state) && t.isMemberExpression(body.test.right) && semanticStaticPropertyKey(body.test.right.property, body.test.right.computed) === "__esModule" && sameBinding(body.test.right.object, parameterBinding.bindingId, state) && getterReturnsDefault(body.consequent, parameterBinding.bindingId, state) && getterReturnsModule(body.alternate, parameterBinding.bindingId, state);
		};
		isInstalledBeforeEntryDispatch = (write, body, loaderBindingIds, state) => {
			const statement = state.parentsByNode.get(write);
			if (!t.isExpressionStatement(statement)) return false;
			const writeIndex = body.body.indexOf(statement);
			if (writeIndex < 0) return false;
			let entryIndex = -1;
			for (let index = 0; index < body.body.length; index += 1) {
				const topLevel = body.body[index];
				if (topLevel === undefined) continue;
				traverseJavaScriptAst(topLevel, { enter: (node, _parent, ancestors) => {
					if (entryIndex < 0 && t.isCallExpression(node) && t.isIdentifier(node.callee) && ancestors().every((ancestor) => !t.isFunction(ancestor)) && loaderBindingIds.has(resolveSemanticBindingState(state, node.callee, node.callee.name)?.bindingId ?? "")) entryIndex = index;
				} });
				if (entryIndex >= 0) break;
			}
			return entryIndex > writeIndex;
		};
		bootstrapProofForLoaderCall = (call, loaderBindingId, state) => {
			for (let ancestor = state.parentsByNode.get(call); ancestor !== undefined; ancestor = state.parentsByNode.get(ancestor)) {
				if (!t.isCallExpression(ancestor)) continue;
				const proof = bootstrapExternals(ancestor, state);
				if (proof?.loaderBindingIds.has(loaderBindingId)) return proof;
			}
			return undefined;
		};
		sameBinding = (node, bindingId, state) => t.isIdentifier(node) && resolveSemanticBindingState(state, node, node.name)?.bindingId === bindingId;
		getterReturnsDefault = (node, bindingId, state) => t.isArrowFunctionExpression(node) && node.params.length === 0 && t.isMemberExpression(node.body) && semanticStaticPropertyKey(node.body.property, node.body.computed) === "default" && sameBinding(node.body.object, bindingId, state);
		getterReturnsModule = (node, bindingId, state) => t.isArrowFunctionExpression(node) && node.params.length === 0 && sameBinding(node.body, bindingId, state);
		bootstrapExternals = (call, state) => {
			let byCall = proofs.get(state);
			if (byCall === undefined) {
				byCall = new WeakMap();
				proofs.set(state, byCall);
			}
			const cached = byCall.get(call);
			if (cached !== undefined) return cached;
			const proof = proveBootstrapExternals(call, state);
			byCall.set(call, proof);
			return proof;
		};
		proveBootstrapExternals = (call, state) => {
			const bootstrap = javascriptBootstrapAt(call, state);
			if (bootstrap === undefined || !singleDefinition(state, bootstrap.loaderBindingId, "function")) return null;
			const loaderBindingIds = new Set([bootstrap.loaderBindingId]);
			const factories = bootstrap.table.properties.flatMap((property) => {
				const factory = moduleFactory(property);
				return factory === undefined ? [] : [{
					property,
					factory
				}];
			});
			for (const { factory } of factories) {
				const loaderParameter = factory.params[2];
				const bindingId = t.isIdentifier(loaderParameter) ? resolveSemanticBindingState(state, loaderParameter, loaderParameter.name)?.bindingId : undefined;
				if (bindingId !== undefined && singleDefinition(state, bindingId, "parameter")) loaderBindingIds.add(bindingId);
			}
			const integrity = proveJavaScriptBootstrapIntegrity(call, bootstrap, loaderBindingIds, state);
			if (integrity === undefined) return null;
			const externals = new Map();
			for (const { property, factory } of factories) {
				const key = modulePropertyName(property);
				const specifier = integrity.replacedKeys.has(key) ? undefined : externalSpecifier(factory, state);
				if (externals.has(key)) externals.set(key, null);
				else externals.set(key, specifier ?? null);
			}
			return {
				loaderBindingIds,
				interopGetterBindingIds: canonicalWebpackInteropBindings(loaderBindingIds, bootstrap.body, state),
				externals
			};
		};
		externalSpecifier = (factory, state) => {
			const moduleParameter = factory.params[0];
			const names = factory.params.map((parameter) => t.isIdentifier(parameter) ? parameter.name : null);
			if (!t.isIdentifier(moduleParameter) || new Set(names).size !== names.length || factory.generator || factory.async || t.isObjectMethod(factory) && factory.kind !== "method") return undefined;
			let expression;
			if (t.isBlockStatement(factory.body)) {
				const [statement] = factory.body.body;
				if (factory.body.body.length !== 1 || !t.isExpressionStatement(statement)) return undefined;
				expression = statement.expression;
			} else expression = factory.body;
			if (!t.isAssignmentExpression(expression, { operator: "=" }) || !t.isMemberExpression(expression.left) || !t.isIdentifier(expression.left.object) || semanticStaticPropertyKey(expression.left.property, expression.left.computed) !== "exports") return undefined;
			const moduleBinding = resolveSemanticBindingState(state, moduleParameter, moduleParameter.name);
			const target = resolveSemanticBindingState(state, expression.left.object, expression.left.object.name);
			if (moduleBinding === undefined || target?.bindingId !== moduleBinding.bindingId) return undefined;
			const required = semanticRequireOrigin(expression.right, state)?.origin;
			return required !== undefined && required.importedPath.length === 0 ? required.specifier : undefined;
		};
		singleDefinition = (state, bindingId, kind) => {
			const definitions = state.bindingsById.get(bindingId)?.definitions;
			return definitions?.length === 1 && definitions[0]?.kind === kind;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallableResults.js
var semanticCallableResultExpressions;
function init_javascriptSemanticCallableResults() {
	return (init_javascriptSemanticCallableResults = __esmMin((() => {
		init_javascriptSemanticTraversal();
		semanticCallableResultExpressions = (callable) => {
			if (t.isArrowFunctionExpression(callable) && !t.isBlockStatement(callable.body)) return [{
				node: callable.body,
				site: callable.body,
				kind: "return",
				delegated: false
			}];
			if (!t.isFunction(callable)) return [];
			const output = [];
			const pending = childNodes(callable.body).reverse();
			while (pending.length > 0) {
				const node = pending.pop();
				if (node === undefined || t.isFunction(node) || t.isClass(node)) continue;
				if (t.isReturnStatement(node)) {
					output.push({
						node: node.argument ?? null,
						site: node,
						kind: "return",
						delegated: false
					});
				}
				if (t.isYieldExpression(node)) output.push({
					node: node.argument ?? null,
					site: node,
					kind: "yield",
					delegated: node.delegate
				});
				for (const child of childNodes(node).reverse()) pending.push(child);
			}
			return output;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReferenceSources.js
var semanticReferenceSourcesInactive, semanticSelectedReferenceSlot;
function init_javascriptSemanticReferenceSources() {
	return (init_javascriptSemanticReferenceSources = __esmMin((() => {
		init_javascriptSemanticValues();
		init_javascriptSemanticSlots();
		semanticReferenceSourcesInactive = (reference, state) => reference.requiredSources?.some((source) => semanticSelectedReferenceSlot(source, state, source.node)?.presence === "absent") === true || reference.fallbackSources?.some((source) => {
			const slot = semanticSelectedReferenceSlot(source, state, source.node);
			return slot?.presence === "present" && (slot.value.status === "literal" || slot.value.status === "union" || slot.value.status === "object" || slot.value.status === "array");
		}) === true;
		semanticSelectedReferenceSlot = (source, state, capturePoint) => {
			const path = [];
			for (const key of source.projection) {
				if (key === null || typeof key === "object") return undefined;
				path.push(String(key));
			}
			return semanticSlotAtPath(evaluateSemanticExpression(source.node, state, capturePoint), path);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticObjectReferences.js
var semanticClassCandidates, instanceFieldReferences, classPropertyDescriptors, semanticClassPropertyReferences, objectReceiverReference, privateReceiverProjection, getterResultReferences, semanticObjectPropertyReferences, objectExpressionDefinesKey;
function init_javascriptSemanticObjectReferences() {
	return (init_javascriptSemanticObjectReferences = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		semanticClassCandidates = (root, state) => {
			const pending = [root];
			const seenNodes = new Set();
			const seenBindings = new Set();
			const classes = [];
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const node = pending[cursor];
				if (node === undefined) continue;
				const expression = unwrapJavaScriptExpression(node).node;
				if (seenNodes.has(expression)) continue;
				seenNodes.add(expression);
				if (t.isClass(expression)) {
					classes.push(expression);
				} else if (t.isIdentifier(expression)) {
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					if (binding === undefined || seenBindings.has(binding.bindingId)) continue;
					seenBindings.add(binding.bindingId);
					for (const initializer of binding.initializers) pending.push(initializer.node);
				} else if (t.isConditionalExpression(expression) || t.isLogicalExpression(expression)) {
					pending.push(t.isConditionalExpression(expression) ? expression.consequent : expression.left, t.isConditionalExpression(expression) ? expression.alternate : expression.right);
				} else if (t.isSequenceExpression(expression)) {
					const last = expression.expressions.at(-1);
					if (last !== undefined) pending.push(last);
				}
			}
			return classes;
		};
		instanceFieldReferences = (root, propertyName, path, state, initializedBefore) => {
			const references = [];
			const pending = [{
				klass: root,
				excluded: new Set()
			}];
			const selections = new Map();
			let definiteNames;
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) continue;
				const previous = selections.get(current.klass);
				const excluded = previous === undefined ? current.excluded : new Set([...previous].filter((name) => current.excluded.has(name)));
				if (previous !== undefined && previous.size === excluded.size) continue;
				selections.set(current.klass, excluded);
				const shadowed = new Set(excluded);
				const before = initializedBefore === undefined ? -1 : current.klass.body.body.indexOf(initializedBefore);
				const members = before < 0 ? current.klass.body.body : current.klass.body.body.slice(0, before);
				for (const member of [...members].reverse()) {
					if (!t.isClassProperty(member) || member.static) continue;
					const key = semanticStaticPropertyKey(member.key, member.computed);
					if (key !== null && shadowed.has(key)) continue;
					if (key !== null) shadowed.add(key);
					if ((propertyName === null || key === null || key === propertyName) && member.value != null) references.push({
						node: member.value,
						path
					});
				}
				const bases = current.klass.superClass == null ? [] : semanticClassCandidates(current.klass.superClass, state);
				if (bases.length === 0) definiteNames = definiteNames === undefined ? shadowed : new Set([...definiteNames].filter((name) => shadowed.has(name)));
				for (const klass of bases) pending.push({
					klass,
					excluded: shadowed
				});
			}
			return {
				references,
				definiteNames: definiteNames ?? new Set()
			};
		};
		classPropertyDescriptors = (klass, propertyName, kind, initializedBefore) => {
			const isStatic = kind === "static";
			const selectedGetters = [];
			const fields = [];
			const indexedMembers = [];
			const before = initializedBefore === undefined ? -1 : klass.body.body.indexOf(initializedBefore);
			klass.body.body.forEach((member, index) => {
				if (before >= 0 && index >= before && t.isClassProperty(member)) return;
				if ((t.isClassMethod(member) || kind === "static" && t.isClassProperty(member)) && member.static === isStatic) indexedMembers.push({
					member,
					index,
					key: semanticStaticPropertyKey(member.key, member.computed)
				});
			});
			const matchingMembers = propertyName === null ? [] : indexedMembers.filter(({ key }) => key === propertyName);
			const uncertainGetters = indexedMembers.filter((entry) => {
				const { member, key } = entry;
				return t.isClassMethod(member) && member.kind === "get" && (propertyName === null || member.computed && key === null);
			});
			const getters = matchingMembers.filter((entry) => t.isClassMethod(entry.member) && entry.member.kind === "get");
			const getter = getters.at(-1);
			const getterIndex = getter?.index ?? -1;
			const laterDataMember = matchingMembers.some(({ member, index }) => t.isClassProperty(member) || t.isClassMethod(member) && member.kind === "method" && index > getterIndex);
			const seenFields = new Set();
			for (const { member, key } of [...indexedMembers].reverse()) {
				if (!t.isClassProperty(member)) continue;
				if (key !== null && seenFields.has(key)) continue;
				if (key !== null) seenFields.add(key);
				if (propertyName === null || key === null || key === propertyName) fields.push(member);
			}
			if (getters.length > 0 && !laterDataMember && getter !== undefined) selectedGetters.push(getter.member);
			for (const { member, index } of uncertainGetters) if (!matchingMembers.some(({ member: matching, index: matchingIndex }) => (t.isClassProperty(matching) || t.isClassMethod(matching) && (matching.kind === "method" || matching.kind === "get")) && matchingIndex > index)) selectedGetters.push(member);
			return {
				getters: selectedGetters,
				fields,
				inherits: matchingMembers.length === 0
			};
		};
		semanticClassPropertyReferences = (lookup, selection, state, activeGetters = new Map()) => {
			const root = lookup.owner;
			const receiver = lookup.receiver ?? root;
			const [key, ...path] = selection;
			const propertyName = key == null || typeof key === "object" ? null : String(key);
			const pending = [root];
			const seen = new Set();
			const possibleResults = [];
			let instanceFields = new Set();
			if (lookup.kind === "instance") {
				const fields = instanceFieldReferences(root, propertyName, path, state, lookup.initializedBefore);
				possibleResults.push(...fields.references);
				instanceFields = fields.definiteNames;
				if (propertyName !== null && instanceFields.has(propertyName)) return possibleResults;
			}
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const klass = pending[cursor];
				if (klass === undefined || seen.has(klass)) continue;
				seen.add(klass);
				const descriptors = classPropertyDescriptors(klass, propertyName, lookup.kind, lookup.initializedBefore);
				for (const field of descriptors.fields) if (field.value != null) possibleResults.push({
					node: field.value,
					path
				});
				for (const getter of lookup.fieldsOnly ? [] : descriptors.getters) {
					const key = semanticStaticPropertyKey(getter.key, getter.computed);
					if (key !== null && instanceFields.has(key)) continue;
					possibleResults.push(...getterResultReferences({
						getter,
						owner: klass,
						receiver
					}, path, state, activeGetters));
				}
				if (descriptors.inherits && klass.superClass !== null && klass.superClass !== undefined) pending.push(...semanticClassCandidates(klass.superClass, state));
			}
			return possibleResults;
		};
		objectReceiverReference = (object, path, state) => {
			let current = object;
			const projection = [];
			while (true) {
				const parent = state.parentsByNode.get(current);
				if (t.isVariableDeclarator(parent) && parent.init === current && t.isIdentifier(parent.id)) return [{
					node: parent.id,
					path: [...projection, ...path],
					ownerInitializer: current
				}];
				if (t.isAssignmentExpression(parent, { operator: "=" }) && parent.right === current && t.isIdentifier(parent.left)) return [{
					node: parent.left,
					path: [...projection, ...path],
					ownerInitializer: current
				}];
				if (t.isArrayExpression(parent)) {
					let minimumIndex = 0;
					let uncertainIndex = false;
					for (const element of parent.elements) {
						if (element === current) break;
						if (t.isSpreadElement(element)) uncertainIndex = true;
						else minimumIndex++;
					}
					projection.unshift(uncertainIndex ? {
						excludedKeys: [],
						startIndex: minimumIndex
					} : minimumIndex);
					current = parent;
					continue;
				}
				if (t.isObjectProperty(parent) && parent.value === current) {
					projection.unshift(semanticStaticPropertyKey(parent.key, parent.computed));
					const container = state.parentsByNode.get(parent);
					if (t.isObjectExpression(container)) {
						current = container;
						continue;
					}
				}
				break;
			}
			return [{
				node: object,
				path
			}];
		};
		privateReceiverProjection = (receiver, owner, path, isStatic, state) => {
			if (path.some((key) => key === null || typeof key === "object")) return false;
			const pending = [{
				receiver,
				path: path.map((key) => ({ key: String(key) })),
				visits: new Map()
			}];
			const seen = new Set();
			const declaringClass = (field) => {
				const body = state.parentsByNode.get(field);
				return body === undefined ? undefined : state.parentsByNode.get(body);
			};
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) break;
				const [selection, ...remaining] = current.path;
				if (selection === undefined) {
					if (!isStatic || current.receiver === owner) return true;
					continue;
				}
				const origin = JSON.stringify([
					current.receiver.start,
					selection.key,
					selection.before?.start
				]);
				const previous = current.visits.get(origin);
				if (previous !== undefined && previous <= current.path.length) continue;
				const visits = new Map(current.visits).set(origin, current.path.length);
				const identity = JSON.stringify([current.receiver.start, current.path.map(({ key, before }) => [key, before?.start])]);
				if (seen.has(identity)) continue;
				seen.add(identity);
				const lookupOwner = selection.before === undefined ? current.receiver : declaringClass(selection.before);
				if (!t.isClass(lookupOwner)) continue;
				for (const reference of semanticClassPropertyReferences({
					owner: lookupOwner,
					receiver: current.receiver,
					kind: isStatic ? "static" : "instance",
					fieldsOnly: true,
					...selection.before === undefined ? {} : { initializedBefore: selection.before }
				}, [selection.key], state)) {
					const field = state.parentsByNode.get(reference.node);
					if (!t.isClassProperty(field)) continue;
					const fieldOwner = declaringClass(field);
					if (!t.isClass(fieldOwner)) continue;
					const projection = [];
					let value = unwrapJavaScriptExpression(reference.node).node;
					while (t.isMemberExpression(value) || t.isOptionalMemberExpression(value)) {
						const key = semanticStaticPropertyKey(value.property, value.computed);
						if (key === null || t.isPrivateName(value.property)) break;
						projection.unshift({
							key,
							before: field
						});
						value = unwrapJavaScriptExpression(value.object).node;
					}
					if (!t.isThisExpression(value)) continue;
					pending.push({
						receiver: isStatic ? fieldOwner : current.receiver,
						path: [...projection, ...remaining],
						visits
					});
				}
			}
			return false;
		};
		getterResultReferences = (invocation, path, state, activeGetters = new Map()) => {
			const { getter, owner, receiver = owner } = invocation;
			const previousLength = activeGetters.get(getter);
			if (previousLength !== undefined && previousLength <= path.length) return [];
			const active = new Map(activeGetters).set(getter, path.length);
			const isStatic = t.isClassMethod(getter) && getter.static;
			const pending = semanticCallableResultExpressions(getter).flatMap(({ node }) => node === null ? [] : [{
				node,
				path,
				aliases: undefined
			}]);
			const references = [];
			const expandedAliases = new Map();
			const getterScope = state.scopeByNode.get(getter)?.scopeId;
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) break;
				const { path: remaining } = current;
				const expression = unwrapJavaScriptExpression(current.node).node;
				const retain = (reference) => {
					references.push(current.escapes ? {
						...reference,
						escapes: true
					} : reference);
				};
				const retainPrivateRead = () => {
					if (current.privateRead !== undefined) retain({
						node: current.privateRead.node,
						path: current.escapes ? [] : current.privateRead.path
					});
				};
				if (t.isIdentifier(expression)) {
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					let scope = binding === undefined ? undefined : state.scopesById.get(binding.scopeId);
					while (scope !== undefined && scope.scopeId !== getterScope) {
						if (scope.kind === "function" || scope.parentScopeId === null) {
							scope = undefined;
							break;
						}
						scope = state.scopesById.get(scope.parentScopeId);
					}
					if (binding !== undefined && scope !== undefined && binding.referenceInitializers.every((initializer) => initializer.copyKind === undefined)) {
						const identity = JSON.stringify([
							binding.bindingId,
							expression.start,
							expression.end
						]);
						const known = expandedAliases.get(identity);
						const key = JSON.stringify([
							remaining,
							current.privateRead?.name,
							current.privateRead?.path,
							current.escapes
						]);
						let cyclic = false;
						let growing = false;
						if (known !== undefined) {
							for (let visit = current.aliases; visit !== undefined; visit = visit.parent) if (visit.identity === identity) {
								cyclic = true;
								growing = remaining.length > visit.pathLength;
								break;
							}
						}
						if (cyclic) {
							if (growing && !current.escapes) pending.push({
								...current,
								path: [],
								aliases: undefined,
								escapes: true
							});
							continue;
						}
						if (known?.has(key)) continue;
						const selections = known ?? new Set();
						selections.add(key);
						expandedAliases.set(identity, selections);
						const aliases = {
							identity,
							pathLength: remaining.length,
							parent: current.aliases
						};
						const origins = semanticReadInitializers(binding, expression, state.parentsByNode);
						for (const initializer of [...origins.initializers, ...origins.referenceInitializers.filter((initializer) => !semanticReferenceSourcesInactive(initializer, state))]) pending.push({
							...current,
							node: initializer.node,
							path: [...initializer.projection, ...remaining],
							aliases
						});
						continue;
					}
				}
				if (t.isThisExpression(expression)) {
					let ownerNode = state.parentsByNode.get(expression);
					while (ownerNode !== undefined && !t.isClass(ownerNode) && !(t.isFunction(ownerNode) && !t.isArrowFunctionExpression(ownerNode))) ownerNode = state.parentsByNode.get(ownerNode);
					if (ownerNode !== getter) continue;
					if (current.privateRead !== undefined && t.isClass(owner)) {
						if (!t.isClass(receiver) || !privateReceiverProjection(receiver, owner, remaining, isStatic, state)) {
							retainPrivateRead();
							continue;
						}
						for (const member of owner.body.body) if (t.isClassPrivateProperty(member) && member.static === isStatic && member.key.id.name === current.privateRead.name && member.value != null) retain({
							node: member.value,
							path: current.escapes ? [] : current.privateRead.path
						});
						continue;
					}
					for (const reference of t.isClass(receiver) ? semanticClassPropertyReferences({
						owner: receiver,
						kind: isStatic ? "static" : "instance"
					}, remaining, state, active) : objectReceiverReference(receiver, remaining, state)) retain(reference);
					continue;
				}
				if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) {
					if (current.privateRead !== undefined && t.isPrivateName(expression.property)) {
						retainPrivateRead();
						continue;
					}
					if (t.isPrivateName(expression.property) && t.isClass(owner)) {
						pending.push({
							...current,
							node: expression.object,
							path: [],
							privateRead: {
								node: expression,
								name: expression.property.id.name,
								path: remaining
							}
						});
						continue;
					}
					const key = semanticStaticPropertyKey(expression.property, expression.computed);
					if (t.isSuper(expression.object) && t.isClass(owner) && owner.superClass != null) {
						for (const base of semanticClassCandidates(owner.superClass, state)) for (const reference of semanticClassPropertyReferences({
							owner: base,
							receiver: t.isClass(receiver) ? receiver : owner,
							kind: isStatic ? "static" : "prototype"
						}, [key, ...remaining], state, active)) retain(reference);
						continue;
					}
					pending.push({
						...current,
						node: expression.object,
						path: [key, ...remaining]
					});
				} else if (t.isConditionalExpression(expression)) pending.push({
					...current,
					node: expression.consequent
				}, {
					...current,
					node: expression.alternate
				});
				else if (t.isLogicalExpression(expression)) pending.push({
					...current,
					node: expression.left
				}, {
					...current,
					node: expression.right
				});
				else if (t.isSequenceExpression(expression)) {
					const last = expression.expressions.at(-1);
					if (last !== undefined) pending.push({
						...current,
						node: last
					});
				} else if (t.isAssignmentExpression(expression, { operator: "=" })) pending.push({
					...current,
					node: expression.right
				});
				else if (t.isAssignmentExpression(expression) && [
					"&&=",
					"||=",
					"??="
				].includes(expression.operator)) pending.push({
					...current,
					node: expression.left
				}, {
					...current,
					node: expression.right
				});
				else if (current.privateRead !== undefined) retainPrivateRead();
				else retain({
					node: expression,
					path: remaining
				});
			}
			return references;
		};
		semanticObjectPropertyReferences = (node, path, state) => {
			const [key, ...remaining] = path;
			const references = [];
			const overwritten = new Set();
			const dataOverwritten = new Set();
			const accessorNames = new Set();
			const getterNames = new Set();
			const setterNames = new Set();
			for (const property of [...node.properties].reverse()) {
				if (t.isSpreadElement(property)) {
					const selected = key ?? null;
					if (typeof selected !== "object" && overwritten.has(String(selected))) continue;
					references.push({
						node: property.argument,
						path: [typeof selected === "object" ? {
							...selected,
							excludedKeys: [...new Set([...selected?.excludedKeys ?? [], ...overwritten])].sort(compareUnicodeCodePoints)
						} : selected, ...remaining]
					});
					if (selected !== null && typeof selected !== "object" && t.isObjectExpression(property.argument) && objectExpressionDefinesKey(property.argument, String(selected))) {
						overwritten.add(String(selected));
						dataOverwritten.add(String(selected));
					}
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__") {
					const selected = key ?? null;
					if ((selected === null || typeof selected === "object") && t.isExpression(property.value)) {
						references.push({
							node: property.value,
							path: [selected, ...remaining]
						});
					} else if (typeof selected === "string" && !objectExpressionDefinesKey(node, selected) && t.isExpression(property.value)) {
						references.push({
							node: property.value,
							path: [selected, ...remaining]
						});
					}
					continue;
				}
				const isGetter = t.isObjectMethod(property) && property.kind === "get";
				const isSetter = t.isObjectMethod(property) && property.kind === "set";
				if (name !== null && (isGetter || isSetter ? dataOverwritten.has(name) || (isGetter ? getterNames.has(name) : setterNames.has(name)) : dataOverwritten.has(name) || accessorNames.has(name))) continue;
				if (name === null || semanticPropertyPathKeyMatches(key ?? null, name)) {
					if (t.isObjectMethod(property) && property.kind === "get") {
						references.push(...getterResultReferences({
							getter: property,
							owner: node
						}, remaining, state));
					} else if (t.isObjectMethod(property) && property.kind === "set") {} else {
						references.push({
							node: t.isObjectProperty(property) ? property.value : property,
							path: remaining
						});
					}
				}
				if (name !== null) {
					if (isGetter) {
						getterNames.add(name);
						accessorNames.add(name);
						overwritten.add(name);
					} else if (isSetter) {
						setterNames.add(name);
						accessorNames.add(name);
						overwritten.add(name);
					} else if (!(t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__")) {
						overwritten.add(name);
						dataOverwritten.add(name);
					}
				}
			}
			return references;
		};
		objectExpressionDefinesKey = (root, key) => {
			const pending = [root];
			const seen = new Set();
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const object = pending[cursor];
				if (object === undefined || seen.has(object)) continue;
				seen.add(object);
				for (const property of object.properties) {
					if (t.isSpreadElement(property)) {
						if (t.isObjectExpression(property.argument)) pending.push(property.argument);
						continue;
					}
					const name = semanticStaticPropertyKey(property.key, property.computed);
					if (name === key && !(t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__")) return true;
				}
			}
			return false;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticIterationSources.js
var add, project, visit, semanticIterationSources;
function init_javascriptSemanticIterationSources() {
	return (init_javascriptSemanticIterationSources = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		add = (sources, source, mutation, guards, kind = "iteration") => {
			sources.push({
				kind,
				node: source.node,
				projection: source.projection,
				mutation,
				...guards
			});
		};
		project = (source, key) => {
			if (source === undefined) return undefined;
			const index = key === null ? null : semanticArrayIndex(key);
			return {
				node: source.node,
				projection: [...source.projection, source.restStartIndex !== undefined && index !== null ? source.restStartIndex + index : key]
			};
		};
		visit = (context, pattern, source, guards = {}) => {
			const { sources, mutation } = context;
			if (t.isMemberExpression(pattern)) {
				if (source !== undefined) add(sources, source.restStartIndex === undefined ? source : {
					node: source.node,
					projection: [...source.projection, {
						excludedKeys: [],
						startIndex: source.restStartIndex
					}]
				}, mutation, guards, "reference-store");
				return;
			}
			if (t.isTSParameterProperty(pattern)) {
				visit(context, pattern.parameter, source, guards);
				return;
			}
			if (t.isAssignmentPattern(pattern)) {
				visit(context, pattern.left, source, {
					...guards,
					requiredSources: [...guards.requiredSources ?? [], ...source === undefined ? [] : [source]]
				});
				visit(context, pattern.left, {
					node: pattern.right,
					projection: []
				}, {
					...guards,
					fallbackSources: [...guards.fallbackSources ?? [], ...source === undefined ? [] : [source]]
				});
				return;
			}
			if (t.isObjectPattern(pattern)) {
				for (const property of pattern.properties) {
					if (t.isRestElement(property)) {
						visit(context, property.argument, source === undefined ? undefined : {
							node: source.node,
							projection: [...source.projection, { excludedKeys: [...new Set(semanticObjectPatternKeys(pattern))].sort(compareUnicodeCodePoints) }]
						}, guards);
						continue;
					}
					visit(context, property.value, project(source, semanticStaticPropertyKey(property.key, property.computed)), guards);
				}
				return;
			}
			if (t.isArrayPattern(pattern)) {
				if (source !== undefined && source.restStartIndex === undefined) add(sources, source, mutation, guards);
				pattern.elements.forEach((element, index) => {
					if (element === null) return;
					if (t.isRestElement(element)) visit(context, element.argument, source === undefined ? undefined : {
						node: source.node,
						projection: source.projection,
						restStartIndex: (source.restStartIndex ?? 0) + index
					}, guards);
					else visit(context, element, project(source, index), guards);
				});
				return;
			}
			if (t.isRestElement(pattern)) visit(context, pattern.argument, undefined, guards);
		};
		semanticIterationSources = (node, parent) => {
			const sources = [];
			const context = {
				sources,
				mutation: node
			};
			if (t.isVariableDeclarator(node) && node.init != null) visit(context, node.id, {
				node: node.init,
				projection: []
			});
			else if (t.isAssignmentExpression(node) && [
				"=",
				"||=",
				"&&=",
				"??="
			].includes(node.operator)) visit(context, node.left, {
				node: node.right,
				projection: []
			});
			else if (t.isForOfStatement(node)) {
				add(sources, {
					node: node.right,
					projection: []
				}, node, {});
				const source = {
					node: node.right,
					projection: [null]
				};
				if (t.isVariableDeclaration(node.left)) {
					for (const declaration of node.left.declarations) visit(context, declaration.id, source);
				} else visit(context, node.left, source);
			} else if (t.isSpreadElement(node) && t.isArrayExpression(parent)) add(sources, {
				node: node.argument,
				projection: []
			}, node, {});
			else if (t.isYieldExpression(node) && node.delegate && node.argument != null) add(sources, {
				node: node.argument,
				projection: []
			}, node, {});
			else if (t.isFunction(node)) for (const parameter of runtimeFunctionParameters(node)) visit(context, parameter, undefined);
			return sources;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallResolution.js
var resolveLocalCallables, resolveCallables, resolveIdentifier, resolveAlternatives, resolveBindingCallables, missingBindingInitializer, parameterBindings, parameterAcceptsArgument, rangeContains, uniqueCallableIds;
function init_javascriptSemanticCallResolution() {
	return (init_javascriptSemanticCallResolution = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptStaticAnalysisHelpers();
		resolveLocalCallables = (input) => resolveCallables(input.node, {
			state: input.state,
			callableById: input.callableById,
			seenBindings: input.seenBindings,
			bindingCache: input.bindingCache
		});
		resolveCallables = (node, context) => {
			const unwrapped = unwrapJavaScriptExpression(node).node;
			if (unwrapped !== node) return resolveCallables(unwrapped, context);
			const direct = semanticCallableIdForNode(node);
			if (direct !== null && context.callableById.has(direct)) return {
				callableIds: [direct],
				complete: true,
				reason: "Direct local callable."
			};
			if (t.isIdentifier(node)) return resolveIdentifier(node, context);
			if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) return resolveAlternatives(t.isConditionalExpression(node) ? node.consequent : node.left, t.isConditionalExpression(node) ? node.alternate : node.right, context);
			return {
				callableIds: [],
				complete: false,
				reason: `Unsupported ${node.type} call target.`
			};
		};
		resolveIdentifier = (node, context) => {
			const binding = resolveSemanticBindingState(context.state, node, node.name);
			return binding === undefined ? {
				callableIds: [],
				complete: false,
				reason: `Unresolved call target ${node.name}.`
			} : resolveBindingCallables(binding, context);
		};
		resolveAlternatives = (left, right, context) => {
			const candidates = [left, right].map((candidate) => resolveCallables(candidate, context));
			return {
				callableIds: uniqueCallableIds(candidates.flatMap(({ callableIds }) => callableIds)),
				complete: candidates.every(({ complete }) => complete),
				reason: "Conditional or logical call target has multiple candidates."
			};
		};
		resolveBindingCallables = (binding, context) => {
			const cached = context.bindingCache.get(binding.bindingId);
			if (cached !== undefined) return cached;
			if (context.seenBindings.has(binding.bindingId)) return {
				callableIds: [],
				complete: false,
				reason: `Call target alias cycle at ${binding.name}.`
			};
			if (binding.initializers.length === 0) return missingBindingInitializer(binding);
			const candidateContext = {
				...context,
				seenBindings: new Set([...context.seenBindings, binding.bindingId])
			};
			const candidates = binding.initializers.map(({ node, projection }) => projection.length === 0 ? resolveCallables(node, candidateContext) : {
				callableIds: [],
				complete: false,
				reason: `Projected call target ${binding.name} is unresolved.`
			});
			const callableIds = uniqueCallableIds(candidates.flatMap((candidate) => candidate.callableIds));
			const resolution = {
				callableIds,
				complete: candidates.every(({ complete }) => complete),
				reason: callableIds.length === 1 && candidates.every(({ complete }) => complete) ? "Unique local callable target." : `Call target ${binding.name} has ambiguous or unsupported assignments.`
			};
			if (resolution.complete) context.bindingCache.set(binding.bindingId, resolution);
			return resolution;
		};
		missingBindingInitializer = (binding) => ({
			callableIds: [],
			complete: false,
			reason: binding.kind === "import" ? `Call target ${binding.name} is imported from outside this source.` : `Call target ${binding.name} has no local initializer.`
		});
		parameterBindings = (callable, index, state) => {
			if (callable.bodyScopeId === null) return [];
			const scope = state.scopesById.get(callable.bodyScopeId);
			if (scope === undefined) return [];
			return [...scope.bindings.values()].filter((binding) => binding.kind === "parameter" && binding.definitions.some(({ kind, location }) => kind === "parameter" && parameterAcceptsArgument(callable, location, index, state))).sort((left, right) => compareUnicodeCodePoints(left.bindingId, right.bindingId));
		};
		parameterAcceptsArgument = (callable, location, argumentIndex, state) => {
			const node = state.callableNodesById.get(callable.callableId);
			if (!t.isFunction(node)) return false;
			const parameters = runtimeFunctionParameters(node);
			const parameterIndex = parameters.findIndex((parameter) => rangeContains(range(parameter), location));
			if (parameterIndex === argumentIndex) return true;
			return parameterIndex >= 0 && parameterIndex < argumentIndex && t.isRestElement(parameters[parameterIndex]);
		};
		rangeContains = (outer, inner) => (outer.start.line < inner.start.line || outer.start.line === inner.start.line && outer.start.column <= inner.start.column) && (outer.end.line > inner.end.line || outer.end.line === inner.end.line && outer.end.column >= inner.end.column);
		uniqueCallableIds = (values) => [...new Set(values)].sort(compareUnicodeCodePoints);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReturnedReferences.js
var createSemanticReturnedReferences, selectObjectTargets, objectTargetIndex;
function init_javascriptSemanticReturnedReferences() {
	return (init_javascriptSemanticReturnedReferences = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticCallResolution();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticState();
		createSemanticReturnedReferences = (state) => {
			const callableById = new Map(state.callables.map((callable) => [callable.callableId, callable]));
			const bindingCache = new Map();
			const results = new WeakMap();
			const objectTargets = new WeakMap();
			return (callee) => {
				const existing = results.get(callee);
				if (existing !== undefined) return existing;
				const functions = new Set();
				const resolution = resolveLocalCallables({
					node: callee,
					state,
					callableById,
					bindingCache,
					seenBindings: new Set()
				});
				for (const id of resolution.callableIds) {
					const node = state.callableNodesById.get(id);
					if (node !== undefined) functions.add(node);
				}
				const pending = [{
					node: callee,
					path: [],
					bindings: new Set()
				}];
				const expanded = new WeakMap();
				for (let cursor = 0; cursor < pending.length; cursor++) {
					const item = pending[cursor];
					if (item === undefined) break;
					const node = unwrapJavaScriptExpression(item.node).node;
					const pathKey = JSON.stringify(item.path);
					const paths = expanded.get(node) ?? new Map();
					const contexts = paths.get(pathKey) ?? [];
					if (contexts.some((context) => [...context].every((binding) => item.bindings.has(binding)))) continue;
					paths.set(pathKey, [...contexts.filter((context) => ![...item.bindings].every((binding) => context.has(binding))), item.bindings]);
					expanded.set(node, paths);
					if (t.isIdentifier(node)) {
						const binding = resolveSemanticBindingState(state, node, node.name);
						if (binding === undefined || item.bindings.has(binding.bindingId)) continue;
						const bindings = new Set([...item.bindings, binding.bindingId]);
						for (const initializer of [...binding.initializers, ...binding.referenceInitializers]) pending.push({
							node: initializer.node,
							path: [...initializer.projection, ...item.path],
							bindings
						});
					} else if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
						const path = [];
						let receiver = node;
						while (t.isMemberExpression(receiver) || t.isOptionalMemberExpression(receiver)) {
							path.push(semanticStaticPropertyKey(receiver.property, receiver.computed));
							receiver = unwrapJavaScriptExpression(receiver.object).node;
						}
						pending.push({
							...item,
							node: receiver,
							path: [...path.reverse(), ...item.path]
						});
					} else if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
						pending.push({
							...item,
							node: t.isConditionalExpression(node) ? node.consequent : node.left
						}, {
							...item,
							node: t.isConditionalExpression(node) ? node.alternate : node.right
						});
					} else if (t.isSequenceExpression(node)) {
						const last = node.expressions.at(-1);
						if (last !== undefined) pending.push({
							...item,
							node: last
						});
					} else if (t.isFunction(node) && item.path.length === 0) functions.add(node);
					else if (t.isObjectExpression(node)) selectObjectTargets(node, item, pending, objectTargets);
					else if (t.isArrayExpression(node)) {
						const [key, ...path] = item.path;
						const index = key === undefined || key === null ? null : semanticArrayIndex(key);
						let uncertainOffset = false;
						node.elements.forEach((element, offset) => {
							if (element === null) return;
							if (t.isSpreadElement(element)) {
								uncertainOffset = true;
								pending.push({
									...item,
									node: element.argument,
									path: [null, ...path]
								});
							} else if (index === null || uncertainOffset || index === offset) pending.push({
								...item,
								node: element,
								path
							});
						});
					} else if (t.isNewExpression(node)) pending.push({
						...item,
						node: node.callee
					});
					else if (t.isClass(node)) {
						const [key, ...path] = item.path;
						for (const member of node.body.body) {
							if (t.isClassMethod(member)) {
								if (item.path.length === 0 && member.kind === "constructor" || key !== undefined && (key === null || semanticStaticPropertyKey(member.key, member.computed) === String(key))) pending.push({
									...item,
									node: member,
									path
								});
							} else if (t.isClassProperty(member) && member.value !== null && member.value !== undefined && key !== undefined && (key === null || semanticStaticPropertyKey(member.key, member.computed) === String(key))) pending.push({
								...item,
								node: member.value,
								path
							});
						}
						if (node.superClass !== null && node.superClass !== undefined) pending.push({
							...item,
							node: node.superClass
						});
					}
				}
				const output = [...functions].flatMap((node) => {
					const callables = t.isClass(node) ? node.body.body.filter((member) => t.isClassMethod(member) && member.kind === "constructor") : [node];
					return callables.flatMap((callable) => semanticCallableResultExpressions(callable).flatMap(({ node, delegated }) => node === null ? [] : [{
						node,
						projection: delegated ? [null] : []
					}]));
				});
				results.set(callee, output);
				return output;
			};
		};
		selectObjectTargets = (node, item, pending, indexes) => {
			const [key, ...path] = item.path;
			if (key !== null && key !== undefined) {
				const index = objectTargetIndex(node, indexes);
				const property = index.propertyByName.get(String(key));
				if (property !== undefined) {
					const unknowns = [];
					for (let unknown = index.trailingUnknownsByProperty.get(property); unknown !== undefined; unknown = unknown.previous) unknowns.push(unknown);
					for (const { node: unknown } of unknowns.reverse()) pending.push({
						...item,
						node: t.isSpreadElement(unknown) ? unknown.argument : t.isObjectProperty(unknown) ? unknown.value : unknown,
						...t.isSpreadElement(unknown) ? {} : { path }
					});
					pending.push({
						...item,
						node: t.isObjectProperty(property) ? property.value : property,
						path
					});
					return;
				}
			}
			let replaced = false;
			for (const property of [...node.properties].reverse()) {
				if (replaced) break;
				if (t.isSpreadElement(property)) {
					pending.push({
						...item,
						node: property.argument
					});
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (key !== null && key !== undefined && name !== null && name !== String(key)) continue;
				if (t.isObjectProperty(property)) pending.push({
					...item,
					node: property.value,
					path
				});
				else pending.push({
					...item,
					node: property,
					path
				});
				if (key !== null && key !== undefined && name === String(key)) replaced = true;
			}
		};
		objectTargetIndex = (node, indexes) => {
			const existing = indexes.get(node);
			if (existing !== undefined) return existing;
			const propertyByName = new Map();
			const trailingUnknownsByProperty = new Map();
			let trailingUnknown;
			for (const property of [...node.properties].reverse()) {
				if (t.isSpreadElement(property)) {
					trailingUnknown = {
						node: property,
						previous: trailingUnknown
					};
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) {
					trailingUnknown = {
						node: property,
						previous: trailingUnknown
					};
					continue;
				}
				if (propertyByName.has(name)) continue;
				propertyByName.set(name, property);
				if (trailingUnknown !== undefined) trailingUnknownsByProperty.set(property, trailingUnknown);
			}
			const created = {
				propertyByName,
				trailingUnknownsByProperty
			};
			indexes.set(node, created);
			return created;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMemberMutations.js
/** Preserve uncertainty from property writes and references exposed to calls, yielding during traversal and fixpoint iteration. */
function* collectSemanticMemberMutationsSteps(program, state) {
	const parents = state.parentsByNode;
	const observablePaths = observableMutationPaths(state);
	const returnedReferences = createSemanticReturnedReferences(state);
	const recordedRequiredEffects = new Set();
	let recordedEffectCount = 0;
	const recordRequiredEffect = (specifier, path, effect, node) => {
		const identity = semanticRequireExportsIdentity(specifier, path);
		if (effect === "escape" && identity.specifier === "process" && identity.path.length === 2 && (identity.path[0] === "env" || identity.path[0] === "argv")) return;
		const key = JSON.stringify([
			"required",
			identity.specifier,
			effect,
			identity.path,
			node?.start,
			node?.end
		]);
		if (recordedRequiredEffects.has(key)) return;
		recordedRequiredEffects.add(key);
		recordedEffectCount += 1;
		const effects = state.requiredModuleEffects.get(identity.specifier) ?? [];
		effects.push({
			path: identity.path,
			node,
			kind: effect
		});
		state.requiredModuleEffects.set(identity.specifier, effects);
	};
	for (const { path, node } of state.ambientWriteEffects) if (path[0] === "global" && path[1] === "process" && path.length > 2 && node !== undefined && semanticOriginalGlobalProcessAt(node, state)) recordRequiredEffect("node:process", path.slice(2), "write", node);
	const selections = new Map();
	const coveringPaths = new Map();
	let arrayIterationUnknown = false;
	const resolvedBindings = new WeakMap();
	const resolveBinding = (node, name) => {
		const cached = resolvedBindings.get(node);
		if (cached !== undefined) return cached ?? undefined;
		const resolved = resolveSemanticBindingState(state, node, name);
		resolvedBindings.set(node, resolved ?? null);
		return resolved;
	};
	const captureKeys = new WeakMap();
	const captureKeyOf = (binding, originAt, ownerInitializer) => {
		let byPosition = captureKeys.get(binding);
		if (byPosition === undefined) {
			byPosition = new Map();
			captureKeys.set(binding, byPosition);
		}
		const positionKey = `${originAt?.start ?? "u"}:${originAt?.end ?? "u"}:${ownerInitializer?.start ?? "u"}:${ownerInitializer?.end ?? "u"}`;
		const cached = byPosition.get(positionKey);
		if (cached !== undefined) return cached;
		const created = JSON.stringify([
			binding.bindingId,
			originAt?.start,
			originAt?.end,
			ownerInitializer?.start,
			ownerInitializer?.end
		]);
		byPosition.set(positionKey, created);
		return created;
	};
	const lifetimeKey = (captureKey, path) => `${captureKey.slice(0, -1)},${JSON.stringify(path)}]`;
	const pendingReferences = [];
	const iterableReferences = [];
	const iterableReferenceKeys = new WeakMap();
	const deferIterable = (reference) => {
		const keys = iterableReferenceKeys.get(reference.node) ?? new Set();
		const key = JSON.stringify([
			reference.projection,
			reference.path,
			reference.fallbackPath,
			reference.effect,
			reference.mutation?.start,
			reference.mutation?.end,
			reference.originAt?.start,
			reference.originAt?.end,
			reference.iterationOnly,
			reference.requiredSources?.map((source) => [
				source.node.start,
				source.node.end,
				source.projection
			]),
			reference.fallbackSources?.map((source) => [
				source.node.start,
				source.node.end,
				source.projection
			]),
			[...reference.bindings].sort(compareUnicodeCodePoints)
		]);
		if (keys.has(key)) return;
		keys.add(key);
		iterableReferenceKeys.set(reference.node, keys);
		iterableReferences.push(reference);
	};
	const markValue = (node, path, bindings, effect = "write", mutation, originAt = mutation, ownerInitializer) => {
		const pending = [{
			node,
			path,
			bindings,
			originAt,
			...ownerInitializer === undefined ? {} : { ownerInitializer }
		}];
		for (let cursor = 0; cursor < pending.length; cursor++) {
			const current = pending[cursor];
			if (current === undefined) break;
			const expression = unwrapJavaScriptExpression(current.node).node;
			const required = semanticRequireOrigin(expression, state);
			if (required !== undefined) {
				recordRequiredEffect(required.origin.specifier, [...required.origin.importedPath, ...current.path], effect, mutation);
				continue;
			}
			const globalProcess = semanticGlobalProcessPathOrigin(expression, state);
			if (globalProcess !== undefined) {
				recordRequiredEffect(globalProcess.specifier, [...globalProcess.importedPath, ...current.path], effect, mutation);
				continue;
			}
			if (t.isIdentifier(expression)) {
				const binding = resolveBinding(expression, expression.name);
				if (binding === undefined) {
					const processOrigin = semanticGlobalProcessOrigin(expression, state);
					if (processOrigin !== undefined) recordRequiredEffect(processOrigin.specifier, current.path, effect, mutation);
					if (expression.name === "Array" && (current.path[0] === "prototype" || current.path[0] === null) || [
						"globalThis",
						"global",
						"window",
						"self"
					].includes(expression.name) && (current.path[0] === "Array" || current.path[0] === null) && (current.path[1] === "prototype" || current.path[1] === null)) arrayIterationUnknown = true;
					continue;
				}
				const captureKey = captureKeyOf(binding, current.originAt, current.ownerInitializer);
				const lifetime = lifetimeKey(captureKey, current.path);
				if (current.bindings.has(lifetime)) continue;
				const revisited = current.bindings.has(captureKey);
				let repeatedPrefix;
				for (let start = 1; revisited && start <= current.path.length; start++) {
					const suffix = current.path.slice(start);
					if (!current.bindings.has(lifetimeKey(captureKey, suffix))) continue;
					repeatedPrefix = current.path.slice(0, start);
					break;
				}
				if (repeatedPrefix !== undefined && observablePaths.repeatsUnpruned(binding.bindingId, repeatedPrefix)) {
					markValue(current.node, repeatedPrefix, new Set(), "escape", mutation, current.originAt, current.ownerInitializer);
					continue;
				}
				let path = observablePaths.normalize(binding.bindingId, current.path, effect);
				if (path === null) continue;
				const selectorIndex = path.findIndex((key) => key !== null && typeof key === "object");
				const selector = path[selectorIndex];
				if (selector !== null && typeof selector === "object") {
					const selectionIdentity = JSON.stringify([
						binding.bindingId,
						effect,
						path.map((key, index) => index === selectorIndex ? { startIndex: selector.startIndex } : key),
						mutation?.start,
						mutation?.end,
						current.originAt?.start,
						current.originAt?.end,
						current.ownerInitializer?.start,
						current.ownerInitializer?.end
					]);
					const previous = selections.get(selectionIdentity);
					const excludedKeys = previous === undefined ? selector.excludedKeys : previous.filter((key) => selector.excludedKeys.includes(key));
					if (previous !== undefined && excludedKeys.length === previous.length) continue;
					selections.set(selectionIdentity, excludedKeys);
					path = path.map((key, index) => index === selectorIndex ? {
						...selector,
						excludedKeys
					} : key);
				}
				const origins = current.ownerInitializer !== undefined ? {
					initializers: binding.initializers.filter(({ node }) => node === current.ownerInitializer),
					referenceInitializers: [],
					directOrigins: []
				} : current.originAt === undefined ? binding : semanticMutationInitializers(binding, current.originAt, parents);
				const pathState = `${JSON.stringify(binding.bindingId)}\u0001${effect}\u0001${effect === "write" ? path.length : -1}\u0001${mutation?.start ?? -1}\u0001${mutation?.end ?? -1}\u0001${current.originAt?.start ?? -1}\u0001${current.originAt?.end ?? -1}\u0001${current.ownerInitializer?.start ?? -1}\u0001${current.ownerInitializer?.end ?? -1}`;
				let covering = coveringPaths.get(pathState);
				if (covering === undefined) {
					covering = new SemanticPropertyPathCoverage();
					coveringPaths.set(pathState, covering);
				}
				if (!covering.retain(path)) continue;
				const value = effect === "write" && binding.memberWrites.length === 0 ? evaluateSemanticBinding(binding, state) : undefined;
				const primitiveWrite = value?.status === "literal" || value?.status === "union";
				recordedEffectCount += 1;
				const nested = new Set(current.bindings);
				nested.add(lifetime);
				nested.add(captureKey);
				if (!primitiveWrite) {
					for (const origin of origins.directOrigins) {
						const shared = semanticMutableBuiltinOrigin(origin, path);
						if (shared !== undefined) recordRequiredEffect(shared.specifier, shared.path, effect, mutation);
					}
					if (effect === "escape") binding.escapedPaths.push({
						path,
						node: mutation
					});
					else binding.memberWrites.push({
						path,
						node: mutation
					});
					clearSemanticValueCaches(state);
					for (const initializer of origins.initializers) pending.push({
						node: initializer.node,
						path: [...initializer.projection, ...path],
						bindings: nested,
						originAt: initializer.node
					});
				}
				for (const initializer of origins.referenceInitializers) {
					const copiedPath = copiedReferencePath(initializer, path, effect);
					if (copiedPath === null) continue;
					pendingReferences.push({
						initializer,
						path: copiedPath,
						bindings: nested,
						effect,
						originAt: initializer.node,
						...mutation === undefined ? {} : { mutation }
					});
				}
			} else if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) {
				pending.push({
					node: expression.object,
					path: [semanticStaticPropertyKey(expression.property, expression.computed), ...current.path],
					bindings: current.bindings,
					originAt: current.originAt
				});
			} else {
				for (const value of effect === "escape" ? escapedReferenceLeaves(expression, current.path) : expandedValues(expression, current.path, effect)) {
					if (value.escapes && effect !== "escape") markValue(value.node, value.path, new Set(), "escape", mutation, current.originAt, value.ownerInitializer);
					else if (value.iterableFallbackPath !== undefined) deferIterable({
						node: value.node,
						projection: [],
						path: value.path,
						fallbackPath: value.iterableFallbackPath,
						bindings: current.bindings,
						effect,
						originAt: current.originAt,
						...mutation === undefined ? {} : { mutation }
					});
					else pending.push({
						...value,
						bindings: current.bindings,
						originAt: current.originAt
					});
				}
			}
		}
	};
	const markEscaped = (node, mutation, path = []) => markValue(node, path, new Set(), "escape", mutation);
	function expandedValues(expression, path, effect) {
		if (t.isArrayExpression(expression) && (path[0] === "__proto__" && (effect === "escape" || path.length > 1) || path[0] === "constructor" && path[1] === "prototype")) arrayIterationUnknown = true;
		return referencedValues(expression, path, effect, state);
	}
	const escapedLeaves = new WeakMap();
	function escapedReferenceLeaves(root, rootPath) {
		if (!t.isNode(root)) return [];
		const rootKey = JSON.stringify(rootPath);
		const cached = escapedLeaves.get(root)?.get(rootKey);
		if (cached !== undefined) return cached;
		const leaves = [];
		const leafIdentities = new Set();
		const expanded = new WeakMap();
		const pending = [...expandedValues(root, rootPath, "escape")];
		for (let cursor = 0; cursor < pending.length; cursor++) {
			const value = pending[cursor];
			if (value === undefined) break;
			const node = unwrapJavaScriptExpression(value.node).node;
			if (!t.isNode(node)) continue;
			const pathKey = JSON.stringify(value.path);
			if (t.isIdentifier(node) && value.iterableFallbackPath === undefined) {
				const binding = resolveBinding(node, node.name);
				const identity = JSON.stringify([
					binding === undefined ? null : binding.bindingId,
					binding === undefined ? node.name : null,
					pathKey,
					value.ownerInitializer?.start,
					value.ownerInitializer?.end
				]);
				if (leafIdentities.has(identity)) continue;
				leafIdentities.add(identity);
				leaves.push(value);
			} else if (value.iterableFallbackPath !== undefined || t.isIdentifier(node) || t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) leaves.push(value);
			else {
				const paths = expanded.get(node) ?? new Set();
				if (paths.has(pathKey)) continue;
				paths.add(pathKey);
				expanded.set(node, paths);
				for (const reference of expandedValues(node, value.path, "escape")) pending.push(reference);
			}
		}
		const byPath = escapedLeaves.get(root) ?? new Map();
		byPath.set(rootKey, leaves);
		escapedLeaves.set(root, byPath);
		return leaves;
	}
	const markReceiver = (callee, mutation) => {
		const expression = unwrapJavaScriptExpression(callee).node;
		if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) markEscaped(expression.object, mutation);
	};
	const markTarget = (node, mutation) => {
		for (const target of semanticWriteTargets(node)) if (!t.isIdentifier(target)) markValue(target.object, [semanticStaticPropertyKey(target.property, target.computed)], new Set(), "write", mutation);
	};
	yield* traverseJavaScriptAstSteps(program, { enter: (node, parent) => {
		for (const source of semanticIterationSources(node, parent)) deferIterable({
			...source,
			path: source.projection,
			fallbackPath: source.projection,
			bindings: new Set(),
			effect: "escape",
			originAt: source.mutation,
			iterationOnly: source.kind === "iteration"
		});
		const writeTarget = semanticWriteSiteTarget(node);
		if (writeTarget !== null) markTarget(writeTarget, node);
		else if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) {
			for (const source of returnedReferences(node.callee)) markEscaped(source.node, node, source.projection);
			for (const argument of node.arguments) if (t.isSpreadElement(argument)) deferIterable({
				node: argument.argument,
				projection: [],
				path: [null],
				fallbackPath: [],
				bindings: new Set(),
				effect: "escape",
				mutation: node,
				originAt: node
			});
			else markEscaped(argument, node);
			if (!t.isNewExpression(node)) markReceiver(node.callee, node);
		} else if (t.isTaggedTemplateExpression(node)) {
			markReceiver(node.tag, node);
			for (const expression of node.quasi.expressions) markEscaped(expression, node);
		}
	} });
	while (pendingReferences.length > 0 || iterableReferences.length > 0) {
		const effectsBefore = recordedEffectCount;
		const iterablesBefore = iterableReferences.length;
		const iterationBefore = arrayIterationUnknown;
		for (const [index, reference] of pendingReferences.splice(0).entries()) {
			if (index % 64 === 0) yield;
			const { initializer } = reference;
			if (semanticReferenceSourcesInactive(initializer, state)) pendingReferences.push(reference);
			else if (t.isForOfStatement(initializer.node)) deferIterable({
				node: initializer.node.right,
				projection: [],
				path: [null, ...reference.path],
				fallbackPath: [],
				bindings: reference.bindings,
				effect: reference.effect,
				originAt: initializer.node,
				...reference.mutation === undefined ? {} : { mutation: reference.mutation }
			});
			else if (initializer.copyKind === "array-rest" && initializer.copyProjectionOffset !== undefined) {
				const offset = initializer.copyProjectionOffset;
				const projection = initializer.projection.slice(0, offset);
				deferIterable({
					node: initializer.node,
					projection,
					path: reference.path,
					fallbackPath: projection,
					bindings: reference.bindings,
					effect: reference.effect,
					originAt: reference.originAt,
					...reference.mutation === undefined ? {} : { mutation: reference.mutation }
				});
			} else markValue(initializer.node, reference.path, reference.bindings, reference.effect, reference.mutation, reference.originAt);
		}
		for (const [index, reference] of [...iterableReferences].entries()) {
			if (index % 64 === 0) yield;
			if (semanticReferenceSourcesInactive(reference, state)) continue;
			if (reference.iterationOnly) {
				const expanded = expandedIterationReferences(reference, state);
				if (expanded !== null) {
					for (const selected of expanded) deferIterable(selected);
					continue;
				}
			}
			const slot = semanticSelectedReferenceSlot(reference, state);
			const knownArray = !arrayIterationUnknown && slot?.value.status === "array" && slot.value.items.every((item) => semanticArrayIndex(item.name) !== null);
			if (knownArray && reference.iterationOnly) continue;
			markValue(reference.node, knownArray ? reference.path : reference.fallbackPath, reference.bindings, knownArray ? reference.effect : "escape", reference.mutation, reference.originAt);
		}
		if (recordedEffectCount === effectsBefore && iterableReferences.length === iterablesBefore && arrayIterationUnknown === iterationBefore) break;
	}
	clearSemanticValueCaches(state);
}
var expandedIterationReferences, referencedValues, observableMutationPaths, arrayReferencedValues, copiedReferencePath;
function init_javascriptSemanticMemberMutations() {
	return (init_javascriptSemanticMemberMutations = __esmMin((() => {
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticState();
		init_javascriptSemanticValues();
		init_javascriptSemanticSlots();
		init_javascriptSemanticObjectReferences();
		init_javascriptSemanticIterationSources();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticReturnedReferences();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptAstValues();
		expandedIterationReferences = (reference, state) => {
			if (!t.isForOfStatement(reference.mutation)) return null;
			const iterable = reference.mutation.right;
			const source = [
				reference,
				...reference.requiredSources ?? [],
				...reference.fallbackSources ?? []
			].find((source) => source.node === iterable && source.projection[0] === null);
			if (source === undefined) return null;
			const slot = semanticSelectedReferenceSlot({
				node: iterable,
				projection: []
			}, state);
			const container = slot === undefined ? null : semanticContainer(slot.value);
			if (container?.coverage.status !== "complete") return null;
			const select = (candidate, name) => ({
				...candidate,
				projection: candidate.node === iterable && candidate.projection[0] === null ? [name, ...candidate.projection.slice(1)] : candidate.projection
			});
			return container.slots.map((slot) => {
				const { projection } = select(reference, slot.name);
				return {
					...reference,
					projection,
					path: projection,
					fallbackPath: projection,
					...reference.requiredSources === undefined ? {} : { requiredSources: reference.requiredSources.map((source) => select(source, slot.name)) },
					...reference.fallbackSources === undefined ? {} : { fallbackSources: reference.fallbackSources.map((source) => select(source, slot.name)) }
				};
			});
		};
		referencedValues = (node, path, effect, state) => {
			if (effect === "escape" && t.isFunction(node)) return semanticCallableResultExpressions(node).flatMap(({ node, delegated }) => node === null ? [] : [{
				node,
				path: delegated ? [null] : []
			}]);
			if (t.isObjectExpression(node) || t.isArrayExpression(node)) {
				if (effect === "write" && path.length < 2) return [];
				return t.isObjectExpression(node) ? semanticObjectPropertyReferences(node, path, state) : arrayReferencedValues(node, path);
			}
			if (t.isClass(node)) {
				const [key, ...remaining] = path;
				if (key === undefined) return [];
				if (effect === "write" && remaining.length === 0) return [];
				return semanticClassPropertyReferences({
					owner: node,
					kind: "static"
				}, [key, ...remaining], state);
			}
			if (t.isNewExpression(node)) {
				const [key, ...remaining] = path;
				if (key === undefined) return [];
				if (effect === "write" && remaining.length === 0) return [];
				return semanticClassCandidates(node.callee, state).flatMap((klass) => semanticClassPropertyReferences({
					owner: klass,
					kind: "instance"
				}, [key, ...remaining], state));
			}
			if (t.isAssignmentExpression(node)) return node.operator === "||=" || node.operator === "??=" ? [{
				node: node.left,
				path
			}, {
				node: node.right,
				path
			}] : [{
				node: node.right,
				path
			}];
			if (t.isAwaitExpression(node)) return [{
				node: node.argument,
				path
			}];
			if (t.isSequenceExpression(node)) {
				const last = node.expressions.at(-1);
				return last === undefined ? [] : [{
					node: last,
					path
				}];
			}
			if (t.isConditionalExpression(node)) return [{
				node: node.consequent,
				path
			}, {
				node: node.alternate,
				path
			}];
			if (t.isLogicalExpression(node)) return [{
				node: node.left,
				path
			}, {
				node: node.right,
				path
			}];
			return [];
		};
		observableMutationPaths = (state) => {
			const bindingNodes = new Map();
			const expressions = new WeakMap();
			const pendingExpressions = [];
			const pending = [];
			const queued = new Set();
			const schedule = (node) => {
				if (queued.has(node)) return;
				queued.add(node);
				pending.push(node);
			};
			const create = (read) => read === undefined ? {} : { read };
			const link = (source, target) => {
				if (target.sources?.has(source) === true) return;
				(target.sources ??= new Set()).add(source);
				(source.dependents ??= new Set()).add(target);
				schedule(target);
			};
			const expressionNode = (node) => {
				const expression = unwrapJavaScriptExpression(node).node;
				const existing = expressions.get(expression);
				if (existing !== undefined) return existing;
				const observer = create();
				expressions.set(expression, observer);
				pendingExpressions.push({
					expression,
					observer
				});
				return observer;
			};
			const project = (source, path) => {
				let observer = source;
				for (const key of path) {
					const identity = JSON.stringify(key === null || typeof key === "object" ? key : String(key));
					let selected = observer.projections?.get(identity);
					if (selected === undefined) {
						selected = create({
							source: observer,
							key
						});
						(observer.projections ??= new Map()).set(identity, selected);
						(observer.dependents ??= new Set()).add(selected);
						schedule(selected);
					}
					observer = selected;
				}
				return observer;
			};
			for (const binding of state.bindingsById.values()) bindingNodes.set(binding.bindingId, create());
			for (const binding of state.bindingsById.values()) {
				const observer = bindingNodes.get(binding.bindingId);
				if (observer === undefined) continue;
				const hasParsedRequireOrigin = binding.initializers.some(({ node }) => semanticRequireOrigin(node, state) !== undefined);
				if (binding.directOrigins.length > 0 || hasParsedRequireOrigin) (observer.origins ??= new Set()).add("opaque");
				for (const initializer of binding.initializers) {
					link(project(expressionNode(initializer.node), initializer.projection), observer);
				}
				if (binding.referenceInitializers.length > 0) (observer.origins ??= new Set()).add("opaque");
				for (const initializer of binding.referenceInitializers) {
					for (const source of [
						initializer,
						...initializer.requiredSources ?? [],
						...initializer.fallbackSources ?? []
					]) link(expressionNode(source.node), observer);
				}
			}
			const settle = () => {
				while (pendingExpressions.length > 0 || pending.length > 0) {
					while (pendingExpressions.length > 0) {
						const selected = pendingExpressions.pop();
						if (selected === undefined) break;
						const { expression, observer } = selected;
						if (t.isObjectExpression(expression) || t.isArrayExpression(expression) || t.isClass(expression) || t.isNewExpression(expression)) (observer.origins ??= new Set()).add(expression);
						else if (t.isIdentifier(expression)) {
							const binding = resolveSemanticBindingState(state, expression, expression.name);
							if (binding !== undefined) {
								const origin = bindingNodes.get(binding.bindingId);
								if (origin !== undefined) link(origin, observer);
							} else if (expression.name === "Array") (observer.origins ??= new Set()).add("array");
							else if ([
								"globalThis",
								"global",
								"window",
								"self"
							].includes(expression.name)) (observer.origins ??= new Set()).add("ambient");
						} else if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) link(project(expressionNode(expression.object), [semanticStaticPropertyKey(expression.property, expression.computed)]), observer);
						else for (const reference of referencedValues(expression, [], "escape", state)) link(project(expressionNode(reference.node), reference.path), observer);
						schedule(observer);
					}
					const observer = pending.pop();
					if (observer === undefined) continue;
					queued.delete(observer);
					let changed = false;
					const add = (origin) => {
						if (observer.origins?.has(origin) === true) return;
						(observer.origins ??= new Set()).add(origin);
						changed = true;
					};
					for (const source of observer.sources ?? []) for (const origin of source.origins ?? []) add(origin);
					if (observer.read !== undefined) {
						const { source, key } = observer.read;
						if (key === null || typeof key === "object") {
							if ((source.origins?.size ?? 0) > 0) add("opaque");
						} else for (const origin of source.origins ?? []) {
							if (typeof origin === "string") {
								if (origin === "array-prototype" || origin === "opaque") add(origin);
								else if (origin === "ambient" && semanticPropertyPathKeyMatches(key, "Array")) add("array");
								else if (origin === "array" && semanticPropertyPathKeyMatches(key, "prototype")) add("array-prototype");
							} else {
								for (const reference of referencedValues(origin, [key], "escape", state)) {
									link(project(expressionNode(reference.node), reference.path), observer);
									if (reference.iterableFallbackPath !== undefined) link(project(expressionNode(reference.node), reference.iterableFallbackPath), observer);
								}
							}
						}
					}
					if (changed) for (const dependent of observer.dependents ?? []) schedule(dependent);
				}
			};
			settle();
			const normalize = (bindingId, path, effect) => {
				let observer = bindingNodes.get(bindingId);
				if (observer === undefined) return path;
				if (path.some((key) => key !== null && typeof key === "object")) return path;
				if (effect === "escape") {
					observer = project(observer, path);
					settle();
					return (observer.origins?.size ?? 0) === 0 ? null : path;
				}
				if ((observer.origins?.size ?? 0) === 0) return path.length === 0 ? path : [null];
				for (let offset = 0; offset < path.length; offset++) {
					const key = path[offset];
					if (key === undefined) break;
					observer = project(observer, [key]);
					settle();
					if ((observer.origins?.size ?? 0) === 0 && offset + 1 < path.length) return [...path.slice(0, offset + 1), null];
				}
				return path;
			};
			const repeated = new Map();
			const repeatsUnpruned = (bindingId, prefix) => {
				const key = JSON.stringify([bindingId, prefix]);
				const cached = repeated.get(key);
				if (cached !== undefined) return cached;
				let observer = bindingNodes.get(bindingId);
				const signatures = new Set();
				let result = false;
				while (observer !== undefined && prefix.length > 0) {
					observer = project(observer, prefix);
					settle();
					if ((observer.origins?.size ?? 0) === 0) break;
					const signature = JSON.stringify([...observer.origins ?? []].map((origin) => typeof origin === "string" ? origin : `${String(origin.start)}:${String(origin.end)}`).sort(compareUnicodeCodePoints));
					if (signatures.has(signature)) {
						result = true;
						break;
					}
					signatures.add(signature);
				}
				repeated.set(key, result);
				return result;
			};
			return {
				normalize,
				repeatsUnpruned
			};
		};
		arrayReferencedValues = (node, path) => {
			const [key, ...remaining] = path;
			const selected = key ?? null;
			const selectedIndex = typeof selected === "object" ? null : semanticArrayIndex(selected);
			if (typeof selected !== "object" && selectedIndex === null) return [];
			const references = [];
			let minimumIndex = 0;
			let uncertainIndex = false;
			for (const element of node.elements) {
				if (t.isSpreadElement(element)) {
					if (selectedIndex === null || selectedIndex >= minimumIndex) {
						let sourceKey = null;
						if (!uncertainIndex) {
							if (selectedIndex !== null) sourceKey = selectedIndex - minimumIndex;
							else if (selected !== null && typeof selected === "object") sourceKey = {
								excludedKeys: selected.excludedKeys.flatMap((name) => {
									const index = semanticArrayIndex(name);
									return index === null || index < minimumIndex ? [] : [String(index - minimumIndex)];
								}),
								startIndex: Math.max(0, (selected.startIndex ?? 0) - minimumIndex)
							};
						}
						references.push({
							node: element.argument,
							path: [sourceKey, ...remaining],
							iterableFallbackPath: []
						});
					}
					uncertainIndex = true;
					continue;
				}
				if (element !== null && (uncertainIndex ? selectedIndex === null || selectedIndex >= minimumIndex : semanticPropertyPathKeyMatches(selected, String(minimumIndex)))) references.push({
					node: element,
					path: remaining
				});
				minimumIndex++;
			}
			return references;
		};
		copiedReferencePath = (initializer, path, effect) => {
			const offset = initializer.copyProjectionOffset;
			if (offset === undefined) return [...initializer.projection, ...path];
			const copiedPath = [...initializer.projection.slice(offset + 1), ...path];
			if (effect === "write" && copiedPath.length < 2) return null;
			let [key, ...remaining] = copiedPath;
			if (initializer.copyKind === "array-rest") {
				const startIndex = initializer.copyStartIndex ?? 0;
				if (key === undefined || key === null) key = {
					excludedKeys: [],
					startIndex
				};
				else if (typeof key === "object") key = {
					excludedKeys: key.excludedKeys.flatMap((name) => {
						const index = semanticArrayIndex(name);
						return index === null ? [] : [String(index + startIndex)];
					}),
					startIndex: (key.startIndex ?? 0) + startIndex
				};
				else {
					const index = semanticArrayIndex(key);
					if (index === null) return null;
					key = index + startIndex;
				}
			} else {
				const excludedKeys = initializer.copyExcludedKeys ?? [];
				if (key === undefined || key === null) key = { excludedKeys };
				else if (typeof key === "object") key = {
					...key,
					excludedKeys: [...new Set([...key.excludedKeys, ...excludedKeys])].sort(compareUnicodeCodePoints)
				};
				else if (excludedKeys.includes(String(key))) return null;
			}
			return [
				...initializer.projection.slice(0, offset),
				key,
				...remaining
			];
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAmbientWrites.js
/**
* Index source-local writes through ambient identities and stable aliases.
* The shared invocation owner resolves intrinsic aliases, bind/call/apply and
* literal argument spreads. Runtime reachability and arbitrary call effects
* remain unevaluated; a visible possible write is sufficient.
*/
function* indexJavaScriptAmbientWritesSteps(program, state) {
	const ambientReads = createAmbientPathResolver(state, false);
	const ambientWrites = createAmbientPathResolver(state, true);
	const interop = createSemanticModuleInterop(state, { intrinsicPath: (node) => {
		const [path] = ambientReads(node);
		return path?.[0] === "global" && path.every((key) => key !== null) ? ["intrinsic", ...path.slice(1)] : undefined;
	} });
	yield* collectJavaScriptIdentityWritesSteps(program, (root, kind, writeSite) => {
		if (kind === "opaque-call") return [];
		if (kind === "binding") return t.isIdentifier(root) && isUnshadowedGlobal(root, state, root.name) ? [["global", root.name]] : [];
		return ambientWrites(root, writeSite);
	}, interop.intrinsicInvocation, interop.staticString, interop.isFreshObject, (node, path) => {
		state.ambientWrites.retain(path);
		state.ambientWriteEffects.push({
			path,
			node
		});
	});
}
var GLOBAL_OBJECT_NAMES, globalObjectName, canonicalAmbientPath, createAmbientPathResolver, isUnmodifiedGlobalReference, isUnmodifiedImportMetaUrl;
function init_javascriptSemanticAmbientWrites() {
	return (init_javascriptSemanticAmbientWrites = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptElectronMemberWrites();
		init_javascriptModuleInterop();
		init_javascriptSemanticState();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticMutationInitializers();
		GLOBAL_OBJECT_NAMES = [
			"globalThis",
			"global",
			"window",
			"self"
		];
		globalObjectName = (node, state) => GLOBAL_OBJECT_NAMES.find((name) => isUnshadowedGlobal(node, state, name));
		canonicalAmbientPath = (path) => {
			if (path[0] !== "global") return path;
			let firstProperty = 1;
			while (GLOBAL_OBJECT_NAMES.includes(path[firstProperty] ?? "")) firstProperty += 1;
			return ["global", ...path.slice(firstProperty)];
		};
		createAmbientPathResolver = (state, possibleWrites) => {
			const cached = new WeakMap();
			return (node, capture) => {
				const prior = possibleWrites ? undefined : cached.get(node);
				if (prior !== undefined) return prior;
				const result = new Map();
				const pending = [{
					node,
					suffix: []
				}];
				const expanded = new WeakMap();
				const retain = (path) => {
					let canonical = canonicalAmbientPath(path);
					for (;;) {
						result.set(JSON.stringify(canonical), canonical);
						if (!possibleWrites || canonical[0] !== "global" || canonical[1] !== null) break;
						canonical = canonicalAmbientPath(["global", ...canonical.slice(2)]);
					}
				};
				while (pending.length > 0) {
					const current = pending.pop();
					if (current === undefined) break;
					const { root, members } = electronMemberPath(current.node);
					let suffix = current.suffix === undefined ? undefined : [...members, ...current.suffix];
					if (expanded.has(root)) {
						const previous = expanded.get(root);
						if (previous === undefined) continue;
						if (suffix !== undefined && previous.length === suffix.length) {
							const joined = previous.map((key, index) => key === suffix?.[index] ? key : null);
							if (joined.every((key, index) => key === previous[index])) continue;
							suffix = joined;
						} else suffix = undefined;
						if (!possibleWrites) {
							cached.set(node, []);
							return [];
						}
					}
					expanded.set(root, suffix);
					if (suffix === undefined && !possibleWrites) continue;
					const continueWith = (node, path = suffix) => pending.push({
						node,
						suffix: path,
						...current.readsAtSelf && { readsAtSelf: true }
					});
					if (t.isMetaProperty(root) && root.meta.name === "import" && root.property.name === "meta") {
						retain(["import-meta", ...suffix ?? []]);
						continue;
					}
					if (t.isIdentifier(root)) {
						if (globalObjectName(root, state) !== undefined) {
							retain(["global", ...suffix ?? []]);
							continue;
						}
						if (isUnshadowedGlobal(root, state, root.name)) {
							retain([
								"global",
								root.name,
								...suffix ?? []
							]);
							continue;
						}
						const binding = resolveSemanticBindingState(state, root, root.name);
						if (binding === undefined) continue;
						const stable = semanticStableInitializer(binding, state);
						const readAt = current.readsAtSelf ? root : capture;
						const initializers = possibleWrites ? readAt === undefined ? binding.initializers : semanticMutationInitializers(binding, readAt, state.parentsByNode).initializers : stable === undefined ? [] : [stable];
						for (const initializer of initializers) pending.push({
							node: initializer.node,
							readsAtSelf: true,
							suffix: suffix === undefined ? undefined : [...initializer.projection.map((key) => key === null ? null : String(key)), ...suffix]
						});
						continue;
					}
					if (possibleWrites && t.isConditionalExpression(root)) {
						continueWith(root.consequent);
						continueWith(root.alternate);
						continue;
					}
					if (possibleWrites && t.isLogicalExpression(root)) {
						continueWith(root.left);
						continueWith(root.right);
						continue;
					}
					const key = suffix?.[0];
					if (suffix !== undefined && key === undefined) continue;
					if (t.isObjectExpression(root)) {
						if (possibleWrites) {
							for (const property of root.properties) {
								if (t.isSpreadElement(property)) continueWith(property.argument);
								else if (t.isObjectProperty(property) && t.isExpression(property.value)) {
									const ownKey = semanticStaticPropertyKey(property.key, property.computed);
									if (suffix === undefined || key === null || ownKey === null || ownKey === key) continueWith(property.value, suffix?.slice(1));
								}
							}
						} else if (suffix !== undefined && key !== null && root.properties.every((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) !== null)) {
							const property = root.properties.findLast((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === key);
							if (t.isObjectProperty(property) && t.isExpression(property.value)) continueWith(property.value, suffix.slice(1));
						}
					} else if (t.isArrayExpression(root)) {
						if (suffix === undefined) {
							for (const element of root.elements) if (t.isSpreadElement(element)) continueWith(element.argument);
							else if (t.isExpression(element)) continueWith(element);
						} else if (!root.elements.some(t.isSpreadElement)) {
							const index = Number(key);
							if (key === null && possibleWrites) {
								for (const element of root.elements) if (t.isExpression(element)) continueWith(element, suffix.slice(1));
							} else if (key !== null && Number.isInteger(index) && index >= 0 && String(index) === key) {
								const element = root.elements[index];
								if (t.isExpression(element)) continueWith(element, suffix.slice(1));
							}
						}
					}
				}
				const paths = [...result.values()];
				if (!possibleWrites) cached.set(node, paths);
				return paths;
			};
		};
		isUnmodifiedGlobalReference = (callee, state, name) => {
			const node = unwrapJavaScriptExpression(callee).node;
			if (state.ambientWrites.covers(["global", name])) return false;
			if (isUnshadowedGlobal(node, state, name)) return true;
			if (!t.isMemberExpression(node) || semanticStaticPropertyKey(node.property, node.computed) !== name) return false;
			const root = unwrapJavaScriptExpression(node.object).node;
			const namespace = globalObjectName(root, state);
			return namespace !== undefined && !state.ambientWrites.covers(["global", namespace]);
		};
		isUnmodifiedImportMetaUrl = (node, state) => isImportMetaUrl(node) && !state.ambientWrites.covers(["import-meta", "url"]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCoverage.js
var semanticCoverage, semanticCoverageResourceLimits, semanticResourceBounds, semanticResourceLimitCoverage, semanticReturnCoverage;
function init_javascriptSemanticCoverage() {
	return (init_javascriptSemanticCoverage = __esmMin((() => {
		init_javascriptSemanticResourceLimits();
		semanticCoverage = (parserPartial, resourceLimits = []) => resourceLimits.length > 0 ? {
			status: "partial",
			omittedCount: null,
			resourceLimits
		} : {
			status: parserPartial ? "partial" : "complete",
			omittedCount: 0
		};
		semanticCoverageResourceLimits = (coverage) => coverage.resourceLimits ?? [];
		semanticResourceBounds = {
			"primitive-candidates": {
				value: 256,
				unit: "items"
			},
			"primitive-bytes": {
				value: SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT,
				unit: "bytes"
			},
			"expression-depth": {
				value: 256,
				unit: "depth"
			}
		};
		semanticResourceLimitCoverage = (resourceLimits) => resourceLimits.map((resourceLimit) => ({
			name: `javascript_semantic_${resourceLimit.replaceAll("-", "_")}`,
			...semanticResourceBounds[resourceLimit]
		}));
		semanticReturnCoverage = (retainedCount, parserPartial) => ({
			status: parserPartial ? "partial" : "complete",
			retainedCount,
			omittedCount: 0
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReturns.js
var collectSemanticReturns, semanticReturnSiteId, resolveSemanticModuleCallables, directReturnExpressions, callableIdsForBinding, callableIdsForNode, flattenSemanticReturnValue, flattenValue;
function init_javascriptSemanticReturns() {
	return (init_javascriptSemanticReturns = __esmMin((() => {
		init_javascriptSemanticSlots();
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticCoverage();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticMutationInitializers();
		collectSemanticReturns = (state, parserPartial) => {
			return state.callables.map((callable) => {
				const node = state.callableNodesById.get(callable.callableId);
				if (node === undefined) return {
					...callable,
					returnCoverage: {
						status: "partial",
						retainedCount: 0,
						omittedCount: null
					}
				};
				const expressions = directReturnExpressions(node);
				const sites = [];
				for (const expression of expressions) {
					sites.push({
						returnSiteId: semanticReturnSiteId(callable.callableId, expression.location),
						location: expression.location,
						identityReferenceLocation: expression.node !== null && t.isIdentifier(expression.node) ? range(expression.node) : null,
						value: expression.node === null ? {
							status: "unknown",
							reason: "Return has no value."
						} : evaluateSemanticExpression(expression.node, state)
					});
				}
				return {
					...callable,
					returnSites: sites,
					returnCoverage: semanticReturnCoverage(sites.length, parserPartial)
				};
			});
		};
		semanticReturnSiteId = (callableId, location) => [
			callableId,
			"return",
			String(location.start.line),
			String(location.start.column),
			String(location.end.line),
			String(location.end.column)
		].join(":");
		resolveSemanticModuleCallables = (state, callables, bindings) => {
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const provenanceByBinding = new Map(bindings.map(({ bindingId, provenance }) => [bindingId, provenance]));
			return state.moduleLinks.map((link) => {
				if (link.kind === "type-import") return {
					...link,
					callableId: null
				};
				const captured = state.defaultExportExpressions.get(link);
				if (link.localName === null && captured === undefined) return link.callableId !== null && callableIds.has(link.callableId) ? link : {
					...link,
					callableId: null
				};
				const binding = state.moduleLinkBindings.get(link);
				const resolved = captured !== undefined ? callableIdsForNode(captured, state, callableIds, new Set(), true) : binding === undefined ? [] : callableIdsForBinding(binding, state, callableIds, new Set());
				const provenance = binding === undefined || link.specifier !== null ? undefined : provenanceByBinding.get(binding.bindingId);
				const resolutionMode = provenance?.status === "module" ? provenance.origins[0].resolutionMode : undefined;
				return {
					...link,
					...resolutionMode !== undefined ? { resolutionMode } : {},
					callableId: resolved.length === 1 ? resolved[0] ?? null : null
				};
			});
		};
		directReturnExpressions = (callable) => semanticCallableResultExpressions(callable).filter(({ kind }) => kind === "return").map(({ node, site }) => ({
			node,
			location: range(site)
		}));
		callableIdsForBinding = (binding, state, admitted, seen, read) => {
			if (seen.has(binding.bindingId) || read === undefined && binding.initializers.length !== 1 || binding.definitions.some(({ kind }) => read === undefined && kind === "assignment" || kind === "parameter" || kind === "catch")) return [];
			const selected = read === undefined ? binding : semanticReadInitializers(binding, read, state.parentsByNode);
			const initializer = selected.initializers[0];
			if (initializer === undefined || selected.initializers.length !== 1 || initializer.projection.length > 0 || state.conditionallySkippedExpressions.has(initializer.node)) return [];
			return callableIdsForNode(initializer.node, state, admitted, new Set([...seen, binding.bindingId]), read !== undefined);
		};
		callableIdsForNode = (node, state, admitted, seen, snapshot = false) => {
			const unwrapped = unwrapJavaScriptExpression(node).node;
			if (unwrapped !== node) return callableIdsForNode(unwrapped, state, admitted, seen, snapshot);
			const direct = semanticCallableIdForNode(node);
			if (direct !== null && admitted.has(direct)) return [direct];
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				return binding === undefined ? [] : callableIdsForBinding(binding, state, admitted, seen, snapshot ? node : undefined);
			}
			return [];
		};
		flattenSemanticReturnValue = (value) => {
			const fields = [];
			const propertyCoverage = [];
			flattenValue(value, "", fields, propertyCoverage);
			fields.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
			propertyCoverage.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
			return {
				fields,
				propertyCoverage
			};
		};
		flattenValue = (value, path, fields, coverage, presence = "present") => {
			if (presence !== "present") {
				fields.push({
					path,
					presence,
					state: "unknown",
					value: null,
					reason: "reason" in value ? value.reason : "Property presence is uncertain."
				});
				return;
			}
			if (value.status === "literal") {
				fields.push({
					path,
					presence,
					state: "literal",
					value: value.value,
					reason: null
				});
				return;
			}
			if (value.status === "union") {
				fields.push({
					path,
					presence,
					state: "union",
					value: [...value.values],
					reason: null
				});
				return;
			}
			if ("reason" in value) {
				fields.push({
					path,
					presence,
					state: "unknown",
					value: null,
					reason: value.reason
				});
				return;
			}
			const container = semanticContainer(value);
			coverage.push({
				path,
				...container.coverage
			});
			for (const slot of container.slots) flattenValue(slot.value, `${path}${semanticPropertyPointer([slot.name])}`, fields, coverage, slot.presence);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallableStack.js
var createSemanticCallableStack, createSemanticCallableIdStack;
function init_javascriptSemanticCallableStack() {
	return (init_javascriptSemanticCallableStack = __esmMin((() => {
		init_javascriptSemanticProjection();
		createSemanticCallableStack = (admit, callables = []) => {
			const frames = [];
			const suspendedMethods = new Map();
			callables.length = 0;
			const push = (frame) => {
				frames.push(frame);
				callables.push(frame.callable);
			};
			const pop = () => {
				callables.pop();
				return frames.pop();
			};
			return {
				callables,
				enter: (node, parent) => {
					if (parent !== null && (t.isObjectMethod(parent) || t.isClassMethod(parent)) && parent.computed && parent.key === node && frames.at(-1)?.callableId === semanticCallableIdForNode(parent)) {
						const method = pop();
						if (method !== undefined) suspendedMethods.set(node, method);
					}
					const callableId = semanticCallableIdForNode(node);
					if (callableId === null) return;
					const callable = admit(callableId);
					if (callable !== undefined) push({
						callableId,
						callable
					});
				},
				exit: (node) => {
					const callableId = semanticCallableIdForNode(node);
					if (callableId !== null && frames.at(-1)?.callableId === callableId) pop();
					const method = suspendedMethods.get(node);
					if (method !== undefined) {
						suspendedMethods.delete(node);
						push(method);
					}
				}
			};
		};
		createSemanticCallableIdStack = (admitted, callables = []) => createSemanticCallableStack((callableId) => admitted.has(callableId) ? callableId : undefined, callables);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDataEffectHelpers.js
var assignedSemanticResultBindings, assignedSourceIs, projectedPatternBindings, semanticProjectedBindingFacts, scalarAssignedResultBinding, builtinDataEffectMethod, semanticBoundMemberPath, builtinBindingPath, computeBuiltinBindingPath, builtinNamespaceOrigin, affectsBuiltinPath, BUILTIN_RECEIVER_METHODS, builtinEffectIndexes, builtinEffectIndex, builtinEscapes, builtinModuleEffects, requiredModuleChanged, originalBuiltinReceiver, computeOriginalBuiltinReceiver, semanticExpressionModuleOrigin, isSemanticProcessObject, outerDataEffectBinding, traverseDataEffects, dataEffectArgumentBindingId, dataEffectPrimitive, dataEffectLiteralString, dataEffectMemberCallee;
function init_javascriptSemanticDataEffectHelpers() {
	return (init_javascriptSemanticDataEffectHelpers = __esmMin((() => {
		init_javascriptBuiltinResourceMethods();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticValues();
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticProjection();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticCallableStack();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptAstValues();
		assignedSemanticResultBindings = (node, ancestors, state) => {
			for (let index = ancestors.length - 1; index >= 0; index -= 1) {
				const owner = ancestors[index];
				if (owner === undefined) continue;
				let pattern;
				let source = null;
				if (t.isVariableDeclarator(owner)) {
					pattern = owner.id;
					source = owner.init ?? null;
				} else if (t.isAssignmentExpression(owner)) {
					pattern = owner.left;
					source = owner.right;
				}
				if (pattern !== undefined && source !== null && assignedSourceIs(node, source)) return projectedPatternBindings(pattern, state);
				if (semanticCallableIdForNode(owner) !== null) return [];
			}
			return [];
		};
		assignedSourceIs = (node, source) => {
			let value = source;
			while (true) {
				if (t.isAwaitExpression(value)) value = value.argument;
				else {
					const unwrapped = unwrapJavaScriptExpression(value).node;
					if (unwrapped === value) break;
					value = unwrapped;
				}
			}
			return value === node;
		};
		projectedPatternBindings = (pattern, state) => {
			const output = [];
			const visit = (current, path, partial) => {
				if (t.isIdentifier(current)) {
					const binding = resolveSemanticBindingState(state, current, current.name);
					if (binding !== undefined) output.push({
						bindingId: binding.bindingId,
						identifier: current,
						projectionPath: path,
						resolution: partial ? "partial" : "complete"
					});
					return;
				}
				if (t.isAssignmentPattern(current)) return visit(current.left, path, true);
				if (t.isRestElement(current)) return visit(current.argument, [...path, null], true);
				if (t.isObjectPattern(current)) {
					for (const property of current.properties) {
						if (t.isRestElement(property)) visit(property.argument, [...path, null], true);
						else visit(property.value, [...path, semanticStaticPropertyKey(property.key, property.computed)], partial || semanticStaticPropertyKey(property.key, property.computed) === null);
					}
				} else if (t.isArrayPattern(current)) {
					current.elements.forEach((element, index) => {
						if (element !== null) visit(element, [...path, index], partial);
					});
				}
			};
			visit(pattern, [], false);
			return output;
		};
		semanticProjectedBindingFacts = (bindings) => bindings.map(({ identifier: _identifier, ...fact }) => fact);
		scalarAssignedResultBinding = (bindings) => bindings.length === 1 && bindings[0]?.projectionPath.length === 0 ? bindings[0]?.bindingId ?? null : null;
		builtinDataEffectMethod = (callee, state, specifiers) => {
			const expression = unwrapJavaScriptExpression(callee).node;
			if (expression !== callee) return builtinDataEffectMethod(expression, state, specifiers);
			if (t.isSequenceExpression(expression)) {
				const final = expression.expressions.at(-1);
				return final === undefined ? null : builtinDataEffectMethod(final, state, specifiers);
			}
			const required = semanticRequireOrigin(callee, state);
			if (required !== undefined) {
				const origin = builtinNamespaceOrigin(required.origin);
				return origin.importedPath.length === 1 && specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier) && !requiredModuleChanged(required.origin.specifier, required.origin.importedPath, callee, state, true) ? origin.importedPath[0] ?? null : null;
			}
			if (t.isIdentifier(callee)) {
				const binding = resolveSemanticBindingState(state, callee, callee.name);
				const path = builtinBindingPath(binding, state, specifiers, callee, [], true);
				return path?.length === 1 ? path[0] ?? null : null;
			}
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return null;
			if (!t.isIdentifier(callee.object)) {
				const method = semanticStaticPropertyKey(callee.property, callee.computed);
				const receiver = semanticBoundMemberPath(callee.object, state);
				if (method !== null && receiver !== undefined) {
					const provenance = evaluateSemanticProvenance(receiver.binding, state);
					if (provenance.status === "module") {
						const origin = builtinNamespaceOrigin({
							...provenance.origins[0],
							importedPath: [...provenance.origins[0].importedPath, ...receiver.path]
						});
						if (specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier)) return builtinBindingPath(receiver.binding, state, specifiers, callee, [...receiver.path, method], true)?.length === 0 ? method : null;
					}
				}
				const source = semanticExpressionModuleOrigin(callee.object, state);
				if (method === null || source === undefined) return null;
				const origin = builtinNamespaceOrigin(source);
				return origin.importedPath.length === 0 && specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier) && !requiredModuleChanged(origin.specifier, [...origin.importedPath, method], callee, state, true, callee.object) ? method : null;
			}
			const binding = resolveSemanticBindingState(state, callee.object, callee.object.name);
			const method = semanticStaticPropertyKey(callee.property, callee.computed);
			if (method === null) return null;
			const resolvedPath = builtinBindingPath(binding, state, specifiers, callee, [method], true);
			if (resolvedPath?.length === 0) return method;
			const initializer = binding?.initializers[0];
			if (initializer === undefined || binding?.initializers.length !== 1 || !t.isMemberExpression(initializer.node) && !t.isOptionalMemberExpression(initializer.node)) {
				return null;
			}
			const provenance = evaluateSemanticProvenance(binding, state);
			if (provenance.status !== "module") return null;
			const origin = builtinNamespaceOrigin(provenance.origins[0]);
			const selected = [...origin.importedPath, method];
			return specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier) && builtinBindingPath(binding, state, specifiers, initializer.node, [method], true)?.length === 0 && !requiredModuleChanged(provenance.origins[0].specifier, selected, callee, state, true, initializer.node) ? method : null;
		};
		semanticBoundMemberPath = (node, state) => {
			const path = [];
			let current = unwrapJavaScriptExpression(node).node;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null || !t.isNode(current.object)) return undefined;
				path.unshift(key);
				current = unwrapJavaScriptExpression(current.object).node;
			}
			if (!t.isIdentifier(current)) return undefined;
			const binding = resolveSemanticBindingState(state, current, current.name);
			return binding === undefined ? undefined : {
				binding,
				path
			};
		};
		builtinBindingPath = (binding, state, specifiers, capture, selectedPath = [], callableValue = false, visited = new Set(), memo = new Map(), provenanceCapture, savedObjectCapture) => {
			if (binding === undefined) return null;
			const key = JSON.stringify([
				binding.bindingId,
				selectedPath,
				callableValue,
				provenanceCapture?.start,
				provenanceCapture?.end,
				savedObjectCapture?.start,
				savedObjectCapture?.end
			]);
			let captured = memo.get(capture);
			if (captured?.has(key)) return captured.get(key) ?? null;
			if (visited.has(binding.bindingId)) return null;
			if (captured === undefined) {
				captured = new Map();
				memo.set(capture, captured);
			}
			const result = computeBuiltinBindingPath(binding, state, specifiers, capture, selectedPath, callableValue, visited, memo, provenanceCapture, savedObjectCapture);
			captured.set(key, result);
			return result;
		};
		computeBuiltinBindingPath = (binding, state, specifiers, capture, selectedPath = [], callableValue = false, visited, memo, provenanceCapture, savedObjectCapture) => {
			if (binding === undefined || visited.has(binding.bindingId)) return null;
			if (binding.memberWrites.some(({ path, node }) => affectsBuiltinPath(path, selectedPath) && !(semanticTopLevelEffectFollowsCapture(path.length === 0 && provenanceCapture !== undefined ? provenanceCapture : capture, node, state.parentsByNode) || savedObjectCapture !== undefined && path.length < selectedPath.length && semanticTopLevelEffectFollowsCapture(savedObjectCapture, node, state.parentsByNode))) || builtinEscapes(binding, state).some(({ path, node }) => affectsBuiltinPath(path, selectedPath) && (!callableValue || path.length < selectedPath.length) && !semanticTopLevelEffectFollowsCapture(capture, node, state.parentsByNode))) return null;
			const provenance = provenanceCapture === undefined ? evaluateSemanticProvenance(binding, state) : evaluateSemanticProvenanceAtRead(binding, provenanceCapture, state);
			if (provenance.status !== "module") return null;
			const { importedPath } = provenance.origins[0];
			const namespace = builtinNamespaceOrigin(provenance.origins[0]);
			if (!specifiers.some((item) => {
				const name = item.replace(/^node:/u, "");
				return name === namespace.specifier || namespace.specifier === "fs" && selectedPath[0] === "promises" && name === "fs/promises";
			})) return null;
			let resolvedPath = importedPath;
			for (const origin of binding.directOrigins) {
				const shared = semanticMutableBuiltinOrigin(origin, selectedPath);
				if (shared !== undefined && requiredModuleChanged(shared.specifier, shared.path, capture, state, callableValue)) return null;
			}
			const ancestors = new Set([...visited, binding.bindingId]);
			for (const initializer of binding.initializers) {
				const pending = [{
					node: initializer.node,
					path: [...initializer.projection.map(String), ...selectedPath],
					savedObjectCapture: selectedPath.length > 0 && (t.isMemberExpression(initializer.node) || t.isOptionalMemberExpression(initializer.node)) ? initializer.node : savedObjectCapture,
					capture: callableValue && selectedPath.length === 0 && initializer.projection.length > 0 ? initializer.node : capture
				}];
				while (pending.length > 0) {
					const current = pending.pop();
					const node = unwrapJavaScriptExpression(current.node).node;
					if (t.isIdentifier(node)) {
						const source = resolveSemanticBindingState(state, node, node.name);
						const sourcePath = builtinBindingPath(source, state, specifiers, current.capture, current.path, callableValue, ancestors, memo, node, current.savedObjectCapture);
						if (sourcePath === null) return null;
						resolvedPath = [...sourcePath, ...current.path].slice(0, sourcePath.length + current.path.length - selectedPath.length);
					} else if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
						const key = semanticStaticPropertyKey(node.property, node.computed);
						if (key === null) return null;
						pending.push({
							node: node.object,
							path: [key, ...current.path],
							savedObjectCapture: current.savedObjectCapture,
							capture: callableValue && selectedPath.length === 0 ? node : current.capture
						});
					} else if (t.isSequenceExpression(node)) {
						const final = node.expressions.at(-1);
						if (final === undefined) return null;
						pending.push({
							...current,
							node: final
						});
					} else if (t.isAssignmentExpression(node) && node.operator === "=") {
						pending.push({
							...current,
							node: node.right
						});
					} else if (t.isConditionalExpression(node)) {
						pending.push({
							...current,
							node: node.consequent
						}, {
							...current,
							node: node.alternate
						});
					} else if (t.isLogicalExpression(node)) {
						pending.push({
							...current,
							node: node.left
						}, {
							...current,
							node: node.right
						});
					} else {
						const required = semanticRequireOrigin(node, state);
						if (required !== undefined && requiredModuleChanged(required.origin.specifier, [...required.origin.importedPath, ...current.path], current.capture, state, callableValue, current.savedObjectCapture)) return null;
					}
				}
			}
			return binding.directOrigins.length > 0 && semanticBuiltinNamespacePath(importedPath) ? [] : builtinNamespaceOrigin({
				...provenance.origins[0],
				importedPath: resolvedPath
			}).importedPath;
		};
		builtinNamespaceOrigin = (origin) => {
			const specifier = origin.specifier.replace(/^node:/u, "");
			const importedPath = origin.resolutionMode !== "require" && origin.importedPath[0] === "default" ? origin.importedPath.slice(1) : origin.importedPath;
			return specifier === "fs" && importedPath[0] === "promises" ? {
				...origin,
				specifier: "fs/promises",
				importedPath: importedPath.slice(1)
			} : {
				...origin,
				specifier,
				importedPath
			};
		};
		affectsBuiltinPath = (path, selected) => path.length <= selected.length && path.every((key, index) => semanticPropertyPathKeyMatches(key, selected[index]));
		BUILTIN_RECEIVER_METHODS = {
			fs: new Set([
				"readFile",
				"readFileSync",
				"writeFile",
				"writeFileSync",
				"close",
				"closeSync",
				"existsSync",
				...BUILTIN_RESOURCE_METHODS.fs
			]),
			"fs/promises": new Set([
				"readFile",
				"writeFile",
				...BUILTIN_RESOURCE_METHODS["fs/promises"]
			]),
			net: new Set(BUILTIN_RESOURCE_METHODS.net),
			tls: new Set(BUILTIN_RESOURCE_METHODS.tls),
			http: new Set(["request", "get"]),
			https: new Set(["request", "get"]),
			child_process: new Set([
				"spawn",
				"exec",
				"execFile",
				"fork"
			]),
			process: new Set([
				"cwd",
				"uptime",
				"hrtime",
				"nextTick"
			]),
			timers: new Set([
				"setTimeout",
				"setInterval",
				"setImmediate",
				"clearTimeout",
				"clearInterval",
				"clearImmediate"
			])
		};
		builtinEffectIndexes = new WeakMap();
		builtinEffectIndex = (state) => {
			let index = builtinEffectIndexes.get(state);
			if (index === undefined) {
				index = {
					writesByModule: new Map([...state.requiredModuleEffects].map(([name, effects]) => [name, effects.filter(({ kind }) => kind === "write")])),
					moduleEffects: new Map(),
					bindingEscapes: new Map(),
					receivers: new WeakMap()
				};
				builtinEffectIndexes.set(state, index);
			}
			return index;
		};
		builtinEscapes = (binding, state) => {
			const cache = builtinEffectIndex(state).bindingEscapes;
			let effects = cache.get(binding.bindingId);
			if (effects === undefined) {
				effects = binding.escapedPaths.filter(({ node }) => !originalBuiltinReceiver(node, state));
				cache.set(binding.bindingId, effects);
			}
			return effects;
		};
		builtinModuleEffects = (specifier, state) => {
			const cache = builtinEffectIndex(state).moduleEffects;
			let effects = cache.get(specifier);
			if (effects === undefined) {
				effects = (state.requiredModuleEffects.get(specifier) ?? []).filter(({ kind, node }) => kind === "write" || !originalBuiltinReceiver(node, state));
				if (specifier === "fs/promises") {
					const sharedFsEscapes = (state.requiredModuleEffects.get("fs") ?? []).filter(({ kind, path, node }) => kind === "escape" && (path.length === 0 || path[0] === "promises") && !originalBuiltinReceiver(node, state)).map((effect) => ({
						...effect,
						path: effect.path[0] === "promises" ? effect.path.slice(1) : effect.path
					}));
					effects = [...effects, ...sharedFsEscapes];
				}
				cache.set(specifier, effects);
			}
			return effects;
		};
		requiredModuleChanged = (specifier, selected, capture, state, callableValue = false, savedObjectCapture) => {
			const identity = semanticRequireExportsIdentity(specifier, selected);
			return builtinModuleEffects(identity.specifier, state).some(({ path, node, kind }) => !(savedObjectCapture !== undefined && path.length < identity.path.length && semanticTopLevelEffectFollowsCapture(savedObjectCapture, node, state.parentsByNode)) && affectsBuiltinPath(path, identity.path) && !semanticTopLevelEffectFollowsCapture(capture, node, state.parentsByNode) && (kind === "write" || !callableValue || path.length < identity.path.length));
		};
		originalBuiltinReceiver = (node, state) => {
			if (node === undefined) return false;
			const receivers = builtinEffectIndex(state).receivers;
			const previous = receivers.get(node);
			if (previous !== undefined) return previous;
			const result = computeOriginalBuiltinReceiver(node, state);
			receivers.set(node, result);
			return result;
		};
		computeOriginalBuiltinReceiver = (node, state) => {
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return false;
			const callee = node.callee;
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return false;
			const receiver = t.isIdentifier(callee.object) ? resolveSemanticBindingState(state, callee.object, callee.object.name) : undefined;
			const provenance = receiver === undefined ? undefined : evaluateSemanticProvenance(receiver, state);
			const sourceOrigin = provenance?.status === "module" ? provenance.origins[0] : semanticExpressionModuleOrigin(callee.object, state) ?? semanticRequireOrigin(callee.object, state)?.origin ?? semanticGlobalProcessOrigin(callee.object, state);
			if (sourceOrigin === undefined) return false;
			const origin = builtinNamespaceOrigin(sourceOrigin);
			if (origin.importedPath.length !== 0) return false;
			const method = semanticStaticPropertyKey(callee.property, callee.computed);
			const identity = semanticRequireExportsIdentity(origin.specifier, [method ?? ""]);
			if (method === null || !BUILTIN_RECEIVER_METHODS[origin.specifier]?.has(method) || receiver?.memberWrites.some(({ path, node: write }) => affectsBuiltinPath(path, [method]) && !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode)) || (builtinEffectIndex(state).writesByModule.get(identity.specifier) ?? []).some(({ path, node: write }) => affectsBuiltinPath(path, identity.path) && !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode))) return false;
			return !node.arguments.some((argument) => {
				if (!t.isIdentifier(argument)) return false;
				const passed = resolveSemanticBindingState(state, argument, argument.name);
				if (passed === undefined) return false;
				const passedOrigin = evaluateSemanticProvenance(passed, state);
				return passedOrigin.status === "module" && builtinNamespaceOrigin(passedOrigin.origins[0]).specifier === origin.specifier && builtinNamespaceOrigin(passedOrigin.origins[0]).importedPath.length === 0;
			});
		};
		semanticExpressionModuleOrigin = (expression, state, visited = new Set()) => {
			const node = unwrapJavaScriptExpression(expression).node;
			const required = semanticRequireOrigin(node, state);
			if (required !== undefined) return required.origin;
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				if (binding === undefined || visited.has(binding.bindingId)) return undefined;
				const provenance = evaluateSemanticProvenance(binding, state);
				return provenance.status === "module" ? provenance.origins[0] : undefined;
			}
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const base = semanticExpressionModuleOrigin(node.object, state, visited);
				const key = semanticStaticPropertyKey(node.property, node.computed);
				return base === undefined || key === null ? undefined : {
					...base,
					importedPath: [...base.importedPath, key]
				};
			}
			return undefined;
		};
		isSemanticProcessObject = (node, state, family, key) => {
			if (!t.isIdentifier(node)) return false;
			const binding = resolveSemanticBindingState(state, node, node.name);
			const selected = key === undefined || key === null ? [family] : [family, key];
			if (binding === undefined) return semanticGlobalProcessOrigin(node, state) !== undefined && !requiredModuleChanged("process", selected, node, state);
			return builtinBindingPath(binding, state, ["process", "node:process"], node, selected)?.length === 0;
		};
		outerDataEffectBinding = (node, context) => {
			return scalarAssignedResultBinding(assignedSemanticResultBindings(node, context.ancestors, context.state));
		};
		traverseDataEffects = (program, context, visit) => {
			const callableStack = createSemanticCallableIdStack(context.callableIds, context.callableStack);
			context.ancestors.length = 0;
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					visit(node, parent);
					context.ancestors.push(node);
				},
				exit: (node) => {
					context.ancestors.pop();
					callableStack.exit(node);
				}
			});
		};
		dataEffectArgumentBindingId = (node, state) => t.isIdentifier(node) ? resolveSemanticBindingState(state, node, node.name)?.bindingId ?? null : null;
		dataEffectPrimitive = (node) => {
			if (t.isStringLiteral(node) || t.isNumericLiteral(node)) return node.value;
			if (t.isBooleanLiteral(node)) return node.value;
			return null;
		};
		dataEffectLiteralString = (node) => {
			if (node === undefined) return null;
			const literal = readExactJavaScriptLiteral(node);
			if (literal.found && typeof literal.value === "string") return literal.value;
			return t.isTemplateLiteral(node) && node.expressions.length === 0 ? node.quasis[0]?.value.raw ?? null : null;
		};
		dataEffectMemberCallee = (node) => t.isMemberExpression(node.callee) || t.isOptionalMemberExpression(node.callee) ? node.callee : null;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAsyncEffects.js
var EVENT_REGISTER_METHODS, EVENT_REMOVE_METHODS, EVENT_LISTENER_METHODS, EVENT_METHODS, TIMER_SCHEDULE_METHODS, TIMER_CANCEL_METHODS, collectJavaScriptSemanticAsyncEffects, collectEvent, eventKind, emitterIdentity, collectTimer, resolveTimers, timerMethod, admittedTimerMethod, bindingId, timerDelay, timerId;
function init_javascriptSemanticAsyncEffects() {
	return (init_javascriptSemanticAsyncEffects = __esmMin((() => {
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		EVENT_REGISTER_METHODS = [
			"on",
			"once",
			"addListener",
			"prependListener",
			"prependOnceListener"
		];
		EVENT_REMOVE_METHODS = [
			"off",
			"removeListener",
			"removeAllListeners"
		];
		EVENT_LISTENER_METHODS = [
			...EVENT_REGISTER_METHODS,
			"off",
			"removeListener"
		];
		EVENT_METHODS = [
			...EVENT_REGISTER_METHODS,
			...EVENT_REMOVE_METHODS,
			"emit"
		];
		TIMER_SCHEDULE_METHODS = [
			"setTimeout",
			"setInterval",
			"setImmediate"
		];
		TIMER_CANCEL_METHODS = [
			"clearTimeout",
			"clearInterval",
			"clearImmediate"
		];
		collectJavaScriptSemanticAsyncEffects = (program, state, callables) => {
			const events = [];
			const timers = [];
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(callableIds);
			const ancestors = [];
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
						const ownerCallableId = callableStack.callables.at(-1) ?? null;
						collectEvent(node, ownerCallableId, state, events);
						collectTimer({
							node,
							ownerCallableId,
							state,
							output: timers,
							ancestors
						});
					}
					ancestors.push(node);
				},
				exit: (node) => {
					ancestors.pop();
					callableStack.exit(node);
				}
			});
			return {
				eventOperations: events,
				timerOperations: resolveTimers(timers)
			};
		};
		collectEvent = (node, ownerCallableId, state, output) => {
			const member = dataEffectMemberCallee(node);
			if (member === null) return;
			const method = EVENT_METHODS.find((candidate) => candidate === semanticStaticPropertyName(member.property, member.computed));
			if (method === undefined) return;
			const kind = eventKind(method);
			const eventArgument = node.arguments[0];
			const listenerArgument = EVENT_LISTENER_METHODS.includes(method) ? node.arguments[1] : undefined;
			const emitter = emitterIdentity(member.object, state);
			const eventName = dataEffectLiteralString(eventArgument);
			output.push({
				eventId: `event:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
				kind,
				method,
				location: range(node),
				ownerCallableId,
				emitterKey: emitter.key,
				emitterBindingId: emitter.bindingId,
				eventName,
				listenerBindingId: bindingId(listenerArgument, state),
				listenerLocation: t.isNode(listenerArgument) ? range(listenerArgument) : null,
				resolution: eventName === null ? "unresolved" : emitter.complete ? "complete" : "partial"
			});
		};
		eventKind = (method) => {
			if (EVENT_REGISTER_METHODS.some((candidate) => candidate === method)) return "register";
			if (EVENT_REMOVE_METHODS.some((candidate) => candidate === method)) return "remove";
			return "dispatch";
		};
		emitterIdentity = (node, state) => {
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				if (binding !== undefined) return {
					key: `binding:${binding.bindingId}`,
					bindingId: binding.bindingId,
					complete: true
				};
				return {
					key: `global:${node.name}`,
					bindingId: null,
					complete: !semanticResolutionBlocked(state, node, node.name)
				};
			}
			if (t.isThisExpression(node)) return {
				key: "this",
				bindingId: null,
				complete: true
			};
			return {
				key: `expression:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
				bindingId: null,
				complete: false
			};
		};
		collectTimer = (input) => {
			const { node, ownerCallableId, state, output, ancestors } = input;
			const method = timerMethod(node.callee, state);
			if (method === null) return;
			const kind = TIMER_SCHEDULE_METHODS.some((candidate) => candidate === method) ? "schedule" : "cancel";
			const projectedResultBindings = assignedSemanticResultBindings(node, ancestors, state);
			output.push({
				node,
				method,
				kind,
				ownerCallableId,
				handleBindingId: kind === "schedule" ? scalarAssignedResultBinding(projectedResultBindings) : bindingId(node.arguments[0], state),
				projectedResultBindings: kind === "schedule" ? semanticProjectedBindingFacts(projectedResultBindings.filter(({ projectionPath }) => projectionPath.length > 0)) : []
			});
		};
		resolveTimers = (candidates) => {
			const schedulesByBinding = new Map();
			for (const candidate of candidates) {
				if (candidate.kind !== "schedule") continue;
				const ids = [...candidate.handleBindingId === null ? [] : [candidate.handleBindingId], ...candidate.projectedResultBindings.map(({ bindingId }) => bindingId)];
				for (const id of ids) {
					const existing = schedulesByBinding.get(id) ?? [];
					existing.push(candidate);
					schedulesByBinding.set(id, existing);
				}
			}
			return candidates.map((candidate) => {
				const linked = candidate.kind === "cancel" && candidate.handleBindingId !== null ? schedulesByBinding.get(candidate.handleBindingId) ?? [] : [];
				return {
					timerId: timerId(candidate),
					kind: candidate.kind,
					method: candidate.method,
					location: range(candidate.node),
					ownerCallableId: candidate.ownerCallableId,
					handleBindingId: candidate.handleBindingId,
					projectedResultBindings: candidate.projectedResultBindings,
					linkedTimerId: linked.length === 1 && linked[0] !== undefined ? timerId(linked[0]) : null,
					delayMilliseconds: timerDelay(candidate),
					resolution: candidate.kind === "schedule" ? "complete" : linked.length === 1 && !linked[0]?.projectedResultBindings.some(({ bindingId }) => bindingId === candidate.handleBindingId) ? "complete" : linked.length > 1 ? "partial" : "unresolved"
				};
			});
		};
		timerMethod = (callee, state) => {
			if (t.isIdentifier(callee)) {
				const binding = resolveSemanticBindingState(state, callee, callee.name);
				if (binding === undefined) {
					const method = admittedTimerMethod(callee.name);
					if (method === null) return null;
					return semanticResolutionBlocked(state, callee, callee.name) ? null : method;
				}
			}
			return admittedTimerMethod(builtinDataEffectMethod(callee, state, ["timers", "node:timers"]) ?? "");
		};
		admittedTimerMethod = (value) => [...TIMER_SCHEDULE_METHODS, ...TIMER_CANCEL_METHODS].find((candidate) => candidate === value) ?? null;
		bindingId = (node, state) => t.isIdentifier(node) ? resolveSemanticBindingState(state, node, node.name)?.bindingId ?? null : null;
		timerDelay = (candidate) => {
			if (candidate.kind !== "schedule" || candidate.method === "setImmediate") return null;
			const delay = candidate.node.arguments[1];
			return t.isNumericLiteral(delay) ? delay.value : null;
		};
		timerId = (candidate) => `timer:${candidate.kind}:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCalls.js
var collectJavaScriptSemanticCalls, collectCallSite, collectCallResultFlow, retainedArguments, collectArgumentFlows, cachedParameterBindings, collectReturnFlows, collectCapture, collectDynamicProperty, collectDynamicScope, addFrontier, bindingIsWithinCallable, enclosingFunction, semanticCallSiteId;
function init_javascriptSemanticCalls() {
	return (init_javascriptSemanticCalls = __esmMin((() => {
		init_javascriptSemanticProjection();
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticCallResolution();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		collectJavaScriptSemanticCalls = (program, state, callables) => {
			const output = {
				callSites: [],
				argumentFlows: [],
				callReturnFlows: [],
				callResultFlows: [],
				closureCaptures: [],
				frontiers: []
			};
			const callableById = new Map(callables.map((callable) => [callable.callableId, callable]));
			const context = {
				state,
				callableById,
				output,
				bindingResolutionCache: new Map(),
				parameterBindingCache: new Map(),
				ancestors: []
			};
			const callableStack = createSemanticCallableStack((callableId) => callableById.get(callableId));
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					const owner = enclosingFunction(callableStack.callables);
					collectCapture(node, parent, owner, context);
					collectDynamicProperty(node, owner, state, output);
					collectDynamicScope(node, owner, state, output);
					if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) collectCallSite(node, parent, owner, context);
					context.ancestors.push(node);
				},
				exit: (node) => {
					context.ancestors.pop();
					callableStack.exit(node);
				}
			});
			return {
				callSites: output.callSites,
				argumentFlows: output.argumentFlows,
				callReturnFlows: output.callReturnFlows,
				callResultFlows: output.callResultFlows,
				closureCaptures: output.closureCaptures,
				frontiers: output.frontiers
			};
		};
		collectCallSite = (node, parent, owner, context) => {
			const { state, callableById, output } = context;
			const resolution = resolveLocalCallables({
				node: node.callee,
				state,
				callableById,
				seenBindings: new Set(),
				bindingCache: context.bindingResolutionCache
			});
			const callSiteId = semanticCallSiteId(node);
			const argumentsValue = retainedArguments(node.arguments);
			const site = {
				callSiteId,
				kind: t.isNewExpression(node) ? "construct" : "call",
				callerCallableId: owner?.callableId ?? null,
				location: range(node),
				calleeLocation: range(node.callee),
				resolution: resolution.callableIds.length === 1 && resolution.complete ? "exact" : resolution.callableIds.length > 0 ? "ambiguous" : "unresolved",
				calleeCallableIds: resolution.callableIds,
				arguments: argumentsValue
			};
			output.callSites.push(site);
			collectCallResultFlow(site, node, context);
			if (site.resolution !== "exact") addFrontier({
				kind: "dynamic-call",
				callableId: owner?.callableId ?? null,
				location: range(node.callee),
				reason: resolution.reason
			}, state, output);
			collectArgumentFlows(site, node, context);
			if (site.kind === "call") collectReturnFlows(site, callableById, state, output);
		};
		collectCallResultFlow = (site, node, context) => {
			for (const assigned of assignedSemanticResultBindings(node, context.ancestors, context.state).filter(({ projectionPath }) => projectionPath.length === 0)) {
				const binding = context.state.bindingsById.get(assigned.bindingId);
				if (binding === undefined) continue;
				const identifierRange = range(assigned.identifier);
				const definition = binding.definitions.find(({ location }) => location.start.line === identifierRange.start.line && location.start.column === identifierRange.start.column && location.end.line === identifierRange.end.line && location.end.column === identifierRange.end.column);
				if (definition === undefined) continue;
				context.output.callResultFlows.push({
					callSiteId: site.callSiteId,
					bindingId: binding.bindingId,
					definitionLocation: definition.location
				});
			}
		};
		retainedArguments = (nodes) => {
			const retained = [];
			for (const [index, node] of nodes.entries()) {
				if (node === null) continue;
				retained.push({
					index,
					location: range(node),
					spread: t.isSpreadElement(node)
				});
			}
			return retained;
		};
		collectArgumentFlows = (site, node, context) => {
			const { callableById, output } = context;
			const retainedIndexes = new Set(site.arguments.map(({ index }) => index));
			let positionIsExact = true;
			for (const [index, argument] of node.arguments.entries()) {
				if (t.isSpreadElement(argument)) {
					positionIsExact = false;
					continue;
				}
				if (!positionIsExact || !retainedIndexes.has(index) || !t.isExpression(argument)) continue;
				for (const callableId of site.calleeCallableIds) {
					const callable = callableById.get(callableId);
					if (callable === undefined) continue;
					for (const parameter of cachedParameterBindings(callable, index, context)) {
						const definition = parameter.definitions.find(({ kind }) => kind === "parameter");
						if (definition === undefined) continue;
						output.argumentFlows.push({
							callSiteId: site.callSiteId,
							argumentIndex: index,
							argumentLocation: range(argument),
							callableId,
							parameterBindingId: parameter.bindingId,
							parameterLocation: definition.location
						});
					}
				}
			}
		};
		cachedParameterBindings = (callable, index, context) => {
			const key = `${callable.callableId}:${String(index)}`;
			const cached = context.parameterBindingCache.get(key);
			if (cached !== undefined) return cached;
			const bindings = parameterBindings(callable, index, context.state);
			context.parameterBindingCache.set(key, bindings);
			return bindings;
		};
		collectReturnFlows = (site, callableById, state, output) => {
			for (const callableId of site.calleeCallableIds) {
				const callable = callableById.get(callableId);
				if (callable === undefined) continue;
				for (const returnSite of callable.returnSites) {
					output.callReturnFlows.push({
						callSiteId: site.callSiteId,
						callableId,
						returnSiteId: returnSite.returnSiteId,
						returnLocation: returnSite.location
					});
				}
			}
		};
		collectCapture = (node, parent, owner, context) => {
			const { state, output } = context;
			if (!t.isIdentifier(node) || parent === null || owner === undefined || owner.bodyScopeId === null) return;
			if (semanticReferenceRole(node, parent) === null) return;
			const binding = resolveSemanticBindingState(state, node, node.name);
			if (binding === undefined || bindingIsWithinCallable(binding, owner.bodyScopeId, state)) return;
			output.closureCaptures.push({
				callableId: owner.callableId,
				bindingId: binding.bindingId,
				referenceLocation: range(node)
			});
		};
		collectDynamicProperty = (node, owner, state, output) => {
			if ((t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && semanticStaticPropertyKey(node.property, node.computed) === null) addFrontier({
				kind: "dynamic-property",
				callableId: owner?.callableId ?? null,
				location: range(node.property),
				reason: "Computed member property is not a static string or number."
			}, state, output);
			else if ((t.isObjectProperty(node) || t.isObjectMethod(node)) && node.computed && semanticStaticPropertyKey(node.key, true) === null) addFrontier({
				kind: "dynamic-property",
				callableId: owner?.callableId ?? null,
				location: range(node.key),
				reason: "Computed object property is not a static string or number."
			}, state, output);
		};
		collectDynamicScope = (node, owner, state, output) => {
			const reason = t.isWithStatement(node) ? "`with` introduces a runtime binding environment; names inside are not statically resolvable." : t.isCallExpression(node) && isUnshadowedGlobal(node.callee, state, "eval") ? "`eval` can declare bindings at runtime; names inside the evaluated source are not statically resolvable." : null;
			if (reason === null) return;
			addFrontier({
				kind: "dynamic-scope",
				callableId: owner?.callableId ?? null,
				location: range(node),
				reason
			}, state, output);
		};
		addFrontier = (frontier, state, output) => {
			output.frontiers.push(frontier);
		};
		bindingIsWithinCallable = (binding, bodyScopeId, state) => {
			let scope = state.scopesById.get(binding.scopeId);
			while (scope !== undefined) {
				if (scope.scopeId === bodyScopeId) return true;
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return false;
		};
		enclosingFunction = (stack) => stack.findLast(({ kind }) => kind !== "class");
		semanticCallSiteId = (node) => [
			"call",
			t.isNewExpression(node) ? "construct" : "call",
			String(node.start ?? -1),
			String(node.end ?? -1)
		].join(":");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticChildProcesses.js
var CHILD_PROCESS_METHODS, CHILD_LISTENER_METHODS, collectJavaScriptSemanticChildProcesses, collectSpawns, immutableSpawn, collectInteractions, childInteraction, killSignalName, classifyInteraction, childProcessMethod, resolveChildCandidates, spawnOptions, spawnArgvCount, objectHasProperty, stdioMode, objectProperty$1, objectBinding, spawnId;
function init_javascriptSemanticChildProcesses() {
	return (init_javascriptSemanticChildProcesses = __esmMin((() => {
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		CHILD_PROCESS_METHODS = [
			"spawn",
			"exec",
			"execFile",
			"fork"
		];
		CHILD_LISTENER_METHODS = [
			"on",
			"once",
			"addListener"
		];
		collectJavaScriptSemanticChildProcesses = (program, state, callables) => {
			const candidates = collectSpawns(program, state, callables);
			const childProcessSpawns = candidates.map((candidate) => immutableSpawn(candidate));
			return {
				childProcessSpawns,
				childProcessInteractions: collectInteractions(program, state, callables, candidates)
			};
		};
		collectSpawns = (program, state, callables) => {
			const output = [];
			const admittedCallables = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(admittedCallables);
			const ancestors = [];
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
						const method = childProcessMethod(node.callee, state);
						if (method !== null) {
							const projectedResultBindings = assignedSemanticResultBindings(node, ancestors, state);
							output.push({
								node,
								method,
								ownerCallableId: callableStack.callables.at(-1) ?? null,
								resultBindingId: scalarAssignedResultBinding(projectedResultBindings),
								projectedResultBindings: semanticProjectedBindingFacts(projectedResultBindings.filter(({ projectionPath }) => projectionPath.length > 0))
							});
						}
					}
					ancestors.push(node);
				},
				exit: (node) => {
					ancestors.pop();
					callableStack.exit(node);
				}
			});
			return output;
		};
		immutableSpawn = (candidate) => {
			const options = spawnOptions(candidate);
			const command = dataEffectLiteralString(candidate.node.arguments[0]);
			return {
				processId: spawnId(candidate),
				method: candidate.method,
				location: range(candidate.node),
				ownerCallableId: candidate.ownerCallableId,
				resultBindingId: candidate.resultBindingId,
				projectedResultBindings: candidate.projectedResultBindings,
				command,
				argvCount: spawnArgvCount(candidate),
				environmentSupplied: objectHasProperty(options, "env"),
				stdioMode: stdioMode(options),
				resolution: command === null ? "partial" : "complete"
			};
		};
		collectInteractions = (program, state, callables, spawns) => {
			const output = [];
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(callableIds);
			const spawnByNode = new WeakMap();
			const spawnsByBinding = new Map();
			for (const spawn of spawns) {
				spawnByNode.set(spawn.node, spawn);
				const ids = [...spawn.resultBindingId === null ? [] : [spawn.resultBindingId], ...spawn.projectedResultBindings.map(({ bindingId }) => bindingId)];
				for (const id of ids) {
					const existing = spawnsByBinding.get(id) ?? [];
					existing.push(spawn);
					spawnsByBinding.set(id, existing);
				}
			}
			const context = {
				state,
				spawnByNode,
				spawnsByBinding
			};
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
					const interaction = childInteraction(node, callableStack.callables.at(-1) ?? null, context);
					if (interaction === null) return;
					output.push(interaction);
				},
				exit: (node) => callableStack.exit(node)
			});
			return output;
		};
		childInteraction = (node, ownerCallableId, context) => {
			const { state, spawnByNode, spawnsByBinding } = context;
			const member = dataEffectMemberCallee(node);
			if (member === null) return null;
			const method = semanticStaticPropertyName(member.property, member.computed);
			const binding = objectBinding(member.object, state);
			const linked = resolveChildCandidates(member.object, binding, spawnByNode, spawnsByBinding);
			if (linked.length === 0) return null;
			const classification = classifyInteraction(method, node.arguments[0]);
			if (classification === null) return null;
			const { kind, interactionMethod, eventName } = classification;
			const listener = node.arguments[1];
			return {
				interactionId: `child:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
				kind,
				method: interactionMethod,
				location: range(node),
				ownerCallableId,
				processBindingId: binding?.bindingId ?? null,
				linkedProcessIds: linked.map((candidate) => spawnId(candidate)).sort(compareUnicodeCodePoints),
				eventName: kind === "listener" ? eventName : null,
				signalName: kind === "signal" ? killSignalName(node.arguments, state) : null,
				listenerLocation: kind === "listener" && t.isNode(listener) ? range(listener) : null,
				resolution: linked.length === 1 && !linked[0]?.projectedResultBindings.some(({ bindingId }) => bindingId === binding?.bindingId) ? "complete" : "partial"
			};
		};
		killSignalName = (args, state) => {
			const [signal] = args;
			if (signal === undefined) return "SIGTERM";
			const expression = unwrapJavaScriptExpression(signal).node;
			if (t.isUnaryExpression(expression, { operator: "void" }) || isUnshadowedGlobal(expression, state, "undefined")) return "SIGTERM";
			return dataEffectLiteralString(signal);
		};
		classifyInteraction = (method, argument) => {
			if (method === "kill") return {
				kind: "signal",
				interactionMethod: "kill",
				eventName: null
			};
			const listenerMethod = CHILD_LISTENER_METHODS.find((candidate) => candidate === method);
			const eventName = dataEffectLiteralString(argument);
			return listenerMethod !== undefined && (eventName === "exit" || eventName === "error") ? {
				kind: "listener",
				interactionMethod: listenerMethod,
				eventName
			} : null;
		};
		childProcessMethod = (callee, state) => {
			const method = builtinDataEffectMethod(callee, state, ["child_process", "node:child_process"]);
			return CHILD_PROCESS_METHODS.find((candidate) => candidate === method) ?? null;
		};
		resolveChildCandidates = (node, binding, spawnByNode, spawnsByBinding) => {
			const direct = spawnByNode.get(node);
			if (direct !== undefined) return [direct];
			return binding === undefined ? [] : spawnsByBinding.get(binding.bindingId) ?? [];
		};
		spawnOptions = (candidate) => {
			const args = candidate.node.arguments;
			const value = candidate.method === "exec" ? args[1] : t.isObjectExpression(args[1]) ? args[1] : args[2];
			return t.isObjectExpression(value) ? value : null;
		};
		spawnArgvCount = (candidate) => {
			if (candidate.method === "exec") return null;
			const args = candidate.node.arguments[1];
			return t.isArrayExpression(args) && !args.elements.some((element) => t.isSpreadElement(element)) ? args.elements.length : null;
		};
		objectHasProperty = (object, name) => objectProperty$1(object, name) !== null;
		stdioMode = (options) => {
			const property = objectProperty$1(options, "stdio");
			if (property === null || !t.isObjectProperty(property)) return "default";
			if (t.isStringLiteral(property.value)) return property.value.value;
			if (t.isArrayExpression(property.value)) return "array";
			return "dynamic";
		};
		objectProperty$1 = (object, name) => object?.properties.find((property) => (t.isObjectMethod(property) || t.isObjectProperty(property)) && semanticStaticPropertyName(property.key, property.computed) === name) ?? null;
		objectBinding = (node, state) => t.isIdentifier(node) ? resolveSemanticBindingState(state, node, node.name) : undefined;
		spawnId = (candidate) => `child:spawn:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticFingerprints.js
/** Build bounded rename- and formatting-resistant components per callable, yielding between callables. */
function* collectJavaScriptSemanticFingerprintsSteps(input) {
	const { state, callables, calls, promises, events, timers, childProcessSpawns, childProcessInteractions, requestOperations, resourceOperations, parserPartial } = input;
	const callSitesByCaller = groupByOwner(calls.callSites, ({ callerCallableId }) => callerCallableId);
	const captureCountByCallable = countByOwner(calls.closureCaptures, ({ callableId }) => callableId);
	const promiseEffectsByOwner = groupByOwner(promises, ownerId);
	const eventEffectsByOwner = groupByOwner(events, ownerId);
	const timerEffectsByOwner = groupByOwner(timers, ownerId);
	const childProcessEffectsByOwner = groupByOwner([...childProcessSpawns, ...childProcessInteractions], ownerId);
	const networkEffectsByOwner = groupByOwner(requestOperations, ownerId);
	const resourceEffectsByOwner = groupByOwner(resourceOperations, ownerId);
	const fingerprints = [];
	for (const callable of callables) {
		if (callable.kind === "class") continue;
		const node = state.callableNodesById.get(callable.callableId);
		if (node === undefined) continue;
		yield;
		const syntax = yield* fingerprintSyntaxSteps(node);
		const promiseEffects = promiseEffectsByOwner.get(callable.callableId) ?? [];
		const eventEffects = eventEffectsByOwner.get(callable.callableId) ?? [];
		const timerEffects = timerEffectsByOwner.get(callable.callableId) ?? [];
		const childProcessEffects = childProcessEffectsByOwner.get(callable.callableId) ?? [];
		const networkEffects = networkEffectsByOwner.get(callable.callableId) ?? [];
		const resourceEffects = resourceEffectsByOwner.get(callable.callableId) ?? [];
		fingerprints.push({
			callableId: callable.callableId,
			status: parserPartial || callable.returnCoverage.status !== "complete" ? "partial" : "complete",
			components: {
				parameterArity: callableParameterArity(node),
				normalizedAstSha256: digest(syntax.normalizedTokens),
				controlFlowSha256: digest(syntax.controlFlowTokens),
				relationShapeSha256: digest(relationShape(callable, callSitesByCaller.get(callable.callableId) ?? [], captureCountByCallable.get(callable.callableId) ?? 0, promiseEffects)),
				literalSetSha256: digest([...new Set(syntax.literals)].sort(compareUnicodeCodePoints)),
				effects: [
					...isAsyncCallable(node) ? ["async"] : [],
					...childProcessEffects.length > 0 ? ["child-process"] : [],
					...eventEffects.length > 0 ? ["event"] : [],
					...networkEffects.length > 0 ? ["network"] : [],
					...promiseEffects.length > 0 ? ["promise"] : [],
					...resourceEffects.length > 0 ? ["resource"] : [],
					...timerEffects.length > 0 ? ["timer"] : []
				]
			},
			limitations: ["The fingerprint is a static candidate and does not prove behavioral equivalence.", ...parserPartial ? ["Incomplete semantic recovery makes this fingerprint partial."] : []]
		});
	}
	return fingerprints;
}
function* fingerprintSyntaxSteps(root) {
	const normalizedTokens = [];
	const controlFlowTokens = [];
	const literals = [];
	yield* traverseJavaScriptAstSteps(root, {
		skip: (node) => semanticCallableIdForNode(node) !== null,
		enter: (node, parent) => {
			normalizedTokens.push(normalizedNodeToken(node, parent));
			const control = controlFlowToken(node);
			if (control !== null) controlFlowTokens.push(control);
			const literal = semanticLiteral(node);
			if (literal !== null) literals.push(literal);
		}
	});
	return {
		normalizedTokens,
		controlFlowTokens,
		literals
	};
}
var ownerId, groupByOwner, countByOwner, normalizedNodeToken, primitiveAttribute, propertyIdentity, controlFlowToken, semanticLiteral, relationShape, callableParameterArity, isAsyncCallable, digest;
function init_javascriptSemanticFingerprints() {
	return (init_javascriptSemanticFingerprints = __esmMin((() => {
		init_javascriptAstValues();
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptSemanticTraversal();
		ownerId = (value) => value.ownerCallableId;
		groupByOwner = (values, getOwner) => {
			const grouped = new Map();
			for (const value of values) {
				const owner = getOwner(value);
				const ownedValues = grouped.get(owner);
				if (ownedValues === undefined) grouped.set(owner, [value]);
				else ownedValues.push(value);
			}
			return grouped;
		};
		countByOwner = (values, getOwner) => {
			const counts = new Map();
			for (const value of values) {
				const owner = getOwner(value);
				counts.set(owner, (counts.get(owner) ?? 0) + 1);
			}
			return counts;
		};
		normalizedNodeToken = (node, parent) => {
			if (t.isIdentifier(node)) return propertyIdentity(node, parent) ? `property:${node.name}` : "identifier";
			if (t.isStringLiteral(node)) return propertyIdentity(node, parent) ? `property:${node.value}` : "string-literal";
			const attributes = [
				primitiveAttribute(node, "operator"),
				primitiveAttribute(node, "kind"),
				primitiveAttribute(node, "computed"),
				primitiveAttribute(node, "optional"),
				primitiveAttribute(node, "async"),
				primitiveAttribute(node, "generator"),
				primitiveAttribute(node, "delegate"),
				primitiveAttribute(node, "prefix")
			].filter((value) => value !== null);
			return [node.type, ...attributes].join(":");
		};
		primitiveAttribute = (node, key) => {
			const value = Reflect.get(node, key);
			return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? `${key}=${String(value)}` : null;
		};
		propertyIdentity = (node, parent) => {
			if (parent === null) return false;
			if ((t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) && parent.property === node) return !parent.computed || t.isStringLiteral(node);
			if ((t.isObjectProperty(parent) || t.isObjectMethod(parent) || t.isClassMethod(parent) || t.isClassProperty(parent)) && parent.key === node) return !parent.computed || t.isStringLiteral(node);
			return false;
		};
		controlFlowToken = (node) => {
			if (!t.isIfStatement(node) && !t.isConditionalExpression(node) && !t.isSwitchStatement(node) && !t.isSwitchCase(node) && !t.isLoop(node) && !t.isTryStatement(node) && !t.isCatchClause(node) && !t.isReturnStatement(node) && !t.isThrowStatement(node) && !t.isAwaitExpression(node) && !t.isYieldExpression(node) && !t.isLogicalExpression(node)) return null;
			const operator = primitiveAttribute(node, "operator");
			return operator === null ? node.type : `${node.type}:${operator}`;
		};
		semanticLiteral = (node) => {
			if (t.isDirectiveLiteral(node)) return `directive:${node.value}`;
			if (t.isStringLiteral(node)) return `string:${node.value}`;
			if (t.isNumericLiteral(node)) return `number:${String(node.value)}`;
			if (t.isBooleanLiteral(node)) return `boolean:${String(node.value)}`;
			if (t.isNullLiteral(node)) return "null";
			if (t.isBigIntLiteral(node)) return `bigint:${node.value}`;
			if (t.isRegExpLiteral(node)) return `regexp:${node.pattern}/${node.flags}`;
			if (t.isTemplateElement(node)) return `template:${node.value.cooked ?? node.value.raw}`;
			return null;
		};
		relationShape = (callable, callSites, captureCount, promises) => [
			`returns:${String(callable.returnSites.length)}:${callable.returnCoverage.status}`,
			...callSites.map(({ kind, resolution, arguments: args, calleeCallableIds }) => `call:${kind}:${resolution}:${String(args.length)}:${String(calleeCallableIds.length)}`),
			`captures:${String(captureCount)}`,
			...promises.map(({ kind, method, ownership, sourceResolution }) => `promise:${kind}:${method}:${ownership}:${sourceResolution}`)
		];
		callableParameterArity = (node) => t.isFunction(node) ? runtimeFunctionParameters(node).length : 0;
		isAsyncCallable = (node) => t.isFunction(node) && node.async;
		digest = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDataEffects.js
var collectJavaScriptSemanticDataEffects, collectConfigurations, configurationDetails, processConfigurationMember, isArrayIndexKey, collectDefaults, collectRequests, collectResponseConsumers, collectBoundaries, boundaryDetails, requestMethod, requestFields, requestEndpoint;
function init_javascriptSemanticDataEffects() {
	return (init_javascriptSemanticDataEffects = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticDataEffectHelpers();
		init_javascriptStaticAnalysisHelpers();
		collectJavaScriptSemanticDataEffects = (program, state, callables) => {
			const context = {
				state,
				callableIds: new Set(callables.map(({ callableId }) => callableId)),
				callableStack: [],
				ancestors: []
			};
			const configuration = collectConfigurations(program, context);
			const requests = collectRequests(program, context);
			return {
				configurationOperations: [...configuration.map(({ operation }) => operation), ...collectDefaults(program, context, configuration)],
				requestOperations: [...requests.map(({ operation }) => operation), ...collectResponseConsumers(program, context, requests)],
				boundaryOperations: collectBoundaries(program, context)
			};
		};
		collectConfigurations = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				const details = configurationDetails(node, context);
				if (details === null) return;
				const operation = {
					configId: `config:${details.kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: details.kind,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context),
					key: details.key,
					sourceConfigId: null,
					value: null,
					resolution: details.resolution
				};
				output.push({
					node,
					operation
				});
			});
			return output;
		};
		configurationDetails = (node, context) => {
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const processMember = processConfigurationMember(node, context.state);
				if (processMember !== null) return processMember;
			}
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return null;
			const fileMethod = builtinDataEffectMethod(node.callee, context.state, ["fs", "node:fs"]);
			return fileMethod === "readFile" || fileMethod === "readFileSync" ? {
				kind: "file",
				key: dataEffectLiteralString(node.arguments[0]),
				resolution: dataEffectLiteralString(node.arguments[0]) === null ? "partial" : "complete"
			} : null;
		};
		processConfigurationMember = (node, state) => {
			const object = node.object;
			if (!t.isMemberExpression(object) && !t.isOptionalMemberExpression(object)) return null;
			const family = semanticStaticPropertyName(object.property, object.computed);
			if (family !== "env" && family !== "argv") return null;
			const key = semanticStaticPropertyKey(node.property, node.computed);
			if (family === "argv" && key !== null && !isArrayIndexKey(key)) return null;
			if (!isSemanticProcessObject(object.object, state, family, key)) return null;
			return {
				kind: family === "env" ? "environment" : "argv",
				key,
				resolution: key === null ? "partial" : "complete"
			};
		};
		isArrayIndexKey = (key) => {
			if (!/^(?:0|[1-9][0-9]*)$/u.test(key)) return false;
			const index = Number(key);
			return Number.isSafeInteger(index) && index < 2 ** 32 - 1;
		};
		collectDefaults = (program, context, configurations) => {
			const output = [];
			const configurationsByNode = new Map(configurations.map((candidate) => [candidate.node, candidate]));
			traverseDataEffects(program, context, (node) => {
				if (!t.isLogicalExpression(node) || node.operator !== "??" && node.operator !== "||") return;
				const source = unwrapJavaScriptExpression(node.left).node;
				const candidate = configurationsByNode.get(source);
				if (candidate === undefined) return;
				output.push({
					configId: `config:default:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: "default",
					location: range(node.right),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context),
					key: candidate.operation.key,
					sourceConfigId: candidate.operation.configId,
					value: dataEffectPrimitive(node.right),
					resolution: dataEffectPrimitive(node.right) === null ? "partial" : "complete"
				});
			});
			return output;
		};
		collectRequests = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node)) return;
				const method = requestMethod(node, context.state);
				if (method === null) return;
				const endpoint = requestEndpoint(node);
				output.push({
					node,
					operation: {
						requestId: `request:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
						kind: "request",
						method,
						location: range(node),
						ownerCallableId: context.callableStack.at(-1) ?? null,
						resultBindingId: outerDataEffectBinding(node, context),
						projectedResultBindings: semanticProjectedBindingFacts(assignedSemanticResultBindings(node, context.ancestors, context.state).filter(({ projectionPath }) => projectionPath.length > 0)),
						linkedRequestIds: [],
						endpoint,
						fields: requestFields(node, method, context.state),
						resolution: endpoint === null ? "partial" : "complete"
					}
				});
			});
			return output;
		};
		collectResponseConsumers = (program, context, requests) => {
			const requestsByBinding = new Map();
			for (const request of requests) {
				const bindingIds = [...request.operation.resultBindingId === null ? [] : [request.operation.resultBindingId], ...request.operation.projectedResultBindings.map(({ bindingId }) => bindingId)];
				for (const bindingId of bindingIds) {
					const existing = requestsByBinding.get(bindingId) ?? [];
					existing.push(request);
					requestsByBinding.set(bindingId, existing);
				}
			}
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const member = dataEffectMemberCallee(node);
				if (member === null || !t.isIdentifier(member.object)) return;
				const method = semanticStaticPropertyName(member.property, member.computed);
				if (method !== "json" && method !== "text" && method !== "arrayBuffer") return;
				const binding = resolveSemanticBindingState(context.state, member.object, member.object.name);
				const linked = binding === undefined ? [] : requestsByBinding.get(binding.bindingId) ?? [];
				if (linked.length === 0) return;
				output.push({
					requestId: `response:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: "response-consumer",
					method,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context),
					projectedResultBindings: semanticProjectedBindingFacts(assignedSemanticResultBindings(node, context.ancestors, context.state).filter(({ projectionPath }) => projectionPath.length > 0)),
					linkedRequestIds: linked.map(({ operation }) => operation.requestId).sort(compareUnicodeCodePoints),
					endpoint: null,
					fields: [],
					resolution: linked.length === 1 && !linked[0]?.operation.projectedResultBindings.some(({ bindingId }) => bindingId === binding?.bindingId) ? "complete" : "partial"
				});
			});
			return output;
		};
		collectBoundaries = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const details = boundaryDetails(node, context.state);
				if (details === null) return;
				output.push({
					boundaryId: `boundary:${details.kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: details.kind,
					method: details.method,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					sourceBindingId: dataEffectArgumentBindingId(node.arguments[0], context.state),
					resultBindingId: outerDataEffectBinding(node, context),
					resolution: details.resolution
				});
			});
			return output;
		};
		boundaryDetails = (node, state) => {
			if (t.isIdentifier(node.callee)) {
				const name = node.callee.name;
				const unbound = resolveSemanticBindingState(state, node.callee, name) === undefined && !semanticResolutionBlocked(state, node.callee, name);
				if (unbound && [
					"String",
					"Number",
					"Boolean",
					"parseInt",
					"parseFloat"
				].includes(name)) return {
					kind: "coerce",
					method: name,
					resolution: "complete"
				};
			}
			const member = dataEffectMemberCallee(node);
			if (member === null) return null;
			const method = semanticStaticPropertyName(member.property, member.computed);
			if (method === "parse" && t.isIdentifier(member.object, { name: "JSON" }) && resolveSemanticBindingState(state, member.object, "JSON") === undefined && !semanticResolutionBlocked(state, member.object, "JSON")) return {
				kind: "parse",
				method: "JSON.parse",
				resolution: "complete"
			};
			if (method === "parse" || method === "safeParse") return {
				kind: "parse",
				method,
				resolution: "partial"
			};
			if (method === "validate" || method === "assert" || method === "is") return {
				kind: "validate",
				method,
				resolution: "partial"
			};
			return null;
		};
		requestMethod = (node, state) => {
			if (t.isIdentifier(node.callee)) {
				const name = node.callee.name;
				const unbound = resolveSemanticBindingState(state, node.callee, name) === undefined && !semanticResolutionBlocked(state, node.callee, name);
				if (!t.isNewExpression(node) && unbound && name === "fetch") return "fetch";
				if (t.isNewExpression(node) && unbound && name === "WebSocket") return "WebSocket";
			}
			const method = builtinDataEffectMethod(node.callee, state, [
				"http",
				"https",
				"node:http",
				"node:https"
			]);
			return method === "request" || method === "get" ? method : null;
		};
		requestFields = (node, method, state) => {
			const candidate = method === "fetch" || method === "WebSocket" ? node.arguments[1] : t.isObjectExpression(node.arguments[0]) ? node.arguments[0] : node.arguments[1];
			if (!t.isObjectExpression(candidate)) return [];
			return candidate.properties.flatMap((property) => {
				if (!t.isObjectProperty(property)) return [];
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) return [];
				return [{
					name,
					sourceBindingId: t.isIdentifier(property.value) ? resolveSemanticBindingState(state, property.value, property.value.name)?.bindingId ?? null : null
				}];
			});
		};
		requestEndpoint = (node) => t.isObjectExpression(node.arguments[0]) ? null : dataEffectLiteralString(node.arguments[0]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPromises.js
var collectJavaScriptSemanticPromises, collectCandidates, promiseCandidateDetails, isUnshadowedGlobalPromise, isPromiseProducer, semanticPromiseId, promiseOwnership, ownershipAtAncestor, isUnmodeledCall, assignedPromiseBinding, returnedPromiseOwnership, outerConsumesCandidate, emptyOwnership, indexReturnSites, createReturnSiteLookup, indexCallablesById, returnSiteKey, promiseSources, aggregateSources, resolvePromiseExpression, promiseResolutionContext, combinePromiseResolutions, completePromise, unresolvedPromise, isObviouslyNonPromise;
function init_javascriptSemanticPromises() {
	return (init_javascriptSemanticPromises = __esmMin((() => {
		init_javascriptSemanticProjection();
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		collectJavaScriptSemanticPromises = (program, state, callables) => {
			const candidates = collectCandidates(program, state, callables);
			const returnSiteIdFor = createReturnSiteLookup(callables);
			const candidateByNode = new WeakMap();
			for (const candidate of candidates) candidateByNode.set(candidate.node, candidate);
			return candidates.map((candidate) => {
				const ownership = promiseOwnership(candidate, candidateByNode, state, returnSiteIdFor);
				const sources = promiseSources(candidate, candidateByNode, state);
				return {
					promiseId: candidate.promiseId,
					kind: candidate.kind,
					method: candidate.method,
					location: range(candidate.node),
					ownerCallableId: candidate.ownerCallableId,
					...ownership,
					sourcePromiseIds: [...new Set(sources.promiseIds)].sort(compareUnicodeCodePoints),
					sourceResolution: sources.status
				};
			});
		};
		collectCandidates = (program, state, callables) => {
			const output = [];
			const admittedCallables = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(admittedCallables);
			const ancestors = [];
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					const details = promiseCandidateDetails(node, state);
					if (details !== null) {
						output.push({
							node,
							...details,
							promiseId: semanticPromiseId(details.kind, node),
							ownerCallableId: callableStack.callables.at(-1) ?? null,
							ancestors: [...ancestors]
						});
					}
					ancestors.push(node);
				},
				exit: (node) => {
					ancestors.pop();
					callableStack.exit(node);
				}
			});
			return output;
		};
		promiseCandidateDetails = (node, state) => {
			if (t.isNewExpression(node) && t.isIdentifier(node.callee, { name: "Promise" }) && isUnshadowedGlobalPromise(node.callee, state)) return {
				kind: "constructor",
				method: "new"
			};
			if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
				const member = dataEffectMemberCallee(node);
				if (member === null) return null;
				const method = semanticStaticPropertyName(member.property, member.computed);
				if (t.isIdentifier(member.object, { name: "Promise" }) && isUnshadowedGlobalPromise(member.object, state)) {
					if (method === "all" || method === "allSettled") return {
						kind: "aggregate",
						method
					};
					if (method === "resolve" || method === "reject") return {
						kind: "static",
						method
					};
				}
				if (method === "then" || method === "catch" || method === "finally") return {
					kind: "chain",
					method
				};
			}
			if (t.isAwaitExpression(node) && !isPromiseProducer(node.argument, state)) return {
				kind: "awaited-expression",
				method: "await"
			};
			return null;
		};
		isUnshadowedGlobalPromise = (node, state) => resolveSemanticBindingState(state, node, "Promise") === undefined && !semanticResolutionBlocked(state, node, "Promise");
		isPromiseProducer = (node, state) => promiseCandidateDetails(unwrapJavaScriptExpression(node).node, state) !== null;
		semanticPromiseId = (kind, node) => `promise:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		promiseOwnership = (candidate, candidateByNode, state, returnSiteIdFor) => {
			if (candidate.kind === "awaited-expression") return emptyOwnership("awaited");
			const context = {
				candidate,
				candidateByNode,
				state,
				returnSiteIdFor
			};
			for (let index = candidate.ancestors.length - 1; index >= 0; index -= 1) {
				const ancestor = candidate.ancestors[index];
				if (ancestor === undefined) continue;
				const ownership = ownershipAtAncestor(ancestor, context);
				if (ownership === "boundary") break;
				if (ownership !== null) return ownership;
			}
			return emptyOwnership("unknown");
		};
		ownershipAtAncestor = (ancestor, context) => {
			const { candidate, candidateByNode, state, returnSiteIdFor } = context;
			if (t.isAwaitExpression(ancestor)) return unwrapJavaScriptExpression(ancestor.argument).node === candidate.node ? emptyOwnership("awaited") : "boundary";
			const outer = candidateByNode.get(ancestor);
			if (outer !== undefined && outer.ownerCallableId === candidate.ownerCallableId && outerConsumesCandidate(outer, candidate)) return outer.kind === "chain" ? emptyOwnership("chained") : emptyOwnership("aggregated");
			if (isUnmodeledCall(ancestor, outer)) return "boundary";
			const assigned = assignedPromiseBinding(ancestor, candidate.node, state);
			if (assigned !== undefined) return {
				ownership: "assigned",
				ownerBindingId: assigned,
				returnSiteId: null
			};
			if (t.isReturnStatement(ancestor)) {
				if (ancestor.argument == null || unwrapJavaScriptExpression(ancestor.argument).node !== candidate.node) return "boundary";
				return returnedPromiseOwnership(candidate.ownerCallableId, range(ancestor), returnSiteIdFor);
			}
			if (t.isExpressionStatement(ancestor)) return unwrapJavaScriptExpression(ancestor.expression).node === candidate.node ? emptyOwnership("detached") : "boundary";
			const callableId = semanticCallableIdForNode(ancestor);
			if (callableId === null || callableId !== candidate.ownerCallableId) return null;
			return t.isArrowFunctionExpression(ancestor) && unwrapJavaScriptExpression(ancestor.body).node === candidate.node ? returnedPromiseOwnership(candidate.ownerCallableId, range(ancestor.body), returnSiteIdFor) : "boundary";
		};
		isUnmodeledCall = (node, candidate) => candidate === undefined && (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node));
		assignedPromiseBinding = (ancestor, candidate, state) => {
			if (!t.isVariableDeclarator(ancestor) && !t.isAssignmentExpression(ancestor)) return undefined;
			const source = t.isVariableDeclarator(ancestor) ? ancestor.init : ancestor.right;
			if (source == null) return undefined;
			if (unwrapJavaScriptExpression(source).node !== candidate) return undefined;
			return scalarAssignedResultBinding(assignedSemanticResultBindings(source, [ancestor], state));
		};
		returnedPromiseOwnership = (callableId, location, returnSiteIdFor) => ({
			ownership: "returned",
			ownerBindingId: null,
			returnSiteId: returnSiteIdFor(callableId, location)
		});
		outerConsumesCandidate = (outer, candidate) => {
			if (outer.kind === "chain" && (t.isCallExpression(outer.node) || t.isOptionalCallExpression(outer.node))) {
				const member = dataEffectMemberCallee(outer.node);
				return member !== null && unwrapJavaScriptExpression(member.object).node === candidate.node;
			}
			if (outer.kind === "aggregate" && (t.isCallExpression(outer.node) || t.isOptionalCallExpression(outer.node))) {
				const input = outer.node.arguments[0];
				return t.isArrayExpression(input) && input.elements.some((element) => element !== null && !t.isSpreadElement(element) && unwrapJavaScriptExpression(element).node === candidate.node);
			}
			return false;
		};
		emptyOwnership = (ownership) => ({
			ownership,
			ownerBindingId: null,
			returnSiteId: null
		});
		indexReturnSites = (callable) => {
			const output = new Map();
			for (const site of callable.returnSites) {
				const key = returnSiteKey(site.location);
				if (!output.has(key)) output.set(key, site.returnSiteId);
			}
			return output;
		};
		createReturnSiteLookup = (callables) => {
			let callablesById;
			let returnSiteIdsByCallable;
			return (callableId, location) => {
				if (callableId === null) return null;
				callablesById ??= indexCallablesById(callables);
				const callable = callablesById.get(callableId);
				if (callable === undefined) return null;
				returnSiteIdsByCallable ??= new Map();
				let returnSiteIds = returnSiteIdsByCallable.get(callableId);
				if (returnSiteIds === undefined) {
					returnSiteIds = indexReturnSites(callable);
					returnSiteIdsByCallable.set(callableId, returnSiteIds);
				}
				return returnSiteIds.get(returnSiteKey(location)) ?? null;
			};
		};
		indexCallablesById = (callables) => {
			const output = new Map();
			for (const callable of callables) {
				if (output.has(callable.callableId)) continue;
				output.set(callable.callableId, callable);
			}
			return output;
		};
		returnSiteKey = (location) => `${location.start.line}:${location.start.column}:${location.end.line}:${location.end.column}`;
		promiseSources = (candidate, candidateByNode, state) => {
			if (candidate.kind === "chain") {
				const member = t.isCallExpression(candidate.node) || t.isOptionalCallExpression(candidate.node) ? dataEffectMemberCallee(candidate.node) : null;
				return member === null ? unresolvedPromise() : resolvePromiseExpression(member.object, promiseResolutionContext(candidate, candidateByNode, state));
			}
			if (candidate.kind === "aggregate") return aggregateSources(candidate, candidateByNode, state);
			if (candidate.kind === "awaited-expression") return t.isAwaitExpression(candidate.node) ? resolvePromiseExpression(candidate.node.argument, promiseResolutionContext(candidate, candidateByNode, state)) : unresolvedPromise();
			return {
				promiseIds: [],
				status: "complete"
			};
		};
		aggregateSources = (candidate, candidateByNode, state) => {
			if (!t.isCallExpression(candidate.node) && !t.isOptionalCallExpression(candidate.node)) return unresolvedPromise();
			const input = candidate.node.arguments[0];
			if (!t.isArrayExpression(input)) return unresolvedPromise();
			const resolutions = input.elements.map((element) => {
				if (element === null) return completePromise();
				if (t.isSpreadElement(element)) return unresolvedPromise();
				if (isObviouslyNonPromise(element)) return completePromise();
				return resolvePromiseExpression(element, promiseResolutionContext(candidate, candidateByNode, state));
			});
			return combinePromiseResolutions(resolutions);
		};
		resolvePromiseExpression = (rawNode, context) => {
			const { current, candidateByNode, state, seenBindings } = context;
			const node = unwrapJavaScriptExpression(rawNode).node;
			const direct = candidateByNode.get(node);
			if (direct !== undefined && direct.promiseId !== current.promiseId) return {
				promiseIds: [direct.promiseId],
				status: "complete"
			};
			if (!t.isIdentifier(node)) return unresolvedPromise();
			const binding = resolveSemanticBindingState(state, node, node.name);
			if (binding === undefined || binding.mutable || binding.initializers.length !== 1 || seenBindings.has(binding.bindingId)) return unresolvedPromise();
			const initializer = binding.initializers[0];
			if (initializer === undefined || initializer.projection.length > 0) return unresolvedPromise();
			const nestedSeen = new Set(seenBindings);
			nestedSeen.add(binding.bindingId);
			return resolvePromiseExpression(initializer.node, {
				...context,
				seenBindings: nestedSeen
			});
		};
		promiseResolutionContext = (current, candidateByNode, state) => ({
			current,
			candidateByNode,
			state,
			seenBindings: new Set()
		});
		combinePromiseResolutions = (resolutions) => ({
			promiseIds: resolutions.flatMap(({ promiseIds }) => promiseIds),
			status: resolutions.some(({ status }) => status === "unresolved") ? resolutions.some(({ status }) => status === "complete") ? "partial" : "unresolved" : resolutions.some(({ status }) => status === "partial") ? "partial" : "complete"
		});
		completePromise = () => ({
			promiseIds: [],
			status: "complete"
		});
		unresolvedPromise = () => ({
			promiseIds: [],
			status: "unresolved"
		});
		isObviouslyNonPromise = (node) => t.isLiteral(node) || t.isObjectExpression(node) || t.isFunction(node) || t.isClassExpression(node);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticObjects.js
var collectJavaScriptSemanticObjects, collectMember, collectDestructuring, addObjectOperation, expressionObjectIdentity, bindingIdentifier;
function init_javascriptSemanticObjects() {
	return (init_javascriptSemanticObjects = __esmMin((() => {
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		collectJavaScriptSemanticObjects = (program, state, callables) => {
			const output = [];
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(callableIds);
			const context = {
				state,
				output,
				writeTargets: new Map()
			};
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					const ownerCallableId = callableStack.callables.at(-1) ?? null;
					const writeTarget = semanticWriteSiteTarget(node);
					if (writeTarget !== null) {
						for (const leaf of semanticWriteTargets(writeTarget)) if (!t.isIdentifier(leaf)) context.writeTargets.set(leaf, node);
					}
					if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) collectMember(node, parent, ownerCallableId, context);
					else if (t.isSpreadElement(node) && parent !== null && t.isObjectExpression(parent)) {
						const identity = expressionObjectIdentity(node.argument, state);
						addObjectOperation({
							node,
							kind: "spread",
							ownerCallableId,
							objectBindingId: identity.bindingId,
							targetBindingId: null,
							propertyPath: identity.path
						}, state, output);
					} else if (t.isVariableDeclarator(node) && (t.isObjectPattern(node.id) || t.isArrayPattern(node.id))) collectDestructuring(node, ownerCallableId, state, output);
				},
				exit: (node) => callableStack.exit(node)
			});
			return output;
		};
		collectMember = (node, parent, ownerCallableId, context) => {
			const { state, output } = context;
			if ((t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) && parent.object === node) return;
			const identity = expressionObjectIdentity(node, state);
			const writeSite = context.writeTargets.get(node);
			context.writeTargets.delete(node);
			const write = writeSite !== undefined;
			const readsBeforeWrite = writeSite !== undefined && semanticWriteSiteReadsFirst(writeSite);
			if (readsBeforeWrite) addObjectOperation({
				node,
				kind: "read",
				ownerCallableId,
				objectBindingId: identity.bindingId,
				targetBindingId: null,
				propertyPath: identity.path
			}, state, output);
			addObjectOperation({
				node,
				kind: write ? "write" : "read",
				ownerCallableId,
				objectBindingId: identity.bindingId,
				targetBindingId: null,
				propertyPath: identity.path
			}, state, output);
		};
		collectDestructuring = (node, ownerCallableId, state, output) => {
			const source = expressionObjectIdentity(node.init, state);
			const visit = (pattern, path) => {
				if (t.isObjectPattern(pattern)) {
					for (const property of pattern.properties) {
						if (!t.isObjectProperty(property)) continue;
						const name = semanticStaticPropertyKey(property.key, property.computed);
						if (name !== null) visit(property.value, [...path, name]);
					}
					return;
				}
				if (t.isArrayPattern(pattern)) {
					pattern.elements.forEach((element, index) => {
						if (element !== null && !t.isRestElement(element)) visit(element, [...path, String(index)]);
					});
					return;
				}
				const target = bindingIdentifier(pattern);
				if (target === null) return;
				addObjectOperation({
					node: pattern,
					kind: "destructure",
					ownerCallableId,
					objectBindingId: source.bindingId,
					targetBindingId: resolveSemanticBindingState(state, target, target.name)?.bindingId ?? null,
					propertyPath: source.path === null ? null : [...source.path, ...path]
				}, state, output);
			};
			visit(node.id, []);
		};
		addObjectOperation = (input, state, output) => {
			output.push({
				objectOperationId: [
					"object",
					input.kind,
					String(input.node.start ?? -1),
					String(input.node.end ?? -1)
				].join(":"),
				kind: input.kind,
				location: range(input.node),
				ownerCallableId: input.ownerCallableId,
				objectBindingId: input.objectBindingId,
				targetBindingId: input.targetBindingId,
				propertyPath: input.propertyPath,
				resolution: input.objectBindingId === null || input.propertyPath === null || input.kind === "destructure" && input.targetBindingId === null ? "partial" : "complete"
			});
		};
		expressionObjectIdentity = (node, state) => {
			const path = [];
			let current = node;
			let staticPath = true;
			while (current !== null && current !== undefined) {
				current = unwrapJavaScriptExpression(current).node;
				if (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					const name = semanticStaticPropertyKey(current.property, current.computed);
					if (name === null) staticPath = false;
					else path.push(name);
					current = current.object;
				} else break;
			}
			return {
				bindingId: t.isIdentifier(current) ? resolveSemanticBindingState(state, current, current.name)?.bindingId ?? null : null,
				path: staticPath ? path.reverse() : null
			};
		};
		bindingIdentifier = (node) => {
			if (t.isIdentifier(node)) return node;
			if (t.isAssignmentPattern(node) && t.isIdentifier(node.left)) return node.left;
			return null;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticResources.js
var RELEASE_METHODS, collectJavaScriptSemanticResources, collectAcquisitions, collectReleases, immutableAcquisition, acquisitionMethod, resourceCandidateId;
function init_javascriptSemanticResources() {
	return (init_javascriptSemanticResources = __esmMin((() => {
		init_javascriptBuiltinResourceMethods();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticDataEffectHelpers();
		init_javascriptStaticAnalysisHelpers();
		RELEASE_METHODS = [
			"close",
			"destroy",
			"end"
		];
		collectJavaScriptSemanticResources = (program, state, callables) => {
			const context = {
				state,
				callableIds: new Set(callables.map(({ callableId }) => callableId)),
				callableStack: [],
				ancestors: []
			};
			const acquisitions = collectAcquisitions(program, context);
			return [...acquisitions.map(immutableAcquisition), ...collectReleases(program, context, acquisitions)];
		};
		collectAcquisitions = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const method = acquisitionMethod(node.callee, context.state);
				if (method === null) return;
				output.push({
					node,
					method,
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context)
				});
			});
			return output;
		};
		collectReleases = (program, context, acquisitions) => {
			const byBinding = new Map();
			for (const acquisition of acquisitions) {
				if (acquisition.resultBindingId === null) continue;
				const existing = byBinding.get(acquisition.resultBindingId) ?? [];
				existing.push(acquisition);
				byBinding.set(acquisition.resultBindingId, existing);
			}
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const member = dataEffectMemberCallee(node);
				if (member === null || !t.isIdentifier(member.object)) return;
				const method = RELEASE_METHODS.find((candidate) => candidate === semanticStaticPropertyName(member.property, member.computed));
				if (method === undefined) return;
				const binding = resolveSemanticBindingState(context.state, member.object, member.object.name);
				const linked = binding === undefined ? [] : byBinding.get(binding.bindingId) ?? [];
				if (linked.length === 0) return;
				output.push({
					resourceId: `resource:release:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: "release",
					method,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: binding?.bindingId ?? null,
					linkedResourceIds: linked.map(resourceCandidateId).sort(),
					resolution: linked.length === 1 ? "complete" : "partial"
				});
			});
			return output;
		};
		immutableAcquisition = (candidate) => ({
			resourceId: resourceCandidateId(candidate),
			kind: "acquire",
			method: candidate.method,
			location: range(candidate.node),
			ownerCallableId: candidate.ownerCallableId,
			resultBindingId: candidate.resultBindingId,
			linkedResourceIds: [],
			resolution: "complete"
		});
		acquisitionMethod = (callee, state) => {
			for (const specifier of BUILTIN_RESOURCE_SPECIFIERS) {
				const method = builtinDataEffectMethod(callee, state, [specifier]);
				if (method !== null && BUILTIN_RESOURCE_METHODS[specifier].includes(method)) return method;
			}
			return null;
		};
		resourceCandidateId = (candidate) => `resource:acquire:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDerivedAnalysis.js
/** Compose bounded semantic passes after lexical definitions are available. */
/**
* Collect derived semantics with a yield between collectors. Each collector
* completes before the next starts, so results equal the synchronous form.
*/
function* collectJavaScriptDerivedSemanticsSteps(program, state, callables, parserPartial) {
	const calls = collectJavaScriptSemanticCalls(program, state, callables);
	yield;
	const promiseOperations = collectJavaScriptSemanticPromises(program, state, callables);
	yield;
	const asyncEffects = collectJavaScriptSemanticAsyncEffects(program, state, callables);
	yield;
	const childProcesses = collectJavaScriptSemanticChildProcesses(program, state, callables);
	yield;
	const dataEffects = collectJavaScriptSemanticDataEffects(program, state, callables);
	yield;
	const resourceOperations = collectJavaScriptSemanticResources(program, state, callables);
	yield;
	const objectOperations = collectJavaScriptSemanticObjects(program, state, callables);
	yield;
	const functionFingerprints = yield* collectJavaScriptSemanticFingerprintsSteps({
		state,
		callables,
		calls,
		promises: promiseOperations,
		events: asyncEffects.eventOperations,
		timers: asyncEffects.timerOperations,
		childProcessSpawns: childProcesses.childProcessSpawns,
		childProcessInteractions: childProcesses.childProcessInteractions,
		requestOperations: dataEffects.requestOperations,
		resourceOperations,
		parserPartial
	});
	return {
		...calls,
		promiseOperations,
		...asyncEffects,
		...childProcesses,
		...dataEffects,
		resourceOperations,
		objectOperations,
		functionFingerprints
	};
}
function init_javascriptSemanticDerivedAnalysis() {
	return (init_javascriptSemanticDerivedAnalysis = __esmMin((() => {
		init_javascriptSemanticAsyncEffects();
		init_javascriptSemanticCalls();
		init_javascriptSemanticChildProcesses();
		init_javascriptSemanticFingerprints();
		init_javascriptSemanticDataEffects();
		init_javascriptSemanticPromises();
		init_javascriptSemanticObjects();
		init_javascriptSemanticResources();
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSourceParser.js
var parserPluginsForPath, isExplicitModuleSourcePath, runtimeSourceTypeForPath, parseRecoveredJavaScript, parseJavaScriptSource;
function init_javascriptSourceParser() {
	return (init_javascriptSourceParser = __esmMin((() => {
		parserPluginsForPath = (sourcePath) => {
			const path = sourcePath ?? "";
			const dts = /\.d\.(?:ts|mts|cts)$/iu.test(path);
			const isTsLike = /\.(?:ts|cts|mts)$/iu.test(path);
			const isTsx = /\.tsx$/iu.test(path);
			const isMts = /\.mts$/iu.test(path);
			const typescript = ["typescript", {
				dts,
				...isMts ? { disallowAmbiguousJSXLike: true } : {}
			}];
			const jsxCapable = !dts && (isTsx || !isTsLike);
			return jsxCapable ? [
				"decorators-legacy",
				"jsx",
				typescript
			] : ["decorators-legacy", typescript];
		};
		isExplicitModuleSourcePath = (path) => /\.m[jt]s$/iu.test(path ?? "");
		runtimeSourceTypeForPath = (path) => /\.cjs$/iu.test(path ?? "") ? "commonjs" : isExplicitModuleSourcePath(path) ? "module" : "unambiguous";
		parseRecoveredJavaScript = (source, sourcePath, options) => {
			const sourceType = runtimeSourceTypeForPath(sourcePath);
			if (sourceType !== "unambiguous") {
				const normalizedOptions = { ...options };
				if (sourceType === "commonjs") {
					delete normalizedOptions.allowAwaitOutsideFunction;
					delete normalizedOptions.allowReturnOutsideFunction;
					delete normalizedOptions.allowNewTargetOutsideFunction;
				}
				return {
					file: parse(source, {
						...normalizedOptions,
						sourceType,
						errorRecovery: true
					}),
					moduleOnlyErrors: []
				};
			}
			const file = parse(source, {
				...options,
				sourceType: "unambiguous",
				errorRecovery: true
			});
			if (file.program.sourceType !== "script" || file.errors.length === 0) return {
				file,
				moduleOnlyErrors: []
			};
			const script = parse(source, {
				...options,
				sourceType: "script",
				errorRecovery: true
			});
			const scriptErrors = new Set(script.errors.map((error) => error.message));
			return {
				file: script,
				moduleOnlyErrors: file.errors.map((error) => error.message).filter((message) => !scriptErrors.has(message))
			};
		};
		parseJavaScriptSource = (source, sourcePath) => {
			try {
				const runtimeSourceType = runtimeSourceTypeForPath(sourcePath);
				const commonjs = runtimeSourceType === "commonjs";
				const options = {
					errorRecovery: true,
					attachComment: false,
					plugins: parserPluginsForPath(sourcePath)
				};
				const file = parse(source, {
					...options,
					sourceType: commonjs ? "unambiguous" : runtimeSourceType,
					allowReturnOutsideFunction: commonjs,
					allowNewTargetOutsideFunction: commonjs
				});
				return commonjs && file.program.sourceType === "script" && file.errors.length > 0 ? parse(source, {
					...options,
					sourceType: "commonjs"
				}) : file;
			} catch (cause) {
				void cause;
				return null;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRpcEndpoints.js
var TRPC_HOOK_METHODS, TRPC_REQUEST_METHODS, TRPC_SUBSCRIPTION_CALLBACKS, TRPC_CLIENT_FACTORIES, TRPC_URL_LINKS, TRPC_SOURCE_MARKERS, BROWSER_GLOBAL_NAMES, PROCEDURE_SEGMENT, memberPath, objectKeys, objectProperty, objectStringProperty, graphqlSourceBodyLiterals, GRAPHQL_OPERATION_TYPES, isGraphqlIgnoredCharacter, skipGraphqlIgnored, graphqlNameAt, graphqlOperationFromText, graphqlOperationFromDocumentNode, rpcFactoryName, isJavaScriptRpcClientFactory, trpcLinkUrl, createJavaScriptRpcScan;
function init_javascriptRpcEndpoints() {
	return (init_javascriptRpcEndpoints = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptStaticAnalysisHelpers();
		TRPC_HOOK_METHODS = new Set([
			"useQuery",
			"useSuspenseQuery",
			"useInfiniteQuery",
			"useSuspenseInfiniteQuery",
			"usePrefetchQuery",
			"usePrefetchInfiniteQuery",
			"useMutation",
			"useSubscription",
			"queryOptions",
			"infiniteQueryOptions",
			"mutationOptions",
			"subscriptionOptions"
		]);
		TRPC_REQUEST_METHODS = new Set(["query", "mutate"]);
		TRPC_SUBSCRIPTION_CALLBACKS = new Set([
			"onStarted",
			"onData",
			"onError",
			"onStopped",
			"onComplete",
			"onConnectionStateChange"
		]);
		TRPC_CLIENT_FACTORIES = new Set(["createTRPCClient", "createTRPCProxyClient"]);
		TRPC_URL_LINKS = new Set([
			"httpLink",
			"httpBatchLink",
			"httpBatchStreamLink",
			"httpSubscriptionLink"
		]);
		TRPC_SOURCE_MARKERS = [
			"TRPCClientError",
			"trpc-accept",
			"/trpc"
		];
		BROWSER_GLOBAL_NAMES = new Set([
			"window",
			"self",
			"globalThis",
			"document",
			"navigator",
			"location",
			"history",
			"console",
			"performance",
			"screen",
			"top",
			"parent",
			"frames"
		]);
		PROCEDURE_SEGMENT = /^[A-Za-z_$][\w$]*$/u;
		memberPath = (callee) => {
			const reversed = [];
			let current = callee;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				const property = semanticStaticPropertyKey(current.property, current.computed);
				if (property === null || !PROCEDURE_SEGMENT.test(property)) return undefined;
				reversed.push(property);
				current = current.object;
			}
			return {
				root: current,
				properties: reversed.reverse()
			};
		};
		objectKeys = (node) => t.isObjectExpression(node) ? node.properties.flatMap((property) => {
			if (!t.isObjectProperty(property) && !t.isObjectMethod(property)) return [];
			const key = semanticStaticPropertyKey(property.key, property.computed);
			return key === null ? [] : [key];
		}) : [];
		objectProperty = (node, key) => {
			for (let index = node.properties.length - 1; index >= 0; index -= 1) {
				const property = node.properties[index];
				if (property === undefined || t.isSpreadElement(property)) return undefined;
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) return undefined;
				if (name === key) return t.isObjectProperty(property) ? property.value : undefined;
			}
			return undefined;
		};
		objectStringProperty = (node, key) => {
			const value = objectProperty(node, key);
			return t.isStringLiteral(value) ? value.value : undefined;
		};
		graphqlSourceBodyLiterals = (node) => {
			const bodyStrings = (object) => object.properties.flatMap((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "body" && t.isStringLiteral(property.value) ? [property.value] : []);
			const bodies = bodyStrings(node);
			const hasLocationOffset = node.properties.some((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "locationOffset");
			if (!hasLocationOffset) return undefined;
			const visited = new WeakSet();
			visited.add(node);
			const pending = node.properties.flatMap((property) => {
				if (!t.isSpreadElement(property)) return [];
				const spread = unwrapJavaScriptExpression(property.argument).node;
				return t.isObjectExpression(spread) ? [spread] : [];
			});
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined || visited.has(current)) continue;
				visited.add(current);
				bodies.push(...bodyStrings(current));
				for (const property of current.properties) {
					if (t.isSpreadElement(property)) {
						const spread = unwrapJavaScriptExpression(property.argument).node;
						if (t.isObjectExpression(spread)) pending.push(spread);
					}
				}
			}
			return bodies.length === 0 ? undefined : bodies;
		};
		GRAPHQL_OPERATION_TYPES = new Set([
			"query",
			"mutation",
			"subscription"
		]);
		isGraphqlIgnoredCharacter = (character) => character === "," || character === "﻿" || character === "	" || character === " " || character === "\n" || character === "\r";
		skipGraphqlIgnored = (text, start) => {
			const limit = text.length;
			let index = start;
			while (index < limit) {
				const character = text.charAt(index);
				if (isGraphqlIgnoredCharacter(character)) index += 1;
				else if (character === "#") {
					while (index < limit && !/[\n\r]/u.test(text.charAt(index))) index += 1;
				} else break;
			}
			return index;
		};
		graphqlNameAt = (text, index) => {
			const name = /^[_A-Za-z][_0-9A-Za-z]*/u.exec(text.slice(index))?.[0];
			return name === undefined ? undefined : {
				value: name,
				end: index + name.length
			};
		};
		graphqlOperationFromText = (text) => {
			const type = graphqlNameAt(text, skipGraphqlIgnored(text, 0));
			if (type === undefined || !GRAPHQL_OPERATION_TYPES.has(type.value)) return undefined;
			const name = graphqlNameAt(text, skipGraphqlIgnored(text, type.end));
			if (name === undefined) return undefined;
			const index = skipGraphqlIgnored(text, name.end);
			const next = text.charAt(index);
			const hasHeader = next === "(" ? text.charAt(skipGraphqlIgnored(text, index + 1)) === "$" : (next === "@" || next === "{") && graphqlNameAt(text, skipGraphqlIgnored(text, index + 1)) !== undefined;
			return hasHeader ? {
				value: name.value,
				mechanism: `graphql:${type.value}`
			} : undefined;
		};
		graphqlOperationFromDocumentNode = (node) => {
			if (objectStringProperty(node, "kind") !== "OperationDefinition") return undefined;
			const type = objectStringProperty(node, "operation");
			if (type === undefined || !GRAPHQL_OPERATION_TYPES.has(type)) return undefined;
			const name = objectProperty(node, "name");
			if (!t.isObjectExpression(name) || objectStringProperty(name, "kind") !== "Name") return undefined;
			const value = objectStringProperty(name, "value");
			return value === undefined ? undefined : {
				value,
				mechanism: `graphql:${type}`
			};
		};
		rpcFactoryName = (callee) => {
			let current = unwrapJavaScriptExpression(callee).node;
			while (t.isSequenceExpression(current)) {
				const last = current.expressions.at(-1);
				if (last === undefined) return "";
				current = unwrapJavaScriptExpression(last).node;
			}
			return calleeName(current);
		};
		isJavaScriptRpcClientFactory = (node) => {
			const call = unwrapJavaScriptExpression(node).node;
			return (t.isCallExpression(call) || t.isOptionalCallExpression(call)) && TRPC_CLIENT_FACTORIES.has(rpcFactoryName(call.callee).split(".").pop() ?? "");
		};
		trpcLinkUrl = (node) => {
			const name = rpcFactoryName(node.callee);
			const factory = name.slice(name.lastIndexOf(".") + 1);
			if (!TRPC_URL_LINKS.has(factory)) return undefined;
			const options = node.arguments[0];
			if (!t.isObjectExpression(options)) return undefined;
			const url = objectStringProperty(options, "url");
			return url === undefined ? undefined : {
				value: url,
				mechanism: `trpc:link:${factory}`
			};
		};
		createJavaScriptRpcScan = (source, clientRoots) => {
			let marker;
			const hasMarker = () => marker ??= TRPC_SOURCE_MARKERS.some((value) => source.includes(value));
			const graphqlDocumentSourceBodies = new WeakSet();
			const procedure = (node) => {
				const path = memberPath(node.callee);
				if (path === undefined || t.isThisExpression(path.root)) return undefined;
				if (t.isIdentifier(path.root) && BROWSER_GLOBAL_NAMES.has(path.root.name)) return undefined;
				const method = path.properties[path.properties.length - 1];
				const segments = path.properties.slice(0, -1);
				const first = segments[0];
				if (method === undefined || first === undefined) return undefined;
				if (BROWSER_GLOBAL_NAMES.has(first) || segments.includes("endpoints")) return undefined;
				const bound = clientRoots.has(path.root);
				const recognized = TRPC_HOOK_METHODS.has(method) ? true : TRPC_REQUEST_METHODS.has(method) ? bound || segments.length >= 2 && hasMarker() : method === "subscribe" && (bound || hasMarker()) && objectKeys(node.arguments[1]).some((key) => TRPC_SUBSCRIPTION_CALLBACKS.has(key));
				return recognized ? {
					value: segments.join("."),
					mechanism: `trpc:procedure:${method}`
				} : undefined;
			};
			return { inspect: (node) => {
				if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) return trpcLinkUrl(node) ?? procedure(node);
				if (t.isObjectExpression(node)) {
					const bodies = graphqlSourceBodyLiterals(node);
					if (bodies !== undefined) {
						for (const body of bodies) graphqlDocumentSourceBodies.add(body);
						return undefined;
					}
					return graphqlOperationFromDocumentNode(node);
				}
				if (t.isStringLiteral(node)) return graphqlDocumentSourceBodies.has(node) ? undefined : graphqlOperationFromText(node.value);
				if (t.isTemplateLiteral(node)) {
					for (const quasi of node.quasis) {
						const cooked = quasi.value.cooked;
						if (cooked === undefined || cooked === null) return undefined;
						if (skipGraphqlIgnored(cooked, 0) === cooked.length) continue;
						return graphqlOperationFromText(cooked);
					}
					return undefined;
				}
				return undefined;
			} };
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAnalysis.js
/** Share the lexical index with bounded, demand-driven boundary analyses. */
function* indexJavaScriptBindingsSteps(program) {
	const state = createState(program);
	yield* collectDefinitionsSteps(program, state);
	yield* indexJavaScriptAmbientWritesSteps(program, state);
	return state;
}
/**
* Recover semantics from a parsed artifact with a yield between analysis
* phases, so a caller can serve control messages within one large file.
* Each phase completes before the next starts; results equal the synchronous
* form.
*/
function* analyzeParsedJavaScriptSemanticsSteps(file, staticImportResolutionMode = "import") {
	const state = createState(file.program, staticImportResolutionMode);
	yield* collectDefinitionsSteps(file.program, state);
	yield* indexJavaScriptAmbientWritesSteps(file.program, state);
	yield* collectSemanticMemberMutationsSteps(file.program, state);
	yield* traverseJavaScriptAstSteps(file.program, { enter: (node) => collectSemanticModuleLink(node, state) });
	yield;
	const references = yield* collectSemanticReferencesSteps(file.program, state);
	const parserPartial = file.errors.length > 0;
	const bindings = immutableSemanticBindings(state);
	yield;
	const callables = collectSemanticReturns(state, parserPartial);
	yield;
	const moduleLinks = resolveSemanticModuleCallables(state, callables, bindings);
	const derived = yield* collectJavaScriptDerivedSemanticsSteps(file.program, state, callables, parserPartial);
	return {
		schema: "JavaScriptSemanticIR",
		scopes: immutableSemanticScopes(state),
		bindings,
		callables,
		references,
		moduleLinks,
		...derived,
		coverage: semanticCoverage(parserPartial, semanticResourceLimitsIn([...bindings.map(({ value }) => value), ...callables.flatMap((callable) => callable.returnSites.map(({ value }) => value))])),
		limitations: [
			...parserPartial ? ["The parser recovered from syntax errors; affected bindings are partial."] : [],
			...hasUncertainTypeOnlyModuleSideEffect(file.program) ? ["Compiler options are unavailable; inline type-only imports or re-exports may preserve a module side-effect dependency."] : [],
			"Values and aliases were recovered from inert syntax only; no JavaScript was executed.",
			"Return sites include only direct callable returns; nested callable returns remain separate.",
			"Local call, argument, return, and closure relations are static candidates and do not prove runtime invocation.",
			"Promise ownership covers explicit unshadowed Promise construction, static factories, aggregation, chaining, and await syntax only.",
			"Cross-function mutation and dynamic property resolution remain unknown."
		]
	};
}
/** Resolve tRPC client roots by lexical identity, excluding overwritten bindings. */
function* classifyParsedJavaScriptRpcClientRootsSteps(file) {
	const state = createState(file.program);
	yield* collectDefinitionsSteps(file.program, state);
	const roots = new Set();
	const clients = new Map();
	yield* traverseJavaScriptAstSteps(file.program, { enter: (node) => {
		if (!t.isMemberExpression(node) && !t.isOptionalMemberExpression(node)) return;
		const root = node.object;
		if (!t.isIdentifier(root)) return;
		const binding = resolveSemanticBindingState(state, root, root.name);
		if (binding === undefined) return;
		let client = clients.get(binding.bindingId);
		if (client === undefined) {
			const initializer = semanticStableInitializer(binding, state);
			client = initializer !== undefined && initializer.projection.length === 0 && isJavaScriptRpcClientFactory(initializer.node);
			clients.set(binding.bindingId, client);
		}
		if (client) roots.add(root);
	} });
	return roots;
}
/** Classify `.open` receivers while yielding during lexical and AST scans. */
function* classifyParsedJavaScriptOpenReceiversSteps(file) {
	const state = createState(file.program);
	yield* collectDefinitionsSteps(file.program, state);
	const facts = new Map();
	const extensionStateReads = [];
	yield* traverseJavaScriptAstSteps(file.program, { enter: (node) => {
		if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) || !t.isMemberExpression(node.callee) && !t.isOptionalMemberExpression(node.callee)) return;
		const method = semanticStaticPropertyKey(node.callee.property, node.callee.computed);
		if (method === "get") {
			if (isConfigurationReceiver(state, node.callee.object)) facts.set(node.start ?? -1, "configuration");
			else if (isExtensionStateMember(node.callee.object)) extensionStateReads.push(node.start ?? -1);
			return;
		}
		if (method !== "open" || !t.isIdentifier(node.callee.object)) return;
		const receiver = node.callee.object.name;
		const binding = resolveSemanticBindingState(state, node, receiver);
		if (binding === undefined) {
			if (semanticResolutionBlocked(state, node, receiver)) return;
			const fact = openGlobalFact(receiver);
			if (fact !== undefined) facts.set(node.start ?? -1, fact);
			return;
		}
		facts.set(node.start ?? -1, "local");
		if (receiver === "indexedDB" || receiver === "caches") {
			facts.set(node.start ?? -1, receiver === "indexedDB" ? "local-indexed-db" : "local-cache-storage");
			return;
		}
		if (binding.mutable || binding.initializers.length !== 1) return;
		const initializer = binding.initializers[0]?.node;
		if (!t.isIdentifier(initializer)) return;
		const initializerBinding = resolveSemanticBindingState(state, initializer, initializer.name);
		if (initializerBinding !== undefined) {
			if (initializer.name === "indexedDB" || initializer.name === "caches") {
				const localFact = initializer.name === "indexedDB" ? "local-indexed-db" : "local-cache-storage";
				facts.set(node.start ?? -1, localFact);
				if (initializerBinding.mutable || initializerBinding.initializers.length !== 1) return;
				const nested = initializerBinding.initializers[0]?.node;
				if (t.isIdentifier(nested)) {
					const nestedFact = resolveGlobalAliasFact(state, initializer, nested.name);
					if (nestedFact !== undefined) facts.set(node.start ?? -1, nestedFact);
				}
			} else if (initializer.name === "window") {
				facts.set(node.start ?? -1, "local");
			}
			return;
		}
		const aliasFact = resolveGlobalAliasFact(state, initializer, initializer.name);
		if (aliasFact !== undefined) facts.set(node.start ?? -1, aliasFact);
	} });
	if (extensionStateReads.length > 0 && importsVsCodeModule(state)) for (const start of extensionStateReads) facts.set(start, "extension-state");
	return facts;
}
/** Resolve Electron aliases while yielding during lexical and AST scans. */
function* classifyParsedJavaScriptElectronBindingsSteps(file) {
	const state = createState(file.program);
	yield* collectDefinitionsSteps(file.program, state);
	return (yield* indexJavaScriptElectronIdentitySteps(file.program, state)).bindings;
}
function* indexJavaScriptElectronIdentitySteps(program, state) {
	const facts = new Map();
	const interop = createSemanticModuleInterop(state);
	const writes = new SemanticPropertyPathCoverage();
	let collectedWrites = false;
	const exportsByBinding = new Map();
	const rootExport = (root) => {
		if (t.isIdentifier(root)) {
			if (semanticResolutionBlocked(state, root, root.name)) return undefined;
			const binding = resolveSemanticBindingState(state, root, root.name);
			if (binding === undefined) return undefined;
			let exported = exportsByBinding.get(binding.bindingId);
			if (exported === undefined) {
				exported = electronExport(binding, state, interop);
				exportsByBinding.set(binding.bindingId, exported);
			}
			return collectedWrites && interop.invalidated(binding) ? undefined : exported ?? undefined;
		}
		const wrapped = interop.callOrigin(root);
		const origin = wrapped === undefined ? electronRequireOrigin(root, state)?.origin : collectedWrites && interop.invalidatedCall(root) ? undefined : wrapped.origin;
		return origin !== undefined && ELECTRON_MODULE.test(origin.specifier) ? electronExportPath(origin.importedPath) : undefined;
	};
	yield* collectJavaScriptIdentityWritesSteps(program, (node, kind) => {
		if (kind === "opaque-call") return [interop.opaqueMutationPath(node)];
		const { root, members } = electronMemberPath(node);
		const exported = kind === "binding" ? undefined : rootExport(root);
		const path = exported === undefined ? interop.intrinsicPath(root) ?? (kind === "member" ? interop.boundIntrinsic(root)?.path : undefined) : ["electron", ...exported];
		return path === undefined ? [] : [[...path, ...members]];
	}, interop.intrinsicInvocation, interop.staticString, interop.isFreshObject, (node, path) => {
		if (path[0] === "electron") writes.retain(path);
		else interop.retainWrite(node, path);
	});
	collectedWrites = true;
	const intactExport = (path) => ELECTRON_MODULE.test(path[0] ?? "") && !writes.covers(["electron", ...path.slice(1)]);
	yield* traverseJavaScriptAstSteps(program, { enter: (node) => {
		if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node)) return;
		const { root, members } = electronMemberPath(node.callee);
		const exported = rootExport(root);
		if (exported !== undefined && intactExport([
			"electron",
			...exported,
			...members
		])) facts.set(root.start ?? -1, exported);
	} });
	return {
		bindings: facts,
		intactExport,
		exportPath: rootExport
	};
}
function* collectDefinitionsSteps(program, state) {
	const stack = [currentSemanticScope(state.scopes)];
	const openedScopes = new WeakMap();
	const assignments = [];
	const functionBodies = [];
	yield* traverseJavaScriptAstSteps(program, {
		enter: (node, parent, readAncestors) => {
			if (parent !== null) state.parentsByNode.set(node, parent);
			let parentScope = currentSemanticScope(stack);
			if (parent !== null && (t.isObjectMethod(parent) || t.isClassMethod(parent)) && parent.computed && parent.key === node && parentScope.parentScopeId !== null) {
				const keyScope = state.scopesById.get(parentScope.parentScopeId);
				if (keyScope !== undefined) {
					stack.push(keyScope);
					openedScopes.set(node, 1);
					parentScope = keyScope;
				}
			}
			if (parent !== null && t.isWithStatement(parent) && parent.body === node) {
				const dynamicScope = {
					scopeId: `${semanticScopeId("block", parent)}:with`,
					parentScopeId: parentScope.scopeId,
					kind: "block",
					location: range(parent),
					bindingsComplete: false,
					bindings: new Map()
				};
				state.scopes.push(dynamicScope);
				state.scopesById.set(dynamicScope.scopeId, dynamicScope);
				stack.push(dynamicScope);
				openedScopes.set(node, 1);
				parentScope = dynamicScope;
			}
			bindOuterDeclaration(node, parentScope, state);
			const nested = nestedScope(node, parent, parentScope, state);
			if (nested !== undefined) {
				stack.push(nested);
				openedScopes.set(node, (openedScopes.get(node) ?? 0) + 1);
				if (t.isBlockStatement(node) && t.isFunction(parent)) functionBodies.push({
					body: node,
					scope: nested,
					parameters: runtimeFunctionParameters(parent)
				});
			}
			const scope = currentSemanticScope(stack);
			if (parent === null || openedScopes.has(node)) state.scopeByNode.set(node, scope);
			collectSemanticCallable({
				node,
				parent,
				containerScope: parentScope,
				bodyScope: nested,
				state
			});
			bindInnerDeclaration(node, parent, scope, state);
			if (t.isVariableDeclarator(node) && node.init != null && parent !== null && t.isVariableDeclaration(parent, { kind: "var" }) && writeMayBeSkipped(node, readAncestors())) state.conditionallySkippedExpressions.add(node.init);
			if (t.isAssignmentExpression(node) || t.isUpdateExpression(node) || t.isForOfStatement(node) || t.isForInStatement(node)) assignments.push({
				node,
				scope,
				conditionallySkipped: t.isForOfStatement(node) || t.isForInStatement(node) || writeMayBeSkipped(node, readAncestors())
			});
		},
		exit: (node) => {
			for (let count = openedScopes.get(node) ?? 0; count > 0; count--) stack.pop();
		}
	});
	for (const [index, { node, scope, conditionallySkipped }] of assignments.entries()) {
		if (index % 64 === 0) yield;
		bindAssignment(node, scope, state, conditionallySkipped);
	}
	for (const [index, { body, scope, parameters }] of functionBodies.entries()) {
		if (index % 64 === 0) yield;
		for (const parameter of parameters) for (const identifier of semanticWriteTargets(t.isTSParameterProperty(parameter) ? parameter.parameter : parameter)) if (t.isIdentifier(identifier)) copyParameterToBody({
			identifier,
			body,
			scope,
			state
		});
	}
}
var analyzeJavaScriptSemantics, analyzeParsedJavaScriptReferences, analyzeParsedJavaScriptSemantics, classifyParsedJavaScriptOpenReceivers, isExtensionStateMember, importsVsCodeModule, isConfigurationAccessorCall, isConfigurationReceiver, openGlobalFact, resolveGlobalAliasFact, classifyParsedJavaScriptElectronBindings, electronExport, electronRequireOrigin, bindingOrigin, createState, copyParameterToBody, writeMayBeSkipped, isSkippedBranch, optionalCallArgumentsMayBeSkipped, bindOuterDeclaration, bindInnerDeclaration, bindImportEquals, hasIncomingValue, bindAssignment, nestedScope, functionNameScope, scopeKind, functionParametersHaveExpressions, bindImports, bindFunctionLocals, bindPattern, addBinding, createBinding, addAssignment;
function init_javascriptSemanticAnalysis() {
	return (init_javascriptSemanticAnalysis = __esmMin((() => {
		init_javascriptSemanticIr();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticRequireOrigin();
		init_javascriptBundledRequireOrigin();
		init_javascriptSemanticMemberMutations();
		init_javascriptSemanticAmbientWrites();
		init_javascriptModuleDeclaration();
		init_javascriptSemanticReturns();
		init_javascriptSemanticDerivedAnalysis();
		init_javascriptSemanticValues();
		init_javascriptElectronMemberWrites();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticCoverage();
		init_javascriptSemanticResourceLimits();
		init_javascriptSourceParser();
		init_javascriptRpcEndpoints();
		init_javascriptModuleInterop();
		init_javascriptSemanticPropertyPaths();
		analyzeJavaScriptSemantics = (source) => {
			const file = parseJavaScriptSource(source);
			return file === null ? failedJavaScriptSemanticIr() : analyzeParsedJavaScriptSemantics(file);
		};
		analyzeParsedJavaScriptReferences = (file, name) => {
			const state = createState(file.program);
			completeSemanticSteps(collectDefinitionsSteps(file.program, state));
			return collectSemanticReferences(file.program, state, name);
		};
		analyzeParsedJavaScriptSemantics = (file, staticImportResolutionMode = "import") => completeSemanticSteps(analyzeParsedJavaScriptSemanticsSteps(file, staticImportResolutionMode));
		classifyParsedJavaScriptOpenReceivers = (file) => completeSemanticSteps(classifyParsedJavaScriptOpenReceiversSteps(file));
		isExtensionStateMember = (receiver) => (t.isMemberExpression(receiver) || t.isOptionalMemberExpression(receiver)) && (() => {
			const key = semanticStaticPropertyKey(receiver.property, receiver.computed);
			return key === "globalState" || key === "workspaceState";
		})();
		importsVsCodeModule = (state) => [...state.bindingsById.values()].some((binding) => binding.directOrigins.some(({ specifier }) => specifier === "vscode") || semanticRequireOrigin(semanticStableInitializer(binding, state)?.node, state)?.origin.specifier === "vscode");
		isConfigurationAccessorCall = (state, node) => {
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return false;
			const callee = node.callee;
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee) || semanticStaticPropertyKey(callee.property, callee.computed) !== "getConfiguration") return false;
			const host = callee.object;
			const matchesSpelling = t.isIdentifier(host) ? host.name === "workspace" : (t.isMemberExpression(host) || t.isOptionalMemberExpression(host)) && semanticStaticPropertyKey(host.property, host.computed) === "workspace";
			if (!matchesSpelling) return false;
			const root = t.isIdentifier(host) ? host : t.isMemberExpression(host) || t.isOptionalMemberExpression(host) ? host.object : undefined;
			if (!t.isIdentifier(root)) return false;
			const binding = resolveSemanticBindingState(state, root, root.name);
			if (binding === undefined) return !semanticResolutionBlocked(state, root, root.name);
			const initializer = semanticStableInitializer(binding, state);
			const origins = [...binding.directOrigins, ...initializer === undefined ? [] : [semanticRequireOrigin(initializer.node, state)?.origin]];
			return origins.some((origin) => origin?.specifier === "vscode" && (t.isIdentifier(host) ? origin.importedPath.at(-1) === "workspace" || initializer?.projection.at(-1) === "workspace" : origin.importedPath.length === 0 || origin.importedPath.length === 1 && (origin.importedPath[0] === "*" || origin.importedPath[0] === "default")));
		};
		isConfigurationReceiver = (state, receiver) => {
			if (isConfigurationAccessorCall(state, receiver)) return true;
			if (!t.isIdentifier(receiver)) return false;
			const binding = resolveSemanticBindingState(state, receiver, receiver.name);
			const initializer = semanticStableInitializer(binding, state);
			return initializer !== undefined && initializer.projection.length === 0 && isConfigurationAccessorCall(state, initializer.node);
		};
		openGlobalFact = (name) => {
			if (name === "window" || name === "self" || name === "globalThis" || name === "top" || name === "parent" || name === "opener" || name === "frames" || name === "document") return "window";
			if (name === "indexedDB") return "indexed-db";
			if (name === "caches") return "cache-storage";
			return undefined;
		};
		resolveGlobalAliasFact = (state, node, name) => {
			if (resolveSemanticBindingState(state, node, name) !== undefined || semanticResolutionBlocked(state, node, name)) return undefined;
			return openGlobalFact(name);
		};
		classifyParsedJavaScriptElectronBindings = (file) => completeSemanticSteps(classifyParsedJavaScriptElectronBindingsSteps(file));
		electronExport = (binding, state, interop) => {
			const reassigned = binding.definitions.some(({ kind }) => kind === "assignment");
			const converted = interop.origin(binding);
			if (reassigned && converted === undefined) return null;
			const directOrigin = converted?.origin ?? bindingOrigin(binding, state);
			const initializer = semanticStableInitializer(binding, state);
			if (directOrigin === undefined && initializer === undefined) return null;
			const provenance = directOrigin === undefined ? evaluateSemanticProvenance(binding, state) : undefined;
			const origin = directOrigin ?? (provenance?.status === "module" && provenance.origins.length === 1 ? provenance.origins[0] : undefined);
			return origin !== undefined && ELECTRON_MODULE.test(origin.specifier) ? electronExportPath(origin.importedPath) : null;
		};
		electronRequireOrigin = (node, state) => semanticRequireOrigin(node, state) ?? semanticBundledRequireOrigin(node, state);
		bindingOrigin = (binding, state) => {
			if (binding.directOrigins.length > 0) return binding.directOrigins.length === 1 ? binding.directOrigins[0] : undefined;
			const initializer = semanticStableInitializer(binding, state);
			if (initializer === undefined) return undefined;
			const origin = electronRequireOrigin(initializer.node, state)?.origin;
			const projection = initializer.projection;
			return origin === undefined || !projection.every((key) => typeof key === "string") ? undefined : {
				...origin,
				importedPath: [...origin.importedPath, ...projection]
			};
		};
		createState = (program, staticImportResolutionMode = "import") => {
			const root = {
				scopeId: semanticScopeId("program", program),
				parentScopeId: null,
				kind: "program",
				location: range(program),
				bindingsComplete: true,
				bindings: new Map()
			};
			return {
				program,
				staticImportResolutionMode,
				parentsByNode: new WeakMap(),
				scopes: [root],
				scopesById: new Map([[root.scopeId, root]]),
				scopeByNode: new WeakMap([[program, root]]),
				bindingsById: new Map(),
				callables: [],
				callableNodesById: new Map(),
				moduleLinks: [],
				linkedRequireCalls: new WeakSet(),
				moduleLinkBindings: new WeakMap(),
				defaultExportExpressions: new WeakMap(),
				conditionallySkippedExpressions: new WeakSet(),
				requiredModuleEffects: new Map(),
				ambientBindingWrites: new Map(),
				ambientWrites: new SemanticPropertyPathCoverage(),
				ambientWriteEffects: []
			};
		};
		copyParameterToBody = (input) => {
			const { identifier, body, scope, state } = input;
			const binding = scope.bindings.get(identifier.name);
			if (binding === undefined || binding.kind !== "variable" || binding.definitions.some(({ kind }) => kind === "function")) return;
			binding.initializers.unshift({
				node: identifier,
				projection: [],
				entryBody: body
			});
			for (let index = binding.initializers.length - 1; index >= 0; index -= 1) {
				const initializer = binding.initializers[index];
				if (initializer !== undefined && initializer.entryBody === undefined && initializer.projection.length === 0 && t.isIdentifier(initializer.node) && resolveSemanticBindingState(state, initializer.node, initializer.node.name) === binding) binding.initializers.splice(index, 1);
			}
		};
		writeMayBeSkipped = (node, ancestors) => {
			let child = node;
			for (let index = ancestors.length - 1; index >= 0; index -= 1) {
				const parent = ancestors[index];
				if (parent === undefined || t.isFunction(parent) || t.isProgram(parent) || t.isStaticBlock(parent)) return false;
				if (isSkippedBranch(parent, child)) return true;
				child = parent;
			}
			return false;
		};
		isSkippedBranch = (parent, child) => {
			if (t.isIfStatement(parent)) return child === parent.consequent || child === parent.alternate;
			if (t.isSwitchCase(parent)) return true;
			if (t.isTryStatement(parent)) return child === parent.block || child === parent.handler;
			if (t.isForStatement(parent)) return child === parent.body || child === parent.update;
			if (t.isWhileStatement(parent)) return child === parent.body;
			if (t.isDoWhileStatement(parent)) return false;
			if (t.isForInStatement(parent) || t.isForOfStatement(parent)) return child === parent.left || child === parent.body;
			if (t.isLogicalExpression(parent)) return child === parent.right;
			if (t.isConditionalExpression(parent)) return child === parent.consequent || child === parent.alternate;
			if (t.isOptionalCallExpression(parent) || t.isCallExpression(parent)) return parent.arguments.includes(child) && optionalCallArgumentsMayBeSkipped(parent);
			if (t.isOptionalMemberExpression(parent)) return parent.optional && parent.computed && child === parent.property;
			return false;
		};
		optionalCallArgumentsMayBeSkipped = (call) => {
			if (t.isOptionalCallExpression(call) && call.optional) return true;
			let callee = call.callee;
			while (true) {
				if (callee.extra?.parenthesized === true) return false;
				if (t.isOptionalMemberExpression(callee)) {
					if (callee.optional) return true;
					callee = callee.object;
				} else if (t.isMemberExpression(callee)) callee = callee.object;
				else if (t.isOptionalCallExpression(callee)) {
					if (callee.optional) return true;
					callee = callee.callee;
				} else if (t.isCallExpression(callee)) callee = callee.callee;
				else return false;
			}
		};
		bindOuterDeclaration = (node, scope, state) => {
			if (t.isFunctionDeclaration(node) && t.isIdentifier(node.id)) addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "function",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
			else if (t.isClassDeclaration(node) && t.isIdentifier(node.id)) addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "class",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
		};
		bindInnerDeclaration = (node, parent, scope, state) => {
			if (t.isImportDeclaration(node)) bindImports(node, scope, state);
			else if (t.isTSImportEqualsDeclaration(node)) bindImportEquals(node, scope, state);
			else if (t.isVariableDeclarator(node)) bindPattern({
				pattern: node.id,
				initializer: node.init ?? null,
				scope: semanticVariableScope(scope, parent, state),
				state,
				mutable: parent !== null && t.isVariableDeclaration(parent) ? parent.kind !== "const" : true,
				...parent !== null && t.isVariableDeclaration(parent) ? { declarationKind: parent.kind } : {}
			});
			else if (t.isClassExpression(node) && t.isIdentifier(node.id)) addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "class",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
			else if (t.isFunction(node)) bindFunctionLocals(node, scope, state);
			else if (t.isCatchClause(node) && node.param != null) bindPattern({
				pattern: node.param,
				initializer: null,
				scope,
				state,
				mutable: true,
				kind: "catch"
			});
		};
		bindImportEquals = (node, scope, state) => {
			const specifier = semanticImportEqualsSpecifier(node);
			if (specifier === null) return;
			addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "import",
				mutable: false,
				definitionNode: node.id,
				initializer: null,
				directOrigin: {
					specifier,
					importedPath: [],
					resolutionMode: "require"
				}
			});
		};
		hasIncomingValue = (identifier, scope, state) => {
			const kind = resolveSemanticBindingFromScope(scope, identifier.name, state)?.kind;
			return kind === "parameter" || kind === "catch";
		};
		bindAssignment = (node, scope, state, conditionallySkipped) => {
			if (t.isAssignmentExpression(node)) {
				const left = unwrapJavaScriptExpression(node.left).node;
				if (t.isIdentifier(left)) addAssignment(left, node.operator === "=" || (node.operator === "||=" || node.operator === "??=") && !hasIncomingValue(left, scope, state) ? node.right : node, scope, state, conditionallySkipped);
				else for (const identifier of semanticWriteTargets(node.left)) if (t.isIdentifier(identifier)) addAssignment(identifier, node, scope, state, conditionallySkipped);
			} else if (t.isUpdateExpression(node)) {
				const argument = unwrapJavaScriptExpression(node.argument).node;
				if (t.isIdentifier(argument)) addAssignment(argument, node, scope, state, conditionallySkipped);
			} else if (t.isForOfStatement(node) || t.isForInStatement(node)) for (const pattern of t.isVariableDeclaration(node.left) ? node.left.declarations.map(({ id }) => id) : [node.left]) {
				for (const identifier of semanticWriteTargets(pattern)) if (t.isIdentifier(identifier)) addAssignment(identifier, node, scope, state, conditionallySkipped);
				if (t.isForOfStatement(node)) bindPattern({
					pattern,
					initializer: node,
					scope,
					state,
					mutable: true,
					referenceOnly: true
				});
			}
		};
		nestedScope = (node, parent, parentScope, state) => {
			const switchOwner = t.isSwitchCase(node) && parent !== null && t.isSwitchStatement(parent) ? parent : undefined;
			if (switchOwner !== undefined) {
				const existing = state.scopesById.get(semanticScopeId("block", switchOwner));
				if (existing !== undefined) return existing;
			}
			const kind = scopeKind(node, parent);
			if (kind === undefined) return undefined;
			const scope = {
				scopeId: semanticScopeId(kind, switchOwner ?? node),
				parentScopeId: functionNameScope(node, parentScope, state)?.scopeId ?? parentScope.scopeId,
				kind,
				location: range(switchOwner ?? node),
				bindingsComplete: true,
				bindings: new Map()
			};
			state.scopes.push(scope);
			state.scopesById.set(scope.scopeId, scope);
			return scope;
		};
		functionNameScope = (node, parentScope, state) => {
			if (!t.isFunctionExpression(node) || !t.isIdentifier(node.id)) return undefined;
			const scope = {
				scopeId: `${semanticScopeId("block", node)}:function-name`,
				parentScopeId: parentScope.scopeId,
				kind: "block",
				location: range(node),
				bindingsComplete: true,
				bindings: new Map()
			};
			state.scopes.push(scope);
			state.scopesById.set(scope.scopeId, scope);
			addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "function",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
			return scope;
		};
		scopeKind = (node, parent) => {
			if (t.isFunction(node)) return "function";
			if (t.isClass(node)) return "class";
			if (t.isCatchClause(node)) return "catch";
			if (t.isForStatement(node) || t.isForOfStatement(node) || t.isForInStatement(node)) return "block";
			if (t.isSwitchCase(node)) return "block";
			if (t.isStaticBlock(node)) return "static-block";
			if (t.isBlockStatement(node) && parent !== null && t.isFunction(parent) && parent.body === node) {
				return functionParametersHaveExpressions(parent) ? "function" : undefined;
			}
			if (t.isBlockStatement(node)) return "block";
			return undefined;
		};
		functionParametersHaveExpressions = (node) => {
			const pending = [...runtimeFunctionParameters(node)];
			while (pending.length > 0) {
				const parameter = pending.pop();
				if (t.isAssignmentPattern(parameter)) return true;
				if (t.isTSParameterProperty(parameter)) pending.push(parameter.parameter);
				else if (t.isRestElement(parameter)) pending.push(parameter.argument);
				else if (t.isArrayPattern(parameter)) {
					for (const element of parameter.elements) if (element !== null) pending.push(element);
				} else if (t.isObjectPattern(parameter)) {
					for (const property of parameter.properties) {
						if (t.isRestElement(property)) pending.push(property.argument);
						else {
							if (property.computed) return true;
							pending.push(property.value);
						}
					}
				}
			}
			return false;
		};
		bindImports = (node, scope, state) => {
			for (const specifier of node.specifiers) {
				const importedPath = t.isImportDefaultSpecifier(specifier) ? ["default"] : t.isImportNamespaceSpecifier(specifier) ? [] : [semanticStaticPropertyKey(specifier.imported, false) ?? "[dynamic]"];
				addBinding({
					state,
					scope,
					name: specifier.local.name,
					kind: "import",
					mutable: false,
					definitionNode: specifier.local,
					initializer: null,
					directOrigin: {
						specifier: node.source.value,
						importedPath
					},
					runtimeImport: node.importKind !== "type" && node.importKind !== "typeof" && (!t.isImportSpecifier(specifier) || specifier.importKind !== "type" && specifier.importKind !== "typeof")
				});
			}
		};
		bindFunctionLocals = (node, scope, state) => {
			for (const parameter of runtimeFunctionParameters(node)) bindPattern({
				pattern: t.isTSParameterProperty(parameter) ? parameter.parameter : parameter,
				initializer: null,
				scope,
				state,
				mutable: true,
				kind: "parameter"
			});
		};
		bindPattern = (input) => {
			const { pattern, initializer, scope, state, mutable, declarationKind, kind = "variable", projection = [], referenceOnly = false, copyKind, copyProjectionOffset, copyExcludedKeys, copyStartIndex, fallbackSources, requiredSources } = input;
			if (t.isTSParameterProperty(pattern)) {
				bindPattern({
					...input,
					pattern: pattern.parameter
				});
				return;
			}
			if (t.isIdentifier(pattern)) {
				if (referenceOnly) {
					const binding = resolveSemanticBindingFromScope(scope, pattern.name, state);
					if (binding !== undefined && initializer !== null) binding.referenceInitializers.push({
						node: initializer,
						projection,
						...copyKind === undefined ? {} : { copyKind },
						...copyProjectionOffset === undefined ? {} : { copyProjectionOffset },
						...copyExcludedKeys === undefined ? {} : { copyExcludedKeys },
						...copyStartIndex === undefined ? {} : { copyStartIndex },
						...fallbackSources === undefined ? {} : { fallbackSources },
						...requiredSources === undefined ? {} : { requiredSources }
					});
					return;
				}
				addBinding({
					state,
					scope,
					name: pattern.name,
					kind,
					mutable,
					...declarationKind === undefined ? {} : { declarationKind },
					definitionNode: pattern,
					initializer,
					projection
				});
				return;
			}
			if (t.isAssignmentPattern(pattern)) {
				bindPattern({
					...input,
					pattern: pattern.left,
					initializer: kind === "parameter" || kind === "catch" ? initializer : initializer ?? pattern.right,
					requiredSources: [...requiredSources ?? [], ...initializer === null ? [] : [{
						node: initializer,
						projection
					}]]
				});
				bindPattern({
					state,
					scope,
					mutable,
					kind,
					pattern: pattern.left,
					initializer: pattern.right,
					projection: [],
					referenceOnly: true,
					fallbackSources: [...fallbackSources ?? [], ...initializer === null ? [] : [{
						node: initializer,
						projection
					}]],
					...requiredSources === undefined ? {} : { requiredSources }
				});
				return;
			}
			if (t.isRestElement(pattern)) {
				bindPattern({
					...input,
					pattern: pattern.argument,
					initializer: null,
					mutable: true
				});
				return;
			}
			if (t.isObjectPattern(pattern)) for (const property of pattern.properties) {
				if (t.isRestElement(property)) {
					bindPattern({
						...input,
						pattern: property.argument,
						initializer: null,
						mutable: true,
						projection: []
					});
					bindPattern({
						...input,
						pattern: property.argument,
						projection: [...projection, null],
						referenceOnly: true,
						copyKind: "object-rest",
						copyProjectionOffset: projection.length,
						copyExcludedKeys: semanticObjectPatternKeys(pattern)
					});
				} else {
					const name = semanticStaticPropertyKey(property.key, property.computed);
					bindPattern({
						...input,
						pattern: property.value,
						projection: [...projection, name]
					});
				}
			}
			else if (t.isArrayPattern(pattern)) pattern.elements.forEach((element, index) => {
				if (element !== null) {
					bindPattern({
						...input,
						pattern: element,
						projection: [...projection, index]
					});
					if (t.isRestElement(element)) bindPattern({
						...input,
						pattern: element.argument,
						projection: [...projection, null],
						referenceOnly: true,
						copyKind: "array-rest",
						copyProjectionOffset: projection.length,
						copyStartIndex: index
					});
				}
			});
		};
		addBinding = (input) => {
			const { state, scope, name, kind, mutable, declarationKind, definitionNode, initializer, directOrigin, runtimeImport, projection = [] } = input;
			let binding = scope.bindings.get(name);
			if (binding === undefined) {
				if (!scope.bindingsComplete) return;
				binding = createBinding(scope, name, kind, mutable);
				scope.bindings.set(name, binding);
				state.bindingsById.set(binding.bindingId, binding);
			}
			binding.mutable ||= mutable;
			if (declarationKind !== undefined) binding.declarationKinds.add(declarationKind);
			binding.definitions.push({
				kind,
				location: range(definitionNode)
			});
			if (initializer !== null) binding.initializers.push({
				node: initializer,
				projection
			});
			if (directOrigin !== undefined) binding.directOrigins.push(directOrigin.resolutionMode === undefined && state.staticImportResolutionMode !== "import" ? {
				...directOrigin,
				resolutionMode: state.staticImportResolutionMode
			} : directOrigin);
			binding.runtimeImport ||= runtimeImport === true;
		};
		createBinding = (scope, name, kind, mutable) => ({
			bindingId: semanticBindingId(scope.scopeId, name),
			scopeId: scope.scopeId,
			name,
			kind,
			mutable,
			declarationKinds: new Set(),
			memberWrites: [],
			escapedPaths: [],
			definitions: [],
			initializers: [],
			referenceInitializers: [],
			directOrigins: [],
			runtimeImport: false
		});
		addAssignment = (identifier, initializer, scope, state, conditionallySkipped) => {
			const binding = resolveSemanticBindingFromScope(scope, identifier.name, state);
			if (binding === undefined) {
				const writes = state.ambientBindingWrites.get(identifier.name) ?? [];
				writes.push(identifier);
				state.ambientBindingWrites.set(identifier.name, writes);
				return;
			}
			binding.mutable = true;
			binding.definitions.push({
				kind: "assignment",
				location: range(identifier)
			});
			binding.initializers.push({
				node: initializer,
				projection: []
			});
			if (conditionallySkipped) state.conditionallySkippedExpressions.add(initializer);
		};
	})))();
}

//#endregion
//#region dist/domain/webScriptExport.js
var exportWebScriptsInputSchema, sourceSchema, exportedWebScriptSchema, webScriptExportManifestSchema, webScriptExportResultSchema;
function init_webScriptExport() {
	return (init_webScriptExport = __esmMin((() => {
		init_browserCompleteness();
		init_browserScenarioCaptureValues();
		init_digests();
		init_localPath();
		exportWebScriptsInputSchema = z.strictObject({
			capture_path: localPathStringSchema.describe("Absolute filesystem path to saved inspect_web_page or capture_browser_scenario JSON, normalized result or complete Evidence"),
			output_directory: localPathStringSchema.describe("Absolute absent filesystem directory for verified scripts and manifest; parent directory must exist")
		});
		sourceSchema = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("page-script"),
			script_key: z.string().min(1),
			frame_id: z.string().nullable(),
			is_module: z.boolean().nullable(),
			language: z.string().nullable(),
			source_map_url: z.string().nullable()
		}), z.strictObject({
			kind: z.literal("scenario-response"),
			transaction_id: z.string().min(1),
			request_sequence: z.number().int().min(1),
			response_sequence: z.number().int().min(1).nullable(),
			status: z.number().nullable()
		})]);
		exportedWebScriptSchema = z.strictObject({
			source: sourceSchema,
			url: z.string(),
			content: z.discriminatedUnion("state", [z.strictObject({
				state: z.literal("exported"),
				relative_path: z.string().min(1),
				layout: z.enum(["url-path", "isolated"]),
				layout_reason: z.string().nullable(),
				sha256: digestSchema,
				bytes: z.number().int().min(0),
				media_type: z.string().nullable(),
				redacted: z.boolean().nullable(),
				representation: z.enum([
					"debugger-source-utf8",
					"playwright-response-body-bytes",
					"browser-decoded-response-bytes"
				])
			}), z.strictObject({
				state: z.literal("unavailable"),
				reason: z.string().min(1),
				message: z.string().min(1)
			})])
		});
		webScriptExportManifestSchema = z.strictObject({
			capture_path: z.string().min(1),
			capture_sha256: digestSchema,
			capture_kind: z.enum(["page-inspection", "browser-scenario"]),
			source_evidence_id: prefixedDigestSchema("ev").nullable(),
			capture_completeness: z.union([browserCompletenessSchema, browserScenarioCompletenessSchema]),
			output_directory: z.string().min(1),
			analysis_input: z.strictObject({
				input_path: z.string().min(1),
				format: z.literal("directory")
			}).nullable(),
			scripts: z.array(exportedWebScriptSchema),
			limitations: z.array(z.string())
		});
		webScriptExportResultSchema = webScriptExportManifestSchema.extend({ manifest: z.strictObject({
			path: z.string().min(1),
			sha256: digestSchema,
			bytes: z.number().int().min(0)
		}) });
	})))();
}

//#endregion
//#region dist/domain/webScriptArtifacts.js
var selectedWebScriptInputSchema, webArtifactFileSchema, selectedWebScriptArtifactsSchema, capturedWebManifestIdentitySchema;
function init_webScriptArtifacts() {
	return (init_webScriptArtifacts = __esmMin((() => {
		init_digests();
		init_localPath();
		init_webScriptExport();
		selectedWebScriptInputSchema = z.strictObject({
			manifest_path: localPathStringSchema.describe("Absolute export_web_scripts manifest path"),
			script_index: z.number().int().min(0).describe("Zero-based index in manifest.scripts")
		});
		webArtifactFileSchema = z.strictObject({
			path: z.string().min(1),
			sha256: digestSchema,
			bytes: z.number().int().min(0)
		});
		selectedWebScriptArtifactsSchema = z.strictObject({
			manifest: webScriptExportManifestSchema,
			manifestFile: webArtifactFileSchema,
			sourceFile: webArtifactFileSchema,
			source: z.string()
		});
		capturedWebManifestIdentitySchema = webArtifactFileSchema.extend({
			reported_output_directory: z.string(),
			...webScriptExportManifestSchema.pick({
				capture_path: true,
				capture_sha256: true,
				capture_kind: true,
				capture_completeness: true,
				source_evidence_id: true
			}).shape
		});
	})))();
}

//#endregion
//#region dist/domain/webSourceLocation.js
var webSourcePositionSchema, webSourceLocationInputSchema, originalContentSchema, webSourceMapMatchSchema, webSourceMapReportSchema, WEB_SOURCE_MAP_LIMITS, webSourceLocationResultSchema;
function init_webSourceLocation() {
	return (init_webSourceLocation = __esmMin((() => {
		init_digests();
		init_localPath();
		init_webScriptExport();
		init_webScriptArtifacts();
		webSourcePositionSchema = z.strictObject({
			line: z.number().int().min(1),
			column: z.number().int().min(0)
		});
		webSourceLocationInputSchema = selectedWebScriptInputSchema.extend({
			source_map: z.strictObject({
				path: localPathStringSchema.describe("Absolute local source-map path; no fetch"),
				url: z.string().min(1).describe("Explicit source-map URL context used to resolve original source names")
			}),
			generated_position: webSourcePositionSchema
		});
		originalContentSchema = z.discriminatedUnion("state", [z.strictObject({
			state: z.literal("embedded"),
			text: z.string(),
			utf8_sha256: digestSchema,
			utf8_bytes: z.number().int().min(0),
			representation: z.literal("UTF-8 encoding of decoded sourcesContent text")
		}), z.strictObject({
			state: z.literal("unavailable"),
			reason: z.literal("sourcesContent-not-retained")
		})]);
		webSourceMapMatchSchema = z.discriminatedUnion("state", [z.strictObject({ state: z.literal("generated-only") }), z.strictObject({
			state: z.literal("mapped"),
			flattened_source_index: z.number().int().min(0),
			section_path: z.array(z.number().int().min(0)),
			source_index: z.number().int().min(0),
			reported_source: z.string().nullable(),
			reported_source_root: z.string().nullable(),
			resolved_url: z.string().nullable(),
			ignored: z.boolean(),
			content: originalContentSchema,
			original_position: webSourcePositionSchema.extend({
				offset: z.number().int().min(0).nullable(),
				content_position: z.enum([
					"verified-in-embedded-text",
					"outside-embedded-text",
					"content-unavailable"
				])
			}),
			name: z.string().nullable()
		})]);
		webSourceMapReportSchema = z.strictObject({
			source_map_sha256: digestSchema,
			url_context: z.string().min(1),
			engine: z.strictObject({
				id: z.string().min(1),
				version: z.string().min(1)
			}),
			runtime: z.discriminatedUnion("id", [z.strictObject({
				id: z.literal("node-v8"),
				version: z.string().min(1),
				v8_heap_limit_bytes: z.number().int().min(1)
			}), z.strictObject({
				id: z.literal("bun"),
				version: z.string().min(1),
				node_compatibility_version: z.string().min(1),
				v8_heap_limit_bytes: z.null(),
				process_memory_limit_bytes: z.number().int().min(1).nullable()
			})]),
			format: z.enum(["regular", "indexed"]),
			reported_file: z.string().nullable(),
			lookup: z.strictObject({
				requested: webSourcePositionSchema,
				matched_generated_position: webSourcePositionSchema.nullable(),
				semantics: z.literal("greatest generated position <= requested, across lines; all equal-position segments"),
				location_units: z.literal("one-based lines; zero-based UTF-16 columns")
			}),
			matches: z.array(webSourceMapMatchSchema),
			diagnostics: z.array(z.string())
		});
		WEB_SOURCE_MAP_LIMITS = {
			mapBytes: 4 * 1024 * 1024,
			outputBytes: 32 * 1024 * 1024,
			decodedRows: 262144,
			decodedSegments: 262144,
			decodedRecords: 262144,
			sectionDepth: 64,
			decodeTimeoutMs: 2e4,
			/** V8 old-generation heap for the codec, and its Bun process budget. */
			codecHeapMiB: 192
		};
		webSourceLocationResultSchema = webSourceMapReportSchema.extend({
			manifest: capturedWebManifestIdentitySchema,
			source: webArtifactFileSchema.extend({
				script_index: z.number().int().min(0),
				script: exportedWebScriptSchema
			}),
			source_map: webArtifactFileSchema.extend({
				url: z.string().min(1),
				association: z.literal("caller-selected")
			}),
			generated_offset: z.number().int().min(0),
			source_authenticity: z.literal("unknown"),
			execution: z.literal("unknown"),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
export { semanticFactoryLoaderMemberAt as $, init_browserScenarioNormalization as $t, init_javascriptSemanticCoverage as A, init_javascriptAstValues as At, hasUncertainTypeOnlyModuleSideEffect as B, childNodes as Bt, init_javascriptSemanticAnalysis as C, sourceRangesEqual as Ct, parseJavaScriptSource as D, staticPathResolutionContext as Dt, init_javascriptSourceParser as E, staticPath as Et, isUnmodifiedImportMetaUrl as F, semanticStaticPropertyKey as Ft, isTypeOnlyImportSpecifier as G, init_javascriptSemanticState as Gt, isTypeOnlyExportDeclaration as H, init_javascriptSemanticTraversal as Ht, init_javascriptBootstrap as I, semanticStaticPropertyName as It, init_javascriptSemanticSlots as J, browserCaptureComparisonInputSchema as Jt, init_javascriptSemanticResourceLimits as K, resolveSemanticBindingState as Kt, javascriptBootstrapAt as L, semanticWriteSiteTarget as Lt, semanticResourceLimitCoverage as M, propertyName as Mt, init_javascriptSemanticAmbientWrites as N, readExactJavaScriptLiteral as Nt, flattenSemanticReturnValue as O, storageKind as Ot, isUnmodifiedGlobalReference as P, runtimeFunctionParameters as Pt, init_javascriptSemanticRequireOrigin as Q, commitBrowserScenarioNormalization as Qt, init_javascriptSemanticProjection as R, semanticWriteTargets as Rt, indexJavaScriptElectronIdentitySteps as S, sortedUnique as St, init_javascriptRpcEndpoints as T, staticArrayValues as Tt, isTypeOnlyExportSpecifier as U, traverseJavaScriptAst as Ut, init_javascriptModuleDeclaration as V, completeSemanticSteps as Vt, isTypeOnlyImportDeclaration as W, traverseJavaScriptAstSteps as Wt, semanticPropertyPointer as X, compareBrowserCaptures as Xt, semanticContainer as Y, browserCaptureComparisonSchema as Yt, semanticSlotAtPath as Z, init_browserCaptureComparison as Zt, analyzeParsedJavaScriptSemanticsSteps as _, prefixedArgument as _t, webSourceMapReportSchema as a, webObservationSessionSchema as an, STATIC_ROUTE_CALL_NAMES as at, classifyParsedJavaScriptRpcClientRootsSteps as b, registrationKey as bt, selectedWebScriptArtifactsSchema as c, webBundleAnalysisSchema as cn, calleeName as ct, exportedWebScriptSchema as d, endpointArgument as dt, discoverWebMcpToolsInputSchema as en, semanticFactoryRequireLoaderAt as et, init_webScriptExport as f, factoryRequireName as ft, analyzeParsedJavaScriptReferences as g, modulePropertyName as gt, analyzeJavaScriptSemantics as h, moduleFactory as ht, webSourceLocationResultSchema as i, observeWebSessionInputSchema as in, init_javascriptElectronMemberWrites as it, semanticCoverageResourceLimits as j, javascriptDisplayText as jt, init_javascriptSemanticReturns as k, stringValue as kt, webArtifactFileSchema as l, webSourceMapsSchema as ln, chunkRuntime as lt, webScriptExportResultSchema as m, init_javascriptStaticAnalysisHelpers as mt, init_webSourceLocation as n, webMcpDiscoverySchema as nn, ELECTRON_IDENTITY_LIMITATION as nt, webSourcePositionSchema as o, analyzeWebBundleInputSchema as on, argumentNode as ot, webScriptExportManifestSchema as p, failedJavaScriptStaticAnalysis as pt, semanticResourceLimitReason as q, semanticResolutionBlocked as qt, webSourceLocationInputSchema as r, init_browserSession as rn, ELECTRON_MODULE as rt, init_webScriptArtifacts as s, init_webBundleAnalysis as sn, argumentValue as st, WEB_SOURCE_MAP_LIMITS as t, init_webMcpDiscovery as tn, semanticRequireLoaderAt as tt, exportWebScriptsInputSchema as u, detectVendors as ut, classifyParsedJavaScriptOpenReceivers as v, range as vt, createJavaScriptRpcScan as w, sourceSlice as wt, indexJavaScriptBindingsSteps as x, sha256Text as xt, classifyParsedJavaScriptOpenReceiversSteps as y, rangeForOffsets as yt, semanticImportEqualsSpecifier as z, unwrapJavaScriptExpression as zt };