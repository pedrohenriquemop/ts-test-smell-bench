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


describe('createSkillLink', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('creates a directory symlink on POSIX', () => {
      if (process.platform === 'win32') return;

      const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-tooling-link-'));
      try {
        const sourceDir = path.join(repoRoot, SOURCE_PATH, 'bar');
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# bar');

        const targetDir = path.join(repoRoot, TARGET_PATHS[0]);
        fs.mkdirSync(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, 'bar');

        createSkillLink(repoRoot, targetPath, 'bar');

        assert.equal(fs.lstatSync(targetPath).isSymbolicLink(), true);
        assert.deepEqual(classify(repoRoot, targetPath, 'bar'), { kind: 'ours', correct: true });
      } finally {
        fs.rmSync(repoRoot, { recursive: true, force: true });
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});