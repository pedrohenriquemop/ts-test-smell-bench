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

  describe('ohters', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('innerId', function () {
                const option: EChartsOption = {
                    xAxis: {data: ['a']},
                    yAxis: {},
                    toolbox: {
                        feature: {
                            dataZoom: {}
                        }
                    },
                    dataZoom: [
                        {type: 'inside', id: 'a'},
                        {type: 'slider', id: 'b'}
                    ],
                    series: [
                        {type: 'line', data: [11]},
                        {type: 'line', data: [22]}
                    ]
                };
                chart.setOption(option);

                expect(countModel(chart, 'dataZoom')).toEqual(4);
                expect(getModel(chart, 'dataZoom', 0).id).toEqual('a');
                expect(getModel(chart, 'dataZoom', 1).id).toEqual('b');

                // Merge
                chart.setOption({
                    dataZoom: [
                        {type: 'slider', id: 'c'},
                        {type: 'slider', name: 'x'}
                    ]
                });

                expect(countModel(chart, 'dataZoom')).toEqual(5);
                expect(getModel(chart, 'dataZoom', 0).id).toEqual('a');
                expect(getModel(chart, 'dataZoom', 1).id).toEqual('b');
                expect(getModel(chart, 'dataZoom', 4).id).toEqual('c');
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});