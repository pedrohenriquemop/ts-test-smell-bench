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
    it('noClamp', function () {
                let range;
                let result;

                // (1) normal order.
                range = [-15918.3, 17724.9];
                // bigger than max
                result = linearMap(100.1, [0, 100], range, false);
                expect(result).toEqual(17758.543199999996);
                // smaller than min
                result = linearMap(-2, [0, 100], range, false);
                expect(result).toEqual(-16591.164);
                // equals to max
                result = linearMap(100, [0, 100], range, false);
                expect(result).toEqual(17724.9);
                // equals to min
                result = linearMap(0, [0, 100], range, false);
                expect(result).toEqual(-15918.3);

                // (2) inverse range
                range = [17724.9, -15918.3];
                // bigger than max
                result = linearMap(102, [0, 100], range, false);
                expect(result).toEqual(-16591.163999999997);
                // smaller than min
                result = linearMap(-0.001, [0, 100], range, false);
                expect(result).toEqual(17725.236432);
                // equals to max
                result = linearMap(100, [0, 100], range, false);
                expect(result).toEqual(-15918.3);
                // equals to min
                result = linearMap(0, [0, 100], range, false);
                expect(result).toEqual(17724.9);

                // (2) inverse domain
                // bigger than max, inverse domain
                range = [-15918.3, 17724.9];
                // bigger than max
                result = linearMap(102, [100, 0], range, false);
                expect(result).toEqual(-16591.164);
                // smaller than min
                result = linearMap(-0.001, [100, 0], range, false);
                expect(result).toEqual(17725.236432);
                // equals to max
                result = linearMap(100, [100, 0], range, false);
                expect(result).toEqual(-15918.3);
                // equals to min
                result = linearMap(0, [100, 0], range, false);
                expect(result).toEqual(17724.9);

                // (3) inverse domain, inverse range
                range = [17724.9, -15918.3];
                // bigger than max
                result = linearMap(100.1, [100, 0], range, false);
                expect(result).toEqual(17758.5432);
                // smaller than min
                result = linearMap(-2, [100, 0], range, false);
                expect(result).toEqual(-16591.163999999997);
                // equals to max
                result = linearMap(100, [100, 0], range, false);
                expect(result).toEqual(17724.9);
                // equals to min
                result = linearMap(0, [100, 0], range, false);
                expect(result).toEqual(-15918.3);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});