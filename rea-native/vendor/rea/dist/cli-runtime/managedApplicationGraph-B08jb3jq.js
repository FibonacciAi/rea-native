import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { digestSchema, evidenceSchema, init_digests, init_evidence, parseEvidence, prefixedDigestSchema } from "./reconstructionObligationLedgerSchemas-Bao0xMr-.js";
import { createJavaScriptApplicationEdge, createJavaScriptApplicationGraph, createJavaScriptApplicationNode, init_javascriptApplicationGraph, javascriptApplicationGraphSchema } from "./javascriptApplicationAnalysis-HgMzVMQw.js";
import { z } from "zod";
import { basename } from "node:path";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";

//#region dist/domain/managed/managedArtifact.js
var tokenSchema, offsetSchema, cliMetadataGuidSchema, publicKeyIdentitySchema, assemblyIdentitySchema, moduleIdentitySchema, assemblyReferenceSchema, managedResourceSchema, customAttributeSchema, managedSignatureSchema, managedTypeSchema, managedExportedTypeSchema, managedFieldSchema, managedExceptionRegionSchema, managedInstructionAnchorSchema, managedMethodBodySchema, managedMethodSchema, declaringTypeNameSchema, managedMemberReferenceSchema, managedUserStringSchema, managedModuleReferenceSchema, managedNativeImportSchema, managedNativeImplementationSchema, managedCallEdgeSchema, managedFieldAccessSchema, managedParseIssueSchema, managedArtifactInspectionSchema, managedMemberInspectionSchema, managedNativeBoundaryInspectionSchema;
function init_managedArtifact() {
	return (init_managedArtifact = __esmMin((() => {
		init_digests();
		tokenSchema = z.string().regex(/^0x[0-9a-f]{8}$/u);
		offsetSchema = z.number().int().min(0);
		cliMetadataGuidSchema = z.string().regex(/^[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$/u);
		publicKeyIdentitySchema = z.object({
			kind: z.enum([
				"none",
				"public-key",
				"public-key-token"
			]),
			byte_length: z.number().int().min(0),
			sha256: digestSchema.nullable(),
			token: z.string().regex(/^[a-f0-9]{16}$/u).nullable()
		});
		assemblyIdentitySchema = z.object({
			name: z.string(),
			version: z.string().regex(/^\d+\.\d+\.\d+\.\d+$/u),
			culture: z.string().nullable(),
			flags: z.number().int().min(0).max(4294967295),
			hash_algorithm: z.number().int().min(0).max(4294967295),
			public_key: publicKeyIdentitySchema,
			token: tokenSchema,
			row_offset: offsetSchema
		});
		moduleIdentitySchema = z.object({
			name: z.string(),
			generation: z.number().int().min(0).max(65535),
			mvid: cliMetadataGuidSchema.nullable(),
			enc_id: cliMetadataGuidSchema.nullable(),
			enc_base_id: cliMetadataGuidSchema.nullable(),
			token: tokenSchema,
			row_offset: offsetSchema
		});
		assemblyReferenceSchema = z.object({
			name: z.string(),
			version: z.string().regex(/^\d+\.\d+\.\d+\.\d+$/u),
			culture: z.string().nullable(),
			flags: z.number().int().min(0).max(4294967295),
			public_key_or_token: publicKeyIdentitySchema,
			hash_value_sha256: digestSchema.nullable(),
			hash_value_length: z.number().int().min(0),
			token: tokenSchema,
			row_offset: offsetSchema
		});
		managedResourceSchema = z.object({
			name: z.string(),
			flags: z.number().int().min(0).max(4294967295),
			visibility: z.enum([
				"public",
				"private",
				"unknown"
			]),
			implementation_token: tokenSchema.nullable(),
			embedded: z.boolean(),
			declared_offset: z.number().int().min(0).max(4294967295),
			data_length: z.number().int().min(0).nullable(),
			data_sha256: digestSchema.nullable(),
			token: tokenSchema,
			row_offset: offsetSchema
		});
		customAttributeSchema = z.object({
			parent_token: tokenSchema,
			constructor_token: tokenSchema.nullable(),
			type_name: z.string().nullable(),
			value_length: z.number().int().min(0),
			value_sha256: digestSchema,
			decoded_fixed_string: z.string().nullable(),
			token: tokenSchema,
			row_offset: offsetSchema
		});
		managedSignatureSchema = z.object({
			raw_length: z.number().int().min(0),
			raw_sha256: digestSchema,
			kind: z.enum([
				"method",
				"field",
				"unknown"
			]),
			parse_status: z.enum([
				"decoded",
				"partial",
				"unsupported",
				"malformed"
			]),
			calling_convention: z.string().nullable(),
			generic_parameter_count: z.number().int().min(0).nullable(),
			parameter_count: z.number().int().min(0).nullable(),
			return_type: z.string().nullable(),
			parameter_types: z.array(z.string()),
			field_type: z.string().nullable(),
			issue: z.string().nullable()
		});
		managedTypeSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			namespace: z.string(),
			name: z.string(),
			full_name: z.string(),
			flags: z.number().int().min(0).max(4294967295),
			extends_token: tokenSchema.nullable(),
			field_list: z.object({
				first_row: z.number().int().min(1).nullable(),
				last_row: z.number().int().min(0).nullable(),
				count: z.number().int().min(0)
			}),
			method_list: z.object({
				first_row: z.number().int().min(1).nullable(),
				last_row: z.number().int().min(0).nullable(),
				count: z.number().int().min(0)
			})
		});
		managedExportedTypeSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			namespace: z.string(),
			name: z.string(),
			flags: z.number().int().min(0).max(4294967295),
			forwarder: z.boolean(),
			type_def_id: z.number().int().min(0).max(4294967295),
			implementation_token: tokenSchema.nullable()
		});
		managedFieldSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			declaring_type_token: tokenSchema.nullable(),
			declaring_type: z.string().nullable(),
			name: z.string(),
			flags: z.number().int().min(0).max(65535),
			signature: managedSignatureSchema
		});
		managedExceptionRegionSchema = z.object({
			flags: z.number().int().min(0).max(4294967295),
			try_offset: z.number().int().min(0),
			try_length: z.number().int().min(0),
			handler_offset: z.number().int().min(0),
			handler_length: z.number().int().min(0),
			class_token: tokenSchema.nullable(),
			filter_offset: z.number().int().min(0).nullable()
		});
		managedInstructionAnchorSchema = z.object({
			il_offset: z.number().int().min(0),
			opcode: z.string().min(1),
			operand_kind: z.enum([
				"none",
				"branch",
				"constant",
				"field",
				"method",
				"signature",
				"string",
				"switch",
				"token",
				"type",
				"variable",
				"unknown"
			]),
			operand: z.string().nullable()
		});
		managedMethodBodySchema = z.object({
			status: z.enum([
				"present",
				"partial",
				"absent",
				"malformed"
			]),
			header_format: z.enum([
				"tiny",
				"fat",
				"none",
				"unknown"
			]),
			rva: z.number().int().min(0).max(4294967295),
			file_offset: offsetSchema.nullable(),
			max_stack: z.number().int().min(0).nullable(),
			init_locals: z.boolean().nullable(),
			local_var_sig_token: tokenSchema.nullable(),
			il_size: z.number().int().min(0),
			il_sha256: digestSchema.nullable().describe("SHA-256 of exactly the raw il_size CIL bytes; excludes the method header, locals signature, alignment, and extra sections"),
			normalized_il_sha256: digestSchema.nullable().describe("Member-result-v1 SHA-256 of UTF-8 JSON [opcode, operand_kind, operand] tuples for a complete decode; retains build-local tokens, omits switch targets, and excludes headers, locals, and exception regions"),
			instruction_count: z.number().int().min(0),
			decoded_instruction_count: z.number().int().min(0),
			truncated_instructions: z.number().int().min(0),
			opcode_counts: z.record(z.string(), z.number().int().min(1)),
			anchors: z.array(managedInstructionAnchorSchema),
			exception_regions: z.array(managedExceptionRegionSchema),
			issue: z.string().nullable()
		});
		managedMethodSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			declaring_type_token: tokenSchema.nullable(),
			declaring_type: z.string().nullable(),
			name: z.string(),
			rva: z.number().int().min(0).max(4294967295),
			impl_flags: z.number().int().min(0).max(65535),
			flags: z.number().int().min(0).max(65535),
			signature: managedSignatureSchema,
			body: managedMethodBodySchema
		});
		declaringTypeNameSchema = z.string().nullable().default(null);
		managedMemberReferenceSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			parent_token: tokenSchema.nullable(),
			parent_name: declaringTypeNameSchema.describe("Name of a TypeDef, TypeRef, or generic-instantiation TypeSpec parent; null for other parents or when unknown"),
			name: z.string(),
			signature: managedSignatureSchema
		});
		managedUserStringSchema = z.object({
			token: tokenSchema,
			offset: offsetSchema.describe("File offset of the #US item"),
			value: z.string().describe("Decoded UTF-16 code units, excluding the terminal flag byte; unpaired surrogates are kept")
		});
		managedModuleReferenceSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			name: z.string()
		});
		managedNativeImportSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			mapping_flags: z.number().int().min(0).max(65535),
			mapping_flags_hex: z.string().regex(/^0x[0-9a-f]{4}$/u),
			member_token: tokenSchema.nullable(),
			member_kind: z.enum([
				"method",
				"field",
				"unknown"
			]),
			member_name: z.string().nullable(),
			import_name: z.string(),
			import_scope_token: tokenSchema.nullable(),
			import_scope_name: z.string().nullable(),
			no_mangle: z.boolean(),
			char_set: z.enum([
				"not-specified",
				"ansi",
				"unicode",
				"auto",
				"unknown"
			]),
			call_convention: z.enum([
				"not-specified",
				"winapi",
				"cdecl",
				"stdcall",
				"thiscall",
				"fastcall",
				"unknown"
			]),
			supports_last_error: z.boolean(),
			best_fit: z.enum([
				"assembly-default",
				"enabled",
				"disabled",
				"unknown"
			]),
			throw_on_unmappable_char: z.enum([
				"assembly-default",
				"enabled",
				"disabled",
				"unknown"
			]),
			verification: z.literal("managed-declaration-only")
		});
		managedNativeImplementationSchema = z.object({
			token: tokenSchema,
			row_offset: offsetSchema,
			name: z.string(),
			rva: z.number().int().min(0).max(4294967295),
			flags: z.number().int().min(0).max(65535),
			impl_flags: z.number().int().min(0).max(65535),
			code_type: z.enum([
				"il",
				"native",
				"optil",
				"runtime",
				"unknown"
			]),
			managed_kind: z.enum([
				"managed",
				"unmanaged",
				"unknown"
			]),
			pinvoke_declared: z.boolean(),
			boundary_kind: z.enum([
				"pinvoke",
				"native-body",
				"runtime-provided",
				"unmanaged-method",
				"mixed-or-unknown"
			]),
			body_interpretation: z.enum([
				"managed-cil",
				"native-or-runtime",
				"not-file-backed",
				"unknown"
			])
		});
		managedCallEdgeSchema = z.object({
			caller_token: tokenSchema,
			caller: z.string().nullable(),
			opcode: z.string(),
			target_token: tokenSchema,
			target_kind: z.enum([
				"method-def",
				"member-ref",
				"method-spec",
				"unknown"
			]),
			target_name: z.string().nullable().describe("Method name; a method-spec target reports its generic method"),
			target_declaring_type: declaringTypeNameSchema.describe("Declaring type of the called method; null when unknown")
		});
		managedFieldAccessSchema = z.object({
			method_token: tokenSchema,
			method: z.string().nullable(),
			opcode: z.string(),
			field_token: tokenSchema,
			field_name: z.string().nullable(),
			field_declaring_type: declaringTypeNameSchema.describe("Declaring type of the accessed field; null when unknown")
		});
		managedParseIssueSchema = z.object({
			code: z.enum([
				"resource-limit",
				"invalid-cli-header",
				"invalid-directory",
				"invalid-metadata-root",
				"invalid-stream",
				"missing-stream",
				"invalid-tables",
				"invalid-row",
				"invalid-heap-index",
				"invalid-string",
				"invalid-blob",
				"unsupported-signature",
				"invalid-guid",
				"invalid-resource"
			]),
			scope: z.string().min(1),
			offset: offsetSchema.nullable(),
			detail: z.string().min(1)
		});
		managedArtifactInspectionSchema = z.object({
			artifact: z.object({
				path: z.string().min(1),
				sha256: digestSchema,
				byte_length: z.number().int().min(0),
				format: z.literal("pe")
			}),
			pe: z.object({
				machine: z.number().int().min(0).max(65535),
				machine_hex: z.string().regex(/^0x[0-9a-f]{4}$/u),
				architecture: z.enum([
					"x86",
					"x86_64",
					"arm",
					"arm64"
				]),
				optional_header: z.enum(["pe32", "pe32-plus"]),
				section_count: z.number().int().min(1).max(65535),
				characteristics: z.number().int().min(0).max(65535),
				cli: z.object({
					header_offset: offsetSchema,
					header_size: z.number().int().min(72),
					runtime_version: z.string(),
					flags: z.number().int().min(0).max(4294967295),
					flag_names: z.array(z.string()),
					entry_point: z.object({
						kind: z.enum([
							"metadata-token",
							"native-rva",
							"none"
						]),
						value: z.string().nullable()
					}),
					metadata_rva: z.number().int().min(1).max(4294967295),
					metadata_size: z.number().int().min(1).max(4294967295),
					resources_rva: z.number().int().min(0).max(4294967295),
					resources_size: z.number().int().min(0).max(4294967295),
					strong_name_rva: z.number().int().min(0).max(4294967295),
					strong_name_size: z.number().int().min(0).max(4294967295),
					managed_native_header_rva: z.number().int().min(0).max(4294967295),
					managed_native_header_size: z.number().int().min(0).max(4294967295),
					ready_to_run_signature: z.boolean()
				}).nullable()
			}),
			classification: z.object({
				status: z.enum([
					"managed",
					"not-managed",
					"malformed"
				]),
				container: z.literal("pe"),
				runtime_family: z.enum([
					"dotnet-framework",
					"modern-dotnet",
					"unity-mono",
					"mixed-clr-native",
					"unknown"
				]),
				implementation: z.enum([
					"cil",
					"cil-and-ready-to-run",
					"cpp-cli-mixed",
					"metadata-only",
					"not-managed",
					"unknown"
				]),
				managed_architecture: z.enum([
					"anycpu",
					"anycpu-prefer-32",
					"x86",
					"x86_64",
					"arm",
					"arm64",
					"unknown"
				]),
				evidence: z.array(z.object({
					code: z.string().min(1),
					detail: z.string().min(1),
					file_offset: offsetSchema.nullable()
				}))
			}),
			metadata: z.object({
				status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				version: z.string().nullable(),
				stream_names: z.array(z.string()),
				table_row_counts: z.record(z.string(), z.number().int().min(0).max(4294967295))
			}),
			module: moduleIdentitySchema.nullable(),
			assembly: assemblyIdentitySchema.nullable(),
			target_frameworks: z.array(z.string()),
			references: z.array(assemblyReferenceSchema),
			resources: z.array(managedResourceSchema),
			attributes: z.array(customAttributeSchema),
			coverage: z.object({
				state: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				issues: z.array(managedParseIssueSchema)
			}),
			limitations: z.array(z.string())
		});
		managedMemberInspectionSchema = z.object({
			artifact: z.object({
				path: z.string().min(1),
				sha256: digestSchema,
				byte_length: z.number().int().min(0),
				format: z.literal("pe")
			}),
			module: moduleIdentitySchema.nullable(),
			metadata: z.object({
				status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				version: z.string().nullable(),
				table_row_counts: z.record(z.string(), z.number().int().min(0).max(4294967295))
			}),
			identity_scope: z.object({
				token_identity: z.literal("build-local"),
				requires_artifact_sha256: digestSchema,
				requires_mvid: cliMetadataGuidSchema.nullable()
			}),
			types: z.array(managedTypeSchema),
			exported_types: z.array(managedExportedTypeSchema).nullable().default(null),
			fields: z.array(managedFieldSchema),
			methods: z.array(managedMethodSchema),
			member_refs: z.array(managedMemberReferenceSchema),
			call_edges: z.array(managedCallEdgeSchema),
			field_accesses: z.array(managedFieldAccessSchema),
			user_strings: z.object({
				state: z.enum(["complete", "partial"]),
				literals: z.array(managedUserStringSchema),
				issues: z.array(managedParseIssueSchema)
			}).nullable().default(null),
			/** Caller-selected declaring types; null when every type was inspected. */
			selection: z.object({
				type_names: z.array(z.string().min(1)).min(1),
				unmatched_type_names: z.array(z.string().min(1))
			}).nullable().default(null),
			coverage: z.object({
				state: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				issues: z.array(managedParseIssueSchema)
			}),
			limitations: z.array(z.string())
		});
		managedNativeBoundaryInspectionSchema = z.object({
			artifact: z.object({
				path: z.string().min(1),
				sha256: digestSchema,
				byte_length: z.number().int().min(0),
				format: z.literal("pe")
			}),
			module: moduleIdentitySchema.nullable(),
			metadata: z.object({
				status: z.enum([
					"absent",
					"complete",
					"partial",
					"malformed"
				]),
				version: z.string().nullable(),
				table_row_counts: z.record(z.string(), z.number().int().min(0).max(4294967295))
			}),
			identity_scope: z.object({
				token_identity: z.literal("build-local"),
				requires_artifact_sha256: digestSchema,
				requires_mvid: cliMetadataGuidSchema.nullable()
			}),
			cli_native: z.object({
				il_only: z.boolean(),
				requires_32bit: z.boolean(),
				strong_name_signed: z.boolean(),
				native_entry_point: z.boolean(),
				ready_to_run_signature: z.boolean(),
				managed_native_header_rva: z.number().int().min(0).max(4294967295),
				managed_native_header_size: z.number().int().min(0).max(4294967295)
			}).nullable(),
			module_refs: z.array(managedModuleReferenceSchema),
			pinvoke_imports: z.array(managedNativeImportSchema),
			native_implementations: z.array(managedNativeImplementationSchema),
			summary: z.object({
				module_ref_count: z.number().int().min(0),
				pinvoke_import_count: z.number().int().min(0),
				native_implementation_count: z.number().int().min(0),
				ready_to_run: z.boolean().nullable(),
				mixed_mode_or_native_header: z.boolean().nullable()
			}),
			coverage: z.object({
				state: z.enum([
					"complete",
					"partial",
					"unavailable"
				]),
				issues: z.array(managedParseIssueSchema)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/managed/managedInspectionEvidence.js
var managedTokenScopesMatch, parseManagedInspectionEvidence;
function init_managedInspectionEvidence() {
	return (init_managedInspectionEvidence = __esmMin((() => {
		init_evidence();
		managedTokenScopesMatch = (leftMvid, rightMvid) => leftMvid !== null && rightMvid !== null && leftMvid.toLowerCase() === rightMvid.toLowerCase();
		parseManagedInspectionEvidence = (rawEvidence, operation, schema) => {
			const evidence = parseEvidence(rawEvidence);
			if (evidence.operation !== operation) throw new TypeError(`Evidence operation is not ${operation}`);
			const result = schema.parse(evidence.normalized_result);
			const artifactSha256 = result.artifact.sha256;
			const subjectSha256 = evidence.subject?.digest.sha256;
			if (subjectSha256 !== undefined && artifactSha256 !== subjectSha256) throw new TypeError(`Managed Evidence ${operation} (${evidence.evidence_id}) subject SHA-256 ${subjectSha256} does not match normalized artifact SHA-256 ${artifactSha256}`);
			const scope = result.identity_scope;
			if (scope !== undefined && scope.requires_artifact_sha256 !== artifactSha256) throw new TypeError(`Managed Evidence ${operation} (${evidence.evidence_id}) token scope SHA-256 ${scope.requires_artifact_sha256} does not match normalized artifact SHA-256 ${artifactSha256}`);
			const moduleMvid = result.module?.mvid ?? null;
			const scopedMvid = scope?.requires_mvid;
			if (scopedMvid !== undefined && scopedMvid?.toLowerCase() !== moduleMvid?.toLowerCase()) throw new TypeError(`Managed Evidence ${operation} (${evidence.evidence_id}) token scope MVID ${String(scopedMvid)} does not match module MVID ${String(moduleMvid)}`);
			return {
				evidence,
				result
			};
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraphCoverage.js
var omitsAny, completeCoverage, managedSourceCoverage, assessManagedGraphOmissions, managedGraphEvidenceCoverage, managedGraphResultCoverage;
function init_managedApplicationGraphCoverage() {
	return (init_managedApplicationGraphCoverage = __esmMin((() => {
		init_managedInspectionEvidence();
		omitsAny = (omissions) => omissions.partialInput || omissions.unscopedTokenRelationships || omissions.selectedTypes !== null;
		completeCoverage = () => ({
			status: "complete",
			truncated: false,
			omitted_count: 0,
			limits: []
		});
		managedSourceCoverage = (state) => state === "complete" ? completeCoverage() : {
			status: state,
			truncated: false,
			omitted_count: null,
			limits: []
		};
		assessManagedGraphOmissions = (sources) => ({
			unscopedTokenRelationships: sources.members !== null && sources.boundaries !== null && (sources.boundaries.pinvoke_imports.some(({ member_token }) => member_token !== null) || sources.boundaries.native_implementations.length > 0) && !managedTokenScopesMatch(sources.members.identity_scope.requires_mvid, sources.boundaries.identity_scope.requires_mvid),
			partialInput: [
				sources.members?.coverage.state,
				sources.boundaries?.coverage.state,
				sources.artifact?.coverage.state
			].some((state) => state !== undefined && state !== "complete"),
			selectedTypes: sources.members?.selection?.type_names ?? null
		});
		managedGraphEvidenceCoverage = (omissions) => omitsAny(omissions) ? {
			status: "partial",
			truncated: false,
			omitted_count: null,
			limits: []
		} : completeCoverage();
		managedGraphResultCoverage = (omissions) => ({ status: omitsAny(omissions) ? "partial" : "complete-within-inputs" });
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraphNodes.js
var addArtifactNode, addArtifactIdentityNodes, selectModuleSource, addMemberNodes, typeNode, methodNode, fieldNode, addBoundaryNodes, pinvokeNode, nativeImplementationNode, addContainsEdge, artifactLocalIdentity, sourceManagedEvidence, projectedManagedEvidence, pinvokeAssociationEvidence, createManagedEvidence, graphArtifactPath;
function init_managedApplicationGraphNodes() {
	return (init_managedApplicationGraphNodes = __esmMin((() => {
		init_javascriptApplicationGraph();
		init_managedApplicationGraphCoverage();
		init_managedInspectionEvidence();
		addArtifactNode = (state) => {
			const node = createJavaScriptApplicationNode({
				kind: "artifact",
				identity: {
					strategy: "content-digest",
					stability: "global-exact",
					sha256: state.artifactSha256
				},
				observations: [{
					label: basename(state.artifactPath),
					properties: {
						format: "pe",
						source: "managed-application-graph"
					},
					evidence: projectedManagedEvidence(state, "project-managed-artifact")
				}]
			});
			state.nodes.push(node);
			return node;
		};
		addArtifactIdentityNodes = (state, artifactNode, parsed) => {
			const artifactInput = parsed.artifact;
			if (artifactInput !== null && artifactInput.result.assembly !== null) {
				const assemblyFacts = artifactInput.result.assembly;
				const artifactEvidence = sourceManagedEvidence(state, artifactInput.evidence, artifactInput.result.coverage.state);
				const assembly = createJavaScriptApplicationNode({
					kind: "managed-assembly",
					identity: artifactLocalIdentity(state.artifactSha256, "managed-assembly", assemblyFacts.token),
					observations: [{
						label: assemblyFacts.name,
						properties: {
							name: assemblyFacts.name,
							version: assemblyFacts.version,
							culture: assemblyFacts.culture,
							public_key_kind: assemblyFacts.public_key.kind
						},
						evidence: artifactEvidence
					}]
				});
				state.nodes.push(assembly);
				addContainsEdge(state, artifactNode, assembly, {
					kind: "declares-managed-assembly",
					coverage: artifactEvidence.coverage
				});
			}
			const moduleSource = selectModuleSource(parsed);
			if (moduleSource !== null) {
				const { module } = moduleSource;
				const moduleEvidence = sourceManagedEvidence(state, moduleSource.evidence, moduleSource.coverageState);
				const moduleNode = createJavaScriptApplicationNode({
					kind: "managed-module",
					identity: artifactLocalIdentity(state.artifactSha256, "managed-module", module.mvid?.toLowerCase() ?? module.token),
					observations: [{
						label: module.name,
						properties: {
							name: module.name,
							mvid: module.mvid,
							generation: module.generation,
							token: module.token
						},
						evidence: moduleEvidence
					}]
				});
				state.nodes.push(moduleNode);
				addContainsEdge(state, artifactNode, moduleNode, {
					kind: "declares-managed-module",
					coverage: moduleEvidence.coverage
				});
			}
		};
		selectModuleSource = (parsed) => {
			const sources = [
				parsed.artifact?.result.module == null ? null : {
					module: parsed.artifact.result.module,
					evidence: parsed.artifact.evidence,
					coverageState: parsed.artifact.result.coverage.state
				},
				parsed.members?.result.module == null ? null : {
					module: parsed.members.result.module,
					evidence: parsed.members.evidence,
					coverageState: parsed.members.result.coverage.state
				},
				parsed.boundaries?.result.module == null ? null : {
					module: parsed.boundaries.result.module,
					evidence: parsed.boundaries.evidence,
					coverageState: parsed.boundaries.result.coverage.state
				}
			].filter((source) => source !== null);
			return sources.find(({ module }) => module.mvid !== null) ?? sources[0] ?? null;
		};
		addMemberNodes = (state, artifactNode, parsed) => {
			const memberInput = parsed.members;
			if (memberInput === null) return;
			const members = memberInput.result;
			const { types, methods, fields } = members;
			const typeCoverage = managedSourceCoverage(members.coverage.state);
			const methodCoverage = managedSourceCoverage(members.coverage.state);
			const fieldCoverage = managedSourceCoverage(members.coverage.state);
			const sourceEvidence = sourceManagedEvidence(state, memberInput.evidence, members.coverage.state);
			for (const type of types) {
				const node = typeNode(state, type, sourceEvidence);
				state.nodes.push(node);
				state.typeNodes.set(type.token, node);
				addContainsEdge(state, artifactNode, node, {
					kind: "declares-managed-type",
					coverage: typeCoverage
				});
			}
			for (const method of methods) {
				const node = methodNode(state, method, sourceEvidence);
				state.nodes.push(node);
				state.methodNodes.set(method.token, node);
				const owner = method.declaring_type_token === null ? artifactNode : state.typeNodes.get(method.declaring_type_token) ?? artifactNode;
				addContainsEdge(state, owner, node, {
					kind: "declares-managed-method",
					coverage: methodCoverage
				});
			}
			for (const field of fields) {
				const node = fieldNode(state, field, sourceEvidence);
				state.nodes.push(node);
				state.fieldNodes.set(field.token, node);
				const owner = field.declaring_type_token === null ? artifactNode : state.typeNodes.get(field.declaring_type_token) ?? artifactNode;
				addContainsEdge(state, owner, node, {
					kind: "declares-managed-field",
					coverage: fieldCoverage
				});
			}
		};
		typeNode = (state, type, evidence) => createJavaScriptApplicationNode({
			kind: "managed-type",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-type-token", type.token),
			observations: [{
				label: type.full_name,
				properties: {
					token: type.token,
					namespace: type.namespace,
					name: type.name,
					full_name: type.full_name,
					flags: type.flags,
					extends_token: type.extends_token
				},
				evidence
			}]
		});
		methodNode = (state, method, evidence) => createJavaScriptApplicationNode({
			kind: "managed-method",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-method-token", method.token),
			observations: [{
				label: method.declaring_type === null ? method.name : `${method.declaring_type}.${method.name}`,
				properties: {
					token: method.token,
					declaring_type_token: method.declaring_type_token,
					declaring_type: method.declaring_type,
					name: method.name,
					rva: method.rva,
					signature_sha256: method.signature.raw_sha256,
					signature_status: method.signature.parse_status,
					body_status: method.body.status,
					normalized_il_sha256: method.body.normalized_il_sha256,
					il_size: method.body.il_size
				},
				evidence
			}]
		});
		fieldNode = (state, field, evidence) => createJavaScriptApplicationNode({
			kind: "managed-field",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-field-token", field.token),
			observations: [{
				label: field.declaring_type === null ? field.name : `${field.declaring_type}.${field.name}`,
				properties: {
					token: field.token,
					declaring_type_token: field.declaring_type_token,
					declaring_type: field.declaring_type,
					name: field.name,
					flags: field.flags,
					signature_sha256: field.signature.raw_sha256,
					signature_status: field.signature.parse_status
				},
				evidence
			}]
		});
		addBoundaryNodes = (state, artifactNode, parsed) => {
			const boundaryInput = parsed.boundaries;
			if (boundaryInput === null) return;
			const boundaries = boundaryInput.result;
			const { pinvoke_imports: pinvokes, native_implementations: implementations } = boundaries;
			const pinvokeCoverage = managedSourceCoverage(boundaries.coverage.state);
			const implementationCoverage = managedSourceCoverage(boundaries.coverage.state);
			const sourceEvidence = sourceManagedEvidence(state, boundaryInput.evidence, boundaries.coverage.state);
			const canJoinMemberTokens = parsed.members !== null && managedTokenScopesMatch(parsed.members.result.identity_scope.requires_mvid, boundaries.identity_scope.requires_mvid);
			for (const pinvoke of pinvokes) {
				const node = pinvokeNode(state, pinvoke, sourceEvidence);
				state.nodes.push(node);
				const method = pinvoke.member_token === null || !canJoinMemberTokens ? undefined : state.methodNodes.get(pinvoke.member_token);
				const memberEvidence = method === undefined || parsed.members === null ? undefined : parsed.members.evidence;
				const owner = method ?? artifactNode;
				state.edges.push(createJavaScriptApplicationEdge({
					source_node_id: owner.node_id,
					target_node_id: node.node_id,
					relation: "imports",
					properties: {
						kind: "managed-pinvoke",
						import_name: pinvoke.import_name,
						import_scope_name: pinvoke.import_scope_name
					},
					evidence: pinvokeAssociationEvidence(state, boundaryInput.evidence, pinvokeCoverage, memberEvidence)
				}));
			}
			for (const implementation of implementations) {
				const node = nativeImplementationNode(state, implementation, sourceEvidence);
				state.nodes.push(node);
				const owner = (canJoinMemberTokens ? state.methodNodes.get(implementation.token) : undefined) ?? artifactNode;
				addContainsEdge(state, owner, node, {
					kind: "declares-managed-native-implementation",
					coverage: implementationCoverage
				});
			}
		};
		pinvokeNode = (state, pinvoke, evidence) => createJavaScriptApplicationNode({
			kind: "managed-pinvoke-import",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-pinvoke-token", pinvoke.token),
			observations: [{
				label: pinvoke.import_name,
				properties: {
					token: pinvoke.token,
					member_token: pinvoke.member_token,
					member_name: pinvoke.member_name,
					import_name: pinvoke.import_name,
					import_scope_name: pinvoke.import_scope_name,
					char_set: pinvoke.char_set,
					call_convention: pinvoke.call_convention,
					verification: pinvoke.verification
				},
				evidence
			}]
		});
		nativeImplementationNode = (state, implementation, evidence) => createJavaScriptApplicationNode({
			kind: "managed-native-implementation",
			identity: artifactLocalIdentity(state.artifactSha256, "managed-native-implementation-token", implementation.token),
			observations: [{
				label: implementation.name,
				properties: {
					token: implementation.token,
					name: implementation.name,
					rva: implementation.rva,
					code_type: implementation.code_type,
					managed_kind: implementation.managed_kind,
					pinvoke_declared: implementation.pinvoke_declared,
					boundary_kind: implementation.boundary_kind,
					body_interpretation: implementation.body_interpretation
				},
				evidence
			}]
		});
		addContainsEdge = (state, source, target, options) => {
			state.edges.push(createJavaScriptApplicationEdge({
				source_node_id: source.node_id,
				target_node_id: target.node_id,
				relation: "contains",
				properties: { kind: options.kind },
				evidence: projectedManagedEvidence(state, "project-managed-contains", options.coverage)
			}));
		};
		artifactLocalIdentity = (artifactSha256, namespace, key) => ({
			strategy: "artifact-local-key",
			stability: "artifact-version",
			artifact_sha256: artifactSha256,
			namespace,
			key
		});
		sourceManagedEvidence = (state, source, coverageState) => createManagedEvidence(state, source.operation, managedSourceCoverage(coverageState), [source.evidence_id]);
		projectedManagedEvidence = (state, operation, coverage = managedSourceCoverage("complete")) => createManagedEvidence(state, operation, coverage, state.evidenceLinks);
		pinvokeAssociationEvidence = (state, boundaryEvidence, coverage, memberEvidence) => createManagedEvidence(state, boundaryEvidence.operation, coverage, [boundaryEvidence.evidence_id, ...memberEvidence === undefined ? [] : [memberEvidence.evidence_id]]);
		createManagedEvidence = (state, operation, coverage, evidenceIds) => ({
			authority: "managed-static-analysis",
			state: "observed",
			confidence: "exact",
			artifact: {
				available: true,
				artifact_id: `art_${state.artifactSha256}`,
				sha256: state.artifactSha256
			},
			location: {
				available: true,
				value: {
					kind: "artifact-path",
					path: graphArtifactPath(state.artifactPath)
				}
			},
			extractor: {
				name: "rea-dotnet-static",
				version: "1",
				operation,
				executable_sha256: null
			},
			coverage,
			limitations: coverage.status === "complete" ? [] : ["The source managed Evidence slice is incomplete; unreturned or unavailable items remain unobserved."],
			evidence_ids: [...evidenceIds]
		});
		graphArtifactPath = (path) => {
			const name = basename(path).replaceAll(/[^A-Za-z0-9._-]/gu, "_");
			return `managed/${name.length === 0 ? "artifact.pe" : name}`;
		};
	})))();
}

//#endregion
//#region dist/domain/managed/managedApplicationGraph.js
var evidenceIdSchema, textSchema, projectManagedApplicationGraphInputSchema, managedApplicationGraphResultSchema, sha256, projectManagedApplicationGraph, countNodes, parseManagedInputs, chooseArtifact, assertSameArtifact, assertConsistentModuleIdentity, omittedCounts, projectionLimitations;
function init_managedApplicationGraph() {
	return (init_managedApplicationGraph = __esmMin((() => {
		init_evidence();
		init_javascriptApplicationGraph();
		init_managedArtifact();
		init_managedApplicationGraphCoverage();
		init_managedApplicationGraphNodes();
		init_digests();
		init_managedInspectionEvidence();
		evidenceIdSchema = prefixedDigestSchema("ev");
		textSchema = z.string().min(1);
		projectManagedApplicationGraphInputSchema = z.strictObject({
			managed_artifact: evidenceSchema.optional(),
			managed_members: evidenceSchema.optional(),
			managed_native_boundaries: evidenceSchema.optional()
		}).superRefine((input, context) => {
			if (input.managed_artifact === undefined && input.managed_members === undefined && input.managed_native_boundaries === undefined) context.addIssue({
				code: "custom",
				message: "At least one managed artifact, member, or native-boundary Evidence record is required"
			});
		});
		managedApplicationGraphResultSchema = z.strictObject({
			projection_id: prefixedDigestSchema("magp"),
			root_artifact_sha256: digestSchema,
			source_evidence: z.strictObject({
				managed_artifact_evidence_id: evidenceIdSchema.nullable(),
				managed_members_evidence_id: evidenceIdSchema.nullable(),
				managed_native_boundaries_evidence_id: evidenceIdSchema.nullable()
			}),
			summary: z.strictObject({
				graph_nodes: z.number().int().min(0),
				graph_edges: z.number().int().min(0),
				assemblies: z.number().int().min(0),
				modules: z.number().int().min(0),
				types: z.number().int().min(0),
				methods: z.number().int().min(0),
				fields: z.number().int().min(0),
				pinvoke_imports: z.number().int().min(0),
				native_implementations: z.number().int().min(0)
			}),
			graph: javascriptApplicationGraphSchema,
			coverage: z.strictObject({ status: z.enum(["complete-within-inputs", "partial"]) }),
			evidence_links: z.array(evidenceIdSchema).min(1).max(3),
			limitations: z.array(textSchema)
		});
		sha256 = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Managed application graph canonicalization failed");
			return createHash("sha256").update(serialized).digest("hex");
		};
		projectManagedApplicationGraph = (input) => {
			const parsed = parseManagedInputs(input);
			const artifactIdentity = chooseArtifact(parsed);
			assertSameArtifact(parsed, artifactIdentity.sha256);
			assertConsistentModuleIdentity(parsed);
			const evidenceLinks = [
				parsed.artifact?.evidence.evidence_id,
				parsed.members?.evidence.evidence_id,
				parsed.boundaries?.evidence.evidence_id
			].filter((id) => id !== undefined);
			const state = {
				nodes: [],
				edges: [],
				artifactSha256: artifactIdentity.sha256,
				artifactPath: artifactIdentity.path,
				evidenceLinks,
				typeNodes: new Map(),
				methodNodes: new Map(),
				fieldNodes: new Map()
			};
			const artifactNode = addArtifactNode(state);
			addArtifactIdentityNodes(state, artifactNode, parsed);
			addMemberNodes(state, artifactNode, parsed);
			addBoundaryNodes(state, artifactNode, parsed);
			const omissions = omittedCounts(parsed);
			const limitations = projectionLimitations(parsed, omissions);
			const graph = createJavaScriptApplicationGraph({
				schema: "JavaScriptApplicationGraph",
				root_node_ids: [artifactNode.node_id],
				nodes: state.nodes,
				edges: state.edges,
				coverage: managedGraphEvidenceCoverage(omissions),
				limitations
			});
			const withoutId = {
				root_artifact_sha256: state.artifactSha256,
				source_evidence: {
					managed_artifact_evidence_id: parsed.artifact?.evidence.evidence_id ?? null,
					managed_members_evidence_id: parsed.members?.evidence.evidence_id ?? null,
					managed_native_boundaries_evidence_id: parsed.boundaries?.evidence.evidence_id ?? null
				},
				summary: {
					graph_nodes: graph.nodes.length,
					graph_edges: graph.edges.length,
					assemblies: countNodes(graph.nodes, "managed-assembly"),
					modules: countNodes(graph.nodes, "managed-module"),
					types: countNodes(graph.nodes, "managed-type"),
					methods: countNodes(graph.nodes, "managed-method"),
					fields: countNodes(graph.nodes, "managed-field"),
					pinvoke_imports: countNodes(graph.nodes, "managed-pinvoke-import"),
					native_implementations: countNodes(graph.nodes, "managed-native-implementation")
				},
				graph,
				coverage: managedGraphResultCoverage(omissions),
				evidence_links: evidenceLinks,
				limitations
			};
			return managedApplicationGraphResultSchema.parse({
				...withoutId,
				projection_id: `magp_${sha256(withoutId)}`
			});
		};
		countNodes = (nodes, kind) => nodes.filter((node) => node.kind === kind).length;
		parseManagedInputs = (input) => ({
			artifact: input.managed_artifact === undefined ? null : parseManagedInspectionEvidence(input.managed_artifact, "inspect_managed_artifact", managedArtifactInspectionSchema),
			members: input.managed_members === undefined ? null : parseManagedInspectionEvidence(input.managed_members, "inspect_managed_members", managedMemberInspectionSchema),
			boundaries: input.managed_native_boundaries === undefined ? null : parseManagedInspectionEvidence(input.managed_native_boundaries, "inspect_managed_native_boundaries", managedNativeBoundaryInspectionSchema)
		});
		chooseArtifact = (parsed) => {
			const result = parsed.artifact?.result ?? parsed.members?.result ?? parsed.boundaries?.result;
			if (result === undefined) throw new TypeError("Managed graph projection requires managed Evidence");
			return {
				sha256: result.artifact.sha256,
				path: result.artifact.path
			};
		};
		assertSameArtifact = (parsed, sha256Value) => {
			for (const result of [
				parsed.artifact?.result,
				parsed.members?.result,
				parsed.boundaries?.result
			]) if (result !== undefined && result.artifact.sha256 !== sha256Value) throw new TypeError("Managed graph projection inputs must describe the same artifact SHA-256");
		};
		assertConsistentModuleIdentity = (parsed) => {
			const mvidClaims = [
				parsed.artifact?.result.module?.mvid,
				parsed.members?.result.module?.mvid,
				parsed.members?.result.identity_scope.requires_mvid,
				parsed.boundaries?.result.module?.mvid,
				parsed.boundaries?.result.identity_scope.requires_mvid
			].filter((mvid) => mvid !== undefined && mvid !== null).map((mvid) => mvid.toLowerCase());
			if (new Set(mvidClaims).size > 1) throw new TypeError("Managed graph inputs report conflicting known module MVIDs or token scopes");
			const modules = [
				parsed.artifact?.result.module,
				parsed.members?.result.module,
				parsed.boundaries?.result.module
			].filter((module) => module !== undefined && module !== null);
			for (const field of [
				"name",
				"generation",
				"token",
				"row_offset"
			]) {
				const values = new Set(modules.map((module) => module[field]));
				if (values.size > 1) throw new TypeError(`Managed graph inputs report conflicting module ${field} values`);
			}
			for (const field of ["enc_id", "enc_base_id"]) {
				const values = new Set(modules.map((module) => module[field]?.toLowerCase()).filter((value) => value !== undefined));
				if (values.size > 1) throw new TypeError(`Managed graph inputs report conflicting module ${field} values`);
			}
		};
		omittedCounts = (parsed) => assessManagedGraphOmissions({
			artifact: parsed.artifact?.result ?? null,
			members: parsed.members?.result ?? null,
			boundaries: parsed.boundaries?.result ?? null
		});
		projectionLimitations = (parsed, omissions) => [
			"Managed graph projection preserves static metadata observations only; it does not execute managed code, load assemblies, or map managed tokens to native addresses.",
			...parsed.members === null ? ["Managed member Evidence was not supplied; type, method, and field nodes are absent."] : [],
			...parsed.artifact === null ? ["Managed artifact Evidence was not supplied; assembly identity observations are absent."] : [],
			...parsed.boundaries === null ? ["Managed native-boundary Evidence was not supplied; P/Invoke and native-implementation nodes are absent."] : [],
			...omissions.partialInput ? ["At least one supplied managed Evidence record has partial coverage."] : [],
			...omissions.selectedTypes === null ? [] : [`Managed member Evidence selected only these declaring types: ${omissions.selectedTypes.join(", ")}; type, method, and field nodes of other types are omitted, not absent.`],
			...omissions.unscopedTokenRelationships ? ["Managed boundary tokens were not linked to member nodes because matching module MVID scope was not established."] : []
		];
	})))();
}

//#endregion
export { cliMetadataGuidSchema, init_managedApplicationGraph, init_managedArtifact, init_managedInspectionEvidence, managedApplicationGraphResultSchema, managedArtifactInspectionSchema, managedMemberInspectionSchema, managedNativeBoundaryInspectionSchema, parseManagedInspectionEvidence, projectManagedApplicationGraph, projectManagedApplicationGraphInputSchema };