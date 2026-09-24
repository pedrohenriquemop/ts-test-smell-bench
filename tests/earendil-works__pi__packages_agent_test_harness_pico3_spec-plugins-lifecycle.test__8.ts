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
test("a throwing beforeTool handler clears waitingOn in the same synthetic-result envelope", async () => {
	let toolCalls = 0;
	const declaration: ToolDeclaration = {
		name: "blocked-after-wait",
		description: "",
		parameters: Type.Object({ v: Type.String() }),
		async execute() {
			toolCalls++;
			return { content: [{ type: "text", text: "must not run" }] };
		},
	};
	const env = await open({ tools: [declaration] });
	onTestFinished(() => env.close());
	const ns = env.h.namespace("spec.throwing-approval", {});
	const namespaced = env.h as unknown as {
		hooks<T extends JsonObject>(
			namespace: Namespace<T>,
			kind: typeof kinds.tool,
			handlers: { beforeTool(call: unknown, api: WaitingApi, context: typeof ctx): Promise<void> },
		): () => void;
	};
	const off = namespaced.hooks(ns, kinds.tool, {
		async beforeTool(_call, api, context) {
			await api.waiting(context);
			throw new Error("approval service failed");
		},
	});
	const watch = await env.root.watch(ctx);
	const envelopes: Array<{ ops: unknown[]; events: Array<{ type: string }> }> = [];
	watch.start((envelope) =>
		envelopes.push(envelope as unknown as { ops: unknown[]; events: Array<{ type: string }> }),
	);
	await (await env.root.send({ content: "tool:blocked-after-wait" }, ctx)).wait(ctx);
	assert.equal(toolCalls, 0);
	const result = (await env.entries()).find((entry) => entry.kind === "pi.tool_result")!;
	assert.match(contentOf(result), /hook threw: Error: approval service failed/);
	const finish = envelopes.find((envelope) => envelope.events.some((event) => event.type === "tool.finished"));
	assert.ok(finish);
	assert.match(JSON.stringify(finish.ops), /waitingOn/);
	assert.equal((await env.root.sticky(ctx)).turn.tools.length, 0);
	watch.stop();
	off();
})
// ── END TARGET TEST ─────────────────────────────