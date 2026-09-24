import { createChart, getECModel } from '../../../core/utHelper';
import { EChartsType } from '../../../../../src/echarts';
import { EChartsOption } from '../../../../../src/export/option';
import { ContinuousVisualMapOption } from '../../../../../src/component/visualMap/ContinuousModel';
import { PiecewiseVisualMapOption } from '../../../../../src/component/visualMap/PiecewiseModel';
import VisualMapModel from '../../../../../src/component/visualMap/VisualMapModel';
import globalDefault from '../../../../../src/model/globalDefault';


describe('vsiaulMap_setOption', () => {
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  // ── TARGET TEST ─────────────────────────────────
  it('remainVisualProp', function (done) {
          chart.setOption({
              xAxis: {},
              yAxis: {},
              series: [{type: 'scatter', data: [[12, 223]]}],
              visualMap: {
                  inRange: {
                      color: ['red', 'blue', 'yellow']
                  }
              }
          });

          chart.setOption({
              visualMap: {}
          });

          expectTheSame(chart.getOption() as EChartsOption);

          chart.setOption({
              series: [{data: [[44, 55]]}] // visualMap depends series
          });

          expectTheSame(chart.getOption() as EChartsOption);

          function expectTheSame(option: EChartsOption) {
              const visualMapOptionGotten = option.visualMap as (ContinuousVisualMapOption | PiecewiseVisualMapOption)[];
              expect(visualMapOptionGotten.length).toEqual(1);
              expect(visualMapOptionGotten[0].inRange.color).toEqual(['red', 'blue', 'yellow']);
              expect(visualMapOptionGotten[0].target.inRange.color).toEqual(['red', 'blue', 'yellow']);
              expect(visualMapOptionGotten[0].controller.inRange.color).toEqual(['red', 'blue', 'yellow']);
              done();
          }
      })
  // ── END TARGET TEST ─────────────────────────────
});