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

  describe('groupLRTB', () => {
    function getOption() {
                return {
                    graphic: [
                        {
                            type: 'text',
                            bottom: 0,
                            right: 0,
                            rotation: Math.PI / 4,
                            style: {
                                font: '24px Microsoft YaHei',
                                text: '全屏右下角'
                            },
                            z: 100
                        },
                        tmpConvertImageOption({
                            id: 'uriimg',
                            type: 'image',
                            originX: 20,
                            originY: 20,
                            left: 10,
                            top: 10,
                            style: {
                                image: imageURI,
                                width: 80,
                                height: 80,
                                opacity: 0.5
                            }
                        }),
                        {
                            type: 'group',
                            id: 'gr',
                            width: 230,
                            height: 110,
                            x: 70,
                            y: 90,
                            children: [
                                {
                                    type: 'rect',
                                    shape: {
                                        width: 230,
                                        height: 80
                                    },
                                    style: {
                                        stroke: 'red',
                                        fill: 'transparent',
                                        lineWidth: 2
                                    },
                                    z: 100
                                },
                                {
                                    type: 'rect',
                                    shape: {
                                        width: 60,
                                        height: 110
                                    },
                                    style: {
                                        stroke: 'red',
                                        fill: 'transparent',
                                        lineWidth: 2
                                    },
                                    z: 100
                                },
                                {
                                    id: 'grouptext',
                                    type: 'text',
                                    bottom: 0,
                                    right: 0,
                                    rotation: 0.5,
                                    style: {
                                        font: '14px Microsoft YaHei',
                                        text: 'group最右下角'
                                    },
                                    z: 100
                                }
                            ]
                        },
                        {
                            type: 'text',
                            bottom: 0,
                            left: 'center',
                            style: {
                                font: '18px sans-serif',
                                text: '全屏最下中间\n这是多行文字\n这是第三行'
                            },
                            z: 100
                        }
                    ]
                };
            }
    function checkLocations(chart: EChartsType, uriimgChanged?: boolean) {

                propHasAll(getGraphicElements(chart, 'graphic'), [
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0
                    },
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: 98.17662350913716,
                        y: 133.02943725152284,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0.7853981633974483,
                        style: {
                            font: '24px Microsoft YaHei',
                            text: '全屏右下角',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */},
                    !uriimgChanged
                        ? tmpConvertImageOption({
                            x: 10,
                            y: 10,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            style: {
                                height: 80,
                                opacity: 0.5,
                                width: 80,
                                image: imageURI
                            }
                        })
                        : tmpConvertImageOption({
                            x: 61,
                            y: 45,
                            scaleX: 1,
                            scaleY: 1,
                            rotation: 0,
                            style: {
                                height: 60,
                                opacity: 0.5,
                                width: 78,
                                image: imageURI
                            }
                        }),
                    {
                        x: 70,
                        y: 90,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0
                    },
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            stroke: 'red',
                            fill: 'transparent',
                            lineWidth: 2
                        },
                        shape: {
                            width: 230,
                            height: 80,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            stroke: 'red',
                            fill: 'transparent',
                            lineWidth: 2
                        },
                        shape: {
                            width: 60,
                            height: 110,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: 145.47972137162424,
                        y: 97.71384413353478,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0.5,
                        style: {
                            font: '14px Microsoft YaHei',
                            text: 'group最右下角',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */},
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: 46,
                        y: 96,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            font: '18px sans-serif',
                            text: '全屏最下中间\n这是多行文字\n这是第三行',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */}
                ]);
            }
    function checkResizedLocations(chart: EChartsType) {
                propHasAll(getGraphicElements(chart, 'graphic'), [
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0
                    },
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: 98.17662350913716,
                        y: 133.02943725152286,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0.7853981633974483,
                        style: {
                            font: '24px Microsoft YaHei',
                            text: '全屏右下角',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */},
                    tmpConvertImageOption({
                        x: 10,
                        y: 10,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            image: imageURI,
                            width: 80,
                            height: 80,
                            opacity: 0.5
                        }
                    }),
                    {
                        x: 70,
                        y: 90,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0
                    },
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            stroke: 'red',
                            fill: 'transparent',
                            lineWidth: 2
                        },
                        shape: {
                            width: 230,
                            height: 80,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            stroke: 'red',
                            fill: 'transparent',
                            lineWidth: 2
                        },
                        shape: {
                            width: 60,
                            height: 110,
                            x: 0,
                            y: 0
                            // r: 0,
                        }
                    },
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: 145.47972137162424,
                        y: 97.71384413353478,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0.5,
                        style: {
                            font: '14px Microsoft YaHei',
                            text: 'group最右下角',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */},
                    {/* FIXME: node-canvas measure issue casue behavior different from browser. comment out it temporarily.
                        x: 46,
                        y: 96,
                        scaleX: 1,
                        scaleY: 1,
                        rotation: 0,
                        style: {
                            font: '18px sans-serif',
                            text: '全屏最下中间\n这是多行文字\n这是第三行',
                            textVerticalAlign: null,
                            verticalAlign: null
                        }
                    */}
                ]);
            }

    // ── TARGET TEST ─────────────────────────────────
    it('getAndGet', function () {
                const myChart = createChart({
                    width: 200,
                    height: 150
                });
                myChart.setOption(getOption());

                checkLocations(myChart);
                // Set option using getOption
                chart.setOption(myChart.getOption());
                // Check again, should be the same as before.
                checkLocations(myChart);

                myChart.dispose();
            })
    // ── END TARGET TEST ─────────────────────────────
  });
});