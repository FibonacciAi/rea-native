import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { c as requireWindowsNativeAuthority, d as windowsHandleSchema, l as systemWindowsNativeAuthority, s as init_WindowsNativeLoader, u as windowsFileIdentitySchema } from "./ProviderDeadline-DskQ94YD.js";
import { Xt as NATIVE_TOOL_CONTRACTS, Zt as init_nativeToolContracts } from "./toolContracts-BW05wpcr.js";
import { join, win32 } from "node:path";
import { z } from "zod";
import { tmpdir } from "node:os";
import { mkdtemp, rm } from "node:fs/promises";

//#region dist/process/PrivateRuntimeRootUnavailableError.js
var PrivateRuntimeRootUnavailableError;
function init_PrivateRuntimeRootUnavailableError() {
	return (init_PrivateRuntimeRootUnavailableError = __esmMin((() => {
		PrivateRuntimeRootUnavailableError = class extends Error {
			code = "private-runtime-root-authority-unavailable";
			retryable;
			constructor(message, options) {
				super(message, options);
				this.name = "PrivateRuntimeRootUnavailableError";
				this.retryable = options?.retryable ?? false;
			}
		};
	})))();
}

//#endregion
//#region dist/windows/WindowsPrivateRuntime.js
var runtimeSchema, snapshotSchema, fileSchema, runtimes, transientRuntimeAdmissionSchema, WindowsPrivateRuntime, windowsRuntimeIdentityKey, windowsPrivateRuntime, readWindowsPrivateRuntimeFile;
function init_WindowsPrivateRuntime() {
	return (init_WindowsPrivateRuntime = __esmMin((() => {
		init_PrivateRuntimeRootUnavailableError();
		init_WindowsNativeLoader();
		runtimeSchema = windowsFileIdentitySchema.extend({
			path: z.string(),
			handle: windowsHandleSchema,
			privateDacl: z.literal(true)
		});
		snapshotSchema = z.strictObject({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			source: windowsFileIdentitySchema,
			snapshot: windowsFileIdentitySchema
		});
		fileSchema = windowsFileIdentitySchema.extend({ handle: windowsHandleSchema });
		runtimes = new Map();
		transientRuntimeAdmissionSchema = z.object({
			code: z.literal("ERR_REA_WINDOWS_NATIVE"),
			win32Code: z.union([z.literal(32), z.literal(33)]),
			runtimeAllocation: z.literal("not-started")
		});
		WindowsPrivateRuntime = class WindowsPrivateRuntime {
			observation;
			authority;
			#pending;
			#closed = false;
			#closePromise;
			constructor(observation, authority) {
				this.observation = observation;
				this.authority = authority;
			}
			/** Create a new directory with its private DACL installed at creation. */
			static create(parent, prefix) {
				const authority = requireWindowsNativeAuthority();
				let observed;
				try {
					observed = authority.call("runtime_create", [parent, prefix]);
				} catch (cause) {
					if (cause instanceof Error && transientRuntimeAdmissionSchema.safeParse(cause).success) throw new PrivateRuntimeRootUnavailableError(cause.message, {
						cause,
						retryable: true
					});
					throw cause;
				}
				const observation = runtimeSchema.parse(observed);
				const runtime = new WindowsPrivateRuntime(observation, authority);
				runtimes.set(windowsRuntimeIdentityKey(observation), runtime);
				return runtime;
			}
			/** Open a private child directory through retained, verified parent handles. */
			mkdir(relativePath) {
				this.authority.call("runtime_mkdir", [this.observation.handle, relativePath]);
			}
			/** Write a new private file once and retain its immutable handle. */
			writeFile(relativePath, content) {
				this.authority.call("runtime_write", [
					this.observation.handle,
					relativePath,
					Buffer.from(content)
				]);
			}
			/** Copy admitted source bytes and digest the bytes actually written. */
			async snapshot(sourcePath, relativePath, signal) {
				const pending = Promise.resolve(this.authority.call("runtime_snapshot", [
					this.observation.handle,
					sourcePath,
					relativePath
				]));
				this.#pending = pending;
				const cancel = () => {
					this.authority.call("runtime_snapshot_cancel", [this.observation.handle]);
				};
				signal?.addEventListener("abort", cancel, { once: true });
				if (signal?.aborted === true) cancel();
				try {
					return snapshotSchema.parse(await pending);
				} finally {
					signal?.removeEventListener("abort", cancel);
					if (this.#pending === pending) this.#pending = undefined;
				}
			}
			/** Read a private endpoint from an opened file, without re-opening its path. */
			readFile(relativePath) {
				const file = fileSchema.parse(this.authority.call("runtime_open", [this.observation.handle, relativePath]));
				try {
					const chunks = [];
					for (let offset = 0; offset < file.size;) {
						const value = z.instanceof(Buffer).parse(this.authority.call("read", [
							file.handle,
							offset,
							Math.min(65536, file.size - offset)
						]));
						if (value.length === 0) throw new Error("Private runtime file ended before its observed size");
						offset += value.length;
						chunks.push(value);
					}
					return Buffer.concat(chunks).toString("utf8");
				} finally {
					this.authority.call("close", [file.handle]);
				}
			}
			/** Remove owned objects by handle, unlinking reparse entries without traversal. */
			close() {
				this.#closePromise ??= this.#remove().catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
			async #remove() {
				if (this.#closed) return;
				if (this.#pending !== undefined) this.authority.call("runtime_snapshot_cancel", [this.observation.handle]);
				await this.#pending?.catch(() => undefined);
				this.authority.call("runtime_close", [this.observation.handle]);
				this.#closed = true;
				runtimes.delete(windowsRuntimeIdentityKey(this.observation));
			}
		};
		windowsRuntimeIdentityKey = (identity) => `${identity.volumeSerial}:${identity.fileId}`;
		windowsPrivateRuntime = (rootPath) => {
			const matches = [...runtimes.values()].filter((runtime) => runtime.observation.finalPath === rootPath || runtime.observation.path === rootPath);
			const runtime = matches[0];
			if (matches.length !== 1 || runtime === undefined) throw new Error(`No native private runtime owns ${rootPath}`);
			return runtime;
		};
		readWindowsPrivateRuntimeFile = (path) => {
			const parent = win32.dirname(path);
			return windowsPrivateRuntime(parent).readFile(win32.basename(path));
		};
	})))();
}

//#endregion
//#region dist/process/WindowsAuthority.js
var WINDOWS_NATIVE_AUTHORITY_UNAVAILABLE_REASON, inspectWindowsNativeReadiness, windowsNativeCapabilities;
function init_WindowsAuthority() {
	return (init_WindowsAuthority = __esmMin((() => {
		init_WindowsNativeLoader();
		WINDOWS_NATIVE_AUTHORITY_UNAVAILABLE_REASON = "Windows native controls are unavailable in this runtime; use the Windows x64 REA package with its matching bundled native artifact.";
		inspectWindowsNativeReadiness = (platform, observation) => {
			if (platform !== "win32") return {
				available: false,
				failureStage: "host",
				reason: "Windows native authority is not applicable on this host",
				proof: "not-applicable",
				code: "unsupported_host",
				remediation: "Use a Windows x64 host for Windows native controls."
			};
			const loaded = observation ?? systemWindowsNativeAuthority();
			if (loaded.available) return { available: true };
			const failureStage = loaded.failureStage;
			return {
				available: false,
				failureStage,
				reason: loaded.reason,
				...loaded.retryable === true ? { retryable: true } : {},
				proof: "not-proven",
				code: failureStage === "host" ? "unsupported_host" : failureStage === "artifact" ? "runtime_missing" : "runtime_unavailable",
				remediation: failureStage === "host" ? "Use a Windows x64 host and a supported Node.js runtime with Node-API 8 or newer." : failureStage === "artifact" ? "Install the matching Windows x64 REA package with its bundled native addon; check the reported artifact load or integrity failure." : failureStage === "inspection" ? "Install the matching Windows x64 REA package; its native inspection must prove every required security control." : "Inspect the preserved native self-test error. Check that the process's temporary directory is writable local NTFS and that its filesystem, DACL, Job Object, and cleanup operations are permitted. Resolve the reported constraint, then rerun rea doctor; reinstalling Ghidra or Java cannot fix this self-test."
			};
		};
		windowsNativeCapabilities = (platform, readiness = inspectWindowsNativeReadiness(platform)) => {
			const capability = readiness.available ? {
				available: true,
				reason: null,
				proof: "native-authority"
			} : {
				available: false,
				reason: readiness.reason,
				proof: readiness.proof,
				code: readiness.code,
				failureStage: readiness.failureStage,
				remediation: readiness.remediation,
				...readiness.retryable === true ? { retryable: true } : {}
			};
			return {
				job_object_process_ownership: capability,
				private_runtime_dacl: capability,
				reparse_safe_path_admission: capability
			};
		};
	})))();
}

//#endregion
//#region dist/process/PrivateRuntimeRoot.js
var privateRuntimeRootCapability, PrivateRuntimeRoot;
function init_PrivateRuntimeRoot() {
	return (init_PrivateRuntimeRoot = __esmMin((() => {
		init_WindowsPrivateRuntime();
		init_PrivateRuntimeRootUnavailableError();
		init_WindowsAuthority();
		privateRuntimeRootCapability = (platform = process.platform) => platform === "win32" ? windowsNativeCapabilities(platform).private_runtime_dacl : {
			available: true,
			reason: null,
			proof: "posix-mkdtemp-owner-only"
		};
		PrivateRuntimeRoot = class PrivateRuntimeRoot {
			path;
			windowsRuntime;
			#closePromise;
			constructor(path, windowsRuntime) {
				this.path = path;
				this.windowsRuntime = windowsRuntime;
			}
			/** Allocate a new private runtime root without performing protocol work. */
			static async create(options = {}) {
				const platform = options.platform ?? process.platform;
				const capability = privateRuntimeRootCapability(platform);
				if (!capability.available) throw new PrivateRuntimeRootUnavailableError(capability.reason, { retryable: capability.retryable === true });
				if (platform === "win32") {
					const runtime = WindowsPrivateRuntime.create(options.parent ?? tmpdir(), options.prefix ?? "rea-provider-");
					return new PrivateRuntimeRoot(runtime.observation.path, runtime);
				}
				const path = await mkdtemp(join(options.parent ?? tmpdir(), options.prefix ?? "rea-provider-"));
				return new PrivateRuntimeRoot(path);
			}
			/**
			* Remove the runtime root; concurrent callers share one attempt. A failed
			* attempt is not cached, so a later close retries the removal.
			*/
			close() {
				this.#closePromise ??= (this.windowsRuntime === undefined ? rm(this.path, {
					recursive: true,
					force: true
				}) : Promise.resolve().then(() => this.windowsRuntime?.close())).catch((cause) => {
					this.#closePromise = undefined;
					throw cause;
				});
				return this.#closePromise;
			}
		};
	})))();
}

