it('should format minute', function () {
            expect(format(time, '{mm}', true)).toEqual('04');
            expect(format(time, '{m}', true)).toEqual('4');

            expect(format(anotherTime, '{mm}', true)).toEqual('44');
            expect(format(anotherTime, '{m}', true)).toEqual('44');
        })