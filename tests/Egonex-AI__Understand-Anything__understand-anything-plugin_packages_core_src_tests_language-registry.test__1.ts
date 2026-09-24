import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("retrieves config by file extension", () => {
      const registry = new LanguageRegistry();
      registry.register(typescriptConfig);
      expect(registry.getByExtension(".ts")?.id).toBe("typescript");
      expect(registry.getByExtension(".tsx")?.id).toBe("typescript");
    })
  // ── END TARGET TEST ─────────────────────────────
});