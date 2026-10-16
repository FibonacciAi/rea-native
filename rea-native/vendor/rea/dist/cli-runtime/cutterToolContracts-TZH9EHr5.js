import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { CANONICAL_BASE64_PATTERN, IDENTIFIER_PATTERN, browserAllowedOriginsSchema, browserCompletenessSchema, browserEndpointSchema, browserNetworkContentSelectionSchema, browserObservationEndpointSchema, browserOriginSchema, browserScenarioCaptureSchema as browserScenarioCaptureSchema$1, browserScenarioCompletenessSchema, browserScenarioEventFamilySchema, browserVersionSchema, compareUnicodeCodePoints, compositeKey, digestCanonicalValue, digestSchema, emptyArraySchema, evidenceResultOf, evidenceSchema, init_browserCompleteness, init_browserNetworkEvidence, init_browserObservation, init_browserObservationSchemas, init_browserScenarioCapture, init_browserScenarioCaptureValues, init_canonicalDigest, init_digests, init_emptyArraySchema, init_evidence, init_localPath, init_stringPatterns, init_toolOutputSchemaPrimitives, init_unicodeCodePointOrder, init_webContentArtifact, init_webRuntime, inspectWebPageWithSourceInputSchema, localPathStringSchema, prefixedDigestSchema, requireOutputSchema, webPageInspectionSchema, webRuntimeLocationSchema, webRuntimeScopeSchema, webRuntimeSourceSchema, webRuntimeTargetSchema, webTextArtifactSchema } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { init_jsonValue, jsonObjectSchema, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { analysisDetailOutputSchemaOf, analysisDetailSchema, evidenceRecordFiltersSchema, evmInterfaceSchema, evmInterfaceSummaryViewResultSchema, init_analysisDetail, init_analysisView, init_evidenceRecordSummary, init_evmInterface, init_nativeCallObservation, init_nativeUiObservation, init_processTraceSpecification, init_toolEffects, init_toolOutputSchemaGroups, init_wasmArtifact, init_wasmInterface, inspectEvmInterfaceInputSchema, inspectWasmArtifactInputSchema, nativeCallObservationInputSchema, nativeOutputSchemas, nativeUiObservationInputSchema, nativeUiScenarioInputSchema, processTraceSpecificationSchema, toolContractMetadata, wasmArtifactSchema, wasmArtifactSummaryViewResultSchema, wasmInterfaceSchema } from "./toolOutputSchemaGroups-DRiYs1je.js";
import { analyzeJavaScriptApplicationInputSchema, init_javascriptApplicationAnalysis } from "./javascriptApplicationAnalysis-HgMzVMQw.js";
import { z } from "zod";
import { isAbsolute } from "node:path";

//#region dist/domain/captures/packetCapture.js
var argument, captureInputShape, withinPacketCaptureSelectorBudget, packetCaptureSelectorBudgetIssue, inspectPacketCaptureInputSchema, packetCaptureOptionsSchema, packetFieldsSchema, packetCaptureSchema;
function init_packetCapture() {
	return (init_packetCapture = __esmMin((() => {
		init_localPath();
		argument = z.string().min(1).max(8192).refine((value) => !value.includes("\0"), "NUL is not an argument character");
		captureInputShape = z.strictObject({
			path: localPathStringSchema.describe("Absolute local capture path"),
			fields: z.array(argument).max(1024).min(1).describe("TShark field names to return, e.g. ip.addr, usb.endpoint_address, btatt.opcode; frame.number is always included"),
			display_filter: argument.nullable().default(null).describe("Optional Wireshark display filter (-Y), applied within the read limit"),
			decode_as: z.array(argument).max(1024).default([]).describe("Explicit TShark decode-as selections, e.g. tcp.port==8888,http"),
			packet_limit: z.number().int().positive().max(2147483647).nullable().default(null).describe("Maximum input packets to read before filtering; omitted scans to EOF within resource limits"),
			two_pass: z.boolean().default(true).describe("Use two-pass analysis for fields requiring later packets; false requests a single pass"),
			match_offset: z.number().int().nonnegative().default(0).describe("Skip this many matching packets after filtering; default 0"),
			match_limit: z.number().int().positive().nullable().default(50).describe("Return at most this many matching packets after filtering; default 50. Null explicitly returns all remaining matches within producer resource limits.")
		});
		withinPacketCaptureSelectorBudget = (input) => {
			if (input.fields.length > 1024 || input.decode_as.length > 1024) return false;
			let bytes = 0;
			for (const selections of [input.fields, input.decode_as]) for (const value of selections) {
				bytes += Buffer.byteLength(value, "utf8") + 20;
				if (bytes > 32768) return false;
			}
			if (input.display_filter !== null) bytes += Buffer.byteLength(input.display_filter, "utf8") + 20;
			return bytes <= 32768;
		};
		packetCaptureSelectorBudgetIssue = { message: "Packet selectors exceed the 32 KiB encoded argument budget; reduce fields, decode-as rules or filter text." };
		inspectPacketCaptureInputSchema = captureInputShape.refine(withinPacketCaptureSelectorBudget, packetCaptureSelectorBudgetIssue);
		packetCaptureOptionsSchema = captureInputShape.omit({ path: true }).refine(withinPacketCaptureSelectorBudget, packetCaptureSelectorBudgetIssue);
		packetFieldsSchema = z.object({ "frame.number": z.tuple([z.string().regex(/^[1-9][0-9]*$/)]) }).catchall(z.array(z.string()));
		packetCaptureSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				bytes: z.number().int().nonnegative()
			}),
			selection: inspectPacketCaptureInputSchema,
			packets: z.array(packetFieldsSchema),
			output_window: z.strictObject({
				matching_packets: z.number().int().nonnegative().describe("Matches in the completed producer output within the indicated input read scope, not total capture packets"),
				returned_packets: z.number().int().nonnegative(),
				has_more: z.boolean()
			}),
			read_scope: z.enum(["to-eof", "up-to-input-packet-limit"]),
			diagnostics: z.string(),
			tool: z.strictObject({
				configured_path: z.string(),
				path: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				version_banner: z.string(),
				version_diagnostics: z.string(),
				arguments: z.array(z.string())
			}),
			configuration: z.literal("private-empty-personal-profile"),
			resource_limiter: z.strictObject({
				configured_path: z.string(),
				path: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				arguments: z.array(z.string())
			}),
			limits: z.strictObject({
				input_bytes: z.number().int().positive(),
				output_bytes: z.number().int().positive(),
				command_timeout_ms: z.number().int().positive(),
				address_space_bytes: z.number().int().nonnegative(),
				file_bytes: z.number().int().nonnegative(),
				cpu_seconds: z.number().int().nonnegative()
			}),
			hardware_acquisition: z.literal("not-performed")
		}).superRefine((report, context) => {
			const remaining = Math.max(report.output_window.matching_packets - report.selection.match_offset, 0);
			const expected = report.selection.match_limit === null ? remaining : Math.min(remaining, report.selection.match_limit);
			if (report.packets.length !== expected || report.output_window.returned_packets !== expected || report.output_window.has_more !== remaining > expected) context.addIssue({
				code: "custom",
				path: ["output_window"],
				message: "Returned packet window must match examined matches and caller-selected offset/limit"
			});
		});
	})))();
}

//#endregion
//#region dist/domain/captures/packetFields.js
var inspectPacketFieldsInputSchema, packetFieldRecordSchema, packetFieldsCatalogSchema;
function init_packetFields() {
	return (init_packetFields = __esmMin((() => {
		init_packetCapture();
		inspectPacketFieldsInputSchema = z.strictObject({
			kind: z.enum(["protocols", "fields"]).default("protocols").describe("Return protocol registrations or field definitions; defaults to protocols"),
			protocol: z.string().min(1).max(8192).nullable().default(null).describe("Exact protocol abbreviation; selects that protocol or its registered fields"),
			query: z.string().max(8192).default("").describe("Case-insensitive literal substring in name, abbreviation or field description"),
			offset: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).default(0).describe("Number of matching records to skip; defaults to 0"),
			limit: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).nullable().default(50).describe("Maximum matches returned; null requests all remaining within the record budget")
		});
		packetFieldRecordSchema = z.strictObject({
			source_line: z.number().int().positive(),
			kind: z.enum(["protocol", "field"]),
			name: z.string(),
			abbreviation: z.string(),
			field_type: z.string().nullable(),
			parent_protocol: z.string().nullable(),
			display_base: z.string().nullable(),
			bitmask: z.string().nullable(),
			description: z.string().nullable()
		});
		packetFieldsCatalogSchema = z.strictObject({
			selection: inspectPacketFieldsInputSchema,
			records: z.array(packetFieldRecordSchema),
			output_window: z.strictObject({
				examined: z.number().int().nonnegative(),
				matching: z.number().int().nonnegative(),
				returned: z.number().int().nonnegative(),
				has_more: z.boolean()
			}),
			diagnostics: z.string(),
			tool: packetCaptureSchema.shape.tool,
			resource_limiter: packetCaptureSchema.shape.resource_limiter,
			limits: packetCaptureSchema.shape.limits.extend({ record_budget_bytes: z.literal(8388608) }),
			configuration: z.literal("private-empty-personal-profile"),
			hardware_acquisition: z.literal("not-performed")
		}).superRefine((report, context) => {
			const w = report.output_window;
			const remaining = Math.max(0, w.matching - report.selection.offset);
			const expected = Math.min(remaining, report.selection.limit ?? remaining);
			if (w.matching > w.examined || w.returned !== expected || report.records.length !== expected || w.has_more !== remaining > expected || report.records.some((row) => row.kind !== (report.selection.kind === "protocols" ? "protocol" : "field"))) context.addIssue({
				code: "custom",
				path: ["output_window"],
				message: "Field discovery coverage must match the selected page and record kind"
			});
		});
	})))();
}

//#endregion
//#region dist/domain/signals/annotationTextWindow.js
var windowAnnotationText;
function init_annotationTextWindow() {
	return (init_annotationTextWindow = __esmMin((() => {
		windowAnnotationText = (text, offset, limit) => {
			let total = 0;
			let returned = 0;
			let start = text.length;
			let end = text.length;
			for (let from = 0; from < text.length;) {
				const newline = text.indexOf("\n", from);
				const next = newline < 0 ? text.length : newline + 1;
				if (total === offset) start = from;
				if (total >= offset && (limit === null || returned < limit)) {
					end = next;
					returned++;
				}
				total++;
				from = next;
			}
			return {
				annotations_text: start === 0 && end === text.length ? text : Buffer.from(text.slice(start, end), "utf16le").toString("utf16le"),
				output_window: {
					total_lines: total,
					returned_lines: returned,
					has_more: Math.min(offset, total) + returned < total
				}
			};
		};
	})))();
}

//#endregion
//#region dist/domain/signals/signalRecording.js
var selection$1, signalInputShape, withinSignalRecordingSelectorBudget, signalRecordingSelectorBudgetIssue, decodeSignalRecordingInputSchema, signalRecordingOptionsSchema, signalRecordingSchema;
function init_signalRecording() {
	return (init_signalRecording = __esmMin((() => {
		init_localPath();
		init_annotationTextWindow();
		selection$1 = z.string().min(1).max(8192).refine((value) => !value.includes("\0"), "NUL is not an argument character");
		signalInputShape = z.strictObject({
			path: localPathStringSchema.describe("Absolute local recording path"),
			decoders: selection$1.describe("sigrok decoder stack, options and channel assignments, e.g. uart:rx=RX:baudrate=9600"),
			input_format: selection$1.nullable().default(null).describe("Explicit sigrok input format and options; omitted means autodetection"),
			annotations: selection$1.nullable().default(null).describe("Optional annotation selection, e.g. uart=rx-data"),
			line_offset: z.number().int().nonnegative().default(0).describe("Skip this many literal LF-separated output lines; default 0"),
			line_limit: z.number().int().positive().nullable().default(50).describe("Return at most this many output lines; default 50. Null explicitly returns all remaining lines within producer limits. Lines are not annotation counts.")
		});
		withinSignalRecordingSelectorBudget = (input) => {
			let bytes = 0;
			for (const [value, prefix] of [
				[input.decoders, "--protocol-decoders="],
				[input.input_format, "--input-format="],
				[input.annotations, "--protocol-decoder-annotations="]
			]) if (value !== null) bytes += Buffer.byteLength(prefix, "utf8") + Buffer.byteLength(value, "utf8") + 9;
			return bytes <= 32768;
		};
		signalRecordingSelectorBudgetIssue = { message: "Signal selectors exceed the 32 KiB encoded argument budget; reduce decoder, format or annotation selections." };
		decodeSignalRecordingInputSchema = signalInputShape.refine(withinSignalRecordingSelectorBudget, signalRecordingSelectorBudgetIssue);
		signalRecordingOptionsSchema = signalInputShape.omit({ path: true }).refine(withinSignalRecordingSelectorBudget, signalRecordingSelectorBudgetIssue);
		signalRecordingSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				bytes: z.number().int().nonnegative()
			}),
			selection: decodeSignalRecordingInputSchema,
			annotations_text: z.string().describe("Selected literal lines of sigrok display output with unchanged sample ranges and line endings; not a lossless binary protocol representation"),
			output_window: z.strictObject({
				total_lines: z.number().int().nonnegative().describe("Literal LF-separated lines in completed producer output, not annotation or sample counts"),
				returned_lines: z.number().int().nonnegative(),
				has_more: z.boolean()
			}),
			diagnostics: z.string(),
			tool: z.strictObject({
				configured_path: z.string(),
				path: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				version_banner: z.string(),
				version_diagnostics: z.string(),
				arguments: z.array(z.string())
			}),
			resource_limiter: z.strictObject({
				configured_path: z.string(),
				path: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				arguments: z.array(z.string())
			}),
			limits: z.strictObject({
				input_bytes: z.number().int().positive(),
				output_bytes: z.number().int().positive(),
				command_timeout_ms: z.number().int().positive(),
				address_space_bytes: z.number().int().nonnegative(),
				file_bytes: z.number().int().nonnegative(),
				cpu_seconds: z.number().int().nonnegative()
			}),
			hardware_acquisition: z.literal("not-performed")
		}).superRefine((report, context) => {
			const remaining = Math.max(report.output_window.total_lines - report.selection.line_offset, 0);
			const expected = report.selection.line_limit === null ? remaining : Math.min(remaining, report.selection.line_limit);
			if (report.output_window.returned_lines !== expected || windowAnnotationText(report.annotations_text, 0, null).output_window.total_lines !== expected || report.output_window.has_more !== remaining > expected) context.addIssue({
				code: "custom",
				path: ["output_window"],
				message: "Output text and window must agree with examined lines and selected offset/limit"
			});
		});
	})))();
}

//#endregion
//#region dist/domain/signals/signalDecoders.js
var inspectSignalDecodersInputSchema, signalDecodersSchema;
function init_signalDecoders() {
	return (init_signalDecoders = __esmMin((() => {
		init_signalRecording();
		inspectSignalDecodersInputSchema = z.strictObject({
			decoder: z.string().regex(/^[a-zA-Z0-9_+\x2d]+$/u).max(256).nullable().default(null).describe("Exact installed decoder ID for help; null searches the decoder catalog"),
			query: z.string().max(8192).default("").describe("Case-insensitive literal substring in decoder ID/name or help lines; empty selects all"),
			offset: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).default(0).describe("Number of matching decoders or help lines to skip; defaults to 0"),
			limit: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).nullable().default(50).describe("Maximum matching decoders or help lines returned; null requests all remaining")
		});
		signalDecodersSchema = z.strictObject({
			selection: inspectSignalDecodersInputSchema,
			decoders: z.array(z.strictObject({
				id: z.string(),
				name: z.string()
			})),
			help_lines: z.array(z.strictObject({
				line_number: z.number().int().positive(),
				text: z.string()
			})),
			output_window: z.strictObject({
				unit: z.enum(["decoders", "help-lines"]),
				examined: z.number().int().nonnegative(),
				matching: z.number().int().nonnegative(),
				returned: z.number().int().nonnegative(),
				has_more: z.boolean()
			}),
			diagnostics: z.string(),
			tool: signalRecordingSchema.shape.tool,
			resource_limiter: signalRecordingSchema.shape.resource_limiter,
			limits: signalRecordingSchema.shape.limits,
			hardware_acquisition: z.literal("not-performed")
		}).superRefine((report, context) => {
			const w = report.output_window;
			const catalog = report.selection.decoder === null;
			const remaining = Math.max(0, w.matching - report.selection.offset);
			const expected = Math.min(remaining, report.selection.limit ?? remaining);
			if (w.unit !== (catalog ? "decoders" : "help-lines") || w.matching > w.examined || w.returned !== expected || (catalog ? report.decoders : report.help_lines).length !== expected || (catalog ? report.help_lines : report.decoders).length !== 0 || w.has_more !== remaining > expected) context.addIssue({
				code: "custom",
				path: ["output_window"],
				message: "Discovery coverage must match the selected page and result kind"
			});
		});
	})))();
}

//#endregion
//#region dist/contracts/evidenceInputContracts.js
var retainedEvidenceReferenceSchema, evidenceInputSchema;
function init_evidenceInputContracts() {
	return (init_evidenceInputContracts = __esmMin((() => {
		init_evidence();
		init_digests();
		retainedEvidenceReferenceSchema = z.strictObject({
			kind: z.literal("retained-evidence"),
			evidence_id: prefixedDigestSchema("ev")
		});
		evidenceInputSchema = z.union([evidenceSchema, retainedEvidenceReferenceSchema]);
	})))();
}

