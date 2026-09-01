import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles multiline comments", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes single multiline comment", () => {
          const input = '{\n  /* This is a comment */\n  "key": "value"\n}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key: "value" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});