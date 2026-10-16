/**
 * Map caller-visible CPU families to little-endian generic Ghidra
 * languages with a supported generic compiler specification. These are
 * analysis conventions, not evidence of the target's original compiler.
 * Big-endian, Thumb-only, and Cortex-M variants are out of scope.
 */
export const ghidraRawBinaryLanguage = (architecture) => {
    switch (architecture) {
        case "6502":
            return {
                languageId: "6502:LE:16:default",
                compilerSpecId: "default",
                defaultAddressSpace: "RAM",
            };
        case "x86":
            return {
                languageId: "x86:LE:32:default",
                compilerSpecId: "gcc",
                defaultAddressSpace: "ram",
            };
        case "x86_64":
            return {
                languageId: "x86:LE:64:default",
                compilerSpecId: "gcc",
                defaultAddressSpace: "ram",
            };
        case "arm":
            return {
                languageId: "ARM:LE:32:v7",
                compilerSpecId: "default",
                defaultAddressSpace: "ram",
            };
        case "arm64":
            return {
                languageId: "AARCH64:LE:64:v8A",
                compilerSpecId: "default",
                defaultAddressSpace: "ram",
            };
    }
};
