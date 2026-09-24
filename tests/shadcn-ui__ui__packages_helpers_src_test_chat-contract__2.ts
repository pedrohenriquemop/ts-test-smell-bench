import { describe, expect, it } from "vitest"

type ContractMessage = {
  id: string
  role: string
  parts: unknown[]
}
type ContractChat<MESSAGE extends ContractMessage> = {
  get(count?: number): MESSAGE[]
  next(messages: readonly MESSAGE[]): MESSAGE | null
}
function mutateNestedValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(mutateNestedValue)
  }

  if (value === null || typeof value !== "object") {
    return false
  }

  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string") {
      const object = value as Record<string, unknown>

      object[key] = "mutated"
      return true
    }

    if (mutateNestedValue(child)) {
      return true
    }
  }

  return false
}

describe(`${adapter} chat contract`, () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns detached transcript snapshots", () => {
        const chat = createFixture()
        const expected = chat.get()
        const snapshot = chat.get()

        expect(mutateNestedValue(snapshot[0].parts)).toBe(true)
        expect(chat.get()).toEqual(expected)
      })
  // ── END TARGET TEST ─────────────────────────────
});