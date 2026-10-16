import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, d as AnalysisUnsupportedTargetError, f as init_analysisErrorCore, g as init_result, h as err, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, m as init_analysisErrorBase, o as AnalysisInputError, p as AnalysisError } from "./analysisErrorCore-DXRTvF_m.js";
import { n as safeParseJson, t as init_safeJson } from "./safeJson-NeGfpkrI.js";
import { c as jsonValueSchema, o as init_jsonValue } from "./digests-BFoWUT_-.js";
import { n as compositeKey, r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { i as jsonParts, r as init_jsonSerialization } from "./jsonSerialization-V-wWiFRE.js";
import { n as init_canonicalDigest, t as digestCanonicalValue } from "./canonicalDigest-Bi_0_zGi.js";
import { n as readPngHeaderDimensions, o as resolveJavaScriptSourceMapUrl, r as init_javascriptSourceMapPaths, t as init_pngHeader } from "./pngHeader-DQ-ObyY2.js";
import { c as init_browserObservation$1, h as sanitizeEndpointCandidate, m as sanitizeBrowserUrl, n as init_webContentArtifact, t as createWebTextArtifact } from "./webContentArtifact-Dzjc1z-R.js";
import { a as inferJsonShape, i as webPageInspectionSchema, o as init_jsonShape, r as init_browserObservationSchemas, t as browserTargetListSchema } from "./browserObservationSchemas-tgqjH7aA.js";
import { a as createWebScreenshotArtifact, l as webScreenshotDiffSchema, o as decodeCanonicalBase64, s as init_webScreenshot, u as webScreenshotSchema } from "./emptyArraySchema-tL6Qymyd.js";
import { At as init_javascriptAstValues, C as init_javascriptSemanticAnalysis, D as parseJavaScriptSource, E as init_javascriptSourceParser, H as isTypeOnlyExportDeclaration, Ht as init_javascriptSemanticTraversal, It as semanticStaticPropertyName, Nt as readExactJavaScriptLiteral, T as init_javascriptRpcEndpoints, Ut as traverseJavaScriptAst, V as init_javascriptModuleDeclaration, Vt as completeSemanticSteps, W as isTypeOnlyImportDeclaration, Xt as compareBrowserCaptures, Yt as browserCaptureComparisonSchema, Zt as init_browserCaptureComparison, an as webObservationSessionSchema, b as classifyParsedJavaScriptRpcClientRootsSteps, cn as webBundleAnalysisSchema, ct as calleeName, dt as endpointArgument, g as analyzeParsedJavaScriptReferences, kt as stringValue, ln as webSourceMapsSchema, mt as init_javascriptStaticAnalysisHelpers, n as init_webSourceLocation, nn as webMcpDiscoverySchema, rn as init_browserSession, sn as init_webBundleAnalysis, t as WEB_SOURCE_MAP_LIMITS, tn as init_webMcpDiscovery, v as classifyParsedJavaScriptOpenReceivers, w as createJavaScriptRpcScan } from "./webSourceLocation-DbMAT2J9.js";
import { a as init_providerIdentities, t as CDP_BROWSER_PROVIDER_IDENTITY } from "./providerIdentities--ptAh481.js";
import { a as init_CdpTargetEvents, c as authorizeCdpTarget, i as cdpTargetEventMatches, l as init_CdpAuthorizedTarget, n as init_sourceMapEnvelope, o as authorizedMainFrame, r as sourceMapJsonText, s as init_CdpAuthorizedMainFrame } from "./sourceMapEnvelope-C0uJlrOh.js";
import { a as isHttpUrl, c as recordsValue, d as scriptMetadataValues, f as sourceExcluded, i as init_CdpCaptureValues, n as cdpStringValue, o as numberValue, p as sourceResult, r as delayWithCancellation, s as recordValue, t as allowedSanitizedUrl, u as requiredScriptSource } from "./CdpCaptureValues-M-j6CIh1.js";
import { _ as integerOrNull$1, a as init_CdpCaptureDocuments, b as isMainFrameNavigation, c as capturedSvgNodeKind, d as decodeBase64$1, f as exclusionReasonForUrl, g as initiatorLocation, h as init_CdpCaptureEventHelpers, i as captureResources, l as init_CdpCaptureDomSvg, m as firstCallFrame, n as captureDom, o as mainFrameUrl, p as executionContextKey, r as captureFrames, s as walkFrameTrees, t as captureAccessibility, u as consolePrimitive, v as isJsonContentType, y as isJsonMediaType } from "./CdpCaptureDocuments-HDiF2O7k.js";
import { c as hasCdpTargetWebSocket, i as init_CdpCommandRejection, l as init_CdpEndpoint, n as init_CdpConnection, r as CdpCommandRejection } from "./CdpConnection-BpDfz4MK.js";
import { a as openCdpTargetSession, i as openCdpEndpoint, n as closeCdpTargetSession, r as init_CdpTargetSession, t as attachCdpTargetSession } from "./CdpTargetSession-BsPoKhEU.js";
import { i as init_CdpCaptureCompleteness, n as optionalCdpCommand, r as CdpCaptureCompleteness, t as init_CdpOptionalCommand } from "./CdpOptionalCommand-BPjRD9Kz.js";
import { z } from "zod";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";
import { TraceMap, decodedMappings } from "@jridgewell/trace-mapping";
import * as t from "@babel/types";
import { constants, crc32, inflateSync } from "node:zlib";

//#region dist/domain/webBundleAnalyzerAst.js
var objectValue, objectString, isUrlLikeModuleSpecifier, resolveSpecifier, location, locationFields;
function init_webBundleAnalyzerAst() {
	return (init_webBundleAnalyzerAst = __esmMin((() => {
		init_browserObservation$1();
		init_javascriptAstValues();
		objectValue = (object, name) => {
			let value;
			for (const property of object.properties) {
				if (t.isSpreadElement(property)) {
					value = undefined;
					continue;
				}
				const key = semanticStaticPropertyName(property.key, property.computed);
				if (key === "" && !t.isStringLiteral(property.key)) value = undefined;
				else if (key === name) value = t.isObjectProperty(property) ? property.value : undefined;
			}
			return value;
		};
		objectString = (object, name) => {
			const value = objectValue(object, name);
			if (value === undefined) return undefined;
			const literal = readExactJavaScriptLiteral(value);
			return literal.found && typeof literal.value === "string" ? literal.value : undefined;
		};
		isUrlLikeModuleSpecifier = (specifier) => specifier.startsWith("/") || specifier.startsWith("./") || specifier.startsWith("../") || /^[A-Za-z][A-Za-z0-9+.-]*:/u.test(specifier);
		resolveSpecifier = (specifier, base) => {
			try {
				const resolved = new URL(specifier, base);
				if (resolved.protocol !== "http:" && resolved.protocol !== "https:") return null;
				return sanitizeBrowserUrl(resolved.href).url;
			} catch (cause) {
				void cause;
				return null;
			}
		};
		location = (scriptKey, node) => ({
			script_key: scriptKey,
			...locationFields(node)
		});
		locationFields = (node) => ({
			line: node.loc?.start.line ?? null,
			column: node.loc?.start.column ?? null
		});
	})))();
}

//#endregion
//#region dist/domain/webBundleAnalyzerInspection.js
var analyzeScript, inspectNode, inspectCall, inspectRouteProperty, addEdge, addEndpointCandidate, addFinding, addWebMcpDeclaration, detectVendorFingerprints, addRouteFrameworkInference, addUnique, basis, emptyAccumulator, isIncludedScript, routeCallNames, vendorDetectors;
function init_webBundleAnalyzerInspection() {
	return (init_webBundleAnalyzerInspection = __esmMin((() => {
		init_browserObservation$1();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticAnalysis();
		init_javascriptAstValues();
		init_javascriptStaticAnalysisHelpers();
		init_webBundleAnalyzerAst();
		init_javascriptRpcEndpoints();
		init_javascriptSourceParser();
		analyzeScript = (script, accumulator) => {
			const file = parseJavaScriptSource(script.source.artifact.text);
			if (file === null) {
				accumulator.failedScripts.push(script.script_key);
				return;
			}
			accumulator.parsedScripts += 1;
			if ((file.errors?.length ?? 0) > 0) accumulator.recoveredScripts.push(script.script_key);
			detectVendorFingerprints(script, accumulator);
			const openReceiverFacts = classifyParsedJavaScriptOpenReceivers(file);
			const rpc = createJavaScriptRpcScan(script.source.artifact.text, completeSemanticSteps(classifyParsedJavaScriptRpcClientRootsSteps(file)));
			traverseJavaScriptAst(file, { enter: (node) => {
				accumulator.visitedNodes += 1;
				inspectNode(script, node, accumulator, openReceiverFacts);
				const endpoint = rpc.inspect(node);
				if (endpoint !== undefined) addFinding({
					collection: accumulator.endpoints,
					script,
					rawValue: endpoint.value,
					mechanism: endpoint.mechanism,
					node,
					accumulator
				});
			} });
		};
		inspectNode = (script, node, accumulator, openReceiverFacts) => {
			if ((t.isImportDeclaration(node) || t.isExportAllDeclaration(node)) && node.source !== undefined) addEdge({
				script,
				specifier: node.source.value,
				kind: "static_import",
				node,
				accumulator
			});
			else if (t.isExportNamedDeclaration(node) && node.source != null) addEdge({
				script,
				specifier: node.source.value,
				kind: "static_import",
				node,
				accumulator
			});
			else if (t.isImportExpression(node)) {
				const specifier = stringValue(node.source);
				if (specifier !== undefined) addEdge({
					script,
					specifier,
					kind: "dynamic_import",
					node,
					accumulator
				});
			}
			if (t.isObjectProperty(node)) inspectRouteProperty(script, node, accumulator);
			if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) inspectCall(script, node, accumulator, openReceiverFacts);
		};
		inspectCall = (script, node, accumulator, openReceiverFacts) => {
			const name = calleeName(node.callee);
			const first = stringValue(node.arguments[0]);
			if ((name === "require" || name.endsWith(".require")) && first !== undefined) addEdge({
				script,
				specifier: first,
				kind: "require",
				node,
				accumulator
			});
			if (name === "importScripts" || name.endsWith(".importScripts")) for (const argument of node.arguments) {
				const specifier = stringValue(argument);
				if (specifier === undefined) continue;
				addEdge({
					script,
					specifier,
					kind: "worker_import",
					node,
					accumulator
				});
			}
			if (routeCallNames.some((candidate) => name === candidate || name.endsWith(`.${candidate}`))) {
				if (first !== undefined) addFinding({
					collection: accumulator.routes,
					script,
					rawValue: first,
					mechanism: `call:${name}`,
					node,
					accumulator
				});
				addRouteFrameworkInference({
					script,
					name,
					node,
					accumulator
				});
			}
			const endpoint = endpointArgument(name, node.arguments, node.callee, openReceiverFacts.get(node.start ?? -1));
			if (endpoint?.kind === "candidate") addEndpointCandidate(script, node, name, endpoint.value, accumulator);
			else if (endpoint !== undefined) addFinding({
				collection: accumulator.endpoints,
				script,
				rawValue: endpoint.value,
				mechanism: `call:${name}`,
				node,
				accumulator
			});
			if (name.endsWith("modelContext.registerTool") || name === "modelContext.registerTool") addWebMcpDeclaration(script, node, accumulator);
		};
		inspectRouteProperty = (script, node, accumulator) => {
			const key = semanticStaticPropertyName(node.key, node.computed);
			const route = stringValue(node.value);
			if ((key === "path" || key === "route") && route !== undefined) addFinding({
				collection: accumulator.routes,
				script,
				rawValue: route,
				mechanism: `property:${key}`,
				node,
				accumulator
			});
		};
		addEdge = (context) => {
			const key = `edge\0${context.script.script_key}\0${context.kind}\0${context.specifier}`;
			addUnique(context.accumulator, key, () => context.accumulator.edges.push({
				from_script_key: context.script.script_key,
				kind: context.kind,
				specifier: context.specifier,
				resolved_url: context.kind === "worker_import" || isUrlLikeModuleSpecifier(context.specifier) ? resolveSpecifier(context.specifier, context.script.url) : null,
				location: location(context.script.script_key, context.node)
			}));
		};
		addEndpointCandidate = (script, node, name, rawValue, accumulator) => {
			const value = sanitizeEndpointCandidate(rawValue);
			const detector = `call:${name}:unverified-network-receiver`;
			const key = compositeKey([
				"endpoint-candidate",
				script.script_key,
				value,
				detector
			]);
			addUnique(accumulator, key, () => accumulator.inferences.push({
				kind: "endpoint_candidate",
				value,
				confidence: "low",
				basis: [{
					...basis(script, detector),
					...locationFields(node)
				}]
			}));
		};
		addFinding = (context) => {
			const value = sanitizeEndpointCandidate(context.rawValue);
			const key = `finding\0${context.mechanism}\0${context.script.script_key}\0${value}`;
			addUnique(context.accumulator, key, () => context.collection.push({
				value,
				mechanism: context.mechanism,
				location: location(context.script.script_key, context.node)
			}));
		};
		addWebMcpDeclaration = (script, node, accumulator) => {
			const declaration = node.arguments[0];
			if (!t.isObjectExpression(declaration)) return;
			const name = objectString(declaration, "name");
			const description = objectString(declaration, "description");
			const schema = objectValue(declaration, "inputSchema") ?? objectValue(declaration, "input_schema");
			const declaredProperties = t.isObjectExpression(schema) ? objectValue(schema, "properties") : undefined;
			const propertyObject = t.isObjectExpression(declaredProperties) ? declaredProperties : schema;
			const schemaPropertyNames = t.isObjectExpression(propertyObject) ? propertyObject.properties.flatMap((property) => t.isObjectProperty(property) ? [semanticStaticPropertyName(property.key, property.computed)].filter(Boolean) : []) : [];
			const metadata = {
				name: name ?? null,
				description: description ?? null,
				schema_property_names: [...new Set(schemaPropertyNames)].sort()
			};
			const key = compositeKey([
				"webmcp",
				script.script_key,
				metadata
			]);
			addUnique(accumulator, key, () => accumulator.webMcp.push({
				...metadata,
				trust: "page-declared-untrusted",
				location: location(script.script_key, node)
			}));
		};
		detectVendorFingerprints = (script, accumulator) => {
			const text = script.source.artifact.text;
			for (const detector of vendorDetectors) {
				if (!detector.patterns.some((pattern) => text.includes(pattern))) continue;
				const key = `vendor\0${script.script_key}\0${detector.value}`;
				addUnique(accumulator, key, () => accumulator.inferences.push({
					kind: detector.kind,
					value: detector.value,
					confidence: detector.confidence,
					basis: [basis(script, detector.detector)]
				}));
			}
		};
		addRouteFrameworkInference = (context) => {
			const value = context.name.endsWith("useRoutes") || context.name.endsWith("createBrowserRouter") ? "React Router-compatible route API" : "Generic route registration API";
			const key = `route-framework\0${context.script.script_key}\0${value}`;
			addUnique(context.accumulator, key, () => context.accumulator.inferences.push({
				kind: "route_framework",
				value,
				confidence: "medium",
				basis: [{
					...basis(context.script, `call:${context.name}`),
					...locationFields(context.node)
				}]
			}));
		};
		addUnique = (accumulator, key, add) => {
			if (accumulator.seen.has(key)) return;
			accumulator.seen.add(key);
			add();
		};
		basis = (script, detector) => ({
			script_key: script.script_key,
			artifact_sha256: script.source.artifact.sha256,
			line: null,
			column: null,
			detector
		});
		emptyAccumulator = () => ({
			edges: [],
			routes: [],
			endpoints: [],
			webMcp: [],
			inferences: [],
			seen: new Set(),
			visitedNodes: 0,
			parsedScripts: 0,
			failedScripts: [],
			recoveredScripts: []
		});
		isIncludedScript = (script) => script.source.included;
		routeCallNames = [
			"route",
			"addRoute",
			"useRoutes",
			"createBrowserRouter",
			"createHashRouter"
		];
		vendorDetectors = [
			{
				value: "webpack",
				detector: "webpack-runtime",
				patterns: ["__webpack_require__"],
				confidence: "high",
				kind: "bundle_runtime"
			},
			{
				value: "Vite",
				detector: "vite-runtime",
				patterns: ["__vite__", "import.meta.hot"],
				confidence: "medium",
				kind: "bundle_runtime"
			},
			{
				value: "React",
				detector: "react-runtime",
				patterns: ["__REACT_DEVTOOLS_GLOBAL_HOOK__", "React.createElement"],
				confidence: "medium",
				kind: "vendor_fingerprint"
			},
			{
				value: "Vue",
				detector: "vue-runtime",
				patterns: ["__VUE__", "createApp("],
				confidence: "medium",
				kind: "vendor_fingerprint"
			},
			{
				value: "Next.js",
				detector: "next-runtime",
				patterns: ["__NEXT_DATA__", "/_next/"],
				confidence: "high",
				kind: "vendor_fingerprint"
			},
			{
				value: "Angular",
				detector: "angular-runtime",
				patterns: ["ɵɵdefineComponent"],
				confidence: "high",
				kind: "vendor_fingerprint"
			},
			{
				value: "Svelte",
				detector: "svelte-runtime",
				patterns: ["svelte/internal"],
				confidence: "medium",
				kind: "vendor_fingerprint"
			}
		];
	})))();
}

//#endregion
//#region dist/domain/webBundleAnalyzerResult.js
var buildWebBundleAnalysis, buildCaptureObservation, sourceArtifact, chunkNode, buildUnknowns, captureBudgetOmission, captureBudgetReason, buildCompleteness, bundleLimitations;
function init_webBundleAnalyzerResult() {
	return (init_webBundleAnalyzerResult = __esmMin((() => {
		init_webBundleAnalysis();
		buildWebBundleAnalysis = (inspection, sourceScripts, sourceMaps, accumulator) => {
			const unavailable = inspection.scripts.items.filter((script) => !script.source.included).map(({ script_key }) => script_key);
			const omittedScripts = captureBudgetOmission(inspection, "scripts");
			const omittedSourceMaps = sourceMaps.status === "not_requested" ? undefined : captureBudgetOmission(inspection, "source_maps");
			const sourceMapIncomplete = sourceMaps.status === "partial" || sourceMaps.status === "unavailable";
			const partial = accumulator.failedScripts.length > 0 || accumulator.recoveredScripts.length > 0 || unavailable.length > 0 || sourceMapIncomplete || omittedScripts !== undefined || omittedSourceMaps !== undefined;
			return webBundleAnalysisSchema.parse({
				capture: buildCaptureObservation(inspection, sourceScripts),
				observations: {
					chunks: {
						nodes: sourceScripts.map(chunkNode),
						edges: accumulator.edges
					},
					routes: accumulator.routes,
					endpoints: accumulator.endpoints,
					webmcp_declarations: accumulator.webMcp,
					source_maps: sourceMaps
				},
				inferences: accumulator.inferences,
				unknowns: buildUnknowns({
					unavailable,
					failedScripts: accumulator.failedScripts,
					recoveredScripts: accumulator.recoveredScripts,
					sourceMaps,
					omittedScripts,
					omittedSourceMaps
				}),
				completeness: buildCompleteness({
					partial,
					parsedScripts: accumulator.parsedScripts,
					parseFailures: accumulator.failedScripts.length,
					visitedNodes: accumulator.visitedNodes
				}),
				limitations: bundleLimitations()
			});
		};
		buildCaptureObservation = (inspection, sourceScripts) => ({
			target_url: inspection.target.url,
			scripts_observed: inspection.scripts.total,
			scripts_analyzed: sourceScripts.length,
			source_artifacts: sourceScripts.map(sourceArtifact)
		});
		sourceArtifact = (script) => {
			if (!script.source.included) throw new TypeError("Filtered source changed");
			const { text: _text, ...artifact } = script.source.artifact;
			return {
				...artifact,
				text_available: true
			};
		};
		chunkNode = (script) => {
			if (!script.source.included) throw new TypeError("Filtered source changed");
			return {
				script_key: script.script_key,
				url: script.url,
				artifact_sha256: script.source.artifact.sha256,
				bytes: script.source.artifact.bytes
			};
		};
		buildUnknowns = (input) => [
			...input.omittedScripts === undefined ? [] : [{
				dimension: "script_inventory",
				reason: captureBudgetReason("script records", input.omittedScripts),
				affected_script_keys: []
			}],
			...input.unavailable.length === 0 ? [] : [{
				dimension: "script_source",
				reason: "Source artifact was not captured",
				affected_script_keys: input.unavailable
			}],
			...input.failedScripts.length === 0 ? [] : [{
				dimension: "javascript_ast",
				reason: "One or more source artifacts could not be parsed",
				affected_script_keys: [...input.failedScripts]
			}],
			...input.recoveredScripts.length === 0 ? [] : [{
				dimension: "javascript_ast",
				reason: "The parser recovered from errors in one or more source artifacts; findings may be incomplete",
				affected_script_keys: [...input.recoveredScripts]
			}],
			...input.omittedSourceMaps === undefined ? [] : [{
				dimension: "source_maps",
				reason: captureBudgetReason("source-map declarations", input.omittedSourceMaps),
				affected_script_keys: []
			}],
			...input.sourceMaps.status === "not_requested" || input.sourceMaps.status === "included" ? [] : [{
				dimension: "source_maps",
				reason: input.sourceMaps.limitation ?? "One or more requested source maps were unavailable or incomplete",
				affected_script_keys: input.sourceMaps.items.filter(({ status }) => status !== "included").map(({ script_key }) => script_key).sort()
			}]
		];
		captureBudgetOmission = (inspection, section) => {
			const exclusions = inspection.completeness.excluded.filter((exclusion) => exclusion.section === section && exclusion.reason === "resource_budget_exhausted");
			if (exclusions.length === 0) return undefined;
			if (exclusions.some(({ count }) => count === null)) return null;
			return exclusions.reduce((sum, { count }) => sum + (count ?? 0), 0);
		};
		captureBudgetReason = (label, count) => count === null ? `Capture omitted an unknown number of ${label} because its resource budget was exhausted.` : `Capture omitted ${String(count)} ${label} because its resource budget was exhausted.`;
		buildCompleteness = (input) => ({
			status: input.partial ? "partial" : "complete",
			parsed_scripts: input.parsedScripts,
			parse_failures: input.parseFailures,
			visited_ast_nodes: input.visitedNodes
		});
		bundleLimitations = () => [
			"Static bundle findings are observations or bounded inferences; REA does not execute captured JavaScript.",
			"Bare string arguments of unbound HTTP-method-named calls are low-confidence endpoint candidates; form, translation, storage and other APIs can use the same syntax. URL-shaped findings still do not prove network execution.",
			"Endpoint candidates are deduplicated by script, value and detector; basis retains only the first matching source coordinate. They are not a complete call-site inventory or a runtime occurrence count. completeness.status=\"complete\" describes examination of captured source, not a call-site census.",
			"String-built routes and endpoints, encrypted configuration, and server-side behavior may remain unknown.",
			"Page-declared WebMCP metadata is untrusted and is never registered or invoked as an REA tool."
		];
	})))();
}

