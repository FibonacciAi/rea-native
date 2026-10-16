import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, f as init_analysisErrorCore, g as init_result, h as err, s as AnalysisOutputError } from "./analysisErrorCore-DXRTvF_m.js";
import { i as nulFreeStringSchema, t as init_localPath } from "./localPath-AxvW9aPe.js";
import { c as jsonValueSchema, d as freezeJsonSnapshot, i as prefixedDigestSchema, l as jsonValueValidationIssue, m as isImmutableJsonSnapshot, n as init_digests, o as init_jsonValue, p as init_immutableJson, s as jsonObjectSchema, t as digestSchema, u as jsonValueValidationSteps } from "./digests-BFoWUT_-.js";
import { n as compositeKey, r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { i as init_providerOperationHealth, n as PROVIDER_OPERATION_STATES, r as PROVIDER_RETRY_ACTIONS, t as PROVIDER_FAILURE_STAGES } from "./providerOperationHealth-CTYa3iLf.js";
import { n as init_canonicalDigest, t as digestCanonicalValue } from "./canonicalDigest-Bi_0_zGi.js";
import { basename } from "node:path";
import { z } from "zod";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";

//#region dist/contracts/providerSelection.js
var analysisProviderIdSchema, analysisProviderSelectorSchema, PROVIDER_REJECTION_CODES;
function init_providerSelection() {
	return (init_providerSelection = __esmMin((() => {
		analysisProviderIdSchema = z.string().min(1).regex(/^[a-z][a-z0-9\x2d]*$/u).refine((value) => value !== "auto", { message: "auto is reserved for provider selection" });
		analysisProviderSelectorSchema = z.union([z.literal("auto"), analysisProviderIdSchema]);
		PROVIDER_REJECTION_CODES = [
			"not_configured",
			"executable_missing",
			"runtime_missing",
			"runtime_unavailable",
			"unsupported_host",
			"unsupported_version",
			"target_kind_unsupported",
			"target_format_unsupported",
			"architecture_unsupported",
			"target_role_unsupported",
			"managed_target_unsupported",
			"open_options_invalid",
			"version_unresolved"
		];
	})))();
}

//#endregion
//#region dist/domain/relationshipCoverage.js
var diagnostics, completeCoverage, limitedDirections, partialCoverage, unknownCoverage, relationshipCoverageSchema, relationshipCoverageLimitations;
function init_relationshipCoverage() {
	return (init_relationshipCoverage = __esmMin((() => {
		diagnostics = z.array(z.string().min(1)).min(1).exactOptional();
		completeCoverage = z.strictObject({
			status: z.literal("complete"),
			diagnostics
		});
		limitedDirections = z.union([
			z.tuple([z.literal("callers")]).check(z.minLength(1), z.maxLength(1)),
			z.tuple([z.literal("callees")]).check(z.minLength(1), z.maxLength(1)),
			z.tuple([z.literal("callers"), z.literal("callees")]).check(z.minLength(2), z.maxLength(2))
		]);
		partialCoverage = z.strictObject({
			status: z.literal("partial"),
			limitations: z.array(z.string().min(1)).min(1),
			limited_directions: limitedDirections.exactOptional(),
			diagnostics
		});
		unknownCoverage = z.strictObject({
			status: z.literal("unknown"),
			reason: z.string().min(1),
			limited_directions: limitedDirections.exactOptional(),
			diagnostics
		});
		relationshipCoverageSchema = z.discriminatedUnion("status", [
			completeCoverage,
			partialCoverage,
			unknownCoverage
		]);
		relationshipCoverageLimitations = (coverage) => {
			switch (coverage?.status) {
				case undefined: return ["Provider did not report relationship coverage."];
				case "complete": return [];
				case "partial": return coverage.limitations;
				case "unknown": return [coverage.reason];
			}
		};
	})))();
}

//#endregion
//#region dist/domain/binaryTargetTypes.js
var BINARY_ARCHITECTURES, ELF_METADATA_ARCHITECTURES, isElfMetadataArchitecture, isMachOFormat;
function init_binaryTargetTypes() {
	return (init_binaryTargetTypes = __esmMin((() => {
		BINARY_ARCHITECTURES = [
			"x86",
			"x86_64",
			"arm",
			"arm64",
			"mips",
			"6502",
			"riscv",
			"powerpc"
		];
		ELF_METADATA_ARCHITECTURES = [
			"mips",
			"riscv",
			"powerpc"
		];
		isElfMetadataArchitecture = (architecture) => ELF_METADATA_ARCHITECTURES.includes(architecture);
		isMachOFormat = (format) => format === "mach-o" || format === "mach-o-universal";
	})))();
}

//#endregion
//#region dist/domain/analysisProfile.js
var committedProviderSchema, unsignedAnalysisProfileSchema, analysisProfileSchema, createAnalysisProfile, analysisProfilesEqual, profileDigest, canonicalJson;
function init_analysisProfile() {
	return (init_analysisProfile = __esmMin((() => {
		init_jsonValue();
		init_digests();
		committedProviderSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().min(1)
		});
		unsignedAnalysisProfileSchema = z.strictObject({
			provider: committedProviderSchema,
			parameters: jsonObjectSchema
		});
		analysisProfileSchema = unsignedAnalysisProfileSchema.extend({ digest: digestSchema }).superRefine((profile, context) => {
			const { digest: _digest, ...unsigned } = profile;
			if (profileDigest(unsigned) !== profile.digest) context.addIssue({
				code: "custom",
				path: ["digest"],
				message: "Analysis profile digest does not match its parameters"
			});
		});
		createAnalysisProfile = (provider, parameters) => {
			const unsigned = unsignedAnalysisProfileSchema.parse({
				provider: {
					id: provider.id,
					name: provider.name,
					version: provider.version
				},
				parameters
			});
			return analysisProfileSchema.parse({
				...unsigned,
				digest: profileDigest(unsigned)
			});
		};
		analysisProfilesEqual = (left, right) => left.digest === right.digest && left.provider.id === right.provider.id && left.provider.name === right.provider.name && left.provider.version === right.provider.version;
		profileDigest = (profile) => createHash("sha256").update(canonicalJson(profile)).digest("hex");
		canonicalJson = (value) => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError("RFC 8785 canonicalization rejected analysis profile");
			return encoded;
		};
	})))();
}

