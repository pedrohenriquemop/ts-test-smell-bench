import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("hasActualScript", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("returns false for null, undefined, or empty input", () => {
      expect(hasActualScript(null)).toBe(false)
      expect(hasActualScript(undefined)).toBe(false)
      expect(hasActualScript("")).toBe(false)
    })
  // ── END TARGET TEST ─────────────────────────────
});