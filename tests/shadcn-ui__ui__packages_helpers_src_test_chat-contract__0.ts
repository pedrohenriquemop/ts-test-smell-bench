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
  it("reads the full transcript or a prefix without advancing", () => {
        const chat = createFixture()
        const messages = chat.get()

        expect(messages.map((message) => message.role)).toEqual([
          "user",
          "assistant",
          "user",
          "assistant",
        ])
        expect(chat.get(2)).toEqual(messages.slice(0, 2))
        expect(chat.get()).toEqual(messages)
      })
  // ── END TARGET TEST ─────────────────────────────
});