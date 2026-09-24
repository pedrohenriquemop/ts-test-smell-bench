import ComponentModel, { ComponentModelConstructor } from '@/src/model/Component';
import { ComponentMainType } from '@/src/util/types';

const componentModelConstructor = ComponentModel as ComponentModelConstructor;
function extendModel(type: string, dependencies?: string[]) {
    class SubModel extends ComponentModel {
        static type: string = type;
        type: string = type;
        static dependencies = dependencies || [];
    };
    ComponentModel.registerClass(SubModel);
    return SubModel;
}

describe('componentDependency', () => {
  let idx = 0;
  function makeTypes(count: number): string[] {
          const arr = [];
          for (let i = 0; i < count; i++) {
              arr.push('type_' + idx++);
          }
          return arr;
      }
  type TopoResultItem = [ComponentMainType, ComponentMainType[]];

  // ── TARGET TEST ─────────────────────────────────
  it('topologicalTravel_subType', function () {
          const [m1, a1, a2, a3, a4] = makeTypes(5);
          extendModel(m1, [a1, a2]);
          extendModel(a1 + '.aaa', [a2]);
          extendModel(a1 + '.bbb', [a3, a4]);
          extendModel(a2);
          extendModel(a3);
          extendModel(a4);
          const result: TopoResultItem[] = [];
          const allList = componentModelConstructor.getAllClassMainTypes();
          componentModelConstructor.topologicalTravel(
              [m1, a1, a2, a4],
              allList,
              function (componentType, dependencies) {
                  result.push([componentType, dependencies]);
              }
          );
          expect(result).toEqual(
              [[a4, ['dataset']],
              [a2, ['dataset']],
              [a1, ['dataset', a2, a3, a4]],
              [m1, ['dataset', a1, a2]]
          ]);
      })
  // ── END TARGET TEST ─────────────────────────────
});