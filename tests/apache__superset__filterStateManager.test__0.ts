test('should return empty state when gridRef.current is null', async () => {
      const gridRef = { current: null } as RefObject<AgGridReact>;

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