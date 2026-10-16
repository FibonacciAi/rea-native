import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { f as init_analysisErrorCore, i as AnalysisCancelledError } from "./analysisErrorCore-DXRTvF_m.js";
import { n as init_browserObservationError, t as BrowserObservationError } from "./browserObservationError-CyLugqX4.js";
import { c as init_browserObservation, m as sanitizeBrowserUrl, n as init_webContentArtifact, t as createWebTextArtifact } from "./webContentArtifact-Dzjc1z-R.js";

//#region dist/browser/CdpCaptureValues.js
var isRecord, recordValue, recordsValue, cdpStringValue, numberValue, scriptMetadataValues, requiredRecord, requiredScriptSource, isHttpUrl, allowedSanitizedUrl, sourceResult, sourceExcluded, delayWithCancellation;
function init_CdpCaptureValues() {
	return (init_CdpCaptureValues = __esmMin((() => {
		init_analysisErrorCore();
		init_browserObservationError();
		init_browserObservation();
		init_webContentArtifact();
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		recordValue = (value) => isRecord(value) ? value : undefined;
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
export { isHttpUrl as a, recordsValue as c, scriptMetadataValues as d, sourceExcluded as f, init_CdpCaptureValues as i, requiredRecord as l, cdpStringValue as n, numberValue as o, sourceResult as p, delayWithCancellation as r, recordValue as s, allowedSanitizedUrl as t, requiredScriptSource as u };