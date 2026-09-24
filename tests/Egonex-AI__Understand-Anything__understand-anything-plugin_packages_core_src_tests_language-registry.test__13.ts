import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("Non-code language configs", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("detects filename-based configs for docker-compose", () => {
          const registry = LanguageRegistry.createDefault();
          expect(registry.getForFile("docker-compose.yml")?.id).toBe("docker-compose");
          expect(registry.getForFile("docker-compose.yaml")?.id).toBe("docker-compose");
          expect(registry.getForFile("compose.yml")?.id).toBe("docker-compose");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});