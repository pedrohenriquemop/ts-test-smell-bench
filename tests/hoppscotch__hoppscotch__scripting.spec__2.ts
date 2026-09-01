import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("hasActualScript", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("returns false when only the Monaco module prefix is present", () => {
      expect(hasActualScript("export {};\n")).toBe(false)
      expect(hasActualScript("export {};")).toBe(false)
      expect(hasActualScript("export {};\n   ")).toBe(false)
    })
  // ── END TARGET TEST ─────────────────────────────
});