//#endregion
//#region dist/contracts/wasm/wasmComparisonContracts.js
var compareWasmInterfacesInputSchema, identity$1, wasmInterfaceComparisonSchema, COMPARE_WASM_INTERFACES_CONTRACT;
function init_wasmComparisonContracts() {
	return (init_wasmComparisonContracts = __esmMin((() => {
		init_toolOutputSchemaPrimitives();
		init_evidenceInputContracts();
		init_wasmInterface();
		init_toolEffects();
		compareWasmInterfacesInputSchema = z.strictObject({
			left: evidenceInputSchema.describe("Exact complete inspect_wasm_artifact Evidence or retained session reference"),
			right: evidenceInputSchema.describe("Exact complete inspect_wasm_artifact Evidence or retained session reference"),
			scope: z.enum([
				"imports",
				"exports",
				"both"
			]).describe("Explicit interface selection; static equality does not establish runtime compatibility")
		});
		identity$1 = z.object({
			evidence_id: z.string(),
			artifact: z.object({
				path: z.string(),
				sha256: z.string(),
				bytes: z.number().int().nonnegative()
			})
		});
		wasmInterfaceComparisonSchema = z.object({
			left: identity$1,
			right: identity$1,
			scope: z.enum([
				"imports",
				"exports",
				"both"
			]),
			coverage: z.enum([
				"complete-within-inputs",
				"partial",
				"unknown"
			]),
			changes: z.array(z.object({
				direction: z.enum(["import", "export"]),
				module: z.string().nullable(),
				name: z.string(),
				state: z.enum([
					"added",
					"removed",
					"changed",
					"unchanged",
					"unknown"
				]),
				left: wasmInterfaceSchema.shape.entries,
				right: wasmInterfaceSchema.shape.entries,
				reason: z.string().nullable()
			})),
			summary: z.object({
				added: z.number(),
				removed: z.number(),
				changed: z.number(),
				unchanged: z.number(),
				unknown: z.number()
			}),
			limitations: z.array(z.string())
		});
		COMPARE_WASM_INTERFACES_CONTRACT = {
			name: "compare_wasm_interfaces",
			...toolContractMetadata("compare_wasm_interfaces"),
			kind: "application",
			description: "Compare typed core WASM import/export names, kinds and exact signatures from two authenticated inspect_wasm_artifact Evidence records. Select imports, exports or both explicitly. Retained references resolve only in the current session; CLI accepts portable inline Evidence. Duplicate names, unsupported types and missing historical interface facets remain unknown. Preserve original module digests and every occurrence; no source acquisition, module execution or runtime-compatibility inference.",
			inputSchema: compareWasmInterfacesInputSchema,
			outputSchema: evidenceResultOf(wasmInterfaceComparisonSchema),
			examples: []
		};
	})))();
}

//#endregion
//#region dist/contracts/wasm/wasmToolContracts.js
var wasmArtifactInspectionInputSchema, INSPECT_WASM_ARTIFACT_CONTRACT, WASM_TOOL_CONTRACTS;
function init_wasmToolContracts() {
	return (init_wasmToolContracts = __esmMin((() => {
		init_wasmComparisonContracts();
		init_wasmArtifact();
		init_toolEffects();
		init_analysisDetail();
		init_analysisView();
		wasmArtifactInspectionInputSchema = inspectWasmArtifactInputSchema.extend({ detail: analysisDetailSchema.unwrap().optional() });
		INSPECT_WASM_ARTIFACT_CONTRACT = {
			name: "inspect_wasm_artifact",
			...toolContractMetadata("inspect_wasm_artifact"),
			kind: "artifact-provider",
			description: "Validate an explicit local WASM artifact with caller-supplied WABT 1.0.42. Omitted or complete detail returns exact byte SHA-256, sections, upstream import/export WAT forms and decoded WAT inline as Evidence. For counts, validation and WAT identity without WAT text, pass detail: \"summary\" on this first call; it retains the complete original Evidence and returns the same typed summary as inspect_analysis_view, avoiding oversized complete delivery. Read exact imports/exports or WAT pages with inspect_analysis_view using normalized_result.parent_evidence_id. Delivery selection does not change analysis, provider inputs or source identity. Optionally associate selected JavaScript glue literals with explicit local candidates while preserving ambiguous URL/basename matches. Configure absolute REA_WABT_BIN_DIRECTORY. No installation, implicit fetch, WASM execution or original-source claim.",
			inputSchema: wasmArtifactInspectionInputSchema,
			outputSchema: analysisDetailOutputSchemaOf(wasmArtifactSchema, wasmArtifactSummaryViewResultSchema),
			examples: [{
				title: "Inspect a selected local WASM module",
				input: {
					path: "/artifacts/module.wasm",
					glue_paths: [],
					candidate_paths: []
				}
			}]
		};
		WASM_TOOL_CONTRACTS = [INSPECT_WASM_ARTIFACT_CONTRACT, COMPARE_WASM_INTERFACES_CONTRACT];
	})))();
}

//#endregion
//#region dist/contracts/evm/evmToolContracts.js
var evmInterfaceInspectionInputSchema, INSPECT_EVM_INTERFACE_CONTRACT, EVM_TOOL_CONTRACTS;
function init_evmToolContracts() {
	return (init_evmToolContracts = __esmMin((() => {
		init_evmInterface();
		init_toolEffects();
		init_analysisDetail();
		init_analysisView();
		evmInterfaceInspectionInputSchema = inspectEvmInterfaceInputSchema.extend({ detail: analysisDetailSchema.unwrap().optional() });
		INSPECT_EVM_INTERFACE_CONTRACT = {
			name: "inspect_evm_interface",
			...toolContractMetadata("inspect_evm_interface"),
			kind: "artifact-provider",
			description: "Inspect explicit local flat EVM bytecode without target execution or chain/RPC access. Select raw or hex encoding explicitly. Omitted or complete detail returns original carrier and decoded identities, full bytecode and all inferred interface candidates inline. For all inferred selectors/offsets/arguments/mutability and identities without bytecode hex or duplicated stdout, select detail: \"summary\" on this first call: it retains unchanged complete Evidence and returns a distinct linked inspect_analysis_view summary. Read original function rows or bytecode_hex/stdout/stderr text pages using view kind evm and normalized_result.parent_evidence_id; original complete Evidence remains accessible. Bytecode kind, hardfork, deployed authenticity and discovery completeness stay unknown; summary coverage covers only producer-returned candidates. Unchanged bundled EVMole 0.9.3/WASM in an owned bounded worker is initially real-verified on Linux x64; EOF-style EF00 containers are unsupported. No signature lookup, wallet action or transaction broadcast.",
			inputSchema: evmInterfaceInspectionInputSchema,
			outputSchema: analysisDetailOutputSchemaOf(evmInterfaceSchema, evmInterfaceSummaryViewResultSchema),
			examples: [{
				title: "Inspect a local runtime bytecode hex carrier",
				input: {
					path: "/artifacts/runtime.hex",
					encoding: "hex"
				}
			}, {
				title: "Read every inferred interface candidate without bytecode text",
				input: {
					path: "/artifacts/runtime.hex",
					encoding: "hex",
					detail: "summary"
				}
			}]
		};
		EVM_TOOL_CONTRACTS = [INSPECT_EVM_INTERFACE_CONTRACT];
	})))();
}

//#endregion
//#region dist/domain/go/goBinary.js
var sourceRangeSchema, moduleIdentitySchema, goModuleSchema, goModuleMetadataSchema, inspectGoBinaryInputSchema, goBuildInfoSchema, goBinarySchema;
function init_goBinary() {
	return (init_goBinary = __esmMin((() => {
		init_digests();
		init_localPath();
		init_stringPatterns();
		sourceRangeSchema = z.strictObject({
			offset: z.number().int().nonnegative(),
			bytes: z.number().int().nonnegative()
		});
		moduleIdentitySchema = z.strictObject({
			path: z.string(),
			version: z.string(),
			sum: z.string().nullable()
		});
		goModuleSchema = moduleIdentitySchema.extend({ replacement: moduleIdentitySchema.nullable() });
		goModuleMetadataSchema = z.strictObject({
			path: z.string().nullable(),
			main: goModuleSchema.nullable(),
			dependencies: z.array(goModuleSchema),
			settings: z.array(z.strictObject({
				key: z.string(),
				value: z.string()
			})),
			unparsed_lines: z.array(z.string()),
			unparsed_line_bytes_base64: z.array(z.string().regex(CANONICAL_BASE64_PATTERN)),
			complete: z.boolean()
		});
		inspectGoBinaryInputSchema = z.strictObject({ path: localPathStringSchema.describe("Absolute filesystem path to the selected executable or library") });
		goBuildInfoSchema = z.strictObject({
			header_offset: z.number().int().nonnegative(),
			encoding: z.enum(["inline", "pointer"]),
			go_version: z.string().nullable(),
			go_version_bytes_base64: z.string().regex(CANONICAL_BASE64_PATTERN),
			module_text: z.string().nullable(),
			module_bytes_base64: z.string().regex(CANONICAL_BASE64_PATTERN),
			version_location: sourceRangeSchema,
			module_location: sourceRangeSchema,
			module: goModuleMetadataSchema
		});
		goBinarySchema = z.strictObject({
			artifact: z.strictObject({
				path: localPathStringSchema,
				sha256: digestSchema,
				bytes: z.number().int().nonnegative()
			}),
			format: z.enum([
				"elf",
				"pe",
				"macho"
			]),
			architecture: z.string(),
			bits: z.union([z.literal(32), z.literal(64)]),
			byte_order: z.enum(["little", "big"]),
			build_info: goBuildInfoSchema.nullable(),
			limitations: z.array(z.string())
		}).superRefine((report, context) => {
			const info = report.build_info;
			if (info === null) return;
			if (info.header_offset > report.artifact.bytes - 32) context.addIssue({
				code: "custom",
				path: ["build_info", "header_offset"],
				message: "Build-info header is outside the selected artifact."
			});
			for (const field of ["version_location", "module_location"]) {
				const range = info[field];
				if (range.offset > report.artifact.bytes || range.bytes > report.artifact.bytes - range.offset) context.addIssue({
					code: "custom",
					path: ["build_info", field],
					message: "Build-info source range is outside the selected artifact."
				});
			}
			for (const [field, range, description] of [[
				"go_version_bytes_base64",
				info.version_location,
				"compiler"
			], [
				"module_bytes_base64",
				info.module_location,
				"module"
			]]) {
				const encoded = info[field];
				const padding = encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0;
				if (encoded.length / 4 * 3 - padding !== range.bytes) context.addIssue({
					code: "custom",
					path: ["build_info", field],
					message: `Encoded ${description} bytes do not match their reported source length.`
				});
			}
		});
	})))();
}

//#endregion
//#region dist/domain/rust/rustBinary.js
var RUST_AUDITABLE_FORMAT_VERSIONS, index$1, rustcHash, rustPackageSchema, dependencyEdgeSchema, rustAuditableMetadataSchema, rustcCommitSchema, inspectRustBinaryInputSchema, rustBinarySchema, issue, inside, checkSection, checkPackages, cyclicDependencyIndices, dependencyPostorder, reversedDependencyEdges, dependencyComponent, dependencyComponentInCycle, checkRustc;
function init_rustBinary() {
	return (init_rustBinary = __esmMin((() => {
		init_digests();
		init_localPath();
		RUST_AUDITABLE_FORMAT_VERSIONS = [
			0,
			1,
			8
		];
		index$1 = z.number().int().nonnegative();
		rustcHash = z.string().regex(/^[0-9a-f]{40}$/u);
		rustPackageSchema = z.strictObject({
			name: z.string().min(1),
			version: z.string().min(1),
			source: z.string().min(1),
			kind: z.enum(["runtime", "build"]).nullable(),
			dependencies: z.array(index$1),
			root: z.boolean()
		});
		dependencyEdgeSchema = z.strictObject({
			from_index: index$1,
			to_index: index$1
		});
		rustAuditableMetadataSchema = z.strictObject({
			section_name: z.enum([".dep-v0", "__DATA,.dep-v0"]),
			file_offset: index$1,
			section_bytes: z.number().int().positive(),
			compressed_bytes: z.number().int().positive(),
			uncompressed_bytes: z.number().int().positive(),
			/** Original embedded revision; null means the source omitted the field. */
			format_version: z.number().int().nonnegative().max(4294967295).nullable(),
			packages: z.array(rustPackageSchema),
			root_package_index: index$1.nullable(),
			dependency_edges: z.array(dependencyEdgeSchema),
			cyclic_dependency_indices: z.array(index$1)
		});
		rustcCommitSchema = z.strictObject({
			evidence_kind: z.literal("inferred"),
			hashes: z.array(z.strictObject({
				hash: rustcHash,
				file_offset: index$1
			})).min(1)
		});
		inspectRustBinaryInputSchema = z.strictObject({ path: localPathStringSchema.describe("Absolute filesystem path to the selected executable or library") });
		rustBinarySchema = z.strictObject({
			artifact: z.strictObject({
				path: localPathStringSchema,
				sha256: digestSchema,
				bytes: index$1
			}),
			format: z.enum([
				"elf",
				"pe",
				"macho"
			]),
			architecture: z.string(),
			bits: z.union([z.literal(32), z.literal(64)]),
			byte_order: z.enum(["little", "big"]),
			auditable_metadata: rustAuditableMetadataSchema.nullable(),
			rustc_commit: rustcCommitSchema.nullable(),
			limitations: z.array(z.string())
		}).superRefine((report, context) => {
			const metadata = report.auditable_metadata;
			if (metadata !== null) {
				checkSection(report.artifact.bytes, metadata, context);
				checkPackages(metadata, context);
			}
			checkRustc(report.artifact.bytes, report.rustc_commit, context);
		});
		issue = (context, path, message) => {
			context.addIssue({
				code: "custom",
				path,
				message
			});
		};
		inside = (fileBytes, offset, size) => offset <= fileBytes && size <= fileBytes - offset;
		checkSection = (fileBytes, metadata, context) => {
			if (!inside(fileBytes, metadata.file_offset, metadata.section_bytes) || metadata.compressed_bytes !== metadata.section_bytes) issue(context, ["auditable_metadata", "file_offset"], "Dependency section range is outside the selected artifact or disagrees with its compressed size.");
		};
		checkPackages = (metadata, context) => {
			const roots = [];
			const edgesByPackage = new Map();
			for (const [position, edge] of metadata.dependency_edges.entries()) {
				if (edge.from_index >= metadata.packages.length || edge.to_index >= metadata.packages.length) {
					issue(context, [
						"auditable_metadata",
						"dependency_edges",
						position
					], "Dependency edge index is outside the package list.");
					continue;
				}
				const grouped = edgesByPackage.get(edge.from_index);
				if (grouped === undefined) edgesByPackage.set(edge.from_index, [edge]);
				else grouped.push(edge);
			}
			for (const [packageIndex, pkg] of metadata.packages.entries()) {
				if (pkg.root) roots.push(packageIndex);
				const edges = edgesByPackage.get(packageIndex) ?? [];
				if (edges.length !== pkg.dependencies.length || edges.some((edge, index) => edge.to_index !== pkg.dependencies[index])) issue(context, ["auditable_metadata", "dependency_edges"], "Dependency edges do not match package dependency indices.");
				if (pkg.dependencies.some((target) => target >= metadata.packages.length)) issue(context, [
					"auditable_metadata",
					"packages",
					packageIndex,
					"dependencies"
				], "Dependency index is outside the package list.");
			}
			const root = metadata.root_package_index;
			if (root === null ? roots.length !== 0 : roots.length !== 1 || roots[0] !== root) issue(context, ["auditable_metadata", "root_package_index"], "Root package index does not match packages marked root.");
			const cycles = cyclicDependencyIndices(metadata.packages);
			if (cycles.length !== metadata.cyclic_dependency_indices.length || cycles.some((index, position) => metadata.cyclic_dependency_indices[position] !== index)) issue(context, ["auditable_metadata", "cyclic_dependency_indices"], "Cyclic dependency indices do not match the cycles in package dependencies.");
		};
		cyclicDependencyIndices = (packages) => {
			const edges = packages.map((pkg) => pkg.dependencies);
			const order = dependencyPostorder(edges);
			const reversed = reversedDependencyEdges(edges);
			const seen = new Uint8Array(edges.length);
			const cyclic = new Set();
			for (let cursor = order.length - 1; cursor >= 0; cursor -= 1) {
				const start = order[cursor];
				if (start === undefined || seen[start] === 1) continue;
				const component = dependencyComponent(start, reversed, seen);
				if (dependencyComponentInCycle(component, edges)) for (const index of component) cyclic.add(index);
			}
			return [...cyclic].sort((left, right) => left - right);
		};
		dependencyPostorder = (edges) => {
			const seen = new Uint8Array(edges.length);
			const order = [];
			for (let start = 0; start < edges.length; start += 1) {
				if (seen[start] === 1) continue;
				const stack = [{
					index: start,
					edge: 0
				}];
				seen[start] = 1;
				while (stack.length > 0) {
					const frame = stack[stack.length - 1];
					if (frame === undefined) break;
					const next = edges[frame.index]?.[frame.edge];
					if (next === undefined) {
						stack.pop();
						order.push(frame.index);
						continue;
					}
					frame.edge += 1;
					if (seen[next] === 0) {
						seen[next] = 1;
						stack.push({
							index: next,
							edge: 0
						});
					}
				}
			}
			return order;
		};
		reversedDependencyEdges = (edges) => {
			const reversed = Array.from({ length: edges.length }, () => []);
			for (let from = 0; from < edges.length; from += 1) for (const to of edges[from] ?? []) reversed[to]?.push(from);
			return reversed;
		};
		dependencyComponent = (start, reversed, seen) => {
			const component = [];
			const stack = [start];
			seen[start] = 1;
			while (stack.length > 0) {
				const index = stack.pop();
				if (index === undefined) break;
				component.push(index);
				for (const next of reversed[index] ?? []) {
					if (seen[next] === 0) {
						seen[next] = 1;
						stack.push(next);
					}
				}
			}
			return component;
		};
		dependencyComponentInCycle = (component, edges) => {
			if (component.length > 1) return true;
			const only = component[0];
			return only !== undefined && (edges[only]?.includes(only) ?? false);
		};
		checkRustc = (fileBytes, commit, context) => {
			if (commit === null) return;
			const seen = new Set();
			for (const [position, entry] of commit.hashes.entries()) {
				if (seen.has(entry.hash) || !inside(fileBytes, entry.file_offset, 48)) issue(context, [
					"rustc_commit",
					"hashes",
					position
				], "rustc path hash is duplicated or its file offset is outside the artifact.");
				seen.add(entry.hash);
			}
		};
	})))();
}

