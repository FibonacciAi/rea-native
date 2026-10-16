import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { err, init_binaryTargetTypes, init_result, isMachOFormat, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ConfigurationError, init_configurationErrors } from "./errorSchemas-CTRmvMl3.js";
import { hopperStartupExitCode, init_hopperStartupFailure, isHopperStartupFailureCode } from "./analysisErrorPresentation-DGt7TdsH.js";
import { ProviderProcessSupervisor, init_ProviderProcess, init_snapshotEnvironment, snapshotEnvironment, spawnOwnedProviderProcess } from "./snapshotEnvironment-D_tWyOub.js";
import { cleanupOwnedProcessGroup, init_ProcessOwnership } from "./ProcessOwnership-DXC5-UWt.js";
import { init_safeJson, safeParseJson } from "./safeJson-DKKACtdy.js";
import { init_binaryTarget, parseExecutableHeader } from "./BinaryTargetResolver-CVIJ_s1A.js";
import { z } from "zod";
import { delimiter, dirname, isAbsolute, posix, win32 } from "node:path";
import { randomUUID } from "node:crypto";
import { accessSync, closeSync, constants, fstatSync, openSync, readFileSync, readSync, realpathSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

//#region dist/hopper/LinuxPrivateDisplayDiagnostic.js
var LINUX_PRIVATE_DISPLAY_DIAGNOSTIC_PREFIX, diagnosticContextSchema, failureCodeSchema, diagnosticSchema, parseLinuxPrivateDisplayDiagnostic;
function init_LinuxPrivateDisplayDiagnostic() {
	return (init_LinuxPrivateDisplayDiagnostic = __esmMin((() => {
		init_hopperStartupFailure();
		init_safeJson();
		LINUX_PRIVATE_DISPLAY_DIAGNOSTIC_PREFIX = "REA_X11_DIAGNOSTIC=";
		diagnosticContextSchema = z.object({
			component: z.literal("hopper_private_display"),
			operation: z.enum(["probe", "launch"]),
			reason: z.string().regex(/^[a-z0-9_]+$/u),
			socket_directory: z.literal("/tmp/.X11-unix"),
			socket_directory_mode: z.string().regex(/^[0-7]{4}$/u).nullable(),
			mount_read_only: z.boolean().nullable(),
			effective_socket_directory_mode: z.string().regex(/^[0-7]{4}$/u).nullable(),
			effective_mount_read_only: z.boolean().nullable(),
			wsl: z.boolean(),
			strategy: z.enum([
				"direct",
				"user-mount-namespace",
				"unavailable"
			]),
			fallback_reason: z.string().regex(/^[a-z0-9_]+$/u).nullable(),
			xvfb_stderr_bytes: z.number().int().nonnegative().safe()
		});
		failureCodeSchema = z.string().transform((value, context) => {
			if (isHopperStartupFailureCode(value)) return value;
			context.addIssue({
				code: "custom",
				message: "Unknown startup failure code"
			});
			return z.NEVER;
		});
		diagnosticSchema = z.discriminatedUnion("status", [diagnosticContextSchema.extend({
			status: z.literal("ready"),
			failure_code: z.null()
		}).strict(), diagnosticContextSchema.extend({
			status: z.literal("error"),
			failure_code: failureCodeSchema
		}).strict()]);
		parseLinuxPrivateDisplayDiagnostic = (stderr) => {
			const records = stderr.split("\n").filter((line) => line.startsWith(LINUX_PRIVATE_DISPLAY_DIAGNOSTIC_PREFIX));
			if (records.length === 0) return {
				ok: false,
				reason: "diagnostic_missing"
			};
			if (records.length !== 1) return {
				ok: false,
				reason: "diagnostic_multiple"
			};
			const record = records[0];
			if (record === undefined) return {
				ok: false,
				reason: "diagnostic_missing"
			};
			const decoded = safeParseJson(record.slice(LINUX_PRIVATE_DISPLAY_DIAGNOSTIC_PREFIX.length));
			if (!decoded.ok) return {
				ok: false,
				reason: "diagnostic_malformed"
			};
			const parsed = diagnosticSchema.safeParse(decoded.value);
			if (!parsed.success) return {
				ok: false,
				reason: "diagnostic_malformed"
			};
			return {
				ok: true,
				value: parsed.data
			};
		};
	})))();
}

//#endregion
//#region dist/hopper/LinuxPrivateDisplayProbe.js
var PYTHON_PATH, UNSHARE_PATH, DEFAULT_PROBE_TIMEOUT_MS, isAborted, selectLinuxPrivateDisplayStrategy, runLinuxPrivateDisplayProbe, privateDisplayProbeCommand, evaluatedProbe, exitMatchesDiagnostic, syntheticDiagnostic, unavailable, emptyProcessResult, waitForProbeOutputClose;
function init_LinuxPrivateDisplayProbe() {
	return (init_LinuxPrivateDisplayProbe = __esmMin((() => {
		init_hopperStartupFailure();
		init_ProcessOwnership();
		init_ProviderProcess();
		init_LinuxPrivateDisplayDiagnostic();
		PYTHON_PATH = "/usr/bin/python3";
		UNSHARE_PATH = "/usr/bin/unshare";
		DEFAULT_PROBE_TIMEOUT_MS = 5e3;
		isAborted = (signal) => signal?.aborted === true;
		selectLinuxPrivateDisplayStrategy = async (options) => {
			const timeoutMs = options.timeoutMs ?? DEFAULT_PROBE_TIMEOUT_MS;
			const runner = options.runProbe ?? runLinuxPrivateDisplayProbe;
			const direct = await evaluatedProbe("direct", options, timeoutMs, runner);
			if (direct.ok) return direct;
			if (direct.diagnostic.failure_code !== "x11_socket_directory_unusable") return unavailable(direct.diagnostic);
			const isolated = await evaluatedProbe("user-mount-namespace", options, timeoutMs, runner);
			if (!isolated.ok) return unavailable({
				...direct.diagnostic,
				strategy: "unavailable",
				reason: "namespace_unavailable",
				fallback_reason: isolated.diagnostic.reason,
				effective_socket_directory_mode: isolated.diagnostic.effective_socket_directory_mode,
				effective_mount_read_only: isolated.diagnostic.effective_mount_read_only,
				xvfb_stderr_bytes: isolated.diagnostic.xvfb_stderr_bytes
			});
			return {
				ok: true,
				strategy: "user-mount-namespace",
				diagnostic: {
					...isolated.diagnostic,
					socket_directory_mode: direct.diagnostic.socket_directory_mode,
					mount_read_only: direct.diagnostic.mount_read_only,
					fallback_reason: null
				}
			};
		};
		runLinuxPrivateDisplayProbe = async (strategy, options) => {
			if (isAborted(options.signal)) return emptyProcessResult("cancelled");
			const command = privateDisplayProbeCommand(options.helperPath, strategy);
			let started;
			try {
				started = await spawnOwnedProviderProcess({
					command: command.command,
					arguments: command.arguments,
					runId: randomUUID(),
					expectedCommand: null,
					...options.environment === undefined ? {} : { hostEnvironment: options.environment },
					...options.signal === undefined ? {} : { signal: options.signal }
				});
			} catch (cause) {
				void cause;
				return emptyProcessResult(isAborted(options.signal) ? "cancelled" : "launch-failed");
			}
			const launch = {
				process: started.process,
				ownsProcessLifetime: true,
				cleanup: () => cleanupOwnedProcessGroup(started.ownership)
			};
			const supervisor = new ProviderProcessSupervisor(launch);
			const outcome = await waitForProbeOutputClose(supervisor, options.timeoutMs, options.signal);
			let cleanupIncomplete = false;
			if (outcome !== "exit") {
				const stopped = await supervisor.stop();
				cleanupIncomplete = stopped.status === "incomplete";
			} else supervisor.dispose();
			const snapshot = supervisor.snapshot();
			return {
				outcome: outcome === "exit" ? "exited" : outcome === "timeout" ? "timed-out" : "cancelled",
				exitCode: snapshot.exitCode,
				stderr: snapshot.stderr.text,
				stderrBytes: snapshot.stderr.bytes,
				cleanupIncomplete
			};
		};
		privateDisplayProbeCommand = (helperPath, strategy) => strategy === "direct" ? {
			command: PYTHON_PATH,
			arguments: [
				helperPath,
				"--probe",
				"--strategy",
				"direct"
			]
		} : {
			command: UNSHARE_PATH,
			arguments: [
				"--user",
				"--map-root-user",
				"--mount",
				"--propagation",
				"private",
				PYTHON_PATH,
				helperPath,
				"--probe",
				"--strategy",
				"user-mount-namespace",
				"--mount-private-x11"
			]
		};
		evaluatedProbe = async (strategy, options, timeoutMs, runner) => {
			let processResult;
			try {
				processResult = await runner(strategy, {
					helperPath: options.helperPath,
					...options.environment === undefined ? {} : { environment: options.environment },
					timeoutMs,
					...options.signal === undefined ? {} : { signal: options.signal }
				});
			} catch (cause) {
				void cause;
				return {
					ok: false,
					diagnostic: syntheticDiagnostic(strategy, "probe_failed")
				};
			}
			if (processResult.outcome === "cancelled") return {
				ok: false,
				diagnostic: syntheticDiagnostic(strategy, "cancelled")
			};
			if (processResult.outcome === "timed-out") return {
				ok: false,
				diagnostic: syntheticDiagnostic(strategy, "probe_timeout")
			};
			if (processResult.outcome === "launch-failed") return {
				ok: false,
				diagnostic: syntheticDiagnostic(strategy, "probe_failed")
			};
			if (processResult.cleanupIncomplete) return {
				ok: false,
				diagnostic: syntheticDiagnostic(strategy, "cleanup_incomplete")
			};
			const parsed = parseLinuxPrivateDisplayDiagnostic(processResult.stderr);
			if (!parsed.ok) return {
				ok: false,
				diagnostic: syntheticDiagnostic(strategy, parsed.reason)
			};
			const diagnostic = parsed.value;
			if (diagnostic.strategy !== strategy || diagnostic.operation !== "probe" || !exitMatchesDiagnostic(processResult.exitCode, diagnostic)) return {
				ok: false,
				diagnostic: syntheticDiagnostic(strategy, "diagnostic_malformed")
			};
			return diagnostic.status === "ready" ? {
				ok: true,
				strategy,
				diagnostic
			} : {
				ok: false,
				diagnostic
			};
		};
		exitMatchesDiagnostic = (exitCode, diagnostic) => diagnostic.status === "ready" ? exitCode === 0 : hopperStartupExitCode(diagnostic.failure_code) === exitCode;
		syntheticDiagnostic = (strategy, reason, failureCode = "private_display_unavailable") => ({
			component: "hopper_private_display",
			operation: "probe",
			status: "error",
			failure_code: failureCode,
			reason,
			socket_directory: "/tmp/.X11-unix",
			socket_directory_mode: null,
			mount_read_only: null,
			effective_socket_directory_mode: null,
			effective_mount_read_only: null,
			wsl: false,
			strategy,
			fallback_reason: null,
			xvfb_stderr_bytes: 0
		});
		unavailable = (diagnostic) => ({
			ok: false,
			strategy: "unavailable",
			exitCode: hopperStartupExitCode(diagnostic.failure_code) ?? 70,
			diagnostic: {
				...diagnostic,
				strategy: "unavailable"
			}
		});
		emptyProcessResult = (outcome) => ({
			outcome,
			exitCode: undefined,
			stderr: "",
			stderrBytes: 0,
			cleanupIncomplete: false
		});
		waitForProbeOutputClose = async (supervisor, timeoutMs, signal) => {
			if (signal?.aborted === true) return "cancelled";
			let releaseAbort;
			const aborted = new Promise((resolve) => {
				if (signal === undefined) return;
				const listener = () => resolve("cancelled");
				signal.addEventListener("abort", listener, { once: true });
				releaseAbort = () => signal.removeEventListener("abort", listener);
			});
			try {
				return await Promise.race([supervisor.waitForOutputClose(Math.max(1, timeoutMs)).then((closed) => closed ? "exit" : "timeout"), aborted]);
			} finally {
				releaseAbort?.();
			}
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraJavaProperties.js
/** Join odd-backslash continuations while stripping leading continuation space. */
function* logicalPropertyLines(content) {
	let physicalStart = 0;
	let logical = "";
	let continuing = false;
	while (physicalStart <= content.length) {
		let physicalEnd = physicalStart;
		while (physicalEnd < content.length && content[physicalEnd] !== "\n" && content[physicalEnd] !== "\r") physicalEnd += 1;
		let line = content.slice(physicalStart, physicalEnd);
		let leading = 0;
		while (isPropertyWhitespace(line[leading])) leading += 1;
		const comment = !continuing && (line[leading] === "#" || line[leading] === "!");
		if (continuing) line = line.slice(leading);
		let continued = false;
		if (!comment) {
			let slashes = 0;
			for (let index = line.length - 1; index >= 0 && line[index] === "\\"; index -= 1) slashes += 1;
			continued = slashes % 2 === 1;
			logical += continued ? line.slice(0, -1) : line;
		}
		if (!continued) {
			yield logical;
			logical = "";
		}
		continuing = continued;
		if (physicalEnd === content.length) break;
		physicalStart = content[physicalEnd] === "\r" && content[physicalEnd + 1] === "\n" ? physicalEnd + 2 : physicalEnd + 1;
	}
	if (continuing) yield logical;
}
var parseGhidraJavaProperties, isPropertyWhitespace, decodePropertyEscapes;
function init_GhidraJavaProperties() {
	return (init_GhidraJavaProperties = __esmMin((() => {
		init_result();
		parseGhidraJavaProperties = (content) => {
			const values = new Map();
			for (const line of logicalPropertyLines(content)) {
				let start = 0;
				while (isPropertyWhitespace(line[start])) start += 1;
				if (start === line.length || line[start] === "#" || line[start] === "!") continue;
				let end = start;
				let escaped = false;
				while (end < line.length) {
					const character = line[end];
					if (!escaped && (character === "=" || character === ":" || isPropertyWhitespace(character))) break;
					if (character === "\\") escaped = !escaped;
					else escaped = false;
					end += 1;
				}
				let valueStart = end;
				while (isPropertyWhitespace(line[valueStart])) valueStart += 1;
				if (line[valueStart] === "=" || line[valueStart] === ":") valueStart += 1;
				while (isPropertyWhitespace(line[valueStart])) valueStart += 1;
				const key = decodePropertyEscapes(line.slice(start, end));
				if (!key.ok) return err(key.error);
				const value = decodePropertyEscapes(line.slice(valueStart));
				if (!value.ok) return err(value.error);
				values.set(key.value, value.value);
			}
			return ok(values);
		};
		isPropertyWhitespace = (value) => value === " " || value === "	" || value === "\f";
		decodePropertyEscapes = (value) => {
			let result = "";
			for (let index = 0; index < value.length; index += 1) {
				const character = value[index];
				if (character !== "\\") {
					result += character;
					continue;
				}
				const escaped = value[++index];
				if (escaped === undefined) return err("Trailing escape in Java properties value");
				if (escaped === "t") result += "	";
				else if (escaped === "n") result += "\n";
				else if (escaped === "r") result += "\r";
				else if (escaped === "f") result += "\f";
				else if (escaped === "u") {
					const digits = value.slice(index + 1, index + 5);
					if (digits.length !== 4 || !/^[0-9a-f]{4}$/iu.test(digits)) return err("Malformed Unicode escape in Java properties file");
					result += String.fromCharCode(Number.parseInt(digits, 16));
					index += 4;
				} else result += escaped;
			}
			return ok(result);
		};
	})))();
}

//#endregion
//#region dist/ghidra/GhidraInstallationPolicy.js
var SUPPORTED_GHIDRA_VERSION, SUPPORTED_GHIDRA_JAVA_MAJOR, GHIDRA_RELEASE_PATTERN, ghidraApplicationProperties, ghidraReleaseCompatibility, unverifiedGhidraBuildLimitation, ghidraReleaseLine, ghidraVersionDetail, ghidraReleaseAccepted, ghidraJavaRequirement, ghidraJavaRangeLabel, ghidraJavaMajorAccepted, verifiedGhidraRelease, parseGhidraRelease, parseJavaBound, parseJavaMaximum, parseJavaInteger, javaDecimalDigit, integerGroup, unresolvedJavaRequirement;
function init_GhidraInstallationPolicy() {
	return (init_GhidraInstallationPolicy = __esmMin((() => {
		init_GhidraJavaProperties();
		SUPPORTED_GHIDRA_VERSION = "12.1.4";
		SUPPORTED_GHIDRA_JAVA_MAJOR = 21;
		GHIDRA_RELEASE_PATTERN = /^(\d+)\.(\d+)(?:\.(\d+))?([-+].*)?$/u;
		ghidraApplicationProperties = (content) => {
			const parsed = parseGhidraJavaProperties(content);
			if (!parsed.ok) return {
				providerVersion: null,
				javaMinimum: {
					status: "unresolved",
					raw: parsed.error
				},
				javaMaximum: {
					status: "unresolved",
					raw: parsed.error
				},
				parseError: parsed.error
			};
			const providerVersion = parsed.value.get("application.version");
			const minimum = parsed.value.get("application.java.min");
			const maximum = parsed.value.get("application.java.max");
			return {
				providerVersion: providerVersion ?? null,
				javaMinimum: minimum === undefined ? { status: "absent" } : parseJavaBound(minimum),
				javaMaximum: parseJavaMaximum(maximum),
				parseError: null
			};
		};
		ghidraReleaseCompatibility = (raw) => {
			if (raw === null || raw === undefined) return {
				status: "unresolved",
				raw: null
			};
			const version = parseGhidraRelease(raw);
			if (version === undefined) return {
				status: "unresolved",
				raw
			};
			if (raw === "12.1.4") return {
				status: "verified",
				version,
				raw
			};
			const verified = verifiedGhidraRelease();
			return version.major === verified.major && version.minor === verified.minor ? {
				status: "compatible",
				version,
				raw
			} : {
				status: "unsupported",
				version,
				raw
			};
		};
		unverifiedGhidraBuildLimitation = (providerVersion) => {
			const compatibility = ghidraReleaseCompatibility(providerVersion);
			if (compatibility.status !== "compatible") return undefined;
			return `This session uses Ghidra ${providerVersion}. The bridge is verified against ${SUPPORTED_GHIDRA_VERSION}; other ${ghidraReleaseLine()} builds are accepted and the observed version is reported.`;
		};
		ghidraReleaseLine = () => {
			const verified = verifiedGhidraRelease();
			return `${String(verified.major)}.${String(verified.minor)}.x`;
		};
		ghidraVersionDetail = (raw) => {
			const compatibility = ghidraReleaseCompatibility(raw);
			switch (compatibility.status) {
				case "unresolved": return compatibility.raw ?? "unknown";
				case "verified": return compatibility.raw;
				case "compatible": return `${compatibility.raw}; compatible ${ghidraReleaseLine()} release (verified build ${SUPPORTED_GHIDRA_VERSION})`;
				case "unsupported": return `${compatibility.raw}; accepted releases are ${ghidraReleaseLine()} (verified build ${SUPPORTED_GHIDRA_VERSION})`;
				default: {
					const unreachable = compatibility;
					return unreachable;
				}
			}
		};
		ghidraReleaseAccepted = (raw) => {
			const status = ghidraReleaseCompatibility(raw).status;
			return status === "verified" || status === "compatible";
		};
		ghidraJavaRequirement = (properties) => {
			if (properties?.parseError !== null && properties?.parseError !== undefined) return unresolvedJavaRequirement(`application.properties parse failed: ${properties.parseError}`);
			if (properties === undefined) return unresolvedJavaRequirement("application.properties is unavailable");
			const minimum = properties.javaMinimum;
			const maximum = properties.javaMaximum;
			if (minimum.status === "unresolved") return unresolvedJavaRequirement(`application.java.min=${minimum.raw}`);
			if (minimum.status === "absent") return unresolvedJavaRequirement("application.java.min is missing");
			if (maximum.status === "unresolved") return unresolvedJavaRequirement(`application.java.max=${maximum.raw}`);
			const minimumMajor = minimum.major;
			const maximumMajor = maximum.status === "major" ? maximum.major : null;
			if (maximumMajor !== null && maximumMajor < minimumMajor) return unresolvedJavaRequirement(`application.java.max=${String(maximumMajor)} is below application.java.min=${String(minimumMajor)}`);
			return {
				minimumMajor,
				maximumMajor,
				unresolved: null
			};
		};
		ghidraJavaRangeLabel = (requirement) => {
			if (requirement.unresolved !== null) return "a 64-bit full JDK matching the installation's declared Java bounds";
			if (requirement.maximumMajor === null) return `a 64-bit full JDK ${String(requirement.minimumMajor)} or newer`;
			if (requirement.maximumMajor === requirement.minimumMajor) return `a 64-bit full JDK ${String(requirement.minimumMajor)}`;
			return `a 64-bit full JDK ${String(requirement.minimumMajor)} through ${String(requirement.maximumMajor)}`;
		};
		ghidraJavaMajorAccepted = (major, requirement) => requirement.unresolved === null && major >= requirement.minimumMajor && (requirement.maximumMajor === null || major <= requirement.maximumMajor);
		verifiedGhidraRelease = () => {
			const version = parseGhidraRelease(SUPPORTED_GHIDRA_VERSION);
			if (version === undefined) throw new TypeError(`SUPPORTED_GHIDRA_VERSION ${SUPPORTED_GHIDRA_VERSION} is not a Ghidra release`);
			return version;
		};
		parseGhidraRelease = (raw) => {
			const match = GHIDRA_RELEASE_PATTERN.exec(raw);
			const major = integerGroup(match?.[1]);
			const minor = integerGroup(match?.[2]);
			if (match === null || major === undefined || minor === undefined) return undefined;
			const patch = match[3] === undefined ? 0 : integerGroup(match[3]);
			return patch === undefined ? undefined : {
				major,
				minor,
				patch
			};
		};
		parseJavaBound = (raw) => {
			const major = parseJavaInteger(raw);
			return major === undefined ? {
				status: "unresolved",
				raw
			} : {
				status: "major",
				major
			};
		};
		parseJavaMaximum = (raw) => {
			if (raw === undefined || raw === "") return { status: "absent" };
			const bound = parseJavaBound(raw);
			return bound.status === "major" && bound.major === 0 ? { status: "absent" } : bound;
		};
		parseJavaInteger = (raw) => {
			let index = 0;
			let sign = 1;
			if (raw[index] === "+" || raw[index] === "-") {
				if (raw[index] === "-") sign = -1;
				index += 1;
			}
			if (index === raw.length) return undefined;
			const limit = sign < 0 ? 2147483648 : 2147483647;
			let value = 0;
			for (; index < raw.length; index += 1) {
				const character = raw[index];
				if (character === undefined) return undefined;
				const digit = javaDecimalDigit(character);
				if (digit === undefined) return undefined;
				if (value > Math.floor((limit - digit) / 10)) return undefined;
				value = value * 10 + digit;
			}
			return sign * value;
		};
		javaDecimalDigit = (character) => {
			const code = character.charCodeAt(0);
			if (code >= 48 && code <= 57) return code - 48;
			if (!/^\p{Decimal_Number}$/u.test(character)) return undefined;
			let blockStart = code;
			while (blockStart > 0 && /^\p{Decimal_Number}$/u.test(String.fromCharCode(blockStart - 1))) blockStart -= 1;
			return (code - blockStart) % 10;
		};
		integerGroup = (value) => {
			if (value === undefined) return undefined;
			const parsed = Number(value);
			return Number.isSafeInteger(parsed) ? parsed : undefined;
		};
		unresolvedJavaRequirement = (unresolved) => ({ unresolved });
	})))();
}
/** Parse Java Properties.load(InputStream) syntax from its ISO-8859-1 text. */

//#endregion
//#region dist/ghidra/GhidraInstallation.js
var NATIVE_PLATFORMS, NATIVE_TOOL_FORMATS, NATIVE_ARCHITECTURES, EXECUTABLE_HEADER_PROBE_BYTES, JAVA_PROBE_MAX_OUTPUT_BYTES, assessNativeDecompiler, inspectGhidraInstallation, availableInstallation, installationCoordinates, installationChecks, configurationCheck, ghidraInstallationDiagnostics, ghidraJavaEnvironment, installationCheck, nativeDecompilerCheck, jvmOsNameMatchesPlatform, jvmOsArchNativeDirectory, versionCheck, javaCheck, javaRemediation, systemGhidraInstallationHost, discoverGhidraInstallationOnPath, executablePath, javaProperty, javaMajor;
function init_GhidraInstallation() {
	return (init_GhidraInstallation = __esmMin((() => {
		init_snapshotEnvironment();
		init_binaryTarget();
		init_binaryTargetTypes();
		init_GhidraInstallationPolicy();
		NATIVE_PLATFORMS = {
			linux: {
				x64: "linux_x86_64",
				arm64: "linux_arm_64"
			},
			darwin: {
				x64: "mac_x86_64",
				arm64: "mac_arm_64"
			},
			win32: { x64: "win_x86_64" }
		};
		NATIVE_TOOL_FORMATS = {
			linux: "elf",
			darwin: "mach-o",
			win32: "pe"
		};
		NATIVE_ARCHITECTURES = [
			{
				node: "x64",
				binary: "x86_64"
			},
			{
				node: "ia32",
				binary: "x86"
			},
			{
				node: "arm",
				binary: "arm"
			},
			{
				node: "arm64",
				binary: "arm64"
			}
		];
		EXECUTABLE_HEADER_PROBE_BYTES = 4096;
		JAVA_PROBE_MAX_OUTPUT_BYTES = 1024 * 1024;
		assessNativeDecompiler = (path, platform, architecture, probe) => {
			const expectedFormat = NATIVE_TOOL_FORMATS[platform];
			const expectedArchitecture = NATIVE_ARCHITECTURES.find(({ node }) => node === architecture)?.binary;
			if (expectedFormat === undefined || expectedArchitecture === undefined) return {
				status: "unknown",
				detail: `${path} is executable, but no native tool format is defined for ${platform}/${architecture}`
			};
			let parsed = probe === undefined ? undefined : parseExecutableHeader(probe.bytes, architecture, probe.size);
			if (probe !== undefined && parsed !== undefined && !parsed.ok) {
				for (const { node } of NATIVE_ARCHITECTURES) {
					if (node === architecture) continue;
					const alternative = parseExecutableHeader(probe.bytes, node, probe.size);
					if (alternative.ok && !alternative.value.availableArchitectures.some((available) => available === expectedArchitecture)) {
						parsed = alternative;
						break;
					}
				}
			}
			if (parsed === undefined || !parsed.ok) return {
				status: "unknown",
				detail: `${path} is executable, but its executable format for ${platform}/${architecture} could not be established`
			};
			const observed = `${parsed.value.format} ${parsed.value.architecture}`;
			const expected = `${expectedFormat} ${expectedArchitecture}`;
			const formatMatches = isMachOFormat(expectedFormat) ? isMachOFormat(parsed.value.format) : parsed.value.format === expectedFormat;
			if (formatMatches && parsed.value.architecture === expectedArchitecture) return {
				status: "compatible",
				detail: `${path} reports ${observed}, which matches ${platform}/${architecture}`
			};
			const nativeDirectory = NATIVE_PLATFORMS[platform]?.[architecture];
			const executable = platform === "win32" ? "decompile.exe" : "decompile";
			return {
				status: "incompatible",
				detail: `${path} reports ${observed}, but ${platform}/${architecture} requires ${expected}`,
				remediation: `Provide an executable Ghidra/Features/Decompiler/os/${nativeDirectory ?? "<platform>"}/${executable} built for ${expected}, or its build/os equivalent. REA does not build or install native tools.`
			};
		};
		inspectGhidraInstallation = (options, host = systemGhidraInstallationHost()) => {
			const platform = options.platform ?? process.platform;
			const architecture = options.architecture ?? process.arch;
			const coordinates = installationCoordinates(options, platform, architecture, host);
			const checks = installationChecks({
				coordinates,
				platform,
				architecture,
				javaHome: options.javaHome,
				host
			});
			const failed = checks.find((check) => check.status === "failed");
			const observation = {
				platform,
				architecture,
				applicationPropertiesPath: coordinates.applicationPropertiesPath,
				nativeDecompilerPath: coordinates.nativeDecompilerPath,
				javaCommand: coordinates.javaCommand,
				...coordinates.java?.vmName === undefined ? {} : { javaVmName: coordinates.java.vmName },
				...coordinates.java?.osArch === undefined ? {} : { javaOsArch: coordinates.java.osArch },
				...coordinates.java?.osName === undefined ? {} : { javaOsName: coordinates.java.osName },
				checks
			};
			if (failed !== undefined) return {
				status: "unavailable",
				...observation,
				installDir: coordinates.installDir,
				analyzeHeadlessPath: coordinates.analyzeHeadlessPath,
				providerVersion: coordinates.properties?.providerVersion ?? null,
				javaHome: coordinates.java?.home ?? options.javaHome ?? null,
				javaVersion: coordinates.java?.version ?? null,
				rejection: {
					code: failed.code,
					reason: failed.remediation
				}
			};
			return availableInstallation(coordinates, observation);
		};
		availableInstallation = (coordinates, observation) => {
			const providerVersion = coordinates.properties?.providerVersion;
			if (coordinates.installDir === null || coordinates.applicationPropertiesPath === null || coordinates.analyzeHeadlessPath === null || providerVersion === null || providerVersion === undefined || coordinates.java === undefined) throw new TypeError("Passing Ghidra installation checks produced incomplete coordinates");
			return {
				status: "available",
				...observation,
				installDir: coordinates.installDir,
				analyzeHeadlessPath: coordinates.analyzeHeadlessPath,
				applicationPropertiesPath: coordinates.applicationPropertiesPath,
				providerVersion,
				javaHome: coordinates.java.home,
				javaVersion: coordinates.java.version
			};
		};
		installationCoordinates = (options, platform, architecture, host) => {
			const path = platform === "win32" ? win32 : posix;
			const installDir = options.installDir ?? host.discoverInstallDirOnPath?.(options.environment, platform) ?? null;
			const applicationPropertiesPath = installDir === null ? null : path.join(installDir, "Ghidra", "application.properties");
			const analyzeHeadlessPath = installDir === null ? null : path.join(installDir, "support", platform === "win32" ? "analyzeHeadless.bat" : "analyzeHeadless");
			const decompilerPlatform = NATIVE_PLATFORMS[platform]?.[architecture];
			const decompilerExecutable = platform === "win32" ? "decompile.exe" : "decompile";
			const nativeDecompilerPath = installDir === null || decompilerPlatform === undefined ? null : [path.join(installDir, "Ghidra", "Features", "Decompiler", "os", decompilerPlatform, decompilerExecutable), path.join(installDir, "Ghidra", "Features", "Decompiler", "build", "os", decompilerPlatform, decompilerExecutable)].find((candidate) => host.executable(candidate)) ?? null;
			const properties = applicationPropertiesPath === null ? undefined : host.readText(applicationPropertiesPath);
			const javaCommand = options.javaHome === undefined ? platform === "win32" ? "java.exe" : "java" : path.join(options.javaHome, "bin", platform === "win32" ? "java.exe" : "java");
			return {
				installDir,
				applicationPropertiesPath,
				analyzeHeadlessPath,
				nativeDecompilerPath,
				properties: properties === undefined ? undefined : ghidraApplicationProperties(properties),
				javaCommand,
				java: options.javaHome === undefined || path.isAbsolute(options.javaHome) ? host.probeJava(javaCommand, ghidraJavaEnvironment(options.javaHome, options.environment, platform)) : undefined
			};
		};
		installationChecks = ({ coordinates, platform, architecture, javaHome, host }) => [
			configurationCheck(coordinates.installDir, javaHome, platform),
			installationCheck({
				name: "platform",
				passed: NATIVE_PLATFORMS[platform] !== undefined,
				code: "unsupported_host",
				detail: platform,
				remediation: "Use Linux or macOS x64/arm64, or Windows x64 with matching native Ghidra tools."
			}),
			installationCheck({
				name: "architecture",
				passed: NATIVE_PLATFORMS[platform]?.[architecture] !== undefined,
				code: "unsupported_host",
				detail: architecture,
				remediation: "Use x64/arm64 on Linux or macOS, or x64 on Windows."
			}),
			installationCheck({
				name: "installation",
				passed: coordinates.properties !== undefined,
				code: "executable_missing",
				detail: coordinates.applicationPropertiesPath ?? "Ghidra application properties unavailable",
				remediation: "Point GHIDRA_INSTALL_DIR at the root of an extracted official Ghidra release."
			}),
			versionCheck(coordinates.properties),
			installationCheck({
				name: "headless",
				passed: coordinates.analyzeHeadlessPath !== null && host.executable(coordinates.analyzeHeadlessPath),
				code: "executable_missing",
				detail: coordinates.analyzeHeadlessPath ?? "analyzeHeadless unavailable",
				remediation: "Restore support/analyzeHeadless or support/analyzeHeadless.bat from the official Ghidra release."
			}),
			nativeDecompilerCheck({
				coordinates,
				platform,
				architecture,
				host
			}),
			javaCheck(coordinates.java, coordinates.javaCommand, javaHome, coordinates.properties)
		];
		configurationCheck = (installDir, javaHome, platform) => {
			const { isAbsolute } = platform === "win32" ? win32 : posix;
			const relative = [...installDir !== null && !isAbsolute(installDir) ? ["GHIDRA_INSTALL_DIR"] : [], ...javaHome !== undefined && !isAbsolute(javaHome) ? ["JAVA_HOME"] : []];
			if (installDir === null || relative.length === 0) return installationCheck({
				name: "configuration",
				passed: installDir !== null,
				code: "not_configured",
				detail: installDir ?? "GHIDRA_INSTALL_DIR is not set",
				remediation: `Set GHIDRA_INSTALL_DIR to an extracted Ghidra ${ghidraReleaseLine()} release directory.`
			});
			const settings = relative.join(" and ");
			return installationCheck({
				name: "configuration",
				passed: false,
				code: "not_configured",
				detail: `${settings} must be absolute`,
				remediation: `Set ${settings} to ${relative.length === 1 ? "an absolute path" : "absolute paths"}. REA's analysis and MCP server reject relative paths even when they resolve from the current directory.`
			});
		};
		ghidraInstallationDiagnostics = (inspection) => ({
			install_dir: inspection.installDir,
			analyze_headless_path: inspection.analyzeHeadlessPath,
			native_decompiler_path: inspection.nativeDecompilerPath,
			application_properties_path: inspection.applicationPropertiesPath,
			provider_version: inspection.providerVersion,
			java_command: inspection.javaCommand,
			java_home: inspection.javaHome,
			java_version: inspection.javaVersion,
			java_vm_name: inspection.javaVmName ?? null,
			java_os_arch: inspection.javaOsArch ?? null,
			java_os_name: inspection.javaOsName ?? null,
			platform: inspection.platform,
			architecture: inspection.architecture,
			checks: inspection.checks.map((check) => ({
				name: check.name,
				ok: check.status === "passed",
				code: check.status === "failed" ? check.code : null,
				detail: check.detail
			}))
		});
		ghidraJavaEnvironment = (javaHome, environment, platform = process.platform) => {
			const selectedEnvironment = snapshotEnvironment(environment, platform);
			const boundedEnvironment = {
				...selectedEnvironment,
				_JAVA_OPTIONS: "",
				JAVA_TOOL_OPTIONS: "",
				JDK_JAVA_OPTIONS: "",
				GHIDRA_JAVA_OPTIONS: ""
			};
			return javaHome === undefined ? boundedEnvironment : {
				...boundedEnvironment,
				JAVA_HOME: javaHome,
				PATH: `${(platform === "win32" ? win32 : posix).join(javaHome, "bin")}${platform === "win32" ? win32.delimiter : posix.delimiter}${selectedEnvironment.PATH ?? ""}`
			};
		};
		installationCheck = (options) => options.passed ? {
			status: "passed",
			name: options.name,
			detail: options.detail
		} : {
			status: "failed",
			name: options.name,
			code: options.code,
			detail: options.detail,
			remediation: options.remediation
		};
		nativeDecompilerCheck = ({ coordinates, platform, architecture, host }) => {
			const path = coordinates.nativeDecompilerPath;
			const compatibility = path === null ? undefined : assessNativeDecompiler(path, platform, architecture, host.executableHeader?.(path));
			const osArch = coordinates.java?.osArch;
			const osName = coordinates.java?.osName;
			const selectedDirectory = jvmOsArchNativeDirectory(platform, osArch);
			const validatedDirectory = NATIVE_PLATFORMS[platform]?.[architecture];
			if (coordinates.java !== undefined) {
				if (selectedDirectory === undefined) return installationCheck({
					name: "native_decompiler",
					passed: false,
					code: "executable_missing",
					detail: osArch === undefined ? "The Java probe did not report os.arch; the JVM-selected native decompiler directory is unknown and cannot be matched to the validated host directory" : `JVM reports unrecognized os.arch=${osArch}; its selected native decompiler directory is unknown and cannot be matched to the validated host directory`,
					remediation: `Point JAVA_HOME at a JDK whose reported architecture maps to the validated Ghidra decompiler (${validatedDirectory ?? "unsupported host"}). REA does not build or install native tools.`
				});
				if (validatedDirectory !== undefined && selectedDirectory !== validatedDirectory && path !== null) return installationCheck({
					name: "native_decompiler",
					passed: false,
					code: "executable_missing",
					detail: `JVM reports os.arch=${osArch}, so Ghidra selects its native decompiler from os/${selectedDirectory}, but the validated decompiler targets ${validatedDirectory} (host ${platform}/${architecture})`,
					remediation: `Point JAVA_HOME at a JDK whose architecture matches the built decompiler (${validatedDirectory}). REA does not build or install native tools.`
				});
				if (osName === undefined) return installationCheck({
					name: "native_decompiler",
					passed: false,
					code: "executable_missing",
					detail: "The Java probe did not report os.name; the JVM-selected native decompiler OS directory is unknown and cannot be matched to the validated host platform",
					remediation: `Point JAVA_HOME at a JDK whose reported operating system matches the host platform (${platform}). REA does not build or install native tools.`
				});
				if (!jvmOsNameMatchesPlatform(platform, osName) && path !== null) return installationCheck({
					name: "native_decompiler",
					passed: false,
					code: "executable_missing",
					detail: `JVM reports os.name=${osName}, which does not match the validated host platform ${platform} (host ${platform}/${architecture})`,
					remediation: `Point JAVA_HOME at a JDK whose reported operating system matches the host platform (${platform}). REA does not build or install native tools.`
				});
			}
			return installationCheck({
				name: "native_decompiler",
				passed: path !== null && compatibility?.status !== "incompatible",
				code: "executable_missing",
				detail: compatibility?.detail ?? `Matching native decompiler for ${platform}/${architecture} was not found`,
				remediation: compatibility?.status === "incompatible" ? compatibility.remediation : `Provide an executable Ghidra/Features/Decompiler/os/${NATIVE_PLATFORMS[platform]?.[architecture] ?? "<platform>"}/${platform === "win32" ? "decompile.exe" : "decompile"}, or its build/os equivalent. REA does not build or install native tools.`
			});
		};
		jvmOsNameMatchesPlatform = (platform, osName) => {
			const normalized = osName.toLowerCase();
			if (platform === "win32") return normalized.startsWith("windows");
			if (platform === "darwin") return normalized.startsWith("mac") || normalized.startsWith("darwin");
			if (platform === "linux") return normalized.startsWith("linux");
			return false;
		};
		jvmOsArchNativeDirectory = (platform, osArch) => {
			if (osArch === undefined) return undefined;
			const normalized = osArch.toLowerCase();
			const node = normalized === "x86_64" || normalized === "amd64" || normalized === "x64" ? "x64" : normalized === "aarch64" || normalized === "arm64" ? "arm64" : undefined;
			return node === undefined ? undefined : NATIVE_PLATFORMS[platform]?.[node];
		};
		versionCheck = (properties) => {
			const raw = properties?.providerVersion;
			const parseError = properties?.parseError;
			return installationCheck({
				name: "version",
				passed: parseError == null && ghidraReleaseAccepted(raw),
				code: parseError != null ? "version_unresolved" : ghidraReleaseCompatibility(raw).status === "unsupported" ? "unsupported_version" : "version_unresolved",
				detail: parseError == null ? ghidraVersionDetail(raw) : `application.properties could not be parsed: ${parseError}`,
				remediation: `Install a Ghidra ${ghidraReleaseLine()} release (verified with ${SUPPORTED_GHIDRA_VERSION}), or update REA for another Ghidra line.`
			});
		};
		javaCheck = (observation, command, configuredHome, properties) => {
			const requirement = ghidraJavaRequirement(properties);
			const range = ghidraJavaRangeLabel(requirement);
			const supported = observation !== undefined && ghidraJavaMajorAccepted(observation.major, requirement) && observation.bits === 64 && observation.runtime === "jdk";
			const bitness = observation === undefined ? undefined : observation.bits === null ? `bitness unknown${observation.unparsedBits === undefined ? "" : ` (sun.arch.data.model = ${JSON.stringify(observation.unparsedBits)})`}` : `${String(observation.bits)}-bit`;
			const knownMismatch = observation !== undefined && (!ghidraJavaMajorAccepted(observation.major, requirement) || observation.bits !== null && observation.bits !== 64 || observation.runtime !== "jdk");
			const detail = observation === undefined ? requirement.unresolved === null ? command : `${command}; ${requirement.unresolved}` : `${observation.version}; ${bitness}; ${observation.runtime === "jdk" ? "JDK" : "runtime only"}; ${observation.home}; accepted ${range}`;
			return installationCheck({
				name: "java",
				passed: supported,
				code: requirement.unresolved !== null ? "version_unresolved" : observation === undefined ? "runtime_missing" : knownMismatch ? "unsupported_version" : "version_unresolved",
				detail,
				remediation: javaRemediation(requirement, configuredHome, range)
			});
		};
		javaRemediation = (requirement, configuredHome, range) => {
			if (requirement.unresolved !== null) return `The Ghidra installation's Java bounds could not be read (${requirement.unresolved}). Install a 64-bit full JDK inside the declared application.java.min and application.java.max.`;
			return configuredHome === undefined ? `Install ${range}, or set JAVA_HOME before starting REA.` : `Update JAVA_HOME to the root of ${range} installation.`;
		};
		systemGhidraInstallationHost = () => ({
			readText(path) {
				try {
					return readFileSync(path).toString("latin1");
				} catch (cause) {
					void cause;
					return undefined;
				}
			},
			executableHeader(path) {
				let handle;
				try {
					handle = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK | constants.O_NOCTTY);
					const metadata = fstatSync(handle);
					if (!metadata.isFile()) return undefined;
					const bytes = Buffer.alloc(EXECUTABLE_HEADER_PROBE_BYTES);
					const read = readSync(handle, bytes, 0, bytes.length, 0);
					return {
						bytes: bytes.subarray(0, read),
						size: metadata.size
					};
				} catch (cause) {
					void cause;
					return undefined;
				} finally {
					if (handle !== undefined) closeSync(handle);
				}
			},
			executable(path) {
				try {
					accessSync(path, constants.X_OK);
					return statSync(path).isFile();
				} catch (cause) {
					void cause;
					return false;
				}
			},
			probeJava(command, environment) {
				const observed = spawnSync(command, [
					"-Dstdout.encoding=UTF-8",
					"-Dstderr.encoding=UTF-8",
					"-Dsun.stdout.encoding=UTF-8",
					"-Dsun.stderr.encoding=UTF-8",
					"-XX:-UsePerfData",
					"-XshowSettings:properties",
					"-version"
				], {
					encoding: "utf8",
					env: environment,
					timeout: 5e3,
					maxBuffer: JAVA_PROBE_MAX_OUTPUT_BYTES,
					windowsHide: true
				});
				if (observed.error !== undefined || observed.status !== 0) return undefined;
				const output = `${observed.stdout ?? ""}\n${observed.stderr ?? ""}`;
				const version = javaProperty(output, "java.version");
				const home = javaProperty(output, "java.home");
				const vmName = javaProperty(output, "java.vm.name");
				const osArch = javaProperty(output, "os.arch");
				const osName = javaProperty(output, "os.name");
				const reportedBits = javaProperty(output, "sun.arch.data.model");
				const parsedBits = reportedBits !== null && /^\d+$/.test(reportedBits) ? Number(reportedBits) : null;
				const bits = parsedBits !== null && Number.isSafeInteger(parsedBits) ? parsedBits : null;
				if (version === null || version.length === 0 || home === null || home.length === 0) return undefined;
				return {
					version,
					major: javaMajor(version),
					home,
					...vmName === null ? {} : { vmName },
					...osArch === null ? {} : { osArch },
					...osName === null ? {} : { osName },
					bits,
					...reportedBits === null || bits !== null ? {} : { unparsedBits: reportedBits },
					runtime: executablePath((process.platform === "win32" ? win32 : posix).join(home, "bin", process.platform === "win32" ? "javac.exe" : "javac")) ? "jdk" : "jre"
				};
			},
			discoverInstallDirOnPath: discoverGhidraInstallationOnPath
		});
		discoverGhidraInstallationOnPath = (environment, platform) => {
			if (platform !== process.platform) return undefined;
			const path = platform === "win32" ? win32 : posix;
			const pathValue = environment.PATH;
			if (pathValue === undefined || pathValue.length === 0) return undefined;
			const launchers = platform === "win32" ? [
				"ghidra.bat",
				"ghidraRun.bat",
				"ghidra.exe",
				"ghidraRun.exe"
			] : ["ghidra", "ghidraRun"];
			for (const directory of pathValue.split(delimiter)) {
				if (directory.length === 0) continue;
				for (const launcher of launchers) {
					let resolved;
					try {
						const candidate = path.resolve(directory, launcher);
						if (!executablePath(candidate)) continue;
						resolved = realpathSync(candidate);
					} catch (cause) {
						void cause;
						continue;
					}
					const root = dirname(resolved);
					const properties = path.join(root, "Ghidra", "application.properties");
					const headless = path.join(root, "support", platform === "win32" ? "analyzeHeadless.bat" : "analyzeHeadless");
					try {
						if (statSync(properties).isFile() && executablePath(headless)) return root;
					} catch (cause) {
						void cause;
					}
				}
			}
			return undefined;
		};
		executablePath = (path) => {
			try {
				accessSync(path, constants.X_OK);
				return statSync(path).isFile();
			} catch (cause) {
				void cause;
				return false;
			}
		};
		javaProperty = (output, name) => new RegExp(`^[ \\t]*${name.replaceAll(".", "\\.")}[ \\t]*=[ \\t]*([^\\r\\n]*?)[ \\t]*\\r?$`, "mu").exec(output)?.[1] ?? null;
		javaMajor = (version) => {
			const first = Number.parseInt(version.split(".")[0] ?? "0", 10);
			if (first !== 1) return first;
			return Number.parseInt(version.split(".")[1] ?? "0", 10);
		};
	})))();
}

//#endregion
//#region dist/ida/IdaConfiguration.js
var common, registrationSchema, idaProtocol, readIdaConfiguration, idaConfigurationError;
function init_IdaConfiguration() {
	return (init_IdaConfiguration = __esmMin((() => {
		init_configurationErrors();
		init_result();
		common = {
			mode: z.enum(["attached", "headless"]).default("attached"),
			protocol: z.literal("native").optional(),
			timeoutMs: z.number().int().positive().max(2147483647).default(3e5),
			workspaceRoot: z.string().refine(isAbsolute, "workspaceRoot must be absolute on the REA host").optional()
		};
		registrationSchema = z.union([z.object({
			...common,
			type: z.literal("stdio").optional(),
			command: z.string().min(1),
			args: z.array(z.string()).default([]),
			env: z.record(z.string(), z.string()).default({})
		}).strict(), z.object({
			...common,
			type: z.literal("http").optional(),
			url: z.url().refine((value) => {
				const url = new URL(value);
				return ["http:", "https:"].includes(url.protocol) && [
					"localhost",
					"127.0.0.1",
					"[::1]"
				].includes(url.hostname) && url.username === "" && url.password === "";
			}, "IDA MCP must use a local HTTP endpoint without URL credentials"),
			headers: z.record(z.string(), z.string()).default({})
		}).strict()]).refine((config) => config.protocol !== "native" || config.mode === "attached", "The native IDA MCP protocol requires attached mode");
		idaProtocol = (config) => config.protocol ?? (config.mode === "attached" ? "legacy" : "modern");
		readIdaConfiguration = (path) => {
			try {
				if (statSync(path).size > 65536) return err(idaConfigurationError("REA_IDA_MCP_CONFIG exceeds the 64 KiB registration size."));
				const input = JSON.parse(readFileSync(path, "utf8"));
				const envelope = z.object({ mcpServers: z.object({ "ida-pro-mcp": z.unknown() }) }).safeParse(input);
				const parsed = registrationSchema.safeParse(envelope.success ? envelope.data.mcpServers["ida-pro-mcp"] : input);
				return parsed.success ? ok(parsed.data) : err(idaConfigurationError("REA_IDA_MCP_CONFIG must contain an IDA MCP command/args or local url registration; see docs/ida-provider.md.", parsed.error));
			} catch (cause) {
				return err(idaConfigurationError(`Cannot read IDA MCP registration ${path}; provide a readable JSON configuration.`, cause));
			}
		};
		idaConfigurationError = (constraint, cause) => new ConfigurationError(constraint, {
			...cause === undefined ? {} : { cause },
			settings: [{
				setting: "REA_IDA_MCP_CONFIG",
				constraint
			}]
		});
	})))();
}

//#endregion
export { ghidraInstallationDiagnostics, ghidraJavaEnvironment, idaConfigurationError, idaProtocol, init_GhidraInstallation, init_GhidraInstallationPolicy, init_GhidraJavaProperties, init_IdaConfiguration, init_LinuxPrivateDisplayDiagnostic, init_LinuxPrivateDisplayProbe, inspectGhidraInstallation, parseGhidraJavaProperties, parseLinuxPrivateDisplayDiagnostic, readIdaConfiguration, selectLinuxPrivateDisplayStrategy, unverifiedGhidraBuildLimitation };