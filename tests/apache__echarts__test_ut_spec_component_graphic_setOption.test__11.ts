import { createChart, getGraphicElements, getECModel } from '../../../core/utHelper';
import { EChartsType } from '../../../../../src/echarts';
import Element from 'zrender/src/Element';
import { EChartsOption } from '../../../../../src/export/option';
import {
    GraphicComponentOption,
    GraphicComponentImageOption
} from '../../../../../src/component/graphic/GraphicModel';
import Group from 'zrender/src/graphic/Group';
import { Dictionary } from 'zrender/src/core/types';

const imageURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAADcCAYAAAAbWs+BAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gIUARQAHY8+4wAAApBJREFUeNrt3cFqAjEUhlEjvv8rXzciiiBGk/He5JxdN2U649dY+KmnEwAAAAAv2uMXEeGOwERntwAEB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4EBwgOCgpkuKq2it/r8Li2hbvGKqP6s/PycnHHv9YvSWEgQHCA4EBwgOBAeCAwQHggMEByXM+QRUE6D3suwuPafDn5MTDg50KXnVPSdxa54y/oYDwQGCA8EBggPBAYIDwYHggBE+X5rY3Y3Tey97Nn2eU+rnlGfaZa6Ft5SA4EBwgOBAcCA4QHAgOEBwIDjgZu60y1xrDPtIJxwgOBAcIDgQHAgOEBwIDhAcCA4EBwgOBAcIDgQHCA4EB4IDBAeCAwQHggPBAYIDwQGCA8GB4ADBgeAAwYHgAMGB4GADcz9y2McIgxMOBAeCAwQHggMEB4IDwQGCA8EBggPBATdP6+KIGPRdW7i1LCFi6ALfCQfeUoLgAMGB4ADBgeBAcIDgQHCA4CCdOVvK7quwveQgg7eRTjjwlhIQHAgOBAcIDgQHCA4EB4IDBAfl5dhSdl+17SX3F22rdLlOOBAcCA4QHAgOEBwIDgQHCA4EBwgO0qm5pez6Ce0uSym2jXTCgeAAwYHgQHCA4EBwgOBAcCA4QHBQ3vpbyu47Yns51OLbSCccCA4QHAgOBAcIDgQHCA4EB4ID5jDt+vkObjgFM9dywoHgAMGB4EBwgOBAcIDgQHAgOEBwsA5bysPveMLtpW2kEw4EBwgOBAcIDgQHggMEB4IDBAeCg33ZUqZ/Ql9sL20jnXCA4EBwIDhAcCA4QHAgOBAcIDgQHNOZai3DlhKccCA4QHAgOEBwIDgQHCA4AAAAAGA1VyxaWIohrgXFAAAAAElFTkSuQmCC';
function tmpConvertImageOption(opt: GraphicComponentImageOption): object {
    const outOpt = opt as Dictionary<unknown>;
    outOpt.type = 'rect';
    const style = opt.style || {};
    delete style.image;
    outOpt.shape = {
        x: style.x || 0,
        y: style.y || 0,
        width: style.width || 0,
        height: style.height || 0
    };
    return outOpt;
}

