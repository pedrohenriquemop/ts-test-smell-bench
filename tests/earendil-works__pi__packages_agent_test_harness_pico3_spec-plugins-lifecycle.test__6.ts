import assert from "node:assert/strict";
import { Type } from "typebox";
import { onTestFinished, test } from "vitest";
import { applyEnvelope, kinds } from "../../../src/harness/pico3/harness.ts";
import { JsonlStorage } from "../../../src/harness/pico3/jsonl.ts";
import {
	defineTask,
	Forbidden,
	type JsonObject,
	type JsonValue,
	type KindConfig,
	memoOnce,
	type Namespace,
	type ToolApi,
	type ToolDeclaration,
} from "../../../src/harness/pico3/types.ts";
import { contentOf, ctx, Gate, model, open } from "./helpers.ts";

type MemoToolApi = ToolApi & {
	memo<T extends JsonValue>(name: string, candidate: T, context: typeof ctx): Promise<T>;
	memo<T extends JsonValue>(name: string, context: typeof ctx): Promise<T | undefined>;
};
const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
type WaitingApi = {
	waiting(context: typeof ctx): Promise<void>;
	memo<T extends JsonValue>(name: string, candidate: T, context: typeof ctx): Promise<T>;
	emit(name: string, data: JsonValue, context: typeof ctx): Promise<void>;
};

// ── TARGET TEST ─────────────────────────────────
test("a safe tool memo survives recovery and prevents repeating the coordinated external decision", async () => {
	const gate = new Gate();
	let asks = 0;
	let missingApi = false;
	const makeTool = (block: boolean): ToolDeclaration => ({
		name: "recover-memo",
		description: "",
		parameters: Type.Object({ v: Type.String() }),
		replay: "safe",
		async execute(_args, rawApi, context) {
			const api = rawApi as Partial<MemoToolApi>;
			if (typeof api.memo !== "function") {
				missingApi = true;
				asks++;
				if (block) await gate.wait(context);
				return { content: [{ type: "text", text: "memo unavailable" }] };
			}
			let decision = await api.memo<string>("decision", context);
			if (decision === undefined) {
				asks++;
				decision = await api.memo("decision", "approved", context);
				if (block) await gate.wait(context);
			}
			return { content: [{ type: "text", text: decision }] };
		},
	});
	let env = await open({ backend: "jsonl", tools: [makeTool(true)] });
	onTestFinished(() => env.close());
	await env.root.send({ content: "tool:recover-memo" }, ctx);
	await gate.arrivals(1);
	await env.crash();
	env = await open({ dir: env.dir, backend: "jsonl", tools: [makeTool(false)] });
	await env.root.waitForIdle(ctx);
	assert.equal(missingApi, false);
	assert.equal(asks, 1, "recovery reads the first invocation's durable memo instead of asking again");
	const result = (await env.entries()).find((entry) => entry.kind === "pi.tool_result")!;
	assert.match(contentOf(result), /approved/);
})
// ── END TARGET TEST ─────────────────────────────