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
    it('clamp', function () {
                let range;
                let result;

                // (1) normal order.
                range = [-15918.3, 17724.9];
                // bigger than max
                result = linearMap(100.1, [0, 100], range, true);
                expect(result).toEqual(range[1]);
                // smaller than min
                result = linearMap(-2, [0, 100], range, true);
                expect(result).toEqual(range[0]);
                // equals to max
                result = linearMap(100, [0, 100], range, true);
                expect(result).toEqual(range[1]);
                // equals to min
                result = linearMap(0, [0, 100], range, true);
                expect(result).toEqual(range[0]);

                // (2) inverse range
                range = [17724.9, -15918.3];
                // bigger than max
                result = linearMap(102, [0, 100], range, true);
                expect(result).toEqual(range[1]);
                // smaller than min
                result = linearMap(-0.001, [0, 100], range, true);
                expect(result).toEqual(range[0]);
                // equals to max
                result = linearMap(100, [0, 100], range, true);
                expect(result).toEqual(range[1]);
                // equals to min
                result = linearMap(0, [0, 100], range, true);
                expect(result).toEqual(range[0]);

                // (2) inverse domain
                // bigger than max, inverse domain
                range = [-15918.3, 17724.9];
                // bigger than max
                result = linearMap(102, [100, 0], range, true);
                expect(result).toEqual(range[0]);
                // smaller than min
                result = linearMap(-0.001, [100, 0], range, true);
                expect(result).toEqual(range[1]);
                // equals to max
                result = linearMap(100, [100, 0], range, true);
                expect(result).toEqual(range[0]);
                // equals to min
                result = linearMap(0, [100, 0], range, true);
                expect(result).toEqual(range[1]);

                // (3) inverse domain, inverse range
                range = [17724.9, -15918.3];
                // bigger than max
                result = linearMap(100.1, [100, 0], range, true);
                expect(result).toEqual(range[0]);
                // smaller than min
                result = linearMap(-2, [100, 0], range, true);
                expect(result).toEqual(range[1]);
                // equals to max
                result = linearMap(100, [100, 0], range, true);
                expect(result).toEqual(range[0]);
                // equals to min
                result = linearMap(0, [100, 0], range, true);
                expect(result).toEqual(range[1]);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});