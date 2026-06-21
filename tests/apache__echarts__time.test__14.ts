it('roundTime_locale', function () {
            const timezoneStr = getISOTimezone();
            const time1 = new Date(`1986-10-06T11:25:45.678${timezoneStr}`);

            expect(roundTime(new Date(time1), 'year', false).getTime())
                .toEqual(new Date(`1986-01-01T00:00:00.000${timezoneStr}`).getTime());
            expect(roundTime(new Date(time1), 'month', false).getTime())
                .toEqual(new Date(`1986-10-01T00:00:00.000${timezoneStr}`).getTime());
            expect(roundTime(new Date(time1), 'day', false).getTime())
                .toEqual(new Date(`1986-10-06T00:00:00.000${timezoneStr}`).getTime());
            expect(roundTime(new Date(time1), 'hour', false).getTime())
                .toEqual(new Date(`1986-10-06T11:00:00.000${timezoneStr}`).getTime());
            expect(roundTime(new Date(time1), 'minute', false).getTime())
                .toEqual(new Date(`1986-10-06T11:25:00.000${timezoneStr}`).getTime());
            expect(roundTime(new Date(time1), 'second', false).getTime())
                .toEqual(new Date(`1986-10-06T11:25:45.000${timezoneStr}`).getTime());
            expect(roundTime(new Date(time1), 'millisecond', false).getTime())
                .toEqual(new Date(`1986-10-06T11:25:45.678${timezoneStr}`).getTime());
        })