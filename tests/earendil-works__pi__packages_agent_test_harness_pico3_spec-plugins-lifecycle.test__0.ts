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
test("namespace defaults route to their declared documents, preserve null, and seed lazily", async () => {
	const env = await open({});
	onTestFinished(() => env.close());
	const ns = env.h.namespace<{
		plan: { enabled: boolean };
		cache: string | null;
		global: { count: number };
	}>("spec.routing", {
		rewindable: { plan: { enabled: false } },
		sticky: { cache: null },
		session: { global: { count: 0 } },
	});
	const first = await env.root.commit((tx) => {
		const slice = tx.plugins(ns);
		assert.equal(slice.cache, null);
		slice.plan.enabled = true;
		slice.global.count++;
		return cloneJson(slice);
	}, ctx);
	assert.deepEqual(first, { plan: { enabled: true }, cache: null, global: { count: 1 } });
	assert.deepEqual((await env.root.rewindable(ctx)).plugins[ns.id], { plan: { enabled: true } });
	assert.deepEqual((await env.root.sticky(ctx)).plugins[ns.id], { cache: null });
	const sessionSlice = await env.root.commit((tx) => cloneJson(tx.plugins(ns).global), ctx);
	assert.deepEqual(sessionSlice, { count: 1 });
})
// ── END TARGET TEST ─────────────────────────────