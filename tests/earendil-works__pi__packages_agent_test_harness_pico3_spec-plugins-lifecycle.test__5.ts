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
test("ToolApi.memo serializes concurrent writers, returns the durable winner, and isolates later tool tasks", async () => {
	const schema = Type.Object({ v: Type.String() });
	const winners: JsonValue[][] = [];
	const declaration: ToolDeclaration<typeof schema> = {
		name: "memo-tool",
		description: "",
		parameters: schema,
		replay: "safe",
		async execute(_args, rawApi, context) {
			const api = rawApi as MemoToolApi;
			const pair = await Promise.all([api.memo("winner", "first", context), api.memo("winner", "second", context)]);
			winners.push(pair);
			const stored = await api.memo<JsonValue>("winner", context);
			return { content: [{ type: "text", text: JSON.stringify({ pair, stored }) }] };
		},
	};
	const env = await open({ tools: [declaration], root: { rewindable: { model, selectedTools: [declaration.name] } } });
	onTestFinished(() => env.close());
	await (await env.root.send({ content: "tool:memo-tool" }, ctx)).wait(ctx);
	await (await env.root.send({ content: "tool:memo-tool" }, ctx)).wait(ctx);
	assert.deepEqual(winners, [
		["first", "first"],
		["first", "first"],
	]);
	const toolTasks = (await env.tasks()).filter((task) => task.kind === "pi.tool");
	assert.equal(toolTasks.length, 2);
	const sticky = await env.root.sticky(ctx);
	for (const task of toolTasks) assert.equal(sticky.tasks[task.id], undefined, "terminal slot and memos retired");
})
// ── END TARGET TEST ─────────────────────────────