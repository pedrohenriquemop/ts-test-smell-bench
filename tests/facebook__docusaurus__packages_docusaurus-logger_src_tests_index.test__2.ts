import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('formatters', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('id', () => {
          expect(logger.name('keepAnsi')).toMatchInlineSnapshot(
            `"<blue><bold>keepAnsi</intensity></color>"`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});