import { z } from "zod";
import { enhancedInputSchemas } from "../contracts/enhancedInputs.js";
import { AnalysisCancelledError, AnalysisCapabilityUnavailableError, AnalysisOutputError, } from "../domain/analysisErrorCore.js";
import { projectAnalysisError } from "../domain/analysisErrorProjection.js";
import { addressDistance, functionDossierSchema, parseFunctionDossier, parseListCount, parseRelatedAddresses, parseSegments, parseSegmentImageBase, } from "../domain/hopperValues.js";
import { err, ok } from "../domain/result.js";
import { categorizeSwiftTypes, discoverObjcClasses, discoverObjcProtocols, } from "../domain/symbolAnalysis.js";
import { inspectNativeDispatch } from "./native/NativeDispatchMetadataInspection.js";
import { traceNativeValues } from "./native/NativeValueTrace.js";
import { traceNativeUiAction } from "./native/NativeUiActionTrace.js";
import { jsonValueSchema } from "../domain/jsonValue.js";
import { compareUnicodeCodePoints } from "../domain/unicodeCodePointOrder.js";
import { invalidEnhancedInput, } from "./EnhancedToolTypes.js";
import { resolveAnalysisDocument } from "./AnalysisDocument.js";
import { traceCallPath } from "./CallPathTracing.js";
import { resolveProcedureAddress } from "./ProcedureAddressResolution.js";
import { traceLiteralFeature } from "./EnhancedLiteralTracing.js";
import { projectNativeApiInspection } from "./native/NativeApiInspection.js";
const isAnalysisCancellation = (error) => error._tag === "AnalysisCancelledError";
const firstAnalysisCancellation = (results) => {
    for (const result of results)
        if (!result.ok && isAnalysisCancellation(result.error))
            return result.error;
    return undefined;
};
/**
 * Composes direct provider operations into bounded reverse-engineering tools.
 * Direct callers use `execute`; adapters that own validation use
 * `executeValidated` so an MCP input is parsed exactly once.
 */
