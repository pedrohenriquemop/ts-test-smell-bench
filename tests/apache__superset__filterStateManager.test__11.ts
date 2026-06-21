test('should handle set filters correctly', async () => {
      const filterModel = {
        status: {
          filterType: 'set',
          values: ['active', 'pending', 'approved'],
        },
      };

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn(() => Promise.resolve(null)),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.simpleFilters).toHaveLength(1);
      expect(result.simpleFilters[0]).toEqual({
        col: 'status',
        op: 'IN',
        val: ['active', 'pending', 'approved'],
      });
    })