import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { BINARY_ARCHITECTURES as BINARY_ARCHITECTURES$1, CANONICAL_BASE64_PATTERN, IDENTIFIER_PATTERN, addressCoordinate, addressList, addressedEntry, addressedValue, analysisBookmarkSchema, analysisInputErrorFromIssues, analysisStringSchema, artifactEdgeSchema, artifactExtractionResultSchema, artifactGraphManifestSchema, artifactInspectionOutputSchema, artifactInspectionResultSchema, artifactNodeSchema, artifactOccurrenceSchema, canonicalJson as canonicalJson$1, compareUnicodeCodePoints, compositeKey, containingProcedureResolution, decodeCanonicalBase64, digestCanonicalValue, digestSchema, emptyArraySchema, err, evidenceBundleSchema, evidenceResultOf, evidenceSchema, functionComparisonResultSchema, functionDossierOutput, functionDossierSchema, functionInstructionWindowSchema, graphNode, hasCompleteInventoryCoverage, init_addressCoordinate, init_artifactGraph, init_artifactInspection, init_artifactInventoryEvidence, init_binaryTargetTypes, init_canonicalDigest, init_canonicalOrdering, init_comparisonSemantics, init_digests, init_emptyArraySchema, init_evidence, init_evidenceBundle, init_functionComparisonSchemas, init_hopperValues, init_inputIssueProjection, init_interfaceBuilderGraph, init_localPath, init_machoCpuIdentity, init_nativeApiBoundary, init_nativeInstruction, init_nativeInvestigationGraph, init_nativeValueTrace, init_objcSwiftMetadata, init_processCapture, init_processCaptureCoverage, init_recordedTransportUrl, init_relationshipCoverage, init_residualUnknown, init_result, init_stringPatterns, init_toolOutputSchemaPrimitives, init_unicodeCodePointOrder, init_webScreenshot, integrityContradictionSchema, interfaceBuilderAnalysisSchema, interfaceBuilderDocumentSchema, isMachOFormat, lifecycleResultOf, localPathStringSchema, machoCpuSubtypeBase, nativeApiInspectionResultSchema, nativeCallTargetsSchema, nativeDispatchMetadataResultSchema, nativeInstructionSchema, nativeInvestigationCoverageSchema, nativeInvestigationEdgeSchema, nativeInvestigationNodeSchema, nativeInvestigationTraceSchema, nativeValueTraceSchema, nullableText, ok, parseArtifactInventoryEvidence, parseArtifactInventoryResult, parseEvidence, parseEvidenceBundle, parseRecordedTransportUrl, parseUrlQueryParameterNames, prefixedDigestSchema, procedureIdentitySchema, procedureInfoOutput, processCaptureSchema, processSourceTruncated, referenceEdgeSchema, relationshipCoverageSchema, residualUnknownSchema, segmentOutput, serializeEvidenceBundle, sessionProvider, symbolDiscoveryOutput, targetFormatSchema, targetKindSchema, uniqueSorted, unresolvedCallSchema, validateArtifactInventorySubject } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisInputError, AnalysisOutputError, AnalysisResourceConstraintError, AnalysisUnsupportedTargetError, MAX_JSON_DEPTH, analysisErrorProjectionSchema, init_analysisErrorCore, init_errorSchemas, init_jsonValue, jsonObjectSchema, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { init_javascriptApplicationAnalysis, init_javascriptSourceSelection, javaScriptSourceSelectionSchema, parseOwnedJavaScriptApplicationAnalysisSteps } from "./javascriptApplicationAnalysis-HgMzVMQw.js";
import { cliMetadataGuidSchema, init_managedApplicationGraph, init_managedArtifact, init_managedInspectionEvidence, managedApplicationGraphResultSchema, managedArtifactInspectionSchema, managedMemberInspectionSchema, managedNativeBoundaryInspectionSchema, parseManagedInspectionEvidence } from "./managedApplicationGraph-B08jb3jq.js";
import { z } from "zod";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";

//#region dist/domain/wasm/wasmInterface.js
var kind, valueType, limit, signature, wasmInterfaceSchema, WASM_INTERFACE_REPRESENTATION_BYTES, wasmInterfaceEntryRepresentationBytes;
function init_wasmInterface() {
	return (init_wasmInterface = __esmMin((() => {
		kind = z.enum([
			"func",
			"table",
			"memory",
			"global",
			"tag",
			"unknown"
		]);
		valueType = z.enum([
			"i32",
			"i64",
			"f32",
			"f64",
			"v128",
			"funcref",
			"externref"
		]);
		limit = z.string().regex(/^(?:0|[1-9][0-9]*)$/u);
		signature = z.discriminatedUnion("kind", [
			z.object({
				kind: z.literal("func"),
				params: z.array(valueType),
				results: z.array(valueType)
			}),
			z.object({
				kind: z.literal("tag"),
				params: z.array(valueType),
				results: z.array(valueType)
			}),
			z.object({
				kind: z.literal("table"),
				element: z.enum(["funcref", "externref"]),
				address_type: z.enum(["i32", "i64"]),
				minimum: limit,
				maximum: limit.nullable(),
				shared: z.boolean()
			}),
			z.object({
				kind: z.literal("memory"),
				page_size: limit,
				address_type: z.enum(["i32", "i64"]),
				minimum: limit,
				maximum: limit.nullable(),
				shared: z.boolean()
			}),
			z.object({
				kind: z.literal("global"),
				value_type: valueType,
				mutable: z.boolean()
			})
		]);
		wasmInterfaceSchema = z.object({
			state: z.enum(["complete", "partial"]),
			entries: z.array(z.object({
				direction: z.enum(["import", "export"]),
				module: z.string().nullable(),
				name: z.string(),
				kind,
				index: z.number().int().nonnegative().max(4294967295).nullable(),
				signature: signature.nullable(),
				wat_form: z.string(),
				issue: z.string().nullable()
			}).superRefine((entry, context) => {
				if (entry.direction === "export" && entry.module !== null || entry.direction === "import" && entry.module === null) context.addIssue({
					code: "custom",
					message: "Interface direction does not match module-name presence"
				});
				if (entry.signature !== null && entry.signature.kind !== entry.kind) context.addIssue({
					code: "custom",
					message: "Interface kind does not match its typed signature"
				});
			})),
			issues: z.array(z.string())
		});
		WASM_INTERFACE_REPRESENTATION_BYTES = 32 * 1024 * 1024;
		wasmInterfaceEntryRepresentationBytes = (entry) => {
			let bytes = 1024 + [
				entry.module,
				entry.name,
				entry.wat_form,
				entry.issue
			].reduce((sum, value) => sum + (value?.length ?? 0) * 6, 0);
			const signature = entry.signature;
			if (signature?.kind === "func" || signature?.kind === "tag") bytes += (signature.params.length + signature.results.length) * 16;
			else if (signature !== null) {
				for (const value of Object.values(signature)) if (typeof value === "string") bytes += value.length * 6;
			}
			return bytes;
		};
	})))();
}

//#endregion
//#region dist/contracts/toolEffects.js
var effects, evidence, nativeEvidence, browserEvidence, sessionEvidence, TOOL_EFFECTS, annotationsFromEffects, TARGET_CONTENT_FREE_TOOLS, toolReturnsTargetContent, toolContractMetadata;
function init_toolEffects() {
	return (init_toolEffects = __esmMin((() => {
		effects = (overrides = {}) => ({
			mutatesTarget: false,
			mutatesSession: false,
			writesFilesystem: false,
			launchesProcess: false,
			accessesNetwork: false,
			changesUiState: false,
			mayDiscardData: false,
			executesForeignCode: false,
			mutatesDevice: false,
			idempotent: true,
			...overrides
		});
		evidence = effects({ mutatesSession: true });
		nativeEvidence = effects({
			mutatesSession: true,
			launchesProcess: true
		});
		browserEvidence = effects({
			mutatesSession: true,
			accessesNetwork: true
		});
		sessionEvidence = effects({ mutatesSession: true });
		TOOL_EFFECTS = {
			list_cutter_sessions: effects({ accessesNetwork: true }),
			cutter_command: effects({
				mutatesTarget: true,
				executesForeignCode: true,
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				changesUiState: true,
				idempotent: false
			}),
			inspect_with_objdump: effects({
				mutatesSession: true,
				launchesProcess: true
			}),
			start_gdb_session: effects({
				launchesProcess: true,
				mutatesSession: true,
				idempotent: false
			}),
			gdb_console: effects({
				mutatesTarget: true,
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				executesForeignCode: true,
				idempotent: false
			}),
			gdb_session_status: effects(),
			start_rizin_debug_session: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				executesForeignCode: true,
				idempotent: false
			}),
			rizin_debug_command: effects({
				mutatesTarget: true,
				mutatesSession: true,
				executesForeignCode: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				changesUiState: true,
				mayDiscardData: true,
				idempotent: false
			}),
			rizin_debug_session_status: effects({ mutatesSession: true }),
			close_rizin_debug_session: effects({
				mutatesSession: true,
				launchesProcess: true,
				mutatesTarget: true,
				executesForeignCode: true
			}),
			close_gdb_session: effects({
				launchesProcess: true,
				mutatesSession: true,
				mutatesTarget: true,
				executesForeignCode: true,
				idempotent: false
			}),
			execute_rizin_command: effects({
				mutatesTarget: true,
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				mayDiscardData: true,
				executesForeignCode: true,
				idempotent: false
			}),
			inspect_go_binary: evidence,
			inspect_rust_binary: evidence,
			inspect_sqlite_database: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			inspect_packet_fields: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_packet_capture: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_signal_decoders: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			decode_signal_recording: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_wasm_artifact: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			inspect_evm_interface: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			inspect_web_network_capture: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			observe_web_execution: effects({
				mutatesTarget: true,
				mutatesSession: true,
				accessesNetwork: true,
				mayDiscardData: true,
				idempotent: false
			}),
			inspect_web_event_listeners: browserEvidence,
			trace_web_source_location: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			trace_web_module_imports: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			inspect_recorded_crash: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			inspect_binary_layout: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true
			}),
			list_frida_devices: effects({
				launchesProcess: true,
				accessesNetwork: true
			}),
			list_frida_processes: effects({
				launchesProcess: true,
				accessesNetwork: true
			}),
			start_frida_session: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				idempotent: false
			}),
			load_frida_script: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				executesForeignCode: true,
				idempotent: false
			}),
			resume_frida_session: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				executesForeignCode: true,
				idempotent: false
			}),
			unload_frida_script: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				idempotent: false
			}),
			frida_session_status: effects(),
			close_frida_session: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				idempotent: false
			}),
			instrument_with_frida: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				executesForeignCode: true,
				idempotent: false
			}),
			inspect_pe_resources: evidence,
			inspect_analysis_view: evidence,
			inspect_firmware_regions: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			extract_firmware: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				idempotent: false
			}),
			inspect_android_package: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_pcap_client: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_pcap_capture: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			identify_flutter_build: effects({
				mutatesSession: true,
				writesFilesystem: true
			}),
			inspect_dart_aot: effects({
				mutatesSession: true,
				writesFilesystem: true
			}),
			inspect_apktool_client: effects({
				mutatesSession: true,
				launchesProcess: true
			}),
			decode_android_resources: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_jeb_client: effects({
				mutatesSession: true,
				accessesNetwork: true
			}),
			open_jeb_project: effects({
				mutatesSession: true,
				accessesNetwork: true,
				idempotent: false
			}),
			list_jeb_units: effects({
				mutatesSession: true,
				accessesNetwork: true
			}),
			decompile_jeb_item: effects({
				mutatesSession: true,
				accessesNetwork: true
			}),
			inspect_adb_client: effects({
				mutatesSession: true,
				launchesProcess: true
			}),
			list_adb_devices: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			inspect_adb_device: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			list_adb_packages: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			pull_adb_package: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				accessesNetwork: true,
				idempotent: false
			}),
			read_adb_logcat: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			inspect_adb_package: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			pull_adb_file: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				accessesNetwork: true,
				idempotent: false
			}),
			push_adb_file: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				accessesNetwork: true,
				mutatesDevice: true,
				idempotent: false
			}),
			capture_adb_screen: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				accessesNetwork: true,
				idempotent: false
			}),
			list_adb_processes: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			list_adb_directory: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			list_adb_features: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			list_adb_services: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			inspect_adb_display: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			inspect_adb_window: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			read_adb_setting: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			collect_adb_bugreport: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				accessesNetwork: true,
				idempotent: false
			}),
			resolve_adb_packages: effects({
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true
			}),
			install_adb_package: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				mutatesDevice: true,
				idempotent: false
			}),
			uninstall_adb_package: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				mutatesDevice: true,
				idempotent: false
			}),
			start_adb_app: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				mutatesDevice: true,
				idempotent: false
			}),
			start_adb_activity: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				mutatesDevice: true,
				idempotent: false
			}),
			stop_adb_app: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				mutatesDevice: true,
				idempotent: false
			}),
			search_android_classes: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_android_class: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			inspect_android_method: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			trace_android_references: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			annotate_native_function: effects({
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true,
				mayDiscardData: true
			}),
			inspect_native_load_image: evidence,
			inspect_native_dispatch_metadata: evidence,
			trace_native_ui_action: evidence,
			trace_native_values: evidence,
			address_name: evidence,
			comment: evidence,
			current_address: evidence,
			current_procedure: evidence,
			current_document: evidence,
			goto_address: effects({
				mutatesSession: true,
				changesUiState: true
			}),
			inline_comment: evidence,
			list_bookmarks: evidence,
			list_documents: evidence,
			list_names: evidence,
			list_procedures: evidence,
			list_segments: evidence,
			list_strings: evidence,
			next_address: evidence,
			prev_address: evidence,
			procedure_address: evidence,
			procedure_assembly: evidence,
			procedure_callees: evidence,
			procedure_callers: evidence,
			procedure_info: evidence,
			read_function_instructions: evidence,
			inspect_native_instruction: evidence,
			inspect_native_data_type: evidence,
			resolve_native_call_targets: evidence,
			read_bytes: evidence,
			search_bytes: evidence,
			address_to_file_offset: evidence,
			procedure_references: evidence,
			procedure_pseudo_code: evidence,
			resolve_containing_procedure: evidence,
			search_procedures: evidence,
			search_strings: evidence,
			set_address_name: effects({
				mutatesTarget: true,
				mutatesSession: true,
				mayDiscardData: true
			}),
			set_addresses_names: effects({
				mutatesTarget: true,
				mutatesSession: true,
				mayDiscardData: true
			}),
			set_bookmark: effects({
				mutatesTarget: true,
				mutatesSession: true,
				mayDiscardData: true
			}),
			set_comment: effects({
				mutatesTarget: true,
				mutatesSession: true,
				mayDiscardData: true
			}),
			set_inline_comment: effects({
				mutatesTarget: true,
				mutatesSession: true,
				mayDiscardData: true
			}),
			unset_bookmark: effects({
				mutatesTarget: true,
				mutatesSession: true,
				mayDiscardData: true
			}),
			xrefs: evidence,
			get_objc_classes: evidence,
			get_objc_protocols: evidence,
			batch_decompile: evidence,
			get_call_graph: evidence,
			analyze_swift_types: evidence,
			find_xrefs_to_name: evidence,
			binary_overview: evidence,
			analyze_function: evidence,
			inspect_native_api: effects({
				mutatesSession: true,
				idempotent: false
			}),
			trace_feature: effects({
				mutatesSession: true,
				idempotent: false
			}),
			trace_call_path: effects({
				mutatesSession: true,
				idempotent: false
			}),
			observe_native_ui: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			capture_native_ui_scenario: effects({
				writesFilesystem: true,
				mutatesTarget: true,
				mutatesSession: true,
				launchesProcess: true,
				accessesNetwork: true,
				changesUiState: true,
				mayDiscardData: true,
				executesForeignCode: true,
				idempotent: false
			}),
			observe_native_calls: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				changesUiState: true,
				executesForeignCode: true,
				idempotent: false
			}),
			inspect_macho: nativeEvidence,
			inspect_signature: nativeEvidence,
			inspect_plist: nativeEvidence,
			list_architectures: nativeEvidence,
			demangle_swift: nativeEvidence,
			inspect_artifact: effects({
				mutatesSession: true,
				launchesProcess: true,
				writesFilesystem: true
			}),
			extract_artifact: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				idempotent: false
			}),
			decode_interface_builder: evidence,
			inspect_asset_catalog: nativeEvidence,
			inspect_keyed_archive: evidence,
			trace_dylib_resolution: evidence,
			inspect_managed_artifact: evidence,
			inspect_managed_members: evidence,
			inspect_managed_native_boundaries: evidence,
			compare_managed_members: sessionEvidence,
			verify_managed_native_boundaries: sessionEvidence,
			import_managed_reconstruction: sessionEvidence,
			project_managed_application_graph: sessionEvidence,
			list_browser_targets: browserEvidence,
			inspect_web_page: browserEvidence,
			analyze_web_bundle: browserEvidence,
			observe_web_session: browserEvidence,
			discover_webmcp_tools: browserEvidence,
			compare_web_captures: sessionEvidence,
			capture_web_screenshot: browserEvidence,
			compare_web_screenshots: sessionEvidence,
			capture_browser_scenario: effects({
				mutatesTarget: true,
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				changesUiState: true,
				mayDiscardData: true,
				executesForeignCode: true,
				idempotent: false
			}),
			list_electron_targets: browserEvidence,
			inspect_electron_page: browserEvidence,
			capture_electron_scenario: effects({
				mutatesTarget: true,
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				changesUiState: true,
				mayDiscardData: true,
				executesForeignCode: true,
				idempotent: false
			}),
			list_javascript_runtime_targets: browserEvidence,
			observe_javascript_runtime: browserEvidence,
			analyze_javascript_application: evidence,
			inspect_electron_fuses: evidence,
			export_web_scripts: effects({
				mutatesSession: true,
				writesFilesystem: true,
				idempotent: false
			}),
			reconcile_javascript_runtime: evidence,
			recover_javascript_sources: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				idempotent: false
			}),
			trace_application_feature: evidence,
			trace_javascript_semantics: evidence,
			compare_application_versions: evidence,
			compare_source_to_bundle: evidence,
			compare_javascript_export_shapes: evidence,
			build_reconstruction_obligation_ledger: evidence,
			evaluate_reconstruction_coverage: effects(),
			project_android_application_graph: evidence,
			project_apple_application_graph: evidence,
			project_harmony_application_graph: evidence,
			open_binary: effects({
				mutatesSession: true,
				launchesProcess: true
			}),
			close_binary: effects({
				mutatesSession: true,
				writesFilesystem: true,
				mayDiscardData: true,
				idempotent: false
			}),
			binary_session: effects({ launchesProcess: true }),
			export_evidence_bundle: effects({
				writesFilesystem: true,
				mayDiscardData: true
			}),
			get_evidence_bundle: effects(),
			get_navigation_context: effects({ mutatesSession: true }),
			inspect_address_context: effects({ mutatesSession: true }),
			import_evidence_bundle: effects({ mutatesSession: true }),
			capture_process_scenario: effects({
				mutatesSession: true,
				writesFilesystem: true,
				launchesProcess: true,
				accessesNetwork: true,
				executesForeignCode: true,
				idempotent: false
			}),
			compare_process_captures: sessionEvidence,
			compare_artifacts: sessionEvidence,
			compare_wasm_interfaces: sessionEvidence,
			compare_functions: sessionEvidence,
			compare_bundles: effects({ mutatesSession: true }),
			find_changed_behavior: sessionEvidence,
			build_call_path: sessionEvidence,
			correlate_static_and_runtime: sessionEvidence,
			verify_reconstruction: sessionEvidence,
			list_unknowns: effects(),
			record_unknown: effects({
				mutatesSession: true,
				idempotent: false
			}),
			update_unknown: effects({
				mutatesSession: true,
				idempotent: false
			}),
			verify_unknown_resolution: effects()
		};
		annotationsFromEffects = (value) => ({
			readOnlyHint: !(value.mutatesTarget || value.mutatesSession || value.writesFilesystem || value.launchesProcess || value.accessesNetwork || value.changesUiState || value.mayDiscardData || value.executesForeignCode || value.mutatesDevice),
			destructiveHint: value.mayDiscardData || value.executesForeignCode || value.mutatesDevice,
			idempotentHint: value.idempotent,
			openWorldHint: value.launchesProcess || value.accessesNetwork
		});
		TARGET_CONTENT_FREE_TOOLS = new Set(["export_evidence_bundle", "record_unknown"]);
		toolReturnsTargetContent = (name) => !TARGET_CONTENT_FREE_TOOLS.has(name);
		toolContractMetadata = (name) => {
			const audited = TOOL_EFFECTS[name];
			if (audited === undefined) throw new Error(`Missing effect audit for ${name}`);
			return {
				title: name.split("_").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" "),
				effects: audited,
				annotations: annotationsFromEffects(audited),
				returnsTargetContent: toolReturnsTargetContent(name)
			};
		};
	})))();
}

//#endregion
//#region dist/domain/wasm/wasmArtifact.js
var digest$1, artifact, inspectWasmArtifactInputSchema, wasmArtifactSchema, wasmArtifactMatchesSubject;
function init_wasmArtifact() {
	return (init_wasmArtifact = __esmMin((() => {
		init_wasmInterface();
		init_localPath();
		digest$1 = z.string().regex(/^[a-f0-9]{64}$/);
		artifact = z.strictObject({
			path: z.string().min(1),
			sha256: digest$1,
			bytes: z.number().int().nonnegative()
		});
		inspectWasmArtifactInputSchema = z.strictObject({
			path: localPathStringSchema.describe("Absolute selected local WASM artifact path"),
			glue_paths: z.array(localPathStringSchema).max(16).default([]),
			candidate_paths: z.array(localPathStringSchema).max(16).default([])
		});
		wasmArtifactSchema = z.strictObject({
			artifact,
			validation: z.literal("valid"),
			sections: z.array(z.strictObject({
				kind: z.string().min(1),
				start: z.number().int().nonnegative(),
				end: z.number().int().nonnegative(),
				bytes: z.number().int().nonnegative(),
				description: z.string()
			})),
			interface: wasmInterfaceSchema.exactOptional(),
			imports: z.array(z.string()),
			exports: z.array(z.string()),
			headers: z.string(),
			details: z.string(),
			wat: z.strictObject({
				text: z.string().min(1),
				sha256: digest$1,
				representation: z.literal("decoded-wat")
			}),
			tool_profile: z.strictObject({
				source: z.literal("https://github.com/WebAssembly/wabt"),
				release: z.literal("1.0.42"),
				source_commit: z.literal("ff0ef7e0009402740c805a9744c09b05be063e48"),
				commands: z.array(z.strictObject({
					tool: z.enum([
						"wasm-validate",
						"wasm-objdump",
						"wasm2wat"
					]),
					path: z.string().min(1),
					sha256: digest$1,
					version_banner: z.string(),
					arguments: z.array(z.string())
				})).length(3),
				timeout_ms: z.number().int().positive(),
				output_budget_bytes: z.number().int().positive()
			}),
			candidates: z.array(artifact),
			glue: z.array(z.strictObject({
				artifact,
				parse_status: z.enum([
					"complete",
					"partial",
					"failed"
				]),
				references: z.array(z.strictObject({
					value: z.string(),
					line: z.number().int().positive(),
					column: z.number().int().nonnegative(),
					candidate_paths: z.array(z.string()),
					association: z.enum([
						"local-path-candidate",
						"basename-candidates",
						"unresolved"
					]),
					evidence_kind: z.literal("static-literal")
				}))
			})),
			runtime_execution: z.literal("not-performed"),
			network_fetch: z.literal("not-performed"),
			limitations: z.array(z.string())
		}).superRefine((value, context) => {
			if (createHash("sha256").update(value.wat.text, "utf8").digest("hex") !== value.wat.sha256) context.addIssue({
				code: "custom",
				path: ["wat", "sha256"],
				message: "Decoded WAT digest does not match its UTF-8 text."
			});
			const selected = value.candidates[0];
			if (selected?.path !== value.artifact.path || selected.sha256 !== value.artifact.sha256 || selected.bytes !== value.artifact.bytes) context.addIssue({
				code: "custom",
				path: ["candidates"],
				message: "Selected candidate does not match artifact identity."
			});
			for (const [index, command] of value.tool_profile.commands.entries()) {
				const expected = [
					"wasm-validate",
					"wasm-objdump",
					"wasm2wat"
				][index];
				const argumentsExpected = command.tool === "wasm-objdump" ? [
					"-h",
					"-x",
					"module.wasm"
				] : ["--enable-all", "module.wasm"];
				if (command.tool !== expected || command.version_banner.trim() !== "1.0.42" || JSON.stringify(command.arguments) !== JSON.stringify(argumentsExpected)) context.addIssue({
					code: "custom",
					path: [
						"tool_profile",
						"commands",
						index
					],
					message: "Unexpected WABT command profile."
				});
			}
			for (const [index, section] of value.sections.entries()) if (section.end > value.artifact.bytes || section.end - section.start !== section.bytes) context.addIssue({
				code: "custom",
				path: ["sections", index],
				message: "Section range does not match selected artifact bytes."
			});
		});
		wasmArtifactMatchesSubject = (artifact, subject) => subject != null && subject.path === artifact.path && subject.sha256 === artifact.sha256 && subject.format === "file";
	})))();
}

//#endregion
//#region dist/contracts/analysisDetail.js
var analysisDetailSchema, analysisDetailOutputSchemaOf;
function init_analysisDetail() {
	return (init_analysisDetail = __esmMin((() => {
		init_toolOutputSchemaPrimitives();
		analysisDetailSchema = z.enum(["complete", "summary"]).default("complete").describe("complete returns the complete analysis Evidence inline. summary retains that complete Evidence in this session and returns its inspect_analysis_view summary; inspect pages, items or facets through normalized_result.parent_evidence_id.");
		analysisDetailOutputSchemaOf = (analysis, summary) => evidenceResultOf(z.union([analysis, summary]));
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewErrors.js
var INSPECT_ANALYSIS_VIEW_OPERATION, analysisViewInputError;
function init_analysisViewErrors() {
	return (init_analysisViewErrors = __esmMin((() => {
		init_analysisErrorCore();
		INSPECT_ANALYSIS_VIEW_OPERATION = "inspect_analysis_view";
		analysisViewInputError = (issues) => new AnalysisInputError(INSPECT_ANALYSIS_VIEW_OPERATION, undefined, issues);
	})))();
}

//#endregion
//#region dist/domain/native/binaryLayout.js
var unsignedHex, index, scalar, range, canonicalBase64, name, inspectBinaryLayoutInputSchema, binaryLayoutObjectSchema, binaryLayoutPayloadSchema, binaryLayoutSchema, validateRelocationReferences, validatePackedRelativeTables;
function init_binaryLayout() {
	return (init_binaryLayout = __esmMin((() => {
		init_localPath();
		init_stringPatterns();
		unsignedHex = z.string().regex(/^0x(?:0|[1-9a-f][0-9a-f]{0,15})$/);
		index = z.number().int().nonnegative();
		scalar = z.union([z.string(), z.number().int()]);
		range = z.strictObject({
			offset: unsignedHex,
			bytes: unsignedHex
		});
		canonicalBase64 = z.string().regex(CANONICAL_BASE64_PATTERN);
		name = z.strictObject({
			display: z.string(),
			bytes_base64: canonicalBase64.nullable(),
			location: range.nullable(),
			unknown_reason: z.string().nullable()
		});
		inspectBinaryLayoutInputSchema = z.strictObject({ path: localPathStringSchema.describe("Absolute filesystem path to the selected binary") });
		binaryLayoutObjectSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string().min(1),
				sha256: z.string().regex(/^[a-f0-9]{64}$/),
				bytes: index
			}),
			format: z.literal("elf"),
			architecture: z.strictObject({
				machine: z.literal("EM_X86_64"),
				bits: z.literal(64),
				byte_order: z.literal("little")
			}),
			image_type: z.enum([
				"ET_EXEC",
				"ET_DYN",
				"ET_REL"
			]),
			entry_point: z.strictObject({
				reported_value: unsignedHex,
				meaning: z.enum([
					"linked-virtual-address",
					"not-applicable",
					"absent"
				]),
				execution_status: z.literal("unknown")
			}),
			runtime_load_base: z.null(),
			sections: z.array(z.strictObject({
				index,
				name,
				name_offset: unsignedHex,
				type: scalar,
				header_location: range,
				address: unsignedHex,
				offset: unsignedHex,
				size: unsignedHex,
				alignment: unsignedHex,
				flags: unsignedHex,
				link: index,
				info: index,
				entry_size: unsignedHex,
				file_backing: z.enum(["file", "none"])
			})),
			segments: z.array(z.strictObject({
				index,
				type: scalar,
				header_location: range,
				offset: unsignedHex,
				file_size: unsignedHex,
				memory_size: unsignedHex,
				virtual_address: unsignedHex,
				physical_address: unsignedHex,
				alignment: unsignedHex,
				flags: unsignedHex,
				file_backing: z.enum(["file", "none"]),
				permissions: z.strictObject({
					read: z.boolean(),
					write: z.boolean(),
					execute: z.boolean()
				}).nullable()
			})),
			symbols: z.array(z.strictObject({
				table_index: index,
				entry_index: index,
				name,
				name_offset: unsignedHex,
				location: range,
				value: unsignedHex,
				value_meaning: z.enum([
					"undefined",
					"alignment",
					"absolute-value",
					"no-address",
					"unknown-section-index",
					"section-offset",
					"tls-offset",
					"linked-virtual-address"
				]),
				size: unsignedHex,
				binding: scalar,
				type: scalar,
				visibility: scalar,
				section_index: scalar
			})),
			relocations: z.array(z.strictObject({
				section_index: index,
				entry_index: index,
				reported_offset: unsignedHex,
				target: z.discriminatedUnion("kind", [
					z.strictObject({
						kind: z.literal("section-offset"),
						section_index: index,
						offset: unsignedHex
					}),
					z.strictObject({
						kind: z.literal("linked-virtual-address"),
						address: unsignedHex
					}),
					z.strictObject({
						kind: z.literal("unknown-section"),
						reported_section_index: index,
						offset: unsignedHex,
						unknown_reason: z.enum(["undefined-section-reference", "inactive-section-header"])
					})
				]),
				location: range,
				type: index,
				symbol_table_index: index,
				symbol_index: index,
				symbol_reference_meaning: z.enum(["zero-symbol-value", "symbol-table-entry"]),
				addend: z.string().regex(/^-?(?:0|[1-9][0-9]{0,18})$/).nullable()
			})),
			packed_relative_relocations: z.array(z.strictObject({
				section_index: index,
				location: range,
				encoded_bytes_base64: canonicalBase64,
				entries: z.array(z.strictObject({
					decoded_index: index,
					reported_offset: unsignedHex
				})),
				offset_meaning: z.enum(["linked-virtual-address", "unknown"]),
				evidence_kind: z.literal("derived"),
				entry_source_locations: z.null(),
				addends: z.null()
			})),
			relocation_inventory_completeness: z.literal("unknown"),
			linkage: z.strictObject({
				needed_libraries: z.array(name),
				interpreters: z.array(name),
				got: z.array(z.strictObject({
					display_name: z.string(),
					address: unsignedHex
				})),
				plt: z.array(z.strictObject({
					display_name: z.string(),
					address: unsignedHex
				})),
				convenience_maps_completeness: z.literal("unknown"),
				runtime_library_paths: z.null()
			}),
			mitigations: z.strictObject({
				evidence_kind: z.literal("inferred"),
				position_independent: z.boolean(),
				nx_indicator: z.boolean().nullable(),
				executable_stack_indicator: z.boolean(),
				stack_canary_indicator: z.boolean(),
				relro: z.enum(["Partial", "Full"]).nullable()
			}),
			diagnostics: z.strictObject({
				stdout: z.string(),
				stderr: z.string(),
				truncated: z.boolean()
			}),
			limitations: z.array(z.string())
		});
		binaryLayoutPayloadSchema = binaryLayoutObjectSchema.omit({
			artifact: true,
			diagnostics: true
		});
		binaryLayoutSchema = binaryLayoutObjectSchema.superRefine((value, context) => {
			const size = BigInt(value.artifact.bytes);
			const check = (offset, length, path) => {
				const start = BigInt(offset);
				const bytes = BigInt(length);
				if (start > size || bytes > size - start) context.addIssue({
					code: "custom",
					path,
					message: "Reported file-backed range lies outside the selected artifact."
				});
			};
			const checkLocation = (where, path) => check(where.offset, where.bytes, path);
			const checkName = (reported, path) => {
				if (reported.location !== null) checkLocation(reported.location, [...path, "location"]);
			};
			const expectedEntryMeaning = value.image_type === "ET_REL" ? "not-applicable" : value.entry_point.reported_value === "0x0" ? "absent" : "linked-virtual-address";
			if (value.entry_point.meaning !== expectedEntryMeaning) context.addIssue({
				code: "custom",
				path: ["entry_point", "meaning"],
				message: "Entry meaning must distinguish zero/unused fields from an actual linked address."
			});
			for (const [index, section] of value.sections.entries()) {
				if ((section.type === "SHT_SYMTAB" || section.type === "SHT_DYNSYM") && value.sections[section.link]?.type !== "SHT_STRTAB") context.addIssue({
					code: "custom",
					path: [
						"sections",
						index,
						"link"
					],
					message: "Symbol tables must link to an existing string-table section."
				});
				if (section.index !== index) context.addIssue({
					code: "custom",
					path: [
						"sections",
						index,
						"index"
					],
					message: "Complete section order must preserve original producer indices."
				});
				checkLocation(section.header_location, [
					"sections",
					index,
					"header_location"
				]);
				checkName(section.name, [
					"sections",
					index,
					"name"
				]);
				if (section.file_backing === "file") check(section.offset, section.size, ["sections", index]);
			}
			for (const [index, segment] of value.segments.entries()) {
				if (segment.index !== index) context.addIssue({
					code: "custom",
					path: [
						"segments",
						index,
						"index"
					],
					message: "Complete segment order must preserve original producer indices."
				});
				checkLocation(segment.header_location, [
					"segments",
					index,
					"header_location"
				]);
				const hasFileBytes = segment.type !== "PT_NULL" && BigInt(segment.file_size) !== 0n;
				if (segment.file_backing !== (hasFileBytes ? "file" : "none")) context.addIssue({
					code: "custom",
					path: [
						"segments",
						index,
						"file_backing"
					],
					message: "File backing must follow the reported segment type and file size."
				});
				if (segment.type === "PT_NULL" !== (segment.permissions === null)) context.addIssue({
					code: "custom",
					path: [
						"segments",
						index,
						"permissions"
					],
					message: "Unused PT_NULL flags have no permission meaning; other segment flags retain their interpretation."
				});
				if (hasFileBytes) check(segment.offset, segment.file_size, ["segments", index]);
			}
			for (const [index, symbol] of value.symbols.entries()) {
				checkLocation(symbol.location, [
					"symbols",
					index,
					"location"
				]);
				checkName(symbol.name, [
					"symbols",
					index,
					"name"
				]);
			}
			for (const [index, relocation] of value.relocations.entries()) checkLocation(relocation.location, [
				"relocations",
				index,
				"location"
			]);
			validateRelocationReferences(value, context);
			validatePackedRelativeTables(value, context, checkLocation);
			for (const facet of ["needed_libraries", "interpreters"]) for (const [index, reported] of value.linkage[facet].entries()) checkName(reported, [
				"linkage",
				facet,
				index
			]);
		});
		validateRelocationReferences = (value, context) => {
			const symbols = new Set(value.symbols.map((symbol) => `${symbol.table_index}:${symbol.entry_index}`));
			for (const [index, relocation] of value.relocations.entries()) {
				const owner = value.sections[relocation.section_index];
				const target = relocation.target;
				const targetMatches = value.image_type === "ET_REL" ? target.kind === "section-offset" ? target.section_index !== 0 && target.section_index === owner?.info && value.sections[target.section_index] !== undefined && value.sections[target.section_index]?.type !== "SHT_NULL" && target.offset === relocation.reported_offset : target.kind === "unknown-section" && target.reported_section_index === owner?.info && target.offset === relocation.reported_offset && (target.reported_section_index === 0 ? target.unknown_reason === "undefined-section-reference" : value.sections[target.reported_section_index]?.type === "SHT_NULL" && target.unknown_reason === "inactive-section-header") : target.kind === "linked-virtual-address" && target.address === relocation.reported_offset;
				if (!targetMatches) context.addIssue({
					code: "custom",
					path: [
						"relocations",
						index,
						"target"
					],
					message: "Relocation target must preserve its reported offset and owner reference; SHN_UNDEF and inactive headers remain unknown rather than resolved sections."
				});
				const table = value.sections[relocation.symbol_table_index];
				const tableExists = relocation.symbol_table_index !== 0 && (table?.type === "SHT_SYMTAB" || table?.type === "SHT_DYNSYM");
				const positiveReferenceExists = tableExists && BigInt(table.entry_size) >= 24n && BigInt(relocation.symbol_index) < BigInt(table.size) / BigInt(table.entry_size) && symbols.has(`${relocation.symbol_table_index}:${relocation.symbol_index}`);
				if (owner?.type !== "SHT_REL" && owner?.type !== "SHT_RELA" || owner.link !== relocation.symbol_table_index || relocation.symbol_table_index !== 0 && !tableExists || relocation.symbol_index !== 0 && !positiveReferenceExists || relocation.symbol_reference_meaning !== (relocation.symbol_index === 0 ? "zero-symbol-value" : "symbol-table-entry")) context.addIssue({
					code: "custom",
					path: ["relocations", index],
					message: "Relocation must preserve its REL/RELA owner and resolve positive symbol indices through the linked symbol table; index zero uses a zero symbol value."
				});
			}
		};
		validatePackedRelativeTables = (value, context, checkLocation) => {
			for (const [tableIndex, table] of value.packed_relative_relocations.entries()) {
				checkLocation(table.location, [
					"packed_relative_relocations",
					tableIndex,
					"location"
				]);
				const encodedBytes = table.encoded_bytes_base64.length * 3 / 4 - (table.encoded_bytes_base64.endsWith("==") ? 2 : table.encoded_bytes_base64.endsWith("=") ? 1 : 0);
				if (!Number.isInteger(encodedBytes) || BigInt(encodedBytes) !== BigInt(table.location.bytes)) context.addIssue({
					code: "custom",
					path: ["packed_relative_relocations", tableIndex],
					message: "Complete packed table bytes must match its original file range."
				});
				const section = value.sections[table.section_index];
				if (section?.type !== "SHT_RELR" || section.offset !== table.location.offset || section.size !== table.location.bytes) context.addIssue({
					code: "custom",
					path: [
						"packed_relative_relocations",
						tableIndex,
						"section_index"
					],
					message: "Packed relative evidence must retain its original RELR section identity and range."
				});
				for (const [decoded, entry] of table.entries.entries()) if (entry.decoded_index !== decoded) context.addIssue({
					code: "custom",
					path: [
						"packed_relative_relocations",
						tableIndex,
						"entries",
						decoded
					],
					message: "Decoded offsets must preserve upstream iterator order."
				});
			}
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewCoverage.js
var completeWithinViewCoverage, pageViewCoverage, ANALYSIS_VIEW_MESSAGE_BYTE_LIMIT, messageWireBytes, boundedViewMessages;
function init_analysisViewCoverage() {
	return (init_analysisViewCoverage = __esmMin((() => {
		init_canonicalOrdering();
		completeWithinViewCoverage = (examined, total) => ({
			status: "complete-within-view",
			examined,
			total,
			next_offset: null,
			exhausted: true
		});
		pageViewCoverage = (offset, examined, total) => {
			const exhausted = offset >= total || offset + examined >= total;
			return {
				status: examined === 0 ? "empty" : "page",
				examined,
				total,
				next_offset: exhausted ? null : offset + examined,
				exhausted
			};
		};
		ANALYSIS_VIEW_MESSAGE_BYTE_LIMIT = 256 * 1024;
		messageWireBytes = (value) => (value.length * 18 + 6) * 3;
		boundedViewMessages = (values, parentEvidenceId, field, required = []) => {
			const priority = uniqueSorted(required);
			const unique = uniqueSorted([...priority, ...values]);
			const notice = (omitted) => `${String(omitted)} additional ${field} omitted from this view; consult source parent Evidence ${parentEvidenceId} for the complete list (the caller-supplied record, or its retaining session).`;
			const totalBytes = unique.reduce((total, value) => total + messageWireBytes(value), 0);
			if (totalBytes <= 262144) return unique;
			let remaining = ANALYSIS_VIEW_MESSAGE_BYTE_LIMIT - messageWireBytes(notice(unique.length));
			const retained = new Set();
			for (const value of [...priority, ...unique]) {
				if (retained.has(value)) continue;
				const bytes = messageWireBytes(value);
				if (bytes > remaining) continue;
				retained.add(value);
				remaining -= bytes;
			}
			const omitted = unique.length - retained.size;
			return omitted === 0 ? unique : [...uniqueSorted([...retained]), notice(omitted)];
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/binaryLayoutView.js
var OPERATION$2, inputError$2, layoutUnknowns, displayName, namedMatches, selectNamed, selectIndexed, pageRows, layoutIncompatible, parentFields$2, layoutSummary, projectBinaryLayoutView, selectLayoutItem;
function init_binaryLayoutView() {
	return (init_binaryLayoutView = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_analysisViewCoverage();
		OPERATION$2 = "inspect_analysis_view";
		inputError$2 = (issues) => new AnalysisInputError(OPERATION$2, undefined, issues);
		layoutUnknowns = (layout) => {
			const unknowns = [
				"runtime_load_base is unknown",
				"entry_point.execution_status is unknown",
				"relocation_inventory_completeness is unknown",
				"linkage.convenience_maps_completeness is unknown",
				"linkage.runtime_library_paths are unknown"
			];
			if (layout.mitigations.nx_indicator === null) unknowns.push("mitigations.nx_indicator is unknown");
			if (layout.mitigations.relro === null) unknowns.push("mitigations.relro is unknown");
			return unknowns;
		};
		displayName = (name) => name.display;
		namedMatches = (rows, name) => rows.flatMap((row, index) => row.name.unknown_reason === null && displayName(row.name) === name ? [{
			index,
			row
		}] : []);
		selectNamed = (collection, rows, name) => {
			const matches = namedMatches(rows, name);
			if (matches.length === 1) {
				const selected = matches[0];
				if (selected !== undefined) return ok(selected.row);
			}
			if (matches.length === 0) return err(inputError$2([{
				path: [
					"view",
					"selector",
					"name"
				],
				reason: "invalid_value",
				message: `No ${collection} named ${JSON.stringify(name)}. Collection has ${String(rows.length)} entries; page it to inspect exact indexes and names.`
			}]));
			return err(inputError$2([{
				path: [
					"view",
					"selector",
					"name"
				],
				reason: "invalid_value",
				message: `Multiple ${collection} named ${JSON.stringify(name)}; select one by index.`,
				expected: matches.map(({ index }) => ({ index }))
			}]));
		};
		selectIndexed = (collection, rows, index) => {
			const row = rows[index];
			if (row !== undefined) return ok(row);
			return err(inputError$2([{
				path: [
					"view",
					"selector",
					"index"
				],
				reason: "out_of_range",
				message: `${collection} index ${String(index)} is outside 0..${String(Math.max(0, rows.length - 1))} (${String(rows.length)} entries).`,
				minimum: 0,
				maximum: Math.max(0, rows.length - 1)
			}]));
		};
		pageRows = (rows, offset, limit) => rows.slice(offset, offset + limit);
		layoutIncompatible = (detail) => inputError$2([{
			path: ["view"],
			reason: "invalid_value",
			message: detail
		}]);
		parentFields$2 = (parent, layout) => ({
			parent_evidence_id: parent.evidenceId,
			parent_operation: "inspect_binary_layout",
			parent_digest: parent.evidenceId.slice(3),
			artifact: {
				path: layout.artifact.path,
				sha256: layout.artifact.sha256
			},
			limitations: boundedViewMessages([...parent.limitations, ...layout.limitations], parent.evidenceId, "limitations"),
			unknowns: boundedViewMessages(layoutUnknowns(layout), parent.evidenceId, "unknowns")
		});
		layoutSummary = (layout) => ({
			bytes: layout.artifact.bytes,
			format: layout.format,
			architecture: layout.architecture,
			image_type: layout.image_type,
			entry: layout.entry_point,
			counts: {
				sections: layout.sections.length,
				segments: layout.segments.length,
				symbols: layout.symbols.length,
				relocations: layout.relocations.length
			},
			limitation_count: layout.limitations.length
		});
		projectBinaryLayoutView = (parent, layout, view) => {
			const shared = parentFields$2(parent, layout);
			if (view.kind === "native") return err(layoutIncompatible("Native views require analyze_function Evidence."));
			if (view.kind === "inventory") return err(layoutIncompatible("Inventory views require artifact Evidence."));
			if (view.kind === "wasm") return err(layoutIncompatible("WASM views require inspect_wasm_artifact Evidence."));
			if (view.kind === "evm") return err(layoutIncompatible("EVM views require inspect_evm_interface Evidence."));
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				summary: layoutSummary(layout),
				coverage: completeWithinViewCoverage(layout.sections.length + layout.segments.length + layout.symbols.length + layout.relocations.length, layout.sections.length + layout.segments.length + layout.symbols.length + layout.relocations.length),
				...shared
			});
			if (view.kind === "facet") return ok({
				kind: "facet",
				view,
				facet: view.facet === "mitigations" ? layout.mitigations : layout.linkage,
				coverage: completeWithinViewCoverage(1, 1),
				...shared
			});
			if (view.kind === "item") {
				if (view.collection === "modules") return err(layoutIncompatible("modules collection applies to analyze_javascript_application Evidence."));
				const selected = view.collection === "sections" ? selectLayoutItem(view.collection, layout.sections, view.selector) : selectLayoutItem(view.collection, layout.symbols, view.selector);
				if (!selected.ok) return selected;
				return ok({
					kind: "item",
					view,
					item: selected.value,
					coverage: completeWithinViewCoverage(1, view.collection === "sections" ? layout.sections.length : layout.symbols.length),
					...shared
				});
			}
			if (view.kind !== "page") return err(layoutIncompatible("Layout views require summary, facet, item or page selections."));
			if (view.collection === "modules") return err(layoutIncompatible("modules collection applies to analyze_javascript_application Evidence."));
			const rows = view.collection === "sections" ? layout.sections : layout.symbols;
			const items = view.collection === "sections" ? pageRows(layout.sections, view.offset, view.limit) : pageRows(layout.symbols, view.offset, view.limit);
			return ok({
				kind: "page",
				view,
				items: [...items],
				coverage: pageViewCoverage(view.offset, items.length, rows.length),
				...shared
			});
		};
		selectLayoutItem = (collection, rows, selector) => {
			if ("index" in selector) return selectIndexed(collection, rows, selector.index);
			if ("name" in selector) return selectNamed(collection, rows, selector.name);
			return err(layoutIncompatible("Section and symbol items are selected by index or exact name."));
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/javascriptApplicationView.js
var OPERATION$1, inputError$1, jsIncompatible, javascriptModulePath, moduleEntries, exportNames, nodeHashes, sourceRanges, moduleItem, applicationUnknownCount, javascriptCoverageUnknowns, parentFields$1, selectModule, projectJavaScriptApplicationView;
function init_javascriptApplicationView() {
	return (init_javascriptApplicationView = __esmMin((() => {
		init_analysisErrorCore();
		init_jsonValue();
		init_result();
		init_analysisViewCoverage();
		OPERATION$1 = "inspect_analysis_view";
		inputError$1 = (issues) => new AnalysisInputError(OPERATION$1, undefined, issues);
		jsIncompatible = (detail) => inputError$1([{
			path: ["view"],
			reason: "invalid_value",
			message: detail
		}]);
		javascriptModulePath = (node) => {
			if (node.identity.strategy === "canonical-path") return node.identity.path;
			if (node.identity.strategy === "source-map-original") return node.identity.original_source;
			for (const observation of node.observations) {
				const path = observation.properties.path;
				if (typeof path === "string") return path;
				const location = observation.evidence.location;
				if (location.available && location.value.kind === "artifact-path") return location.value.path;
				if (location.available && location.value.kind === "source-range") return location.value.source;
			}
			return null;
		};
		moduleEntries = (nodes) => nodes.filter((node) => node.kind === "javascript-asset" || node.kind === "javascript-module" || node.kind === "source-module").map((node) => ({
			node,
			path: javascriptModulePath(node)
		}));
		exportNames = (node) => {
			const names = new Set();
			for (const observation of node.observations) {
				const value = observation.properties.export_names ?? observation.properties.exports;
				if (!Array.isArray(value)) continue;
				for (const entry of value) if (typeof entry === "string") names.add(entry);
			}
			return [...names];
		};
		nodeHashes = (node) => {
			const hashes = new Set();
			const { identity } = node;
			if (identity.strategy === "content-digest") hashes.add(identity.sha256);
			if (identity.strategy === "canonical-path") hashes.add(identity.artifact_sha256);
			if (identity.strategy === "source-map-original") {
				hashes.add(identity.source_map_sha256);
				if (identity.source_sha256 !== null) hashes.add(identity.source_sha256);
			}
			for (const observation of node.observations) {
				for (const key of [
					"sha256",
					"container_sha256",
					"entry_sha256",
					"source_sha256"
				]) {
					const value = observation.properties[key];
					if (typeof value === "string" && /^[a-f0-9]{64}$/u.test(value)) hashes.add(value);
				}
			}
			return [...hashes];
		};
		sourceRanges = (node) => node.observations.flatMap((observation) => {
			const location = observation.evidence.location;
			return location.available && location.value.kind === "source-range" ? [location.value] : [];
		});
		moduleItem = (node) => ({
			node_id: node.node_id,
			kind: node.kind,
			path: javascriptModulePath(node),
			identity: node.identity,
			hashes: [...nodeHashes(node)],
			exports: [...exportNames(node)],
			source_ranges: [...sourceRanges(node)],
			observations: node.observations.map((observation) => ({
				observation_id: observation.observation_id,
				label: observation.label,
				properties: observation.properties,
				evidence: {
					...observation.evidence,
					location: observation.evidence.location
				}
			}))
		});
		applicationUnknownCount = (analysis) => analysis.graph.nodes.reduce((count, node) => count + Number(node.kind === "unknown"), 0);
		javascriptCoverageUnknowns = (analysis) => {
			const unknowns = [];
			if (analysis.graph.coverage.status !== "complete") unknowns.push(`graph.coverage.status is ${analysis.graph.coverage.status}`);
			if (analysis.semantic_graph.coverage.status !== "complete") unknowns.push(`semantic_graph.coverage.status is ${analysis.semantic_graph.coverage.status}`);
			const applicationUnknowns = applicationUnknownCount(analysis);
			if (applicationUnknowns > 0) unknowns.push(`${String(applicationUnknowns)} application graph unknowns remain in the parent Evidence.`);
			if (analysis.semantic_graph.unknowns.length > 0) unknowns.push(`${String(analysis.semantic_graph.unknowns.length)} semantic graph unknowns remain in the parent Evidence.`);
			return unknowns;
		};
		parentFields$1 = (parent, analysis) => {
			const limitations = [
				...analysis.limitations,
				...analysis.graph.limitations,
				...analysis.semantic_graph.limitations
			];
			return {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "analyze_javascript_application",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: analysis.input_path,
					sha256: analysis.root_artifact_sha256
				},
				limitations: boundedViewMessages([...parent.limitations, ...limitations], parent.evidenceId, "limitations"),
				unknowns: boundedViewMessages(limitations, parent.evidenceId, "unknowns", javascriptCoverageUnknowns(analysis))
			};
		};
		selectModule = (modules, selector) => {
			if ("node_id" in selector) {
				const matches = modules.filter(({ node }) => node.node_id === selector.node_id);
				if (matches.length === 1) {
					const selected = matches[0];
					if (selected !== undefined) return ok(selected.node);
				}
				return err(inputError$1([{
					path: [
						"view",
						"selector",
						"node_id"
					],
					reason: "invalid_value",
					message: `No module has node_id ${JSON.stringify(selector.node_id)}. Page the modules collection to inspect available identities.`
				}]));
			}
			if ("path" in selector) {
				const matches = modules.filter((entry) => entry.path === selector.path);
				if (matches.length === 1) {
					const selected = matches[0];
					if (selected !== undefined) return ok(selected.node);
				}
				if (matches.length === 0) return err(inputError$1([{
					path: [
						"view",
						"selector",
						"path"
					],
					reason: "invalid_value",
					message: `No module has path ${JSON.stringify(selector.path)}. Page the modules collection to inspect exact paths and node_id values.`
				}]));
				return err(inputError$1([{
					path: [
						"view",
						"selector",
						"path"
					],
					reason: "invalid_value",
					message: `Multiple modules have path ${JSON.stringify(selector.path)}; select one by node_id.`,
					expected: matches.map((entry) => ({ node_id: entry.node.node_id }))
				}]));
			}
			return err(jsIncompatible("Module items are selected by exact path or node_id."));
		};
		projectJavaScriptApplicationView = (parent, analysis, view) => {
			if (view.kind !== "summary" && view.kind !== "item" && view.kind !== "page") return err(jsIncompatible("JavaScript application Evidence supports summary, module item or module page views."));
			const shared = parentFields$1(parent, analysis);
			const modules = moduleEntries(analysis.graph.nodes);
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				summary: {
					input_path: analysis.input_path,
					format: analysis.format,
					root_artifact_sha256: analysis.root_artifact_sha256,
					...analysis.source_selection === undefined ? {} : { source_selection: analysis.source_selection },
					statistics: jsonObjectSchema.parse(analysis.statistics),
					electron: jsonObjectSchema.parse(analysis.summary),
					coverage: jsonObjectSchema.parse({
						application: analysis.graph.coverage,
						semantic: {
							...analysis.semantic_graph.coverage,
							families: analysis.semantic_graph.coverage.families.map(({ unknown_ids, ...family }) => ({
								...family,
								unknown_count: unknown_ids.length
							}))
						},
						application_unknowns: applicationUnknownCount(analysis),
						semantic_unknowns: analysis.semantic_graph.unknowns.length
					}),
					limitation_count: analysis.limitations.length
				},
				coverage: completeWithinViewCoverage(modules.length, analysis.graph.nodes.length),
				...shared
			});
			if (view.kind === "item") {
				if (view.collection !== "modules") return err(jsIncompatible("Section and symbol collections apply to inspect_binary_layout Evidence."));
				const selected = selectModule(modules, view.selector);
				if (!selected.ok) return selected;
				return ok({
					kind: "item",
					view,
					item: moduleItem(selected.value),
					coverage: completeWithinViewCoverage(1, modules.length),
					...shared
				});
			}
			if (view.kind !== "page" || view.collection !== "modules") return err(jsIncompatible("Section and symbol collections apply to inspect_binary_layout Evidence."));
			const items = modules.slice(view.offset, view.offset + view.limit).map(({ node, path }) => ({
				node_id: node.node_id,
				kind: node.kind,
				path
			}));
			return ok({
				kind: "page",
				view,
				items,
				coverage: pageViewCoverage(view.offset, items.length, modules.length),
				...shared
			});
		};
	})))();
}

//#endregion
//#region dist/domain/qlogCapture.js
var decimal, unsignedFact, traceLocation, qlogCaptureFactsSchema;
function init_qlogCapture() {
	return (init_qlogCapture = __esmMin((() => {
		decimal = z.string().regex(/^(0|[1-9][0-9]*)$/u);
		unsignedFact = z.discriminatedUnion("state", [z.strictObject({
			state: z.literal("reported"),
			value: decimal
		}), z.strictObject({
			state: z.literal("unknown"),
			reason: z.literal("omitted-null-or-redacted")
		})]);
		traceLocation = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("json-pointer"),
			pointer: z.string()
		}), z.strictObject({
			kind: z.literal("unknown"),
			reason: z.literal("explicit-sensitive-value")
		})]);
		qlogCaptureFactsSchema = z.strictObject({
			profile: z.literal("aioquic-1.5.0-json-0.3"),
			scope: z.literal("all-recorded-events-before-selection"),
			body_bytes: z.literal("not-reported"),
			clock: z.strictObject({
				unit: z.literal("milliseconds"),
				domain: z.literal("unix-epoch"),
				basis: z.literal("selected-aioquic-profile-not-producer-authentication")
			}),
			traces: z.array(z.strictObject({
				trace_index: z.number().int().nonnegative(),
				location: traceLocation,
				event_count: z.number().int().nonnegative(),
				odcid: z.string().nullable(),
				vantage_point: z.enum(["client", "server"]).nullable(),
				incomplete_fact_records: z.array(z.number().int().nonnegative()),
				loss_declarations: z.array(z.strictObject({
					record_ordinal: z.number().int().nonnegative(),
					confidence: z.literal("observed"),
					packet_number: unsignedFact,
					packet_type: z.string().nullable(),
					packet_number_space: z.enum([
						"initial",
						"handshake",
						"application"
					]).nullable()
				})),
				streams: z.array(z.strictObject({
					stream_id: decimal,
					direction: z.enum(["sent", "received"]),
					confidence: z.literal("derived"),
					scope: z.literal("observed-stream-frame-ranges"),
					contributions: z.array(z.strictObject({
						record_ordinal: z.number().int().nonnegative(),
						frame_index: z.number().int().nonnegative(),
						offset: decimal,
						length: decimal,
						fin: z.boolean().nullable()
					})),
					covered_ranges: z.array(z.strictObject({
						start: decimal,
						end: decimal
					})),
					unique_bytes: decimal,
					frame_length_sum: decimal,
					repeated_bytes: decimal,
					reported_final_sizes: z.array(decimal)
				}))
			}))
		});
	})))();
}

//#endregion
//#region dist/domain/webNetworkCapture.js
var WEB_NETWORK_CAPTURE_LIMITS, WEB_NETWORK_CAPTURE_FORMATS, inspectWebNetworkCaptureInputSchema, captureSensitiveValues, pointerSchema, redactionSchema, binaryBase, retainedBinaryDescriptorSchema, redactedBinaryDescriptorSchema, webNetworkCaptureBinaryDescriptorSchema, binarySchema, numberSchema, webNetworkCaptureRecordSchema, webNetworkCaptureDecoderSchema, payloadShape, refineCoverage, webNetworkCapturePayloadSchema, webNetworkCaptureArtifactSchema, artifactShape, webNetworkCaptureSchema;
function init_webNetworkCapture() {
	return (init_webNetworkCapture = __esmMin((() => {
		init_jsonValue();
		init_localPath();
		init_qlogCapture();
		WEB_NETWORK_CAPTURE_LIMITS = {
			inputBytes: 32 * 1024 * 1024,
			outputBytes: 96 * 1024 * 1024,
			timeoutMs: 3e4,
			depth: 64
		};
		WEB_NETWORK_CAPTURE_FORMATS = [
			"har",
			"mitmproxy",
			"saz",
			"qlog"
		];
		inspectWebNetworkCaptureInputSchema = z.strictObject({
			capture_path: localPathStringSchema.describe("Absolute local HAR, mitmproxy, Fiddler SAZ or aioquic qlog capture path."),
			format: z.enum(WEB_NETWORK_CAPTURE_FORMATS),
			record_ordinals: z.array(z.number().int().nonnegative()).min(1).optional().describe("Zero-based producer record ordinals, in caller-selected order. Omit to inspect every record."),
			sensitive_values: z.array(z.string().min(1)).default([]).describe("Literal text excluded from capture payloads, byte/numeric projections, producer coordinates, artifact paths/digests and diagnostic text. Declaration strings are never persisted in Evidence parameters. Canonical contract keys, enums and provider identities remain intact.")
		});
		captureSensitiveValues = (rawInput) => {
			const parsed = inspectWebNetworkCaptureInputSchema.shape.sensitive_values.safeParse(typeof rawInput === "object" && rawInput !== null && "sensitive_values" in rawInput ? rawInput.sensitive_values : undefined);
			return parsed.success ? parsed.data : [];
		};
		pointerSchema = z.string().describe("RFC 6901 pointer in the producer's reported object.");
		redactionSchema = z.union([z.strictObject({
			pointer: pointerSchema,
			reason: z.enum(["transport-credential", "explicit-sensitive-value"])
		}), z.strictObject({
			pointer: pointerSchema,
			reason: z.literal("explicit-sensitive-value"),
			scope: z.literal("property-name").describe("An omitted property name; pointer identifies its actual parent, not an invented child coordinate.")
		})]);
		binaryBase = {
			pointer: pointerSchema,
			representation: z.enum(["producer-bytes", "har-base64-content"])
		};
		retainedBinaryDescriptorSchema = z.strictObject({
			...binaryBase,
			state: z.literal("retained"),
			bytes: z.number().int().nonnegative(),
			sha256: z.string().regex(/^[0-9a-f]{64}$/)
		});
		redactedBinaryDescriptorSchema = z.strictObject({
			...binaryBase,
			state: z.literal("redacted"),
			bytes: z.null(),
			sha256: z.null()
		});
		webNetworkCaptureBinaryDescriptorSchema = z.discriminatedUnion("state", [retainedBinaryDescriptorSchema, redactedBinaryDescriptorSchema]);
		binarySchema = z.discriminatedUnion("state", [retainedBinaryDescriptorSchema.extend({ content_base64: z.string() }), redactedBinaryDescriptorSchema.extend({ content_base64: z.null() })]);
		numberSchema = z.strictObject({
			pointer: pointerSchema,
			producer_type: z.enum([
				"json-number",
				"integer",
				"float"
			]),
			literal: z.string()
		});
		webNetworkCaptureRecordSchema = z.strictObject({
			ordinal: z.number().int().nonnegative(),
			location: z.discriminatedUnion("kind", [
				z.strictObject({
					kind: z.literal("unknown"),
					reason: z.literal("explicit-sensitive-value")
				}),
				z.strictObject({
					kind: z.literal("json-pointer"),
					pointer: pointerSchema
				}),
				z.strictObject({
					kind: z.literal("archive-members"),
					members: z.array(z.string()).min(1)
				}),
				z.strictObject({
					kind: z.literal("byte-range"),
					offset: z.number().int().nonnegative(),
					bytes: z.number().int().positive()
				})
			]),
			reported: jsonValueSchema,
			binary_fields: z.array(binarySchema),
			numeric_literals: z.array(numberSchema),
			redactions: z.array(redactionSchema),
			limitations: z.array(z.string())
		});
		webNetworkCaptureDecoderSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().min(1)
		});
		payloadShape = {
			decoder: webNetworkCaptureDecoderSchema,
			container: z.strictObject({
				reported: jsonValueSchema,
				numeric_literals: z.array(numberSchema),
				redactions: z.array(redactionSchema),
				records_pointer: pointerSchema.nullable()
			}),
			total_records: z.number().int().nonnegative(),
			records: z.array(webNetworkCaptureRecordSchema)
		};
		refineCoverage = (capture, context) => {
			const seen = new Set();
			for (const [index, record] of capture.records.entries()) {
				if (record.ordinal >= capture.total_records || seen.has(record.ordinal)) {
					context.addIssue({
						code: "custom",
						path: [
							"records",
							index,
							"ordinal"
						],
						message: "Retained ordinals must be unique and within the declared capture total."
					});
					return;
				}
				seen.add(record.ordinal);
			}
		};
		webNetworkCapturePayloadSchema = z.union([z.strictObject({
			...payloadShape,
			qlog: qlogCaptureFactsSchema
		}), z.strictObject(payloadShape)]).superRefine(refineCoverage);
		webNetworkCaptureArtifactSchema = z.strictObject({
			path: z.string().describe("Selected artifact path; empty when explicitly excluded from Evidence."),
			sha256: z.string().regex(/^[0-9a-f]{64}$/).nullable().describe("Observed SHA-256; null only when explicitly excluded."),
			bytes: z.number().int().nonnegative()
		});
		artifactShape = {
			artifact: webNetworkCaptureArtifactSchema,
			runtime_attribution: z.literal("unknown"),
			limitations: z.array(z.string())
		};
		webNetworkCaptureSchema = z.discriminatedUnion("format", [z.strictObject({
			...payloadShape,
			...artifactShape,
			format: z.enum([
				"har",
				"mitmproxy",
				"saz"
			])
		}), z.strictObject({
			...payloadShape,
			...artifactShape,
			format: z.literal("qlog"),
			qlog: qlogCaptureFactsSchema
		})]).superRefine(refineCoverage);
	})))();
}

//#endregion
//#region dist/domain/analysisView/WebNetworkApiSurfaceAccumulator.js
var requestSchema, responseSchema, contentSchema, MEDIA_TYPE_ESSENCE, mediaTypeEssence, GROUP_BYTES, SEGMENT_BYTES, ENTRY_BYTES, RECORD_SCRATCH_BYTES, SEGMENT_SCRATCH_BYTES, CAPTURE_CONTAINER_BYTES, CAPTURE_MEMBER_BYTES, textBytes, segmentRule, WebNetworkApiSurfaceAccumulator;
function init_WebNetworkApiSurfaceAccumulator() {
	return (init_WebNetworkApiSurfaceAccumulator = __esmMin((() => {
		init_analysisErrorCore();
		init_unicodeCodePointOrder();
		init_recordedTransportUrl();
		init_result();
		init_jsonValue();
		init_webNetworkCapture();
		init_analysisViewCoverage();
		requestSchema = z.object({ request: z.object({
			url: z.unknown(),
			method: z.unknown()
		}) });
		responseSchema = z.object({ response: z.object({
			status: z.unknown().optional(),
			content: z.unknown().optional()
		}) });
		contentSchema = z.object({ mimeType: z.unknown().optional() });
		MEDIA_TYPE_ESSENCE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+\/[A-Za-z0-9!#$%&'*+.^_`|~-]+$/u;
		mediaTypeEssence = (reported) => {
			const separator = reported.indexOf(";");
			let start = 0;
			let end = separator < 0 ? reported.length : separator;
			while (start < end && (reported[start] === " " || reported[start] === "	")) start += 1;
			while (end > start && (reported[end - 1] === " " || reported[end - 1] === "	")) end -= 1;
			const essence = reported.slice(start, end);
			return MEDIA_TYPE_ESSENCE.test(essence) ? essence.toLowerCase() : null;
		};
		GROUP_BYTES = 2048;
		SEGMENT_BYTES = 1024;
		ENTRY_BYTES = 128;
		RECORD_SCRATCH_BYTES = 512;
		SEGMENT_SCRATCH_BYTES = 512;
		CAPTURE_CONTAINER_BYTES = 512;
		CAPTURE_MEMBER_BYTES = 256;
		textBytes = (length) => 32 + length * 14;
		segmentRule = (value) => {
			if (/^[0-9]+$/u.test(value)) return "numeric";
			if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu.test(value)) return "uuid";
			if (/^[0-9a-f]{32,}$/iu.test(value)) return "hex";
			if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/u.test(value)) {
				const date = new Date(`${value}T00:00:00.000Z`);
				if (Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value) return "iso-date";
			}
			return null;
		};
		WebNetworkApiSurfaceAccumulator = class {
			maximumBytes;
			includeQueryParameterNames;
			#buckets = new Map();
			#groups = [];
			#excluded = [];
			#limitations = new Set();
			#unavailableResponse = false;
			#retainedBytes = 0;
			#temporaryBytes = 0;
			constructor(maximumBytes = WEB_NETWORK_CAPTURE_LIMITS.outputBytes, includeQueryParameterNames = false) {
				this.maximumBytes = maximumBytes;
				this.includeQueryParameterNames = includeQueryParameterNames;
			}
			#retain(bytes) {
				if (this.#retainedBytes + this.#temporaryBytes + bytes > this.maximumBytes) return false;
				this.#retainedBytes += bytes;
				return true;
			}
			#temporary(bytes) {
				if (this.#retainedBytes + this.#temporaryBytes + bytes > this.maximumBytes) return false;
				this.#temporaryBytes += bytes;
				return true;
			}
			#overBudget() {
				return err(new AnalysisResourceConstraintError("inspect_analysis_view", "memory", "API-surface retained state and temporary work exceed the projection representation budget.", { output_bytes: this.maximumBytes }));
			}
			/** Reserve schema output and validation scratch while the borrowed parent stays live. */
			admitCaptureClone(value) {
				return this.#admitCaptureValue(value, new Set(), 0, false);
			}
			/** Admit the complete portable envelope before cloning or authenticating it. */
			admitInlineEvidence(value) {
				return this.#admitCaptureValue(value, new Set(), 0, true);
			}
			#admitCaptureValue(value, ancestors, depth, inline) {
				if (depth > 1e3 + (inline ? 4 : 3) || typeof value === "object" && value !== null && ancestors.has(value)) return this.#invalidCapture();
				if (!this.#retain(CAPTURE_MEMBER_BYTES)) return this.#overBudget();
				if (inline && typeof value === "string" && !this.#retain(textBytes(value.length))) return this.#overBudget();
				if (typeof value !== "object" || value === null) return ok(undefined);
				if (!this.#retain(CAPTURE_CONTAINER_BYTES)) return this.#overBudget();
				ancestors.add(value);
				if (Array.isArray(value)) {
					for (let index = 0; index < value.length; index += 1) {
						const descriptor = Object.getOwnPropertyDescriptor(value, index);
						if (descriptor === undefined || !Object.hasOwn(descriptor, "value")) return this.#invalidCapture();
						const admitted = this.#admitCaptureValue(descriptor.value, ancestors, depth + 1, inline);
						if (!admitted.ok) return admitted;
					}
				} else {
					const prototype = Object.getPrototypeOf(value);
					if (prototype !== Object.prototype && prototype !== null) return this.#invalidCapture();
					for (const key of Object.getOwnPropertyNames(value)) {
						if (inline && !this.#retain(textBytes(key.length))) return this.#overBudget();
						const descriptor = Object.getOwnPropertyDescriptor(value, key);
						if (descriptor === undefined || !Object.hasOwn(descriptor, "value")) return this.#invalidCapture();
						const admitted = this.#admitCaptureValue(descriptor.value, ancestors, depth + 1, inline);
						if (!admitted.ok) return admitted;
					}
				}
				ancestors.delete(value);
				return ok(undefined);
			}
			#invalidCapture() {
				return err(new AnalysisInputError("inspect_analysis_view", undefined, [{
					path: ["source"],
					reason: "invalid_value",
					message: "Parent capture must contain bounded ordinary JSON data without cycles or accessors."
				}]));
			}
			addLimitations(limitations) {
				for (const limitation of limitations) {
					if (this.#limitations.has(limitation)) continue;
					if (!this.#retain(ENTRY_BYTES + textBytes(limitation.length))) return this.#overBudget();
					this.#limitations.add(limitation);
				}
				return ok(undefined);
			}
			#exclude(ordinal, reason) {
				if (!this.#retain(ENTRY_BYTES + RECORD_SCRATCH_BYTES)) return this.#overBudget();
				this.#excluded.push({
					ordinal,
					reason
				});
				return ok(undefined);
			}
			/** Scan literal spans; only matched segments need descriptors or template parts. */
			#route(path) {
				const segments = [];
				const parts = [];
				const rules = [];
				let templateLength = path.length;
				let rulesLength = 0;
				let copied = 0;
				let index = 0;
				let start = 1;
				for (;;) {
					const slash = path.indexOf("/", start);
					const end = slash < 0 ? path.length : slash;
					const value = path.slice(start, end);
					const rule = segmentRule(value);
					if (rule !== null) {
						if (!this.#temporary(SEGMENT_SCRATCH_BYTES)) return this.#overBudget();
						const placeholder = `{${rule}}`;
						const identity = `${index}:${rule};`;
						segments.push({
							segment_index: index,
							rule,
							value
						});
						parts.push(path.slice(copied, start), placeholder);
						rules.push(identity);
						templateLength += placeholder.length - value.length;
						rulesLength += identity.length;
						copied = end;
					}
					if (slash < 0) break;
					start = slash + 1;
					index += 1;
				}
				if (segments.length === 0) return ok({
					template: path,
					rules: "",
					segments
				});
				if (!this.#temporary(textBytes(templateLength) + textBytes(rulesLength))) return this.#overBudget();
				parts.push(path.slice(copied));
				return ok({
					template: parts.join(""),
					rules: rules.join(""),
					segments
				});
			}
			add(record) {
				const limitations = this.addLimitations(record.limitations);
				if (!limitations.ok) return limitations;
				const request = requestSchema.safeParse(record.reported);
				if (!request.success) return this.#exclude(record.ordinal, "request-unavailable");
				const { url, method } = request.data.request;
				if (url === null) return this.#exclude(record.ordinal, "url-redacted");
				if (typeof url !== "string") return this.#exclude(record.ordinal, "url-unparseable");
				if (!this.#temporary(RECORD_SCRATCH_BYTES + textBytes(url.length))) return this.#overBudget();
				try {
					const parsed = parseRecordedTransportUrl(url, { includeQuery: this.includeQueryParameterNames });
					if (parsed.origin === null) return this.#exclude(record.ordinal, "url-unparseable");
					if (typeof method !== "string" || method.length === 0) return this.#exclude(record.ordinal, "method-unavailable");
					if (parsed.path === null) return this.#exclude(record.ordinal, "url-unparseable");
					const response = responseSchema.safeParse(record.reported);
					const status = response.success ? response.data.response.status : undefined;
					const content = contentSchema.safeParse(response.success ? response.data.response.content : undefined);
					const mime = content.success ? content.data.mimeType : undefined;
					const rawMime = typeof mime === "string" ? mime : "";
					if (!this.#temporary(textBytes(rawMime.length))) return this.#overBudget();
					const route = this.#route(parsed.path);
					if (!route.ok) return route;
					const queryNames = this.#queryNames(parsed.query);
					if (!queryNames.ok) return queryNames;
					return this.#append(record.ordinal, method, parsed.origin, route.value, typeof status === "number" && status !== 0 ? status : null, mediaTypeEssence(rawMime), queryNames.value);
				} finally {
					this.#temporaryBytes = 0;
				}
			}
			#queryNames(query) {
				if (query === undefined) return ok(undefined);
				let pairs = query.length > 1 ? 1 : 0;
				for (const character of query) if (character === "&") pairs += 1;
				if (!this.#temporary(RECORD_SCRATCH_BYTES + textBytes(query.length) + pairs * ENTRY_BYTES * 4)) return this.#overBudget();
				return ok(new Set(parseUrlQueryParameterNames(query)));
			}
			#append(ordinal, method, origin, route, status, mime, queryNames) {
				let group = this.#buckets.get(method)?.get(origin)?.get(route.template)?.get(route.rules);
				let bytes = ENTRY_BYTES;
				if (group === undefined) {
					bytes += GROUP_BYTES + textBytes(method.length) + textBytes(origin.length) + textBytes(route.template.length) + textBytes(route.rules.length);
					for (const segment of route.segments) bytes += SEGMENT_BYTES + ENTRY_BYTES + textBytes(segment.value.length);
				} else {
					for (const [index, segment] of route.segments.entries()) {
						if (!group.segments[index].values.has(segment.value)) bytes += ENTRY_BYTES + textBytes(segment.value.length);
					}
				}
				if (status !== null && !group?.statuses.has(status)) bytes += ENTRY_BYTES;
				if (mime !== null && !group?.contentTypes.has(mime)) bytes += ENTRY_BYTES + textBytes(mime.length);
				if (queryNames !== undefined) {
					if (group === undefined) bytes += CAPTURE_CONTAINER_BYTES;
					for (const name of queryNames) {
						bytes += ENTRY_BYTES;
						if (!group?.queryNames?.has(name)) bytes += ENTRY_BYTES + textBytes(name.length);
					}
				}
				if (!this.#retain(bytes)) return this.#overBudget();
				if (group === undefined) {
					group = {
						method,
						origin,
						path_template: route.template,
						segments: route.segments.map((segment) => ({
							segment_index: segment.segment_index,
							rule: segment.rule,
							values: new Set([segment.value])
						})),
						ordinals: [],
						statuses: new Set(),
						contentTypes: new Set(),
						...queryNames === undefined ? {} : { queryNames: new Map() }
					};
					const byOrigin = this.#buckets.get(method) ?? new Map();
					this.#buckets.set(method, byOrigin);
					const byTemplate = byOrigin.get(origin) ?? new Map();
					byOrigin.set(origin, byTemplate);
					const byRule = byTemplate.get(route.template) ?? new Map();
					byTemplate.set(route.template, byRule);
					byRule.set(route.rules, group);
					this.#groups.push(group);
				} else {
					for (const [index, segment] of route.segments.entries()) group.segments[index].values.add(segment.value);
				}
				group.ordinals.push(ordinal);
				if (status === null || mime === null) this.#unavailableResponse = true;
				if (status !== null) group.statuses.add(status);
				if (mime !== null) group.contentTypes.add(mime);
				if (queryNames !== undefined && group.queryNames !== undefined) {
					for (const name of queryNames) {
						const ordinals = group.queryNames.get(name);
						if (ordinals === undefined) group.queryNames.set(name, [ordinal]);
						else ordinals.push(ordinal);
					}
				}
				return ok(undefined);
			}
			page(offset, limit) {
				this.#groups.sort((a, b) => compareUnicodeCodePoints(a.origin, b.origin) || compareUnicodeCodePoints(a.path_template, b.path_template) || compareUnicodeCodePoints(a.method, b.method));
				const groups = this.#groups.slice(offset, offset + limit).map((group) => ({
					method: group.method,
					origin: group.origin,
					path_template: group.path_template,
					templated_segments: group.segments.map((segment) => ({
						segment_index: segment.segment_index,
						rule: segment.rule,
						basis: "inferred",
						observed_values: [...segment.values].sort(compareUnicodeCodePoints)
					})),
					record_ordinals: [...group.ordinals],
					statuses: [...group.statuses].sort((a, b) => a - b),
					content_types: [...group.contentTypes].sort(compareUnicodeCodePoints),
					...group.queryNames === undefined ? {} : { query_parameter_names: [...group.queryNames].sort(([a], [b]) => compareUnicodeCodePoints(a, b)).map(([name, record_ordinals]) => ({
						name,
						record_ordinals: [...record_ordinals]
					})) },
					flags: [
						...group.ordinals.length === 1 ? ["single-sample"] : [],
						...group.statuses.size > 1 ? ["mixed-statuses"] : [],
						...group.contentTypes.size > 1 ? ["mixed-content-types"] : []
					]
				}));
				return {
					coverage: pageViewCoverage(offset, groups.length, this.#groups.length),
					groups,
					templated_groups: this.#groups.reduce((count, group) => count + (group.segments.length > 0 ? 1 : 0), 0),
					excluded_records: [...this.#excluded],
					limitations: [...this.#limitations].sort(compareUnicodeCodePoints),
					unknowns: this.#unavailableResponse ? ["Some retained records have unavailable status or content type values."] : []
				};
			}
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/webNetworkApiSurfaceView.js
var apiSurfaceViewSchema, ruleSchema, groupSchema, apiSurfaceFields, projectWebNetworkApiSurfaceView;
function init_webNetworkApiSurfaceView() {
	return (init_webNetworkApiSurfaceView = __esmMin((() => {
		init_analysisViewErrors();
		init_analysisErrorCore();
		init_result();
		init_webNetworkCapture();
		init_WebNetworkApiSurfaceAccumulator();
		apiSurfaceViewSchema = z.strictObject({
			kind: z.literal("api-surface"),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(50),
			include_query_parameter_names: z.boolean().optional().describe("Include distinct observed query parameter names and their original record ordinals; names do not establish required parameters or a complete API schema.")
		});
		ruleSchema = z.enum([
			"numeric",
			"uuid",
			"hex",
			"iso-date"
		]);
		groupSchema = z.strictObject({
			method: z.string(),
			origin: z.string(),
			path_template: z.string(),
			templated_segments: z.array(z.strictObject({
				segment_index: z.number().int().nonnegative(),
				rule: ruleSchema,
				basis: z.literal("inferred"),
				observed_values: z.array(z.string())
			})),
			record_ordinals: z.array(z.number().int().nonnegative()),
			statuses: z.array(z.number()),
			content_types: z.array(z.string()),
			query_parameter_names: z.array(z.strictObject({
				name: z.string(),
				record_ordinals: z.array(z.number().int().nonnegative())
			})).optional(),
			flags: z.array(z.enum([
				"single-sample",
				"mixed-statuses",
				"mixed-content-types"
			]))
		});
		apiSurfaceFields = {
			records: z.strictObject({
				examined: z.number().int().nonnegative(),
				total: z.number().int().nonnegative(),
				excluded: z.number().int().nonnegative()
			}),
			templated_groups: z.number().int().nonnegative().describe("Groups across every page that carry at least one templated segment."),
			groups: z.array(groupSchema),
			excluded_records: z.array(z.strictObject({
				ordinal: z.number().int().nonnegative(),
				reason: z.enum([
					"url-redacted",
					"url-unparseable",
					"request-unavailable",
					"method-unavailable"
				])
			}))
		};
		projectWebNetworkApiSurfaceView = (parent, view, accumulator = new WebNetworkApiSurfaceAccumulator(undefined, view.kind === "api-surface" && view.include_query_parameter_names === true)) => {
			const unsupported = (reason) => err(new AnalysisUnsupportedTargetError("inspect_analysis_view", parent.evidenceId, reason));
			if (parent.operation !== "inspect_web_network_capture" || view.kind !== "api-surface") return unsupported(`View ${view.kind} is unsupported for parent operation ${parent.operation}; api-surface requires inspect_web_network_capture.`);
			const admitted = accumulator.admitCaptureClone(parent.normalizedResult);
			if (!admitted.ok) return admitted;
			const parsed = webNetworkCaptureSchema.safeParse(parent.normalizedResult);
			if (!parsed.success) return err(analysisViewInputError([{
				path: ["source"],
				reason: "invalid_value",
				message: "Parent Evidence result does not match inspect_web_network_capture."
			}]));
			const capture = parsed.data;
			if (capture.format !== "har") return unsupported(`api-surface does not support capture format ${capture.format}.`);
			const declarations = z.object({ sensitive_value_count: z.number().int().nonnegative() }).safeParse(parent.parameters);
			if (!declarations.success || declarations.data.sensitive_value_count > 0) return unsupported("sensitive_values_unretained");
			const limitations = accumulator.addLimitations([
				...parent.limitations,
				...capture.limitations,
				"Grouping does not establish handler identity, URL-space schemas or causality.",
				...view.include_query_parameter_names === true ? ["Observed query parameter names do not establish required parameters, value types or a complete API schema."] : [],
				...capture.records.length < capture.total_records ? ["Parent contains an ordinal subset; the surface covers only retained records."] : []
			]);
			if (!limitations.ok) return limitations;
			for (const record of capture.records) {
				const added = accumulator.add(record);
				if (!added.ok) return added;
			}
			const page = accumulator.page(view.offset, view.limit);
			return ok({
				kind: "api-surface",
				view,
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_web_network_capture",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: capture.artifact.path,
					sha256: capture.artifact.sha256
				},
				records: {
					examined: capture.records.length,
					total: capture.total_records,
					excluded: page.excluded_records.length
				},
				...page
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewText.js
var viewError$1, analysisTextPage;
function init_analysisViewText() {
	return (init_analysisViewText = __esmMin((() => {
		init_analysisViewErrors();
		init_result();
		init_analysisViewCoverage();
		viewError$1 = (message) => analysisViewInputError([{
			path: ["view"],
			reason: "invalid_value",
			message
		}]);
		analysisTextPage = (body, offset, limit, label = "Pseudocode") => {
			const start = Math.min(offset, body.length);
			const high = (n) => n >= 55296 && n <= 56319;
			const low = (n) => n >= 56320 && n <= 57343;
			if (start > 0 && start < body.length && high(body.charCodeAt(start - 1)) && low(body.charCodeAt(start))) return err(viewError$1(`${label} offset splits a UTF-16 surrogate pair.`));
			let end = Math.min(start + limit, body.length);
			if (end > start && end < body.length && high(body.charCodeAt(end - 1)) && low(body.charCodeAt(end))) end--;
			if (end === start && start < body.length) return err(viewError$1(`Increase ${label.toLowerCase()} limit to include the next complete Unicode character.`));
			return ok({
				item: {
					text: body.slice(start, end),
					unit: "utf16-code-units"
				},
				coverage: pageViewCoverage(start, end - start, body.length)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/nativeFunctionView.js
var viewError, parentFields, nativeRows, projectNativeFunctionView;
function init_nativeFunctionView() {
	return (init_nativeFunctionView = __esmMin((() => {
		init_analysisViewErrors();
		init_analysisViewText();
		init_canonicalOrdering();
		init_jsonValue();
		init_result();
		init_analysisViewCoverage();
		viewError = (message) => analysisViewInputError([{
			path: ["view"],
			reason: "invalid_value",
			message
		}]);
		parentFields = (parent, dossier, artifact) => {
			const flow = dossier.native_value_flow;
			const api = dossier.native_api;
			const unknowns = [];
			if (flow === null) unknowns.push("native_value_flow was not recorded");
			else if (!flow.available) unknowns.push("native_value_flow unavailable: " + flow.reason);
			else if (flow.truncated) unknowns.push("native_value_flow is truncated; omitted observations remain unknown");
			if (api === null) unknowns.push("native_api was not recorded");
			else if (!api.available) unknowns.push("native_api unavailable: " + api.reason, ...api.residual_unknowns);
			return {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "analyze_function",
				parent_digest: parent.evidenceId.slice(3),
				procedure_address: dossier.procedure.address,
				artifact,
				limitations: uniqueSorted([
					...parent.limitations,
					...dossier.limitations,
					...flow?.limitations ?? [],
					...api?.available ? api.limitations : []
				]),
				unknowns: uniqueSorted(unknowns)
			};
		};
		nativeRows = (dossier, facet) => {
			const sourceFlow = dossier.native_value_flow;
			const flow = sourceFlow?.available ? sourceFlow : undefined;
			return {
				assembly: dossier.assembly,
				basic_blocks: dossier.basic_blocks,
				comments: dossier.comments,
				callers: dossier.callers,
				callees: dossier.callees,
				incoming_references: dossier.incoming_references,
				outgoing_references: dossier.outgoing_references,
				unresolved_calls: dossier.unresolved_calls,
				referenced_strings: dossier.referenced_strings,
				referenced_names: dossier.referenced_names,
				swift_string_literals: dossier.swift_string_literals,
				swift_string_literal_omissions: dossier.swift_string_literal_omissions,
				value_flow_operations: flow?.operations,
				value_flow_def_use: flow?.def_use,
				value_flow_effects: flow?.effects,
				value_flow_parameters: flow?.parameters,
				value_flow_parameter_uses: flow?.parameter_uses
			}[facet];
		};
		projectNativeFunctionView = (parent, dossier, view) => {
			if (view.kind !== "native") return err(viewError("analyze_function Evidence requires a native view."));
			const artifact = parent.artifact;
			if (!artifact) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "Native function Evidence requires an artifact-bound subject."
			}]));
			const common = parentFields(parent, dossier, artifact);
			const availabilityKeys = {
				incoming_references: "references",
				outgoing_references: "references",
				referenced_strings: "strings_names",
				referenced_names: "strings_names",
				basic_blocks: "cfg"
			};
			const availabilityKey = availabilityKeys[view.facet] ?? view.facet;
			const availability = dossier.facet_availability?.[availabilityKey];
			if (availability?.available === false) common.unknowns = uniqueSorted([...common.unknowns, availability.reason]);
			const singleton = (item) => ({
				kind: "native",
				view,
				item: jsonValueSchema.parse(item),
				coverage: completeWithinViewCoverage(1, 1),
				...common
			});
			if (availability?.available === false) return ok(singleton(availability));
			const flow = dossier.native_value_flow;
			if (view.facet === "procedure" || view.facet === "native_api" || view.facet === "value_flow_summary") {
				if (view.offset !== 0) return err(viewError("Singleton native facets require offset 0."));
				if (view.facet === "procedure") return ok(singleton(dossier.procedure));
				if (view.facet === "native_api") return ok(singleton(dossier.native_api ?? {
					available: false,
					reason: "not recorded"
				}));
				const status = flow === null ? {
					available: false,
					reason: "not recorded"
				} : !flow.available ? {
					available: false,
					reason: flow.reason
				} : {
					available: true,
					provenance: flow.provenance,
					truncated: flow.truncated,
					omitted_operations_lower_bound: flow.omitted_operations_lower_bound,
					known_omitted_inputs: flow.known_omitted_inputs,
					known_omitted_edges: flow.known_omitted_edges,
					operations: flow.operations.length,
					def_use: flow.def_use.length,
					effects: flow.effects.length,
					parameters: flow.parameters.length,
					parameter_uses: flow.parameter_uses.length
				};
				return ok(singleton(status));
			}
			if (view.facet === "pseudocode") {
				const page = analysisTextPage(dossier.pseudocode, view.offset, view.limit);
				return page.ok ? ok({
					kind: "native",
					view,
					...page.value,
					...common
				}) : page;
			}
			const rows = nativeRows(dossier, view.facet);
			if (rows === undefined) return ok(singleton({
				available: false,
				reason: view.facet.startsWith("value_flow_") && flow?.available === false ? flow.reason : "not recorded"
			}));
			const items = rows.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "native",
				view,
				item: jsonValueSchema.parse(items),
				coverage: pageViewCoverage(view.offset, items.length, rows.length),
				...common
			});
		};
	})))();
}

//#endregion
//#region dist/domain/evm/solidityMetadata.js
var solidityMetadataScalarSchema, solidityMetadataSchema;
function init_solidityMetadata() {
	return (init_solidityMetadata = __esmMin((() => {
		solidityMetadataScalarSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("text"),
				value: z.string().max(65535)
			}),
			z.strictObject({
				kind: z.literal("integer"),
				value: z.string().max(21).regex(/^-?(?:0|[1-9][0-9]*)$/)
			}),
			z.strictObject({
				kind: z.literal("bytes"),
				value: z.string().max(131070).regex(/^(?:[a-f0-9]{2})*$/)
			}),
			z.strictObject({
				kind: z.literal("boolean"),
				value: z.boolean()
			}),
			z.strictObject({ kind: z.literal("null") }),
			z.strictObject({
				kind: z.literal("uninterpreted"),
				container: z.enum(["array", "map"])
			})
		]);
		solidityMetadataSchema = z.strictObject({
			profile: z.literal("terminal-cbor-scalars-v1"),
			status: z.enum([
				"unavailable",
				"decoded",
				"partial",
				"not-decoded"
			]),
			bytecode_offset: z.number().int().nonnegative().nullable(),
			cbor_bytes: z.number().int().positive().max(65535).nullable(),
			entries: z.array(z.strictObject({
				key: solidityMetadataScalarSchema,
				value: solidityMetadataScalarSchema
			})).max(32767),
			compiler_version: z.strictObject({
				representation: z.enum(["release-bytes", "prerelease-text"]),
				value: z.string().min(1).max(65535)
			}).nullable(),
			diagnostic: z.string().max(512).nullable()
		}).superRefine((value, context) => {
			const unavailable = value.status === "unavailable";
			if (unavailable ? value.bytecode_offset !== null || value.cbor_bytes !== null : value.bytecode_offset === null || value.cbor_bytes === null) context.addIssue({
				code: "custom",
				message: "Only unavailable metadata omits the candidate range."
			});
			const unexamined = unavailable || value.status === "not-decoded";
			if (unexamined && (value.entries.length !== 0 || value.compiler_version !== null)) context.addIssue({
				code: "custom",
				message: "Unavailable interpretation cannot report decoded entries or compiler identity."
			});
			const uninterpreted = value.entries.some(({ key, value: entryValue }) => key.kind === "uninterpreted" || entryValue.kind === "uninterpreted");
			if (value.status === "decoded" && uninterpreted || value.status === "partial" && !uninterpreted) context.addIssue({
				code: "custom",
				message: "Scalar coverage must preserve uninterpreted containers."
			});
		});
	})))();
}

//#endregion
//#region dist/domain/evm/evmInterface.js
var byteOffset, sha256$2, inspectEvmInterfaceInputSchema, evmInterfaceSchema;
function init_evmInterface() {
	return (init_evmInterface = __esmMin((() => {
		init_localPath();
		init_solidityMetadata();
		byteOffset = z.number().int().nonnegative();
		sha256$2 = z.string().regex(/^[a-f0-9]{64}$/);
		inspectEvmInterfaceInputSchema = z.strictObject({
			path: localPathStringSchema.describe("Absolute path to caller-selected local bytecode carrier"),
			encoding: z.enum(["raw", "hex"]).describe("Raw bytes or UTF-8 hex with optional 0x prefix and outer ASCII whitespace")
		});
		evmInterfaceSchema = z.strictObject({
			artifact: z.strictObject({
				path: z.string().min(1),
				sha256: sha256$2,
				bytes: byteOffset,
				encoding: z.enum(["raw", "hex"])
			}),
			bytecode: z.strictObject({
				sha256: sha256$2,
				bytes: byteOffset,
				hex: z.string().regex(/^(?:[0-9a-f]{2})*$/),
				digest_algorithm: z.literal("sha256"),
				kind: z.literal("unknown"),
				deployment_authenticity: z.literal("unknown"),
				hardfork: z.literal("unknown"),
				metadata: solidityMetadataSchema.nullable().default(null)
			}),
			evidence_kind: z.literal("inferred"),
			functions: z.array(z.strictObject({
				selector: z.string().regex(/^0x[0-9a-f]{8}$/),
				bytecode_offset: byteOffset,
				dispatch: z.enum(["abi", "fallback"]),
				inferred_arguments: z.string().nullable(),
				inferred_state_mutability: z.string().nullable()
			})),
			discovery_completeness: z.literal("unknown"),
			runtime_execution: z.literal("not-performed"),
			diagnostics: z.strictObject({
				stdout: z.string(),
				stderr: z.string(),
				truncated: z.boolean()
			}),
			limitations: z.array(z.string())
		}).superRefine((value, context) => {
			if (value.bytecode.hex.length !== value.bytecode.bytes * 2) context.addIssue({
				code: "custom",
				path: ["bytecode"],
				message: "Selected byte count does not match the bytecode hex representation."
			});
			const metadata = value.bytecode.metadata;
			if (metadata !== null && metadata.status !== "unavailable" && (metadata.bytecode_offset === null || metadata.cbor_bytes === null || metadata.bytecode_offset + metadata.cbor_bytes + 2 !== value.bytecode.bytes || metadata.cbor_bytes !== Number.parseInt(value.bytecode.hex.slice(-4), 16))) context.addIssue({
				code: "custom",
				path: ["bytecode", "metadata"],
				message: "Metadata range must match the terminal length suffix in selected bytecode."
			});
			for (const [index, fn] of value.functions.entries()) if (fn.bytecode_offset >= value.bytecode.bytes) context.addIssue({
				code: "custom",
				path: [
					"functions",
					index,
					"bytecode_offset"
				],
				message: "Inferred body offset lies outside the selected bytecode."
			});
		});
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisViewParent.js
var parseAnalysisViewResult;
function init_analysisViewParent() {
	return (init_analysisViewParent = __esmMin((() => {
		init_inputIssueProjection();
		init_result();
		parseAnalysisViewResult = (schema, parent) => {
			const parsed = schema.safeParse(parent.normalizedResult);
			if (parsed.success) return ok(parsed.data);
			return err(analysisInputErrorFromIssues("inspect_analysis_view", parsed.error.issues.map((issue) => ({
				...issue,
				path: [
					"source",
					"normalized_result",
					...issue.path
				]
			})), { source: { normalized_result: parent.normalizedResult } }, { cause: parsed.error }));
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/evmInterfaceView.js
var evmViewRequestSchema, evmViewItemSchema, evmSummarySchema, projectEvmInterfaceView;
function init_evmInterfaceView() {
	return (init_evmInterfaceView = __esmMin((() => {
		init_analysisViewErrors();
		init_canonicalOrdering();
		init_evmInterface();
		init_result();
		init_analysisViewParent();
		init_analysisViewCoverage();
		init_analysisViewText();
		evmViewRequestSchema = z.strictObject({
			kind: z.literal("evm"),
			facet: z.enum([
				"functions",
				"bytecode_hex",
				"stdout",
				"stderr"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		evmViewItemSchema = z.union([evmInterfaceSchema.shape.functions, z.strictObject({
			text: z.string(),
			unit: z.literal("utf16-code-units")
		})]);
		evmSummarySchema = z.strictObject({
			artifact: evmInterfaceSchema.shape.artifact,
			bytecode: evmInterfaceSchema.shape.bytecode.omit({ hex: true }),
			evidence_kind: evmInterfaceSchema.shape.evidence_kind,
			functions: evmInterfaceSchema.shape.functions,
			discovery_completeness: evmInterfaceSchema.shape.discovery_completeness,
			runtime_execution: evmInterfaceSchema.shape.runtime_execution,
			diagnostics: evmInterfaceSchema.shape.diagnostics.omit({ stdout: true }).extend({ stdout_code_units: z.number().int().nonnegative() }),
			limitations: evmInterfaceSchema.shape.limitations
		});
		projectEvmInterfaceView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "evm") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "EVM Evidence supports summary and evm views."
			}]));
			const parsed = parseAnalysisViewResult(evmInterfaceSchema, parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			if (parent.subject == null || parent.subject.format !== "file" || parent.subject.local_path !== report.artifact.path || parent.subject.digest.sha256 !== report.artifact.sha256) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "EVM parent subject must identify the report's exact carrier path and SHA-256."
			}]));
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_evm_interface",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: report.artifact.path,
					sha256: report.artifact.sha256
				},
				limitations: uniqueSorted([...parent.limitations, ...report.limitations]),
				unknowns: ["Candidates remain inferred; discovery completeness, bytecode kind, hardfork and deployment authenticity are unknown. Runtime execution was not performed."]
			};
			if (view.kind === "summary") {
				const { hex: _hex, ...bytecode } = report.bytecode;
				const { stdout, ...diagnostics } = report.diagnostics;
				return ok({
					kind: "summary",
					view,
					...shared,
					summary: {
						artifact: report.artifact,
						bytecode,
						evidence_kind: report.evidence_kind,
						functions: report.functions,
						discovery_completeness: report.discovery_completeness,
						runtime_execution: report.runtime_execution,
						diagnostics: {
							...diagnostics,
							stdout_code_units: stdout.length
						},
						limitations: report.limitations
					},
					coverage: completeWithinViewCoverage(report.functions.length, report.functions.length)
				});
			}
			if (view.facet === "functions") {
				const item = report.functions.slice(view.offset, view.offset + view.limit);
				return ok({
					kind: "evm",
					view,
					item,
					...shared,
					coverage: pageViewCoverage(view.offset, item.length, report.functions.length)
				});
			}
			const text = view.facet === "bytecode_hex" ? report.bytecode.hex : report.diagnostics[view.facet];
			const page = analysisTextPage(text, view.offset, view.limit, view.facet);
			return page.ok ? ok({
				kind: "evm",
				view,
				...page.value,
				...shared
			}) : page;
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/artifactInventoryView.js
var inputError, parseSource, projectArtifactInventoryView;
function init_artifactInventoryView() {
	return (init_artifactInventoryView = __esmMin((() => {
		init_analysisErrorCore();
		init_canonicalOrdering();
		init_result();
		init_artifactInventoryEvidence();
		init_artifactInspection();
		init_analysisViewCoverage();
		inputError = (message) => new AnalysisInputError("inspect_analysis_view", undefined, [{
			path: ["source"],
			reason: "invalid_value",
			message
		}]);
		parseSource = (parent) => {
			try {
				if (parent.operation === "inventory_artifact") return ok({
					inventory: parseArtifactInventoryResult(parent.normalizedResult, parent.subject ?? null),
					evidenceIds: [parent.evidenceId],
					inspection: null
				});
				const inspection = artifactInspectionResultSchema.parse(parent.normalizedResult);
				for (const step of inspection.substeps) {
					if (step.evidence_id !== step.evidence.evidence_id || step.evidence.operation !== step.operation) throw new TypeError("Inspection substep identity differs from its source Evidence");
				}
				const parsed = parseArtifactInventoryEvidence(inspection.substeps.map(({ evidence }) => evidence));
				const manifest = parsed.inventory.manifest;
				validateArtifactInventorySubject(parent.subject ?? null, manifest);
				if (inspection.subject.manifest_id !== manifest.manifest_id || inspection.subject.root_artifact_id !== manifest.root_artifact_id || inspection.subject.root_sha256 !== manifest.root_sha256 || inspection.subject.root_format !== manifest.root_format) throw new TypeError("Inspection subject differs from its inventory manifest");
				return ok({
					inventory: parsed.inventory,
					evidenceIds: parsed.evidence.map(({ evidence_id }) => evidence_id),
					inspection
				});
			} catch (cause) {
				if (!(cause instanceof TypeError) && !(cause instanceof z.ZodError)) throw cause;
				return err(inputError(cause.message));
			}
		};
		projectArtifactInventoryView = (parent, view) => {
			const operation = parent.operation;
			if (operation !== "inventory_artifact" && operation !== "inspect_artifact") return err(inputError("Inventory views require inventory_artifact or inspect_artifact Evidence."));
			if (view.kind !== "summary" && view.kind !== "inventory") return err(inputError("Artifact Evidence supports summary and inventory views."));
			const parsed = parseSource(parent);
			if (!parsed.ok) return parsed;
			const { inventory, evidenceIds, inspection } = parsed.value;
			const limitations = uniqueSorted([
				...parent.limitations,
				...inventory.limitations,
				...inspection?.limitations ?? []
			]);
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: operation,
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: parent.artifact?.path ?? "",
					sha256: inventory.manifest.root_sha256
				},
				limitations,
				unknowns: ["Inventory does not establish application runtime behavior or complete format-specific analysis.", ...inventory.complete ? [] : ["Parent inventory is partial; counts and exhausted pages cover only available records. Missing matches do not establish absence."]]
			};
			if (view.kind === "summary") {
				const counts = {
					file: 0,
					directory: 0,
					symlink: 0,
					slice: 0
				};
				for (const occurrence of inventory.occurrences) counts[occurrence.entry_kind]++;
				const examined = inventory.nodes.length + inventory.occurrences.length + inventory.edges.length;
				return ok({
					kind: "summary",
					view,
					summary: {
						manifest: inventory.manifest,
						available_counts: {
							nodes: inventory.nodes.length,
							occurrences: inventory.occurrences.length,
							edges: inventory.edges.length,
							integrity_contradictions: inventory.integrityContradictions.length
						},
						observed_entry_kind_counts: counts,
						source_complete: inventory.complete,
						inventory_evidence_ids: [...evidenceIds],
						inspection: inspection === null ? null : {
							coverage: inspection.coverage,
							unexplored_branches: inspection.unexplored_branches
						},
						limitation_count: limitations.length
					},
					coverage: completeWithinViewCoverage(examined, examined),
					...shared
				});
			}
			const paths = view.collection === "occurrences" && view.logical_paths !== undefined ? new Set(view.logical_paths) : undefined;
			const rows = view.collection === "occurrences" && paths !== undefined ? inventory.occurrences.filter((row) => paths.has(row.logical_path)) : view.collection === "occurrences" ? inventory.occurrences : view.collection === "nodes" ? inventory.nodes : view.collection === "edges" ? inventory.edges : inventory.integrityContradictions;
			const items = rows.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "inventory",
				view,
				manifest: inventory.manifest,
				inventory_evidence_ids: [...evidenceIds],
				source_complete: inventory.complete,
				items,
				coverage: pageViewCoverage(view.offset, items.length, rows.length),
				...shared
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/managedArtifactView.js
var managedViewRequestSchema, managedViewItemSchema, managedSummarySchema, managedViewContextSchema, managedViewIdentityUnknowns, projectManagedArtifactView;
function init_managedArtifactView() {
	return (init_managedArtifactView = __esmMin((() => {
		init_analysisViewErrors();
		init_canonicalOrdering();
		init_managedArtifact();
		init_result();
		init_analysisViewParent();
		init_analysisViewCoverage();
		managedViewRequestSchema = z.strictObject({
			kind: z.literal("managed"),
			collection: z.enum([
				"references",
				"resources",
				"attributes"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		managedViewItemSchema = z.union([
			managedArtifactInspectionSchema.shape.references,
			managedArtifactInspectionSchema.shape.resources,
			managedArtifactInspectionSchema.shape.attributes
		]);
		managedSummarySchema = managedArtifactInspectionSchema.omit({
			references: true,
			resources: true,
			attributes: true
		}).extend({
			reported_counts: z.strictObject({
				references: z.number().int().nonnegative(),
				resources: z.number().int().nonnegative(),
				attributes: z.number().int().nonnegative()
			}),
			identity_scope: managedMemberInspectionSchema.shape.identity_scope
		});
		managedViewContextSchema = z.strictObject({
			identity_scope: managedMemberInspectionSchema.shape.identity_scope,
			source_metadata_status: managedArtifactInspectionSchema.shape.metadata.shape.status,
			source_coverage: managedArtifactInspectionSchema.shape.coverage
		});
		managedViewIdentityUnknowns = (parent, mvid) => [
			"Metadata tokens are build-local coordinates bound to the recorded artifact SHA-256 and module MVID; this view does not load or execute the assembly.",
			...parent.subject == null ? ["The parent has no recorded subject; its normalized artifact identity cannot be cross-checked against a subject digest."] : [],
			...mvid === null ? ["The module MVID is unknown; tokens cannot establish a cross-observation module match."] : []
		];
		projectManagedArtifactView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "managed") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Managed artifact inspection supports summary and managed views."
			}]));
			const parsed = parseAnalysisViewResult(managedArtifactInspectionSchema, parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const identity_scope = {
				token_identity: "build-local",
				requires_artifact_sha256: report.artifact.sha256,
				requires_mvid: report.module?.mvid ?? null
			};
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_managed_artifact",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: report.artifact.path,
					sha256: report.artifact.sha256
				},
				limitations: uniqueSorted([...parent.limitations, ...report.limitations]),
				unknowns: ["Collection counts and pages cover producer-returned rows; metadata completeness remains the original metadata status and coverage, not an absence claim about unreturned rows.", ...managedViewIdentityUnknowns(parent, identity_scope.requires_mvid)]
			};
			if (view.kind === "summary") {
				const { references, resources, attributes, ...summary } = report;
				const reported_counts = {
					references: references.length,
					resources: resources.length,
					attributes: attributes.length
				};
				const total = references.length + resources.length + attributes.length;
				return ok({
					kind: "summary",
					view,
					...shared,
					summary: {
						...summary,
						reported_counts,
						identity_scope
					},
					coverage: completeWithinViewCoverage(total, total)
				});
			}
			const collection = report[view.collection];
			const item = collection.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "managed",
				view,
				item,
				...shared,
				identity_scope,
				source_metadata_status: report.metadata.status,
				source_coverage: report.coverage,
				coverage: pageViewCoverage(view.offset, item.length, collection.length)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/managedMemberView.js
var member, managedMembersViewRequestSchema, rowsOf, managedMembersViewPageSchema, nullableCount, managedMemberSummarySchema, managedMembersViewContextSchema, slice, collectionPage, validatedReports, parseMemberReport, summarizeMembers, projectManagedMemberView;
function init_managedMemberView() {
	return (init_managedMemberView = __esmMin((() => {
		init_analysisViewErrors();
		init_canonicalOrdering();
		init_managedArtifact();
		init_result();
		init_analysisViewCoverage();
		init_managedArtifactView();
		init_analysisViewParent();
		member = managedMemberInspectionSchema.shape;
		managedMembersViewRequestSchema = z.strictObject({
			kind: z.literal("managed-members"),
			collection: z.enum([
				"types",
				"exported_types",
				"fields",
				"methods",
				"member_refs",
				"call_edges",
				"field_accesses",
				"user_strings"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		rowsOf = (collection, rows) => z.strictObject({
			collection: z.literal(collection),
			rows
		});
		managedMembersViewPageSchema = z.discriminatedUnion("collection", [
			rowsOf("types", member.types),
			rowsOf("exported_types", member.exported_types.unwrap().unwrap()),
			rowsOf("fields", member.fields),
			rowsOf("methods", member.methods),
			rowsOf("member_refs", member.member_refs),
			rowsOf("call_edges", member.call_edges),
			rowsOf("field_accesses", member.field_accesses),
			rowsOf("user_strings", member.user_strings.unwrap().unwrap().shape.literals)
		]);
		nullableCount = z.number().int().nonnegative().nullable();
		managedMemberSummarySchema = z.strictObject({
			artifact: member.artifact,
			module: member.module,
			metadata: member.metadata,
			identity_scope: member.identity_scope,
			selection: member.selection.unwrap(),
			coverage: member.coverage,
			user_strings: z.strictObject({
				state: member.user_strings.unwrap().unwrap().shape.state,
				issues: member.user_strings.unwrap().unwrap().shape.issues
			}).nullable(),
			limitations: member.limitations,
			reported_counts: z.strictObject({
				types: z.number().int().nonnegative(),
				exported_types: nullableCount,
				fields: z.number().int().nonnegative(),
				methods: z.number().int().nonnegative(),
				member_refs: z.number().int().nonnegative(),
				call_edges: z.number().int().nonnegative(),
				field_accesses: z.number().int().nonnegative(),
				user_strings: nullableCount
			})
		});
		managedMembersViewContextSchema = z.strictObject({
			identity_scope: member.identity_scope,
			selection: member.selection.unwrap(),
			source_metadata_status: member.metadata.shape.status,
			source_coverage: member.coverage
		});
		slice = (collection, rows, { offset, limit }) => rows == null ? null : {
			page: {
				collection,
				rows: rows.slice(offset, offset + limit)
			},
			total: rows.length
		};
		collectionPage = (report, view) => {
			const { collection } = view;
			switch (collection) {
				case "types": return slice(collection, report.types, view);
				case "exported_types": return slice(collection, report.exported_types, view);
				case "fields": return slice(collection, report.fields, view);
				case "methods": return slice(collection, report.methods, view);
				case "member_refs": return slice(collection, report.member_refs, view);
				case "call_edges": return slice(collection, report.call_edges, view);
				case "field_accesses": return slice(collection, report.field_accesses, view);
				case "user_strings": return slice(collection, report.user_strings?.literals, view);
			}
		};
		validatedReports = new WeakMap();
		parseMemberReport = (parent) => {
			const { normalizedResult } = parent;
			const sealed = parent.sealedResult === true && typeof normalizedResult === "object" && normalizedResult !== null;
			const cached = sealed ? validatedReports.get(normalizedResult)?.deref() : undefined;
			if (cached !== undefined) return ok(cached);
			const parsed = parseAnalysisViewResult(managedMemberInspectionSchema, parent);
			if (parsed.ok && sealed) validatedReports.set(normalizedResult, new WeakRef(parsed.value));
			return parsed;
		};
		summarizeMembers = (report) => {
			const { types, exported_types, fields, methods, member_refs, call_edges, field_accesses, user_strings, ...identity } = report;
			return {
				...identity,
				user_strings: user_strings === null ? null : {
					state: user_strings.state,
					issues: user_strings.issues
				},
				reported_counts: {
					types: types.length,
					exported_types: exported_types?.length ?? null,
					fields: fields.length,
					methods: methods.length,
					member_refs: member_refs.length,
					call_edges: call_edges.length,
					field_accesses: field_accesses.length,
					user_strings: user_strings?.literals.length ?? null
				}
			};
		};
		projectManagedMemberView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "managed-members") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Managed member inspection supports summary and managed-members views."
			}]));
			const parsed = parseMemberReport(parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_managed_members",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: report.artifact.path,
					sha256: report.artifact.sha256
				},
				limitations: uniqueSorted([...parent.limitations, ...report.limitations]),
				unknowns: [
					"Collection counts and pages cover producer-returned rows; member completeness remains the original coverage, not an absence claim about unreturned rows.",
					...report.selection === null ? [] : ["Exported types and member references cover the whole assembly; the other collections cover only the selected declaring types."],
					...managedViewIdentityUnknowns(parent, report.identity_scope.requires_mvid)
				]
			};
			if (view.kind === "summary") {
				const summary = summarizeMembers(report);
				const total = Object.values(summary.reported_counts).reduce((sum, count) => sum + (count ?? 0), 0);
				return ok({
					kind: "summary",
					view,
					...shared,
					summary,
					coverage: completeWithinViewCoverage(total, total)
				});
			}
			const selected = collectionPage(report, view);
			if (selected === null) return err(analysisViewInputError([{
				path: ["view", "collection"],
				reason: "invalid_value",
				message: `The parent Evidence did not examine ${view.collection}; repeat inspect_managed_members with the current runtime to record it.`
			}]));
			const { page, total } = selected;
			return ok({
				kind: "managed-members",
				view,
				page,
				...shared,
				identity_scope: report.identity_scope,
				selection: report.selection,
				source_metadata_status: report.metadata.status,
				source_coverage: view.collection === "user_strings" && report.user_strings !== null ? {
					state: report.user_strings.state,
					issues: report.user_strings.issues
				} : report.coverage,
				coverage: pageViewCoverage(view.offset, page.rows.length, total)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/wasmArtifactView.js
var wasmViewRequestSchema, wasmViewItemSchema, wasmSummarySchema, projectWasmArtifactView;
function init_wasmArtifactView() {
	return (init_wasmArtifactView = __esmMin((() => {
		init_analysisViewErrors();
		init_canonicalOrdering();
		init_result();
		init_analysisViewParent();
		init_wasmArtifact();
		init_analysisViewCoverage();
		init_analysisViewText();
		wasmViewRequestSchema = z.strictObject({
			kind: z.literal("wasm"),
			facet: z.enum([
				"sections",
				"imports",
				"exports",
				"candidates",
				"glue",
				"wat",
				"headers",
				"details",
				"tool_profile"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		wasmViewItemSchema = z.union([
			wasmArtifactSchema.shape.sections,
			wasmArtifactSchema.shape.imports,
			wasmArtifactSchema.shape.candidates,
			wasmArtifactSchema.shape.glue,
			wasmArtifactSchema.shape.tool_profile,
			z.strictObject({
				text: z.string(),
				unit: z.literal("utf16-code-units")
			})
		]);
		wasmSummarySchema = z.strictObject({
			bytes: wasmArtifactSchema.shape.artifact.shape.bytes,
			validation: wasmArtifactSchema.shape.validation,
			available_counts: z.strictObject({
				sections: z.number().int().nonnegative(),
				imports: z.number().int().nonnegative(),
				exports: z.number().int().nonnegative(),
				candidates: z.number().int().nonnegative(),
				glue: z.number().int().nonnegative()
			}),
			wat: wasmArtifactSchema.shape.wat.omit({ text: true }).extend({ code_units: z.number().int().nonnegative() }),
			tool_profile: wasmArtifactSchema.shape.tool_profile,
			runtime_execution: wasmArtifactSchema.shape.runtime_execution,
			network_fetch: wasmArtifactSchema.shape.network_fetch,
			limitation_count: z.number().int().nonnegative()
		});
		projectWasmArtifactView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "wasm") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "WASM Evidence supports summary and wasm views."
			}]));
			const parsed = parseAnalysisViewResult(wasmArtifactSchema, parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			if (!wasmArtifactMatchesSubject(report.artifact, parent.subject == null ? null : {
				path: parent.subject.local_path,
				sha256: parent.subject.digest.sha256,
				format: parent.subject.format
			})) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "WASM parent Evidence subject must identify the report's exact path and SHA-256."
			}]));
			const limitations = uniqueSorted([...parent.limitations, ...report.limitations]);
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_wasm_artifact",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: report.artifact.path,
					sha256: report.artifact.sha256
				},
				limitations,
				unknowns: ["Decoded WAT is not original source. Runtime behavior and network acquisition were not performed.", ...report.glue.some((glue) => glue.parse_status !== "complete") ? ["Selected glue parsing is incomplete; unmatched references do not establish absence."] : []]
			};
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				summary: {
					bytes: report.artifact.bytes,
					validation: report.validation,
					available_counts: {
						sections: report.sections.length,
						imports: report.imports.length,
						exports: report.exports.length,
						candidates: report.candidates.length,
						glue: report.glue.length
					},
					wat: {
						sha256: report.wat.sha256,
						representation: report.wat.representation,
						code_units: report.wat.text.length
					},
					tool_profile: report.tool_profile,
					runtime_execution: report.runtime_execution,
					network_fetch: report.network_fetch,
					limitation_count: limitations.length
				},
				coverage: completeWithinViewCoverage(report.sections.length + report.imports.length + report.exports.length, report.sections.length + report.imports.length + report.exports.length)
			});
			if (view.facet === "tool_profile") {
				if (view.offset !== 0) return err(analysisViewInputError([{
					path: ["view", "offset"],
					reason: "invalid_value",
					message: "Singleton tool_profile requires offset 0."
				}]));
				return ok({
					kind: "wasm",
					view,
					item: report.tool_profile,
					coverage: completeWithinViewCoverage(1, 1),
					...shared
				});
			}
			if (view.facet === "wat" || view.facet === "headers" || view.facet === "details") {
				const text = view.facet === "wat" ? report.wat.text : report[view.facet];
				const page = analysisTextPage(text, view.offset, view.limit, view.facet);
				return page.ok ? ok({
					kind: "wasm",
					view,
					...page.value,
					...shared
				}) : page;
			}
			const rows = report[view.facet];
			const item = rows.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "wasm",
				view,
				item,
				coverage: pageViewCoverage(view.offset, item.length, rows.length),
				...shared
			});
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeInspection.js
var hexAddress, coverage, nativeCommandInvocationSchema, architectureSchema, permissionSchema, sectionSchema, segmentSchema, symbolSchema, dependencySchema$1, loadCommandSchema, buildMetadataSchema, inspectMachoSchema, inspectSignatureSchema, inspectPlistSchema, listArchitecturesSchema, demangleSwiftSchema;
function init_nativeInspection() {
	return (init_nativeInspection = __esmMin((() => {
		init_jsonValue();
		hexAddress = z.string().regex(/^0x[a-fA-F0-9]+$/u);
		coverage = (item) => z.object({
			items: z.array(item),
			total: z.number().int().min(0).nullable(),
			exhaustive: z.boolean(),
			limitations: z.array(z.string())
		});
		nativeCommandInvocationSchema = z.object({
			tool: z.string().min(1),
			command: z.array(z.string()),
			tool_version: z.string().nullable(),
			version_reason: z.string().nullable(),
			executable_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			exit: z.object({
				code: z.number().int().nullable(),
				signal: z.string().nullable()
			}),
			stdout_bytes: z.number().int().min(0),
			stderr_bytes: z.number().int().min(0)
		});
		architectureSchema = z.object({
			name: z.string(),
			cpu_type: z.string().nullable(),
			cpu_subtype: z.string().nullable(),
			file_offset: z.number().int().min(0).nullable().describe("Offset from the start of the input Mach-O container."),
			size: z.number().int().min(0).nullable(),
			alignment: z.number().int().min(0).nullable()
		});
		permissionSchema = z.object({
			read: z.boolean().nullable(),
			write: z.boolean().nullable(),
			execute: z.boolean().nullable(),
			raw: z.string().nullable()
		});
		sectionSchema = z.object({
			segment: z.string(),
			name: z.string(),
			address: hexAddress.nullable(),
			size: z.number().int().min(0).nullable(),
			file_offset: z.number().int().min(0).nullable().describe("Offset from the start of the selected Mach-O slice."),
			alignment: z.number().int().min(0).nullable(),
			flags: z.array(z.string())
		});
		segmentSchema = z.object({
			name: z.string(),
			vm_address: hexAddress.nullable(),
			vm_size: z.number().int().min(0).nullable(),
			file_offset: z.number().int().min(0).nullable().describe("Offset from the start of the selected Mach-O slice."),
			file_size: z.number().int().min(0).nullable(),
			maximum_permissions: permissionSchema,
			initial_permissions: permissionSchema,
			sections: coverage(sectionSchema)
		});
		symbolSchema = z.object({
			name: z.string(),
			address: hexAddress.nullable(),
			weak: z.boolean().nullable(),
			reexport: z.boolean().nullable(),
			source: z.string().nullable()
		});
		dependencySchema$1 = z.object({
			path: z.string(),
			kind: z.string(),
			current_version: z.string().nullable(),
			compatibility_version: z.string().nullable()
		});
		loadCommandSchema = z.object({
			index: z.number().int().min(0),
			kind: z.string(),
			fields: z.record(z.string(), z.union([
				z.string(),
				z.number(),
				z.null()
			]))
		});
		buildMetadataSchema = z.object({
			platform: z.string().nullable(),
			minimum_os: z.string().nullable(),
			sdk: z.string().nullable(),
			tools: z.array(z.object({
				name: z.string(),
				version: z.string()
			}))
		});
		inspectMachoSchema = z.object({
			format: z.literal("mach-o"),
			/** Exact lipo slice selected for inspection and its offset in the input container. */
			selected_architecture: z.object({
				name: z.string().nullable().describe("Exact architecture name selected from lipo output; null when selection is unknown."),
				container_file_offset: z.number().int().min(0).nullable().describe("Offset of the selected slice from the start of the input Mach-O container; null when unknown.")
			}),
			endian: z.enum(["little", "big"]).nullable(),
			word_size: z.union([z.literal(32), z.literal(64)]).nullable(),
			file_type: z.string().nullable(),
			flags: z.array(z.string()),
			uuid: z.string().nullable(),
			entrypoints: coverage(z.object({ file_offset: z.number().int().min(0).describe("LC_MAIN entry offset from the start of the selected Mach-O slice.") })),
			architectures: coverage(architectureSchema),
			build_metadata: coverage(buildMetadataSchema),
			load_commands: coverage(loadCommandSchema),
			dependencies: coverage(dependencySchema$1),
			imports: coverage(symbolSchema),
			exports: coverage(symbolSchema),
			segments: coverage(segmentSchema),
			provenance: z.array(nativeCommandInvocationSchema),
			limitations: z.array(z.string())
		});
		inspectSignatureSchema = z.object({
			signed: z.boolean(),
			identifier: z.string().nullable(),
			team_identifier: z.string().nullable(),
			format: z.string().nullable(),
			cdhashes: z.array(z.string()),
			hash_algorithms: z.array(z.string()),
			authorities: z.array(z.string()),
			designated_requirement: z.string().nullable(),
			entitlements: jsonValueSchema.nullable(),
			timestamp: z.string().nullable(),
			hardened_runtime: z.boolean().nullable(),
			provenance: z.array(nativeCommandInvocationSchema),
			limitations: z.array(z.string())
		});
		inspectPlistSchema = z.object({
			format: z.enum([
				"xml",
				"binary",
				"json",
				"unknown"
			]),
			value: jsonValueSchema,
			bundle: z.object({
				identifier: z.string().nullable(),
				executable: z.string().nullable(),
				name: z.string().nullable(),
				version: z.string().nullable(),
				short_version: z.string().nullable()
			}),
			source_path: z.string(),
			provenance: z.array(nativeCommandInvocationSchema),
			limitations: z.array(z.string())
		});
		listArchitecturesSchema = z.object({
			architectures: coverage(architectureSchema),
			provenance: z.array(nativeCommandInvocationSchema),
			limitations: z.array(z.string())
		});
		demangleSwiftSchema = z.object({
			symbols: z.array(z.object({
				input: z.string(),
				output: z.string(),
				status: z.enum([
					"demangled",
					"unchanged",
					"invalid"
				])
			})),
			provenance: z.array(nativeCommandInvocationSchema),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/analysisView/machoView.js
var MACHO_COLLECTIONS, machoViewRequestSchema, shape, exactRows, machoViewItemSchema, machoViewContextSchema, collectionCountSchema, machoSummarySchema, parseMachoReport, summarizeMacho, projectMachoView;
function init_machoView() {
	return (init_machoView = __esmMin((() => {
		init_analysisViewErrors();
		init_canonicalOrdering();
		init_binaryTargetTypes();
		init_nativeInspection();
		init_result();
		init_analysisViewParent();
		init_analysisViewCoverage();
		MACHO_COLLECTIONS = [
			"entrypoints",
			"architectures",
			"build_metadata",
			"load_commands",
			"dependencies",
			"imports",
			"exports",
			"segments"
		];
		machoViewRequestSchema = z.strictObject({
			kind: z.literal("macho"),
			facet: z.enum([...MACHO_COLLECTIONS, "provenance"]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		({shape} = inspectMachoSchema);
		exactRows = (rows) => z.array(z.strictObject(rows.element.shape));
		machoViewItemSchema = z.union([
			exactRows(shape.entrypoints.shape.items),
			exactRows(shape.architectures.shape.items),
			exactRows(shape.build_metadata.shape.items),
			exactRows(shape.load_commands.shape.items),
			exactRows(shape.dependencies.shape.items),
			exactRows(shape.imports.shape.items),
			exactRows(shape.segments.shape.items),
			exactRows(shape.provenance)
		]);
		machoViewContextSchema = z.strictObject({
			source_total: z.number().int().nonnegative().nullable(),
			source_exhaustive: z.boolean()
		});
		collectionCountSchema = z.strictObject({
			returned: z.number().int().nonnegative(),
			total: z.number().int().nonnegative().nullable(),
			exhaustive: z.boolean()
		});
		machoSummarySchema = z.strictObject({
			format: shape.format,
			selected_architecture: shape.selected_architecture,
			endian: shape.endian,
			word_size: shape.word_size,
			file_type: shape.file_type,
			flags: shape.flags,
			uuid: shape.uuid,
			collections: z.strictObject(Object.fromEntries(MACHO_COLLECTIONS.map((name) => [name, collectionCountSchema]))),
			provenance_count: z.number().int().nonnegative(),
			limitation_count: z.number().int().nonnegative()
		});
		parseMachoReport = (parent) => {
			const parsed = parseAnalysisViewResult(inspectMachoSchema, parent);
			if (!parsed.ok) return parsed;
			if (parent.subject != null && !isMachOFormat(parent.subject.format)) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "Mach-O parent Evidence subject must identify a thin or universal Mach-O."
			}]));
			return ok(parsed.value);
		};
		summarizeMacho = (report, parentLimitations) => {
			const limitations = uniqueSorted([
				...parentLimitations,
				...report.limitations,
				...MACHO_COLLECTIONS.flatMap((name) => report[name].limitations)
			]);
			const collections = Object.fromEntries(MACHO_COLLECTIONS.map((name) => [name, {
				returned: report[name].items.length,
				total: report[name].total,
				exhaustive: report[name].exhaustive
			}]));
			return {
				limitations,
				returned: MACHO_COLLECTIONS.reduce((sum, name) => sum + report[name].items.length, 0),
				summary: {
					format: report.format,
					selected_architecture: report.selected_architecture,
					endian: report.endian,
					word_size: report.word_size,
					file_type: report.file_type,
					flags: report.flags,
					uuid: report.uuid,
					collections,
					provenance_count: report.provenance.length,
					limitation_count: limitations.length
				}
			};
		};
		projectMachoView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "macho") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Mach-O inspection supports summary and macho views."
			}]));
			const parsed = parseMachoReport(parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const incomplete = MACHO_COLLECTIONS.filter((name) => !report[name].exhaustive);
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_macho",
				parent_digest: parent.evidenceId.slice(3),
				artifact: parent.subject == null ? {
					path: "",
					sha256: null
				} : {
					path: parent.subject.local_path,
					sha256: parent.subject.digest.sha256
				},
				unknowns: [...incomplete.length === 0 ? [] : [`Native tools did not report exhaustive ${incomplete.join(", ")}; page exhaustion does not establish absence of unreturned rows.`], ...parent.subject == null ? ["The parent has no recorded subject, so the inspected artifact path and SHA-256 are unknown."] : []]
			};
			if (view.kind === "summary") {
				const { summary, limitations, returned } = summarizeMacho(report, parent.limitations);
				return ok({
					kind: "summary",
					view,
					...shared,
					limitations,
					summary,
					coverage: completeWithinViewCoverage(returned, returned)
				});
			}
			const source = view.facet === "provenance" ? {
				items: report.provenance,
				total: report.provenance.length,
				exhaustive: true,
				limitations: []
			} : report[view.facet];
			const item = source.items.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "macho",
				view,
				item,
				...shared,
				limitations: uniqueSorted([
					...parent.limitations,
					...report.limitations,
					...source.limitations
				]),
				source_total: source.total,
				source_exhaustive: source.exhaustive,
				coverage: pageViewCoverage(view.offset, item.length, source.items.length)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/interfaceBuilderView.js
var page, interfaceBuilderViewRequestSchema, interfaceBuilderViewItemsSchema, interfaceBuilderViewContextSchema, countsSchema, interfaceBuilderSummarySchema, tally, parseInterfaceBuilderReport, summarizeInterfaceBuilder, projectInterfaceBuilderView;
function init_interfaceBuilderView() {
	return (init_interfaceBuilderView = __esmMin((() => {
		init_analysisViewErrors();
		init_canonicalOrdering();
		init_interfaceBuilderGraph();
		init_nativeInvestigationGraph();
		init_result();
		init_analysisViewParent();
		init_analysisViewCoverage();
		page = {
			kind: z.literal("interface-builder"),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		};
		interfaceBuilderViewRequestSchema = z.discriminatedUnion("collection", [z.strictObject({
			...page,
			collection: z.enum(["nodes", "edges"]),
			document: z.string().min(1).optional().describe("Exact documents[].relative_path; selects rows whose evidence names that archive.")
		}), z.strictObject({
			...page,
			collection: z.enum(["documents", "coverage"])
		})]);
		interfaceBuilderViewItemsSchema = z.union([
			z.array(interfaceBuilderDocumentSchema),
			z.array(nativeInvestigationNodeSchema),
			z.array(nativeInvestigationEdgeSchema),
			z.array(nativeInvestigationCoverageSchema)
		]);
		interfaceBuilderViewContextSchema = z.strictObject({ source_truncated: z.boolean() });
		countsSchema = z.record(z.string(), z.number().int().positive());
		interfaceBuilderSummarySchema = z.strictObject({
			target_sha256: interfaceBuilderAnalysisSchema.shape.target_sha256,
			provider: interfaceBuilderAnalysisSchema.shape.graph.shape.provider,
			documents: interfaceBuilderAnalysisSchema.shape.documents,
			available_counts: z.strictObject({
				nodes: z.number().int().nonnegative(),
				edges: z.number().int().nonnegative(),
				coverage: z.number().int().nonnegative()
			}),
			node_kinds: countsSchema,
			edge_relations: countsSchema,
			coverage_statuses: countsSchema,
			truncated: z.boolean(),
			limitation_count: z.number().int().nonnegative()
		});
		tally = (values) => {
			const counts = new Map();
			for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
			return Object.fromEntries([...counts].sort(([left], [right]) => left < right ? -1 : 1));
		};
		parseInterfaceBuilderReport = (parent) => {
			const parsed = parseAnalysisViewResult(interfaceBuilderAnalysisSchema, parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			if (report.graph.target_sha256 !== report.target_sha256 || parent.subject != null && parent.subject.digest.sha256 !== report.target_sha256) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "Interface Builder parent Evidence subject and graph must identify the report's target SHA-256."
			}]));
			return ok(report);
		};
		summarizeInterfaceBuilder = (report, limitationCount) => {
			const { graph } = report;
			const total = report.documents.length + graph.nodes.length + graph.edges.length + graph.coverage.length;
			return {
				summary: {
					target_sha256: report.target_sha256,
					provider: graph.provider,
					documents: report.documents,
					available_counts: {
						nodes: graph.nodes.length,
						edges: graph.edges.length,
						coverage: graph.coverage.length
					},
					node_kinds: tally(graph.nodes.map((node) => node.kind)),
					edge_relations: tally(graph.edges.map((edge) => edge.relation)),
					coverage_statuses: tally(graph.coverage.map((row) => row.status)),
					truncated: graph.truncated,
					limitation_count: limitationCount
				},
				coverage: completeWithinViewCoverage(total, total)
			};
		};
		projectInterfaceBuilderView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "interface-builder") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Interface Builder decoding supports summary and interface-builder views."
			}]));
			const parsed = parseInterfaceBuilderReport(parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const { graph } = report;
			const limitations = uniqueSorted([...parent.limitations, ...report.limitations]);
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "decode_interface_builder",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: parent.subject?.local_path ?? "",
					sha256: report.target_sha256
				},
				limitations,
				unknowns: ["Rows describe recognized archive objects and connections only; unrecognized classes, fields and runtime-created UI remain unknown.", ...graph.truncated ? ["The decoded graph is incomplete (see coverage and limitations for the cause); page exhaustion does not establish absence of undecoded objects or connections."] : []]
			};
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				...summarizeInterfaceBuilder(report, limitations.length)
			});
			const document = view.collection === "nodes" || view.collection === "edges" ? view.document : undefined;
			if (document !== undefined && !report.documents.some((row) => row.relative_path === document)) return err(analysisViewInputError([{
				path: ["view", "document"],
				reason: "invalid_value",
				message: "Select an exact documents[].relative_path from this decoded report."
			}]));
			const inDocument = (candidates) => document === undefined ? candidates : candidates.filter((row) => row.evidence.some((evidence) => evidence.artifact_path === document));
			const rows = view.collection === "documents" ? report.documents : view.collection === "coverage" ? graph.coverage : view.collection === "nodes" ? inDocument(graph.nodes) : inDocument(graph.edges);
			const items = rows.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "interface-builder",
				view,
				items,
				...shared,
				source_truncated: graph.truncated,
				coverage: pageViewCoverage(view.offset, items.length, rows.length)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/qlogCaptureView.js
var traceSchema, streamSchema, qlogViewContextSchema, qlogSummarySchema, pageRequestShape, traceSelectorShape, streamSelectorShape, qlogViewRequestSchema, traceSummarySchema, streamSummarySchema, qlogViewPageSchema, summarizeQlogCapture, summarizeTrace, summarizeStream, projectQlogCapturePage;
function init_qlogCaptureView() {
	return (init_qlogCaptureView = __esmMin((() => {
		init_qlogCapture();
		init_result();
		init_analysisViewErrors();
		init_analysisViewCoverage();
		traceSchema = qlogCaptureFactsSchema.shape.traces.element;
		streamSchema = traceSchema.shape.streams.element;
		qlogViewContextSchema = qlogCaptureFactsSchema.omit({ traces: true });
		qlogSummarySchema = qlogViewContextSchema.extend({
			trace_count: z.number().int().nonnegative(),
			retained_stream_count: z.number().int().nonnegative(),
			loss_declaration_count: z.number().int().nonnegative(),
			incomplete_fact_record_count: z.number().int().nonnegative()
		});
		pageRequestShape = {
			kind: z.literal("qlog"),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		};
		traceSelectorShape = { trace_index: z.number().int().nonnegative() };
		streamSelectorShape = {
			...traceSelectorShape,
			stream_id: streamSchema.shape.stream_id,
			direction: streamSchema.shape.direction
		};
		qlogViewRequestSchema = z.discriminatedUnion("facet", [
			z.strictObject({
				...pageRequestShape,
				facet: z.literal("traces")
			}),
			z.strictObject({
				...pageRequestShape,
				...traceSelectorShape,
				facet: z.literal("streams")
			}),
			z.strictObject({
				...pageRequestShape,
				...traceSelectorShape,
				facet: z.literal("loss-declarations")
			}),
			z.strictObject({
				...pageRequestShape,
				...traceSelectorShape,
				facet: z.literal("incomplete-records")
			}),
			z.strictObject({
				...pageRequestShape,
				...streamSelectorShape,
				facet: z.literal("contributions")
			}),
			z.strictObject({
				...pageRequestShape,
				...streamSelectorShape,
				facet: z.literal("ranges")
			}),
			z.strictObject({
				...pageRequestShape,
				...streamSelectorShape,
				facet: z.literal("final-sizes")
			})
		]);
		traceSummarySchema = traceSchema.omit({
			streams: true,
			loss_declarations: true,
			incomplete_fact_records: true
		}).extend({
			stream_count: z.number().int().nonnegative(),
			loss_declaration_count: z.number().int().nonnegative(),
			incomplete_fact_record_count: z.number().int().nonnegative()
		});
		streamSummarySchema = streamSchema.omit({
			contributions: true,
			covered_ranges: true,
			reported_final_sizes: true
		}).extend({
			contribution_count: z.number().int().nonnegative(),
			covered_range_count: z.number().int().nonnegative(),
			reported_final_size_count: z.number().int().nonnegative()
		});
		qlogViewPageSchema = z.discriminatedUnion("facet", [
			z.strictObject({
				facet: z.literal("traces"),
				items: z.array(traceSummarySchema)
			}),
			z.strictObject({
				facet: z.literal("streams"),
				items: z.array(streamSummarySchema)
			}),
			z.strictObject({
				facet: z.literal("loss-declarations"),
				items: traceSchema.shape.loss_declarations
			}),
			z.strictObject({
				facet: z.literal("incomplete-records"),
				items: traceSchema.shape.incomplete_fact_records
			}),
			z.strictObject({
				facet: z.literal("contributions"),
				items: streamSchema.shape.contributions
			}),
			z.strictObject({
				facet: z.literal("ranges"),
				items: streamSchema.shape.covered_ranges
			}),
			z.strictObject({
				facet: z.literal("final-sizes"),
				items: streamSchema.shape.reported_final_sizes
			})
		]);
		summarizeQlogCapture = (qlog) => {
			const { traces, ...context } = qlog;
			return {
				...context,
				trace_count: traces.length,
				retained_stream_count: traces.reduce((sum, trace) => sum + trace.streams.length, 0),
				loss_declaration_count: traces.reduce((sum, trace) => sum + trace.loss_declarations.length, 0),
				incomplete_fact_record_count: traces.reduce((sum, trace) => sum + trace.incomplete_fact_records.length, 0)
			};
		};
		summarizeTrace = ({ streams, loss_declarations, incomplete_fact_records, ...trace }) => ({
			...trace,
			stream_count: streams.length,
			loss_declaration_count: loss_declarations.length,
			incomplete_fact_record_count: incomplete_fact_records.length
		});
		summarizeStream = ({ contributions, covered_ranges, reported_final_sizes, ...stream }) => ({
			...stream,
			contribution_count: contributions.length,
			covered_range_count: covered_ranges.length,
			reported_final_size_count: reported_final_sizes.length
		});
		projectQlogCapturePage = (qlog, view) => {
			const invalid = (field, message) => err(analysisViewInputError([{
				path: ["view", field],
				reason: "invalid_value",
				message
			}]));
			const slice = (items) => items.slice(view.offset, view.offset + view.limit);
			let page;
			let total;
			if (view.facet === "traces") {
				total = qlog.traces.length;
				page = {
					facet: "traces",
					items: slice(qlog.traces).map(summarizeTrace)
				};
			} else {
				const matches = qlog.traces.filter((trace) => trace.trace_index === view.trace_index);
				if (matches.length !== 1) return invalid("trace_index", "Select one unambiguous retained trace index.");
				const trace = matches[0];
				if (view.facet === "streams") {
					total = trace.streams.length;
					page = {
						facet: "streams",
						items: slice(trace.streams).map(summarizeStream)
					};
				} else if (view.facet === "loss-declarations") {
					total = trace.loss_declarations.length;
					page = {
						facet: view.facet,
						items: slice(trace.loss_declarations)
					};
				} else if (view.facet === "incomplete-records") {
					total = trace.incomplete_fact_records.length;
					page = {
						facet: view.facet,
						items: slice(trace.incomplete_fact_records)
					};
				} else {
					const matches = trace.streams.filter((stream) => stream.stream_id === view.stream_id && stream.direction === view.direction);
					if (matches.length !== 1) return invalid("stream_id", "Select one unambiguous retained stream ID and direction within the trace.");
					const stream = matches[0];
					if (view.facet === "contributions") {
						total = stream.contributions.length;
						page = {
							facet: view.facet,
							items: slice(stream.contributions)
						};
					} else if (view.facet === "ranges") {
						total = stream.covered_ranges.length;
						page = {
							facet: view.facet,
							items: slice(stream.covered_ranges)
						};
					} else {
						total = stream.reported_final_sizes.length;
						page = {
							facet: view.facet,
							items: slice(stream.reported_final_sizes)
						};
					}
				}
			}
			const { traces: _traces, ...context } = qlog;
			return ok({
				context,
				page,
				coverage: pageViewCoverage(view.offset, page.items.length, total)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/webNetworkCaptureView.js
var captureViewRequestSchema, previewSchema, captureViewItemsSchema, captureSummarySchema, object, HEADLINE_FIELDS, MITMPROXY_HEADLINE_FIELDS, MITMPROXY_PATH_MAX_LENGTH, integerIn, hasControl, LONE_SURROGATE, hostLike, MITMPROXY_INTEGER_FIELDS, describesText, representationMatches, headlineShape, ancestorsOf, addAncestors, groupByPointer, indexFacets, usableScalar, textualFlowType, mitmproxyHeadline, selectHeadlines, preview, parseCaptureParent, projectWebNetworkCaptureView;
function init_webNetworkCaptureView() {
	return (init_webNetworkCaptureView = __esmMin((() => {
		init_analysisViewErrors();
		init_inputIssueProjection();
		init_result();
		init_webNetworkCapture();
		init_analysisViewCoverage();
		init_qlogCaptureView();
		captureViewRequestSchema = z.strictObject({
			kind: z.literal("capture"),
			detail: z.enum(["preview", "complete"]).default("preview"),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		previewSchema = webNetworkCaptureRecordSchema.extend({ binary_fields: z.array(webNetworkCaptureBinaryDescriptorSchema) });
		captureViewItemsSchema = z.array(z.union([webNetworkCaptureRecordSchema, previewSchema]));
		captureSummarySchema = z.strictObject({
			artifact: webNetworkCaptureArtifactSchema,
			decoder: webNetworkCaptureDecoderSchema,
			format: z.enum(WEB_NETWORK_CAPTURE_FORMATS),
			total_records: z.number().int().nonnegative(),
			retained_records: z.number().int().nonnegative(),
			runtime_attribution: z.literal("unknown"),
			qlog: qlogSummarySchema.optional()
		});
		object = (value) => value !== null && typeof value === "object" && !Array.isArray(value) ? value : null;
		HEADLINE_FIELDS = [
			"method",
			"url",
			"httpVersion",
			"http_version",
			"status",
			"statusText",
			"reason"
		];
		MITMPROXY_HEADLINE_FIELDS = {
			request: [
				"scheme",
				"host",
				"port",
				"authority",
				"path"
			],
			response: ["status_code"]
		};
		MITMPROXY_PATH_MAX_LENGTH = 2 * 1024;
		integerIn = (value, min, max) => typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
		hasControl = (value, includeSpace) => {
			for (let index = 0; index < value.length; index += 1) {
				const code = value.charCodeAt(index);
				if (code < 32 || code === 127 || includeSpace && code === 32) return true;
			}
			return false;
		};
		LONE_SURROGATE = /\p{Cs}/u;
		hostLike = (value, maxLength) => typeof value === "string" && value.length <= maxLength && !hasControl(value, true) && !/[@/\\]/u.test(value) && !LONE_SURROGATE.test(value);
		MITMPROXY_INTEGER_FIELDS = new Set(["port", "status_code"]);
		describesText = (descriptor, text) => {
			if (descriptor.representation !== "producer-bytes" || descriptor.state !== "retained") return false;
			const utf8 = Buffer.from(text, "utf8");
			return utf8.toString("utf8") === text && descriptor.bytes === utf8.length && descriptor.content_base64 === utf8.toString("base64") && descriptor.sha256 === createHash("sha256").update(utf8).digest("hex");
		};
		representationMatches = (field, value, sidecars, bytes) => {
			if (MITMPROXY_INTEGER_FIELDS.has(field)) return bytes.length === 0 && typeof value === "number" && sidecars.length === 1 && sidecars[0]?.producer_type === "integer" && sidecars[0].literal === String(value);
			if (sidecars.length !== 0 || bytes.length > 1) return false;
			const [descriptor] = bytes;
			return descriptor === undefined || typeof value === "string" && describesText(descriptor, value);
		};
		headlineShape = (field, value) => {
			switch (field) {
				case "scheme": return typeof value === "string" && /^[A-Za-z][A-Za-z0-9+.-]{0,31}$/u.test(value);
				case "host": return hostLike(value, 255);
				case "authority": return hostLike(value, 262);
				case "port": return integerIn(value, 0, 65535);
				case "status_code": return integerIn(value, 100, 999);
				case "path": return typeof value === "string" && value.length <= MITMPROXY_PATH_MAX_LENGTH && !hasControl(value, false) && !value.includes("@") && !LONE_SURROGATE.test(value) && (value === "*" || value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\"));
				default: return false;
			}
		};
		ancestorsOf = (pointer) => {
			const ancestors = [];
			for (let at = pointer.indexOf("/"); at !== -1; at = pointer.indexOf("/", at + 1)) ancestors.push(pointer.slice(0, at));
			return ancestors;
		};
		addAncestors = (pointer, into) => {
			for (let at = pointer.lastIndexOf("/"); at !== -1; at = at === 0 ? -1 : pointer.lastIndexOf("/", at - 1)) {
				const ancestor = pointer.slice(0, at);
				if (into.has(ancestor)) return;
				into.add(ancestor);
			}
		};
		groupByPointer = (facets) => {
			const groups = new Map();
			for (const facet of facets) {
				const group = groups.get(facet.pointer);
				if (group === undefined) groups.set(facet.pointer, [facet]);
				else group.push(facet);
			}
			return groups;
		};
		indexFacets = (record) => {
			const containers = new Set();
			const withheld = new Set();
			const omittedNames = new Set();
			for (const { pointer } of record.numeric_literals) addAncestors(pointer, containers);
			for (const { pointer, state } of record.binary_fields) {
				addAncestors(pointer, containers);
				if (state === "redacted") withheld.add(pointer);
			}
			for (const redaction of record.redactions) {
				addAncestors(redaction.pointer, containers);
				("scope" in redaction ? omittedNames : withheld).add(redaction.pointer);
			}
			const sidecars = groupByPointer(record.numeric_literals);
			const bytes = groupByPointer(record.binary_fields);
			return {
				sidecars,
				bytes,
				scalars: new Set([...sidecars.keys(), ...bytes.keys()]),
				containers,
				withheld,
				omittedNames
			};
		};
		usableScalar = (index, pointer) => {
			const ancestors = ancestorsOf(pointer);
			return !index.omittedNames.has(pointer) && !index.containers.has(pointer) && !index.withheld.has(pointer) && !ancestors.some((ancestor) => index.withheld.has(ancestor) || index.scalars.has(ancestor));
		};
		textualFlowType = (index) => usableScalar(index, "/type") && !index.scalars.has("/type");
		mitmproxyHeadline = (index, pointer, field, value) => usableScalar(index, pointer) && headlineShape(field, value) && representationMatches(field, value, index.sidecars.get(pointer) ?? [], index.bytes.get(pointer) ?? []);
		selectHeadlines = (fields, key, facets, selectedPointers) => {
			const selected = {};
			const candidates = [...HEADLINE_FIELDS.map((field) => [field, null]), ...(facets === null ? [] : MITMPROXY_HEADLINE_FIELDS[key] ?? []).map((field) => [field, facets])];
			for (const [field, index] of candidates) {
				const value = fields[field];
				if (!Object.hasOwn(fields, field) || value === undefined || index !== null && !mitmproxyHeadline(index, `/${key}/${field}`, field, value)) continue;
				selected[field] = value;
				selectedPointers.add(`/${key}/${field}`);
			}
			return selected;
		};
		preview = (record, format) => {
			const source = object(record.reported);
			const reported = {};
			const selectedPointers = new Set();
			if (source !== null) {
				const index = format === "mitmproxy" && source.type === "http" ? indexFacets(record) : null;
				const mitmproxyFacets = index !== null && textualFlowType(index) ? index : null;
				for (const key of [
					"session_id",
					"name",
					"time",
					"startedDateTime",
					"type"
				]) if (Object.hasOwn(source, key) && source[key] !== undefined) {
					reported[key] = source[key];
					selectedPointers.add(`/${key}`);
				}
				for (const key of ["request", "response"]) {
					const value = source[key];
					if (!Object.hasOwn(source, key) || value === undefined) continue;
					const fields = object(value);
					if (fields === null) {
						reported[key] = value;
						continue;
					}
					reported[key] = selectHeadlines(fields, key, mitmproxyFacets, selectedPointers);
				}
			}
			return {
				...record,
				reported: source === null ? record.reported : reported,
				binary_fields: record.binary_fields.map(({ content_base64: _content, ...field }) => field),
				numeric_literals: source === null ? record.numeric_literals : record.numeric_literals.filter(({ pointer }) => selectedPointers.has(pointer))
			};
		};
		parseCaptureParent = (parent) => {
			const parsed = webNetworkCaptureSchema.safeParse(parent.normalizedResult);
			if (!parsed.success) return err(analysisInputErrorFromIssues("inspect_analysis_view", parsed.error.issues.map((issue) => ({
				...issue,
				path: [
					"source",
					"normalized_result",
					...issue.path
				]
			})), { source: { normalized_result: parent.normalizedResult } }, { cause: parsed.error }));
			const report = parsed.data;
			if (report.artifact.sha256 !== null && (parent.subject == null || parent.subject.local_path !== report.artifact.path || parent.subject.digest.sha256 !== report.artifact.sha256)) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "Capture parent subject must identify the report's exact path and SHA-256."
			}]));
			return ok(report);
		};
		projectWebNetworkCaptureView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "capture" && view.kind !== "qlog") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Historical captures support summary, capture record pages, qlog fact pages and admitted api-surface views."
			}]));
			const parsed = parseCaptureParent(parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_web_network_capture",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: report.artifact.path,
					sha256: report.artifact.sha256
				},
				limitations: [...new Set([
					...parent.limitations,
					...report.limitations,
					"Capture record pages cover the records selected into the parent Evidence, in that selected order; total_records counts the original decoded capture."
				])],
				unknowns: ["Historical records do not establish live runtime attribution or deployment authenticity.", ...report.artifact.sha256 === null ? ["The explicitly excluded artifact digest remains unknown."] : []]
			};
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				summary: {
					artifact: report.artifact,
					decoder: report.decoder,
					format: report.format,
					total_records: report.total_records,
					retained_records: report.records.length,
					runtime_attribution: report.runtime_attribution,
					...report.format === "qlog" ? { qlog: summarizeQlogCapture(report.qlog) } : {}
				},
				coverage: completeWithinViewCoverage(report.records.length, report.records.length)
			});
			if (view.kind === "qlog") {
				if (report.format !== "qlog") return err(analysisViewInputError([{
					path: ["view", "kind"],
					reason: "invalid_value",
					message: "Qlog fact views require retained qlog Evidence."
				}]));
				const projected = projectQlogCapturePage(report.qlog, view);
				return projected.ok ? ok({
					kind: "qlog",
					view,
					...shared,
					...projected.value,
					limitations: [...shared.limitations, "Qlog fact pages retain all-recorded-events-before-selection scope. Exhausting a page does not establish network completeness, body recovery, retransmission or actual loss."]
				}) : projected;
			}
			const records = report.records.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "capture",
				view,
				...shared,
				items: captureViewItemsSchema.parse(view.detail === "complete" ? records : records.map((record) => preview(record, report.format))),
				coverage: pageViewCoverage(view.offset, records.length, report.records.length),
				limitations: [...shared.limitations, ...view.detail === "preview" ? ["Preview selects recorded headline fields and byte descriptors; headers, XML, bodies, message data and other fields remain in complete record pages. Missing preview fields do not establish their absence from the producer record."] : []]
			});
		};
	})))();
}

//#endregion
//#region dist/domain/pcap/pcapAnalysis.js
var pcapInputSchemas, pcapRequestSchema, client, endpoint, dnsQuery, protocolCount, pcapResultSchemas;
function init_pcapAnalysis() {
	return (init_pcapAnalysis = __esmMin((() => {
		init_localPath();
		init_digests();
		pcapInputSchemas = {
			inspect_pcap_client: z.strictObject({}),
			inspect_pcap_capture: z.strictObject({ path: localPathStringSchema.describe("Local pcap or pcapng capture file to inspect") })
		};
		pcapRequestSchema = z.discriminatedUnion("operation", [z.strictObject({
			operation: z.literal("inspect_pcap_client"),
			input: pcapInputSchemas.inspect_pcap_client
		}), z.strictObject({
			operation: z.literal("inspect_pcap_capture"),
			input: pcapInputSchemas.inspect_pcap_capture
		})]);
		client = z.strictObject({
			tshark_command: z.string().min(1),
			tshark_source: z.enum(["environment", "path"]),
			tshark_version: z.string().min(1).nullable(),
			capinfos_command: z.string().min(1),
			capinfos_source: z.enum(["environment", "path"]),
			capinfos_version: z.string().min(1).nullable()
		});
		endpoint = z.strictObject({
			address: z.string().min(1),
			port: z.number().int().positive().nullable(),
			packet_count: z.number().int().positive()
		});
		dnsQuery = z.strictObject({
			query: z.string().min(1),
			response_addresses: z.array(z.string().min(1)),
			response_address_count: z.number().int().nonnegative()
		});
		protocolCount = z.strictObject({
			protocol: z.string().min(1),
			packet_count: z.number().int().positive()
		});
		pcapResultSchemas = {
			inspect_pcap_client: z.strictObject({ client }),
			inspect_pcap_capture: z.strictObject({
				client,
				target: z.strictObject({
					path: localPathStringSchema,
					bytes: z.number().int().nonnegative(),
					sha256: digestSchema
				}),
				/** File format as capinfos reports it (pcap vs pcapng). */
				file_type: z.string().min(1).nullable(),
				encapsulation: z.string().min(1).nullable(),
				packet_count: z.number().int().nonnegative().nullable(),
				capture_start: z.string().nullable(),
				capture_end: z.string().nullable(),
				capture_duration_seconds: z.number().nonnegative().nullable(),
				snapshot_length: z.number().int().positive().nullable(),
				/** Distinct endpoints with packet counts, bounded. */
				endpoints: z.array(endpoint),
				endpoint_count: z.number().int().nonnegative(),
				/** DNS queries with resolved addresses, bounded. */
				dns_queries: z.array(dnsQuery),
				dns_query_count: z.number().int().nonnegative(),
				/** TLS Server Name Indication values observed in handshakes. */
				tls_sni_values: z.array(z.string().min(1)),
				tls_sni_count: z.number().int().nonnegative(),
				/** Protocol distribution (frame.protocols column counts). */
				protocol_distribution: z.array(protocolCount),
				protocol_count: z.number().int().nonnegative(),
				/** HTTP request URIs seen on plain-text ports, bounded. */
				http_request_uris: z.array(z.string().min(1)),
				http_request_uri_count: z.number().int().nonnegative(),
				http_uri_redaction_count: z.number().int().nonnegative(),
				unattributed_dns_addresses: z.array(z.string().min(1)),
				unattributed_dns_address_count: z.number().int().nonnegative(),
				unattributed_dns_packet_count: z.number().int().nonnegative(),
				coverage: z.enum(["complete", "partial"]),
				diagnostics: z.strictObject({
					capinfos_stderr: z.string(),
					tshark_stderr: z.string()
				}).optional()
			})
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/pcapCaptureView.js
var captureSchema, fields, pageShape, pcapViewRequestSchema, pcapViewPageSchema, pcapSummarySchema, parseParent, summarize$1, selectRows, projectPcapCaptureView;
function init_pcapCaptureView() {
	return (init_pcapCaptureView = __esmMin((() => {
		init_analysisViewErrors();
		init_pcapAnalysis();
		init_inputIssueProjection();
		init_result();
		init_analysisViewCoverage();
		init_analysisViewText();
		captureSchema = pcapResultSchemas.inspect_pcap_capture;
		fields = captureSchema.shape;
		pageShape = {
			kind: z.literal("pcap"),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		};
		pcapViewRequestSchema = z.discriminatedUnion("facet", [
			z.strictObject({
				...pageShape,
				facet: z.enum([
					"endpoints",
					"dns-queries",
					"tls-sni",
					"protocols",
					"http-uris",
					"unattributed-addresses"
				])
			}),
			z.strictObject({
				...pageShape,
				facet: z.literal("dns-addresses"),
				query: z.string().min(1)
			}),
			z.strictObject({
				...pageShape,
				facet: z.literal("diagnostics"),
				stream: z.enum(["tshark", "capinfos"])
			})
		]);
		pcapViewPageSchema = z.discriminatedUnion("facet", [
			z.strictObject({
				facet: z.literal("endpoints"),
				items: fields.endpoints
			}),
			z.strictObject({
				facet: z.literal("dns-queries"),
				items: z.array(fields.dns_queries.element.omit({ response_addresses: true }).extend({ retained_response_address_count: z.number().int().nonnegative() }))
			}),
			z.strictObject({
				facet: z.literal("tls-sni"),
				items: fields.tls_sni_values
			}),
			z.strictObject({
				facet: z.literal("protocols"),
				items: fields.protocol_distribution
			}),
			z.strictObject({
				facet: z.literal("http-uris"),
				items: fields.http_request_uris
			}),
			z.strictObject({
				facet: z.literal("unattributed-addresses"),
				items: fields.unattributed_dns_addresses
			}),
			z.strictObject({
				facet: z.literal("dns-addresses"),
				items: fields.unattributed_dns_addresses
			}),
			z.strictObject({
				facet: z.literal("diagnostics"),
				text: z.string(),
				status: z.enum(["retained", "unknown"])
			})
		]);
		pcapSummarySchema = captureSchema.omit({
			endpoints: true,
			dns_queries: true,
			tls_sni_values: true,
			protocol_distribution: true,
			http_request_uris: true,
			unattributed_dns_addresses: true,
			diagnostics: true
		}).extend({
			retained_counts: z.strictObject({
				endpoints: z.number().int().nonnegative(),
				dns_queries: z.number().int().nonnegative(),
				tls_sni_values: z.number().int().nonnegative(),
				protocol_distribution: z.number().int().nonnegative(),
				http_request_uris: z.number().int().nonnegative(),
				unattributed_dns_addresses: z.number().int().nonnegative()
			}),
			diagnostics_code_units: z.strictObject({
				tshark: z.number().int().nonnegative(),
				capinfos: z.number().int().nonnegative()
			}).nullable()
		});
		parseParent = (parent) => {
			const parsed = captureSchema.safeParse(parent.normalizedResult);
			if (!parsed.success) return err(analysisInputErrorFromIssues("inspect_analysis_view", parsed.error.issues, parent.normalizedResult, { cause: parsed.error }));
			if (parent.subject?.local_path !== parsed.data.target.path || parent.subject.digest.sha256 !== parsed.data.target.sha256) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "Packet parent subject must identify the report's exact path and SHA-256."
			}]));
			return ok(parsed.data);
		};
		summarize$1 = ({ endpoints, dns_queries, tls_sni_values, protocol_distribution, http_request_uris, unattributed_dns_addresses, diagnostics, ...metadata }) => ({
			...metadata,
			retained_counts: {
				endpoints: endpoints.length,
				dns_queries: dns_queries.length,
				tls_sni_values: tls_sni_values.length,
				protocol_distribution: protocol_distribution.length,
				http_request_uris: http_request_uris.length,
				unattributed_dns_addresses: unattributed_dns_addresses.length
			},
			diagnostics_code_units: diagnostics === undefined ? null : {
				tshark: diagnostics.tshark_stderr.length,
				capinfos: diagnostics.capinfos_stderr.length
			}
		});
		selectRows = (capture, view) => {
			const slice = (items) => items.slice(view.offset, view.offset + view.limit);
			switch (view.facet) {
				case "endpoints": return ok({
					page: {
						facet: view.facet,
						items: slice(capture.endpoints)
					},
					total: capture.endpoints.length
				});
				case "dns-queries": return ok({
					page: {
						facet: view.facet,
						items: slice(capture.dns_queries).map(({ response_addresses, ...query }) => ({
							...query,
							retained_response_address_count: response_addresses.length
						}))
					},
					total: capture.dns_queries.length
				});
				case "tls-sni": return ok({
					page: {
						facet: view.facet,
						items: slice(capture.tls_sni_values)
					},
					total: capture.tls_sni_values.length
				});
				case "protocols": return ok({
					page: {
						facet: view.facet,
						items: slice(capture.protocol_distribution)
					},
					total: capture.protocol_distribution.length
				});
				case "http-uris": return ok({
					page: {
						facet: view.facet,
						items: slice(capture.http_request_uris)
					},
					total: capture.http_request_uris.length
				});
				case "unattributed-addresses": return ok({
					page: {
						facet: view.facet,
						items: slice(capture.unattributed_dns_addresses)
					},
					total: capture.unattributed_dns_addresses.length
				});
				case "dns-addresses": {
					const matches = capture.dns_queries.filter((query) => query.query === view.query);
					if (matches.length !== 1) return err(analysisViewInputError([{
						path: ["view", "query"],
						reason: "invalid_value",
						message: "Select one unambiguous exact retained DNS question."
					}]));
					return ok({
						page: {
							facet: view.facet,
							items: slice(matches[0].response_addresses)
						},
						total: matches[0].response_addresses.length
					});
				}
			}
		};
		projectPcapCaptureView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "pcap") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Packet summary parents support summary and pcap fact pages."
			}]));
			const parsed = parseParent(parent);
			if (!parsed.ok) return parsed;
			const capture = parsed.value;
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_pcap_capture",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: capture.target.path,
					sha256: capture.target.sha256
				},
				limitations: [...parent.limitations, "Page totals count retained rows or UTF-16 diagnostic code units. Exhaustion does not prove whole-network completeness; source coverage and examined counts remain separate."],
				unknowns: ["Saved packet observations do not establish process identity, causality, encrypted payload contents or traffic missing from the recording."]
			};
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				summary: summarize$1(capture),
				coverage: completeWithinViewCoverage(1, 1)
			});
			if (view.facet === "diagnostics") {
				const value = view.stream === "tshark" ? capture.diagnostics?.tshark_stderr : capture.diagnostics?.capinfos_stderr;
				const text = analysisTextPage(value ?? "", view.offset, view.limit, "Diagnostics");
				if (!text.ok) return text;
				return ok({
					kind: "pcap",
					view,
					...shared,
					source_coverage: capture.coverage,
					page: {
						facet: "diagnostics",
						text: text.value.item.text,
						status: value === undefined ? "unknown" : "retained"
					},
					coverage: text.value.coverage,
					unknowns: value === undefined ? [...shared.unknowns, "The parent did not retain diagnostics; an empty text page does not establish their absence."] : shared.unknowns
				});
			}
			const selected = selectRows(capture, view);
			return selected.ok ? ok({
				kind: "pcap",
				view,
				...shared,
				source_coverage: capture.coverage,
				page: selected.value.page,
				coverage: pageViewCoverage(view.offset, selected.value.page.items.length, selected.value.total)
			}) : selected;
		};
	})))();
}

//#endregion
//#region dist/domain/android/androidAnalysis.js
var target, classTarget, androidInputSchemas, androidPackageInspectionInputSchema, androidRequestSchema, textCoverage, dexDescriptorSchema, method, engine, common, androidResultSchemas;
function init_androidAnalysis() {
	return (init_androidAnalysis = __esmMin((() => {
		init_localPath();
		target = { path: localPathStringSchema.describe("Local APK path; the target is never executed") };
		classTarget = {
			...target,
			class_name: z.string().min(1).describe("Exact fully qualified class name")
		};
		androidInputSchemas = {
			inspect_android_package: z.strictObject(target),
			search_android_classes: z.strictObject({
				...target,
				query: z.string().describe("Case-sensitive class-name substring; empty lists all classes")
			}),
			inspect_android_class: z.strictObject(classTarget),
			inspect_android_method: z.strictObject({
				...classTarget,
				method_name: z.string().min(1),
				overload_index: z.number().int().nonnegative().optional().describe("Explicit index among same-name methods; required when ambiguous")
			}),
			trace_android_references: z.strictObject({
				...classTarget,
				method_name: z.string().min(1).optional().describe("Omit for class references; select ambiguous methods with overload_index"),
				overload_index: z.number().int().nonnegative().optional().describe("Index among same-name methods from inspect_android_class; requires method_name")
			})
		};
		androidPackageInspectionInputSchema = androidInputSchemas.inspect_android_package.extend({ detail: z.enum(["complete", "summary"]).optional() });
		androidRequestSchema = z.discriminatedUnion("operation", [
			z.strictObject({
				operation: z.literal("inspect_android_package"),
				input: androidInputSchemas.inspect_android_package
			}),
			z.strictObject({
				operation: z.literal("search_android_classes"),
				input: androidInputSchemas.search_android_classes
			}),
			z.strictObject({
				operation: z.literal("inspect_android_class"),
				input: androidInputSchemas.inspect_android_class
			}),
			z.strictObject({
				operation: z.literal("inspect_android_method"),
				input: androidInputSchemas.inspect_android_method
			}),
			z.strictObject({
				operation: z.literal("trace_android_references"),
				input: androidInputSchemas.trace_android_references
			})
		]);
		textCoverage = z.strictObject({
			status: z.enum(["complete", "partial"]),
			text: z.string(),
			reported_total_bytes: z.number().int().nonnegative().nullable()
		});
		dexDescriptorSchema = z.string().regex(/^\((?:\[*(?:[ZBSCIJFD]|L[^;\x28\x29]+;))*\)(?:V|\[*(?:[ZBSCIJFD]|L[^;\x28\x29]+;))$/u);
		method = z.strictObject({
			name: z.string(),
			reported_signature: z.string(),
			overload_index: z.number().int().nonnegative(),
			is_constructor: z.boolean(),
			dex_descriptor: dexDescriptorSchema
		});
		engine = z.strictObject({
			name: z.string().min(1),
			version: z.string().nullable(),
			artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			source_revision: z.string().nullable(),
			worker_count: z.number().int().positive(),
			heap_limit_mib: z.number().int().positive().nullable()
		});
		common = { engine };
		androidResultSchemas = {
			inspect_android_package: z.strictObject({
				...common,
				package_name: z.string().nullable(),
				version_name: z.string().nullable(),
				version_code: z.string().nullable(),
				min_sdk: z.string().nullable(),
				target_sdk: z.string().nullable(),
				permissions: z.array(z.string()),
				manifest: textCoverage,
				class_count: z.number().int().nonnegative(),
				resource_count: z.number().int().nonnegative(),
				signature_verification: z.literal("not_performed")
			}),
			search_android_classes: z.strictObject({
				...common,
				query: z.string(),
				total_classes: z.number().int().nonnegative(),
				matches: z.array(z.string()),
				duplicate_names: z.array(z.strictObject({
					name: z.string(),
					occurrences: z.number().int().min(2)
				})),
				coverage: z.literal("complete")
			}),
			inspect_android_class: z.strictObject({
				...common,
				class_name: z.string(),
				methods: z.array(method),
				fields: z.array(z.strictObject({
					name: z.string(),
					reported_type: z.string()
				})),
				inner_classes: z.array(z.string())
			}),
			inspect_android_method: z.strictObject({
				...common,
				class_name: z.string(),
				method,
				overload_count: z.number().int().positive(),
				representation: z.enum(["java", "smali"]),
				body_status: z.enum(["available", "not_available"]),
				fell_back: z.boolean(),
				markers: z.array(z.string()),
				source: textCoverage
			}),
			trace_android_references: z.strictObject({
				...common,
				class_name: z.string(),
				method_name: z.string().nullable(),
				overload_index: z.number().int().nonnegative().nullable(),
				reported_signature: z.string().nullable(),
				dex_descriptor: dexDescriptorSchema.nullable(),
				total: z.number().int().nonnegative(),
				references: z.array(z.strictObject({
					kind: z.string(),
					name: z.string(),
					reported_full_name: z.string(),
					containing_class: z.string(),
					top_class: z.string(),
					source_line: z.null(),
					dex_offset: z.null(),
					/** false means transport-bounded instruction evidence; null is unknown. */
					direct_invokes_exhaustive: z.boolean().nullable(),
					/** Raw direct invoke instructions inside this using node, when available. */
					direct_invokes: z.array(z.strictObject({
						dex_entry: z.string().min(1),
						source_raw_method_id: z.string().min(1),
						dex_code_unit_offset: z.number().int().nonnegative(),
						dex_method_index: z.number().int().nonnegative(),
						opcode: z.string().regex(/^INVOKE_/u)
					})).nullable()
				})),
				coverage: z.literal("complete"),
				reference_unit: z.literal("using_node")
			})
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/androidPackageView.js
var packageSchema, androidPackageSummarySchema, androidViewRequestSchema, androidManifestViewItemSchema, projectAndroidPackageView;
function init_androidPackageView() {
	return (init_androidPackageView = __esmMin((() => {
		init_analysisViewErrors();
		init_androidAnalysis();
		init_result();
		init_analysisViewParent();
		init_analysisViewCoverage();
		init_analysisViewText();
		packageSchema = androidResultSchemas.inspect_android_package;
		androidPackageSummarySchema = packageSchema.extend({ manifest: packageSchema.shape.manifest.omit({ text: true }).extend({
			text_code_units: z.number().int().nonnegative(),
			text_included: z.literal(false)
		}) });
		androidViewRequestSchema = z.strictObject({
			kind: z.literal("android"),
			facet: z.literal("manifest"),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive()
		});
		androidManifestViewItemSchema = z.strictObject({
			text: z.string(),
			unit: z.literal("utf16-code-units"),
			source_status: packageSchema.shape.manifest.shape.status,
			reported_total_bytes: packageSchema.shape.manifest.shape.reported_total_bytes
		});
		projectAndroidPackageView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "android") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Android package Evidence supports summary and manifest views."
			}]));
			const parsed = parseAnalysisViewResult(packageSchema, parent);
			if (!parsed.ok) return parsed;
			if (parent.subject == null) return err(analysisViewInputError([{
				path: ["source", "subject"],
				reason: "invalid_value",
				message: "Android package views require the recorded APK subject identity."
			}]));
			const report = parsed.value;
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_android_package",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: parent.subject.local_path,
					sha256: parent.subject.digest.sha256
				},
				limitations: [...parent.limitations],
				unknowns: ["APK signatures were not verified; package declarations do not establish authenticity or runtime behavior.", ...report.manifest.status === "partial" ? ["The decoded manifest is partial; exhausting retained text does not establish complete manifest coverage."] : []]
			};
			if (view.kind === "summary") {
				const { text, ...manifest } = report.manifest;
				return ok({
					kind: "summary",
					view,
					...shared,
					summary: {
						...report,
						manifest: {
							...manifest,
							text_code_units: text.length,
							text_included: false
						}
					},
					coverage: completeWithinViewCoverage(1, 1)
				});
			}
			const page = analysisTextPage(report.manifest.text, view.offset, view.limit, "Manifest");
			if (!page.ok) return page;
			return ok({
				kind: "android",
				view,
				...shared,
				item: {
					...page.value.item,
					source_status: report.manifest.status,
					reported_total_bytes: report.manifest.reported_total_bytes
				},
				coverage: page.value.coverage
			});
		};
	})))();
}

//#endregion
//#region dist/domain/flutter/flutterBuildAnalysis.js
var flutterInputSchemas, dartAotInspectionInputSchema, flutterRequestSchema, flutterResultSchemas;
function init_flutterBuildAnalysis() {
	return (init_flutterBuildAnalysis = __esmMin((() => {
		init_localPath();
		init_digests();
		flutterInputSchemas = {
			identify_flutter_build: z.strictObject({ path: localPathStringSchema.describe("Local APK file to inspect") }),
			inspect_dart_aot: z.strictObject({
				path: localPathStringSchema.describe("Local APK file carrying a Flutter AOT payload"),
				abi: z.string().min(2).max(16).regex(/^[a-z0-9_\x2d]+$/u, "ABI name as it appears under lib/, e.g. arm64-v8a").optional().describe("ABI to inspect; defaults to arm64-v8a, x86_64, x86, armeabi-v7a, then remaining ABIs alphabetically")
			})
		};
		dartAotInspectionInputSchema = flutterInputSchemas.inspect_dart_aot.extend({ detail: z.enum(["complete", "summary"]).optional() });
		flutterRequestSchema = z.discriminatedUnion("operation", [z.strictObject({
			operation: z.literal("identify_flutter_build"),
			input: flutterInputSchemas.identify_flutter_build
		}), z.strictObject({
			operation: z.literal("inspect_dart_aot"),
			input: flutterInputSchemas.inspect_dart_aot
		})]);
		flutterResultSchemas = {
			identify_flutter_build: z.strictObject({
				target: z.strictObject({
					path: localPathStringSchema,
					bytes: z.number().int().nonnegative(),
					sha256: digestSchema
				}),
				flutter_detected: z.boolean(),
				abis: z.array(z.strictObject({
					abi: z.string().min(1),
					libapp: z.strictObject({
						present: z.boolean(),
						bytes: z.number().int().nonnegative().nullable(),
						sha256: digestSchema.nullable(),
						/** Supported ELF header with table extents inside the library; table contents are not validated. */
						elf_header_valid: z.boolean().nullable(),
						/** Number of Dart snapshot sections found (vm + isolate). */
						snapshot_hash_sources: z.number().int().nonnegative(),
						/** Distinct hashes found; more than one means the sections disagree. */
						snapshot_hash_candidates: z.array(z.string().regex(/^[0-9a-f]{32}$/u)),
						/** The single hash when every snapshot section agrees. */
						snapshot_hash: z.string().regex(/^[0-9a-f]{32}$/u).nullable()
					}),
					libflutter: z.strictObject({
						present: z.boolean(),
						bytes: z.number().int().nonnegative().nullable(),
						sha256: digestSchema.nullable(),
						build_id: z.string().regex(/^[0-9a-f]{8,128}$/u).nullable().describe("The single GNU build ID when ELF note coverage is complete and unambiguous"),
						build_id_candidates: z.array(z.string().regex(/^[0-9a-f]{8,128}$/u)).max(64).describe("Distinct GNU build IDs observed in ELF-owned note ranges; conflicting IDs remain explicit"),
						dart_version: z.string().nullable().describe("Labeled 'Dart VM version' string, when a build carries one"),
						toolchain_lines: z.array(z.string().min(1)),
						/** Dart labels omitted by grammar or single-version projection bounds. */
						dart_version_capped: z.boolean(),
						/** Toolchain labels omitted by grammar or projection bounds. */
						toolchain_capped: z.boolean()
					})
				})),
				coverage: z.enum(["complete", "partial"])
			}),
			inspect_dart_aot: z.strictObject({
				target: z.strictObject({
					path: localPathStringSchema,
					bytes: z.number().int().nonnegative(),
					sha256: digestSchema
				}),
				abi: z.string().min(1),
				libapp: z.strictObject({
					coverage: z.enum(["complete", "partial"]).describe("Coverage of ELF symbols, independent data headers, AOT kind, extents and agreeing hashes"),
					bytes: z.number().int().nonnegative(),
					sha256: digestSchema,
					snapshot_hash: z.string().regex(/^[0-9a-f]{32}$/u).nullable(),
					/** Distinct hashes found; more than one means the sections disagree. */
					snapshot_hash_candidates: z.array(z.string().regex(/^[0-9a-f]{32}$/u)),
					/** Distinct exported data headers with a valid hash at the header's fixed offset. */
					snapshot_hash_sources: z.number().int().nonnegative(),
					/** Snapshot symbols read from the dynamic symbol table. */
					sections: z.array(z.strictObject({
						name: z.string().min(1),
						offset: z.number().int().nonnegative(),
						size: z.number().int().nonnegative(),
						magic_valid: z.boolean(),
						kind: z.number().int().nonnegative().nullable(),
						/** Raw declared snapshot length, excluding the four magic bytes. */
						header_length: z.number().int().nonnegative().nullable()
					}))
				}),
				string_pool: z.strictObject({
					coverage: z.enum(["complete", "partial"]).describe("Coverage of the bounded printable-run projection; independent of snapshot header validity"),
					/** Distinct package: source URIs, sorted, bounded. */
					package_uris: z.array(z.string().min(1)),
					package_uri_count_at_least: z.number().int().nonnegative(),
					/** Distinct dart: SDK URIs, sorted, bounded. */
					dart_uris: z.array(z.string().min(1)),
					dart_uri_count_at_least: z.number().int().nonnegative(),
					/** Identifier-like tokens, bounded; includes incidental matches. */
					class_like_tokens: z.array(z.string().min(1)),
					class_like_token_count_at_least: z.number().int().nonnegative(),
					printable_run_count: z.number().int().nonnegative()
				}),
				coverage: z.enum(["complete", "partial"])
			})
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/dartAotView.js
var aotSchema, dartAotSummarySchema, dartAotViewRequestSchema, dartAotViewContextSchema, projectDartAotView;
function init_dartAotView() {
	return (init_dartAotView = __esmMin((() => {
		init_analysisViewErrors();
		init_flutterBuildAnalysis();
		init_result();
		init_analysisViewParent();
		init_analysisViewCoverage();
		aotSchema = flutterResultSchemas.inspect_dart_aot;
		dartAotSummarySchema = aotSchema.extend({ string_pool: aotSchema.shape.string_pool.omit({
			package_uris: true,
			dart_uris: true,
			class_like_tokens: true
		}).extend({ returned_counts: z.strictObject({
			package_uris: z.number().int().nonnegative(),
			dart_uris: z.number().int().nonnegative(),
			class_like_tokens: z.number().int().nonnegative()
		}) }) });
		dartAotViewRequestSchema = z.strictObject({
			kind: z.literal("dart-aot"),
			collection: z.enum([
				"package_uris",
				"dart_uris",
				"class_like_tokens"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		dartAotViewContextSchema = z.strictObject({
			abi: aotSchema.shape.abi,
			libapp: aotSchema.shape.libapp,
			source_coverage: aotSchema.shape.coverage,
			string_pool: dartAotSummarySchema.shape.string_pool
		});
		projectDartAotView = (parent, view) => {
			if (view.kind !== "summary" && view.kind !== "dart-aot") return err(analysisViewInputError([{
				path: ["view"],
				reason: "invalid_value",
				message: "Dart AOT Evidence supports summary and string-pool pages."
			}]));
			const parsed = parseAnalysisViewResult(aotSchema, parent);
			if (!parsed.ok) return parsed;
			const report = parsed.value;
			const { package_uris, dart_uris, class_like_tokens, ...pool } = report.string_pool;
			const string_pool = {
				...pool,
				returned_counts: {
					package_uris: package_uris.length,
					dart_uris: dart_uris.length,
					class_like_tokens: class_like_tokens.length
				}
			};
			const shared = {
				parent_evidence_id: parent.evidenceId,
				parent_operation: "inspect_dart_aot",
				parent_digest: parent.evidenceId.slice(3),
				artifact: {
					path: report.target.path,
					sha256: report.target.sha256
				},
				limitations: [...parent.limitations],
				unknowns: [
					"String-pool entries are byte-pattern observations, not recovered typed classes or functions.",
					"Counts ending in _at_least remain lower bounds; exhausting returned strings does not establish a complete snapshot inventory.",
					...parent.subject == null ? ["The parent has no recorded subject; its normalized target identity cannot be cross-checked against a subject digest."] : []
				]
			};
			if (view.kind === "summary") return ok({
				kind: "summary",
				view,
				...shared,
				summary: {
					...report,
					string_pool
				},
				coverage: completeWithinViewCoverage(1, 1)
			});
			const collection = report.string_pool[view.collection];
			const items = collection.slice(view.offset, view.offset + view.limit);
			return ok({
				kind: "dart-aot",
				view,
				...shared,
				items,
				abi: report.abi,
				libapp: report.libapp,
				source_coverage: report.coverage,
				string_pool,
				coverage: pageViewCoverage(view.offset, items.length, collection.length)
			});
		};
	})))();
}

//#endregion
//#region dist/domain/analysisView/analysisView.js
var summaryViewSchema, facetViewSchema, indexSelectorSchema, nameSelectorSchema, pathSelectorSchema, nodeIdSelectorSchema, moduleItemViewSchema, sectionOrSymbolItemViewSchema, itemViewSchema, pageViewSchema, nativeViewSchema, inventoryViewSchema, analysisViewRequestSchema, inlineEvidenceInputSchema, analysisViewSourceSchema, inspectAnalysisViewInputSchema, coverageSchema, artifactSchema, layoutSummarySchema, javascriptSummarySchema, inventorySummarySchema, viewResultBase, summaryViewResultBase, binaryLayoutSummaryViewResultSchema, javascriptApplicationSummaryViewResultSchema, artifactInventorySummaryViewResultSchema, wasmArtifactSummaryViewResultSchema, machoSummaryViewResultSchema, interfaceBuilderSummaryViewResultSchema, evmInterfaceSummaryViewResultSchema, managedArtifactSummaryViewResultSchema, managedMemberSummaryViewResultSchema, webNetworkCaptureSummaryViewResultSchema, androidPackageSummaryViewResultSchema, pcapCaptureSummaryViewResultSchema, dartAotSummaryViewResultSchema, analysisViewResultSchema, sealAnalysisView, parentDigest, parseJavaScriptParent, unsupportedParent, parentArtifactPath, retainedViewProjectors, projectAnalysisView;
function init_analysisView() {
	return (init_analysisView = __esmMin((() => {
		init_javascriptSourceSelection();
		init_analysisErrorCore();
		init_analysisViewErrors();
		init_canonicalDigest();
		init_digests();
		init_evidence();
		init_jsonValue();
		init_result();
		init_binaryLayout();
		init_hopperValues();
		init_artifactGraph();
		init_artifactInspection();
		init_javascriptApplicationAnalysis();
		init_inputIssueProjection();
		init_binaryLayoutView();
		init_javascriptApplicationView();
		init_webNetworkApiSurfaceView();
		init_nativeFunctionView();
		init_evmInterfaceView();
		init_artifactInventoryView();
		init_managedArtifactView();
		init_managedMemberView();
		init_wasmArtifactView();
		init_machoView();
		init_interfaceBuilderView();
		init_webNetworkCaptureView();
		init_pcapCaptureView();
		init_qlogCaptureView();
		init_androidPackageView();
		init_dartAotView();
		summaryViewSchema = z.strictObject({ kind: z.literal("summary") });
		facetViewSchema = z.strictObject({
			kind: z.literal("facet"),
			facet: z.enum(["mitigations", "linkage"])
		});
		indexSelectorSchema = z.strictObject({ index: z.number().int().nonnegative() });
		nameSelectorSchema = z.strictObject({ name: z.string() });
		pathSelectorSchema = z.strictObject({ path: z.string().describe("Exact observed module path or original source-map reference from a module page; an empty reference is valid.") });
		nodeIdSelectorSchema = z.strictObject({ node_id: prefixedDigestSchema("jag_node") });
		moduleItemViewSchema = z.strictObject({
			kind: z.literal("item"),
			collection: z.literal("modules"),
			selector: z.union([pathSelectorSchema, nodeIdSelectorSchema])
		});
		sectionOrSymbolItemViewSchema = z.strictObject({
			kind: z.literal("item"),
			collection: z.enum(["sections", "symbols"]),
			selector: z.union([indexSelectorSchema, nameSelectorSchema])
		});
		itemViewSchema = z.discriminatedUnion("collection", [moduleItemViewSchema, sectionOrSymbolItemViewSchema]);
		pageViewSchema = z.strictObject({
			kind: z.literal("page"),
			collection: z.enum([
				"sections",
				"symbols",
				"modules"
			]),
			offset: z.number().int().nonnegative(),
			limit: z.number().int().positive()
		});
		nativeViewSchema = z.strictObject({
			kind: z.literal("native"),
			facet: z.enum([
				"procedure",
				"pseudocode",
				"assembly",
				"basic_blocks",
				"comments",
				"callers",
				"callees",
				"incoming_references",
				"outgoing_references",
				"unresolved_calls",
				"referenced_strings",
				"referenced_names",
				"swift_string_literals",
				"swift_string_literal_omissions",
				"native_api",
				"value_flow_summary",
				"value_flow_operations",
				"value_flow_def_use",
				"value_flow_effects",
				"value_flow_parameters",
				"value_flow_parameter_uses"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		});
		inventoryViewSchema = z.discriminatedUnion("collection", [z.strictObject({
			kind: z.literal("inventory"),
			collection: z.literal("occurrences"),
			logical_paths: z.array(z.string()).optional().describe("Exact recorded logical paths. Omitted selects all available occurrences; an empty array selects none. This does not resolve filesystem paths."),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		}), z.strictObject({
			kind: z.literal("inventory"),
			collection: z.enum([
				"nodes",
				"edges",
				"integrity_contradictions"
			]),
			offset: z.number().int().nonnegative().default(0),
			limit: z.number().int().positive().default(64)
		})]);
		analysisViewRequestSchema = z.discriminatedUnion("kind", [
			summaryViewSchema,
			facetViewSchema,
			itemViewSchema,
			pageViewSchema,
			nativeViewSchema,
			inventoryViewSchema,
			wasmViewRequestSchema,
			machoViewRequestSchema,
			interfaceBuilderViewRequestSchema,
			evmViewRequestSchema,
			managedViewRequestSchema,
			managedMembersViewRequestSchema,
			androidViewRequestSchema,
			apiSurfaceViewSchema,
			captureViewRequestSchema,
			qlogViewRequestSchema,
			pcapViewRequestSchema,
			dartAotViewRequestSchema
		]);
		inlineEvidenceInputSchema = z.unknown().nonoptional();
		inlineEvidenceInputSchema._zod.processJSONSchema = evidenceSchema._zod.processJSONSchema;
		analysisViewSourceSchema = z.discriminatedUnion("kind", [z.strictObject({
			kind: z.literal("retained-evidence"),
			evidence_id: prefixedDigestSchema("ev")
		}), z.strictObject({
			kind: z.literal("inline"),
			evidence: inlineEvidenceInputSchema
		})]);
		inspectAnalysisViewInputSchema = z.strictObject({
			source: analysisViewSourceSchema,
			view: analysisViewRequestSchema
		});
		coverageSchema = z.strictObject({
			status: z.enum([
				"complete-within-view",
				"page",
				"empty"
			]),
			examined: z.number().int().nonnegative(),
			total: z.number().int().nonnegative(),
			next_offset: z.number().int().nonnegative().nullable(),
			exhausted: z.boolean()
		});
		artifactSchema = z.strictObject({
			path: z.string().describe("Exact recorded artifact path, including an empty string."),
			sha256: digestSchema.nullable()
		});
		layoutSummarySchema = z.strictObject({
			bytes: z.number().int().nonnegative(),
			format: z.literal("elf"),
			architecture: z.strictObject({
				machine: z.literal("EM_X86_64"),
				bits: z.literal(64),
				byte_order: z.literal("little")
			}),
			image_type: z.enum([
				"ET_EXEC",
				"ET_DYN",
				"ET_REL"
			]),
			entry: z.strictObject({
				reported_value: z.string().min(1),
				meaning: z.enum([
					"linked-virtual-address",
					"not-applicable",
					"absent"
				]),
				execution_status: z.literal("unknown")
			}),
			counts: z.strictObject({
				sections: z.number().int().nonnegative(),
				segments: z.number().int().nonnegative(),
				symbols: z.number().int().nonnegative(),
				relocations: z.number().int().nonnegative()
			}),
			limitation_count: z.number().int().nonnegative()
		});
		javascriptSummarySchema = z.strictObject({
			input_path: z.string().min(1),
			format: z.enum(["asar", "directory"]),
			root_artifact_sha256: digestSchema,
			source_selection: javaScriptSourceSelectionSchema.exactOptional(),
			statistics: jsonObjectSchema,
			electron: jsonObjectSchema,
			coverage: jsonObjectSchema,
			limitation_count: z.number().int().nonnegative()
		});
		inventorySummarySchema = z.strictObject({
			manifest: artifactGraphManifestSchema,
			available_counts: z.strictObject({
				nodes: z.number().int().nonnegative(),
				occurrences: z.number().int().nonnegative(),
				edges: z.number().int().nonnegative(),
				integrity_contradictions: z.number().int().nonnegative()
			}),
			observed_entry_kind_counts: z.strictObject({
				file: z.number().int().nonnegative(),
				directory: z.number().int().nonnegative(),
				symlink: z.number().int().nonnegative(),
				slice: z.number().int().nonnegative()
			}),
			source_complete: z.boolean(),
			inventory_evidence_ids: z.array(prefixedDigestSchema("ev")).min(1),
			inspection: z.strictObject({
				coverage: artifactInspectionResultSchema.shape.coverage,
				unexplored_branches: artifactInspectionResultSchema.shape.unexplored_branches
			}).nullable(),
			limitation_count: z.number().int().nonnegative()
		});
		viewResultBase = {
			parent_evidence_id: prefixedDigestSchema("ev"),
			parent_operation: z.enum([
				"inspect_binary_layout",
				"analyze_javascript_application",
				"analyze_function",
				"inspect_artifact",
				"inventory_artifact",
				"inspect_wasm_artifact",
				"inspect_macho",
				"decode_interface_builder",
				"inspect_evm_interface",
				"inspect_managed_artifact",
				"inspect_managed_members",
				"inspect_web_network_capture",
				"inspect_android_package",
				"inspect_pcap_capture",
				"inspect_dart_aot"
			]),
			parent_digest: digestSchema,
			view_digest: digestSchema,
			artifact: artifactSchema,
			coverage: coverageSchema,
			limitations: z.array(z.string()),
			unknowns: z.array(z.string())
		};
		summaryViewResultBase = {
			kind: z.literal("summary"),
			view: summaryViewSchema,
			...viewResultBase
		};
		binaryLayoutSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			summary: layoutSummarySchema,
			parent_operation: z.literal("inspect_binary_layout")
		});
		javascriptApplicationSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			summary: javascriptSummarySchema,
			parent_operation: z.literal("analyze_javascript_application")
		});
		artifactInventorySummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.enum(["inspect_artifact", "inventory_artifact"]),
			summary: inventorySummarySchema
		});
		wasmArtifactSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_wasm_artifact"),
			summary: wasmSummarySchema
		});
		machoSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_macho"),
			summary: machoSummarySchema
		});
		interfaceBuilderSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("decode_interface_builder"),
			summary: interfaceBuilderSummarySchema
		});
		evmInterfaceSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_evm_interface"),
			summary: evmSummarySchema
		});
		managedArtifactSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_managed_artifact"),
			summary: managedSummarySchema
		});
		managedMemberSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_managed_members"),
			summary: managedMemberSummarySchema
		});
		webNetworkCaptureSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_web_network_capture"),
			summary: captureSummarySchema
		});
		androidPackageSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_android_package"),
			summary: androidPackageSummarySchema
		});
		pcapCaptureSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_pcap_capture"),
			summary: pcapSummarySchema
		});
		dartAotSummaryViewResultSchema = z.strictObject({
			...summaryViewResultBase,
			parent_operation: z.literal("inspect_dart_aot"),
			summary: dartAotSummarySchema
		});
		analysisViewResultSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				...viewResultBase,
				...apiSurfaceFields,
				kind: z.literal("api-surface"),
				parent_operation: z.literal("inspect_web_network_capture"),
				view: apiSurfaceViewSchema,
				artifact: z.strictObject({
					path: z.string(),
					sha256: digestSchema.nullable()
				})
			}),
			z.strictObject({
				...summaryViewResultBase,
				summary: z.union([
					layoutSummarySchema,
					javascriptSummarySchema,
					inventorySummarySchema,
					wasmSummarySchema,
					machoSummarySchema,
					interfaceBuilderSummarySchema,
					evmSummarySchema,
					managedSummarySchema,
					managedMemberSummarySchema,
					captureSummarySchema,
					androidPackageSummarySchema,
					pcapSummarySchema,
					dartAotSummarySchema
				])
			}),
			z.strictObject({
				kind: z.literal("capture"),
				view: captureViewRequestSchema,
				items: captureViewItemsSchema,
				...viewResultBase,
				parent_operation: z.literal("inspect_web_network_capture")
			}),
			z.strictObject({
				kind: z.literal("qlog"),
				view: qlogViewRequestSchema,
				page: qlogViewPageSchema,
				context: qlogViewContextSchema,
				...viewResultBase,
				parent_operation: z.literal("inspect_web_network_capture")
			}),
			z.strictObject({
				kind: z.literal("pcap"),
				view: pcapViewRequestSchema,
				page: pcapViewPageSchema,
				source_coverage: z.enum(["complete", "partial"]),
				...viewResultBase,
				parent_operation: z.literal("inspect_pcap_capture")
			}),
			z.strictObject({
				kind: z.literal("facet"),
				view: facetViewSchema,
				facet: jsonValueSchema,
				...viewResultBase
			}),
			z.strictObject({
				kind: z.literal("item"),
				view: itemViewSchema,
				item: jsonValueSchema,
				...viewResultBase
			}),
			z.strictObject({
				kind: z.literal("page"),
				view: pageViewSchema,
				items: z.array(jsonValueSchema),
				...viewResultBase
			}),
			z.strictObject({
				kind: z.literal("native"),
				view: nativeViewSchema,
				procedure_address: z.string().nullable(),
				item: jsonValueSchema,
				...viewResultBase
			}),
			z.strictObject({
				kind: z.literal("wasm"),
				view: wasmViewRequestSchema,
				item: wasmViewItemSchema,
				...viewResultBase
			}),
			z.strictObject({
				kind: z.literal("macho"),
				view: machoViewRequestSchema,
				item: machoViewItemSchema,
				...viewResultBase,
				...machoViewContextSchema.shape,
				parent_operation: z.literal("inspect_macho")
			}),
			z.strictObject({
				kind: z.literal("interface-builder"),
				view: interfaceBuilderViewRequestSchema,
				items: interfaceBuilderViewItemsSchema,
				...viewResultBase,
				...interfaceBuilderViewContextSchema.shape,
				parent_operation: z.literal("decode_interface_builder")
			}),
			z.strictObject({
				kind: z.literal("evm"),
				view: evmViewRequestSchema,
				item: evmViewItemSchema,
				...viewResultBase,
				parent_operation: z.literal("inspect_evm_interface")
			}),
			z.strictObject({
				kind: z.literal("managed"),
				view: managedViewRequestSchema,
				item: managedViewItemSchema,
				...viewResultBase,
				...managedViewContextSchema.shape,
				parent_operation: z.literal("inspect_managed_artifact")
			}),
			z.strictObject({
				kind: z.literal("managed-members"),
				view: managedMembersViewRequestSchema,
				page: managedMembersViewPageSchema,
				...viewResultBase,
				...managedMembersViewContextSchema.shape,
				parent_operation: z.literal("inspect_managed_members")
			}),
			z.strictObject({
				kind: z.literal("android"),
				view: androidViewRequestSchema,
				item: androidManifestViewItemSchema,
				...viewResultBase,
				parent_operation: z.literal("inspect_android_package")
			}),
			z.strictObject({
				kind: z.literal("dart-aot"),
				view: dartAotViewRequestSchema,
				items: z.array(z.string()),
				...viewResultBase,
				...dartAotViewContextSchema.shape,
				parent_operation: z.literal("inspect_dart_aot")
			}),
			z.strictObject({
				kind: z.literal("inventory"),
				view: inventoryViewSchema,
				manifest: artifactGraphManifestSchema,
				inventory_evidence_ids: z.array(prefixedDigestSchema("ev")).min(1),
				source_complete: z.boolean(),
				items: z.array(z.union([
					artifactNodeSchema,
					artifactOccurrenceSchema,
					artifactEdgeSchema,
					integrityContradictionSchema
				])),
				...viewResultBase
			})
		]);
		sealAnalysisView = (projection) => analysisViewResultSchema.parse({
			...projection,
			view_digest: digestCanonicalValue(projection, "Analysis view")
		});
		parentDigest = (evidenceId) => evidenceId.slice(3);
		parseJavaScriptParent = (input) => {
			try {
				const steps = parseOwnedJavaScriptApplicationAnalysisSteps(input);
				let step = steps.next();
				while (!step.done) step = steps.next();
				return ok(step.value);
			} catch (cause) {
				if (!(cause instanceof z.ZodError)) throw cause;
				return err(analysisInputErrorFromIssues(INSPECT_ANALYSIS_VIEW_OPERATION, cause.issues.map((issue) => ({
					...issue,
					path: [
						"source",
						"normalized_result",
						...issue.path
					]
				})), { source: { normalized_result: input } }, { cause }));
			}
		};
		unsupportedParent = (parent) => new AnalysisUnsupportedTargetError(INSPECT_ANALYSIS_VIEW_OPERATION, parentArtifactPath(parent), `Parent Evidence operation ${JSON.stringify(parent.operation)} does not support analysis views. Use completed binary layout, JavaScript application, native function, artifact inventory/inspection, WASM, Mach-O, Interface Builder, EVM, managed artifact or member, Android package, Dart AOT, or web network capture Evidence.`);
		parentArtifactPath = (parent) => {
			if (typeof parent.normalizedResult === "object" && parent.normalizedResult !== null && "artifact" in parent.normalizedResult && typeof parent.normalizedResult.artifact === "object" && parent.normalizedResult.artifact !== null && "path" in parent.normalizedResult.artifact && typeof parent.normalizedResult.artifact.path === "string") return parent.normalizedResult.artifact.path;
			if (typeof parent.normalizedResult === "object" && parent.normalizedResult !== null && "input_path" in parent.normalizedResult && typeof parent.normalizedResult.input_path === "string") return parent.normalizedResult.input_path;
			return parent.evidenceId;
		};
		retainedViewProjectors = new Map([
			["inspect_wasm_artifact", projectWasmArtifactView],
			["inspect_macho", projectMachoView],
			["decode_interface_builder", projectInterfaceBuilderView],
			["inspect_evm_interface", projectEvmInterfaceView],
			["inspect_managed_artifact", projectManagedArtifactView],
			["inspect_managed_members", projectManagedMemberView],
			["inspect_android_package", projectAndroidPackageView],
			["inspect_dart_aot", projectDartAotView],
			["inspect_artifact", projectArtifactInventoryView],
			["inventory_artifact", projectArtifactInventoryView]
		]);
		projectAnalysisView = (parent, view, apiSurfaceAccumulator) => {
			const digest = parentDigest(parent.evidenceId);
			if (!digestSchema.safeParse(digest).success) return err(analysisViewInputError([{
				path: ["source"],
				reason: "invalid_format",
				message: "Parent Evidence ID is not a digest-backed identifier."
			}]));
			if (view.kind === "api-surface") {
				const projected = projectWebNetworkApiSurfaceView(parent, view, apiSurfaceAccumulator);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			if (parent.operation === "inspect_web_network_capture") {
				const projected = projectWebNetworkCaptureView(parent, view);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			if (parent.operation === "inspect_pcap_capture") {
				const projected = projectPcapCaptureView(parent, view);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			if (parent.operation === "inspect_binary_layout") {
				const layout = binaryLayoutSchema.safeParse(parent.normalizedResult);
				if (!layout.success) return err(analysisViewInputError([{
					path: ["source"],
					reason: "invalid_value",
					message: "Parent Evidence result does not match inspect_binary_layout."
				}]));
				const projected = projectBinaryLayoutView(parent, layout.data, view);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			if (parent.operation === "analyze_javascript_application") {
				const analysis = parseJavaScriptParent(parent.normalizedResult);
				if (!analysis.ok) return analysis;
				const projected = projectJavaScriptApplicationView(parent, analysis.value, view);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			if (parent.operation === "analyze_function") {
				const native = functionDossierSchema.safeParse(parent.normalizedResult);
				if (!native.success) return err(analysisInputErrorFromIssues(INSPECT_ANALYSIS_VIEW_OPERATION, native.error.issues.map((issue) => ({
					...issue,
					path: [
						"source",
						"normalized_result",
						...issue.path
					]
				})), { source: { normalized_result: parent.normalizedResult } }, { cause: native.error }));
				const projected = projectNativeFunctionView(parent, native.data, view);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			const project = retainedViewProjectors.get(parent.operation);
			if (project !== undefined) {
				const projected = project(parent, view);
				return projected.ok ? ok(sealAnalysisView(projected.value)) : projected;
			}
			return err(unsupportedParent(parent));
		};
	})))();
}

//#endregion
//#region dist/domain/evidenceRecordSummary.js
var evidenceRecordFiltersSchema, countSchema, nativeMetadataSchema, valueFlowMetadataSchema, nativeSummarySchema, evidenceBundleSummarySchema, nativeSummary, summarizeEvidenceBundle;
function init_evidenceRecordSummary() {
	return (init_evidenceRecordSummary = __esmMin((() => {
		init_digests();
		init_evidence();
		evidenceRecordFiltersSchema = z.strictObject({
			evidence_id: prefixedDigestSchema("ev").optional(),
			operation: z.string().min(1).optional(),
			target_sha256: digestSchema.optional(),
			analysis_profile_digest: digestSchema.optional(),
			procedure_address: z.string().min(1).optional()
		});
		countSchema = z.number().int().nonnegative();
		nativeMetadataSchema = z.object({
			procedure: z.object({
				address: z.string(),
				name: z.string().nullish()
			}),
			native_value_flow: z.unknown().optional()
		});
		valueFlowMetadataSchema = z.union([z.object({
			available: z.literal(true),
			truncated: z.boolean(),
			omitted_operations_lower_bound: countSchema.optional(),
			known_omitted_inputs: countSchema.optional(),
			known_omitted_edges: countSchema.optional()
		}), z.object({
			available: z.literal(false),
			reason: z.string()
		})]);
		nativeSummarySchema = z.discriminatedUnion("available", [z.strictObject({
			available: z.literal(true),
			procedure_address: z.string(),
			procedure_name: z.string().nullable(),
			value_flow: z.discriminatedUnion("status", [
				z.strictObject({
					status: z.literal("observed"),
					truncated: z.boolean(),
					omitted_operations_lower_bound: countSchema.nullable(),
					known_omitted_inputs: countSchema.nullable(),
					known_omitted_edges: countSchema.nullable()
				}),
				z.strictObject({
					status: z.literal("unavailable"),
					reason: z.string()
				}),
				z.strictObject({ status: z.literal("not-recorded") }),
				z.strictObject({
					status: z.literal("unknown"),
					reason: z.string()
				})
			])
		}), z.strictObject({
			available: z.literal(false),
			reason: z.enum(["different-operation", "not-recorded-or-incompatible"])
		})]);
		evidenceBundleSummarySchema = z.strictObject({
			kind: z.literal("evidence-bundle-summary"),
			filters: z.record(z.string(), z.string()),
			total_retained_records: countSchema,
			matching_records: countSchema,
			unknown_revisions: countSchema,
			records: z.array(z.strictObject({
				evidence_id: evidenceSchema.shape.evidence_id,
				subject: evidenceSchema.shape.subject,
				provider: evidenceSchema.shape.provider,
				operation: evidenceSchema.shape.operation,
				confidence: evidenceSchema.shape.confidence,
				authority: evidenceSchema.shape.authority,
				analysis_profile_digest: digestSchema.nullable(),
				retention: z.literal("complete-record"),
				limitation_count: countSchema,
				native_dossier: nativeSummarySchema
			}))
		});
		nativeSummary = (evidence) => {
			if (evidence.operation !== "analyze_function") return {
				available: false,
				reason: "different-operation"
			};
			const parsed = nativeMetadataSchema.safeParse(evidence.normalized_result);
			if (!parsed.success) return {
				available: false,
				reason: "not-recorded-or-incompatible"
			};
			const flow = valueFlowMetadataSchema.safeParse(parsed.data.native_value_flow);
			return {
				available: true,
				procedure_address: parsed.data.procedure.address,
				procedure_name: parsed.data.procedure.name ?? null,
				value_flow: parsed.data.native_value_flow == null ? { status: "not-recorded" } : !flow.success ? {
					status: "unknown",
					reason: "Value-flow metadata has an incompatible representation."
				} : flow.data.available ? {
					status: "observed",
					truncated: flow.data.truncated,
					omitted_operations_lower_bound: flow.data.omitted_operations_lower_bound ?? null,
					known_omitted_inputs: flow.data.known_omitted_inputs ?? null,
					known_omitted_edges: flow.data.known_omitted_edges ?? null
				} : {
					status: "unavailable",
					reason: flow.data.reason
				}
			};
		};
		summarizeEvidenceBundle = (bundle, filters = {}) => {
			const selectedFilters = {};
			for (const [field, value] of Object.entries(filters)) if (value !== undefined) selectedFilters[field] = value;
			const records = [];
			for (const evidence of bundle.records) {
				if (filters.evidence_id !== undefined && filters.evidence_id !== evidence.evidence_id || filters.operation !== undefined && filters.operation !== evidence.operation || filters.target_sha256 !== undefined && filters.target_sha256 !== evidence.subject?.digest.sha256 || filters.analysis_profile_digest !== undefined && filters.analysis_profile_digest !== evidence.analysis_profile?.digest) continue;
				const native = nativeSummary(evidence);
				if (filters.procedure_address !== undefined && (!native.available || filters.procedure_address !== native.procedure_address)) continue;
				records.push({
					evidence_id: evidence.evidence_id,
					subject: evidence.subject,
					provider: evidence.provider,
					operation: evidence.operation,
					confidence: evidence.confidence,
					authority: evidence.authority,
					analysis_profile_digest: evidence.analysis_profile?.digest ?? null,
					retention: "complete-record",
					limitation_count: evidence.limitations.length,
					native_dossier: native
				});
			}
			return {
				kind: "evidence-bundle-summary",
				filters: selectedFilters,
				total_retained_records: bundle.records.length,
				matching_records: records.length,
				unknown_revisions: bundle.unknowns.length,
				records
			};
		};
	})))();
}

//#endregion
//#region dist/domain/process/processObservation.js
var comparableTerminalFrame, processObservationSourceSchema, processObservationLocationSchema, comparableProcessObservationPayload, createProcessObservation, atMilliseconds, isSafeMillisecond, processObservationSubject, projectedRecord, projectProcessObservation;
function init_processObservation() {
	return (init_processObservation = __esmMin((() => {
		init_jsonValue();
		comparableTerminalFrame = (frame) => ({
			sequence: frame.sequence,
			at_ms: frame.at_ms,
			data: frame.data
		});
		processObservationSourceSchema = z.enum([
			"terminal_raw",
			"terminal_rendered",
			"interaction",
			"lifecycle",
			"process",
			"filesystem"
		]);
		processObservationLocationSchema = z.strictObject({
			collection: z.enum([
				"frames",
				"rendered_frames",
				"interaction_events",
				"lifecycle",
				"process_samples",
				"filesystem_checkpoints"
			]),
			index: z.number().int().nonnegative(),
			capture_order: z.number().int().nonnegative()
		});
		comparableProcessObservationPayload = (value, ignoredFields = []) => {
			if (ignoredFields.length === 0 || typeof value !== "object" || value === null || Array.isArray(value)) return value;
			return Object.fromEntries(Object.entries(value).filter(([name]) => !ignoredFields.includes(name)));
		};
		createProcessObservation = (input) => ({
			event_id: `obs.${input.location.collection}.${String(input.location.index)}`,
			source: input.source,
			source_sequence: input.source_sequence,
			capture_order: input.location.capture_order,
			captured_at_ms: input.captured_at_ms,
			subject_id: input.subject_id,
			location: input.location,
			payload: jsonValueSchema.parse(input.payload)
		});
		atMilliseconds = (value) => {
			if (typeof value !== "object" || value === null) return null;
			if ("at_ms" in value && isSafeMillisecond(value.at_ms)) return value.at_ms;
			if ("dispatched_at_ms" in value && isSafeMillisecond(value.dispatched_at_ms)) return value.dispatched_at_ms;
			return null;
		};
		isSafeMillisecond = (value) => typeof value === "number" && Number.isSafeInteger(value);
		processObservationSubject = (source, value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
			if (source === "process" && "pid" in value && typeof value.pid === "number") return `process:${String(value.pid)}`;
			if (source === "filesystem" && "name" in value && typeof value.name === "string") return `checkpoint:${value.name}`;
			return null;
		};
		projectedRecord = (capture, location) => {
			const projected = (() => {
				switch (location.collection) {
					case "frames": {
						const frame = capture.frames[location.index];
						return {
							source: "terminal_raw",
							value: frame === undefined ? undefined : comparableTerminalFrame(frame)
						};
					}
					case "rendered_frames": return {
						source: "terminal_rendered",
						value: capture.rendered_frames[location.index]
					};
					case "interaction_events": return {
						source: "interaction",
						value: capture.interaction_events[location.index]
					};
					case "lifecycle": return location.index === 0 ? {
						source: "lifecycle",
						value: {
							event: "exit",
							...capture.exit
						}
					} : location.index === 1 ? {
						source: "lifecycle",
						value: {
							event: "settlement",
							...capture.settlement
						}
					} : null;
					case "process_samples": return {
						source: "process",
						value: capture.process_samples[location.index]
					};
					case "filesystem_checkpoints": return {
						source: "filesystem",
						value: capture.filesystem_checkpoints[location.index]
					};
				}
			})();
			if (projected === null || projected.value === undefined) return null;
			const payload = jsonValueSchema.parse(projected.value);
			return {
				source: projected.source,
				captured_at_ms: atMilliseconds(payload),
				subject_id: processObservationSubject(projected.source, payload),
				payload
			};
		};
		projectProcessObservation = (capture, location) => {
			const projected = projectedRecord(capture, location);
			if (projected === null) return null;
			return createProcessObservation({
				source: projected.source,
				source_sequence: location.index,
				captured_at_ms: projected.captured_at_ms,
				subject_id: projected.subject_id,
				location,
				payload: projected.payload
			});
		};
	})))();
}

//#endregion
//#region dist/domain/process/processTraceSpecification.js
var processTraceIdentifierSchema, cardinalitySchema, eventDeclarationSchema, partialOrderLanguageSchema, finiteTraceTokenSchema, finiteTraceLanguageSchema, specificationShapeSchema, canonicalTraceJson, processTraceCardinalityBounds, addReferenceIssue, pairKey, buildAdjacency, validateNotBefore, classifyGraph, collectReachable, validateUnorderedGroups, validateTotalOrderRelations, addUnorderedConflictIssues, validatePartialOrderRelations, validatePartialOrder, countVariantEvents, validateFiniteTraces, processTraceSpecificationSchema;
function init_processTraceSpecification() {
	return (init_processTraceSpecification = __esmMin((() => {
		init_stringPatterns();
		init_jsonValue();
		init_processObservation();
		processTraceIdentifierSchema = z.string().regex(IDENTIFIER_PATTERN);
		cardinalitySchema = z.discriminatedUnion("kind", [
			z.strictObject({ kind: z.literal("required") }),
			z.strictObject({ kind: z.literal("optional") }),
			z.strictObject({
				kind: z.literal("exact"),
				count: z.number().int().min(0)
			}),
			z.strictObject({
				kind: z.literal("range"),
				min: z.number().int().min(0),
				max: z.number().int().min(0)
			}).refine(({ min, max }) => min <= max, {
				message: "cardinality min must not exceed max",
				path: ["min"]
			})
		]);
		eventDeclarationSchema = z.strictObject({
			id: processTraceIdentifierSchema,
			source: processObservationSourceSchema,
			exact: jsonValueSchema,
			ignore_fields: z.array(z.enum([
				"sequence",
				"at_ms",
				"scheduled_at_ms",
				"dispatched_at_ms",
				"elapsed_ms"
			])).refine((values) => new Set(values).size === values.length, { message: "ignored event fields must be unique" }).optional(),
			cardinality: cardinalitySchema.default({ kind: "required" })
		});
		partialOrderLanguageSchema = z.strictObject({
			kind: z.literal("partial_order"),
			happens_before: z.array(z.strictObject({
				before: processTraceIdentifierSchema,
				after: processTraceIdentifierSchema
			})).default([]),
			not_before: z.array(z.strictObject({
				event: processTraceIdentifierSchema,
				anchor: processTraceIdentifierSchema
			})).default([]),
			unordered_groups: z.array(z.strictObject({ events: z.array(processTraceIdentifierSchema).min(2) })).default([]),
			prefix: z.array(processTraceIdentifierSchema).default([]),
			suffix: z.array(processTraceIdentifierSchema).default([])
		});
		finiteTraceTokenSchema = z.union([processTraceIdentifierSchema, z.strictObject({ unordered: z.array(processTraceIdentifierSchema).min(2) })]);
		finiteTraceLanguageSchema = z.strictObject({
			kind: z.literal("finite_traces"),
			variants: z.array(z.strictObject({
				id: processTraceIdentifierSchema,
				trace: z.array(finiteTraceTokenSchema)
			})).min(1)
		});
		specificationShapeSchema = z.strictObject({
			events: z.array(eventDeclarationSchema).min(1),
			language: z.discriminatedUnion("kind", [partialOrderLanguageSchema, finiteTraceLanguageSchema])
		});
		canonicalTraceJson = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Trace specification contains a non-JSON value");
			return serialized;
		};
		processTraceCardinalityBounds = (cardinality) => {
			switch (cardinality.kind) {
				case "required": return [1, 1];
				case "optional": return [0, 1];
				case "exact": return [cardinality.count, cardinality.count];
				case "range": return [cardinality.min, cardinality.max];
			}
		};
		addReferenceIssue = (context, known, id, path) => {
			if (!known.has(id)) context.addIssue({
				code: "custom",
				message: `unknown event id: ${id}`,
				path
			});
		};
		pairKey = (left, right) => left <= right ? `${left}\0${right}` : `${right}\0${left}`;
		buildAdjacency = (language, context, known) => {
			const adjacency = new Map([...known].map((id) => [id, new Set()]));
			for (const [index, edge] of language.happens_before.entries()) {
				const path = [
					"language",
					"happens_before",
					index
				];
				addReferenceIssue(context, known, edge.before, [...path, "before"]);
				addReferenceIssue(context, known, edge.after, [...path, "after"]);
				if (edge.before === edge.after) context.addIssue({
					code: "custom",
					message: "happens-before edges must reference distinct events",
					path
				});
				adjacency.get(edge.before)?.add(edge.after);
			}
			return adjacency;
		};
		validateNotBefore = (language, context, known) => {
			const pairs = new Set();
			for (const [index, constraint] of language.not_before.entries()) {
				const path = [
					"language",
					"not_before",
					index
				];
				addReferenceIssue(context, known, constraint.event, [...path, "event"]);
				addReferenceIssue(context, known, constraint.anchor, [...path, "anchor"]);
				if (constraint.event === constraint.anchor) context.addIssue({
					code: "custom",
					message: "not-before constraints must reference distinct events",
					path
				});
				const key = pairKey(constraint.event, constraint.anchor);
				if (pairs.has(key)) context.addIssue({
					code: "custom",
					message: "not-before event pairs must be declared once",
					path
				});
				pairs.add(key);
			}
			return pairs;
		};
		classifyGraph = (ids, adjacency) => {
			const incoming = new Map(ids.map((id) => [id, 0]));
			let hasUnknownSuccessor = false;
			for (const successors of adjacency.values()) for (const successor of successors) {
				const count = incoming.get(successor);
				if (count === undefined) hasUnknownSuccessor = true;
				else incoming.set(successor, count + 1);
			}
			const ready = [...incoming].flatMap(([id, count]) => count === 0 ? [id] : []);
			const order = [];
			let unique = true;
			while (ready.length > 0) {
				if (ready.length !== 1) unique = false;
				const current = ready.pop();
				if (current === undefined) continue;
				order.push(current);
				for (const successor of adjacency.get(current) ?? []) {
					const count = incoming.get(successor);
					if (count === undefined) continue;
					incoming.set(successor, count - 1);
					if (count === 1) ready.push(successor);
				}
			}
			if (order.length !== incoming.size) return { kind: "cyclic" };
			if (unique && order.length === ids.length && !hasUnknownSuccessor) {
				return {
					kind: "total-order",
					rank: new Map(order.map((id, index) => [id, index]))
				};
			}
			const reverseAdjacency = new Map([...incoming.keys()].map((id) => [id, new Set()]));
			for (const [before, successors] of adjacency) for (const after of successors) reverseAdjacency.get(after)?.add(before);
			return {
				kind: "partial-order",
				reverseAdjacency
			};
		};
		collectReachable = (origin, adjacency) => {
			const seen = new Set();
			const pending = [...adjacency.get(origin) ?? []];
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined || seen.has(current)) continue;
				seen.add(current);
				for (const successor of adjacency.get(current) ?? []) pending.push(successor);
			}
			return seen;
		};
		validateUnorderedGroups = (language, context, known) => {
			const memberships = new Map();
			const groups = [];
			const repeatedMemberships = new Map();
			for (const [groupIndex, group] of language.unordered_groups.entries()) {
				const path = [
					"language",
					"unordered_groups",
					groupIndex
				];
				const uniqueIds = new Set();
				const repeatedIds = new Set();
				for (const id of group.events) {
					if (uniqueIds.has(id)) repeatedIds.add(id);
					else uniqueIds.add(id);
				}
				groups.push(uniqueIds);
				for (const id of repeatedIds) {
					const groupIndexes = repeatedMemberships.get(id) ?? new Set();
					groupIndexes.add(groupIndex);
					repeatedMemberships.set(id, groupIndexes);
				}
				if (uniqueIds.size !== group.events.length) context.addIssue({
					code: "custom",
					message: "unordered groups must not repeat event ids",
					path: [...path, "events"]
				});
				for (const [eventIndex, id] of group.events.entries()) addReferenceIssue(context, known, id, [
					...path,
					"events",
					eventIndex
				]);
				const overlaps = new Map();
				for (const id of uniqueIds) {
					const priorGroups = memberships.get(id) ?? new Set();
					for (const prior of priorGroups) overlaps.set(prior, (overlaps.get(prior) ?? 0) + 1);
					priorGroups.add(groupIndex);
					memberships.set(id, priorGroups);
				}
				if ([...overlaps.values()].some((count) => count > 1)) context.addIssue({
					code: "custom",
					message: "unordered event pairs must be declared once",
					path
				});
			}
			const markSharedGroups = (left, right, conflicts) => {
				if (left === right) {
					for (const groupIndex of repeatedMemberships.get(left) ?? []) conflicts[groupIndex] = true;
					return;
				}
				const rightGroups = memberships.get(right);
				for (const group of memberships.get(left) ?? []) if (rightGroups?.has(group) === true) conflicts[group] = true;
			};
			return {
				groups,
				hasPair(left, right) {
					if (left === right) return memberships.has(left);
					const rightGroups = memberships.get(right);
					for (const group of memberships.get(left) ?? []) if (rightGroups?.has(group) === true) return true;
					return false;
				},
				markDeclaredPairConflicts(pairs, conflicts) {
					for (const key of pairs) {
						const separator = key.indexOf("\0");
						const left = key.slice(0, separator);
						const right = key.slice(separator + 1);
						markSharedGroups(left, right, conflicts);
					}
				},
				markSharedGroups
			};
		};
		validateTotalOrderRelations = (language, graph, unorderedGroups, notBeforePairs, context) => {
			for (const [index, constraint] of language.not_before.entries()) {
				const before = graph.rank.get(constraint.event);
				const after = graph.rank.get(constraint.anchor);
				if (before !== undefined && after !== undefined && before < after) context.addIssue({
					code: "custom",
					message: "not-before constraint conflicts with happens-before order",
					path: [
						"language",
						"not_before",
						index
					]
				});
			}
			const conflicts = new Array(language.unordered_groups.length).fill(false);
			for (const [groupIndex, group] of unorderedGroups.groups.entries()) {
				let comparableEvents = 0;
				for (const id of group) if (graph.rank.has(id) && ++comparableEvents === 2) {
					conflicts[groupIndex] = true;
					break;
				}
			}
			unorderedGroups.markDeclaredPairConflicts(notBeforePairs, conflicts);
			addUnorderedConflictIssues(conflicts, context);
		};
		addUnorderedConflictIssues = (conflicts, context) => {
			for (const [groupIndex, conflict] of conflicts.entries()) if (conflict) context.addIssue({
				code: "custom",
				message: "ordered events cannot also be declared unordered",
				path: [
					"language",
					"unordered_groups",
					groupIndex
				]
			});
		};
		validatePartialOrderRelations = (ids, language, adjacency, graph, unorderedGroups, notBeforePairs, context) => {
			let missingPairCount = 0;
			let firstMissingPair = "";
			const groupConflicts = new Array(language.unordered_groups.length).fill(false);
			unorderedGroups.markDeclaredPairConflicts(notBeforePairs, groupConflicts);
			const notBeforeConflictFlags = new Uint8Array(language.not_before.length);
			const constraintsBySource = new Map();
			for (const [index, constraint] of language.not_before.entries()) {
				const indexes = constraintsBySource.get(constraint.event) ?? [];
				indexes.push(index);
				constraintsBySource.set(constraint.event, indexes);
			}
			for (const [leftIndex, leftId] of ids.entries()) {
				const forward = collectReachable(leftId, adjacency);
				const backward = collectReachable(leftId, graph.reverseAdjacency);
				for (const constraintIndex of constraintsBySource.get(leftId) ?? []) {
					const constraint = language.not_before[constraintIndex];
					if (constraint !== undefined && forward.has(constraint.anchor)) notBeforeConflictFlags[constraintIndex] = 1;
				}
				for (let rightIndex = leftIndex + 1; rightIndex < ids.length; rightIndex++) {
					const rightId = ids[rightIndex];
					if (rightId === undefined) continue;
					const sameEvent = leftId === rightId;
					const ordered = !sameEvent && (forward.has(rightId) || backward.has(rightId));
					const key = pairKey(leftId, rightId);
					const notBefore = notBeforePairs.has(key);
					const unordered = unorderedGroups.hasPair(leftId, rightId);
					if (ordered || notBefore) {
						if (!sameEvent) unorderedGroups.markSharedGroups(leftId, rightId, groupConflicts);
					}
					if (!ordered && !notBefore && !unordered) {
						if (missingPairCount === 0) firstMissingPair = `${leftId}/${rightId}`;
						missingPairCount++;
					}
				}
			}
			for (const [index, conflict] of notBeforeConflictFlags.entries()) if (conflict === 1) context.addIssue({
				code: "custom",
				message: "not-before constraint conflicts with happens-before order",
				path: [
					"language",
					"not_before",
					index
				]
			});
			addUnorderedConflictIssues(groupConflicts, context);
			if (missingPairCount > 0) context.addIssue({
				code: "custom",
				message: missingPairCount === 1 ? `event pair ${firstMissingPair} must be explicitly ordered or unordered` : `${String(missingPairCount)} event pairs must be explicitly ordered or unordered; first undeclared pair: ${firstMissingPair}`,
				path: ["language"]
			});
		};
		validatePartialOrder = (specification, context) => {
			if (specification.language.kind !== "partial_order") return;
			const ids = specification.events.map(({ id }) => id);
			const known = new Set(ids);
			const adjacency = buildAdjacency(specification.language, context, known);
			const graph = classifyGraph(ids, adjacency);
			if (graph.kind === "cyclic") context.addIssue({
				code: "custom",
				message: "happens-before graph must be acyclic",
				path: ["language"]
			});
			const notBeforePairs = validateNotBefore(specification.language, context, known);
			const unorderedGroups = validateUnorderedGroups(specification.language, context, known);
			if (graph.kind === "total-order") {
				validateTotalOrderRelations(specification.language, graph, unorderedGroups, notBeforePairs, context);
			} else if (graph.kind === "partial-order") {
				validatePartialOrderRelations(ids, specification.language, adjacency, graph, unorderedGroups, notBeforePairs, context);
			}
			for (const [kind, values] of [["prefix", specification.language.prefix], ["suffix", specification.language.suffix]]) for (const [index, id] of values.entries()) addReferenceIssue(context, known, id, [
				"language",
				kind,
				index
			]);
		};
		countVariantEvents = (trace) => {
			const counts = new Map();
			for (const token of trace) for (const id of typeof token === "string" ? [token] : token.unordered) counts.set(id, (counts.get(id) ?? 0) + 1);
			return counts;
		};
		validateFiniteTraces = (specification, context) => {
			if (specification.language.kind !== "finite_traces") return;
			const known = new Set(specification.events.map(({ id }) => id));
			const variantIds = new Set();
			const variantTraces = new Set();
			for (const [variantIndex, variant] of specification.language.variants.entries()) {
				const variantPath = [
					"language",
					"variants",
					variantIndex
				];
				if (variantIds.has(variant.id)) context.addIssue({
					code: "custom",
					message: "finite trace variant ids must be unique",
					path: [...variantPath, "id"]
				});
				variantIds.add(variant.id);
				const canonicalTrace = canonicalTraceJson(variant.trace);
				if (variantTraces.has(canonicalTrace)) context.addIssue({
					code: "custom",
					message: "finite trace variants must not duplicate a trace",
					path: [...variantPath, "trace"]
				});
				variantTraces.add(canonicalTrace);
				for (const [tokenIndex, token] of variant.trace.entries()) {
					const values = typeof token === "string" ? [token] : token.unordered;
					for (const [eventIndex, id] of values.entries()) addReferenceIssue(context, known, id, [
						...variantPath,
						"trace",
						tokenIndex,
						...typeof token === "string" ? [] : ["unordered", eventIndex]
					]);
				}
				const counts = countVariantEvents(variant.trace);
				for (const event of specification.events) {
					const [minimum, maximum] = processTraceCardinalityBounds(event.cardinality);
					const count = counts.get(event.id) ?? 0;
					if (count < minimum || count > maximum) context.addIssue({
						code: "custom",
						message: `variant ${variant.id} violates ${event.id} cardinality`,
						path: [...variantPath, "trace"]
					});
				}
			}
		};
		processTraceSpecificationSchema = specificationShapeSchema.superRefine((specification, context) => {
			const ids = new Set();
			const predicates = new Set();
			const ignoredFieldsBySource = new Map();
			for (const [index, event] of specification.events.entries()) {
				if (ids.has(event.id)) context.addIssue({
					code: "custom",
					message: "event ids must be unique",
					path: [
						"events",
						index,
						"id"
					]
				});
				ids.add(event.id);
				const ignoredFields = [...event.ignore_fields ?? []].sort();
				if (ignoredFields.length > 0 && (typeof event.exact !== "object" || event.exact === null || Array.isArray(event.exact))) context.addIssue({
					code: "custom",
					message: "ignored schedule fields require an exact object payload",
					path: [
						"events",
						index,
						"ignore_fields"
					]
				});
				const ignoredKey = canonicalTraceJson(ignoredFields);
				const priorIgnoredKey = ignoredFieldsBySource.get(event.source);
				if (priorIgnoredKey !== undefined && priorIgnoredKey !== ignoredKey) context.addIssue({
					code: "custom",
					message: "events from one source must use the same ignored schedule fields",
					path: [
						"events",
						index,
						"ignore_fields"
					]
				});
				ignoredFieldsBySource.set(event.source, ignoredKey);
				if (ignoredFields.some((field) => typeof event.exact === "object" && event.exact !== null && !Array.isArray(event.exact) && field in event.exact)) context.addIssue({
					code: "custom",
					message: "exact payload must omit every ignored schedule field",
					path: [
						"events",
						index,
						"exact"
					]
				});
				const predicate = `${event.source}\0${canonicalTraceJson(comparableProcessObservationPayload(event.exact, ignoredFields))}`;
				if (predicates.has(predicate)) context.addIssue({
					code: "custom",
					message: "exact event predicates must not overlap",
					path: ["events", index]
				});
				predicates.add(predicate);
			}
			validatePartialOrder(specification, context);
			validateFiniteTraces(specification, context);
		});
	})))();
}

//#endregion
//#region dist/domain/rawBinary.js
var BINARY_ARCHITECTURES, binaryArchitectureSchema, RAW_BINARY_ENTRY_POINT, rawBinaryEntryPointSchema, parseRawBinaryEntryPoint, validateRawBinaryLength, addressWidth, admitRawBinary, rawBinarySelectionError;
function init_rawBinary() {
	return (init_rawBinary = __esmMin((() => {
		init_result();
		BINARY_ARCHITECTURES = [
			"x86",
			"x86_64",
			"arm",
			"arm64",
			"6502"
		];
		binaryArchitectureSchema = z.enum(BINARY_ARCHITECTURES);
		RAW_BINARY_ENTRY_POINT = /^0x[0-9A-Fa-f]{1,16}$/u;
		rawBinaryEntryPointSchema = z.string().regex(RAW_BINARY_ENTRY_POINT, { message: "entry_point must be a hexadecimal address of the form 0x…" });
		parseRawBinaryEntryPoint = (value) => {
			if (!RAW_BINARY_ENTRY_POINT.test(value)) return err("entry_point must be a hexadecimal address of the form 0x…");
			const parsed = BigInt(value);
			return ok({
				source: value,
				canonical: `0x${parsed.toString(16)}`,
				value: parsed
			});
		};
		validateRawBinaryLength = (length) => Number.isSafeInteger(length) && length >= 1 ? ok(null) : err("raw-binary requires at least one file byte");
		addressWidth = (architecture) => architecture === "6502" ? 65535n : architecture === "x86" || architecture === "arm" ? 4294967295n : 18446744073709551615n;
		admitRawBinary = (input) => {
			const architecture = binaryArchitectureSchema.safeParse(input.architecture);
			if (!architecture.success) return err({
				reason: "raw-binary format requires architecture (x86, x86_64, arm, arm64, or 6502)",
				constraint: "load_selection_rejected"
			});
			if (typeof input.entryPoint !== "string") return err({
				reason: "raw-binary format requires entry_point as a hexadecimal address of the form 0x…",
				constraint: "load_selection_rejected"
			});
			const entry = parseRawBinaryEntryPoint(input.entryPoint);
			if (!entry.ok) return err({
				reason: entry.error,
				constraint: "load_selection_rejected"
			});
			if ((architecture.data === "arm" || architecture.data === "arm64") && entry.value.value % 4n !== 0n) return err({
				reason: `raw-binary ${architecture.data} entry_point ${entry.value.canonical} must be 4-byte aligned`,
				constraint: "load_selection_rejected"
			});
			const length = validateRawBinaryLength(input.fileBytes);
			if (!length.ok) return err({
				reason: length.error,
				constraint: "file_format_rejected"
			});
			const last = entry.value.value + BigInt(input.fileBytes) - 1n;
			const max = addressWidth(architecture.data);
			if (entry.value.value > max || last > max) return err({
				reason: `raw-binary mapping from ${entry.value.canonical} must fit in the ${architecture.data} address width`,
				constraint: "load_selection_rejected"
			});
			return ok({
				architecture: architecture.data,
				entryPoint: entry.value.canonical,
				entryPointSource: entry.value.source
			});
		};
		rawBinarySelectionError = (input) => {
			const hasArchitecture = input.architecture !== undefined;
			const hasEntry = input.entryPoint !== undefined;
			if (input.format === "raw-binary") {
				if (!hasArchitecture || !hasEntry) return "format=raw-binary requires architecture and entry_point";
				return undefined;
			}
			if (hasArchitecture || hasEntry) return "architecture and entry_point apply only with format=raw-binary";
			return undefined;
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
//#region dist/domain/native/nativeUiObservation.js
var scope, nativeUiObservationInputSchema, nativeUiScenarioInputSchema, nativeUiScreenshotSchema, nativeUiSnapshotSchema, nativeUiResultSchema;
function init_nativeUiObservation() {
	return (init_nativeUiObservation = __esmMin((() => {
		init_webScreenshot();
		init_pngHeader();
		scope = {
			pid: z.number().int().positive(),
			window_id: z.number().int().positive(),
			screenshot: z.boolean().default(true),
			accessibility: z.boolean().default(true),
			max_nodes: z.number().int().positive().safe().default(500).describe("Maximum accessibility nodes per capture; increase for large windows.")
		};
		nativeUiObservationInputSchema = z.strictObject(scope);
		nativeUiScenarioInputSchema = z.strictObject({
			...scope,
			steps: z.array(z.discriminatedUnion("kind", [
				z.strictObject({
					kind: z.literal("click"),
					path: z.array(z.number().int().nonnegative()).max(32)
				}),
				z.strictObject({
					kind: z.literal("scroll"),
					path: z.array(z.number().int().nonnegative()).max(32),
					direction: z.enum(["increment", "decrement"])
				}),
				z.strictObject({
					kind: z.literal("key-entry"),
					path: z.array(z.number().int().nonnegative()).max(32),
					text: z.string()
				}),
				z.strictObject({
					kind: z.literal("wait"),
					milliseconds: z.number().int().min(0).max(18e4).describe("Wait duration in milliseconds, within the 180-second operation deadline.")
				})
			])).min(1)
		});
		nativeUiScreenshotSchema = z.strictObject({
			mime_type: z.literal("image/png"),
			base64: z.string().min(4).describe("Canonical base64 encoding of PNG bytes; the decoded bytes must have a PNG signature and IHDR chunk."),
			sha256: z.string().regex(/^[a-f0-9]{64}$/u).describe("SHA-256 digest of the decoded PNG bytes."),
			width: z.number().int().positive().describe("Must equal the width encoded in the PNG IHDR chunk."),
			height: z.number().int().positive().describe("Must equal the height encoded in the PNG IHDR chunk.")
		}).superRefine((screenshot, context) => {
			const bytes = decodeCanonicalBase64(screenshot.base64);
			if (bytes === undefined) {
				context.addIssue({
					code: "custom",
					message: "Invalid canonical PNG base64"
				});
				return;
			}
			if (createHash("sha256").update(bytes).digest("hex") !== screenshot.sha256) context.addIssue({
				code: "custom",
				message: "PNG screenshot digest mismatch"
			});
			const dimensions = readPngHeaderDimensions(bytes);
			if (dimensions === undefined) {
				context.addIssue({
					code: "custom",
					message: "Screenshot bytes are not a PNG image"
				});
				return;
			}
			if (dimensions.width !== screenshot.width || dimensions.height !== screenshot.height) context.addIssue({
				code: "custom",
				message: "PNG screenshot dimensions mismatch"
			});
		});
		nativeUiSnapshotSchema = z.strictObject({
			window: z.strictObject({
				pid: z.number().int().positive(),
				window_id: z.number().int().positive(),
				executable: z.string(),
				launch_time: z.number(),
				title: z.string()
			}),
			nodes: z.array(z.strictObject({
				path: z.array(z.number().int().nonnegative()),
				role: z.string().nullable(),
				title: z.string().nullable(),
				value: z.string().nullable(),
				actions: z.array(z.string()),
				children_count: z.number().int().nonnegative().nullable()
			})),
			truncated: z.boolean(),
			screenshot: nativeUiScreenshotSchema.nullable(),
			gaps: z.array(z.string())
		});
		nativeUiResultSchema = z.strictObject({
			target_sha256: z.string(),
			initial: nativeUiSnapshotSchema,
			steps: z.array(z.strictObject({
				index: z.number().int().nonnegative(),
				kind: z.string(),
				before: nativeUiSnapshotSchema,
				after: nativeUiSnapshotSchema.nullable(),
				outcome: z.enum([
					"completed",
					"failed",
					"cancelled"
				]),
				reason: z.string().nullable()
			})),
			restore: z.literal("leave-as-is"),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeCallObservation.js
var hexSchema, nativeString, objcName, functionBreakpoint, objcMethodBreakpoint, nativeCallBreakpointSchema, nativeCallObservationInputSchema, nativeCodeLocationSchema, nativeCallEventSchema, nativeCapturedOutputSchema, nativeCallObservationResultSchema;
function init_nativeCallObservation() {
	return (init_nativeCallObservation = __esmMin((() => {
		init_localPath();
		hexSchema = z.string().regex(/^0x[0-9a-f]+$/u);
		nativeString = z.string().regex(/^[^\x00]*$/u, "Native launch and breakpoint strings cannot contain NUL");
		objcName = nativeString.min(1).regex(/^[^\s\x5b\x5d]+$/u, "Use the bare name without spaces or brackets");
		functionBreakpoint = {
			kind: z.literal("function"),
			name: nativeString.min(1).describe("Exact symbol name, such as `open`, a C++ or mangled Swift symbol, or `-[NSString length]`.")
		};
		objcMethodBreakpoint = {
			kind: z.literal("objc-method"),
			selector: objcName.describe("Selector such as `dataTaskWithRequest:completionHandler:`.")
		};
		nativeCallBreakpointSchema = z.discriminatedUnion("kind", [z.strictObject({
			...functionBreakpoint,
			module: nativeString.min(1).optional().describe("Image file name that defines the symbol, such as `libsystem_kernel.dylib`; omit to match every image.")
		}), z.strictObject({
			...objcMethodBreakpoint,
			class_name: objcName.optional().describe("Implementing class; omit to match every class."),
			method_type: z.enum([
				"instance",
				"class",
				"any"
			]).default("any")
		})]);
		nativeCallObservationInputSchema = z.strictObject({
			breakpoints: z.array(nativeCallBreakpointSchema).min(1),
			arguments: z.array(nativeString).default([]),
			environment: z.record(z.string().min(1).regex(/^[^=\x00]+$/u, "Environment names cannot contain '=' or NUL"), z.string().regex(/^[^\x00]*$/u, "Environment values cannot contain NUL")).default({}).describe("Overrides on top of the environment REA runs with."),
			working_directory: localPathStringSchema.optional(),
			duration_ms: z.number().int().min(100).max(6e5).default(1e4).describe("Observation window; the process is killed if it is still running."),
			max_events: z.number().int().min(1).max(1e5).default(1e3).describe("Stop observing and kill the process after this many recorded entries."),
			argument_registers: z.number().int().min(0).max(8).default(4).describe("Integer argument registers to record per entry (arm64 has 8, x86_64 has 6)."),
			backtrace_frames: z.number().int().min(0).max(64).default(0).describe("Caller frames to record per entry.")
		});
		nativeCodeLocationSchema = z.strictObject({
			load_address: hexSchema,
			file_address: hexSchema.nullable(),
			module: z.string().nullable(),
			module_path: z.string().nullable(),
			symbol: z.string().nullable()
		});
		nativeCallEventSchema = z.strictObject({
			sequence: z.number().int().nonnegative(),
			elapsed_ms: z.number().nonnegative(),
			thread_id: z.number().int().nonnegative(),
			breakpoint_index: z.number().int().nonnegative(),
			...nativeCodeLocationSchema.shape,
			/** Dynamic class of an instance-method receiver, read without running code. */
			receiver_class: z.string().nullable(),
			/** Selector string read from the `_cmd` register of an Objective-C method. */
			selector: z.string().nullable(),
			registers: z.array(z.strictObject({
				name: z.string(),
				value: hexSchema
			})),
			backtrace: z.array(nativeCodeLocationSchema)
		});
		nativeCapturedOutputSchema = z.strictObject({
			text: z.string(),
			/** Bytes observed by the bridge, not a total when complete is false. */
			bytes: z.number().int().nonnegative(),
			truncated: z.boolean(),
			complete: z.boolean()
		});
		nativeCallObservationResultSchema = z.strictObject({
			target: z.strictObject({
				path: z.string(),
				sha256: z.string().regex(/^[0-9a-f]{64}$/u),
				architecture: z.string(),
				arguments: z.array(z.string()),
				environment: z.record(z.string(), z.string()),
				working_directory: z.string().nullable(),
				launch_identity: z.strictObject({
					/** A pathname hash does not verify the bytes mapped into the process. */
					loaded_image_sha256: z.null(),
					file_device: z.string().nullable(),
					file_inode: z.string().nullable(),
					selected_file_sha256: z.string().regex(/^[0-9a-f]{64}$/u).nullable(),
					module_path: z.string().nullable(),
					module_uuid: z.string().nullable(),
					stable: z.boolean()
				})
			}),
			debugger: z.strictObject({
				path: z.string(),
				sha256: z.string().regex(/^[0-9a-f]{64}$/u),
				version: z.string().nullable()
			}),
			process: z.strictObject({
				pid: z.number().int().positive(),
				outcome: z.enum([
					"exited",
					"duration-elapsed",
					"event-limit",
					"stop-limit",
					"resource-limit"
				]),
				exit_status: z.number().int().nullable(),
				exit_description: z.string().nullable(),
				/** REA confirmed the process is gone when observation ended. */
				terminated: z.boolean(),
				elapsed_ms: z.number().nonnegative(),
				stdout: nativeCapturedOutputSchema,
				stderr: nativeCapturedOutputSchema,
				/** Signal and exception stops LLDB reported; the process continued past each. */
				other_stops: z.array(z.string())
			}),
			breakpoints: z.array(z.strictObject({
				index: z.number().int().nonnegative(),
				request: z.discriminatedUnion("kind", [z.strictObject({
					...functionBreakpoint,
					module: z.string().nullable()
				}), z.strictObject({
					...objcMethodBreakpoint,
					class_name: z.string().nullable(),
					method_type: z.enum([
						"instance",
						"class",
						"any"
					])
				})]),
				location_count: z.number().int().nonnegative(),
				locations: z.array(nativeCodeLocationSchema)
			})),
			events: z.array(nativeCallEventSchema),
			coverage: z.strictObject({
				status: z.enum(["complete", "partial"]),
				event_limit_reached: z.boolean(),
				resource_limit_reached: z.boolean(),
				/** Aggregate breakpoint-location metadata exhausted its retained-byte budget. */
				breakpoint_locations_truncated: z.boolean().optional(),
				/** Requests that matched no code in any image loaded while observing. */
				unresolved_breakpoints: z.array(z.number().int().nonnegative())
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/native/bytePattern.js
var bytePatternFields, parseBytePattern, validateBytePattern, coverageBlock, byteSearchResultSchema;
function init_bytePattern() {
	return (init_bytePattern = __esmMin((() => {
		init_addressCoordinate();
		init_analysisErrorCore();
		init_result();
		bytePatternFields = {
			pattern: z.string().regex(/^([0-9a-fA-F]{2}|\?\?)(\s*([0-9a-fA-F]{2}|\?\?))*$/u),
			mask: z.string().regex(/^[0-9a-fA-F]{2}(\s*[0-9a-fA-F]{2})*$/u).optional()
		};
		parseBytePattern = (pattern, mask) => {
			const invalid = (field, message) => err(new AnalysisInputError("search_bytes", undefined, [{
				path: [field],
				reason: "invalid_value",
				message
			}]));
			if (!bytePatternFields.pattern.safeParse(pattern).success) return invalid("pattern", "Use hexadecimal byte pairs or ?? wildcards");
			if (mask !== undefined && !bytePatternFields.mask.safeParse(mask).success) return invalid("mask", "Use hexadecimal mask byte pairs");
			const pairs = pattern.replace(/\s/gu, "").match(/../gu) ?? [];
			const maskPairs = mask?.replace(/\s/gu, "").match(/../gu);
			if (maskPairs && maskPairs.length !== pairs.length) return invalid("mask", "Mask length must equal pattern length");
			const bytes = pairs.map((pair) => pair === "??" ? 0 : Number.parseInt(pair, 16));
			const masks = pairs.map((pair, index) => pair === "??" ? 0 : Number.parseInt(maskPairs?.[index] ?? "ff", 16));
			if (!masks.some((value) => value !== 0)) return invalid("pattern", "Pattern must constrain at least one bit");
			return ok({
				bytes,
				masks
			});
		};
		validateBytePattern = (value, context) => {
			const parsed = parseBytePattern(value.pattern, value.mask);
			if (!parsed.ok) for (const issue of parsed.error.issues) context.addIssue({
				code: "custom",
				path: [...issue.path],
				message: issue.message ?? "Invalid byte pattern"
			});
		};
		coverageBlock = z.strictObject({
			segment: z.string(),
			start: z.string(),
			end: z.string(),
			bytes: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
		}).superRefine((value, context) => {
			const start = addressCoordinate(value.start);
			const end = addressCoordinate(value.end);
			if (start === null || end === null || start.space !== end.space || start.offset > end.offset || end.offset - start.offset + 1n !== BigInt(value.bytes)) context.addIssue({
				code: "custom",
				message: "Byte coverage must equal its inclusive address range in one space"
			});
		});
		byteSearchResultSchema = z.strictObject({
			matches: z.array(z.strictObject({
				address: z.string(),
				segment: z.string(),
				file_offset: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).nullable(),
				procedure: z.strictObject({
					address: z.string(),
					name: z.string()
				}).nullable()
			})).max(1e3),
			searched: z.strictObject({
				blocks: z.array(coverageBlock),
				bytes: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
				skipped_uninitialized: z.array(coverageBlock),
				skipped_not_loaded: z.array(coverageBlock)
			}),
			complete: z.boolean(),
			next_cursor: z.string().min(1).nullable()
		}).superRefine((value, context) => {
			if (value.complete !== (value.next_cursor === null) || value.searched.bytes !== value.searched.blocks.reduce((sum, block) => sum + block.bytes, 0)) context.addIssue({
				code: "custom",
				message: "Byte search coverage and continuation disagree"
			});
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeFunctionAnnotations.js
var nativeFunctionAnnotationsInputSchema, nativeFunctionAnnotationsSchema;
function init_nativeFunctionAnnotations() {
	return (init_nativeFunctionAnnotations = __esmMin((() => {
		init_hopperValues();
		nativeFunctionAnnotationsInputSchema = z.strictObject({
			procedure: z.string().min(1),
			name: z.string().min(1).optional(),
			comment: z.string().optional().describe("Regular entry comment; empty text clears it"),
			inline_comment: z.string().optional().describe("Inline entry comment; empty text clears it")
		}).refine((value) => value.name !== undefined || value.comment !== undefined || value.inline_comment !== undefined, "Supply at least one annotation change");
		nativeFunctionAnnotationsSchema = z.strictObject({
			annotations: z.strictObject({
				address: z.string().min(1),
				name: z.string().min(1),
				comment: z.string().nullable(),
				inline_comment: z.string().nullable()
			}),
			dossier: functionDossierSchema,
			effects: z.strictObject({
				scope: z.literal("session-analysis-database"),
				source_bytes_modified: z.literal(false),
				persists_after_close: z.literal(false)
			})
		}).superRefine((value, context) => {
			if (value.annotations.address !== value.dossier.procedure.address || value.annotations.name !== value.dossier.procedure.name) context.addIssue({
				code: "custom",
				message: "Annotation readback disagrees with refreshed function identity"
			});
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeMetadataRecovery.js
var address$1, relatedType, nativeMetadataRecoverySchema, nativeMetadataRecoverySummarySchema;
function init_nativeMetadataRecovery() {
	return (init_nativeMetadataRecovery = __esmMin((() => {
		address$1 = z.string().regex(/^0x[0-9a-f]+$/u);
		relatedType = z.strictObject({
			address: address$1,
			type: z.string().nullable()
		});
		nativeMetadataRecoverySchema = z.strictObject({
			format: z.literal("dotnet-nativeaot"),
			/** Identifies parser-only facts without claiming Ghidra defined a DataType. */
			source: z.enum(["analysis-database", "read-only-derived-overlay"]).optional(),
			status: z.enum(["complete", "partial"]),
			header_address: address$1,
			format_major: z.number().int().nonnegative(),
			format_minor: z.number().int().nonnegative(),
			method_table_address: address$1,
			name_origin: z.enum(["generated", "inferred"]),
			original_name: z.null(),
			base_size_bytes: z.number().int().nonnegative(),
			related_type: relatedType.nullable(),
			interfaces: z.array(relatedType),
			virtual_slots: z.array(z.strictObject({
				slot: z.number().int().nonnegative(),
				slot_address: address$1,
				target_address: address$1.nullable(),
				procedure_name: z.string().nullable(),
				basis: z.literal("method-table-pointer")
			})),
			derived_memory: z.strictObject({
				address: address$1,
				size_bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				file_offset: z.null()
			}).nullable(),
			truncated: z.boolean().optional(),
			virtual_slots_omitted: z.number().int().nonnegative().optional(),
			interfaces_omitted: z.number().int().nonnegative().optional(),
			output_budget_bytes: z.number().int().nonnegative().optional(),
			diagnostics: z.array(z.string()),
			limitations: z.array(z.string())
		});
		nativeMetadataRecoverySummarySchema = z.strictObject({
			format: z.literal("dotnet-nativeaot"),
			analysis_mode: z.literal("read-only-derived-overlay").optional(),
			status: z.enum([
				"complete",
				"partial",
				"not_applicable"
			]),
			reason: z.string().nullable(),
			analysis_artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			header_address: address$1.nullable(),
			discovery: z.enum(["symbol", "signature-heuristic"]).nullable(),
			format_major: z.number().int().nonnegative().nullable(),
			format_minor: z.number().int().nonnegative().nullable(),
			method_tables: z.number().int().nonnegative(),
			types: z.array(relatedType),
			frozen_strings: z.array(z.strictObject({
				address: address$1,
				value: z.string()
			})).optional(),
			truncated: z.boolean().optional(),
			types_omitted: z.number().int().nonnegative().optional(),
			frozen_strings_omitted: z.number().int().nonnegative().optional(),
			output_budget_bytes: z.number().int().nonnegative().optional(),
			derived_overlay: z.strictObject({
				address: address$1,
				size_bytes: z.number().int().nonnegative(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}).nullable().optional(),
			derived_memory: nativeMetadataRecoverySchema.shape.derived_memory,
			coverage: z.strictObject({
				frozen_object_candidates: z.number().int().nonnegative().optional(),
				frozen_objects_annotated: z.number().int().nonnegative().optional(),
				pointer_candidates_examined: z.number().int().nonnegative().optional(),
				pointer_slots_examined: z.number().int().nonnegative().optional(),
				scan_bytes_examined: z.number().int().nonnegative().optional(),
				scan_bytes_omitted: z.number().int().nonnegative().optional(),
				rtr_signature_scan_bytes_examined: z.number().int().nonnegative().optional(),
				rtr_signature_scan_bytes_omitted: z.number().int().nonnegative().optional(),
				method_table_validation_items_examined: z.number().int().nonnegative().optional(),
				work_units_examined: z.number().int().nonnegative().optional(),
				method_tables_recovered: z.number().int().nonnegative().optional(),
				frozen_string_candidates: z.number().int().nonnegative().optional(),
				frozen_scan_bytes_examined: z.number().int().nonnegative().optional(),
				frozen_scan_bytes_omitted: z.number().int().nonnegative().optional(),
				frozen_string_data_bytes_examined: z.number().int().nonnegative().optional(),
				source_bytes_examined: z.number().int().nonnegative().optional(),
				source_bytes_omitted: z.number().int().nonnegative().optional(),
				source_byte_budget_bytes: z.number().int().nonnegative().optional(),
				work_budget_units: z.number().int().nonnegative().optional(),
				working_memory_budget_bytes: z.number().int().nonnegative().optional(),
				working_memory_bytes_peak: z.number().int().nonnegative().optional(),
				truncation_reason: z.enum([
					"source-byte-budget",
					"work-unit-budget",
					"working-memory-budget",
					"response-budget"
				]).optional(),
				basis: z.enum([
					"rehydrated-pointer-candidates-and-committed-instance-types",
					"raw-image-pointer-scan",
					"raw-image-and-rehydrated-pointer-scan",
					"unsupported-layout",
					"no-rtr-header"
				])
			}).nullable(),
			diagnostics: z.array(z.string()),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeLoadImage.js
var integer, digest, hexBytes, address, nativeLoadImageObservationSchema, nativeLoadImageCheckSchema, nativeLoadImageSchema;
function init_nativeLoadImage() {
	return (init_nativeLoadImage = __esmMin((() => {
		init_nativeMetadataRecovery();
		init_jsonValue();
		init_rawBinary();
		integer = z.number().int().min(0).max(Number.MAX_SAFE_INTEGER);
		digest = z.string().regex(/^[a-f0-9]{64}$/u);
		hexBytes = z.string().regex(/^(?:[a-f0-9]{2})*$/u);
		address = z.string().min(1);
		nativeLoadImageObservationSchema = z.strictObject({
			metadata_recovery: z.array(nativeMetadataRecoverySummarySchema).optional(),
			executable_format: z.string().min(1),
			language_id: z.string().min(1),
			compiler_spec_id: z.string().min(1),
			image_base: address,
			default_address_space: z.string().min(1),
			source_files: z.array(z.strictObject({
				name: z.string(),
				size: integer,
				original_sha256: digest,
				modified_sha256: digest
			})),
			mappings: z.array(z.strictObject({
				block: z.string(),
				start: address,
				end: address,
				address_space: z.string().min(1),
				initialized: z.boolean(),
				loaded: z.boolean(),
				overlay: z.boolean(),
				length: integer.min(1),
				source_file_index: integer.nullable(),
				file_offset: integer.nullable(),
				sha256: digest.nullable()
			})),
			relocations: z.array(z.strictObject({
				address,
				segment: integer.max(65535).nullable(),
				offset: integer.max(65535).nullable(),
				status: z.string().min(1),
				type: z.number().int(),
				values: z.array(z.number().int().min(Number.MIN_SAFE_INTEGER).max(Number.MAX_SAFE_INTEGER)),
				original_bytes_hex: hexBytes.nullable(),
				memory_bytes_hex: hexBytes.nullable()
			})),
			entry_points: z.array(address),
			entry_context: z.array(z.strictObject({
				address,
				registers: z.array(z.strictObject({
					name: z.string().min(1),
					value_hex: z.string().regex(/^0x[a-f0-9]+$/u).nullable()
				}))
			}))
		});
		nativeLoadImageCheckSchema = z.strictObject({
			name: z.string().min(1),
			matched: z.boolean(),
			expected: jsonValueSchema,
			observed: jsonValueSchema,
			file_offset: integer.nullable(),
			address: address.nullable()
		});
		nativeLoadImageSchema = z.union([
			z.strictObject({
				status: z.literal("unsupported"),
				reason: z.string().min(1),
				observations: nativeLoadImageObservationSchema,
				limitations: z.array(z.string().min(1))
			}),
			z.strictObject({
				status: z.enum(["verified", "mismatch"]),
				format: z.enum(["dos-mz", "dos-com"]),
				target_sha256: digest,
				load_segment: integer.max(65535),
				header_bytes: integer,
				module_bytes: integer,
				overlay_bytes: integer,
				entry: z.strictObject({
					relative_segment: integer.max(65535),
					offset: integer.max(65535),
					linear_address: address
				}),
				observations: nativeLoadImageObservationSchema,
				checks: z.array(nativeLoadImageCheckSchema),
				limitations: z.array(z.string().min(1))
			}),
			z.strictObject({
				status: z.enum(["verified", "mismatch"]),
				format: z.literal("raw-binary"),
				target_sha256: digest,
				architecture: binaryArchitectureSchema,
				language_id: z.string().min(1),
				compiler_spec_id: z.string().min(1),
				base_address: address,
				file_bytes: integer.min(1),
				entry: z.strictObject({
					address,
					file_offset: z.literal(0)
				}),
				observations: nativeLoadImageObservationSchema,
				checks: z.array(nativeLoadImageCheckSchema),
				limitations: z.array(z.string().min(1))
			})
		]);
	})))();
}

//#endregion
//#region dist/domain/native/nativeDataType.js
var nativeDataTypeInputSchema, nativeDataTypeSchema;
function init_nativeDataType() {
	return (init_nativeDataType = __esmMin((() => {
		init_nativeMetadataRecovery();
		nativeDataTypeInputSchema = z.strictObject({
			type: z.string().min(1).optional(),
			address: z.string().min(1).optional(),
			document: z.string().optional()
		}).refine((value) => value.type === undefined !== (value.address === undefined), "Supply exactly one of type or address");
		nativeDataTypeSchema = z.strictObject({
			status: z.enum(["available", "unavailable"]),
			reason: z.string().nullable(),
			id: z.string().nullable(),
			name: z.string().nullable(),
			kind: z.enum([
				"struct",
				"union",
				"enum",
				"pointer",
				"array",
				"typedef",
				"scalar",
				"unsupported",
				"unavailable"
			]),
			source: z.literal("analysis-database"),
			source_archive: z.string().nullable(),
			address: z.string().nullable(),
			size_bytes: z.number().int().nonnegative().nullable(),
			alignment_bytes: z.number().int().positive().nullable(),
			packing_enabled: z.boolean().nullable(),
			referenced_type: z.string().nullable(),
			array_count: z.number().int().nonnegative().nullable(),
			array_stride_bytes: z.number().int().nonnegative().nullable(),
			fields: z.array(z.strictObject({
				ordinal: z.number().int().nonnegative(),
				name: z.string().nullable(),
				offset_bytes: z.number().int().nonnegative(),
				size_bytes: z.number().int().nonnegative().nullable(),
				type_id: z.string(),
				bit_size: z.number().int().nonnegative().nullable(),
				bit_offset: z.number().int().nonnegative().nullable(),
				status: z.enum(["observed", "unsupported"]),
				flexible_tail: z.literal("unknown")
			})),
			members: z.array(z.strictObject({
				name: z.string(),
				value: z.string()
			})),
			total_fields: z.number().int().nonnegative(),
			truncated: z.boolean(),
			limitations: z.array(z.string()),
			metadata_recovery: nativeMetadataRecoverySchema.optional()
		});
	})))();
}

//#endregion
//#region dist/domain/process/processTraceEvaluation.js
var matchedEventSchema, sideResultShape, sideResultSchema, diagnosticSchema, processTraceComparisonResultSchema, scopesFor, unknownSide, failure, evaluateFiniteTrace, collectRecords, matchRecords, cardinalityFailure, evaluateOrderingConstraints, boundaryFailure, evaluatePartialOrder, evaluateMatchedTrace, evaluateProcessTraceSide;
function init_processTraceEvaluation() {
	return (init_processTraceEvaluation = __esmMin((() => {
		init_processCaptureCoverage();
		init_processObservation();
		init_processTraceSpecification();
		matchedEventSchema = z.strictObject({
			event_id: processTraceIdentifierSchema,
			location: processObservationLocationSchema
		});
		sideResultShape = {
			satisfied_constraints: z.array(z.string()),
			raw_trace: z.array(matchedEventSchema)
		};
		sideResultSchema = z.union([z.strictObject({
			...sideResultShape,
			status: z.literal("pass"),
			matched_variant: processTraceIdentifierSchema.nullable()
		}), z.strictObject({
			...sideResultShape,
			status: z.enum(["fail", "unknown"]),
			matched_variant: z.null()
		})]);
		diagnosticSchema = z.strictObject({
			kind: z.enum([
				"journal",
				"predicate",
				"cardinality",
				"edge",
				"prefix",
				"suffix",
				"trace"
			]),
			side: z.enum(["left", "right"]),
			message: z.string(),
			event_ids: z.array(processTraceIdentifierSchema),
			locations: z.array(processObservationLocationSchema)
		});
		processTraceComparisonResultSchema = z.strictObject({
			verdict: z.enum([
				"equivalent",
				"different",
				"nonconforming",
				"unknown"
			]),
			left: sideResultSchema,
			right: sideResultSchema,
			diagnostic: diagnosticSchema.nullable()
		});
		scopesFor = (sources) => new Set([...sources].map((source) => {
			if (source.startsWith("terminal_")) return "terminal";
			if (source === "lifecycle") return "exit";
			if (source === "filesystem") return "filesystem";
			if (source === "process") return "process";
			return "interaction";
		}));
		unknownSide = (rawTrace = []) => ({
			status: "unknown",
			matched_variant: null,
			satisfied_constraints: [],
			raw_trace: rawTrace
		});
		failure = (input) => ({
			result: {
				status: "fail",
				matched_variant: null,
				satisfied_constraints: [],
				raw_trace: input.rawTrace
			},
			diagnostic: {
				kind: input.kind,
				message: input.message,
				event_ids: [...input.eventIds],
				locations: [...input.locations]
			}
		});
		evaluateFiniteTrace = (ids, specification) => {
			if (specification.language.kind !== "finite_traces") return null;
			for (const variant of specification.language.variants) {
				let offset = 0;
				let accepted = true;
				for (const token of variant.trace) {
					if (typeof token === "string") {
						if (ids[offset] !== token) accepted = false;
						offset += 1;
						continue;
					}
					const actual = ids.slice(offset, offset + token.unordered.length).sort();
					const expected = [...token.unordered].sort();
					if (canonicalTraceJson(actual) !== canonicalTraceJson(expected)) accepted = false;
					offset += token.unordered.length;
				}
				if (accepted && offset === ids.length) return variant.id;
			}
			return null;
		};
		collectRecords = (capture, sources) => {
			const records = [];
			for (const location of capture.event_journal) {
				const record = projectProcessObservation(capture, location);
				if (record !== null && sources.has(record.source)) records.push({
					source: record.source,
					payload: record.payload,
					location
				});
			}
			return records;
		};
		matchRecords = (records, specification) => {
			const rawTrace = [];
			const locationsById = new Map();
			const ignoredFieldsBySource = new Map();
			const eventsByKey = new Map();
			for (const event of specification.events) {
				const ignoredFields = event.ignore_fields ?? [];
				ignoredFieldsBySource.set(event.source, ignoredFields);
				eventsByKey.set(`${event.source}\0${canonicalTraceJson(comparableProcessObservationPayload(event.exact, ignoredFields))}`, event);
			}
			for (const record of records) {
				const match = eventsByKey.get(`${record.source}\0${canonicalTraceJson(comparableProcessObservationPayload(record.payload, ignoredFieldsBySource.get(record.source)))}`);
				if (match === undefined) return failure({
					kind: "predicate",
					message: "Observed event does not match any declared exact predicate.",
					eventIds: [],
					locations: [record.location],
					rawTrace
				});
				rawTrace.push({
					event_id: match.id,
					location: record.location
				});
				const locations = locationsById.get(match.id) ?? [];
				locations.push(record.location);
				locationsById.set(match.id, locations);
			}
			return {
				rawTrace,
				locationsById
			};
		};
		cardinalityFailure = (trace, specification) => {
			for (const event of specification.events) {
				const [minimum, maximum] = processTraceCardinalityBounds(event.cardinality);
				const locations = trace.locationsById.get(event.id) ?? [];
				if (locations.length < minimum || locations.length > maximum) return failure({
					kind: "cardinality",
					message: `${event.id} observed ${String(locations.length)} times; expected ${String(minimum)}..${String(maximum)}.`,
					eventIds: [event.id],
					locations,
					rawTrace: trace.rawTrace
				});
			}
			return null;
		};
		evaluateOrderingConstraints = (trace, language) => {
			const satisfied = [];
			const failures = [];
			for (const edge of language.happens_before) {
				const before = trace.locationsById.get(edge.before) ?? [];
				const after = trace.locationsById.get(edge.after) ?? [];
				const lastBefore = before.at(-1);
				const firstAfter = after[0];
				if (lastBefore === undefined && firstAfter !== undefined) failures.push({
					kind: "edge",
					message: `${edge.before} is required when ${edge.after} occurs.`,
					eventIds: [edge.before, edge.after],
					locations: [firstAfter],
					rawTrace: trace.rawTrace
				});
				else if (lastBefore !== undefined && firstAfter !== undefined && lastBefore.capture_order >= firstAfter.capture_order) failures.push({
					kind: "edge",
					message: `${edge.before} must happen before ${edge.after}.`,
					eventIds: [edge.before, edge.after],
					locations: [lastBefore, firstAfter],
					rawTrace: trace.rawTrace
				});
				else satisfied.push(`happens_before:${edge.before}:${edge.after}`);
			}
			for (const constraint of language.not_before) {
				const events = trace.locationsById.get(constraint.event) ?? [];
				const anchors = trace.locationsById.get(constraint.anchor) ?? [];
				const firstEvent = events[0];
				const firstAnchor = anchors[0];
				if (firstEvent !== undefined && firstAnchor === undefined) failures.push({
					kind: "edge",
					message: `${constraint.anchor} is required when ${constraint.event} occurs.`,
					eventIds: [constraint.event, constraint.anchor],
					locations: [firstEvent],
					rawTrace: trace.rawTrace
				});
				else if (firstEvent !== undefined && firstAnchor !== undefined && firstEvent.capture_order < firstAnchor.capture_order) failures.push({
					kind: "edge",
					message: `${constraint.event} must not occur before ${constraint.anchor}.`,
					eventIds: [constraint.event, constraint.anchor],
					locations: [firstEvent, firstAnchor],
					rawTrace: trace.rawTrace
				});
				else satisfied.push(`not_before:${constraint.event}:${constraint.anchor}`);
			}
			if (failures.length === 0) return {
				failure: null,
				satisfied
			};
			const unique = (values, key) => [...new Map(values.map((value) => [key(value), value])).values()];
			return {
				failure: failure({
					kind: "edge",
					message: failures.map(({ message }) => message).join(" "),
					eventIds: unique(failures.flatMap(({ eventIds }) => eventIds), String),
					locations: unique(failures.flatMap(({ locations }) => locations), ({ collection, index }) => `${collection}:${String(index)}`),
					rawTrace: trace.rawTrace
				}),
				satisfied
			};
		};
		boundaryFailure = (trace, kind, expected) => {
			const ids = trace.rawTrace.map(({ event_id }) => event_id);
			const actual = kind === "prefix" ? ids.slice(0, expected.length) : expected.length === 0 ? [] : ids.slice(-expected.length);
			if (canonicalTraceJson(actual) === canonicalTraceJson(expected)) return null;
			const locations = kind === "prefix" ? trace.rawTrace.slice(0, expected.length) : trace.rawTrace.slice(-expected.length);
			return failure({
				kind,
				message: `Observed trace does not satisfy the declared ${kind}.`,
				eventIds: expected,
				locations: locations.map(({ location }) => location),
				rawTrace: trace.rawTrace
			});
		};
		evaluatePartialOrder = (trace, language) => {
			const ordering = evaluateOrderingConstraints(trace, language);
			if (ordering.failure !== null) return ordering.failure;
			const prefixFailure = boundaryFailure(trace, "prefix", language.prefix);
			if (prefixFailure !== null) return prefixFailure;
			const suffixFailure = boundaryFailure(trace, "suffix", language.suffix);
			if (suffixFailure !== null) return suffixFailure;
			const satisfied = ordering.satisfied;
			satisfied.push(...language.unordered_groups.map(({ events }) => `unordered:${events.join(":")}`));
			if (language.prefix.length > 0) satisfied.push(`prefix:${language.prefix.join(":")}`);
			if (language.suffix.length > 0) satisfied.push(`suffix:${language.suffix.join(":")}`);
			return {
				result: {
					status: "pass",
					matched_variant: null,
					satisfied_constraints: satisfied,
					raw_trace: trace.rawTrace
				},
				diagnostic: null
			};
		};
		evaluateMatchedTrace = (trace, specification) => {
			const invalidCardinality = cardinalityFailure(trace, specification);
			if (invalidCardinality !== null) return invalidCardinality;
			if (specification.language.kind === "partial_order") return evaluatePartialOrder(trace, specification.language);
			const ids = trace.rawTrace.map(({ event_id }) => event_id);
			const variant = evaluateFiniteTrace(ids, specification);
			return variant === null ? failure({
				kind: "trace",
				message: "Observed events do not match any finite trace variant.",
				eventIds: ids,
				locations: trace.rawTrace.map(({ location }) => location),
				rawTrace: trace.rawTrace
			}) : {
				result: {
					status: "pass",
					matched_variant: variant,
					satisfied_constraints: [`variant:${variant}`],
					raw_trace: trace.rawTrace
				},
				diagnostic: null
			};
		};
		evaluateProcessTraceSide = (capture, specification) => {
			const sources = new Set(specification.events.map(({ source }) => source));
			const relevantScopes = scopesFor(sources);
			const incomplete = [...sources].some((source) => processSourceTruncated(capture, source)) || capture.residual_unknowns.some(({ scope }) => relevantScopes.has(scope));
			if (capture.event_journal.length === 0) return {
				result: unknownSide(),
				diagnostic: {
					kind: "journal",
					message: "Capture has no cross-source event journal.",
					event_ids: [],
					locations: []
				}
			};
			const matched = matchRecords(collectRecords(capture, sources), specification);
			if (incomplete) return {
				result: unknownSide("rawTrace" in matched ? matched.rawTrace : matched.result.raw_trace),
				diagnostic: null
			};
			return "rawTrace" in matched ? evaluateMatchedTrace(matched, specification) : matched;
		};
	})))();
}

//#endregion
//#region dist/domain/process/processTraceDimensionProjection.js
var dimensionsForTraceSources, traceCoversObservedDimension;
function init_processTraceDimensionProjection() {
	return (init_processTraceDimensionProjection = __esmMin((() => {
		dimensionsForTraceSources = (sources) => {
			const dimensions = new Set();
			for (const source of sources) {
				if (source.startsWith("terminal_")) dimensions.add("terminal");
				else if (source === "interaction") dimensions.add("interaction");
				else if (source === "lifecycle") dimensions.add("exit");
				else if (source === "filesystem") dimensions.add("filesystem");
				else if (source === "process") dimensions.add("process");
			}
			return dimensions;
		};
		traceCoversObservedDimension = (dimension, sources, left, right) => {
			const any = (leftValues, rightValues) => leftValues.length > 0 || rightValues.length > 0;
			switch (dimension) {
				case "terminal": return (!any(left.frames, right.frames) || sources.has("terminal_raw")) && (!any(left.rendered_frames, right.rendered_frames) || sources.has("terminal_rendered"));
				case "interaction": return sources.has("interaction");
				case "exit": return sources.has("lifecycle");
				case "filesystem": return false;
				case "process": return sources.has("process");
			}
		};
	})))();
}

//#endregion
//#region dist/domain/process/processTraceComparison.js
var compareProcessTraces, processTraceOutcomesDiffer;
function init_processTraceComparison() {
	return (init_processTraceComparison = __esmMin((() => {
		init_processTraceEvaluation();
		init_processTraceSpecification();
		compareProcessTraces = (left, right, specificationInput) => {
			const specification = processTraceSpecificationSchema.parse(specificationInput);
			const leftEvaluation = evaluateProcessTraceSide(left, specification);
			const rightEvaluation = evaluateProcessTraceSide(right, specification);
			const diagnostic = leftEvaluation.diagnostic === null ? rightEvaluation.diagnostic === null ? null : {
				side: "right",
				...rightEvaluation.diagnostic
			} : {
				side: "left",
				...leftEvaluation.diagnostic
			};
			const outcomesDiffer = leftEvaluation.result.status !== rightEvaluation.result.status || JSON.stringify(leftEvaluation.result.raw_trace.map(({ event_id }) => event_id)) !== JSON.stringify(rightEvaluation.result.raw_trace.map(({ event_id }) => event_id));
			return processTraceComparisonResultSchema.parse({
				verdict: leftEvaluation.result.status === "unknown" || rightEvaluation.result.status === "unknown" ? "unknown" : leftEvaluation.result.status === "pass" && rightEvaluation.result.status === "pass" ? "equivalent" : outcomesDiffer ? "different" : "nonconforming",
				left: leftEvaluation.result,
				right: rightEvaluation.result,
				diagnostic
			});
		};
		processTraceOutcomesDiffer = (comparison) => comparison.left.status !== comparison.right.status || JSON.stringify(comparison.left.raw_trace.map(({ event_id }) => event_id)) !== JSON.stringify(comparison.right.raw_trace.map(({ event_id }) => event_id));
	})))();
}

//#endregion
//#region dist/domain/process/processComparison.js
var OPERATION, comparisonStatusSchema$2, PROCESS_COMPARISON_DIMENSIONS, deriveProcessComparisonStatus, processCaptureComparisonSchema, terminalObservations, filesystemObservations, sameJsonValue, processDimensionObservations, classifyCollection, hasUnknown, EVENT_TIME_FIELD, eventTime, firstCollectionDivergence, chooseFirstDivergence, assertComparable, differingContractFields, LOCATION_SOURCES, applyTraceVerdict, compareDimensions, compareProcessCaptures;
function init_processComparison() {
	return (init_processComparison = __esmMin((() => {
		init_processCaptureCoverage();
		init_processObservation();
		init_analysisErrorCore();
		init_jsonValue();
		init_processTraceEvaluation();
		init_processTraceDimensionProjection();
		init_processTraceComparison();
		OPERATION = "compare_process_captures";
		comparisonStatusSchema$2 = z.enum([
			"unchanged",
			"added",
			"removed",
			"changed",
			"truncated",
			"unknown",
			"contradiction"
		]);
		PROCESS_COMPARISON_DIMENSIONS = [
			"terminal",
			"interaction",
			"exit",
			"filesystem",
			"process"
		];
		deriveProcessComparisonStatus = (dimensions) => {
			if (dimensions.includes("truncated")) return "truncated";
			if (dimensions.some((status) => [
				"changed",
				"added",
				"removed"
			].includes(status))) return "changed";
			return dimensions.includes("unknown") ? "unknown" : "unchanged";
		};
		processCaptureComparisonSchema = z.object({
			status: comparisonStatusSchema$2,
			terminal: comparisonStatusSchema$2,
			interaction: comparisonStatusSchema$2,
			exit: comparisonStatusSchema$2,
			filesystem: comparisonStatusSchema$2,
			process: comparisonStatusSchema$2,
			first_divergence: z.discriminatedUnion("status", [
				z.object({ status: z.literal("none") }),
				z.object({
					status: z.literal("unknown"),
					reason: z.string()
				}),
				z.object({
					status: z.literal("found"),
					dimension: z.enum([
						"terminal",
						"interaction",
						"exit",
						"filesystem",
						"process"
					]),
					index: z.number().int().nonnegative(),
					left_at_ms: z.number().int().nonnegative().nullable(),
					right_at_ms: z.number().int().nonnegative().nullable(),
					left: jsonValueSchema.nullable(),
					right: jsonValueSchema.nullable()
				})
			]),
			trace: processTraceComparisonResultSchema.optional(),
			limitations: z.array(z.string())
		}).superRefine((comparison, context) => {
			const expected = deriveProcessComparisonStatus(PROCESS_COMPARISON_DIMENSIONS.map((dimension) => comparison[dimension]));
			if (comparison.status !== expected) context.addIssue({
				code: "custom",
				message: "Process comparison status contradicts its dimensions",
				path: ["status"]
			});
		});
		terminalObservations = (capture) => [...capture.frames.map((frame) => ({
			kind: "raw",
			...comparableTerminalFrame(frame)
		})), ...capture.rendered_frames.map((frame) => ({
			kind: "rendered",
			...frame
		}))].sort((left, right) => {
			const time = left.at_ms - right.at_ms;
			if (time !== 0) return time;
			if (left.kind !== right.kind) return left.kind === "raw" ? -1 : 1;
			return left.sequence - right.sequence;
		});
		filesystemObservations = (capture) => capture.filesystem_checkpoints;
		sameJsonValue = (left, right) => {
			const encodedLeft = canonicalize(left);
			return encodedLeft !== undefined && encodedLeft === canonicalize(right);
		};
		processDimensionObservations = (capture, dimension) => {
			switch (dimension) {
				case "terminal": return terminalObservations(capture);
				case "interaction": return capture.interaction_events;
				case "exit": return [{
					...capture.exit,
					settlement: capture.settlement
				}];
				case "filesystem": return filesystemObservations(capture);
				case "process": return capture.process_samples;
			}
		};
		classifyCollection = (left, right) => {
			if (sameJsonValue(left, right)) return "unchanged";
			if (left.length === 0) return "added";
			if (right.length === 0) return "removed";
			return "changed";
		};
		hasUnknown = (capture, scope) => capture.residual_unknowns.some((item) => item.scope === scope);
		EVENT_TIME_FIELD = {
			terminal: "at_ms",
			interaction: "dispatched_at_ms",
			exit: "at_ms",
			filesystem: "at_ms",
			process: "at_ms"
		};
		eventTime = (dimension, value) => {
			if (typeof value !== "object" || value === null) return null;
			const time = Reflect.get(value, EVENT_TIME_FIELD[dimension]);
			return typeof time === "number" && Number.isSafeInteger(time) && time >= 0 ? time : null;
		};
		firstCollectionDivergence = (dimension, left, right) => {
			const length = Math.max(left.length, right.length);
			for (let index = 0; index < length; index += 1) {
				const leftValue = left[index] ?? null;
				const rightValue = right[index] ?? null;
				if (sameJsonValue(leftValue, rightValue)) continue;
				return {
					status: "found",
					dimension,
					index,
					left_at_ms: eventTime(dimension, leftValue),
					right_at_ms: eventTime(dimension, rightValue),
					left: jsonValueSchema.parse(leftValue),
					right: jsonValueSchema.parse(rightValue)
				};
			}
			return null;
		};
		chooseFirstDivergence = (candidates) => {
			const found = candidates.filter((candidate) => candidate !== null);
			return found.sort((left, right) => {
				const leftTime = Math.min(left.left_at_ms ?? Number.MAX_SAFE_INTEGER, left.right_at_ms ?? Number.MAX_SAFE_INTEGER);
				const rightTime = Math.min(right.left_at_ms ?? Number.MAX_SAFE_INTEGER, right.right_at_ms ?? Number.MAX_SAFE_INTEGER);
				return leftTime - rightTime;
			})[0] ?? { status: "none" };
		};
		assertComparable = (left, right, options) => {
			if (left.manifest.comparison_contract_sha256 !== right.manifest.comparison_contract_sha256) {
				const fields = differingContractFields(left.manifest.comparison_contract, right.manifest.comparison_contract);
				throw new AnalysisInputError(OPERATION, undefined, [{
					path: ["right"],
					reason: "invalid_value",
					message: `Process captures have incompatible comparison contracts${fields.length === 0 ? "" : `; these scenario fields differ: ${fields.join(", ")}`}. Capture both scenarios with the same values for these fields, then compare them.`,
					expected: fields
				}]);
			}
			if (options.maxCaptureAgeMs === undefined) return;
			const maxCaptureAgeMs = options.maxCaptureAgeMs;
			const now = (options.now ?? Date.now)();
			const stale = [["left", left], ["right", right]].flatMap(([side, { manifest }]) => {
				const age = now - Date.parse(manifest.completed_at);
				return age > maxCaptureAgeMs ? [`${side} completed at ${manifest.completed_at} (${String(age)} ms ago)`] : [];
			});
			if (stale.length > 0) throw new AnalysisInputError(OPERATION, undefined, [{
				path: ["max_capture_age_ms"],
				reason: "out_of_range",
				message: `Process capture exceeds max_capture_age_ms ${String(maxCaptureAgeMs)}: ${stale.join("; ")}. Recapture the stale scenario or raise max_capture_age_ms.`
			}]);
		};
		differingContractFields = (left, right) => [...new Set([...Object.keys(left), ...Object.keys(right)])].filter((field) => !Object.hasOwn(left, field) || !Object.hasOwn(right, field) || canonicalize(left[field]) !== canonicalize(right[field])).sort();
		LOCATION_SOURCES = {
			frames: "terminal_raw",
			rendered_frames: "terminal_rendered",
			interaction_events: "interaction",
			lifecycle: "lifecycle",
			process_samples: "process",
			filesystem_checkpoints: "filesystem"
		};
		applyTraceVerdict = (dimensions, specification, trace, captures) => {
			const traceShowsDifference = processTraceOutcomesDiffer(trace);
			const traceStatus = trace.verdict === "unknown" ? "unknown" : trace.verdict === "equivalent" || !traceShowsDifference ? "unchanged" : "changed";
			const sources = new Set(specification.events.map(({ source }) => source));
			const covered = dimensionsForTraceSources(sources);
			const diagnosticSources = new Set([...specification.events.filter(({ id }) => trace.diagnostic?.event_ids.includes(id) === true).map(({ source }) => source), ...(trace.diagnostic?.locations ?? []).map(({ collection }) => LOCATION_SOURCES[collection])]);
			const attributed = diagnosticSources.size > 0 ? dimensionsForTraceSources(diagnosticSources) : covered;
			const statusFor = (dimension) => {
				const exact = dimensions[dimension];
				if (!covered.has(dimension)) return exact;
				if (trace.verdict === "nonconforming") return exact;
				if (trace.verdict === "different") return traceShowsDifference && (exact !== "unchanged" || attributed.has(dimension)) ? "changed" : exact;
				if (trace.verdict === "unknown" && [
					"changed",
					"added",
					"removed"
				].includes(exact)) return exact;
				return traceCoversObservedDimension(dimension, sources, captures[0], captures[1]) ? traceStatus : exact;
			};
			return {
				terminal: statusFor("terminal"),
				interaction: statusFor("interaction"),
				exit: statusFor("exit"),
				filesystem: statusFor("filesystem"),
				process: statusFor("process")
			};
		};
		compareDimensions = (left, right, sameNormalization) => {
			const classify = (scope, leftValues, rightValues, source) => !sameNormalization || hasUnknown(left, scope) || hasUnknown(right, scope) || processSourceTruncated(left, source) || processSourceTruncated(right, source) ? "unknown" : classifyCollection(leftValues, rightValues);
			return {
				terminal: classify("terminal", terminalObservations(left), terminalObservations(right), "terminal_rendered"),
				interaction: classify("interaction", left.interaction_events, right.interaction_events, "interaction"),
				exit: hasUnknown(left, "exit") || hasUnknown(right, "exit") ? "unknown" : sameJsonValue({
					exit: left.exit,
					settlement: left.settlement
				}, {
					exit: right.exit,
					settlement: right.settlement
				}) ? "unchanged" : "changed",
				filesystem: classify("filesystem", filesystemObservations(left), filesystemObservations(right), "filesystem"),
				process: classify("process", left.process_samples, right.process_samples, "process")
			};
		};
		compareProcessCaptures = (left, right, options = {}) => {
			assertComparable(left, right, options);
			const sameNormalization = sameJsonValue(left.normalization, right.normalization);
			const exactDimensions = compareDimensions(left, right, sameNormalization);
			const trace = options.traceSpecification === undefined ? undefined : compareProcessTraces(left, right, options.traceSpecification);
			const dimensions = trace === undefined || options.traceSpecification === undefined ? exactDimensions : applyTraceVerdict(exactDimensions, options.traceSpecification, trace, [left, right]);
			const divergenceCandidates = PROCESS_COMPARISON_DIMENSIONS.map((dimension) => dimensions[dimension] === "unknown" ? null : firstCollectionDivergence(dimension, processDimensionObservations(left, dimension), processDimensionObservations(right, dimension)));
			const observedFirstDivergence = chooseFirstDivergence(divergenceCandidates.map((candidate) => candidate !== null && trace?.verdict === "equivalent" && dimensions[candidate.dimension] === "unchanged" ? null : candidate));
			const firstDivergence = left.truncated || right.truncated ? {
				status: "unknown",
				reason: "Incomplete observations prevent locating the first divergence; unaffected dimensions retain their comparisons."
			} : trace?.verdict === "equivalent" && deriveProcessComparisonStatus(PROCESS_COMPARISON_DIMENSIONS.map((dimension) => dimensions[dimension])) === "unchanged" ? { status: "none" } : observedFirstDivergence.status === "found" ? observedFirstDivergence : !sameNormalization || left.residual_unknowns.length > 0 || right.residual_unknowns.length > 0 ? {
				status: "unknown",
				reason: "Residual unknowns prevent proving that no divergence occurred."
			} : observedFirstDivergence;
			const observedStatus = deriveProcessComparisonStatus(PROCESS_COMPARISON_DIMENSIONS.map((dimension) => dimensions[dimension]));
			return {
				status: observedStatus,
				...dimensions,
				first_divergence: firstDivergence,
				...trace === undefined ? {} : { trace },
				limitations: [
					...left.limitations,
					...right.limitations,
					...left.residual_unknowns.map(({ reason }) => reason),
					...right.residual_unknowns.map(({ reason }) => reason),
					...sameNormalization ? [] : ["Capture normalization rules differ."]
				]
			};
		};
	})))();
}

//#endregion
//#region dist/domain/apple/dyldPaths.js
var MAX_SYMLINK_HOPS, resolveTreePath, segmentsOf, directoryOf, joinPath, expandPrefix, COMPATIBLE_ARCHITECTURES, compatibleSlice;
function init_dyldPaths() {
	return (init_dyldPaths = __esmMin((() => {
		init_machoCpuIdentity();
		MAX_SYMLINK_HOPS = 32;
		resolveTreePath = async (view, input) => {
			const pending = segmentsOf(input);
			const resolved = [];
			let last;
			let hops = 0;
			while (pending.length > 0) {
				const segment = pending.shift() ?? "";
				if (segment === ".") continue;
				if (segment === "..") {
					if (resolved.length === 0) return { kind: "escapes" };
					resolved.pop();
					last = { kind: "directory" };
					continue;
				}
				const path = [...resolved, segment].join("/");
				const entry = await view.entry(path);
				if (entry === undefined) return { kind: "absent" };
				if (entry.kind === "symlink") {
					hops += 1;
					if (hops > MAX_SYMLINK_HOPS) return { kind: "absent" };
					if (entry.target.startsWith("/")) return { kind: "escapes" };
					pending.unshift(...segmentsOf(entry.target));
					continue;
				}
				if (entry.kind === "file" && pending.length > 0) return { kind: "absent" };
				resolved.push(segment);
				last = entry;
			}
			return last?.kind === "file" ? {
				kind: "file",
				path: resolved.join("/")
			} : { kind: "not-file" };
		};
		segmentsOf = (path) => {
			const segments = path.split("/").filter((segment) => segment !== "");
			if (path.endsWith("/")) segments.push(".");
			return segments;
		};
		directoryOf = (path) => {
			const index = path.lastIndexOf("/");
			return index < 0 ? "" : path.slice(0, index);
		};
		joinPath = (directory, rest) => directory === "" ? rest : rest === "" ? directory : `${directory}/${rest}`;
		expandPrefix = (raw, context) => {
			const variable = /^@(executable_path|loader_path)(?:\/(.*))?$/u.exec(raw);
			if (variable !== null) {
				const rest = variable[2] ?? "";
				if (variable[1] === "loader_path") return {
					scope: "target",
					path: joinPath(context.ownerDirectory, rest)
				};
				return context.executable === null ? {
					scope: "undetermined",
					path: raw
				} : {
					scope: "target",
					path: joinPath(directoryOf(context.executable), rest)
				};
			}
			if (raw.startsWith("/")) return {
				scope: "outside",
				path: raw
			};
			return {
				scope: "undetermined",
				path: raw
			};
		};
		COMPATIBLE_ARCHITECTURES = { x86_64h: ["x86_64h", "x86_64"] };
		compatibleSlice = (slices, process) => {
			for (const architecture of COMPATIBLE_ARCHITECTURES[process.architecture] ?? [process.architecture]) {
				const slice = slices.find((item) => item.architecture === architecture && (process.architecture !== "arm64e" || item.cpu_type === process.cpu_type && machoCpuSubtypeBase(item.cpu_subtype) === machoCpuSubtypeBase(process.cpu_subtype)));
				if (slice !== undefined) return slice;
			}
			return undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/apple/dyldEnvironment.js
var embeddedDyldOverrides, overrideEffect, isFrameworkInstallName, hasApplicableDyldOverrides;
function init_dyldEnvironment() {
	return (init_dyldEnvironment = __esmMin((() => {
		embeddedDyldOverrides = (environment, platforms) => {
			const overrides = [];
			for (const setting of environment) {
				const delimiter = setting.indexOf("=");
				if (delimiter <= 0) continue;
				const variable = setting.slice(0, delimiter);
				const value = setting.slice(delimiter + 1);
				const effect = overrideEffect(variable, value);
				if (effect === undefined) continue;
				if (variable === "DYLD_ROOT_PATH" && platforms.length > 0 && platforms.every((platform) => platform >= 1 && platform <= 12) && !platforms.some((platform) => [
					7,
					8,
					9,
					12
				].includes(platform))) continue;
				overrides.push({
					variable,
					value,
					...effect
				});
			}
			return overrides;
		};
		overrideEffect = (variable, value) => {
			switch (variable) {
				case "DYLD_LIBRARY_PATH": return {
					phase: "override",
					scope: "library"
				};
				case "DYLD_FRAMEWORK_PATH": return {
					phase: "override",
					scope: "framework"
				};
				case "DYLD_FALLBACK_LIBRARY_PATH": return {
					phase: "fallback",
					scope: "library"
				};
				case "DYLD_FALLBACK_FRAMEWORK_PATH": return {
					phase: "fallback",
					scope: "framework"
				};
				case "DYLD_VERSIONED_LIBRARY_PATH":
				case "DYLD_VERSIONED_FRAMEWORK_PATH":
				case "DYLD_IMAGE_SUFFIX": return /[^:]/u.test(value) ? {
					phase: "override",
					scope: "all"
				} : undefined;
				case "DYLD_INSERT_LIBRARIES": return value === "" ? undefined : {
					phase: "override",
					scope: "all"
				};
				case "DYLD_ROOT_PATH":
				case "DYLD_OVERLAY_PATH": return value === "" ? undefined : {
					phase: "override",
					scope: "prefix"
				};
				default: return undefined;
			}
		};
		isFrameworkInstallName = (name, overrides) => {
			const separator = name.lastIndexOf(".framework/");
			if (separator < 0) return false;
			const framework = name.slice(0, separator).split("/").at(-1);
			const leaf = name.slice(name.lastIndexOf("/") + 1);
			return leaf === framework || overrides.some(({ variable, value }) => variable === "DYLD_IMAGE_SUFFIX" && leaf === `${framework}${value}`);
		};
		hasApplicableDyldOverrides = (overrides, installName, ordinarySearchFoundImage) => {
			const kind = isFrameworkInstallName(installName, overrides) ? "framework" : "library";
			return overrides.some(({ phase, scope }) => (phase === "override" || !ordinarySearchFoundImage) && (scope === "all" || scope === kind || scope === "prefix" && !installName.startsWith("@")));
		};
	})))();
}

//#endregion
//#region dist/domain/apple/dylibResolutionFindings.js
var deriveFindings, unresolvedFinding, DYLIB_RESOLUTION_LIMITATIONS;
function init_dylibResolutionFindings() {
	return (init_dylibResolutionFindings = __esmMin((() => {
		deriveFindings = (edges, roots) => {
			const findings = [];
			edges.forEach((edge, index) => {
				if (edge.resolution.status === "unresolved") findings.push(unresolvedFinding(edge, index));
				const resolvedAt = edge.candidates.findIndex(({ outcome }) => outcome === "resolved");
				const earlier = edge.candidates.slice(0, Math.max(resolvedAt, 0)).filter(({ source, outcome }) => source === "rpath" && outcome === "absent").map(({ path }) => path);
				if (resolvedAt > 0 && earlier.length > 0) findings.push({
					kind: "earlier-rpath-candidate-absent",
					edge_index: index,
					image: edge.loader,
					basis: "derived",
					explanation: `The modeled dyld search checks ${earlier.join(", ")} before ${edge.resolution.image ?? edge.install_name}. A compatible Mach-O placed at an earlier modeled path could take precedence over that fallback, subject to unmodeled search inputs and code-signing library validation; library validation is not evaluated here (see inspect_signature).${edge.loader_conditional ? " This loader loads only conditionally; if it never loads, this search never occurs." : ""}${edge.resolution.status === "conditional" ? " Unmodeled environment overrides or earlier unknown candidates may take precedence; placing an image at this rpath does not establish which image dyld will load." : ""}`
				});
			});
			for (const { image, slice } of roots) {
				const { architecture } = slice;
				const environment = slice.dyld_environment;
				if (environment.length > 0) findings.push({
					kind: "dyld-environment-present",
					edge_index: null,
					image,
					basis: "derived",
					explanation: slice.file_type === "execute" ? `${image} (${architecture}) sets dyld environment variables through LC_DYLD_ENVIRONMENT (${environment.join(", ")}); any image-selection overrides they request are not modeled. Diagnostic settings alone do not alter resolution.` : `${image} (${architecture}) contains LC_DYLD_ENVIRONMENT (${environment.join(", ")}). Dyld reads these commands only from the main executable; entries in this non-executable root are observations and do not alter resolution.`
				});
			}
			return findings;
		};
		unresolvedFinding = (edge, index) => {
			const base = {
				edge_index: index,
				image: edge.loader,
				basis: "derived"
			};
			const missing = `No candidate for ${edge.command === "LC_LAZY_LOAD_DYLIB" ? "lazily loaded " : edge.weak ? "weak dependency " : ""}${edge.install_name} exists in the analyzed root`;
			const when = edge.loader_conditional ? `. ${edge.loader} loads only conditionally; if it loads, ` : "; ";
			if (edge.command === "LC_LAZY_LOAD_DYLIB") return {
				...base,
				kind: "lazy-load-unresolved",
				explanation: `${missing}${when}dyld loads it on first use, which would fail unless the image is supplied elsewhere.`
			};
			return edge.weak ? {
				...base,
				kind: "weak-load-unresolved",
				explanation: `${missing}${when}dyld continues without it.`
			} : {
				...base,
				kind: "required-load-unresolved",
				explanation: `${missing}${when}dyld would fail to load this required dependency for ${edge.root} (${edge.architecture}) unless the image is supplied elsewhere.`
			};
		};
		DYLIB_RESOLUTION_LIMITATIONS = [
			"LC_LAZY_LOAD_DYLIB dependencies are resolved but not traversed, because dyld loads them only on first use.",
			"Slices are matched by dyld's graded architectures (an x86_64h process also loads x86_64). arm64e processes that disable pointer authentication can also load arm64 slices; that fallback is not modeled.",
			"Absolute install names and rpaths are outside the analyzed root and are not evaluated, including /System and /usr/lib libraries that the dyld shared cache usually provides.",
			"Leaf and relative install names depend on dyld fallback paths, DYLD_* variables, and the working directory; they are undetermined.",
			"Load order follows dyld's dependents-first traversal in load-command order. An image reached through several chains is resolved once per process, with the rpath stack and conditionality of the first chain; a later @rpath request whose install name matches an already loaded image reuses it.",
			"@loader_path uses each image's symlink-resolved path within the analyzed root.",
			"Code-signing checks that can reject a found image, such as library validation and the hardened runtime, are not evaluated.",
			"Dylib compatibility versions are not compared. Apple's linker documentation describes a load-time rejection when an image's compatibility version is older than the loader requires, but dyld on macOS 26 was observed to load such an image."
		];
	})))();
}

//#endregion
//#region dist/domain/apple/dylibResolution.js
var ROOT_RELATIVE_PATH, rootRelativePathSchema, dylibResolutionInputSchema, dependencyCommandSchema, dependencySchema, machoSliceSchema, candidateSchema, edgeSchema, findingSchema$1, imageSchema, dylibResolutionResultSchema, candidateTemplates, evaluateCandidate, platformLoadability, imageLoadabilityForPlatform, isKnownPlatform, imageFacts, resolution, resolveDependency, traceProcess, traceDylibLoading, withoutDependencies, compare;
function init_dylibResolution() {
	return (init_dylibResolution = __esmMin((() => {
		init_dyldPaths();
		init_digests();
		init_dyldEnvironment();
		init_dylibResolutionFindings();
		ROOT_RELATIVE_PATH = /^(?:[^\x2f\\\x00.][^\x2f\\\x00]*|\.[^\x2f\\\x00.][^\x2f\\\x00]*|\.\.[^\x2f\\\x00]+)(?:\x2f(?:[^\x2f\\\x00.][^\x2f\\\x00]*|\.[^\x2f\\\x00.][^\x2f\\\x00]*|\.\.[^\x2f\\\x00]+))*$/u;
		rootRelativePathSchema = z.string().min(1).regex(ROOT_RELATIVE_PATH, "Use a normalized path relative to the analyzed root, without a leading or trailing '/', '//', or '.' and '..' segments");
		dylibResolutionInputSchema = z.strictObject({
			roots: z.array(rootRelativePathSchema).min(1).optional(),
			architecture: z.enum([
				"arm64",
				"arm64e",
				"x86_64"
			]).optional()
		});
		dependencyCommandSchema = z.enum([
			"LC_LOAD_DYLIB",
			"LC_LOAD_WEAK_DYLIB",
			"LC_REEXPORT_DYLIB",
			"LC_LAZY_LOAD_DYLIB",
			"LC_LOAD_UPWARD_DYLIB"
		]);
		dependencySchema = z.strictObject({
			command: dependencyCommandSchema,
			encoding: z.enum(["dylib_command", "dylib_use_command"]),
			install_name: z.string(),
			weak: z.boolean(),
			upward: z.boolean(),
			reexport: z.boolean(),
			delayed_init: z.boolean(),
			current_version: z.string(),
			compatibility_version: z.string()
		});
		machoSliceSchema = z.strictObject({
			architecture: z.string().min(1),
			/** Physical identity observed in the thin header and, for FAT, its table. */
			slice_offset: z.number().int().nonnegative(),
			slice_size: z.number().int().positive(),
			cpu_type: z.number().int().nonnegative(),
			cpu_subtype: z.number().int().nonnegative(),
			fat_cpu_type: z.number().int().nonnegative().nullable(),
			fat_cpu_subtype: z.number().int().nonnegative().nullable(),
			fat_alignment_exponent: z.number().int().nonnegative().nullable(),
			file_type: z.enum([
				"execute",
				"dylib",
				"bundle",
				"other"
			]),
			file_type_code: z.number().int().nonnegative(),
			/** Raw LC_BUILD_VERSION platform number; null means no such command was observed. */
			platform: z.number().int().nonnegative().nullable(),
			/** Every distinct build platform declared by LC_BUILD_VERSION/version-min commands. */
			platforms: z.array(z.number().int().nonnegative()),
			install_name: z.string().nullable(),
			dependencies: z.array(dependencySchema),
			rpaths: z.array(z.string()),
			dyld_environment: z.array(z.string()),
			code_signature_present: z.boolean()
		});
		candidateSchema = z.strictObject({
			path: z.string(),
			source: z.enum([
				"literal",
				"executable_path",
				"loader_path",
				"rpath",
				"already-loaded"
			]),
			rpath: z.string().nullable(),
			rpath_owner: z.string().nullable(),
			outcome: z.enum([
				"resolved",
				"absent",
				"not-mach-o",
				"malformed",
				"unsupported",
				"architecture-missing",
				"not-loadable",
				"platform-mismatch",
				"outside-target",
				"escapes-target",
				"undetermined"
			]),
			resolved_path: z.string().nullable()
		});
		edgeSchema = z.strictObject({
			root: z.string(),
			architecture: z.string(),
			loader: z.string(),
			via: z.array(z.string()),
			...dependencySchema.shape,
			candidates: z.array(candidateSchema),
			resolution: z.strictObject({
				status: z.enum([
					"resolved",
					"conditional",
					"unresolved",
					"undetermined"
				]),
				image: z.string().nullable()
			}),
			install_name_matches: z.boolean().nullable(),
			/**
			* The loader was reached through a conditional edge, so it might not load;
			* this edge describes what happens only if it does.
			*/
			loader_conditional: z.boolean()
		});
		findingSchema$1 = z.strictObject({
			kind: z.enum([
				"required-load-unresolved",
				"weak-load-unresolved",
				"lazy-load-unresolved",
				"earlier-rpath-candidate-absent",
				"dyld-environment-present"
			]),
			edge_index: z.number().int().nonnegative().nullable(),
			image: z.string().nullable(),
			basis: z.literal("derived"),
			explanation: z.string().min(1)
		});
		imageSchema = z.strictObject({
			path: z.string(),
			sha256: digestSchema,
			parse_status: z.enum([
				"parsed",
				"malformed",
				"unsupported"
			]),
			reason: z.string().nullable(),
			slices: z.array(machoSliceSchema.omit({ dependencies: true }))
		});
		dylibResolutionResultSchema = z.strictObject({
			root_path: z.string(),
			target_sha256: digestSchema,
			roots: z.array(z.strictObject({
				image: z.string(),
				architecture: z.string()
			})),
			images: z.array(imageSchema),
			edges: z.array(edgeSchema),
			findings: z.array(findingSchema$1),
			coverage: z.strictObject({
				status: z.enum(["complete", "partial"]),
				unparsed_images: z.array(z.string()),
				roots_without_architecture: z.array(z.string())
			}),
			limitations: z.array(z.string().min(1))
		});
		candidateTemplates = (dependency, loader, context) => {
			const name = dependency.install_name;
			if (!name.startsWith("@rpath/")) {
				const source = name.startsWith("@executable_path") ? "executable_path" : name.startsWith("@loader_path") ? "loader_path" : "literal";
				return [{
					expansion: expandPrefix(name, {
						ownerDirectory: directoryOf(loader),
						executable: context.executable
					}),
					source,
					rpath: null,
					rpathOwner: null
				}];
			}
			const rest = name.slice("@rpath/".length);
			const owners = [...context.loaded.get(loader)?.chain ?? [loader]].reverse();
			return owners.flatMap((owner) => (context.loaded.get(owner)?.slice.rpaths ?? []).map((rpath) => {
				const base = expandPrefix(rpath, {
					ownerDirectory: directoryOf(owner),
					executable: context.executable
				});
				const expansion = {
					scope: base.scope,
					path: base.scope === "outside" ? `${base.path.replace(/\/+$/u, "")}/${rest}` : `${base.path}${base.path === "" ? "" : "/"}${rest}`
				};
				return {
					expansion,
					source: "rpath",
					rpath,
					rpathOwner: owner
				};
			}));
		};
		evaluateCandidate = async (template, context) => {
			const base = {
				path: template.expansion.path,
				source: template.source,
				rpath: template.rpath,
				rpath_owner: template.rpathOwner
			};
			if (template.expansion.scope === "outside") return {
				...base,
				outcome: "outside-target",
				resolved_path: null
			};
			if (template.expansion.scope === "undetermined") return {
				...base,
				outcome: "undetermined",
				resolved_path: null
			};
			const lookup = await resolveTreePath(context.view, template.expansion.path);
			if (lookup.kind === "escapes") return {
				...base,
				outcome: "escapes-target",
				resolved_path: null
			};
			if (lookup.kind !== "file") return {
				...base,
				outcome: "absent",
				resolved_path: null
			};
			const facts = await imageFacts(context, lookup.path);
			let outcome;
			if (facts.status !== "parsed") outcome = facts.status;
			else {
				const slice = compatibleSlice(facts.slices, context.processIdentity);
				if (slice === undefined) outcome = "architecture-missing";
				else if (slice.file_type_code !== 6) outcome = "not-loadable";
				else {
					const platformResult = platformLoadability(context.platforms, slice.platforms, slice.file_type_code, context.processIdentity.architecture);
					outcome = platformResult === "compatible" ? "resolved" : platformResult === "incompatible" ? "platform-mismatch" : "undetermined";
				}
			}
			return {
				...base,
				outcome,
				resolved_path: lookup.path
			};
		};
		platformLoadability = (processPlatforms, imagePlatforms, fileType, architecture) => {
			if (processPlatforms.length === 0 || imagePlatforms.length === 0) return "unknown";
			const outcomes = processPlatforms.map((processPlatform) => imageLoadabilityForPlatform(processPlatform, imagePlatforms, fileType, architecture));
			if (outcomes.every((outcome) => outcome === "compatible")) return "compatible";
			if (outcomes.every((outcome) => outcome === "incompatible")) return "incompatible";
			return "unknown";
		};
		imageLoadabilityForPlatform = (processPlatform, imagePlatforms, fileType, architecture) => {
			if (imagePlatforms.includes(processPlatform)) return "compatible";
			if (processPlatform === 6 && imagePlatforms.includes(1)) return "compatible";
			if (processPlatform === 2 && imagePlatforms.includes(6)) return "compatible";
			if (processPlatform === 2 && imagePlatforms.includes(11)) return "compatible";
			if (processPlatform === 7 && imagePlatforms.includes(12)) return "compatible";
			if (processPlatform === 1 && fileType === 2 && imagePlatforms.includes(6)) return "compatible";
			if (processPlatform === 2 && imagePlatforms.includes(1) && architecture.startsWith("arm64") || [
				7,
				8,
				9
			].includes(processPlatform) && imagePlatforms.includes(1)) return "unknown";
			if (isKnownPlatform(processPlatform) && imagePlatforms.every(isKnownPlatform)) return "incompatible";
			return "unknown";
		};
		isKnownPlatform = (platform) => platform >= 1 && platform <= 12;
		imageFacts = async (context, path) => {
			const known = context.images.get(path);
			if (known !== undefined) return known;
			const facts = await context.view.image(path);
			context.images.set(path, facts);
			return facts;
		};
		resolution = (candidates) => {
			let external = false;
			for (const candidate of candidates) {
				if (candidate.outcome === "resolved") return {
					status: external ? "conditional" : "resolved",
					image: candidate.resolved_path
				};
				if (candidate.outcome === "outside-target" || candidate.outcome === "escapes-target" || candidate.outcome === "unsupported" || candidate.outcome === "undetermined") external = true;
			}
			return {
				status: external ? "undetermined" : "unresolved",
				image: null
			};
		};
		resolveDependency = async (dependency, loader, context) => {
			const current = context.loaded.get(loader);
			const chain = current?.chain ?? [loader];
			const loaded = dependency.install_name.startsWith("@rpath/") ? context.byInstallName.get(dependency.install_name) : undefined;
			const candidates = [];
			if (loaded !== undefined) candidates.push({
				path: dependency.install_name,
				source: "already-loaded",
				rpath: null,
				rpath_owner: null,
				outcome: "resolved",
				resolved_path: loaded
			});
			else for (const template of candidateTemplates(dependency, loader, context)) {
				const candidate = await evaluateCandidate(template, context);
				candidates.push(candidate);
				if (candidate.outcome === "resolved") break;
			}
			const modeled = resolution(candidates);
			const searchUnknown = loaded === undefined && hasApplicableDyldOverrides(context.searchOverrides, dependency.install_name, modeled.image !== null);
			if (searchUnknown) context.environmentRoots.add(context.root);
			const searched = searchUnknown ? {
				...modeled,
				status: modeled.image === null ? "undetermined" : "conditional"
			} : modeled;
			const resolved = loaded !== undefined && context.loaded.get(loaded)?.conditional === true && searched.status === "resolved" ? {
				...searched,
				status: "conditional"
			} : searched;
			const image = resolved.image === null ? undefined : context.images.get(resolved.image);
			const slice = image?.status === "parsed" ? compatibleSlice(image.slices, context.processIdentity) : undefined;
			return {
				root: context.root,
				architecture: context.processIdentity.architecture,
				loader,
				via: [...chain],
				...dependency,
				candidates,
				resolution: resolved,
				install_name_matches: slice === undefined || slice.install_name === null ? null : slice.install_name === dependency.install_name,
				loader_conditional: current?.conditional ?? false
			};
		};
		traceProcess = async (context, rootSlice, signal) => {
			const edges = [];
			context.loaded.set(context.root, {
				slice: rootSlice,
				chain: [context.root],
				conditional: false
			});
			if (rootSlice.install_name !== null && rootSlice.install_name.startsWith("@rpath/")) context.byInstallName.set(rootSlice.install_name, context.root);
			const pending = [context.root];
			while (pending.length > 0) {
				signal?.throwIfAborted();
				const loader = pending.pop() ?? "";
				const current = context.loaded.get(loader);
				if (current === undefined) continue;
				const created = [];
				for (const dependency of current.slice.dependencies) {
					const edge = await resolveDependency(dependency, loader, context);
					edges.push(edge);
					if (dependency.command === "LC_LAZY_LOAD_DYLIB") continue;
					const image = edge.resolution.image;
					if (image === null || context.loaded.has(image)) continue;
					const facts = context.images.get(image);
					const slice = facts?.status === "parsed" ? compatibleSlice(facts.slices, context.processIdentity) : undefined;
					if (slice === undefined) continue;
					context.loaded.set(image, {
						slice,
						chain: [...current.chain, image],
						conditional: current.conditional || edge.resolution.status === "conditional"
					});
					if (slice.install_name !== null && slice.install_name.startsWith("@rpath/") && !context.byInstallName.has(slice.install_name)) context.byInstallName.set(slice.install_name, image);
					created.push(image);
				}
				pending.push(...created.reverse());
			}
			return edges;
		};
		traceDylibLoading = async (view, request) => {
			const images = new Map();
			for (const path of request.unclassified ?? []) images.set(path, await view.image(path));
			const roots = [];
			const rootSlices = [];
			const edges = [];
			const withoutArchitecture = [];
			const environmentRoots = new Set();
			for (const root of request.roots) {
				const facts = await view.image(root);
				images.set(root, facts);
				if (facts.status !== "parsed") continue;
				const slices = facts.slices.filter(({ architecture }) => request.architecture === undefined || architecture === request.architecture);
				if (slices.length === 0) withoutArchitecture.push(root);
				for (const slice of slices) {
					const executable = slice.file_type === "execute" ? root : null;
					const searchOverrides = executable === null ? [] : embeddedDyldOverrides(slice.dyld_environment, slice.platforms);
					if (searchOverrides.some(({ variable, value }) => variable === "DYLD_INSERT_LIBRARIES" && value !== "")) environmentRoots.add(root);
					roots.push({
						image: root,
						architecture: slice.architecture
					});
					rootSlices.push({
						image: root,
						slice
					});
					edges.push(...await traceProcess({
						view,
						root,
						processIdentity: {
							architecture: slice.architecture,
							cpu_type: slice.cpu_type,
							cpu_subtype: slice.cpu_subtype
						},
						searchOverrides,
						environmentRoots,
						platforms: slice.platforms,
						executable,
						loaded: new Map(),
						byInstallName: new Map(),
						images
					}, slice, request.signal));
				}
			}
			const reported = [...images.entries()].filter(([, facts]) => facts.status !== "not-mach-o").sort(([left], [right]) => compare(left, right));
			const unparsed = reported.filter(([, facts]) => facts.status !== "parsed").map(([path]) => path);
			return {
				roots,
				images: reported.map(([path, facts]) => ({
					path,
					parse_status: facts.status === "not-mach-o" ? "unsupported" : facts.status,
					reason: facts.status === "parsed" || facts.status === "not-mach-o" ? null : facts.reason,
					slices: facts.status === "parsed" ? facts.slices.map(withoutDependencies) : []
				})),
				edges,
				findings: deriveFindings(edges, rootSlices),
				coverage: {
					status: unparsed.length === 0 && withoutArchitecture.length === 0 && environmentRoots.size === 0 ? "complete" : "partial",
					unparsed_images: unparsed,
					roots_without_architecture: withoutArchitecture
				},
				limitations: [...DYLIB_RESOLUTION_LIMITATIONS, ...environmentRoots.size === 0 ? [] : [`Roots ${[...environmentRoots].join(", ")} request applicable image-selection inputs through LC_DYLD_ENVIRONMENT that are not modeled; affected dependencies or inserted images remain uncertain.`]]
			};
		};
		withoutDependencies = (slice) => ({
			architecture: slice.architecture,
			slice_offset: slice.slice_offset,
			slice_size: slice.slice_size,
			cpu_type: slice.cpu_type,
			cpu_subtype: slice.cpu_subtype,
			fat_cpu_type: slice.fat_cpu_type,
			fat_cpu_subtype: slice.fat_cpu_subtype,
			fat_alignment_exponent: slice.fat_alignment_exponent,
			file_type: slice.file_type,
			file_type_code: slice.file_type_code,
			platform: slice.platform,
			platforms: slice.platforms,
			install_name: slice.install_name,
			rpaths: slice.rpaths,
			dyld_environment: slice.dyld_environment,
			code_signature_present: slice.code_signature_present
		});
		compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
	})))();
}

//#endregion
//#region dist/domain/apple/keyedArchive.js
var KeyedArchiveKindError, keyedArchiveInputSchema, linkSchema, keyedArchiveResultSchema, record, uid, archiverMismatch, projectKeyedArchive;
function init_keyedArchive() {
	return (init_keyedArchive = __esmMin((() => {
		init_analysisErrorCore();
		init_jsonValue();
		KeyedArchiveKindError = class extends TypeError {
			kind;
			name = "KeyedArchiveKindError";
			constructor(message, kind) {
				super(message);
				this.kind = kind;
			}
		};
		keyedArchiveInputSchema = z.strictObject({
			path: z.string().min(1).default("."),
			root: z.string().optional(),
			offset: z.number().int().min(0).default(0),
			limit: z.number().int().min(1).max(2e4).default(2e4)
		});
		linkSchema = z.strictObject({
			source: z.number().int().nonnegative().nullable(),
			path: z.array(z.union([z.string(), z.number().int().nonnegative()])),
			target: z.number().int().nonnegative().nullable(),
			status: z.enum([
				"resolved",
				"nil",
				"unresolved",
				"malformed"
			]),
			raw: jsonValueSchema
		});
		keyedArchiveResultSchema = z.strictObject({
			target_sha256: z.string(),
			archive_path: z.string(),
			archive_sha256: z.string(),
			archive_format: z.enum(["binary-plist", "xml-plist"]),
			roots: z.record(z.string(), jsonValueSchema),
			objects: z.array(z.strictObject({
				id: z.number().int().nonnegative(),
				kind: z.enum([
					"nil",
					"scalar",
					"array",
					"dictionary",
					"class-descriptor",
					"archived-object"
				]),
				class_id: z.number().int().nonnegative().nullable(),
				class_name: z.string().nullable(),
				status: z.enum([
					"observed",
					"unknown-class",
					"unresolved-class",
					"nil"
				]),
				value: jsonValueSchema
			})),
			references: z.array(linkSchema),
			total_objects: z.number().int().nonnegative(),
			total_references: z.number().int().nonnegative(),
			offset: z.number().int().nonnegative(),
			next_offset: z.number().int().nonnegative().nullable(),
			truncated: z.boolean(),
			limitations: z.array(z.string())
		});
		record = (value) => value !== null && typeof value === "object" && !Array.isArray(value) ? value : undefined;
		uid = (value) => {
			const object = record(value);
			if (object === undefined || Object.keys(object).length !== 1) return undefined;
			const marker = Object.hasOwn(object, "UID") ? object.UID : object["CF$UID"];
			return typeof marker === "number" ? marker : undefined;
		};
		archiverMismatch = (archive) => {
			if (archive === undefined) return "its root is not a dictionary";
			if (!Object.hasOwn(archive, "$archiver")) return "it has no $archiver key";
			return typeof archive.$archiver === "string" ? `its $archiver is ${JSON.stringify(archive.$archiver)}` : "its $archiver is not a string";
		};
		projectKeyedArchive = (value, selection) => {
			const archive = record(jsonValueSchema.parse(value));
			if (archive?.$archiver !== "NSKeyedArchiver") throw new KeyedArchiveKindError(`Selected property list is not an NSKeyedArchiver archive: ${archiverMismatch(archive)}`, "property-list");
			if (!Array.isArray(archive.$objects)) throw new TypeError("Expected NSKeyedArchiver with an $objects array");
			const table = archive.$objects;
			if (table.length > 2e5) throw new RangeError("Archive exceeds 200000 object-table entries");
			const top = record(archive.$top);
			if (top === undefined || Object.keys(top).length === 0) throw new TypeError("Keyed archive has no $top roots");
			if (selection.root !== undefined && !Object.hasOwn(top, selection.root)) throw new AnalysisInputError("inspect_keyed_archive", undefined, [{
				path: ["root"],
				reason: "invalid_value",
				message: `Archive root does not exist: ${selection.root}. Select one of the archive's $top roots or omit root.`,
				expected: Object.keys(top)
			}]);
			const roots = selection.root === undefined ? top : { [selection.root]: top[selection.root] ?? null };
			const references = [];
			const scan = (source, initial) => {
				const pending = [{
					value: initial,
					path: []
				}];
				let visited = 0;
				while (pending.length > 0) {
					const item = pending.pop();
					if (item === undefined) break;
					if (++visited > 2e5 || item.path.length > 128) throw new RangeError("Archive exceeds 200000 values per object or 128 nesting levels");
					const target = uid(item.value);
					if (target !== undefined) {
						const index = Number.isSafeInteger(target) && target >= 0 ? target : null;
						references.push({
							source,
							path: item.path,
							target: index,
							raw: item.value,
							status: index === null ? "malformed" : index >= table.length ? "unresolved" : index === 0 && table[0] === "$null" ? "nil" : "resolved"
						});
					} else if (Array.isArray(item.value)) {
						for (let index = item.value.length - 1; index >= 0; index--) {
							const child = item.value[index];
							if (child !== undefined) pending.push({
								value: child,
								path: [...item.path, index]
							});
						}
					} else {
						const fields = record(item.value);
						if (fields !== undefined) for (const key of Object.keys(fields).sort().reverse()) {
							const child = fields[key];
							if (child !== undefined) pending.push({
								value: child,
								path: [...item.path, key]
							});
						}
					}
					if (references.length > 2e5) throw new RangeError("Archive exceeds 200000 reference edges");
				}
			};
			scan(null, roots);
			const objects = table.map((value, id) => {
				scan(id, value);
				const fields = record(value);
				const classUid = uid(fields?.$class);
				const classId = classUid !== undefined && Number.isSafeInteger(classUid) && classUid >= 0 ? classUid : null;
				const descriptor = classId === null ? undefined : record(table[classId]);
				const className = typeof descriptor?.$classname === "string" ? descriptor.$classname : null;
				const isNil = id === 0 && value === "$null";
				return {
					id,
					kind: isNil ? "nil" : Array.isArray(value) ? "array" : fields === undefined ? "scalar" : typeof fields.$classname === "string" ? "class-descriptor" : Object.hasOwn(fields, "$class") ? "archived-object" : "dictionary",
					class_id: classId,
					class_name: className,
					status: isNil ? "nil" : fields !== undefined && Object.hasOwn(fields, "$class") ? className === null ? "unresolved-class" : "unknown-class" : "observed",
					value
				};
			});
			const end = Math.min(objects.length, selection.offset + selection.limit);
			const page = objects.slice(selection.offset, end);
			const ids = new Set(page.map(({ id }) => id));
			return {
				roots,
				objects: page,
				references: references.filter(({ source }) => source === null || ids.has(source)),
				total_objects: objects.length,
				total_references: references.length,
				offset: selection.offset,
				next_offset: end < objects.length ? end : null,
				truncated: page.length !== objects.length,
				limitations: [
					"Archive classes are never instantiated. Class names and serialized fields are observed; class-specific semantics are unknown.",
					"Conditional references serialized as UID 0 cannot be distinguished from ordinary nil references. Missing fields remain absent in the raw serialized value.",
					"Root selection selects the named $top entry; object pagination retains original indices and does not recursively expand references."
				]
			};
		};
	})))();
}

//#endregion
//#region dist/domain/apple/appleAssetCatalog.js
var RESOURCE_KEY_FIELDS, appleResourceKeyFields, appleAssetCatalogInputSchema, catalogSchema, recordSchema, resourceKeyMatchSchema, appleAssetCatalogResultSchema, parseAppleAssetCatalogRecords, projectAppleAssetCatalogPage;
function init_appleAssetCatalog() {
	return (init_appleAssetCatalog = __esmMin((() => {
		init_jsonValue();
		init_analysisErrorCore();
		RESOURCE_KEY_FIELDS = new Set([
			"image",
			"imageName",
			"image_name",
			"resourceName",
			"resource_name",
			"assetName",
			"asset_name",
			"UIImageName",
			"NSImageName"
		]);
		appleResourceKeyFields = (attributes) => Object.entries(attributes).filter((entry) => RESOURCE_KEY_FIELDS.has(entry[0]) && typeof entry[1] === "string" && entry[1].length > 0);
		appleAssetCatalogInputSchema = z.strictObject({
			offset: z.number().int().min(0).default(0),
			limit: z.number().int().min(1).max(1e4).default(1e3)
		});
		catalogSchema = z.strictObject({
			path: z.string().min(1),
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			record_count: z.number().int().nonnegative()
		});
		recordSchema = z.strictObject({
			catalog_path: z.string().min(1),
			catalog_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			index: z.number().int().nonnegative(),
			kind: z.enum(["catalog", "rendition"]),
			asset_name: z.string().nullable(),
			rendition_name: z.string().nullable(),
			metadata: z.record(z.string(), jsonValueSchema)
		});
		resourceKeyMatchSchema = z.strictObject({
			source_node_id: z.string().min(1),
			source_path: z.string().min(1),
			source_archive_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			field: z.string().min(1),
			key: z.string().min(1),
			status: z.enum([
				"matched",
				"ambiguous",
				"unmatched"
			]),
			renditions: z.array(z.strictObject({
				catalog_path: z.string().min(1),
				catalog_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				record_index: z.number().int().nonnegative(),
				rendition_name: z.string().nullable()
			}))
		});
		appleAssetCatalogResultSchema = z.strictObject({
			target_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			catalogs: z.array(catalogSchema),
			total_records: z.number().int().nonnegative(),
			offset: z.number().int().nonnegative(),
			limit: z.number().int().positive(),
			records: z.array(recordSchema),
			resource_key_matches: z.array(resourceKeyMatchSchema),
			next_offset: z.number().int().nonnegative().nullable(),
			truncated: z.boolean(),
			limitations: z.array(z.string())
		});
		parseAppleAssetCatalogRecords = (value) => {
			if (!Array.isArray(value)) throw new AnalysisOutputError("inspect_asset_catalog", "assetutil output must be a JSON array");
			return value.map((record, index) => {
				const parsed = z.record(z.string(), jsonValueSchema).safeParse(record);
				if (!parsed.success) throw new AnalysisOutputError("inspect_asset_catalog", `assetutil record ${index} is not a JSON object`, { cause: parsed.error });
				return parsed.data;
			});
		};
		projectAppleAssetCatalogPage = (input) => {
			const all = input.catalogs.flatMap((catalog) => catalog.records.map((metadata, index) => ({
				catalog_path: catalog.path,
				catalog_sha256: catalog.sha256,
				index,
				kind: typeof metadata.RenditionName === "string" || typeof metadata.Name === "string" ? "rendition" : "catalog",
				asset_name: typeof metadata.Name === "string" ? metadata.Name : null,
				rendition_name: typeof metadata.RenditionName === "string" ? metadata.RenditionName : null,
				metadata
			})));
			const records = all.slice(input.offset, input.offset + input.limit);
			const next = input.offset + records.length;
			const recordsByAssetName = new Map();
			for (const record of all) {
				if (record.kind !== "rendition" || record.asset_name === null) continue;
				const matches = recordsByAssetName.get(record.asset_name) ?? [];
				matches.push(record);
				recordsByAssetName.set(record.asset_name, matches);
			}
			const resourceKeyMatches = (input.resourceReferences ?? []).map((source) => {
				const matches = recordsByAssetName.get(source.key) ?? [];
				return {
					source_node_id: source.sourceNodeId,
					source_path: source.sourcePath,
					source_archive_sha256: source.sourceArchiveSha256,
					field: source.field,
					key: source.key,
					status: matches.length === 0 ? "unmatched" : matches.length === 1 ? "matched" : "ambiguous",
					renditions: matches.map((record) => ({
						catalog_path: record.catalog_path,
						catalog_sha256: record.catalog_sha256,
						record_index: record.index,
						rendition_name: record.rendition_name
					}))
				};
			});
			return appleAssetCatalogResultSchema.parse({
				target_sha256: input.targetSha256,
				catalogs: input.catalogs.map(({ path, sha256, records: catalogRecords }) => ({
					path,
					sha256,
					record_count: catalogRecords.length
				})),
				total_records: all.length,
				offset: input.offset,
				limit: input.limit,
				records,
				resource_key_matches: resourceKeyMatches,
				next_offset: next < all.length ? next : null,
				truncated: input.offset > 0 || next < all.length,
				limitations: ["Rendition metadata is reported as emitted by the installed assetutil version; private fields and platform-specific interpretations are not normalized.", "Asset catalog inspection does not decode or extract rendition image bytes."]
			});
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedMemberComparisonCoverage.js
var buildComparisonCoverage, sameSelection, sideCoverageStatus, sideManifest, buildComparisonSummary, buildComparisonMatching, comparisonLimitations;
function init_managedMemberComparisonCoverage() {
	return (init_managedMemberComparisonCoverage = __esmMin((() => {
		buildComparisonCoverage = ({ left, right }) => {
			const leftStatus = sideCoverageStatus(left);
			const rightStatus = sideCoverageStatus(right);
			const unknownInput = left.coverage.state !== "complete" || right.coverage.state !== "complete" || !sameSelection(left, right);
			return {
				status: !unknownInput && leftStatus === "complete" && rightStatus === "complete" ? "complete-within-inputs" : "partial",
				left_status: leftStatus,
				right_status: rightStatus
			};
		};
		sameSelection = (left, right) => {
			if (left.selection === null || right.selection === null) return left.selection === right.selection;
			const rightNames = new Set(right.selection.type_names);
			return rightNames.size === new Set(left.selection.type_names).size && left.selection.type_names.every((name) => rightNames.has(name));
		};
		sideCoverageStatus = (result) => result.coverage.state === "unavailable" ? "unavailable" : result.coverage.state === "complete" ? "complete" : "partial";
		sideManifest = (side) => ({
			evidence_id: side.evidenceId,
			artifact_sha256: side.result.artifact.sha256,
			mvid: side.result.module?.mvid ?? null,
			module_name: side.result.module?.name ?? null,
			metadata_status: side.result.metadata.status,
			methods_total: side.result.methods.length,
			fields_total: side.result.fields.length
		});
		buildComparisonSummary = (items) => ({
			unchanged: items.filter(({ status }) => status === "unchanged").length,
			changed: items.filter(({ status }) => status === "changed").length,
			added: items.filter(({ status }) => status === "added").length,
			removed: items.filter(({ status }) => status === "removed").length,
			unknown: items.filter(({ status }) => status === "unknown").length
		});
		buildComparisonMatching = (methodItems, fieldItems) => ({
			exact_il_signature: methodItems.filter(({ match }) => match.basis === "exact-il-signature").length,
			exact_signature: [...methodItems, ...fieldItems].filter(({ match }) => match.basis === "exact-signature").length,
			structural_method_shape: methodItems.filter(({ match }) => match.basis === "structural-method-shape").length,
			field_signature: fieldItems.filter(({ match }) => match.basis === "field-signature").length,
			ambiguous: methodItems.filter(({ match }) => match.status === "ambiguous").length + fieldItems.filter(({ match }) => match.status === "ambiguous").length,
			unmatched: [...methodItems, ...fieldItems].filter(({ match }) => match.status === "unmatched").length
		});
		comparisonLimitations = (left, right) => {
			const limitations = [
				"Metadata tokens are build-local coordinates; matched pairs are remaps, not persistent identities.",
				"Methods pair within one declared type and name by exact CIL/signature, then signature, then structural shape; only then may exact CIL/signature or structural shape alone remap across declared types or names, never taking a member whose own declared type and name remain unpaired on the other side or whose declaring type is unresolved. Names alone are never a matching basis.",
				"Fields pair by declared type, name, and signature, then remap by exact decoded signature alone under the same rule; an undecoded signature is compared only by its raw bytes, and an unmatched member with one stays unknown."
			];
			if (left.coverage.state !== "complete" || right.coverage.state !== "complete") limitations.push("At least one managed member observation is partial.");
			if (!sameSelection(left, right)) limitations.push("The observations select different declaring types; a member outside the other side's selection is unknown, not added or removed.");
			else if (left.selection !== null) limitations.push(`Both observations cover only the selected declaring types (${left.selection.type_names.join(", ")}); member totals and statuses describe those types, not the whole assembly.`);
			if (left.exported_types === null || right.exported_types === null) limitations.push("At least one managed member observation predates ExportedType inspection; its exported and forwarded types are unknown.");
			if ((left.exported_types?.length ?? 0) > 0 || (right.exported_types?.length ?? 0) > 0) limitations.push("ExportedType rows, including type forwarders, are observed but not compared; an unchanged comparison does not establish an unchanged exported or forwarded type set.");
			limitations.push("ldstr literals are not compared; normalized CIL keeps #US tokens rather than decoded text, so an unchanged method does not establish unchanged string literals.");
			return limitations;
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedMemberComparisonMatch.js
var sha256$1, keyMethod, keyField, matchMethods, matchFields, identityOf, declaredAs, matchByKeys, unresolvedSignatureAmbiguities, unpairedOf, competitionIdentityKey, ownerlessContested, remappable, ownerlessDeclarable, groupBy, observedBy, matchObserved, keyMembers, parseManagedMemberEvidence;
function init_managedMemberComparisonMatch() {
	return (init_managedMemberComparisonMatch = __esmMin((() => {
		init_managedArtifact();
		init_managedInspectionEvidence();
		sha256$1 = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Managed comparison canonicalization failed");
			return createHash("sha256").update(serialized).digest("hex");
		};
		keyMethod = (item) => ({
			item,
			identity: identityOf(item),
			rawSignatureKey: item.signature.raw_sha256,
			exactKey: item.body.status === "present" && item.body.il_sha256 !== null && item.body.normalized_il_sha256 !== null ? sha256$1([
				"method-exact",
				item.signature.raw_sha256,
				item.body.il_sha256,
				item.body.normalized_il_sha256
			]) : null,
			signatureKey: sha256$1([
				"method-signature",
				item.declaring_type,
				item.name,
				item.signature.raw_sha256
			]),
			structuralKey: item.signature.parse_status === "decoded" && item.body.status === "present" ? sha256$1([
				"method-structural",
				item.signature.kind,
				item.signature.calling_convention,
				item.signature.generic_parameter_count,
				item.signature.parameter_count,
				item.signature.return_type,
				item.signature.parameter_types,
				item.body.status,
				item.body.header_format,
				item.body.il_size,
				item.body.max_stack,
				item.body.init_locals,
				item.body.opcode_counts,
				item.body.anchors.map(({ opcode, operand_kind, operand }) => [
					opcode,
					operand_kind,
					operand_kind === "constant" ? operand : null
				]),
				item.body.exception_regions.map((region) => [
					region.flags,
					region.try_length,
					region.handler_length,
					region.class_token === null ? null : "type-token",
					region.filter_offset === null ? null : "filter"
				])
			]) : null
		});
		keyField = (item) => ({
			item,
			identity: identityOf(item),
			rawSignatureKey: item.signature.raw_sha256,
			exactKey: item.signature.parse_status === "decoded" ? sha256$1(["field-exact", item.signature.raw_sha256]) : null,
			signatureKey: sha256$1([
				"field-signature",
				item.declaring_type,
				item.name,
				item.signature.raw_sha256
			]),
			structuralKey: sha256$1([
				"field-structural",
				item.signature.kind,
				item.signature.field_type,
				item.flags
			])
		});
		matchMethods = (left, right) => matchByKeys({
			left,
			right,
			rounds: [
				{
					basis: "exact-il-signature",
					key: declaredAs(({ exactKey }) => exactKey)
				},
				{
					basis: "exact-signature",
					key: ({ signatureKey }) => signatureKey,
					competitionKey: ({ rawSignatureKey }) => rawSignatureKey
				},
				{
					basis: "structural-method-shape",
					key: declaredAs((keyed) => keyed.item.declaring_type === null ? null : keyed.structuralKey),
					competitionKey: ({ structuralKey }) => structuralKey
				},
				{
					basis: "exact-il-signature",
					key: ({ exactKey }) => exactKey,
					remap: true
				},
				{
					basis: "structural-method-shape",
					key: ({ structuralKey }) => structuralKey,
					competitionKey: ({ structuralKey }) => structuralKey,
					remap: true
				}
			]
		});
		matchFields = (left, right) => matchByKeys({
			left,
			right,
			rounds: [
				{
					basis: "field-signature",
					key: declaredAs(({ exactKey }) => exactKey)
				},
				{
					basis: "exact-signature",
					key: ({ signatureKey }) => signatureKey,
					competitionKey: ({ rawSignatureKey }) => rawSignatureKey
				},
				{
					basis: "field-signature",
					key: ({ exactKey }) => exactKey,
					remap: true
				}
			]
		});
		identityOf = ({ declaring_type, name }) => sha256$1([declaring_type, name]);
		declaredAs = (key) => (item) => {
			const value = key(item);
			return value === null ? null : sha256$1([item.identity, value]);
		};
		matchByKeys = ({ left, right, rounds }) => {
			const usedLeft = new Set();
			const usedRight = new Set();
			const pairedLeft = new Set();
			const pairedRight = new Set();
			const pairs = [];
			const ambiguous = [];
			for (const round of rounds) {
				const competitionKey = round.competitionKey ?? ((item) => item.exactKey);
				const unpairedLeft = unpairedOf(left, pairedLeft);
				const unpairedRight = unpairedOf(right, pairedRight);
				const declarable = ownerlessDeclarable(unpairedLeft, unpairedRight, competitionKey);
				const openLeft = left.filter((item) => !usedLeft.has(item));
				const openRight = right.filter((item) => !usedRight.has(item));
				const remapContested = round.remap === true ? ownerlessContested([openLeft, openRight], competitionKey) : new Set();
				const leftGroups = groupBy(round.remap === true ? remappable(openLeft, unpairedRight, competitionKey, remapContested) : openLeft.filter(declarable), round.key);
				const rightGroups = groupBy(round.remap === true ? remappable(openRight, unpairedLeft, competitionKey, remapContested) : openRight.filter(declarable), round.key);
				for (const [key, leftItems] of leftGroups) {
					const rightItems = rightGroups.get(key);
					if (rightItems === undefined) continue;
					const refused = round.remap === true && [...leftItems, ...rightItems].some(({ item }) => item.declaring_type === null);
					if (!refused && leftItems.length === 1 && rightItems.length === 1) {
						const [leftItem] = leftItems;
						const [rightItem] = rightItems;
						if (leftItem === undefined || rightItem === undefined) continue;
						usedLeft.add(leftItem);
						usedRight.add(rightItem);
						pairedLeft.add(leftItem);
						pairedRight.add(rightItem);
						pairs.push({
							left: leftItem,
							right: rightItem,
							basis: round.basis,
							confidence: round.basis === "exact-il-signature" || round.basis === "exact-signature" || round.basis === "field-signature" ? "exact" : "high"
						});
					} else {
						for (const item of leftItems) usedLeft.add(item);
						for (const item of rightItems) usedRight.add(item);
						ambiguous.push({
							left: leftItems,
							right: rightItems,
							basis: round.basis
						});
					}
				}
			}
			for (const group of unresolvedSignatureAmbiguities(left.filter((item) => !usedLeft.has(item)), right.filter((item) => !usedRight.has(item)), ownerlessContested([unpairedOf(left, pairedLeft), unpairedOf(right, pairedRight)], (member) => member.rawSignatureKey))) {
				for (const item of group.left) usedLeft.add(item);
				for (const item of group.right) usedRight.add(item);
				ambiguous.push(group);
			}
			return {
				pairs,
				ambiguous,
				leftOnly: left.filter((item) => !usedLeft.has(item)),
				rightOnly: right.filter((item) => !usedRight.has(item))
			};
		};
		unresolvedSignatureAmbiguities = (left, right, contested) => {
			const key = (member) => competitionIdentityKey(member, member.rawSignatureKey) ?? "";
			const leftGroups = groupBy(left, key);
			const rightGroups = groupBy(right, key);
			const groups = [];
			for (const [signature, leftItems] of leftGroups) {
				const rightItems = rightGroups.get(signature);
				if (!contested.has(signature) || rightItems === undefined) continue;
				groups.push({
					left: leftItems,
					right: rightItems,
					basis: "exact-signature"
				});
			}
			return groups;
		};
		unpairedOf = (items, paired) => items.filter((item) => !paired.has(item));
		competitionIdentityKey = (member, evidenceKey) => evidenceKey === null ? null : JSON.stringify([member.item.name, evidenceKey]);
		ownerlessContested = (sides, keyOf) => {
			const contested = new Set();
			for (const side of sides) {
				const seen = new Map();
				const ownerless = new Set();
				for (const member of side) {
					const key = competitionIdentityKey(member, keyOf(member));
					if (key === null) continue;
					seen.set(key, (seen.get(key) ?? 0) + 1);
					if (member.item.declaring_type === null) ownerless.add(key);
				}
				for (const key of ownerless) if ((seen.get(key) ?? 0) > 1) contested.add(key);
			}
			return contested;
		};
		remappable = (items, others, keyOf, contested) => {
			const kept = new Set(others.map(({ identity }) => identity));
			return items.filter((member) => {
				const key = keyOf(member);
				return key !== null && contested.has(competitionIdentityKey(member, key) ?? "") || member.item.declaring_type === null || !kept.has(member.identity);
			});
		};
		ownerlessDeclarable = (left, right, keyOf) => {
			const count = (side) => {
				const seen = new Map();
				for (const member of side) {
					const key = keyOf(member);
					if (key !== null) seen.set(key, (seen.get(key) ?? 0) + 1);
				}
				return seen;
			};
			const leftSeen = count(left);
			const rightSeen = count(right);
			const contested = ownerlessContested([left, right], keyOf);
			return (member) => {
				const key = keyOf(member);
				return key !== null && contested.has(competitionIdentityKey(member, key) ?? "") ? false : member.item.declaring_type !== null || key === null || (leftSeen.get(key) ?? 0) <= 1 && (rightSeen.get(key) ?? 0) <= 1;
			};
		};
		groupBy = (items, keyOf) => {
			const grouped = new Map();
			for (const item of items) {
				const key = keyOf(item);
				if (key === null) continue;
				const bucket = grouped.get(key) ?? [];
				bucket.push(item);
				grouped.set(key, bucket);
			}
			return grouped;
		};
		observedBy = (side) => ({ declaring_type }) => side.result.selection === null || declaring_type !== null && side.result.selection.type_names.includes(declaring_type);
		matchObserved = (left, right, sides, match, key) => {
			const matched = match(left.filter(sides.inRight).map(key), right.filter(sides.inLeft).map(key));
			return {
				...matched,
				leftOnly: [...matched.leftOnly, ...left.filter((item) => !sides.inRight(item)).map(key)],
				rightOnly: [...matched.rightOnly, ...right.filter((item) => !sides.inLeft(item)).map(key)]
			};
		};
		keyMembers = (left, right) => {
			const sides = {
				inLeft: observedBy(left),
				inRight: observedBy(right)
			};
			return {
				methodMatches: matchObserved(left.result.methods, right.result.methods, sides, matchMethods, keyMethod),
				fieldMatches: matchObserved(left.result.fields, right.result.fields, sides, matchFields, keyField)
			};
		};
		parseManagedMemberEvidence = (evidence) => {
			const parsed = parseManagedInspectionEvidence(evidence, "inspect_managed_members", managedMemberInspectionSchema);
			return {
				evidenceId: parsed.evidence.evidence_id,
				result: parsed.result
			};
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedMemberComparisonItems.js
var inventoryCovers, methodDimensions, callShape, fieldShape, methodIdentity, fieldIdentity, unmatchedComparison, methodOnlyItem, absenceLimitations, undecodedOneSidedNames, fieldOnlyItem, ambiguityLimitation, buildMethodItems, buildFieldItems;
function init_managedMemberComparisonItems() {
	return (init_managedMemberComparisonItems = __esmMin((() => {
		init_managedMemberComparisonMatch();
		inventoryCovers = (complete, selection, member) => complete && (selection === null || member.declaring_type !== null && selection.has(member.declaring_type));
		methodDimensions = (left, right) => {
			const dimensions = [];
			if (left.flags !== right.flags || left.impl_flags !== right.impl_flags) dimensions.push("metadata");
			if (left.signature.raw_sha256 !== right.signature.raw_sha256) dimensions.push("signature");
			const leftBodyComplete = left.body.status === "present" && left.body.truncated_instructions === 0;
			const rightBodyComplete = right.body.status === "present" && right.body.truncated_instructions === 0;
			const bothAbsent = left.body.status === "absent" && right.body.status === "absent";
			if (left.body.status === "absent" && rightBodyComplete || right.body.status === "absent" && leftBodyComplete) dimensions.push("availability");
			if (bothAbsent) return {
				dimensions,
				bodyUnknown: false
			};
			if (!leftBodyComplete || !rightBodyComplete) return {
				dimensions,
				bodyUnknown: true
			};
			if (left.body.il_sha256 !== right.body.il_sha256 || left.body.normalized_il_sha256 !== right.body.normalized_il_sha256) dimensions.push("cil");
			if (canonicalize(left.body.opcode_counts) !== canonicalize(right.body.opcode_counts)) dimensions.push("opcode-shape");
			if (callShape(left.body.anchors) !== callShape(right.body.anchors)) dimensions.push("call-shape");
			if (fieldShape(left.body.anchors) !== fieldShape(right.body.anchors)) dimensions.push("field-shape");
			if (canonicalize(left.body.exception_regions) !== canonicalize(right.body.exception_regions)) dimensions.push("exception-shape");
			return {
				dimensions,
				bodyUnknown: false
			};
		};
		callShape = (anchors) => JSON.stringify(anchors.filter(({ operand_kind }) => operand_kind === "method").map(({ opcode, operand_kind }) => [opcode, operand_kind]));
		fieldShape = (anchors) => JSON.stringify(anchors.filter(({ operand_kind }) => operand_kind === "field").map(({ opcode, operand_kind }) => [opcode, operand_kind]));
		methodIdentity = (item) => ({
			token: item.token,
			declaring_type: item.declaring_type,
			name: item.name,
			signature_sha256: item.signature.raw_sha256,
			normalized_il_sha256: item.body.normalized_il_sha256
		});
		fieldIdentity = (item) => ({
			token: item.token,
			declaring_type: item.declaring_type,
			name: item.name,
			signature_sha256: item.signature.raw_sha256
		});
		unmatchedComparison = () => ({
			status: "unmatched",
			basis: "none",
			confidence: "unknown",
			candidate_left_tokens: [],
			candidate_right_tokens: []
		});
		methodOnlyItem = (member, context, undecoded) => {
			if (member.left !== undefined) {
				const limitations = absenceLimitations(member.left, {
					oppositeComplete: inventoryCovers(context.rightComplete, context.rightSelection, member.left),
					oppositeUndecodedNames: undecoded.right,
					opposite: "right",
					inventory: "method"
				});
				return {
					item_id: `mmc_method_${sha256$1({
						token: member.left.token,
						side: "left"
					})}`,
					status: limitations.length === 0 ? "removed" : "unknown",
					left: methodIdentity(member.left),
					right: null,
					match: unmatchedComparison(),
					dimensions: ["availability"],
					evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
					limitations
				};
			}
			const limitations = absenceLimitations(member.right, {
				oppositeComplete: inventoryCovers(context.leftComplete, context.leftSelection, member.right),
				oppositeUndecodedNames: undecoded.left,
				opposite: "left",
				inventory: "method"
			});
			return {
				item_id: `mmc_method_${sha256$1({
					token: member.right.token,
					side: "right"
				})}`,
				status: limitations.length === 0 ? "added" : "unknown",
				left: null,
				right: methodIdentity(member.right),
				match: unmatchedComparison(),
				dimensions: ["availability"],
				evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
				limitations
			};
		};
		absenceLimitations = (member, opposite) => [
			...opposite.oppositeComplete ? [] : [`unknown-within-incomplete-metadata: The ${opposite.opposite} ${opposite.inventory} inventory is incomplete, so absence was not observed.`],
			...member.signature.parse_status === "decoded" ? [] : [`signature-not-decoded: The member's ${member.signature.parse_status} signature was compared only by exact declared type, name, and raw bytes, so a changed or renamed counterpart could not be sought.`],
			...member.signature.parse_status === "decoded" && opposite.oppositeUndecodedNames.size > 0 && opposite.oppositeUndecodedNames.has(identityOf(member)) ? [`counterpart-signature-not-decoded: The ${opposite.opposite} ${opposite.inventory} inventory has an unpaired member with the same declared type and name whose signature was not decoded, so it may be this member with a changed signature.`] : []
		];
		undecodedOneSidedNames = (members) => {
			const names = (side) => new Set(side.filter(({ item }) => item.signature.parse_status !== "decoded").map(({ identity }) => identity));
			return {
				left: names([...members.leftOnly, ...members.ambiguous.flatMap(({ left }) => left)]),
				right: names([...members.rightOnly, ...members.ambiguous.flatMap(({ right }) => right)])
			};
		};
		fieldOnlyItem = (member, context, undecoded) => {
			if (member.left !== undefined) {
				const limitations = absenceLimitations(member.left, {
					oppositeComplete: inventoryCovers(context.rightComplete, context.rightSelection, member.left),
					oppositeUndecodedNames: undecoded.right,
					opposite: "right",
					inventory: "field"
				});
				return {
					item_id: `mmc_field_${sha256$1({
						token: member.left.token,
						side: "left"
					})}`,
					status: limitations.length === 0 ? "removed" : "unknown",
					left: fieldIdentity(member.left),
					right: null,
					match: unmatchedComparison(),
					evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
					limitations
				};
			}
			const limitations = absenceLimitations(member.right, {
				oppositeComplete: inventoryCovers(context.leftComplete, context.leftSelection, member.right),
				oppositeUndecodedNames: undecoded.left,
				opposite: "left",
				inventory: "field"
			});
			return {
				item_id: `mmc_field_${sha256$1({
					token: member.right.token,
					side: "right"
				})}`,
				status: limitations.length === 0 ? "added" : "unknown",
				left: null,
				right: fieldIdentity(member.right),
				match: unmatchedComparison(),
				evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
				limitations
			};
		};
		ambiguityLimitation = (members, basis) => basis === "exact-signature" ? `Multiple managed ${members} share the same raw signature; REA did not guess declared ownership or a token remap.` : basis === "exact-il-signature" ? "Multiple managed methods share the same CIL and signature; REA did not guess a token remap." : members === "methods" ? "Multiple managed methods share the same structural shape; REA did not guess a token remap." : "Multiple managed fields share the same signature; REA did not guess a token remap.";
		buildMethodItems = (matches, context) => {
			const items = [];
			for (const pair of matches.pairs) {
				const { dimensions: observedDimensions, bodyUnknown } = methodDimensions(pair.left.item, pair.right.item);
				const dimensions = bodyUnknown ? [...observedDimensions, "body-coverage"] : observedDimensions;
				const observedChange = observedDimensions.length > 0;
				items.push({
					item_id: `mmc_method_${sha256$1({
						left: pair.left.item.token,
						right: pair.right.item.token,
						basis: pair.basis
					})}`,
					status: observedChange ? "changed" : bodyUnknown ? "unknown" : "unchanged",
					left: methodIdentity(pair.left.item),
					right: methodIdentity(pair.right.item),
					match: {
						status: "matched",
						basis: pair.basis,
						confidence: pair.confidence,
						candidate_left_tokens: [],
						candidate_right_tokens: []
					},
					dimensions,
					evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
					limitations: bodyUnknown ? ["Method body facets are unknown because at least one side has unavailable or partial body data."] : []
				});
			}
			for (const ambiguous of matches.ambiguous) {
				items.push({
					item_id: `mmc_method_${sha256$1({
						left: ambiguous.left.map(({ item }) => item.token),
						right: ambiguous.right.map(({ item }) => item.token),
						basis: ambiguous.basis
					})}`,
					status: "unknown",
					left: null,
					right: null,
					match: {
						status: "ambiguous",
						basis: ambiguous.basis,
						confidence: "unknown",
						candidate_left_tokens: ambiguous.left.map(({ item }) => item.token),
						candidate_right_tokens: ambiguous.right.map(({ item }) => item.token)
					},
					dimensions: ["availability"],
					evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
					limitations: [ambiguityLimitation("methods", ambiguous.basis)]
				});
			}
			const undecoded = undecodedOneSidedNames(matches);
			for (const item of matches.leftOnly) items.push(methodOnlyItem({ left: item.item }, context, undecoded));
			for (const item of matches.rightOnly) items.push(methodOnlyItem({ right: item.item }, context, undecoded));
			return items;
		};
		buildFieldItems = (matches, context) => {
			const items = [];
			for (const pair of matches.pairs) {
				const changed = pair.left.item.signature.raw_sha256 !== pair.right.item.signature.raw_sha256 || pair.left.item.flags !== pair.right.item.flags;
				items.push({
					item_id: `mmc_field_${sha256$1({
						left: pair.left.item.token,
						right: pair.right.item.token
					})}`,
					status: changed ? "changed" : "unchanged",
					left: fieldIdentity(pair.left.item),
					right: fieldIdentity(pair.right.item),
					match: {
						status: "matched",
						basis: pair.basis,
						confidence: pair.confidence,
						candidate_left_tokens: [],
						candidate_right_tokens: []
					},
					evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
					limitations: []
				});
			}
			for (const ambiguous of matches.ambiguous) items.push({
				item_id: `mmc_field_${sha256$1({
					left: ambiguous.left.map(({ item }) => item.token),
					right: ambiguous.right.map(({ item }) => item.token)
				})}`,
				status: "unknown",
				left: null,
				right: null,
				match: {
					status: "ambiguous",
					basis: ambiguous.basis,
					confidence: "unknown",
					candidate_left_tokens: ambiguous.left.map(({ item }) => item.token),
					candidate_right_tokens: ambiguous.right.map(({ item }) => item.token)
				},
				evidence_links: [context.leftEvidenceId, context.rightEvidenceId],
				limitations: [ambiguityLimitation("fields", ambiguous.basis)]
			});
			const undecoded = undecodedOneSidedNames(matches);
			for (const item of matches.leftOnly) items.push(fieldOnlyItem({ left: item.item }, context, undecoded));
			for (const item of matches.rightOnly) items.push(fieldOnlyItem({ right: item.item }, context, undecoded));
			return items;
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedMemberComparison.js
var evidenceIdSchema$9, tokenSchema$2, boundedTextSchema, compareManagedMembersInputSchema, concreteMatchBasisSchema, candidateTokensSchema, matchedComparisonSchema, unmatchedComparisonSchema, ambiguousComparisonSchema, memberIdentitySchema, comparisonItemSchema, comparisonItemContextShape, methodComparisonItemSchema, fieldComparisonItemSchema, managedMemberComparisonResultSchema, selectedTypes, compareManagedMembers;
function init_managedMemberComparison() {
	return (init_managedMemberComparison = __esmMin((() => {
		init_emptyArraySchema();
		init_evidence();
		init_managedArtifact();
		init_managedMemberComparisonCoverage();
		init_managedMemberComparisonItems();
		init_managedMemberComparisonMatch();
		init_digests();
		evidenceIdSchema$9 = prefixedDigestSchema("ev");
		tokenSchema$2 = z.string().regex(/^0x[0-9a-f]{8}$/u);
		boundedTextSchema = z.string().min(1);
		compareManagedMembersInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema
		}).superRefine((input, context) => {
			if (input.left.evidence_id === input.right.evidence_id) context.addIssue({
				code: "custom",
				path: ["right"],
				message: "Managed member Evidence must be distinct"
			});
		});
		concreteMatchBasisSchema = z.enum([
			"exact-il-signature",
			"exact-signature",
			"structural-method-shape",
			"field-signature"
		]);
		candidateTokensSchema = z.array(tokenSchema$2).min(1);
		matchedComparisonSchema = z.strictObject({
			status: z.literal("matched"),
			basis: concreteMatchBasisSchema,
			confidence: z.enum(["exact", "high"]),
			candidate_left_tokens: emptyArraySchema,
			candidate_right_tokens: emptyArraySchema
		});
		unmatchedComparisonSchema = z.strictObject({
			status: z.literal("unmatched"),
			basis: z.literal("none"),
			confidence: z.literal("unknown"),
			candidate_left_tokens: emptyArraySchema,
			candidate_right_tokens: emptyArraySchema
		});
		ambiguousComparisonSchema = z.strictObject({
			status: z.literal("ambiguous"),
			basis: concreteMatchBasisSchema,
			confidence: z.literal("unknown"),
			candidate_left_tokens: candidateTokensSchema,
			candidate_right_tokens: candidateTokensSchema
		});
		memberIdentitySchema = z.strictObject({
			token: tokenSchema$2,
			declaring_type: z.string().nullable(),
			name: z.string(),
			signature_sha256: digestSchema,
			normalized_il_sha256: digestSchema.nullable()
		});
		comparisonItemSchema = (base, identity) => z.union([
			z.strictObject({
				...base,
				status: z.enum([
					"unchanged",
					"changed",
					"unknown"
				]),
				left: identity,
				right: identity,
				match: matchedComparisonSchema
			}),
			z.strictObject({
				...base,
				status: z.enum(["removed", "unknown"]),
				left: identity,
				right: z.null(),
				match: unmatchedComparisonSchema
			}),
			z.strictObject({
				...base,
				status: z.enum(["added", "unknown"]),
				left: z.null(),
				right: identity,
				match: unmatchedComparisonSchema
			}),
			z.strictObject({
				...base,
				status: z.literal("unknown"),
				left: z.null(),
				right: z.null(),
				match: ambiguousComparisonSchema
			})
		]);
		comparisonItemContextShape = {
			evidence_links: z.array(evidenceIdSchema$9).length(2),
			limitations: z.array(boundedTextSchema)
		};
		methodComparisonItemSchema = comparisonItemSchema({
			...comparisonItemContextShape,
			item_id: prefixedDigestSchema("mmc_method"),
			dimensions: z.array(z.enum([
				"metadata",
				"signature",
				"cil",
				"opcode-shape",
				"call-shape",
				"field-shape",
				"exception-shape",
				"availability",
				"body-coverage"
			]))
		}, memberIdentitySchema);
		fieldComparisonItemSchema = comparisonItemSchema({
			...comparisonItemContextShape,
			item_id: prefixedDigestSchema("mmc_field")
		}, memberIdentitySchema.omit({ normalized_il_sha256: true }));
		managedMemberComparisonResultSchema = z.strictObject({
			comparison_id: prefixedDigestSchema("mmc"),
			algorithm: z.strictObject({
				name: z.literal("rea-managed-member-comparison"),
				token_identity: z.literal("build-local"),
				name_matching: z.literal("exact-signature-fallback")
			}),
			left: z.strictObject({
				evidence_id: evidenceIdSchema$9,
				artifact_sha256: digestSchema,
				mvid: cliMetadataGuidSchema.nullable(),
				module_name: z.string().nullable(),
				metadata_status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				methods_total: z.number().int().min(0),
				fields_total: z.number().int().min(0)
			}),
			right: z.strictObject({
				evidence_id: evidenceIdSchema$9,
				artifact_sha256: digestSchema,
				mvid: cliMetadataGuidSchema.nullable(),
				module_name: z.string().nullable(),
				metadata_status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				methods_total: z.number().int().min(0),
				fields_total: z.number().int().min(0)
			}),
			summary: z.strictObject({
				unchanged: z.number().int().min(0),
				changed: z.number().int().min(0),
				added: z.number().int().min(0),
				removed: z.number().int().min(0),
				unknown: z.number().int().min(0)
			}),
			matching: z.strictObject({
				exact_il_signature: z.number().int().min(0),
				exact_signature: z.number().int().min(0),
				structural_method_shape: z.number().int().min(0),
				field_signature: z.number().int().min(0),
				ambiguous: z.number().int().min(0),
				unmatched: z.number().int().min(0)
			}),
			methods: z.array(methodComparisonItemSchema),
			fields: z.array(fieldComparisonItemSchema),
			coverage: z.strictObject({
				status: z.enum(["complete-within-inputs", "partial"]),
				left_status: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				right_status: z.enum([
					"complete",
					"partial",
					"unavailable"
				])
			}),
			evidence_links: z.array(evidenceIdSchema$9).length(2),
			limitations: z.array(boundedTextSchema)
		});
		selectedTypes = (result) => result.selection === null ? null : new Set(result.selection.type_names);
		compareManagedMembers = (left, right) => {
			const { methodMatches, fieldMatches } = keyMembers(left, right);
			const itemContext = {
				leftEvidenceId: left.evidenceId,
				rightEvidenceId: right.evidenceId,
				leftComplete: left.result.metadata.status === "complete",
				rightComplete: right.result.metadata.status === "complete",
				leftSelection: selectedTypes(left.result),
				rightSelection: selectedTypes(right.result)
			};
			const methodItems = buildMethodItems(methodMatches, itemContext);
			const fieldItems = buildFieldItems(fieldMatches, itemContext);
			const allItems = [...methodItems, ...fieldItems];
			const summary = buildComparisonSummary(allItems);
			const matching = buildComparisonMatching(methodItems, fieldItems);
			const coverage = buildComparisonCoverage({
				left: left.result,
				right: right.result
			});
			const limitations = comparisonLimitations(left.result, right.result);
			const result = {
				comparison_id: `mmc_${sha256$1({
					left: left.evidenceId,
					right: right.evidenceId,
					methods: [...methodItems],
					fields: [...fieldItems]
				})}`,
				algorithm: {
					name: "rea-managed-member-comparison",
					token_identity: "build-local",
					name_matching: "exact-signature-fallback"
				},
				left: sideManifest(left),
				right: sideManifest(right),
				summary,
				matching,
				methods: methodItems,
				fields: fieldItems,
				coverage,
				evidence_links: [left.evidenceId, right.evidenceId],
				limitations
			};
			return managedMemberComparisonResultSchema.parse(result);
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedNativeVerificationSchemas.js
var evidenceIdSchema$8, tokenSchema$1, textSchema$1, nativeSymbolSchema, pinvokeVerificationContextShape, observedCandidatesSchema, pinvokeVerificationSchema, managedNativeVerificationInputSchema, verificationCoverageSchema, managedNativeVerificationResultSchema;
function init_managedNativeVerificationSchemas() {
	return (init_managedNativeVerificationSchemas = __esmMin((() => {
		init_emptyArraySchema();
		init_evidence();
		init_managedArtifact();
		init_digests();
		evidenceIdSchema$8 = prefixedDigestSchema("ev");
		tokenSchema$1 = z.string().regex(/^0x[0-9a-f]{8}$/u);
		textSchema$1 = z.string().min(1);
		nativeSymbolSchema = z.strictObject({
			evidence_id: evidenceIdSchema$8,
			operation: z.string().min(1),
			name: z.string().min(1),
			address: z.string().nullable(),
			module_name: z.string().nullable(),
			module_path: z.string().nullable(),
			source: z.enum(["macho-export", "function-dossier"])
		});
		pinvokeVerificationContextShape = {
			item_id: prefixedDigestSchema("mnv_pinvoke"),
			managed: z.strictObject({
				token: tokenSchema$1,
				member_token: tokenSchema$1.nullable(),
				member_name: z.string().nullable(),
				import_name: z.string().min(1),
				import_scope_name: z.string().nullable(),
				no_mangle: z.boolean(),
				char_set: z.enum([
					"not-specified",
					"ansi",
					"unicode",
					"auto",
					"unknown"
				]),
				call_convention: z.enum([
					"not-specified",
					"winapi",
					"cdecl",
					"stdcall",
					"thiscall",
					"fastcall",
					"unknown"
				]),
				declaration_verification: z.literal("managed-declaration-only")
			}),
			evidence_links: z.array(evidenceIdSchema$8).min(1),
			limitations: z.array(textSchema$1)
		};
		observedCandidatesSchema = z.tuple([nativeSymbolSchema]).rest(nativeSymbolSchema);
		pinvokeVerificationSchema = z.union([
			z.strictObject({
				...pinvokeVerificationContextShape,
				status: z.literal("verified"),
				basis: z.enum(["exact-export-name", "exact-function-name"]),
				confidence: z.literal("observed"),
				matched_native: nativeSymbolSchema,
				candidates: observedCandidatesSchema
			}),
			z.strictObject({
				...pinvokeVerificationContextShape,
				status: z.literal("inferred"),
				basis: z.literal("decorated-name-candidate"),
				confidence: z.literal("inferred"),
				matched_native: nativeSymbolSchema,
				candidates: observedCandidatesSchema
			}),
			z.strictObject({
				...pinvokeVerificationContextShape,
				status: z.literal("unresolved"),
				basis: z.enum(["no-native-candidate", "unsupported-native-evidence"]),
				confidence: z.literal("unknown"),
				matched_native: z.null(),
				candidates: emptyArraySchema
			}),
			z.strictObject({
				...pinvokeVerificationContextShape,
				status: z.literal("unresolved"),
				basis: z.literal("module-identity-unknown"),
				confidence: z.literal("unknown"),
				matched_native: nativeSymbolSchema,
				candidates: observedCandidatesSchema
			}),
			z.strictObject({
				...pinvokeVerificationContextShape,
				status: z.literal("contradicted"),
				basis: z.literal("module-mismatch"),
				confidence: z.literal("unknown"),
				matched_native: nativeSymbolSchema,
				candidates: observedCandidatesSchema
			})
		]);
		managedNativeVerificationInputSchema = z.strictObject({
			managed_boundaries: evidenceSchema,
			native_observations: z.array(evidenceSchema).min(1).describe("Native function or export Evidence records")
		}).superRefine((input, context) => {
			const ids = new Set();
			for (const [index, evidence] of input.native_observations.entries()) {
				if (evidence.evidence_id === input.managed_boundaries.evidence_id) {
					context.addIssue({
						code: "custom",
						path: ["native_observations", index],
						message: "Native observation Evidence must be distinct from managed boundary Evidence"
					});
				}
				if (ids.has(evidence.evidence_id)) {
					context.addIssue({
						code: "custom",
						path: ["native_observations", index],
						message: "Native observation Evidence IDs must be unique"
					});
				}
				ids.add(evidence.evidence_id);
			}
		});
		verificationCoverageSchema = z.strictObject({ status: z.enum(["complete-within-inputs", "partial"]) });
		managedNativeVerificationResultSchema = z.strictObject({
			verification_id: prefixedDigestSchema("mnv"),
			algorithm: z.strictObject({
				name: z.literal("rea-managed-native-verification"),
				token_identity: z.literal("build-local"),
				token_to_address_mapping: z.literal("not-inferred")
			}),
			managed_boundary: z.strictObject({
				evidence_id: evidenceIdSchema$8,
				artifact_sha256: digestSchema,
				artifact_path: z.string().min(1),
				mvid: cliMetadataGuidSchema.nullable(),
				metadata_status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				pinvoke_imports_total: z.number().int().min(0),
				native_implementations_total: z.number().int().min(0),
				coverage_state: z.enum([
					"complete",
					"partial",
					"unavailable"
				])
			}),
			native_observations: z.strictObject({
				total: z.number().int().min(1),
				accepted: z.number().int().min(0),
				unsupported: z.number().int().min(0),
				symbols: z.number().int().min(0)
			}),
			summary: z.strictObject({
				verified: z.number().int().min(0),
				inferred: z.number().int().min(0),
				unresolved: z.number().int().min(0),
				contradicted: z.number().int().min(0),
				native_body_unresolved: z.number().int().min(0)
			}),
			pinvoke_imports: z.array(pinvokeVerificationSchema),
			native_implementations: z.strictObject({
				unresolved: z.number().int().min(0),
				reason: textSchema$1
			}),
			coverage: verificationCoverageSchema,
			evidence_links: z.array(evidenceIdSchema$8).min(2),
			limitations: z.array(textSchema$1)
		}).superRefine((result, context) => {
			const observedNativeCount = result.native_observations.accepted + result.native_observations.unsupported;
			if (observedNativeCount !== result.native_observations.total) context.addIssue({
				code: "custom",
				path: ["native_observations"],
				message: "Native observation counts must account for the total input"
			});
			for (const status of [
				"verified",
				"inferred",
				"unresolved",
				"contradicted"
			]) if (result.summary[status] !== result.pinvoke_imports.filter((item) => item.status === status).length) context.addIssue({
				code: "custom",
				path: ["summary", status],
				message: `P/Invoke ${status} count must match the item results`
			});
			if (result.summary.native_body_unresolved !== result.native_implementations.unresolved) context.addIssue({
				code: "custom",
				path: ["summary", "native_body_unresolved"],
				message: "Native body summary must match unresolved implementations"
			});
		}).describe("Counts must agree across the result: native accepted plus unsupported equals total; each P/Invoke summary count equals the number of items with that status; and native_body_unresolved equals native_implementations.unresolved. REA checks these cross-field invariants after constructing the result.");
	})))();
}

//#endregion
//#region dist/domain/managed/managedReconstruction.js
var evidenceIdSchema$7, tokenSchema, textSchema, decompilerSchema, managedReconstructionMethodInputSchema, managedReconstructionImportInputSchema, importedMethodSchema, managedReconstructionImportResultSchema, sha256Text, sha256Json, countLines, findObservedMethod, verifyTextSha256, buildImportedMethod, buildReconstructionSummary, buildStaticObservation, buildDecompilerRecord, RECONSTRUCTION_LIMITATIONS, buildReconstructionWithoutId, importManagedReconstruction;
function init_managedReconstruction() {
	return (init_managedReconstruction = __esmMin((() => {
		init_evidence();
		init_managedArtifact();
		init_digests();
		init_managedInspectionEvidence();
		evidenceIdSchema$7 = prefixedDigestSchema("ev");
		tokenSchema = z.string().regex(/^0x[0-9a-f]{8}$/u);
		textSchema = z.string().min(1);
		decompilerSchema = z.strictObject({
			name: textSchema,
			version: textSchema.nullable().default(null),
			family: z.enum([
				"ilspy",
				"dnspy",
				"dnlib",
				"mono-cecil",
				"other"
			]),
			executable_sha256: digestSchema.nullable().default(null),
			options: z.array(z.string()).default([])
		});
		managedReconstructionMethodInputSchema = z.strictObject({
			token: tokenSchema,
			signature_sha256: digestSchema,
			normalized_il_sha256: digestSchema.nullable(),
			reconstruction: z.strictObject({
				kind: z.enum([
					"decompiled-csharp",
					"decompiled-il",
					"semantic-pseudocode"
				]),
				language: z.enum([
					"csharp",
					"il",
					"pseudocode"
				]),
				text: textSchema,
				text_sha256: digestSchema.optional(),
				source_path: textSchema.nullable().optional(),
				start_line: z.number().int().min(1).nullable().optional(),
				end_line: z.number().int().min(1).nullable().optional()
			})
		});
		managedReconstructionImportInputSchema = z.strictObject({
			static_members: evidenceSchema,
			decompiler: decompilerSchema,
			methods: z.array(managedReconstructionMethodInputSchema).min(1),
			notes: z.array(textSchema).default([])
		});
		importedMethodSchema = z.strictObject({
			token: tokenSchema,
			declaring_type: z.string().nullable(),
			name: z.string(),
			signature_sha256: digestSchema,
			normalized_il_sha256: digestSchema.nullable(),
			body_sha256: digestSchema.nullable(),
			il_size: z.number().int().min(0),
			reconstruction: z.strictObject({
				kind: z.enum([
					"decompiled-csharp",
					"decompiled-il",
					"semantic-pseudocode"
				]),
				language: z.enum([
					"csharp",
					"il",
					"pseudocode"
				]),
				text: textSchema,
				text_sha256: digestSchema,
				text_length: z.number().int().min(1),
				line_count: z.number().int().min(1),
				source_path: textSchema.nullable(),
				start_line: z.number().int().min(1).nullable(),
				end_line: z.number().int().min(1).nullable()
			}),
			validation: z.strictObject({
				matched_static_member: z.literal(true),
				exact_build_required: z.literal(true),
				canonical_observation: z.literal(false),
				confidence_floor: z.literal("inference")
			})
		});
		managedReconstructionImportResultSchema = z.strictObject({
			reconstruction_id: prefixedDigestSchema("mre"),
			phase: z.literal("reconstruction-import"),
			executed: z.literal(false),
			static_observation: z.strictObject({
				evidence_id: evidenceIdSchema$7,
				artifact_sha256: digestSchema,
				artifact_path: z.string().min(1),
				byte_length: z.number().int().min(0),
				module_name: z.string().nullable(),
				mvid: cliMetadataGuidSchema.nullable(),
				metadata_status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				])
			}),
			decompiler: decompilerSchema.extend({ options_sha256: digestSchema }),
			summary: z.strictObject({
				imported_methods: z.number().int().min(1),
				decompiled_csharp_methods: z.number().int().min(0),
				decompiled_il_methods: z.number().int().min(0),
				pseudocode_methods: z.number().int().min(0),
				total_text_bytes: z.number().int().min(1)
			}),
			methods: z.array(importedMethodSchema).min(1),
			notes: z.array(textSchema),
			evidence_links: z.array(evidenceIdSchema$7).length(1),
			limitations: z.array(textSchema)
		});
		sha256Text = (value) => createHash("sha256").update(value).digest("hex");
		sha256Json = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Managed reconstruction canonicalization failed");
			return createHash("sha256").update(serialized).digest("hex");
		};
		countLines = (text) => text.length === 0 ? 0 : text.split(/\r\n|\r|\n/u).length;
		findObservedMethod = (members, candidate) => members.methods.find((item) => item.token === candidate.token && item.signature.raw_sha256 === candidate.signature_sha256 && item.body.status === "present" && item.body.normalized_il_sha256 !== null && candidate.normalized_il_sha256 !== null && item.body.normalized_il_sha256 === candidate.normalized_il_sha256);
		verifyTextSha256 = (candidate, textSha256) => {
			if (candidate.reconstruction.text_sha256 !== undefined && candidate.reconstruction.text_sha256 !== textSha256) throw new TypeError(`Reconstruction text hash mismatch for ${candidate.token}`);
		};
		buildImportedMethod = (observed, candidate, textSha256) => ({
			token: observed.token,
			declaring_type: observed.declaring_type,
			name: observed.name,
			signature_sha256: observed.signature.raw_sha256,
			normalized_il_sha256: observed.body.normalized_il_sha256,
			body_sha256: observed.body.il_sha256,
			il_size: observed.body.il_size,
			reconstruction: {
				kind: candidate.reconstruction.kind,
				language: candidate.reconstruction.language,
				text: candidate.reconstruction.text,
				text_sha256: textSha256,
				text_length: candidate.reconstruction.text.length,
				line_count: countLines(candidate.reconstruction.text),
				source_path: candidate.reconstruction.source_path ?? null,
				start_line: candidate.reconstruction.start_line ?? null,
				end_line: candidate.reconstruction.end_line ?? null
			},
			validation: {
				matched_static_member: true,
				exact_build_required: true,
				canonical_observation: false,
				confidence_floor: "inference"
			}
		});
		buildReconstructionSummary = (methods) => ({
			imported_methods: methods.length,
			decompiled_csharp_methods: methods.filter(({ reconstruction }) => reconstruction.kind === "decompiled-csharp").length,
			decompiled_il_methods: methods.filter(({ reconstruction }) => reconstruction.kind === "decompiled-il").length,
			pseudocode_methods: methods.filter(({ reconstruction }) => reconstruction.kind === "semantic-pseudocode").length,
			total_text_bytes: methods.reduce((total, { reconstruction }) => total + Buffer.byteLength(reconstruction.text, "utf8"), 0)
		});
		buildStaticObservation = (staticEvidence, members) => ({
			evidence_id: staticEvidence.evidence_id,
			artifact_sha256: members.artifact.sha256,
			artifact_path: members.artifact.path,
			byte_length: members.artifact.byte_length,
			module_name: members.module?.name ?? null,
			mvid: members.module?.mvid ?? null,
			metadata_status: members.metadata.status
		});
		buildDecompilerRecord = (decompiler) => ({
			...decompiler,
			options_sha256: sha256Json(decompiler.options)
		});
		RECONSTRUCTION_LIMITATIONS = [
			"Decompiler output is imported as reconstruction evidence and analyst inference; metadata and IL observations remain canonical.",
			"This operation did not execute, load, reflect over, debug, instrument, patch, or decompile the target artifact.",
			"The imported reconstruction is valid only for the exact artifact SHA-256, MVID, method signature, and normalized IL shape recorded here.",
			"Obfuscated names, decompiler variables, and control-flow restructuring are not treated as proof without separate validation."
		];
		buildReconstructionWithoutId = (input, staticEvidence, members, methods) => ({
			phase: "reconstruction-import",
			executed: false,
			static_observation: buildStaticObservation(staticEvidence, members),
			decompiler: buildDecompilerRecord(input.decompiler),
			summary: buildReconstructionSummary(methods),
			methods: [...methods],
			notes: input.notes,
			evidence_links: [staticEvidence.evidence_id],
			limitations: RECONSTRUCTION_LIMITATIONS
		});
		importManagedReconstruction = (input) => {
			const { evidence: staticEvidence, result: members } = parseManagedInspectionEvidence(input.static_members, "inspect_managed_members", managedMemberInspectionSchema);
			const methods = input.methods.map((candidate) => {
				const observed = findObservedMethod(members, candidate);
				if (observed === undefined) throw new TypeError(`Reconstruction method lock ${candidate.token} does not match a static managed member observation`);
				const textSha256 = sha256Text(candidate.reconstruction.text);
				verifyTextSha256(candidate, textSha256);
				return buildImportedMethod(observed, candidate, textSha256);
			});
			const withoutId = buildReconstructionWithoutId(input, staticEvidence, members, methods);
			return managedReconstructionImportResultSchema.parse({
				...withoutId,
				reconstruction_id: `mre_${sha256Json(withoutId)}`
			});
		};
	})))();
}

//#endregion
//#region dist/domain/artifactComparison.js
var evidenceIdSchema$6, comparisonStatusSchema$1, changeKindSchema, comparisonDimensionSchema, artifactComparisonInputSchema, artifactChangeSchema, artifactComparisonResultSchema, compareArtifacts, compareOccurrences, occurrencesByPath, buildArtifactChangeBase, classifyPresence, classifyIntegrity, classifyAvailability, classifyPath, changedDimensions, metadataChanged, nodeFor, relationsByPath, summarize, applyRootHashChange;
function init_artifactComparison() {
	return (init_artifactComparison = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_evidence();
		init_artifactInventoryEvidence();
		init_digests();
		init_comparisonSemantics();
		evidenceIdSchema$6 = prefixedDigestSchema("ev");
		comparisonStatusSchema$1 = z.enum([
			"unchanged",
			"added",
			"removed",
			"changed",
			"truncated",
			"unknown",
			"contradiction"
		]);
		changeKindSchema = z.enum([
			"added",
			"removed",
			"changed",
			"unknown",
			"contradiction"
		]);
		comparisonDimensionSchema = z.enum([
			"content",
			"kind",
			"format",
			"size",
			"executable",
			"relations",
			"metadata",
			"availability",
			"integrity"
		]);
		artifactComparisonInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema
		});
		artifactChangeSchema = z.object({
			classification: changeKindSchema,
			logical_path: z.string().min(1),
			dimensions: z.array(comparisonDimensionSchema).min(1),
			left_occurrence_id: z.string().regex(/^occ_[a-f0-9]{64}$/u).nullable(),
			right_occurrence_id: z.string().regex(/^occ_[a-f0-9]{64}$/u).nullable(),
			left_artifact_id: z.string().regex(/^art_[a-f0-9]{64}$/u).nullable(),
			right_artifact_id: z.string().regex(/^art_[a-f0-9]{64}$/u).nullable(),
			evidence_links: z.array(evidenceIdSchema$6).min(2)
		});
		artifactComparisonResultSchema = z.object({
			status: comparisonStatusSchema$1,
			left_manifest_id: prefixedDigestSchema("agm"),
			right_manifest_id: prefixedDigestSchema("agm"),
			summary: z.object({
				unchanged: z.number().int().min(0),
				added: z.number().int().min(0),
				removed: z.number().int().min(0),
				changed: z.number().int().min(0),
				unknown: z.number().int().min(0),
				contradiction: z.number().int().min(0).default(0)
			}),
			changes: z.array(artifactChangeSchema),
			limitations: z.array(z.string())
		});
		compareArtifacts = (leftEvidence, rightEvidence) => {
			const left = parseArtifactInventoryEvidence(leftEvidence);
			const right = parseArtifactInventoryEvidence(rightEvidence);
			const leftComplete = left.inventory.complete;
			const rightComplete = right.inventory.complete;
			const sameScope = left.inventory.coverage.scope === right.inventory.coverage.scope;
			const rootCoverageComplete = sameScope && left.inventory.complete && right.inventory.complete && left.inventory.coverage.status === "complete" && right.inventory.coverage.status === "complete";
			const entryCoverageComplete = rootCoverageComplete && left.inventory.coverage.scope === "container-entries";
			const leftCovered = sameScope && hasCompleteInventoryCoverage(left.inventory, left.inventory.coverage.scope);
			const rightCovered = sameScope && hasCompleteInventoryCoverage(right.inventory, right.inventory.coverage.scope);
			const fullyCovered = leftCovered && rightCovered && (entryCoverageComplete || rootCoverageComplete && left.inventory.manifest.occurrence_count === 1 && right.inventory.manifest.occurrence_count === 1);
			const leftOccurrencesByPath = occurrencesByPath(left.inventory.occurrences);
			const rightOccurrencesByPath = occurrencesByPath(right.inventory.occurrences);
			const comparison = compareOccurrences(left.inventory, right.inventory, leftOccurrencesByPath, rightOccurrencesByPath, [...left.evidence.map(({ evidence_id: id }) => id), ...right.evidence.map(({ evidence_id: id }) => id)], {
				root: rootCoverageComplete,
				entries: entryCoverageComplete
			});
			const changes = comparison.changes;
			const limitations = [
				...left.inventory.limitations.map((item) => `Left: ${item}`),
				...right.inventory.limitations.map((item) => `Right: ${item}`),
				...leftComplete ? [] : ["Left artifact inventory is incomplete."],
				...rightComplete ? [] : ["Right artifact inventory is incomplete."],
				...sameScope ? [] : ["Artifact inventory scopes differ."],
				...sameScope && left.inventory.coverage.scope === "root" && (left.inventory.manifest.occurrence_count > 1 || right.inventory.manifest.occurrence_count > 1) ? ["Container entry coverage is unavailable for child paths."] : [],
				...left.inventory.coverage.status === "complete" ? [] : ["Left artifact inventory traversal coverage is unknown."],
				...right.inventory.coverage.status === "complete" ? [] : ["Right artifact inventory traversal coverage is unknown."],
				...comparison.hasAmbiguousDuplicatePaths ? ["Duplicate logical paths cannot be paired across inventories; comparisons for those paths are unknown."] : []
			];
			applyRootHashChange(left.inventory, right.inventory, changes, [...left.evidence.map(({ evidence_id: id }) => id), ...right.evidence.map(({ evidence_id: id }) => id)]);
			const summary = summarize(left.inventory, right.inventory, changes, fullyCovered);
			return artifactComparisonResultSchema.parse({
				status: !leftComplete || !rightComplete ? "truncated" : changes.some(({ classification }) => classification === "contradiction") ? "contradiction" : !fullyCovered ? "unknown" : changes.some(({ classification }) => classification === "unknown") ? "unknown" : changes.length === 0 ? "unchanged" : "changed",
				left_manifest_id: left.inventory.manifest.manifest_id,
				right_manifest_id: right.inventory.manifest.manifest_id,
				summary,
				changes,
				limitations: [...new Set(limitations)].sort(compareUnicodeCodePoints)
			});
		};
		compareOccurrences = (left, right, leftByPath, rightByPath, evidenceLinks, coverage) => {
			const leftNodes = new Map(left.nodes.map((item) => [item.artifact_id, item]));
			const rightNodes = new Map(right.nodes.map((item) => [item.artifact_id, item]));
			const leftRelations = relationsByPath(left);
			const rightRelations = relationsByPath(right);
			const paths = [...new Set([...leftByPath.keys(), ...rightByPath.keys()])].sort(compareUnicodeCodePoints);
			const output = [];
			let hasAmbiguousDuplicatePaths = false;
			for (const path of paths) {
				const leftMatches = leftByPath.get(path) ?? [];
				const rightMatches = rightByPath.get(path) ?? [];
				if (leftMatches.length > 1 || rightMatches.length > 1) {
					hasAmbiguousDuplicatePaths = true;
					output.push({
						logical_path: path,
						classification: "unknown",
						dimensions: ["availability"],
						left_occurrence_id: null,
						right_occurrence_id: null,
						left_artifact_id: null,
						right_artifact_id: null,
						evidence_links: [...evidenceLinks]
					});
					continue;
				}
				const leftOccurrence = leftMatches[0];
				const rightOccurrence = rightMatches[0];
				const change = classifyPath({
					path,
					leftOccurrence,
					rightOccurrence,
					leftNode: nodeFor(leftOccurrence, leftNodes),
					rightNode: nodeFor(rightOccurrence, rightNodes),
					leftRelations: leftRelations.get(path) ?? [],
					rightRelations: rightRelations.get(path) ?? [],
					rootCovered: coverage.root,
					entriesCovered: coverage.entries,
					evidenceLinks
				});
				if (change !== null) output.push(change);
			}
			return {
				changes: output,
				hasAmbiguousDuplicatePaths
			};
		};
		occurrencesByPath = (occurrences) => {
			const output = new Map();
			for (const occurrence of occurrences) {
				const matches = output.get(occurrence.logical_path);
				if (matches === undefined) output.set(occurrence.logical_path, [occurrence]);
				else matches.push(occurrence);
			}
			return output;
		};
		buildArtifactChangeBase = (input) => ({
			logical_path: input.path,
			left_occurrence_id: input.leftOccurrence?.occurrence_id ?? null,
			right_occurrence_id: input.rightOccurrence?.occurrence_id ?? null,
			left_artifact_id: input.leftOccurrence?.artifact_id ?? null,
			right_artifact_id: input.rightOccurrence?.artifact_id ?? null,
			evidence_links: [...input.evidenceLinks]
		});
		classifyPresence = (input) => {
			const covered = input.path === "." ? input.rootCovered : input.entriesCovered;
			if (input.leftOccurrence === undefined) return {
				...buildArtifactChangeBase(input),
				classification: covered ? "added" : "unknown",
				dimensions: [covered ? "content" : "availability"]
			};
			if (input.rightOccurrence === undefined) return {
				...buildArtifactChangeBase(input),
				classification: covered ? "removed" : "unknown",
				dimensions: [covered ? "content" : "availability"]
			};
			return null;
		};
		classifyIntegrity = (input, base) => {
			if (input.leftOccurrence?.hash_status === "mismatched" || input.rightOccurrence?.hash_status === "mismatched") return {
				...base,
				classification: "contradiction",
				dimensions: ["integrity"]
			};
			return null;
		};
		classifyAvailability = (input, base) => {
			if (input.leftOccurrence?.hash_status !== "verified" || input.rightOccurrence?.hash_status !== "verified" || input.leftNode === undefined || input.rightNode === undefined) return {
				...base,
				classification: "unknown",
				dimensions: ["availability"]
			};
			return null;
		};
		classifyPath = (input) => {
			const presence = classifyPresence(input);
			if (presence !== null) return presence;
			const base = buildArtifactChangeBase(input);
			const integrity = classifyIntegrity(input, base);
			if (integrity !== null) return integrity;
			const availability = classifyAvailability(input, base);
			if (availability !== null) return availability;
			const dimensions = changedDimensions(input);
			return dimensions.length === 0 ? null : {
				...base,
				classification: "changed",
				dimensions
			};
		};
		changedDimensions = (input) => {
			const left = input.leftNode;
			const right = input.rightNode;
			if (left === undefined || right === undefined) return ["availability"];
			const checks = [
				["content", left.sha256 !== right.sha256],
				["kind", input.leftOccurrence?.artifact_kind !== input.rightOccurrence?.artifact_kind],
				["format", left.format !== right.format || input.leftOccurrence?.artifact_format !== input.rightOccurrence?.artifact_format],
				["size", left.size !== right.size],
				["executable", input.leftOccurrence?.executable !== input.rightOccurrence?.executable],
				["relations", JSON.stringify(input.leftRelations) !== JSON.stringify(input.rightRelations)],
				["metadata", metadataChanged(input, left, right)]
			];
			return checks.filter(([, changed]) => changed).map(([dimension]) => dimension);
		};
		metadataChanged = (input, left, right) => left.media_type !== right.media_type || left.architecture !== right.architecture || left.content_state !== right.content_state || input.leftOccurrence?.entry_kind !== input.rightOccurrence?.entry_kind || input.leftOccurrence?.encrypted !== input.rightOccurrence?.encrypted || JSON.stringify(left.limitations) !== JSON.stringify(right.limitations) || JSON.stringify(input.leftOccurrence?.limitations) !== JSON.stringify(input.rightOccurrence?.limitations);
		nodeFor = (occurrence, nodes) => occurrence?.artifact_id === null || occurrence?.artifact_id === undefined ? undefined : nodes.get(occurrence.artifact_id);
		relationsByPath = (inventory) => {
			const output = new Map();
			const occurrences = new Map(inventory.occurrences.map((item) => [item.occurrence_id, item]));
			for (const edge of inventory.edges) {
				const occurrence = occurrences.get(edge.occurrence_id);
				if (occurrence?.artifact_id === null || occurrence === undefined) continue;
				const path = occurrence.logical_path;
				const values = output.get(path);
				const projection = {
					parent_logical_path: occurrence.parent_occurrence_id === null ? null : occurrences.get(occurrence.parent_occurrence_id)?.logical_path ?? null,
					child_artifact_id: occurrence.artifact_id,
					relation: edge.relation,
					logical_path: occurrence.logical_path,
					producer: edge.producer
				};
				if (values === undefined) output.set(path, [projection]);
				else values.push(projection);
			}
			for (const values of output.values()) values.sort((left, right) => compareUnicodeCodePoints(canonicalJson$1(left), canonicalJson$1(right)));
			return output;
		};
		summarize = (left, right, changes, covered) => {
			const counts = {
				added: 0,
				removed: 0,
				changed: 0,
				unknown: 0,
				contradiction: 0
			};
			for (const change of changes) counts[change.classification] += 1;
			return {
				unchanged: covered ? Math.max(0, left.occurrences.length - counts.removed - counts.changed - counts.contradiction - counts.unknown) : 0,
				...counts,
				unknown: covered ? counts.unknown : Math.max(counts.unknown, Math.max(left.manifest.occurrence_count, right.manifest.occurrence_count) - counts.added - counts.removed - counts.changed - counts.contradiction)
			};
		};
		applyRootHashChange = (left, right, changes, evidenceLinks) => {
			if (left.manifest.root_sha256 === right.manifest.root_sha256) return;
			const index = changes.findIndex((change) => change.logical_path === ".");
			const existing = changes[index];
			if (existing !== undefined) {
				if (existing.dimensions.includes("content") || existing.classification !== "unknown" && existing.classification !== "changed") return;
				changes[index] = {
					...existing,
					classification: "changed",
					dimensions: comparisonDimensionSchema.options.filter((dimension) => dimension === "content" || existing.dimensions.includes(dimension)),
					evidence_links: [...new Set([...existing.evidence_links, ...evidenceLinks])]
				};
				return;
			}
			const leftRoot = left.occurrences.find((occurrence) => occurrence.logical_path === ".");
			const rightRoot = right.occurrences.find((occurrence) => occurrence.logical_path === ".");
			changes.push({
				classification: "changed",
				logical_path: ".",
				dimensions: ["content"],
				left_occurrence_id: leftRoot?.occurrence_id ?? null,
				right_occurrence_id: rightRoot?.occurrence_id ?? null,
				left_artifact_id: leftRoot?.artifact_id ?? null,
				right_artifact_id: rightRoot?.artifact_id ?? null,
				evidence_links: [...evidenceLinks]
			});
		};
	})))();
}

//#endregion
//#region dist/domain/comparisonStatus.js
var comparisonStatusSchema;
function init_comparisonStatus() {
	return (init_comparisonStatus = __esmMin((() => {
		comparisonStatusSchema = z.enum([
			"unchanged",
			"changed",
			"unknown"
		]);
	})))();
}

//#endregion
//#region dist/domain/bundleComparison.js
var evidenceIdSchema$5, classificationSchema, bundleComparisonInputSchema, bundleChangeSchema, bundleComparisonResultSchema, compareBundles, compareRecords, compareUnknowns, unknownChange, histories, historyEvidenceIds, bundleDigest, same, isPrefix, ascii, compareChanges;
function init_bundleComparison() {
	return (init_bundleComparison = __esmMin((() => {
		init_evidenceBundle();
		init_digests();
		init_comparisonStatus();
		init_localPath();
		evidenceIdSchema$5 = prefixedDigestSchema("ev");
		classificationSchema = z.enum([
			"added",
			"removed",
			"changed",
			"unknown",
			"history_advanced",
			"history_diverged"
		]);
		bundleComparisonInputSchema = z.strictObject({
			left_bundle_path: localPathStringSchema,
			right_bundle_path: localPathStringSchema,
			record_pairs: z.array(z.object({
				left_evidence_id: evidenceIdSchema$5,
				right_evidence_id: evidenceIdSchema$5
			})).default([])
		});
		bundleChangeSchema = z.object({
			entity: z.enum(["evidence", "residual_unknown"]),
			key: z.string().min(1),
			classification: classificationSchema,
			conclusion_kind: z.enum([
				"observed_change",
				"contradiction",
				"unresolved_branch"
			]),
			left_evidence_ids: z.array(evidenceIdSchema$5),
			right_evidence_ids: z.array(evidenceIdSchema$5),
			left_digest: digestSchema.nullable(),
			right_digest: digestSchema.nullable(),
			limitations: z.array(z.string())
		});
		bundleComparisonResultSchema = z.object({
			status: comparisonStatusSchema,
			left_bundle_sha256: digestSchema,
			right_bundle_sha256: digestSchema,
			summary: z.object({
				records_unchanged: z.number().int().min(0),
				records_added: z.number().int().min(0),
				records_removed: z.number().int().min(0),
				records_changed: z.number().int().min(0),
				unknowns_unchanged: z.number().int().min(0),
				unknowns_added: z.number().int().min(0),
				unknowns_removed: z.number().int().min(0),
				unknowns_advanced: z.number().int().min(0),
				unknowns_diverged: z.number().int().min(0),
				unresolved: z.number().int().min(0)
			}),
			changes: z.array(bundleChangeSchema),
			limitations: z.array(z.string())
		});
		compareBundles = (leftInput, rightInput, recordPairs = []) => {
			const left = parseEvidenceBundle(leftInput);
			const right = parseEvidenceBundle(rightInput);
			const leftDigest = bundleDigest(left);
			const rightDigest = bundleDigest(right);
			const recordResult = compareRecords(left, right, recordPairs);
			const unknownResult = compareUnknowns(left, right);
			const changes = [...recordResult.changes, ...unknownResult.changes].sort(compareChanges);
			const unresolved = changes.filter(({ conclusion_kind: kind }) => kind !== "observed_change").length;
			return bundleComparisonResultSchema.parse({
				status: unresolved > 0 ? "unknown" : changes.length > 0 ? "changed" : "unchanged",
				left_bundle_sha256: leftDigest,
				right_bundle_sha256: rightDigest,
				summary: {
					...recordResult.summary,
					...unknownResult.summary,
					unresolved
				},
				changes,
				limitations: changes.some(({ limitations }) => limitations.length > 0) ? ["EvidenceBundle has no inventory completeness marker; one-sided membership remains unknown."] : []
			});
		};
		compareRecords = (left, right, pairs) => {
			const leftIds = new Set(left.records.map(({ evidence_id: id }) => id));
			const rightIds = new Set(right.records.map(({ evidence_id: id }) => id));
			const pairedLeft = new Set();
			const pairedRight = new Set();
			const changes = [];
			let changed = 0;
			for (const pair of pairs) {
				if (!leftIds.has(pair.left_evidence_id)) throw new TypeError(`Explicit pair references missing left evidence ${pair.left_evidence_id}`);
				if (!rightIds.has(pair.right_evidence_id)) throw new TypeError(`Explicit pair references missing right evidence ${pair.right_evidence_id}`);
				if (pairedLeft.has(pair.left_evidence_id) || pairedRight.has(pair.right_evidence_id)) throw new TypeError("Explicit evidence pairs must be one-to-one");
				pairedLeft.add(pair.left_evidence_id);
				pairedRight.add(pair.right_evidence_id);
				if (pair.left_evidence_id === pair.right_evidence_id) continue;
				changed += 1;
				changes.push({
					entity: "evidence",
					key: `pair:${pair.left_evidence_id}:${pair.right_evidence_id}`,
					classification: "changed",
					conclusion_kind: "observed_change",
					left_evidence_ids: [pair.left_evidence_id],
					right_evidence_ids: [pair.right_evidence_id],
					left_digest: pair.left_evidence_id.slice(3),
					right_digest: pair.right_evidence_id.slice(3),
					limitations: []
				});
			}
			const common = [...leftIds].filter((id) => rightIds.has(id) && !pairedLeft.has(id) && !pairedRight.has(id));
			const removed = [...leftIds].filter((id) => !pairedLeft.has(id) && (!rightIds.has(id) || pairedRight.has(id)));
			const added = [...rightIds].filter((id) => !pairedRight.has(id) && (!leftIds.has(id) || pairedLeft.has(id)));
			for (const [ids, side] of [[removed, "left"], [added, "right"]]) for (const id of ids) changes.push({
				entity: "evidence",
				key: id,
				classification: "unknown",
				conclusion_kind: "unresolved_branch",
				left_evidence_ids: side === "left" ? [id] : [],
				right_evidence_ids: side === "right" ? [id] : [],
				left_digest: side === "left" ? id.slice(3) : null,
				right_digest: side === "right" ? id.slice(3) : null,
				limitations: ["EvidenceBundle has no inventory completeness marker; one-sided membership may reflect incomplete capture."]
			});
			return {
				changes,
				summary: {
					records_unchanged: common.length + pairs.length - changed,
					records_added: 0,
					records_removed: 0,
					records_changed: changed
				}
			};
		};
		compareUnknowns = (left, right) => {
			const leftHistories = histories(left.unknowns);
			const rightHistories = histories(right.unknowns);
			const ids = [...new Set([...leftHistories.keys(), ...rightHistories.keys()])];
			const changes = [];
			const summary = {
				unknowns_unchanged: 0,
				unknowns_added: 0,
				unknowns_removed: 0,
				unknowns_advanced: 0,
				unknowns_diverged: 0
			};
			for (const id of ids) {
				const leftHistory = leftHistories.get(id);
				const rightHistory = rightHistories.get(id);
				if (leftHistory === undefined || rightHistory === undefined) {
					changes.push(unknownChange(id, "unknown", leftHistory, rightHistory));
					continue;
				}
				const leftDigests = leftHistory.map(({ revision_digest: digest }) => digest);
				const rightDigests = rightHistory.map(({ revision_digest: digest }) => digest);
				if (same(leftDigests, rightDigests)) {
					summary.unknowns_unchanged += 1;
					continue;
				}
				const advanced = isPrefix(leftDigests, rightDigests) || isPrefix(rightDigests, leftDigests);
				summary[advanced ? "unknowns_advanced" : "unknowns_diverged"] += 1;
				changes.push(unknownChange(id, advanced ? "history_advanced" : "history_diverged", leftHistory, rightHistory));
			}
			return {
				changes,
				summary
			};
		};
		unknownChange = (id, classification, left, right) => ({
			entity: "residual_unknown",
			key: id,
			classification,
			conclusion_kind: classification === "history_diverged" ? "contradiction" : classification === "history_advanced" ? "observed_change" : "unresolved_branch",
			left_evidence_ids: historyEvidenceIds(left ?? []),
			right_evidence_ids: historyEvidenceIds(right ?? []),
			left_digest: left?.at(-1)?.revision_digest ?? null,
			right_digest: right?.at(-1)?.revision_digest ?? null,
			limitations: left === undefined || right === undefined ? ["EvidenceBundle has no inventory completeness marker; one-sided history membership remains unknown."] : []
		});
		histories = (unknowns) => {
			const output = new Map();
			for (const unknown of unknowns) {
				const history = output.get(unknown.unknown_id) ?? [];
				history.push(unknown);
				output.set(unknown.unknown_id, history);
			}
			return output;
		};
		historyEvidenceIds = (history) => [...new Set(history.flatMap((item) => [
			...item.supporting_evidence_ids,
			...item.contradicting_evidence_ids,
			...item.mutation_evidence_ids,
			...item.resolution?.evidence_ids ?? []
		]))].sort(ascii);
		bundleDigest = (bundle) => createHash("sha256").update(serializeEvidenceBundle(bundle)).digest("hex");
		same = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
		isPrefix = (shorter, longer) => shorter.length < longer.length && shorter.every((value, index) => value === longer[index]);
		ascii = (left, right) => left < right ? -1 : left > right ? 1 : 0;
		compareChanges = (left, right) => ascii([
			left.entity,
			left.key,
			left.classification,
			left.left_digest ?? "",
			left.right_digest ?? ""
		].join("\0"), [
			right.entity,
			right.key,
			right.classification,
			right.left_digest ?? "",
			right.right_digest ?? ""
		].join("\0"));
	})))();
}

//#endregion
//#region dist/domain/comparisonSourceEvidence.js
var evidenceIdSchema$4, sideParametersSchema, comparisonSourceEvidenceSides, comparisonSourceEvidenceIds, assertComparisonFindingLinks;
function init_comparisonSourceEvidence() {
	return (init_comparisonSourceEvidence = __esmMin((() => {
		init_canonicalOrdering();
		init_digests();
		evidenceIdSchema$4 = prefixedDigestSchema("ev");
		sideParametersSchema = z.object({
			left_evidence_id: evidenceIdSchema$4.optional(),
			right_evidence_id: evidenceIdSchema$4.optional(),
			left_evidence_ids: z.array(evidenceIdSchema$4).min(1).optional(),
			right_evidence_ids: z.array(evidenceIdSchema$4).min(1).optional()
		});
		comparisonSourceEvidenceSides = (evidence) => {
			const parameters = sideParametersSchema.parse(evidence.parameters);
			if (parameters.left_evidence_id === undefined !== (parameters.right_evidence_id === undefined) || parameters.left_evidence_ids === undefined !== (parameters.right_evidence_ids === undefined)) throw new TypeError("Comparison Evidence source representation omitted one side");
			const side = (single, multiple) => {
				if (single !== undefined && multiple !== undefined && (multiple.length !== 1 || multiple[0] !== single)) throw new TypeError("Comparison Evidence source representations disagree");
				const selected = single === undefined ? multiple ?? [] : [single];
				if (selected.length === 0) throw new TypeError("Comparison Evidence omitted its source parameters");
				if (new Set(selected).size !== selected.length) throw new TypeError("Comparison Evidence repeats a source within one side");
				return selected;
			};
			return {
				left: side(parameters.left_evidence_id, parameters.left_evidence_ids),
				right: side(parameters.right_evidence_id, parameters.right_evidence_ids)
			};
		};
		comparisonSourceEvidenceIds = (evidence) => {
			const sides = comparisonSourceEvidenceSides(evidence);
			return uniqueSorted([...sides.left, ...sides.right]);
		};
		assertComparisonFindingLinks = (evidence, nestedLinks) => {
			const closure = new Set(evidence.evidence_links);
			if (nestedLinks.some((id) => !closure.has(id))) throw new TypeError("Comparison finding cites Evidence outside its top-level closure");
		};
	})))();
}

//#endregion
//#region dist/domain/process/processEvidenceProvider.js
var PROCESS_PROVIDER, isProcessEvidenceProvider;
function init_processEvidenceProvider() {
	return (init_processEvidenceProvider = __esmMin((() => {
		PROCESS_PROVIDER = {
			id: "rea-process",
			name: "REA process capture",
			version: "3"
		};
		isProcessEvidenceProvider = (provider) => provider.id === PROCESS_PROVIDER.id && provider.version === PROCESS_PROVIDER.version && (provider.name === PROCESS_PROVIDER.name || provider.name === "REA deterministic process harness");
	})))();
}

//#endregion
//#region dist/domain/changedBehavior.js
var evidenceIdSchema$3, changedBehaviorInputSchema, findingSchema, changedBehaviorResultSchema, EXPECTED_PROVIDERS, acceptsPredicate, findChangedBehavior, parseComparisonEvidence, parseResult, findingsFor, processFindings, functionFindings, artifactFindings, makeFinding, behaviorStatus, isChange, count, compareFindings, assertUnique$1;
function init_changedBehavior() {
	return (init_changedBehavior = __esmMin((() => {
		init_artifactComparison();
		init_canonicalOrdering();
		init_unicodeCodePointOrder();
		init_comparisonSourceEvidence();
		init_evidence();
		init_functionComparisonSchemas();
		init_processEvidenceProvider();
		init_processComparison();
		init_digests();
		evidenceIdSchema$3 = prefixedDigestSchema("ev");
		changedBehaviorInputSchema = z.strictObject({ comparisons: z.array(evidenceSchema).min(1) });
		findingSchema = z.object({
			scope: z.enum([
				"runtime",
				"protocol",
				"resource",
				"static_candidate"
			]),
			dimension: z.string().min(1),
			classification: z.enum([
				"observed_change",
				"derived_relationship",
				"contradiction",
				"unresolved_branch"
			]),
			status: comparisonStatusSchema$2,
			source_comparison_id: evidenceIdSchema$3,
			evidence_links: z.array(evidenceIdSchema$3).min(2),
			limitations: z.array(z.string())
		});
		changedBehaviorResultSchema = z.object({
			behavior_status: z.enum([
				"observed_changed",
				"observed_unchanged",
				"unknown",
				"truncated"
			]),
			summary: z.object({
				observed_changes: z.number().int().min(0),
				static_candidates: z.number().int().min(0),
				contradictions: z.number().int().min(0),
				unresolved: z.number().int().min(0)
			}),
			findings: z.object({ items: z.array(findingSchema) }),
			evidence_links: z.array(evidenceIdSchema$3).min(2),
			limitations: z.array(z.string())
		}).superRefine((result, context) => {
			const summaryTotal = Object.values(result.summary).reduce((total, count) => total + count, 0);
			if (summaryTotal !== result.findings.items.length) context.addIssue({
				code: "custom",
				message: "Finding classification counts must equal the finding total",
				path: ["summary"]
			});
			if (result.behavior_status === "observed_changed" && result.summary.observed_changes === 0 || result.behavior_status === "observed_unchanged" && result.summary.observed_changes > 0) context.addIssue({
				code: "custom",
				message: "Observed-change status must agree with runtime findings",
				path: ["behavior_status"]
			});
		});
		EXPECTED_PROVIDERS = {
			compare_process_captures: {
				predicates: ["rea.process-comparison"],
				...PROCESS_PROVIDER
			},
			compare_artifacts: {
				predicates: ["rea.artifact-comparison"],
				id: "rea-artifact-comparison",
				name: "REA artifact comparison",
				version: "1"
			},
			compare_functions: {
				predicates: ["rea.function-comparison"],
				id: "rea-function-comparison",
				name: "REA function comparison",
				version: "1"
			}
		};
		acceptsPredicate = (expected, actual) => expected.some((predicate) => predicate === actual);
		findChangedBehavior = (input) => {
			const { comparisons } = z.strictObject({ comparisons: z.array(z.unknown()).min(1) }).parse(input);
			const evidence = comparisons.map(parseComparisonEvidence);
			assertUnique$1(evidence.map(({ evidence: { evidence_id: id } }) => id), "comparison Evidence");
			const findings = evidence.flatMap(findingsFor).sort(compareFindings);
			const runtimeStatuses = evidence.flatMap((comparison) => comparison.operation === "compare_process_captures" ? [comparison.result.status] : []);
			const links = uniqueSorted(evidence.flatMap(({ evidence: item }) => [item.evidence_id, ...item.evidence_links]));
			const result = changedBehaviorResultSchema.parse({
				behavior_status: behaviorStatus(runtimeStatuses),
				summary: {
					observed_changes: count(findings, "observed_change"),
					static_candidates: count(findings, "derived_relationship"),
					contradictions: count(findings, "contradiction"),
					unresolved: count(findings, "unresolved_branch")
				},
				findings: { items: findings },
				evidence_links: links,
				limitations: uniqueSorted([
					...evidence.flatMap(({ evidence: item }) => item.limitations),
					...evidence.some(({ operation }) => operation !== "compare_process_captures") ? ["Static differences are behavior candidates, not runtime observations."] : [],
					...runtimeStatuses.length === 0 ? ["No process comparison Evidence was supplied."] : []
				])
			});
			return {
				result,
				comparisonEvidenceIds: evidence.map(({ evidence: { evidence_id } }) => evidence_id)
			};
		};
		parseComparisonEvidence = (input) => {
			const evidence = parseEvidence(input);
			if (!(evidence.operation in EXPECTED_PROVIDERS)) throw new TypeError("Changed-behavior analysis requires process, artifact, or function comparison Evidence");
			const operation = z.enum([
				"compare_process_captures",
				"compare_artifacts",
				"compare_functions"
			]).parse(evidence.operation);
			const expected = EXPECTED_PROVIDERS[operation];
			if (!acceptsPredicate(expected.predicates, evidence.predicate_type) || (operation === "compare_process_captures" ? !isProcessEvidenceProvider(evidence.provider) : evidence.provider.id !== expected.id || evidence.provider.name !== expected.name || evidence.provider.version !== expected.version) || evidence.confidence !== "derived" || evidence.authority !== "analyst-inference" || evidence.subject !== null) throw new TypeError("Comparison Evidence operation, predicate, and provider disagree");
			if (!comparisonSourceEvidenceIds(evidence).every((id) => evidence.evidence_links.includes(id))) throw new TypeError("Comparison Evidence must cite both selected source observations");
			return parseResult(evidence, operation);
		};
		parseResult = (evidence, operation) => {
			if (operation === "compare_process_captures") {
				const result = processCaptureComparisonSchema.parse(evidence.normalized_result);
				const expected = deriveProcessComparisonStatus(PROCESS_COMPARISON_DIMENSIONS.map((dimension) => result[dimension]));
				if (result.status !== expected) throw new TypeError("Process comparison status contradicts its dimensions");
				return {
					operation,
					evidence,
					result
				};
			}
			if (operation === "compare_functions") {
				const result = functionComparisonResultSchema.parse(evidence.normalized_result);
				assertComparisonFindingLinks(evidence, result.dimensions.flatMap(({ evidence_links: links }) => links));
				return {
					operation,
					evidence,
					result
				};
			}
			const result = artifactComparisonResultSchema.parse(evidence.normalized_result);
			assertComparisonFindingLinks(evidence, result.changes.flatMap(({ evidence_links: links }) => links));
			return {
				operation,
				evidence,
				result
			};
		};
		findingsFor = (comparison) => {
			if (comparison.operation === "compare_process_captures") return processFindings(comparison);
			if (comparison.operation === "compare_functions") return functionFindings(comparison);
			return artifactFindings(comparison);
		};
		processFindings = (comparison) => {
			const { evidence, result } = comparison;
			const dimensions = [
				[
					"terminal",
					result.terminal,
					"runtime"
				],
				[
					"interaction",
					result.interaction,
					"runtime"
				],
				[
					"exit",
					result.exit,
					"runtime"
				],
				[
					"filesystem",
					result.filesystem,
					"resource"
				],
				[
					"process",
					result.process,
					"runtime"
				]
			];
			return dimensions.flatMap(([dimension, status, scope]) => status === "unchanged" ? [] : [makeFinding({
				evidence,
				dimension,
				scope,
				status,
				classification: isChange(status) ? "observed_change" : "unresolved_branch",
				limitations: result.limitations
			})]);
		};
		functionFindings = (comparison) => {
			const { evidence, result } = comparison;
			return result.dimensions.flatMap((dimension) => dimension.status === "unchanged" ? [] : [makeFinding({
				evidence,
				dimension: dimension.dimension,
				scope: "static_candidate",
				status: dimension.status,
				classification: dimension.status === "unknown" ? "unresolved_branch" : dimension.conclusion_kind,
				limitations: dimension.limitations,
				links: dimension.evidence_links
			})]);
		};
		artifactFindings = (comparison) => {
			const { evidence, result } = comparison;
			const changes = result.changes.map((change) => makeFinding({
				evidence,
				dimension: `artifact:${change.logical_path}`,
				scope: "static_candidate",
				status: change.classification,
				classification: change.classification === "contradiction" ? "contradiction" : change.classification === "unknown" ? "unresolved_branch" : "derived_relationship",
				limitations: result.limitations,
				links: change.evidence_links
			}));
			return (result.status === "unknown" || result.status === "truncated") && !changes.some(({ classification }) => classification === "unresolved_branch") ? [...changes, makeFinding({
				evidence,
				dimension: "artifact:coverage",
				scope: "static_candidate",
				status: result.status,
				classification: "unresolved_branch",
				limitations: result.limitations
			})] : changes;
		};
		makeFinding = (input) => findingSchema.parse({
			scope: input.scope,
			dimension: input.dimension,
			classification: input.classification,
			status: input.status,
			source_comparison_id: input.evidence.evidence_id,
			evidence_links: uniqueSorted([input.evidence.evidence_id, ...input.links ?? input.evidence.evidence_links]),
			limitations: uniqueSorted(input.limitations)
		});
		behaviorStatus = (statuses) => {
			if (statuses.length === 0) return "unknown";
			if (statuses.includes("truncated")) return "truncated";
			if (statuses.includes("unknown")) return "unknown";
			return statuses.some(isChange) ? "observed_changed" : "observed_unchanged";
		};
		isChange = (status) => status === "added" || status === "removed" || status === "changed";
		count = (findings, classification) => findings.filter((finding) => finding.classification === classification).length;
		compareFindings = (left, right) => compareUnicodeCodePoints(compositeKey([
			left.scope,
			left.dimension,
			left.source_comparison_id
		]), compositeKey([
			right.scope,
			right.dimension,
			right.source_comparison_id
		]));
		assertUnique$1 = (values, label) => {
			if (new Set(values).size !== values.length) throw new TypeError(`Changed-behavior analysis rejects duplicate ${label}`);
		};
	})))();
}

//#endregion
//#region dist/domain/callPathSchemas.js
var addressSchema, inputAddressSchema, evidenceIdSchema$2, parseCallPathAddress, callPathInputSchema, citedNodeSchema, citedEdgeSchema, pathSchema, resultContextShape, callPathResultSchema;
function init_callPathSchemas() {
	return (init_callPathSchemas = __esmMin((() => {
		init_emptyArraySchema();
		init_evidence();
		init_digests();
		addressSchema = z.string().regex(/^(?:(?:[A-Za-z0-9._~\x2d]|%[0-9A-F]{2})+:)?0x(?:0|[1-9a-f][0-9a-f]*)$/u);
		inputAddressSchema = z.string().regex(/^(?:(?:[A-Za-z0-9._~\x2d]|%[0-9a-fA-F]{2})+:)?0[xX][0-9a-fA-F]+$/u).transform((address) => {
			const separator = address.lastIndexOf(":") + 1;
			const space = address.slice(0, separator).replace(/%[0-9a-fA-F]{2}/gu, (escape) => escape.toUpperCase());
			return `${space}0x${BigInt(address.slice(separator)).toString(16)}`;
		});
		evidenceIdSchema$2 = prefixedDigestSchema("ev");
		parseCallPathAddress = (input) => inputAddressSchema.parse(input);
		callPathInputSchema = z.strictObject({
			functions: z.array(evidenceSchema).min(1),
			start: z.object({ address: inputAddressSchema }).strict(),
			goal: z.object({ address: inputAddressSchema }).strict()
		});
		citedNodeSchema = z.object({
			address: addressSchema,
			name: z.string().nullable(),
			evidence_links: z.array(evidenceIdSchema$2).min(1)
		});
		citedEdgeSchema = z.object({
			source: addressSchema,
			target: addressSchema,
			evidence_links: z.array(evidenceIdSchema$2).min(1)
		});
		pathSchema = z.object({
			hops: z.number().int().min(0),
			nodes: z.array(citedNodeSchema).min(1),
			edges: z.array(citedEdgeSchema),
			evidence_links: z.array(evidenceIdSchema$2).min(1)
		}).superRefine((path, context) => {
			const edgesConnectNodes = path.edges.every((edge, index) => edge.source === path.nodes[index]?.address && edge.target === path.nodes[index + 1]?.address);
			if (path.hops !== path.edges.length || path.nodes.length !== path.edges.length + 1 || !edgesConnectNodes) context.addIssue({
				code: "custom",
				message: "Path hops and edges must connect the ordered nodes"
			});
		});
		resultContextShape = {
			start: addressSchema,
			goal: addressSchema,
			explored: z.object({
				nodes: z.number().int().min(0),
				edges: z.number().int().min(0),
				depth_reached: z.number().int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema$2).min(1),
			limitations: z.array(z.string())
		};
		callPathResultSchema = z.union([
			z.object({
				...resultContextShape,
				status: z.literal("found"),
				shortest_hops: z.number().int().min(0),
				search_scope: z.object({ exhaustive: z.boolean() }),
				paths: z.array(pathSchema).min(1)
			}),
			z.object({
				...resultContextShape,
				status: z.literal("not_found"),
				shortest_hops: z.null(),
				search_scope: z.object({ exhaustive: z.literal(true) }),
				paths: emptyArraySchema
			}),
			z.object({
				...resultContextShape,
				status: z.literal("unknown"),
				shortest_hops: z.null(),
				search_scope: z.object({ exhaustive: z.literal(false) }),
				paths: emptyArraySchema
			})
		]);
	})))();
}

//#endregion
//#region dist/domain/staticRuntimeCorrelation.js
var evidenceIdSchema$1, functionDimensionSchema, runtimeDimensionSchema, expectedPatternSchema, observedPatternSchema, artifactSelectorSchema, functionSelectorSchema, staticSelectorSchema, mappingSchema, staticRuntimeCorrelationInputSchema, correlationItemSchema, staticRuntimeCorrelationResultSchema, EXPECTED, correlateStaticAndRuntime, correlate, selectStatic, parseStatic, parseRuntime, assertComparisonIdentity, observedPattern, required, byId, assertUnique, sha256, canonicalJson;
function init_staticRuntimeCorrelation() {
	return (init_staticRuntimeCorrelation = __esmMin((() => {
		init_artifactComparison();
		init_canonicalOrdering();
		init_unicodeCodePointOrder();
		init_comparisonSourceEvidence();
		init_evidence();
		init_functionComparisonSchemas();
		init_processEvidenceProvider();
		init_processComparison();
		init_digests();
		evidenceIdSchema$1 = prefixedDigestSchema("ev");
		functionDimensionSchema = z.enum([
			"identity",
			"pseudocode",
			"assembly",
			"comments",
			"calls",
			"references",
			"strings_names",
			"cfg"
		]);
		runtimeDimensionSchema = z.enum(PROCESS_COMPARISON_DIMENSIONS);
		expectedPatternSchema = z.enum([
			"cochanged",
			"static_only",
			"runtime_only",
			"both_unchanged"
		]);
		observedPatternSchema = z.enum([
			...expectedPatternSchema.options,
			"unknown",
			"truncated"
		]);
		artifactSelectorSchema = z.object({
			kind: z.literal("artifact"),
			logical_path: z.string().min(1)
		}).strict();
		functionSelectorSchema = z.object({
			kind: z.literal("function"),
			dimension: functionDimensionSchema
		}).strict();
		staticSelectorSchema = z.discriminatedUnion("kind", [artifactSelectorSchema, functionSelectorSchema]);
		mappingSchema = z.object({
			static: z.object({
				comparison_evidence_id: evidenceIdSchema$1,
				selector: staticSelectorSchema
			}).strict(),
			runtime: z.object({
				comparison_evidence_id: evidenceIdSchema$1,
				dimension: runtimeDimensionSchema
			}).strict(),
			side_alignment: z.enum(["left_to_left", "left_to_right"]),
			hypothesis: z.object({
				statement: z.string().trim().min(1),
				expected_pattern: expectedPatternSchema
			}).strict()
		}).strict();
		staticRuntimeCorrelationInputSchema = z.object({
			static_comparisons: z.array(evidenceSchema).min(1),
			runtime_comparisons: z.array(evidenceSchema).min(1),
			mappings: z.array(mappingSchema).min(1)
		}).strict();
		correlationItemSchema = z.object({
			correlation_id: prefixedDigestSchema("cor"),
			static: z.object({
				comparison_evidence_id: evidenceIdSchema$1,
				selector: staticSelectorSchema,
				status: comparisonStatusSchema$2,
				conclusion_kind: z.enum([
					"derived_relationship",
					"contradiction",
					"unresolved_branch"
				])
			}),
			runtime: z.object({
				comparison_evidence_id: evidenceIdSchema$1,
				dimension: runtimeDimensionSchema,
				status: comparisonStatusSchema$2
			}),
			side_alignment: z.enum(["left_to_left", "left_to_right"]),
			hypothesis: z.object({
				statement: z.string().min(1),
				expected_pattern: expectedPatternSchema
			}),
			observed_pattern: observedPatternSchema,
			classification: z.enum([
				"hypothesis",
				"contradiction",
				"unresolved_branch"
			]),
			evidence_links: z.array(evidenceIdSchema$1).min(2),
			limitations: z.array(z.string())
		});
		staticRuntimeCorrelationResultSchema = z.object({
			status: z.enum([
				"correlated",
				"contradicted",
				"unknown",
				"truncated"
			]),
			summary: z.object({
				hypotheses: z.number().int().min(0),
				contradictions: z.number().int().min(0),
				unresolved: z.number().int().min(0)
			}),
			correlations: z.object({ items: z.array(correlationItemSchema) }),
			evidence_links: z.array(evidenceIdSchema$1).min(2),
			limitations: z.array(z.string())
		});
		EXPECTED = {
			compare_artifacts: [
				"rea.artifact-comparison",
				"rea-artifact-comparison",
				"REA artifact comparison"
			],
			compare_functions: [
				"rea.function-comparison",
				"rea-function-comparison",
				"REA function comparison"
			],
			compare_process_captures: [
				"rea.process-comparison",
				PROCESS_PROVIDER.id,
				PROCESS_PROVIDER.name
			]
		};
		correlateStaticAndRuntime = (input) => {
			const parsed = staticRuntimeCorrelationInputSchema.parse(input);
			const staticEvidence = parsed.static_comparisons.map(parseStatic);
			const runtimeEvidence = parsed.runtime_comparisons.map(parseRuntime);
			assertUnique(staticEvidence, "static comparison Evidence");
			assertUnique(runtimeEvidence, "runtime comparison Evidence");
			const staticById = byId(staticEvidence);
			const runtimeById = byId(runtimeEvidence);
			const correlations = parsed.mappings.map((mapping) => correlate(mapping, staticById, runtimeById)).sort((left, right) => compareUnicodeCodePoints(left.correlation_id, right.correlation_id));
			if (new Set(correlations.map(({ correlation_id: id }) => id)).size !== correlations.length) throw new TypeError("Static/runtime correlation rejects duplicate mappings");
			const links = uniqueSorted(correlations.flatMap(({ evidence_links: evidenceLinks }) => evidenceLinks));
			const unresolved = correlations.filter(({ classification }) => classification === "unresolved_branch");
			const contradictions = correlations.filter(({ classification }) => classification === "contradiction");
			return staticRuntimeCorrelationResultSchema.parse({
				status: correlations.some(({ observed_pattern: pattern }) => pattern === "truncated") ? "truncated" : unresolved.length > 0 ? "unknown" : contradictions.length > 0 ? "contradicted" : "correlated",
				summary: {
					hypotheses: correlations.length - contradictions.length - unresolved.length,
					contradictions: contradictions.length,
					unresolved: unresolved.length
				},
				correlations: { items: correlations },
				evidence_links: links,
				limitations: ["Mappings are caller-declared hypotheses; consistency does not establish causality.", "Only explicit mappings were evaluated; similar unmapped observations were not correlated."]
			});
		};
		correlate = (mapping, staticById, runtimeById) => {
			const staticEvidence = required(staticById, mapping.static.comparison_evidence_id, "static comparison");
			const runtimeEvidence = required(runtimeById, mapping.runtime.comparison_evidence_id, "runtime comparison");
			const { limitations: selectedLimitations, ...selectedStatic } = selectStatic(staticEvidence, mapping.static.selector);
			const process = processCaptureComparisonSchema.parse(runtimeEvidence.normalized_result);
			const runtimeStatus = process[mapping.runtime.dimension];
			const pattern = observedPattern(selectedStatic.status, runtimeStatus);
			const classification = pattern === "unknown" || pattern === "truncated" ? "unresolved_branch" : pattern === mapping.hypothesis.expected_pattern ? "hypothesis" : "contradiction";
			const projection = {
				static: mapping.static,
				runtime: mapping.runtime,
				side_alignment: mapping.side_alignment,
				hypothesis: mapping.hypothesis
			};
			return correlationItemSchema.parse({
				correlation_id: `cor_${sha256(canonicalJson(projection))}`,
				static: {
					...mapping.static,
					...selectedStatic
				},
				runtime: {
					...mapping.runtime,
					status: runtimeStatus
				},
				side_alignment: mapping.side_alignment,
				hypothesis: mapping.hypothesis,
				observed_pattern: pattern,
				classification,
				evidence_links: uniqueSorted([
					staticEvidence.evidence_id,
					...staticEvidence.evidence_links,
					runtimeEvidence.evidence_id,
					...runtimeEvidence.evidence_links
				]),
				limitations: uniqueSorted([
					...staticEvidence.limitations,
					...selectedLimitations,
					...runtimeEvidence.limitations,
					...process.limitations,
					"This correlation tests an explicit hypothesis and does not establish causality.",
					"Side alignment is caller-declared and was not independently validated against source subjects or environments."
				])
			});
		};
		selectStatic = (evidence, selector) => {
			if (selector.kind === "function") {
				if (evidence.operation !== "compare_functions") throw new TypeError("Function selector requires function comparison Evidence");
				const result = functionComparisonResultSchema.parse(evidence.normalized_result);
				const matches = result.dimensions.filter(({ dimension }) => dimension === selector.dimension);
				const match = matches.at(0);
				if (matches.length !== 1 || match === undefined) throw new TypeError("Function selector must resolve exactly once");
				return {
					status: match.status,
					conclusion_kind: match.conclusion_kind,
					limitations: match.limitations
				};
			}
			if (evidence.operation !== "compare_artifacts") throw new TypeError("Artifact selector requires artifact comparison Evidence");
			const result = artifactComparisonResultSchema.parse(evidence.normalized_result);
			const matches = result.changes.filter(({ logical_path: path }) => path === selector.logical_path);
			const match = matches.at(0);
			if (matches.length !== 1 || match === undefined) throw new TypeError("Artifact selector must resolve exactly one reported delta");
			const status = match.classification;
			return {
				status,
				limitations: [],
				conclusion_kind: status === "contradiction" ? "contradiction" : status === "unknown" ? "unresolved_branch" : "derived_relationship"
			};
		};
		parseStatic = (input) => {
			const evidence = parseEvidence(input);
			if (evidence.operation !== "compare_artifacts" && evidence.operation !== "compare_functions") throw new TypeError("Static/runtime correlation requires artifact or function comparison Evidence");
			assertComparisonIdentity(evidence);
			if (evidence.operation === "compare_artifacts") {
				const result = artifactComparisonResultSchema.parse(evidence.normalized_result);
				assertComparisonFindingLinks(evidence, result.changes.flatMap(({ evidence_links: links }) => links));
			} else {
				const result = functionComparisonResultSchema.parse(evidence.normalized_result);
				assertComparisonFindingLinks(evidence, result.dimensions.flatMap(({ evidence_links: links }) => links));
			}
			return evidence;
		};
		parseRuntime = (input) => {
			const evidence = parseEvidence(input);
			if (evidence.operation !== "compare_process_captures") throw new TypeError("Static/runtime correlation requires process comparison Evidence");
			assertComparisonIdentity(evidence);
			processCaptureComparisonSchema.parse(evidence.normalized_result);
			return evidence;
		};
		assertComparisonIdentity = (evidence) => {
			const expected = EXPECTED[evidence.operation];
			if (expected === undefined || !(Array.isArray(expected[0]) ? expected[0].includes(evidence.predicate_type) : evidence.predicate_type === expected[0]) || (evidence.operation === "compare_process_captures" ? !isProcessEvidenceProvider(evidence.provider) : evidence.provider.id !== expected[1] || evidence.provider.name !== expected[2] || evidence.provider.version !== "1") || evidence.confidence !== "derived" || evidence.authority !== "analyst-inference" || evidence.subject !== null) throw new TypeError("Comparison Evidence operation, predicate, provider, or citations disagree");
			const expectedLinks = comparisonSourceEvidenceIds(evidence);
			const actualLinks = uniqueSorted(evidence.evidence_links);
			if (expectedLinks.length !== actualLinks.length || expectedLinks.some((id, index) => id !== actualLinks[index])) throw new TypeError("Comparison Evidence closure disagrees with its source parameters");
		};
		observedPattern = (staticStatus, runtimeStatus) => {
			if (staticStatus === "truncated" || runtimeStatus === "truncated") return "truncated";
			if (staticStatus === "unknown" || runtimeStatus === "unknown") return "unknown";
			const staticChanged = staticStatus !== "unchanged";
			const runtimeChanged = runtimeStatus !== "unchanged";
			if (staticChanged && runtimeChanged) return "cochanged";
			if (staticChanged) return "static_only";
			if (runtimeChanged) return "runtime_only";
			return "both_unchanged";
		};
		required = (values, id, label) => {
			const value = values.get(id);
			if (value === undefined) throw new TypeError(`Mapping references absent ${label} Evidence`);
			return value;
		};
		byId = (evidence) => new Map(evidence.map((item) => [item.evidence_id, item]));
		assertUnique = (evidence, label) => {
			if (new Set(evidence.map(({ evidence_id: id }) => id)).size !== evidence.length) throw new TypeError(`Static/runtime correlation rejects duplicate ${label}`);
		};
		sha256 = (value) => createHash("sha256").update(value).digest("hex");
		canonicalJson = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("RFC 8785 canonicalization rejected correlation mapping");
			return serialized;
		};
	})))();
}

//#endregion
//#region dist/domain/reconstructionVerificationSchemas.js
var evidenceIdSchema, unknownIdSchema, claimIdSchema, titleSchema, verificationStatusSchema, commonClaim, behavioralClaimSchema, functionClaimSchema, artifactClaimSchema, reconstructionClaimSchema, reconstructionSpecificationSchema, reconstructionVerificationInputSchema, reconstructionClaimResultSchema, reconstructionVerificationResultSchema;
function init_reconstructionVerificationSchemas() {
	return (init_reconstructionVerificationSchemas = __esmMin((() => {
		init_stringPatterns();
		init_digests();
		init_processComparison();
		evidenceIdSchema = prefixedDigestSchema("ev");
		unknownIdSchema = prefixedDigestSchema("unk");
		claimIdSchema = z.string().regex(IDENTIFIER_PATTERN);
		titleSchema = z.string().trim().min(1);
		verificationStatusSchema = z.enum([
			"pass",
			"fail",
			"unknown"
		]);
		commonClaim = {
			claim_id: claimIdSchema,
			title: titleSchema,
			comparison_evidence_id: evidenceIdSchema
		};
		behavioralClaimSchema = z.object({
			...commonClaim,
			kind: z.literal("behavioral"),
			dimension: z.enum(["overall", ...PROCESS_COMPARISON_DIMENSIONS])
		});
		functionClaimSchema = z.object({
			...commonClaim,
			kind: z.literal("structural-function"),
			dimension: z.enum([
				"overall",
				"identity",
				"pseudocode",
				"assembly",
				"comments",
				"calls",
				"references",
				"strings_names",
				"cfg"
			])
		});
		artifactClaimSchema = z.object({
			...commonClaim,
			kind: z.literal("structural-artifact"),
			dimension: z.literal("overall")
		});
		reconstructionClaimSchema = z.discriminatedUnion("kind", [
			behavioralClaimSchema,
			functionClaimSchema,
			artifactClaimSchema
		]);
		reconstructionSpecificationSchema = z.object({
			name: z.string().trim().min(1),
			claims: z.array(reconstructionClaimSchema).min(1)
		}).superRefine((value, context) => {
			const ids = value.claims.map(({ claim_id: id }) => id);
			if (new Set(ids).size !== ids.length) context.addIssue({
				code: "custom",
				message: "Claim IDs must be unique"
			});
			const selectors = value.claims.map(({ kind, comparison_evidence_id: id, dimension }) => `${kind}:${id}:${dimension}`);
			if (new Set(selectors).size !== selectors.length) context.addIssue({
				code: "custom",
				message: "Claim comparison selectors must be unique"
			});
		});
		reconstructionVerificationInputSchema = z.strictObject({ specification: reconstructionSpecificationSchema });
		reconstructionClaimResultSchema = z.object({
			claim_id: claimIdSchema,
			kind: z.enum([
				"behavioral",
				"structural-function",
				"structural-artifact"
			]),
			dimension: z.string().min(1),
			status: verificationStatusSchema,
			observed_status: z.enum([
				"unchanged",
				"added",
				"removed",
				"changed",
				"truncated",
				"unknown",
				"contradiction"
			]),
			comparison_evidence_id: evidenceIdSchema,
			left_evidence_ids: z.array(evidenceIdSchema).min(1),
			right_evidence_ids: z.array(evidenceIdSchema).min(1),
			evidence_links: z.array(evidenceIdSchema).min(2),
			unknown_ids: z.array(unknownIdSchema),
			limitations: z.array(z.string())
		});
		reconstructionVerificationResultSchema = z.object({
			status: verificationStatusSchema,
			specification_sha256: digestSchema,
			summary: z.object({
				total: z.number().int().min(1),
				passed: z.number().int().min(0),
				failed: z.number().int().min(0),
				unknown: z.number().int().min(0),
				behavioral: z.number().int().min(0),
				structural: z.number().int().min(0)
			}),
			claims: z.object({ items: z.array(reconstructionClaimResultSchema) }),
			recommended_probes: z.array(z.object({
				operation: z.string().min(1),
				rationale: z.string().min(1),
				claim_ids: z.array(claimIdSchema).min(1),
				unknown_ids: z.array(unknownIdSchema)
			})),
			evidence_links: z.array(evidenceIdSchema).min(2),
			limitations: z.array(z.string())
		}).superRefine((result, context) => {
			const { summary } = result;
			const expectedStatus = summary.failed > 0 ? "fail" : summary.unknown > 0 ? "unknown" : "pass";
			const issues = [
				[
					summary.total !== summary.passed + summary.failed + summary.unknown,
					"Claim status counts must equal the summary total",
					["summary", "total"]
				],
				[
					summary.total !== summary.behavioral + summary.structural,
					"Claim kind counts must equal the summary total",
					["summary", "total"]
				],
				[
					result.claims.items.length !== summary.total,
					"Retained claims must equal the summary total",
					["claims", "items"]
				],
				[
					result.status !== expectedStatus,
					"Verification status must summarize claim statuses",
					["status"]
				]
			];
			for (const [invalid, message, path] of issues) if (invalid) context.addIssue({
				code: "custom",
				message,
				path: [...path]
			});
		});
	})))();
}

//#endregion
//#region dist/domain/electron/electronFuses.js
var ELECTRON_FUSE_SENTINEL, ELECTRON_FUSE_STATE_BYTES, ELECTRON_FUSE_V1_NAMES, FUSE_IMPLICATIONS, OTHER_MEANS_LIMITATION, MISSING_SENTINEL_LIMITATION, byteSchema, fuseStateSchema, electronFuseSchema, electronFuseSentinelSchema, electronFuseSliceSchema, implicationLocation, electronFuseImplicationSchema, electronFuseReportSchema, inspectElectronFusesInputSchema, electronFuseState, electronFuseName, describeElectronFuseFindings, embeddedAsarIntegrityApplies, describeSentinel, implicationFor, validateReportBounds, implicationKey, validateSentinel;
function init_electronFuses() {
	return (init_electronFuses = __esmMin((() => {
		init_digests();
		init_localPath();
		ELECTRON_FUSE_SENTINEL = "dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX";
		ELECTRON_FUSE_STATE_BYTES = {
			disabled: 48,
			enabled: 49,
			removed: 114
		};
		ELECTRON_FUSE_V1_NAMES = [
			"RunAsNode",
			"EnableCookieEncryption",
			"EnableNodeOptionsEnvironmentVariable",
			"EnableNodeCliInspectArguments",
			"EnableEmbeddedAsarIntegrityValidation",
			"OnlyLoadAppFromAsar",
			"LoadBrowserProcessSpecificV8Snapshot",
			"GrantFileProtocolExtraPrivileges",
			"WasmTrapHandlers"
		];
		FUSE_IMPLICATIONS = [
			{
				subject: "node_cli_inspect_arguments",
				fuseIndex: 3,
				enabled: "honored",
				inactive: "not_honored"
			},
			{
				subject: "electron_run_as_node",
				fuseIndex: 0,
				enabled: "honored",
				inactive: "not_honored"
			},
			{
				subject: "embedded_asar_integrity_validation",
				fuseIndex: 4,
				enabled: "enforced",
				inactive: "not_enforced"
			},
			{
				subject: "only_load_app_from_asar",
				fuseIndex: 5,
				enabled: "restricted_to_app_asar",
				inactive: "not_restricted_to_app_asar"
			}
		];
		OTHER_MEANS_LIMITATION = "Fuse state does not prove the application enables Inspector through other means, such as app.commandLine or a remote-debugging switch in application code.";
		MISSING_SENTINEL_LIMITATION = "A missing sentinel means fuse state is unknown, not that every fuse is disabled.";
		byteSchema = z.number().int().min(0).max(255);
		fuseStateSchema = z.enum([
			"enabled",
			"disabled",
			"removed",
			"unknown"
		]);
		electronFuseSchema = z.strictObject({
			index: z.number().int().nonnegative(),
			name: z.string().min(1).nullable(),
			state: fuseStateSchema,
			raw_byte: byteSchema
		});
		electronFuseSentinelSchema = z.strictObject({
			sentinel_offset: z.number().int().nonnegative(),
			wire_version: byteSchema.nullable(),
			declared_length: byteSchema.nullable(),
			fuses: z.array(electronFuseSchema),
			complete: z.boolean()
		});
		electronFuseSliceSchema = z.strictObject({
			index: z.number().int().nonnegative(),
			file_offset: z.number().int().nonnegative(),
			size: z.number().int().nonnegative(),
			architecture: z.string().min(1).nullable(),
			sentinel_count: z.number().int().nonnegative(),
			sentinels: z.array(electronFuseSentinelSchema)
		});
		implicationLocation = {
			relationship: z.literal("derivation"),
			slice_index: z.number().int().nonnegative(),
			sentinel_offset: z.number().int().nonnegative()
		};
		electronFuseImplicationSchema = z.discriminatedUnion("subject", [
			z.strictObject({
				...implicationLocation,
				subject: z.literal("node_cli_inspect_arguments"),
				fuse_index: z.literal(3),
				outcome: z.enum([
					"honored",
					"not_honored",
					"unknown"
				])
			}),
			z.strictObject({
				...implicationLocation,
				subject: z.literal("electron_run_as_node"),
				fuse_index: z.literal(0),
				outcome: z.enum([
					"honored",
					"not_honored",
					"unknown"
				])
			}),
			z.strictObject({
				...implicationLocation,
				subject: z.literal("embedded_asar_integrity_validation"),
				fuse_index: z.literal(4),
				outcome: z.enum([
					"enforced",
					"not_enforced",
					"unknown"
				])
			}),
			z.strictObject({
				...implicationLocation,
				subject: z.literal("only_load_app_from_asar"),
				fuse_index: z.literal(5),
				outcome: z.enum([
					"restricted_to_app_asar",
					"not_restricted_to_app_asar",
					"unknown"
				])
			})
		]);
		electronFuseReportSchema = z.strictObject({
			artifact: z.strictObject({
				selected_path: localPathStringSchema,
				resolved_path: localPathStringSchema,
				sha256: digestSchema,
				bytes: z.number().int().nonnegative(),
				format: z.enum([
					"mach-o",
					"mach-o-universal",
					"pe",
					"elf"
				])
			}).describe("Caller-selected path, resolved regular file, and the container that was read"),
			slices: z.array(electronFuseSliceSchema).describe("One entry per universal Mach-O slice, or a single entry for a thin Mach-O, PE, or ELF file. Sentinel offsets are file-absolute."),
			runtime_implications: z.array(electronFuseImplicationSchema).describe("Derivations from version-1 fuse bytes. Each entry names the fuse index it came from."),
			limitations: z.array(z.string().min(1))
		}).superRefine((report, context) => {
			validateReportBounds(report, context);
		});
		inspectElectronFusesInputSchema = z.strictObject({ path: localPathStringSchema.describe("Absolute filesystem path to a macOS .app bundle, Electron Framework binary, Windows PE executable, or Linux ELF executable") });
		electronFuseState = (byte) => {
			if (byte === ELECTRON_FUSE_STATE_BYTES.disabled) return "disabled";
			if (byte === ELECTRON_FUSE_STATE_BYTES.enabled) return "enabled";
			if (byte === ELECTRON_FUSE_STATE_BYTES.removed) return "removed";
			return "unknown";
		};
		electronFuseName = (wireVersion, index) => wireVersion === 1 ? ELECTRON_FUSE_V1_NAMES[index] ?? null : null;
		describeElectronFuseFindings = (slices, container) => {
			const runtime_implications = [];
			const limitations = [OTHER_MEANS_LIMITATION, MISSING_SENTINEL_LIMITATION];
			for (const slice of slices) {
				if (slice.sentinel_count === 0) limitations.push(`Slice ${slice.index} at file offset ${slice.file_offset} contains no Electron fuse sentinel; fuse state for that slice is unknown, not disabled.`);
				else if (slice.sentinel_count > 1) limitations.push(`Slice ${slice.index} at file offset ${slice.file_offset} contains ${slice.sentinel_count} Electron fuse sentinels; every sentinel is reported and none is selected.`);
				for (const sentinel of slice.sentinels) describeSentinel(slice.index, sentinel, container, runtime_implications, limitations);
			}
			return {
				runtime_implications,
				limitations
			};
		};
		embeddedAsarIntegrityApplies = (container) => container === "mach-o" || container === "mach-o-universal" || container === "pe";
		describeSentinel = (sliceIndex, sentinel, container, implications, limitations) => {
			if (!sentinel.complete) limitations.push(`Electron fuse wire at file offset ${sentinel.sentinel_offset} is truncated; fuse bytes past the slice stay unknown.`);
			if (sentinel.wire_version === null) return;
			if (sentinel.wire_version !== 1) {
				limitations.push(`Electron fuse wire at file offset ${sentinel.sentinel_offset} uses wire version ${sentinel.wire_version}; version 1 is the only pinned name table, so runtime implications for this wire are unknown.`);
				return;
			}
			for (const spec of FUSE_IMPLICATIONS) {
				const fuse = sentinel.fuses.find((item) => item.index === spec.fuseIndex);
				if (fuse === undefined) {
					limitations.push(`Electron fuse wire at file offset ${sentinel.sentinel_offset} does not include fuse index ${spec.fuseIndex}; that runtime implication is unknown.`);
					continue;
				}
				const applicabilityUnknown = spec.subject === "embedded_asar_integrity_validation" && !embeddedAsarIntegrityApplies(container);
				if (applicabilityUnknown) limitations.push(`Electron compiles embedded ASAR integrity validation only on macOS and Windows; the observed fuse byte at file offset ${sentinel.sentinel_offset} does not establish enforcement.`);
				implications.push(implicationFor(spec, applicabilityUnknown ? "unknown" : fuse.state, {
					slice_index: sliceIndex,
					sentinel_offset: sentinel.sentinel_offset
				}));
			}
		};
		implicationFor = (spec, state, location) => {
			const outcome = state === "enabled" ? spec.enabled : state === "unknown" ? "unknown" : spec.inactive;
			return {
				relationship: "derivation",
				subject: spec.subject,
				fuse_index: spec.fuseIndex,
				outcome,
				...location
			};
		};
		validateReportBounds = (report, context) => {
			const size = report.artifact.bytes;
			for (const [sliceIndex, slice] of report.slices.entries()) {
				if (slice.index !== sliceIndex) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"index"
					],
					message: "Slice index does not match its position in the report."
				});
				if (slice.sentinel_count !== slice.sentinels.length) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinel_count"
					],
					message: "Sentinel count does not match the reported sentinels."
				});
				if (slice.file_offset > size || slice.size > size - slice.file_offset) context.addIssue({
					code: "custom",
					path: ["slices", sliceIndex],
					message: "Slice range extends outside the selected artifact."
				});
				for (const [sentinelIndex, sentinel] of slice.sentinels.entries()) validateSentinel(slice, sentinel, sliceIndex, sentinelIndex, context);
			}
			const expected = new Set(describeElectronFuseFindings(report.slices, report.artifact.format).runtime_implications.map(implicationKey));
			for (const [index, implication] of report.runtime_implications.entries()) {
				if (!expected.has(implicationKey(implication))) context.addIssue({
					code: "custom",
					path: ["runtime_implications", index],
					message: "Runtime implication is not supported by the reported fuse bytes and applicability."
				});
				const slice = report.slices[implication.slice_index];
				if (slice?.sentinels.some((sentinel) => sentinel.sentinel_offset === implication.sentinel_offset) !== true) context.addIssue({
					code: "custom",
					path: ["runtime_implications", index],
					message: "Runtime implication does not reference a reported sentinel."
				});
			}
		};
		implicationKey = (fact) => JSON.stringify([
			fact.slice_index,
			fact.sentinel_offset,
			fact.subject,
			fact.fuse_index,
			fact.outcome
		]);
		validateSentinel = (slice, sentinel, sliceIndex, sentinelIndex, context) => {
			const sentinelEnd = sentinel.sentinel_offset + ELECTRON_FUSE_SENTINEL.length;
			const wireEnd = sentinelEnd + (sentinel.wire_version === null ? 0 : 1) + (sentinel.declared_length === null ? 0 : 1) + sentinel.fuses.length;
			if (wireEnd > slice.file_offset + slice.size) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex
				],
				message: "Reported wire header or fuse bytes extend outside the slice."
			});
			if (sentinel.sentinel_offset < slice.file_offset || sentinelEnd > slice.file_offset + slice.size) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"sentinel_offset"
				],
				message: "Sentinel is outside its slice."
			});
			if (sentinel.wire_version === null && sentinel.declared_length !== null) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"declared_length"
				],
				message: "A wire without a version byte cannot declare a fuse count."
			});
			if (sentinel.complete && (sentinel.declared_length === null || sentinel.fuses.length !== sentinel.declared_length)) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"complete"
				],
				message: "A complete wire must contain every declared fuse byte."
			});
			if (!sentinel.complete && sentinel.declared_length !== null && sentinel.fuses.length >= sentinel.declared_length) context.addIssue({
				code: "custom",
				path: [
					"slices",
					sliceIndex,
					"sentinels",
					sentinelIndex,
					"complete"
				],
				message: "An incomplete wire must omit at least one declared fuse byte."
			});
			for (const [fuseIndex, fuse] of sentinel.fuses.entries()) {
				if (fuse.index !== fuseIndex) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinels",
						sentinelIndex,
						"fuses",
						fuseIndex,
						"index"
					],
					message: "Fuse index does not match its wire position."
				});
				if (fuse.state !== electronFuseState(fuse.raw_byte)) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinels",
						sentinelIndex,
						"fuses",
						fuseIndex,
						"state"
					],
					message: "Fuse state does not match its raw byte."
				});
				if (sentinel.wire_version !== null && fuse.name !== electronFuseName(sentinel.wire_version, fuse.index)) context.addIssue({
					code: "custom",
					path: [
						"slices",
						sliceIndex,
						"sentinels",
						sentinelIndex,
						"fuses",
						fuseIndex,
						"name"
					],
					message: "Fuse name does not match the pinned version-1 table."
				});
			}
		};
	})))();
}

//#endregion
//#region dist/contracts/toolOutputSchemaGroups.js
var contextFacetSchema, bookmarkFacetSchema, officialOutputSchemas, literalTraceOutput, callPathTraceOutput, batchProcedureIdentity, enhancedOutputSchemas, nativeOutputSchemas, artifactOutputSchemas, managedOutputSchemas, managedWorkflowOutputSchemas, lifecycleTargetFields, detectedLifecycleTargetSchema, rawLifecycleTargetSchema, sessionOutputSchemas, electronFuseOutputSchemas;
function init_toolOutputSchemaGroups() {
	return (init_toolOutputSchemaGroups = __esmMin((() => {
		init_bytePattern();
		init_analysisView();
		init_evidenceRecordSummary();
		init_binaryTargetTypes();
		init_rawBinary();
		init_nativeFunctionAnnotations();
		init_nativeLoadImage();
		init_nativeUiObservation();
		init_nativeValueTrace();
		init_nativeDataType();
		init_nativeCallObservation();
		init_nativeInstruction();
		init_jsonValue();
		init_residualUnknown();
		init_evidenceBundle();
		init_processComparison();
		init_hopperValues();
		init_nativeApiBoundary();
		init_nativeInspection();
		init_artifactGraph();
		init_artifactInspection();
		init_interfaceBuilderGraph();
		init_dylibResolution();
		init_keyedArchive();
		init_appleAssetCatalog();
		init_managedArtifact();
		init_managedMemberComparison();
		init_managedNativeVerificationSchemas();
		init_managedReconstruction();
		init_managedApplicationGraph();
		init_artifactComparison();
		init_functionComparisonSchemas();
		init_bundleComparison();
		init_changedBehavior();
		init_callPathSchemas();
		init_staticRuntimeCorrelation();
		init_reconstructionVerificationSchemas();
		init_errorSchemas();
		init_relationshipCoverage();
		init_objcSwiftMetadata();
		init_nativeInvestigationGraph();
		init_toolOutputSchemaPrimitives();
		init_processCapture();
		init_electronFuses();
		contextFacetSchema = z.discriminatedUnion("state", [z.object({
			state: z.literal("available"),
			value: jsonValueSchema
		}), z.object({
			state: z.literal("unavailable"),
			reason: z.string(),
			remediation: z.string()
		})]);
		bookmarkFacetSchema = z.discriminatedUnion("state", [z.object({
			state: z.literal("available"),
			value: z.array(analysisBookmarkSchema)
		}), z.object({
			state: z.literal("unavailable"),
			reason: z.string(),
			remediation: z.string()
		})]);
		officialOutputSchemas = {
			search_bytes: evidenceResultOf(byteSearchResultSchema),
			annotate_native_function: evidenceResultOf(nativeFunctionAnnotationsSchema),
			inspect_native_load_image: evidenceResultOf(nativeLoadImageSchema),
			inspect_native_data_type: evidenceResultOf(nativeDataTypeSchema),
			inspect_native_instruction: evidenceResultOf(nativeInstructionSchema),
			resolve_native_call_targets: evidenceResultOf(nativeCallTargetsSchema),
			address_name: evidenceResultOf(nullableText),
			comment: evidenceResultOf(nullableText),
			current_address: evidenceResultOf(z.string()),
			current_procedure: evidenceResultOf(z.string()),
			current_document: evidenceResultOf(z.string()),
			goto_address: evidenceResultOf(z.string()),
			inline_comment: evidenceResultOf(nullableText),
			list_bookmarks: evidenceResultOf(z.array(analysisBookmarkSchema)),
			list_documents: evidenceResultOf(z.array(z.string())),
			list_names: evidenceResultOf(z.array(addressedValue)),
			list_procedures: evidenceResultOf(z.array(addressedValue)),
			list_segments: segmentOutput,
			list_strings: evidenceResultOf(z.array(analysisStringSchema)),
			next_address: evidenceResultOf(z.string()),
			prev_address: evidenceResultOf(z.string()),
			procedure_address: evidenceResultOf(z.string()),
			procedure_assembly: evidenceResultOf(z.string()),
			procedure_callees: evidenceResultOf(addressList),
			procedure_callers: evidenceResultOf(addressList),
			procedure_info: procedureInfoOutput,
			read_function_instructions: evidenceResultOf(functionInstructionWindowSchema),
			read_bytes: evidenceResultOf(z.object({
				address: z.string(),
				requested_bytes: z.number().int().min(1),
				returned_bytes: z.number().int().min(0),
				bytes_hex: z.string().regex(/^(?:[a-f0-9]{2})*$/u),
				complete: z.boolean()
			})),
			address_to_file_offset: evidenceResultOf(z.object({
				address: z.string(),
				file_offset: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
				provider_file_offset: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).exactOptional().describe("Original coordinate returned by the provider's mapping API."),
				image_base_file_offset: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).exactOptional().describe("File offset of the loaded image within its source container; zero for a thin executable."),
				source_path: z.string().exactOptional().describe("Observed original executable path used to verify the file mapping.")
			})),
			procedure_references: evidenceResultOf(z.object({
				procedure: procedureIdentitySchema,
				direction: z.enum(["incoming", "outgoing"]),
				reference_kinds_available: z.boolean(),
				unresolved_calls: z.array(unresolvedCallSchema),
				references: z.array(referenceEdgeSchema)
			})),
			procedure_pseudo_code: evidenceResultOf(nullableText),
			resolve_containing_procedure: evidenceResultOf(containingProcedureResolution),
			search_procedures: evidenceResultOf(z.array(z.object({
				address: z.string(),
				value: z.string()
			}))),
			search_strings: evidenceResultOf(z.array(analysisStringSchema)),
			set_address_name: evidenceResultOf(z.boolean()),
			set_addresses_names: evidenceResultOf(z.record(z.string(), z.boolean())),
			set_bookmark: evidenceResultOf(z.boolean()),
			set_comment: evidenceResultOf(z.boolean()),
			set_inline_comment: evidenceResultOf(z.boolean()),
			unset_bookmark: evidenceResultOf(z.boolean()),
			xrefs: evidenceResultOf(addressList)
		};
		literalTraceOutput = evidenceResultOf(z.object({
			query: z.string(),
			search_mode: z.literal("literal"),
			matches: z.array(z.object({
				type: z.enum(["string", "procedure"]),
				address: z.string(),
				value: z.string()
			})),
			references: z.array(z.object({
				target_address: z.string(),
				source_address: z.string(),
				containing_procedure: containingProcedureResolution
			})),
			truncated: z.boolean(),
			residual_unknowns: z.array(z.string())
		}));
		callPathTraceOutput = evidenceResultOf(z.object({
			start: z.string(),
			goal: z.string().nullable(),
			direction: z.enum(["forward", "backward"]),
			goal_status: z.enum([
				"not_requested",
				"reached",
				"not_reached",
				"unknown"
			]),
			nodes: z.array(z.object({
				address: z.string(),
				depth: z.number().int().min(0)
			})),
			edges: z.array(z.object({
				source_address: z.string(),
				target_address: z.string(),
				discovery_depth: z.number().int().min(1)
			})),
			traversal_path: z.array(z.string()),
			failures: z.array(z.object({
				address: z.string(),
				error: analysisErrorProjectionSchema
			})),
			relationship_coverage: z.record(z.string(), relationshipCoverageSchema),
			traversal: z.object({ nodes_visited: z.number().int().min(1) }),
			truncated: z.boolean(),
			residual_unknowns: z.array(z.string()),
			limitations: z.array(z.string())
		}));
		batchProcedureIdentity = z.discriminatedUnion("status", [z.object({
			status: z.literal("resolved"),
			address: z.string().min(1).describe("Observed canonical procedure entry."),
			name: z.string().nullable().describe("Provider's entry label, or null when unavailable."),
			name_error: analysisErrorProjectionSchema.optional()
		}), z.object({
			status: z.literal("unknown"),
			error: analysisErrorProjectionSchema
		})]);
		enhancedOutputSchemas = {
			inspect_native_dispatch_metadata: evidenceResultOf(nativeDispatchMetadataResultSchema),
			trace_native_values: evidenceResultOf(nativeValueTraceSchema),
			trace_native_ui_action: evidenceResultOf(nativeInvestigationTraceSchema),
			get_objc_classes: symbolDiscoveryOutput("classes"),
			get_objc_protocols: symbolDiscoveryOutput("protocols"),
			batch_decompile: evidenceResultOf(z.object({
				items: z.array(z.discriminatedUnion("status", [z.object({
					address: z.string().describe("Original caller-selected symbol or address."),
					procedure: batchProcedureIdentity,
					status: z.literal("ok"),
					pseudocode: z.string().min(1)
				}), z.object({
					address: z.string().describe("Original caller-selected symbol or address."),
					procedure: batchProcedureIdentity,
					status: z.literal("error"),
					error: analysisErrorProjectionSchema
				})])),
				total: z.number().int().min(0),
				succeeded: z.number().int().min(0),
				failed: z.number().int().min(0)
			})),
			get_call_graph: evidenceResultOf(z.strictObject({
				graph: z.record(z.string(), z.array(graphNode)),
				limitations: z.array(z.string())
			})),
			analyze_swift_types: evidenceResultOf(z.object({
				total: z.number().int().min(0),
				categories: z.record(z.string(), z.object({
					count: z.number().int().min(0),
					items: z.array(addressedEntry.extend({ mangled_names: z.array(z.string()) }))
				})),
				unclassified: z.array(addressedEntry.extend({
					mangled_names: z.array(z.string()),
					reason: z.enum(["category_not_decoded", "conflicting_categories"])
				})),
				limitations: z.array(z.string()),
				symbol_inventory_error: analysisErrorProjectionSchema.exactOptional()
			})),
			find_xrefs_to_name: evidenceResultOf(z.discriminatedUnion("status", [z.object({
				status: z.literal("resolved"),
				name: z.string(),
				address: z.string(),
				xrefs: addressList
			}), z.object({
				status: z.literal("unresolved"),
				name: z.string(),
				reason: z.literal("name_not_found")
			})])),
			binary_overview: evidenceResultOf(z.object({
				document: z.string(),
				image_base: z.string().min(1).optional(),
				segments: z.array(z.object({
					name: z.string(),
					start: z.string(),
					end: z.string(),
					length: z.number().min(0).nullable(),
					image_base: z.string().exactOptional(),
					address_space: z.string().exactOptional()
				})).optional(),
				segment_count: z.number().int().min(0).optional(),
				procedure_count: z.number().int().min(0),
				string_count: z.number().int().min(0)
			})),
			analyze_function: functionDossierOutput,
			inspect_native_api: evidenceResultOf(nativeApiInspectionResultSchema),
			trace_feature: literalTraceOutput,
			trace_call_path: callPathTraceOutput
		};
		nativeOutputSchemas = {
			observe_native_ui: evidenceResultOf(nativeUiResultSchema),
			capture_native_ui_scenario: evidenceResultOf(nativeUiResultSchema),
			observe_native_calls: evidenceResultOf(nativeCallObservationResultSchema),
			inspect_macho: evidenceResultOf(z.union([inspectMachoSchema, machoSummaryViewResultSchema])),
			inspect_signature: evidenceResultOf(inspectSignatureSchema),
			inspect_plist: evidenceResultOf(inspectPlistSchema),
			list_architectures: evidenceResultOf(listArchitecturesSchema),
			demangle_swift: evidenceResultOf(demangleSwiftSchema)
		};
		artifactOutputSchemas = {
			inspect_artifact: evidenceResultOf(z.union([artifactInspectionOutputSchema, artifactInventorySummaryViewResultSchema])),
			extract_artifact: evidenceResultOf(artifactExtractionResultSchema),
			decode_interface_builder: evidenceResultOf(z.union([interfaceBuilderAnalysisSchema, interfaceBuilderSummaryViewResultSchema])),
			inspect_keyed_archive: evidenceResultOf(keyedArchiveResultSchema),
			inspect_asset_catalog: evidenceResultOf(appleAssetCatalogResultSchema),
			trace_dylib_resolution: evidenceResultOf(dylibResolutionResultSchema)
		};
		managedOutputSchemas = {
			inspect_managed_artifact: evidenceResultOf(z.union([managedArtifactInspectionSchema, managedArtifactSummaryViewResultSchema])),
			inspect_managed_members: evidenceResultOf(z.union([managedMemberInspectionSchema, managedMemberSummaryViewResultSchema])),
			inspect_managed_native_boundaries: evidenceResultOf(managedNativeBoundaryInspectionSchema)
		};
		managedWorkflowOutputSchemas = {
			compare_managed_members: evidenceResultOf(managedMemberComparisonResultSchema),
			verify_managed_native_boundaries: evidenceResultOf(managedNativeVerificationResultSchema),
			import_managed_reconstruction: evidenceResultOf(managedReconstructionImportResultSchema),
			project_managed_application_graph: evidenceResultOf(managedApplicationGraphResultSchema)
		};
		lifecycleTargetFields = {
			path: z.string(),
			kind: targetKindSchema,
			sha256: z.string().regex(/^[a-f0-9]{64}$/u)
		};
		detectedLifecycleTargetSchema = z.object({
			...lifecycleTargetFields,
			format: targetFormatSchema.exclude(["raw-binary"]),
			architecture: z.enum(BINARY_ARCHITECTURES$1).exclude(["6502"]).nullable()
		});
		rawLifecycleTargetSchema = z.object({
			...lifecycleTargetFields,
			format: z.literal("raw-binary"),
			kind: z.literal("executable"),
			architecture: binaryArchitectureSchema,
			entry_point: rawBinaryEntryPointSchema.describe("Canonical caller-selected address where raw file offset 0 is mapped and execution is seeded.")
		});
		sessionOutputSchemas = {
			open_binary: lifecycleResultOf(z.discriminatedUnion("format", [detectedLifecycleTargetSchema, rawLifecycleTargetSchema])),
			close_binary: lifecycleResultOf(z.union([z.null(), z.object({
				path: z.string(),
				bytes: z.number().int().min(0),
				primitive_entries: z.number().int().min(0).describe("Retained eligible primitive query bindings."),
				workflow_entries: z.number().int().min(0).describe("Retained eligible composed workflow bindings."),
				evidence_records: z.number().int().min(0).describe("All retained Evidence records, including observations without replay bindings.")
			})])),
			binary_session: lifecycleResultOf(z.union([
				sessionProvider.extend({ open: z.literal(false) }),
				sessionProvider.extend({
					open: z.literal(true),
					...detectedLifecycleTargetSchema.shape
				}),
				sessionProvider.extend({
					open: z.literal(true),
					...rawLifecycleTargetSchema.shape
				})
			])),
			export_evidence_bundle: lifecycleResultOf(z.object({
				path: z.string(),
				bytes: z.number().int().min(0),
				records: z.number().int().min(0),
				unknowns: z.number().int().min(0)
			})),
			get_evidence_bundle: lifecycleResultOf(z.union([evidenceBundleSchema, evidenceBundleSummarySchema])),
			get_navigation_context: lifecycleResultOf(z.object({
				document: z.string(),
				address: z.string(),
				procedure: z.union([z.string(), z.null()])
			})),
			inspect_address_context: lifecycleResultOf(z.object({
				address: z.string(),
				document: z.string().nullable(),
				name: contextFacetSchema,
				procedure: contextFacetSchema,
				comment: contextFacetSchema,
				inline_comment: contextFacetSchema,
				bookmarks: bookmarkFacetSchema
			})),
			import_evidence_bundle: lifecycleResultOf(z.object({
				imported: z.number().int().min(0),
				unknowns_added: z.number().int().min(0),
				total: z.number().int().min(0)
			})),
			capture_process_scenario: evidenceResultOf(processCaptureSchema),
			compare_process_captures: evidenceResultOf(processCaptureComparisonSchema),
			compare_artifacts: evidenceResultOf(artifactComparisonResultSchema),
			compare_functions: evidenceResultOf(functionComparisonResultSchema),
			compare_bundles: evidenceResultOf(bundleComparisonResultSchema),
			find_changed_behavior: evidenceResultOf(changedBehaviorResultSchema),
			build_call_path: evidenceResultOf(callPathResultSchema),
			correlate_static_and_runtime: evidenceResultOf(staticRuntimeCorrelationResultSchema),
			verify_reconstruction: evidenceResultOf(reconstructionVerificationResultSchema),
			list_unknowns: lifecycleResultOf(z.object({
				items: z.array(residualUnknownSchema),
				total: z.number().int().min(0),
				offset: z.number().int().min(0),
				next_offset: z.number().int().min(0).nullable()
			})),
			record_unknown: lifecycleResultOf(residualUnknownSchema),
			update_unknown: lifecycleResultOf(residualUnknownSchema),
			verify_unknown_resolution: lifecycleResultOf(z.object({
				valid: z.boolean(),
				truthVerified: z.boolean(),
				unknown: residualUnknownSchema
			}))
		};
		electronFuseOutputSchemas = { inspect_electron_fuses: evidenceResultOf(electronFuseReportSchema) };
	})))();
}

//#endregion
export { ELECTRON_FUSE_SENTINEL, INSPECT_ANALYSIS_VIEW_OPERATION, KeyedArchiveKindError, PROCESS_PROVIDER, WASM_INTERFACE_REPRESENTATION_BYTES, WEB_NETWORK_CAPTURE_FORMATS, WEB_NETWORK_CAPTURE_LIMITS, WebNetworkApiSurfaceAccumulator, admitRawBinary, analysisDetailOutputSchemaOf, analysisDetailSchema, analysisViewResultSchema, androidInputSchemas, androidPackageInspectionInputSchema, androidPackageSummaryViewResultSchema, androidRequestSchema, androidResultSchemas, appleAssetCatalogInputSchema, appleResourceKeyFields, artifactComparisonInputSchema, artifactOutputSchemas, binaryArchitectureSchema, binaryLayoutPayloadSchema, binaryLayoutSchema, binaryLayoutSummaryViewResultSchema, bundleComparisonInputSchema, bytePatternFields, byteSearchResultSchema, callPathInputSchema, captureSensitiveValues, changedBehaviorInputSchema, compareBundles, compareManagedMembers, compareProcessCaptures, dartAotInspectionInputSchema, dartAotSummaryViewResultSchema, demangleSwiftSchema, describeElectronFuseFindings, dexDescriptorSchema, dylibResolutionInputSchema, dylibResolutionResultSchema, electronFuseName, electronFuseOutputSchemas, electronFuseReportSchema, electronFuseState, enhancedOutputSchemas, evidenceRecordFiltersSchema, evmInterfaceSchema, evmInterfaceSummaryViewResultSchema, flutterInputSchemas, flutterRequestSchema, flutterResultSchemas, importManagedReconstruction, init_WebNetworkApiSurfaceAccumulator, init_analysisDetail, init_analysisView, init_analysisViewErrors, init_androidAnalysis, init_appleAssetCatalog, init_artifactComparison, init_binaryLayout, init_bundleComparison, init_bytePattern, init_callPathSchemas, init_changedBehavior, init_dyldPaths, init_dylibResolution, init_electronFuses, init_evidenceRecordSummary, init_evmInterface, init_flutterBuildAnalysis, init_keyedArchive, init_managedMemberComparison, init_managedMemberComparisonMatch, init_managedNativeVerificationSchemas, init_managedReconstruction, init_nativeCallObservation, init_nativeDataType, init_nativeFunctionAnnotations, init_nativeInspection, init_nativeLoadImage, init_nativeUiObservation, init_pcapAnalysis, init_pngHeader, init_processComparison, init_processEvidenceProvider, init_processTraceSpecification, init_rawBinary, init_reconstructionVerificationSchemas, init_solidityMetadata, init_staticRuntimeCorrelation, init_toolEffects, init_toolOutputSchemaGroups, init_wasmArtifact, init_wasmInterface, init_webNetworkCapture, inspectAnalysisViewInputSchema, inspectBinaryLayoutInputSchema, inspectElectronFusesInputSchema, inspectEvmInterfaceInputSchema, inspectMachoSchema, inspectPlistSchema, inspectSignatureSchema, inspectWasmArtifactInputSchema, inspectWebNetworkCaptureInputSchema, isProcessEvidenceProvider, javascriptApplicationSummaryViewResultSchema, keyedArchiveInputSchema, keyedArchiveResultSchema, listArchitecturesSchema, managedNativeVerificationInputSchema, managedNativeVerificationResultSchema, managedOutputSchemas, managedReconstructionImportInputSchema, managedWorkflowOutputSchemas, nativeCallEventSchema, nativeCallObservationInputSchema, nativeCallObservationResultSchema, nativeCodeLocationSchema, nativeDataTypeInputSchema, nativeDataTypeSchema, nativeFunctionAnnotationsInputSchema, nativeFunctionAnnotationsSchema, nativeLoadImageObservationSchema, nativeLoadImageSchema, nativeOutputSchemas, nativeUiObservationInputSchema, nativeUiResultSchema, nativeUiScenarioInputSchema, nativeUiSnapshotSchema, officialOutputSchemas, parseAppleAssetCatalogRecords, parseManagedMemberEvidence, pcapCaptureSummaryViewResultSchema, pcapInputSchemas, pcapRequestSchema, pcapResultSchemas, pinvokeVerificationSchema, processTraceSpecificationSchema, projectAnalysisView, projectAppleAssetCatalogPage, projectKeyedArchive, rawBinaryEntryPointSchema, rawBinarySelectionError, readPngHeaderDimensions, reconstructionVerificationInputSchema, resolveTreePath, sessionOutputSchemas, solidityMetadataSchema, staticRuntimeCorrelationInputSchema, summarizeEvidenceBundle, toolContractMetadata, traceDylibLoading, validateBytePattern, wasmArtifactMatchesSubject, wasmArtifactSchema, wasmArtifactSummaryViewResultSchema, wasmInterfaceEntryRepresentationBytes, wasmInterfaceSchema, webNetworkCapturePayloadSchema, webNetworkCaptureSchema, webNetworkCaptureSummaryViewResultSchema };