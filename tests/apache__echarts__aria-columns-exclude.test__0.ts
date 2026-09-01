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
  it('specified columns should be omitted from Aria (geolocation and name)', () => {
          chart.setOption(option);
          const el = chart.getDom();
          const ariaValue = el.getAttribute('aria-label');
          expect(ariaValue).toContain('Llosa del Cavall (Navès) is 17.945, 80');
          expect(ariaValue).toContain('Riudecanyes is 0.401, 5.32');
          expect(ariaValue).not.toContain(1.58285827);
          expect(ariaValue).not.toContain(42.099784969);
          expect(ariaValue).not.toContain(0.960270444);
          expect(ariaValue).not.toContain(41.134931354);
      })
  // ── END TARGET TEST ─────────────────────────────
});