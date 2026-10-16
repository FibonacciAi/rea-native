import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_ProcessOwnershipObservation, prepareProcessOwnershipInspection, systemProcessOwnershipHost } from "./ProcessOwnership-DXC5-UWt.js";
import { createRequire } from "node:module";
import { z } from "zod";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { EventEmitter } from "node:events";
import { PassThrough, Writable } from "node:stream";
import { fileURLToPath } from "node:url";
import { PACKAGE_METADATA } from "../generatedPackageMetadata.js";

//#region dist/windows/WindowsNativeLoader.js
var windowsHandleSchema, windowsFileIdentitySchema, windowsNativeManifestSchema, inspectionSchema, bindingSchema, loadWindowsNativeAuthority, assertWindowsX64Artifact, cached, systemWindowsNativeAuthority, requireWindowsNativeAuthority;
function init_WindowsNativeLoader() {
	return (init_WindowsNativeLoader = __esmMin((() => {
		windowsHandleSchema = z.custom((value) => typeof value === "object" && value !== null && !Array.isArray(value));
		windowsFileIdentitySchema = z.strictObject({
			requestedPath: z.string(),
			finalPath: z.string(),
			filesystem: z.literal("NTFS"),
			volumeSerial: z.string().regex(/^[a-f0-9]{16}$/u),
			fileId: z.string().regex(/^[a-f0-9]{32}$/u),
			size: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
			directory: z.boolean()
		});
		windowsNativeManifestSchema = z.strictObject({
			packageVersion: z.string(),
			platform: z.literal("win32"),
			architecture: z.literal("x64"),
			abiVersion: z.literal(1),
			nodeApiVersion: z.literal(8),
			artifact: z.literal("rea-windows-x64.node"),
			artifactSha256: z.string().regex(/^[a-f0-9]{64}$/u)
		});
		inspectionSchema = z.strictObject({
			abiVersion: z.literal(1),
			nodeApiVersion: z.literal(8),
			architecture: z.literal("x64"),
			filesystem: windowsFileIdentitySchema,
			privateDacl: z.literal(true),
			privateBridgeDescriptorAccess: z.literal(true),
			atomicJobAssignment: z.literal(true),
			killOnOwnerClose: z.literal(true),
			protocolStdin: z.boolean().optional(),
			/** Absent from artifacts built before owned Job Object commit limits. */
			jobMemoryLimit: z.literal(true).optional()
		});
		bindingSchema = z.strictObject({ call: z.custom((value) => typeof value === "function") });
		loadWindowsNativeAuthority = (host) => {
			if (host.platform !== "win32" || host.architecture !== "x64") return {
				available: false,
				failureStage: "host",
				reason: "REA Windows native controls require a Windows x64 host."
			};
			const nodeApiVersion = Number(host.nodeApiVersion);
			if (!Number.isSafeInteger(nodeApiVersion) || nodeApiVersion < 8) return {
				available: false,
				failureStage: "host",
				reason: "REA Windows native controls require Node-API 8 or newer."
			};
			try {
				const manifest = windowsNativeManifestSchema.parse(host.readManifest());
				if (manifest.packageVersion !== host.packageVersion) throw new Error("Windows native artifact belongs to another REA version");
				const artifact = host.readArtifact();
				if (createHash("sha256").update(artifact).digest("hex") !== manifest.artifactSha256) throw new Error("Windows native artifact SHA-256 does not match package metadata");
				assertWindowsX64Artifact(artifact);
				const binding = bindingSchema.parse(host.loadArtifact());
				let observed;
				try {
					observed = binding.call("inspect", []);
				} catch (cause) {
					return {
						available: false,
						failureStage: "self-test",
						retryable: true,
						reason: `REA Windows native self-test failed: ${cause instanceof Error ? cause.message : String(cause)}`
					};
				}
				const parsed = inspectionSchema.safeParse(observed);
				if (!parsed.success) return {
					available: false,
					failureStage: "inspection",
					reason: `REA Windows native inspection is invalid: ${parsed.error.message}`
				};
				const inspection = parsed.data;
				return {
					available: true,
					authority: {
						call: binding.call,
						inspection
					}
				};
			} catch (cause) {
				return {
					available: false,
					failureStage: "artifact",
					reason: `REA Windows native controls are unavailable: ${cause instanceof Error ? cause.message : String(cause)}`
				};
			}
		};
		assertWindowsX64Artifact = (bytes) => {
			if (bytes.length < 64 || bytes.toString("latin1", 0, 2) !== "MZ") throw new Error("Windows native artifact is not a PE image");
			const offset = bytes.readUInt32LE(60);
			if (offset > bytes.length - 26 || bytes.toString("latin1", offset, offset + 4) !== "PE\0\0" || bytes.readUInt16LE(offset + 4) !== 34404 || bytes.readUInt16LE(offset + 24) !== 523) throw new Error("Windows native artifact is not a Windows x64 PE32+ image");
		};
		;
		systemWindowsNativeAuthority = () => {
			if (cached?.available === false && cached.retryable === true) cached = undefined;
			cached ??= loadWindowsNativeAuthority({
				platform: process.platform,
				architecture: process.arch,
				nodeApiVersion: process.versions.napi,
				packageVersion: PACKAGE_METADATA.version,
				readManifest: () => {
					const encoded = readFileSync(new URL("../../native/windows/build/manifest.json", new URL("../windows/WindowsNativeLoader.js", import.meta.url).href), "utf8");
					const value = JSON.parse(encoded);
					return value;
				},
				readArtifact: () => readFileSync(new URL("../../native/windows/build/rea-windows-x64.node", new URL("../windows/WindowsNativeLoader.js", import.meta.url).href)),
				loadArtifact: () => {
					const value = createRequire(new URL("../windows/WindowsNativeLoader.js", import.meta.url).href)(fileURLToPath(new URL("../../native/windows/build/rea-windows-x64.node", new URL("../windows/WindowsNativeLoader.js", import.meta.url).href)));
					return value;
				}
			});
			return cached;
		};
		requireWindowsNativeAuthority = () => {
			const loaded = systemWindowsNativeAuthority();
			if (!loaded.available) throw new Error(loaded.reason);
			return loaded.authority;
		};
	})))();
}

