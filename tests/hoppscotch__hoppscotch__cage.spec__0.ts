import { describe, expect, test } from "vitest"
import { isInfraError } from "~/utils/cage"


describe("isInfraError", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("identifies Error instances as infrastructure errors", () => {
      expect(isInfraError(new Error("test error"))).toBe(true)
    })
  // ── END TARGET TEST ─────────────────────────────
});