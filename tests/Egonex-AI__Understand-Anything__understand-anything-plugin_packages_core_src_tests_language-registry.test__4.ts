import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("returns null for files without extensions and no filename match", () => {
      const registry = new LanguageRegistry();
      expect(registry.getForFile("SOMEFILE")).toBeNull();
    })
  // ── END TARGET TEST ─────────────────────────────
});