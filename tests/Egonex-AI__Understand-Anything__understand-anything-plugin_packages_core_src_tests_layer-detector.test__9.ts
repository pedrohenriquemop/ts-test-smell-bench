import { describe, it, expect } from "vitest";
import {
  detectLayers,
  buildLayerDetectionPrompt,
  parseLayerDetectionResponse,
  applyLLMLayers,
} from "../analyzer/layer-detector.js";
import type { KnowledgeGraph, GraphNode } from "../types.js";

const makeNode = (
  overrides: Partial<GraphNode> & { id: string; name: string },
): GraphNode => ({
  type: "file",
  summary: "",
  tags: [],
  complexity: "simple",
  ...overrides,
});
const makeGraph = (nodes: GraphNode[]): KnowledgeGraph => ({
  version: "1.0.0",
  project: {
    name: "test-project",
    languages: ["typescript"],
    frameworks: [],
    description: "A test project",
    analyzedAt: new Date().toISOString(),
    gitCommitHash: "abc123",
  },
  nodes,
  edges: [],
  layers: [],
  tour: [],
});

describe("applyLLMLayers", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("assigns file nodes to LLM-provided layers and puts unmatched in Other", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "users.ts", filePath: "src/routes/users.ts" }),
        makeNode({ id: "f2", name: "User.ts", filePath: "src/models/User.ts" }),
        makeNode({ id: "f3", name: "main.ts", filePath: "src/main.ts" }),
      ]);
      const llmLayers = [
        { name: "API", description: "HTTP endpoints", filePatterns: ["src/routes/"] },
        { name: "Data", description: "Models", filePatterns: ["src/models/"] },
      ];
      const layers = applyLLMLayers(graph, llmLayers);

      const apiLayer = layers.find((l) => l.name === "API");
      expect(apiLayer).toBeDefined();
      expect(apiLayer!.nodeIds).toContain("f1");

      const dataLayer = layers.find((l) => l.name === "Data");
      expect(dataLayer).toBeDefined();
      expect(dataLayer!.nodeIds).toContain("f2");

      const otherLayer = layers.find((l) => l.name === "Other");
      expect(otherLayer).toBeDefined();
      expect(otherLayer!.nodeIds).toContain("f3");
    })
  // ── END TARGET TEST ─────────────────────────────
});