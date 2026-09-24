import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles trailing commas", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes trailing comma in object", () => {
          const input = '{"key": "value",}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key: "value" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});