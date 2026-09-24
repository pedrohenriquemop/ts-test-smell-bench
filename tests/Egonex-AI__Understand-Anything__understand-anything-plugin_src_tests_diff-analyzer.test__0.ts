import { describe, it, expect } from "vitest";
import { buildDiffContext, formatDiffAnalysis } from "../diff-analyzer.js";
import type { KnowledgeGraph } from "@understand-anything/core";

const sampleGraph: KnowledgeGraph = {
  version: "1.0.0",
  project: {
    name: "test-project",
    languages: ["typescript"],
    frameworks: ["express"],
    description: "A test project",
    analyzedAt: "2026-03-14T00:00:00Z",
    gitCommitHash: "abc123",
  },
  nodes: [
    { id: "file:src/index.ts", type: "file", name: "index.ts", filePath: "src/index.ts", summary: "Entry point", tags: ["entry"], complexity: "simple" },
    { id: "file:src/routes.ts", type: "file", name: "routes.ts", filePath: "src/routes.ts", summary: "Routes", tags: ["routes"], complexity: "moderate" },
    { id: "file:src/service.ts", type: "file", name: "service.ts", filePath: "src/service.ts", summary: "Service", tags: ["service"], complexity: "complex" },
    { id: "function:src/service.ts:process", type: "function", name: "process", filePath: "src/service.ts", lineRange: [10, 30], summary: "Process function", tags: ["core"], complexity: "complex" },
    { id: "file:src/db.ts", type: "file", name: "db.ts", filePath: "src/db.ts", summary: "Database", tags: ["db"], complexity: "simple" },
  ],
  edges: [
    { source: "file:src/index.ts", target: "file:src/routes.ts", type: "imports", direction: "forward", weight: 0.9 },
    { source: "file:src/routes.ts", target: "file:src/service.ts", type: "calls", direction: "forward", weight: 0.8 },
    { source: "file:src/service.ts", target: "function:src/service.ts:process", type: "contains", direction: "forward", weight: 1.0 },
    { source: "file:src/service.ts", target: "file:src/db.ts", type: "reads_from", direction: "forward", weight: 0.7 },
  ],
  layers: [
    { id: "layer:api", name: "API Layer", description: "HTTP routes", nodeIds: ["file:src/index.ts", "file:src/routes.ts"] },
    { id: "layer:service", name: "Service Layer", description: "Business logic", nodeIds: ["file:src/service.ts", "function:src/service.ts:process"] },
    { id: "layer:data", name: "Data Layer", description: "Database", nodeIds: ["file:src/db.ts"] },
  ],
  tour: [],
};

describe("diff-analyzer", () => {

  describe("buildDiffContext", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("identifies directly changed nodes", () => {
          const ctx = buildDiffContext(sampleGraph, ["src/service.ts"]);
          expect(ctx.changedNodes.map((n) => n.id)).toContain("file:src/service.ts");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});