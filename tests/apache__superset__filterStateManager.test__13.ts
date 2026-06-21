test('should handle null filter instance gracefully', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'test' },
      };

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn(() => Promise.resolve(null)),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.UNKNOWN);
      expect(result.originalFilterModel).toEqual(filterModel);
    })