import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("stripJsonSerializedModulePrefix", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("preserves spacing between key delimiter and the stripped value", () => {
      const json = `{"preRequestScript":  "export {};const a = 1;"}`
      const out = stripJsonSerializedModulePrefix(json)
      expect(out).toBe(`{"preRequestScript":  "const a = 1;"}`)
    })
  // ── END TARGET TEST ─────────────────────────────
});