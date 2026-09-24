import {
    linearMap, parseDate, reformIntervals, getPrecisionSafe, getPrecision,
    getPercentWithPrecision, quantityExponent, quantity, nice,
    isNumeric, numericToNumber, addSafe,
    getPixelPrecision,
    getAcceptableTickPrecision
} from '@/src/util/number';


describe('util/number', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('getAcceptableTickPrecision', function () {
          // NOTICE: These cases fail in `getPixelPrecision` (pxDiff1 > 1)
          const CASES = [
              // dataExtent                      pixelExtent                  precision1 precision2 diff1 diff2
              [ [ 0, 1e-3 ],                     [ 0, 100 ] ],                // 1 0
              [ [ 0, 1e5 ],                      [ 0, 100 ] ],                // 1 0
              [ [ 0, 816.2050883836147 ],        [ 0, 914.7923109827166 ] ],  // 1 0
              [ [ 0, 132.4279201671552 ],        [ 0, 267.9399859644955 ] ],  // 0 1 1.011644620055545 0.1011644620055545
              [ [ 0, 100.34020279327427 ],       [ 0, 287.77043437322726 ] ], // 0 1 1.433973753103259 0.14339737531032593
              [ [ 0, 131.76288568225613 ],       [ 0, 268.9583525845105 ] ],  // 0 1 1.020614990298174 0.10206149902981741
              [ [ 0, 100.28571954202148 ],       [ 0, 256.9972613326965 ] ],  // 0 1 1.2813253098563555 0.12813253098563557
              [ [ 0, 104.20905450687412 ],       [ 0, 301.06863468545566 ] ], // 0 1 1.4445416288926973 0.14445416288926974
              [ [ 0, 0.0000012212958760328775 ], [ 0, 30.161832948821356 ] ], // 7 8 1.234829067252553 0.12348290672525532 fail1
              [ [ 0, 1.0169256034269881e-7 ],    [ 0, 293.5116394339741 ] ],  // 9 10 1.4431323119648805 0.14431323119648806 fail1
              [ [ 0, 0.0011105264071798859 ],    [ 0, 222.30675252167865 ] ], // 5 6 1.0009070972306418 0.10009070972306418 fail1
              [ [ 0, 0.00010498610084514804 ],   [ 0, 264.6383246939843 ] ],  // 6 7 1.260349334643447 0.1260349334643447 fail1
          ];
          const NAN_CASES = [
              [ [ 0, 0 ],                        [ 0, 100 ] ],
          ];

          // We require `diff * pxSpan / dataSpan <= pxDiffAcceptable`.
          // The max `diff` is: `pow(10, -precision) / 2`.
          function calcMaxPxDiff(dataExtent: number[], pxExtent: number[], precision: number): number {
              return Math.pow(10, -precision) / 2
                  * Math.abs(pxExtent[1] - pxExtent[0])
                  / Math.abs(dataExtent[1] - dataExtent[0]);
          }

          for (let idx = 0; idx < CASES.length; idx++) {
              const caseItem = CASES[idx];
              const dataExtent = caseItem[0];
              const pxExtent = caseItem[1];
              const precision1 = getPixelPrecision(
                  dataExtent.slice() as [number, number],
                  pxExtent.slice() as [number, number]
              );
              const precision2 = getAcceptableTickPrecision(
                  dataExtent,
                  pxExtent[1] - pxExtent[0],
                  null
              );
              const pxDiff1 = calcMaxPxDiff(dataExtent, pxExtent, precision1);
              const pxDiff2 = calcMaxPxDiff(dataExtent, pxExtent, precision2);
              expect(pxDiff1).toBeFinite(); // May > 1 (bad case).
              expect(pxDiff2).toBeLessThanOrEqual(1);

              // if (precision1 > 1) {
              //     console.log(
              //         dataExtent, pxExtent, '---',
              //         precision1, precision2, pxDiff1, pxDiff2
              //     );
              // }
          }

          for (let idx = 0; idx < NAN_CASES.length; idx++) {
              const caseItem = NAN_CASES[idx];
              const dataExtent = caseItem[0];
              const pxExtent = caseItem[1];
              const precision2 = getAcceptableTickPrecision(
                  dataExtent,
                  pxExtent[1] - pxExtent[0],
                  null
              );
              const pxDiff2 = calcMaxPxDiff(dataExtent, pxExtent, precision2);
              expect(pxDiff2).toBeNaN();
          }

      })
  // ── END TARGET TEST ─────────────────────────────
});