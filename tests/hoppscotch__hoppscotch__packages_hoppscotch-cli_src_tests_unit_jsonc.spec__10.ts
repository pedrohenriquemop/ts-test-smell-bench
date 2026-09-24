import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles edge cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("returns whitespace-only string unchanged", () => {
          const input = "   \n  \t  ";
          const result = stripComments(input);
          expect(result).toBe(input);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});