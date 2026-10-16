import * as t from "@babel/types";
import { semanticStaticPropertyKey, unwrapJavaScriptExpression, } from "./javascriptAstValues.js";
const initializerPositionCaches = new WeakMap();
const initializerPositionCache = (parents) => {
    const cached = initializerPositionCaches.get(parents);
    if (cached !== undefined)
        return cached;
    const created = {
        direct: new WeakMap(),
        mutation: new WeakMap(),
        reference: new WeakMap(),
    };
    initializerPositionCaches.set(parents, created);
    return created;
};
const statementPosition = (statement, parents, declarator) => {
    const parent = parents.get(statement);
    if (!t.isProgram(parent) && !t.isBlockStatement(parent))
        return null;
    const index = parent.body.indexOf(statement);
    return index < 0
        ? null
        : {
            body: parent.body,
            index,
            declaratorIndex: t.isVariableDeclaration(statement) && declarator !== undefined
                ? statement.declarations.indexOf(declarator)
                : -1,
        };
};
const positionPrecedes = (left, right) => left.body === right.body &&
    (left.index < right.index ||
        (left.index === right.index &&
            left.declaratorIndex >= 0 &&
            left.declaratorIndex < right.declaratorIndex));
/** Order effects only in a non-repeating top-level activation. */
export const semanticTopLevelEffectFollowsCapture = (capture, effect, parents) => {
    const position = (node) => {
        let selected = null;
        let declarator;
        let child;
        while (node !== undefined) {
            if (t.isFunction(node) || t.isLoop(node))
                return null;
            if ((t.isClassProperty(node) ||
                t.isClassPrivateProperty(node) ||
                t.isClassAccessorProperty(node)) &&
                !node.static &&
                node.value === child)
                return null;
            if (t.isVariableDeclarator(node))
                declarator = node;
            if (selected === null && t.isStatement(node))
                selected = statementPosition(node, parents, declarator);
            if (t.isProgram(node))
                return selected;
            child = node;
            node = parents.get(node);
        }
        return null;
    };
    const before = position(capture);
    const after = position(effect);
    if (before === null || after === null)
        return false;
    if (positionPrecedes(before, after))
        return true;
    if (before.body !== after.body ||
        before.index !== after.index ||
        before.declaratorIndex !== after.declaratorIndex)
        return false;
    return expressionEvaluationPrecedes(capture, effect, parents);
};
/** Prove ordering only where JavaScript evaluates sibling expressions left-to-right. */
const expressionEvaluationPrecedes = (earlier, later, parents) => {
    if (later === undefined)
        return false;
    const earlierAncestors = new Set();
    let current = earlier;
    while (current !== undefined) {
        earlierAncestors.add(current);
        current = parents.get(current);
    }
    const laterPath = [];
    current = later;
    while (current !== undefined && !earlierAncestors.has(current)) {
        laterPath.push(current);
        current = parents.get(current);
    }
    const common = current;
    if (common === undefined || common === earlier || common === later)
        return false;
    let earlierChild = earlier;
    while (parents.get(earlierChild) !== common) {
        const parent = parents.get(earlierChild);
        if (parent === undefined)
            return false;
        earlierChild = parent;
    }
    const laterChild = laterPath.at(-1);
    if (laterChild === undefined)
        return false;
    const orderedChildren = (() => {
        if (t.isSequenceExpression(common))
            return common.expressions;
        if (t.isCallExpression(common) || t.isOptionalCallExpression(common))
            return [common.callee, ...common.arguments];
        if (t.isNewExpression(common))
            return [common.callee, ...common.arguments];
        if (t.isBinaryExpression(common) || t.isLogicalExpression(common))
            return [common.left, common.right];
        if (t.isConditionalExpression(common))
            return [common.test];
        return null;
    })();
    if (orderedChildren === null)
        return false;
    const earlierIndex = orderedChildren.indexOf(earlierChild);
    const laterIndex = orderedChildren.indexOf(laterChild);
    return earlierIndex >= 0 && laterIndex > earlierIndex;
};
const computeDirectInitializerPosition = (node, parents) => {
    const parent = parents.get(node);
    if (t.isVariableDeclarator(parent) && parent.init === node) {
        const declaration = parents.get(parent);
        return t.isVariableDeclaration(declaration)
            ? statementPosition(declaration, parents, parent)
            : null;
    }
    if (t.isAssignmentExpression(parent) &&
        parent.operator === "=" &&
        parent.right === node &&
        t.isIdentifier(parent.left)) {
        const statement = parents.get(parent);
        return t.isExpressionStatement(statement) && statement.expression === parent
            ? statementPosition(statement, parents)
            : null;
    }
    return null;
};
const directInitializerPosition = (node, parents) => {
    const cache = initializerPositionCache(parents);
    const cached = cache.direct.get(node);
    if (cached !== undefined)
        return cached;
    const computed = computeDirectInitializerPosition(node, parents);
    cache.direct.set(node, computed);
    return computed;
};
const computeDirectMutationPosition = (node, parents) => {
    if (t.isForOfStatement(node))
        return statementPosition(node, parents);
    if (t.isVariableDeclarator(node)) {
        const declaration = parents.get(node);
        return t.isVariableDeclaration(declaration)
            ? statementPosition(declaration, parents, node)
            : null;
    }
    if (t.isSpreadElement(node)) {
        const array = parents.get(node);
        return t.isArrayExpression(array)
            ? semanticCapturePosition(array, parents)
            : null;
    }
    if (!t.isAssignmentExpression(node) &&
        !t.isUpdateExpression(node) &&
        !t.isUnaryExpression(node, { operator: "delete" }) &&
        !t.isCallExpression(node) &&
        !t.isOptionalCallExpression(node) &&
        !t.isNewExpression(node) &&
        !t.isTaggedTemplateExpression(node))
        return null;
    let current = node;
    while (true) {
        const parent = parents.get(current);
        if (parent === undefined ||
            t.isFunction(parent) ||
            (t.isLogicalExpression(parent) && parent.right === current) ||
            (t.isConditionalExpression(parent) && parent.test !== current))
            return null;
        if (t.isStatement(parent))
            return statementPosition(parent, parents);
        if (t.isVariableDeclarator(parent)) {
            const declaration = parents.get(parent);
            return t.isVariableDeclaration(declaration)
                ? statementPosition(declaration, parents, parent)
                : null;
        }
        current = parent;
    }
};
const directMutationPosition = (node, parents) => {
    const cache = initializerPositionCache(parents);
    const cached = cache.mutation.get(node);
    if (cached !== undefined)
        return cached;
    const computed = computeDirectMutationPosition(node, parents);
    cache.mutation.set(node, computed);
    return computed;
};
const computeReferenceInitializerPosition = (node, parents) => {
    // Defaults live inside the declaration pattern rather than its initializer.
    let current = node;
    while (true) {
        const direct = directInitializerPosition(current, parents);
        if (direct !== null)
            return direct;
        const parent = parents.get(current);
        if (parent === undefined || t.isStatement(parent) || t.isFunction(parent))
            return null;
        if (t.isVariableDeclarator(parent)) {
            const declaration = parents.get(parent);
            return t.isVariableDeclaration(declaration)
                ? statementPosition(declaration, parents, parent)
                : null;
        }
        current = parent;
    }
};
const referenceInitializerPosition = (node, parents) => {
    const cache = initializerPositionCache(parents);
    const cached = cache.reference.get(node);
    if (cached !== undefined)
        return cached;
    const computed = computeReferenceInitializerPosition(node, parents);
    cache.reference.set(node, computed);
    return computed;
};
/** Resolve origins at their use or capture, never at a later transitive effect. */
export const semanticMutationInitializers = (binding, mutation, parents) => {
    const mutationPosition = directMutationPosition(mutation, parents) ??
        referenceInitializerPosition(mutation, parents);
    if (mutationPosition === null)
        return binding;
    const origins = [
        ...binding.initializers.map((initializer) => ({
            initializer,
            position: initializer.entryBody === undefined
                ? directInitializerPosition(initializer.node, parents)
                : {
                    body: initializer.entryBody.body,
                    index: -1,
                    declaratorIndex: -1,
                },
        })),
        ...binding.referenceInitializers.map((initializer) => ({
            initializer,
            position: referenceInitializerPosition(initializer.node, parents),
        })),
    ];
    if (origins.some(({ position }) => position === null || !positionPrecedes(position, mutationPosition)))
        return binding;
    const latest = origins.reduce((latest, { position }) => position !== null &&
        (latest === null || positionPrecedes(latest, position))
        ? position
        : latest, null);
    const retained = new Set(origins
        .filter(({ position }) => position?.index === latest?.index &&
        position?.declaratorIndex === latest?.declaratorIndex)
        .map(({ initializer }) => initializer));
    return {
        // A proven earlier assignment replaces even an import-equals value. A
        // capture before or inside an uncertain assignment retains the full binding.
        directOrigins: origins.length === 0 ? binding.directOrigins : [],
        initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
        referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer)),
    };
};
/** Select a local alias at its read, before any later straight-line reassignment. */
export const semanticReadInitializers = (binding, read, parents) => {
    let position = null;
    let current = read;
    for (let parent = parents.get(current); parent; parent = parents.get(current)) {
        if (t.isLoop(parent))
            return binding;
        if (t.isFunction(parent))
            break;
        if (position === null) {
            if (t.isVariableDeclarator(parent)) {
                const declaration = parents.get(parent);
                if (t.isVariableDeclaration(declaration))
                    position = statementPosition(declaration, parents, parent);
            }
            else if (t.isStatement(parent))
                position = statementPosition(parent, parents);
        }
        current = parent;
    }
    return selectInitializers(binding, position, parents, true);
};
const selectInitializers = (binding, position, parents, atRead = false) => {
    if (position === null)
        return binding;
    const origins = [
        ...binding.initializers.map((initializer) => ({
            initializer,
            position: initializer.entryBody === undefined
                ? directInitializerPosition(initializer.node, parents)
                : {
                    body: initializer.entryBody.body,
                    index: -1,
                    declaratorIndex: -1,
                },
        })),
        ...binding.referenceInitializers.map((initializer) => ({
            initializer,
            position: referenceInitializerPosition(initializer.node, parents),
        })),
    ];
    if (origins.some(({ position: origin }) => origin === null ||
        origin.body !== position.body ||
        (!atRead && !positionPrecedes(origin, position))))
        return binding;
    const preceding = atRead
        ? origins.filter(({ position: origin }) => origin !== null && positionPrecedes(origin, position))
        : origins;
    const latest = preceding.reduce((latest, { position }) => position !== null &&
        (latest === null || positionPrecedes(latest, position))
        ? position
        : latest, null);
    const retained = new Set(preceding
        .filter(({ position }) => position?.index === latest?.index &&
        position?.declaratorIndex === latest?.declaratorIndex)
        .map(({ initializer }) => initializer));
    // Preserve the owner's identity when selection removes no facts. Consumers
    // can then reuse the binding's dependency-aware provenance memo rather than
    // treating every equivalent read as a new temporal snapshot.
    if (binding.initializers.every((initializer) => retained.has(initializer)) &&
        binding.referenceInitializers.every((initializer) => retained.has(initializer)))
        return binding;
    return {
        initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
        referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer)),
    };
};
/** Locate a capture only in an unconditional declaration or literal initializer. */
export const semanticCapturePosition = (node, parents) => {
    let current = node;
    while (true) {
        const direct = directInitializerPosition(current, parents);
        if (direct !== null)
            return direct;
        const parent = parents.get(current);
        if (t.isObjectProperty(parent) &&
            parent.value === current &&
            semanticStaticPropertyKey(parent.key, parent.computed) !== null)
            current = parent;
        else if (t.isObjectExpression(parent) || t.isArrayExpression(parent))
            current = parent;
        else
            return null;
    }
};
/** Intermediate values must themselves have been initialized before capture. */
export const semanticBindingPrecedesCapture = (binding, capture, parents) => {
    const initializer = binding.initializers[0];
    if (binding.initializers.length !== 1 || initializer === undefined)
        return false;
    const sourcePosition = directInitializerPosition(initializer.node, parents);
    const capturePosition = semanticCapturePosition(capture, parents);
    return (sourcePosition !== null &&
        capturePosition !== null &&
        positionPrecedes(sourcePosition, capturePosition));
};
/** Ignore later escapes only while reading earlier references in one activation. */
export const semanticEscapeFollowsCapture = (binding, capture, escape, parents) => {
    const initializer = binding.initializers[0];
    if (escape === undefined ||
        initializer === undefined ||
        !semanticBindingPrecedesCapture(binding, capture, parents))
        return false;
    // A literal allocates here. Aliases are evaluated at the same capture point,
    // so an outer/persistent origin still receives all of its own escape effects.
    const origin = unwrapJavaScriptExpression(initializer.node).node;
    if (!t.isObjectExpression(origin) &&
        !t.isArrayExpression(origin) &&
        !t.isIdentifier(origin) &&
        !t.isMemberExpression(origin) &&
        !t.isOptionalMemberExpression(origin))
        return false;
    const capturePosition = semanticCapturePosition(capture, parents);
    const escapePosition = directMutationPosition(escape, parents);
    return (capturePosition !== null &&
        escapePosition !== null &&
        positionPrecedes(capturePosition, escapePosition));
};
