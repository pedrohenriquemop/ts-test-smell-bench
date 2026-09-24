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

describe("TreeSitterConfigSchema", () => {

  // ── TARGET TEST ─────────────────────────────────
  it("rejects non-string values", () => {
      const result = TreeSitterConfigSchema.safeParse({
        wasmPackage: 123,
        wasmFile: true,
      });
      expect(result.success).toBe(false);
    })
  // ── END TARGET TEST ─────────────────────────────
});