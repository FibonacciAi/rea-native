import * as t from "@babel/types";
/**
 * Return one unconditional source initializer for a declared lexical binding.
 * Repeated variable declarations without another initializer do not write it.
 * This establishes a stable source fact only; it does not prove immutability or
 * that the declaration has executed at a particular program point.
 */
export const semanticStableInitializer = (binding, state) => {
    const [initializer] = binding?.initializers ?? [];
    const [definition] = binding?.definitions ?? [];
    return binding !== undefined &&
        ((definition?.kind === "variable" &&
            binding.definitions.every(({ kind }) => kind === "variable")) ||
            (binding.definitions.length === 1 &&
                (definition?.kind === "function" || definition?.kind === "class"))) &&
        binding.initializers.length === 1 &&
        initializer !== undefined &&
        !state.conditionallySkippedExpressions.has(initializer.node)
        ? initializer
        : undefined;
};
/** Return the active scope from a non-empty construction stack. */
export const currentSemanticScope = (stack) => {
    const scope = stack.at(-1);
    if (scope === undefined)
        throw new TypeError("Missing semantic scope");
    return scope;
};
/** Create a stable source-position identity for one lexical scope. */
export const semanticScopeId = (kind, node) => `scope:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
/** Create the canonical identity used by one binding in a lexical scope. */
export const semanticBindingId = (scopeId, name) => `${scopeId}:binding:${encodeURIComponent(name)}`;
/** Resolve one lexical name from the scope containing a node. */
export const resolveSemanticBindingState = (state, node, name) => {
    let scope = semanticScopeForNode(state, node);
    while (scope !== undefined) {
        const binding = scope.bindings.get(name);
        if (binding !== undefined)
            return binding;
        if (!scope.bindingsComplete)
            return undefined;
        scope =
            scope.parentScopeId === null
                ? undefined
                : state.scopesById.get(scope.parentScopeId);
    }
    return undefined;
};
/** Report whether an omitted binding scope blocks a trustworthy miss. */
export const semanticResolutionBlocked = (state, node, name) => {
    let scope = semanticScopeForNode(state, node);
    while (scope !== undefined) {
        if (scope.bindings.has(name))
            return false;
        if (!scope.bindingsComplete)
            return true;
        scope =
            scope.parentScopeId === null
                ? undefined
                : state.scopesById.get(scope.parentScopeId);
    }
    return false;
};
const semanticScopeForNode = (state, node) => {
    let candidate = node;
    while (candidate !== undefined) {
        const scope = state.scopeByNode.get(candidate);
        if (scope !== undefined) {
            // Repeated references in a deep expression share this ancestry. Cache
            // the traversed path without eagerly indexing nodes never resolved.
            let descendant = node;
            while (descendant !== undefined && descendant !== candidate) {
                state.scopeByNode.set(descendant, scope);
                descendant = state.parentsByNode.get(descendant);
            }
            return scope;
        }
        candidate = state.parentsByNode.get(candidate);
    }
    return undefined;
};
/** Resolve one name starting from an explicitly selected lexical scope. */
export const resolveSemanticBindingFromScope = (scope, name, state) => {
    let candidate = scope;
    while (candidate !== undefined) {
        const binding = candidate.bindings.get(name);
        if (binding !== undefined)
            return binding;
        if (!candidate.bindingsComplete)
            return undefined;
        candidate =
            candidate.parentScopeId === null
                ? undefined
                : state.scopesById.get(candidate.parentScopeId);
    }
    return undefined;
};
/** Select the function/program owner for a var declaration. */
export const semanticVariableScope = (scope, parent, state) => {
    if (!(parent !== null && t.isVariableDeclaration(parent, { kind: "var" })))
        return scope;
    let candidate = scope;
    while (candidate.kind === "block" || candidate.kind === "catch") {
        const outer = candidate.parentScopeId === null
            ? undefined
            : state.scopesById.get(candidate.parentScopeId);
        if (outer === undefined)
            break;
        candidate = outer;
    }
    return candidate;
};
/** Identify a global name only when no lexical or dynamic environment shadows it. */
export const isUnshadowedGlobal = (node, state, name) => t.isIdentifier(node, { name }) &&
    (resolveSemanticBindingState(state, node, name) === undefined
        ? !semanticResolutionBlocked(state, node, name)
        : isUnmodifiedCommonJsWrapperBinding(node, name, state));
/** A program-level `var` redeclaration still denotes its untouched CJS wrapper parameter. */
export const isUnmodifiedCommonJsWrapperBinding = (node, name, state) => {
    // Parser sourceType separates explicit modules from script/CommonJS source;
    // specifier resolution mode does not establish that distinction.
    if (state.program.sourceType !== "script" ||
        !["module", "exports", "require"].includes(name) ||
        !t.isIdentifier(node, { name }))
        return false;
    const binding = resolveSemanticBindingState(state, node, name);
    if (binding === undefined || binding.initializers.length !== 0)
        return false;
    const scope = state.scopesById.get(binding.scopeId);
    return (scope?.kind === "program" &&
        binding.declarationKinds.size > 0 &&
        [...binding.declarationKinds].every((kind) => kind === "var"));
};
