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
    it('zeroInterval', function () {

                doTest(true);
                doTest(false);

                function doTest(clamp: boolean) {
                    let range;
                    let result;

                    // zero domain interval
                    range = [444, 555];
                    result = linearMap(40, [1212222223.2323232, 1212222223.2323232], range, clamp);
                    expect(result).toEqual(499.5); // half of range.

                    // zero range interval
                    range = [1221212.1221372238, 1221212.1221372238];
                    result = linearMap(40, [0, 100], range, clamp);
                    expect(result).toEqual(1221212.1221372238);

                    // zero domain interval and range interval
                    range = [1221212.1221372238, 1221212.1221372238];
                    result = linearMap(40, [43.55454545, 43.55454545], range, clamp);
                    expect(result).toEqual(1221212.1221372238);
                }
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});