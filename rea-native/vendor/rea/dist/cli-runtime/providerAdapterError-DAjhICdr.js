import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisError, init_analysisErrorBase } from "./errorSchemas-CTRmvMl3.js";

//#region dist/domain/providerAdapterError.js
var ProviderAdapterError;
function init_providerAdapterError() {
	return (init_providerAdapterError = __esmMin((() => {
		init_analysisErrorBase();
		ProviderAdapterError = class extends AnalysisError {
			providerId;
			operation;
			_tag = "ProviderAdapterError";
			userMessage;
			constructor(providerId, operation, options = {}) {
				super(`Provider ${providerId} adapter failed during ${operation}`, options);
				this.providerId = providerId;
				this.operation = operation;
				this.userMessage = options.userMessage;
			}
		};
	})))();
}

//#endregion
export { ProviderAdapterError, init_providerAdapterError };