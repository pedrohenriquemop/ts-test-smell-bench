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
    it('throws with bad flags', () => {
          expect(
            () =>
              logger.interpolate`(keepAnsi) I mistyped this: cde=${'this code'} and I will be damned`,
          ).toThrowErrorMatchingInlineSnapshot(
            `[Error: Bad Docusaurus logging message. This is likely an internal bug, please report it.]`,
          );
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});