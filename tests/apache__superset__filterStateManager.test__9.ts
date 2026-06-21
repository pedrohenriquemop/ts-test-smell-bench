test('should handle empty filter model', async () => {
      const filterModel = {};

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn(() => Promise.resolve(null)),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.originalFilterModel).toEqual({});
      expect(result.simpleFilters).toEqual([]);
      expect(result.complexWhere).toBeUndefined();
      expect(result.havingClause).toBeUndefined();
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.UNKNOWN);
    })