//#endregion
//#region dist/native/NativeMacOSProviderMetadata.js
var NATIVE_MACOS_PROVIDER_IDENTITY, OWNED_PROCESS_OPERATIONS, nativeMacOSCapabilities;
function init_NativeMacOSProviderMetadata() {
	return (init_NativeMacOSProviderMetadata = __esmMin((() => {
		init_nativeToolContracts();
		NATIVE_MACOS_PROVIDER_IDENTITY = Object.freeze({
			id: "native-macos",
			name: "macOS native inspection utilities",
			version: null
		});
		OWNED_PROCESS_OPERATIONS = new Set(["capture_native_ui_scenario", "observe_native_calls"]);
		nativeMacOSCapabilities = (platform = process.platform) => {
			const available = platform === "darwin";
			return Object.freeze([...NATIVE_TOOL_CONTRACTS, { name: "inspect_native_dispatch_metadata" }].map((contract) => {
				const availability = available ? {
					available: true,
					reason: null
				} : {
					available: false,
					availabilityCode: "unsupported_host",
					reason: "Native macOS utilities require macOS."
				};
				return Object.freeze({
					provider: NATIVE_MACOS_PROVIDER_IDENTITY,
					operation: contract.name,
					...availability,
					effects: Object.freeze({
						mutatesArtifact: false,
						launchesProcess: contract.name !== "inspect_native_dispatch_metadata",
						mayShowUi: OWNED_PROCESS_OPERATIONS.has(contract.name),
						mayAccessNetwork: OWNED_PROCESS_OPERATIONS.has(contract.name),
						mayWriteFilesystem: OWNED_PROCESS_OPERATIONS.has(contract.name) || contract.name === "observe_native_ui",
						changesPermissions: false,
						requiresRoot: false
					}),
					limitations: Object.freeze(["Availability and textual formats depend on the installed macOS/Xcode toolchain."])
				});
			}));
		};
	})))();
}

//#endregion
export { init_PrivateRuntimeRoot as a, inspectWindowsNativeReadiness as c, readWindowsPrivateRuntimeFile as d, windowsPrivateRuntime as f, PrivateRuntimeRoot as i, windowsNativeCapabilities as l, init_PrivateRuntimeRootUnavailableError as m, init_NativeMacOSProviderMetadata as n, privateRuntimeRootCapability as o, PrivateRuntimeRootUnavailableError as p, nativeMacOSCapabilities as r, init_WindowsAuthority as s, NATIVE_MACOS_PROVIDER_IDENTITY as t, init_WindowsPrivateRuntime as u };