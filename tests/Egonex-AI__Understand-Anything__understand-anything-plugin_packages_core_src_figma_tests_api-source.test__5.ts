import { describe, it, expect, vi, afterEach } from "vitest";
import { parseFileKey, FigmaApiSource } from "../source/api-source";

afterEach(() => { vi.restoreAllMocks(); delete process.env.FIGMA_TOKEN; });

describe("FigmaApiSource", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("fetches the document and sends the token header", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ name: "Doc", document: { id: "0:0", type: "DOCUMENT", name: "Doc", children: [] } }),
      });
      vi.stubGlobal("fetch", fetchMock);
      const src = new FigmaApiSource("ABC123", "tok_secret");
      const doc = await src.fetchDocument();
      expect(doc.name).toBe("Doc");
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain("/files/ABC123");
      expect((init.headers as Record<string, string>)["X-Figma-Token"]).toBe("tok_secret");
    })
  // ── END TARGET TEST ─────────────────────────────
});