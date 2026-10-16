import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { a as init_ProviderProcess, f as init_snapshotEnvironment, i as ProviderProcessSupervisor, n as init_ProviderDeadline, o as spawnOwnedProviderProcess, p as snapshotEnvironment, r as waitForAbortableDelay, t as ProviderStartupDeadline } from "./ProviderDeadline-DskQ94YD.js";
import { _ as ok, g as init_result, h as err } from "./analysisErrorCore-DXRTvF_m.js";
import { _ as init_DarwinProcessRunTokenReader, h as DarwinProcessOwnershipInspectionError, r as init_ProcessOwnership, t as cleanupOwnedProcessGroup, v as boundedUtf8Text, y as init_boundedUtf8Text } from "./ProcessOwnership-Bl_3ejLe.js";
import { Aa as machoCpuSubtypeBase, ka as init_machoCpuIdentity } from "./toolOutputSchemaGroups-ColvNZ1r.js";
import { createReadStream } from "node:fs";
import { z } from "zod";
import { createHash, randomUUID } from "node:crypto";
import { realpath } from "node:fs/promises";

//#region dist/process/OwnedCommand.js
var OwnedCommandFailure, ownedCommandResources, runOwnedCommand, collectOwnedCommand;
function init_OwnedCommand() {
	return (init_OwnedCommand = __esmMin((() => {
		init_ProviderProcess();
		init_ProcessOwnership();
		init_ProviderDeadline();
		OwnedCommandFailure = class extends Error {
			reason;
			snapshot;
			cleanupFailure;
			resources;
			cleanupOwner;
			cleanupResult;
			collectionFailure;
			constructor(reason, message, snapshot = null, cleanupFailure = null, options, resources = [], cleanupOwner) {
				super(message, options);
				this.reason = reason;
				this.snapshot = snapshot;
				this.cleanupFailure = cleanupFailure;
				this.resources = resources;
				this.cleanupOwner = cleanupOwner;
				this.cleanupResult = options?.cleanupResult;
				this.collectionFailure = options?.collectionFailure ?? false;
			}
		};
		ownedCommandResources = (ownership, directory) => [
			ownership.runId,
			...directory === undefined ? [] : [directory],
			`pid:${ownership.leaderPid}`,
			`process-group:${ownership.processGroupId}`
		];
		runOwnedCommand = async (spawn, limits, options = {}) => {
			const callerSignal = options.signal ?? spawn.signal;
			if (callerSignal?.aborted) throw new OwnedCommandFailure("cancelled", "Command cancelled before launch.");
			const deadline = new ProviderStartupDeadline(limits.timeoutMs, callerSignal);
			try {
				return await collectOwnedCommand(spawn, limits, options.launcher ?? spawnOwnedProviderProcess, deadline, callerSignal, options.retainCleanup);
			} finally {
				deadline.dispose();
			}
		};
		collectOwnedCommand = async (spawn, limits, launcher, deadline, callerSignal, retainCleanup) => {
			const signal = deadline.signal;
			let launched;
			try {
				launched = await launcher({
					...spawn,
					signal
				});
			} catch (cause) {
				const interruption = deadline.interruption;
				if (interruption !== undefined) throw new OwnedCommandFailure(interruption, interruption === "cancelled" ? "Command cancelled during ownership preparation." : "Command deadline elapsed during ownership preparation.", null, null, { cause });
				throw cause;
			}
			let exceeded = false;
			let processFailure;
			const supervisor = new ProviderProcessSupervisor({
				...launched,
				ownsProcessLifetime: true,
				cleanup: launched.cleanup ?? (() => cleanupOwnedProcessGroup(launched.ownership))
			}, {
				maxDiagnosticBytes: limits.diagnosticBytes,
				onDiagnostic: (event) => {
					if (event.type === "output" && event.truncated === true) exceeded = true;
					if (event.type === "error") processFailure = event.message;
				}
			});
			let failure;
			try {
				while (!await supervisor.waitForOutputClose(10)) {
					const interruption = deadline.interruption;
					if (interruption !== undefined) throw new OwnedCommandFailure(interruption, interruption === "cancelled" ? "Command cancelled." : "Command deadline elapsed.");
					if (exceeded) throw new OwnedCommandFailure("output-limit", "Command diagnostic output exceeded its complete-output budget.");
					if (processFailure !== undefined) throw new OwnedCommandFailure("process", processFailure, null, null, { collectionFailure: true });
					await waitForAbortableDelay(25, signal);
				}
				const snapshot = supervisor.snapshot();
				const interruption = deadline.interruption;
				if (interruption !== undefined) throw new OwnedCommandFailure(interruption, interruption === "cancelled" ? "Command cancelled." : "Command deadline elapsed.", snapshot);
				if (exceeded) throw new OwnedCommandFailure("output-limit", "Command diagnostic output exceeded its complete-output budget.", snapshot);
				const acceptedNonzeroExit = limits.acceptNonZeroExit === true && snapshot.exitCode !== null && snapshot.exitCode !== undefined && snapshot.exitCode !== 0 && snapshot.signal === null;
				if (processFailure !== undefined || (snapshot.exitCode !== 0 || snapshot.signal !== null) && !acceptedNonzeroExit) throw new OwnedCommandFailure("process", processFailure ?? "Command failed; inspect its exit status and diagnostics.", snapshot, null, { collectionFailure: processFailure !== undefined });
			} catch (cause) {
				failure = cause instanceof OwnedCommandFailure ? cause : new OwnedCommandFailure("process", "Command collection failed.", null, null, { cause });
			}
			const stopped = await supervisor.stop();
			const snapshot = supervisor.snapshot();
			if (stopped.status === "incomplete" && retainCleanup !== undefined) retainCleanup(supervisor, stopped);
			else if (stopped.status === "incomplete") throw new OwnedCommandFailure(failure?.reason ?? "process", failure?.message ?? "Command cleanup failed.", snapshot, stopped.reason, {
				...failure === undefined ? {} : { cause: failure },
				...stopped.cleanupResult === undefined ? {} : { cleanupResult: stopped.cleanupResult },
				...failure?.collectionFailure === true ? { collectionFailure: true } : {}
			}, ownedCommandResources(launched.ownership, spawn.cwd), supervisor);
			if (failure !== undefined) throw new OwnedCommandFailure(failure.reason, failure.message, snapshot, failure.cleanupFailure, {
				cause: failure,
				...failure.cleanupResult === undefined ? {} : { cleanupResult: failure.cleanupResult },
				...failure.collectionFailure ? { collectionFailure: true } : {}
			}, failure.resources);
			if (callerSignal?.aborted) throw new OwnedCommandFailure("cancelled", "Command cancelled.", snapshot);
			return snapshot;
		};
	})))();
}

