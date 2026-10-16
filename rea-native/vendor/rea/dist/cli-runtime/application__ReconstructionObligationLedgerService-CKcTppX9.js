import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { NonCanonicalEvidenceBundleError, compareUnicodeCodePoints, createEvidence, digestCanonicalValue, err, hasReconstructionObligationDiagnostic, init_canonicalDigest, init_evidence, init_evidenceBundle, init_processCaptureParsing, init_reconstructionObligationLedgerIntegrity, init_reconstructionObligationLedgerSchemas, init_result, init_unicodeCodePointOrder, ok, parseEvidenceBundle, parseProcessCapture, reconstructionObligationCoverage, reconstructionObligationDependencyGraph, reconstructionObligationEvidenceIds, reconstructionObligationLedgerClosureDigest, reconstructionObligationLedgerInputSchema, reconstructionObligationLedgerSchema, reconstructionObligationLedgerStatus, reconstructionObligationOwnershipGraph, reconstructionObligationReports, summarizeReconstructionObligations } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisProtocolError, init_analysisErrorCore, init_jsonValue, jsonObjectSchema, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, init_InvestigationProviders } from "./InvestigationProviders-DoQRIHii.js";
import { init_workflowInputError, requestInputError, workflowInputError } from "./workflowInputError-n8Oo-bLA.js";
import { init_JavaScriptApplicationEvidenceGraph, parseApplicationGraphEvidence } from "./JavaScriptApplicationEvidenceGraph-D5aI_FSJ.js";
import { z } from "zod";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";

