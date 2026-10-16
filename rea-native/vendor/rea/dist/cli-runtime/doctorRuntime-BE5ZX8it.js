import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_PrivateRuntimeRoot, init_WindowsAuthority, inspectWindowsNativeReadiness, privateRuntimeRootCapability } from "./PrivateRuntimeRoot-DAy0PiBM.js";
import { JADX_FAILURE_KINDS, init_JadxConfiguration, init_JebMcpEndpoint, inspectJadxAvailability, parseJebMcpEndpoint, projectJadxFailureOutcome } from "./JebMcpEndpoint-DUytrn5G.js";
import { init_Doctor, systemDoctorHost } from "./Doctor-DIpf_I7N.js";
import { init_GhidraInstallation, init_IdaConfiguration, init_LinuxPrivateDisplayProbe, inspectGhidraInstallation, readIdaConfiguration, selectLinuxPrivateDisplayStrategy } from "./IdaConfiguration-CtGP7EKo.js";
import { fileURLToPath } from "node:url";

//#region dist/android/JadxDoctor.js
var inspectJadxProvider, optionalEntry, configurationCheck, windowsNativeFailureDetails, asFailureKind, probeDetails;
function init_JadxDoctor() {
	return (init_JadxDoctor = __esmMin((() => {
		init_JadxConfiguration();
		inspectJadxProvider = async (environment) => {
			const configured = environment.REA_JADX_MCP_JAR !== undefined;
			const availability = await inspectJadxAvailability(environment);
			const jarPath = availability.status === "available" && typeof availability.diagnostics["jar_path"] === "string" ? availability.diagnostics["jar_path"] : undefined;
			const available = availability.status === "available" && jarPath !== undefined;
			const configuredJar = environment.REA_JADX_MCP_JAR;
			return {
				id: "jadx",
				configured,
				available,
				providerVersion: null,
				registrationEnvironment: jarPath === undefined || configuredJar === undefined ? {} : {
					REA_JADX_MCP_JAR: configuredJar,
					...optionalEntry("JAVA_HOME", environment.JAVA_HOME),
					...optionalEntry("REA_JADX_HEAP_MIB", environment.REA_JADX_HEAP_MIB),
					...optionalEntry("REA_JADX_ACTIVE_PROCESSOR_COUNT", environment.REA_JADX_ACTIVE_PROCESSOR_COUNT)
				},
				checks: [configurationCheck(configured, availability, jarPath)]
			};
		};
		optionalEntry = (name, value) => value === undefined ? {} : { [name]: value };
		configurationCheck = (configured, availability, jarPath) => {
			const code = availability.status === "unavailable" ? availability.code : null;
			if (availability.status === "available" && jarPath !== undefined) {
				return {
					name: "configuration",
					ok: true,
					code: null,
					detail: `JADX MCP bridge JAR validated at ${jarPath}; its path is recorded for agent registrations.`,
					remediation: null,
					classification: "config_drift"
				};
			}
			const kind = availability.status === "unavailable" ? asFailureKind(availability.diagnostics["failure_kind"]) : null;
			const outcome = projectJadxFailureOutcome(kind, configured);
			return {
				name: "configuration",
				ok: false,
				code,
				detail: availability.status === "available" ? "Validated JADX configuration reported no JAR path." : availability.reason,
				remediation: outcome.remediation,
				classification: outcome.classification,
				...kind === "java_probe" && availability.status === "unavailable" ? { details: probeDetails(availability.diagnostics) } : kind !== null && kind.startsWith("windows_native_") && availability.status === "unavailable" ? { details: windowsNativeFailureDetails(availability.diagnostics) } : {}
			};
		};
		windowsNativeFailureDetails = (diagnostics) => {
			const details = {};
			for (const key of ["failure_stage", "remediation"]) {
				const value = diagnostics[key];
				if (value !== undefined) details[key] = value;
			}
			return details;
		};
		asFailureKind = (value) => typeof value === "string" && JADX_FAILURE_KINDS.includes(value) ? value : null;
		probeDetails = (diagnostics) => {
			const details = {};
			for (const key of [
				"java_executable",
				"failure",
				"output_truncated",
				"exit_code",
				"process_error_code",
				"signal",
				"killed",
				"output_limit_bytes",
				"deadline_ms",
				"jdk_compiler",
				"java_major"
			]) {
				const value = diagnostics[key];
				if (value !== undefined) details[key] = value;
			}
			return details;
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraDoctor.js
var projectGhidraDoctorInspection, inspectSystemGhidraProvider, selectedChecks, projectCheck;
function init_GhidraDoctor() {
	return (init_GhidraDoctor = __esmMin((() => {
		init_WindowsAuthority();
		init_GhidraInstallation();
		projectGhidraDoctorInspection = (inspection) => {
			const readiness = inspection.status === "available" && inspection.platform === "win32" ? inspectWindowsNativeReadiness(inspection.platform) : undefined;
			const windowsAuthorityUnavailable = readiness?.available === false;
			return {
				id: "ghidra",
				configured: inspection.installDir !== null,
				available: inspection.status === "available" && !windowsAuthorityUnavailable,
				providerVersion: inspection.providerVersion,
				registrationEnvironment: inspection.status === "available" ? {
					GHIDRA_INSTALL_DIR: inspection.installDir,
					JAVA_HOME: inspection.javaHome
				} : {},
				checks: [...selectedChecks(inspection).map((check) => projectCheck(check, inspection.installDir !== null)), ...readiness !== undefined ? [{
					name: "native_authority",
					ok: !windowsAuthorityUnavailable,
					code: !readiness.available ? readiness.code : null,
					detail: !readiness.available ? readiness.reason : "Verified Windows native Job Object, private DACL, and reparse-safe handle controls; local NTFS only.",
					remediation: !readiness.available ? readiness.remediation : null,
					classification: !readiness.available && readiness.code === "runtime_unavailable" ? "runtime_failure" : !readiness.available && readiness.code === "runtime_missing" ? "missing_dependency" : "unsupported_host"
				}] : []]
			};
		};
		inspectSystemGhidraProvider = (environment) => Promise.resolve(projectGhidraDoctorInspection(inspectGhidraInstallation({
			environment,
			...environment.GHIDRA_INSTALL_DIR === undefined ? {} : { installDir: environment.GHIDRA_INSTALL_DIR },
			...environment.JAVA_HOME === undefined ? {} : { javaHome: environment.JAVA_HOME }
		})));
		selectedChecks = (inspection) => {
			const byName = new Map(inspection.checks.map((candidate) => [candidate.name, candidate]));
			const configuration = byName.get("configuration");
			if (configuration === undefined) return [];
			if (configuration.status === "failed") return [configuration];
			const installation = byName.get("installation");
			return [
				configuration,
				byName.get("platform"),
				byName.get("architecture"),
				installation,
				...installation?.status === "passed" ? [
					byName.get("version"),
					byName.get("headless"),
					byName.get("native_decompiler")
				] : [],
				byName.get("java")
			].filter((candidate) => Boolean(candidate));
		};
		projectCheck = (check, configured) => ({
			name: check.name,
			ok: check.status === "passed",
			code: check.status === "failed" ? check.code : null,
			detail: check.detail,
			remediation: check.status === "failed" ? check.remediation : null,
			classification: check.name === "platform" || check.name === "architecture" ? "unsupported_host" : check.name === "java" && check.status === "failed" && check.code === "runtime_missing" ? "missing_dependency" : configured ? "config_drift" : "missing_analysis_engine"
		});
	})))();
}

//#endregion
//#region dist/ida/IdaDoctor.js
var inspectIdaRegistration, inspectPrivateWorkspace;
function init_IdaDoctor() {
	return (init_IdaDoctor = __esmMin((() => {
		init_IdaConfiguration();
		init_PrivateRuntimeRoot();
		inspectIdaRegistration = (path) => {
			const parsed = path === undefined ? undefined : readIdaConfiguration(path);
			const valid = parsed?.ok === true;
			const workspaceChecks = parsed?.ok === true && parsed.value.mode === "headless" ? [inspectPrivateWorkspace()] : [];
			return {
				id: "ida",
				configured: path !== undefined,
				available: valid && workspaceChecks.every(({ ok }) => ok),
				providerVersion: null,
				registrationEnvironment: valid && path !== undefined ? { REA_IDA_MCP_CONFIG: path } : {},
				checks: [{
					name: "registration",
					ok: valid,
					code: valid ? null : path === undefined ? "not_configured" : "invalid_configuration",
					detail: valid ? "IDA MCP registration is valid. Upstream availability, compatibility, and target binding are checked when analysis starts; no IDA process was launched." : parsed !== undefined && !parsed.ok ? parsed.error.message : "IDA MCP registration is not configured.",
					remediation: valid ? null : "Set REA_IDA_MCP_CONFIG to your upstream IDA MCP registration JSON; see docs/ida-provider.md.",
					classification: path === undefined ? "missing_analysis_engine" : "config_drift"
				}, ...workspaceChecks]
			};
		};
		inspectPrivateWorkspace = () => {
			const privacy = privateRuntimeRootCapability();
			return {
				name: "private_workspace",
				ok: privacy.available,
				code: privacy.available ? null : privacy.code,
				detail: privacy.available ? `Private workspace authority is available (${privacy.proof}).` : privacy.reason,
				remediation: privacy.available ? null : privacy.remediation,
				classification: !privacy.available && privacy.code === "runtime_missing" ? "missing_dependency" : !privacy.available && privacy.code === "runtime_unavailable" ? "runtime_failure" : "unsupported_host"
			};
		};
	})))();
}

//#endregion
//#region dist/doctorRuntime.js
var createSystemDoctorHost, HOPPER_DEMO_HELPER_PATH, inspectLinuxPrivateDisplay;
function init_doctorRuntime() {
	return (init_doctorRuntime = __esmMin((() => {
		init_Doctor();
		init_JadxDoctor();
		init_GhidraDoctor();
		init_IdaDoctor();
		init_JebMcpEndpoint();
		init_LinuxPrivateDisplayProbe();
		createSystemDoctorHost = (environment = process.env) => {
			const selectedJebEndpoint = environment.REA_JEB_MCP_URL;
			const selectedJebRegistrationEnvironment = selectedJebEndpoint !== undefined && selectedJebEndpoint.length > 0 && parseJebMcpEndpoint(selectedJebEndpoint).ok ? { REA_JEB_MCP_URL: selectedJebEndpoint } : {};
			return systemDoctorHost({
				environment,
				providerRegistrationEnvironment: () => selectedJebRegistrationEnvironment,
				providerInspections: async () => [
					await inspectSystemGhidraProvider(environment),
					inspectIdaRegistration(environment.REA_IDA_MCP_CONFIG),
					await inspectJadxProvider(environment)
				],
				linuxDemoRuntimeCheck: () => inspectLinuxPrivateDisplay(environment)
			});
		};
		HOPPER_DEMO_HELPER_PATH = fileURLToPath(new URL("../scripts/hopper-demo-x11.py", new URL("../doctorRuntime.js", import.meta.url).href));
		inspectLinuxPrivateDisplay = async (environment) => {
			const selection = await selectLinuxPrivateDisplayStrategy({
				helperPath: HOPPER_DEMO_HELPER_PATH,
				environment
			});
			const value = selection.diagnostic;
			const detail = [
				`strategy=${selection.strategy}`,
				`socket_directory=${value.socket_directory}`,
				`mode=${value.socket_directory_mode ?? "unknown"}`,
				`mount_read_only=${String(value.mount_read_only)}`,
				`effective_mode=${value.effective_socket_directory_mode ?? "unknown"}`,
				`effective_mount_read_only=${String(value.effective_mount_read_only)}`,
				`wsl=${String(value.wsl)}`
			].join("; ");
			if (selection.ok) return {
				name: "hopper-demo-runtime",
				ok: true,
				classification: "healthy",
				detail,
				details: { private_display: { ...value } }
			};
			const missingDependency = value.failure_code === "runtime_dependency_unavailable" || value.failure_code === "x11_authorization_failed";
			return {
				name: "hopper-demo-runtime",
				ok: false,
				classification: missingDependency ? "missing_dependency" : "config_drift",
				detail,
				details: { private_display: { ...value } },
				remediation: value.failure_code === "x11_socket_directory_unusable" ? "Enable unprivileged user and mount namespaces, or provide a writable mode-1777 /tmp/.X11-unix directory. Do not mutate the current host mount with sudo; then rerun rea doctor --provider hopper." : missingDependency ? "Install Xvfb, xauth, Python 3, libX11, and libXtst, then rerun rea doctor --provider hopper." : "Inspect the private-display diagnostic, correct the reported local condition, and rerun rea doctor --provider hopper."
			};
		};
	})))();
}

//#endregion
init_doctorRuntime();
export { createSystemDoctorHost };