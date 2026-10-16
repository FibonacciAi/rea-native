import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { addressedValue, analysisProfileSchema, artifactInspectionResultSchema, committedProviderSchema, compareUnicodeCodePoints, createEvidence, err, init_analysisProfile, init_artifactInspection, init_evidence, init_result, init_toolOutputSchemaPrimitives, init_unicodeCodePointOrder, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCapabilityUnavailableError, AnalysisInputError, AnalysisOutputError, analysisErrorProjectionSchema, init_analysisErrorCore, init_errorSchemas, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { ProviderAdapterError, init_providerAdapterError } from "./providerAdapterError-DAjhICdr.js";
import { EvidenceFileError, EvidenceIntegrityError, UnknownRegistryError, init_evidenceErrors, init_unknownRegistryError } from "./analysisErrorPresentation-DGt7TdsH.js";
import { init_analysisErrorProjection, projectAnalysisError } from "./cliResultOutput-DsRMI8CJ.js";
import { analysisErrorWithCleanupFailure, init_analysisErrorCleanup } from "./analysisErrorCleanup-Do6YeeoD.js";
import { REA_WORKFLOW_PROVIDER, init_InvestigationProviders, workflowAnalysisProfile } from "./InvestigationProviders-DoQRIHii.js";
import { init_BinaryTargetResolver, parseBinaryTarget } from "./BinaryTargetResolver-CVIJ_s1A.js";
import { init_logger, silentLogger } from "./logger-CQQCI4a2.js";
import { init_managedToolContracts, isManagedToolName } from "./managedToolContracts-D60QmIYj.js";
import { ARTIFACT_ANALYSIS_OPERATIONS, init_artifactToolContracts } from "./officialToolContracts-CCFF0an9.js";
import { init_AnalysisSnapshotCache, init_AnalysisSnapshotFiles, init_analysisSnapshot, readAnalysisSnapshot, requiresNativeSourceAdmissionBeforeReplay, snapshotEvidenceForQuery, snapshotMatchesTarget } from "./AnalysisSnapshotCache-BXS0wRd2.js";
import { access } from "node:fs/promises";

//#region dist/application/WorkflowEvidence.js
var executeComposedWorkflow, createWorkflowEvidence, batchProcedureLocations, workflowSnapshotRecord, recordWorkflowUnknowns;
function init_WorkflowEvidence() {
	return (init_WorkflowEvidence = __esmMin((() => {
		init_InvestigationProviders();
		init_result();
		init_analysisProfile();
		init_evidence();
		init_unknownRegistryError();
		init_unicodeCodePointOrder();
		executeComposedWorkflow = async (analysis, execute) => {
			const limitations = new Set();
			const result = await execute({ execute: async (operation, parameters, options) => {
				const execution = await analysis.execute(operation, parameters, options);
				if (execution.ok) execution.value.limitations.forEach((limitation) => limitations.add(limitation));
				return execution;
			} });
			if (!result.ok) return result;
			return ok({
				result: result.value,
				limitations: [...limitations].sort(compareUnicodeCodePoints)
			});
		};
		createWorkflowEvidence = (input) => createEvidence(input.target, REA_WORKFLOW_PROVIDER, {
			operation: input.operation,
			parameters: input.parameters,
			result: input.result,
			...input.upstreamProfile === undefined ? {} : { analysisProfile: workflowAnalysisProfile(input.upstreamProfile, input.operation) },
			confidence: "derived",
			limitations: ["Derived by an REA composed workflow.", ...input.upstreamLimitations],
			...input.operation === "batch_decompile" ? { locations: batchProcedureLocations(input.result) } : {}
		});
		batchProcedureLocations = (result) => {
			if (result === null || typeof result !== "object" || Array.isArray(result) || !Array.isArray(result.items)) return [];
			const addresses = new Set();
			for (const item of result.items) {
				if (item === null || typeof item !== "object" || Array.isArray(item)) continue;
				const procedure = item.procedure;
				if (procedure !== null && typeof procedure === "object" && !Array.isArray(procedure) && procedure.status === "resolved" && typeof procedure.address === "string") addresses.add(procedure.address);
			}
			return [...addresses].map((address) => ({
				kind: "address",
				address
			}));
		};
		workflowSnapshotRecord = (evidence, operation) => {
			if (evidence.analysis_profile === null) return undefined;
			return {
				operation,
				parameters: evidence.parameters,
				execution: {
					result: evidence.normalized_result,
					rawResult: evidence.raw_result,
					provider: committedProviderSchema.parse(evidence.provider),
					analysisProfile: analysisProfileSchema.parse(evidence.analysis_profile),
					limitations: evidence.limitations,
					locations: evidence.locations,
					subject: evidence.subject === null ? null : {
						path: evidence.subject.local_path,
						sha256: evidence.subject.digest.sha256,
						format: evidence.subject.format,
						...evidence.subject.architecture === null ? {} : { architecture: evidence.subject.architecture }
					}
				}
			};
		};
		recordWorkflowUnknowns = ({ name, result, evidenceId, recordUnknown }) => {
			if (![
				"trace_feature",
				"trace_call_path",
				"inspect_native_api"
			].includes(name) || recordUnknown === undefined || typeof result !== "object" || result === null || Array.isArray(result) || !Array.isArray(result.residual_unknowns)) return {
				ok: true,
				value: null
			};
			for (const question of result.residual_unknowns) {
				if (typeof question !== "string") continue;
				const recorded = recordUnknown({
					question,
					severity: "medium",
					domain: name === "inspect_native_api" ? "native-api" : "control-flow",
					supporting_evidence_ids: [evidenceId],
					contradicting_evidence_ids: [],
					required_authority: "shipped-artifact",
					required_confidence: "observed",
					required_environment: null,
					recommended_probes: [{
						operation: name,
						rationale: name === "inspect_native_api" ? "Confirm the unsupported boundary with a capable provider or ABI probe." : "Continue with a focused query or another available provider."
					}],
					relationships: []
				});
				if (!recorded.ok && !(recorded.error instanceof UnknownRegistryError && recorded.error.reason === "already-exists")) return recorded;
			}
			return {
				ok: true,
				value: null
			};
		};
	})))();
}

//#endregion
//#region dist/application/ProcedureAddressResolution.js
var resolveProcedureAddress;
function init_ProcedureAddressResolution() {
	return (init_ProcedureAddressResolution = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		resolveProcedureAddress = async (call, procedure, signal) => {
			const result = await call("procedure_address", { procedure }, signal);
			if (!result.ok) return result;
			return typeof result.value === "string" && result.value.length > 0 ? ok(result.value) : err(new AnalysisOutputError("procedure_address", "provider returned no canonical procedure address"));
		};
	})))();
}

