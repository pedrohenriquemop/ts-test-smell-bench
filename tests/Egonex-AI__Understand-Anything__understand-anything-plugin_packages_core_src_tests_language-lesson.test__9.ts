import { describe, it, expect } from "vitest";
import {
  buildLanguageLessonPrompt,
  parseLanguageLessonResponse,
  detectLanguageConcepts,
} from "../analyzer/language-lesson.js";
import type { GraphNode, GraphEdge } from "../types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";

const sampleNode: GraphNode = {
  id: "function:auth:verifyToken",
  type: "function",
  name: "verifyToken",
  filePath: "src/auth/verify.ts",
  lineRange: [10, 35],
  summary: "Verifies JWT tokens and extracts user payload using async/await",
  tags: ["auth", "jwt", "async"],
  complexity: "moderate",
};
const sampleEdges: GraphEdge[] = [
  {
    source: "function:auth:verifyToken",
    target: "file:src/config.ts",
    type: "reads_from",
    direction: "forward",
    weight: 0.6,
  },
  {
    source: "file:src/middleware.ts",
    target: "function:auth:verifyToken",
    type: "calls",
    direction: "forward",
    weight: 0.8,
  },
];

describe("language-lesson", () => {

  describe("detectLanguageConcepts", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("returns empty for nodes with no detectable concepts", () => {
          const plainNode: GraphNode = {
            id: "file:src/config.ts",
            type: "file",
            name: "config.ts",
            filePath: "src/config.ts",
            summary: "Exports configuration values from environment variables",
            tags: ["config"],
            complexity: "simple",
          };
          const concepts = detectLanguageConcepts(plainNode, "typescript");
          expect(concepts).toEqual([]);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});