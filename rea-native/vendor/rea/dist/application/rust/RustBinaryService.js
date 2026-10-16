import { isAbsolute } from "node:path";
import { AnalysisCancelledError, AnalysisInputError, AnalysisOutputError, } from "../../domain/analysisErrorCore.js";
import { createEvidence } from "../../domain/evidence.js";
import { BINARY_ARCHITECTURES } from "../../domain/binaryTargetTypes.js";
import { inspectRustBinaryInputSchema, rustBinarySchema, } from "../../domain/rust/rustBinary.js";
import { analysisInputErrorFromIssues } from "../../domain/inputIssueProjection.js";
import { err, ok } from "../../domain/result.js";
const OPERATION = "inspect_rust_binary";
const architectureForSubject = (architecture) => {
    switch (architecture) {
        case "386":
            return "x86";
        case "amd64":
            return "x86_64";
        default:
            return BINARY_ARCHITECTURES.find((supported) => supported === architecture);
    }
};
/** Shared exact input validation and artifact-bound Evidence for CLI and MCP. */
export class RustBinaryService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    /** Inspect one explicitly selected file without acquiring a binary session. */
    async inspect(rawInput, options) {
        if (options?.signal?.aborted)
            return err(new AnalysisCancelledError(OPERATION));
        const input = inspectRustBinaryInputSchema.safeParse(rawInput);
        if (!input.success)
            return err(analysisInputErrorFromIssues(OPERATION, input.error.issues, rawInput, {
                cause: input.error,
            }));
        if (!isAbsolute(input.data.path))
            return err(new AnalysisInputError(OPERATION, undefined, [
                {
                    path: ["path"],
                    reason: "invalid_format",
                    message: "Expected an absolute filesystem path on this host.",
                },
            ]));
        const inspected = await this.provider.inspect(input.data, options);
        if (!inspected.ok)
            return inspected;
        if (options?.signal?.aborted)
            return err(new AnalysisCancelledError(OPERATION));
        const report = rustBinarySchema.safeParse(inspected.value);
        if (!report.success || report.data.artifact.path !== input.data.path)
            return err(new AnalysisOutputError(OPERATION, "Rust dependency reader returned malformed metadata or changed the selected artifact identity."));
        return ok(evidenceFor(this.provider.identity, input.data, report.data));
    }
}
const evidenceFor = (provider, parameters, value) => {
    const architecture = architectureForSubject(value.architecture);
    const section = value.auditable_metadata;
    return createEvidence({
        path: value.artifact.path,
        sha256: value.artifact.sha256,
        format: value.format === "macho" ? "mach-o" : value.format,
        ...(architecture === undefined ? {} : { architecture }),
    }, provider, {
        operation: OPERATION,
        parameters,
        result: value,
        confidence: "observed",
        limitations: value.limitations,
        locations: [
            { kind: "artifact-path", path: value.artifact.path },
            ...(section === null
                ? []
                : [
                    {
                        kind: "file-offset-range",
                        start: section.file_offset,
                        end: section.file_offset + section.section_bytes,
                    },
                ]),
        ],
    });
};
