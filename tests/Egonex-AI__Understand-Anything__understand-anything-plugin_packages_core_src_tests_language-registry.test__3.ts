import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns null for unknown extensions", () => {
      const registry = new LanguageRegistry();
      registry.register(typescriptConfig);
      expect(registry.getByExtension(".xyz")).toBeNull();
      expect(registry.getForFile("file.unknown")).toBeNull();
    })
  // ── END TARGET TEST ─────────────────────────────
});