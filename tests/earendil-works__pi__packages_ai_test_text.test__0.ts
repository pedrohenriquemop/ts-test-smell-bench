import { describe, expect, it } from "vitest";
import { type AssistantMessage, contentText, type ToolResultMessage } from "../src/index.ts";

const content: AssistantMessage["content"] = [
	{ type: "thinking", thinking: "reasoning" },
	{ type: "text", text: "first" },
	{ type: "toolCall", id: "1", name: "read", arguments: {} },
	{ type: "text", text: "second" },
];

describe("contentText", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("extracts assistant text blocks", () => {
  		expect(contentText(content)).toBe("first\nsecond");
  	})
  // ── END TARGET TEST ─────────────────────────────
});