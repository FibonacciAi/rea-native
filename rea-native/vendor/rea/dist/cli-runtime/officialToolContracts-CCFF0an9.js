import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { canonicalJson, compareUnicodeCodePoints, createEvidence, digestCanonicalValue, digestProcessCommitment, dimensionResult, functionComparisonResultSchema, functionDossierSchema, init_canonicalDigest, init_canonicalOrdering, init_comparisonSemantics, init_evidence, init_functionComparisonResults, init_functionComparisonSchemas, init_hopperValues, init_nativeInstruction, init_nativeValueTrace, init_processCaptureParsing, init_processScenario, init_relationshipCoverage, init_toolOutputSchemaPrimitives, init_unicodeCodePointOrder, nativeInstructionInputSchema, nativeValueTraceInputSchema, overallStatus, parseEvidence, parseProcessCapture, relationshipCoverageLimitations, requireOutputSchema, summarize, uniqueSorted, unresolvedDimension } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { analysisDetailSchema, appleAssetCatalogInputSchema, artifactOutputSchemas, bytePatternFields, compareProcessCaptures, dylibResolutionInputSchema, init_analysisDetail, init_appleAssetCatalog, init_bytePattern, init_dylibResolution, init_keyedArchive, init_nativeDataType, init_nativeFunctionAnnotations, init_processComparison, init_toolEffects, init_toolOutputSchemaGroups, keyedArchiveInputSchema, nativeDataTypeInputSchema, nativeFunctionAnnotationsInputSchema, officialOutputSchemas, toolContractMetadata, validateBytePattern } from "./toolOutputSchemaGroups-DRiYs1je.js";
import { artifactIntegrityPolicySchema, init_artifactIntegrityPolicy } from "./javascriptApplicationAnalysis-HgMzVMQw.js";
import { z } from "zod";
import { diffLines } from "diff";

//#region dist/contracts/artifactToolContracts.js
var artifactInventoryInputSchema, artifactInspectionInputSchema, artifactExtractionInputSchema, artifactExtractionExecutionSchema, exampleInputSchema$1, examples, artifact, ARTIFACT_TOOL_CONTRACTS, ARTIFACT_ANALYSIS_OPERATIONS;
function init_artifactToolContracts() {
	return (init_artifactToolContracts = __esmMin((() => {
		init_toolOutputSchemaGroups();
		init_artifactIntegrityPolicy();
		init_jsonValue();
		init_toolEffects();
		init_toolOutputSchemaPrimitives();
		init_appleAssetCatalog();
		init_dylibResolution();
		init_keyedArchive();
		init_analysisDetail();
		artifactInventoryInputSchema = z.strictObject({ integrity_policy: artifactIntegrityPolicySchema });
		artifactInspectionInputSchema = artifactInventoryInputSchema.extend({ detail: analysisDetailSchema.unwrap().optional().describe("Omitted or complete returns the complete inspection Evidence. summary retains that complete Evidence in this session and returns its inspect_analysis_view summary; use normalized_result.parent_evidence_id for inventory views.") });
		artifactExtractionInputSchema = z.strictObject({ integrity_policy: artifactIntegrityPolicySchema });
		artifactExtractionExecutionSchema = artifactExtractionInputSchema.extend({ output_root: z.string().min(1) });
		exampleInputSchema$1 = z.record(z.string(), jsonValueSchema);
		examples = {
			inspect_artifact: {},
			extract_artifact: {},
			decode_interface_builder: {},
			inspect_asset_catalog: {
				offset: 0,
				limit: 1e3
			},
			inspect_keyed_archive: { path: "Contents/Resources/Model.plist" },
			trace_dylib_resolution: {
				roots: ["Contents/MacOS/App"],
				architecture: "arm64"
			}
		};
		artifact = (name, description, inputSchema) => {
			const outputSchema = requireOutputSchema(artifactOutputSchemas, name);
			return {
				name,
				...toolContractMetadata(name),
				description,
				kind: "artifact-provider",
				inputSchema,
				outputSchema,
				examples: [{
					title: `Example ${name.replaceAll("_", " ")} request`,
					input: exampleInputSchema$1.parse(examples[name] ?? {})
				}]
			};
		};
		ARTIFACT_TOOL_CONTRACTS = [
			artifact("inspect_artifact", "Inspect an active archive or application package in one call. By default returns the complete content-addressed artifact graph once, as the typed nested inventory Evidence, with root and integrity observations, integrity contradictions, hypotheses, unexplored branches, limitations, and next probes inline. Optional detail summary retains the complete inspection and returns its derived summary view; read exact paths or inventory pages with inspect_analysis_view using parent_evidence_id. This changes delivery, not inventory coverage. Read-only DMG mounting is used automatically on supported macOS hosts. Integrity mismatches fail by default; record-and-continue keeps mismatches explicitly untrusted. It does not extract files; use extract_artifact to materialize its regular contents.", artifactInspectionInputSchema),
			artifact("extract_artifact", "Extract all regular files from the active archive or application package into a fresh temporary directory chosen by REA. The result includes its location. Rejects traversal and symlink escapes, never overwrites, and verifies cleanup. Integrity mismatches fail by default; record-and-continue extracts the observed bytes and returns each mismatch as an explicitly untrusted integrity contradiction.", artifactExtractionInputSchema),
			artifact("decode_interface_builder", "Decode compiled storyboard and nib archives inside the active Apple app bundle, including keyed property lists and NIBArchive object tables, into a bounded object, hierarchy, and connection graph. This is static archive parsing; unrecognized archive classes and unresolved code handlers remain explicit unknowns. A full app graph is often several megabytes; detail summary retains it and returns documents with node, edge and coverage counts, then page rows, optionally one document's, with inspect_analysis_view kind interface-builder.", z.strictObject({
				max_documents: z.number().int().min(1).max(64).default(64),
				max_objects: z.number().int().min(1).max(2e4).default(2e4),
				max_connections: z.number().int().min(1).max(4e4).default(4e4),
				detail: analysisDetailSchema.unwrap().optional().describe("Omitted or complete returns the complete decoded graph Evidence. summary retains that complete Evidence in this session and returns its inspect_analysis_view summary; use normalized_result.parent_evidence_id for interface-builder pages.")
			})),
			artifact("inspect_keyed_archive", "Inspect one Foundation NSKeyedArchiver plist in the active app bundle as original object-table nodes, class descriptors, named roots, and UID edges. Preserves shared and cyclic references without instantiating classes. The path is relative to the bundle; root selection and object pagination preserve original identities.", keyedArchiveInputSchema),
			artifact("inspect_asset_catalog", "Inspect compiled Assets.car metadata in an active Apple app bundle. Returns stable paginated catalog and rendition records with raw assetutil metadata and catalog digests; rendition bytes are not extracted.", appleAssetCatalogInputSchema),
			artifact("trace_dylib_resolution", "Trace how dyld would resolve each Mach-O dylib load for the active Mach-O, or for every executable in the active .app bundle (the main app, XPC services, extensions, login items, helpers). Expands @executable_path, @loader_path, and @rpath through each process's LC_RPATH stack in dependents-first load order, and reports every candidate path with its outcome, the resolved image and digest, weak, re-export, and upward flags, and derived findings such as unresolved required loads or absent earlier @rpath candidates. Pure header parsing: nothing is executed, and absolute or system paths outside the analyzed root stay undetermined. Select roots or one architecture to narrow large bundles.", dylibResolutionInputSchema)
		];
		ARTIFACT_ANALYSIS_OPERATIONS = ["inventory_artifact", ...ARTIFACT_TOOL_CONTRACTS.map(({ name }) => name)];
	})))();
}

//#endregion
//#region dist/contracts/unknownContractExamples.js
var UNKNOWN_CONTRACT_EXAMPLES;
function init_unknownContractExamples() {
	return (init_unknownContractExamples = __esmMin((() => {
		UNKNOWN_CONTRACT_EXAMPLES = {
			list_unknowns: {
				offset: 0,
				limit: 50
			},
			record_unknown: {
				question: "Does this branch require an unavailable external service?",
				severity: "medium",
				domain: "protocol",
				required_authority: "controlled-replay",
				required_confidence: "observed",
				required_environment: null,
				recommended_probes: [{
					operation: "capture_process_scenario",
					rationale: "Replay branch."
				}],
				relationships: []
			},
			update_unknown: {
				unknown_id: `unk_${"0".repeat(64)}`,
				expected_revision: 1,
				status: "investigating",
				severity: "medium",
				supporting_evidence_ids: [],
				contradicting_evidence_ids: [],
				required_authority: "controlled-replay",
				required_confidence: "observed",
				required_environment: null,
				recommended_probes: [],
				relationships: [],
				resolution: null
			},
			verify_unknown_resolution: { unknown_id: `unk_${"0".repeat(64)}` }
		};
	})))();
}

