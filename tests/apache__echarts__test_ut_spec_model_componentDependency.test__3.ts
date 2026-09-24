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
  it('topologicalTravel_isolate', function () {
          const [m1, a1, a2] = makeTypes(3);
          extendModel(a2);
          extendModel(a1);
          extendModel(m1, [a2]);
          const allList = componentModelConstructor.getAllClassMainTypes();
          const result: TopoResultItem[] = [];
          componentModelConstructor.topologicalTravel(
              [a1, a2, m1],
              allList,
              function (componentType, dependencies) {
                  result.push([componentType, dependencies]);
              }
          );
          expect(result).toEqual([[a1, ['dataset']], [a2, ['dataset']], [m1, ['dataset', a2]]]);
      })
  // ── END TARGET TEST ─────────────────────────────
});