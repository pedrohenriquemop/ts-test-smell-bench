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
test("namespace view projection is the only public plugin state and emit produces a namespaced event in the same envelope", async () => {
	const env = await open({});
	onTestFinished(() => env.close());
	const ns = env.h.namespace<{ visible: number; secret: string }>(
		"spec.presentation",
		{ rewindable: { visible: 0 }, sticky: { secret: "hidden" } },
		{ view: (slice) => ({ visible: slice.visible }) },
	);
	const watch = await env.root.watch(ctx);
	const deliveries: Array<{ events?: { type: string; data?: JsonValue }[]; view: object }> = [];
	let folded = watch.view;
	watch.start((envelope) => {
		folded = applyEnvelope(folded, envelope);
		deliveries.push({
			events: (envelope as unknown as { events?: { type: string; data?: JsonValue }[] }).events,
			view: folded,
		});
	});
	await env.root.commit((tx) => {
		const slice = tx.plugins(ns);
		slice.visible = 2;
		slice.secret = "do-not-project";
		tx.emit(ns, "changed", { visible: 2 });
	}, ctx);
	assert.equal(deliveries.length, 1);
	const flat = folded as unknown as { plugins: Record<string, JsonValue> };
	assert.deepEqual(flat.plugins[ns.id], { visible: 2 });
	assert.doesNotMatch(JSON.stringify(flat.plugins), /do-not-project/);
	assert.deepEqual(deliveries[0]!.events, [{ type: "plugin.spec.presentation.changed", data: { visible: 2 } }]);
	watch.stop();
})
// ── END TARGET TEST ─────────────────────────────