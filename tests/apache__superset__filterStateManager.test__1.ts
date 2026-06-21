test('should return empty state when gridRef.current.api is undefined', async () => {
      const gridRef = {
        current: { api: undefined } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      expect(result).toEqual({
        originalFilterModel: {},
        simpleFilters: [],
        complexWhere: undefined,
        havingClause: undefined,
        lastFilteredColumn: undefined,
        inputPosition: FILTER_INPUT_POSITIONS.UNKNOWN,
      });
    })