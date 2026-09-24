import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("createDefault", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("registers all 42 built-in language configs", () => {
          const registry = LanguageRegistry.createDefault();
          const all = registry.getAllLanguages();
          expect(all.length).toBe(42);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});