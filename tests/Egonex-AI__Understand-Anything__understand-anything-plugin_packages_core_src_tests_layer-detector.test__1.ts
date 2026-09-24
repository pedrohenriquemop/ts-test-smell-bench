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
  it("detects Data layer from model/entity/repository paths", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "User.ts", filePath: "src/models/User.ts" }),
        makeNode({ id: "f2", name: "Post.ts", filePath: "src/entity/Post.ts" }),
        makeNode({ id: "f3", name: "UserRepo.ts", filePath: "src/repository/UserRepo.ts" }),
      ]);
      const layers = detectLayers(graph);
      const dataLayer = layers.find((l) => l.name === "Data Layer");
      expect(dataLayer).toBeDefined();
      expect(dataLayer!.nodeIds).toContain("f1");
      expect(dataLayer!.nodeIds).toContain("f2");
      expect(dataLayer!.nodeIds).toContain("f3");
    })
  // ── END TARGET TEST ─────────────────────────────
});