import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('interpolate', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('prints detached flags as-is', () => {
          expect(
            logger.interpolate`(keepAnsi) You can use placeholders like code= ${'and it will'} be replaced with the succeeding arguments`,
          ).toMatchInlineSnapshot(
            `"(keepAnsi) You can use placeholders like code= and it will be replaced with the succeeding arguments"`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});