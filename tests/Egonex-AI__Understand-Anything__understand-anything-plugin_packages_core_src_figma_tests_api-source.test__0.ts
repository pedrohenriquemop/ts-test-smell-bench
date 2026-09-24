import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("parseFileKey", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("extracts key from a /file/ URL", () => {
      expect(parseFileKey("https://www.figma.com/file/ABC123/My-App")).toBe("ABC123");
    })
  // ── END TARGET TEST ─────────────────────────────
});