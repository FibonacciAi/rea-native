import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { m as init_analysisErrorBase, p as AnalysisError } from "./analysisErrorCore-DXRTvF_m.js";

//#region dist/domain/artifactOperationError.js
var ArtifactOperationError;
function init_artifactOperationError() {
	return (init_artifactOperationError = __esmMin((() => {
		init_analysisErrorBase();
		ArtifactOperationError = class extends AnalysisError {
			operation;
			reason;
			artifactDetails;
			detail;
			_tag = "ArtifactOperationError";
			constructor(operation, reason, artifactDetails, detail, options) {
				super(artifactDetails === undefined ? `Artifact ${operation} failed: ${reason}` : `Artifact ${operation} failed: ${reason} at ${artifactDetails.logicalPath} (declared_sha256=${artifactDetails.declaredSha256 ?? "unavailable"}, calculated_sha256=${artifactDetails.calculatedSha256 ?? "unavailable"}, unpacked=${String(artifactDetails.unpacked)})`, options);
				this.operation = operation;
				this.reason = reason;
				this.artifactDetails = artifactDetails;
				this.detail = detail;
			}
		};
	})))();
}

//#endregion
export { init_artifactOperationError as n, ArtifactOperationError as t };