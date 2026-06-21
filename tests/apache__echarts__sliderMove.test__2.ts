it('cross', function () {

            expect(sliderMove(2, [20, 25], [10, 50], 0)).toEqual([22, 25]);
            expect(sliderMove(200, [20, 25], [10, 50], 0)).toEqual([50, 25]);
            expect(sliderMove(-2, [20, 25], [10, 50], 0)).toEqual([18, 25]);
            expect(sliderMove(-200, [20, 25], [10, 50], 0)).toEqual([10, 25]);

            expect(sliderMove(2, [20, 25], [10, 50], 1)).toEqual([20, 27]);
            expect(sliderMove(200, [20, 25], [10, 50], 1)).toEqual([20, 50]);
            expect(sliderMove(-2, [20, 25], [10, 50], 1)).toEqual([20, 23]);
            expect(sliderMove(-200, [20, 25], [10, 50], 1)).toEqual([20, 10]);

        })