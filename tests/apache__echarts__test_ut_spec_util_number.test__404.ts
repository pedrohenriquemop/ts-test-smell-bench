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
    it('zero', function () {
                expect(quantity(0)).toEqual(1);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});