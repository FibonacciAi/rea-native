import { parse } from "@babel/parser";
/**
 * Babel plugins for one source path. Single owner for TypeScript/JSX
 * mode selection (tsc + Babel `typescript` plugin semantics).
 *
 * - `dts:true` only for `.d.ts/.d.mts/.d.cts` ambient declarations;
 *   ordinary `.ts` keeps the missing-initializer diagnostic.
 * - JSX enabled for `.tsx`, `.jsx`, `.js`, and unknown paths; disabled for
 *   plain `.ts/.cts/.mts` (angle-bracket assertions, not JSX) and for all
 *   declaration files. `.mts` (including `.d.mts`) sets
 *   `disallowAmbiguousJSXLike`, matching tsc's `.mts` mode.
 * - `decorators-legacy` always present: without it decorated sources fail
 *   hard instead of reporting recovered syntax, losing every derived fact.
 * - Unknown paths retain the existing JSX-capable contract (best-effort
 *   parse; failures surface via `errorRecovery`, never silent misparse).
 */
export const parserPluginsForPath = (sourcePath) => {
    const path = sourcePath ?? "";
    const dts = /\.d\.(?:ts|mts|cts)$/iu.test(path);
    const isTsLike = /\.(?:ts|cts|mts)$/iu.test(path);
    const isTsx = /\.tsx$/iu.test(path);
    const isMts = /\.mts$/iu.test(path);
    const typescript = [
        "typescript",
        {
            dts,
            ...(isMts ? { disallowAmbiguousJSXLike: true } : {}),
        },
    ];
    const jsxCapable = !dts && (isTsx || !isTsLike);
    return jsxCapable
        ? ["decorators-legacy", "jsx", typescript]
        : ["decorators-legacy", typescript];
};
/** `.mjs` and `.mts` explicitly select module mode. */
export const isExplicitModuleSourcePath = (path) => /\.m[jt]s$/iu.test(path ?? "");
const runtimeSourceTypeForPath = (path) => /\.cjs$/iu.test(path ?? "")
    ? "commonjs"
    : isExplicitModuleSourcePath(path)
        ? "module"
        : "unambiguous";
/**
 * Parse a module or script with recovery. Babel tries module mode first and
 * keeps its strict-mode errors after falling back to a script, so a script
 * with errors is parsed again as a script. Strict errors that only the module
 * parse reports stay visible because the source may still be a module.
 */
export const parseRecoveredJavaScript = (source, sourcePath, options) => {
    const sourceType = runtimeSourceTypeForPath(sourcePath);
    if (sourceType !== "unambiguous") {
        const normalizedOptions = { ...options };
        if (sourceType === "commonjs") {
            // Babel owns these wrapper semantics in CommonJS mode and rejects
            // explicit script overrides, including the reference-import options.
            delete normalizedOptions.allowAwaitOutsideFunction;
            delete normalizedOptions.allowReturnOutsideFunction;
            delete normalizedOptions.allowNewTargetOutsideFunction;
        }
        return {
            file: parse(source, {
                ...normalizedOptions,
                sourceType,
                errorRecovery: true,
            }),
            moduleOnlyErrors: [],
        };
    }
    const file = parse(source, {
        ...options,
        sourceType: "unambiguous",
        errorRecovery: true,
    });
    if (file.program.sourceType !== "script" || file.errors.length === 0)
        return { file, moduleOnlyErrors: [] };
    const script = parse(source, {
        ...options,
        sourceType: "script",
        errorRecovery: true,
    });
    const scriptErrors = new Set(script.errors.map((error) => error.message));
    return {
        file: script,
        moduleOnlyErrors: file.errors
            .map((error) => error.message)
            .filter((message) => !scriptErrors.has(message)),
    };
};
/** Parse inert JavaScript or TypeScript facts without attaching comments to AST nodes. */
export const parseJavaScriptSource = (source, sourcePath) => {
    try {
        const runtimeSourceType = runtimeSourceTypeForPath(sourcePath);
        const commonjs = runtimeSourceType === "commonjs";
        const options = {
            errorRecovery: true,
            attachComment: false,
            plugins: parserPluginsForPath(sourcePath),
        };
        const file = parse(source, {
            ...options,
            // Inert artifact analysis retains module declarations even in .cjs assets.
            // Infer their syntax here; reference imports keep filename-mode diagnostics.
            sourceType: commonjs ? "unambiguous" : runtimeSourceType,
            allowReturnOutsideFunction: commonjs,
            allowNewTargetOutsideFunction: commonjs,
        });
        // Unambiguous mode retains module-only diagnostics after choosing a script.
        // The .cjs extension establishes wrapper mode, so obtain its own diagnostics.
        return commonjs &&
            file.program.sourceType === "script" &&
            file.errors.length > 0
            ? parse(source, { ...options, sourceType: "commonjs" })
            : file;
    }
    catch (cause) {
        // Unparseable source is represented by the null return.
        void cause;
        return null;
    }
};
