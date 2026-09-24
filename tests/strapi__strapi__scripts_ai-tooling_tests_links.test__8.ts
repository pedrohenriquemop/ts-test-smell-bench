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
  it('treats symlink outside .ai/skills as foreign-link', () => {
      withFixture((repoRoot) => {
        const brainDir = path.join(repoRoot, '.brain/skills/brain-skill');
        fs.mkdirSync(brainDir, { recursive: true });

        const targetDir = path.join(repoRoot, '.cursor/skills');
        fs.mkdirSync(targetDir, { recursive: true });
        const targetPath = path.join(targetDir, 'brain-skill');
        fs.symlinkSync(path.relative(path.dirname(targetPath), brainDir), targetPath, 'dir');

        assert.deepEqual(classify(repoRoot, targetPath, 'brain-skill'), { kind: 'foreign-link' });
      });
    })
  // ── END TARGET TEST ─────────────────────────────
});