import { resolve } from "node:path";
export const OBJDUMP_PROVIDER_IDENTITY = {
    id: "gnu.objdump",
    name: "GNU objdump",
    version: null,
};
/** Build GNU objdump argv without invoking a shell or following DWARF links by default. */
export const objdumpCommand = (input) => {
    if (input.operation === "architectures")
        return ["-i"];
    const argumentsByOperation = {
        file_headers: ["-f"],
        section_headers: ["-h"],
        symbols: ["-t"],
        relocations: ["-r"],
        dwarf: ["-W", input.follow_debug_links ? "-WK" : "-WN"],
        disassemble: ["-d"],
        disassemble_all: ["-D"],
    };
    return [...argumentsByOperation[input.operation], resolve(input.path)];
};
