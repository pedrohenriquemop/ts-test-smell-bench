import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("FigmaApiSource", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("throws a friendly error when FIGMA_TOKEN is missing", () => {
      delete process.env.FIGMA_TOKEN;
      expect(() => new FigmaApiSource("ABC123")).toThrow(/FIGMA_TOKEN/);
    })
  // ── END TARGET TEST ─────────────────────────────
});