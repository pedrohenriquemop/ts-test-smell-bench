import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('getPercentWithPrecision', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('basic', function () {

                // console.log(numberUtil.getPercentWithPrecision([-1.678, -4.783, -2.664, -0.875], 0, 2));

                // const arr = [49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5, 49.5];
                const arr = [49.5, NaN];
                const result = [];
                for (let i = 0; i < arr.length; i++) {
                    result.push(
                        getPercentWithPrecision(arr, i, 0)
                    );
                }
                // let sum = 0;
                // for (let i = 0; i < result.length; i++) {
                //     sum += result[i];
                // }

                expect(getPercentWithPrecision([50.5, 49.5], 0, 0)).toEqual(51);
                expect(getPercentWithPrecision([50.5, 49.5], 1, 0)).toEqual(49);

                expect(getPercentWithPrecision([12.34, 34.56, 53.1], 0, 1)).toEqual(12.3);
                expect(getPercentWithPrecision([12.34, 34.56, 53.1], 1, 1)).toEqual(34.6);
                expect(getPercentWithPrecision([12.34, 34.56, 53.1], 2, 1)).toEqual(53.1);

                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875], 0, 0)).toEqual(17);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875], 1, 0)).toEqual(48);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875], 2, 0)).toEqual(26);
                expect(getPercentWithPrecision([1.678, 4.783, 2.664, 0.875], 3, 0)).toEqual(9);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});