//#endregion
//#region dist/domain/sqlite/sqliteDatabase.js
var SQLITE_PROVIDER_IDENTITY, SQLITE_ROW_LIMIT_DEFAULT, nonnegative, hex$1, encoding, artifactSchema, inspectSqliteDatabaseInputSchema, sqliteValueSchema, sqliteDatabaseSchema, sqliteInspectionParameters, sqliteSchemaScope;
function init_sqliteDatabase() {
	return (init_sqliteDatabase = __esmMin((() => {
		init_localPath();
		SQLITE_PROVIDER_IDENTITY = {
			id: "sqlite",
			name: "REA SQLite database inspector",
			version: null
		};
		SQLITE_ROW_LIMIT_DEFAULT = 20;
		nonnegative = z.number().int().nonnegative();
		hex$1 = z.string().regex(/^(?:[0-9a-f]{2})*$/);
		encoding = z.enum([
			"UTF-8",
			"UTF-16le",
			"UTF-16be"
		]);
		artifactSchema = z.strictObject({
			path: z.string().min(1),
			sha256: z.string().regex(/^[0-9a-f]{64}$/),
			bytes: nonnegative
		});
		inspectSqliteDatabaseInputSchema = z.strictObject({
			path: localPathStringSchema.describe("Absolute path to an offline SQLite database snapshot"),
			table: z.string().optional().describe("Exact ordinary table name; views and virtual/shadow tables are not executed"),
			columns: z.array(z.string()).min(1).optional().describe("Exact row columns in caller-selected order; requires table. Omit to sample all visible columns."),
			schema_scope: z.enum([
				"inventory",
				"selected_table",
				"database"
			]).optional().describe("Default: compact inventory without a table, or detailed selected-table schema with a table. Database explicitly expands all stored declarations and supported columns."),
			row_limit: z.number().int().min(1).optional().describe("Selected-table sample size, default 20; subject to byte and worker resource limits")
		}).superRefine((input, context) => {
			if (input.row_limit !== undefined && input.table === undefined) context.addIssue({
				code: "custom",
				path: ["row_limit"],
				message: "row_limit requires an explicit table selection"
			});
			if (input.columns !== undefined && input.table === undefined) context.addIssue({
				code: "custom",
				path: ["columns"],
				message: "columns requires an explicit table selection"
			});
			if (input.schema_scope === "selected_table" && input.table === undefined) context.addIssue({
				code: "custom",
				path: ["schema_scope"],
				message: "selected_table schema scope requires table"
			});
		}).meta({
			dependentRequired: {
				row_limit: ["table"],
				columns: ["table"]
			},
			if: {
				properties: { schema_scope: { const: "selected_table" } },
				required: ["schema_scope"]
			},
			then: { required: ["table"] }
		});
		sqliteValueSchema = z.discriminatedUnion("type", [
			z.strictObject({ type: z.literal("null") }),
			z.strictObject({
				type: z.literal("integer"),
				value: z.string().regex(/^-?(?:0|[1-9][0-9]*)$/)
			}),
			z.strictObject({
				type: z.literal("real"),
				value: z.union([z.number(), z.enum([
					"Infinity",
					"-Infinity",
					"-0"
				])])
			}),
			z.strictObject({
				type: z.literal("text"),
				value: z.string(),
				bytes_hex: hex$1,
				encoding
			}),
			z.strictObject({
				type: z.literal("blob"),
				hex: hex$1
			})
		]);
		sqliteDatabaseSchema = z.strictObject({
			artifact: artifactSchema,
			wal: artifactSchema.nullable(),
			engine: z.strictObject({
				name: z.literal("SQLite"),
				version: z.string().min(1)
			}),
			database_encoding: encoding,
			schema: z.strictObject({
				scope: z.enum([
					"inventory",
					"selected_table",
					"database"
				]),
				completeness: z.literal("complete").describe("Complete within the indicated schema scope; inventory omits declarations and column details"),
				tables: z.array(z.strictObject({
					name: z.string(),
					sql: z.string().nullable().optional(),
					root_page: nonnegative,
					kind: z.enum([
						"table",
						"virtual",
						"shadow",
						"unknown"
					]).describe("Unknown means a possible shadow table of an unresolved virtual table; its rows cannot be inspected"),
					without_rowid: z.boolean(),
					strict: z.boolean(),
					column_count: nonnegative.nullable(),
					columns_completeness: z.enum([
						"complete",
						"unsupported",
						"not_requested"
					]),
					columns: z.array(z.strictObject({
						cid: nonnegative,
						name: z.string(),
						declared_type: z.string(),
						not_null: z.boolean(),
						default_sql: z.string().nullable(),
						primary_key_position: nonnegative,
						hidden: z.union([
							z.literal(0),
							z.literal(1),
							z.literal(2),
							z.literal(3)
						])
					}))
				})),
				indexes: z.array(z.strictObject({
					name: z.string(),
					table: z.string(),
					sql: z.string().nullable().optional(),
					root_page: nonnegative
				})),
				views: z.array(z.strictObject({
					name: z.string(),
					sql: z.string().nullable().optional()
				})),
				triggers: z.array(z.strictObject({
					name: z.string(),
					table: z.string(),
					sql: z.string().nullable().optional()
				}))
			}),
			rows: z.strictObject({
				table: z.string(),
				columns: z.array(z.string()),
				values: z.array(z.array(sqliteValueSchema)),
				row_limit: z.number().int().min(1),
				returned_rows: nonnegative,
				truncated: z.boolean(),
				order: z.literal("unspecified")
			}).nullable(),
			limitations: z.array(z.string())
		}).superRefine((report, context) => {
			const rows = report.rows;
			if (rows !== null && (rows.returned_rows !== rows.values.length || rows.returned_rows > rows.row_limit || rows.values.some((row) => row.length !== rows.columns.length))) context.addIssue({
				code: "custom",
				path: ["rows"],
				message: "Selected row counts and column dimensions must match the retained values"
			});
		});
		sqliteInspectionParameters = (input) => ({
			path: input.path,
			...input.table === undefined ? {} : { table: input.table },
			...input.columns === undefined ? {} : { columns: input.columns },
			...input.schema_scope === undefined ? {} : { schema_scope: input.schema_scope },
			...input.row_limit === undefined ? {} : { row_limit: input.row_limit }
		});
		sqliteSchemaScope = (input) => input.schema_scope ?? (input.table === undefined ? "inventory" : "selected_table");
	})))();
}

//#endregion
//#region dist/contracts/sessionToolSchemas.js
var getEvidenceBundleInputSchema, navigationContextInputSchema, addressContextInputSchema, importEvidenceBundleInputSchema, processComparisonInputSchema, listUnknownsInputSchema, verifyUnknownResolutionInputSchema;
function init_sessionToolSchemas() {
	return (init_sessionToolSchemas = __esmMin((() => {
		init_localPath();
		init_processTraceSpecification();
		init_evidence();
		init_digests();
		init_evidenceRecordSummary();
		getEvidenceBundleInputSchema = z.strictObject({
			detail: z.enum(["complete", "summary"]).default("complete"),
			filters: evidenceRecordFiltersSchema.optional()
		});
		navigationContextInputSchema = z.strictObject({ document: z.string().min(1).optional() });
		addressContextInputSchema = z.strictObject({
			address: z.string().min(1),
			document: z.string().min(1).optional()
		});
		importEvidenceBundleInputSchema = z.strictObject({ path: localPathStringSchema.refine(isAbsolute, { message: "path must be an absolute local filesystem path (for example /tmp/evidence.json or C:\\rea\\evidence.json)" }).describe("Absolute local filesystem path for the evidence bundle to import; relative paths are rejected.") });
		processComparisonInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema,
			trace_spec: processTraceSpecificationSchema.optional(),
			max_capture_age_ms: z.number().int().nonnegative().optional()
		});
		listUnknownsInputSchema = z.strictObject({
			status: z.enum([
				"open",
				"investigating",
				"blocked",
				"contradicted",
				"resolved"
			]).optional(),
			severity: z.enum([
				"low",
				"medium",
				"high",
				"critical"
			]).optional(),
			domain: z.string().trim().min(1).optional(),
			offset: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).default(0).describe("Zero-based offset in the stable filtered unknown ID order."),
			limit: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).optional().describe("Optional maximum number of heads to return. Omit to return every matching head from offset.")
		});
		verifyUnknownResolutionInputSchema = z.strictObject({ unknown_id: prefixedDigestSchema("unk") });
	})))();
}

//#endregion
//#region dist/domain/native/recordedCrashNoteCoverage.js
/** Require exact aligned note layouts and one complete, nonoverlapping physical coverage. */
function recordedNoteCoverageIssues(segments, notes, padding) {
	const issues = [];
	const bySegment = new Map();
	const all = [];
	const add = (segment, range) => {
		const ranges = bySegment.get(segment) ?? [];
		ranges.push(range);
		bySegment.set(segment, ranges);
		all.push(range);
	};
	for (const note of notes) {
		if (!layoutMatches(note)) issues.push("Recorded note layout differs from its aligned header/owner/descriptor ranges.");
		add(note.segment_index, note.location);
	}
	for (const item of padding) {
		if (!paddingMatches(item, segments[item.segment_index])) issues.push("Recorded note padding must be a short zero-filled segment tail.");
		add(item.segment_index, item.location);
	}
	const compare = (left, right) => BigInt(left.offset) < BigInt(right.offset) ? -1 : BigInt(left.offset) > BigInt(right.offset) ? 1 : 0;
	let end = 0n;
	for (const range of all.sort(compare)) {
		const start = BigInt(range.offset);
		if (start < end) issues.push("Physical recorded note/padding ranges overlap or repeat.");
		if (start + BigInt(range.bytes) > end) end = start + BigInt(range.bytes);
	}
	for (const segment of segments) {
		if (segment.type !== "PT_NOTE") continue;
		let cursor = BigInt(segment.offset);
		for (const range of (bySegment.get(segment.index) ?? []).sort(compare)) {
			if (BigInt(range.offset) !== cursor) issues.push("Recorded note/padding ranges leave a gap or overlap in their segment.");
			cursor = BigInt(range.offset) + BigInt(range.bytes);
		}
		if (cursor !== BigInt(segment.offset) + BigInt(segment.file_size)) issues.push("Recorded note/padding ranges do not completely cover their segment.");
	}
	return issues;
}
var align, layoutMatches, paddingMatches;
function init_recordedCrashNoteCoverage() {
	return (init_recordedCrashNoteCoverage = __esmMin((() => {
		align = (size) => (size + 3n) / 4n * 4n;
		layoutMatches = (note) => {
			const start = BigInt(note.location.offset);
			const owner = BigInt(note.owner_location.bytes);
			const descriptor = BigInt(note.descriptor_location.bytes);
			return BigInt(note.owner_location.offset) === start + 12n && BigInt(note.descriptor_location.offset) === start + 12n + align(owner) && BigInt(note.location.bytes) === 12n + align(owner) + align(descriptor);
		};
		paddingMatches = (item, segment) => {
			const bytes = BigInt(item.location.bytes);
			const decodedLength = item.bytes_base64.length / 4 * 3 - (item.bytes_base64.endsWith("==") ? 2 : item.bytes_base64.endsWith("=") ? 1 : 0);
			return bytes > 0n && bytes < 12n && BigInt(decodedLength) === bytes && /^A*={0,2}$/.test(item.bytes_base64) && segment !== undefined && BigInt(item.location.offset) + bytes === BigInt(segment.offset) + BigInt(segment.file_size);
		};
	})))();
}

