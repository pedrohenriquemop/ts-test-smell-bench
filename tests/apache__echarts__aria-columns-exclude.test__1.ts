import { EChartsType } from '@/src/echarts';
import { createChart, getECModel } from '../../core/utHelper';


describe('aria, omit data', () => {
  let chart: EChartsType;
  const option = {
          aria: {
              enabled: true,
              label: {
                  data: {
                      excludeDimensionId: [0, 1, 2]
                  }
              }
          },
          dataset: [
              {
                  dimensions: [
                      'lng',
                      'lat',
                      'name',
                      'value',
                      'capacity',
                  ],
                  source: [
                      [
                          1.58285827,
                          42.099784969,
                          'Llosa del Cavall (Navès)',
                          17.945,
                          80,
                      ],
                      [
                          0.960270444,
                          41.134931354,
                          'Riudecanyes',
                          0.401,
                          5.32,
                      ],
                  ]

              }
          ],
          series: [
              {
                  coordinateSystem: 'geo',
                  encode: {
                      itemName: 'name'
                  },
                  type: 'scatter',
              }
          ],
      };
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  // ── TARGET TEST ─────────────────────────────────
  it('should not modify the data of the chart', async () => {
          chart.setOption(option);
          const listData = getECModel(chart).getSeries()[0].getData();
          expect(listData.getValues(0)).toEqual([1.58285827, 42.099784969, 'Llosa del Cavall (Navès)', 17.945, 80]);
          expect(listData.getValues(1)).toEqual([0.960270444, 41.134931354, 'Riudecanyes', 0.401, 5.32]);
      })
  // ── END TARGET TEST ─────────────────────────────
});