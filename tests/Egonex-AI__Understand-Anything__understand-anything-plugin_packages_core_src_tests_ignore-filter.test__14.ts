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
    it("handles # comments and blank lines", () => {
          writeFileSync(
            join(testDir, ".understand-anything", ".understandignore"),
            "# This is a comment\n\n\nfixtures/\n\n# Another comment\n"
          );
          const filter = createIgnoreFilter(testDir);
          expect(filter.isIgnored("fixtures/data.json")).toBe(true);
          expect(filter.isIgnored("src/index.ts")).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});