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
  it('topologicalTravel_missingSomeNodeButHasDependencies', function () {
          const [m1, a1, a2, a3, a4] = makeTypes(5);
          extendModel(m1, [a1, a2]);
          extendModel(a2, [a3]);
          extendModel(a3);
          extendModel(a4);
          let result: TopoResultItem[] = [];
          let allList = componentModelConstructor.getAllClassMainTypes();
          componentModelConstructor.topologicalTravel(
              [a3, m1],
              allList,
              function (componentType, dependencies) {
                  result.push([componentType, dependencies]);
              }
          );
          expect(result).toEqual([[a3, ['dataset']], [a2, ['dataset', a3]], [m1, ['dataset', a1, a2]]]);
          result = [];
          allList = componentModelConstructor.getAllClassMainTypes();
          componentModelConstructor.topologicalTravel(
              [m1, a3],
              allList,
              function (componentType, dependencies) {
                  result.push([componentType, dependencies]);
              }
          );
          expect(result).toEqual([[a3, ['dataset']], [a2, ['dataset', a3]], [m1, ['dataset', a1, a2]]]);
      })
  // ── END TARGET TEST ─────────────────────────────
});