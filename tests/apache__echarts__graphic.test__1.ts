it('subPixelOptimize_line', function () {
            function doSubPixelOptimizeLine(x: number, y: number, width: number, height: number, lineWidth: number) {
                const params = makeParam(x, y, width, height, lineWidth);
                return subPixelOptimizeLine(params.shape, params.shape, params.style);
            }
            function makeParam(x1: number, y1: number, x2: number, y2: number, lineWidth: number) {
                return {
                    shape: {x1: x1, y1: y1, x2: x2, y2: y2},
                    style: {lineWidth: lineWidth}
                };
            }
            expect(doSubPixelOptimizeLine(5, 11, 3, 7, 1)).toEqual(makeParam(5, 11, 3, 7, 1).shape);
            expect(doSubPixelOptimizeLine(5, 11, 5, 7, 1)).toEqual(makeParam(5.5, 11, 5.5, 7, 1).shape);
            expect(doSubPixelOptimizeLine(5, 11, 5, 7, 2)).toEqual(makeParam(5, 11, 5, 7, 2).shape);
            expect(doSubPixelOptimizeLine(5, 11, 15, 11, 1)).toEqual(makeParam(5, 11.5, 15, 11.5, 1).shape);
            expect(doSubPixelOptimizeLine(5, 11, 15, 11, 2)).toEqual(makeParam(5, 11, 15, 11, 2).shape);
            expect(doSubPixelOptimizeLine(5, 11, 15, 11, 3)).toEqual(makeParam(5, 11.5, 15, 11.5, 3).shape);
            expect(doSubPixelOptimizeLine(5, 11, 15, 11.5, 3)).toEqual(makeParam(5, 11, 15, 11.5, 3).shape);
            expect(doSubPixelOptimizeLine(5, 11.5, 15, 11.5, 3)).toEqual(makeParam(5, 11.5, 15, 11.5, 3).shape);
            expect(doSubPixelOptimizeLine(5, 11.5, 15, 11.5, 4)).toEqual(makeParam(5, 12, 15, 12, 4).shape);
        })