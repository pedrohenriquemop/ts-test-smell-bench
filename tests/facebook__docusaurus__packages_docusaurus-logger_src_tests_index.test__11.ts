import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('warn', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('prints objects', () => {
          using warn = vi.spyOn(console, 'warn');
          logger.warn({a: 1});
          logger.warn(undefined);
          logger.warn([1, 2, 3]);
          logger.warn(new Date(2021, 10, 13));
          expect(warn.mock.calls).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});