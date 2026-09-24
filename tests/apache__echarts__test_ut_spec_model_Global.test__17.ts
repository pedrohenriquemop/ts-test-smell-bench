import { EChartsType } from '@/src/echarts';
import { createChart, getECModel } from '../../core/utHelper';
import { ComponentMainType, ParsedValue } from '@/src/util/types';
import SeriesModel from '@/src/model/Series';
import ComponentModel from '@/src/model/Component';
import ChartView from '@/src/view/Chart';
import { EChartsOption } from '@/src/export/option';

type OriginModelView = {
    model: SeriesModel;
    view: ChartView;
};

describe('modelAndOptionMapping', () => {
  function getData0(chart: EChartsType, seriesIndex: number): ParsedValue {
          return getSeries(chart, seriesIndex).getData().get('y', 0);
      }
  function getSeries(chart: EChartsType, seriesIndex: number): SeriesModel {
          return getECModel(chart).getComponent('series', seriesIndex) as SeriesModel;
      }
  function getModel(chart: EChartsType, type: ComponentMainType, index: number): ComponentModel {
          return getECModel(chart).getComponent(type, index);
      }
  function countSeries(chart: EChartsType): number {
          return countModel(chart, 'series');
      }
  function countModel(chart: EChartsType, type: ComponentMainType): number {
          // FIXME
          // access private
          // @ts-ignore
          return getECModel(chart)._componentsMap.get(type).length;
      }
  function getChartView(chart: EChartsType, series: SeriesModel): ChartView {
          // @ts-ignore
          return chart._chartsMap[series.__viewId];
      }
  function countChartViews(chart: EChartsType): number {
          // @ts-ignore
          return chart._chartsViews.length;
      }
  function saveOrigins(chart: EChartsType): OriginModelView[] {
          const count = countSeries(chart);
          const origins = [];
          for (let i = 0; i < count; i++) {
              const series = getSeries(chart, i);
              origins.push({
                  model: series,
                  view: getChartView(chart, series)
              });
          }
          return origins;
      }
  function modelEqualsToOrigin(
          chart: EChartsType,
          idxList: number[],
          origins: OriginModelView[],
          boolResult: boolean
      ): void {
          for (let i = 0; i < idxList.length; i++) {
              const idx = idxList[i];
              expect(origins[idx].model === getSeries(chart, idx)).toEqual(boolResult);
          }
      }
  function viewEqualsToOrigin(
          chart: EChartsType,
          idxList: number[],
          origins: OriginModelView[],
          boolResult: boolean
      ): void {
          for (let i = 0; i < idxList.length; i++) {
              const idx = idxList[i];
              expect(
                  origins[idx].view === getChartView(chart, getSeries(chart, idx))
              ).toEqual(boolResult);
          }
      }
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  describe('noIdButNameExists', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('differentTypeMergePartialTwoMapOne', function () {
                const option: EChartsOption = {
                    xAxis: {data: ['a']},
                    yAxis: {},
                    series: [
                        {type: 'line', data: [11]},
                        {type: 'line', data: [22], name: 'a'}
                    ]
                };
                chart.setOption(option);

                const option2: EChartsOption = {
                    series: [
                        {type: 'bar', data: [444], name: 'a'},
                        {type: 'line', data: [333]},
                        {type: 'line', data: [222], name: 'a'},
                        {type: 'line', data: [111]}
                    ]
                };
                chart.setOption(option2);
                expect(countChartViews(chart)).toEqual(4);
                expect(countSeries(chart)).toEqual(4);

                expect(getData0(chart, 0)).toEqual(333);
                expect(getData0(chart, 1)).toEqual(444);
                expect(getData0(chart, 2)).toEqual(222);
                expect(getData0(chart, 3)).toEqual(111);
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});