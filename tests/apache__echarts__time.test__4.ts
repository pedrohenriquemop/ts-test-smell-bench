it('should format day of week', function () {
            expect(format(time, '{eeee}', true)).toEqual('Wednesday');
            expect(format(time, '{ee}', true)).toEqual('Wed');
            expect(format(time, '{e}', true)).toEqual('3');

            expect(format(anotherTime, '{eeee}', true)).toEqual('Tuesday');
            expect(format(anotherTime, '{ee}', true)).toEqual('Tue');
            expect(format(anotherTime, '{e}', true)).toEqual('2');
        })