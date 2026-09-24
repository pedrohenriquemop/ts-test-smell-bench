import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('success', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('prints objects', () => {
          using log = vi.spyOn(console, 'log');
          logger.success({a: 1});
          logger.success(undefined);
          logger.success([1, 2, 3]);
          logger.success(new Date(2021, 10, 13));
          expect(log.mock.calls).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});