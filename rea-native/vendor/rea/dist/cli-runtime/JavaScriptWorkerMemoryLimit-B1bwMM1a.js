import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { init_runtimeVersion, javaScriptRuntime } from "./runtimeVersion-CMGd0bDu.js";

//#region dist/domain/javascript/javascriptModuleSpecifier.js
var isRelativeJavaScriptModuleSpecifier;
function init_javascriptModuleSpecifier() {
	return (init_javascriptModuleSpecifier = __esmMin((() => {
		isRelativeJavaScriptModuleSpecifier = (value) => value === "." || value === ".." || value.startsWith("./") || value.startsWith("../");
	})))();
}

//#endregion
//#region dist/application/TypeScriptEmittedSourceCandidates.js
var EMITTED_SUFFIXES, typescriptEmittedSourceCandidates;
function init_TypeScriptEmittedSourceCandidates() {
	return (init_TypeScriptEmittedSourceCandidates = __esmMin((() => {
		EMITTED_SUFFIXES = [
			[".js", [
				".ts",
				".tsx",
				".d.ts"
			]],
			[".mjs", [".mts", ".d.mts"]],
			[".cjs", [".cts", ".d.cts"]],
			[".jsx", [".tsx", ".d.ts"]]
		];
		typescriptEmittedSourceCandidates = (sourcePath, candidate) => {
			if (!/\.(?:ts|tsx|mts|cts)$/u.test(sourcePath)) return [];
			const emitted = EMITTED_SUFFIXES.find(([suffix]) => candidate.endsWith(suffix));
			if (emitted === undefined) return [];
			const stem = candidate.slice(0, candidate.length - emitted[0].length);
			return emitted[1].map((suffix) => ({
				path: `${stem}${suffix}`,
				kind: suffix.startsWith(".d.") ? "declaration" : "implementation"
			}));
		};
	})))();
}

//#endregion
//#region dist/domain/sourceMapEnvelope.js
var sourceMapJsonText, isRecord, isVersion3Map, flattenSourceMapLeaves;
function init_sourceMapEnvelope() {
	return (init_sourceMapEnvelope = __esmMin((() => {
		sourceMapJsonText = (text) => {
			const withoutBom = text.replace(/^\uFEFF/u, "");
			if (!withoutBom.startsWith(")]}'")) return withoutBom;
			const newline = withoutBom.search(/[\r\n]/u);
			return newline === -1 ? "" : withoutBom.slice(newline);
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		isVersion3Map = (value) => isRecord(value) && value.version === 3;
		flattenSourceMapLeaves = (root) => {
			if (!isVersion3Map(root)) return undefined;
			const leaves = [];
			const pending = [root];
			while (pending.length > 0) {
				const map = pending.pop();
				if (!isVersion3Map(map)) return undefined;
				if (Array.isArray(map.sections)) {
					for (let index = map.sections.length - 1; index >= 0; index -= 1) {
						const section = map.sections[index];
						if (!isRecord(section) || !isRecord(section.map)) return undefined;
						pending.push(section.map);
					}
				} else leaves.push(map);
			}
			return leaves;
		};
	})))();
}

//#endregion
//#region dist/process/JavaScriptWorkerMemoryLimit.js
var MIB, BUN_WORKER_RUNTIME_RESERVE_BYTES, javaScriptWorkerMemoryLimitBytes;
function init_JavaScriptWorkerMemoryLimit() {
	return (init_JavaScriptWorkerMemoryLimit = __esmMin((() => {
		init_runtimeVersion();
		MIB = 1024 * 1024;
		BUN_WORKER_RUNTIME_RESERVE_BYTES = 512 * MIB;
		javaScriptWorkerMemoryLimitBytes = (heapBudgetMiB, host = process) => host.platform === "win32" && javaScriptRuntime(host.versions).id === "bun" ? heapBudgetMiB * MIB + BUN_WORKER_RUNTIME_RESERVE_BYTES : null;
	})))();
}

//#endregion
export { flattenSourceMapLeaves, init_JavaScriptWorkerMemoryLimit, init_TypeScriptEmittedSourceCandidates, init_javascriptModuleSpecifier, init_sourceMapEnvelope, isRelativeJavaScriptModuleSpecifier, javaScriptWorkerMemoryLimitBytes, sourceMapJsonText, typescriptEmittedSourceCandidates };