//#endregion
//#region dist/domain/native/recordedCrash.js
var hex, index, signed32, base64, range$2, diagnostics, LINUX_CORE_OWNER_BASE64, RECORDED_LINUX_AMD64_REGISTERS, RECORDED_LINUX_AARCH64_REGISTERS, RECORDED_LINUX_CORE_ARCHITECTURES, RECORDED_LINUX_CORE_PROFILES, recordedCoreRegisterSets, inspectRecordedCrashInputSchema, recordedCrashDebuggerSchema, recordedCrashObjectSchema, recordedCrashPayloadSchema, recordedCrashSchema;
function init_recordedCrash() {
	return (init_recordedCrash = __esmMin((() => {
		init_localPath();
		init_stringPatterns();
		init_recordedCrashNoteCoverage();
		hex = z.string().regex(/^0x(?:0|[1-9a-f][0-9a-f]{0,15})$/);
		index = z.number().int().nonnegative();
		signed32 = z.number().int().min(-2147483648).max(2147483647);
		base64 = z.string().regex(CANONICAL_BASE64_PATTERN);
		range$2 = z.strictObject({
			offset: hex,
			bytes: hex
		});
		diagnostics = z.strictObject({
			stdout: z.string(),
			stderr: z.string(),
			truncated: z.boolean()
		});
		LINUX_CORE_OWNER_BASE64 = "Q09SRQA=";
		RECORDED_LINUX_AMD64_REGISTERS = [
			"r15",
			"r14",
			"r13",
			"r12",
			"rbp",
			"rbx",
			"r11",
			"r10",
			"r9",
			"r8",
			"rax",
			"rcx",
			"rdx",
			"rsi",
			"rdi",
			"orig_rax",
			"rip",
			"cs",
			"eflags",
			"rsp",
			"ss",
			"fs_base",
			"gs_base",
			"ds",
			"es",
			"fs",
			"gs"
		];
		RECORDED_LINUX_AARCH64_REGISTERS = [
			"x0",
			"x1",
			"x2",
			"x3",
			"x4",
			"x5",
			"x6",
			"x7",
			"x8",
			"x9",
			"x10",
			"x11",
			"x12",
			"x13",
			"x14",
			"x15",
			"x16",
			"x17",
			"x18",
			"x19",
			"x20",
			"x21",
			"x22",
			"x23",
			"x24",
			"x25",
			"x26",
			"x27",
			"x28",
			"x29",
			"x30",
			"sp",
			"pc",
			"pstate"
		];
		RECORDED_LINUX_CORE_ARCHITECTURES = ["x86_64-little-endian", "aarch64-little-endian"];
		RECORDED_LINUX_CORE_PROFILES = {
			"x86_64-little-endian": {
				machine: 62,
				evidenceArchitecture: "x86_64",
				registers: RECORDED_LINUX_AMD64_REGISTERS,
				registerBytes: 8,
				registerOffset: 112,
				prstatusBytes: 336
			},
			"aarch64-little-endian": {
				machine: 183,
				evidenceArchitecture: "arm64",
				registers: RECORDED_LINUX_AARCH64_REGISTERS,
				registerBytes: 8,
				registerOffset: 112,
				prstatusBytes: 392
			}
		};
		recordedCoreRegisterSets = {
			"x86_64-little-endian": new Set(RECORDED_LINUX_AMD64_REGISTERS),
			"aarch64-little-endian": new Set(RECORDED_LINUX_AARCH64_REGISTERS)
		};
		inspectRecordedCrashInputSchema = z.strictObject({
			path: localPathStringSchema.describe("Absolute filesystem path to a supplied Linux ELF core"),
			include_debugger_context: z.boolean().default(false).describe("Add core-only mapping candidates through caller-supplied GDB/pwndbg")
		});
		recordedCrashDebuggerSchema = z.discriminatedUnion("status", [z.strictObject({ status: z.literal("not-requested") }), z.strictObject({
			status: z.literal("available"),
			gdb_version: z.string().min(1),
			pwndbg_version: z.string().min(1),
			connection: z.literal("core"),
			executable: z.null(),
			historical_pid: signed32,
			reported_limits: z.strictObject({
				address_space_bytes: index,
				cpu_seconds: index,
				file_size_bytes: index
			}),
			maps: z.array(z.strictObject({
				start: hex,
				end: hex,
				offset: hex,
				reported_flags: index,
				permissions: z.strictObject({
					read: z.boolean(),
					write: z.boolean(),
					execute: z.boolean()
				}).nullable(),
				pathname_display: z.string(),
				current_file_identity: z.literal("unknown")
			})),
			confidence: z.literal("derived"),
			completeness: z.literal("unknown"),
			diagnostics
		})]);
		recordedCrashObjectSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string().min(1),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				bytes: index
			}),
			format: z.literal("elf-core"),
			architecture: z.enum(RECORDED_LINUX_CORE_ARCHITECTURES),
			target_execution: z.literal("not-performed"),
			live_process_identity: z.literal("unknown"),
			segments: z.array(z.strictObject({
				index,
				type: z.union([z.string(), index]),
				header_location: range$2,
				offset: hex,
				file_size: hex,
				memory_size: hex,
				virtual_address: hex,
				physical_address: hex,
				alignment: hex,
				flags: hex,
				file_backing: z.enum(["file", "none"])
			})),
			notes: z.array(z.strictObject({
				index,
				segment_index: index,
				type: z.union([z.string(), index]),
				location: range$2,
				owner_location: range$2,
				owner_bytes_base64: base64,
				owner_display: z.string().nullable(),
				descriptor_location: range$2,
				descriptor_bytes_base64: base64
			})),
			note_padding: z.array(z.strictObject({
				segment_index: index,
				location: range$2,
				bytes_base64: base64
			})),
			threads: z.array(z.strictObject({
				note_index: index,
				historical_pid: signed32,
				recorded_current_signal: z.number().int().min(-32768).max(32767),
				registers: z.array(z.strictObject({
					name: z.string().min(1),
					value: hex,
					location: range$2
				}))
			})),
			signals: z.array(z.strictObject({
				note_index: index,
				number: signed32,
				code: signed32,
				errno: signed32,
				fault_address: hex.nullable(),
				fault_address_meaning: z.enum(["recorded-sigsegv-address", "unknown"]),
				thread_association: z.literal("unknown")
			})),
			debugger: recordedCrashDebuggerSchema,
			note_interpretation_completeness: z.literal("unknown"),
			decoder_diagnostics: diagnostics,
			diagnostics,
			limitations: z.array(z.string())
		});
		recordedCrashPayloadSchema = recordedCrashObjectSchema.omit({
			artifact: true,
			diagnostics: true,
			debugger: true,
			decoder_diagnostics: true
		});
		recordedCrashSchema = recordedCrashObjectSchema.superRefine((value, context) => {
			const fail = (message) => context.addIssue({
				code: "custom",
				message
			});
			const within = (item, start = 0n, end = BigInt(value.artifact.bytes)) => {
				const offset = BigInt(item.offset);
				const bytes = BigInt(item.bytes);
				return offset >= start && offset <= end && bytes <= end - offset;
			};
			for (const issue of recordedNoteCoverageIssues(value.segments, value.notes, value.note_padding)) fail(issue);
			for (const [position, segment] of value.segments.entries()) {
				if (position !== segment.index || !within(segment.header_location)) fail("Invalid original segment identity or header range.");
				if (segment.file_backing === "file" && !within({
					offset: segment.offset,
					bytes: segment.file_size
				})) fail("Recorded segment exceeds artifact bytes.");
				if (segment.type === "PT_LOAD" && BigInt(segment.file_size) > BigInt(segment.memory_size)) fail("Recorded PT_LOAD file size exceeds memory size.");
			}
			for (const [position, note] of value.notes.entries()) {
				const segment = value.segments[note.segment_index];
				if (position !== note.index || segment?.type !== "PT_NOTE") {
					fail("Invalid original note identity or segment reference.");
					continue;
				}
				const decodedLength = (raw) => BigInt(raw.length / 4 * 3 - (raw.endsWith("==") ? 2 : raw.endsWith("=") ? 1 : 0));
				if (decodedLength(note.owner_bytes_base64) !== BigInt(note.owner_location.bytes) || decodedLength(note.descriptor_bytes_base64) !== BigInt(note.descriptor_location.bytes)) fail("Raw note lengths differ from their source ranges.");
				const start = BigInt(segment.offset);
				const end = start + BigInt(segment.file_size);
				if (!within(note.location, start, end) || !within(note.owner_location, BigInt(note.location.offset), BigInt(note.location.offset) + BigInt(note.location.bytes)) || !within(note.descriptor_location, BigInt(note.location.offset), BigInt(note.location.offset) + BigInt(note.location.bytes))) fail("Note source ranges exceed their recorded segment.");
			}
			for (const padding of value.note_padding) {
				const segment = value.segments[padding.segment_index];
				if (segment?.type !== "PT_NOTE" || !within(padding.location, BigInt(segment.offset), BigInt(segment.offset) + BigInt(segment.file_size))) fail("Invalid recorded note padding range.");
			}
			for (const [kind, rows] of [["NT_PRSTATUS", value.threads], ["NT_SIGINFO", value.signals]]) {
				const matchingNotes = value.notes.filter((note) => note.type === kind && note.owner_bytes_base64 === LINUX_CORE_OWNER_BASE64);
				if (rows.length !== matchingNotes.length || new Set(rows.map(({ note_index }) => note_index)).size !== rows.length) fail("Each supported raw note requires exactly one corresponding interpretation.");
			}
			const profile = RECORDED_LINUX_CORE_PROFILES[value.architecture];
			const profileRegisters = recordedCoreRegisterSets[value.architecture];
			for (const thread of value.threads) {
				const note = value.notes[thread.note_index];
				if (note?.type !== "NT_PRSTATUS" || note.owner_display !== "CORE" || note.owner_bytes_base64 !== LINUX_CORE_OWNER_BASE64) {
					fail("Thread references a different note kind.");
					continue;
				}
				if (thread.registers.length !== profile.registers.length || !thread.registers.every(({ name }) => profileRegisters.has(name)) || new Set(thread.registers.map(({ name }) => name)).size !== thread.registers.length) fail("Each recorded thread requires every supported register exactly once.");
				for (const register of thread.registers) if (BigInt(register.location.bytes) !== BigInt(profile.registerBytes) || !within(register.location, BigInt(note.descriptor_location.offset), BigInt(note.descriptor_location.offset) + BigInt(note.descriptor_location.bytes))) fail("Register source exceeds its descriptor.");
			}
			for (const signal of value.signals) {
				if (value.notes[signal.note_index]?.type !== "NT_SIGINFO" || value.notes[signal.note_index]?.owner_display !== "CORE" || value.notes[signal.note_index]?.owner_bytes_base64 !== LINUX_CORE_OWNER_BASE64) fail("Signal references a different note kind.");
				const known = signal.number === 11 && (signal.code === 1 || signal.code === 2);
				if (known !== (signal.fault_address !== null) || signal.fault_address !== null !== (signal.fault_address_meaning === "recorded-sigsegv-address")) fail("Signal union meaning does not match recorded SIGSEGV code.");
			}
			if (value.debugger.status === "available") for (const map of value.debugger.maps) {
				if (BigInt(map.end) < BigInt(map.start)) fail("Debugger mapping end precedes its start.");
				if (map.permissions !== null && (map.permissions.read !== Boolean(map.reported_flags & 4) || map.permissions.write !== Boolean(map.reported_flags & 2) || map.permissions.execute !== Boolean(map.reported_flags & 1))) fail("Mapping permissions differ from reported flags.");
				if ((map.reported_flags === 0 || map.reported_flags > 7) !== (map.permissions === null)) fail("Unreported or unfamiliar map flags require unknown permissions.");
			}
		});
	})))();
}