//#endregion
//#region dist/domain/webBundleAnalyzer.js
var analyzeCapturedWebBundle;
function init_webBundleAnalyzer() {
	return (init_webBundleAnalyzer = __esmMin((() => {
		init_webBundleAnalyzerInspection();
		init_webBundleAnalyzerResult();
		analyzeCapturedWebBundle = (inspection, sourceMaps = {
			status: "not_requested",
			requested: 0,
			processed: 0,
			items: []
		}) => {
			const accumulator = emptyAccumulator();
			const sourceScripts = inspection.scripts.items.filter(isIncludedScript);
			for (const script of sourceScripts) analyzeScript(script, accumulator);
			return buildWebBundleAnalysis(inspection, sourceScripts, sourceMaps, accumulator);
		};
	})))();
}

//#endregion
//#region dist/domain/webInventory.js
var stableWebResources, reconcileWebScript, reconcileCapturedWebScript, stableWebScriptKey, uniqueResourceKeys, digest$1;
function init_webInventory() {
	return (init_webInventory = __esmMin((() => {
		init_unicodeCodePointOrder();
		stableWebResources = (resources) => {
			const keyed = resources.map((resource) => ({
				...resource,
				resource_key: `res_${digest$1(resource)}`
			}));
			return [...new Map(keyed.map((resource) => [resource.resource_key, resource])).values()].sort((left, right) => compareUnicodeCodePoints(left.resource_key, right.resource_key) || compareUnicodeCodePoints(left.url, right.url));
		};
		reconcileWebScript = (script, resources) => {
			const candidates = resources.filter((resource) => resource.url === script.url);
			if (candidates.length === 1) return {
				status: "exact",
				resource_key: candidates[0]?.resource_key ?? ""
			};
			if (candidates.length > 1) return {
				status: "ambiguous",
				candidate_resource_keys: uniqueResourceKeys(candidates)
			};
			return {
				status: "unmatched",
				reason: "no_exact_sanitized_url"
			};
		};
		reconcileCapturedWebScript = (script, rawResources, resources) => {
			const exact = rawResources.filter((resource) => resource.rawUrl === script.rawUrl);
			if (exact.length === 1) {
				const resource = exact[0];
				if (resource !== undefined) {
					const { rawUrl: _rawUrl, ...publicResource } = resource;
					const stable = stableWebResources([publicResource])[0];
					if (stable !== undefined) return {
						status: "exact",
						resource_key: stable.resource_key
					};
				}
			}
			const candidates = resources.filter((resource) => resource.url === script.url);
			if (candidates.length > 0) return {
				status: "ambiguous",
				candidate_resource_keys: uniqueResourceKeys(candidates)
			};
			return {
				status: "unmatched",
				reason: "no_exact_sanitized_url"
			};
		};
		stableWebScriptKey = (script) => `scr_${digest$1({
			url: script.url,
			cdp_hash: script.cdp_hash,
			length: script.length,
			is_module: script.is_module,
			language: script.language,
			source_map_url: script.source_map_url
		})}`;
		uniqueResourceKeys = (resources) => [...new Set(resources.map(({ resource_key }) => resource_key))].sort();
		digest$1 = (value) => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError("Web inventory value is not canonical JSON");
			return createHash("sha256").update(encoded).digest("hex");
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEventBodyShapes.js
var ingestResponseBodyShape, requestBodyShape, updateResponseBodyShape, invalidResponseBodyShape;
function init_CdpCaptureEventBodyShapes() {
	return (init_CdpCaptureEventBodyShapes = __esmMin((() => {
		init_jsonShape();
		init_CdpCaptureValues();
		init_CdpCaptureEventHelpers();
		ingestResponseBodyShape = (state, requestId, value) => {
			const result = recordValue(value);
			const body = cdpStringValue(result?.body);
			const base64Encoded = result?.base64Encoded;
			if (body === undefined || typeof base64Encoded !== "boolean") {
				invalidResponseBodyShape(state, requestId);
				return;
			}
			const decoded = base64Encoded ? decodeBase64$1(body)?.toString("utf8") : body;
			if (decoded === undefined) {
				invalidResponseBodyShape(state, requestId);
				return;
			}
			const shape = inferJsonShape(decoded);
			if (shape === null) state.completeness.unavailable("json_body_shapes");
			updateResponseBodyShape(state, requestId, shape);
		};
		requestBodyShape = (state, request) => {
			if (!state.input.include_json_body_shapes) return {
				status: "not_approved",
				request: null,
				response: null
			};
			const body = cdpStringValue(request.postData);
			if (!isJsonContentType(recordValue(request.headers)) || body === undefined) return {
				status: "unavailable",
				request: null,
				response: null
			};
			const shape = inferJsonShape(body);
			if (shape === null) state.completeness.unavailable("json_body_shapes");
			return {
				status: shape === null ? "unavailable" : "included",
				request: shape,
				response: null
			};
		};
		updateResponseBodyShape = (state, requestId, response) => {
			const current = state.network.get(requestId);
			if (current === undefined) return;
			const request = current.body_shapes.request;
			const status = response !== null ? "included" : request !== null ? "partial" : "unavailable";
			state.network.set(requestId, {
				...current,
				body_shapes: {
					status,
					request,
					response
				}
			});
		};
		invalidResponseBodyShape = (state, requestId) => {
			updateResponseBodyShape(state, requestId, null);
			state.completeness.exclude("json_body_shapes", "invalid_protocol_value");
		};
	})))();
}

//#endregion
//#region dist/browser/CdpSafeMetadata.js
var safeResponseMetadata, normalizedHeaders, parseCsp, cspSource, cspHostSourceOrigin, schemeOf, parseLinks, splitLinkHeader, linkParameters, safeDestination, permissionFeatures, wellKnownHint, agentHint, isAgentRel, referrerPolicies, referrerPolicy, policyToken, contentLength, boundedHeader, unquote, agentHeaderNames, wellKnownAgentPaths;
function init_CdpSafeMetadata() {
	return (init_CdpSafeMetadata = __esmMin((() => {
		init_browserObservation$1();
		init_CdpCaptureValues();
		safeResponseMetadata = (requestId, url, response, allowedOrigins) => {
			const headers = normalizedHeaders(response.headers);
			const links = parseLinks(headers.get("link"), url, allowedOrigins);
			const csp = parseCsp(headers.get("content-security-policy"), url, allowedOrigins);
			const agentHints = [
				...links.flatMap((link) => link.rel.some(isAgentRel) ? [agentHint("link_rel", link.rel.join(" "), link.href)] : []),
				...agentHeaderNames.flatMap((name) => headers.has(name) ? [agentHint("response_header", name, null)] : []),
				...wellKnownHint(url)
			];
			return {
				response: {
					request_id: requestId,
					url,
					mime_type: boundedHeader(cdpStringValue(response.mimeType)),
					content_length: contentLength(headers.get("content-length")),
					content_encoding: boundedHeader(headers.get("content-encoding")),
					csp,
					links,
					policies: {
						coop: policyToken(headers.get("cross-origin-opener-policy")),
						coep: policyToken(headers.get("cross-origin-embedder-policy")),
						corp: policyToken(headers.get("cross-origin-resource-policy")),
						referrer_policy: referrerPolicy(headers.get("referrer-policy")),
						x_content_type_options: policyToken(headers.get("x-content-type-options")),
						permissions_policy_features: permissionFeatures(headers.get("permissions-policy"))
					}
				},
				agentHints
			};
		};
		normalizedHeaders = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return new Map();
			const headers = new Map();
			for (const [name, raw] of Object.entries(value)) {
				const normalized = name.toLowerCase();
				const header = typeof raw === "string" ? raw : typeof raw === "number" && Number.isFinite(raw) ? String(raw) : undefined;
				if (header !== undefined) headers.set(normalized, header);
			}
			return headers;
		};
		parseCsp = (value, baseUrl, allowedOrigins) => {
			const directives = [];
			let nonceCount = 0;
			let hashCount = 0;
			for (const rawDirective of (value ?? "").split(";")) {
				const [rawName, ...tokens] = rawDirective.trim().split(/\s+/u);
				const name = (rawName ?? "").toLowerCase();
				if (!/^[a-z][a-z0-9\x2d]*$/u.test(name)) continue;
				const sources = [];
				for (const token of tokens) {
					const lower = token.toLowerCase();
					if (lower.startsWith("'nonce-")) {
						nonceCount += 1;
						continue;
					}
					if (lower.startsWith("'sha256-") || lower.startsWith("'sha384-") || lower.startsWith("'sha512-")) {
						hashCount += 1;
						continue;
					}
					sources.push(cspSource(token, baseUrl, allowedOrigins));
				}
				directives.push({
					name,
					sources
				});
			}
			return {
				directives,
				nonce_count: nonceCount,
				hash_count: hashCount
			};
		};
		cspSource = (token, baseUrl, allowedOrigins) => {
			const lower = token.toLowerCase();
			if (/^'[a-z0-9\x2d]+'$/u.test(lower)) return {
				kind: "keyword",
				value: lower
			};
			if (/^[a-z][a-z0-9+.\x2d]*:$/u.test(lower)) return {
				kind: "scheme",
				value: lower
			};
			const hostOrigin = cspHostSourceOrigin(token, baseUrl);
			if (hostOrigin === undefined) return {
				kind: "other",
				value: null
			};
			return hostOrigin !== null && allowedOrigins.has(hostOrigin) ? {
				kind: "approved_origin",
				value: hostOrigin
			} : {
				kind: "external_origin",
				value: null
			};
		};
		cspHostSourceOrigin = (token, baseUrl) => {
			const match = /^(?:([a-z][a-z0-9+.\x2d]*):\/\/)?([^\x2f?#]+)(?:\/[^?#]*)?$/iu.exec(token);
			const authority = match?.[2];
			if (authority === undefined || authority.length === 0) return undefined;
			const scheme = (match?.[1] ?? schemeOf(baseUrl))?.toLowerCase();
			if (scheme === undefined || !/^[a-z][a-z0-9+.\x2d]*$/u.test(scheme)) return undefined;
			if (!/^(?:\*|(?:\*\.)?[a-z0-9\x2d]+(?:\.[a-z0-9\x2d]+)*\.?)(?::(?:\*|\d+))?$/iu.test(authority)) return undefined;
			if (authority.includes("*")) return null;
			try {
				const parsed = new URL(`${scheme}://${authority}`);
				return parsed.username === "" && parsed.password === "" && parsed.pathname === "/" && parsed.origin !== "null" ? parsed.origin : undefined;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		schemeOf = (baseUrl) => {
			try {
				return new URL(baseUrl).protocol.replace(/:$/u, "");
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		parseLinks = (value, baseUrl, allowedOrigins) => {
			const links = [];
			for (const entry of splitLinkHeader(value ?? "")) {
				const match = /^\s*<([^>]*)>(.*)$/u.exec(entry);
				if (match === null) continue;
				const parameters = linkParameters(match[2] ?? "");
				const destination = safeDestination(match[1] ?? "", baseUrl, allowedOrigins);
				links.push({
					href: destination.url,
					destination_scope: destination.scope,
					rel: (parameters.get("rel") ?? "").toLowerCase().split(/\s+/u).filter(Boolean),
					as: boundedHeader(parameters.get("as")),
					type: boundedHeader(parameters.get("type")),
					crossorigin: boundedHeader(parameters.get("crossorigin"))
				});
			}
			return links;
		};
		splitLinkHeader = (value, delimiter = ",") => {
			const entries = [];
			let start = 0;
			let quoted = false;
			let escaped = false;
			let target = false;
			for (let index = 0; index < value.length; index += 1) {
				const character = value[index];
				if (quoted) {
					if (escaped) escaped = false;
					else if (character === "\\") escaped = true;
					else if (character === "\"") quoted = false;
					continue;
				}
				if (character === "\"" && !target) quoted = true;
				else if (delimiter === "," && character === "<") target = true;
				else if (delimiter === "," && character === ">") target = false;
				else if (character === delimiter && !target) {
					entries.push(value.slice(start, index));
					start = index + 1;
				}
			}
			entries.push(value.slice(start));
			return entries;
		};
		linkParameters = (value) => {
			const parameters = new Map();
			for (const raw of splitLinkHeader(value, ";").slice(1)) {
				const separator = raw.indexOf("=");
				const name = (separator < 0 ? raw : raw.slice(0, separator)).trim().toLowerCase();
				if (!/^[a-z][a-z0-9\x2d]*$/u.test(name)) continue;
				const parameter = separator < 0 ? "" : raw.slice(separator + 1).trim();
				parameters.set(name, unquote(parameter));
			}
			return parameters;
		};
		safeDestination = (value, baseUrl, allowedOrigins) => {
			try {
				const parsed = new URL(value, baseUrl);
				const sanitized = sanitizeBrowserUrl(parsed.href).url;
				if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
					url: sanitized,
					scope: "unsupported"
				};
				if (!allowedOrigins.has(parsed.origin)) return {
					url: sanitized,
					scope: "outside_policy"
				};
				return {
					url: sanitized,
					scope: "approved"
				};
			} catch (cause) {
				void cause;
				return {
					url: value,
					scope: "unsupported"
				};
			}
		};
		permissionFeatures = (value) => [...new Set((value ?? "").split(",").map((entry) => entry.split("=", 1)[0]?.trim().toLowerCase() ?? "").filter((feature) => /^[a-z][a-z0-9\x2d]*$/u.test(feature)))].sort();
		wellKnownHint = (url) => {
			try {
				const path = new URL(url).pathname.toLowerCase();
				return wellKnownAgentPaths.has(path) ? [agentHint("well_known_resource", path, sanitizeBrowserUrl(url).url)] : [];
			} catch (cause) {
				void cause;
				return [];
			}
		};
		agentHint = (mechanism, declaration, url) => ({
			mechanism,
			declaration,
			url,
			trust: "page-declared-untrusted"
		});
		isAgentRel = (value) => [
			"mcp",
			"model-context",
			"ai-plugin",
			"service-desc"
		].includes(value);
		referrerPolicies = new Set([
			"no-referrer",
			"no-referrer-when-downgrade",
			"same-origin",
			"origin",
			"strict-origin",
			"origin-when-cross-origin",
			"strict-origin-when-cross-origin",
			"unsafe-url"
		]);
		referrerPolicy = (value) => {
			let policy = null;
			for (const raw of (value ?? "").split(",")) {
				const token = raw.trim().toLowerCase();
				if (token === "") continue;
				if (!/^[a-z\x2d]+$/u.test(token)) return null;
				if (referrerPolicies.has(token)) policy = token;
			}
			return policy;
		};
		policyToken = (value) => {
			const token = (value ?? "").trim().toLowerCase();
			return /^[a-z][a-z0-9_.\x2d]*$/u.test(token) ? token : null;
		};
		contentLength = (value) => {
			const token = (value ?? "").trim();
			if (!/^[0-9]+$/u.test(token)) return null;
			const length = Number(token);
			return Number.isSafeInteger(length) ? length : null;
		};
		boundedHeader = (value) => value === undefined ? null : value.trim().toLowerCase();
		unquote = (value) => value.startsWith("\"") && value.endsWith("\"") ? value.slice(1, -1) : value;
		agentHeaderNames = [
			"x-model-context",
			"x-webmcp",
			"mcp-server"
		];
		wellKnownAgentPaths = new Set([
			"/.well-known/ai-plugin.json",
			"/.well-known/mcp",
			"/.well-known/model-context"
		]);
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEventTypes.js
var CDP_CAPTURE_SCRIPT_METADATA_LIMITS;
function init_CdpCaptureEventTypes() {
	return (init_CdpCaptureEventTypes = __esmMin((() => {
		CDP_CAPTURE_SCRIPT_METADATA_LIMITS = {
			retainedBytes: 8 * 1024 * 1024,
			scripts: 5e4
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEventHandlers.js
var handleExecutionContextCreated, handleExecutionContextDestroyed, handleScriptParsed, scriptMetadataStringBytes, stringByteLength, sourceMapForScript, handleRequestWillBeSent, preserveMalformedRedirectEvidence, redirectResponseUrlReason, handleResponseReceived, handleLoadingFinished, handleConsoleAPICalled, captureConsoleText, handleWebSocketFrame, captureWebSocketShape, handleWebSocketCreated, handleFrameNavigated;
function init_CdpCaptureEventHandlers() {
	return (init_CdpCaptureEventHandlers = __esmMin((() => {
		init_browserObservation$1();
		init_jsonShape();
		init_CdpSafeMetadata();
		init_CdpCaptureValues();
		init_CdpCaptureEventBodyShapes();
		init_CdpCaptureEventHelpers();
		init_CdpCaptureEventTypes();
		handleExecutionContextCreated = (state, params) => {
			const context = recordValue(params.context);
			const identifier = numberValue(context?.id);
			const frameId = cdpStringValue(recordValue(context?.auxData)?.frameId);
			if (identifier === undefined || !Number.isSafeInteger(identifier) || frameId === undefined) return;
			const key = String(identifier);
			state.executionContextFrames.set(key, frameId);
		};
		handleExecutionContextDestroyed = (state, params) => {
			const key = executionContextKey(params.executionContextId);
			if (key !== null) state.executionContextFrames.delete(key);
		};
		handleScriptParsed = (state, params) => {
			const scriptId = cdpStringValue(params.scriptId);
			const rawUrl = cdpStringValue(params.url) ?? "";
			const sanitized = allowedSanitizedUrl(rawUrl, state.allowedOrigins);
			if (scriptId === undefined) {
				state.completeness.exclude("scripts", "invalid_protocol_value");
				return;
			}
			const replacedBytes = state.scriptMetadataBytesById.get(scriptId) ?? 0;
			state.scriptMetadataBudgetOmissionsById.delete(scriptId);
			if (replacedBytes > 0) {
				state.scripts.delete(scriptId);
				state.scriptMetadataBytesById.delete(scriptId);
				state.retainedScriptMetadataBytes -= replacedBytes;
			}
			if (sanitized === undefined) {
				state.completeness.exclude("scripts", exclusionReasonForUrl(rawUrl));
				return;
			}
			const executionContext = executionContextKey(params.executionContextId);
			const baseScript = {
				scriptId,
				rawUrl,
				url: sanitized.url,
				origin: sanitized.origin,
				...scriptMetadataValues(params),
				language: cdpStringValue(params.scriptLanguage) ?? null,
				executionContextKey: executionContext,
				frameId: executionContext === null ? null : state.executionContextFrames.get(executionContext) ?? null
			};
			const baseBytes = scriptMetadataStringBytes(baseScript);
			const sourceMapDeclared = typeof params.sourceMapURL === "string" && params.sourceMapURL.length > 0;
			if (state.scripts.size >= CDP_CAPTURE_SCRIPT_METADATA_LIMITS.scripts || baseBytes > CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - state.retainedScriptMetadataBytes) {
				state.rejectedScriptMetadataBudgetCount += 1;
				if (sourceMapDeclared) state.rejectedSourceMapMetadataBudgetCount += 1;
				return;
			}
			const sourceMap = sourceMapForScript(params.sourceMapURL, rawUrl, state, CDP_CAPTURE_SCRIPT_METADATA_LIMITS.retainedBytes - state.retainedScriptMetadataBytes - baseBytes);
			const { budgetExhausted, ...sourceMapFields } = sourceMap;
			const script = {
				...baseScript,
				...sourceMapFields
			};
			if (budgetExhausted) state.scriptMetadataBudgetOmissionsById.set(scriptId, true);
			const retainedBytes = baseBytes + stringByteLength(sourceMap.sourceMapUrl) + stringByteLength(sourceMap.sourceMapRawUrl);
			state.retainedScriptMetadataBytes += retainedBytes;
			state.scriptMetadataBytesById.set(scriptId, retainedBytes);
			state.scripts.set(scriptId, script);
		};
		scriptMetadataStringBytes = (script) => stringByteLength(script.scriptId) + stringByteLength(script.rawUrl) + stringByteLength(script.url) + stringByteLength(script.origin) + stringByteLength(script.hash) + stringByteLength(script.language) + stringByteLength(script.executionContextKey) + stringByteLength(script.frameId);
		stringByteLength = (value) => value === null ? 0 : Buffer.byteLength(value, "utf8");
		sourceMapForScript = (value, scriptUrl, state, remainingBytes) => {
			const declaredUrl = cdpStringValue(value);
			if (declaredUrl === undefined || declaredUrl === "") return {
				sourceMapUrl: null,
				sourceMapRawUrl: null,
				budgetExhausted: false
			};
			let rawUrl;
			try {
				rawUrl = new URL(declaredUrl, scriptUrl).href;
			} catch (cause) {
				void cause;
				state.completeness.exclude("source_maps", "unsupported_url");
				return {
					sourceMapUrl: null,
					sourceMapRawUrl: null,
					budgetExhausted: false
				};
			}
			const sanitized = allowedSanitizedUrl(rawUrl, state.allowedOrigins);
			if (sanitized !== undefined) {
				if (stringByteLength(rawUrl) + stringByteLength(sanitized.url) > remainingBytes) {
					return {
						sourceMapUrl: null,
						sourceMapRawUrl: null,
						budgetExhausted: true
					};
				}
				return {
					sourceMapUrl: sanitized.url,
					sourceMapRawUrl: rawUrl,
					budgetExhausted: false
				};
			}
			state.completeness.exclude("source_maps", exclusionReasonForUrl(rawUrl));
			return {
				sourceMapUrl: null,
				sourceMapRawUrl: null,
				budgetExhausted: false
			};
		};
		handleRequestWillBeSent = (state, params) => {
			const requestId = cdpStringValue(params.requestId);
			const request = recordValue(params.request);
			if (requestId === undefined) {
				state.completeness.exclude("network_requests", "invalid_protocol_value");
				return;
			}
			if (state.malformedRedirectRequestIds.has(requestId)) return;
			const previous = state.network.get(requestId);
			if (!Object.hasOwn(params, "redirectResponse") && previous !== undefined && preserveMalformedRedirectEvidence(state, requestId, previous)) return;
			const method = cdpStringValue(request?.method);
			const initiator = recordValue(params.initiator);
			const initiatorType = cdpStringValue(initiator?.type);
			if (request === undefined || method === undefined || method.length === 0 || initiatorType === undefined || initiatorType.length === 0) {
				preserveMalformedRedirectEvidence(state, requestId, previous);
				return;
			}
			const sanitized = allowedSanitizedUrl(request.url, state.allowedOrigins);
			if (sanitized === undefined) {
				state.completeness.exclude("network_requests", exclusionReasonForUrl(cdpStringValue(request.url)));
				state.network.delete(requestId);
				state.networkRequestTimestamps.delete(requestId);
				return;
			}
			const redirectResponse = recordValue(params.redirectResponse);
			if (Object.hasOwn(params, "redirectResponse") && redirectResponse === undefined && preserveMalformedRedirectEvidence(state, requestId, previous)) return;
			const redirects = [...previous?.redirects ?? []];
			if (redirectResponse !== undefined) {
				const rawResponseUrl = cdpStringValue(redirectResponse.url);
				const responseUrl = rawResponseUrl === undefined || rawResponseUrl === "" ? undefined : allowedSanitizedUrl(rawResponseUrl, state.allowedOrigins);
				const responseUrlReason = redirectResponseUrlReason(rawResponseUrl);
				if (previous === undefined) {
					if (responseUrl === undefined) state.completeness.exclude("network_requests", responseUrlReason);
					else state.completeness.attachLimited("network_requests");
				} else if (responseUrl === undefined) {
					state.completeness.exclude("network_requests", responseUrlReason);
					state.network.delete(requestId);
					state.networkRequestTimestamps.delete(requestId);
					return;
				} else {
					const encodedDataLength = numberValue(redirectResponse.encodedDataLength);
					if (encodedDataLength === undefined || encodedDataLength < 0) state.completeness.exclude("network_requests", "invalid_protocol_value");
					redirects.push({
						url: previous.url,
						response_url: responseUrl.url,
						method: previous.method,
						resource_type: previous.resource_type,
						status: numberValue(redirectResponse.status) ?? null,
						mime_type: cdpStringValue(redirectResponse.mimeType) ?? null,
						encoded_data_length: encodedDataLength === undefined || encodedDataLength < 0 ? null : encodedDataLength,
						request_timestamp: state.networkRequestTimestamps.get(requestId) ?? null,
						redirect_event_timestamp: numberValue(params.timestamp) ?? null
					});
				}
			}
			const initiatorFrame = initiatorLocation(initiator);
			const rawInitiatorUrl = cdpStringValue(initiatorFrame?.url);
			const initiatorUrl = allowedSanitizedUrl(rawInitiatorUrl, state.allowedOrigins);
			if (rawInitiatorUrl !== undefined && initiatorUrl === undefined) state.completeness.exclude("network_initiators", exclusionReasonForUrl(rawInitiatorUrl));
			state.network.set(requestId, {
				request_id: requestId,
				url: sanitized.url,
				origin: sanitized.origin ?? "",
				method,
				resource_type: cdpStringValue(params.type) ?? null,
				status: null,
				mime_type: null,
				encoded_data_length: null,
				redirects,
				initiator: {
					type: initiatorType,
					url: initiatorUrl?.url ?? null,
					line: integerOrNull$1(initiatorFrame?.lineNumber),
					column: integerOrNull$1(initiatorFrame?.columnNumber)
				},
				body_shapes: requestBodyShape(state, request)
			});
			const timestamp = numberValue(params.timestamp);
			if (timestamp === undefined) state.networkRequestTimestamps.delete(requestId);
			else state.networkRequestTimestamps.set(requestId, timestamp);
		};
		preserveMalformedRedirectEvidence = (state, requestId, previous) => {
			state.completeness.exclude("network_requests", "invalid_protocol_value");
			if (previous === undefined) return false;
			state.malformedRedirectRequestIds.add(requestId);
			if (state.input.include_json_body_shapes && isJsonMediaType(previous.mime_type) && previous.body_shapes.response === null) {
				updateResponseBodyShape(state, requestId, null);
				state.completeness.exclude("json_body_shapes", "invalid_protocol_value");
			}
			return true;
		};
		redirectResponseUrlReason = (value) => {
			if (value === undefined || value === "") return "invalid_protocol_value";
			try {
				new URL(value);
			} catch {
				return "invalid_protocol_value";
			}
			return exclusionReasonForUrl(value);
		};
		handleResponseReceived = (state, params) => {
			const requestId = cdpStringValue(params.requestId);
			if (requestId === undefined) {
				state.completeness.exclude("network_requests", "invalid_protocol_value");
				return;
			}
			if (state.malformedRedirectRequestIds.has(requestId)) return;
			const current = state.network.get(requestId);
			const response = recordValue(params.response);
			if (current === undefined) return;
			const sanitized = allowedSanitizedUrl(response?.url, state.allowedOrigins);
			if (response === undefined || sanitized === undefined) {
				state.completeness.exclude("network_requests", response === undefined ? "invalid_protocol_value" : exclusionReasonForUrl(cdpStringValue(response.url)));
				state.network.delete(requestId);
				state.networkRequestTimestamps.delete(requestId);
				return;
			}
			state.network.set(requestId, {
				...current,
				status: numberValue(response.status) ?? null,
				mime_type: cdpStringValue(response.mimeType) ?? null
			});
			const metadata = safeResponseMetadata(requestId, sanitized.url, response, state.allowedOrigins);
			state.responseMetadata.push(metadata.response);
			state.agentHints.push(...metadata.agentHints);
		};
		handleLoadingFinished = (state, params) => {
			const requestId = cdpStringValue(params.requestId);
			if (requestId === undefined) return;
			if (state.malformedRedirectRequestIds.has(requestId)) return;
			const current = state.network.get(requestId);
			if (current === undefined) return;
			const encodedDataLength = numberValue(params.encodedDataLength);
			if (encodedDataLength === undefined || encodedDataLength < 0) {
				state.completeness.exclude("network_requests", "invalid_protocol_value");
				return;
			}
			state.network.set(requestId, {
				...current,
				encoded_data_length: encodedDataLength
			});
		};
		handleConsoleAPICalled = (state, params) => {
			const frame = firstCallFrame(recordValue(params.stackTrace));
			if (frame === undefined) {
				state.completeness.exclude("console_events", "unattributed_origin");
				return;
			}
			const source = allowedSanitizedUrl(frame.url, state.allowedOrigins);
			if (source === undefined) {
				state.completeness.exclude("console_events", exclusionReasonForUrl(cdpStringValue(frame.url)));
				return;
			}
			const arguments_ = recordsValue(params.args);
			state.console.push({
				type: cdpStringValue(params.type) ?? "unknown",
				timestamp: numberValue(params.timestamp) ?? 0,
				argument_types: arguments_.map((argument) => cdpStringValue(argument.type) ?? "unknown"),
				url: source.url,
				line: integerOrNull$1(frame.lineNumber),
				column: integerOrNull$1(frame.columnNumber),
				text_capture: captureConsoleText(state, arguments_)
			});
		};
		captureConsoleText = (state, arguments_) => {
			if (!state.input.include_console_text) return {
				status: "not_approved",
				values: [],
				retained_bytes: 0
			};
			const values = [];
			let retainedBytes = 0;
			for (const [argumentIndex, argument] of arguments_.entries()) {
				const primitive = consolePrimitive(argument);
				if (primitive === undefined) continue;
				const text = primitive.text;
				values.push({
					argument_index: argumentIndex,
					type: primitive.type,
					text
				});
				retainedBytes += Buffer.byteLength(text);
			}
			return {
				status: "included",
				values,
				retained_bytes: retainedBytes
			};
		};
		handleWebSocketFrame = (state, params, direction) => {
			const requestId = cdpStringValue(params.requestId);
			if (requestId === undefined) return;
			const connection = state.webSocketConnectionsById.get(requestId);
			if (connection === undefined) return;
			const response = recordValue(params.response);
			const payload = cdpStringValue(response?.payloadData) ?? "";
			const opcode = Math.max(0, Math.trunc(numberValue(response?.opcode) ?? 0));
			const decoded = opcode === 1 ? undefined : decodeBase64$1(payload);
			if (opcode !== 1 && decoded === undefined) state.completeness.exclude("websocket_frames", "invalid_protocol_value");
			connection.events.push({
				direction,
				opcode,
				payload_bytes: opcode === 1 ? Buffer.byteLength(payload) : decoded?.byteLength ?? null,
				payload_shape: captureWebSocketShape(state, payload, opcode)
			});
		};
		captureWebSocketShape = (state, payload, opcode) => {
			if (!state.input.include_websocket_shapes) return null;
			if (opcode !== 1) return {
				format: "binary",
				json_shape: null
			};
			const shape = inferJsonShape(payload);
			return {
				format: shape === null ? "text" : "json",
				json_shape: shape
			};
		};
		handleWebSocketCreated = (state, params) => {
			const requestId = cdpStringValue(params.requestId);
			const rawUrl = cdpStringValue(params.url);
			if (requestId === undefined) {
				state.completeness.exclude("websocket_connections", "invalid_protocol_value");
				return;
			}
			if (rawUrl === undefined) {
				state.completeness.exclude("websocket_connections", "invalid_protocol_value");
				return;
			}
			const sourceUrl = sanitizeBrowserUrl(rawUrl).url;
			let parsed;
			try {
				parsed = new URL(sourceUrl);
			} catch (cause) {
				void cause;
				state.completeness.exclude("websocket_connections", "unsupported_url");
				return;
			}
			if (parsed.protocol === "ws:") parsed.protocol = "http:";
			else if (parsed.protocol === "wss:") parsed.protocol = "https:";
			else {
				state.completeness.exclude("websocket_connections", "unsupported_url");
				return;
			}
			if (!state.allowedOrigins.has(parsed.origin)) {
				state.completeness.exclude("websocket_connections", "disallowed_origin");
				return;
			}
			if (state.webSocketConnectionsById.has(requestId)) {
				state.completeness.exclude("websocket_connections", "invalid_protocol_value");
				return;
			}
			state.webSocketConnectionsById.set(requestId, {
				request_id: requestId,
				url: sourceUrl,
				events: []
			});
		};
		handleFrameNavigated = (state, params) => {
			const frame = recordValue(params.frame);
			if (state.mainFrameId === undefined) return;
			if (!isMainFrameNavigation({
				method: "Page.frameNavigated",
				params
			}, state.mainFrameId)) return;
			const rawUrl = cdpStringValue(frame?.url);
			const loaderId = cdpStringValue(frame?.loaderId);
			const document = `${String(loaderId ?? "")}\0${String(rawUrl ?? "")}`;
			if (state.committedDocument === document) return;
			state.committedDocument = document;
			state.navigationDuringCapture = true;
			if (isHttpUrl(rawUrl) && allowedSanitizedUrl(rawUrl, state.allowedOrigins) === undefined) state.originViolation = true;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEvents.js
var CdpCaptureEvents;
function init_CdpCaptureEvents() {
	return (init_CdpCaptureEvents = __esmMin((() => {
		init_CdpCaptureCompleteness();
		init_CdpCaptureEventBodyShapes();
		init_CdpCaptureEventHandlers();
		init_CdpCaptureEventHelpers();
		init_CdpCaptureValues();
		CdpCaptureEvents = class {
			#scriptMetadataBudgetExclusionsRecorded = false;
			#networkRequestOccurrences = new Map();
			#responseBodyExaminedOccurrences = new Map();
			scripts = new Map();
			scriptMetadataBudgetOmissionsById = new Map();
			rejectedScriptMetadataBudgetCount = 0;
			rejectedSourceMapMetadataBudgetCount = 0;
			scriptMetadataBytesById = new Map();
			retainedScriptMetadataBytes = 0;
			executionContextFrames = new Map();
			network = new Map();
			networkRequestTimestamps = new Map();
			malformedRedirectRequestIds = new Set();
			webSocketConnectionsById = new Map();
			console = [];
			responseMetadata = [];
			agentHints = [];
			completeness = new CdpCaptureCompleteness([
				"network_requests",
				"console_events",
				"websocket_connections",
				"websocket_frames",
				"metadata"
			]);
			originViolation = false;
			navigationDuringCapture = false;
			mainFrameId = undefined;
			committedDocument = undefined;
			input;
			allowedOrigins;
			constructor(input, allowedOrigins) {
				this.input = input;
				this.allowedOrigins = allowedOrigins;
			}
			beginAuthorizedFrame(frameId) {
				this.mainFrameId = frameId;
				this.originViolation = false;
				this.navigationDuringCapture = false;
				this.committedDocument = undefined;
				this.scripts.clear();
				this.scriptMetadataBudgetOmissionsById.clear();
				this.rejectedScriptMetadataBudgetCount = 0;
				this.rejectedSourceMapMetadataBudgetCount = 0;
				this.scriptMetadataBytesById.clear();
				this.retainedScriptMetadataBytes = 0;
				this.#scriptMetadataBudgetExclusionsRecorded = false;
				this.executionContextFrames.clear();
				this.network.clear();
				this.networkRequestTimestamps.clear();
				this.#networkRequestOccurrences.clear();
				this.#responseBodyExaminedOccurrences.clear();
				this.malformedRedirectRequestIds.clear();
				this.webSocketConnectionsById.clear();
				this.console.length = 0;
				this.responseMetadata.length = 0;
				this.agentHints.length = 0;
				this.completeness.reset();
				if (!this.input.include_console_text) this.completeness.exclude("console_text", "not_approved", null);
				if (!this.input.include_json_body_shapes) this.completeness.exclude("json_body_shapes", "not_approved", null);
				if (!this.input.include_websocket_shapes) this.completeness.exclude("websocket_shapes", "not_approved", null);
			}
			beginFinalCapture(frameId) {
				this.mainFrameId = frameId;
				this.committedDocument = undefined;
			}
			/** Record final script metadata omissions after all scriptParsed replacements. */
			recordScriptMetadataBudgetExclusions() {
				if (this.#scriptMetadataBudgetExclusionsRecorded) return;
				this.#scriptMetadataBudgetExclusionsRecorded = true;
				const omittedScripts = this.rejectedScriptMetadataBudgetCount;
				const omittedSourceMaps = this.rejectedSourceMapMetadataBudgetCount + this.scriptMetadataBudgetOmissionsById.size;
				if (omittedScripts > 0) this.completeness.exclude("scripts", "resource_budget_exhausted", omittedScripts);
				if (omittedSourceMaps > 0) this.completeness.exclude("source_maps", "resource_budget_exhausted", omittedSourceMaps);
			}
			ingest(event) {
				const params = recordValue(event.params);
				if (params === undefined) return;
				switch (event.method) {
					case "Runtime.executionContextCreated":
						handleExecutionContextCreated(this, params);
						break;
					case "Runtime.executionContextDestroyed":
						handleExecutionContextDestroyed(this, params);
						break;
					case "Runtime.executionContextsCleared":
						this.executionContextFrames.clear();
						break;
					case "Debugger.scriptParsed":
						handleScriptParsed(this, params);
						break;
					case "Network.requestWillBeSent": {
						const requestId = cdpStringValue(params.requestId);
						const previous = requestId === undefined ? undefined : this.network.get(requestId);
						handleRequestWillBeSent(this, params);
						if (requestId !== undefined && this.network.get(requestId) !== previous) this.#networkRequestOccurrences.set(requestId, (this.#networkRequestOccurrences.get(requestId) ?? 0) + 1);
						break;
					}
					case "Network.responseReceived":
						handleResponseReceived(this, params);
						break;
					case "Network.loadingFinished":
						handleLoadingFinished(this, params);
						break;
					case "Runtime.consoleAPICalled":
						handleConsoleAPICalled(this, params);
						break;
					case "Page.frameNavigated":
						handleFrameNavigated(this, params);
						break;
					case "Network.webSocketCreated":
						handleWebSocketCreated(this, params);
						break;
					case "Network.webSocketFrameSent":
						handleWebSocketFrame(this, params, "sent");
						break;
					case "Network.webSocketFrameReceived":
						handleWebSocketFrame(this, params, "received");
						break;
				}
			}
			/** Resolve a transient execution context to one already authorized frame. */
			frameForScript(script, allowedFrameIds) {
				return script.frameId !== null && allowedFrameIds.has(script.frameId) ? script.frameId : null;
			}
			responseBodyRequests() {
				if (!this.input.include_json_body_shapes) return [];
				return [...this.network.values()].filter((request) => !this.malformedRedirectRequestIds.has(request.request_id)).filter((request) => isJsonMediaType(request.mime_type)).flatMap((request) => {
					const occurrence = this.#networkRequestOccurrences.get(request.request_id);
					return occurrence === undefined ? [] : [{
						requestId: request.request_id,
						occurrence
					}];
				});
			}
			currentResponseBodyRequest(candidate) {
				if (candidate.occurrence !== this.#networkRequestOccurrences.get(candidate.requestId)) return undefined;
				return this.network.get(candidate.requestId);
			}
			responseBodyUnavailable(candidate) {
				if (this.currentResponseBodyRequest(candidate) === undefined) return;
				this.#responseBodyExaminedOccurrences.set(candidate.requestId, candidate.occurrence);
				if (this.malformedRedirectRequestIds.has(candidate.requestId)) return;
				updateResponseBodyShape(this, candidate.requestId, null);
				this.completeness.unavailable("json_body_shapes");
			}
			/**
			* Mark eligible response bodies that arrived after the fetch pass was
			* enumerated.
			*/
			settleUnexaminedResponseBodies() {
				for (const candidate of this.responseBodyRequests()) {
					const request = this.currentResponseBodyRequest(candidate);
					if (request?.body_shapes.response === null && this.#responseBodyExaminedOccurrences.get(candidate.requestId) !== candidate.occurrence) this.responseBodyUnavailable(candidate);
				}
			}
			ingestResponseBody(candidate, value) {
				if (this.currentResponseBodyRequest(candidate) === undefined) return;
				this.#responseBodyExaminedOccurrences.set(candidate.requestId, candidate.occurrence);
				if (this.malformedRedirectRequestIds.has(candidate.requestId)) return;
				ingestResponseBodyShape(this, candidate.requestId, value);
			}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureStorageFingerprints.js
var captureStorageFingerprints, addStorageItems, addCookies, addIndexedDb, indexedDbStoreSchema, indexedDbSchemaComplete, indexedDbKeyPathComplete, addIndexedDbRecords, addCaches, addCacheEntry, addFingerprint, STORAGE_ENTRY_PAGE_SIZE, digest, encodedValue, stableValue, stableValueComplete, remoteObjectComplete, decodeBase64;
function init_CdpCaptureStorageFingerprints() {
	return (init_CdpCaptureStorageFingerprints = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_CdpConnection();
		init_CdpOptionalCommand();
		init_CdpCaptureValues();
		captureStorageFingerprints = async ({ context, origin, cookieUrl, local, session, indexedDbNames, caches, limitations }) => {
			const state = {
				items: [],
				complete: local.complete && session.complete
			};
			const run = {
				context,
				limitations,
				state
			};
			addStorageItems(state, "local_storage", local.items);
			addStorageItems(state, "session_storage", session.items);
			await addCookies(run, cookieUrl);
			await addIndexedDb(run, origin, indexedDbNames);
			await addCaches(run, caches);
			state.items.sort((left, right) => compareUnicodeCodePoints(`${left.scope}:${left.identity_sha256}`, `${right.scope}:${right.identity_sha256}`));
			const complete = state.complete && state.items.every(({ complete }) => complete);
			return {
				items: state.items,
				complete
			};
		};
		addStorageItems = (state, scope, items) => {
			for (const item of items) addFingerprint(state, {
				scope,
				identity: item.key,
				value: item.value,
				complete: true
			});
		};
		addCookies = async (run, pageUrl) => {
			run.limitations.push("Cookie fingerprints cover cookies applicable to the current main-frame URL, not every path on its origin.");
			const raw = await optionalCdpCommand(run.context, "Network.getCookies", { urls: [pageUrl] }, run.limitations);
			if (raw === undefined) {
				run.state.complete = false;
				return;
			}
			const cookieValues = recordValue(raw)?.cookies;
			if (!Array.isArray(cookieValues)) {
				run.state.complete = false;
				return;
			}
			const cookies = recordsValue(cookieValues);
			if (cookies.length !== cookieValues.length) run.state.complete = false;
			for (const cookie of cookies) {
				const name = cdpStringValue(cookie.name);
				const value = cdpStringValue(cookie.value);
				const domain = cdpStringValue(cookie.domain);
				const path = cdpStringValue(cookie.path);
				if (name === undefined || value === undefined || domain === undefined || path === undefined) {
					run.state.complete = false;
					continue;
				}
				addFingerprint(run.state, {
					scope: "cookie",
					identity: {
						domain,
						path,
						name,
						partition_key: cookie.partitionKey ?? null
					},
					value,
					complete: true
				});
			}
		};
		addIndexedDb = async (run, origin, names) => {
			for (const databaseName of names) {
				const raw = await optionalCdpCommand(run.context, "IndexedDB.requestDatabase", {
					securityOrigin: origin,
					databaseName
				}, run.limitations);
				const database = recordValue(recordValue(raw)?.databaseWithObjectStores);
				if (raw === undefined || database === undefined) {
					run.state.complete = false;
					continue;
				}
				if (cdpStringValue(database.name) !== databaseName) {
					run.state.complete = false;
					continue;
				}
				if (!Array.isArray(database.objectStores)) {
					run.state.complete = false;
					continue;
				}
				const stores = recordsValue(database.objectStores);
				if (stores.length !== database.objectStores.length) run.state.complete = false;
				addFingerprint(run.state, {
					scope: "indexed_db_schema",
					identity: databaseName,
					value: stores.map(indexedDbStoreSchema),
					complete: stores.length === database.objectStores.length && indexedDbSchemaComplete(stores)
				});
				for (const store of stores) {
					const objectStoreName = cdpStringValue(store.name);
					if (objectStoreName === undefined) {
						run.state.complete = false;
						continue;
					}
					await addIndexedDbRecords(run, {
						origin,
						databaseName,
						objectStoreName
					});
				}
			}
		};
		indexedDbStoreSchema = (store) => ({
			name: cdpStringValue(store.name) ?? null,
			key_path: stableValue(store.keyPath),
			auto_increment: store.autoIncrement === true,
			indexes: recordsValue(store.indexes).map((index) => ({
				name: cdpStringValue(index.name) ?? null,
				key_path: stableValue(index.keyPath),
				unique: index.unique === true,
				multi_entry: index.multiEntry === true
			}))
		});
		indexedDbSchemaComplete = (stores) => stores.every((store) => cdpStringValue(store.name) !== undefined && indexedDbKeyPathComplete(store.keyPath) && typeof store.autoIncrement === "boolean" && Array.isArray(store.indexes) && recordsValue(store.indexes).length === store.indexes.length && recordsValue(store.indexes).every((index) => cdpStringValue(index.name) !== undefined && indexedDbKeyPathComplete(index.keyPath) && typeof index.unique === "boolean" && typeof index.multiEntry === "boolean"));
		indexedDbKeyPathComplete = (value) => {
			const keyPath = recordValue(value);
			if (keyPath === undefined) return false;
			switch (keyPath.type) {
				case "null": return true;
				case "string": return typeof keyPath.string === "string";
				case "array": return Array.isArray(keyPath.array) && keyPath.array.every((key) => typeof key === "string");
				default: return false;
			}
		};
		addIndexedDbRecords = async (run, input) => {
			let skipCount = 0;
			while (true) {
				const raw = await optionalCdpCommand(run.context, "IndexedDB.requestData", {
					securityOrigin: input.origin,
					databaseName: input.databaseName,
					objectStoreName: input.objectStoreName,
					skipCount,
					pageSize: STORAGE_ENTRY_PAGE_SIZE
				}, run.limitations);
				const result = recordValue(raw);
				if (raw === undefined || result === undefined) {
					run.state.complete = false;
					return;
				}
				if (!Array.isArray(result.objectStoreDataEntries) || typeof result.hasMore !== "boolean") {
					run.state.complete = false;
					return;
				}
				const entries = recordsValue(result.objectStoreDataEntries);
				if (entries.length !== result.objectStoreDataEntries.length) run.state.complete = false;
				for (const entry of entries) {
					const key = stableValue(entry.key);
					const primaryKey = stableValue(entry.primaryKey);
					const value = entry.value === undefined ? undefined : stableValue(entry.value);
					addFingerprint(run.state, {
						scope: "indexed_db_record",
						identity: {
							database: input.databaseName,
							store: input.objectStoreName,
							key,
							primaryKey
						},
						value,
						complete: remoteObjectComplete(entry.key) && remoteObjectComplete(entry.primaryKey) && remoteObjectComplete(entry.value)
					});
				}
				if (result.hasMore !== true) return;
				if (entries.length === 0 || skipCount > Number.MAX_SAFE_INTEGER - entries.length) {
					run.state.complete = false;
					return;
				}
				skipCount += entries.length;
			}
		};
		addCaches = async (run, caches) => {
			for (const cache of caches) {
				let skipCount = 0;
				let returnCount;
				while (returnCount === undefined || skipCount < returnCount) {
					const raw = await optionalCdpCommand(run.context, "CacheStorage.requestEntries", {
						cacheId: cache.id,
						skipCount,
						pageSize: STORAGE_ENTRY_PAGE_SIZE
					}, run.limitations);
					const result = recordValue(raw);
					if (raw === undefined || result === undefined) {
						run.state.complete = false;
						break;
					}
					if (!Array.isArray(result.cacheDataEntries) || typeof result.returnCount !== "number" || !Number.isSafeInteger(result.returnCount) || result.returnCount < 0) {
						run.state.complete = false;
						break;
					}
					const entries = recordsValue(result.cacheDataEntries);
					if (entries.length !== result.cacheDataEntries.length) run.state.complete = false;
					for (const entry of entries) await addCacheEntry(run, cache, entry);
					returnCount = result.returnCount;
					if (skipCount + entries.length >= returnCount) break;
					if (entries.length === 0 || skipCount > Number.MAX_SAFE_INTEGER - entries.length) {
						run.state.complete = false;
						break;
					}
					skipCount += entries.length;
				}
			}
		};
		addCacheEntry = async (run, cache, entry) => {
			const requestURL = cdpStringValue(entry.requestURL);
			const requestMethod = cdpStringValue(entry.requestMethod);
			if (requestURL === undefined || requestMethod === undefined) {
				run.state.complete = false;
				return;
			}
			if (!Array.isArray(entry.requestHeaders)) {
				run.state.complete = false;
				return;
			}
			const headerRecords = recordsValue(entry.requestHeaders);
			const requestHeaders = headerRecords.flatMap((header) => {
				const name = cdpStringValue(header.name);
				const value = cdpStringValue(header.value);
				return name === undefined || value === undefined ? [] : [{
					name,
					value
				}];
			});
			if (headerRecords.length !== entry.requestHeaders.length || requestHeaders.length !== headerRecords.length) {
				run.state.complete = false;
				return;
			}
			const raw = await optionalCdpCommand(run.context, "CacheStorage.requestCachedResponse", {
				cacheId: cache.id,
				requestURL,
				requestHeaders
			}, run.limitations);
			const body = cdpStringValue(recordValue(recordValue(raw)?.response)?.body);
			const decoded = body === undefined ? null : decodeBase64(body);
			const complete = decoded !== null;
			if (!complete) run.state.complete = false;
			addFingerprint(run.state, {
				scope: "cache_entry",
				identity: {
					cache: cache.name,
					requestURL,
					requestMethod,
					requestHeaders
				},
				value: decoded ?? undefined,
				complete
			});
		};
		addFingerprint = (state, input) => {
			state.items.push({
				scope: input.scope,
				identity_sha256: digest(input.identity),
				value_sha256: input.value === undefined ? null : digest(input.value),
				complete: input.complete && stableValueComplete(input.identity) && stableValueComplete(input.value)
			});
		};
		STORAGE_ENTRY_PAGE_SIZE = 1e3;
		digest = (value) => createHash("sha256").update(encodedValue(value)).digest("hex");
		encodedValue = (value) => {
			if (value instanceof Uint8Array) return value;
			const encoded = canonicalize(stableValue(value));
			if (encoded === undefined) throw new TypeError("Expected canonical JSON");
			return encoded;
		};
		stableValue = (value) => {
			if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
			if (Array.isArray(value)) return value.map((item) => stableValue(item));
			const record = recordValue(value);
			if (record === undefined) return String(value);
			return Object.fromEntries(Object.entries(record).filter(([key]) => key !== "objectId" && key !== "customPreview").sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([key, item]) => [key, stableValue(item)]));
		};
		stableValueComplete = (value) => {
			if (value instanceof Uint8Array) return true;
			if (value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return true;
			if (Array.isArray(value)) return value.every((item) => stableValueComplete(item));
			const record = recordValue(value);
			if (record === undefined) return false;
			const entries = Object.entries(record).filter(([key]) => key !== "objectId" && key !== "customPreview");
			return entries.every(([, item]) => stableValueComplete(item));
		};
		remoteObjectComplete = (value) => {
			const record = recordValue(value);
			if (record === undefined || record.objectId !== undefined || record.preview !== undefined || record.customPreview !== undefined || !stableValueComplete(record)) return false;
			switch (record.type) {
				case "undefined": return record.value === undefined && record.unserializableValue === undefined;
				case "string":
				case "boolean": return typeof record.value === record.type && record.unserializableValue === undefined;
				case "number": return record.unserializableValue === undefined ? typeof record.value === "number" && Number.isFinite(record.value) : record.value === undefined && typeof record.unserializableValue === "string" && [
					"-0",
					"NaN",
					"Infinity",
					"-Infinity"
				].includes(record.unserializableValue);
				case "bigint": return record.value === undefined && typeof record.unserializableValue === "string" && /^-?\d+n$/u.test(record.unserializableValue);
				case "object": return record.unserializableValue === undefined && (record.subtype === "null" ? record.value === null : record.value !== null && typeof record.value === "object");
				default: return false;
			}
		};
		decodeBase64 = (value) => {
			if (value.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/u.test(value)) return null;
			return Buffer.from(value, "base64");
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureStorage.js
var captureStorage, emptyStorageItems, capturedCaches, storageItems, stringArray;
function init_CdpCaptureStorage() {
	return (init_CdpCaptureStorage = __esmMin((() => {
		init_CdpConnection();
		init_CdpOptionalCommand();
		init_CdpCaptureStorageFingerprints();
		init_CdpCaptureValues();
		captureStorage = async (context, pageUrl, limitations) => {
			const origin = new URL(pageUrl).origin;
			const quota = recordValue(await optionalCdpCommand(context, "Storage.getUsageAndQuota", { origin }, limitations));
			const local = context.input.include_storage_keys ? await storageItems(context, origin, true, limitations) : emptyStorageItems;
			const session = context.input.include_storage_keys ? await storageItems(context, origin, false, limitations) : emptyStorageItems;
			const indexedRaw = context.input.include_storage_keys ? await optionalCdpCommand(context, "IndexedDB.requestDatabaseNames", { securityOrigin: origin }, limitations) : undefined;
			const indexedValues = recordValue(indexedRaw)?.databaseNames;
			const indexed = stringArray(indexedValues);
			const cacheRaw = context.input.include_storage_keys ? await optionalCdpCommand(context, "CacheStorage.requestCacheNames", { securityOrigin: origin }, limitations) : undefined;
			const cacheField = recordValue(cacheRaw)?.caches;
			const caches = capturedCaches(recordsValue(cacheField));
			const fingerprints = context.input.include_storage_fingerprints ? await captureStorageFingerprints({
				context,
				origin,
				cookieUrl: pageUrl,
				local,
				session,
				indexedDbNames: indexed,
				caches,
				limitations
			}) : {
				items: [],
				complete: false
			};
			const structuredStorageComplete = indexedRaw !== undefined && Array.isArray(indexedValues) && indexed.length === indexedValues.length && Array.isArray(cacheField) && caches.length === cacheField.length;
			const keysExclusion = !context.input.include_storage_keys ? undefined : local.exclusion === "provider_unavailable" || session.exclusion === "provider_unavailable" || indexedRaw === undefined || cacheRaw === undefined ? "provider_unavailable" : !local.complete || !session.complete || !structuredStorageComplete ? "invalid_protocol_value" : undefined;
			return {
				keysExclusion,
				value: {
					origin,
					usage_bytes: numberValue(quota?.usage) ?? null,
					quota_bytes: numberValue(quota?.quota) ?? null,
					local_storage_keys: local.items.map(({ key }) => key),
					session_storage_keys: session.items.map(({ key }) => key),
					indexed_db_names: [...indexed],
					cache_names: caches.map(({ name }) => name),
					content_fingerprints: [...fingerprints.items],
					fingerprint_algorithm: "sha256",
					fingerprints_complete: fingerprints.complete && structuredStorageComplete,
					values_redacted: true
				}
			};
		};
		emptyStorageItems = {
			items: [],
			complete: false
		};
		capturedCaches = (values) => values.flatMap((cache) => {
			const name = cdpStringValue(cache.cacheName);
			const id = cdpStringValue(cache.cacheId);
			return name === undefined || id === undefined ? [] : [{
				name,
				id
			}];
		});
		storageItems = async (context, origin, isLocalStorage, limitations) => {
			const raw = await optionalCdpCommand(context, "DOMStorage.getDOMStorageItems", { storageId: {
				securityOrigin: origin,
				isLocalStorage
			} }, limitations);
			const entries = recordValue(raw)?.entries;
			if (raw === undefined || !Array.isArray(entries)) return {
				items: [],
				complete: false,
				exclusion: raw === undefined ? "provider_unavailable" : "invalid_protocol_value"
			};
			const items = entries.flatMap((entry) => {
				if (!Array.isArray(entry)) return [];
				const key = cdpStringValue(entry[0]);
				const value = cdpStringValue(entry[1]);
				return key === undefined || value === undefined ? [] : [{
					key,
					value
				}];
			});
			return {
				items,
				complete: items.length === entries.length
			};
		};
		stringArray = (value) => Array.isArray(value) ? value.flatMap((item) => {
			const text = cdpStringValue(item);
			return text === undefined ? [] : [text];
		}) : [];
	})))();
}

//#endregion
//#region dist/browser/CdpPageCaptureScripts.js
var captureScripts, buildScriptDraft, captureScriptSource, keyAndBuildInventory, sourceDigest;
function init_CdpPageCaptureScripts() {
	return (init_CdpPageCaptureScripts = __esmMin((() => {
		init_webInventory();
		init_CdpCaptureValues();
		init_unicodeCodePointOrder();
		captureScripts = async (options) => {
			const { context, events, rawResources, resources, frameIds } = options;
			const state = {
				context,
				events,
				frameIds,
				rawResources,
				resources
			};
			const drafts = [];
			for (const script of events.scripts.values()) drafts.push(await buildScriptDraft(script, state));
			if (!context.input.include_script_sources) events.completeness.exclude("script_sources", "not_approved", events.scripts.size);
			return keyAndBuildInventory(drafts, events.scripts.size);
		};
		buildScriptDraft = async (script, state) => {
			let source = state.context.input.include_script_sources ? await captureScriptSource(script, state) : sourceExcluded("source capture was not selected");
			const inventoryScript = {
				frame_id: state.events.frameForScript(script, state.frameIds),
				url: script.url,
				cdp_hash: script.hash,
				length: script.length,
				is_module: script.isModule,
				language: script.language,
				source_map_url: script.sourceMapUrl
			};
			return {
				item: {
					...inventoryScript,
					origin: script.origin,
					resource_reconciliation: reconcileCapturedWebScript({
						...inventoryScript,
						rawUrl: script.rawUrl
					}, state.rawResources, state.resources),
					source
				},
				sourceMapRawUrl: script.sourceMapRawUrl
			};
		};
		captureScriptSource = async (script, state) => {
			const { context } = state;
			const content = requiredScriptSource(await context.connection.send("Debugger.getScriptSource", { scriptId: script.scriptId }, context.sessionId, context.signal), context.operation);
			return sourceResult(content);
		};
		keyAndBuildInventory = (drafts, scriptCount) => {
			const keyed = drafts.map((draft) => ({
				...draft,
				base: stableWebScriptKey(draft.item)
			}));
			keyed.sort((left, right) => compareUnicodeCodePoints(left.base, right.base) || compareUnicodeCodePoints(sourceDigest(left.item.source), sourceDigest(right.item.source)) || compareUnicodeCodePoints(left.item.frame_id ?? "", right.item.frame_id ?? ""));
			const totals = new Map();
			for (const { base } of keyed) totals.set(base, (totals.get(base) ?? 0) + 1);
			const seen = new Map();
			const sourceMapRequests = [];
			const items = keyed.map(({ base, item, sourceMapRawUrl }) => {
				const occurrence = (seen.get(base) ?? 0) + 1;
				seen.set(base, occurrence);
				const scriptKey = totals.get(base) === 1 ? base : `${base}_${String(occurrence)}`;
				if (item.source_map_url !== null && sourceMapRawUrl !== null) sourceMapRequests.push({
					scriptKey,
					declaredUrl: item.source_map_url,
					fetchUrl: sourceMapRawUrl
				});
				return {
					script_key: scriptKey,
					...item
				};
			});
			return {
				inventory: {
					total: scriptCount,
					items
				},
				sourceMapRequests
			};
		};
		sourceDigest = (source) => source.included ? source.artifact.sha256 : source.reason;
	})))();
}

//#endregion
//#region dist/browser/CdpPageCaptureWorkers.js
var captureWorkers;
function init_CdpPageCaptureWorkers() {
	return (init_CdpPageCaptureWorkers = __esmMin((() => {
		init_CdpCaptureValues();
		init_CdpOptionalCommand();
		captureWorkers = async (input, frameIds) => {
			const { context, allowedOrigins, limitations, events } = input;
			const completeness = events.completeness;
			const result = await optionalCdpCommand({
				...context,
				sessionId: undefined
			}, "Target.getTargets", {}, limitations);
			const items = [];
			if (result === undefined) completeness.unavailable("workers");
			for (const target of recordsValue(recordValue(result)?.targetInfos)) {
				const type = cdpStringValue(target.type) ?? "";
				const url = allowedSanitizedUrl(target.url, allowedOrigins);
				const relatedToPage = cdpStringValue(target.openerId) === context.target.id || cdpStringValue(target.parentFrameId) !== undefined && frameIds.has(cdpStringValue(target.parentFrameId) ?? "");
				if (!type.includes("worker")) continue;
				if (!relatedToPage) {
					completeness.exclude("workers", "out_of_target_scope");
					continue;
				}
				if (url === undefined) {
					const rawUrl = cdpStringValue(target.url);
					completeness.exclude("workers", rawUrl === undefined || rawUrl === "" ? "unattributed_origin" : isHttpUrl(rawUrl) ? "disallowed_origin" : "unsupported_url");
					continue;
				}
				if (typeof target.attached !== "boolean") {
					completeness.exclude("workers", "invalid_protocol_value");
					continue;
				}
				items.push({
					target_id: cdpStringValue(target.targetId) ?? "",
					type,
					url: url.url,
					origin: url.origin,
					attached: target.attached,
					opener_target_id: cdpStringValue(target.openerId) ?? null,
					parent_frame_id: cdpStringValue(target.parentFrameId) ?? null
				});
			}
			return items;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpPageCapture.js
var capturePage, captureAuthorizedPage, captureJsonResponseBodies, authorizeObservationWindow, capturePageDom, normalizedInspection, enableObservationDomains, accessibilityForFrames, publicResource, deduplicatedAgentHints, normalizedTarget, report;
function init_CdpPageCapture() {
	return (init_CdpPageCapture = __esmMin((() => {
		init_browserObservationError();
		init_webInventory();
		init_CdpConnection();
		init_CdpCaptureEvents();
		init_CdpAuthorizedMainFrame();
		init_CdpCaptureStorage();
		init_CdpOptionalCommand();
		init_CdpCommandRejection();
		init_CdpCaptureDocuments();
		init_CdpCaptureDomSvg();
		init_CdpCaptureValues();
		init_CdpPageCaptureScripts();
		init_CdpPageCaptureWorkers();
		capturePage = async (context) => {
			const allowedOrigins = new Set(context.input.allowed_origins);
			const events = new CdpCaptureEvents(context.input, allowedOrigins);
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				events.ingest(event);
			});
			const state = {
				context,
				events,
				allowedOrigins,
				limitations: [
					"Observation starts when REA attaches; prior network and console activity is unavailable.",
					"Raw network headers, bodies, cookies, storage values, console objects, and WebSocket payloads are never retained; explicitly requested primitive console text is retained verbatim, while payload captures retain value-free shapes.",
					"Source maps are reported only as declarative URLs and are not fetched.",
					"URL-less scripts and console events without an allowed source URL are excluded because their origin cannot be proven.",
					...context.target.attached === null ? ["CDP discovery omitted the target attachment state; attached is reported as unknown."] : []
				],
				startedAt: new Date().toISOString()
			};
			try {
				return await captureAuthorizedPage(state);
			} finally {
				removeListener();
			}
		};
		captureAuthorizedPage = async (state) => {
			const { context, allowedOrigins, limitations } = state;
			const { connection, sessionId, input, signal } = context;
			await authorizeObservationWindow(state);
			await captureJsonResponseBodies(state);
			const frameResult = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: context.operation
			});
			const attachedUrl = mainFrameUrl(frameResult) ?? "";
			const frameCapture = captureFrames(frameResult, allowedOrigins, undefined, state.events.completeness);
			const frames = frameCapture.items;
			const captureFrame = frames[0];
			if (captureFrame === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			state.events.beginFinalCapture(captureFrame.frame_id);
			const resourceCapture = captureResources(await connection.send("Page.getResourceTree", {}, sessionId, signal), allowedOrigins, state.events.completeness);
			const resources = stableWebResources(resourceCapture.items.map(publicResource));
			const dom = await capturePageDom(state);
			const accessibility = await accessibilityForFrames(state, frames);
			const scripts = await captureScripts({
				context,
				events: state.events,
				rawResources: resourceCapture.items,
				resources,
				frameIds: new Set(frames.map((frame) => frame.frame_id))
			});
			const workers = await captureWorkers({
				context,
				allowedOrigins,
				limitations,
				events: state.events
			}, new Set(frames.map((frame) => frame.frame_id)));
			const storageCapture = await captureStorage(context, attachedUrl, limitations);
			if (!input.include_storage_keys) state.events.completeness.exclude("storage_keys", "not_approved", null);
			else if (storageCapture.keysExclusion !== undefined) state.events.completeness.exclude("storage_keys", storageCapture.keysExclusion, null);
			await report(context.progress, 3, "Normalizing browser evidence");
			const completedFrameResult = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: context.operation
			});
			const completedUrl = mainFrameUrl(completedFrameResult) ?? "";
			if (state.events.originViolation) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			if (state.events.navigationDuringCapture || completedUrl !== attachedUrl) throw new BrowserObservationError("inspect_web_page", "target_changed");
			state.events.settleUnexaminedResponseBodies();
			state.events.recordScriptMetadataBudgetExclusions();
			return {
				inspection: normalizedInspection(state, {
					attachedUrl,
					frames,
					dom,
					accessibility,
					scripts: scripts.inventory,
					resources,
					workers,
					storage: storageCapture.value
				}),
				sourceMapRequests: scripts.sourceMapRequests
			};
		};
		captureJsonResponseBodies = async (state) => {
			const requests = state.events.responseBodyRequests();
			for (let index = 0; index < requests.length; index += 1) {
				const candidate = requests[index];
				if (candidate === undefined) continue;
				const current = state.events.currentResponseBodyRequest(candidate);
				if (current === undefined) continue;
				if (current.encoded_data_length === null) {
					state.events.responseBodyUnavailable(candidate);
					continue;
				}
				let result;
				try {
					result = await optionalCdpCommand(state.context, "Network.getResponseBody", { requestId: candidate.requestId }, state.limitations);
				} catch (cause) {
					if (!(cause instanceof CdpCommandRejection) || cause.command !== "Network.getResponseBody" || cause.code !== -32e3 || cause.reportedMessage === null) throw cause;
					state.events.responseBodyUnavailable(candidate);
					state.limitations.push(`Response body unavailable for request ${candidate.requestId}: ${cause.userMessage}`);
					continue;
				}
				if (result !== undefined) {
					state.events.ingestResponseBody(candidate, result);
					continue;
				}
				for (const remaining of requests.slice(index)) state.events.responseBodyUnavailable(remaining);
				return;
			}
		};
		authorizeObservationWindow = async (state) => {
			const { context, allowedOrigins, events } = state;
			const { connection, sessionId, signal } = context;
			await report(context.progress, 1, "Enabling passive CDP domains");
			await connection.send("Page.enable", {}, sessionId, signal);
			const initialFrameResult = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: context.operation
			});
			const mainFrame = captureFrames(initialFrameResult, allowedOrigins).items[0];
			if (mainFrame === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			events.beginAuthorizedFrame(mainFrame.frame_id);
			await enableObservationDomains(connection, sessionId, signal);
			await report(context.progress, 2, "Observing page events");
			await delayWithCancellation(context.input.observation_ms, context.operation, signal);
			if (events.originViolation) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
		};
		capturePageDom = async (state) => {
			const { context, allowedOrigins } = state;
			const result = await context.connection.send("DOMSnapshot.captureSnapshot", {
				computedStyles: [],
				includePaintOrder: false,
				includeDOMRects: false
			}, context.sessionId, context.signal);
			const capture = captureDom(result, allowedOrigins, context.input, state.events.completeness);
			let step = capture.next();
			let descriptionUnavailable = false;
			const pendingController = new AbortController();
			const signal = context.signal === undefined ? pendingController.signal : AbortSignal.any([context.signal, pendingController.signal]);
			while (!step.done) {
				const pending = step.value.map(async (query) => {
					if (descriptionUnavailable) return undefined;
					try {
						return capturedSvgNodeKind(query, await context.connection.send("DOM.describeNode", {
							backendNodeId: query.backendNodeId,
							depth: 0
						}, context.sessionId, signal));
					} catch (cause) {
						if (!(cause instanceof CdpCommandRejection)) throw cause;
						if (cause.code === -32601) descriptionUnavailable = true;
						else if (cause.code !== -32e3) throw cause;
						return undefined;
					}
				});
				try {
					step = capture.next(await Promise.all(pending));
				} catch (cause) {
					pendingController.abort();
					await Promise.allSettled(pending);
					throw cause;
				}
			}
			if (step.value.unresolvedSvgNodes > 0) state.limitations.push(`SVG identity was unavailable for ${String(step.value.unresolvedSvgNodes)} snapshotted XLink candidate nodes; their URL destinations remain unknown.`);
			return step.value;
		};
		normalizedInspection = (state, captured) => ({
			browser: state.context.discovery.version,
			target: normalizedTarget(state.context.target, captured.attachedUrl, state.allowedOrigins),
			capture_window: {
				started_at: state.startedAt,
				ended_at: new Date().toISOString(),
				observation_ms: state.context.input.observation_ms
			},
			completeness: state.events.completeness.snapshot(),
			frames: [...captured.frames],
			dom: {
				total_nodes: captured.dom.total,
				nodes: [...captured.dom.nodes]
			},
			accessibility: {
				total_nodes: captured.accessibility.total,
				text_capture: captured.accessibility.textCapture,
				nodes: [...captured.accessibility.nodes]
			},
			scripts: captured.scripts,
			resources: [...captured.resources],
			network: {
				requests: [...state.events.network.values()],
				websocket_connections: [...state.events.webSocketConnectionsById.values()],
				coverage_started_at: state.startedAt,
				prior_activity_available: false
			},
			console: {
				events: [...state.events.console],
				coverage_started_at: state.startedAt,
				prior_activity_available: false
			},
			workers: [...captured.workers],
			metadata: {
				responses: [...state.events.responseMetadata],
				dom_urls: [...captured.dom.urls],
				agent_hints: deduplicatedAgentHints([...state.events.agentHints, ...captured.dom.agentHints]),
				excluded_dom_urls: captured.dom.excludedUrls,
				headers_allowlisted: true
			},
			storage: captured.storage,
			limitations: state.limitations
		});
		enableObservationDomains = async (connection, sessionId, signal) => {
			await connection.send("Runtime.enable", {}, sessionId, signal);
			await connection.send("Debugger.enable", {}, sessionId, signal);
			await connection.send("Network.enable", {}, sessionId, signal);
		};
		accessibilityForFrames = async (state, frames) => {
			const { context, limitations, events } = state;
			const results = [];
			let unavailable = false;
			for (const frame of frames) {
				const result = await optionalCdpCommand(context, "Accessibility.getFullAXTree", { frameId: frame.frame_id }, limitations);
				if (result === undefined) unavailable = true;
				else results.push(result);
			}
			if (unavailable) events.completeness.unavailable("accessibility");
			const capture = captureAccessibility(results, {
				includeText: context.input.include_accessibility_text,
				...results.length === 0 && unavailable ? { unavailable: true } : {}
			});
			if (!context.input.include_accessibility_text) events.completeness.exclude("accessibility", "not_approved", capture.textCapture.excluded_fields);
			if (capture.treeIncomplete) events.completeness.truncate("accessibility");
			return capture;
		};
		publicResource = ({ rawUrl: _rawUrl, ...resource }) => resource;
		deduplicatedAgentHints = (hints) => {
			const seen = new Set();
			return hints.filter((hint) => {
				const key = `${hint.mechanism}\0${hint.declaration}\0${hint.url ?? ""}`;
				if (seen.has(key)) return false;
				seen.add(key);
				return true;
			});
		};
		normalizedTarget = (target, currentUrl, allowedOrigins) => {
			const url = allowedSanitizedUrl(currentUrl, allowedOrigins);
			return {
				target_id: target.id,
				type: target.type,
				title: target.title,
				url: url?.url ?? "[unsupported-url]",
				origin: url?.origin ?? "",
				attached: target.attached
			};
		};
		report = async (progress, completed, message) => await progress?.report({
			phase: "browser_observation",
			completed,
			total: 3,
			message,
			...completed === 3 ? { terminal: true } : {}
		});
	})))();
}

//#endregion
//#region dist/javascript/sourceMaps/SourceMapFormat.js
var leafSchema, mapHeaderSchema, sectionSchema, indexedSchema, SourceMapFormatFailure, codecLeaf, compare, addOffset, consumeRecords, addSections, inspectMappingLayout, inspectLeaf, inspectSourceMap, inspectSourceMapValue;
function init_SourceMapFormat() {
	return (init_SourceMapFormat = __esmMin((() => {
		init_webSourceLocation();
		init_sourceMapEnvelope();
		leafSchema = z.object({
			version: z.literal(3),
			file: z.string().nullable().optional(),
			sourceRoot: z.string().nullable().optional(),
			sources: z.array(z.string().nullable()),
			sourcesContent: z.array(z.string().nullable()).nullable().optional(),
			names: z.array(z.string()).default([]),
			mappings: z.string().regex(/^[A-Za-z0-9+/,;]*$/u),
			ignoreList: z.array(z.number().int().min(0)).optional(),
			x_google_ignoreList: z.array(z.number().int().min(0)).optional()
		});
		mapHeaderSchema = z.object({
			version: z.literal(3),
			file: z.string().nullable().optional(),
			sections: z.unknown().optional()
		});
		sectionSchema = z.object({
			offset: z.object({
				line: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
				column: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER)
			}),
			map: z.unknown().optional(),
			url: z.string().optional()
		});
		indexedSchema = z.object({
			version: z.literal(3),
			sections: z.array(sectionSchema)
		});
		SourceMapFormatFailure = class extends Error {
			reason;
			constructor(reason, message) {
				super(message);
				this.reason = reason;
			}
		};
		codecLeaf = (map) => ({
			version: 3,
			...map.file === undefined ? {} : { file: map.file },
			...typeof map.sourceRoot === "string" ? { sourceRoot: map.sourceRoot } : {},
			sources: map.sources,
			...map.sourcesContent == null ? {} : { sourcesContent: map.sourcesContent },
			names: map.names,
			mappings: map.mappings,
			...map.ignoreList === undefined ? {} : { ignoreList: map.ignoreList },
			...map.x_google_ignoreList === undefined ? {} : { x_google_ignoreList: map.x_google_ignoreList }
		});
		compare = (a, b) => a.line - b.line || a.column - b.column;
		addOffset = (base, offset) => {
			const result = {
				line: base.line + offset.line,
				column: offset.column + (offset.line === 0 ? base.column : 0)
			};
			if (!Number.isSafeInteger(result.line) || !Number.isSafeInteger(result.column) || result.line >= WEB_SOURCE_MAP_LIMITS.decodedRows) throw new SourceMapFormatFailure("limit", "Indexed offset exceeds the 262144 generated-row decoder budget.");
			return result;
		};
		consumeRecords = (budget, count) => {
			if (count > WEB_SOURCE_MAP_LIMITS.decodedRecords - budget.records) throw new SourceMapFormatFailure("limit", `Source-map structure exceeds the ${WEB_SOURCE_MAP_LIMITS.decodedRecords}-record decoder budget.`);
			budget.records += count;
		};
		addSections = (node, pending, budget, options) => {
			options.check?.();
			const header = mapHeaderSchema.parse(node.value);
			if (!Array.isArray(header.sections)) throw new SourceMapFormatFailure("format", "Indexed source-map sections must be an array.");
			consumeRecords(budget, header.sections.length);
			const sections = indexedSchema.parse(node.value).sections;
			for (const [index, section] of sections.entries()) {
				if ((index & 255) === 0) options.check?.();
				const previous = sections[index - 1];
				if (previous !== undefined && compare(section.offset, previous.offset) <= 0) throw new SourceMapFormatFailure("format", "Indexed section offsets must be strictly increasing.");
				if (section.url !== undefined) throw new SourceMapFormatFailure("unsupported", `External source-map section URL is not fetched: ${section.url}`);
				if (section.map === undefined) throw new SourceMapFormatFailure("format", "Indexed section requires an embedded map.");
			}
			for (let index = sections.length - 1; index >= 0; index -= 1) {
				const section = sections[index];
				if (section === undefined) continue;
				const next = sections[index + 1];
				const nextOffset = next === undefined ? null : addOffset(node.offset, next.offset);
				const stop = nextOffset === null ? node.stop : node.stop === null || compare(nextOffset, node.stop) < 0 ? nextOffset : node.stop;
				const offset = addOffset(node.offset, section.offset);
				if (node.stop !== null && compare(offset, node.stop) >= 0) throw new SourceMapFormatFailure("format", "Nested source-map section overlaps its enclosing boundary.");
				pending.push({
					value: section.map,
					path: [...node.path, index],
					offset,
					stop
				});
			}
		};
		inspectMappingLayout = (mappings, check) => {
			let lines = 1;
			let segments = 0;
			let components = 0;
			let inSegment = false;
			let continued = false;
			let digits = 0;
			const finish = () => {
				if (continued) throw new SourceMapFormatFailure("format", "Source-map VLQ ends with an unfinished continuation.");
				if (inSegment && ![
					1,
					4,
					5
				].includes(components)) throw new SourceMapFormatFailure("format", "Source-map segment requires one, four or five VLQ components.");
			};
			let index = 0;
			for (const character of mappings) {
				if ((index++ & 16383) === 0) check?.();
				if (character === "," || character === ";") {
					finish();
					inSegment = false;
					components = 0;
					if (character === ";") lines += 1;
				} else {
					digits += 1;
					if (digits === 7 && !/[A-Dg-j]/u.test(character) || digits > 7 && character !== "A" && character !== "g") throw new SourceMapFormatFailure("format", "Source-map VLQ exceeds the format's 32-bit quantity representation.");
					if (!inSegment) segments += 1;
					inSegment = true;
					continued = /[g-z0-9+/]/u.test(character);
					if (!continued) {
						components += 1;
						digits = 0;
					}
				}
				if (segments > WEB_SOURCE_MAP_LIMITS.decodedSegments || lines > WEB_SOURCE_MAP_LIMITS.decodedRows) throw new SourceMapFormatFailure("limit", "Source-map layout exceeds the 262144 segment/generated-row decoder budget.");
			}
			finish();
			return {
				lines,
				segments
			};
		};
		inspectLeaf = (node, budget, options) => {
			options.check?.();
			consumeRecords(budget, 1);
			if (typeof node.value !== "object" || node.value === null || Array.isArray(node.value)) return leafSchema.parse(node.value);
			const rawMap = node.value;
			const rawSources = rawMap.sources;
			const rawNames = rawMap.names;
			const rawContents = rawMap.sourcesContent;
			consumeRecords(budget, Array.isArray(rawSources) ? rawSources.length : 0);
			consumeRecords(budget, Array.isArray(rawNames) ? rawNames.length : 0);
			consumeRecords(budget, Array.isArray(rawContents) ? rawContents.length : 0);
			options.check?.();
			const leaf = leafSchema.parse(node.value);
			const layout = inspectMappingLayout(leaf.mappings, options.check);
			consumeRecords(budget, layout.segments + layout.lines);
			if (layout.segments > WEB_SOURCE_MAP_LIMITS.decodedSegments || node.offset.line + layout.lines > WEB_SOURCE_MAP_LIMITS.decodedRows) throw new SourceMapFormatFailure("limit", "Source-map layout exceeds the 262144 segment/generated-row decoder budget.");
			return leaf;
		};
		inspectSourceMap = (text) => {
			const jsonText = sourceMapJsonText(text);
			const value = JSON.parse(jsonText);
			return inspectSourceMapValue(value);
		};
		inspectSourceMapValue = (value, options = {}) => {
			options.check?.();
			const root = mapHeaderSchema.parse(value);
			const declarations = [];
			const leaves = [];
			const pending = [{
				value,
				path: [],
				offset: {
					line: 0,
					column: 0
				},
				stop: null
			}];
			const budget = options.budget ?? { records: 0 };
			while (pending.length > 0) {
				options.check?.();
				const node = pending.pop();
				if (node === undefined) break;
				if (node.path.length > WEB_SOURCE_MAP_LIMITS.sectionDepth) throw new SourceMapFormatFailure("limit", "Indexed source-map nesting exceeds the 64-level decoder stack budget.");
				if (mapHeaderSchema.parse(node.value).sections !== undefined) {
					addSections(node, pending, budget, options);
					continue;
				}
				const leaf = inspectLeaf(node, budget, options);
				leaves.push({
					map: leaf,
					codecMap: codecLeaf(leaf),
					offset: node.offset,
					stop: node.stop
				});
				if (options.profile !== "browser-collection") {
					const ignoredSources = new Set(leaf.ignoreList ?? leaf.x_google_ignoreList ?? []);
					for (const [sourceIndex, source] of leaf.sources.entries()) declarations.push({
						sectionPath: node.path,
						sourceIndex,
						source,
						root: leaf.sourceRoot ?? null,
						content: leaf.sourcesContent?.[sourceIndex] ?? null,
						ignored: ignoredSources.has(sourceIndex)
					});
				}
			}
			return {
				format: root.sections === undefined ? "regular" : "indexed",
				reportedFile: root.file ?? null,
				declarations,
				leaves
			};
		};
	})))();
}

//#endregion
//#region dist/javascript/sourceMaps/DecodedSourceMap.js
var isBeforeSourceMapLeafStop, decodeValidatedSourceMapLeaves;
function init_DecodedSourceMap() {
	return (init_DecodedSourceMap = __esmMin((() => {
		init_SourceMapFormat();
		isBeforeSourceMapLeafStop = (leaf, line, column) => {
			if (leaf.stop === null) return true;
			const generatedLine = leaf.offset.line + line;
			const generatedColumn = column + (line === 0 ? leaf.offset.column : 0);
			return generatedLine < leaf.stop.line || generatedLine === leaf.stop.line && generatedColumn < leaf.stop.column;
		};
		decodeValidatedSourceMapLeaves = (leaves, mapUrl, check) => leaves.map((leaf) => {
			check?.();
			const map = new TraceMap(leaf.codecMap, mapUrl);
			const rows = decodedMappings(map);
			for (const [line, row] of rows.entries()) {
				if ((line & 255) === 0) check?.();
				for (const segment of row) {
					const generatedLine = leaf.offset.line + line;
					const generatedColumn = segment[0] + (line === 0 ? leaf.offset.column : 0);
					if (!Number.isSafeInteger(generatedLine) || !Number.isSafeInteger(generatedColumn) || ![
						1,
						4,
						5
					].includes(segment.length) || segment.some((value) => !Number.isSafeInteger(value) || value < 0) || segment.length !== 1 && segment[1] >= leaf.map.sources.length || segment.length === 5 && segment[4] >= leaf.map.names.length) throw new SourceMapFormatFailure("format", "Decoded local or absolute position, source index or name index is invalid.");
				}
			}
			return {
				leaf,
				map,
				rows,
				resolvedSources: map.resolvedSources
			};
		});
	})))();
}

//#endregion
//#region dist/browser/WebSourceMapFetcher.js
var SOURCE_MAP_FETCH_TIMEOUT_MS, SOURCE_MAP_RESPONSE_BYTES, SOURCE_MAP_OUTPUT_BYTES, SOURCE_MAP_FAILURE_LIMITATION_RESERVE, SOURCE_MAP_COLLECTION_ENVELOPE_RESERVE, fetchWebSourceMaps, sourceMapOutputLimitation, sourceMapsStatus, SourceMapDeadlineError, SourceMapSizeLimitError, SourceMapEncodingError, SourceMapRedirectLocationError, fetchOne, isFetchRedirectStatus, fetchFollowingApprovedRedirects, readBoundedText, readWithAbort, signalIsAborted, promiseWithAbort, normalizeSourceMap, originalModuleEdges, sourceParserPath, checkOperation, approvedUrl, sourceMapContext, emptySourceMapItem, sanitizeSource, preflightResolvedSourceBytes, consumeExpandedBytes, expandedOutputFailure, sourceMapOutputError, resolvedSourceLimitFailure, jsonBytes, artifactMetadataBytes, EMPTY_SOURCE_MAP_FAILURE, SOURCE_MAP_FAILURE_ENVELOPE_BYTES, SOURCE_MAP_SUCCESS_ENVELOPE_BYTES, sourceMapFailureReservation, sourceEntryOverheadBytes, cachedJsonBytes, cachedSanitized, mappingRowBytes, resolveOriginalSource, sourceMediaType, originalDependency;
function init_WebSourceMapFetcher() {
	return (init_WebSourceMapFetcher = __esmMin((() => {
		init_DecodedSourceMap();
		init_browserObservation$1();
		init_analysisErrorCore();
		init_webBundleAnalyzerAst();
		init_javascriptSemanticAnalysis();
		init_javascriptSemanticTraversal();
		init_javascriptSourceParser();
		init_javascriptModuleDeclaration();
		init_javascriptStaticAnalysisHelpers();
		init_webBundleAnalysis();
		init_webContentArtifact();
		init_safeJson();
		init_sourceMapEnvelope();
		init_javascriptSourceMapPaths();
		init_jsonSerialization();
		init_SourceMapFormat();
		init_webSourceLocation();
		SOURCE_MAP_FETCH_TIMEOUT_MS = 3e4;
		SOURCE_MAP_RESPONSE_BYTES = 64 * 1024 * 1024;
		SOURCE_MAP_OUTPUT_BYTES = WEB_SOURCE_MAP_LIMITS.outputBytes;
		SOURCE_MAP_FAILURE_LIMITATION_RESERVE = 512;
		SOURCE_MAP_COLLECTION_ENVELOPE_RESERVE = 1024;
		fetchWebSourceMaps = async (requests, input, signal, host = { fetch: globalThis.fetch }) => {
			const items = [];
			const operationController = new AbortController();
			const timeout = setTimeout(() => operationController.abort(new SourceMapDeadlineError()), host.timeoutMs ?? SOURCE_MAP_FETCH_TIMEOUT_MS);
			const abortFromCaller = () => operationController.abort(signal?.reason);
			signal?.addEventListener("abort", abortFromCaller, { once: true });
			const operationSignal = operationController.signal;
			const deadlineAt = performance.now() + (host.timeoutMs ?? SOURCE_MAP_FETCH_TIMEOUT_MS);
			const budget = {
				retainedBytes: 0,
				deadlineAt,
				decodedRecords: {
					records: 0,
					expandedBytes: SOURCE_MAP_COLLECTION_ENVELOPE_RESERVE,
					resolvedSourceBytes: 0
				}
			};
			let limitation;
			try {
				for (const request of requests) {
					if (signal?.aborted === true) throw signal.reason;
					const reservation = sourceMapFailureReservation(request) + 1;
					if (reservation > SOURCE_MAP_OUTPUT_BYTES - budget.decodedRecords.expandedBytes) {
						limitation = sourceMapOutputLimitation(requests.length - items.length);
						break;
					}
					const expandedBytesBeforeItem = budget.decodedRecords.expandedBytes;
					budget.decodedRecords.expandedBytes += reservation;
					if (operationSignal.aborted || performance.now() >= deadlineAt) {
						items.push(emptySourceMapItem(request, "fetch_failed", "Source-map fetching exceeded its operation deadline."));
						continue;
					}
					const item = await fetchOne(request, input, operationSignal, host, budget);
					if (item.artifact === null) {
						const failureBytes = sourceMapFailureReservation(request, item.effective_url ?? null, item.limitation, item.status) + 1;
						if (failureBytes > SOURCE_MAP_OUTPUT_BYTES - expandedBytesBeforeItem) {
							limitation = sourceMapOutputLimitation(requests.length - items.length);
							break;
						}
						budget.decodedRecords.expandedBytes = expandedBytesBeforeItem + failureBytes;
					}
					items.push(item);
				}
			} catch (cause) {
				if (signal?.aborted === true) throw cause;
				if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") limitation = sourceMapOutputLimitation(requests.length - items.length);
				else throw cause;
			} finally {
				clearTimeout(timeout);
				signal?.removeEventListener("abort", abortFromCaller);
			}
			if (signal?.aborted === true) throw signal.reason;
			return webSourceMapsSchema.parse({
				status: sourceMapsStatus(items, limitation !== undefined),
				requested: requests.length,
				processed: items.length,
				items,
				...limitation === undefined ? {} : { limitation }
			});
		};
		sourceMapOutputLimitation = (unprocessed) => `source-map output budget could not retain results for ${String(unprocessed)} requested map${unprocessed === 1 ? "" : "s"}. their results are unknown.`;
		sourceMapsStatus = (items, omitted) => {
			const retained = items.filter(({ status }) => status === "included" || status === "partial").length;
			if (items.length === 0 || retained === 0) return "unavailable";
			if (omitted) return "partial";
			return retained === items.length && !items.some(({ status }) => status === "partial") ? "included" : "partial";
		};
		SourceMapDeadlineError = class extends Error {
			constructor() {
				super("Source-map fetching exceeded its operation deadline.");
				this.name = "SourceMapDeadlineError";
			}
		};
		SourceMapSizeLimitError = class extends Error {
			constructor() {
				super("Source-map response exceeded the retained-byte budget.");
				this.name = "SourceMapSizeLimitError";
			}
		};
		SourceMapEncodingError = class extends Error {
			constructor() {
				super("Source-map response is not valid UTF-8.");
				this.name = "SourceMapEncodingError";
			}
		};
		SourceMapRedirectLocationError = class extends Error {
			constructor(url, location) {
				super(`Source-map redirect from ${JSON.stringify(url)} supplied an invalid Location URL: ${JSON.stringify(location)}.`);
				this.name = "SourceMapRedirectLocationError";
			}
		};
		fetchOne = async (request, input, signal, host, budget) => {
			if (!approvedUrl(request.fetchUrl, input.allowed_origins)) return emptySourceMapItem(request, "policy_filtered", "Declared source-map URL is outside the approved exact origins.");
			let effectiveUrl = null;
			try {
				const fetched = await fetchFollowingApprovedRedirects(request.fetchUrl, input.allowed_origins, signal, host, (url) => {
					effectiveUrl = url;
				});
				if (fetched === undefined) return emptySourceMapItem(request, "policy_filtered", "A source-map redirect left the approved exact origins.", effectiveUrl);
				const { response, fetchedUrl } = fetched;
				try {
					consumeExpandedBytes(budget.decodedRecords, jsonBytes(fetchedUrl) - 4);
				} catch (cause) {
					try {
						await response.body?.cancel();
					} catch (cleanupCause) {
						if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") throw sourceMapOutputError(cause, {
							cause: new AggregateError([cause, cleanupCause], "Source-map response cleanup failed after its output exceeded capacity."),
							cleanup: {
								reason: "Source-map response cancellation failed after its output exceeded capacity.",
								resources: ["source-map-response"]
							}
						});
						throw cause;
					}
					throw cause;
				}
				if (!response.ok) {
					await response.body?.cancel();
					return emptySourceMapItem(request, "fetch_failed", `Source-map server returned HTTP ${String(response.status)}.`, fetchedUrl);
				}
				checkOperation(undefined, signal, budget.deadlineAt);
				return normalizeSourceMap(request, await readBoundedText(response, budget, host.maxResponseBytes ?? SOURCE_MAP_RESPONSE_BYTES, signal), fetchedUrl, {
					signal,
					deadlineAt: budget.deadlineAt,
					budget: budget.decodedRecords
				});
			} catch (cause) {
				if (cause instanceof AnalysisResourceConstraintError) throw cause;
				if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") throw cause;
				if (signal?.aborted === true && !(signal.reason instanceof SourceMapDeadlineError)) throw cause;
				if (cause instanceof SourceMapEncodingError) return emptySourceMapItem(request, "invalid", cause.message, effectiveUrl);
				return emptySourceMapItem(request, "fetch_failed", cause instanceof SourceMapRedirectLocationError || cause instanceof SourceMapSizeLimitError || cause instanceof SourceMapDeadlineError ? cause.message : "Source-map fetch or validation failed.", effectiveUrl);
			}
		};
		isFetchRedirectStatus = (status) => status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
		fetchFollowingApprovedRedirects = async (initialUrl, allowedOrigins, signal, host, observeResponse) => {
			let current = initialUrl;
			const visited = new Set();
			for (;;) {
				if (signal?.aborted === true) throw signal.reason;
				if (!approvedUrl(current, allowedOrigins)) return undefined;
				if (visited.has(current)) throw new Error("source_map_redirect_loop");
				visited.add(current);
				const response = await promiseWithAbort(host.fetch(current, {
					method: "GET",
					headers: { Accept: "application/json, application/source-map+json;q=0.9" },
					redirect: "manual",
					credentials: "omit",
					referrerPolicy: "no-referrer",
					...signal === undefined ? {} : { signal }
				}), signal);
				observeResponse(current);
				if (signal !== undefined && signalIsAborted(signal)) {
					await response.body?.cancel(signal.reason).catch(() => undefined);
					throw signal.reason;
				}
				if (!isFetchRedirectStatus(response.status)) return {
					response,
					fetchedUrl: current
				};
				const location = response.headers.get("location");
				if (location === null) return {
					response,
					fetchedUrl: current
				};
				await response.body?.cancel();
				try {
					current = new URL(location, current).href;
				} catch {
					throw new SourceMapRedirectLocationError(current, location);
				}
			}
		};
		readBoundedText = async (response, budget, maxBytes, signal) => {
			if (response.body === null) return "";
			const reader = response.body.getReader();
			const chunks = [];
			let bytes = 0;
			try {
				for (;;) {
					if (signal?.aborted === true) throw signal.reason;
					const { done, value } = await readWithAbort(reader, signal);
					if (done) break;
					const nextBytes = value?.byteLength ?? 0;
					if (budget.retainedBytes + bytes + nextBytes > maxBytes) {
						await reader.cancel(new SourceMapSizeLimitError());
						throw new SourceMapSizeLimitError();
					}
					if (value !== undefined) chunks.push(value);
					bytes += nextBytes;
				}
			} finally {
				if (signal?.aborted !== true) reader.releaseLock();
			}
			budget.retainedBytes += bytes;
			const joined = new Uint8Array(bytes);
			let offset = 0;
			for (const chunk of chunks) {
				joined.set(chunk, offset);
				offset += chunk.byteLength;
			}
			try {
				return new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				}).decode(joined);
			} catch {
				throw new SourceMapEncodingError();
			}
		};
		readWithAbort = (reader, signal) => {
			if (signal === undefined) return reader.read();
			if (signal.aborted) return Promise.reject(signal.reason);
			return new Promise((resolve, reject) => {
				let settled = false;
				const cleanup = () => signal.removeEventListener("abort", abort);
				const abort = () => {
					if (settled) return;
					settled = true;
					cleanup();
					void reader.cancel(signal.reason).catch(() => undefined);
					reject(signal.reason);
				};
				signal.addEventListener("abort", abort, { once: true });
				void reader.read().then((value) => {
					if (settled) return;
					settled = true;
					cleanup();
					resolve(value);
				}, (cause) => {
					if (settled) return;
					settled = true;
					cleanup();
					void reader.cancel(cause).catch(() => undefined);
					reject(cause);
				});
			});
		};
		signalIsAborted = (signal) => signal?.aborted === true;
		promiseWithAbort = (promise, signal) => {
			if (signal === undefined) return promise;
			if (signal.aborted) return Promise.reject(signal.reason);
			return new Promise((resolve, reject) => {
				let settled = false;
				const cleanup = () => signal.removeEventListener("abort", abort);
				const abort = () => {
					if (settled) return;
					settled = true;
					cleanup();
					reject(signal.reason);
				};
				signal.addEventListener("abort", abort, { once: true });
				void promise.then((response) => {
					if (settled || signal.aborted) {
						void response.body?.cancel(signal.reason).catch(() => undefined);
						if (!settled) {
							settled = true;
							cleanup();
							reject(signal.reason);
						}
						return;
					}
					settled = true;
					cleanup();
					resolve(response);
				}, (cause) => {
					if (settled) return;
					settled = true;
					cleanup();
					reject(cause);
				});
			});
		};
		normalizeSourceMap = (request, text, fetchedUrl, context) => {
			const parsedJson = safeParseJson(sourceMapJsonText(text));
			if (!parsedJson.ok) return emptySourceMapItem(request, "invalid", "Source-map JSON is not a version 3 map.", fetchedUrl);
			const retainedBytesBeforeMap = context.budget.expandedBytes;
			try {
				const check = () => checkOperation(undefined, context.signal, context.deadlineAt);
				const inspected = inspectSourceMapValue(parsedJson.value, {
					profile: "browser-collection",
					budget: context.budget,
					check
				});
				context.budget.expandedBytes = retainedBytesBeforeMap - SOURCE_MAP_FAILURE_ENVELOPE_BYTES + SOURCE_MAP_SUCCESS_ENVELOPE_BYTES;
				consumeExpandedBytes(context.budget, jsonBytes(text) + artifactMetadataBytes("application/source-map+json", text) - 4);
				const sourcesByRaw = new Map();
				const resolvedByRoot = new Map();
				preflightResolvedSourceBytes(inspected.leaves, fetchedUrl, context.budget, resolvedByRoot, sourcesByRaw, check);
				check();
				const decoded = decodeValidatedSourceMapLeaves(inspected.leaves, fetchedUrl, check);
				const sourceJsonBytes = new Map();
				const nameJsonBytes = new Map();
				const originalSources = [];
				let declarationIndex = 0;
				for (const { leaf, resolvedSources } of decoded) {
					for (const [index, rawSource] of leaf.map.sources.entries()) {
						if ((index & 255) === 0) check();
						const resolved = rawSource === null ? null : resolvedSources[index] ?? null;
						const sanitized = resolved === null ? null : cachedSanitized(sourcesByRaw, resolved);
						const content = leaf.map.sourcesContent?.[index] ?? null;
						consumeExpandedBytes(context.budget, (sanitized === null ? 4 : cachedJsonBytes(sourceJsonBytes, sanitized)) + sourceEntryOverheadBytes(index, declarationIndex) + (originalSources.length === 0 ? 0 : 1) + (content === null ? 0 : jsonBytes(content) + artifactMetadataBytes(sourceMediaType(rawSource), content) - 4));
						originalSources.push({
							source_index: index,
							declaration_index: declarationIndex++,
							source: sanitized,
							artifact: content === null ? null : createWebTextArtifact(content, sourceMediaType(rawSource))
						});
					}
				}
				const mappings = [];
				declarationIndex = 0;
				for (const { leaf, rows, resolvedSources } of decoded) {
					const declarationBase = declarationIndex;
					declarationIndex += leaf.map.sources.length;
					for (const [line, row] of rows.entries()) {
						if ((line & 255) === 0) check();
						for (const segment of row) {
							if (!isBeforeSourceMapLeafStop(leaf, line, segment[0])) continue;
							if (segment.length === 1) continue;
							const rawSource = leaf.map.sources[segment[1]];
							if (rawSource === undefined) continue;
							const resolved = rawSource === null ? null : resolvedSources[segment[1]] ?? null;
							const source = resolved === null ? null : cachedSanitized(sourcesByRaw, resolved);
							const name = segment.length === 5 ? leaf.map.names[segment[4]] ?? null : null;
							const generatedLine = leaf.offset.line + line + 1;
							const generatedColumn = segment[0] + (line === 0 ? leaf.offset.column : 0);
							consumeExpandedBytes(context.budget, (source === null ? 4 : cachedJsonBytes(sourceJsonBytes, source)) + (name === null ? 4 : cachedJsonBytes(nameJsonBytes, name)) + mappingRowBytes(segment[1], declarationBase + segment[1], generatedLine, generatedColumn, segment[2] + 1, segment[3]) + (mappings.length === 0 ? 0 : 1));
							mappings.push({
								source_index: segment[1],
								declaration_index: declarationBase + segment[1],
								generated_line: generatedLine,
								generated_column: generatedColumn,
								source,
								original_line: segment[2] + 1,
								original_column: segment[3],
								name
							});
						}
					}
				}
				const modules = originalModuleEdges(originalSources, check, (edge) => consumeExpandedBytes(context.budget, Buffer.byteLength(JSON.stringify(edge)) + 1));
				check();
				if (modules.incomplete.length > 0) consumeExpandedBytes(context.budget, jsonBytes(`Module edges are incomplete: ${modules.incomplete.length} of ${originalSources.filter(({ artifact }) => artifact !== null).length} original sources could not be parsed in full (${modules.incomplete.join(", ")}).`) - 4);
				const parsed = {
					...sourceMapContext(request, fetchedUrl),
					artifact: createWebTextArtifact(text, "application/source-map+json"),
					original_sources: originalSources,
					original_module_edges: modules.edges,
					mappings
				};
				check();
				return modules.incomplete.length === 0 ? {
					...parsed,
					status: "included",
					limitation: null
				} : {
					...parsed,
					status: "partial",
					limitation: `Module edges are incomplete: ${modules.incomplete.length} of ${originalSources.filter(({ artifact }) => artifact !== null).length} original sources could not be parsed in full (${modules.incomplete.join(", ")}).`
				};
			} catch (cause) {
				context.budget.expandedBytes = retainedBytesBeforeMap;
				if (cause instanceof SourceMapFormatFailure && cause.reason === "limit") return emptySourceMapItem(request, "fetch_failed", cause.message, fetchedUrl);
				if (context.signal?.aborted === true || cause instanceof SourceMapDeadlineError) throw cause;
				return emptySourceMapItem(request, "invalid", "Source-map JSON mappings could not be decoded safely.", fetchedUrl);
			}
		};
		originalModuleEdges = (sources, check, beforeEdge) => {
			const edges = [];
			const seen = new Set();
			const incomplete = [];
			for (const source of sources) {
				check();
				if (source.artifact === null) continue;
				const sourceName = source.source;
				if (sourceName === null) {
					incomplete.push(`unnamed source at declaration ${String(source.declaration_index)}`);
					continue;
				}
				const parsed = parseJavaScriptSource(source.artifact.text, sourceParserPath(sourceName));
				check();
				if (parsed === null) {
					incomplete.push(sourceName);
					continue;
				}
				if (parsed.errors.length > 0) incomplete.push(sourceName);
				let unboundRequires;
				traverseJavaScriptAst(parsed, { enter: (node) => {
					check();
					const dependency = originalDependency(node);
					if (dependency === null) return;
					const { kind, specifier, requireCallee } = dependency;
					if (requireCallee !== undefined) {
						unboundRequires ??= new Set(analyzeParsedJavaScriptReferences(parsed, "require").filter(({ role, resolution }) => role === "read" && resolution === "unbound").map(({ location }) => `${String(location.start.line)}:${String(location.start.column)}`));
						const location = requireCallee.loc?.start;
						if (location === undefined || !unboundRequires.has(`${String(location.line)}:${String(location.column)}`)) return;
					}
					const key = `${sourceName}\0${kind}\0${specifier}`;
					if (seen.has(key)) return;
					seen.add(key);
					const edge = {
						from_source: sourceName,
						kind,
						specifier,
						resolved_source: resolveOriginalSource(specifier, sourceName)
					};
					beforeEdge(edge);
					edges.push(edge);
				} });
			}
			return {
				edges,
				incomplete
			};
		};
		sourceParserPath = (source) => {
			try {
				return new URL(source).pathname;
			} catch (cause) {
				void cause;
				return source;
			}
		};
		checkOperation = (callerSignal, operationSignal, deadlineAt) => {
			if (callerSignal?.aborted === true) throw callerSignal.reason;
			if (operationSignal?.aborted === true) throw operationSignal.reason;
			if (performance.now() >= deadlineAt) throw new SourceMapDeadlineError();
		};
		approvedUrl = (value, allowedOrigins) => {
			try {
				const parsed = new URL(value);
				return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.username === "" && parsed.password === "" && allowedOrigins.includes(parsed.origin);
			} catch (cause) {
				void cause;
				return false;
			}
		};
		sourceMapContext = (request, effectiveUrl = null) => ({
			script_key: request.scriptKey,
			declared_url: request.declaredUrl,
			effective_url: effectiveUrl
		});
		emptySourceMapItem = (request, status, limitation, effectiveUrl = null) => ({
			...sourceMapContext(request, effectiveUrl),
			status,
			artifact: null,
			original_sources: [],
			original_module_edges: [],
			mappings: [],
			limitation
		});
		sanitizeSource = (value) => {
			try {
				return sanitizeBrowserUrl(new URL(value).href).url;
			} catch (cause) {
				void cause;
				return value;
			}
		};
		preflightResolvedSourceBytes = (leaves, mapUrl, budget, resolvedByRoot, sanitizedByResolved, check) => {
			let estimate = budget.expandedBytes;
			let resolvedBytes = budget.resolvedSourceBytes;
			for (const { map } of leaves) {
				let sourcesForRoot = resolvedByRoot.get(map.sourceRoot ?? null);
				if (sourcesForRoot === undefined) {
					sourcesForRoot = new Map();
					resolvedByRoot.set(map.sourceRoot ?? null, sourcesForRoot);
				}
				for (const source of map.sources) {
					check();
					if (source === null) continue;
					const sourceKey = source;
					let resolved = sourcesForRoot.get(sourceKey);
					if (resolved === undefined) resolved = resolveJavaScriptSourceMapUrl(source, map.sourceRoot, mapUrl);
					const bytes = Buffer.byteLength(resolved, "utf8");
					if (bytes > SOURCE_MAP_RESPONSE_BYTES - resolvedBytes) throw resolvedSourceLimitFailure();
					resolvedBytes += bytes;
					sourcesForRoot.set(sourceKey, resolved);
					const sanitized = cachedSanitized(sanitizedByResolved, resolved);
					estimate += jsonBytes(sanitized);
					if (estimate > WEB_SOURCE_MAP_LIMITS.outputBytes) throw expandedOutputFailure();
				}
			}
			budget.resolvedSourceBytes = resolvedBytes;
		};
		consumeExpandedBytes = (budget, bytes) => {
			if (bytes > WEB_SOURCE_MAP_LIMITS.outputBytes - budget.expandedBytes) throw expandedOutputFailure();
			budget.expandedBytes += bytes;
		};
		expandedOutputFailure = () => new SourceMapFormatFailure("limit", `Expanded source-map evidence exceeds the ${WEB_SOURCE_MAP_LIMITS.outputBytes / (1024 * 1024)} MiB public representation budget.`);
		sourceMapOutputError = (cause, options) => new AnalysisResourceConstraintError("analyze_web_bundle", "transport", cause.message, { maximum_source_map_output_bytes: SOURCE_MAP_OUTPUT_BYTES }, {
			cause,
			...options
		});
		resolvedSourceLimitFailure = () => new SourceMapFormatFailure("limit", `Resolved source-map identities exceed the ${SOURCE_MAP_RESPONSE_BYTES / (1024 * 1024)} MiB decoder representation budget.`);
		jsonBytes = (value) => {
			let bytes = 0;
			for (const part of jsonParts(value)) bytes += Buffer.byteLength(part, "utf8");
			return bytes;
		};
		artifactMetadataBytes = (mediaType, text) => Buffer.byteLength(JSON.stringify({
			sha256: "0".repeat(64),
			bytes: Buffer.byteLength(text),
			media_type: mediaType,
			charset: "utf-8",
			text: ""
		})) - 2;
		EMPTY_SOURCE_MAP_FAILURE = emptySourceMapItem({
			scriptKey: "",
			declaredUrl: "",
			fetchUrl: ""
		}, "fetch_failed", "x".repeat(SOURCE_MAP_FAILURE_LIMITATION_RESERVE));
		SOURCE_MAP_FAILURE_ENVELOPE_BYTES = Buffer.byteLength(JSON.stringify(EMPTY_SOURCE_MAP_FAILURE)) - 4;
		SOURCE_MAP_SUCCESS_ENVELOPE_BYTES = Buffer.byteLength(JSON.stringify({
			...EMPTY_SOURCE_MAP_FAILURE,
			status: "included",
			limitation: null
		})) - 4;
		sourceMapFailureReservation = (request, effectiveUrl = null, limitation, status = "fetch_failed") => SOURCE_MAP_FAILURE_ENVELOPE_BYTES + jsonBytes(request.declaredUrl) + jsonBytes(request.scriptKey) + (effectiveUrl === null ? 0 : jsonBytes(effectiveUrl) - 4) + Math.max(0, (limitation === undefined ? 0 : jsonBytes(limitation)) - SOURCE_MAP_FAILURE_LIMITATION_RESERVE - 2) + jsonBytes(status) - jsonBytes("fetch_failed");
		sourceEntryOverheadBytes = (sourceIndex, declarationIndex) => Buffer.byteLength(`{"source_index":${String(sourceIndex)},"declaration_index":${String(declarationIndex)},"source":,"artifact":null}`);
		cachedJsonBytes = (cache, value) => {
			const cached = cache.get(value);
			if (cached !== undefined) return cached;
			const bytes = jsonBytes(value);
			cache.set(value, bytes);
			return bytes;
		};
		cachedSanitized = (cache, value) => {
			const cached = cache.get(value);
			if (cached !== undefined) return cached;
			const sanitized = sanitizeSource(value);
			cache.set(value, sanitized);
			return sanitized;
		};
		mappingRowBytes = (sourceIndex, declarationIndex, generatedLine, generatedColumn, originalLine, originalColumn) => Buffer.byteLength(`{"source_index":${String(sourceIndex)},"declaration_index":${String(declarationIndex)},"generated_line":${String(generatedLine)},"generated_column":${String(generatedColumn)},"source":,"original_line":${String(originalLine)},"original_column":${String(originalColumn)},"name":}`);
		resolveOriginalSource = (specifier, base) => {
			if (!isUrlLikeModuleSpecifier(specifier)) return null;
			try {
				return sanitizeSource(new URL(specifier, base).href);
			} catch (cause) {
				void cause;
				return null;
			}
		};
		sourceMediaType = (source) => source?.endsWith(".ts") || source?.endsWith(".tsx") || source?.endsWith(".mts") || source?.endsWith(".cts") ? "text/typescript" : "text/javascript";
		originalDependency = (node) => {
			if (t.isImportDeclaration(node) || t.isExportAllDeclaration(node) || t.isExportNamedDeclaration(node)) return node.source === null || node.source === undefined || (t.isImportDeclaration(node) ? isTypeOnlyImportDeclaration(node) : isTypeOnlyExportDeclaration(node)) ? null : {
				kind: "static_import",
				specifier: node.source.value
			};
			if (t.isImportExpression(node)) {
				const specifier = stringValue(node.source);
				return specifier === undefined ? null : {
					kind: "dynamic_import",
					specifier
				};
			}
			if ((t.isCallExpression(node) || t.isOptionalCallExpression(node)) && t.isIdentifier(node.callee, { name: "require" })) {
				const specifier = stringValue(node.arguments[0]);
				return specifier === undefined ? null : {
					kind: "require",
					specifier,
					requireCallee: node.callee
				};
			}
			if (t.isTSImportEqualsDeclaration(node) && t.isTSExternalModuleReference(node.moduleReference)) return {
				kind: "require",
				specifier: node.moduleReference.expression.value
			};
			return null;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpObservationSession.js
var observeCdpSession, TimelineCapture, waitForWindow, captureFinalUrl, frameId, scopedUrl, boundedId, safeDetail, safeNetworkError;
function init_CdpObservationSession() {
	return (init_CdpObservationSession = __esmMin((() => {
		init_analysisErrorCore();
		init_browserObservationError();
		init_CdpConnection();
		init_CdpCaptureCompleteness();
		init_CdpAuthorizedMainFrame();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpCaptureEventHelpers();
		init_CdpTargetEvents();
		observeCdpSession = async (context) => {
			const allowedOrigins = new Set(context.input.allowed_origins);
			const initial = await authorizedMainFrame({
				connection: context.connection,
				sessionId: context.sessionId,
				signal: context.signal,
				allowedOrigins,
				operation: "observe_web_session"
			});
			const initialUrl = mainFrameUrl(initial) ?? "";
			const mainFrameId = frameId(initial);
			if (mainFrameId === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const capture = new TimelineCapture(allowedOrigins, mainFrameId, initialUrl);
			const removeListener = context.connection.onEvent((event) => {
				if (cdpTargetEventMatches(event, context.sessionId)) capture.ingest(event);
			});
			const removeDisconnectListener = context.connection.onDisconnect(() => capture.targetTerminated());
			try {
				await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
				await context.connection.send("Network.enable", {}, context.sessionId, context.signal);
				await context.connection.send("Page.setLifecycleEventsEnabled", { enabled: true }, context.sessionId, context.signal);
				const armedAt = new Date().toISOString();
				await context.progress?.report({
					phase: "browser_observation",
					completed: 1,
					total: 2,
					message: "Browser observation armed; perform the requested user action now"
				});
				let endReason = await waitForWindow(context.input.observation_ms, capture, context.signal);
				if (endReason === "window_elapsed") endReason = await captureFinalUrl(context, capture, allowedOrigins);
				await context.progress?.report({
					phase: "browser_observation",
					completed: 2,
					total: 2,
					message: "Browser observation window ended",
					terminal: true
				});
				if (capture.scopeExcluded) endReason = "target_left_scope";
				return {
					browser: context.discovery.version,
					target: {
						target_id: context.target.id,
						initial_url: allowedSanitizedUrl(initialUrl, allowedOrigins)?.url ?? "",
						final_url: capture.finalUrl
					},
					window: {
						armed_at: armedAt,
						ended_at: new Date().toISOString(),
						requested_ms: context.input.observation_ms,
						end_reason: endReason
					},
					timeline: capture.timeline,
					completeness: capture.completeness.snapshot(),
					limitations: [
						"The timeline begins after REA attaches; earlier navigation and network activity is unavailable.",
						"Only navigation metadata is retained; headers, bodies, cookies, console values, and payloads are not captured by this tool.",
						"An out-of-policy destination ends collection immediately and is recorded without its URL."
					]
				};
			} finally {
				removeListener();
				removeDisconnectListener();
			}
		};
		TimelineCapture = class {
			allowedOrigins;
			mainFrameId;
			timeline = [];
			completeness = new CdpCaptureCompleteness(["timeline"]);
			finalUrl;
			#sequence = 0;
			#pendingReload = false;
			#scopeExcluded = false;
			#endReason;
			#listeners = new Set();
			constructor(allowedOrigins, mainFrameId, initialUrl) {
				this.allowedOrigins = allowedOrigins;
				this.mainFrameId = mainFrameId;
				this.finalUrl = allowedSanitizedUrl(initialUrl, allowedOrigins)?.url ?? null;
			}
			ingest(event) {
				if (this.#endReason !== undefined || this.#scopeExcluded) return;
				const params = recordValue(event.params);
				if (params === undefined) return;
				switch (event.method) {
					case "Page.frameRequestedNavigation":
						this.#navigationRequested(event, params);
						break;
					case "Page.frameNavigated":
						this.#navigationCommitted(event, params);
						break;
					case "Page.navigatedWithinDocument":
						this.#sameDocument(event, params);
						break;
					case "Network.requestWillBeSent":
						this.#redirect(params);
						break;
					case "Network.loadingFailed":
						this.#loadingFailed(params);
						break;
					case "Page.lifecycleEvent":
						this.#lifecycle(params);
						break;
					case "Inspector.targetCrashed":
					case "Target.detachedFromTarget":
						this.targetTerminated();
						break;
				}
			}
			onEnd(listener) {
				if (this.#endReason !== undefined) listener(this.#endReason);
				else this.#listeners.add(listener);
				return () => this.#listeners.delete(listener);
			}
			end(reason) {
				if (this.#endReason !== undefined) return;
				this.#endReason = reason;
				for (const listener of this.#listeners) listener(reason);
				this.#listeners.clear();
			}
			targetTerminated() {
				if (this.#endReason !== undefined) return;
				this.#add({
					type: "target_terminated",
					params: {},
					rawUrl: null,
					requestId: null,
					detail: "target_terminated"
				});
				this.end("target_terminated");
			}
			setFinalUrl(rawUrl) {
				if (this.#scopeExcluded) return;
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				this.finalUrl = destination.scope === "approved" ? destination.url : null;
			}
			get scopeExcluded() {
				return this.#scopeExcluded;
			}
			excludeTargetScope(reason) {
				if (this.#scopeExcluded) return;
				this.#scopeExcluded = true;
				this.finalUrl = null;
				this.completeness.exclude("timeline", reason);
			}
			#navigationRequested(event, params) {
				if (!isMainFrameNavigation(event, this.mainFrameId)) return;
				const reason = safeDetail(params.reason);
				this.#pendingReload = reason === "reload";
				this.#add({
					type: "navigation_requested",
					params,
					rawUrl: cdpStringValue(params.url) ?? null,
					requestId: null,
					detail: reason
				});
			}
			#navigationCommitted(event, params) {
				const frame = recordValue(params.frame);
				if (!isMainFrameNavigation(event, this.mainFrameId)) return;
				const rawUrl = cdpStringValue(frame?.url);
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				this.#add({
					type: this.#pendingReload ? "same_origin_reload" : "navigation_committed",
					params: {
						...params,
						frameId: frame?.id,
						loaderId: frame?.loaderId
					},
					rawUrl: rawUrl ?? null,
					requestId: null,
					detail: safeDetail(frame?.transitionType)
				});
				this.#pendingReload = false;
				if (destination.scope === "approved") this.finalUrl = destination.url;
				else {
					this.excludeTargetScope("out_of_target_scope");
					this.end("target_left_scope");
				}
			}
			#sameDocument(event, params) {
				if (!isMainFrameNavigation(event, this.mainFrameId)) return;
				const rawUrl = cdpStringValue(params.url);
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				this.#add({
					type: "same_document_navigation",
					params,
					rawUrl: rawUrl ?? null,
					requestId: null,
					detail: null
				});
				if (destination.scope === "approved") this.finalUrl = destination.url;
				else {
					this.excludeTargetScope("out_of_target_scope");
					this.end("target_left_scope");
				}
			}
			#redirect(params) {
				const resourceType = cdpStringValue(params.type);
				if (resourceType !== undefined && resourceType !== "Document") return;
				if (cdpStringValue(params.frameId) !== this.mainFrameId || recordValue(params.redirectResponse) === undefined) return;
				const request = recordValue(params.request);
				const rawUrl = cdpStringValue(request?.url);
				const destination = scopedUrl(rawUrl, this.allowedOrigins);
				this.#add({
					type: "redirect",
					params,
					rawUrl: rawUrl ?? null,
					requestId: cdpStringValue(params.requestId) ?? null,
					detail: null
				});
				if (destination.scope !== "approved") {
					this.excludeTargetScope("out_of_target_scope");
					this.end("target_left_scope");
				}
			}
			#loadingFailed(params) {
				const frame = cdpStringValue(params.frameId);
				if (frame !== undefined && frame !== this.mainFrameId) return;
				this.#add({
					type: "load_failed",
					params,
					rawUrl: null,
					requestId: cdpStringValue(params.requestId) ?? null,
					detail: safeNetworkError(params.errorText)
				});
			}
			#lifecycle(params) {
				if (cdpStringValue(params.frameId) !== this.mainFrameId) return;
				this.#add({
					type: "lifecycle",
					params,
					rawUrl: null,
					requestId: null,
					detail: safeDetail(params.name)
				});
			}
			#add(options) {
				const { type, params, rawUrl = null, requestId = null, detail = null } = options;
				const destination = rawUrl == null ? null : scopedUrl(rawUrl, this.allowedOrigins);
				this.#sequence += 1;
				this.timeline.push({
					sequence: this.#sequence,
					type,
					timestamp: Math.max(0, numberValue(params.timestamp) ?? 0),
					frame_id: boundedId(params.frameId),
					loader_id: boundedId(params.loaderId),
					request_id: requestId ?? null,
					url: destination?.scope === "approved" ? destination.url : null,
					destination_scope: destination?.scope ?? null,
					detail
				});
			}
		};
		waitForWindow = async (durationMs, capture, signal) => await new Promise((resolve, reject) => {
			let settled = false;
			let removeEnd = () => {};
			const finish = (reason) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				signal?.removeEventListener("abort", onAbort);
				removeEnd();
				resolve(reason);
			};
			const onAbort = () => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				removeEnd();
				reject(new AnalysisCancelledError("observe_web_session"));
			};
			const timer = setTimeout(() => finish("window_elapsed"), durationMs);
			removeEnd = capture.onEnd(finish);
			signal?.addEventListener("abort", onAbort, { once: true });
			if (signal?.aborted === true) onAbort();
		});
		captureFinalUrl = async (context, capture, allowedOrigins) => {
			if (capture.scopeExcluded) return "target_left_scope";
			const result = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			if (capture.scopeExcluded) return "target_left_scope";
			const url = mainFrameUrl(result);
			if (url !== undefined && allowedSanitizedUrl(url, allowedOrigins) !== undefined) {
				capture.setFinalUrl(url);
				return "window_elapsed";
			}
			capture.excludeTargetScope(url === undefined ? "invalid_protocol_value" : "out_of_target_scope");
			return "target_left_scope";
		};
		frameId = (result) => cdpStringValue(recordValue(recordValue(recordValue(result)?.frameTree)?.frame)?.id);
		scopedUrl = (value, allowedOrigins) => {
			const allowed = allowedSanitizedUrl(value, allowedOrigins);
			if (allowed !== undefined) return {
				url: allowed.url,
				scope: "approved"
			};
			return isHttpUrl(value) ? {
				url: null,
				scope: "outside_policy"
			} : {
				url: null,
				scope: "unsupported"
			};
		};
		boundedId = (value) => cdpStringValue(value) ?? null;
		safeDetail = (value) => {
			const detail = cdpStringValue(value)?.toLowerCase();
			return detail !== undefined && /^[a-z0-9_.:-]{1,100}$/u.test(detail) ? detail : null;
		};
		safeNetworkError = (value) => {
			const error = cdpStringValue(value);
			return error !== undefined && /^net::ERR_[A-Z0-9_]{1,100}$/u.test(error) ? error : null;
		};
	})))();
}

//#endregion
//#region dist/browser/CdpWebMcpDiscovery.js
var discoverWebMcp, initialFrameScope, ingestFrameScopeEvent, handleFrameDetached, handleFrameUpdate, updateFrameScope, hasNewDocument, removeFrameTools, isTransientFrameUrl, removeFrame, assertStableAuthorizedFrame, ingestWebMcpEvent, webMcpEventTools, normalizeTool, registrationSource, buildWebMcpResult, toolKey, integerOrNull;
function init_CdpWebMcpDiscovery() {
	return (init_CdpWebMcpDiscovery = __esmMin((() => {
		init_jsonValue();
		init_canonicalDigest();
		init_unicodeCodePointOrder();
		init_CdpCaptureCompleteness();
		init_browserObservationError();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpOptionalCommand();
		discoverWebMcp = async (context) => {
			const origins = new Set(context.input.allowed_origins);
			const limitations = ["Page-declared tool metadata is untrusted and is never registered or invoked by REA.", "Discovery uses only WebMCP.enable and toolsAdded/toolsRemoved; WebMCP.invokeTool is never called."];
			const completeness = new CdpCaptureCompleteness();
			await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
			const frameTree = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			const initialUrl = mainFrameUrl(frameTree);
			if (allowedSanitizedUrl(initialUrl, origins) === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			const frames = captureFrames(frameTree, origins, undefined, completeness).items;
			const frameUrls = initialFrameScope(frameTree, frames, completeness);
			const tools = new Map();
			const frameScope = {
				origins,
				frames: frameUrls,
				tools,
				completeness,
				transientFrames: new Set(),
				resolvedTransientFrames: new Set()
			};
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				if (ingestFrameScopeEvent(event, frameScope)) return;
				ingestWebMcpEvent({
					event,
					input: context.input,
					frames: frameUrls,
					tools,
					completeness,
					transientFrames: frameScope.transientFrames,
					resolvedTransientFrames: frameScope.resolvedTransientFrames
				});
			});
			await context.progress?.report({
				phase: "browser_observation",
				completed: 1,
				total: 2,
				message: "Enabling passive WebMCP discovery"
			});
			try {
				const enabled = await optionalCdpCommand(context, "WebMCP.enable", {}, limitations);
				const available = enabled !== undefined;
				if (!available) {
					completeness.unavailable("webmcp_tools");
				} else await delayWithCancellation(context.input.observation_ms, "discover_webmcp_tools", context.signal);
				await assertStableAuthorizedFrame(context, initialUrl, origins);
				if (frameScope.transientFrames.size > 0) completeness.attachLimited("webmcp_tools");
				return buildWebMcpResult({
					context,
					frameTree,
					tools,
					completeness,
					limitations,
					available
				});
			} finally {
				removeListener();
				await context.progress?.report({
					phase: "browser_observation",
					completed: 2,
					total: 2,
					message: "WebMCP discovery complete",
					terminal: true
				});
			}
		};
		initialFrameScope = (frameTree, frames, completeness) => {
			const scoped = new Map(frames.map((frame) => [frame.frame_id, {
				url: frame.url,
				origin: frame.origin,
				parentFrameId: frame.parent_frame_id
			}]));
			const root = recordValue(recordValue(frameTree)?.frameTree);
			if (root === undefined) return scoped;
			for (const tree of walkFrameTrees(root, () => completeness.exclude("webmcp_tools", "invalid_protocol_value"))) {
				const frame = recordValue(tree.frame);
				const frameId = cdpStringValue(frame?.id);
				const prior = frameId === undefined ? undefined : scoped.get(frameId);
				if (frameId !== undefined && prior !== undefined) scoped.set(frameId, {
					...prior,
					loaderId: cdpStringValue(frame?.loaderId)
				});
			}
			return scoped;
		};
		ingestFrameScopeEvent = (event, state) => {
			const params = recordValue(event.params);
			if (params === undefined) return false;
			switch (event.method) {
				case "Page.frameDetached": return handleFrameDetached(params, state);
				case "Page.frameNavigated": return handleFrameUpdate(recordValue(params.frame), state, true);
				case "Page.navigatedWithinDocument": return handleFrameUpdate(params, state, false);
				default: return false;
			}
		};
		handleFrameDetached = (params, state) => {
			const frameId = cdpStringValue(params.frameId);
			if (frameId === undefined) {
				state.completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return true;
			}
			removeFrame(frameId, state.frames, state.tools);
			state.transientFrames.delete(frameId);
			state.resolvedTransientFrames.delete(frameId);
			return true;
		};
		handleFrameUpdate = (frame, state, documentCommitted) => {
			if (frame === undefined) {
				state.completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return true;
			}
			const frameId = cdpStringValue(frame?.id) ?? cdpStringValue(frame?.frameId);
			if (frameId === undefined) {
				state.completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return true;
			}
			const rawUrl = cdpStringValue(frame?.url);
			if (isTransientFrameUrl(rawUrl)) {
				if (documentCommitted) {
					removeFrameTools(frameId, state.tools);
					state.transientFrames.add(frameId);
					state.resolvedTransientFrames.delete(frameId);
				}
				return true;
			}
			updateFrameScope(frame, frameId, state, documentCommitted);
			return true;
		};
		updateFrameScope = (frame, frameId, state, documentCommitted) => {
			const url = allowedSanitizedUrl(frame?.url, state.origins);
			if (url === undefined || url.origin === null) {
				removeFrameTools(frameId, state.tools);
				state.frames.delete(frameId);
				state.completeness.exclude("webmcp_tools", "out_of_target_scope");
				return;
			}
			const previous = state.frames.get(frameId);
			const loaderId = cdpStringValue(frame?.loaderId);
			if (hasNewDocument(documentCommitted, previous, url.url, loaderId)) removeFrameTools(frameId, state.tools);
			if (documentCommitted && state.transientFrames.has(frameId)) state.resolvedTransientFrames.add(frameId);
			state.frames.set(frameId, {
				url: url.url,
				origin: url.origin,
				...loaderId === undefined ? {} : { loaderId },
				parentFrameId: (cdpStringValue(frame?.parentId) ?? state.frames.get(frameId)?.parentFrameId ?? "") || null
			});
		};
		hasNewDocument = (documentCommitted, previous, url, loaderId) => documentCommitted && previous !== undefined && (previous.url !== url || loaderId !== undefined && previous.loaderId !== undefined && previous.loaderId !== loaderId);
		removeFrameTools = (frameId, tools) => {
			for (const [key, tool] of tools) if (tool.frame_id === frameId) tools.delete(key);
		};
		isTransientFrameUrl = (url) => url === "" || url === "about:blank" || url === "about:srcdoc";
		removeFrame = (frameId, frames, tools) => {
			const pending = [frameId];
			const removed = new Set();
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined || removed.has(current)) continue;
				removed.add(current);
				for (const [candidate, frame] of frames) if (frame.parentFrameId === current) pending.push(candidate);
				frames.delete(current);
			}
			for (const [key, tool] of tools) if (removed.has(tool.frame_id)) tools.delete(key);
		};
		assertStableAuthorizedFrame = async (context, initialUrl, origins) => {
			const finalTree = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			const finalUrl = mainFrameUrl(finalTree);
			if (allowedSanitizedUrl(finalUrl, origins) === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			if (finalUrl !== initialUrl) throw new BrowserObservationError("inspect_web_page", "target_changed");
		};
		ingestWebMcpEvent = (options) => {
			const { event, input, frames, tools, completeness, transientFrames, resolvedTransientFrames } = options;
			if (event.method !== "WebMCP.toolsAdded" && event.method !== "WebMCP.toolsRemoved") return;
			const params = recordValue(event.params);
			if (params === undefined) {
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return;
			}
			if (event.method === "WebMCP.toolsRemoved") {
				for (const removed of webMcpEventTools(params.tools, completeness)) {
					const name = cdpStringValue(removed.name);
					const frameId = cdpStringValue(removed.frameId);
					if (name === undefined || frameId === undefined) {
						completeness.exclude("webmcp_tools", "invalid_protocol_value");
						continue;
					}
					for (const [key, tool] of tools) if (tool.name === name && tool.frame_id === frameId) tools.delete(key);
				}
				return;
			}
			for (const declared of webMcpEventTools(params.tools, completeness)) {
				const frameId = cdpStringValue(declared.frameId);
				if (frameId !== undefined && transientFrames.has(frameId)) {
					if (!resolvedTransientFrames.has(frameId)) continue;
					transientFrames.delete(frameId);
					resolvedTransientFrames.delete(frameId);
				}
				const normalized = normalizeTool(declared, input, frames, completeness);
				if (normalized === undefined) continue;
				tools.set(normalized.tool_key, normalized);
			}
		};
		webMcpEventTools = (value, completeness) => {
			if (!Array.isArray(value)) {
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return [];
			}
			const records = [];
			for (const item of value) {
				const record = recordValue(item);
				if (record === undefined) {
					completeness.exclude("webmcp_tools", "invalid_protocol_value");
					continue;
				}
				records.push(record);
			}
			return records;
		};
		normalizeTool = (value, input, frames, completeness) => {
			const frameId = cdpStringValue(value.frameId);
			const name = cdpStringValue(value.name);
			const frame = frameId === undefined ? undefined : frames.get(frameId);
			if (frameId === undefined || name === undefined) {
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return undefined;
			}
			if (frame?.origin === null || frame === undefined) {
				completeness.exclude("webmcp_tools", "out_of_target_scope");
				return undefined;
			}
			const description = cdpStringValue(value.description) ?? "";
			const annotations = recordValue(value.annotations);
			const malformedAnnotations = Object.hasOwn(value, "annotations") && annotations === undefined;
			if (malformedAnnotations) completeness.exclude("webmcp_tools", "invalid_protocol_value");
			const annotation = (key) => {
				if (annotations === undefined || !Object.hasOwn(annotations, key)) return null;
				const hint = annotations[key];
				if (typeof hint === "boolean") return hint;
				completeness.exclude("webmcp_tools", "invalid_protocol_value");
				return null;
			};
			const consequential = annotation("consequential");
			const unknownConsequential = malformedAnnotations || annotations !== undefined && Object.hasOwn(annotations, "consequential") && typeof annotations.consequential !== "boolean";
			const declaration = jsonValueSchema.safeParse(value.inputSchema);
			if (!declaration.success) completeness.exclude("webmcp_tools", "invalid_protocol_value");
			const schema = declaration.success ? declaration.data : null;
			return {
				tool_key: toolKey(frame.url, frameId, name),
				name,
				description,
				frame_id: frameId,
				frame_url: frame.url,
				owner_origin: frame.origin,
				declaration_kind: numberValue(value.backendNodeId) === undefined ? "imperative" : "declarative",
				input_schema: schema,
				input_schema_sha256: declaration.success ? digestCanonicalValue(schema) : null,
				annotations: {
					read_only: annotation("readOnly"),
					untrusted_content: annotation("untrustedContent"),
					...unknownConsequential ? {} : { consequential },
					autosubmit: annotation("autosubmit")
				},
				registration_source: registrationSource(recordValue(value.stackTrace), new Set(input.allowed_origins)),
				trust: "page-declared-untrusted"
			};
		};
		registrationSource = (stack, allowedOrigins) => {
			const frame = recordsValue(stack?.callFrames)[0];
			const url = allowedSanitizedUrl(frame?.url, allowedOrigins);
			return frame === undefined || url === undefined ? null : {
				url: url.url,
				line: integerOrNull(frame.lineNumber),
				column: integerOrNull(frame.columnNumber)
			};
		};
		buildWebMcpResult = (options) => {
			const { context, frameTree, tools, completeness, limitations, available } = options;
			const targetUrl = mainFrameUrl(frameTree) ?? context.target.url;
			const sanitized = allowedSanitizedUrl(targetUrl, new Set(context.input.allowed_origins));
			return {
				browser: context.discovery.version,
				target: {
					target_id: context.target.id,
					url: sanitized?.url ?? "[unsupported-url]",
					origin: sanitized?.origin ?? ""
				},
				status: available ? "available" : "unavailable",
				tools: {
					total: tools.size + completeness.droppedTotal,
					items: [...tools.values()].sort((left, right) => compareUnicodeCodePoints(left.tool_key, right.tool_key))
				},
				completeness: completeness.snapshot(),
				limitations
			};
		};
		toolKey = (frameUrl, frameId, name) => `webmcp_${createHash("sha256").update(compositeKey([
			frameUrl,
			frameId,
			name
		])).digest("hex")}`;
		integerOrNull = (value) => {
			const number = numberValue(value);
			return number === undefined ? null : Math.max(0, Math.trunc(number));
		};
	})))();
}

//#endregion
//#region dist/browser/CdpScreenshot.js
var captureCdpScreenshot, observeScreenshotNavigation;
function init_CdpScreenshot() {
	return (init_CdpScreenshot = __esmMin((() => {
		init_webScreenshot();
		init_browserObservationError();
		init_CdpCaptureEventHelpers();
		init_CdpCaptureValues();
		init_CdpCaptureDocuments();
		init_CdpCaptureCompleteness();
		init_pngHeader();
		captureCdpScreenshot = async (context) => {
			const origins = new Set(context.input.allowed_origins);
			await context.progress?.report({
				phase: "browser_observation",
				completed: 1,
				total: 2,
				message: "Authorizing current screenshot frame"
			});
			await context.connection.send("Page.enable", {}, context.sessionId, context.signal);
			const before = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			const beforeUrl = mainFrameUrl(before);
			const authorized = allowedSanitizedUrl(beforeUrl, origins);
			const mainFrame = captureFrames(before, origins, 1).items[0];
			if (authorized === undefined || mainFrame === undefined) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			const initialFrame = recordValue(recordValue(recordValue(before)?.frameTree)?.frame);
			const navigation = {
				changed: false,
				leftScope: false,
				url: beforeUrl,
				loaderId: cdpStringValue(initialFrame?.loaderId)
			};
			const removeListener = context.connection.onEvent((event) => {
				if (event.sessionId !== context.sessionId) return;
				observeScreenshotNavigation(event, mainFrame.frame_id, origins, navigation);
			});
			let result;
			let after;
			try {
				result = recordValue(await context.connection.send("Page.captureScreenshot", {
					format: "png",
					fromSurface: true,
					captureBeyondViewport: false
				}, context.sessionId, context.signal));
				after = await context.connection.send("Page.getFrameTree", {}, context.sessionId, context.signal);
			} finally {
				removeListener();
			}
			const encoded = cdpStringValue(result?.data);
			const bytes = encoded === undefined ? undefined : decodeCanonicalBase64(encoded);
			if (bytes === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			const dimensions = readPngHeaderDimensions(bytes);
			if (dimensions === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			if (navigation.leftScope) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			const afterUrl = mainFrameUrl(after);
			if (navigation.changed || afterUrl !== beforeUrl || allowedSanitizedUrl(afterUrl, origins) === undefined) throw new BrowserObservationError("inspect_web_page", "target_changed");
			await context.progress?.report({
				phase: "browser_observation",
				completed: 2,
				total: 2,
				message: "Screenshot capture complete",
				terminal: true
			});
			return {
				browser: context.discovery.version,
				target: {
					target_id: context.target.id,
					url: authorized.url,
					origin: authorized.origin ?? ""
				},
				captured_at: new Date().toISOString(),
				viewport: dimensions,
				artifact: createWebScreenshotArtifact(bytes),
				completeness: new CdpCaptureCompleteness().snapshot(),
				limitations: ["The screenshot contains the visible viewport, including on-screen content.", "REA does not scroll, evaluate JavaScript, or capture beyond the current viewport."]
			};
		};
		observeScreenshotNavigation = (event, mainFrameId, origins, state) => {
			if (!isMainFrameNavigation(event, mainFrameId)) return;
			const params = recordValue(event.params);
			if (params === undefined) return;
			const frame = event.method === "Page.frameNavigated" ? recordValue(params.frame) : params;
			if (event.method === "Page.frameNavigated" && state.loaderId !== undefined && state.loaderId !== "" && cdpStringValue(frame?.loaderId) === state.loaderId && cdpStringValue(frame?.url) === state.url) return;
			state.changed = true;
			if (allowedSanitizedUrl(frame?.url, origins) === undefined) state.leftScope = true;
		};
	})))();
}

//#endregion
//#region dist/browser/PngVisualDiff.js
var PNG_COMPARISON_WORKING_MEMORY_BYTES, PNG_INFLATE_CHUNK_BYTES, comparePngScreenshots, parsePng, decodePng, admitEncodedInputPair, admitPngPair, inflateBufferAllowance, pngWorkingMemoryError, inflatePng, parseHeader, unfilter, expandRgba, applyFilter, paeth, dimensions, limitations, PNG_SIGNATURE;
function init_PngVisualDiff() {
	return (init_PngVisualDiff = __esmMin((() => {
		init_analysisErrorCore();
		init_webScreenshot();
		PNG_COMPARISON_WORKING_MEMORY_BYTES = 256 * 1024 * 1024;
		PNG_INFLATE_CHUNK_BYTES = constants.Z_DEFAULT_CHUNK;
		comparePngScreenshots = (input) => {
			admitEncodedInputPair(input.before, input.after);
			const beforePlan = parsePng(input.before, "before");
			const afterPlan = parsePng(input.after, "after");
			admitPngPair(beforePlan, afterPlan);
			const before = decodePng(beforePlan);
			const after = decodePng(afterPlan);
			if (before.width !== after.width || before.height !== after.height) return {
				status: "dimension_mismatch",
				before: dimensions(before),
				after: dimensions(after),
				channel_threshold: input.channel_threshold,
				compared_pixels: 0,
				changed_pixels: null,
				changed_ratio: null,
				maximum_channel_delta: null,
				mean_absolute_channel_delta: null,
				limitations: limitations()
			};
			let changedPixels = 0;
			let maximumDelta = 0;
			let totalDelta = 0;
			for (let offset = 0; offset < before.rgba.length; offset += 4) {
				let changed = false;
				for (let channel = 0; channel < 4; channel += 1) {
					const delta = Math.abs((before.rgba[offset + channel] ?? 0) - (after.rgba[offset + channel] ?? 0));
					totalDelta += delta;
					maximumDelta = Math.max(maximumDelta, delta);
					if (delta > input.channel_threshold) changed = true;
				}
				if (changed) changedPixels += 1;
			}
			const pixels = before.width * before.height;
			const context = {
				before: dimensions(before),
				after: dimensions(after),
				channel_threshold: input.channel_threshold,
				compared_pixels: pixels,
				maximum_channel_delta: maximumDelta,
				mean_absolute_channel_delta: totalDelta / (pixels * 4),
				limitations: limitations()
			};
			if (changedPixels === 0) return {
				...context,
				status: "identical",
				changed_pixels: 0,
				changed_ratio: 0
			};
			return {
				...context,
				status: "different",
				changed_pixels: changedPixels,
				changed_ratio: changedPixels / pixels
			};
		};
		parsePng = (artifact, field) => {
			const bytes = decodeCanonicalBase64(artifact.data_base64);
			if (bytes === undefined || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) throw new TypeError("Invalid PNG signature");
			let offset = 8;
			let header;
			const compressed = [];
			let sawEnd = false;
			let sawPalette = false;
			let imageDataEnded = false;
			let paletteEntries = 0;
			let transparentColor;
			let sawTransparency = false;
			let unsupportedReason;
			while (offset < bytes.length) {
				if (offset + 12 > bytes.length) throw new TypeError("Truncated PNG chunk");
				const length = bytes.readUInt32BE(offset);
				if (length > 2147483647) throw new TypeError("Invalid PNG chunk length");
				const type = bytes.subarray(offset + 4, offset + 8).toString("latin1");
				const dataStart = offset + 8;
				const dataEnd = dataStart + length;
				if (dataEnd + 4 > bytes.length) throw new TypeError("Truncated PNG data");
				const data = bytes.subarray(dataStart, dataEnd);
				if (crc32(bytes.subarray(offset + 4, dataEnd)) !== bytes.readUInt32BE(dataEnd)) throw new TypeError("Invalid PNG chunk checksum");
				if (!/^[A-Za-z]{4}$/u.test(type) || type[2] !== type[2]?.toUpperCase()) throw new TypeError("Invalid PNG chunk type");
				if (type !== "IDAT" && compressed.length > 0) imageDataEnded = true;
				if (type === "IHDR") {
					if (offset !== 8 || header !== undefined) throw new TypeError("Invalid PNG header order");
					header = parseHeader(data);
				} else if (header === undefined) throw new TypeError("Invalid PNG header order");
				else if (type === "tRNS") {
					if (sawTransparency || compressed.length > 0) throw new TypeError("Invalid PNG transparency order");
					sawTransparency = true;
					if (header.colorType === 2 && data.length === 6) {
						transparentColor = [
							data.readUInt16BE(0),
							data.readUInt16BE(2),
							data.readUInt16BE(4)
						];
					} else if (header.colorType === 0 && data.length === 2 || header.colorType === 3 && sawPalette && data.length > 0 && data.length <= paletteEntries) {
						unsupportedReason ??= "PNG transparency for this color type is not supported.";
					} else {
						throw new TypeError("Unsupported PNG transparency");
					}
				} else if (type === "PLTE") {
					if (sawPalette || sawTransparency || compressed.length > 0 || length === 0 || length > 768 || length % 3 !== 0 || header.colorType === 3 && length / 3 > 2 ** header.bitDepth || header.colorType !== 2 && header.colorType !== 3 && header.colorType !== 6) throw new TypeError("Invalid PNG palette");
					sawPalette = true;
					paletteEntries = length / 3;
				} else if (type === "IDAT") {
					if (imageDataEnded) throw new TypeError("Nonconsecutive PNG image data");
					compressed.push(data);
				} else if (type === "IEND") {
					if (length !== 0 || dataEnd + 4 !== bytes.length) throw new TypeError("Invalid PNG end chunk");
					sawEnd = true;
					break;
				} else if (/^[A-Z]/u.test(type)) {
					unsupportedReason ??= `Unsupported critical PNG chunk ${type}.`;
				}
				offset = dataEnd + 4;
			}
			if (header === undefined || !sawEnd || compressed.length === 0) throw new TypeError("Incomplete PNG");
			if (header.colorType === 3 && !sawPalette) throw new TypeError("Missing PNG palette");
			if (unsupportedReason !== undefined) throw new AnalysisUnsupportedTargetError("compare_web_screenshots", field, unsupportedReason);
			if (!header.supported) throw new AnalysisUnsupportedTargetError("compare_web_screenshots", field, "PNG encoding is not supported for pixel comparison.");
			const pixels = BigInt(header.width) * BigInt(header.height);
			const expectedRawBytes = (BigInt(header.width) * BigInt(header.channels) + 1n) * BigInt(header.height);
			return {
				bytes,
				width: header.width,
				height: header.height,
				channels: header.channels,
				compressed,
				transparentColor,
				expectedRawBytes,
				unfilteredBytes: pixels * BigInt(header.channels),
				rgbaBytes: pixels * 4n
			};
		};
		decodePng = (plan) => {
			const expected = Number(plan.expectedRawBytes);
			const raw = inflatePng(Buffer.concat(plan.compressed), expected + 1);
			if (raw.byteLength !== expected) throw new TypeError("Unexpected PNG size");
			return {
				width: plan.width,
				height: plan.height,
				rgba: expandRgba(unfilter(raw, plan.width, plan.height, plan.channels), plan.channels, plan.transparentColor)
			};
		};
		admitEncodedInputPair = (before, after) => {
			const sourceBytes = BigInt(before.bytes) + BigInt(after.bytes);
			if (sourceBytes > BigInt(PNG_COMPARISON_WORKING_MEMORY_BYTES)) throw pngWorkingMemoryError(sourceBytes, null, null);
		};
		admitPngPair = (before, after) => {
			const inputBytes = BigInt(before.bytes.byteLength + after.bytes.byteLength);
			const estimate = (current, retained) => {
				const compressedBytes = current.compressed.reduce((total, chunk) => total + BigInt(chunk.byteLength), 0n);
				const rgbaExpansion = current.channels === 3 ? current.rgbaBytes : 0n;
				return inputBytes + (retained?.rgbaBytes ?? 0n) + compressedBytes + inflateBufferAllowance(current.expectedRawBytes) + current.unfilteredBytes + rgbaExpansion;
			};
			const estimateBytes = [estimate(before, undefined), estimate(after, before)].reduce((maximum, value) => value > maximum ? value : maximum, 0n);
			if (estimateBytes > BigInt(PNG_COMPARISON_WORKING_MEMORY_BYTES)) throw pngWorkingMemoryError(estimateBytes, before, after);
		};
		inflateBufferAllowance = (expectedRawBytes) => {
			const chunkBytes = BigInt(PNG_INFLATE_CHUNK_BYTES);
			const maximumOutputBytes = expectedRawBytes + 1n;
			const roundUpToChunk = (bytes) => (bytes + chunkBytes - 1n) / chunkBytes * chunkBytes;
			const rejectedOutputChunks = roundUpToChunk(maximumOutputBytes + chunkBytes - 1n);
			const returnedOutputChunks = roundUpToChunk(maximumOutputBytes);
			const scratchChunk = expectedRawBytes % chunkBytes === 0n || maximumOutputBytes % chunkBytes === 0n ? chunkBytes : 0n;
			const concatenatedOutput = maximumOutputBytes > chunkBytes ? maximumOutputBytes : 0n;
			const returnedOutput = returnedOutputChunks + scratchChunk + concatenatedOutput;
			return rejectedOutputChunks > returnedOutput ? rejectedOutputChunks : returnedOutput;
		};
		pngWorkingMemoryError = (estimateBytes, before, after) => new AnalysisResourceConstraintError("compare_web_screenshots", "memory", "Screenshot comparison exceeds REA's 256 MiB estimated working-memory budget.", {
			boundary: "png-screenshot-comparison",
			estimated_working_memory_bytes: estimateBytes.toString(),
			maximum_working_memory_bytes: PNG_COMPARISON_WORKING_MEMORY_BYTES,
			before_dimensions: before === null ? null : {
				width: before.width,
				height: before.height
			},
			after_dimensions: after === null ? null : {
				width: after.width,
				height: after.height
			}
		}, { remediationAction: "Compare smaller screenshots or reduce their viewport dimensions before capture." });
		inflatePng = (compressed, maxOutputLength) => {
			try {
				return inflateSync(compressed, {
					maxOutputLength,
					chunkSize: PNG_INFLATE_CHUNK_BYTES
				});
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && (cause.code === "Z_DATA_ERROR" || cause.code === "Z_BUF_ERROR" || cause.code === "ERR_BUFFER_TOO_LARGE")) throw new TypeError("Invalid PNG image data", { cause });
				throw cause;
			}
		};
		parseHeader = (data) => {
			if (data.byteLength !== 13) throw new TypeError("Invalid PNG header");
			const width = data.readUInt32BE(0);
			const height = data.readUInt32BE(4);
			const bitDepth = data[8] ?? 0;
			const colorType = data[9] ?? -1;
			const validDepth = colorType === 0 && [
				1,
				2,
				4,
				8,
				16
			].includes(bitDepth) || colorType === 2 && [8, 16].includes(bitDepth) || colorType === 3 && [
				1,
				2,
				4,
				8
			].includes(bitDepth) || colorType === 4 && [8, 16].includes(bitDepth) || colorType === 6 && [8, 16].includes(bitDepth);
			if (width === 0 || height === 0 || width > 2147483647 || height > 2147483647 || !validDepth || data[10] !== 0 || data[11] !== 0 || data[12] !== 0 && data[12] !== 1) throw new TypeError("Invalid PNG header");
			return {
				width,
				height,
				colorType,
				bitDepth,
				interlace: data[12],
				channels: colorType === 6 ? 4 : 3,
				supported: bitDepth === 8 && (colorType === 2 || colorType === 6) && data[12] === 0
			};
		};
		unfilter = (raw, width, height, channels) => {
			const rowBytes = width * channels;
			const decoded = Buffer.alloc(rowBytes * height);
			for (let row = 0; row < height; row += 1) {
				const rawOffset = row * (rowBytes + 1);
				const outputOffset = row * rowBytes;
				const filter = raw[rawOffset];
				if (filter === undefined || filter > 4) throw new TypeError("Unsupported PNG filter");
				for (let column = 0; column < rowBytes; column += 1) {
					const source = raw[rawOffset + 1 + column] ?? 0;
					const left = column >= channels ? decoded[outputOffset + column - channels] ?? 0 : 0;
					const above = row > 0 ? decoded[outputOffset + column - rowBytes] ?? 0 : 0;
					const upperLeft = row > 0 && column >= channels ? decoded[outputOffset + column - rowBytes - channels] ?? 0 : 0;
					decoded[outputOffset + column] = applyFilter({
						filter,
						source,
						left,
						above,
						upperLeft
					});
				}
			}
			return decoded;
		};
		expandRgba = (decoded, channels, transparentColor) => {
			if (channels === 4) return decoded;
			const rgba = Buffer.alloc(decoded.length / channels * 4);
			for (let source = 0, target = 0; source < decoded.length; source += 3, target += 4) {
				rgba[target] = decoded[source] ?? 0;
				rgba[target + 1] = decoded[source + 1] ?? 0;
				rgba[target + 2] = decoded[source + 2] ?? 0;
				rgba[target + 3] = transparentColor !== undefined && transparentColor.every((value, channel) => decoded[source + channel] === value) ? 0 : 255;
			}
			return rgba;
		};
		applyFilter = (options) => {
			const { filter, source, left, above, upperLeft } = options;
			switch (filter) {
				case 0: return source;
				case 1: return source + left & 255;
				case 2: return source + above & 255;
				case 3: return source + Math.floor((left + above) / 2) & 255;
				case 4: return source + paeth(left, above, upperLeft) & 255;
				default: throw new TypeError("Unsupported PNG filter");
			}
		};
		paeth = (left, above, upperLeft) => {
			const prediction = left + above - upperLeft;
			const leftDistance = Math.abs(prediction - left);
			const aboveDistance = Math.abs(prediction - above);
			const upperLeftDistance = Math.abs(prediction - upperLeft);
			return leftDistance <= aboveDistance && leftDistance <= upperLeftDistance ? left : aboveDistance <= upperLeftDistance ? above : upperLeft;
		};
		dimensions = ({ width, height }) => ({
			width,
			height
		});
		limitations = () => [
			"Pixel comparison does not perform OCR, semantic layout analysis, or perceptual color correction.",
			"Only non-interlaced 8-bit RGB and RGBA PNG screenshots are accepted.",
			"PNG tRNS transparency is accepted only as a six-byte RGB color key; tRNS on RGBA or with another length is rejected."
		];
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
	})))();
}

//#endregion
//#region dist/browser/CdpBrowserProvider.js
var CLEANUP_DOMAINS, CdpBrowserProvider, withTargetSession, selectTargets, authorizeTarget, scopeToTargetOrigin, providerError;
function init_CdpBrowserProvider() {
	return (init_CdpBrowserProvider = __esmMin((() => {
		init_browserObservation$1();
		init_browserObservationSchemas();
		init_webBundleAnalyzer();
		init_webBundleAnalysis();
		init_browserSession();
		init_webMcpDiscovery();
		init_browserCaptureComparison();
		init_webScreenshot();
		init_analysisErrorBase();
		init_analysisErrorCore();
		init_browserObservationError();
		init_providerAdapterError();
		init_result();
		init_CdpEndpoint();
		init_CdpTargetSession();
		init_CdpPageCapture();
		init_WebSourceMapFetcher();
		init_CdpAuthorizedTarget();
		init_CdpObservationSession();
		init_CdpWebMcpDiscovery();
		init_CdpScreenshot();
		init_PngVisualDiff();
		init_providerIdentities();
		init_unicodeCodePointOrder();
		CLEANUP_DOMAINS = [
			"Network",
			"Debugger",
			"Runtime",
			"Page"
		];
		CdpBrowserProvider = class {
			identity() {
				return CDP_BROWSER_PROVIDER_IDENTITY;
			}
			async listTargets(input, options = {}) {
				try {
					const endpoint = await openCdpEndpoint(input.cdp_endpoint, "list_browser_targets", options.signal);
					await endpoint.connection?.close();
					const { discovery } = endpoint;
					const selected = selectTargets(discovery, input.allowed_origins.length === 0 ? undefined : new Set(input.allowed_origins));
					return ok(browserTargetListSchema.parse({
						browser: discovery.version,
						targets: selected.allowed,
						excluded: selected.excluded,
						limitations: [
							input.allowed_origins.length === 0 ? "All page targets with supported HTTP(S) URLs are listed." : "Only page targets whose current URL matches an explicitly requested exact origin are listed.",
							...selected.unconnectable === 0 ? [] : [`${String(selected.unconnectable)} otherwise allowed page target(s) lacked a validated direct CDP WebSocket and were excluded.`],
							...selected.allowed.some((target) => target.attached === null) ? ["CDP discovery omitted attachment state for one or more targets; attached is reported as unknown."] : []
						]
					}));
				} catch (cause) {
					return err(providerError(cause, "list_browser_targets", options.signal));
				}
			}
			async inspectPage(input, options = {}) {
				try {
					const captured = await this.#capture(input, options, "inspect_web_page");
					return ok(webPageInspectionSchema.parse(captured.inspection));
				} catch (cause) {
					return err(providerError(cause, "inspect_web_page", options.signal));
				}
			}
			async analyzeBundle(input, options = {}) {
				try {
					const captured = await this.#capture(input, options, "analyze_web_bundle");
					const sourceMaps = input.fetch_source_maps ? await fetchWebSourceMaps(captured.sourceMapRequests, {
						...input,
						allowed_origins: input.allowed_origins.length > 0 ? input.allowed_origins : [captured.inspection.target.origin]
					}, options.signal) : undefined;
					return ok(webBundleAnalysisSchema.parse(analyzeCapturedWebBundle(captured.inspection, sourceMaps)));
				} catch (cause) {
					if (options.signal?.aborted === true && cause === options.signal.reason) {
						return err(new AnalysisCancelledError("analyze_web_bundle", { cause }));
					}
					return err(providerError(cause, "analyze_web_bundle", options.signal));
				}
			}
			async observeSession(input, options = {}) {
				try {
					return ok(webObservationSessionSchema.parse(await withTargetSession(input, "observe_web_session", options, observeCdpSession)));
				} catch (cause) {
					return err(providerError(cause, "observe_web_session", options.signal));
				}
			}
			async discoverWebMcpTools(input, options = {}) {
				try {
					return ok(webMcpDiscoverySchema.parse(await withTargetSession(input, "discover_webmcp_tools", options, discoverWebMcp)));
				} catch (cause) {
					return err(providerError(cause, "discover_webmcp_tools", options.signal));
				}
			}
			async compareCaptures(input) {
				try {
					return ok(browserCaptureComparisonSchema.parse(compareBrowserCaptures(input)));
				} catch (cause) {
					return err(providerError(cause, "compare_web_captures"));
				}
			}
			async captureScreenshot(input, options = {}) {
				try {
					return ok(webScreenshotSchema.parse(await withTargetSession(input, "capture_web_screenshot", options, captureCdpScreenshot)));
				} catch (cause) {
					return err(providerError(cause, "capture_web_screenshot", options.signal));
				}
			}
			async compareScreenshots(input) {
				try {
					return ok(webScreenshotDiffSchema.parse(comparePngScreenshots(input)));
				} catch (cause) {
					if (cause instanceof TypeError) return err(new AnalysisInputError("compare_web_screenshots", { cause }, [{
						path: [],
						reason: "invalid_format",
						message: cause.message
					}]));
					return err(providerError(cause, "compare_web_screenshots"));
				}
			}
			async #capture(input, options, operation) {
				return await withTargetSession(input, operation, options, async (session) => await capturePage({
					...session,
					operation
				}));
			}
		};
		withTargetSession = async (input, operation, options, work) => {
			const endpoint = await openCdpEndpoint(input.cdp_endpoint, operation, options.signal);
			let targetSession;
			let output;
			try {
				const target = authorizeTarget(endpoint.discovery, input);
				const scopedInput = scopeToTargetOrigin(input, target);
				targetSession = endpoint.connection === undefined ? await openCdpTargetSession(endpoint.discovery, target, operation, options.signal) : await attachCdpTargetSession(endpoint.connection, target, operation, options.signal);
				output = await work({
					connection: targetSession.connection,
					sessionId: targetSession.sessionId,
					discovery: endpoint.discovery,
					target,
					input: scopedInput,
					...options.signal === undefined ? {} : { signal: options.signal },
					...options.progress === undefined ? {} : { progress: options.progress }
				});
			} finally {
				if (targetSession !== undefined) await closeCdpTargetSession(targetSession, CLEANUP_DOMAINS, options.signal);
				await endpoint.connection?.close();
			}
			if (options.signal?.aborted === true) throw new AnalysisCancelledError(operation, { cause: options.signal.reason });
			return output;
		};
		selectTargets = (discovery, allowedOrigins) => {
			const allowed = [];
			let disallowedOrigin = 0;
			let unsupportedUrl = 0;
			let nonPage = 0;
			let unconnectable = 0;
			for (const target of discovery.targets) {
				if (target.type !== "page") {
					nonPage += 1;
					continue;
				}
				const url = sanitizeBrowserUrl(target.url);
				if (url.origin === null) {
					unsupportedUrl += 1;
					continue;
				}
				if (allowedOrigins !== undefined && !allowedOrigins.has(url.origin)) {
					disallowedOrigin += 1;
					continue;
				}
				if (!hasCdpTargetWebSocket(discovery, target)) {
					unconnectable += 1;
					continue;
				}
				allowed.push({
					target_id: target.id,
					type: target.type,
					title: target.title,
					url: url.url,
					origin: url.origin,
					attached: target.attached
				});
			}
			allowed.sort((left, right) => compareUnicodeCodePoints(left.target_id, right.target_id));
			return {
				allowed,
				excluded: {
					disallowed_origin: disallowedOrigin,
					unsupported_url: unsupportedUrl,
					non_page: nonPage
				},
				unconnectable
			};
		};
		authorizeTarget = (discovery, input) => {
			return authorizeCdpTarget(discovery, input, "inspect_web_page").target;
		};
		scopeToTargetOrigin = (input, target) => {
			if (input.allowed_origins.length > 0) return input;
			const origin = sanitizeBrowserUrl(target.url).origin;
			if (origin === null) throw new BrowserObservationError("inspect_web_page", "target_not_allowed");
			return {
				...input,
				allowed_origins: [origin]
			};
		};
		providerError = (cause, operation, signal) => cause instanceof BrowserObservationError && cause.operation !== operation ? new BrowserObservationError(operation, cause.reason, { cause }) : cause instanceof AnalysisError ? cause : signal?.aborted === true ? new AnalysisCancelledError(operation, { cause }) : new ProviderAdapterError(CDP_BROWSER_PROVIDER_IDENTITY.id, operation, { cause });
	})))();
}

//#endregion
//#region dist/composition/browserObservation.js
var createBrowserObservationProvider;
function init_browserObservation() {
	return (init_browserObservation = __esmMin((() => {
		init_CdpBrowserProvider();
		createBrowserObservationProvider = () => new CdpBrowserProvider();
	})))();
}

//#endregion
init_browserObservation();
export { createBrowserObservationProvider };