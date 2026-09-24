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


describe('hasMissingLinks', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('returns true when a source skill is not linked in a target dir', () => {
      const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-tooling-missing-'));
      try {
        const sourceDir = path.join(repoRoot, SOURCE_PATH, 'foo');
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# foo');

        assert.equal(hasMissingLinks(repoRoot), true);
      } finally {
        fs.rmSync(repoRoot, { recursive: true, force: true });
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});