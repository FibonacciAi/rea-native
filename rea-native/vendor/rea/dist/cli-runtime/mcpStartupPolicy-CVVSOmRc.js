import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/mcpStartupPolicy.js
var MCP_STARTUP_POLICY;
function init_mcpStartupPolicy() {
	return (init_mcpStartupPolicy = __esmMin((() => {
		MCP_STARTUP_POLICY = {
			codexStartupTimeoutSeconds: 30,
			kimiStartupTimeoutMs: 3e4,
			kimiToolTimeoutMs: 12e4,
			initializeBudgetMs: 15e3,
			toolsListBudgetMs: 5e3,
			firstCatalogBudgetMs: 2e4,
			doctorDeadlineMs: 3e4,
			doctorStderrBytes: 64 * 1024
		};
	})))();
}

//#endregion
export { MCP_STARTUP_POLICY, init_mcpStartupPolicy };