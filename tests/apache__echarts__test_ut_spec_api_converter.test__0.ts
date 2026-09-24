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
  it('geo', function () {
          // TODO Needs namespace
          chart.setOption({
              geo: [
                  {
                      id: 'aa',
                      left: 10,
                      right: 20,
                      top: 30,
                      bottom: 40,
                      map: 'converter_test_geo_1'
                  },
                  {
                      id: 'bb',
                      left: 10,
                      right: 20,
                      top: 30,
                      bottom: 40,
                      map: 'converter_test_geo_2'
                  }
              ],
              series: [
                  {id: 'k1', type: 'scatter', coordinateSystem: 'geo', geoIndex: 1},
                  {id: 'k2', type: 'scatter', coordinateSystem: 'geo'},
                  { // Should not be affected by map.
                      id: 'm1',
                      type: 'map',
                      map: 'converter_test_geo_1',
                      left: 10,
                      right: 20,
                      top: 30,
                      bottom: 40
                  }
              ]
          });

          const width = chart.getWidth();
          const height = chart.getHeight();

          expect(pointEquals(chart.convertToPixel('geo', [5000, 3000]), [width - 20, height - 40])).toEqual(true);
          expect(pointEquals(chart.convertFromPixel('geo', [width - 20, height - 40]), [5000, 3000])).toEqual(true);

          expect(pointEquals(chart.convertToPixel({geoIndex: 1}, [500, 800]), [width - 20, 30])).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({geoIndex: 1}, [width - 20, 30]), [500, 800])).toEqual(true);

          expect(pointEquals(chart.convertToPixel({geoId: 'bb'}, [200, 300]), [10, height - 40])).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({geoId: 'bb'}, [10, height - 40]), [200, 300])).toEqual(true);

          expect(pointEquals(chart.convertToPixel({seriesIndex: 0}, [200, 800]), [10, 30])).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({seriesIndex: 0}, [10, 30]), [200, 800])).toEqual(true);

          expect(pointEquals(chart.convertToPixel({seriesId: 'k2'}, [2000, 8000]), [10, 30])).toEqual(true);
          expect(pointEquals(chart.convertFromPixel({seriesId: 'k2'}, [10, 30]), [2000, 8000])).toEqual(true);
      })
  // ── END TARGET TEST ─────────────────────────────
});