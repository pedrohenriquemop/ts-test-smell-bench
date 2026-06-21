it('subPixelOptimize_base', function () {
            expect(subPixelOptimize(5, 1)).toEqual(4.5);
            expect(subPixelOptimize(5, 2)).toEqual(5);
            expect(subPixelOptimize(5, 43)).toEqual(4.5);
            expect(subPixelOptimize(7.5, 1)).toEqual(7.5);
            expect(subPixelOptimize(7.5, 2)).toEqual(7);
            expect(subPixelOptimize(14, 1, true)).toEqual(14.5);
            expect(subPixelOptimize(14, 2, true)).toEqual(14);
            expect(subPixelOptimize(-11, 1)).toEqual(-11.5);
            expect(subPixelOptimize(-11, 2)).toEqual(-11);
            expect(subPixelOptimize(0, 2)).toEqual(0);
            expect(subPixelOptimize(0, 1)).toEqual(-0.5);
            expect(subPixelOptimize(5, 0)).toEqual(5);
        })