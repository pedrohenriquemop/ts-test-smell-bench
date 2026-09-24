import { describe, it, expect, vi, beforeEach } from "vitest";
import type { KnowledgeGraph, GraphNode, GraphEdge } from "../types.js";
import { execFileSync } from "child_process";
import {
  getChangedFiles,
  isStale,
  mergeGraphUpdate,
} from "../staleness.js";

const mockedExecFileSync = vi.mocked(execFileSync);
const makeNode = (
  overrides: Partial<GraphNode> & { id: string; name: string },
): GraphNode => ({
  type: "file",
  summary: "",
  tags: [],
  complexity: "simple",
  ...overrides,
});
const makeEdge = (
  overrides: Partial<GraphEdge> & { source: string; target: string },
): GraphEdge => ({
  type: "imports",
  direction: "forward",
  weight: 1,
  ...overrides,
});
function makeGraph(overrides?: Partial<KnowledgeGraph>): KnowledgeGraph {
  return {
    version: "1.0.0",
    project: {
      name: "test-project",
      languages: ["typescript"],
      frameworks: [],
      description: "A test project",
      analyzedAt: "2026-01-01T00:00:00.000Z",
      gitCommitHash: "abc123",
    },
    nodes: [],
    edges: [],
    layers: [],
    tour: [],
    ...overrides,
  };
}
beforeEach(() => {
  vi.clearAllMocks();
});

describe("mergeGraphUpdate", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("replaces nodes for changed files", () => {
      const existingGraph = makeGraph({
        nodes: [
          makeNode({
            id: "file-a",
            name: "a.ts",
            filePath: "src/a.ts",
            summary: "Old summary",
          }),
          makeNode({
            id: "file-b",
            name: "b.ts",
            filePath: "src/b.ts",
            summary: "Unchanged",
          }),
          makeNode({
            id: "func-a1",
            name: "funcA1",
            type: "function",
            filePath: "src/a.ts",
            summary: "Old function",
          }),
        ],
      });

      const newNodes = [
        makeNode({
          id: "file-a-v2",
          name: "a.ts",
          filePath: "src/a.ts",
          summary: "New summary",
        }),
        makeNode({
          id: "func-a2",
          name: "funcA2",
          type: "function",
          filePath: "src/a.ts",
          summary: "New function",
        }),
      ];

      const result = mergeGraphUpdate(
        existingGraph,
        ["src/a.ts"],
        newNodes,
        [],
        "def456",
      );

      // Old nodes from src/a.ts should be gone
      expect(result.nodes.find((n) => n.id === "file-a")).toBeUndefined();
      expect(result.nodes.find((n) => n.id === "func-a1")).toBeUndefined();

      // New nodes should be present
      expect(result.nodes.find((n) => n.id === "file-a-v2")).toBeDefined();
      expect(result.nodes.find((n) => n.id === "func-a2")).toBeDefined();

      // Unchanged file should remain
      expect(result.nodes.find((n) => n.id === "file-b")).toBeDefined();
    })
  // ── END TARGET TEST ─────────────────────────────
});