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

  describe('option', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('optionFlatten', function () {
                chart.setOption({
                    graphic: [
                        tmpConvertImageOption({
                            id: 'uriimg',
                            type: 'image',
                            name: 'nameuriimg',
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
                                    name: 'rectxx',
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
                                    id: 'grouptext',
                                    type: 'text',
                                    bottom: 0,
                                    right: 0,
                                    rotation: 0.5,
                                    style: {
                                        text: 'aaa'
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
                                text: 'bbb'
                            },
                            z: 100
                        }
                    ]
                });

                // Set option using getOption
                const option = chart.getOption();
                const graphicOptionList = option.graphic as GraphicComponentOption[];

                expect(graphicOptionList.length === 1).toEqual(true);
                const optionElements = graphicOptionList[0].elements;
                expect(optionElements && optionElements.length === 5).toEqual(true);

                expect(optionElements[0].id === 'uriimg' && optionElements[0].parentId == null).toEqual(true);
                expect(optionElements[1].id === 'gr' && optionElements[1].parentId == null).toEqual(true);
                expect(optionElements[2].name === 'rectxx' && optionElements[2].parentId === 'gr').toEqual(true);
                expect((optionElements[3] as any).style.text === 'aaa' && optionElements[3].parentId === 'gr')
                    .toEqual(true);
                expect((optionElements[4] as any).style.text === 'bbb' && optionElements[4].parentId == null)
                    .toEqual(true);

            })
    // ── END TARGET TEST ─────────────────────────────
    function getDeleteSourceOption() {
                return {
                    graphic: [
                        {
                            type: 'text',
                            name: 'textname',
                            style: {
                                text: 'asdf哈呵',
                                font: '40px sans-serif',
                                x: 100,
                                y: 40
                            }
                        },
                        {
                            id: 'rrr',
                            name: 'ringname',
                            type: 'ring',
                            shape: {
                                cx: 50,
                                cy: 150,
                                r: 20,
                                r0: 5
                            }
                        },
                        {
                            id: 'xxx',
                            name: 'rectname',
                            type: 'rect',
                            shape: {
                                x: 250,
                                y: 50,
                                width: 20,
                                height: 80
                            }
                        }
                    ]
                };
            }
    function checkDeteteSource(chart: EChartsType) {
                const els = getGraphicElements(chart, 'graphic');
                expect(els.length === 4);
                expect(els[1].type === 'text' && els[1].name === 'textname').toEqual(true);
                expect(els[2].type === 'ring' && els[2].name === 'ringname').toEqual(true);
                expect(els[3].type === 'rect' && els[3].name === 'rectname').toEqual(true);
            }
    function checkMergeElements(chart: EChartsType, merged: boolean): void {
                const makeIdentityTransformProps = () => ({
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    rotation: 0
                });
                propHasAll(getGraphicElements(chart, 'graphic'), [
                    {
                        ...makeIdentityTransformProps()
                    },
                    {
                        ...makeIdentityTransformProps(),
                        style: {},
                        shape: {
                            x: !merged ? 250 : 350,
                            y: 50,
                            width: 20,
                            height: 80
                            // r: 0
                        }
                    },
                    {
                        ...makeIdentityTransformProps()
                    },
                    {
                        ...makeIdentityTransformProps(),
                        style: {
                            fill: !merged ? 'yellow' : 'pink'
                        },
                        shape: {
                            x: 30,
                            y: 30,
                            width: 10,
                            height: 20
                            // r: 0
                        }
                    },
                    {
                        ...makeIdentityTransformProps(),
                        style: !merged
                            ? {}
                            : {
                                fill: 'green'
                            },
                        shape: {
                            cx: !merged ? 50 : 150,
                            cy: 150,
                            r: 20,
                            r0: 5
                        }
                    }
                ]);
            }
  });
});