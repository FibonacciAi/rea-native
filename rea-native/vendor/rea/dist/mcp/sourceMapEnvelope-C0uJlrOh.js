import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { c as init_browserObservation, m as sanitizeBrowserUrl } from "./webContentArtifact-Dzjc1z-R.js";
import { a as isHttpUrl, i as init_CdpCaptureValues, n as cdpStringValue, r as delayWithCancellation, s as recordValue, t as allowedSanitizedUrl } from "./CdpCaptureValues-M-j6CIh1.js";
import { a as init_CdpCaptureDocuments, o as mainFrameUrl } from "./CdpCaptureDocuments-HDiF2O7k.js";

//#region dist/browser/CdpAuthorizedTarget.js
var authorizeCdpTarget;
function init_CdpAuthorizedTarget() {
	return (init_CdpAuthorizedTarget = __esmMin((() => {
		init_browserObservation();
		init_browserObservationError();
		authorizeCdpTarget = (discovery, input, operation) => {
			const target = discovery.targets.find((candidate) => candidate.id === input.target_id);
			if (target === undefined) throw new BrowserObservationError(operation, "target_not_found", { detail: `Target ${input.target_id} was not found at the selected endpoint.` });
			const origin = sanitizeBrowserUrl(target.url).origin;
			if (target.type !== "page" || origin === null || input.allowed_origins.length > 0 && !input.allowed_origins.includes(origin)) throw new BrowserObservationError(operation, "target_not_allowed", { detail: `Target ${input.target_id} must be an HTTP(S) page in the selected origin scope.` });
			return {
				target,
				allowedOrigins: new Set(input.allowed_origins.length > 0 ? input.allowed_origins : [origin])
			};
		};
	})))();
}

//#endregion
//#region dist/browser/CdpAuthorizedMainFrame.js
var authorizedMainFrame;
function init_CdpAuthorizedMainFrame() {
	return (init_CdpAuthorizedMainFrame = __esmMin((() => {
		init_browserObservationError();
		init_CdpCaptureDocuments();
		init_CdpCaptureValues();
		authorizedMainFrame = async ({ connection, sessionId, signal, allowedOrigins, operation }) => {
			for (let attempt = 0; attempt < 80; attempt += 1) {
				const result = await connection.send("Page.getFrameTree", {}, sessionId, signal);
				const url = mainFrameUrl(result);
				if (allowedSanitizedUrl(url, allowedOrigins) !== undefined) return result;
				if (isHttpUrl(url)) throw new BrowserObservationError(operation, "target_not_allowed");
				await delayWithCancellation(25, operation, signal);
			}
			throw new BrowserObservationError(operation, "target_not_allowed");
		};
	})))();
}

//#endregion
//#region dist/browser/CdpTargetEvents.js
var cdpTargetEventMatches;
function init_CdpTargetEvents() {
	return (init_CdpTargetEvents = __esmMin((() => {
		init_CdpCaptureValues();
		cdpTargetEventMatches = (event, sessionId) => {
			if (event.method !== "Target.detachedFromTarget") return event.sessionId === sessionId;
			return sessionId !== undefined && cdpStringValue(recordValue(event.params)?.sessionId) === sessionId;
		};
	})))();
}

//#endregion
//#region dist/domain/sourceMapEnvelope.js
var sourceMapJsonText, isRecord, isVersion3Map, flattenSourceMapLeaves;
function init_sourceMapEnvelope() {
	return (init_sourceMapEnvelope = __esmMin((() => {
		sourceMapJsonText = (text) => {
			const withoutBom = text.replace(/^\uFEFF/u, "");
			if (!withoutBom.startsWith(")]}'")) return withoutBom;
			const newline = withoutBom.search(/[\r\n]/u);
			return newline === -1 ? "" : withoutBom.slice(newline);
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		isVersion3Map = (value) => isRecord(value) && value.version === 3;
		flattenSourceMapLeaves = (root) => {
			if (!isVersion3Map(root)) return undefined;
			const leaves = [];
			const pending = [root];
			while (pending.length > 0) {
				const map = pending.pop();
				if (!isVersion3Map(map)) return undefined;
				if (Array.isArray(map.sections)) {
					for (let index = map.sections.length - 1; index >= 0; index -= 1) {
						const section = map.sections[index];
						if (!isRecord(section) || !isRecord(section.map)) return undefined;
						pending.push(section.map);
					}
				} else leaves.push(map);
			}
			return leaves;
		};
	})))();
}

//#endregion
export { init_CdpTargetEvents as a, authorizeCdpTarget as c, cdpTargetEventMatches as i, init_CdpAuthorizedTarget as l, init_sourceMapEnvelope as n, authorizedMainFrame as o, sourceMapJsonText as r, init_CdpAuthorizedMainFrame as s, flattenSourceMapLeaves as t };