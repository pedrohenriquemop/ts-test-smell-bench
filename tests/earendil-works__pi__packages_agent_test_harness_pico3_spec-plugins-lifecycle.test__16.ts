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
test("task kind unregister/re-register makes old tokens stale without letting an old unsubscribe remove the replacement", async () => {
	const calls: string[] = [];
	const make = (label: string) =>
		defineTask<null, { phase: "done" }, string, null, null>({
			name: "spec.reload-kind",
			async initial() {
				calls.push(label);
				return { next: { phase: "done" } };
			},
			phases: {
				async done() {
					return { done: () => ({ status: "completed", result: label }) };
				},
			},
			async abort() {
				return () => null;
			},
		});
	const env = await open({});
	onTestFinished(() => env.close());
	const old = make("old");
	const unregisterOld = env.h.registerTaskKind(old);
	unregisterOld();
	unregisterOld();
	const replacement = make("replacement");
	env.h.registerTaskKind(replacement);
	unregisterOld();
	await assert.rejects(
		env.root.commit((tx) => tx.createTask(old, null, { conversationId: 1 }), ctx),
		Forbidden,
	);
	const ref = await env.root.commit(
		(tx) => tx.createTask(replacement, null, { conversationId: 1, background: true }),
		ctx,
	);
	const terminal = await env.h.waitForTask(ref.id, ctx);
	assert.deepEqual(terminal.outcome, { status: "completed", result: "replacement" });
	assert.deepEqual(calls, ["replacement"]);
})
// ── END TARGET TEST ─────────────────────────────