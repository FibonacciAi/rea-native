import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { androidApplicationProjectionInputSchema, init_androidApplication, projectAndroidApplication } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ANDROID_APPLICATION_PROVIDER, init_InvestigationProviders } from "./InvestigationProviders-DoQRIHii.js";
import { init_InventoryProjectionEvidence, projectInventoryEvidence } from "./InventoryProjectionEvidence-DIsI4DJ6.js";

//#region dist/application/android/AndroidApplicationService.js
var OPERATION, projectAndroidApplicationEvidence;
function init_AndroidApplicationService() {
	return (init_AndroidApplicationService = __esmMin((() => {
		init_androidApplication();
		init_InvestigationProviders();
		init_InventoryProjectionEvidence();
		OPERATION = "project_android_application_graph";
		projectAndroidApplicationEvidence = (rawInput) => {
			return projectInventoryEvidence({
				rawInput,
				schema: androidApplicationProjectionInputSchema,
				project: projectAndroidApplication,
				operation: OPERATION,
				predicateType: "rea.android-application-graph",
				provider: ANDROID_APPLICATION_PROVIDER,
				subjectFormat: () => "apk",
				protocolError: "Android application projection produced an invalid result"
			});
		};
	})))();
}

//#endregion
init_AndroidApplicationService();
export { projectAndroidApplicationEvidence };