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
    it('formats text with variables & arrays', () => {
          const name = 'Josh';
          const items = [1, 'hi', 'Hmmm'];
          expect(
            logger.interpolate`(keepAnsi) Hello ${name}! Here are your goodies:${items}`,
          ).toMatchInlineSnapshot(`
          "(keepAnsi) Hello Josh! Here are your goodies:
          - 1
          - hi
          - Hmmm"
        `);
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});