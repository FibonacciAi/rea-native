import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { PRODUCT_IDENTITY, err, init_identity, init_result, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { ArtifactResourceScope, init_ArtifactResourceScope } from "./ArtifactResourceScope-DQWTcUwE.js";
import { init_safeJson, safeParseJson } from "./safeJson-DKKACtdy.js";
import { homeDirectoryFromEnvironment, init_ClientRegistrationIdentity, init_homeDirectory, isOwnedClientRegistrationCommand, withoutPackageRunnerIdentity } from "./SupportedClients-DaX6Lt2d.js";
import { existingSkillDestinations, init_SetupSkill } from "./ClientConfigurationDocument-ffQ9X0Se.js";
import { init_ClientRegistrationStatus, readClientRegistrationInspections } from "./ClientRegistrationStatus-DszCyPEU.js";
import { init_Update, updateInstallCommand } from "./Update-CbTC_eg1.js";
import { z } from "zod";
import { basename, dirname, join, resolve } from "node:path";
import { realpath, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { lt, valid } from "semver";
import spawn from "cross-spawn";

//#region dist/application/UpdateMaintenance.js
var setupPlanSchema, existingMaintenanceScope, planIntegrationMaintenance;
function init_UpdateMaintenance() {
	return (init_UpdateMaintenance = __esmMin((() => {
		init_ClientRegistrationIdentity();
		init_ClientRegistrationStatus();
		init_SetupSkill();
		setupPlanSchema = z.object({
			status: z.literal("planned"),
			plannedActions: z.array(z.object({
				id: z.string(),
				kind: z.enum(["configure_client", "install_skill"]),
				label: z.string(),
				target: z.string(),
				detail: z.string(),
				external: z.literal(false),
				operation: z.enum([
					"create",
					"update",
					"install"
				]),
				backupPath: z.string().optional(),
				commands: z.array(z.string()).optional()
			}))
		});
		existingMaintenanceScope = async (home, entryPoint, environment, resources) => {
			const registrations = await readClientRegistrationInspections(home, entryPoint, {
				environment,
				...resources === undefined ? {} : { resources }
			});
			const clients = [];
			for (const { status: registration, activation } of registrations) {
				if (activation !== "enabled" || registration.state !== "aligned" && registration.state !== "stale" || !isOwnedClientRegistrationCommand(registration.command, entryPoint)) continue;
				clients.push(registration.client);
			}
			const skillDestinations = await existingSkillDestinations(home, environment, process.platform, resources);
			return {
				clients,
				skill: skillDestinations.length > 0,
				skillDestinations
			};
		};
		planIntegrationMaintenance = async (home, entryPoint, environment, execute, resources) => {
			try {
				const scope = await existingMaintenanceScope(home, entryPoint, environment, resources);
				const skillDestinations = scope.skillDestinations ?? [];
				if (scope.clients.length === 0 && !scope.skill) return {
					status: "current",
					plannedActions: []
				};
				const command = [
					process.execPath,
					entryPoint,
					"setup",
					...scope.clients.flatMap((client) => ["--client", client]),
					...skillDestinations.flatMap(({ client }) => ["--skill-client", client]),
					`--skill=${String(scope.skill)}`
				];
				const execution = await execute([
					...command,
					"--dry-run",
					"--json"
				]);
				if (!execution.ok) return {
					status: "unavailable",
					remediation: execution.error
				};
				const plan = setupPlanSchema.safeParse(JSON.parse(execution.value));
				if (!plan.success) return {
					status: "unavailable",
					remediation: `The updated setup executable returned an invalid maintenance plan: ${plan.error.message}`
				};
				if (plan.data.plannedActions.length === 0) return {
					status: "current",
					plannedActions: []
				};
				const allowedIds = new Set(scope.clients.map((client) => `configure_client:${client}`));
				const skillTargets = new Set(skillDestinations.map(({ path }) => path));
				if (plan.data.plannedActions.some((action) => action.kind === "install_skill" ? !skillTargets.has(action.target) : !allowedIds.has(action.id))) return {
					status: "unavailable",
					remediation: "The updated setup plan included an integration outside the existing REA maintenance scope."
				};
				return {
					status: "planned",
					scope,
					command,
					plannedActions: plan.data.plannedActions.map(({ backupPath, commands, ...action }) => ({
						...action,
						...backupPath === undefined ? {} : { backupPath },
						...commands === undefined ? {} : { commands }
					}))
				};
			} catch (cause) {
				return {
					status: "unavailable",
					remediation: cause instanceof Error ? cause.message : String(cause)
				};
			}
		};
	})))();
}

//#endregion
//#region dist/application/UpdateRuntime.js
var runUpdateCommand, requireCommandOutput, detectNpmInstallation, nonemptyEnvironment, bunGlobalDirectory, detectBunInstallation, INVALID_NPM_RELEASE_METADATA, BUN_LATEST_VERSION_COMMAND, npmLatestVersionCommand, parseNpmLatestVersion, readNpmLatestVersion, nonemptyVersion, npmReleaseLookup, isFile, packageManagerContext, systemUpdateHost;
function init_UpdateRuntime() {
	return (init_UpdateRuntime = __esmMin((() => {
		init_homeDirectory();
		init_identity();
		init_ArtifactResourceScope();
		init_result();
		init_safeJson();
		init_Update();
		init_UpdateMaintenance();
		init_ClientRegistrationIdentity();
		runUpdateCommand = (command, selectedEnvironment, output = "structured", workingDirectory = undefined) => new Promise((resolveResult) => {
			const [executable, ...args] = command;
			if (executable === undefined) {
				resolveResult(err("No executable supplied."));
				return;
			}
			const environment = withoutPackageRunnerIdentity(selectedEnvironment);
			const child = spawn(executable, args, {
				stdio: [
					"ignore",
					"pipe",
					"pipe"
				],
				env: environment,
				windowsHide: true,
				...workingDirectory === undefined ? {} : { cwd: workingDirectory }
			});
			let stdout = "";
			let stderr = "";
			child.stdout?.setEncoding("utf8");
			child.stderr?.setEncoding("utf8");
			child.stdout?.on("data", (chunk) => {
				stdout += chunk;
				if (output === "human") process.stderr.write(chunk);
			});
			child.stderr?.on("data", (chunk) => {
				stderr += chunk;
				if (output === "human") process.stderr.write(chunk);
			});
			child.once("error", (cause) => resolveResult(err(cause.message)));
			child.once("close", (code, signal) => resolveResult(code === 0 ? ok(stdout.trim()) : err(stderr.trim() || stdout.trim() || (signal === null ? `Process exited with code ${String(code)}.` : `Process terminated by ${signal}.`))));
		});
		requireCommandOutput = async (command, environment) => {
			const result = await runUpdateCommand(command, environment);
			if (!result.ok) throw new Error(result.error);
			return result.value;
		};
		detectNpmInstallation = async (packageRoot, host) => {
			let canonicalPackageRoot;
			try {
				canonicalPackageRoot = await host.canonicalPath(packageRoot);
			} catch (cause) {
				void cause;
				return undefined;
			}
			try {
				const npmRoot = await host.globalRoot();
				const globalPackageRoot = await host.canonicalPath(resolve(npmRoot, PRODUCT_IDENTITY.packageName));
				if (canonicalPackageRoot === globalPackageRoot) {
					const prefix = await host.globalPrefix();
					return prefix.length === 0 ? undefined : {
						manager: "npm",
						prefix,
						packageRoot: canonicalPackageRoot
					};
				}
			} catch (cause) {
				void cause;
			}
			const nodeModules = dirname(canonicalPackageRoot);
			const library = dirname(nodeModules);
			if (basename(canonicalPackageRoot) !== PRODUCT_IDENTITY.packageName || basename(nodeModules) !== "node_modules" || basename(library) !== "lib") return undefined;
			return {
				manager: "npm",
				prefix: dirname(library),
				packageRoot: canonicalPackageRoot
			};
		};
		nonemptyEnvironment = (value) => value === undefined || value.length === 0 ? undefined : value;
		bunGlobalDirectory = (environment, platform) => {
			const explicit = nonemptyEnvironment(environment.BUN_INSTALL_GLOBAL_DIR);
			if (explicit !== undefined) return resolve(explicit);
			const installRoot = nonemptyEnvironment(environment.BUN_INSTALL);
			if (installRoot !== undefined) return resolve(installRoot, "install", "global");
			const cacheRoot = nonemptyEnvironment(environment.XDG_CACHE_HOME) ?? homeDirectoryFromEnvironment(environment, platform);
			return resolve(cacheRoot, ".bun", "install", "global");
		};
		detectBunInstallation = async (packageRoot, globalDirectory, host) => {
			try {
				const canonicalPackageRoot = await host.canonicalPath(packageRoot);
				const globalPackageRoot = await host.canonicalPath(join(globalDirectory, "node_modules", PRODUCT_IDENTITY.packageName));
				if (canonicalPackageRoot !== globalPackageRoot || !await host.isFile(join(globalDirectory, "package.json"))) return undefined;
				return {
					manager: "bun",
					globalDirectory,
					packageRoot: canonicalPackageRoot
				};
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		INVALID_NPM_RELEASE_METADATA = "Invalid npm release metadata: expected a version string or a single-element version array.";
		BUN_LATEST_VERSION_COMMAND = [
			"bun",
			"info",
			PRODUCT_IDENTITY.packageName,
			"dist-tags.latest",
			"--json"
		];
		npmLatestVersionCommand = (installation) => [
			"npm",
			"view",
			"--global",
			...installation === undefined ? [] : ["--prefix", installation.prefix],
			PRODUCT_IDENTITY.packageName,
			"dist-tags.latest",
			"--json",
			"--fetch-retries=0",
			"--fetch-timeout=10000"
		];
		parseNpmLatestVersion = (metadata) => {
			const decoded = safeParseJson(metadata);
			if (!decoded.ok) return err(decoded.error);
			const version = readNpmLatestVersion(decoded.value);
			return version === undefined ? err(INVALID_NPM_RELEASE_METADATA) : ok(version);
		};
		readNpmLatestVersion = (value) => {
			if (typeof value === "string") return nonemptyVersion(value);
			if (!Array.isArray(value) || value.length !== 1) return undefined;
			const only = value[0];
			return typeof only === "string" ? nonemptyVersion(only) : undefined;
		};
		nonemptyVersion = (value) => value.length === 0 ? undefined : value;
		npmReleaseLookup = (response) => {
			if (!response.ok) return err({
				kind: "unavailable",
				detail: response.error
			});
			const parsed = parseNpmLatestVersion(response.value);
			return parsed.ok ? ok(parsed.value) : err({
				kind: "invalid-metadata",
				detail: parsed.error
			});
		};
		isFile = async (path) => {
			try {
				return (await stat(path)).isFile();
			} catch (cause) {
				void cause;
				return false;
			}
		};
		packageManagerContext = (installation, environment) => installation?.manager === "bun" ? {
			environment: {
				...environment,
				BUN_INSTALL_GLOBAL_DIR: installation.globalDirectory
			},
			workingDirectory: installation.globalDirectory
		} : {
			environment,
			workingDirectory: undefined
		};
		systemUpdateHost = (packageRoot = fileURLToPath(new URL("../..", new URL("../application/UpdateRuntime.js", import.meta.url).href)), home = undefined, environment = process.env) => {
			const resources = new ArtifactResourceScope();
			return {
				installation: async () => await detectBunInstallation(packageRoot, bunGlobalDirectory(environment, process.platform), {
					canonicalPath: realpath,
					isFile
				}) ?? detectNpmInstallation(packageRoot, {
					canonicalPath: realpath,
					globalRoot: () => requireCommandOutput([
						"npm",
						"root",
						"--global"
					], environment),
					globalPrefix: () => requireCommandOutput([
						"npm",
						"prefix",
						"--global"
					], environment)
				}),
				latestVersion: async (installation) => {
					const context = packageManagerContext(installation, environment);
					if (installation?.manager === "bun") {
						const version = await runUpdateCommand(["bun", "--version"], context.environment, "structured", context.workingDirectory);
						if (!version.ok) return err({
							kind: "unavailable",
							detail: version.error
						});
						const bunVersion = valid(version.value);
						if (bunVersion === null || lt(bunVersion, "1.2.17")) return err({
							kind: "unsupported-package-manager",
							detail: `REA updates for Bun global installations require Bun 1.2.17 or later; bun --version returned ${JSON.stringify(version.value)}. Upgrade Bun manually, then rerun rea update.`
						});
					}
					return npmReleaseLookup(await runUpdateCommand(installation?.manager === "bun" ? BUN_LATEST_VERSION_COMMAND : npmLatestVersionCommand(installation), context.environment, "structured", context.workingDirectory));
				},
				installVersion: async (installation, version, output) => {
					const context = packageManagerContext(installation, environment);
					const result = await runUpdateCommand(updateInstallCommand(installation, version), context.environment, output, context.workingDirectory);
					return result.ok ? ok(undefined) : result;
				},
				installedVersion: (installation) => runUpdateCommand([
					process.execPath,
					join(installation.packageRoot, "scripts", "rea.mjs"),
					"--version"
				], environment),
				planMaintenance: (installation) => planIntegrationMaintenance(home ?? homeDirectoryFromEnvironment(environment, process.platform), join(installation.packageRoot, "scripts", "rea.mjs"), environment, (command) => runUpdateCommand(command, environment), resources),
				close: async () => {
					try {
						await resources.close();
						return undefined;
					} catch (cause) {
						return `Update resource cleanup failed: ${cause instanceof Error ? cause.message : String(cause)}`;
					}
				}
			};
		};
	})))();
}

//#endregion
init_UpdateRuntime();
export { BUN_LATEST_VERSION_COMMAND, bunGlobalDirectory, detectBunInstallation, detectNpmInstallation, npmLatestVersionCommand, npmReleaseLookup, parseNpmLatestVersion, runUpdateCommand, systemUpdateHost };