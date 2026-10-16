import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, g as init_result, h as err } from "./analysisErrorCore-DXRTvF_m.js";
import { E as init_configurationErrors, w as ConfigurationError } from "./analysisErrorProjection-BN0EPM-3.js";
import { z } from "zod";
import pino from "pino";

//#region dist/logger.js
var logLevelSchema, parseLogLevel, createLogger, silentLogger;
function init_logger() {
	return (init_logger = __esmMin((() => {
		init_configurationErrors();
		init_result();
		logLevelSchema = z.enum([
			"trace",
			"debug",
			"info",
			"warn",
			"error",
			"fatal",
			"silent"
		]).default("info");
		parseLogLevel = (value) => {
			const parsed = logLevelSchema.safeParse(value);
			if (parsed.success) return ok(parsed.data);
			return err(new ConfigurationError("Invalid REA environment configuration", {
				cause: parsed.error,
				settings: parsed.error.issues.map(({ message }) => ({
					setting: "REA_LOG_LEVEL",
					constraint: message
				}))
			}));
		};
		createLogger = (mode, level) => pino({
			level,
			base: {
				application: "rea",
				mode
			}
		}, pino.destination({
			dest: 2,
			sync: false
		}));
		silentLogger = pino({ level: "silent" });
	})))();
}

//#endregion
export { init_logger as n, silentLogger as r, createLogger as t };