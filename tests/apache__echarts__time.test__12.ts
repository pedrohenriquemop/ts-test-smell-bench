it('should format meridian in uppercase', function () {
            expect(format(time, '{A}', true)).toEqual('AM');
            expect(format(anotherTime, '{A}', true)).toEqual('AM');
            expect(format(oneMoreTime, '{A}', true)).toEqual('PM');
        })