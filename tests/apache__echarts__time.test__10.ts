it('should format millisecond', function () {
            expect(format(time, '{S}', true)).toEqual('300');
            expect(format(anotherTime, '{S}', true)).toEqual('3');
        })