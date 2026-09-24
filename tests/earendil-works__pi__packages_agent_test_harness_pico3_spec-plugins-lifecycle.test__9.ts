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
test("abort unwinds a waiting beforeTool handler and does not leave waitingOn durable", async () => {
	const waitingGate = new Gate();
	const declaration: ToolDeclaration = {
		name: "wait-forever",
		description: "",
		parameters: Type.Object({ v: Type.String() }),
		async execute() {
			return { content: [] };
		},
	};
	const env = await open({ tools: [declaration] });
	onTestFinished(() => env.close());
	const ns = env.h.namespace("spec.abort-approval", {});
	const namespaced = env.h as unknown as {
		hooks<T extends JsonObject>(
			namespace: Namespace<T>,
			kind: typeof kinds.tool,
			handlers: { beforeTool(call: unknown, api: WaitingApi, context: typeof ctx): Promise<void> },
		): () => void;
	};
	namespaced.hooks(ns, kinds.tool, {
		async beforeTool(_call, api, context) {
			await api.waiting(context);
			await waitingGate.wait(context);
		},
	});
	const input = await env.root.send({ content: "tool:wait-forever" }, ctx);
	for (let i = 0; i < 100; i++) {
		if ((await env.root.sticky(ctx)).turn.tools[0]?.waitingOn === ns.id) break;
		await new Promise((resolve) => setTimeout(resolve, 1));
	}
	assert.equal((await env.root.sticky(ctx)).turn.tools[0]?.waitingOn, ns.id);
	await env.root.abort(ctx);
	assert.equal((await input.result(ctx))?.reason, "aborted");
	assert.deepEqual((await env.root.sticky(ctx)).turn, { tools: [] });
})
// ── END TARGET TEST ─────────────────────────────