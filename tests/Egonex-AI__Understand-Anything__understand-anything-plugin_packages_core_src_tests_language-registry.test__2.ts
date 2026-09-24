import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("retrieves config for a file path", () => {
      const registry = new LanguageRegistry();
      registry.register(typescriptConfig);
      registry.register(pythonConfig);
      expect(registry.getForFile("src/index.ts")?.id).toBe("typescript");
      expect(registry.getForFile("app/models.py")?.id).toBe("python");
    })
  // ── END TARGET TEST ─────────────────────────────
});