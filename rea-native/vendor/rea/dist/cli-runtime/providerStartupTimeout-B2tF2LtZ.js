import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { z } from "zod";

//#region dist/config/providerStartupTimeout.js
var DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS, DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, MAX_TIMER_DELAY_MS, providerStartupTimeoutSchema;
function init_providerStartupTimeout() {
	return (init_providerStartupTimeout = __esmMin((() => {
		DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS = 33e4;
		DEFAULT_HOPPER_STARTUP_TIMEOUT_MS = 12e4;
		DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS = 12e4;
		MAX_TIMER_DELAY_MS = 2147483647;
		providerStartupTimeoutSchema = z.string().regex(/^[1-9]\d*$/u, "must be a positive decimal integer").transform(Number).pipe(z.number().int().min(1).max(MAX_TIMER_DELAY_MS));
	})))();
}

//#endregion
export { DEFAULT_GHIDRA_STARTUP_TIMEOUT_MS, DEFAULT_HOPPER_STARTUP_TIMEOUT_MS, DEFAULT_SWIFTC_COMPILE_TIMEOUT_MS, init_providerStartupTimeout, providerStartupTimeoutSchema };