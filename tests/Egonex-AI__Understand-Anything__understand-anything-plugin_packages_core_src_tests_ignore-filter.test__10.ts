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

  describe("createIgnoreFilter with no user file", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("ignores generated files", () => {
          const filter = createIgnoreFilter(testDir);
          expect(filter.isIgnored("bundle.min.js")).toBe(true);
          expect(filter.isIgnored("style.min.css")).toBe(true);
          expect(filter.isIgnored("source.map")).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});