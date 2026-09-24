import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createIgnoreFilter, DEFAULT_IGNORE_PATTERNS } from "../ignore-filter";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";


describe("IgnoreFilter", () => {
  let testDir: string;
  beforeEach(() => {
      testDir = join(tmpdir(), `ignore-filter-test-${Date.now()}`);
      mkdirSync(testDir, { recursive: true });
      mkdirSync(join(testDir, ".understand-anything"), { recursive: true });
    });
  afterEach(() => {
      rmSync(testDir, { recursive: true, force: true });
    });

  describe("createIgnoreFilter with user .understandignore", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("reads patterns from .understand-anything/.understandignore", () => {
          writeFileSync(
            join(testDir, ".understand-anything", ".understandignore"),
            "# Exclude tests\n__tests__/\n*.test.ts\n"
          );
          const filter = createIgnoreFilter(testDir);
          expect(filter.isIgnored("__tests__/foo.test.ts")).toBe(true);
          expect(filter.isIgnored("src/utils.test.ts")).toBe(true);
          expect(filter.isIgnored("src/utils.ts")).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});