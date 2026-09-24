import SeriesDimensionDefine from '@/src/data/SeriesDimensionDefine';
import createDimensions from '@/src/data/helper/createDimensions';
import { createSource } from '@/src/data/Source';
import { SOURCE_FORMAT_ARRAY_ROWS, SERIES_LAYOUT_BY_COLUMN } from '@/src/util/types';

type ParametersOfCreateDimensions = Parameters<typeof createDimensions>;

describe('createDimensions', () => {
  function doCreateDimensions(
          source: ParametersOfCreateDimensions[0],
          opt: ParametersOfCreateDimensions[1]
      ): SeriesDimensionDefine[] {
          const result = createDimensions(source, opt);
          for (let i = 0; i < result.dimensions.length; i++) {
              const item = result.dimensions[i];
              if (item && item.hasOwnProperty('dimsDef') && (item as any).dimsDef == null) {
                  delete (item as any).dimsDef;
              }
          }
          return result.dimensions;
      }

  // ── TARGET TEST ─────────────────────────────────
  it('differentData', function () {
          function doTest(
              source: ParametersOfCreateDimensions[0],
              opt: ParametersOfCreateDimensions[1],
              result: SeriesDimensionDefine[]
          ) {
              expect(doCreateDimensions(source, opt)).toEqual(result.map(a => new SeriesDimensionDefine(a)));
          }

          // test dimcount
          doTest([], { coordDimensions: ['x', 'y']}, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              },
              {
                  'otherDims': {},
                  'coordDim': 'y',
                  'coordDimIndex': 0,
                  'name': 'y',
                  'storeDimIndex': 1
              }
          ]);

          doTest([12], { coordDimensions: ['x', 'y']}, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              },
              {
                  'otherDims': {},
                  'coordDim': 'y',
                  'coordDimIndex': 0,
                  'name': 'y',
                  'storeDimIndex': 1
              }
          ]);

          doTest([12, 4], { coordDimensions: ['x', 'y']}, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              },
              {
                  'otherDims': {},
                  'coordDim': 'y',
                  'coordDimIndex': 0,
                  'name': 'y',
                  'storeDimIndex': 1
              }
          ]);

          doTest([[32, 55]], { coordDimensions: ['x']}, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              }
          ]);

          doTest([[32, 55]], { coordDimensions: ['x', 'y', 'z']}, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              },
              {
                  'otherDims': {},
                  'coordDim': 'y',
                  'coordDimIndex': 0,
                  'name': 'y',
                  'storeDimIndex': 1
              },
              {
                  'otherDims': {},
                  'coordDim': 'z',
                  'coordDimIndex': 0,
                  'name': 'z',
                  'storeDimIndex': 2
              }
          ]);

          doTest([[32, 55], [99, 11]], { coordDimensions: ['x']}, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              }
          ]);

          doTest([[32, 55], [99, 11]], {
              dimensionsCount: 4,
              coordDimensions: ['x', 'y']
          }, [
              {
                  'otherDims': {},
                  'coordDim': 'x',
                  'coordDimIndex': 0,
                  'name': 'x',
                  'storeDimIndex': 0
              },
              {
                  'otherDims': {},
                  'coordDim': 'y',
                  'coordDimIndex': 0,
                  'name': 'y',
                  'storeDimIndex': 1
              },
              {
                  'otherDims': {},
                  'coordDim': 'value',
                  'coordDimIndex': 0,
                  'isExtraCoord': true,
                  'name': 'value',
                  'storeDimIndex': 2
              },
              {
                  'otherDims': {},
                  'coordDim': 'value0',
                  'coordDimIndex': 0,
                  'isExtraCoord': true,
                  'name': 'value0',
                  'storeDimIndex': 3
              }
          ]);
      })
  // ── END TARGET TEST ─────────────────────────────
});