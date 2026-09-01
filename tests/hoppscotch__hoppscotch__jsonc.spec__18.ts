import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles malformed JSON", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("handles JSON with syntax errors", () => {
          const input = '{"key": undefined}'; // undefined is not valid JSON
          const result = stripComments(input);
          // Parser will handle this - exact behavior depends on jsonc-parser
          expect(typeof result).toBe('string');
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});