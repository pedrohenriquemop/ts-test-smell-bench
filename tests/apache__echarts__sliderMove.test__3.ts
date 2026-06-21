it('minSpan_push', function () {

            expect(sliderMove(1, [20, 25], [10, 50], 0, 3)).toEqual([21, 25]);
            expect(sliderMove(4, [20, 25], [10, 50], 0, 3)).toEqual([24, 27]);
            expect(sliderMove(200, [20, 25], [10, 50], 0, 3)).toEqual([47, 50]);
            expect(sliderMove(-200, [20, 25], [10, 50], 0, 3)).toEqual([10, 25]);

            expect(sliderMove(-1, [20, 25], [10, 50], 1, 3)).toEqual([20, 24]);
            expect(sliderMove(-4, [20, 25], [10, 50], 1, 3)).toEqual([18, 21]);
            expect(sliderMove(-200, [20, 25], [10, 50], 1, 3)).toEqual([10, 13]);
            expect(sliderMove(200, [20, 25], [10, 50], 1, 3)).toEqual([20, 50]);

            // minSpan is 0.
            expect(sliderMove(10, [20, 25], [10, 50], 0, 0)).toEqual([30, 30]);
            expect(sliderMove(-10, [20, 25], [10, 50], 1, 0)).toEqual([15, 15]);

            // Input handleEnds[0] === handleEnds[1], should not cross.
            expect(sliderMove(10, [20, 20], [10, 50], 0, 0)).toEqual([30, 30]);
            expect(sliderMove(-5, [20, 20], [10, 50], 1, 0)).toEqual([15, 15]);
        })