import { __esmMin } from "./rolldown-runtime-DXoylpqc.js";
import { AnalysisInputError, AnalysisOutputError, ConfigurationError, PROVIDER_FAILURE_STAGES, PROVIDER_OPERATION_STATES, PROVIDER_RETRY_ACTIONS, analysisErrorProjectionSchema, freezeJsonSnapshot, init_analysisErrorCore, init_configurationErrors, init_errorSchemas, init_immutableJson, init_jsonValue, init_providerOperationHealth, isImmutableJsonSnapshot, jsonObjectSchema, jsonValueSchema, jsonValueValidationIssue, jsonValueValidationSteps } from "./errorSchemas-CTRmvMl3.js";
import { z } from "zod";
import { basename, isAbsolute, posix, relative, sep } from "node:path";
import { createHash } from "node:crypto";
import canonicalize from "canonicalize";
import { fileURLToPath } from "node:url";
import { PACKAGE_METADATA } from "../generatedPackageMetadata.js";
import * as t from "@babel/types";
import { parse, parseExpression } from "@babel/parser";

//#region dist/domain/localPath.js
var nulFreeStringSchema, localPathStringSchema, isPathWithinRoot;
function init_localPath() {
	return (init_localPath = __esmMin((() => {
		nulFreeStringSchema = z.string().regex(/^[^\x00]*$/u, "Local filesystem paths cannot contain NUL");
		localPathStringSchema = nulFreeStringSchema.min(1);
		isPathWithinRoot = (root, path) => {
			const value = relative(root, path);
			return value === "" || value !== ".." && !value.startsWith(`..${sep}`) && !isAbsolute(value);
		};
	})))();
}

//#endregion
//#region dist/domain/canonicalDigest.js
var digestCanonicalValue, emitCanonical;
function init_canonicalDigest() {
	return (init_canonicalDigest = __esmMin((() => {
		digestCanonicalValue = (value, context = "Comparison") => {
			const hash = createHash("sha256");
			let buffered = "";
			const emit = (part) => {
				buffered += part;
				if (buffered.length >= 8192) {
					hash.update(buffered);
					buffered = "";
				}
			};
			const encoded = emitCanonical(value, emit, new Set());
			if (!encoded) throw new TypeError(`${context} could not canonicalize data`);
			if (buffered) hash.update(buffered);
			return hash.digest("hex");
		};
		emitCanonical = (value, emit, ancestors) => {
			if (typeof value === "number" && !Number.isFinite(value)) throw new Error(Number.isNaN(value) ? "NaN is not allowed" : "Infinity is not allowed");
			if (value === null || typeof value !== "object") {
				const encoded = JSON.stringify(value);
				if (encoded === undefined) return false;
				emit(encoded);
				return true;
			}
			if (ancestors.has(value)) throw new Error("Circular reference detected");
			ancestors.add(value);
			try {
				if ("toJSON" in value && typeof value.toJSON === "function") {
					const normalized = value.toJSON();
					return emitCanonical(normalized, emit, ancestors);
				}
				if (Array.isArray(value)) {
					emit("[");
					const length = value.length;
					for (let index = 0; index < length; index += 1) {
						if (index > 0) emit(",");
						if (!(index in value)) continue;
						const item = value[index];
						emitCanonical(item === undefined || typeof item === "symbol" ? null : item, emit, ancestors);
					}
					emit("]");
				} else {
					emit("{");
					let first = true;
					for (const key of Object.keys(value).sort()) {
						if (Reflect.get(value, key) === undefined || typeof Reflect.get(value, key) === "symbol") continue;
						const item = Reflect.get(value, key);
						if (!first) emit(",");
						first = false;
						emit(JSON.stringify(key));
						emit(":");
						if (!emitCanonical(item, emit, ancestors)) emit("undefined");
					}
					emit("}");
				}
				return true;
			} finally {
				ancestors.delete(value);
			}
		};
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
//#region dist/domain/digests.js
var SHA256_PATTERN, digestSchema, prefixedDigestSchema, isDigest;
function init_digests() {
	return (init_digests = __esmMin((() => {
		SHA256_PATTERN = /^[a-f0-9]{64}$/u;
		digestSchema = z.string().regex(SHA256_PATTERN);
		prefixedDigestSchema = (prefix) => z.string().regex(new RegExp(`^${prefix}_[a-f0-9]{64}$`, "u"), `Expected a ${prefix}_ prefixed lowercase sha256 digest`);
		isDigest = (value) => typeof value === "string" && SHA256_PATTERN.test(value);
	})))();
}

//#endregion
//#region dist/domain/analysisProfile.js
var committedProviderSchema, unsignedAnalysisProfileSchema, analysisProfileSchema, createAnalysisProfile, analysisProfilesEqual, profileDigest, canonicalJson$2;
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
		profileDigest = (profile) => createHash("sha256").update(canonicalJson$2(profile)).digest("hex");
		canonicalJson$2 = (value) => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError("RFC 8785 canonicalization rejected analysis profile");
			return encoded;
		};
	})))();
}

//#endregion
//#region dist/domain/binaryTargetTypes.js
var BINARY_ARCHITECTURES, ELF_METADATA_ARCHITECTURES, isElfMetadataArchitecture, isMachOFormat$1;
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
		isMachOFormat$1 = (format) => format === "mach-o" || format === "mach-o-universal";
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
//#region dist/domain/inputIssueProjection.js
var analysisInputErrorFromIssues, projectInputIssues, projectIssue, uniqueIssues, valueAtPath, numericBound, isSafeExpected, safeExpected, boundedIssue;
function init_inputIssueProjection() {
	return (init_inputIssueProjection = __esmMin((() => {
		init_analysisErrorCore();
		analysisInputErrorFromIssues = (operation, issues, input, options = {}) => new AnalysisInputError(operation, options.cause === undefined ? undefined : { cause: options.cause }, [...projectInputIssues(issues, input), ...options.additionalIssues ?? []]);
		projectInputIssues = (issues, input) => issues.flatMap((issue) => projectIssue(issue, input));
		projectIssue = (issue, input) => {
			const path = issue.path.flatMap((part) => typeof part === "string" || typeof part === "number" ? [part] : []);
			if (issue.code === "invalid_union") {
				if (issue.errors.length === 0) {
					const expected = "options" in issue ? issue.options?.filter(isSafeExpected) : undefined;
					return [{
						path,
						reason: valueAtPath(input, path) === undefined ? "missing_argument" : "invalid_value",
						...expected === undefined ? {} : { expected }
					}];
				}
				return uniqueIssues(issue.errors.flatMap((branch) => branch.flatMap((branchIssue) => projectIssue({
					...branchIssue,
					path: [...issue.path, ...branchIssue.path]
				}, input))));
			}
			if (issue.code === "invalid_key") return issue.issues.flatMap((keyIssue) => projectIssue({
				...keyIssue,
				path: [...issue.path, ...keyIssue.path]
			}, input));
			if (issue.code === "unrecognized_keys") return issue.keys.map((key) => ({
				path: [...path, key],
				reason: "unknown_argument"
			}));
			if (issue.code === "invalid_type") return [{
				path,
				reason: valueAtPath(input, path) === undefined ? "missing_argument" : "invalid_type",
				expected: safeExpected(issue.expected)
			}];
			if (issue.code === "too_small") return [boundedIssue(path, "minimum", numericBound(issue.minimum))];
			if (issue.code === "too_big") return [boundedIssue(path, "maximum", numericBound(issue.maximum))];
			if (issue.code === "invalid_format") return [{
				path,
				reason: "invalid_format",
				expected: issue.format,
				...issue.format === "regex" && issue.message.length > 0 ? { message: issue.message } : {}
			}];
			if (issue.code === "invalid_value") return [{
				path,
				reason: "invalid_value",
				expected: issue.values.filter(isSafeExpected)
			}];
			return [{
				path,
				reason: "invalid_value",
				...issue.message.length > 0 ? { message: issue.message } : {}
			}];
		};
		uniqueIssues = (issues) => [...new Map(issues.map((issue) => [JSON.stringify(issue), issue])).values()];
		valueAtPath = (input, path) => {
			let current = input;
			for (const part of path) {
				if (typeof current !== "object" || current === null) return undefined;
				const next = Reflect.get(current, part);
				current = next;
			}
			return current;
		};
		numericBound = (value) => typeof value === "number" && Number.isFinite(value) ? value : undefined;
		isSafeExpected = (value) => value === null || [
			"string",
			"number",
			"boolean"
		].includes(typeof value);
		safeExpected = (value) => isSafeExpected(value) ? value : "schema-defined value";
		boundedIssue = (path, key, value) => ({
			path,
			reason: "out_of_range",
			...value === undefined ? {} : { [key]: value }
		});
	})))();
}

//#endregion
//#region dist/domain/result.js
var ok, err;
function init_result() {
	return (init_result = __esmMin((() => {
		ok = (value) => ({
			ok: true,
			value
		});
		err = (error) => ({
			ok: false,
			error
		});
	})))();
}

//#endregion
//#region dist/domain/unicodeCodePointOrder.js
var compareUnicodeCodePoints, compositeKey;
function init_unicodeCodePointOrder() {
	return (init_unicodeCodePointOrder = __esmMin((() => {
		compareUnicodeCodePoints = (left, right) => {
			let leftIndex = 0;
			let rightIndex = 0;
			while (leftIndex < left.length && rightIndex < right.length) {
				const leftPoint = left.codePointAt(leftIndex) ?? 0;
				const rightPoint = right.codePointAt(rightIndex) ?? 0;
				const difference = leftPoint - rightPoint;
				if (difference !== 0) return difference;
				leftIndex += leftPoint > 65535 ? 2 : 1;
				rightIndex += rightPoint > 65535 ? 2 : 1;
			}
			if (leftIndex === left.length && rightIndex === right.length) return 0;
			return leftIndex === left.length ? -1 : 1;
		};
		compositeKey = (parts) => JSON.stringify(parts);
	})))();
}

//#endregion
//#region dist/cliCommandNames.js
var CLI_COMMANDS, CLI_COMMAND_NAMES, CLI_COMMAND_ALIASES, CLI_COMMAND_TOOL_ALIASES, MCP_TOOLS_WITHOUT_DEDICATED_CLI;
function init_cliCommandNames() {
	return (init_cliCommandNames = __esmMin((() => {
		CLI_COMMANDS = Object.freeze({
			inspectPacketFields: "inspect-packet-fields",
			inspectPacketCapture: "inspect-packet-capture",
			inspectSignalDecoders: "inspect-signal-decoders",
			decodeSignalRecording: "decode-signal-recording",
			compareWasmInterfaces: "compare-wasm-interfaces",
			inspectWasmArtifact: "inspect-wasm-artifact",
			inspectSqliteDatabase: "inspect-sqlite-database",
			inspectEvmInterface: "inspect-evm-interface",
			inspectWebNetworkCapture: "inspect-web-network-capture",
			observeWebExecution: "observe-web-execution",
			inspectWebEventListeners: "inspect-web-event-listeners",
			traceWebSourceLocation: "trace-web-source-location",
			traceWebModuleImports: "trace-web-module-imports",
			analyze: "analyze",
			inspect: "inspect",
			decompile: "decompile",
			setup: "setup",
			doctor: "doctor",
			uninstall: "uninstall",
			update: "update",
			xrefs: "xrefs",
			trace: "trace",
			traceNativeUiAction: "trace-native-ui-action",
			inspectNativeDispatchMetadata: "inspect-native-dispatch-metadata",
			capabilities: "capabilities",
			providers: "providers",
			function: "function",
			annotateNativeFunction: "annotate-native-function",
			inspectNativeApi: "inspect-native-api",
			instructions: "instructions",
			search: "search",
			importReferenceSource: "import-reference-source",
			inspectArtifact: "inspect-artifact",
			extractArtifact: "extract-artifact",
			decodeInterfaceBuilder: "decode-interface-builder",
			inspectKeyedArchive: "inspect-keyed-archive",
			traceDylibResolution: "trace-dylib-resolution",
			inspectNativeDataType: "inspect-native-data-type",
			inspectNativeLoadImage: "inspect-native-load-image",
			readBytes: "read-bytes",
			searchBytes: "search-bytes",
			addressToFileOffset: "address-to-file-offset",
			traceNativeValues: "trace-native-values",
			inspectNativeInstruction: "inspect-native-instruction",
			resolveNativeCallTargets: "resolve-native-call-targets",
			inspectAssetCatalog: "inspect-asset-catalog",
			inspectManagedArtifact: "inspect-managed-artifact",
			inspectRecordedCrash: "inspect-recorded-crash",
			inspectBinaryLayout: "inspect-binary-layout",
			listCutterSessions: "list-cutter-sessions",
			cutterCommand: "cutter-command",
			inspectWithObjdump: "inspect-with-objdump",
			listObjdumpArchitectures: "list-objdump-architectures",
			executeRizinCommand: "execute-rizin-command",
			debugWithGdb: "debug-with-gdb",
			debugWithRizin: "debug-with-rizin",
			inspectGoBinary: "inspect-go-binary",
			inspectRustBinary: "inspect-rust-binary",
			inspectPeResources: "inspect-pe-resources",
			inspectAnalysisView: "inspect-analysis-view",
			listFridaDevices: "list-frida-devices",
			listFridaProcesses: "list-frida-processes",
			instrumentWithFrida: "instrument-with-frida",
			inspectEvidenceBundle: "inspect-evidence-bundle",
			inspectFirmwareRegions: "inspect-firmware-regions",
			extractFirmware: "extract-firmware",
			inspectAndroidPackage: "inspect-android-package",
			inspectPcapClient: "inspect-pcap-client",
			inspectPcapCapture: "inspect-pcap-capture",
			identifyFlutterBuild: "identify-flutter-build",
			inspectDartAot: "inspect-dart-aot",
			inspectApktoolClient: "inspect-apktool-client",
			decodeAndroidResources: "decode-android-resources",
			inspectAdbClient: "inspect-adb-client",
			listAdbDevices: "list-adb-devices",
			inspectAdbDevice: "inspect-adb-device",
			listAdbPackages: "list-adb-packages",
			pullAdbPackage: "pull-adb-package",
			readAdbLogcat: "read-adb-logcat",
			inspectAdbPackage: "inspect-adb-package",
			pullAdbFile: "pull-adb-file",
			pushAdbFile: "push-adb-file",
			captureAdbScreen: "capture-adb-screen",
			listAdbProcesses: "list-adb-processes",
			listAdbDirectory: "list-adb-directory",
			listAdbFeatures: "list-adb-features",
			listAdbServices: "list-adb-services",
			inspectAdbDisplay: "inspect-adb-display",
			inspectAdbWindow: "inspect-adb-window",
			readAdbSetting: "read-adb-setting",
			collectAdbBugreport: "collect-adb-bugreport",
			resolveAdbPackages: "resolve-adb-packages",
			installAdbPackage: "install-adb-package",
			uninstallAdbPackage: "uninstall-adb-package",
			startAdbApp: "start-adb-app",
			startAdbActivity: "start-adb-activity",
			stopAdbApp: "stop-adb-app",
			searchAndroidClasses: "search-android-classes",
			inspectAndroidClass: "inspect-android-class",
			inspectAndroidMethod: "inspect-android-method",
			traceAndroidReferences: "trace-android-references",
			inspectJebClient: "inspect-jeb-client",
			openJebProject: "open-jeb-project",
			listJebUnits: "list-jeb-units",
			decompileJebItem: "decompile-jeb-item",
			inspectManagedMembers: "inspect-managed-members",
			inspectManagedNativeBoundaries: "inspect-managed-native-boundaries",
			compareManagedMembers: "compare-managed-members",
			verifyManagedNativeBoundaries: "verify-managed-native-boundaries",
			importManagedReconstruction: "import-managed-reconstruction",
			projectManagedApplicationGraph: "project-managed-application-graph",
			observeNativeUi: "observe-native-ui",
			observeNativeCalls: "observe-native-calls",
			captureNativeUiScenario: "capture-native-ui-scenario",
			inspectMacho: "inspect-macho",
			inspectSignature: "inspect-signature",
			listArchitectures: "list-architectures",
			inspectPlist: "inspect-plist",
			demangleSwift: "demangle-swift",
			evidenceImport: "evidence-import",
			evidenceExport: "evidence-export",
			compare: "compare",
			captureProcess: "capture-process",
			compareProcessCaptures: "compare-process-captures",
			listBrowserTargets: "list-browser-targets",
			inspectWebPage: "inspect-web-page",
			analyzeWebBundle: "analyze-web-bundle",
			exportWebScripts: "export-web-scripts",
			recoverJavaScriptSources: "recover-javascript-sources",
			observeWebSession: "observe-web-session",
			discoverWebMcpTools: "discover-webmcp-tools",
			compareWebCaptures: "compare-web-captures",
			captureWebScreenshot: "capture-web-screenshot",
			compareWebScreenshots: "compare-web-screenshots",
			captureBrowserScenario: "capture-browser-scenario",
			listElectronTargets: "list-electron-targets",
			inspectElectronPage: "inspect-electron-page",
			inspectElectronFuses: "inspect-electron-fuses",
			captureElectronScenario: "capture-electron-scenario",
			listJavaScriptRuntimeTargets: "list-javascript-runtime-targets",
			observeJavaScriptRuntime: "observe-javascript-runtime",
			analyzeJavaScriptApplication: "analyze-javascript-application",
			reconcileJavaScriptRuntime: "reconcile-javascript-runtime",
			traceApplicationFeature: "trace-application-feature",
			traceJavaScriptSemantics: "trace-javascript-semantics",
			compareApplicationVersions: "compare-application-versions",
			compareSourceToBundle: "compare-source-to-bundle",
			compareJavaScriptExportShapes: "compare-javascript-export-shapes",
			buildReconstructionObligationLedger: "build-reconstruction-obligation-ledger",
			evaluateReconstructionCoverage: "evaluate-reconstruction-coverage",
			projectAndroidApplicationGraph: "project-android-application-graph",
			projectAppleApplicationGraph: "project-apple-application-graph",
			projectHarmonyApplicationGraph: "project-harmony-application-graph"
		});
		CLI_COMMAND_NAMES = Object.freeze(Object.values(CLI_COMMANDS));
		CLI_COMMAND_ALIASES = Object.freeze(["compare-bundles"]);
		CLI_COMMAND_TOOL_ALIASES = Object.freeze({
			analyze: ["binary_overview"],
			inspect: ["binary_overview"],
			decompile: ["procedure_pseudo_code"],
			function: ["analyze_function"],
			instructions: ["read_function_instructions"],
			trace: ["trace_feature"],
			search: ["search_strings", "search_procedures"],
			"capture-process": ["capture_process_scenario"],
			"compare-bundles": ["compare_bundles"],
			"list-cutter-sessions": ["list_cutter_sessions"],
			"cutter-command": ["cutter_command"],
			"inspect-with-objdump": ["inspect_with_objdump"],
			"list-objdump-architectures": ["inspect_with_objdump"],
			"execute-rizin-command": ["execute_rizin_command"],
			"debug-with-gdb": ["gdb_console"],
			"debug-with-rizin": ["rizin_debug_command"],
			"list-frida-devices": ["list_frida_devices"],
			"list-frida-processes": ["list_frida_processes"],
			"instrument-with-frida": ["instrument_with_frida"]
		});
		MCP_TOOLS_WITHOUT_DEDICATED_CLI = Object.freeze([
			"address_name",
			"comment",
			"current_address",
			"current_procedure",
			"current_document",
			"goto_address",
			"inline_comment",
			"list_bookmarks",
			"list_documents",
			"list_names",
			"list_procedures",
			"list_segments",
			"list_strings",
			"next_address",
			"prev_address",
			"procedure_address",
			"procedure_assembly",
			"procedure_callees",
			"procedure_callers",
			"procedure_info",
			"procedure_references",
			"resolve_containing_procedure",
			"set_address_name",
			"set_addresses_names",
			"set_bookmark",
			"set_comment",
			"set_inline_comment",
			"unset_bookmark",
			"get_objc_classes",
			"get_objc_protocols",
			"batch_decompile",
			"get_call_graph",
			"analyze_swift_types",
			"find_xrefs_to_name",
			"trace_call_path",
			"open_binary",
			"close_binary",
			"binary_session",
			"export_evidence_bundle",
			"import_evidence_bundle",
			"compare_artifacts",
			"compare_functions",
			"find_changed_behavior",
			"build_call_path",
			"correlate_static_and_runtime",
			"verify_reconstruction",
			"list_unknowns",
			"record_unknown",
			"update_unknown",
			"verify_unknown_resolution",
			"get_evidence_bundle",
			"get_navigation_context",
			"inspect_address_context",
			"start_gdb_session",
			"gdb_session_status",
			"close_gdb_session",
			"start_rizin_debug_session",
			"rizin_debug_session_status",
			"close_rizin_debug_session",
			"start_frida_session",
			"load_frida_script",
			"resume_frida_session",
			"unload_frida_script",
			"frida_session_status",
			"close_frida_session"
		]);
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
//#region dist/domain/javascript/javascriptSourceParser.js
var parserPluginsForPath, isExplicitModuleSourcePath, runtimeSourceTypeForPath, parseRecoveredJavaScript, parseJavaScriptSource;
function init_javascriptSourceParser() {
	return (init_javascriptSourceParser = __esmMin((() => {
		parserPluginsForPath = (sourcePath) => {
			const path = sourcePath ?? "";
			const dts = /\.d\.(?:ts|mts|cts)$/iu.test(path);
			const isTsLike = /\.(?:ts|cts|mts)$/iu.test(path);
			const isTsx = /\.tsx$/iu.test(path);
			const isMts = /\.mts$/iu.test(path);
			const typescript = ["typescript", {
				dts,
				...isMts ? { disallowAmbiguousJSXLike: true } : {}
			}];
			const jsxCapable = !dts && (isTsx || !isTsLike);
			return jsxCapable ? [
				"decorators-legacy",
				"jsx",
				typescript
			] : ["decorators-legacy", typescript];
		};
		isExplicitModuleSourcePath = (path) => /\.m[jt]s$/iu.test(path ?? "");
		runtimeSourceTypeForPath = (path) => /\.cjs$/iu.test(path ?? "") ? "commonjs" : isExplicitModuleSourcePath(path) ? "module" : "unambiguous";
		parseRecoveredJavaScript = (source, sourcePath, options) => {
			const sourceType = runtimeSourceTypeForPath(sourcePath);
			if (sourceType !== "unambiguous") {
				const normalizedOptions = { ...options };
				if (sourceType === "commonjs") {
					delete normalizedOptions.allowAwaitOutsideFunction;
					delete normalizedOptions.allowReturnOutsideFunction;
					delete normalizedOptions.allowNewTargetOutsideFunction;
				}
				return {
					file: parse(source, {
						...normalizedOptions,
						sourceType,
						errorRecovery: true
					}),
					moduleOnlyErrors: []
				};
			}
			const file = parse(source, {
				...options,
				sourceType: "unambiguous",
				errorRecovery: true
			});
			if (file.program.sourceType !== "script" || file.errors.length === 0) return {
				file,
				moduleOnlyErrors: []
			};
			const script = parse(source, {
				...options,
				sourceType: "script",
				errorRecovery: true
			});
			const scriptErrors = new Set(script.errors.map((error) => error.message));
			return {
				file: script,
				moduleOnlyErrors: file.errors.map((error) => error.message).filter((message) => !scriptErrors.has(message))
			};
		};
		parseJavaScriptSource = (source, sourcePath) => {
			try {
				const runtimeSourceType = runtimeSourceTypeForPath(sourcePath);
				const commonjs = runtimeSourceType === "commonjs";
				const options = {
					errorRecovery: true,
					attachComment: false,
					plugins: parserPluginsForPath(sourcePath)
				};
				const file = parse(source, {
					...options,
					sourceType: commonjs ? "unambiguous" : runtimeSourceType,
					allowReturnOutsideFunction: commonjs,
					allowNewTargetOutsideFunction: commonjs
				});
				return commonjs && file.program.sourceType === "script" && file.errors.length > 0 ? parse(source, {
					...options,
					sourceType: "commonjs"
				}) : file;
			} catch (cause) {
				void cause;
				return null;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticTraversal.js
/**
* {@link traverseJavaScriptAst} with a yield every 1,024 visited nodes, so a
* caller can serve control messages during one large traversal. Visit order
* and callbacks are identical.
*/
function* traverseJavaScriptAstSteps(root, visitor) {
	const ancestors = [];
	const enter = (node, parent) => {
		visitor.enter(node, parent, () => [...ancestors]);
		ancestors.push(node);
		return {
			node,
			parent,
			children: childNodes(node),
			nextIndex: 0
		};
	};
	const pending = [enter(root, null)];
	let visited = 1;
	while (pending.length > 0) {
		const current = pending.at(-1);
		if (current === undefined) break;
		const child = current.children[current.nextIndex];
		if (child !== undefined) {
			current.nextIndex += 1;
			if (visited % 1024 === 0) yield;
			visited += 1;
			if (visitor.skip?.(child) === true) continue;
			pending.push(enter(child, current.node));
		} else {
			visitor.exit?.(current.node, current.parent);
			ancestors.pop();
			pending.pop();
		}
	}
}
var traverseJavaScriptAst, completeSemanticSteps, childNodes, javaScriptAstChildKeys;
function init_javascriptSemanticTraversal() {
	return (init_javascriptSemanticTraversal = __esmMin((() => {
		traverseJavaScriptAst = (root, visitor) => completeSemanticSteps(traverseJavaScriptAstSteps(root, visitor));
		completeSemanticSteps = (steps) => {
			for (;;) {
				const step = steps.next();
				if (step.done === true) return step.value;
			}
		};
		childNodes = (node) => {
			const keys = javaScriptAstChildKeys(node);
			const children = [];
			for (const key of keys) {
				const value = Reflect.get(node, key);
				if (t.isNode(value)) {
					children.push(value);
					continue;
				}
				if (!Array.isArray(value)) continue;
				for (const item of value) {
					if (t.isNode(item)) children.push(item);
				}
			}
			return children;
		};
		javaScriptAstChildKeys = (node) => t.VISITOR_KEYS[node.type] ?? [];
	})))();
}

//#endregion
//#region dist/domain/stringPatterns.js
var IDENTIFIER_PATTERN, STABLE_IDENTIFIER_PATTERN, CANONICAL_BASE64_PATTERN;
function init_stringPatterns() {
	return (init_stringPatterns = __esmMin((() => {
		IDENTIFIER_PATTERN = /^[A-Za-z][A-Za-z0-9._\x2d]*$/u;
		STABLE_IDENTIFIER_PATTERN = /^[A-Za-z][A-Za-z0-9._:\x2f\x2d]*$/u;
		CANONICAL_BASE64_PATTERN = /^(?:[A-Za-z0-9+\x2f]{4})*(?:[A-Za-z0-9+\x2f][AQgw]==|[A-Za-z0-9+\x2f]{2}[AEIMQUYcgkosw048]=)?$/;
	})))();
}

//#endregion
//#region dist/domain/artifactGraph.js
var sha256Schema, artifactIdSchema$1, occurrenceIdSchema, edgeIdSchema, manifestIdSchema, extractionIdSchema, contradictionIdSchema, boundedRelativePathSchema, artifactKindSchema, artifactFormatSchema, artifactContentFormatSchema, artifactByteRangeSchema, artifactCommandSchema, artifactNodeSchema, artifactOccurrenceSchema, integrityContradictionSchema, artifactEdgeSchema, artifactGraphManifestSchema, artifactInventoryCoverageSchema, artifactInventoryResultSchema, artifactInventoryOutputSchema, extractedArtifactSchema, artifactExtractionManifestSchema, artifactExtractionResultSchema;
function init_artifactGraph() {
	return (init_artifactGraph = __esmMin((() => {
		init_digests();
		sha256Schema = z.string().regex(/^[a-f0-9]{64}$/u);
		artifactIdSchema$1 = prefixedDigestSchema("art");
		occurrenceIdSchema = prefixedDigestSchema("occ");
		edgeIdSchema = prefixedDigestSchema("edge");
		manifestIdSchema = prefixedDigestSchema("agm");
		extractionIdSchema = prefixedDigestSchema("aex");
		contradictionIdSchema = prefixedDigestSchema("ic");
		boundedRelativePathSchema = z.string().min(1).refine((path) => !path.startsWith("/") && path.split("/").every((part) => part !== "" && part !== ".."), "Expected a normalized relative POSIX path without traversal");
		artifactKindSchema = z.enum([
			"container",
			"executable",
			"dynamic-library",
			"framework",
			"native-addon",
			"javascript",
			"source-map",
			"plist",
			"entitlements",
			"resource",
			"universal-slice",
			"package-metadata",
			"unknown"
		]);
		artifactFormatSchema = z.enum([
			"dmg",
			"zip",
			"pkg",
			"asar",
			"javascript-bundle",
			"source-map",
			"mach-o-universal",
			"mach-o",
			"elf",
			"pe",
			"dos-mz",
			"dos-com",
			"raw-binary",
			"hopper",
			"analysis-database",
			"ipa",
			"apk",
			"msix",
			"appx",
			"hap",
			"hsp",
			"app-pack",
			"plist",
			"entitlements",
			"directory",
			"file",
			"unknown"
		]);
		artifactContentFormatSchema = artifactFormatSchema.extract([
			"zip",
			"mach-o-universal",
			"mach-o",
			"elf",
			"pe",
			"dos-mz",
			"plist",
			"directory",
			"file",
			"unknown"
		]);
		artifactByteRangeSchema = z.object({
			offset: z.number().int().min(0),
			length: z.number().int().min(0)
		});
		artifactCommandSchema = z.object({
			tool: z.string().min(1),
			arguments: z.array(z.string()),
			tool_version: z.string().nullable(),
			executable_sha256: sha256Schema.nullable(),
			exit_code: z.number().int().nullable(),
			effects: z.array(z.enum([
				"read",
				"write",
				"mount"
			]))
		});
		artifactNodeSchema = z.object({
			artifact_id: artifactIdSchema$1,
			format: artifactContentFormatSchema,
			sha256: sha256Schema,
			size: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			media_type: z.string().min(1).nullable(),
			architecture: z.string().min(1).nullable(),
			content_state: z.enum([
				"materialized",
				"embedded",
				"virtual"
			]),
			limitations: z.array(z.string())
		});
		artifactOccurrenceSchema = z.object({
			occurrence_id: occurrenceIdSchema,
			artifact_id: artifactIdSchema$1.nullable(),
			parent_occurrence_id: occurrenceIdSchema.nullable(),
			logical_path: boundedRelativePathSchema,
			entry_kind: z.enum([
				"file",
				"directory",
				"symlink",
				"slice"
			]),
			artifact_kind: artifactKindSchema,
			artifact_format: artifactFormatSchema,
			declared_size: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			compressed_size: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER).nullable(),
			executable: z.boolean(),
			encrypted: z.boolean(),
			hash_status: z.enum([
				"verified",
				"mismatched",
				"not-hashed",
				"unavailable"
			]),
			source_location: artifactByteRangeSchema.nullable(),
			limitations: z.array(z.string())
		});
		integrityContradictionSchema = z.object({
			contradiction_id: contradictionIdSchema,
			occurrence_id: occurrenceIdSchema,
			parent_artifact_id: artifactIdSchema$1,
			logical_path: boundedRelativePathSchema,
			declared_sha256: sha256Schema,
			observed_sha256: sha256Schema,
			entry_kind: z.enum(["file", "slice"]),
			unpacked: z.boolean(),
			trust: z.literal("observed-untrusted"),
			provenance: z.literal("container-integrity-metadata-versus-observed-bytes"),
			limitations: z.array(z.string()).min(1)
		});
		artifactEdgeSchema = z.object({
			edge_id: edgeIdSchema,
			ordinal: z.number().int().min(0),
			parent_artifact_id: artifactIdSchema$1,
			relation: z.enum([
				"contains",
				"extracts",
				"slice-of",
				"embeds",
				"loads",
				"maps-source",
				"derived-from"
			]),
			occurrence_id: occurrenceIdSchema,
			producer: artifactCommandSchema.nullable()
		});
		artifactGraphManifestSchema = z.object({
			manifest_id: manifestIdSchema,
			root_artifact_id: artifactIdSchema$1,
			root_sha256: sha256Schema,
			root_format: artifactFormatSchema,
			graph_sha256: sha256Schema,
			node_count: z.number().int().min(1),
			occurrence_count: z.number().int().min(1),
			edge_count: z.number().int().min(0)
		});
		artifactInventoryCoverageSchema = z.strictObject({
			scope: z.enum(["root", "container-entries"]),
			status: z.enum(["complete", "unknown"])
		});
		artifactInventoryResultSchema = z.object({
			manifest: artifactGraphManifestSchema,
			nodes: z.array(artifactNodeSchema),
			occurrences: z.array(artifactOccurrenceSchema),
			edges: z.array(artifactEdgeSchema),
			provenance: z.array(artifactCommandSchema),
			integrity_contradictions: z.array(integrityContradictionSchema).default([]),
			coverage: artifactInventoryCoverageSchema.optional(),
			limitations: z.array(z.string()),
			/** Optional only for persisted inventory Evidence written before this field. */
			coverage_status: z.enum(["complete", "partial"]).optional()
		});
		artifactInventoryOutputSchema = artifactInventoryResultSchema.safeExtend({
			coverage: artifactInventoryCoverageSchema,
			coverage_status: artifactInventoryResultSchema.shape.coverage_status.unwrap()
		});
		extractedArtifactSchema = z.object({
			artifact_id: artifactIdSchema$1,
			relative_path: boundedRelativePathSchema,
			sha256: sha256Schema,
			bytes_written: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
			created: z.boolean()
		});
		artifactExtractionManifestSchema = z.object({
			extraction_id: extractionIdSchema,
			source_manifest_id: manifestIdSchema,
			selected_occurrence_ids: z.array(occurrenceIdSchema),
			files_sha256: sha256Schema,
			output_root_alias: z.literal("$OUTPUT_ROOT")
		});
		artifactExtractionResultSchema = z.object({
			manifest: artifactGraphManifestSchema,
			extraction_manifest: artifactExtractionManifestSchema,
			output_root: z.string().min(1),
			artifacts: z.array(extractedArtifactSchema),
			containment_verified: z.boolean(),
			cleanup: z.object({
				attempted: z.boolean(),
				verified: z.boolean(),
				residual_paths: z.array(boundedRelativePathSchema)
			}),
			provenance: z.array(artifactCommandSchema),
			integrity_contradictions: z.array(integrityContradictionSchema),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/canonicalOrdering.js
var uniqueSorted$1;
function init_canonicalOrdering() {
	return (init_canonicalOrdering = __esmMin((() => {
		init_unicodeCodePointOrder();
		uniqueSorted$1 = (values) => [...new Set(values)].sort(compareUnicodeCodePoints);
	})))();
}

//#endregion
//#region dist/domain/artifactInspection.js
var textSchema$1, evidenceIdSchema$7, artifactIdSchema, inspectionObservationSchema, inspectionHypothesisSchema, inspectionContradictionSchema, nextProbeSchema, unexploredBranchSchema, artifactInspectionResultSchema, artifactInspectionOutputSchema, createArtifactInspection, parseInventoryEvidence, allObservations, observation, allHypotheses, contradictions, probesFor, DIRECTORY_MEMBER_FORMATS, directoryProbes, probesForFormat, allUnexploredBranches, branch, inspectionCoverage;
function init_artifactInspection() {
	return (init_artifactInspection = __esmMin((() => {
		init_artifactGraph();
		init_canonicalDigest();
		init_canonicalOrdering();
		init_evidence();
		init_jsonValue();
		init_digests();
		textSchema$1 = z.string().min(1);
		evidenceIdSchema$7 = prefixedDigestSchema("ev");
		artifactIdSchema = prefixedDigestSchema("art");
		inspectionObservationSchema = z.strictObject({
			observation_id: prefixedDigestSchema("aio"),
			kind: z.enum(["root-manifest", "integrity"]),
			subject: textSchema$1,
			value: jsonValueSchema,
			evidence_id: evidenceIdSchema$7
		});
		inspectionHypothesisSchema = z.strictObject({
			hypothesis_id: prefixedDigestSchema("aih"),
			statement: textSchema$1,
			confidence: z.enum(["medium", "low"]),
			basis_evidence_ids: z.array(evidenceIdSchema$7).min(1),
			limitation: textSchema$1
		});
		inspectionContradictionSchema = z.strictObject({
			contradiction_id: prefixedDigestSchema("aic"),
			statement: textSchema$1,
			occurrence_id: prefixedDigestSchema("occ"),
			declared_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			observed_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			evidence_id: evidenceIdSchema$7
		});
		nextProbeSchema = z.strictObject({
			operation: textSchema$1,
			rationale: textSchema$1,
			authority: z.enum([
				"artifact-bytes",
				"managed-static-analysis",
				"native-analysis-provider",
				"ast-static-analysis"
			])
		});
		unexploredBranchSchema = z.strictObject({
			branch_id: prefixedDigestSchema("aib"),
			reason: z.enum(["format-specific-analysis-required", "unknown-format"]),
			detail: textSchema$1,
			next_probe: nextProbeSchema.nullable(),
			evidence_id: evidenceIdSchema$7
		});
		artifactInspectionResultSchema = z.strictObject({
			inspection_id: prefixedDigestSchema("ai"),
			subject: z.strictObject({
				manifest_id: prefixedDigestSchema("agm"),
				root_artifact_id: artifactIdSchema,
				root_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				root_format: textSchema$1
			}),
			substeps: z.array(z.strictObject({
				substep_id: prefixedDigestSchema("ais"),
				operation: z.literal("inventory_artifact"),
				status: z.literal("completed"),
				evidence_id: evidenceIdSchema$7,
				evidence: evidenceSchema
			})).min(1),
			observations: z.array(inspectionObservationSchema),
			hypotheses: z.array(inspectionHypothesisSchema),
			contradictions: z.array(inspectionContradictionSchema),
			unexplored_branches: z.array(unexploredBranchSchema),
			next_probes: z.array(nextProbeSchema),
			coverage: z.strictObject({
				status: z.enum([
					"complete-within-substeps",
					"partial",
					"truncated"
				]),
				substeps_completed: z.literal(1),
				observations_retained: z.number().int().min(0),
				observations_omitted: z.number().int().min(0),
				hypotheses_retained: z.number().int().min(0),
				hypotheses_omitted: z.number().int().min(0),
				unexplored_branches_retained: z.number().int().min(0),
				unexplored_branches_omitted: z.number().int().min(0),
				next_probes_retained: z.number().int().min(0),
				next_probes_omitted: z.number().int().min(0)
			}),
			evidence_links: z.array(evidenceIdSchema$7).min(1),
			limitations: z.array(textSchema$1)
		});
		artifactInspectionOutputSchema = artifactInspectionResultSchema.safeExtend({ substeps: z.array(artifactInspectionResultSchema.shape.substeps.element.safeExtend({ evidence: evidenceSchema.safeExtend({ normalized_result: artifactInventoryOutputSchema }) })).min(1) });
		createArtifactInspection = (inventoryInput) => {
			const inventoryEvidence = parseInventoryEvidence(inventoryInput);
			const inventory = artifactInventoryResultSchema.parse(inventoryEvidence.normalized_result);
			const observations = allObservations(inventory, inventoryEvidence.evidence_id);
			const hypotheses = allHypotheses(inventory, inventoryEvidence.evidence_id);
			const nextProbes = probesFor(inventory);
			const branches = allUnexploredBranches(inventory, inventoryEvidence.evidence_id, nextProbes);
			const retained = {
				observations,
				hypotheses,
				branches,
				probes: nextProbes
			};
			const omissions = {
				observations: 0,
				hypotheses: 0,
				branches: 0,
				probes: 0
			};
			const semantic = {
				subject: {
					manifest_id: inventory.manifest.manifest_id,
					root_artifact_id: inventory.manifest.root_artifact_id,
					root_sha256: inventory.manifest.root_sha256,
					root_format: inventory.manifest.root_format
				},
				substeps: [{
					substep_id: `ais_${digestCanonicalValue({
						operation: "inventory_artifact",
						evidence_id: inventoryEvidence.evidence_id
					}, "Artifact inspection")}`,
					operation: "inventory_artifact",
					status: "completed",
					evidence_id: inventoryEvidence.evidence_id,
					evidence: inventoryEvidence
				}],
				observations: retained.observations,
				hypotheses: retained.hypotheses,
				contradictions: contradictions(inventory, inventoryEvidence.evidence_id),
				unexplored_branches: retained.branches,
				next_probes: retained.probes,
				coverage: {
					status: inspectionCoverage(inventory, omissions),
					substeps_completed: 1,
					observations_retained: retained.observations.length,
					observations_omitted: omissions.observations,
					hypotheses_retained: retained.hypotheses.length,
					hypotheses_omitted: omissions.hypotheses,
					unexplored_branches_retained: retained.branches.length,
					unexplored_branches_omitted: omissions.branches,
					next_probes_retained: retained.probes.length,
					next_probes_omitted: omissions.probes
				},
				evidence_links: [inventoryEvidence.evidence_id],
				limitations: uniqueSorted$1([...inventory.limitations, "Inspection derives bounded static hypotheses and next probes; it does not execute the artifact or claim format-specific semantics."])
			};
			return artifactInspectionResultSchema.parse({
				...semantic,
				inspection_id: `ai_${digestCanonicalValue(semantic, "Artifact inspection")}`
			});
		};
		parseInventoryEvidence = (input) => {
			const evidence = parseEvidence(input);
			if (evidence.operation !== "inventory_artifact") throw new TypeError("Artifact inspection substep requires inventory_artifact Evidence");
			return evidence;
		};
		allObservations = (inventory, evidenceId) => [observation("root-manifest", inventory.manifest.root_artifact_id, inventory.manifest, evidenceId), ...inventory.integrity_contradictions.map((value) => observation("integrity", value.contradiction_id, value, evidenceId))];
		observation = (kind, subject, value, evidenceId) => {
			const semantic = {
				kind,
				subject,
				value: jsonValueSchema.parse(value),
				evidence_id: evidenceId
			};
			return {
				observation_id: `aio_${digestCanonicalValue(semantic, "Artifact inspection")}`,
				...semantic
			};
		};
		allHypotheses = (inventory, evidenceId) => {
			const statements = inventory.manifest.root_format === "pe" ? ["The PE artifact may contain managed CLI metadata or native code; inventory bytes alone do not distinguish them."] : ["asar", "javascript-bundle"].includes(inventory.manifest.root_format) ? ["The artifact may contain a recoverable JavaScript application graph."] : [];
			return statements.map((statement) => {
				const semantic = {
					statement,
					confidence: "low",
					basis_evidence_ids: [evidenceId],
					limitation: "Format classification proposes a bounded follow-up; it is not semantic proof."
				};
				return {
					hypothesis_id: `aih_${digestCanonicalValue(semantic, "Artifact inspection")}`,
					...semantic
				};
			});
		};
		contradictions = (inventory, evidenceId) => inventory.integrity_contradictions.map((value) => {
			const semantic = {
				statement: `Declared integrity for ${value.logical_path} contradicts observed bytes.`,
				occurrence_id: value.occurrence_id,
				declared_sha256: value.declared_sha256,
				observed_sha256: value.observed_sha256,
				evidence_id: evidenceId
			};
			return {
				contradiction_id: `aic_${digestCanonicalValue(semantic, "Artifact inspection")}`,
				...semantic
			};
		});
		probesFor = (inventory) => {
			const format = inventory.manifest.root_format;
			return format === "directory" ? directoryProbes(inventory) : probesForFormat(format);
		};
		DIRECTORY_MEMBER_FORMATS = [
			"asar",
			"javascript-bundle",
			"mach-o-universal",
			"mach-o",
			"elf",
			"pe",
			"plist"
		];
		directoryProbes = (inventory) => {
			const present = new Set(inventory.occurrences.filter(({ entry_kind, artifact_format }) => entry_kind !== "symlink" || artifact_format !== "javascript-bundle").map(({ artifact_format }) => artifact_format));
			const members = DIRECTORY_MEMBER_FORMATS.filter((memberFormat) => present.has(memberFormat));
			const probes = members.flatMap(probesForFormat);
			return probes.filter((probe, index) => probes.findIndex(({ operation }) => operation === probe.operation) === index);
		};
		probesForFormat = (format) => {
			if (["asar", "javascript-bundle"].includes(format)) return [{
				operation: "analyze_javascript_application",
				rationale: "Recover bounded JavaScript modules, source maps, Electron boundaries, and application relationships.",
				authority: "ast-static-analysis"
			}];
			if (format === "pe") return [{
				operation: "inspect_managed_artifact",
				rationale: "Check execution-free CLI metadata before choosing a deep native provider.",
				authority: "managed-static-analysis"
			}, {
				operation: "open_binary",
				rationale: "Open as native code only when managed inspection reports a native or mixed boundary.",
				authority: "native-analysis-provider"
			}];
			if ([
				"mach-o",
				"mach-o-universal",
				"elf"
			].includes(format)) return [{
				operation: "open_binary",
				rationale: "Bind one deep native provider before function-level analysis.",
				authority: "native-analysis-provider"
			}];
			if (format === "plist") return [{
				operation: "inspect_plist",
				rationale: "Parse property-list values without executing the artifact.",
				authority: "artifact-bytes"
			}];
			return [];
		};
		allUnexploredBranches = (inventory, evidenceId, nextProbes) => {
			const branches = [];
			branches.push(...nextProbes.map((probe) => branch("format-specific-analysis-required", `${probe.operation} was not run by provider-neutral artifact inspection.`, probe, evidenceId)));
			if (inventory.manifest.root_format === "unknown") branches.push(branch("unknown-format", "Artifact bytes did not match an admitted format classifier.", null, evidenceId));
			return branches;
		};
		branch = (reason, detail, nextProbe, evidenceId) => {
			const semantic = {
				reason,
				detail,
				next_probe: nextProbe,
				evidence_id: evidenceId
			};
			return {
				branch_id: `aib_${digestCanonicalValue(semantic, "Artifact inspection")}`,
				...semantic
			};
		};
		inspectionCoverage = (_inventory, omissions) => {
			if (Object.values(omissions).some((count) => count > 0)) return "truncated";
			return "complete-within-substeps";
		};
	})))();
}

//#endregion
//#region dist/domain/comparisonSemantics.js
var absenceClaimable, canonicalJson$1;
function init_comparisonSemantics() {
	return (init_comparisonSemantics = __esmMin((() => {
		absenceClaimable = (coverage) => coverage.status === "complete" && coverage.truncated !== true && (coverage.omitted_count === undefined || coverage.omitted_count === 0);
		canonicalJson$1 = (value, context = "Comparison") => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError(`${context} could not canonicalize data`);
			return encoded;
		};
	})))();
}

//#endregion
//#region dist/domain/recordedTransportUrl.js
var parseRecordedTransportUrl, parseUrlQueryParameterNames;
function init_recordedTransportUrl() {
	return (init_recordedTransportUrl = __esmMin((() => {
		parseRecordedTransportUrl = (value, options = {}) => {
			const prefix = /^[\x00-\x20]*(?:([A-Za-z][A-Za-z0-9+.-]*):)?\/\//u.exec(value);
			const absolute = URL.parse(value);
			const parsed = absolute ?? URL.parse(value, "https://rea.invalid");
			const hasCredentials = parsed !== null && (parsed.username !== "" || parsed.password !== "");
			const origin = absolute !== null && absolute.origin !== "null" ? absolute.origin : null;
			if (prefix === null) return {
				origin,
				path: null,
				credentials: hasCredentials ? "ambiguous" : null
			};
			const authorityStart = prefix[0].length;
			const protocol = parsed?.protocol ?? `${prefix[1]?.toLowerCase() ?? "https"}:`;
			const special = [
				"ftp:",
				"file:",
				"http:",
				"https:",
				"ws:",
				"wss:"
			].includes(protocol);
			let authorityEnd = authorityStart;
			while (authorityEnd < value.length && !"/?#".includes(value[authorityEnd]) && !(special && value[authorityEnd] === "\\")) authorityEnd += 1;
			const authority = value.slice(authorityStart, authorityEnd);
			const stableAuthority = authority.length > 0 && !/[\t\n\r]/u.test(authority);
			const at = authority.lastIndexOf("@");
			const credentials = !stableAuthority && hasCredentials ? "ambiguous" : at >= 0 ? {
				start: authorityStart,
				end: authorityStart + at + 1
			} : hasCredentials ? "ambiguous" : null;
			if (origin === null || !/^[A-Za-z][A-Za-z0-9+.-]*:\/\//u.test(value) || !stableAuthority || special && value[authorityEnd] === "\\") return {
				origin,
				path: null,
				credentials
			};
			const query = options.includeQuery === true ? { query: absolute.search } : {};
			if (value[authorityEnd] !== "/") return {
				origin,
				path: "/",
				credentials,
				...query
			};
			let pathEnd = authorityEnd;
			while (pathEnd < value.length && !"?#".includes(value[pathEnd])) pathEnd += 1;
			return {
				origin,
				path: value.slice(authorityEnd, pathEnd),
				credentials,
				...query
			};
		};
		parseUrlQueryParameterNames = (query) => new URLSearchParams(query).keys();
	})))();
}

//#endregion
//#region dist/domain/artifactIdentity.js
var logicalPathNfc, normalizeJoinedLogicalPath, logicalPathEscapesRoot, artifactIdForContent, occurrenceIdForLocation, artifactGraphDigest, artifactManifestId, artifactContradictionId, artifactEdgeId;
function init_artifactIdentity() {
	return (init_artifactIdentity = __esmMin((() => {
		init_canonicalDigest();
		logicalPathNfc = (value) => value.normalize("NFC");
		normalizeJoinedLogicalPath = (value) => {
			if (value.includes("\0")) return value;
			return logicalPathNfc(posix.normalize(value).replace(/^\.\//u, ""));
		};
		logicalPathEscapesRoot = (path) => path.includes("\0") || path === ".." || path.startsWith("../") || path.startsWith("/");
		artifactIdForContent = (sha256) => `art_${digestCanonicalValue({ sha256 }, "Artifact")}`;
		occurrenceIdForLocation = (input) => input.logicalPath === "." ? `occ_${digestCanonicalValue({ root: input.rootArtifactId }, "Artifact")}` : `occ_${digestCanonicalValue({
			root_artifact_id: input.rootArtifactId,
			logical_path: input.logicalPath,
			entry_kind: input.entryKind,
			...input.duplicateOrdinal === undefined ? {} : { duplicate_ordinal: input.duplicateOrdinal }
		}, "Artifact")}`;
		artifactGraphDigest = (input) => digestCanonicalValue({
			nodes: input.nodes,
			occurrences: input.occurrences,
			edges: input.edges,
			integrity_contradictions: input.contradictions
		}, "Artifact");
		artifactManifestId = (rootArtifactId, graphSha256) => `agm_${digestCanonicalValue({
			root_artifact_id: rootArtifactId,
			graph_sha256: graphSha256
		}, "Artifact")}`;
		artifactContradictionId = (input) => `ic_${digestCanonicalValue({
			root_artifact_id: input.rootArtifactId,
			logical_path: input.logicalPath,
			declared_sha256: input.declaredSha256,
			observed_sha256: input.observedSha256
		}, "Artifact")}`;
		artifactEdgeId = (edge, occurrence) => `edge_${digestCanonicalValue({
			parent_artifact_id: edge.parent_artifact_id,
			child_artifact_id: occurrence.artifact_id,
			relation: edge.relation,
			occurrence_id: edge.occurrence_id,
			logical_path: occurrence.logical_path
		}, "Artifact")}`;
	})))();
}

//#endregion
//#region dist/domain/artifactInventoryEvidence.js
var hasCompleteInventoryCoverage, parseArtifactInventoryEvidence, parseArtifactInventoryResult, validateArtifactInventorySubject, validateInventoryPage, assembleInventoryResults, orderedInventory, orderOccurrences, resolveInventoryCoverage, legacyInventoryCoverage, validateCompleteInventory, validateOccurrence, validateEdge, mergeExact, assertUnique$1;
function init_artifactInventoryEvidence() {
	return (init_artifactInventoryEvidence = __esmMin((() => {
		init_artifactGraph();
		init_unicodeCodePointOrder();
		init_comparisonSemantics();
		init_artifactIdentity();
		init_evidence();
		init_artifactInspection();
		init_zipPackageFormat();
		hasCompleteInventoryCoverage = (inventory, requiredScope) => inventory.complete && inventory.coverage.scope === requiredScope && inventory.coverage.status === "complete";
		parseArtifactInventoryEvidence = (input) => {
			const pages = (Array.isArray(input) ? input : [input]).map((value) => {
				const evidence = parseEvidence(value);
				const inventoryEvidence = evidence.operation === "inventory_artifact" ? evidence : evidence.operation === "inspect_artifact" ? artifactInspectionResultSchema.parse(evidence.normalized_result).substeps[0]?.evidence : undefined;
				if (inventoryEvidence === undefined) throw new TypeError("Artifact comparison requires inspect_artifact Evidence");
				const inventory = artifactInventoryResultSchema.parse(inventoryEvidence.normalized_result);
				validateArtifactInventorySubject(inventoryEvidence.subject, inventory.manifest);
				validateInventoryPage(inventory);
				return {
					evidence,
					inventory
				};
			});
			return {
				evidence: pages.map(({ evidence }) => evidence),
				inventory: assembleInventoryResults(pages.map(({ inventory }) => inventory))
			};
		};
		parseArtifactInventoryResult = (input, subject) => {
			const inventory = artifactInventoryResultSchema.parse(input);
			validateArtifactInventorySubject(subject, inventory.manifest);
			validateInventoryPage(inventory);
			return assembleInventoryResults([inventory]);
		};
		validateArtifactInventorySubject = (subject, manifest) => {
			if (subject === null || subject.digest.sha256 !== manifest.root_sha256 || subject.format !== manifest.root_format) throw new TypeError("Artifact inventory Evidence subject does not match its root digest");
		};
		validateInventoryPage = (inventory) => {
			assertUnique$1(inventory.nodes.map(({ artifact_id: id }) => id), "node ID");
			assertUnique$1(inventory.occurrences.map(({ occurrence_id: id }) => id), "occurrence ID");
			assertUnique$1(inventory.edges.map(({ edge_id: id }) => id), "edge ID");
			for (const node of inventory.nodes) if (node.artifact_id !== artifactIdForContent(node.sha256)) throw new TypeError("Artifact node ID is not content-addressed");
		};
		assembleInventoryResults = (pages) => {
			const first = pages[0];
			if (first === undefined) throw new TypeError("Artifact inventory requires Evidence pages");
			const manifestJson = canonicalJson$1(first.manifest, "Artifact inventory");
			const coverageJson = canonicalJson$1({
				coverage: first.coverage ?? null,
				coverage_status: first.coverage_status ?? null
			}, "Artifact inventory coverage");
			const nodes = new Map();
			const occurrences = new Map();
			const edges = new Map();
			for (const page of pages) {
				if (canonicalJson$1(page.manifest, "Artifact inventory") !== manifestJson) throw new TypeError("Artifact inventory pages do not share one manifest");
				if (canonicalJson$1({
					coverage: page.coverage ?? null,
					coverage_status: page.coverage_status ?? null
				}, "Artifact inventory coverage") !== coverageJson) throw new TypeError("Artifact inventory pages do not share one coverage declaration");
				if (canonicalJson$1(page.integrity_contradictions, "Artifact inventory") !== canonicalJson$1(first.integrity_contradictions, "Artifact inventory")) throw new TypeError("Artifact inventory pages do not share integrity contradictions");
				for (const node of page.nodes) mergeExact(nodes, node.artifact_id, node, "node");
				for (const occurrence of page.occurrences) {
					mergeExact(occurrences, occurrence.occurrence_id, occurrence, "occurrence");
				}
				for (const edge of page.edges) mergeExact(edges, edge.edge_id, edge, "edge");
			}
			const inventory = orderedInventory(first, pages, {
				nodes,
				occurrences,
				edges
			});
			if (inventory.complete) validateCompleteInventory(inventory);
			return inventory;
		};
		orderedInventory = (first, pages, values) => {
			const nodes = [...values.nodes.values()].sort((left, right) => compareUnicodeCodePoints(left.artifact_id, right.artifact_id));
			const occurrences = orderOccurrences(first.manifest.root_artifact_id, [...values.occurrences.values()]);
			const edges = [...values.edges.values()].sort((left, right) => compareUnicodeCodePoints(left.edge_id, right.edge_id));
			const limitations = [...new Set(pages.flatMap((inventory) => inventory.limitations))].sort(compareUnicodeCodePoints);
			return {
				manifest: first.manifest,
				nodes,
				occurrences,
				edges,
				integrityContradictions: first.integrity_contradictions,
				limitations,
				coverage: resolveInventoryCoverage({
					...first,
					limitations
				}),
				complete: nodes.length === first.manifest.node_count && occurrences.length === first.manifest.occurrence_count && edges.length === first.manifest.edge_count
			};
		};
		orderOccurrences = (rootArtifactId, occurrences) => {
			const groups = new Map();
			for (const occurrence of occurrences) {
				const group = groups.get(occurrence.logical_path);
				if (group === undefined) groups.set(occurrence.logical_path, [occurrence]);
				else group.push(occurrence);
			}
			return [...groups].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).flatMap(([path, group]) => {
				if (group.length < 2) return group;
				const ordinalById = new Map();
				const first = group[0];
				if (first === undefined) throw new TypeError("Duplicate occurrence group is empty");
				for (let ordinal = 0; ordinal < group.length; ordinal++) {
					ordinalById.set(occurrenceIdForLocation({
						rootArtifactId,
						logicalPath: path,
						entryKind: first.entry_kind,
						...ordinal === 0 ? {} : { duplicateOrdinal: ordinal }
					}), ordinal);
				}
				return group.sort((left, right) => (ordinalById.get(left.occurrence_id) ?? Number.MAX_SAFE_INTEGER) - (ordinalById.get(right.occurrence_id) ?? Number.MAX_SAFE_INTEGER) || compareUnicodeCodePoints(left.occurrence_id, right.occurrence_id));
			});
		};
		resolveInventoryCoverage = (inventory) => {
			const legacy = legacyInventoryCoverage(inventory.manifest.root_format, inventory.limitations, inventory.integrity_contradictions.length);
			if (inventory.coverage !== undefined) {
				if (inventory.coverage_status !== undefined && inventory.coverage.status === "complete" !== (inventory.coverage_status === "complete")) throw new TypeError("Artifact inventory has conflicting coverage declarations");
				return inventory.coverage;
			}
			return inventory.coverage_status === undefined ? legacy : {
				...legacy,
				status: inventory.coverage_status === "complete" ? "complete" : "unknown"
			};
		};
		legacyInventoryCoverage = (format, limitations, contradictionCount) => ({
			scope: isZipPackageFormat(format) || [
				"directory",
				"asar",
				"dmg",
				"pkg",
				"mach-o-universal"
			].includes(format) ? "container-entries" : "root",
			status: limitations.some((limitation) => limitation !== "Artifact has no child container entries." && !isZipInventoryScopeLimitation(limitation) && !(contradictionCount > 0 && limitation === `${String(contradictionCount)} integrity contradiction(s) were recorded; mismatched content is observed-untrusted.`)) ? "unknown" : "complete"
		});
		validateCompleteInventory = (inventory) => {
			const nodeIds = new Set(inventory.nodes.map(({ artifact_id: id }) => id));
			const occurrenceIds = new Set(inventory.occurrences.map(({ occurrence_id: id }) => id));
			const rootNode = inventory.nodes.find(({ artifact_id: id }) => id === inventory.manifest.root_artifact_id);
			if (rootNode?.sha256 !== inventory.manifest.root_sha256) throw new TypeError("Artifact root node does not match its manifest digest");
			const rootOccurrence = inventory.occurrences.find(({ logical_path }) => logical_path === ".");
			if (rootOccurrence?.artifact_id !== inventory.manifest.root_artifact_id || rootOccurrence.artifact_format !== inventory.manifest.root_format) throw new TypeError("Artifact root occurrence does not match its manifest representation");
			const duplicateOrdinalByPath = new Map();
			for (const occurrence of inventory.occurrences) {
				const ordinal = duplicateOrdinalByPath.get(occurrence.logical_path) ?? 0;
				duplicateOrdinalByPath.set(occurrence.logical_path, ordinal + 1);
				validateOccurrence(occurrence, inventory, nodeIds, occurrenceIds, ordinal);
			}
			const occurrencesById = new Map(inventory.occurrences.map((occurrence) => [occurrence.occurrence_id, occurrence]));
			for (const edge of inventory.edges) validateEdge(edge, nodeIds, occurrencesById);
			for (const contradiction of inventory.integrityContradictions) {
				if (!nodeIds.has(contradiction.parent_artifact_id) || !occurrenceIds.has(contradiction.occurrence_id)) throw new TypeError("Integrity contradiction references a missing graph member");
				const expectedId = artifactContradictionId({
					rootArtifactId: inventory.manifest.root_artifact_id,
					logicalPath: contradiction.logical_path,
					declaredSha256: contradiction.declared_sha256,
					observedSha256: contradiction.observed_sha256
				});
				if (contradiction.contradiction_id !== expectedId) throw new TypeError("Integrity contradiction ID does not match its identity");
			}
			const graphSha256 = artifactGraphDigest({
				nodes: inventory.nodes,
				occurrences: inventory.occurrences,
				edges: inventory.edges,
				contradictions: inventory.integrityContradictions
			});
			if (graphSha256 !== inventory.manifest.graph_sha256) throw new TypeError("Artifact graph commitment does not match its members");
			const manifestId = artifactManifestId(inventory.manifest.root_artifact_id, graphSha256);
			if (manifestId !== inventory.manifest.manifest_id) throw new TypeError("Artifact manifest ID does not match its commitment");
		};
		validateOccurrence = (occurrence, inventory, nodeIds, occurrenceIds, duplicateOrdinal) => {
			if (occurrence.artifact_id !== null && !nodeIds.has(occurrence.artifact_id)) throw new TypeError("Artifact occurrence references a missing node");
			if (occurrence.parent_occurrence_id !== null && !occurrenceIds.has(occurrence.parent_occurrence_id)) throw new TypeError("Artifact occurrence references a missing parent");
			const expectedId = occurrenceIdForLocation({
				rootArtifactId: inventory.manifest.root_artifact_id,
				logicalPath: occurrence.logical_path,
				entryKind: occurrence.entry_kind,
				...duplicateOrdinal === 0 ? {} : { duplicateOrdinal }
			});
			if (occurrence.occurrence_id !== expectedId) throw new TypeError("Artifact occurrence ID does not match its identity");
		};
		validateEdge = (edge, nodeIds, occurrences) => {
			const occurrence = occurrences.get(edge.occurrence_id);
			if (!nodeIds.has(edge.parent_artifact_id) || occurrence?.artifact_id === null || occurrence === undefined || !nodeIds.has(occurrence.artifact_id)) throw new TypeError("Artifact edge references a missing graph member");
			if (edge.edge_id !== artifactEdgeId(edge, occurrence)) throw new TypeError("Artifact edge ID does not match its identity");
		};
		mergeExact = (output, key, value, label) => {
			const previous = output.get(key);
			if (previous !== undefined && canonicalJson$1(previous, "Artifact inventory") !== canonicalJson$1(value, "Artifact inventory")) throw new TypeError(`Artifact inventory has conflicting ${label} pages`);
			output.set(key, value);
		};
		assertUnique$1 = (values, label) => {
			if (new Set(values).size !== values.length) throw new TypeError(`Artifact inventory contains a duplicate ${label}`);
		};
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
//#region dist/config/mcpInputSchemaProfile.js
var COMPACT_INPUT_SCHEMA_BUDGET_BYTES, mcpInputSchemaProfileSchema, compactPresentationForMcpInputSchemaProfile, profileConstraint, parseMcpInputSchemaProfile;
function init_mcpInputSchemaProfile() {
	return (init_mcpInputSchemaProfile = __esmMin((() => {
		init_configurationErrors();
		init_result();
		COMPACT_INPUT_SCHEMA_BUDGET_BYTES = 13 * 1024;
		mcpInputSchemaProfileSchema = z.enum(["full", "compact"]);
		compactPresentationForMcpInputSchemaProfile = (profile) => profile === "compact" ? { budgetBytes: COMPACT_INPUT_SCHEMA_BUDGET_BYTES } : undefined;
		profileConstraint = "REA_MCP_INPUT_SCHEMA_PROFILE must be \"full\" (default) or \"compact\". The compact profile advertises input schemas without nested annotation prose for providers that cap each tool schema's serialized size.";
		parseMcpInputSchemaProfile = (value) => {
			if (value === undefined) return ok(undefined);
			const parsed = mcpInputSchemaProfileSchema.safeParse(value);
			return parsed.success ? ok(parsed.data) : err(new ConfigurationError(profileConstraint, { settings: [{
				setting: "REA_MCP_INPUT_SCHEMA_PROFILE",
				constraint: profileConstraint
			}] }));
		};
	})))();
}

//#endregion
//#region dist/domain/functionComparisonResults.js
var dimensionResult, unresolvedDimension, overallStatus, summarize, digest$3;
function init_functionComparisonResults() {
	return (init_functionComparisonResults = __esmMin((() => {
		init_canonicalDigest();
		dimensionResult = (input) => {
			const context = {
				dimension: input.dimension,
				left_digest: digest$3(input.left),
				right_digest: digest$3(input.right),
				left_count: input.leftCount,
				right_count: input.rightCount,
				text_delta: input.textDelta,
				evidence_links: [...input.links],
				limitations: [...input.limitations]
			};
			if (input.status === "unchanged") return {
				...context,
				status: "unchanged",
				conclusion_kind: "derived_relationship"
			};
			return {
				...context,
				status: "changed",
				conclusion_kind: input.providersDiffer ? "contradiction" : "derived_relationship"
			};
		};
		unresolvedDimension = (input) => ({
			dimension: input.dimension,
			status: "unknown",
			left_digest: null,
			right_digest: null,
			left_count: input.leftCount,
			right_count: input.rightCount,
			text_delta: null,
			conclusion_kind: "unresolved_branch",
			evidence_links: [...input.links],
			limitations: [...input.limitations]
		});
		overallStatus = (dimensions, match) => {
			if (match === "mismatched") return "changed";
			if (match === "ambiguous") return "unknown";
			if (dimensions.some(({ status }) => status === "changed")) return "changed";
			if (dimensions.some(({ status }) => status === "unknown")) return "unknown";
			return "unchanged";
		};
		summarize = (dimensions) => ({
			unchanged: dimensions.filter(({ status }) => status === "unchanged").length,
			changed: dimensions.filter(({ status }) => status === "changed").length,
			unknown: dimensions.filter(({ status }) => status === "unknown").length
		});
		digest$3 = (value) => digestCanonicalValue(value, "Function comparison");
	})))();
}

//#endregion
//#region dist/domain/functionComparisonSchemas.js
var comparisonStatusSchema, functionComparisonDimensionNameSchema, evidenceIdSchema$6, functionComparisonInputSchema, textDeltaSchema, functionDimensionContextShape, functionDimensionSchema, functionMatchSchema, functionComparisonResultSchema;
function init_functionComparisonSchemas() {
	return (init_functionComparisonSchemas = __esmMin((() => {
		init_functionComparisonResults();
		init_evidence();
		init_digests();
		comparisonStatusSchema = z.enum([
			"unchanged",
			"changed",
			"unknown"
		]);
		functionComparisonDimensionNameSchema = z.enum([
			"identity",
			"pseudocode",
			"assembly",
			"comments",
			"calls",
			"references",
			"strings_names",
			"cfg"
		]);
		evidenceIdSchema$6 = prefixedDigestSchema("ev");
		functionComparisonInputSchema = z.strictObject({
			left: evidenceSchema,
			right: evidenceSchema
		});
		textDeltaSchema = z.object({
			added_lines: z.number().int().min(0),
			removed_lines: z.number().int().min(0),
			hunks: z.number().int().min(0)
		});
		functionDimensionContextShape = {
			dimension: functionComparisonDimensionNameSchema,
			left_count: z.number().int().min(0).nullable(),
			right_count: z.number().int().min(0).nullable(),
			evidence_links: z.array(evidenceIdSchema$6).min(2),
			limitations: z.array(z.string())
		};
		functionDimensionSchema = z.union([
			z.object({
				...functionDimensionContextShape,
				status: z.literal("unchanged"),
				left_digest: digestSchema,
				right_digest: digestSchema,
				text_delta: textDeltaSchema.nullable(),
				conclusion_kind: z.literal("derived_relationship")
			}),
			z.object({
				...functionDimensionContextShape,
				status: z.literal("changed"),
				left_digest: digestSchema,
				right_digest: digestSchema,
				text_delta: textDeltaSchema.nullable(),
				conclusion_kind: z.enum(["derived_relationship", "contradiction"])
			}),
			z.object({
				...functionDimensionContextShape,
				status: z.literal("unknown"),
				left_digest: z.null(),
				right_digest: z.null(),
				text_delta: z.null(),
				conclusion_kind: z.literal("unresolved_branch")
			})
		]);
		functionMatchSchema = z.union([z.object({
			status: z.literal("matched"),
			method: z.literal("symbol"),
			left_name: z.string(),
			right_name: z.string()
		}), z.object({
			status: z.enum(["mismatched", "ambiguous"]),
			method: z.literal("explicit"),
			left_name: z.string(),
			right_name: z.string()
		})]);
		functionComparisonResultSchema = z.object({
			status: comparisonStatusSchema,
			function_match: functionMatchSchema,
			left_subject_sha256: digestSchema,
			right_subject_sha256: digestSchema,
			summary: z.object({
				unchanged: z.number().int().min(0),
				changed: z.number().int().min(0),
				unknown: z.number().int().min(0)
			}),
			dimensions: z.array(functionDimensionSchema).length(8),
			changes: z.array(functionDimensionSchema),
			limitations: z.array(z.string())
		}).superRefine((result, context) => {
			if (result.status !== overallStatus(result.dimensions, result.function_match.status)) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Function comparison status contradicts its dimensions or function match."
			});
		});
	})))();
}

//#endregion
//#region dist/domain/residualUnknown.js
var evidenceIdSchema$5, unknownIdSchema, text, environmentRequirementSchema, stableUnknownId, probeSchema, comparisonConclusionScopeSchema, relationshipSchema, resolutionSchema, residualUnknownObjectSchema, refineRevision, residualUnknownValidatedSchema, residualUnknownSchema, generatedRevisionSchema, recordUnknownInputSchema, updateUnknownInputSchema, createResidualUnknown, updateResidualUnknown, createRevision, projectRevisionDetails, computeRevisionDigest, canonicalJson, sortedUnique$1, sameOrderedValues, sortedRelationships;
function init_residualUnknown() {
	return (init_residualUnknown = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_digests();
		init_functionComparisonSchemas();
		evidenceIdSchema$5 = prefixedDigestSchema("ev");
		unknownIdSchema = prefixedDigestSchema("unk");
		text = z.string().trim().min(1);
		environmentRequirementSchema = z.strictObject({
			id: z.string().min(1).nullable(),
			platform: z.string().min(1).nullable(),
			architecture: z.string().min(1).nullable(),
			isolation: z.enum([
				"none",
				"process",
				"container",
				"virtual-machine"
			]).nullable()
		});
		stableUnknownId = (question, domain, scopeDigest, comparisonConclusionScope) => `unk_${createHash("sha256").update(canonicalJson({
			domain: domain.trim(),
			question: question.replace(/\s+/gu, " ").trim(),
			scope_digest: scopeDigest,
			...comparisonConclusionScope === undefined ? {} : { comparison_conclusion_scope: comparisonConclusionScope }
		})).digest("hex")}`;
		probeSchema = z.strictObject({
			operation: z.string().min(1),
			rationale: text
		});
		comparisonConclusionScopeSchema = z.object({
			comparison_evidence_id: evidenceIdSchema$5,
			dimensions: z.array(z.union([z.literal("overall"), functionComparisonDimensionNameSchema])).min(1)
		}).strict().superRefine(({ dimensions }, context) => {
			if (!sameOrderedValues(dimensions, sortedUnique$1(dimensions))) context.addIssue({
				code: "custom",
				message: "Comparison dimensions must be sorted and unique"
			});
		});
		relationshipSchema = z.strictObject({
			type: z.enum([
				"depends-on",
				"related-to",
				"contradicts"
			]),
			unknown_id: unknownIdSchema
		});
		resolutionSchema = z.discriminatedUnion("disposition", [z.strictObject({
			disposition: z.literal("verified"),
			rationale: text,
			evidence_ids: z.array(evidenceIdSchema$5).min(1)
		}), z.strictObject({
			disposition: z.enum(["withdrawn", "out-of-scope"]),
			rationale: text,
			evidence_ids: z.array(evidenceIdSchema$5)
		})]);
		residualUnknownObjectSchema = z.strictObject({
			unknown_id: unknownIdSchema,
			revision: z.number().int().min(1),
			previous_revision_digest: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			revision_digest: z.string().regex(/^[a-f0-9]{64}$/u),
			scope_digest: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			question: text,
			status: z.enum([
				"open",
				"investigating",
				"blocked",
				"contradicted",
				"resolved"
			]),
			severity: z.enum([
				"low",
				"medium",
				"high",
				"critical"
			]),
			domain: text,
			comparison_conclusion_scope: comparisonConclusionScopeSchema.exactOptional(),
			supporting_evidence_ids: z.array(evidenceIdSchema$5),
			contradicting_evidence_ids: z.array(evidenceIdSchema$5),
			required_authority: z.enum([
				"shipped-artifact",
				"controlled-replay",
				"historical-reference",
				"external-service",
				"analyst-inference"
			]).nullable(),
			required_confidence: z.enum([
				"observed",
				"derived",
				"inferred"
			]),
			required_environment: environmentRequirementSchema.nullable(),
			recommended_probes: z.array(probeSchema),
			relationships: z.array(relationshipSchema),
			resolution: resolutionSchema.nullable(),
			mutation_evidence_ids: z.array(evidenceIdSchema$5).min(1)
		});
		refineRevision = (value, context) => {
			if (value.unknown_id !== stableUnknownId(value.question, value.domain, value.scope_digest, value.comparison_conclusion_scope)) context.addIssue({
				code: "custom",
				message: "Residual unknown ID does not match its immutable identity",
				path: ["unknown_id"]
			});
			if (value.revision === 1 !== (value.previous_revision_digest === null)) context.addIssue({
				code: "custom",
				message: "Only the first revision has no predecessor",
				path: ["previous_revision_digest"]
			});
			if (value.status === "resolved" !== (value.resolution !== null)) context.addIssue({
				code: "custom",
				message: "Only resolved unknowns carry a resolution",
				path: ["resolution"]
			});
			if (value.status === "contradicted" && value.contradicting_evidence_ids.length === 0) context.addIssue({
				code: "custom",
				message: "Contradicted status requires contradicting evidence",
				path: ["contradicting_evidence_ids"]
			});
			if (value.relationships.some((relationship) => relationship.unknown_id === value.unknown_id)) context.addIssue({
				code: "custom",
				message: "An unknown cannot relate to itself",
				path: ["relationships"]
			});
			for (const ids of [
				value.supporting_evidence_ids,
				value.contradicting_evidence_ids,
				value.mutation_evidence_ids
			]) if (new Set(ids).size !== ids.length) context.addIssue({
				code: "custom",
				message: "Evidence IDs must be unique"
			});
			if (value.comparison_conclusion_scope !== undefined && ![...value.supporting_evidence_ids, ...value.contradicting_evidence_ids].includes(value.comparison_conclusion_scope.comparison_evidence_id)) context.addIssue({
				code: "custom",
				message: "Scoped comparison Evidence must support or contradict the unknown",
				path: ["comparison_conclusion_scope"]
			});
			if (value.comparison_conclusion_scope !== undefined && value.domain !== "function-comparison") context.addIssue({
				code: "custom",
				message: "Comparison conclusion scope requires function-comparison domain",
				path: ["comparison_conclusion_scope"]
			});
			const contradictingEvidence = new Set(value.contradicting_evidence_ids);
			if (value.supporting_evidence_ids.some((id) => contradictingEvidence.has(id))) context.addIssue({
				code: "custom",
				message: "Evidence cannot simultaneously support and contradict"
			});
			const relationships = value.relationships.map((relationship) => `${relationship.type}:${relationship.unknown_id}`);
			if (new Set(relationships).size !== relationships.length) context.addIssue({
				code: "custom",
				message: "Relationships must be unique",
				path: ["relationships"]
			});
		};
		residualUnknownValidatedSchema = residualUnknownObjectSchema.superRefine((value, context) => {
			if (computeRevisionDigest(value) !== value.revision_digest) context.addIssue({
				code: "custom",
				message: "Residual unknown revision digest does not match",
				path: ["revision_digest"]
			});
			refineRevision(value, context);
		});
		residualUnknownSchema = residualUnknownValidatedSchema;
		generatedRevisionSchema = residualUnknownObjectSchema.omit({ revision_digest: true }).superRefine(refineRevision);
		recordUnknownInputSchema = residualUnknownObjectSchema.omit({
			unknown_id: true,
			revision: true,
			previous_revision_digest: true,
			revision_digest: true,
			scope_digest: true,
			status: true,
			supporting_evidence_ids: true,
			contradicting_evidence_ids: true,
			resolution: true,
			mutation_evidence_ids: true
		}).extend({
			supporting_evidence_ids: z.array(evidenceIdSchema$5).default([]),
			contradicting_evidence_ids: z.array(evidenceIdSchema$5).default([])
		}).strict();
		updateUnknownInputSchema = z.strictObject({
			unknown_id: unknownIdSchema,
			expected_revision: z.number().int().min(1),
			status: residualUnknownObjectSchema.shape.status,
			severity: residualUnknownObjectSchema.shape.severity,
			supporting_evidence_ids: z.array(evidenceIdSchema$5),
			contradicting_evidence_ids: z.array(evidenceIdSchema$5),
			required_authority: residualUnknownObjectSchema.shape.required_authority,
			required_confidence: residualUnknownObjectSchema.shape.required_confidence,
			required_environment: environmentRequirementSchema.nullable(),
			recommended_probes: z.array(probeSchema),
			relationships: z.array(relationshipSchema),
			resolution: resolutionSchema.nullable()
		});
		createResidualUnknown = (input, mutationEvidenceId, scopeDigest) => {
			const question = input.question.replace(/\s+/gu, " ").trim();
			const domain = input.domain.trim();
			const comparisonConclusionScope = input.comparison_conclusion_scope === undefined ? undefined : {
				comparison_evidence_id: input.comparison_conclusion_scope.comparison_evidence_id,
				dimensions: input.comparison_conclusion_scope.dimensions
			};
			const revision = {
				unknown_id: stableUnknownId(question, domain, scopeDigest, comparisonConclusionScope),
				revision: 1,
				previous_revision_digest: null,
				scope_digest: scopeDigest,
				question,
				status: input.contradicting_evidence_ids.length > 0 ? "contradicted" : "open",
				domain,
				...comparisonConclusionScope === undefined ? {} : { comparison_conclusion_scope: comparisonConclusionScope },
				...projectRevisionDetails(input),
				resolution: null,
				mutation_evidence_ids: [mutationEvidenceId]
			};
			return createRevision(revision);
		};
		updateResidualUnknown = (current, input, mutationEvidenceId) => {
			const revision = {
				unknown_id: current.unknown_id,
				revision: current.revision + 1,
				previous_revision_digest: current.revision_digest,
				scope_digest: current.scope_digest,
				question: current.question,
				status: input.status,
				domain: current.domain,
				...current.comparison_conclusion_scope === undefined ? {} : { comparison_conclusion_scope: current.comparison_conclusion_scope },
				...projectRevisionDetails(input),
				resolution: input.resolution,
				mutation_evidence_ids: sortedUnique$1([...current.mutation_evidence_ids, mutationEvidenceId])
			};
			return createRevision(revision);
		};
		createRevision = (value) => {
			const revision = generatedRevisionSchema.parse(value);
			return {
				...revision,
				revision_digest: computeRevisionDigest(revision)
			};
		};
		projectRevisionDetails = (input) => ({
			severity: input.severity,
			supporting_evidence_ids: sortedUnique$1(input.supporting_evidence_ids),
			contradicting_evidence_ids: sortedUnique$1(input.contradicting_evidence_ids),
			required_authority: input.required_authority,
			required_confidence: input.required_confidence,
			required_environment: input.required_environment,
			recommended_probes: [...input.recommended_probes],
			relationships: sortedRelationships(input.relationships)
		});
		computeRevisionDigest = (value) => {
			const { revision_digest: _revisionDigest, ...semantic } = "revision_digest" in value ? value : {
				...value,
				revision_digest: ""
			};
			void _revisionDigest;
			return createHash("sha256").update(canonicalJson(semantic)).digest("hex");
		};
		canonicalJson = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Unknown identity failed");
			return serialized;
		};
		sortedUnique$1 = (values) => [...new Set(values)].sort(compareUnicodeCodePoints);
		sameOrderedValues = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
		sortedRelationships = (values) => [...values].sort((left, right) => compareUnicodeCodePoints(compositeKey([left.type, left.unknown_id]), compositeKey([right.type, right.unknown_id])));
	})))();
}

//#endregion
//#region dist/domain/evidenceBundle.js
var detectedSubjectSchema, rawSubjectSchema, manifestFields, artifactManifestSchema, providerManifestSchema, environmentManifestSchema, scenarioManifestSchema, captureManifestSchema, evidenceBundleSchema, immutableBundles, NonCanonicalEvidenceBundleError, createImmutableEvidenceBundle, createEvidenceBundle, evidenceBundleForTarget, referencedEvidenceIds, describeEvidenceBundleFailure, describeValidationFailure, parseEvidenceBundle, parseImmutableEvidenceBundle, parseBundle, authenticateParsedEvidenceBundle, authenticateBundle, validateUnknownGraph, validateVerifiedResolution, validateResidualUnknownAddition, reachesUnknown, evidenceQualifies, rejectDependencyCycles, serializeEvidenceBundle, uniqueSorted;
function init_evidenceBundle() {
	return (init_evidenceBundle = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_evidence();
		init_residualUnknown();
		init_immutableJson();
		[detectedSubjectSchema, rawSubjectSchema] = evidenceSchema.shape.subject.unwrap().options;
		manifestFields = {
			digest: true,
			format: true,
			architecture: true
		};
		artifactManifestSchema = z.discriminatedUnion("format", [detectedSubjectSchema.pick(manifestFields), rawSubjectSchema.pick(manifestFields)]);
		providerManifestSchema = providerSchema;
		environmentManifestSchema = evidenceSchema.shape.environment.unwrap();
		scenarioManifestSchema = z.strictObject({
			evidence_id: evidenceSchema.shape.evidence_id,
			operation: z.string().min(1),
			authority: z.literal("controlled-replay")
		});
		captureManifestSchema = z.strictObject({
			evidence_id: evidenceSchema.shape.evidence_id,
			predicate_type: z.string().min(1)
		});
		evidenceBundleSchema = z.strictObject({
			artifacts: z.array(artifactManifestSchema),
			providers: z.array(providerManifestSchema),
			environments: z.array(environmentManifestSchema),
			scenarios: z.array(scenarioManifestSchema),
			captures: z.array(captureManifestSchema),
			unknowns: z.array(residualUnknownSchema),
			records: z.array(evidenceSchema)
		});
		immutableBundles = new WeakMap();
		NonCanonicalEvidenceBundleError = class extends TypeError {
			constructor() {
				super("Evidence bundle manifests are not canonical");
				this.name = "NonCanonicalEvidenceBundleError";
			}
		};
		createImmutableEvidenceBundle = (records, unknowns = []) => {
			const checkedRecords = records.map(immutableEvidence);
			if (new Set(checkedRecords.map(({ evidence_id }) => evidence_id)).size !== checkedRecords.length) throw new TypeError("Evidence bundle contains duplicate record IDs");
			const checkedUnknowns = unknowns.map((unknown) => residualUnknownSchema.parse(unknown));
			validateUnknownGraph(checkedUnknowns, checkedRecords);
			const bundle = freezeJsonSnapshot(createEvidenceBundle(checkedRecords, checkedUnknowns));
			immutableBundles.set(bundle, bundle);
			return bundle;
		};
		createEvidenceBundle = (records, unknowns = []) => {
			const sortedRecords = [...records].sort((left, right) => compareUnicodeCodePoints(left.evidence_id, right.evidence_id));
			return {
				artifacts: uniqueSorted(sortedRecords.flatMap(({ subject }) => subject === null ? [] : [artifactManifestSchema.parse({
					digest: subject.digest,
					format: subject.format,
					architecture: subject.architecture
				})])),
				providers: uniqueSorted(sortedRecords.map(({ provider }) => provider)),
				environments: uniqueSorted(sortedRecords.flatMap(({ environment }) => environment === null ? [] : [environment])),
				scenarios: sortedRecords.flatMap((evidence) => evidence.authority === "controlled-replay" ? [{
					evidence_id: evidence.evidence_id,
					operation: evidence.operation,
					authority: evidence.authority
				}] : []),
				captures: sortedRecords.flatMap((evidence) => evidence.predicate_type === "rea.process-capture" ? [{
					evidence_id: evidence.evidence_id,
					predicate_type: evidence.predicate_type
				}] : []),
				unknowns: [...unknowns].sort((left, right) => compareUnicodeCodePoints(left.unknown_id, right.unknown_id) || left.revision - right.revision),
				records: sortedRecords
			};
		};
		evidenceBundleForTarget = (bundle, sha256) => {
			const recordsById = new Map(bundle.records.map((record) => [record.evidence_id, record]));
			const histories = new Map();
			for (const unknown of bundle.unknowns) {
				const history = histories.get(unknown.unknown_id) ?? [];
				history.push(unknown);
				histories.set(unknown.unknown_id, history);
			}
			const retained = new Set();
			const dependents = new Map();
			const relationships = new Map();
			for (const [id, history] of histories) {
				const eligible = history.every((unknown) => {
					if (unknown.scope_digest !== sha256) return false;
					const mutationEvidenceIds = new Set(unknown.mutation_evidence_ids);
					return referencedEvidenceIds(unknown).every((evidenceId) => {
						const record = recordsById.get(evidenceId);
						return record?.subject?.digest.sha256 === sha256 || mutationEvidenceIds.has(evidenceId) && record?.predicate_type === "rea.residual-unknown-mutation";
					});
				});
				if (!eligible) continue;
				retained.add(id);
				const relatedIds = new Set(history.flatMap((unknown) => unknown.relationships.map(({ unknown_id }) => unknown_id)));
				relationships.set(id, relatedIds);
				for (const relatedId of relatedIds) {
					const references = dependents.get(relatedId) ?? new Set();
					references.add(id);
					dependents.set(relatedId, references);
				}
			}
			const pending = [];
			for (const [id, relatedIds] of relationships) if ([...relatedIds].some((relatedId) => !retained.has(relatedId))) pending.push(id);
			for (let index = 0; index < pending.length; index += 1) {
				const id = pending[index];
				if (id === undefined || !retained.delete(id)) continue;
				for (const dependent of dependents.get(id) ?? []) pending.push(dependent);
			}
			const unknowns = bundle.unknowns.filter((unknown) => retained.has(unknown.unknown_id));
			const mutationIds = new Set(unknowns.flatMap(({ mutation_evidence_ids: ids }) => ids));
			return createEvidenceBundle(bundle.records.filter((record) => record.subject?.digest.sha256 === sha256 || mutationIds.has(record.evidence_id)), unknowns);
		};
		referencedEvidenceIds = (unknown) => [
			...unknown.supporting_evidence_ids,
			...unknown.contradicting_evidence_ids,
			...unknown.mutation_evidence_ids,
			...unknown.resolution?.evidence_ids ?? []
		];
		describeEvidenceBundleFailure = (input, cause) => {
			try {
				const record = parseEvidence(input);
				return {
					kind: "single-record",
					message: `Expected an Evidence bundle with records and manifest arrays, but this JSON is one Evidence record (${record.evidence_id}). Export a session bundle with the MCP export_evidence_bundle tool and supply that file.`
				};
			} catch {
				return {
					kind: "invalid-bundle",
					message: cause instanceof z.ZodError ? `Evidence bundle does not match the bundle schema ${describeValidationFailure(cause)}. Supply an unmodified bundle written by export_evidence_bundle or rea evidence-export.` : `Evidence bundle validation failed: ${describeValidationFailure(cause)}. Recreate or re-export the bundle, then try again.`
				};
			}
		};
		describeValidationFailure = (cause) => {
			if (!(cause instanceof z.ZodError)) return cause instanceof Error ? cause.message : String(cause);
			const [first, ...rest] = cause.issues;
			const location = first === undefined || first.path.length === 0 ? "the document root" : first.path.map(String).join(".");
			return `at ${location}: ${first?.message ?? "invalid value"}${rest.length === 0 ? "" : ` (${String(rest.length)} more issues)`}`;
		};
		parseEvidenceBundle = (input) => {
			return parseBundle(input, false);
		};
		parseImmutableEvidenceBundle = (input) => {
			return parseBundle(input, true);
		};
		parseBundle = (input, seal) => {
			if (typeof input === "object" && input !== null) {
				const owned = immutableBundles.get(input);
				if (owned !== undefined) return owned;
			}
			return authenticateBundle(evidenceBundleSchema.parse(input), seal);
		};
		authenticateParsedEvidenceBundle = (parsed) => authenticateBundle(parsed, false);
		authenticateBundle = (parsed, seal) => {
			const recordIds = parsed.records.map(({ evidence_id: id }) => id);
			if (new Set(recordIds).size !== recordIds.length) throw new TypeError("Evidence bundle contains duplicate record IDs");
			validateUnknownGraph(parsed.unknowns, parsed.records);
			const canonical = createEvidenceBundle(parsed.records.map((record, index) => {
				try {
					if (!seal) return parseEvidence(record);
					record.normalized_result = freezeJsonSnapshot(record.normalized_result);
					record.raw_result = freezeJsonSnapshot(record.raw_result);
					return immutableEvidence(record);
				} catch (cause) {
					if (cause instanceof z.ZodError) throw new z.ZodError(cause.issues.map((issue) => ({
						...issue,
						path: [
							"records",
							index,
							...issue.path
						]
					})));
					throw cause;
				}
			}), parsed.unknowns);
			if (JSON.stringify(parsed) !== JSON.stringify(canonical)) throw new NonCanonicalEvidenceBundleError();
			if (seal) {
				freezeJsonSnapshot(canonical);
				immutableBundles.set(canonical, canonical);
			}
			return canonical;
		};
		validateUnknownGraph = (unknowns, records) => {
			const evidenceById = new Map(records.map((record) => [record.evidence_id, record]));
			const histories = new Map();
			for (const unknown of unknowns) {
				const history = histories.get(unknown.unknown_id) ?? [];
				history.push(unknown);
				histories.set(unknown.unknown_id, history);
			}
			const unknownById = new Map();
			for (const [id, unordered] of histories) {
				const history = [...unordered].sort((left, right) => left.revision - right.revision);
				for (const [index, revision] of history.entries()) {
					if (revision.revision !== index + 1) throw new TypeError(`Residual unknown ${id} revision history has a gap`);
					if (index > 0 && revision.previous_revision_digest !== history[index - 1]?.revision_digest) throw new TypeError(`Residual unknown ${id} revision chain is broken`);
				}
				const head = history.at(-1);
				if (head === undefined) throw new TypeError("Residual unknown revision history is empty");
				unknownById.set(id, head);
			}
			for (const unknown of unknowns) {
				const referencedEvidence = [
					...unknown.supporting_evidence_ids,
					...unknown.contradicting_evidence_ids,
					...unknown.mutation_evidence_ids,
					...unknown.resolution?.evidence_ids ?? []
				];
				for (const evidenceId of referencedEvidence) if (!evidenceById.has(evidenceId)) throw new TypeError(`Residual unknown references missing evidence ${evidenceId}`);
				for (const relationship of unknown.relationships) if (!unknownById.has(relationship.unknown_id)) throw new TypeError(`Residual unknown references missing unknown ${relationship.unknown_id}`);
				if (unknown.resolution?.disposition === "verified") validateVerifiedResolution(unknown, evidenceById);
			}
			rejectDependencyCycles(unknownById);
		};
		validateVerifiedResolution = (unknown, evidenceById) => {
			if (unknown.contradicting_evidence_ids.length > 0) throw new TypeError(`Residual unknown ${unknown.unknown_id} retains contradicting evidence`);
			const qualifies = unknown.resolution?.evidence_ids.some((evidenceId) => {
				const evidence = evidenceById.get(evidenceId);
				return unknown.supporting_evidence_ids.includes(evidenceId) && evidence !== undefined && evidence.predicate_type !== "rea.residual-unknown-mutation" && evidenceQualifies(unknown, evidence);
			});
			if (qualifies !== true) throw new TypeError(`Residual unknown ${unknown.unknown_id} has no qualifying resolution evidence`);
		};
		validateResidualUnknownAddition = (unknown, evidenceById, currentHeads) => {
			const current = currentHeads.get(unknown.unknown_id);
			if (current === undefined ? unknown.revision !== 1 || unknown.previous_revision_digest !== null : unknown.revision !== current.revision + 1 || unknown.previous_revision_digest !== current.revision_digest) throw new TypeError(`Residual unknown ${unknown.unknown_id} revision chain is broken`);
			for (const evidenceId of referencedEvidenceIds(unknown)) if (!evidenceById.has(evidenceId)) throw new TypeError(`Residual unknown references missing evidence ${evidenceId}`);
			for (const relationship of unknown.relationships) if (relationship.unknown_id !== unknown.unknown_id && !currentHeads.has(relationship.unknown_id)) throw new TypeError(`Residual unknown references missing unknown ${relationship.unknown_id}`);
			if (unknown.resolution?.disposition === "verified") validateVerifiedResolution(unknown, evidenceById);
			if (current !== undefined) {
				const dependencies = unknown.relationships.filter((relationship) => relationship.type === "depends-on").map(({ unknown_id }) => unknown_id);
				if (dependencies.length > 0 && reachesUnknown(dependencies, unknown.unknown_id, currentHeads, unknown)) throw new TypeError("Residual unknown dependency graph contains a cycle");
			}
		};
		reachesUnknown = (starts, goal, currentHeads, candidate) => {
			const pending = [...starts];
			const visited = new Set();
			while (pending.length > 0) {
				const id = pending.pop();
				if (id === undefined) break;
				if (id === goal) return true;
				if (visited.has(id)) continue;
				visited.add(id);
				const unknown = id === candidate.unknown_id ? candidate : currentHeads.get(id);
				if (unknown === undefined) continue;
				for (const relationship of unknown.relationships) if (relationship.type === "depends-on") pending.push(relationship.unknown_id);
			}
			return false;
		};
		evidenceQualifies = (unknown, evidence) => {
			if (unknown.required_authority !== null && evidence.authority !== unknown.required_authority) return false;
			const confidenceRank = {
				inferred: 1,
				derived: 2,
				observed: 3
			};
			if (confidenceRank[evidence.confidence] < confidenceRank[unknown.required_confidence]) return false;
			const requirement = unknown.required_environment;
			if (requirement === null) return true;
			if (evidence.environment === null) return false;
			return (requirement.id === null || requirement.id === evidence.environment.id) && (requirement.platform === null || requirement.platform === evidence.environment.platform) && (requirement.architecture === null || requirement.architecture === evidence.environment.architecture) && (requirement.isolation === null || requirement.isolation === evidence.environment.isolation);
		};
		rejectDependencyCycles = (unknownById) => {
			const visited = new Set();
			const active = new Set();
			const pending = [];
			for (const root of unknownById.keys()) {
				if (visited.has(root)) continue;
				const rootUnknown = unknownById.get(root);
				if (rootUnknown === undefined) throw new TypeError("Residual unknown dependency graph is inconsistent");
				active.add(root);
				pending.push({
					id: root,
					relationships: rootUnknown.relationships,
					nextRelationship: 0
				});
				while (pending.length > 0) {
					const frame = pending[pending.length - 1];
					if (frame === undefined) break;
					let descended = false;
					while (frame.nextRelationship < frame.relationships.length) {
						const relationship = frame.relationships[frame.nextRelationship];
						frame.nextRelationship += 1;
						if (relationship?.type !== "depends-on") continue;
						const dependency = relationship.unknown_id;
						if (active.has(dependency)) throw new TypeError("Residual unknown dependency graph contains a cycle");
						if (visited.has(dependency)) continue;
						const unknown = unknownById.get(dependency);
						if (unknown === undefined) throw new TypeError("Residual unknown dependency graph is inconsistent");
						active.add(dependency);
						pending.push({
							id: dependency,
							relationships: unknown.relationships,
							nextRelationship: 0
						});
						descended = true;
						break;
					}
					if (descended) continue;
					pending.pop();
					active.delete(frame.id);
					visited.add(frame.id);
				}
			}
		};
		serializeEvidenceBundle = (bundle) => {
			const serialized = canonicalize(parseEvidenceBundle(bundle));
			if (serialized === undefined) throw new TypeError("Evidence bundle canonicalization failed");
			return serialized;
		};
		uniqueSorted = (values) => {
			const unique = new Map();
			for (const value of values) unique.set(JSON.stringify(value), value);
			return [...unique.entries()].sort(([left], [right]) => compareUnicodeCodePoints(left, right)).map(([, value]) => value);
		};
	})))();
}

//#endregion
//#region dist/domain/process/processScenario.js
var positiveBudget, processScenarioOutputBudgetProjectionSchema, PROCESS_TERMINAL_CELL_BUDGET, timedEventBase, reservedRunIdEnvironmentName, ENVIRONMENT_NAME_CHARACTER, environmentNamePattern, environmentName, childProcessString, fitsProcessTerminalCellBudget, normalizationSchema, digestProcessCommitment, committedScenarioEvents, processScenarioCommitment, processComparisonContract, processScenarioSchema, eventsOutOfOrder, parseProcessScenario;
function init_processScenario() {
	return (init_processScenario = __esmMin((() => {
		positiveBudget = z.number().int().safe().positive();
		processScenarioOutputBudgetProjectionSchema = z.object({ output_bytes: positiveBudget }).passthrough();
		PROCESS_TERMINAL_CELL_BUDGET = 1e6;
		timedEventBase = { at_ms: z.number().int().safe().nonnegative() };
		reservedRunIdEnvironmentName = "REA_PROCESS_RUN_ID";
		ENVIRONMENT_NAME_CHARACTER = "[^=\\x00]";
		environmentNamePattern = (reserved) => {
			let rest = `${ENVIRONMENT_NAME_CHARACTER}+`;
			for (let index = reserved.length - 1; index >= 0; index -= 1) {
				const character = reserved[index] ?? "";
				const choice = `[^=\\x00${character}]${ENVIRONMENT_NAME_CHARACTER}*|${character}${rest}`;
				rest = index === 0 ? choice : `(?:${choice})?`;
			}
			return new RegExp(`^(?:${rest})$`, "u");
		};
		environmentName = z.string().min(1, "Environment names must not be empty").regex(environmentNamePattern(reservedRunIdEnvironmentName), { error: (issue) => issue.input === reservedRunIdEnvironmentName ? `${reservedRunIdEnvironmentName} is reserved by the process adapter` : "Environment names cannot contain '=' or NUL" });
		childProcessString = z.string().regex(/^[^\x00]*$/u, "Values passed to operating-system APIs cannot contain NUL");
		fitsProcessTerminalCellBudget = (columns, rows, scrollback) => rows + scrollback <= Math.floor(PROCESS_TERMINAL_CELL_BUDGET / columns);
		normalizationSchema = z.object({
			paths: z.boolean(),
			pids: z.boolean(),
			ports: z.boolean(),
			time_bucket_ms: positiveBudget,
			patterns: z.array(z.object({
				pattern: z.string(),
				replacement: z.string()
			}))
		});
		digestProcessCommitment = (value) => {
			const serialized = canonicalize(value);
			if (serialized === undefined) throw new TypeError("Process capture commitment is not canonical JSON");
			return createHash("sha256").update(serialized).digest("hex");
		};
		committedScenarioEvents = (events, includeSensitiveInputLength) => events.map((event) => event.type === "input" && event.sensitive ? {
			...event,
			data: includeSensitiveInputLength ? `<redacted-input:${String(Buffer.byteLength(event.data))}-bytes>` : "<redacted-input>"
		} : event);
		processScenarioCommitment = (scenario, executableSha256) => {
			const { finalization_ms: finalizationMs, ...committed } = scenario;
			return {
				...committed,
				...finalizationMs > 0 ? { finalization_ms: finalizationMs } : {},
				events: committedScenarioEvents(scenario.events, true),
				executable_sha256: executableSha256 ?? null
			};
		};
		processComparisonContract = (scenario) => ({
			working_directory: scenario.working_directory,
			environment: scenario.environment,
			ambient_environment: "unknown",
			filesystem_observation_paths: scenario.filesystem_observation_paths,
			terminal: scenario.terminal,
			events: committedScenarioEvents(scenario.events, false),
			timeout_ms: scenario.timeout_ms,
			idle_timeout_ms: scenario.idle_timeout_ms,
			settle_ms: scenario.settle_ms,
			...scenario.finalization_ms > 0 ? { finalization_ms: scenario.finalization_ms } : {},
			limits: scenario.limits,
			normalization: scenario.normalization,
			...scenario.normalization.paths ? { path_normalization_version: "longest-original-paths-v1" } : {},
			...scenario.normalization.ports ? { port_normalization_version: "contextual-endpoints-v2" } : {},
			...scenario.normalization.patterns.length > 0 ? { pattern_normalization_version: "literal-replacements-v1" } : {},
			rendered_line_format: "trailing-spaces-trimmed-v1"
		});
		processScenarioSchema = z.strictObject({
			executable: childProcessString.min(1),
			arguments: z.array(childProcessString).default([]),
			working_directory: childProcessString.default("."),
			environment: z.record(environmentName, childProcessString).default({}),
			filesystem_observation_paths: z.array(childProcessString.min(1)).default([]),
			terminal: z.strictObject({
				columns: z.number().int().min(1).max(65535).default(80),
				rows: z.number().int().min(1).max(65535).default(24),
				scrollback: z.number().int().safe().nonnegative().default(1e3)
			}).describe("The visible terminal and scrollback together must use at most 1,000,000 xterm renderer cells: columns × (rows + scrollback). Resize events use the same scrollback and limit.").default({
				columns: 80,
				rows: 24,
				scrollback: 1e3
			}),
			events: z.array(z.discriminatedUnion("type", [
				z.strictObject({
					...timedEventBase,
					type: z.literal("input"),
					data: z.string(),
					sensitive: z.boolean().default(false)
				}),
				z.strictObject({
					...timedEventBase,
					type: z.literal("resize"),
					columns: z.number().int().min(1).max(65535),
					rows: z.number().int().min(1).max(65535)
				}),
				z.strictObject({
					...timedEventBase,
					type: z.literal("signal"),
					signal: z.enum([
						"SIGINT",
						"SIGTERM",
						"SIGKILL"
					])
				})
			])).default([]),
			timeout_ms: positiveBudget.default(3e4),
			idle_timeout_ms: positiveBudget.default(3e4),
			settle_ms: z.number().int().safe().nonnegative().default(100),
			finalization_ms: z.number().int().safe().nonnegative().default(0).describe("Milliseconds a target may keep running after SIGTERM when timeout_ms or idle_timeout_ms fires, before SIGKILL; 0 sends SIGKILL immediately. Both signals reach the captured root only while its launch-time start identity still matches; cancellation ends the run at once."),
			limits: z.strictObject({
				output_bytes: positiveBudget.default(1e6),
				files: positiveBudget.default(1e4),
				file_bytes: positiveBudget.default(1e7),
				processes: positiveBudget.default(1e3),
				filesystem_depth: z.number().int().safe().nonnegative().default(16)
			}).strict().default({
				output_bytes: 1e6,
				files: 1e4,
				file_bytes: 1e7,
				processes: 1e3,
				filesystem_depth: 16
			}),
			normalization: z.strictObject({
				paths: z.boolean().default(false),
				pids: z.boolean().default(true),
				ports: z.boolean().default(true),
				time_bucket_ms: positiveBudget.default(10),
				patterns: z.array(z.strictObject({
					pattern: z.string().describe("Literal text to replace in captured output; not a regular expression."),
					replacement: z.string()
				})).default([])
			}).default({
				paths: false,
				pids: true,
				ports: true,
				time_bucket_ms: 10,
				patterns: []
			})
		}).superRefine((scenario, context) => {
			const lifecycleBudget = BigInt(scenario.timeout_ms) + BigInt(scenario.finalization_ms) + BigInt(scenario.settle_ms);
			if (lifecycleBudget > BigInt(Number.MAX_SAFE_INTEGER)) context.addIssue({
				code: "custom",
				message: `timeout_ms + finalization_ms + settle_ms must stay at or below ${String(Number.MAX_SAFE_INTEGER)} ms, the largest total exactly representable as a JavaScript number`,
				path: ["timeout_ms"]
			});
			if (!fitsProcessTerminalCellBudget(scenario.terminal.columns, scenario.terminal.rows, scenario.terminal.scrollback)) context.addIssue({
				code: "custom",
				path: ["terminal"],
				message: `terminal columns × (rows + scrollback) must not exceed ${String(PROCESS_TERMINAL_CELL_BUDGET)} renderer cells`
			});
			for (let index = 1; index < scenario.events.length; index += 1) {
				const event = scenario.events[index];
				const previous = scenario.events[index - 1];
				if (eventsOutOfOrder(event, previous)) {
					context.addIssue({
						code: "custom",
						message: "events must be ordered by at_ms",
						path: ["events", index]
					});
				}
			}
			for (const [index, event] of scenario.events.entries()) {
				if (event.type === "resize" && !fitsProcessTerminalCellBudget(event.columns, event.rows, scenario.terminal.scrollback)) context.addIssue({
					code: "custom",
					path: ["events", index],
					message: `resize event at ${String(event.at_ms)} ms exceeds the ${String(PROCESS_TERMINAL_CELL_BUDGET)}-cell renderer budget with the selected scrollback`
				});
				if (event.at_ms > scenario.timeout_ms) {
					context.addIssue({
						code: "custom",
						message: "event occurs after the scenario timeout",
						path: ["events"]
					});
				}
			}
		});
		eventsOutOfOrder = (event, previous) => event !== undefined && previous !== undefined && event.at_ms < previous.at_ms;
		parseProcessScenario = (input) => processScenarioSchema.parse(input);
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureCoverage.js
var byteRetentionSchema, filesystemCoverageSchema, processCaptureTruncationDetailsSchema, omitted, filesystemTruncated, hasCaptureTruncation, processSourceTruncated;
function init_processCaptureCoverage() {
	return (init_processCaptureCoverage = __esmMin((() => {
		byteRetentionSchema = z.strictObject({
			budget_bytes: z.number().int().nonnegative(),
			observed_bytes: z.number().int().nonnegative(),
			retained_bytes: z.number().int().nonnegative(),
			observed_frames: z.number().int().nonnegative(),
			retained_frames: z.number().int().nonnegative(),
			unknown_size_frames: z.number().int().nonnegative().optional()
		});
		filesystemCoverageSchema = z.strictObject({
			files_limit: z.number().int().nonnegative(),
			depth_limit: z.number().int().nonnegative(),
			enumeration_truncated: z.boolean(),
			enumeration_reasons: z.array(z.enum([
				"files_limit",
				"depth_limit",
				"identity_changed",
				"directory_unavailable"
			])),
			enumeration_omissions: z.array(z.strictObject({
				path: z.string(),
				reason: z.literal("directory_unavailable"),
				system_code: z.string().nullable()
			})),
			hash_budget_bytes: z.number().int().nonnegative(),
			hashed_bytes: z.number().int().nonnegative(),
			hash_omissions: z.array(z.strictObject({
				path: z.string(),
				size_bytes: z.number().int().nonnegative(),
				remaining_budget_bytes: z.number().int().nonnegative(),
				reason: z.enum([
					"file_bytes_budget",
					"file_changed_or_short_read",
					"file_unavailable"
				]),
				system_code: z.string().nullable()
			}))
		});
		processCaptureTruncationDetailsSchema = z.strictObject({
			raw_terminal: byteRetentionSchema.describe("UTF-8 bytes of original PTY chunks; whole chunks are retained or omitted."),
			rendered_terminal: byteRetentionSchema.describe("Cumulative UTF-8 bytes of serialized state plus visible lines, evaluated from retained PTY input; whole frames are retained or omitted. When normalization exceeds a bound before the frame size is known, observed_bytes contains the exact total for size-known frames and unknown_size_frames counts the other omissions."),
			normalized_terminal: z.strictObject({
				budget_bytes: z.number().int().nonnegative(),
				retained_bytes: z.number().int().nonnegative(),
				omitted_frames: z.number().int().nonnegative()
			}).optional().describe("UTF-8 bytes of normalized raw-chunk text retained under output_bytes; omitted frames can have unknown final size when normalization exceeded an intermediate bound."),
			filesystem_before: filesystemCoverageSchema,
			filesystem_after: filesystemCoverageSchema,
			process: z.strictObject({
				sample_limit: z.number().int().nonnegative(),
				sampling_partial: z.boolean(),
				retained_samples: z.number().int().nonnegative(),
				sample_limit_reached: z.boolean(),
				sampling_failures: z.number().int().nonnegative(),
				first_sampling_failure: z.string().nullable(),
				coverage: z.literal("sampled")
			})
		});
		omitted = (retention) => retention.observed_frames > retention.retained_frames;
		filesystemTruncated = (coverage) => coverage.enumeration_truncated || coverage.enumeration_omissions.length > 0 || coverage.hash_omissions.length > 0;
		hasCaptureTruncation = (details) => omitted(details.raw_terminal) || omitted(details.rendered_terminal) || (details.normalized_terminal?.omitted_frames ?? 0) > 0 || (details.rendered_terminal.unknown_size_frames ?? 0) > 0 || filesystemTruncated(details.filesystem_before) || filesystemTruncated(details.filesystem_after) || details.process.sampling_partial;
		processSourceTruncated = (capture, source) => {
			const details = capture.truncation_details;
			switch (source) {
				case "terminal_raw": return omitted(details.raw_terminal);
				case "terminal_rendered": return omitted(details.raw_terminal) || omitted(details.rendered_terminal);
				case "filesystem": return filesystemTruncated(details.filesystem_before) || filesystemTruncated(details.filesystem_after);
				case "process": return details.process.sampling_partial;
				case "interaction":
				case "lifecycle": return false;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureValidation.js
var orderedTimestamps, validateCommitments, validateOrdering, validateEventJournal, finalizationManifestIssue, finalizationAgreementIssue, finalizationConsistencyIssue, validateLifecycle, validateCoverage, collectProcessCaptureIssues;
function init_processCaptureValidation() {
	return (init_processCaptureValidation = __esmMin((() => {
		init_processScenario();
		init_processCaptureCoverage();
		orderedTimestamps = (values) => values.every((value, index) => {
			const previous = values[index - 1];
			return previous === undefined || value >= previous;
		});
		validateCommitments = (capture, require) => {
			const { manifest } = capture;
			require(manifest.scenario.executable_sha256 === manifest.selected_executable_sha256, "manifest.selected_executable_sha256", "selected executable commitment does not match the scenario projection");
			require(manifest.executable_identity.state === "path_metadata_unchanged" ? manifest.executable_sha256 === manifest.selected_executable_sha256 && manifest.executable_identity.reason === null : manifest.executable_sha256 === null && manifest.executable_identity.reason !== null, "manifest.executable_identity", "launch identity and executable digest do not agree");
			for (const [field, value] of [
				["full_scenario_sha256", manifest.scenario],
				["comparison_contract_sha256", manifest.comparison_contract],
				["normalization_sha256", capture.normalization]
			]) require(manifest[field] === digestProcessCommitment(value), `manifest.${field}`, "commitment does not match its canonical value");
		};
		validateOrdering = (capture, require) => {
			for (const [name, values] of [
				["frames", capture.frames],
				["rendered_frames", capture.rendered_frames],
				["interaction_events", capture.interaction_events]
			]) require(values.every(({ sequence }, index) => sequence === index), name, "sequence values must be contiguous from zero");
			for (const [name, values] of [
				["frames", capture.frames],
				["rendered_frames", capture.rendered_frames],
				["process_samples", capture.process_samples]
			]) require(orderedTimestamps(values.map(({ at_ms }) => at_ms)), name, "timestamps must be ordered");
			require(orderedTimestamps(capture.interaction_events.map(({ dispatched_at_ms }) => dispatched_at_ms)), "interaction_events", "dispatch timestamps must be ordered");
		};
		validateEventJournal = (capture, require) => {
			const journal = capture.event_journal;
			if (journal.length === 0) return;
			const sizes = {
				frames: capture.frames.length,
				rendered_frames: capture.rendered_frames.length,
				interaction_events: capture.interaction_events.length,
				lifecycle: 2,
				process_samples: capture.process_samples.length,
				filesystem_checkpoints: capture.filesystem_checkpoints.length
			};
			const references = new Set();
			for (const [position, entry] of journal.entries()) {
				require(entry.capture_order === position, `event_journal.${String(position)}.capture_order`, "capture order must be contiguous from zero");
				require(entry.index < sizes[entry.collection], `event_journal.${String(position)}.index`, "journal reference is outside its capture collection");
				const reference = `${entry.collection}:${String(entry.index)}`;
				require(!references.has(reference), `event_journal.${String(position)}`, "journal references must be unique");
				references.add(reference);
			}
			const expectedSize = Object.values(sizes).reduce((total, size) => total + size, 0);
			require(journal.length === expectedSize, "event_journal", "nonempty journal must reference every captured observation");
		};
		finalizationManifestIssue = (committedScenario, committedComparison) => committedScenario !== undefined && committedComparison !== undefined && committedScenario["finalization_ms"] !== committedComparison["finalization_ms"] ? "comparison_contract finalization_ms must match the committed scenario" : undefined;
		finalizationAgreementIssue = (exitFinalization, observedFinalization) => exitFinalization !== undefined && observedFinalization !== undefined && JSON.stringify(exitFinalization) !== JSON.stringify(observedFinalization) ? "exit finalization and finalization observation must agree" : undefined;
		finalizationConsistencyIssue = (exit, committedScenario, committedComparison, options) => {
			const manifestIssue = finalizationManifestIssue(committedScenario, committedComparison);
			if (manifestIssue !== undefined) return manifestIssue;
			const finalization = exit?.finalization ?? options?.finalization;
			if (finalization === undefined) {
				const committed = committedScenario?.["finalization_ms"];
				return (exit?.reason === "timeout" || exit?.reason === "idle_timeout") && typeof committed === "number" && committed > 0 ? "a deadline exit under a committed finalization_ms requires finalization evidence" : undefined;
			}
			if (exit?.reason === "exited") return "finalization requires a deadline exit reason";
			const first = finalization.signals[0];
			if (first?.signal !== "SIGTERM") return "finalization signals must start with SIGTERM";
			const killIndexes = finalization.signals.flatMap(({ signal }, index) => signal === "SIGKILL" ? [index] : []);
			if (killIndexes.length > 1 || killIndexes[0] !== undefined && killIndexes[0] !== finalization.signals.length - 1) return "finalization may contain at most one final SIGKILL";
			if (!finalization.signals.every(({ sent_at_ms }, index) => {
				const previous = finalization.signals[index - 1];
				return previous === undefined || sent_at_ms >= previous.sent_at_ms;
			})) return "finalization signal attempt times must not decrease";
			if (finalization.signals.filter(({ signal }) => signal === "SIGTERM").length !== 1) return "finalization must attempt SIGTERM exactly once";
			const kill = finalization.signals.find(({ signal }) => signal === "SIGKILL");
			if (kill !== undefined && kill.sent_at_ms < finalization.requested_ms && exit !== undefined && exit.reason !== "cancelled") return "finalization SIGKILL cannot precede the requested interval";
			if (finalization.elapsed_ms === null && options?.allowNullElapsedMs !== true) return "finalization requires an observed elapsed_ms";
			if (finalization.exit_code !== null && exit?.signal !== undefined && exit.signal !== null && exit.signal !== 0) return "finalization exit_code requires an exit not caused by a signal";
			if (finalization.elapsed_ms !== null && finalization.elapsed_ms < (finalization.signals.at(-1)?.sent_at_ms ?? first.sent_at_ms)) return "finalization elapsed_ms cannot precede the last signal attempt";
			if (committedScenario !== undefined && committedScenario["finalization_ms"] !== finalization.requested_ms) return "finalization must match the committed finalization_ms";
			return undefined;
		};
		validateLifecycle = (capture, require) => {
			require(capture.filesystem_checkpoints.map(({ name }) => name).join(",") === "before,after_settlement", "filesystem_checkpoints", "capture must include initial and final filesystem snapshots");
			require(orderedTimestamps(capture.filesystem_checkpoints.map(({ at_ms }) => at_ms)), "filesystem_checkpoints", "filesystem snapshot times must be ordered");
			require(!capture.filesystem_checkpoints.some(({ truncated }) => truncated) || capture.truncated, "truncated", "filesystem snapshot truncation must propagate to the capture");
			require(capture.exit.reason === "exited" || capture.exit.code === null, "exit", "deadline termination cannot declare a normal exit code");
			const finalizationIssue = finalizationConsistencyIssue(capture.exit, capture.manifest.scenario, capture.manifest.comparison_contract);
			require(finalizationIssue === undefined, "exit", finalizationIssue ?? "");
		};
		validateCoverage = (capture, require) => {
			const details = capture.truncation_details;
			require(details.process.retained_samples === capture.process_samples.length && details.process.retained_samples <= details.process.sample_limit && details.process.sampling_partial === (details.process.sample_limit_reached || details.process.sampling_failures > 0) && details.process.sampling_failures === 0 === (details.process.first_sampling_failure === null), "truncation_details.process", "sampling coverage must agree with retained samples and observed failures");
			require(capture.truncated === hasCaptureTruncation(details), "truncation_details", "aggregate truncation must match producer coverage");
			for (const [name, retention, count, bytes] of [[
				"raw_terminal",
				details.raw_terminal,
				capture.frames.length,
				capture.frames.reduce((total, frame) => total + Buffer.byteLength(frame.raw_data ?? frame.data), 0)
			], [
				"rendered_terminal",
				details.rendered_terminal,
				capture.rendered_frames.length,
				capture.rendered_frames.reduce((total, frame) => frame.lines.reduce((sum, line) => sum + Buffer.byteLength(line), total + Buffer.byteLength(frame.serialized_state)), 0)
			]]) {
				require(retention.retained_frames === count && retention.observed_frames >= count && retention.retained_bytes === bytes && retention.observed_bytes >= retention.retained_bytes && (retention.observed_frames > count || retention.observed_bytes === retention.retained_bytes) && retention.retained_bytes <= retention.budget_bytes && (retention.unknown_size_frames ?? 0) <= retention.observed_frames - retention.retained_frames, `truncation_details.${name}`, "retained observations and budget accounting do not agree");
			}
			const normalized = details.normalized_terminal;
			if (normalized !== undefined) {
				const committedOutputBudget = processScenarioOutputBudgetProjectionSchema.safeParse(capture.manifest.scenario["limits"]);
				require(committedOutputBudget.success, "manifest.scenario.limits.output_bytes", "committed process scenario must include an explicit valid output_bytes budget");
				const retainedBytes = capture.frames.reduce((total, frame) => total + Buffer.byteLength(frame.data), 0);
				if (committedOutputBudget.success) require(normalized.budget_bytes === committedOutputBudget.data.output_bytes && normalized.retained_bytes === retainedBytes && normalized.retained_bytes <= normalized.budget_bytes && normalized.omitted_frames <= details.raw_terminal.observed_frames - details.raw_terminal.retained_frames, "truncation_details.normalized_terminal", "normalized terminal retention must agree with the committed budget and retained frames");
			}
			for (const [name, coverage, files, checkpoint] of [[
				"filesystem_before",
				details.filesystem_before,
				capture.files_before,
				capture.filesystem_checkpoints[0]
			], [
				"filesystem_after",
				details.filesystem_after,
				capture.files_after,
				capture.filesystem_checkpoints[1]
			]]) {
				const unhashedFiles = new Map(files.filter((file) => file.type === "file" && file.sha256 === null).map((file) => [file.path, file]));
				const directories = new Set(files.filter((file) => file.type === "directory").map(({ path }) => path));
				require(coverage.hash_omissions.length === unhashedFiles.size && new Set(coverage.hash_omissions.map(({ path }) => path)).size === unhashedFiles.size && coverage.hash_omissions.every((omission) => unhashedFiles.get(omission.path)?.size === omission.size_bytes && omission.remaining_budget_bytes <= coverage.hash_budget_bytes && (omission.reason === "file_unavailable" ? omission.system_code !== null : omission.system_code === null)), `truncation_details.${name}.hash_omissions`, "every retained regular file without a digest must have one matching omission reason");
				require(new Set(coverage.enumeration_omissions.map(({ path }) => path)).size === coverage.enumeration_omissions.length && (coverage.enumeration_omissions.length === 0 || coverage.enumeration_reasons.includes("directory_unavailable")) && coverage.enumeration_omissions.every((omission) => directories.has(omission.path) && omission.system_code !== null), `truncation_details.${name}.enumeration_omissions`, "every directory enumeration omission must identify one retained directory and its system error");
				require(coverage.hashed_bytes === files.filter((file) => file.type === "file" && file.sha256 !== null).reduce((sum, file) => sum + file.size, 0) && coverage.hashed_bytes <= coverage.hash_budget_bytes && files.length <= coverage.files_limit, `truncation_details.${name}`, "filesystem budget accounting does not match retained observations");
				require(coverage.enumeration_truncated === coverage.enumeration_reasons.length > 0 && checkpoint?.truncated === (coverage.enumeration_truncated || coverage.enumeration_omissions.length > 0 || coverage.hash_omissions.length > 0), `truncation_details.${name}`, "filesystem checkpoint truncation must match enumeration and digest coverage");
			}
		};
		collectProcessCaptureIssues = (capture) => {
			const issues = [];
			const require = (condition, path, message) => {
				if (!condition) issues.push({
					path,
					message
				});
			};
			validateCommitments(capture, require);
			validateOrdering(capture, require);
			validateEventJournal(capture, require);
			validateLifecycle(capture, require);
			validateCoverage(capture, require);
			return issues;
		};
	})))();
}

//#endregion
//#region dist/domain/process/processCapture.js
var PROCESS_CAPTURE_EVENT_COLLECTIONS, fileStateShape, fileStateSchema, processFilesystemSnapshotSchema, fileEffectSchema, processSettlementSchema, unverifiedCleanupProcessesSchema, processCaptureFinalizationSchema, processCaptureShapeSchema, processCleanupResourceSchema, partialObservationFieldSchema, incompleteProcessCaptureObservationsSchema, partialCleanupReportSchema, partialObservationMetadataSchema, completedCaptureObservationSchema, incompleteCaptureObservationSchema, partialProcessCaptureObservationSchema, processCaptureSchema;
function init_processCapture() {
	return (init_processCapture = __esmMin((() => {
		init_jsonValue();
		init_processScenario();
		init_processCaptureValidation();
		init_processCaptureCoverage();
		PROCESS_CAPTURE_EVENT_COLLECTIONS = [
			"frames",
			"rendered_frames",
			"interaction_events",
			"lifecycle",
			"process_samples",
			"filesystem_checkpoints"
		];
		fileStateShape = {
			path: z.string(),
			mode: z.number().int().nonnegative(),
			size: z.number().int().nonnegative()
		};
		fileStateSchema = z.discriminatedUnion("type", [
			z.object({
				...fileStateShape,
				type: z.literal("file"),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				symlink_target: z.null()
			}),
			z.object({
				...fileStateShape,
				type: z.literal("symlink"),
				sha256: z.null(),
				symlink_target: z.string()
			}),
			z.object({
				...fileStateShape,
				type: z.enum(["directory", "other"]),
				sha256: z.null(),
				symlink_target: z.null()
			})
		]);
		processFilesystemSnapshotSchema = z.strictObject({
			files: z.array(fileStateSchema),
			truncated: z.boolean(),
			completeRoots: z.array(z.string()),
			coverage: filesystemCoverageSchema
		});
		fileEffectSchema = z.discriminatedUnion("status", [
			z.object({
				path: z.string(),
				status: z.literal("created"),
				before: z.null(),
				after: fileStateSchema
			}),
			z.object({
				path: z.string(),
				status: z.literal("deleted"),
				before: fileStateSchema,
				after: z.null()
			}),
			z.object({
				path: z.string(),
				status: z.enum(["modified", "unchanged"]),
				before: fileStateSchema,
				after: fileStateSchema
			}),
			z.object({
				path: z.string(),
				status: z.literal("unknown"),
				before: fileStateSchema.nullable(),
				after: fileStateSchema.nullable(),
				reason: z.string().min(1)
			})
		]);
		processSettlementSchema = z.discriminatedUnion("state", [z.object({
			state: z.literal("quiesced"),
			elapsed_ms: z.number().int().nonnegative(),
			cleanup_outcome: z.enum(["not_required", "failed"])
		}), z.object({
			state: z.enum(["alive_at_deadline", "unverifiable"]),
			elapsed_ms: z.number().int().nonnegative(),
			cleanup_outcome: z.enum(["cleaned", "failed"])
		})]);
		unverifiedCleanupProcessesSchema = z.array(z.strictObject({
			pid: z.number().int().positive(),
			reason: z.string()
		}));
		processCaptureFinalizationSchema = z.strictObject({
			requested_ms: z.number().int().safe().positive(),
			elapsed_ms: z.number().int().nonnegative().nullable(),
			exit_code: z.number().int().nonnegative().nullable(),
			signals: z.array(z.strictObject({
				signal: z.enum(["SIGTERM", "SIGKILL"]),
				sent_at_ms: z.number().int().nonnegative(),
				delivery: z.enum([
					"signaled",
					"gone",
					"identity-changed",
					"unverified"
				]),
				reason: z.string().min(1).optional()
			})).min(1)
		}).superRefine((finalization, context) => {
			if (finalization.exit_code !== null && finalization.elapsed_ms === null) context.addIssue({
				code: "custom",
				path: ["exit_code"],
				message: "finalization exit_code requires an observed exit"
			});
			for (const [index, attempt] of finalization.signals.entries()) if (attempt.reason !== undefined && attempt.delivery !== "unverified") context.addIssue({
				code: "custom",
				path: [
					"signals",
					index,
					"reason"
				],
				message: "finalization reason is only allowed for an unverified delivery"
			});
		});
		processCaptureShapeSchema = z.strictObject({
			manifest: z.strictObject({
				rea_version: z.string().min(1),
				provider_version: z.string().min(1),
				platform: z.string().min(1),
				architecture: z.string().min(1),
				pty_backend: z.literal("node-pty"),
				started_at: z.iso.datetime(),
				completed_at: z.iso.datetime(),
				scenario: z.record(z.string(), jsonValueSchema),
				comparison_contract: z.record(z.string(), jsonValueSchema),
				full_scenario_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				comparison_contract_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				selected_executable_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				executable_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
				executable_identity: z.strictObject({
					state: z.enum(["path_metadata_unchanged", "unknown"]),
					reason: z.string().nullable()
				}),
				normalization_sha256: z.string().regex(/^[a-f0-9]{64}$/u)
			}),
			normalization: normalizationSchema,
			frames: z.array(z.object({
				sequence: z.number().int().nonnegative(),
				at_ms: z.number().int().nonnegative(),
				data: z.string(),
				raw_data: z.string().optional()
			})),
			rendered_frames: z.array(z.object({
				sequence: z.number().int().nonnegative(),
				at_ms: z.number().int().nonnegative(),
				columns: z.number().int().positive(),
				rows: z.number().int().positive(),
				cursor_x: z.number().int().nonnegative(),
				cursor_y: z.number().int().nonnegative(),
				active_buffer: z.enum(["normal", "alternate"]),
				lines: z.array(z.string()),
				serialized_state: z.string()
			})),
			interaction_events: z.array(z.object({
				sequence: z.number().int().nonnegative(),
				scheduled_at_ms: z.number().int().nonnegative(),
				dispatched_at_ms: z.number().int().nonnegative(),
				type: z.enum([
					"input",
					"resize",
					"signal"
				]),
				data: z.string(),
				outcome: z.enum([
					"dispatched",
					"target_exited",
					"failed"
				])
			})),
			exit: z.object({
				code: z.number().int().nullable(),
				signal: z.number().int().nullable(),
				reason: z.enum([
					"exited",
					"timeout",
					"idle_timeout"
				]),
				finalization: processCaptureFinalizationSchema.optional()
			}),
			settlement: z.discriminatedUnion("state", [z.object({
				state: z.literal("quiesced"),
				elapsed_ms: z.number().int().nonnegative(),
				cleanup_outcome: z.literal("not_required")
			}), z.object({
				state: z.enum(["alive_at_deadline", "unverifiable"]),
				elapsed_ms: z.number().int().nonnegative(),
				cleanup_outcome: z.enum(["cleaned", "failed"])
			})]),
			process_samples: z.array(z.object({
				at_ms: z.number().int().nonnegative(),
				pid: z.number().int().positive(),
				parent_pid: z.number().int().nonnegative(),
				command: z.string(),
				process_group_id: z.number().int().positive().nullable(),
				session_id: z.number().int().nonnegative().nullable()
			})),
			filesystem_checkpoints: z.array(z.object({
				name: z.enum(["before", "after_settlement"]),
				at_ms: z.number().int().nonnegative(),
				files: z.array(fileStateSchema),
				effects: z.array(fileEffectSchema),
				truncated: z.boolean()
			})),
			event_journal: z.array(z.object({
				capture_order: z.number().int().nonnegative(),
				collection: z.enum(PROCESS_CAPTURE_EVENT_COLLECTIONS),
				index: z.number().int().nonnegative()
			})),
			files_before: z.array(fileStateSchema),
			files_after: z.array(fileStateSchema),
			filesystem_effects: z.array(fileEffectSchema),
			truncated: z.boolean(),
			truncation_details: processCaptureTruncationDetailsSchema,
			limitations: z.array(z.string()),
			residual_unknowns: z.array(z.object({
				scope: z.enum([
					"terminal",
					"interaction",
					"exit",
					"process",
					"filesystem",
					"cleanup",
					"network",
					"environment"
				]),
				reason: z.string()
			})),
			cleanup: z.object({
				owned_process_group: z.literal("verified"),
				temporary_root: z.literal("removed"),
				unverified_processes: unverifiedCleanupProcessesSchema.optional()
			})
		});
		processCleanupResourceSchema = z.strictObject({
			state: z.enum([
				"cleaned",
				"failed",
				"unverified",
				"not_required"
			]),
			reason: z.string().nullable(),
			unverified_processes: unverifiedCleanupProcessesSchema.optional()
		});
		partialObservationFieldSchema = (value) => z.discriminatedUnion("state", [z.strictObject({
			state: z.literal("available"),
			value
		}), z.strictObject({
			state: z.literal("unavailable"),
			reason: z.string()
		})]);
		incompleteProcessCaptureObservationsSchema = z.strictObject({
			target_pid: partialObservationFieldSchema(z.number().int().positive()),
			frames: partialObservationFieldSchema(processCaptureShapeSchema.shape.frames),
			rendered_frames: partialObservationFieldSchema(processCaptureShapeSchema.shape.rendered_frames),
			interaction_events: partialObservationFieldSchema(processCaptureShapeSchema.shape.interaction_events),
			exit: partialObservationFieldSchema(z.strictObject({
				code: z.number().int().nullable(),
				signal: z.number().int().nullable(),
				reason: z.enum([
					"exited",
					"timeout",
					"idle_timeout",
					"cancelled"
				]),
				finalization: processCaptureFinalizationSchema.optional()
			})),
			finalization: partialObservationFieldSchema(processCaptureFinalizationSchema).optional(),
			settlement: partialObservationFieldSchema(z.strictObject({
				state: z.enum([
					"quiesced",
					"alive_at_deadline",
					"unverifiable"
				]),
				elapsed_ms: z.number().int().nonnegative()
			})),
			process_samples: partialObservationFieldSchema(processCaptureShapeSchema.shape.process_samples),
			filesystem_snapshots: z.strictObject({
				before: partialObservationFieldSchema(processFilesystemSnapshotSchema),
				after: partialObservationFieldSchema(processFilesystemSnapshotSchema)
			}),
			event_journal: partialObservationFieldSchema(processCaptureShapeSchema.shape.event_journal),
			manifest: partialObservationFieldSchema(processCaptureShapeSchema.shape.manifest)
		});
		partialCleanupReportSchema = z.strictObject({
			owned_process_group: processCleanupResourceSchema,
			terminal_renderer: processCleanupResourceSchema,
			temporary_root: processCleanupResourceSchema
		});
		partialObservationMetadataSchema = z.strictObject({
			cleanup: partialCleanupReportSchema,
			execution_failure: z.string().nullable()
		});
		completedCaptureObservationSchema = z.strictObject({ capture: processCaptureShapeSchema.omit({ cleanup: true }).extend({ settlement: processSettlementSchema }) });
		incompleteCaptureObservationSchema = z.strictObject({ observations: incompleteProcessCaptureObservationsSchema });
		partialProcessCaptureObservationSchema = z.union([completedCaptureObservationSchema.extend(partialObservationMetadataSchema.shape), incompleteCaptureObservationSchema.extend(partialObservationMetadataSchema.shape)]).superRefine((partial, context) => {
			const cleanupIncomplete = Object.values(partial.cleanup).some(({ state }) => state === "failed" || state === "unverified");
			if (!cleanupIncomplete && partial.execution_failure === null) context.addIssue({
				code: "custom",
				path: ["execution_failure"],
				message: "partial observations require incomplete cleanup or an execution failure"
			});
			const observedExit = "capture" in partial ? partial.capture.exit : partial.observations.exit.state === "available" ? partial.observations.exit.value : undefined;
			const observedFinalization = "observations" in partial && partial.observations.finalization?.state === "available" ? partial.observations.finalization.value : undefined;
			const committedManifest = "capture" in partial ? partial.capture.manifest : partial.observations.manifest.state === "available" ? partial.observations.manifest.value : undefined;
			const manifestFinalizationIssue = finalizationManifestIssue(committedManifest?.scenario, committedManifest?.comparison_contract);
			const exitFinalizationIssue = manifestFinalizationIssue ?? (observedExit === undefined ? undefined : finalizationConsistencyIssue(observedExit, committedManifest?.scenario, committedManifest?.comparison_contract));
			const incompleteFinalizationIssue = manifestFinalizationIssue ?? (observedFinalization === undefined ? undefined : finalizationConsistencyIssue(observedExit === undefined ? undefined : {
				reason: observedExit.reason,
				signal: observedExit.signal
			}, committedManifest?.scenario, committedManifest?.comparison_contract, {
				finalization: observedFinalization,
				allowNullElapsedMs: true
			}));
			if (exitFinalizationIssue !== undefined) context.addIssue({
				code: "custom",
				path: ["exit"],
				message: exitFinalizationIssue
			});
			if (incompleteFinalizationIssue !== undefined) context.addIssue({
				code: "custom",
				path: ["finalization"],
				message: incompleteFinalizationIssue
			});
			const agreementIssue = finalizationAgreementIssue(observedExit?.finalization, observedFinalization);
			if (agreementIssue !== undefined) context.addIssue({
				code: "custom",
				path: ["finalization"],
				message: agreementIssue
			});
			if ("observations" in partial && partial.observations.exit.state === "unavailable" && observedFinalization !== undefined && observedFinalization?.elapsed_ms !== null) context.addIssue({
				code: "custom",
				path: ["finalization"],
				message: "finalization elapsed_ms must be null when the exit observation is unavailable"
			});
			if ("observations" in partial) {
				const { observations } = partial;
				if (![
					observations.frames,
					observations.interaction_events,
					observations.process_samples,
					observations.filesystem_snapshots.before,
					observations.event_journal
				].some(({ state }) => state === "available")) context.addIssue({
					code: "custom",
					path: ["observations"],
					message: "incomplete observations contain no collected evidence"
				});
				return;
			}
			const { capture } = partial;
			const settlement = capture.settlement.state === "quiesced" ? {
				...capture.settlement,
				cleanup_outcome: "not_required"
			} : {
				...capture.settlement,
				cleanup_outcome: "cleaned"
			};
			const validationCapture = {
				...capture,
				settlement,
				cleanup: {
					owned_process_group: "verified",
					temporary_root: "removed"
				}
			};
			for (const issue of collectProcessCaptureIssues(validationCapture)) context.addIssue({
				code: "custom",
				path: ["capture", ...issue.path.split(".")],
				message: issue.message
			});
		});
		processCaptureSchema = processCaptureShapeSchema.superRefine((capture, context) => {
			if (capture.settlement.cleanup_outcome === "failed") context.addIssue({
				code: "custom",
				path: ["settlement", "cleanup_outcome"],
				message: "verified captures cannot contain failed cleanup"
			});
			for (const issue of collectProcessCaptureIssues(capture)) context.addIssue({
				code: "custom",
				path: issue.path.split("."),
				message: issue.message
			});
		}).describe("The capture must preserve its canonical scenario, comparison, and normalization SHA-256 commitments; ordered capture timestamps and contiguous sequence numbers; before and final filesystem snapshots with truncation propagated; and exit-code consistency with deadline termination. The event journal is required; empty journals are valid. A non-empty journal must reference every captured observation exactly once with unique in-range references. These cross-field invariants are checked by REA after capture.");
	})))();
}

//#endregion
//#region dist/domain/process/processCaptureParsing.js
var verifiedCaptures, isVerifiedCapture, attachProof, parseProcessCapture;
function init_processCaptureParsing() {
	return (init_processCaptureParsing = __esmMin((() => {
		init_processCapture();
		verifiedCaptures = new WeakSet();
		isVerifiedCapture = (capture) => verifiedCaptures.has(capture);
		attachProof = (capture) => {
			verifiedCaptures.add(capture);
			if (isVerifiedCapture(capture)) return capture;
			throw new TypeError("Process Capture proof ownership failed");
		};
		parseProcessCapture = (input) => {
			const parsed = processCaptureSchema.safeParse(input);
			if (parsed.success) return attachProof(parsed.data);
			const issues = parsed.error.issues.flatMap((issue) => issue.code === "custom" ? [{
				path: issue.path.join("."),
				message: issue.message
			}] : []);
			if (issues.length > 0) throw new TypeError(`Invalid process capture: ${issues.map(({ path, message }) => `${path}: ${message}`).join("; ")}`);
			throw parsed.error;
		};
	})))();
}

//#endregion
//#region dist/identity.js
var PRODUCT_IDENTITY, SDK_IDENTITY;
function init_identity() {
	return (init_identity = __esmMin((() => {
		PRODUCT_IDENTITY = {
			displayName: "REA",
			packageName: PACKAGE_METADATA.name,
			packageSpecifier: `${PACKAGE_METADATA.name}@latest`,
			registrationPackageSpecifier: `${PACKAGE_METADATA.name}@${PACKAGE_METADATA.version}`,
			packageVersion: PACKAGE_METADATA.version,
			cliBinary: "rea",
			mcpCommand: `npx -y ${PACKAGE_METADATA.name}@${PACKAGE_METADATA.version} mcp`,
			mcpServerKey: "rea",
			skillName: "reverse-engineer-anything",
			skillVersion: PACKAGE_METADATA.skillVersion,
			configFileName: "rea.json"
		};
		SDK_IDENTITY = {
			server: PACKAGE_METADATA.serverSdkVersion,
			client_test: PACKAGE_METADATA.clientSdkVersion,
			core: PACKAGE_METADATA.coreSdkVersion
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticIr.js
var failedJavaScriptSemanticIr;
function init_javascriptSemanticIr() {
	return (init_javascriptSemanticIr = __esmMin((() => {
		failedJavaScriptSemanticIr = () => ({
			schema: "JavaScriptSemanticIR",
			scopes: [],
			bindings: [],
			callables: [],
			references: [],
			moduleLinks: [],
			callSites: [],
			argumentFlows: [],
			callReturnFlows: [],
			callResultFlows: [],
			closureCaptures: [],
			promiseOperations: [],
			eventOperations: [],
			timerOperations: [],
			childProcessSpawns: [],
			childProcessInteractions: [],
			configurationOperations: [],
			requestOperations: [],
			boundaryOperations: [],
			resourceOperations: [],
			objectOperations: [],
			functionFingerprints: [],
			frontiers: [],
			coverage: {
				status: "failed",
				omittedCount: null
			},
			limitations: ["JavaScript parsing failed; no semantic absence claim is available.", "No JavaScript was executed."]
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticState.js
var semanticStableInitializer, currentSemanticScope, semanticScopeId, semanticBindingId, resolveSemanticBindingState, semanticResolutionBlocked, semanticScopeForNode, resolveSemanticBindingFromScope, semanticVariableScope, isUnshadowedGlobal, isUnmodifiedCommonJsWrapperBinding;
function init_javascriptSemanticState() {
	return (init_javascriptSemanticState = __esmMin((() => {
		semanticStableInitializer = (binding, state) => {
			const [initializer] = binding?.initializers ?? [];
			const [definition] = binding?.definitions ?? [];
			return binding !== undefined && (definition?.kind === "variable" && binding.definitions.every(({ kind }) => kind === "variable") || binding.definitions.length === 1 && (definition?.kind === "function" || definition?.kind === "class")) && binding.initializers.length === 1 && initializer !== undefined && !state.conditionallySkippedExpressions.has(initializer.node) ? initializer : undefined;
		};
		currentSemanticScope = (stack) => {
			const scope = stack.at(-1);
			if (scope === undefined) throw new TypeError("Missing semantic scope");
			return scope;
		};
		semanticScopeId = (kind, node) => `scope:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		semanticBindingId = (scopeId, name) => `${scopeId}:binding:${encodeURIComponent(name)}`;
		resolveSemanticBindingState = (state, node, name) => {
			let scope = semanticScopeForNode(state, node);
			while (scope !== undefined) {
				const binding = scope.bindings.get(name);
				if (binding !== undefined) return binding;
				if (!scope.bindingsComplete) return undefined;
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return undefined;
		};
		semanticResolutionBlocked = (state, node, name) => {
			let scope = semanticScopeForNode(state, node);
			while (scope !== undefined) {
				if (scope.bindings.has(name)) return false;
				if (!scope.bindingsComplete) return true;
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return false;
		};
		semanticScopeForNode = (state, node) => {
			let candidate = node;
			while (candidate !== undefined) {
				const scope = state.scopeByNode.get(candidate);
				if (scope !== undefined) {
					let descendant = node;
					while (descendant !== undefined && descendant !== candidate) {
						state.scopeByNode.set(descendant, scope);
						descendant = state.parentsByNode.get(descendant);
					}
					return scope;
				}
				candidate = state.parentsByNode.get(candidate);
			}
			return undefined;
		};
		resolveSemanticBindingFromScope = (scope, name, state) => {
			let candidate = scope;
			while (candidate !== undefined) {
				const binding = candidate.bindings.get(name);
				if (binding !== undefined) return binding;
				if (!candidate.bindingsComplete) return undefined;
				candidate = candidate.parentScopeId === null ? undefined : state.scopesById.get(candidate.parentScopeId);
			}
			return undefined;
		};
		semanticVariableScope = (scope, parent, state) => {
			if (!(parent !== null && t.isVariableDeclaration(parent, { kind: "var" }))) return scope;
			let candidate = scope;
			while (candidate.kind === "block" || candidate.kind === "catch") {
				const outer = candidate.parentScopeId === null ? undefined : state.scopesById.get(candidate.parentScopeId);
				if (outer === undefined) break;
				candidate = outer;
			}
			return candidate;
		};
		isUnshadowedGlobal = (node, state, name) => t.isIdentifier(node, { name }) && (resolveSemanticBindingState(state, node, name) === undefined ? !semanticResolutionBlocked(state, node, name) : isUnmodifiedCommonJsWrapperBinding(node, name, state));
		isUnmodifiedCommonJsWrapperBinding = (node, name, state) => {
			if (state.program.sourceType !== "script" || ![
				"module",
				"exports",
				"require"
			].includes(name) || !t.isIdentifier(node, { name })) return false;
			const binding = resolveSemanticBindingState(state, node, name);
			if (binding === undefined || binding.initializers.length !== 0) return false;
			const scope = state.scopesById.get(binding.scopeId);
			return scope?.kind === "program" && binding.declarationKinds.size > 0 && [...binding.declarationKinds].every((kind) => kind === "var");
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBuiltinResourceMethods.js
var BUILTIN_RESOURCE_METHODS, BUILTIN_RESOURCE_SPECIFIERS;
function init_javascriptBuiltinResourceMethods() {
	return (init_javascriptBuiltinResourceMethods = __esmMin((() => {
		BUILTIN_RESOURCE_METHODS = {
			fs: [
				"open",
				"openSync",
				"createReadStream",
				"createWriteStream"
			],
			"fs/promises": ["open"],
			net: ["connect", "createConnection"],
			tls: ["connect", "createConnection"]
		};
		BUILTIN_RESOURCE_SPECIFIERS = Object.keys(BUILTIN_RESOURCE_METHODS);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptAstValues.js
/** Visit binding and member leaves in direct and destructuring write targets. */
function* semanticWriteTargets(root) {
	const pending = [root];
	while (pending.length > 0) {
		const next = pending.pop();
		if (next === undefined) break;
		const node = unwrapJavaScriptExpression(next).node;
		if (t.isIdentifier(node) || t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) yield node;
		else if (t.isRestElement(node)) pending.push(node.argument);
		else if (t.isAssignmentPattern(node)) pending.push(node.left);
		else if (t.isArrayPattern(node)) {
			for (const element of node.elements.toReversed()) if (element !== null) pending.push(element);
		} else if (t.isObjectPattern(node)) {
			for (const property of node.properties.toReversed()) pending.push(t.isRestElement(property) ? property.argument : property.value);
		}
	}
}
var runtimeFunctionParameters, unwrapJavaScriptExpression, readExactJavaScriptLiteral, propertyName, semanticStaticPropertyName, semanticStaticPropertyKey, semanticObjectPatternKeys, semanticWriteSiteTarget, semanticWriteSiteReadsFirst, semanticWrappedWriteSite, javascriptDisplayText;
function init_javascriptAstValues() {
	return (init_javascriptAstValues = __esmMin((() => {
		runtimeFunctionParameters = (node) => t.isIdentifier(node.params[0], { name: "this" }) ? node.params.slice(1) : node.params;
		unwrapJavaScriptExpression = (node) => {
			let current = node;
			let depth = 0;
			while (t.isParenthesizedExpression(current) || t.isTSAsExpression(current) || t.isTSTypeAssertion(current) || t.isTSNonNullExpression(current) || t.isTSSatisfiesExpression(current) || t.isTSInstantiationExpression(current) || t.isTypeCastExpression(current)) {
				current = current.expression;
				depth += 1;
			}
			return {
				node: current,
				depth
			};
		};
		readExactJavaScriptLiteral = (node) => {
			node = unwrapJavaScriptExpression(node).node;
			if (t.isStringLiteral(node)) return {
				found: true,
				value: node.value
			};
			if (t.isNumericLiteral(node) && Number.isFinite(node.value)) return {
				found: true,
				value: node.value
			};
			if (t.isBooleanLiteral(node)) return {
				found: true,
				value: node.value
			};
			if (t.isNullLiteral(node)) return {
				found: true,
				value: null
			};
			if (t.isTemplateLiteral(node) && node.expressions.length === 0 && node.quasis.length === 1) {
				const cooked = node.quasis[0]?.value.cooked;
				return cooked === null || cooked === undefined ? { found: false } : {
					found: true,
					value: cooked
				};
			}
			return { found: false };
		};
		propertyName = (node) => {
			if (t.isIdentifier(node)) return node.name;
			if (t.isStringLiteral(node) || t.isNumericLiteral(node)) return String(node.value);
			return "";
		};
		semanticStaticPropertyName = (property, computed) => semanticStaticPropertyKey(property, computed) ?? "";
		semanticStaticPropertyKey = (property, computed) => {
			property = unwrapJavaScriptExpression(property).node;
			if (t.isStringLiteral(property) || t.isNumericLiteral(property)) return String(property.value);
			if (t.isBigIntLiteral(property)) return String(property.value);
			if (t.isUnaryExpression(property, { operator: "-" }) && t.isBigIntLiteral(property.argument)) return String(-BigInt(property.argument.value));
			if (t.isTemplateLiteral(property) && property.expressions.length === 0 && property.quasis.length === 1) {
				const cooked = property.quasis[0]?.value.cooked;
				return cooked === null || cooked === undefined ? null : cooked;
			}
			return !computed && t.isIdentifier(property) ? property.name : null;
		};
		semanticObjectPatternKeys = (pattern) => pattern.properties.flatMap((property) => {
			if (t.isRestElement(property)) return [];
			const key = semanticStaticPropertyKey(property.key, property.computed);
			return key === null ? [] : [key];
		});
		semanticWriteSiteTarget = (node) => {
			if (t.isAssignmentExpression(node)) return node.left;
			if (t.isUpdateExpression(node)) return node.argument;
			if (t.isUnaryExpression(node, { operator: "delete" })) return node.argument;
			if (t.isForOfStatement(node) || t.isForInStatement(node)) return node.left;
			return null;
		};
		semanticWriteSiteReadsFirst = (site) => t.isAssignmentExpression(site) && site.operator !== "=" || t.isUpdateExpression(site);
		semanticWrappedWriteSite = (node, parent, ancestors) => {
			const chain = ancestors.at(-1) === parent ? ancestors : [...ancestors, parent];
			for (let index = chain.length - 1; index >= 0; index -= 1) {
				const candidate = chain[index];
				if (candidate === undefined) return null;
				const target = semanticWriteSiteTarget(candidate);
				if (target !== null) return unwrapJavaScriptExpression(target).node === node ? candidate : null;
				if (unwrapJavaScriptExpression(candidate).depth === 0) return null;
			}
			return null;
		};
		javascriptDisplayText = (value) => value === "" ? "\"\"" : value;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPropertyPaths.js
var semanticArrayIndex, semanticPropertyPathKeyMatches, coverageNode, SemanticPropertyPathCoverage, keyCovers;
function init_javascriptSemanticPropertyPaths() {
	return (init_javascriptSemanticPropertyPaths = __esmMin((() => {
		semanticArrayIndex = (key) => {
			const index = Number(key);
			return Number.isInteger(index) && index >= 0 && index < 4294967295 && String(index) === String(key) ? index : null;
		};
		semanticPropertyPathKeyMatches = (key, name) => {
			if (key === null) return true;
			if (typeof key !== "object") return String(key) === name;
			if (key.excludedKeys.includes(name)) return false;
			if (key.startIndex === undefined) return true;
			const index = semanticArrayIndex(name);
			return index !== null && index >= key.startIndex;
		};
		coverageNode = () => ({
			terminal: false,
			exact: new Map(),
			selectors: new Map()
		});
		SemanticPropertyPathCoverage = class {
			#root = coverageNode();
			/** Retain a path only when no previously retained prefix covers it. */
			retain(path) {
				if (this.covers(path)) return false;
				let node = this.#root;
				for (const key of path) {
					if (key !== null && typeof key !== "object") {
						const name = String(key);
						let child = node.exact.get(name);
						if (child === undefined) {
							child = coverageNode();
							node.exact.set(name, child);
						}
						node = child;
					} else {
						const identity = JSON.stringify(key);
						let selected = node.selectors.get(identity);
						if (selected === undefined) {
							selected = {
								key,
								node: coverageNode()
							};
							node.selectors.set(identity, selected);
						}
						node = selected.node;
					}
				}
				node.terminal = true;
				node.exact.clear();
				node.selectors.clear();
				return true;
			}
			/** Query retained prefixes without changing the coverage index. */
			covers(path) {
				const pending = [{
					node: this.#root,
					offset: 0
				}];
				while (pending.length > 0) {
					const current = pending.pop();
					if (current === undefined) break;
					if (current.node.terminal) return true;
					const key = path[current.offset];
					if (key === undefined) continue;
					if (key !== null && typeof key !== "object") {
						const exact = current.node.exact.get(String(key));
						if (exact !== undefined) pending.push({
							node: exact,
							offset: current.offset + 1
						});
					}
					for (const selected of current.node.selectors.values()) {
						if (keyCovers(selected.key, key)) pending.push({
							node: selected.node,
							offset: current.offset + 1
						});
					}
				}
				return false;
			}
		};
		keyCovers = (covering, key) => {
			if (covering === null) return true;
			if (key === null) return false;
			if (typeof key !== "object") return typeof covering === "object" ? semanticPropertyPathKeyMatches(covering, String(key)) : String(covering) === String(key);
			return typeof covering === "object" && covering.excludedKeys.every((name) => key.excludedKeys.includes(name)) && (covering.startIndex === undefined || key.startIndex !== undefined && covering.startIndex <= key.startIndex);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptStaticAnalysisHelpers.js
var failedJavaScriptStaticAnalysis, argumentNode, chunkRuntime, findChunkRuntime, moduleFactory, modulePropertyName, factoryRequireName, staticArrayValues, staticPathResolutionContext, staticPath, staticConcatenation, staticCallPath, staticFileUrlPath, sourceRelativeFileUrlPath, isSourceFileUrl, staticResolvedPath, isFilesystemPathExpression, isDirectoryIdentity, isDirectoryPath, isImportMetaUrl, isFileIdentity, XHR_METHODS, isRequestUrlOrPathLiteral, isRequestUrlReference, WINDOW_OPEN_CALL, FS_OPEN_FLAGS, BROWSING_CONTEXT_KEYWORDS, xhrOpenUrl, KEYED_COLLECTION_CONSTRUCTORS, isKeyedCollectionReceiver, endpointArgument, storageKind, calleeName, memberPropertyName, stringValue, argumentValue, prefixedArgument, sourceSlice, range, rangeForOffsets, sourceRangesEqual, pointForOffset, detectVendors, registrationKey, sortedUnique, sha256Text, STATIC_ROUTE_CALL_NAMES, vendorPatterns;
function init_javascriptStaticAnalysisHelpers() {
	return (init_javascriptStaticAnalysisHelpers = __esmMin((() => {
		init_javascriptAstValues();
		init_unicodeCodePointOrder();
		failedJavaScriptStaticAnalysis = () => ({
			parse_status: "failed",
			parse_error_count: 1,
			visited_ast_nodes: 0,
			references: [],
			endpoints: [],
			storage: [],
			bundler_registrations: [],
			role_paths: [],
			source_map_urls: [],
			vendors: [],
			electron: {
				browser_windows: [],
				context_bridge_apis: [],
				ipc: [],
				sender_validations: [],
				utility_processes: [],
				native_addon_bindings: []
			},
			limitations: ["JavaScript source could not be parsed; absence of findings is not evidence of absence.", "JavaScript syntax was parsed as data and was never evaluated."]
		});
		argumentNode = (argument) => argument !== null && t.isNode(argument) ? argument : undefined;
		chunkRuntime = (call) => {
			if (!t.isMemberExpression(call.callee) && !t.isOptionalMemberExpression(call.callee)) return undefined;
			if (semanticStaticPropertyName(call.callee.property, call.callee.computed) !== "push") return undefined;
			return findChunkRuntime(call.callee.object);
		};
		findChunkRuntime = (node) => {
			const pending = [node];
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined) continue;
				if (t.isIdentifier(current) && /(?:webpack|rspack)Chunk/iu.test(current.name)) return current.name;
				if (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					const property = semanticStaticPropertyName(current.property, current.computed);
					if (/(?:webpack|rspack)Chunk/iu.test(property)) return property;
					if (t.isNode(current.object)) pending.push(current.object);
					continue;
				}
				if (t.isAssignmentExpression(current)) {
					pending.push(current.right, current.left);
					continue;
				}
				if (t.isLogicalExpression(current) || t.isBinaryExpression(current)) {
					pending.push(current.right, current.left);
					continue;
				}
				const unwrapped = unwrapJavaScriptExpression(current).node;
				if (unwrapped !== current) pending.push(unwrapped);
			}
			return undefined;
		};
		moduleFactory = (property) => {
			if (t.isObjectMethod(property)) return property;
			if (t.isObjectProperty(property) && (t.isFunctionExpression(property.value) || t.isArrowFunctionExpression(property.value))) return property.value;
			return undefined;
		};
		modulePropertyName = (property) => {
			if (!t.isObjectMethod(property) && !t.isObjectProperty(property)) return `[unknown@${String(property.start ?? -1)}]`;
			const key = semanticStaticPropertyKey(property.key, property.computed);
			if (key !== null) return key;
			return property.computed ? `[computed@${String(property.start ?? -1)}]` : `[unknown@${String(property.start ?? -1)}]`;
		};
		factoryRequireName = (factory) => {
			const parameter = runtimeFunctionParameters(factory)[2];
			return t.isIdentifier(parameter) ? parameter.name : null;
		};
		staticArrayValues = (array) => {
			const staticValues = array.elements.flatMap((element) => {
				const value = argumentValue(element);
				return value === undefined ? [] : [value];
			});
			const values = [...new Set(staticValues)].sort(compareUnicodeCodePoints);
			return {
				values,
				unknown: array.elements.length - staticValues.length
			};
		};
		staticPathResolutionContext = (node) => isFilesystemPathExpression(node) ? "filesystem-expression" : "module-specifier";
		staticPath = (node) => {
			if (t.isStringLiteral(node)) return node.value;
			if (t.isTemplateLiteral(node) && node.expressions.length === 0) return stringValue(node);
			if (t.isBinaryExpression(node, { operator: "+" })) return staticConcatenation(node);
			if (t.isCallExpression(node) || t.isNewExpression(node)) return staticCallPath(node);
			return undefined;
		};
		staticConcatenation = (node) => {
			const operands = [];
			let current = node;
			while (t.isBinaryExpression(current, { operator: "+" })) {
				operands.push(current.right);
				current = current.left;
			}
			const anchored = isDirectoryPath(current);
			if (!anchored) operands.push(current);
			let text = "";
			for (const operand of operands.reverse()) {
				const value = staticPath(operand);
				if (value === undefined) return undefined;
				text += value;
			}
			if (!anchored) return text;
			return text.startsWith("/") ? posix.join(".", text) : undefined;
		};
		staticCallPath = (node) => {
			const name = calleeName(node.callee);
			if (name === "URL" || name.endsWith(".URL")) return isFileIdentity(argumentNode(node.arguments[1])) ? stringValue(node.arguments[0]) : undefined;
			if (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) {
				return staticFileUrlPath(node);
			}
			if (name.endsWith(".resolve")) return name === "win32.resolve" || name.endsWith(".win32.resolve") ? undefined : staticResolvedPath(node);
			if (!name.endsWith(".join") && name !== "join") return undefined;
			const parts = [];
			for (const argument of node.arguments) {
				if (isDirectoryIdentity(argumentNode(argument))) {
					parts.push(".");
					continue;
				}
				const value = t.isNode(argument) ? staticPath(argument) : undefined;
				if (value === undefined) return undefined;
				parts.push(value);
			}
			return parts.length === 0 ? undefined : posix.join(...parts);
		};
		staticFileUrlPath = (node) => {
			if (node.arguments.length !== 1) return undefined;
			const argument = argumentNode(node.arguments[0]);
			if (argument === undefined) return undefined;
			if (isSourceFileUrl(argument)) return sourceRelativeFileUrlPath(argument);
			const value = staticPath(argument);
			const rawPath = value?.split(/[?#]/u, 1)[0] ?? "";
			if (value === undefined || !/^file:/iu.test(value) || value !== value.trim() || value.includes("\\") || [...value].some((character) => character.charCodeAt(0) < 32) || /%(?:2f|5c)/iu.test(rawPath)) return undefined;
			try {
				const url = new URL(value);
				if (url.protocol !== "file:") return undefined;
				const path = fileURLToPath(url, { windows: false });
				return /^\/[a-z]:/iu.test(path) ? undefined : path;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		sourceRelativeFileUrlPath = (node) => {
			if (!isSourceFileUrl(node)) return undefined;
			const value = stringValue(node.arguments[0]);
			if (value === undefined || (value.split(/[?#]/u, 1)[0] ?? "") === "" || value !== value.trim() || value.includes("\\") || [...value].some((character) => character.charCodeAt(0) < 32) || /^[a-z][a-z0-9+.-]*:/iu.test(value) || value.startsWith("//") || /%(?:2e|2f|5c)/iu.test(value.split(/[?#]/u, 1)[0] ?? "")) return undefined;
			const directory = `/${"source/".repeat(value.split("/").length + 1)}`;
			try {
				const resolved = new URL(value, `file://${directory}entry.js`);
				const path = fileURLToPath(resolved, { windows: false });
				if (value.startsWith("/")) return path;
				const relative = posix.relative(directory, path) || ".";
				return value.startsWith("./") && relative !== "." && !relative.startsWith("../") ? `./${relative}` : relative;
			} catch (cause) {
				void cause;
				return undefined;
			}
		};
		isSourceFileUrl = (node) => (t.isCallExpression(node) || t.isNewExpression(node)) && (calleeName(node.callee) === "URL" || calleeName(node.callee).endsWith(".URL")) && isFileIdentity(argumentNode(node.arguments[1]));
		staticResolvedPath = (node) => {
			const parts = [];
			for (const argument of node.arguments) {
				if (isDirectoryIdentity(argumentNode(argument))) {
					parts.push(null);
					continue;
				}
				const value = t.isNode(argument) ? staticPath(argument) : undefined;
				if (value === undefined) return undefined;
				parts.push(value);
			}
			const anchor = parts.findLastIndex((part) => part === null || posix.isAbsolute(part));
			if (anchor === -1) return undefined;
			const path = posix.join(...parts.slice(anchor).filter((part) => part !== null));
			return path === "/" ? path : path.replace(/\/$/u, "");
		};
		isFilesystemPathExpression = (node) => {
			if (t.isStringLiteral(node)) return node.value.startsWith("/");
			if (isFileIdentity(node) || isDirectoryIdentity(node)) return true;
			if (t.isBinaryExpression(node, { operator: "+" })) return isFilesystemPathExpression(node.left) || isFilesystemPathExpression(node.right);
			if (t.isCallExpression(node) || t.isNewExpression(node)) {
				const name = calleeName(node.callee);
				if (name.endsWith(".resolve") && staticCallPath(node) !== undefined) return true;
				if (name === "URL" || name.endsWith(".URL")) return isFileIdentity(argumentNode(node.arguments[1]));
				if (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) return staticFileUrlPath(node) !== undefined || node.arguments.some((argument) => {
					const value = argumentNode(argument);
					return value !== undefined && isFilesystemPathExpression(value);
				});
				return node.arguments.some((argument) => {
					const value = argumentNode(argument);
					return value !== undefined && isFilesystemPathExpression(value);
				});
			}
			return false;
		};
		isDirectoryIdentity = (node) => {
			if (isDirectoryPath(node)) return true;
			if (!t.isCallExpression(node) && !t.isNewExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "URL" || name.endsWith(".URL")) && isFileIdentity(argumentNode(node.arguments[1]));
		};
		isDirectoryPath = (node) => {
			if (t.isIdentifier(node, { name: "__dirname" })) return true;
			if (!t.isCallExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "dirname" || name.endsWith(".dirname")) && isFileIdentity(argumentNode(node.arguments[0]));
		};
		isImportMetaUrl = (node) => {
			if (node === undefined) return false;
			const expression = unwrapJavaScriptExpression(node).node;
			if (!t.isMemberExpression(expression)) return false;
			const object = unwrapJavaScriptExpression(expression.object).node;
			return t.isMetaProperty(object) && object.meta.name === "import" && object.property.name === "meta" && semanticStaticPropertyName(expression.property, expression.computed) === "url";
		};
		isFileIdentity = (node) => {
			if (t.isIdentifier(node, { name: "__filename" }) || isImportMetaUrl(node)) return true;
			if (!t.isCallExpression(node)) return false;
			const name = calleeName(node.callee);
			return (name === "fileURLToPath" || name.endsWith(".fileURLToPath")) && isFileIdentity(argumentNode(node.arguments[0]));
		};
		XHR_METHODS = new Set([
			"CONNECT",
			"DELETE",
			"GET",
			"HEAD",
			"OPTIONS",
			"PATCH",
			"POST",
			"PUT",
			"TRACE"
		]);
		isRequestUrlOrPathLiteral = (value) => /^(?:https?|wss?):\/\//iu.test(value) || value.startsWith("/") || value.startsWith("./") || value.startsWith("../");
		isRequestUrlReference = (value) => {
			if (isRequestUrlOrPathLiteral(value) || value.startsWith("?") || value.startsWith("#")) return true;
			if (!/^(?:https?|wss?):/iu.test(value)) return false;
			return URL.parse(value) !== null;
		};
		WINDOW_OPEN_CALL = /(?:^|\.)(?:window|self|globalThis|top|parent|opener|frames|document)\.open$/u;
		FS_OPEN_FLAGS = new Set([
			"a",
			"a+",
			"as",
			"as+",
			"ax",
			"ax+",
			"r",
			"r+",
			"rs",
			"rs+",
			"sa",
			"sa+",
			"sr",
			"sr+",
			"w",
			"w+",
			"wx",
			"wx+",
			"xa",
			"xa+",
			"xw",
			"xw+"
		]);
		BROWSING_CONTEXT_KEYWORDS = new Set([
			"_blank",
			"_parent",
			"_self",
			"_top"
		]);
		xhrOpenUrl = (name, methodNode, urlNode, receiverFact) => {
			const url = stringValue(urlNode);
			if (url === undefined) return undefined;
			if (receiverFact === "window") return undefined;
			const method = stringValue(methodNode);
			const storage = receiverFact === "local-indexed-db" || receiverFact === "local-cache-storage" || receiverFact === "indexed-db" || receiverFact === "cache-storage" || storageKind(name) !== undefined;
			if (method === undefined) return storage || receiverFact === undefined && WINDOW_OPEN_CALL.test(name) || FS_OPEN_FLAGS.has(url) || BROWSING_CONTEXT_KEYWORDS.has(url.toLowerCase()) ? undefined : url;
			return XHR_METHODS.has(method.toUpperCase()) || (!storage || receiverFact === "local-indexed-db" || receiverFact === "local-cache-storage") && /^[A-Z][A-Z-]*$/u.test(method) ? url : undefined;
		};
		KEYED_COLLECTION_CONSTRUCTORS = new Set([
			"FormData",
			"Headers",
			"Map",
			"Set",
			"URLSearchParams",
			"WeakMap",
			"WeakSet"
		]);
		isKeyedCollectionReceiver = (callee) => {
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return false;
			const receiver = callee.object;
			if (t.isNewExpression(receiver)) return t.isIdentifier(receiver.callee) && KEYED_COLLECTION_CONSTRUCTORS.has(receiver.callee.name);
			if (!t.isMemberExpression(receiver) && !t.isOptionalMemberExpression(receiver)) return false;
			const property = semanticStaticPropertyName(receiver.property, receiver.computed);
			return property === "headers" || property === "headersList" || property === "searchParams";
		};
		endpointArgument = (name, args, callee, receiverFact) => {
			const literal = (value) => value === undefined ? undefined : {
				kind: "endpoint",
				value
			};
			if (receiverFact === "window") return undefined;
			if (name === "fetch" || name.endsWith(".fetch") || name === "WebSocket" || name === "EventSource" || name.endsWith(".EventSource")) return literal(stringValue(args[0]));
			if (name.endsWith(".open")) {
				const value = xhrOpenUrl(name, args[0], args[1], receiverFact);
				if (value === undefined) return undefined;
				return {
					kind: stringValue(args[0]) !== undefined || isRequestUrlReference(value) ? "endpoint" : "candidate",
					value
				};
			}
			const method = [
				"get",
				"post",
				"put",
				"patch",
				"delete",
				"request"
			].find((candidate) => name === candidate || name.endsWith(`.${candidate}`));
			if (method !== undefined) {
				const value = stringValue(args[0]);
				if (value === undefined) return undefined;
				if ((method === "get" || method === "delete") && !isRequestUrlOrPathLiteral(value) && (isKeyedCollectionReceiver(callee) || method === "get" && (receiverFact === "configuration" || receiverFact === "extension-state"))) return undefined;
				return {
					kind: isRequestUrlReference(value) ? "endpoint" : "candidate",
					value
				};
			}
			if (name === "sendBeacon" || name.endsWith(".sendBeacon")) return literal(stringValue(args[0]));
			if (name === "loadURL" || name.endsWith(".loadURL")) return literal(stringValue(args[0]));
			return undefined;
		};
		storageKind = (name) => {
			if (name.includes("localStorage.")) return "local-storage";
			if (name.includes("sessionStorage.")) return "session-storage";
			if (name.endsWith("indexedDB.open")) return "indexed-db";
			if (name.endsWith("caches.open")) return "cache-storage";
			if (name === "Database" || name.endsWith(".Database")) return "sqlite";
			return undefined;
		};
		calleeName = (node) => {
			const segments = [];
			while (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				segments.push(memberPropertyName(node));
				if (!t.isNode(node.object)) break;
				node = node.object;
			}
			const base = t.isIdentifier(node) ? node.name : t.isImport(node) ? "import" : "";
			segments.push(base);
			segments.reverse();
			const first = segments.findIndex((segment) => segment !== "");
			return first === -1 ? "" : segments.slice(first).join(".");
		};
		memberPropertyName = (node) => node.computed && !t.isStringLiteral(node.property) && !t.isNumericLiteral(node.property) ? `[computed@${String(node.property.start ?? -1)}]` : semanticStaticPropertyName(node.property, node.computed);
		stringValue = (node) => {
			if (node === null || node === undefined) return undefined;
			const literal = readExactJavaScriptLiteral(node);
			return literal.found && typeof literal.value === "string" ? literal.value : undefined;
		};
		argumentValue = (node) => t.isNumericLiteral(node) ? String(node.value) : stringValue(node);
		prefixedArgument = (prefix, node) => {
			const value = argumentValue(node);
			return value === undefined ? undefined : `${prefix}${value}`;
		};
		sourceSlice = (source, node) => typeof node.start !== "number" || typeof node.end !== "number" ? "" : source.slice(node.start, node.end);
		range = (node) => ({
			start: {
				line: node.loc?.start.line ?? 1,
				column: node.loc?.start.column ?? 0
			},
			end: {
				line: node.loc?.end.line ?? node.loc?.start.line ?? 1,
				column: node.loc?.end.column ?? node.loc?.start.column ?? 0
			}
		});
		rangeForOffsets = (source, start, end) => ({
			start: pointForOffset(source, start),
			end: pointForOffset(source, end)
		});
		sourceRangesEqual = (left, right) => left !== null && left.start.line === right.start.line && left.start.column === right.start.column && left.end.line === right.end.line && left.end.column === right.end.column;
		pointForOffset = (source, offset) => {
			const before = source.slice(0, offset);
			const lines = before.split(/\r\n|[\n\r\u2028\u2029]/u);
			return {
				line: lines.length,
				column: lines.at(-1)?.length ?? 0
			};
		};
		detectVendors = (source) => vendorPatterns.flatMap(({ name, patterns }) => patterns.some((pattern) => source.includes(pattern)) ? [name] : []);
		registrationKey = (registration) => compositeKey([
			registration.runtime,
			registration.chunk_keys,
			String(registration.unknown_chunk_keys),
			registration.runtime_require_name,
			registration.runtime_module_cache_status,
			registration.entry_module_keys,
			String(registration.unknown_entry_module_keys),
			registration.async_chunk_keys,
			String(registration.unknown_async_chunk_keys),
			registration.modules.map(({ module_key: key, source_sha256: digest }) => [key, digest])
		]);
		sortedUnique = (values, key) => [...new Map(values.map((value) => [key(value), value])).values()].sort((left, right) => compareUnicodeCodePoints(key(left), key(right)));
		sha256Text = (value) => createHash("sha256").update(value).digest("hex");
		STATIC_ROUTE_CALL_NAMES = [
			"route",
			"addRoute",
			"useRoutes",
			"createBrowserRouter",
			"createHashRouter"
		];
		vendorPatterns = [
			{
				name: "webpack",
				patterns: ["__webpack_require__", "webpackChunk"]
			},
			{
				name: "Rspack",
				patterns: ["__webpack_require__.f", "rspackChunk"]
			},
			{
				name: "Vite",
				patterns: ["__vite__", "import.meta.hot"]
			},
			{
				name: "Rollup",
				patterns: ["ROLLUP_FILE_URL", "import.meta.ROLLUP"]
			},
			{
				name: "esbuild",
				patterns: ["__commonJS", "__esm"]
			},
			{
				name: "React",
				patterns: ["React.createElement", "react/jsx-runtime"]
			},
			{
				name: "Vue",
				patterns: ["__VUE__", "createApp("]
			},
			{
				name: "Next.js",
				patterns: ["__NEXT_DATA__", "/_next/"]
			},
			{
				name: "Angular",
				patterns: ["ɵɵdefineComponent"]
			},
			{
				name: "Svelte",
				patterns: ["svelte/internal"]
			}
		];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMutationInitializers.js
var initializerPositionCaches, initializerPositionCache, statementPosition, positionPrecedes, semanticTopLevelEffectFollowsCapture, expressionEvaluationPrecedes, computeDirectInitializerPosition, directInitializerPosition, computeDirectMutationPosition, directMutationPosition, computeReferenceInitializerPosition, referenceInitializerPosition, semanticMutationInitializers, semanticReadInitializers, selectInitializers, semanticCapturePosition, semanticBindingPrecedesCapture, semanticEscapeFollowsCapture;
function init_javascriptSemanticMutationInitializers() {
	return (init_javascriptSemanticMutationInitializers = __esmMin((() => {
		init_javascriptAstValues();
		initializerPositionCaches = new WeakMap();
		initializerPositionCache = (parents) => {
			const cached = initializerPositionCaches.get(parents);
			if (cached !== undefined) return cached;
			const created = {
				direct: new WeakMap(),
				mutation: new WeakMap(),
				reference: new WeakMap()
			};
			initializerPositionCaches.set(parents, created);
			return created;
		};
		statementPosition = (statement, parents, declarator) => {
			const parent = parents.get(statement);
			if (!t.isProgram(parent) && !t.isBlockStatement(parent)) return null;
			const index = parent.body.indexOf(statement);
			return index < 0 ? null : {
				body: parent.body,
				index,
				declaratorIndex: t.isVariableDeclaration(statement) && declarator !== undefined ? statement.declarations.indexOf(declarator) : -1
			};
		};
		positionPrecedes = (left, right) => left.body === right.body && (left.index < right.index || left.index === right.index && left.declaratorIndex >= 0 && left.declaratorIndex < right.declaratorIndex);
		semanticTopLevelEffectFollowsCapture = (capture, effect, parents) => {
			const position = (node) => {
				let selected = null;
				let declarator;
				let child;
				while (node !== undefined) {
					if (t.isFunction(node) || t.isLoop(node)) return null;
					if ((t.isClassProperty(node) || t.isClassPrivateProperty(node) || t.isClassAccessorProperty(node)) && !node.static && node.value === child) return null;
					if (t.isVariableDeclarator(node)) declarator = node;
					if (selected === null && t.isStatement(node)) selected = statementPosition(node, parents, declarator);
					if (t.isProgram(node)) return selected;
					child = node;
					node = parents.get(node);
				}
				return null;
			};
			const before = position(capture);
			const after = position(effect);
			if (before === null || after === null) return false;
			if (positionPrecedes(before, after)) return true;
			if (before.body !== after.body || before.index !== after.index || before.declaratorIndex !== after.declaratorIndex) return false;
			return expressionEvaluationPrecedes(capture, effect, parents);
		};
		expressionEvaluationPrecedes = (earlier, later, parents) => {
			if (later === undefined) return false;
			const earlierAncestors = new Set();
			let current = earlier;
			while (current !== undefined) {
				earlierAncestors.add(current);
				current = parents.get(current);
			}
			const laterPath = [];
			current = later;
			while (current !== undefined && !earlierAncestors.has(current)) {
				laterPath.push(current);
				current = parents.get(current);
			}
			const common = current;
			if (common === undefined || common === earlier || common === later) return false;
			let earlierChild = earlier;
			while (parents.get(earlierChild) !== common) {
				const parent = parents.get(earlierChild);
				if (parent === undefined) return false;
				earlierChild = parent;
			}
			const laterChild = laterPath.at(-1);
			if (laterChild === undefined) return false;
			const orderedChildren = (() => {
				if (t.isSequenceExpression(common)) return common.expressions;
				if (t.isCallExpression(common) || t.isOptionalCallExpression(common)) return [common.callee, ...common.arguments];
				if (t.isNewExpression(common)) return [common.callee, ...common.arguments];
				if (t.isBinaryExpression(common) || t.isLogicalExpression(common)) return [common.left, common.right];
				if (t.isConditionalExpression(common)) return [common.test];
				return null;
			})();
			if (orderedChildren === null) return false;
			const earlierIndex = orderedChildren.indexOf(earlierChild);
			const laterIndex = orderedChildren.indexOf(laterChild);
			return earlierIndex >= 0 && laterIndex > earlierIndex;
		};
		computeDirectInitializerPosition = (node, parents) => {
			const parent = parents.get(node);
			if (t.isVariableDeclarator(parent) && parent.init === node) {
				const declaration = parents.get(parent);
				return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
			}
			if (t.isAssignmentExpression(parent) && parent.operator === "=" && parent.right === node && t.isIdentifier(parent.left)) {
				const statement = parents.get(parent);
				return t.isExpressionStatement(statement) && statement.expression === parent ? statementPosition(statement, parents) : null;
			}
			return null;
		};
		directInitializerPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.direct.get(node);
			if (cached !== undefined) return cached;
			const computed = computeDirectInitializerPosition(node, parents);
			cache.direct.set(node, computed);
			return computed;
		};
		computeDirectMutationPosition = (node, parents) => {
			if (t.isForOfStatement(node)) return statementPosition(node, parents);
			if (t.isVariableDeclarator(node)) {
				const declaration = parents.get(node);
				return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, node) : null;
			}
			if (t.isSpreadElement(node)) {
				const array = parents.get(node);
				return t.isArrayExpression(array) ? semanticCapturePosition(array, parents) : null;
			}
			if (!t.isAssignmentExpression(node) && !t.isUpdateExpression(node) && !t.isUnaryExpression(node, { operator: "delete" }) && !t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node) && !t.isTaggedTemplateExpression(node)) return null;
			let current = node;
			while (true) {
				const parent = parents.get(current);
				if (parent === undefined || t.isFunction(parent) || t.isLogicalExpression(parent) && parent.right === current || t.isConditionalExpression(parent) && parent.test !== current) return null;
				if (t.isStatement(parent)) return statementPosition(parent, parents);
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
				}
				current = parent;
			}
		};
		directMutationPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.mutation.get(node);
			if (cached !== undefined) return cached;
			const computed = computeDirectMutationPosition(node, parents);
			cache.mutation.set(node, computed);
			return computed;
		};
		computeReferenceInitializerPosition = (node, parents) => {
			let current = node;
			while (true) {
				const direct = directInitializerPosition(current, parents);
				if (direct !== null) return direct;
				const parent = parents.get(current);
				if (parent === undefined || t.isStatement(parent) || t.isFunction(parent)) return null;
				if (t.isVariableDeclarator(parent)) {
					const declaration = parents.get(parent);
					return t.isVariableDeclaration(declaration) ? statementPosition(declaration, parents, parent) : null;
				}
				current = parent;
			}
		};
		referenceInitializerPosition = (node, parents) => {
			const cache = initializerPositionCache(parents);
			const cached = cache.reference.get(node);
			if (cached !== undefined) return cached;
			const computed = computeReferenceInitializerPosition(node, parents);
			cache.reference.set(node, computed);
			return computed;
		};
		semanticMutationInitializers = (binding, mutation, parents) => {
			const mutationPosition = directMutationPosition(mutation, parents) ?? referenceInitializerPosition(mutation, parents);
			if (mutationPosition === null) return binding;
			const origins = [...binding.initializers.map((initializer) => ({
				initializer,
				position: initializer.entryBody === undefined ? directInitializerPosition(initializer.node, parents) : {
					body: initializer.entryBody.body,
					index: -1,
					declaratorIndex: -1
				}
			})), ...binding.referenceInitializers.map((initializer) => ({
				initializer,
				position: referenceInitializerPosition(initializer.node, parents)
			}))];
			if (origins.some(({ position }) => position === null || !positionPrecedes(position, mutationPosition))) return binding;
			const latest = origins.reduce((latest, { position }) => position !== null && (latest === null || positionPrecedes(latest, position)) ? position : latest, null);
			const retained = new Set(origins.filter(({ position }) => position?.index === latest?.index && position?.declaratorIndex === latest?.declaratorIndex).map(({ initializer }) => initializer));
			return {
				directOrigins: origins.length === 0 ? binding.directOrigins : [],
				initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
				referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer))
			};
		};
		semanticReadInitializers = (binding, read, parents) => {
			let position = null;
			let current = read;
			for (let parent = parents.get(current); parent; parent = parents.get(current)) {
				if (t.isLoop(parent)) return binding;
				if (t.isFunction(parent)) break;
				if (position === null) {
					if (t.isVariableDeclarator(parent)) {
						const declaration = parents.get(parent);
						if (t.isVariableDeclaration(declaration)) position = statementPosition(declaration, parents, parent);
					} else if (t.isStatement(parent)) position = statementPosition(parent, parents);
				}
				current = parent;
			}
			return selectInitializers(binding, position, parents, true);
		};
		selectInitializers = (binding, position, parents, atRead = false) => {
			if (position === null) return binding;
			const origins = [...binding.initializers.map((initializer) => ({
				initializer,
				position: initializer.entryBody === undefined ? directInitializerPosition(initializer.node, parents) : {
					body: initializer.entryBody.body,
					index: -1,
					declaratorIndex: -1
				}
			})), ...binding.referenceInitializers.map((initializer) => ({
				initializer,
				position: referenceInitializerPosition(initializer.node, parents)
			}))];
			if (origins.some(({ position: origin }) => origin === null || origin.body !== position.body || !atRead && !positionPrecedes(origin, position))) return binding;
			const preceding = atRead ? origins.filter(({ position: origin }) => origin !== null && positionPrecedes(origin, position)) : origins;
			const latest = preceding.reduce((latest, { position }) => position !== null && (latest === null || positionPrecedes(latest, position)) ? position : latest, null);
			const retained = new Set(preceding.filter(({ position }) => position?.index === latest?.index && position?.declaratorIndex === latest?.declaratorIndex).map(({ initializer }) => initializer));
			if (binding.initializers.every((initializer) => retained.has(initializer)) && binding.referenceInitializers.every((initializer) => retained.has(initializer))) return binding;
			return {
				initializers: binding.initializers.filter((initializer) => retained.has(initializer)),
				referenceInitializers: binding.referenceInitializers.filter((initializer) => retained.has(initializer))
			};
		};
		semanticCapturePosition = (node, parents) => {
			let current = node;
			while (true) {
				const direct = directInitializerPosition(current, parents);
				if (direct !== null) return direct;
				const parent = parents.get(current);
				if (t.isObjectProperty(parent) && parent.value === current && semanticStaticPropertyKey(parent.key, parent.computed) !== null) current = parent;
				else if (t.isObjectExpression(parent) || t.isArrayExpression(parent)) current = parent;
				else return null;
			}
		};
		semanticBindingPrecedesCapture = (binding, capture, parents) => {
			const initializer = binding.initializers[0];
			if (binding.initializers.length !== 1 || initializer === undefined) return false;
			const sourcePosition = directInitializerPosition(initializer.node, parents);
			const capturePosition = semanticCapturePosition(capture, parents);
			return sourcePosition !== null && capturePosition !== null && positionPrecedes(sourcePosition, capturePosition);
		};
		semanticEscapeFollowsCapture = (binding, capture, escape, parents) => {
			const initializer = binding.initializers[0];
			if (escape === undefined || initializer === undefined || !semanticBindingPrecedesCapture(binding, capture, parents)) return false;
			const origin = unwrapJavaScriptExpression(initializer.node).node;
			if (!t.isObjectExpression(origin) && !t.isArrayExpression(origin) && !t.isIdentifier(origin) && !t.isMemberExpression(origin) && !t.isOptionalMemberExpression(origin)) return false;
			const capturePosition = semanticCapturePosition(capture, parents);
			const escapePosition = directMutationPosition(escape, parents);
			return capturePosition !== null && escapePosition !== null && positionPrecedes(capturePosition, escapePosition);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptElectronMemberWrites.js
/**
* Index writes through possible lexical object identities. Resolve the complete
* object before appending the written key: self-reference properties can denote
* the same object, while replacing that property is a distinct write.
*/
function* collectJavaScriptIdentityWritesSteps(program, origin, intrinsicInvocation, staticString, freshObject, retain) {
	const objectMutators = new Set([
		"defineProperty",
		"defineProperties",
		"assign",
		"setPrototypeOf"
	]);
	const reflectMutators = new Set([
		"set",
		"deleteProperty",
		"defineProperty",
		"setPrototypeOf"
	]);
	const keyedMutators = new Set([
		"set",
		"deleteProperty",
		"defineProperty"
	]);
	yield* traverseJavaScriptAstSteps(program, { enter: (node) => {
		if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
			const invocation = intrinsicInvocation(node);
			if (invocation?.kind === "opaque") {
				for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
				return;
			}
			const callee = invocation?.path;
			const arguments_ = invocation?.arguments;
			const method = callee?.at(-1);
			const owner = callee?.length === 3 ? callee[1] : undefined;
			if (owner === "Object" && objectMutators.has(method ?? "") || owner === "Reflect" && reflectMutators.has(method ?? "")) {
				const targets = owner === "Reflect" && method === "set" && arguments_ !== undefined && (arguments_.length >= 4 || arguments_.some(t.isSpreadElement)) ? [arguments_[0], arguments_.some(t.isSpreadElement) ? undefined : arguments_[3]] : [arguments_?.[0]];
				for (const target of targets) {
					if (target === undefined || t.isSpreadElement(target)) {
						for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
					}
					if (t.isNode(target) && !t.isSpreadElement(target)) {
						const identities = origin(target, "member", node);
						if (identities.length > 0) {
							const key = keyedMutators.has(method ?? "") ? [staticString(arguments_?.[1]) ?? null] : [];
							for (const identity of identities) retain(node, [...identity, ...key]);
						} else if (!freshObject(target)) {
							for (const scope of origin(node, "opaque-call", node)) retain(node, scope);
						}
					}
				}
			}
		}
		const target = semanticWriteSiteTarget(node);
		if (target === null) return;
		for (const leaf of semanticWriteTargets(target)) {
			if (t.isIdentifier(leaf)) {
				for (const identity of origin(leaf, "binding", node)) retain(node, identity);
				continue;
			}
			const member = unwrapJavaScriptExpression(leaf).node;
			if (!t.isMemberExpression(member) && !t.isOptionalMemberExpression(member)) continue;
			const key = semanticStaticPropertyKey(member.property, member.computed);
			for (const identity of origin(member.object, "member", node)) retain(node, [...identity, key]);
		}
	} });
}
var ELECTRON_MODULE, electronExportPath, ELECTRON_IDENTITY_LIMITATION, electronMemberPath;
function init_javascriptElectronMemberWrites() {
	return (init_javascriptElectronMemberWrites = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticTraversal();
		ELECTRON_MODULE = /^electron(?:\/(?:common|main|renderer|utility))?$/u;
		electronExportPath = (importedPath) => importedPath[0] === "default" ? importedPath.slice(1) : importedPath;
		ELECTRON_IDENTITY_LIMITATION = "Electron API identity follows proven lexical module aliases and structurally verified module-namespace interop. Other reassignments, dynamic selections, and visibly overwritten namespace members are unresolved; missing findings do not establish absence. Arbitrary call side effects and runtime registration are not evaluated.";
		electronMemberPath = (node) => {
			let root = unwrapJavaScriptExpression(node).node;
			const members = [];
			while (t.isMemberExpression(root) || t.isOptionalMemberExpression(root)) {
				members.push(semanticStaticPropertyKey(root.property, root.computed));
				root = unwrapJavaScriptExpression(root.object).node;
			}
			return {
				root,
				members: members.toReversed()
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptIntrinsicInvocation.js
var expandJavaScriptInvocationArguments, arrayArguments, invocationArguments, resolveJavaScriptIntrinsicInvocation;
function init_javascriptIntrinsicInvocation() {
	return (init_javascriptIntrinsicInvocation = __esmMin((() => {
		init_javascriptAstValues();
		expandJavaScriptInvocationArguments = (arguments_) => {
			const expanded = [];
			const pending = [...arguments_].reverse();
			while (pending.length > 0) {
				const argument = pending.pop();
				if (argument === undefined) break;
				const array = t.isSpreadElement(argument) ? unwrapJavaScriptExpression(argument.argument).node : undefined;
				if (t.isArrayExpression(array) && array.elements.every((element) => t.isExpression(element) || t.isSpreadElement(element))) for (let index = array.elements.length - 1; index >= 0; index -= 1) {
					const element = array.elements[index];
					if (element !== null && element !== undefined) pending.push(element);
				}
				else expanded.push(argument);
			}
			return expanded;
		};
		arrayArguments = (node) => {
			const array = node === undefined ? undefined : unwrapJavaScriptExpression(node).node;
			if (!t.isArrayExpression(array) || array.elements.some((element) => element === null)) return undefined;
			const expanded = expandJavaScriptInvocationArguments(array.elements.filter((element) => element !== null));
			return expanded.every((element) => t.isExpression(element)) ? expanded.filter((element) => t.isExpression(element)) : undefined;
		};
		invocationArguments = (method, arguments_) => t.isSpreadElement(arguments_?.[0]) ? undefined : method === "apply" ? arrayArguments(arguments_?.[1]) : arguments_?.slice(1);
		resolveJavaScriptIntrinsicInvocation = (node, intrinsicPath, boundIntrinsic, intrinsicReadChanged) => {
			const visited = new Set();
			let callee = node.callee;
			let arguments_ = expandJavaScriptInvocationArguments(node.arguments);
			let receiver;
			let explicitReceiver = false;
			for (;;) {
				callee = unwrapJavaScriptExpression(callee).node;
				if (t.isSequenceExpression(callee)) {
					const finalExpression = callee.expressions.at(-1);
					if (finalExpression === undefined) return undefined;
					explicitReceiver = true;
					callee = finalExpression;
					continue;
				}
				if (visited.has(callee)) return undefined;
				visited.add(callee);
				let path = intrinsicPath(callee);
				if (path !== undefined && intrinsicReadChanged(callee, path)) return {
					kind: "opaque",
					path,
					arguments: undefined
				};
				if (path === undefined) {
					if (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) {
						const method = semanticStaticPropertyKey(callee.property, callee.computed);
						if (method === "call" || method === "apply") {
							const bound = boundIntrinsic(callee.object);
							if (bound !== undefined && intrinsicReadChanged(callee, [...bound.path, method])) return {
								kind: "opaque",
								path: bound.path,
								arguments: undefined
							};
							receiver = arguments_?.[0];
							explicitReceiver = true;
							callee = callee.object;
							arguments_ = invocationArguments(method, arguments_);
							continue;
						}
					}
					const bound = boundIntrinsic(callee);
					if (bound === undefined) return undefined;
					if (bound.kind === "opaque") return bound;
					path = bound.path;
					receiver = bound.receiver;
					explicitReceiver = true;
					arguments_ = bound.arguments === undefined ? undefined : [...bound.arguments, ...arguments_ ?? []];
				}
				const method = path.length > 3 ? path.at(-1) : undefined;
				if (method === "call" || method === "apply") {
					const callable = explicitReceiver ? receiver : t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee) ? callee.object : undefined;
					if (!t.isExpression(callable)) return {
						kind: "opaque",
						path,
						arguments: undefined
					};
					callee = callable;
					receiver = arguments_?.[0];
					explicitReceiver = true;
					arguments_ = invocationArguments(method, arguments_);
					continue;
				}
				if (path.join(".") === "intrinsic.Reflect.apply") {
					const callable = arguments_?.[0];
					if (!t.isExpression(callable)) return undefined;
					callee = callable;
					receiver = arguments_?.[1];
					explicitReceiver = true;
					arguments_ = arrayArguments(arguments_?.[2]);
					continue;
				}
				return {
					kind: "known",
					path,
					arguments: arguments_,
					...receiver === undefined ? {} : { receiver }
				};
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptModuleInterop.js
var TO_ESM, COPY_PROPS, INTRINSICS, createSemanticModuleInterop, identityFunction, unprojectedInitializer, canonicalRoles, controlBodyOperation;
function init_javascriptModuleInterop() {
	return (init_javascriptModuleInterop = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticTraversal();
		init_javascriptElectronMemberWrites();
		init_javascriptIntrinsicInvocation();
		init_javascriptSemanticPropertyPaths();
		init_javascriptAstValues();
		TO_ESM = parseExpression(`(mod, isNodeMode, target) => (
  target = mod != null ? __create(__getProtoOf(mod)) : {},
  __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default")
    ? __defProp(target, "default", {value: mod, enumerable: true}) : target, mod)
)`);
		COPY_PROPS = parseExpression(`(to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function")
    for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
      key = keys[i];
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: ((k) => from[k]).bind(null, key),
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
  return to;
}`);
		INTRINSICS = {
			__create: ["Object", "create"],
			__getProtoOf: ["Object", "getPrototypeOf"],
			__defProp: ["Object", "defineProperty"],
			__getOwnPropNames: ["Object", "getOwnPropertyNames"],
			__getOwnPropDesc: ["Object", "getOwnPropertyDescriptor"],
			__hasOwnProp: [
				"Object",
				"prototype",
				"hasOwnProperty"
			]
		};
		createSemanticModuleInterop = (state, options) => {
			const helpers = new Map();
			const origins = new Map();
			const calls = new WeakMap();
			const intrinsicBindings = new Map();
			const writes = [];
			const invalidatedBindings = new Map();
			const invalidatedCalls = new WeakMap();
			const opaqueMutationPath = (node) => {
				let current = node;
				while (current !== undefined) {
					if (t.isFunction(current)) return ["opaque-intrinsic", semanticScopeId("function", current)];
					current = state.parentsByNode.get(current);
				}
				return ["intrinsic"];
			};
			const intrinsicPath = options?.intrinsicPath ?? ((node) => {
				let current = node;
				const visited = new Set();
				const pending = [];
				let suffix = [];
				const finish = (path) => {
					for (const binding of pending) intrinsicBindings.set(binding.id, path === undefined ? null : path.slice(0, path.length - binding.suffixLength));
					return path;
				};
				for (;;) {
					const { root, members } = electronMemberPath(current);
					if (members.some((member) => member === null)) return finish(undefined);
					suffix = [...members, ...suffix];
					for (const global of [
						"Object",
						"Function",
						"Reflect"
					]) if (isUnshadowedGlobal(root, state, global)) return finish([
						"intrinsic",
						global,
						...suffix
					]);
					for (const global of [
						"globalThis",
						"global",
						"window",
						"self"
					]) if (isUnshadowedGlobal(root, state, global)) return finish(["intrinsic", ...suffix]);
					if (!t.isIdentifier(root)) return finish(undefined);
					const binding = resolveSemanticBindingState(state, root, root.name);
					const cached = binding === undefined ? undefined : intrinsicBindings.get(binding.bindingId);
					if (cached !== undefined) return finish(cached === null ? undefined : [...cached, ...suffix]);
					const initializer = semanticStableInitializer(binding, state);
					if (binding === undefined || initializer === undefined || initializer.projection.some((segment) => segment === null) || visited.has(binding.bindingId)) return finish(undefined);
					visited.add(binding.bindingId);
					pending.push({
						id: binding.bindingId,
						suffixLength: suffix.length
					});
					suffix = [...initializer.projection.map(String), ...suffix];
					current = initializer.node;
				}
			});
			const capturedIntrinsic = (node) => {
				const path = intrinsicPath(node);
				if (path === undefined) return undefined;
				const visited = new Set();
				let current = node;
				let capturedAt = node;
				let suffixLength = 0;
				for (;;) {
					const { root, members } = electronMemberPath(current);
					suffixLength += members.length;
					if (!t.isIdentifier(root)) return undefined;
					const binding = resolveSemanticBindingState(state, root, root.name);
					if (binding === undefined) return {
						path,
						capturedAt
					};
					const initializer = semanticStableInitializer(binding, state);
					if (initializer === undefined || (initializer.node.end ?? Infinity) >= (root.start ?? -1) || visited.has(binding.bindingId)) return undefined;
					visited.add(binding.bindingId);
					if (suffixLength === 0) capturedAt = initializer.node;
					suffixLength += initializer.projection.length;
					current = initializer.node;
				}
			};
			const staticString = (node) => {
				if (node === undefined) return undefined;
				const visited = new Set();
				let current = node;
				for (;;) {
					const literal = readExactJavaScriptLiteral(current);
					if (literal.found) return typeof literal.value === "string" ? literal.value : undefined;
					const expression = unwrapJavaScriptExpression(current).node;
					if (!t.isIdentifier(expression)) return undefined;
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					const initializer = semanticStableInitializer(binding, state);
					if (binding === undefined || initializer === undefined || initializer.projection.length !== 0 || (initializer.node.end ?? Infinity) >= (expression.start ?? -1) || visited.has(binding.bindingId)) return undefined;
					visited.add(binding.bindingId);
					current = initializer.node;
				}
			};
			const intrinsicReadChanged = (node, path) => {
				const capture = capturedIntrinsic(node)?.capturedAt ?? node;
				const scope = opaqueMutationPath(capture).join(".");
				const method = path.at(-1);
				const invocationMethod = method === "bind" || method === "call" || method === "apply";
				return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capture.start ?? -1) && (write.coverage.covers(path) || invocationMethod && write.coverage.covers([
					"intrinsic",
					"Function",
					"prototype",
					method
				])));
			};
			const resolveBoundIntrinsic = (node) => {
				const visited = new Set();
				const argumentGroups = [];
				const bindReads = [];
				let opaqueArguments = false;
				let receiver;
				let current = node;
				for (;;) {
					current = unwrapJavaScriptExpression(current).node;
					if (t.isIdentifier(current)) {
						const binding = resolveSemanticBindingState(state, current, current.name);
						const initializer = semanticStableInitializer(binding, state);
						if (binding === undefined || initializer === undefined || initializer.projection.length !== 0 || (initializer.node.end ?? Infinity) >= (current.start ?? -1) || visited.has(binding.bindingId)) return undefined;
						visited.add(binding.bindingId);
						current = initializer.node;
						continue;
					}
					if (!t.isCallExpression(current)) return undefined;
					const { root, members } = electronMemberPath(current.callee);
					let bindTarget = root;
					let bindingArguments = expandJavaScriptInvocationArguments(current.arguments);
					let captured = capturedIntrinsic(current.callee);
					let terminal = captured?.path.at(-1) === "bind";
					let path = captured?.path.slice(0, -1);
					if (members.at(-1) === "bind") {
						if (!terminal && members.length !== 1) return undefined;
						bindReads.push(captured?.capturedAt ?? current.callee);
					} else {
						const invocation = resolveJavaScriptIntrinsicInvocation(current, intrinsicPath, boundIntrinsic, intrinsicReadChanged);
						if (invocation?.kind !== "known" || invocation.path.join(".") !== "intrinsic.Function.prototype.bind" || invocation.receiver === undefined) return undefined;
						bindTarget = invocation.receiver;
						bindingArguments = invocation.arguments;
						captured = capturedIntrinsic(bindTarget);
						terminal = captured !== undefined;
						path = captured?.path;
					}
					receiver = bindingArguments?.[0];
					const ownArguments = bindingArguments?.slice(1) ?? [];
					opaqueArguments ||= bindingArguments === undefined || t.isSpreadElement(receiver);
					opaqueArguments ||= ownArguments.some((argument) => t.isSpreadElement(argument));
					argumentGroups.push(ownArguments);
					if (!terminal || path === undefined) {
						current = bindTarget;
						continue;
					}
					const boundPath = [...path, "bind"];
					const functionBind = [
						"intrinsic",
						"Function",
						"prototype",
						"bind"
					];
					opaqueArguments ||= bindReads.some((capture) => {
						const scope = opaqueMutationPath(capture).join(".");
						return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capture.start ?? -1) && (write.coverage.covers(boundPath) || write.coverage.covers(functionBind)));
					});
					return {
						kind: opaqueArguments ? "opaque" : "known",
						path,
						...receiver === undefined ? {} : { receiver },
						arguments: opaqueArguments ? undefined : argumentGroups.toReversed().flat()
					};
				}
			};
			const activeBoundValues = new WeakSet();
			const boundIntrinsic = (node) => {
				if (activeBoundValues.has(node)) return undefined;
				activeBoundValues.add(node);
				try {
					return resolveBoundIntrinsic(node);
				} finally {
					activeBoundValues.delete(node);
				}
			};
			const isFreshObject = (node) => {
				const visited = new Set();
				let current = node;
				for (;;) {
					current = unwrapJavaScriptExpression(current).node;
					if (t.isObjectExpression(current) || t.isArrayExpression(current) || t.isFunction(current) || t.isClass(current) && !current.decorators?.length || t.isRegExpLiteral(current)) return true;
					if (!t.isIdentifier(current)) return false;
					const binding = resolveSemanticBindingState(state, current, current.name);
					const initializer = unprojectedInitializer(binding, state);
					if (binding === undefined || initializer === undefined || !t.isFunctionDeclaration(initializer) && (initializer.end ?? Infinity) >= (current.start ?? -1) || visited.has(binding.bindingId)) return false;
					visited.add(binding.bindingId);
					current = initializer;
				}
			};
			const helperProof = (binding) => {
				const cached = helpers.get(binding.bindingId);
				if (cached !== undefined) return cached ?? undefined;
				helpers.set(binding.bindingId, null);
				if (state.scopesById.get(binding.scopeId)?.kind !== "program") return undefined;
				const wrapper = unprojectedInitializer(binding, state);
				if (wrapper === undefined) return undefined;
				if (identityFunction(wrapper, state)) {
					const proof = {
						dependencies: [],
						readyAfter: t.isFunctionDeclaration(wrapper) ? -1 : wrapper.end ?? Infinity,
						identity: true
					};
					helpers.set(binding.bindingId, proof);
					return proof;
				}
				const wrapperRoles = canonicalRoles(wrapper, TO_ESM, state);
				const copyBinding = wrapperRoles?.get("__copyProps");
				const copy = unprojectedInitializer(copyBinding, state);
				const copyRoles = copy === undefined ? undefined : canonicalRoles(copy, COPY_PROPS, state);
				if (wrapperRoles === undefined || copyRoles === undefined || copy === undefined) return undefined;
				const dependencies = [];
				let readyAfter = Math.max(wrapper.end ?? Infinity, copy.end ?? Infinity);
				for (const roles of [wrapperRoles, copyRoles]) for (const [role, dependency] of roles) {
					const expected = INTRINSICS[role];
					if (expected === undefined) continue;
					const initializer = unprojectedInitializer(dependency, state);
					const captured = initializer === undefined ? undefined : capturedIntrinsic(initializer);
					if (initializer === undefined || captured === undefined || JSON.stringify(captured.path) !== JSON.stringify(["intrinsic", ...expected])) return undefined;
					readyAfter = Math.max(readyAfter, initializer.end ?? Infinity);
					dependencies.push(captured);
					if (role === "__hasOwnProp") dependencies.push({ path: [...captured.path, "call"] });
				}
				dependencies.push({ path: [
					"intrinsic",
					"Function",
					"prototype",
					"bind"
				] }, { path: [
					"intrinsic",
					"Function",
					"prototype",
					"call"
				] });
				const proof = {
					dependencies,
					identity: false,
					readyAfter
				};
				helpers.set(binding.bindingId, proof);
				return proof;
			};
			const provenCall = (node) => {
				if (!t.isCallExpression(node) || !t.isIdentifier(node.callee)) return undefined;
				const helper = resolveSemanticBindingState(state, node.callee, node.callee.name);
				const proof = helper === undefined ? undefined : helperProof(helper);
				const input = node.arguments[0];
				const mode = node.arguments[1];
				const literalMode = mode === undefined ? {
					found: true,
					value: false
				} : t.isExpression(mode) ? readExactJavaScriptLiteral(mode) : { found: false };
				if (proof === undefined || proof.readyAfter >= (node.start ?? -1) || !t.isExpression(input) || node.arguments.length > 2 || !literalMode.found) return undefined;
				return {
					input,
					defaultIsModule: !proof.identity && Boolean(literalMode.value),
					dependencies: proof.dependencies.map((dependency) => ({
						...dependency,
						capturedAt: dependency.capturedAt ?? node
					}))
				};
			};
			const callOrigin = (node) => {
				const cached = calls.get(node);
				if (cached !== undefined) return cached;
				const { root, members } = electronMemberPath(node);
				if (!members.every((member) => member !== null)) return undefined;
				const converted = provenCall(root);
				const required = converted === undefined ? undefined : semanticRequireOrigin(converted.input, state)?.origin;
				if (converted === undefined || required === undefined || required.importedPath.length !== 0 || members[0] === "default" && !converted.defaultIsModule) return undefined;
				const result = {
					origin: {
						...required,
						importedPath: members
					},
					dependencies: converted.dependencies,
					defaultIsModule: converted.defaultIsModule
				};
				calls.set(node, result);
				return result;
			};
			const origin = (binding) => {
				const single = semanticStableInitializer(binding, state);
				if (single !== undefined) {
					if (!single.projection.every((key) => typeof key === "string")) return undefined;
					const converted = callOrigin(single.node);
					if (converted?.origin.importedPath.length === 0 && single.projection[0] === "default" && !converted.defaultIsModule) return undefined;
					const result = converted === undefined ? undefined : {
						...converted,
						origin: {
							...converted.origin,
							importedPath: [...converted.origin.importedPath, ...single.projection]
						}
					};
					if (result !== undefined) origins.set(binding.bindingId, result);
					return result;
				}
				const [initial, converted] = binding.initializers;
				if (binding.definitions.length !== 2 || binding.definitions[0]?.kind !== "variable" || binding.definitions[1]?.kind !== "assignment" || binding.initializers.length !== 2 || initial === undefined || converted === undefined || initial.projection.length !== 0 || converted.projection.length !== 0 || state.conditionallySkippedExpressions.has(initial.node)) return undefined;
				const call = converted.node;
				const assignment = state.parentsByNode.get(call);
				const statement = assignment === undefined ? undefined : state.parentsByNode.get(assignment);
				const declaration = state.parentsByNode.get(initial.node);
				const declarationStatement = declaration === undefined ? undefined : state.parentsByNode.get(declaration);
				if (!t.isCallExpression(call) || !t.isIdentifier(call.callee) || !t.isAssignmentExpression(assignment, { operator: "=" }) || assignment.right !== call || !t.isIdentifier(assignment.left, { name: binding.name }) || !t.isExpressionStatement(statement) || !t.isVariableDeclarator(declaration) || !t.isVariableDeclaration(declarationStatement) || state.parentsByNode.get(statement) !== state.parentsByNode.get(declarationStatement) || (initial.node.start ?? Infinity) >= (call.start ?? -1)) return undefined;
				const convertedCall = provenCall(call);
				const input = convertedCall?.input;
				if (!t.isIdentifier(input) || resolveSemanticBindingState(state, input, input.name) !== binding) return undefined;
				const required = semanticRequireOrigin(initial.node, state)?.origin;
				if (required === undefined || required.importedPath.length !== 0) return undefined;
				if (convertedCall === undefined) return undefined;
				const result = {
					origin: required,
					dependencies: convertedCall.dependencies,
					defaultIsModule: convertedCall.defaultIsModule
				};
				origins.set(binding.bindingId, result);
				return result;
			};
			const invalidatedOrigin = (record) => record?.dependencies.some(({ path, capturedAt }) => {
				if (capturedAt === undefined) return true;
				const scope = opaqueMutationPath(capturedAt).join(".");
				return writes.some((write) => (write.scope === scope || write.scope === "intrinsic") && write.offset < (capturedAt.start ?? -1) && write.coverage.covers(path));
			}) ?? false;
			return {
				origin,
				callOrigin,
				intrinsicPath,
				intrinsicInvocation: (node) => resolveJavaScriptIntrinsicInvocation(node, intrinsicPath, boundIntrinsic, intrinsicReadChanged),
				boundIntrinsic,
				staticString,
				isFreshObject,
				opaqueMutationPath,
				retainWrite: (node, path) => {
					const coverage = new SemanticPropertyPathCoverage();
					coverage.retain(path[0] === "opaque-intrinsic" ? ["intrinsic"] : path);
					writes.push({
						scope: opaqueMutationPath(node).join("."),
						offset: node.start ?? Infinity,
						coverage
					});
				},
				invalidated: (binding) => {
					const cached = invalidatedBindings.get(binding.bindingId);
					if (cached !== undefined) return cached;
					const result = invalidatedOrigin(origins.get(binding.bindingId));
					invalidatedBindings.set(binding.bindingId, result);
					return result;
				},
				invalidatedCall: (node) => {
					const cached = invalidatedCalls.get(node);
					if (cached !== undefined) return cached;
					const result = invalidatedOrigin(calls.get(node));
					invalidatedCalls.set(node, result);
					return result;
				}
			};
		};
		identityFunction = (node, state) => {
			if (!t.isFunction(node) || node.async || node.generator || runtimeFunctionParameters(node).length !== 1) return false;
			const parameter = runtimeFunctionParameters(node)[0];
			const result = t.isBlockStatement(node.body) ? node.body.body.length === 1 && t.isReturnStatement(node.body.body[0]) ? node.body.body[0].argument : undefined : node.body;
			return t.isIdentifier(parameter) && t.isIdentifier(result) && resolveSemanticBindingState(state, parameter, parameter.name) !== undefined && resolveSemanticBindingState(state, parameter, parameter.name) === resolveSemanticBindingState(state, result, result.name);
		};
		unprojectedInitializer = (binding, state) => {
			const initializer = semanticStableInitializer(binding, state);
			return initializer?.projection.length === 0 ? initializer.node : undefined;
		};
		canonicalRoles = (actual, pattern, state) => {
			const roles = new Map();
			const used = new Map();
			const pending = [{
				actual,
				pattern,
				parent: null
			}];
			while (pending.length !== 0) {
				const pair = pending.pop();
				if (pair === undefined) return undefined;
				const { parent } = pair;
				const controlBody = t.isIfStatement(parent) && (parent.consequent === pair.pattern || parent.alternate === pair.pattern) || t.isForStatement(parent) && parent.body === pair.pattern;
				const node = controlBody ? controlBodyOperation(pair.actual) : pair.actual;
				const expected = controlBody ? controlBodyOperation(pair.pattern) : pair.pattern;
				if (node.type !== expected.type) return undefined;
				const literalKey = parent !== null && (t.isMemberExpression(parent) && !parent.computed && parent.property === expected || t.isObjectProperty(parent) && !parent.computed && parent.key === expected);
				if (t.isIdentifier(expected) && t.isIdentifier(node) && !literalKey) {
					const binding = resolveSemanticBindingState(state, node, node.name);
					if (binding === undefined || roles.has(expected.name) && roles.get(expected.name) !== binding || used.has(binding.bindingId) && used.get(binding.bindingId) !== expected.name) return undefined;
					roles.set(expected.name, binding);
					used.set(binding.bindingId, expected.name);
				}
				const visitorKeys = javaScriptAstChildKeys(expected);
				for (const [key, field] of Object.entries(t.NODE_FIELDS[expected.type] ?? {})) {
					if (visitorKeys.includes(key) || t.isIdentifier(expected) && key === "name" && !literalKey) continue;
					const fallback = Reflect.get(field, "default");
					if (JSON.stringify(Reflect.get(node, key) ?? fallback) !== JSON.stringify(Reflect.get(expected, key) ?? fallback)) return undefined;
				}
				const children = childNodes(node), expectedChildren = childNodes(expected);
				if (children.length !== expectedChildren.length) return undefined;
				for (const [index, child] of children.entries()) {
					const expectedChild = expectedChildren[index];
					if (expectedChild !== undefined) pending.push({
						actual: child,
						pattern: expectedChild,
						parent: expected
					});
				}
			}
			return roles;
		};
		controlBodyOperation = (node) => {
			while (t.isBlockStatement(node) && node.directives.length === 0 && node.body.length === 1) {
				const statement = node.body[0];
				if (statement === undefined) break;
				node = statement;
			}
			return node;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticRequireOrigin.js
var semanticRequireLoaderAt, semanticFactoryRequireLoaderAt, semanticFactoryLoaderMemberAt, isSemanticCreateRequireBinding, isWrapperRequireInitializerCall, globalProcessReplacements, moduleRequireWrites, writesModuleRequire, semanticOriginalGlobalProcessAt, semanticGlobalProcessOrigin, semanticGlobalProcessPathOrigin, semanticMemberChain, semanticRequireOrigin, semanticRequireExportsIdentity, MUTABLE_BUILTIN_DEFAULTS, semanticMutableBuiltinOrigin;
function init_javascriptSemanticRequireOrigin() {
	return (init_javascriptSemanticRequireOrigin = __esmMin((() => {
		init_javascriptSemanticTraversal();
		init_javascriptBuiltinResourceMethods();
		init_javascriptSemanticState();
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticMutationInitializers();
		init_javascriptModuleInterop();
		semanticRequireLoaderAt = (node, state, factoryBindingIds) => {
			if (!t.isIdentifier(node.callee, { name: "require" })) return "local";
			const binding = resolveSemanticBindingState(state, node.callee, "require");
			if (binding === undefined) return semanticResolutionBlocked(state, node.callee, "require") ? "unknown" : "commonjs-loader";
			if (factoryBindingIds.has(binding.bindingId)) return binding.initializers.length === 0 ? "factory-loader" : "unknown";
			if (isWrapperRequireInitializerCall(binding, node, state)) return "commonjs-loader";
			if (isUnmodifiedCommonJsWrapperBinding(node.callee, "require", state)) return "commonjs-loader";
			if (isSemanticCreateRequireBinding(binding, state)) return "create-require";
			const initializer = semanticStableInitializer(binding, state)?.node;
			if ((binding.kind === "function" || binding.kind === "class") && initializer !== undefined) return "local";
			if (binding.declarationKinds.size === 1 && binding.declarationKinds.has("const") && (t.isFunctionExpression(initializer) || t.isArrowFunctionExpression(initializer))) return "local";
			return "unknown";
		};
		semanticFactoryRequireLoaderAt = (node, state, bindingIds) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			if (t.isIdentifier(callee)) return semanticFactoryLoaderMemberAt(node, state, bindingIds, null);
			if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === "bind") return semanticFactoryLoaderMemberAt(node, state, bindingIds, "bind");
			return undefined;
		};
		semanticFactoryLoaderMemberAt = (node, state, bindingIds, member) => {
			const callee = unwrapJavaScriptExpression(node.callee).node;
			let loader;
			if (member === null) {
				if (t.isIdentifier(callee)) loader = callee;
			} else if ((t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) && semanticStaticPropertyKey(callee.property, callee.computed) === member) {
				const root = unwrapJavaScriptExpression(callee.object).node;
				if (t.isIdentifier(root)) loader = root;
			}
			if (loader === undefined) return undefined;
			const binding = resolveSemanticBindingState(state, loader, loader.name);
			if (binding === undefined || !bindingIds.has(binding.bindingId)) return undefined;
			return binding.initializers.length === 0 ? "factory-loader" : "unknown";
		};
		isSemanticCreateRequireBinding = (binding, state) => {
			if (binding.initializers.length !== 1) return false;
			const initializer = semanticStableInitializer(binding, state)?.node;
			if (!t.isCallExpression(initializer)) return false;
			const callee = unwrapJavaScriptExpression(initializer.callee).node;
			if (t.isIdentifier(callee)) {
				const origins = resolveSemanticBindingState(state, callee, callee.name)?.directOrigins;
				if (origins?.length !== 1) return false;
				const [origin] = origins;
				return origin?.importedPath.at(-1) === "createRequire" && ["module", "node:module"].includes(origin.specifier);
			}
			const chain = semanticMemberChain(callee);
			if (chain === undefined || chain.members.at(-1) !== "createRequire") return false;
			if (!t.isNode(chain.root)) return false;
			const root = unwrapJavaScriptExpression(chain.root).node;
			if (!t.isIdentifier(root)) return false;
			const origins = resolveSemanticBindingState(state, root, root.name)?.directOrigins;
			if (origins?.length !== 1) return false;
			const [origin] = origins;
			return origin?.importedPath.length === 0 && ["module", "node:module"].includes(origin.specifier);
		};
		isWrapperRequireInitializerCall = (binding, node, state) => {
			const scope = state.scopesById.get(binding.scopeId);
			if (scope?.kind !== "program" || binding.kind !== "variable" || binding.declarationKinds.size !== 1 || !binding.declarationKinds.has("var") || binding.initializers.length !== 1 || binding.initializers[0]?.node !== node) return false;
			const assignment = state.parentsByNode.get(node);
			if (!t.isAssignmentExpression(assignment) || assignment.right !== node || state.conditionallySkippedExpressions.has(node)) return false;
			const statement = state.parentsByNode.get(assignment);
			if (!t.isExpressionStatement(statement)) return false;
			if (state.parentsByNode.get(statement) !== state.program) return false;
			const target = unwrapJavaScriptExpression(assignment.left).node;
			return t.isIdentifier(target, { name: "require" }) && resolveSemanticBindingState(state, target, target.name) === binding;
		};
		globalProcessReplacements = new WeakMap();
		moduleRequireWrites = new WeakMap();
		writesModuleRequire = (state) => {
			const cached = moduleRequireWrites.get(state);
			if (cached !== undefined) return cached;
			moduleRequireWrites.set(state, []);
			const writes = [];
			const interop = createSemanticModuleInterop(state);
			const isModuleObject = (node, visited = new Set()) => {
				const value = unwrapJavaScriptExpression(node).node;
				if (!t.isIdentifier(value)) return false;
				if (value.name === "module") return resolveSemanticBindingState(state, value, "module") === undefined ? !semanticResolutionBlocked(state, value, "module") : isUnmodifiedCommonJsWrapperBinding(value, "module", state);
				const binding = resolveSemanticBindingState(state, value, value.name);
				if (binding === undefined || visited.has(binding.bindingId)) return false;
				const next = new Set(visited).add(binding.bindingId);
				return binding.initializers.length > 0 && binding.initializers.every(({ node: init }) => isModuleObject(init, next));
			};
			traverseJavaScriptAst(state.program, { enter: (node) => {
				const target = t.isAssignmentExpression(node) ? node.left : t.isUpdateExpression(node) || t.isUnaryExpression(node, { operator: "delete" }) ? node.argument : undefined;
				if (target !== undefined) {
					const members = [];
					let root = target;
					while (t.isMemberExpression(root) || t.isOptionalMemberExpression(root)) {
						const key = semanticStaticPropertyKey(root.property, root.computed);
						if (key === null) break;
						members.unshift(key);
						root = root.object;
					}
					if (members.length === 1 && members[0] === "require" && isModuleObject(root)) writes.push(node);
					else if (members.length === 0 && (t.isMemberExpression(target) || t.isOptionalMemberExpression(target)) && target.computed && semanticStaticPropertyKey(target.property, true) === null && isModuleObject(target.object)) writes.push(node);
				}
				if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
					const invocation = interop.intrinsicInvocation(node);
					const owner = invocation?.path?.length === 3 ? invocation.path[1] : undefined;
					const method = invocation?.path?.at(-1);
					const args = invocation?.arguments;
					if ((owner === "Object" || owner === "Reflect") && method === "defineProperty" && isModuleObject(args?.[0] ?? t.nullLiteral())) {
						const key = interop.staticString(args?.[1]);
						if (key === "require" || key === undefined) writes.push(node);
					} else if (owner === "Object" && method === "defineProperties" && isModuleObject(args?.[0] ?? t.nullLiteral())) {
						const descriptors = args?.[1];
						if (!t.isObjectExpression(descriptors) || descriptors.properties.some((property) => t.isSpreadElement(property) || t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "require")) writes.push(node);
					} else if (owner === "Object" && method === "assign" && args?.some((arg) => isModuleObject(arg))) {
						const target = args?.[0];
						if (target !== undefined && isModuleObject(target)) {
							const sourceHasRequire = args?.slice(1).some((arg) => t.isObjectExpression(arg) && arg.properties.some((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "require"));
							if (sourceHasRequire || args?.slice(1).some((arg) => !t.isObjectExpression(arg))) writes.push(node);
						}
					}
				}
			} });
			moduleRequireWrites.set(state, writes);
			return writes;
		};
		semanticOriginalGlobalProcessAt = (node, state) => {
			let replacements = globalProcessReplacements.get(state);
			if (replacements === undefined) {
				replacements = [...state.ambientWriteEffects.filter(({ path }) => path.length <= 2 && path.every((key, index) => semanticPropertyPathKeyMatches(key, ["global", "process"][index]))).map(({ node: write }) => write), ...state.ambientBindingWrites.get("process") ?? []];
				globalProcessReplacements.set(state, replacements);
			}
			return !replacements.some((write) => !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode));
		};
		semanticGlobalProcessOrigin = (node, state) => t.isIdentifier(node, { name: "process" }) && resolveSemanticBindingState(state, node, "process") === undefined && !semanticResolutionBlocked(state, node, "process") && semanticOriginalGlobalProcessAt(node, state) ? {
			specifier: "node:process",
			importedPath: [],
			resolutionMode: "require"
		} : undefined;
		semanticGlobalProcessPathOrigin = (node, state) => {
			const members = [];
			let current = unwrapJavaScriptExpression(node).node;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null) return undefined;
				members.unshift(key);
				current = unwrapJavaScriptExpression(current.object).node;
			}
			if (!t.isIdentifier(current) || ![
				"globalThis",
				"global",
				"window",
				"self"
			].includes(current.name) || resolveSemanticBindingState(state, current, current.name) !== undefined || semanticResolutionBlocked(state, current, current.name) || members[0] !== "process" || !semanticOriginalGlobalProcessAt(node, state)) return undefined;
			return {
				specifier: "node:process",
				importedPath: members.slice(1),
				resolutionMode: "require"
			};
		};
		semanticMemberChain = (node) => {
			const members = [];
			let current = node;
			while (current !== null && current !== undefined) {
				current = unwrapJavaScriptExpression(current).node;
				if (!t.isMemberExpression(current) && !t.isOptionalMemberExpression(current)) break;
				const member = semanticStaticPropertyKey(current.property, current.computed);
				if (member === null || !t.isNode(current.object)) return undefined;
				members.push(member);
				current = current.object;
			}
			return {
				root: current,
				members: members.reverse()
			};
		};
		semanticRequireOrigin = (node, state) => {
			const chain = semanticMemberChain(node);
			const current = chain?.root;
			if (chain === undefined || !t.isCallExpression(current) || !t.isIdentifier(current.callee, { name: "require" })) return undefined;
			if (writesModuleRequire(state).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode))) return undefined;
			const requireBinding = resolveSemanticBindingState(state, current.callee, "require");
			if (requireBinding !== undefined && !isUnmodifiedCommonJsWrapperBinding(current.callee, "require", state) && !isWrapperRequireInitializerCall(requireBinding, current, state) || requireBinding === undefined && semanticResolutionBlocked(state, current.callee, "require") || (state.ambientBindingWrites.get("require") ?? []).some((write) => !semanticTopLevelEffectFollowsCapture(current, write, state.parentsByNode))) return undefined;
			const specifier = stringValue(current.arguments[0]);
			return specifier === undefined ? undefined : {
				origin: {
					specifier,
					importedPath: chain.members,
					resolutionMode: "require"
				},
				call: current
			};
		};
		semanticRequireExportsIdentity = (specifier, path) => {
			const name = specifier.replace(/^node:/u, "");
			if (name === "fs/promises") return {
				specifier: name,
				path
			};
			return name === "fs" && path[0] === "promises" && path.length > 1 ? {
				specifier: "fs/promises",
				path: path.slice(1)
			} : {
				specifier: name,
				path
			};
		};
		MUTABLE_BUILTIN_DEFAULTS = new Set([
			...Object.keys(BUILTIN_RESOURCE_METHODS),
			"http",
			"https",
			"child_process",
			"timers",
			"process"
		]);
		semanticMutableBuiltinOrigin = (origin, selected = []) => {
			const path = [...origin.importedPath, ...selected];
			if (origin.resolutionMode === "require") return {
				specifier: origin.specifier,
				path
			};
			const specifier = origin.specifier.replace(/^node:/u, "");
			if (!MUTABLE_BUILTIN_DEFAULTS.has(specifier)) return undefined;
			if (path[0] === "default") return {
				specifier,
				path: path.slice(1)
			};
			if (specifier === "process" && (path[0] === "env" || path[0] === "argv")) return {
				specifier,
				path
			};
			return specifier === "fs" && path[0] === "promises" ? {
				specifier,
				path
			} : undefined;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDependencies.js
var SemanticDependencyProofs;
function init_javascriptSemanticDependencies() {
	return (init_javascriptSemanticDependencies = __esmMin((() => {
		SemanticDependencyProofs = class {
			indices = new Map();
			singletons = new Map();
			height;
			constructor(bindings) {
				for (const binding of bindings) this.indices.set(binding, this.indices.size);
				this.height = Math.ceil(Math.log2(Math.max(1, this.indices.size)));
			}
			binding(binding) {
				const prior = this.singletons.get(binding);
				if (prior !== undefined) return prior;
				const index = this.index(binding);
				let proof = true;
				for (let bit = 0; bit < this.height; bit++) {
					const one = Math.floor(index / 2 ** bit) % 2 === 1;
					proof = Object.freeze({
						zero: one ? undefined : proof,
						one: one ? proof : undefined
					});
				}
				this.singletons.set(binding, proof);
				return proof;
			}
			union(first, second) {
				if (first === second || second === undefined) return first;
				if (first === undefined) return second;
				if (first === true || second === true) return true;
				const zero = this.union(first.zero, second.zero);
				const one = this.union(first.one, second.one);
				if (zero === first.zero && one === first.one) return first;
				if (zero === second.zero && one === second.one) return second;
				return Object.freeze({
					zero,
					one
				});
			}
			intersects(proof, active) {
				for (const binding of active.keys()) if (this.has(proof, binding)) return true;
				return false;
			}
			has(proof, binding) {
				const index = this.index(binding);
				for (let bit = this.height - 1; bit >= 0; bit--) {
					if (proof === undefined) return false;
					if (proof === true) return true;
					proof = Math.floor(index / 2 ** bit) % 2 === 1 ? proof.one : proof.zero;
				}
				return proof === true;
			}
			index(binding) {
				const index = this.indices.get(binding);
				if (index === undefined) throw new TypeError(`Unindexed semantic dependency: ${binding}`);
				return index;
			}
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticSlots.js
function semanticContainer(value) {
	if (value.status === "object") return {
		slots: value.properties,
		coverage: value.unknownProperties ? {
			status: "partial",
			omitted: value.omittedProperties
		} : {
			status: "complete",
			omitted: 0
		}
	};
	if (value.status === "array") return {
		slots: value.items,
		coverage: value.unknownItems ? {
			status: "partial",
			omitted: value.omittedItems
		} : {
			status: "complete",
			omitted: 0
		}
	};
	return null;
}
var semanticSlotAtPath, semanticPropertyPointer;
function init_javascriptSemanticSlots() {
	return (init_javascriptSemanticSlots = __esmMin((() => {
		semanticSlotAtPath = (value, path) => {
			const leafName = path.at(-1) ?? "";
			let current = {
				name: "",
				presence: "present",
				value
			};
			for (const [index, name] of path.entries()) {
				const container = semanticContainer(current.value);
				if (current.presence !== "present" || container === null) return {
					name: leafName,
					presence: "unknown-coverage",
					value: "reason" in current.value ? {
						...current.value,
						reason: `${current.value.reason} Cannot continue ${semanticPropertyPointer(path)} through receiver ${semanticPropertyPointer(path.slice(0, index))}.`
					} : {
						status: "unknown",
						reason: `Cannot resolve ${semanticPropertyPointer(path)} through ${current.value.status} receiver ${semanticPropertyPointer(path.slice(0, index))}.`
					}
				};
				if (current.value.status === "array" && name === "length") {
					current = {
						name,
						presence: "present",
						value: {
							status: "unknown",
							reason: "Array length is present but its value is not retained."
						}
					};
					continue;
				}
				const observed = container.slots.find((slot) => slot.name === name);
				current = observed ?? {
					name,
					presence: container.coverage.status === "complete" ? "absent" : "unknown-coverage",
					value: {
						status: "unknown",
						reason: `Own property ${name} was not observed.`
					}
				};
			}
			return current;
		};
		semanticPropertyPointer = (path) => path.map((key) => `/${key.replaceAll("~", "~0").replaceAll("/", "~1")}`).join("");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMutationValues.js
var invalidateSemanticEscapedPath, invalidateSemanticMutationPaths;
function init_javascriptSemanticMutationValues() {
	return (init_javascriptSemanticMutationValues = __esmMin((() => {
		init_javascriptSemanticPropertyPaths();
		invalidateSemanticEscapedPath = (value, path) => {
			if (value.status !== "object" && value.status !== "array") return value;
			const [key, ...remaining] = path;
			if (key === undefined) return {
				status: "unknown",
				reason: "This object reference may have been mutated by a call."
			};
			const invalidateChild = (property) => semanticPropertyPathKeyMatches(key, property.name) ? {
				...property,
				value: invalidateSemanticEscapedPath(property.value, remaining)
			} : property;
			return value.status === "object" ? {
				...value,
				properties: value.properties.map(invalidateChild)
			} : {
				...value,
				items: value.items.map(invalidateChild)
			};
		};
		invalidateSemanticMutationPaths = (value, paths) => {
			if (paths.length === 0) return value;
			if (value.status !== "object" && value.status !== "array" || paths.some(([key]) => key === undefined || key === null)) return {
				status: "unknown",
				reason: "This property may have been mutated."
			};
			const reset = value.status === "array" ? paths.findLastIndex(([key]) => key === "length") : -1;
			const base = reset < 0 ? value : {
				status: "array",
				items: [],
				unknownItems: true,
				omittedItems: null
			};
			const slots = base.status === "object" ? base.properties : base.items;
			const slotsByName = new Map();
			slots.forEach((property, index) => {
				const indexes = slotsByName.get(property.name) ?? [];
				indexes.push(index);
				slotsByName.set(property.name, indexes);
			});
			const slotPaths = new Map();
			const replacedSlots = new Set();
			const select = (index, remaining) => {
				const selected = slotPaths.get(index) ?? [];
				selected.push(remaining);
				slotPaths.set(index, selected);
				if (remaining.length === 0) replacedSlots.add(index);
			};
			const added = new Set();
			for (const [key, ...remaining] of paths.slice(reset + 1)) {
				if (key === undefined || key === null) continue;
				if (typeof key === "object") {
					slots.forEach((property, index) => {
						if (semanticPropertyPathKeyMatches(key, property.name)) select(index, remaining);
					});
					continue;
				}
				const indexes = slotsByName.get(String(key));
				if (indexes === undefined) added.add(String(key));
				else for (const index of indexes) select(index, remaining);
			}
			const properties = slots.map((property, index) => {
				const selected = slotPaths.get(index);
				return selected === undefined ? property : {
					...property,
					...replacedSlots.has(index) ? { presence: "unknown-coverage" } : {},
					value: invalidateSemanticMutationPaths(property.value, selected)
				};
			});
			for (const name of added) properties.push({
				name,
				value: {
					status: "unknown",
					reason: "This property may have been mutated."
				},
				presence: "unknown-coverage"
			});
			return base.status === "object" ? {
				...base,
				properties
			} : {
				...base,
				items: properties
			};
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProvenance.js
var semanticLocalProvenance, semanticUnresolvedProvenance, semanticAmbiguousProvenance, semanticOriginsProvenance, uniqueSemanticOrigins, semanticOriginKey, semanticPrimitiveKey, semanticBuiltinNamespacePath;
function init_javascriptSemanticProvenance() {
	return (init_javascriptSemanticProvenance = __esmMin((() => {
		init_unicodeCodePointOrder();
		semanticLocalProvenance = () => ({
			status: "local",
			origins: [],
			reason: null
		});
		semanticUnresolvedProvenance = (status, reason) => ({
			status,
			origins: [],
			reason
		});
		semanticAmbiguousProvenance = (origins, reason) => ({
			status: "ambiguous",
			origins,
			reason
		});
		semanticOriginsProvenance = (origins) => {
			const unique = uniqueSemanticOrigins(origins);
			const origin = unique[0];
			return unique.length === 1 && origin !== undefined ? {
				status: "module",
				origins: [origin],
				reason: null
			} : semanticAmbiguousProvenance(unique, "Multiple module origins.");
		};
		uniqueSemanticOrigins = (origins) => [...new Map(origins.map((origin) => [semanticOriginKey(origin), origin])).values()].sort((left, right) => compareUnicodeCodePoints(semanticOriginKey(left), semanticOriginKey(right)));
		semanticOriginKey = (origin) => JSON.stringify([
			origin.specifier,
			origin.importedPath,
			origin.resolutionMode ?? "import"
		]);
		semanticPrimitiveKey = (value) => `${value === null ? "null" : typeof value}:${JSON.stringify(value)}`;
		semanticBuiltinNamespacePath = (importedPath) => importedPath.length === 0 || importedPath.length === 1 && importedPath[0] === "default";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticResourceLimits.js
var SEMANTIC_PRIMITIVE_CANDIDATE_LIMIT, SEMANTIC_EXPRESSION_DEPTH_LIMIT, SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT, RESOURCE_LIMIT_REASON, jsonStringBytesFromLength, exceedsSemanticPrimitiveStringByteBudget, exceedsSemanticPrimitiveAdditionByteBudget, exceedsSemanticTemplateByteBudget, semanticResourceLimitUnknown, semanticResourceLimitsIn, semanticResourceLimitReason;
function init_javascriptSemanticResourceLimits() {
	return (init_javascriptSemanticResourceLimits = __esmMin((() => {
		SEMANTIC_PRIMITIVE_CANDIDATE_LIMIT = 256;
		SEMANTIC_EXPRESSION_DEPTH_LIMIT = 256;
		SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT = 1048576;
		RESOURCE_LIMIT_REASON = {
			"primitive-candidates": "Primitive candidate budget exceeded (maximum 256 alternatives).",
			"primitive-bytes": "Primitive string-byte budget exceeded (maximum 1048576 estimated JSON bytes).",
			"expression-depth": "Semantic expression depth budget exceeded (maximum 256 nested expressions)."
		};
		jsonStringBytesFromLength = (codeUnits) => codeUnits * 6 + 2;
		exceedsSemanticPrimitiveStringByteBudget = (strings) => {
			let total = 0;
			for (const value of strings) {
				total += jsonStringBytesFromLength(value.length);
				if (total > 1048576) return true;
			}
			return false;
		};
		exceedsSemanticPrimitiveAdditionByteBudget = (left, right) => {
			let total = 0;
			for (const leftValue of left) {
				for (const rightValue of right) {
					if (typeof leftValue !== "string" && typeof rightValue !== "string") continue;
					const length = String(leftValue).length + String(rightValue).length;
					total += jsonStringBytesFromLength(length);
					if (total > 1048576) return true;
				}
			}
			return false;
		};
		exceedsSemanticTemplateByteBudget = (prefixes, suffixes) => {
			let total = 0;
			for (const prefix of prefixes) {
				for (const suffix of suffixes) {
					total += jsonStringBytesFromLength(prefix.length + suffix.length);
					if (total > 1048576) return true;
				}
			}
			return false;
		};
		semanticResourceLimitUnknown = (resourceLimit) => ({
			status: "unknown",
			reason: RESOURCE_LIMIT_REASON[resourceLimit],
			resourceLimit
		});
		semanticResourceLimitsIn = (values) => {
			const found = new Set();
			const pending = [...values];
			while (pending.length > 0) {
				const value = pending.pop();
				if (value === undefined) continue;
				if (value.status === "unknown" && value.resourceLimit !== undefined) found.add(value.resourceLimit);
				else if (value.status === "object") for (const property of value.properties) pending.push(property.value);
				else if (value.status === "array") for (const item of value.items) pending.push(item.value);
			}
			return [...found].sort();
		};
		semanticResourceLimitReason = (resourceLimit) => RESOURCE_LIMIT_REASON[resourceLimit];
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPrimitives.js
var semanticPrimitiveSet, semanticPrimitiveCandidates;
function init_javascriptSemanticPrimitives() {
	return (init_javascriptSemanticPrimitives = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticResourceLimits();
		semanticPrimitiveSet = (values) => {
			const uniqueValues = new Set();
			for (const value of values) {
				if (typeof value === "number" && !Number.isFinite(value)) return {
					status: "unknown",
					reason: "Nonfinite numbers are outside the JSON primitive lattice."
				};
				if (typeof value === "number" && Object.is(value, -0)) return {
					status: "unknown",
					reason: "Negative zero cannot be preserved by JSON primitive evidence."
				};
				uniqueValues.add(value);
				if (uniqueValues.size > 256) return semanticResourceLimitUnknown("primitive-candidates");
			}
			if (exceedsSemanticPrimitiveStringByteBudget([...uniqueValues].flatMap((value) => typeof value === "string" ? [value] : []))) return semanticResourceLimitUnknown("primitive-bytes");
			const unique = [...uniqueValues].map((value) => ({
				key: semanticPrimitiveKey(value),
				value
			})).sort((left, right) => compareUnicodeCodePoints(left.key, right.key)).map(({ value }) => value);
			const only = unique[0];
			return unique.length === 1 && only !== undefined ? {
				status: "literal",
				value: only
			} : {
				status: "union",
				values: unique
			};
		};
		semanticPrimitiveCandidates = (value) => value.status === "literal" ? [value.value] : value.status === "union" ? value.values : null;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticValues.js
var dependencyProofsByState, createEvaluationMemo, CALLER_INDEPENDENT, EVERY_CALLER, callerIndependentBindingValuesByState, primitiveBindingValuesByState, primitiveExpressionValuesByState, capturedBindingValuesByState, clearSemanticValueCaches, callerIndependentBindingValuesFor, primitiveBindingValuesFor, isSemanticResourceLimit, evaluateSemanticBinding, evaluateSemanticExpression, evaluateSemanticProvenance, evaluateSemanticProvenanceAtRead, readMemoizedEvaluation, retainDependencyProof, recordBindingDependency, collectEvaluationDependencies, evaluateBinding, evaluateExpression, evaluateTemplate, evaluateObject, evaluateArray, evaluateMember, evaluateAddition, addPrimitiveValues, evaluateUnary, projectValue, provenanceForBinding, provenanceForBindingUncached, provenanceForBindingValue, provenanceForExpression, provenanceForBindingAtRead, isLocallyCreatedValue, mergeValues, nestedContext, isPrimitive, primitiveCaptureContext, captureContextAt, evaluateCapturedExpression;
function init_javascriptSemanticValues() {
	return (init_javascriptSemanticValues = __esmMin((() => {
		init_javascriptSemanticDependencies();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticSlots();
		init_javascriptSemanticMutationValues();
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_unicodeCodePointOrder();
		init_javascriptAstValues();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticPrimitives();
		init_javascriptSemanticResourceLimits();
		dependencyProofsByState = new WeakMap();
		createEvaluationMemo = (state) => {
			let dependencies = dependencyProofsByState.get(state);
			if (dependencies === undefined) {
				dependencies = new SemanticDependencyProofs(state.bindingsById.keys());
				dependencyProofsByState.set(state, dependencies);
			}
			return {
				provenance: new Map(),
				dependencyFrames: [],
				dependencies
			};
		};
		CALLER_INDEPENDENT = Number.POSITIVE_INFINITY;
		EVERY_CALLER = -1;
		callerIndependentBindingValuesByState = new WeakMap();
		primitiveBindingValuesByState = new WeakMap();
		primitiveExpressionValuesByState = new WeakMap();
		capturedBindingValuesByState = new WeakMap();
		clearSemanticValueCaches = (state) => {
			primitiveBindingValuesByState.delete(state);
			capturedBindingValuesByState.delete(state);
			primitiveExpressionValuesByState.delete(state);
			callerIndependentBindingValuesByState.delete(state);
		};
		callerIndependentBindingValuesFor = (state) => {
			const existing = callerIndependentBindingValuesByState.get(state);
			if (existing !== undefined) return existing;
			const values = new Map();
			callerIndependentBindingValuesByState.set(state, values);
			return values;
		};
		primitiveBindingValuesFor = (state) => {
			const existing = primitiveBindingValuesByState.get(state);
			if (existing !== undefined) return existing;
			const values = new Map();
			primitiveBindingValuesByState.set(state, values);
			return values;
		};
		isSemanticResourceLimit = (value) => value.status === "unknown" && value.resourceLimit !== undefined;
		evaluateSemanticBinding = (binding, state) => evaluateBinding(binding, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		evaluateSemanticExpression = (node, state, capturePoint) => {
			const context = {
				state,
				bindings: new Map(),
				expressionDepth: 0,
				primitiveBindingValues: primitiveBindingValuesFor(state),
				dependence: { lowest: CALLER_INDEPENDENT },
				memo: createEvaluationMemo(state)
			};
			return evaluateExpression(node, capturePoint === undefined ? context : captureContextAt(capturePoint, context) ?? context);
		};
		evaluateSemanticProvenance = (binding, state) => provenanceForBinding(binding, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		evaluateSemanticProvenanceAtRead = (binding, read, state) => provenanceForBindingAtRead(binding, read, {
			state,
			bindings: new Map(),
			expressionDepth: 0,
			primitiveBindingValues: primitiveBindingValuesFor(state),
			dependence: { lowest: CALLER_INDEPENDENT },
			memo: createEvaluationMemo(state)
		});
		readMemoizedEvaluation = (entry, context) => {
			if (entry === undefined || context.memo.dependencies.intersects(entry.dependencies, context.bindings)) return undefined;
			retainDependencyProof(entry.dependencies, context);
			return entry.value;
		};
		retainDependencyProof = (proof, context) => {
			const parent = context.memo.dependencyFrames.at(-1);
			if (parent !== undefined) parent.proof = context.memo.dependencies.union(parent.proof, proof);
		};
		recordBindingDependency = (binding, context) => retainDependencyProof(context.memo.dependencies.binding(binding.bindingId), context);
		collectEvaluationDependencies = (binding, context, evaluate) => {
			const frame = { proof: context.memo.dependencies.binding(binding.bindingId) };
			context.memo.dependencyFrames.push(frame);
			try {
				return {
					value: evaluate(),
					dependencies: frame.proof
				};
			} finally {
				context.memo.dependencyFrames.pop();
				retainDependencyProof(frame.proof, context);
			}
		};
		evaluateBinding = (binding, context) => {
			recordBindingDependency(binding, context);
			const cycleHead = context.bindings.get(binding.bindingId);
			if (cycleHead !== undefined) {
				context.dependence.lowest = Math.min(context.dependence.lowest, cycleHead);
				return {
					status: "cycle",
					reason: `Alias cycle at ${binding.name}.`
				};
			}
			if (context.capturePoint !== undefined && !semanticBindingPrecedesCapture(binding, context.capturePoint, context.state.parentsByNode)) {
				const { capturePoint: _capturePoint, ...liveContext } = context;
				return evaluateBinding(binding, {
					...liveContext,
					primitiveBindingValues: primitiveBindingValuesFor(context.state)
				});
			}
			const cached = context.primitiveBindingValues.get(binding.bindingId);
			if (cached !== undefined) return cached;
			const independent = context.capturePoint === undefined ? callerIndependentBindingValuesFor(context.state) : undefined;
			const retained = independent?.get(binding.bindingId);
			if (retained !== undefined && context.expressionDepth <= retained.expressionDepth) {
				const reusable = readMemoizedEvaluation(retained, context);
				if (reusable !== undefined) return reusable;
			}
			if (binding.initializers.length === 0) return {
				status: "unknown",
				reason: `Binding ${binding.name} has no constant initializer.`
			};
			if (binding.initializers.some(({ node }) => t.isUpdateExpression(node) || t.isAssignmentExpression(node) && node.operator !== "=" && node.operator !== "&&=" && node.operator !== "||=" && node.operator !== "??=")) return {
				status: "unknown",
				reason: `Binding ${binding.name} has a compound or update write.`
			};
			if (binding.initializers.length > 1) return {
				status: "ambiguous",
				reason: `Binding ${binding.name} has multiple possible assignments.`
			};
			const initializer = binding.initializers[0];
			if (initializer === undefined) return {
				status: "unknown",
				reason: "Missing binding initializer."
			};
			if (context.state.conditionallySkippedExpressions.has(initializer.node)) return {
				status: "unknown",
				reason: `Binding ${binding.name} may remain uninitialized.`
			};
			const position = context.bindings.size;
			const callerDependence = context.dependence.lowest;
			context.dependence.lowest = CALLER_INDEPENDENT;
			context.bindings.set(binding.bindingId, position);
			let value;
			let callerIndependent = false;
			let evaluated;
			try {
				evaluated = collectEvaluationDependencies(binding, context, () => {
					const nested = nestedContext(context);
					let value = projectValue(evaluateExpression(initializer.node, nested), initializer.projection);
					if (!isPrimitive(value)) {
						const captureContext = primitiveCaptureContext(initializer.node, nested);
						if (captureContext !== undefined) {
							const captured = projectValue(evaluateExpression(initializer.node, captureContext), initializer.projection);
							if (isPrimitive(captured)) value = captured;
						}
					}
					return value;
				});
				value = evaluated.value;
				callerIndependent = context.dependence.lowest > position;
			} finally {
				context.bindings.delete(binding.bindingId);
				context.dependence.lowest = callerIndependent ? callerDependence : Math.min(callerDependence, context.dependence.lowest);
			}
			let projected = invalidateSemanticMutationPaths(value, binding.memberWrites.map(({ path }) => path));
			for (const escape of binding.escapedPaths) {
				if (projected.status !== "object" && projected.status !== "array") break;
				if (context.capturePoint !== undefined && semanticEscapeFollowsCapture(binding, context.capturePoint, escape.node, context.state.parentsByNode)) continue;
				projected = invalidateSemanticEscapedPath(projected, escape.path);
			}
			if (callerIndependent && independent !== undefined && (retained === undefined || retained.expressionDepth < context.expressionDepth)) independent.set(binding.bindingId, {
				value: projected,
				dependencies: evaluated.dependencies,
				expressionDepth: context.expressionDepth
			});
			if (context.capturePoint !== undefined || projected.status === "literal" || projected.status === "union" || isSemanticResourceLimit(projected) && (projected.resourceLimit === "primitive-bytes" || projected.resourceLimit === "primitive-candidates")) context.primitiveBindingValues.set(binding.bindingId, projected);
			return projected;
		};
		evaluateExpression = (node, context) => {
			if (context.expressionDepth > 256) {
				context.dependence.lowest = EVERY_CALLER;
				return semanticResourceLimitUnknown("expression-depth");
			}
			const unwrapped = unwrapJavaScriptExpression(node);
			if (unwrapped.depth > 0) {
				if (context.expressionDepth + unwrapped.depth > 256) {
					context.dependence.lowest = EVERY_CALLER;
					return semanticResourceLimitUnknown("expression-depth");
				}
				return evaluateExpression(unwrapped.node, {
					...context,
					expressionDepth: context.expressionDepth + unwrapped.depth
				});
			}
			const literal = readExactJavaScriptLiteral(node);
			if (literal.found) return typeof literal.value === "number" ? semanticPrimitiveSet([literal.value]) : {
				status: "literal",
				value: literal.value
			};
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(context.state, node, node.name);
				return binding === undefined ? {
					status: "unknown",
					reason: `Unbound identifier ${node.name}.`
				} : evaluateBinding(binding, nestedContext(context));
			}
			if (t.isTemplateLiteral(node)) return evaluateTemplate(node, context);
			if (t.isConditionalExpression(node)) return mergeValues([evaluateExpression(node.consequent, nestedContext(context)), evaluateExpression(node.alternate, nestedContext(context))]);
			if (t.isLogicalExpression(node)) return mergeValues([evaluateExpression(node.left, nestedContext(context)), evaluateExpression(node.right, nestedContext(context))]);
			if (t.isObjectExpression(node)) return evaluateObject(node, context);
			if (t.isArrayExpression(node)) return evaluateArray(node, context);
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) return evaluateMember(node, context);
			if (t.isBinaryExpression(node, { operator: "+" })) return evaluateAddition(node, context);
			if (t.isUnaryExpression(node)) return evaluateUnary(node, context);
			return {
				status: "unknown",
				reason: `Unsupported ${node.type} value.`
			};
		};
		evaluateTemplate = (node, context) => {
			let candidates = [""];
			for (let index = 0; index < node.quasis.length; index += 1) {
				const quasi = node.quasis[index];
				const text = quasi?.value.cooked;
				if (text === undefined || text === null) return {
					status: "unknown",
					reason: "Template text has no cooked representation."
				};
				if (exceedsSemanticTemplateByteBudget(candidates, [text])) return semanticResourceLimitUnknown("primitive-bytes");
				candidates = candidates.map((prefix) => `${prefix}${text}`);
				const expression = node.expressions[index];
				if (expression === undefined) continue;
				const evaluated = evaluateExpression(expression, nestedContext(context));
				const values = semanticPrimitiveCandidates(evaluated);
				if (values === null) {
					if (isSemanticResourceLimit(evaluated)) return evaluated;
					return {
						status: "unknown",
						reason: "Template expression is not a bounded primitive."
					};
				}
				if (candidates.length > 256 / values.length) return semanticResourceLimitUnknown("primitive-candidates");
				const suffixes = values.map((value) => String(value));
				if (exceedsSemanticTemplateByteBudget(candidates, suffixes)) return semanticResourceLimitUnknown("primitive-bytes");
				candidates = candidates.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`));
			}
			return semanticPrimitiveSet(candidates);
		};
		evaluateObject = (node, context) => {
			const propertiesByName = new Map();
			let unknownProperties = false;
			let omittedProperties = 0;
			const invalidateEarlierProperties = () => {
				for (const [name] of propertiesByName) propertiesByName.set(name, {
					name,
					presence: "present",
					value: {
						status: "unknown",
						reason: "A later property may overwrite this value."
					}
				});
			};
			for (const property of node.properties) {
				if (t.isSpreadElement(property)) {
					unknownProperties = true;
					omittedProperties = null;
					invalidateEarlierProperties();
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					invalidateEarlierProperties();
					continue;
				}
				if (t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__") {
					unknownProperties = true;
					if (omittedProperties !== null) omittedProperties += 1;
					continue;
				}
				propertiesByName.set(name, {
					name,
					presence: "present",
					value: t.isObjectProperty(property) ? evaluateCapturedExpression(property.value, nestedContext(context)) : {
						status: "unknown",
						reason: "Object method or accessor value is not a primitive."
					}
				});
			}
			const properties = [...propertiesByName.values()].sort((left, right) => compareUnicodeCodePoints(left.name, right.name));
			return unknownProperties ? {
				status: "object",
				properties,
				unknownProperties: true,
				omittedProperties
			} : {
				status: "object",
				properties,
				unknownProperties: false,
				omittedProperties: 0
			};
		};
		evaluateArray = (node, context) => {
			const items = [];
			let unknownItems = false;
			let omittedItems = 0;
			for (const element of node.elements) {
				if (t.isSpreadElement(element)) {
					unknownItems = true;
					omittedItems = null;
					break;
				}
				if (element === null) {
					items.push({
						name: String(items.length),
						presence: "absent",
						value: {
							status: "unknown",
							reason: "Array hole has no own value."
						}
					});
					continue;
				}
				items.push({
					name: String(items.length),
					presence: "present",
					value: evaluateCapturedExpression(element, nestedContext(context))
				});
			}
			return unknownItems ? {
				status: "array",
				items,
				unknownItems: true,
				omittedItems
			} : {
				status: "array",
				items,
				unknownItems: false,
				omittedItems: 0
			};
		};
		evaluateMember = (node, context) => {
			const keys = [];
			let current = node;
			let value;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				if (!t.isNode(current.object)) {
					value = {
						status: "unknown",
						reason: "Unsupported member base."
					};
					break;
				}
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null) {
					value = {
						status: "unknown",
						reason: "Dynamic member key."
					};
					break;
				}
				keys.push(key);
				current = current.object;
			}
			value ??= evaluateExpression(current, nestedContext(context));
			for (const key of keys.reverse()) value = projectValue(value, [key]);
			return value;
		};
		evaluateAddition = (node, context) => {
			const pending = [];
			let current = node;
			while (true) {
				if (t.isBinaryExpression(current, { operator: "+" })) {
					pending.push({
						node: current,
						left: undefined
					});
					current = current.left;
					continue;
				}
				let value = evaluateExpression(current, nestedContext(context));
				while (true) {
					const parent = pending.at(-1);
					if (parent === undefined) return value;
					if (parent.left === undefined) {
						parent.left = value;
						current = parent.node.right;
						break;
					}
					value = addPrimitiveValues(parent.left, value);
					pending.pop();
				}
			}
		};
		addPrimitiveValues = (leftValue, rightValue) => {
			const left = semanticPrimitiveCandidates(leftValue);
			const right = semanticPrimitiveCandidates(rightValue);
			if (left === null || right === null) {
				if (isSemanticResourceLimit(leftValue)) return leftValue;
				if (isSemanticResourceLimit(rightValue)) return rightValue;
				return {
					status: "unknown",
					reason: "Non-primitive addition."
				};
			}
			if (left.length > 256 / right.length) return semanticResourceLimitUnknown("primitive-candidates");
			if (exceedsSemanticPrimitiveAdditionByteBudget(left, right)) return semanticResourceLimitUnknown("primitive-bytes");
			const values = left.flatMap((leftValue) => right.map((rightValue) => typeof leftValue === "string" || typeof rightValue === "string" ? `${String(leftValue)}${String(rightValue)}` : Number(leftValue) + Number(rightValue)));
			return semanticPrimitiveSet(values);
		};
		evaluateUnary = (node, context) => {
			const evaluated = evaluateExpression(node.argument, nestedContext(context));
			const argument = semanticPrimitiveCandidates(evaluated);
			if (argument === null) {
				if (isSemanticResourceLimit(evaluated)) return evaluated;
				return {
					status: "unknown",
					reason: "Non-primitive unary operand."
				};
			}
			if (node.operator === "!") return semanticPrimitiveSet(argument.map((value) => !value));
			if (node.operator === "+") return semanticPrimitiveSet(argument.map((value) => Number(value)));
			if (node.operator === "-") return semanticPrimitiveSet(argument.map((value) => -Number(value)));
			return {
				status: "unknown",
				reason: `Unsupported unary ${node.operator}.`
			};
		};
		projectValue = (value, projection) => {
			if (projection.includes(null)) return {
				status: "unknown",
				reason: "Cannot project a dynamic property."
			};
			const path = projection.map((key) => String(key));
			const slot = semanticSlotAtPath(value, path);
			return slot.presence === "present" ? slot.value : {
				status: "unknown",
				reason: `Own property ${path.join("/")} is ${slot.presence}.`
			};
		};
		provenanceForBinding = (binding, context) => {
			recordBindingDependency(binding, context);
			const cycleHead = context.bindings.get(binding.bindingId);
			if (cycleHead !== undefined) {
				context.dependence.lowest = Math.min(context.dependence.lowest, cycleHead);
				return semanticUnresolvedProvenance("cycle", `Alias cycle at ${binding.name}.`);
			}
			let depths = context.memo.provenance.get(binding.bindingId);
			const prior = readMemoizedEvaluation(depths?.get(context.expressionDepth), context);
			if (prior !== undefined) return prior;
			const position = context.bindings.size;
			const callerDependence = context.dependence.lowest;
			context.dependence.lowest = CALLER_INDEPENDENT;
			let result;
			let callerIndependent = false;
			try {
				result = collectEvaluationDependencies(binding, context, () => provenanceForBindingUncached(binding, context));
				callerIndependent = context.dependence.lowest > position;
			} finally {
				context.dependence.lowest = callerIndependent ? callerDependence : Math.min(callerDependence, context.dependence.lowest);
			}
			if (callerIndependent) {
				if (depths === undefined) {
					depths = new Map();
					context.memo.provenance.set(binding.bindingId, depths);
				}
				depths.set(context.expressionDepth, result);
			}
			return result.value;
		};
		provenanceForBindingUncached = (binding, context) => {
			const provenance = provenanceForBindingValue(binding, context);
			const assigned = binding.definitions.some(({ kind }) => kind === "assignment");
			const conditionallyInitialized = binding.initializers.some(({ node }) => context.state.conditionallySkippedExpressions.has(node));
			if (provenance.status !== "module" || !assigned && !conditionallyInitialized) return provenance;
			return semanticAmbiguousProvenance(provenance.origins, assigned ? `Binding ${binding.name} may be reassigned.` : `Binding ${binding.name} may remain uninitialized.`);
		};
		provenanceForBindingValue = (binding, context) => {
			if (binding.kind === "parameter" || binding.kind === "catch") return semanticUnresolvedProvenance("unknown", binding.kind === "parameter" ? "Parameter provenance depends on caller arguments." : "Catch binding provenance depends on the thrown value.");
			if (binding.directOrigins.length > 0) return semanticOriginsProvenance(binding.directOrigins);
			if (binding.initializers.length === 0) return semanticLocalProvenance();
			if (binding.initializers.length > 1) return semanticAmbiguousProvenance([], `Binding ${binding.name} has multiple possible assignments.`);
			const initializer = binding.initializers[0];
			if (initializer === undefined) return semanticUnresolvedProvenance("unknown", "Missing binding initializer.");
			if (initializer.projection.includes(null)) return semanticUnresolvedProvenance("unknown", "Dynamic provenance projection.");
			context.bindings.set(binding.bindingId, context.bindings.size);
			let resolved;
			try {
				resolved = provenanceForExpression(initializer.node, nestedContext(context));
			} finally {
				context.bindings.delete(binding.bindingId);
			}
			if (resolved.status !== "module" || initializer.projection.length === 0) return resolved;
			return semanticOriginsProvenance(resolved.origins.map((origin) => ({
				...origin,
				importedPath: [...origin.importedPath, ...initializer.projection.map((segment) => String(segment))]
			})));
		};
		provenanceForExpression = (node, context) => {
			if (context.expressionDepth > 256) {
				context.dependence.lowest = EVERY_CALLER;
				return semanticUnresolvedProvenance("unknown", semanticResourceLimitReason("expression-depth"));
			}
			const unwrapped = unwrapJavaScriptExpression(node);
			if (unwrapped.depth > 0) {
				if (context.expressionDepth + unwrapped.depth > 256) {
					context.dependence.lowest = EVERY_CALLER;
					return semanticUnresolvedProvenance("unknown", semanticResourceLimitReason("expression-depth"));
				}
				return provenanceForExpression(unwrapped.node, {
					...context,
					expressionDepth: context.expressionDepth + unwrapped.depth
				});
			}
			const required = semanticRequireOrigin(node, context.state);
			if (required !== undefined) return semanticOriginsProvenance([required.origin]);
			if (t.isSequenceExpression(node)) {
				const finalExpression = node.expressions.at(-1);
				return finalExpression === undefined ? semanticUnresolvedProvenance("unknown", "Empty sequence expression.") : provenanceForExpression(finalExpression, nestedContext(context));
			}
			if (t.isAssignmentExpression(node) && node.operator === "=") return provenanceForExpression(node.right, nestedContext(context));
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(context.state, node, node.name);
				return binding === undefined ? semanticUnresolvedProvenance("unknown", `Unbound identifier ${node.name}.`) : provenanceForBindingAtRead(binding, node, nestedContext(context));
			}
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const members = [];
				let current = node;
				while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					if (!t.isNode(current.object)) return semanticUnresolvedProvenance("unknown", "Unsupported member base.");
					const member = semanticStaticPropertyKey(current.property, current.computed);
					if (member === null) return semanticUnresolvedProvenance("unknown", "Dynamic provenance member.");
					members.push(member);
					current = current.object;
				}
				const base = provenanceForExpression(current, nestedContext(context));
				const path = members.reverse();
				return base.status !== "module" ? base : semanticOriginsProvenance(base.origins.map((origin) => ({
					...origin,
					importedPath: [...origin.importedPath, ...path]
				})));
			}
			if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
				const left = t.isConditionalExpression(node) ? node.consequent : node.left;
				const right = t.isConditionalExpression(node) ? node.alternate : node.right;
				const candidates = [provenanceForExpression(left, nestedContext(context)), provenanceForExpression(right, nestedContext(context))];
				const origins = uniqueSemanticOrigins(candidates.flatMap((candidate) => candidate.origins));
				const allModuleOrigins = candidates.every(({ status }) => status === "module");
				if (allModuleOrigins && origins.length === 1) return semanticOriginsProvenance(origins);
				return origins.length > 0 ? semanticAmbiguousProvenance(origins, allModuleOrigins ? "Multiple module origins." : "Conditional provenance includes a non-module alternative.") : semanticUnresolvedProvenance("unknown", "Conditional provenance is unresolved.");
			}
			if (isLocallyCreatedValue(node)) return semanticLocalProvenance();
			return semanticUnresolvedProvenance("unknown", `Unsupported ${node.type} provenance.`);
		};
		provenanceForBindingAtRead = (binding, read, context) => {
			const selected = semanticReadInitializers(binding, read, context.state.parentsByNode);
			if (selected.initializers === binding.initializers) return provenanceForBinding(binding, context);
			if (context.bindings.has(binding.bindingId)) return semanticUnresolvedProvenance("cycle", `Alias cycle at ${binding.name}.`);
			const snapshot = {
				...binding,
				...selected,
				definitions: binding.definitions.filter(({ kind }) => kind !== "assignment")
			};
			context.bindings.set(binding.bindingId, context.bindings.size);
			try {
				return provenanceForBindingValue(snapshot, context);
			} finally {
				context.bindings.delete(binding.bindingId);
			}
		};
		isLocallyCreatedValue = (node) => readExactJavaScriptLiteral(node).found || t.isObjectExpression(node) || t.isArrayExpression(node) || t.isFunctionExpression(node) || t.isArrowFunctionExpression(node) || t.isClassExpression(node) || t.isTemplateLiteral(node) || t.isUnaryExpression(node) || t.isBinaryExpression(node) || t.isUpdateExpression(node);
		mergeValues = (values) => {
			const resourceLimit = values.find(isSemanticResourceLimit);
			if (resourceLimit !== undefined) return resourceLimit;
			const primitives = values.flatMap((value) => semanticPrimitiveCandidates(value) ?? []);
			return values.every((value) => value.status === "union" || value.status === "literal") ? semanticPrimitiveSet(primitives) : {
				status: "ambiguous",
				reason: "Branches have incompatible values."
			};
		};
		nestedContext = (context) => ({
			state: context.state,
			primitiveBindingValues: context.primitiveBindingValues,
			...context.capturePoint === undefined ? {} : { capturePoint: context.capturePoint },
			expressionDepth: context.expressionDepth + 1,
			bindings: context.bindings,
			dependence: context.dependence,
			memo: context.memo
		});
		isPrimitive = (value) => value.status === "literal" || value.status === "union";
		primitiveCaptureContext = (node, context) => {
			if (t.isObjectExpression(node) || t.isArrayExpression(node)) return undefined;
			return captureContextAt(node, context);
		};
		captureContextAt = (node, context) => {
			if (context.capturePoint !== undefined || semanticCapturePosition(node, context.state.parentsByNode) === null) return undefined;
			let captures = capturedBindingValuesByState.get(context.state);
			if (captures === undefined) {
				captures = new WeakMap();
				capturedBindingValuesByState.set(context.state, captures);
			}
			let values = captures.get(node);
			if (values === undefined) {
				values = new Map();
				captures.set(node, values);
			}
			return {
				...context,
				capturePoint: node,
				primitiveBindingValues: values
			};
		};
		evaluateCapturedExpression = (node, context) => {
			let values = primitiveExpressionValuesByState.get(context.state);
			const cached = values?.get(node);
			if (cached !== undefined) return cached;
			let value = evaluateExpression(node, context);
			if (!isPrimitive(value)) {
				const captureContext = primitiveCaptureContext(node, context);
				if (captureContext !== undefined) {
					const captured = evaluateExpression(node, captureContext);
					if (isPrimitive(captured)) value = captured;
				}
			}
			if (context.capturePoint === undefined && isPrimitive(value)) {
				if (values === undefined) {
					values = new WeakMap();
					primitiveExpressionValuesByState.set(context.state, values);
				}
				values.set(node, value);
			}
			return value;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptModuleDeclaration.js
var isTypeOnlyImportDeclaration, isTypeOnlyExportDeclaration, isTypeOnlyImportSpecifier, isTypeOnlyExportSpecifier, hasOnlyInlineTypeImportSpecifiers, hasOnlyInlineTypeExportSpecifiers, hasUncertainTypeOnlyModuleSideEffect;
function init_javascriptModuleDeclaration() {
	return (init_javascriptModuleDeclaration = __esmMin((() => {
		isTypeOnlyImportDeclaration = (node) => node.importKind === "type" || node.importKind === "typeof";
		isTypeOnlyExportDeclaration = (node) => node.exportKind === "type" || t.isExportNamedDeclaration(node) && node.declaration !== null && (t.isTSInterfaceDeclaration(node.declaration) || t.isTSTypeAliasDeclaration(node.declaration) || t.isTSDeclareFunction(node.declaration));
		isTypeOnlyImportSpecifier = (node) => node.importKind === "type" || node.importKind === "typeof";
		isTypeOnlyExportSpecifier = (node) => node.exportKind === "type";
		hasOnlyInlineTypeImportSpecifiers = (node) => !isTypeOnlyImportDeclaration(node) && node.specifiers.length > 0 && node.specifiers.every((specifier) => t.isImportSpecifier(specifier) && isTypeOnlyImportSpecifier(specifier));
		hasOnlyInlineTypeExportSpecifiers = (node) => !isTypeOnlyExportDeclaration(node) && node.source != null && node.specifiers.length > 0 && node.specifiers.every((specifier) => t.isExportSpecifier(specifier) && isTypeOnlyExportSpecifier(specifier));
		hasUncertainTypeOnlyModuleSideEffect = (program) => program.body.some((node) => t.isImportDeclaration(node) && hasOnlyInlineTypeImportSpecifiers(node) || t.isExportNamedDeclaration(node) && hasOnlyInlineTypeExportSpecifiers(node));
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticProjection.js
/** Collect lexical references in steps while preserving resolution and visit order. */
function* collectSemanticReferencesSteps(program, state, name) {
	const output = [];
	const seen = new Set();
	const patterns = [];
	yield* traverseJavaScriptAstSteps(program, {
		enter: (node, parent, readAncestors) => {
			if (isPatternNode(node)) patterns.push(node);
			if (!t.isIdentifier(node) || parent === null || name !== undefined && node.name !== name || isNonReferenceKey(node, parent) && !patterns.some((pattern) => bindsIdentifier(pattern, parent, node))) return;
			const ancestors = readAncestors();
			const role = semanticIdentifierRole(node, parent, ancestors);
			if (role === null) return;
			const roles = role === "write" && semanticReadsBeforeWrite(node, semanticWrappedWriteSite(node, parent, ancestors) ?? parent) ? ["read", "write"] : [role];
			for (const resolvedRole of roles) {
				const key = `${String(node.start)}:${resolvedRole}:${node.name}`;
				if (seen.has(key)) continue;
				seen.add(key);
				const binding = resolveSemanticBindingState(state, node, node.name);
				const blocked = binding === undefined && semanticResolutionBlocked(state, node, node.name);
				output.push({
					name: node.name,
					role: resolvedRole,
					location: range(node),
					bindingId: binding?.bindingId ?? null,
					resolution: binding !== undefined ? "resolved" : blocked ? "unknown" : "unbound"
				});
			}
		},
		exit: (node) => {
			if (isPatternNode(node)) patterns.pop();
		}
	});
	return output;
}
var collectSemanticCallable, collectSemanticModuleLink, collectImportEquals, semanticImportEqualsSpecifier, collectSemanticReferences, immutableSemanticScopes, immutableSemanticBindings, callableKind, callableName, collectImports, collectNamedExports, collectRequireLink, collectUnboundRequireLink, requirePatternBindings, collectCommonJsExport, commonJsExportReceiverEffect, isFreshAssignmentResult, addModuleLink, semanticCallableIdForNode, declarationCallableId, semanticReadsBeforeWrite, semanticIdentifierRole, enclosingPatternAncestor, bindsIdentifier, isPatternNode, isDeleteSite, isPatternOwnerDeclaration, semanticReferenceRole, isDeclarationIdentifier, isNonReferenceKey, patternNames, patternContains, declarationNames, defaultExportLocalName, commonJsExportName, isCommonJsModuleExports;
function init_javascriptSemanticProjection() {
	return (init_javascriptSemanticProjection = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticRequireOrigin();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptAstValues();
		init_javascriptModuleDeclaration();
		collectSemanticCallable = (input) => {
			const { node, parent, containerScope, bodyScope, state } = input;
			const kind = callableKind(node);
			if (kind === undefined) return;
			const callableId = semanticCallableIdForNode(node) ?? "callable:unknown:-1:-1";
			state.callables.push({
				callableId,
				kind,
				name: callableName(node, parent),
				containerScopeId: containerScope.scopeId,
				bodyScopeId: bodyScope === undefined || !bodyScope.bindingsComplete ? null : bodyScope.scopeId,
				location: range(node),
				returnSites: [],
				returnCoverage: {
					status: "partial",
					retainedCount: 0,
					omittedCount: null
				}
			});
			state.callableNodesById.set(callableId, node);
		};
		collectSemanticModuleLink = (node, state) => {
			if (t.isTSImportEqualsDeclaration(node)) collectImportEquals(node, state);
			else if (t.isImportDeclaration(node)) collectImports(node, state);
			else if (t.isExportAllDeclaration(node)) addModuleLink(state, {
				kind: isTypeOnlyExportDeclaration(node) ? "type-import" : "re-export",
				specifier: node.source.value,
				importedName: "*",
				localName: null,
				exportedName: "*",
				location: range(node)
			}, node);
			else if (t.isExportNamedDeclaration(node)) collectNamedExports(node, state);
			else if (t.isExportDefaultDeclaration(node)) addModuleLink(state, {
				kind: "export",
				specifier: null,
				importedName: null,
				localName: defaultExportLocalName(node.declaration),
				exportedName: "default",
				callableId: semanticCallableIdForNode(node.declaration),
				location: range(node)
			}, node);
			else if (t.isVariableDeclarator(node)) collectRequireLink(node, state);
			else if (t.isAssignmentExpression(node)) collectCommonJsExport(node, state);
			else if (t.isCallExpression(node)) collectUnboundRequireLink(node, state);
		};
		collectImportEquals = (node, state) => {
			const moduleReference = node.moduleReference;
			const specifier = semanticImportEqualsSpecifier(node) ?? (node.importKind === "type" && t.isTSExternalModuleReference(moduleReference) && t.isStringLiteral(moduleReference.expression) ? moduleReference.expression.value : null);
			if (specifier === null) return;
			addModuleLink(state, {
				kind: node.importKind === "type" ? "type-import" : "require",
				specifier,
				importedName: null,
				localName: node.id.name,
				exportedName: null,
				location: range(node)
			}, node);
		};
		semanticImportEqualsSpecifier = (node) => node.importKind !== "type" && t.isTSExternalModuleReference(node.moduleReference) && t.isStringLiteral(node.moduleReference.expression) ? node.moduleReference.expression.value : null;
		collectSemanticReferences = (program, state, name) => completeSemanticSteps(collectSemanticReferencesSteps(program, state, name));
		immutableSemanticScopes = (state) => state.scopes.map((scope) => ({
			scopeId: scope.scopeId,
			parentScopeId: scope.parentScopeId,
			kind: scope.kind,
			location: scope.location,
			bindingsComplete: scope.bindingsComplete,
			bindingIds: [...scope.bindings.values()].map(({ bindingId }) => bindingId).sort(compareUnicodeCodePoints)
		}));
		immutableSemanticBindings = (state) => [...state.bindingsById.values()].map((binding) => ({
			bindingId: binding.bindingId,
			scopeId: binding.scopeId,
			name: binding.name,
			kind: binding.kind,
			mutable: binding.mutable,
			definitions: binding.definitions,
			value: evaluateSemanticBinding(binding, state),
			provenance: evaluateSemanticProvenance(binding, state)
		})).sort((left, right) => compareUnicodeCodePoints(left.bindingId, right.bindingId));
		callableKind = (node) => {
			if (t.isClassMethod(node) || t.isClassPrivateMethod(node) || t.isObjectMethod(node)) return "method";
			if (t.isFunction(node)) return "function";
			if (t.isClass(node)) return "class";
			return undefined;
		};
		callableName = (node, parent) => {
			if ((t.isFunctionDeclaration(node) || t.isFunctionExpression(node) || t.isClassDeclaration(node) || t.isClassExpression(node)) && t.isIdentifier(node.id)) return node.id.name;
			if (t.isClassMethod(node) || t.isClassPrivateMethod(node) || t.isObjectMethod(node)) {
				if (t.isPrivateName(node.key)) return `#${node.key.id.name}`;
				return semanticStaticPropertyKey(node.key, node.computed) ?? `[computed@${String(node.start ?? -1)}]`;
			}
			if (parent !== null && t.isVariableDeclarator(parent) && t.isIdentifier(parent.id)) return parent.id.name;
			return null;
		};
		collectImports = (node, state) => {
			if (node.specifiers.length === 0) addModuleLink(state, {
				kind: isTypeOnlyImportDeclaration(node) ? "type-import" : "import",
				specifier: node.source.value,
				importedName: null,
				localName: null,
				exportedName: null,
				location: range(node)
			}, node);
			for (const specifier of node.specifiers) addModuleLink(state, {
				kind: isTypeOnlyImportDeclaration(node) || t.isImportSpecifier(specifier) && isTypeOnlyImportSpecifier(specifier) ? "type-import" : "import",
				specifier: node.source.value,
				importedName: t.isImportDefaultSpecifier(specifier) ? "default" : t.isImportNamespaceSpecifier(specifier) ? "*" : propertyName(specifier.imported),
				localName: specifier.local.name,
				exportedName: null,
				location: range(specifier)
			}, node);
		};
		collectNamedExports = (node, state) => {
			const declarationTypeOnly = isTypeOnlyExportDeclaration(node);
			if (node.declaration !== null && node.declaration !== undefined) for (const localName of declarationNames(node.declaration)) addModuleLink(state, {
				kind: declarationTypeOnly ? "type-import" : "export",
				specifier: null,
				importedName: null,
				localName,
				exportedName: localName,
				callableId: declarationCallableId(node.declaration, localName),
				location: range(node.declaration)
			}, node);
			for (const specifier of node.specifiers) if (t.isExportSpecifier(specifier) || t.isExportNamespaceSpecifier(specifier) && node.exportKind !== "type") addModuleLink(state, {
				kind: declarationTypeOnly || t.isExportSpecifier(specifier) && isTypeOnlyExportSpecifier(specifier) ? "type-import" : node.source == null ? "export" : "re-export",
				specifier: node.source?.value ?? null,
				importedName: t.isExportNamespaceSpecifier(specifier) ? "*" : propertyName(specifier.local),
				localName: node.source == null && t.isExportSpecifier(specifier) ? propertyName(specifier.local) : null,
				exportedName: propertyName(specifier.exported),
				location: range(specifier)
			}, node);
		};
		collectRequireLink = (node, state) => {
			const required = semanticRequireOrigin(node.init, state);
			if (required === undefined) return;
			const { origin, call } = required;
			const bindings = requirePatternBindings(node.id, origin.importedPath);
			for (const binding of bindings) addModuleLink(state, {
				kind: "require",
				specifier: origin.specifier,
				importedName: binding.importedName,
				localName: binding.localName,
				exportedName: null,
				location: range(node)
			}, node);
			if (bindings.length > 0) state.linkedRequireCalls.add(call);
		};
		collectUnboundRequireLink = (node, state) => {
			if (state.linkedRequireCalls.has(node)) return;
			const required = semanticRequireOrigin(node, state);
			if (required === undefined) return;
			addModuleLink(state, {
				kind: "require",
				specifier: required.origin.specifier,
				importedName: null,
				localName: null,
				exportedName: null,
				location: range(node)
			}, node);
			state.linkedRequireCalls.add(node);
		};
		requirePatternBindings = (pattern, path) => {
			if (t.isTSParameterProperty(pattern)) return requirePatternBindings(pattern.parameter, path);
			if (t.isIdentifier(pattern)) return [{
				importedName: path.at(-1) ?? "*",
				localName: pattern.name
			}];
			if (t.isAssignmentPattern(pattern)) return requirePatternBindings(pattern.left, path);
			if (t.isObjectPattern(pattern)) return pattern.properties.flatMap((property) => {
				if (t.isRestElement(property)) return [];
				const name = semanticStaticPropertyKey(property.key, property.computed);
				return name === null ? [] : requirePatternBindings(property.value, [...path, name]);
			});
			if (t.isArrayPattern(pattern)) return pattern.elements.flatMap((element, index) => element === null ? [] : requirePatternBindings(element, [...path, String(index)]));
			return [];
		};
		collectCommonJsExport = (node, state) => {
			const exportedName = commonJsExportName(node.left, state);
			if (exportedName === undefined) return;
			const receiverEffect = isCommonJsModuleExports(node.left, state) ? null : commonJsExportReceiverEffect(node.right, state);
			if (receiverEffect === "detached") return;
			let value = node.operator === "=" && receiverEffect !== "uncertain" ? node.right : null;
			while (t.isAssignmentExpression(value, { operator: "=" })) value = value.right;
			const required = value === null ? undefined : semanticRequireOrigin(value, state);
			const origin = required?.origin;
			addModuleLink(state, {
				kind: "commonjs-export",
				specifier: origin?.specifier ?? null,
				importedName: origin?.importedPath.at(-1) ?? null,
				localName: value !== null && t.isIdentifier(value) ? value.name : null,
				exportedName,
				callableId: value === null ? null : semanticCallableIdForNode(value),
				location: range(node)
			}, node);
			if (required !== undefined) state.linkedRequireCalls.add(required.call);
		};
		commonJsExportReceiverEffect = (node, state) => {
			let value = node;
			while (t.isAssignmentExpression(value, { operator: "=" })) {
				if (isCommonJsModuleExports(value.left, state)) return isFreshAssignmentResult(value.right) ? "detached" : "uncertain";
				value = value.right;
			}
			return null;
		};
		isFreshAssignmentResult = (node) => {
			let value = node;
			while (t.isAssignmentExpression(value, { operator: "=" })) value = value.right;
			return t.isArrowFunctionExpression(value) || t.isFunctionExpression(value) || t.isClassExpression(value) || t.isObjectExpression(value) || t.isArrayExpression(value);
		};
		addModuleLink = (state, link, referenceNode) => {
			const resolutionMode = link.resolutionMode ?? (link.kind === "import" || link.kind === "re-export" || link.kind === "type-import" ? state.staticImportResolutionMode : link.kind === "require" ? "require" : undefined);
			const collected = {
				...link,
				...resolutionMode === undefined ? {} : { resolutionMode },
				callableId: link.callableId ?? null
			};
			state.moduleLinks.push(collected);
			if (t.isExportDefaultDeclaration(referenceNode) && t.isExpression(referenceNode.declaration)) state.defaultExportExpressions.set(collected, referenceNode.declaration);
			if (link.localName !== null) {
				const binding = resolveSemanticBindingState(state, referenceNode, link.localName);
				if (binding !== undefined) state.moduleLinkBindings.set(collected, binding);
			}
		};
		semanticCallableIdForNode = (node) => {
			const kind = callableKind(node);
			return kind === undefined ? null : `callable:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		};
		declarationCallableId = (declaration, localName) => {
			if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && declaration.id?.name === localName) return semanticCallableIdForNode(declaration);
			if (!t.isVariableDeclaration(declaration)) return null;
			const declarator = declaration.declarations.find(({ id }) => t.isIdentifier(id, { name: localName }));
			return declarator?.init === null || declarator?.init === undefined ? null : semanticCallableIdForNode(declarator.init);
		};
		semanticReadsBeforeWrite = (node, site) => {
			const target = semanticWriteSiteTarget(site);
			return target !== null && unwrapJavaScriptExpression(target).node === node && semanticWriteSiteReadsFirst(site);
		};
		semanticIdentifierRole = (node, parent, ancestors) => {
			const patternAncestor = enclosingPatternAncestor(node, parent, ancestors);
			if (patternAncestor !== null) {
				if (isPatternOwnerDeclaration(patternAncestor)) return null;
				return "write";
			}
			const site = semanticWrappedWriteSite(node, parent, ancestors);
			if (site !== null && site !== parent && !isDeleteSite(site)) return "write";
			return semanticReferenceRole(node, parent);
		};
		enclosingPatternAncestor = (node, parent, ancestors) => {
			const chain = [...ancestors, parent];
			for (let index = chain.length - 1; index >= 0; index -= 1) {
				const ancestor = chain[index];
				if (ancestor === undefined || !isPatternNode(ancestor)) continue;
				if (!bindsIdentifier(ancestor, parent, node)) continue;
				for (let owner = index - 1; owner >= 0; owner -= 1) {
					const candidate = chain[owner];
					if (candidate === undefined) continue;
					if (t.isAssignmentExpression(candidate) || t.isForInStatement(candidate) || t.isForOfStatement(candidate)) return candidate;
					if (isPatternOwnerDeclaration(candidate)) return candidate;
				}
				return null;
			}
			return null;
		};
		bindsIdentifier = (pattern, parent, node) => {
			if (parent === pattern) return patternContains(pattern, node);
			if (t.isObjectPattern(pattern)) return t.isObjectProperty(parent) && (parent.value === node || parent.shorthand && parent.key === node);
			if (t.isArrayPattern(pattern)) return pattern.elements.some((element) => element === parent);
			if (t.isAssignmentPattern(pattern)) return pattern.left === parent;
			return t.isRestElement(pattern) && pattern.argument === parent;
		};
		isPatternNode = (node) => t.isObjectPattern(node) || t.isArrayPattern(node) || t.isAssignmentPattern(node) || t.isRestElement(node);
		isDeleteSite = (site) => t.isUnaryExpression(site, { operator: "delete" });
		isPatternOwnerDeclaration = (node) => t.isVariableDeclarator(node) && t.isPattern(node.id) || t.isFunction(node) && node.params.some((value) => t.isPattern(value)) || t.isCatchClause(node) && node.param !== null && t.isPattern(node.param);
		semanticReferenceRole = (node, parent) => {
			if (isDeclarationIdentifier(node, parent) || isNonReferenceKey(node, parent)) return null;
			if (t.isAssignmentExpression(parent) && parent.left === node || t.isUpdateExpression(parent) || (t.isForInStatement(parent) || t.isForOfStatement(parent)) && parent.left === node) return "write";
			if (t.isExportSpecifier(parent) && parent.local === node) return "export";
			return "read";
		};
		isDeclarationIdentifier = (node, parent) => {
			if (t.isTSImportEqualsDeclaration(parent)) return parent.id === node;
			return t.isVariableDeclarator(parent) && patternContains(parent.id, node) || (t.isFunctionDeclaration(parent) || t.isFunctionExpression(parent)) && parent.id === node || t.isFunction(parent) && parent.params.some((value) => patternContains(value, node)) || (t.isClassDeclaration(parent) || t.isClassExpression(parent)) && parent.id === node || t.isImportSpecifier(parent) && (parent.local === node || parent.imported === node) || t.isImportDefaultSpecifier(parent) && parent.local === node || t.isImportNamespaceSpecifier(parent) && parent.local === node || t.isCatchClause(parent) && parent.param === node;
		};
		isNonReferenceKey = (node, parent) => (t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) && parent.property === node && !parent.computed || (t.isObjectProperty(parent) || t.isObjectMethod(parent)) && parent.key === node && !parent.computed && !(t.isObjectProperty(parent) && parent.shorthand) || t.isExportSpecifier(parent) && parent.exported === node || t.isLabeledStatement(parent) || t.isBreakStatement(parent) || t.isContinueStatement(parent);
		patternNames = (pattern) => {
			if (t.isTSParameterProperty(pattern)) return patternNames(pattern.parameter);
			if (t.isIdentifier(pattern)) return [pattern.name];
			if (t.isAssignmentPattern(pattern)) return patternNames(pattern.left);
			if (t.isRestElement(pattern)) return patternNames(pattern.argument);
			if (t.isObjectPattern(pattern)) return pattern.properties.flatMap((property) => t.isRestElement(property) ? patternNames(property.argument) : patternNames(property.value));
			if (t.isArrayPattern(pattern)) return pattern.elements.flatMap((element) => element === null ? [] : patternNames(element));
			return [];
		};
		patternContains = (pattern, target) => pattern === target || t.isAssignmentPattern(pattern) && patternContains(pattern.left, target) || t.isRestElement(pattern) && patternContains(pattern.argument, target) || t.isObjectPattern(pattern) && pattern.properties.some((property) => t.isRestElement(property) ? patternContains(property.argument, target) : patternContains(property.value, target)) || t.isArrayPattern(pattern) && pattern.elements.some((element) => element !== null && patternContains(element, target));
		declarationNames = (declaration) => {
			if (t.isVariableDeclaration(declaration)) return declaration.declarations.flatMap(({ id }) => patternNames(id));
			if ((t.isFunctionDeclaration(declaration) || t.isClassDeclaration(declaration)) && t.isIdentifier(declaration.id)) return [declaration.id.name];
			if ((t.isTSInterfaceDeclaration(declaration) || t.isTSTypeAliasDeclaration(declaration) || t.isTSDeclareFunction(declaration)) && t.isIdentifier(declaration.id)) return [declaration.id.name];
			if (t.isTSImportEqualsDeclaration(declaration) && semanticImportEqualsSpecifier(declaration) !== null) return [declaration.id.name];
			return [];
		};
		defaultExportLocalName = (declaration) => {
			const value = unwrapJavaScriptExpression(declaration).node;
			if (t.isIdentifier(value)) return value.name;
			return (t.isFunctionDeclaration(value) || t.isClassDeclaration(value)) && t.isIdentifier(value.id) ? value.id.name : null;
		};
		commonJsExportName = (node, state) => {
			if (!t.isMemberExpression(node) && !t.isOptionalMemberExpression(node)) return undefined;
			const key = semanticStaticPropertyKey(node.property, node.computed);
			if (isUnshadowedGlobal(node.object, state, "exports")) return key === null ? "*" : key;
			if (t.isMemberExpression(node.object) && isCommonJsModuleExports(node.object, state)) return key === null ? "*" : key;
			if (isCommonJsModuleExports(node, state)) return "default";
			return undefined;
		};
		isCommonJsModuleExports = (node, state) => (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && isUnshadowedGlobal(node.object, state, "module") && semanticStaticPropertyKey(node.property, node.computed) === "exports";
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBootstrap.js
var javascriptBootstrapAt, dispatchedTableBinding, bindingId$1;
function init_javascriptBootstrap() {
	return (init_javascriptBootstrap = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticState();
		javascriptBootstrapAt = (call, state) => {
			if (!t.isFunctionExpression(call.callee) && !t.isArrowFunctionExpression(call.callee) || !t.isBlockStatement(call.callee.body) || runtimeFunctionParameters(call.callee).length !== 0 || call.arguments.length !== 0) return undefined;
			const body = call.callee.body;
			const tables = new Map();
			for (const statement of body.body) {
				if (!t.isVariableDeclaration(statement)) continue;
				for (const declaration of statement.declarations) {
					if (t.isIdentifier(declaration.id) && t.isObjectExpression(declaration.init) && declaration.init.properties.length > 0 && declaration.init.properties.every((property) => moduleFactory(property) !== undefined)) {
						const binding = resolveSemanticBindingState(state, declaration.id, declaration.id.name);
						if (binding !== undefined && semanticStableInitializer(binding, state)?.node === declaration.init) tables.set(binding.bindingId, declaration.init);
					}
				}
			}
			if (tables.size === 0) return undefined;
			for (const loader of body.body) {
				if (!t.isFunctionDeclaration(loader) || loader.id === null || loader.id === undefined || runtimeFunctionParameters(loader).length !== 1) continue;
				const parameter = runtimeFunctionParameters(loader)[0];
				if (!t.isIdentifier(parameter)) continue;
				const loaderName = loader.id.name;
				const loaderBindingId = bindingId$1(state, loader.id);
				const parameterBindingId = bindingId$1(state, parameter);
				if (loaderBindingId === undefined || parameterBindingId === undefined) continue;
				let tableBindingId;
				traverseJavaScriptAst(loader.body, { enter: (node, _parent, ancestors) => {
					if (!t.isCallExpression(node) || ancestors().some((node) => t.isFunction(node))) return;
					const candidate = dispatchedTableBinding(node, loaderBindingId, parameterBindingId, state);
					if (candidate !== undefined && tables.has(candidate)) tableBindingId = candidate;
				} });
				const table = tableBindingId === undefined ? undefined : tables.get(tableBindingId);
				if (table !== undefined && tableBindingId !== undefined) return {
					body,
					table,
					loaderName,
					loaderBindingId,
					tableBindingId
				};
			}
			return undefined;
		};
		dispatchedTableBinding = (call, loaderBindingId, keyBindingId, state) => {
			const member = call.callee;
			const viaCall = t.isMemberExpression(member) && semanticStaticPropertyKey(member.property, member.computed) === "call";
			const dispatch = viaCall && t.isMemberExpression(member) ? member.object : member;
			if (!t.isMemberExpression(dispatch) || !dispatch.computed || !t.isIdentifier(dispatch.object) || !t.isIdentifier(dispatch.property) || bindingId$1(state, dispatch.property) !== keyBindingId) return undefined;
			const args = viaCall ? call.arguments.slice(1) : call.arguments;
			const [module, exports, require] = args;
			if (args.length !== 3 || !t.isIdentifier(module) || bindingId$1(state, module) === undefined || !t.isMemberExpression(exports) || !t.isIdentifier(exports.object) || bindingId$1(state, exports.object) !== bindingId$1(state, module) || semanticStaticPropertyKey(exports.property, exports.computed) !== "exports" || !t.isIdentifier(require) || bindingId$1(state, require) !== loaderBindingId) return undefined;
			if (viaCall && (!t.isNode(call.arguments[0]) || !t.isNodesEquivalent(call.arguments[0], exports))) return undefined;
			return bindingId$1(state, dispatch.object);
		};
		bindingId$1 = (state, identifier) => resolveSemanticBindingState(state, identifier, identifier.name)?.bindingId;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBootstrapIntegrity.js
var proveJavaScriptBootstrapIntegrity, loaderShape, tableDispatch, moduleCache, startsEmpty, isPlainObject, runsUnconditionally, moduleObjectContained, moduleUse, withCacheReads, returnsModuleExports, sideEffectBeforeReturn, keyedSlot, referencesAreContained, containedUse, isRuntimeExposure, exposedTableUse, exposedSlotWrite, bindingOf;
function init_javascriptBootstrapIntegrity() {
	return (init_javascriptBootstrapIntegrity = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		proveJavaScriptBootstrapIntegrity = (call, bootstrap, loaderIds, state) => {
			if (bootstrap.table.properties.some((property) => t.isSpreadElement(property) ? true : semanticStaticPropertyKey(property.key, property.computed) === null)) return undefined;
			const loader = bootstrap.body.body.find((statement) => t.isFunctionDeclaration(statement) && statement.id !== null && statement.id !== undefined && bindingOf(state, statement.id) === bootstrap.loaderBindingId);
			const shape = loader === undefined ? undefined : loaderShape(loader, bootstrap.tableBindingId, state);
			if (shape === undefined) return undefined;
			return referencesAreContained(call, {
				bootstrap,
				shape,
				loaderIds
			}, state);
		};
		loaderShape = (loader, tableId, state) => {
			const [parameter] = loader.params;
			const parameterId = t.isIdentifier(parameter) ? bindingOf(state, parameter) : undefined;
			if (parameterId === undefined || state.bindingsById.get(parameterId)?.definitions.length !== 1 || loader.async || loader.generator) return undefined;
			const dispatches = new Set();
			const calls = [];
			const modules = new Set();
			const returns = [];
			traverseJavaScriptAst(loader.body, {
				skip: (node) => t.isFunction(node),
				enter: (node) => {
					if (t.isReturnStatement(node)) returns.push(node.argument);
					if (!t.isCallExpression(node)) return;
					const dispatch = tableDispatch(node, tableId, parameterId, state);
					if (dispatch === undefined) return;
					dispatches.add(dispatch.table);
					calls.push(node);
					if (dispatch.moduleId !== undefined) modules.add(dispatch.moduleId);
				}
			});
			const [moduleId] = modules;
			const [dispatch] = calls;
			if (calls.length !== 1 || dispatch === undefined || modules.size !== 1 || moduleId === undefined || !runsUnconditionally(dispatch, loader, state)) return undefined;
			const cache = moduleCache(moduleId, parameterId, state);
			if (cache === null || !moduleObjectContained(loader, moduleId, dispatch, state)) return undefined;
			const shape = {
				parameterId,
				dispatch,
				dispatches,
				moduleId,
				cacheId: cache?.cacheId,
				cacheSites: new Set(cache === undefined ? [] : [cache.site])
			};
			return returns.every((argument) => returnsModuleExports(argument, shape, state)) ? withCacheReads(loader, shape, state) : undefined;
		};
		tableDispatch = (call, tableId, parameterId, state) => {
			const viaCall = t.isMemberExpression(call.callee) && semanticStaticPropertyKey(call.callee.property, call.callee.computed) === "call";
			const slot = viaCall && t.isMemberExpression(call.callee) ? call.callee.object : call.callee;
			if (!t.isMemberExpression(slot) || !slot.computed || !t.isIdentifier(slot.object) || !t.isIdentifier(slot.property) || bindingOf(state, slot.object) !== tableId || bindingOf(state, slot.property) !== parameterId) return undefined;
			const module = call.arguments[viaCall ? 1 : 0];
			const moduleId = t.isIdentifier(module) ? bindingOf(state, module) : undefined;
			return moduleId === undefined ? { table: slot.object } : {
				table: slot.object,
				moduleId
			};
		};
		moduleCache = (moduleId, parameterId, state) => {
			const binding = state.bindingsById.get(moduleId);
			const initializer = semanticStableInitializer(binding, state);
			if (binding?.definitions.length !== 1 || initializer === undefined || initializer.projection.length !== 0) return null;
			const value = initializer.node;
			if (isPlainObject(value)) return undefined;
			if (!t.isAssignmentExpression(value, { operator: "=" }) || !isPlainObject(value.right)) return null;
			const cacheId = keyedSlot(value.left, parameterId, state);
			return cacheId !== undefined && startsEmpty(cacheId, state) ? {
				cacheId,
				site: value.left
			} : null;
		};
		startsEmpty = (cacheId, state) => {
			const binding = state.bindingsById.get(cacheId);
			const initializer = semanticStableInitializer(binding, state);
			return binding?.definitions.length === 1 && initializer?.projection.length === 0 && t.isObjectExpression(initializer.node) && initializer.node.properties.length === 0;
		};
		isPlainObject = (node) => t.isObjectExpression(node) && node.properties.every((property) => t.isObjectProperty(property) && !property.computed && semanticStaticPropertyKey(property.key, false) !== "__proto__");
		runsUnconditionally = (dispatch, loader, state) => {
			let child = dispatch;
			let parent = state.parentsByNode.get(child);
			while (parent !== undefined && child !== loader.body) {
				const ordered = t.isSequenceExpression(parent) || t.isExpressionStatement(parent) || t.isReturnStatement(parent) || t.isBlockStatement(parent) || t.isMemberExpression(parent) && parent.object === child || t.isCallExpression(parent) && parent.callee === child || t.isTryStatement(parent) && parent.block === child;
				if (!ordered) return false;
				child = parent;
				parent = state.parentsByNode.get(parent);
			}
			return child === loader.body;
		};
		moduleObjectContained = (loader, moduleId, dispatch, state) => {
			let contained = true;
			traverseJavaScriptAst(loader.body, { enter: (node, parent, readAncestors) => {
				if (!contained || !t.isIdentifier(node) || parent === null) return;
				const ancestors = readAncestors();
				if (!t.isReferenced(node, parent, ancestors.at(-2))) return;
				if (bindingOf(state, node) !== moduleId) return;
				contained = !ancestors.some((ancestor) => t.isFunction(ancestor)) && moduleUse(node, [parent, ancestors.at(-2)], dispatch);
			} });
			return contained;
		};
		moduleUse = (node, [parent, grandparent], dispatch) => {
			if (parent === dispatch) return dispatch.arguments.includes(node);
			if (!t.isMemberExpression(parent) || parent.object !== node) return false;
			const key = semanticStaticPropertyKey(parent.property, parent.computed);
			const written = t.isAssignmentExpression(grandparent) && grandparent.left === parent || t.isUpdateExpression(grandparent) || t.isUnaryExpression(grandparent, { operator: "delete" });
			if (written) return key !== null && key !== "exports";
			if (key !== "exports") return false;
			return grandparent === dispatch || (parent.start ?? -1) > (dispatch.end ?? Number.POSITIVE_INFINITY);
		};
		withCacheReads = (loader, shape, state) => {
			if (shape.cacheId === undefined) return shape;
			const sites = new Set(shape.cacheSites);
			let contained = true;
			traverseJavaScriptAst(loader.body, {
				skip: (node) => t.isFunction(node),
				enter: (node, parent) => {
					if (!t.isMemberExpression(node) || keyedSlot(node, shape.parameterId, state) !== shape.cacheId) return;
					const read = t.isVariableDeclarator(parent) && parent.init === node;
					const deleted = t.isUnaryExpression(parent, { operator: "delete" });
					if (read || deleted || sites.has(node)) sites.add(node);
					else contained = false;
				}
			});
			return contained ? {
				...shape,
				cacheSites: sites
			} : undefined;
		};
		returnsModuleExports = (argument, shape, state) => {
			const value = t.isSequenceExpression(argument) ? argument.expressions.at(-1) : argument;
			const before = t.isSequenceExpression(argument) ? argument.expressions.slice(0, -1) : [];
			if (!before.every((expression) => sideEffectBeforeReturn(expression, shape, state))) return false;
			if (!t.isMemberExpression(value) || !t.isIdentifier(value.object) || semanticStaticPropertyKey(value.property, value.computed) !== "exports") return false;
			const id = bindingOf(state, value.object);
			if (id === shape.moduleId) return true;
			if (id === undefined || shape.cacheId === undefined) return false;
			const binding = state.bindingsById.get(id);
			const initializer = semanticStableInitializer(binding, state);
			return binding?.definitions.length === 1 && initializer?.projection.length === 0 && keyedSlot(initializer.node, shape.parameterId, state) === shape.cacheId;
		};
		sideEffectBeforeReturn = (expression, shape, state) => {
			if (expression === shape.dispatch) return true;
			if (!t.isAssignmentExpression(expression) || !t.isMemberExpression(expression.left) || !t.isIdentifier(expression.left.object) || bindingOf(state, expression.left.object) !== shape.moduleId) return false;
			const key = semanticStaticPropertyKey(expression.left.property, expression.left.computed);
			return key !== null && key !== "exports";
		};
		keyedSlot = (node, parameterId, state) => t.isMemberExpression(node) && node.computed && t.isIdentifier(node.object) && t.isIdentifier(node.property) && bindingOf(state, node.property) === parameterId ? bindingOf(state, node.object) : undefined;
		referencesAreContained = (call, { bootstrap, shape, loaderIds }, state) => {
			const tracked = new Map([
				[bootstrap.tableBindingId, "table"],
				...shape.cacheId === undefined ? [] : [[shape.cacheId, "cache"]],
				...[...loaderIds].map((id) => [id, "loader"])
			]);
			const names = new Set([...tracked.keys()].flatMap((id) => state.bindingsById.get(id)?.name ?? []));
			const replacedKeys = new Set();
			let contained = true;
			traverseJavaScriptAst(call, {
				skip: () => !contained,
				enter: (node, parent, readAncestors) => {
					if (!t.isIdentifier(node) || !names.has(node.name) || parent === null) return;
					const ancestors = readAncestors();
					if (!t.isReferenced(node, parent, ancestors.at(-2))) return;
					const id = bindingOf(state, node);
					const role = id === undefined ? undefined : tracked.get(id);
					if (role === undefined) return;
					const use = {
						node,
						parent,
						ancestors,
						shape,
						loaderIds,
						state
					};
					if (role !== "loader") contained = containedUse(role, use);
					else if (exposedTableUse(use) === "escaped") contained = false;
					else exposedSlotWrite(use, replacedKeys);
				}
			});
			return contained ? { replacedKeys } : undefined;
		};
		containedUse = (role, use) => {
			if (role === "table" && use.shape.dispatches.has(use.node)) return true;
			if (role === "cache" && use.shape.cacheSites.has(use.parent)) return true;
			return isRuntimeExposure(use, role === "table" ? "m" : "c");
		};
		isRuntimeExposure = (use, key) => {
			const { parent, node, loaderIds, state } = use;
			return t.isAssignmentExpression(parent, { operator: "=" }) && parent.right === node && t.isMemberExpression(parent.left) && t.isIdentifier(parent.left.object) && semanticStaticPropertyKey(parent.left.property, parent.left.computed) === key && loaderIds.has(bindingOf(state, parent.left.object) ?? "");
		};
		exposedTableUse = (use) => {
			const { parent, ancestors } = use;
			if (!t.isMemberExpression(parent) || parent.object !== use.node || !["m", "c"].includes(semanticStaticPropertyKey(parent.property, parent.computed) ?? "")) return "other";
			const outer = ancestors.at(-2);
			const assigned = t.isAssignmentExpression(outer, { operator: "=" }) && outer.left === parent;
			const indexed = t.isMemberExpression(outer) && outer.object === parent && outer.computed;
			if (assigned) return "contained";
			if (!indexed) return "escaped";
			const member = ancestors.at(-3);
			const target = ancestors.at(-4);
			const entryWritten = t.isMemberExpression(member) && member.object === outer && (t.isAssignmentExpression(target) && target.left === member || t.isUpdateExpression(target) || t.isUnaryExpression(target, { operator: "delete" }));
			return entryWritten ? "escaped" : "contained";
		};
		exposedSlotWrite = (use, replacedKeys) => {
			const { parent, ancestors } = use;
			const slot = ancestors.at(-2);
			const write = ancestors.at(-3);
			if (!t.isMemberExpression(parent) || parent.object !== use.node || !["m", "c"].includes(semanticStaticPropertyKey(parent.property, parent.computed) ?? "") || !t.isMemberExpression(slot) || slot.object !== parent || !(t.isAssignmentExpression(write) && write.left === slot || t.isUnaryExpression(write, { operator: "delete" }) || t.isUpdateExpression(write))) return;
			const key = slot.computed ? argumentValue(slot.property) : semanticStaticPropertyKey(slot.property, false);
			if (key !== undefined && key !== null) replacedKeys.add(key);
		};
		bindingOf = (state, identifier) => resolveSemanticBindingState(state, identifier, identifier.name)?.bindingId;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptBundledRequireOrigin.js
var proofs, semanticBundledRequireOrigin, canonicalWebpackInteropBindings, isCanonicalGetter, isInstalledBeforeEntryDispatch, bootstrapProofForLoaderCall, sameBinding, getterReturnsDefault, getterReturnsModule, bootstrapExternals, proveBootstrapExternals, externalSpecifier, singleDefinition;
function init_javascriptBundledRequireOrigin() {
	return (init_javascriptBundledRequireOrigin = __esmMin((() => {
		init_javascriptBootstrap();
		init_javascriptBootstrapIntegrity();
		init_javascriptAstValues();
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticState();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticTraversal();
		proofs = new WeakMap();
		semanticBundledRequireOrigin = (node, state) => {
			const chain = semanticMemberChain(node);
			const current = chain?.root;
			if (chain?.members.length === 0 && t.isCallExpression(current) && t.isMemberExpression(current.callee) && semanticStaticPropertyKey(current.callee.property, current.callee.computed) === "n" && t.isIdentifier(current.callee.object) && current.arguments.length === 1) {
				const nested = semanticBundledRequireOrigin(current.arguments[0], state);
				const loaderBinding = resolveSemanticBindingState(state, current.callee.object, current.callee.object.name);
				const proof = nested === undefined || loaderBinding === undefined ? undefined : bootstrapProofForLoaderCall(nested.call, loaderBinding.bindingId, state);
				const nestedCallee = nested?.call.callee;
				const loaderBindingId = loaderBinding?.bindingId;
				if (nested !== undefined && nested.origin.importedPath.length === 0 && t.isIdentifier(nestedCallee) && loaderBindingId !== undefined && loaderBindingId === resolveSemanticBindingState(state, nestedCallee, nestedCallee.name)?.bindingId && proof?.loaderBindingIds.has(loaderBindingId) === true && proof.interopGetterBindingIds.has(loaderBindingId)) return nested;
			}
			if (chain === undefined || !t.isCallExpression(current) || !t.isIdentifier(current.callee) || current.arguments.length !== 1) return undefined;
			const key = argumentValue(current.arguments[0]);
			if (key === undefined) return undefined;
			const loader = current.callee;
			if (semanticResolutionBlocked(state, loader, loader.name)) return undefined;
			const binding = resolveSemanticBindingState(state, loader, loader.name);
			if (binding === undefined || binding.definitions.length !== 1 || binding.definitions[0]?.kind === "assignment") return undefined;
			for (let ancestor = state.parentsByNode.get(current); ancestor !== undefined; ancestor = state.parentsByNode.get(ancestor)) {
				if (!t.isCallExpression(ancestor)) continue;
				const proof = bootstrapExternals(ancestor, state);
				if (proof === null || !proof.loaderBindingIds.has(binding.bindingId)) continue;
				const specifier = proof.externals.get(key);
				return typeof specifier === "string" ? {
					origin: {
						specifier,
						importedPath: chain.members,
						resolutionMode: "require"
					},
					call: current
				} : undefined;
			}
			return undefined;
		};
		canonicalWebpackInteropBindings = (loaderBindingIds, bootstrapBody, state) => {
			const writes = new Map();
			let reflectiveWrite = false;
			traverseJavaScriptAst(state.program, { enter: (node) => {
				if (t.isAssignmentExpression(node) && t.isMemberExpression(node.left)) {
					const target = node.left;
					const bindingId = t.isIdentifier(target.object) ? resolveSemanticBindingState(state, target.object, target.object.name)?.bindingId : undefined;
					if (semanticStaticPropertyKey(target.property, target.computed) === "n" && bindingId !== undefined && loaderBindingIds.has(bindingId)) writes.set(bindingId, [...writes.get(bindingId) ?? [], node]);
				}
				if (!t.isCallExpression(node) || !t.isMemberExpression(node.callee) || !t.isIdentifier(node.callee.object, { name: "Object" }) || ![
					"defineProperty",
					"defineProperties",
					"assign",
					"setPrototypeOf"
				].includes(semanticStaticPropertyKey(node.callee.property, node.callee.computed) ?? "") || !t.isIdentifier(node.arguments[0])) return;
				reflectiveWrite ||= loaderBindingIds.has(resolveSemanticBindingState(state, node.arguments[0], node.arguments[0].name)?.bindingId ?? "");
			} });
			const proven = new Set();
			if (reflectiveWrite) return proven;
			const allWrites = [...writes.values()].flat();
			const [write] = allWrites;
			if (allWrites.length === 1 && write !== undefined && isInstalledBeforeEntryDispatch(write, bootstrapBody, loaderBindingIds, state) && isCanonicalGetter(write, state)) for (const bindingId of loaderBindingIds) proven.add(bindingId);
			return proven;
		};
		isCanonicalGetter = (write, state) => {
			if (!t.isArrowFunctionExpression(write.right) || write.right.params.length !== 1 || !t.isIdentifier(write.right.params[0])) return false;
			const parameter = write.right.params[0];
			const parameterBinding = resolveSemanticBindingState(state, parameter, parameter.name);
			const body = write.right.body;
			return parameterBinding !== undefined && t.isConditionalExpression(body) && t.isLogicalExpression(body.test, { operator: "&&" }) && sameBinding(body.test.left, parameterBinding.bindingId, state) && t.isMemberExpression(body.test.right) && semanticStaticPropertyKey(body.test.right.property, body.test.right.computed) === "__esModule" && sameBinding(body.test.right.object, parameterBinding.bindingId, state) && getterReturnsDefault(body.consequent, parameterBinding.bindingId, state) && getterReturnsModule(body.alternate, parameterBinding.bindingId, state);
		};
		isInstalledBeforeEntryDispatch = (write, body, loaderBindingIds, state) => {
			const statement = state.parentsByNode.get(write);
			if (!t.isExpressionStatement(statement)) return false;
			const writeIndex = body.body.indexOf(statement);
			if (writeIndex < 0) return false;
			let entryIndex = -1;
			for (let index = 0; index < body.body.length; index += 1) {
				const topLevel = body.body[index];
				if (topLevel === undefined) continue;
				traverseJavaScriptAst(topLevel, { enter: (node, _parent, ancestors) => {
					if (entryIndex < 0 && t.isCallExpression(node) && t.isIdentifier(node.callee) && ancestors().every((ancestor) => !t.isFunction(ancestor)) && loaderBindingIds.has(resolveSemanticBindingState(state, node.callee, node.callee.name)?.bindingId ?? "")) entryIndex = index;
				} });
				if (entryIndex >= 0) break;
			}
			return entryIndex > writeIndex;
		};
		bootstrapProofForLoaderCall = (call, loaderBindingId, state) => {
			for (let ancestor = state.parentsByNode.get(call); ancestor !== undefined; ancestor = state.parentsByNode.get(ancestor)) {
				if (!t.isCallExpression(ancestor)) continue;
				const proof = bootstrapExternals(ancestor, state);
				if (proof?.loaderBindingIds.has(loaderBindingId)) return proof;
			}
			return undefined;
		};
		sameBinding = (node, bindingId, state) => t.isIdentifier(node) && resolveSemanticBindingState(state, node, node.name)?.bindingId === bindingId;
		getterReturnsDefault = (node, bindingId, state) => t.isArrowFunctionExpression(node) && node.params.length === 0 && t.isMemberExpression(node.body) && semanticStaticPropertyKey(node.body.property, node.body.computed) === "default" && sameBinding(node.body.object, bindingId, state);
		getterReturnsModule = (node, bindingId, state) => t.isArrowFunctionExpression(node) && node.params.length === 0 && sameBinding(node.body, bindingId, state);
		bootstrapExternals = (call, state) => {
			let byCall = proofs.get(state);
			if (byCall === undefined) {
				byCall = new WeakMap();
				proofs.set(state, byCall);
			}
			const cached = byCall.get(call);
			if (cached !== undefined) return cached;
			const proof = proveBootstrapExternals(call, state);
			byCall.set(call, proof);
			return proof;
		};
		proveBootstrapExternals = (call, state) => {
			const bootstrap = javascriptBootstrapAt(call, state);
			if (bootstrap === undefined || !singleDefinition(state, bootstrap.loaderBindingId, "function")) return null;
			const loaderBindingIds = new Set([bootstrap.loaderBindingId]);
			const factories = bootstrap.table.properties.flatMap((property) => {
				const factory = moduleFactory(property);
				return factory === undefined ? [] : [{
					property,
					factory
				}];
			});
			for (const { factory } of factories) {
				const loaderParameter = factory.params[2];
				const bindingId = t.isIdentifier(loaderParameter) ? resolveSemanticBindingState(state, loaderParameter, loaderParameter.name)?.bindingId : undefined;
				if (bindingId !== undefined && singleDefinition(state, bindingId, "parameter")) loaderBindingIds.add(bindingId);
			}
			const integrity = proveJavaScriptBootstrapIntegrity(call, bootstrap, loaderBindingIds, state);
			if (integrity === undefined) return null;
			const externals = new Map();
			for (const { property, factory } of factories) {
				const key = modulePropertyName(property);
				const specifier = integrity.replacedKeys.has(key) ? undefined : externalSpecifier(factory, state);
				if (externals.has(key)) externals.set(key, null);
				else externals.set(key, specifier ?? null);
			}
			return {
				loaderBindingIds,
				interopGetterBindingIds: canonicalWebpackInteropBindings(loaderBindingIds, bootstrap.body, state),
				externals
			};
		};
		externalSpecifier = (factory, state) => {
			const moduleParameter = factory.params[0];
			const names = factory.params.map((parameter) => t.isIdentifier(parameter) ? parameter.name : null);
			if (!t.isIdentifier(moduleParameter) || new Set(names).size !== names.length || factory.generator || factory.async || t.isObjectMethod(factory) && factory.kind !== "method") return undefined;
			let expression;
			if (t.isBlockStatement(factory.body)) {
				const [statement] = factory.body.body;
				if (factory.body.body.length !== 1 || !t.isExpressionStatement(statement)) return undefined;
				expression = statement.expression;
			} else expression = factory.body;
			if (!t.isAssignmentExpression(expression, { operator: "=" }) || !t.isMemberExpression(expression.left) || !t.isIdentifier(expression.left.object) || semanticStaticPropertyKey(expression.left.property, expression.left.computed) !== "exports") return undefined;
			const moduleBinding = resolveSemanticBindingState(state, moduleParameter, moduleParameter.name);
			const target = resolveSemanticBindingState(state, expression.left.object, expression.left.object.name);
			if (moduleBinding === undefined || target?.bindingId !== moduleBinding.bindingId) return undefined;
			const required = semanticRequireOrigin(expression.right, state)?.origin;
			return required !== undefined && required.importedPath.length === 0 ? required.specifier : undefined;
		};
		singleDefinition = (state, bindingId, kind) => {
			const definitions = state.bindingsById.get(bindingId)?.definitions;
			return definitions?.length === 1 && definitions[0]?.kind === kind;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallableResults.js
var semanticCallableResultExpressions;
function init_javascriptSemanticCallableResults() {
	return (init_javascriptSemanticCallableResults = __esmMin((() => {
		init_javascriptSemanticTraversal();
		semanticCallableResultExpressions = (callable) => {
			if (t.isArrowFunctionExpression(callable) && !t.isBlockStatement(callable.body)) return [{
				node: callable.body,
				site: callable.body,
				kind: "return",
				delegated: false
			}];
			if (!t.isFunction(callable)) return [];
			const output = [];
			const pending = childNodes(callable.body).reverse();
			while (pending.length > 0) {
				const node = pending.pop();
				if (node === undefined || t.isFunction(node) || t.isClass(node)) continue;
				if (t.isReturnStatement(node)) {
					output.push({
						node: node.argument ?? null,
						site: node,
						kind: "return",
						delegated: false
					});
				}
				if (t.isYieldExpression(node)) output.push({
					node: node.argument ?? null,
					site: node,
					kind: "yield",
					delegated: node.delegate
				});
				for (const child of childNodes(node).reverse()) pending.push(child);
			}
			return output;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReferenceSources.js
var semanticReferenceSourcesInactive, semanticSelectedReferenceSlot;
function init_javascriptSemanticReferenceSources() {
	return (init_javascriptSemanticReferenceSources = __esmMin((() => {
		init_javascriptSemanticValues();
		init_javascriptSemanticSlots();
		semanticReferenceSourcesInactive = (reference, state) => reference.requiredSources?.some((source) => semanticSelectedReferenceSlot(source, state, source.node)?.presence === "absent") === true || reference.fallbackSources?.some((source) => {
			const slot = semanticSelectedReferenceSlot(source, state, source.node);
			return slot?.presence === "present" && (slot.value.status === "literal" || slot.value.status === "union" || slot.value.status === "object" || slot.value.status === "array");
		}) === true;
		semanticSelectedReferenceSlot = (source, state, capturePoint) => {
			const path = [];
			for (const key of source.projection) {
				if (key === null || typeof key === "object") return undefined;
				path.push(String(key));
			}
			return semanticSlotAtPath(evaluateSemanticExpression(source.node, state, capturePoint), path);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticObjectReferences.js
var semanticClassCandidates, instanceFieldReferences, classPropertyDescriptors, semanticClassPropertyReferences, objectReceiverReference, privateReceiverProjection, getterResultReferences, semanticObjectPropertyReferences, objectExpressionDefinesKey;
function init_javascriptSemanticObjectReferences() {
	return (init_javascriptSemanticObjectReferences = __esmMin((() => {
		init_javascriptSemanticState();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		semanticClassCandidates = (root, state) => {
			const pending = [root];
			const seenNodes = new Set();
			const seenBindings = new Set();
			const classes = [];
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const node = pending[cursor];
				if (node === undefined) continue;
				const expression = unwrapJavaScriptExpression(node).node;
				if (seenNodes.has(expression)) continue;
				seenNodes.add(expression);
				if (t.isClass(expression)) {
					classes.push(expression);
				} else if (t.isIdentifier(expression)) {
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					if (binding === undefined || seenBindings.has(binding.bindingId)) continue;
					seenBindings.add(binding.bindingId);
					for (const initializer of binding.initializers) pending.push(initializer.node);
				} else if (t.isConditionalExpression(expression) || t.isLogicalExpression(expression)) {
					pending.push(t.isConditionalExpression(expression) ? expression.consequent : expression.left, t.isConditionalExpression(expression) ? expression.alternate : expression.right);
				} else if (t.isSequenceExpression(expression)) {
					const last = expression.expressions.at(-1);
					if (last !== undefined) pending.push(last);
				}
			}
			return classes;
		};
		instanceFieldReferences = (root, propertyName, path, state, initializedBefore) => {
			const references = [];
			const pending = [{
				klass: root,
				excluded: new Set()
			}];
			const selections = new Map();
			let definiteNames;
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) continue;
				const previous = selections.get(current.klass);
				const excluded = previous === undefined ? current.excluded : new Set([...previous].filter((name) => current.excluded.has(name)));
				if (previous !== undefined && previous.size === excluded.size) continue;
				selections.set(current.klass, excluded);
				const shadowed = new Set(excluded);
				const before = initializedBefore === undefined ? -1 : current.klass.body.body.indexOf(initializedBefore);
				const members = before < 0 ? current.klass.body.body : current.klass.body.body.slice(0, before);
				for (const member of [...members].reverse()) {
					if (!t.isClassProperty(member) || member.static) continue;
					const key = semanticStaticPropertyKey(member.key, member.computed);
					if (key !== null && shadowed.has(key)) continue;
					if (key !== null) shadowed.add(key);
					if ((propertyName === null || key === null || key === propertyName) && member.value != null) references.push({
						node: member.value,
						path
					});
				}
				const bases = current.klass.superClass == null ? [] : semanticClassCandidates(current.klass.superClass, state);
				if (bases.length === 0) definiteNames = definiteNames === undefined ? shadowed : new Set([...definiteNames].filter((name) => shadowed.has(name)));
				for (const klass of bases) pending.push({
					klass,
					excluded: shadowed
				});
			}
			return {
				references,
				definiteNames: definiteNames ?? new Set()
			};
		};
		classPropertyDescriptors = (klass, propertyName, kind, initializedBefore) => {
			const isStatic = kind === "static";
			const selectedGetters = [];
			const fields = [];
			const indexedMembers = [];
			const before = initializedBefore === undefined ? -1 : klass.body.body.indexOf(initializedBefore);
			klass.body.body.forEach((member, index) => {
				if (before >= 0 && index >= before && t.isClassProperty(member)) return;
				if ((t.isClassMethod(member) || kind === "static" && t.isClassProperty(member)) && member.static === isStatic) indexedMembers.push({
					member,
					index,
					key: semanticStaticPropertyKey(member.key, member.computed)
				});
			});
			const matchingMembers = propertyName === null ? [] : indexedMembers.filter(({ key }) => key === propertyName);
			const uncertainGetters = indexedMembers.filter((entry) => {
				const { member, key } = entry;
				return t.isClassMethod(member) && member.kind === "get" && (propertyName === null || member.computed && key === null);
			});
			const getters = matchingMembers.filter((entry) => t.isClassMethod(entry.member) && entry.member.kind === "get");
			const getter = getters.at(-1);
			const getterIndex = getter?.index ?? -1;
			const laterDataMember = matchingMembers.some(({ member, index }) => t.isClassProperty(member) || t.isClassMethod(member) && member.kind === "method" && index > getterIndex);
			const seenFields = new Set();
			for (const { member, key } of [...indexedMembers].reverse()) {
				if (!t.isClassProperty(member)) continue;
				if (key !== null && seenFields.has(key)) continue;
				if (key !== null) seenFields.add(key);
				if (propertyName === null || key === null || key === propertyName) fields.push(member);
			}
			if (getters.length > 0 && !laterDataMember && getter !== undefined) selectedGetters.push(getter.member);
			for (const { member, index } of uncertainGetters) if (!matchingMembers.some(({ member: matching, index: matchingIndex }) => (t.isClassProperty(matching) || t.isClassMethod(matching) && (matching.kind === "method" || matching.kind === "get")) && matchingIndex > index)) selectedGetters.push(member);
			return {
				getters: selectedGetters,
				fields,
				inherits: matchingMembers.length === 0
			};
		};
		semanticClassPropertyReferences = (lookup, selection, state, activeGetters = new Map()) => {
			const root = lookup.owner;
			const receiver = lookup.receiver ?? root;
			const [key, ...path] = selection;
			const propertyName = key == null || typeof key === "object" ? null : String(key);
			const pending = [root];
			const seen = new Set();
			const possibleResults = [];
			let instanceFields = new Set();
			if (lookup.kind === "instance") {
				const fields = instanceFieldReferences(root, propertyName, path, state, lookup.initializedBefore);
				possibleResults.push(...fields.references);
				instanceFields = fields.definiteNames;
				if (propertyName !== null && instanceFields.has(propertyName)) return possibleResults;
			}
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const klass = pending[cursor];
				if (klass === undefined || seen.has(klass)) continue;
				seen.add(klass);
				const descriptors = classPropertyDescriptors(klass, propertyName, lookup.kind, lookup.initializedBefore);
				for (const field of descriptors.fields) if (field.value != null) possibleResults.push({
					node: field.value,
					path
				});
				for (const getter of lookup.fieldsOnly ? [] : descriptors.getters) {
					const key = semanticStaticPropertyKey(getter.key, getter.computed);
					if (key !== null && instanceFields.has(key)) continue;
					possibleResults.push(...getterResultReferences({
						getter,
						owner: klass,
						receiver
					}, path, state, activeGetters));
				}
				if (descriptors.inherits && klass.superClass !== null && klass.superClass !== undefined) pending.push(...semanticClassCandidates(klass.superClass, state));
			}
			return possibleResults;
		};
		objectReceiverReference = (object, path, state) => {
			let current = object;
			const projection = [];
			while (true) {
				const parent = state.parentsByNode.get(current);
				if (t.isVariableDeclarator(parent) && parent.init === current && t.isIdentifier(parent.id)) return [{
					node: parent.id,
					path: [...projection, ...path],
					ownerInitializer: current
				}];
				if (t.isAssignmentExpression(parent, { operator: "=" }) && parent.right === current && t.isIdentifier(parent.left)) return [{
					node: parent.left,
					path: [...projection, ...path],
					ownerInitializer: current
				}];
				if (t.isArrayExpression(parent)) {
					let minimumIndex = 0;
					let uncertainIndex = false;
					for (const element of parent.elements) {
						if (element === current) break;
						if (t.isSpreadElement(element)) uncertainIndex = true;
						else minimumIndex++;
					}
					projection.unshift(uncertainIndex ? {
						excludedKeys: [],
						startIndex: minimumIndex
					} : minimumIndex);
					current = parent;
					continue;
				}
				if (t.isObjectProperty(parent) && parent.value === current) {
					projection.unshift(semanticStaticPropertyKey(parent.key, parent.computed));
					const container = state.parentsByNode.get(parent);
					if (t.isObjectExpression(container)) {
						current = container;
						continue;
					}
				}
				break;
			}
			return [{
				node: object,
				path
			}];
		};
		privateReceiverProjection = (receiver, owner, path, isStatic, state) => {
			if (path.some((key) => key === null || typeof key === "object")) return false;
			const pending = [{
				receiver,
				path: path.map((key) => ({ key: String(key) })),
				visits: new Map()
			}];
			const seen = new Set();
			const declaringClass = (field) => {
				const body = state.parentsByNode.get(field);
				return body === undefined ? undefined : state.parentsByNode.get(body);
			};
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) break;
				const [selection, ...remaining] = current.path;
				if (selection === undefined) {
					if (!isStatic || current.receiver === owner) return true;
					continue;
				}
				const origin = JSON.stringify([
					current.receiver.start,
					selection.key,
					selection.before?.start
				]);
				const previous = current.visits.get(origin);
				if (previous !== undefined && previous <= current.path.length) continue;
				const visits = new Map(current.visits).set(origin, current.path.length);
				const identity = JSON.stringify([current.receiver.start, current.path.map(({ key, before }) => [key, before?.start])]);
				if (seen.has(identity)) continue;
				seen.add(identity);
				const lookupOwner = selection.before === undefined ? current.receiver : declaringClass(selection.before);
				if (!t.isClass(lookupOwner)) continue;
				for (const reference of semanticClassPropertyReferences({
					owner: lookupOwner,
					receiver: current.receiver,
					kind: isStatic ? "static" : "instance",
					fieldsOnly: true,
					...selection.before === undefined ? {} : { initializedBefore: selection.before }
				}, [selection.key], state)) {
					const field = state.parentsByNode.get(reference.node);
					if (!t.isClassProperty(field)) continue;
					const fieldOwner = declaringClass(field);
					if (!t.isClass(fieldOwner)) continue;
					const projection = [];
					let value = unwrapJavaScriptExpression(reference.node).node;
					while (t.isMemberExpression(value) || t.isOptionalMemberExpression(value)) {
						const key = semanticStaticPropertyKey(value.property, value.computed);
						if (key === null || t.isPrivateName(value.property)) break;
						projection.unshift({
							key,
							before: field
						});
						value = unwrapJavaScriptExpression(value.object).node;
					}
					if (!t.isThisExpression(value)) continue;
					pending.push({
						receiver: isStatic ? fieldOwner : current.receiver,
						path: [...projection, ...remaining],
						visits
					});
				}
			}
			return false;
		};
		getterResultReferences = (invocation, path, state, activeGetters = new Map()) => {
			const { getter, owner, receiver = owner } = invocation;
			const previousLength = activeGetters.get(getter);
			if (previousLength !== undefined && previousLength <= path.length) return [];
			const active = new Map(activeGetters).set(getter, path.length);
			const isStatic = t.isClassMethod(getter) && getter.static;
			const pending = semanticCallableResultExpressions(getter).flatMap(({ node }) => node === null ? [] : [{
				node,
				path,
				aliases: undefined
			}]);
			const references = [];
			const expandedAliases = new Map();
			const getterScope = state.scopeByNode.get(getter)?.scopeId;
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const current = pending[cursor];
				if (current === undefined) break;
				const { path: remaining } = current;
				const expression = unwrapJavaScriptExpression(current.node).node;
				const retain = (reference) => {
					references.push(current.escapes ? {
						...reference,
						escapes: true
					} : reference);
				};
				const retainPrivateRead = () => {
					if (current.privateRead !== undefined) retain({
						node: current.privateRead.node,
						path: current.escapes ? [] : current.privateRead.path
					});
				};
				if (t.isIdentifier(expression)) {
					const binding = resolveSemanticBindingState(state, expression, expression.name);
					let scope = binding === undefined ? undefined : state.scopesById.get(binding.scopeId);
					while (scope !== undefined && scope.scopeId !== getterScope) {
						if (scope.kind === "function" || scope.parentScopeId === null) {
							scope = undefined;
							break;
						}
						scope = state.scopesById.get(scope.parentScopeId);
					}
					if (binding !== undefined && scope !== undefined && binding.referenceInitializers.every((initializer) => initializer.copyKind === undefined)) {
						const identity = JSON.stringify([
							binding.bindingId,
							expression.start,
							expression.end
						]);
						const known = expandedAliases.get(identity);
						const key = JSON.stringify([
							remaining,
							current.privateRead?.name,
							current.privateRead?.path,
							current.escapes
						]);
						let cyclic = false;
						let growing = false;
						if (known !== undefined) {
							for (let visit = current.aliases; visit !== undefined; visit = visit.parent) if (visit.identity === identity) {
								cyclic = true;
								growing = remaining.length > visit.pathLength;
								break;
							}
						}
						if (cyclic) {
							if (growing && !current.escapes) pending.push({
								...current,
								path: [],
								aliases: undefined,
								escapes: true
							});
							continue;
						}
						if (known?.has(key)) continue;
						const selections = known ?? new Set();
						selections.add(key);
						expandedAliases.set(identity, selections);
						const aliases = {
							identity,
							pathLength: remaining.length,
							parent: current.aliases
						};
						const origins = semanticReadInitializers(binding, expression, state.parentsByNode);
						for (const initializer of [...origins.initializers, ...origins.referenceInitializers.filter((initializer) => !semanticReferenceSourcesInactive(initializer, state))]) pending.push({
							...current,
							node: initializer.node,
							path: [...initializer.projection, ...remaining],
							aliases
						});
						continue;
					}
				}
				if (t.isThisExpression(expression)) {
					let ownerNode = state.parentsByNode.get(expression);
					while (ownerNode !== undefined && !t.isClass(ownerNode) && !(t.isFunction(ownerNode) && !t.isArrowFunctionExpression(ownerNode))) ownerNode = state.parentsByNode.get(ownerNode);
					if (ownerNode !== getter) continue;
					if (current.privateRead !== undefined && t.isClass(owner)) {
						if (!t.isClass(receiver) || !privateReceiverProjection(receiver, owner, remaining, isStatic, state)) {
							retainPrivateRead();
							continue;
						}
						for (const member of owner.body.body) if (t.isClassPrivateProperty(member) && member.static === isStatic && member.key.id.name === current.privateRead.name && member.value != null) retain({
							node: member.value,
							path: current.escapes ? [] : current.privateRead.path
						});
						continue;
					}
					for (const reference of t.isClass(receiver) ? semanticClassPropertyReferences({
						owner: receiver,
						kind: isStatic ? "static" : "instance"
					}, remaining, state, active) : objectReceiverReference(receiver, remaining, state)) retain(reference);
					continue;
				}
				if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) {
					if (current.privateRead !== undefined && t.isPrivateName(expression.property)) {
						retainPrivateRead();
						continue;
					}
					if (t.isPrivateName(expression.property) && t.isClass(owner)) {
						pending.push({
							...current,
							node: expression.object,
							path: [],
							privateRead: {
								node: expression,
								name: expression.property.id.name,
								path: remaining
							}
						});
						continue;
					}
					const key = semanticStaticPropertyKey(expression.property, expression.computed);
					if (t.isSuper(expression.object) && t.isClass(owner) && owner.superClass != null) {
						for (const base of semanticClassCandidates(owner.superClass, state)) for (const reference of semanticClassPropertyReferences({
							owner: base,
							receiver: t.isClass(receiver) ? receiver : owner,
							kind: isStatic ? "static" : "prototype"
						}, [key, ...remaining], state, active)) retain(reference);
						continue;
					}
					pending.push({
						...current,
						node: expression.object,
						path: [key, ...remaining]
					});
				} else if (t.isConditionalExpression(expression)) pending.push({
					...current,
					node: expression.consequent
				}, {
					...current,
					node: expression.alternate
				});
				else if (t.isLogicalExpression(expression)) pending.push({
					...current,
					node: expression.left
				}, {
					...current,
					node: expression.right
				});
				else if (t.isSequenceExpression(expression)) {
					const last = expression.expressions.at(-1);
					if (last !== undefined) pending.push({
						...current,
						node: last
					});
				} else if (t.isAssignmentExpression(expression, { operator: "=" })) pending.push({
					...current,
					node: expression.right
				});
				else if (t.isAssignmentExpression(expression) && [
					"&&=",
					"||=",
					"??="
				].includes(expression.operator)) pending.push({
					...current,
					node: expression.left
				}, {
					...current,
					node: expression.right
				});
				else if (current.privateRead !== undefined) retainPrivateRead();
				else retain({
					node: expression,
					path: remaining
				});
			}
			return references;
		};
		semanticObjectPropertyReferences = (node, path, state) => {
			const [key, ...remaining] = path;
			const references = [];
			const overwritten = new Set();
			const dataOverwritten = new Set();
			const accessorNames = new Set();
			const getterNames = new Set();
			const setterNames = new Set();
			for (const property of [...node.properties].reverse()) {
				if (t.isSpreadElement(property)) {
					const selected = key ?? null;
					if (typeof selected !== "object" && overwritten.has(String(selected))) continue;
					references.push({
						node: property.argument,
						path: [typeof selected === "object" ? {
							...selected,
							excludedKeys: [...new Set([...selected?.excludedKeys ?? [], ...overwritten])].sort(compareUnicodeCodePoints)
						} : selected, ...remaining]
					});
					if (selected !== null && typeof selected !== "object" && t.isObjectExpression(property.argument) && objectExpressionDefinesKey(property.argument, String(selected))) {
						overwritten.add(String(selected));
						dataOverwritten.add(String(selected));
					}
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__") {
					const selected = key ?? null;
					if ((selected === null || typeof selected === "object") && t.isExpression(property.value)) {
						references.push({
							node: property.value,
							path: [selected, ...remaining]
						});
					} else if (typeof selected === "string" && !objectExpressionDefinesKey(node, selected) && t.isExpression(property.value)) {
						references.push({
							node: property.value,
							path: [selected, ...remaining]
						});
					}
					continue;
				}
				const isGetter = t.isObjectMethod(property) && property.kind === "get";
				const isSetter = t.isObjectMethod(property) && property.kind === "set";
				if (name !== null && (isGetter || isSetter ? dataOverwritten.has(name) || (isGetter ? getterNames.has(name) : setterNames.has(name)) : dataOverwritten.has(name) || accessorNames.has(name))) continue;
				if (name === null || semanticPropertyPathKeyMatches(key ?? null, name)) {
					if (t.isObjectMethod(property) && property.kind === "get") {
						references.push(...getterResultReferences({
							getter: property,
							owner: node
						}, remaining, state));
					} else if (t.isObjectMethod(property) && property.kind === "set") {} else {
						references.push({
							node: t.isObjectProperty(property) ? property.value : property,
							path: remaining
						});
					}
				}
				if (name !== null) {
					if (isGetter) {
						getterNames.add(name);
						accessorNames.add(name);
						overwritten.add(name);
					} else if (isSetter) {
						setterNames.add(name);
						accessorNames.add(name);
						overwritten.add(name);
					} else if (!(t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__")) {
						overwritten.add(name);
						dataOverwritten.add(name);
					}
				}
			}
			return references;
		};
		objectExpressionDefinesKey = (root, key) => {
			const pending = [root];
			const seen = new Set();
			for (let cursor = 0; cursor < pending.length; cursor++) {
				const object = pending[cursor];
				if (object === undefined || seen.has(object)) continue;
				seen.add(object);
				for (const property of object.properties) {
					if (t.isSpreadElement(property)) {
						if (t.isObjectExpression(property.argument)) pending.push(property.argument);
						continue;
					}
					const name = semanticStaticPropertyKey(property.key, property.computed);
					if (name === key && !(t.isObjectProperty(property) && !property.computed && !property.shorthand && name === "__proto__")) return true;
				}
			}
			return false;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticIterationSources.js
var add, project, visit, semanticIterationSources;
function init_javascriptSemanticIterationSources() {
	return (init_javascriptSemanticIterationSources = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		add = (sources, source, mutation, guards, kind = "iteration") => {
			sources.push({
				kind,
				node: source.node,
				projection: source.projection,
				mutation,
				...guards
			});
		};
		project = (source, key) => {
			if (source === undefined) return undefined;
			const index = key === null ? null : semanticArrayIndex(key);
			return {
				node: source.node,
				projection: [...source.projection, source.restStartIndex !== undefined && index !== null ? source.restStartIndex + index : key]
			};
		};
		visit = (context, pattern, source, guards = {}) => {
			const { sources, mutation } = context;
			if (t.isMemberExpression(pattern)) {
				if (source !== undefined) add(sources, source.restStartIndex === undefined ? source : {
					node: source.node,
					projection: [...source.projection, {
						excludedKeys: [],
						startIndex: source.restStartIndex
					}]
				}, mutation, guards, "reference-store");
				return;
			}
			if (t.isTSParameterProperty(pattern)) {
				visit(context, pattern.parameter, source, guards);
				return;
			}
			if (t.isAssignmentPattern(pattern)) {
				visit(context, pattern.left, source, {
					...guards,
					requiredSources: [...guards.requiredSources ?? [], ...source === undefined ? [] : [source]]
				});
				visit(context, pattern.left, {
					node: pattern.right,
					projection: []
				}, {
					...guards,
					fallbackSources: [...guards.fallbackSources ?? [], ...source === undefined ? [] : [source]]
				});
				return;
			}
			if (t.isObjectPattern(pattern)) {
				for (const property of pattern.properties) {
					if (t.isRestElement(property)) {
						visit(context, property.argument, source === undefined ? undefined : {
							node: source.node,
							projection: [...source.projection, { excludedKeys: [...new Set(semanticObjectPatternKeys(pattern))].sort(compareUnicodeCodePoints) }]
						}, guards);
						continue;
					}
					visit(context, property.value, project(source, semanticStaticPropertyKey(property.key, property.computed)), guards);
				}
				return;
			}
			if (t.isArrayPattern(pattern)) {
				if (source !== undefined && source.restStartIndex === undefined) add(sources, source, mutation, guards);
				pattern.elements.forEach((element, index) => {
					if (element === null) return;
					if (t.isRestElement(element)) visit(context, element.argument, source === undefined ? undefined : {
						node: source.node,
						projection: source.projection,
						restStartIndex: (source.restStartIndex ?? 0) + index
					}, guards);
					else visit(context, element, project(source, index), guards);
				});
				return;
			}
			if (t.isRestElement(pattern)) visit(context, pattern.argument, undefined, guards);
		};
		semanticIterationSources = (node, parent) => {
			const sources = [];
			const context = {
				sources,
				mutation: node
			};
			if (t.isVariableDeclarator(node) && node.init != null) visit(context, node.id, {
				node: node.init,
				projection: []
			});
			else if (t.isAssignmentExpression(node) && [
				"=",
				"||=",
				"&&=",
				"??="
			].includes(node.operator)) visit(context, node.left, {
				node: node.right,
				projection: []
			});
			else if (t.isForOfStatement(node)) {
				add(sources, {
					node: node.right,
					projection: []
				}, node, {});
				const source = {
					node: node.right,
					projection: [null]
				};
				if (t.isVariableDeclaration(node.left)) {
					for (const declaration of node.left.declarations) visit(context, declaration.id, source);
				} else visit(context, node.left, source);
			} else if (t.isSpreadElement(node) && t.isArrayExpression(parent)) add(sources, {
				node: node.argument,
				projection: []
			}, node, {});
			else if (t.isYieldExpression(node) && node.delegate && node.argument != null) add(sources, {
				node: node.argument,
				projection: []
			}, node, {});
			else if (t.isFunction(node)) for (const parameter of runtimeFunctionParameters(node)) visit(context, parameter, undefined);
			return sources;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallResolution.js
var resolveLocalCallables, resolveCallables, resolveIdentifier, resolveAlternatives, resolveBindingCallables, missingBindingInitializer, parameterBindings, parameterAcceptsArgument, rangeContains, uniqueCallableIds;
function init_javascriptSemanticCallResolution() {
	return (init_javascriptSemanticCallResolution = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptStaticAnalysisHelpers();
		resolveLocalCallables = (input) => resolveCallables(input.node, {
			state: input.state,
			callableById: input.callableById,
			seenBindings: input.seenBindings,
			bindingCache: input.bindingCache
		});
		resolveCallables = (node, context) => {
			const unwrapped = unwrapJavaScriptExpression(node).node;
			if (unwrapped !== node) return resolveCallables(unwrapped, context);
			const direct = semanticCallableIdForNode(node);
			if (direct !== null && context.callableById.has(direct)) return {
				callableIds: [direct],
				complete: true,
				reason: "Direct local callable."
			};
			if (t.isIdentifier(node)) return resolveIdentifier(node, context);
			if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) return resolveAlternatives(t.isConditionalExpression(node) ? node.consequent : node.left, t.isConditionalExpression(node) ? node.alternate : node.right, context);
			return {
				callableIds: [],
				complete: false,
				reason: `Unsupported ${node.type} call target.`
			};
		};
		resolveIdentifier = (node, context) => {
			const binding = resolveSemanticBindingState(context.state, node, node.name);
			return binding === undefined ? {
				callableIds: [],
				complete: false,
				reason: `Unresolved call target ${node.name}.`
			} : resolveBindingCallables(binding, context);
		};
		resolveAlternatives = (left, right, context) => {
			const candidates = [left, right].map((candidate) => resolveCallables(candidate, context));
			return {
				callableIds: uniqueCallableIds(candidates.flatMap(({ callableIds }) => callableIds)),
				complete: candidates.every(({ complete }) => complete),
				reason: "Conditional or logical call target has multiple candidates."
			};
		};
		resolveBindingCallables = (binding, context) => {
			const cached = context.bindingCache.get(binding.bindingId);
			if (cached !== undefined) return cached;
			if (context.seenBindings.has(binding.bindingId)) return {
				callableIds: [],
				complete: false,
				reason: `Call target alias cycle at ${binding.name}.`
			};
			if (binding.initializers.length === 0) return missingBindingInitializer(binding);
			const candidateContext = {
				...context,
				seenBindings: new Set([...context.seenBindings, binding.bindingId])
			};
			const candidates = binding.initializers.map(({ node, projection }) => projection.length === 0 ? resolveCallables(node, candidateContext) : {
				callableIds: [],
				complete: false,
				reason: `Projected call target ${binding.name} is unresolved.`
			});
			const callableIds = uniqueCallableIds(candidates.flatMap((candidate) => candidate.callableIds));
			const resolution = {
				callableIds,
				complete: candidates.every(({ complete }) => complete),
				reason: callableIds.length === 1 && candidates.every(({ complete }) => complete) ? "Unique local callable target." : `Call target ${binding.name} has ambiguous or unsupported assignments.`
			};
			if (resolution.complete) context.bindingCache.set(binding.bindingId, resolution);
			return resolution;
		};
		missingBindingInitializer = (binding) => ({
			callableIds: [],
			complete: false,
			reason: binding.kind === "import" ? `Call target ${binding.name} is imported from outside this source.` : `Call target ${binding.name} has no local initializer.`
		});
		parameterBindings = (callable, index, state) => {
			if (callable.bodyScopeId === null) return [];
			const scope = state.scopesById.get(callable.bodyScopeId);
			if (scope === undefined) return [];
			return [...scope.bindings.values()].filter((binding) => binding.kind === "parameter" && binding.definitions.some(({ kind, location }) => kind === "parameter" && parameterAcceptsArgument(callable, location, index, state))).sort((left, right) => compareUnicodeCodePoints(left.bindingId, right.bindingId));
		};
		parameterAcceptsArgument = (callable, location, argumentIndex, state) => {
			const node = state.callableNodesById.get(callable.callableId);
			if (!t.isFunction(node)) return false;
			const parameters = runtimeFunctionParameters(node);
			const parameterIndex = parameters.findIndex((parameter) => rangeContains(range(parameter), location));
			if (parameterIndex === argumentIndex) return true;
			return parameterIndex >= 0 && parameterIndex < argumentIndex && t.isRestElement(parameters[parameterIndex]);
		};
		rangeContains = (outer, inner) => (outer.start.line < inner.start.line || outer.start.line === inner.start.line && outer.start.column <= inner.start.column) && (outer.end.line > inner.end.line || outer.end.line === inner.end.line && outer.end.column >= inner.end.column);
		uniqueCallableIds = (values) => [...new Set(values)].sort(compareUnicodeCodePoints);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReturnedReferences.js
var createSemanticReturnedReferences, selectObjectTargets, objectTargetIndex;
function init_javascriptSemanticReturnedReferences() {
	return (init_javascriptSemanticReturnedReferences = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptSemanticCallResolution();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticState();
		createSemanticReturnedReferences = (state) => {
			const callableById = new Map(state.callables.map((callable) => [callable.callableId, callable]));
			const bindingCache = new Map();
			const results = new WeakMap();
			const objectTargets = new WeakMap();
			return (callee) => {
				const existing = results.get(callee);
				if (existing !== undefined) return existing;
				const functions = new Set();
				const resolution = resolveLocalCallables({
					node: callee,
					state,
					callableById,
					bindingCache,
					seenBindings: new Set()
				});
				for (const id of resolution.callableIds) {
					const node = state.callableNodesById.get(id);
					if (node !== undefined) functions.add(node);
				}
				const pending = [{
					node: callee,
					path: [],
					bindings: new Set()
				}];
				const expanded = new WeakMap();
				for (let cursor = 0; cursor < pending.length; cursor++) {
					const item = pending[cursor];
					if (item === undefined) break;
					const node = unwrapJavaScriptExpression(item.node).node;
					const pathKey = JSON.stringify(item.path);
					const paths = expanded.get(node) ?? new Map();
					const contexts = paths.get(pathKey) ?? [];
					if (contexts.some((context) => [...context].every((binding) => item.bindings.has(binding)))) continue;
					paths.set(pathKey, [...contexts.filter((context) => ![...item.bindings].every((binding) => context.has(binding))), item.bindings]);
					expanded.set(node, paths);
					if (t.isIdentifier(node)) {
						const binding = resolveSemanticBindingState(state, node, node.name);
						if (binding === undefined || item.bindings.has(binding.bindingId)) continue;
						const bindings = new Set([...item.bindings, binding.bindingId]);
						for (const initializer of [...binding.initializers, ...binding.referenceInitializers]) pending.push({
							node: initializer.node,
							path: [...initializer.projection, ...item.path],
							bindings
						});
					} else if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
						const path = [];
						let receiver = node;
						while (t.isMemberExpression(receiver) || t.isOptionalMemberExpression(receiver)) {
							path.push(semanticStaticPropertyKey(receiver.property, receiver.computed));
							receiver = unwrapJavaScriptExpression(receiver.object).node;
						}
						pending.push({
							...item,
							node: receiver,
							path: [...path.reverse(), ...item.path]
						});
					} else if (t.isConditionalExpression(node) || t.isLogicalExpression(node)) {
						pending.push({
							...item,
							node: t.isConditionalExpression(node) ? node.consequent : node.left
						}, {
							...item,
							node: t.isConditionalExpression(node) ? node.alternate : node.right
						});
					} else if (t.isSequenceExpression(node)) {
						const last = node.expressions.at(-1);
						if (last !== undefined) pending.push({
							...item,
							node: last
						});
					} else if (t.isFunction(node) && item.path.length === 0) functions.add(node);
					else if (t.isObjectExpression(node)) selectObjectTargets(node, item, pending, objectTargets);
					else if (t.isArrayExpression(node)) {
						const [key, ...path] = item.path;
						const index = key === undefined || key === null ? null : semanticArrayIndex(key);
						let uncertainOffset = false;
						node.elements.forEach((element, offset) => {
							if (element === null) return;
							if (t.isSpreadElement(element)) {
								uncertainOffset = true;
								pending.push({
									...item,
									node: element.argument,
									path: [null, ...path]
								});
							} else if (index === null || uncertainOffset || index === offset) pending.push({
								...item,
								node: element,
								path
							});
						});
					} else if (t.isNewExpression(node)) pending.push({
						...item,
						node: node.callee
					});
					else if (t.isClass(node)) {
						const [key, ...path] = item.path;
						for (const member of node.body.body) {
							if (t.isClassMethod(member)) {
								if (item.path.length === 0 && member.kind === "constructor" || key !== undefined && (key === null || semanticStaticPropertyKey(member.key, member.computed) === String(key))) pending.push({
									...item,
									node: member,
									path
								});
							} else if (t.isClassProperty(member) && member.value !== null && member.value !== undefined && key !== undefined && (key === null || semanticStaticPropertyKey(member.key, member.computed) === String(key))) pending.push({
								...item,
								node: member.value,
								path
							});
						}
						if (node.superClass !== null && node.superClass !== undefined) pending.push({
							...item,
							node: node.superClass
						});
					}
				}
				const output = [...functions].flatMap((node) => {
					const callables = t.isClass(node) ? node.body.body.filter((member) => t.isClassMethod(member) && member.kind === "constructor") : [node];
					return callables.flatMap((callable) => semanticCallableResultExpressions(callable).flatMap(({ node, delegated }) => node === null ? [] : [{
						node,
						projection: delegated ? [null] : []
					}]));
				});
				results.set(callee, output);
				return output;
			};
		};
		selectObjectTargets = (node, item, pending, indexes) => {
			const [key, ...path] = item.path;
			if (key !== null && key !== undefined) {
				const index = objectTargetIndex(node, indexes);
				const property = index.propertyByName.get(String(key));
				if (property !== undefined) {
					const unknowns = [];
					for (let unknown = index.trailingUnknownsByProperty.get(property); unknown !== undefined; unknown = unknown.previous) unknowns.push(unknown);
					for (const { node: unknown } of unknowns.reverse()) pending.push({
						...item,
						node: t.isSpreadElement(unknown) ? unknown.argument : t.isObjectProperty(unknown) ? unknown.value : unknown,
						...t.isSpreadElement(unknown) ? {} : { path }
					});
					pending.push({
						...item,
						node: t.isObjectProperty(property) ? property.value : property,
						path
					});
					return;
				}
			}
			let replaced = false;
			for (const property of [...node.properties].reverse()) {
				if (replaced) break;
				if (t.isSpreadElement(property)) {
					pending.push({
						...item,
						node: property.argument
					});
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (key !== null && key !== undefined && name !== null && name !== String(key)) continue;
				if (t.isObjectProperty(property)) pending.push({
					...item,
					node: property.value,
					path
				});
				else pending.push({
					...item,
					node: property,
					path
				});
				if (key !== null && key !== undefined && name === String(key)) replaced = true;
			}
		};
		objectTargetIndex = (node, indexes) => {
			const existing = indexes.get(node);
			if (existing !== undefined) return existing;
			const propertyByName = new Map();
			const trailingUnknownsByProperty = new Map();
			let trailingUnknown;
			for (const property of [...node.properties].reverse()) {
				if (t.isSpreadElement(property)) {
					trailingUnknown = {
						node: property,
						previous: trailingUnknown
					};
					continue;
				}
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) {
					trailingUnknown = {
						node: property,
						previous: trailingUnknown
					};
					continue;
				}
				if (propertyByName.has(name)) continue;
				propertyByName.set(name, property);
				if (trailingUnknown !== undefined) trailingUnknownsByProperty.set(property, trailingUnknown);
			}
			const created = {
				propertyByName,
				trailingUnknownsByProperty
			};
			indexes.set(node, created);
			return created;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticMemberMutations.js
/** Preserve uncertainty from property writes and references exposed to calls, yielding during traversal and fixpoint iteration. */
function* collectSemanticMemberMutationsSteps(program, state) {
	const parents = state.parentsByNode;
	const observablePaths = observableMutationPaths(state);
	const returnedReferences = createSemanticReturnedReferences(state);
	const recordedRequiredEffects = new Set();
	let recordedEffectCount = 0;
	const recordRequiredEffect = (specifier, path, effect, node) => {
		const identity = semanticRequireExportsIdentity(specifier, path);
		if (effect === "escape" && identity.specifier === "process" && identity.path.length === 2 && (identity.path[0] === "env" || identity.path[0] === "argv")) return;
		const key = JSON.stringify([
			"required",
			identity.specifier,
			effect,
			identity.path,
			node?.start,
			node?.end
		]);
		if (recordedRequiredEffects.has(key)) return;
		recordedRequiredEffects.add(key);
		recordedEffectCount += 1;
		const effects = state.requiredModuleEffects.get(identity.specifier) ?? [];
		effects.push({
			path: identity.path,
			node,
			kind: effect
		});
		state.requiredModuleEffects.set(identity.specifier, effects);
	};
	for (const { path, node } of state.ambientWriteEffects) if (path[0] === "global" && path[1] === "process" && path.length > 2 && node !== undefined && semanticOriginalGlobalProcessAt(node, state)) recordRequiredEffect("node:process", path.slice(2), "write", node);
	const selections = new Map();
	const coveringPaths = new Map();
	let arrayIterationUnknown = false;
	const resolvedBindings = new WeakMap();
	const resolveBinding = (node, name) => {
		const cached = resolvedBindings.get(node);
		if (cached !== undefined) return cached ?? undefined;
		const resolved = resolveSemanticBindingState(state, node, name);
		resolvedBindings.set(node, resolved ?? null);
		return resolved;
	};
	const captureKeys = new WeakMap();
	const captureKeyOf = (binding, originAt, ownerInitializer) => {
		let byPosition = captureKeys.get(binding);
		if (byPosition === undefined) {
			byPosition = new Map();
			captureKeys.set(binding, byPosition);
		}
		const positionKey = `${originAt?.start ?? "u"}:${originAt?.end ?? "u"}:${ownerInitializer?.start ?? "u"}:${ownerInitializer?.end ?? "u"}`;
		const cached = byPosition.get(positionKey);
		if (cached !== undefined) return cached;
		const created = JSON.stringify([
			binding.bindingId,
			originAt?.start,
			originAt?.end,
			ownerInitializer?.start,
			ownerInitializer?.end
		]);
		byPosition.set(positionKey, created);
		return created;
	};
	const lifetimeKey = (captureKey, path) => `${captureKey.slice(0, -1)},${JSON.stringify(path)}]`;
	const pendingReferences = [];
	const iterableReferences = [];
	const iterableReferenceKeys = new WeakMap();
	const deferIterable = (reference) => {
		const keys = iterableReferenceKeys.get(reference.node) ?? new Set();
		const key = JSON.stringify([
			reference.projection,
			reference.path,
			reference.fallbackPath,
			reference.effect,
			reference.mutation?.start,
			reference.mutation?.end,
			reference.originAt?.start,
			reference.originAt?.end,
			reference.iterationOnly,
			reference.requiredSources?.map((source) => [
				source.node.start,
				source.node.end,
				source.projection
			]),
			reference.fallbackSources?.map((source) => [
				source.node.start,
				source.node.end,
				source.projection
			]),
			[...reference.bindings].sort(compareUnicodeCodePoints)
		]);
		if (keys.has(key)) return;
		keys.add(key);
		iterableReferenceKeys.set(reference.node, keys);
		iterableReferences.push(reference);
	};
	const markValue = (node, path, bindings, effect = "write", mutation, originAt = mutation, ownerInitializer) => {
		const pending = [{
			node,
			path,
			bindings,
			originAt,
			...ownerInitializer === undefined ? {} : { ownerInitializer }
		}];
		for (let cursor = 0; cursor < pending.length; cursor++) {
			const current = pending[cursor];
			if (current === undefined) break;
			const expression = unwrapJavaScriptExpression(current.node).node;
			const required = semanticRequireOrigin(expression, state);
			if (required !== undefined) {
				recordRequiredEffect(required.origin.specifier, [...required.origin.importedPath, ...current.path], effect, mutation);
				continue;
			}
			const globalProcess = semanticGlobalProcessPathOrigin(expression, state);
			if (globalProcess !== undefined) {
				recordRequiredEffect(globalProcess.specifier, [...globalProcess.importedPath, ...current.path], effect, mutation);
				continue;
			}
			if (t.isIdentifier(expression)) {
				const binding = resolveBinding(expression, expression.name);
				if (binding === undefined) {
					const processOrigin = semanticGlobalProcessOrigin(expression, state);
					if (processOrigin !== undefined) recordRequiredEffect(processOrigin.specifier, current.path, effect, mutation);
					if (expression.name === "Array" && (current.path[0] === "prototype" || current.path[0] === null) || [
						"globalThis",
						"global",
						"window",
						"self"
					].includes(expression.name) && (current.path[0] === "Array" || current.path[0] === null) && (current.path[1] === "prototype" || current.path[1] === null)) arrayIterationUnknown = true;
					continue;
				}
				const captureKey = captureKeyOf(binding, current.originAt, current.ownerInitializer);
				const lifetime = lifetimeKey(captureKey, current.path);
				if (current.bindings.has(lifetime)) continue;
				const revisited = current.bindings.has(captureKey);
				let repeatedPrefix;
				for (let start = 1; revisited && start <= current.path.length; start++) {
					const suffix = current.path.slice(start);
					if (!current.bindings.has(lifetimeKey(captureKey, suffix))) continue;
					repeatedPrefix = current.path.slice(0, start);
					break;
				}
				if (repeatedPrefix !== undefined && observablePaths.repeatsUnpruned(binding.bindingId, repeatedPrefix)) {
					markValue(current.node, repeatedPrefix, new Set(), "escape", mutation, current.originAt, current.ownerInitializer);
					continue;
				}
				let path = observablePaths.normalize(binding.bindingId, current.path, effect);
				if (path === null) continue;
				const selectorIndex = path.findIndex((key) => key !== null && typeof key === "object");
				const selector = path[selectorIndex];
				if (selector !== null && typeof selector === "object") {
					const selectionIdentity = JSON.stringify([
						binding.bindingId,
						effect,
						path.map((key, index) => index === selectorIndex ? { startIndex: selector.startIndex } : key),
						mutation?.start,
						mutation?.end,
						current.originAt?.start,
						current.originAt?.end,
						current.ownerInitializer?.start,
						current.ownerInitializer?.end
					]);
					const previous = selections.get(selectionIdentity);
					const excludedKeys = previous === undefined ? selector.excludedKeys : previous.filter((key) => selector.excludedKeys.includes(key));
					if (previous !== undefined && excludedKeys.length === previous.length) continue;
					selections.set(selectionIdentity, excludedKeys);
					path = path.map((key, index) => index === selectorIndex ? {
						...selector,
						excludedKeys
					} : key);
				}
				const origins = current.ownerInitializer !== undefined ? {
					initializers: binding.initializers.filter(({ node }) => node === current.ownerInitializer),
					referenceInitializers: [],
					directOrigins: []
				} : current.originAt === undefined ? binding : semanticMutationInitializers(binding, current.originAt, parents);
				const pathState = `${JSON.stringify(binding.bindingId)}\u0001${effect}\u0001${effect === "write" ? path.length : -1}\u0001${mutation?.start ?? -1}\u0001${mutation?.end ?? -1}\u0001${current.originAt?.start ?? -1}\u0001${current.originAt?.end ?? -1}\u0001${current.ownerInitializer?.start ?? -1}\u0001${current.ownerInitializer?.end ?? -1}`;
				let covering = coveringPaths.get(pathState);
				if (covering === undefined) {
					covering = new SemanticPropertyPathCoverage();
					coveringPaths.set(pathState, covering);
				}
				if (!covering.retain(path)) continue;
				const value = effect === "write" && binding.memberWrites.length === 0 ? evaluateSemanticBinding(binding, state) : undefined;
				const primitiveWrite = value?.status === "literal" || value?.status === "union";
				recordedEffectCount += 1;
				const nested = new Set(current.bindings);
				nested.add(lifetime);
				nested.add(captureKey);
				if (!primitiveWrite) {
					for (const origin of origins.directOrigins) {
						const shared = semanticMutableBuiltinOrigin(origin, path);
						if (shared !== undefined) recordRequiredEffect(shared.specifier, shared.path, effect, mutation);
					}
					if (effect === "escape") binding.escapedPaths.push({
						path,
						node: mutation
					});
					else binding.memberWrites.push({
						path,
						node: mutation
					});
					clearSemanticValueCaches(state);
					for (const initializer of origins.initializers) pending.push({
						node: initializer.node,
						path: [...initializer.projection, ...path],
						bindings: nested,
						originAt: initializer.node
					});
				}
				for (const initializer of origins.referenceInitializers) {
					const copiedPath = copiedReferencePath(initializer, path, effect);
					if (copiedPath === null) continue;
					pendingReferences.push({
						initializer,
						path: copiedPath,
						bindings: nested,
						effect,
						originAt: initializer.node,
						...mutation === undefined ? {} : { mutation }
					});
				}
			} else if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) {
				pending.push({
					node: expression.object,
					path: [semanticStaticPropertyKey(expression.property, expression.computed), ...current.path],
					bindings: current.bindings,
					originAt: current.originAt
				});
			} else {
				for (const value of effect === "escape" ? escapedReferenceLeaves(expression, current.path) : expandedValues(expression, current.path, effect)) {
					if (value.escapes && effect !== "escape") markValue(value.node, value.path, new Set(), "escape", mutation, current.originAt, value.ownerInitializer);
					else if (value.iterableFallbackPath !== undefined) deferIterable({
						node: value.node,
						projection: [],
						path: value.path,
						fallbackPath: value.iterableFallbackPath,
						bindings: current.bindings,
						effect,
						originAt: current.originAt,
						...mutation === undefined ? {} : { mutation }
					});
					else pending.push({
						...value,
						bindings: current.bindings,
						originAt: current.originAt
					});
				}
			}
		}
	};
	const markEscaped = (node, mutation, path = []) => markValue(node, path, new Set(), "escape", mutation);
	function expandedValues(expression, path, effect) {
		if (t.isArrayExpression(expression) && (path[0] === "__proto__" && (effect === "escape" || path.length > 1) || path[0] === "constructor" && path[1] === "prototype")) arrayIterationUnknown = true;
		return referencedValues(expression, path, effect, state);
	}
	const escapedLeaves = new WeakMap();
	function escapedReferenceLeaves(root, rootPath) {
		if (!t.isNode(root)) return [];
		const rootKey = JSON.stringify(rootPath);
		const cached = escapedLeaves.get(root)?.get(rootKey);
		if (cached !== undefined) return cached;
		const leaves = [];
		const leafIdentities = new Set();
		const expanded = new WeakMap();
		const pending = [...expandedValues(root, rootPath, "escape")];
		for (let cursor = 0; cursor < pending.length; cursor++) {
			const value = pending[cursor];
			if (value === undefined) break;
			const node = unwrapJavaScriptExpression(value.node).node;
			if (!t.isNode(node)) continue;
			const pathKey = JSON.stringify(value.path);
			if (t.isIdentifier(node) && value.iterableFallbackPath === undefined) {
				const binding = resolveBinding(node, node.name);
				const identity = JSON.stringify([
					binding === undefined ? null : binding.bindingId,
					binding === undefined ? node.name : null,
					pathKey,
					value.ownerInitializer?.start,
					value.ownerInitializer?.end
				]);
				if (leafIdentities.has(identity)) continue;
				leafIdentities.add(identity);
				leaves.push(value);
			} else if (value.iterableFallbackPath !== undefined || t.isIdentifier(node) || t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) leaves.push(value);
			else {
				const paths = expanded.get(node) ?? new Set();
				if (paths.has(pathKey)) continue;
				paths.add(pathKey);
				expanded.set(node, paths);
				for (const reference of expandedValues(node, value.path, "escape")) pending.push(reference);
			}
		}
		const byPath = escapedLeaves.get(root) ?? new Map();
		byPath.set(rootKey, leaves);
		escapedLeaves.set(root, byPath);
		return leaves;
	}
	const markReceiver = (callee, mutation) => {
		const expression = unwrapJavaScriptExpression(callee).node;
		if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) markEscaped(expression.object, mutation);
	};
	const markTarget = (node, mutation) => {
		for (const target of semanticWriteTargets(node)) if (!t.isIdentifier(target)) markValue(target.object, [semanticStaticPropertyKey(target.property, target.computed)], new Set(), "write", mutation);
	};
	yield* traverseJavaScriptAstSteps(program, { enter: (node, parent) => {
		for (const source of semanticIterationSources(node, parent)) deferIterable({
			...source,
			path: source.projection,
			fallbackPath: source.projection,
			bindings: new Set(),
			effect: "escape",
			originAt: source.mutation,
			iterationOnly: source.kind === "iteration"
		});
		const writeTarget = semanticWriteSiteTarget(node);
		if (writeTarget !== null) markTarget(writeTarget, node);
		else if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) {
			for (const source of returnedReferences(node.callee)) markEscaped(source.node, node, source.projection);
			for (const argument of node.arguments) if (t.isSpreadElement(argument)) deferIterable({
				node: argument.argument,
				projection: [],
				path: [null],
				fallbackPath: [],
				bindings: new Set(),
				effect: "escape",
				mutation: node,
				originAt: node
			});
			else markEscaped(argument, node);
			if (!t.isNewExpression(node)) markReceiver(node.callee, node);
		} else if (t.isTaggedTemplateExpression(node)) {
			markReceiver(node.tag, node);
			for (const expression of node.quasi.expressions) markEscaped(expression, node);
		}
	} });
	while (pendingReferences.length > 0 || iterableReferences.length > 0) {
		const effectsBefore = recordedEffectCount;
		const iterablesBefore = iterableReferences.length;
		const iterationBefore = arrayIterationUnknown;
		for (const [index, reference] of pendingReferences.splice(0).entries()) {
			if (index % 64 === 0) yield;
			const { initializer } = reference;
			if (semanticReferenceSourcesInactive(initializer, state)) pendingReferences.push(reference);
			else if (t.isForOfStatement(initializer.node)) deferIterable({
				node: initializer.node.right,
				projection: [],
				path: [null, ...reference.path],
				fallbackPath: [],
				bindings: reference.bindings,
				effect: reference.effect,
				originAt: initializer.node,
				...reference.mutation === undefined ? {} : { mutation: reference.mutation }
			});
			else if (initializer.copyKind === "array-rest" && initializer.copyProjectionOffset !== undefined) {
				const offset = initializer.copyProjectionOffset;
				const projection = initializer.projection.slice(0, offset);
				deferIterable({
					node: initializer.node,
					projection,
					path: reference.path,
					fallbackPath: projection,
					bindings: reference.bindings,
					effect: reference.effect,
					originAt: reference.originAt,
					...reference.mutation === undefined ? {} : { mutation: reference.mutation }
				});
			} else markValue(initializer.node, reference.path, reference.bindings, reference.effect, reference.mutation, reference.originAt);
		}
		for (const [index, reference] of [...iterableReferences].entries()) {
			if (index % 64 === 0) yield;
			if (semanticReferenceSourcesInactive(reference, state)) continue;
			if (reference.iterationOnly) {
				const expanded = expandedIterationReferences(reference, state);
				if (expanded !== null) {
					for (const selected of expanded) deferIterable(selected);
					continue;
				}
			}
			const slot = semanticSelectedReferenceSlot(reference, state);
			const knownArray = !arrayIterationUnknown && slot?.value.status === "array" && slot.value.items.every((item) => semanticArrayIndex(item.name) !== null);
			if (knownArray && reference.iterationOnly) continue;
			markValue(reference.node, knownArray ? reference.path : reference.fallbackPath, reference.bindings, knownArray ? reference.effect : "escape", reference.mutation, reference.originAt);
		}
		if (recordedEffectCount === effectsBefore && iterableReferences.length === iterablesBefore && arrayIterationUnknown === iterationBefore) break;
	}
	clearSemanticValueCaches(state);
}
var expandedIterationReferences, referencedValues, observableMutationPaths, arrayReferencedValues, copiedReferencePath;
function init_javascriptSemanticMemberMutations() {
	return (init_javascriptSemanticMemberMutations = __esmMin((() => {
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticState();
		init_javascriptSemanticValues();
		init_javascriptSemanticSlots();
		init_javascriptSemanticObjectReferences();
		init_javascriptSemanticIterationSources();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticReturnedReferences();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticReferenceSources();
		init_javascriptSemanticPropertyPaths();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptAstValues();
		expandedIterationReferences = (reference, state) => {
			if (!t.isForOfStatement(reference.mutation)) return null;
			const iterable = reference.mutation.right;
			const source = [
				reference,
				...reference.requiredSources ?? [],
				...reference.fallbackSources ?? []
			].find((source) => source.node === iterable && source.projection[0] === null);
			if (source === undefined) return null;
			const slot = semanticSelectedReferenceSlot({
				node: iterable,
				projection: []
			}, state);
			const container = slot === undefined ? null : semanticContainer(slot.value);
			if (container?.coverage.status !== "complete") return null;
			const select = (candidate, name) => ({
				...candidate,
				projection: candidate.node === iterable && candidate.projection[0] === null ? [name, ...candidate.projection.slice(1)] : candidate.projection
			});
			return container.slots.map((slot) => {
				const { projection } = select(reference, slot.name);
				return {
					...reference,
					projection,
					path: projection,
					fallbackPath: projection,
					...reference.requiredSources === undefined ? {} : { requiredSources: reference.requiredSources.map((source) => select(source, slot.name)) },
					...reference.fallbackSources === undefined ? {} : { fallbackSources: reference.fallbackSources.map((source) => select(source, slot.name)) }
				};
			});
		};
		referencedValues = (node, path, effect, state) => {
			if (effect === "escape" && t.isFunction(node)) return semanticCallableResultExpressions(node).flatMap(({ node, delegated }) => node === null ? [] : [{
				node,
				path: delegated ? [null] : []
			}]);
			if (t.isObjectExpression(node) || t.isArrayExpression(node)) {
				if (effect === "write" && path.length < 2) return [];
				return t.isObjectExpression(node) ? semanticObjectPropertyReferences(node, path, state) : arrayReferencedValues(node, path);
			}
			if (t.isClass(node)) {
				const [key, ...remaining] = path;
				if (key === undefined) return [];
				if (effect === "write" && remaining.length === 0) return [];
				return semanticClassPropertyReferences({
					owner: node,
					kind: "static"
				}, [key, ...remaining], state);
			}
			if (t.isNewExpression(node)) {
				const [key, ...remaining] = path;
				if (key === undefined) return [];
				if (effect === "write" && remaining.length === 0) return [];
				return semanticClassCandidates(node.callee, state).flatMap((klass) => semanticClassPropertyReferences({
					owner: klass,
					kind: "instance"
				}, [key, ...remaining], state));
			}
			if (t.isAssignmentExpression(node)) return node.operator === "||=" || node.operator === "??=" ? [{
				node: node.left,
				path
			}, {
				node: node.right,
				path
			}] : [{
				node: node.right,
				path
			}];
			if (t.isAwaitExpression(node)) return [{
				node: node.argument,
				path
			}];
			if (t.isSequenceExpression(node)) {
				const last = node.expressions.at(-1);
				return last === undefined ? [] : [{
					node: last,
					path
				}];
			}
			if (t.isConditionalExpression(node)) return [{
				node: node.consequent,
				path
			}, {
				node: node.alternate,
				path
			}];
			if (t.isLogicalExpression(node)) return [{
				node: node.left,
				path
			}, {
				node: node.right,
				path
			}];
			return [];
		};
		observableMutationPaths = (state) => {
			const bindingNodes = new Map();
			const expressions = new WeakMap();
			const pendingExpressions = [];
			const pending = [];
			const queued = new Set();
			const schedule = (node) => {
				if (queued.has(node)) return;
				queued.add(node);
				pending.push(node);
			};
			const create = (read) => read === undefined ? {} : { read };
			const link = (source, target) => {
				if (target.sources?.has(source) === true) return;
				(target.sources ??= new Set()).add(source);
				(source.dependents ??= new Set()).add(target);
				schedule(target);
			};
			const expressionNode = (node) => {
				const expression = unwrapJavaScriptExpression(node).node;
				const existing = expressions.get(expression);
				if (existing !== undefined) return existing;
				const observer = create();
				expressions.set(expression, observer);
				pendingExpressions.push({
					expression,
					observer
				});
				return observer;
			};
			const project = (source, path) => {
				let observer = source;
				for (const key of path) {
					const identity = JSON.stringify(key === null || typeof key === "object" ? key : String(key));
					let selected = observer.projections?.get(identity);
					if (selected === undefined) {
						selected = create({
							source: observer,
							key
						});
						(observer.projections ??= new Map()).set(identity, selected);
						(observer.dependents ??= new Set()).add(selected);
						schedule(selected);
					}
					observer = selected;
				}
				return observer;
			};
			for (const binding of state.bindingsById.values()) bindingNodes.set(binding.bindingId, create());
			for (const binding of state.bindingsById.values()) {
				const observer = bindingNodes.get(binding.bindingId);
				if (observer === undefined) continue;
				const hasParsedRequireOrigin = binding.initializers.some(({ node }) => semanticRequireOrigin(node, state) !== undefined);
				if (binding.directOrigins.length > 0 || hasParsedRequireOrigin) (observer.origins ??= new Set()).add("opaque");
				for (const initializer of binding.initializers) {
					link(project(expressionNode(initializer.node), initializer.projection), observer);
				}
				if (binding.referenceInitializers.length > 0) (observer.origins ??= new Set()).add("opaque");
				for (const initializer of binding.referenceInitializers) {
					for (const source of [
						initializer,
						...initializer.requiredSources ?? [],
						...initializer.fallbackSources ?? []
					]) link(expressionNode(source.node), observer);
				}
			}
			const settle = () => {
				while (pendingExpressions.length > 0 || pending.length > 0) {
					while (pendingExpressions.length > 0) {
						const selected = pendingExpressions.pop();
						if (selected === undefined) break;
						const { expression, observer } = selected;
						if (t.isObjectExpression(expression) || t.isArrayExpression(expression) || t.isClass(expression) || t.isNewExpression(expression)) (observer.origins ??= new Set()).add(expression);
						else if (t.isIdentifier(expression)) {
							const binding = resolveSemanticBindingState(state, expression, expression.name);
							if (binding !== undefined) {
								const origin = bindingNodes.get(binding.bindingId);
								if (origin !== undefined) link(origin, observer);
							} else if (expression.name === "Array") (observer.origins ??= new Set()).add("array");
							else if ([
								"globalThis",
								"global",
								"window",
								"self"
							].includes(expression.name)) (observer.origins ??= new Set()).add("ambient");
						} else if (t.isMemberExpression(expression) || t.isOptionalMemberExpression(expression)) link(project(expressionNode(expression.object), [semanticStaticPropertyKey(expression.property, expression.computed)]), observer);
						else for (const reference of referencedValues(expression, [], "escape", state)) link(project(expressionNode(reference.node), reference.path), observer);
						schedule(observer);
					}
					const observer = pending.pop();
					if (observer === undefined) continue;
					queued.delete(observer);
					let changed = false;
					const add = (origin) => {
						if (observer.origins?.has(origin) === true) return;
						(observer.origins ??= new Set()).add(origin);
						changed = true;
					};
					for (const source of observer.sources ?? []) for (const origin of source.origins ?? []) add(origin);
					if (observer.read !== undefined) {
						const { source, key } = observer.read;
						if (key === null || typeof key === "object") {
							if ((source.origins?.size ?? 0) > 0) add("opaque");
						} else for (const origin of source.origins ?? []) {
							if (typeof origin === "string") {
								if (origin === "array-prototype" || origin === "opaque") add(origin);
								else if (origin === "ambient" && semanticPropertyPathKeyMatches(key, "Array")) add("array");
								else if (origin === "array" && semanticPropertyPathKeyMatches(key, "prototype")) add("array-prototype");
							} else {
								for (const reference of referencedValues(origin, [key], "escape", state)) {
									link(project(expressionNode(reference.node), reference.path), observer);
									if (reference.iterableFallbackPath !== undefined) link(project(expressionNode(reference.node), reference.iterableFallbackPath), observer);
								}
							}
						}
					}
					if (changed) for (const dependent of observer.dependents ?? []) schedule(dependent);
				}
			};
			settle();
			const normalize = (bindingId, path, effect) => {
				let observer = bindingNodes.get(bindingId);
				if (observer === undefined) return path;
				if (path.some((key) => key !== null && typeof key === "object")) return path;
				if (effect === "escape") {
					observer = project(observer, path);
					settle();
					return (observer.origins?.size ?? 0) === 0 ? null : path;
				}
				if ((observer.origins?.size ?? 0) === 0) return path.length === 0 ? path : [null];
				for (let offset = 0; offset < path.length; offset++) {
					const key = path[offset];
					if (key === undefined) break;
					observer = project(observer, [key]);
					settle();
					if ((observer.origins?.size ?? 0) === 0 && offset + 1 < path.length) return [...path.slice(0, offset + 1), null];
				}
				return path;
			};
			const repeated = new Map();
			const repeatsUnpruned = (bindingId, prefix) => {
				const key = JSON.stringify([bindingId, prefix]);
				const cached = repeated.get(key);
				if (cached !== undefined) return cached;
				let observer = bindingNodes.get(bindingId);
				const signatures = new Set();
				let result = false;
				while (observer !== undefined && prefix.length > 0) {
					observer = project(observer, prefix);
					settle();
					if ((observer.origins?.size ?? 0) === 0) break;
					const signature = JSON.stringify([...observer.origins ?? []].map((origin) => typeof origin === "string" ? origin : `${String(origin.start)}:${String(origin.end)}`).sort(compareUnicodeCodePoints));
					if (signatures.has(signature)) {
						result = true;
						break;
					}
					signatures.add(signature);
				}
				repeated.set(key, result);
				return result;
			};
			return {
				normalize,
				repeatsUnpruned
			};
		};
		arrayReferencedValues = (node, path) => {
			const [key, ...remaining] = path;
			const selected = key ?? null;
			const selectedIndex = typeof selected === "object" ? null : semanticArrayIndex(selected);
			if (typeof selected !== "object" && selectedIndex === null) return [];
			const references = [];
			let minimumIndex = 0;
			let uncertainIndex = false;
			for (const element of node.elements) {
				if (t.isSpreadElement(element)) {
					if (selectedIndex === null || selectedIndex >= minimumIndex) {
						let sourceKey = null;
						if (!uncertainIndex) {
							if (selectedIndex !== null) sourceKey = selectedIndex - minimumIndex;
							else if (selected !== null && typeof selected === "object") sourceKey = {
								excludedKeys: selected.excludedKeys.flatMap((name) => {
									const index = semanticArrayIndex(name);
									return index === null || index < minimumIndex ? [] : [String(index - minimumIndex)];
								}),
								startIndex: Math.max(0, (selected.startIndex ?? 0) - minimumIndex)
							};
						}
						references.push({
							node: element.argument,
							path: [sourceKey, ...remaining],
							iterableFallbackPath: []
						});
					}
					uncertainIndex = true;
					continue;
				}
				if (element !== null && (uncertainIndex ? selectedIndex === null || selectedIndex >= minimumIndex : semanticPropertyPathKeyMatches(selected, String(minimumIndex)))) references.push({
					node: element,
					path: remaining
				});
				minimumIndex++;
			}
			return references;
		};
		copiedReferencePath = (initializer, path, effect) => {
			const offset = initializer.copyProjectionOffset;
			if (offset === undefined) return [...initializer.projection, ...path];
			const copiedPath = [...initializer.projection.slice(offset + 1), ...path];
			if (effect === "write" && copiedPath.length < 2) return null;
			let [key, ...remaining] = copiedPath;
			if (initializer.copyKind === "array-rest") {
				const startIndex = initializer.copyStartIndex ?? 0;
				if (key === undefined || key === null) key = {
					excludedKeys: [],
					startIndex
				};
				else if (typeof key === "object") key = {
					excludedKeys: key.excludedKeys.flatMap((name) => {
						const index = semanticArrayIndex(name);
						return index === null ? [] : [String(index + startIndex)];
					}),
					startIndex: (key.startIndex ?? 0) + startIndex
				};
				else {
					const index = semanticArrayIndex(key);
					if (index === null) return null;
					key = index + startIndex;
				}
			} else {
				const excludedKeys = initializer.copyExcludedKeys ?? [];
				if (key === undefined || key === null) key = { excludedKeys };
				else if (typeof key === "object") key = {
					...key,
					excludedKeys: [...new Set([...key.excludedKeys, ...excludedKeys])].sort(compareUnicodeCodePoints)
				};
				else if (excludedKeys.includes(String(key))) return null;
			}
			return [
				...initializer.projection.slice(0, offset),
				key,
				...remaining
			];
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAmbientWrites.js
/**
* Index source-local writes through ambient identities and stable aliases.
* The shared invocation owner resolves intrinsic aliases, bind/call/apply and
* literal argument spreads. Runtime reachability and arbitrary call effects
* remain unevaluated; a visible possible write is sufficient.
*/
function* indexJavaScriptAmbientWritesSteps(program, state) {
	const ambientReads = createAmbientPathResolver(state, false);
	const ambientWrites = createAmbientPathResolver(state, true);
	const interop = createSemanticModuleInterop(state, { intrinsicPath: (node) => {
		const [path] = ambientReads(node);
		return path?.[0] === "global" && path.every((key) => key !== null) ? ["intrinsic", ...path.slice(1)] : undefined;
	} });
	yield* collectJavaScriptIdentityWritesSteps(program, (root, kind, writeSite) => {
		if (kind === "opaque-call") return [];
		if (kind === "binding") return t.isIdentifier(root) && isUnshadowedGlobal(root, state, root.name) ? [["global", root.name]] : [];
		return ambientWrites(root, writeSite);
	}, interop.intrinsicInvocation, interop.staticString, interop.isFreshObject, (node, path) => {
		state.ambientWrites.retain(path);
		state.ambientWriteEffects.push({
			path,
			node
		});
	});
}
var GLOBAL_OBJECT_NAMES, globalObjectName, canonicalAmbientPath, createAmbientPathResolver, isUnmodifiedGlobalReference, isUnmodifiedImportMetaUrl;
function init_javascriptSemanticAmbientWrites() {
	return (init_javascriptSemanticAmbientWrites = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptElectronMemberWrites();
		init_javascriptModuleInterop();
		init_javascriptSemanticState();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticMutationInitializers();
		GLOBAL_OBJECT_NAMES = [
			"globalThis",
			"global",
			"window",
			"self"
		];
		globalObjectName = (node, state) => GLOBAL_OBJECT_NAMES.find((name) => isUnshadowedGlobal(node, state, name));
		canonicalAmbientPath = (path) => {
			if (path[0] !== "global") return path;
			let firstProperty = 1;
			while (GLOBAL_OBJECT_NAMES.includes(path[firstProperty] ?? "")) firstProperty += 1;
			return ["global", ...path.slice(firstProperty)];
		};
		createAmbientPathResolver = (state, possibleWrites) => {
			const cached = new WeakMap();
			return (node, capture) => {
				const prior = possibleWrites ? undefined : cached.get(node);
				if (prior !== undefined) return prior;
				const result = new Map();
				const pending = [{
					node,
					suffix: []
				}];
				const expanded = new WeakMap();
				const retain = (path) => {
					let canonical = canonicalAmbientPath(path);
					for (;;) {
						result.set(JSON.stringify(canonical), canonical);
						if (!possibleWrites || canonical[0] !== "global" || canonical[1] !== null) break;
						canonical = canonicalAmbientPath(["global", ...canonical.slice(2)]);
					}
				};
				while (pending.length > 0) {
					const current = pending.pop();
					if (current === undefined) break;
					const { root, members } = electronMemberPath(current.node);
					let suffix = current.suffix === undefined ? undefined : [...members, ...current.suffix];
					if (expanded.has(root)) {
						const previous = expanded.get(root);
						if (previous === undefined) continue;
						if (suffix !== undefined && previous.length === suffix.length) {
							const joined = previous.map((key, index) => key === suffix?.[index] ? key : null);
							if (joined.every((key, index) => key === previous[index])) continue;
							suffix = joined;
						} else suffix = undefined;
						if (!possibleWrites) {
							cached.set(node, []);
							return [];
						}
					}
					expanded.set(root, suffix);
					if (suffix === undefined && !possibleWrites) continue;
					const continueWith = (node, path = suffix) => pending.push({
						node,
						suffix: path,
						...current.readsAtSelf && { readsAtSelf: true }
					});
					if (t.isMetaProperty(root) && root.meta.name === "import" && root.property.name === "meta") {
						retain(["import-meta", ...suffix ?? []]);
						continue;
					}
					if (t.isIdentifier(root)) {
						if (globalObjectName(root, state) !== undefined) {
							retain(["global", ...suffix ?? []]);
							continue;
						}
						if (isUnshadowedGlobal(root, state, root.name)) {
							retain([
								"global",
								root.name,
								...suffix ?? []
							]);
							continue;
						}
						const binding = resolveSemanticBindingState(state, root, root.name);
						if (binding === undefined) continue;
						const stable = semanticStableInitializer(binding, state);
						const readAt = current.readsAtSelf ? root : capture;
						const initializers = possibleWrites ? readAt === undefined ? binding.initializers : semanticMutationInitializers(binding, readAt, state.parentsByNode).initializers : stable === undefined ? [] : [stable];
						for (const initializer of initializers) pending.push({
							node: initializer.node,
							readsAtSelf: true,
							suffix: suffix === undefined ? undefined : [...initializer.projection.map((key) => key === null ? null : String(key)), ...suffix]
						});
						continue;
					}
					if (possibleWrites && t.isConditionalExpression(root)) {
						continueWith(root.consequent);
						continueWith(root.alternate);
						continue;
					}
					if (possibleWrites && t.isLogicalExpression(root)) {
						continueWith(root.left);
						continueWith(root.right);
						continue;
					}
					const key = suffix?.[0];
					if (suffix !== undefined && key === undefined) continue;
					if (t.isObjectExpression(root)) {
						if (possibleWrites) {
							for (const property of root.properties) {
								if (t.isSpreadElement(property)) continueWith(property.argument);
								else if (t.isObjectProperty(property) && t.isExpression(property.value)) {
									const ownKey = semanticStaticPropertyKey(property.key, property.computed);
									if (suffix === undefined || key === null || ownKey === null || ownKey === key) continueWith(property.value, suffix?.slice(1));
								}
							}
						} else if (suffix !== undefined && key !== null && root.properties.every((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) !== null)) {
							const property = root.properties.findLast((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === key);
							if (t.isObjectProperty(property) && t.isExpression(property.value)) continueWith(property.value, suffix.slice(1));
						}
					} else if (t.isArrayExpression(root)) {
						if (suffix === undefined) {
							for (const element of root.elements) if (t.isSpreadElement(element)) continueWith(element.argument);
							else if (t.isExpression(element)) continueWith(element);
						} else if (!root.elements.some(t.isSpreadElement)) {
							const index = Number(key);
							if (key === null && possibleWrites) {
								for (const element of root.elements) if (t.isExpression(element)) continueWith(element, suffix.slice(1));
							} else if (key !== null && Number.isInteger(index) && index >= 0 && String(index) === key) {
								const element = root.elements[index];
								if (t.isExpression(element)) continueWith(element, suffix.slice(1));
							}
						}
					}
				}
				const paths = [...result.values()];
				if (!possibleWrites) cached.set(node, paths);
				return paths;
			};
		};
		isUnmodifiedGlobalReference = (callee, state, name) => {
			const node = unwrapJavaScriptExpression(callee).node;
			if (state.ambientWrites.covers(["global", name])) return false;
			if (isUnshadowedGlobal(node, state, name)) return true;
			if (!t.isMemberExpression(node) || semanticStaticPropertyKey(node.property, node.computed) !== name) return false;
			const root = unwrapJavaScriptExpression(node.object).node;
			const namespace = globalObjectName(root, state);
			return namespace !== undefined && !state.ambientWrites.covers(["global", namespace]);
		};
		isUnmodifiedImportMetaUrl = (node, state) => isImportMetaUrl(node) && !state.ambientWrites.covers(["import-meta", "url"]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCoverage.js
var semanticCoverage, semanticCoverageResourceLimits, semanticResourceBounds, semanticResourceLimitCoverage, semanticReturnCoverage;
function init_javascriptSemanticCoverage() {
	return (init_javascriptSemanticCoverage = __esmMin((() => {
		init_javascriptSemanticResourceLimits();
		semanticCoverage = (parserPartial, resourceLimits = []) => resourceLimits.length > 0 ? {
			status: "partial",
			omittedCount: null,
			resourceLimits
		} : {
			status: parserPartial ? "partial" : "complete",
			omittedCount: 0
		};
		semanticCoverageResourceLimits = (coverage) => coverage.resourceLimits ?? [];
		semanticResourceBounds = {
			"primitive-candidates": {
				value: 256,
				unit: "items"
			},
			"primitive-bytes": {
				value: SEMANTIC_PRIMITIVE_JSON_BYTES_LIMIT,
				unit: "bytes"
			},
			"expression-depth": {
				value: 256,
				unit: "depth"
			}
		};
		semanticResourceLimitCoverage = (resourceLimits) => resourceLimits.map((resourceLimit) => ({
			name: `javascript_semantic_${resourceLimit.replaceAll("-", "_")}`,
			...semanticResourceBounds[resourceLimit]
		}));
		semanticReturnCoverage = (retainedCount, parserPartial) => ({
			status: parserPartial ? "partial" : "complete",
			retainedCount,
			omittedCount: 0
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticReturns.js
var collectSemanticReturns, semanticReturnSiteId, resolveSemanticModuleCallables, directReturnExpressions, callableIdsForBinding, callableIdsForNode, flattenSemanticReturnValue, flattenValue;
function init_javascriptSemanticReturns() {
	return (init_javascriptSemanticReturns = __esmMin((() => {
		init_javascriptSemanticSlots();
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticValues();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticCoverage();
		init_javascriptSemanticCallableResults();
		init_javascriptSemanticMutationInitializers();
		collectSemanticReturns = (state, parserPartial) => {
			return state.callables.map((callable) => {
				const node = state.callableNodesById.get(callable.callableId);
				if (node === undefined) return {
					...callable,
					returnCoverage: {
						status: "partial",
						retainedCount: 0,
						omittedCount: null
					}
				};
				const expressions = directReturnExpressions(node);
				const sites = [];
				for (const expression of expressions) {
					sites.push({
						returnSiteId: semanticReturnSiteId(callable.callableId, expression.location),
						location: expression.location,
						identityReferenceLocation: expression.node !== null && t.isIdentifier(expression.node) ? range(expression.node) : null,
						value: expression.node === null ? {
							status: "unknown",
							reason: "Return has no value."
						} : evaluateSemanticExpression(expression.node, state)
					});
				}
				return {
					...callable,
					returnSites: sites,
					returnCoverage: semanticReturnCoverage(sites.length, parserPartial)
				};
			});
		};
		semanticReturnSiteId = (callableId, location) => [
			callableId,
			"return",
			String(location.start.line),
			String(location.start.column),
			String(location.end.line),
			String(location.end.column)
		].join(":");
		resolveSemanticModuleCallables = (state, callables, bindings) => {
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const provenanceByBinding = new Map(bindings.map(({ bindingId, provenance }) => [bindingId, provenance]));
			return state.moduleLinks.map((link) => {
				if (link.kind === "type-import") return {
					...link,
					callableId: null
				};
				const captured = state.defaultExportExpressions.get(link);
				if (link.localName === null && captured === undefined) return link.callableId !== null && callableIds.has(link.callableId) ? link : {
					...link,
					callableId: null
				};
				const binding = state.moduleLinkBindings.get(link);
				const resolved = captured !== undefined ? callableIdsForNode(captured, state, callableIds, new Set(), true) : binding === undefined ? [] : callableIdsForBinding(binding, state, callableIds, new Set());
				const provenance = binding === undefined || link.specifier !== null ? undefined : provenanceByBinding.get(binding.bindingId);
				const resolutionMode = provenance?.status === "module" ? provenance.origins[0].resolutionMode : undefined;
				return {
					...link,
					...resolutionMode !== undefined ? { resolutionMode } : {},
					callableId: resolved.length === 1 ? resolved[0] ?? null : null
				};
			});
		};
		directReturnExpressions = (callable) => semanticCallableResultExpressions(callable).filter(({ kind }) => kind === "return").map(({ node, site }) => ({
			node,
			location: range(site)
		}));
		callableIdsForBinding = (binding, state, admitted, seen, read) => {
			if (seen.has(binding.bindingId) || read === undefined && binding.initializers.length !== 1 || binding.definitions.some(({ kind }) => read === undefined && kind === "assignment" || kind === "parameter" || kind === "catch")) return [];
			const selected = read === undefined ? binding : semanticReadInitializers(binding, read, state.parentsByNode);
			const initializer = selected.initializers[0];
			if (initializer === undefined || selected.initializers.length !== 1 || initializer.projection.length > 0 || state.conditionallySkippedExpressions.has(initializer.node)) return [];
			return callableIdsForNode(initializer.node, state, admitted, new Set([...seen, binding.bindingId]), read !== undefined);
		};
		callableIdsForNode = (node, state, admitted, seen, snapshot = false) => {
			const unwrapped = unwrapJavaScriptExpression(node).node;
			if (unwrapped !== node) return callableIdsForNode(unwrapped, state, admitted, seen, snapshot);
			const direct = semanticCallableIdForNode(node);
			if (direct !== null && admitted.has(direct)) return [direct];
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				return binding === undefined ? [] : callableIdsForBinding(binding, state, admitted, seen, snapshot ? node : undefined);
			}
			return [];
		};
		flattenSemanticReturnValue = (value) => {
			const fields = [];
			const propertyCoverage = [];
			flattenValue(value, "", fields, propertyCoverage);
			fields.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
			propertyCoverage.sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
			return {
				fields,
				propertyCoverage
			};
		};
		flattenValue = (value, path, fields, coverage, presence = "present") => {
			if (presence !== "present") {
				fields.push({
					path,
					presence,
					state: "unknown",
					value: null,
					reason: "reason" in value ? value.reason : "Property presence is uncertain."
				});
				return;
			}
			if (value.status === "literal") {
				fields.push({
					path,
					presence,
					state: "literal",
					value: value.value,
					reason: null
				});
				return;
			}
			if (value.status === "union") {
				fields.push({
					path,
					presence,
					state: "union",
					value: [...value.values],
					reason: null
				});
				return;
			}
			if ("reason" in value) {
				fields.push({
					path,
					presence,
					state: "unknown",
					value: null,
					reason: value.reason
				});
				return;
			}
			const container = semanticContainer(value);
			coverage.push({
				path,
				...container.coverage
			});
			for (const slot of container.slots) flattenValue(slot.value, `${path}${semanticPropertyPointer([slot.name])}`, fields, coverage, slot.presence);
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCallableStack.js
var createSemanticCallableStack, createSemanticCallableIdStack;
function init_javascriptSemanticCallableStack() {
	return (init_javascriptSemanticCallableStack = __esmMin((() => {
		init_javascriptSemanticProjection();
		createSemanticCallableStack = (admit, callables = []) => {
			const frames = [];
			const suspendedMethods = new Map();
			callables.length = 0;
			const push = (frame) => {
				frames.push(frame);
				callables.push(frame.callable);
			};
			const pop = () => {
				callables.pop();
				return frames.pop();
			};
			return {
				callables,
				enter: (node, parent) => {
					if (parent !== null && (t.isObjectMethod(parent) || t.isClassMethod(parent)) && parent.computed && parent.key === node && frames.at(-1)?.callableId === semanticCallableIdForNode(parent)) {
						const method = pop();
						if (method !== undefined) suspendedMethods.set(node, method);
					}
					const callableId = semanticCallableIdForNode(node);
					if (callableId === null) return;
					const callable = admit(callableId);
					if (callable !== undefined) push({
						callableId,
						callable
					});
				},
				exit: (node) => {
					const callableId = semanticCallableIdForNode(node);
					if (callableId !== null && frames.at(-1)?.callableId === callableId) pop();
					const method = suspendedMethods.get(node);
					if (method !== undefined) {
						suspendedMethods.delete(node);
						push(method);
					}
				}
			};
		};
		createSemanticCallableIdStack = (admitted, callables = []) => createSemanticCallableStack((callableId) => admitted.has(callableId) ? callableId : undefined, callables);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDataEffectHelpers.js
var assignedSemanticResultBindings, assignedSourceIs, projectedPatternBindings, semanticProjectedBindingFacts, scalarAssignedResultBinding, builtinDataEffectMethod, semanticBoundMemberPath, builtinBindingPath, computeBuiltinBindingPath, builtinNamespaceOrigin, affectsBuiltinPath, BUILTIN_RECEIVER_METHODS, builtinEffectIndexes, builtinEffectIndex, builtinEscapes, builtinModuleEffects, requiredModuleChanged, originalBuiltinReceiver, computeOriginalBuiltinReceiver, semanticExpressionModuleOrigin, isSemanticProcessObject, outerDataEffectBinding, traverseDataEffects, dataEffectArgumentBindingId, dataEffectPrimitive, dataEffectLiteralString, dataEffectMemberCallee;
function init_javascriptSemanticDataEffectHelpers() {
	return (init_javascriptSemanticDataEffectHelpers = __esmMin((() => {
		init_javascriptBuiltinResourceMethods();
		init_javascriptSemanticProvenance();
		init_javascriptSemanticRequireOrigin();
		init_javascriptSemanticValues();
		init_javascriptSemanticPropertyPaths();
		init_javascriptSemanticProjection();
		init_javascriptSemanticMutationInitializers();
		init_javascriptSemanticCallableStack();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptAstValues();
		assignedSemanticResultBindings = (node, ancestors, state) => {
			for (let index = ancestors.length - 1; index >= 0; index -= 1) {
				const owner = ancestors[index];
				if (owner === undefined) continue;
				let pattern;
				let source = null;
				if (t.isVariableDeclarator(owner)) {
					pattern = owner.id;
					source = owner.init ?? null;
				} else if (t.isAssignmentExpression(owner)) {
					pattern = owner.left;
					source = owner.right;
				}
				if (pattern !== undefined && source !== null && assignedSourceIs(node, source)) return projectedPatternBindings(pattern, state);
				if (semanticCallableIdForNode(owner) !== null) return [];
			}
			return [];
		};
		assignedSourceIs = (node, source) => {
			let value = source;
			while (true) {
				if (t.isAwaitExpression(value)) value = value.argument;
				else {
					const unwrapped = unwrapJavaScriptExpression(value).node;
					if (unwrapped === value) break;
					value = unwrapped;
				}
			}
			return value === node;
		};
		projectedPatternBindings = (pattern, state) => {
			const output = [];
			const visit = (current, path, partial) => {
				if (t.isIdentifier(current)) {
					const binding = resolveSemanticBindingState(state, current, current.name);
					if (binding !== undefined) output.push({
						bindingId: binding.bindingId,
						identifier: current,
						projectionPath: path,
						resolution: partial ? "partial" : "complete"
					});
					return;
				}
				if (t.isAssignmentPattern(current)) return visit(current.left, path, true);
				if (t.isRestElement(current)) return visit(current.argument, [...path, null], true);
				if (t.isObjectPattern(current)) {
					for (const property of current.properties) {
						if (t.isRestElement(property)) visit(property.argument, [...path, null], true);
						else visit(property.value, [...path, semanticStaticPropertyKey(property.key, property.computed)], partial || semanticStaticPropertyKey(property.key, property.computed) === null);
					}
				} else if (t.isArrayPattern(current)) {
					current.elements.forEach((element, index) => {
						if (element !== null) visit(element, [...path, index], partial);
					});
				}
			};
			visit(pattern, [], false);
			return output;
		};
		semanticProjectedBindingFacts = (bindings) => bindings.map(({ identifier: _identifier, ...fact }) => fact);
		scalarAssignedResultBinding = (bindings) => bindings.length === 1 && bindings[0]?.projectionPath.length === 0 ? bindings[0]?.bindingId ?? null : null;
		builtinDataEffectMethod = (callee, state, specifiers) => {
			const expression = unwrapJavaScriptExpression(callee).node;
			if (expression !== callee) return builtinDataEffectMethod(expression, state, specifiers);
			if (t.isSequenceExpression(expression)) {
				const final = expression.expressions.at(-1);
				return final === undefined ? null : builtinDataEffectMethod(final, state, specifiers);
			}
			const required = semanticRequireOrigin(callee, state);
			if (required !== undefined) {
				const origin = builtinNamespaceOrigin(required.origin);
				return origin.importedPath.length === 1 && specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier) && !requiredModuleChanged(required.origin.specifier, required.origin.importedPath, callee, state, true) ? origin.importedPath[0] ?? null : null;
			}
			if (t.isIdentifier(callee)) {
				const binding = resolveSemanticBindingState(state, callee, callee.name);
				const path = builtinBindingPath(binding, state, specifiers, callee, [], true);
				return path?.length === 1 ? path[0] ?? null : null;
			}
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return null;
			if (!t.isIdentifier(callee.object)) {
				const method = semanticStaticPropertyKey(callee.property, callee.computed);
				const receiver = semanticBoundMemberPath(callee.object, state);
				if (method !== null && receiver !== undefined) {
					const provenance = evaluateSemanticProvenance(receiver.binding, state);
					if (provenance.status === "module") {
						const origin = builtinNamespaceOrigin({
							...provenance.origins[0],
							importedPath: [...provenance.origins[0].importedPath, ...receiver.path]
						});
						if (specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier)) return builtinBindingPath(receiver.binding, state, specifiers, callee, [...receiver.path, method], true)?.length === 0 ? method : null;
					}
				}
				const source = semanticExpressionModuleOrigin(callee.object, state);
				if (method === null || source === undefined) return null;
				const origin = builtinNamespaceOrigin(source);
				return origin.importedPath.length === 0 && specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier) && !requiredModuleChanged(origin.specifier, [...origin.importedPath, method], callee, state, true, callee.object) ? method : null;
			}
			const binding = resolveSemanticBindingState(state, callee.object, callee.object.name);
			const method = semanticStaticPropertyKey(callee.property, callee.computed);
			if (method === null) return null;
			const resolvedPath = builtinBindingPath(binding, state, specifiers, callee, [method], true);
			if (resolvedPath?.length === 0) return method;
			const initializer = binding?.initializers[0];
			if (initializer === undefined || binding?.initializers.length !== 1 || !t.isMemberExpression(initializer.node) && !t.isOptionalMemberExpression(initializer.node)) {
				return null;
			}
			const provenance = evaluateSemanticProvenance(binding, state);
			if (provenance.status !== "module") return null;
			const origin = builtinNamespaceOrigin(provenance.origins[0]);
			const selected = [...origin.importedPath, method];
			return specifiers.some((specifier) => specifier.replace(/^node:/u, "") === origin.specifier) && builtinBindingPath(binding, state, specifiers, initializer.node, [method], true)?.length === 0 && !requiredModuleChanged(provenance.origins[0].specifier, selected, callee, state, true, initializer.node) ? method : null;
		};
		semanticBoundMemberPath = (node, state) => {
			const path = [];
			let current = unwrapJavaScriptExpression(node).node;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				const key = semanticStaticPropertyKey(current.property, current.computed);
				if (key === null || !t.isNode(current.object)) return undefined;
				path.unshift(key);
				current = unwrapJavaScriptExpression(current.object).node;
			}
			if (!t.isIdentifier(current)) return undefined;
			const binding = resolveSemanticBindingState(state, current, current.name);
			return binding === undefined ? undefined : {
				binding,
				path
			};
		};
		builtinBindingPath = (binding, state, specifiers, capture, selectedPath = [], callableValue = false, visited = new Set(), memo = new Map(), provenanceCapture, savedObjectCapture) => {
			if (binding === undefined) return null;
			const key = JSON.stringify([
				binding.bindingId,
				selectedPath,
				callableValue,
				provenanceCapture?.start,
				provenanceCapture?.end,
				savedObjectCapture?.start,
				savedObjectCapture?.end
			]);
			let captured = memo.get(capture);
			if (captured?.has(key)) return captured.get(key) ?? null;
			if (visited.has(binding.bindingId)) return null;
			if (captured === undefined) {
				captured = new Map();
				memo.set(capture, captured);
			}
			const result = computeBuiltinBindingPath(binding, state, specifiers, capture, selectedPath, callableValue, visited, memo, provenanceCapture, savedObjectCapture);
			captured.set(key, result);
			return result;
		};
		computeBuiltinBindingPath = (binding, state, specifiers, capture, selectedPath = [], callableValue = false, visited, memo, provenanceCapture, savedObjectCapture) => {
			if (binding === undefined || visited.has(binding.bindingId)) return null;
			if (binding.memberWrites.some(({ path, node }) => affectsBuiltinPath(path, selectedPath) && !(semanticTopLevelEffectFollowsCapture(path.length === 0 && provenanceCapture !== undefined ? provenanceCapture : capture, node, state.parentsByNode) || savedObjectCapture !== undefined && path.length < selectedPath.length && semanticTopLevelEffectFollowsCapture(savedObjectCapture, node, state.parentsByNode))) || builtinEscapes(binding, state).some(({ path, node }) => affectsBuiltinPath(path, selectedPath) && (!callableValue || path.length < selectedPath.length) && !semanticTopLevelEffectFollowsCapture(capture, node, state.parentsByNode))) return null;
			const provenance = provenanceCapture === undefined ? evaluateSemanticProvenance(binding, state) : evaluateSemanticProvenanceAtRead(binding, provenanceCapture, state);
			if (provenance.status !== "module") return null;
			const { importedPath } = provenance.origins[0];
			const namespace = builtinNamespaceOrigin(provenance.origins[0]);
			if (!specifiers.some((item) => {
				const name = item.replace(/^node:/u, "");
				return name === namespace.specifier || namespace.specifier === "fs" && selectedPath[0] === "promises" && name === "fs/promises";
			})) return null;
			let resolvedPath = importedPath;
			for (const origin of binding.directOrigins) {
				const shared = semanticMutableBuiltinOrigin(origin, selectedPath);
				if (shared !== undefined && requiredModuleChanged(shared.specifier, shared.path, capture, state, callableValue)) return null;
			}
			const ancestors = new Set([...visited, binding.bindingId]);
			for (const initializer of binding.initializers) {
				const pending = [{
					node: initializer.node,
					path: [...initializer.projection.map(String), ...selectedPath],
					savedObjectCapture: selectedPath.length > 0 && (t.isMemberExpression(initializer.node) || t.isOptionalMemberExpression(initializer.node)) ? initializer.node : savedObjectCapture,
					capture: callableValue && selectedPath.length === 0 && initializer.projection.length > 0 ? initializer.node : capture
				}];
				while (pending.length > 0) {
					const current = pending.pop();
					const node = unwrapJavaScriptExpression(current.node).node;
					if (t.isIdentifier(node)) {
						const source = resolveSemanticBindingState(state, node, node.name);
						const sourcePath = builtinBindingPath(source, state, specifiers, current.capture, current.path, callableValue, ancestors, memo, node, current.savedObjectCapture);
						if (sourcePath === null) return null;
						resolvedPath = [...sourcePath, ...current.path].slice(0, sourcePath.length + current.path.length - selectedPath.length);
					} else if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
						const key = semanticStaticPropertyKey(node.property, node.computed);
						if (key === null) return null;
						pending.push({
							node: node.object,
							path: [key, ...current.path],
							savedObjectCapture: current.savedObjectCapture,
							capture: callableValue && selectedPath.length === 0 ? node : current.capture
						});
					} else if (t.isSequenceExpression(node)) {
						const final = node.expressions.at(-1);
						if (final === undefined) return null;
						pending.push({
							...current,
							node: final
						});
					} else if (t.isAssignmentExpression(node) && node.operator === "=") {
						pending.push({
							...current,
							node: node.right
						});
					} else if (t.isConditionalExpression(node)) {
						pending.push({
							...current,
							node: node.consequent
						}, {
							...current,
							node: node.alternate
						});
					} else if (t.isLogicalExpression(node)) {
						pending.push({
							...current,
							node: node.left
						}, {
							...current,
							node: node.right
						});
					} else {
						const required = semanticRequireOrigin(node, state);
						if (required !== undefined && requiredModuleChanged(required.origin.specifier, [...required.origin.importedPath, ...current.path], current.capture, state, callableValue, current.savedObjectCapture)) return null;
					}
				}
			}
			return binding.directOrigins.length > 0 && semanticBuiltinNamespacePath(importedPath) ? [] : builtinNamespaceOrigin({
				...provenance.origins[0],
				importedPath: resolvedPath
			}).importedPath;
		};
		builtinNamespaceOrigin = (origin) => {
			const specifier = origin.specifier.replace(/^node:/u, "");
			const importedPath = origin.resolutionMode !== "require" && origin.importedPath[0] === "default" ? origin.importedPath.slice(1) : origin.importedPath;
			return specifier === "fs" && importedPath[0] === "promises" ? {
				...origin,
				specifier: "fs/promises",
				importedPath: importedPath.slice(1)
			} : {
				...origin,
				specifier,
				importedPath
			};
		};
		affectsBuiltinPath = (path, selected) => path.length <= selected.length && path.every((key, index) => semanticPropertyPathKeyMatches(key, selected[index]));
		BUILTIN_RECEIVER_METHODS = {
			fs: new Set([
				"readFile",
				"readFileSync",
				"writeFile",
				"writeFileSync",
				"close",
				"closeSync",
				"existsSync",
				...BUILTIN_RESOURCE_METHODS.fs
			]),
			"fs/promises": new Set([
				"readFile",
				"writeFile",
				...BUILTIN_RESOURCE_METHODS["fs/promises"]
			]),
			net: new Set(BUILTIN_RESOURCE_METHODS.net),
			tls: new Set(BUILTIN_RESOURCE_METHODS.tls),
			http: new Set(["request", "get"]),
			https: new Set(["request", "get"]),
			child_process: new Set([
				"spawn",
				"exec",
				"execFile",
				"fork"
			]),
			process: new Set([
				"cwd",
				"uptime",
				"hrtime",
				"nextTick"
			]),
			timers: new Set([
				"setTimeout",
				"setInterval",
				"setImmediate",
				"clearTimeout",
				"clearInterval",
				"clearImmediate"
			])
		};
		builtinEffectIndexes = new WeakMap();
		builtinEffectIndex = (state) => {
			let index = builtinEffectIndexes.get(state);
			if (index === undefined) {
				index = {
					writesByModule: new Map([...state.requiredModuleEffects].map(([name, effects]) => [name, effects.filter(({ kind }) => kind === "write")])),
					moduleEffects: new Map(),
					bindingEscapes: new Map(),
					receivers: new WeakMap()
				};
				builtinEffectIndexes.set(state, index);
			}
			return index;
		};
		builtinEscapes = (binding, state) => {
			const cache = builtinEffectIndex(state).bindingEscapes;
			let effects = cache.get(binding.bindingId);
			if (effects === undefined) {
				effects = binding.escapedPaths.filter(({ node }) => !originalBuiltinReceiver(node, state));
				cache.set(binding.bindingId, effects);
			}
			return effects;
		};
		builtinModuleEffects = (specifier, state) => {
			const cache = builtinEffectIndex(state).moduleEffects;
			let effects = cache.get(specifier);
			if (effects === undefined) {
				effects = (state.requiredModuleEffects.get(specifier) ?? []).filter(({ kind, node }) => kind === "write" || !originalBuiltinReceiver(node, state));
				if (specifier === "fs/promises") {
					const sharedFsEscapes = (state.requiredModuleEffects.get("fs") ?? []).filter(({ kind, path, node }) => kind === "escape" && (path.length === 0 || path[0] === "promises") && !originalBuiltinReceiver(node, state)).map((effect) => ({
						...effect,
						path: effect.path[0] === "promises" ? effect.path.slice(1) : effect.path
					}));
					effects = [...effects, ...sharedFsEscapes];
				}
				cache.set(specifier, effects);
			}
			return effects;
		};
		requiredModuleChanged = (specifier, selected, capture, state, callableValue = false, savedObjectCapture) => {
			const identity = semanticRequireExportsIdentity(specifier, selected);
			return builtinModuleEffects(identity.specifier, state).some(({ path, node, kind }) => !(savedObjectCapture !== undefined && path.length < identity.path.length && semanticTopLevelEffectFollowsCapture(savedObjectCapture, node, state.parentsByNode)) && affectsBuiltinPath(path, identity.path) && !semanticTopLevelEffectFollowsCapture(capture, node, state.parentsByNode) && (kind === "write" || !callableValue || path.length < identity.path.length));
		};
		originalBuiltinReceiver = (node, state) => {
			if (node === undefined) return false;
			const receivers = builtinEffectIndex(state).receivers;
			const previous = receivers.get(node);
			if (previous !== undefined) return previous;
			const result = computeOriginalBuiltinReceiver(node, state);
			receivers.set(node, result);
			return result;
		};
		computeOriginalBuiltinReceiver = (node, state) => {
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return false;
			const callee = node.callee;
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee)) return false;
			const receiver = t.isIdentifier(callee.object) ? resolveSemanticBindingState(state, callee.object, callee.object.name) : undefined;
			const provenance = receiver === undefined ? undefined : evaluateSemanticProvenance(receiver, state);
			const sourceOrigin = provenance?.status === "module" ? provenance.origins[0] : semanticExpressionModuleOrigin(callee.object, state) ?? semanticRequireOrigin(callee.object, state)?.origin ?? semanticGlobalProcessOrigin(callee.object, state);
			if (sourceOrigin === undefined) return false;
			const origin = builtinNamespaceOrigin(sourceOrigin);
			if (origin.importedPath.length !== 0) return false;
			const method = semanticStaticPropertyKey(callee.property, callee.computed);
			const identity = semanticRequireExportsIdentity(origin.specifier, [method ?? ""]);
			if (method === null || !BUILTIN_RECEIVER_METHODS[origin.specifier]?.has(method) || receiver?.memberWrites.some(({ path, node: write }) => affectsBuiltinPath(path, [method]) && !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode)) || (builtinEffectIndex(state).writesByModule.get(identity.specifier) ?? []).some(({ path, node: write }) => affectsBuiltinPath(path, identity.path) && !semanticTopLevelEffectFollowsCapture(node, write, state.parentsByNode))) return false;
			return !node.arguments.some((argument) => {
				if (!t.isIdentifier(argument)) return false;
				const passed = resolveSemanticBindingState(state, argument, argument.name);
				if (passed === undefined) return false;
				const passedOrigin = evaluateSemanticProvenance(passed, state);
				return passedOrigin.status === "module" && builtinNamespaceOrigin(passedOrigin.origins[0]).specifier === origin.specifier && builtinNamespaceOrigin(passedOrigin.origins[0]).importedPath.length === 0;
			});
		};
		semanticExpressionModuleOrigin = (expression, state, visited = new Set()) => {
			const node = unwrapJavaScriptExpression(expression).node;
			const required = semanticRequireOrigin(node, state);
			if (required !== undefined) return required.origin;
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				if (binding === undefined || visited.has(binding.bindingId)) return undefined;
				const provenance = evaluateSemanticProvenance(binding, state);
				return provenance.status === "module" ? provenance.origins[0] : undefined;
			}
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const base = semanticExpressionModuleOrigin(node.object, state, visited);
				const key = semanticStaticPropertyKey(node.property, node.computed);
				return base === undefined || key === null ? undefined : {
					...base,
					importedPath: [...base.importedPath, key]
				};
			}
			return undefined;
		};
		isSemanticProcessObject = (node, state, family, key) => {
			if (!t.isIdentifier(node)) return false;
			const binding = resolveSemanticBindingState(state, node, node.name);
			const selected = key === undefined || key === null ? [family] : [family, key];
			if (binding === undefined) return semanticGlobalProcessOrigin(node, state) !== undefined && !requiredModuleChanged("process", selected, node, state);
			return builtinBindingPath(binding, state, ["process", "node:process"], node, selected)?.length === 0;
		};
		outerDataEffectBinding = (node, context) => {
			return scalarAssignedResultBinding(assignedSemanticResultBindings(node, context.ancestors, context.state));
		};
		traverseDataEffects = (program, context, visit) => {
			const callableStack = createSemanticCallableIdStack(context.callableIds, context.callableStack);
			context.ancestors.length = 0;
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					visit(node, parent);
					context.ancestors.push(node);
				},
				exit: (node) => {
					context.ancestors.pop();
					callableStack.exit(node);
				}
			});
		};
		dataEffectArgumentBindingId = (node, state) => t.isIdentifier(node) ? resolveSemanticBindingState(state, node, node.name)?.bindingId ?? null : null;
		dataEffectPrimitive = (node) => {
			if (t.isStringLiteral(node) || t.isNumericLiteral(node)) return node.value;
			if (t.isBooleanLiteral(node)) return node.value;
			return null;
		};
		dataEffectLiteralString = (node) => {
			if (node === undefined) return null;
			const literal = readExactJavaScriptLiteral(node);
			if (literal.found && typeof literal.value === "string") return literal.value;
			return t.isTemplateLiteral(node) && node.expressions.length === 0 ? node.quasis[0]?.value.raw ?? null : null;
		};
		dataEffectMemberCallee = (node) => t.isMemberExpression(node.callee) || t.isOptionalMemberExpression(node.callee) ? node.callee : null;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAsyncEffects.js
var EVENT_REGISTER_METHODS, EVENT_REMOVE_METHODS, EVENT_LISTENER_METHODS, EVENT_METHODS, TIMER_SCHEDULE_METHODS, TIMER_CANCEL_METHODS, collectJavaScriptSemanticAsyncEffects, collectEvent, eventKind, emitterIdentity, collectTimer, resolveTimers, timerMethod, admittedTimerMethod, bindingId, timerDelay, timerId;
function init_javascriptSemanticAsyncEffects() {
	return (init_javascriptSemanticAsyncEffects = __esmMin((() => {
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		EVENT_REGISTER_METHODS = [
			"on",
			"once",
			"addListener",
			"prependListener",
			"prependOnceListener"
		];
		EVENT_REMOVE_METHODS = [
			"off",
			"removeListener",
			"removeAllListeners"
		];
		EVENT_LISTENER_METHODS = [
			...EVENT_REGISTER_METHODS,
			"off",
			"removeListener"
		];
		EVENT_METHODS = [
			...EVENT_REGISTER_METHODS,
			...EVENT_REMOVE_METHODS,
			"emit"
		];
		TIMER_SCHEDULE_METHODS = [
			"setTimeout",
			"setInterval",
			"setImmediate"
		];
		TIMER_CANCEL_METHODS = [
			"clearTimeout",
			"clearInterval",
			"clearImmediate"
		];
		collectJavaScriptSemanticAsyncEffects = (program, state, callables) => {
			const events = [];
			const timers = [];
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(callableIds);
			const ancestors = [];
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
						const ownerCallableId = callableStack.callables.at(-1) ?? null;
						collectEvent(node, ownerCallableId, state, events);
						collectTimer({
							node,
							ownerCallableId,
							state,
							output: timers,
							ancestors
						});
					}
					ancestors.push(node);
				},
				exit: (node) => {
					ancestors.pop();
					callableStack.exit(node);
				}
			});
			return {
				eventOperations: events,
				timerOperations: resolveTimers(timers)
			};
		};
		collectEvent = (node, ownerCallableId, state, output) => {
			const member = dataEffectMemberCallee(node);
			if (member === null) return;
			const method = EVENT_METHODS.find((candidate) => candidate === semanticStaticPropertyName(member.property, member.computed));
			if (method === undefined) return;
			const kind = eventKind(method);
			const eventArgument = node.arguments[0];
			const listenerArgument = EVENT_LISTENER_METHODS.includes(method) ? node.arguments[1] : undefined;
			const emitter = emitterIdentity(member.object, state);
			const eventName = dataEffectLiteralString(eventArgument);
			output.push({
				eventId: `event:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
				kind,
				method,
				location: range(node),
				ownerCallableId,
				emitterKey: emitter.key,
				emitterBindingId: emitter.bindingId,
				eventName,
				listenerBindingId: bindingId(listenerArgument, state),
				listenerLocation: t.isNode(listenerArgument) ? range(listenerArgument) : null,
				resolution: eventName === null ? "unresolved" : emitter.complete ? "complete" : "partial"
			});
		};
		eventKind = (method) => {
			if (EVENT_REGISTER_METHODS.some((candidate) => candidate === method)) return "register";
			if (EVENT_REMOVE_METHODS.some((candidate) => candidate === method)) return "remove";
			return "dispatch";
		};
		emitterIdentity = (node, state) => {
			if (t.isIdentifier(node)) {
				const binding = resolveSemanticBindingState(state, node, node.name);
				if (binding !== undefined) return {
					key: `binding:${binding.bindingId}`,
					bindingId: binding.bindingId,
					complete: true
				};
				return {
					key: `global:${node.name}`,
					bindingId: null,
					complete: !semanticResolutionBlocked(state, node, node.name)
				};
			}
			if (t.isThisExpression(node)) return {
				key: "this",
				bindingId: null,
				complete: true
			};
			return {
				key: `expression:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
				bindingId: null,
				complete: false
			};
		};
		collectTimer = (input) => {
			const { node, ownerCallableId, state, output, ancestors } = input;
			const method = timerMethod(node.callee, state);
			if (method === null) return;
			const kind = TIMER_SCHEDULE_METHODS.some((candidate) => candidate === method) ? "schedule" : "cancel";
			const projectedResultBindings = assignedSemanticResultBindings(node, ancestors, state);
			output.push({
				node,
				method,
				kind,
				ownerCallableId,
				handleBindingId: kind === "schedule" ? scalarAssignedResultBinding(projectedResultBindings) : bindingId(node.arguments[0], state),
				projectedResultBindings: kind === "schedule" ? semanticProjectedBindingFacts(projectedResultBindings.filter(({ projectionPath }) => projectionPath.length > 0)) : []
			});
		};
		resolveTimers = (candidates) => {
			const schedulesByBinding = new Map();
			for (const candidate of candidates) {
				if (candidate.kind !== "schedule") continue;
				const ids = [...candidate.handleBindingId === null ? [] : [candidate.handleBindingId], ...candidate.projectedResultBindings.map(({ bindingId }) => bindingId)];
				for (const id of ids) {
					const existing = schedulesByBinding.get(id) ?? [];
					existing.push(candidate);
					schedulesByBinding.set(id, existing);
				}
			}
			return candidates.map((candidate) => {
				const linked = candidate.kind === "cancel" && candidate.handleBindingId !== null ? schedulesByBinding.get(candidate.handleBindingId) ?? [] : [];
				return {
					timerId: timerId(candidate),
					kind: candidate.kind,
					method: candidate.method,
					location: range(candidate.node),
					ownerCallableId: candidate.ownerCallableId,
					handleBindingId: candidate.handleBindingId,
					projectedResultBindings: candidate.projectedResultBindings,
					linkedTimerId: linked.length === 1 && linked[0] !== undefined ? timerId(linked[0]) : null,
					delayMilliseconds: timerDelay(candidate),
					resolution: candidate.kind === "schedule" ? "complete" : linked.length === 1 && !linked[0]?.projectedResultBindings.some(({ bindingId }) => bindingId === candidate.handleBindingId) ? "complete" : linked.length > 1 ? "partial" : "unresolved"
				};
			});
		};
		timerMethod = (callee, state) => {
			if (t.isIdentifier(callee)) {
				const binding = resolveSemanticBindingState(state, callee, callee.name);
				if (binding === undefined) {
					const method = admittedTimerMethod(callee.name);
					if (method === null) return null;
					return semanticResolutionBlocked(state, callee, callee.name) ? null : method;
				}
			}
			return admittedTimerMethod(builtinDataEffectMethod(callee, state, ["timers", "node:timers"]) ?? "");
		};
		admittedTimerMethod = (value) => [...TIMER_SCHEDULE_METHODS, ...TIMER_CANCEL_METHODS].find((candidate) => candidate === value) ?? null;
		bindingId = (node, state) => t.isIdentifier(node) ? resolveSemanticBindingState(state, node, node.name)?.bindingId ?? null : null;
		timerDelay = (candidate) => {
			if (candidate.kind !== "schedule" || candidate.method === "setImmediate") return null;
			const delay = candidate.node.arguments[1];
			return t.isNumericLiteral(delay) ? delay.value : null;
		};
		timerId = (candidate) => `timer:${candidate.kind}:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticCalls.js
var collectJavaScriptSemanticCalls, collectCallSite, collectCallResultFlow, retainedArguments, collectArgumentFlows, cachedParameterBindings, collectReturnFlows, collectCapture, collectDynamicProperty, collectDynamicScope, addFrontier, bindingIsWithinCallable, enclosingFunction, semanticCallSiteId;
function init_javascriptSemanticCalls() {
	return (init_javascriptSemanticCalls = __esmMin((() => {
		init_javascriptSemanticProjection();
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticCallResolution();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		collectJavaScriptSemanticCalls = (program, state, callables) => {
			const output = {
				callSites: [],
				argumentFlows: [],
				callReturnFlows: [],
				callResultFlows: [],
				closureCaptures: [],
				frontiers: []
			};
			const callableById = new Map(callables.map((callable) => [callable.callableId, callable]));
			const context = {
				state,
				callableById,
				output,
				bindingResolutionCache: new Map(),
				parameterBindingCache: new Map(),
				ancestors: []
			};
			const callableStack = createSemanticCallableStack((callableId) => callableById.get(callableId));
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					const owner = enclosingFunction(callableStack.callables);
					collectCapture(node, parent, owner, context);
					collectDynamicProperty(node, owner, state, output);
					collectDynamicScope(node, owner, state, output);
					if (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node)) collectCallSite(node, parent, owner, context);
					context.ancestors.push(node);
				},
				exit: (node) => {
					context.ancestors.pop();
					callableStack.exit(node);
				}
			});
			return {
				callSites: output.callSites,
				argumentFlows: output.argumentFlows,
				callReturnFlows: output.callReturnFlows,
				callResultFlows: output.callResultFlows,
				closureCaptures: output.closureCaptures,
				frontiers: output.frontiers
			};
		};
		collectCallSite = (node, parent, owner, context) => {
			const { state, callableById, output } = context;
			const resolution = resolveLocalCallables({
				node: node.callee,
				state,
				callableById,
				seenBindings: new Set(),
				bindingCache: context.bindingResolutionCache
			});
			const callSiteId = semanticCallSiteId(node);
			const argumentsValue = retainedArguments(node.arguments);
			const site = {
				callSiteId,
				kind: t.isNewExpression(node) ? "construct" : "call",
				callerCallableId: owner?.callableId ?? null,
				location: range(node),
				calleeLocation: range(node.callee),
				resolution: resolution.callableIds.length === 1 && resolution.complete ? "exact" : resolution.callableIds.length > 0 ? "ambiguous" : "unresolved",
				calleeCallableIds: resolution.callableIds,
				arguments: argumentsValue
			};
			output.callSites.push(site);
			collectCallResultFlow(site, node, context);
			if (site.resolution !== "exact") addFrontier({
				kind: "dynamic-call",
				callableId: owner?.callableId ?? null,
				location: range(node.callee),
				reason: resolution.reason
			}, state, output);
			collectArgumentFlows(site, node, context);
			if (site.kind === "call") collectReturnFlows(site, callableById, state, output);
		};
		collectCallResultFlow = (site, node, context) => {
			for (const assigned of assignedSemanticResultBindings(node, context.ancestors, context.state).filter(({ projectionPath }) => projectionPath.length === 0)) {
				const binding = context.state.bindingsById.get(assigned.bindingId);
				if (binding === undefined) continue;
				const identifierRange = range(assigned.identifier);
				const definition = binding.definitions.find(({ location }) => location.start.line === identifierRange.start.line && location.start.column === identifierRange.start.column && location.end.line === identifierRange.end.line && location.end.column === identifierRange.end.column);
				if (definition === undefined) continue;
				context.output.callResultFlows.push({
					callSiteId: site.callSiteId,
					bindingId: binding.bindingId,
					definitionLocation: definition.location
				});
			}
		};
		retainedArguments = (nodes) => {
			const retained = [];
			for (const [index, node] of nodes.entries()) {
				if (node === null) continue;
				retained.push({
					index,
					location: range(node),
					spread: t.isSpreadElement(node)
				});
			}
			return retained;
		};
		collectArgumentFlows = (site, node, context) => {
			const { callableById, output } = context;
			const retainedIndexes = new Set(site.arguments.map(({ index }) => index));
			let positionIsExact = true;
			for (const [index, argument] of node.arguments.entries()) {
				if (t.isSpreadElement(argument)) {
					positionIsExact = false;
					continue;
				}
				if (!positionIsExact || !retainedIndexes.has(index) || !t.isExpression(argument)) continue;
				for (const callableId of site.calleeCallableIds) {
					const callable = callableById.get(callableId);
					if (callable === undefined) continue;
					for (const parameter of cachedParameterBindings(callable, index, context)) {
						const definition = parameter.definitions.find(({ kind }) => kind === "parameter");
						if (definition === undefined) continue;
						output.argumentFlows.push({
							callSiteId: site.callSiteId,
							argumentIndex: index,
							argumentLocation: range(argument),
							callableId,
							parameterBindingId: parameter.bindingId,
							parameterLocation: definition.location
						});
					}
				}
			}
		};
		cachedParameterBindings = (callable, index, context) => {
			const key = `${callable.callableId}:${String(index)}`;
			const cached = context.parameterBindingCache.get(key);
			if (cached !== undefined) return cached;
			const bindings = parameterBindings(callable, index, context.state);
			context.parameterBindingCache.set(key, bindings);
			return bindings;
		};
		collectReturnFlows = (site, callableById, state, output) => {
			for (const callableId of site.calleeCallableIds) {
				const callable = callableById.get(callableId);
				if (callable === undefined) continue;
				for (const returnSite of callable.returnSites) {
					output.callReturnFlows.push({
						callSiteId: site.callSiteId,
						callableId,
						returnSiteId: returnSite.returnSiteId,
						returnLocation: returnSite.location
					});
				}
			}
		};
		collectCapture = (node, parent, owner, context) => {
			const { state, output } = context;
			if (!t.isIdentifier(node) || parent === null || owner === undefined || owner.bodyScopeId === null) return;
			if (semanticReferenceRole(node, parent) === null) return;
			const binding = resolveSemanticBindingState(state, node, node.name);
			if (binding === undefined || bindingIsWithinCallable(binding, owner.bodyScopeId, state)) return;
			output.closureCaptures.push({
				callableId: owner.callableId,
				bindingId: binding.bindingId,
				referenceLocation: range(node)
			});
		};
		collectDynamicProperty = (node, owner, state, output) => {
			if ((t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && semanticStaticPropertyKey(node.property, node.computed) === null) addFrontier({
				kind: "dynamic-property",
				callableId: owner?.callableId ?? null,
				location: range(node.property),
				reason: "Computed member property is not a static string or number."
			}, state, output);
			else if ((t.isObjectProperty(node) || t.isObjectMethod(node)) && node.computed && semanticStaticPropertyKey(node.key, true) === null) addFrontier({
				kind: "dynamic-property",
				callableId: owner?.callableId ?? null,
				location: range(node.key),
				reason: "Computed object property is not a static string or number."
			}, state, output);
		};
		collectDynamicScope = (node, owner, state, output) => {
			const reason = t.isWithStatement(node) ? "`with` introduces a runtime binding environment; names inside are not statically resolvable." : t.isCallExpression(node) && isUnshadowedGlobal(node.callee, state, "eval") ? "`eval` can declare bindings at runtime; names inside the evaluated source are not statically resolvable." : null;
			if (reason === null) return;
			addFrontier({
				kind: "dynamic-scope",
				callableId: owner?.callableId ?? null,
				location: range(node),
				reason
			}, state, output);
		};
		addFrontier = (frontier, state, output) => {
			output.frontiers.push(frontier);
		};
		bindingIsWithinCallable = (binding, bodyScopeId, state) => {
			let scope = state.scopesById.get(binding.scopeId);
			while (scope !== undefined) {
				if (scope.scopeId === bodyScopeId) return true;
				scope = scope.parentScopeId === null ? undefined : state.scopesById.get(scope.parentScopeId);
			}
			return false;
		};
		enclosingFunction = (stack) => stack.findLast(({ kind }) => kind !== "class");
		semanticCallSiteId = (node) => [
			"call",
			t.isNewExpression(node) ? "construct" : "call",
			String(node.start ?? -1),
			String(node.end ?? -1)
		].join(":");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticChildProcesses.js
var CHILD_PROCESS_METHODS, CHILD_LISTENER_METHODS, collectJavaScriptSemanticChildProcesses, collectSpawns, immutableSpawn, collectInteractions, childInteraction, killSignalName, classifyInteraction, childProcessMethod, resolveChildCandidates, spawnOptions, spawnArgvCount, objectHasProperty, stdioMode, objectProperty$1, objectBinding, spawnId;
function init_javascriptSemanticChildProcesses() {
	return (init_javascriptSemanticChildProcesses = __esmMin((() => {
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		CHILD_PROCESS_METHODS = [
			"spawn",
			"exec",
			"execFile",
			"fork"
		];
		CHILD_LISTENER_METHODS = [
			"on",
			"once",
			"addListener"
		];
		collectJavaScriptSemanticChildProcesses = (program, state, callables) => {
			const candidates = collectSpawns(program, state, callables);
			const childProcessSpawns = candidates.map((candidate) => immutableSpawn(candidate));
			return {
				childProcessSpawns,
				childProcessInteractions: collectInteractions(program, state, callables, candidates)
			};
		};
		collectSpawns = (program, state, callables) => {
			const output = [];
			const admittedCallables = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(admittedCallables);
			const ancestors = [];
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
						const method = childProcessMethod(node.callee, state);
						if (method !== null) {
							const projectedResultBindings = assignedSemanticResultBindings(node, ancestors, state);
							output.push({
								node,
								method,
								ownerCallableId: callableStack.callables.at(-1) ?? null,
								resultBindingId: scalarAssignedResultBinding(projectedResultBindings),
								projectedResultBindings: semanticProjectedBindingFacts(projectedResultBindings.filter(({ projectionPath }) => projectionPath.length > 0))
							});
						}
					}
					ancestors.push(node);
				},
				exit: (node) => {
					ancestors.pop();
					callableStack.exit(node);
				}
			});
			return output;
		};
		immutableSpawn = (candidate) => {
			const options = spawnOptions(candidate);
			const command = dataEffectLiteralString(candidate.node.arguments[0]);
			return {
				processId: spawnId(candidate),
				method: candidate.method,
				location: range(candidate.node),
				ownerCallableId: candidate.ownerCallableId,
				resultBindingId: candidate.resultBindingId,
				projectedResultBindings: candidate.projectedResultBindings,
				command,
				argvCount: spawnArgvCount(candidate),
				environmentSupplied: objectHasProperty(options, "env"),
				stdioMode: stdioMode(options),
				resolution: command === null ? "partial" : "complete"
			};
		};
		collectInteractions = (program, state, callables, spawns) => {
			const output = [];
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(callableIds);
			const spawnByNode = new WeakMap();
			const spawnsByBinding = new Map();
			for (const spawn of spawns) {
				spawnByNode.set(spawn.node, spawn);
				const ids = [...spawn.resultBindingId === null ? [] : [spawn.resultBindingId], ...spawn.projectedResultBindings.map(({ bindingId }) => bindingId)];
				for (const id of ids) {
					const existing = spawnsByBinding.get(id) ?? [];
					existing.push(spawn);
					spawnsByBinding.set(id, existing);
				}
			}
			const context = {
				state,
				spawnByNode,
				spawnsByBinding
			};
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
					const interaction = childInteraction(node, callableStack.callables.at(-1) ?? null, context);
					if (interaction === null) return;
					output.push(interaction);
				},
				exit: (node) => callableStack.exit(node)
			});
			return output;
		};
		childInteraction = (node, ownerCallableId, context) => {
			const { state, spawnByNode, spawnsByBinding } = context;
			const member = dataEffectMemberCallee(node);
			if (member === null) return null;
			const method = semanticStaticPropertyName(member.property, member.computed);
			const binding = objectBinding(member.object, state);
			const linked = resolveChildCandidates(member.object, binding, spawnByNode, spawnsByBinding);
			if (linked.length === 0) return null;
			const classification = classifyInteraction(method, node.arguments[0]);
			if (classification === null) return null;
			const { kind, interactionMethod, eventName } = classification;
			const listener = node.arguments[1];
			return {
				interactionId: `child:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
				kind,
				method: interactionMethod,
				location: range(node),
				ownerCallableId,
				processBindingId: binding?.bindingId ?? null,
				linkedProcessIds: linked.map((candidate) => spawnId(candidate)).sort(compareUnicodeCodePoints),
				eventName: kind === "listener" ? eventName : null,
				signalName: kind === "signal" ? killSignalName(node.arguments, state) : null,
				listenerLocation: kind === "listener" && t.isNode(listener) ? range(listener) : null,
				resolution: linked.length === 1 && !linked[0]?.projectedResultBindings.some(({ bindingId }) => bindingId === binding?.bindingId) ? "complete" : "partial"
			};
		};
		killSignalName = (args, state) => {
			const [signal] = args;
			if (signal === undefined) return "SIGTERM";
			const expression = unwrapJavaScriptExpression(signal).node;
			if (t.isUnaryExpression(expression, { operator: "void" }) || isUnshadowedGlobal(expression, state, "undefined")) return "SIGTERM";
			return dataEffectLiteralString(signal);
		};
		classifyInteraction = (method, argument) => {
			if (method === "kill") return {
				kind: "signal",
				interactionMethod: "kill",
				eventName: null
			};
			const listenerMethod = CHILD_LISTENER_METHODS.find((candidate) => candidate === method);
			const eventName = dataEffectLiteralString(argument);
			return listenerMethod !== undefined && (eventName === "exit" || eventName === "error") ? {
				kind: "listener",
				interactionMethod: listenerMethod,
				eventName
			} : null;
		};
		childProcessMethod = (callee, state) => {
			const method = builtinDataEffectMethod(callee, state, ["child_process", "node:child_process"]);
			return CHILD_PROCESS_METHODS.find((candidate) => candidate === method) ?? null;
		};
		resolveChildCandidates = (node, binding, spawnByNode, spawnsByBinding) => {
			const direct = spawnByNode.get(node);
			if (direct !== undefined) return [direct];
			return binding === undefined ? [] : spawnsByBinding.get(binding.bindingId) ?? [];
		};
		spawnOptions = (candidate) => {
			const args = candidate.node.arguments;
			const value = candidate.method === "exec" ? args[1] : t.isObjectExpression(args[1]) ? args[1] : args[2];
			return t.isObjectExpression(value) ? value : null;
		};
		spawnArgvCount = (candidate) => {
			if (candidate.method === "exec") return null;
			const args = candidate.node.arguments[1];
			return t.isArrayExpression(args) && !args.elements.some((element) => t.isSpreadElement(element)) ? args.elements.length : null;
		};
		objectHasProperty = (object, name) => objectProperty$1(object, name) !== null;
		stdioMode = (options) => {
			const property = objectProperty$1(options, "stdio");
			if (property === null || !t.isObjectProperty(property)) return "default";
			if (t.isStringLiteral(property.value)) return property.value.value;
			if (t.isArrayExpression(property.value)) return "array";
			return "dynamic";
		};
		objectProperty$1 = (object, name) => object?.properties.find((property) => (t.isObjectMethod(property) || t.isObjectProperty(property)) && semanticStaticPropertyName(property.key, property.computed) === name) ?? null;
		objectBinding = (node, state) => t.isIdentifier(node) ? resolveSemanticBindingState(state, node, node.name) : undefined;
		spawnId = (candidate) => `child:spawn:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticFingerprints.js
/** Build bounded rename- and formatting-resistant components per callable, yielding between callables. */
function* collectJavaScriptSemanticFingerprintsSteps(input) {
	const { state, callables, calls, promises, events, timers, childProcessSpawns, childProcessInteractions, requestOperations, resourceOperations, parserPartial } = input;
	const callSitesByCaller = groupByOwner(calls.callSites, ({ callerCallableId }) => callerCallableId);
	const captureCountByCallable = countByOwner(calls.closureCaptures, ({ callableId }) => callableId);
	const promiseEffectsByOwner = groupByOwner(promises, ownerId);
	const eventEffectsByOwner = groupByOwner(events, ownerId);
	const timerEffectsByOwner = groupByOwner(timers, ownerId);
	const childProcessEffectsByOwner = groupByOwner([...childProcessSpawns, ...childProcessInteractions], ownerId);
	const networkEffectsByOwner = groupByOwner(requestOperations, ownerId);
	const resourceEffectsByOwner = groupByOwner(resourceOperations, ownerId);
	const fingerprints = [];
	for (const callable of callables) {
		if (callable.kind === "class") continue;
		const node = state.callableNodesById.get(callable.callableId);
		if (node === undefined) continue;
		yield;
		const syntax = yield* fingerprintSyntaxSteps(node);
		const promiseEffects = promiseEffectsByOwner.get(callable.callableId) ?? [];
		const eventEffects = eventEffectsByOwner.get(callable.callableId) ?? [];
		const timerEffects = timerEffectsByOwner.get(callable.callableId) ?? [];
		const childProcessEffects = childProcessEffectsByOwner.get(callable.callableId) ?? [];
		const networkEffects = networkEffectsByOwner.get(callable.callableId) ?? [];
		const resourceEffects = resourceEffectsByOwner.get(callable.callableId) ?? [];
		fingerprints.push({
			callableId: callable.callableId,
			status: parserPartial || callable.returnCoverage.status !== "complete" ? "partial" : "complete",
			components: {
				parameterArity: callableParameterArity(node),
				normalizedAstSha256: digest$2(syntax.normalizedTokens),
				controlFlowSha256: digest$2(syntax.controlFlowTokens),
				relationShapeSha256: digest$2(relationShape(callable, callSitesByCaller.get(callable.callableId) ?? [], captureCountByCallable.get(callable.callableId) ?? 0, promiseEffects)),
				literalSetSha256: digest$2([...new Set(syntax.literals)].sort(compareUnicodeCodePoints)),
				effects: [
					...isAsyncCallable(node) ? ["async"] : [],
					...childProcessEffects.length > 0 ? ["child-process"] : [],
					...eventEffects.length > 0 ? ["event"] : [],
					...networkEffects.length > 0 ? ["network"] : [],
					...promiseEffects.length > 0 ? ["promise"] : [],
					...resourceEffects.length > 0 ? ["resource"] : [],
					...timerEffects.length > 0 ? ["timer"] : []
				]
			},
			limitations: ["The fingerprint is a static candidate and does not prove behavioral equivalence.", ...parserPartial ? ["Incomplete semantic recovery makes this fingerprint partial."] : []]
		});
	}
	return fingerprints;
}
function* fingerprintSyntaxSteps(root) {
	const normalizedTokens = [];
	const controlFlowTokens = [];
	const literals = [];
	yield* traverseJavaScriptAstSteps(root, {
		skip: (node) => semanticCallableIdForNode(node) !== null,
		enter: (node, parent) => {
			normalizedTokens.push(normalizedNodeToken(node, parent));
			const control = controlFlowToken(node);
			if (control !== null) controlFlowTokens.push(control);
			const literal = semanticLiteral(node);
			if (literal !== null) literals.push(literal);
		}
	});
	return {
		normalizedTokens,
		controlFlowTokens,
		literals
	};
}
var ownerId, groupByOwner, countByOwner, normalizedNodeToken, primitiveAttribute, propertyIdentity, controlFlowToken, semanticLiteral, relationShape, callableParameterArity, isAsyncCallable, digest$2;
function init_javascriptSemanticFingerprints() {
	return (init_javascriptSemanticFingerprints = __esmMin((() => {
		init_javascriptAstValues();
		init_unicodeCodePointOrder();
		init_javascriptSemanticProjection();
		init_javascriptSemanticTraversal();
		ownerId = (value) => value.ownerCallableId;
		groupByOwner = (values, getOwner) => {
			const grouped = new Map();
			for (const value of values) {
				const owner = getOwner(value);
				const ownedValues = grouped.get(owner);
				if (ownedValues === undefined) grouped.set(owner, [value]);
				else ownedValues.push(value);
			}
			return grouped;
		};
		countByOwner = (values, getOwner) => {
			const counts = new Map();
			for (const value of values) {
				const owner = getOwner(value);
				counts.set(owner, (counts.get(owner) ?? 0) + 1);
			}
			return counts;
		};
		normalizedNodeToken = (node, parent) => {
			if (t.isIdentifier(node)) return propertyIdentity(node, parent) ? `property:${node.name}` : "identifier";
			if (t.isStringLiteral(node)) return propertyIdentity(node, parent) ? `property:${node.value}` : "string-literal";
			const attributes = [
				primitiveAttribute(node, "operator"),
				primitiveAttribute(node, "kind"),
				primitiveAttribute(node, "computed"),
				primitiveAttribute(node, "optional"),
				primitiveAttribute(node, "async"),
				primitiveAttribute(node, "generator"),
				primitiveAttribute(node, "delegate"),
				primitiveAttribute(node, "prefix")
			].filter((value) => value !== null);
			return [node.type, ...attributes].join(":");
		};
		primitiveAttribute = (node, key) => {
			const value = Reflect.get(node, key);
			return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? `${key}=${String(value)}` : null;
		};
		propertyIdentity = (node, parent) => {
			if (parent === null) return false;
			if ((t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) && parent.property === node) return !parent.computed || t.isStringLiteral(node);
			if ((t.isObjectProperty(parent) || t.isObjectMethod(parent) || t.isClassMethod(parent) || t.isClassProperty(parent)) && parent.key === node) return !parent.computed || t.isStringLiteral(node);
			return false;
		};
		controlFlowToken = (node) => {
			if (!t.isIfStatement(node) && !t.isConditionalExpression(node) && !t.isSwitchStatement(node) && !t.isSwitchCase(node) && !t.isLoop(node) && !t.isTryStatement(node) && !t.isCatchClause(node) && !t.isReturnStatement(node) && !t.isThrowStatement(node) && !t.isAwaitExpression(node) && !t.isYieldExpression(node) && !t.isLogicalExpression(node)) return null;
			const operator = primitiveAttribute(node, "operator");
			return operator === null ? node.type : `${node.type}:${operator}`;
		};
		semanticLiteral = (node) => {
			if (t.isDirectiveLiteral(node)) return `directive:${node.value}`;
			if (t.isStringLiteral(node)) return `string:${node.value}`;
			if (t.isNumericLiteral(node)) return `number:${String(node.value)}`;
			if (t.isBooleanLiteral(node)) return `boolean:${String(node.value)}`;
			if (t.isNullLiteral(node)) return "null";
			if (t.isBigIntLiteral(node)) return `bigint:${node.value}`;
			if (t.isRegExpLiteral(node)) return `regexp:${node.pattern}/${node.flags}`;
			if (t.isTemplateElement(node)) return `template:${node.value.cooked ?? node.value.raw}`;
			return null;
		};
		relationShape = (callable, callSites, captureCount, promises) => [
			`returns:${String(callable.returnSites.length)}:${callable.returnCoverage.status}`,
			...callSites.map(({ kind, resolution, arguments: args, calleeCallableIds }) => `call:${kind}:${resolution}:${String(args.length)}:${String(calleeCallableIds.length)}`),
			`captures:${String(captureCount)}`,
			...promises.map(({ kind, method, ownership, sourceResolution }) => `promise:${kind}:${method}:${ownership}:${sourceResolution}`)
		];
		callableParameterArity = (node) => t.isFunction(node) ? runtimeFunctionParameters(node).length : 0;
		isAsyncCallable = (node) => t.isFunction(node) && node.async;
		digest$2 = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDataEffects.js
var collectJavaScriptSemanticDataEffects, collectConfigurations, configurationDetails, processConfigurationMember, isArrayIndexKey, collectDefaults, collectRequests, collectResponseConsumers, collectBoundaries, boundaryDetails, requestMethod, requestFields, requestEndpoint;
function init_javascriptSemanticDataEffects() {
	return (init_javascriptSemanticDataEffects = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticDataEffectHelpers();
		init_javascriptStaticAnalysisHelpers();
		collectJavaScriptSemanticDataEffects = (program, state, callables) => {
			const context = {
				state,
				callableIds: new Set(callables.map(({ callableId }) => callableId)),
				callableStack: [],
				ancestors: []
			};
			const configuration = collectConfigurations(program, context);
			const requests = collectRequests(program, context);
			return {
				configurationOperations: [...configuration.map(({ operation }) => operation), ...collectDefaults(program, context, configuration)],
				requestOperations: [...requests.map(({ operation }) => operation), ...collectResponseConsumers(program, context, requests)],
				boundaryOperations: collectBoundaries(program, context)
			};
		};
		collectConfigurations = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				const details = configurationDetails(node, context);
				if (details === null) return;
				const operation = {
					configId: `config:${details.kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: details.kind,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context),
					key: details.key,
					sourceConfigId: null,
					value: null,
					resolution: details.resolution
				};
				output.push({
					node,
					operation
				});
			});
			return output;
		};
		configurationDetails = (node, context) => {
			if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) {
				const processMember = processConfigurationMember(node, context.state);
				if (processMember !== null) return processMember;
			}
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return null;
			const fileMethod = builtinDataEffectMethod(node.callee, context.state, ["fs", "node:fs"]);
			return fileMethod === "readFile" || fileMethod === "readFileSync" ? {
				kind: "file",
				key: dataEffectLiteralString(node.arguments[0]),
				resolution: dataEffectLiteralString(node.arguments[0]) === null ? "partial" : "complete"
			} : null;
		};
		processConfigurationMember = (node, state) => {
			const object = node.object;
			if (!t.isMemberExpression(object) && !t.isOptionalMemberExpression(object)) return null;
			const family = semanticStaticPropertyName(object.property, object.computed);
			if (family !== "env" && family !== "argv") return null;
			const key = semanticStaticPropertyKey(node.property, node.computed);
			if (family === "argv" && key !== null && !isArrayIndexKey(key)) return null;
			if (!isSemanticProcessObject(object.object, state, family, key)) return null;
			return {
				kind: family === "env" ? "environment" : "argv",
				key,
				resolution: key === null ? "partial" : "complete"
			};
		};
		isArrayIndexKey = (key) => {
			if (!/^(?:0|[1-9][0-9]*)$/u.test(key)) return false;
			const index = Number(key);
			return Number.isSafeInteger(index) && index < 2 ** 32 - 1;
		};
		collectDefaults = (program, context, configurations) => {
			const output = [];
			const configurationsByNode = new Map(configurations.map((candidate) => [candidate.node, candidate]));
			traverseDataEffects(program, context, (node) => {
				if (!t.isLogicalExpression(node) || node.operator !== "??" && node.operator !== "||") return;
				const source = unwrapJavaScriptExpression(node.left).node;
				const candidate = configurationsByNode.get(source);
				if (candidate === undefined) return;
				output.push({
					configId: `config:default:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: "default",
					location: range(node.right),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context),
					key: candidate.operation.key,
					sourceConfigId: candidate.operation.configId,
					value: dataEffectPrimitive(node.right),
					resolution: dataEffectPrimitive(node.right) === null ? "partial" : "complete"
				});
			});
			return output;
		};
		collectRequests = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node)) return;
				const method = requestMethod(node, context.state);
				if (method === null) return;
				const endpoint = requestEndpoint(node);
				output.push({
					node,
					operation: {
						requestId: `request:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
						kind: "request",
						method,
						location: range(node),
						ownerCallableId: context.callableStack.at(-1) ?? null,
						resultBindingId: outerDataEffectBinding(node, context),
						projectedResultBindings: semanticProjectedBindingFacts(assignedSemanticResultBindings(node, context.ancestors, context.state).filter(({ projectionPath }) => projectionPath.length > 0)),
						linkedRequestIds: [],
						endpoint,
						fields: requestFields(node, method, context.state),
						resolution: endpoint === null ? "partial" : "complete"
					}
				});
			});
			return output;
		};
		collectResponseConsumers = (program, context, requests) => {
			const requestsByBinding = new Map();
			for (const request of requests) {
				const bindingIds = [...request.operation.resultBindingId === null ? [] : [request.operation.resultBindingId], ...request.operation.projectedResultBindings.map(({ bindingId }) => bindingId)];
				for (const bindingId of bindingIds) {
					const existing = requestsByBinding.get(bindingId) ?? [];
					existing.push(request);
					requestsByBinding.set(bindingId, existing);
				}
			}
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const member = dataEffectMemberCallee(node);
				if (member === null || !t.isIdentifier(member.object)) return;
				const method = semanticStaticPropertyName(member.property, member.computed);
				if (method !== "json" && method !== "text" && method !== "arrayBuffer") return;
				const binding = resolveSemanticBindingState(context.state, member.object, member.object.name);
				const linked = binding === undefined ? [] : requestsByBinding.get(binding.bindingId) ?? [];
				if (linked.length === 0) return;
				output.push({
					requestId: `response:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: "response-consumer",
					method,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context),
					projectedResultBindings: semanticProjectedBindingFacts(assignedSemanticResultBindings(node, context.ancestors, context.state).filter(({ projectionPath }) => projectionPath.length > 0)),
					linkedRequestIds: linked.map(({ operation }) => operation.requestId).sort(compareUnicodeCodePoints),
					endpoint: null,
					fields: [],
					resolution: linked.length === 1 && !linked[0]?.operation.projectedResultBindings.some(({ bindingId }) => bindingId === binding?.bindingId) ? "complete" : "partial"
				});
			});
			return output;
		};
		collectBoundaries = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const details = boundaryDetails(node, context.state);
				if (details === null) return;
				output.push({
					boundaryId: `boundary:${details.kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: details.kind,
					method: details.method,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					sourceBindingId: dataEffectArgumentBindingId(node.arguments[0], context.state),
					resultBindingId: outerDataEffectBinding(node, context),
					resolution: details.resolution
				});
			});
			return output;
		};
		boundaryDetails = (node, state) => {
			if (t.isIdentifier(node.callee)) {
				const name = node.callee.name;
				const unbound = resolveSemanticBindingState(state, node.callee, name) === undefined && !semanticResolutionBlocked(state, node.callee, name);
				if (unbound && [
					"String",
					"Number",
					"Boolean",
					"parseInt",
					"parseFloat"
				].includes(name)) return {
					kind: "coerce",
					method: name,
					resolution: "complete"
				};
			}
			const member = dataEffectMemberCallee(node);
			if (member === null) return null;
			const method = semanticStaticPropertyName(member.property, member.computed);
			if (method === "parse" && t.isIdentifier(member.object, { name: "JSON" }) && resolveSemanticBindingState(state, member.object, "JSON") === undefined && !semanticResolutionBlocked(state, member.object, "JSON")) return {
				kind: "parse",
				method: "JSON.parse",
				resolution: "complete"
			};
			if (method === "parse" || method === "safeParse") return {
				kind: "parse",
				method,
				resolution: "partial"
			};
			if (method === "validate" || method === "assert" || method === "is") return {
				kind: "validate",
				method,
				resolution: "partial"
			};
			return null;
		};
		requestMethod = (node, state) => {
			if (t.isIdentifier(node.callee)) {
				const name = node.callee.name;
				const unbound = resolveSemanticBindingState(state, node.callee, name) === undefined && !semanticResolutionBlocked(state, node.callee, name);
				if (!t.isNewExpression(node) && unbound && name === "fetch") return "fetch";
				if (t.isNewExpression(node) && unbound && name === "WebSocket") return "WebSocket";
			}
			const method = builtinDataEffectMethod(node.callee, state, [
				"http",
				"https",
				"node:http",
				"node:https"
			]);
			return method === "request" || method === "get" ? method : null;
		};
		requestFields = (node, method, state) => {
			const candidate = method === "fetch" || method === "WebSocket" ? node.arguments[1] : t.isObjectExpression(node.arguments[0]) ? node.arguments[0] : node.arguments[1];
			if (!t.isObjectExpression(candidate)) return [];
			return candidate.properties.flatMap((property) => {
				if (!t.isObjectProperty(property)) return [];
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) return [];
				return [{
					name,
					sourceBindingId: t.isIdentifier(property.value) ? resolveSemanticBindingState(state, property.value, property.value.name)?.bindingId ?? null : null
				}];
			});
		};
		requestEndpoint = (node) => t.isObjectExpression(node.arguments[0]) ? null : dataEffectLiteralString(node.arguments[0]);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticPromises.js
var collectJavaScriptSemanticPromises, collectCandidates, promiseCandidateDetails, isUnshadowedGlobalPromise, isPromiseProducer, semanticPromiseId, promiseOwnership, ownershipAtAncestor, isUnmodeledCall, assignedPromiseBinding, returnedPromiseOwnership, outerConsumesCandidate, emptyOwnership, indexReturnSites, createReturnSiteLookup, indexCallablesById, returnSiteKey, promiseSources, aggregateSources, resolvePromiseExpression, promiseResolutionContext, combinePromiseResolutions, completePromise, unresolvedPromise, isObviouslyNonPromise;
function init_javascriptSemanticPromises() {
	return (init_javascriptSemanticPromises = __esmMin((() => {
		init_javascriptSemanticProjection();
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_unicodeCodePointOrder();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticDataEffectHelpers();
		collectJavaScriptSemanticPromises = (program, state, callables) => {
			const candidates = collectCandidates(program, state, callables);
			const returnSiteIdFor = createReturnSiteLookup(callables);
			const candidateByNode = new WeakMap();
			for (const candidate of candidates) candidateByNode.set(candidate.node, candidate);
			return candidates.map((candidate) => {
				const ownership = promiseOwnership(candidate, candidateByNode, state, returnSiteIdFor);
				const sources = promiseSources(candidate, candidateByNode, state);
				return {
					promiseId: candidate.promiseId,
					kind: candidate.kind,
					method: candidate.method,
					location: range(candidate.node),
					ownerCallableId: candidate.ownerCallableId,
					...ownership,
					sourcePromiseIds: [...new Set(sources.promiseIds)].sort(compareUnicodeCodePoints),
					sourceResolution: sources.status
				};
			});
		};
		collectCandidates = (program, state, callables) => {
			const output = [];
			const admittedCallables = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(admittedCallables);
			const ancestors = [];
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					const details = promiseCandidateDetails(node, state);
					if (details !== null) {
						output.push({
							node,
							...details,
							promiseId: semanticPromiseId(details.kind, node),
							ownerCallableId: callableStack.callables.at(-1) ?? null,
							ancestors: [...ancestors]
						});
					}
					ancestors.push(node);
				},
				exit: (node) => {
					ancestors.pop();
					callableStack.exit(node);
				}
			});
			return output;
		};
		promiseCandidateDetails = (node, state) => {
			if (t.isNewExpression(node) && t.isIdentifier(node.callee, { name: "Promise" }) && isUnshadowedGlobalPromise(node.callee, state)) return {
				kind: "constructor",
				method: "new"
			};
			if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) {
				const member = dataEffectMemberCallee(node);
				if (member === null) return null;
				const method = semanticStaticPropertyName(member.property, member.computed);
				if (t.isIdentifier(member.object, { name: "Promise" }) && isUnshadowedGlobalPromise(member.object, state)) {
					if (method === "all" || method === "allSettled") return {
						kind: "aggregate",
						method
					};
					if (method === "resolve" || method === "reject") return {
						kind: "static",
						method
					};
				}
				if (method === "then" || method === "catch" || method === "finally") return {
					kind: "chain",
					method
				};
			}
			if (t.isAwaitExpression(node) && !isPromiseProducer(node.argument, state)) return {
				kind: "awaited-expression",
				method: "await"
			};
			return null;
		};
		isUnshadowedGlobalPromise = (node, state) => resolveSemanticBindingState(state, node, "Promise") === undefined && !semanticResolutionBlocked(state, node, "Promise");
		isPromiseProducer = (node, state) => promiseCandidateDetails(unwrapJavaScriptExpression(node).node, state) !== null;
		semanticPromiseId = (kind, node) => `promise:${kind}:${String(node.start ?? -1)}:${String(node.end ?? -1)}`;
		promiseOwnership = (candidate, candidateByNode, state, returnSiteIdFor) => {
			if (candidate.kind === "awaited-expression") return emptyOwnership("awaited");
			const context = {
				candidate,
				candidateByNode,
				state,
				returnSiteIdFor
			};
			for (let index = candidate.ancestors.length - 1; index >= 0; index -= 1) {
				const ancestor = candidate.ancestors[index];
				if (ancestor === undefined) continue;
				const ownership = ownershipAtAncestor(ancestor, context);
				if (ownership === "boundary") break;
				if (ownership !== null) return ownership;
			}
			return emptyOwnership("unknown");
		};
		ownershipAtAncestor = (ancestor, context) => {
			const { candidate, candidateByNode, state, returnSiteIdFor } = context;
			if (t.isAwaitExpression(ancestor)) return unwrapJavaScriptExpression(ancestor.argument).node === candidate.node ? emptyOwnership("awaited") : "boundary";
			const outer = candidateByNode.get(ancestor);
			if (outer !== undefined && outer.ownerCallableId === candidate.ownerCallableId && outerConsumesCandidate(outer, candidate)) return outer.kind === "chain" ? emptyOwnership("chained") : emptyOwnership("aggregated");
			if (isUnmodeledCall(ancestor, outer)) return "boundary";
			const assigned = assignedPromiseBinding(ancestor, candidate.node, state);
			if (assigned !== undefined) return {
				ownership: "assigned",
				ownerBindingId: assigned,
				returnSiteId: null
			};
			if (t.isReturnStatement(ancestor)) {
				if (ancestor.argument == null || unwrapJavaScriptExpression(ancestor.argument).node !== candidate.node) return "boundary";
				return returnedPromiseOwnership(candidate.ownerCallableId, range(ancestor), returnSiteIdFor);
			}
			if (t.isExpressionStatement(ancestor)) return unwrapJavaScriptExpression(ancestor.expression).node === candidate.node ? emptyOwnership("detached") : "boundary";
			const callableId = semanticCallableIdForNode(ancestor);
			if (callableId === null || callableId !== candidate.ownerCallableId) return null;
			return t.isArrowFunctionExpression(ancestor) && unwrapJavaScriptExpression(ancestor.body).node === candidate.node ? returnedPromiseOwnership(candidate.ownerCallableId, range(ancestor.body), returnSiteIdFor) : "boundary";
		};
		isUnmodeledCall = (node, candidate) => candidate === undefined && (t.isCallExpression(node) || t.isOptionalCallExpression(node) || t.isNewExpression(node));
		assignedPromiseBinding = (ancestor, candidate, state) => {
			if (!t.isVariableDeclarator(ancestor) && !t.isAssignmentExpression(ancestor)) return undefined;
			const source = t.isVariableDeclarator(ancestor) ? ancestor.init : ancestor.right;
			if (source == null) return undefined;
			if (unwrapJavaScriptExpression(source).node !== candidate) return undefined;
			return scalarAssignedResultBinding(assignedSemanticResultBindings(source, [ancestor], state));
		};
		returnedPromiseOwnership = (callableId, location, returnSiteIdFor) => ({
			ownership: "returned",
			ownerBindingId: null,
			returnSiteId: returnSiteIdFor(callableId, location)
		});
		outerConsumesCandidate = (outer, candidate) => {
			if (outer.kind === "chain" && (t.isCallExpression(outer.node) || t.isOptionalCallExpression(outer.node))) {
				const member = dataEffectMemberCallee(outer.node);
				return member !== null && unwrapJavaScriptExpression(member.object).node === candidate.node;
			}
			if (outer.kind === "aggregate" && (t.isCallExpression(outer.node) || t.isOptionalCallExpression(outer.node))) {
				const input = outer.node.arguments[0];
				return t.isArrayExpression(input) && input.elements.some((element) => element !== null && !t.isSpreadElement(element) && unwrapJavaScriptExpression(element).node === candidate.node);
			}
			return false;
		};
		emptyOwnership = (ownership) => ({
			ownership,
			ownerBindingId: null,
			returnSiteId: null
		});
		indexReturnSites = (callable) => {
			const output = new Map();
			for (const site of callable.returnSites) {
				const key = returnSiteKey(site.location);
				if (!output.has(key)) output.set(key, site.returnSiteId);
			}
			return output;
		};
		createReturnSiteLookup = (callables) => {
			let callablesById;
			let returnSiteIdsByCallable;
			return (callableId, location) => {
				if (callableId === null) return null;
				callablesById ??= indexCallablesById(callables);
				const callable = callablesById.get(callableId);
				if (callable === undefined) return null;
				returnSiteIdsByCallable ??= new Map();
				let returnSiteIds = returnSiteIdsByCallable.get(callableId);
				if (returnSiteIds === undefined) {
					returnSiteIds = indexReturnSites(callable);
					returnSiteIdsByCallable.set(callableId, returnSiteIds);
				}
				return returnSiteIds.get(returnSiteKey(location)) ?? null;
			};
		};
		indexCallablesById = (callables) => {
			const output = new Map();
			for (const callable of callables) {
				if (output.has(callable.callableId)) continue;
				output.set(callable.callableId, callable);
			}
			return output;
		};
		returnSiteKey = (location) => `${location.start.line}:${location.start.column}:${location.end.line}:${location.end.column}`;
		promiseSources = (candidate, candidateByNode, state) => {
			if (candidate.kind === "chain") {
				const member = t.isCallExpression(candidate.node) || t.isOptionalCallExpression(candidate.node) ? dataEffectMemberCallee(candidate.node) : null;
				return member === null ? unresolvedPromise() : resolvePromiseExpression(member.object, promiseResolutionContext(candidate, candidateByNode, state));
			}
			if (candidate.kind === "aggregate") return aggregateSources(candidate, candidateByNode, state);
			if (candidate.kind === "awaited-expression") return t.isAwaitExpression(candidate.node) ? resolvePromiseExpression(candidate.node.argument, promiseResolutionContext(candidate, candidateByNode, state)) : unresolvedPromise();
			return {
				promiseIds: [],
				status: "complete"
			};
		};
		aggregateSources = (candidate, candidateByNode, state) => {
			if (!t.isCallExpression(candidate.node) && !t.isOptionalCallExpression(candidate.node)) return unresolvedPromise();
			const input = candidate.node.arguments[0];
			if (!t.isArrayExpression(input)) return unresolvedPromise();
			const resolutions = input.elements.map((element) => {
				if (element === null) return completePromise();
				if (t.isSpreadElement(element)) return unresolvedPromise();
				if (isObviouslyNonPromise(element)) return completePromise();
				return resolvePromiseExpression(element, promiseResolutionContext(candidate, candidateByNode, state));
			});
			return combinePromiseResolutions(resolutions);
		};
		resolvePromiseExpression = (rawNode, context) => {
			const { current, candidateByNode, state, seenBindings } = context;
			const node = unwrapJavaScriptExpression(rawNode).node;
			const direct = candidateByNode.get(node);
			if (direct !== undefined && direct.promiseId !== current.promiseId) return {
				promiseIds: [direct.promiseId],
				status: "complete"
			};
			if (!t.isIdentifier(node)) return unresolvedPromise();
			const binding = resolveSemanticBindingState(state, node, node.name);
			if (binding === undefined || binding.mutable || binding.initializers.length !== 1 || seenBindings.has(binding.bindingId)) return unresolvedPromise();
			const initializer = binding.initializers[0];
			if (initializer === undefined || initializer.projection.length > 0) return unresolvedPromise();
			const nestedSeen = new Set(seenBindings);
			nestedSeen.add(binding.bindingId);
			return resolvePromiseExpression(initializer.node, {
				...context,
				seenBindings: nestedSeen
			});
		};
		promiseResolutionContext = (current, candidateByNode, state) => ({
			current,
			candidateByNode,
			state,
			seenBindings: new Set()
		});
		combinePromiseResolutions = (resolutions) => ({
			promiseIds: resolutions.flatMap(({ promiseIds }) => promiseIds),
			status: resolutions.some(({ status }) => status === "unresolved") ? resolutions.some(({ status }) => status === "complete") ? "partial" : "unresolved" : resolutions.some(({ status }) => status === "partial") ? "partial" : "complete"
		});
		completePromise = () => ({
			promiseIds: [],
			status: "complete"
		});
		unresolvedPromise = () => ({
			promiseIds: [],
			status: "unresolved"
		});
		isObviouslyNonPromise = (node) => t.isLiteral(node) || t.isObjectExpression(node) || t.isFunction(node) || t.isClassExpression(node);
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticObjects.js
var collectJavaScriptSemanticObjects, collectMember, collectDestructuring, addObjectOperation, expressionObjectIdentity, bindingIdentifier;
function init_javascriptSemanticObjects() {
	return (init_javascriptSemanticObjects = __esmMin((() => {
		init_javascriptSemanticCallableStack();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptStaticAnalysisHelpers();
		collectJavaScriptSemanticObjects = (program, state, callables) => {
			const output = [];
			const callableIds = new Set(callables.map(({ callableId }) => callableId));
			const callableStack = createSemanticCallableIdStack(callableIds);
			const context = {
				state,
				output,
				writeTargets: new Map()
			};
			traverseJavaScriptAst(program, {
				enter: (node, parent) => {
					callableStack.enter(node, parent);
					const ownerCallableId = callableStack.callables.at(-1) ?? null;
					const writeTarget = semanticWriteSiteTarget(node);
					if (writeTarget !== null) {
						for (const leaf of semanticWriteTargets(writeTarget)) if (!t.isIdentifier(leaf)) context.writeTargets.set(leaf, node);
					}
					if (t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) collectMember(node, parent, ownerCallableId, context);
					else if (t.isSpreadElement(node) && parent !== null && t.isObjectExpression(parent)) {
						const identity = expressionObjectIdentity(node.argument, state);
						addObjectOperation({
							node,
							kind: "spread",
							ownerCallableId,
							objectBindingId: identity.bindingId,
							targetBindingId: null,
							propertyPath: identity.path
						}, state, output);
					} else if (t.isVariableDeclarator(node) && (t.isObjectPattern(node.id) || t.isArrayPattern(node.id))) collectDestructuring(node, ownerCallableId, state, output);
				},
				exit: (node) => callableStack.exit(node)
			});
			return output;
		};
		collectMember = (node, parent, ownerCallableId, context) => {
			const { state, output } = context;
			if ((t.isMemberExpression(parent) || t.isOptionalMemberExpression(parent)) && parent.object === node) return;
			const identity = expressionObjectIdentity(node, state);
			const writeSite = context.writeTargets.get(node);
			context.writeTargets.delete(node);
			const write = writeSite !== undefined;
			const readsBeforeWrite = writeSite !== undefined && semanticWriteSiteReadsFirst(writeSite);
			if (readsBeforeWrite) addObjectOperation({
				node,
				kind: "read",
				ownerCallableId,
				objectBindingId: identity.bindingId,
				targetBindingId: null,
				propertyPath: identity.path
			}, state, output);
			addObjectOperation({
				node,
				kind: write ? "write" : "read",
				ownerCallableId,
				objectBindingId: identity.bindingId,
				targetBindingId: null,
				propertyPath: identity.path
			}, state, output);
		};
		collectDestructuring = (node, ownerCallableId, state, output) => {
			const source = expressionObjectIdentity(node.init, state);
			const visit = (pattern, path) => {
				if (t.isObjectPattern(pattern)) {
					for (const property of pattern.properties) {
						if (!t.isObjectProperty(property)) continue;
						const name = semanticStaticPropertyKey(property.key, property.computed);
						if (name !== null) visit(property.value, [...path, name]);
					}
					return;
				}
				if (t.isArrayPattern(pattern)) {
					pattern.elements.forEach((element, index) => {
						if (element !== null && !t.isRestElement(element)) visit(element, [...path, String(index)]);
					});
					return;
				}
				const target = bindingIdentifier(pattern);
				if (target === null) return;
				addObjectOperation({
					node: pattern,
					kind: "destructure",
					ownerCallableId,
					objectBindingId: source.bindingId,
					targetBindingId: resolveSemanticBindingState(state, target, target.name)?.bindingId ?? null,
					propertyPath: source.path === null ? null : [...source.path, ...path]
				}, state, output);
			};
			visit(node.id, []);
		};
		addObjectOperation = (input, state, output) => {
			output.push({
				objectOperationId: [
					"object",
					input.kind,
					String(input.node.start ?? -1),
					String(input.node.end ?? -1)
				].join(":"),
				kind: input.kind,
				location: range(input.node),
				ownerCallableId: input.ownerCallableId,
				objectBindingId: input.objectBindingId,
				targetBindingId: input.targetBindingId,
				propertyPath: input.propertyPath,
				resolution: input.objectBindingId === null || input.propertyPath === null || input.kind === "destructure" && input.targetBindingId === null ? "partial" : "complete"
			});
		};
		expressionObjectIdentity = (node, state) => {
			const path = [];
			let current = node;
			let staticPath = true;
			while (current !== null && current !== undefined) {
				current = unwrapJavaScriptExpression(current).node;
				if (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
					const name = semanticStaticPropertyKey(current.property, current.computed);
					if (name === null) staticPath = false;
					else path.push(name);
					current = current.object;
				} else break;
			}
			return {
				bindingId: t.isIdentifier(current) ? resolveSemanticBindingState(state, current, current.name)?.bindingId ?? null : null,
				path: staticPath ? path.reverse() : null
			};
		};
		bindingIdentifier = (node) => {
			if (t.isIdentifier(node)) return node;
			if (t.isAssignmentPattern(node) && t.isIdentifier(node.left)) return node.left;
			return null;
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticResources.js
var RELEASE_METHODS, collectJavaScriptSemanticResources, collectAcquisitions, collectReleases, immutableAcquisition, acquisitionMethod, resourceCandidateId;
function init_javascriptSemanticResources() {
	return (init_javascriptSemanticResources = __esmMin((() => {
		init_javascriptBuiltinResourceMethods();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticDataEffectHelpers();
		init_javascriptStaticAnalysisHelpers();
		RELEASE_METHODS = [
			"close",
			"destroy",
			"end"
		];
		collectJavaScriptSemanticResources = (program, state, callables) => {
			const context = {
				state,
				callableIds: new Set(callables.map(({ callableId }) => callableId)),
				callableStack: [],
				ancestors: []
			};
			const acquisitions = collectAcquisitions(program, context);
			return [...acquisitions.map(immutableAcquisition), ...collectReleases(program, context, acquisitions)];
		};
		collectAcquisitions = (program, context) => {
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const method = acquisitionMethod(node.callee, context.state);
				if (method === null) return;
				output.push({
					node,
					method,
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: outerDataEffectBinding(node, context)
				});
			});
			return output;
		};
		collectReleases = (program, context, acquisitions) => {
			const byBinding = new Map();
			for (const acquisition of acquisitions) {
				if (acquisition.resultBindingId === null) continue;
				const existing = byBinding.get(acquisition.resultBindingId) ?? [];
				existing.push(acquisition);
				byBinding.set(acquisition.resultBindingId, existing);
			}
			const output = [];
			traverseDataEffects(program, context, (node) => {
				if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
				const member = dataEffectMemberCallee(node);
				if (member === null || !t.isIdentifier(member.object)) return;
				const method = RELEASE_METHODS.find((candidate) => candidate === semanticStaticPropertyName(member.property, member.computed));
				if (method === undefined) return;
				const binding = resolveSemanticBindingState(context.state, member.object, member.object.name);
				const linked = binding === undefined ? [] : byBinding.get(binding.bindingId) ?? [];
				if (linked.length === 0) return;
				output.push({
					resourceId: `resource:release:${String(node.start ?? -1)}:${String(node.end ?? -1)}`,
					kind: "release",
					method,
					location: range(node),
					ownerCallableId: context.callableStack.at(-1) ?? null,
					resultBindingId: binding?.bindingId ?? null,
					linkedResourceIds: linked.map(resourceCandidateId).sort(),
					resolution: linked.length === 1 ? "complete" : "partial"
				});
			});
			return output;
		};
		immutableAcquisition = (candidate) => ({
			resourceId: resourceCandidateId(candidate),
			kind: "acquire",
			method: candidate.method,
			location: range(candidate.node),
			ownerCallableId: candidate.ownerCallableId,
			resultBindingId: candidate.resultBindingId,
			linkedResourceIds: [],
			resolution: "complete"
		});
		acquisitionMethod = (callee, state) => {
			for (const specifier of BUILTIN_RESOURCE_SPECIFIERS) {
				const method = builtinDataEffectMethod(callee, state, [specifier]);
				if (method !== null && BUILTIN_RESOURCE_METHODS[specifier].includes(method)) return method;
			}
			return null;
		};
		resourceCandidateId = (candidate) => `resource:acquire:${String(candidate.node.start ?? -1)}:${String(candidate.node.end ?? -1)}`;
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticDerivedAnalysis.js
/** Compose bounded semantic passes after lexical definitions are available. */
/**
* Collect derived semantics with a yield between collectors. Each collector
* completes before the next starts, so results equal the synchronous form.
*/
function* collectJavaScriptDerivedSemanticsSteps(program, state, callables, parserPartial) {
	const calls = collectJavaScriptSemanticCalls(program, state, callables);
	yield;
	const promiseOperations = collectJavaScriptSemanticPromises(program, state, callables);
	yield;
	const asyncEffects = collectJavaScriptSemanticAsyncEffects(program, state, callables);
	yield;
	const childProcesses = collectJavaScriptSemanticChildProcesses(program, state, callables);
	yield;
	const dataEffects = collectJavaScriptSemanticDataEffects(program, state, callables);
	yield;
	const resourceOperations = collectJavaScriptSemanticResources(program, state, callables);
	yield;
	const objectOperations = collectJavaScriptSemanticObjects(program, state, callables);
	yield;
	const functionFingerprints = yield* collectJavaScriptSemanticFingerprintsSteps({
		state,
		callables,
		calls,
		promises: promiseOperations,
		events: asyncEffects.eventOperations,
		timers: asyncEffects.timerOperations,
		childProcessSpawns: childProcesses.childProcessSpawns,
		childProcessInteractions: childProcesses.childProcessInteractions,
		requestOperations: dataEffects.requestOperations,
		resourceOperations,
		parserPartial
	});
	return {
		...calls,
		promiseOperations,
		...asyncEffects,
		...childProcesses,
		...dataEffects,
		resourceOperations,
		objectOperations,
		functionFingerprints
	};
}
function init_javascriptSemanticDerivedAnalysis() {
	return (init_javascriptSemanticDerivedAnalysis = __esmMin((() => {
		init_javascriptSemanticAsyncEffects();
		init_javascriptSemanticCalls();
		init_javascriptSemanticChildProcesses();
		init_javascriptSemanticFingerprints();
		init_javascriptSemanticDataEffects();
		init_javascriptSemanticPromises();
		init_javascriptSemanticObjects();
		init_javascriptSemanticResources();
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRpcEndpoints.js
var TRPC_HOOK_METHODS, TRPC_REQUEST_METHODS, TRPC_SUBSCRIPTION_CALLBACKS, TRPC_CLIENT_FACTORIES, TRPC_URL_LINKS, TRPC_SOURCE_MARKERS, BROWSER_GLOBAL_NAMES, PROCEDURE_SEGMENT, memberPath, objectKeys, objectProperty, objectStringProperty, graphqlSourceBodyLiterals, GRAPHQL_OPERATION_TYPES, isGraphqlIgnoredCharacter, skipGraphqlIgnored, graphqlNameAt, graphqlOperationFromText, graphqlOperationFromDocumentNode, rpcFactoryName, isJavaScriptRpcClientFactory, trpcLinkUrl, createJavaScriptRpcScan;
function init_javascriptRpcEndpoints() {
	return (init_javascriptRpcEndpoints = __esmMin((() => {
		init_javascriptAstValues();
		init_javascriptStaticAnalysisHelpers();
		TRPC_HOOK_METHODS = new Set([
			"useQuery",
			"useSuspenseQuery",
			"useInfiniteQuery",
			"useSuspenseInfiniteQuery",
			"usePrefetchQuery",
			"usePrefetchInfiniteQuery",
			"useMutation",
			"useSubscription",
			"queryOptions",
			"infiniteQueryOptions",
			"mutationOptions",
			"subscriptionOptions"
		]);
		TRPC_REQUEST_METHODS = new Set(["query", "mutate"]);
		TRPC_SUBSCRIPTION_CALLBACKS = new Set([
			"onStarted",
			"onData",
			"onError",
			"onStopped",
			"onComplete",
			"onConnectionStateChange"
		]);
		TRPC_CLIENT_FACTORIES = new Set(["createTRPCClient", "createTRPCProxyClient"]);
		TRPC_URL_LINKS = new Set([
			"httpLink",
			"httpBatchLink",
			"httpBatchStreamLink",
			"httpSubscriptionLink"
		]);
		TRPC_SOURCE_MARKERS = [
			"TRPCClientError",
			"trpc-accept",
			"/trpc"
		];
		BROWSER_GLOBAL_NAMES = new Set([
			"window",
			"self",
			"globalThis",
			"document",
			"navigator",
			"location",
			"history",
			"console",
			"performance",
			"screen",
			"top",
			"parent",
			"frames"
		]);
		PROCEDURE_SEGMENT = /^[A-Za-z_$][\w$]*$/u;
		memberPath = (callee) => {
			const reversed = [];
			let current = callee;
			while (t.isMemberExpression(current) || t.isOptionalMemberExpression(current)) {
				const property = semanticStaticPropertyKey(current.property, current.computed);
				if (property === null || !PROCEDURE_SEGMENT.test(property)) return undefined;
				reversed.push(property);
				current = current.object;
			}
			return {
				root: current,
				properties: reversed.reverse()
			};
		};
		objectKeys = (node) => t.isObjectExpression(node) ? node.properties.flatMap((property) => {
			if (!t.isObjectProperty(property) && !t.isObjectMethod(property)) return [];
			const key = semanticStaticPropertyKey(property.key, property.computed);
			return key === null ? [] : [key];
		}) : [];
		objectProperty = (node, key) => {
			for (let index = node.properties.length - 1; index >= 0; index -= 1) {
				const property = node.properties[index];
				if (property === undefined || t.isSpreadElement(property)) return undefined;
				const name = semanticStaticPropertyKey(property.key, property.computed);
				if (name === null) return undefined;
				if (name === key) return t.isObjectProperty(property) ? property.value : undefined;
			}
			return undefined;
		};
		objectStringProperty = (node, key) => {
			const value = objectProperty(node, key);
			return t.isStringLiteral(value) ? value.value : undefined;
		};
		graphqlSourceBodyLiterals = (node) => {
			const bodyStrings = (object) => object.properties.flatMap((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "body" && t.isStringLiteral(property.value) ? [property.value] : []);
			const bodies = bodyStrings(node);
			const hasLocationOffset = node.properties.some((property) => t.isObjectProperty(property) && semanticStaticPropertyKey(property.key, property.computed) === "locationOffset");
			if (!hasLocationOffset) return undefined;
			const visited = new WeakSet();
			visited.add(node);
			const pending = node.properties.flatMap((property) => {
				if (!t.isSpreadElement(property)) return [];
				const spread = unwrapJavaScriptExpression(property.argument).node;
				return t.isObjectExpression(spread) ? [spread] : [];
			});
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined || visited.has(current)) continue;
				visited.add(current);
				bodies.push(...bodyStrings(current));
				for (const property of current.properties) {
					if (t.isSpreadElement(property)) {
						const spread = unwrapJavaScriptExpression(property.argument).node;
						if (t.isObjectExpression(spread)) pending.push(spread);
					}
				}
			}
			return bodies.length === 0 ? undefined : bodies;
		};
		GRAPHQL_OPERATION_TYPES = new Set([
			"query",
			"mutation",
			"subscription"
		]);
		isGraphqlIgnoredCharacter = (character) => character === "," || character === "﻿" || character === "	" || character === " " || character === "\n" || character === "\r";
		skipGraphqlIgnored = (text, start) => {
			const limit = text.length;
			let index = start;
			while (index < limit) {
				const character = text.charAt(index);
				if (isGraphqlIgnoredCharacter(character)) index += 1;
				else if (character === "#") {
					while (index < limit && !/[\n\r]/u.test(text.charAt(index))) index += 1;
				} else break;
			}
			return index;
		};
		graphqlNameAt = (text, index) => {
			const name = /^[_A-Za-z][_0-9A-Za-z]*/u.exec(text.slice(index))?.[0];
			return name === undefined ? undefined : {
				value: name,
				end: index + name.length
			};
		};
		graphqlOperationFromText = (text) => {
			const type = graphqlNameAt(text, skipGraphqlIgnored(text, 0));
			if (type === undefined || !GRAPHQL_OPERATION_TYPES.has(type.value)) return undefined;
			const name = graphqlNameAt(text, skipGraphqlIgnored(text, type.end));
			if (name === undefined) return undefined;
			const index = skipGraphqlIgnored(text, name.end);
			const next = text.charAt(index);
			const hasHeader = next === "(" ? text.charAt(skipGraphqlIgnored(text, index + 1)) === "$" : (next === "@" || next === "{") && graphqlNameAt(text, skipGraphqlIgnored(text, index + 1)) !== undefined;
			return hasHeader ? {
				value: name.value,
				mechanism: `graphql:${type.value}`
			} : undefined;
		};
		graphqlOperationFromDocumentNode = (node) => {
			if (objectStringProperty(node, "kind") !== "OperationDefinition") return undefined;
			const type = objectStringProperty(node, "operation");
			if (type === undefined || !GRAPHQL_OPERATION_TYPES.has(type)) return undefined;
			const name = objectProperty(node, "name");
			if (!t.isObjectExpression(name) || objectStringProperty(name, "kind") !== "Name") return undefined;
			const value = objectStringProperty(name, "value");
			return value === undefined ? undefined : {
				value,
				mechanism: `graphql:${type}`
			};
		};
		rpcFactoryName = (callee) => {
			let current = unwrapJavaScriptExpression(callee).node;
			while (t.isSequenceExpression(current)) {
				const last = current.expressions.at(-1);
				if (last === undefined) return "";
				current = unwrapJavaScriptExpression(last).node;
			}
			return calleeName(current);
		};
		isJavaScriptRpcClientFactory = (node) => {
			const call = unwrapJavaScriptExpression(node).node;
			return (t.isCallExpression(call) || t.isOptionalCallExpression(call)) && TRPC_CLIENT_FACTORIES.has(rpcFactoryName(call.callee).split(".").pop() ?? "");
		};
		trpcLinkUrl = (node) => {
			const name = rpcFactoryName(node.callee);
			const factory = name.slice(name.lastIndexOf(".") + 1);
			if (!TRPC_URL_LINKS.has(factory)) return undefined;
			const options = node.arguments[0];
			if (!t.isObjectExpression(options)) return undefined;
			const url = objectStringProperty(options, "url");
			return url === undefined ? undefined : {
				value: url,
				mechanism: `trpc:link:${factory}`
			};
		};
		createJavaScriptRpcScan = (source, clientRoots) => {
			let marker;
			const hasMarker = () => marker ??= TRPC_SOURCE_MARKERS.some((value) => source.includes(value));
			const graphqlDocumentSourceBodies = new WeakSet();
			const procedure = (node) => {
				const path = memberPath(node.callee);
				if (path === undefined || t.isThisExpression(path.root)) return undefined;
				if (t.isIdentifier(path.root) && BROWSER_GLOBAL_NAMES.has(path.root.name)) return undefined;
				const method = path.properties[path.properties.length - 1];
				const segments = path.properties.slice(0, -1);
				const first = segments[0];
				if (method === undefined || first === undefined) return undefined;
				if (BROWSER_GLOBAL_NAMES.has(first) || segments.includes("endpoints")) return undefined;
				const bound = clientRoots.has(path.root);
				const recognized = TRPC_HOOK_METHODS.has(method) ? true : TRPC_REQUEST_METHODS.has(method) ? bound || segments.length >= 2 && hasMarker() : method === "subscribe" && (bound || hasMarker()) && objectKeys(node.arguments[1]).some((key) => TRPC_SUBSCRIPTION_CALLBACKS.has(key));
				return recognized ? {
					value: segments.join("."),
					mechanism: `trpc:procedure:${method}`
				} : undefined;
			};
			return { inspect: (node) => {
				if (t.isCallExpression(node) || t.isOptionalCallExpression(node)) return trpcLinkUrl(node) ?? procedure(node);
				if (t.isObjectExpression(node)) {
					const bodies = graphqlSourceBodyLiterals(node);
					if (bodies !== undefined) {
						for (const body of bodies) graphqlDocumentSourceBodies.add(body);
						return undefined;
					}
					return graphqlOperationFromDocumentNode(node);
				}
				if (t.isStringLiteral(node)) return graphqlDocumentSourceBodies.has(node) ? undefined : graphqlOperationFromText(node.value);
				if (t.isTemplateLiteral(node)) {
					for (const quasi of node.quasis) {
						const cooked = quasi.value.cooked;
						if (cooked === undefined || cooked === null) return undefined;
						if (skipGraphqlIgnored(cooked, 0) === cooked.length) continue;
						return graphqlOperationFromText(cooked);
					}
					return undefined;
				}
				return undefined;
			} };
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptSemanticAnalysis.js
/** Share the lexical index with bounded, demand-driven boundary analyses. */
function* indexJavaScriptBindingsSteps(program) {
	const state = createState(program);
	yield* collectDefinitionsSteps(program, state);
	yield* indexJavaScriptAmbientWritesSteps(program, state);
	return state;
}
/**
* Recover semantics from a parsed artifact with a yield between analysis
* phases, so a caller can serve control messages within one large file.
* Each phase completes before the next starts; results equal the synchronous
* form.
*/
function* analyzeParsedJavaScriptSemanticsSteps(file, staticImportResolutionMode = "import") {
	const state = createState(file.program, staticImportResolutionMode);
	yield* collectDefinitionsSteps(file.program, state);
	yield* indexJavaScriptAmbientWritesSteps(file.program, state);
	yield* collectSemanticMemberMutationsSteps(file.program, state);
	yield* traverseJavaScriptAstSteps(file.program, { enter: (node) => collectSemanticModuleLink(node, state) });
	yield;
	const references = yield* collectSemanticReferencesSteps(file.program, state);
	const parserPartial = file.errors.length > 0;
	const bindings = immutableSemanticBindings(state);
	yield;
	const callables = collectSemanticReturns(state, parserPartial);
	yield;
	const moduleLinks = resolveSemanticModuleCallables(state, callables, bindings);
	const derived = yield* collectJavaScriptDerivedSemanticsSteps(file.program, state, callables, parserPartial);
	return {
		schema: "JavaScriptSemanticIR",
		scopes: immutableSemanticScopes(state),
		bindings,
		callables,
		references,
		moduleLinks,
		...derived,
		coverage: semanticCoverage(parserPartial, semanticResourceLimitsIn([...bindings.map(({ value }) => value), ...callables.flatMap((callable) => callable.returnSites.map(({ value }) => value))])),
		limitations: [
			...parserPartial ? ["The parser recovered from syntax errors; affected bindings are partial."] : [],
			...hasUncertainTypeOnlyModuleSideEffect(file.program) ? ["Compiler options are unavailable; inline type-only imports or re-exports may preserve a module side-effect dependency."] : [],
			"Values and aliases were recovered from inert syntax only; no JavaScript was executed.",
			"Return sites include only direct callable returns; nested callable returns remain separate.",
			"Local call, argument, return, and closure relations are static candidates and do not prove runtime invocation.",
			"Promise ownership covers explicit unshadowed Promise construction, static factories, aggregation, chaining, and await syntax only.",
			"Cross-function mutation and dynamic property resolution remain unknown."
		]
	};
}
/** Resolve tRPC client roots by lexical identity, excluding overwritten bindings. */
function* classifyParsedJavaScriptRpcClientRootsSteps(file) {
	const state = createState(file.program);
	yield* collectDefinitionsSteps(file.program, state);
	const roots = new Set();
	const clients = new Map();
	yield* traverseJavaScriptAstSteps(file.program, { enter: (node) => {
		if (!t.isMemberExpression(node) && !t.isOptionalMemberExpression(node)) return;
		const root = node.object;
		if (!t.isIdentifier(root)) return;
		const binding = resolveSemanticBindingState(state, root, root.name);
		if (binding === undefined) return;
		let client = clients.get(binding.bindingId);
		if (client === undefined) {
			const initializer = semanticStableInitializer(binding, state);
			client = initializer !== undefined && initializer.projection.length === 0 && isJavaScriptRpcClientFactory(initializer.node);
			clients.set(binding.bindingId, client);
		}
		if (client) roots.add(root);
	} });
	return roots;
}
/** Classify `.open` receivers while yielding during lexical and AST scans. */
function* classifyParsedJavaScriptOpenReceiversSteps(file) {
	const state = createState(file.program);
	yield* collectDefinitionsSteps(file.program, state);
	const facts = new Map();
	const extensionStateReads = [];
	yield* traverseJavaScriptAstSteps(file.program, { enter: (node) => {
		if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) || !t.isMemberExpression(node.callee) && !t.isOptionalMemberExpression(node.callee)) return;
		const method = semanticStaticPropertyKey(node.callee.property, node.callee.computed);
		if (method === "get") {
			if (isConfigurationReceiver(state, node.callee.object)) facts.set(node.start ?? -1, "configuration");
			else if (isExtensionStateMember(node.callee.object)) extensionStateReads.push(node.start ?? -1);
			return;
		}
		if (method !== "open" || !t.isIdentifier(node.callee.object)) return;
		const receiver = node.callee.object.name;
		const binding = resolveSemanticBindingState(state, node, receiver);
		if (binding === undefined) {
			if (semanticResolutionBlocked(state, node, receiver)) return;
			const fact = openGlobalFact(receiver);
			if (fact !== undefined) facts.set(node.start ?? -1, fact);
			return;
		}
		facts.set(node.start ?? -1, "local");
		if (receiver === "indexedDB" || receiver === "caches") {
			facts.set(node.start ?? -1, receiver === "indexedDB" ? "local-indexed-db" : "local-cache-storage");
			return;
		}
		if (binding.mutable || binding.initializers.length !== 1) return;
		const initializer = binding.initializers[0]?.node;
		if (!t.isIdentifier(initializer)) return;
		const initializerBinding = resolveSemanticBindingState(state, initializer, initializer.name);
		if (initializerBinding !== undefined) {
			if (initializer.name === "indexedDB" || initializer.name === "caches") {
				const localFact = initializer.name === "indexedDB" ? "local-indexed-db" : "local-cache-storage";
				facts.set(node.start ?? -1, localFact);
				if (initializerBinding.mutable || initializerBinding.initializers.length !== 1) return;
				const nested = initializerBinding.initializers[0]?.node;
				if (t.isIdentifier(nested)) {
					const nestedFact = resolveGlobalAliasFact(state, initializer, nested.name);
					if (nestedFact !== undefined) facts.set(node.start ?? -1, nestedFact);
				}
			} else if (initializer.name === "window") {
				facts.set(node.start ?? -1, "local");
			}
			return;
		}
		const aliasFact = resolveGlobalAliasFact(state, initializer, initializer.name);
		if (aliasFact !== undefined) facts.set(node.start ?? -1, aliasFact);
	} });
	if (extensionStateReads.length > 0 && importsVsCodeModule(state)) for (const start of extensionStateReads) facts.set(start, "extension-state");
	return facts;
}
/** Resolve Electron aliases while yielding during lexical and AST scans. */
function* classifyParsedJavaScriptElectronBindingsSteps(file) {
	const state = createState(file.program);
	yield* collectDefinitionsSteps(file.program, state);
	return (yield* indexJavaScriptElectronIdentitySteps(file.program, state)).bindings;
}
function* indexJavaScriptElectronIdentitySteps(program, state) {
	const facts = new Map();
	const interop = createSemanticModuleInterop(state);
	const writes = new SemanticPropertyPathCoverage();
	let collectedWrites = false;
	const exportsByBinding = new Map();
	const rootExport = (root) => {
		if (t.isIdentifier(root)) {
			if (semanticResolutionBlocked(state, root, root.name)) return undefined;
			const binding = resolveSemanticBindingState(state, root, root.name);
			if (binding === undefined) return undefined;
			let exported = exportsByBinding.get(binding.bindingId);
			if (exported === undefined) {
				exported = electronExport(binding, state, interop);
				exportsByBinding.set(binding.bindingId, exported);
			}
			return collectedWrites && interop.invalidated(binding) ? undefined : exported ?? undefined;
		}
		const wrapped = interop.callOrigin(root);
		const origin = wrapped === undefined ? electronRequireOrigin(root, state)?.origin : collectedWrites && interop.invalidatedCall(root) ? undefined : wrapped.origin;
		return origin !== undefined && ELECTRON_MODULE.test(origin.specifier) ? electronExportPath(origin.importedPath) : undefined;
	};
	yield* collectJavaScriptIdentityWritesSteps(program, (node, kind) => {
		if (kind === "opaque-call") return [interop.opaqueMutationPath(node)];
		const { root, members } = electronMemberPath(node);
		const exported = kind === "binding" ? undefined : rootExport(root);
		const path = exported === undefined ? interop.intrinsicPath(root) ?? (kind === "member" ? interop.boundIntrinsic(root)?.path : undefined) : ["electron", ...exported];
		return path === undefined ? [] : [[...path, ...members]];
	}, interop.intrinsicInvocation, interop.staticString, interop.isFreshObject, (node, path) => {
		if (path[0] === "electron") writes.retain(path);
		else interop.retainWrite(node, path);
	});
	collectedWrites = true;
	const intactExport = (path) => ELECTRON_MODULE.test(path[0] ?? "") && !writes.covers(["electron", ...path.slice(1)]);
	yield* traverseJavaScriptAstSteps(program, { enter: (node) => {
		if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node) && !t.isNewExpression(node)) return;
		const { root, members } = electronMemberPath(node.callee);
		const exported = rootExport(root);
		if (exported !== undefined && intactExport([
			"electron",
			...exported,
			...members
		])) facts.set(root.start ?? -1, exported);
	} });
	return {
		bindings: facts,
		intactExport,
		exportPath: rootExport
	};
}
function* collectDefinitionsSteps(program, state) {
	const stack = [currentSemanticScope(state.scopes)];
	const openedScopes = new WeakMap();
	const assignments = [];
	const functionBodies = [];
	yield* traverseJavaScriptAstSteps(program, {
		enter: (node, parent, readAncestors) => {
			if (parent !== null) state.parentsByNode.set(node, parent);
			let parentScope = currentSemanticScope(stack);
			if (parent !== null && (t.isObjectMethod(parent) || t.isClassMethod(parent)) && parent.computed && parent.key === node && parentScope.parentScopeId !== null) {
				const keyScope = state.scopesById.get(parentScope.parentScopeId);
				if (keyScope !== undefined) {
					stack.push(keyScope);
					openedScopes.set(node, 1);
					parentScope = keyScope;
				}
			}
			if (parent !== null && t.isWithStatement(parent) && parent.body === node) {
				const dynamicScope = {
					scopeId: `${semanticScopeId("block", parent)}:with`,
					parentScopeId: parentScope.scopeId,
					kind: "block",
					location: range(parent),
					bindingsComplete: false,
					bindings: new Map()
				};
				state.scopes.push(dynamicScope);
				state.scopesById.set(dynamicScope.scopeId, dynamicScope);
				stack.push(dynamicScope);
				openedScopes.set(node, 1);
				parentScope = dynamicScope;
			}
			bindOuterDeclaration(node, parentScope, state);
			const nested = nestedScope(node, parent, parentScope, state);
			if (nested !== undefined) {
				stack.push(nested);
				openedScopes.set(node, (openedScopes.get(node) ?? 0) + 1);
				if (t.isBlockStatement(node) && t.isFunction(parent)) functionBodies.push({
					body: node,
					scope: nested,
					parameters: runtimeFunctionParameters(parent)
				});
			}
			const scope = currentSemanticScope(stack);
			if (parent === null || openedScopes.has(node)) state.scopeByNode.set(node, scope);
			collectSemanticCallable({
				node,
				parent,
				containerScope: parentScope,
				bodyScope: nested,
				state
			});
			bindInnerDeclaration(node, parent, scope, state);
			if (t.isVariableDeclarator(node) && node.init != null && parent !== null && t.isVariableDeclaration(parent, { kind: "var" }) && writeMayBeSkipped(node, readAncestors())) state.conditionallySkippedExpressions.add(node.init);
			if (t.isAssignmentExpression(node) || t.isUpdateExpression(node) || t.isForOfStatement(node) || t.isForInStatement(node)) assignments.push({
				node,
				scope,
				conditionallySkipped: t.isForOfStatement(node) || t.isForInStatement(node) || writeMayBeSkipped(node, readAncestors())
			});
		},
		exit: (node) => {
			for (let count = openedScopes.get(node) ?? 0; count > 0; count--) stack.pop();
		}
	});
	for (const [index, { node, scope, conditionallySkipped }] of assignments.entries()) {
		if (index % 64 === 0) yield;
		bindAssignment(node, scope, state, conditionallySkipped);
	}
	for (const [index, { body, scope, parameters }] of functionBodies.entries()) {
		if (index % 64 === 0) yield;
		for (const parameter of parameters) for (const identifier of semanticWriteTargets(t.isTSParameterProperty(parameter) ? parameter.parameter : parameter)) if (t.isIdentifier(identifier)) copyParameterToBody({
			identifier,
			body,
			scope,
			state
		});
	}
}
var analyzeJavaScriptSemantics, analyzeParsedJavaScriptReferences, analyzeParsedJavaScriptSemantics, classifyParsedJavaScriptOpenReceivers, isExtensionStateMember, importsVsCodeModule, isConfigurationAccessorCall, isConfigurationReceiver, openGlobalFact, resolveGlobalAliasFact, classifyParsedJavaScriptElectronBindings, electronExport, electronRequireOrigin, bindingOrigin, createState, copyParameterToBody, writeMayBeSkipped, isSkippedBranch, optionalCallArgumentsMayBeSkipped, bindOuterDeclaration, bindInnerDeclaration, bindImportEquals, hasIncomingValue, bindAssignment, nestedScope, functionNameScope, scopeKind, functionParametersHaveExpressions, bindImports, bindFunctionLocals, bindPattern, addBinding, createBinding, addAssignment;
function init_javascriptSemanticAnalysis() {
	return (init_javascriptSemanticAnalysis = __esmMin((() => {
		init_javascriptSemanticIr();
		init_javascriptSemanticProjection();
		init_javascriptAstValues();
		init_javascriptSemanticState();
		init_javascriptSemanticTraversal();
		init_javascriptSemanticRequireOrigin();
		init_javascriptBundledRequireOrigin();
		init_javascriptSemanticMemberMutations();
		init_javascriptSemanticAmbientWrites();
		init_javascriptModuleDeclaration();
		init_javascriptSemanticReturns();
		init_javascriptSemanticDerivedAnalysis();
		init_javascriptSemanticValues();
		init_javascriptElectronMemberWrites();
		init_javascriptStaticAnalysisHelpers();
		init_javascriptSemanticCoverage();
		init_javascriptSemanticResourceLimits();
		init_javascriptSourceParser();
		init_javascriptRpcEndpoints();
		init_javascriptModuleInterop();
		init_javascriptSemanticPropertyPaths();
		analyzeJavaScriptSemantics = (source) => {
			const file = parseJavaScriptSource(source);
			return file === null ? failedJavaScriptSemanticIr() : analyzeParsedJavaScriptSemantics(file);
		};
		analyzeParsedJavaScriptReferences = (file, name) => {
			const state = createState(file.program);
			completeSemanticSteps(collectDefinitionsSteps(file.program, state));
			return collectSemanticReferences(file.program, state, name);
		};
		analyzeParsedJavaScriptSemantics = (file, staticImportResolutionMode = "import") => completeSemanticSteps(analyzeParsedJavaScriptSemanticsSteps(file, staticImportResolutionMode));
		classifyParsedJavaScriptOpenReceivers = (file) => completeSemanticSteps(classifyParsedJavaScriptOpenReceiversSteps(file));
		isExtensionStateMember = (receiver) => (t.isMemberExpression(receiver) || t.isOptionalMemberExpression(receiver)) && (() => {
			const key = semanticStaticPropertyKey(receiver.property, receiver.computed);
			return key === "globalState" || key === "workspaceState";
		})();
		importsVsCodeModule = (state) => [...state.bindingsById.values()].some((binding) => binding.directOrigins.some(({ specifier }) => specifier === "vscode") || semanticRequireOrigin(semanticStableInitializer(binding, state)?.node, state)?.origin.specifier === "vscode");
		isConfigurationAccessorCall = (state, node) => {
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return false;
			const callee = node.callee;
			if (!t.isMemberExpression(callee) && !t.isOptionalMemberExpression(callee) || semanticStaticPropertyKey(callee.property, callee.computed) !== "getConfiguration") return false;
			const host = callee.object;
			const matchesSpelling = t.isIdentifier(host) ? host.name === "workspace" : (t.isMemberExpression(host) || t.isOptionalMemberExpression(host)) && semanticStaticPropertyKey(host.property, host.computed) === "workspace";
			if (!matchesSpelling) return false;
			const root = t.isIdentifier(host) ? host : t.isMemberExpression(host) || t.isOptionalMemberExpression(host) ? host.object : undefined;
			if (!t.isIdentifier(root)) return false;
			const binding = resolveSemanticBindingState(state, root, root.name);
			if (binding === undefined) return !semanticResolutionBlocked(state, root, root.name);
			const initializer = semanticStableInitializer(binding, state);
			const origins = [...binding.directOrigins, ...initializer === undefined ? [] : [semanticRequireOrigin(initializer.node, state)?.origin]];
			return origins.some((origin) => origin?.specifier === "vscode" && (t.isIdentifier(host) ? origin.importedPath.at(-1) === "workspace" || initializer?.projection.at(-1) === "workspace" : origin.importedPath.length === 0 || origin.importedPath.length === 1 && (origin.importedPath[0] === "*" || origin.importedPath[0] === "default")));
		};
		isConfigurationReceiver = (state, receiver) => {
			if (isConfigurationAccessorCall(state, receiver)) return true;
			if (!t.isIdentifier(receiver)) return false;
			const binding = resolveSemanticBindingState(state, receiver, receiver.name);
			const initializer = semanticStableInitializer(binding, state);
			return initializer !== undefined && initializer.projection.length === 0 && isConfigurationAccessorCall(state, initializer.node);
		};
		openGlobalFact = (name) => {
			if (name === "window" || name === "self" || name === "globalThis" || name === "top" || name === "parent" || name === "opener" || name === "frames" || name === "document") return "window";
			if (name === "indexedDB") return "indexed-db";
			if (name === "caches") return "cache-storage";
			return undefined;
		};
		resolveGlobalAliasFact = (state, node, name) => {
			if (resolveSemanticBindingState(state, node, name) !== undefined || semanticResolutionBlocked(state, node, name)) return undefined;
			return openGlobalFact(name);
		};
		classifyParsedJavaScriptElectronBindings = (file) => completeSemanticSteps(classifyParsedJavaScriptElectronBindingsSteps(file));
		electronExport = (binding, state, interop) => {
			const reassigned = binding.definitions.some(({ kind }) => kind === "assignment");
			const converted = interop.origin(binding);
			if (reassigned && converted === undefined) return null;
			const directOrigin = converted?.origin ?? bindingOrigin(binding, state);
			const initializer = semanticStableInitializer(binding, state);
			if (directOrigin === undefined && initializer === undefined) return null;
			const provenance = directOrigin === undefined ? evaluateSemanticProvenance(binding, state) : undefined;
			const origin = directOrigin ?? (provenance?.status === "module" && provenance.origins.length === 1 ? provenance.origins[0] : undefined);
			return origin !== undefined && ELECTRON_MODULE.test(origin.specifier) ? electronExportPath(origin.importedPath) : null;
		};
		electronRequireOrigin = (node, state) => semanticRequireOrigin(node, state) ?? semanticBundledRequireOrigin(node, state);
		bindingOrigin = (binding, state) => {
			if (binding.directOrigins.length > 0) return binding.directOrigins.length === 1 ? binding.directOrigins[0] : undefined;
			const initializer = semanticStableInitializer(binding, state);
			if (initializer === undefined) return undefined;
			const origin = electronRequireOrigin(initializer.node, state)?.origin;
			const projection = initializer.projection;
			return origin === undefined || !projection.every((key) => typeof key === "string") ? undefined : {
				...origin,
				importedPath: [...origin.importedPath, ...projection]
			};
		};
		createState = (program, staticImportResolutionMode = "import") => {
			const root = {
				scopeId: semanticScopeId("program", program),
				parentScopeId: null,
				kind: "program",
				location: range(program),
				bindingsComplete: true,
				bindings: new Map()
			};
			return {
				program,
				staticImportResolutionMode,
				parentsByNode: new WeakMap(),
				scopes: [root],
				scopesById: new Map([[root.scopeId, root]]),
				scopeByNode: new WeakMap([[program, root]]),
				bindingsById: new Map(),
				callables: [],
				callableNodesById: new Map(),
				moduleLinks: [],
				linkedRequireCalls: new WeakSet(),
				moduleLinkBindings: new WeakMap(),
				defaultExportExpressions: new WeakMap(),
				conditionallySkippedExpressions: new WeakSet(),
				requiredModuleEffects: new Map(),
				ambientBindingWrites: new Map(),
				ambientWrites: new SemanticPropertyPathCoverage(),
				ambientWriteEffects: []
			};
		};
		copyParameterToBody = (input) => {
			const { identifier, body, scope, state } = input;
			const binding = scope.bindings.get(identifier.name);
			if (binding === undefined || binding.kind !== "variable" || binding.definitions.some(({ kind }) => kind === "function")) return;
			binding.initializers.unshift({
				node: identifier,
				projection: [],
				entryBody: body
			});
			for (let index = binding.initializers.length - 1; index >= 0; index -= 1) {
				const initializer = binding.initializers[index];
				if (initializer !== undefined && initializer.entryBody === undefined && initializer.projection.length === 0 && t.isIdentifier(initializer.node) && resolveSemanticBindingState(state, initializer.node, initializer.node.name) === binding) binding.initializers.splice(index, 1);
			}
		};
		writeMayBeSkipped = (node, ancestors) => {
			let child = node;
			for (let index = ancestors.length - 1; index >= 0; index -= 1) {
				const parent = ancestors[index];
				if (parent === undefined || t.isFunction(parent) || t.isProgram(parent) || t.isStaticBlock(parent)) return false;
				if (isSkippedBranch(parent, child)) return true;
				child = parent;
			}
			return false;
		};
		isSkippedBranch = (parent, child) => {
			if (t.isIfStatement(parent)) return child === parent.consequent || child === parent.alternate;
			if (t.isSwitchCase(parent)) return true;
			if (t.isTryStatement(parent)) return child === parent.block || child === parent.handler;
			if (t.isForStatement(parent)) return child === parent.body || child === parent.update;
			if (t.isWhileStatement(parent)) return child === parent.body;
			if (t.isDoWhileStatement(parent)) return false;
			if (t.isForInStatement(parent) || t.isForOfStatement(parent)) return child === parent.left || child === parent.body;
			if (t.isLogicalExpression(parent)) return child === parent.right;
			if (t.isConditionalExpression(parent)) return child === parent.consequent || child === parent.alternate;
			if (t.isOptionalCallExpression(parent) || t.isCallExpression(parent)) return parent.arguments.includes(child) && optionalCallArgumentsMayBeSkipped(parent);
			if (t.isOptionalMemberExpression(parent)) return parent.optional && parent.computed && child === parent.property;
			return false;
		};
		optionalCallArgumentsMayBeSkipped = (call) => {
			if (t.isOptionalCallExpression(call) && call.optional) return true;
			let callee = call.callee;
			while (true) {
				if (callee.extra?.parenthesized === true) return false;
				if (t.isOptionalMemberExpression(callee)) {
					if (callee.optional) return true;
					callee = callee.object;
				} else if (t.isMemberExpression(callee)) callee = callee.object;
				else if (t.isOptionalCallExpression(callee)) {
					if (callee.optional) return true;
					callee = callee.callee;
				} else if (t.isCallExpression(callee)) callee = callee.callee;
				else return false;
			}
		};
		bindOuterDeclaration = (node, scope, state) => {
			if (t.isFunctionDeclaration(node) && t.isIdentifier(node.id)) addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "function",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
			else if (t.isClassDeclaration(node) && t.isIdentifier(node.id)) addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "class",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
		};
		bindInnerDeclaration = (node, parent, scope, state) => {
			if (t.isImportDeclaration(node)) bindImports(node, scope, state);
			else if (t.isTSImportEqualsDeclaration(node)) bindImportEquals(node, scope, state);
			else if (t.isVariableDeclarator(node)) bindPattern({
				pattern: node.id,
				initializer: node.init ?? null,
				scope: semanticVariableScope(scope, parent, state),
				state,
				mutable: parent !== null && t.isVariableDeclaration(parent) ? parent.kind !== "const" : true,
				...parent !== null && t.isVariableDeclaration(parent) ? { declarationKind: parent.kind } : {}
			});
			else if (t.isClassExpression(node) && t.isIdentifier(node.id)) addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "class",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
			else if (t.isFunction(node)) bindFunctionLocals(node, scope, state);
			else if (t.isCatchClause(node) && node.param != null) bindPattern({
				pattern: node.param,
				initializer: null,
				scope,
				state,
				mutable: true,
				kind: "catch"
			});
		};
		bindImportEquals = (node, scope, state) => {
			const specifier = semanticImportEqualsSpecifier(node);
			if (specifier === null) return;
			addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "import",
				mutable: false,
				definitionNode: node.id,
				initializer: null,
				directOrigin: {
					specifier,
					importedPath: [],
					resolutionMode: "require"
				}
			});
		};
		hasIncomingValue = (identifier, scope, state) => {
			const kind = resolveSemanticBindingFromScope(scope, identifier.name, state)?.kind;
			return kind === "parameter" || kind === "catch";
		};
		bindAssignment = (node, scope, state, conditionallySkipped) => {
			if (t.isAssignmentExpression(node)) {
				const left = unwrapJavaScriptExpression(node.left).node;
				if (t.isIdentifier(left)) addAssignment(left, node.operator === "=" || (node.operator === "||=" || node.operator === "??=") && !hasIncomingValue(left, scope, state) ? node.right : node, scope, state, conditionallySkipped);
				else for (const identifier of semanticWriteTargets(node.left)) if (t.isIdentifier(identifier)) addAssignment(identifier, node, scope, state, conditionallySkipped);
			} else if (t.isUpdateExpression(node)) {
				const argument = unwrapJavaScriptExpression(node.argument).node;
				if (t.isIdentifier(argument)) addAssignment(argument, node, scope, state, conditionallySkipped);
			} else if (t.isForOfStatement(node) || t.isForInStatement(node)) for (const pattern of t.isVariableDeclaration(node.left) ? node.left.declarations.map(({ id }) => id) : [node.left]) {
				for (const identifier of semanticWriteTargets(pattern)) if (t.isIdentifier(identifier)) addAssignment(identifier, node, scope, state, conditionallySkipped);
				if (t.isForOfStatement(node)) bindPattern({
					pattern,
					initializer: node,
					scope,
					state,
					mutable: true,
					referenceOnly: true
				});
			}
		};
		nestedScope = (node, parent, parentScope, state) => {
			const switchOwner = t.isSwitchCase(node) && parent !== null && t.isSwitchStatement(parent) ? parent : undefined;
			if (switchOwner !== undefined) {
				const existing = state.scopesById.get(semanticScopeId("block", switchOwner));
				if (existing !== undefined) return existing;
			}
			const kind = scopeKind(node, parent);
			if (kind === undefined) return undefined;
			const scope = {
				scopeId: semanticScopeId(kind, switchOwner ?? node),
				parentScopeId: functionNameScope(node, parentScope, state)?.scopeId ?? parentScope.scopeId,
				kind,
				location: range(switchOwner ?? node),
				bindingsComplete: true,
				bindings: new Map()
			};
			state.scopes.push(scope);
			state.scopesById.set(scope.scopeId, scope);
			return scope;
		};
		functionNameScope = (node, parentScope, state) => {
			if (!t.isFunctionExpression(node) || !t.isIdentifier(node.id)) return undefined;
			const scope = {
				scopeId: `${semanticScopeId("block", node)}:function-name`,
				parentScopeId: parentScope.scopeId,
				kind: "block",
				location: range(node),
				bindingsComplete: true,
				bindings: new Map()
			};
			state.scopes.push(scope);
			state.scopesById.set(scope.scopeId, scope);
			addBinding({
				state,
				scope,
				name: node.id.name,
				kind: "function",
				mutable: false,
				definitionNode: node.id,
				initializer: node
			});
			return scope;
		};
		scopeKind = (node, parent) => {
			if (t.isFunction(node)) return "function";
			if (t.isClass(node)) return "class";
			if (t.isCatchClause(node)) return "catch";
			if (t.isForStatement(node) || t.isForOfStatement(node) || t.isForInStatement(node)) return "block";
			if (t.isSwitchCase(node)) return "block";
			if (t.isStaticBlock(node)) return "static-block";
			if (t.isBlockStatement(node) && parent !== null && t.isFunction(parent) && parent.body === node) {
				return functionParametersHaveExpressions(parent) ? "function" : undefined;
			}
			if (t.isBlockStatement(node)) return "block";
			return undefined;
		};
		functionParametersHaveExpressions = (node) => {
			const pending = [...runtimeFunctionParameters(node)];
			while (pending.length > 0) {
				const parameter = pending.pop();
				if (t.isAssignmentPattern(parameter)) return true;
				if (t.isTSParameterProperty(parameter)) pending.push(parameter.parameter);
				else if (t.isRestElement(parameter)) pending.push(parameter.argument);
				else if (t.isArrayPattern(parameter)) {
					for (const element of parameter.elements) if (element !== null) pending.push(element);
				} else if (t.isObjectPattern(parameter)) {
					for (const property of parameter.properties) {
						if (t.isRestElement(property)) pending.push(property.argument);
						else {
							if (property.computed) return true;
							pending.push(property.value);
						}
					}
				}
			}
			return false;
		};
		bindImports = (node, scope, state) => {
			for (const specifier of node.specifiers) {
				const importedPath = t.isImportDefaultSpecifier(specifier) ? ["default"] : t.isImportNamespaceSpecifier(specifier) ? [] : [semanticStaticPropertyKey(specifier.imported, false) ?? "[dynamic]"];
				addBinding({
					state,
					scope,
					name: specifier.local.name,
					kind: "import",
					mutable: false,
					definitionNode: specifier.local,
					initializer: null,
					directOrigin: {
						specifier: node.source.value,
						importedPath
					},
					runtimeImport: node.importKind !== "type" && node.importKind !== "typeof" && (!t.isImportSpecifier(specifier) || specifier.importKind !== "type" && specifier.importKind !== "typeof")
				});
			}
		};
		bindFunctionLocals = (node, scope, state) => {
			for (const parameter of runtimeFunctionParameters(node)) bindPattern({
				pattern: t.isTSParameterProperty(parameter) ? parameter.parameter : parameter,
				initializer: null,
				scope,
				state,
				mutable: true,
				kind: "parameter"
			});
		};
		bindPattern = (input) => {
			const { pattern, initializer, scope, state, mutable, declarationKind, kind = "variable", projection = [], referenceOnly = false, copyKind, copyProjectionOffset, copyExcludedKeys, copyStartIndex, fallbackSources, requiredSources } = input;
			if (t.isTSParameterProperty(pattern)) {
				bindPattern({
					...input,
					pattern: pattern.parameter
				});
				return;
			}
			if (t.isIdentifier(pattern)) {
				if (referenceOnly) {
					const binding = resolveSemanticBindingFromScope(scope, pattern.name, state);
					if (binding !== undefined && initializer !== null) binding.referenceInitializers.push({
						node: initializer,
						projection,
						...copyKind === undefined ? {} : { copyKind },
						...copyProjectionOffset === undefined ? {} : { copyProjectionOffset },
						...copyExcludedKeys === undefined ? {} : { copyExcludedKeys },
						...copyStartIndex === undefined ? {} : { copyStartIndex },
						...fallbackSources === undefined ? {} : { fallbackSources },
						...requiredSources === undefined ? {} : { requiredSources }
					});
					return;
				}
				addBinding({
					state,
					scope,
					name: pattern.name,
					kind,
					mutable,
					...declarationKind === undefined ? {} : { declarationKind },
					definitionNode: pattern,
					initializer,
					projection
				});
				return;
			}
			if (t.isAssignmentPattern(pattern)) {
				bindPattern({
					...input,
					pattern: pattern.left,
					initializer: kind === "parameter" || kind === "catch" ? initializer : initializer ?? pattern.right,
					requiredSources: [...requiredSources ?? [], ...initializer === null ? [] : [{
						node: initializer,
						projection
					}]]
				});
				bindPattern({
					state,
					scope,
					mutable,
					kind,
					pattern: pattern.left,
					initializer: pattern.right,
					projection: [],
					referenceOnly: true,
					fallbackSources: [...fallbackSources ?? [], ...initializer === null ? [] : [{
						node: initializer,
						projection
					}]],
					...requiredSources === undefined ? {} : { requiredSources }
				});
				return;
			}
			if (t.isRestElement(pattern)) {
				bindPattern({
					...input,
					pattern: pattern.argument,
					initializer: null,
					mutable: true
				});
				return;
			}
			if (t.isObjectPattern(pattern)) for (const property of pattern.properties) {
				if (t.isRestElement(property)) {
					bindPattern({
						...input,
						pattern: property.argument,
						initializer: null,
						mutable: true,
						projection: []
					});
					bindPattern({
						...input,
						pattern: property.argument,
						projection: [...projection, null],
						referenceOnly: true,
						copyKind: "object-rest",
						copyProjectionOffset: projection.length,
						copyExcludedKeys: semanticObjectPatternKeys(pattern)
					});
				} else {
					const name = semanticStaticPropertyKey(property.key, property.computed);
					bindPattern({
						...input,
						pattern: property.value,
						projection: [...projection, name]
					});
				}
			}
			else if (t.isArrayPattern(pattern)) pattern.elements.forEach((element, index) => {
				if (element !== null) {
					bindPattern({
						...input,
						pattern: element,
						projection: [...projection, index]
					});
					if (t.isRestElement(element)) bindPattern({
						...input,
						pattern: element.argument,
						projection: [...projection, null],
						referenceOnly: true,
						copyKind: "array-rest",
						copyProjectionOffset: projection.length,
						copyStartIndex: index
					});
				}
			});
		};
		addBinding = (input) => {
			const { state, scope, name, kind, mutable, declarationKind, definitionNode, initializer, directOrigin, runtimeImport, projection = [] } = input;
			let binding = scope.bindings.get(name);
			if (binding === undefined) {
				if (!scope.bindingsComplete) return;
				binding = createBinding(scope, name, kind, mutable);
				scope.bindings.set(name, binding);
				state.bindingsById.set(binding.bindingId, binding);
			}
			binding.mutable ||= mutable;
			if (declarationKind !== undefined) binding.declarationKinds.add(declarationKind);
			binding.definitions.push({
				kind,
				location: range(definitionNode)
			});
			if (initializer !== null) binding.initializers.push({
				node: initializer,
				projection
			});
			if (directOrigin !== undefined) binding.directOrigins.push(directOrigin.resolutionMode === undefined && state.staticImportResolutionMode !== "import" ? {
				...directOrigin,
				resolutionMode: state.staticImportResolutionMode
			} : directOrigin);
			binding.runtimeImport ||= runtimeImport === true;
		};
		createBinding = (scope, name, kind, mutable) => ({
			bindingId: semanticBindingId(scope.scopeId, name),
			scopeId: scope.scopeId,
			name,
			kind,
			mutable,
			declarationKinds: new Set(),
			memberWrites: [],
			escapedPaths: [],
			definitions: [],
			initializers: [],
			referenceInitializers: [],
			directOrigins: [],
			runtimeImport: false
		});
		addAssignment = (identifier, initializer, scope, state, conditionallySkipped) => {
			const binding = resolveSemanticBindingFromScope(scope, identifier.name, state);
			if (binding === undefined) {
				const writes = state.ambientBindingWrites.get(identifier.name) ?? [];
				writes.push(identifier);
				state.ambientBindingWrites.set(identifier.name, writes);
				return;
			}
			binding.mutable = true;
			binding.definitions.push({
				kind: "assignment",
				location: range(identifier)
			});
			binding.initializers.push({
				node: initializer,
				projection: []
			});
			if (conditionallySkipped) state.conditionallySkippedExpressions.add(initializer);
		};
	})))();
}

//#endregion
//#region dist/domain/browserCompleteness.js
var browserSectionSchema, browserExclusionReasonSchema, browserExclusionSchema, browserDroppedEventsSchema, browserCompletenessConditionSchema, browserCompletenessSchema, classifyBrowserCompleteness, sortedSections, canonicalExclusions;
function init_browserCompleteness() {
	return (init_browserCompleteness = __esmMin((() => {
		init_unicodeCodePointOrder();
		browserSectionSchema = z.enum([
			"frames",
			"dom",
			"accessibility",
			"scripts",
			"script_sources",
			"resources",
			"network_requests",
			"network_initiators",
			"console_events",
			"console_text",
			"websocket_connections",
			"websocket_frames",
			"websocket_shapes",
			"json_body_shapes",
			"workers",
			"storage",
			"storage_keys",
			"metadata",
			"webmcp_tools",
			"screenshot",
			"source_maps",
			"timeline"
		]);
		browserExclusionReasonSchema = z.enum([
			"disallowed_origin",
			"unsupported_url",
			"unattributed_origin",
			"not_approved",
			"out_of_target_scope",
			"provider_unavailable",
			"invalid_protocol_value",
			"resource_budget_exhausted"
		]);
		browserExclusionSchema = z.object({
			section: browserSectionSchema,
			reason: browserExclusionReasonSchema,
			count: z.number().int().min(0).nullable()
		});
		browserDroppedEventsSchema = z.object({
			scripts: z.number().int().min(0),
			network_requests: z.number().int().min(0),
			console_events: z.number().int().min(0),
			websocket_connections: z.number().int().min(0),
			websocket_frames: z.number().int().min(0),
			webmcp_tools: z.number().int().min(0),
			timeline_events: z.number().int().min(0),
			total: z.number().int().min(0)
		});
		browserCompletenessConditionSchema = z.enum([
			"complete_within_window",
			"policy_filtered",
			"attach_limited",
			"truncated"
		]);
		browserCompletenessSchema = z.object({
			status: browserCompletenessConditionSchema,
			conditions: z.array(browserCompletenessConditionSchema).min(1).max(3),
			policy_filtered_sections: z.array(browserSectionSchema),
			attach_limited_sections: z.array(browserSectionSchema),
			truncated_sections: z.array(browserSectionSchema),
			unavailable_sections: z.array(browserSectionSchema),
			excluded: z.array(browserExclusionSchema),
			dropped_events: browserDroppedEventsSchema
		});
		classifyBrowserCompleteness = (input) => {
			const policyFiltered = input.policyFilteredSections.size > 0;
			const truncated = input.truncatedSections.size > 0 || Object.values(input.droppedEvents).some((count) => count > 0);
			const attachLimited = input.attachLimitedSections.size > 0 || input.unavailableSections.size > 0;
			const status = truncated ? "truncated" : policyFiltered ? "policy_filtered" : attachLimited ? "attach_limited" : "complete_within_window";
			const conditions = [
				...attachLimited ? ["attach_limited"] : [],
				...policyFiltered ? ["policy_filtered"] : [],
				...truncated ? ["truncated"] : []
			];
			const droppedTotal = Object.values(input.droppedEvents).reduce((sum, count) => sum + count, 0);
			return browserCompletenessSchema.parse({
				status,
				conditions: conditions.length === 0 ? ["complete_within_window"] : conditions,
				policy_filtered_sections: sortedSections(input.policyFilteredSections),
				attach_limited_sections: sortedSections(input.attachLimitedSections),
				truncated_sections: sortedSections(input.truncatedSections),
				unavailable_sections: sortedSections(input.unavailableSections),
				excluded: canonicalExclusions(input.excluded),
				dropped_events: {
					...input.droppedEvents,
					total: droppedTotal
				}
			});
		};
		sortedSections = (sections) => [...sections].sort();
		canonicalExclusions = (exclusions) => [...exclusions].sort((left, right) => compareUnicodeCodePoints(left.section, right.section) || compareUnicodeCodePoints(left.reason, right.reason));
	})))();
}

//#endregion
//#region dist/domain/urlComponents.js
var urlDeclaresQueryOrFragment;
function init_urlComponents() {
	return (init_urlComponents = __esmMin((() => {
		urlDeclaresQueryOrFragment = (url) => url.href.includes("?") || url.href.includes("#");
	})))();
}

//#endregion
//#region dist/domain/browserObservation.js
var parseExactOrigin, browserOriginSchema, isLiteralLoopbackHostname, HTTP_ENDPOINT_MESSAGE, BROWSER_SOCKET_PATH, REDACTED_BROWSER_SOCKET_PATH, httpDiscoveryOrigin, browserSocketAuthority, browserEndpointSchema, browserObservationEndpointSchema, recordedBrowserObservationEndpointSchema, browserAllowedOriginsSchema, browserInput, listBrowserTargetsInputSchema, inspectWebPageInputFacts, inspectWebPageWithoutSourceSchema, inspectWebPageWithSourceShapeSchema, refineInspectWebPageInput, inspectWebPageWithSourceInputSchema, inspectWebPageInputSchema, sanitizedBrowserUrlSchema, sanitizeBrowserUrl, removeUrlUserInfo, credentialFreeHref, sanitizeEndpointCandidate;
function init_browserObservation() {
	return (init_browserObservation = __esmMin((() => {
		init_urlComponents();
		init_recordedTransportUrl();
		parseExactOrigin = (value) => {
			let url;
			try {
				url = new URL(value);
			} catch (cause) {
				void cause;
				return undefined;
			}
			if (url.protocol !== "http:" && url.protocol !== "https:" || url.hostname.includes("*") || url.username !== "" || url.password !== "" || url.pathname !== "/" || urlDeclaresQueryOrFragment(url)) return undefined;
			return url.origin;
		};
		browserOriginSchema = z.string().min(1).transform((value, context) => {
			const origin = parseExactOrigin(value);
			if (origin === undefined) {
				context.addIssue({
					code: "custom",
					message: "Expected one exact HTTP(S) origin without a path or wildcard"
				});
				return z.NEVER;
			}
			return origin;
		});
		isLiteralLoopbackHostname = (hostname) => hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
		HTTP_ENDPOINT_MESSAGE = "CDP endpoint must be an explicit-port HTTP URL on 127.0.0.1 or ::1";
		BROWSER_SOCKET_PATH = "/devtools/browser/";
		REDACTED_BROWSER_SOCKET_PATH = `${BROWSER_SOCKET_PATH}[REDACTED]`;
		httpDiscoveryOrigin = (url) => url.protocol === "http:" && isLiteralLoopbackHostname(url.hostname) && url.port !== "" && url.username === "" && url.password === "" && url.pathname === "/" && !urlDeclaresQueryOrFragment(url) ? url.origin : undefined;
		browserSocketAuthority = (url) => {
			const id = url.pathname.slice(BROWSER_SOCKET_PATH.length);
			return url.protocol === "ws:" && isLiteralLoopbackHostname(url.hostname) && url.port !== "" && url.username === "" && url.password === "" && !urlDeclaresQueryOrFragment(url) && url.pathname.startsWith(BROWSER_SOCKET_PATH) && id.length > 0 && !id.includes("/") ? `${url.protocol}//${url.host}` : undefined;
		};
		browserEndpointSchema = z.string().min(1).transform((value, context) => {
			const url = URL.parse(value);
			const origin = url === null ? undefined : httpDiscoveryOrigin(url);
			if (origin !== undefined) return origin;
			context.addIssue({
				code: "custom",
				message: url === null ? "Invalid CDP endpoint URL" : HTTP_ENDPOINT_MESSAGE
			});
			return z.NEVER;
		});
		browserObservationEndpointSchema = z.string().min(1).describe("Literal loopback CDP endpoint: http://127.0.0.1:PORT, or ws://127.0.0.1:PORT/devtools/browser/ID.").transform((value, context) => {
			const url = URL.parse(value);
			if (url === null) {
				context.addIssue({
					code: "custom",
					message: "Invalid CDP endpoint URL"
				});
				return z.NEVER;
			}
			const origin = httpDiscoveryOrigin(url);
			if (origin !== undefined) return {
				transport: "http_discovery",
				url: origin,
				recorded: origin
			};
			const authority = browserSocketAuthority(url);
			if (authority !== undefined) return {
				transport: "browser_websocket",
				url: url.href,
				recorded: `${authority}${REDACTED_BROWSER_SOCKET_PATH}`
			};
			context.addIssue({
				code: "custom",
				message: url.protocol === "ws:" ? "CDP browser WebSocket must be ws://127.0.0.1:PORT/devtools/browser/ID or ws://[::1]:PORT/devtools/browser/ID" : HTTP_ENDPOINT_MESSAGE
			});
			return z.NEVER;
		});
		recordedBrowserObservationEndpointSchema = z.string().min(1).refine((value) => {
			const url = URL.parse(value);
			return url !== null && (httpDiscoveryOrigin(url) !== undefined || browserSocketAuthority(url) !== undefined && url.pathname === REDACTED_BROWSER_SOCKET_PATH);
		}, { message: "Recorded CDP endpoint must be a loopback HTTP origin or a redacted browser WebSocket URL" });
		browserAllowedOriginsSchema = z.array(browserOriginSchema).transform((origins) => Array.from(new Set(origins)).sort()).default([]);
		browserInput = {
			cdp_endpoint: browserObservationEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema
		};
		listBrowserTargetsInputSchema = z.strictObject({ ...browserInput });
		inspectWebPageInputFacts = {
			...browserInput,
			target_id: z.string().trim().min(1),
			observation_ms: z.number().int().min(0).default(500),
			include_accessibility_text: z.boolean().default(false),
			include_console_text: z.boolean().default(false),
			include_json_body_shapes: z.boolean().default(false),
			include_websocket_shapes: z.boolean().default(false),
			include_storage_keys: z.boolean().default(false),
			include_storage_fingerprints: z.boolean().default(false)
		};
		inspectWebPageWithoutSourceSchema = z.strictObject({
			...inspectWebPageInputFacts,
			include_script_sources: z.literal(false).optional().default(false)
		});
		inspectWebPageWithSourceShapeSchema = z.strictObject({
			...inspectWebPageInputFacts,
			include_script_sources: z.literal(true).default(true)
		});
		refineInspectWebPageInput = (input, context) => {
			if (input.include_storage_fingerprints && !input.include_storage_keys) context.addIssue({
				code: "custom",
				path: ["include_storage_fingerprints"],
				message: "Storage fingerprints require storage key capture"
			});
		};
		inspectWebPageWithSourceInputSchema = inspectWebPageWithSourceShapeSchema.superRefine(refineInspectWebPageInput);
		inspectWebPageInputSchema = z.discriminatedUnion("include_script_sources", [inspectWebPageWithoutSourceSchema.superRefine(refineInspectWebPageInput), inspectWebPageWithSourceShapeSchema.extend({ include_script_sources: z.literal(true) }).superRefine(refineInspectWebPageInput)]);
		sanitizedBrowserUrlSchema = z.object({
			url: z.string(),
			origin: z.string().nullable(),
			query_parameter_names: z.array(z.string()),
			redacted: z.boolean()
		});
		sanitizeBrowserUrl = (value) => {
			let parsed;
			try {
				parsed = new URL(value);
			} catch (cause) {
				void cause;
				return {
					url: value,
					origin: null,
					query_parameter_names: [],
					redacted: false
				};
			}
			const hadCredentials = parsed.username !== "" || parsed.password !== "";
			const names = [...parseUrlQueryParameterNames(parsed.search)];
			const sanitizedUrl = hadCredentials ? removeUrlUserInfo(value, parsed) : value;
			return {
				url: sanitizedUrl,
				origin: parsed.origin === "null" ? null : parsed.origin,
				query_parameter_names: names,
				redacted: hadCredentials
			};
		};
		removeUrlUserInfo = (value, parsed) => {
			const schemeSeparator = value.indexOf("://");
			const authorityStart = schemeSeparator < 0 ? value.startsWith("//") ? 2 : -1 : schemeSeparator + 3;
			if (authorityStart < 0) return credentialFreeHref(parsed);
			const remaining = value.slice(authorityStart);
			const delimiter = remaining.search(/[/?#]/u);
			const authorityEnd = delimiter < 0 ? value.length : authorityStart + delimiter;
			const authority = value.slice(authorityStart, authorityEnd);
			const userInfoEnd = authority.lastIndexOf("@");
			if (userInfoEnd < 0) return credentialFreeHref(parsed);
			const candidate = `${value.slice(0, authorityStart)}${authority.slice(userInfoEnd + 1)}${value.slice(authorityEnd)}`;
			try {
				const candidateUrl = new URL(candidate);
				return candidateUrl.username === "" && candidateUrl.password === "" ? candidate : credentialFreeHref(parsed);
			} catch (cause) {
				void cause;
				return credentialFreeHref(parsed);
			}
		};
		credentialFreeHref = (parsed) => {
			parsed.username = "";
			parsed.password = "";
			return parsed.href;
		};
		sanitizeEndpointCandidate = (value) => {
			return sanitizeBrowserUrl(value).url;
		};
	})))();
}

//#endregion
//#region dist/domain/webContentArtifact.js
var webTextArtifactSchema, createWebTextArtifact;
function init_webContentArtifact() {
	return (init_webContentArtifact = __esmMin((() => {
		webTextArtifactSchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.number().int().min(0),
			media_type: z.string().min(1),
			charset: z.literal("utf-8"),
			text: z.string()
		}).superRefine((artifact, context) => {
			const bytes = Buffer.byteLength(artifact.text);
			const digest = createHash("sha256").update(artifact.text).digest("hex");
			if (artifact.bytes !== bytes) context.addIssue({
				code: "custom",
				path: ["bytes"],
				message: "Byte count mismatch"
			});
			if (artifact.sha256 !== digest) context.addIssue({
				code: "custom",
				path: ["sha256"],
				message: "Digest mismatch"
			});
		});
		createWebTextArtifact = (text, mediaType) => {
			const sha256 = createHash("sha256").update(text).digest("hex");
			return {
				sha256,
				bytes: Buffer.byteLength(text),
				media_type: mediaType,
				charset: "utf-8",
				text
			};
		};
	})))();
}

//#endregion
//#region dist/domain/jsonShape.js
var jsonValueTypeSchema, jsonShapePathSegmentSchema, jsonShapeSchema, arrayElementKey, inferJsonShape, jsonValueType, isRecord, orderedChildren;
function init_jsonShape() {
	return (init_jsonShape = __esmMin((() => {
		init_unicodeCodePointOrder();
		jsonValueTypeSchema = z.enum([
			"object",
			"array",
			"string",
			"number",
			"boolean",
			"null"
		]);
		jsonShapePathSegmentSchema = z.discriminatedUnion("kind", [z.object({
			kind: z.literal("property"),
			name: z.string()
		}), z.object({ kind: z.literal("array-element") })]);
		jsonShapeSchema = z.object({
			root_type: jsonValueTypeSchema,
			node_count: z.number().int().min(1),
			max_depth_observed: z.number().int().min(0),
			properties: z.array(z.object({
				path: z.array(jsonShapePathSegmentSchema).min(1),
				types: z.array(jsonValueTypeSchema).min(1),
				observations: z.number().int().min(1)
			}))
		});
		arrayElementKey = Symbol("array-element");
		inferJsonShape = (text) => {
			let root;
			try {
				root = JSON.parse(text);
			} catch (cause) {
				void cause;
				return null;
			}
			const rootShape = {
				path: [],
				types: new Set(),
				observations: 0
			};
			const childShape = (parent, key) => {
				const children = parent.children ??= new Map();
				const existing = children.get(key);
				if (existing !== undefined) return existing;
				const node = {
					path: [...parent.path, typeof key === "string" ? {
						kind: "property",
						name: key
					} : { kind: "array-element" }],
					types: new Set(),
					observations: 0
				};
				children.set(key, node);
				return node;
			};
			const pending = [{
				value: root,
				shape: rootShape
			}];
			let nodeCount = 0;
			let maxDepthObserved = 0;
			while (pending.length > 0) {
				const current = pending.pop();
				if (current === undefined) break;
				nodeCount += 1;
				maxDepthObserved = Math.max(maxDepthObserved, current.shape.path.length);
				current.shape.types.add(jsonValueType(current.value));
				current.shape.observations += 1;
				if (Array.isArray(current.value)) {
					if (current.value.length === 0) continue;
					const shape = childShape(current.shape, arrayElementKey);
					for (let index = current.value.length - 1; index >= 0; index -= 1) pending.push({
						value: current.value[index],
						shape
					});
					continue;
				}
				if (!isRecord(current.value)) continue;
				const allEntries = Object.entries(current.value);
				for (let index = allEntries.length - 1; index >= 0; index -= 1) {
					const entry = allEntries[index];
					if (entry === undefined) continue;
					const [name, value] = entry;
					pending.push({
						value,
						shape: childShape(current.shape, name)
					});
				}
			}
			const properties = [];
			const shapes = orderedChildren(rootShape);
			while (shapes.length > 0) {
				const shape = shapes.pop();
				if (shape === undefined) break;
				properties.push({
					path: shape.path.map((segment) => ({ ...segment })),
					types: [...shape.types].sort(),
					observations: shape.observations
				});
				for (const child of orderedChildren(shape)) shapes.push(child);
			}
			return {
				root_type: jsonValueType(root),
				node_count: nodeCount,
				max_depth_observed: maxDepthObserved,
				properties
			};
		};
		jsonValueType = (value) => {
			if (value === null) return "null";
			if (Array.isArray(value)) return "array";
			switch (typeof value) {
				case "string": return "string";
				case "number": return "number";
				case "boolean": return "boolean";
				default: return "object";
			}
		};
		isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
		orderedChildren = (node) => [...node.children ?? []].sort(([left], [right]) => left === right ? 0 : left === arrayElementKey ? 1 : right === arrayElementKey ? -1 : compareUnicodeCodePoints(right, left)).map(([, child]) => child);
	})))();
}

//#endregion
//#region dist/domain/browserObservationSchemas.js
var browserVersionSchema, browserTargetSchema, browserTargetListSchema, browserFrameSchema, browserDomNodeSchema, browserAxNodeSchema, browserScriptSourceSchema, browserResourceReconciliationSchema, browserScriptSchema, browserResourceSchema, browserNetworkRequestSchema, browserConsoleEventSchema, browserWebSocketFrameSchema, browserWebSocketConnectionSchema, browserWorkerSchema, browserCspSourceSchema, browserLinkMetadataSchema, browserAgentHintSchema, browserSafeMetadataSchema, webPageInspectionSchema;
function init_browserObservationSchemas() {
	return (init_browserObservationSchemas = __esmMin((() => {
		init_browserCompleteness();
		init_webContentArtifact();
		init_jsonShape();
		init_digests();
		browserVersionSchema = z.object({
			product: z.string(),
			protocol_version: z.string(),
			revision: z.string(),
			user_agent: z.string(),
			js_version: z.string()
		});
		browserTargetSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			title: z.string(),
			url: z.string(),
			origin: z.string(),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown")
		});
		browserTargetListSchema = z.object({
			browser: browserVersionSchema,
			targets: z.array(browserTargetSchema),
			excluded: z.object({
				disallowed_origin: z.number().int().min(0),
				unsupported_url: z.number().int().min(0),
				non_page: z.number().int().min(0)
			}),
			limitations: z.array(z.string())
		});
		browserFrameSchema = z.object({
			frame_id: z.string(),
			parent_frame_id: z.string().nullable(),
			url: z.string(),
			origin: z.string().nullable()
		});
		browserDomNodeSchema = z.object({
			index: z.number().int().min(0),
			parent_index: z.number().int().min(-1),
			node_type: z.number().int().min(0),
			node_name: z.string(),
			node_value_length: z.number().int().min(0),
			attribute_names: z.array(z.string())
		});
		browserAxNodeSchema = z.object({
			node_id: z.string(),
			parent_id: z.string().nullable(),
			role: z.string().nullable(),
			name: z.string().nullable(),
			description: z.string().nullable(),
			ignored: z.boolean(),
			states: z.array(z.object({
				name: z.string(),
				value: z.union([
					z.boolean(),
					z.number(),
					z.string()
				])
			})).default([])
		});
		browserScriptSourceSchema = z.discriminatedUnion("included", [z.object({
			included: z.literal(false),
			reason: z.string()
		}), z.object({
			included: z.literal(true),
			artifact: webTextArtifactSchema
		})]);
		browserResourceReconciliationSchema = z.discriminatedUnion("status", [
			z.object({
				status: z.literal("exact"),
				resource_key: z.string()
			}),
			z.object({
				status: z.literal("ambiguous"),
				candidate_resource_keys: z.array(z.string())
			}),
			z.object({
				status: z.literal("unmatched"),
				reason: z.literal("no_exact_sanitized_url")
			})
		]);
		browserScriptSchema = z.object({
			script_key: z.string().regex(/^scr_[a-f0-9]{64}(?:_[0-9]+)?$/u),
			frame_id: z.string().nullable().default(null),
			url: z.string(),
			origin: z.string().nullable(),
			cdp_hash: z.string().nullable().describe("Producer-reported script hash; null when unavailable."),
			length: z.number().int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
			is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
			language: z.string().nullable(),
			source_map_url: z.string().nullable(),
			resource_reconciliation: browserResourceReconciliationSchema,
			source: browserScriptSourceSchema
		});
		browserResourceSchema = z.object({
			resource_key: prefixedDigestSchema("res"),
			url: z.string(),
			origin: z.string().nullable(),
			type: z.string(),
			mime_type: z.string(),
			content_size: z.number().min(0).nullable()
		});
		browserNetworkRequestSchema = z.object({
			request_id: z.string(),
			url: z.string(),
			origin: z.string().nullable(),
			method: z.string(),
			resource_type: z.string().nullable(),
			status: z.number().nullable(),
			mime_type: z.string().nullable(),
			encoded_data_length: z.number().min(0).nullable(),
			redirects: z.array(z.object({
				url: z.string(),
				response_url: z.string(),
				method: z.string(),
				resource_type: z.string().nullable(),
				status: z.number().nullable(),
				mime_type: z.string().nullable(),
				encoded_data_length: z.number().min(0).nullable(),
				request_timestamp: z.number().nullable(),
				redirect_event_timestamp: z.number().nullable()
			})).optional(),
			initiator: z.object({
				type: z.string(),
				url: z.string().nullable(),
				line: z.number().int().min(0).nullable(),
				column: z.number().int().min(0).nullable()
			}),
			body_shapes: z.object({
				status: z.enum([
					"not_approved",
					"included",
					"partial",
					"unavailable"
				]),
				request: jsonShapeSchema.nullable(),
				response: jsonShapeSchema.nullable()
			})
		});
		browserConsoleEventSchema = z.object({
			type: z.string(),
			timestamp: z.number(),
			argument_types: z.array(z.string()),
			url: z.string().nullable(),
			line: z.number().int().min(0).nullable(),
			column: z.number().int().min(0).nullable(),
			text_capture: z.object({
				status: z.enum(["not_approved", "included"]),
				values: z.array(z.object({
					argument_index: z.number().int().min(0),
					type: z.string(),
					text: z.string()
				})),
				retained_bytes: z.number().int().min(0)
			})
		});
		browserWebSocketFrameSchema = z.object({
			direction: z.enum(["sent", "received"]),
			opcode: z.number().int().min(0),
			payload_bytes: z.number().int().min(0).nullable(),
			payload_shape: z.object({
				format: z.enum([
					"json",
					"text",
					"binary"
				]),
				json_shape: jsonShapeSchema.nullable()
			}).nullable()
		});
		browserWebSocketConnectionSchema = z.object({
			request_id: z.string(),
			url: z.string(),
			events: z.array(browserWebSocketFrameSchema)
		});
		browserWorkerSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			url: z.string(),
			origin: z.string().nullable(),
			attached: z.boolean(),
			opener_target_id: z.string().nullable().default(null),
			parent_frame_id: z.string().nullable().default(null)
		});
		browserCspSourceSchema = z.object({
			kind: z.enum([
				"keyword",
				"scheme",
				"approved_origin",
				"external_origin",
				"other"
			]),
			value: z.string().nullable()
		});
		browserLinkMetadataSchema = z.object({
			href: z.string().nullable(),
			destination_scope: z.enum([
				"approved",
				"outside_policy",
				"unsupported"
			]),
			rel: z.array(z.string()),
			as: z.string().nullable(),
			type: z.string().nullable(),
			crossorigin: z.string().nullable()
		});
		browserAgentHintSchema = z.object({
			mechanism: z.enum([
				"link_rel",
				"dom_link_rel",
				"well_known_resource",
				"response_header"
			]),
			declaration: z.string(),
			url: z.string().nullable(),
			trust: z.literal("page-declared-untrusted")
		});
		browserSafeMetadataSchema = z.object({
			responses: z.array(z.object({
				request_id: z.string(),
				url: z.string(),
				mime_type: z.string().nullable(),
				content_length: z.number().int().min(0).nullable(),
				content_encoding: z.string().nullable(),
				csp: z.object({
					directives: z.array(z.object({
						name: z.string(),
						sources: z.array(browserCspSourceSchema)
					})),
					nonce_count: z.number().int().min(0),
					hash_count: z.number().int().min(0)
				}),
				links: z.array(browserLinkMetadataSchema),
				policies: z.object({
					coop: z.string().nullable(),
					coep: z.string().nullable(),
					corp: z.string().nullable(),
					referrer_policy: z.string().nullable(),
					x_content_type_options: z.string().nullable(),
					permissions_policy_features: z.array(z.string())
				})
			})),
			dom_urls: z.array(z.object({
				node_index: z.number().int().min(0),
				attribute: z.enum([
					"href",
					"src",
					"action",
					"formaction",
					"poster"
				]),
				url: z.string().nullable(),
				destination_scope: z.enum([
					"approved",
					"outside_policy",
					"unsupported"
				])
			})),
			agent_hints: z.array(browserAgentHintSchema),
			excluded_dom_urls: z.number().int().min(0),
			headers_allowlisted: z.literal(true)
		});
		webPageInspectionSchema = z.object({
			browser: browserVersionSchema,
			target: browserTargetSchema,
			capture_window: z.object({
				started_at: z.iso.datetime(),
				ended_at: z.iso.datetime(),
				observation_ms: z.number().int().min(0)
			}),
			completeness: browserCompletenessSchema,
			frames: z.array(browserFrameSchema),
			dom: z.object({
				total_nodes: z.number().int().min(0),
				nodes: z.array(browserDomNodeSchema)
			}),
			accessibility: z.object({
				total_nodes: z.number().int().min(0),
				text_capture: z.object({
					status: z.enum([
						"not_approved",
						"included",
						"unavailable"
					]),
					retained_bytes: z.number().int().min(0),
					excluded_fields: z.number().int().min(0)
				}),
				nodes: z.array(browserAxNodeSchema)
			}),
			scripts: z.object({
				total: z.number().int().min(0),
				items: z.array(browserScriptSchema)
			}),
			resources: z.array(browserResourceSchema),
			network: z.object({
				requests: z.array(browserNetworkRequestSchema),
				websocket_connections: z.array(browserWebSocketConnectionSchema),
				coverage_started_at: z.iso.datetime(),
				prior_activity_available: z.literal(false)
			}),
			console: z.object({
				events: z.array(browserConsoleEventSchema),
				coverage_started_at: z.iso.datetime(),
				prior_activity_available: z.literal(false)
			}),
			workers: z.array(browserWorkerSchema),
			metadata: browserSafeMetadataSchema,
			storage: z.object({
				origin: z.string(),
				usage_bytes: z.number().min(0).nullable(),
				quota_bytes: z.number().min(0).nullable(),
				local_storage_keys: z.array(z.string()),
				session_storage_keys: z.array(z.string()),
				indexed_db_names: z.array(z.string()),
				cache_names: z.array(z.string()),
				content_fingerprints: z.array(z.object({
					scope: z.enum([
						"cookie",
						"local_storage",
						"session_storage",
						"indexed_db_schema",
						"indexed_db_record",
						"cache_entry"
					]),
					identity_sha256: z.string().regex(/^[a-f0-9]{64}$/u),
					value_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
					complete: z.boolean()
				})).default([]),
				fingerprint_algorithm: z.literal("sha256").default("sha256"),
				fingerprints_complete: z.boolean().default(false),
				values_redacted: z.literal(true)
			}),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/webScreenshot.js
var webScreenshotArtifactSchema, captureWebScreenshotInputSchema, webScreenshotSchema, compareWebScreenshotsInputSchema, webScreenshotDiffContextShape, webScreenshotDiffSchema, createWebScreenshotArtifact, decodeCanonicalBase64;
function init_webScreenshot() {
	return (init_webScreenshot = __esmMin((() => {
		init_browserCompleteness();
		init_browserObservation();
		init_browserObservationSchemas();
		webScreenshotArtifactSchema = z.object({
			sha256: z.string().regex(/^[a-f0-9]{64}$/u),
			bytes: z.number().int().min(1),
			media_type: z.literal("image/png"),
			data_base64: z.string()
		}).superRefine((artifact, context) => {
			const bytes = decodeCanonicalBase64(artifact.data_base64);
			if (bytes === undefined) {
				context.addIssue({
					code: "custom",
					message: "Invalid canonical base64"
				});
				return;
			}
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			if (bytes.byteLength !== artifact.bytes || sha256 !== artifact.sha256) context.addIssue({
				code: "custom",
				message: "Screenshot artifact digest or size mismatch"
			});
		});
		captureWebScreenshotInputSchema = z.strictObject({
			cdp_endpoint: browserObservationEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema,
			target_id: z.string().trim().min(1)
		});
		webScreenshotSchema = z.object({
			browser: browserVersionSchema,
			target: z.object({
				target_id: z.string(),
				url: z.string(),
				origin: z.string()
			}),
			captured_at: z.iso.datetime(),
			viewport: z.object({
				width: z.number().int().min(1),
				height: z.number().int().min(1)
			}),
			artifact: webScreenshotArtifactSchema,
			completeness: browserCompletenessSchema,
			limitations: z.array(z.string())
		});
		compareWebScreenshotsInputSchema = z.strictObject({
			before: webScreenshotArtifactSchema,
			after: webScreenshotArtifactSchema,
			channel_threshold: z.number().int().min(0).max(255).default(0)
		});
		webScreenshotDiffContextShape = {
			before: z.object({
				width: z.number().int().min(1),
				height: z.number().int().min(1)
			}),
			after: z.object({
				width: z.number().int().min(1),
				height: z.number().int().min(1)
			}),
			channel_threshold: z.number().int().min(0).max(255),
			limitations: z.array(z.string())
		};
		webScreenshotDiffSchema = z.discriminatedUnion("status", [
			z.object({
				...webScreenshotDiffContextShape,
				status: z.literal("identical"),
				compared_pixels: z.number().int().positive(),
				changed_pixels: z.literal(0),
				changed_ratio: z.literal(0),
				maximum_channel_delta: z.number().int().min(0).max(255),
				mean_absolute_channel_delta: z.number().min(0).max(255)
			}),
			z.object({
				...webScreenshotDiffContextShape,
				status: z.literal("different"),
				compared_pixels: z.number().int().positive(),
				changed_pixels: z.number().int().positive(),
				changed_ratio: z.number().positive().max(1),
				maximum_channel_delta: z.number().int().positive().max(255),
				mean_absolute_channel_delta: z.number().positive().max(255)
			}),
			z.object({
				...webScreenshotDiffContextShape,
				status: z.literal("dimension_mismatch"),
				compared_pixels: z.literal(0),
				changed_pixels: z.null(),
				changed_ratio: z.null(),
				maximum_channel_delta: z.null(),
				mean_absolute_channel_delta: z.null()
			})
		]).superRefine((diff, context) => {
			const sameDimensions = diff.before.width === diff.after.width && diff.before.height === diff.after.height;
			if (sameDimensions !== (diff.status !== "dimension_mismatch")) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Screenshot comparison status must match viewport dimensions"
			});
			if (diff.status !== "dimension_mismatch" && diff.compared_pixels !== diff.before.width * diff.before.height) context.addIssue({
				code: "custom",
				path: ["compared_pixels"],
				message: "Compared pixel count must match the shared dimensions"
			});
		});
		createWebScreenshotArtifact = (bytes) => {
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			return webScreenshotArtifactSchema.parse({
				sha256,
				bytes: bytes.byteLength,
				media_type: "image/png",
				data_base64: bytes.toString("base64")
			});
		};
		decodeCanonicalBase64 = (value) => {
			if (value.length === 0 || value.length % 4 !== 0) return undefined;
			const decoded = Buffer.from(value, "base64");
			return decoded.toString("base64") === value ? decoded : undefined;
		};
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
//#region dist/domain/apple/machoCpuIdentity.js
var CPU_SUBTYPE_CAPABILITY_MASK, machoCpuSubtypeBase;
function init_machoCpuIdentity() {
	return (init_machoCpuIdentity = __esmMin((() => {
		CPU_SUBTYPE_CAPABILITY_MASK = 4278190080;
		machoCpuSubtypeBase = (cpuSubtype) => cpuSubtype & ~CPU_SUBTYPE_CAPABILITY_MASK;
	})))();
}

//#endregion
//#region dist/domain/emptyArraySchema.js
var emptyArraySchema;
function init_emptyArraySchema() {
	return (init_emptyArraySchema = __esmMin((() => {
		emptyArraySchema = z.array(z.never()).length(0);
	})))();
}

//#endregion
//#region dist/domain/browserNetworkEvidence.js
var PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION, browserNetworkContentSelectionValuesSchema, browserNetworkContentSelectionSchema, browserNetworkBodySchema, browserNetworkHeadersSchema;
function init_browserNetworkEvidence() {
	return (init_browserNetworkEvidence = __esmMin((() => {
		PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION = "Captured response-body bytes are the result of Playwright's Response.body() API. Playwright may satisfy that API with a credentialed follow-up load of the request URL when CDP has no body, so transaction and event links do not verify that retained bytes came from the original network transaction.";
		browserNetworkContentSelectionValuesSchema = z.strictObject({
			request_body: z.boolean(),
			response_body: z.boolean(),
			header_values: z.boolean()
		});
		browserNetworkContentSelectionSchema = browserNetworkContentSelectionValuesSchema.extend({
			request_body: z.boolean().default(false),
			response_body: z.boolean().default(false),
			header_values: z.boolean().default(false)
		}).default({
			request_body: false,
			response_body: false,
			header_values: false
		});
		browserNetworkBodySchema = z.union([
			z.strictObject({ state: z.literal("not_requested") }),
			z.strictObject({ state: z.literal("not_exposed") }),
			z.strictObject({
				state: z.literal("unavailable"),
				reason: z.enum([
					"request-failed",
					"response-unfinished",
					"body-read-failed",
					"body-read-timeout",
					"cancelled",
					"capture-ended"
				]),
				message: z.string().min(1)
			}),
			z.strictObject({
				state: z.literal("captured"),
				representation: z.enum([
					"browser-exposed-request-bytes",
					"playwright-response-body-bytes",
					"browser-decoded-response-bytes"
				]),
				encoding: z.literal("base64"),
				content: z.string(),
				bytes: z.number().int().min(0),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				media_type: z.string().nullable(),
				redacted: z.boolean()
			}).superRefine((artifact, context) => {
				const bytes = Buffer.from(artifact.content, "base64");
				if (bytes.toString("base64") !== artifact.content) context.addIssue({
					code: "custom",
					path: ["content"],
					message: "Network body must use canonical base64"
				});
				if (bytes.length !== artifact.bytes) context.addIssue({
					code: "custom",
					path: ["bytes"],
					message: "Network body byte count disagrees with retained bytes"
				});
				if (createHash("sha256").update(bytes).digest("hex") !== artifact.sha256) context.addIssue({
					code: "custom",
					path: ["sha256"],
					message: "Network body digest disagrees with retained bytes"
				});
			})
		]);
		browserNetworkHeadersSchema = z.union([
			z.strictObject({ state: z.literal("not_requested") }),
			z.strictObject({
				state: z.literal("unavailable"),
				message: z.string().min(1)
			}),
			z.strictObject({
				state: z.literal("captured"),
				items: z.array(z.strictObject({
					name: z.string().min(1),
					value: z.string().nullable(),
					redacted: z.boolean()
				}))
			})
		]);
	})))();
}

//#endregion
//#region dist/domain/browserScenarioCaptureValues.js
var textArtifactSchema, captureStateSchema, historySchema, hashedStorageValueShape, redactedStorageValueShape, storageValueFingerprintSchema, storageValueSchema, cookieShape, storageSnapshotSchema, browserStepArtifactsSchema, browserScenarioEventFamilySchema, eventBase, eventUrl, networkEventShape, webSocketFrameShape, browserScenarioEventSchema, completenessSectionSchema, browserScenarioCompletenessSchema, classifyBrowserScenarioCompleteness, browserScenarioStepShape, browserScenarioStepSchema;
function init_browserScenarioCaptureValues() {
	return (init_browserScenarioCaptureValues = __esmMin((() => {
		init_emptyArraySchema();
		init_browserNetworkEvidence();
		init_browserObservation();
		init_webScreenshot();
		init_digests();
		textArtifactSchema = z.strictObject({
			sha256: digestSchema,
			bytes: z.number().int().min(0),
			text: z.string()
		}).superRefine((artifact, context) => {
			const bytes = Buffer.from(artifact.text);
			const sha256 = createHash("sha256").update(bytes).digest("hex");
			if (bytes.byteLength !== artifact.bytes || sha256 !== artifact.sha256) context.addIssue({
				code: "custom",
				message: "Text artifact digest or size mismatch"
			});
		});
		captureStateSchema = (value) => z.discriminatedUnion("state", [
			z.strictObject({
				state: z.literal("captured"),
				value
			}),
			z.strictObject({ state: z.literal("not_requested") }),
			z.strictObject({
				state: z.literal("missing"),
				reason: z.string().min(1)
			}),
			z.strictObject({
				state: z.literal("truncated"),
				observed: z.number().int().min(0),
				retained: z.number().int().min(0),
				reason: z.string().min(1)
			})
		]);
		historySchema = z.strictObject({
			length: z.number().int().min(0),
			current_url: sanitizedBrowserUrlSchema,
			navigation_entries: z.array(z.strictObject({
				type: z.enum([
					"navigate",
					"reload",
					"back_forward",
					"prerender",
					"unknown"
				]),
				name: sanitizedBrowserUrlSchema
			}))
		});
		hashedStorageValueShape = {
			value_state: z.literal("hashed"),
			value_sha256: digestSchema
		};
		redactedStorageValueShape = {
			value_state: z.literal("redacted-secret"),
			value_sha256: z.null()
		};
		storageValueFingerprintSchema = z.discriminatedUnion("value_state", [z.strictObject(hashedStorageValueShape), z.strictObject(redactedStorageValueShape)]);
		storageValueSchema = z.discriminatedUnion("value_state", [z.strictObject({
			name: z.string(),
			...hashedStorageValueShape
		}), z.strictObject({
			name: z.string(),
			...redactedStorageValueShape
		})]);
		cookieShape = {
			name: z.string(),
			domain: z.string(),
			path: z.string(),
			secure: z.boolean(),
			http_only: z.boolean(),
			same_site: z.enum([
				"Strict",
				"Lax",
				"None"
			])
		};
		storageSnapshotSchema = z.strictObject({
			cookies: z.array(z.discriminatedUnion("value_state", [z.strictObject({
				...cookieShape,
				...hashedStorageValueShape
			}), z.strictObject({
				...cookieShape,
				...redactedStorageValueShape
			})])),
			local_storage: z.array(storageValueSchema),
			session_storage: z.array(storageValueSchema)
		});
		browserStepArtifactsSchema = z.strictObject({
			screenshot: captureStateSchema(webScreenshotArtifactSchema),
			dom: captureStateSchema(textArtifactSchema),
			accessibility: captureStateSchema(textArtifactSchema),
			url: captureStateSchema(sanitizedBrowserUrlSchema),
			history: captureStateSchema(historySchema),
			storage: captureStateSchema(storageSnapshotSchema)
		});
		browserScenarioEventFamilySchema = z.enum([
			"console",
			"page-errors",
			"network",
			"websockets",
			"frames",
			"workers",
			"popups",
			"downloads"
		]);
		eventBase = {
			sequence: z.number().int().min(1),
			step_index: z.number().int().min(0)
		};
		eventUrl = sanitizedBrowserUrlSchema.nullable();
		networkEventShape = {
			...eventBase,
			transaction_id: z.string().min(1),
			redirected_from_transaction_id: z.string().min(1).nullable(),
			/** Distinguishes a captured root from an unobserved predecessor for null links. */
			redirected_from_transaction_state: z.enum(["root", "unknown"]).optional(),
			method: z.string().min(1),
			url: sanitizedBrowserUrlSchema,
			resource_type: z.string().min(1),
			header_names: z.array(z.string())
		};
		webSocketFrameShape = {
			...eventBase,
			kind: z.enum(["websocket-frame-sent", "websocket-frame-received"]),
			url: sanitizedBrowserUrlSchema,
			payload_bytes: z.number().int().min(0),
			truncated: z.boolean()
		};
		browserScenarioEventSchema = z.union([
			z.strictObject({
				...eventBase,
				kind: z.literal("console"),
				level: z.string().min(1),
				text: z.string(),
				url: eventUrl
			}),
			z.strictObject({
				...eventBase,
				kind: z.literal("page-error"),
				message: z.string(),
				stack: z.string().nullable()
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request"),
				status: z.null(),
				failure: z.null()
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("response"),
				status: z.number().int().min(100).max(599),
				failure: z.null()
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request-failed"),
				status: z.null(),
				failure: z.string().min(1)
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request-finished"),
				status: z.null(),
				failure: z.null()
			}),
			z.strictObject({
				...networkEventShape,
				kind: z.literal("request-unfinished"),
				status: z.null(),
				failure: z.null(),
				reason: z.enum(["capture-ended", "cancelled"])
			}),
			z.strictObject({
				...eventBase,
				kind: z.literal("network-content"),
				transaction_id: z.string().min(1),
				source_event_sequence: z.number().int().min(1),
				phase: z.enum(["request", "response"]),
				headers: browserNetworkHeadersSchema,
				body: browserNetworkBodySchema
			}),
			z.strictObject({
				...eventBase,
				kind: z.enum(["websocket-opened", "websocket-closed"]),
				url: sanitizedBrowserUrlSchema
			}),
			z.strictObject({
				...webSocketFrameShape,
				payload_type: z.literal("text"),
				payload_text: z.string()
			}),
			z.strictObject({
				...webSocketFrameShape,
				payload_type: z.literal("binary"),
				payload_text: z.null()
			}),
			z.strictObject({
				...eventBase,
				kind: z.enum([
					"frame-attached",
					"frame-detached",
					"frame-navigated",
					"worker-created",
					"worker-closed",
					"popup-opened",
					"popup-closed"
				]),
				url: eventUrl,
				name: z.string().nullable()
			}),
			z.strictObject({
				...eventBase,
				kind: z.literal("download-cancelled"),
				suggested_filename: z.string(),
				url: sanitizedBrowserUrlSchema
			})
		]).superRefine((event, context) => {
			if ("redirected_from_transaction_id" in event && event.redirected_from_transaction_id !== null && event.redirected_from_transaction_state !== undefined) context.addIssue({
				code: "custom",
				message: "Redirect state is valid only when the predecessor transaction ID is null",
				path: ["redirected_from_transaction_state"]
			});
		});
		completenessSectionSchema = z.enum([
			"action",
			"screenshot",
			"dom",
			"accessibility",
			"url",
			"history",
			"storage",
			"events",
			"frames",
			"workers",
			"popups",
			"websockets"
		]);
		browserScenarioCompletenessSchema = z.discriminatedUnion("status", [
			z.strictObject({
				status: z.literal("complete"),
				equality_eligible: z.literal(true),
				missing_sections: emptyArraySchema,
				truncated_sections: emptyArraySchema
			}),
			z.strictObject({
				status: z.literal("incomplete"),
				equality_eligible: z.literal(false),
				missing_sections: z.array(completenessSectionSchema).min(1),
				truncated_sections: emptyArraySchema
			}),
			z.strictObject({
				status: z.literal("truncated"),
				equality_eligible: z.literal(false),
				missing_sections: z.array(completenessSectionSchema),
				truncated_sections: z.array(completenessSectionSchema).min(1)
			})
		]);
		classifyBrowserScenarioCompleteness = (missing, truncated) => {
			const missingSections = [...new Set(missing)].sort();
			const truncatedSections = [...new Set(truncated)].sort();
			if (truncatedSections.length > 0) return browserScenarioCompletenessSchema.parse({
				status: "truncated",
				equality_eligible: false,
				missing_sections: missingSections,
				truncated_sections: truncatedSections
			});
			if (missingSections.length > 0) return browserScenarioCompletenessSchema.parse({
				status: "incomplete",
				equality_eligible: false,
				missing_sections: missingSections,
				truncated_sections: []
			});
			return {
				status: "complete",
				equality_eligible: true,
				missing_sections: [],
				truncated_sections: []
			};
		};
		browserScenarioStepShape = {
			step_index: z.number().int().min(0),
			step_id: z.string().min(1),
			action: z.string().min(1),
			elapsed_ms: z.number().int().min(0),
			before_url: sanitizedBrowserUrlSchema,
			after_url: sanitizedBrowserUrlSchema,
			event_sequence_start: z.number().int().min(1),
			event_sequence_end: z.number().int().min(0),
			artifacts: browserStepArtifactsSchema,
			completeness: browserScenarioCompletenessSchema
		};
		browserScenarioStepSchema = z.union([z.strictObject({
			...browserScenarioStepShape,
			status: z.literal("completed"),
			error: z.null()
		}), z.strictObject({
			...browserScenarioStepShape,
			status: z.enum(["failed", "cancelled"]),
			error: z.string()
		})]);
	})))();
}

//#endregion
//#region dist/domain/browserScenarioCapture.js
var browserScenarioCaptureSchema;
function init_browserScenarioCapture() {
	return (init_browserScenarioCapture = __esmMin((() => {
		init_browserNetworkEvidence();
		init_browserScenarioCaptureValues();
		browserScenarioCaptureSchema = z.strictObject({
			browser: z.strictObject({
				mode: z.enum(["launch", "connect"]),
				process_ownership: z.enum(["provider-owned", "external"]),
				cleanup: z.enum(["terminated-owned-process", "disconnected-external"]),
				product: z.string().min(1),
				version: z.string().min(1)
			}),
			scenario: z.strictObject({
				start_origin: z.string().min(1),
				action_count: z.number().int().min(1),
				secret_references: z.array(z.string().min(1)),
				network_content: browserNetworkContentSelectionValuesSchema,
				event_families: z.array(browserScenarioEventFamilySchema).optional()
			}),
			duration_ms: z.number().int().min(0),
			steps: z.array(browserScenarioStepSchema).min(1),
			events: z.strictObject({
				retained: z.number().int().min(0),
				dropped: z.number().int().min(0),
				items: z.array(browserScenarioEventSchema)
			}),
			completeness: browserScenarioCompletenessSchema,
			limitations: z.array(z.string().min(1))
		}).superRefine((capture, context) => {
			const bySequence = new Map(capture.events.items.map((event) => [event.sequence, event]));
			if (bySequence.size !== capture.events.items.length) context.addIssue({
				code: "custom",
				path: ["events", "items"],
				message: "Event sequence numbers must be unique"
			});
			for (const [index, event] of capture.events.items.entries()) {
				if (event.kind !== "network-content") continue;
				const source = bySequence.get(event.source_event_sequence);
				if (source?.kind !== event.phase || source.transaction_id !== event.transaction_id || source.sequence >= event.sequence) context.addIssue({
					code: "custom",
					path: [
						"events",
						"items",
						index,
						"source_event_sequence"
					],
					message: "Network content must reference an earlier matching transaction phase"
				});
			}
			if (capture.events.retained !== capture.events.items.length) context.addIssue({
				code: "custom",
				path: ["events", "retained"],
				message: "Retained event count must equal items length"
			});
			if (capture.steps.length !== capture.scenario.action_count + 1) context.addIssue({
				code: "custom",
				path: ["steps"],
				message: "Capture must include initial state and one entry per action"
			});
			const expectedIndices = capture.steps.map((_, index) => index);
			if (capture.steps.some(({ step_index: index }, offset) => index !== expectedIndices[offset])) context.addIssue({
				code: "custom",
				path: ["steps"],
				message: "Step indices must be contiguous from zero"
			});
			if (capture.events.items.some(({ step_index: index }) => index >= capture.steps.length)) context.addIssue({
				code: "custom",
				path: ["events", "items"],
				message: "Event references an unknown step index"
			});
		});
	})))();
}

//#endregion
//#region dist/domain/webRuntime.js
var SCRIPT_ID, RESOURCE_LINE, RESOURCE_COLUMN, START_LINE, START_COLUMN, webRuntimeScopeSchema, webRuntimeSourceSchema, webRuntimeLocationSchema, webRuntimeTargetSchema, WEB_RUNTIME_LIMITS;
function init_webRuntime() {
	return (init_webRuntime = __esmMin((() => {
		init_browserObservation();
		init_jsonValue();
		SCRIPT_ID = "CDP session script ID; empty for a position a request initiator reported, which has no session-script association for joining captured source or resource_start.";
		RESOURCE_LINE = "Zero-based line in the resource named by url, as reported by CDP: the script file for an external script (including a module-import initiator), or the HTML document for an inline script or parser markup.";
		RESOURCE_COLUMN = "Zero-based UTF-16 column on that line of the resource named by url, as reported by CDP.";
		START_LINE = "Zero-based line where the script text starts in its enclosing resource (the HTML document for an inline script).";
		START_COLUMN = "Zero-based UTF-16 column where the script text starts on that line of its enclosing resource.";
		webRuntimeScopeSchema = z.strictObject({
			cdp_endpoint: browserEndpointSchema,
			allowed_origins: browserAllowedOriginsSchema,
			target_id: z.string().min(1)
		});
		webRuntimeSourceSchema = z.object({
			script_id: z.string().min(1),
			url: z.string(),
			execution_context_id: z.number().int().nullable(),
			reported_execution_context: jsonObjectSchema.nullable(),
			reported_script_context_aux_data: jsonObjectSchema.nullable(),
			frame_id: z.string().nullable(),
			producer_hash: z.string().nullable(),
			source_map_url: z.string().nullable(),
			has_source_url: z.boolean().nullable(),
			language: z.string().nullable(),
			resource_start: z.object({
				line_number: z.number().int().min(0).describe(START_LINE),
				column_number: z.number().int().min(0).describe(START_COLUMN)
			}).nullable(),
			source: z.discriminatedUnion("state", [z.object({
				state: z.literal("captured"),
				text: z.string(),
				sha256: z.string().regex(/^[a-f0-9]{64}$/u),
				utf8_bytes: z.number().int().min(0),
				utf16_units: z.number().int().min(0)
			}), z.object({
				state: z.enum(["unavailable", "excluded"]),
				reason: z.string().min(1)
			})])
		});
		webRuntimeLocationSchema = z.object({
			script_id: z.string().describe(SCRIPT_ID),
			url: z.string().nullable(),
			line_number: z.number().int().min(0).describe(RESOURCE_LINE),
			column_number: z.number().int().min(0).nullable().describe(RESOURCE_COLUMN),
			function_name: z.string().nullable(),
			source_association: z.enum(["script_id", "unknown"])
		});
		webRuntimeTargetSchema = z.object({
			target_id: z.string().min(1),
			origin: z.string().min(1),
			initial_url: z.string(),
			frame_id: z.string().min(1),
			loader_id: z.string().nullable()
		});
		WEB_RUNTIME_LIMITS = {
			protocolBytes: 64 * 1024 * 1024,
			retainedEventBytes: 8 * 1024 * 1024,
			sourceBytes: 32 * 1024 * 1024,
			commandTimeoutMs: 2e4,
			cleanupTimeoutMs: 5e3
		};
	})))();
}

//#endregion
//#region dist/domain/javascript/electronObservation.js
var approvedElectronInput, listElectronTargetsInputSchema, inspectElectronPageFacts, inspectElectronPageInputSchema, electronTargetSchema, electronTargetListSchema, electronSourceSchema, electronPageInspectionSchema;
function init_electronObservation() {
	return (init_electronObservation = __esmMin((() => {
		init_browserCompleteness();
		init_browserObservation();
		init_browserObservationSchemas();
		init_webContentArtifact();
		init_digests();
		approvedElectronInput = { cdp_endpoint: browserEndpointSchema };
		listElectronTargetsInputSchema = z.strictObject({ ...approvedElectronInput });
		inspectElectronPageFacts = {
			...approvedElectronInput,
			target_id: z.string().trim().min(1),
			observation_ms: z.number().int().min(0).default(100)
		};
		inspectElectronPageInputSchema = z.union([z.strictObject({
			...inspectElectronPageFacts,
			include_script_sources: z.literal(false).default(false)
		}), z.strictObject({
			...inspectElectronPageFacts,
			include_script_sources: z.literal(true)
		})]);
		electronTargetSchema = z.object({
			target_id: z.string(),
			type: z.string(),
			title: z.string(),
			file_path: z.string(),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown")
		});
		electronTargetListSchema = z.object({
			browser: browserVersionSchema,
			targets: z.array(electronTargetSchema),
			excluded: z.object({
				unsupported_url: z.number().int().min(0),
				non_page: z.number().int().min(0)
			}),
			limitations: z.array(z.string())
		});
		electronSourceSchema = z.discriminatedUnion("included", [z.object({
			included: z.literal(false),
			reason: z.string()
		}), z.object({
			included: z.literal(true),
			artifact: webTextArtifactSchema
		})]);
		electronPageInspectionSchema = z.object({
			browser: browserVersionSchema,
			target: electronTargetSchema,
			capture_window: z.object({
				started_at: z.iso.datetime(),
				ended_at: z.iso.datetime(),
				observation_ms: z.number().int().min(0)
			}),
			completeness: browserCompletenessSchema,
			frames: z.array(z.object({
				frame_id: z.string(),
				parent_frame_id: z.string().nullable(),
				file_path: z.string()
			})),
			dom: z.object({
				total_nodes: z.number().int().min(0),
				nodes: z.array(z.object({
					index: z.number().int().min(0),
					parent_index: z.number().int().min(-1),
					node_type: z.number().int().min(0),
					node_name: z.string(),
					node_value_length: z.number().int().min(0),
					attribute_names: z.array(z.string())
				}))
			}),
			scripts: z.object({
				total: z.number().int().min(0),
				items: z.array(z.object({
					script_key: prefixedDigestSchema("electron_script"),
					frame_id: z.string().nullable().default(null),
					file_path: z.string(),
					cdp_hash: z.string().nullable().describe("Producer-reported script hash; null when unavailable."),
					length: z.number().int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
					is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
					language: z.string().nullable(),
					source: electronSourceSchema
				}))
			}),
			resources: z.array(z.object({
				resource_key: prefixedDigestSchema("electron_resource"),
				file_path: z.string(),
				type: z.string(),
				mime_type: z.string(),
				content_size: z.number().min(0).nullable()
			})),
			workers: z.array(z.object({
				target_id: z.string().min(1),
				type: z.string().min(1),
				file_path: z.string(),
				attached: z.boolean(),
				opener_target_id: z.string().min(1).nullable(),
				parent_frame_id: z.string().min(1).nullable()
			})).default([]),
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/electronActiveObservation.js
var pathInputSchema, absolutePathSchema, windowIndexSchema, deepLinkUrlSchema, actionSchema, electronActiveObservationInputSchema, electronActiveTimelineEventSchema, ipcEventSchema, processMetricSchema, windowResultSchema, coverageSchema, actionResultContextShape, actionResultSchema, electronActiveObservationResultSchema;
function init_electronActiveObservation() {
	return (init_electronActiveObservation = __esmMin((() => {
		init_localPath();
		pathInputSchema = localPathStringSchema.refine(isAbsolute, { message: "Electron executable, application, and root paths must be absolute local filesystem paths (for example /Applications/Electron.app/Contents/MacOS/Electron)" });
		absolutePathSchema = z.string().min(1).refine((value) => value.startsWith("/") || /^[A-Za-z]:[\\/]/u.test(value) || value.startsWith("\\\\"), "provider path must be absolute");
		windowIndexSchema = z.number().int().min(0);
		deepLinkUrlSchema = z.string().min(1).refine((value) => {
			try {
				return new URL(value).protocol.length > 0;
			} catch (cause) {
				void cause;
				return false;
			}
		}, "deep-link url must be an absolute URL");
		actionSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("click"),
				selector: z.string().min(1),
				window_index: windowIndexSchema.default(0)
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("wait"),
				duration_ms: z.number().int().min(0),
				window_index: windowIndexSchema.optional()
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("renderer-reload"),
				window_index: windowIndexSchema.default(0)
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("renderer-crash"),
				window_index: windowIndexSchema.default(0)
			}),
			z.strictObject({
				step_id: z.string().min(1),
				kind: z.literal("deep-link"),
				delivery: z.enum(["open-url", "second-instance"]),
				url: deepLinkUrlSchema
			})
		]);
		electronActiveObservationInputSchema = z.strictObject({
			executable_path: pathInputSchema.describe("Absolute local filesystem path for the Electron executable; relative paths are rejected."),
			application_path: pathInputSchema.describe("Absolute local filesystem path for the Electron application; relative paths are rejected."),
			application_root: pathInputSchema.optional().describe("Absolute local filesystem root for application-relative paths; omit to derive it from the application path. Relative paths are rejected."),
			args: z.array(z.string().regex(/^[^\x00]*$/u, "Electron arguments must not contain NUL")).default([]),
			actions: z.array(actionSchema).default([])
		});
		electronActiveTimelineEventSchema = z.strictObject({
			sequence: z.number().int().min(1),
			correlation_id: z.string().nullable(),
			kind: z.enum([
				"main-handler-invocation",
				"main-event-invocation",
				"utility-process-fork",
				"utility-process-message",
				"ipc-main-to-renderer",
				"ipc-utility-to-main",
				"ipc-renderer-send",
				"ipc-renderer-invoke",
				"ipc-renderer-post-message",
				"app-lifecycle",
				"window-lifecycle",
				"web-contents-lifecycle",
				"navigation",
				"shell-attempt",
				"process-lifecycle",
				"permission",
				"popup-attempt",
				"download",
				"protocol",
				"preload",
				"native-addon",
				"updater",
				"error"
			]),
			event: z.string().nullable(),
			phase: z.enum([
				"attempted",
				"completed",
				"blocked",
				"failed",
				"observed"
			]),
			channel: z.string().nullable(),
			direction: z.enum([
				"renderer-to-main",
				"main-to-renderer",
				"main-to-utility",
				"utility-to-main"
			]).nullable(),
			sender: z.string().nullable(),
			receiver: z.string().nullable(),
			frame: z.string().nullable(),
			target: z.string().nullable(),
			argument_shapes: z.array(z.string()),
			result_shape: z.string().nullable(),
			process_type: z.string().nullable(),
			source: z.string(),
			capture_method: z.enum([
				"api-wrapper",
				"event-emitter",
				"process-hook"
			]),
			artifact_path: z.string().nullable(),
			artifact_sha256: z.string().regex(/^[a-f0-9]{64}$/u).nullable(),
			error: z.boolean()
		});
		ipcEventSchema = electronActiveTimelineEventSchema.extend({ kind: z.enum([
			"main-handler-invocation",
			"main-event-invocation",
			"utility-process-fork",
			"utility-process-message",
			"ipc-main-to-renderer",
			"ipc-utility-to-main",
			"ipc-renderer-send",
			"ipc-renderer-invoke",
			"ipc-renderer-post-message"
		]) });
		processMetricSchema = z.strictObject({
			pid: z.number().int().min(1),
			type: z.string().min(1),
			name: z.string().nullable(),
			service_name: z.string().nullable()
		});
		windowResultSchema = z.strictObject({
			window_id: z.string(),
			web_contents_id: z.string(),
			url: z.string(),
			title: z.string(),
			visible: z.boolean().nullable(),
			destroyed: z.boolean()
		});
		coverageSchema = z.strictObject({
			status: z.enum([
				"complete",
				"partial_attach",
				"hook_conflict",
				"target_exited",
				"cleanup_failed"
			]),
			observed_event_families: z.array(z.string()),
			unavailable_event_families: z.array(z.string()),
			observed_roles: z.array(z.string()),
			pre_capture_activity: z.literal("unavailable")
		});
		actionResultContextShape = {
			step_id: z.string().min(1),
			kind: z.enum([
				"click",
				"wait",
				"renderer-reload",
				"renderer-crash",
				"deep-link"
			]),
			window_index: windowIndexSchema.nullable(),
			target: z.string().nullable(),
			elapsed_ms: z.number().int().min(0)
		};
		actionResultSchema = z.discriminatedUnion("status", [z.strictObject({
			...actionResultContextShape,
			status: z.literal("completed"),
			error: z.null()
		}), z.strictObject({
			...actionResultContextShape,
			status: z.enum(["failed", "cancelled"]),
			error: z.string()
		})]);
		electronActiveObservationResultSchema = z.strictObject({
			application: z.strictObject({
				executable_path: absolutePathSchema,
				application_path: absolutePathSchema,
				electron_version: z.string().min(1),
				process_ownership: z.literal("provider-owned"),
				cleanup: z.literal("terminated-owned-process")
			}),
			actions: z.array(actionResultSchema),
			windows: z.array(windowResultSchema),
			processes: z.strictObject({ items: z.array(processMetricSchema) }),
			ipc: z.strictObject({
				events: z.array(ipcEventSchema),
				observed: z.number().int().min(0),
				dropped: z.number().int().min(0)
			}),
			timeline: z.strictObject({
				events: z.array(electronActiveTimelineEventSchema),
				observed: z.number().int().min(0),
				dropped: z.number().int().min(0)
			}),
			retention: z.strictObject({
				budget_bytes: z.number().int().min(0),
				estimated_retained_bytes: z.number().int().min(0),
				event_serialized_byte_upper_bound: z.number().int().min(0),
				retained: z.number().int().min(0),
				dropped: z.number().int().min(0),
				dropped_event_families: z.array(z.strictObject({
					family: z.string().min(1),
					count: z.number().int().min(1)
				})),
				dropped_event_roles: z.array(z.strictObject({
					role: z.string().min(1),
					count: z.number().int().min(1)
				})),
				observed_ipc: z.number().int().min(0),
				dropped_ipc: z.number().int().min(0),
				observed_runtime: z.number().int().min(0),
				dropped_runtime: z.number().int().min(0)
			}),
			coverage: coverageSchema,
			limitations: z.array(z.string())
		});
	})))();
}

//#endregion
//#region dist/domain/javascript/javascriptRuntimeObservation.js
var observationTextSchema, runtimeEndpoint, listJavaScriptRuntimeTargetsInputSchema, javascriptRuntimeKindSchema, observedJavaScriptRuntimeKindSchema, observeJavaScriptRuntimeInputSchema, javascriptRuntimeVersionSchema, javascriptRuntimeLocationSchema, javascriptRuntimeUnresolvedLocationSchema, javascriptRuntimeTargetLocationSchema, javascriptRuntimeTargetSchema, javascriptRuntimeTargetListSchema, javascriptRuntimeScriptSchema, javascriptRuntimeContextSchema, javascriptRuntimeObservationSchema;
function init_javascriptRuntimeObservation() {
	return (init_javascriptRuntimeObservation = __esmMin((() => {
		init_browserObservation();
		init_digests();
		observationTextSchema = z.string().min(1);
		runtimeEndpoint = { inspector_endpoint: browserEndpointSchema };
		listJavaScriptRuntimeTargetsInputSchema = z.strictObject({ ...runtimeEndpoint });
		javascriptRuntimeKindSchema = z.enum([
			"node",
			"electron-main",
			"electron-preload",
			"electron-renderer"
		]);
		observedJavaScriptRuntimeKindSchema = javascriptRuntimeKindSchema.or(z.literal("unknown"));
		observeJavaScriptRuntimeInputSchema = z.strictObject({
			...runtimeEndpoint,
			target_id: z.string().trim().min(1),
			runtime_kind: javascriptRuntimeKindSchema.optional(),
			observation_ms: z.number().int().min(0).default(100)
		});
		javascriptRuntimeVersionSchema = z.strictObject({
			product: z.string().min(1),
			protocol_version: z.string().min(1),
			v8_version: z.string().nullable()
		});
		javascriptRuntimeLocationSchema = z.discriminatedUnion("kind", [
			z.strictObject({
				kind: z.literal("file"),
				file_path: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("url"),
				origin: z.string().min(1),
				sanitized_url: z.string().min(1)
			}),
			z.strictObject({
				kind: z.literal("builtin"),
				specifier: z.string().min(1)
			})
		]);
		javascriptRuntimeUnresolvedLocationSchema = z.strictObject({
			kind: z.literal("unresolved"),
			reported_url: z.string().describe("Raw Inspector URL, which may be empty for anonymous or evaluated code."),
			reason: z.enum(["unverifiable-file-location", "location-authorization-not-attempted"])
		});
		javascriptRuntimeTargetLocationSchema = z.union([javascriptRuntimeLocationSchema, javascriptRuntimeUnresolvedLocationSchema]);
		javascriptRuntimeTargetSchema = z.strictObject({
			target_id: z.string().min(1),
			protocol_type: z.string().min(1),
			attached: z.boolean().nullable().describe("Discovery-reported debugger attachment state; null means unknown"),
			location: javascriptRuntimeTargetLocationSchema
		});
		javascriptRuntimeTargetListSchema = z.strictObject({
			runtime: javascriptRuntimeVersionSchema,
			targets: z.array(javascriptRuntimeTargetSchema),
			excluded: z.strictObject({
				unsupported_location: z.number().int().min(0),
				unconnectable: z.number().int().min(0)
			}),
			limitations: z.array(observationTextSchema)
		});
		javascriptRuntimeScriptSchema = z.strictObject({
			script_key: prefixedDigestSchema("v8_script"),
			location: javascriptRuntimeTargetLocationSchema,
			execution_context_key: z.string().nullable(),
			cdp_hash: z.string().nullable(),
			length: z.number().int().min(0).nullable().describe("Producer-reported script length; null when unavailable."),
			is_module: z.boolean().nullable().describe("Producer-reported module classification; null when unavailable."),
			status: z.literal("observed-loaded")
		});
		javascriptRuntimeContextSchema = z.strictObject({
			context_key: z.string().min(1),
			state: z.enum([
				"created",
				"destroyed",
				"cleared"
			]),
			name: z.string().nullable(),
			origin: z.string().nullable()
		});
		javascriptRuntimeObservationSchema = z.strictObject({
			runtime: javascriptRuntimeVersionSchema,
			target: javascriptRuntimeTargetSchema.extend({
				runtime_kind: observedJavaScriptRuntimeKindSchema,
				runtime_kind_authority: z.enum(["caller-declared-unverified", "not-declared"])
			}),
			capture: z.strictObject({
				observation_ms: z.number().int().min(0),
				events_observed: z.number().int().min(0),
				events_retained: z.number().int().min(0),
				events_dropped: z.number().int().min(0),
				metadata_bytes_retained: z.number().int().min(0),
				truncated: z.boolean(),
				truncation_reasons: z.array(observationTextSchema)
			}),
			scripts: z.strictObject({
				items: z.array(javascriptRuntimeScriptSchema),
				observed_total: z.number().int().min(0),
				excluded: z.strictObject({
					unsupported_location: z.number().int().min(0),
					invalid_protocol_value: z.number().int().min(0)
				})
			}),
			execution_contexts: z.array(javascriptRuntimeContextSchema),
			directly_observed: z.array(observationTextSchema),
			unavailable_without_instrumentation: z.array(observationTextSchema),
			unknowns: z.array(observationTextSchema),
			limitations: z.array(observationTextSchema)
		});
	})))();
}

//#endregion
//#region dist/domain/offsetDateTime.js
var offsetDateTimeSchema, parseOffsetDateTimeInstant, offsetDateTimeInstantFromEpochMilliseconds, fractionalSecondFromMilliseconds, compareOffsetDateTimeInstants;
function init_offsetDateTime() {
	return (init_offsetDateTime = __esmMin((() => {
		offsetDateTimeSchema = z.string().regex(/^(?:(?:\d\d[2468][048]|\d\d[13579][26]|\d\d0[48]|[02468][048]00|[13579][26]00)-02-29|\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\d|30)|(?:02)-(?:0[1-9]|1\d|2[0-8])))T(?:(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|(?:[+\x2d](?:[01]\d|2[0-3]):[0-5]\d)))$/u, "Use an ISO-8601 date-time with an explicit UTC offset");
		parseOffsetDateTimeInstant = (value) => {
			const match = /^(.*?)(?:\.(\d+))?(Z|[+\x2d]\d{2}:\d{2})$/u.exec(value);
			if (match === null) throw new TypeError("Expected a validated offset date-time.");
			const [, dateTime, fractionalDigits, offset] = match;
			if (dateTime === undefined || offset === undefined) throw new TypeError("Expected a validated offset date-time.");
			const wholeSecondMilliseconds = Date.parse(`${dateTime}${offset}`);
			if (!Number.isSafeInteger(wholeSecondMilliseconds) || wholeSecondMilliseconds % 1e3 !== 0) throw new TypeError("Offset date-time is outside the supported time range.");
			return {
				epochSecond: wholeSecondMilliseconds / 1e3,
				fraction: fractionalDigits?.replace(/0+$/u, "") ?? ""
			};
		};
		offsetDateTimeInstantFromEpochMilliseconds = (epochMilliseconds) => {
			if (!Number.isFinite(epochMilliseconds)) throw new TypeError("Expected finite epoch milliseconds.");
			if (Math.abs(epochMilliseconds) > Number.MAX_SAFE_INTEGER) return {
				epochSecond: epochMilliseconds / 1e3,
				fraction: ""
			};
			const epochSecond = Math.floor(epochMilliseconds / 1e3);
			const millisecondsWithinSecond = epochMilliseconds - epochSecond * 1e3;
			return {
				epochSecond,
				fraction: fractionalSecondFromMilliseconds(millisecondsWithinSecond)
			};
		};
		fractionalSecondFromMilliseconds = (milliseconds) => {
			if (milliseconds === 0) return "";
			const [coefficient = "", exponentText] = String(milliseconds).toLowerCase().split("e");
			const exponent = exponentText === undefined ? 0 : Number(exponentText);
			const point = coefficient.indexOf(".");
			const decimalPosition = (point < 0 ? coefficient.length : point) + exponent - 3;
			const digits = coefficient.replace(".", "");
			const fraction = decimalPosition <= 0 ? `0.${"0".repeat(-decimalPosition)}${digits}` : decimalPosition < digits.length ? `${digits.slice(0, decimalPosition)}.${digits.slice(decimalPosition)}` : `${digits}${"0".repeat(decimalPosition - digits.length)}`;
			return (fraction.includes(".") ? fraction.slice(fraction.indexOf(".") + 1) : "").replace(/0+$/u, "");
		};
		compareOffsetDateTimeInstants = (left, right) => {
			if (left.epochSecond !== right.epochSecond) return left.epochSecond < right.epochSecond ? -1 : 1;
			const length = Math.max(left.fraction.length, right.fraction.length);
			for (let index = 0; index < length; index += 1) {
				const leftDigit = left.fraction.charCodeAt(index) || 48;
				const rightDigit = right.fraction.charCodeAt(index) || 48;
				if (leftDigit !== rightDigit) return leftDigit < rightDigit ? -1 : 1;
			}
			return 0;
		};
	})))();
}

//#endregion
//#region dist/domain/reconstructionCoverageVerifierResults.js
var latestVerifierObservationsByVerifier, sameVerifierAssessment, verifierAssessmentIdentity;
function init_reconstructionCoverageVerifierResults() {
	return (init_reconstructionCoverageVerifierResults = __esmMin((() => {
		init_canonicalOrdering();
		init_offsetDateTime();
		latestVerifierObservationsByVerifier = (results) => {
			const latestByVerifier = new Map();
			for (const result of results) {
				const observation = {
					result,
					instant: parseOffsetDateTimeInstant(result.observed_at)
				};
				const latest = latestByVerifier.get(result.verifier_id);
				const latestInstant = latest?.[0]?.instant;
				const comparison = latestInstant === undefined ? 1 : compareOffsetDateTimeInstants(observation.instant, latestInstant);
				if (latest === undefined || comparison > 0) latestByVerifier.set(result.verifier_id, [observation]);
				else if (comparison === 0) latest.push(observation);
			}
			return latestByVerifier;
		};
		sameVerifierAssessment = (left, right) => verifierAssessmentIdentity(left) === verifierAssessmentIdentity(right);
		verifierAssessmentIdentity = (result) => JSON.stringify({
			verifier_id: result.verifier_id,
			contract_sha256: result.contract_sha256,
			status: result.status,
			covered_claim_ids: uniqueSorted$1(result.covered_claim_ids),
			covered_dimensions: uniqueSorted$1(result.covered_dimensions),
			artifact_sha256s: uniqueSorted$1(result.artifact_sha256s),
			owner_sha256s: uniqueSorted$1(result.owner_sha256s),
			normalization_sha256: result.normalization_sha256,
			repeats: result.repeats
		});
	})))();
}

//#endregion
//#region dist/domain/reconstructionCoverageEvaluation.js
var recommendedReconstructionProbes, probeOperation, evaluateReconstructionSurfaces, evaluateOwner, evaluateReconstructionClaims, createVerifierIndexes, evaluateVerifierResult, verifierResultIsCompatible, evaluateReconstructionCoverageRisks, evaluateReconstructionPackageProofs, indexUnique, addReason, addEvidence;
function init_reconstructionCoverageEvaluation() {
	return (init_reconstructionCoverageEvaluation = __esmMin((() => {
		init_offsetDateTime();
		init_reconstructionCoverageVerifierResults();
		recommendedReconstructionProbes = (reasons) => reasons.map((reason) => ({
			operation: probeOperation(reason.code),
			subject_id: reason.subject_id,
			rationale: reason.detail
		}));
		probeOperation = (code) => {
			if (code.startsWith("owner-") || code.startsWith("authority-routing")) return "reconcile_reconstruction_owner";
			if (code.startsWith("verifier-")) return "run_reconstruction_verifier";
			if (code.startsWith("package-proof")) return "verify_reconstruction_package";
			if (code === "active-contradiction") return "resolve_contradiction";
			if (code === "active-unknown") return "probe_residual_unknown";
			return "update_authoritative_inventory";
		};
		evaluateReconstructionSurfaces = (context) => {
			const surfaces = indexUnique(context.coverage.surfaces, "surface_id");
			for (const surfaceId of context.boundary.required_surface_ids) {
				const surface = surfaces.get(surfaceId);
				if (surface === undefined) {
					addReason(context, "surface-missing", surfaceId, "Required surface is absent from the authoritative inventory.");
					continue;
				}
				addEvidence(context, surface.evidence_ids);
				for (const dependencyId of surface.dependency_surface_ids) if (!surfaces.has(dependencyId)) addReason(context, "dependency-surface-missing", surfaceId, `Declared dependency surface is absent: ${dependencyId}`);
				evaluateOwner(context, surfaceId);
			}
		};
		evaluateOwner = (context, surfaceId) => {
			const owners = context.coverage.owners.filter(({ surface_id: id }) => id === surfaceId);
			if (owners.length === 0) {
				addReason(context, "owner-missing", surfaceId, "Required surface has no reconstructed owner or explicit disposition.");
				return;
			}
			if (owners.length > 1) {
				addReason(context, "owner-duplicate", surfaceId, "Required surface has conflicting ownership declarations.");
				return;
			}
			const owner = owners[0]?.ownership;
			if (owner === undefined) return;
			if (owner.disposition !== "implemented") {
				if (!context.boundary.allowed_dispositions.includes(owner.disposition)) addReason(context, "disposition-not-allowed", surfaceId, `${owner.disposition} is not allowed by this completion boundary.`);
				return;
			}
			const ownerChecks = [
				[
					owner.path_state === "missing",
					"owner-path-missing",
					"Declared owner path is missing."
				],
				[
					owner.path_state === "unknown",
					"owner-path-unknown",
					"Declared owner path has not been checked."
				],
				[
					owner.package_state === "missing",
					"owner-undistributed",
					"Declared owner is absent from the distributable."
				],
				[
					owner.package_state === "unknown",
					"owner-distribution-unknown",
					"Owner distribution state is unknown."
				],
				[
					owner.authority_route === "detected",
					"authority-routing-detected",
					"Reconstructed owner routes into the authority."
				],
				[
					owner.authority_route === "unknown",
					"authority-routing-unknown",
					"Authority independence has not been established."
				]
			];
			for (const [matches, code, detail] of ownerChecks) if (matches) addReason(context, code, surfaceId, detail);
		};
		evaluateReconstructionClaims = (context) => {
			const claims = indexUnique(context.coverage.claims, "claim_id");
			const indexes = createVerifierIndexes(context.coverage);
			for (const claimId of context.boundary.required_claim_ids) {
				const claim = claims.get(claimId);
				if (claim === undefined) {
					addReason(context, "claim-missing", claimId, "Required finite claim is absent.");
					continue;
				}
				const contracts = indexes.contractsByClaim.get(claimId) ?? [];
				if (contracts.length === 0) {
					addReason(context, "verifier-missing", claimId, "No verifier contract covers this claim.");
					continue;
				}
				if (contracts.length > 1) {
					addReason(context, "verifier-duplicate", claimId, "Multiple verifier contracts claim primary coverage.");
					continue;
				}
				const contract = contracts[0];
				if (contract !== undefined) evaluateVerifierResult(context, claim, contract, indexes);
			}
		};
		createVerifierIndexes = (coverage) => {
			const contractsByClaim = new Map();
			for (const contract of coverage.verifier_contracts) for (const claimId of new Set(contract.claim_ids)) {
				const contracts = contractsByClaim.get(claimId) ?? [];
				contracts.push(contract);
				contractsByClaim.set(claimId, contracts);
			}
			const ownersBySurface = new Map();
			for (const owner of coverage.owners) {
				const owners = ownersBySurface.get(owner.surface_id) ?? [];
				owners.push(owner);
				ownersBySurface.set(owner.surface_id, owners);
			}
			return {
				contractsByClaim,
				latestResultsByVerifier: latestVerifierObservationsByVerifier(coverage.verifier_results),
				artifactDigests: new Set(coverage.artifacts.map(({ artifact_sha256: value }) => value)),
				ownerDigests: new Set(coverage.owners.flatMap(({ ownership }) => ownership.disposition === "implemented" ? [ownership.owner_sha256] : [])),
				surfaces: indexUnique(coverage.surfaces, "surface_id"),
				artifacts: indexUnique(coverage.artifacts, "artifact_id"),
				ownersBySurface
			};
		};
		evaluateVerifierResult = (context, claim, contract, indexes) => {
			const latestResults = indexes.latestResultsByVerifier.get(contract.verifier_id);
			if (latestResults === undefined) {
				addReason(context, "verifier-result-missing", claim.claim_id, "Verifier has no recorded result.");
				return;
			}
			addEvidence(context, latestResults.flatMap(({ result }) => result.evidence_ids));
			const latest = latestResults[0];
			if (latest === undefined) return;
			const { result } = latest;
			if (!latestResults.every((candidate) => sameVerifierAssessment(result, candidate.result))) {
				addReason(context, "verifier-result-ambiguous", claim.claim_id, "Latest verifier observations have conflicting assessment content.");
				return;
			}
			if (!verifierResultIsCompatible(claim, contract, result, indexes)) {
				addReason(context, "verifier-result-incompatible", claim.claim_id, "Latest verifier result does not match current artifacts, owners, dimensions, authority, normalization, repeats, or contract.");
				return;
			}
			const cutoffEpochMs = context.nowEpochMs - contract.max_age_ms;
			if (compareOffsetDateTimeInstants(latest.instant, context.nowInstant) > 0 || cutoffEpochMs >= -Number.MAX_SAFE_INTEGER && compareOffsetDateTimeInstants(latest.instant, offsetDateTimeInstantFromEpochMilliseconds(cutoffEpochMs)) < 0) {
				addReason(context, "verifier-result-stale", claim.claim_id, "Latest compatible verifier result is stale.");
				return;
			}
			if (result.status === "fail") addReason(context, "verifier-failed", claim.claim_id, "Latest compatible verifier result failed.");
			else if (result.status !== "pass") addReason(context, "verifier-unknown", claim.claim_id, `Latest compatible verifier result is ${result.status}.`);
		};
		verifierResultIsCompatible = (claim, contract, result, indexes) => {
			const expectedArtifactDigests = claim.surface_ids.flatMap((surfaceId) => {
				const surface = indexes.surfaces.get(surfaceId);
				const artifact = surface === undefined ? undefined : indexes.artifacts.get(surface.artifact_id);
				return artifact === undefined ? [] : [artifact.artifact_sha256];
			});
			const expectedOwnerDigests = claim.surface_ids.flatMap((surfaceId) => (indexes.ownersBySurface.get(surfaceId) ?? []).flatMap(({ ownership }) => ownership.disposition === "implemented" ? [ownership.owner_sha256] : []));
			return result.contract_sha256 === contract.contract_sha256 && result.normalization_sha256 === contract.normalization_sha256 && result.covered_claim_ids.includes(claim.claim_id) && result.covered_claim_ids.every((item) => contract.claim_ids.includes(item)) && claim.required_dimensions.every((item) => contract.dimensions.includes(item)) && claim.required_dimensions.every((item) => result.covered_dimensions.includes(item)) && result.covered_dimensions.every((item) => contract.dimensions.includes(item)) && result.artifact_sha256s.every((item) => indexes.artifactDigests.has(item)) && expectedArtifactDigests.every((item) => result.artifact_sha256s.includes(item)) && result.owner_sha256s.every((item) => indexes.ownerDigests.has(item)) && expectedOwnerDigests.every((item) => result.owner_sha256s.includes(item)) && result.repeats >= contract.minimum_repeats && claim.required_authority === contract.authority;
		};
		evaluateReconstructionCoverageRisks = (context) => {
			for (const unknownId of context.coverage.residual_unknown_ids) if (!context.boundary.allowed_unknown_ids.includes(unknownId)) addReason(context, "active-unknown", unknownId, "Active residual unknown is not permitted by the completion boundary.");
			for (const contradiction of context.coverage.contradictions) if (contradiction.status === "active" && (contradiction.surface_ids.some((id) => context.boundary.required_surface_ids.includes(id)) || contradiction.claim_ids.some((id) => context.boundary.required_claim_ids.includes(id)))) {
				addEvidence(context, contradiction.evidence_ids);
				addReason(context, "active-contradiction", contradiction.contradiction_id, "Active contradiction affects the completion boundary.");
			}
		};
		evaluateReconstructionPackageProofs = (context) => {
			const surfaces = new Map(context.coverage.surfaces.map((surface) => [surface.surface_id, surface]));
			const artifacts = new Map(context.coverage.artifacts.map((artifact) => [artifact.artifact_id, artifact]));
			const requiredArtifactDigests = context.boundary.required_surface_ids.flatMap((surfaceId) => {
				const surface = surfaces.get(surfaceId);
				const artifact = surface === undefined ? undefined : artifacts.get(surface.artifact_id);
				return artifact === undefined ? [] : [artifact.artifact_sha256];
			});
			for (const kind of context.boundary.required_package_proof_kinds) {
				const proofs = context.coverage.package_proofs.filter((proof) => proof.kind === kind);
				const passing = proofs.find(({ artifact_sha256s: digests, status }) => status === "pass" && requiredArtifactDigests.every((digest) => digests.includes(digest)));
				if (passing !== undefined) {
					addEvidence(context, passing.evidence_ids);
					continue;
				}
				if (proofs.some(({ status }) => status === "fail")) addReason(context, "package-proof-failed", kind, "Required package or integration proof failed.");
				else if (proofs.length > 0) addReason(context, "package-proof-unknown", kind, "Required package or integration proof is not passing.");
				else addReason(context, "package-proof-missing", kind, "Required package or integration proof is missing.");
			}
		};
		indexUnique = (items, key) => new Map(items.map((item) => [item[key], item]));
		addReason = (context, code, subjectId, detail) => {
			context.reasons.push({
				code,
				subject_id: subjectId,
				detail
			});
		};
		addEvidence = (context, evidenceIds) => {
			for (const evidenceId of evidenceIds) context.evidenceIds.add(evidenceId);
		};
	})))();
}

//#endregion
//#region dist/domain/reconstructionCoverage.js
var evidenceIdSchema$4, stableIdSchema$1, boundedTextSchema, authoritySchema, artifactSchema, surfaceSchema, implementationOwnerSchema, externalOwnerSchema, ownerSchema, claimSchema, verifierContractBaseSchema, verifierContractSchema, verifierResultSchema, contradictionSchema, packageProofSchema, boundarySchema, reconstructionCoverageDataSchema, createReconstructionCoverageData, closureReasonSchema, reconstructionClosureResultSchema, createReconstructionVerifierContract, evaluateReconstructionClosure, validateCoverageReferences, assertUnique, closureStatus, reasonOrder, digest$1;
function init_reconstructionCoverage() {
	return (init_reconstructionCoverage = __esmMin((() => {
		init_unicodeCodePointOrder();
		init_evidenceBundle();
		init_reconstructionCoverageEvaluation();
		init_digests();
		init_offsetDateTime();
		evidenceIdSchema$4 = prefixedDigestSchema("ev");
		stableIdSchema$1 = z.string().regex(/^[A-Za-z][A-Za-z0-9._:\x2f\x2d]{0,199}$/u);
		boundedTextSchema = z.string().trim().min(1);
		authoritySchema = z.enum([
			"observed",
			"derived",
			"inferred",
			"historical",
			"external"
		]);
		artifactSchema = z.strictObject({
			artifact_id: stableIdSchema$1,
			artifact_sha256: digestSchema,
			version: z.string().trim().min(1),
			environment_sha256: digestSchema,
			evidence_ids: z.array(evidenceIdSchema$4).min(1)
		});
		surfaceSchema = z.strictObject({
			surface_id: stableIdSchema$1,
			family: z.string().trim().min(1),
			artifact_id: stableIdSchema$1,
			occurrence_id: z.string().trim().min(1).nullable(),
			location: boundedTextSchema,
			authority: authoritySchema,
			dependency_surface_ids: z.array(stableIdSchema$1),
			evidence_ids: z.array(evidenceIdSchema$4).min(1)
		});
		implementationOwnerSchema = z.strictObject({
			disposition: z.literal("implemented"),
			owner_path: boundedTextSchema,
			owner_export: z.string().trim().min(1).nullable(),
			owner_sha256: digestSchema,
			path_state: z.enum([
				"present",
				"missing",
				"unknown"
			]),
			package_state: z.enum([
				"distributed",
				"missing",
				"unknown"
			]),
			authority_route: z.enum([
				"none",
				"detected",
				"unknown"
			])
		});
		externalOwnerSchema = z.strictObject({
			disposition: z.enum(["external", "non-goal"]),
			rationale: boundedTextSchema
		});
		ownerSchema = z.strictObject({
			surface_id: stableIdSchema$1,
			ownership: z.discriminatedUnion("disposition", [implementationOwnerSchema, externalOwnerSchema])
		});
		claimSchema = z.strictObject({
			claim_id: stableIdSchema$1,
			title: z.string().trim().min(1),
			kind: z.string().trim().min(1),
			surface_ids: z.array(stableIdSchema$1).min(1),
			required_dimensions: z.array(stableIdSchema$1).min(1),
			required_authority: z.enum([
				"shipped-artifact",
				"controlled-replay",
				"live-observation",
				"external"
			])
		});
		verifierContractBaseSchema = z.strictObject({
			verifier_id: stableIdSchema$1,
			claim_ids: z.array(stableIdSchema$1).min(1),
			dimensions: z.array(stableIdSchema$1).min(1),
			authority: z.enum([
				"shipped-artifact",
				"controlled-replay",
				"live-observation",
				"external"
			]),
			max_age_ms: z.number().int().min(1),
			minimum_repeats: z.number().int().min(1),
			normalization_sha256: digestSchema,
			normalization_removes_dimensions: z.literal(false)
		});
		verifierContractSchema = verifierContractBaseSchema.extend({ contract_sha256: digestSchema });
		verifierResultSchema = z.strictObject({
			verifier_id: stableIdSchema$1,
			contract_sha256: digestSchema,
			observed_at: offsetDateTimeSchema,
			status: z.enum([
				"pass",
				"fail",
				"unknown",
				"unsupported",
				"truncated",
				"skipped"
			]),
			covered_claim_ids: z.array(stableIdSchema$1).min(1),
			covered_dimensions: z.array(stableIdSchema$1).min(1),
			artifact_sha256s: z.array(digestSchema).min(1),
			owner_sha256s: z.array(digestSchema),
			normalization_sha256: digestSchema,
			repeats: z.number().int().min(1),
			evidence_ids: z.array(evidenceIdSchema$4).min(1)
		});
		contradictionSchema = z.strictObject({
			contradiction_id: stableIdSchema$1,
			status: z.enum(["active", "resolved"]),
			surface_ids: z.array(stableIdSchema$1),
			claim_ids: z.array(stableIdSchema$1),
			evidence_ids: z.array(evidenceIdSchema$4).min(2)
		});
		packageProofSchema = z.strictObject({
			proof_id: stableIdSchema$1,
			kind: z.enum([
				"build",
				"clean-install",
				"package-contents",
				"runtime-routing",
				"authority-independence"
			]),
			status: z.enum([
				"pass",
				"fail",
				"unknown",
				"unsupported",
				"skipped"
			]),
			artifact_sha256s: z.array(digestSchema).min(1),
			evidence_ids: z.array(evidenceIdSchema$4).min(1)
		});
		boundarySchema = z.strictObject({
			boundary_id: stableIdSchema$1,
			title: z.string().trim().min(1),
			required_surface_ids: z.array(stableIdSchema$1).min(1),
			required_claim_ids: z.array(stableIdSchema$1).min(1),
			required_package_proof_kinds: z.array(packageProofSchema.shape.kind).min(1),
			allowed_dispositions: z.array(z.enum(["external", "non-goal"])),
			allowed_unknown_ids: z.array(stableIdSchema$1)
		});
		reconstructionCoverageDataSchema = z.strictObject({
			evidence_bundle: evidenceBundleSchema,
			artifacts: z.array(artifactSchema),
			surfaces: z.array(surfaceSchema),
			owners: z.array(ownerSchema),
			claims: z.array(claimSchema),
			verifier_contracts: z.array(verifierContractSchema),
			verifier_results: z.array(verifierResultSchema),
			residual_unknown_ids: z.array(stableIdSchema$1),
			contradictions: z.array(contradictionSchema),
			package_proofs: z.array(packageProofSchema),
			boundaries: z.array(boundarySchema)
		});
		createReconstructionCoverageData = (input) => {
			const coverage = reconstructionCoverageDataSchema.parse(input);
			validateCoverageReferences(coverage);
			return coverage;
		};
		closureReasonSchema = z.strictObject({
			code: z.enum([
				"surface-missing",
				"owner-missing",
				"owner-duplicate",
				"owner-path-missing",
				"owner-path-unknown",
				"owner-undistributed",
				"owner-distribution-unknown",
				"authority-routing-detected",
				"authority-routing-unknown",
				"disposition-not-allowed",
				"dependency-surface-missing",
				"claim-missing",
				"verifier-missing",
				"verifier-duplicate",
				"verifier-result-missing",
				"verifier-result-stale",
				"verifier-result-incompatible",
				"verifier-result-ambiguous",
				"verifier-failed",
				"verifier-unknown",
				"active-unknown",
				"active-contradiction",
				"package-proof-missing",
				"package-proof-failed",
				"package-proof-unknown"
			]),
			subject_id: stableIdSchema$1,
			detail: boundedTextSchema
		});
		reconstructionClosureResultSchema = z.strictObject({
			boundary_id: stableIdSchema$1,
			status: z.enum([
				"partial",
				"failed",
				"unknown",
				"ready"
			]),
			summary: z.strictObject({
				required_surfaces: z.number().int().min(0),
				required_claims: z.number().int().min(0),
				reasons: z.number().int().min(0)
			}),
			reasons: z.array(closureReasonSchema),
			recommended_probes: z.array(z.strictObject({
				operation: stableIdSchema$1,
				subject_id: stableIdSchema$1,
				rationale: boundedTextSchema
			})),
			evidence_ids: z.array(evidenceIdSchema$4)
		});
		createReconstructionVerifierContract = (input) => {
			const parsed = verifierContractBaseSchema.parse(input);
			return verifierContractSchema.parse({
				...parsed,
				contract_sha256: digest$1(parsed)
			});
		};
		evaluateReconstructionClosure = (coverageInput, boundaryId, nowEpochMs) => {
			const coverage = createReconstructionCoverageData(coverageInput);
			const boundary = coverage.boundaries.find(({ boundary_id: id }) => id === boundaryId);
			if (boundary === undefined) throw new TypeError(`Unknown reconstruction boundary: ${boundaryId}`);
			const nowInstant = offsetDateTimeInstantFromEpochMilliseconds(nowEpochMs);
			const context = {
				coverage,
				boundary,
				nowEpochMs,
				nowInstant,
				reasons: [],
				evidenceIds: new Set()
			};
			evaluateReconstructionSurfaces(context);
			evaluateReconstructionClaims(context);
			evaluateReconstructionCoverageRisks(context);
			evaluateReconstructionPackageProofs(context);
			const reasons = [...context.reasons].sort(reasonOrder);
			return reconstructionClosureResultSchema.parse({
				boundary_id: boundary.boundary_id,
				status: closureStatus(reasons),
				summary: {
					required_surfaces: boundary.required_surface_ids.length,
					required_claims: boundary.required_claim_ids.length,
					reasons: reasons.length
				},
				reasons,
				recommended_probes: recommendedReconstructionProbes(reasons),
				evidence_ids: [...context.evidenceIds].sort()
			});
		};
		validateCoverageReferences = (workspace) => {
			const evidenceBundle = parseEvidenceBundle(workspace.evidence_bundle);
			const evidenceIds = new Set(evidenceBundle.records.map(({ evidence_id: id }) => id));
			const unknownIds = new Set(evidenceBundle.unknowns.map(({ unknown_id: id }) => id));
			const artifacts = assertUnique(workspace.artifacts, "artifact_id");
			const surfaces = assertUnique(workspace.surfaces, "surface_id");
			const claims = assertUnique(workspace.claims, "claim_id");
			const contracts = assertUnique(workspace.verifier_contracts, "verifier_id");
			assertUnique(workspace.contradictions, "contradiction_id");
			assertUnique(workspace.package_proofs, "proof_id");
			assertUnique(workspace.boundaries, "boundary_id");
			for (const contract of workspace.verifier_contracts) {
				const { contract_sha256: contractSha256, ...base } = contract;
				if (contractSha256 !== digest$1(verifierContractBaseSchema.parse(base))) throw new TypeError(`Verifier contract digest is invalid: ${contract.verifier_id}`);
			}
			for (const surface of workspace.surfaces) if (!artifacts.has(surface.artifact_id)) throw new TypeError(`Surface artifact is missing: ${surface.surface_id}`);
			for (const owner of workspace.owners) if (!surfaces.has(owner.surface_id)) throw new TypeError(`Owner surface is missing: ${owner.surface_id}`);
			for (const claim of workspace.claims) if (claim.surface_ids.some((id) => !surfaces.has(id))) throw new TypeError(`Claim surface is missing: ${claim.claim_id}`);
			for (const contract of workspace.verifier_contracts) if (contract.claim_ids.some((id) => !claims.has(id))) throw new TypeError(`Verifier claim is missing: ${contract.verifier_id}`);
			for (const result of workspace.verifier_results) if (!contracts.has(result.verifier_id)) throw new TypeError(`Verifier result contract is missing: ${result.verifier_id}`);
			const referencedEvidenceIds = [
				...workspace.artifacts.flatMap(({ evidence_ids: ids }) => ids),
				...workspace.surfaces.flatMap(({ evidence_ids: ids }) => ids),
				...workspace.verifier_results.flatMap(({ evidence_ids: ids }) => ids),
				...workspace.contradictions.flatMap(({ evidence_ids: ids }) => ids),
				...workspace.package_proofs.flatMap(({ evidence_ids: ids }) => ids)
			];
			const danglingEvidence = referencedEvidenceIds.find((id) => !evidenceIds.has(id));
			if (danglingEvidence !== undefined) throw new TypeError(`Coverage workspace Evidence is missing: ${danglingEvidence}`);
			const danglingUnknown = workspace.residual_unknown_ids.find((id) => !unknownIds.has(id));
			if (danglingUnknown !== undefined) throw new TypeError(`Coverage workspace residual unknown is missing: ${danglingUnknown}`);
		};
		assertUnique = (items, key) => {
			const values = items.map((item) => item[key]);
			if (new Set(values).size !== values.length) throw new TypeError(`Duplicate reconstruction coverage ${String(key)}`);
			return new Set(values);
		};
		closureStatus = (reasons) => {
			if (reasons.length === 0) return "ready";
			if (reasons.some(({ code }) => [
				"verifier-failed",
				"active-contradiction",
				"authority-routing-detected",
				"owner-path-missing",
				"owner-undistributed",
				"package-proof-failed"
			].includes(code))) return "failed";
			if (reasons.some(({ code }) => [
				"verifier-result-stale",
				"verifier-result-incompatible",
				"verifier-result-ambiguous",
				"verifier-unknown",
				"active-unknown",
				"owner-path-unknown",
				"owner-distribution-unknown",
				"authority-routing-unknown",
				"package-proof-unknown"
			].includes(code))) return "unknown";
			return "partial";
		};
		reasonOrder = (left, right) => compareUnicodeCodePoints(compositeKey([left.code, left.subject_id]), compositeKey([right.code, right.subject_id]));
		digest$1 = (value) => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError("Reconstruction coverage value is not canonical JSON");
			return createHash("sha256").update(encoded).digest("hex");
		};
	})))();
}

//#endregion
//#region dist/domain/reconstructionCoverageInput.js
var reconstructionCoverageEvaluationInputSchema;
function init_reconstructionCoverageInput() {
	return (init_reconstructionCoverageInput = __esmMin((() => {
		init_reconstructionCoverage();
		reconstructionCoverageEvaluationInputSchema = z.strictObject({
			coverage: reconstructionCoverageDataSchema,
			boundary_id: z.string().min(1)
		});
	})))();
}

//#endregion
//#region dist/domain/nativeConvention.js
var foldSegment, REACT_NATIVE_SEGMENTS, FLUTTER_SEGMENTS, UNITY_SEGMENTS, nativeRuntimeConvention, isSwiftRuntimeLibrary;
function init_nativeConvention() {
	return (init_nativeConvention = __esmMin((() => {
		foldSegment = (segment) => segment.toLocaleLowerCase("en-US");
		REACT_NATIVE_SEGMENTS = new Set([
			"react.framework",
			"reactnative.framework",
			"libreactnative.so",
			"libreactnativejni.so",
			"libhermes_executor.so",
			"libhermes.so",
			"hermes.framework"
		]);
		FLUTTER_SEGMENTS = new Set(["libflutter.so", "flutter.framework"]);
		UNITY_SEGMENTS = new Set(["libunity.so", "unityframework.framework"]);
		nativeRuntimeConvention = (path) => {
			for (const segment of path.split("/")) {
				const folded = foldSegment(segment);
				if (REACT_NATIVE_SEGMENTS.has(folded)) return "react-native";
				if (FLUTTER_SEGMENTS.has(folded)) return "flutter";
				if (UNITY_SEGMENTS.has(folded)) return "unity";
			}
			return null;
		};
		isSwiftRuntimeLibrary = (path) => path.split("/").some((segment) => /^libswift.+\.dylib$/u.test(foldSegment(segment)));
	})))();
}

//#endregion
//#region dist/domain/bridgeCandidateProjection.js
var bridgeCandidateCoverageSchema, MAX_BRIDGE_CANDIDATE_JSON_BYTES, jsonText, projectCartesianCandidates;
function init_bridgeCandidateProjection() {
	return (init_bridgeCandidateProjection = __esmMin((() => {
		bridgeCandidateCoverageSchema = z.strictObject({
			status: z.enum(["complete", "partial"]),
			total_candidates: z.number().int().nonnegative(),
			emitted_candidates: z.number().int().nonnegative(),
			omitted_candidates: z.number().int().nonnegative()
		});
		MAX_BRIDGE_CANDIDATE_JSON_BYTES = 2 * 1024 * 1024;
		jsonText = (value) => {
			const serialized = JSON.stringify(value);
			if (serialized === undefined) throw new TypeError("Bridge candidate is not JSON serializable");
			return serialized;
		};
		projectCartesianCandidates = (input) => {
			const total = input.groups.reduce((sum, group) => sum + group.left.length * group.right.length, 0);
			const preparedGroups = input.groups.map((group) => ({
				left: group.left.map((value) => ({
					value,
					pathBytes: Buffer.byteLength(jsonText(value.path))
				})),
				right: group.right.map((value) => {
					const emptyLeftCandidate = jsonText(input.createCandidate("", value));
					return {
						value,
						rowOverhead: Buffer.byteLength(emptyLeftCandidate) - 2
					};
				})
			}));
			let estimatedFullBytes = 2 + Math.max(0, total - 1);
			for (const group of preparedGroups) {
				estimatedFullBytes += group.left.length * group.right.reduce((sum, { rowOverhead }) => sum + rowOverhead, 0) + group.right.length * group.left.reduce((sum, { pathBytes }) => sum + pathBytes, 0);
			}
			const shouldEmitAll = estimatedFullBytes <= MAX_BRIDGE_CANDIDATE_JSON_BYTES;
			const candidates = [];
			let estimatedRetainedBytes = 2;
			candidateLoop: for (const group of preparedGroups) {
				for (const left of group.left) {
					for (const right of group.right) {
						const candidateBytes = right.rowOverhead + left.pathBytes;
						const additionalBytes = candidateBytes + (candidates.length > 0 ? 1 : 0);
						if (!shouldEmitAll && estimatedRetainedBytes + additionalBytes > 2097152) break candidateLoop;
						candidates.push(input.createCandidate(left.value.path, right.value));
						estimatedRetainedBytes += additionalBytes;
					}
				}
			}
			return {
				candidates,
				coverage: {
					status: candidates.length === total ? "complete" : "partial",
					total_candidates: total,
					emitted_candidates: candidates.length,
					omitted_candidates: total - candidates.length
				}
			};
		};
	})))();
}

//#endregion
//#region dist/domain/mobileApplicationGraphProjection.js
var projectionEvidenceIdSchema, projectionPathSchema, applicationInventoryProjectionInputSchema, projectedComponentSchema, unavailableComponentSchema, projectedBridgeCandidateSchema, projectionCoverage, projectedComponents, unavailableComponents, projectionDigest;
function init_mobileApplicationGraphProjection() {
	return (init_mobileApplicationGraphProjection = __esmMin((() => {
		init_artifactInventoryEvidence();
		init_evidence();
		init_digests();
		init_bridgeCandidateProjection();
		projectionEvidenceIdSchema = prefixedDigestSchema("ev");
		projectionPathSchema = z.string().min(1);
		applicationInventoryProjectionInputSchema = z.strictObject({ inventory_evidence: z.array(evidenceSchema).min(1) });
		projectedComponentSchema = z.strictObject({
			path: projectionPathSchema,
			artifact_id: prefixedDigestSchema("art"),
			sha256: digestSchema,
			format: z.string().min(1)
		});
		unavailableComponentSchema = z.strictObject({
			path: projectionPathSchema,
			artifact_id: z.null(),
			sha256: z.null(),
			format: z.string().min(1),
			encrypted: z.boolean(),
			limitations: z.array(z.string())
		});
		projectedBridgeCandidateSchema = (basis) => z.strictObject({
			managed_path: projectionPathSchema,
			native_path: projectionPathSchema,
			basis: z.enum(basis)
		});
		projectionCoverage = (inventory, budgetComplete) => ({
			status: hasCompleteInventoryCoverage(inventory, "container-entries") && budgetComplete ? "complete-within-inventory" : "partial",
			inventory_complete: inventory.complete
		});
		projectedComponents = (inventory) => {
			const nodes = new Map(inventory.nodes.map((node) => [node.artifact_id, node]));
			return inventory.occurrences.filter((occurrence) => occurrence.artifact_id !== null && occurrence.logical_path !== ".").map((occurrence) => {
				const node = nodes.get(occurrence.artifact_id ?? "");
				if (node === undefined) throw new TypeError("Application projection occurrence has no artifact node");
				return {
					path: occurrence.logical_path,
					artifact_id: node.artifact_id,
					sha256: node.sha256,
					format: occurrence.artifact_format
				};
			});
		};
		unavailableComponents = (inventory) => inventory.occurrences.filter((occurrence) => occurrence.logical_path !== "." && occurrence.artifact_id === null).map((occurrence) => ({
			path: occurrence.logical_path,
			artifact_id: null,
			sha256: null,
			format: occurrence.artifact_format,
			encrypted: occurrence.encrypted,
			limitations: occurrence.limitations
		}));
		projectionDigest = (value, label) => {
			const encoded = canonicalize(value);
			if (encoded === undefined) throw new TypeError(`${label} is not canonical JSON`);
			return createHash("sha256").update(encoded).digest("hex");
		};
	})))();
}

//#endregion
//#region dist/domain/android/androidApplication.js
var evidenceIdSchema$3, componentSchema$1, androidApplicationProjectionInputSchema, androidApplicationProjectionResultSchema, projectAndroidApplication, classify$1, runtimeFamilies$1, bridgeCandidates$1, bridgeBasis$1;
function init_androidApplication() {
	return (init_androidApplication = __esmMin((() => {
		init_artifactInventoryEvidence();
		init_digests();
		init_nativeConvention();
		init_mobileApplicationGraphProjection();
		init_unicodeCodePointOrder();
		evidenceIdSchema$3 = projectionEvidenceIdSchema;
		componentSchema$1 = projectedComponentSchema;
		androidApplicationProjectionInputSchema = applicationInventoryProjectionInputSchema;
		androidApplicationProjectionResultSchema = z.strictObject({
			projection_id: prefixedDigestSchema("adp"),
			root_sha256: digestSchema,
			root_format: z.literal("apk"),
			source_evidence_ids: z.array(evidenceIdSchema$3).min(1),
			components: z.strictObject({
				manifests: z.array(componentSchema$1),
				resources: z.array(componentSchema$1),
				dex: z.array(componentSchema$1),
				jvm_classes: z.array(componentSchema$1),
				native_libraries: z.array(componentSchema$1),
				javascript: z.array(componentSchema$1),
				signing: z.array(componentSchema$1)
			}),
			unavailable_components: z.array(unavailableComponentSchema),
			runtime_families: z.array(z.enum([
				"dalvik-art",
				"java-kotlin",
				"native",
				"javascript",
				"react-native",
				"flutter",
				"unity"
			])),
			bridge_candidates: z.array(projectedBridgeCandidateSchema([
				"managed-and-native-content",
				"jni-library-convention",
				"react-native-convention",
				"flutter-convention",
				"unity-convention"
			])),
			bridge_candidate_coverage: bridgeCandidateCoverageSchema,
			coverage: z.strictObject({
				status: z.enum(["complete-within-inventory", "partial"]),
				inventory_complete: z.boolean()
			}),
			limitations: z.array(z.string())
		});
		projectAndroidApplication = (input) => {
			const parsed = androidApplicationProjectionInputSchema.parse(input);
			const { evidence, inventory } = parseArtifactInventoryEvidence(parsed.inventory_evidence);
			if (inventory.manifest.root_format !== "apk") throw new TypeError(`Android application projection requires APK inventory Evidence; the inventory root format is ${inventory.manifest.root_format}. APK is chosen for a ZIP archive whose name ends in .apk.`);
			const all = projectedComponents(inventory);
			const unavailable = unavailableComponents(inventory);
			const classified = classify$1(all);
			const bridgeProjection = bridgeCandidates$1([...classified.dex, ...classified.jvm_classes], classified.native_libraries);
			const components = classified;
			const limitations = [
				...inventory.limitations,
				...!hasCompleteInventoryCoverage(inventory, "container-entries") ? ["Source inventory coverage is partial; absence is unknown."] : [],
				"Manifest, resource, signing, and bytecode semantics require a dedicated Android provider; this projection reports exact inventory paths and hashes only.",
				"Runtime families are inferred from inventory formats and paths; filename suffixes do not establish valid DEX or JVM class bytes.",
				"Bridge candidates are path-based hypotheses, not decoded JNI declarations or observed runtime calls.",
				"A bridge basis is inferred from the native path and is repeated for every managed component.",
				"ZIP inventory cannot see the APK Signing Block, so an empty signing array does not mean the APK is unsigned.",
				...all.some(({ path }) => path === "AndroidManifest.xml") ? [] : ["No root AndroidManifest.xml occurrence was observed. The APK family comes from the .apk suffix of a ZIP archive, so these bytes may not be an APK."],
				...bridgeProjection.coverage.status === "partial" ? [`Bridge candidate pairs exceeded the projection safety budget; ${bridgeProjection.coverage.omitted_candidates} hypotheses are omitted. Component arrays still include every component from the supplied inventory pages.`] : [],
				...unavailable.length > 0 ? ["Some inventoried occurrences have no authenticated content identity. Their paths and limitations are retained in unavailable_components; component absence is unknown."] : []
			];
			const withoutId = {
				root_sha256: inventory.manifest.root_sha256,
				root_format: "apk",
				source_evidence_ids: evidence.map(({ evidence_id: id }) => id).sort(compareUnicodeCodePoints),
				components,
				unavailable_components: unavailable,
				runtime_families: runtimeFamilies$1(all),
				bridge_candidates: bridgeProjection.candidates,
				bridge_candidate_coverage: bridgeProjection.coverage,
				coverage: projectionCoverage(inventory, bridgeProjection.coverage.status === "complete" && unavailable.length === 0),
				limitations
			};
			return androidApplicationProjectionResultSchema.parse({
				...withoutId,
				projection_id: `adp_${projectionDigest(withoutId, "Android application projection")}`
			});
		};
		classify$1 = (all) => ({
			manifests: all.filter(({ path }) => /(?:^|\/)AndroidManifest\.xml$/u.test(path)),
			resources: all.filter(({ path }) => /(?:^|\/)resources\.arsc$/u.test(path)),
			dex: all.filter(({ path }) => /(?:^|\/)[^/]+\.dex$/iu.test(path)),
			jvm_classes: all.filter(({ path }) => /(?:^|\/)[^/]+\.class$/iu.test(path)),
			native_libraries: all.filter(({ path, format }) => format === "elf" || /(?:^|\/)lib\/[^/]+\/[^/]+\.so$/iu.test(path)),
			javascript: all.filter(({ format }) => format === "javascript-bundle"),
			signing: all.filter(({ path }) => /^META-INF\/[^/]+\.(?:MF|RSA|DSA|EC|SF)$/iu.test(path))
		});
		runtimeFamilies$1 = (all) => {
			const families = new Set();
			if (all.some(({ path }) => path.toLowerCase().endsWith(".dex"))) families.add("dalvik-art");
			if (all.some(({ path }) => path.toLowerCase().endsWith(".class"))) families.add("java-kotlin");
			if (all.some(({ format }) => format === "elf")) families.add("native");
			if (all.some(({ format }) => format === "javascript-bundle")) families.add("javascript");
			for (const { path } of all) {
				const convention = nativeRuntimeConvention(path);
				if (convention !== null) families.add(convention);
			}
			return [...families].sort(compareUnicodeCodePoints);
		};
		bridgeCandidates$1 = (managed, native) => {
			return projectCartesianCandidates({
				groups: [{
					left: managed,
					right: native
				}],
				createCandidate: (managed_path, target) => ({
					managed_path,
					native_path: target.path,
					basis: bridgeBasis$1(target.path)
				})
			});
		};
		bridgeBasis$1 = (path) => {
			const convention = nativeRuntimeConvention(path);
			if (convention === "react-native") return "react-native-convention";
			if (convention === "flutter") return "flutter-convention";
			if (convention === "unity") return "unity-convention";
			if (/(?:^|\/)lib\/[^/]+\/lib[^/]+\.so$/iu.test(path)) return "jni-library-convention";
			return "managed-and-native-content";
		};
	})))();
}

//#endregion
//#region dist/domain/apple/appleBundleAnatomy.js
var pathSchema$1, BUNDLE_EXTENSION, MACH_O_FORMATS, appleComponentSchema, appleBundleSchema, isMachOFormat, isSidecar, isWithin, anatomyNameIs, anatomyChild, anatomyTailMatches, applicationRoots, detectBundles, indexTree, joinPath, directoryOf, enclosingBundle, bundleLayout, bundleRole, directFiles, contentDirectories, namedChild, infoPlistPath, executableCandidates, signingPaths, platformsOf;
function init_appleBundleAnatomy() {
	return (init_appleBundleAnatomy = __esmMin((() => {
		init_digests();
		init_unicodeCodePointOrder();
		pathSchema$1 = z.string().min(1);
		BUNDLE_EXTENSION = /\.(?:app|appex|xpc|framework|systemextension|dext|bundle|plugin|qlgenerator|mdimporter)$/iu;
		MACH_O_FORMATS = ["mach-o", "mach-o-universal"];
		appleComponentSchema = z.strictObject({
			path: pathSchema$1,
			artifact_id: prefixedDigestSchema("art"),
			sha256: digestSchema,
			format: z.string().min(1)
		});
		appleBundleSchema = z.strictObject({
			path: pathSchema$1,
			parent_path: pathSchema$1.nullable(),
			layout: z.enum([
				"shallow",
				"macos-deep",
				"versioned-framework"
			]),
			role: z.enum([
				"application",
				"app-extension",
				"xpc-service",
				"framework",
				"login-item",
				"system-extension",
				"driver-extension",
				"plug-in",
				"resource-bundle",
				"bundle",
				"helper-application",
				"nested-application"
			]),
			role_basis: z.literal("path-convention"),
			info_plist_path: pathSchema$1.nullable(),
			executable_candidates: z.array(pathSchema$1),
			signing_paths: z.array(pathSchema$1)
		});
		isMachOFormat = (format) => MACH_O_FORMATS.includes(format);
		isSidecar = (path) => {
			const segments = path.split("/");
			return segments.includes("__MACOSX") || (segments.at(-1) ?? "").startsWith("._");
		};
		isWithin = (path, root) => root === "." || path === root || path.startsWith(`${root}/`);
		anatomyNameIs = (actual, expected) => actual.toLocaleLowerCase("en-US") === expected.toLocaleLowerCase("en-US");
		anatomyChild = (names, expected) => {
			if (names === undefined) return null;
			let exact;
			let folded;
			for (const name of names) {
				if (name === expected) exact = name;
				else if (anatomyNameIs(name, expected) && (folded === undefined || compareUnicodeCodePoints(name, folded) < 0)) folded = name;
			}
			return exact ?? folded ?? null;
		};
		anatomyTailMatches = (path, expected) => {
			const actual = path.split("/");
			if (actual.length < expected.length) return false;
			const tail = actual.slice(-expected.length);
			return expected.every((name, index) => {
				const segment = tail[index];
				if (segment === undefined || segment.length === 0) return false;
				return name === "*" || anatomyNameIs(segment, name);
			});
		};
		applicationRoots = (entries, subject) => {
			if (subject.format === "directory" && /\.app$/iu.test(subject.name)) return ["."];
			const found = new Set();
			for (const { path } of entries) {
				if (isSidecar(path)) continue;
				const segments = path.split("/");
				const app = segments[1];
				if (anatomyNameIs(segments[0] ?? "", "Payload") && app !== undefined && /\.app$/iu.test(app)) {
					found.add(`${segments[0]}/${app}`);
					continue;
				}
				const index = segments.findIndex((segment, position) => /\.app$/iu.test(segment) && anatomyNameIs(segments[position + 1] ?? "", "Contents"));
				if (index >= 0) found.add(segments.slice(0, index + 1).join("/"));
			}
			const roots = [...found];
			return roots.filter((root) => !roots.some((other) => other !== root && isWithin(root, other))).sort(compareUnicodeCodePoints);
		};
		detectBundles = (entries, roots) => {
			const paths = new Set(roots);
			for (const { path, kind } of entries) {
				if (isSidecar(path)) continue;
				const root = roots.find((candidate) => isWithin(path, candidate));
				if (root === undefined) continue;
				const segments = path.split("/");
				const start = root === "." ? 0 : root.split("/").length;
				for (let index = start; index < segments.length; index++) {
					const segment = segments[index] ?? "";
					const leaf = index === segments.length - 1;
					if (BUNDLE_EXTENSION.test(segment) && (!leaf || kind === "directory")) paths.add(segments.slice(0, index + 1).join("/"));
				}
			}
			const tree = indexTree(entries);
			return [...paths].sort(compareUnicodeCodePoints).map((path) => {
				const layout = bundleLayout(path, tree);
				return {
					path,
					parent_path: enclosingBundle(path, paths),
					layout,
					role: roots.includes(path) ? "application" : bundleRole(path),
					role_basis: "path-convention",
					info_plist_path: infoPlistPath(path, layout, tree),
					executable_candidates: executableCandidates(path, layout, tree),
					signing_paths: signingPaths(path, layout, tree)
				};
			});
		};
		indexTree = (entries) => {
			const children = new Map();
			const files = new Map();
			const directories = new Set();
			for (const { path, kind, component } of entries) {
				if (isSidecar(path)) continue;
				if (kind === "file" && component !== undefined) files.set(path, component);
				if (kind === "directory") directories.add(path);
				const segments = path.split("/");
				let parent = "";
				for (const segment of segments) {
					const names = children.get(parent) ?? new Set();
					names.add(segment);
					children.set(parent, names);
					parent = joinPath(parent, segment);
					if (parent !== path) directories.add(parent);
				}
			}
			return {
				children,
				files,
				directories
			};
		};
		joinPath = (directory, name) => directory === "" ? name : `${directory}/${name}`;
		directoryOf = (bundle) => bundle === "." ? "" : bundle;
		enclosingBundle = (path, bundles) => {
			if (path === ".") return null;
			const segments = path.split("/");
			for (let length = segments.length - 1; length > 0; length--) {
				const candidate = segments.slice(0, length).join("/");
				if (bundles.has(candidate)) return candidate;
			}
			return bundles.has(".") ? "." : null;
		};
		bundleLayout = (bundle, tree) => {
			const names = tree.children.get(directoryOf(bundle));
			if (anatomyChild(names, "Contents") !== null) return "macos-deep";
			if (anatomyChild(names, "Versions") !== null) return "versioned-framework";
			return "shallow";
		};
		bundleRole = (bundle) => {
			const segments = bundle.split("/");
			const name = (segments.at(-1) ?? "").toLowerCase();
			const container = segments.at(-2);
			if (name.endsWith(".appex")) return "app-extension";
			if (name.endsWith(".xpc")) return "xpc-service";
			if (name.endsWith(".framework")) return "framework";
			if (name.endsWith(".systemextension")) return "system-extension";
			if (name.endsWith(".dext")) return "driver-extension";
			if (name.endsWith(".bundle")) {
				if (anatomyNameIs(container ?? "", "PlugIns")) return "plug-in";
				return anatomyNameIs(container ?? "", "Resources") ? "resource-bundle" : "bundle";
			}
			if (!name.endsWith(".app")) return "plug-in";
			if (anatomyNameIs(container ?? "", "LoginItems") && anatomyNameIs(segments.at(-3) ?? "", "Library")) return "login-item";
			if (anatomyNameIs(container ?? "", "Helpers")) return "helper-application";
			return "nested-application";
		};
		directFiles = (directory, tree) => [...tree.children.get(directory) ?? []].map((name) => joinPath(directory, name)).filter((path) => tree.files.has(path)).sort(compareUnicodeCodePoints);
		contentDirectories = (bundle, layout, tree) => {
			const directory = directoryOf(bundle);
			if (layout === "macos-deep") {
				const contents = namedChild(tree, directory, "Contents");
				return contents === null ? [] : [contents];
			}
			if (layout === "shallow") return [directory];
			const versions = namedChild(tree, directory, "Versions");
			if (versions === null) return [];
			return [...tree.children.get(versions) ?? []].filter((version) => !anatomyNameIs(version, "Current")).map((version) => joinPath(versions, version)).filter((version) => tree.directories.has(version)).sort(compareUnicodeCodePoints);
		};
		namedChild = (tree, directory, expected) => {
			const name = anatomyChild(tree.children.get(directory), expected);
			return name === null ? null : joinPath(directory, name);
		};
		infoPlistPath = (bundle, layout, tree) => {
			const directories = contentDirectories(bundle, layout, tree);
			if (directories.length !== 1) return null;
			const directory = directories[0];
			if (directory === undefined) return null;
			const parent = layout === "versioned-framework" ? namedChild(tree, directory, "Resources") : directory;
			if (parent === null) return null;
			const info = namedChild(tree, parent, "Info.plist");
			return info !== null && tree.files.has(info) ? info : null;
		};
		executableCandidates = (bundle, layout, tree) => contentDirectories(bundle, layout, tree).flatMap((directory) => {
			const executableDirectory = layout === "macos-deep" ? namedChild(tree, directory, "MacOS") : directory;
			return executableDirectory === null ? [] : directFiles(executableDirectory, tree);
		}).filter((path) => MACH_O_FORMATS.includes(tree.files.get(path)?.format ?? ""));
		signingPaths = (bundle, layout, tree) => contentDirectories(bundle, layout, tree).flatMap((directory) => {
			const signature = namedChild(tree, directory, "_CodeSignature");
			return [
				signature === null ? null : namedChild(tree, signature, "CodeResources"),
				namedChild(tree, directory, "embedded.provisionprofile"),
				namedChild(tree, directory, "embedded.mobileprovision")
			];
		}).filter((path) => path !== null && tree.files.has(path)).sort(compareUnicodeCodePoints);
		platformsOf = (bundles) => [...new Set(bundles.flatMap(({ role, layout, info_plist_path: plist }) => {
			if (role !== "application") return [];
			if (layout === "macos-deep") return ["macos"];
			if (layout === "shallow" && plist !== null) return ["ios"];
			return [];
		}))].sort(compareUnicodeCodePoints);
	})))();
}

//#endregion
//#region dist/domain/apple/appleApplication.js
var evidenceIdSchema$2, pathSchema, APPLE_ROOT_FORMATS, appleApplicationProjectionInputSchema, appleApplicationProjectionResultSchema, projectAppleApplication, appleProjectionId, attributeComponents, appleRootFormat, isNativeLibrary, classifyComponents, deduplicateComponents, identifyRuntimeFamilies, identifyBridgeCandidates, bridgeBasis, projectionLimitations, digest;
function init_appleApplication() {
	return (init_appleApplication = __esmMin((() => {
		init_appleBundleAnatomy();
		init_nativeConvention();
		init_artifactInventoryEvidence();
		init_evidence();
		init_digests();
		init_bridgeCandidateProjection();
		init_mobileApplicationGraphProjection();
		init_unicodeCodePointOrder();
		evidenceIdSchema$2 = prefixedDigestSchema("ev");
		pathSchema = z.string().min(1);
		APPLE_ROOT_FORMATS = [
			"ipa",
			"directory",
			"zip",
			"dmg"
		];
		appleApplicationProjectionInputSchema = z.strictObject({ inventory_evidence: z.array(evidenceSchema).min(1) });
		appleApplicationProjectionResultSchema = z.strictObject({
			projection_id: prefixedDigestSchema("aap"),
			root_sha256: digestSchema,
			root_format: z.enum(APPLE_ROOT_FORMATS),
			platforms: z.array(z.enum(["ios", "macos"])),
			source_evidence_ids: z.array(evidenceIdSchema$2).min(1),
			application_roots: z.array(pathSchema),
			bundles: z.array(appleBundleSchema),
			components: z.strictObject({
				bundle_metadata: z.array(appleComponentSchema),
				executables: z.array(appleComponentSchema),
				frameworks: z.array(appleComponentSchema),
				native_libraries: z.array(appleComponentSchema),
				javascript: z.array(appleComponentSchema),
				signing: z.array(appleComponentSchema),
				privileged_helpers: z.array(appleComponentSchema),
				launchd_plists: z.array(appleComponentSchema.extend({ domain: z.enum(["agent", "daemon"]) })),
				helpers: z.array(appleComponentSchema)
			}),
			symlinks: z.array(pathSchema),
			runtime_families: z.array(z.enum([
				"native",
				"swift-objective-c",
				"javascript",
				"react-native",
				"flutter",
				"unity"
			])),
			bridge_candidates: z.array(z.strictObject({
				source_path: pathSchema,
				native_path: pathSchema,
				basis: z.enum([
					"javascript-and-native-content",
					"react-native-convention",
					"flutter-convention",
					"unity-convention"
				])
			})),
			bridge_candidate_coverage: bridgeCandidateCoverageSchema,
			coverage: z.strictObject({
				status: z.enum(["complete-within-inventory", "partial"]),
				inventory_complete: z.boolean()
			}),
			limitations: z.array(z.string())
		});
		projectAppleApplication = (input) => {
			const parsed = appleApplicationProjectionInputSchema.parse(input);
			const { evidence, inventory } = parseArtifactInventoryEvidence(parsed.inventory_evidence);
			const rootFormat = appleRootFormat(inventory.manifest.root_format);
			const nodes = new Map(inventory.nodes.map((node) => [node.artifact_id, node]));
			const entries = inventory.occurrences.filter(({ logical_path: path }) => path !== ".").map((occurrence) => {
				if (occurrence.artifact_id === null) return {
					path: occurrence.logical_path,
					kind: occurrence.entry_kind,
					component: undefined
				};
				const node = nodes.get(occurrence.artifact_id);
				if (node === undefined) throw new TypeError("Apple application occurrence has no artifact node");
				return {
					path: occurrence.logical_path,
					kind: occurrence.entry_kind,
					component: {
						path: occurrence.logical_path,
						artifact_id: node.artifact_id,
						sha256: node.sha256,
						format: occurrence.artifact_format
					}
				};
			});
			const inventoried = entries.flatMap(({ component }) => component === undefined ? [] : [component]);
			const roots = applicationRoots(entries, {
				name: evidence[0]?.subject?.name ?? "",
				format: rootFormat
			});
			const { all, unattributed } = attributeComponents(inventoried, roots, rootFormat);
			const bundles = detectBundles(entries, roots);
			const classified = classifyComponents(entries, all, roots);
			const runtimeFamilies = identifyRuntimeFamilies(all);
			const bridgeProjection = identifyBridgeCandidates(classified.javascript, deduplicateComponents([...classified.executables, ...classified.native_libraries]), roots);
			const uninventoriedImage = rootFormat === "dmg" && inventory.occurrences.length === 1;
			const inventoryComplete = hasCompleteInventoryCoverage(inventory, "container-entries");
			const complete = inventoryComplete && !uninventoriedImage;
			const limitations = [...inventory.limitations, ...projectionLimitations({
				complete: inventoryComplete,
				uninventoriedImage,
				roots,
				bundles,
				sidecars: entries.some(({ path }) => isSidecar(path)),
				symlinks: entries.some(({ kind }) => kind === "symlink"),
				unattributed,
				bridgeCandidateCoverage: bridgeProjection.coverage
			})];
			const withoutId = {
				root_sha256: inventory.manifest.root_sha256,
				root_format: rootFormat,
				platforms: platformsOf(bundles),
				source_evidence_ids: evidence.map(({ evidence_id: id }) => id).sort(compareUnicodeCodePoints),
				application_roots: roots,
				bundles,
				components: classified,
				symlinks: entries.filter(({ kind }) => kind === "symlink").map(({ path }) => path).sort(compareUnicodeCodePoints),
				runtime_families: runtimeFamilies,
				bridge_candidates: bridgeProjection.candidates,
				bridge_candidate_coverage: bridgeProjection.coverage,
				coverage: {
					status: complete && bridgeProjection.coverage.status === "complete" ? "complete-within-inventory" : "partial",
					inventory_complete: inventory.complete
				},
				limitations
			};
			return appleApplicationProjectionResultSchema.parse({
				...withoutId,
				projection_id: appleProjectionId(withoutId)
			});
		};
		appleProjectionId = (projection) => `aap_${digest(projection)}`;
		attributeComponents = (inventoried, roots, rootFormat) => {
			const visible = inventoried.filter(({ path }) => !isSidecar(path));
			if (rootFormat === "ipa") return {
				all: visible,
				unattributed: 0
			};
			const all = visible.filter(({ path }) => roots.some((root) => isWithin(path, root)));
			return {
				all,
				unattributed: visible.length - all.length
			};
		};
		appleRootFormat = (format) => {
			const root = APPLE_ROOT_FORMATS.find((candidate) => candidate === format);
			if (root === undefined) throw new TypeError(`Apple application projection requires IPA, directory, ZIP, or DMG inventory Evidence (got ${format})`);
			return root;
		};
		isNativeLibrary = (path) => /\.(?:dylib|so)$/iu.test(path);
		classifyComponents = (entries, all, roots) => {
			const withinApp = (path) => roots.some((root) => isWithin(path, root));
			const matching = (predicate) => entries.flatMap(({ path, kind, component }) => kind === "file" && component !== undefined && !isSidecar(path) && withinApp(path) && predicate(path) ? [component] : []);
			const lastSegment = (path) => path.split("/").at(-1) ?? "";
			return {
				bundle_metadata: all.filter(({ path }) => anatomyNameIs(lastSegment(path), "Info.plist")),
				executables: all.filter(({ path, format }) => isMachOFormat(format) && (withinApp(path) || !isNativeLibrary(path))),
				frameworks: all.filter(({ path }) => /\.framework\//u.test(path)),
				native_libraries: all.filter(({ path }) => isNativeLibrary(path)),
				javascript: all.filter(({ format }) => format === "javascript-bundle"),
				signing: all.filter(({ path }) => anatomyTailMatches(path, ["_CodeSignature", "CodeResources"]) || anatomyNameIs(lastSegment(path), "embedded.mobileprovision") || anatomyNameIs(lastSegment(path), "embedded.provisionprofile")),
				privileged_helpers: matching((path) => anatomyTailMatches(path, [
					"Contents",
					"Library",
					"LaunchServices",
					"*"
				])),
				launchd_plists: matching((path) => path.endsWith(".plist") && (anatomyTailMatches(path, [
					"Contents",
					"Library",
					"LaunchAgents",
					"*"
				]) || anatomyTailMatches(path, [
					"Contents",
					"Library",
					"LaunchDaemons",
					"*"
				]))).map((component) => ({
					...component,
					domain: component.path.split("/").some((segment) => anatomyNameIs(segment, "LaunchDaemons")) ? "daemon" : "agent"
				})),
				helpers: matching((path) => anatomyTailMatches(path, [
					"Contents",
					"Helpers",
					"*"
				]))
			};
		};
		deduplicateComponents = (values) => [...new Map(values.map((value) => [value.path, value])).values()].sort((left, right) => compareUnicodeCodePoints(left.path, right.path));
		identifyRuntimeFamilies = (all) => {
			const families = new Set();
			if (all.some(({ format }) => ["mach-o", "mach-o-universal"].includes(format))) families.add("native");
			if (all.some(({ path }) => isSwiftRuntimeLibrary(path))) families.add("swift-objective-c");
			if (all.some(({ format }) => format === "javascript-bundle")) families.add("javascript");
			for (const { path } of all) {
				const convention = nativeRuntimeConvention(path);
				if (convention !== null) families.add(convention);
			}
			return [...families].sort(compareUnicodeCodePoints);
		};
		identifyBridgeCandidates = (scripts, native, roots) => {
			const owner = (path) => roots.find((root) => isWithin(path, root)) ?? null;
			const scriptGroups = [];
			for (const script of scripts) {
				const root = owner(script.path);
				const last = scriptGroups.at(-1);
				if (last?.root === root) last.left.push(script);
				else scriptGroups.push({
					root,
					left: [script]
				});
			}
			const nativeByRoot = new Map();
			for (const item of native) {
				const root = owner(item.path);
				const scoped = nativeByRoot.get(root) ?? [];
				scoped.push(item);
				nativeByRoot.set(root, scoped);
			}
			const groups = scriptGroups.map(({ root, left }) => ({
				left,
				right: nativeByRoot.get(root) ?? []
			}));
			return projectCartesianCandidates({
				groups,
				createCandidate: (source_path, item) => ({
					source_path,
					native_path: item.path,
					basis: bridgeBasis(item.path)
				})
			});
		};
		bridgeBasis = (path) => {
			const convention = nativeRuntimeConvention(path);
			if (convention === "react-native") return "react-native-convention";
			if (convention === "flutter") return "flutter-convention";
			if (convention === "unity") return "unity-convention";
			return "javascript-and-native-content";
		};
		projectionLimitations = (facts) => [
			...!facts.complete ? ["Source inventory coverage is partial; absence is unknown."] : [],
			...facts.uninventoriedImage ? ["The DMG's contents were not inventoried on this host; bundle absence is unknown."] : [],
			...facts.roots.length === 0 ? ["No application bundle (Payload/*.app or *.app/Contents) was present in the supplied inventory pages."] : [],
			...facts.bundles.some(({ layout, info_plist_path: plist }) => layout === "versioned-framework" && plist === null) ? ["A versioned framework has several version directories or no Versions/*/Resources/Info.plist; the Info.plist that Versions/Current selects is unknown because symlink targets are not inventoried."] : [],
			...facts.symlinks ? ["Symlinks are reported by path only; their targets are not inventoried, so bundles are reported at their real paths."] : [],
			...facts.unattributed > 0 ? [`${facts.unattributed} inventoried entries outside every application root are not attributed to the application.`] : [],
			...facts.sidecars ? ["AppleDouble sidecar entries (._* files and __MACOSX/) describe neighbouring files and are excluded from bundle roles."] : [],
			...facts.bridgeCandidateCoverage.status === "partial" ? [`Bridge candidate pairs exceeded the projection safety budget; ${facts.bridgeCandidateCoverage.omitted_candidates} hypotheses are omitted. Component arrays still include every component from the supplied inventory pages.`] : [],
			"Bundle roles follow path conventions. Read each info_plist_path with inspect_plist for CFBundleExecutable, identifiers, and declared services.",
			"Bundle identifiers and signing claims require dedicated plist and CMS parsing; this projection reports only exact paths and hashes.",
			"Runtime families are inferred from inventory formats and bounded framework path conventions, not observed runtime loading.",
			"Generic framework and dylib paths do not establish Swift or Objective-C; this inventory projection does not decode language metadata.",
			"Bridge candidates are path-based hypotheses, not observed runtime calls.",
			"A bridge basis is inferred from the native path and is repeated for every managed component."
		];
		digest = (value) => projectionDigest(value, "Apple application projection");
	})))();
}

//#endregion
//#region dist/domain/harmony/harmonyApplication.js
var evidenceIdSchema$1, componentSchema, HARMONY_ROOT_FORMATS, harmonyApplicationProjectionInputSchema, harmonyApplicationProjectionResultSchema, projectHarmonyApplication, harmonyRootFormat, packagingModel, classify, runtimeFamilies, bridgeCandidates, napiBasis;
function init_harmonyApplication() {
	return (init_harmonyApplication = __esmMin((() => {
		init_artifactInventoryEvidence();
		init_digests();
		init_nativeConvention();
		init_mobileApplicationGraphProjection();
		init_unicodeCodePointOrder();
		evidenceIdSchema$1 = projectionEvidenceIdSchema;
		componentSchema = projectedComponentSchema;
		HARMONY_ROOT_FORMATS = [
			"hap",
			"hsp",
			"app-pack"
		];
		harmonyApplicationProjectionInputSchema = applicationInventoryProjectionInputSchema;
		harmonyApplicationProjectionResultSchema = z.strictObject({
			projection_id: prefixedDigestSchema("hmp"),
			root_sha256: digestSchema,
			root_format: z.enum(HARMONY_ROOT_FORMATS),
			source_evidence_ids: z.array(evidenceIdSchema$1).min(1),
			packaging_model: z.enum([
				"stage",
				"fa",
				"unknown"
			]),
			components: z.strictObject({
				manifests: z.array(componentSchema),
				bytecode: z.array(componentSchema),
				resources: z.array(componentSchema),
				native_libraries: z.array(componentSchema),
				javascript: z.array(componentSchema),
				signing: z.array(componentSchema)
			}),
			unavailable_components: z.array(unavailableComponentSchema),
			app_pack_children: z.array(componentSchema),
			runtime_families: z.array(z.enum([
				"ark",
				"native",
				"javascript",
				"react-native",
				"flutter",
				"unity"
			])),
			bridge_candidates: z.array(projectedBridgeCandidateSchema(["managed-and-native-content", "napi-library-convention"])),
			bridge_candidate_coverage: bridgeCandidateCoverageSchema,
			coverage: z.strictObject({
				status: z.enum(["complete-within-inventory", "partial"]),
				inventory_complete: z.boolean()
			}),
			limitations: z.array(z.string())
		});
		projectHarmonyApplication = (input) => {
			const parsed = harmonyApplicationProjectionInputSchema.parse(input);
			const { evidence, inventory } = parseArtifactInventoryEvidence(parsed.inventory_evidence);
			const rootFormat = harmonyRootFormat(inventory.manifest.root_format);
			const all = projectedComponents(inventory);
			const unavailable = unavailableComponents(inventory);
			const classified = classify(all);
			const bridgeProjection = bridgeCandidates(classified.bytecode, classified.native_libraries);
			const limitations = [
				...inventory.limitations,
				...!hasCompleteInventoryCoverage(inventory, "container-entries") ? ["Source inventory coverage is partial; absence is unknown."] : [],
				...unavailable.length > 0 ? ["Some inventoried occurrences have no authenticated content identity. Their paths and limitations are retained in unavailable_components; component and runtime absence is unknown."] : [],
				"Manifest, module, resource, and signing semantics require a dedicated HarmonyOS provider; this projection reports exact inventory paths and hashes only.",
				"The packaging model is a path-presence heuristic: a Stage model is claimed only from module.json and a FA model only from config.json; both can coexist with unusual layouts.",
				"Runtime families are inferred from inventory formats and paths; filename suffixes do not establish valid Ark bytecode.",
				"The signing component lists META-INF certificate-entry suffixes only; signatures applied by the packaging tool live in the ZIP signing block rather than archive entries, so an empty signing list does not mean the package is unsigned.",
				"Bridge candidates are path-based hypotheses, not decoded N-API declarations or observed runtime calls.",
				...rootFormat === "app-pack" ? ["App Pack child packages are listed by inventory path only; their contents are not recursively inventoried by this projection.", "The app-pack root classification is a verified-ZIP-magic plus .app suffix rule; the projection does not require pack.info or child packages before reporting the root format."] : [],
				"HarmonyOS .har shared libraries are not identified by this projection; the .har suffix also names HTTP Archive JSON, so that classification requires verified ZIP bytes.",
				...bridgeProjection.coverage.status === "partial" ? [`Bridge candidate pairs exceeded the projection safety budget; ${bridgeProjection.coverage.omitted_candidates} hypotheses are omitted. Component arrays still include every component from the supplied inventory pages.`] : []
			];
			const withoutId = {
				root_sha256: inventory.manifest.root_sha256,
				root_format: rootFormat,
				source_evidence_ids: evidence.map(({ evidence_id: id }) => id).sort(compareUnicodeCodePoints),
				packaging_model: packagingModel(classified.manifests),
				components: classified,
				unavailable_components: unavailable,
				app_pack_children: rootFormat === "app-pack" ? all.filter(({ path }) => /\.(?:hap|hsp)$/iu.test(path)) : [],
				runtime_families: runtimeFamilies(all),
				bridge_candidates: bridgeProjection.candidates,
				bridge_candidate_coverage: bridgeProjection.coverage,
				coverage: projectionCoverage(inventory, bridgeProjection.coverage.status === "complete" && unavailable.length === 0),
				limitations
			};
			return harmonyApplicationProjectionResultSchema.parse({
				...withoutId,
				projection_id: `hmp_${projectionDigest(withoutId, "HarmonyOS application projection")}`
			});
		};
		harmonyRootFormat = (format) => {
			const root = HARMONY_ROOT_FORMATS.find((candidate) => candidate === format);
			if (root === undefined) throw new TypeError(`HarmonyOS application projection requires HAP, HSP, or App Pack inventory Evidence (got ${format})`);
			return root;
		};
		packagingModel = (manifests) => {
			const stage = manifests.some(({ path }) => /(?:^|\/)module\.json$/iu.test(path));
			const fa = manifests.some(({ path }) => /(?:^|\/)config\.json$/iu.test(path));
			if (stage) return "stage";
			if (fa) return "fa";
			return "unknown";
		};
		classify = (all) => ({
			manifests: all.filter(({ path }) => /(?:^|\/)(?:module\.json|config\.json|pack\.info)$/iu.test(path)),
			bytecode: all.filter(({ path }) => /\.(?:abc|pa)$/iu.test(path)),
			resources: all.filter(({ path }) => /(?:^|\/)resources\.index$/iu.test(path) || /^(?:resources\/|assets\/[^/]+\/resources\/)/iu.test(path)),
			native_libraries: all.filter(({ path, format }) => format === "elf" || /(?:^|\/)libs\/[^/]+\/[^/]+\.so$/iu.test(path)),
			javascript: all.filter(({ path, format }) => format === "javascript-bundle" || /\.(?:m?js|cjs)$/iu.test(path)),
			signing: all.filter(({ path }) => /^META-INF\/[^/]+\.(?:p7b|sig|cer|crt|pem|provision)$/iu.test(path))
		});
		runtimeFamilies = (all) => {
			const paths = all.map(({ path }) => path.toLowerCase());
			const families = new Set();
			if (paths.some((path) => path.endsWith(".abc") || path.endsWith(".pa"))) families.add("ark");
			if (all.some(({ format }) => format === "elf")) families.add("native");
			if (paths.some((path) => /\.(?:m?js|cjs)$/.test(path))) families.add("javascript");
			for (const { path } of all) {
				const convention = nativeRuntimeConvention(path);
				if (convention !== null) families.add(convention);
			}
			return [...families].sort(compareUnicodeCodePoints);
		};
		bridgeCandidates = (managed, native) => {
			return projectCartesianCandidates({
				groups: [{
					left: managed,
					right: native
				}],
				createCandidate: (managed_path, target) => ({
					managed_path,
					native_path: target.path,
					basis: napiBasis(target.path)
				})
			});
		};
		napiBasis = (path) => /(?:^|\/)libs\/[^/]+\/lib[^/]+\.so$/iu.test(path) ? "napi-library-convention" : "managed-and-native-content";
	})))();
}

//#endregion
//#region dist/domain/reconstructionObligationLedgerIntegrity.js
var summarizeReconstructionObligations, reconstructionObligationLedgerStatus, reconstructionObligationCoverage, reconstructionObligationReports, reconstructionObligationOwnershipGraph, reconstructionObligationDependencyGraph, reconstructionObligationEvidenceIds, obligationEdgeOrder, obligationIdsWith, hasReconstructionObligationDiagnostic, reconstructionObligationLedgerClosureDigest, countBy;
function init_reconstructionObligationLedgerIntegrity() {
	return (init_reconstructionObligationLedgerIntegrity = __esmMin((() => {
		init_canonicalDigest();
		init_comparisonSemantics();
		init_unicodeCodePointOrder();
		summarizeReconstructionObligations = (obligations) => ({
			total: obligations.length,
			required: obligations.filter(({ required }) => required).length,
			verified: obligations.filter(({ status }) => status === "verified").length,
			required_open: obligations.filter(({ required, status }) => required && status !== "verified").length,
			by_status: countBy(obligations, [
				"unowned",
				"characterized",
				"implemented",
				"verified",
				"contradicted",
				"blocked",
				"out-of-scope",
				"unknown"
			], ({ status }) => status),
			by_application_layer: countBy(obligations, [
				"cli",
				"protocol",
				"electron",
				"persistence",
				"process",
				"runtime",
				"packaging",
				"native-abi",
				"application",
				"other"
			], ({ application_layer }) => application_layer),
			by_evidence_authority: countBy(obligations, [
				"candidate",
				"observed",
				"reviewed",
				"unknown"
			], ({ source_state }) => source_state)
		});
		reconstructionObligationLedgerStatus = (obligations, limitations) => {
			if (obligations.length === 0) return "unknown";
			const requiredOpen = obligations.filter(({ required, status }) => required && status !== "verified");
			if (requiredOpen.some(({ status, diagnostics }) => status === "contradicted" || hasReconstructionObligationDiagnostic(diagnostics, "verifier-failed"))) return "failed";
			if (limitations.length > 0) return "unknown";
			if (requiredOpen.some(({ status }) => status === "unknown")) return "unknown";
			return requiredOpen.length === 0 ? "ready" : "open";
		};
		reconstructionObligationCoverage = (limitations) => ({ status: limitations.length === 0 ? "complete" : "partial" });
		reconstructionObligationReports = (obligations) => ({
			missing_owner_obligation_ids: obligationIdsWith(obligations, "missing-owner"),
			missing_verifier_obligation_ids: obligationIdsWith(obligations, "missing-verifier"),
			contradicted_obligation_ids: obligationIdsWith(obligations, "contradiction"),
			residual_unknown_ids: [...new Set(obligations.flatMap(({ residual_unknown_ids: ids }) => ids))].sort(compareUnicodeCodePoints)
		});
		reconstructionObligationOwnershipGraph = (obligations) => obligations.flatMap((obligation) => obligation.binding === null ? [] : [{
			obligation_id: obligation.obligation_id,
			module_path: obligation.binding.owner.module_path,
			symbol: obligation.binding.owner.symbol
		}]).sort(obligationEdgeOrder);
		reconstructionObligationDependencyGraph = (obligations) => obligations.flatMap((obligation) => obligation.dependency_obligation_ids.map((dependencyId) => ({
			obligation_id: obligation.obligation_id,
			depends_on_obligation_id: dependencyId
		}))).sort(obligationEdgeOrder);
		reconstructionObligationEvidenceIds = (obligations) => [...new Set(obligations.flatMap((obligation) => [
			...obligation.authority_references.map(({ evidence_id: id }) => id),
			...obligation.observed_cases.map(({ evidence_id: id }) => id),
			...obligation.binding === null ? [] : [
				...obligation.binding.original_cases.map(({ evidence_id: id }) => id),
				...obligation.binding.fixtures.flatMap(({ evidence_ids: ids }) => ids),
				...obligation.binding.verifier === null ? [] : [obligation.binding.verifier.result_evidence_id]
			]
		]))].sort(compareUnicodeCodePoints);
		obligationEdgeOrder = (left, right) => compareUnicodeCodePoints(canonicalJson$1(left), canonicalJson$1(right));
		obligationIdsWith = (obligations, code) => obligations.filter(({ diagnostics }) => hasReconstructionObligationDiagnostic(diagnostics, code)).map(({ obligation_id: id }) => id).sort(compareUnicodeCodePoints);
		hasReconstructionObligationDiagnostic = (diagnostics, code) => diagnostics.some((diagnostic) => diagnostic.code === code);
		reconstructionObligationLedgerClosureDigest = (ledger) => digestCanonicalValue({
			schema: "ReconstructionObligationClosure",
			status: ledger.status,
			coverage: ledger.coverage,
			summary: ledger.summary,
			reports: ledger.reports,
			ownership_graph: ledger.ownership_graph,
			dependency_graph: ledger.dependency_graph,
			obligations: ledger.obligations,
			evidence_links: ledger.evidence_links,
			limitations: ledger.limitations
		}, "Reconstruction obligation ledger");
		countBy = (items, values, valueFor) => values.map((value) => ({
			key: value,
			count: items.filter((item) => valueFor(item) === value).length
		}));
	})))();
}

//#endregion
//#region dist/domain/reconstructionObligationLedgerSchemas.js
var evidenceIdSchema, stableIdSchema, textSchema, sameProjection, obligationStatusSchema, obligationLayerSchema, obligationCaseKindSchema, obligationProofAuthoritySchema, obligationOriginalAuthoritySchema, obligationTargetSchema, authorityReferenceSchema, observedCaseSchema, ownerBindingSchema, parserTypeBindingSchema, fixtureBindingSchema, nondeterminismSchema, verifierBindingSchema, reconstructionObligationManifestBindingSchema, reconstructionObligationManifestSchema, reviewedReconstructionObligationSchema, diagnosticSchema, reconstructionObligationSchema, countBySchema, countEntriesMatch, obligationSummariesMatch, reconstructionObligationLedgerSchema, reconstructionObligationLedgerInputSchema;
function init_reconstructionObligationLedgerSchemas() {
	return (init_reconstructionObligationLedgerSchemas = __esmMin((() => {
		init_stringPatterns();
		init_evidenceBundle();
		init_digests();
		init_comparisonSemantics();
		init_reconstructionObligationLedgerIntegrity();
		evidenceIdSchema = prefixedDigestSchema("ev");
		stableIdSchema = z.string().regex(STABLE_IDENTIFIER_PATTERN);
		textSchema = z.string().trim().min(1);
		sameProjection = (actual, expected) => {
			if (actual.length !== expected.length) return false;
			const counts = new Map();
			for (const value of actual) {
				const key = canonicalJson$1(value, "Reconstruction obligation ledger");
				counts.set(key, (counts.get(key) ?? 0) + 1);
			}
			for (const value of expected) {
				const key = canonicalJson$1(value, "Reconstruction obligation ledger");
				const count = counts.get(key);
				if (count === undefined) return false;
				if (count === 1) counts.delete(key);
				else counts.set(key, count - 1);
			}
			return counts.size === 0;
		};
		obligationStatusSchema = z.enum([
			"unowned",
			"characterized",
			"implemented",
			"verified",
			"contradicted",
			"blocked",
			"out-of-scope",
			"unknown"
		]);
		obligationLayerSchema = z.enum([
			"cli",
			"protocol",
			"electron",
			"persistence",
			"process",
			"runtime",
			"packaging",
			"native-abi",
			"application",
			"other"
		]);
		obligationCaseKindSchema = z.enum([
			"positive",
			"negative",
			"malformed",
			"cancellation",
			"teardown"
		]);
		obligationProofAuthoritySchema = z.enum([
			"unit",
			"integration",
			"protocol",
			"renderer",
			"packaged-process",
			"native-abi",
			"live-observation",
			"external"
		]);
		obligationOriginalAuthoritySchema = z.enum([
			"static",
			"runtime",
			"process",
			"external"
		]);
		obligationTargetSchema = z.strictObject({
			artifact_sha256: digestSchema.nullable(),
			application_node_id: z.string().regex(/^jag_node_[a-f0-9]{64}$/u).nullable(),
			semantic_node_id: z.string().regex(/^jsrg_node_[a-f0-9]{64}$/u).nullable(),
			location: textSchema
		});
		authorityReferenceSchema = z.strictObject({
			evidence_id: evidenceIdSchema,
			authority: z.enum([
				"shipped-artifact",
				"controlled-replay",
				"historical-reference",
				"external-service",
				"analyst-inference"
			]),
			state: z.enum([
				"candidate",
				"observed",
				"reviewed",
				"unknown"
			]),
			location: textSchema
		});
		observedCaseSchema = z.strictObject({
			kind: obligationCaseKindSchema,
			evidence_id: evidenceIdSchema,
			location: textSchema
		});
		ownerBindingSchema = z.strictObject({
			module_path: textSchema,
			symbol: textSchema,
			owner_sha256: digestSchema
		});
		parserTypeBindingSchema = z.strictObject({
			parser: textSchema,
			schema: textSchema,
			domain_type: textSchema
		});
		fixtureBindingSchema = z.strictObject({
			fixture_id: stableIdSchema,
			case_kind: obligationCaseKindSchema,
			authority: obligationProofAuthoritySchema,
			evidence_ids: z.array(evidenceIdSchema).min(1)
		});
		nondeterminismSchema = z.strictObject({
			mode: z.enum([
				"total-order",
				"partial-order",
				"finite-traces"
			]),
			specification: textSchema
		});
		verifierBindingSchema = z.strictObject({
			verifier_id: stableIdSchema,
			claim_id: stableIdSchema,
			command: textSchema,
			authority: obligationProofAuthoritySchema,
			status: z.enum([
				"pass",
				"fail",
				"unknown",
				"unsupported",
				"skipped"
			]),
			result_evidence_id: evidenceIdSchema,
			enumerated_obligation_ids: z.array(stableIdSchema).min(1),
			nondeterminism: nondeterminismSchema
		});
		reconstructionObligationManifestBindingSchema = z.strictObject({
			obligation_id: stableIdSchema,
			owner: ownerBindingSchema,
			parser_type: parserTypeBindingSchema.nullable(),
			original_cases: z.array(observedCaseSchema),
			fixtures: z.array(fixtureBindingSchema),
			verifier: verifierBindingSchema.nullable()
		});
		reconstructionObligationManifestSchema = z.strictObject({
			bindings: z.array(reconstructionObligationManifestBindingSchema),
			contradictions: z.array(z.strictObject({
				obligation_id: stableIdSchema,
				evidence_ids: z.array(evidenceIdSchema).min(2)
			}))
		});
		reviewedReconstructionObligationSchema = z.strictObject({
			obligation_id: stableIdSchema,
			obligation_version: z.number().int().min(1),
			title: textSchema,
			application_layer: obligationLayerSchema,
			family: textSchema,
			target: obligationTargetSchema,
			required: z.boolean(),
			required_case_kinds: z.array(obligationCaseKindSchema).min(1),
			required_original_authority: obligationOriginalAuthoritySchema,
			required_fixture_authority: obligationProofAuthoritySchema,
			required_verifier_authority: obligationProofAuthoritySchema,
			requires_parser_type: z.boolean(),
			dependency_obligation_ids: z.array(stableIdSchema),
			residual_unknown_ids: z.array(stableIdSchema),
			unavailable_authority: z.array(textSchema),
			required_next_evidence: z.array(textSchema),
			disposition: z.enum([
				"active",
				"blocked",
				"out-of-scope"
			]),
			review_evidence_ids: z.array(evidenceIdSchema).min(1)
		});
		diagnosticSchema = z.strictObject({
			code: z.enum([
				"duplicate-definition",
				"missing-owner",
				"ambiguous-owner",
				"missing-parser-type",
				"missing-original-case",
				"weak-original-case-authority",
				"missing-case",
				"weak-fixture-authority",
				"missing-verifier",
				"verifier-does-not-enumerate",
				"missing-verifier-result",
				"weak-verifier-authority",
				"verifier-failed",
				"static-only",
				"contradiction",
				"contradiction-evidence-missing",
				"residual-unknown",
				"dependency-missing",
				"dependency-open",
				"unavailable-authority",
				"blocked",
				"out-of-scope"
			]),
			detail: textSchema
		});
		reconstructionObligationSchema = z.strictObject({
			obligation_id: stableIdSchema,
			obligation_version: z.number().int().min(1),
			title: textSchema,
			origin: z.enum(["generated", "reviewed"]),
			application_layer: obligationLayerSchema,
			family: textSchema,
			target: obligationTargetSchema,
			authority_references: z.array(authorityReferenceSchema).min(1),
			source_state: z.enum([
				"candidate",
				"observed",
				"reviewed",
				"unknown"
			]),
			observed_cases: z.array(observedCaseSchema),
			required: z.boolean(),
			required_case_kinds: z.array(obligationCaseKindSchema).min(1),
			required_original_authority: obligationOriginalAuthoritySchema,
			required_fixture_authority: obligationProofAuthoritySchema,
			required_verifier_authority: obligationProofAuthoritySchema,
			requires_parser_type: z.boolean(),
			dependency_obligation_ids: z.array(stableIdSchema),
			residual_unknown_ids: z.array(stableIdSchema),
			unavailable_authority: z.array(textSchema),
			required_next_evidence: z.array(textSchema),
			binding: reconstructionObligationManifestBindingSchema.nullable(),
			status: obligationStatusSchema,
			diagnostics: z.array(diagnosticSchema)
		});
		countBySchema = (key) => z.array(z.strictObject({
			key,
			count: z.number().int().min(0)
		}));
		countEntriesMatch = (actual, expected) => {
			const actualCounts = new Map(actual.map(({ key, count }) => [key, count]));
			return actualCounts.size === actual.length && actual.length === expected.length && expected.every(({ key, count }) => actualCounts.get(key) === count);
		};
		obligationSummariesMatch = (actual, expected) => actual.total === expected.total && actual.required === expected.required && actual.verified === expected.verified && actual.required_open === expected.required_open && countEntriesMatch(actual.by_status, expected.by_status) && countEntriesMatch(actual.by_application_layer, expected.by_application_layer) && countEntriesMatch(actual.by_evidence_authority, expected.by_evidence_authority);
		reconstructionObligationLedgerSchema = z.strictObject({
			schema: z.literal("ReconstructionObligationLedger"),
			ledger_id: prefixedDigestSchema("rol"),
			closure_digest: digestSchema,
			status: z.enum([
				"ready",
				"open",
				"failed",
				"unknown"
			]),
			coverage: z.strictObject({ status: z.enum(["complete", "partial"]) }),
			summary: z.strictObject({
				total: z.number().int().min(0),
				required: z.number().int().min(0),
				verified: z.number().int().min(0),
				required_open: z.number().int().min(0),
				by_status: countBySchema(obligationStatusSchema),
				by_application_layer: countBySchema(obligationLayerSchema),
				by_evidence_authority: countBySchema(z.enum([
					"candidate",
					"observed",
					"reviewed",
					"unknown"
				]))
			}),
			reports: z.strictObject({
				missing_owner_obligation_ids: z.array(stableIdSchema),
				missing_verifier_obligation_ids: z.array(stableIdSchema),
				contradicted_obligation_ids: z.array(stableIdSchema),
				residual_unknown_ids: z.array(stableIdSchema)
			}),
			ownership_graph: z.array(z.strictObject({
				obligation_id: stableIdSchema,
				module_path: textSchema,
				symbol: textSchema
			})),
			dependency_graph: z.array(z.strictObject({
				obligation_id: stableIdSchema,
				depends_on_obligation_id: stableIdSchema
			})),
			obligations: z.array(reconstructionObligationSchema),
			evidence_links: z.array(evidenceIdSchema),
			limitations: z.array(textSchema)
		}).superRefine((ledger, context) => {
			if (ledger.status !== reconstructionObligationLedgerStatus(ledger.obligations, ledger.limitations)) context.addIssue({
				code: "custom",
				path: ["status"],
				message: "Ledger status does not match its obligations"
			});
			if (!obligationSummariesMatch(ledger.summary, summarizeReconstructionObligations(ledger.obligations))) context.addIssue({
				code: "custom",
				path: ["summary"],
				message: "Ledger summary does not match its obligations"
			});
			if (ledger.closure_digest !== reconstructionObligationLedgerClosureDigest(ledger)) context.addIssue({
				code: "custom",
				path: ["closure_digest"],
				message: "Ledger closure digest does not match its contents"
			});
			if (ledger.coverage.status !== reconstructionObligationCoverage(ledger.limitations).status) context.addIssue({
				code: "custom",
				path: ["coverage"],
				message: "Ledger coverage does not match its limitations"
			});
			const expectedReports = reconstructionObligationReports(ledger.obligations);
			for (const key of [
				"missing_owner_obligation_ids",
				"missing_verifier_obligation_ids",
				"contradicted_obligation_ids",
				"residual_unknown_ids"
			]) if (!sameProjection(ledger.reports[key], expectedReports[key])) context.addIssue({
				code: "custom",
				path: ["reports", key],
				message: "Ledger report does not match its obligations"
			});
			if (!sameProjection(ledger.ownership_graph, reconstructionObligationOwnershipGraph(ledger.obligations))) context.addIssue({
				code: "custom",
				path: ["ownership_graph"],
				message: "Ownership graph does not match its obligations"
			});
			if (!sameProjection(ledger.dependency_graph, reconstructionObligationDependencyGraph(ledger.obligations))) context.addIssue({
				code: "custom",
				path: ["dependency_graph"],
				message: "Dependency graph does not match its obligations"
			});
			const ledgerEvidenceIds = new Set(ledger.evidence_links);
			if (ledgerEvidenceIds.size !== ledger.evidence_links.length) context.addIssue({
				code: "custom",
				path: ["evidence_links"],
				message: "Evidence links must be unique"
			});
			if (reconstructionObligationEvidenceIds(ledger.obligations).some((evidenceId) => !ledgerEvidenceIds.has(evidenceId))) context.addIssue({
				code: "custom",
				path: ["evidence_links"],
				message: "Evidence links omit Evidence referenced by an obligation"
			});
		});
		reconstructionObligationLedgerInputSchema = z.strictObject({
			evidence_bundle: evidenceBundleSchema,
			reviewed_obligations: z.array(reviewedReconstructionObligationSchema),
			manifest: reconstructionObligationManifestSchema
		});
	})))();
}

//#endregion
export { BINARY_ARCHITECTURES, CANONICAL_BASE64_PATTERN, CLI_COMMANDS, CLI_COMMAND_NAMES, ELECTRON_IDENTITY_LIMITATION, ELECTRON_MODULE, IDENTIFIER_PATTERN, NonCanonicalEvidenceBundleError, PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION, PRODUCT_IDENTITY, PROVIDER_EFFECT_NAMES, SDK_IDENTITY, STATIC_ROUTE_CALL_NAMES, WEB_RUNTIME_LIMITS, ZIP_NON_ENTRY_LIMITATION, absenceClaimable, addressCoordinate, addressDistance, addressList, addressedEntry, addressedValue, analysisBookmarkSchema, analysisInputErrorFromIssues, analysisProfileSchema, analysisProfilesEqual, analysisProviderIdSchema, analysisProviderSelectorSchema, analysisStringSchema, analyzeJavaScriptSemantics, analyzeParsedJavaScriptReferences, analyzeParsedJavaScriptSemanticsSteps, androidApplicationProjectionInputSchema, androidApplicationProjectionResultSchema, appleApplicationProjectionInputSchema, appleApplicationProjectionResultSchema, argumentNode, argumentValue, artifactContradictionId, artifactEdgeId, artifactEdgeSchema, artifactExtractionResultSchema, artifactGraphDigest, artifactGraphManifestSchema, artifactIdForContent, artifactInspectionOutputSchema, artifactInspectionResultSchema, artifactInventoryOutputSchema, artifactInventoryResultSchema, artifactManifestId, artifactNodeSchema, artifactOccurrenceSchema, browserAllowedOriginsSchema, browserCompletenessSchema, browserEndpointSchema, browserNetworkContentSelectionSchema, browserObservationEndpointSchema, browserOriginSchema, browserScenarioCaptureSchema, browserScenarioCompletenessSchema, browserScenarioEventFamilySchema, browserScenarioEventSchema, browserScenarioStepSchema, browserStepArtifactsSchema, browserTargetListSchema, browserVersionSchema, buildInterfaceBuilderAnalysis, calleeName, canonicalJson$1 as canonicalJson, canonicalJsonDigestSteps, captureWebScreenshotInputSchema, childNodes, chunkRuntime, classifyBrowserCompleteness, classifyBrowserScenarioCompleteness, classifyParsedJavaScriptOpenReceivers, classifyParsedJavaScriptOpenReceiversSteps, classifyParsedJavaScriptRpcClientRootsSteps, classifySwiftSymbol, committedProviderSchema, compactPresentationForMcpInputSchemaProfile, compareUnicodeCodePoints, compareWebScreenshotsInputSchema, completeSemanticSteps, compositeKey, containingProcedureResolution, createAnalysisProfile, createArtifactInspection, createEvidence, createEvidenceBundle, createImmutableEvidenceBundle, createImmutableEvidenceSteps, createJavaScriptRpcScan, createResidualUnknown, createWebScreenshotArtifact, createWebTextArtifact, decodeCanonicalBase64, describeEvidenceBundleFailure, describeValidationFailure, detectVendors, digestCanonicalValue, digestProcessCommitment, digestSchema, dimensionResult, electronActiveObservationInputSchema, electronActiveObservationResultSchema, electronActiveTimelineEventSchema, electronPageInspectionSchema, electronTargetListSchema, emptyArraySchema, endpointArgument, err, evaluateReconstructionClosure, evidenceBundleForTarget, evidenceBundleSchema, evidenceLocationSchema, evidenceResultOf, evidenceSchema, factoryRequireName, failedJavaScriptStaticAnalysis, flattenSemanticReturnValue, functionBodyEntryAgrees, functionBodySchema, functionComparisonInputSchema, functionComparisonResultSchema, functionDossierOutput, functionDossierSchema, functionInstructionWindowSchema, graphNode, harmonyApplicationProjectionInputSchema, harmonyApplicationProjectionResultSchema, hasCaptureTruncation, hasCompleteInventoryCoverage, hasReconstructionObligationDiagnostic, hasUncertainTypeOnlyModuleSideEffect, hasZipSignature, immutableEvidence, indexJavaScriptBindingsSteps, indexJavaScriptElectronIdentitySteps, inferJsonShape, init_addressCoordinate, init_analysisProfile, init_androidApplication, init_appleApplication, init_artifactGraph, init_artifactIdentity, init_artifactInspection, init_artifactInventoryEvidence, init_binaryTargetTypes, init_browserCompleteness, init_browserNetworkEvidence, init_browserObservation, init_browserObservationSchemas, init_browserScenarioCapture, init_browserScenarioCaptureValues, init_canonicalDigest, init_canonicalJsonDigestSteps, init_canonicalOrdering, init_cliCommandNames, init_comparisonSemantics, init_digests, init_electronActiveObservation, init_electronObservation, init_emptyArraySchema, init_evidence, init_evidenceBundle, init_functionComparisonResults, init_functionComparisonSchemas, init_harmonyApplication, init_hopperValues, init_identity, init_inputIssueProjection, init_interfaceBuilderGraph, init_interfaceBuilderKeyedArchive, init_javascriptAstValues, init_javascriptBootstrap, init_javascriptElectronMemberWrites, init_javascriptModuleDeclaration, init_javascriptRpcEndpoints, init_javascriptRuntimeObservation, init_javascriptSemanticAmbientWrites, init_javascriptSemanticAnalysis, init_javascriptSemanticCoverage, init_javascriptSemanticProjection, init_javascriptSemanticRequireOrigin, init_javascriptSemanticResourceLimits, init_javascriptSemanticReturns, init_javascriptSemanticSlots, init_javascriptSemanticState, init_javascriptSemanticTraversal, init_javascriptSourceParser, init_javascriptStaticAnalysisHelpers, init_jsonShape, init_localPath, init_machoCpuIdentity, init_mcpInputSchemaProfile, init_nativeApiBoundary, init_nativeInstruction, init_nativeInvestigationGraph, init_nativeValueFlow, init_nativeValueTrace, init_objcSwiftMetadata, init_processCapture, init_processCaptureCoverage, init_processCaptureParsing, init_processScenario, init_providerSelection, init_reconstructionCoverage, init_reconstructionCoverageInput, init_reconstructionObligationLedgerIntegrity, init_reconstructionObligationLedgerSchemas, init_recordedTransportUrl, init_relationshipCoverage, init_residualUnknown, init_result, init_stringPatterns, init_swiftSymbolClassification, init_toolOutputSchemaPrimitives, init_unicodeCodePointOrder, init_urlComponents, init_webContentArtifact, init_webRuntime, init_webScreenshot, init_zipPackageFormat, inspectElectronPageInputSchema, inspectNativeDispatchMetadata, inspectWebPageInputSchema, inspectWebPageWithSourceInputSchema, integrityContradictionSchema, interfaceBuilderAnalysisSchema, interfaceBuilderConnectionFieldNames, interfaceBuilderDocumentSchema, interfaceBuilderLimitsSchema, isDigest, isElfMetadataArchitecture, isExplicitModuleSourcePath, isImmutableEvidence, isLiteralLoopbackHostname, isMachOFormat$1 as isMachOFormat, isPathWithinRoot, isSwiftMangledSymbolName, isTypeOnlyExportDeclaration, isTypeOnlyExportSpecifier, isTypeOnlyImportDeclaration, isTypeOnlyImportSpecifier, isUIKitRuntimeConnectionClass, isUnmodifiedGlobalReference, isUnmodifiedImportMetaUrl, isZipPackageFormat, javascriptBootstrapAt, javascriptDisplayText, javascriptRuntimeKindSchema, javascriptRuntimeObservationSchema, javascriptRuntimeTargetListSchema, javascriptRuntimeUnresolvedLocationSchema, joinInterfaceBuilderDispatch, lifecycleResultOf, listBrowserTargetsInputSchema, listElectronTargetsInputSchema, listJavaScriptRuntimeTargetsInputSchema, localPathStringSchema, logicalPathEscapesRoot, logicalPathNfc, machoCpuSubtypeBase, mcpInputSchemaProfileSchema, moduleFactory, modulePropertyName, nativeApiBoundarySchema, nativeApiInspectionResultSchema, nativeCallTargetsSchema, nativeDispatchMetadataResultSchema, nativeInstructionInputSchema, nativeInstructionSchema, nativeInvestigationCoverageSchema, nativeInvestigationEdgeSchema, nativeInvestigationGraphSchema, nativeInvestigationNodeSchema, nativeInvestigationTraceSchema, nativeValueFlowSchema, nativeValueTraceInputSchema, nativeValueTraceSchema, normalizeJoinedLogicalPath, nulFreeStringSchema, nullableText, objcSwiftMetadataSchema, observeJavaScriptRuntimeInputSchema, occurrenceIdForLocation, ok, overallStatus, parseArtifactInventoryEvidence, parseArtifactInventoryResult, parseDocuments, parseEvidence, parseEvidenceBundle, parseFunctionDossier, parseImmutableEvidenceBundle, parseJavaScriptSource, parseListCount, parseMcpInputSchemaProfile, parseProcessCapture, parseRecordedTransportUrl, parseRecoveredJavaScript, parseRelatedAddresses, parseSegmentImageBase, parseSegments, parseUrlQueryParameterNames, parserPluginsForPath, partialProcessCaptureObservationSchema, prefixedArgument, prefixedDigestSchema, procedureIdentitySchema, procedureInfoOutput, processCaptureSchema, processComparisonContract, processScenarioCommitment, processScenarioSchema, processSourceTruncated, projectAndroidApplication, projectAppleApplication, projectHarmonyApplication, projectInputIssues, propertyName, providerCapabilitySet, providerSchema, range, rangeForOffsets, readExactJavaScriptLiteral, rebindEvidenceSubjectTargetPath, rebindEvidenceToTargetPath, reconstructionClosureResultSchema, reconstructionCoverageEvaluationInputSchema, reconstructionObligationCoverage, reconstructionObligationDependencyGraph, reconstructionObligationEvidenceIds, reconstructionObligationLedgerClosureDigest, reconstructionObligationLedgerInputSchema, reconstructionObligationLedgerSchema, reconstructionObligationLedgerStatus, reconstructionObligationOwnershipGraph, reconstructionObligationReports, recordUnknownInputSchema, recordedBrowserObservationEndpointSchema, referenceEdgeSchema, referenceKindSchema, registrationKey, relationshipCoverageLimitations, relationshipCoverageSchema, requireOutputSchema, residualUnknownSchema, resolveSemanticBindingState, runtimeFunctionParameters, sanitizeBrowserUrl, sanitizeEndpointCandidate, segmentOutput, semanticBindingId, semanticContainer, semanticCoverageResourceLimits, semanticFactoryLoaderMemberAt, semanticFactoryRequireLoaderAt, semanticImportEqualsSpecifier, semanticPropertyPointer, semanticRequireLoaderAt, semanticResolutionBlocked, semanticResourceLimitCoverage, semanticResourceLimitReason, semanticScopeId, semanticSlotAtPath, semanticStaticPropertyKey, semanticStaticPropertyName, semanticWriteSiteTarget, semanticWriteTargets, serializeEvidenceBundle, sessionProvider, sha256Text, sortedUnique, sourceRangesEqual, sourceSlice, staticArrayValues, staticPath, staticPathResolutionContext, storageKind, stringValue, summarize, summarizeReconstructionObligations, symbolDiscoveryOutput, targetFormatSchema, targetKindSchema, traceNativeInvestigationGraph, traverseJavaScriptAst, traverseJavaScriptAstSteps, uniqueSorted$1 as uniqueSorted, unresolvedCallSchema, unresolvedDimension, unwrapJavaScriptExpression, updateResidualUnknown, updateUnknownInputSchema, urlDeclaresQueryOrFragment, validateArtifactInventorySubject, validateResidualUnknownAddition, webPageInspectionSchema, webRuntimeLocationSchema, webRuntimeScopeSchema, webRuntimeSourceSchema, webRuntimeTargetSchema, webScreenshotDiffSchema, webScreenshotSchema, webTextArtifactSchema, zipPackageFormatForPath };