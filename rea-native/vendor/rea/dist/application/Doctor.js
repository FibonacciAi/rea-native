import { constants } from "node:fs";
import { access, readdir, stat } from "node:fs/promises";
import { ArtifactResourceScope } from "../artifacts/ArtifactResourceScope.js";
import { homeDirectoryFromEnvironment } from "../config/homeDirectory.js";
import { join } from "node:path";
import { analysisErrorRemediationAction } from "../domain/analysisErrorPresentation.js";
import { BinaryTargetError } from "../domain/configurationErrors.js";
import { parseBinaryTarget } from "./BinaryTargetResolver.js";
import { execFileOutput } from "../process/ExecFileOutput.js";
import { javaScriptRuntime, } from "../domain/runtimeVersion.js";
import { installedCaskAppdir, probeHomebrew } from "./homebrew.js";
import { macHopperApplicationRoots, macHopperRenamedLauncherCandidates, } from "./MacHopperPaths.js";
import { linuxHopperBinarySupported, linuxSharedLibrariesAvailable, readLinuxDistribution, } from "./LinuxHopper.js";
import { readInstalledSkillIdentity, } from "./SetupSkill.js";
import { CATALOG_IDENTITY } from "../catalogIdentity.js";
import { PRODUCT_IDENTITY, SDK_IDENTITY } from "../identity.js";
import { readClientRegistrationStatuses, } from "./ClientRegistrationStatus.js";
import { collectDoctorDiagnostics, doctorHealthy, } from "./DoctorDiagnostics.js";
import { normalizeDoctorScope, scopeDoctorChecks, } from "./DoctorScope.js";
/**
 * Check requirements and an optional target without mutating the host.
 * Every failed check includes remediation suitable for either the one-shot CLI
 * or an agent consuming the structured result.
 */
export const runDoctor = async (target, selectedHost, requestedScope) => selectedHost === undefined
    ? runDoctorOwned(target, systemDoctorHost(), requestedScope)
    : inspectDoctor(target, selectedHost, requestedScope);
