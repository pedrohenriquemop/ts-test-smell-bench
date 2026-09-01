import { describe, expect, test } from "vitest";
import { stripComments } from "../../utils/jsonc";


describe("stripComments", () => {

  describe("handles multiline comments", () => {

    // ── TARGET TEST ─────────────────────────────────
    test("removes multiline comment spanning multiple lines", () => {
          const input = '{\n  /* This is\n     a multiline\n     comment */\n  "key": "value"\n}';
          const result = stripComments(input);
          const parsed = JSON.parse(result);
          expect(parsed).toEqual({ key: "value" });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});