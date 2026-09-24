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

describe("parseLayerDetectionResponse", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns null for invalid/unparseable input", () => {
      expect(parseLayerDetectionResponse("not json at all")).toBeNull();
      expect(parseLayerDetectionResponse("{}")).toBeNull();
      expect(parseLayerDetectionResponse("")).toBeNull();
    })
  // ── END TARGET TEST ─────────────────────────────
});