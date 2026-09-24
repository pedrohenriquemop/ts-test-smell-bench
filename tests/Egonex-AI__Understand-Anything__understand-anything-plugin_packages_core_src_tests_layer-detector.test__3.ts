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
  it("assigns unique kebab-case IDs to each layer", () => {
      const graph = makeGraph([
        makeNode({ id: "f1", name: "users.ts", filePath: "src/routes/users.ts" }),
        makeNode({ id: "f2", name: "User.ts", filePath: "src/models/User.ts" }),
        makeNode({ id: "f3", name: "main.ts", filePath: "src/main.ts" }),
      ]);
      const layers = detectLayers(graph);
      const ids = layers.map((l) => l.id);

      // All IDs should start with "layer:"
      for (const id of ids) {
        expect(id).toMatch(/^layer:/);
      }

      // All IDs should be unique
      expect(new Set(ids).size).toBe(ids.length);
    })
  // ── END TARGET TEST ─────────────────────────────
});