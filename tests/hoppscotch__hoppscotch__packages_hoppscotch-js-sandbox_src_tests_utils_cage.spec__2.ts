import { describe, expect, test } from "vitest"
import { isInfraError } from "~/utils/cage"


describe("isInfraError", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("identifies WASM initialization errors", () => {
      expect(isInfraError(new Error("wasm init failed"))).toBe(true)
    })
  // ── END TARGET TEST ─────────────────────────────
});