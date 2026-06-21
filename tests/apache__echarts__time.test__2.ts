it('should format month', function () {
            expect(format(time, '{MMMM}', true)).toEqual('April');
            expect(format(time, '{MMM}', true)).toEqual('Apr');
            expect(format(time, '{MM}', true)).toEqual('04');
            expect(format(time, '{M}', true)).toEqual('4');

            expect(format(anotherTime, '{MMMM}', true)).toEqual('December');
            expect(format(anotherTime, '{MMM}', true)).toEqual('Dec');
            expect(format(anotherTime, '{MM}', true)).toEqual('12');
            expect(format(anotherTime, '{M}', true)).toEqual('12');
        })