import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { createEvidence, digestCanonicalValue, err, init_canonicalDigest, init_evidence, init_result, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisCapabilityUnavailableError, AnalysisInputError, init_analysisErrorCore, init_jsonValue, jsonObjectSchema, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { dirname } from "node:path";
import { access, realpath, stat } from "node:fs/promises";
import { constants } from "node:fs";

//#region dist/application/javascript/ElectronActiveEvidence.js
var createElectronActiveEvidence, parameters;
function init_ElectronActiveEvidence() {
	return (init_ElectronActiveEvidence = __esmMin((() => {
		init_canonicalDigest();
		init_evidence();
		init_jsonValue();
		createElectronActiveEvidence = (input, result, provider) => createEvidence(undefined, provider, {
			predicateType: "rea.electron-active-scenario",
			operation: "capture_electron_scenario",
			parameters: parameters(input),
			result: jsonValueSchema.parse(result),
			confidence: "observed",
			authority: "controlled-replay",
			environment: {
				id: `${result.application.electron_version}@unknown`,
				platform: "unknown",
				architecture: "unknown",
				isolation: "none"
			},
			limitations: [...result.limitations, "Application host platform and architecture were not observed."]
		});
		parameters = (input) => {
			const scenario = jsonObjectSchema.parse(input);
			return {
				...scenario,
				scenario_sha256: digestCanonicalValue(scenario, "Electron scenario")
			};
		};
	})))();
}

//#endregion
//#region dist/application/javascript/ElectronActiveObservationService.js
var OPERATION, PROVIDER_ID, resolveInputPath, resolveExecutablePath, canonicalizeInput, captureElectronScenario;
function init_ElectronActiveObservationService() {
	return (init_ElectronActiveObservationService = __esmMin((() => {
		init_analysisErrorCore();
		init_result();
		init_ElectronActiveEvidence();
		OPERATION = "capture_electron_scenario";
		PROVIDER_ID = "rea-playwright-electron-active";
		resolveInputPath = async (field, selected) => {
			try {
				return ok(await realpath(selected));
			} catch (cause) {
				return err({
					issue: {
						path: [field],
						reason: "invalid_value",
						message: `Cannot resolve ${field} ${selected}: ${cause instanceof Error ? cause.message : String(cause)}`
					},
					cause
				});
			}
		};
		resolveExecutablePath = async (selected) => {
			const resolved = await resolveInputPath("executable_path", selected);
			if (!resolved.ok) return resolved;
			try {
				if (!(await stat(resolved.value)).isFile()) throw new Error("not a regular file");
				if (process.platform !== "win32") await access(resolved.value, constants.X_OK);
				return resolved;
			} catch (cause) {
				return err({
					issue: {
						path: ["executable_path"],
						reason: "invalid_value",
						message: `executable_path ${selected} is not an executable file: ${cause instanceof Error ? cause.message : String(cause)}`
					},
					cause
				});
			}
		};
		canonicalizeInput = async (input) => {
			const [executable, application, root] = await Promise.all([
				resolveExecutablePath(input.executable_path),
				resolveInputPath("application_path", input.application_path),
				input.application_root === undefined ? Promise.resolve(ok(undefined)) : resolveInputPath("application_root", input.application_root)
			]);
			if (!executable.ok || !application.ok || !root.ok) {
				const failures = [
					executable,
					application,
					root
				].flatMap((result) => result.ok ? [] : [result.error]);
				return err(new AnalysisInputError(OPERATION, { cause: new AggregateError(failures.map(({ cause }) => cause), "Electron paths could not be resolved") }, failures.map(({ issue }) => issue)));
			}
			return ok({
				...input,
				executable_path: executable.value,
				application_path: application.value,
				application_root: root.value ?? dirname(application.value)
			});
		};
		captureElectronScenario = async (provider, input, options = {}) => {
			const canonical = await canonicalizeInput(input);
			if (!canonical.ok) return canonical;
			if (provider === undefined) return err(new AnalysisCapabilityUnavailableError(PROVIDER_ID, OPERATION, "active Electron observation provider is not configured"));
			const captured = await provider.capture(canonical.value, options);
			return captured.ok ? {
				ok: true,
				value: createElectronActiveEvidence(canonical.value, captured.value, provider.identity())
			} : captured;
		};
	})))();
}

//#endregion
init_ElectronActiveObservationService();
export { captureElectronScenario };