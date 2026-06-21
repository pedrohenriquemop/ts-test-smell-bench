it('should format day', function () {
            expect(format(time, '{dd}', true)).toEqual('09');
            expect(format(time, '{d}', true)).toEqual('9');

            expect(format(anotherTime, '{dd}', true)).toEqual('19');
            expect(format(anotherTime, '{d}', true)).toEqual('19');
        })