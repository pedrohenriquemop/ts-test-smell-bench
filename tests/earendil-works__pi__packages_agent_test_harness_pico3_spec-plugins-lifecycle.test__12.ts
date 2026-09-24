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
test("custom task describe cannot project private slot memos", async () => {
	const gate = new Gate();
	type Slot = { progress: number; memos?: { secret: string } };
	const kind = defineTask<null, { phase: "never" }, null, null, null, object, KindConfig, Slot>({
		name: "spec.private-memo-view",
		slot: () => ({ progress: 0 }),
		describe: (task) => task.slot ?? null,
		async initial(task, runtime, context) {
			await runtime.commit((tx) => {
				const slot = tx.slot({ id: task.id, kind });
				slot.progress = 1;
				slot.memos = { secret: "never-project" };
			}, context);
			await gate.wait(context);
			return { done: () => ({ status: "completed", result: null }) };
		},
		phases: {
			async never() {
				return { done: () => ({ status: "completed", result: null }) };
			},
		},
		async abort() {
			return () => null;
		},
	});
	const env = await open({ taskKinds: [kind] });
	onTestFinished(() => env.close());
	const ref = await env.root.commit((tx) => tx.createTask(kind, null, { conversationId: 1, background: true }), ctx);
	await gate.arrivals(1);
	const watch = await env.root.watch(ctx);
	assert.deepEqual(watch.view.tasks[ref.id]?.status, { progress: 1 });
	assert.doesNotMatch(JSON.stringify(watch.view), /never-project/);
	watch.stop();
	gate.open();
	await env.h.waitForTask(ref.id, ctx);
})
// ── END TARGET TEST ─────────────────────────────