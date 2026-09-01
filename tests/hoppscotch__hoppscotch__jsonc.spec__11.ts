import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles edge cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("handles valid JSON without comments", () => {
          const input = '{"key": "value"}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key: "value" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});