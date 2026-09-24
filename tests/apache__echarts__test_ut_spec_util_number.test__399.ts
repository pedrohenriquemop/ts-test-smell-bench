import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('quantityExponent', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('large number', function () {
                expect(quantityExponent(3.14e100)).toEqual(100);
                expect(quantityExponent(3.14e-100)).toEqual(-100);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});