import { init, use, EChartsType } from '@/src/export/core';
import {
    PieChart
} from '@/src/export/charts';
import {
    TitleComponent
} from '@/src/export/components';
import {
    CanvasRenderer
} from '@/src/export/renderers';
import { EChartsOption } from '@/src/export/option';

use([PieChart, TitleComponent, CanvasRenderer]);
function createChart(theme?: object): EChartsType {
    const el = document.createElement('div');
    Object.defineProperty(el, 'clientWidth', {
        get() {
            return 500;
        }
    });
    Object.defineProperty(el, 'clientHeight', {
        get() {
            return 400;
        }
    });
    const chart = init(el, theme);
    return chart;
}
;
function makeComponentError(componentName: string, componentImportName: string) {
    return `[ECharts] Component ${componentName} is used but not imported.
import { ${componentImportName} } from 'echarts/components';
echarts.use([${componentImportName}]);`;
}
function makeSerieError(seriesName: string, seriesImportName: string) {
    return `[ECharts] Series ${seriesName} is used but not imported.
import { ${seriesImportName} } from 'echarts/charts';
echarts.use([${seriesImportName}]);`;
}

describe('model_componentMissing', () => {
  const oldConsoleErr = console.error;

  // ── TARGET TEST ─────────────────────────────────
  it('Should not report pie series missing error', function () {
          const chart = createChart();
          console.error = jest.fn();
          chart.setOption<EChartsOption>({
              series: [{
                  type: 'pie'
              }]
          });
          expect(console.error).not.toBeCalled();
          console.error = oldConsoleErr;
      })
  // ── END TARGET TEST ─────────────────────────────
});