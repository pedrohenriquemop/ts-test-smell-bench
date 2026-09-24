import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SOURCE_PATH,
  TARGET_PATHS,
  classify,
  createSkillLink,
  isUnderSkillsRoot,
  linkTargetFor,
  listSourceSkills,
  hasMissingLinks,
  makeLogger,
  pathsEqual,
  sync,
  unlink,
} from '../links.ts';


describe('sync round-trip', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('returns warning exit code on collisions without force', () => {
      const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-tooling-sync-warn-'));
      try {
        const sourceDir = path.join(repoRoot, SOURCE_PATH, 'foo');
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# foo');

        const realPath = path.join(repoRoot, '.cursor/skills', 'foo');
        fs.mkdirSync(realPath, { recursive: true });

        const log = makeLogger();
        assert.equal(sync(repoRoot, log), 1);
        assert.equal(fs.lstatSync(realPath).isDirectory(), true);
      } finally {
        fs.rmSync(repoRoot, { recursive: true, force: true });
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});