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

  describe('idSpecified', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('nameTheSameButIdNotTheSame', function () {

                const option = {
                    grid: {},
                    xAxis: [
                        {id: 'x1', name: 'a', xxxx: 'x1_a'},
                        {id: 'x2', name: 'b', xxxx: 'x2_b'}
                    ],
                    yAxis: {}
                };

                chart.setOption(option);

                let xAxisModel0;
                let xAxisModel1;

                xAxisModel0 = getModel(chart, 'xAxis', 0);
                xAxisModel1 = getModel(chart, 'xAxis', 1);
                expect((xAxisModel0.option as any).xxxx).toEqual('x1_a');
                expect((xAxisModel1.option as any).xxxx).toEqual('x2_b');
                expect(xAxisModel1.option.name).toEqual('b');

                const option2 = {
                    xAxis: [
                        {id: 'k1', name: 'a', xxxx: 'k1_a'},
                        {id: 'x2', name: 'a', xxxx: 'x2_a'}
                    ]
                };
                chart.setOption(option2);

                xAxisModel0 = getModel(chart, 'xAxis', 0);
                xAxisModel1 = getModel(chart, 'xAxis', 1);
                const xAxisModel2 = getModel(chart, 'xAxis', 2);
                expect((xAxisModel0.option as any).xxxx).toEqual('x1_a');
                expect((xAxisModel1.option as any).xxxx).toEqual('x2_a');
                expect(xAxisModel1.option.name).toEqual('a');
                expect((xAxisModel2.option as any).xxxx).toEqual('k1_a');
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});