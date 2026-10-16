import { __esmMin, __exportAll } from "./rolldown-runtime-DXoylpqc.js";
import { PRODUCT_IDENTITY, SDK_IDENTITY, init_canonicalOrdering, init_identity, uniqueSorted } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { BinaryTargetError, init_configurationErrors } from "./errorSchemas-CTRmvMl3.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-DQWTcUwE.js";
import { analysisErrorRemediationAction, init_analysisErrorPresentation } from "./analysisErrorPresentation-DGt7TdsH.js";
import { execFileOutput, init_ExecFileOutput } from "./ExecFileOutput-BEQs-lDD.js";
import { homeDirectoryFromEnvironment, init_SupportedClients, init_homeDirectory, manualRegistrationRemediation } from "./SupportedClients-DaX6Lt2d.js";
import { MAC_HOPPER_SYSTEM_LAUNCHER, init_LinuxHopper, init_MacHopperPaths, linuxHopperBinarySupported, linuxHopperLauncherCandidates, linuxSharedLibrariesAvailable, macHopperApplicationRoots, macHopperCanonicalLauncherCandidates, macHopperRenamedLauncherCandidates, readLinuxDistribution, supportsReaHost, systemLinuxHopperLauncherCandidates } from "./MacHopperPaths-CwL5lYPX.js";
import { init_BinaryTargetResolver, parseBinaryTarget } from "./BinaryTargetResolver-CVIJ_s1A.js";
import { SUPPORTED_NODE_VERSION_PROSE, init_runtimeVersion, javaScriptRuntime, supportsNodeVersion } from "./runtimeVersion-CMGd0bDu.js";
import { CATALOG_IDENTITY, init_catalogIdentity } from "./catalogIdentity-DLoXgfIR.js";
import { init_SetupSkill, readInstalledSkillIdentity } from "./ClientConfigurationDocument-ffQ9X0Se.js";
import { init_ClientRegistrationStatus, readClientRegistrationStatuses } from "./ClientRegistrationStatus-DszCyPEU.js";
import { z } from "zod";
import { join } from "node:path";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { constants } from "node:fs";

//#region dist/application/homebrew.js
var HOMEBREW_COMMANDS, probeHomebrew, caskDirectoriesSchema, caskConfigSchema, installedCaskAppdir;
function init_homebrew() {
	return (init_homebrew = __esmMin((() => {
		HOMEBREW_COMMANDS = [
			"brew",
			"/opt/homebrew/bin/brew",
			"/usr/local/bin/brew"
		];
		probeHomebrew = async (probe) => {
			for (const command of HOMEBREW_COMMANDS) {
				const result = await probe(command);
				if (result !== undefined) return result;
			}
			return undefined;
		};
		caskDirectoriesSchema = z.object({ appdir: z.string().min(1).optional() }).loose();
		caskConfigSchema = z.object({
			default: caskDirectoriesSchema.optional(),
			env: caskDirectoriesSchema.optional(),
			explicit: caskDirectoriesSchema.optional()
		}).loose();
		installedCaskAppdir = async (caskroom, token, home) => {
			let text;
			try {
				text = await readFile(join(caskroom, token, ".metadata", "config.json"), "utf8");
			} catch (cause) {
				void cause;
				return undefined;
			}
			let parsed;
			try {
				parsed = JSON.parse(text);
			} catch (cause) {
				void cause;
				return undefined;
			}
			const config = caskConfigSchema.safeParse(parsed);
			if (!config.success) return undefined;
			const appdir = config.data.explicit?.appdir ?? config.data.env?.appdir ?? config.data.default?.appdir;
			if (appdir === undefined) return undefined;
			return appdir.startsWith("~/") ? join(home, appdir.slice(2)) : appdir;
		};
	})))();
}

