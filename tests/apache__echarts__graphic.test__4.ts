it('parallel and colinear', function () {
            expect(lineLineIntersect(10, 20, 30, 40, 100, 220, 120, 240)).toEqual(false);
            expect(lineLineIntersect(10, 10, 30, 30, 40, 40, 50, 50)).toEqual(false);
            expect(lineLineIntersect(10, 10, 30, 30, 10, 10, 30, 30)).toEqual(false);
            expect(lineLineIntersect(10, 10, 30, 30, 20, 20, 30, 30)).toEqual(false);
            expect(lineLineIntersect(10, 10, 30, 30, 20, 20, 22, 22)).toEqual(false);
        })