import { describe, expect, test } from "vitest"
import { isInfraError } from "~/utils/cage"


describe("isInfraError", () => {

  // ── TARGET TEST ─────────────────────────────────
  test("identifies Error subclasses as infrastructure errors", () => {
      class QuickJSUnwrapError extends Error {
        constructor(message: string) {
          super(message)
          this.name = "QuickJSUnwrapError"
        }
      }

      expect(
        isInfraError(new QuickJSUnwrapError("cannot convert to object"))
      ).toBe(true)
    })
  // ── END TARGET TEST ─────────────────────────────
});