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

  describe("DEFAULT_IGNORE_PATTERNS", () => {

    // ── TARGET TEST ─────────────────────────────────
    it("does not contain bin (used by Node/Ruby CLI launchers)", () => {
          expect(DEFAULT_IGNORE_PATTERNS).not.toContain("bin/");
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});