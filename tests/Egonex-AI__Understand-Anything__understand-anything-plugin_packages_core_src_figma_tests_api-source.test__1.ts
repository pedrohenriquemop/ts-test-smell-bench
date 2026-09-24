import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("parseFileKey", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("extracts key from a /design/ URL with query", () => {
      expect(parseFileKey("https://www.figma.com/design/XYZ789/App?node-id=1-2")).toBe("XYZ789");
    })
  // ── END TARGET TEST ─────────────────────────────
});