import { describe, it, expect } from "vitest";
import {
  buildTourGenerationPrompt,
  parseTourGenerationResponse,
  generateHeuristicTour,
} from "../analyzer/tour-generator.js";
import type { KnowledgeGraph } from "../types.js";

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
    { id: "file:src/index.ts", type: "file", name: "index.ts", filePath: "src/index.ts", summary: "Application entry point", tags: ["entry", "server"], complexity: "simple" },
    { id: "file:src/routes.ts", type: "file", name: "routes.ts", filePath: "src/routes.ts", summary: "Route definitions", tags: ["routes", "api"], complexity: "moderate" },
    { id: "file:src/service.ts", type: "file", name: "service.ts", filePath: "src/service.ts", summary: "Business logic", tags: ["service"], complexity: "complex" },
    { id: "file:src/db.ts", type: "file", name: "db.ts", filePath: "src/db.ts", summary: "Database connection", tags: ["database"], complexity: "simple" },
    { id: "concept:auth-flow", type: "concept", name: "Auth Flow", summary: "Authentication concept", tags: ["concept", "auth"], complexity: "moderate" },
  ],
  edges: [
    { source: "file:src/index.ts", target: "file:src/routes.ts", type: "imports", direction: "forward", weight: 0.9 },
    { source: "file:src/routes.ts", target: "file:src/service.ts", type: "calls", direction: "forward", weight: 0.8 },
    { source: "file:src/service.ts", target: "file:src/db.ts", type: "reads_from", direction: "forward", weight: 0.7 },
  ],
  layers: [
    { id: "layer:api", name: "API Layer", description: "HTTP routes", nodeIds: ["file:src/index.ts", "file:src/routes.ts"] },
    { id: "layer:service", name: "Service Layer", description: "Business logic", nodeIds: ["file:src/service.ts"] },
    { id: "layer:data", name: "Data Layer", description: "Database", nodeIds: ["file:src/db.ts"] },
  ],
  tour: [],
};

describe("tour-generator", () => {

  describe("generateHeuristicTour", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("produces valid TourStep objects", () => {
          const tour = generateHeuristicTour(sampleGraph);
          for (const step of tour) {
            expect(typeof step.order).toBe("number");
            expect(typeof step.title).toBe("string");
            expect(step.title.length).toBeGreaterThan(0);
            expect(typeof step.description).toBe("string");
            expect(step.description.length).toBeGreaterThan(0);
            expect(Array.isArray(step.nodeIds)).toBe(true);
            expect(step.nodeIds.length).toBeGreaterThan(0);
          }
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});