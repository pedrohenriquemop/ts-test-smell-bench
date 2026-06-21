it('subPixelOptimize_rect', function () {
            function doSubPixelOptimizeRect(x: number, y: number, width: number, height: number, lineWidth: number) {
                const params = makeParam(x, y, width, height, lineWidth);
                return subPixelOptimizeRect(params.shape, params.shape, params.style);
            }
            function makeParam(x: number, y: number, width: number, height: number, lineWidth: number) {
                return {
                    shape: {x: x, y: y, width: width, height: height},
                    style: {lineWidth: lineWidth}
                };
            }
            expect(doSubPixelOptimizeRect(5, 11, 3, 7, 1)).toEqual(makeParam(5.5, 11.5, 2, 6, 1).shape);
            expect(doSubPixelOptimizeRect(5, 11, 3, 7, 2)).toEqual(makeParam(5, 11, 3, 7, 2).shape);
            expect(doSubPixelOptimizeRect(5, 11, 3, 7, 3)).toEqual(makeParam(5.5, 11.5, 2, 6, 3).shape);
            // Boundary value tests
            expect(doSubPixelOptimizeRect(5, 11, 1, 7, 1)).toEqual(makeParam(5.5, 11.5, 1, 6, 1).shape);
            expect(doSubPixelOptimizeRect(5, 11, 1, 0, 1)).toEqual(makeParam(5.5, 11.5, 1, 0, 1).shape);
        })