/** Inspect with a host whose lifetime belongs to this operation. */
export const runDoctorOwned = async (target, host, requestedScope) => {
    let report;
    try {
        report = await inspectDoctor(target, host, requestedScope);
    }
    catch (cause) {
        const cleanup = await closeDoctorHost(host);
        if (cleanup !== undefined)
            throw new AggregateError([cause, new Error(cleanup)], "Doctor failed and its resource cleanup remains incomplete.", { cause });
        throw cause;
    }
    const cleanup = await closeDoctorHost(host);
    return cleanup === undefined
        ? report
        : doctorReportWithCleanup(report, cleanup);
};
const inspectDoctor = async (target, host, requestedScope) => {
    const scope = normalizeDoctorScope(requestedScope, target);
    const { checks: diagnosticChecks, hopperPath, providerInspections, } = await collectDoctorDiagnostics(target, host);
    const identity = await collectDoctorIdentity(host, scope);
    const checks = [...diagnosticChecks, ...identity.checks];
    const providers = {
        hopperAvailable: hopperPath !== undefined &&
            checks
                .filter(({ name }) => name.startsWith("hopper"))
                .every(({ ok }) => ok),
        hopperConfigured: host.configuredHopperPath !== undefined,
        providerInspections,
    };
    const environmentHealthy = doctorHealthy(checks, providers);
    const scoped = scopeDoctorChecks({
        checks,
        registrations: identity.value.registrations,
        skillState: identity.value.skill.state,
        providers,
        scope,
    });
    return {
        healthy: scope.mode === "audit-wide" ? environmentHealthy : scoped.healthy,
        environment_healthy: environmentHealthy,
        scope,
        scope_checks: scope.mode === "audit-wide" ? checks : scoped.scopeChecks,
        informational_checks: scope.mode === "audit-wide" ? [] : scoped.informationalChecks,
        ...(hopperPath === undefined ? {} : { hopperPath }),
        ...(providerInspections === undefined ? {} : { providerInspections }),
        checks,
        identity: identity.value,
    };
};
const closeDoctorHost = async (host) => {
    try {
        return await host.close?.();
    }
    catch (cause) {
        return `Doctor host cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
    }
};
const doctorReportWithCleanup = (report, detail) => {
    const check = {
        name: "doctor-resource-cleanup",
        ok: false,
        classification: "config_drift",
        detail,
        remediation: "Resolve the reported cleanup failure, then rerun rea doctor.",
    };
    return {
        ...report,
        healthy: false,
        environment_healthy: false,
        checks: [...report.checks, check],
        scope_checks: [...report.scope_checks, check],
    };
};
const collectDoctorIdentity = async (host, scope) => {
    const installationPaths = (await host.installationPaths?.()) ?? [];
    const registrations = (await host.clientRegistrations?.()) ?? [];
    const skillClientIds = scope.skill_clients ??
        (scope.clients.length > 0 ? scope.clients : undefined);
    const installedSkillIdentity = await host.installedSkillIdentity?.(skillClientIds);
    const skillAligned = skillIdentityAligned(installedSkillIdentity);
    return {
        checks: [
            ...(skillAligned ? [] : [skillIdentityCheck(installedSkillIdentity)]),
            ...registrations
                .filter((registration) => registration.state !== "aligned" && registration.state !== "manual")
                .map(registrationCheck),
        ],
        value: {
            cli_package_version: PRODUCT_IDENTITY.packageVersion,
            expected_skill_version: PRODUCT_IDENTITY.skillVersion,
            sdk: SDK_IDENTITY,
            catalog: CATALOG_IDENTITY,
            live_server: {
                state: "unknown",
                remediation: "Call binary_session in the active client to inspect the running server identity.",
            },
            installations: {
                paths: installationPaths,
                state: installationState(installationPaths),
            },
            skill: {
                installed_version: installedSkillIdentity?.version ?? null,
                installed_tool_count: installedSkillIdentity?.toolCount ?? null,
                state: skillIdentityState(installedSkillIdentity),
                ...(installedSkillIdentity?.issues === undefined
                    ? {}
                    : { issues: installedSkillIdentity.issues }),
                remediation: skillAligned
                    ? null
                    : skillIdentityRemediation(installedSkillIdentity),
            },
            registrations,
        },
    };
};
const skillIdentityAligned = (identity) => identity?.version === PRODUCT_IDENTITY.skillVersion &&
    identity.toolCount === CATALOG_IDENTITY.counts.mcp_tools &&
    identity.canonical;
const skillIdentityState = (identity) => {
    if (identity?.issues?.some(({ kind }) => kind === "unreadable"))
        return "unknown";
    if ((identity?.issues?.length ?? 0) > 0)
        return "unmanaged";
    return identity === undefined
        ? "missing"
        : skillIdentityAligned(identity)
            ? "aligned"
            : "stale";
};
const skillIdentityRemediation = (identity) => {
    const issues = identity?.issues;
    if (issues !== undefined && issues.length > 0)
        return `${issues.map(({ path, detail }) => `${detail} (${path})`).join(" ")} Verify the reported paths and use regular skill directories, or run rea setup with --skill=false to configure the client without installing the skill.`;
    return "Run rea setup to update the installed REA skill.";
};
const skillIdentityCheck = (identity) => {
    const issues = identity?.issues;
    return {
        name: "skill:identity",
        ok: false,
        classification: "config_drift",
        detail: issues !== undefined && issues.length > 0
            ? `Selected skill identity is ${skillIdentityState(identity)}: ${issues.map(({ path }) => path).join(", ")}.`
            : identity === undefined
                ? "Installed REA skill identity is missing."
                : "Installed REA skill identity is stale.",
        remediation: skillIdentityRemediation(identity),
    };
};
const registrationCheck = (registration) => ({
    name: `registration:${registration.client}`,
    ok: false,
    classification: registration.state === "unknown" ? "unknown" : "config_drift",
    detail: registration.config_path,
    remediation: registration.remediation,
});
const installationState = (paths) => paths.length === 0 ? "unknown" : paths.length === 1 ? "single" : "multiple";
/** Create diagnostics backed by the current process and host commands. */
export const systemDoctorHost = (options = {}) => {
    const resources = new ArtifactResourceScope();
    const platform = options.platform ?? process.platform;
    const architecture = options.architecture ?? process.arch;
    const environment = options.environment ?? process.env;
    const hostExecFileOutput = options.execFileOutput ?? execFileOutput;
    const homeDirectory = homeDirectoryFromEnvironment(environment, platform);
    const commandEnvironment = { env: environment };
    return {
        platform,
        architecture,
        runtime: javaScriptRuntime(process.versions),
        homeDirectory,
        ...(environment.HOPPER_LAUNCHER_PATH === undefined
            ? {}
            : { configuredHopperPath: environment.HOPPER_LAUNCHER_PATH }),
        ...(environment.REA_ILSPY_CMD_PATH === undefined
            ? {}
            : { configuredIlspyCmdPath: environment.REA_ILSPY_CMD_PATH }),
        macosVersion: () => readMacosVersion(hostExecFileOutput, commandEnvironment),
        linuxDistribution: readLinuxDistribution,
        async validTarget(path) {
            return (await parseBinaryTarget(path, {
                cwd: process.cwd(),
                hostArchitecture: architecture,
            })).ok;
        },
        async inspectTarget(path) {
            const result = await parseBinaryTarget(path, {
                cwd: process.cwd(),
                hostArchitecture: architecture,
            });
            if (result.ok)
                return {
                    name: "target",
                    ok: true,
                    classification: "healthy",
                    detail: path,
                };
            const error = result.error;
            const targetError = error instanceof BinaryTargetError ? error : undefined;
            return {
                name: "target",
                ok: false,
                classification: targetError?.constraint !== undefined
                    ? "unsupported_target"
                    : "config_drift",
                detail: path,
                details: {
                    reason: targetError?.reason ?? error.message,
                    ...(targetError?.constraint === undefined
                        ? {}
                        : { constraint: targetError.constraint }),
                },
                remediation: analysisErrorRemediationAction(error),
            };
        },
        executable: (path) => executableAvailable(path, platform, hostExecFileOutput, commandEnvironment),
        linuxDemoRuntimeCheck: options.linuxDemoRuntimeCheck ?? uncomposedLinuxDemoRuntimeCheck,
        supportedLinuxHopper: linuxHopperBinarySupported,
        async brewHopperPath() {
            return probeHomebrew(async (command) => {
                let caskroom;
                try {
                    // Without a cask argument, `--caskroom` does not load Homebrew's
                    // cask API, so doctor writes no Homebrew cache files.
                    caskroom = (await hostExecFileOutput(command, ["--caskroom"], commandEnvironment)).stdout.trim();
                }
                catch (cause) {
                    // best-effort cleanup: optional Homebrew probing; absence means uninstalled.
                    void cause;
                    return undefined;
                }
                const appdir = await installedCaskAppdir(caskroom, "hopper-disassembler", homeDirectory);
                return appdir === undefined
                    ? undefined
                    : join(appdir, "Hopper Disassembler.app/Contents/MacOS/hopper");
            });
        },
        manualHopperPaths: () => manualHopperPaths(homeDirectory),
        ...(options.providerInspections === undefined
            ? {}
            : { providerInspections: options.providerInspections }),
        ...(options.providerRegistrationEnvironment === undefined
            ? {}
            : {
                providerRegistrationEnvironment: options.providerRegistrationEnvironment,
            }),
        async ilspyCmdVersion(path) {
            try {
                await access(path, constants.X_OK);
                return firstIlspyVersionLine((await hostExecFileOutput(path, ["--version"], {
                    timeout: 10_000,
                    ...commandEnvironment,
                })).stdout);
            }
            catch (cause) {
                // best-effort cleanup: optional version probing; failure means unavailable.
                void cause;
                return undefined;
            }
        },
        async installationPaths() {
            try {
                const command = platform === "win32" ? "where" : "which";
                const arguments_ = platform === "win32" ? ["rea"] : ["-a", "rea"];
                return uniqueLines((await hostExecFileOutput(command, arguments_, commandEnvironment))
                    .stdout);
            }
            catch (cause) {
                // best-effort cleanup: optional path probing; failure means none found.
                void cause;
                return [];
            }
        },
        installedSkillIdentity: (clientIds) => readInstalledSkillIdentity(homeDirectory, clientIds, environment, platform, resources),
        close: async () => {
            try {
                await resources.close();
                return undefined;
            }
            catch (cause) {
                return `Doctor resource cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
            }
        },
        clientRegistrations: () => readClientRegistrationStatuses(homeDirectory, undefined, {
            platform,
            environment,
            resources,
        }),
    };
};
const readMacosVersion = async (run, options) => {
    try {
        return (await run("sw_vers", ["-productVersion"], options)).stdout.trim();
    }
    catch (cause) {
        // best-effort cleanup: optional OS version probing; failure means unknown.
        void cause;
        return undefined;
    }
};
const executableAvailable = async (path, platform, run, options) => {
    try {
        await access(path, constants.X_OK);
        if (!(await stat(path)).isFile())
            return false;
        if (platform !== "linux")
            return true;
        const linked = await run("ldd", [path], options);
        return linuxSharedLibrariesAvailable(`${linked.stdout}\n${linked.stderr}`);
    }
    catch (cause) {
        // best-effort cleanup: optional executable probing; failure means unavailable.
        void cause;
        return false;
    }
};
const uncomposedLinuxDemoRuntimeCheck = () => Promise.resolve({
    name: "hopper-demo-runtime",
    ok: false,
    classification: "config_drift",
    detail: "Linux Hopper private-display diagnostics were not composed",
    remediation: "Run rea doctor through the production CLI adapter.",
});
const manualHopperPaths = async (home) => {
    const roots = macHopperApplicationRoots(home);
    const bundleNamesByRoot = new Map();
    for (const root of roots) {
        try {
            bundleNamesByRoot.set(root, (await readdir(root, { withFileTypes: true }))
                .filter((entry) => entry.isDirectory())
                .map(({ name }) => name));
        }
        catch (cause) {
            // A missing or unreadable optional application directory is not fatal.
            void cause;
        }
    }
    return macHopperRenamedLauncherCandidates(home, bundleNamesByRoot);
};
const uniqueLines = (value) => [
    ...new Set(value
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)),
];
const firstIlspyVersionLine = (value) => uniqueLines(value).find((line) => line.startsWith("ilspycmd:"));
