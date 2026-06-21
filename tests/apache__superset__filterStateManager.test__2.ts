test('should convert simple filters correctly', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'John' },
        age: { filterType: 'number', type: 'greaterThan', filter: 25 },
      };

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn(() => Promise.resolve(null)),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.originalFilterModel).toEqual(filterModel);
      expect(result.simpleFilters).toHaveLength(2);
      expect(result.simpleFilters[0]).toEqual({
        col: 'name',
        op: '=',
        val: 'John',
      });
      expect(result.simpleFilters[1]).toEqual({
        col: 'age',
        op: '>',
        val: 25,
      });
    })