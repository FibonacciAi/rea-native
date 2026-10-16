import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { addressDistance, addressedValue, classifySwiftSymbol, compareUnicodeCodePoints, createEvidence, err, functionDossierSchema, init_evidence, init_hopperValues, init_interfaceBuilderGraph, init_nativeApiBoundary, init_nativeInstruction, init_nativeInvestigationGraph, init_nativeValueTrace, init_objcSwiftMetadata, init_result, init_swiftSymbolClassification, init_toolOutputSchemaPrimitives, init_unicodeCodePointOrder, inspectNativeDispatchMetadata, interfaceBuilderAnalysisSchema, isSwiftMangledSymbolName, joinInterfaceBuilderDispatch, nativeApiInspectionResultSchema, nativeCallTargetsSchema, nativeDispatchMetadataResultSchema, nativeInvestigationGraphSchema, nativeInvestigationTraceSchema, nativeValueTraceInputSchema, nativeValueTraceSchema, ok, parseDocuments, parseFunctionDossier, parseListCount, parseRelatedAddresses, parseSegmentImageBase, parseSegments, referenceKindSchema, traceNativeInvestigationGraph } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisInputError, AnalysisOutputError, init_analysisErrorCore, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { init_analysisErrorProjection, init_jsonSerialization, jsonParts, projectAnalysisError } from "./cliResultOutput-DsRMI8CJ.js";
import { enhancedInputSchemas, init_enhancedInputs } from "./officialToolContracts-CCFF0an9.js";
import { init_ProcedureAddressResolution, resolveProcedureAddress } from "./DirectAnalysis-BgvAtpN3.js";
import { z } from "zod";

//#region dist/domain/symbolAnalysis.js
var OBJC_CLASS_MARKER, LEGACY_OBJC_CLASS_PREFIX, OBJC_PROTOCOL_MARKER, discoverObjcClasses, discoverObjcProtocols, isSwiftSymbolName, categorizeSwiftTypes, swiftAliasesByAddress, uniqueByName, toJsonEntry;
function init_symbolAnalysis() {
	return (init_symbolAnalysis = __esmMin((() => {
		init_swiftSymbolClassification();
		OBJC_CLASS_MARKER = "OBJC_CLASS_$_";
		LEGACY_OBJC_CLASS_PREFIX = "l_OBJC_CLASS_";
		OBJC_PROTOCOL_MARKER = "OBJC_PROTOCOL_$_";
		discoverObjcClasses = (names, pattern) => {
			const classes = uniqueByName(names.filter(({ name }) => name.includes(OBJC_CLASS_MARKER) || name.startsWith(LEGACY_OBJC_CLASS_PREFIX) && name.length > LEGACY_OBJC_CLASS_PREFIX.length && !/^l_OBJC_CLASS_NAME_(?:\.\d+)?$/u.test(name)).filter(({ name }) => pattern.length === 0 || name.includes(pattern)));
			return {
				count: classes.length,
				classes: classes.map(toJsonEntry)
			};
		};
		discoverObjcProtocols = (names) => {
			const protocols = uniqueByName(names.filter(({ name }) => name.includes(OBJC_PROTOCOL_MARKER) || name.includes("_TtP") || name.endsWith("Mp") && classifySwiftSymbol(name)?.category === "protocols"));
			return {
				count: protocols.length,
				protocols: protocols.map(toJsonEntry)
			};
		};
		isSwiftSymbolName = (name) => isSwiftMangledSymbolName(name) || classifySwiftSymbol(name) !== undefined;
		categorizeSwiftTypes = (procedures, filter = {}, symbols = []) => {
			const groups = Object.fromEntries([
				"classes",
				"structs",
				"enums",
				"protocols",
				"extensions",
				"other"
			].map((category) => [category, []]));
			const aliases = swiftAliasesByAddress(symbols);
			const pattern = filter.pattern;
			const seen = new Set();
			const unclassifiedNames = new Set();
			const unclassified = [];
			for (const entry of procedures) {
				if (seen.has(entry.name)) continue;
				const mangledNames = [...new Set([...isSwiftSymbolName(entry.name) ? [entry.name] : [], ...aliases.get(entry.address) ?? []])];
				if (mangledNames.length === 0) continue;
				if (pattern !== undefined && ![entry.name, ...mangledNames].some((name) => name.includes(pattern))) continue;
				const kinds = new Set(mangledNames.filter((name) => classifySwiftSymbol(name) !== undefined).map((name) => classifySwiftSymbol(name)?.category ?? null));
				const category = kinds.size === 1 ? [...kinds][0] ?? null : null;
				const item = {
					address: entry.address,
					name: entry.name,
					mangled_names: mangledNames
				};
				if (category === null && !unclassifiedNames.has(entry.name)) {
					unclassifiedNames.add(entry.name);
					unclassified.push({
						...item,
						reason: kinds.size > 1 && !kinds.has(null) ? "conflicting_categories" : "category_not_decoded"
					});
				}
				const bucket = category ?? "other";
				if (filter.category === undefined || filter.category === bucket) {
					seen.add(entry.name);
					groups[bucket]?.push(item);
				}
			}
			const categories = Object.fromEntries(Object.entries(groups).map(([category, items]) => [category, {
				count: items.length,
				items
			}]));
			return {
				total: Object.values(groups).reduce((sum, items) => sum + items.length, 0),
				categories,
				unclassified,
				limitations: ["Identification uses Swift mangled procedure names or same-address symbol aliases. Demangled names without retained Swift manglings cannot be identified. Counts deduplicate procedure names, not source declarations.", ...unclassified.length === 0 ? [] : ["Some Swift categories could not be established from the retained manglings. Unclassified observations remain inline regardless of the category filter."]]
			};
		};
		swiftAliasesByAddress = (symbols) => {
			const aliases = new Map();
			for (const { address, name } of symbols) {
				if (!isSwiftSymbolName(name)) continue;
				const existing = aliases.get(address);
				if (existing === undefined) aliases.set(address, [name]);
				else existing.push(name);
			}
			return aliases;
		};
		uniqueByName = (entries) => {
			const seen = new Set();
			return entries.filter(({ name }) => {
				if (seen.has(name)) return false;
				seen.add(name);
				return true;
			});
		};
		toJsonEntry = ({ address, name }) => ({
			address,
			name
		});
	})))();
}

//#endregion
//#region dist/application/native/NativeDispatchMetadataInspection.js
var inspectNativeDispatch;
function init_NativeDispatchMetadataInspection() {
	return (init_NativeDispatchMetadataInspection = __esmMin((() => {
		init_toolOutputSchemaPrimitives();
		init_objcSwiftMetadata();
		init_analysisErrorCore();
		init_jsonValue();
		init_result();
		inspectNativeDispatch = async (analysis, maxRecords, signal) => {
			const binaryMetadata = await analysis.execute("inspect_native_dispatch_metadata", { max_records: maxRecords }, signal === undefined ? {} : { signal });
			if (binaryMetadata.ok) return ok(jsonValueSchema.parse(nativeDispatchMetadataResultSchema.parse(binaryMetadata.value.result)));
			if (binaryMetadata.error._tag !== "AnalysisCapabilityUnavailableError") return err(binaryMetadata.error);
			const execution = await analysis.execute("list_names", {}, signal === undefined ? {} : { signal });
			if (!execution.ok) return err(execution.error);
			const names = z.array(z.union([addressedValue.strict(), addressedValue.omit({ value: true }).extend({ name: z.string() }).strict()])).safeParse(execution.value.result);
			if (!names.success) return err(new AnalysisOutputError("list_names", "provider returned an invalid inventory"));
			return ok(jsonValueSchema.parse(nativeDispatchMetadataResultSchema.parse({
				target_sha256: execution.value.subject?.sha256 ?? null,
				provider: execution.value.provider,
				analysis_profile_digest: execution.value.analysisProfile?.digest ?? null,
				result: inspectNativeDispatchMetadata(names.data.map((entry) => ({
					address: entry.address,
					name: "value" in entry ? entry.value : entry.name
				})), maxRecords)
			})));
		};
	})))();
}

