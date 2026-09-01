import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles trailing commas", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes multiple trailing commas in nested structures", () => {
          const input = '{"arr": ["a", "b",], "obj": {"key": "value",},}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ arr: ["a", "b"], obj: { key: "value" } });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});