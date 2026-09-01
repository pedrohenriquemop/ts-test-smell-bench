import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles inline comments", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes single inline comment", () => {
          const input = '{"key": "value" // comment\n}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key: "value" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});