//#endregion
//#region dist/windows/WindowsOwnedProcess.js
var launchSchema, pollSchema, limitedPollSchema, quoteWindowsProcessArgument, WindowsOwnedProcess;
function init_WindowsOwnedProcess() {
	return (init_WindowsOwnedProcess = __esmMin((() => {
		init_WindowsNativeLoader();
		launchSchema = z.strictObject({
			pid: z.number().int().positive().max(4294967295),
			handle: windowsHandleSchema,
			jobAssigned: z.literal(true),
			killOnOwnerClose: z.literal(true)
		});
		pollSchema = z.strictObject({
			stdout: z.instanceof(Buffer),
			stderr: z.instanceof(Buffer),
			stdoutEnded: z.boolean(),
			stderrEnded: z.boolean(),
			exitCode: z.number().int().nonnegative().max(4294967295).nullable(),
			activeProcesses: z.number().int().nonnegative()
		});
		limitedPollSchema = pollSchema.extend({
			memoryLimitReached: z.boolean(),
			peakJobMemoryBytes: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
		});
		quoteWindowsProcessArgument = (value) => {
			if (value.includes("\0")) throw new TypeError("Windows process argument contains NUL");
			return `"${value.replace(/(\\*)"/gu, "$1$1\\\"").replace(/(\\+)$/u, "$1$1")}"`;
		};
		WindowsOwnedProcess = class extends EventEmitter {
			stdout = new PassThrough();
			stderr = new PassThrough();
			stdin;
			signalCode = null;
			exitCode = null;
			pid;
			#handle;
			#authority;
			#settled;
			#settle;
			#closed = false;
			#failure;
			#timer;
			#blockedWake;
			#blockedOutput = new Set();
			#unreferenced = false;
			#cleanup;
			#memoryLimitBytes;
			#memoryLimitReached = false;
			#peakJobMemoryBytes;
			#outputIncomplete = false;
			constructor(command, arguments_, cwd, environment, verbatim, options = {}) {
				super();
				const protocolStdin = options.protocolStdin === true;
				this.#memoryLimitBytes = options.memoryLimitBytes;
				this.#authority = options.authority ?? requireWindowsNativeAuthority();
				if (protocolStdin && this.#authority.inspection.protocolStdin !== true) throw new Error("The bundled Windows native artifact does not support owned protocol stdin; use a matching current Windows x64 REA package.");
				if (this.#memoryLimitBytes !== undefined && this.#authority.inspection.jobMemoryLimit !== true) throw new Error("The bundled Windows native artifact does not support Job Object memory limits; use a matching current Windows x64 REA package.");
				const entries = Object.entries(environment).filter((entry) => entry[1] !== undefined).map(([key, value]) => `${key}=${value}`);
				const line = [quoteWindowsProcessArgument(command.replaceAll("/", "\\")), ...arguments_.map((value) => verbatim ? value : quoteWindowsProcessArgument(value))].join(" ");
				let controls = protocolStdin ? [true] : [];
				if (this.#memoryLimitBytes !== undefined) controls = [protocolStdin, this.#memoryLimitBytes];
				const spawned = this.#authority.call("process_spawn", [
					command,
					line,
					cwd ?? "",
					entries,
					...controls
				]);
				const launched = this.#memoryLimitBytes === undefined ? launchSchema.parse(spawned) : launchSchema.extend({ jobMemoryLimitBytes: z.literal(this.#memoryLimitBytes) }).parse(spawned);
				this.pid = launched.pid;
				this.#handle = launched.handle;
				this.stdin = protocolStdin ? new Writable({
					write: (chunk, _encoding, callback) => {
						void this.#writeInput(chunk).then(() => callback(), (cause) => callback(cause instanceof Error ? cause : new Error(String(cause))));
					},
					final: (callback) => {
						try {
							this.#authority.call("process_stdin_close", [this.#handle]);
							callback();
						} catch (cause) {
							callback(cause instanceof Error ? cause : new Error(String(cause)));
						}
					},
					destroy: (cause, callback) => {
						try {
							if (!this.#closed) this.#authority.call("process_stdin_close", [this.#handle]);
							callback(cause);
						} catch (failure) {
							callback(failure instanceof Error ? failure : new Error(String(failure)));
						}
					}
				}) : null;
				this.#settled = new Promise((resolve) => {
					this.#settle = resolve;
				});
				this.#schedule();
			}
			/** Whether the job reported reaching its commit limit; sticky once observed. */
			get memoryLimitReached() {
				return this.#memoryLimitReached;
			}
			/** Latest observed peak job commit; undefined for an unlimited job. */
			get peakJobMemoryBytes() {
				return this.#peakJobMemoryBytes;
			}
			/** True when cleanup destroyed a backpressured stream before all output was observed. */
			get outputIncomplete() {
				return this.#outputIncomplete;
			}
			async #writeInput(chunk) {
				const bytes = z.instanceof(Buffer).parse(chunk);
				const written = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER).parse(await this.#authority.call("process_stdin_write", [this.#handle, bytes]));
				if (written !== bytes.length) throw new Error("Owned Windows input write did not preserve all requested bytes");
			}
			/** Terminate the retained job, never a PID supplied by another caller. */
			kill(signal) {
				if (signal === 0) return !this.#closed && z.number().parse(this.#authority.call("process_alive", [this.#handle])) > 0;
				return this.#closed ? false : z.boolean().parse(this.#authority.call("process_terminate", [this.#handle]));
			}
			/** Terminate and verify that the entire job has settled before releasing it. */
			cleanup() {
				this.#cleanup ??= this.#stop().then((result) => {
					if (!result.cleaned) this.#cleanup = undefined;
					return result;
				});
				return this.#cleanup;
			}
			/** Release event-loop references so unsettled jobs do not prevent host exit. */
			unref() {
				this.#unreferenced = true;
				this.#timer?.unref();
				this.#blockedWake?.unref();
			}
			/** Restore event-loop references when retrying process lifecycle observation. */
			ref() {
				this.#unreferenced = false;
				this.#timer?.ref();
				this.#blockedWake?.ref();
			}
			async #stop() {
				if (this.#closed) return {
					cleaned: true,
					signaled: false
				};
				let timer;
				try {
					const signaled = this.kill();
					this.#discardBlockedOutput();
					this.#schedule();
					const settled = await Promise.race([this.#settled.then(() => true), new Promise((resolve) => {
						timer = setTimeout(() => resolve(false), 5e3);
					})]);
					return settled ? {
						cleaned: true,
						signaled
					} : {
						cleaned: false,
						reason: this.#failure ?? "Windows Job Object did not settle within the cleanup deadline"
					};
				} catch (cause) {
					return {
						cleaned: false,
						reason: cause instanceof Error ? cause.message : String(cause)
					};
				} finally {
					if (timer !== undefined) clearTimeout(timer);
				}
			}
			#schedule(delay = 25) {
				if (this.#closed || this.#timer !== undefined || this.#blockedOutput.size > 0) return;
				this.#timer = setTimeout(() => this.#poll(), delay);
				if (this.#unreferenced) this.#timer.unref();
			}
			#scheduleBlockedWake() {
				if (this.#closed || this.#blockedOutput.size === 0 || this.#blockedWake !== undefined) return;
				this.#blockedWake = setTimeout(() => {
					this.#blockedWake = undefined;
					this.#scheduleBlockedWake();
				}, 1e3);
				if (this.#unreferenced) this.#blockedWake.unref();
			}
			#clearBlockedWake() {
				if (this.#blockedWake !== undefined) clearTimeout(this.#blockedWake);
				this.#blockedWake = undefined;
			}
			#unblockOutput(stream) {
				if (stream.destroyed) this.#outputIncomplete = true;
				this.#blockedOutput.delete(stream);
				if (this.#blockedOutput.size === 0) this.#clearBlockedWake();
				this.#schedule(0);
			}
			#discardBlockedOutput() {
				if (this.#blockedOutput.size > 0) this.#outputIncomplete = true;
				for (const stream of this.#blockedOutput) stream.destroy();
				this.#blockedOutput.clear();
				this.#clearBlockedWake();
			}
			#poll() {
				this.#timer = undefined;
				if (this.#closed) return;
				try {
					const observed = this.#authority.call("process_poll", [this.#handle]);
					let state;
					if (this.#memoryLimitBytes === undefined) state = pollSchema.parse(observed);
					else {
						const limited = limitedPollSchema.parse(observed);
						this.#memoryLimitReached ||= limited.memoryLimitReached;
						this.#peakJobMemoryBytes = limited.peakJobMemoryBytes;
						state = limited;
					}
					this.#failure = undefined;
					const idle = state.stdout.length === 0 && state.stderr.length === 0;
					this.#writeOutput(this.stdout, state.stdout);
					this.#writeOutput(this.stderr, state.stderr);
					if (state.exitCode !== null && this.exitCode === null) {
						this.exitCode = state.exitCode;
						this.emit("exit", state.exitCode, null);
					}
					if (state.exitCode !== null && state.stdoutEnded && state.stderrEnded && state.activeProcesses === 0) {
						this.#release();
					} else this.#schedule(idle ? 25 : 0);
				} catch (cause) {
					const failure = cause instanceof Error ? cause : new Error(String(cause));
					this.#failure = failure.message;
					if (this.listenerCount("error") > 0) this.emit("error", failure);
				}
			}
			#writeOutput(stream, bytes) {
				if (bytes.length === 0 || stream.writableEnded) return;
				if (stream.destroyed) {
					this.#outputIncomplete = true;
					return;
				}
				if (stream.write(bytes)) return;
				this.#blockedOutput.add(stream);
				const unblock = () => {
					stream.off("drain", unblock);
					stream.off("close", unblock);
					this.#unblockOutput(stream);
				};
				stream.once("drain", unblock);
				stream.once("close", unblock);
				this.#scheduleBlockedWake();
			}
			#release() {
				if (this.#closed) return;
				if (this.#timer !== undefined) clearTimeout(this.#timer);
				this.#clearBlockedWake();
				this.stdin?.destroy();
				if (!this.stdout.destroyed) this.stdout.end();
				if (!this.stderr.destroyed) this.stderr.end();
				this.#authority.call("process_close", [this.#handle]);
				this.#closed = true;
				this.#settle?.();
				this.emit("close", this.exitCode, null);
			}
		};
	})))();
}

