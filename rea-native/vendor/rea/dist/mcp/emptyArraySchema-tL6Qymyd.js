import { t as __esmMin } from "./rolldown-runtime-BjeaiXFo.js";
import { c as init_browserObservation, i as browserAllowedOriginsSchema, o as browserObservationEndpointSchema } from "./webContentArtifact-Dzjc1z-R.js";
import { l as init_browserCompleteness, n as browserVersionSchema, r as init_browserObservationSchemas, s as browserCompletenessSchema } from "./browserObservationSchemas-tgqjH7aA.js";
import { z } from "zod";
import { createHash } from "node:crypto";

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
//#region dist/domain/emptyArraySchema.js
var emptyArraySchema;
function init_emptyArraySchema() {
	return (init_emptyArraySchema = __esmMin((() => {
		emptyArraySchema = z.array(z.never()).length(0);
	})))();
}

//#endregion
export { createWebScreenshotArtifact as a, webScreenshotArtifactSchema as c, compareWebScreenshotsInputSchema as i, webScreenshotDiffSchema as l, init_emptyArraySchema as n, decodeCanonicalBase64 as o, captureWebScreenshotInputSchema as r, init_webScreenshot as s, emptyArraySchema as t, webScreenshotSchema as u };