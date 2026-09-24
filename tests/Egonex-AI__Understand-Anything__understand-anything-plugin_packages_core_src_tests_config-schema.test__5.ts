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
  it("accepts empty arrays (no file patterns needed)", () => {
      const result = FilePatternConfigSchema.safeParse({
        entryPoints: [],
        barrels: [],
        tests: [],
        config: [],
      });
      expect(result.success).toBe(true);
    })
  // ── END TARGET TEST ─────────────────────────────
});