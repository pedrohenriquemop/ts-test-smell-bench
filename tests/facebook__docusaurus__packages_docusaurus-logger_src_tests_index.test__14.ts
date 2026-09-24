import {afterAll, beforeAll, describe, expect, it, vi} from 'vitest';
import logger from '../index';


describe('logger', () => {
  beforeAll(() => {
      vi.stubEnv('FORCE_COLOR', '3');
    });
  afterAll(() => {
      vi.unstubAllEnvs();
    });

  describe('report', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('works with all severities', () => {
          using log = vi.spyOn(console, 'info');
          using warn = vi.spyOn(console, 'warn');
          logger.report('ignore')('hey');
          logger.report('log')('hey');
          logger.report('warn')('hey');
          expect(() =>
            logger.report('throw')('hey'),
          ).toThrowErrorMatchingInlineSnapshot(`[Error: hey]`);
          expect(() =>
            // @ts-expect-error: for test
            logger.report('foo')('hey'),
          ).toThrowErrorMatchingInlineSnapshot(
            `[Error: Unexpected "reportingSeverity" value: foo.]`,
          );
          expect(log).toHaveBeenCalledTimes(1);
          expect(log).toHaveBeenCalledWith(
            expect.stringMatching(/.*\[INFO\].* hey/),
          );
          expect(warn).toHaveBeenCalledTimes(1);
          expect(warn).toHaveBeenCalledWith(
            expect.stringMatching(/.*\[WARNING\].* hey/),
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});