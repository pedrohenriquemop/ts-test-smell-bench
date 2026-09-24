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
  it('graph', function () {
          registerMap('test1', testGeoJson1);

          chart.setOption({
              geo: [ // Should not affect graph converter.
                  {
                      map: 'test1'
                  }
              ],
              series: [
                  {
                      id: 'k1',
                      type: 'graph',
                      left: 10,
                      right: '50%',
                      top: 30,
                      bottom: 40,
                      data: [
                          {x: 1000, y: 2000},
                          {x: 1000, y: 5000},
                          {x: 3000, y: 5000},
                          {x: 3000, y: 2000}
                      ],
                      links: []
                  }
              ]
          });

          expect(chart.containPixel('series', [15, 35])).toEqual(true);
          expect(chart.containPixel('series', [3, 4])).toEqual(false);
      })
  // ── END TARGET TEST ─────────────────────────────
});