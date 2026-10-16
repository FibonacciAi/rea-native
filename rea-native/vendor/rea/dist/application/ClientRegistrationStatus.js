import { readClientPolicyBlock } from "./GeminiClientSettings.js";
import { readEffectiveClientRegistrationConfiguration } from "./ClientConfigurationFiles.js";
import { clientServerForcedEnabled, clientServerListedDisabled, effectiveClientServer, } from "./ClientConfigurationDocument.js";
import { access } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { z } from "zod";
import { valid } from "semver";
import { PRODUCT_IDENTITY } from "../identity.js";
import { CURRENT_ENTRYPOINT_PATH } from "../process/CurrentEntrypointPath.js";
import { MCP_STARTUP_POLICY } from "../mcpStartupPolicy.js";
import { clientRegistrationPackageReference, classifyClientRegistrationCommand, packageRunnerRegistrationCommand, } from "./ClientRegistrationIdentity.js";
import { clientEvidencePaths, manualRegistrationRemediation, supportedClients, } from "./SupportedClients.js";
import { compareUnicodeCodePoints } from "../domain/unicodeCodePointOrder.js";
import { dshDocument } from "./DshCordisPatch.js";
const registrationSchema = z
    .object({
    command: z.string().min(1),
    args: z.array(z.string()).default([]),
    startup_timeout_sec: z.number().positive().optional(),
    startupTimeoutMs: z.number().positive().optional(),
    toolTimeoutMs: z.number().positive().optional(),
    type: z.string().optional(),
    transport: z.string().optional(),
    serverName: z.string().optional(),
    tools: z.array(z.string()).optional(),
    disabled: z.boolean().optional(),
    enabled: z.boolean().optional(),
})
    .passthrough();
/** Project diagnostics from the same inspection used to select maintenance. */
export const readClientRegistrationStatuses = async (home, currentCommandPath = CURRENT_ENTRYPOINT_PATH, options = {}) => (await readClientRegistrationInspections(home, currentCommandPath, options)).map(({ status }) => status);
/** Parse effective registrations and their client-specific activation once. */
export const readClientRegistrationInspections = async (home, currentCommandPath = CURRENT_ENTRYPOINT_PATH, options = {}) => {
    const inspections = [];
    const record = (status, activation = "unknown") => {
        inspections.push({ status, activation });
    };
    for (const client of supportedClients(home, options.platform, options.environment)) {
        if (client.configPathError !== undefined) {
            record({
                client: client.name,
                config_path: client.configPath,
                command: [],
                state: "invalid",
                remediation: client.configPathError,
            });
            continue;
        }
        if (!(await clientEvidencePresent(client)))
            continue;
        const manualRemediation = manualRegistrationRemediation(client.name);
        if (client.format === "unsupported") {
            if (manualRemediation !== undefined)
                record({
                    client: client.name,
                    config_path: client.markerPath ?? client.configPath,
                    command: [],
                    state: "manual",
                    remediation: manualRemediation,
                });
            continue;
        }
        let selectedConfigPath = client.configPath;
        try {
            const configuration = await readEffectiveClientRegistrationConfiguration(client, options.resources);
            if (!configuration.ok) {
                record({
                    client: client.name,
                    config_path: configuration.error.path,
                    command: [],
                    state: "invalid",
                    remediation: configuration.error.detail,
                });
                continue;
            }
            const { document: parsed, configPath } = configuration.value;
            selectedConfigPath = configPath;
            if (parsed === undefined) {
                record(unavailableStatus(client, "missing", configPath));
                continue;
            }
            const policy = await readClientPolicyBlock(client, parsed, undefined, options.resources);
            if (!policy.ok) {
                record({
                    client: client.name,
                    config_path: configPath,
                    command: [],
                    state: "invalid",
                    remediation: policy.error.detail,
                });
                continue;
            }
            const policyBlock = policy.value;
            const raw = effectiveClientServer(parsed, PRODUCT_IDENTITY.mcpServerKey);
            if (raw === undefined) {
                const editabilityError = parsed.dialect === "dsh"
                    ? dshDocument(parsed.document).editabilityError
                    : undefined;
                if (editabilityError !== undefined) {
                    record({
                        client: client.name,
                        config_path: configPath,
                        command: [],
                        state: "invalid",
                        remediation: editabilityError.message,
                    });
                    continue;
                }
                record(unavailableStatus(client, "missing", configPath));
                continue;
            }
            const effectiveClient = parsed.dialect === "zcode_fallback"
                ? {
                    ...client,
                    configPath,
                    configPaths: [configPath],
                    format: "zcode_fallback",
                }
                : client;
            const registration = parseRegistration(raw, effectiveClient);
            const command = [
                registration.command,
                ...registration.args,
            ];
            const packageReference = clientRegistrationPackageReference(command);
            const activation = registrationActivation(registration, client, parsed);
            const packageVersion = exactRegisteredPackageVersion(packageReference);
            const packageVersionDrift = packageVersion !== undefined &&
                packageVersion !== PRODUCT_IDENTITY.packageVersion;
            const alignment = registrationAligned(registration, effectiveClient, currentCommandPath, options.platform ?? process.platform);
            record(configuredStatus(effectiveClient, command, alignment === "unknown"
                ? "unknown"
                : activation === "enabled" &&
                    !packageVersionDrift &&
                    alignment === "aligned" &&
                    (parsed.dialect !== "dsh" ||
                        dshDocument(parsed.document).ready) &&
                    policyBlock === undefined
                    ? "aligned"
                    : "stale", policyBlock ??
                (packageVersionDrift
                    ? packageVersionRemediation(packageReference ?? "", client)
                    : alignment === "unknown"
                        ? unknownEntryPointRemediation()
                        : undefined), packageReference), activation);
        }
        catch (cause) {
            record(unavailableStatus(client, isMissing(cause) ? "missing" : "invalid", selectedConfigPath));
        }
    }
    return inspections.sort((left, right) => compareUnicodeCodePoints(left.status.client, right.status.client));
};
const registrationActivation = (registration, client, parsed) => (client.format !== "grok" && registration.disabled === true) ||
    (registration.enabled === false &&
        !clientServerForcedEnabled(parsed, PRODUCT_IDENTITY.mcpServerKey)) ||
    ((parsed.dialect === "zcode" || parsed.dialect === "zcode_fallback") &&
        registration.enable === false) ||
    clientServerListedDisabled(parsed, PRODUCT_IDENTITY.mcpServerKey)
    ? "disabled"
    : "enabled";
