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
  it("all framework ids are unique", () => {
      const ids = builtinFrameworkConfigs.map((fw) => fw.id);
      const unique = new Set(ids);
      expect(unique.size).toBe(ids.length);
    })
  // ── END TARGET TEST ─────────────────────────────
});