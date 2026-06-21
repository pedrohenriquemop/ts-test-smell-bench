it('extreme', function () {
            expect(lineLineIntersect(10, 10, 30, 30, 10, 10, 10, 10)).toEqual(false);
        })