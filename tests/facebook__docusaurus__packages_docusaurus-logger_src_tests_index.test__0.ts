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
    it('path', () => {
          expect(logger.path('keepAnsi')).toMatchInlineSnapshot(
            `"<cyan><underline>"keepAnsi"</underline></color>"`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});