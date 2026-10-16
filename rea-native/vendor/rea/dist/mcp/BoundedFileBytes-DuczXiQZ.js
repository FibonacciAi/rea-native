import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as projectAnalysisError, t as init_analysisErrorProjection } from "./analysisErrorProjection-BN0EPM-3.js";
import { n as init_providerAdapterError, t as ProviderAdapterError } from "./providerAdapterError-sDxToNal.js";

//#region dist/domain/analysisErrorCleanup.js
var analysisErrorWithCleanupFailure;
function init_analysisErrorCleanup() {
	return (init_analysisErrorCleanup = __esmMin((() => {
		init_providerAdapterError();
		init_analysisErrorProjection();
		analysisErrorWithCleanupFailure = (primary, cleanup, operation = "close_binary") => {
			const projected = projectAnalysisError(cleanup);
			return new ProviderAdapterError(cleanup instanceof ProviderAdapterError ? cleanup.providerId : "rea", operation, {
				cause: new AggregateError([primary, cleanup], "Analysis failed and cleanup remains incomplete.", { cause: primary }),
				userMessage: projectAnalysisError(primary).message,
				...primary.capturedOutput === undefined ? {} : { capturedOutput: primary.capturedOutput },
				...primary.partialObservation === undefined ? {} : { partialObservation: primary.partialObservation },
				cleanup: {
					reason: projected.message,
					resources: [...new Set([...primary.cleanupResources, ...cleanup.cleanupResources])]
				},
				diagnostics: {
					primary_error: projectAnalysisError(primary),
					cleanup_error: projected
				}
			});
		};
	})))();
}

//#endregion
//#region dist/process/BoundedFileBytes.js
var readBoundedFileBytes;
function init_BoundedFileBytes() {
	return (init_BoundedFileBytes = __esmMin((() => {
		readBoundedFileBytes = async (handle, maxBytes, signal, expectedSize) => {
			if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new RangeError("File byte limit must be a nonnegative safe integer");
			if (expectedSize !== undefined && (!Number.isSafeInteger(expectedSize) || expectedSize < 0 || expectedSize > maxBytes)) throw new RangeError("Expected file size must fit the byte limit");
			if (expectedSize === undefined) {
				const chunks = [];
				const buffer = Buffer.allocUnsafe(Math.min(64 * 1024, maxBytes + 1));
				let total = 0;
				for (;;) {
					signal?.throwIfAborted();
					const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.length, maxBytes - total + 1), null);
					if (bytesRead === 0) return Buffer.concat(chunks, total);
					total += bytesRead;
					if (total > maxBytes) return undefined;
					chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
				}
			}
			const buffer = Buffer.allocUnsafe(expectedSize);
			if (expectedSize === 0) return buffer;
			let total = 0;
			for (;;) {
				signal?.throwIfAborted();
				const { bytesRead } = await handle.read(buffer, total, expectedSize - total, null);
				if (bytesRead === 0) return buffer.subarray(0, total);
				total += bytesRead;
				if (total > maxBytes) return undefined;
				if (total === expectedSize) return buffer;
			}
		};
	})))();
}

//#endregion
export { init_analysisErrorCleanup as i, readBoundedFileBytes as n, analysisErrorWithCleanupFailure as r, init_BoundedFileBytes as t };