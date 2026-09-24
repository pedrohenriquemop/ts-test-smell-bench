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
test("runtime task-kind registration seeds defaults into already-loaded documents before the task reads them", async () => {
	let observed: unknown;
	const env = await open({});
	onTestFinished(() => env.close());
	await env.root.rewindable(ctx);
	const kind = defineTask<null, { phase: "done" }, null, null, null, object, { rewindable: { enabled: boolean } }>({
		name: "spec.runtime-default",
		config: { rewindable: { enabled: false } },
		async initial(_task, runtime, context) {
			observed = await runtime.commit(
				(tx, current) => ({
					facade: tx.config(current.conversationId).get("enabled"),
					document: tx.snapshot({ doc: "rewindable", conversationId: current.conversationId }).enabled,
				}),
				context,
			);
			return { next: { phase: "done" } };
		},
		phases: {
			async done() {
				return { done: () => ({ status: "completed", result: null }) };
			},
		},
		async abort() {
			return () => null;
		},
	});
	env.h.registerTaskKind(kind);
	const ref = await env.root.commit(
		(tx) => tx.createTask(kind, null, { conversationId: env.root.id, background: true }),
		ctx,
	);
	await env.h.waitForTask(ref.id, ctx);
	assert.deepEqual(observed, { facade: false, document: false });
})
// ── END TARGET TEST ─────────────────────────────