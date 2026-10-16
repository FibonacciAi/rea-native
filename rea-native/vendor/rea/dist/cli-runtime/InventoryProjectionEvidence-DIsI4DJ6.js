import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { createEvidence, err, init_evidence, init_result, ok } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { AnalysisProtocolError, init_analysisErrorCore, init_jsonValue, jsonValueSchema } from "./errorSchemas-CTRmvMl3.js";
import { init_workflowInputError, requestInputError, workflowInputError } from "./workflowInputError-n8Oo-bLA.js";
import { z } from "zod";

//#region dist/application/InventoryProjectionEvidence.js
var projectInventoryEvidence;
function init_InventoryProjectionEvidence() {
	return (init_InventoryProjectionEvidence = __esmMin((() => {
		init_analysisErrorCore();
		init_evidence();
		init_jsonValue();
		init_result();
		init_workflowInputError();
		projectInventoryEvidence = (options) => {
			const parsed = options.schema.safeParse(options.rawInput);
			if (!parsed.success) return err(requestInputError(options.operation, parsed.error, options.rawInput));
			try {
				const result = options.project(parsed.data);
				const first = parsed.data.inventory_evidence[0];
				return ok(createEvidence(first?.subject === null || first?.subject === undefined ? undefined : {
					path: first.subject.local_path,
					sha256: result.root_sha256,
					format: options.subjectFormat(first)
				}, options.provider, {
					predicateType: options.predicateType,
					operation: options.operation,
					parameters: {
						inventory_evidence_ids: [...result.source_evidence_ids],
						..."limits" in parsed.data && parsed.data.limits !== undefined ? { limits: jsonValueSchema.parse(parsed.data.limits) } : {}
					},
					result: jsonValueSchema.parse(result),
					rawResult: null,
					confidence: "inferred",
					authority: "analyst-inference",
					environment: null,
					limitations: result.limitations,
					evidenceLinks: result.source_evidence_ids
				}));
			} catch (cause) {
				return err(cause instanceof TypeError || cause instanceof z.ZodError ? workflowInputError(options.operation, cause) : new AnalysisProtocolError(options.protocolError, { cause }));
			}
		};
	})))();
}

//#endregion
export { init_InventoryProjectionEvidence, projectInventoryEvidence };