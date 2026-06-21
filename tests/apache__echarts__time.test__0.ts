it('should format year', function () {
            expect(format(time, '{yyyy}', true)).toEqual('2003');
            expect(format(time, '{yy}', true)).toEqual('03');

            expect(format(anotherTime, '{yyyy}', true)).toEqual('2023');
            expect(format(anotherTime, '{yy}', true)).toEqual('23');
        })