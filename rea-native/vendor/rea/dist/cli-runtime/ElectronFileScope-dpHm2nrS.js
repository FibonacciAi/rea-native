import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { classifyBrowserCompleteness, compareUnicodeCodePoints, createWebTextArtifact, init_browserCompleteness, init_browserObservation, init_unicodeCodePointOrder, init_webContentArtifact, sanitizeBrowserUrl } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCancelledError, init_analysisErrorCore } from "./errorSchemas-CTRmvMl3.js";
import { BrowserObservationError, init_browserObservationError } from "./browserObservationError-Dx6xRTjb.js";
import { CdpCommandRejection, init_CdpCommandRejection, init_CdpConnection } from "./CdpTargetSession-DGX5pV9w.js";
import { MAX_ASAR_HEADER_BYTES, admitAsarHeader, init_AsarHeader } from "./AsarHeader-CnzOzYEH.js";
import { isAbsolute, join, sep } from "node:path";
import { open, realpath, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

//#region dist/browser/CdpCaptureCompleteness.js
var EVENT_SECTIONS, POLICY_REASONS, CdpCaptureCompleteness, emptyDropped;
function init_CdpCaptureCompleteness() {
	return (init_CdpCaptureCompleteness = __esmMin((() => {
		init_browserCompleteness();
		EVENT_SECTIONS = {
			scripts: "scripts",
			network_requests: "network_requests",
			console_events: "console_events",
			websocket_connections: "websocket_connections",
			websocket_frames: "websocket_frames",
			webmcp_tools: "webmcp_tools",
			timeline_events: "timeline"
		};
		POLICY_REASONS = new Set([
			"disallowed_origin",
			"unsupported_url",
			"unattributed_origin",
			"not_approved",
			"out_of_target_scope"
		]);
		CdpCaptureCompleteness = class {
			#initialAttachLimited;
			#policyFiltered = new Set();
			#attachLimited = new Set();
			#truncated = new Set();
			#unavailable = new Set();
			#excluded = new Map();
			#dropped = emptyDropped();
			constructor(initialAttachLimited = []) {
				this.#initialAttachLimited = [...initialAttachLimited];
				this.reset();
			}
			reset() {
				this.#policyFiltered.clear();
				this.#attachLimited.clear();
				this.#truncated.clear();
				this.#unavailable.clear();
				this.#excluded.clear();
				Object.assign(this.#dropped, emptyDropped());
				for (const section of this.#initialAttachLimited) this.#attachLimited.add(section);
			}
			exclude(section, reason, count = 1) {
				if (POLICY_REASONS.has(reason)) this.#policyFiltered.add(section);
				if (reason === "provider_unavailable" || reason === "invalid_protocol_value") this.#unavailable.add(section);
				if (reason === "resource_budget_exhausted") this.#truncated.add(section);
				const key = `${section}\0${reason}`;
				const existing = this.#excluded.get(key);
				const combined = count === null || existing?.count === null ? null : (existing?.count ?? 0) + count;
				this.#excluded.set(key, {
					section,
					reason,
					count: combined
				});
			}
			attachLimited(section) {
				this.#attachLimited.add(section);
			}
			unavailable(section) {
				this.#unavailable.add(section);
				this.exclude(section, "provider_unavailable", null);
			}
			truncate(section) {
				this.#truncated.add(section);
			}
			drop(kind, count = 1) {
				this.#dropped[kind] += count;
				this.#truncated.add(EVENT_SECTIONS[kind]);
			}
			get droppedTotal() {
				return Object.values(this.#dropped).reduce((sum, count) => sum + count, 0);
			}
			snapshot() {
				return classifyBrowserCompleteness({
					policyFilteredSections: this.#policyFiltered,
					attachLimitedSections: this.#attachLimited,
					truncatedSections: this.#truncated,
					unavailableSections: this.#unavailable,
					excluded: [...this.#excluded.values()],
					droppedEvents: this.#dropped
				});
			}
		};
		emptyDropped = () => ({
			scripts: 0,
			network_requests: 0,
			console_events: 0,
			websocket_connections: 0,
			websocket_frames: 0,
			webmcp_tools: 0,
			timeline_events: 0
		});
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureValues.js
var isRecord$1, recordValue, recordsValue, cdpStringValue, numberValue, scriptMetadataValues, requiredRecord, requiredScriptSource, isHttpUrl, allowedSanitizedUrl, sourceResult, sourceExcluded, delayWithCancellation;
function init_CdpCaptureValues() {
	return (init_CdpCaptureValues = __esmMin((() => {
		init_analysisErrorCore();
		init_browserObservationError();
		init_browserObservation();
		init_webContentArtifact();
		isRecord$1 = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		recordValue = (value) => isRecord$1(value) ? value : undefined;
		recordsValue = (value) => Array.isArray(value) ? value.flatMap((item) => {
			const record = recordValue(item);
			return record === undefined ? [] : [record];
		}) : [];
		cdpStringValue = (value) => typeof value === "string" ? value : undefined;
		numberValue = (value) => typeof value === "number" && Number.isFinite(value) ? value : undefined;
		scriptMetadataValues = (value) => {
			const length = numberValue(value?.length);
			return {
				hash: cdpStringValue(value?.hash) ?? null,
				length: length !== undefined && Number.isSafeInteger(length) && length >= 0 ? length : null,
				isModule: typeof value?.isModule === "boolean" ? value.isModule : null
			};
		};
		requiredRecord = (value) => {
			const record = recordValue(value);
			if (record === undefined) throw new BrowserObservationError("inspect_web_page", "protocol_error");
			return record;
		};
		requiredScriptSource = (value, operation) => {
			const source = cdpStringValue(recordValue(value)?.scriptSource);
			if (source === undefined) throw new BrowserObservationError(operation, "protocol_error", { detail: "Debugger.getScriptSource returned malformed source text: scriptSource must be a string." });
			return source;
		};
		isHttpUrl = (value) => {
			if (value === undefined) return false;
			try {
				const protocol = new URL(value).protocol;
				return protocol === "http:" || protocol === "https:";
			} catch (cause) {
				void cause;
				return false;
			}
		};
		allowedSanitizedUrl = (value, allowedOrigins) => {
			const text = cdpStringValue(value);
			if (text === undefined) return undefined;
			const sanitized = sanitizeBrowserUrl(text);
			return sanitized.origin !== null && allowedOrigins.has(sanitized.origin) ? sanitized : undefined;
		};
		sourceResult = (source) => ({
			included: true,
			artifact: createWebTextArtifact(source, "text/javascript")
		});
		sourceExcluded = (reason) => ({
			included: false,
			reason
		});
		delayWithCancellation = async (durationMs, operation, signal) => {
			const maximumTimerDelay = 2147483647;
			let remaining = durationMs;
			while (remaining > 0) {
				if (signal?.aborted === true) throw new AnalysisCancelledError(operation);
				const delay = Math.min(remaining, maximumTimerDelay);
				await new Promise((resolve, reject) => {
					const timer = setTimeout(() => {
						signal?.removeEventListener("abort", onAbort);
						resolve();
					}, delay);
					const onAbort = () => {
						clearTimeout(timer);
						signal?.removeEventListener("abort", onAbort);
						reject(new AnalysisCancelledError(operation));
					};
					signal?.addEventListener("abort", onAbort, { once: true });
					if (signal?.aborted === true) onAbort();
				});
				remaining -= delay;
			}
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureEventHelpers.js
var isMainFrameNavigation, firstCallFrame, initiatorLocation, exclusionReasonForUrl, integerOrNull, executionContextKey, isJsonContentType, isJsonMediaType, consolePrimitive, BASE64, decodeBase64;
function init_CdpCaptureEventHelpers() {
	return (init_CdpCaptureEventHelpers = __esmMin((() => {
		init_CdpCaptureValues();
		isMainFrameNavigation = (event, mainFrameId) => {
			const params = recordValue(event.params);
			if (params === undefined) return false;
			const frameId = event.method === "Page.frameNavigated" ? cdpStringValue(recordValue(params.frame)?.id) : event.method === "Page.frameRequestedNavigation" || event.method === "Page.navigatedWithinDocument" ? cdpStringValue(params.frameId) : undefined;
			return frameId === mainFrameId;
		};
		firstCallFrame = (value) => recordsValue(value?.callFrames)[0];
		initiatorLocation = (initiator) => {
			let stack = recordValue(initiator?.stack);
			for (let depth = 0; depth < 32 && stack !== undefined; depth += 1) {
				const frame = firstCallFrame(stack);
				if (frame !== undefined) return frame;
				stack = recordValue(stack.parent);
			}
			return cdpStringValue(initiator?.url) === undefined ? undefined : initiator;
		};
		exclusionReasonForUrl = (value) => value === undefined || value === "" ? "unattributed_origin" : isHttpUrl(value) ? "disallowed_origin" : "unsupported_url";
		integerOrNull = (value) => {
			const number = numberValue(value);
			return number === undefined ? null : Math.max(0, Math.trunc(number));
		};
		executionContextKey = (value) => {
			const identifier = numberValue(value);
			return identifier !== undefined && Number.isSafeInteger(identifier) ? String(identifier) : null;
		};
		isJsonContentType = (headers) => {
			if (headers === undefined) return false;
			for (const [name, value] of Object.entries(headers)) if (name.toLowerCase() === "content-type" && isJsonMediaType(cdpStringValue(value))) return true;
			return false;
		};
		isJsonMediaType = (value) => {
			const mediaType = value?.split(";", 1)[0]?.trim().toLowerCase();
			return mediaType === "application/json" || mediaType?.endsWith("+json") === true;
		};
		consolePrimitive = (value) => {
			const type = cdpStringValue(value.type);
			switch (type) {
				case "string": return typeof value.value === "string" ? {
					type,
					text: value.value
				} : undefined;
				case "boolean": return typeof value.value === "boolean" ? {
					type,
					text: String(value.value)
				} : undefined;
				case "number": return typeof value.value === "number" ? {
					type,
					text: String(value.value)
				} : typeof value.unserializableValue === "string" ? {
					type,
					text: value.unserializableValue
				} : undefined;
				case "bigint": return typeof value.unserializableValue === "string" ? {
					type,
					text: value.unserializableValue
				} : undefined;
				case "undefined": return {
					type,
					text: "undefined"
				};
				default: return undefined;
			}
		};
		BASE64 = /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{2}==|[A-Za-z\d+/]{3}=)?$/u;
		decodeBase64 = (value) => value.length % 4 === 0 && BASE64.test(value) ? Buffer.from(value, "base64") : undefined;
	})))();
}

//#endregion
//#region dist/browser/CdpSnapshotStrings.js
var CDP_EMPTY_STRING_INDEX, cdpSnapshotString, cdpSnapshotValueString, cdpSnapshotAttributesResolve;
function init_CdpSnapshotStrings() {
	return (init_CdpSnapshotStrings = __esmMin((() => {
		init_CdpCaptureValues();
		CDP_EMPTY_STRING_INDEX = -1;
		cdpSnapshotString = (strings, index) => {
			const integer = numberValue(index);
			if (integer === undefined || !Number.isSafeInteger(integer) || integer < 0) return undefined;
			return strings[integer];
		};
		cdpSnapshotValueString = (strings, index) => numberValue(index) === CDP_EMPTY_STRING_INDEX ? "" : cdpSnapshotString(strings, index);
		cdpSnapshotAttributesResolve = (strings, attributes) => attributes.length % 2 === 0 && attributes.every((attribute, offset) => attribute !== undefined && (offset % 2 === 0 ? cdpSnapshotString(strings, attribute) : cdpSnapshotValueString(strings, attribute)) !== undefined);
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureDomSvg.js
var SVG_NAMESPACE, XLINK_NAMESPACE, capturedSvgNodeKind, numberArray$1, xmlDocument, createDocumentSvgAncestry, domSvgLink, resolveXmlElements, applyDeclarations, xmlnsPrefix, elementNamespace, xlinkHrefValue, validSvgSourceNode;
function init_CdpCaptureDomSvg() {
	return (init_CdpCaptureDomSvg = __esmMin((() => {
		init_CdpCaptureValues();
		init_CdpSnapshotStrings();
		SVG_NAMESPACE = "http://www.w3.org/2000/svg";
		XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";
		capturedSvgNodeKind = (query, result) => {
			const node = recordValue(recordValue(result)?.node);
			if (node?.backendNodeId !== query.backendNodeId || node.nodeName !== query.nodeName || node.nodeType !== 1) return undefined;
			return node.isSVG === undefined ? false : typeof node.isSVG === "boolean" ? node.isSVG : undefined;
		};
		numberArray$1 = (value) => Array.isArray(value) ? value.map((item) => {
			const number = numberValue(item);
			return number !== undefined && Number.isSafeInteger(number) ? number : undefined;
		}) : [];
		xmlDocument = (nodes) => {
			const documentIndex = nodes.nodeTypes.findIndex((nodeType) => nodeType === 9);
			if (documentIndex < 0) return false;
			if (!validSvgSourceNode(nodes, documentIndex) || nodes.parents[documentIndex] !== -1) return undefined;
			for (let index = 0; index < nodes.nodeTypes.length; index += 1) {
				if (nodes.nodeTypes[index] !== 1) continue;
				if (nodes.parents[index] !== documentIndex) continue;
				const name = cdpSnapshotString(nodes.strings, nodes.nodeNames[index]);
				if (name === undefined || !validSvgSourceNode(nodes, index)) return undefined;
				if (name === "HTML") return false;
				if (name === "html" || name.includes(":")) return true;
				const attributes = numberArray$1(nodes.attributes[index]);
				for (let offset = 0; offset + 1 < attributes.length; offset += 2) {
					const value = attributes[offset];
					const attributeName = cdpSnapshotString(nodes.strings, value);
					if (attributeName === undefined) return undefined;
					if (xmlnsPrefix(attributeName) !== undefined) return true;
				}
				return false;
			}
			return false;
		};
		createDocumentSvgAncestry = (nodes) => {
			const xml = xmlDocument(nodes);
			return {
				xml,
				xmlLinks: xml === true ? resolveXmlElements(nodes) : new Map()
			};
		};
		domSvgLink = (ancestry, index) => {
			if (ancestry.xml === false) {
				return {
					svgElement: false,
					xmlDocument: false,
					xlinkHref: undefined
				};
			}
			if (ancestry.xml === undefined) {
				return {
					svgElement: false,
					xmlDocument: undefined,
					xlinkHref: undefined
				};
			}
			const resolved = ancestry.xmlLinks.get(index);
			if (resolved === undefined) {
				return {
					svgElement: false,
					xmlDocument: undefined,
					xlinkHref: undefined
				};
			}
			return {
				svgElement: resolved.svgElement,
				xmlDocument: true,
				xlinkHref: resolved.xlinkHref
			};
		};
		resolveXmlElements = (nodes) => {
			const children = new Map();
			const pending = [];
			for (let node = 0; node < nodes.nodeNames.length; node += 1) {
				const parent = nodes.parents[node];
				if (parent === undefined || parent < -1 || parent >= nodes.nodeNames.length) continue;
				if (parent < 0) pending.push({ node });
				else if (parent < nodes.nodeNames.length && parent !== node) {
					const siblings = children.get(parent);
					if (siblings === undefined) children.set(parent, [node]);
					else siblings.push(node);
				}
			}
			const bindings = new Map();
			const resolved = new Map();
			while (pending.length > 0) {
				const step = pending.pop();
				if (step === undefined) break;
				if ("restore" in step) {
					for (const { prefix, previous } of step.restore) {
						if (previous === undefined) bindings.delete(prefix);
						else bindings.set(prefix, previous);
					}
					continue;
				}
				const { node } = step;
				if (!validSvgSourceNode(nodes, node)) continue;
				const attributes = numberArray$1(nodes.attributes[node]);
				const restore = applyDeclarations(bindings, attributes, nodes.strings);
				const svgElement = nodes.nodeTypes[node] === 1 && elementNamespace(cdpSnapshotString(nodes.strings, nodes.nodeNames[node]), bindings) === SVG_NAMESPACE;
				resolved.set(node, {
					svgElement,
					xlinkHref: svgElement ? xlinkHrefValue(attributes, nodes.strings, bindings) : undefined
				});
				pending.push({ restore });
				for (const child of children.get(node) ?? []) pending.push({ node: child });
			}
			return resolved;
		};
		applyDeclarations = (bindings, attributes, strings) => {
			const restore = [];
			const seen = new Set();
			for (let index = 0; index + 1 < attributes.length; index += 2) {
				const nameIndex = attributes[index];
				const valueIndex = attributes[index + 1];
				if (nameIndex === undefined || valueIndex === undefined) continue;
				const name = cdpSnapshotString(strings, nameIndex);
				const value = cdpSnapshotValueString(strings, valueIndex);
				if (name === undefined || value === undefined) continue;
				const prefix = xmlnsPrefix(name);
				if (prefix === undefined || seen.has(prefix)) continue;
				seen.add(prefix);
				restore.push({
					prefix,
					previous: bindings.get(prefix)
				});
				if (value.length === 0) bindings.delete(prefix);
				else bindings.set(prefix, value);
			}
			return restore;
		};
		xmlnsPrefix = (name) => {
			if (name === undefined) return undefined;
			if (name === "xmlns") return "";
			if (!name.startsWith("xmlns:")) return undefined;
			const prefix = name.slice("xmlns:".length);
			if (prefix.length === 0 || prefix === "xmlns" || prefix.includes(":")) return undefined;
			return prefix;
		};
		elementNamespace = (nodeName, bindings) => {
			if (nodeName === undefined) return "";
			const colon = nodeName.indexOf(":");
			if (colon < 0) return bindings.get("") ?? "";
			const prefix = nodeName.slice(0, colon);
			const local = nodeName.slice(colon + 1);
			if (prefix.length === 0 || local.length === 0 || local.includes(":") || prefix === "xmlns") return "";
			return bindings.get(prefix) ?? "";
		};
		xlinkHrefValue = (attributes, strings, bindings) => {
			const seen = new Set();
			for (let index = 0; index + 1 < attributes.length; index += 2) {
				const nameIndex = attributes[index];
				const valueIndex = attributes[index + 1];
				if (nameIndex === undefined || valueIndex === undefined) continue;
				const name = cdpSnapshotString(strings, nameIndex);
				if (name === undefined) continue;
				if (seen.has(name)) continue;
				seen.add(name);
				const colon = name.indexOf(":");
				if (colon <= 0) continue;
				const prefix = name.slice(0, colon);
				const local = name.slice(colon + 1);
				if (local !== "href" || bindings.get(prefix) !== XLINK_NAMESPACE) continue;
				return cdpSnapshotValueString(strings, valueIndex);
			}
			return undefined;
		};
		validSvgSourceNode = (nodes, index) => {
			if (nodes.nodeTypes[index] === undefined || cdpSnapshotString(nodes.strings, nodes.nodeNames[index]) === undefined) return false;
			const rawAttributes = nodes.attributes[index];
			if (!Array.isArray(rawAttributes)) return false;
			const attributes = numberArray$1(rawAttributes);
			return attributes.length === rawAttributes.length && cdpSnapshotAttributesResolve(nodes.strings, attributes);
		};
	})))();
}

//#endregion
//#region dist/browser/CdpCaptureDocuments.js
/** Project one snapshot, requesting bounded batches of SVG identity facts. */
function* captureDom(result, allowedOrigins, input, completeness) {
	const root = requiredRecord(result);
	const strings = Array.isArray(root.strings) ? root.strings.map(cdpStringValue) : [];
	const nodes = [];
	const urls = [];
	const agentHints = [];
	let excludedUrls = 0;
	let total = 0;
	let unresolvedSvgNodes = 0;
	if (!Array.isArray(root.strings)) excludeDocumentEvidence(completeness, "invalid_protocol_value", null);
	for (const document of snapshotDocuments(root.documents, completeness)) {
		const documentUrl = cdpSnapshotString(strings, document.documentURL);
		if (documentUrl === undefined) {
			excludeDocumentEvidence(completeness, "invalid_protocol_value");
			continue;
		}
		if (allowedSanitizedUrl(documentUrl, allowedOrigins) === undefined) {
			excludeDocumentEvidence(completeness, exclusionReasonForUrl(documentUrl));
			continue;
		}
		const baseUrlValue = document.baseURL === undefined ? documentUrl : cdpSnapshotValueString(strings, document.baseURL);
		if (baseUrlValue === undefined) {
			excludeDocumentEvidence(completeness, "invalid_protocol_value");
			continue;
		}
		const baseUrl = baseUrlValue || documentUrl;
		const documentNodes = recordValue(document.nodes);
		if (documentNodes === undefined) {
			excludeDocumentEvidence(completeness, "invalid_protocol_value");
			continue;
		}
		const rawNodeTypes = numberArray(documentNodes.nodeType);
		const rawNodeNames = numberArray(documentNodes.nodeName);
		const rawNodeValues = numberArray(documentNodes.nodeValue);
		const rawParents = numberArray(documentNodes.parentIndex);
		const rawAttributes = Array.isArray(documentNodes.attributes) ? documentNodes.attributes : undefined;
		if (rawNodeTypes === undefined || rawNodeNames === undefined || rawNodeValues === undefined || rawParents === undefined || rawAttributes === undefined || rawNodeNames.length !== rawNodeTypes.length || rawNodeValues.length !== rawNodeTypes.length || rawParents.length !== rawNodeTypes.length) {
			excludeDocumentEvidence(completeness, "invalid_protocol_value");
			continue;
		}
		if (rawAttributes.length > rawNodeTypes.length) excludeDocumentEvidence(completeness, "invalid_protocol_value", rawAttributes.length - rawNodeTypes.length);
		const backendNodeIds = Array.isArray(documentNodes.backendNodeId) ? documentNodes.backendNodeId : [];
		const baseIndex = total;
		total += rawNodeTypes.length;
		const ancestry = createDocumentSvgAncestry({
			nodeTypes: rawNodeTypes,
			nodeNames: rawNodeNames,
			parents: rawParents,
			strings,
			attributes: rawAttributes
		});
		const pendingMetadata = [];
		for (let index = 0; index < rawNodeTypes.length; index += 1) {
			const nodeType = rawNodeTypes[index];
			const nodeNameIndex = rawNodeNames[index];
			const nodeValueIndex = rawNodeValues[index];
			const parent = rawParents[index];
			const attributeIndexes = numberArray(rawAttributes[index]);
			const nodeName = cdpSnapshotString(strings, nodeNameIndex);
			const nodeValue = cdpSnapshotValueString(strings, nodeValueIndex);
			if (nodeType === undefined || nodeName === undefined || nodeValue === undefined || parent === undefined || parent < -1 || parent === index || parent >= rawNodeTypes.length || attributeIndexes === undefined || !cdpSnapshotAttributesResolve(strings, attributeIndexes)) {
				excludeDocumentEvidence(completeness, "invalid_protocol_value");
				continue;
			}
			const attributes = attributeIndexes;
			const nodeIndex = baseIndex + index;
			const attributeNames = uniqueAttributeNames(attributes, strings);
			const svgLink = domSvgLink(ancestry, index);
			if (svgLink.xmlDocument === undefined) completeness?.exclude("metadata", "invalid_protocol_value");
			let svgQuery;
			if (svgLink.xmlDocument === false && nodeType === 1 && attributeNames.includes("xlink:href") && !attributeNames.includes("href")) {
				const backendNodeId = numberValue(backendNodeIds[index]);
				svgQuery = backendNodeId !== undefined && Number.isSafeInteger(backendNodeId) && backendNodeId > 0 ? {
					backendNodeId,
					nodeName
				} : null;
			}
			nodes.push({
				index: nodeIndex,
				parent_index: parent < 0 ? -1 : baseIndex + parent,
				node_type: nodeType,
				node_name: nodeName,
				node_value_length: nodeValue.length,
				attribute_names: attributeNames
			});
			pendingMetadata.push({
				svgQuery,
				options: {
					strings,
					attributes,
					baseUrl: nodeName.toLowerCase() === "base" ? documentUrl : baseUrl,
					documentUrl,
					nodeIndex,
					nodeName,
					allowedOrigins,
					...svgLink
				}
			});
			if (pendingMetadata.length === DOM_METADATA_BATCH_SIZE || index === rawNodeTypes.length - 1) {
				const metadata = yield* captureDomMetadata(pendingMetadata, completeness);
				urls.push(...metadata.urls);
				agentHints.push(...metadata.agentHints);
				excludedUrls += metadata.excludedUrls;
				unresolvedSvgNodes += metadata.unresolvedSvgNodes;
				pendingMetadata.length = 0;
			}
		}
		if (pendingMetadata.length > 0) {
			const metadata = yield* captureDomMetadata(pendingMetadata, completeness);
			urls.push(...metadata.urls);
			agentHints.push(...metadata.agentHints);
			excludedUrls += metadata.excludedUrls;
			unresolvedSvgNodes += metadata.unresolvedSvgNodes;
			pendingMetadata.length = 0;
		}
	}
	return {
		total,
		nodes,
		urls,
		agentHints,
		excludedUrls,
		unresolvedSvgNodes
	};
}
function* captureDomMetadata(pending, completeness) {
	const queries = pending.flatMap(({ svgQuery }) => svgQuery == null ? [] : [svgQuery]);
	const kinds = queries.length > 0 ? yield queries : [];
	const urls = [];
	const agentHints = [];
	let queryIndex = 0;
	let unresolvedSvgNodes = 0;
	let excludedUrls = 0;
	for (const { options, svgQuery } of pending) {
		let svgElement = options.svgElement;
		if (svgQuery !== undefined) {
			const kind = svgQuery === null ? undefined : kinds[queryIndex++];
			svgElement = kind === true;
			if (kind === undefined) {
				unresolvedSvgNodes += 1;
				completeness?.exclude("metadata", "provider_unavailable");
			}
		}
		const metadata = domMetadata({
			...options,
			svgElement
		});
		for (const url of metadata.urls) {
			urls.push(url);
			if (url.destination_scope !== "approved") {
				excludedUrls += 1;
				completeness?.exclude("metadata", url.destination_scope === "outside_policy" ? "disallowed_origin" : "unsupported_url");
			}
		}
		agentHints.push(...metadata.agentHints);
	}
	return {
		urls,
		agentHints,
		unresolvedSvgNodes,
		excludedUrls
	};
}
var captureFrames, mainFrameUrl, captureResources, walkFrameTrees, DOM_METADATA_BATCH_SIZE, excludeDocumentEvidence, snapshotDocuments, captureAccessibility, ACCESSIBILITY_STATE_NAMES, accessibilityStates, axText, uniqueAttributeNames, numberArray, hrefAttributeValue, domMetadata, domDestination, domUrlAttributes, agentRelValues;
function init_CdpCaptureDocuments() {
	return (init_CdpCaptureDocuments = __esmMin((() => {
		init_CdpCaptureValues();
		init_CdpSnapshotStrings();
		init_CdpCaptureEventHelpers();
		init_CdpCaptureDomSvg();
		init_unicodeCodePointOrder();
		captureFrames = (result, allowedOrigins, maximum, completeness) => {
			const root = recordValue(recordValue(result)?.frameTree);
			if (root === undefined) {
				completeness?.exclude("frames", "invalid_protocol_value");
				return { items: [] };
			}
			const items = [];
			for (const tree of walkFrameTrees(root, (omittedCount) => completeness?.exclude("frames", "invalid_protocol_value", omittedCount))) {
				const frame = recordValue(tree.frame);
				const frameId = cdpStringValue(frame?.id);
				const sanitized = allowedSanitizedUrl(frame?.url, allowedOrigins);
				if (frame === undefined || frameId === undefined) {
					completeness?.exclude("frames", "invalid_protocol_value");
					continue;
				}
				if (sanitized === undefined || sanitized.origin === null) {
					completeness?.exclude("frames", exclusionReasonForUrl(cdpStringValue(frame.url)));
					continue;
				}
				if (maximum !== undefined && items.length >= maximum) continue;
				const parentFrameId = cdpStringValue(frame.parentId);
				if ((tree !== root || Object.hasOwn(frame, "parentId")) && (parentFrameId === undefined || parentFrameId.length === 0)) completeness?.exclude("frames", "invalid_protocol_value");
				items.push({
					frame_id: frameId,
					parent_frame_id: parentFrameId ?? null,
					url: sanitized.url,
					origin: sanitized.origin
				});
			}
			return { items };
		};
		mainFrameUrl = (result) => cdpStringValue(recordValue(recordValue(requiredRecord(result).frameTree)?.frame)?.url);
		captureResources = (result, allowedOrigins, completeness) => {
			const root = recordValue(recordValue(result)?.frameTree);
			if (root === undefined) {
				completeness?.exclude("resources", "invalid_protocol_value");
				return { items: [] };
			}
			const items = [];
			for (const tree of walkFrameTrees(root, (omittedCount) => completeness?.exclude("resources", "invalid_protocol_value", omittedCount))) {
				if (!Array.isArray(tree.resources)) {
					completeness?.exclude("resources", "invalid_protocol_value", null);
					continue;
				}
				for (const entry of tree.resources) {
					const resource = recordValue(entry);
					if (resource === undefined) {
						completeness?.exclude("resources", "invalid_protocol_value");
						continue;
					}
					const url = allowedSanitizedUrl(resource.url, allowedOrigins);
					if (url === undefined || url.origin === null) {
						completeness?.exclude("resources", exclusionReasonForUrl(cdpStringValue(resource.url)));
						continue;
					}
					const type = cdpStringValue(resource.type);
					const mimeType = cdpStringValue(resource.mimeType);
					if (type === undefined || type.length === 0 || mimeType === undefined) {
						completeness?.exclude("resources", "invalid_protocol_value");
						continue;
					}
					const rawContentSize = numberValue(resource.contentSize);
					const contentSize = rawContentSize !== undefined && rawContentSize >= 0 ? rawContentSize : null;
					if (resource.contentSize !== undefined && contentSize === null) completeness?.exclude("resources", "invalid_protocol_value");
					items.push({
						rawUrl: cdpStringValue(resource.url) ?? "",
						url: url.url,
						origin: url.origin,
						type,
						mime_type: mimeType,
						content_size: contentSize
					});
				}
			}
			return { items };
		};
		walkFrameTrees = function* (root, onMalformedChild) {
			const pending = [root];
			while (pending.length > 0) {
				const tree = pending.pop();
				if (tree === undefined) return;
				const rawChildren = tree.childFrames;
				if (rawChildren !== undefined && !Array.isArray(rawChildren)) onMalformedChild?.(null);
				const children = Array.isArray(rawChildren) ? rawChildren.flatMap((child) => {
					const parsed = recordValue(child);
					if (parsed === undefined) onMalformedChild?.(null);
					return parsed === undefined ? [] : [parsed];
				}) : [];
				for (let index = children.length - 1; index >= 0; index -= 1) {
					const child = children[index];
					if (child !== undefined) pending.push(child);
				}
				yield tree;
			}
		};
		DOM_METADATA_BATCH_SIZE = 8;
		excludeDocumentEvidence = (completeness, reason, count = 1) => {
			completeness?.exclude("dom", reason, count);
			completeness?.exclude("metadata", reason, count);
		};
		snapshotDocuments = (value, completeness) => {
			if (!Array.isArray(value) || value.length === 0) {
				excludeDocumentEvidence(completeness, "invalid_protocol_value", null);
				return [];
			}
			return value.flatMap((item) => {
				const document = recordValue(item);
				if (document === undefined) excludeDocumentEvidence(completeness, "invalid_protocol_value");
				return document === undefined ? [] : [document];
			});
		};
		captureAccessibility = (results, options) => {
			const all = results.flatMap((result) => recordsValue(requiredRecord(result).nodes));
			const nodeIds = new Set(all.flatMap((node) => {
				const nodeId = cdpStringValue(node.nodeId);
				return nodeId === undefined ? [] : [nodeId];
			}));
			let excludedFields = 0;
			const nodes = all.map((node) => {
				const captureText = (value) => {
					const raw = cdpStringValue(recordValue(value)?.value);
					if (raw === undefined) return null;
					if (!options.includeText) {
						excludedFields += 1;
						return null;
					}
					return raw;
				};
				return {
					node_id: cdpStringValue(node.nodeId) ?? "",
					parent_id: cdpStringValue(node.parentId) ?? null,
					role: axText(node.role),
					name: captureText(node.name),
					description: captureText(node.description),
					ignored: node.ignored === true,
					states: accessibilityStates(node.properties)
				};
			});
			return {
				total: all.length,
				nodes,
				treeIncomplete: all.some((node) => Array.isArray(node.childIds) && node.childIds.some((childId) => {
					const id = cdpStringValue(childId);
					return id !== undefined && !nodeIds.has(id);
				})),
				textCapture: {
					status: options.unavailable ? "unavailable" : !options.includeText ? "not_approved" : "included",
					retained_bytes: nodes.reduce((total, node) => total + Buffer.byteLength(node.name ?? "") + Buffer.byteLength(node.description ?? ""), 0),
					excluded_fields: excludedFields
				}
			};
		};
		ACCESSIBILITY_STATE_NAMES = new Set([
			"atomic",
			"autocomplete",
			"busy",
			"checked",
			"disabled",
			"editable",
			"expanded",
			"focusable",
			"focused",
			"hasPopup",
			"hidden",
			"invalid",
			"level",
			"live",
			"modal",
			"multiline",
			"multiselectable",
			"orientation",
			"pressed",
			"readonly",
			"required",
			"selected",
			"valuemax",
			"valuemin"
		]);
		accessibilityStates = (value) => {
			const states = new Map();
			for (const property of recordsValue(value)) {
				const name = cdpStringValue(property.name);
				if (name === undefined || !ACCESSIBILITY_STATE_NAMES.has(name)) continue;
				const raw = recordValue(property.value)?.value;
				const state = typeof raw === "boolean" ? raw : typeof raw === "number" ? numberValue(raw) : typeof raw === "string" ? raw : undefined;
				if (state !== undefined) states.set(name, state);
			}
			return [...states].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([name, state]) => ({
				name,
				value: state
			}));
		};
		axText = (value) => cdpStringValue(recordValue(value)?.value) ?? null;
		uniqueAttributeNames = (attributeIndexes, strings) => {
			const names = [];
			const seen = new Set();
			for (let index = 0; index < attributeIndexes.length; index += 2) {
				const name = cdpSnapshotString(strings, attributeIndexes[index]);
				if (name === undefined) continue;
				if (seen.has(name)) continue;
				seen.add(name);
				names.push(name);
			}
			return names;
		};
		numberArray = (value) => {
			if (!Array.isArray(value)) return undefined;
			return value.map((item) => {
				const number = numberValue(item);
				return number !== undefined && Number.isSafeInteger(number) ? number : undefined;
			});
		};
		hrefAttributeValue = (pairs, attribute, options) => {
			const declared = pairs.get(attribute);
			if (declared !== undefined) return declared;
			if (attribute !== "href" || !options.svgElement) return undefined;
			return options.xmlDocument ? options.xlinkHref : pairs.get("xlink:href");
		};
		domMetadata = (options) => {
			const { strings, attributes, baseUrl, documentUrl, nodeIndex, nodeName, allowedOrigins } = options;
			const pairs = new Map();
			for (let index = 0; index + 1 < attributes.length; index += 2) {
				const name = cdpSnapshotString(strings, attributes[index]);
				const value = cdpSnapshotValueString(strings, attributes[index + 1]);
				if (name === undefined || value === undefined) continue;
				if (!pairs.has(name)) pairs.set(name, value);
			}
			const urls = [];
			for (const attribute of domUrlAttributes) {
				const value = hrefAttributeValue(pairs, attribute, options);
				if (value === undefined) continue;
				const tagName = nodeName.toLowerCase();
				const usesDocumentUrl = tagName === "form" && attribute === "action" && /^[\t\n\f\r ]*$/u.test(value) || (tagName === "button" || tagName === "input") && attribute === "formaction" && value === "";
				const destination = domDestination(usesDocumentUrl ? documentUrl : value, baseUrl, allowedOrigins);
				urls.push({
					node_index: nodeIndex,
					attribute,
					url: destination.url,
					destination_scope: destination.scope
				});
			}
			const rel = (pairs.get("rel") ?? "").toLowerCase().split(/[\t\n\f\r ]+/u).filter((value) => agentRelValues.includes(value));
			const href = urls.find(({ attribute }) => attribute === "href")?.url ?? null;
			const agentHints = nodeName.toLowerCase() === "link" && rel.length > 0 ? rel.map((declaration) => ({
				mechanism: "dom_link_rel",
				declaration,
				url: href,
				trust: "page-declared-untrusted"
			})) : [];
			return {
				urls,
				agentHints
			};
		};
		domDestination = (value, baseUrl, allowedOrigins) => {
			try {
				const parsed = new URL(value, baseUrl);
				if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
					url: null,
					scope: "unsupported"
				};
				if (!allowedOrigins.has(parsed.origin)) return {
					url: null,
					scope: "outside_policy"
				};
				return {
					url: allowedSanitizedUrl(parsed.href, allowedOrigins)?.url ?? null,
					scope: "approved"
				};
			} catch (cause) {
				void cause;
				return {
					url: null,
					scope: "unsupported"
				};
			}
		};
		domUrlAttributes = [
			"href",
			"src",
			"action",
			"formaction",
			"poster"
		];
		agentRelValues = [
			"mcp",
			"model-context",
			"ai-plugin",
			"service-desc"
		];
	})))();
}

//#endregion
//#region dist/browser/CdpOptionalCommand.js
var optionalCdpCommand;
function init_CdpOptionalCommand() {
	return (init_CdpOptionalCommand = __esmMin((() => {
		init_CdpCommandRejection();
		init_CdpConnection();
		optionalCdpCommand = async (context, method, parameters, limitations) => {
			try {
				return await context.connection.send(method, parameters, context.sessionId, context.signal);
			} catch (cause) {
				if (!(cause instanceof CdpCommandRejection) || cause.code !== -32601) throw cause;
				limitations.push(`${method} was unavailable from this browser target.`);
				return undefined;
			}
		};
	})))();
}

//#endregion
//#region dist/browser/ElectronFileScope.js
var authorizedElectronFile, authorizedAsarMember, MAX_CACHED_HEADERS, headerCache, archiveIdentity, asarFiles, isAsarRegularFile, isRecord;
function init_ElectronFileScope() {
	return (init_ElectronFileScope = __esmMin((() => {
		init_AsarHeader();
		authorizedElectronFile = async (value) => {
			if (/%(?:2f|5c)/iu.test(value)) return undefined;
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (url.protocol !== "file:" || url.hostname !== "" || url.username !== "" || url.password !== "") return undefined;
			let path;
			try {
				path = fileURLToPath(url);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (!isAbsolute(path) || path.includes("\0")) return undefined;
			try {
				if ((await stat(path)).isFile()) return await realpath(path);
			} catch (cause) {
				void cause;
			}
			return await authorizedAsarMember(path);
		};
		authorizedAsarMember = async (path) => {
			const segments = path.split(sep);
			for (let index = 1; index < segments.length - 1; index += 1) {
				if (!(segments[index] ?? "").toLowerCase().endsWith(".asar")) continue;
				const archive = segments.slice(0, index + 1).join(sep);
				const member = segments.slice(index + 1);
				if (member.some((part) => part === "" || part === "." || part === "..")) return undefined;
				try {
					const metadata = await stat(archive);
					if (!metadata.isFile()) continue;
					const canonical = await realpath(archive);
					const files = await asarFiles(canonical, metadata);
					return isAsarRegularFile(files, member) ? join(canonical, ...member) : undefined;
				} catch (cause) {
					void cause;
					return undefined;
				}
			}
			return undefined;
		};
		MAX_CACHED_HEADERS = 8;
		headerCache = new Map();
		archiveIdentity = (metadata) => `${String(metadata.dev)}:${String(metadata.ino)}:${String(metadata.size)}:${String(metadata.mtimeMs)}`;
		asarFiles = async (archive, metadata) => {
			const identity = archiveIdentity(metadata);
			const cached = headerCache.get(archive);
			if (cached?.identity === identity) return cached.files;
			const handle = await open(archive, "r");
			let files;
			let jsonBytes;
			try {
				const opened = await handle.stat();
				if (!opened.isFile() || archiveIdentity(opened) !== identity) throw new Error("ASAR identity changed before header read");
				const admitted = await admitAsarHeader(handle);
				jsonBytes = admitted.jsonBytes;
				const json = Buffer.alloc(jsonBytes);
				let offset = 0;
				while (offset < json.length) {
					const part = await handle.read(json, offset, json.length - offset, 16 + offset);
					if (part.bytesRead === 0) throw new Error("Truncated ASAR JSON header");
					offset += part.bytesRead;
				}
				if (archiveIdentity(await handle.stat()) !== identity) throw new Error("ASAR identity changed during header read");
				const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(json));
				if (!isRecord(parsed) || !isRecord(parsed.files)) throw new Error("ASAR header has no file tree");
				files = parsed.files;
			} finally {
				await handle.close();
			}
			headerCache.delete(archive);
			headerCache.set(archive, {
				identity,
				files,
				bytes: jsonBytes
			});
			const retainedBytes = () => [...headerCache.values()].reduce((sum, entry) => sum + entry.bytes, 0);
			while (headerCache.size > MAX_CACHED_HEADERS || retainedBytes() > 16777216) headerCache.delete(headerCache.keys().next().value ?? archive);
			return files;
		};
		isAsarRegularFile = (files, member) => {
			let node = { files };
			for (const part of member) {
				const children = isRecord(node) ? node.files : undefined;
				if (!isRecord(children) || !Object.hasOwn(children, part)) return false;
				node = children[part];
			}
			return isRecord(node) && typeof node.size === "number" && !("files" in node) && !("link" in node);
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
	})))();
}

//#endregion
export { CdpCaptureCompleteness, allowedSanitizedUrl, authorizedElectronFile, captureAccessibility, captureDom, captureFrames, captureResources, capturedSvgNodeKind, cdpStringValue, consolePrimitive, decodeBase64, delayWithCancellation, exclusionReasonForUrl, executionContextKey, firstCallFrame, init_CdpCaptureCompleteness, init_CdpCaptureDocuments, init_CdpCaptureDomSvg, init_CdpCaptureEventHelpers, init_CdpCaptureValues, init_CdpOptionalCommand, init_ElectronFileScope, initiatorLocation, integerOrNull, isHttpUrl, isJsonContentType, isJsonMediaType, isMainFrameNavigation, mainFrameUrl, numberValue, optionalCdpCommand, recordValue, recordsValue, requiredRecord, requiredScriptSource, scriptMetadataValues, sourceExcluded, sourceResult, walkFrameTrees };