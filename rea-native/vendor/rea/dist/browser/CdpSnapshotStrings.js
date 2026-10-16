import { numberValue } from "./CdpCaptureValues.js";
// DOMSnapshot interns an empty or null string as index -1 instead of a table
// entry. Chrome uses it for element node values and empty attribute values.
const CDP_EMPTY_STRING_INDEX = -1;
/** Resolve a DOMSnapshot name index, which must reference a string entry. */
export const cdpSnapshotString = (strings, index) => {
    const integer = numberValue(index);
    if (integer === undefined || !Number.isSafeInteger(integer) || integer < 0)
        return undefined;
    return strings[integer];
};
/** Resolve a DOMSnapshot value index, where -1 is the protocol's empty string. */
export const cdpSnapshotValueString = (strings, index) => numberValue(index) === CDP_EMPTY_STRING_INDEX
    ? ""
    : cdpSnapshotString(strings, index);
/** Whether flattened name/value attribute indexes all resolve. */
export const cdpSnapshotAttributesResolve = (strings, attributes) => attributes.length % 2 === 0 &&
    attributes.every((attribute, offset) => attribute !== undefined &&
        (offset % 2 === 0
            ? cdpSnapshotString(strings, attribute)
            : cdpSnapshotValueString(strings, attribute)) !== undefined);
