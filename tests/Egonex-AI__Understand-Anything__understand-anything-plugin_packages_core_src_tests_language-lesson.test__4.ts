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

  describe("parseLanguageLessonResponse", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("parses a valid response", () => {
          const response = JSON.stringify({
            languageNotes:
              "Uses async/await for non-blocking token verification.",
            concepts: [
              {
                name: "async/await",
                explanation:
                  "The function uses async/await to handle asynchronous JWT verification.",
              },
            ],
          });
          const result = parseLanguageLessonResponse(response);
          expect(result.languageNotes).toBe(
            "Uses async/await for non-blocking token verification.",
          );
          expect(result.concepts).toHaveLength(1);
          expect(result.concepts[0].name).toBe("async/await");
          expect(result.concepts[0].explanation).toContain("async/await");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});