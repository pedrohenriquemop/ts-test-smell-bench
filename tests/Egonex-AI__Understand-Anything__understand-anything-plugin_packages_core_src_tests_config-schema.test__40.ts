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
  it("configs with treeSitter have valid wasmPackage and wasmFile", () => {
      for (const config of builtinLanguageConfigs) {
        if (!config.treeSitter) continue;
        const tsResult = TreeSitterConfigSchema.safeParse(config.treeSitter);
        expect(
          tsResult.success,
          `"${config.id}" treeSitter should be valid: ${tsResult.success ? "" : JSON.stringify(tsResult.error.issues)}`
        ).toBe(true);
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});