import {
    format, roundTime
} from '@/src/util/time';


describe('util/time', () => {

  describe('format', () => {
    const time = new Date('2003-04-09 01:04:02.300 UTC');
    const anotherTime = new Date('2023-12-19 11:44:33.003 UTC');
    const oneMoreTime = new Date('2023-01-12 13:09:01.035 UTC');

    // ── TARGET TEST ─────────────────────────────────
    it('should format meridian', function () {
                expect(format(time, '{a}', true)).toEqual('am');
                expect(format(anotherTime, '{a}', true)).toEqual('am');
                expect(format(oneMoreTime, '{a}', true)).toEqual('pm');
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