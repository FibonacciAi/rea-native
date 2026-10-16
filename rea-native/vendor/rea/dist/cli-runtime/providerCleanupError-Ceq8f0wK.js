import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { ProviderAdapterError, init_providerAdapterError } from "./providerAdapterError-DAjhICdr.js";

//#region dist/domain/providerCleanupError.js
var ProviderCleanupError;
function init_providerCleanupError() {
	return (init_providerCleanupError = __esmMin((() => {
		init_providerAdapterError();
		ProviderCleanupError = class extends ProviderAdapterError {
			cleanupIncomplete = true;
			cleanupResources;
			userMessage = "Provider cleanup could not be fully confirmed. Review the reported local resources before opening another target.";
			constructor(providerId, resources, diagnostics, options) {
				const { operation = "close_binary", partialObservation, ...errorOptions } = options ?? {};
				super(providerId, operation, {
					...errorOptions,
					...partialObservation === undefined ? {} : { partialObservation },
					diagnostics
				});
				this.cleanupResources = [...resources];
			}
		};
	})))();
}

//#endregion
export { ProviderCleanupError, init_providerCleanupError };