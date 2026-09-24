import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('error', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('prints objects', () => {
          using error = vi.spyOn(console, 'error');
          logger.error({a: 1});
          logger.error(undefined);
          logger.error([1, 2, 3]);
          logger.error(new Date(2021, 10, 13));
          expect(error.mock.calls).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});