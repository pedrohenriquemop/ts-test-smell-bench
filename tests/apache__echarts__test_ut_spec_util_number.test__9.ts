import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('getPrecision', () => {
    function basicCases(fn: (val: number) => number): void {
                expect(fn(10)).toEqual(0);
                expect(fn(1)).toEqual(0);
                expect(fn(0)).toEqual(0);
                expect(fn(100000000000000000000000000000)).toEqual(0);
                expect(fn(0.1)).toEqual(1);
                expect(fn(0.100)).toEqual(1);
                expect(fn(0.0032)).toEqual(4);
                expect(fn(0.0000000000034)).toEqual(13);
                expect(fn(1e+100)).toEqual(0);
                expect(fn(3.456E100)).toEqual(0);
                expect(fn(3.456E-100)).toEqual(103);
                expect(fn(3.4e-10)).toEqual(11);
                expect(fn(3.4e-0)).toEqual(1);
                expect(fn(3e-0)).toEqual(0);
                expect(fn(3e-1)).toEqual(1);
                expect(fn(3.4e0)).toEqual(1);
                expect(fn(3.45e1)).toEqual(1);
                expect(fn(3.45e-1)).toEqual(3);
                expect(fn(3.45e2)).toEqual(0);
                expect(fn(.456e2)).toEqual(1);
                expect(fn(.456e-2)).toEqual(5);
                expect(fn(.4e2)).toEqual(0);
                expect(fn(.4e-2)).toEqual(3);
            }

    // ── TARGET TEST ─────────────────────────────────
    it('getPrecision_equal_random', function () {
                function makeRandomNumber(): number {
                    const p1 = Math.round(Math.random() * 100) + '';
                    const p2 = Math.round(Math.random() * 10000) + '';
                    const p3 = (Math.round(Math.random() * 20) - 100) + '';

                    return +(p1 + '.' + p2 + 'e' + p3);
                }

                for (let i = 0; i < 500; i++) {
                    const num = makeRandomNumber();
                    const precision1 = getPrecision(num);
                    const precision2 = getPrecisionSafe(num);

                    expect(precision1).toEqual(precision2);
                }
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});