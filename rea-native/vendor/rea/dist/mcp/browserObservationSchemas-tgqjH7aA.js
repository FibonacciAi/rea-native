import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { i as prefixedDigestSchema, n as init_digests } from "./digests-BFoWUT_-.js";
import { r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { n as init_webContentArtifact, r as webTextArtifactSchema } from "./webContentArtifact-Dzjc1z-R.js";
import { z } from "zod";

//#region dist/domain/browserCompleteness.js
var browserSectionSchema, browserExclusionReasonSchema, browserExclusionSchema, browserDroppedEventsSchema, browserCompletenessConditionSchema, browserCompletenessSchema, classifyBrowserCompleteness, sortedSections, canonicalExclusions;
function init_browserCompleteness() {
	return (init_browserCompleteness = __esmMin((() => {
		init_unicodeCodePointOrder();
		browserSectionSchema = z.enum([
			"frames",
			"dom",
			"accessibility",
			"scripts",
			"script_sources",
			"resources",
			"network_requests",
			"network_initiators",
			"console_events",
			"console_text",
			"websocket_connections",
			"websocket_frames",
			"websocket_shapes",
			"json_body_shapes",
			"workers",
			"storage",
			"storage_keys",
			"metadata",
			"webmcp_tools",
			"screenshot",
			"source_maps",
			"timeline"
		]);
		browserExclusionReasonSchema = z.enum([
			"disallowed_origin",
			"unsupported_url",
			"unattributed_origin",
			"not_approved",
			"out_of_target_scope",
			"provider_unavailable",
			"invalid_protocol_value",
			"resource_budget_exhausted"
		]);
		browserExclusionSchema = z.object({
			section: browserSectionSchema,
			reason: browserExclusionReasonSchema,
			count: z.number().int().min(0).nullable()
		});
		browserDroppedEventsSchema = z.object({
			scripts: z.number().int().min(0),
			network_requests: z.number().int().min(0),
			console_events: z.number().int().min(0),
			websocket_connections: z.number().int().min(0),
			websocket_frames: z.number().int().min(0),
			webmcp_tools: z.number().int().min(0),
			timeline_events: z.number().int().min(0),
			total: z.number().int().min(0)
		});
		browserCompletenessConditionSchema = z.enum([
			"complete_within_window",
			"policy_filtered",
			"attach_limited",
			"truncated"
		]);
		browserCompletenessSchema = z.object({
			status: browserCompletenessConditionSchema,
			conditions: z.array(browserCompletenessConditionSchema).min(1).max(3),
			policy_filtered_sections: z.array(browserSectionSchema),
			attach_limited_sections: z.array(browserSectionSchema),
			truncated_sections: z.array(browserSectionSchema),
			unavailable_sections: z.array(browserSectionSchema),
			excluded: z.array(browserExclusionSchema),
			dropped_events: browserDroppedEventsSchema
		});
		classifyBrowserCompleteness = (input) => {
			const policyFiltered = input.policyFilteredSections.size > 0;
			const truncated = input.truncatedSections.size > 0 || Object.values(input.droppedEvents).some((count) => count > 0);
			const attachLimited = input.attachLimitedSections.size > 0 || input.unavailableSections.size > 0;
			const status = truncated ? "truncated" : policyFiltered ? "policy_filtered" : attachLimited ? "attach_limited" : "complete_within_window";
			const conditions = [
				...attachLimited ? ["attach_limited"] : [],
				...policyFiltered ? ["policy_filtered"] : [],
				...truncated ? ["truncated"] : []
			];
			const droppedTotal = Object.values(input.droppedEvents).reduce((sum, count) => sum + count, 0);
			return browserCompletenessSchema.parse({
				status,
				conditions: conditions.length === 0 ? ["complete_within_window"] : conditions,
				policy_filtered_sections: sortedSections(input.policyFilteredSections),
				attach_limited_sections: sortedSections(input.attachLimitedSections),
				truncated_sections: sortedSections(input.truncatedSections),
				unavailable_sections: sortedSections(input.unavailableSections),
				excluded: canonicalExclusions(input.excluded),
				dropped_events: {
					...input.droppedEvents,
					total: droppedTotal
				}
			});
		};
		sortedSections = (sections) => [...sections].sort();
		canonicalExclusions = (exclusions) => [...exclusions].sort((left, right) => compareUnicodeCodePoints(left.section, right.section) || compareUnicodeCodePoints(left.reason, right.reason));
	})))();
}

//#endregion
//#region dist/domain/jsonShape.js
var jsonValueTypeSchema, jsonShapePathSegmentSchema, jsonShapeSchema, arrayElementKey, inferJsonShape, jsonValueType, isRecord, orderedChildren;
function init_jsonShape() {
	return (init_jsonShape = __esmMin((() => {
		init_unicodeCodePointOrder();
		jsonValueTypeSchema = z.enum([
			"object",
			"array",
			"string",
			"number",
			"boolean",
			"null"
		]);
		jsonShapePathSegmentSchema = z.discriminatedUnion("kind", [z.object({
			kind: z.literal("property"),
			name: z.string()
		}), z.object({ kind: z.literal("array-element") })]);
		jsonShapeSchema = z.object({
			root_type: jsonValueTypeSchema,
			node_count: z.number().int().min(1),
			max_depth_observed: z.number().int().min(0),
			properties: z.array(z.object({
				path: z.array(jsonShapePathSegmentSchema).min(1),
				types: z.array(jsonValueTypeSchema).min(1),
				observations: z.number().int().min(1)
			}))
		});
		arrayElementKey = Symbol("array-element");
		inferJsonShape = (text) => {
			let root;
			try {
				root = JSON.parse(text);
			} catch (cause) {
				void cause;
				return null;
			}
			const rootShape = {
				path: [],
				types: new Set(),
				observations: 0
			};
			const childShape = (parent, key) => {
				const children = parent.children ??= new Map();
				const existing = children.get(key);
				if (existing !== undefined) return existing;
				const node = {
					path: [...parent.path, typeof key === "string" ? {
						kind: "property",
						name: key
					} : { kind: "array-element" }],
					types: new Set(),
					observations: 0
				};
				children.set(key, node);
				return node;
			};
			const pending = [{
				value: root,
				shape: rootShape
			}];
			let nodeCount = 0;
			let maxDepthObserved = 0;
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined) break;
				nodeCount += 1;
				maxDepthObserved = Math.max(maxDepthObserved, current.shape.path.length);
				current.shape.types.add(jsonValueType(current.value));
				current.shape.observations += 1;
				if (Array.isArray(current.value)) {
					if (current.value.length === 0) continue;
					const shape = childShape(current.shape, arrayElementKey);
					for (let index = current.value.length - 1; index >= 0; index -= 1) pending.push({
						value: current.value[index],
						shape
					});
					continue;
				}
				if (!isRecord(current.value)) continue;
				const allEntries = Object.entries(current.value);
				for (let index = allEntries.length - 1; index >= 0; index -= 1) {
					const entry = allEntries[index];
					if (entry === undefined) continue;
					const [name, value] = entry;
					pending.push({
						value,
						shape: childShape(current.shape, name)
					});
				}
			}
			const properties = [];
			const shapes = orderedChildren(rootShape);
			while (shapes.length > 0) {
				const shape = shapes.pop();
				if (shape === undefined) break;
				properties.push({
					path: shape.path.map((segment) => ({ ...segment })),
					types: [...shape.types].sort(),
					observations: shape.observations
				});
				for (const child of orderedChildren(shape)) shapes.push(child);
			}
			return {
				root_type: jsonValueType(root),
				node_count: nodeCount,
				max_depth_observed: maxDepthObserved,
				properties
			};
		};
		jsonValueType = (value) => {
			if (value === null) return "null";
			if (Array.isArray(value)) return "array";
			switch (typeof value) {
				case "string": return "string";
				case "number": return "number";
				case "boolean": return "boolean";
				default: return "object";
			}
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		orderedChildren = (node) => [...node.children ?? []].sort(([left], [right]) => left === right ? 0 : left === arrayElementKey ? 1 : right === arrayElementKey ? -1 : compareUnicodeCodePoints(right, left)).map(([, child]) => child);
	})))();
}

