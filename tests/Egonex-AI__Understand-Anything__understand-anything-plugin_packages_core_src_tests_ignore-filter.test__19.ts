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
    it("CLI patterns have highest priority over .understandignore files", () => {
          // .understandignore says to include docs/
          writeFileSync(
            join(testDir, ".understand-anything", ".understandignore"),
            "!docs/\n"
          );
          // CLI --exclude says to exclude docs/
          const filter = createIgnoreFilter(testDir, ["docs/"]);
          // CLI patterns are added last, so they override the ! negation from .understandignore
          expect(filter.isIgnored("docs/README.md")).toBe(true);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});