//#region dist/application/ReconstructionObligationPolicies.js
function policy(applicationLayer, family, authority, cases) {
	return {
		applicationLayer,
		family,
		fixtureAuthority: authority,
		verifierAuthority: authority,
		originalAuthority: "runtime",
		cases,
		requiresParserType: false
	};
}
function parserPolicy(applicationLayer, family, authority) {
	return {
		...policy(applicationLayer, family, authority, [
			"positive",
			"negative",
			"malformed"
		]),
		requiresParserType: true
	};
}
function nativePolicy(family) {
	return {
		applicationLayer: "native-abi",
		family,
		fixtureAuthority: "native-abi",
		verifierAuthority: "native-abi",
		originalAuthority: "static",
		cases: ["positive", "negative"],
		requiresParserType: false
	};
}
var APPLICATION_NODE_POLICIES, SEMANTIC_NODE_POLICIES, applicationObligationPolicy, semanticObligationPolicy;
function init_ReconstructionObligationPolicies() {
	return (init_ReconstructionObligationPolicies = __esmMin((() => {
		APPLICATION_NODE_POLICIES = {
			package: policy("packaging", "package-lifecycle", "packaged-process", [
				"positive",
				"negative",
				"teardown"
			]),
			installer: policy("packaging", "installer", "packaged-process", [
				"positive",
				"negative",
				"teardown"
			]),
			"context-bridge-api": policy("electron", "context-bridge", "renderer", [
				"positive",
				"negative",
				"malformed"
			]),
			"ipc-channel": policy("electron", "ipc", "renderer", [
				"positive",
				"negative",
				"malformed"
			]),
			"ipc-handler": policy("electron", "ipc", "renderer", [
				"positive",
				"negative",
				"malformed"
			]),
			endpoint: policy("protocol", "endpoint", "protocol", [
				"positive",
				"negative",
				"malformed"
			]),
			storage: policy("persistence", "persistence", "integration", [
				"positive",
				"negative",
				"malformed"
			]),
			worker: policy("process", "worker-lifecycle", "packaged-process", [
				"positive",
				"cancellation",
				"teardown"
			]),
			"service-worker": policy("process", "worker-lifecycle", "packaged-process", [
				"positive",
				"cancellation",
				"teardown"
			]),
			"native-addon": nativePolicy("native-addon"),
			"native-export": nativePolicy("native-export"),
			"managed-pinvoke-import": nativePolicy("managed-pinvoke"),
			"managed-native-implementation": nativePolicy("managed-native")
		};
		SEMANTIC_NODE_POLICIES = {
			"child-process": policy("process", "child-process", "packaged-process", [
				"positive",
				"negative",
				"cancellation",
				"teardown"
			]),
			stdio: policy("process", "stdio", "packaged-process", [
				"positive",
				"negative",
				"teardown"
			]),
			signal: policy("process", "signal", "packaged-process", [
				"positive",
				"cancellation",
				"teardown"
			]),
			"config-source": parserPolicy("cli", "configuration", "integration"),
			request: parserPolicy("protocol", "request", "protocol"),
			response: parserPolicy("protocol", "response", "protocol"),
			boundary: parserPolicy("application", "parser-boundary", "integration"),
			resource: policy("persistence", "resource-lifecycle", "integration", [
				"positive",
				"negative",
				"teardown"
			]),
			event: policy("runtime", "event", "packaged-process", [
				"positive",
				"negative",
				"cancellation"
			]),
			timer: policy("runtime", "timer", "packaged-process", [
				"positive",
				"cancellation",
				"teardown"
			]),
			promise: policy("runtime", "promise-ownership", "packaged-process", [
				"positive",
				"negative",
				"cancellation"
			]),
			task: policy("runtime", "task-lifecycle", "packaged-process", [
				"positive",
				"cancellation",
				"teardown"
			])
		};
		applicationObligationPolicy = (nodeKind) => APPLICATION_NODE_POLICIES[nodeKind];
		semanticObligationPolicy = (nodeKind) => SEMANTIC_NODE_POLICIES[nodeKind];
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationCandidates.js
var deriveReconstructionObligationCandidates, deriveApplicationCandidates, deriveProcessCandidate, generatedCandidate, reviewedCandidate, graphReference, reviewedEvidenceState, addCandidate, sourceState, uniqueBy, obligationId, digest, errorMessage;
function init_ReconstructionObligationCandidates() {
	return (init_ReconstructionObligationCandidates = __esmMin((() => {
		init_evidenceBundle();
		init_processCaptureParsing();
		init_JavaScriptApplicationEvidenceGraph();
		init_ReconstructionObligationPolicies();
		init_unicodeCodePointOrder();
		deriveReconstructionObligationCandidates = (bundleInput, reviewed) => {
			const bundle = parseEvidenceBundle(bundleInput);
			const records = new Map(bundle.records.map((record) => [record.evidence_id, record]));
			const candidates = new Map();
			const limitations = new Set();
			for (const evidence of bundle.records) {
				deriveApplicationCandidates(evidence, records, candidates, limitations);
				deriveProcessCandidate(evidence, candidates, limitations);
			}
			for (const obligation of reviewed) addCandidate(candidates, reviewedCandidate(obligation, records));
			return {
				candidates: [...candidates.values()].sort((left, right) => compareUnicodeCodePoints(left.obligation_id, right.obligation_id)),
				limitations: [...limitations].sort()
			};
		};
		deriveApplicationCandidates = (evidence, records, candidates, limitations) => {
			if (![
				"analyze_javascript_application",
				"reconcile_javascript_runtime",
				"project_managed_application_graph"
			].includes(evidence.operation)) return;
			try {
				const parsed = parseApplicationGraphEvidence(evidence);
				if (!parsed.ok) {
					limitations.add(`Application Evidence ${evidence.evidence_id} could not generate candidates because it failed graph validation.`);
					return;
				}
				const source = parsed.value;
				for (const node of source.graph.nodes) {
					const candidatePolicy = applicationObligationPolicy(node.kind);
					if (candidatePolicy === undefined) {
						if (node.kind === "unknown") limitations.add(`Application graph ${source.graph.graph_id} contains unresolved node ${node.node_id}; reconstruction obligations remain unknown.`);
						continue;
					}
					const reference = node.observations.map((observation) => graphReference(evidence, records, observation.evidence, `${source.graph.graph_id}/node/${node.node_id}/observation/${observation.observation_id}`));
					addCandidate(candidates, generatedCandidate({
						key: `application:${node.node_id}:${candidatePolicy.family}`,
						title: node.observations[0]?.label ?? `${node.kind} boundary`,
						policy: candidatePolicy,
						artifactSha256: source.rootArtifactSha256,
						applicationNodeId: node.node_id,
						semanticNodeId: null,
						location: `application-graph:${source.graph.graph_id}/nodes/${node.node_id}`,
						authorityReferences: reference
					}));
				}
				if (source.semanticGraph !== null) {
					const evidenceContexts = new Map(source.semanticGraph.evidence_contexts.map((context) => [context.context_id, context]));
					for (const node of source.semanticGraph.nodes) {
						const candidatePolicy = semanticObligationPolicy(node.kind);
						if (candidatePolicy === undefined) continue;
						const evidenceContext = evidenceContexts.get(node.evidence.context_id);
						if (evidenceContext === undefined) throw new TypeError("Semantic evidence reference names an absent context");
						addCandidate(candidates, generatedCandidate({
							key: `semantic:${node.node_id}:${candidatePolicy.family}`,
							title: node.label ?? `${node.kind} semantic boundary`,
							policy: candidatePolicy,
							artifactSha256: node.identity.artifact_sha256,
							applicationNodeId: node.application_node_ids[0] ?? null,
							semanticNodeId: node.node_id,
							location: `semantic-graph:${source.semanticGraph.graph_id}/nodes/${node.node_id}`,
							authorityReferences: [graphReference(evidence, records, evidenceContext, `${source.semanticGraph.graph_id}/node/${node.node_id}`)]
						}));
					}
				}
				if (source.graph.coverage.status !== "complete") limitations.add(`Application graph ${source.graph.graph_id} coverage is ${source.graph.coverage.status}; omitted candidates remain unknown.`);
			} catch (cause) {
				limitations.add(`Application Evidence ${evidence.evidence_id} could not generate candidates: ${errorMessage(cause)}`);
			}
		};
		deriveProcessCandidate = (evidence, candidates, limitations) => {
			if (evidence.operation !== "capture_process_scenario" || evidence.predicate_type !== "rea.process-capture") return;
			try {
				const capture = parseProcessCapture(evidence.normalized_result);
				const observedCases = [
					{
						kind: capture.exit.code === 0 ? "positive" : "negative",
						evidence_id: evidence.evidence_id,
						location: "/normalized_result/exit"
					},
					{
						kind: "teardown",
						evidence_id: evidence.evidence_id,
						location: "/normalized_result/settlement"
					},
					...capture.exit.signal !== null || capture.exit.reason !== "exited" ? [{
						kind: "cancellation",
						evidence_id: evidence.evidence_id,
						location: "/normalized_result/exit"
					}] : []
				];
				if (capture.manifest.executable_sha256 === null) {
					limitations.add(`Process capture ${evidence.evidence_id} has no validated executable artifact identity; packaged-process lifecycle obligation was not bound to an artifact.`);
					return;
				}
				addCandidate(candidates, {
					obligation_id: obligationId(`process:${capture.manifest.executable_sha256}:${capture.manifest.full_scenario_sha256}`),
					obligation_version: 1,
					title: "Captured packaged-process lifecycle",
					origin: "generated",
					application_layer: "process",
					family: "packaged-process-lifecycle",
					target: {
						artifact_sha256: capture.manifest.executable_sha256,
						application_node_id: null,
						semantic_node_id: null,
						location: `/evidence/${evidence.evidence_id}/normalized_result`
					},
					authority_references: [{
						evidence_id: evidence.evidence_id,
						authority: evidence.authority,
						state: "observed",
						location: "/normalized_result"
					}],
					source_state: "observed",
					observed_cases: observedCases,
					required: true,
					required_case_kinds: [
						"positive",
						"negative",
						"cancellation",
						"teardown"
					],
					required_original_authority: "process",
					required_fixture_authority: "packaged-process",
					required_verifier_authority: "packaged-process",
					requires_parser_type: false,
					dependency_obligation_ids: [],
					residual_unknown_ids: [],
					unavailable_authority: capture.residual_unknowns.map(({ scope, reason }) => `${scope}: ${reason}`),
					required_next_evidence: capture.truncated ? ["Repeat the packaged-process capture without truncation."] : [],
					definitionCount: 1,
					disposition: "active"
				});
				if (capture.truncated) limitations.add(`Process Evidence ${evidence.evidence_id} is truncated; absence and upper bounds remain unknown.`);
			} catch (cause) {
				limitations.add(`Process Evidence ${evidence.evidence_id} could not generate candidates: ${errorMessage(cause)}`);
			}
		};
		generatedCandidate = ({ key, title, policy: candidatePolicy, artifactSha256, applicationNodeId, semanticNodeId, location, authorityReferences }) => ({
			obligation_id: obligationId(key),
			obligation_version: 1,
			title,
			origin: "generated",
			application_layer: candidatePolicy.applicationLayer,
			family: candidatePolicy.family,
			target: {
				artifact_sha256: artifactSha256,
				application_node_id: applicationNodeId,
				semantic_node_id: semanticNodeId,
				location
			},
			authority_references: authorityReferences,
			source_state: sourceState(authorityReferences),
			observed_cases: [],
			required: true,
			required_case_kinds: candidatePolicy.cases,
			required_original_authority: candidatePolicy.originalAuthority,
			required_fixture_authority: candidatePolicy.fixtureAuthority,
			required_verifier_authority: candidatePolicy.verifierAuthority,
			requires_parser_type: candidatePolicy.requiresParserType,
			dependency_obligation_ids: [],
			residual_unknown_ids: [],
			unavailable_authority: [],
			required_next_evidence: [`Obtain ${candidatePolicy.originalAuthority} authority for this finite ${candidatePolicy.family} claim.`],
			definitionCount: 1,
			disposition: "active"
		});
		reviewedCandidate = (obligation, records) => {
			const { review_evidence_ids: reviewEvidenceIds, disposition, ...definition } = obligation;
			return {
				...definition,
				origin: "reviewed",
				authority_references: reviewEvidenceIds.map((evidenceId) => {
					const evidence = records.get(evidenceId);
					if (evidence === undefined) throw new TypeError(`Reviewed obligation Evidence is missing: ${evidenceId}`);
					return {
						evidence_id: evidenceId,
						authority: evidence.authority,
						state: reviewedEvidenceState(evidence),
						location: `/evidence/${evidenceId}`
					};
				}),
				source_state: "reviewed",
				observed_cases: [],
				definitionCount: 1,
				disposition
			};
		};
		graphReference = (envelope, records, graphEvidence, location) => {
			const linkedId = graphEvidence.evidence_ids.find((evidenceId) => records.has(evidenceId)) ?? envelope.evidence_id;
			const linked = records.get(linkedId) ?? envelope;
			const runtimeAuthority = ["passive-cdp-runtime", "controlled-replay"].includes(graphEvidence.authority);
			return {
				evidence_id: linked.evidence_id,
				authority: linked.authority,
				state: runtimeAuthority && graphEvidence.state === "observed" ? "observed" : graphEvidence.state === "unknown" || graphEvidence.state === "unavailable" ? "unknown" : "candidate",
				location
			};
		};
		reviewedEvidenceState = (evidence) => {
			if (evidence.operation === "capture_process_scenario" && evidence.predicate_type === "rea.process-capture" && evidence.confidence === "observed") return "observed";
			if (evidence.authority === "external-service" && evidence.confidence === "observed") return "observed";
			if (evidence.authority === "shipped-artifact") return "candidate";
			return "reviewed";
		};
		addCandidate = (candidates, candidate) => {
			const current = candidates.get(candidate.obligation_id);
			if (current === undefined) {
				candidates.set(candidate.obligation_id, candidate);
				return;
			}
			candidates.set(candidate.obligation_id, {
				...current,
				authority_references: uniqueBy([...current.authority_references, ...candidate.authority_references], (reference) => `${reference.evidence_id}:${reference.state}:${reference.location}`),
				observed_cases: uniqueBy([...current.observed_cases, ...candidate.observed_cases], (item) => `${item.kind}:${item.evidence_id}:${item.location}`),
				source_state: sourceState([...current.authority_references, ...candidate.authority_references]),
				definitionCount: current.definitionCount + candidate.definitionCount
			});
		};
		sourceState = (references) => {
			if (references.some(({ state }) => state === "observed")) return "observed";
			if (references.some(({ state }) => state === "candidate")) return "candidate";
			if (references.some(({ state }) => state === "reviewed")) return "reviewed";
			return "unknown";
		};
		uniqueBy = (values, key) => [...new Map(values.map((value) => [key(value), value])).values()].sort((left, right) => compareUnicodeCodePoints(key(left), key(right)));
		obligationId = (key) => `obl_${digest({
			schema: "ReconstructionObligation",
			key
		})}`;
		digest = (value) => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError("Reconstruction obligation key is not canonical JSON");
			return createHash("sha256").update(encoded).digest("hex");
		};
		errorMessage = (cause) => cause instanceof Error ? cause.message : "unknown validation failure";
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationAuthority.js
var proofEvidenceAuthorities, proofAuthoritySatisfies, evidenceAuthoritySupportsProof, evidenceSupportsOriginalAuthority;
function init_ReconstructionObligationAuthority() {
	return (init_ReconstructionObligationAuthority = __esmMin((() => {
		proofEvidenceAuthorities = {
			unit: ["shipped-artifact", "controlled-replay"],
			integration: ["controlled-replay"],
			protocol: ["controlled-replay", "external-service"],
			renderer: ["controlled-replay", "external-service"],
			"packaged-process": ["controlled-replay"],
			"native-abi": ["shipped-artifact", "controlled-replay"],
			"live-observation": ["controlled-replay", "external-service"],
			external: ["external-service"]
		};
		proofAuthoritySatisfies = (actual, required) => {
			const accepted = {
				unit: [
					"unit",
					"integration",
					"protocol",
					"renderer",
					"packaged-process",
					"native-abi",
					"live-observation",
					"external"
				],
				integration: [
					"integration",
					"protocol",
					"renderer",
					"packaged-process",
					"native-abi",
					"live-observation"
				],
				protocol: [
					"protocol",
					"packaged-process",
					"live-observation"
				],
				renderer: [
					"renderer",
					"packaged-process",
					"live-observation"
				],
				"packaged-process": ["packaged-process", "live-observation"],
				"native-abi": ["native-abi"],
				"live-observation": ["live-observation"],
				external: ["external"]
			};
			return accepted[required].includes(actual);
		};
		evidenceAuthoritySupportsProof = (evidence, authority, expected) => {
			if (evidence.confidence !== "observed" || !proofEvidenceAuthorities[authority].includes(evidence.authority) || evidence.predicate_type !== "rea.reconstruction-proof" || evidence.operation !== "verify_reconstruction_obligations") return false;
			const result = evidence.normalized_result;
			if (typeof result !== "object" || result === null || Array.isArray(result)) return false;
			const includes = (key, value) => value === undefined || Array.isArray(result[key]) && result[key].includes(value);
			return result.passed === true && includes("obligation_ids", expected.obligationId) && includes("fixture_ids", expected.fixtureId) && includes("case_kinds", expected.caseKind) && includes("verifier_ids", expected.verifierId) && includes("claim_ids", expected.claimId);
		};
		evidenceSupportsOriginalAuthority = (evidence, authority) => {
			if (evidence.confidence !== "observed") return false;
			if (authority === "static") return evidence.authority === "shipped-artifact";
			if (authority === "runtime") return ["controlled-replay", "external-service"].includes(evidence.authority);
			if (authority === "process") return evidence.operation === "capture_process_scenario" && evidence.predicate_type === "rea.process-capture";
			return evidence.authority === "external-service";
		};
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationLedgerDiagnostics.js
var groupManifestBindings, groupManifestContradictions, addObligationDiagnostic, uniqueObligationDiagnostics, contradictionDiagnostics;
function init_ReconstructionObligationLedgerDiagnostics() {
	return (init_ReconstructionObligationLedgerDiagnostics = __esmMin((() => {
		init_unicodeCodePointOrder();
		groupManifestBindings = (manifest) => {
			const grouped = new Map();
			for (const binding of manifest.bindings) grouped.set(binding.obligation_id, [...grouped.get(binding.obligation_id) ?? [], binding]);
			return grouped;
		};
		groupManifestContradictions = (manifest) => {
			const grouped = new Map();
			for (const contradiction of manifest.contradictions) grouped.set(contradiction.obligation_id, [...grouped.get(contradiction.obligation_id) ?? [], ...contradiction.evidence_ids]);
			return grouped;
		};
		addObligationDiagnostic = (diagnostics, code, detail) => {
			diagnostics.push({
				code,
				detail
			});
		};
		uniqueObligationDiagnostics = (diagnostics) => [...new Map(diagnostics.map((diagnostic) => [`${diagnostic.code}:${diagnostic.detail}`, diagnostic])).values()].sort((left, right) => compareUnicodeCodePoints(`${left.code}:${left.detail}`, `${right.code}:${right.detail}`));
		contradictionDiagnostics = (obligationId, contradictions, evidenceById) => {
			const evidenceIds = contradictions.get(obligationId) ?? [];
			if (evidenceIds.length === 0) return [];
			const missing = evidenceIds.filter((evidenceId) => !evidenceById.has(evidenceId));
			return missing.length > 0 ? [{
				code: "contradiction-evidence-missing",
				detail: `Contradiction references missing Evidence: ${missing.join(", ")}.`
			}] : [{
				code: "contradiction",
				detail: "Authenticated contradictory Evidence reopens this obligation."
			}];
		};
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationOriginalCases.js
var originalCasesFor, originalCaseDiagnostics;
function init_ReconstructionObligationOriginalCases() {
	return (init_ReconstructionObligationOriginalCases = __esmMin((() => {
		init_ReconstructionObligationAuthority();
		init_unicodeCodePointOrder();
		originalCasesFor = (candidate, binding) => [...new Map([...candidate.observed_cases, ...binding?.original_cases ?? []].map((observed) => [`${observed.kind}:${observed.evidence_id}:${observed.location}`, observed])).values()].sort((left, right) => compareUnicodeCodePoints(`${left.kind}:${left.evidence_id}:${left.location}`, `${right.kind}:${right.evidence_id}:${right.location}`));
		originalCaseDiagnostics = (candidate, binding, evidenceById) => {
			const diagnostics = [];
			const originalCases = originalCasesFor(candidate, binding);
			for (const caseKind of candidate.required_case_kinds) {
				const cases = originalCases.filter(({ kind }) => kind === caseKind);
				if (cases.length === 0) {
					diagnostics.push({
						code: "missing-original-case",
						detail: `Original ${caseKind} behavior has not been observed.`
					});
					continue;
				}
				if (!cases.some(({ evidence_id: evidenceId }) => {
					const evidence = evidenceById.get(evidenceId);
					return evidence !== undefined && evidenceSupportsOriginalAuthority(evidence, candidate.required_original_authority);
				})) diagnostics.push({
					code: "weak-original-case-authority",
					detail: `Original ${caseKind} behavior lacks ${candidate.required_original_authority} Evidence.`
				});
			}
			return diagnostics;
		};
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationLedgerProjection.js
var obligationLedgerEvidenceLinks;
function init_ReconstructionObligationLedgerProjection() {
	return (init_ReconstructionObligationLedgerProjection = __esmMin((() => {
		init_reconstructionObligationLedgerIntegrity();
		init_unicodeCodePointOrder();
		obligationLedgerEvidenceLinks = (obligations, manifest) => [...new Set([
			...reconstructionObligationEvidenceIds(obligations),
			...manifest.bindings.flatMap((binding) => [
				...binding.original_cases.map(({ evidence_id: id }) => id),
				...binding.fixtures.flatMap(({ evidence_ids: ids }) => ids),
				...binding.verifier === null ? [] : [binding.verifier.result_evidence_id]
			]),
			...manifest.contradictions.flatMap(({ evidence_ids: ids }) => ids)
		])].sort(compareUnicodeCodePoints);
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationLedgerEvaluation.js
var evaluateReconstructionObligationLedger, createEvaluationContext, findOrphanManifestIds, ledgerLimitations, evaluateObligation, evaluateBinding, evaluateVerifier, evaluateAuthority, evaluateDisposition, applyDependencyDiagnostics, obligationStatus, dependencyStatus;
function init_ReconstructionObligationLedgerEvaluation() {
	return (init_ReconstructionObligationLedgerEvaluation = __esmMin((() => {
		init_evidenceBundle();
		init_reconstructionObligationLedgerSchemas();
		init_canonicalDigest();
		init_reconstructionObligationLedgerIntegrity();
		init_ReconstructionObligationAuthority();
		init_ReconstructionObligationLedgerDiagnostics();
		init_ReconstructionObligationOriginalCases();
		init_ReconstructionObligationLedgerProjection();
		init_unicodeCodePointOrder();
		evaluateReconstructionObligationLedger = ({ candidates: candidatesInput, bundle: bundleInput, manifest, generationLimitations }) => {
			const bundle = parseEvidenceBundle(bundleInput);
			const allCandidates = [...candidatesInput].sort((left, right) => compareUnicodeCodePoints(left.obligation_id, right.obligation_id));
			const orphanManifestIds = findOrphanManifestIds(allCandidates, manifest);
			const candidates = allCandidates;
			const context = createEvaluationContext(candidates, bundle, manifest);
			const obligations = applyDependencyDiagnostics(candidates.map((candidate) => evaluateObligation(candidate, context)), context);
			const ownershipGraph = reconstructionObligationOwnershipGraph(obligations);
			const dependencyGraph = reconstructionObligationDependencyGraph(obligations);
			const evidenceLinks = obligationLedgerEvidenceLinks(obligations, manifest);
			const limitations = ledgerLimitations(generationLimitations, allCandidates.length, orphanManifestIds);
			const coverage = reconstructionObligationCoverage(limitations);
			const semantic = {
				coverage,
				summary: summarizeReconstructionObligations(obligations),
				reports: reconstructionObligationReports(obligations),
				ownership_graph: ownershipGraph,
				dependency_graph: dependencyGraph,
				obligations,
				evidence_links: evidenceLinks,
				limitations
			};
			const status = reconstructionObligationLedgerStatus(obligations, limitations);
			const closureDigest = reconstructionObligationLedgerClosureDigest({
				status,
				...semantic
			});
			return reconstructionObligationLedgerSchema.parse({
				schema: "ReconstructionObligationLedger",
				ledger_id: `rol_${digestCanonicalValue({
					schema: "ReconstructionObligationLedger",
					evidence_ids: bundle.records.map(({ evidence_id: id }) => id),
					obligation_ids: obligations.map(({ obligation_id: id }) => id),
					closure_digest: closureDigest
				}, "Reconstruction obligation ledger")}`,
				closure_digest: closureDigest,
				status,
				...semantic
			});
		};
		createEvaluationContext = (candidates, bundle, manifest) => ({
			candidates: new Map(candidates.map((candidate) => [candidate.obligation_id, candidate])),
			evidence: new Map(bundle.records.map((evidence) => [evidence.evidence_id, evidence])),
			bindings: groupManifestBindings(manifest),
			contradictions: groupManifestContradictions(manifest)
		});
		findOrphanManifestIds = (candidates, manifest) => {
			const candidateIds = new Set(candidates.map(({ obligation_id: obligationId }) => obligationId));
			return [...new Set([...manifest.bindings.map(({ obligation_id: obligationId }) => obligationId), ...manifest.contradictions.map(({ obligation_id: obligationId }) => obligationId)].filter((obligationId) => !candidateIds.has(obligationId)))].sort();
		};
		ledgerLimitations = (generationLimitations, candidateCount, orphanManifestIds) => [...new Set([
			...generationLimitations,
			...candidateCount === 0 ? ["No reconstruction obligations were derived; closure cannot be claimed."] : [],
			...orphanManifestIds.length > 0 ? [`Manifest entries reference unknown obligations: ${orphanManifestIds.join(", ")}.`] : []
		])].sort();
		evaluateObligation = (candidate, context) => {
			const bindings = context.bindings.get(candidate.obligation_id) ?? [];
			const binding = bindings.length === 1 ? bindings[0] ?? null : null;
			const diagnostics = [];
			if (candidate.definitionCount > 1) addObligationDiagnostic(diagnostics, "duplicate-definition", "Multiple candidate definitions share this obligation ID.");
			if (bindings.length === 0) addObligationDiagnostic(diagnostics, "missing-owner", "No reconstruction manifest binding owns this obligation.");
			if (bindings.length > 1) addObligationDiagnostic(diagnostics, "ambiguous-owner", "Multiple reconstruction manifest bindings claim this obligation.");
			if (binding !== null) evaluateBinding(candidate, binding, context, diagnostics);
			diagnostics.push(...originalCaseDiagnostics(candidate, binding, context.evidence));
			evaluateAuthority(candidate, binding, context, diagnostics);
			evaluateDisposition(candidate, diagnostics);
			diagnostics.push(...contradictionDiagnostics(candidate.obligation_id, context.contradictions, context.evidence));
			for (const unknownId of candidate.residual_unknown_ids) addObligationDiagnostic(diagnostics, "residual-unknown", `Residual unknown remains visible: ${unknownId}.`);
			for (const unavailable of candidate.unavailable_authority) addObligationDiagnostic(diagnostics, "unavailable-authority", unavailable);
			return {
				obligation_id: candidate.obligation_id,
				obligation_version: candidate.obligation_version,
				title: candidate.title,
				origin: candidate.origin,
				application_layer: candidate.application_layer,
				family: candidate.family,
				target: candidate.target,
				authority_references: candidate.authority_references,
				source_state: candidate.source_state,
				observed_cases: originalCasesFor(candidate, binding),
				required: candidate.required,
				required_case_kinds: candidate.required_case_kinds,
				required_original_authority: candidate.required_original_authority,
				required_fixture_authority: candidate.required_fixture_authority,
				required_verifier_authority: candidate.required_verifier_authority,
				requires_parser_type: candidate.requires_parser_type,
				dependency_obligation_ids: candidate.dependency_obligation_ids,
				residual_unknown_ids: candidate.residual_unknown_ids,
				unavailable_authority: candidate.unavailable_authority,
				required_next_evidence: candidate.required_next_evidence,
				binding,
				status: obligationStatus(candidate, binding, diagnostics),
				diagnostics: uniqueObligationDiagnostics(diagnostics)
			};
		};
		evaluateBinding = (candidate, binding, context, diagnostics) => {
			if (candidate.requires_parser_type && binding.parser_type === null) addObligationDiagnostic(diagnostics, "missing-parser-type", "This boundary requires an explicit parser, schema, and domain type.");
			for (const caseKind of candidate.required_case_kinds) {
				const fixtures = binding.fixtures.filter(({ case_kind: fixtureCase }) => fixtureCase === caseKind);
				if (fixtures.length === 0) {
					addObligationDiagnostic(diagnostics, "missing-case", `Required ${caseKind} fixture is missing.`);
					continue;
				}
				if (!fixtures.some((fixture) => proofAuthoritySatisfies(fixture.authority, candidate.required_fixture_authority) && fixture.evidence_ids.every((id) => {
					const evidence = context.evidence.get(id);
					return evidence !== undefined && evidenceAuthoritySupportsProof(evidence, fixture.authority, {
						obligationId: candidate.obligation_id,
						fixtureId: fixture.fixture_id,
						caseKind: fixture.case_kind
					});
				}))) addObligationDiagnostic(diagnostics, "weak-fixture-authority", `${caseKind} fixture lacks ${candidate.required_fixture_authority} authority or authenticated Evidence.`);
			}
			evaluateVerifier(candidate, binding, context, diagnostics);
		};
		evaluateVerifier = (candidate, binding, context, diagnostics) => {
			const verifier = binding.verifier;
			if (verifier === null) {
				addObligationDiagnostic(diagnostics, "missing-verifier", "No verifier claim is bound to this obligation.");
				return;
			}
			if (!verifier.enumerated_obligation_ids.includes(candidate.obligation_id)) addObligationDiagnostic(diagnostics, "verifier-does-not-enumerate", "The verifier claim does not enumerate this obligation ID.");
			const resultEvidence = context.evidence.get(verifier.result_evidence_id);
			if (resultEvidence === undefined) addObligationDiagnostic(diagnostics, "missing-verifier-result", "The latest verifier result Evidence is absent from the bundle.");
			if (!proofAuthoritySatisfies(verifier.authority, candidate.required_verifier_authority) || resultEvidence !== undefined && !evidenceAuthoritySupportsProof(resultEvidence, verifier.authority, {
				obligationId: candidate.obligation_id,
				verifierId: verifier.verifier_id,
				claimId: verifier.claim_id
			})) addObligationDiagnostic(diagnostics, "weak-verifier-authority", `Verifier authority does not satisfy ${candidate.required_verifier_authority}.`);
			if (verifier.status !== "pass") addObligationDiagnostic(diagnostics, "verifier-failed", `Latest verifier status is ${verifier.status}.`);
		};
		evaluateAuthority = (candidate, binding, context, diagnostics) => {
			const referenceSatisfied = candidate.authority_references.some((reference) => {
				const evidence = context.evidence.get(reference.evidence_id);
				return evidence !== undefined && (candidate.required_original_authority === "static" ? ["candidate", "observed"].includes(reference.state) : reference.state === "observed") && evidenceSupportsOriginalAuthority(evidence, candidate.required_original_authority);
			});
			const caseSatisfied = originalCasesFor(candidate, binding).some(({ evidence_id: evidenceId }) => {
				const evidence = context.evidence.get(evidenceId);
				return evidence !== undefined && evidenceSupportsOriginalAuthority(evidence, candidate.required_original_authority);
			});
			const satisfied = referenceSatisfied || caseSatisfied;
			if (!satisfied) addObligationDiagnostic(diagnostics, "static-only", `No ${candidate.required_original_authority} authority characterizes the original finite behavior.`);
		};
		evaluateDisposition = (candidate, diagnostics) => {
			if (candidate.disposition === "blocked") addObligationDiagnostic(diagnostics, "blocked", "Reviewed disposition marks this obligation blocked.");
			if (candidate.disposition === "out-of-scope") addObligationDiagnostic(diagnostics, "out-of-scope", "Reviewed disposition marks this obligation out of scope; it remains visible.");
		};
		applyDependencyDiagnostics = (obligations, context) => {
			let evaluated = [...obligations];
			for (let pass = 0; pass < obligations.length; pass += 1) {
				const statuses = new Map(evaluated.map(({ obligation_id: id, status }) => [id, status]));
				let changed = false;
				evaluated = evaluated.map((obligation) => {
					const diagnostics = [...obligation.diagnostics];
					for (const dependencyId of obligation.dependency_obligation_ids) {
						const missing = !context.candidates.has(dependencyId);
						if (missing || statuses.get(dependencyId) !== "verified") addObligationDiagnostic(diagnostics, missing ? "dependency-missing" : "dependency-open", `Dependency obligation is ${missing ? "missing" : "not verified"}: ${dependencyId}.`);
					}
					const normalized = uniqueObligationDiagnostics(diagnostics);
					const status = dependencyStatus(obligation.status, normalized);
					changed ||= status !== obligation.status;
					return {
						...obligation,
						status,
						diagnostics: normalized
					};
				});
				if (!changed) break;
			}
			return evaluated;
		};
		obligationStatus = (candidate, binding, diagnostics) => {
			if (hasReconstructionObligationDiagnostic(diagnostics, "out-of-scope")) return "out-of-scope";
			if (hasReconstructionObligationDiagnostic(diagnostics, "blocked")) return "blocked";
			if (hasReconstructionObligationDiagnostic(diagnostics, "contradiction")) return "contradicted";
			if (hasReconstructionObligationDiagnostic(diagnostics, "duplicate-definition") || hasReconstructionObligationDiagnostic(diagnostics, "residual-unknown") || hasReconstructionObligationDiagnostic(diagnostics, "unavailable-authority")) return "unknown";
			if (binding === null) return "unowned";
			if (diagnostics.length === 0) return "verified";
			return "implemented";
		};
		dependencyStatus = (status, diagnostics) => (hasReconstructionObligationDiagnostic(diagnostics, "dependency-missing") || hasReconstructionObligationDiagnostic(diagnostics, "dependency-open")) && !["contradicted", "out-of-scope"].includes(status) ? "blocked" : status;
	})))();
}

//#endregion
//#region dist/application/ReconstructionObligationLedgerService.js
var OPERATION, resolveReconstructionObligationLedgerRequest, buildReconstructionObligationLedgerEvidenceValidated, createLedgerEvidence;
function init_ReconstructionObligationLedgerService() {
	return (init_ReconstructionObligationLedgerService = __esmMin((() => {
		init_analysisErrorCore();
		init_evidenceBundle();
		init_evidence();
		init_jsonValue();
		init_reconstructionObligationLedgerSchemas();
		init_result();
		init_workflowInputError();
		init_InvestigationProviders();
		init_ReconstructionObligationCandidates();
		init_ReconstructionObligationLedgerEvaluation();
		OPERATION = "build_reconstruction_obligation_ledger";
		resolveReconstructionObligationLedgerRequest = (input) => {
			const parsed = reconstructionObligationLedgerInputSchema.safeParse(input);
			return parsed.success ? ok(parsed.data) : err(requestInputError(OPERATION, parsed.error, input));
		};
		buildReconstructionObligationLedgerEvidenceValidated = (input) => {
			try {
				const generated = deriveReconstructionObligationCandidates(input.evidence_bundle, input.reviewed_obligations);
				const ledger = evaluateReconstructionObligationLedger({
					candidates: generated.candidates,
					bundle: input.evidence_bundle,
					manifest: input.manifest,
					generationLimitations: generated.limitations
				});
				return ok(createLedgerEvidence(input, ledger));
			} catch (cause) {
				if (cause instanceof NonCanonicalEvidenceBundleError) return err(workflowInputError(OPERATION, cause));
				if (cause instanceof z.ZodError) return err(workflowInputError(OPERATION, cause));
				return err(new AnalysisProtocolError("Reconstruction obligation ledger generation failed", { cause }));
			}
		};
		createLedgerEvidence = (input, ledger) => {
			const completeLedger = reconstructionObligationLedgerSchema.parse(ledger);
			return createEvidence(undefined, JAVASCRIPT_APPLICATION_WORKFLOW_PROVIDER, {
				predicateType: "rea.reconstruction-obligation-ledger",
				operation: OPERATION,
				parameters: jsonObjectSchema.parse({
					ledger_id: completeLedger.ledger_id,
					closure_digest: completeLedger.closure_digest
				}),
				result: jsonValueSchema.parse(completeLedger),
				rawResult: null,
				confidence: "inferred",
				authority: "analyst-inference",
				environment: null,
				limitations: completeLedger.limitations,
				evidenceLinks: completeLedger.evidence_links
			});
		};
	})))();
}

//#endregion
init_ReconstructionObligationLedgerService();
export { buildReconstructionObligationLedgerEvidenceValidated };