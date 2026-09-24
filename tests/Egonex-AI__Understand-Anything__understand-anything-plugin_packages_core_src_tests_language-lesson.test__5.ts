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
    it("extracts JSON from code blocks", () => {
          const response = `Here is the analysis:
    \`\`\`json
    {
      "languageNotes": "TypeScript generics used here.",
      "concepts": [
        { "name": "generics", "explanation": "Type parameters enable reuse." }
      ]
    }
    \`\`\``;
          const result = parseLanguageLessonResponse(response);
          expect(result.languageNotes).toBe("TypeScript generics used here.");
          expect(result.concepts).toHaveLength(1);
          expect(result.concepts[0].name).toBe("generics");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});