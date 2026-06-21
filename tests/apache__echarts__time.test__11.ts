it('should format meridian', function () {
            expect(format(time, '{a}', true)).toEqual('am');
            expect(format(anotherTime, '{a}', true)).toEqual('am');
            expect(format(oneMoreTime, '{a}', true)).toEqual('pm');
        })