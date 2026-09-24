import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('nice', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('extreme', function () {
                // Should not be 0.30000000000000004
                expect(nice(0.3869394696651766, true)).toEqual(0.3);
                expect(nice(0.3869394696651766)).toEqual(0.5);
                expect(nice(0.00003869394696651766, true)).toEqual(0.00003);
                expect(nice(0.00003869394696651766, false)).toEqual(0.00005);
                // expect(nice(0, true)).toEqual(0);
                // expect(nice(0)).toEqual(0);
                expect(nice(13, true)).toEqual(10);
                expect(nice(13)).toEqual(20);
                expect(nice(3900000000000000000021, true)).toEqual(3000000000000000000000);
                expect(nice(3900000000000000000021)).toEqual(5000000000000000000000);
                expect(nice(0.00000000000000000656939, true)).toEqual(0.000000000000000005);
                expect(nice(0.00000000000000000656939)).toEqual(0.00000000000000001);
                expect(nice(0.10000000000000000656939, true)).toEqual(0.1);
                expect(nice(0.10000000000000000656939)).toEqual(0.2);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});