import { createChart } from '../../../core/utHelper';
import { EChartsType } from '../../../../../src/echarts';
import { getECData } from '../../../../../src/util/innerStore';


describe('matrix_event', () => {
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  // ── TARGET TEST ─────────────────────────────────
  it('should trigger click event on matrix cell when triggerEvent is true', function () {
          const option = {
              matrix: {
                  triggerEvent: true,
                  x: {
                      data: ['A', 'B']
                  },
                  y: {
                      data: ['Y']
                  },
                  body: {
                      data: [
                          { coord: [0, 0], value: 'Cell A' }
                      ]
                  }
              }
          };

          chart.setOption(option);

          let clickedParams: any = null;

          chart.on('click', function (params) {
              clickedParams = params;
          });

          // Find the matrix cell text element
          // Note: Text elements are stored as textContent of their parent Rect, not directly in displayList
          const zr = chart.getZr();
          const displayList = zr.storage.getDisplayList();

          let targetEl;
          for (let i = 0; i < displayList.length; i++) {
              const el = displayList[i];
              const textEcData = getECData(el);
              if (textEcData && textEcData.eventData && textEcData.eventData.name === 'Cell A') {
                  // Found the text element with the specific name
                  targetEl = el;
                  break;
              }
          }

          expect(targetEl).toBeDefined();

          // Trigger click
          zr.trigger('click', {
              target: targetEl,
              offsetX: 10, // Dummy
              offsetY: 10  // Dummy
          });

          expect(clickedParams).not.toBeNull();
          expect(clickedParams.componentType).toEqual('matrix');
          expect(clickedParams.matrixIndex).toEqual(0);
          expect(clickedParams.targetType).toEqual('body');
          expect(clickedParams.name).toEqual('Cell A');
          expect(clickedParams.coord).toEqual([0, 0]);
      })
  // ── END TARGET TEST ─────────────────────────────
});