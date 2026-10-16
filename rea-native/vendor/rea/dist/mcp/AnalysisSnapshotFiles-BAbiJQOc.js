import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { _ as ok, f as init_analysisErrorCore, g as init_result, h as err, i as AnalysisCancelledError, l as AnalysisResourceConstraintError, o as AnalysisInputError } from "./analysisErrorCore-DXRTvF_m.js";
import { E as init_configurationErrors, T as NoBinaryOpenError, c as EvidenceFileError, d as init_evidenceErrors, l as EvidenceIntegrityError, s as AnalysisSnapshotMismatchError } from "./analysisErrorProjection-BN0EPM-3.js";
import { Jt as committedProviderSchema, Kt as analysisProfileSchema, Qt as init_binaryTargetTypes, Xt as init_analysisProfile, Zt as BINARY_ARCHITECTURES, gt as init_canonicalJsonDigestSteps, ht as canonicalJsonDigestSteps, lt as init_evidence, mt as rebindEvidenceToTargetPath, ot as evidenceLocationSchema, pt as rebindEvidenceSubjectTargetPath, qt as analysisProfilesEqual, rn as relationshipCoverageSchema, tn as init_relationshipCoverage } from "./nativeValueTrace-DR9UE62L.js";
import { r as localPathStringSchema, t as init_localPath } from "./localPath-AxvW9aPe.js";
import { n as safeParseJson, t as init_safeJson } from "./safeJson-NeGfpkrI.js";
import { c as jsonValueSchema, d as freezeJsonSnapshot, i as prefixedDigestSchema, n as init_digests, o as init_jsonValue, p as init_immutableJson, s as jsonObjectSchema, t as digestSchema } from "./digests-BFoWUT_-.js";
import { n as compositeKey, r as init_unicodeCodePointOrder, t as compareUnicodeCodePoints } from "./unicodeCodePointOrder-BezCbTpg.js";
import { c as NonRegularFileReadError, d as init_RegularFile, h as init_OwnedFileHandle, m as OwnedFileHandle, u as RegularFileChangedError } from "./propertyListKeys-DD25WsjI.js";
import { Ca as rawBinaryEntryPointSchema, Jt as evidenceBundleSchema, Sa as init_rawBinary, Xt as parseEvidenceBundle, Yt as init_evidenceBundle, Zt as parseImmutableEvidenceBundle, qt as evidenceBundleForTarget, xa as binaryArchitectureSchema } from "./toolOutputSchemaGroups-ColvNZ1r.js";
import { n as init_officialToolContracts, t as OFFICIAL_TOOL_CONTRACTS } from "./officialToolContracts-B67NJ2tC.js";
import { a as init_RegularFileRead, c as withRegularFile, i as RegularFileCleanupFailure } from "./BinaryTargetResolver-BMaE_0H1.js";
import { r as init_ArtifactReader, t as ArtifactReaderFailure } from "./ArtifactReader-OyM03Gjn.js";
import { basename, dirname, resolve } from "node:path";
import { z } from "zod";
import { createHash } from "node:crypto";
import { link, lstat, mkdtemp, open, readdir, realpath, rename, rmdir, unlink } from "node:fs/promises";
import canonicalize from "canonicalize";
import { pipeline } from "node:stream/promises";
import { constants } from "node:buffer";
import { setImmediate } from "node:timers/promises";
import { getHeapStatistics } from "node:v8";
import { asStream, none } from "stream-chain";
import fun from "stream-chain/fun.js";
import parser from "stream-json/parser.js";
import streamValues from "stream-json/streamers/stream-values.js";
import streamArray from "stream-json/streamers/stream-array.js";

