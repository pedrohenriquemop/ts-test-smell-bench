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
  it('graph', function () {
          chart.setOption({
              geo: [ // Should not affect graph converter.
                  {
                      map: 'converter_test_geo_1'
                  }
              ],
              series: [
                  {
                      id: 'k1',
                      type: 'graph',
                      left: 10,
                      right: 20,
                      top: 30,
                      bottom: 40,
                      data: [
                          {x: 1000, y: 2000},
                          {x: 1000, y: 5000},
                          {x: 3000, y: 5000},
                          {x: 3000, y: 2000}
                      ],
                      links: []
                  },
                  {
                      id: 'k2',
                      type: 'graph',
                      left: 10,
                      right: 20,
                      top: 30,
                      bottom: 40,
                      data: [
                          {x: 100, y: 200},
                          {x: 100, y: 500},
                          {x: 300, y: 500},
                          {x: 300, y: 200}
                      ],
                      links: []
                  }
              ]
          });

          const width = chart.getWidth();
          const height = chart.getHeight();

          expect(
              pointEquals(
                  chart.convertToPixel({seriesIndex: 0}, [2000, 3500]), [10 + (width - 30) / 2, 30 + (height - 70) / 2]
              )
          ).toEqual(true);
          expect(
              pointEquals(
                  chart.convertFromPixel({seriesIndex: 0}, [10 + (width - 30) / 2, 30 + (height - 70) / 2]), [2000, 3500]
              )
          ).toEqual(true);

          expect(pointEquals(chart.convertToPixel({seriesId: 'k2'}, [100, 500]), [10, height - 40])).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({seriesId: 'k2'}, [10, height - 40]), [100, 500])).toEqual(true);
      })
  // ── END TARGET TEST ─────────────────────────────
});