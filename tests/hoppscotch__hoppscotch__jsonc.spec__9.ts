import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles edge cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("returns empty string unchanged", () => {
          const input = "";
          const result = stripComments(input);
          expect(result).toBe("");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});