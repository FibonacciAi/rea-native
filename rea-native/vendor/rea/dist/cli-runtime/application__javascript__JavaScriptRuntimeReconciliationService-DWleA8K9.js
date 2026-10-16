import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { analysisInputErrorFromIssues, createEvidence, err, init_evidence, init_inputIssueProjection, init_result, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisProtocolError, init_analysisErrorCore, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, init_InvestigationProviders } from "./InvestigationProviders-DoQRIHii.js";
import { init_javascriptRuntimeReconciliationSchemas, reconcileJavaScriptRuntimeInputSchema } from "./javascriptRuntimeReconciliationSchemas-BWpGWNcI.js";
import { init_javascriptRuntimeReconciliation, parseRuntimeReconciliationInput, reconcileJavaScriptRuntime } from "./javascriptRuntimeReconciliation-DNjDoL3S.js";
import { z } from "zod";
import { resolve } from "node:path";

//#region dist/application/javascript/JavaScriptRuntimeReconciliationEvidence.js
var createJavaScriptRuntimeReconciliationEvidence, parameters;
function init_JavaScriptRuntimeReconciliationEvidence() {
	return (init_JavaScriptRuntimeReconciliationEvidence = __esmMin((() => {
		init_evidence();
		init_jsonValue();
		init_InvestigationProviders();
		createJavaScriptRuntimeReconciliationEvidence = (input, result) => createEvidence(undefined, JAVASCRIPT_RUNTIME_RECONCILIATION_PROVIDER, {
			predicateType: "rea.javascript-runtime-reconciliation",
			operation: "reconcile_javascript_runtime",
			parameters: parameters(input),
			result: jsonValueSchema.parse(result),
			rawResult: null,
			confidence: "inferred",
			authority: "analyst-inference",
			environment: null,
			limitations: result.limitations,
			evidenceLinks: result.evidence_links
		});
		parameters = (input) => ({
			static_layers: input.static_layers.map((layer) => ({
				role: layer.role,
				evidence_id: layer.analysis.evidence_id,
				runtime_mappings: layer.runtime_mappings
			})),
			runtime_evidence_ids: input.runtime_observations.map(({ evidence_id: id }) => id)
		});
	})))();
}

//#endregion
//#region dist/application/javascript/JavaScriptRuntimeReconciliationService.js
var OPERATION, reconcileJavaScriptRuntimeEvidence, reconcileJavaScriptRuntimeEvidenceValidated, normalizeRuntimeMappingRoots, isPortableAbsolutePath;
function init_JavaScriptRuntimeReconciliationService() {
	return (init_JavaScriptRuntimeReconciliationService = __esmMin((() => {
		init_analysisErrorCore();
		init_inputIssueProjection();
		init_javascriptRuntimeReconciliation();
		init_javascriptRuntimeReconciliationSchemas();
		init_result();
		init_JavaScriptRuntimeReconciliationEvidence();
		OPERATION = "reconcile_javascript_runtime";
		reconcileJavaScriptRuntimeEvidence = (rawInput) => {
			const parsed = reconcileJavaScriptRuntimeInputSchema.safeParse(rawInput);
			if (!parsed.success) return err(analysisInputErrorFromIssues(OPERATION, parsed.error.issues, rawInput));
			return reconcileJavaScriptRuntimeEvidenceValidated(parsed.data);
		};
		reconcileJavaScriptRuntimeEvidenceValidated = (parsedInput) => {
			let parsed;
			try {
				parsed = parseRuntimeReconciliationInput(normalizeRuntimeMappingRoots(parsedInput));
			} catch (cause) {
				if (cause instanceof z.ZodError) return err(analysisInputErrorFromIssues(OPERATION, cause.issues, parsedInput));
				return err(new AnalysisProtocolError("JavaScript runtime reconciliation input parsing failed", { cause }));
			}
			try {
				const result = reconcileJavaScriptRuntime(parsed);
				return ok(createJavaScriptRuntimeReconciliationEvidence(parsed.input, result));
			} catch (cause) {
				return err(new AnalysisProtocolError("JavaScript runtime reconciliation produced an invalid result", { cause }));
			}
		};
		normalizeRuntimeMappingRoots = (input) => ({
			...input,
			static_layers: input.static_layers.map((layer) => ({
				...layer,
				runtime_mappings: layer.runtime_mappings.map((mapping) => mapping.kind === "file-root" ? {
					...mapping,
					root: isPortableAbsolutePath(mapping.root) ? mapping.root : resolve(mapping.root)
				} : mapping)
			}))
		});
		isPortableAbsolutePath = (path) => path.startsWith("/") || /^[a-z]:[\\/]/iu.test(path) || /^(?:\\\\|\/\/)[^\\/]+[\\/][^\\/]+(?:[\\/]|$)/u.test(path);
	})))();
}

//#endregion
init_JavaScriptRuntimeReconciliationService();
export { reconcileJavaScriptRuntimeEvidence };