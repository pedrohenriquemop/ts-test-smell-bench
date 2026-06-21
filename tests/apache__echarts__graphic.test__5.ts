it('intersect', function () {
            expect(lineLineIntersect(10, 20, 30, 40, 12, 20, 30, 40)).toEqual(true);
            expect(lineLineIntersect(10, 20, 30, 40, 12, 20, 20, 42)).toEqual(true);
        })