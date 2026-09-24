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
  it('geo', function () {
          registerMap('test1', testGeoJson1);
          registerMap('test2', testGeoJson2);

          chart.setOption({
              geo: [
                  {
                      id: 'aa',
                      left: 10,
                      right: '50%',
                      top: 30,
                      bottom: 40,
                      map: 'test1'
                  },
                  {
                      id: 'bb',
                      layoutCenter: ['50%', 50],
                      layoutSize: 20,
                      aspectScale: 1,
                      map: 'test2'
                  },
                  {
                      id: 'cc',
                      aspectScale: 1,
                      left: 0,
                      width: '50%',
                      top: 0,
                      height: '50%',
                      zoom: 0.5, // test roam
                      map: 'test1'
                  }
              ],
              series: [
                  {id: 'k1', type: 'scatter', coordinateSystem: 'geo', geoIndex: 1},
                  {id: 'k2', type: 'scatter', coordinateSystem: 'geo'}
              ]
          });

          const width = chart.getWidth();
          // const height = chart.getWidth();

          expect(chart.containPixel('geo', [15, 30])).toEqual(true);
          expect(chart.containPixel('geo', [9.5, 30])).toEqual(false);
          expect(chart.containPixel({geoIndex: 1}, [width / 2, 50])).toEqual(true);
          expect(chart.containPixel({geoIndex: 1}, [10, 20])).toEqual(false);
          expect(chart.containPixel({geoId: 'cc'}, [0, 0])).toEqual(false);
      })
  // ── END TARGET TEST ─────────────────────────────
});