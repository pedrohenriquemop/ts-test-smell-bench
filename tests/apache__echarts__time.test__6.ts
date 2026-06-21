it('should format hour', function () {
            expect(format(time, '{hh}', true)).toEqual('01');
            expect(format(time, '{h}', true)).toEqual('1');

            expect(format(anotherTime, '{hh}', true)).toEqual('11');
            expect(format(anotherTime, '{h}', true)).toEqual('11');
        })