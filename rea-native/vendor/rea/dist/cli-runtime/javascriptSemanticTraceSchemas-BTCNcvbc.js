import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { digestSchema, evidenceSchema, init_digests, init_evidence, prefixedDigestSchema } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { JAVASCRIPT_SEMANTIC_NODE_KINDS, JAVASCRIPT_SEMANTIC_RELATIONS, init_javascriptSemanticGraphSchemas, javaScriptSemanticEvidenceContextSchema, javaScriptSemanticNodeSchema, javaScriptSemanticRelationSchema, javaScriptSemanticUnknownSchema } from "./javascriptApplicationAnalysis-HgMzVMQw.js";
import { z } from "zod";

//#region dist/domain/javascript/javascriptSemanticQuerySchemas.js
var semanticNodeIdSchema, literalValueSchema, literalSeedSchema, javaScriptSemanticQuerySeedSchema, javaScriptSemanticQueryInputSchema, javaScriptSemanticQueryResultSchema;
function init_javascriptSemanticQuerySchemas() {
	return (init_javascriptSemanticQuerySchemas = __esmMin((() => {
		init_javascriptSemanticGraphSchemas();
		init_digests();
		semanticNodeIdSchema = prefixedDigestSchema("jsrg_node");
		literalValueSchema = z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null()
		]);
		literalSeedSchema = z.strictObject({
			kind: z.literal("literal"),
			value: literalValueSchema
		});
		javaScriptSemanticQuerySeedSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("semantic-node"),
				node_id: semanticNodeIdSchema
			}),
			z.strictObject({
				kind: z.literal("application-node"),
				node_id: prefixedDigestSchema("jag_node")
			}),
			literalSeedSchema,
			z.strictObject({
				kind: z.literal("function"),
				fingerprint_sha256: digestSchema
			}),
			z.strictObject({
				kind: z.literal("property"),
				name: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("endpoint"),
				value: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("event"),
				name: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("boundary-field"),
				field: z.string().min(1)
			})
		]);
		javaScriptSemanticQueryInputSchema = z.strictObject({
			seed: javaScriptSemanticQuerySeedSchema,
			direction: z.enum([
				"backward-provenance",
				"forward-influence",
				"callers",
				"ownership"
			]),
			allowed_relations: z.array(z.enum(JAVASCRIPT_SEMANTIC_RELATIONS)).min(1).optional(),
			include_ambiguous_dynamic_edges: z.boolean().default(false),
			expected: z.strictObject({
				role: z.enum(["source", "sink"]),
				classes: z.array(z.enum(JAVASCRIPT_SEMANTIC_NODE_KINDS)).min(1)
			}).nullable().default(null)
		});
		javaScriptSemanticQueryResultSchema = z.strictObject({
			query_id: prefixedDigestSchema("jsrq"),
			source_graph_id: prefixedDigestSchema("jsrg"),
			seed: javaScriptSemanticQuerySeedSchema,
			direction: javaScriptSemanticQueryInputSchema.shape.direction,
			status: z.enum([
				"found",
				"no-match",
				"ambiguous",
				"partial",
				"unsupported"
			]),
			seed_node_ids: z.array(semanticNodeIdSchema),
			evidence_contexts: z.array(javaScriptSemanticEvidenceContextSchema),
			nodes: z.array(javaScriptSemanticNodeSchema),
			relations: z.array(javaScriptSemanticRelationSchema),
			unknowns: z.array(javaScriptSemanticUnknownSchema),
			expected_match_node_ids: z.array(semanticNodeIdSchema),
			summary: z.strictObject({
				total_seed_matches: z.number().int().min(0),
				traversed_nodes: z.number().int().min(0),
				traversed_relations: z.number().int().min(0),
				traversed_functions: z.number().int().min(0),
				traversed_modules: z.number().int().min(0),
				relevant_unknowns: z.number().int().min(0)
			}),
			coverage: z.strictObject({ status: z.enum([
				"complete",
				"partial",
				"unavailable"
			]) }),
			limitations: z.array(z.string().min(1))
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticTraceSchemas.js
var evidenceIdSchema, traceJavaScriptSemanticsInputSchema, javaScriptSemanticTraceResultSchema;
function init_javascriptSemanticTraceSchemas() {
	return (init_javascriptSemanticTraceSchemas = __esmMin((() => {
		init_evidence();
		init_javascriptSemanticQuerySchemas();
		init_digests();
		evidenceIdSchema = prefixedDigestSchema("ev");
		traceJavaScriptSemanticsInputSchema = z.strictObject({
			application: evidenceSchema,
			query: javaScriptSemanticQueryInputSchema
		});
		javaScriptSemanticTraceResultSchema = javaScriptSemanticQueryResultSchema.extend({
			source_evidence_id: evidenceIdSchema,
			evidence_links: z.array(evidenceIdSchema).length(1)
		});
	})))();
}

//#endregion
export { init_javascriptSemanticQuerySchemas, init_javascriptSemanticTraceSchemas, javaScriptSemanticQueryInputSchema, javaScriptSemanticQueryResultSchema, javaScriptSemanticTraceResultSchema, traceJavaScriptSemanticsInputSchema };