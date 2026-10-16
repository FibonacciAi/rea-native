import * as t from "@babel/types";
import { createSemanticCallableIdStack } from "./javascriptSemanticCallableStack.js";
import { semanticStaticPropertyName, unwrapJavaScriptExpression, } from "./javascriptAstValues.js";
import { isUnshadowedGlobal, resolveSemanticBindingState, } from "./javascriptSemanticState.js";
import { compareUnicodeCodePoints } from "../unicodeCodePointOrder.js";
import { traverseJavaScriptAst } from "./javascriptSemanticTraversal.js";
import { range } from "./javascriptStaticAnalysisHelpers.js";
import { builtinDataEffectMethod, dataEffectLiteralString, dataEffectMemberCallee, assignedSemanticResultBindings, scalarAssignedResultBinding, semanticProjectedBindingFacts, } from "./javascriptSemanticDataEffectHelpers.js";
const CHILD_PROCESS_METHODS = ["spawn", "exec", "execFile", "fork"];
const CHILD_LISTENER_METHODS = ["on", "once", "addListener"];
/** Recover explicit asynchronous node:child_process ownership candidates. */
export const collectJavaScriptSemanticChildProcesses = (program, state, callables) => {
    const candidates = collectSpawns(program, state, callables);
    const childProcessSpawns = candidates.map((candidate) => immutableSpawn(candidate));
    return {
        childProcessSpawns,
        childProcessInteractions: collectInteractions(program, state, callables, candidates),
    };
};
const collectSpawns = (program, state, callables) => {
    const output = [];
    const admittedCallables = new Set(callables.map(({ callableId }) => callableId));
    const callableStack = createSemanticCallableIdStack(admittedCallables);
    const ancestors = [];
    traverseJavaScriptAst(program, {
        enter: (node, parent) => {
            callableStack.enter(node, parent);
            if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
                const method = childProcessMethod(node.callee, state);
                if (method !== null) {
                    const projectedResultBindings = assignedSemanticResultBindings(node, ancestors, state);
                    output.push({
                        node,
                        method,
                        ownerCallableId: callableStack.callables.at(-1) ?? null,
                        resultBindingId: scalarAssignedResultBinding(projectedResultBindings),
                        projectedResultBindings: semanticProjectedBindingFacts(projectedResultBindings.filter(({ projectionPath }) => projectionPath.length > 0)),
                    });
                }
            }
            ancestors.push(node);
        },
        exit: (node) => {
            ancestors.pop();
            callableStack.exit(node);
        },
    });
    return output;
};
const immutableSpawn = (candidate) => {
    const options = spawnOptions(candidate);
    const command = dataEffectLiteralString(candidate.node.arguments[0]);
    return {
        processId: spawnId(candidate),
        method: candidate.method,
        location: range(candidate.node),
        ownerCallableId: candidate.ownerCallableId,
        resultBindingId: candidate.resultBindingId,
        projectedResultBindings: candidate.projectedResultBindings,
        command,
        argvCount: spawnArgvCount(candidate),
        environmentSupplied: objectHasProperty(options, "env"),
        stdioMode: stdioMode(options),
        resolution: command === null ? "partial" : "complete",
    };
};
const collectInteractions = (program, state, callables, spawns) => {
    const output = [];
    const callableIds = new Set(callables.map(({ callableId }) => callableId));
    const callableStack = createSemanticCallableIdStack(callableIds);
    const spawnByNode = new WeakMap();
    const spawnsByBinding = new Map();
    for (const spawn of spawns) {
        spawnByNode.set(spawn.node, spawn);
        const ids = [
            ...(spawn.resultBindingId === null ? [] : [spawn.resultBindingId]),
            ...spawn.projectedResultBindings.map(({ bindingId }) => bindingId),
        ];
        for (const id of ids) {
            const existing = spawnsByBinding.get(id) ?? [];
            existing.push(spawn);
            spawnsByBinding.set(id, existing);
        }
    }
    const context = {
        state,
        spawnByNode,
        spawnsByBinding,
    };
    traverseJavaScriptAst(program, {
        enter: (node, parent) => {
            callableStack.enter(node, parent);
            if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node))
                return;
            const interaction = childInteraction(node, callableStack.callables.at(-1) ?? null, context);
            if (interaction === null)
                return;
            output.push(interaction);
        },
        exit: (node) => callableStack.exit(node),
    });
    return output;
};
const childInteraction = (node, ownerCallableId, context) => {
    const { state, spawnByNode, spawnsByBinding } = context;
    const member = dataEffectMemberCallee(node);
    if (member === null)
        return null;
    const method = semanticStaticPropertyName(member.property, member.computed);
    const binding = objectBinding(member.object, state);
    const linked = resolveChildCandidates(member.object, binding, spawnByNode, spawnsByBinding);
    if (linked.length === 0)
        return null;
    const classification = classifyInteraction(method, node.arguments[0]);
    if (classification === null)
        return null;
    const { kind, interactionMethod, eventName } = classification;
    const listener = node.arguments[1];
    return {
        interactionId: `child:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
        kind,
        method: interactionMethod,
        location: range(node),
        ownerCallableId,
        processBindingId: binding?.bindingId ?? null,
        linkedProcessIds: linked
            .map((candidate) => spawnId(candidate))
            .sort(compareUnicodeCodePoints),
        eventName: kind === "listener" ? eventName : null,
        signalName: kind === "signal" ? killSignalName(node.arguments, state) : null,
        listenerLocation: kind === "listener" && t.isNode(listener) ? range(listener) : null,
        resolution: linked.length === 1 &&
            !linked[0]?.projectedResultBindings.some(({ bindingId }) => bindingId === binding?.bindingId)
            ? "complete"
            : "partial",
    };
};
// Only an omitted argument or the unshadowed global undefined selects the
// SIGTERM default; an unresolved argument leaves the signal unknown.
const killSignalName = (args, state) => {
    const [signal] = args;
    if (signal === undefined)
        return "SIGTERM";
    const expression = unwrapJavaScriptExpression(signal).node;
    if (t.isUnaryExpression(expression, { operator: "void" }) ||
        isUnshadowedGlobal(expression, state, "undefined"))
        return "SIGTERM";
    return dataEffectLiteralString(signal);
};
const classifyInteraction = (method, argument) => {
    if (method === "kill")
        return { kind: "signal", interactionMethod: "kill", eventName: null };
    const listenerMethod = CHILD_LISTENER_METHODS.find((candidate) => candidate === method);
    const eventName = dataEffectLiteralString(argument);
    return listenerMethod !== undefined &&
        (eventName === "exit" || eventName === "error")
        ? { kind: "listener", interactionMethod: listenerMethod, eventName }
        : null;
};
const childProcessMethod = (callee, state) => {
    const method = builtinDataEffectMethod(callee, state, [
        "child_process",
        "node:child_process",
    ]);
    return (CHILD_PROCESS_METHODS.find((candidate) => candidate === method) ?? null);
};
const resolveChildCandidates = (node, binding, spawnByNode, spawnsByBinding) => {
    const direct = spawnByNode.get(node);
    if (direct !== undefined)
        return [direct];
    return binding === undefined
        ? []
        : (spawnsByBinding.get(binding.bindingId) ?? []);
};
const spawnOptions = (candidate) => {
    const args = candidate.node.arguments;
    const value = candidate.method === "exec"
        ? args[1]
        : t.isObjectExpression(args[1])
            ? args[1]
            : args[2];
    return t.isObjectExpression(value) ? value : null;
};
const spawnArgvCount = (candidate) => {
    if (candidate.method === "exec")
        return null;
    const args = candidate.node.arguments[1];
    return t.isArrayExpression(args) &&
        !args.elements.some((element) => t.isSpreadElement(element))
        ? args.elements.length
        : null;
};
const objectHasProperty = (object, name) => objectProperty(object, name) !== null;
const stdioMode = (options) => {
    const property = objectProperty(options, "stdio");
    if (property === null || !t.isObjectProperty(property))
        return "default";
    if (t.isStringLiteral(property.value))
        return property.value.value;
    if (t.isArrayExpression(property.value))
        return "array";
    return "dynamic";
};
const objectProperty = (object, name) => object?.properties.find((property) => (t.isObjectMethod(property) || t.isObjectProperty(property)) &&
    // `{[env]: vars}` has a dynamic key; treating it as `env` would claim
    // the caller supplied an environment when the real key is unknown.
    semanticStaticPropertyName(property.key, property.computed) === name) ?? null;
const objectBinding = (node, state) => t.isIdentifier(node)
    ? resolveSemanticBindingState(state, node, node.name)
    : undefined;
const spawnId = (candidate) => `child:spawn:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
