import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('getPrecisionSafe', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('basic', function () {
                expect(getPrecisionSafe(10)).toEqual(0);
                expect(getPrecisionSafe(1)).toEqual(0);
                expect(getPrecisionSafe(0)).toEqual(0);
                expect(getPrecisionSafe(100000000000000000000000000000)).toEqual(0);
                expect(getPrecisionSafe(0.1)).toEqual(1);
                expect(getPrecisionSafe(0.100)).toEqual(1);
                expect(getPrecisionSafe(0.0032)).toEqual(4);
                expect(getPrecisionSafe(0.0000000000034)).toEqual(13);
                expect(getPrecisionSafe(1e+100)).toEqual(0);
                expect(getPrecisionSafe(3.456E100)).toEqual(0);
                expect(getPrecisionSafe(3.456E-100)).toEqual(103);
                expect(getPrecisionSafe(3.4e-10)).toEqual(11);
                expect(getPrecisionSafe(3.456e-100)).toEqual(103);
                expect(getPrecisionSafe(3.4e-0)).toEqual(1);
                expect(getPrecisionSafe(3e-0)).toEqual(0);
                expect(getPrecisionSafe(3e-1)).toEqual(1);
                expect(getPrecisionSafe(3.4e0)).toEqual(1);
                expect(getPrecisionSafe(3.45e1)).toEqual(1);
                expect(getPrecisionSafe(3.45e-1)).toEqual(3);
                expect(getPrecisionSafe(3.45e2)).toEqual(0);
                expect(getPrecisionSafe(.456e2)).toEqual(1);
                expect(getPrecisionSafe(.456e-2)).toEqual(5);
                expect(getPrecisionSafe(.4e2)).toEqual(0);
                expect(getPrecisionSafe(.4e-2)).toEqual(3);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});