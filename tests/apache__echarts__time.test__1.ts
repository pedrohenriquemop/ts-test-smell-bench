it('should format quarter', function () {
            expect(format(time, '{Q}', true)).toEqual('2');
            expect(format(anotherTime, '{Q}', true)).toEqual('4');
        })