//#endregion
//#region dist/application/DoctorDiagnostics.js
var collectDoctorDiagnostics, doctorHealthy, nodeCheck, hostCheck, findHopper, firstExecutable, hopperCheck, optionalHopperVersionCheck, optionalHopperDemoCheck, optionalIlspyCheck, optionalTargetCheck, check, providerDoctorChecks, unsupportedHopperRemediation, parseMajor, providerCheckName;
function init_DoctorDiagnostics() {
	return (init_DoctorDiagnostics = __esmMin((() => {
		init_runtimeVersion();
		init_LinuxHopper();
		init_MacHopperPaths();
		collectDoctorDiagnostics = async (target, host) => {
			const checks = [nodeCheck(host)];
			checks.push(await hostCheck(host));
			const hopperPath = await findHopper(host);
			checks.push(hopperCheck(host, hopperPath));
			const hopperVersionCheck = await optionalHopperVersionCheck(host, hopperPath);
			if (hopperVersionCheck !== undefined) checks.push(hopperVersionCheck);
			const providerInspections = await host.providerInspections?.();
			if (providerInspections !== undefined) checks.push(...providerInspections.flatMap(providerDoctorChecks));
			const ilspyCheck = await optionalIlspyCheck(host);
			if (ilspyCheck !== undefined) checks.push(ilspyCheck);
			const hopperDemoCheck = await optionalHopperDemoCheck(host, hopperPath);
			if (hopperDemoCheck !== undefined) checks.push(hopperDemoCheck);
			const targetCheck = await optionalTargetCheck(target, host);
			if (targetCheck !== undefined) checks.push(targetCheck);
			return {
				checks,
				...hopperPath === undefined ? {} : { hopperPath },
				...providerInspections === undefined ? {} : { providerInspections }
			};
		};
		doctorHealthy = (checks, providers) => {
			if (providers.providerInspections === undefined) return checks.every(({ ok }) => ok);
			const providerChecks = checks.filter(({ name }) => name.startsWith("hopper") || providers.providerInspections?.some((inspection) => providerCheckName(inspection.id, name)) === true);
			const coreHealthy = checks.filter((candidate) => !providerChecks.includes(candidate)).every(({ ok }) => ok);
			const configuredProvidersHealthy = providerChecks.filter(({ name }) => {
				if (name.startsWith("hopper")) return providers.hopperConfigured;
				return providers.providerInspections?.some((inspection) => inspection.configured && providerCheckName(inspection.id, name));
			}).every(({ ok }) => ok);
			return coreHealthy && configuredProvidersHealthy && (providers.hopperAvailable || providers.providerInspections.some(({ available }) => available));
		};
		nodeCheck = ({ runtime }) => {
			const failure = {
				remediation: `Install ${SUPPORTED_NODE_VERSION_PROSE}.`,
				classification: "missing_dependency"
			};
			if (runtime.id === "node") return {
				...check("node", supportsNodeVersion(runtime.version), runtime.version, failure),
				details: {
					runtime: "node",
					version: runtime.version
				}
			};
			return {
				...check("node", supportsNodeVersion(runtime.nodeCompatibilityVersion), `Bun ${runtime.version} (Node.js ${runtime.nodeCompatibilityVersion} compatibility)`, failure),
				details: {
					runtime: "bun",
					version: runtime.version,
					node_compatibility_version: runtime.nodeCompatibilityVersion
				}
			};
		};
		hostCheck = async (host) => {
			const macosVersion = host.platform === "darwin" ? await host.macosVersion() : undefined;
			const linuxDistribution = host.platform === "linux" ? await host.linuxDistribution() : undefined;
			const supported = host.platform === "darwin" && parseMajor(macosVersion) >= 12 || host.platform === "linux" && supportsReaHost(linuxDistribution) || host.platform === "win32" && host.architecture === "x64";
			const detail = macosVersion ?? (linuxDistribution === undefined ? `${host.platform} ${host.architecture}` : `${linuxDistribution.id} ${linuxDistribution.versionId ?? "unknown"}`);
			return check("host", supported, detail, {
				remediation: "REA supports macOS 12+, Linux distributions with a recognized apt, dnf, or pacman package family, and the experimental Windows x64 Ghidra P0 boundary; automated Hopper setup additionally requires Ubuntu 24.04+, Fedora 41+, Nobara 44+, 64-bit Arch Linux, CachyOS, or Omarchy.",
				classification: "unsupported_host"
			});
		};
		findHopper = async (host) => {
			const candidates = host.configuredHopperPath === undefined ? [
				...host.platform === "darwin" ? macHopperCanonicalLauncherCandidates(host.homeDirectory) : [MAC_HOPPER_SYSTEM_LAUNCHER],
				...host.platform === "linux" ? linuxHopperLauncherCandidates(host.homeDirectory) : [...systemLinuxHopperLauncherCandidates],
				...host.platform === "darwin" ? [] : macHopperCanonicalLauncherCandidates(host.homeDirectory).slice(1),
				...await host.manualHopperPaths()
			] : [host.configuredHopperPath];
			const hopperPath = await firstExecutable(host, candidates);
			if (hopperPath !== undefined || host.configuredHopperPath !== undefined) return hopperPath;
			const brewCandidate = await host.brewHopperPath();
			return firstExecutable(host, brewCandidate === undefined ? [] : [brewCandidate]);
		};
		firstExecutable = async (host, candidates) => {
			for (const candidate of new Set(candidates)) if (await host.executable(candidate)) return candidate;
			return undefined;
		};
		hopperCheck = (host, hopperPath) => check("hopper", hopperPath !== undefined, hopperPath ?? host.configuredHopperPath, {
			remediation: host.configuredHopperPath === undefined ? "Run rea setup to install Hopper, or set HOPPER_LAUNCHER_PATH." : "Unset or update HOPPER_LAUNCHER_PATH to an executable Hopper launcher.",
			classification: host.configuredHopperPath === undefined ? "missing_analysis_engine" : "config_drift"
		});
		optionalHopperVersionCheck = async (host, hopperPath) => {
			if (host.platform !== "linux" || hopperPath === undefined) return undefined;
			return check("hopper-version", await host.supportedLinuxHopper(hopperPath), hopperPath, {
				remediation: unsupportedHopperRemediation(host.configuredHopperPath === hopperPath),
				classification: "config_drift"
			});
		};
		optionalHopperDemoCheck = async (host, hopperPath) => host.platform !== "linux" || hopperPath === undefined ? undefined : host.linuxDemoRuntimeCheck();
		optionalIlspyCheck = async (host) => {
			if (host.configuredIlspyCmdPath === undefined) return undefined;
			const version = await host.ilspyCmdVersion?.(host.configuredIlspyCmdPath);
			return check("ilspycmd", version !== undefined, version === undefined ? host.configuredIlspyCmdPath : `${host.configuredIlspyCmdPath} (${version})`, {
				remediation: "Unset REA_ILSPY_CMD_PATH or point it at a runnable ilspycmd executable.",
				classification: "config_drift"
			});
		};
		optionalTargetCheck = async (target, host) => target === undefined ? undefined : host.inspectTarget !== undefined ? host.inspectTarget(target) : check("target", await host.validTarget(target), target, {
			remediation: "Supply a readable local app or program path.",
			classification: "config_drift"
		});
		check = (name, ok, detail, failure) => ({
			name,
			ok,
			classification: ok ? "healthy" : failure.classification,
			...detail === undefined ? {} : { detail },
			...ok ? {} : { remediation: failure.remediation }
		});
		providerDoctorChecks = (inspection) => inspection.checks.map((candidate) => ({
			name: candidate.name === "configuration" ? inspection.id : `${inspection.id}-${candidate.name}`,
			ok: candidate.ok,
			classification: candidate.ok ? "healthy" : candidate.classification,
			detail: candidate.detail,
			...candidate.remediation === null ? {} : { remediation: candidate.remediation },
			...candidate.details === undefined ? {} : { details: candidate.details }
		}));
		unsupportedHopperRemediation = (configured) => configured ? "Unset or update HOPPER_LAUNCHER_PATH, install the Hopper build supported by this REA release, or update REA." : "Install the Hopper build supported by this REA release, or update REA for a newer Hopper build.";
		parseMajor = (version) => Number.parseInt(version?.split(".")[0] ?? "0", 10);
		providerCheckName = (providerId, name) => name === providerId || name.startsWith(`${providerId}-`);
	})))();
}

