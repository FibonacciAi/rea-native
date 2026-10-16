import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_snapshotEnvironment, snapshotEnvironment } from "./snapshotEnvironment-D_tWyOub.js";
import { win32 } from "node:path";

//#region dist/process/PendingOperations.js
var PendingOperations;
function init_PendingOperations() {
	return (init_PendingOperations = __esmMin((() => {
		PendingOperations = class {
			#pending = new Map();
			/** Number of currently correlated operations. */
			get size() {
				return this.#pending.size;
			}
			/** Return whether an operation key is awaiting a protocol reply. */
			has(key) {
				return this.#pending.has(key);
			}
			/** Register one unique operation key and await its reply or cancellation. */
			wait(key, options) {
				if (this.#pending.has(key)) throw new Error("Pending operation key is already registered");
				if (options.signal?.aborted === true) return Promise.resolve(options.cancelledValue());
				return new Promise((resolve) => {
					const onAbort = options.signal === undefined ? undefined : () => this.#finish(key, options.cancelledValue());
					const timer = options.timeoutMs === undefined ? undefined : setTimeout(() => this.#finish(key, options.timeoutValue()), options.timeoutMs);
					this.#pending.set(key, {
						resolve,
						timer,
						signal: options.signal,
						onAbort
					});
					if (onAbort !== undefined) options.signal?.addEventListener("abort", onAbort, { once: true });
				});
			}
			/** Settle one correlated reply; returns false for late or unknown keys. */
			settle(key, value) {
				return this.#finish(key, value);
			}
			/** Fail every active operation while releasing all timers and listeners. */
			failAll(valueFor) {
				for (const key of this.#pending.keys()) this.#finish(key, valueFor(key));
			}
			#finish(key, value) {
				const pending = this.#pending.get(key);
				if (pending === undefined) return false;
				this.#pending.delete(key);
				if (pending.timer !== undefined) clearTimeout(pending.timer);
				if (pending.signal !== undefined && pending.onAbort !== undefined) pending.signal.removeEventListener("abort", pending.onAbort);
				pending.resolve(value);
				return true;
			}
		};
	})))();
}

//#endregion
//#region dist/process/WindowsBatchCommand.js
var WindowsBatchCommandError, isWindowsBatchFile, quoteWindowsBatchToken, windowsBatchCommand;
function init_WindowsBatchCommand() {
	return (init_WindowsBatchCommand = __esmMin((() => {
		init_snapshotEnvironment();
		WindowsBatchCommandError = class extends Error {
			reason;
			constructor(reason, message) {
				super(message);
				this.reason = reason;
				this.name = "WindowsBatchCommandError";
			}
		};
		isWindowsBatchFile = (command) => /\.(?:bat|cmd)$/iu.test(command);
		quoteWindowsBatchToken = (value) => {
			if (value.length === 0 || value.includes("\0") || value.includes("\r") || value.includes("\n") || /["%^!&|<>]/u.test(value)) throw new WindowsBatchCommandError("metacharacter", "Windows batch arguments cannot contain command-interpreter metacharacters");
			return `"${value}"`;
		};
		windowsBatchCommand = (options) => {
			const environment = snapshotEnvironment(options.environment, "win32");
			const systemRoot = environment.SYSTEMROOT;
			const comSpec = options.comSpec ?? environment.COMSPEC ?? (systemRoot === undefined ? "C:\\Windows\\System32\\cmd.exe" : win32.join(systemRoot, "System32", "cmd.exe"));
			if (!win32.isAbsolute(comSpec) || win32.basename(comSpec).toLowerCase() !== "cmd.exe") throw new WindowsBatchCommandError("invalid_comspec", "Windows ComSpec must be an absolute cmd.exe path");
			const tokens = [options.batchPath, ...options.arguments].map(quoteWindowsBatchToken);
			return {
				command: comSpec,
				arguments: [
					"/d",
					"/e:on",
					"/v:off",
					"/s",
					"/c",
					`"${tokens.join(" ")}"`
				]
			};
		};
	})))();
}

//#endregion
//#region dist/process/AbortablePromise.js
var ABORTED, waitForAbortable;
function init_AbortablePromise() {
	return (init_AbortablePromise = __esmMin((() => {
		ABORTED = Symbol("aborted");
		waitForAbortable = async (pending, signal) => {
			if (signal === undefined) return pending;
			let onAbort;
			const cancelled = new Promise((resolve) => {
				if (signal.aborted) {
					resolve(ABORTED);
					return;
				}
				onAbort = () => resolve(ABORTED);
				signal.addEventListener("abort", onAbort, { once: true });
			});
			try {
				return await Promise.race([cancelled, pending]);
			} finally {
				if (onAbort !== undefined) signal.removeEventListener("abort", onAbort);
			}
		};
	})))();
}

//#endregion
export { ABORTED, PendingOperations, WindowsBatchCommandError, init_AbortablePromise, init_PendingOperations, init_WindowsBatchCommand, isWindowsBatchFile, quoteWindowsBatchToken, waitForAbortable, windowsBatchCommand };