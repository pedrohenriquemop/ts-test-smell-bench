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
  it("only assigns file-type nodes, ignoring functions and classes", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "users.ts", type: "file", filePath: "src/routes/users.ts" }),
        makeNode({ id: "fn1", name: "getUser", type: "function", filePath: "src/routes/users.ts" }),
        makeNode({ id: "c1", name: "UserController", type: "class", filePath: "src/routes/users.ts" }),
      ]);
      const layers = detectLayers(graph);
      const allNodeIds = layers.flatMap((l) => l.nodeIds);
      expect(allNodeIds).toContain("f1");
      expect(allNodeIds).not.toContain("fn1");
      expect(allNodeIds).not.toContain("c1");
    })
  // ── END TARGET TEST ─────────────────────────────
});