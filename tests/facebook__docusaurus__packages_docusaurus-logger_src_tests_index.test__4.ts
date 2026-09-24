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
    it('subdue', () => {
          expect(logger.subdue('keepAnsi')).toMatchInlineSnapshot(
            `"<gray>keepAnsi</color>"`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});