//#endregion
//#region dist/application/DoctorScope.js
var normalizeDoctorScope, scopeDoctorChecks, isProviderCheck, selectedProviderChecksFor, selectedRegistrationCheck, registrationCheck$1, selectedSkillCheck, doctorProviderCheckName;
function init_DoctorScope() {
	return (init_DoctorScope = __esmMin((() => {
		init_canonicalOrdering();
		init_SupportedClients();
		normalizeDoctorScope = (requested, target) => ({
			mode: requested === undefined ? "audit-wide" : "explicit",
			clients: uniqueSorted(requested?.clients ?? []),
			...requested?.skillClients === undefined ? {} : { skill_clients: uniqueSorted(requested.skillClients) },
			providers: uniqueSorted(requested?.providers ?? []),
			skill: requested?.skill === true,
			target: target ?? null
		});
		scopeDoctorChecks = (input) => {
			const providerChecks = input.checks.filter((candidate) => isProviderCheck(candidate.name, input.providers.providerInspections));
			const coreChecks = input.checks.filter(({ name }) => name === "node" || input.scope.target !== null && name === "target");
			const clientChecks = input.scope.clients.map((client) => selectedRegistrationCheck(client, input.registrations.find((candidate) => candidate.client === client)));
			const skillChecks = input.scope.skill ? [selectedSkillCheck(input.skillState, input.checks)] : [];
			const selectedProviderChecks = input.scope.providers.flatMap((providerId) => selectedProviderChecksFor(providerId, providerChecks, input.providers));
			const hopperHostChecks = input.scope.providers.includes("hopper") ? input.checks.filter(({ name }) => name === "host") : [];
			const scopeChecks = [
				...coreChecks,
				...hopperHostChecks,
				...selectedProviderChecks,
				...clientChecks,
				...skillChecks
			];
			const selectedNames = new Set(scopeChecks.map(({ name }) => name));
			return {
				healthy: coreChecks.every(({ ok }) => ok) && hopperHostChecks.every(({ ok }) => ok) && clientChecks.every(({ ok }) => ok) && skillChecks.every(({ ok }) => ok) && selectedProviderChecks.every(({ ok }) => ok),
				scopeChecks,
				informationalChecks: input.checks.filter(({ name }) => !selectedNames.has(name))
			};
		};
		isProviderCheck = (name, inspections) => name.startsWith("hopper") || inspections?.some(({ id }) => doctorProviderCheckName(id, name)) === true;
		selectedProviderChecksFor = (providerId, checks, providers) => {
			const selected = checks.filter(({ name }) => providerId === "hopper" ? name.startsWith("hopper") : doctorProviderCheckName(providerId, name));
			const available = providerId === "hopper" ? providers.hopperAvailable : providers.providerInspections?.find(({ id }) => id === providerId)?.available === true;
			if (available && selected.every(({ ok }) => ok)) return selected;
			if (selected.some(({ ok }) => !ok)) return selected;
			return [...selected, {
				name: `provider:${providerId}`,
				ok: false,
				classification: "missing_analysis_engine",
				detail: `Requested provider ${providerId} is unavailable.`,
				remediation: `Configure the ${providerId} provider, then rerun rea doctor.`
			}];
		};
		selectedRegistrationCheck = (client, status) => {
			const manual = manualRegistrationRemediation(client);
			if (status === undefined && manual !== undefined) return {
				name: `registration:${client}`,
				ok: false,
				classification: "config_drift",
				detail: `${client} is not registered through a local configuration file.`,
				remediation: manual
			};
			return status === undefined ? {
				name: `registration:${client}`,
				ok: false,
				classification: "config_drift",
				detail: `Requested client ${client} was not detected.`,
				remediation: `Install or select ${client}, then run rea setup --client ${client}.`
			} : status.state === "aligned" ? {
				name: `registration:${client}`,
				ok: true,
				classification: "healthy",
				detail: status.config_path
			} : registrationCheck$1(status);
		};
		registrationCheck$1 = (status) => ({
			name: `registration:${status.client}`,
			ok: false,
			classification: status.state === "unknown" ? "unknown" : "config_drift",
			detail: status.config_path,
			remediation: status.remediation
		});
		selectedSkillCheck = (state, checks) => checks.find(({ name }) => name === "skill:identity") ?? {
			name: "skill:identity",
			ok: state === "aligned",
			classification: state === "aligned" ? "healthy" : "config_drift",
			...state === "aligned" ? { detail: "Installed REA skill identity is aligned." } : { remediation: state === "unmanaged" ? "Use regular skill directories, or run rea setup with --skill=false to configure the client without installing the skill." : state === "unknown" ? "Verify access to the reported skill files before retrying." : "Run rea setup to update the installed REA skill." }
		};
		doctorProviderCheckName = (providerId, name) => name === providerId || name.startsWith(`${providerId}-`);
	})))();
}

