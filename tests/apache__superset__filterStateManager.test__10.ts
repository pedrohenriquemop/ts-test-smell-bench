test('should handle compound filters correctly', async () => {
      const filterModel = {
        age: {
          filterType: 'number',
          operator: 'AND',
          condition1: {
            filterType: 'number',
            type: 'greaterThanOrEqual',
            filter: 18,
          },
          condition2: { filterType: 'number', type: 'lessThan', filter: 65 },
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

      expect(result.complexWhere).toBe('(age >= 18 AND age < 65)');
    })