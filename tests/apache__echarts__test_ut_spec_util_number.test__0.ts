import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('linearMap', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('accuracyError', function () {
                let range;
                let result;

                range = [-15918.3, 17724.9];
                result = linearMap(100, [0, 100], range, true);
                // Should not be 17724.899999999998.
                expect(result).toEqual(range[1]);

                range = [-62.83, 83.56];
                result = linearMap(100, [0, 100], range, true);
                // Should not be 83.55999999999999.
                expect(result).toEqual(range[1]);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});