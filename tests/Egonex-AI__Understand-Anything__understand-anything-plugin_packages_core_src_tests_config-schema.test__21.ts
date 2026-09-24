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

describe("StrictLanguageConfigSchema", () => {
  const base = {
      id: "testlang",
      displayName: "Test",
      concepts: ["testing"],
      filePatterns: {
        entryPoints: [],
        barrels: [],
        tests: [],
        config: [],
      },
    };

  // ── TARGET TEST ─────────────────────────────────
  it("rejects config with empty extensions and empty filenames", () => {
      const result = StrictLanguageConfigSchema.safeParse({
        ...base,
        extensions: [],
        filenames: [],
      });
      expect(result.success).toBe(false);
    })
  // ── END TARGET TEST ─────────────────────────────
});