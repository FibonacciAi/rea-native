import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, a as AnalysisCapabilityUnavailableError, f as init_analysisErrorCore, g as init_result, h as err, o as AnalysisInputError, s as AnalysisOutputError } from "./analysisErrorCore-DXRTvF_m.js";
import { c as EvidenceFileError, d as init_evidenceErrors, l as EvidenceIntegrityError, n as projectAnalysisError, t as init_analysisErrorProjection } from "./analysisErrorProjection-BN0EPM-3.js";
import { M as addressedValue, R as init_toolOutputSchemaPrimitives, it as createEvidence, lt as init_evidence, nt as analysisErrorProjectionSchema, rt as init_errorSchemas } from "./nativeValueTrace-DR9UE62L.js";
import { c as jsonValueSchema, o as init_jsonValue } from "./digests-BFoWUT_-.js";
import { Di as artifactInspectionResultSchema, ki as init_artifactInspection } from "./toolOutputSchemaGroups-ColvNZ1r.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";
import { i as init_analysisErrorCleanup, r as analysisErrorWithCleanupFailure } from "./BoundedFileBytes-DuczXiQZ.js";
import { n as init_logger, r as silentLogger } from "./logger-BQY5ulYv.js";
import { n as init_BinaryTargetResolver, r as parseBinaryTarget } from "./BinaryTargetResolver-BMaE_0H1.js";
import { A as REA_WORKFLOW_PROVIDER, F as workflowAnalysisProfile, P as init_InvestigationProviders } from "./InterfaceBuilderDecodeBudget-5F2AkxJT.js";
import { n as init_managedToolContracts, r as isManagedToolName } from "./managedToolContracts-CK--I_s7.js";
import { o as init_artifactToolContracts, t as ARTIFACT_ANALYSIS_OPERATIONS } from "./artifactToolContracts-Di4qZlEt.js";
import { c as init_AnalysisSnapshotCache, d as init_analysisSnapshot, f as snapshotEvidenceForQuery, m as snapshotMatchesTarget, n as readAnalysisSnapshot, t as init_AnalysisSnapshotFiles, u as requiresNativeSourceAdmissionBeforeReplay } from "./AnalysisSnapshotFiles-BAbiJQOc.js";
import { n as resolveProcedureAddress, t as init_ProcedureAddressResolution } from "./ProcedureAddressResolution-CQpuwm1h.js";
import { a as workflowSnapshotRecord, i as recordWorkflowUnknowns, n as executeComposedWorkflow, r as init_WorkflowEvidence, t as createWorkflowEvidence } from "./WorkflowEvidence-umWrB_wm.js";
import { access } from "node:fs/promises";

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
				const { executeFunctionAnalysisEvidence } = await import("./main-kBXHZ8S5.js").then((n) => (n.a(), n.i));
				const result = await executeFunctionAnalysisEvidence(session, input.arguments, input.openedTarget, { signal });
				return result.ok ? {
					output: result.value,
					evidence: result.value
				} : { output: cliError(result.error) };
			}
			if (tool === "binary_overview" || tool === "inspect_native_api" || tool === "inspect_native_dispatch_metadata" || tool === "trace_feature" || tool === "trace_native_values" || tool === "trace_native_ui_action") {
				const { EnhancedTools } = await import("./main-kBXHZ8S5.js").then((n) => (n.s(), n.o));
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
init_DirectAnalysis();
export { runDirectAnalysis, runManagedProviderExecution, runProviderAnalysis };