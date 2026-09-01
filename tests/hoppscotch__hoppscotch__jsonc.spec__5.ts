import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles trailing commas", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes trailing comma in array", () => {
          const input = '["item1", "item2",]';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual(["item1", "item2"]);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});