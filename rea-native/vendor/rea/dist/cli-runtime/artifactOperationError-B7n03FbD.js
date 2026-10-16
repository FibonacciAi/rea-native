import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisError, init_analysisErrorBase } from "./errorSchemas-CTRmvMl3.js";

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
export { ArtifactOperationError, init_artifactOperationError };