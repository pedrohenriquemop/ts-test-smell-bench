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
  it('setOpacityWhenUseColor', function (done) {
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

          const visualMapOptionGotten = chart.getOption().visualMap as (
              ContinuousVisualMapOption | PiecewiseVisualMapOption
          )[];
          expect(!!visualMapOptionGotten[0].target.outOfRange.opacity).toEqual(true);
          done();
      })
  // ── END TARGET TEST ─────────────────────────────
});