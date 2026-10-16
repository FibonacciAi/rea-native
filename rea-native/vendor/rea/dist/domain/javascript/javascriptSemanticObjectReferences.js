import * as t from "@babel/types";
import { resolveSemanticBindingState, } from "./javascriptSemanticState.js";
import { semanticCallableResultExpressions } from "./javascriptSemanticCallableResults.js";
import { semanticReadInitializers } from "./javascriptSemanticMutationInitializers.js";
import { semanticReferenceSourcesInactive } from "./javascriptSemanticReferenceSources.js";
import { semanticStaticPropertyKey, unwrapJavaScriptExpression, } from "./javascriptAstValues.js";
import { semanticPropertyPathKeyMatches, } from "./javascriptSemanticPropertyPaths.js";
import { compareUnicodeCodePoints } from "../unicodeCodePointOrder.js";
export const semanticClassCandidates = (root, state) => {
    const pending = [root];
    const seenNodes = new Set();
    const seenBindings = new Set();
    const classes = [];
    for (let cursor = 0; cursor < pending.length; cursor++) {
        const node = pending[cursor];
        if (node === undefined)
            continue;
        const expression = unwrapJavaScriptExpression(node).node;
        if (seenNodes.has(expression))
            continue;
        seenNodes.add(expression);
        if (t.isClass(expression)) {
            classes.push(expression);
        }
        else if (t.isIdentifier(expression)) {
            const binding = resolveSemanticBindingState(state, expression, expression.name);
            if (binding === undefined || seenBindings.has(binding.bindingId))
                continue;
            seenBindings.add(binding.bindingId);
            for (const initializer of binding.initializers)
                pending.push(initializer.node);
        }
        else if (t.isConditionalExpression(expression) ||
            t.isLogicalExpression(expression)) {
            pending.push(t.isConditionalExpression(expression)
                ? expression.consequent
                : expression.left, t.isConditionalExpression(expression)
                ? expression.alternate
                : expression.right);
        }
        else if (t.isSequenceExpression(expression)) {
            const last = expression.expressions.at(-1);
            if (last !== undefined)
                pending.push(last);
        }
    }
    return classes;
};
const instanceFieldReferences = (root, propertyName, path, state, initializedBefore) => {
    const references = [];
    const pending = [{ klass: root, excluded: new Set() }];
    const selections = new Map();
    let definiteNames;
    for (let cursor = 0; cursor < pending.length; cursor++) {
        const current = pending[cursor];
        if (current === undefined)
            continue;
        const previous = selections.get(current.klass);
        // A shared base can be reached through different derived classes. Only
        // exclusions common to those paths can suppress a field in that base.
        const excluded = previous === undefined
            ? current.excluded
            : new Set([...previous].filter((name) => current.excluded.has(name)));
        if (previous !== undefined && previous.size === excluded.size)
            continue;
        selections.set(current.klass, excluded);
        const shadowed = new Set(excluded);
        const before = initializedBefore === undefined
            ? -1
            : current.klass.body.body.indexOf(initializedBefore);
        const members = before < 0
            ? current.klass.body.body
            : current.klass.body.body.slice(0, before);
        for (const member of [...members].reverse()) {
            if (!t.isClassProperty(member) || member.static)
                continue;
            const key = semanticStaticPropertyKey(member.key, member.computed);
            if (key !== null && shadowed.has(key))
                continue;
            if (key !== null)
                shadowed.add(key);
            if ((propertyName === null || key === null || key === propertyName) &&
                member.value != null)
                references.push({ node: member.value, path });
        }
        const bases = current.klass.superClass == null
            ? []
            : semanticClassCandidates(current.klass.superClass, state);
        if (bases.length === 0)
            definiteNames =
                definiteNames === undefined
                    ? shadowed
                    : new Set([...definiteNames].filter((name) => shadowed.has(name)));
        for (const klass of bases)
            pending.push({ klass, excluded: shadowed });
    }
    return { references, definiteNames: definiteNames ?? new Set() };
};
const classPropertyDescriptors = (klass, propertyName, kind, initializedBefore) => {
    const isStatic = kind === "static";
    const selectedGetters = [];
    const fields = [];
    const indexedMembers = [];
    const before = initializedBefore === undefined
        ? -1
        : klass.body.body.indexOf(initializedBefore);
    klass.body.body.forEach((member, index) => {
        if (before >= 0 && index >= before && t.isClassProperty(member))
            return;
        if ((t.isClassMethod(member) ||
            (kind === "static" && t.isClassProperty(member))) &&
            member.static === isStatic)
            indexedMembers.push({
                member,
                index,
                key: semanticStaticPropertyKey(member.key, member.computed),
            });
    });
    const matchingMembers = propertyName === null
        ? []
        : indexedMembers.filter(({ key }) => key === propertyName);
    const uncertainGetters = indexedMembers.filter((entry) => {
        const { member, key } = entry;
        return (t.isClassMethod(member) &&
            member.kind === "get" &&
            (propertyName === null || (member.computed && key === null)));
    });
    const getters = matchingMembers.filter((entry) => t.isClassMethod(entry.member) && entry.member.kind === "get");
    const getter = getters.at(-1);
    const getterIndex = getter?.index ?? -1;
    const laterDataMember = matchingMembers.some(({ member, index }) => t.isClassProperty(member) ||
        (t.isClassMethod(member) &&
            member.kind === "method" &&
            index > getterIndex));
    const seenFields = new Set();
    for (const { member, key } of [...indexedMembers].reverse()) {
        if (!t.isClassProperty(member))
            continue;
        if (key !== null && seenFields.has(key))
            continue;
        if (key !== null)
            seenFields.add(key);
        if (propertyName === null || key === null || key === propertyName)
            fields.push(member);
    }
    if (getters.length > 0 && !laterDataMember && getter !== undefined)
        selectedGetters.push(getter.member);
    for (const { member, index } of uncertainGetters)
        if (!matchingMembers.some(({ member: matching, index: matchingIndex }) => (t.isClassProperty(matching) ||
            (t.isClassMethod(matching) &&
                (matching.kind === "method" || matching.kind === "get"))) &&
            matchingIndex > index))
            selectedGetters.push(member);
    return {
        getters: selectedGetters,
        fields,
        inherits: matchingMembers.length === 0,
    };
};
export const semanticClassPropertyReferences = (lookup, selection, state, activeGetters = new Map()) => {
    const root = lookup.owner;
    const receiver = lookup.receiver ?? root;
    const [key, ...path] = selection;
    const propertyName = key == null || typeof key === "object" ? null : String(key);
    const pending = [root];
    const seen = new Set();
    const possibleResults = [];
    // Instance fields are own properties, including fields initialized by base
    // constructors. They take precedence over every prototype descriptor.
    let instanceFields = new Set();
    if (lookup.kind === "instance") {
        const fields = instanceFieldReferences(root, propertyName, path, state, lookup.initializedBefore);
        possibleResults.push(...fields.references);
        instanceFields = fields.definiteNames;
        if (propertyName !== null && instanceFields.has(propertyName))
            return possibleResults;
    }
    for (let cursor = 0; cursor < pending.length; cursor++) {
        const klass = pending[cursor];
        if (klass === undefined || seen.has(klass))
            continue;
        seen.add(klass);
        const descriptors = classPropertyDescriptors(klass, propertyName, lookup.kind, lookup.initializedBefore);
        for (const field of descriptors.fields)
            if (field.value != null)
                possibleResults.push({ node: field.value, path });
        for (const getter of lookup.fieldsOnly ? [] : descriptors.getters) {
            const key = semanticStaticPropertyKey(getter.key, getter.computed);
            if (key !== null && instanceFields.has(key))
                continue;
            possibleResults.push(...getterResultReferences({ getter, owner: klass, receiver }, path, state, activeGetters));
        }
        // An exact own descriptor suppresses inherited lookup. Dynamic computed
        // descriptors may or may not match, so retain possible superclass results.
        if (descriptors.inherits &&
            klass.superClass !== null &&
            klass.superClass !== undefined)
            pending.push(...semanticClassCandidates(klass.superClass, state));
    }
    return possibleResults;
};
const objectReceiverReference = (object, path, state) => {
    // A literal's enclosing binding owns its slots. Returning the literal
    // itself would bypass invalidation of that binding's observed properties.
    let current = object;
    const projection = [];
    while (true) {
        const parent = state.parentsByNode.get(current);
        if (t.isVariableDeclarator(parent) &&
            parent.init === current &&
            t.isIdentifier(parent.id))
            return [
                {
                    node: parent.id,
                    path: [...projection, ...path],
                    ownerInitializer: current,
                },
            ];
        if (t.isAssignmentExpression(parent, { operator: "=" }) &&
            parent.right === current &&
            t.isIdentifier(parent.left))
            return [
                {
                    node: parent.left,
                    path: [...projection, ...path],
                    ownerInitializer: current,
                },
            ];
        if (t.isArrayExpression(parent)) {
            let minimumIndex = 0;
            let uncertainIndex = false;
            for (const element of parent.elements) {
                if (element === current)
                    break;
                if (t.isSpreadElement(element))
                    uncertainIndex = true;
                else
                    minimumIndex++;
            }
            // A spread contributes an unknown number of slots. Retain the known
            // prefix without treating the element's syntax position as its index.
            projection.unshift(uncertainIndex
                ? { excludedKeys: [], startIndex: minimumIndex }
                : minimumIndex);
            current = parent;
            continue;
        }
        if (t.isObjectProperty(parent) && parent.value === current) {
            projection.unshift(semanticStaticPropertyKey(parent.key, parent.computed));
            const container = state.parentsByNode.get(parent);
            if (t.isObjectExpression(container)) {
                current = container;
                continue;
            }
        }
        break;
    }
    return [{ node: object, path }];
};
/** Follow only data fields whose initializers retain a class receiver. */
const privateReceiverProjection = (receiver, owner, path, isStatic, state) => {
    if (path.some((key) => key === null || typeof key === "object"))
        return false;
    const pending = [
        {
            receiver,
            path: path.map((key) => ({ key: String(key) })),
            visits: new Map(),
        },
    ];
    const seen = new Set();
    const declaringClass = (field) => {
        const body = state.parentsByNode.get(field);
        return body === undefined ? undefined : state.parentsByNode.get(body);
    };
    for (let cursor = 0; cursor < pending.length; cursor++) {
        const current = pending[cursor];
        if (current === undefined)
            break;
        const [selection, ...remaining] = current.path;
        if (selection === undefined) {
            if (!isStatic || current.receiver === owner)
                return true;
            continue;
        }
        const origin = JSON.stringify([
            current.receiver.start,
            selection.key,
            selection.before?.start,
        ]);
        const previous = current.visits.get(origin);
        // Repeated fields may consume a finite getter path. An initializer cycle
        // that preserves or grows it cannot establish another receiver identity.
        if (previous !== undefined && previous <= current.path.length)
            continue;
        const visits = new Map(current.visits).set(origin, current.path.length);
        const identity = JSON.stringify([
            current.receiver.start,
            current.path.map(({ key, before }) => [key, before?.start]),
        ]);
        if (seen.has(identity))
            continue;
        seen.add(identity);
        const lookupOwner = selection.before === undefined
            ? current.receiver
            : declaringClass(selection.before);
        if (!t.isClass(lookupOwner))
            continue;
        for (const reference of semanticClassPropertyReferences({
            owner: lookupOwner,
            receiver: current.receiver,
            kind: isStatic ? "static" : "instance",
            fieldsOnly: true,
            ...(selection.before === undefined
                ? {}
                : { initializedBefore: selection.before }),
        }, [selection.key], state)) {
            const field = state.parentsByNode.get(reference.node);
            if (!t.isClassProperty(field))
                continue;
            const fieldOwner = declaringClass(field);
            if (!t.isClass(fieldOwner))
                continue;
            const projection = [];
            let value = unwrapJavaScriptExpression(reference.node).node;
            while (t.isMemberExpression(value) ||
                t.isOptionalMemberExpression(value)) {
                const key = semanticStaticPropertyKey(value.property, value.computed);
                if (key === null || t.isPrivateName(value.property))
                    break;
                projection.unshift({ key, before: field });
                value = unwrapJavaScriptExpression(value.object).node;
            }
            if (!t.isThisExpression(value))
                continue;
            // Instance fields retain the actual instance. Static field `this` belongs
            // to its declaring class, even when a subclass inherits the field.
            pending.push({
                receiver: isStatic ? fieldOwner : current.receiver,
                path: [...projection, ...remaining],
                visits,
            });
        }
    }
    return false;
};
const getterResultReferences = (invocation, path, state, activeGetters = new Map()) => {
    const { getter, owner, receiver = owner } = invocation;
    const previousLength = activeGetters.get(getter);
    if (previousLength !== undefined && previousLength <= path.length)
        return [];
    // Repeated receiver reads may revisit a getter while consuming a finite
    // path; recursive getters that preserve or grow that path cannot progress.
    const active = new Map(activeGetters).set(getter, path.length);
    const isStatic = t.isClassMethod(getter) && getter.static;
    const pending = semanticCallableResultExpressions(getter).flatMap(({ node }) => node === null ? [] : [{ node, path, aliases: undefined }]);
    const references = [];
    const expandedAliases = new Map();
    const getterScope = state.scopeByNode.get(getter)?.scopeId;
    for (let cursor = 0; cursor < pending.length; cursor++) {
        const current = pending[cursor];
        if (current === undefined)
            break;
        const { path: remaining } = current;
        const expression = unwrapJavaScriptExpression(current.node).node;
        const retain = (reference) => {
            references.push(current.escapes ? { ...reference, escapes: true } : reference);
        };
        const retainPrivateRead = () => {
            if (current.privateRead !== undefined)
                retain({
                    node: current.privateRead.node,
                    path: current.escapes ? [] : current.privateRead.path,
                });
        };
        if (t.isIdentifier(expression)) {
            const binding = resolveSemanticBindingState(state, expression, expression.name);
            let scope = binding === undefined
                ? undefined
                : state.scopesById.get(binding.scopeId);
            while (scope !== undefined && scope.scopeId !== getterScope) {
                if (scope.kind === "function" || scope.parentScopeId === null) {
                    scope = undefined;
                    break;
                }
                scope = state.scopesById.get(scope.parentScopeId);
            }
            if (binding !== undefined &&
                scope !== undefined &&
                binding.referenceInitializers.every((initializer) => initializer.copyKind === undefined)) {
                const identity = JSON.stringify([
                    binding.bindingId,
                    expression.start,
                    expression.end,
                ]);
                const known = expandedAliases.get(identity);
                const key = JSON.stringify([
                    remaining,
                    current.privateRead?.name,
                    current.privateRead?.path,
                    current.escapes,
                ]);
                let cyclic = false;
                let growing = false;
                if (known !== undefined)
                    for (let visit = current.aliases; visit !== undefined; visit = visit.parent)
                        if (visit.identity === identity) {
                            cyclic = true;
                            growing = remaining.length > visit.pathLength;
                            break;
                        }
                if (cyclic) {
                    // A repeated alias can select arbitrarily deep children. Revisit its
                    // roots as escapes rather than enumerating iterations or dropping them.
                    if (growing && !current.escapes)
                        pending.push({
                            ...current,
                            path: [],
                            aliases: undefined,
                            escapes: true,
                        });
                    continue;
                }
                if (known?.has(key))
                    continue;
                const selections = known ?? new Set();
                selections.add(key);
                expandedAliases.set(identity, selections);
                const aliases = {
                    identity,
                    pathLength: remaining.length,
                    parent: current.aliases,
                };
                const origins = semanticReadInitializers(binding, expression, state.parentsByNode);
                for (const initializer of [
                    ...origins.initializers,
                    ...origins.referenceInitializers.filter((initializer) => !semanticReferenceSourcesInactive(initializer, state)),
                ])
                    pending.push({
                        ...current,
                        node: initializer.node,
                        path: [...initializer.projection, ...remaining],
                        aliases,
                    });
                continue;
            }
        }
        if (t.isThisExpression(expression)) {
            // An outer binding or a nested ordinary function has a different receiver.
            let ownerNode = state.parentsByNode.get(expression);
            while (ownerNode !== undefined &&
                !t.isClass(ownerNode) &&
                !(t.isFunction(ownerNode) && !t.isArrowFunctionExpression(ownerNode)))
                ownerNode = state.parentsByNode.get(ownerNode);
            if (ownerNode !== getter)
                continue;
            if (current.privateRead !== undefined && t.isClass(owner)) {
                if (!t.isClass(receiver) ||
                    !privateReceiverProjection(receiver, owner, remaining, isStatic, state)) {
                    retainPrivateRead();
                    continue;
                }
                for (const member of owner.body.body)
                    if (t.isClassPrivateProperty(member) &&
                        member.static === isStatic &&
                        member.key.id.name === current.privateRead.name &&
                        member.value != null)
                        retain({
                            node: member.value,
                            path: current.escapes ? [] : current.privateRead.path,
                        });
                continue;
            }
            for (const reference of t.isClass(receiver)
                ? semanticClassPropertyReferences({ owner: receiver, kind: isStatic ? "static" : "instance" }, remaining, state, active)
                : objectReceiverReference(receiver, remaining, state))
                retain(reference);
            continue;
        }
        if (t.isMemberExpression(expression) ||
            t.isOptionalMemberExpression(expression)) {
            if (current.privateRead !== undefined &&
                t.isPrivateName(expression.property)) {
                retainPrivateRead();
                continue;
            }
            if (t.isPrivateName(expression.property) && t.isClass(owner)) {
                pending.push({
                    ...current,
                    node: expression.object,
                    path: [],
                    privateRead: {
                        node: expression,
                        name: expression.property.id.name,
                        path: remaining,
                    },
                });
                continue;
            }
            const key = semanticStaticPropertyKey(expression.property, expression.computed);
            if (t.isSuper(expression.object) &&
                t.isClass(owner) &&
                owner.superClass != null) {
                for (const base of semanticClassCandidates(owner.superClass, state))
                    for (const reference of semanticClassPropertyReferences({
                        owner: base,
                        receiver: t.isClass(receiver) ? receiver : owner,
                        kind: isStatic ? "static" : "prototype",
                    }, [key, ...remaining], state, active))
                        retain(reference);
                continue;
            }
            pending.push({
                ...current,
                node: expression.object,
                path: [key, ...remaining],
            });
        }
        else if (t.isConditionalExpression(expression))
            pending.push({ ...current, node: expression.consequent }, { ...current, node: expression.alternate });
        else if (t.isLogicalExpression(expression))
            pending.push({ ...current, node: expression.left }, { ...current, node: expression.right });
        else if (t.isSequenceExpression(expression)) {
            const last = expression.expressions.at(-1);
            if (last !== undefined)
                pending.push({ ...current, node: last });
        }
        else if (t.isAssignmentExpression(expression, { operator: "=" }))
            pending.push({ ...current, node: expression.right });
        else if (t.isAssignmentExpression(expression) &&
            ["&&=", "||=", "??="].includes(expression.operator))
            pending.push({ ...current, node: expression.left }, { ...current, node: expression.right });
        else if (current.privateRead !== undefined)
            retainPrivateRead();
        else
            retain({ node: expression, path: remaining });
    }
    return references;
};
export const semanticObjectPropertyReferences = (node, path, state) => {
    const [key, ...remaining] = path;
    const references = [];
    const overwritten = new Set();
    const dataOverwritten = new Set();
    const accessorNames = new Set();
    const getterNames = new Set();
    const setterNames = new Set();
    for (const property of [...node.properties].reverse()) {
        if (t.isSpreadElement(property)) {
            const selected = key ?? null;
            if (typeof selected !== "object" && overwritten.has(String(selected)))
                continue;
            references.push({
                node: property.argument,
                path: [
                    typeof selected === "object"
                        ? {
                            ...selected,
                            excludedKeys: [
                                ...new Set([
                                    ...(selected?.excludedKeys ?? []),
                                    ...overwritten,
                                ]),
                            ].sort(compareUnicodeCodePoints),
                        }
                        : selected,
                    ...remaining,
                ],
            });
            if (selected !== null &&
                typeof selected !== "object" &&
                t.isObjectExpression(property.argument) &&
                objectExpressionDefinesKey(property.argument, String(selected))) {
                overwritten.add(String(selected));
                dataOverwritten.add(String(selected));
            }
            continue;
        }
        const name = semanticStaticPropertyKey(property.key, property.computed);
        if (t.isObjectProperty(property) &&
            !property.computed &&
            !property.shorthand &&
            name === "__proto__") {
            const selected = key ?? null;
            if ((selected === null || typeof selected === "object") &&
                t.isExpression(property.value)) {
                references.push({
                    node: property.value,
                    path: [selected, ...remaining],
                });
            }
            else if (typeof selected === "string" &&
                !objectExpressionDefinesKey(node, selected) &&
                t.isExpression(property.value)) {
                references.push({
                    node: property.value,
                    path: [selected, ...remaining],
                });
            }
            continue;
        }
        const isGetter = t.isObjectMethod(property) && property.kind === "get";
        const isSetter = t.isObjectMethod(property) && property.kind === "set";
        if (name !== null &&
            (isGetter || isSetter
                ? dataOverwritten.has(name) ||
                    (isGetter ? getterNames.has(name) : setterNames.has(name))
                : dataOverwritten.has(name) || accessorNames.has(name)))
            continue;
        if (name === null || semanticPropertyPathKeyMatches(key ?? null, name)) {
            if (t.isObjectMethod(property) && property.kind === "get") {
                references.push(...getterResultReferences({ getter: property, owner: node }, remaining, state));
            }
            else if (t.isObjectMethod(property) && property.kind === "set") {
                // A setter contributes no readable reference. A paired getter is
                // handled independently when it appears earlier in this object.
            }
            else {
                references.push({
                    node: t.isObjectProperty(property) ? property.value : property,
                    path: remaining,
                });
            }
        }
        if (name !== null) {
            if (isGetter) {
                getterNames.add(name);
                accessorNames.add(name);
                overwritten.add(name);
            }
            else if (isSetter) {
                setterNames.add(name);
                accessorNames.add(name);
                overwritten.add(name);
            }
            else if (!(t.isObjectProperty(property) &&
                !property.computed &&
                !property.shorthand &&
                name === "__proto__")) {
                overwritten.add(name);
                dataOverwritten.add(name);
            }
        }
    }
    return references;
};
const objectExpressionDefinesKey = (root, key) => {
    const pending = [root];
    const seen = new Set();
    for (let cursor = 0; cursor < pending.length; cursor++) {
        const object = pending[cursor];
        if (object === undefined || seen.has(object))
            continue;
        seen.add(object);
        for (const property of object.properties) {
            if (t.isSpreadElement(property)) {
                if (t.isObjectExpression(property.argument))
                    pending.push(property.argument);
                continue;
            }
            const name = semanticStaticPropertyKey(property.key, property.computed);
            if (name === key &&
                !(t.isObjectProperty(property) &&
                    !property.computed &&
                    !property.shorthand &&
                    name === "__proto__"))
                return true;
        }
    }
    return false;
};