//#endregion
//#region dist/application/XrefsAddressResolution.js
var resolveXrefsAddress;
function init_XrefsAddressResolution() {
	return (init_XrefsAddressResolution = __esmMin((() => {
		init_toolOutputSchemaPrimitives();
		init_analysisErrorCore();
		init_result();
		init_ProcedureAddressResolution();
		resolveXrefsAddress = async (analysis, selector, signal) => {
			if (selector.length === 0 || /^[0-9a-f]+$/iu.test(selector) || /^0x/iu.test(selector) || /:0x/iu.test(selector)) return ok(selector);
			const inventory = await analysis.execute("list_names", {}, { signal });
			if (!inventory.ok) {
				if (inventory.error instanceof AnalysisCapabilityUnavailableError && inventory.error.operation === "list_names" && !inventory.error.cleanupIncomplete) return resolveProcedureAddress(async (operation, parameters, signal) => {
					const result = await analysis.execute(operation, parameters, signal === undefined ? {} : { signal });
					return result.ok ? ok(result.value.result) : result;
				}, selector, signal);
				return inventory;
			}
			if (!Array.isArray(inventory.value.result)) return err(new AnalysisOutputError("list_names", "Expected a symbol inventory array"));
			const addresses = new Set();
			for (const [index, item] of inventory.value.result.entries()) {
				const parsed = addressedValue.safeParse(item);
				if (!parsed.success || parsed.data.address.length === 0) return err(new AnalysisOutputError("list_names", `Invalid symbol inventory entry at index ${index}`));
				if (parsed.data.value === selector) addresses.add(parsed.data.address);
			}
			const [address] = addresses;
			if (addresses.size === 1 && address !== undefined) return ok(address);
			return err(new AnalysisInputError("xrefs", undefined, [{
				path: ["address"],
				reason: "invalid_value",
				message: addresses.size === 0 ? `Unknown analyzed symbol name ${JSON.stringify(selector)}. Use an exact analyzed name or a hexadecimal address.` : `Analyzed symbol name ${JSON.stringify(selector)} is ambiguous at ${[...addresses].join(", ")}. Select an exact address.`
			}]));
		};
	})))();
}

