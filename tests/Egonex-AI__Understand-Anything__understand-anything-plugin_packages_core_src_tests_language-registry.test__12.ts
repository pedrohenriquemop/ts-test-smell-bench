import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("Non-code language configs", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("detects filename-based configs (Dockerfile, Makefile, Jenkinsfile)", () => {
          const registry = LanguageRegistry.createDefault();
          expect(registry.getForFile("Dockerfile")?.id).toBe("dockerfile");
          expect(registry.getForFile("Makefile")?.id).toBe("makefile");
          expect(registry.getForFile("Jenkinsfile")?.id).toBe("jenkinsfile");
          expect(registry.getForFile("src/Dockerfile")?.id).toBe("dockerfile");
          expect(registry.getForFile("build/Makefile")?.id).toBe("makefile");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});