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
    it('timeline_setOptionOnceMore_substitudeTimelineOptions', function () {
                const option: EChartsOption = {
                    baseOption: {
                        timeline: {
                            axisType: 'category',
                            autoPlay: false,
                            playInterval: 1000,
                            currentIndex: 2
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
                    }, {
                        series: [
                            { type: 'line', data: [1111] },
                            { type: 'line', data: [2222] }
                        ]
                    }]
                };
                chart.setOption(option);

                let ecModel = getECModel(chart);
                expect(getData0(chart, 0)).toEqual(1111);
                expect(getData0(chart, 1)).toEqual(2222);

                chart.setOption({
                    baseOption: {
                        backgroundColor: '#987654',
                        xAxis: {data: ['b']}
                    },
                    options: [{
                        series: [
                            { type: 'line', data: [55] },
                            { type: 'line', data: [66] }
                        ]
                    }, {
                        series: [
                            { type: 'line', data: [555] },
                            { type: 'line', data: [666] }
                        ]
                    }]
                });

                ecModel = getECModel(chart);
                const optionGotten = ecModel.getOption();
                expect(optionGotten.backgroundColor).toEqual('#987654');
                expect(getData0(chart, 0)).toEqual(1111);
                expect(getData0(chart, 1)).toEqual(2222);

                chart.setOption<EChartsOption>({
                    timeline: {
                        currentIndex: 0
                    }
                });

                expect(getData0(chart, 0)).toEqual(55);
                expect(getData0(chart, 1)).toEqual(66);

                chart.setOption<EChartsOption>({
                    timeline: {
                        currentIndex: 2
                    }
                });

                // no 1111 2222 any more, replaced totally by new timeline.
                expect(getData0(chart, 0)).toEqual(55);
                expect(getData0(chart, 1)).toEqual(66);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});