import { AnalysisCancelledError } from "../domain/analysisErrorCore.js";
import { buildCapabilityInventory, compactToolAvailability, } from "../application/CapabilityInventory.js";
import { toolContract } from "../contracts/toolContracts.js";
import { jsonObjectSchema } from "../domain/jsonValue.js";
import { createServerIdentity } from "../serverIdentity.js";
import { mcpClientMetadata } from "./mcpClientMetadata.js";
import { toolRegistrationOptions } from "./toolRegistrationOptions.js";
import { err } from "../domain/result.js";
import { CURRENT_ENTRYPOINT_PATH } from "../process/CurrentEntrypointPath.js";
/** Register the read-only provider and target status operation. */
export const registerSessionStatusTool = (options) => {
    const { server, session, contract, startedAt, availabilityPolicy, androidAnalysisAvailability, adbAnalysisAvailability, apktoolAnalysisAvailability, } = options;
    server.registerTool(contract.name, toolRegistrationOptions(contract), async (input, context) => {
        const { client, clientFeatures, protocolVersion } = mcpClientMetadata(context, server.server);
        let androidAvailability;
        let adbAvailability;
        let apktoolAvailability;
        try {
            const [android, adb, apktool] = await Promise.all([
                androidAnalysisAvailability(context.mcpReq.signal),
                adbAnalysisAvailability?.(context.mcpReq.signal) ?? undefined,
                apktoolAnalysisAvailability?.(context.mcpReq.signal) ?? undefined,
            ]);
            androidAvailability = android;
            adbAvailability = adb;
            apktoolAvailability = apktool;
        }
        catch (cause) {
            if (!context.mcpReq.signal.aborted)
                throw cause;
            return server.delivery.toCallToolResult(err(new AnalysisCancelledError("binary_session")), contract);
        }
        const status = session.status();
        const statusObject = jsonObjectSchema.parse(status);
        const toolAvailability = buildCapabilityInventory(status, {
            ...availabilityPolicy(),
            androidAnalysisAvailability: androidAvailability,
            ...(adbAvailability === undefined
                ? {}
                : { adbAnalysisAvailability: adbAvailability }),
            ...(apktoolAvailability === undefined
                ? {}
                : { apktoolAnalysisAvailability: apktoolAvailability }),
        }, clientFeatures);
        const serverIdentity = createServerIdentity({
            startedAt,
            commandPath: CURRENT_ENTRYPOINT_PATH,
            catalog: server.catalogIdentity,
            expected: {
                ...(input.expected_package_version === undefined
                    ? {}
                    : { package_version: input.expected_package_version }),
                ...(input.expected_catalog_digest === undefined
                    ? {}
                    : { catalog_digest: input.expected_catalog_digest }),
                ...(input.expected_server_path === undefined
                    ? {}
                    : { server_path: input.expected_server_path }),
            },
            ...(client === undefined ? {} : { client }),
            ...(protocolVersion === undefined ? {} : { protocolVersion }),
        });
        return server.delivery.toCallToolResult({
            ok: true,
            value: projectSessionStatus({
                status: statusObject,
                toolAvailability,
                serverIdentity,
                clientFeatures,
            }),
        }, contract);
    });
};
const projectSessionStatus = (options) => jsonObjectSchema.parse({
    ...options.status,
    tool_availability: compactToolAvailability(options.toolAvailability),
    client_features: options.clientFeatures,
    server_identity: options.serverIdentity,
});
