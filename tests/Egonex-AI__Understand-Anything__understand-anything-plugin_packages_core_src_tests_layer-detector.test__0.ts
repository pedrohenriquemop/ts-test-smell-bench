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

describe("detectLayers", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("detects API/routes layer from file paths", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "users.ts", filePath: "src/routes/users.ts" }),
        makeNode({ id: "f2", name: "auth.ts", filePath: "src/controllers/auth.ts" }),
        makeNode({ id: "f3", name: "health.ts", filePath: "src/api/health.ts" }),
      ]);
      const layers = detectLayers(graph);
      const apiLayer = layers.find((l) => l.name === "API Layer");
      expect(apiLayer).toBeDefined();
      expect(apiLayer!.nodeIds).toContain("f1");
      expect(apiLayer!.nodeIds).toContain("f2");
      expect(apiLayer!.nodeIds).toContain("f3");
    })
  // ── END TARGET TEST ─────────────────────────────
});