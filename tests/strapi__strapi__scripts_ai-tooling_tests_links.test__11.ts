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
  it('overwrites foreign symlinks and real dirs when force is true', () => {
      const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-tooling-sync-force-'));
      try {
        const sourceDir = path.join(repoRoot, SOURCE_PATH, 'foo');
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# foo');

        const brainDir = path.join(repoRoot, '.brain/skills/brain-skill');
        fs.mkdirSync(brainDir, { recursive: true });

        const cursorDir = path.join(repoRoot, '.cursor/skills');
        fs.mkdirSync(cursorDir, { recursive: true });

        const foreignPath = path.join(cursorDir, 'foo');
        fs.symlinkSync(path.relative(path.dirname(foreignPath), brainDir), foreignPath, 'dir');

        const realPath = path.join(repoRoot, '.claude/skills', 'foo');
        fs.mkdirSync(realPath, { recursive: true });
        fs.writeFileSync(path.join(realPath, 'SKILL.md'), '# stale copy');

        const log = makeLogger();
        assert.equal(sync(repoRoot, log, { force: true }), 0);

        for (const targetRel of TARGET_PATHS) {
          const linkedPath = path.join(repoRoot, targetRel, 'foo');
          assert.equal(fs.lstatSync(linkedPath).isSymbolicLink(), true);
          assert.deepEqual(classify(repoRoot, linkedPath, 'foo'), { kind: 'ours', correct: true });
        }
      } finally {
        fs.rmSync(repoRoot, { recursive: true, force: true });
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});