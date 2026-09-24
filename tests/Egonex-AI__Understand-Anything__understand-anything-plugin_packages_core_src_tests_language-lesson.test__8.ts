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
    it("detects middleware pattern", () => {
          const middlewareNode: GraphNode = {
            id: "function:middleware:auth",
            type: "function",
            name: "authMiddleware",
            filePath: "src/middleware/auth.ts",
            summary: "Express middleware for authentication",
            tags: ["middleware", "auth"],
            complexity: "moderate",
          };
          const concepts = detectLanguageConcepts(middlewareNode, "typescript");
          expect(concepts).toContain("middleware pattern");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});