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
  it('links, unlinks, and preserves foreign symlinks', () => {
      const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-tooling-sync-'));
      try {
        const sourceDir = path.join(repoRoot, SOURCE_PATH, 'foo');
        fs.mkdirSync(sourceDir, { recursive: true });
        fs.writeFileSync(path.join(sourceDir, 'SKILL.md'), '# foo');

        const brainDir = path.join(repoRoot, '.brain/skills/brain-skill');
        fs.mkdirSync(brainDir, { recursive: true });
        const cursorDir = path.join(repoRoot, '.cursor/skills');
        fs.mkdirSync(cursorDir, { recursive: true });
        const foreignPath = path.join(cursorDir, 'brain-skill');
        fs.symlinkSync(path.relative(path.dirname(foreignPath), brainDir), foreignPath, 'dir');

        const log = makeLogger();
        assert.equal(sync(repoRoot, log), 0);

        const linkedPath = path.join(cursorDir, 'foo');
        assert.equal(fs.lstatSync(linkedPath).isSymbolicLink(), true);
        assert.deepEqual(classify(repoRoot, linkedPath, 'foo'), { kind: 'ours', correct: true });
        assert.equal(fs.lstatSync(foreignPath).isSymbolicLink(), true);
        assert.deepEqual(classify(repoRoot, foreignPath, 'brain-skill'), { kind: 'foreign-link' });

        assert.deepEqual(listSourceSkills(repoRoot), ['foo']);

        const unlinkLog = makeLogger();
        assert.equal(unlink(repoRoot, unlinkLog), 0);

        assert.equal(fs.existsSync(linkedPath), false);
        assert.equal(fs.lstatSync(foreignPath).isSymbolicLink(), true);
      } finally {
        fs.rmSync(repoRoot, { recursive: true, force: true });
      }
    })
  // ── END TARGET TEST ─────────────────────────────
});