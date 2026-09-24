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
    it('normal', function () {

                doTest(true);
                doTest(false);

                function doTest(clamp: boolean) {
                    let range;
                    let result;

                    // normal
                    range = [444, 555];
                    result = linearMap(40, [0, 100], range, clamp);
                    expect(result).toEqual(488.4);

                    // inverse range
                    range = [555, 444];
                    result = linearMap(40, [0, 100], range, clamp);
                    expect(result).toEqual(510.6);

                    // inverse domain and range
                    range = [555, 444];
                    result = linearMap(40, [100, 0], range, clamp);
                    expect(result).toEqual(488.4);

                    // inverse domain
                    range = [444, 555];
                    result = linearMap(40, [100, 0], range, clamp);
                    expect(result).toEqual(510.6);
                }
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});