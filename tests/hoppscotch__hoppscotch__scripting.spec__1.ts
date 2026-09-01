import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("hasActualScript", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("returns false for whitespace-only input", () => {
      expect(hasActualScript("   ")).toBe(false)
      expect(hasActualScript("\n\t  \n")).toBe(false)
    })
  // ── END TARGET TEST ─────────────────────────────
});