//#endregion
//#region dist/domain/native/addressCoordinate.js
var addressCoordinate;
function init_addressCoordinate() {
	return (init_addressCoordinate = __esmMin((() => {
		addressCoordinate = (value) => {
			const separator = value.lastIndexOf(":0x");
			if (separator === 0) return null;
			const space = separator < 0 ? null : value.slice(0, separator);
			const offset = separator < 0 ? value : value.slice(separator + 1);
			if (!/^0x[0-9a-f]+$/u.test(offset)) return null;
			return {
				space,
				offset: BigInt(offset)
			};
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeApiBoundary.js
var inferenceConfidenceSchema, inferenceEvidenceSchema, inferredBoundaryTypeFacts, inferredReturnTypeSchema, inferredParameterTypeSchema, jumpTableDataSourceSchema, jumpTableMappingSchema, jumpTableDefaultTargetSchema, inferredJumpTableSchema, availableNativeApiBoundarySchema, unavailableNativeApiBoundarySchema, nativeApiBoundarySchema, nativeApiInspectionSubstepSchema, nativeApiInspectionResultSchema;
function init_nativeApiBoundary() {
	return (init_nativeApiBoundary = __esmMin((() => {
		inferenceConfidenceSchema = z.enum([
			"low",
			"medium",
			"high"
		]);
		inferenceEvidenceSchema = z.object({
			kind: z.enum([
				"signature-source",
				"decompiler-type",
				"type-lock",
				"calling-convention",
				"jump-table"
			]),
			source: z.string().min(1),
			detail: z.string().min(1)
		}).strict();
		inferredBoundaryTypeFacts = {
			ordinal: z.number().int().min(0).nullable(),
			name: z.string().min(1).nullable(),
			data_type: z.string().min(1),
			size_bytes: z.number().int().min(0).nullable(),
			storage: z.string().min(1).nullable(),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1),
			decompiler_artifacts: z.array(z.enum([
				"recovered-signature",
				"register-or-stack-storage",
				"compiler-generated-variable"
			]))
		};
		inferredReturnTypeSchema = z.strictObject({
			...inferredBoundaryTypeFacts,
			role: z.literal("return"),
			ordinal: z.null(),
			name: z.null()
		});
		inferredParameterTypeSchema = z.strictObject({
			...inferredBoundaryTypeFacts,
			role: z.literal("parameter"),
			ordinal: z.number().int().min(0)
		});
		jumpTableDataSourceSchema = z.object({
			address: z.string().min(1),
			provenance: z.enum([
				"ghidra-decompiler-load-table",
				"ghidra-dispatch-block-data-reference",
				"ghidra-aarch64-byte-table",
				"ghidra-aarch64-halfword-table"
			]),
			entry_size_bytes: z.number().int().min(1).nullable(),
			entry_count: z.number().int().min(0).nullable(),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1)
		}).strict();
		jumpTableMappingSchema = z.object({
			case_value: z.number().int().nullable(),
			target_address: z.string().min(1),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1)
		}).strict();
		jumpTableDefaultTargetSchema = z.strictObject({
			target_address: z.string().min(1),
			confidence: inferenceConfidenceSchema,
			evidence: z.array(inferenceEvidenceSchema).min(1)
		});
		inferredJumpTableSchema = z.object({
			dispatch_address: z.string().min(1),
			data_sources: z.array(jumpTableDataSourceSchema),
			mappings: z.array(jumpTableMappingSchema),
			default_targets: z.array(jumpTableDefaultTargetSchema),
			limitations: z.array(z.string())
		}).strict();
		availableNativeApiBoundarySchema = z.object({
			available: z.literal(true),
			provenance: z.string().min(1),
			signature_source: z.string().min(1),
			calling_convention: z.string().min(1),
			return_type: inferredReturnTypeSchema,
			parameters: z.array(inferredParameterTypeSchema),
			jump_tables: z.array(inferredJumpTableSchema),
			pseudocode: z.object({
				classification: z.literal("decompiler-generated-non-source"),
				compilable: z.literal(false)
			}).strict(),
			decompiler_artifacts: z.array(z.enum([
				"recovered-signature",
				"register-and-stack-variables",
				"compiler-generated-control-flow",
				"pointer-arithmetic",
				"pseudocode"
			])),
			limitations: z.array(z.string())
		}).strict();
		unavailableNativeApiBoundarySchema = z.object({
			available: z.literal(false),
			reason: z.string().min(1),
			residual_unknowns: z.array(z.string().min(1)).min(1)
		}).strict();
		nativeApiBoundarySchema = z.discriminatedUnion("available", [unavailableNativeApiBoundarySchema, availableNativeApiBoundarySchema]);
		nativeApiInspectionSubstepSchema = z.object({
			operation: z.enum([
				"analyze_function",
				"project_native_api_boundary",
				"preserve_residual_unknowns"
			]),
			status: z.enum(["completed", "unsupported"]),
			observations: z.array(z.string().min(1))
		}).strict();
		nativeApiInspectionResultSchema = z.object({
			procedure: z.object({
				address: z.string().min(1),
				name: z.string().min(1)
			}).strict(),
			boundary: nativeApiBoundarySchema,
			substeps: z.array(nativeApiInspectionSubstepSchema).length(3),
			unsupported_branches: z.array(z.string().min(1)),
			residual_unknowns: z.array(z.string().min(1))
		}).strict();
	})))();
}

//#endregion
//#region dist/domain/native/nativeValueFlow.js
var nativeVarnodeSchema, nativePcodeOperationSchema, nativePcodeDefUseSchema, nativePcodeEffectSchema, nativeValueFlowSchema;
function init_nativeValueFlow() {
	return (init_nativeValueFlow = __esmMin((() => {
		nativeVarnodeSchema = z.strictObject({
			kind: z.enum([
				"constant",
				"address",
				"register",
				"unique",
				"other"
			]),
			size_bytes: z.number().int().nonnegative(),
			location: z.string().nullable(),
			constant_hex: z.string().regex(/^[0-9a-f]+$/u).nullable()
		});
		nativePcodeOperationSchema = z.strictObject({
			id: z.string().min(1),
			address: z.string().min(1),
			sequence: z.number().int().nonnegative(),
			opcode: z.string().min(1),
			is_dead: z.boolean(),
			block_membership: z.enum([
				"member",
				"detached",
				"unavailable"
			]),
			inputs: z.array(nativeVarnodeSchema),
			output: nativeVarnodeSchema.nullable()
		});
		nativePcodeDefUseSchema = z.strictObject({
			definition: z.string().min(1),
			use: z.string().min(1),
			input_index: z.number().int().nonnegative()
		});
		nativePcodeEffectSchema = z.strictObject({
			operation: z.string().min(1),
			kind: z.enum([
				"memory_read",
				"memory_write",
				"conditional_branch",
				"indirect_branch",
				"direct_call",
				"indirect_call"
			]),
			operand_input: z.number().int().nonnegative().nullable(),
			value_input: z.number().int().nonnegative().nullable()
		});
		nativeValueFlowSchema = z.discriminatedUnion("available", [z.strictObject({
			available: z.literal(true),
			provenance: z.literal("ghidra-high-pcode"),
			operations: z.array(nativePcodeOperationSchema),
			def_use: z.array(nativePcodeDefUseSchema),
			effects: z.array(nativePcodeEffectSchema),
			parameters: z.array(z.strictObject({
				ordinal: z.number().int().nonnegative(),
				name: z.string(),
				data_type: z.string()
			})),
			parameter_uses: z.array(z.strictObject({
				ordinal: z.number().int().nonnegative(),
				use: z.string(),
				input_index: z.number().int().nonnegative()
			})),
			truncated: z.boolean(),
			omitted_operations_lower_bound: z.number().int().nonnegative(),
			known_omitted_inputs: z.number().int().nonnegative(),
			known_omitted_edges: z.number().int().nonnegative(),
			limitations: z.array(z.string().min(1))
		}), z.strictObject({
			available: z.literal(false),
			reason: z.string().min(1),
			limitations: z.array(z.string().min(1))
		})]);
	})))();
}

//#endregion
//#region dist/domain/hopperValues.js
var addressDistance, procedureMapSchema, addressedNamesSchema, addressedNameMapSchema, segmentSchema, unavailableAnalysisFactSchema, analysisStringSchema, analysisBookmarkSchema, functionBodySchema, functionBodyEntryAgrees, procedureClassificationSchema, procedureIdentitySchema, localVariableSchema, functionInstructionWindowSchema, availableReferenceKindSchema, referenceKindSchema, unresolvedCallSchema, swiftStringLiteralFields, swiftStringLiteralSchema, swiftStringLiteralOmissionFields, swiftStringLiteralOmissionSchema, referenceEdgeSchema, facetAvailabilitySchema, functionDossierSchema, parseFunctionDossier, parseProcedures, parseNames, parseRelatedAddresses, parseSegments, parseSegmentImageBase, parseDocuments, parseListCount, unwrapProperty, invalid;
function init_hopperValues() {
	return (init_hopperValues = __esmMin((() => {
		init_addressCoordinate();
		init_result();
		init_nativeApiBoundary();
		init_nativeValueFlow();
		init_analysisErrorCore();
		addressDistance = (start, end) => {
			const left = addressCoordinate(start);
			const right = addressCoordinate(end);
			if (left === null || right === null || left.space !== right.space) return null;
			const distance = right.offset - left.offset;
			if (distance < 0n || distance > BigInt(Number.MAX_SAFE_INTEGER)) return null;
			return Number(distance);
		};
		procedureMapSchema = z.record(z.string(), z.string());
		addressedNamesSchema = z.array(z.object({
			address: z.string(),
			name: z.string()
		}));
		addressedNameMapSchema = z.record(z.string(), z.string());
		segmentSchema = z.object({
			name: z.string(),
			start: z.string(),
			end: z.string(),
			readable: z.boolean().nullable(),
			writable: z.boolean().nullable(),
			executable: z.boolean().nullable(),
			image_base: z.string().min(1).exactOptional(),
			address_space: z.string().min(1).exactOptional()
		});
		unavailableAnalysisFactSchema = z.object({
			available: z.literal(false),
			reason: z.string()
		}).strict();
		analysisStringSchema = z.object({
			address: z.string(),
			value: z.string(),
			provider_value: z.string().exactOptional().describe("Original provider display text, which may shorten the typed object."),
			decoding: unavailableAnalysisFactSchema.exactOptional().describe("When present, value retains native display text because typed bytes could not be decoded."),
			string: z.object({
				encoding: z.string().min(1),
				encoding_status: z.enum(["observed", "inferred"]).exactOptional().describe("Whether the provider declares the encoding or REA infers it from the typed bytes and native display. This does not establish the original source's intended encoding."),
				termination: z.enum(["missing", "present_or_not_required"]),
				byte_length: z.number().int().min(0)
			}).exactOptional()
		});
		analysisBookmarkSchema = z.strictObject({
			address: z.string(),
			name: z.string().nullable()
		});
		functionBodySchema = z.discriminatedUnion("available", [unavailableAnalysisFactSchema, z.strictObject({
			available: z.literal(true),
			provenance: z.string().min(1),
			ranges: z.array(z.strictObject({
				start: z.string(),
				end: z.string().describe("Inclusive last address of this observed body range.")
			})),
			total_bytes: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			span_bytes: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			non_contiguous: z.boolean(),
			contains_entry: z.boolean()
		}).superRefine((body, context) => {
			let total = 0n;
			const bounds = new Map();
			const closedSpaces = new Set();
			let previousSpace;
			for (const range of body.ranges) {
				const start = addressCoordinate(range.start);
				const end = addressCoordinate(range.end);
				if (start === null || end === null || start.space !== end.space || end.offset < start.offset) {
					context.addIssue({
						code: "custom",
						message: "Function body range has invalid inclusive endpoints"
					});
					return;
				}
				if (previousSpace !== undefined && previousSpace !== start.space) closedSpaces.add(previousSpace);
				const previous = bounds.get(start.space);
				if (closedSpaces.has(start.space) || previous !== undefined && start.offset <= previous.end + 1n) {
					context.addIssue({
						code: "custom",
						message: "Function body ranges must be ordered, disjoint and maximal within each address space"
					});
					return;
				}
				bounds.set(start.space, {
					start: previous?.start ?? start.offset,
					end: end.offset
				});
				previousSpace = start.space;
				total += end.offset - start.offset + 1n;
			}
			const onlyBounds = bounds.size === 1 ? [...bounds.values()][0] : undefined;
			const span = bounds.size === 0 ? 0n : onlyBounds === undefined ? null : onlyBounds.end - onlyBounds.start + 1n;
			const reportedSpan = body.span_bytes === null ? null : BigInt(body.span_bytes);
			if (total !== BigInt(body.total_bytes) || span !== reportedSpan || body.non_contiguous !== body.ranges.length > 1) context.addIssue({
				code: "custom",
				message: "Function body counts, enclosing span or contiguity disagree with inclusive ranges"
			});
		})]);
		functionBodyEntryAgrees = (body, address) => {
			if (!body.available) return true;
			const entry = addressCoordinate(address);
			if (entry === null) return false;
			const contains = body.ranges.some((range) => {
				const start = addressCoordinate(range.start);
				const end = addressCoordinate(range.end);
				return start !== null && end !== null && start.space === entry.space && entry.offset >= start.offset && entry.offset <= end.offset;
			});
			return contains === body.contains_entry;
		};
		procedureClassificationSchema = z.object({
			external: z.boolean(),
			thunk: z.boolean(),
			thunk_target: z.string().nullable(),
			provenance: z.string().min(1)
		}).strict();
		procedureIdentitySchema = z.object({
			address: z.string(),
			name: z.string(),
			classification: procedureClassificationSchema.nullable(),
			body: functionBodySchema
		}).strict().superRefine((identity, context) => {
			if (!functionBodyEntryAgrees(identity.body, identity.address)) context.addIssue({
				code: "custom",
				message: "Function body entry membership disagrees with procedure identity"
			});
		});
		localVariableSchema = z.object({
			description: z.string(),
			provenance: z.string().min(1),
			name: z.string().nullable().exactOptional(),
			stack_displacement: z.string().regex(/^-?\d+$/u).nullable().exactOptional().describe("Observed signed stack byte displacement, encoded as decimal to preserve precision.")
		}).strict();
		functionInstructionWindowSchema = z.object({
			procedure: procedureIdentitySchema,
			instructions: z.array(z.string()),
			limitations: z.array(z.string())
		}).strict();
		availableReferenceKindSchema = z.object({
			available: z.literal(true),
			provenance: z.string().min(1),
			type: z.string(),
			flow: z.boolean(),
			call: z.boolean(),
			jump: z.boolean(),
			data: z.boolean(),
			read: z.boolean(),
			write: z.boolean(),
			indirect: z.boolean(),
			computed: z.boolean(),
			conditional: z.boolean(),
			terminal: z.boolean(),
			primary: z.boolean(),
			operand_index: z.number().int(),
			external: z.boolean()
		}).strict();
		referenceKindSchema = z.discriminatedUnion("available", [unavailableAnalysisFactSchema, availableReferenceKindSchema]);
		unresolvedCallSchema = z.strictObject({
			address: z.string(),
			reason: z.string()
		});
		swiftStringLiteralFields = {
			source_address: z.string().describe("Instruction that consumes both words: a call, tail call, return, or paired store."),
			value: z.string().describe("Decoded UTF-8 text, including the canonical empty string."),
			registers: z.tuple([z.string(), z.string()]),
			words: z.tuple([z.string(), z.string()]).describe("Observed constant register values, in register order.")
		};
		swiftStringLiteralSchema = z.discriminatedUnion("representation", [z.strictObject({
			...swiftStringLiteralFields,
			representation: z.literal("small").describe("The UTF-8 bytes are inside the two words."),
			address: z.null().describe("A small literal has no storage of its own.")
		}), z.strictObject({
			...swiftStringLiteralFields,
			representation: z.literal("large").describe("An immortal literal whose words hold its count and a pointer to its bytes."),
			address: z.string().describe("Address of a large literal's bytes.")
		})]);
		swiftStringLiteralOmissionFields = {
			source_address: swiftStringLiteralFields.source_address,
			byte_length: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			reason: z.enum(["capacity", "unresolved_jump"]).describe("Why this candidate is omitted: capacity stopped decoding, or an unresolved jump left its use unknown."),
			registers: swiftStringLiteralFields.registers,
			words: swiftStringLiteralFields.words
		};
		swiftStringLiteralOmissionSchema = z.discriminatedUnion("representation", [z.strictObject({
			...swiftStringLiteralOmissionFields,
			representation: z.literal("small"),
			address: z.null()
		}), z.strictObject({
			...swiftStringLiteralOmissionFields,
			representation: z.literal("large"),
			address: z.string().describe("Address of the literal's bytes.")
		})]);
		referenceEdgeSchema = z.object({
			source_address: z.string(),
			target_address: z.string(),
			source_procedure: procedureIdentitySchema.nullable(),
			target_procedure: procedureIdentitySchema.nullable(),
			kind: referenceKindSchema,
			call: z.strictObject({
				classification: z.enum([
					"none",
					"unknown",
					"direct",
					"objective_c"
				]),
				provider_type: z.number().int(),
				provenance: z.string().min(1)
			}).exactOptional()
		}).strict();
		facetAvailabilitySchema = z.discriminatedUnion("available", [z.object({ available: z.literal(true) }).strict(), z.object({
			available: z.literal(false),
			reason: z.string().min(1)
		}).strict()]);
		functionDossierSchema = z.object({
			procedure: procedureIdentitySchema.safeExtend({
				signature: z.string().nullable(),
				locals: z.array(localVariableSchema)
			}),
			pseudocode: z.string(),
			assembly: z.array(z.string()),
			comments: z.array(z.object({
				address: z.string(),
				kind: z.enum(["comment", "inline"]),
				text: z.string()
			}).strict()),
			callers: z.array(procedureIdentitySchema),
			callees: z.array(procedureIdentitySchema),
			incoming_references: z.array(referenceEdgeSchema),
			outgoing_references: z.array(referenceEdgeSchema),
			unresolved_calls: z.array(unresolvedCallSchema).exactOptional(),
			referenced_strings: z.array(analysisStringSchema.extend({ source_address: z.string() })),
			referenced_names: z.array(z.object({
				address: z.string(),
				value: z.string(),
				source_address: z.string()
			}).strict()),
			swift_string_literals: z.array(swiftStringLiteralSchema).exactOptional().describe("Swift String literals decoded from constant register values. Absent when the provider does not decode them for this target."),
			swift_string_literal_omissions: z.array(swiftStringLiteralOmissionSchema).exactOptional().describe("Literal candidates omitted for capacity or unresolved control flow. Present exactly when swift_string_literals is present; empty when all examined use sites were classified."),
			basic_blocks: z.array(z.object({
				start: z.string(),
				end: z.string(),
				successors: z.array(z.string())
			}).strict()),
			native_api: nativeApiBoundarySchema.nullable(),
			native_value_flow: nativeValueFlowSchema.nullable(),
			facet_availability: z.object({
				pseudocode: facetAvailabilitySchema.exactOptional(),
				assembly: facetAvailabilitySchema.exactOptional(),
				comments: facetAvailabilitySchema.exactOptional(),
				callers: facetAvailabilitySchema.exactOptional(),
				callees: facetAvailabilitySchema.exactOptional(),
				references: facetAvailabilitySchema.exactOptional(),
				strings_names: facetAvailabilitySchema.exactOptional(),
				cfg: facetAvailabilitySchema.exactOptional()
			}).strict().exactOptional(),
			limitations: z.array(z.string())
		}).strict();
		parseFunctionDossier = (value) => {
			const parsed = functionDossierSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new AnalysisOutputError("analyze_function", "provider output did not match the dossier contract", { cause: parsed.error }));
		};
		parseProcedures = (value, operation = "list_procedures") => {
			const parsed = procedureMapSchema.safeParse(unwrapProperty(value, "procedures"));
			return parsed.success ? ok(Object.entries(parsed.data).map(([address, name]) => ({
				address,
				name
			}))) : invalid(operation, "procedure map", parsed.error);
		};
		parseNames = (value, operation = "list_names") => {
			const unwrapped = unwrapProperty(value, "names");
			const records = addressedNamesSchema.safeParse(unwrapped);
			if (records.success) return ok(records.data);
			const map = addressedNameMapSchema.safeParse(unwrapped);
			return map.success ? ok(Object.entries(map.data).map(([address, name]) => ({
				address,
				name
			}))) : invalid(operation, "name list", map.error);
		};
		parseRelatedAddresses = (value, relation, operation = relation === "callees" ? "procedure_callees" : "procedure_callers") => {
			const parsed = z.array(z.string()).safeParse(unwrapProperty(value, relation));
			return parsed.success ? ok(parsed.data) : invalid(operation, `${relation} list`, parsed.error);
		};
		parseSegments = (value, operation = "list_segments") => {
			const parsed = z.array(segmentSchema).safeParse(unwrapProperty(value, "segments"));
			return parsed.success ? ok(parsed.data) : invalid(operation, "segment list", parsed.error);
		};
		parseSegmentImageBase = (segments) => {
			const base = segments[0]?.image_base;
			return base !== undefined && segments.every((segment) => segment.image_base === base) ? base : undefined;
		};
		parseDocuments = (value, operation = "list_documents") => {
			const parsed = z.array(z.string()).safeParse(unwrapProperty(value, "documents"));
			return parsed.success ? ok(parsed.data) : invalid(operation, "document list", parsed.error);
		};
		parseListCount = (value, property, operation = property === "procedures" ? "list_procedures" : "list_strings") => {
			const unwrapped = unwrapProperty(value, property);
			const list = z.array(z.unknown()).safeParse(unwrapped);
			if (list.success) return ok(list.data.length);
			const map = z.record(z.string(), z.unknown()).safeParse(unwrapped);
			return map.success ? ok(Object.keys(map.data).length) : invalid(operation, `${property} list`, map.error);
		};
		unwrapProperty = (value, property) => {
			if (typeof value === "object" && value !== null && !Array.isArray(value) && property in value) {
				return value[property] ?? null;
			}
			return value;
		};
		invalid = (operation, expected, cause) => err(new AnalysisOutputError(operation, `Provider returned an invalid ${expected}`, { cause }));
	})))();
}

//#endregion
//#region dist/domain/native/nativeInstruction.js
var nativeInstructionInputSchema, reference, nativeInstructionSchema, nativeCallTargetsSchema;
function init_nativeInstruction() {
	return (init_nativeInstruction = __esmMin((() => {
		nativeInstructionInputSchema = z.strictObject({
			address: z.string().min(1),
			document: z.string().optional()
		});
		reference = z.strictObject({
			target_address: z.string(),
			type: z.string(),
			call: z.boolean(),
			jump: z.boolean(),
			indirect: z.boolean(),
			computed: z.boolean(),
			operand_index: z.number().int(),
			source_address: z.string().min(1).nullable().optional(),
			data: z.boolean().nullable().optional(),
			read: z.boolean().nullable().optional(),
			write: z.boolean().nullable().optional(),
			primary: z.boolean().nullable().optional().describe("Provider primary-reference status, not proof of literal addressing or a runtime access. Null or omission means unavailable."),
			provenance: z.string().min(1).nullable().optional().describe("Provider subsystem reporting this reference; null or omission means unavailable."),
			source: z.string().min(1).nullable().optional().describe("Provider reference origin, such as analysis, default, imported or user_defined; null or omission means unavailable.")
		});
		nativeInstructionSchema = z.strictObject({
			address: z.string(),
			status: z.enum([
				"decoded",
				"not-instruction-boundary",
				"data",
				"undecodable",
				"outside-memory"
			]),
			procedure: z.string().nullable(),
			architecture: z.string(),
			mode: z.string().describe("Provider-reported mode label. Per-address decoder context, when available, is reported separately; a program-wide label does not establish runtime encoding mode."),
			decoder_context: z.array(z.strictObject({
				register: z.string().min(1),
				value: z.string().min(1).nullable(),
				source: z.string().min(1)
			})).optional().describe("Observed per-address decoder context. Null means no value was available; omission means the provider or older capture does not expose this facet. The separate mode field retains the program language variant."),
			bytes: z.string().nullable(),
			length: z.number().int().positive().nullable(),
			mnemonic: z.string().nullable(),
			raw_disassembly: z.string().nullable(),
			operands: z.array(z.strictObject({
				index: z.number().int().nonnegative(),
				raw: z.string(),
				provider_type: z.number().int(),
				components: z.array(z.strictObject({
					kind: z.enum([
						"register",
						"immediate",
						"address",
						"unknown"
					]),
					text: z.string(),
					value: z.string().nullable(),
					bit_width: z.number().int().nonnegative().nullable()
				})),
				memory_addressing: z.literal("unavailable")
			})),
			flow: z.strictObject({
				kind: z.enum([
					"call",
					"jump",
					"return",
					"fallthrough",
					"terminal",
					"unavailable"
				]),
				conditional: z.boolean(),
				computed: z.boolean(),
				direct_destinations: z.array(z.string()),
				classification_evidence: z.array(z.strictObject({
					source: z.string().min(1),
					value: z.string().min(1)
				})).optional().describe("Observed provider facts used to classify flow; older captures or other providers may omit them.")
			}),
			references: z.array(reference),
			incoming_references: z.array(reference).nullable().optional().describe("Static references to this exact code or data address, excluding synthetic entry-point references. An empty array means the provider examined the address and found none; null or omission means unavailable. Analyzer references do not prove literal addressing or runtime access."),
			limitations: z.array(z.string())
		});
		nativeCallTargetsSchema = z.strictObject({
			call_site: z.string(),
			procedure: z.string().nullable(),
			status: z.enum([
				"direct",
				"resolved-indirect",
				"ambiguous",
				"unresolved",
				"not-call",
				"unavailable"
			]),
			mechanism: z.enum([
				"direct",
				"computed",
				"indirect",
				"unavailable"
			]),
			targets: z.array(z.strictObject({
				address: z.string(),
				procedure: z.string().nullable(),
				status: z.enum([
					"direct",
					"resolved-indirect",
					"candidate"
				]),
				basis: z.literal("provider-reference"),
				references: z.array(reference)
			})),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/canonicalJsonDigestSteps.js
/** Hash owned, validated JSON in bounded steps without a document-sized string. */
function* canonicalJsonDigestSteps(value) {
	const hash = createHash("sha256");
	const ancestors = new Set();
	const stack = [{
		kind: "value",
		value
	}];
	const encodedKeys = new Map();
	let remainingKeyCodeUnits = 8192;
	let buffered = "";
	let flushed = false;
	const emit = (part) => {
		buffered += part;
		if (buffered.length >= 8192) {
			hash.update(buffered);
			buffered = "";
			flushed = true;
		}
	};
	try {
		while (stack.length > 0) {
			if (flushed) {
				flushed = false;
				yield;
			}
			const frame = stack.pop();
			if (frame === undefined) break;
			if (frame.kind === "separator") {
				emit(":");
				continue;
			}
			if (frame.kind === "string") {
				if (frame.index === frame.value.length) {
					emit("\"");
					continue;
				}
				let end = Math.min(frame.index + 8192, frame.value.length);
				const last = frame.value.charCodeAt(end - 1);
				const next = frame.value.charCodeAt(end);
				if (end < frame.value.length && last >= 55296 && last <= 56319 && next >= 56320 && next <= 57343) end -= 1;
				emit(JSON.stringify(frame.value.slice(frame.index, end)).slice(1, -1));
				frame.index = end;
				stack.push(frame);
				continue;
			}
			let item;
			if (frame.kind === "array") {
				if (frame.index === frame.length) {
					emit("]");
					ancestors.delete(frame.value);
					continue;
				}
				const element = frame.value[frame.index];
				if (element === undefined) throw new TypeError("Canonical JSON digest requires dense JSON arrays");
				if (frame.index++ > 0) emit(",");
				stack.push(frame);
				item = element;
			} else if (frame.kind === "object") {
				if (frame.index === frame.keys.length) {
					emit("}");
					ancestors.delete(frame.value);
					continue;
				}
				const key = frame.keys[frame.index++];
				if (key === undefined) throw new TypeError("Canonical JSON object changed during hashing");
				const property = frame.value[key];
				if (property === undefined) {
					stack.push(frame);
					continue;
				}
				if (frame.written++ > 0) emit(",");
				if (key.length > 8192) {
					emit("\"");
					stack.push(frame, {
						kind: "value",
						value: property
					}, { kind: "separator" }, {
						kind: "string",
						value: key,
						index: 0
					});
					continue;
				}
				let encodedKey = encodedKeys.get(key);
				if (encodedKey === undefined) {
					encodedKey = JSON.stringify(key);
					if (encodedKey.length <= remainingKeyCodeUnits) {
						encodedKeys.set(key, encodedKey);
						remainingKeyCodeUnits -= encodedKey.length;
					}
				}
				emit(encodedKey);
				emit(":");
				stack.push(frame);
				item = property;
			} else {
				item = frame.value;
			}
			if (flushed) {
				flushed = false;
				yield;
			}
			if (typeof item === "string" && item.length > 8192) {
				emit("\"");
				stack.push({
					kind: "string",
					value: item,
					index: 0
				});
			} else if (item === null || typeof item !== "object") {
				if (typeof item === "number" && !Number.isFinite(item)) throw new Error(Number.isNaN(item) ? "NaN is not allowed" : "Infinity is not allowed");
				emit(JSON.stringify(item));
			} else {
				if (ancestors.has(item)) throw new Error("Circular reference detected");
				ancestors.add(item);
				if (Array.isArray(item)) {
					emit("[");
					stack.push({
						kind: "array",
						value: item,
						length: item.length,
						index: 0
					});
				} else {
					emit("{");
					stack.push({
						kind: "object",
						value: item,
						keys: Object.keys(item).sort(),
						index: 0,
						written: 0
					});
				}
			}
		}
		if (buffered !== "") hash.update(buffered);
		return hash.digest("hex");
	} finally {
		stack.length = 0;
		ancestors.clear();
		encodedKeys.clear();
		buffered = "";
	}
}
function init_canonicalJsonDigestSteps() {
	return (init_canonicalJsonDigestSteps = __esmMin((() => {})))();
}

//#endregion
//#region dist/domain/evidence.js
/** Create Evidence from owned immutable JSON while exposing cooperative computation steps. */
function* createImmutableEvidenceSteps(target, provider, observation) {
	if (!isImmutableJsonSnapshot(observation.result)) throw new TypeError("Cooperative Evidence requires an authenticated immutable result");
	yield* jsonValueValidationSteps(observation.result);
	const { normalized } = normalizeEvidenceObservation(target, provider, observation);
	const digest = yield* canonicalJsonDigestSteps(semanticProjection(normalized));
	return rememberImmutableEvidence({
		...normalized,
		evidence_id: `ev_${digest}`
	});
}
var providerSchema, subjectFormatSchema, subjectBaseSchema, subjectSchema, evidenceLocationSchema, evidenceAuthoritySchema, executionEnvironmentSchema, evidenceBaseSchema, validateAnalysisProfileProvider, evidenceSchema, authenticatedEvidenceSchema, immutableEvidenceSnapshots, immutableResultSchema, rebindEvidenceSubjectTargetPath, semanticProjection, computeEvidenceId, parseEvidence, immutableEvidence, rebindEvidenceToTargetPath, isImmutableEvidence, rememberImmutableEvidence, createEvidence, normalizeEvidenceObservation;
function init_evidence() {
	return (init_evidence = __esmMin((() => {
		init_canonicalDigest();
		init_canonicalJsonDigestSteps();
		init_localPath();
		init_analysisProfile();
		init_binaryTargetTypes();
		init_jsonValue();
		init_immutableJson();
		init_digests();
		init_relationshipCoverage();
		providerSchema = z.strictObject({
			id: z.string().min(1),
			name: z.string().min(1),
			version: z.string().nullable()
		});
		subjectFormatSchema = z.enum([
			"hopper",
			"analysis-database",
			"mach-o",
			"elf",
			"pe",
			"dos-mz",
			"dos-com",
			"raw-binary",
			"zip",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack",
			"asar",
			"dmg",
			"pkg",
			"plist",
			"javascript",
			"source-map",
			"directory",
			"file",
			"unknown",
			"mach-o-universal",
			"javascript-bundle",
			"entitlements"
		]);
		subjectBaseSchema = z.strictObject({
			name: z.string().min(1),
			digest: z.strictObject({ sha256: digestSchema }),
			local_path: nulFreeStringSchema
		});
		subjectSchema = z.discriminatedUnion("format", [subjectBaseSchema.extend({
			format: subjectFormatSchema.exclude(["raw-binary"]),
			architecture: z.enum(BINARY_ARCHITECTURES).exclude(["6502"]).nullable()
		}), subjectBaseSchema.extend({
			format: z.literal("raw-binary"),
			architecture: z.enum(BINARY_ARCHITECTURES).nullable()
		})]);
		evidenceLocationSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("address"),
				address: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("address-range"),
				start: z.string().min(1),
				end: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("artifact-path"),
				path: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("file-offset"),
				offset: z.number().int().min(0)
			}),
			z.strictObject({
				kind: z.literal("file-offset-range"),
				start: z.number().int().min(0),
				end: z.number().int().min(0)
			})
		]);
		evidenceAuthoritySchema = z.enum([
			"shipped-artifact",
			"controlled-replay",
			"historical-reference",
			"external-service",
			"analyst-inference"
		]);
		executionEnvironmentSchema = z.strictObject({
			id: z.string().min(1),
			platform: z.string().min(1),
			architecture: z.string().min(1),
			isolation: z.enum([
				"none",
				"process",
				"container",
				"virtual-machine"
			])
		});
		evidenceBaseSchema = z.object({
			evidence_id: prefixedDigestSchema("ev"),
			subject: subjectSchema.nullable(),
			provider: providerSchema,
			analysis_profile: analysisProfileSchema.nullable(),
			predicate_type: z.string().min(1),
			operation: z.string().min(1),
			parameters: jsonObjectSchema,
			raw_result: jsonValueSchema.nullable(),
			normalized_result: jsonValueSchema,
			confidence: z.enum([
				"observed",
				"derived",
				"inferred"
			]),
			authority: evidenceAuthoritySchema,
			environment: executionEnvironmentSchema.nullable(),
			limitations: z.array(z.string()),
			relationship_coverage: relationshipCoverageSchema.nullable().default(null),
			locations: z.array(evidenceLocationSchema),
			evidence_links: z.array(prefixedDigestSchema("ev"))
		}).strict();
		validateAnalysisProfileProvider = (evidence, context) => {
			const profile = evidence.analysis_profile;
			if (profile !== null && (profile.provider.id !== evidence.provider.id || profile.provider.name !== evidence.provider.name || profile.provider.version !== evidence.provider.version)) context.addIssue({
				code: "custom",
				path: ["analysis_profile", "provider"],
				message: "Analysis profile provider does not match Evidence provider"
			});
		};
		evidenceSchema = evidenceBaseSchema.superRefine(validateAnalysisProfileProvider);
		authenticatedEvidenceSchema = evidenceSchema.superRefine((evidence, context) => {
			const { evidence_id: evidenceId, ...withoutId } = evidence;
			if (computeEvidenceId(withoutId) !== evidenceId) context.addIssue({
				code: "custom",
				path: ["evidence_id"],
				message: "Evidence semantic identifier does not match its record"
			});
		});
		immutableEvidenceSnapshots = new WeakMap();
		immutableResultSchema = z.custom(isImmutableJsonSnapshot).superRefine((value, context) => {
			const issue = jsonValueValidationIssue(value);
			if (issue !== undefined) context.addIssue({
				code: "custom",
				message: issue
			});
		});
		rebindEvidenceSubjectTargetPath = (subject, target) => subject.sha256 === target.sha256 && subject.format === target.format && (subject.architecture ?? null) === (target.architecture ?? null) ? {
			...subject,
			path: target.path
		} : subject;
		semanticProjection = (evidence) => ({
			subject: evidence.subject === null ? null : {
				digest: evidence.subject.digest,
				format: evidence.subject.format,
				architecture: evidence.subject.architecture
			},
			provider: evidence.provider,
			analysis_profile: evidence.analysis_profile,
			predicate_type: evidence.predicate_type,
			operation: evidence.operation,
			parameters: evidence.parameters,
			raw_result: evidence.raw_result,
			normalized_result: evidence.normalized_result,
			confidence: evidence.confidence,
			authority: evidence.authority,
			environment: evidence.environment,
			limitations: evidence.limitations,
			...evidence.relationship_coverage === null ? {} : { relationship_coverage: evidence.relationship_coverage },
			locations: evidence.locations,
			evidence_links: evidence.evidence_links
		});
		computeEvidenceId = (evidence) => `ev_${digestCanonicalValue(semanticProjection(evidence), "Evidence")}`;
		parseEvidence = (input) => {
			const immutable = typeof input === "object" && input !== null ? immutableEvidenceSnapshots.get(input) : undefined;
			if (immutable !== undefined) return immutable;
			return authenticatedEvidenceSchema.parse(input);
		};
		immutableEvidence = (input) => rememberImmutableEvidence(parseEvidence(input));
		rebindEvidenceToTargetPath = (evidence, target) => {
			const subject = evidence.subject;
			if (subject === null) return evidence;
			const rebound = rebindEvidenceSubjectTargetPath({
				path: subject.local_path,
				sha256: subject.digest.sha256,
				format: subject.format,
				...subject.architecture === null ? {} : { architecture: subject.architecture }
			}, target);
			if (rebound.path === subject.local_path) return evidence;
			const reboundSubject = subjectSchema.parse({
				...subject,
				name: basename(target.path) || "artifact",
				local_path: target.path
			});
			const reboundEvidence = {
				...evidence,
				subject: reboundSubject
			};
			if (!isImmutableEvidence(evidence)) return immutableEvidence(reboundEvidence);
			Object.freeze(reboundSubject.digest);
			Object.freeze(reboundSubject);
			Object.freeze(reboundEvidence);
			immutableEvidenceSnapshots.set(reboundEvidence, reboundEvidence);
			return reboundEvidence;
		};
		isImmutableEvidence = (evidence) => immutableEvidenceSnapshots.has(evidence);
		rememberImmutableEvidence = (evidence) => {
			freezeJsonSnapshot(evidence);
			immutableEvidenceSnapshots.set(evidence, evidence);
			return evidence;
		};
		createEvidence = (target, provider, observation) => {
			const { normalized, sharedResult } = normalizeEvidenceObservation(target, provider, observation);
			const evidence = {
				...normalized,
				evidence_id: computeEvidenceId(normalized)
			};
			return sharedResult ? rememberImmutableEvidence(evidence) : evidence;
		};
		normalizeEvidenceObservation = (target, provider, observation) => {
			const subject = target === undefined ? null : {
				name: basename(target.path) || "artifact",
				digest: { sha256: target.sha256 },
				format: target.format,
				architecture: target.architecture ?? null,
				local_path: target.path
			};
			const semantic = {
				subject: subject === null ? null : {
					digest: subject.digest,
					format: subject.format,
					architecture: subject.architecture
				},
				provider: {
					id: provider.id,
					name: provider.name,
					version: provider.version
				},
				analysis_profile: observation.analysisProfile ?? null,
				predicate_type: observation.predicateType ?? "rea.analysis",
				operation: observation.operation,
				parameters: observation.parameters,
				raw_result: observation.rawResult ?? null,
				normalized_result: observation.result,
				confidence: observation.confidence ?? "observed",
				authority: observation.authority ?? "shipped-artifact",
				environment: observation.environment ?? null,
				limitations: [...target === undefined ? [observation.subjectUnavailableReason ?? "Artifact identity is unavailable for this observation."] : [], ...observation.limitations ?? []],
				...observation.relationshipCoverage === undefined ? { relationship_coverage: null } : { relationship_coverage: observation.relationshipCoverage },
				locations: [...observation.locations ?? []],
				evidence_links: [...observation.evidenceLinks ?? []]
			};
			const sharedResult = typeof observation.result === "object" && observation.result !== null && isImmutableJsonSnapshot(observation.result);
			const selectedSchema = sharedResult ? evidenceSchema.safeExtend({ normalized_result: immutableResultSchema }) : evidenceSchema;
			const normalized = selectedSchema.parse({
				...semantic,
				evidence_id: `ev_${"0".repeat(64)}`,
				subject
			});
			return {
				normalized,
				sharedResult
			};
		};
	})))();
}

//#endregion
//#region dist/contracts/errorSchemas.js
var categorySchema, remediationSchema, common, genericDetails, generic, analysisErrorProjectionSchema, analysisCliErrorEnvelopeSchema, analysisErrorJsonSchema;
function init_errorSchemas() {
	return (init_errorSchemas = __esmMin((() => {
		init_jsonValue();
		categorySchema = z.enum([
			"invalid_input",
			"unsupported_provider",
			"unsupported_target",
			"integrity_mismatch",
			"truncated",
			"cancelled",
			"timeout",
			"resource_constraint",
			"unavailable",
			"execution_failure"
		]);
		remediationSchema = z.object({ action: z.string().min(1) }).strict();
		common = {
			category: categorySchema,
			message: z.string().min(1),
			retryable: z.boolean(),
			remediation: remediationSchema
		};
		genericDetails = z.record(z.string(), jsonValueSchema).optional();
		generic = (code) => z.object({
			code: z.literal(code),
			...common,
			details: genericDetails
		}).strict();
		analysisErrorProjectionSchema = z.discriminatedUnion("code", [
			generic("invalid_request"),
			generic("access_denied"),
			generic("artifact_changed"),
			generic("unreadable_output"),
			generic("capability_unavailable"),
			generic("unsupported_target"),
			generic("provider_unavailable"),
			generic("provider_timeout"),
			generic("resource_constraint"),
			generic("cancelled"),
			z.object({
				code: z.literal("artifact_integrity_mismatch"),
				...common,
				details: z.object({
					logical_path: z.string(),
					declared_sha256: z.string().nullable(),
					calculated_sha256: z.string().nullable(),
					unpacked: z.boolean()
				}).strict()
			}).strict(),
			generic("artifact_operation_failed"),
			generic("evidence_integrity_mismatch"),
			generic("truncated"),
			generic("process_capture_failed"),
			generic("cleanup_incomplete"),
			generic("revision_conflict"),
			generic("configuration_invalid"),
			generic("target_unavailable"),
			generic("execution_failure")
		]);
		analysisCliErrorEnvelopeSchema = z.object({
			error: z.string().min(1),
			input_path: z.string().optional(),
			input_reason: z.enum([
				"invalid-json",
				"read-failed",
				"too-large"
			]).optional()
		}).passthrough().superRefine((value, context) => {
			const { error: _label, input_path: _inputPath, input_reason: _inputReason, ...projection } = value;
			const parsed = analysisErrorProjectionSchema.safeParse(projection);
			if (!parsed.success) {
				context.addIssue({
					code: "custom",
					message: "CLI error envelope must contain a canonical analysis error projection"
				});
			}
		});
		analysisErrorJsonSchema = z.toJSONSchema(analysisErrorProjectionSchema);
	})))();
}

//#endregion
//#region dist/domain/zipPackageFormat.js
var ZIP_PACKAGE_FORMATS, isZipPackageFormat, hasZipSignature, zipPackageFormatForPath, ZIP_NON_ENTRY_LIMITATION, isZipInventoryScopeLimitation;
function init_zipPackageFormat() {
	return (init_zipPackageFormat = __esmMin((() => {
		ZIP_PACKAGE_FORMATS = [
			"zip",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack"
		];
		isZipPackageFormat = (format) => ZIP_PACKAGE_FORMATS.some((candidate) => candidate === format);
		hasZipSignature = (bytes) => bytes.length >= 4 && bytes[0] === 80 && bytes[1] === 75 && (bytes[2] === 3 && bytes[3] === 4 || bytes[2] === 5 && bytes[3] === 6 || bytes[2] === 7 && bytes[3] === 8);
		zipPackageFormatForPath = (path) => {
			const lower = path.toLowerCase();
			if (lower.endsWith(".zip")) return "zip";
			if (lower.endsWith(".ipa")) return "ipa";
			if (lower.endsWith(".apk")) return "apk";
			if (lower.endsWith(".msix") || lower.endsWith(".msixbundle")) return "msix";
			if (lower.endsWith(".appx") || lower.endsWith(".appxbundle")) return "appx";
			if (lower.endsWith(".hap")) return "hap";
			if (lower.endsWith(".hsp")) return "hsp";
			return undefined;
		};
		ZIP_NON_ENTRY_LIMITATION = "ZIP inventory lists central-directory entries only. Non-entry bytes, including an APK Signing Block before the central directory or a ZIP comment after it, are not occurrences.";
		isZipInventoryScopeLimitation = (limitation) => limitation === "ZIP inventory lists central-directory entries only. Non-entry bytes, including an APK Signing Block before the central directory or a ZIP comment after it, are not occurrences." || limitation === "ZIP inventory lists central-directory entries only. Bytes after the central directory, including an APK Signing Block or a ZIP comment, are not occurrences.";
	})))();
}

//#endregion
//#region dist/contracts/toolOutputSchemaPrimitives.js
var evidenceResultOf, lifecycleResultOf, requireOutputSchema, targetFormatSchema, targetKindSchema, providerCapabilityFacts, providerCapability, PROVIDER_EFFECT_NAMES, providerIdentity, providerCapabilityGroupFacts, providerCapabilityGroup, providerCapabilitySet, expandProviderCapabilities, processCoordinates, processLineageObservation, analysisRun, analysisActivity, providerOperationRequest, providerOperationHealth, providerRejectionCode, providerDiagnostics, providerAvailability, providerTargetSupport, clientFeatureNameSchema, clientFeatureAvailabilitySchema, toolAvailabilityMode, toolAvailabilityFacts, toolUnavailabilityReason, toolAvailability, TOOL_EFFECT_NAMES, TOOL_ANNOTATION_NAMES, toolAvailabilityGroupFacts, toolAvailabilityGroup, toolAvailabilityInventory, expandToolAvailability, sessionProvider, nullableText, addressList, addressedEntry, containingProcedureResolution, unavailable, availableMemoryPermissions, addressedValue, memoryRegionOutput, segmentOutput, procedureInfoOutput, symbolDiscoveryOutput, graphNode, functionDossierOutput;
function init_toolOutputSchemaPrimitives() {
	return (init_toolOutputSchemaPrimitives = __esmMin((() => {
		init_hopperValues();
		init_analysisProfile();
		init_evidence();
		init_jsonValue();
		init_providerSelection();
		init_providerOperationHealth();
		init_errorSchemas();
		init_relationshipCoverage();
		init_zipPackageFormat();
		evidenceResultOf = (schema) => z.strictObject({
			...evidenceSchema.shape,
			normalized_result: schema
		}).superRefine(validateAnalysisProfileProvider);
		lifecycleResultOf = (schema) => z.object({ result: schema });
		requireOutputSchema = (schemas, name) => {
			const schema = schemas[name];
			if (schema === undefined) throw new Error(`Missing output schema for ${name}`);
			return schema;
		};
		targetFormatSchema = z.enum([
			"hopper",
			"analysis-database",
			"mach-o",
			"mach-o-universal",
			"elf",
			"pe",
			"dos-mz",
			"dos-com",
			"raw-binary",
			...ZIP_PACKAGE_FORMATS,
			"asar",
			"dmg",
			"pkg",
			"plist",
			"javascript",
			"source-map"
		]);
		targetKindSchema = z.enum([
			"executable",
			"database",
			"archive",
			"artifact"
		]);
		providerCapabilityFacts = {
			operation: z.string(),
			effects: z.object({
				mutates_artifact: z.boolean(),
				launches_process: z.boolean(),
				may_show_ui: z.boolean(),
				may_access_network: z.boolean(),
				may_write_filesystem: z.boolean(),
				changes_permissions: z.boolean(),
				requires_root: z.boolean()
			}),
			limitations: z.array(z.string())
		};
		providerCapability = z.discriminatedUnion("available", [z.object({
			...providerCapabilityFacts,
			available: z.literal(true),
			reason: z.null(),
			availability_code: z.null()
		}), z.object({
			...providerCapabilityFacts,
			available: z.literal(false),
			reason: z.string().nullable(),
			availability_code: z.enum(PROVIDER_REJECTION_CODES).nullable()
		})]);
		PROVIDER_EFFECT_NAMES = Object.keys(providerCapabilityFacts.effects.shape);
		providerIdentity = z.object({
			id: z.string(),
			name: z.string(),
			version: z.string().nullable()
		});
		providerCapabilityGroupFacts = {
			operations: z.array(z.string().min(1)).min(1),
			effects: z.array(providerCapabilityFacts.effects.keyof()),
			limitations: z.array(z.string())
		};
		providerCapabilityGroup = z.discriminatedUnion("available", [z.strictObject({
			...providerCapabilityGroupFacts,
			available: z.literal(true),
			reason: z.null(),
			availability_code: z.null()
		}), z.strictObject({
			...providerCapabilityGroupFacts,
			available: z.literal(false),
			reason: z.string().nullable(),
			availability_code: z.enum(PROVIDER_REJECTION_CODES).nullable()
		})]);
		providerCapabilitySet = z.strictObject({
			provider: providerIdentity,
			shared_limitations: z.array(z.string()),
			groups: z.array(providerCapabilityGroup)
		});
		expandProviderCapabilities = (sets) => sets.flatMap((set) => set.groups.flatMap((group) => group.operations.map((operation) => ({
			...providerCapability.parse({
				operation,
				available: group.available,
				reason: group.reason,
				availability_code: group.availability_code,
				effects: Object.fromEntries(PROVIDER_EFFECT_NAMES.map((name) => [name, group.effects.includes(name)])),
				limitations: [...set.shared_limitations, ...group.limitations]
			}),
			provider: set.provider
		}))));
		processCoordinates = {
			launcher_pid: z.number().int().min(1),
			process_group_id: z.number().int().min(1)
		};
		processLineageObservation = z.discriminatedUnion("status", [z.object({
			status: z.literal("unavailable"),
			observed_at: z.iso.datetime(),
			...processCoordinates,
			reason: z.string().min(1)
		}), z.object({
			status: z.literal("verified"),
			observed_at: z.iso.datetime(),
			...processCoordinates,
			launcher_parent_pid: z.number().int().min(0),
			descendants: z.array(z.object({
				pid: z.number().int().min(1),
				parent_pid: z.number().int().min(0),
				process_group_id: z.number().int().min(1)
			}))
		})]);
		analysisRun = z.object({
			run_id: z.string().uuid(),
			process_lineage: z.discriminatedUnion("status", [z.object({ status: z.literal("not_observed") }), z.object({
				status: z.literal("snapshots"),
				snapshots: z.array(z.object({
					provider: providerIdentity,
					observation: processLineageObservation
				}))
			})])
		}).nullable();
		analysisActivity = z.object({
			status: z.enum([
				"not_observed",
				"idle",
				"busy"
			]),
			providers: z.array(z.object({
				provider: providerIdentity,
				active: z.object({
					request_id: z.number().int().min(1),
					operation: z.string().min(1),
					elapsed_ms: z.number().int().min(0),
					caller_state: z.enum(["waiting", "cancelled"])
				}).nullable(),
				queued_requests: z.number().int().min(0)
			}))
		});
		providerOperationRequest = z.object({
			request_id: z.number().int().min(1),
			operation: z.string().min(1),
			stage: z.enum(PROVIDER_FAILURE_STAGES)
		});
		providerOperationHealth = z.object({
			state: z.enum(PROVIDER_OPERATION_STATES),
			stage: z.enum(PROVIDER_FAILURE_STAGES).nullable(),
			retry_action: z.enum(PROVIDER_RETRY_ACTIONS).nullable(),
			exit_code: z.number().int().nullable(),
			requests: z.array(providerOperationRequest)
		}).nullable();
		providerRejectionCode = z.enum(PROVIDER_REJECTION_CODES);
		providerDiagnostics = z.record(z.string(), jsonValueSchema);
		providerAvailability = z.discriminatedUnion("status", [z.object({
			status: z.literal("available"),
			code: z.null(),
			reason: z.null(),
			diagnostics: providerDiagnostics
		}), z.object({
			status: z.literal("unavailable"),
			code: providerRejectionCode,
			reason: z.string().min(1),
			diagnostics: providerDiagnostics
		})]);
		providerTargetSupport = z.discriminatedUnion("status", [
			z.object({
				status: z.literal("unknown"),
				code: z.null(),
				reason: z.string().min(1),
				diagnostics: providerDiagnostics
			}),
			z.object({
				status: z.literal("supported"),
				code: z.null(),
				reason: z.null(),
				diagnostics: providerDiagnostics
			}),
			z.object({
				status: z.literal("unsupported"),
				code: z.enum([
					"target_kind_unsupported",
					"target_format_unsupported",
					"architecture_unsupported",
					"target_role_unsupported",
					"managed_target_unsupported"
				]),
				reason: z.string().min(1),
				diagnostics: providerDiagnostics
			})
		]);
		clientFeatureNameSchema = z.enum([
			"elicitation_form",
			"elicitation_url",
			"roots",
			"sampling"
		]);
		clientFeatureAvailabilitySchema = z.object({
			elicitation_form: z.boolean(),
			elicitation_url: z.boolean(),
			roots: z.boolean(),
			sampling: z.boolean()
		});
		toolAvailabilityMode = z.discriminatedUnion("available", [z.object({
			name: z.string(),
			available: z.literal(true),
			missing_operations: z.array(z.string()).length(0),
			remediation: z.null()
		}), z.object({
			name: z.string(),
			available: z.literal(false),
			missing_operations: z.array(z.string()).min(1),
			remediation: z.string().nullable()
		})]);
		toolAvailabilityFacts = {
			name: z.string(),
			surface: z.string(),
			default_mode_available: z.boolean().optional(),
			modes: z.array(toolAvailabilityMode).optional(),
			client_requirements: z.object({
				required: z.array(clientFeatureNameSchema),
				optional: z.array(clientFeatureNameSchema),
				missing_required: z.array(clientFeatureNameSchema),
				missing_optional: z.array(clientFeatureNameSchema)
			}),
			effects: z.strictObject({
				mutatesTarget: z.boolean(),
				mutatesSession: z.boolean(),
				writesFilesystem: z.boolean(),
				launchesProcess: z.boolean(),
				accessesNetwork: z.boolean(),
				changesUiState: z.boolean(),
				mayDiscardData: z.boolean(),
				executesForeignCode: z.boolean(),
				mutatesDevice: z.boolean(),
				idempotent: z.boolean()
			}),
			annotations: z.object({
				read_only: z.boolean(),
				destructive: z.boolean(),
				idempotent: z.boolean(),
				open_world: z.boolean()
			})
		};
		toolUnavailabilityReason = z.enum([
			"client_capability_missing",
			"target_required",
			"provider_missing",
			"provider_unavailable",
			"target_unsupported",
			"unsupported_host"
		]);
		toolAvailability = z.discriminatedUnion("available", [z.object({
			...toolAvailabilityFacts,
			available: z.literal(true),
			reason: z.literal("available"),
			remediation: z.null()
		}), z.object({
			...toolAvailabilityFacts,
			available: z.literal(false),
			reason: toolUnavailabilityReason,
			remediation: z.string().nullable()
		})]);
		TOOL_EFFECT_NAMES = Object.keys(toolAvailabilityFacts.effects.shape);
		TOOL_ANNOTATION_NAMES = Object.keys(toolAvailabilityFacts.annotations.shape);
		toolAvailabilityGroupFacts = {
			names: z.array(z.string().min(1)).min(1),
			surface: toolAvailabilityFacts.surface,
			default_mode_available: toolAvailabilityFacts.default_mode_available,
			modes: toolAvailabilityFacts.modes,
			client_requirements: toolAvailabilityFacts.client_requirements.optional(),
			effects: z.array(toolAvailabilityFacts.effects.keyof()),
			annotations: z.array(toolAvailabilityFacts.annotations.keyof())
		};
		toolAvailabilityGroup = z.discriminatedUnion("available", [z.strictObject({
			...toolAvailabilityGroupFacts,
			available: z.literal(true),
			reason: z.literal("available"),
			remediation: z.null()
		}), z.strictObject({
			...toolAvailabilityGroupFacts,
			available: z.literal(false),
			reason: toolUnavailabilityReason,
			remediation: z.string().nullable()
		})]);
		toolAvailabilityInventory = z.strictObject({
			client_requirements: toolAvailabilityFacts.client_requirements,
			groups: z.array(toolAvailabilityGroup)
		});
		expandToolAvailability = (inventory) => inventory.groups.flatMap((group) => group.names.map((name) => toolAvailability.parse({
			...group,
			name,
			client_requirements: group.client_requirements ?? inventory.client_requirements,
			effects: Object.fromEntries(TOOL_EFFECT_NAMES.map((effect) => [effect, group.effects.includes(effect)])),
			annotations: Object.fromEntries(TOOL_ANNOTATION_NAMES.map((annotation) => [annotation, group.annotations.includes(annotation)]))
		})));
		sessionProvider = z.object({
			capabilities: z.array(providerCapabilitySet),
			analysis_run: analysisRun,
			analysis_activity: analysisActivity,
			provider_operation_health: providerOperationHealth,
			analysis_provider_binding: z.object({
				provider: providerIdentity,
				selection_source: z.enum([
					"request",
					"environment",
					"auto-single-candidate"
				]),
				analysis_profile: analysisProfileSchema
			}).nullable(),
			analysis_provider_candidates: z.array(z.object({
				provider: providerIdentity,
				availability: providerAvailability,
				target_support: providerTargetSupport,
				selected: z.boolean(),
				capabilities: z.array(providerCapabilitySet)
			})),
			tool_availability: toolAvailabilityInventory,
			client_features: z.object({
				elicitation_form: z.boolean(),
				elicitation_url: z.boolean(),
				roots: z.boolean(),
				sampling: z.boolean()
			}),
			server_identity: z.object({
				package: z.object({
					name: z.string(),
					version: z.string(),
					root_path: z.string(),
					build_commit: z.string().nullable()
				}),
				server: z.object({
					name: z.string(),
					version: z.string(),
					started_at: z.string(),
					command_path: z.string().nullable()
				}),
				sdk: z.object({
					server: z.string(),
					client_test: z.string(),
					core: z.string()
				}),
				negotiated_protocol_version: z.string().nullable(),
				client: z.object({
					name: z.string(),
					version: z.string()
				}).nullable(),
				skill: z.object({
					name: z.string(),
					expected_version: z.string()
				}),
				catalog: z.strictObject({
					counts: z.strictObject({
						cli_commands: z.number().int().min(0),
						mcp_tools: z.number().int().min(0),
						mcp_prompts: z.number().int().min(0)
					}),
					digests: z.strictObject({
						tools_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
						prompts_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
						combined_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
					})
				}),
				protocol_features: z.object({
					progress: z.boolean(),
					cancellation: z.boolean(),
					elicitation: z.boolean()
				}),
				alignment: z.object({
					state: z.enum([
						"aligned",
						"mcp_server_restart_required",
						"unknown"
					]),
					reasons: z.array(z.string()),
					remediation: z.string().nullable()
				})
			})
		}).passthrough();
		nullableText = z.string().nullable();
		addressList = z.array(z.string());
		addressedEntry = z.object({
			address: z.string(),
			name: z.string()
		});
		containingProcedureResolution = z.discriminatedUnion("found", [z.object({
			query_address: z.string(),
			found: z.literal(true),
			procedure: procedureIdentitySchema
		}), z.object({
			query_address: z.string(),
			found: z.literal(false),
			procedure: z.null(),
			reason: z.enum(["outside_segments", "not_in_procedure"])
		})]);
		unavailable = z.object({
			available: z.literal(false),
			reason: z.string()
		});
		availableMemoryPermissions = z.object({
			available: z.literal(true),
			source: z.literal("ghidra-memory-block")
		});
		addressedValue = z.object({
			address: z.string(),
			value: z.string(),
			symbol: z.object({
				primary: z.boolean(),
				dynamic: z.boolean(),
				external: z.boolean(),
				type: z.string(),
				source: z.enum([
					"default",
					"analysis",
					"ai",
					"imported",
					"user_defined"
				])
			}).optional(),
			procedure: z.object({
				external: z.boolean(),
				thunk: z.boolean(),
				thunk_target: z.string().nullable()
			}).optional(),
			string: z.object({
				encoding: z.string(),
				termination: z.enum(["missing", "present_or_not_required"]),
				byte_length: z.number().int().min(0)
			}).optional()
		});
		memoryRegionOutput = z.object({
			name: z.string(),
			start: z.string(),
			end: z.string(),
			readable: z.boolean().nullable(),
			writable: z.boolean().nullable(),
			executable: z.boolean().nullable(),
			permissions: z.union([unavailable, availableMemoryPermissions]),
			provenance: z.enum(["hopper-public-python-api", "ghidra-memory-block"]),
			address_space: z.string().optional(),
			image_base: z.string().optional(),
			initialized: z.boolean().optional(),
			overlay: z.boolean().optional()
		});
		segmentOutput = evidenceResultOf(z.array(memoryRegionOutput.extend({ sections: z.array(memoryRegionOutput) })));
		procedureInfoOutput = evidenceResultOf(z.object({
			name: z.string(),
			entrypoint: z.string(),
			basicblock_count: z.number().int().min(0),
			length: z.number().min(0),
			signature: nullableText,
			locals: z.array(localVariableSchema),
			classification: procedureClassificationSchema.nullable(),
			body: functionBodySchema
		}));
		symbolDiscoveryOutput = (property) => evidenceResultOf(z.object({
			count: z.number().int().min(0),
			[property]: z.array(addressedEntry)
		}));
		graphNode = z.discriminatedUnion("status", [z.object({
			address: z.string(),
			status: z.literal("ok"),
			calls: z.array(z.string()),
			relationship_coverage: relationshipCoverageSchema,
			limitations: z.array(z.string()).optional()
		}), z.object({
			address: z.string(),
			status: z.literal("error"),
			error: analysisErrorProjectionSchema
		})]);
		functionDossierOutput = evidenceResultOf(functionDossierSchema);
	})))();
}

//#endregion
//#region dist/domain/apple/interfaceBuilderKeyedArchive.js
var recordSchema, objectNode, connection, isUIKitRuntimeConnectionClass, interfaceBuilderConnectionFieldNames, parseInterfaceBuilderRecords, archiveUid, HIERARCHY_KEY, keyedArchiveTable, parseKeyedArchive, record, firstString, archivedObjectReference, firstObjectReference, classifyObject, classifyConnection, jsonSafeRecord;
function init_interfaceBuilderKeyedArchive() {
	return (init_interfaceBuilderKeyedArchive = __esmMin((() => {
		init_jsonValue();
		recordSchema = z.record(z.string(), z.unknown());
		objectNode = z.strictObject({
			id: z.string().min(1),
			kind: z.enum([
				"view_controller",
				"view",
				"control",
				"constraint",
				"layout_guide",
				"resource",
				"placeholder",
				"external_object",
				"other"
			]),
			class_name: z.string().nullable(),
			name: z.string().min(1),
			attributes: z.record(z.string(), jsonValueSchema)
		});
		connection = z.strictObject({
			id: z.string().min(1),
			kind: z.enum([
				"outlet",
				"action",
				"segue",
				"other"
			]),
			source_id: z.string().min(1),
			destination_id: z.string().nullable(),
			label: z.string().nullable(),
			attributes: z.record(z.string(), jsonValueSchema)
		});
		isUIKitRuntimeConnectionClass = (className) => /^UIRuntime\w*Connection$/u.test(className);
		interfaceBuilderConnectionFieldNames = (className) => isUIKitRuntimeConnectionClass(className) ? {
			source: "UISource",
			destination: "UIDestination",
			label: "UILabel"
		} : {
			source: "NSSource",
			destination: "NSDestination",
			label: "NSLabel"
		};
		parseInterfaceBuilderRecords = (value) => {
			const root = record(value);
			const keyed = parseKeyedArchive(root);
			if (keyed !== null) return keyed;
			const objectsRaw = record(root["com.apple.ibtool.document.objects"]);
			const connectionsRaw = record(root["com.apple.ibtool.document.connections"]);
			const hierarchyRaw = root["com.apple.ibtool.document.hierarchy"];
			const classesRaw = record(root["com.apple.ibtool.document.classes"]);
			const objects = [];
			const connections = [];
			let omittedConnections = 0;
			const objectEntries = Object.entries(objectsRaw);
			for (const [id, raw] of objectEntries.slice(0, 2e4)) {
				const attributes = record(raw);
				const className = firstString(attributes["customClass"], attributes["class"], attributes["isa"]);
				const label = firstString(attributes["label"], attributes["title"], attributes["name"], className);
				const carried = new Set();
				if (attributes["customClass"] === className) carried.add("customClass");
				if (attributes["label"] === label) carried.add("label");
				if (attributes["objectID"] === id) carried.add("objectID");
				objects.push(objectNode.parse({
					id,
					kind: classifyObject(className),
					class_name: className,
					name: label ?? id,
					attributes: jsonSafeRecord(Object.fromEntries(Object.entries(attributes).filter(([key]) => !carried.has(key))))
				}));
			}
			for (const [sourceId, rawConnections] of Object.entries(connectionsRaw)) {
				if (!Array.isArray(rawConnections)) continue;
				for (const [index, raw] of rawConnections.entries()) {
					if (connections.length >= 4e4) {
						omittedConnections += rawConnections.length - index;
						break;
					}
					const item = record(raw);
					const type = firstString(item.type, item.connectionType) ?? "unknown";
					const destination = firstString(item["destination-id"], item.destinationId);
					const label = firstString(item.label, item.selector, item.identifier);
					connections.push(connection.parse({
						id: `${sourceId}:connection:${index}`,
						kind: classifyConnection(type),
						source_id: sourceId,
						destination_id: destination,
						label,
						attributes: jsonSafeRecord(item)
					}));
				}
			}
			return {
				objects,
				connections,
				hierarchy: Array.isArray(hierarchyRaw) ? hierarchyRaw.slice(0, 2e4) : [],
				classes: classesRaw,
				objectCount: objectEntries.length,
				omittedObjects: Math.max(0, objectEntries.length - 2e4),
				omittedConnections,
				unresolvedConnections: 0,
				omittedHierarchyReferences: 0
			};
		};
		archiveUid = (value) => {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return undefined;
			if (Object.keys(value).length !== 1) return undefined;
			const item = record(value);
			const marker = Object.hasOwn(item, "UID") ? item.UID : item["CF$UID"];
			return typeof marker === "number" && Number.isInteger(marker) ? marker : undefined;
		};
		HIERARCHY_KEY = /(?:subviews|contentview|childviewcontrollers|children|views)$/iu;
		keyedArchiveTable = (objectTable) => {
			const classNameOf = (value) => {
				const classReference = record(value).$class;
				const uid = archiveUid(classReference);
				return firstString(record(uid === undefined ? classReference : objectTable[uid]).$classname);
			};
			/** The string an archived string object holds, if it is one. */
			const archivedString = (target) => {
				if (typeof target === "string") return target;
				const text = record(target)["NS.string"];
				return typeof text === "string" && /^NS(?:Mutable)?String$/u.test(classNameOf(target) ?? "") ? text : undefined;
			};
			const text = (value) => {
				const uid = archiveUid(value);
				return firstString(uid === undefined ? value : archivedString(objectTable[uid]));
			};
			const authoredId = (item) => firstString(text(item.objectID), text(item["object-id"]));
			const reference = (uid) => {
				const target = uid === 0 ? null : objectTable[uid];
				if (target === undefined || target === null) return null;
				if (typeof target !== "object") return target;
				const string = archivedString(target);
				if (string !== undefined) return string;
				const objectId = authoredId(record(target));
				return {
					archiveUID: uid,
					...objectId === null ? {} : { objectID: objectId },
					className: classNameOf(target)
				};
			};
			/** Resolve one object's own fields, leaving references to other objects as stubs. */
			const resolve = (value) => {
				const uid = archiveUid(value);
				if (uid !== undefined) return reference(uid);
				if (Array.isArray(value)) return value.map(resolve);
				if (typeof value !== "object" || value === null) return value;
				const output = {};
				for (const [key, child] of Object.entries(value)) {
					if (key === "$class") output.className = classNameOf(value);
					else output[key] = resolve(child);
				}
				return output;
			};
			const hierarchy = (start) => {
				let omittedReferences = 0;
				const visited = new Set();
				const root = [];
				const pending = [{
					value: start,
					output: root
				}];
				const appendNode = (item, uid, output) => {
					const objectId = firstString(authoredId(item), text(item.id), uid === undefined ? null : String(uid));
					if (objectId === null) {
						for (const [key, child] of Object.entries(item).reverse()) if (HIERARCHY_KEY.test(key)) pending.push({
							value: child,
							output
						});
						return;
					}
					const children = [];
					output.push({
						objectID: objectId,
						children
					});
					for (const [key, child] of Object.entries(item).reverse()) if (HIERARCHY_KEY.test(key)) pending.push({
						value: child,
						output: children
					});
				};
				while (pending.length > 0) {
					const entry = pending.pop();
					if (entry === undefined) break;
					const { value, output } = entry;
					const uid = archiveUid(value);
					if (uid !== undefined) {
						if (uid === 0) continue;
						const target = objectTable[uid];
						if (target === undefined) {
							omittedReferences += 1;
							continue;
						}
						if (visited.has(uid)) continue;
						visited.add(uid);
						if (Array.isArray(target)) {
							for (let index = target.length - 1; index >= 0; index -= 1) {
								const child = target[index];
								if (child !== undefined) pending.push({
									value: child,
									output
								});
							}
							continue;
						}
						if (typeof target !== "object" || target === null) continue;
						const item = record(target);
						if (archivedArrayClass(item.$class)) {
							const members = item["NS.objects"];
							if (Array.isArray(members)) for (let index = members.length - 1; index >= 0; index -= 1) {
								const child = members[index];
								if (child !== undefined) pending.push({
									value: child,
									output
								});
							}
							continue;
						}
						appendNode(item, uid, output);
						continue;
					}
					if (Array.isArray(value)) {
						for (let index = value.length - 1; index >= 0; index -= 1) {
							const child = value[index];
							if (child !== undefined) pending.push({
								value: child,
								output
							});
						}
					} else if (typeof value === "object" && value !== null) {
						appendNode(record(value), undefined, output);
					}
				}
				return {
					items: root,
					omittedReferences
				};
			};
			const archivedArrayClass = (classReference) => {
				const uid = archiveUid(classReference);
				const descriptor = record(uid === undefined ? classReference : objectTable[uid]);
				const classNames = Array.isArray(descriptor.$classes) ? descriptor.$classes.filter((name) => typeof name === "string") : [];
				return classNames.includes("NSArray") || classNames.includes("NSMutableArray");
			};
			return {
				resolve,
				hierarchy
			};
		};
		parseKeyedArchive = (root) => {
			if (root.$archiver !== "NSKeyedArchiver" || !Array.isArray(root.$objects)) return null;
			const objectTable = root.$objects;
			const { resolve, hierarchy: toHierarchy } = keyedArchiveTable(objectTable);
			const objects = [];
			const connections = [];
			let objectCount = 0;
			let omittedConnections = 0;
			let unresolvedConnections = 0;
			for (const [index, raw] of objectTable.entries()) {
				if (index === 0) continue;
				const resolved = record(resolve(raw));
				const className = firstString(resolved.className);
				if (className === null) continue;
				objectCount += 1;
				const fields = Object.fromEntries(Object.entries(resolved).filter(([key]) => key !== "className"));
				const authoredId = firstString(fields.objectID, fields["object-id"]);
				const objectId = authoredId ?? (typeof fields.archiveUID === "number" ? String(fields.archiveUID) : String(index));
				const kind = classifyObject(className);
				if (objects.length < 2e4) objects.push(objectNode.parse({
					id: objectId,
					kind,
					class_name: className,
					name: firstString(fields.label, fields.title, fields.identifier, fields.accessibilityLabel, className) ?? `object ${String(index)}`,
					attributes: jsonSafeRecord(fields)
				}));
				if (/(?:Outlet|Connection|Segue|ActionConnection|ControlConnector)/iu.test(className)) {
					const controlAction = /ControlConnector/iu.test(className);
					const uiKit = isUIKitRuntimeConnectionClass(className);
					const connectionFields = interfaceBuilderConnectionFieldNames(className);
					const source = uiKit ? archivedObjectReference(fields[connectionFields.source]) : firstObjectReference(controlAction ? fields.destination : fields.source, archivedObjectReference(fields[connectionFields.source]), controlAction ? fields.to : fields.from, controlAction ? fields.target : fields.owner);
					if (source === null) {
						unresolvedConnections += 1;
						continue;
					}
					const kind = controlAction ? "action" : classifyConnection(className);
					const parsedConnection = connection.parse({
						id: `archive:${objectId}`,
						kind,
						source_id: source,
						destination_id: uiKit ? archivedObjectReference(fields[connectionFields.destination]) : firstObjectReference(controlAction ? fields.source : fields.destination, archivedObjectReference(fields[connectionFields.destination]), controlAction ? fields.from : fields.to, controlAction ? fields.owner : fields.target),
						label: uiKit ? firstString(fields[connectionFields.label]) : firstString(fields.label, fields[connectionFields.label], fields.selector, fields.identifier, fields.action),
						attributes: jsonSafeRecord(fields)
					});
					if (connections.length < 4e4) connections.push(parsedConnection);
					else omittedConnections += 1;
				}
			}
			const top = record(root.$top);
			const hierarchy = toHierarchy(top.root ?? top.UITopLevelObjectsKey);
			const classes = Object.fromEntries(objectTable.flatMap((raw) => {
				const item = record(raw);
				const name = firstString(item.$classname);
				return name === null ? [] : [[name, { superclasses: Array.isArray(item.$classes) ? item.$classes : [] }]];
			}));
			return {
				objects,
				connections,
				hierarchy: hierarchy.items,
				classes,
				objectCount,
				omittedObjects: Math.max(0, objectCount - 2e4),
				omittedConnections,
				unresolvedConnections,
				omittedHierarchyReferences: hierarchy.omittedReferences
			};
		};
		record = (value) => recordSchema.safeParse(value).data ?? {};
		firstString = (...values) => {
			for (const value of values) if (typeof value === "string" && value.length > 0) return value;
			return null;
		};
		archivedObjectReference = (value) => {
			const item = record(value);
			if (typeof item.archiveUID !== "number") return null;
			return firstString(item.objectID, item["object-id"]) ?? String(item.archiveUID);
		};
		firstObjectReference = (...values) => {
			for (const value of values) {
				const direct = firstString(value);
				if (direct !== null) return direct;
				const item = record(value);
				const objectId = firstString(item.objectID, item["object-id"], item.id, item.identifier, typeof item.archiveUID === "number" ? String(item.archiveUID) : null);
				if (objectId !== null) return objectId;
			}
			return null;
		};
		classifyObject = (className) => {
			const value = className?.toLowerCase() ?? "";
			if (value.includes("constraint")) return "constraint";
			if (value.includes("layoutguide")) return "layout_guide";
			if (value.includes("placeholder") || value.includes("firstresponder") || value === "uiproxyobject") return "placeholder";
			if (value.includes("image") || value.includes("color") || value.includes("font")) return "resource";
			if (value.includes("external")) return "external_object";
			if (value.includes("viewcontroller") || value.includes("windowcontroller")) return "view_controller";
			if (value.includes("button") || value.includes("control") || value.includes("textfield") || value.includes("slider") || value.includes("menuitem")) return "control";
			if (value.includes("view") || value.includes("window") || value.includes("cell")) return "view";
			return "other";
		};
		classifyConnection = (type) => {
			const value = type.toLowerCase();
			if (value.includes("outlet")) return "outlet";
			if (value.includes("action")) return "action";
			if (value.includes("segue")) return "segue";
			return "other";
		};
		jsonSafeRecord = (value) => Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
			try {
				const serialized = JSON.stringify(item);
				if (serialized === undefined) return [];
				const parsed = jsonValueSchema.safeParse(JSON.parse(serialized));
				return parsed.success ? [[key, parsed.data]] : [];
			} catch (cause) {
				void cause;
				return [];
			}
		}));
	})))();
}

//#endregion
//#region dist/domain/swiftSymbolClassification.js
var LEGACY_CATEGORIES, NOMINAL_CATEGORIES, classifySwiftSymbol, SWIFT_MANGLING_PREFIXES, isSwiftMangledSymbolName, identifierEnd;
function init_swiftSymbolClassification() {
	return (init_swiftSymbolClassification = __esmMin((() => {
		LEGACY_CATEGORIES = [
			["_TtC", "classes"],
			["_TtV", "structs"],
			["_TtO", "enums"],
			["_TtP", "protocols"],
			["_TtE", "extensions"]
		];
		NOMINAL_CATEGORIES = new Map([
			["C", "classes"],
			["V", "structs"],
			["O", "enums"],
			["P", "protocols"]
		]);
		classifySwiftSymbol = (name) => {
			const prefix = /^_?(?:\$[sS]|_T0)/u.exec(name);
			if (prefix === null) {
				if (!name.includes("_Tt")) return undefined;
				return { category: LEGACY_CATEGORIES.find(([prefix]) => name.startsWith(prefix))?.[1] ?? null };
			}
			const mangling = name.slice(prefix[0].length);
			let offset = identifierEnd(mangling, 0);
			if (offset === undefined) return { category: null };
			let category = null;
			for (;;) {
				const end = identifierEnd(mangling, offset);
				if (end === undefined) break;
				const kind = mangling.charAt(end);
				const nominal = NOMINAL_CATEGORIES.get(kind);
				if (nominal === undefined) {
					if (mangling.slice(end) === "Mp") category = "protocols";
					else if (kind === "E" && category !== null) category = "extensions";
					break;
				}
				category = nominal;
				offset = end + 1;
			}
			return { category };
		};
		SWIFT_MANGLING_PREFIXES = [
			"_T0",
			"$S",
			"_$S",
			"$s",
			"_$s",
			"@__swiftmacro_",
			"$e",
			"_$e"
		];
		isSwiftMangledSymbolName = (name) => SWIFT_MANGLING_PREFIXES.some((prefix) => name.startsWith(prefix));
		identifierEnd = (mangling, offset) => {
			const lengthToken = /^[1-9][0-9]*/u.exec(mangling.slice(offset))?.[0];
			if (lengthToken === undefined) return undefined;
			const start = offset + lengthToken.length;
			const end = start + Number(lengthToken);
			if (!Number.isSafeInteger(end) || end > mangling.length || !/^[A-Za-z_][A-Za-z0-9_]*$/u.test(mangling.slice(start, end))) return undefined;
			return end;
		};
	})))();
}

//#endregion
//#region dist/domain/native/objcSwiftMetadata.js
var objcMethodTypeSchema, objcPropertyAttributeSchema, objcMethodSchema, objcPropertySchema, objcProtocolSchema, objcClassSchema, nativeMetadataLocationSchema, nativeMetadataDecodeSchema, nativeMetadataEvidenceSchema, objcIvarSchema, objcProtocolRecordSchema, objcDispatchImplementationSchema, objcCategorySchema, swiftConformanceSchema, swiftDispatchSlotSchema, relativePointerSchema, swiftSymbolSchema, nativeMetadataCoverageSchema, swiftDeclKindSchema, swiftAccessLevelSchema, swiftDeclSchema, dbOperationSchema, dbSaveResultSchema, objcSwiftMetadataSchema, nativeDispatchMetadataResultSchema, inspectNativeDispatchMetadata, parseMetadataAddress;
function init_objcSwiftMetadata() {
	return (init_objcSwiftMetadata = __esmMin((() => {
		init_evidence();
		init_swiftSymbolClassification();
		init_unicodeCodePointOrder();
		objcMethodTypeSchema = z.enum([
			"instance",
			"class",
			"ivar_getter",
			"ivar_setter"
		]);
		objcPropertyAttributeSchema = z.strictObject({
			name: z.string().min(1),
			value: z.string()
		});
		objcMethodSchema = z.strictObject({
			selector: z.string().min(1),
			method_type: objcMethodTypeSchema,
			address: z.number().int().nullable(),
			is_required: z.boolean().nullable(),
			is_optional: z.boolean().nullable()
		});
		objcPropertySchema = z.strictObject({
			name: z.string().min(1),
			type_encoding: z.string().nullable(),
			attributes: z.array(objcPropertyAttributeSchema),
			atomicity: z.enum(["atomic", "nonatomic"]).nullable(),
			is_readonly: z.boolean().nullable(),
			getter: z.string().nullable(),
			setter: z.string().nullable()
		});
		objcProtocolSchema = z.strictObject({
			name: z.string().min(1),
			methods: z.array(objcMethodSchema).default([]),
			optional_methods: z.array(objcMethodSchema).default([]),
			properties: z.array(objcPropertySchema).default([])
		});
		objcClassSchema = z.strictObject({
			name: z.string().min(1),
			super_class: z.string().nullable(),
			is_meta_class: z.boolean().nullable(),
			is_root_class: z.boolean().nullable(),
			methods: z.array(objcMethodSchema).default([]),
			properties: z.array(objcPropertySchema).default([]),
			protocols: z.array(z.string()).default([]),
			ivar_count: z.number().int().nonnegative().nullable(),
			instance_size: z.number().int().nonnegative().nullable(),
			location: z.object({
				address: z.string().nullable(),
				file_offset: z.number().int().nonnegative().nullable()
			}).optional(),
			superclass_address: z.string().nullable().optional(),
			metaclass_address: z.string().nullable().optional(),
			decode: z.object({
				status: z.enum([
					"decoded",
					"partial",
					"unsupported",
					"invalid"
				]),
				reason: z.string().nullable()
			}).optional(),
			evidence: z.array(z.object({
				kind: z.literal("binary_metadata"),
				description: z.string(),
				location: z.object({
					address: z.string().nullable(),
					file_offset: z.number().int().nonnegative().nullable()
				}),
				artifact_path: z.string(),
				artifact_sha256: z.string()
			})).optional()
		});
		nativeMetadataLocationSchema = z.strictObject({
			address: z.string().nullable(),
			file_offset: z.number().int().nonnegative().nullable()
		});
		nativeMetadataDecodeSchema = z.strictObject({
			status: z.enum([
				"decoded",
				"partial",
				"unsupported",
				"invalid"
			]),
			reason: z.string().nullable()
		});
		nativeMetadataEvidenceSchema = z.strictObject({
			kind: z.enum([
				"binary_metadata",
				"interface_builder_resource",
				"symbol",
				"reference",
				"decompiler"
			]),
			description: z.string().min(1),
			provider: providerSchema.optional(),
			location: nativeMetadataLocationSchema,
			artifact_path: z.string().min(1).nullable().default(null),
			artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable().default(null)
		});
		objcIvarSchema = z.strictObject({
			class_name: z.string().min(1),
			name: z.string().min(1),
			type_encoding: z.string().nullable(),
			offset: z.number().int().nonnegative().nullable(),
			size: z.number().int().nonnegative().nullable().default(null),
			alignment: z.number().int().positive().nullable().default(null),
			location: nativeMetadataLocationSchema,
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		objcProtocolRecordSchema = z.strictObject({
			name: z.string(),
			adopted_protocols: z.array(z.string()),
			methods: z.array(objcMethodSchema),
			optional_methods: z.array(objcMethodSchema),
			location: nativeMetadataLocationSchema,
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		objcDispatchImplementationSchema = z.strictObject({
			class_name: z.string().min(1),
			selector: z.string().min(1),
			method_type: z.enum(["instance", "class"]),
			implementation_address: z.string().nullable(),
			/** Category that adds this method, when it is not defined by the class itself. */
			category: z.string().nullable().optional(),
			location: nativeMetadataLocationSchema,
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		objcCategorySchema = z.strictObject({
			name: z.string().min(1),
			/** Extended class; external classes come from the category's bind symbol. */
			class_name: z.string().min(1).nullable(),
			class_source: z.enum([
				"local",
				"external",
				"unresolved"
			]),
			instance_methods: z.array(z.string()),
			class_methods: z.array(z.string()),
			protocols: z.array(z.string()),
			properties: z.array(objcPropertySchema),
			location: nativeMetadataLocationSchema,
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		swiftConformanceSchema = z.strictObject({
			type_name: z.string().min(1),
			protocol_name: z.string().min(1),
			module: z.string().nullable(),
			witness_table: nativeMetadataLocationSchema,
			location: nativeMetadataLocationSchema,
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		swiftDispatchSlotSchema = z.strictObject({
			owner: z.string().min(1),
			table_kind: z.enum(["witness_table", "class_vtable"]),
			slot_index: z.number().int().nonnegative(),
			requirement: z.string().nullable(),
			implementation: z.string().nullable(),
			implementation_address: z.string().nullable(),
			thunk_address: z.string().nullable(),
			location: nativeMetadataLocationSchema,
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		relativePointerSchema = z.strictObject({
			field: nativeMetadataLocationSchema,
			target: nativeMetadataLocationSchema,
			displacement: z.number().int(),
			indirectable: z.boolean(),
			indirect: z.boolean().nullable(),
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		swiftSymbolSchema = z.strictObject({
			mangled_name: z.string().min(1),
			address: z.string().min(1),
			decode: nativeMetadataDecodeSchema,
			evidence: z.array(nativeMetadataEvidenceSchema).min(1)
		});
		nativeMetadataCoverageSchema = z.strictObject({
			facet: z.string().min(1),
			status: z.enum([
				"complete",
				"partial",
				"unsupported",
				"not_requested"
			]),
			reason: z.string().nullable(),
			examined: z.number().int().nonnegative(),
			decoded: z.number().int().nonnegative()
		});
		swiftDeclKindSchema = z.enum([
			"class",
			"struct",
			"enum",
			"protocol",
			"extension",
			"actor",
			"global_var",
			"global_func"
		]);
		swiftAccessLevelSchema = z.enum([
			"private",
			"fileprivate",
			"internal",
			"public",
			"open"
		]);
		swiftDeclSchema = z.strictObject({
			kind: swiftDeclKindSchema,
			name: z.string().min(1),
			module: z.string().nullable(),
			access_level: swiftAccessLevelSchema.default("internal"),
			super_class: z.string().nullable(),
			protocols: z.array(z.string()).default([]),
			is_final: z.boolean().default(false),
			is_required: z.boolean().default(false),
			is_convenience_init: z.boolean().default(false),
			is_override: z.boolean().default(false)
		});
		dbOperationSchema = z.enum([
			"save",
			"readback",
			"open_database",
			"close_database",
			"export",
			"import"
		]);
		dbSaveResultSchema = z.strictObject({
			operation: dbOperationSchema,
			succeeded: z.boolean(),
			preserved_names: z.number().int().nonnegative().default(0),
			preserved_comments: z.number().int().nonnegative().default(0),
			preserved_bookmarks: z.number().int().nonnegative().default(0),
			database_path: z.string().nullable(),
			error: z.string().nullable()
		});
		objcSwiftMetadataSchema = z.strictObject({
			objc_classes: z.array(objcClassSchema).default([]),
			objc_protocols: z.array(objcProtocolSchema).default([]),
			objc_categories: z.array(objcCategorySchema).default([]),
			swift_decls: z.array(swiftDeclSchema).default([]),
			objc_ivars: z.array(objcIvarSchema).default([]),
			objc_protocol_records: z.array(objcProtocolRecordSchema).default([]),
			objc_dispatch_implementations: z.array(objcDispatchImplementationSchema).default([]),
			swift_conformances: z.array(swiftConformanceSchema).default([]),
			swift_dispatch_slots: z.array(swiftDispatchSlotSchema).default([]),
			swift_symbols: z.array(swiftSymbolSchema).default([]),
			relative_pointers: z.array(relativePointerSchema).default([]),
			coverage: z.array(nativeMetadataCoverageSchema).default([]),
			db_save_result: dbSaveResultSchema.nullable()
		});
		nativeDispatchMetadataResultSchema = z.strictObject({
			target_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			provider: z.strictObject({
				id: z.string().min(1),
				name: z.string().min(1),
				version: z.string().nullable()
			}),
			analysis_profile_digest: z.string().min(1).nullable(),
			result: objcSwiftMetadataSchema
		});
		inspectNativeDispatchMetadata = (names, maxRecords = 5e3) => {
			const symbolEvidence = (name, address) => [{
				kind: "symbol",
				description: `Provider symbol ${name}`,
				location: {
					address,
					file_offset: null
				},
				artifact_path: null,
				artifact_sha256: null
			}];
			const classNames = new Set();
			const implementations = new Map();
			const swiftSymbols = [];
			const examinedNames = names.slice(0, maxRecords);
			for (const entry of examinedNames) {
				const classMatch = /(?:OBJC_CLASS_|OBJC_METACLASS_)\$_([^\s]+)/u.exec(entry.name);
				if (classMatch?.[1] !== undefined) classNames.add(classMatch[1]);
				const methodMatch = /^([+-])\[([^\s\]]+)\s+([^\]]+)\]$/u.exec(entry.name);
				if (methodMatch?.[1] !== undefined && methodMatch[2] && methodMatch[3]) {
					const methodType = methodMatch[1] === "+" ? "class" : "instance";
					const selector = methodMatch[3];
					implementations.set(`${methodMatch[2]}:${selector}:${methodType}`, {
						class_name: methodMatch[2],
						selector,
						method_type: methodType,
						implementation_address: entry.address,
						location: {
							address: entry.address,
							file_offset: null
						},
						decode: {
							status: "partial",
							reason: "symbol_name_only"
						},
						evidence: symbolEvidence(entry.name, entry.address)
					});
					classNames.add(methodMatch[2]);
				}
				if (isSwiftMangledSymbolName(entry.name) || entry.name.startsWith("_Tt")) swiftSymbols.push({
					mangled_name: entry.name,
					address: entry.address,
					decode: {
						status: "partial",
						reason: "mangled_symbol_not_demangled"
					},
					evidence: symbolEvidence(entry.name, entry.address)
				});
			}
			const methodsByClass = new Map();
			for (const implementation of implementations.values()) {
				const methods = methodsByClass.get(implementation.class_name) ?? [];
				methods.push({
					selector: implementation.selector,
					method_type: implementation.method_type,
					address: parseMetadataAddress(implementation.implementation_address),
					is_required: null,
					is_optional: null
				});
				methodsByClass.set(implementation.class_name, methods);
			}
			const classes = [...classNames].sort().map((name) => ({
				name,
				super_class: null,
				is_meta_class: null,
				is_root_class: null,
				methods: methodsByClass.get(name) ?? [],
				properties: [],
				protocols: [],
				ivar_count: null,
				instance_size: null
			}));
			const decodedImplementations = [...implementations.values()].sort((left, right) => compareUnicodeCodePoints(compositeKey([left.class_name, left.selector]), compositeKey([right.class_name, right.selector])));
			const swift = swiftSymbols.length > 0;
			return objcSwiftMetadataSchema.parse({
				objc_classes: classes,
				objc_dispatch_implementations: decodedImplementations,
				swift_symbols: swiftSymbols,
				coverage: [
					{
						facet: "objc_class_symbols",
						status: "partial",
						reason: names.length > examinedNames.length ? "record_limit_reached_and_symbol_names_are_not_runtime_class_metadata" : "symbol_names_do_not_recover_all_runtime_class_metadata",
						examined: examinedNames.length,
						decoded: classes.length
					},
					{
						facet: "objc_dispatch_implementations",
						status: decodedImplementations.length > 0 ? "partial" : "unsupported",
						reason: names.length > examinedNames.length ? "record_limit_reached_and_only_symbolized_methods_are_resolved" : decodedImplementations.length > 0 ? "only_symbolized_methods_are_resolved" : "provider_name_inventory_has_no_objc_method_symbols",
						examined: examinedNames.length,
						decoded: decodedImplementations.length
					},
					{
						facet: "objc_ivar_layouts",
						status: "unsupported",
						reason: "symbol_inventory_does_not_expose_runtime_ivar_layouts",
						examined: 0,
						decoded: 0
					},
					{
						facet: "swift_declarations",
						status: swift ? "partial" : "unsupported",
						reason: swift ? "symbols_are_not_demangled_declarations" : "no_swift_symbols_observed",
						examined: swiftSymbols.length,
						decoded: 0
					},
					{
						facet: "swift_dispatch_tables",
						status: "unsupported",
						reason: "provider_name_inventory_does_not_decode_witness_or_class_vtables",
						examined: 0,
						decoded: 0
					},
					{
						facet: "relative_pointers",
						status: "unsupported",
						reason: "provider_name_inventory_does_not_decode_binary_relative_pointers",
						examined: 0,
						decoded: 0
					}
				],
				db_save_result: null
			});
		};
		parseMetadataAddress = (address) => {
			if (address === null) return null;
			const match = /(?:^|:)0x([0-9a-f]+)$/iu.exec(address);
			if (match?.[1] === undefined) return null;
			const value = Number.parseInt(match[1], 16);
			return Number.isSafeInteger(value) ? value : null;
		};
	})))();
}

//#endregion
//#region dist/domain/native/nativeInvestigationGraph.js
var nativeInvestigationNodeKindSchema, nativeInvestigationNodeSchema, nativeInvestigationRelationSchema, nativeInvestigationEdgeSchema, nativeInvestigationCoverageSchema, nativeInvestigationGraphSchema, nativeInvestigationTraceLimitsSchema, nativeInvestigationTraceSchema, traceNativeInvestigationGraph, joinInterfaceBuilderDispatch;
function init_nativeInvestigationGraph() {
	return (init_nativeInvestigationGraph = __esmMin((() => {
		init_objcSwiftMetadata();
		init_jsonValue();
		nativeInvestigationNodeKindSchema = z.enum([
			"storyboard",
			"scene",
			"view_controller",
			"view",
			"control",
			"constraint",
			"layout_guide",
			"resource",
			"placeholder",
			"external_object",
			"outlet",
			"action",
			"segue",
			"objc_class",
			"objc_selector",
			"swift_declaration",
			"swift_requirement",
			"dispatch_table",
			"dispatch_slot",
			"thunk",
			"function",
			"state_value",
			"global_value",
			"field",
			"branch_condition",
			"sink",
			"unknown"
		]);
		nativeInvestigationNodeSchema = z.strictObject({
			id: z.string().min(1),
			kind: nativeInvestigationNodeKindSchema,
			name: z.string().min(1),
			location: nativeMetadataLocationSchema.nullable(),
			attributes: z.record(z.string(), jsonValueSchema),
			evidence: z.array(nativeMetadataEvidenceSchema)
		});
		nativeInvestigationRelationSchema = z.enum([
			"contains",
			"outlet_to",
			"target_action",
			"segue_to",
			"objc_dispatch",
			"swift_witness_dispatch",
			"swift_vtable_dispatch",
			"thunk_to",
			"direct_call",
			"indirect_call",
			"provider_call",
			"reads",
			"writes",
			"flows_to",
			"controls"
		]);
		nativeInvestigationEdgeSchema = z.discriminatedUnion("resolution", [z.strictObject({
			id: z.string().min(1),
			from: z.string().min(1),
			to: z.string().min(1),
			relation: nativeInvestigationRelationSchema,
			resolution: z.enum([
				"observed",
				"inferred",
				"resolved",
				"ambiguous"
			]),
			evidence: z.array(nativeMetadataEvidenceSchema).min(1),
			limitations: z.array(z.string())
		}), z.strictObject({
			id: z.string().min(1),
			from: z.string().min(1),
			to: z.null(),
			relation: nativeInvestigationRelationSchema,
			resolution: z.literal("unresolved"),
			reason: z.string().min(1),
			evidence: z.array(nativeMetadataEvidenceSchema),
			limitations: z.array(z.string())
		})]);
		nativeInvestigationCoverageSchema = z.strictObject({
			facet: z.string().min(1),
			status: z.enum([
				"complete",
				"partial",
				"unsupported",
				"not_requested"
			]),
			reason: z.string().nullable(),
			examined: z.number().int().nonnegative(),
			omitted: z.number().int().nonnegative()
		});
		nativeInvestigationGraphSchema = z.strictObject({
			target_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			provider: z.strictObject({
				id: z.string().min(1),
				version: z.string().nullable(),
				tool_version: z.string().min(1)
			}),
			nodes: z.array(nativeInvestigationNodeSchema),
			edges: z.array(nativeInvestigationEdgeSchema),
			coverage: z.array(nativeInvestigationCoverageSchema),
			truncated: z.boolean()
		});
		nativeInvestigationTraceLimitsSchema = z.strictObject({
			max_depth: z.number().int().min(0).max(32).default(8),
			max_nodes: z.number().int().min(1).max(2e3).default(250),
			max_edges: z.number().int().min(1).max(5e3).default(500)
		});
		nativeInvestigationTraceSchema = z.strictObject({
			target_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			provider: nativeInvestigationGraphSchema.shape.provider,
			start: z.string().min(1),
			direction: z.enum(["forward", "backward"]),
			nodes: z.array(nativeInvestigationNodeSchema),
			edges: z.array(nativeInvestigationEdgeSchema),
			unresolved: z.array(nativeInvestigationEdgeSchema),
			reached_depth: z.number().int().nonnegative(),
			truncated: z.boolean(),
			reason: z.string().nullable(),
			coverage: z.array(nativeInvestigationCoverageSchema),
			limitations: z.array(z.string().min(1))
		});
		traceNativeInvestigationGraph = (graph, input) => {
			const start = graph.nodes.find(({ id }) => id === input.start);
			if (start === undefined) return {
				target_sha256: graph.target_sha256,
				provider: graph.provider,
				start: input.start,
				direction: input.direction ?? "forward",
				nodes: [],
				edges: [],
				unresolved: [],
				reached_depth: 0,
				truncated: false,
				reason: "start_node_missing",
				coverage: graph.coverage,
				limitations: ["The requested start node is absent from the supplied graph."]
			};
			const limits = nativeInvestigationTraceLimitsSchema.parse(input.limits ?? {});
			const direction = input.direction ?? "forward";
			const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
			const visited = new Set([start.id]);
			const selectedEdges = new Map();
			const unresolved = new Map();
			const queue = [{
				id: start.id,
				depth: 0
			}];
			let reachedDepth = 0;
			let truncated = false;
			let reason = null;
			const adjacency = new Map();
			for (const edge of graph.edges) {
				const nodeId = direction === "forward" ? edge.from : edge.to;
				if (nodeId === null) continue;
				const entries = adjacency.get(nodeId);
				if (entries === undefined) adjacency.set(nodeId, [edge]);
				else entries.push(edge);
			}
			while (queue.length > 0) {
				const current = queue.shift();
				if (current === undefined) break;
				const adjacent = adjacency.get(current.id) ?? [];
				for (const edge of adjacent) {
					if (selectedEdges.size + unresolved.size >= limits.max_edges) {
						truncated = true;
						reason = "max_edges_reached";
						break;
					}
					if (edge.resolution === "unresolved") {
						unresolved.set(edge.id, edge);
						continue;
					}
					const nextId = direction === "forward" ? edge.to : edge.from;
					const alreadyVisited = visited.has(nextId);
					if (!alreadyVisited && current.depth >= limits.max_depth) {
						truncated = true;
						reason ??= "max_depth_reached";
						continue;
					}
					if (!alreadyVisited && visited.size >= limits.max_nodes) {
						truncated = true;
						reason = "max_nodes_reached";
						break;
					}
					selectedEdges.set(edge.id, edge);
					if (alreadyVisited) continue;
					if (!nodeById.has(nextId)) {
						truncated = true;
						reason ??= "edge_target_missing_from_graph";
						continue;
					}
					visited.add(nextId);
					reachedDepth = Math.max(reachedDepth, current.depth + 1);
					queue.push({
						id: nextId,
						depth: current.depth + 1
					});
				}
				if (reason === "max_edges_reached" || reason === "max_nodes_reached") break;
			}
			return {
				target_sha256: graph.target_sha256,
				provider: graph.provider,
				start: start.id,
				direction,
				nodes: [...visited].flatMap((id) => {
					const node = nodeById.get(id);
					return node === undefined ? [] : [node];
				}),
				edges: [...selectedEdges.values()],
				unresolved: [...unresolved.values()],
				reached_depth: reachedDepth,
				truncated,
				reason,
				coverage: graph.coverage,
				limitations: ["Static analysis does not prove that an authored UI action is reachable or executed at runtime.", "Provider call graphs may omit unresolved indirect dispatch."]
			};
		};
		joinInterfaceBuilderDispatch = (graph, metadata) => {
			const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
			const edges = [...graph.edges];
			const existingEdgeIds = new Set(edges.map(({ id }) => id));
			const selectorNodesByAction = new Map();
			for (const edge of edges) {
				if (edge.resolution === "observed" && edge.relation === "target_action" && nodes.get(edge.to)?.kind === "objc_selector") selectorNodesByAction.set(edge.from, edge.to);
			}
			let examined = 0;
			let resolved = 0;
			let inferredWithoutOwnerClass = 0;
			for (const action of nodes.values()) {
				if (action.kind !== "action") continue;
				const selector = action.attributes.selector;
				if (typeof selector !== "string" || selector.length === 0) continue;
				const selectorNodeId = selectorNodesByAction.get(action.id);
				if (selectorNodeId === undefined) continue;
				const destinationEdge = edges.find((edge) => edge.resolution === "observed" && edge.relation === "target_action" && edge.from === action.id && [
					"view_controller",
					"placeholder",
					"external_object"
				].includes(nodes.get(edge.to)?.kind ?? ""));
				if (destinationEdge === undefined || destinationEdge.resolution !== "observed") continue;
				const owner = nodes.get(destinationEdge.to);
				examined += 1;
				const declaredClass = owner?.attributes.class_name;
				const className = typeof declaredClass === "string" && declaredClass.length > 0 && owner?.kind === "view_controller" ? declaredClass : null;
				const candidates = metadata.objc_dispatch_implementations.filter((candidate) => candidate.method_type === "instance" && candidate.selector === selector && (className === null || candidate.class_name.replace(/\([^)]*\)$/u, "") === className));
				const implementation = candidates.length === 1 ? candidates[0] : undefined;
				const edgeId = `dispatch:${selectorNodeId}:${className ?? owner?.id ?? "unknown"}:${selector}`;
				if (existingEdgeIds.has(edgeId)) continue;
				existingEdgeIds.add(edgeId);
				if (implementation === undefined || implementation.implementation_address === null) {
					edges.push({
						id: edgeId,
						from: selectorNodeId,
						to: null,
						relation: "objc_dispatch",
						resolution: "unresolved",
						reason: candidates.length > 1 ? "selector_has_multiple_candidate_implementations" : "implementation_not_resolved_from_binary_metadata_or_provider_symbols",
						evidence: [...action.evidence, ...candidates.flatMap(({ evidence }) => evidence)],
						limitations: ["A missing or ambiguous symbol match does not prove that the runtime implementation is absent."]
					});
					continue;
				}
				const functionId = `native:function:${implementation.implementation_address}`;
				if (!nodes.has(functionId)) nodes.set(functionId, {
					id: functionId,
					kind: "function",
					name: `${implementation.class_name} ${selector}`,
					location: {
						address: implementation.implementation_address,
						file_offset: implementation.location.file_offset
					},
					attributes: {
						class_name: implementation.class_name,
						selector,
						method_type: implementation.method_type
					},
					evidence: implementation.evidence
				});
				edges.push({
					id: edgeId,
					from: selectorNodeId,
					to: functionId,
					relation: "objc_dispatch",
					resolution: className !== null && implementation.decode.status === "decoded" ? "resolved" : "inferred",
					evidence: [...action.evidence, ...implementation.evidence],
					limitations: className === null ? ["The selector uniquely matches a encoded or symbolized method, but the Interface Builder receiver is an unresolved placeholder; runtime dispatch was not observed."] : ["The Interface Builder target and encoded or symbolized method agree on class and selector; runtime dispatch and dynamically supplied targets were not observed."]
				});
				resolved += 1;
				if (className === null) inferredWithoutOwnerClass += 1;
			}
			return nativeInvestigationGraphSchema.parse({
				...graph,
				provider: {
					id: "rea-native-investigation",
					version: null,
					tool_version: "rea-native-investigation/1"
				},
				nodes: [...nodes.values()],
				edges,
				coverage: [...graph.coverage, {
					facet: "ui_to_objc_dispatch",
					status: examined === resolved && inferredWithoutOwnerClass === 0 ? "complete" : "partial",
					reason: examined === resolved && inferredWithoutOwnerClass === 0 ? null : inferredWithoutOwnerClass > 0 ? "some_action_receivers_remain_placeholders" : "some_action_implementations_not_resolved",
					examined,
					omitted: examined - resolved + inferredWithoutOwnerClass
				}]
			});
		};
	})))();
}

//#endregion
//#region dist/domain/apple/interfaceBuilderGraph.js
var interfaceBuilderDocumentSchema, interfaceBuilderAnalysisSchema, buildInterfaceBuilderAnalysis, interfaceBuilderLimitsSchema;
function init_interfaceBuilderGraph() {
	return (init_interfaceBuilderGraph = __esmMin((() => {
		init_interfaceBuilderKeyedArchive();
		init_nativeInvestigationGraph();
		interfaceBuilderDocumentSchema = z.strictObject({
			relative_path: z.string().min(1),
			archive_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			document_kind: z.enum(["nib", "storyboard_scene"]),
			object_count: z.number().int().nonnegative(),
			connection_count: z.number().int().nonnegative(),
			hierarchy_complete: z.boolean()
		});
		interfaceBuilderAnalysisSchema = z.strictObject({
			target_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			documents: z.array(interfaceBuilderDocumentSchema).max(64),
			graph: nativeInvestigationGraphSchema,
			limitations: z.array(z.string())
		});
		buildInterfaceBuilderAnalysis = (input) => {
			const nodes = new Map();
			const edges = [];
			const coverage = [];
			const summaries = [];
			let truncated = false;
			let omittedObjects = 0;
			let omittedConnections = 0;
			let omittedGraphNodes = 0;
			let omittedHierarchyReferences = 0;
			for (const document of input.documents.slice(0, input.limits.max_documents)) {
				const parsed = parseInterfaceBuilderRecords(document.raw);
				const prefix = `ib:${JSON.stringify(document.relativePath)}:`;
				const graphId = (kind, parts = []) => `${prefix}${kind}:${JSON.stringify(parts)}`;
				const rootId = `${prefix}root`;
				const objectIds = new Set(parsed.objects.map(({ id }) => id));
				const evidenceFor = (description) => [{
					kind: "interface_builder_resource",
					description,
					location: {
						address: null,
						file_offset: null
					},
					artifact_path: document.relativePath,
					artifact_sha256: document.archiveSha256
				}];
				const addNode = (node) => {
					if (nodes.has(node.id)) return true;
					if (nodes.size >= input.limits.max_objects) {
						truncated = true;
						omittedGraphNodes += 1;
						return false;
					}
					nodes.set(node.id, node);
					return true;
				};
				const rootNode = {
					id: rootId,
					kind: document.documentKind === "nib" ? "scene" : "storyboard",
					name: document.relativePath,
					location: null,
					attributes: { document_kind: document.documentKind },
					evidence: evidenceFor("compiled document")
				};
				addNode(rootNode);
				let documentObjectCount = 0;
				for (const object of parsed.objects.slice(0, input.limits.max_objects)) {
					const id = graphId("object", [object.id]);
					const kind = object.kind === "other" ? "unknown" : object.kind;
					if (!addNode({
						id,
						kind,
						name: object.name,
						location: null,
						attributes: {
							...object.attributes,
							interface_builder_object_id: object.id,
							class_name: object.class_name
						},
						evidence: evidenceFor(`object ${object.id}`)
					})) {
						break;
					}
					documentObjectCount += 1;
				}
				let connectionEdgeCount = 0;
				let hierarchyEdgeCount = 0;
				let documentOmittedConnections = 0;
				let documentOmittedHierarchyEdges = 0;
				let hierarchyTruncated = false;
				const objectNodeId = (objectId) => graphId("object", [objectId]);
				const addEdge = (edge, isHierarchy) => {
					if (isHierarchy ? hierarchyEdgeCount >= input.limits.max_objects : connectionEdgeCount >= input.limits.max_connections * 3) {
						truncated = true;
						if (isHierarchy) {
							hierarchyTruncated = true;
							documentOmittedHierarchyEdges += 1;
						} else {
							omittedConnections += 1;
							documentOmittedConnections += 1;
						}
						return;
					}
					edges.push(edge);
					if (isHierarchy) hierarchyEdgeCount += 1;
					else connectionEdgeCount += 1;
				};
				const connect = (id, from, to, relation, description, reason) => {
					const isHierarchy = relation === "contains" && id.includes(":hierarchy:");
					if (!nodes.has(from)) {
						truncated = true;
						if (isHierarchy) {
							hierarchyTruncated = true;
							documentOmittedHierarchyEdges += 1;
						} else {
							omittedConnections += 1;
							documentOmittedConnections += 1;
						}
						return;
					}
					const evidence = evidenceFor(description);
					const unresolvedEndpoint = to !== null && !nodes.has(to);
					if (unresolvedEndpoint) {
						truncated = true;
						if (isHierarchy) hierarchyTruncated = true;
					}
					const edgeTo = unresolvedEndpoint ? null : to;
					const edgeReason = unresolvedEndpoint ? "endpoint_omitted_by_object_limit" : reason ?? "destination_unresolved";
					addEdge(edgeTo === null ? {
						id,
						from,
						to: null,
						relation,
						resolution: "unresolved",
						reason: edgeReason,
						evidence,
						limitations: []
					} : {
						id,
						from,
						to: edgeTo,
						relation,
						resolution: "observed",
						evidence,
						limitations: []
					}, isHierarchy);
				};
				let hierarchyCount = 0;
				const visitHierarchy = (initial, initialParentId) => {
					const pending = [{
						value: initial,
						parentId: initialParentId
					}];
					while (pending.length > 0) {
						if (hierarchyCount >= input.limits.max_objects) {
							truncated = true;
							hierarchyTruncated = true;
							return;
						}
						const entry = pending.pop();
						if (entry === undefined) break;
						const { value, parentId } = entry;
						if (Array.isArray(value)) {
							for (let index = value.length - 1; index >= 0; index -= 1) {
								const child = value[index];
								if (child !== undefined) pending.push({
									value: child,
									parentId
								});
							}
							continue;
						}
						if (typeof value !== "object" || value === null) continue;
						const item = record(value);
						const objectId = firstString(item.objectID, item["object-id"], item.id, typeof item.archiveUID === "number" ? String(item.archiveUID) : null);
						let nextParent = parentId;
						if (objectId !== null) {
							const known = objectIds.has(objectId);
							const childId = known ? objectNodeId(objectId) : graphId("unknown", [objectId]);
							if (!known && !addNode({
								id: childId,
								kind: "unknown",
								name: firstString(item.label, item.name) ?? objectId,
								location: null,
								attributes: { interface_builder_object_id: objectId },
								evidence: evidenceFor(`hierarchy item ${objectId}`)
							})) hierarchyTruncated = true;
							connect(graphId("hierarchy", [parentId, childId]), parentId, childId, "contains", `hierarchy ${objectId}`);
							nextParent = childId;
							hierarchyCount += 1;
						}
						pending.push({
							value: item.children,
							parentId: nextParent
						});
					}
				};
				for (const hierarchy of parsed.hierarchy) visitHierarchy(hierarchy, rootId);
				for (const [index, item] of parsed.connections.slice(0, input.limits.max_connections).entries()) {
					const sourceId = objectNodeId(item.source_id);
					if (!nodes.has(sourceId)) addNode({
						id: sourceId,
						kind: "unknown",
						name: item.source_id,
						location: null,
						attributes: { interface_builder_object_id: item.source_id },
						evidence: evidenceFor(`connection source ${item.source_id}`)
					});
					const destinationId = item.destination_id === null ? null : objectNodeId(item.destination_id);
					if (item.kind === "action") {
						const actionId = graphId("action", [item.id]);
						const selectorId = item.label === null ? null : graphId("selector", [item.destination_id, item.label]);
						addNode({
							id: actionId,
							kind: "action",
							name: item.label ?? "unlabeled action",
							location: null,
							attributes: {
								selector: item.label,
								destination_id: item.destination_id,
								...item.attributes
							},
							evidence: evidenceFor(`action ${item.id}`)
						});
						connect(graphId("action-edge", [item.id, "source"]), sourceId, actionId, "target_action", `action source ${item.source_id}`);
						if (selectorId !== null) {
							addNode({
								id: selectorId,
								kind: "objc_selector",
								name: item.label ?? "unknown selector",
								location: null,
								attributes: { destination_id: item.destination_id },
								evidence: evidenceFor(`selector ${item.label}`)
							});
							connect(graphId("action-edge", [item.id, "selector"]), actionId, selectorId, "target_action", `selector ${item.label}`);
						}
						if (destinationId === null || !nodes.has(destinationId)) connect(graphId("action-edge", [item.id, "destination"]), actionId, null, "target_action", `action destination ${item.destination_id ?? "missing"}`, "destination_object_missing_or_external");
						else connect(graphId("action-edge", [item.id, "destination"]), actionId, destinationId, "target_action", `action destination ${item.destination_id}`);
					} else if (item.kind === "outlet") {
						const outletId = graphId("outlet", [item.id]);
						addNode({
							id: outletId,
							kind: "outlet",
							name: item.label ?? item.id,
							location: null,
							attributes: item.attributes,
							evidence: evidenceFor(`outlet ${item.id}`)
						});
						connect(graphId("outlet-edge", [item.id, "source"]), sourceId, outletId, "contains", `outlet source ${item.source_id}`);
						if (destinationId === null || !nodes.has(destinationId)) connect(graphId("outlet-edge", [item.id, "destination"]), outletId, null, "outlet_to", `outlet ${item.label ?? item.id}`, "destination_object_missing_or_external");
						else connect(graphId("outlet-edge", [item.id, "destination"]), outletId, destinationId, "outlet_to", `outlet ${item.label ?? item.id}`);
					} else if (item.kind === "segue") {
						if (destinationId === null || !nodes.has(destinationId)) connect(graphId("segue", [index]), sourceId, null, "segue_to", `segue ${item.label ?? item.id}`, "destination_scene_missing");
						else connect(graphId("segue", [index]), sourceId, destinationId, "segue_to", `segue ${item.label ?? item.id}`);
					} else {
						connect(graphId("unknown-connection", [index]), sourceId, null, "contains", `connection type ${item.kind}`, "unsupported_connection_type");
					}
				}
				const objectsTruncated = parsed.omittedObjects > 0 || parsed.objects.length > documentObjectCount;
				const parserOmittedHierarchyReferences = parsed.omittedHierarchyReferences;
				const omittedSerializedHierarchyReferences = document.omittedSerializedHierarchyReferences ?? 0;
				omittedHierarchyReferences += parserOmittedHierarchyReferences + omittedSerializedHierarchyReferences;
				const parserOmittedConnections = parsed.omittedConnections;
				const connectionsTruncated = parserOmittedConnections > 0 || parsed.connections.length > input.limits.max_connections;
				const connectionsUnresolved = parsed.unresolvedConnections > 0;
				omittedObjects += parsed.omittedObjects + Math.max(0, parsed.objects.length - documentObjectCount);
				omittedConnections += Math.max(0, parsed.connections.length - input.limits.max_connections) + parserOmittedConnections + parsed.unresolvedConnections;
				const hierarchyStatus = parserOmittedHierarchyReferences > 0 || omittedSerializedHierarchyReferences > 0 ? "partial" : parsed.hierarchy.length === 0 ? "unsupported" : hierarchyTruncated ? "partial" : "complete";
				summaries.push({
					relative_path: document.relativePath,
					archive_sha256: document.archiveSha256,
					document_kind: document.documentKind,
					object_count: parsed.objectCount,
					connection_count: parsed.connections.length + parserOmittedConnections + parsed.unresolvedConnections,
					hierarchy_complete: hierarchyStatus === "complete"
				});
				coverage.push({
					facet: `objects:${document.relativePath}`,
					status: objectsTruncated ? "partial" : "complete",
					reason: objectsTruncated ? "object_limit_reached" : null,
					examined: documentObjectCount,
					omitted: parsed.omittedObjects + Math.max(0, parsed.objects.length - documentObjectCount)
				}, {
					facet: `connections:${document.relativePath}`,
					status: connectionsTruncated || documentOmittedConnections > 0 || connectionsUnresolved ? "partial" : "complete",
					reason: connectionsTruncated || documentOmittedConnections > 0 ? "connection_limit_reached" : connectionsUnresolved ? "connection_unresolved" : null,
					examined: Math.min(parsed.connections.length, input.limits.max_connections),
					omitted: Math.max(0, parsed.connections.length - input.limits.max_connections) + documentOmittedConnections + parserOmittedConnections + parsed.unresolvedConnections
				}, {
					facet: `hierarchy:${document.relativePath}`,
					status: hierarchyStatus,
					reason: parserOmittedHierarchyReferences > 0 ? "archive_hierarchy_references_missing" : omittedSerializedHierarchyReferences > 0 ? "serialized_view_hierarchy_incomplete" : parsed.hierarchy.length === 0 ? "archive_hierarchy_not_decoded" : hierarchyTruncated ? "graph_limit_reached" : null,
					examined: hierarchyCount,
					omitted: documentOmittedHierarchyEdges + parserOmittedHierarchyReferences + omittedSerializedHierarchyReferences
				}, {
					facet: `classes:${document.relativePath}`,
					status: Object.keys(parsed.classes).length > 0 ? "complete" : "unsupported",
					reason: Object.keys(parsed.classes).length > 0 ? null : "archive_class_table_not_decoded",
					examined: Object.keys(parsed.classes).length,
					omitted: 0
				});
			}
			if (input.documents.length > input.limits.max_documents) {
				truncated = true;
				coverage.push({
					facet: "documents",
					status: "partial",
					reason: "document_limit_reached",
					examined: input.limits.max_documents,
					omitted: input.documents.length - input.limits.max_documents
				});
			}
			if (omittedGraphNodes > 0) coverage.push({
				facet: "graph_nodes",
				status: "partial",
				reason: "max_objects_reached",
				examined: nodes.size,
				omitted: omittedGraphNodes
			});
			return interfaceBuilderAnalysisSchema.parse({
				target_sha256: input.targetSha256,
				documents: summaries,
				graph: {
					target_sha256: input.targetSha256,
					provider: {
						id: "rea-artifact-graph",
						version: "1",
						tool_version: input.toolVersion
					},
					nodes: [...nodes.values()],
					edges,
					coverage,
					truncated: truncated || omittedObjects > 0 || omittedConnections > 0 || omittedHierarchyReferences > 0
				},
				limitations: [
					"The graph reflects recognized Interface Builder archive fields and connections; omitted private or unrecognized archive fields remain unknown.",
					"A target-action selector is an Interface Builder observation and does not prove that the binary contains a matching implementation.",
					"Decoded constraints, runtime visibility, dynamic UI creation, and pixel geometry are not inferred from these archives."
				]
			});
		};
		interfaceBuilderLimitsSchema = z.strictObject({
			max_documents: z.number().int().min(1).max(64).default(64),
			max_objects: z.number().int().min(1).max(2e4).default(2e4),
			max_connections: z.number().int().min(1).max(4e4).default(4e4),
			trace: nativeInvestigationTraceLimitsSchema.default({
				max_depth: 8,
				max_nodes: 250,
				max_edges: 500
			})
		});
	})))();
}

//#endregion
//#region dist/domain/native/nativeValueTrace.js
var nativeValueTraceInputSchema, nativeValueTraceSchema;
function init_nativeValueTrace() {
	return (init_nativeValueTrace = __esmMin((() => {
		init_nativeValueFlow();
		nativeValueTraceInputSchema = z.strictObject({
			procedure: z.string().min(1),
			max_depth: z.number().int().min(0).max(16).default(3),
			max_functions: z.number().int().min(1).max(64).default(16),
			max_call_sites: z.number().int().min(1).max(4096).default(256),
			max_nodes: z.number().int().min(1).max(2e4).default(5e3),
			max_edges: z.number().int().min(1).max(4e4).default(1e4),
			offset: z.number().int().min(0).default(0),
			limit: z.number().int().min(1).max(5e3).default(1e3)
		});
		nativeValueTraceSchema = z.strictObject({
			seed: z.string(),
			target_sha256: z.string(),
			nodes: z.array(z.strictObject({
				id: z.string(),
				procedure: z.string(),
				evidence_id: z.string(),
				kind: z.enum(["operation", "parameter"]),
				operation: nativePcodeOperationSchema.nullable(),
				parameter: z.strictObject({
					ordinal: z.number().int().nonnegative(),
					name: z.string(),
					data_type: z.string()
				}).nullable()
			})),
			edges: z.array(z.strictObject({
				source: z.string(),
				target: z.string(),
				input_index: z.number().int().nonnegative().nullable(),
				kind: z.enum([
					"def-use",
					"call",
					"parameter-use",
					"argument-binding",
					"return-binding"
				]),
				status: z.enum([
					"derived",
					"direct",
					"resolved-indirect",
					"candidate"
				]),
				evidence_id: z.string()
			})),
			procedures: z.array(z.strictObject({
				address: z.string(),
				depth: z.number().int().nonnegative(),
				evidence_id: z.string(),
				provider: z.string(),
				analysis_profile_digest: z.string().nullable()
			})),
			unknowns: z.array(z.strictObject({
				procedure: z.string(),
				address: z.string().nullable(),
				reason: z.string()
			})),
			total_nodes: z.number().int().nonnegative(),
			total_edges: z.number().int().nonnegative(),
			decompilations: z.number().int().nonnegative(),
			next_offset: z.number().int().nonnegative().nullable(),
			truncated: z.boolean(),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
export { isZipInventoryScopeLimitation as $, isElfMetadataArchitecture as $t, addressList as A, parseFunctionDossier as At, nullableText as B, nativeValueFlowSchema as Bt, isSwiftMangledSymbolName as C, analysisStringSchema as Ct, PROVIDER_EFFECT_NAMES as D, functionInstructionWindowSchema as Dt, isUIKitRuntimeConnectionClass as E, functionDossierSchema as Et, expandProviderCapabilities as F, procedureIdentitySchema as Ft, sessionProvider as G, init_addressCoordinate as Gt, providerCapabilitySet as H, nativeApiBoundarySchema as Ht, functionDossierOutput as I, referenceEdgeSchema as It, targetKindSchema as J, committedProviderSchema as Jt, symbolDiscoveryOutput as K, analysisProfileSchema as Kt, graphNode as L, referenceKindSchema as Lt, addressedValue as M, parseRelatedAddresses as Mt, containingProcedureResolution as N, parseSegmentImageBase as Nt, TOOL_ANNOTATION_NAMES as O, init_hopperValues as Ot, evidenceResultOf as P, parseSegments as Pt, init_zipPackageFormat as Q, init_binaryTargetTypes as Qt, init_toolOutputSchemaPrimitives as R, unresolvedCallSchema as Rt, init_swiftSymbolClassification as S, analysisBookmarkSchema as St, interfaceBuilderConnectionFieldNames as T, functionBodySchema as Tt, requireOutputSchema as U, nativeApiInspectionResultSchema as Ut, procedureInfoOutput as V, init_nativeApiBoundary as Vt, segmentOutput as W, addressCoordinate as Wt, ZIP_NON_ENTRY_LIMITATION as X, init_analysisProfile as Xt, toolAvailabilityInventory as Y, createAnalysisProfile as Yt, hasZipSignature as Z, BINARY_ARCHITECTURES as Zt, init_objcSwiftMetadata as _, init_nativeInstruction as _t, init_interfaceBuilderGraph as a, analysisProviderSelectorSchema as an, createImmutableEvidenceSteps as at, objcSwiftMetadataSchema as b, nativeInstructionSchema as bt, interfaceBuilderLimitsSchema as c, immutableEvidence as ct, nativeInvestigationCoverageSchema as d, parseEvidence as dt, isMachOFormat as en, isZipPackageFormat as et, nativeInvestigationEdgeSchema as f, providerSchema as ft, traceNativeInvestigationGraph as g, init_canonicalJsonDigestSteps as gt, nativeInvestigationTraceSchema as h, canonicalJsonDigestSteps as ht, buildInterfaceBuilderAnalysis as i, analysisProviderIdSchema as in, createEvidence as it, addressedEntry as j, parseListCount as jt, TOOL_EFFECT_NAMES as k, parseDocuments as kt, init_nativeInvestigationGraph as l, init_evidence as lt, nativeInvestigationNodeSchema as m, rebindEvidenceToTargetPath as mt, nativeValueTraceInputSchema as n, relationshipCoverageLimitations as nn, analysisErrorProjectionSchema as nt, interfaceBuilderAnalysisSchema as o, init_providerSelection as on, evidenceLocationSchema as ot, nativeInvestigationGraphSchema as p, rebindEvidenceSubjectTargetPath as pt, targetFormatSchema as q, analysisProfilesEqual as qt, nativeValueTraceSchema as r, relationshipCoverageSchema as rn, init_errorSchemas as rt, interfaceBuilderDocumentSchema as s, evidenceSchema as st, init_nativeValueTrace as t, init_relationshipCoverage as tn, zipPackageFormatForPath as tt, joinInterfaceBuilderDispatch as u, isImmutableEvidence as ut, inspectNativeDispatchMetadata as v, nativeCallTargetsSchema as vt, init_interfaceBuilderKeyedArchive as w, functionBodyEntryAgrees as wt, classifySwiftSymbol as x, addressDistance as xt, nativeDispatchMetadataResultSchema as y, nativeInstructionInputSchema as yt, lifecycleResultOf as z, init_nativeValueFlow as zt };