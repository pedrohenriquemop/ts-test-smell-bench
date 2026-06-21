it('should format millisecond', function () {
            expect(format(time, '{SSS}', true)).toEqual('300');
            expect(format(anotherTime, '{SSS}', true)).toEqual('003');
        })