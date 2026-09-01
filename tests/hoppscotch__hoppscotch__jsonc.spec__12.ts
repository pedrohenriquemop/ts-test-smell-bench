import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles edge cases", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("preserves JSON strings containing comment-like sequences", () => {
          const input = '{"url": "https://example.com//path"}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed.url).toBe("https://example.com//path");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});