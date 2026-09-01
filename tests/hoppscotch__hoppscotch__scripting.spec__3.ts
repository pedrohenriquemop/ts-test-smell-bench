import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("hasActualScript", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("returns true when script body exists after the prefix", () => {
      expect(hasActualScript("export {};\nconst x = 1;")).toBe(true)
      expect(hasActualScript("const x = 1;")).toBe(true)
    })
  // ── END TARGET TEST ─────────────────────────────
});