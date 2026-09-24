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
  it("puts unmatched file nodes in Core layer", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "main.ts", filePath: "src/main.ts" }),
        makeNode({ id: "f2", name: "app.ts", filePath: "src/app.ts" }),
      ]);
      const layers = detectLayers(graph);
      const coreLayer = layers.find((l) => l.name === "Core");
      expect(coreLayer).toBeDefined();
      expect(coreLayer!.nodeIds).toContain("f1");
      expect(coreLayer!.nodeIds).toContain("f2");
    })
  // ── END TARGET TEST ─────────────────────────────
});