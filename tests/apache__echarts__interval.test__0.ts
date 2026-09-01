import { createChart, getECModel } from '../../core/utHelper';
import { EChartsType } from '@/src/echarts';
import CartesianAxisModel from '@/src/coord/cartesian/AxisModel';
import IntervalScale from '@/src/scale/Interval';
import { intervalScaleNiceTicks } from '@/src/scale/helper';
import { getPrecisionSafe } from '@/src/util/number';
import { scaleCalcNice2 } from '@/src/coord/axisNiceTicks';
import { NumericAxisBaseOptionCommon, ValueAxisBaseOption } from '@/src/coord/axisCommonTypes';
import { AxisBaseModel } from '@/src/coord/AxisBaseModel';


describe('scale_interval', () => {
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  describe('extreme', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('ticks_min_max', function () {

                const min = 0;
                const max = 54.090909;
                const splitNumber = 5;

                chart.setOption({
                    xAxis: {},
                    yAxis: {
                        type: 'value',
                        min: min,
                        max: max,
                        interval: max / splitNumber,
                        splitNumber: splitNumber
                    },
                    series: [{type: 'line', data: []}]
                });

                const yAxis = getECModel(chart).getComponent('yAxis', 0) as CartesianAxisModel;
                const scale = yAxis.axis.scale;
                const ticks = scale.getTicks();

                expect(ticks[0].value).toEqual(min);
                expect(ticks[ticks.length - 1].value).toEqual(max);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});