//#endregion
//#region dist/application/native/NativeValueTrace.js
var NODE_PAYLOAD_BYTES, traceNativeValues;
function init_NativeValueTrace() {
	return (init_NativeValueTrace = __esmMin((() => {
		init_hopperValues();
		init_nativeInstruction();
		init_nativeValueTrace();
		init_evidence();
		init_analysisErrorCore();
		init_result();
		init_jsonSerialization();
		NODE_PAYLOAD_BYTES = 8 * 1024 * 1024;
		traceNativeValues = async (analysis, parameters, signal) => {
			const input = nativeValueTraceInputSchema.parse(parameters);
			const nodes = [];
			const edges = [];
			const procedures = [];
			const unknowns = [];
			const callBindings = [];
			const pending = [{
				procedure: input.procedure,
				depth: 0
			}];
			const attempted = new Set();
			const visited = new Set();
			let targetSha256;
			let truncated = false;
			let decompilations = 0;
			let callSites = 0;
			let bytes = 0;
			let nodeBudgetReached = false;
			const retainNode = (value) => {
				if (nodeBudgetReached) return false;
				if (nodes.length >= input.max_nodes) {
					truncated = true;
					nodeBudgetReached = true;
					return false;
				}
				let size = 0;
				for (const part of jsonParts(value)) {
					size += Buffer.byteLength(part);
					if (size > NODE_PAYLOAD_BYTES - bytes) {
						truncated = true;
						nodeBudgetReached = true;
						return false;
					}
				}
				bytes += size;
				nodes.push(value);
				return true;
			};
			while (pending.length > 0) {
				if (signal?.aborted) return err(new AnalysisCancelledError("trace_native_values"));
				const next = pending.shift();
				if (next === undefined || attempted.has(next.procedure) || visited.has(next.procedure)) continue;
				if (decompilations >= input.max_functions) {
					truncated = true;
					unknowns.push({
						procedure: next.procedure,
						address: null,
						reason: "decompilation budget reached"
					});
					break;
				}
				attempted.add(next.procedure);
				const execution = await analysis.execute("analyze_function", { procedure: next.procedure }, {
					...signal === undefined ? {} : { signal },
					...next.depth > 0 ? { selectorOrigin: "provider" } : {}
				});
				decompilations++;
				if (!execution.ok) {
					if (execution.error._tag === "AnalysisCancelledError") return err(execution.error);
					unknowns.push({
						procedure: next.procedure,
						address: null,
						reason: execution.error.message
					});
					continue;
				}
				const parsed = functionDossierSchema.safeParse(execution.value.result);
				if (!parsed.success || execution.value.subject === null) return err(new AnalysisOutputError("trace_native_values", "Function dossier lacks validated facts or artifact identity"));
				const dossier = parsed.data;
				const address = dossier.procedure.address;
				if (visited.has(address)) continue;
				visited.add(next.procedure);
				visited.add(address);
				targetSha256 ??= execution.value.subject.sha256;
				if (execution.value.subject.sha256 !== targetSha256) return err(new AnalysisOutputError("trace_native_values", "Cross-function target digest mismatch"));
				const evidence = createEvidence(execution.value.subject, execution.value.provider, {
					operation: "analyze_function",
					parameters: { procedure: next.procedure },
					result: execution.value.result,
					rawResult: execution.value.rawResult,
					limitations: execution.value.limitations,
					locations: execution.value.locations,
					...execution.value.analysisProfile === undefined ? {} : { analysisProfile: execution.value.analysisProfile }
				});
				const evidenceId = evidence.evidence_id;
				procedures.push({
					address,
					depth: next.depth,
					evidence_id: evidenceId,
					provider: execution.value.provider.id,
					analysis_profile_digest: execution.value.analysisProfile?.digest ?? null
				});
				const flow = dossier.native_value_flow;
				if (flow === null || !flow.available) {
					unknowns.push({
						procedure: address,
						address: null,
						reason: flow?.reason ?? "Provider has no native def-use model"
					});
					continue;
				}
				if (flow.truncated) {
					truncated = true;
					unknowns.push({
						procedure: address,
						address: null,
						reason: "Provider p-code was truncated"
					});
				}
				const ids = new Set();
				const operationIds = new Set(flow.operations.map(({ id }) => id));
				const parameterIds = new Map();
				const qualified = (id) => `${address}/${id}`;
				for (const operation of flow.operations) {
					if (operation.block_membership === "detached" || operation.block_membership === "unavailable" && operation.is_dead) continue;
					const node = {
						id: qualified(operation.id),
						procedure: address,
						evidence_id: evidenceId,
						operation,
						kind: "operation",
						parameter: null
					};
					if (!retainNode(node)) break;
					ids.add(operation.id);
				}
				for (const parameter of flow.parameters) {
					const parameterId = `parameter:${parameter.ordinal}`;
					let localId = parameterId;
					for (let suffix = 1; operationIds.has(localId); suffix++) localId = `${parameterId}#${suffix}`;
					const id = qualified(localId);
					if (!retainNode({
						id,
						procedure: address,
						evidence_id: evidenceId,
						kind: "parameter",
						operation: null,
						parameter
					})) break;
					parameterIds.set(parameter.ordinal, id);
				}
				for (const use of flow.parameter_uses) {
					const source = parameterIds.get(use.ordinal);
					if (!ids.has(use.use) || source === undefined) continue;
					if (edges.length >= input.max_edges) {
						truncated = true;
						break;
					}
					edges.push({
						source,
						target: qualified(use.use),
						input_index: use.input_index,
						kind: "parameter-use",
						status: "derived",
						evidence_id: evidenceId
					});
				}
				for (const edge of flow.def_use) {
					if (!ids.has(edge.definition) || !ids.has(edge.use)) continue;
					if (edges.length >= input.max_edges) {
						truncated = true;
						break;
					}
					edges.push({
						source: qualified(edge.definition),
						target: qualified(edge.use),
						input_index: edge.input_index,
						kind: "def-use",
						status: "derived",
						evidence_id: evidenceId
					});
				}
				for (const operation of flow.operations) {
					if (!ids.has(operation.id) || !["CALL", "CALLIND"].includes(operation.opcode)) continue;
					if (callSites >= input.max_call_sites) {
						truncated = true;
						unknowns.push({
							procedure: address,
							address: operation.address,
							reason: "Call-site resolution budget reached"
						});
						break;
					}
					callSites++;
					const resolved = await analysis.execute("resolve_native_call_targets", { address: operation.address }, signal === undefined ? {} : { signal });
					if (!resolved.ok) {
						if (resolved.error._tag === "AnalysisCancelledError") return err(resolved.error);
						unknowns.push({
							procedure: address,
							address: operation.address,
							reason: resolved.error.message
						});
						continue;
					}
					const targets = nativeCallTargetsSchema.safeParse(resolved.value.result);
					if (!targets.success) return err(new AnalysisOutputError("resolve_native_call_targets", "Invalid static call resolution"));
					if (targets.data.targets.length === 0) unknowns.push({
						procedure: address,
						address: operation.address,
						reason: `Call target ${targets.data.status}`
					});
					for (const target of targets.data.targets) {
						if (edges.length >= input.max_edges) {
							truncated = true;
							break;
						}
						const destination = target.procedure ?? target.address;
						edges.push({
							source: qualified(operation.id),
							target: destination,
							input_index: null,
							kind: "call",
							status: target.status,
							evidence_id: evidenceId
						});
						if (target.status !== "candidate") callBindings.push({
							caller: address,
							callee: destination,
							call: qualified(operation.id),
							argument_count: Math.max(0, operation.inputs.length - 1),
							output: operation.output !== null,
							evidence_id: evidenceId
						});
						if (next.depth < input.max_depth && target.status !== "candidate") pending.push({
							procedure: destination,
							depth: next.depth + 1
						});
						else if (!visited.has(destination)) {
							truncated = true;
							unknowns.push({
								procedure: address,
								address: operation.address,
								reason: target.status === "candidate" ? "Ambiguous call candidates were not traversed" : "Call depth budget reached"
							});
						}
					}
				}
				if (truncated && (nodeBudgetReached || nodes.length >= input.max_nodes || edges.length >= input.max_edges || bytes >= NODE_PAYLOAD_BYTES)) break;
			}
			if (targetSha256 === undefined) return err(new AnalysisOutputError("trace_native_values", "No seed function could be analyzed"));
			const parametersByProcedure = new Map();
			const returnsByProcedure = new Map();
			for (const node of nodes) {
				if (node.kind === "parameter") {
					const parameters = parametersByProcedure.get(node.procedure) ?? [];
					parameters.push(node);
					parametersByProcedure.set(node.procedure, parameters);
				} else if (node.operation?.opcode === "RETURN" && node.operation.inputs.length > 1) {
					const returns = returnsByProcedure.get(node.procedure) ?? [];
					returns.push(node);
					returnsByProcedure.set(node.procedure, returns);
				}
			}
			for (const binding of callBindings) {
				const parameters = parametersByProcedure.get(binding.callee) ?? [];
				if (parameters.length === 0) unknowns.push({
					procedure: binding.caller,
					address: null,
					reason: `Parameter bindings for ${binding.callee} are unavailable or omitted`
				});
				for (const node of parameters) {
					const ordinal = node.parameter?.ordinal;
					if (ordinal === undefined || ordinal >= binding.argument_count) {
						unknowns.push({
							procedure: binding.caller,
							address: null,
							reason: `Argument ${ordinal ?? "unknown"} for ${binding.callee} was not recovered`
						});
						continue;
					}
					if (edges.length >= input.max_edges) {
						truncated = true;
						break;
					}
					edges.push({
						source: binding.call,
						target: node.id,
						input_index: ordinal + 1,
						kind: "argument-binding",
						status: "derived",
						evidence_id: binding.evidence_id
					});
				}
				if (binding.output) for (const node of returnsByProcedure.get(binding.callee) ?? []) {
					if (edges.length >= input.max_edges) {
						truncated = true;
						break;
					}
					edges.push({
						source: node.id,
						target: binding.call,
						input_index: 1,
						kind: "return-binding",
						status: "derived",
						evidence_id: node.evidence_id
					});
				}
			}
			const page = nodes.slice(input.offset, input.offset + input.limit);
			const pageIds = new Set(page.map(({ id }) => id));
			const result = nativeValueTraceSchema.parse({
				seed: input.procedure,
				target_sha256: targetSha256,
				nodes: page,
				edges: edges.filter(({ source }) => pageIds.has(source)),
				procedures,
				unknowns,
				total_nodes: nodes.length,
				total_edges: edges.length,
				decompilations,
				next_offset: input.offset + page.length < nodes.length ? input.offset + page.length : null,
				truncated: truncated || page.length !== nodes.length,
				limitations: [
					"Static decompiler def-use graphs cover recovered block members; when membership is unavailable they exclude operations marked dead. Logical CALL argument positions bind to recovered HighParam ordinals and RETURN values bind to recovered CALL outputs; these are decompiler-derived dependencies, not original source or runtime observations. Missing parameters, variadic arguments and alias dependencies remain unknown.",
					"LOAD and STORE are memory operations; object fields, persistent state and RNG semantics are not inferred from names or pseudocode.",
					"Traversal caps depth, decompilations, call-site resolutions, nodes, edges and node payloads (8 MiB). Complete serialized output is bounded to 32 MiB. Pagination reruns analysis and returns edges whose source is on the node page; endpoints outside the page retain stable identities."
				]
			});
			if (Buffer.byteLength(JSON.stringify(result)) > 32 * 1024 * 1024) return err(new AnalysisOutputError("trace_native_values", "Graph output exceeds 32 MiB; lower max_nodes, max_edges or page limit"));
			return ok(result);
		};
	})))();
}

