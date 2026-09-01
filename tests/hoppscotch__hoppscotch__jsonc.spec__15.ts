import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles null return from stripComments_", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("gracefully handles potential null from jsonc-parser", () => {
          const input = '{"key": "value"}';
          const result = stripComments(input);
          expect(result).toBeTruthy();
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key: "value" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});