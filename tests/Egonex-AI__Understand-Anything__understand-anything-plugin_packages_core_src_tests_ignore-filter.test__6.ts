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
    it("ignores files matching default patterns", () => {
          const filter = createIgnoreFilter(testDir);
          expect(filter.isIgnored("node_modules/foo/bar.js")).toBe(true);
          expect(filter.isIgnored("dist/index.js")).toBe(true);
          expect(filter.isIgnored(".git/config")).toBe(true);
          expect(filter.isIgnored("obj/Release/net8.0/app.dll")).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});