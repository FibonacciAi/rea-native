import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { m as init_analysisErrorBase, p as AnalysisError } from "./analysisErrorCore-DXRTvF_m.js";

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
export { init_providerAdapterError as n, ProviderAdapterError as t };