const registrationAligned = (registration, client, currentCommandPath, platform) => {
    const command = [registration.command, ...registration.args];
    const identity = classifyClientRegistrationCommand(command, currentCommandPath);
    if (identity === "unknown")
        return "unknown";
    if (identity === "foreign")
        return "stale";
    if ((client.name === "codex" || client.name === "grok_build") &&
        registration.startup_timeout_sec !==
            MCP_STARTUP_POLICY.codexStartupTimeoutSeconds)
        return "stale";
    if (client.name === "kimi" &&
        (registration.startupTimeoutMs !==
            MCP_STARTUP_POLICY.kimiStartupTimeoutMs ||
            registration.toolTimeoutMs !== MCP_STARTUP_POLICY.kimiToolTimeoutMs))
        return "stale";
    if ((client.format === "kimi" ||
        client.format === "omp" ||
        client.format === "pi") &&
        registration.type !== undefined &&
        registration.type !== "stdio")
        return "stale";
    if (client.format === "vscode" && registration.type !== "stdio")
        return "stale";
    // A Harness registration only connects as the rea stdio server; another
    // server name or transport leaves the session without REA tools.
    if (client.format === "dsh" &&
        (registration.serverName !== "rea" || registration.transport !== "stdio"))
        return "stale";
    if (client.format === "copilot_cli" &&
        (registration.type !== "stdio" ||
            JSON.stringify(registration.tools) !== JSON.stringify(["*"])))
        return "stale";
    if (client.format === "commandcode" && registration.transport !== "stdio")
        return "stale";
    if (["npx", "bunx"].some((runner) => {
        const expected = packageRunnerRegistrationCommand(runner, platform);
        return (command.length === expected.length &&
            command.every((argument, index) => argument === expected[index]));
    }))
        return "aligned";
    if (currentCommandPath !== undefined &&
        currentCommandPath.length > 0 &&
        command.length === 3 &&
        command[2] === "mcp" &&
        isAbsolute(command[0] ?? "") &&
        isAbsolute(command[1] ?? "") &&
        resolve(command[0] ?? "") === resolve(process.execPath) &&
        resolve(command[1] ?? "") === currentCommandPath)
        return "aligned";
    if (currentCommandPath !== undefined &&
        currentCommandPath.length > 0 &&
        command.length === 2 &&
        command[1] === "mcp" &&
        isAbsolute(command[0] ?? "") &&
        resolve(command[0] ?? "") === currentCommandPath)
        return "aligned";
    return "stale";
};
const parseRegistration = (value, client) => {
    if (client.format === "dsh")
        return registrationSchema
            .pick({ command: true, args: true, serverName: true, transport: true })
            .strip()
            .parse(value);
    if (client.format === "opencode") {
        const entry = z
            .object({
            type: z.literal("local"),
            command: z.array(z.string()).min(1),
            environment: z.record(z.string(), z.string()).optional(),
        })
            .passthrough()
            .parse(value);
        const [command = "", ...args] = entry.command;
        return registrationSchema.parse({
            ...entry,
            command,
            args,
        });
    }
    const registration = registrationSchema.parse(value);
    if (client.format === "kimi" &&
        registration.transport !== undefined &&
        registration.transport !== "stdio")
        throw new TypeError("Expected an stdio registration");
    if ((client.format === "vscode" || client.format === "copilot_cli") &&
        registration.type !== "stdio")
        throw new TypeError("Expected an stdio registration");
    if (client.format === "commandcode" && registration.transport !== "stdio")
        throw new TypeError("Expected an stdio registration");
    if ((client.format === "kimi" ||
        client.format === "omp" ||
        client.format === "pi") &&
        registration.type !== undefined &&
        registration.type !== "stdio")
        throw new TypeError("Expected an stdio registration");
    return registration;
};
/** A client that rewrites its file from memory must be quit before setup. */
const remediation = (client) => {
    if (client.quitBeforeSetup !== true)
        return "Run rea setup to refresh this registration, then restart the client.";
    const name = client.displayName ?? client.name;
    return `Quit ${name} fully, run rea setup to refresh this registration, then start ${name} again. A running ${name} can rewrite its configuration from memory and drop the registration.`;
};
const unknownEntryPointRemediation = () => "The existing registration was retained because its executable identity cannot be verified. Run the installed REA CLI or a supported package runner, then rerun rea doctor; no registration was changed.";
const configuredStatus = (client, command, state, policyRemediation, packageReference) => state === "aligned"
    ? {
        client: client.name,
        config_path: client.configPath,
        command,
        ...(packageReference === undefined
            ? {}
            : { package_reference: packageReference }),
        state,
        remediation: null,
    }
    : {
        client: client.name,
        config_path: client.configPath,
        command,
        ...(packageReference === undefined
            ? {}
            : { package_reference: packageReference }),
        state,
        remediation: policyRemediation ?? remediation(client),
    };
