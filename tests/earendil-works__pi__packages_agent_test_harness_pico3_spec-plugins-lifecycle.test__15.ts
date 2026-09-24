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
test("an unregistered kind leaves dependency-blocked tasks pending until a replacement is registered", async () => {
	const gate = new Gate();
	const blocker = defineTask<null, { phase: "never" }, null, null, null>({
		name: "spec.reload-blocker",
		async initial(_task, _runtime, context) {
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
	const makeKind = (result: string) =>
		defineTask<null, { phase: "never" }, string, null, null>({
			name: "spec.pending-reload",
			async initial() {
				return { done: () => ({ status: "completed", result }) };
			},
			phases: {
				async never() {
					return { done: () => ({ status: "completed", result }) };
				},
			},
			async abort() {
				return () => null;
			},
		});
	const original = makeKind("original");
	const env = await open({ taskKinds: [blocker] });
	onTestFinished(() => env.close());
	const removeOriginal = env.h.registerTaskKind(original);
	const refs = await env.root.commit((tx) => {
		const dependency = tx.createTask(blocker, null, { conversationId: 1, background: true });
		const target = tx.createTask(original, null, {
			conversationId: 1,
			background: true,
			after: [dependency.id],
		});
		return { dependency, target };
	}, ctx);
	await gate.arrivals(1);
	removeOriginal();
	gate.open();
	await env.h.waitForTask(refs.dependency.id, ctx);
	await new Promise((resolve) => setTimeout(resolve, 5));
	assert.equal((await env.h.getTask(refs.target.id, ctx))?.status, "pending");
	const replacement = makeKind("replacement");
	env.h.registerTaskKind(replacement);
	assert.deepEqual((await env.h.waitForTask(refs.target.id, ctx)).outcome, {
		status: "completed",
		result: "replacement",
	});
})
// ── END TARGET TEST ─────────────────────────────