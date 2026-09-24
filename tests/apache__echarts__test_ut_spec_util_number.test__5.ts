import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('parseDate', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('parseDate', function () {

                // Invalid Date
                expect('' + parseDate(null)).toEqual('Invalid Date');
                expect('' + parseDate(void 0)).toEqual('Invalid Date');
                expect('' + parseDate('asdf')).toEqual('Invalid Date');
                expect('' + parseDate(NaN)).toEqual('Invalid Date');
                expect('' + parseDate('-')).toEqual('Invalid Date');
                expect('' + parseDate('20120304')).toEqual('Invalid Date');

                // Input instance of Date or timestamp
                expect(+parseDate(new Date('2012-03-04'))).toEqual(1330819200000);
                expect(+parseDate(1330819200000)).toEqual(1330819200000);
                expect(+parseDate(1330819199999.99)).toEqual(1330819200000);
                expect(+parseDate(1330819200000.01)).toEqual(1330819200000);

                // ISO string
                expect(+parseDate('2012-03')).toEqual(+new Date('2012-03-01T00:00:00'));
                expect(+parseDate('2012-03-04')).toEqual(+new Date('2012-03-04T00:00:00'));
                expect(+parseDate('2012-03-04 05')).toEqual(+new Date('2012-03-04T05:00:00'));
                expect(+parseDate('2012-03-04T05')).toEqual(+new Date('2012-03-04T05:00:00'));
                expect(+parseDate('2012-03-04 05:06')).toEqual(+new Date('2012-03-04T05:06:00'));
                expect(+parseDate('2012-03-04T05:06')).toEqual(+new Date('2012-03-04T05:06:00'));
                expect(+parseDate('2012-03-04 05:06:07')).toEqual(+new Date('2012-03-04T05:06:07'));
                expect(+parseDate('2012-03-04T05:06:07')).toEqual(+new Date('2012-03-04T05:06:07'));
                expect(+parseDate('2012-03-04T05:06:07.123')).toEqual(+new Date('2012-03-04T05:06:07.123'));
                expect(+parseDate('2012-03-04T05:06:07,123')).toEqual(+new Date('2012-03-04T05:06:07.123'));
                // TODO new Date('2012-03-04T05:06:07.12') is same to '2012-03-04T05:06:07.120', not '2012-03-04T05:06:07.012'
                expect(+parseDate('2012-03-04T05:06:07.12')).toEqual(+new Date('2012-03-04T05:06:07.012'));
                expect(+parseDate('2012-03-04T05:06:07.1')).toEqual(+new Date('2012-03-04T05:06:07.001'));
                expect(+parseDate('2012-03-04T05:06:07,123Z')).toEqual(+new Date('2012-03-04T05:06:07.123Z'));
                expect(+parseDate('2012-03-04T05:06:07.123+0800')).toEqual(1330808767123);
                expect(+parseDate('2012-03-04T05:06:07.123+08:00')).toEqual(1330808767123);
                expect(+parseDate('2012-03-04T05:06:07.123-0700')).toEqual(1330862767123);
                expect(+parseDate('2012-03-04T05:06:07.123-07:00')).toEqual(1330862767123);
                expect(+parseDate('2012-03-04T5:6:7.123-07:00')).toEqual(1330862767123);
                expect(+parseDate('2012-03-04T05:06:07.123000Z')).toEqual(+new Date('2012-03-04T05:06:07.123Z'));

                // Other string
                expect(+parseDate('2012')).toEqual(+new Date('2012-01-01T00:00:00'));
                expect(+parseDate('2012/03')).toEqual(+new Date('2012-03-01T00:00:00'));
                expect(+parseDate('2012/03/04')).toEqual(+new Date('2012-03-04T00:00:00'));
                expect(+parseDate('2012-3-4')).toEqual(+new Date('2012-03-04T00:00:00'));
                expect(+parseDate('2012/3')).toEqual(+new Date('2012-03-01T00:00:00'));
                expect(+parseDate('2012/3/4')).toEqual(+new Date('2012-03-04T00:00:00'));
                expect(+parseDate('2012/3/4 2:05')).toEqual(+new Date('2012-03-04T02:05:00'));
                expect(+parseDate('2012/03/04 2:05')).toEqual(+new Date('2012-03-04T02:05:00'));
                expect(+parseDate('2012/3/4 2:05:08')).toEqual(+new Date('2012-03-04T02:05:08'));
                expect(+parseDate('2012/03/04 2:05:08')).toEqual(+new Date('2012-03-04T02:05:08'));
                expect(+parseDate('2012/3/4 2:05:08.123')).toEqual(+new Date('2012-03-04T02:05:08.123'));
                expect(+parseDate('2012/03/04 2:05:08.123')).toEqual(+new Date('2012-03-04T02:05:08.123'));
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});