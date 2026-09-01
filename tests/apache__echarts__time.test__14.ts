import {
    format, roundTime
} from '@/src/util/time';


describe('util/time', () => {

  describe('roundTime', () => {

    // ── TARGET TEST ─────────────────────────────────
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
    // ── END TARGET TEST ─────────────────────────────
  });
});
function getISOTimezone(): string {
    const offsetMinutes = (new Date(0)).getTimezoneOffset();
    // Invert sign because getTimezoneOffset() returns minutes behind UTC
    const sign = offsetMinutes > 0 ? '-' : '+';
    const absMinutes = Math.abs(offsetMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}