import * as t from "@babel/types";
import { traverseJavaScriptAst } from "./javascriptSemanticTraversal.js";
import { BUILTIN_RESOURCE_METHODS } from "./javascriptBuiltinResourceMethods.js";
import { resolveSemanticBindingState, isUnmodifiedCommonJsWrapperBinding, semanticResolutionBlocked, semanticStableInitializer, } from "./javascriptSemanticState.js";
import { semanticStaticPropertyKey, unwrapJavaScriptExpression, } from "./javascriptAstValues.js";
import { semanticPropertyPathKeyMatches } from "./javascriptSemanticPropertyPaths.js";
import { stringValue } from "./javascriptStaticAnalysisHelpers.js";
import { semanticTopLevelEffectFollowsCapture } from "./javascriptSemanticMutationInitializers.js";
import { createSemanticModuleInterop } from "./javascriptModuleInterop.js";
/** Classify a bare `require(...)` using the shared lexical binding owner. */
export const semanticRequireLoaderAt = (node, state, factoryBindingIds) => {
    if (!t.isIdentifier(node.callee, { name: "require" }))
        return "local";
    const binding = resolveSemanticBindingState(state, node.callee, "require");
    if (binding === undefined)
        return semanticResolutionBlocked(state, node.callee, "require")
            ? "unknown"
            : "commonjs-loader";
    if (factoryBindingIds.has(binding.bindingId))
        return binding.initializers.length === 0 ? "factory-loader" : "unknown";
    if (isWrapperRequireInitializerCall(binding, node, state))
        return "commonjs-loader";
    if (isUnmodifiedCommonJsWrapperBinding(node.callee, "require", state))
        return "commonjs-loader";
    if (isSemanticCreateRequireBinding(binding, state))
        return "create-require";
    const initializer = semanticStableInitializer(binding, state)?.node;
    if ((binding.kind === "function" || binding.kind === "class") &&
        initializer !== undefined)
        return "local";
    if (binding.declarationKinds.size === 1 &&
        binding.declarationKinds.has("const") &&
        (t.isFunctionExpression(initializer) ||
            t.isArrowFunctionExpression(initializer)))
        return "local";
    return "unknown";
};
/** Classify a call through an exact recovered factory-loader binding. */
export const semanticFactoryRequireLoaderAt = (node, state, bindingIds) => {
    const callee = unwrapJavaScriptExpression(node.callee).node;
    if (t.isIdentifier(callee))
        return semanticFactoryLoaderMemberAt(node, state, bindingIds, null);
    if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) &&
        semanticStaticPropertyKey(callee.property, callee.computed) === "bind")
        return semanticFactoryLoaderMemberAt(node, state, bindingIds, "bind");
    return undefined;
};
/** Classify an exact loader call by binding identity and expected member. */
export const semanticFactoryLoaderMemberAt = (node, state, bindingIds, member) => {
    const callee = unwrapJavaScriptExpression(node.callee).node;
    let loader;
    if (member === null) {
        if (t.isIdentifier(callee))
            loader = callee;
    }
    else if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) &&
        semanticStaticPropertyKey(callee.property, callee.computed) === member) {
        const root = unwrapJavaScriptExpression(callee.object).node;
        if (t.isIdentifier(root))
            loader = root;
    }
    if (loader === undefined)
        return undefined;
    const binding = resolveSemanticBindingState(state, loader, loader.name);
    if (binding === undefined || !bindingIds.has(binding.bindingId))
        return undefined;
    return binding.initializers.length === 0 ? "factory-loader" : "unknown";
};
const isSemanticCreateRequireBinding = (binding, state) => {
    if (binding.initializers.length !== 1)
        return false;
    const initializer = semanticStableInitializer(binding, state)?.node;
    if (!t.isCallExpression(initializer))
        return false;
    const callee = unwrapJavaScriptExpression(initializer.callee).node;
    if (t.isIdentifier(callee)) {
        const origins = resolveSemanticBindingState(state, callee, callee.name)?.directOrigins;
        if (origins?.length !== 1)
            return false;
        const [origin] = origins;
        return (origin?.importedPath.at(-1) === "createRequire" &&
            ["module", "node:module"].includes(origin.specifier));
    }
    const chain = semanticMemberChain(callee);
    if (chain === undefined || chain.members.at(-1) !== "createRequire")
        return false;
    if (!t.isNode(chain.root))
        return false;
    const root = unwrapJavaScriptExpression(chain.root).node;
    if (!t.isIdentifier(root))
        return false;
    const origins = resolveSemanticBindingState(state, root, root.name)?.directOrigins;
    if (origins?.length !== 1)
        return false;
    const [origin] = origins;
    return (origin?.importedPath.length === 0 &&
        ["module", "node:module"].includes(origin.specifier));
};
/** The RHS call runs before its assignment replaces Node's wrapper loader. */
const isWrapperRequireInitializerCall = (binding, node, state) => {
    const scope = state.scopesById.get(binding.scopeId);
    if (scope?.kind !== "program" ||
        binding.kind !== "variable" ||
        binding.declarationKinds.size !== 1 ||
        !binding.declarationKinds.has("var") ||
        binding.initializers.length !== 1 ||
        binding.initializers[0]?.node !== node)
        return false;
    const assignment = state.parentsByNode.get(node);
    if (!t.isAssignmentExpression(assignment) ||
        assignment.right !== node ||
        state.conditionallySkippedExpressions.has(node))
        return false;
    const statement = state.parentsByNode.get(assignment);
    if (!t.isExpressionStatement(statement))
        return false;
    if (state.parentsByNode.get(statement) !== state.program)
        return false;
    const target = unwrapJavaScriptExpression(assignment.left).node;
    return (t.isIdentifier(target, { name: "require" }) &&
        resolveSemanticBindingState(state, target, target.name) === binding);
};
// Ambient indexing finishes before these derived facts are consumed. Keep only
// replacement sites, rather than rescanning unrelated global member writes.
const globalProcessReplacements = new WeakMap();
const moduleRequireWrites = new WeakMap();
const writesModuleRequire = (state) => {
    const cached = moduleRequireWrites.get(state);
    if (cached !== undefined)
        return cached;
    // Interop invocation resolution may ask for require provenance while this
    // index is being built. Publish a temporary empty result to break that cycle.
    moduleRequireWrites.set(state, []);
    const writes = [];
    const interop = createSemanticModuleInterop(state);
    const isModuleObject = (node, visited = new Set()) => {
        const value = unwrapJavaScriptExpression(node).node;
        if (!t.isIdentifier(value))
            return false;
        if (value.name === "module")
            return resolveSemanticBindingState(state, value, "module") === undefined
                ? !semanticResolutionBlocked(state, value, "module")
                : isUnmodifiedCommonJsWrapperBinding(value, "module", state);
        const binding = resolveSemanticBindingState(state, value, value.name);
        if (binding === undefined || visited.has(binding.bindingId))
            return false;
        const next = new Set(visited).add(binding.bindingId);
        return (binding.initializers.length > 0 &&
            binding.initializers.every(({ node: init }) => isModuleObject(init, next)));
    };
    traverseJavaScriptAst(state.program, {
        enter: (node) => {
            const target = t.isAssignmentExpression(node)
                ? node.left
                : t.isUpdateExpression(node) ||
                    t.isUnaryExpression(node, { operator: "delete" })
                    ? node.argument
                    : undefined;
            if (target !== undefined) {
                const members = [];
                let root = target;
                while (t.isMemberExpression(root) ||
                    t.isOptionalMemberExpression(root)) {
                    const key = semanticStaticPropertyKey(root.property, root.computed);
                    if (key === null)
                        break;
                    members.unshift(key);
                    root = root.object;
                }
                if (members.length === 1 &&
                    members[0] === "require" &&
                    isModuleObject(root))
                    writes.push(node);
                else if (members.length === 0 &&
                    (t.isMemberExpression(target) ||
                        t.isOptionalMemberExpression(target)) &&
                    target.computed &&
                    semanticStaticPropertyKey(target.property, true) === null &&
                    isModuleObject(target.object))
                    // An unknown computed key may be "require"; retain uncertainty rather
                    // than treating this direct delegate write as a proven unrelated slot.
                    writes.push(node);
            }
            if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
                const invocation = interop.intrinsicInvocation(node);
                const owner = invocation?.path?.length === 3 ? invocation.path[1] : undefined;
                const method = invocation?.path?.at(-1);
                const args = invocation?.arguments;
                if ((owner === "Object" || owner === "Reflect") &&
                    method === "defineProperty" &&
                    isModuleObject(args?.[0] ?? t.nullLiteral())) {
                    const key = interop.staticString(args?.[1]);
                    if (key === "require" || key === undefined)
                        writes.push(node);
                }
                else if (owner === "Object" &&
                    method === "defineProperties" &&
                    isModuleObject(args?.[0] ?? t.nullLiteral())) {
                    const descriptors = args?.[1];
                    if (!t.isObjectExpression(descriptors) ||
                        descriptors.properties.some((property) => t.isSpreadElement(property) ||
                            (t.isObjectProperty(property) &&
                                semanticStaticPropertyKey(property.key, property.computed) ===
                                    "require")))
                        writes.push(node);
                }
                else if (owner === "Object" &&
                    method === "assign" &&
                    args?.some((arg) => isModuleObject(arg))) {
                    const target = args?.[0];
                    if (target !== undefined && isModuleObject(target)) {
                        const sourceHasRequire = args
                            ?.slice(1)
                            .some((arg) => t.isObjectExpression(arg) &&
                            arg.properties.some((property) => t.isObjectProperty(property) &&
                                semanticStaticPropertyKey(property.key, property.computed) === "require"));
                        if (sourceHasRequire ||
                            args?.slice(1).some((arg) => !t.isObjectExpression(arg)))
                            writes.push(node);
                    }
                }
            }
        },
    });
    moduleRequireWrites.set(state, writes);
    return writes;
};
/** Whether the original global process object can still own effects at this source site. */
export const semanticOriginalGlobalProcessAt = (node, state) => {
    let replacements = globalProcessReplacements.get(state);
    if (replacements === undefined) {
        replacements = [
            ...state.ambientWriteEffects
                .filter(({ path }) => path.length <= 2 &&
                path.every((key, index) => semanticPropertyPathKeyMatches(key, ["global", "process"][index])))
                .map(({ node: write }) => write),
            ...(state.ambientBindingWrites.get("process") ?? []),
        ];
        globalProcessReplacements.set(state, replacements);
    }
    return !replacements.some((write) => !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode));
};
/** Node's unbound process reference shares the cached process exports object. */
export const semanticGlobalProcessOrigin = (node, state) => t.isIdentifier(node, { name: "process" }) &&
    resolveSemanticBindingState(state, node, "process") === undefined &&
    !semanticResolutionBlocked(state, node, "process") &&
    semanticOriginalGlobalProcessAt(node, state)
    ? { specifier: "node:process", importedPath: [], resolutionMode: "require" }
    : undefined;
