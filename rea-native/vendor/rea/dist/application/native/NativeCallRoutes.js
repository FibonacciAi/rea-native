import { z } from "zod";
import { parseRelatedAddresses, referenceKindSchema, } from "../../domain/hopperValues.js";
import { AnalysisOutputError } from "../../domain/analysisErrorCore.js";
const referencesSchema = z.object({
    reference_kinds_available: z.boolean(),
    references: z.array(z.object({
        source_address: z.string(),
        target_address: z.string(),
        target_procedure: z.object({ address: z.string() }).nullable(),
        kind: referenceKindSchema,
    })),
    unresolved_calls: z.array(z.object({ address: z.string(), reason: z.string() })),
});
/** Prefer typed static call references, preserving computed targets and targetless sites. */
export const readNativeCallRoutes = async (analysis, procedure, signal, selectorOrigin) => {
    const options = {
        ...(signal === undefined ? {} : { signal }),
        ...(selectorOrigin === undefined ? {} : { selectorOrigin }),
    };
    const execution = await analysis.execute("procedure_references", { procedure, direction: "outgoing" }, options);
    let unknowns = [];
    if (execution.ok) {
        const parsed = referencesSchema.safeParse(execution.value.result);
        if (!parsed.success)
            return {
                ok: false,
                error: new AnalysisOutputError("procedure_references", "Invalid typed call references"),
                unknowns,
            };
        // Missing detailed reference flags do not invalidate observed targetless
        // calls. Keep their producing provider even if another provider supplies
        // the fallback callee inventory.
        unknowns = parsed.data.unresolved_calls.map((call) => ({
            ...call,
            provider: execution.value.provider,
        }));
        const references = parsed.data.references;
        if (parsed.data.reference_kinds_available === true ||
            (references.length > 0 && references.every(({ kind }) => kind.available))) {
            const calls = references.filter(({ kind }) => kind.available && kind.call);
            const countBySite = new Map();
            for (const call of calls) {
                const targets = countBySite.get(call.source_address) ?? new Set();
                targets.add(call.target_address);
                countBySite.set(call.source_address, targets);
            }
            return {
                ok: true,
                value: {
                    provider: execution.value.provider,
                    routes: calls.map((call) => ({
                        address: call.target_procedure?.address ?? call.target_address,
                        site: call.source_address,
                        relation: call.kind.available && (call.kind.computed || call.kind.indirect)
                            ? "indirect_call"
                            : "direct_call",
                        resolution: (countBySite.get(call.source_address)?.size ?? 0) > 1
                            ? "ambiguous"
                            : call.kind.available &&
                                (call.kind.computed || call.kind.indirect)
                                ? "resolved"
                                : "observed",
                    })),
                    unknowns,
                },
            };
        }
    }
    else if (execution.error._tag !== "AnalysisCapabilityUnavailableError")
        return { ok: false, error: execution.error, unknowns };
    const callees = await analysis.execute("procedure_callees", { procedure }, options);
    if (!callees.ok)
        return { ok: false, error: callees.error, unknowns };
    const parsed = parseRelatedAddresses(callees.value.result, "callees");
    return parsed.ok
        ? {
            ok: true,
            value: {
                provider: callees.value.provider,
                routes: parsed.value.map((address) => ({
                    address,
                    site: procedure,
                    relation: "provider_call",
                    resolution: "inferred",
                })),
                unknowns,
            },
        }
        : { ok: false, error: parsed.error, unknowns };
};