//#endregion
//#region dist/application/Doctor.js
var Doctor_exports = /* @__PURE__ */ __exportAll({
	runDoctor: () => runDoctor,
	runDoctorOwned: () => runDoctorOwned,
	systemDoctorHost: () => systemDoctorHost
});
var runDoctor, runDoctorOwned, inspectDoctor, closeDoctorHost, doctorReportWithCleanup, collectDoctorIdentity, skillIdentityAligned, skillIdentityState, skillIdentityRemediation, skillIdentityCheck, registrationCheck, installationState, systemDoctorHost, readMacosVersion, executableAvailable, uncomposedLinuxDemoRuntimeCheck, manualHopperPaths, uniqueLines, firstIlspyVersionLine;
function init_Doctor() {
	return (init_Doctor = __esmMin((() => {
		init_ArtifactResourceScope();
		init_homeDirectory();
		init_analysisErrorPresentation();
		init_configurationErrors();
		init_BinaryTargetResolver();
		init_ExecFileOutput();
		init_runtimeVersion();
		init_homebrew();
		init_MacHopperPaths();
		init_LinuxHopper();
		init_SetupSkill();
		init_catalogIdentity();
		init_identity();
		init_ClientRegistrationStatus();
		init_DoctorDiagnostics();
		init_DoctorScope();
		runDoctor = async (target, selectedHost, requestedScope) => selectedHost === undefined ? runDoctorOwned(target, systemDoctorHost(), requestedScope) : inspectDoctor(target, selectedHost, requestedScope);
		runDoctorOwned = async (target, host, requestedScope) => {
			let report;
			try {
				report = await inspectDoctor(target, host, requestedScope);
			} catch (cause) {
				const cleanup = await closeDoctorHost(host);
				if (cleanup !== undefined) throw new AggregateError([cause, new Error(cleanup)], "Doctor failed and its resource cleanup remains incomplete.", { cause });
				throw cause;
			}
			const cleanup = await closeDoctorHost(host);
			return cleanup === undefined ? report : doctorReportWithCleanup(report, cleanup);
		};
		inspectDoctor = async (target, host, requestedScope) => {
			const scope = normalizeDoctorScope(requestedScope, target);
			const { checks: diagnosticChecks, hopperPath, providerInspections } = await collectDoctorDiagnostics(target, host);
			const identity = await collectDoctorIdentity(host, scope);
			const checks = [...diagnosticChecks, ...identity.checks];
			const providers = {
				hopperAvailable: hopperPath !== undefined && checks.filter(({ name }) => name.startsWith("hopper")).every(({ ok }) => ok),
				hopperConfigured: host.configuredHopperPath !== undefined,
				providerInspections
			};
			const environmentHealthy = doctorHealthy(checks, providers);
			const scoped = scopeDoctorChecks({
				checks,
				registrations: identity.value.registrations,
				skillState: identity.value.skill.state,
				providers,
				scope
			});
			return {
				healthy: scope.mode === "audit-wide" ? environmentHealthy : scoped.healthy,
				environment_healthy: environmentHealthy,
				scope,
				scope_checks: scope.mode === "audit-wide" ? checks : scoped.scopeChecks,
				informational_checks: scope.mode === "audit-wide" ? [] : scoped.informationalChecks,
				...hopperPath === undefined ? {} : { hopperPath },
				...providerInspections === undefined ? {} : { providerInspections },
				checks,
				identity: identity.value
			};
		};
		closeDoctorHost = async (host) => {
			try {
				return await host.close?.();
			} catch (cause) {
				return `Doctor host cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
			}
		};
		doctorReportWithCleanup = (report, detail) => {
			const check = {
				name: "doctor-resource-cleanup",
				ok: false,
				classification: "config_drift",
				detail,
				remediation: "Resolve the reported cleanup failure, then rerun rea doctor."
			};
			return {
				...report,
				healthy: false,
				environment_healthy: false,
				checks: [...report.checks, check],
				scope_checks: [...report.scope_checks, check]
			};
		};
		collectDoctorIdentity = async (host, scope) => {
			const installationPaths = await host.installationPaths?.() ?? [];
			const registrations = await host.clientRegistrations?.() ?? [];
			const skillClientIds = scope.skill_clients ?? (scope.clients.length > 0 ? scope.clients : undefined);
			const installedSkillIdentity = await host.installedSkillIdentity?.(skillClientIds);
			const skillAligned = skillIdentityAligned(installedSkillIdentity);
			return {
				checks: [...skillAligned ? [] : [skillIdentityCheck(installedSkillIdentity)], ...registrations.filter((registration) => registration.state !== "aligned" && registration.state !== "manual").map(registrationCheck)],
				value: {
					cli_package_version: PRODUCT_IDENTITY.packageVersion,
					expected_skill_version: PRODUCT_IDENTITY.skillVersion,
					sdk: SDK_IDENTITY,
					catalog: CATALOG_IDENTITY,
					live_server: {
						state: "unknown",
						remediation: "Call binary_session in the active client to inspect the running server identity."
					},
					installations: {
						paths: installationPaths,
						state: installationState(installationPaths)
					},
					skill: {
						installed_version: installedSkillIdentity?.version ?? null,
						installed_tool_count: installedSkillIdentity?.toolCount ?? null,
						state: skillIdentityState(installedSkillIdentity),
						...installedSkillIdentity?.issues === undefined ? {} : { issues: installedSkillIdentity.issues },
						remediation: skillAligned ? null : skillIdentityRemediation(installedSkillIdentity)
					},
					registrations
				}
			};
		};
		skillIdentityAligned = (identity) => identity?.version === PRODUCT_IDENTITY.skillVersion && identity.toolCount === CATALOG_IDENTITY.counts.mcp_tools && identity.canonical;
		skillIdentityState = (identity) => {
			if (identity?.issues?.some(({ kind }) => kind === "unreadable")) return "unknown";
			if ((identity?.issues?.length ?? 0) > 0) return "unmanaged";
			return identity === undefined ? "missing" : skillIdentityAligned(identity) ? "aligned" : "stale";
		};
		skillIdentityRemediation = (identity) => {
			const issues = identity?.issues;
			if (issues !== undefined && issues.length > 0) return `${issues.map(({ path, detail }) => `${detail} (${path})`).join(" ")} Verify the reported paths and use regular skill directories, or run rea setup with --skill=false to configure the client without installing the skill.`;
			return "Run rea setup to update the installed REA skill.";
		};
		skillIdentityCheck = (identity) => {
			const issues = identity?.issues;
			return {
				name: "skill:identity",
				ok: false,
				classification: "config_drift",
				detail: issues !== undefined && issues.length > 0 ? `Selected skill identity is ${skillIdentityState(identity)}: ${issues.map(({ path }) => path).join(", ")}.` : identity === undefined ? "Installed REA skill identity is missing." : "Installed REA skill identity is stale.",
				remediation: skillIdentityRemediation(identity)
			};
		};
		registrationCheck = (registration) => ({
			name: `registration:${registration.client}`,
			ok: false,
			classification: registration.state === "unknown" ? "unknown" : "config_drift",
			detail: registration.config_path,
			remediation: registration.remediation
		});
		installationState = (paths) => paths.length === 0 ? "unknown" : paths.length === 1 ? "single" : "multiple";
		systemDoctorHost = (options = {}) => {
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
				...environment.HOPPER_LAUNCHER_PATH === undefined ? {} : { configuredHopperPath: environment.HOPPER_LAUNCHER_PATH },
				...environment.REA_ILSPY_CMD_PATH === undefined ? {} : { configuredIlspyCmdPath: environment.REA_ILSPY_CMD_PATH },
				macosVersion: () => readMacosVersion(hostExecFileOutput, commandEnvironment),
				linuxDistribution: readLinuxDistribution,
				async validTarget(path) {
					return (await parseBinaryTarget(path, {
						cwd: process.cwd(),
						hostArchitecture: architecture
					})).ok;
				},
				async inspectTarget(path) {
					const result = await parseBinaryTarget(path, {
						cwd: process.cwd(),
						hostArchitecture: architecture
					});
					if (result.ok) return {
						name: "target",
						ok: true,
						classification: "healthy",
						detail: path
					};
					const error = result.error;
					const targetError = error instanceof BinaryTargetError ? error : undefined;
					return {
						name: "target",
						ok: false,
						classification: targetError?.constraint !== undefined ? "unsupported_target" : "config_drift",
						detail: path,
						details: {
							reason: targetError?.reason ?? error.message,
							...targetError?.constraint === undefined ? {} : { constraint: targetError.constraint }
						},
						remediation: analysisErrorRemediationAction(error)
					};
				},
				executable: (path) => executableAvailable(path, platform, hostExecFileOutput, commandEnvironment),
				linuxDemoRuntimeCheck: options.linuxDemoRuntimeCheck ?? uncomposedLinuxDemoRuntimeCheck,
				supportedLinuxHopper: linuxHopperBinarySupported,
				async brewHopperPath() {
					return probeHomebrew(async (command) => {
						let caskroom;
						try {
							caskroom = (await hostExecFileOutput(command, ["--caskroom"], commandEnvironment)).stdout.trim();
						} catch (cause) {
							void cause;
							return undefined;
						}
						const appdir = await installedCaskAppdir(caskroom, "hopper-disassembler", homeDirectory);
						return appdir === undefined ? undefined : join(appdir, "Hopper Disassembler.app/Contents/MacOS/hopper");
					});
				},
				manualHopperPaths: () => manualHopperPaths(homeDirectory),
				...options.providerInspections === undefined ? {} : { providerInspections: options.providerInspections },
				...options.providerRegistrationEnvironment === undefined ? {} : { providerRegistrationEnvironment: options.providerRegistrationEnvironment },
				async ilspyCmdVersion(path) {
					try {
						await access(path, constants.X_OK);
						return firstIlspyVersionLine((await hostExecFileOutput(path, ["--version"], {
							timeout: 1e4,
							...commandEnvironment
						})).stdout);
					} catch (cause) {
						void cause;
						return undefined;
					}
				},
				async installationPaths() {
					try {
						const command = platform === "win32" ? "where" : "which";
						const arguments_ = platform === "win32" ? ["rea"] : ["-a", "rea"];
						return uniqueLines((await hostExecFileOutput(command, arguments_, commandEnvironment)).stdout);
					} catch (cause) {
						void cause;
						return [];
					}
				},
				installedSkillIdentity: (clientIds) => readInstalledSkillIdentity(homeDirectory, clientIds, environment, platform, resources),
				close: async () => {
					try {
						await resources.close();
						return undefined;
					} catch (cause) {
						return `Doctor resource cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
					}
				},
				clientRegistrations: () => readClientRegistrationStatuses(homeDirectory, undefined, {
					platform,
					environment,
					resources
				})
			};
		};
		readMacosVersion = async (run, options) => {
			try {
				return (await run("sw_vers", ["-productVersion"], options)).stdout.trim();
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		executableAvailable = async (path, platform, run, options) => {
			try {
				await access(path, constants.X_OK);
				if (!(await stat(path)).isFile()) return false;
				if (platform !== "linux") return true;
				const linked = await run("ldd", [path], options);
				return linuxSharedLibrariesAvailable(`${linked.stdout}\n${linked.stderr}`);
			} catch (cause) {
				void cause;
				return false;
			}
		};
		uncomposedLinuxDemoRuntimeCheck = () => Promise.resolve({
			name: "hopper-demo-runtime",
			ok: false,
			classification: "config_drift",
			detail: "Linux Hopper private-display diagnostics were not composed",
			remediation: "Run rea doctor through the production CLI adapter."
		});
		manualHopperPaths = async (home) => {
			const roots = macHopperApplicationRoots(home);
			const bundleNamesByRoot = new Map();
			for (const root of roots) {
				try {
					bundleNamesByRoot.set(root, (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map(({ name }) => name));
				} catch (cause) {
					void cause;
				}
			}
			return macHopperRenamedLauncherCandidates(home, bundleNamesByRoot);
		};
		uniqueLines = (value) => [...new Set(value.split(/\r?\n/u).map((line) => line.trim()).filter((line) => line.length > 0))];
		firstIlspyVersionLine = (value) => uniqueLines(value).find((line) => line.startsWith("ilspycmd:"));
	})))();
}

//#endregion
export { Doctor_exports, init_Doctor, runDoctor, systemDoctorHost };