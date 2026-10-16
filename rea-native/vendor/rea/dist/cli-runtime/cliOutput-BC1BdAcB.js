import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";

//#region dist/cliOutput.js
var UNSUPPORTED_OUTPUT_COMBINATION_MESSAGE, INCUR_OUTPUT_FORMATS, parseCliOutputArguments, hasUnclosedFilterSlice, validateCliOutputArguments, renderEmptyFilteredCliOutput, renderCliOutputArgumentError;
function init_cliOutput() {
	return (init_cliOutput = __esmMin((() => {
		UNSUPPORTED_OUTPUT_COMBINATION_MESSAGE = "Token windows cannot preserve structured output. Remove --token-limit/--token-offset and use --filter-output or command pagination.";
		INCUR_OUTPUT_FORMATS = new Set([
			"toon",
			"json",
			"yaml",
			"md",
			"jsonl"
		]);
		parseCliOutputArguments = (arguments_) => {
			let format = "toon";
			let filterOutput;
			let fullOutput = false;
			let tokenCount = false;
			let tokenLimit;
			let tokenOffset;
			const parsed = (parseError) => ({
				filterOutput,
				format,
				fullOutput,
				parseError,
				tokenCount,
				tokenWindow: !parseError && (tokenLimit !== undefined || tokenOffset !== undefined),
				tokenLimit: parseError ? undefined : tokenLimit,
				tokenOffset: parseError ? undefined : tokenOffset
			});
			for (let index = 0; index < arguments_.length; index += 1) {
				const argument = arguments_[index];
				if (argument === "--json") {
					format = "json";
					continue;
				}
				if (argument === "--format") {
					const value = arguments_[index + 1];
					if (value) {
						if (!INCUR_OUTPUT_FORMATS.has(value)) return parsed(true);
						format = value;
						index += 1;
					}
					continue;
				}
				if (argument === "--filter-output") {
					if (arguments_[index + 1]) {
						filterOutput = arguments_[index + 1];
						index += 1;
					}
					continue;
				}
				if (argument === "--token-limit" || argument === "--token-offset") {
					const value = arguments_[index + 1];
					if (value) {
						const numericValue = Number(value);
						if (!Number.isFinite(numericValue) || value.trim() === "") return parsed(true);
						if (argument === "--token-limit") tokenLimit = numericValue;
						else tokenOffset = numericValue;
						index += 1;
					}
					continue;
				}
				if (argument === "--full-output") fullOutput = true;
				if (argument === "--token-count") tokenCount = true;
			}
			return parsed(false);
		};
		hasUnclosedFilterSlice = (expression) => {
			let depth = 0;
			let unclosed = false;
			for (const character of expression) {
				if (character === "[") {
					depth += 1;
					unclosed = true;
				} else if (character === "]") {
					depth -= 1;
					unclosed = false;
				} else if (character === "," && depth === 0 && unclosed) return true;
			}
			return unclosed;
		};
		validateCliOutputArguments = (arguments_) => {
			const { filterOutput, format, parseError, tokenWindow } = parseCliOutputArguments(arguments_);
			if (parseError) return { ok: true };
			if (filterOutput !== undefined && hasUnclosedFilterSlice(filterOutput)) return {
				ok: false,
				format: format === "yaml" || format === "jsonl" ? format : "json",
				code: "INVALID_OUTPUT_FILTER",
				message: "The --filter-output expression has a slice without a closing ]. Close the slice or remove --filter-output."
			};
			if (tokenWindow && (format === "json" || format === "jsonl" || format === "yaml")) return {
				ok: false,
				format,
				code: "UNSUPPORTED_OUTPUT_COMBINATION",
				message: UNSUPPORTED_OUTPUT_COMBINATION_MESSAGE
			};
			return { ok: true };
		};
		renderEmptyFilteredCliOutput = (arguments_) => {
			const { filterOutput, format, parseError } = parseCliOutputArguments(arguments_);
			if (parseError) return undefined;
			if (filterOutput && (format === "json" || format === "jsonl" || format === "yaml")) return "{}\n";
			return undefined;
		};
		renderCliOutputArgumentError = (error) => {
			const value = {
				ok: false,
				error: {
					code: error.code,
					message: error.message
				}
			};
			if (error.format === "yaml") return `ok: false\nerror:\n  code: ${error.code}\n  message: ${JSON.stringify(error.message)}\n`;
			return `${JSON.stringify(value)}\n`;
		};
	})))();
}

//#endregion
export { init_cliOutput, parseCliOutputArguments, renderCliOutputArgumentError, renderEmptyFilteredCliOutput, validateCliOutputArguments };