//#endregion
//#region dist/native/CommandRunner.js
var NATIVE_COMMAND_TIMEOUT_MS, NATIVE_COMMAND_OUTPUT_BUDGET_BYTES, NATIVE_FAILURE_DIAGNOSTIC_BYTES, NativeCommandFailure, XcrunCommandRunner, commandProcessResources, commandCleanupFailure, ALLOWED_TOOLS, resolveXcrunTool, failureCapture, captureProcess, processFailureReason, processCaptureFromSnapshot, hashFile;
function init_CommandRunner() {
	return (init_CommandRunner = __esmMin((() => {
		init_snapshotEnvironment();
		init_result();
		init_DarwinProcessRunTokenReader();
		init_OwnedCommand();
		init_boundedUtf8Text();
		NATIVE_COMMAND_TIMEOUT_MS = 6e4;
		NATIVE_COMMAND_OUTPUT_BUDGET_BYTES = 64 * 1024 * 1024;
		NATIVE_FAILURE_DIAGNOSTIC_BYTES = 64 * 1024;
		NativeCommandFailure = class extends Error {
			tool;
			reason;
			exitCode;
			capture;
			cleanupFailure;
			cleanupResources;
			cleanupOwner;
			cleanupFailures;
			detail;
			constructor(tool, reason, exitCode = null, options, capture = null, cleanupFailure = null, cleanupResources = []) {
				super(`Native command ${tool} failed: ${reason}`, options);
				this.tool = tool;
				this.reason = reason;
				this.exitCode = exitCode;
				this.capture = capture;
				this.cleanupFailure = cleanupFailure;
				this.cleanupResources = cleanupResources;
				this.cleanupOwner = options?.cleanupOwner;
				this.cleanupFailures = options?.cleanupFailures ?? [];
				this.detail = options?.detail ?? null;
			}
		};
		XcrunCommandRunner = class {
			resolveTool;
			launcher;
			environment;
			#pendingCleanup = new Set();
			#cleanupAttempt;
			constructor(environment, resolveTool = (tool, signal) => resolveXcrunTool(tool, this.environment, signal, this.launcher), launcher) {
				this.resolveTool = resolveTool;
				this.launcher = launcher;
				this.environment = snapshotEnvironment(environment);
			}
			run(tool, arguments_, options) {
				if (!ALLOWED_TOOLS.has(tool)) return Promise.resolve(err(new NativeCommandFailure(tool, "unavailable")));
				return this.#runAfterCleanup(tool, arguments_, options);
			}
			/** Retry every retained owner; a failed retry prevents another command launch. */
			retryCleanup() {
				if (this.#pendingCleanup.size === 0) return Promise.resolve([]);
				if (this.#cleanupAttempt !== undefined) return this.#cleanupAttempt;
				this.#cleanupAttempt = this.#retryCleanup().finally(() => {
					this.#cleanupAttempt = undefined;
				});
				return this.#cleanupAttempt;
			}
			async #runAfterCleanup(tool, arguments_, options) {
				const pendingFailures = await this.retryCleanup();
				if (pendingFailures.length > 0) return err(commandCleanupFailure(tool, pendingFailures));
				const resolved = await this.resolveTool(tool, options.signal, this.launcher);
				if (!resolved.ok) {
					if (resolved.error.cleanupOwner !== undefined) this.#pendingCleanup.add(resolved.error.cleanupOwner);
					return resolved;
				}
				const captured = await captureProcess(resolved.value.path, arguments_, tool, options, this.environment, this.launcher);
				if (!captured.ok && captured.error.cleanupOwner !== undefined) this.#pendingCleanup.add(captured.error.cleanupOwner);
				return captured.ok ? ok({
					...captured.value,
					tool,
					executable: resolved.value.path,
					executableSha256: resolved.value.sha256,
					toolVersion: null,
					versionReason: "Tool exposes no uniform stable version flag; executable SHA-256 is a prelaunch file sample and does not prove atomic OS image binding.",
					arguments: [...arguments_]
				}) : captured;
			}
			async #retryCleanup() {
				const failures = [];
				for (const owner of this.#pendingCleanup) {
					let reason;
					try {
						const stopped = await owner.stop();
						if (stopped.status !== "incomplete") {
							this.#pendingCleanup.delete(owner);
							continue;
						}
						reason = stopped.reason || "native command cleanup remains unverified";
					} catch (cause) {
						reason = cause instanceof Error ? cause.message || cause.name : String(cause) || "native command cleanup failed unexpectedly";
					}
					failures.push({
						owner,
						reason: reason ?? "native command cleanup remains unverified",
						resources: commandProcessResources(owner)
					});
				}
				return failures;
			}
		};
		commandProcessResources = (owner) => {
			const ownership = owner.launch.ownership;
			return ownership === undefined ? ["native-command-process"] : [
				ownership.runId,
				`pid:${String(ownership.leaderPid)}`,
				`process-group:${String(ownership.processGroupId)}`
			];
		};
		commandCleanupFailure = (tool, failures) => new NativeCommandFailure(tool, "io", null, {
			cleanupFailures: failures,
			cause: new AggregateError(failures.map(({ reason, resources }) => new Error(`${reason} (${resources.join(", ")})`)), "Previously owned native command cleanup remains incomplete")
		}, null, failures.map(({ reason, resources }) => `${resources.join(", ")}: ${reason}`).join("; "), [...new Set(failures.flatMap(({ resources }) => resources))]);
		ALLOWED_TOOLS = new Set([
			"codesign",
			"dyld_info",
			"dwarfdump",
			"file",
			"lipo",
			"nm",
			"otool",
			"plutil",
			"strings",
			"swift-demangle",
			"vtool"
		]);
		resolveXcrunTool = async (tool, environment, signal, launcher) => {
			const found = await captureProcess("/usr/bin/xcrun", ["--find", tool], "xcrun", signal === undefined ? {} : { signal }, environment, launcher);
			if (!found.ok) {
				return err(new NativeCommandFailure(tool, found.error.reason === "nonzero-exit" || found.error.reason === "unavailable" ? "unavailable" : found.error.reason, found.error.exitCode, {
					cause: found.error,
					...found.error.cleanupOwner === undefined ? {} : { cleanupOwner: found.error.cleanupOwner },
					...found.error.cleanupFailures.length === 0 ? {} : { cleanupFailures: found.error.cleanupFailures },
					...found.error.detail === null ? {} : { detail: found.error.detail }
				}, found.error.capture, found.error.cleanupFailure, found.error.cleanupResources));
			}
			if (found.value.exitCode !== 0) return err(new NativeCommandFailure(tool, "unavailable", found.value.exitCode, undefined, failureCapture(found.value, false)));
			const candidate = found.value.stdout.trim();
			if (!candidate.startsWith("/")) return err(new NativeCommandFailure(tool, "unavailable", found.value.exitCode, undefined, failureCapture(found.value, false)));
			try {
				const path = await realpath(candidate);
				return ok({
					path,
					sha256: await hashFile(path, signal)
				});
			} catch (cause) {
				const capture = failureCapture(found.value, false);
				if (signal?.aborted === true) return err(new NativeCommandFailure(tool, "cancelled", capture.exitCode, { cause }, capture));
				return err(new NativeCommandFailure(tool, "io", capture.exitCode, { cause }, capture));
			}
		};
		failureCapture = (capture, truncated) => {
			const stdout = boundedUtf8Text(capture.stdout, NATIVE_FAILURE_DIAGNOSTIC_BYTES);
			const stderr = boundedUtf8Text(capture.stderr, NATIVE_FAILURE_DIAGNOSTIC_BYTES);
			return {
				stdout: stdout.text,
				stderr: stderr.text,
				stdoutBytes: capture.stdoutBytes,
				stderrBytes: capture.stderrBytes,
				exitCode: capture.exitCode,
				signal: capture.signal,
				truncated: truncated || stdout.truncated || stderr.truncated
			};
		};
		captureProcess = async (executable, arguments_, tool, options, environment, launcher) => {
			const runId = `rea-native-command-${randomUUID()}`;
			try {
				const snapshot = await runOwnedCommand({
					command: executable,
					arguments: [...arguments_],
					runId,
					env: {
						LC_ALL: "C",
						LANG: "C"
					},
					hostEnvironment: environment,
					...options.signal === undefined ? {} : { signal: options.signal }
				}, {
					timeoutMs: NATIVE_COMMAND_TIMEOUT_MS,
					diagnosticBytes: NATIVE_COMMAND_OUTPUT_BUDGET_BYTES,
					acceptNonZeroExit: options.acceptNonZero === true
				}, launcher === undefined ? {} : { launcher });
				return ok(processCaptureFromSnapshot(snapshot));
			} catch (cause) {
				if (cause instanceof OwnedCommandFailure) {
					const capture = cause.snapshot === null ? null : failureCapture(processCaptureFromSnapshot(cause.snapshot), cause.snapshot.diagnosticTruncated === true);
					return err(new NativeCommandFailure(tool, cause.reason === "process" ? processFailureReason(capture) : cause.reason, capture?.exitCode ?? null, {
						cause,
						...cause.cleanupOwner === undefined ? {} : { cleanupOwner: cause.cleanupOwner }
					}, capture, cause.cleanupFailure, cause.resources));
				}
				return err(new NativeCommandFailure(tool, "io", null, {
					cause,
					...cause instanceof DarwinProcessOwnershipInspectionError ? { detail: cause.message } : {}
				}));
			}
		};
		processFailureReason = (capture) => capture !== null && (capture.signal !== null || capture.exitCode !== null && capture.exitCode !== 0) ? "nonzero-exit" : "io";
		processCaptureFromSnapshot = (snapshot) => ({
			stdout: snapshot.stdout.text,
			stderr: snapshot.stderr.text,
			stdoutBytes: snapshot.stdout.bytes,
			stderrBytes: snapshot.stderr.bytes,
			exitCode: snapshot.exitCode ?? null,
			signal: snapshot.signal ?? null
		});
		hashFile = (path, signal) => new Promise((resolve, reject) => {
			const hash = createHash("sha256");
			const stream = createReadStream(path, signal === undefined ? undefined : { signal });
			stream.on("data", (chunk) => hash.update(chunk));
			stream.once("error", reject);
			stream.once("end", () => resolve(hash.digest("hex")));
		});
	})))();
}

