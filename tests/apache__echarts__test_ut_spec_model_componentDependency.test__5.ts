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
  it('topologicalTravel_loop', function () {
          const [m1, m2, a1, a2, a3] = makeTypes(5);
          extendModel(m1, [a1, a2]);
          extendModel(m2, [m1, a2]);
          extendModel(a1, [m2, a2, a3]);
          extendModel(a2);
          extendModel(a3);
          const allList = componentModelConstructor.getAllClassMainTypes();
          expect(function () {
              componentModelConstructor.topologicalTravel(
                  [m1, m2, a1],
                  allList,
                  () => {}
              );
          }).toThrowError(/Circular/);
      })
  // ── END TARGET TEST ─────────────────────────────
});