import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { compareUnicodeCodePoints, init_unicodeCodePointOrder } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCapabilityUnavailableError, init_analysisErrorCore } from "./errorSchemas-CTRmvMl3.js";
import { execFileOutput, execFileOutputFailure, init_ExecFileOutput } from "./ExecFileOutput-BEQs-lDD.js";
import { DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, init_providerStartupTimeout, providerStartupTimeoutSchema } from "./providerStartupTimeout-B2tF2LtZ.js";
import { init_safeJson, safeParseJson } from "./safeJson-DKKACtdy.js";
import { z } from "zod";
import { basename, isAbsolute, join } from "node:path";
import { promisify } from "node:util";
import { mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { rmSync } from "node:fs";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

//#region dist/process/ProcessCommandIdentity.js
var matchesOwnedProcessCommand;
function init_ProcessCommandIdentity() {
	return (init_ProcessCommandIdentity = __esmMin((() => {
		matchesOwnedProcessCommand = (actual, expected, platform = process.platform) => {
			const actualCommand = actual.trim();
			const expectedCommand = expected.trim();
			if (actualCommand === expectedCommand || actualCommand.startsWith(`${expectedCommand} `)) return true;
			if (platform !== "darwin") return false;
			const actualExecutable = actualCommand.split(/\s+/u, 1)[0];
			const expectedExecutable = expectedCommand.split(/\s+/u, 1)[0];
			const normalizedActualExecutable = actualExecutable?.startsWith("(") === true && actualExecutable.endsWith(")") ? actualExecutable.slice(1, -1) : actualExecutable;
			return normalizedActualExecutable !== undefined && expectedExecutable !== undefined && basename(normalizedActualExecutable) === basename(expectedExecutable);
		};
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipIdentity.js
var launcherIdentityFailure;
function init_ProcessOwnershipIdentity() {
	return (init_ProcessOwnershipIdentity = __esmMin((() => {
		init_ProcessCommandIdentity();
		launcherIdentityFailure = (launcher, ownership) => {
			if (launcher.processGroupId !== ownership.processGroupId) return "owned launcher process-group identity did not match";
			if (ownership.expectedParentPid !== undefined && launcher.parentPid !== ownership.expectedParentPid) return "owned launcher parent identity did not match";
			if (ownership.expectedCommand !== undefined && !matchesOwnedProcessCommand(launcher.command, ownership.expectedCommand)) return `owned launcher command identity did not match (observed=${launcher.command}; expected=${ownership.expectedCommand})`;
			return null;
		};
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipProcessTree.js
var liveProcesses, descendantsOf, selectCapturedProcessGroupIds;
function init_ProcessOwnershipProcessTree() {
	return (init_ProcessOwnershipProcessTree = __esmMin((() => {
		liveProcesses = (members) => members.filter(({ state }) => !state.startsWith("Z"));
		descendantsOf = (rootPids, processes) => {
			const childrenByParent = new Map();
			for (const process of processes) {
				const siblings = childrenByParent.get(process.parentPid) ?? [];
				siblings.push(process);
				childrenByParent.set(process.parentPid, siblings);
			}
			const descendants = [];
			const pending = rootPids.flatMap((pid) => childrenByParent.get(pid) ?? []);
			const visited = new Set(rootPids);
			for (const process of pending) {
				if (visited.has(process.pid)) continue;
				visited.add(process.pid);
				descendants.push(process);
				pending.push(...childrenByParent.get(process.pid) ?? []);
			}
			return descendants;
		};
		selectCapturedProcessGroupIds = (rootPid, samples) => {
			const processGroupIds = new Set([rootPid]);
			for (const sample of samples) {
				if (sample.pid === sample.process_group_id) processGroupIds.add(sample.pid);
			}
			return [...processGroupIds];
		};
	})))();
}

//#endregion
//#region dist/process/boundedUtf8Text.js
var boundedUtf8Text;
function init_boundedUtf8Text() {
	return (init_boundedUtf8Text = __esmMin((() => {
		boundedUtf8Text = (value, maximumBytes) => {
			let bytes = 0;
			let end = 0;
			for (const codePoint of value) {
				const codePointBytes = Buffer.byteLength(codePoint, "utf8");
				if (bytes + codePointBytes > maximumBytes) return {
					text: value.slice(0, end),
					truncated: true
				};
				bytes += codePointBytes;
				end += codePoint.length;
			}
			return {
				text: value,
				truncated: false
			};
		};
	})))();
}

//#endregion
//#region dist/process/DarwinProcessRunTokenReader.js
var responseSchema, identityResponseSchema, sourceFiles, SWIFTC_INTERRUPT, resolveSwiftcCompileTimeoutMs, STDERR_EXCERPT_LIMIT, DarwinProcessOwnershipInspectionError, MAX_COMPILER_STDERR_BYTES, compilerOutcome, compilerOutcomeDescription, compilerInspectionError, abortReason, isExpectedAbort$1, waitForCompilation, createDarwinProcessRunTokenReader;
function init_DarwinProcessRunTokenReader() {
	return (init_DarwinProcessRunTokenReader = __esmMin((() => {
		init_providerStartupTimeout();
		init_safeJson();
		init_boundedUtf8Text();
		init_ExecFileOutput();
		responseSchema = z.strictObject({ results: z.array(z.discriminatedUnion("state", [z.strictObject({
			pid: z.number().int().positive(),
			state: z.literal("readable"),
			run_id: z.string().optional(),
			reason: z.null().optional()
		}), z.strictObject({
			pid: z.number().int().positive(),
			state: z.literal("unavailable"),
			run_id: z.union([z.string(), z.null()]).optional(),
			reason: z.string().min(1)
		})])) });
		identityResponseSchema = z.strictObject({ results: z.array(z.discriminatedUnion("state", [z.strictObject({
			pid: z.number().int().positive(),
			state: z.literal("readable"),
			identity: z.string().min(1),
			reason: z.null().optional()
		}), z.strictObject({
			pid: z.number().int().positive(),
			state: z.literal("unavailable"),
			identity: z.null().optional(),
			reason: z.string().min(1)
		})])) });
		sourceFiles = [fileURLToPath(new URL("../../bridge/process/ProcessRunTokenReader.swift", new URL("../process/DarwinProcessRunTokenReader.js", import.meta.url).href)), fileURLToPath(new URL("../../bridge/process/ProcessRunTokenReaderMain.swift", new URL("../process/DarwinProcessRunTokenReader.js", import.meta.url).href))];
		SWIFTC_INTERRUPT = "SIGINT";
		resolveSwiftcCompileTimeoutMs = (options = {}) => {
			if (options.compileTimeoutMs !== undefined) return options.compileTimeoutMs;
			const raw = (options.environment ?? process.env).REA_SWIFTC_COMPILE_TIMEOUT_MS;
			if (raw === undefined) return DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS;
			const parsed = providerStartupTimeoutSchema.safeParse(raw);
			return parsed.success ? parsed.data : DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS;
		};
		STDERR_EXCERPT_LIMIT = 512;
		DarwinProcessOwnershipInspectionError = class extends Error {
			constructor(message, options) {
				const { compilerOutcome, ...errorOptions } = options ?? {};
				super(message, errorOptions);
				this.name = "DarwinProcessOwnershipInspectionError";
				this.compilerOutcome = compilerOutcome;
			}
			compilerOutcome;
		};
		MAX_COMPILER_STDERR_BYTES = 8 * 1024;
		compilerOutcome = (cause, timeoutMs) => {
			const failure = execFileOutputFailure(cause);
			if (failure === undefined) return undefined;
			const stderr = boundedUtf8Text(failure.stderr, MAX_COMPILER_STDERR_BYTES);
			const outcome = failure.code === "ETIMEDOUT" ? "timed_out" : typeof failure.code === "number" ? "exited" : failure.signal !== null ? "signaled" : failure.code === "ENOENT" ? "spawn_failed" : "failed";
			return {
				outcome,
				code: failure.code,
				signal: failure.signal,
				stderr: stderr.text,
				stderrBytes: Buffer.byteLength(failure.stderr, "utf8"),
				stderrTruncated: stderr.truncated,
				outputTruncated: failure.outputTruncated,
				killed: failure.killed,
				...outcome === "timed_out" ? { timeoutMs } : {}
			};
		};
		compilerOutcomeDescription = (outcome, fallbackCode) => {
			if (outcome === undefined) return `compiler result: ${String(fallbackCode)}`;
			if (outcome.outcome === "exited") return `compiler result: exit code ${String(outcome.code)}`;
			if (outcome.outcome === "timed_out") return `compiler result: timed out after ${String(outcome.timeoutMs)} ms`;
			if (outcome.outcome === "signaled") return `compiler result: stopped by signal ${outcome.signal ?? "an unknown signal"}`;
			return `compiler result: ${String(outcome.code)}`;
		};
		compilerInspectionError = (cause, timeoutMs, compiler) => {
			const outcome = compilerOutcome(cause, timeoutMs);
			const code = outcome?.code ?? "unknown";
			const description = compilerOutcomeDescription(outcome, code);
			const launcher = compiler.kind === "xcrun" ? "xcrun" : "the selected Swift compiler (REA_DARWIN_SWIFTC_PATH)";
			const prefix = code === "ENOENT" ? `macOS process ownership inspection requires the Apple Swift compiler via ${launcher}` : `macOS process ownership helper compilation failed via ${launcher}`;
			const stderr = boundedUtf8Text(outcome?.stderr ?? "", STDERR_EXCERPT_LIMIT);
			const diagnostics = stderr.text.trim();
			const truncated = stderr.truncated || outcome?.stderrTruncated === true || outcome?.outputTruncated === true;
			const suffix = diagnostics ? `: ${diagnostics}${truncated ? "… [diagnostics truncated]" : ""}` : outcome === undefined ? `: ${cause instanceof Error ? cause.message : String(cause)}` : ": no compiler diagnostics were captured";
			return new DarwinProcessOwnershipInspectionError(`${prefix} (${description})${suffix}`, {
				cause,
				...outcome === undefined ? {} : { compilerOutcome: outcome }
			});
		};
		abortReason = (signal) => {
			if (signal.reason !== undefined) return signal.reason;
			const error = new Error("The operation was aborted");
			error.name = "AbortError";
			return error;
		};
		isExpectedAbort$1 = (cause, signal) => signal.aborted && (cause === signal.reason || cause instanceof Error && cause.name === "AbortError");
		waitForCompilation = async (promise, signal) => {
			if (signal === undefined) return promise;
			if (signal.aborted) throw abortReason(signal);
			return new Promise((resolve, reject) => {
				let completed = false;
				const finish = (callback) => {
					if (completed) return;
					completed = true;
					signal.removeEventListener("abort", onAbort);
					callback();
				};
				const onAbort = () => finish(() => reject(abortReason(signal)));
				signal.addEventListener("abort", onAbort, { once: true });
				promise.then((value) => finish(() => resolve(value)), (cause) => finish(() => reject(cause)));
				if (signal.aborted) onAbort();
			});
		};
		createDarwinProcessRunTokenReader = (options = {}) => {
			const compiler = options.compiler ?? {
				kind: "xcrun",
				executable: "/usr/bin/xcrun"
			};
			const compilerTimeoutMs = resolveSwiftcCompileTimeoutMs(options);
			const moduleCachePath = options.moduleCachePath ?? "";
			let root;
			let executable;
			let compilation;
			let closePromise;
			let closed = false;
			let exitCleanupInstalled = false;
			const cleanupAtExit = () => {
				if (root !== undefined) rmSync(root, {
					recursive: true,
					force: true
				});
			};
			const cleanupRoot = async (target = root) => {
				if (target === undefined) return;
				await rm(target, {
					recursive: true,
					force: true
				});
				if (root !== target) return;
				root = undefined;
				executable = undefined;
				if (exitCleanupInstalled) process.removeListener("exit", cleanupAtExit);
				exitCleanupInstalled = false;
			};
			const runCompilation = async (signal) => {
				let operationRoot;
				try {
					if (compiler.kind === "swiftc" && (!isAbsolute(compiler.executable) || !isAbsolute(compiler.sdkRoot))) {
						throw new DarwinProcessOwnershipInspectionError("Direct Darwin helper compilation requires absolute REA_DARWIN_SWIFTC_PATH and SDKROOT paths selecting a compatible installed Swift compiler and macOS SDK.");
					}
					operationRoot = await mkdtemp(join(tmpdir(), "rea-process-token-"));
					root = operationRoot;
					process.once("exit", cleanupAtExit);
					exitCleanupInstalled = true;
					if (signal.aborted || closed) throw abortReason(signal);
					const output = join(operationRoot, "reader");
					const compilerTemporary = join(operationRoot, "tmp");
					await mkdir(compilerTemporary);
					const compilerEnvironment = {
						...process.env,
						TMPDIR: compilerTemporary
					};
					const compilerArguments = compiler.kind === "xcrun" ? ["swiftc"] : ["-sdk", compiler.sdkRoot];
					if (compiler.kind === "swiftc") compilerEnvironment.SDKROOT = compiler.sdkRoot;
					if (moduleCachePath === "") {
						delete compilerEnvironment.CLANG_MODULE_CACHE_PATH;
					} else {
						await mkdir(moduleCachePath, { recursive: true });
						compilerArguments.push("-module-cache-path", moduleCachePath);
						compilerEnvironment.CLANG_MODULE_CACHE_PATH = moduleCachePath;
					}
					compilerArguments.push(...sourceFiles, "-o", output);
					try {
						await execFileOutput(compiler.executable, compilerArguments, {
							timeout: compilerTimeoutMs,
							maxBuffer: 1024 * 1024,
							signal,
							stopSignal: SWIFTC_INTERRUPT,
							env: compilerEnvironment
						});
					} catch (cause) {
						if (isExpectedAbort$1(cause, signal)) throw cause;
						throw compilerInspectionError(cause, compilerTimeoutMs, compiler);
					}
					if (signal.aborted || closed) throw abortReason(signal);
					executable = output;
					return output;
				} catch (cause) {
					const ownsRoot = operationRoot !== undefined && root === operationRoot;
					if (operationRoot !== undefined) {
						if (ownsRoot) await cleanupRoot(operationRoot);
						else await rm(operationRoot, {
							recursive: true,
							force: true
						});
					}
					throw cause;
				}
			};
			const beginCompilation = () => {
				const controller = new AbortController();
				const operation = {
					controller,
					promise: runCompilation(controller.signal).finally(() => {
						operation.settled = true;
						if (compilation === operation) compilation = undefined;
					}),
					waiters: 0,
					aborting: false,
					settled: false
				};
				compilation = operation;
				return operation;
			};
			const compile = async (signal) => {
				if (closed) throw new Error("Darwin process token reader is closed");
				signal?.throwIfAborted();
				while (true) {
					if (closed) throw new Error("Darwin process token reader is closed");
					signal?.throwIfAborted();
					if (executable !== undefined) return executable;
					if (compilation === undefined && root !== undefined) {
						await cleanupRoot();
						continue;
					}
					let operation = compilation;
					if (operation?.aborting === true) {
						try {
							await waitForCompilation(operation.promise, signal);
						} catch (cause) {
							if (signal !== undefined && isExpectedAbort$1(cause, signal)) throw cause;
						}
						continue;
					}
					operation ??= beginCompilation();
					operation.waiters += 1;
					try {
						return await waitForCompilation(operation.promise, signal);
					} finally {
						operation.waiters -= 1;
						if (operation.waiters === 0 && !operation.settled && !operation.aborting) {
							operation.aborting = true;
							operation.controller.abort();
							await operation.promise.catch(() => undefined);
						}
					}
				}
			};
			const read = async (processes, signal) => {
				signal?.throwIfAborted();
				if (processes.length === 0) return new Map();
				const binary = await compile(signal);
				const pids = processes.map(({ pid }) => String(pid));
				const { stdout } = await execFileOutput(binary, pids, {
					timeout: 15e3,
					...signal === undefined ? {} : { signal }
				});
				signal?.throwIfAborted();
				const decoded = safeParseJson(stdout);
				if (!decoded.ok) throw new Error(`macOS process token helper returned invalid JSON: ${decoded.error}`, { cause: decoded.cause });
				const parsed = responseSchema.safeParse(decoded.value);
				if (!parsed.success) throw new Error("macOS process token helper returned an invalid response", { cause: parsed.error });
				const requested = new Set(processes.map(({ pid }) => pid));
				const observations = new Map();
				for (const result of parsed.data.results) {
					if (!requested.has(result.pid) || observations.has(result.pid)) throw new Error("macOS process token helper returned an unexpected PID set");
					observations.set(result.pid, result.state === "readable" ? {
						state: "readable",
						runId: result.run_id
					} : {
						state: "unavailable",
						reason: result.reason ?? "process token observation is unavailable"
					});
				}
				if (observations.size !== requested.size) throw new Error("macOS process token helper returned an incomplete PID set");
				return observations;
			};
			const identities = async (processes, signal) => {
				if (processes.length === 0) return new Map();
				const binary = await compile(signal);
				const pids = processes.map(({ pid }) => String(pid));
				const { stdout } = await execFileOutput(binary, ["--identities", ...pids], {
					timeout: 15e3,
					...signal === undefined ? {} : { signal }
				});
				const decoded = safeParseJson(stdout);
				if (!decoded.ok) throw new Error(`macOS process identity helper returned invalid JSON: ${decoded.error}`, { cause: decoded.cause });
				const parsed = identityResponseSchema.safeParse(decoded.value);
				if (!parsed.success) throw new Error("macOS process identity helper returned an invalid response", { cause: parsed.error });
				const requested = new Set(processes.map(({ pid }) => pid));
				const observations = new Map();
				for (const result of parsed.data.results) {
					if (!requested.has(result.pid) || observations.has(result.pid)) throw new Error("macOS process identity helper returned an unexpected PID set");
					observations.set(result.pid, result.state === "readable" ? {
						state: "readable",
						identity: result.identity
					} : {
						state: "unavailable",
						reason: result.reason
					});
				}
				if (observations.size !== requested.size) throw new Error("macOS process identity helper returned an incomplete PID set");
				return observations;
			};
			const close = () => {
				if (closePromise !== undefined) return closePromise;
				closed = true;
				const pendingClose = (async () => {
					const operation = compilation;
					if (operation !== undefined && !operation.settled) {
						operation.aborting = true;
						operation.controller.abort();
						await operation.promise.catch(() => undefined);
					}
					await cleanupRoot();
				})().catch((cause) => {
					if (closePromise === pendingClose) closePromise = undefined;
					throw cause;
				});
				closePromise = pendingClose;
				return closePromise;
			};
			return {
				read,
				identities,
				prepare: compile,
				close
			};
		};
	})))();
}

//#endregion
//#region dist/process/ProcessRunTokenObservations.js
/** Read only ownership tokens, using per-process fallback for missing batch rows. */
async function* readProcessRunTokens(host, processes, signal) {
	signal?.throwIfAborted();
	if (processes.length === 0) return;
	let batch;
	let batchFailure;
	if (host.runTokens !== undefined) {
		try {
			batch = signal === undefined ? await host.runTokens(processes) : await host.runTokens(processes, signal);
		} catch (cause) {
			signal?.throwIfAborted();
			batchFailure = errorMessage$1(cause);
		}
	}
	for (const process of processes) {
		signal?.throwIfAborted();
		let observation = batch?.get(process.pid);
		if (observation === undefined) {
			try {
				const environment = signal === undefined ? await host.environment(process.pid) : await host.environment(process.pid, signal);
				observation = {
					state: "readable",
					runId: environment.REA_PROCESS_RUN_ID
				};
			} catch (cause) {
				signal?.throwIfAborted();
				const reason = errorMessage$1(cause);
				observation = {
					state: "unavailable",
					reason: batchFailure === undefined ? reason : `${reason}; run-token batch failed: ${batchFailure}`
				};
			}
		}
		signal?.throwIfAborted();
		yield {
			process,
			observation
		};
	}
}
var errorMessage$1;
function init_ProcessRunTokenObservations() {
	return (init_ProcessRunTokenObservations = __esmMin((() => {
		errorMessage$1 = (cause) => cause instanceof Error ? cause.message : String(cause);
	})))();
}

//#endregion
//#region dist/process/ProcessOwnershipObservation.js
var observeOwnedProcessGroups, observeOwnedProcessLineage, unavailableLineage, parseProcessEnvironment, parseLinuxProcessStartTime, isExpectedAbort, createSystemProcessOwnershipHost, systemProcessOwnershipHost, observeProcessStartIdentity, observeProcessStartIdentityExit, signalProcessWithStartIdentity, prepareProcessOwnershipInspection, processIsGone, errorMessage;
function init_ProcessOwnershipObservation() {
	return (init_ProcessOwnershipObservation = __esmMin((() => {
		init_analysisErrorCore();
		init_ProcessOwnershipIdentity();
		init_ProcessOwnershipProcessTree();
		init_ExecFileOutput();
		init_DarwinProcessRunTokenReader();
		init_ProcessRunTokenObservations();
		observeOwnedProcessGroups = async (runId, processGroupIds, host = systemProcessOwnershipHost, signal) => {
			signal?.throwIfAborted();
			const groupIds = [...new Set(processGroupIds)];
			if (groupIds.length === 0) return new Map();
			let processes;
			try {
				processes = liveProcesses(await host.listProcesses(signal));
			} catch (cause) {
				signal?.throwIfAborted();
				const failure = {
					state: "unverifiable",
					reason: `process group could not be inspected: ${errorMessage(cause)}`
				};
				return new Map(groupIds.map((groupId) => [groupId, failure]));
			}
			signal?.throwIfAborted();
			const membersByGroup = new Map(groupIds.map((groupId) => [groupId, []]));
			for (const process of processes) membersByGroup.get(process.processGroupId)?.push(process);
			const observations = new Map(groupIds.map((groupId) => [groupId, (membersByGroup.get(groupId)?.length ?? 0) > 0 ? { state: "alive" } : { state: "empty" }]));
			const liveMembers = groupIds.flatMap((groupId) => membersByGroup.get(groupId) ?? []);
			const pendingGroups = new Set(groupIds.filter((groupId) => (membersByGroup.get(groupId)?.length ?? 0) > 0));
			for await (const { process: member, observation } of readProcessRunTokens(host, liveMembers, signal)) {
				if (!pendingGroups.has(member.processGroupId)) continue;
				if (observation.state === "readable") {
					if (observation.runId !== runId) {
						observations.set(member.processGroupId, {
							state: "unverifiable",
							reason: "process ownership did not match"
						});
						pendingGroups.delete(member.processGroupId);
					}
				} else {
					const gone = await processIsGone(host, member.pid);
					signal?.throwIfAborted();
					if (!gone) {
						observations.set(member.processGroupId, {
							state: "unverifiable",
							reason: `process ownership could not be revalidated for PID ${member.pid}: ${observation.reason}`
						});
						pendingGroups.delete(member.processGroupId);
					}
				}
				if (pendingGroups.size === 0) break;
			}
			signal?.throwIfAborted();
			return observations;
		};
		observeOwnedProcessLineage = async (ownership, host = systemProcessOwnershipHost) => {
			let processes;
			try {
				processes = liveProcesses(await host.listProcesses());
			} catch (cause) {
				return unavailableLineage(ownership, `process table could not be inspected: ${errorMessage(cause)}`);
			}
			const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
			if (launcher === undefined) return unavailableLineage(ownership, "owned launcher is not live");
			const identityFailure = launcherIdentityFailure(launcher, ownership);
			if (identityFailure !== null) return unavailableLineage(ownership, identityFailure);
			const descendants = descendantsOf([launcher.pid], processes);
			const verifiedDescendants = [];
			for await (const { process: member, observation } of readProcessRunTokens(host, [launcher, ...descendants])) {
				if (observation.state === "readable") {
					if (observation.runId !== ownership.runId) return unavailableLineage(ownership, "process lineage contains an unowned or PID-reused process");
					if (member.pid !== launcher.pid) verifiedDescendants.push(member);
				} else {
					if (await processIsGone(host, member.pid)) {
						if (member.pid === launcher.pid) return unavailableLineage(ownership, "owned launcher exited during lineage validation");
						continue;
					}
					return unavailableLineage(ownership, `process ownership could not be revalidated for PID ${member.pid}: ${observation.reason}`);
				}
			}
			return {
				status: "verified",
				observedAt: new Date().toISOString(),
				lineage: {
					runId: ownership.runId,
					launcherPid: launcher.pid,
					launcherParentPid: launcher.parentPid,
					processGroupId: launcher.processGroupId,
					descendants: verifiedDescendants.sort((left, right) => left.pid - right.pid).map(({ pid, parentPid, processGroupId }) => ({
						pid,
						parentPid,
						processGroupId
					}))
				}
			};
		};
		unavailableLineage = (ownership, reason) => ({
			status: "unavailable",
			observedAt: new Date().toISOString(),
			runId: ownership.runId,
			launcherPid: ownership.leaderPid,
			processGroupId: ownership.processGroupId,
			reason
		});
		parseProcessEnvironment = (value) => Object.fromEntries(value.split("\0").filter((entry) => entry.indexOf("=") > 0).map((entry) => {
			const separator = entry.indexOf("=");
			return [entry.slice(0, separator), entry.slice(separator + 1)];
		}));
		parseLinuxProcessStartTime = (value) => {
			const commandEnd = value.lastIndexOf(")");
			if (commandEnd < 0) return undefined;
			const fields = value.slice(commandEnd + 1).trim().split(/\s+/u);
			const startTime = fields[19];
			return startTime !== undefined && /^\d+$/u.test(startTime) ? startTime : undefined;
		};
		isExpectedAbort = (cause, signal) => signal?.aborted === true && (cause === signal.reason || cause instanceof Error && cause.name === "AbortError");
		createSystemProcessOwnershipHost = (platform = process.platform, hostEnvironment = process.env, options = {}) => {
			const darwinModuleCachePath = options.darwinModuleCachePath ?? hostEnvironment.REA_DARWIN_MODULE_CACHE_PATH;
			const swiftcPath = hostEnvironment.REA_DARWIN_SWIFTC_PATH;
			const darwinCompiler = options.darwinCompiler ?? (swiftcPath === undefined || swiftcPath === "" ? undefined : {
				kind: "swiftc",
				executable: swiftcPath,
				sdkRoot: hostEnvironment.SDKROOT ?? ""
			});
			const darwinTokens = platform === "darwin" ? createDarwinProcessRunTokenReader({
				...darwinCompiler === undefined ? {} : { compiler: darwinCompiler },
				...darwinModuleCachePath === undefined ? {} : { moduleCachePath: darwinModuleCachePath },
				...options.compileTimeoutMs === undefined ? { environment: hostEnvironment } : { compileTimeoutMs: options.compileTimeoutMs }
			}) : undefined;
			const listProcesses = async (signal) => {
				if (platform === "win32") return [];
				const { stdout } = await execFileOutput("ps", ["-axo", "pid=,ppid=,pgid=,uid=,stat=,command="], {
					env: hostEnvironment,
					...signal === undefined ? {} : { signal }
				});
				return stdout.split("\n").map((line) => /\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.*)/u.exec(line)).filter((match) => match !== null).map((match) => ({
					pid: Number(match[1]),
					parentPid: Number(match[2]),
					processGroupId: Number(match[3]),
					uid: Number(match[4]),
					state: match[5] ?? "",
					command: match[6] ?? ""
				}));
			};
			const processIdentities = async (processes, signal) => {
				if (processes.length === 0) return new Map();
				if (platform === "linux") return new Map(await Promise.all(processes.map(async ({ pid }) => {
					try {
						const stat = await readFile(`/proc/${String(pid)}/stat`, {
							encoding: "utf8",
							...signal === undefined ? {} : { signal }
						});
						const identity = parseLinuxProcessStartTime(stat);
						return [pid, identity === undefined ? {
							state: "unavailable",
							reason: "malformed_proc_stat"
						} : {
							state: "readable",
							identity: `linux-starttime:${identity}`
						}];
					} catch (cause) {
						if (isExpectedAbort(cause, signal)) throw cause;
						return [pid, {
							state: "unavailable",
							reason: errorMessage(cause)
						}];
					}
				})));
				if (darwinTokens === undefined) return new Map();
				try {
					return await darwinTokens.identities(processes, signal);
				} catch (cause) {
					if (isExpectedAbort(cause, signal)) throw cause;
					const reason = errorMessage(cause);
					return new Map(processes.map(({ pid }) => [pid, {
						state: "unavailable",
						reason
					}]));
				}
			};
			const captureBaseline = async (signal) => {
				if (platform !== "linux" && darwinTokens === undefined) return [];
				const processes = liveProcesses(await listProcesses(signal));
				let identities = await processIdentities(processes, signal);
				const unreadable = processes.filter(({ pid }) => identities.get(pid)?.state !== "readable");
				if (unreadable.length > 0) {
					const stillLive = liveProcesses(await listProcesses(signal)).filter(({ pid }) => unreadable.some((entry) => entry.pid === pid));
					const retried = await processIdentities(stillLive, signal);
					identities = new Map([...identities, ...retried]);
					const unresolved = stillLive.filter(({ pid }) => identities.get(pid)?.state !== "readable");
					const liveAfterRetry = liveProcesses(await listProcesses(signal));
					const stillUnresolved = unresolved.filter(({ pid }) => liveAfterRetry.some((entry) => entry.pid === pid));
					if (stillUnresolved.length > 0) throw new Error(`process identity snapshot is unavailable for ${String(stillUnresolved.length)} live processes`);
				}
				return processes.map(({ pid }) => {
					const observation = identities.get(pid);
					return {
						pid,
						identity: observation?.state === "readable" ? observation.identity : null
					};
				});
			};
			return {
				platform,
				prepare: async (signal) => {
					await darwinTokens?.prepare(signal);
					if (platform === "linux") {
						try {
							const processes = await listProcesses(signal);
							if (!processes.some(({ pid }) => pid === process.pid)) throw new Error("ps did not report REA's current process");
						} catch (cause) {
							if (isExpectedAbort(cause, signal)) throw cause;
							const reason = `Linux process ownership inspection requires a procps-compatible ps on REA's PATH before launching a child: ${errorMessage(cause)}`;
							throw new AnalysisCapabilityUnavailableError("process-ownership", "prepare_owned_process", reason, {
								cause,
								userMessage: reason
							});
						}
					}
				},
				listProcesses,
				async environment(pid, signal) {
					signal?.throwIfAborted();
					if (platform === "linux") return parseProcessEnvironment(await readFile(`/proc/${pid}/environ`, {
						encoding: "utf8",
						signal
					}));
					if (platform === "darwin") {
						const process = (await listProcesses(signal)).find((entry) => entry.pid === pid);
						if (process === undefined) throw new Error(`process ${String(pid)} is not live`);
						const observation = (await darwinTokens?.read([process], signal))?.get(pid);
						if (observation === undefined || observation.state === "unavailable") throw new Error(observation?.reason ?? "process run token could not be read");
						return observation.runId === undefined ? {} : { REA_PROCESS_RUN_ID: observation.runId };
					}
					const { stdout } = await execFileOutput("ps", [
						"eww",
						"-p",
						String(pid)
					], {
						env: hostEnvironment,
						...signal === undefined ? {} : { signal }
					});
					const observedEnvironment = {};
					for (const match of stdout.matchAll(/(?:^|\s)([A-Za-z_][A-Za-z0-9_]*)=([^\s]*)/gu)) {
						const name = match[1];
						if (name !== undefined) observedEnvironment[name] = match[2] ?? "";
					}
					return observedEnvironment;
				},
				async runTokens(processes, signal) {
					signal?.throwIfAborted();
					if (platform !== "darwin" || processes.length === 0) return new Map();
					try {
						return await darwinTokens?.read(processes, signal) ?? new Map();
					} catch (cause) {
						if (isExpectedAbort(cause, signal)) throw cause;
						void cause;
						return new Map(processes.map(({ pid }) => [pid, {
							state: "unavailable",
							reason: "reader_failure"
						}]));
					}
				},
				...platform !== "linux" && darwinTokens === undefined ? {} : {
					processIdentities,
					captureBaseline,
					...darwinTokens === undefined ? {} : { close: darwinTokens.close }
				},
				signalGroup(processGroupId, signal) {
					process.kill(-processGroupId, signal);
				}
			};
		};
		systemProcessOwnershipHost = createSystemProcessOwnershipHost();
		observeProcessStartIdentity = async (pid, host = systemProcessOwnershipHost, expectedRunId) => {
			const process = (await host.listProcesses()).find((entry) => entry.pid === pid);
			if (process === undefined || liveProcesses([process]).length === 0) return undefined;
			if (host.processIdentities === undefined) return {
				state: "unavailable",
				reason: "process identity is unsupported"
			};
			const identity = (await host.processIdentities([process])).get(pid) ?? {
				state: "unavailable",
				reason: "process identity was not returned"
			};
			if (expectedRunId === undefined || identity.state !== "readable") return identity;
			let owned = false;
			for await (const { observation } of readProcessRunTokens(host, [process])) {
				if (observation.state === "unavailable") return {
					state: "unavailable",
					reason: `process ownership token could not be read for PID ${String(pid)}: ${observation.reason}`
				};
				if (observation.runId !== expectedRunId) return {
					state: "unavailable",
					reason: `process ownership token did not match the captured run for PID ${String(pid)}`
				};
				owned = true;
			}
			if (!owned) return {
				state: "unavailable",
				reason: `process ownership token was not returned for PID ${String(pid)}`
			};
			const confirmed = await observeProcessStartIdentity(pid, host);
			if (confirmed === undefined || confirmed.state !== "readable") return confirmed;
			return confirmed.identity === identity.identity ? identity : {
				state: "unavailable",
				reason: `process identity changed while validating the captured run token for PID ${String(pid)}`
			};
		};
		observeProcessStartIdentityExit = async (pid, expectedIdentity, host = systemProcessOwnershipHost) => {
			try {
				const observed = await observeProcessStartIdentity(pid, host);
				if (observed === undefined) return "exited";
				if (observed.state !== "readable") return "unverified";
				return observed.identity === expectedIdentity ? "present" : "exited";
			} catch {
				return "unverified";
			}
		};
		signalProcessWithStartIdentity = async (pid, expectedIdentity, signal, options = {}) => {
			const host = options.host ?? systemProcessOwnershipHost;
			try {
				const observed = await observeProcessStartIdentity(pid, host);
				if (observed === undefined) return "gone";
				if (observed.state !== "readable") return "unverified";
				if (observed.identity !== expectedIdentity) return "identity-changed";
				(options.sendSignal ?? process.kill)(pid, signal);
				return "signaled";
			} catch {
				return "unverified";
			}
		};
		prepareProcessOwnershipInspection = async (signal) => {
			await systemProcessOwnershipHost.prepare?.(signal);
		};
		processIsGone = async (host, pid) => {
			try {
				return !liveProcesses(await host.listProcesses()).some((process) => process.pid === pid);
			} catch (cause) {
				void cause;
				return false;
			}
		};
		errorMessage = (cause) => cause instanceof Error ? cause.message : String(cause);
	})))();
}

//#endregion
//#region dist/process/ProcessOwnership.js
var execFileAsync, cleanupWindowsProcessTree, systemWindowsProcessTreeHost, readProcessRunId, withUnverifiedObservations, cleanupOwnedProcessGroup, verifyNoTokenOwnedProcesses, readLiveProcessTable, settleLauncherExit, createOwnedCleanupPlan, mergeProcessOwnershipFailure, ownershipFailurePriority, revalidateOwnedProcessGroup, cleanupValidationFailure, sanitizedTokenReadFailure, processOwnershipFailures, processRunTokenFailures, recheckOwnershipFailures, TOKEN_READ_RETRY_ATTEMPTS, TOKEN_READ_RETRY_DELAY_MS, PLATFORM_BINARY_ENVIRONMENT_WITHHELD, RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD, currentProcessUid, environmentWithheldFromInspection, scanTokenOwnedProcesses, settleUnreadableTokenCandidates;
function init_ProcessOwnership() {
	return (init_ProcessOwnership = __esmMin((() => {
		init_ProcessOwnershipObservation();
		init_ProcessOwnershipIdentity();
		init_ProcessOwnershipProcessTree();
		init_ProcessRunTokenObservations();
		init_unicodeCodePointOrder();
		execFileAsync = promisify(execFile);
		cleanupWindowsProcessTree = async (rootPid, host = systemWindowsProcessTreeHost) => {
			if (!Number.isSafeInteger(rootPid) || rootPid <= 0) return {
				cleaned: false,
				reason: "Windows process-tree PID is invalid"
			};
			try {
				const result = await host.terminateTree(rootPid);
				return {
					cleaned: true,
					signaled: result === "terminated"
				};
			} catch (cause) {
				return {
					cleaned: false,
					reason: `Windows process-tree termination failed for PID ${String(rootPid)}: ${errorMessage(cause)}`
				};
			}
		};
		systemWindowsProcessTreeHost = { async terminateTree(rootPid) {
			try {
				await execFileAsync("taskkill.exe", [
					"/pid",
					String(rootPid),
					"/t",
					"/f"
				], {
					windowsHide: true,
					timeout: 5e3
				});
				return "terminated";
			} catch (cause) {
				if (cause instanceof Error && "code" in cause && (cause.code === 128 || cause.code === "ESRCH")) return "missing";
				throw cause;
			}
		} };
		readProcessRunId = async (pid, host = systemProcessOwnershipHost, signal) => (await host.environment(pid, signal)).REA_PROCESS_RUN_ID;
		withUnverifiedObservations = (result, unverified) => unverified.length === 0 || (result.unverified?.length ?? 0) > 0 ? result : {
			...result,
			unverified
		};
		cleanupOwnedProcessGroup = async (ownership, host = systemProcessOwnershipHost) => {
			const processTable = await readLiveProcessTable(host);
			if (!processTable.available) return {
				cleaned: false,
				reason: `process table could not be inspected: ${processTable.reason}`
			};
			const plan = await createOwnedCleanupPlan(ownership, processTable.processes, host);
			if ("cleaned" in plan) return plan;
			let signaled = false;
			for (const processGroupId of plan.signalOrder) {
				const revalidation = await revalidateOwnedProcessGroup(processGroupId, ownership, host, plan.tokenOwnedIdentities);
				if ("cleaned" in revalidation) {
					if (!revalidation.cleaned) return withUnverifiedObservations(revalidation, plan.unverified);
					return {
						...revalidation,
						...revalidation.unverified?.length || plan.unverified.length === 0 ? {} : { unverified: plan.unverified }
					};
				}
				if (revalidation.empty) continue;
				try {
					host.signalGroup(processGroupId, "SIGKILL");
					signaled = true;
				} catch (cause) {
					const code = cause instanceof Error && "code" in cause ? cause.code : undefined;
					if (code !== "ESRCH") return withUnverifiedObservations({
						cleaned: false,
						reason: `owned process group signal failed: ${errorMessage(cause)}`
					}, plan.unverified);
				}
			}
			if (plan.unresolved.length > 0) return cleanupValidationFailure(plan.unresolved, plan.unverified);
			return {
				cleaned: true,
				signaled,
				...plan.unverified.length === 0 ? {} : { unverified: plan.unverified }
			};
		};
		verifyNoTokenOwnedProcesses = async (runId, host = systemProcessOwnershipHost, captureBaseline, relation) => {
			const processTable = await readLiveProcessTable(host);
			if (!processTable.available) return {
				cleaned: false,
				reason: `process table could not be inspected: ${processTable.reason}`
			};
			const scan = await scanTokenOwnedProcesses(processTable.processes, runId, host, captureBaseline, relation);
			if (scan.failures.length > 0) return cleanupValidationFailure(scan.failures, scan.unverified);
			if (scan.owned.length > 0) return {
				cleaned: false,
				reason: "token-owned process remained after cleanup",
				...scan.unverified.length === 0 ? {} : { unverified: scan.unverified }
			};
			return {
				cleaned: true,
				signaled: false,
				...scan.unverified.length === 0 ? {} : { unverified: scan.unverified }
			};
		};
		readLiveProcessTable = async (host) => {
			try {
				return {
					available: true,
					processes: liveProcesses(await host.listProcesses())
				};
			} catch (cause) {
				return {
					available: false,
					reason: errorMessage(cause)
				};
			}
		};
		settleLauncherExit = async (ownership, processes, host) => {
			const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
			if (launcher === undefined) return processes;
			const reason = launcherIdentityFailure(launcher, ownership);
			if (reason === null) return processes;
			const refreshed = await readLiveProcessTable(host);
			if (refreshed.available && !refreshed.processes.some(({ pid }) => pid === launcher.pid)) {
				const descendants = descendantsOf([launcher.pid], processes);
				const descendantPids = new Set(descendants.map(({ pid }) => pid));
				const descendantGroupIds = new Set(descendants.map(({ processGroupId }) => processGroupId));
				const refreshedDescendantPids = new Set(descendantsOf(descendants.map(({ pid }) => pid), refreshed.processes).map(({ pid }) => pid));
				if (refreshed.processes.some((process) => process.processGroupId !== ownership.processGroupId && (refreshedDescendantPids.has(process.pid) || descendantPids.has(process.pid) || descendantGroupIds.has(process.processGroupId)))) return {
					cleaned: false,
					reason
				};
				return refreshed.processes;
			}
			return {
				cleaned: false,
				reason
			};
		};
		createOwnedCleanupPlan = async (ownership, initialProcesses, host) => {
			const processes = await settleLauncherExit(ownership, initialProcesses, host);
			if ("cleaned" in processes) return processes;
			const sampledProcessGroupIds = new Set((ownership.sampledProcessGroupIds ?? []).filter((processGroupId) => Number.isSafeInteger(processGroupId) && processGroupId > 0));
			const tokenOwned = ownership.sweepTokenOwnedProcesses === true ? await scanTokenOwnedProcesses(processes, ownership.runId, host, ownership.captureBaseline, {
				leaderPid: ownership.leaderPid,
				processGroupId: ownership.processGroupId,
				...sampledProcessGroupIds.size === 0 ? {} : { sampledProcessGroupIds: [...sampledProcessGroupIds] }
			}) : {
				owned: [],
				failures: [],
				unverified: [],
				identities: new Map()
			};
			const tokenOwnedGroupIds = new Set(tokenOwned.owned.map(({ processGroupId }) => processGroupId));
			const launcher = processes.find(({ pid }) => pid === ownership.leaderPid);
			const rootMembers = processes.filter(({ processGroupId }) => processGroupId === ownership.processGroupId);
			if (launcher === undefined && rootMembers.length === 0 && tokenOwned.owned.length === 0 && !processes.some(({ processGroupId }) => sampledProcessGroupIds.has(processGroupId))) return tokenOwned.failures.length > 0 ? {
				signalOrder: [],
				tokenOwnedIdentities: tokenOwned.identities,
				unresolved: tokenOwned.failures,
				unverified: tokenOwned.unverified
			} : {
				cleaned: true,
				signaled: false,
				...tokenOwned.unverified.length === 0 ? {} : { unverified: tokenOwned.unverified }
			};
			let descendants = [];
			if (launcher !== undefined) {
				descendants = descendantsOf([launcher.pid], processes);
			}
			const descendantPids = new Set(descendants.map(({ pid }) => pid));
			const processGroupIds = new Set([ownership.processGroupId]);
			for (const descendant of descendants) processGroupIds.add(descendant.processGroupId);
			for (const process of tokenOwned.owned) processGroupIds.add(process.processGroupId);
			for (const processGroupId of sampledProcessGroupIds) processGroupIds.add(processGroupId);
			const signalableGroups = new Set();
			const unresolved = [...tokenOwned.failures];
			const unverifiableSampledGroups = new Set();
			for (const processGroupId of processGroupIds) {
				if (processGroupId === ownership.processGroupId) continue;
				const groupLeader = processes.find(({ pid, processGroupId: observedGroupId }) => pid === processGroupId && observedGroupId === processGroupId);
				if ((groupLeader === undefined || !descendantPids.has(groupLeader.pid)) && !tokenOwnedGroupIds.has(processGroupId) && !sampledProcessGroupIds.has(processGroupId)) return {
					cleaned: false,
					reason: "descendant process-group leader identity could not be verified"
				};
				if ((groupLeader === undefined || !descendantPids.has(groupLeader.pid)) && !tokenOwnedGroupIds.has(processGroupId)) unverifiableSampledGroups.add(processGroupId);
			}
			const liveMembers = processes.filter(({ processGroupId }) => processGroupIds.has(processGroupId));
			for (const processGroupId of processGroupIds) {
				const members = liveMembers.filter(({ processGroupId: observedGroupId }) => observedGroupId === processGroupId);
				if (members.length === 0) continue;
				const failures = await processOwnershipFailures(members, ownership.runId, host, tokenOwned.identities);
				if (failures.length === 0 && unverifiableSampledGroups.has(processGroupId)) unresolved.push(...members.map(({ pid }) => ({
					pid,
					reason: "process-identity-unavailable",
					diagnostic: "sampled process-group leader identity could not be verified"
				})));
				const scanFailures = tokenOwned.failures.filter(({ pid }) => members.some((member) => member.pid === pid));
				for (const failure of failures) mergeProcessOwnershipFailure(unresolved, failure);
				if (failures.length === 0 && scanFailures.length === 0 && !unverifiableSampledGroups.has(processGroupId)) signalableGroups.add(processGroupId);
			}
			if (ownership.sweepTokenOwnedProcesses !== true && unresolved.length > 0) return cleanupValidationFailure(unresolved, tokenOwned.unverified);
			return {
				signalOrder: [...signalableGroups].filter((groupId) => processGroupIds.has(groupId)).sort((left, right) => left === ownership.processGroupId ? -1 : right === ownership.processGroupId ? 1 : left - right),
				tokenOwnedIdentities: tokenOwned.identities,
				unresolved,
				unverified: tokenOwned.unverified
			};
		};
		mergeProcessOwnershipFailure = (failures, next) => {
			const index = failures.findIndex(({ pid }) => pid === next.pid);
			if (index < 0) {
				failures.push(next);
				return;
			}
			const previous = failures[index];
			if (previous !== undefined && ownershipFailurePriority(next.reason) >= ownershipFailurePriority(previous.reason)) failures[index] = next;
		};
		ownershipFailurePriority = (reason) => reason === "run-token-mismatch" ? 3 : reason === "process-identity-unavailable" ? 2 : reason === "environment-unreadable" ? 1 : 0;
		revalidateOwnedProcessGroup = async (processGroupId, ownership, host, expectedIdentities) => {
			let members;
			try {
				const processes = await settleLauncherExit(ownership, liveProcesses(await host.listProcesses()), host);
				if ("cleaned" in processes) return processes;
				members = processes.filter(({ processGroupId: observedGroupId }) => observedGroupId === processGroupId);
			} catch (cause) {
				return {
					cleaned: false,
					reason: `process ownership could not be revalidated: ${errorMessage(cause)}`
				};
			}
			const failures = await processOwnershipFailures(members, ownership.runId, host, expectedIdentities);
			if (failures.length > 0) return cleanupValidationFailure(failures);
			if (processGroupId !== ownership.processGroupId && members.length > 0 && !members.some(({ pid }) => pid === processGroupId) && ownership.sweepTokenOwnedProcesses !== true) return {
				cleaned: false,
				reason: "descendant process-group leader identity could not be revalidated"
			};
			return { empty: members.length === 0 };
		};
		cleanupValidationFailure = (failures, unverified = []) => {
			const unverifiedEntry = unverified.length === 0 ? {} : { unverified };
			const unreadable = failures.filter(({ reason }) => reason === "environment-unreadable");
			if (failures.some(({ reason }) => reason === "run-token-mismatch")) return {
				cleaned: false,
				reason: `process ownership token mismatch for PID(s): ${[...new Set(failures.filter(({ reason }) => reason === "run-token-mismatch").map(({ pid }) => pid))].sort((left, right) => left - right).join(", ")}`,
				failures,
				...unverifiedEntry
			};
			if (failures.some(({ reason }) => reason === "process-identity-unavailable")) return {
				cleaned: false,
				reason: "process identity could not be revalidated",
				failures,
				...unverifiedEntry
			};
			if (unreadable.length > 0) {
				const counts = new Map();
				for (const { diagnostic } of unreadable) {
					const category = sanitizedTokenReadFailure(diagnostic);
					counts.set(category, (counts.get(category) ?? 0) + 1);
				}
				const breakdown = [...counts].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([category, count]) => `${category}=${String(count)}`).join(", ");
				const candidates = unreadable.map(({ pid, diagnostic }) => `${String(pid)}=${sanitizedTokenReadFailure(diagnostic)}`).sort((left, right) => compareUnicodeCodePoints(left, right));
				return {
					cleaned: false,
					reason: `process ownership token could not be read for ${String(unreadable.length)} live process(es): ${breakdown}; live candidates ${candidates.join(", ")}`,
					failures,
					...unverifiedEntry
				};
			}
			return {
				cleaned: false,
				reason: "process ownership could not be revalidated",
				failures,
				...unverifiedEntry
			};
		};
		sanitizedTokenReadFailure = (diagnostic) => {
			if (diagnostic === "environment_unavailable") return diagnostic;
			if (diagnostic === "platform_binary_environment_withheld") return diagnostic;
			if (diagnostic === "restricted_process_environment_withheld") return diagnostic;
			const environmentErrno = /^(EACCES|EPERM|ENOENT|ESRCH):/u.exec(diagnostic ?? "");
			if (environmentErrno?.[1] !== undefined) return `environment_errno_${environmentErrno[1]}`;
			if (diagnostic === "apple_vector_unavailable") return diagnostic;
			if (diagnostic === "ambiguous_environment_boundary") return diagnostic;
			if (diagnostic === "malformed_procargs") return diagnostic;
			if (diagnostic === "process_identity_changed_during_token_read") return diagnostic;
			if (diagnostic === "process_not_in_snapshot") return diagnostic;
			const processTableFailure = /^process_table_failed_(\d+)$/u.exec(diagnostic ?? "");
			if (processTableFailure?.[1] !== undefined) return `process_table_errno_${processTableFailure[1]}`;
			const sysctlFailure = /^sysctl_failed_(\d+)$/u.exec(diagnostic ?? "");
			if (sysctlFailure?.[1] !== undefined) return `sysctl_errno_${sysctlFailure[1]}`;
			if (diagnostic === "reader_failure") return diagnostic;
			if (diagnostic === "duplicate_run_token") return diagnostic;
			if (diagnostic === "invalid_run_token_encoding") return diagnostic;
			return "other_unavailable";
		};
		processOwnershipFailures = async (members, runId, host, expectedIdentities = new Map()) => {
			const failures = [];
			if (expectedIdentities.size > 0 && host.processIdentities !== undefined) {
				const expectedMembers = members.filter(({ pid }) => expectedIdentities.has(pid));
				const observed = await host.processIdentities(expectedMembers);
				const identityFailures = [];
				for (const member of expectedMembers) {
					const expected = expectedIdentities.get(member.pid);
					const current = observed.get(member.pid);
					if (expected === null || current?.state !== "readable" || current.identity !== expected) {
						identityFailures.push({
							pid: member.pid,
							reason: "process-identity-unavailable",
							diagnostic: "process identity changed or became unavailable before signal"
						});
					}
				}
				failures.push(...await recheckOwnershipFailures(identityFailures, host));
			}
			failures.push(...await processRunTokenFailures(members, runId, host));
			if (failures.length === 0 && expectedIdentities.size > 0 && host.processIdentities !== undefined) {
				const expectedMembers = members.filter(({ pid }) => expectedIdentities.has(pid));
				const observed = await host.processIdentities(expectedMembers);
				const identityFailures = [];
				for (const member of expectedMembers) {
					const expected = expectedIdentities.get(member.pid);
					const current = observed.get(member.pid);
					if (expected !== null && current?.state === "readable" && current.identity === expected) continue;
					identityFailures.push({
						pid: member.pid,
						reason: "process-identity-unavailable",
						diagnostic: "process identity changed or became unavailable during token validation"
					});
				}
				failures.push(...await recheckOwnershipFailures(identityFailures, host));
			}
			return failures;
		};
		processRunTokenFailures = async (members, runId, host) => {
			const failures = [];
			for await (const { process: member, observation } of readProcessRunTokens(host, members)) {
				if (observation.state === "readable") {
					if (observation.runId !== runId) failures.push({
						pid: member.pid,
						reason: "run-token-mismatch"
					});
					continue;
				}
				failures.push({
					pid: member.pid,
					reason: "environment-unreadable",
					diagnostic: observation.reason
				});
			}
			return recheckOwnershipFailures(failures, host);
		};
		recheckOwnershipFailures = async (failures, host) => {
			if (!failures.some(({ reason }) => reason !== "run-token-mismatch")) return failures;
			try {
				let processes = await host.listProcesses();
				const isDarwin = (host.platform ?? process.platform) === "darwin";
				for (let attempt = 0; isDarwin && attempt < TOKEN_READ_RETRY_ATTEMPTS && processes.some(({ pid, state }) => failures.some((failure) => failure.pid === pid && failure.reason !== "run-token-mismatch") && state.slice(1).includes("E")); attempt += 1) {
					await new Promise((resolve) => setTimeout(resolve, TOKEN_READ_RETRY_DELAY_MS));
					processes = await host.listProcesses();
				}
				const live = new Set(liveProcesses(processes).map(({ pid }) => pid));
				return failures.filter(({ pid, reason }) => reason === "run-token-mismatch" || live.has(pid));
			} catch (cause) {
				return failures.map((failure) => failure.reason === "run-token-mismatch" ? failure : {
					...failure,
					diagnostic: `${failure.diagnostic}; process liveness recheck failed: ${errorMessage(cause)}`
				});
			}
		};
		TOKEN_READ_RETRY_ATTEMPTS = 3;
		TOKEN_READ_RETRY_DELAY_MS = 40;
		PLATFORM_BINARY_ENVIRONMENT_WITHHELD = "platform_binary_environment_withheld";
		RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD = "restricted_process_environment_withheld";
		currentProcessUid = () => typeof process.getuid === "function" ? process.getuid() : undefined;
		environmentWithheldFromInspection = (entry, diagnostic) => {
			const uid = currentProcessUid();
			if (uid !== undefined && entry.uid !== undefined && entry.uid !== uid) return true;
			return diagnostic === PLATFORM_BINARY_ENVIRONMENT_WITHHELD || diagnostic === RESTRICTED_PROCESS_ENVIRONMENT_WITHHELD;
		};
		scanTokenOwnedProcesses = async (processes, runId, host, captureBaseline, relation) => {
			let candidates = processes;
			let candidateIdentities = new Map();
			if (host.processIdentities !== undefined) {
				const current = await host.processIdentities(processes);
				candidateIdentities = current;
				if (captureBaseline !== undefined) {
					const baseline = new Map(captureBaseline.map(({ pid, identity }) => [pid, identity]));
					candidates = processes.filter((process) => {
						const before = baseline.get(process.pid);
						const now = current.get(process.pid);
						return !(before !== undefined && before !== null && now?.state === "readable" && now.identity === before);
					});
				}
			}
			const failures = [];
			if (captureBaseline !== undefined && host.processIdentities !== undefined) {
				const stableCandidates = [];
				const identityFailures = [];
				for (const process of candidates) {
					if (candidateIdentities.get(process.pid)?.state === "readable") {
						stableCandidates.push(process);
						continue;
					}
					identityFailures.push({
						pid: process.pid,
						reason: "process-identity-unavailable",
						diagnostic: "process identity was unavailable during token scan"
					});
				}
				failures.push(...await recheckOwnershipFailures(identityFailures, host));
				candidates = stableCandidates;
			}
			const owned = [];
			const ownedIdentities = new Map();
			const recordOwned = (process) => {
				owned.push(process);
				const identity = candidateIdentities.get(process.pid);
				ownedIdentities.set(process.pid, identity?.state === "readable" ? identity.identity : null);
			};
			const unreadable = [];
			for await (const { process, observation } of readProcessRunTokens(host, candidates)) {
				if (observation.state === "readable") {
					if (observation.runId === runId) recordOwned(process);
				} else unreadable.push({
					process,
					diagnostic: observation.reason
				});
			}
			const remaining = await settleUnreadableTokenCandidates(unreadable, runId, host, recordOwned);
			const relatedPids = new Set();
			const relatedGroupIds = new Set();
			if (relation !== undefined) {
				relatedPids.add(relation.leaderPid);
				for (const descendant of descendantsOf([relation.leaderPid], processes)) relatedPids.add(descendant.pid);
				relatedGroupIds.add(relation.processGroupId);
				for (const processGroupId of relation.sampledProcessGroupIds ?? []) if (Number.isSafeInteger(processGroupId) && processGroupId > 0) relatedGroupIds.add(processGroupId);
				for (const process of owned) relatedGroupIds.add(process.processGroupId);
			}
			const unverified = [];
			const strict = [];
			const withheld = [];
			for (const candidate of remaining) {
				const isRelated = relation === undefined || relatedPids.has(candidate.process.pid) || relatedGroupIds.has(candidate.process.processGroupId);
				if (!isRelated && environmentWithheldFromInspection(candidate.process, candidate.diagnostic)) {
					withheld.push(candidate);
					continue;
				}
				strict.push(candidate);
			}
			let finalLive;
			try {
				finalLive = new Set(liveProcesses(await host.listProcesses()).map(({ pid }) => pid));
			} catch (cause) {
				void cause;
				finalLive = undefined;
			}
			for (const candidate of strict) {
				if (finalLive !== undefined && !finalLive.has(candidate.process.pid)) continue;
				failures.push({
					pid: candidate.process.pid,
					reason: "environment-unreadable",
					diagnostic: candidate.diagnostic
				});
			}
			for (const candidate of withheld) {
				if (finalLive !== undefined && !finalLive.has(candidate.process.pid)) continue;
				unverified.push({
					pid: candidate.process.pid,
					diagnostic: candidate.diagnostic
				});
			}
			if (candidates.length > 0 && host.processIdentities !== undefined) {
				const afterRead = await host.processIdentities(candidates);
				const stillOwned = [];
				const identityFailures = [];
				const ownedPids = new Set(owned.map(({ pid }) => pid));
				for (const process of candidates) {
					const before = candidateIdentities.get(process.pid);
					const current = afterRead.get(process.pid);
					if (before?.state === "readable" && current?.state === "readable" && current.identity === before.identity) {
						if (ownedPids.has(process.pid)) stillOwned.push(process);
						continue;
					}
					identityFailures.push({
						pid: process.pid,
						reason: "process-identity-unavailable",
						diagnostic: "process identity changed or became unavailable during token validation"
					});
				}
				failures.push(...await recheckOwnershipFailures(identityFailures, host));
				return {
					owned: stillOwned,
					failures,
					unverified,
					identities: ownedIdentities
				};
			}
			return {
				owned,
				failures,
				unverified,
				identities: ownedIdentities
			};
		};
		settleUnreadableTokenCandidates = async (pending, runId, host, recordOwned) => {
			let remaining = pending;
			for (let attempt = 0; attempt < TOKEN_READ_RETRY_ATTEMPTS && remaining.length > 0; attempt += 1) {
				await new Promise((resolve) => setTimeout(resolve, TOKEN_READ_RETRY_DELAY_MS));
				let live;
				try {
					live = new Set(liveProcesses(await host.listProcesses()).map(({ pid }) => pid));
				} catch (cause) {
					void cause;
					live = undefined;
				}
				const stillUnreadable = [];
				const candidates = remaining.map(({ process }) => process).filter(({ pid }) => live === undefined || live.has(pid));
				for await (const { process, observation } of readProcessRunTokens(host, candidates)) {
					if (observation.state === "readable") {
						if (observation.runId === runId) recordOwned(process);
						continue;
					}
					stillUnreadable.push({
						process,
						diagnostic: observation.reason
					});
				}
				remaining = stillUnreadable;
			}
			return remaining;
		};
	})))();
}

//#endregion
export { DarwinProcessOwnershipInspectionError, SWIFTC_INTERRUPT, boundedUtf8Text, cleanupOwnedProcessGroup, cleanupWindowsProcessTree, init_DarwinProcessRunTokenReader, init_ProcessOwnership, init_ProcessOwnershipObservation, init_ProcessOwnershipProcessTree, init_boundedUtf8Text, observeOwnedProcessGroups, observeOwnedProcessLineage, observeProcessStartIdentity, observeProcessStartIdentityExit, parseLinuxProcessStartTime, prepareProcessOwnershipInspection, readProcessRunId, selectCapturedProcessGroupIds, signalProcessWithStartIdentity, systemProcessOwnershipHost, verifyNoTokenOwnedProcesses };