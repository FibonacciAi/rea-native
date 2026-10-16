import { resolve } from "node:path";
export const RIZIN_PROVIDER_IDENTITY = {
    id: "rizin",
    name: "Rizin",
    version: null,
};
/** Build a one-shot rz-pipe compatible command while retaining plugin availability. */
export const rizinCommand = (input) => [
    "-N",
    "-q",
    "-c",
    input.command,
    resolve(input.path),
];
