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

describe("LanguageConfigSchema (base, no refinement)", () => {
  const validConfig = {
      id: "testlang",
      displayName: "Test Language",
      extensions: [".test"],
      concepts: ["testing", "assertions"],
      filePatterns: {
        entryPoints: [],
        barrels: [],
        tests: ["*.test.ts"],
        config: [],
      },
    };

  // ── TARGET TEST ─────────────────────────────────
  it("rejects config with non-array concepts", () => {
      const result = LanguageConfigSchema.safeParse({
        ...validConfig,
        concepts: "not-an-array",
      });
      expect(result.success).toBe(false);
    })
  // ── END TARGET TEST ─────────────────────────────
});