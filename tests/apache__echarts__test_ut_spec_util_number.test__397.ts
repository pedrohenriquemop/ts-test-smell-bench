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
    it('basic', function () {
                expect(quantityExponent(1)).toEqual(0);
                expect(quantityExponent(9)).toEqual(0);
                expect(quantityExponent(12)).toEqual(1);
                expect(quantityExponent(123)).toEqual(2);
                expect(quantityExponent(1234)).toEqual(3);
                expect(quantityExponent(1234.5678)).toEqual(3);
                expect(quantityExponent(10)).toEqual(1);
                expect(quantityExponent(1000)).toEqual(3);
                expect(quantityExponent(10000)).toEqual(4);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});