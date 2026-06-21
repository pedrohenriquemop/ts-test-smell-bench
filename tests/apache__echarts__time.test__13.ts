it('roundTime_UTC', function () {
            expect(roundTime(new Date(0), 'year', true).toISOString()).toEqual('1970-01-01T00:00:00.000Z');

            const time1 = 3600 * 1000 * 24 * 6122 + 12345678; // '1986-10-06T03:25:45.678Z'
            expect(roundTime(new Date(time1), 'year', true).toISOString()).toEqual('1986-01-01T00:00:00.000Z');
            expect(roundTime(new Date(time1), 'month', true).toISOString()).toEqual('1986-10-01T00:00:00.000Z');
            expect(roundTime(new Date(time1), 'day', true).toISOString()).toEqual('1986-10-06T00:00:00.000Z');
            expect(roundTime(new Date(time1), 'hour', true).toISOString()).toEqual('1986-10-06T03:00:00.000Z');
            expect(roundTime(new Date(time1), 'minute', true).toISOString()).toEqual('1986-10-06T03:25:00.000Z');
            expect(roundTime(new Date(time1), 'second', true).toISOString()).toEqual('1986-10-06T03:25:45.000Z');
            expect(roundTime(new Date(time1), 'millisecond', true).toISOString()).toEqual('1986-10-06T03:25:45.678Z');
        })