//#endregion
//#region dist/domain/browserObservationSchemas.js
var browserVersionSchema, browserTargetSchema, browserTargetListSchema, browserFrameSchema, browserDomNodeSchema, browserAxNodeSchema, browserScriptSourceSchema, browserResourceReconciliationSchema, browserScriptSchema, browserResourceSchema, browserNetworkRequestSchema, browserConsoleEventSchema, browserWebSocketFrameSchema, browserWebSocketConnectionSchema, browserWorkerSchema, browserCspSourceSchema, browserLinkMetadataSchema, browserAgentHintSchema, browserSafeMetadataSchema, webPageInspectionSchema;
function init_browserObservationSchemas() {
	return (init_browserObservationSchemas = __esmMin((() => {
		init_browserCompleteness();
		init_webContentArtifact();
		init_jsonShape();
		init_digests();
		browserVersionSchema = z.object({
			product: z.string(),
			protocol_version: z.string(),
			revision: z.string(),
			user_agent: z.string(),
			js_version: z.string()
		});
		browserTargetSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			title: z.string(),
			url: z.string(),
			origin: z.string(),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown")
		});
		browserTargetListSchema = z.object({
			browser: browserVersionSchema,
			targets: z.array(browserTargetSchema),
			excluded: z.object({
				disallowed_origin: z.number().int().min(0),
				unsupported_url: z.number().int().min(0),
				non_page: z.number().int().min(0)
			}),
			limitations: z.array(z.string())
		});
		browserFrameSchema = z.object({
			frame_id: z.string(),
			parent_frame_id: z.string().nullable(),
			url: z.string(),
			origin: z.string().nullable()
		});
		browserDomNodeSchema = z.object({
			index: z.number().int().min(0),
			parent_index: z.number().int().min(-1),
			node_type: z.number().int().min(0),
			node_name: z.string(),
			node_value_length: z.number().int().min(0),
			attribute_names: z.array(z.string())
		});
		browserAxNodeSchema = z.object({
			node_id: z.string(),
			parent_id: z.string().nullable(),
			role: z.string().nullable(),
			name: z.string().nullable(),
			description: z.string().nullable(),
			ignored: z.boolean(),
			states: z.array(z.object({
				name: z.string(),
				value: z.union([
					z.boolean(),
					z.number(),
					z.string()
				])
			})).default([])
		});
		browserScriptSourceSchema = z.discriminatedUnion("included", [z.object({
			included: z.literal(false),
			reason: z.string()
		}), z.object({
			included: z.literal(true),
			artifact: webTextArtifactSchema
		})]);
		browserResourceReconciliationSchema = z.discriminatedUnion("status", [
			z.object({
				status: z.literal("exact"),
				resource_key: z.string()
			}),
			z.object({
				status: z.literal("ambiguous"),
				candidate_resource_keys: z.array(z.string())
			}),
			z.object({
				status: z.literal("unmatched"),
				reason: z.literal("no_exact_sanitized_url")
			})
		]);
		browserScriptSchema = z.object({
			script_key: z.string().regex(/^scr_[a-f0-9]{64}(?:_[0-9]+)?$/u),
			frame_id: z.string().nullable().default(null),
			url: z.string(),
			origin: z.string().nullable(),
			cdp_hash: z.string().nullable().describe("Producer-reported script hash; null when unavailable."),
			length: z.number().int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
			is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
			language: z.string().nullable(),
			source_map_url: z.string().nullable(),
			resource_reconciliation: browserResourceReconciliationSchema,
			source: browserScriptSourceSchema
		});
		browserResourceSchema = z.object({
			resource_key: prefixedDigestSchema("res"),
			url: z.string(),
			origin: z.string().nullable(),
			type: z.string(),
			mime_type: z.string(),
			content_size: z.number().min(0).nullable()
		});
		browserNetworkRequestSchema = z.object({
			request_id: z.string(),
			url: z.string(),
			origin: z.string().nullable(),
			method: z.string(),
			resource_type: z.string().nullable(),
			status: z.number().nullable(),
			mime_type: z.string().nullable(),
			encoded_data_length: z.number().min(0).nullable(),
			redirects: z.array(z.object({
				url: z.string(),
				response_url: z.string(),
				method: z.string(),
				resource_type: z.string().nullable(),
				status: z.number().nullable(),
				mime_type: z.string().nullable(),
				encoded_data_length: z.number().min(0).nullable(),
				request_timestamp: z.number().nullable(),
				redirect_event_timestamp: z.number().nullable()
			})).optional(),
			initiator: z.object({
				type: z.string(),
				url: z.string().nullable(),
				line: z.number().int().min(0).nullable(),
				column: z.number().int().min(0).nullable()
			}),
			body_shapes: z.object({
				status: z.enum([
					"not_approved",
					"included",
					"partial",
					"unavailable"
				]),
				request: jsonShapeSchema.nullable(),
				response: jsonShapeSchema.nullable()
			})
		});
		browserConsoleEventSchema = z.object({
			type: z.string(),
			timestamp: z.number(),
			argument_types: z.array(z.string()),
			url: z.string().nullable(),
			line: z.number().int().min(0).nullable(),
			column: z.number().int().min(0).nullable(),
			text_capture: z.object({
				status: z.enum(["not_approved", "included"]),
				values: z.array(z.object({
					argument_index: z.number().int().min(0),
					type: z.string(),
					text: z.string()
				})),
				retained_bytes: z.number().int().min(0)
			})
		});
		browserWebSocketFrameSchema = z.object({
			direction: z.enum(["sent", "received"]),
			opcode: z.number().int().min(0),
			payload_bytes: z.number().int().min(0).nullable(),
			payload_shape: z.object({
				format: z.enum([
					"json",
					"text",
					"binary"
				]),
				json_shape: jsonShapeSchema.nullable()
			}).nullable()
		});
		browserWebSocketConnectionSchema = z.object({
			request_id: z.string(),
			url: z.string(),
			events: z.array(browserWebSocketFrameSchema)
		});
		browserWorkerSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			url: z.string(),
			origin: z.string().nullable(),
			attached: z.boolean(),
			opener_target_id: z.string().nullable().default(null),
			parent_frame_id: z.string().nullable().default(null)
		});
		browserCspSourceSchema = z.object({
			kind: z.enum([
				"keyword",
				"scheme",
				"approved_origin",
				"external_origin",
				"other"
			]),
			value: z.string().nullable()
		});
		browserLinkMetadataSchema = z.object({
			href: z.string().nullable(),
			destination_scope: z.enum([
				"approved",
				"outside_policy",
				"unsupported"
			]),
			rel: z.array(z.string()),
			as: z.string().nullable(),
			type: z.string().nullable(),
			crossorigin: z.string().nullable()
		});
		browserAgentHintSchema = z.object({
			mechanism: z.enum([
				"link_rel",
				"dom_link_rel",
				"well_known_resource",
				"response_header"
			]),
			declaration: z.string(),
			url: z.string().nullable(),
			trust: z.literal("page-declared-untrusted")
		});
		browserSafeMetadataSchema = z.object({
			responses: z.array(z.object({
				request_id: z.string(),
				url: z.string(),
				mime_type: z.string().nullable(),
				content_length: z.number().int().min(0).nullable(),
				content_encoding: z.string().nullable(),
				csp: z.object({
					directives: z.array(z.object({
						name: z.string(),
						sources: z.array(browserCspSourceSchema)
					})),
					nonce_count: z.number().int().min(0),
					hash_count: z.number().int().min(0)
				}),
				links: z.array(browserLinkMetadataSchema),
				policies: z.object({
					coop: z.string().nullable(),
					coep: z.string().nullable(),
					corp: z.string().nullable(),
					referrer_policy: z.string().nullable(),
					x_content_type_options: z.string().nullable(),
					permissions_policy_features: z.array(z.string())
				})
			})),
			dom_urls: z.array(z.object({
				node_index: z.number().int().min(0),
				attribute: z.enum([
					"href",
					"src",
					"action",
					"formaction",
					"poster"
				]),
				url: z.string().nullable(),
				destination_scope: z.enum([
					"approved",
					"outside_policy",
					"unsupported"
				])
			})),
			agent_hints: z.array(browserAgentHintSchema),
			excluded_dom_urls: z.number().int().min(0),
			headers_allowlisted: z.literal(true)
		});
		webPageInspectionSchema = z.object({
			browser: browserVersionSchema,
			target: browserTargetSchema,
			capture_window: z.object({
				started_at: z.iso.datetime(),
				ended_at: z.iso.datetime(),
				observation_ms: z.number().int().min(0)
			}),
			completeness: browserCompletenessSchema,
			frames: z.array(browserFrameSchema),
			dom: z.object({
				total_nodes: z.number().int().min(0),
				nodes: z.array(browserDomNodeSchema)
			}),
			accessibility: z.object({
				total_nodes: z.number().int().min(0),
				text_capture: z.object({
					status: z.enum([
						"not_approved",
						"included",
						"unavailable"
					]),
					retained_bytes: z.number().int().min(0),
					excluded_fields: z.number().int().min(0)
				}),
				nodes: z.array(browserAxNodeSchema)
			}),
			scripts: z.object({
				total: z.number().int().min(0),
				items: z.array(browserScriptSchema)
			}),
			resources: z.array(browserResourceSchema),
			network: z.object({
				requests: z.array(browserNetworkRequestSchema),
				websocket_connections: z.array(browserWebSocketConnectionSchema),
				coverage_started_at: z.iso.datetime(),
				prior_activity_available: z.literal(false)
			}),
			console: z.object({
				events: z.array(browserConsoleEventSchema),
				coverage_started_at: z.iso.datetime(),
				prior_activity_available: z.literal(false)
			}),
			workers: z.array(browserWorkerSchema),
			metadata: browserSafeMetadataSchema,
			storage: z.object({
				origin: z.string(),
				usage_bytes: z.number().min(0).nullable(),
				quota_bytes: z.number().min(0).nullable(),
				local_storage_keys: z.array(z.string()),
				session_storage_keys: z.array(z.string()),
				indexed_db_names: z.array(z.string()),
				cache_names: z.array(z.string()),
				content_fingerprints: z.array(z.object({
					scope: z.enum([
						"cookie",
						"local_storage",
						"session_storage",
						"indexed_db_schema",
						"indexed_db_record",
						"cache_entry"
					]),
					identity_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
					value_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
					complete: z.boolean()
				})).default([]),
				fingerprint_algorithm: z.literal("sha256").default("sha256"),
				fingerprints_complete: z.boolean().default(false),
				values_redacted: z.literal(true)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
export { inferJsonShape as a, classifyBrowserCompleteness as c, webPageInspectionSchema as i, init_browserCompleteness as l, browserVersionSchema as n, init_jsonShape as o, init_browserObservationSchemas as r, browserCompletenessSchema as s, browserTargetListSchema as t };