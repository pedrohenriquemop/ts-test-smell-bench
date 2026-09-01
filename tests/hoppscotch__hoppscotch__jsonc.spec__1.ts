import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles inline comments", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes multiple inline comments", () => {
          const input = '{\n  "key1": "value1", // comment1\n  "key2": "value2" // comment2\n}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key1: "value1", key2: "value2" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});