export class EnhancedTools {
    analysis;
    constructor(analysis) {
        this.analysis = analysis;
    }
    /** Parse an untrusted direct-call input once, then dispatch exhaustively. */
    execute(name, input, signal) {
        if (name === "trace_feature" || name === "trace_call_path")
            return this.#executeTracing(name, input, signal);
        if (name === "trace_native_values") {
            const parsed = enhancedInputSchemas.trace_native_values.safeParse(input);
            return parsed.success
                ? this.executeValidated({ name, input: parsed.data }, signal)
                : invalidEnhancedInput(name, parsed.error);
        }
        if (name === "trace_native_ui_action") {
            const parsed = enhancedInputSchemas.trace_native_ui_action.safeParse(input);
            return parsed.success
                ? this.executeValidated({ name, input: parsed.data }, signal)
                : invalidEnhancedInput(name, parsed.error);
        }
        if (name === "analyze_function" || name === "inspect_native_api")
            return this.#executeFunctionAnalysis(name, input, signal);
        switch (name) {
            case "inspect_native_dispatch_metadata": {
                const parsed = enhancedInputSchemas.inspect_native_dispatch_metadata.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
            case "get_objc_classes": {
                const parsed = enhancedInputSchemas.get_objc_classes.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
            case "get_objc_protocols":
                return this.executeValidated({ name, input: {} }, signal);
            case "batch_decompile": {
                const parsed = enhancedInputSchemas.batch_decompile.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
            case "get_call_graph": {
                const parsed = enhancedInputSchemas.get_call_graph.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
            case "analyze_swift_types": {
                const parsed = enhancedInputSchemas.analyze_swift_types.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
            case "find_xrefs_to_name": {
                const parsed = enhancedInputSchemas.find_xrefs_to_name.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
            case "binary_overview": {
                const parsed = enhancedInputSchemas.binary_overview.safeParse(input);
                return parsed.success
                    ? this.executeValidated({ name, input: parsed.data }, signal)
                    : invalidEnhancedInput(name, parsed.error);
            }
        }
    }
    /** Dispatch input already parsed by a trusted adapter boundary. */
    executeValidated(call, signal) {
        switch (call.name) {
            case "inspect_native_dispatch_metadata":
                return this.#inspectNativeDispatchMetadata(call.input.max_records, signal);
            case "get_objc_classes":
                return this.#objcClasses(call.input.pattern, signal);
            case "get_objc_protocols":
                return this.#objcProtocols(signal);
            case "batch_decompile":
                return this.#batchDecompile(call.input.addresses, signal);
            case "get_call_graph":
                return this.#callGraph(call.input, signal);
            case "analyze_swift_types":
                return this.#analyzeSwiftTypes(call.input, signal);
            case "find_xrefs_to_name":
                return this.#findXrefs(call.input.name, signal);
            case "binary_overview":
                return this.#binaryOverview(signal);
            case "analyze_function":
                return this.#analyzeFunction(call.input, signal);
            case "inspect_native_api":
                return this.#inspectNativeApi(call.input, signal);
            case "trace_feature":
                return traceLiteralFeature((name, arguments_, operationSignal) => this.#call(name, arguments_, operationSignal), (name, arguments_, operationSignal) => this.#observe(name, arguments_, operationSignal), call.input, signal);
            case "trace_call_path":
                return traceCallPath((name, arguments_, operationSignal, selectorOrigin) => this.#call(name, arguments_, operationSignal, selectorOrigin), (name, arguments_, operationSignal, selectorOrigin) => this.#observe(name, arguments_, operationSignal, selectorOrigin), call.input, signal);
            case "trace_native_values":
                return traceNativeValues(this.analysis, call.input, signal);
            case "trace_native_ui_action": {
                return traceNativeUiAction(this.analysis, call.input, signal);
            }
        }
    }
    #executeTracing(name, input, signal) {
        if (name === "trace_call_path") {
            const parsed = enhancedInputSchemas.trace_call_path.safeParse(input);
            if (!parsed.success)
                return invalidEnhancedInput(name, parsed.error);
            return this.executeValidated({ name, input: parsed.data }, signal);
        }
        const parsed = enhancedInputSchemas.trace_feature.safeParse(input);
        if (!parsed.success)
            return invalidEnhancedInput(name, parsed.error);
        return this.executeValidated({ name, input: parsed.data }, signal);
    }
    #executeFunctionAnalysis(name, input, signal) {
        if (name === "analyze_function") {
            const parsed = enhancedInputSchemas.analyze_function.safeParse(input);
            if (!parsed.success)
                return invalidEnhancedInput(name, parsed.error);
            return this.executeValidated({ name, input: parsed.data }, signal);
        }
        const parsed = enhancedInputSchemas.inspect_native_api.safeParse(input);
        if (!parsed.success)
            return invalidEnhancedInput(name, parsed.error);
        return this.executeValidated({ name, input: parsed.data }, signal);
    }
    async #analyzeFunction(input, signal) {
        const result = await this.#call("analyze_function", input, signal);
        return result.ok ? parseFunctionDossier(result.value) : result;
    }
    async #inspectNativeApi(input, signal) {
        const analysisInput = enhancedInputSchemas.analyze_function.parse({
            procedure: input.procedure,
        });
        const result = await this.#call("analyze_function", analysisInput, signal);
        if (!result.ok)
            return result;
        const parsed = parseFunctionDossier(result.value);
        if (!parsed.ok)
            return parsed;
        const dossier = functionDossierSchema.parse(parsed.value);
        return ok(jsonValueSchema.parse(projectNativeApiInspection(dossier)));
    }
    async #objcClasses(pattern, signal) {
        const names = await this.#allAddressed("list_names", signal);
        return names.ok ? ok(discoverObjcClasses(names.value, pattern)) : names;
    }
    #inspectNativeDispatchMetadata(maxRecords, signal) {
        return inspectNativeDispatch(this.analysis, maxRecords, signal);
    }
    async #objcProtocols(signal) {
        const names = await this.#allAddressed("list_names", signal);
        return names.ok ? ok(discoverObjcProtocols(names.value)) : names;
    }
    async #batchDecompile(addresses, signal) {
        const resolutions = await Promise.all(addresses.map(async (address) => {
            const result = await resolveProcedureAddress(this.#call.bind(this), address, signal);
            return { address, result };
        }));
        const resolutionCancellation = firstAnalysisCancellation(resolutions.map(({ result }) => result));
        if (resolutionCancellation !== undefined)
            return err(resolutionCancellation);
        const identities = await this.#batchIdentities(resolutions, signal);
        const ready = [];
        for (const identity of identities) {
            if (!identity.ok)
                return err(identity.error);
            ready.push(identity.value);
        }
        const decompilations = await this.#batchPseudocode(ready, signal);
        const items = [];
        for (const decompilation of decompilations) {
            if (!decompilation.ok)
                return err(decompilation.error);
            items.push(decompilation.value);
        }
        const succeeded = items.filter(({ status }) => status === "ok").length;
        return ok({
            items,
            total: items.length,
            succeeded,
            failed: items.length - succeeded,
        });
    }
    async #batchIdentities(resolutions, signal) {
        return Promise.all(resolutions.map(async ({ address, result }) => {
            if (!result.ok)
                return ok({
                    address,
                    providerProcedure: address,
                    procedure: {
                        status: "unknown",
                        error: projectAnalysisError(result.error),
                    },
                });
            const identity = await this.#batchProcedureIdentity(result.value, signal);
            return identity.ok
                ? ok({
                    address,
                    providerProcedure: result.value,
                    procedure: identity.value,
                })
                : err(identity.error);
        }));
    }
    async #batchPseudocode(ready, signal) {
        return Promise.all(ready.map(async ({ address, procedure, providerProcedure }) => {
            const result = await this.#call("procedure_pseudo_code", { procedure: providerProcedure }, signal, procedure.status === "resolved" ? "provider" : undefined);
            if (!result.ok && isAnalysisCancellation(result.error))
                return err(result.error);
            const item = !result.ok
                ? {
                    address,
                    procedure,
                    status: "error",
                    error: projectAnalysisError(result.error),
                }
                : typeof result.value !== "string" || result.value.length === 0
                    ? {
                        address,
                        procedure,
                        status: "error",
                        error: projectAnalysisError(new AnalysisOutputError("procedure_pseudo_code", "provider returned empty pseudocode")),
                    }
                    : {
                        address,
                        procedure,
                        status: "ok",
                        pseudocode: result.value,
                    };
            return ok(item);
        }));
    }
    async #batchProcedureIdentity(address, signal) {
        const observed = await this.#call("address_name", { address }, signal);
        if (!observed.ok && isAnalysisCancellation(observed.error))
            return err(observed.error);
        const named = observed.ok &&
            (typeof observed.value === "string" || observed.value === null);
        return ok({
            status: "resolved",
            address,
            name: named ? observed.value : null,
            ...(named
                ? {}
                : {
                    name_error: projectAnalysisError(observed.ok
                        ? new AnalysisOutputError("address_name", "provider returned an invalid entry label")
                        : observed.error),
                }),
        });
    }
    async #callGraph(input, signal) {
        const relation = input.direction === "forward" ? "callees" : "callers";
        const tool = input.direction === "forward" ? "procedure_callees" : "procedure_callers";
        const limitations = new Set();
        const resolved = await this.#observe("procedure_address", { procedure: input.address }, signal);
        if (!resolved.ok)
            return resolved;
        for (const limitation of resolved.value.limitations)
            limitations.add(limitation);
        const startAddress = resolved.value.result;
        if (typeof startAddress !== "string" || startAddress.length === 0)
            return err(new AnalysisOutputError("procedure_address", "provider returned no canonical procedure address"));
        const discovered = new Set([startAddress]);
        const queue = [
            { address: startAddress, depth: 0 },
        ];
        let queueIndex = 0;
        const graph = {};
        while (queueIndex < queue.length) {
            const current = queue[queueIndex++];
            if (current === undefined)
                continue;
            const level = String(current.depth);
            graph[level] ??= [];
            const result = await this.#observe(tool, { procedure: current.address }, signal, "provider");
            if (!result.ok) {
                if (isAnalysisCancellation(result.error))
                    return result;
                graph[level].push({
                    address: current.address,
                    status: "error",
                    error: projectAnalysisError(result.error),
                });
                continue;
            }
            const related = parseRelatedAddresses(result.value.result, relation);
            if (!related.ok) {
                graph[level].push({
                    address: current.address,
                    status: "error",
                    error: projectAnalysisError(related.error),
                });
                continue;
            }
            for (const limitation of result.value.limitations)
                limitations.add(limitation);
            const reportedCoverage = result.value.relationshipCoverage;
            const coverage = reportedCoverage ?? {
                status: "unknown",
                reason: "Provider did not report relationship coverage.",
            };
            const relationshipLimitations = reportedCoverage === undefined
                ? [
                    ...result.value.limitations,
                    "Provider did not report relationship coverage.",
                ]
                : [
                    ...(reportedCoverage.status === "partial"
                        ? reportedCoverage.limitations
                        : reportedCoverage.status === "unknown"
                            ? [reportedCoverage.reason]
                            : []),
                    ...("diagnostics" in reportedCoverage
                        ? reportedCoverage.diagnostics
                        : []),
                ];
            const nodeLimitations = [...new Set(relationshipLimitations)].sort(compareUnicodeCodePoints);
            graph[level].push({
                address: current.address,
                status: "ok",
                calls: [...related.value],
                relationship_coverage: coverage,
                ...(nodeLimitations.length === 0
                    ? {}
                    : { limitations: nodeLimitations }),
            });
            for (const address of related.value) {
                if (!discovered.has(address)) {
                    discovered.add(address);
                    queue.push({ address, depth: current.depth + 1 });
                }
            }
        }
        return ok({
            graph,
            limitations: [...limitations].sort(compareUnicodeCodePoints),
        });
    }
    async #analyzeSwiftTypes(input, signal) {
        const procedures = await this.#allAddressed("list_procedures", signal);
        if (!procedures.ok)
            return procedures;
        const symbols = await this.#allAddressed("list_names", signal);
        if (!symbols.ok &&
            !(symbols.error instanceof AnalysisCapabilityUnavailableError))
            return symbols;
        const result = categorizeSwiftTypes(procedures.value, input, symbols.ok ? symbols.value : []);
        return ok(symbols.ok
            ? result
            : {
                ...result,
                symbol_inventory_error: projectAnalysisError(symbols.error),
                limitations: [
                    ...result.limitations,
                    "The provider's symbol inventory is unavailable; demangled procedures could not be joined to their Swift aliases.",
                ],
            });
    }
    async #findXrefs(name, signal) {
        const names = await this.#allAddressed("list_names", signal);
        if (!names.ok)
            return names;
        const resolved = names.value.find((entry) => entry.name === name);
        if (resolved === undefined)
            return ok({ status: "unresolved", name, reason: "name_not_found" });
        const xrefs = await this.#call("xrefs", { address: resolved.address }, signal);
        if (!xrefs.ok)
            return xrefs;
        if (!Array.isArray(xrefs.value) ||
            xrefs.value.some((xref) => typeof xref !== "string"))
            return err(new AnalysisOutputError("xrefs", "provider returned an invalid address list"));
        return ok({
            status: "resolved",
            name,
            address: resolved.address,
            xrefs: xrefs.value,
        });
    }
    async #binaryOverview(signal) {
        const document = await resolveAnalysisDocument(this.analysis, undefined, signal);
        if (!document.ok)
            return document;
        const [segmentsResult, proceduresResult, stringsResult] = await Promise.all([
            this.#call("list_segments", {}, signal),
            this.#call("list_procedures", {}, signal),
            this.#call("list_strings", {}, signal),
        ]);
        if (!segmentsResult.ok &&
            !(segmentsResult.error instanceof AnalysisCapabilityUnavailableError))
            return segmentsResult;
        if (!proceduresResult.ok)
            return proceduresResult;
        if (!stringsResult.ok)
            return stringsResult;
        const segments = segmentsResult.ok
            ? parseSegments(segmentsResult.value)
            : undefined;
        if (segments !== undefined && !segments.ok)
            return segments;
        const procedureCount = parseListCount(proceduresResult.value, "procedures");
        if (!procedureCount.ok)
            return procedureCount;
        const stringCount = parseListCount(stringsResult.value, "strings");
        if (!stringCount.ok)
            return stringCount;
        const observedSegments = segments?.ok ? segments.value : undefined;
        const imageBase = observedSegments === undefined
            ? undefined
            : parseSegmentImageBase(observedSegments);
        return ok({
            document: document.value,
            ...(imageBase === undefined ? {} : { image_base: imageBase }),
            ...(observedSegments === undefined
                ? {}
                : {
                    segments: observedSegments.map(({ name, start, end, image_base, address_space }) => ({
                        name,
                        start,
                        end,
                        length: addressDistance(start, end),
                        ...(image_base === undefined ? {} : { image_base }),
                        ...(address_space === undefined ? {} : { address_space }),
                    })),
                    segment_count: observedSegments.length,
                }),
            procedure_count: procedureCount.value,
            string_count: stringCount.value,
        });
    }
    async #allAddressed(tool, signal) {
        const result = await this.#call(tool, {}, signal);
        if (!result.ok)
            return result;
        const parsed = z
            .array(z.object({ address: z.string(), value: z.string() }))
            .safeParse(result.value);
        return parsed.success
            ? ok(parsed.data.map(({ address, value: name }) => ({ address, name })))
            : err(new AnalysisOutputError(tool, "provider returned an invalid inventory"));
    }
    async #call(name, arguments_, signal, selectorOrigin) {
        const execution = await this.#observe(name, arguments_, signal, selectorOrigin);
        return execution.ok ? ok(execution.value.result) : execution;
    }
    async #observe(name, arguments_, signal, selectorOrigin) {
        if (isAborted(signal))
            return err(new AnalysisCancelledError(name));
        const execution = await this.analysis.execute(name, arguments_, {
            ...(signal === undefined ? {} : { signal }),
            ...(selectorOrigin === undefined ? {} : { selectorOrigin }),
        });
        if (!execution.ok)
            return execution;
        if (isAborted(signal))
            return err(new AnalysisCancelledError(name));
        return execution;
    }
}
const isAborted = (signal) => signal?.aborted === true;
