import { describe, expect, it } from "vitest";
import { complete } from "../src/compat.ts";
import { MODELS } from "../src/models.generated.ts";
import type { Model } from "../src/types.ts";


// ── TARGET TEST ─────────────────────────────────
it(`${label}: ${model.id}`, async () => {
				const response = await complete(model as Model<any>, {
					messages: [{ role: "user", content: "Say hello.", timestamp: Date.now() }],
				});

				expect(response.content).toBeTruthy();
				expect(response.stopReason).toBe("stop");
			}, 60000)
// ── END TARGET TEST ─────────────────────────────