//#endregion
//#region dist/application/native/NativeCallRoutes.js
var referencesSchema, readNativeCallRoutes;
function init_NativeCallRoutes() {
	return (init_NativeCallRoutes = __esmMin((() => {
		init_hopperValues();
		init_analysisErrorCore();
		referencesSchema = z.object({
			reference_kinds_available: z.boolean(),
			references: z.array(z.object({
				source_address: z.string(),
				target_address: z.string(),
				target_procedure: z.object({ address: z.string() }).nullable(),
				kind: referenceKindSchema
			})),
			unresolved_calls: z.array(z.object({
				address: z.string(),
				reason: z.string()
			}))
		});
		readNativeCallRoutes = async (analysis, procedure, signal, selectorOrigin) => {
			const options = {
				...signal === undefined ? {} : { signal },
				...selectorOrigin === undefined ? {} : { selectorOrigin }
			};
			const execution = await analysis.execute("procedure_references", {
				procedure,
				direction: "outgoing"
			}, options);
			let unknowns = [];
			if (execution.ok) {
				const parsed = referencesSchema.safeParse(execution.value.result);
				if (!parsed.success) return {
					ok: false,
					error: new AnalysisOutputError("procedure_references", "Invalid typed call references"),
					unknowns
				};
				unknowns = parsed.data.unresolved_calls.map((call) => ({
					...call,
					provider: execution.value.provider
				}));
				const references = parsed.data.references;
				if (parsed.data.reference_kinds_available === true || references.length > 0 && references.every(({ kind }) => kind.available)) {
					const calls = references.filter(({ kind }) => kind.available && kind.call);
					const countBySite = new Map();
					for (const call of calls) {
						const targets = countBySite.get(call.source_address) ?? new Set();
						targets.add(call.target_address);
						countBySite.set(call.source_address, targets);
					}
					return {
						ok: true,
						value: {
							provider: execution.value.provider,
							routes: calls.map((call) => ({
								address: call.target_procedure?.address ?? call.target_address,
								site: call.source_address,
								relation: call.kind.available && (call.kind.computed || call.kind.indirect) ? "indirect_call" : "direct_call",
								resolution: (countBySite.get(call.source_address)?.size ?? 0) > 1 ? "ambiguous" : call.kind.available && (call.kind.computed || call.kind.indirect) ? "resolved" : "observed"
							})),
							unknowns
						}
					};
				}
			} else if (execution.error._tag !== "AnalysisCapabilityUnavailableError") return {
				ok: false,
				error: execution.error,
				unknowns
			};
			const callees = await analysis.execute("procedure_callees", { procedure }, options);
			if (!callees.ok) return {
				ok: false,
				error: callees.error,
				unknowns
			};
			const parsed = parseRelatedAddresses(callees.value.result, "callees");
			return parsed.ok ? {
				ok: true,
				value: {
					provider: callees.value.provider,
					routes: parsed.value.map((address) => ({
						address,
						site: procedure,
						relation: "provider_call",
						resolution: "inferred"
					})),
					unknowns
				}
			} : {
				ok: false,
				error: parsed.error,
				unknowns
			};
		};
	})))();
}

