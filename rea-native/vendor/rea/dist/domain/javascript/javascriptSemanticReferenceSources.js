import { evaluateSemanticExpression } from "./javascriptSemanticValues.js";
import { semanticSlotAtPath } from "./javascriptSemanticSlots.js";
/** Exclude references whose source slot or destructuring fallback is absent. */
export const semanticReferenceSourcesInactive = (reference, state) => reference.requiredSources?.some((source) => semanticSelectedReferenceSlot(source, state, source.node)?.presence ===
    "absent") === true ||
    reference.fallbackSources?.some((source) => {
        // Selection precedes effects through the chosen reference. A later escape
        // cannot make a fallback that was excluded at destructuring reachable.
        const slot = semanticSelectedReferenceSlot(source, state, source.node);
        return (slot?.presence === "present" &&
            (slot.value.status === "literal" ||
                slot.value.status === "union" ||
                slot.value.status === "object" ||
                slot.value.status === "array"));
    }) === true;
/** Select a retained source slot at its capture, before later effects. */
export const semanticSelectedReferenceSlot = (source, state, capturePoint) => {
    const path = [];
    for (const key of source.projection) {
        if (key === null || typeof key === "object")
            return undefined;
        path.push(String(key));
    }
    return semanticSlotAtPath(evaluateSemanticExpression(source.node, state, capturePoint), path);
};
