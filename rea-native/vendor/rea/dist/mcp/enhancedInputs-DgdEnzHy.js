import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as nativeValueTraceInputSchema, t as init_nativeValueTrace } from "./nativeValueTrace-DR9UE62L.js";
import { z } from "zod";

//#region dist/contracts/enhancedInputs.js
var traceLiteralInputSchema, enhancedInputSchemas;
function init_enhancedInputs() {
	return (init_enhancedInputs = __esmMin((() => {
		init_nativeValueTrace();
		traceLiteralInputSchema = z.strictObject({
			query: z.string().min(1),
			case_sensitive: z.boolean().default(false)
		});
		enhancedInputSchemas = {
			trace_native_values: nativeValueTraceInputSchema,
			inspect_native_dispatch_metadata: z.strictObject({ max_records: z.number().int().min(1).max(2e4).default(5e3) }),
			get_objc_classes: z.strictObject({ pattern: z.string().default("") }),
			get_objc_protocols: z.strictObject({}),
			batch_decompile: z.strictObject({ addresses: z.array(z.string().describe("A provider-normalized procedure address")).default([]) }),
			get_call_graph: z.strictObject({
				address: z.string().describe("A procedure symbol or address to resolve to its canonical entry"),
				direction: z.enum(["forward", "backward"]).default("forward")
			}),
			analyze_swift_types: z.strictObject({
				category: z.enum([
					"classes",
					"structs",
					"enums",
					"protocols",
					"extensions",
					"other"
				]).optional().describe("Limit categorized results to one Swift category; unresolved category observations remain in unclassified."),
				pattern: z.string().optional().describe("Case-sensitive literal filter applied to provider procedure names and their supporting Swift manglings.")
			}),
			find_xrefs_to_name: z.strictObject({ name: z.string() }),
			binary_overview: z.strictObject({}),
			analyze_function: z.strictObject({ procedure: z.string().describe("A procedure name or address") }),
			inspect_native_api: z.strictObject({ procedure: z.string().describe("A procedure name or address") }),
			trace_feature: traceLiteralInputSchema,
			trace_call_path: z.strictObject({
				start: z.string().describe("A starting procedure symbol or address"),
				goal: z.string().describe("An optional destination procedure symbol or address").optional(),
				direction: z.enum(["forward", "backward"]).default("forward")
			}),
			trace_native_ui_action: z.strictObject({
				action: z.string().min(1).describe("A unique compiled UI action selector, interface object ID, native symbol or exact function address"),
				max_depth: z.number().int().min(0).max(32).default(8),
				max_nodes: z.number().int().min(1).max(2e3).default(250),
				max_edges: z.number().int().min(1).max(5e3).default(500)
			})
		};
	})))();
}

//#endregion
export { init_enhancedInputs as n, enhancedInputSchemas as t };