//#endregion
//#region dist/application/native/NativeUiActionTrace.js
var traceNativeUiAction, emptyGraph, boundUiGraph, resolveUiAction, addDirectCallees, graphNodeDepths;
function init_NativeUiActionTrace() {
	return (init_NativeUiActionTrace = __esmMin((() => {
		init_interfaceBuilderGraph();
		init_nativeInvestigationGraph();
		init_objcSwiftMetadata();
		init_NativeDispatchMetadataInspection();
		init_jsonValue();
		init_NativeCallRoutes();
		init_result();
		init_analysisErrorCore();
		init_analysisErrorProjection();
		traceNativeUiAction = async (analysis, input, signal) => {
			const [uiExecution, metadataExecution] = await Promise.all([analysis.execute("decode_interface_builder", {
				max_documents: 64,
				max_objects: input.max_nodes,
				max_connections: input.max_edges
			}, signal === undefined ? {} : { signal }), inspectNativeDispatch(analysis, 2e4, signal)]);
			if (!uiExecution.ok && uiExecution.error._tag === "AnalysisCancelledError") return err(uiExecution.error);
			if (!metadataExecution.ok) return err(metadataExecution.error);
			const metadata = nativeDispatchMetadataResultSchema.parse(metadataExecution.value);
			const targetSha256 = metadata.target_sha256;
			if (targetSha256 === null) return err(new AnalysisOutputError("inspect_native_dispatch_metadata", "Dispatch metadata lacks target identity"));
			let graph = emptyGraph(targetSha256, metadata.provider);
			const coverage = [];
			if (uiExecution.ok) {
				const decoded = interfaceBuilderAnalysisSchema.safeParse(uiExecution.value.result);
				if (!decoded.success) return err(new AnalysisOutputError("decode_interface_builder", "artifact provider returned an invalid interface graph"));
				if (decoded.data.target_sha256 !== targetSha256) return err(new AnalysisOutputError("decode_interface_builder", "UI and native provider results refer to different target SHA-256 values"));
				graph = joinInterfaceBuilderDispatch(decoded.data.graph, metadata.result);
				const archiveDecode = decoded.data.graph.coverage.find((facet) => facet.facet === "archive_decode");
				const documentsFound = decoded.data.documents.length > 0;
				coverage.push({
					facet: "interface_builder_archives",
					status: archiveDecode?.status === "partial" || archiveDecode?.status === "complete" || archiveDecode?.status === "unsupported" ? archiveDecode.status : documentsFound ? "complete" : "unsupported",
					reason: archiveDecode?.reason ?? (documentsFound ? null : "no_compiled_interface_builder_archives_found"),
					examined: archiveDecode?.examined ?? decoded.data.documents.length,
					omitted: archiveDecode?.omitted ?? 0
				});
				const bounded = boundUiGraph(graph, input.max_nodes, input.max_edges);
				graph = bounded.graph;
				if (bounded.truncated) coverage.push({
					facet: "interface_builder_graph",
					status: "partial",
					reason: "native_trace_output_bounds_reached",
					examined: decoded.data.graph.nodes.length + decoded.data.graph.edges.length,
					omitted: bounded.omitted
				});
			} else {
				coverage.push({
					facet: "interface_builder_archives",
					status: "unsupported",
					reason: projectAnalysisError(uiExecution.error).message,
					examined: 0,
					omitted: 0
				});
			}
			let selected = resolveUiAction(graph, input.action);
			if (selected.nodeId === null && selected.candidates.length === 0) {
				const native = await analysis.execute("procedure_address", { procedure: input.action }, signal === undefined ? {} : { signal });
				if (!native.ok && native.error._tag === "AnalysisCancelledError") return err(native.error);
				if (!native.ok && native.error._tag !== "AnalysisCapabilityUnavailableError") return err(native.error);
				if (native.ok) {
					const address = z.string().safeParse(native.value.result);
					if (!address.success || native.value.subject?.sha256 !== targetSha256) return err(new AnalysisOutputError("procedure_address", "Native seed lacks a validated address or matching target identity"));
					const id = `native:function:${address.data}`;
					graph.nodes.push({
						id,
						kind: "function",
						name: input.action,
						location: {
							address: address.data,
							file_offset: null
						},
						attributes: { resolved_by: native.value.provider.id },
						evidence: [{
							kind: "reference",
							description: `Provider resolved the explicit native seed ${input.action}`,
							location: {
								address: address.data,
								file_offset: null
							},
							artifact_path: null,
							artifact_sha256: targetSha256
						}]
					});
					selected = {
						nodeId: id,
						candidates: [],
						reason: null
					};
				}
			}
			if (selected.nodeId === null) {
				coverage.push(...graph.coverage);
				const trace = {
					target_sha256: graph.target_sha256,
					provider: graph.provider,
					start: input.action,
					direction: "forward",
					nodes: selected.candidates,
					edges: [],
					unresolved: [],
					reached_depth: 0,
					truncated: graph.truncated,
					reason: selected.reason,
					coverage,
					limitations: ["The query did not identify one unique authored UI action or native function; no handler path was inferred."]
				};
				return ok(jsonValueSchema.parse(nativeInvestigationTraceSchema.parse(trace)));
			}
			const initial = traceNativeInvestigationGraph(graph, {
				start: selected.nodeId,
				direction: "forward",
				limits: {
					max_depth: input.max_depth,
					max_nodes: input.max_nodes,
					max_edges: input.max_edges
				}
			});
			const expanded = await addDirectCallees({
				analysis,
				graph,
				initial,
				input,
				targetSha256,
				signal
			});
			if (expanded.error !== undefined) return err(expanded.error);
			coverage.push({
				facet: "static_native_calls",
				status: "partial",
				reason: "typed_direct_and_indirect_references_do_not_cover_all_runtime_dispatch; untyped_provider_callees_remain_inferred",
				examined: expanded.examined,
				omitted: expanded.omitted
			});
			coverage.push({
				facet: "cross_function_value_flow",
				status: "unsupported",
				reason: "call edges identify control-flow candidates but do not recover argument, return, or shared-memory value relationships",
				examined: 0,
				omitted: 0
			});
			const finalGraph = nativeInvestigationGraphSchema.parse({
				...graph,
				nodes: expanded.nodes,
				edges: expanded.edges,
				coverage: [...graph.coverage, ...coverage],
				truncated: graph.truncated || expanded.truncated
			});
			const trace = traceNativeInvestigationGraph(finalGraph, {
				start: selected.nodeId,
				direction: "forward",
				limits: {
					max_depth: input.max_depth,
					max_nodes: input.max_nodes,
					max_edges: input.max_edges
				}
			});
			return ok(jsonValueSchema.parse(nativeInvestigationTraceSchema.parse({
				...trace,
				truncated: trace.truncated || expanded.truncated || graph.truncated,
				reason: expanded.truncated && trace.reason === null ? "native_call_traversal_bound_reached" : graph.truncated && trace.reason === null ? "native_trace_output_bound_reached" : trace.reason
			})));
		};
		emptyGraph = (targetSha256, provider) => nativeInvestigationGraphSchema.parse({
			target_sha256: targetSha256,
			provider: {
				id: provider.id,
				version: provider.version,
				tool_version: "rea-native-ui-trace/1"
			},
			nodes: [],
			edges: [],
			coverage: [],
			truncated: false
		});
		boundUiGraph = (graph, maxNodes, maxEdges) => {
			const nodes = graph.nodes.slice(0, maxNodes);
			const nodeIds = new Set(nodes.map(({ id }) => id));
			const eligibleEdges = graph.edges.filter((edge) => nodeIds.has(edge.from) && (edge.to === null || nodeIds.has(edge.to)));
			const edges = eligibleEdges.slice(0, maxEdges);
			const omitted = graph.nodes.length - nodes.length + graph.edges.length - edges.length;
			const truncated = omitted > 0;
			return {
				graph: nativeInvestigationGraphSchema.parse({
					...graph,
					nodes,
					edges,
					truncated: graph.truncated || truncated
				}),
				truncated,
				omitted
			};
		};
		resolveUiAction = (graph, query) => {
			const exactId = graph.nodes.find((node) => node.id === query);
			if (exactId?.kind === "action") return {
				nodeId: exactId.id,
				candidates: [],
				reason: null
			};
			const actions = graph.nodes.filter((node) => node.kind === "action" && (node.name === query || node.attributes.selector === query));
			if (actions.length === 1) return {
				nodeId: actions[0]?.id ?? null,
				candidates: [],
				reason: null
			};
			if (actions.length > 1) return {
				nodeId: null,
				candidates: actions,
				reason: "action_selector_matches_multiple_ui_connections"
			};
			const objectMatches = graph.nodes.filter((node) => [
				"control",
				"view",
				"view_controller",
				"scene"
			].includes(node.kind) && (node.id === query || node.attributes.interface_builder_object_id === query));
			const actionIds = new Set(graph.edges.flatMap((edge) => edge.resolution === "observed" && edge.relation === "target_action" && objectMatches.some(({ id }) => edge.from === id) && graph.nodes.some(({ id, kind }) => id === edge.to && kind === "action") ? [edge.to] : []));
			if (actionIds.size === 1) return {
				nodeId: [...actionIds][0] ?? null,
				candidates: [],
				reason: null
			};
			if (actionIds.size > 1) return {
				nodeId: null,
				candidates: graph.nodes.filter(({ id }) => actionIds.has(id)),
				reason: "interface_object_has_multiple_action_connections"
			};
			return {
				nodeId: null,
				candidates: [],
				reason: "ui_action_or_object_not_found"
			};
		};
		addDirectCallees = async (input) => {
			const nodes = new Map(input.initial.nodes.map((node) => [node.id, node]));
			const edges = new Map([...input.initial.edges, ...input.initial.unresolved].map((edge) => [edge.id, edge]));
			const addressNames = new Map();
			const depthByNode = graphNodeDepths(input.initial.start, input.initial.nodes, input.initial.edges);
			for (const node of nodes.values()) {
				if (node.kind === "function" && node.location?.address !== null) addressNames.set(node.location?.address ?? "", node.name);
			}
			const queue = input.initial.nodes.flatMap((node) => node.kind === "function" && node.location?.address != null ? [{
				node,
				address: node.location.address,
				depth: depthByNode.get(node.id) ?? input.initial.reached_depth
			}] : []);
			const visited = new Set();
			let queueIndex = 0;
			let examined = 0;
			let omitted = 0;
			let truncated = false;
			while (queueIndex < queue.length) {
				const current = queue[queueIndex++];
				if (current === undefined || visited.has(current.address)) continue;
				visited.add(current.address);
				if (current.depth >= input.input.max_depth) {
					truncated = true;
					omitted += 1;
					continue;
				}
				if (nodes.size >= input.input.max_nodes) {
					truncated = true;
					omitted += queue.length - queueIndex + 1;
					break;
				}
				const execution = await readNativeCallRoutes(input.analysis, current.address, input.signal, "provider");
				examined += 1;
				if (!execution.ok && execution.error._tag === "AnalysisCancelledError") return { error: execution.error };
				const unknowns = execution.ok ? execution.value.unknowns : execution.unknowns;
				for (const [index, unknown] of unknowns.entries()) {
					if (edges.size >= input.input.max_edges) {
						truncated = true;
						omitted += unknowns.length - index;
						break;
					}
					const id = `unknown-dispatch:${current.address}:${unknown.address}`;
					edges.set(id, {
						id,
						from: current.node.id,
						to: null,
						relation: "indirect_call",
						resolution: "unresolved",
						reason: unknown.reason,
						evidence: [{
							kind: "reference",
							provider: unknown.provider,
							description: `${unknown.provider.name} reported an unresolved call: ${unknown.reason}`,
							location: {
								address: unknown.address,
								file_offset: null
							},
							artifact_path: null,
							artifact_sha256: input.targetSha256
						}],
						limitations: []
					});
				}
				if (!execution.ok) {
					if (edges.size >= input.input.max_edges) {
						truncated = true;
						omitted += 1;
						continue;
					}
					const id = `unknown-callees:${current.address}`;
					edges.set(id, {
						id,
						from: current.node.id,
						to: null,
						relation: "direct_call",
						resolution: "unresolved",
						reason: projectAnalysisError(execution.error).message,
						evidence: [],
						limitations: ["The provider could not enumerate resolved direct callees."]
					});
					continue;
				}
				for (const [index, route] of execution.value.routes.entries()) {
					const address = route.address;
					if (edges.size >= input.input.max_edges) {
						truncated = true;
						omitted += execution.value.routes.length - index;
						break;
					}
					const targetId = `native:function:${address}`;
					const evidence = [{
						kind: "reference",
						provider: execution.value.provider,
						description: `${execution.value.provider.name} reported ${route.relation} from ${current.address} to ${address}`,
						location: {
							address: route.site,
							file_offset: null
						},
						artifact_path: null,
						artifact_sha256: input.targetSha256
					}];
					if (!nodes.has(targetId)) {
						if (nodes.size >= input.input.max_nodes) {
							truncated = true;
							omitted += 1;
							const id = `unknown-node-bound:${current.address}:${address}`;
							edges.set(id, {
								id,
								from: current.node.id,
								to: null,
								relation: "direct_call",
								resolution: "unresolved",
								reason: "native_trace_node_bound_reached",
								evidence,
								limitations: []
							});
							continue;
						}
						const name = addressNames.get(address) ?? address;
						const node = {
							id: targetId,
							kind: "function",
							name,
							location: {
								address,
								file_offset: null
							},
							attributes: { resolved_by: execution.value.provider.id },
							evidence
						};
						nodes.set(targetId, node);
						queue.push({
							node,
							address,
							depth: current.depth + 1
						});
					}
					const edgeId = `call:${current.address}:${route.site}:${address}`;
					edges.set(edgeId, {
						id: edgeId,
						from: current.node.id,
						to: targetId,
						relation: route.relation,
						resolution: route.resolution,
						evidence,
						limitations: ["A resolved static call edge does not establish runtime reachability."]
					});
				}
			}
			return {
				nodes: [...nodes.values()],
				edges: [...edges.values()],
				examined,
				omitted,
				truncated
			};
		};
		graphNodeDepths = (start, nodes, edges) => {
			const known = new Set(nodes.map(({ id }) => id));
			const depths = new Map([[start, 0]]);
			const queue = [start];
			for (let index = 0; index < queue.length; index += 1) {
				const current = queue[index];
				if (current === undefined) continue;
				const depth = depths.get(current) ?? 0;
				for (const edge of edges) {
					if (edge.resolution === "unresolved" || edge.from !== current || edge.to === null || !known.has(edge.to) || depths.has(edge.to)) continue;
					depths.set(edge.to, depth + 1);
					queue.push(edge.to);
				}
			}
			return depths;
		};
	})))();
}

