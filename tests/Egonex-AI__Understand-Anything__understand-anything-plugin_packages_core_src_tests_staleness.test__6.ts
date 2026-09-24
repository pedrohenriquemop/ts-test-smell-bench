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
  it("removes edges originating from changed files", () => {
      const existingGraph = makeGraph({
        nodes: [
          makeNode({ id: "file-a", name: "a.ts", filePath: "src/a.ts" }),
          makeNode({ id: "file-b", name: "b.ts", filePath: "src/b.ts" }),
          makeNode({ id: "file-c", name: "c.ts", filePath: "src/c.ts" }),
        ],
        edges: [
          // Edge from changed file -> should be removed
          makeEdge({ source: "file-a", target: "file-b" }),
          // Edge between unchanged files -> should remain
          makeEdge({ source: "file-b", target: "file-c" }),
          // Edge to changed file from unchanged -> should remain
          makeEdge({ source: "file-c", target: "file-a" }),
        ],
      });

      const newNodes = [
        makeNode({
          id: "file-a-v2",
          name: "a.ts",
          filePath: "src/a.ts",
          summary: "Updated",
        }),
      ];

      const newEdges = [
        makeEdge({ source: "file-a-v2", target: "file-c" }),
      ];

      const result = mergeGraphUpdate(
        existingGraph,
        ["src/a.ts"],
        newNodes,
        newEdges,
        "def456",
      );

      // Old edge from file-a should be removed
      expect(
        result.edges.find(
          (e) => e.source === "file-a" && e.target === "file-b",
        ),
      ).toBeUndefined();

      // Edge between unchanged files should remain
      expect(
        result.edges.find(
          (e) => e.source === "file-b" && e.target === "file-c",
        ),
      ).toBeDefined();

      // Edge to changed file from unchanged should be removed (dangling target)
      expect(
        result.edges.find(
          (e) => e.source === "file-c" && e.target === "file-a",
        ),
      ).toBeUndefined();

      // New edge should be added
      expect(
        result.edges.find(
          (e) => e.source === "file-a-v2" && e.target === "file-c",
        ),
      ).toBeDefined();
    })
  // ── END TARGET TEST ─────────────────────────────
});