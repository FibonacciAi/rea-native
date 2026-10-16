import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { satisfies } from "semver";

//#region dist/domain/runtimeVersion.js
var SUPPORTED_NODE_VERSION_RANGE, SUPPORTED_NODE_VERSION_PROSE, supportsNodeVersion, javaScriptRuntime;
function init_runtimeVersion() {
	return (init_runtimeVersion = __esmMin((() => {
		SUPPORTED_NODE_VERSION_RANGE = "^22.19.0 || ^24.11.0 || >=26.0.0";
		SUPPORTED_NODE_VERSION_PROSE = "Node.js 22.x (>=22.19), 24.x (>=24.11), or 26+";
		supportsNodeVersion = (version) => satisfies(version, SUPPORTED_NODE_VERSION_RANGE);
		javaScriptRuntime = (versions) => versions.bun === undefined ? {
			id: "node",
			version: versions.node
		} : {
			id: "bun",
			version: versions.bun,
			nodeCompatibilityVersion: versions.node
		};
	})))();
}

//#endregion
export { SUPPORTED_NODE_VERSION_PROSE, init_runtimeVersion, javaScriptRuntime, supportsNodeVersion };