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

describe("buildLayerDetectionPrompt", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("contains file paths and mentions JSON in the prompt", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "index.ts", filePath: "src/index.ts" }),
        makeNode({ id: "f2", name: "app.ts", filePath: "src/app.ts" }),
      ]);
      const prompt = buildLayerDetectionPrompt(graph);
      expect(prompt).toContain("src/index.ts");
      expect(prompt).toContain("src/app.ts");
      expect(prompt).toContain("JSON");
    })
  // ── END TARGET TEST ─────────────────────────────
});