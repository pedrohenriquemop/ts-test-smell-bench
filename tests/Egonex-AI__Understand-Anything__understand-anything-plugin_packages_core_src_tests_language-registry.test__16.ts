import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("StrictLanguageConfigSchema refinement", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("rejects configs with empty extensions AND empty filenames", () => {
          const result = StrictLanguageConfigSchema.safeParse({
            id: "empty-lang",
            displayName: "Empty",
            extensions: [],
            filenames: [],
            concepts: ["nothing"],
            filePatterns: { entryPoints: [], barrels: [], tests: [], config: [] },
          });
          expect(result.success).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});