test('should separate dimension and metric filters', async () => {
      const filterModel = {
        state: { filterType: 'text', type: 'equals', filter: 'CA' },
        'SUM(revenue)': {
          filterType: 'number',
          type: 'greaterThan',
          filter: 1000,
        },
      };

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn(() => Promise.resolve(null)),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, ['SUM(revenue)']);

      // Dimension filter goes to simpleFilters
      expect(result.simpleFilters).toHaveLength(1);
      expect(result.simpleFilters[0].col).toBe('state');

      // Metric filter goes to havingClause
      expect(result.havingClause).toBe('SUM(revenue) > 1000');
    })