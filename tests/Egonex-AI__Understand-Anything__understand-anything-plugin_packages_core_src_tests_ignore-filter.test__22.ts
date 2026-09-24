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

  describe("createIgnoreFilter with CLI --exclude patterns", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("empty CLI patterns array has no effect", () => {
          const filter = createIgnoreFilter(testDir, []);
          expect(filter.isIgnored("node_modules/foo.js")).toBe(true);
          expect(filter.isIgnored("src/index.ts")).toBe(false);
          expect(filter.isIgnored("docs/README.md")).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});