import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("createDefault", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("has no duplicate extension mappings across configs", () => {
          const registry = LanguageRegistry.createDefault();
          const all = registry.getAllLanguages();
          const allExtensions: string[] = [];
          for (const config of all) {
            allExtensions.push(...config.extensions);
          }
          const unique = new Set(allExtensions);
          expect(unique.size).toBe(allExtensions.length);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});