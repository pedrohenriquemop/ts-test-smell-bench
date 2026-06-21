test('should handle filter instance without eConditionBodies', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'test' },
      };

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        // No eConditionBodies property
      };

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn(() =>
          Promise.resolve(mockFilterInstance),
        ),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.UNKNOWN);
      expect(result.lastFilteredColumn).toBeUndefined();
    })