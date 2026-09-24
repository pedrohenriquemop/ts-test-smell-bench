import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("parseFileKey", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("accepts a bare key", () => {
      expect(parseFileKey("ABC123")).toBe("ABC123");
    })
  // ── END TARGET TEST ─────────────────────────────
});