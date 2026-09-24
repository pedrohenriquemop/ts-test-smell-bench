import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles edge cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("handles arrays with mixed content", () => {
          const input = '[\n  "string",\n  123, // number\n  true, // boolean\n  null, // null\n  {"nested": "object",}, // object\n]';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual(["string", 123, true, null, { nested: "object" }]);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});