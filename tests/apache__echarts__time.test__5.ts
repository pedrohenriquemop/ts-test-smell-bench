it('should format hour', function () {
            expect(format(time, '{HH}', true)).toEqual('01');
            expect(format(time, '{H}', true)).toEqual('1');

            expect(format(anotherTime, '{HH}', true)).toEqual('11');
            expect(format(anotherTime, '{H}', true)).toEqual('11');
        })