//#endregion
//#region dist/application/EnhancedToolTypes.js
var invalidEnhancedInput;
function init_EnhancedToolTypes() {
	return (init_EnhancedToolTypes = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_enhancedInputs();
		invalidEnhancedInput = (name, cause) => Promise.resolve(err(new AnalysisInputError(name, { cause })));
	})))();
}

//#endregion
//#region dist/application/AnalysisDocument.js
var executionOptions, resolveAnalysisDocument;
function init_AnalysisDocument() {
	return (init_AnalysisDocument = __esmMin((() => {
		init_analysisErrorCore();
		init_hopperValues();
		init_result();
		executionOptions = (signal) => signal === undefined ? undefined : { signal };
		resolveAnalysisDocument = async (analysis, document, signal) => {
			if (document !== undefined) return ok(document);
			if (signal?.aborted === true) return err(new AnalysisCancelledError("current_document"));
			const current = await analysis.execute("current_document", {}, executionOptions(signal));
			if (!current.ok) {
				if (!(current.error instanceof AnalysisCapabilityUnavailableError)) return current;
				const listed = await analysis.execute("list_documents", {}, executionOptions(signal));
				if (!listed.ok) return listed;
				const parsed = parseDocuments(listed.value.result);
				if (!parsed.ok) return err(new AnalysisOutputError("list_documents", "expected one document identity when resolving a headless provider", { cause: parsed.error }));
				if (parsed.value.length !== 1) return err(new AnalysisOutputError("list_documents", `expected exactly one document identity for a provider without current-document selection, received ${parsed.value.length}`));
				const [documentName] = parsed.value;
				if (documentName === undefined || documentName.length === 0) return err(new AnalysisOutputError("list_documents", "provider returned no document identity"));
				return ok(documentName);
			}
			return typeof current.value.result === "string" && current.value.result.length > 0 ? ok(current.value.result) : err(new AnalysisOutputError("current_document", "expected a nonempty document identity string"));
		};
	})))();
}

//#endregion
//#region dist/application/CallPathTracing.js
var traceCallPath, createTraceState, expandAddress, recordEdge, projectTrace, compareAddress, sortedUniqueAddresses, isAborted$1;
function init_CallPathTracing() {
	return (init_CallPathTracing = __esmMin((() => {
		init_analysisErrorProjection();
		init_analysisErrorCore();
		init_hopperValues();
		init_result();
		init_ProcedureAddressResolution();
		traceCallPath = async (call, callRelationship, input, signal) => {
			const start = await resolveProcedureAddress(call, input.start, signal);
			if (!start.ok) return start;
			let goal;
			if (input.goal !== undefined) {
				const resolved = await resolveProcedureAddress(call, input.goal, signal);
				if (!resolved.ok) return resolved;
				goal = resolved.value;
			}
			const resolvedInput = {
				start: start.value,
				...goal === undefined ? {} : { goal },
				direction: input.direction
			};
			if (isAborted$1(signal)) return err(new AnalysisCancelledError("trace_call_path"));
			const state = createTraceState(resolvedInput);
			while (state.queueIndex < state.queue.length && state.traversalPath.length === 0) {
				if (isAborted$1(signal)) return err(new AnalysisCancelledError("trace_call_path"));
				const address = state.queue[state.queueIndex++];
				if (address === undefined) break;
				const current = state.visited.get(address);
				if (current === undefined) continue;
				const expanded = await expandAddress(callRelationship, {
					input: resolvedInput,
					state,
					address,
					current,
					...signal === undefined ? {} : { signal }
				});
				if (!expanded.ok) return expanded;
				if (expanded.value) break;
			}
			if (isAborted$1(signal)) return err(new AnalysisCancelledError("trace_call_path"));
			return ok(projectTrace(resolvedInput, state));
		};
		createTraceState = (input) => ({
			visited: new Map([[input.start, {
				depth: 0,
				path: [input.start]
			}]]),
			queue: [input.start],
			edges: new Map(),
			failures: [],
			residual: new Set(),
			limitations: new Set(),
			relationshipCoverage: new Map(),
			queueIndex: 0,
			traversalPath: input.goal === input.start ? [input.start] : []
		});
		expandAddress = async (call, expansion) => {
			const { input, state, address, current, signal } = expansion;
			const relation = input.direction === "forward" ? "callees" : "callers";
			const tool = input.direction === "forward" ? "procedure_callees" : "procedure_callers";
			const result = await call(tool, { procedure: address }, signal, "provider");
			if (!result.ok) {
				if (result.error._tag === "AnalysisCancelledError" || signal?.aborted === true) return result;
			}
			if (isAborted$1(signal)) return err(new AnalysisCancelledError("trace_call_path"));
			if (!result.ok) {
				state.failures.push({
					address,
					error: projectAnalysisError(result.error)
				});
				state.residual.add(`Call relationships were unavailable for ${address}.`);
				return ok(false);
			}
			const related = parseRelatedAddresses(result.value.result, relation, tool);
			if (!related.ok) {
				state.failures.push({
					address,
					error: projectAnalysisError(related.error)
				});
				state.residual.add(`Call relationships were unreadable for ${address}.`);
				return ok(false);
			}
			for (const limitation of result.value.limitations) state.limitations.add(limitation);
			const coverage = result.value.relationshipCoverage ?? {
				status: "unknown",
				reason: "Provider did not report relationship coverage."
			};
			state.relationshipCoverage.set(address, coverage);
			for (const diagnostic of "diagnostics" in coverage && Array.isArray(coverage.diagnostics) ? coverage.diagnostics : []) state.limitations.add(diagnostic);
			if (coverage.status === "partial") for (const limitation of coverage.limitations) state.residual.add(`Call relationships for ${address} are limited: ${limitation}`);
			else if (coverage.status === "unknown") state.residual.add(`Call relationship coverage is unknown for ${address}: ${coverage.reason}`);
			for (const relatedAddress of sortedUniqueAddresses(related.value)) {
				recordEdge(input, state, {
					address,
					relatedAddress,
					discoveryDepth: current.depth + 1
				});
				const path = state.visited.get(relatedAddress)?.path ?? [...current.path, relatedAddress];
				if (state.visited.has(relatedAddress)) {
					if (relatedAddress === input.goal) {
						state.traversalPath = path;
						return ok(true);
					}
					continue;
				}
				state.visited.set(relatedAddress, {
					depth: current.depth + 1,
					path
				});
				if (relatedAddress === input.goal) {
					state.traversalPath = path;
					return ok(true);
				}
				state.queue.push(relatedAddress);
			}
			return ok(false);
		};
		recordEdge = (input, state, edge) => {
			const sourceAddress = input.direction === "forward" ? edge.address : edge.relatedAddress;
			const targetAddress = input.direction === "forward" ? edge.relatedAddress : edge.address;
			const edgeKey = `${sourceAddress}\u0000${targetAddress}`;
			if (state.edges.has(edgeKey)) return;
			state.edges.set(edgeKey, {
				source_address: sourceAddress,
				target_address: targetAddress,
				discovery_depth: edge.discoveryDepth
			});
		};
		projectTrace = (input, state) => ({
			start: input.start,
			goal: input.goal ?? null,
			direction: input.direction,
			goal_status: input.goal === undefined ? "not_requested" : state.traversalPath.length > 0 ? "reached" : state.residual.size > 0 ? "unknown" : "not_reached",
			nodes: [...state.visited.entries()].map(([address, { depth }]) => ({
				address,
				depth
			})).sort((left, right) => left.depth - right.depth || compareAddress(left.address, right.address)),
			edges: [...state.edges.values()].sort((left, right) => left.discovery_depth - right.discovery_depth || compareAddress(left.source_address, right.source_address) || compareAddress(left.target_address, right.target_address)),
			traversal_path: state.traversalPath,
			failures: state.failures,
			traversal: { nodes_visited: state.visited.size },
			relationship_coverage: Object.fromEntries([...state.relationshipCoverage.entries()].sort(([left], [right]) => compareAddress(left, right))),
			truncated: state.residual.size > 0,
			residual_unknowns: [...state.residual],
			limitations: ["Direct provider call relationships may omit unresolved indirect calls.", ...state.limitations]
		});
		compareAddress = (left, right) => left < right ? -1 : left > right ? 1 : 0;
		sortedUniqueAddresses = (addresses) => [...new Set(addresses)].sort(compareAddress);
		isAborted$1 = (signal) => signal?.aborted === true;
	})))();
}

