import { EChartsType, registerMap } from '../../../../src/echarts';
import { GeoJSON } from '../../../../src/coord/geo/geoTypes';
import { createChart } from '../../core/utHelper';


describe('api/converter', () => {
  const DELTA = 1E-3;
  function pointEquals(p1: number | number[], p2: number | number[]): boolean {
          if (p1 instanceof Array && p2 instanceof Array) {
              return Math.abs(p1[0] - p2[0]) < DELTA && Math.abs(p1[1] - p2[1]) < DELTA;
          }
          else if (typeof p1 === 'number' && typeof p2 === 'number') {
              return Math.abs(p1 - p2) < DELTA;
          }
          else {
              throw Error('Iillegal p1 or p2');
          }
      }
  const testGeoJson1: GeoJSON = {
          'type': 'FeatureCollection',
          'features': [
              {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Polygon',
                      'coordinates': [
                          [
                              [
                                  2000,
                                  3000
                              ],
                              [
                                  5000,
                                  3000
                              ],
                              [
                                  5000,
                                  8000
                              ],
                              [
                                  2000,
                                  8000
                              ]
                          ]
                      ]
                  },
                  'properties': {
                      'name': 'Afghanistan',
                      'childNum': 1
                  }
              }
          ]
      };
  const testGeoJson2: GeoJSON = {
          'type': 'FeatureCollection',
          'features': [
              {
                  'type': 'Feature',
                  'geometry': {
                      'type': 'Polygon',
                      'coordinates': [
                          [
                              [
                                  200,
                                  300
                              ],
                              [
                                  500,
                                  300
                              ],
                              [
                                  500,
                                  800
                              ],
                              [
                                  200,
                                  800
                              ]
                          ]
                      ]
                  },
                  'properties': {
                      'name': 'Afghanistan',
                      'childNum': 1
                  }
              }
          ]
      };
  registerMap('converter_test_geo_1', testGeoJson1);
  registerMap('converter_test_geo_2', testGeoJson2);
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  // ── TARGET TEST ─────────────────────────────────
  it('cartesian', function () {

          chart.setOption({
              geo: [ // Should not affect grid converter.
                  {
                      map: 'converter_test_geo_1'
                  }
              ],
              grid: [
                  {
                      id: 'g0',
                      left: 10,
                      right: '50%',
                      top: 30,
                      bottom: 40,
                      containLabel: false
                  },
                  {
                      id: 'g1',
                      left: '50%',
                      right: 20,
                      top: 30,
                      bottom: 40,
                      containLabel: false
                  }
              ],
              xAxis: [
                  {
                      id: 'x0',
                      type: 'value',
                      min: -500,
                      max: 3000,
                      gridId: 'g0'
                  },
                  {
                      id: 'x1',
                      type: 'value',
                      min: -50,
                      max: 300,
                      gridId: 'g0'
                  },
                  {
                      id: 'x2',
                      type: 'value',
                      min: -50,
                      max: 300,
                      gridId: 'g1'
                  }
              ],
              yAxis: [
                  {
                      id: 'y0',
                      type: 'value',
                      min: 6000,
                      max: 9000,
                      gridId: 'g0'
                  },
                  {
                      id: 'y1',
                      type: 'value',
                      inverse: true, // test inverse
                      min: 600,
                      max: 900,
                      gridId: 'g1'
                  }
              ],
              series: [
                  {
                      id: 'k1',
                      type: 'scatter',
                      // left: 0,
                      // right: 0,
                      // top: 0,
                      // bottom: 0,
                      data: [[1000, 700]]
                  },
                  {
                      id: 'k2',
                      type: 'scatter',
                      // left: 0,
                      // right: 0,
                      // top: 0,
                      // bottom: 0,
                      data: [[100, 800]]
                  },
                  {
                      id: 'j1',
                      type: 'scatter',
                      // left: 0,
                      // right: 0,
                      // top: 0,
                      // bottom: 0,
                      data: [[100, 800]],
                      xAxisIndex: 1
                  },
                  {
                      id: 'i1',
                      type: 'scatter',
                      // left: 0,
                      // right: 0,
                      // top: 0,
                      // bottom: 0,
                      data: [],
                      xAxisId: 'x2',
                      yAxisId: 'y1'
                  }
              ]
          });

          const width = chart.getWidth();
          const height = chart.getHeight();
          expect(
              pointEquals(chart.convertToPixel({seriesIndex: 1}, [-500, 6000]), [16, height - 40])
          ).toEqual(true);
          expect(
              pointEquals(chart.convertFromPixel({seriesIndex: 1}, [16, height - 40]), [-500, 6000])
          ).toEqual(true);

          expect(
              pointEquals(chart.convertToPixel({seriesId: 'i1'}, [300, 900]), [width - 20, height - 40])
          ).toEqual(true);
          expect(
              pointEquals(chart.convertFromPixel({seriesId: 'i1'}, [width - 20, height - 40]), [300, 900])
          ).toEqual(true);

          expect(
              pointEquals(chart.convertToPixel({xAxisIndex: 2, yAxisId: 'y1'}, [300, 900]), [width - 20, height - 40])
          ).toEqual(true);
          expect(
              pointEquals(chart.convertFromPixel({xAxisIndex: 2, yAxisId: 'y1'}, [width - 20, height - 40]), [300, 900])
          ).toEqual(true);

          expect(
              pointEquals(chart.convertToPixel({gridId: 'g1'}, [300, 900]), [width - 20, height - 40])
          ).toEqual(true);
          expect(
              pointEquals(chart.convertFromPixel({gridId: 'g1'}, [width - 20, height - 40]), [300, 900])
          ).toEqual(true);

          expect(pointEquals(chart.convertToPixel({xAxisId: 'x0'}, 3000), width / 2)).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({xAxisId: 'x0'}, width / 2), 3000)).toEqual(true);

          expect(pointEquals(chart.convertToPixel({yAxisIndex: 1}, 600), 30)).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({yAxisIndex: 1}, 30), 600)).toEqual(true);
      })
  // ── END TARGET TEST ─────────────────────────────
});