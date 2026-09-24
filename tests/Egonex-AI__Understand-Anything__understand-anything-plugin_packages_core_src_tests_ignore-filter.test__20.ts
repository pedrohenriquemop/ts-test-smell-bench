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
    it("CLI ! negation can re-include files excluded by defaults", () => {
          // CLI says to include dist/ even though defaults exclude it
          const filter = createIgnoreFilter(testDir, ["!dist/"]);
          expect(filter.isIgnored("dist/bundle.js")).toBe(false);
          // Other defaults still apply
          expect(filter.isIgnored("node_modules/foo.js")).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});