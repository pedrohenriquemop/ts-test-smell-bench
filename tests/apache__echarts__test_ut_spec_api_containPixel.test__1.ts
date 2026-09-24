import { createChart, removeChart } from '../../core/utHelper';
import { EChartsType, registerMap } from '../../../../src/echarts';
import { GeoJSON } from '../../../../src/coord/geo/geoTypes';


describe('api/containPixel', () => {
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
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart({
              width: 200,
              height: 150
          });
      });
  afterEach(function () {
          removeChart(chart);
      });

  // ── TARGET TEST ─────────────────────────────────
  it('map', function () {
          registerMap('test1', testGeoJson1);
          registerMap('test2', testGeoJson2);

          chart.setOption({
              series: [
                  {
                      id: 'k1',
                      type: 'map',
                      map: 'test1',
                      left: 10,
                      right: '50%',
                      top: 30,
                      bottom: 40
                  },
                  {
                      id: 'k2',
                      type: 'map',
                      map: 'test2',
                      layoutCenter: ['50%', 50],
                      layoutSize: 20,
                      aspectScale: 1
                  }
              ]
          });

          const width = chart.getWidth();

          expect(chart.containPixel('series', [15, 30])).toEqual(true);
          expect(chart.containPixel('series', [9.5, 30])).toEqual(false);
          expect(chart.containPixel({seriesId: 'k2'}, [width / 2, 50])).toEqual(true);
          expect(chart.containPixel({seriesId: 1}, [10, 20])).toEqual(false);
      })
  // ── END TARGET TEST ─────────────────────────────
});