//#endregion
//#region dist/domain/native/peResources.js
var uint, range$1, identity, inspectPeResourcesInputSchema, peResourcesSchema;
function init_peResources() {
	return (init_peResources = __esmMin((() => {
		init_localPath();
		uint = z.number().int().min(0).max(4294967295);
		range$1 = z.strictObject({
			offset: uint,
			bytes: uint
		});
		identity = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("id"),
			id: uint
		}), z.strictObject({
			kind: z.literal("name"),
			name: z.string(),
			utf16le_hex: z.string().regex(/^(?:[0-9a-f]{4})*$/),
			location: range$1
		})]);
		inspectPeResourcesInputSchema = z.strictObject({
			path: localPathStringSchema.describe("Absolute filesystem path to a PE image"),
			max_file_bytes: z.number().int().min(64).max(536870912).default(67108864).describe("Maximum stable artifact bytes to read (default 64 MiB)"),
			max_entries: z.number().int().min(1).max(65536).default(16384).describe("Maximum resource directory entries to examine; exceeding the budget fails without partial success")
		});
		peResourcesSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string().min(1),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				bytes: uint
			}),
			format: z.enum(["pe32", "pe32-plus"]),
			machine: uint,
			directory: z.strictObject({
				rva: uint,
				location: range$1,
				data_directory_location: range$1
			}).nullable(),
			directories: z.array(z.strictObject({
				location: range$1,
				characteristics: uint,
				timestamp: uint,
				major_version: uint,
				minor_version: uint,
				named_entries: uint,
				id_entries: uint
			})),
			resources: z.array(z.strictObject({
				index: uint,
				type: identity,
				name: identity,
				language: identity,
				entry_locations: z.array(range$1).length(3),
				data_entry_location: range$1,
				code_page: uint,
				reserved: uint,
				payload: z.strictObject({
					rva: uint,
					location: range$1,
					sha256: z.string().regex(/^[a-f0-9]{64}$/)
				})
			})),
			icon_groups: z.array(z.strictObject({
				resource_index: uint,
				images: z.array(z.strictObject({
					location: range$1,
					width: uint,
					height: uint,
					color_count: uint,
					reserved: uint,
					planes: uint,
					bit_count: uint,
					declared_bytes: uint,
					resource_id: uint,
					candidate_resource_indices: z.array(uint),
					same_language_resource_index: uint.nullable(),
					size_matches: z.boolean().nullable()
				}))
			})),
			coverage: z.strictObject({
				status: z.literal("complete"),
				examined_entries: uint,
				resources: uint
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/contracts/fridaRemoteAddress.js
var isValidFridaRemoteAddress;
function init_fridaRemoteAddress() {
	return (init_fridaRemoteAddress = __esmMin((() => {
		isValidFridaRemoteAddress = (address) => {
			if (address.length === 0 || address.length > 2048) return false;
			if (/[?@#\s\u0000-\u001f\u007f/]/u.test(address)) return false;
			if (address.endsWith(":")) return false;
			try {
				const parsed = new URL(`tcp://${address}`);
				const port = parsed.port === "" ? undefined : Number(parsed.port);
				return parsed.hostname.length > 0 && (port === undefined || port > 0 && port <= 65535) && parsed.username.length === 0 && parsed.password.length === 0 && (parsed.pathname === "" || parsed.pathname === "/") && parsed.search.length === 0 && parsed.hash.length === 0;
			} catch {
				return false;
			}
		};
	})))();
}

//#endregion
//#region dist/contracts/fridaToolContracts.js
var FRIDA_KEEPALIVE_INTERVAL_DESCRIPTION, remoteConnection, deviceSelector, exclusiveDeviceSelector, sessionId, sessionOutput, scriptOutput, FRIDA_TOOL_CONTRACTS;
function init_fridaToolContracts() {
	return (init_fridaToolContracts = __esmMin((() => {
		init_toolOutputSchemaPrimitives();
		init_toolEffects();
		init_fridaRemoteAddress();
		FRIDA_KEEPALIVE_INTERVAL_DESCRIPTION = "Remote keepalive interval in seconds";
		remoteConnection = z.strictObject({
			address: z.string().min(1).max(2048).refine(isValidFridaRemoteAddress, { message: "Expected a Frida host address, optionally followed by a port" }),
			token: z.string().min(1).optional(),
			certificate: z.string().min(1).optional(),
			origin: z.string().min(1).optional(),
			keepalive_interval: z.number().int().positive().describe(FRIDA_KEEPALIVE_INTERVAL_DESCRIPTION).optional()
		});
		deviceSelector = z.strictObject({
			device_id: z.string().min(1).optional(),
			remote: remoteConnection.optional()
		});
		exclusiveDeviceSelector = (schema) => schema.refine((value) => !(typeof value === "object" && value !== null && "device_id" in value && "remote" in value && value.device_id !== undefined && value.remote !== undefined), "Choose either device_id or remote, not both");
		sessionId = z.string().uuid();
		sessionOutput = z.strictObject({
			session_id: sessionId,
			device_id: z.string(),
			target: z.string(),
			pid: z.number().int().nonnegative(),
			mode: z.enum(["attach", "spawn"]),
			state: z.enum([
				"paused",
				"running",
				"detached"
			])
		});
		scriptOutput = z.strictObject({
			script_id: z.string().uuid(),
			source_kind: z.enum(["inline", "file"]),
			source_path: z.string().nullable(),
			source_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			messages: z.array(z.unknown()),
			messages_truncated: z.boolean()
		});
		FRIDA_TOOL_CONTRACTS = [
			{
				name: "list_frida_devices",
				...toolContractMetadata("list_frida_devices"),
				kind: "native-provider",
				description: "List Frida devices currently available to this host, optionally connecting to the caller-selected remote Frida endpoint. Remote authentication options are used for this call only and are never returned or recorded.",
				inputSchema: z.strictObject({ remote: remoteConnection.optional() }),
				outputSchema: z.strictObject({
					devices: z.array(z.strictObject({
						device_id: z.string(),
						name: z.string(),
						type: z.string()
					})),
					cleanup_error: z.string().nullable()
				}),
				examples: [{
					title: "List Frida devices",
					input: {}
				}]
			},
			{
				name: "list_frida_processes",
				...toolContractMetadata("list_frida_processes"),
				kind: "native-provider",
				description: "List processes observed on a selected Frida device or caller-supplied remote endpoint. A remote connection is closed after discovery; authentication values are never returned or recorded.",
				inputSchema: exclusiveDeviceSelector(deviceSelector).refine((value) => value.device_id !== undefined || value.remote !== undefined, "Select a device_id or a remote endpoint"),
				outputSchema: z.strictObject({
					device_id: z.string(),
					processes: z.array(z.strictObject({
						pid: z.number().int().nonnegative(),
						name: z.string(),
						identifier: z.string().nullable()
					})),
					cleanup_error: z.string().nullable()
				}),
				examples: [{
					title: "List local Frida processes",
					input: { device_id: "local" }
				}]
			},
			{
				name: "start_frida_session",
				...toolContractMetadata("start_frida_session"),
				kind: "native-provider",
				description: "Attach Frida to one selected process or spawn one selected target. Spawned targets remain paused until resume_frida_session, allowing scripts to load before execution. Closing a session detaches instrumentation; it does not kill the target.",
				inputSchema: z.strictObject({
					mode: z.enum(["attach", "spawn"]),
					...deviceSelector.shape,
					pid: z.number().int().positive().optional(),
					program: z.string().min(1).optional(),
					argv: z.array(z.string()).optional()
				}).refine((value) => (value.mode === "attach" && value.pid !== undefined && value.program === undefined && value.argv === undefined || value.mode === "spawn" && value.program !== undefined && value.pid === undefined) && !(value.device_id !== undefined && value.remote !== undefined), "Select one device; attach requires pid; spawn requires program and rejects pid"),
				outputSchema: sessionOutput,
				examples: [{
					title: "Attach to a process",
					input: {
						mode: "attach",
						device_id: "local",
						pid: 1234
					}
				}]
			},
			{
				name: "load_frida_script",
				...toolContractMetadata("load_frida_script"),
				kind: "native-provider",
				description: "Load caller-supplied JavaScript into a Frida session. Scripts can read or change target memory and behavior and can access the target process's capabilities. Messages and script errors are returned inline as Evidence; source content is not persisted.",
				inputSchema: z.strictObject({
					session_id: sessionId,
					source_kind: z.enum(["inline", "file"]),
					source: z.string().optional(),
					path: z.string().min(1).optional()
				}).refine((value) => value.source_kind === "inline" && value.source !== undefined && value.path === undefined || value.source_kind === "file" && value.path !== undefined && value.source === undefined, "Inline source requires source; file source requires path"),
				outputSchema: evidenceResultOf(scriptOutput),
				examples: [{
					title: "Load an inline Frida script",
					input: {
						session_id: "00000000-0000-4000-8000-000000000001",
						source_kind: "inline",
						source: "send(Process.id);"
					}
				}]
			},
			{
				name: "resume_frida_session",
				...toolContractMetadata("resume_frida_session"),
				kind: "native-provider",
				description: "Resume the process created by a paused Frida spawn session. Attached processes are already running and cannot be resumed through this operation.",
				inputSchema: z.strictObject({ session_id: sessionId }),
				outputSchema: z.strictObject({ state: z.literal("running") }),
				examples: [{
					title: "Resume an instrumented process",
					input: { session_id: "00000000-0000-4000-8000-000000000001" }
				}]
			},
			{
				name: "unload_frida_script",
				...toolContractMetadata("unload_frida_script"),
				kind: "native-provider",
				description: "Unload one caller-selected Frida script from a live session. This removes that script's instrumentation from the target.",
				inputSchema: z.strictObject({
					session_id: sessionId,
					script_id: z.string().uuid()
				}),
				outputSchema: z.strictObject({ unloaded: z.literal(true) }),
				examples: [{
					title: "Unload a script",
					input: {
						session_id: "00000000-0000-4000-8000-000000000001",
						script_id: "00000000-0000-4000-8000-000000000002"
					}
				}]
			},
			{
				name: "frida_session_status",
				...toolContractMetadata("frida_session_status"),
				kind: "native-provider",
				description: "Return observed Frida session state and queued script messages. Message history is bounded by the provider capture budget and reports truncation.",
				inputSchema: z.strictObject({ session_id: sessionId }),
				outputSchema: evidenceResultOf(z.strictObject({
					session_id: sessionId,
					device_id: z.string(),
					state: z.enum([
						"paused",
						"running",
						"detached"
					]),
					target: z.string(),
					pid: z.number().int().nonnegative(),
					mode: z.enum(["attach", "spawn"]),
					scripts: z.array(z.strictObject({
						script_id: z.string().uuid(),
						name: z.string()
					})),
					messages: z.array(z.unknown()),
					messages_truncated: z.boolean()
				})),
				examples: [{
					title: "Check Frida session",
					input: { session_id: "00000000-0000-4000-8000-000000000001" }
				}]
			},
			{
				name: "close_frida_session",
				...toolContractMetadata("close_frida_session"),
				kind: "native-provider",
				description: "Unload session scripts and detach REA's Frida session. If a spawned process is still paused, resume it before detaching so it is not left suspended. REA never kills the target; its final state is reported as unknown.",
				inputSchema: z.strictObject({ session_id: sessionId }),
				outputSchema: z.strictObject({ target_state: z.literal("unknown") }),
				examples: [{
					title: "Close Frida session",
					input: { session_id: "00000000-0000-4000-8000-000000000001" }
				}]
			},
			{
				name: "instrument_with_frida",
				...toolContractMetadata("instrument_with_frida"),
				kind: "native-provider",
				description: "Run one caller-authored Frida script against an explicitly selected process and detach when the observation window ends. The CLI and MCP share this ephemeral workflow; use MCP session operations for persistent sessions. Remote authentication is used only for this call and excluded from Evidence.",
				inputSchema: z.strictObject({
					mode: z.enum(["attach", "spawn"]),
					...deviceSelector.shape,
					pid: z.number().int().positive().optional(),
					program: z.string().min(1).optional(),
					argv: z.array(z.string()).optional(),
					source_kind: z.enum(["inline", "file"]),
					source: z.string().optional(),
					path: z.string().min(1).optional(),
					duration_ms: z.number().int().min(0).max(6e4).default(1e3)
				}).refine((value) => !(value.device_id !== undefined && value.remote !== undefined) && (value.mode === "attach" && value.pid !== undefined && value.program === undefined && value.argv === undefined || value.mode === "spawn" && value.program !== undefined && value.pid === undefined) && (value.source_kind === "inline" && value.source !== undefined && value.path === undefined || value.source_kind === "file" && value.path !== undefined && value.source === undefined), "Select one device and provide fields matching the mode and source_kind"),
				outputSchema: evidenceResultOf(z.strictObject({
					...sessionOutput.shape,
					scripts: z.array(z.strictObject({
						script_id: sessionId,
						name: z.string()
					})),
					messages: z.array(z.unknown()),
					messages_truncated: z.boolean(),
					source_kind: z.enum(["inline", "file"]),
					source_path: z.string().nullable(),
					source_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
					cleanup_error: z.string().nullable()
				})),
				examples: [{
					title: "Instrument a selected process briefly",
					input: {
						mode: "attach",
						device_id: "local",
						pid: 1234,
						source_kind: "inline",
						source: "send(Process.id);",
						duration_ms: 1e3
					}
				}]
			}
		];
	})))();
}

//#endregion
//#region dist/contracts/native/nativeToolContracts.js
var examples, native, swiftSymbolsSchema, NATIVE_TOOL_CONTRACTS;
function init_nativeToolContracts() {
	return (init_nativeToolContracts = __esmMin((() => {
		init_nativeCallObservation();
		init_nativeUiObservation();
		init_toolOutputSchemaGroups();
		init_jsonValue();
		init_localPath();
		init_toolEffects();
		init_toolOutputSchemaPrimitives();
		init_analysisDetail();
		examples = {
			inspect_macho: {},
			inspect_signature: {},
			inspect_plist: { path: "/Applications/Example.app/Contents/Info.plist" },
			list_architectures: {},
			observe_native_ui: {
				pid: 123,
				window_id: 456
			},
			capture_native_ui_scenario: {
				pid: 123,
				window_id: 456,
				steps: [{
					kind: "wait",
					milliseconds: 100
				}]
			},
			demangle_swift: { symbols: ["$s4Test3fooyyF"] },
			observe_native_calls: {
				breakpoints: [{
					kind: "objc-method",
					class_name: "NSURLSession",
					selector: "dataTaskWithRequest:completionHandler:"
				}, {
					kind: "function",
					name: "open",
					module: "libsystem_kernel.dylib"
				}],
				arguments: ["--help"],
				duration_ms: 5e3,
				backtrace_frames: 4
			}
		};
		native = (name, description, inputSchema) => {
			const outputSchema = requireOutputSchema(nativeOutputSchemas, name);
			const strictInputSchema = inputSchema.strict();
			return {
				name,
				...toolContractMetadata(name),
				description,
				kind: "native-provider",
				inputSchema: strictInputSchema,
				outputSchema,
				examples: [{
					title: `Example ${name.replaceAll("_", " ")} request`,
					input: z.record(z.string(), jsonValueSchema).parse(examples[name] ?? {})
				}]
			};
		};
		swiftSymbolsSchema = z.array(z.string().min(1).regex(/^[^\n]*$/u, "Each Swift symbol must be one line.").regex(/^[^\x00]*$/u, "Swift symbols cannot contain NUL."));
		NATIVE_TOOL_CONTRACTS = [
			native("observe_native_ui", "Observe an already-running native app by PID and window ID, bound to the active Mach-O target. Captures a bounded accessibility tree and selected-window screenshot; OS permission denial fails without broad capture or target launch.", nativeUiObservationInputSchema),
			native("capture_native_ui_scenario", "Run selected-element press, increment/decrement scroll, AXValue text entry and bounded wait steps in one exact native app window. Returns ordered before/after captures and action/capture failures. Actions can change app data, network activity and persistent state; application state is left as-is and restoration is not attempted.", nativeUiScenarioInputSchema),
			native("observe_native_calls", "Launch the active Mach-O as an owned process under LLDB and record each entry into caller-selected functions or Objective-C methods: thread, module, symbol, load and file address, raw argument registers, selector, receiver class and optional caller frames. Every hit auto-continues. No expression is evaluated and no other process is attached. The process is killed when max_events or duration_ms is reached; exit status, captured stdout/stderr, unresolved breakpoints and limitations are returned inline. The process runs with the current user's permissions and may change files, show UI or use the network. A hardened-runtime target needs the get-task-allow entitlement.", nativeCallObservationInputSchema),
			native("inspect_macho", "Inspect Mach-O slices, load commands, imports, exports, dependencies, build metadata, segments, sections, permissions, and exact command provenance without launching Hopper. Large frameworks return megabytes of symbols; detail summary retains the complete Evidence and returns slice identity with per-collection counts, then page rows with inspect_analysis_view kind macho.", z.object({ detail: analysisDetailSchema.unwrap().optional().describe("Omitted or complete returns the complete inspection Evidence. summary retains that complete Evidence in this session and returns its inspect_analysis_view summary; use normalized_result.parent_evidence_id for macho pages.") })),
			native("inspect_signature", "Inspect the active Mach-O executable's code-signing identity, hashes, authorities, requirements, entitlements, hardened-runtime state, and exact command provenance.", z.object({})),
			native("inspect_plist", "Parse Info.plist from the active artifact by default, or pass any local plist path. Returns normalized JSON rather than plutil text.", z.object({ path: localPathStringSchema.optional() })),
			native("list_architectures", "List thin or universal Mach-O slices with offsets, sizes, alignment, explicit coverage, and native-tool provenance.", z.object({})),
			native("demangle_swift", "Demangle an ordered list of single-line Swift symbols without requiring Hopper. Each input returns demangled, unchanged, or invalid status.", z.object({ symbols: swiftSymbolsSchema }))
		];
	})))();
}

//#endregion
//#region dist/domain/firmware/firmwareAnalysis.js
var bytes, range, target, firmwareInputSchemas, firmwareRequestSchema, engine$1, selection, chunk, extractionGap, firmwareResultSchemas;
function init_firmwareAnalysis() {
	return (init_firmwareAnalysis = __esmMin((() => {
		init_digests();
		init_jsonValue();
		init_localPath();
		bytes = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
		range = z.strictObject({
			offset: bytes,
			length: bytes.positive()
		});
		target = { path: localPathStringSchema.refine(isAbsolute, { message: "path must be an absolute local filesystem path (for example /tmp/firmware.bin or C:\\firmware\\firmware.bin)" }).describe("Absolute local firmware file; never executed. Relative paths are rejected.") };
		firmwareInputSchemas = {
			inspect_firmware_regions: z.strictObject(target),
			extract_firmware: z.strictObject({
				...target,
				output_directory: localPathStringSchema.refine(isAbsolute, { message: "output_directory must be an absolute local filesystem path" }).describe("Absolute, absent output directory; parent must exist"),
				range: range.optional().describe("Explicit file-byte interval; omit to extract the whole file"),
				max_depth: z.number().int().min(1).max(10).default(3).describe("Extraction depth; reaching it yields partial analysis"),
				max_output_bytes: z.number().int().min(1).max(512 * 1024 * 1024).default(256 * 1024 * 1024).describe("Staging file-byte budget, checked during extraction; transient overshoot is possible"),
				max_output_files: z.number().int().min(1).max(1e5).default(1e4).describe("Staging entry budget, including directories and links")
			})
		};
		firmwareRequestSchema = z.discriminatedUnion("operation", [z.strictObject({
			operation: z.literal("inspect_firmware_regions"),
			input: firmwareInputSchemas.inspect_firmware_regions
		}), z.strictObject({
			operation: z.literal("extract_firmware"),
			input: firmwareInputSchemas.extract_firmware
		})]);
		engine$1 = z.strictObject({
			name: z.string(),
			version: z.string(),
			executable_path: z.string(),
			executable_sha256: digestSchema,
			source_revision: z.null(),
			worker_count: z.literal(1)
		});
		selection = z.strictObject({
			...range.shape,
			sha256: digestSchema
		});
		chunk = z.strictObject({
			input_path: z.string(),
			provider_id: z.string(),
			range,
			handler: z.string().nullable(),
			encrypted: z.boolean().nullable(),
			root_file_range: range.nullable(),
			/** The producer reported extraction problems for this chunk. */
			extraction_failed: z.boolean()
		});
		extractionGap = z.strictObject({
			kind: z.enum([
				"missing-extractor-dependency",
				"unknown-chunk-handler",
				"encrypted-chunk",
				"depth-limited",
				"extractor-failure",
				"unpublished-entry"
			]),
			/** Logical task path from the producer report; `$output/…` for unpublished entries. */
			input_path: z.string(),
			relative_path: z.string().nullable(),
			handler: z.string().nullable(),
			/** Reported chunk or multi-file stage identity; it does not imply a byte range. */
			provider_id: z.string().nullable(),
			range: range.nullable(),
			root_file_range: range.nullable(),
			/** Extractor executables named by the producer; empty when it named none. */
			dependencies: z.array(z.string()),
			/** Lookup key in the result's extraction_continuations table. */
			continuation_id: z.string()
		});
		firmwareResultSchemas = {
			inspect_firmware_regions: z.strictObject({
				engine: engine$1,
				input_size: bytes,
				regions: z.array(z.strictObject({
					provider_id: z.string(),
					offset: bytes,
					reported_size: bytes,
					signature: z.string(),
					description: z.string(),
					reported_confidence: z.number().int().min(0).max(255),
					size_basis: z.literal("provider_reported_validation_unknown")
				})),
				coverage: z.literal("signature_scan")
			}),
			extract_firmware: z.strictObject({
				engine: engine$1,
				selection,
				output_directory: z.string(),
				coverage: z.enum(["complete", "partial"]),
				files: z.array(z.strictObject({
					relative_path: z.string(),
					path: z.string(),
					size: bytes,
					sha256: digestSchema,
					reported_sha256: digestSchema.nullable(),
					mime_type: z.string().nullable(),
					analysis_depth: bytes.nullable(),
					runtime_address: z.null(),
					original_file_range: z.null()
				})),
				unpublished_entries: z.array(z.strictObject({
					relative_path: z.string(),
					kind: z.enum(["symlink", "special"]),
					link_target: z.string().nullable()
				})),
				chunks: z.array(chunk),
				derivations: z.array(z.strictObject({
					parent_path: z.string(),
					child_path: z.string(),
					provider_blob_id: z.string(),
					handler: z.string().nullable(),
					parent_file_range: range.nullable()
				})),
				depth_limited_paths: z.array(z.string()),
				diagnostics: z.array(jsonValueSchema),
				extraction_gaps: z.array(extractionGap),
				/** Each distinct recovery instruction is serialized once, shared by gap ID. */
				extraction_continuations: z.array(z.strictObject({
					id: z.string(),
					instruction: z.string()
				})),
				published_bytes: bytes
			})
		};
	})))();
}

//#endregion
//#region dist/domain/apktool/apktoolResourceAnalysis.js
var MAX_STRINGS, ANDROID_NON_LOCALE_QUALIFIERS, localeQualifierSchema, androidLocaleQualifierSchema, apktoolInputSchemas, apktoolRequestSchema, client$1, apktoolResultSchemas;
function init_apktoolResourceAnalysis() {
	return (init_apktoolResourceAnalysis = __esmMin((() => {
		init_localPath();
		init_digests();
		MAX_STRINGS = 2e3;
		ANDROID_NON_LOCALE_QUALIFIERS = new Set([
			"car",
			"desk",
			"television",
			"appliance",
			"watch",
			"vrheadset",
			"night",
			"notnight"
		]);
		localeQualifierSchema = z.string().min(2).max(16).regex(/^(?:[a-z]{2,3}(?:-(?:r?[A-Z]{2}|r?[0-9]{3}))?|b\+[a-z]{2,3}(?:\+[A-Za-z0-9]{2,8})*)$/u, "Locale must look like de, pt-BR, pt-rBR, or b+zh+Hans+CN").refine((value) => !ANDROID_NON_LOCALE_QUALIFIERS.has(value.toLowerCase()), "Android resource configuration qualifiers are not locales");
		androidLocaleQualifierSchema = localeQualifierSchema;
		apktoolInputSchemas = {
			inspect_apktool_client: z.strictObject({}),
			decode_android_resources: z.strictObject({
				path: localPathStringSchema.describe("Local APK file to decode"),
				include_strings: z.boolean().default(true).describe(`Project res/values/strings.xml entries (bounded to ${String(MAX_STRINGS)} entries)`),
				locale: androidLocaleQualifierSchema.optional().describe("Project strings from res/values-<locale>/strings.xml instead of the default table")
			})
		};
		apktoolRequestSchema = z.discriminatedUnion("operation", [z.strictObject({
			operation: z.literal("inspect_apktool_client"),
			input: apktoolInputSchemas.inspect_apktool_client
		}), z.strictObject({
			operation: z.literal("decode_android_resources"),
			input: apktoolInputSchemas.decode_android_resources
		})]);
		client$1 = z.strictObject({
			command: z.string().min(1),
			command_source: z.enum(["environment", "path"]),
			apktool_version: z.string().min(1).nullable()
		});
		apktoolResultSchemas = {
			inspect_apktool_client: z.strictObject({ client: client$1 }),
			decode_android_resources: z.strictObject({
				client: client$1,
				target: z.strictObject({
					path: localPathStringSchema,
					bytes: z.number().int().nonnegative(),
					sha256: digestSchema
				}),
				metadata: z.strictObject({
					version_name: z.string().nullable(),
					version_code: z.string().nullable().describe("Version code exactly as apktool.yml prints it, e.g. '45' or '45.1'"),
					min_sdk_version: z.string().nullable(),
					target_sdk_version: z.string().nullable(),
					package_name: z.string().nullable()
				}),
				manifest: z.string().nullable(),
				strings: z.array(z.strictObject({
					name: z.string().min(1),
					value: z.string()
				})),
				locale: z.string().nullable(),
				locales: z.array(z.string().min(1)),
				decoded_file_count: z.number().int().nonnegative(),
				coverage: z.enum(["complete", "partial"])
			})
		};
	})))();
}

//#endregion
//#region dist/domain/jeb/jebAnalysis.js
var jebInputSchemas, jebRequestSchema, engine, unit, jebResultSchemas;
function init_jebAnalysis() {
	return (init_jebAnalysis = __esmMin((() => {
		init_localPath();
		jebInputSchemas = {
			inspect_jeb_client: z.strictObject({}),
			open_jeb_project: z.strictObject({ path: localPathStringSchema.describe("Artifact file or existing .jdb2 project database, resolved by the running JEB client") }),
			list_jeb_units: z.strictObject({
				filter: z.string().optional().describe("Wildcard filter matched against unit paths; '*' allowed"),
				parent_unit_path: z.string().min(1).optional().describe("Restrict results to descendants of this unit path"),
				index: z.number().int().nonnegative().default(0).describe("Zero-based index of the first result to return"),
				count: z.number().int().min(1).max(100).default(100).describe("Maximum results to return; the engine protocol caps pages at 100")
			}),
			decompile_jeb_item: z.strictObject({
				unit_path: z.string().min(1).optional().describe("Target code unit; the engine's first code unit in the project when omitted"),
				item_address: z.string().min(1).describe("Type or method address within the unit, as listed by the engine"),
				item_kind: z.enum(["type", "method"]).describe("Kind of item to decompile")
			})
		};
		jebRequestSchema = z.discriminatedUnion("operation", [
			z.strictObject({
				operation: z.literal("inspect_jeb_client"),
				input: jebInputSchemas.inspect_jeb_client
			}),
			z.strictObject({
				operation: z.literal("open_jeb_project"),
				input: jebInputSchemas.open_jeb_project
			}),
			z.strictObject({
				operation: z.literal("list_jeb_units"),
				input: jebInputSchemas.list_jeb_units
			}),
			z.strictObject({
				operation: z.literal("decompile_jeb_item"),
				input: jebInputSchemas.decompile_jeb_item
			})
		]);
		engine = z.strictObject({
			name: z.string().min(1),
			version: z.string().nullable(),
			endpoint: z.string().min(1),
			gui_client: z.boolean().nullable()
		});
		unit = z.strictObject({
			unit_path: z.string(),
			unit_type: z.string()
		});
		jebResultSchemas = {
			inspect_jeb_client: z.strictObject({
				engine,
				startup_ts: z.number().int().nonnegative().nullable(),
				message: z.string().nullable()
			}),
			open_jeb_project: z.strictObject({
				engine,
				project_name: z.string().nullable(),
				creation_datetime: z.string().nullable(),
				input_files: z.array(z.strictObject({
					file_name: z.string(),
					file_size: z.number().int().nonnegative(),
					contents_sha256_hash: z.string()
				})),
				units: z.array(unit)
			}),
			list_jeb_units: z.strictObject({
				engine,
				filter: z.string().nullable(),
				parent_unit_path: z.string().nullable(),
				index: z.number().int().nonnegative(),
				count: z.number().int().positive(),
				units: z.array(unit),
				coverage: z.enum(["complete", "partial"])
			}),
			decompile_jeb_item: z.strictObject({
				engine,
				unit_path: z.string().nullable(),
				item_address: z.string(),
				item_kind: z.enum(["type", "method"]),
				text: z.string()
			})
		};
	})))();
}

//#endregion
//#region dist/domain/adb/adbDeviceAnalysis.js
var deviceSerialSchema, packageNameSchema, ADB_DEVICE_STATES, adbDeviceStateSchema, keyStringSchema, keyPattern, adbInputSchemas, adbRequestSchema, client, device, pulledArtifact, pullFailure, adbResultSchemas;
function init_adbDeviceAnalysis() {
	return (init_adbDeviceAnalysis = __esmMin((() => {
		init_localPath();
		init_stringPatterns();
		deviceSerialSchema = z.string().min(1).max(256).regex(/^[^\x00\s"']+$/u, "Device serial cannot contain whitespace or quotes");
		packageNameSchema = z.string().min(1).max(256).regex(/^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)*$/u, "Package name must be dot-separated Java identifiers");
		ADB_DEVICE_STATES = [
			"no permissions",
			"unauthorized",
			"authorizing",
			"offline",
			"recovery",
			"sideload",
			"connecting",
			"bootloader",
			"device",
			"unknown",
			"host",
			"rescue",
			"detached"
		];
		adbDeviceStateSchema = z.enum(ADB_DEVICE_STATES);
		keyStringSchema = z.string().min(1).max(256);
		keyPattern = /^[A-Za-z0-9._\x2d]+$/u;
		adbInputSchemas = {
			inspect_adb_client: z.strictObject({}),
			list_adb_devices: z.strictObject({}),
			inspect_adb_device: z.strictObject({ serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it") }),
			list_adb_packages: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				scope: z.enum([
					"all",
					"third_party",
					"system"
				]).default("all").describe("Package scope: all packages, third-party only (-3), or system only (-s)")
			}),
			pull_adb_package: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				package: packageNameSchema.describe("Installed package name whose APK set is pulled"),
				output_directory: localPathStringSchema.describe("Local directory for the pulled APK set; REA creates a package-named subdirectory inside it")
			}),
			read_adb_logcat: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				count: z.number().int().min(1).max(1e4).default(500).describe("Number of most recent lines to read (logcat -d -t)"),
				buffer: z.enum([
					"main",
					"system",
					"radio",
					"events",
					"crash"
				]).default("main").describe("Log buffer to read (logcat -b)"),
				pid: z.number().int().positive().optional().describe("Restrict to one process id (logcat --pid)")
			}),
			inspect_adb_package: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				package: packageNameSchema.describe("Installed package to inspect")
			}),
			pull_adb_file: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				device_path: z.string().min(1).regex(/^\/[^\x00]*$/u, "Device path must be absolute").describe("Absolute device filesystem path to pull"),
				output_directory: localPathStringSchema.describe("Local directory for the pulled file; must not already contain the file")
			}),
			push_adb_file: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				local_path: localPathStringSchema.describe("Existing local regular file to push"),
				device_path: z.string().min(1).regex(/^\/[^\x00]*$/u, "Device path must be absolute").describe("Absolute destination path on the device"),
				overwrite: z.boolean().default(false).describe("Allow replacing an existing device file; refused by default")
			}),
			capture_adb_screen: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				output_directory: localPathStringSchema.describe("Local directory for the captured PNG; must not already contain it")
			}),
			list_adb_processes: z.strictObject({ serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it") }),
			list_adb_directory: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				device_path: z.string().min(1).regex(/^\/[^\x00]*$/u, "Device path must be absolute").describe("Absolute device directory path to list, including hidden children")
			}),
			list_adb_features: z.strictObject({ serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it") }),
			list_adb_services: z.strictObject({ serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it") }),
			inspect_adb_display: z.strictObject({ serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it") }),
			inspect_adb_window: z.strictObject({ serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it") }),
			read_adb_setting: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				namespace: z.enum([
					"system",
					"secure",
					"global"
				]).describe("Settings namespace to read"),
				key: keyStringSchema.regex(keyPattern, "Setting keys are restricted to identifiers").describe("Setting key to read")
			}),
			collect_adb_bugreport: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				output_directory: localPathStringSchema.describe("Local directory for the bugreport archive; REA writes exactly one new zip into it")
			}),
			resolve_adb_packages: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				query: z.string().min(2).max(256).describe("Case-insensitive substring matched against installed package names (e.g. whatsapp)")
			}),
			install_adb_package: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				apk_path: localPathStringSchema.describe("Existing local APK file to install"),
				replace: z.boolean().default(false).describe("Request replacement mode and keep existing app data if present (adb install -r); does not establish whether the app was already installed")
			}),
			uninstall_adb_package: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				package: packageNameSchema.describe("Installed package to uninstall")
			}),
			start_adb_app: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				package: packageNameSchema.describe("Installed package whose launcher activity is started")
			}),
			start_adb_activity: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				action: z.string().min(1).max(256).regex(IDENTIFIER_PATTERN, "Intent action must be a dotted identifier such as android.intent.action.VIEW").describe("Intent action to start"),
				data_uri: z.string().min(1).max(2048).regex(/^[^\x00\s]+$/u, "Data URI cannot contain whitespace or NUL").optional().describe("Intent data URI (-d)"),
				component: z.string().min(1).max(512).regex(/^[A-Za-z0-9._\x2d]+(\/[A-Za-z0-9._\x2d]*)?$/u, "Component must be package/activity form").optional().describe("Explicit component to start (-n)"),
				extras: z.array(z.strictObject({
					key: keyStringSchema.regex(keyPattern, "Extra keys are identifiers").describe("Extra key"),
					type: z.enum([
						"string",
						"boolean",
						"int",
						"long",
						"float"
					]).describe("Extra value type"),
					value: z.string().min(1).max(2048).regex(/^[^\x00]*$/u, "Extra values cannot contain NUL").describe("Extra value as text, parsed per type")
				})).max(16).default([]).describe("Typed intent extras (--es/--ez/--ei/--el/--ef)")
			}),
			stop_adb_app: z.strictObject({
				serial: deviceSerialSchema.describe("Device serial exactly as `adb devices` reports it"),
				package: packageNameSchema.describe("Package whose processes are force-stopped")
			})
		};
		adbRequestSchema = z.discriminatedUnion("operation", [
			z.strictObject({
				operation: z.literal("inspect_adb_client"),
				input: adbInputSchemas.inspect_adb_client
			}),
			z.strictObject({
				operation: z.literal("list_adb_devices"),
				input: adbInputSchemas.list_adb_devices
			}),
			z.strictObject({
				operation: z.literal("inspect_adb_device"),
				input: adbInputSchemas.inspect_adb_device
			}),
			z.strictObject({
				operation: z.literal("list_adb_packages"),
				input: adbInputSchemas.list_adb_packages
			}),
			z.strictObject({
				operation: z.literal("pull_adb_package"),
				input: adbInputSchemas.pull_adb_package
			}),
			z.strictObject({
				operation: z.literal("read_adb_logcat"),
				input: adbInputSchemas.read_adb_logcat
			}),
			z.strictObject({
				operation: z.literal("inspect_adb_package"),
				input: adbInputSchemas.inspect_adb_package
			}),
			z.strictObject({
				operation: z.literal("pull_adb_file"),
				input: adbInputSchemas.pull_adb_file
			}),
			z.strictObject({
				operation: z.literal("push_adb_file"),
				input: adbInputSchemas.push_adb_file
			}),
			z.strictObject({
				operation: z.literal("capture_adb_screen"),
				input: adbInputSchemas.capture_adb_screen
			}),
			z.strictObject({
				operation: z.literal("list_adb_processes"),
				input: adbInputSchemas.list_adb_processes
			}),
			z.strictObject({
				operation: z.literal("list_adb_directory"),
				input: adbInputSchemas.list_adb_directory
			}),
			z.strictObject({
				operation: z.literal("list_adb_features"),
				input: adbInputSchemas.list_adb_features
			}),
			z.strictObject({
				operation: z.literal("list_adb_services"),
				input: adbInputSchemas.list_adb_services
			}),
			z.strictObject({
				operation: z.literal("inspect_adb_display"),
				input: adbInputSchemas.inspect_adb_display
			}),
			z.strictObject({
				operation: z.literal("inspect_adb_window"),
				input: adbInputSchemas.inspect_adb_window
			}),
			z.strictObject({
				operation: z.literal("read_adb_setting"),
				input: adbInputSchemas.read_adb_setting
			}),
			z.strictObject({
				operation: z.literal("collect_adb_bugreport"),
				input: adbInputSchemas.collect_adb_bugreport
			}),
			z.strictObject({
				operation: z.literal("resolve_adb_packages"),
				input: adbInputSchemas.resolve_adb_packages
			}),
			z.strictObject({
				operation: z.literal("install_adb_package"),
				input: adbInputSchemas.install_adb_package
			}),
			z.strictObject({
				operation: z.literal("uninstall_adb_package"),
				input: adbInputSchemas.uninstall_adb_package
			}),
			z.strictObject({
				operation: z.literal("start_adb_app"),
				input: adbInputSchemas.start_adb_app
			}),
			z.strictObject({
				operation: z.literal("start_adb_activity"),
				input: adbInputSchemas.start_adb_activity
			}),
			z.strictObject({
				operation: z.literal("stop_adb_app"),
				input: adbInputSchemas.stop_adb_app
			})
		]);
		client = z.strictObject({
			binary_path: z.string().min(1),
			path_source: z.enum(["environment", "path"]),
			version: z.string().min(1).nullable(),
			installed_path: z.string().min(1).nullable()
		});
		device = z.strictObject({
			serial: z.string().min(1),
			state: adbDeviceStateSchema,
			transport: z.enum([
				"usb",
				"tcp",
				"unknown"
			]),
			product: z.string().nullable(),
			model: z.string().nullable(),
			device: z.string().nullable(),
			transport_id: z.number().int().positive().nullable(),
			/**
			* Inferred device kind with its evidence basis. The serial prefix and the
			* `device:` metadata line are observations; the kind itself is derived.
			*/
			kind: z.enum([
				"emulator",
				"physical",
				"unknown"
			]),
			kind_basis: z.enum([
				"emulator_serial_prefix",
				"usb_transport",
				"none"
			])
		});
		pulledArtifact = z.strictObject({
			device_path: z.string().min(1),
			file_name: z.string().min(1),
			local_path: z.string().min(1),
			bytes: z.number().int().nonnegative(),
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			role: z.enum([
				"base",
				"split",
				"unknown"
			]),
			role_basis: z.literal("file_name")
		});
		pullFailure = z.strictObject({
			device_path: z.string().min(1).nullable(),
			stage: z.enum([
				"resolve_paths",
				"pull",
				"digest"
			]),
			message: z.string().min(1)
		});
		adbResultSchemas = {
			inspect_adb_client: z.strictObject({
				client,
				/**
				* `adb version` never contacts the adb server; this tool starts nothing.
				* Recorded explicitly so the session keeps the distinction observable.
				*/
				contacted_adb_server: z.literal(false)
			}),
			list_adb_devices: z.strictObject({
				client,
				devices: z.array(device),
				/**
				* Starting the local adb server is an adb client behavior on first use;
				* REA observes whichever server state the caller's environment has.
				*/
				may_have_started_adb_server: z.boolean()
			}),
			inspect_adb_device: z.strictObject({
				client,
				serial: z.string().min(1),
				properties: z.array(z.strictObject({
					name: z.string().min(1),
					value: z.string().min(1)
				})),
				property_count: z.number().int().nonnegative(),
				emulator_observed: z.boolean().nullable()
			}),
			list_adb_packages: z.strictObject({
				client,
				serial: z.string().min(1),
				scope: z.enum([
					"all",
					"third_party",
					"system"
				]),
				packages: z.array(z.strictObject({
					package_name: packageNameSchema,
					/** Device filesystem path; not a host-local path. */
					base_apk_device_path: z.string().min(1)
				})),
				unparsed_lines: z.array(z.string().min(1)),
				coverage: z.enum(["complete", "partial"])
			}),
			pull_adb_package: z.strictObject({
				client,
				serial: z.string().min(1),
				package_name: packageNameSchema,
				output_directory: z.string().min(1),
				artifacts: z.array(pulledArtifact),
				failures: z.array(pullFailure),
				coverage: z.enum(["complete", "partial"])
			}),
			read_adb_logcat: z.strictObject({
				client,
				serial: z.string().min(1),
				count: z.number().int().positive(),
				buffer: z.enum([
					"main",
					"system",
					"radio",
					"events",
					"crash"
				]),
				pid: z.number().int().positive().nullable(),
				lines: z.array(z.string()),
				total_bytes: z.number().int().nonnegative(),
				coverage: z.enum(["complete", "partial"])
			}),
			inspect_adb_package: z.strictObject({
				client,
				serial: z.string().min(1),
				package_name: packageNameSchema,
				version_name: z.string().nullable(),
				version_code: z.number().int().nullable(),
				first_install_time: z.string().nullable(),
				last_update_time: z.string().nullable(),
				installer_package_name: z.string().nullable(),
				user_id: z.number().int().nullable(),
				pkg_flags: z.string().nullable(),
				requested_permissions_count: z.number().int().nonnegative().nullable(),
				coverage: z.enum(["complete", "partial"])
			}),
			pull_adb_file: z.strictObject({
				client,
				serial: z.string().min(1),
				device_path: z.string().min(1),
				local_path: z.string().min(1),
				bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			push_adb_file: z.strictObject({
				client,
				serial: z.string().min(1),
				local_path: z.string().min(1),
				device_path: z.string().min(1),
				bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				device_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				overwritten: z.boolean(),
				device_digest_source: z.enum(["device_sha256sum", "unavailable"])
			}),
			capture_adb_screen: z.strictObject({
				client,
				serial: z.string().min(1),
				local_path: z.string().min(1),
				bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				width: z.number().int().positive().nullable(),
				height: z.number().int().positive().nullable()
			}),
			list_adb_processes: z.strictObject({
				client,
				serial: z.string().min(1),
				columns: z.string().nullable(),
				processes: z.array(z.strictObject({
					user: z.string(),
					pid: z.number().int().nonnegative(),
					ppid: z.number().int().nullable(),
					rss: z.number().int().nullable(),
					state: z.string().nullable(),
					name: z.string()
				})),
				unparsed_lines: z.array(z.string().min(1)),
				coverage: z.enum(["complete", "partial"])
			}),
			list_adb_directory: z.strictObject({
				client,
				serial: z.string().min(1),
				device_path: z.string().min(1),
				entries: z.array(z.strictObject({
					name: z.string().min(1),
					kind: z.enum([
						"directory",
						"file",
						"symlink",
						"other"
					]),
					permissions: z.string().nullable(),
					owner: z.string().nullable(),
					group: z.string().nullable(),
					bytes: z.number().int().nullable(),
					date: z.string().nullable(),
					link_target: z.string().nullable()
				})),
				unparsed_lines: z.array(z.string().min(1)),
				coverage: z.enum(["complete", "partial"])
			}),
			list_adb_features: z.strictObject({
				client,
				serial: z.string().min(1),
				features: z.array(z.strictObject({
					name: z.string().min(1),
					version: z.number().int().nullable()
				})),
				unparsed_lines: z.array(z.string().min(1)),
				coverage: z.enum(["complete", "partial"])
			}),
			list_adb_services: z.strictObject({
				client,
				serial: z.string().min(1),
				services: z.array(z.strictObject({
					name: z.string().min(1),
					interface: z.string().nullable()
				})),
				unparsed_lines: z.array(z.string().min(1)),
				coverage: z.enum(["complete", "partial"])
			}),
			inspect_adb_display: z.strictObject({
				client,
				serial: z.string().min(1),
				physical_size: z.strictObject({
					width: z.number().int().positive(),
					height: z.number().int().positive()
				}),
				override_size: z.strictObject({
					width: z.number().int().positive(),
					height: z.number().int().positive()
				}).nullable(),
				physical_density: z.number().int().positive().nullable(),
				override_density: z.number().int().positive().nullable()
			}),
			inspect_adb_window: z.strictObject({
				client,
				serial: z.string().min(1),
				focused_window: z.string().nullable(),
				focused_app: z.string().nullable(),
				observed_lines: z.array(z.string().min(1))
			}),
			read_adb_setting: z.strictObject({
				client,
				serial: z.string().min(1),
				namespace: z.enum([
					"system",
					"secure",
					"global"
				]),
				key: z.string().min(1),
				value: z.string().nullable(),
				device_reported_null: z.boolean()
			}),
			collect_adb_bugreport: z.strictObject({
				client,
				serial: z.string().min(1),
				local_path: z.string().min(1),
				bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				adb_reported_path: z.string().nullable()
			}),
			resolve_adb_packages: z.strictObject({
				client,
				serial: z.string().min(1),
				query: z.string().min(1),
				matches: z.array(z.strictObject({
					package_name: packageNameSchema,
					base_apk_device_path: z.string().min(1)
				})),
				exact_match: z.boolean(),
				coverage: z.enum(["complete", "partial"])
			}),
			install_adb_package: z.strictObject({
				client,
				serial: z.string().min(1),
				apk_path: z.string().min(1),
				bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				replace_requested: z.boolean(),
				replaced: z.boolean().nullable()
			}),
			uninstall_adb_package: z.strictObject({
				client,
				serial: z.string().min(1),
				package_name: packageNameSchema
			}),
			start_adb_app: z.strictObject({
				client,
				serial: z.string().min(1),
				package_name: packageNameSchema,
				component: z.string().min(1),
				started_activity: z.string().nullable(),
				reported_activity: z.string().nullable().optional(),
				reported_status: z.string().nullable().optional()
			}),
			start_adb_activity: z.strictObject({
				client,
				serial: z.string().min(1),
				action: z.string().min(1),
				data_uri: z.string().nullable(),
				component: z.string().nullable(),
				extras: z.array(z.strictObject({
					key: z.string().min(1),
					type: z.enum([
						"string",
						"boolean",
						"int",
						"long",
						"float"
					]),
					value: z.string()
				})),
				started_activity: z.string().nullable(),
				reported_activity: z.string().nullable().optional(),
				reported_status: z.string().nullable().optional()
			}),
			stop_adb_app: z.strictObject({
				client,
				serial: z.string().min(1),
				package_name: packageNameSchema
			})
		};
	})))();
}

