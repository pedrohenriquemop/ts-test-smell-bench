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
    it("applies CLI exclude patterns alongside defaults", () => {
          const filter = createIgnoreFilter(testDir, ["tests/", "e2e/"]);
          expect(filter.isIgnored("tests/foo.test.ts")).toBe(true);
          expect(filter.isIgnored("e2e/smoke.spec.ts")).toBe(true);
          // Defaults still apply
          expect(filter.isIgnored("node_modules/foo.js")).toBe(true);
          expect(filter.isIgnored("dist/bundle.js")).toBe(true);
          // Non-excluded source files pass through
          expect(filter.isIgnored("src/index.ts")).toBe(false);
          expect(filter.isIgnored("README.md")).toBe(false);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});