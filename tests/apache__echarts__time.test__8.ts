it('should format second', function () {
            expect(format(time, '{ss}', true)).toEqual('02');
            expect(format(time, '{s}', true)).toEqual('2');

            expect(format(anotherTime, '{ss}', true)).toEqual('33');
            expect(format(anotherTime, '{s}', true)).toEqual('33');
        })