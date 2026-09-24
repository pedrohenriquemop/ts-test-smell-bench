import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('quantity', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('decimals', function () {
                expect(quantity(0.2)).toEqual(0.1);
                expect(quantity(0.002)).toEqual(0.001);
                expect(quantity(0.00123)).toEqual(0.001);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});