//#region dist/domain/analysisSnapshot.js
var architectureSchema, formatSchema, kindSchema, subjectBaseSchema, subjectFormatSchema, subjectSchema, targetIdentitySchema, targetSchema, bindingSchema, entrySchema, workflowEntrySchema, analysisSnapshotSchema, preparedEntryBrand, preparedEntries, prepareSnapshotEntry, snapshotFileHeaderSchema, parsePreparedAnalysisSnapshot, contentDigest, snapshotContentDigest, evidenceContentDigest, canonicalJson, snapshotTarget, snapshotBinding, snapshotMatchesTarget, snapshotMatchesProfile, snapshotMatchesBinding, snapshotEvidenceForQuery, createAnalysisSnapshotWorkflowEntry, evidenceMatchesEntry, analysisQueryId, createAnalysisSnapshotEntry, validatedSnapshots, parseAnalysisSnapshot, immutableAnalysisSnapshot, sealSnapshot, restoreSnapshot, hasCanonicalQueryOrder, isCorrespondingEvidence, evidenceQueryKey, entryQueryKey, entryEvidenceKey, workflowEntryQueryKey, workflowEntryEvidenceKey, isWorkflowEvidence, evidenceMatchesWorkflowEntry, evidenceContentMetadata, serializeAnalysisSnapshot;
function init_analysisSnapshot() {
	return (init_analysisSnapshot = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_localPath();
		init_analysisProfile();
		init_binaryTargetTypes();
		init_evidenceBundle();
		init_evidence();
		init_jsonValue();
		init_digests();
		init_canonicalJsonDigestSteps();
		init_immutableJson();
		init_rawBinary();
		init_relationshipCoverage();
		architectureSchema = z.enum(BINARY_ARCHITECTURES);
		formatSchema = z.enum([
			"analysis-database",
			"mach-o",
			"mach-o-universal",
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
			"source-map"
		]);
		kindSchema = z.enum([
			"executable",
			"database",
			"archive",
			"artifact"
		]);
		subjectBaseSchema = z.object({
			path: localPathStringSchema,
			sha256: digestSchema
		});
		subjectFormatSchema = z.enum([
			...formatSchema.options,
			"hopper",
			"directory",
			"file",
			"unknown",
			"javascript-bundle",
			"entitlements"
		]);
		subjectSchema = z.discriminatedUnion("format", [subjectBaseSchema.extend({
			format: subjectFormatSchema.exclude(["raw-binary"]),
			architecture: architectureSchema.exclude(["6502"]).nullable()
		}), subjectBaseSchema.extend({
			format: z.literal("raw-binary"),
			architecture: architectureSchema.nullable()
		})]);
		targetIdentitySchema = z.object({
			sha256: digestSchema,
			kind: kindSchema,
			architecture: architectureSchema.nullable()
		});
		targetSchema = z.discriminatedUnion("format", [targetIdentitySchema.extend({
			format: z.enum(formatSchema.options.filter((format) => format !== "raw-binary")),
			architecture: architectureSchema.exclude(["6502"]).nullable()
		}), targetIdentitySchema.extend({
			format: z.literal("raw-binary"),
			kind: z.literal("executable"),
			architecture: binaryArchitectureSchema,
			entry_point: rawBinaryEntryPointSchema
		})]);
		bindingSchema = z.object({
			provider: committedProviderSchema,
			analysis_profile: analysisProfileSchema
		}).superRefine((binding, context) => {
			if (binding.provider.id !== binding.analysis_profile.provider.id || binding.provider.name !== binding.analysis_profile.provider.name || binding.provider.version !== binding.analysis_profile.provider.version) context.addIssue({
				code: "custom",
				path: ["provider"],
				message: "Snapshot binding provider does not match analysis profile"
			});
		});
		entrySchema = z.object({
			query_id: prefixedDigestSchema("query"),
			operation: z.string().min(1),
			parameters: jsonObjectSchema,
			execution: z.object({
				result: jsonValueSchema,
				raw_result: jsonValueSchema.nullable(),
				provider: committedProviderSchema,
				limitations: z.array(z.string()),
				relationship_coverage: relationshipCoverageSchema.nullable().default(null),
				locations: z.array(evidenceLocationSchema),
				subject: subjectSchema.nullable()
			})
		});
		workflowEntrySchema = z.object({
			query_id: prefixedDigestSchema("query"),
			operation: z.string().min(1),
			parameters: jsonObjectSchema,
			execution: z.object({
				result: jsonValueSchema,
				raw_result: jsonValueSchema.nullable(),
				provider: committedProviderSchema,
				analysis_profile: analysisProfileSchema,
				limitations: z.array(z.string()),
				relationship_coverage: relationshipCoverageSchema.nullable().default(null),
				locations: z.array(evidenceLocationSchema),
				subject: subjectSchema.nullable()
			})
		});
		analysisSnapshotSchema = z.object({
			target: targetSchema,
			binding: bindingSchema,
			entries: z.array(entrySchema),
			workflow_entries: z.array(workflowEntrySchema),
			evidence_bundle: evidenceBundleSchema
		});
		preparedEntryBrand = Symbol("prepared-snapshot-entry");
		preparedEntries = new WeakMap();
		prepareSnapshotEntry = (input, kind) => {
			const handle = Object.freeze({ [preparedEntryBrand]: true });
			if (kind === "provider") {
				const entry = entrySchema.parse(input);
				const { result, raw_result, ...execution } = entry.execution;
				preparedEntries.set(handle, {
					kind,
					entry: {
						...entry,
						execution
					},
					digest: snapshotContentDigest(result, raw_result, execution)
				});
			} else {
				const entry = workflowEntrySchema.parse(input);
				const { result, raw_result, ...execution } = entry.execution;
				preparedEntries.set(handle, {
					kind,
					entry: {
						...entry,
						execution
					},
					digest: snapshotContentDigest(result, raw_result, execution)
				});
			}
			return handle;
		};
		snapshotFileHeaderSchema = z.object({
			target: targetSchema,
			binding: bindingSchema,
			evidence_bundle: z.unknown()
		});
		parsePreparedAnalysisSnapshot = (input, entries, workflowEntries) => {
			const header = snapshotFileHeaderSchema.parse(input);
			const bundle = parseImmutableEvidenceBundle(header.evidence_bundle);
			const providerRows = entries.map((handle) => {
				const row = preparedEntries.get(handle);
				if (row?.kind !== "provider") throw new TypeError("Analysis snapshot entry was not parsed in this realm");
				return row;
			});
			const workflowRows = workflowEntries.map((handle) => {
				const row = preparedEntries.get(handle);
				if (row?.kind !== "workflow") throw new TypeError("Analysis snapshot workflow entry was not parsed in this realm");
				return row;
			});
			const restored = sealSnapshot(restoreSnapshot(header, bundle, providerRows, workflowRows));
			for (const handle of [...entries, ...workflowEntries]) preparedEntries.delete(handle);
			return restored;
		};
		contentDigest = (value) => {
			const steps = canonicalJsonDigestSteps(value);
			let step = steps.next();
			while (!step.done) step = steps.next();
			return step.value;
		};
		snapshotContentDigest = (result, rawResult, execution) => {
			const metadata = jsonObjectSchema.parse({
				limitations: execution.limitations,
				locations: execution.locations,
				subject: execution.subject === null ? null : {
					local_path: execution.subject.path,
					sha256: execution.subject.sha256,
					format: execution.subject.format,
					architecture: execution.subject.architecture
				},
				...execution.relationship_coverage === null ? {} : { relationship_coverage: execution.relationship_coverage }
			});
			return contentDigest({
				...metadata,
				normalized_result: result,
				raw_result: rawResult
			});
		};
		evidenceContentDigest = (evidence) => {
			return contentDigest({
				...jsonObjectSchema.parse(evidenceContentMetadata(evidence)),
				normalized_result: evidence.normalized_result,
				raw_result: evidence.raw_result
			});
		};
		canonicalJson = (value) => {
			const json = jsonValueSchema.parse(value);
			const encoded = canonicalize(json);
			if (encoded === undefined) throw new TypeError("RFC 8785 canonicalization rejected snapshot data");
			return encoded;
		};
		snapshotTarget = (target) => target.format === "raw-binary" ? {
			sha256: target.sha256,
			kind: target.kind,
			architecture: target.architecture,
			format: target.format,
			entry_point: target.entryPoint
		} : {
			sha256: target.sha256,
			kind: target.kind,
			architecture: target.architecture ?? null,
			format: target.format
		};
		snapshotBinding = (profile) => bindingSchema.parse({
			provider: profile.provider,
			analysis_profile: profile
		});
		snapshotMatchesTarget = (snapshot, target) => snapshot.sha256 === target.sha256 && snapshot.kind === target.kind && snapshot.format === target.format && snapshot.architecture === (target.architecture ?? null) && (snapshot.format !== "raw-binary" || target.format === "raw-binary" && snapshot.entry_point === target.entryPoint);
		snapshotMatchesProfile = (binding, profile) => binding.provider.id === profile.provider.id && binding.provider.name === profile.provider.name && binding.provider.version === profile.provider.version && analysisProfilesEqual(binding.analysis_profile, profile);
		snapshotMatchesBinding = (snapshot, target, profile) => snapshotMatchesTarget(snapshot.target, target) && snapshotMatchesProfile(snapshot.binding, profile);
		snapshotEvidenceForQuery = (snapshot, query) => {
			const { target, bindingProfile, operation, parameters, provider, evidenceProfile } = query;
			if (!snapshotMatchesBinding(snapshot, target, bindingProfile)) return undefined;
			const encodedParameters = canonicalJson(parameters);
			const queryId = analysisQueryId(snapshot.target, snapshot.binding, operation, parameters);
			const entry = snapshot.entries.find((candidate) => candidate.query_id === queryId);
			const workflowEntry = snapshot.workflow_entries.find((candidate) => candidate.query_id === queryId);
			if (entry === undefined && workflowEntry === undefined) return undefined;
			const evidence = snapshot.evidence_bundle.records.find((record) => record.subject?.digest.sha256 === target.sha256 && record.operation === operation && record.provider.id === provider.id && record.provider.name === provider.name && record.provider.version === provider.version && record.analysis_profile !== null && analysisProfilesEqual(record.analysis_profile, evidenceProfile) && canonicalJson(record.parameters) === encodedParameters && (entry !== undefined && evidenceMatchesEntry(record, entry, snapshot) || workflowEntry !== undefined && evidenceMatchesWorkflowEntry(record, workflowEntry, snapshot)));
			return evidence === undefined ? undefined : rebindEvidenceToTargetPath(evidence, target);
		};
		createAnalysisSnapshotWorkflowEntry = (input) => {
			const { target, binding, operation, parameters, execution } = input;
			if (execution.provider.id !== execution.analysisProfile.provider.id || execution.provider.name !== execution.analysisProfile.provider.name || execution.provider.version !== execution.analysisProfile.provider.version) throw new TypeError("Workflow snapshot execution provider does not match its profile");
			return {
				query_id: analysisQueryId(target, binding, operation, parameters),
				operation,
				parameters: jsonObjectSchema.parse(parameters),
				execution: {
					result: execution.result,
					raw_result: execution.rawResult,
					provider: execution.analysisProfile.provider,
					analysis_profile: execution.analysisProfile,
					limitations: [...execution.limitations],
					relationship_coverage: execution.relationshipCoverage ?? null,
					locations: [...execution.locations],
					subject: execution.subject === null ? null : subjectSchema.parse({
						...execution.subject,
						architecture: execution.subject.architecture ?? null
					})
				}
			};
		};
		evidenceMatchesEntry = (evidence, entry, snapshot) => isCorrespondingEvidence(evidence, snapshot) && compositeKey([evidenceQueryKey(evidence), evidenceContentDigest(evidence)]) === entryEvidenceKey(entry, snapshot.binding);
		analysisQueryId = (target, binding, operation, parameters) => `query_${createHash("sha256").update(canonicalJson({
			target,
			binding,
			operation,
			parameters
		})).digest("hex")}`;
		createAnalysisSnapshotEntry = (input) => {
			const { target, binding, operation, parameters, execution } = input;
			if (execution.analysisProfile === undefined || !snapshotMatchesProfile(binding, execution.analysisProfile) || execution.provider.id !== binding.provider.id || execution.provider.name !== binding.provider.name || execution.provider.version !== binding.provider.version) throw new TypeError("Snapshot execution does not match its provider/profile binding");
			return {
				query_id: analysisQueryId(target, binding, operation, parameters),
				operation,
				parameters: jsonObjectSchema.parse(parameters),
				execution: {
					result: execution.result,
					raw_result: execution.rawResult,
					provider: binding.provider,
					limitations: [...execution.limitations],
					relationship_coverage: execution.relationshipCoverage ?? null,
					locations: [...execution.locations],
					subject: execution.subject === null ? null : subjectSchema.parse({
						...execution.subject,
						architecture: execution.subject.architecture ?? null
					})
				}
			};
		};
		validatedSnapshots = new WeakMap();
		parseAnalysisSnapshot = (input) => {
			if (typeof input === "object" && input !== null) {
				const owned = validatedSnapshots.get(input);
				if (owned !== undefined) return owned;
			}
			const parsed = analysisSnapshotSchema.parse(input);
			restoreSnapshot(parsed, parseEvidenceBundle(parsed.evidence_bundle), parsed.entries.map((entry) => ({
				kind: "provider",
				entry,
				digest: snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)
			})), parsed.workflow_entries.map((entry) => ({
				kind: "workflow",
				entry,
				digest: snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)
			})));
			return parsed;
		};
		immutableAnalysisSnapshot = (input) => sealSnapshot(parseAnalysisSnapshot(input));
		sealSnapshot = (snapshot) => {
			for (const entry of [...snapshot.entries, ...snapshot.workflow_entries]) {
				freezeJsonSnapshot(entry.execution.result);
				freezeJsonSnapshot(entry.execution.raw_result);
			}
			freezeJsonSnapshot(snapshot);
			validatedSnapshots.set(snapshot, snapshot);
			return snapshot;
		};
		restoreSnapshot = (header, bundle, providerRows, workflowRows) => {
			const scopedEvidence = evidenceBundleForTarget(bundle, header.target.sha256);
			if (scopedEvidence.records.length !== bundle.records.length || scopedEvidence.unknowns.length !== bundle.unknowns.length) throw new TypeError("Analysis snapshot evidence contains records for another target");
			if (!hasCanonicalQueryOrder(providerRows.map(({ entry }) => entry))) throw new TypeError("Analysis snapshot entries are not canonical");
			if (!hasCanonicalQueryOrder(workflowRows.map(({ entry }) => entry))) throw new TypeError("Analysis snapshot workflow entries are not canonical");
			const ids = new Set();
			const corresponding = new Set();
			const matching = new Map();
			for (const evidence of bundle.records) {
				if (evidence.predicate_type !== "rea.analysis" || evidence.authority !== "shipped-artifact" || evidence.subject?.digest.sha256 !== header.target.sha256 || evidence.analysis_profile === null || evidence.confidence !== "observed" && evidence.confidence !== "derived") continue;
				if (evidence.confidence === "observed" && !isCorrespondingEvidence(evidence, header)) continue;
				const query = compositeKey([evidence.confidence, evidenceQueryKey(evidence)]);
				corresponding.add(query);
				matching.set(compositeKey([query, evidenceContentDigest(evidence)]), evidence);
			}
			const find = (query, digest, label, operation) => {
				const evidence = matching.get(compositeKey([query, digest]));
				if (evidence !== undefined) return evidence;
				throw new TypeError(corresponding.has(query) ? `Analysis snapshot ${label} ${operation} differs from its Evidence record` : `Analysis snapshot ${label} ${operation} has no profile-bound Evidence record`);
			};
			const checkId = (entry, workflow) => {
				const expected = analysisQueryId(header.target, header.binding, entry.operation, entry.parameters);
				if (entry.query_id !== expected) throw new TypeError(workflow ? "Analysis snapshot workflow query identifier does not match" : "Analysis snapshot query identifier does not match");
				if (ids.has(entry.query_id)) throw new TypeError("Analysis snapshot contains duplicate queries");
				ids.add(entry.query_id);
			};
			const entries = providerRows.map(({ entry, digest }) => {
				if (entry.execution.provider.id !== header.binding.provider.id || entry.execution.provider.name !== header.binding.provider.name || entry.execution.provider.version !== header.binding.provider.version) throw new TypeError("Analysis snapshot entry provider does not match");
				checkId(entry, false);
				const evidence = find(compositeKey(["observed", entryQueryKey(entry, header.binding)]), digest, "entry", entry.operation);
				return {
					...entry,
					execution: {
						...entry.execution,
						result: evidence.normalized_result,
						raw_result: evidence.raw_result
					}
				};
			});
			const workflow_entries = workflowRows.map(({ entry, digest }) => {
				const provider = entry.execution.analysis_profile.provider;
				if (entry.execution.provider.id !== provider.id || entry.execution.provider.name !== provider.name || entry.execution.provider.version !== provider.version) throw new TypeError("Analysis snapshot workflow entry provider does not match its profile");
				checkId(entry, true);
				const evidence = find(compositeKey(["derived", workflowEntryQueryKey(entry)]), digest, "workflow entry", entry.operation);
				return {
					...entry,
					execution: {
						...entry.execution,
						result: evidence.normalized_result,
						raw_result: evidence.raw_result
					}
				};
			});
			return {
				target: header.target,
				binding: header.binding,
				entries,
				workflow_entries,
				evidence_bundle: bundle
			};
		};
		hasCanonicalQueryOrder = (entries) => {
			let previous;
			for (const { query_id: queryId } of entries) {
				if (previous !== undefined && compareUnicodeCodePoints(previous, queryId) > 0) return false;
				previous = queryId;
			}
			return true;
		};
		isCorrespondingEvidence = (evidence, snapshot) => evidence.predicate_type === "rea.analysis" && evidence.confidence === "observed" && evidence.authority === "shipped-artifact" && evidence.subject?.digest.sha256 === snapshot.target.sha256 && evidence.analysis_profile !== null && analysisProfilesEqual(evidence.analysis_profile, snapshot.binding.analysis_profile);
		evidenceQueryKey = (evidence) => contentDigest({
			operation: evidence.operation,
			parameters: evidence.parameters,
			provider: evidence.provider,
			analysis_profile: evidence.analysis_profile
		});
		entryQueryKey = (entry, binding) => contentDigest({
			operation: entry.operation,
			parameters: entry.parameters,
			provider: entry.execution.provider,
			analysis_profile: binding.analysis_profile
		});
		entryEvidenceKey = (entry, binding) => compositeKey([entryQueryKey(entry, binding), snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)]);
		workflowEntryQueryKey = (entry) => contentDigest({
			operation: entry.operation,
			parameters: entry.parameters,
			provider: entry.execution.provider,
			analysis_profile: entry.execution.analysis_profile
		});
		workflowEntryEvidenceKey = (entry) => compositeKey([workflowEntryQueryKey(entry), snapshotContentDigest(entry.execution.result, entry.execution.raw_result, entry.execution)]);
		isWorkflowEvidence = (evidence, snapshot, entry) => evidence.predicate_type === "rea.analysis" && evidence.confidence === "derived" && evidence.authority === "shipped-artifact" && evidence.subject?.digest.sha256 === snapshot.target.sha256 && evidence.analysis_profile !== null && analysisProfilesEqual(evidence.analysis_profile, entry.execution.analysis_profile) && evidence.provider.id === entry.execution.provider.id && evidence.provider.name === entry.execution.provider.name && evidence.provider.version === entry.execution.provider.version;
		evidenceMatchesWorkflowEntry = (evidence, entry, snapshot) => isWorkflowEvidence(evidence, snapshot, entry) && compositeKey([evidenceQueryKey(evidence), evidenceContentDigest(evidence)]) === workflowEntryEvidenceKey(entry);
		evidenceContentMetadata = (evidence) => {
			return {
				limitations: evidence.limitations,
				...evidence.relationship_coverage === null ? {} : { relationship_coverage: evidence.relationship_coverage },
				locations: evidence.locations,
				subject: evidence.subject === null ? null : {
					local_path: evidence.subject.local_path,
					sha256: evidence.subject.digest.sha256,
					format: evidence.subject.format,
					architecture: evidence.subject.architecture
				}
			};
		};
		serializeAnalysisSnapshot = (snapshot) => `${canonicalJson(parseAnalysisSnapshot(snapshot))}\n`;
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisSnapshotCache.js
var RELATIONSHIP_OPERATIONS, STATEFUL_OPERATIONS, CURSOR_DEFAULT_OPERATIONS, DOCUMENT_SCOPED_OPERATIONS, SNAPSHOT_CACHE_ENTRY_CEILING, isSnapshotCacheable, requiresNativeSourceAdmissionBeforeReplay, AnalysisSnapshotCache;
function init_AnalysisSnapshotCache() {
	return (init_AnalysisSnapshotCache = __esmMin((() => {
		init_evidenceErrors();
		init_configurationErrors();
		init_evidence();
		init_result();
		init_analysisSnapshot();
		init_officialToolContracts();
		init_unicodeCodePointOrder();
		RELATIONSHIP_OPERATIONS = new Set(["procedure_callers", "procedure_callees"]);
		STATEFUL_OPERATIONS = new Set([
			"health",
			"current_address",
			"current_procedure",
			"current_document",
			"goto_address",
			"list_documents"
		]);
		CURSOR_DEFAULT_OPERATIONS = new Set([
			"address_name",
			"comment",
			"inline_comment",
			"next_address",
			"prev_address",
			"xrefs"
		]);
		DOCUMENT_SCOPED_OPERATIONS = new Set(OFFICIAL_TOOL_CONTRACTS.map(({ name }) => name).filter((name) => name !== "current_document" && name !== "list_documents"));
		SNAPSHOT_CACHE_ENTRY_CEILING = 1e4;
		isSnapshotCacheable = (operation, descriptor, parameters) => !STATEFUL_OPERATIONS.has(operation) && (!DOCUMENT_SCOPED_OPERATIONS.has(operation) || typeof parameters.document === "string") && (!CURSOR_DEFAULT_OPERATIONS.has(operation) || typeof parameters.address === "string") && descriptor?.effects.mutatesArtifact === false && descriptor.cachePolicy !== "live" && (descriptor.cachePolicy === "snapshot" || descriptor.effects.mayWriteFilesystem === false) && descriptor.effects.changesPermissions === false;
		requiresNativeSourceAdmissionBeforeReplay = (providerId) => process.platform === "win32" && providerId === "ghidra";
		AnalysisSnapshotCache = class {
			#entries = new Map();
			#workflowEntries = new Map();
			#target;
			#binding;
			/** Whether staged entries belong to the supplied target and profile. */
			matches(target, profile) {
				return this.#target === undefined && this.#binding === undefined || this.#target !== undefined && this.#binding !== undefined && profile !== undefined && snapshotMatchesTarget(this.#target, target) && snapshotMatchesProfile(this.#binding, profile);
			}
			/** Replace cache state when the target or selected profile changes. */
			select(target, profile) {
				if (!this.matches(target, profile)) this.#clearEntries();
				this.#target = snapshotTarget(target);
				this.#binding = snapshotBinding(profile);
			}
			/** Merge already-validated entries and return the new-entry count. */
			stage(snapshot) {
				snapshot = immutableAnalysisSnapshot(snapshot);
				if (this.#target !== undefined && JSON.stringify(this.#target) !== JSON.stringify(snapshot.target) || this.#binding !== undefined && !snapshotMatchesProfile(this.#binding, snapshot.binding.analysis_profile)) this.#clearEntries();
				this.#target = structuredClone(snapshot.target);
				this.#binding = structuredClone(snapshot.binding);
				let imported = 0;
				for (const entry of snapshot.entries) {
					if (!this.#entries.has(entry.query_id) && !this.#hasCapacity()) continue;
					if (!this.#entries.has(entry.query_id)) imported += 1;
					this.#entries.set(entry.query_id, entry);
				}
				for (const entry of snapshot.workflow_entries) {
					if (!this.#workflowEntries.has(entry.query_id) && !this.#hasCapacity()) continue;
					this.#workflowEntries.set(entry.query_id, entry);
				}
				return imported;
			}
			/** Build a complete snapshot for an active target. */
			export(target, profile, evidenceBundle) {
				if (target === undefined || profile === undefined) return err(new NoBinaryOpenError());
				try {
					const snapshotTargetIdentity = snapshotTarget(target);
					const binding = snapshotBinding(profile);
					const entries = [...this.#entries.values()].sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id));
					const workflows = [...this.#workflowEntries.values()].sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id));
					return ok(parseAnalysisSnapshot({
						target: snapshotTargetIdentity,
						binding,
						entries,
						workflow_entries: workflows,
						evidence_bundle: evidenceBundle
					}));
				} catch (cause) {
					return err(new EvidenceIntegrityError("Analysis snapshot validation failed", { cause }));
				}
			}
			/** Validate target identity, merge evidence atomically, then stage entries. */
			import(snapshot, active, mergeEvidence) {
				let validated;
				try {
					validated = immutableAnalysisSnapshot(snapshot);
				} catch (cause) {
					return err(new EvidenceIntegrityError("Analysis snapshot validation failed", { cause }));
				}
				if (active !== undefined && (!snapshotMatchesTarget(validated.target, active.target) || !snapshotMatchesProfile(validated.binding, active.profile))) return err(new AnalysisSnapshotMismatchError("Analysis snapshot profile_mismatch: target, provider, or analysis profile does not match the active binary"));
				const importedEvidence = mergeEvidence(validated.evidence_bundle);
				return importedEvidence.ok ? ok(this.stage(validated)) : importedEvidence;
			}
			/** Return canonical entries for persistence. */
			entries() {
				return [...this.#entries.values()].sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id)).map((entry) => structuredClone(entry));
			}
			/** Return canonical composed-workflow entries for persistence. */
			workflowEntries() {
				return [...this.#workflowEntries.values()].sort((left, right) => compareUnicodeCodePoints(left.query_id, right.query_id)).map((entry) => structuredClone(entry));
			}
			/** Record one exact derived workflow result unless the shared cache is full. */
			recordWorkflow(input) {
				this.select(input.target, input.profile);
				const queryId = analysisQueryId(snapshotTarget(input.target), snapshotBinding(input.profile), input.operation, input.parameters);
				if (!this.#workflowEntries.has(queryId) && !this.#hasCapacity()) return;
				const entry = createAnalysisSnapshotWorkflowEntry({
					target: snapshotTarget(input.target),
					binding: snapshotBinding(input.profile),
					operation: input.operation,
					parameters: input.parameters,
					execution: input.execution
				});
				this.#workflowEntries.set(entry.query_id, entry);
			}
			/** Replay an exact provider-specific query, marking its cached provenance. */
			lookup(target, profile, operation, parameters) {
				const queryId = analysisQueryId(snapshotTarget(target), snapshotBinding(profile), operation, parameters);
				const cached = this.#entries.get(queryId);
				if (cached === undefined) return undefined;
				const cachedSubject = cached.execution.subject;
				const subject = cachedSubject === null ? null : rebindEvidenceSubjectTargetPath({
					path: cachedSubject.path,
					sha256: cachedSubject.sha256,
					format: cachedSubject.format,
					...cachedSubject.architecture === null ? {} : { architecture: cachedSubject.architecture }
				}, target);
				return structuredClone({
					result: cached.execution.result,
					rawResult: cached.execution.raw_result,
					provider: cached.execution.provider,
					analysisProfile: structuredClone(profile),
					limitations: [...cached.execution.limitations, "Loaded from a local REA analysis snapshot; this call did not re-run the provider."],
					...cached.execution.relationship_coverage === null && RELATIONSHIP_OPERATIONS.has(operation) ? { relationshipCoverage: {
						status: "unknown",
						reason: "Snapshot entry does not report relationship coverage."
					} } : cached.execution.relationship_coverage === null ? {} : { relationshipCoverage: cached.execution.relationship_coverage },
					locations: cached.execution.locations,
					subject
				});
			}
			/** Record one successful immutable call unless the cache is full. */
			record(input) {
				const { target, profile, operation, parameters, execution } = input;
				this.select(target, profile);
				if (execution.referencesTruncated === true) return;
				const queryId = analysisQueryId(snapshotTarget(target), snapshotBinding(profile), operation, parameters);
				if (!this.#entries.has(queryId) && !this.#hasCapacity()) return;
				const entry = createAnalysisSnapshotEntry({
					target: snapshotTarget(target),
					binding: snapshotBinding(profile),
					operation,
					parameters,
					execution
				});
				this.#entries.set(entry.query_id, entry);
			}
			/** Forget all target-bound entries. */
			clear() {
				this.#clearEntries();
				this.#target = undefined;
				this.#binding = undefined;
			}
			#clearEntries() {
				this.#entries.clear();
				this.#workflowEntries.clear();
			}
			#hasCapacity() {
				return this.#entries.size + this.#workflowEntries.size < SNAPSHOT_CACHE_ENTRY_CEILING;
			}
		};
	})))();
}

//#endregion
//#region dist/application/Utf8JsonInput.js
var JSON_INPUT_RESOURCE_REMEDIATION, JSON_BYTE_ORDER_MARK_MESSAGE, parseUtf8Json;
function init_Utf8JsonInput() {
	return (init_Utf8JsonInput = __esmMin((() => {
		init_analysisErrorCore();
		init_safeJson();
		JSON_INPUT_RESOURCE_REMEDIATION = "Provide a smaller valid JSON value. For Evidence workflows, re-analyze a smaller selection of the original target and use its complete Evidence; splitting JSON text or trimming Evidence fields does not produce valid workflow input.";
		JSON_BYTE_ORDER_MARK_MESSAGE = "JSON input begins with a UTF-8 byte-order mark (EF BB BF), which strict JSON input does not accept. Save the file as UTF-8 without a byte-order mark.";
		parseUtf8Json = (bytes, operation, path, boundary = "json-input") => {
			const stringLimitFailure = (cause, decodedUnits) => new AnalysisResourceConstraintError(operation, "memory", "JSON input exceeds the runtime's maximum decoded string length", {
				boundary,
				input_path: path,
				input_bytes: bytes.byteLength,
				max_string_code_units: constants.MAX_STRING_LENGTH,
				...decodedUnits === undefined ? {} : { decoded_string_code_units_at_least: decodedUnits }
			}, {
				...cause === undefined ? {} : { cause },
				remediationAction: JSON_INPUT_RESOURCE_REMEDIATION
			});
			let text;
			try {
				const decoder = new TextDecoder("utf-8", {
					fatal: true,
					ignoreBOM: true
				});
				if (bytes.byteLength <= constants.MAX_STRING_LENGTH) {
					text = decoder.decode(bytes);
				} else {
					const parts = [];
					let decodedUnits = 0;
					const append = (part) => {
						decodedUnits += part.length;
						if (decodedUnits > constants.MAX_STRING_LENGTH) throw stringLimitFailure(undefined, decodedUnits);
						parts.push(part);
					};
					const chunkBytes = 1024 * 1024;
					for (let offset = 0; offset < bytes.byteLength; offset += chunkBytes) append(decoder.decode(bytes.subarray(offset, offset + chunkBytes), { stream: true }));
					append(decoder.decode());
					text = parts.join("");
				}
			} catch (cause) {
				if (cause instanceof AnalysisResourceConstraintError) throw cause;
				const code = typeof cause === "object" && cause !== null && "code" in cause ? cause.code : undefined;
				if (code === "ERR_STRING_TOO_LONG") throw stringLimitFailure(cause);
				if (code !== "ERR_ENCODING_INVALID_ENCODED_DATA") throw cause;
				return {
					ok: false,
					error: "JSON input is not valid UTF-8",
					cause
				};
			}
			if (text.startsWith("﻿")) return {
				ok: false,
				error: JSON_BYTE_ORDER_MARK_MESSAGE,
				cause: undefined
			};
			return safeParseJson(text);
		};
	})))();
}

//#endregion
//#region dist/application/JsonInputFile.js
async function* decodedChunks(handle, admittedBytes, path, signal, observe) {
	const decoder = new TextDecoder("utf-8", {
		fatal: true,
		ignoreBOM: true
	});
	let leading = true;
	const checked = (text) => {
		if (leading && text.length > 0) {
			leading = false;
			if (text.startsWith("﻿")) throw new JsonByteOrderMarkError();
		}
		return text;
	};
	const bytes = Buffer.allocUnsafe(READ_CHUNK_BYTES);
	let observedBytes = 0;
	while (true) {
		signal?.throwIfAborted();
		const read = await handle.read(bytes, 0, Math.min(bytes.length, admittedBytes - observedBytes + 1), observedBytes);
		signal?.throwIfAborted();
		if (read.bytesRead === 0) break;
		observedBytes += read.bytesRead;
		if (observedBytes > admittedBytes) throw new RegularFileChangedError(path);
		const chunk = bytes.subarray(0, read.bytesRead);
		observe?.(chunk);
		yield checked(decoder.decode(chunk, { stream: true }));
	}
	if (observedBytes !== admittedBytes) throw new RegularFileChangedError(path);
	yield checked(decoder.decode());
}
var READ_CHUNK_BYTES, PACKED_TOKEN_PART_CODE_UNITS, NATIVE_PARSE_READ_BUDGET, nativeParseFits, readJsonObjectFile, memberConsumer, readJsonInputFile, jsonReadFailure, packJsonScalars, admitJsonAssembly, requireStringAssemblyHeadroom, JsonByteOrderMarkError, readPrefix, readNativeJson, invalidJson;
function init_JsonInputFile() {
	return (init_JsonInputFile = __esmMin((() => {
		init_RegularFile();
		init_RegularFileRead();
		init_Utf8JsonInput();
		init_analysisErrorCore();
		init_result();
		READ_CHUNK_BYTES = 64 * 1024;
		PACKED_TOKEN_PART_CODE_UNITS = 64 * 1024;
		NATIVE_PARSE_READ_BUDGET = 8 * 1024 * 1024;
		nativeParseFits = (inputBytes) => inputBytes <= NATIVE_PARSE_READ_BUDGET && inputBytes * 72 + READ_CHUNK_BYTES <= getHeapStatistics().total_available_size;
		readJsonObjectFile = (path, operation, scans, signal, resources) => withRegularFile(path, async (handle, stats) => {
			let previousDigest;
			try {
				const native = await readNativeJson(handle, stats.size, path, operation, signal);
				if (native !== undefined) {
					if (!native.ok) return native;
					const value = native.value;
					if (typeof value !== "object" || value === null || Array.isArray(value)) return err(invalidJson(operation, "JSON document root must be an object"));
					for (const members of scans) for (const [key, member] of members) {
						if (!Object.hasOwn(value, key)) continue;
						signal?.throwIfAborted();
						member.begin();
						const selected = Reflect.get(value, key);
						if (member.mode === "array" && !Array.isArray(selected)) {
							member.reject(new TypeError(`JSON member ${key} must be an array`));
							continue;
						}
						for (const item of member.mode === "array" && Array.isArray(selected) ? selected : [selected]) {
							signal?.throwIfAborted();
							try {
								await member.accept(item);
							} catch (cause) {
								member.reject(cause);
							}
						}
					}
					return ok(undefined);
				}
				for (const members of scans) {
					const hash = createHash("sha256");
					let rootObject = false;
					let depth = 0;
					let key;
					let consume;
					await pipeline(decodedChunks(handle, stats.size, path, signal, (bytes) => {
						hash.update(bytes);
					}), asStream(fun(parser({
						jsonStreaming: false,
						streamValues: false,
						packKeys: false,
						packStrings: false,
						packNumbers: false
					}), packJsonScalars(operation, stats.size, path), (token) => {
						const opens = token.name === "startObject" || token.name === "startArray";
						const closes = token.name === "endObject" || token.name === "endArray";
						if (depth === 0) {
							rootObject = token.name === "startObject";
						} else if (rootObject && depth === 1 && token.name === "keyValue") {
							key = token.value;
						} else if (rootObject && depth === 1 && !closes) {
							const member = key === undefined ? undefined : members.get(key);
							consume = undefined;
							if (member !== undefined) {
								member.begin();
								if (member.mode === "array" && token.name !== "startArray") {
									member.reject(new TypeError(`JSON member ${key} must be an array`));
								} else {
									consume = memberConsumer(member, operation, stats.size, path);
								}
							}
							key = undefined;
						}
						const selected = consume;
						if (opens) depth += 1;
						if (closes) depth -= 1;
						if (rootObject && depth === 1 && token.name !== "keyValue") consume = undefined;
						if (selected === undefined) return none;
						return selected(token);
					})), signal === undefined ? {} : { signal });
					if (!rootObject) return err(invalidJson(operation, "JSON document root must be an object"));
					const digest = hash.digest("hex");
					if (previousDigest !== undefined && digest !== previousDigest) throw new RegularFileChangedError(path);
					previousDigest = digest;
				}
				return ok(undefined);
			} catch (cause) {
				const failure = jsonReadFailure(cause, operation, stats.size, path);
				if (failure !== undefined) return err(failure);
				throw cause;
			}
		}, {
			signal,
			...resources === undefined ? {} : { resources }
		});
		memberConsumer = (member, operation, size, path) => {
			let admit = admitJsonAssembly(operation, size, path);
			const streamer = member.mode === "array" ? streamArray() : streamValues();
			const consume = fun((token) => admit(token), streamer, (row) => {
				if (typeof row !== "object" || row === null || !("value" in row)) throw new Error("Unexpected JSON member parser result");
				admit = admitJsonAssembly(operation, size, path);
				try {
					const accepted = member.accept(row.value);
					if (accepted instanceof Promise) return accepted.then(() => none, (cause) => {
						member.reject(cause);
						return none;
					});
				} catch (cause) {
					member.reject(cause);
				}
				return none;
			});
			return (token) => {
				const consumed = consume(token);
				return consumed instanceof Promise ? consumed.then(() => none) : none;
			};
		};
		readJsonInputFile = (path, operation, signal, resources) => withRegularFile(path, async (handle, stats) => {
			let found = false;
			let value;
			try {
				const native = await readNativeJson(handle, stats.size, path, operation, signal);
				if (native !== undefined) return native;
				await pipeline(decodedChunks(handle, stats.size, path, signal), asStream(fun(parser({
					jsonStreaming: false,
					streamValues: false,
					packKeys: false,
					packStrings: false,
					packNumbers: false
				}), packJsonScalars(operation, stats.size, path), admitJsonAssembly(operation, stats.size, path), streamValues(), (row) => {
					if (found || typeof row !== "object" || row === null || !("key" in row) || row.key !== 0 || !("value" in row)) throw new Error("Unexpected JSON parser result");
					found = true;
					value = row.value;
					return none;
				})), signal === undefined ? {} : { signal });
				return found ? ok(value) : err(invalidJson(operation, "JSON document is empty"));
			} catch (cause) {
				const failure = jsonReadFailure(cause, operation, stats.size, path);
				if (failure !== undefined) return err(failure);
				throw cause;
			}
		}, {
			signal,
			...resources === undefined ? {} : { resources }
		});
		jsonReadFailure = (cause, operation, size, path) => {
			if (cause instanceof AnalysisResourceConstraintError) return cause;
			if (cause instanceof TypeError && "code" in cause && cause.code === "ERR_ENCODING_INVALID_ENCODED_DATA") return invalidJson(operation, "JSON input is not valid UTF-8", cause);
			if (cause instanceof SyntaxError || cause instanceof Error && cause.message.startsWith("Parser ")) return invalidJson(operation, cause.message, cause);
			if (cause instanceof Error && (cause instanceof RangeError && cause.message === "Invalid string length" || "code" in cause && cause.code === "ERR_STRING_TOO_LONG")) return new AnalysisResourceConstraintError(operation, "memory", "An individual JSON string or number token exceeds the runtime string limit", {
				input_path: path,
				input_file_bytes: size,
				max_string_code_units: constants.MAX_STRING_LENGTH
			}, {
				cause,
				remediationAction: JSON_INPUT_RESOURCE_REMEDIATION
			});
			return undefined;
		};
		packJsonScalars = (operation, inputFileBytes, path) => {
			let kind;
			let length = 0;
			let value = "";
			let parts = [];
			let partLength = 0;
			return (token) => {
				if (typeof token !== "object" || token === null || !("name" in token)) throw new Error("Unexpected JSON parser token");
				switch (token.name) {
					case "startKey":
					case "startString":
						kind = token.name === "startKey" ? "keyValue" : "stringValue";
						break;
					case "startNumber":
						kind = "numberValue";
						break;
					case "numberChunk":
					case "stringChunk":
						if (kind === undefined || !("value" in token) || typeof token.value !== "string") throw new Error("Unexpected JSON scalar fragment");
						length += token.value.length;
						if (length > constants.MAX_STRING_LENGTH) throw new RangeError("Invalid string length");
						parts.push(token.value);
						partLength += token.value.length;
						if (partLength >= PACKED_TOKEN_PART_CODE_UNITS) {
							requireStringAssemblyHeadroom(operation, inputFileBytes, path, length);
							value += parts.join("");
							parts = [];
							partLength = 0;
						}
						break;
					case "endKey":
					case "endString":
					case "endNumber": {
						if (kind === undefined) throw new Error("Unexpected JSON scalar end");
						requireStringAssemblyHeadroom(operation, inputFileBytes, path, length);
						const packed = {
							name: kind,
							value: value + parts.join("")
						};
						kind = undefined;
						length = 0;
						value = "";
						parts = [];
						partLength = 0;
						return packed;
					}
					default: return token;
				}
				return none;
			};
		};
		admitJsonAssembly = (operation, inputFileBytes, path) => {
			let projectedBytes = 0;
			let nextCheck = 0;
			return (token) => {
				if (typeof token !== "object" || token === null || !("name" in token)) throw new Error("Unexpected JSON assembly token");
				if (token.name === "startObject" || token.name === "startArray") {
					projectedBytes += 128;
				} else if (token.name === "keyValue" || token.name === "stringValue") {
					if (!("value" in token) || typeof token.value !== "string") throw new Error("Unexpected packed JSON string");
					projectedBytes += 64 + token.value.length * 2;
				} else if (token.name === "numberValue" || token.name === "nullValue" || token.name === "trueValue" || token.name === "falseValue") {
					projectedBytes += 64;
				}
				if (projectedBytes >= nextCheck) {
					const heap = getHeapStatistics();
					const requiredBytes = projectedBytes + READ_CHUNK_BYTES;
					if (requiredBytes > heap.total_available_size) throw new AnalysisResourceConstraintError(operation, "memory", "Insufficient heap headroom to materialize the complete JSON value", {
						input_path: path,
						input_file_bytes: inputFileBytes,
						projected_value_bytes: projectedBytes,
						assembly_headroom_bytes: requiredBytes,
						available_heap_bytes: heap.total_available_size,
						heap_size_limit_bytes: heap.heap_size_limit
					}, { remediationAction: JSON_INPUT_RESOURCE_REMEDIATION });
					nextCheck = projectedBytes + READ_CHUNK_BYTES;
				}
				return token;
			};
		};
		requireStringAssemblyHeadroom = (operation, inputFileBytes, path, stringCodeUnits) => {
			if (stringCodeUnits < PACKED_TOKEN_PART_CODE_UNITS) return;
			const heap = getHeapStatistics();
			const requiredBytes = 2 * (stringCodeUnits + PACKED_TOKEN_PART_CODE_UNITS);
			if (requiredBytes > heap.total_available_size) throw new AnalysisResourceConstraintError(operation, "memory", "Insufficient heap headroom to assemble a complete JSON string", {
				input_path: path,
				input_file_bytes: inputFileBytes,
				string_code_units: stringCodeUnits,
				string_assembly_headroom_bytes: requiredBytes,
				available_heap_bytes: heap.total_available_size,
				heap_size_limit_bytes: heap.heap_size_limit
			}, { remediationAction: JSON_INPUT_RESOURCE_REMEDIATION });
		};
		JsonByteOrderMarkError = class extends SyntaxError {
			constructor() {
				super(JSON_BYTE_ORDER_MARK_MESSAGE);
			}
		};
		readPrefix = async (handle, size, signal) => {
			const bytes = Buffer.allocUnsafe(size);
			let offset = 0;
			while (offset < bytes.length) {
				signal?.throwIfAborted();
				const read = await handle.read(bytes, offset, bytes.length - offset, null);
				signal?.throwIfAborted();
				if (read.bytesRead === 0) return {
					bytes: bytes.subarray(0, offset),
					complete: true
				};
				offset += read.bytesRead;
			}
			return {
				bytes,
				complete: false
			};
		};
		readNativeJson = async (handle, size, path, operation, signal) => {
			if (!nativeParseFits(size)) return undefined;
			const prefix = await readPrefix(handle, size + 1, signal);
			if (!prefix.complete || prefix.bytes.length !== size) throw new RegularFileChangedError(path);
			const parsed = parseUtf8Json(prefix.bytes, operation, path, "json-file-input");
			return parsed.ok ? ok(parsed.value) : err(invalidJson(operation, parsed.error, parsed.cause));
		};
		invalidJson = (operation, message, cause) => new AnalysisInputError(operation, cause === undefined ? undefined : { cause }, [{
			path: [],
			reason: "invalid_format",
			expected: "JSON",
			message
		}]);
	})))();
}

//#endregion
//#region dist/filesystem/OwnedStagedOutput.js
var identityOf, sameIdentity, OwnedStagedOutput, errorCode;
function init_OwnedStagedOutput() {
	return (init_OwnedStagedOutput = __esmMin((() => {
		init_OwnedFileHandle();
		identityOf = (stats) => ({
			dev: stats.dev,
			ino: stats.ino
		});
		sameIdentity = (stats, identity) => stats.dev === identity.dev && stats.ino === identity.ino;
		OwnedStagedOutput = class OwnedStagedOutput {
			directory;
			directoryIdentity;
			#file;
			#fileIdentity;
			#fileRemovedByOwner = false;
			#publishedRename = false;
			#closeAttempt;
			#closed = false;
			#identityFailure;
			constructor(directory, directoryIdentity) {
				this.directory = directory;
				this.directoryIdentity = directoryIdentity;
			}
			static async create(directory) {
				try {
					const stats = await lstat(directory);
					if (!stats.isDirectory() || stats.isSymbolicLink()) return new OwnedStagedOutput(directory, undefined);
					return new OwnedStagedOutput(directory, identityOf(stats));
				} catch (cause) {
					const owner = new OwnedStagedOutput(directory, undefined);
					owner.#identityFailure = cause;
					return owner;
				}
			}
			async setFile(file) {
				if (this.#file !== undefined) throw new Error("Staged output already owns a file handle");
				this.#file = file;
				try {
					this.#fileIdentity = identityOf(await file.handle.stat());
				} catch (cause) {
					this.#identityFailure = cause;
				}
			}
			/** Verify that the path still names the exact closed file before publication. */
			async assertReadyForPublication(content) {
				await this.#verifiedDirectory();
				if (this.#fileIdentity === undefined) throw new Error("Cannot verify staged file identity", { cause: this.#identityFailure });
				const stagedFile = await lstat(content);
				if (!stagedFile.isFile() || stagedFile.isSymbolicLink() || !sameIdentity(stagedFile, this.#fileIdentity)) throw new Error(`Staged file identity changed: ${content}`);
			}
			closeFile() {
				return this.#file?.close() ?? Promise.resolve();
			}
			/** Record that the staged file moved to the published destination by rename. */
			recordPublishedRename() {
				this.#publishedRename = true;
			}
			/** Close the owned descriptor and remove only the exact staged entries. */
			close() {
				if (this.#closed) return Promise.resolve();
				if (this.#closeAttempt !== undefined) return this.#closeAttempt;
				const attempt = Promise.resolve().then(() => this.#cleanup());
				this.#closeAttempt = attempt;
				void attempt.then(() => {
					this.#closed = true;
					this.#closeAttempt = undefined;
				}, () => {
					this.#closeAttempt = undefined;
				});
				return attempt;
			}
			async #cleanup() {
				await this.closeFile();
				await this.#verifiedDirectory();
				const content = `${this.directory}/content`;
				let stagedFile;
				try {
					stagedFile = await lstat(content);
				} catch (cause) {
					if (errorCode(cause) === "ENOENT" && (this.#file === undefined || this.#fileRemovedByOwner || this.#publishedRename)) {
						stagedFile = undefined;
					} else if (errorCode(cause) === "ENOENT") {
						throw new Error(`Owned staged file disappeared: ${content}`, { cause });
					} else {
						throw cause;
					}
				}
				if (stagedFile !== undefined) {
					if (!stagedFile.isFile() || stagedFile.isSymbolicLink() || this.#fileIdentity === undefined || !sameIdentity(stagedFile, this.#fileIdentity)) throw new Error(`Staged file identity changed: ${content}`);
					await unlink(content);
					this.#fileRemovedByOwner = true;
				}
				const remaining = await readdir(this.directory);
				if (remaining.length > 0) throw new Error(`Unexpected staging entries remain in ${this.directory}: ${remaining.join(", ")}`);
				await this.#verifiedDirectory();
				await rmdir(this.directory);
			}
			async #verifiedDirectory() {
				if (this.directoryIdentity === undefined) throw new Error(`Cannot verify staging directory ownership: ${this.directory}`, { cause: this.#identityFailure });
				const directory = await lstat(this.directory);
				if (!directory.isDirectory() || directory.isSymbolicLink() || !sameIdentity(directory, this.directoryIdentity)) throw new Error(`Staging directory identity changed: ${this.directory}`);
			}
		};
		errorCode = (cause) => typeof cause === "object" && cause !== null && "code" in cause ? cause.code : undefined;
	})))();
}

//#endregion
//#region dist/application/JsonFiles.js
function writeTextParts(parts, path, overwrite, resources, cancellation) {
	return resources.run(() => writeTextPartsOwned(parts, path, overwrite, resources, cancellation)).catch((cause) => {
		const cleanup = cause instanceof ArtifactReaderFailure && cause.cleanup !== undefined ? cause.cleanup : undefined;
		return err(new EvidenceFileError("write", "io", {
			cause,
			path: resolve(path),
			...cleanup === undefined ? {} : { cleanup }
		}));
	});
}
var readJsonFile, readJsonObjectMembersFile, readJsonFileInput, writeTextFile, writeTextPartsOwned, missingOrIo, publishFile, StagedOutputCleanupFailure, failureMessage, writeStagedParts, assertWriteActive, fileErrorCode;
function init_JsonFiles() {
	return (init_JsonFiles = __esmMin((() => {
		init_evidenceErrors();
		init_analysisErrorCore();
		init_result();
		init_JsonInputFile();
		init_RegularFile();
		init_RegularFileRead();
		init_ArtifactReader();
		init_OwnedFileHandle();
		init_OwnedStagedOutput();
		readJsonFile = async (path, signal, resources) => readJsonFileInput(path, (selected) => readJsonInputFile(selected, "read_evidence_file", signal, resources), signal);
		readJsonObjectMembersFile = (path, scans, signal, resources) => readJsonFileInput(path, (selected) => readJsonObjectFile(selected, "read_evidence_file", scans, signal, resources), signal);
		readJsonFileInput = async (path, read, signal) => {
			const requestedPath = resolve(path);
			try {
				const decoded = await read(requestedPath);
				if (!decoded.ok) {
					if (decoded.error instanceof AnalysisResourceConstraintError) return err(decoded.error);
					return err(new EvidenceFileError("read", "invalid-json", {
						cause: decoded.error.cause ?? new SyntaxError(decoded.error.issues[0]?.message ?? decoded.error.message),
						path: requestedPath
					}));
				}
				return ok(decoded.value);
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (cause instanceof AnalysisResourceConstraintError) return err(cause);
				if (signal?.aborted === true) throw cause;
				return err(new EvidenceFileError("read", cause instanceof NonRegularFileReadError ? "not-file" : missingOrIo(cause), {
					cause,
					path: requestedPath
				}));
			}
		};
		writeTextFile = async (encoded, path, overwrite, resources) => writeTextParts([encoded], path, overwrite, resources);
		writeTextPartsOwned = async (parts, path, overwrite, resources, cancellation) => {
			const requestedPath = resolve(path);
			try {
				assertWriteActive(cancellation);
				const canonicalParent = await realpath(dirname(requestedPath));
				const destination = resolve(canonicalParent, basename(requestedPath));
				const existing = await lstat(destination).catch((cause) => {
					if (fileErrorCode(cause) === "ENOENT") return undefined;
					throw cause;
				});
				if (existing !== undefined) {
					if (!overwrite) return err(new EvidenceFileError("write", "exists", { path: requestedPath }));
					if (!existing.isFile() || existing.isSymbolicLink()) return err(new EvidenceFileError("write", "not-file", { path: requestedPath }));
				}
				assertWriteActive(cancellation);
				const bytes = await publishFile(destination, parts, overwrite, resources, cancellation);
				return ok({
					path: requestedPath,
					bytes
				});
			} catch (cause) {
				if (cause instanceof StagedOutputCleanupFailure) {
					const cleanup = {
						reason: failureMessage(cause.cleanupCause),
						resources: [cause.owner.directory]
					};
					if (cause.outcome.ok) return err(new EvidenceFileError("write", "io", {
						cause,
						path: requestedPath,
						cleanup,
						published: {
							...cause.outcome.value,
							path: requestedPath
						}
					}));
					if (cause.outcome.error instanceof AnalysisCancelledError) return err(new AnalysisCancelledError(cause.outcome.error.operation, {
						cause,
						cleanup
					}));
					return err(new EvidenceFileError("write", missingOrIo(cause.outcome.error), {
						cause,
						path: requestedPath,
						cleanup
					}));
				}
				if (cancellation?.signal.aborted === true && cause instanceof AnalysisCancelledError && cause.operation === cancellation.operation) return err(cause);
				if (!overwrite && fileErrorCode(cause) === "EEXIST") return err(new EvidenceFileError("write", "exists", {
					cause,
					path: requestedPath
				}));
				return err(new EvidenceFileError("write", missingOrIo(cause), {
					cause,
					path: requestedPath
				}));
			}
		};
		missingOrIo = (cause) => {
			const code = fileErrorCode(cause);
			return code === "ENOENT" || code === "ENOTDIR" ? "missing" : "io";
		};
		publishFile = async (destination, parts, overwrite, resources, cancellation) => {
			const stagingDirectory = await mkdtemp(resolve(dirname(destination), ".rea-write-"));
			const owner = await OwnedStagedOutput.create(stagingDirectory);
			let outcome;
			const staged = resolve(stagingDirectory, "content");
			try {
				const file = await open(staged, "wx", 384);
				await owner.setFile(new OwnedFileHandle(file));
				let written;
				try {
					const bytes = await writeStagedParts(file, parts, cancellation);
					assertWriteActive(cancellation);
					await file.sync();
					written = ok(bytes);
				} catch (cause) {
					written = err(cause);
				}
				try {
					await owner.closeFile();
				} catch (cause) {
					if (written.ok) written = err(cause);
				}
				if (!written.ok) throw written.error;
				assertWriteActive(cancellation);
				await owner.assertReadyForPublication(staged);
				assertWriteActive(cancellation);
				if (overwrite) {
					await rename(staged, destination);
					owner.recordPublishedRename();
				} else await link(staged, destination);
				outcome = ok({
					path: destination,
					bytes: written.value
				});
			} catch (cause) {
				outcome = err(cause);
			}
			const released = await resources.release({
				kind: "staged-output",
				resource: owner.directory,
				output: owner
			});
			if (released.kind === "failed") throw new StagedOutputCleanupFailure(outcome, released.cause, owner);
			if (!outcome.ok) throw outcome.error;
			return outcome.value.bytes;
		};
		StagedOutputCleanupFailure = class extends Error {
			outcome;
			cleanupCause;
			owner;
			constructor(outcome, cleanupCause, owner) {
				super("Staged output cleanup failed", { cause: outcome.ok ? cleanupCause : outcome.error });
				this.outcome = outcome;
				this.cleanupCause = cleanupCause;
				this.owner = owner;
			}
		};
		failureMessage = (cause) => cause instanceof Error ? cause.message || cause.name : String(cause);
		writeStagedParts = async (file, parts, cancellation) => {
			assertWriteActive(cancellation);
			const iterator = parts[Symbol.iterator]();
			let exhausted = false;
			let bytes = 0;
			try {
				for (;;) {
					assertWriteActive(cancellation);
					const part = iterator.next();
					if (part.done) exhausted = true;
					assertWriteActive(cancellation);
					if (part.done) return bytes;
					await file.writeFile(part.value, { encoding: "utf8" });
					bytes += Buffer.byteLength(part.value, "utf8");
				}
			} finally {
				if (!exhausted) iterator.return?.();
			}
		};
		assertWriteActive = (cancellation) => {
			if (cancellation?.signal.aborted === true) throw new AnalysisCancelledError(cancellation.operation);
		};
		fileErrorCode = (cause) => typeof cause === "object" && cause !== null && "code" in cause ? cause.code : undefined;
	})))();
}

//#endregion
//#region dist/application/binary/AnalysisSnapshotFiles.js
var readAnalysisSnapshot, snapshotEntryReader, writeAnalysisSnapshot, snapshotValidationMessage;
function init_AnalysisSnapshotFiles() {
	return (init_AnalysisSnapshotFiles = __esmMin((() => {
		init_analysisSnapshot();
		init_evidenceErrors();
		init_result();
		init_analysisErrorCore();
		init_JsonFiles();
		init_RegularFileRead();
		readAnalysisSnapshot = async (path, signal, resources) => {
			const entries = snapshotEntryReader("provider");
			const workflows = snapshotEntryReader("workflow");
			const header = {};
			const metadata = new Map([
				"target",
				"binding",
				"evidence_bundle"
			].map((name) => [name, {
				mode: "value",
				begin: () => {
					delete header[name];
				},
				accept: (value) => {
					header[name] = value;
				},
				reject: (cause) => {
					throw cause;
				}
			}]));
			try {
				const loaded = await readJsonObjectMembersFile(path, [new Map([["entries", entries.reader], ["workflow_entries", workflows.reader]]), metadata], signal, resources);
				if (!loaded.ok) return loaded;
				signal?.throwIfAborted();
				const snapshot = parsePreparedAnalysisSnapshot(header, entries.finish(), workflows.finish());
				await setImmediate();
				signal?.throwIfAborted();
				return ok(snapshot);
			} catch (cause) {
				if (cause instanceof RegularFileCleanupFailure) throw cause;
				if (signal?.aborted === true) return err(new AnalysisCancelledError("read_evidence_file", { cause }));
				return err(new EvidenceIntegrityError(snapshotValidationMessage(cause), { cause }));
			}
		};
		snapshotEntryReader = (kind) => {
			let seen = false;
			let entries = [];
			let failure;
			const reader = {
				mode: "array",
				begin: () => {
					seen = true;
					entries = [];
					failure = undefined;
				},
				accept: (value) => {
					if (failure === undefined) entries.push(prepareSnapshotEntry(value, kind));
				},
				reject: (cause) => {
					failure ??= { cause };
				}
			};
			return {
				reader,
				finish: () => {
					if (!seen) throw new TypeError(`Analysis snapshot ${kind === "provider" ? "entries" : "workflow_entries"} is missing`);
					if (failure !== undefined) throw failure.cause;
					return entries;
				}
			};
		};
		writeAnalysisSnapshot = async (snapshot, path, overwrite, resources) => {
			let encoded;
			try {
				encoded = serializeAnalysisSnapshot(snapshot);
			} catch (cause) {
				return err(new EvidenceIntegrityError(snapshotValidationMessage(cause), { cause }));
			}
			return writeTextFile(encoded, path, overwrite, resources);
		};
		snapshotValidationMessage = (cause) => cause instanceof TypeError ? cause.message : "Analysis snapshot validation failed";
	})))();
}

//#endregion
export { readJsonFile as a, init_AnalysisSnapshotCache as c, init_analysisSnapshot as d, snapshotEvidenceForQuery as f, snapshotTarget as h, init_JsonFiles as i, isSnapshotCacheable as l, snapshotMatchesTarget as m, readAnalysisSnapshot as n, writeTextParts as o, snapshotMatchesBinding as p, writeAnalysisSnapshot as r, AnalysisSnapshotCache as s, init_AnalysisSnapshotFiles as t, requiresNativeSourceAdmissionBeforeReplay as u };