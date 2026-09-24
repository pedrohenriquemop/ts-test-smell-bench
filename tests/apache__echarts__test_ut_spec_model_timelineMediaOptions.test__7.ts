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

  describe('parse_timeline_media_option', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('parse_timeline_has_baseOption_compat', function () {
                const option: EChartsOption = {
                    timeline: { axisType: 'category' },
                    baseOption: {
                        xAxis: { data: ['a'] },
                        yAxis: {},
                        legend: {},
                        series: { name: 'a', type: 'line', data: [11] }
                    },
                    legend: { right: 123 }, // Illegal, should be ignored
                    options: [
                        { series: { type: 'line', data: [88] } },
                        { series: { type: 'line', data: [99] } }
                    ]
                };
                chart.setOption(option);
                expect(getData0(chart, 0)).toEqual(88);
                expect(getLegendOption(chart).right).not.toEqual(123);
                expect(getTimelineComponent(chart) != null).toEqual(true);

                chart.setOption<EChartsOption>({ timeline: { currentIndex: 1 } });
                expect(getData0(chart, 0)).toEqual(99);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});