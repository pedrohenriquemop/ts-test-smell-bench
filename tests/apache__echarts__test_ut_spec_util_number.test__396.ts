import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('getPercentWithPrecision', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('NaN data', function () {
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875, '-' as any], 0, 0)).toEqual(17);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875, '-' as any], 1, 0)).toEqual(48);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875, '-' as any], 2, 0)).toEqual(26);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875, '-' as any], 3, 0)).toEqual(9);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875, '-' as any], 4, 0)).toEqual(0);

                expect(getPercentWithPrecision([0, undefined, '-' as any, null, NaN], 0, 0)).toEqual(0);
                expect(getPercentWithPrecision([0, undefined, '-' as any, null, NaN], 1, 0)).toEqual(0);
                expect(getPercentWithPrecision([0, undefined, '-' as any, null, NaN], 2, 0)).toEqual(0);
                expect(getPercentWithPrecision([0, undefined, '-' as any, null, NaN], 3, 0)).toEqual(0);
                expect(getPercentWithPrecision([0, undefined, '-' as any, null, NaN], 4, 0)).toEqual(0);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});