describe('graphic_setOption', () => {
  const NUMBER_PRECISION = 6;
  function propHasAll(els: Element[], propsObjList: object[]) {
          for (let i = 0; i < propsObjList.length; i++) {
              propHas(els[i], propsObjList[i]);
          }
      }
  function propHas(target: object, propsObj: object): void {
          if (target == null || propsObj == null) {
              expect(false).toEqual(true);
          }
          expect(typeof target === 'object' && typeof propsObj === 'object').toEqual(true);

          // propsObj can be array
          if (propsObj instanceof Array) {
              expect(target instanceof Array).toEqual(true);
              for (let i = 0; i < propsObj.length; i++) {
                  each((target as Element[])[i], propsObj[i], i);
              }
          }
          else {
              for (const name in propsObj) {
                  if (propsObj.hasOwnProperty(name)) {
                      each((target as any)[name], (propsObj as any)[name], name);
                  }
              }
          }

          function each(targetVal: unknown, propVal: unknown, keyInfo: string | number): void {
              // console.log(targetVal, propVal, keyInfo);
              if (propVal == null) {
                  expect(targetVal == null).toEqual(true);
              }
              // object or array
              else if (typeof propVal === 'object') {
                  propHas(targetVal as object, propVal);
              }
              else if (typeof propVal === 'number') {
                  expect(typeof targetVal).toEqual('number');
                  expect((targetVal as number).toFixed(NUMBER_PRECISION)).toEqual(propVal.toFixed(NUMBER_PRECISION));
              }
              else {
                  expect(targetVal).toStrictEqual(propVal);
              }
          }
      }
  let chart: EChartsType;
  beforeEach(function () {
          chart = createChart();
      });
  afterEach(function () {
          chart.dispose();
      });

  describe('boundingAndRotation', () => {
    function getOption(): EChartsOption {
                return {
                    legend: {
                        data: ['高度(km)与气温(°C)变化关系']
                    },
                    xAxis: {
                    },
                    yAxis: {
                        type: 'category',
                        data: ['0', '10', '20', '30', '40', '50', '60', '70', '80']
                    },
                    graphic: [
                        tmpConvertImageOption({
                            type: 'image',
                            id: 'img',
                            z: -10,
                            right: 0,
                            top: 0,
                            bounding: 'raw',
                            originX: 75,
                            originY: 75,
                            style: {
                                fill: '#000',
                                image: imageURI,
                                width: 150,
                                height: 150,
                                opacity: 0.4
                            } as any
                        }),
                        {
                            type: 'group',
                            id: 'rectgroup1',
                            bottom: 0,
                            right: 0,
                            bounding: 'raw',
                            children: [
                                {
                                    type: 'rect',
                                    left: 'center',
                                    top: 'center',
                                    shape: {
                                        width: 20,
                                        height: 80
                                    },
                                    style: {
                                        stroke: 'green',
                                        fill: 'transparent'
                                    }
                                },
                                {
                                    type: 'rect',
                                    left: 'center',
                                    top: 'center',
                                    shape: {
                                        width: 80,
                                        height: 20
                                    },
                                    style: {
                                        stroke: 'green',
                                        fill: 'transparent'
                                    }
                                }
                            ]
                        },
                        {
                            type: 'rect',
                            id: 'rect2',
                            bottom: 0,
                            right: 'center',
                            shape: {
                                width: 50,
                                height: 80
                            },
                            style: {
                                stroke: 'green',
                                fill: 'transparent'
                            }
                        },
                        {
                            type: 'group',
                            id: 'textGroup1',
                            left: '10%',
                            top: 'center',
                            scaleX: 1,
                            scaleY: 0.5,
                            children: [
                                {
                                    type: 'rect',
                                    z: 100,
                                    left: 'center',
                                    top: 'center',
                                    shape: {
                                        width: 170,
                                        height: 70
                                    },
                                    style: {
                                        fill: '#fff',
                                        stroke: '#999',
                                        lineWidth: 2,
                                        shadowBlur: 8,
                                        shadowOffsetX: 3,
                                        shadowOffsetY: 3,
                                        shadowColor: 'rgba(0,0,0,0.3)'
                                    }
                                },
                                {
                                    type: 'text',
                                    z: 100,
                                    top: 'middle',
                                    left: 'center',
                                    style: {
                                        text: [
                                            '横轴表示温度，单位是°C',
                                            '纵轴表示高度，单位是km',
                                            '右上角有一个图片做的水印'
                                        ].join('\n'),
                                        font: '12px Microsoft YaHei'
                                    }
                                }
                            ]
                        }
                    ],
                    series: [
                        {
                            name: '高度(km)与气温(°C)变化关系',
                            type: 'line',
                            data: [15, -50, -56.5, -46.5, -22.1, -2.5, -27.7, -55.7, -76.5]
                        }
                    ]
                };
            }
    function checkLocations(chart: EChartsType, rotated?: boolean) {
                propHasAll(getGraphicElements(chart, 'graphic'), [
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0
                    },
                    tmpConvertImageOption({
                        x: 350,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: !rotated ? 0 : 0.6283185307179586,
                        style: {
                            // fill: '#000',
                            image: imageURI,
                            width: 150,
                            height: 150,
                            opacity: 0.4
                        }
                    }),
                    {
                        x: 500,
                        y: 400,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: !rotated ? 0 : 0.6283185307179586
                    },
                    {
                        x: -10,
                        y: -40,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            stroke: 'green',
                            fill: 'transparent'
                        },
                        shape: {
                            width: 20,
                            height: 80,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {
                        x: -40,
                        y: -10,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            stroke: 'green',
                            fill: 'transparent'
                        },
                        shape: {
                            width: 80,
                            height: 20,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {
                        x: !rotated ? 225 : 206.2631650489274,
                        y: !rotated ? 319.5 : 334.5802393266705,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: !rotated ? 0 : 0.6283185307179586,
                        style: {
                            stroke: 'green',
                            fill: 'transparent'
                        },
                        shape: {
                            width: 50,
                            height: 80,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {
                        x: !rotated ? 136 : 130.15559605751,
                        y: 200,
                        scaleX: 1,
                        scaleY: 0.5,
                        rotation: !rotated ? 0 : 0.6283185307179586
                    },
                    {
                        x: -85,
                        y: -35,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            fill: '#fff',
                            stroke: '#999',
                            lineWidth: 2,
                            shadowBlur: 8,
                            shadowOffsetX: 3,
                            shadowOffsetY: 3,
                            shadowColor: 'rgba(0,0,0,0.3)'
                        },
                        shape: {
                            width: 170,
                            height: 70,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: -72,
                        y: -18,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            text: '横轴表示温度，单位是°C\n纵轴表示高度，单位是km\n右上角有一个图片做的水印',
                            font: '12px Microsoft YaHei',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */}
                ]);
            }

    // ── TARGET TEST ─────────────────────────────────
    it('bounding', function () {


                chart.setOption(getOption());

                checkLocations(chart);

                // Set option using getOption
                chart.setOption(chart.getOption());

                // Check again, should be the same as before.
                checkLocations(chart);

                const rotation = Math.PI / 5;

                chart.setOption({
                    graphic: [{
                        id: 'img',
                        bounding: 'raw',
                        originX: 75,
                        originY: 75,
                        rotation: rotation
                    } as any, {
                        id: 'rectgroup1',
                        rotation: rotation
                    }, {
                        id: 'rect2',
                        rotation: rotation
                    }, {
                        id: 'textGroup1',
                        rotation: rotation
                    }]
                });

                checkLocations(chart, true);

            })
    // ── END TARGET TEST ─────────────────────────────
  });
});