import { describe, it, expect } from "vitest";
import { SemanticSearchEngine, cosineSimilarity } from "../embedding-search.js";
import type { GraphNode } from "../types.js";

const nodes: GraphNode[] = [
  { id: "n1", type: "file", name: "auth.ts", summary: "Authentication module", tags: ["auth"], complexity: "moderate" },
  { id: "n2", type: "file", name: "db.ts", summary: "Database connection", tags: ["db"], complexity: "simple" },
  { id: "n3", type: "function", name: "login", summary: "User login handler", tags: ["auth", "login"], complexity: "moderate" },
];
const embeddings: Record<string, number[]> = {
  n1: [1, 0, 0, 0],
  n2: [0, 1, 0, 0],
  n3: [0.9, 0, 0.1, 0],
};

describe("embedding-search", () => {

  describe("SemanticSearchEngine", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("hasEmbeddings returns false when empty", () => {
          const engine = new SemanticSearchEngine(nodes, {});
          expect(engine.hasEmbeddings()).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});