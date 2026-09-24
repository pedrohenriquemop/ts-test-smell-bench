import { EChartsType } from '@/src/echarts';
import SeriesModel from '@/src/model/Series';
import { ParsedValue } from '@/src/util/types';
import { LegendOption } from '@/src/component/legend/LegendModel';
import TimelineModel from '@/src/component/timeline/TimelineModel';
import { createChart, getECModel } from '../../core/utHelper';
import { EChartsOption } from '@/src/export/option';


describe('timelineMediaOptions', () => {
  function getData0(chart: EChartsType, seriesIndex: number): ParsedValue {
          return getSeries(chart, seriesIndex).getData().get('y', 0);
      }
  function getSeries(chart: EChartsType, seriesIndex: number): SeriesModel {
          return getECModel(chart).getComponent('series', seriesIndex) as SeriesModel;
      }
  function getLegendOption(chart: EChartsType): LegendOption {
          return getECModel(chart).getComponent('legend', 0).option as LegendOption;
      }
  function getTimelineComponent(chart: EChartsType): TimelineModel {
          return getECModel(chart).getComponent('timeline', 0) as TimelineModel;
      }
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart({
              width: 10,
              height: 10
          });
      });
  afterEach(function () {
          chart.dispose();
      });

  describe('timeline_onceMore', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('timeline_setOptionOnceMore_baseOption', function () {
                const option: EChartsOption = {
                    baseOption: {
                        timeline: {
                            axisType: 'category',
                            autoPlay: false,
                            playInterval: 1000
                        },
                        xAxis: {data: ['a']},
                        yAxis: {}
                    },
                    options: [{
                        series: [
                            { type: 'line', data: [11] },
                            { type: 'line', data: [22] }
                        ]
                    }, {
                        series: [
                            { type: 'line', data: [111] },
                            { type: 'line', data: [222] }
                        ]
                    }]
                };
                chart.setOption(option);

                expect(getData0(chart, 0)).toEqual(11);
                expect(getData0(chart, 1)).toEqual(22);

                chart.setOption({
                    xAxis: {data: ['b']}
                });

                expect(getData0(chart, 0)).toEqual(11);
                expect(getData0(chart, 1)).toEqual(22);

                chart.setOption<EChartsOption>({
                    xAxis: {data: ['c']},
                    timeline: {
                        currentIndex: 1
                    }
                });

                expect(getData0(chart, 0)).toEqual(111);
                expect(getData0(chart, 1)).toEqual(222);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});