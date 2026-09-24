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
test("equal hook memo names are isolated by namespace on one hosting tool task", async () => {
	const observed: Record<string, JsonValue | undefined> = {};
	const declaration: ToolDeclaration = {
		name: "two-approvals",
		description: "",
		parameters: Type.Object({ v: Type.String() }),
		async execute() {
			return { content: [{ type: "text", text: "ran" }] };
		},
	};
	const env = await open({ tools: [declaration] });
	onTestFinished(() => env.close());
	const namespaced = env.h as unknown as {
		hooks<T extends JsonObject>(
			namespace: Namespace<T>,
			kind: typeof kinds.tool,
			handlers: { beforeTool(call: unknown, api: WaitingApi, context: typeof ctx): Promise<void> },
		): () => void;
	};
	for (const id of ["spec.approver-a", "spec.approver-b"] as const) {
		const ns = env.h.namespace(id, {});
		namespaced.hooks(ns, kinds.tool, {
			async beforeTool(_call, api, context) {
				await api.memo("decision", id, context);
				observed[id] = await (api as unknown as MemoToolApi).memo<JsonValue>("decision", context);
			},
		});
	}
	await (await env.root.send({ content: "tool:two-approvals" }, ctx)).wait(ctx);
	assert.deepEqual(observed, {
		"spec.approver-a": "spec.approver-a",
		"spec.approver-b": "spec.approver-b",
	});
})
// ── END TARGET TEST ─────────────────────────────