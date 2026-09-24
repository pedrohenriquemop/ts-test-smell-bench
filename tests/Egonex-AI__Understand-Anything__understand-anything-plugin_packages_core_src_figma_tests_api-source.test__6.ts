import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("FigmaApiSource", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("never leaks the token in error messages", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403, statusText: "Forbidden" }));
      const src = new FigmaApiSource("ABC123", "tok_secret");
      await expect(src.fetchDocument()).rejects.toThrow(/403/);
      await expect(src.fetchDocument()).rejects.not.toThrow(/tok_secret/);
    })
  // ── END TARGET TEST ─────────────────────────────
});