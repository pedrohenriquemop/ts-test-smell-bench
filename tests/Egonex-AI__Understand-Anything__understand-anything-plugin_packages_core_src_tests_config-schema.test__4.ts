import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, it, expect } from "vitest";
import {
  TreeSitterConfigSchema,
  FilePatternConfigSchema,
  LanguageConfigSchema,
  StrictLanguageConfigSchema,
  FrameworkConfigSchema,
} from "../languages/types.js";
import { builtinLanguageConfigs } from "../languages/configs/index.js";
import { builtinFrameworkConfigs } from "../languages/frameworks/index.js";

function countConfigModules(relativeDir: string): number {
  const dir = fileURLToPath(new URL(relativeDir, import.meta.url));
  return readdirSync(dir).filter(
    (file) => file.endsWith(".ts") && file !== "index.ts"
  ).length;
}

describe("FilePatternConfigSchema", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("accepts a valid file pattern config", () => {
      const result = FilePatternConfigSchema.safeParse({
        entryPoints: ["main.py", "app.py"],
        barrels: ["__init__.py"],
        tests: ["test_*.py"],
        config: ["pyproject.toml"],
      });
      expect(result.success).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
});