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
test("namespace token identity is current authority; unregister is idempotent; re-register retains state and adds defaults", async () => {
	const env = await open({});
	onTestFinished(() => env.close());
	const old = env.h.namespace<{ value: number }>("spec.reload", { rewindable: { value: 1 } });
	await env.root.commit((tx) => {
		tx.plugins(old).value = 7;
	}, ctx);
	old.unregister();
	old.unregister();
	await assert.rejects(
		env.root.commit((tx) => tx.plugins(old), ctx),
		Forbidden,
	);

	const current = env.h.namespace<{ value: number; added: string }>("spec.reload", {
		rewindable: { value: 100, added: "new-default" },
	});
	assert.deepEqual(await env.root.commit((tx) => cloneJson(tx.plugins(current)), ctx), {
		value: 7,
		added: "new-default",
	});
	old.unregister();
	await env.root.commit((tx) => {
		tx.plugins(current).added = "still-current";
	}, ctx);
	assert.equal(await env.root.commit((tx) => tx.plugins(current).added, ctx), "still-current");
})
// ── END TARGET TEST ─────────────────────────────