//#endregion
//#region dist/application/EnhancedLiteralTracing.js
var LITERAL_SEARCH_SOURCES, traceLiteralFeature, literalMatches, addPageMatches, traceReferences;
function init_EnhancedLiteralTracing() {
	return (init_EnhancedLiteralTracing = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		LITERAL_SEARCH_SOURCES = [["search_strings", "string"], ["search_procedures", "procedure"]];
		traceLiteralFeature = async (call, observe, input, signal) => {
			const searched = await literalMatches(call, input, LITERAL_SEARCH_SOURCES, signal);
			if (!searched.ok) return searched;
			const traced = await traceReferences(call, observe, {
				matches: searched.value.matches,
				...signal === undefined ? {} : { signal }
			});
			if (!traced.ok) return traced;
			return ok({
				query: input.query,
				search_mode: "literal",
				matches: searched.value.matches,
				references: traced.value.references,
				truncated: traced.value.residual.length > 0,
				residual_unknowns: traced.value.residual
			});
		};
		literalMatches = async (call, input, sources, signal) => {
			const matches = [];
			const matched = new Set();
			for (const [tool, type] of sources) {
				const result = await call(tool, {
					pattern: input.query,
					mode: "literal",
					case_sensitive: input.case_sensitive
				}, signal);
				if (!result.ok) return result;
				const items = z.array(z.object({
					address: z.string(),
					value: z.string()
				})).safeParse(result.value);
				if (!items.success) return err(new AnalysisOutputError(tool, "provider returned an invalid search result"));
				addPageMatches({
					items: items.data.map(({ address, value: name }) => ({
						address,
						name
					})),
					type,
					matches,
					matched
				});
			}
			return ok({ matches });
		};
		addPageMatches = (input) => {
			const { items, type, matches, matched } = input;
			for (const item of items) {
				const key = `${type}\u0000${item.address}`;
				if (matched.has(key)) continue;
				matches.push({
					type,
					address: item.address,
					value: item.name
				});
				matched.add(key);
			}
		};
		traceReferences = async (call, observe, request) => {
			const references = [];
			const residual = [];
			const containing = new Map();
			for (const match of request.matches) {
				const observed = await observe("xrefs", { address: match.address }, request.signal);
				if (!observed.ok) return observed;
				const unknown = `References to ${match.address} were truncated by the provider; additional references may exist.`;
				if (observed.value.referencesTruncated === true && !residual.includes(unknown)) residual.push(unknown);
				const sources = observed.value.result;
				if (!Array.isArray(sources)) return err(new AnalysisOutputError("xrefs", "provider returned a non-array result"));
				for (const source of sources) {
					if (typeof source !== "string") return err(new AnalysisOutputError("xrefs", "provider returned a non-address value"));
					let containingProcedure = containing.get(source);
					if (containingProcedure === undefined) {
						const resolved = await call("resolve_containing_procedure", { address: source }, request.signal);
						if (!resolved.ok) return resolved;
						containingProcedure = resolved.value;
						containing.set(source, containingProcedure);
					}
					references.push({
						target_address: match.address,
						source_address: source,
						containing_procedure: containingProcedure
					});
				}
			}
			return ok({
				references,
				residual
			});
		};
	})))();
}

//#endregion
//#region dist/application/native/NativeApiInspection.js
var unavailableBoundary, projectNativeApiInspection, availableResidualUnknowns;
function init_NativeApiInspection() {
	return (init_NativeApiInspection = __esmMin((() => {
		init_nativeApiBoundary();
		unavailableBoundary = () => ({
			available: false,
			reason: "The selected provider did not expose a structured native API boundary model.",
			residual_unknowns: ["What are the function's return and parameter boundary types?", "Does this function dispatch through a jump table with recoverable data addresses?"]
		});
		projectNativeApiInspection = (dossier) => {
			const boundary = dossier.native_api ?? unavailableBoundary();
			const unsupportedBranches = boundary.available ? [] : ["structured-boundary-types", "jump-table-data-mapping"];
			const residualUnknowns = boundary.available ? availableResidualUnknowns(boundary) : boundary.residual_unknowns;
			return nativeApiInspectionResultSchema.parse({
				procedure: {
					address: dossier.procedure.address,
					name: dossier.procedure.name
				},
				boundary,
				substeps: [
					{
						operation: "analyze_function",
						status: "completed",
						observations: [
							"provider function dossier",
							"provider pseudocode classification",
							"provider control-flow observations"
						]
					},
					{
						operation: "project_native_api_boundary",
						status: boundary.available ? "completed" : "unsupported",
						observations: boundary.available ? [
							"return and parameter boundary types",
							"confidence and inference evidence",
							"jump-table dispatch, data, and target addresses"
						] : [boundary.reason]
					},
					{
						operation: "preserve_residual_unknowns",
						status: "completed",
						observations: residualUnknowns.length === 0 ? ["no additional structured-boundary unknowns"] : residualUnknowns
					}
				],
				unsupported_branches: unsupportedBranches,
				residual_unknowns: residualUnknowns
			});
		};
		availableResidualUnknowns = (boundary) => {
			const unknowns = [];
			for (const table of boundary.jump_tables) {
				if (table.default_targets.length === 0) unknowns.push(`Which default or out-of-range path, if any, belongs to the dispatch at ${table.dispatch_address}?`);
				if (table.mappings.length === 0) unknowns.push(`Which case values and targets belong to the dispatch at ${table.dispatch_address}?`);
				if (table.data_sources.length === 0) unknowns.push(`What backing data address produced the jump table dispatched at ${table.dispatch_address}?`);
				if (table.data_sources.some(({ entry_count: count, entry_size_bytes: size }) => count === null || size === null)) unknowns.push(`What are the exact entry size and count for candidate jump-table data dispatched at ${table.dispatch_address}?`);
				if (table.mappings.some(({ case_value: value }) => value === null)) unknowns.push(`Which source-level case values correspond to every target dispatched at ${table.dispatch_address}?`);
			}
			for (const value of [boundary.return_type, ...boundary.parameters]) {
				if (value.confidence === "low") unknowns.push(`Can the inferred ${value.role} type ${value.data_type} be confirmed with imported metadata or an ABI probe?`);
			}
			return [...new Set(unknowns)];
		};
	})))();
}

