import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("createDefault", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("every config has at least one concept", () => {
          const registry = LanguageRegistry.createDefault();
          for (const config of registry.getAllLanguages()) {
            expect(config.concepts.length).toBeGreaterThan(0);
          }
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});