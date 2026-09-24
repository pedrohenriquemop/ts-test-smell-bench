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
  it("parses JSON wrapped in markdown fences", () => {
      const response = `Here are the layers:
  \`\`\`json
  [
    { "name": "UI", "description": "Frontend components", "filePatterns": ["src/components/"] }
  ]
  \`\`\``;
      const result = parseLayerDetectionResponse(response);
      expect(result).not.toBeNull();
      expect(result!.length).toBe(1);
      expect(result![0].name).toBe("UI");
    })
  // ── END TARGET TEST ─────────────────────────────
});