//#endregion
//#region dist/contracts/artifactComparisonExample.js
var inventory, provider, ARTIFACT_COMPARISON_EXAMPLE;
function init_artifactComparisonExample() {
	return (init_artifactComparisonExample = __esmMin((() => {
		init_canonicalDigest();
		init_evidence();
		init_jsonValue();
		inventory = (digit) => {
			const sha = digit.repeat(64);
			const artifactId = `art_${digestCanonicalValue({ sha256: sha }, "Artifact example")}`;
			const occurrenceId = `occ_${digestCanonicalValue({ root: artifactId }, "Artifact example")}`;
			const nodes = [{
				artifact_id: artifactId,
				format: "file",
				sha256: sha,
				size: 1,
				media_type: null,
				architecture: null,
				content_state: "materialized",
				limitations: []
			}];
			const occurrences = [{
				occurrence_id: occurrenceId,
				artifact_id: artifactId,
				parent_occurrence_id: null,
				logical_path: ".",
				entry_kind: "file",
				artifact_kind: "resource",
				artifact_format: "file",
				declared_size: 1,
				compressed_size: null,
				executable: false,
				encrypted: false,
				hash_status: "verified",
				source_location: null,
				limitations: []
			}];
			const graphSha256 = digestCanonicalValue({
				nodes,
				occurrences,
				edges: [],
				integrity_contradictions: []
			}, "Artifact example");
			return jsonValueSchema.parse({
				manifest: {
					manifest_id: `agm_${digestCanonicalValue({
						root_artifact_id: artifactId,
						graph_sha256: graphSha256
					}, "Artifact example")}`,
					root_artifact_id: artifactId,
					root_sha256: sha,
					root_format: "file",
					graph_sha256: graphSha256,
					node_count: nodes.length,
					occurrence_count: occurrences.length,
					edge_count: 0
				},
				nodes,
				occurrences,
				edges: [],
				provenance: [],
				limitations: []
			});
		};
		provider = {
			id: "rea-artifact",
			name: "REA artifact graph",
			version: "1"
		};
		ARTIFACT_COMPARISON_EXAMPLE = {
			left: createEvidence({
				path: "fixture-left",
				sha256: "0".repeat(64),
				format: "file"
			}, provider, {
				operation: "inventory_artifact",
				parameters: {},
				result: inventory("0"),
				confidence: "observed",
				authority: "shipped-artifact"
			}),
			right: createEvidence({
				path: "fixture-right",
				sha256: "1".repeat(64),
				format: "file"
			}, provider, {
				operation: "inventory_artifact",
				parameters: {},
				result: inventory("1"),
				confidence: "observed",
				authority: "shipped-artifact"
			})
		};
	})))();
}

