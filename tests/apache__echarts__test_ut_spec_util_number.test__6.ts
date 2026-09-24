import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  describe('reformIntervals', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('basic', function () {
                // all
                expect(reformIntervals([
                    {interval: [18, 62], close: [1, 1]},
                    {interval: [-Infinity, -70], close: [0, 0]},
                    {interval: [-70, -26], close: [1, 1]},
                    {interval: [-26, 18], close: [1, 1]},
                    {interval: [62, 150], close: [1, 1]},
                    {interval: [106, 150], close: [1, 1]},
                    {interval: [150, Infinity], close: [0, 0]}
                ])).toEqual([
                    {interval: [-Infinity, -70], close: [0, 0]},
                    {interval: [-70, -26], close: [1, 1]},
                    {interval: [-26, 18], close: [0, 1]},
                    {interval: [18, 62], close: [0, 1]},
                    {interval: [62, 150], close: [0, 1]},
                    {interval: [150, Infinity], close: [0, 0]}
                ]);

                // remove overlap
                expect(reformIntervals([
                    {interval: [18, 62], close: [1, 1]},
                    {interval: [50, 150], close: [1, 1]}
                ])).toEqual([
                    {interval: [18, 62], close: [1, 1]},
                    {interval: [62, 150], close: [0, 1]}
                ]);

                // remove overlap on edge
                expect(reformIntervals([
                    {interval: [18, 62], close: [1, 1]},
                    {interval: [62, 150], close: [1, 1]}
                ])).toEqual([
                    {interval: [18, 62], close: [1, 1]},
                    {interval: [62, 150], close: [0, 1]}
                ]);

                // remove included interval
                expect(reformIntervals([
                    {interval: [30, 40], close: [1, 1]},
                    {interval: [42, 54], close: [1, 1]},
                    {interval: [45, 60], close: [1, 1]},
                    {interval: [18, 62], close: [1, 1]}
                ])).toEqual([
                    {interval: [18, 62], close: [1, 1]}
                ]);

                // remove edge
                expect(reformIntervals([
                    {interval: [18, 62], close: [1, 1]},
                    {interval: [30, 62], close: [1, 1]}
                ])).toEqual([
                    {interval: [18, 62], close: [1, 1]}
                ]);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});