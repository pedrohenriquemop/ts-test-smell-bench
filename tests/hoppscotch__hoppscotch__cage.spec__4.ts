import { describe, expect, test } from "vitest"
import { isInfraError } from "~/utils/cage"


describe("isInfraError", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("handles non-object and null errors gracefully", () => {
      expect(isInfraError("string error")).toBe(false)
      expect(isInfraError(null)).toBe(false)
      expect(isInfraError(undefined)).toBe(false)
    })
  // ── END TARGET TEST ─────────────────────────────
});