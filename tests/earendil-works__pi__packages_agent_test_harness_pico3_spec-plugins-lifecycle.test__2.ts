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
test("namespace declarations reject ambiguous routing, reserved names, duplicate live registrations, and stale emits", async () => {
	const env = await open({});
	onTestFinished(() => env.close());
	assert.throws(() => env.h.namespace("pi.private", {}), /invalid namespace/);
	assert.throws(() => env.h.namespace("bad space", {}), /invalid namespace/);
	assert.throws(
		() =>
			env.h.namespace<{ duplicate: number }>("spec.ambiguous", {
				rewindable: { duplicate: 1 },
				sticky: { duplicate: 2 },
			}),
		/more than one document/,
	);
	const token = env.h.namespace<{ value: number }>("spec.unique", { sticky: { value: 0 } });
	assert.throws(() => env.h.namespace("spec.unique", {}), /already registered/);
	token.unregister();
	await assert.rejects(
		env.root.commit((tx) => tx.emit(token, "late", { value: true }), ctx),
		Forbidden,
	);
})
// ── END TARGET TEST ─────────────────────────────