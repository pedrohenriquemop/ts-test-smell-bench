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
    it('basic', function () {
                expect(quantity(1)).toEqual(1);
                expect(quantity(9)).toEqual(1);
                expect(quantity(12)).toEqual(10);
                expect(quantity(123)).toEqual(100);
                expect(quantity(1234)).toEqual(1000);
                expect(quantity(1234.5678)).toEqual(1000);
                expect(quantity(10)).toEqual(10);
                expect(quantity(1000)).toEqual(1000);
                expect(quantity(10000)).toEqual(10000);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});