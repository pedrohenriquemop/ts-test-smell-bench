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


describe('classify', () => {
  const withFixture = (fn: (repoRoot: string) => void): void => {
      const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-tooling-'));
      try {
        fn(repoRoot);
      } finally {
        fs.rmSync(repoRoot, { recursive: true, force: true });
      }
    };

  // ── TARGET TEST ─────────────────────────────────
  it('recognises relative symlink into .ai/skills as ours + correct', () => {
      withFixture((repoRoot) => {
        const sourceDir = path.join(repoRoot, SOURCE_PATH, 'foo');
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# foo');

        const targetDir = path.join(repoRoot, '.cursor/skills');
        fs.mkdirSync(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, 'foo');
        fs.symlinkSync(linkTargetFor(repoRoot, targetPath, 'foo'), targetPath, 'dir');

        assert.deepEqual(classify(repoRoot, targetPath, 'foo'), {
          kind: 'ours',
          correct: true,
        });
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});