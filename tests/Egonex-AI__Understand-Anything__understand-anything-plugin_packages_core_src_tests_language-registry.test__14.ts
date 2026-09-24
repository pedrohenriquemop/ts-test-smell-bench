import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("Non-code language configs", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("detects .env file variants", () => {
          const registry = LanguageRegistry.createDefault();
          expect(registry.getForFile(".env")?.id).toBe("env");
          expect(registry.getForFile(".env.local")?.id).toBe("env");
          expect(registry.getForFile(".env.production")?.id).toBe("env");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});