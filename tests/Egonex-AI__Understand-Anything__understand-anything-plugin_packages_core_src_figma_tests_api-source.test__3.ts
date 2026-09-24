import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("parseFileKey", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("throws on unparseable input", () => {
      expect(() => parseFileKey("not a key!!")).toThrow();
    })
  // ── END TARGET TEST ─────────────────────────────
});