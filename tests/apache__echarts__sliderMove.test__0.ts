it('normalize', function () {
            // Return input handleEnds
            const inputHandleEnds = [22, 50];
            const outputHandleEnds = sliderMove(0, inputHandleEnds, [20, 50], 0);
            expect(inputHandleEnds === outputHandleEnds).toEqual(true);
            expect(outputHandleEnds).toEqual([22, 50]);

            // delta 0 and normalize
            expect(sliderMove(0, [-10, 70], [20, 50], 0)).toEqual([20, 50]);

            // normalize by minSpec
            expect(sliderMove(0, [20, 22], [20, 50], 0, 10)).toEqual([20, 30]);

            // normalize by maxSpec
            expect(sliderMove(0, [20, 42], [20, 50], 0, null, 10)).toEqual([20, 30]);

            // minSpan bigger than extent
            expect(sliderMove(4, [20, 25], [10, 50], 0, 300)).toEqual([10, 50]);

            // maxSpan smaller than minSpan
            expect(sliderMove(4, [20, 25], [10, 50], 0, 6, 3)).toEqual([24, 30]);

            // extent small then input range
            expect(sliderMove(0, [-10, 70], [20, 50], 'all')).toEqual([20, 50]);

            expect(sliderMove(0, [-10, 14], [1, 101], 'all')).toEqual([1, 25]);
            expect(sliderMove(0, [99, 110], [1, 101], 'all')).toEqual([90, 101]);
            expect(sliderMove(0, [-10, 14], [1, 101], 'all', null, 16)).toEqual([1, 17]);
            expect(sliderMove(0, [-10, 14], [1, 101], 'all', 15, 16)).toEqual([1, 17]);
            expect(sliderMove(0, [-10, 14], [1, 101], 'all', 50, null)).toEqual([1, 51]);
            expect(sliderMove(0, [-10, 14], [1, 101], 'all', 50, 55)).toEqual([1, 51]);
            expect(sliderMove(0, [-10, 14], [1, 101], 'all', 10, 55)).toEqual([1, 25]);
        })