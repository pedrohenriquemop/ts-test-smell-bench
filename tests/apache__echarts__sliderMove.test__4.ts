it('maxSpan_pull', function () {

            expect(sliderMove(-8, [20, 25], [10, 50], 0, null, 4)).toEqual([12, 16]);
            expect(sliderMove(14, [20, 25], [10, 50], 0, null, 4)).toEqual([34, 30]);
            expect(sliderMove(200, [20, 25], [10, 50], 0, null, 4)).toEqual([50, 46]);
            expect(sliderMove(-200, [20, 25], [10, 50], 0, null, 4)).toEqual([10, 14]);

            expect(sliderMove(8, [20, 25], [10, 50], 1, null, 4)).toEqual([29, 33]);
            expect(sliderMove(-15, [20, 25], [10, 50], 1, null, 4)).toEqual([14, 10]);
            expect(sliderMove(-200, [20, 25], [10, 50], 1, null, 4)).toEqual([14, 10]);
            expect(sliderMove(200, [20, 25], [10, 50], 1, null, 4)).toEqual([46, 50]);

        })