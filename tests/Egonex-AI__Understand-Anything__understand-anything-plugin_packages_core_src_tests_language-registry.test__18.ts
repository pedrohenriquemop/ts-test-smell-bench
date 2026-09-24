import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("StrictLanguageConfigSchema refinement", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("accepts configs with filenames but empty extensions", () => {
          const result = StrictLanguageConfigSchema.safeParse({
            id: "filename-lang",
            displayName: "FilenameLang",
            extensions: [],
            filenames: ["Specialfile"],
            concepts: ["something"],
            filePatterns: { entryPoints: [], barrels: [], tests: [], config: [] },
          });
          expect(result.success).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});