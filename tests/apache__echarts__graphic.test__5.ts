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
    it('intersect', function () {
                expect(lineLineIntersect(10, 20, 30, 40, 12, 20, 30, 40)).toEqual(true);
                expect(lineLineIntersect(10, 20, 30, 40, 12, 20, 20, 42)).toEqual(true);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});