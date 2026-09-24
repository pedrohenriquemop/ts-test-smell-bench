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

describe("Built-in Framework Configs", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("every framework has at least one detectionKeyword and manifestFile", () => {
      for (const fw of builtinFrameworkConfigs) {
        expect(
          fw.detectionKeywords.length,
          `"${fw.id}" should have at least one detection keyword`
        ).toBeGreaterThan(0);
        expect(
          fw.manifestFiles.length,
          `"${fw.id}" should have at least one manifest file`
        ).toBeGreaterThan(0);
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});