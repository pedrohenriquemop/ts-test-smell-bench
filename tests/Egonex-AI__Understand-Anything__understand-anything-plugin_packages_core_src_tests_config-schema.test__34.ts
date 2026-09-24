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

describe("Built-in Language Configs", () => {
  const CONTENT_DETECTED_IDS = new Set([
      "kubernetes",
      "github-actions",
      "json-schema",
    ]);

  // ── TARGET TEST ─────────────────────────────────
  it("all non-content-detected configs pass StrictLanguageConfigSchema", () => {
      for (const config of builtinLanguageConfigs) {
        if (CONTENT_DETECTED_IDS.has(config.id)) continue;
        const result = StrictLanguageConfigSchema.safeParse(config);
        expect(
          result.success,
          `"${config.id}" should pass StrictLanguageConfigSchema: ${result.success ? "" : JSON.stringify(result.error.issues)}`
        ).toBe(true);
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});