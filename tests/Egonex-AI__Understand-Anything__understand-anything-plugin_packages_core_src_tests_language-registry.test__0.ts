import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("registers and retrieves a language config by id", () => {
      const registry = new LanguageRegistry();
      registry.register(typescriptConfig);
      expect(registry.getById("typescript")).toEqual(typescriptConfig);
    })
  // ── END TARGET TEST ─────────────────────────────
});