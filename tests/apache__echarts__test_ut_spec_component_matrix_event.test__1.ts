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
  it('should not attach eventData when triggerEvent is false (default)', function () {
          const option = {
              matrix: {
                  x: {
                      data: ['A']
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

          const zr = chart.getZr();
          const displayList = zr.storage.getDisplayList();

          let hasEventData = false;
          for (let i = 0; i < displayList.length; i++) {
              const el = displayList[i];
              // Check text content for eventData
              const textContent = el.getTextContent && el.getTextContent();
              if (textContent) {
                  const textEcData = getECData(textContent);
                  if (textEcData && textEcData.eventData && textEcData.eventData.componentType === 'matrix') {
                      hasEventData = true;
                      break;
                  }
              }
          }

          expect(hasEventData).toEqual(false);
      })
  // ── END TARGET TEST ─────────────────────────────
});