/** Resolve qualified global-object process references, preserving their selected path. */
export const semanticGlobalProcessPathOrigin = (node, state) => {
    const members = [];
    let current = unwrapJavaScriptExpression(node).node;
    while (t.isMemberExpression(current) ||
        t.isOptionalMemberExpression(current)) {
        const key = semanticStaticPropertyKey(current.property, current.computed);
        if (key === null)
            return undefined;
        members.unshift(key);
        current = unwrapJavaScriptExpression(current.object).node;
    }
    if (!t.isIdentifier(current) ||
        !["globalThis", "global", "window", "self"].includes(current.name) ||
        resolveSemanticBindingState(state, current, current.name) !== undefined ||
        semanticResolutionBlocked(state, current, current.name) ||
        members[0] !== "process" ||
        !semanticOriginalGlobalProcessAt(node, state))
        return undefined;
    return {
        specifier: "node:process",
        importedPath: members.slice(1),
        resolutionMode: "require",
    };
};
/** Strip a static member chain, returning its root expression and member path. */
export const semanticMemberChain = (node) => {
    const members = [];
    let current = node;
    while (current !== null && current !== undefined) {
        current = unwrapJavaScriptExpression(current).node;
        if (!t.isMemberExpression(current) &&
            !t.isOptionalMemberExpression(current))
            break;
        const member = semanticStaticPropertyKey(current.property, current.computed);
        if (member === null || !t.isNode(current.object))
            return undefined;
        members.push(member);
        current = current.object;
    }
    return { root: current, members: members.reverse() };
};
/** Recover an unshadowed literal require origin and its exact member path. */
export const semanticRequireOrigin = (node, state) => {
    const chain = semanticMemberChain(node);
    const current = chain?.root;
    if (chain === undefined ||
        !t.isCallExpression(current) ||
        !t.isIdentifier(current.callee, { name: "require" }))
        return undefined;
    if (writesModuleRequire(state).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode)))
        return undefined;
    const requireBinding = resolveSemanticBindingState(state, current.callee, "require");
    if ((requireBinding !== undefined &&
        !isUnmodifiedCommonJsWrapperBinding(current.callee, "require", state) &&
        !isWrapperRequireInitializerCall(requireBinding, current, state)) ||
        (requireBinding === undefined &&
            semanticResolutionBlocked(state, current.callee, "require")) ||
        (state.ambientBindingWrites.get("require") ?? []).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode)))
        return undefined;
    const specifier = stringValue(current.arguments[0]);
    return specifier === undefined
        ? undefined
        : {
            origin: {
                specifier,
                importedPath: chain.members,
                resolutionMode: "require",
            },
            call: current,
        };
};
/** Node's fs.promises export and fs/promises require share one object. */
export const semanticRequireExportsIdentity = (specifier, path) => {
    const name = specifier.replace(/^node:/u, "");
    if (name === "fs/promises")
        return { specifier: name, path };
    return name === "fs" && path[0] === "promises" && path.length > 1
        ? { specifier: "fs/promises", path: path.slice(1) }
        : { specifier: name, path };
};
const MUTABLE_BUILTIN_DEFAULTS = new Set([
    ...Object.keys(BUILTIN_RESOURCE_METHODS),
    "http",
    "https",
    "child_process",
    "timers",
    "process",
]);
/** Mutable default/object selections share CommonJS identity; namespace slots do not. */
export const semanticMutableBuiltinOrigin = (origin, selected = []) => {
    const path = [...origin.importedPath, ...selected];
    if (origin.resolutionMode === "require")
        return { specifier: origin.specifier, path };
    const specifier = origin.specifier.replace(/^node:/u, "");
    if (!MUTABLE_BUILTIN_DEFAULTS.has(specifier))
        return undefined;
    if (path[0] === "default")
        return { specifier, path: path.slice(1) };
    if (specifier === "process" && (path[0] === "env" || path[0] === "argv"))
        return { specifier, path };
    return specifier === "fs" && path[0] === "promises"
        ? { specifier, path }
        : undefined;
};
