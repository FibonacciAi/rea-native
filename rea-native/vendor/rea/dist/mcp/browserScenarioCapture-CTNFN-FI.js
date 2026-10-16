import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { n as init_digests, t as digestSchema } from "./digests-BFoWUT_-.js";
import { c as init_browserObservation, g as sanitizedBrowserUrlSchema } from "./webContentArtifact-Dzjc1z-R.js";
import { c as webScreenshotArtifactSchema, n as init_emptyArraySchema, s as init_webScreenshot, t as emptyArraySchema } from "./emptyArraySchema-tL6Qymyd.js";
import { z } from "zod";
import { createHash } from "node:crypto";

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
export { browserScenarioEventSchema as a, classifyBrowserScenarioCompleteness as c, browserNetworkContentSelectionSchema as d, init_browserNetworkEvidence as f, browserScenarioEventFamilySchema as i, init_browserScenarioCaptureValues as l, init_browserScenarioCapture as n, browserScenarioStepSchema as o, browserScenarioCompletenessSchema as r, browserStepArtifactsSchema as s, browserScenarioCaptureSchema as t, PLAYWRIGHT_RESPONSE_BODY_PROVENANCE_LIMITATION as u };