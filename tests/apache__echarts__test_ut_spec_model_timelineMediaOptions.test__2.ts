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
    it('parse_media_no_baseOption_no_default', function () {
                const option: EChartsOption = {
                    xAxis: { data: ['a'] },
                    yAxis: {},
                    legend: { left: 10 },
                    series: { name: 'a', type: 'line', data: [11] },
                    media: [{
                        query: { maxWidth: 670, minWidth: 550 },
                        option: {
                            legend: { left: 50 }
                        }
                    }]
                };
                chart.setOption(option);
                expect(getLegendOption(chart).left).toEqual(10);

                chart.resize({ width: 600 });
                expect(getLegendOption(chart).left).toEqual(50);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});