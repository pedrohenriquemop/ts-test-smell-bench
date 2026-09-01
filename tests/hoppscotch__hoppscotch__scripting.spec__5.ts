import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("stripJsonSerializedModulePrefix", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("leaves values without the prefix untouched", () => {
      const json = JSON.stringify({
        name: "request name",
        preRequestScript: "const z = 3;",
      })
      expect(stripJsonSerializedModulePrefix(json)).toBe(json)
    })
  // ── END TARGET TEST ─────────────────────────────
});