//#endregion
//#region dist/process/ProviderProcess.js
var DEFAULT_TERMINATION_GRACE_MS, DEFAULT_KILL_GRACE_MS, spawnOwnedProviderProcess, ProviderProcessSupervisor, ProcessOutputCapture, deferred, waitForSpawn, waitForProcessEvent;
function init_ProviderProcess() {
	return (init_ProviderProcess = __esmMin((() => {
		init_WindowsOwnedProcess();
		init_ProcessOwnershipObservation();
		DEFAULT_TERMINATION_GRACE_MS = 250;
		DEFAULT_KILL_GRACE_MS = 1e3;
		spawnOwnedProviderProcess = async (options) => {
			options.signal?.throwIfAborted();
			await prepareProcessOwnershipInspection(options.signal);
			options.signal?.throwIfAborted();
			const platform = options.platform ?? process.platform;
			const sweepTokenOwnedProcesses = options.sweepTokenOwnedProcesses === true && platform !== "win32";
			let captureBaseline;
			if (sweepTokenOwnedProcesses) {
				const capture = systemProcessOwnershipHost.captureBaseline;
				if (capture === undefined) throw new Error("Process ownership baseline is unavailable on this host");
				captureBaseline = await capture(options.signal);
				options.signal?.throwIfAborted();
			}
			const hostEnvironment = options.hostEnvironment ?? process.env;
			const environment = {
				...hostEnvironment,
				...options.env,
				REA_PROCESS_RUN_ID: options.runId
			};
			if (platform === "win32" && process.platform === "win32") {
				const child = new WindowsOwnedProcess(options.command, options.arguments, options.cwd, environment, options.windowsVerbatimArguments ?? false, {
					protocolStdin: options.stdin === "pipe",
					...options.memoryLimitBytes === undefined ? {} : { memoryLimitBytes: options.memoryLimitBytes }
				});
				return {
					process: child,
					ownership: {
						runId: options.runId,
						leaderPid: child.pid,
						processGroupId: child.pid,
						expectedParentPid: process.pid
					},
					cleanup: () => child.cleanup()
				};
			}
			if (options.memoryLimitBytes !== undefined) throw new Error("Owned process memory limits require the Windows Job Object launcher; no limit can be enforced on this host.");
			const child = spawn(options.command, [...options.arguments], {
				shell: false,
				windowsHide: true,
				stdio: [
					options.stdin ?? "ignore",
					"pipe",
					"pipe"
				],
				detached: platform !== "win32",
				windowsVerbatimArguments: options.windowsVerbatimArguments ?? false,
				env: environment,
				...options.cwd === undefined ? {} : { cwd: options.cwd }
			});
			await waitForSpawn(child);
			const pid = child.pid;
			if (pid === undefined) throw new Error("Provider launcher has no process ID");
			const ownership = {
				runId: options.runId,
				leaderPid: pid,
				processGroupId: pid,
				expectedParentPid: process.pid,
				...sweepTokenOwnedProcesses ? {
					sweepTokenOwnedProcesses: true,
					captureBaseline
				} : {},
				...options.expectedCommand === null ? {} : { expectedCommand: options.expectedCommand ?? options.command }
			};
			return {
				process: child,
				ownership
			};
		};
		ProviderProcessSupervisor = class {
			launch;
			#options;
			#stdout = new ProcessOutputCapture();
			#stderr = new ProcessOutputCapture();
			#exit = deferred();
			#outputClose = deferred();
			#outputClosed = false;
			#stdoutObservedBytes = 0;
			#stderrObservedBytes = 0;
			#diagnosticTruncated = false;
			#onStdout = (chunk) => {
				this.#capture("stdout", this.#stdout, chunk);
			};
			#onStderr = (chunk) => {
				this.#capture("stderr", this.#stderr, chunk);
			};
			#onStdoutError = (cause) => {
				this.#recordStreamError("stdout", cause);
			};
			#onStderrError = (cause) => {
				this.#recordStreamError("stderr", cause);
			};
			#onExit = (code, signal) => {
				this.#recordExit(code, signal);
			};
			#onClose = (code, signal) => {
				this.#recordExit(code, signal);
				this.#outputClosed = true;
				this.#outputClose.resolve(undefined);
			};
			#onError = (cause) => {
				this.#options.onDiagnostic?.({
					type: "error",
					message: cause.message
				});
			};
			#exitObservation;
			#stopPromise;
			#disposed = false;
			#maxDiagnosticBytes;
			constructor(launch, options = {}) {
				this.launch = launch;
				this.#options = options;
				this.#maxDiagnosticBytes = options.maxDiagnosticBytes;
				if (options.captureStdout !== false) this.#attach(launch.process.stdout, "stdout");
				this.#attach(launch.process.stderr, "stderr");
				launch.process.once("exit", this.#onExit);
				launch.process.once("close", this.#onClose);
				launch.process.on("error", this.#onError);
				if (launch.process.exitCode !== null || launch.process.signalCode !== null) this.#recordExit(launch.process.exitCode, launch.process.signalCode);
			}
			/**
			* Recorded process exit without concatenating retained stream diagnostics.
			* Undefined until exit or close is observed.
			*/
			observedExit() {
				const exit = this.#exitObservation;
				if (exit === undefined) return undefined;
				return {
					code: exit.code,
					signal: exit.signal
				};
			}
			/** Latest retained output and exit observation, with explicit configured truncation. */
			snapshot() {
				const outputIncomplete = this.launch.process.outputIncomplete === true;
				return {
					...this.#diagnosticTruncated || outputIncomplete ? { diagnosticTruncated: true } : {},
					stdout: this.#stdout.snapshot(this.#stdoutObservedBytes),
					stderr: this.#stderr.snapshot(this.#stderrObservedBytes),
					exitCode: this.#exitObservation?.code,
					signal: this.#exitObservation?.signal,
					...this.launch.process.memoryLimitReached === true ? { memoryLimitReached: true } : {},
					...outputIncomplete ? { outputIncomplete: true } : {}
				};
			}
			/** Begin a new observation on a retained process without retaining earlier output. */
			resetOutput() {
				this.#stdout.reset();
				this.#stderr.reset();
				this.#stdoutObservedBytes = 0;
				this.#stderrObservedBytes = 0;
				this.#diagnosticTruncated = false;
			}
			/** Wait for process exit up to a caller-owned bounded interval. */
			async waitForExit(timeoutMs) {
				return waitForProcessEvent(this.#exitObservation !== undefined, this.#exit.promise, timeoutMs);
			}
			/** Wait until output streams close; WindowsOwnedProcess closes only after its whole Job Object settles. */
			async waitForOutputClose(timeoutMs) {
				return waitForProcessEvent(this.#outputClosed, this.#outputClose.promise, timeoutMs);
			}
			/** Bound additional retained bytes while still draining all later output. */
			limitAdditionalOutputBytes(maxBytes) {
				if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new RangeError("Additional output limit must be a non-negative safe integer.");
				const retained = this.#stdout.bytes + this.#stderr.bytes;
				const requestedLimit = Math.min(Number.MAX_SAFE_INTEGER, retained + maxBytes);
				this.#maxDiagnosticBytes = this.#maxDiagnosticBytes === undefined ? requestedLimit : Math.min(this.#maxDiagnosticBytes, requestedLimit);
			}
			/** Unreference inherited output pipes without closing streams shared with descendants. */
			unrefOutputStreams() {
				for (const stream of [this.launch.process.stdout, this.launch.process.stderr]) {
					const unref = stream?.unref;
					unref?.call(stream);
				}
			}
			/** Share each stop attempt; incomplete cleanup retains ownership and permits retry. */
			stop(options = {}) {
				this.#stopPromise ??= this.#stop(options).then((result) => {
					if (result.status === "incomplete") this.#stopPromise = undefined;
					return result;
				});
				return this.#stopPromise;
			}
			/** Detach capture and process listeners after an adapter releases ownership. */
			dispose() {
				if (this.#disposed) return;
				this.#disposed = true;
				this.launch.process.stdout?.off("data", this.#onStdout);
				this.launch.process.stdout?.off("error", this.#onStdoutError);
				this.launch.process.stderr?.off("data", this.#onStderr);
				this.launch.process.stderr?.off("error", this.#onStderrError);
				this.launch.process.off("exit", this.#onExit);
				this.launch.process.off("close", this.#onClose);
				this.launch.process.off("error", this.#onError);
			}
			/** Release event-loop references so incomplete cleanup does not prevent host exit. */
			unref() {
				const process = this.launch.process;
				process.unref?.();
				process.stdin?.unref?.();
				process.stdout?.unref?.();
				process.stderr?.unref?.();
			}
			/** Restore event-loop references when retrying supervised process cleanup. */
			ref() {
				const process = this.launch.process;
				process.ref?.();
				process.stdin?.ref?.();
				process.stdout?.ref?.();
				process.stderr?.ref?.();
			}
			async #stop(options) {
				this.ref();
				let completed = false;
				try {
					const result = await this.#stopWithin(options);
					completed = result.status !== "incomplete";
					if (!completed) this.unref();
					return result;
				} finally {
					if (completed) this.dispose();
				}
			}
			async #stopWithin(options) {
				try {
					if (!this.launch.ownsProcessLifetime) return { status: "not-owned" };
					if (this.launch.cleanup !== undefined) {
						const cleanup = await this.#ownedCleanup(options.cleanupResult);
						if (!cleanup.cleaned) return {
							status: "incomplete",
							reason: cleanup.reason,
							cleanupResult: cleanup
						};
						const graceMs = options.killGraceMs ?? DEFAULT_KILL_GRACE_MS;
						if (await this.waitForExit(graceMs)) return { status: "verified-cleanup" };
						const retried = await this.launch.cleanup();
						if (!retried.cleaned) return {
							status: "incomplete",
							reason: retried.reason,
							cleanupResult: retried
						};
						if (await this.waitForExit(graceMs)) return { status: "verified-cleanup" };
						return {
							status: "incomplete",
							reason: "verified process-group cleanup did not stop the launcher"
						};
					}
					if (this.#exitObservation !== undefined) return { status: "already-exited" };
					this.#signal("SIGTERM");
					if (await this.waitForExit(options.terminationGraceMs ?? DEFAULT_TERMINATION_GRACE_MS)) return { status: "terminated" };
					this.#signal("SIGKILL");
					if (await this.waitForExit(options.killGraceMs ?? DEFAULT_KILL_GRACE_MS)) return { status: "killed" };
					return {
						status: "incomplete",
						reason: "owned provider process did not exit after SIGKILL"
					};
				} catch (cause) {
					return {
						status: "incomplete",
						reason: cause instanceof Error ? cause.message : "owned provider process cleanup failed"
					};
				}
			}
			#ownedCleanup(supplied) {
				if (supplied !== undefined) return Promise.resolve(supplied);
				const cleanup = this.launch.cleanup;
				return cleanup === undefined ? Promise.resolve({
					cleaned: false,
					reason: "owned provider process has no cleanup capability"
				}) : cleanup();
			}
			#signal(signal) {
				if (this.#exitObservation !== undefined) return;
				this.launch.process.kill(signal);
			}
			#attach(stream, name) {
				if (name === "stdout") {
					stream?.on("data", this.#onStdout);
					stream?.on("error", this.#onStdoutError);
				} else {
					stream?.on("data", this.#onStderr);
					stream?.on("error", this.#onStderrError);
				}
			}
			#recordStreamError(stream, cause) {
				this.#options.onDiagnostic?.({
					type: "error",
					message: `${stream} stream failed: ${cause.message}`
				});
			}
			#capture(stream, capture, chunk) {
				const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				if (stream === "stdout") this.#stdoutObservedBytes += bytes.byteLength;
				else this.#stderrObservedBytes += bytes.byteLength;
				const remaining = this.#maxDiagnosticBytes === undefined ? bytes.byteLength : Math.max(0, this.#maxDiagnosticBytes - this.#stdout.bytes - this.#stderr.bytes);
				const retained = Math.min(bytes.byteLength, remaining);
				if (retained < bytes.byteLength) this.#diagnosticTruncated = true;
				if (retained > 0) capture.append(bytes.subarray(0, retained));
				this.#options.onDiagnostic?.({
					type: "output",
					stream,
					bytes: bytes.byteLength,
					totalBytes: stream === "stdout" ? this.#stdoutObservedBytes : this.#stderrObservedBytes,
					...retained < bytes.byteLength ? { truncated: true } : {}
				});
			}
			#recordExit(code, signal) {
				if (this.#exitObservation !== undefined) return;
				this.#exitObservation = {
					code,
					signal
				};
				this.#exit.resolve(this.#exitObservation);
				this.#options.onDiagnostic?.({
					type: "exit",
					code,
					signal,
					snapshot: this.snapshot()
				});
			}
		};
		ProcessOutputCapture = class {
			#chunks = [];
			#bytes = 0;
			get bytes() {
				return this.#bytes;
			}
			reset() {
				this.#chunks.length = 0;
				this.#bytes = 0;
			}
			append(chunk) {
				this.#bytes += chunk.byteLength;
				this.#chunks.push(Buffer.from(chunk));
			}
			snapshot(observedBytes) {
				const buffer = Buffer.concat(this.#chunks, this.#bytes);
				const text = buffer.toString("utf8");
				let invalidUtf8 = false;
				try {
					new TextDecoder("utf-8", { fatal: true }).decode(buffer);
				} catch {
					invalidUtf8 = true;
				}
				return {
					text,
					bytes: this.#bytes,
					observedBytes,
					...invalidUtf8 ? { invalidUtf8: true } : {}
				};
			}
		};
		deferred = () => {
			let resolver;
			const promise = new Promise((resolve) => {
				resolver = resolve;
			});
			return {
				promise,
				resolve: (value) => {
					resolver?.(value);
				}
			};
		};
		waitForSpawn = (child) => new Promise((resolve, reject) => {
			const onSpawn = () => {
				child.off("error", onError);
				resolve();
			};
			const onError = (cause) => {
				child.off("spawn", onSpawn);
				reject(cause);
			};
			child.once("spawn", onSpawn);
			child.once("error", onError);
		});
		waitForProcessEvent = async (observed, event, timeoutMs) => {
			if (observed) return true;
			let timer;
			try {
				return await Promise.race([event.then(() => true), new Promise((resolve) => {
					timer = setTimeout(() => resolve(false), Math.max(0, timeoutMs));
				})]);
			} finally {
				if (timer !== undefined) clearTimeout(timer);
			}
		};
	})))();
}

//#endregion
//#region dist/process/snapshotEnvironment.js
var snapshotEnvironment;
function init_snapshotEnvironment() {
	return (init_snapshotEnvironment = __esmMin((() => {
		snapshotEnvironment = (environment, platform = process.platform) => {
			if (platform !== "win32") return Object.freeze({ ...environment });
			const snapshot = {};
			for (const key of Object.keys(environment).sort()) {
				const canonicalKey = key.toUpperCase();
				if (!Object.hasOwn(snapshot, canonicalKey)) snapshot[canonicalKey] = environment[key];
			}
			return Object.freeze(snapshot);
		};
	})))();
}

//#endregion
export { ProviderProcessSupervisor, init_ProviderProcess, init_WindowsNativeLoader, init_snapshotEnvironment, requireWindowsNativeAuthority, snapshotEnvironment, spawnOwnedProviderProcess, systemWindowsNativeAuthority, windowsFileIdentitySchema, windowsHandleSchema };