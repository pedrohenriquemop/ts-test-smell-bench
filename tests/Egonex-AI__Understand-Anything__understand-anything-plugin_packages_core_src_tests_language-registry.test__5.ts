import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("lists all registered languages", () => {
      const registry = new LanguageRegistry();
      registry.register(typescriptConfig);
      registry.register(pythonConfig);
      const all = registry.getAllLanguages();
      expect(all).toHaveLength(2);
      expect(all.map(c => c.id)).toContain("typescript");
      expect(all.map(c => c.id)).toContain("python");
    })
  // ── END TARGET TEST ─────────────────────────────
});