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
    it('decimals', function () {
                expect(quantityExponent(0.1)).toEqual(-1);
                expect(quantityExponent(0.001)).toEqual(-3);
                expect(quantityExponent(0.00123)).toEqual(-3);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});