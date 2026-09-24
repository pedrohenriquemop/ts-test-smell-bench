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
  it("frameworks with layerHints have valid string key-value pairs", () => {
      for (const fw of builtinFrameworkConfigs) {
        if (!fw.layerHints) continue;
        const entries = Object.entries(fw.layerHints);
        expect(
          entries.length,
          `"${fw.id}" layerHints should have at least one entry`
        ).toBeGreaterThan(0);
        for (const [dir, layer] of entries) {
          expect(dir.length).toBeGreaterThan(0);
          expect(layer.length).toBeGreaterThan(0);
        }
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});