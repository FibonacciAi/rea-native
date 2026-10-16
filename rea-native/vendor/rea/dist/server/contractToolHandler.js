import { logToolExecution } from "./toolLogging.js";
import { runAdmittedToolOperation } from "./admittedToolOperation.js";
/**
 * Bind one service-backed handler to its exact named contract through the
 * shared log/execute/record/deliver workflow.
 */
export const createContractToolHandler = (server, service, logger, recordEvidence, withAdmittedAnalysis) => (contract) => createEvidenceToolHandler(server, (input, options) => service.execute(contract.name, input, options), logger, recordEvidence, withAdmittedAnalysis)(contract);
/** Bind a named Evidence-producing operation to shared logging and delivery. */
export const createEvidenceToolHandler = (server, operation, logger, recordEvidence, withAdmittedAnalysis) => (contract) => {
    const name = contract.name;
    return async (input, context) => {
        const executeAndRecord = async () => {
            const result = await logToolExecution(logger, name, () => operation(input, { signal: context.mcpReq.signal }));
            if (!result.ok) {
                const partial = result.error.partialObservation;
                if (partial !== undefined && "evidence_id" in partial) {
                    const recorded = recordEvidence?.(partial);
                    if (recorded !== undefined)
                        return server.delivery.toRecordedPartialErrorToolResult(result.error, partial.evidence_id, recorded, contract.returnsTargetContent);
                }
                return server.delivery.toCallToolResult(result, contract);
            }
            const recorded = recordEvidence?.(result.value);
            return server.delivery.toEvidenceToolResult(result.value, contract, recorded);
        };
        return runAdmittedToolOperation(server, withAdmittedAnalysis, name, context.mcpReq.signal, executeAndRecord);
    };
};
