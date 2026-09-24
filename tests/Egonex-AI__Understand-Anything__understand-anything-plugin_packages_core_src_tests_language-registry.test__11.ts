import { describe, it, expect } from "vitest";
import { LanguageRegistry } from "../languages/language-registry.js";
import { StrictLanguageConfigSchema } from "../languages/types.js";
import { typescriptConfig } from "../languages/configs/typescript.js";
import { pythonConfig } from "../languages/configs/python.js";


describe("LanguageRegistry", () => {

  describe("Non-code language configs", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("detects all non-code file types via extension", () => {
          const registry = LanguageRegistry.createDefault();
          const expectations: [string, string][] = [
            ["README.md", "markdown"],
            ["config.yaml", "yaml"],
            ["package.json", "json"],
            ["config.toml", "toml"],
            [".env", "env"],
            ["pom.xml", "xml"],
            ["Dockerfile", "dockerfile"],
            ["schema.sql", "sql"],
            ["schema.graphql", "graphql"],
            ["types.proto", "protobuf"],
            ["main.tf", "terraform"],
            ["Makefile", "makefile"],
            ["deploy.sh", "shell"],
            ["index.html", "html"],
            ["styles.css", "css"],
            ["data.csv", "csv"],
            ["deploy.ps1", "powershell"],
          ];
          for (const [file, expectedId] of expectations) {
            const config = registry.getForFile(file);
            expect(config?.id, `${file} should be detected as ${expectedId}`).toBe(expectedId);
          }
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});