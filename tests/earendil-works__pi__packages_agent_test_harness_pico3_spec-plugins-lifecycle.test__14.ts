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
test("an already-running kind keeps its captured config authority after unregister", async () => {
	const gate = new Gate();
	const kind = defineTask<null, { phase: "never" }, string, null, null, object, { sticky: { leaseValue: string } }>({
		name: "spec.active-reload",
		config: { sticky: { leaseValue: "old-default" } },
		async initial(task, runtime, context) {
			await gate.wait(context);
			const value = await runtime.commit((tx) => tx.config(task.conversationId).get("leaseValue"), context);
			return { done: () => ({ status: "completed", result: String(value) }) };
		},
		phases: {
			async never() {
				return { done: () => ({ status: "completed", result: "never" }) };
			},
		},
		async abort() {
			return () => null;
		},
	});
	const env = await open({});
	onTestFinished(() => env.close());
	const unregister = env.h.registerTaskKind(kind);
	const ref = await env.root.commit((tx) => tx.createTask(kind, null, { conversationId: 1, background: true }), ctx);
	await gate.arrivals(1);
	unregister();
	gate.open();
	assert.deepEqual((await env.h.waitForTask(ref.id, ctx)).outcome, {
		status: "completed",
		result: "old-default",
	});
})
// ── END TARGET TEST ─────────────────────────────