//#endregion
//#region dist/native/parsers/lipo.js
var architectureSchema, parseLipoOutput, integer, CPU_TYPES, CPU_SUBTYPES, cpuTypeCode, cpuSubtypeCode, cpuSubtypeBase, capabilityBits, unsigned32, alignment;
function init_lipo() {
	return (init_lipo = __esmMin((() => {
		init_machoCpuIdentity();
		architectureSchema = z.object({
			name: z.string().min(1),
			cpu_type: z.string().nullable(),
			cpu_subtype: z.string().nullable(),
			cpu_type_code: z.number().int().nonnegative().nullable(),
			cpu_subtype_code: z.number().int().nonnegative().nullable(),
			cpu_subtype_base: z.number().int().nonnegative().nullable(),
			capabilities: z.string().nullable(),
			file_offset: z.number().int().min(0).nullable(),
			size: z.number().int().min(0).nullable(),
			alignment: z.number().int().min(0).nullable()
		});
		parseLipoOutput = (output, operandPath) => {
			if (operandPath !== undefined) {
				const header = `Fat header in: ${operandPath}`;
				if (output.startsWith(header)) {
					if (output.startsWith("\r\n", header.length)) output = output.slice(header.length + 2);
					else if (output.startsWith("\n", header.length)) output = output.slice(header.length + 1);
				}
			}
			const thinArchitecture = /(?:^|\r?\n)Non-fat file:[\s\S]* is architecture: ([^\s]+)\s*$/u.exec(output)?.[1];
			if (thinArchitecture !== undefined) return {
				format: "thin",
				architectures: [architectureSchema.parse({
					name: thinArchitecture,
					cpu_type: null,
					cpu_subtype: null,
					cpu_type_code: null,
					cpu_subtype_code: null,
					cpu_subtype_base: null,
					capabilities: null,
					file_offset: null,
					size: null,
					alignment: null
				})]
			};
			const architectures = [];
			let current;
			const flush = () => {
				if (current === undefined) return;
				const name = current.architecture ?? current["Non-fat file"];
				if (name !== undefined) architectures.push(architectureSchema.parse({
					name: name.includes(" is architecture: ") ? name.split(" is architecture: ").at(-1) ?? name : name,
					cpu_type: current.cputype ?? null,
					cpu_subtype: current.cpusubtype ?? null,
					cpu_type_code: cpuTypeCode(current.cputype),
					cpu_subtype_code: cpuSubtypeCode(current.cpusubtype, current.capabilities),
					cpu_subtype_base: cpuSubtypeBase(current.cpusubtype),
					capabilities: current.capabilities ?? null,
					file_offset: integer(current.offset),
					size: integer(current.size),
					alignment: alignment(current.align)
				}));
				current = undefined;
			};
			for (const rawLine of output.split(/\r?\n/u)) {
				const line = rawLine.trim();
				if (line.startsWith("Non-fat file:")) {
					flush();
					current = { "Non-fat file": line };
					continue;
				}
				if (line.startsWith("architecture ")) {
					flush();
					current = { architecture: line.slice("architecture ".length).trim() };
					continue;
				}
				const match = /^(cputype|cpusubtype|capabilities|offset|size|align)\s+(.+)$/u.exec(line);
				if (match?.[1] !== undefined && match[2] !== undefined) {
					current ??= {};
					current[match[1]] = match[2].trim();
				}
			}
			flush();
			if (architectures.length === 0) throw new TypeError("lipo output contained no architectures");
			return {
				format: "fat",
				architectures
			};
		};
		integer = (value) => {
			if (value === undefined || !/^\d+$/u.test(value)) return null;
			const parsed = Number.parseInt(value, 10);
			return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
		};
		CPU_TYPES = {
			CPU_TYPE_X86: 7,
			CPU_TYPE_X86_64: 16777223,
			CPU_TYPE_ARM: 12,
			CPU_TYPE_ARM64: 16777228,
			CPU_TYPE_ARM64_32: 33554444,
			CPU_TYPE_POWERPC: 18,
			CPU_TYPE_POWERPC64: 16777234
		};
		CPU_SUBTYPES = {
			CPU_SUBTYPE_X86_ALL: 3,
			CPU_SUBTYPE_X86_64_ALL: 3,
			CPU_SUBTYPE_X86_64_H: 8,
			CPU_SUBTYPE_ARM64_ALL: 0,
			CPU_SUBTYPE_ARM64_V8: 1,
			CPU_SUBTYPE_ARM64E: 2,
			CPU_SUBTYPE_ARM64_32_ALL: 0,
			CPU_SUBTYPE_ARM64_32_V8: 1,
			CPU_SUBTYPE_ARM_V7: 9,
			CPU_SUBTYPE_ARM_V7S: 11,
			CPU_SUBTYPE_ARM_V7K: 12,
			CPU_SUBTYPE_POWERPC_ALL: 0,
			CPU_SUBTYPE_POWERPC_970: 100
		};
		cpuTypeCode = (value) => {
			if (value === undefined) return null;
			const numeric = unsigned32(value);
			return numeric ?? CPU_TYPES[value] ?? null;
		};
		cpuSubtypeCode = (value, capabilities) => {
			if (value === undefined) return null;
			const numeric = unsigned32(value);
			if (numeric !== null) return numeric;
			const subtype = CPU_SUBTYPES[value];
			if (subtype === undefined) return null;
			if (value !== "CPU_SUBTYPE_ARM64E") {
				const bits = capabilityBits(capabilities);
				return bits === null ? null : (bits << 24 | subtype) >>> 0;
			}
			const version = /PTR_AUTH_VERSION\s+USERSPACE\s+(\d+)/u.exec(capabilities ?? "")?.[1];
			if (version === undefined) return null;
			const parsedVersion = Number(version);
			if (!Number.isInteger(parsedVersion) || parsedVersion < 0 || parsedVersion > 15) return null;
			return (2147483648 | parsedVersion << 24 | subtype) >>> 0;
		};
		cpuSubtypeBase = (value) => {
			if (value === undefined) return null;
			const subtype = unsigned32(value) ?? CPU_SUBTYPES[value];
			return subtype === undefined ? null : machoCpuSubtypeBase(subtype);
		};
		capabilityBits = (capabilities) => {
			if (capabilities === "CPU_SUBTYPE_LIB64") return 128;
			const bits = /^0x([\da-f]{1,2})$/iu.exec(capabilities ?? "")?.[1];
			return bits === undefined ? null : Number.parseInt(bits, 16);
		};
		unsigned32 = (value) => {
			if (!/^(?:\d+|0x[\da-f]+)$/iu.test(value)) return null;
			const parsed = Number(value);
			return Number.isInteger(parsed) && parsed >= 0 && parsed <= 4294967295 ? parsed >>> 0 : null;
		};
		alignment = (value) => {
			if (value === undefined) return null;
			const exponent = /^2\^(\d+)(?: \((\d+)\))?$/u.exec(value);
			const powerText = exponent?.[1];
			if (powerText !== undefined) {
				const power = Number.parseInt(powerText, 10);
				if (power > 52) return null;
				const alignment = 2 ** power;
				const reported = exponent?.[2];
				return reported === undefined || integer(reported) === alignment ? alignment : null;
			}
			return integer(value);
		};
	})))();
}

//#endregion
export { NativeCommandFailure as a, init_CommandRunner as c, init_OwnedCommand as d, ownedCommandResources as f, NATIVE_COMMAND_TIMEOUT_MS as i, resolveXcrunTool as l, parseLipoOutput as n, XcrunCommandRunner as o, runOwnedCommand as p, NATIVE_COMMAND_OUTPUT_BUDGET_BYTES as r, failureCapture as s, init_lipo as t, OwnedCommandFailure as u };