const exactRegisteredPackageVersion = (packageReference) => {
    if (packageReference === undefined)
        return undefined;
    const prefix = `${PRODUCT_IDENTITY.packageName}@`;
    if (!packageReference.startsWith(prefix))
        return undefined;
    const version = packageReference.slice(prefix.length);
    return valid(version) === version ? version : undefined;
};
const packageVersionRemediation = (packageReference, client) => `This registration requests ${packageReference}, while the current REA CLI package is ${PRODUCT_IDENTITY.packageVersion}. REA does not resolve package-runner requests during doctor; update the registration with rea setup --client ${client.name}, then restart the client.`;
const unavailableStatus = (client, state, configPath = client.configPath) => ({
    client: client.name,
    config_path: configPath,
    command: [],
    state,
    remediation: remediation(client),
});
const clientEvidencePresent = async (client) => {
    for (const path of clientEvidencePaths(client))
        if (await exists(path))
            return true;
    return false;
};
const exists = async (path) => {
    if (path === undefined)
        return false;
    try {
        await access(path);
        return true;
    }
    catch (cause) {
        // best-effort cleanup: optional registration probing; absence means unregistered.
        void cause;
        return false;
    }
};
const isMissing = (cause) => cause instanceof Error && "code" in cause && cause.code === "ENOENT";