//#endregion
//#region dist/application/EnhancedTools.js
var isAnalysisCancellation, firstAnalysisCancellation, EnhancedTools, isAborted;
function init_EnhancedTools() {
	return (init_EnhancedTools = __esmMin((() => {
		init_enhancedInputs();
		init_analysisErrorCore();
		init_analysisErrorProjection();
		init_hopperValues();
		init_result();
		init_symbolAnalysis();
		init_NativeDispatchMetadataInspection();
		init_NativeValueTrace();
		init_NativeUiActionTrace();
		init_jsonValue();
		init_unicodeCodePointOrder();
		init_EnhancedToolTypes();
		init_AnalysisDocument();
		init_CallPathTracing();
		init_ProcedureAddressResolution();
		init_EnhancedLiteralTracing();
		init_NativeApiInspection();
		isAnalysisCancellation = (error) => error._tag === "AnalysisCancelledError";
		firstAnalysisCancellation = (results) => {
			for (const result of results) if (!result.ok && isAnalysisCancellation(result.error)) return result.error;
			return undefined;
		};
		EnhancedTools = class {
			analysis;
			constructor(analysis) {
				this.analysis = analysis;
			}
			/** Parse an untrusted direct-call input once, then dispatch exhaustively. */
			execute(name, input, signal) {
				if (name === "trace_feature" || name === "trace_call_path") return this.#executeTracing(name, input, signal);
				if (name === "trace_native_values") {
					const parsed = enhancedInputSchemas.trace_native_values.safeParse(input);
					return parsed.success ? this.executeValidated({
						name,
						input: parsed.data
					}, signal) : invalidEnhancedInput(name, parsed.error);
				}
				if (name === "trace_native_ui_action") {
					const parsed = enhancedInputSchemas.trace_native_ui_action.safeParse(input);
					return parsed.success ? this.executeValidated({
						name,
						input: parsed.data
					}, signal) : invalidEnhancedInput(name, parsed.error);
				}
				if (name === "analyze_function" || name === "inspect_native_api") return this.#executeFunctionAnalysis(name, input, signal);
				switch (name) {
					case "inspect_native_dispatch_metadata": {
						const parsed = enhancedInputSchemas.inspect_native_dispatch_metadata.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
					case "get_objc_classes": {
						const parsed = enhancedInputSchemas.get_objc_classes.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
					case "get_objc_protocols": return this.executeValidated({
						name,
						input: {}
					}, signal);
					case "batch_decompile": {
						const parsed = enhancedInputSchemas.batch_decompile.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
					case "get_call_graph": {
						const parsed = enhancedInputSchemas.get_call_graph.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
					case "analyze_swift_types": {
						const parsed = enhancedInputSchemas.analyze_swift_types.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
					case "find_xrefs_to_name": {
						const parsed = enhancedInputSchemas.find_xrefs_to_name.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
					case "binary_overview": {
						const parsed = enhancedInputSchemas.binary_overview.safeParse(input);
						return parsed.success ? this.executeValidated({
							name,
							input: parsed.data
						}, signal) : invalidEnhancedInput(name, parsed.error);
					}
				}
			}
			/** Dispatch input already parsed by a trusted adapter boundary. */
			executeValidated(call, signal) {
				switch (call.name) {
					case "inspect_native_dispatch_metadata": return this.#inspectNativeDispatchMetadata(call.input.max_records, signal);
					case "get_objc_classes": return this.#objcClasses(call.input.pattern, signal);
					case "get_objc_protocols": return this.#objcProtocols(signal);
					case "batch_decompile": return this.#batchDecompile(call.input.addresses, signal);
					case "get_call_graph": return this.#callGraph(call.input, signal);
					case "analyze_swift_types": return this.#analyzeSwiftTypes(call.input, signal);
					case "find_xrefs_to_name": return this.#findXrefs(call.input.name, signal);
					case "binary_overview": return this.#binaryOverview(signal);
					case "analyze_function": return this.#analyzeFunction(call.input, signal);
					case "inspect_native_api": return this.#inspectNativeApi(call.input, signal);
					case "trace_feature": return traceLiteralFeature((name, arguments_, operationSignal) => this.#call(name, arguments_, operationSignal), (name, arguments_, operationSignal) => this.#observe(name, arguments_, operationSignal), call.input, signal);
					case "trace_call_path": return traceCallPath((name, arguments_, operationSignal, selectorOrigin) => this.#call(name, arguments_, operationSignal, selectorOrigin), (name, arguments_, operationSignal, selectorOrigin) => this.#observe(name, arguments_, operationSignal, selectorOrigin), call.input, signal);
					case "trace_native_values": return traceNativeValues(this.analysis, call.input, signal);
					case "trace_native_ui_action": {
						return traceNativeUiAction(this.analysis, call.input, signal);
					}
				}
			}
			#executeTracing(name, input, signal) {
				if (name === "trace_call_path") {
					const parsed = enhancedInputSchemas.trace_call_path.safeParse(input);
					if (!parsed.success) return invalidEnhancedInput(name, parsed.error);
					return this.executeValidated({
						name,
						input: parsed.data
					}, signal);
				}
				const parsed = enhancedInputSchemas.trace_feature.safeParse(input);
				if (!parsed.success) return invalidEnhancedInput(name, parsed.error);
				return this.executeValidated({
					name,
					input: parsed.data
				}, signal);
			}
			#executeFunctionAnalysis(name, input, signal) {
				if (name === "analyze_function") {
					const parsed = enhancedInputSchemas.analyze_function.safeParse(input);
					if (!parsed.success) return invalidEnhancedInput(name, parsed.error);
					return this.executeValidated({
						name,
						input: parsed.data
					}, signal);
				}
				const parsed = enhancedInputSchemas.inspect_native_api.safeParse(input);
				if (!parsed.success) return invalidEnhancedInput(name, parsed.error);
				return this.executeValidated({
					name,
					input: parsed.data
				}, signal);
			}
			async #analyzeFunction(input, signal) {
				const result = await this.#call("analyze_function", input, signal);
				return result.ok ? parseFunctionDossier(result.value) : result;
			}
			async #inspectNativeApi(input, signal) {
				const analysisInput = enhancedInputSchemas.analyze_function.parse({ procedure: input.procedure });
				const result = await this.#call("analyze_function", analysisInput, signal);
				if (!result.ok) return result;
				const parsed = parseFunctionDossier(result.value);
				if (!parsed.ok) return parsed;
				const dossier = functionDossierSchema.parse(parsed.value);
				return ok(jsonValueSchema.parse(projectNativeApiInspection(dossier)));
			}
			async #objcClasses(pattern, signal) {
				const names = await this.#allAddressed("list_names", signal);
				return names.ok ? ok(discoverObjcClasses(names.value, pattern)) : names;
			}
			#inspectNativeDispatchMetadata(maxRecords, signal) {
				return inspectNativeDispatch(this.analysis, maxRecords, signal);
			}
			async #objcProtocols(signal) {
				const names = await this.#allAddressed("list_names", signal);
				return names.ok ? ok(discoverObjcProtocols(names.value)) : names;
			}
			async #batchDecompile(addresses, signal) {
				const resolutions = await Promise.all(addresses.map(async (address) => {
					const result = await resolveProcedureAddress(this.#call.bind(this), address, signal);
					return {
						address,
						result
					};
				}));
				const resolutionCancellation = firstAnalysisCancellation(resolutions.map(({ result }) => result));
				if (resolutionCancellation !== undefined) return err(resolutionCancellation);
				const identities = await this.#batchIdentities(resolutions, signal);
				const ready = [];
				for (const identity of identities) {
					if (!identity.ok) return err(identity.error);
					ready.push(identity.value);
				}
				const decompilations = await this.#batchPseudocode(ready, signal);
				const items = [];
				for (const decompilation of decompilations) {
					if (!decompilation.ok) return err(decompilation.error);
					items.push(decompilation.value);
				}
				const succeeded = items.filter(({ status }) => status === "ok").length;
				return ok({
					items,
					total: items.length,
					succeeded,
					failed: items.length - succeeded
				});
			}
			async #batchIdentities(resolutions, signal) {
				return Promise.all(resolutions.map(async ({ address, result }) => {
					if (!result.ok) return ok({
						address,
						providerProcedure: address,
						procedure: {
							status: "unknown",
							error: projectAnalysisError(result.error)
						}
					});
					const identity = await this.#batchProcedureIdentity(result.value, signal);
					return identity.ok ? ok({
						address,
						providerProcedure: result.value,
						procedure: identity.value
					}) : err(identity.error);
				}));
			}
			async #batchPseudocode(ready, signal) {
				return Promise.all(ready.map(async ({ address, procedure, providerProcedure }) => {
					const result = await this.#call("procedure_pseudo_code", { procedure: providerProcedure }, signal, procedure.status === "resolved" ? "provider" : undefined);
					if (!result.ok && isAnalysisCancellation(result.error)) return err(result.error);
					const item = !result.ok ? {
						address,
						procedure,
						status: "error",
						error: projectAnalysisError(result.error)
					} : typeof result.value !== "string" || result.value.length === 0 ? {
						address,
						procedure,
						status: "error",
						error: projectAnalysisError(new AnalysisOutputError("procedure_pseudo_code", "provider returned empty pseudocode"))
					} : {
						address,
						procedure,
						status: "ok",
						pseudocode: result.value
					};
					return ok(item);
				}));
			}
			async #batchProcedureIdentity(address, signal) {
				const observed = await this.#call("address_name", { address }, signal);
				if (!observed.ok && isAnalysisCancellation(observed.error)) return err(observed.error);
				const named = observed.ok && (typeof observed.value === "string" || observed.value === null);
				return ok({
					status: "resolved",
					address,
					name: named ? observed.value : null,
					...named ? {} : { name_error: projectAnalysisError(observed.ok ? new AnalysisOutputError("address_name", "provider returned an invalid entry label") : observed.error) }
				});
			}
			async #callGraph(input, signal) {
				const relation = input.direction === "forward" ? "callees" : "callers";
				const tool = input.direction === "forward" ? "procedure_callees" : "procedure_callers";
				const limitations = new Set();
				const resolved = await this.#observe("procedure_address", { procedure: input.address }, signal);
				if (!resolved.ok) return resolved;
				for (const limitation of resolved.value.limitations) limitations.add(limitation);
				const startAddress = resolved.value.result;
				if (typeof startAddress !== "string" || startAddress.length === 0) return err(new AnalysisOutputError("procedure_address", "provider returned no canonical procedure address"));
				const discovered = new Set([startAddress]);
				const queue = [{
					address: startAddress,
					depth: 0
				}];
				let queueIndex = 0;
				const graph = {};
				while (queueIndex < queue.length) {
					const current = queue[queueIndex++];
					if (current === undefined) continue;
					const level = String(current.depth);
					graph[level] ??= [];
					const result = await this.#observe(tool, { procedure: current.address }, signal, "provider");
					if (!result.ok) {
						if (isAnalysisCancellation(result.error)) return result;
						graph[level].push({
							address: current.address,
							status: "error",
							error: projectAnalysisError(result.error)
						});
						continue;
					}
					const related = parseRelatedAddresses(result.value.result, relation);
					if (!related.ok) {
						graph[level].push({
							address: current.address,
							status: "error",
							error: projectAnalysisError(related.error)
						});
						continue;
					}
					for (const limitation of result.value.limitations) limitations.add(limitation);
					const reportedCoverage = result.value.relationshipCoverage;
					const coverage = reportedCoverage ?? {
						status: "unknown",
						reason: "Provider did not report relationship coverage."
					};
					const relationshipLimitations = reportedCoverage === undefined ? [...result.value.limitations, "Provider did not report relationship coverage."] : [...reportedCoverage.status === "partial" ? reportedCoverage.limitations : reportedCoverage.status === "unknown" ? [reportedCoverage.reason] : [], ..."diagnostics" in reportedCoverage ? reportedCoverage.diagnostics : []];
					const nodeLimitations = [...new Set(relationshipLimitations)].sort(compareUnicodeCodePoints);
					graph[level].push({
						address: current.address,
						status: "ok",
						calls: [...related.value],
						relationship_coverage: coverage,
						...nodeLimitations.length === 0 ? {} : { limitations: nodeLimitations }
					});
					for (const address of related.value) {
						if (!discovered.has(address)) {
							discovered.add(address);
							queue.push({
								address,
								depth: current.depth + 1
							});
						}
					}
				}
				return ok({
					graph,
					limitations: [...limitations].sort(compareUnicodeCodePoints)
				});
			}
			async #analyzeSwiftTypes(input, signal) {
				const procedures = await this.#allAddressed("list_procedures", signal);
				if (!procedures.ok) return procedures;
				const symbols = await this.#allAddressed("list_names", signal);
				if (!symbols.ok && !(symbols.error instanceof AnalysisCapabilityUnavailableError)) return symbols;
				const result = categorizeSwiftTypes(procedures.value, input, symbols.ok ? symbols.value : []);
				return ok(symbols.ok ? result : {
					...result,
					symbol_inventory_error: projectAnalysisError(symbols.error),
					limitations: [...result.limitations, "The provider's symbol inventory is unavailable; demangled procedures could not be joined to their Swift aliases."]
				});
			}
			async #findXrefs(name, signal) {
				const names = await this.#allAddressed("list_names", signal);
				if (!names.ok) return names;
				const resolved = names.value.find((entry) => entry.name === name);
				if (resolved === undefined) return ok({
					status: "unresolved",
					name,
					reason: "name_not_found"
				});
				const xrefs = await this.#call("xrefs", { address: resolved.address }, signal);
				if (!xrefs.ok) return xrefs;
				if (!Array.isArray(xrefs.value) || xrefs.value.some((xref) => typeof xref !== "string")) return err(new AnalysisOutputError("xrefs", "provider returned an invalid address list"));
				return ok({
					status: "resolved",
					name,
					address: resolved.address,
					xrefs: xrefs.value
				});
			}
			async #binaryOverview(signal) {
				const document = await resolveAnalysisDocument(this.analysis, undefined, signal);
				if (!document.ok) return document;
				const [segmentsResult, proceduresResult, stringsResult] = await Promise.all([
					this.#call("list_segments", {}, signal),
					this.#call("list_procedures", {}, signal),
					this.#call("list_strings", {}, signal)
				]);
				if (!segmentsResult.ok && !(segmentsResult.error instanceof AnalysisCapabilityUnavailableError)) return segmentsResult;
				if (!proceduresResult.ok) return proceduresResult;
				if (!stringsResult.ok) return stringsResult;
				const segments = segmentsResult.ok ? parseSegments(segmentsResult.value) : undefined;
				if (segments !== undefined && !segments.ok) return segments;
				const procedureCount = parseListCount(proceduresResult.value, "procedures");
				if (!procedureCount.ok) return procedureCount;
				const stringCount = parseListCount(stringsResult.value, "strings");
				if (!stringCount.ok) return stringCount;
				const observedSegments = segments?.ok ? segments.value : undefined;
				const imageBase = observedSegments === undefined ? undefined : parseSegmentImageBase(observedSegments);
				return ok({
					document: document.value,
					...imageBase === undefined ? {} : { image_base: imageBase },
					...observedSegments === undefined ? {} : {
						segments: observedSegments.map(({ name, start, end, image_base, address_space }) => ({
							name,
							start,
							end,
							length: addressDistance(start, end),
							...image_base === undefined ? {} : { image_base },
							...address_space === undefined ? {} : { address_space }
						})),
						segment_count: observedSegments.length
					},
					procedure_count: procedureCount.value,
					string_count: stringCount.value
				});
			}
			async #allAddressed(tool, signal) {
				const result = await this.#call(tool, {}, signal);
				if (!result.ok) return result;
				const parsed = z.array(z.object({
					address: z.string(),
					value: z.string()
				})).safeParse(result.value);
				return parsed.success ? ok(parsed.data.map(({ address, value: name }) => ({
					address,
					name
				}))) : err(new AnalysisOutputError(tool, "provider returned an invalid inventory"));
			}
			async #call(name, arguments_, signal, selectorOrigin) {
				const execution = await this.#observe(name, arguments_, signal, selectorOrigin);
				return execution.ok ? ok(execution.value.result) : execution;
			}
			async #observe(name, arguments_, signal, selectorOrigin) {
				if (isAborted(signal)) return err(new AnalysisCancelledError(name));
				const execution = await this.analysis.execute(name, arguments_, {
					...signal === undefined ? {} : { signal },
					...selectorOrigin === undefined ? {} : { selectorOrigin }
				});
				if (!execution.ok) return execution;
				if (isAborted(signal)) return err(new AnalysisCancelledError(name));
				return execution;
			}
		};
		isAborted = (signal) => signal?.aborted === true;
	})))();
}

//#endregion
init_EnhancedTools();
export { EnhancedTools };