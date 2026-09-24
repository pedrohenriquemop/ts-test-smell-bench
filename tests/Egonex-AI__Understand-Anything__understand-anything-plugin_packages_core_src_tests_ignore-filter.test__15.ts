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
    it("supports ! negation to override defaults", () => {
          writeFileSync(
            join(testDir, ".understand-anything", ".understandignore"),
            "!dist/\n"
          );
          const filter = createIgnoreFilter(testDir);
          expect(filter.isIgnored("dist/index.js")).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});