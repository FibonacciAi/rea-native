import { constants } from "node:fs";
import { access, realpath, stat } from "node:fs/promises";
import { delimiter, isAbsolute, join, resolve } from "node:path";
import { inspectWindowsNativeReadiness } from "../process/WindowsAuthority.js";
import { systemWindowsNativeAuthority } from "../windows/WindowsNativeLoader.js";
import { AnalysisCapabilityUnavailableError } from "../domain/analysisErrorCore.js";
import { ZipArtifactReader } from "../artifacts/ZipArtifactReader.js";
import { execFileOutput, execFileOutputFailure, } from "../process/ExecFileOutput.js";
import { JADX_JAR_CONFIGURATION_REMEDIATION, JADX_JAVA_PROBE_REMEDIATION, JADX_JAVA_RUNTIME_REMEDIATION, JADX_JVM_OPTIONS_REMEDIATION, JADX_UNSUPPORTED_HOST_REMEDIATION, JADX_WINDOWS_NATIVE_REMEDIATION, } from "./JadxRelease.js";
const JAVA_MODULE_LISTING_TIMEOUT_MS = 10_000;
const JAVA_MODULE_LISTING_MAX_OUTPUT_BYTES = 1024 * 1024;
// Bound ZIP metadata allocation during discovery. The audited 0.7.1 JAR's
// central directory occupies 2,294,350 bytes; class bodies are not read here.
const JAR_METADATA_READ_MAX_BYTES = 8 * 1024 * 1024;
/** Runtime mirror of JadxFailureKind for validating the loose diagnostics tag. */
export const JADX_FAILURE_KINDS = [
    "windows_native_artifact",
    "windows_native_runtime",
    "java_runtime",
    "java_home",
    "jvm_options",
    "jar",
    "java_probe",
    "unsupported_host",
];
/**
 * Project the boundary-owned remediation and classification for a failure
 * kind. A null kind (missing or corrupt tag) keeps JAR guidance, matching
 * the previous fallthrough for unclassified failures.
 */
