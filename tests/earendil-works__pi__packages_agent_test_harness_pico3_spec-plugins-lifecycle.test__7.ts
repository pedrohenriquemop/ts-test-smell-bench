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
test("beforeTool waiting/memo/emit are namespace-bound and waitingOn clears atomically with started", async () => {
	const toolGate = new Gate();
	const declaration: ToolDeclaration = {
		name: "approved-tool",
		description: "",
		parameters: Type.Object({ v: Type.String() }),
		replay: "safe",
		async execute(_args, _api, context) {
			await toolGate.wait(context);
			return { content: [{ type: "text", text: "ran" }] };
		},
	};
	const env = await open({ tools: [declaration] });
	onTestFinished(() => env.close());
	const ns = env.h.namespace<{ approvals: number }>("spec.approval", { sticky: { approvals: 0 } });
	const harnessWithNamespacedHooks = env.h as unknown as {
		hooks<T extends JsonObject>(
			namespace: Namespace<T>,
			kind: typeof kinds.tool,
			handlers: { beforeTool(call: unknown, api: WaitingApi, context: typeof ctx): Promise<void> },
		): () => void;
	};
	let releaseApproval!: () => void;
	const approval = new Promise<void>((resolve) => {
		releaseApproval = resolve;
	});
	const off = harnessWithNamespacedHooks.hooks(ns, kinds.tool, {
		async beforeTool(_call, api, context) {
			await api.waiting(context);
			await approval;
			await api.memo("decision", "allow", context);
			await api.emit("approved", { by: "spec" }, context);
		},
	});
	const input = await env.root.send({ content: "tool:approved-tool" }, ctx);
	for (let i = 0; i < 100; i++) {
		const waiting = (await env.root.sticky(ctx)).turn.tools[0]?.waitingOn;
		if (waiting === ns.id) break;
		await new Promise((resolve) => setTimeout(resolve, 1));
	}
	assert.equal((await env.root.sticky(ctx)).turn.tools[0]?.waitingOn, ns.id);
	releaseApproval();
	await toolGate.arrivals(1);
	const slot = (await env.root.sticky(ctx)).turn.tools[0]!;
	assert.equal(slot.status, "running");
	assert.equal(slot.waitingOn, undefined);
	toolGate.open();
	await input.wait(ctx);
	off();
})
// ── END TARGET TEST ─────────────────────────────