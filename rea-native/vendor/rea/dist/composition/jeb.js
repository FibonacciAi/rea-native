import { ConfigurationError } from "../domain/configurationErrors.js";
import { err } from "../domain/result.js";
import { parseJebMcpEndpoint } from "../jeb/JebMcpEndpoint.js";
import { JebProvider } from "../jeb/JebProvider.js";
/**
 * Construct one JEB provider bound to the caller-selected MCP endpoint. An
 * unusable endpoint makes only JEB unavailable; every other CLI command and
 * MCP tool is composed alongside it.
 */
export const createJebAnalysisProvider = (environment = process.env, connectionFactory) => {
    const endpoint = parseJebMcpEndpoint(environment.REA_JEB_MCP_URL);
    if (!endpoint.ok) {
        const constraint = typeof endpoint.error.cause === "string"
            ? endpoint.error.cause
            : endpoint.error.message;
        return unconfiguredJebProvider(new ConfigurationError("Invalid REA environment configuration", {
            cause: endpoint.error,
            settings: [{ setting: "REA_JEB_MCP_URL", constraint }],
        }));
    }
    return new JebProvider({
        environment,
        ...(connectionFactory === undefined ? {} : { connectionFactory }),
    });
};
const unconfiguredJebProvider = (error) => ({
    inspectAvailability: () => Promise.resolve({
        status: "unavailable",
        code: "not_configured",
        reason: `REA_JEB_MCP_URL is invalid: ${error.settings[0]?.constraint ?? error.message}`,
        diagnostics: { setting: "REA_JEB_MCP_URL" },
    }),
    close: () => Promise.resolve(),
    execute: () => Promise.resolve(err(error)),
});