export const projectJadxFailureOutcome = (kind, configured) => {
    const drift = configured ? "config_drift" : "missing_analysis_engine";
    switch (kind) {
        case "windows_native_artifact":
            return {
                remediation: JADX_WINDOWS_NATIVE_REMEDIATION,
                classification: "missing_dependency",
            };
        case "windows_native_runtime":
            return {
                remediation: JADX_WINDOWS_NATIVE_REMEDIATION,
                classification: "runtime_failure",
            };
        case "java_runtime":
            return {
                remediation: JADX_JAVA_RUNTIME_REMEDIATION,
                classification: "missing_dependency",
            };
        case "java_home":
            return {
                remediation: JADX_JAVA_RUNTIME_REMEDIATION,
                classification: drift,
            };
        case "jvm_options":
            return {
                remediation: JADX_JVM_OPTIONS_REMEDIATION,
                classification: drift,
            };
        case "jar":
            return {
                remediation: JADX_JAR_CONFIGURATION_REMEDIATION,
                classification: drift,
            };
        case "java_probe":
            return {
                remediation: JADX_JAVA_PROBE_REMEDIATION,
                classification: drift,
            };
        case "unsupported_host":
            return {
                remediation: JADX_UNSUPPORTED_HOST_REMEDIATION,
                classification: "unsupported_host",
            };
        case null:
            return {
                remediation: JADX_JAR_CONFIGURATION_REMEDIATION,
                classification: drift,
            };
    }
};
class JadxConfigurationFailure extends Error {
    code;
    diagnostics;
    kind;
    constructor(code, message, diagnostics, kind, options) {
        super(message, options);
        this.code = code;
        this.diagnostics = diagnostics;
        this.kind = kind;
    }
}
/** Inspect the same JAR and Java prerequisites that gate actual execution. */
export const inspectJadxAvailability = async (environment, signal) => {
    try {
        const configuration = await readJadxConfigurationInputs(environment, signal);
        await validateJadxConfigurationContents(configuration, environment, signal);
        return {
            status: "available",
            code: null,
            reason: null,
            diagnostics: {
                configured: true,
                java_executable: configuration.java,
                jdk_compiler: true,
                jar_path: configuration.jar,
            },
        };
    }
    catch (cause) {
        if (signal?.aborted === true)
            throw cause;
        if (cause instanceof JadxConfigurationFailure)
            return {
                status: "unavailable",
                code: cause.code,
                reason: cause.message,
                diagnostics: { ...cause.diagnostics, failure_kind: cause.kind },
            };
        throw cause;
    }
};
/** Resolve caller-selected paths and JVM options without probing their contents. */
export const resolveJadxConfigurationInputs = async (environment, operation, signal) => {
    try {
        return await readJadxConfigurationInputs(environment, signal);
    }
    catch (cause) {
        if (signal?.aborted === true)
            throw cause;
        if (!(cause instanceof JadxConfigurationFailure))
            throw cause;
        throw projectConfigurationFailure(operation, cause);
    }
};
/** Probe Java and archive prerequisites before starting a new engine session. */
export const validateJadxConfiguration = async (configuration, environment, operation, signal) => {
    try {
        await validateJadxConfigurationContents(configuration, environment, signal);
    }
    catch (cause) {
        if (signal?.aborted === true)
            throw cause;
        if (!(cause instanceof JadxConfigurationFailure))
            throw cause;
        throw projectConfigurationFailure(operation, cause);
    }
};
const readJadxConfigurationInputs = async (environment, signal) => {
    signal?.throwIfAborted();
    requireSupportedHost();
    const jar = await resolveJar(environment);
    const java = await resolveJava(environment, signal);
    await requireJavaHomeExecutable(environment.JAVA_HOME, java);
    signal?.throwIfAborted();
    return { jar, java, jvmArguments: resolveJvmArguments(environment) };
};
const validateJadxConfigurationContents = async (configuration, environment, signal) => {
    signal?.throwIfAborted();
    await inspectJavaRuntime(configuration.java, environment, signal);
    await requireEngineArchive(configuration.jar, signal);
};
const projectConfigurationFailure = (operation, cause) => {
    const output = cause.diagnostics;
    return new AnalysisCapabilityUnavailableError("jadx", operation, cause.message, {
        cause,
        userMessage: cause.message,
        ...(typeof output.stdout === "string" && typeof output.stderr === "string"
            ? {
                capturedOutput: {
                    stdout: output.stdout,
                    stderr: output.stderr,
                    truncated: output.output_truncated === true,
                },
            }
            : {}),
    });
};
const requireEngineArchive = async (jar, signal) => {
    // These classes are consumed directly by ReaJadxBridge.java. This checks the
    // classpath inventory without loading engine code or starting a JADX session.
    const missing = new Set([
        "com/atxx/jhmcp/JadxSession.class",
        "com/atxx/jhmcp/SessionHolder.class",
        "jadx/api/JadxDecompiler.class",
        "com/google/gson/Gson.class",
        "io/modelcontextprotocol/kotlin/sdk/server/Server.class",
    ]);
    const reader = new ZipArtifactReader(jar, "zip", JAR_METADATA_READ_MAX_BYTES);
    try {
        for await (const entry of reader.entries(signal)) {
            if (entry.kind === "file" && !entry.encrypted)
                missing.delete(entry.path);
            if (missing.size === 0)
                return;
        }
    }
    catch (cause) {
        if (signal?.aborted === true)
            throw cause;
        const reason = cause instanceof Error ? cause.message : String(cause);
        throw configurationFailure("version_unresolved", `Cannot inspect REA_JADX_MCP_JAR ${jar} as a Java archive: ${reason}. ${JADX_JAR_CONFIGURATION_REMEDIATION}`, {
            jar_path: jar,
            phase: "jar-inspection",
            archive_error: reason,
            maximum_metadata_read_bytes: JAR_METADATA_READ_MAX_BYTES,
        }, "jar", cause);
    }
    finally {
        await reader.close();
    }
    throw configurationFailure("unsupported_version", `REA_JADX_MCP_JAR ${jar} does not contain the required metadata bridge classes: ${[...missing].join(", ")}. ${JADX_JAR_CONFIGURATION_REMEDIATION}`, { jar_path: jar, phase: "jar-inspection", missing_classes: [...missing] }, "jar");
};
const requireSupportedHost = () => {
    if (process.platform === "linux" || process.platform === "darwin")
        return;
    if (process.platform === "win32" && process.arch === "x64") {
        const loaded = systemWindowsNativeAuthority();
        if (loaded.available) {
            if (loaded.authority.inspection.protocolStdin === true)
                return;
            throw configurationFailure("runtime_missing", "The bundled Windows native artifact lacks owned protocol stdin; use a matching current Windows x64 REA package.", {
                platform: process.platform,
                architecture: process.arch,
                phase: "process-ownership",
                owned_protocol_stdin: false,
            }, "windows_native_artifact");
        }
        const readiness = inspectWindowsNativeReadiness(process.platform, loaded);
        throw configurationFailure(readiness.available ? "runtime_unavailable" : readiness.code, readiness.available
            ? "Windows native readiness disagreed with the native loader result."
            : readiness.reason, {
            platform: process.platform,
            architecture: process.arch,
            phase: "process-ownership",
            owned_protocol_stdin: false,
            ...(readiness.available
                ? {}
                : {
                    failure_stage: readiness.failureStage,
                    remediation: readiness.remediation,
                }),
        }, readiness.available
            ? "windows_native_runtime"
            : readiness.code === "unsupported_host"
                ? "unsupported_host"
                : readiness.code === "runtime_missing"
                    ? "windows_native_artifact"
                    : "windows_native_runtime");
    }
    throw configurationFailure("unsupported_host", `Android JADX subprocess ownership is unsupported on ${process.platform}/${process.arch}; use Linux, macOS, or Windows x64 with its bundled native controls.`, { platform: process.platform }, "unsupported_host");
};
const resolveJar = async (environment) => {
    const jar = environment.REA_JADX_MCP_JAR;
    if (jar === undefined || !isAbsolute(jar))
        throw configurationFailure("not_configured", JADX_JAR_CONFIGURATION_REMEDIATION, { jar_configured: false }, "jar");
    try {
        await access(jar, constants.R_OK);
        if (!(await stat(jar)).isFile())
            throw configurationFailure("executable_missing", `REA_JADX_MCP_JAR is not a regular file: ${jar}`, { jar_path: jar }, "jar");
        return await realpath(jar);
    }
    catch (cause) {
        if (cause instanceof JadxConfigurationFailure)
            throw cause;
        throw configurationFailure("executable_missing", `Cannot read REA_JADX_MCP_JAR ${jar}: ${cause instanceof Error ? cause.message : String(cause)}`, { jar_path: jar }, "jar", cause);
    }
};
const resolveJava = async (environment, signal) => {
    const executable = process.platform === "win32" ? "java.exe" : "java";
    if (environment.JAVA_HOME === undefined) {
        if (process.platform !== "win32")
            return executable;
        const path = Object.entries(environment).find(([key]) => key.toLowerCase() === "path")?.[1] ?? "";
        for (const directory of [process.cwd(), ...path.split(delimiter)]) {
            signal?.throwIfAborted();
            // Windows PATH commonly quotes individual entries containing spaces.
            const selected = directory.startsWith('"') && directory.endsWith('"')
                ? directory.slice(1, -1)
                : directory;
            const candidate = resolve(selected, executable);
            try {
                await access(candidate, constants.R_OK | constants.X_OK);
                if ((await stat(candidate)).isFile())
                    return await realpath(candidate);
            }
            catch (cause) {
                if (typeof cause === "object" &&
                    cause !== null &&
                    "code" in cause &&
                    (cause.code === "ENOENT" || cause.code === "ENOTDIR"))
                    continue;
                throw configurationFailure("runtime_missing", `Cannot inspect selected Java executable ${candidate}: ${errorText(cause)}`, { java_executable: candidate }, "java_runtime", cause);
            }
        }
        throw configurationFailure("runtime_missing", "Cannot find java.exe on the selected Windows PATH. Select a full JDK with JAVA_HOME or PATH, then verify it with java --list-modules. REA does not install Java.", { java_executable: executable }, "java_runtime");
    }
    if (isAbsolute(environment.JAVA_HOME))
        return join(environment.JAVA_HOME, "bin", executable);
    throw configurationFailure("open_options_invalid", "JAVA_HOME must select an existing JDK by absolute path; omit it to use java on PATH.", { java_home: environment.JAVA_HOME }, "java_home");
};
const requireJavaHomeExecutable = async (javaHome, java) => {
    if (javaHome === undefined)
        return;
    try {
        await access(java, constants.R_OK | constants.X_OK);
        if ((await stat(java)).isFile())
            return;
        throw configurationFailure("runtime_missing", `JAVA_HOME java is not a regular file: ${java}`, { java_executable: java }, "java_runtime");
    }
    catch (cause) {
        if (cause instanceof JadxConfigurationFailure)
            throw cause;
        throw configurationFailure("runtime_missing", `Cannot execute JAVA_HOME java ${java}: ${cause instanceof Error ? cause.message : String(cause)}`, { java_executable: java }, "java_runtime", cause);
    }
};
const resolveJvmArguments = (environment) => {
    const result = [];
    for (const [name, prefix, suffix] of [
        ["REA_JADX_HEAP_MIB", "-Xmx", "m"],
        ["REA_JADX_ACTIVE_PROCESSOR_COUNT", "-XX:ActiveProcessorCount=", ""],
    ]) {
        const value = environment[name];
        if (value === undefined)
            continue;
        if (!/^[1-9]\d*$/u.test(value) || !Number.isSafeInteger(Number(value)))
            throw configurationFailure("open_options_invalid", `${name} must be a positive safe integer; received ${value}.`, { setting: name, value }, "jvm_options");
        if (name === "REA_JADX_ACTIVE_PROCESSOR_COUNT" &&
            Number(value) > 2_147_483_647)
            throw configurationFailure("open_options_invalid", `${name} exceeds the JVM's signed 32-bit processor-count range.`, { setting: name, value }, "jvm_options");
        result.push(`${prefix}${value}${suffix}`);
    }
    return result;
};
const inspectJavaRuntime = async (java, environment, signal) => {
    let stdout;
    let stderr;
    try {
        ({ stdout, stderr } = await execFileOutput(java, ["--list-modules"], {
            env: { ...environment },
            timeout: JAVA_MODULE_LISTING_TIMEOUT_MS,
            maxBuffer: JAVA_MODULE_LISTING_MAX_OUTPUT_BYTES,
            ...(signal === undefined ? {} : { signal }),
        }));
    }
    catch (cause) {
        if (signal?.aborted === true)
            throw cause;
        const output = execFileOutputFailure(cause);
        if (output === undefined)
            throw cause;
        const diagnostics = {
            java_executable: java,
            phase: "module-inspection",
            exit_code: typeof output.code === "number" ? output.code : null,
            process_error_code: typeof output.code === "string" ? output.code : null,
            signal: output.signal,
            killed: output.killed,
            stdout: output.stdout,
            stderr: output.stderr,
            output_truncated: output.outputTruncated,
        };
        if (output.outputTruncated)
            throw configurationFailure("version_unresolved", `The selected Java launcher ${java} exceeded the ${JAVA_MODULE_LISTING_MAX_OUTPUT_BYTES / (1024 * 1024)} MiB output budget while listing modules. REA retained partial output but could not establish compiler or version availability. Inspect the selected launcher for verbose or unbounded output; ` +
                "java --list-modules should return a concise module listing.", {
                ...diagnostics,
                failure: "output_limit",
                output_limit_bytes: JAVA_MODULE_LISTING_MAX_OUTPUT_BYTES,
            }, "java_probe", cause);
        if (output.killed)
            throw configurationFailure("version_unresolved", `The selected Java launcher ${java} was terminated or did not finish the module-listing probe within ${JAVA_MODULE_LISTING_TIMEOUT_MS / 1000} seconds. Inspect the launcher and its startup responsiveness, then verify it returns compiler and version modules with java --list-modules.`, {
                ...diagnostics,
                failure: "probe_terminated",
                deadline_ms: JAVA_MODULE_LISTING_TIMEOUT_MS,
            }, "java_probe", cause);
        throw configurationFailure("runtime_missing", `Cannot inspect selected Java runtime ${java}: ${output.stderr.trim() || errorText(cause)}. Select a full JDK including jdk.compiler via JAVA_HOME or PATH; verify it with java --list-modules.`, diagnostics, "java_runtime", cause);
    }
    const compiler = /^jdk\.compiler(?:@|$)/mu.test(stdout);
    if (!compiler)
        throw configurationFailure("runtime_missing", `Selected Java runtime ${java} does not provide jdk.compiler. Select a full JDK including jdk.compiler via JAVA_HOME or PATH; verify it with java --list-modules. A JRE cannot compile REA's source bridge.`, {
            java_executable: java,
            phase: "module-inspection",
            jdk_compiler: false,
            stdout,
            stderr,
            output_truncated: false,
        }, "java_runtime");
    const major = /^java\.base@(\d+)(?:[.+_-]|$)/mu.exec(stdout)?.[1];
    if (major === undefined)
        throw configurationFailure("version_unresolved", `The selected Java launcher ${java} did not report a parseable java.base version in its module listing. Inspect the launcher output and verify it with java --list-modules.`, {
            java_executable: java,
            phase: "module-inspection",
            jdk_compiler: true,
            java_major: null,
            stdout,
            stderr,
            output_truncated: false,
        }, "java_probe");
    if (Number(major) < 17)
        throw configurationFailure("unsupported_version", `Selected Java runtime ${java} must be JDK 17 or newer and include jdk.compiler; verify it with java --list-modules.`, {
            java_executable: java,
            phase: "module-inspection",
            jdk_compiler: true,
            java_major: major ?? null,
            stdout,
            stderr,
            output_truncated: false,
        }, "java_runtime");
};
const configurationFailure = (code, message, diagnostics, kind, cause) => new JadxConfigurationFailure(code, message, diagnostics, kind, cause === undefined ? undefined : { cause });
const errorText = (cause) => cause instanceof Error ? cause.message : String(cause);
