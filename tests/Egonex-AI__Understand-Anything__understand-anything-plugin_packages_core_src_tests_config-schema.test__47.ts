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
  it("every framework's languages array references known language ids", () => {
      const knownLanguageIds = new Set(builtinLanguageConfigs.map((c) => c.id));
      for (const fw of builtinFrameworkConfigs) {
        for (const langId of fw.languages) {
          expect(
            knownLanguageIds.has(langId),
            `"${fw.id}" references unknown language "${langId}"`
          ).toBe(true);
        }
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});