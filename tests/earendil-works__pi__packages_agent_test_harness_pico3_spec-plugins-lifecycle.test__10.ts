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
test("suspend clears a waiting hook without terminalizing its durable tool task", async () => {
	const gate = new Gate();
	const declaration: ToolDeclaration = {
		name: "suspended-approval",
		description: "",
		parameters: Type.Object({ v: Type.String() }),
		async execute() {
			return { content: [] };
		},
	};
	const env = await open({ backend: "jsonl", tools: [declaration] });
	onTestFinished(() => env.close());
	const ns = env.h.namespace("spec.suspended-approval", {});
	env.h.hooks(ns, kinds.tool, {
		async beforeTool(_call, api, context) {
			await api.waiting(context);
			await gate.wait(context);
		},
	});
	await env.root.send({ content: "tool:suspended-approval" }, ctx);
	for (let attempt = 0; attempt < 100; attempt++) {
		if ((await env.root.sticky(ctx)).turn.tools[0]?.waitingOn === ns.id) break;
		await new Promise((resolve) => setTimeout(resolve, 1));
	}
	const task = (await env.tasks()).find((candidate) => candidate.kind === "pi.tool")!;
	await env.h.suspend(ctx);
	const storage = await JsonlStorage.open(env.dir!, { fsync: false });
	try {
		const sticky = await storage.doc({ doc: "sticky", conversationId: 1 }, ctx);
		const tools = (sticky as { turn: { tools: Array<{ waitingOn?: string }> } }).turn.tools;
		assert.equal(tools[0]?.waitingOn, undefined);
		assert.equal((await storage.task(task.id, ctx))?.status, "running");
	} finally {
		await storage.close(ctx);
	}
})
// ── END TARGET TEST ─────────────────────────────