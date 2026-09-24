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

describe("getChangedFiles", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns changed file list from git diff", () => {
      mockedExecFileSync.mockReturnValue("src/index.ts\nsrc/utils.ts\n");

      const result = getChangedFiles("/project", "abc123");

      expect(result).toEqual(["src/index.ts", "src/utils.ts"]);
      expect(mockedExecFileSync).toHaveBeenCalledWith(
        "git",
        ["diff", "abc123..HEAD", "--name-only"],
        { cwd: "/project", encoding: "utf-8" },
      );
    })
  // ── END TARGET TEST ─────────────────────────────
});