//#endregion
//#region dist/application/DirectAnalysisCleanup.js
var withSessionCleanup, directAnalysisCleanupFailure, managedAnalysisCleanupFailure;
function init_DirectAnalysisCleanup() {
	return (init_DirectAnalysisCleanup = __esmMin((() => {
		init_errorSchemas();
		init_analysisErrorProjection();
		init_jsonValue();
		init_providerAdapterError();
		init_result();
		init_analysisErrorCleanup();
		withSessionCleanup = async (session, operation, onCleanupFailure) => {
			let value;
			try {
				value = await operation();
			} catch (cause) {
				const closed = await session.close();
				if (!closed.ok) throw new AggregateError([cause, closed.error], "Analysis and provider cleanup both failed", { cause });
				throw cause;
			}
			const closed = await session.close();
			return closed.ok ? value : onCleanupFailure(value, closed.error);
		};
		directAnalysisCleanupFailure = (output, error) => {
			const cleanup = projectAnalysisError(error);
			if (typeof output === "object" && output !== null && !Array.isArray(output)) {
				const { error: label, ...projection } = output;
				const primary = analysisErrorProjectionSchema.safeParse(projection);
				if (typeof label === "string" && primary.success) return {
					error: label,
					...primary.data,
					code: "cleanup_incomplete",
					retryable: false,
					details: {
						...primary.data.details,
						cleanup: "incomplete",
						resources: error.cleanupResources.slice(),
						execution_failure: primary.data.details !== undefined && "execution_failure" in primary.data.details ? primary.data.details.execution_failure ?? primary.data.code : primary.data.code,
						cleanup_error: cleanup
					}
				};
			}
			return {
				error: "Analysis failed",
				...cleanup,
				code: "cleanup_incomplete",
				retryable: false,
				details: {
					...cleanup.details,
					cleanup: "incomplete",
					partial_observation: output
				}
			};
		};
		managedAnalysisCleanupFailure = (result, error) => {
			if (!result.ok) return err(analysisErrorWithCleanupFailure(result.error, error));
			const cleanup = projectAnalysisError(error);
			return err(new ProviderAdapterError(error instanceof ProviderAdapterError ? error.providerId : "rea", "close_binary", {
				cause: error,
				cleanup: {
					reason: cleanup.message,
					resources: error.cleanupResources
				},
				diagnostics: {
					cleanup_error: cleanup,
					partial_observation: jsonValueSchema.parse(result.value)
				}
			}));
		};
	})))();
}

