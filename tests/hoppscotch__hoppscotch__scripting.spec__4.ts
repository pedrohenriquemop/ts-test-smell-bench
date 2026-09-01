import { describe, expect, test } from "vitest"
import {
  hasActualScript,
  stripJsonSerializedModulePrefix,
} from "@hoppscotch/js-sandbox/scripting"


describe("stripJsonSerializedModulePrefix", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("strips `export {};\\n` from JSON string values", () => {
      const json = JSON.stringify({
        preRequestScript: "export {};\nconst x = 1;",
        testScript: "export {};const y = 2;",
      })
      const out = stripJsonSerializedModulePrefix(json)
      const parsed = JSON.parse(out) as Record<string, string>
      expect(parsed.preRequestScript).toBe("const x = 1;")
      expect(parsed.testScript).toBe("const y = 2;")
    })
  // ── END TARGET TEST ─────────────────────────────
});