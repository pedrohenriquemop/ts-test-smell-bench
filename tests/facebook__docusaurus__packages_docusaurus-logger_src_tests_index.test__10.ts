import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('info', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('prints objects', () => {
          using info = vi.spyOn(console, 'info');
          logger.info({a: 1});
          logger.info(undefined);
          logger.info([1, 2, 3]);
          logger.info(new Date(2021, 10, 13));
          expect(info.mock.calls).toMatchSnapshot();
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});