//#endregion
//#region dist/application/DirectAnalysis.js
var DirectAnalysis_exports = /* @__PURE__ */ __exportAll({
	runDirectAnalysis: () => runDirectAnalysis,
	runManagedProviderExecution: () => runManagedProviderExecution,
	runProviderAnalysis: () => runProviderAnalysis
});
var ARTIFACT_ANALYSIS_OPERATION_SET, runDirectAnalysis, runProviderAnalysis, runManagedProviderExecution, runManagedProviderAnalysis, runAnalysis, executeAnalysisTool, withProcessCancellation, prepareSnapshot, allowsSnapshotReplay, analysisProfileForRoute, providerIdentityForRoute, analysisProfileForEvidence, isWorkflowEvidenceTool, fileExists, cliError;
function init_DirectAnalysis() {
	return (init_DirectAnalysis = __esmMin((() => {
		init_logger();
		init_evidence();
		init_artifactToolContracts();
		init_managedToolContracts();
		init_evidenceErrors();
		init_analysisErrorProjection();
		init_AnalysisSnapshotFiles();
		init_AnalysisSnapshotCache();
		init_BinaryTargetResolver();
		init_analysisSnapshot();
		init_result();
		init_InvestigationProviders();
		init_WorkflowEvidence();
		init_artifactInspection();
		init_XrefsAddressResolution();
		init_analysisErrorCore();
		init_DirectAnalysisCleanup();
		ARTIFACT_ANALYSIS_OPERATION_SET = new Set(ARTIFACT_ANALYSIS_OPERATIONS);
		runDirectAnalysis = async (dependencies, path, tool, arguments_, options = {}) => withProcessCancellation(options.signal, (signal) => runAnalysis(dependencies, path, tool, arguments_, {
			logger: options.logger ?? silentLogger,
			snapshotPath: options.snapshotPath,
			signal,
			...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
			...options.architecture === undefined ? {} : { architecture: options.architecture },
			...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint },
			...options.providerId === undefined ? {} : { providerId: options.providerId }
		}));
		runProviderAnalysis = async (dependencies, ...[path, tool, arguments_, logger = silentLogger, signal]) => {
			if (isManagedToolName(tool)) return runManagedProviderAnalysis(dependencies, path, tool, arguments_, signal);
			return withProcessCancellation(signal, (operationSignal) => runAnalysis(dependencies, path, tool, arguments_, {
				logger,
				snapshotPath: undefined,
				signal: operationSignal,
				...ARTIFACT_ANALYSIS_OPERATION_SET.has(tool) ? { createSession: dependencies.createArtifactBinarySession } : {}
			}));
		};
		runManagedProviderExecution = async (dependencies, path, tool, signal, parameters = {}) => withProcessCancellation(signal, async (operationSignal) => {
			const session = await dependencies.createManagedBinarySession();
			return withSessionCleanup(session, async () => {
				const opened = await session.open(path, { signal: operationSignal });
				if (!opened.ok) return opened;
				return await session.execute(tool, parameters, { signal: operationSignal });
			}, managedAnalysisCleanupFailure);
		});
		runManagedProviderAnalysis = async (dependencies, path, tool, arguments_, signal) => {
			const execution = await runManagedProviderExecution(dependencies, path, tool, signal, arguments_);
			if (!execution.ok) return cliError(execution.error);
			const value = execution.value;
			return createEvidence(value.subject ?? undefined, value.provider, {
				operation: tool,
				parameters: arguments_,
				result: value.result,
				rawResult: value.rawResult,
				limitations: value.limitations,
				...value.relationshipCoverage === undefined ? {} : { relationshipCoverage: value.relationshipCoverage },
				locations: value.locations
			});
		};
		runAnalysis = async (dependencies, path, tool, arguments_, options) => {
			const { logger, signal, snapshotPath } = options;
			let session;
			if (options.createSession !== undefined) {
				session = await options.createSession();
			} else {
				const config = dependencies.readConfiguration();
				if (!config.ok) return cliError(config.error);
				session = await dependencies.createBinarySession(config.value, logger);
			}
			return withSessionCleanup(session, async () => {
				const prepared = await prepareSnapshot({
					path,
					snapshotPath,
					signal,
					...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
					...options.architecture === undefined ? {} : { architecture: options.architecture },
					...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint }
				});
				if (!prepared.ok) return cliError(prepared.error);
				const { snapshot } = prepared.value;
				let resolvedTarget;
				if (snapshot !== undefined && prepared.value.target !== undefined) {
					const preview = await session.previewTarget(prepared.value.target, {
						signal,
						snapshot,
						...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
						...options.architecture === undefined ? {} : { architecture: options.architecture },
						...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint },
						...options.providerId === undefined ? {} : { providerId: options.providerId }
					});
					if (!preview.ok) return cliError(preview.error);
					resolvedTarget = preview.value;
					const route = preview.value.route;
					const bindingProfile = route.profile ?? undefined;
					const evidenceProfile = analysisProfileForRoute(route, tool);
					if (bindingProfile !== undefined && evidenceProfile !== undefined && !requiresNativeSourceAdmissionBeforeReplay(route.binding?.identity.id) && allowsSnapshotReplay(route, tool)) {
						const cached = snapshotEvidenceForQuery(snapshot, {
							target: preview.value.target,
							bindingProfile,
							operation: tool,
							parameters: arguments_,
							provider: isWorkflowEvidenceTool(tool) ? REA_WORKFLOW_PROVIDER : providerIdentityForRoute(route, tool),
							evidenceProfile
						});
						if (cached !== undefined) return cached;
					}
				}
				const openOptions = {
					signal,
					...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
					...options.architecture === undefined ? {} : { architecture: options.architecture },
					...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint },
					...snapshot === undefined ? {} : { snapshot },
					...options.providerId === undefined ? {} : { providerId: options.providerId }
				};
				const opened = resolvedTarget === undefined ? await session.open(path, openOptions) : await session.openResolvedTarget(resolvedTarget, openOptions);
				if (!opened.ok) return cliError(opened.error);
				const evidenceProfile = analysisProfileForEvidence(session, tool);
				const { output, evidence } = await executeAnalysisTool({
					session,
					openedTarget: opened.value,
					tool,
					arguments: arguments_,
					signal,
					evidenceProfile
				});
				if (evidence !== undefined) {
					const recorded = session.recordEvidence(evidence);
					if (!recorded.ok) return cliError(recorded.error.retainPartialObservation(evidence));
					if (isWorkflowEvidenceTool(tool)) {
						const unknowns = recordWorkflowUnknowns({
							name: tool,
							result: evidence.normalized_result,
							evidenceId: evidence.evidence_id,
							recordUnknown: (unknown) => session.recordUnknown(unknown)
						});
						if (!unknowns.ok) return cliError(unknowns.error.retainPartialObservation(evidence));
					}
				}
				if (isWorkflowEvidenceTool(tool) && tool !== "trace_native_ui_action" && snapshotPath !== undefined && evidence !== undefined && session.allowsSnapshotReplay(tool)) {
					const workflowRecord = workflowSnapshotRecord(evidence, tool);
					if (workflowRecord !== undefined) {
						const recorded = session.recordWorkflowSnapshot(workflowRecord);
						if (!recorded.ok) return cliError(recorded.error.retainPartialObservation(evidence));
					}
				}
				if (tool !== "trace_native_ui_action" && snapshotPath !== undefined && evidence !== undefined) {
					const snapshot = session.exportAnalysisSnapshot();
					if (!snapshot.ok) return cliError(snapshot.error.retainPartialObservation(evidence));
					const written = await session.writeAnalysisSnapshot(snapshot.value, snapshotPath, true);
					if (!written.ok) {
						const recovered = written.error instanceof EvidenceFileError && written.error.published !== undefined && (await session.closeWriteResources()).ok;
						if (!recovered) return cliError(written.error.retainPartialObservation(evidence));
					}
				}
				return output;
			}, directAnalysisCleanupFailure);
		};
		executeAnalysisTool = async (input) => {
			const { session, tool, signal, evidenceProfile } = input;
			if (tool === "analyze_function") {
				const { executeFunctionAnalysisEvidence } = await import("./application__FunctionAnalysisEvidence-B6osuhvW.js");
				const result = await executeFunctionAnalysisEvidence(session, input.arguments, input.openedTarget, { signal });
				return result.ok ? {
					output: result.value,
					evidence: result.value
				} : { output: cliError(result.error) };
			}
			if (tool === "binary_overview" || tool === "inspect_native_api" || tool === "inspect_native_dispatch_metadata" || tool === "trace_feature" || tool === "trace_native_values" || tool === "trace_native_ui_action") {
				const { EnhancedTools } = await import("./application__EnhancedTools-oFE2bOjs.js");
				const result = await executeComposedWorkflow(session, (observed) => new EnhancedTools(observed).execute(tool, input.arguments, signal));
				if (!result.ok) return { output: cliError(result.error) };
				const evidence = createWorkflowEvidence({
					target: input.openedTarget,
					operation: tool,
					parameters: input.arguments,
					result: result.value.result,
					upstreamProfile: evidenceProfile,
					upstreamLimitations: result.value.limitations
				});
				return {
					output: evidence,
					evidence
				};
			}
			let result = await session.execute(tool, input.arguments, { signal });
			if (tool === "xrefs" && typeof input.arguments.address === "string" && !result.ok && result.error instanceof AnalysisInputError && !result.error.cleanupIncomplete && result.error.issues.length > 0 && result.error.issues.every(({ path, reason }) => path.length === 1 && path[0] === "address" && reason === "invalid_format")) {
				const address = await resolveXrefsAddress(session, input.arguments.address, signal);
				if (!address.ok) return { output: cliError(address.error) };
				if (address.value !== input.arguments.address) result = await session.execute(tool, {
					...input.arguments,
					address: address.value
				}, { signal });
			}
			if (!result.ok) return { output: cliError(result.error) };
			const evidence = createEvidence(result.value.subject ?? input.openedTarget, result.value.provider, {
				operation: tool,
				parameters: input.arguments,
				result: result.value.result,
				...result.value.analysisProfile === undefined ? {} : { analysisProfile: result.value.analysisProfile },
				rawResult: result.value.rawResult,
				limitations: result.value.limitations,
				...result.value.relationshipCoverage === undefined ? {} : { relationshipCoverage: result.value.relationshipCoverage },
				locations: result.value.locations,
				evidenceLinks: tool === "inspect_artifact" ? artifactInspectionResultSchema.parse(result.value.result).evidence_links : []
			});
			return {
				output: evidence,
				evidence
			};
		};
		withProcessCancellation = async (suppliedSignal, operation) => {
			if (suppliedSignal !== undefined) return operation(suppliedSignal);
			const controller = new AbortController();
			const cancel = () => controller.abort();
			process.on("SIGINT", cancel);
			process.on("SIGTERM", cancel);
			try {
				return await operation(controller.signal);
			} finally {
				process.off("SIGINT", cancel);
				process.off("SIGTERM", cancel);
			}
		};
		prepareSnapshot = async (options) => {
			const { path, snapshotPath } = options;
			if (snapshotPath === undefined || !await fileExists(snapshotPath)) return ok({});
			const loaded = await readAnalysisSnapshot(snapshotPath, options.signal);
			if (!loaded.ok) return loaded;
			const target = await parseBinaryTarget(path, {
				signal: options.signal,
				...options.formatHint === undefined ? {} : { formatHint: options.formatHint },
				...options.architecture === undefined ? {} : { architecture: options.architecture },
				...options.entryPoint === undefined ? {} : { entryPoint: options.entryPoint }
			});
			if (!target.ok) return target;
			if (!snapshotMatchesTarget(loaded.value.target, target.value)) return err(new EvidenceIntegrityError("Analysis snapshot target does not match the requested binary"));
			return ok({
				snapshot: loaded.value,
				target: target.value
			});
		};
		allowsSnapshotReplay = (route, tool) => {
			if (tool === "trace_native_ui_action") return false;
			const descriptor = route.capabilities?.get(tool);
			return descriptor === undefined ? ![...route.capabilities?.values() ?? []].some(({ cachePolicy }) => cachePolicy === "live") : descriptor.cachePolicy !== "live";
		};
		analysisProfileForRoute = (route, tool) => {
			const profile = route.profile;
			if (profile === null || profile === undefined) return undefined;
			if (isWorkflowEvidenceTool(tool)) return workflowAnalysisProfile(profile, tool);
			const provider = providerIdentityForRoute(route, tool);
			return provider.id === profile.provider.id ? profile : undefined;
		};
		providerIdentityForRoute = (route, operation) => route.capabilities?.get(operation)?.provider ?? route.identity;
		analysisProfileForEvidence = (session, tool) => {
			if (!isWorkflowEvidenceTool(tool)) return session.analysisProfile(tool);
			return session.analysisProfile();
		};
		isWorkflowEvidenceTool = (tool) => tool === "binary_overview" || tool === "inspect_native_api" || tool === "inspect_native_dispatch_metadata" || tool === "trace_feature" || tool === "trace_native_values" || tool === "trace_native_ui_action";
		fileExists = async (path) => {
			try {
				await access(path);
				return true;
			} catch (cause) {
				if (typeof cause === "object" && cause !== null && "code" in cause && cause.code === "ENOENT") return false;
				throw cause;
			}
		};
		cliError = (error) => ({
			error: "Analysis failed",
			...projectAnalysisError(error)
		});
	})))();
}

//#endregion
export { DirectAnalysis_exports, init_DirectAnalysis, init_ProcedureAddressResolution, resolveProcedureAddress };