//#endregion
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
			before_scenario: browserScenarioCaptureSchema$1.describe("Earlier complete normalized_result from capture_browser_scenario."),
			after_scenario: browserScenarioCaptureSchema$1.describe("Later complete normalized_result from capture_browser_scenario."),
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
//#region dist/domain/webScriptExport.js
var exportWebScriptsInputSchema, sourceSchema$1, exportedWebScriptSchema, webScriptExportManifestSchema, webScriptExportResultSchema;
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
		sourceSchema$1 = z.discriminatedUnion("kind", [z.strictObject({
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
			source: sourceSchema$1,
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
//#region dist/domain/webModuleTrace.js
var webModuleTraceInputSchema, webModuleFileSchema, positionSchema, webModuleImportSchema, webModuleResolutionSchema, candidateSchema, webModuleTraceResultSchema;
function init_webModuleTrace() {
	return (init_webModuleTrace = __esmMin((() => {
		init_digests();
		init_localPath();
		init_webScriptExport();
		webModuleTraceInputSchema = z.strictObject({
			manifest_path: localPathStringSchema.describe("Absolute path to an export_web_scripts manifest"),
			script_index: z.number().int().min(0).describe("Zero-based index in manifest.scripts"),
			importer_url: z.string().min(1).optional().describe("Explicit HTTP(S) module URL; useful when captured inline/base context is unknown"),
			import_map: z.strictObject({
				path: localPathStringSchema.describe("Absolute local import-map JSON path; no fetch"),
				base_url: z.string().min(1).describe("Explicit HTTP(S) base for the selected map")
			}).optional()
		});
		webModuleFileSchema = z.strictObject({
			path: z.string().min(1),
			sha256: digestSchema,
			bytes: z.number().int().min(0)
		});
		positionSchema = z.strictObject({
			offset: z.number().int().min(0),
			line: z.number().int().min(1),
			column: z.number().int().min(0)
		});
		webModuleImportSchema = z.strictObject({
			kind: z.enum([
				"static-import",
				"re-export",
				"dynamic-import"
			]),
			specifier: z.string().nullable(),
			expression: z.string(),
			start: positionSchema,
			end: positionSchema
		});
		webModuleResolutionSchema = z.discriminatedUnion("state", [z.strictObject({
			state: z.literal("resolved"),
			url: z.string().min(1)
		}), z.strictObject({
			state: z.literal("rejected"),
			message: z.string()
		})]);
		candidateSchema = z.strictObject({
			script_index: z.number().int().min(0),
			match: z.enum(["exact-reported-url", "response-url-without-fragment"]),
			script: exportedWebScriptSchema
		});
		webModuleTraceResultSchema = z.strictObject({
			manifest: webModuleFileSchema.extend({
				reported_output_directory: z.string(),
				...webScriptExportManifestSchema.pick({
					capture_path: true,
					capture_sha256: true,
					capture_kind: true,
					capture_completeness: true,
					source_evidence_id: true
				}).shape
			}),
			source: webModuleFileSchema.extend({
				script_index: z.number().int().min(0),
				script: exportedWebScriptSchema
			}),
			importer: z.strictObject({
				url: z.string().min(1),
				basis: z.enum(["caller-selected", "reported-source-url"])
			}),
			import_map: webModuleFileSchema.extend({ base_url: z.string().min(1) }).nullable(),
			parser: z.strictObject({
				state: z.enum(["parsed", "unparseable"]),
				diagnostics: z.array(z.string()),
				location_units: z.literal("UTF-16 offsets and columns; one-based lines")
			}),
			engine: z.strictObject({
				id: z.string().min(1),
				version: z.string().min(1)
			}).nullable(),
			imports: z.array(webModuleImportSchema.extend({
				resolution: z.union([webModuleResolutionSchema, z.strictObject({
					state: z.literal("unknown"),
					reason: z.literal("computed-specifier")
				})]),
				captured_candidates: z.array(candidateSchema),
				execution: z.literal("unknown")
			})),
			diagnostics: z.array(z.string()),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/webExecution.js
var observeWebExecutionInputSchema, rangeSchema$1, functionSchema, webExecutionSchema;
function init_webExecution() {
	return (init_webExecution = __esmMin((() => {
		init_jsonValue();
		init_webRuntime();
		init_browserObservationSchemas();
		observeWebExecutionInputSchema = webRuntimeScopeSchema.extend({ observation_ms: z.number().int().min(1).max(2147483647).default(1e4) });
		rangeSchema$1 = z.object({
			start_offset: z.number().int().min(0),
			end_offset: z.number().int().min(0),
			count: z.number().int().min(0),
			source_bounds: z.enum(["verified", "unknown"])
		});
		functionSchema = z.object({
			name: z.string(),
			is_block_coverage: z.boolean(),
			ranges: z.array(rangeSchema$1)
		});
		webExecutionSchema = z.object({
			browser: browserVersionSchema,
			target: webRuntimeTargetSchema,
			window: z.object({
				armed_at: z.iso.datetime(),
				ended_at: z.iso.datetime(),
				requested_ms: z.number().int().min(1),
				end_reason: z.enum([
					"window_elapsed",
					"document_changed",
					"target_terminated"
				]),
				producer_started_seconds: z.number().min(0),
				producer_sampled_seconds: z.number().min(0).nullable()
			}),
			coverage: z.object({
				state: z.enum(["captured", "unavailable"]),
				reason: z.string().nullable(),
				offset_units: z.literal("utf16-code-units"),
				end_offset: z.literal("exclusive"),
				scripts: z.array(z.object({
					script_id: z.string().min(1),
					reported_url: z.string(),
					functions: z.array(functionSchema)
				})),
				excluded_scripts: z.number().int().min(0)
			}),
			requests: z.array(z.object({
				request_id: z.string().min(1),
				url: z.string(),
				method: z.string(),
				timestamp_seconds: z.number().min(0),
				initiator_type: z.string(),
				reported_initiator: jsonObjectSchema,
				callsites: z.array(webRuntimeLocationSchema),
				async_parent_ids: z.array(z.object({
					id: z.string(),
					debugger_id: z.string().nullable()
				})),
				causal_attribution: z.literal("unknown")
			})),
			excluded_requests: z.number().int().min(0),
			script_inventory: z.object({
				main_document_scripts: z.number().int().min(0),
				not_reported_script_ids: z.array(z.string().min(1)),
				coverage_absence: z.literal("unknown")
			}),
			sources: z.array(webRuntimeSourceSchema),
			instrumentation: z.object({
				resets_execution_counters: z.literal(true),
				disables_optimized_execution: z.literal(true),
				takes_one_resetting_sample: z.boolean(),
				executes_selected_code: z.literal(false),
				cleanup: z.literal("confirmed"),
				page_ownership: z.literal("external")
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/webEventListeners.js
var inspectWebEventListenersInputSchema, webEventListenersSchema;
function init_webEventListeners() {
	return (init_webEventListeners = __esmMin((() => {
		init_webRuntime();
		init_browserObservationSchemas();
		inspectWebEventListenersInputSchema = webRuntimeScopeSchema.extend({ selector: z.string().min(1) });
		webEventListenersSchema = z.object({
			browser: browserVersionSchema,
			target: webRuntimeTargetSchema,
			inspected_at: z.iso.datetime(),
			selected_node: z.object({
				selector: z.string(),
				match: z.enum(["found", "not_found"]),
				backend_node_id: z.number().int().min(1).nullable()
			}),
			listeners: z.array(z.object({
				type: z.string(),
				use_capture: z.boolean(),
				passive: z.boolean(),
				once: z.boolean(),
				location: webRuntimeLocationSchema,
				execution: z.literal("unknown")
			})),
			sources: z.array(webRuntimeSourceSchema),
			cleanup: z.literal("confirmed"),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRecovery.js
var javascriptRecoveryInputSchema, fileSchema, rangeSchema, sourceSchema, javascriptRecoveryResultSchema;
function init_javascriptRecovery() {
	return (init_javascriptRecovery = __esmMin((() => {
		init_digests();
		init_javascriptApplicationAnalysis();
		init_localPath();
		javascriptRecoveryInputSchema = z.strictObject({
			path: localPathStringSchema.describe("Absolute path to a UTF-8 JavaScript file; never executed"),
			additional_paths: z.array(localPathStringSchema).max(16).optional().describe("Additional absolute UTF-8 JavaScript files recovered together with path; each is snapshotted separately so imports can resolve across related chunks. All inputs share a 64 MiB total budget"),
			output_directory: localPathStringSchema.describe("Absolute absent output directory; parent must exist"),
			extraction_mode: z.enum([
				"structural",
				"heuristic",
				"inspection"
			]).default("structural").describe("Structural module boundaries, heuristic fallback, or finer inspection-only regions"),
			rewrite_level: z.enum([
				"minimal",
				"standard",
				"aggressive"
			]).default("standard").describe("Upstream syntax recovery level; runtime equivalence remains unverified")
		});
		fileSchema = z.strictObject({
			path: z.string().min(1),
			sha256: digestSchema,
			bytes: z.number().int().nonnegative()
		});
		rangeSchema = z.strictObject({
			start: z.number().int().nonnegative(),
			end: z.number().int().nonnegative()
		});
		sourceSchema = fileSchema.extend({
			snapshot_path: z.string().min(1),
			published_copy: fileSchema
		});
		javascriptRecoveryResultSchema = z.strictObject({
			source: sourceSchema,
			additional_sources: z.array(sourceSchema).optional(),
			engine: z.strictObject({
				id: z.string().min(1),
				version: z.string().min(1),
				executable: fileSchema,
				audited_source_revision: z.string().min(1),
				executed_source_revision: z.string().nullable()
			}),
			options: z.strictObject({
				extraction_mode: javascriptRecoveryInputSchema.shape.extraction_mode.removeDefault(),
				rewrite_level: javascriptRecoveryInputSchema.shape.rewrite_level.removeDefault()
			}),
			status: z.enum(["complete", "partial"]),
			detected_formats: z.array(z.string()),
			reported_safety: z.string(),
			reported_strategy: z.string(),
			reported_format: z.string(),
			total: z.number().int().nonnegative(),
			failed: z.number().int().nonnegative(),
			modules: z.array(z.strictObject({
				reported_filename: z.string().min(1),
				reported_status: z.string().min(1),
				artifact: fileSchema,
				source_map: fileSchema.nullable(),
				provenance: z.strictObject({
					reported_input: z.string(),
					original_path: z.string(),
					original_sha256: digestSchema,
					extraction: z.string(),
					byte_ranges: z.array(rangeSchema),
					context_byte_ranges: z.array(rangeSchema),
					range_semantics: z.literal("half-open-utf8-bytes")
				})
			})),
			warnings: z.array(z.strictObject({
				filename: z.string(),
				kind: z.string(),
				is_error: z.boolean(),
				message: z.string()
			})),
			report: fileSchema,
			provenance: fileSchema,
			manifest: fileSchema,
			analysis_input: z.strictObject({
				input_path: analyzeJavaScriptApplicationInputSchema.shape.input_path,
				format: z.literal("directory")
			}).nullable(),
			runtime_equivalence: z.literal("unknown"),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/browserScenarioValues.js
var scenarioIdentifierSchema, browserExecutablePathSchema, browserScenarioBaseUrlSchema, browserScenarioValueSchema, queryEntrySchema, browserScenarioUrlSchema, browserScenarioBrowserSchema, browserScenarioEnvironmentSchema, locatorSchema, stepBase, browserScenarioActionSchema, storageEntrySchema, browserScenarioStorageSchema, browserScenarioSecretSchema, snapshotKindSchema, browserScenarioCaptureSchema;
function init_browserScenarioValues() {
	return (init_browserScenarioValues = __esmMin((() => {
		init_stringPatterns();
		init_localPath();
		init_browserNetworkEvidence();
		init_browserScenarioCaptureValues();
		init_browserObservation();
		scenarioIdentifierSchema = z.string().regex(IDENTIFIER_PATTERN);
		browserExecutablePathSchema = localPathStringSchema.refine(isAbsolute, { message: "executable_path must be an absolute local filesystem path (for example /opt/chromium/chrome or C:\\chromium\\chrome.exe)" });
		browserScenarioBaseUrlSchema = z.string().min(1).transform((value, context) => {
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				context.addIssue({
					code: "custom",
					message: "Invalid browser URL"
				});
				return z.NEVER;
			}
			if (url.protocol !== "http:" && url.protocol !== "https:" || url.username !== "" || url.password !== "") {
				context.addIssue({
					code: "custom",
					message: "Browser URLs must be HTTP(S) and omit credentials"
				});
				return z.NEVER;
			}
			return url.toString();
		});
		browserScenarioValueSchema = z.discriminatedUnion("source", [z.strictObject({
			source: z.literal("literal"),
			value: z.string()
		}), z.strictObject({
			source: z.literal("secret"),
			secret_id: scenarioIdentifierSchema
		})]);
		queryEntrySchema = z.strictObject({
			name: z.string().min(1),
			value: browserScenarioValueSchema
		});
		browserScenarioUrlSchema = z.strictObject({
			url: browserScenarioBaseUrlSchema,
			query: z.array(queryEntrySchema).default([])
		});
		browserScenarioBrowserSchema = z.discriminatedUnion("mode", [z.strictObject({
			mode: z.literal("launch"),
			executable_path: browserExecutablePathSchema.describe("Absolute local filesystem path for the browser executable; relative paths are rejected."),
			headless: z.boolean().default(true).describe("Run without a visible browser window; defaults to true and can be disabled when the host supports a display.")
		}), z.strictObject({
			mode: z.literal("connect"),
			cdp_endpoint: browserEndpointSchema,
			target_id: z.string().trim().min(1)
		})]);
		browserScenarioEnvironmentSchema = z.strictObject({
			viewport: z.strictObject({
				width: z.number().int().positive().default(1280),
				height: z.number().int().positive().default(720),
				device_scale_factor: z.number().positive().default(1)
			}).default({
				width: 1280,
				height: 720,
				device_scale_factor: 1
			}),
			locale: z.string().min(2).regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/u).default("en-US"),
			timezone: z.string().min(1).regex(/^[A-Za-z0-9_+\x2d]+(?:\x2f[A-Za-z0-9_+\x2d]+)*$/u).default("UTC"),
			color_scheme: z.enum([
				"light",
				"dark",
				"no-preference"
			]).default("light"),
			reduced_motion: z.enum(["reduce", "no-preference"]).default("reduce"),
			service_workers: z.enum(["allow", "block"]).default("block")
		}).default({
			viewport: {
				width: 1280,
				height: 720,
				device_scale_factor: 1
			},
			locale: "en-US",
			timezone: "UTC",
			color_scheme: "light",
			reduced_motion: "reduce",
			service_workers: "block"
		}).describe("Optional deterministic browser settings. Defaults to 1280x720, en-US, UTC, light mode, reduced motion, and blocked service workers.");
		locatorSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("test_id"),
				value: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("role"),
				role: z.enum([
					"button",
					"checkbox",
					"combobox",
					"dialog",
					"link",
					"listbox",
					"menuitem",
					"option",
					"radio",
					"slider",
					"spinbutton",
					"switch",
					"tab",
					"textbox"
				]),
				name: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("css"),
				selector: z.string().min(1)
			})
		]);
		stepBase = {
			step_id: scenarioIdentifierSchema,
			timeout_ms: z.number().int().min(1).optional().describe("Optional action deadline in milliseconds; omitted means wait until completion or request cancellation.")
		};
		browserScenarioActionSchema = z.discriminatedUnion("action", [
			z.strictObject({
				...stepBase,
				action: z.literal("goto"),
				destination: browserScenarioUrlSchema,
				wait_until: z.enum([
					"commit",
					"domcontentloaded",
					"load"
				])
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("click"),
				locator: locatorSchema,
				button: z.enum([
					"left",
					"middle",
					"right"
				]).default("left"),
				click_count: z.number().int().positive().default(1)
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("fill"),
				locator: locatorSchema,
				value: browserScenarioValueSchema
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("press"),
				locator: locatorSchema,
				key: z.string().min(1)
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("select_option"),
				locator: locatorSchema,
				value: browserScenarioValueSchema
			}),
			z.strictObject({
				...stepBase,
				action: z.enum(["check", "uncheck"]),
				locator: locatorSchema
			}),
			z.strictObject({
				...stepBase,
				action: z.literal("wait_for"),
				locator: locatorSchema,
				state: z.enum([
					"attached",
					"detached",
					"visible",
					"hidden"
				])
			}),
			z.strictObject({
				step_id: scenarioIdentifierSchema,
				action: z.literal("wait_for_timeout"),
				duration_ms: z.number().int().min(1).describe("Wait this many milliseconds; the wait ends early on cancellation.")
			})
		]);
		storageEntrySchema = z.strictObject({
			name: z.string().min(1),
			value: browserScenarioValueSchema
		});
		browserScenarioStorageSchema = z.strictObject({
			cookies: z.array(z.strictObject({
				name: z.string().min(1),
				value: browserScenarioValueSchema,
				destination: browserScenarioUrlSchema,
				http_only: z.boolean(),
				secure: z.boolean(),
				same_site: z.enum([
					"Strict",
					"Lax",
					"None"
				])
			})).default([]),
			local_storage: z.array(z.strictObject({
				origin: browserOriginSchema,
				entries: z.array(storageEntrySchema)
			})).default([]),
			session_storage: z.array(z.strictObject({
				origin: browserOriginSchema,
				entries: z.array(storageEntrySchema)
			})).default([])
		}).default({
			cookies: [],
			local_storage: [],
			session_storage: []
		}).describe("Optional initial cookies, local storage, or session storage. Defaults to empty; every supplied value and origin must be declared and within the allowed origins.");
		browserScenarioSecretSchema = z.strictObject({
			secret_id: scenarioIdentifierSchema,
			environment_variable: z.string().min(1).refine((name) => !name.includes("=") && !name.includes("\0"), "Environment variable names cannot contain '=' or NUL")
		});
		snapshotKindSchema = z.enum([
			"screenshot",
			"dom",
			"accessibility",
			"url",
			"history",
			"storage"
		]);
		browserScenarioCaptureSchema = z.strictObject({
			after_each_step: z.array(snapshotKindSchema).default([]),
			at_end: z.array(snapshotKindSchema).default(["url"]),
			events: z.array(browserScenarioEventFamilySchema).default([]),
			network: browserNetworkContentSelectionSchema
		}).default({
			after_each_step: [],
			at_end: ["url"],
			events: [],
			network: {
				request_body: false,
				response_body: false,
				header_values: false
			}
		}).describe("Optional retained artifacts and event families. Defaults to only a final sanitized URL; request screenshots, DOM, accessibility, history, storage, and event capture explicitly.");
	})))();
}

//#endregion
//#region dist/domain/browserScenario.js
var browserScenarioInputSchema, addIssue, assertUnique, secretReferencesInValue, destinationSecretReferences, actionSecretReferences, validateStorage, validateSecretReferences, validateBrowserScenario, browserScenarioSchema;
function init_browserScenario() {
	return (init_browserScenario = __esmMin((() => {
		init_browserScenarioValues();
		browserScenarioInputSchema = z.strictObject({
			browser: browserScenarioBrowserSchema.describe("Required launch/connect selection. Launch uses the selected executable and an owned temporary profile; connect uses one loopback CDP endpoint and target."),
			start_url: browserScenarioUrlSchema.describe("Required initial HTTP(S) URL. Query values must be declared separately as public literals or secret references."),
			environment: browserScenarioEnvironmentSchema,
			actions: z.array(browserScenarioActionSchema).min(1).describe("Required sequence of explicit browser actions."),
			storage: browserScenarioStorageSchema,
			secrets: z.array(browserScenarioSecretSchema).default([]).describe("Optional environment-variable references for values used in actions, URLs, storage, or replay, and for redacting matching observed text. Secret values are never supplied inline."),
			capture: browserScenarioCaptureSchema
		});
		addIssue = (context, path, message) => context.addIssue({
			code: "custom",
			path,
			message
		});
		assertUnique = (values, path, label, context) => {
			if (new Set(values).size !== values.length) addIssue(context, path, `${label} must be unique`);
		};
		secretReferencesInValue = (value) => value?.source === "secret" ? [value.secret_id] : [];
		destinationSecretReferences = (destination) => destination.query.flatMap(({ value }) => secretReferencesInValue(value));
		actionSecretReferences = (action) => {
			if (action.action === "fill" || action.action === "select_option") return secretReferencesInValue(action.value);
			if (action.action === "goto") return destinationSecretReferences(action.destination);
			return [];
		};
		validateStorage = (scenario) => {
			const references = [];
			scenario.storage.cookies.forEach((cookie) => {
				references.push(...secretReferencesInValue(cookie.value));
				references.push(...destinationSecretReferences(cookie.destination));
			});
			for (const collection of ["local_storage", "session_storage"]) scenario.storage[collection].forEach((storage) => {
				for (const entry of storage.entries) references.push(...secretReferencesInValue(entry.value));
			});
			return references;
		};
		validateSecretReferences = (scenario, references, context) => {
			const declared = new Set(scenario.secrets.map(({ secret_id: id }) => id));
			for (const reference of references) if (!declared.has(reference)) addIssue(context, ["secrets"], `Secret reference ${reference} is not declared`);
		};
		validateBrowserScenario = (scenario, context) => {
			assertUnique(scenario.actions.map(({ step_id: id }) => id), ["actions"], "Action step IDs", context);
			assertUnique(scenario.secrets.map(({ secret_id: id }) => id), ["secrets"], "Secret IDs", context);
			assertUnique(scenario.secrets.map(({ environment_variable: name }) => name), ["secrets"], "Secret environment variables", context);
			const references = scenario.actions.flatMap(actionSecretReferences);
			references.push(...destinationSecretReferences(scenario.start_url));
			references.push(...validateStorage(scenario));
			validateSecretReferences(scenario, references, context);
		};
		browserScenarioSchema = browserScenarioInputSchema.superRefine(validateBrowserScenario);
	})))();
}

//#endregion
//#region dist/domain/reverseEngineering.js
var objdumpArtifactInputSchema, objdumpInputSchema, rizinInputSchema;
function init_reverseEngineering() {
	return (init_reverseEngineering = __esmMin((() => {
		objdumpArtifactInputSchema = z.object({
			path: z.string().min(1),
			operation: z.enum([
				"file_headers",
				"section_headers",
				"symbols",
				"relocations",
				"dwarf",
				"disassemble",
				"disassemble_all"
			]),
			follow_debug_links: z.boolean().default(false)
		}).strict();
		objdumpInputSchema = z.discriminatedUnion("operation", [objdumpArtifactInputSchema, z.strictObject({ operation: z.literal("architectures") })]);
		rizinInputSchema = z.object({
			path: z.string().min(1),
			command: z.string().min(1).refine((value) => !/[\r\n\u0000]/u.test(value), "A single command line is required")
		}).strict();
	})))();
}

//#endregion
//#region dist/contracts/cutterToolContracts.js
var cutterListInputSchema, cutterCommandInputSchema, cutterSessionSchema, cutterCommandResultSchema, cutterDiscoverySchema, CUTTER_TOOL_CONTRACTS;
function init_cutterToolContracts() {
	return (init_cutterToolContracts = __esmMin((() => {
		init_jsonValue();
		init_toolOutputSchemaPrimitives();
		init_toolEffects();
		cutterListInputSchema = z.strictObject({});
		cutterCommandInputSchema = z.strictObject({
			session_id: z.string().uuid(),
			expected_generation: z.number().int().nonnegative(),
			command: z.string().min(1).refine((value) => !/[\r\n]/u.test(value), "A single Rizin command line is required"),
			json: z.boolean().default(false)
		});
		cutterSessionSchema = z.strictObject({
			session_id: z.string().uuid(),
			pid: z.number().int().positive(),
			document_generation: z.number().int().nonnegative(),
			current_file: z.string().nullable(),
			cutter_version: z.string().nullable(),
			identity_status: z.literal("partial")
		});
		cutterCommandResultSchema = z.strictObject({
			command: z.string(),
			output: jsonValueSchema.nullable(),
			execution_state: z.enum([
				"not_started",
				"complete",
				"failed",
				"unknown"
			]),
			error: z.string().nullable(),
			message: z.string().nullable(),
			output_truncated: z.boolean(),
			cutter_version: z.string().nullable(),
			current_file: z.string().nullable(),
			document_generation: z.number().int().nonnegative(),
			identity_status: z.literal("partial")
		});
		cutterDiscoverySchema = z.strictObject({
			sessions: z.array(cutterSessionSchema),
			bridge_directory: z.string(),
			discovery_status: z.enum([
				"sessions_found",
				"no_live_bridge_found",
				"bridge_directory_unavailable",
				"bridge_directory_insecure",
				"bridge_directory_capacity_exceeded"
			]),
			bridge_directory_security: z.enum([
				"private_verified",
				"not_private",
				"unverified_platform_acl",
				"not_checked"
			])
		});
		CUTTER_TOOL_CONTRACTS = [{
			name: "list_cutter_sessions",
			...toolContractMetadata("list_cutter_sessions"),
			kind: "native-provider",
			description: "List live REA bridge sessions hosted by upstream Cutter instances, including observed document identity and bridge-directory security status. Discovery admits at most 256 descriptor candidates (16 MiB at the descriptor byte limit), reads and probes at most eight concurrently, and reports bridge_directory_capacity_exceeded rather than claiming no sessions when that budget is exceeded.",
			inputSchema: cutterListInputSchema,
			outputSchema: cutterDiscoverySchema,
			examples: [{
				title: "List open Cutter instances",
				input: {}
			}]
		}, {
			name: "cutter_command",
			...toolContractMetadata("cutter_command"),
			kind: "native-provider",
			description: "Run one arbitrary Rizin command in a selected live Cutter session. Commands may edit and persist analysis state or execute plugin-provided effects; completion uncertainty is returned as Evidence and must not be retried automatically. In a shared MCP server, this admitted command closes any active binary-analysis session; after its effects have settled, call open_binary before further analysis. Close an active Ghidra session explicitly first.",
			inputSchema: cutterCommandInputSchema,
			outputSchema: evidenceResultOf(cutterCommandResultSchema),
			examples: [{
				title: "Inspect active binary metadata",
				input: {
					session_id: "00000000-0000-4000-8000-000000000001",
					expected_generation: 0,
					command: "ij",
					json: true
				}
			}]
		}];
	})))();
}

//#endregion
export { ADB_DEVICE_STATES, CUTTER_TOOL_CONTRACTS, EVM_TOOL_CONTRACTS, FRIDA_KEEPALIVE_INTERVAL_DESCRIPTION, FRIDA_TOOL_CONTRACTS, INSPECT_EVM_INTERFACE_CONTRACT, INSPECT_WASM_ARTIFACT_CONTRACT, NATIVE_TOOL_CONTRACTS, RECORDED_LINUX_CORE_PROFILES, RUST_AUDITABLE_FORMAT_VERSIONS, SQLITE_PROVIDER_IDENTITY, WASM_TOOL_CONTRACTS, WEB_SOURCE_MAP_LIMITS, adbInputSchemas, adbRequestSchema, adbResultSchemas, addressContextInputSchema, analyzeWebBundleInputSchema, androidLocaleQualifierSchema, apktoolInputSchemas, apktoolRequestSchema, apktoolResultSchemas, browserCaptureComparisonInputSchema, browserCaptureComparisonSchema, browserScenarioInputSchema, browserScenarioSchema, commitBrowserScenarioNormalization, compareBrowserCaptures, compareBrowserScenariosInputSchema, compareWasmInterfacesInputSchema, compareWebCapturesInputSchema, cutterCommandInputSchema, cyclicDependencyIndices, decodeSignalRecordingInputSchema, discoverWebMcpToolsInputSchema, evidenceInputSchema, exportWebScriptsInputSchema, firmwareInputSchemas, firmwareRequestSchema, firmwareResultSchemas, getEvidenceBundleInputSchema, goBinarySchema, importEvidenceBundleInputSchema, init_adbDeviceAnalysis, init_annotationTextWindow, init_apktoolResourceAnalysis, init_browserCaptureComparison, init_browserScenario, init_browserScenarioDiffValues, init_browserScenarioNormalization, init_browserSession, init_cutterToolContracts, init_evidenceInputContracts, init_evmToolContracts, init_firmwareAnalysis, init_fridaRemoteAddress, init_fridaToolContracts, init_goBinary, init_javascriptRecovery, init_jebAnalysis, init_nativeToolContracts, init_packetCapture, init_packetFields, init_peResources, init_recordedCrash, init_reverseEngineering, init_rustBinary, init_sessionToolSchemas, init_signalDecoders, init_signalRecording, init_sqliteDatabase, init_wasmComparisonContracts, init_wasmToolContracts, init_webBundleAnalysis, init_webCaptureDiffSchemas, init_webEventListeners, init_webExecution, init_webMcpDiscovery, init_webModuleTrace, init_webScriptArtifacts, init_webScriptExport, init_webSourceLocation, inspectGoBinaryInputSchema, inspectPacketCaptureInputSchema, inspectPacketFieldsInputSchema, inspectPeResourcesInputSchema, inspectRecordedCrashInputSchema, inspectRustBinaryInputSchema, inspectSignalDecodersInputSchema, inspectSqliteDatabaseInputSchema, inspectWebEventListenersInputSchema, isValidFridaRemoteAddress, javascriptRecoveryInputSchema, javascriptRecoveryResultSchema, jebInputSchemas, jebRequestSchema, jebResultSchemas, listUnknownsInputSchema, navigationContextInputSchema, objdumpInputSchema, observeWebExecutionInputSchema, observeWebSessionInputSchema, packetCaptureOptionsSchema, packetCaptureSchema, packetCaptureSelectorBudgetIssue, packetFieldsCatalogSchema, packetFieldsSchema, peResourcesSchema, processComparisonInputSchema, recordedCrashDebuggerSchema, recordedCrashPayloadSchema, recordedCrashSchema, rizinInputSchema, rustBinarySchema, selectedWebScriptArtifactsSchema, signalDecodersSchema, signalRecordingOptionsSchema, signalRecordingSchema, signalRecordingSelectorBudgetIssue, sqliteDatabaseSchema, sqliteInspectionParameters, sqliteSchemaScope, swiftSymbolsSchema, verifyUnknownResolutionInputSchema, wasmInterfaceComparisonSchema, webArtifactFileSchema, webBundleAnalysisSchema, webEventListenersSchema, webExecutionSchema, webMcpDiscoverySchema, webModuleFileSchema, webModuleResolutionSchema, webModuleTraceInputSchema, webModuleTraceResultSchema, webObservationSessionSchema, webScriptExportManifestSchema, webScriptExportResultSchema, webSourceLocationInputSchema, webSourceLocationResultSchema, webSourceMapReportSchema, webSourceMapsSchema, webSourcePositionSchema, windowAnnotationText, withinPacketCaptureSelectorBudget, withinSignalRecordingSelectorBudget };