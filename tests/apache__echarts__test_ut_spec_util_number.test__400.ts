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
    it('zero', function () {
                expect(quantityExponent(0)).toEqual(0);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});