//#endregion
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
//#region dist/contracts/functionComparisonExample.js
var dossier, observe, FUNCTION_COMPARISON_EXAMPLE;
function init_functionComparisonExample() {
	return (init_functionComparisonExample = __esmMin((() => {
		init_enhancedInputs();
		init_evidence();
		init_jsonValue();
		dossier = (text) => jsonValueSchema.parse({
			procedure: {
				address: "0x1000",
				name: "main",
				classification: null,
				body: {
					available: false,
					reason: "The fixture omits function-body extent observations."
				},
				signature: "int main(void)",
				locals: []
			},
			pseudocode: text,
			assembly: ["ret"],
			comments: [],
			callers: [],
			callees: [],
			incoming_references: [],
			outgoing_references: [],
			referenced_strings: [],
			referenced_names: [],
			basic_blocks: [{
				start: "0x1000",
				end: "0x1001",
				successors: []
			}],
			native_api: null,
			native_value_flow: null,
			facet_availability: {
				pseudocode: { available: true },
				assembly: { available: true },
				comments: { available: true },
				callers: { available: true },
				callees: { available: true },
				references: { available: true },
				strings_names: { available: true },
				cfg: { available: true }
			},
			limitations: ["The fixture omits native API and value-flow observations."]
		});
		observe = (digit, text) => createEvidence({
			path: `/tmp/function-${digit}`,
			sha256: digit.repeat(64),
			format: "mach-o"
		}, {
			id: "rea-workflow",
			name: "REA composed investigation workflow",
			version: "1"
		}, {
			operation: "analyze_function",
			parameters: enhancedInputSchemas.analyze_function.parse({ procedure: "main" }),
			result: dossier(text),
			confidence: "derived",
			authority: "shipped-artifact",
			relationshipCoverage: { status: "complete" }
		});
		FUNCTION_COMPARISON_EXAMPLE = {
			left: observe("0", "return 0;"),
			right: observe("1", "return 1;")
		};
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureExample.js
var normalization, scenario, comparisonContract, EMPTY_PROCESS_CAPTURE_EXAMPLE, finalizedScenario, finalizedComparisonContract, FINALIZED_PROCESS_CAPTURE_EXAMPLE;
function init_processCaptureExample() {
	return (init_processCaptureExample = __esmMin((() => {
		init_processScenario();
		normalization = {
			paths: true,
			pids: true,
			ports: true,
			time_bucket_ms: 10,
			patterns: []
		};
		scenario = { executable_sha256: "0".repeat(64) };
		comparisonContract = {};
		EMPTY_PROCESS_CAPTURE_EXAMPLE = {
			manifest: {
				rea_version: "1.1.0",
				provider_version: "3",
				platform: "fixture",
				architecture: "fixture",
				pty_backend: "node-pty",
				started_at: "2026-01-01T00:00:00.000Z",
				completed_at: "2026-01-01T00:00:00.001Z",
				scenario,
				comparison_contract: comparisonContract,
				full_scenario_sha256: digestProcessCommitment(scenario),
				comparison_contract_sha256: digestProcessCommitment(comparisonContract),
				selected_executable_sha256: "0".repeat(64),
				executable_sha256: "0".repeat(64),
				executable_identity: {
					state: "path_metadata_unchanged",
					reason: null
				},
				normalization_sha256: digestProcessCommitment(normalization)
			},
			normalization,
			frames: [],
			rendered_frames: [],
			interaction_events: [],
			exit: {
				code: 0,
				signal: null,
				reason: "exited"
			},
			settlement: {
				state: "quiesced",
				elapsed_ms: 50,
				cleanup_outcome: "not_required"
			},
			process_samples: [],
			filesystem_checkpoints: [{
				name: "before",
				at_ms: 0,
				files: [],
				effects: [],
				truncated: false
			}, {
				name: "after_settlement",
				at_ms: 50,
				files: [],
				effects: [],
				truncated: false
			}],
			event_journal: [],
			files_before: [],
			files_after: [],
			filesystem_effects: [],
			truncated: false,
			truncation_details: {
				raw_terminal: {
					budget_bytes: 1e6,
					observed_bytes: 0,
					retained_bytes: 0,
					observed_frames: 0,
					retained_frames: 0
				},
				rendered_terminal: {
					budget_bytes: 1e6,
					observed_bytes: 0,
					retained_bytes: 0,
					observed_frames: 0,
					retained_frames: 0
				},
				filesystem_before: {
					files_limit: 1e4,
					depth_limit: 16,
					enumeration_truncated: false,
					enumeration_reasons: [],
					enumeration_omissions: [],
					hash_budget_bytes: 1e7,
					hashed_bytes: 0,
					hash_omissions: []
				},
				filesystem_after: {
					files_limit: 1e4,
					depth_limit: 16,
					enumeration_truncated: false,
					enumeration_reasons: [],
					enumeration_omissions: [],
					hash_budget_bytes: 1e7,
					hashed_bytes: 0,
					hash_omissions: []
				},
				process: {
					sample_limit: 1e3,
					sampling_partial: false,
					retained_samples: 0,
					sample_limit_reached: false,
					sampling_failures: 0,
					first_sampling_failure: null,
					coverage: "sampled"
				}
			},
			limitations: [],
			residual_unknowns: [],
			cleanup: {
				owned_process_group: "verified",
				temporary_root: "removed"
			}
		};
		finalizedScenario = {
			...scenario,
			finalization_ms: 1500
		};
		finalizedComparisonContract = { finalization_ms: 1500 };
		FINALIZED_PROCESS_CAPTURE_EXAMPLE = {
			...EMPTY_PROCESS_CAPTURE_EXAMPLE,
			manifest: {
				...EMPTY_PROCESS_CAPTURE_EXAMPLE.manifest,
				scenario: finalizedScenario,
				comparison_contract: finalizedComparisonContract,
				full_scenario_sha256: digestProcessCommitment(finalizedScenario),
				comparison_contract_sha256: digestProcessCommitment(finalizedComparisonContract)
			},
			exit: {
				code: null,
				signal: 0,
				reason: "timeout",
				finalization: {
					requested_ms: 1500,
					elapsed_ms: 12,
					exit_code: 0,
					signals: [{
						signal: "SIGTERM",
						sent_at_ms: 0,
						delivery: "signaled"
					}]
				}
			}
		};
	})))();
}

//#endregion
//#region dist/domain/functionCallCoverage.js
var callerCoveragePrefix, calleeCoveragePrefix, combineFunctionRelationshipCoverage, isCallerOnlyIncompleteCoverage, functionCallCoverageLimitations;
function init_functionCallCoverage() {
	return (init_functionCallCoverage = __esmMin((() => {
		init_relationshipCoverage();
		init_canonicalOrdering();
		callerCoveragePrefix = "Callers: ";
		calleeCoveragePrefix = "Callees: ";
		combineFunctionRelationshipCoverage = (callers, callees) => {
			const reads = [{
				direction: "callers",
				coverage: callers
			}, {
				direction: "callees",
				coverage: callees
			}];
			const diagnostics = uniqueSorted(reads.flatMap(({ coverage }) => coverage?.diagnostics ?? []));
			const details = diagnostics.length > 0 ? { diagnostics } : {};
			const callersLimited = callers?.status !== "complete";
			const calleesLimited = callees?.status !== "complete";
			const limited_directions = callersLimited ? calleesLimited ? ["callers", "callees"] : ["callers"] : ["callees"];
			const reasons = reads.flatMap(({ direction, coverage }) => {
				const label = direction === "callers" ? callerCoveragePrefix : calleeCoveragePrefix;
				return relationshipCoverageLimitations(coverage).map((reason) => `${label}${reason}`);
			});
			if (reads.some(({ coverage }) => coverage === undefined || coverage.status === "unknown")) return {
				status: "unknown",
				reason: uniqueSorted(reasons).join(" "),
				limited_directions,
				...details
			};
			if (reasons.length > 0) return {
				status: "partial",
				limitations: uniqueSorted(reasons),
				limited_directions,
				...details
			};
			return {
				status: "complete",
				...details
			};
		};
		isCallerOnlyIncompleteCoverage = (coverage) => {
			if (coverage.status === "complete") return false;
			if (coverage.limited_directions !== undefined) return !coverage.limited_directions.some((direction) => direction === "callees");
			return coverage.status === "unknown" && coverage.reason.startsWith(callerCoveragePrefix) && !coverage.reason.includes(calleeCoveragePrefix);
		};
		functionCallCoverageLimitations = (coverage, dossier) => {
			return uniqueSorted([
				...relationshipCoverageLimitations(coverage),
				...coverage?.status === "complete" ? [] : coverage?.diagnostics ?? [],
				...(dossier.unresolved_calls ?? []).map(({ address, reason }) => `Unresolved call at ${address}: ${reason}`)
			]);
		};
	})))();
}

//#endregion
//#region dist/domain/functionDossierEvidence.js
var parseFunctionEvidence;
function init_functionDossierEvidence() {
	return (init_functionDossierEvidence = __esmMin((() => {
		init_evidence();
		init_unicodeCodePointOrder();
		init_hopperValues();
		init_functionCallCoverage();
		parseFunctionEvidence = (input) => {
			const evidence = parseEvidence(input);
			if (evidence.operation !== "analyze_function") throw new TypeError("Function comparison requires analyze_function Evidence");
			if (evidence.subject === null) throw new TypeError("Function comparison requires artifact-bound Evidence");
			const dossier = functionDossierSchema.parse(evidence.normalized_result);
			const callCoverageLimitations = functionCallCoverageLimitations(evidence.relationship_coverage, dossier);
			return {
				evidence,
				subject: evidence.subject,
				dossier,
				limitations: [...new Set([...evidence.limitations, ...dossier.limitations])].sort((left, right) => compareUnicodeCodePoints(left, right)),
				callCoverageLimitations
			};
		};
	})))();
}

//#endregion
//#region dist/domain/functionComparisonNormalization.js
var identityProjection, functionMatch, normalizeCfg, referenceProjection, referenceKindProjection, commentProjection, stringAndNameProjection, swiftLiteralSitesConflict, swiftLiteralSites, sorted, isAutoName, parseAddress, relativeAddress;
function init_functionComparisonNormalization() {
	return (init_functionComparisonNormalization = __esmMin((() => {
		init_comparisonSemantics();
		init_unicodeCodePointOrder();
		identityProjection = (snapshot) => ({
			name: snapshot.dossier.procedure.name,
			signature: snapshot.dossier.procedure.signature,
			locals: snapshot.dossier.procedure.locals.map(({ description }) => description).sort()
		});
		functionMatch = (left, right) => {
			const leftName = left.dossier.procedure.name;
			const rightName = right.dossier.procedure.name;
			const stableNames = !isAutoName(leftName) && !isAutoName(rightName);
			if (stableNames && leftName === rightName) return {
				status: "matched",
				method: "symbol",
				left_name: leftName,
				right_name: rightName
			};
			return {
				status: stableNames ? "mismatched" : "ambiguous",
				method: "explicit",
				left_name: leftName,
				right_name: rightName
			};
		};
		normalizeCfg = (blocks) => {
			const parsed = [];
			for (const block of blocks) {
				const start = parseAddress(block.start);
				const end = parseAddress(block.end);
				if (start === null || end === null || end <= start) return null;
				parsed.push({
					block,
					start,
					end
				});
			}
			const ordered = parsed.sort((left, right) => left.start < right.start ? -1 : left.start > right.start ? 1 : 0);
			if (new Set(ordered.map(({ start }) => start)).size !== ordered.length) return null;
			const indices = new Map(ordered.map(({ start }, index) => [start, index]));
			const graph = [];
			for (const { block, start, end } of ordered) {
				const successors = [];
				for (const address of block.successors) {
					const parsedAddress = parseAddress(address);
					if (parsedAddress === null) return null;
					const index = indices.get(parsedAddress);
					if (index === undefined) return null;
					successors.push(index);
				}
				graph.push({
					size: String(end - start),
					successors: successors.sort((left, right) => left - right)
				});
			}
			return graph;
		};
		referenceProjection = (snapshot) => sorted([...snapshot.dossier.incoming_references.map((item) => ({
			direction: "in",
			source: item.source_procedure?.name ?? null,
			target: item.target_procedure?.name ?? null
		})), ...snapshot.dossier.outgoing_references.map((item) => ({
			direction: "out",
			source: item.source_procedure?.name ?? null,
			target: item.target_procedure?.name ?? null
		}))]);
		referenceKindProjection = (snapshot) => {
			const edges = [...snapshot.dossier.incoming_references.map((edge) => ({
				direction: "in",
				edge
			})), ...snapshot.dossier.outgoing_references.map((edge) => ({
				direction: "out",
				edge
			}))];
			if (edges.some(({ edge }) => !edge.kind.available)) return null;
			return sorted(edges.map(({ direction, edge }) => {
				if (!edge.kind.available) throw new TypeError("Reference-kind availability changed during projection");
				return {
					direction,
					source: edge.source_procedure?.name ?? null,
					target: edge.target_procedure?.name ?? null,
					type: edge.kind.type,
					flow: edge.kind.flow,
					call: edge.kind.call,
					jump: edge.kind.jump,
					data: edge.kind.data,
					read: edge.kind.read,
					write: edge.kind.write,
					indirect: edge.kind.indirect,
					computed: edge.kind.computed,
					conditional: edge.kind.conditional,
					terminal: edge.kind.terminal,
					primary: edge.kind.primary,
					operand_index: edge.kind.operand_index,
					external: edge.kind.external
				};
			}));
		};
		commentProjection = (snapshot) => {
			const values = snapshot.dossier.comments.map(({ address, kind, text }) => ({
				offset: relativeAddress(address, snapshot.dossier.procedure.address),
				kind,
				text
			}));
			return values.some(({ offset }) => offset === null) ? null : sorted(values);
		};
		stringAndNameProjection = (snapshot, includeSwiftLiterals = true) => {
			const values = [
				...snapshot.dossier.referenced_strings.map(({ source_address: sourceAddress, value }) => ({
					kind: "string",
					source_offset: relativeAddress(sourceAddress, snapshot.dossier.procedure.address),
					value
				})),
				...snapshot.dossier.referenced_names.map(({ source_address: sourceAddress, value }) => ({
					kind: "name",
					source_offset: relativeAddress(sourceAddress, snapshot.dossier.procedure.address),
					value
				})),
				...(includeSwiftLiterals ? snapshot.dossier.swift_string_literals ?? [] : []).map(({ source_address: sourceAddress, value, representation, registers }) => ({
					kind: "swift_string",
					source_offset: relativeAddress(sourceAddress, snapshot.dossier.procedure.address),
					value,
					representation,
					registers
				}))
			];
			return values.some(({ source_offset: offset }) => offset === null) ? null : sorted(values);
		};
		swiftLiteralSitesConflict = (left, right) => {
			const leftSites = swiftLiteralSites(left);
			const rightSites = swiftLiteralSites(right);
			for (const site of new Set([...leftSites.values.keys(), ...rightSites.values.keys()])) {
				const leftValues = leftSites.values.get(site) ?? (leftSites.complete ? [] : undefined);
				const rightValues = rightSites.values.get(site) ?? (rightSites.complete ? [] : undefined);
				if (leftValues === undefined || rightValues === undefined) continue;
				const leftFacts = new Set(leftValues);
				const rightFacts = new Set(rightValues);
				if (rightSites.complete && leftValues.some((value) => !rightFacts.has(value)) || leftSites.complete && rightValues.some((value) => !leftFacts.has(value))) return true;
			}
			return false;
		};
		swiftLiteralSites = (snapshot) => {
			const base = snapshot.dossier.procedure.address;
			const omissions = snapshot.dossier.swift_string_literal_omissions ?? [];
			const site = (sourceAddress, registers) => {
				const offset = relativeAddress(sourceAddress, base);
				return offset === null ? null : canonicalJson([offset, registers]);
			};
			const values = new Map();
			for (const literal of snapshot.dossier.swift_string_literals ?? []) {
				const key = site(literal.source_address, literal.registers);
				if (key === null) continue;
				values.set(key, [...values.get(key) ?? [], canonicalJson([literal.value, literal.representation])].sort(compareUnicodeCodePoints));
			}
			const complete = snapshot.dossier.swift_string_literals !== undefined && omissions.length === 0;
			return {
				values,
				complete
			};
		};
		sorted = (values) => values.map((value) => ({
			value,
			json: canonicalJson(value, "Function normalization")
		})).sort((left, right) => compareUnicodeCodePoints(left.json, right.json)).map(({ value }) => value);
		isAutoName = (name) => /^(?:sub_[0-9a-f]+|fcn\.[0-9a-f]+|FUN_[0-9a-f]+)$/iu.test(name);
		parseAddress = (value) => /^0x[0-9a-f]+$/iu.test(value) ? BigInt(value) : null;
		relativeAddress = (value, base) => {
			const parsed = parseAddress(value);
			const parsedBase = parseAddress(base);
			return parsed === null || parsedBase === null || parsed < parsedBase ? null : String(parsed - parsedBase);
		};
	})))();
}

//#endregion
//#region dist/domain/functionComparisonDimensions.js
var compareDimensions, facetLimitations, compareText, compareComments, compareStringsAndNames, swiftLiteralCoverage, compareReferences, compareIdentity, compareCalls, callProjection, compareCfg, compareValues;
function init_functionComparisonDimensions() {
	return (init_functionComparisonDimensions = __esmMin((() => {
		init_comparisonSemantics();
		init_functionComparisonNormalization();
		init_functionComparisonResults();
		compareDimensions = (left, right, context) => {
			return [
				compareIdentity(left, right, context),
				compareText("pseudocode", left.dossier.pseudocode, right.dossier.pseudocode, context),
				compareText("assembly", left.dossier.assembly.join("\n"), right.dossier.assembly.join("\n"), context),
				compareComments(left, right, context),
				compareCalls(left, right, context),
				compareReferences(left, right, context),
				compareStringsAndNames(left, right, context),
				compareCfg(left, right, context)
			].map((result) => {
				const limitations = [...facetLimitations(left, result.dimension).map((reason) => `Left: ${reason}`), ...facetLimitations(right, result.dimension).map((reason) => `Right: ${reason}`)];
				return limitations.length === 0 ? result : unresolvedDimension({
					dimension: result.dimension,
					links: context.links,
					leftCount: null,
					rightCount: null,
					limitations: [...result.limitations, ...limitations]
				});
			});
		};
		facetLimitations = (snapshot, dimension) => {
			const { dossier } = snapshot;
			const fields = {
				identity: [],
				pseudocode: [["pseudocode", dossier.pseudocode.length]],
				assembly: [["assembly", dossier.assembly.length]],
				comments: [["comments", dossier.comments.length]],
				calls: [["callers", dossier.callers.length], ["callees", dossier.callees.length]],
				references: [["references", dossier.incoming_references.length + dossier.outgoing_references.length]],
				strings_names: [["strings_names", dossier.referenced_strings.length + dossier.referenced_names.length]],
				cfg: [["cfg", dossier.basic_blocks.length]]
			};
			return fields[dimension].flatMap(([field, count]) => {
				const availability = dossier.facet_availability?.[field];
				if (availability?.available === false) return [`${field}: ${availability.reason}`];
				return availability === undefined && count === 0 ? [`${field}: Provider did not declare coverage for this empty facet.`] : [];
			});
		};
		compareText = (dimension, left, right, context) => {
			const limitations = ["Exact provider text is compared without address or generated-name normalization; layout-only differences do not establish a behavior change.", ...dimension === "assembly" ? ["Assembly is opaque provider text; relocation normalization is unavailable."] : []];
			if (context.providersDiffer) return unresolvedDimension({
				dimension,
				links: context.links,
				leftCount: [...left].length,
				rightCount: [...right].length,
				limitations: [...limitations, "Exact text comparison requires one provider identity."]
			});
			const changes = diffLines(left, right, {
				timeout: 100,
				maxEditLength: 1e4
			});
			if (changes === undefined) return unresolvedDimension({
				dimension,
				links: context.links,
				leftCount: [...left].length,
				rightCount: [...right].length,
				limitations: [...limitations, "Bounded line diff exceeded its time or edit-distance limit."]
			});
			const delta = changes.reduce((summary, change) => ({
				added_lines: summary.added_lines + (change.added ? change.count ?? 0 : 0),
				removed_lines: summary.removed_lines + (change.removed ? change.count ?? 0 : 0),
				hunks: summary.hunks + (change.added || change.removed ? 1 : 0)
			}), {
				added_lines: 0,
				removed_lines: 0,
				hunks: 0
			});
			return dimensionResult({
				dimension,
				status: delta.hunks === 0 ? "unchanged" : "changed",
				left,
				right,
				...context,
				leftCount: [...left].length,
				rightCount: [...right].length,
				textDelta: delta,
				limitations
			});
		};
		compareComments = (left, right, context) => {
			const leftValues = commentProjection(left);
			const rightValues = commentProjection(right);
			if (leftValues === null || rightValues === null) return unresolvedDimension({
				dimension: "comments",
				links: context.links,
				leftCount: left.dossier.comments.length,
				rightCount: right.dossier.comments.length,
				limitations: ["Comment locations could not be normalized relative to the function."]
			});
			return compareValues("comments", leftValues, rightValues, context);
		};
		compareStringsAndNames = (left, right, context) => {
			const complete = swiftLiteralCoverage(left) === swiftLiteralCoverage(right) && swiftLiteralCoverage(left) !== "partial";
			const leftValues = stringAndNameProjection(left, complete);
			const rightValues = stringAndNameProjection(right, complete);
			if (leftValues === null || rightValues === null) return unresolvedDimension({
				dimension: "strings_names",
				links: context.links,
				leftCount: null,
				rightCount: null,
				limitations: ["Reference source locations could not be normalized to function offsets."]
			});
			const compared = compareValues("strings_names", leftValues, rightValues, context);
			if (complete || compared.status === "changed") return compared;
			if (swiftLiteralSitesConflict(left, right)) {
				const leftAll = stringAndNameProjection(left);
				const rightAll = stringAndNameProjection(right);
				if (leftAll !== null && rightAll !== null) return compareValues("strings_names", leftAll, rightAll, context);
			}
			return unresolvedDimension({
				dimension: "strings_names",
				links: context.links,
				leftCount: null,
				rightCount: null,
				limitations: ["Swift String literal coverage differs or is partial; referenced strings and names match, and complete coverage does not establish a differing literal."]
			});
		};
		swiftLiteralCoverage = (snapshot) => (snapshot.dossier.swift_string_literal_omissions ?? []).length > 0 ? "partial" : snapshot.dossier.swift_string_literals === undefined ? "absent" : "complete";
		compareReferences = (left, right, context) => {
			const leftProjection = referenceProjection(left);
			const rightProjection = referenceProjection(right);
			if (leftProjection.length === 0 && rightProjection.length === 0) return compareValues("references", leftProjection, rightProjection, context);
			if (canonicalJson(leftProjection, "Function comparison") !== canonicalJson(rightProjection, "Function comparison")) return dimensionResult({
				dimension: "references",
				status: "changed",
				left: leftProjection,
				right: rightProjection,
				...context,
				leftCount: leftProjection.length,
				rightCount: rightProjection.length,
				textDelta: null,
				limitations: ["Reference endpoints differ independently of provider reference-kind metadata."]
			});
			const leftKinds = referenceKindProjection(left);
			const rightKinds = referenceKindProjection(right);
			if (leftKinds !== null && rightKinds !== null) return compareValues("references", leftKinds, rightKinds, context);
			return unresolvedDimension({
				dimension: "references",
				links: context.links,
				leftCount: leftProjection.length,
				rightCount: rightProjection.length,
				limitations: ["At least one provider did not expose reference kinds, so equal endpoints do not prove equal edge semantics."]
			});
		};
		compareIdentity = (left, right, context) => {
			if (isAutoName(left.dossier.procedure.name) || isAutoName(right.dossier.procedure.name)) return unresolvedDimension({
				dimension: "identity",
				links: context.links,
				leftCount: null,
				rightCount: null,
				limitations: ["Address-derived function names are not stable cross-version identity."]
			});
			return compareValues("identity", identityProjection(left), identityProjection(right), context);
		};
		compareCalls = (left, right, context) => {
			const leftValues = callProjection(left);
			const rightValues = callProjection(right);
			const coverageLimitations = [...left.callCoverageLimitations.map((reason) => `Left: ${reason}`), ...right.callCoverageLimitations.map((reason) => `Right: ${reason}`)];
			if (coverageLimitations.length > 0) return unresolvedDimension({
				dimension: "calls",
				links: context.links,
				leftCount: leftValues.length,
				rightCount: rightValues.length,
				limitations: coverageLimitations
			});
			if ([...leftValues, ...rightValues].some(({ name }) => isAutoName(name))) return unresolvedDimension({
				dimension: "calls",
				links: context.links,
				leftCount: leftValues.length,
				rightCount: rightValues.length,
				limitations: ["Address-derived callee or caller names cannot be matched safely."]
			});
			return compareValues("calls", sorted(leftValues), sorted(rightValues), context);
		};
		callProjection = (snapshot) => [...snapshot.dossier.callers.map(({ name }) => ({
			direction: "in",
			name
		})), ...snapshot.dossier.callees.map(({ name }) => ({
			direction: "out",
			name
		}))];
		compareCfg = (left, right, context) => {
			const leftBlocks = left.dossier.basic_blocks;
			const rightBlocks = right.dossier.basic_blocks;
			const leftGraph = normalizeCfg(leftBlocks);
			const rightGraph = normalizeCfg(rightBlocks);
			if (leftGraph === null || rightGraph === null) return unresolvedDimension({
				dimension: "cfg",
				links: context.links,
				leftCount: leftBlocks.length,
				rightCount: rightBlocks.length,
				limitations: ["CFG addresses could not be normalized to local block indices."]
			});
			return compareValues("cfg", leftGraph, rightGraph, context);
		};
		compareValues = (dimension, left, right, context) => {
			const leftJson = canonicalJson(left, "Function comparison");
			const rightJson = canonicalJson(right, "Function comparison");
			return dimensionResult({
				dimension,
				status: leftJson === rightJson ? "unchanged" : "changed",
				left,
				right,
				...context,
				leftCount: Array.isArray(left) ? left.length : null,
				rightCount: Array.isArray(right) ? right.length : null,
				textDelta: null,
				limitations: []
			});
		};
	})))();
}

//#endregion
//#region dist/domain/functionComparison.js
var compareFunctions;
function init_functionComparison() {
	return (init_functionComparison = __esmMin((() => {
		init_comparisonSemantics();
		init_unicodeCodePointOrder();
		init_functionDossierEvidence();
		init_functionComparisonNormalization();
		init_functionComparisonSchemas();
		init_functionComparisonResults();
		init_functionComparisonDimensions();
		compareFunctions = (leftInput, rightInput) => {
			const left = parseFunctionEvidence(leftInput);
			const right = parseFunctionEvidence(rightInput);
			const links = [left.evidence.evidence_id, right.evidence.evidence_id];
			const providersDiffer = canonicalJson(left.evidence.provider, "Function comparison") !== canonicalJson(right.evidence.provider, "Function comparison");
			const dimensions = compareDimensions(left, right, {
				links,
				providersDiffer
			});
			const match = functionMatch(left, right);
			const changes = dimensions.filter(({ status }) => status !== "unchanged");
			return functionComparisonResultSchema.parse({
				status: overallStatus(dimensions, match.status),
				function_match: match,
				left_subject_sha256: left.subject.digest.sha256,
				right_subject_sha256: right.subject.digest.sha256,
				summary: summarize(dimensions),
				dimensions,
				changes,
				limitations: [...new Set([
					...left.limitations.map((item) => `Left: ${item}`),
					...right.limitations.map((item) => `Right: ${item}`),
					...providersDiffer ? ["Provider-specific pseudocode and assembly representations were not equated."] : []
				])].sort((a, b) => compareUnicodeCodePoints(a, b))
			});
		};
	})))();
}

//#endregion
//#region dist/contracts/investigationExamples.js
var comparison, FUNCTION_COMPARISON_EVIDENCE, PROCESS_PROVIDER, capture, captureEvidence, PROCESS_CAPTURE_REFERENCE, PROCESS_CAPTURE_RECONSTRUCTION, PROCESS_COMPARISON_EVIDENCE, INVESTIGATION_EXAMPLES;
function init_investigationExamples() {
	return (init_investigationExamples = __esmMin((() => {
		init_evidence();
		init_jsonValue();
		init_processComparison();
		init_processCaptureParsing();
		init_functionComparisonExample();
		init_processCaptureExample();
		init_functionComparison();
		comparison = compareFunctions(FUNCTION_COMPARISON_EXAMPLE.left, FUNCTION_COMPARISON_EXAMPLE.right);
		FUNCTION_COMPARISON_EVIDENCE = createEvidence(undefined, {
			id: "rea-function-comparison",
			name: "REA function comparison",
			version: "1"
		}, {
			predicateType: "rea.function-comparison",
			operation: "compare_functions",
			parameters: {
				left_evidence_id: FUNCTION_COMPARISON_EXAMPLE.left.evidence_id,
				right_evidence_id: FUNCTION_COMPARISON_EXAMPLE.right.evidence_id
			},
			result: jsonValueSchema.parse(comparison),
			confidence: "derived",
			authority: "analyst-inference",
			limitations: comparison.limitations,
			evidenceLinks: [FUNCTION_COMPARISON_EXAMPLE.left.evidence_id, FUNCTION_COMPARISON_EXAMPLE.right.evidence_id]
		});
		PROCESS_PROVIDER = {
			id: "rea-process",
			name: "REA deterministic process harness",
			version: "3"
		};
		capture = parseProcessCapture(EMPTY_PROCESS_CAPTURE_EXAMPLE);
		captureEvidence = (scenario) => createEvidence(undefined, PROCESS_PROVIDER, {
			predicateType: "rea.process-capture",
			operation: "capture_process_scenario",
			parameters: { scenario },
			result: jsonValueSchema.parse(capture),
			confidence: "observed",
			authority: "controlled-replay",
			environment: {
				id: "fixture-linux",
				platform: "linux",
				architecture: "x86_64",
				isolation: "container"
			}
		});
		PROCESS_CAPTURE_REFERENCE = captureEvidence("reference");
		PROCESS_CAPTURE_RECONSTRUCTION = captureEvidence("reconstruction");
		PROCESS_COMPARISON_EVIDENCE = createEvidence(undefined, PROCESS_PROVIDER, {
			predicateType: "rea.process-comparison",
			operation: "compare_process_captures",
			parameters: {
				left_evidence_id: PROCESS_CAPTURE_REFERENCE.evidence_id,
				right_evidence_id: PROCESS_CAPTURE_RECONSTRUCTION.evidence_id,
				left_normalization: capture.normalization,
				right_normalization: capture.normalization
			},
			result: jsonValueSchema.parse(compareProcessCaptures(capture, capture)),
			confidence: "derived",
			authority: "analyst-inference",
			evidenceLinks: [PROCESS_CAPTURE_REFERENCE.evidence_id, PROCESS_CAPTURE_RECONSTRUCTION.evidence_id]
		});
		INVESTIGATION_EXAMPLES = {
			compare_process_captures: { input: {
				left: PROCESS_CAPTURE_REFERENCE,
				right: PROCESS_CAPTURE_RECONSTRUCTION
			} },
			find_changed_behavior: { comparisons: [FUNCTION_COMPARISON_EVIDENCE] },
			build_call_path: {
				functions: [FUNCTION_COMPARISON_EXAMPLE.left],
				start: { address: "0x1000" },
				goal: { address: "0x1000" }
			},
			correlate_static_and_runtime: {
				static_comparisons: [FUNCTION_COMPARISON_EVIDENCE],
				runtime_comparisons: [PROCESS_COMPARISON_EVIDENCE],
				mappings: [{
					static: {
						comparison_evidence_id: FUNCTION_COMPARISON_EVIDENCE.evidence_id,
						selector: {
							kind: "function",
							dimension: "pseudocode"
						}
					},
					runtime: {
						comparison_evidence_id: PROCESS_COMPARISON_EVIDENCE.evidence_id,
						dimension: "terminal"
					},
					side_alignment: "left_to_left",
					hypothesis: {
						statement: "Static implementation changed without terminal change.",
						expected_pattern: "static_only"
					}
				}]
			},
			verify_reconstruction: { specification: {
				name: "Terminal compatibility",
				claims: [{
					kind: "behavioral",
					claim_id: "terminal-output",
					title: "Terminal output remains equivalent",
					comparison_evidence_id: PROCESS_COMPARISON_EVIDENCE.evidence_id,
					dimension: "terminal"
				}]
			} }
		};
	})))();
}

//#endregion
//#region dist/contracts/toolContractExamples.js
var TOOL_EXAMPLE_OVERRIDES;
function init_toolContractExamples() {
	return (init_toolContractExamples = __esmMin((() => {
		init_unknownContractExamples();
		init_artifactComparisonExample();
		init_functionComparisonExample();
		init_investigationExamples();
		TOOL_EXAMPLE_OVERRIDES = {
			...UNKNOWN_CONTRACT_EXAMPLES,
			...INVESTIGATION_EXAMPLES,
			goto_address: { address: "0x1000" },
			procedure_address: { procedure: "main" },
			procedure_assembly: { procedure: "main" },
			procedure_callees: { procedure: "main" },
			procedure_callers: { procedure: "main" },
			procedure_info: { procedure: "main" },
			trace_native_values: { procedure: "0x1000" },
			inspect_native_data_type: { type: "/MyStruct" },
			inspect_native_instruction: { address: "0x1000" },
			resolve_native_call_targets: { address: "0x1000" },
			read_function_instructions: { procedure: "main" },
			read_bytes: {
				address: "0x1000",
				length: 16
			},
			search_bytes: { pattern: "48 8B ?? ?? 89" },
			address_to_file_offset: { address: "0x1000" },
			procedure_references: { procedure: "main" },
			procedure_pseudo_code: { procedure: "main" },
			resolve_containing_procedure: { address: "0x1000" },
			search_procedures: { pattern: "main" },
			search_strings: { pattern: "authorization failed" },
			set_address_name: {
				address: "0x1000",
				name: "entry"
			},
			set_addresses_names: { names: { "0x1000": "entry" } },
			set_bookmark: { address: "0x1000" },
			set_comment: {
				address: "0x1000",
				comment: "validated entry point"
			},
			set_inline_comment: {
				address: "0x1000",
				comment: "calls parser"
			},
			unset_bookmark: { address: "0x1000" },
			get_call_graph: { address: "0x1000" },
			find_xrefs_to_name: { name: "malloc" },
			analyze_function: { procedure: "main" },
			annotate_native_function: {
				procedure: "0x10100",
				name: "entry",
				comment: "Analyst observation"
			},
			analyze_swift_types: {
				category: "classes",
				pattern: "Account"
			},
			inspect_native_api: { procedure: "main" },
			trace_feature: { query: "license" },
			trace_call_path: {
				start: "0x1000",
				goal: "0x1100"
			},
			trace_native_ui_action: { action: "buildTapped:" },
			open_binary: { path: "/tmp/fixture" },
			export_evidence_bundle: { path: "/tmp/evidence.json" },
			get_evidence_bundle: {
				detail: "summary",
				filters: {
					operation: "analyze_function",
					procedure_address: "0x1000"
				}
			},
			inspect_address_context: { address: "0x1000" },
			import_evidence_bundle: { path: "/tmp/evidence.json" },
			capture_process_scenario: {
				executable: "/usr/bin/true",
				working_directory: "/tmp",
				timeout_ms: 3e4,
				finalization_ms: 1500
			},
			compare_process_captures: {
				left: PROCESS_CAPTURE_REFERENCE,
				right: PROCESS_CAPTURE_RECONSTRUCTION
			},
			compare_artifacts: {
				left: ARTIFACT_COMPARISON_EXAMPLE.left,
				right: ARTIFACT_COMPARISON_EXAMPLE.right
			},
			compare_functions: {
				left: FUNCTION_COMPARISON_EXAMPLE.left,
				right: FUNCTION_COMPARISON_EXAMPLE.right
			},
			compare_bundles: {
				left_bundle_path: "/tmp/left-evidence.json",
				right_bundle_path: "/tmp/right-evidence.json"
			},
			inspect_with_objdump: {
				path: "/tmp/program",
				operation: "disassemble"
			},
			execute_rizin_command: {
				path: "/tmp/program",
				command: "iI"
			},
			list_frida_devices: {},
			list_frida_processes: { device_id: "local" },
			start_frida_session: {
				mode: "attach",
				device_id: "local",
				pid: 1234
			},
			load_frida_script: {
				session_id: "00000000-0000-4000-8000-000000000001",
				source_kind: "inline",
				source: "send(Process.id);"
			},
			resume_frida_session: { session_id: "00000000-0000-4000-8000-000000000001" },
			unload_frida_script: {
				session_id: "00000000-0000-4000-8000-000000000001",
				script_id: "00000000-0000-4000-8000-000000000002"
			},
			frida_session_status: { session_id: "00000000-0000-4000-8000-000000000001" },
			close_frida_session: { session_id: "00000000-0000-4000-8000-000000000001" },
			instrument_with_frida: {
				mode: "attach",
				device_id: "local",
				pid: 1234,
				source_kind: "inline",
				source: "send(Process.id);",
				duration_ms: 1e3
			}
		};
	})))();
}

//#endregion
//#region dist/contracts/toolContractHelpers.js
var document, address, optionalAddress, procedure, exampleInputSchema, examplesFor;
function init_toolContractHelpers() {
	return (init_toolContractHelpers = __esmMin((() => {
		init_jsonValue();
		init_toolContractExamples();
		document = z.string().optional().describe("The active target's provider document name; use open_binary to switch targets");
		address = z.string().describe("A provider-normalized address; default memory uses 0x-prefixed hexadecimal");
		optionalAddress = address.optional();
		procedure = z.string().describe("The procedure name or address");
		exampleInputSchema = z.record(z.string(), jsonValueSchema);
		examplesFor = (name, inputSchema) => {
			const parsed = inputSchema.parse(TOOL_EXAMPLE_OVERRIDES[name] ?? {});
			return [{
				title: `Example ${name.replaceAll("_", " ")} request`,
				input: exampleInputSchema.parse(parsed)
			}];
		};
	})))();
}

//#endregion
//#region dist/contracts/functionInstructionContract.js
var functionInstructionInputSchema;
function init_functionInstructionContract() {
	return (init_functionInstructionContract = __esmMin((() => {
		functionInstructionInputSchema = z.object({
			procedure: z.string().describe("The procedure name or address"),
			document: z.string().optional().describe("The document name")
		});
	})))();
}

//#endregion
//#region dist/contracts/hopperMemoryContracts.js
var HOPPER_MEMORY_TOOL_DEFINITIONS;
function init_hopperMemoryContracts() {
	return (init_hopperMemoryContracts = __esmMin((() => {
		init_toolContractHelpers();
		init_bytePattern();
		HOPPER_MEMORY_TOOL_DEFINITIONS = [
			{
				name: "search_bytes",
				description: "Find masked byte signatures in initialized analyzed memory. Hex byte pairs and ?? wildcards are supported; an optional equal-length hex mask selects bits. Bounds are inclusive. Matches are ordered by provider address and never span blocks. Coverage describes this page; reuse the same query with next_cursor to continue. Uninitialized blocks are listed separately. Ghidra only; Hopper is unavailable.",
				inputSchema: z.strictObject({
					...bytePatternFields,
					document,
					start: address.optional(),
					end: address.optional(),
					limit: z.number().int().min(1).max(1e3).default(100),
					cursor: z.string().min(1).optional()
				}).superRefine(validateBytePattern)
			},
			{
				name: "read_bytes",
				description: "Read analyzed bytes from one provider-normalized virtual address. The hexadecimal payload reports the exact returned length; incomplete reads remain explicit and unsupported provider APIs return typed capability unavailability.",
				inputSchema: z.object({
					address,
					length: z.number().int().min(1).default(256),
					document
				})
			},
			{
				name: "address_to_file_offset",
				description: "Map one provider-normalized virtual address to its original nonnegative file offset. Hopper verifies the original bytes against the selected executable digest and translates FAT image-relative offsets using the loaded header. Results preserve the provider coordinate, image base, and source path. Unmapped addresses fail explicitly; changed or unavailable sources return typed errors retaining native mapping facts as partial evidence.",
				inputSchema: z.object({
					address,
					document
				})
			}
		];
	})))();
}

//#endregion
//#region dist/contracts/analysisSearchContract.js
var analysisSearchInput;
function init_analysisSearchContract() {
	return (init_analysisSearchContract = __esmMin((() => {
		analysisSearchInput = {
			pattern: z.string().min(1).describe("The literal text or regex pattern to search for"),
			mode: z.enum(["literal", "regex"]).default("literal"),
			case_sensitive: z.boolean().default(false).describe("Whether to match case"),
			document: z.string().optional().describe("The document name")
		};
	})))();
}

//#endregion
//#region dist/contracts/officialToolContracts.js
var official, OFFICIAL_TOOL_CONTRACTS;
function init_officialToolContracts() {
	return (init_officialToolContracts = __esmMin((() => {
		init_nativeFunctionAnnotations();
		init_toolOutputSchemaGroups();
		init_toolOutputSchemaPrimitives();
		init_toolContractHelpers();
		init_toolEffects();
		init_nativeDataType();
		init_nativeInstruction();
		init_functionInstructionContract();
		init_hopperMemoryContracts();
		init_analysisSearchContract();
		official = (name, description, inputSchema) => {
			const strictInputSchema = inputSchema.strict();
			return {
				name,
				...toolContractMetadata(name),
				description,
				kind: "official-proxy",
				inputSchema: strictInputSchema,
				outputSchema: requireOutputSchema(officialOutputSchemas, name),
				examples: examplesFor(name, strictInputSchema)
			};
		};
		OFFICIAL_TOOL_CONTRACTS = [
			official("annotate_native_function", "Atomically update one function name and/or entry comments, read them back, and return a refreshed complete function dossier. Ghidra changes its ephemeral session analysis database only; original executable bytes remain unchanged. Empty comment text clears that comment. Edits remain available to subsequent MCP calls until close; CLI returns the updated dossier before discarding its session. Invalid edits roll back the entire operation. Windows P0 and providers without this capability are unsupported.", nativeFunctionAnnotationsInputSchema),
			official("inspect_native_load_image", "Verify the provider's loaded DOS MZ or explicitly selected COM image against its immutable target snapshot: complete original/modified source-byte digests, header/module file mappings and memory digests, relocations and external entry. Returns measured observations and independent checks with mismatch coordinates. COM verification includes its imposed entry register context and does not claim PSP/runtime coverage. Overlay and uninitialized coverage remain explicit; other formats return unsupported. Does not execute or modify the target.", z.strictObject({})),
			official("inspect_native_data_type", "Inspect one recovered type by exact database category path or defined typed data address. Returns observed size, alignment, packing, fields, bitfields, enum values, and child type identities; source-level authority and flexible-tail semantics remain unknown unless substantiated.", nativeDataTypeInputSchema),
			official("inspect_native_instruction", "Inspect one exact code or data address: decoded bytes, mnemonic, ordered operand tokens, flow, outgoing instruction references and typed incoming references where available. Incoming references preserve source, access kind, operand index and analysis provenance even at data addresses; they do not prove runtime access. Memory addressing decomposition is unavailable when the provider supplies only tokens. Data, interior instruction addresses and undecodable bytes are distinct outcomes.", nativeInstructionInputSchema),
			official("resolve_native_call_targets", "Resolve one explicit static call site using typed provider call references. Preserves ambiguous targets as candidates and unresolved computed calls as unknown; does not execute code or traverse a call graph.", nativeInstructionInputSchema),
			official("address_name", "Resolve the primary analyzed name at a code or data address. Headless providers require an explicit address; GUI providers may default to their current cursor. Null means the provider has no primary name at that address.", z.object({
				document,
				address: optionalAddress
			})),
			official("comment", "Read the regular analysis comment at an address, defaulting to the current cursor. This is read-only and returns null when no comment exists; use set_comment to persist a finding.", z.object({
				document,
				address: optionalAddress
			})),
			official("current_address", "Return Hopper's current cursor address for the selected document. Use only for interactive navigation state; prefer explicit addresses in reproducible investigations.", z.object({ document })),
			official("current_procedure", "Return the analyzed procedure containing Hopper's current cursor. This uses GUI cursor state and is not a procedure-name lookup.", z.object({ document })),
			official("current_document", "Return the document currently selected by REA's Hopper bridge.", z.object({})),
			official("goto_address", "Move Hopper's GUI cursor to a mapped address and return the observed cursor address. Interior coordinates snap to the containing analyzed object's start. Unmapped destinations fail without moving the cursor. This changes navigation state but not analysis data; use explicit-address tools for headless workflows.", z.object({
				address,
				document
			})),
			official("inline_comment", "Read the inline instruction comment at an address, defaulting to the current cursor. Returns null when absent; use set_inline_comment to write one.", z.object({
				document,
				address: optionalAddress
			})),
			official("list_bookmarks", "List every bookmark in the selected Hopper document as address and name pairs; unnamed bookmarks retain a null name. Use bookmarks as analyst-authored navigation aids; this does not discover code references.", z.object({ document })),
			official("list_documents", "List provider program or document identities. Hopper may expose several documents; a Ghidra headless session contains exactly its one imported Program.", z.object({})),
			official("list_names", "List every analyzed memory and external symbol as address/value pairs. Provider metadata distinguishes Ghidra primary, dynamic, external, type, and source facts when available.", z.object({
				document,
				address: optionalAddress
			})),
			official("list_procedures", "List every analyzed procedure as address/value pairs after provider analysis. Ghidra metadata distinguishes thunks and external functions; use returned addresses in later function operations.", z.object({ document })),
			official("list_segments", "List segments or memory blocks using exclusive end addresses. Ghidra reports block permissions, address space, image base, initialization, and overlay facts; Hopper marks unavailable permissions explicitly.", z.object({ document })),
			official("list_strings", "List every provider-defined string object, or filter to one address, as address/value pairs with encoding, terminator status, and byte length when available. Hopper reads complete typed objects and retains its original display text as provider_value; long literals may span adjacent unterminated objects.", z.object({
				document,
				address: optionalAddress
			})),
			official("next_address", "Return the next analyzed object address after an explicit address or current cursor. This is a navigation primitive, not instruction-flow or CFG analysis.", z.object({
				document,
				address: optionalAddress
			})),
			official("prev_address", "Return the previous analyzed object start before an explicit address or current cursor. This is a navigation primitive and may fail at document boundaries; data objects and instructions remain distinct from control flow.", z.object({
				document,
				address: optionalAddress
			})),
			official("procedure_address", "Resolve an unambiguous procedure symbol name or provider-normalized address to its canonical entry address. External address spaces remain explicit.", z.object({
				procedure,
				document
			})),
			official("procedure_assembly", "Return assembly for one analyzed procedure identified by symbol or hexadecimal address. Use when pseudocode loses calling-convention or instruction-level detail; output is currently returned as one unpaginated string. Ghidra terminal-call assumptions that may cut the analyzed body are reported in Evidence limitations.", z.object({
				procedure,
				document
			})),
			official("procedure_callees", "Return the provider's resolved direct callees for one procedure identified by symbol or address. Unresolved indirect calls may be absent; use analyze_function and typed references to preserve available edge uncertainty. Ghidra terminal-call assumptions that may cut the analyzed body are reported in Evidence limitations.", z.object({
				procedure,
				document
			})),
			official("procedure_callers", "Return the provider's resolved direct callers for one procedure identified by symbol or address. Results reflect completed static analysis and may omit unresolved indirect references. Ghidra terminal-call assumptions that may cut the analyzed body are reported in Evidence limitations.", z.object({
				procedure,
				document
			})),
			official("procedure_info", "Return provider metadata for one procedure identified by symbol or address: entrypoint, signature, locals, size, block count, and complete inclusive body ranges when observed. Extents reflect the provider's analyzed body; Ghidra terminal-call assumptions that may cut it are reported in Evidence limitations. Hopper locals preserve observed names and signed stack displacements; source types remain unknown. Body byte count and enclosing span remain distinct; unavailable extent is explicit.", z.object({
				procedure,
				document
			})),
			official("read_function_instructions", "Return every raw instruction for one analyzed procedure. Instruction text and body extent are provider-specific. Ghidra terminal-call assumptions that may cut the analyzed body are reported in limitations.", functionInstructionInputSchema),
			...HOPPER_MEMORY_TOOL_DEFINITIONS.map(({ name, description, inputSchema }) => official(name, description, inputSchema)),
			official("procedure_references", "Return every raw incoming or outgoing reference edge for one procedure. Endpoint procedures are resolved only from provider containment. Ghidra preserves detailed reference flags. Hopper preserves native CallReference classifications and exact endpoints while leaving unavailable detailed flags explicit.", z.object({
				procedure,
				direction: z.enum(["incoming", "outgoing"]).default("outgoing"),
				document
			})),
			official("procedure_pseudo_code", "Decompile one analyzed procedure by symbol name or provider-normalized address. Ghidra also accepts file-offset:0x... selectors and falls back to a unique source-file mapping when a 0x-prefixed number resolves to no procedure; existing analysis addresses take precedence and ambiguous mappings fail explicitly. Returns provider-specific pseudocode, never original source or cross-provider text equivalence, and may return null; request procedure_assembly when instruction precision matters. Ghidra no-return assumptions may cut the analyzed body; Evidence limitations report observed terminal calls and available callee identities.", z.object({
				procedure,
				document
			})),
			official("resolve_containing_procedure", "Resolve an arbitrary address, including an interior instruction or exact external entry, to its provider-analyzed containing procedure. A negative result distinguishes outside segments from not in a procedure and is never guessed from nearby symbols.", z.object({
				address,
				document
			})),
			official("search_procedures", "Search every analyzed procedure name using literal matching by default or regex when requested. Results are deterministic and complete. Hopper regex mode uses ECMAScript Unicode syntax in a cancellable worker; a matching deadline leaves its API usable.", z.object(analysisSearchInput)),
			official("search_strings", "Search every provider-defined string object using literal matching by default or regex when requested. Results are deterministic and complete over those defined objects, not every text sequence in artifact bytes. Ghidra may omit packed or undefined literals, including Rust strings; an empty result does not prove text is absent. If an address is known, read_bytes and xrefs inspect its bytes and references. Hopper retains typed byte decoding, native display, and explicit decoding unknowns. Adjacent long-literal fragments match independently. Hopper regex mode uses ECMAScript Unicode syntax in a cancellable worker; a matching deadline leaves its API usable.", z.object(analysisSearchInput)),
			official("set_address_name", "Assign an analyst name to one mapped hexadecimal address and report whether the native edit succeeded and exact readback matched. Hopper rejects symbol names exceeding 1024 UTF-16 code units before mutation, and rejects names owned by another address; use set_addresses_names to explicitly move or swap labels among selected addresses. This mutates analysis metadata.", z.object({
				address,
				name: z.string(),
				document
			})),
			official("set_addresses_names", "Assign analyst names to multiple mapped addresses in one call and return per-address edit/readback success booleans. Hopper validates mapped destinations, native string representations, its 1024 UTF-16 code-unit symbol-name limit, and unique destinations/names before applying edits. Existing labels may move or swap only among explicitly selected addresses; unselected label owners remain unchanged. This mutates analysis metadata; verify failures individually.", z.object({
				names: z.record(z.string(), z.string()),
				document
			})),
			official("set_bookmark", "Create or replace a bookmark at a mapped hexadecimal address and report success. This mutates navigation metadata; bookmarks are analyst-authored navigation aids, not binary evidence.", z.object({
				address,
				name: z.string().optional(),
				document
			})),
			official("set_comment", "Write a regular analysis comment at a hexadecimal address and return whether readback matched. An empty comment clears it. This mutates the Hopper document; use comments to record evidence IDs or reasoning.", z.object({
				address,
				comment: z.string(),
				document
			})),
			official("set_inline_comment", "Write an inline instruction comment at a hexadecimal address and return whether readback matched. An empty comment clears it; Hopper may flatten newlines, producing false on exact readback. This mutates analysis metadata.", z.object({
				address,
				comment: z.string(),
				document
			})),
			official("unset_bookmark", "Remove the bookmark at a mapped hexadecimal address and return whether it is absent. Hopper also permits removing an existing legacy bookmark outside mapped memory. This mutates navigation metadata and does not alter binary bytes.", z.object({
				address,
				document
			})),
			official("xrefs", "Return analyzed references to a code or data address. Hopper may default to its current cursor; headless providers such as Ghidra require an explicit address. Use to connect strings, globals, selectors, and functions; bare addresses are untyped and indirect references may be incomplete. Use inspect_native_instruction at the target address for typed incoming references where supported.", z.object({
				document,
				address: optionalAddress
			}))
		];
	})))();
}

//#endregion
export { ARTIFACT_ANALYSIS_OPERATIONS, ARTIFACT_TOOL_CONTRACTS, OFFICIAL_TOOL_CONTRACTS, TOOL_EXAMPLE_OVERRIDES, analysisSearchInput, artifactExtractionExecutionSchema, artifactInventoryInputSchema, combineFunctionRelationshipCoverage, enhancedInputSchemas, examplesFor, init_analysisSearchContract, init_artifactToolContracts, init_enhancedInputs, init_functionCallCoverage, init_officialToolContracts, init_toolContractExamples, init_toolContractHelpers };