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
    it("ignores IDE directories", () => {
          const filter = createIgnoreFilter(testDir);
          expect(filter.isIgnored(".idea/workspace.xml")).toBe(true);
          expect(filter.isIgnored(".vscode/settings.json")).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});