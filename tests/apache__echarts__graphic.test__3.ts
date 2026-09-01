import {
    subPixelOptimize, subPixelOptimizeLine, subPixelOptimizeRect
} from 'zrender/src/graphic/helper/subPixelOptimize';
import {
    lineLineIntersect,
    expandOrShrinkRect
} from '@/src/util/graphic';


describe('util/graphic', () => {

  describe('lineLineIntersect', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('extreme', function () {
                expect(lineLineIntersect(10, 10, 30, 30, 10, 10, 10, 10)).toEqual(false);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});