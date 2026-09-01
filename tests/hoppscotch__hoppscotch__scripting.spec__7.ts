import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("stripJsonSerializedModulePrefix", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("does not strip when the prefix appears mid-value", () => {
      const json = JSON.stringify({
        preRequestScript: "const a = 1;\nexport {};\nconst b = 2;",
      })
      expect(stripJsonSerializedModulePrefix(json)).toBe(json)
    })
  // ── END TARGET TEST ─────────────────────────────
});