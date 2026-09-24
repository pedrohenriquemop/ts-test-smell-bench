import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles combined cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes both comments and trailing commas", () => {
          const input = '{\n  "key1": "value1", // inline comment\n  /* block comment */\n  "key2": "value2",\n}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key1: "value1", key2: "value2" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});