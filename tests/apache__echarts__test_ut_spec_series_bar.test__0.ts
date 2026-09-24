import { createChart } from '../../core/utHelper';


describe('bar', () => {

  // ── TARGET TEST ─────────────────────────────────
  it('should respect encoded object-row dimensions missing from earlier rows', function () {
          const chart = createChart({width: 400, height: 300});

          try {
              chart.setOption({
                  animation: false,
                  dataset: {
                      source: [
                          { timestamp: 1568191020000, ECM: 26311.466666666667 },
                          { timestamp: 1568191140000, ECM: 1666775.3333333333, GSWY: 1332.5333333333333 }
                      ]
                  },
                  xAxis: { type: 'time' },
                  yAxis: { type: 'value' },
                  series: [{
                      type: 'bar',
                      name: 'ECM',
                      encode: { x: 'timestamp', y: 'ECM' },
                      stack: 'one'
                  }, {
                      type: 'bar',
                      name: 'GSWY',
                      encode: { x: 'timestamp', y: 'GSWY' },
                      stack: 'one'
                  }]
              });

              const series = (chart as any).getModel().getSeriesByIndex(1);
              const data = series.getData();
              const yDim = data.mapDimension('y');

              expect(yDim).toBe('GSWY');
              expect(isNaN(data.get(yDim, 0))).toBe(true);
              expect(data.get(yDim, 1)).toBe(1332.5333333333333);
          }
          finally {
              chart.dispose();
          }
      })
  // ── END TARGET TEST ─────────────────────────────
});