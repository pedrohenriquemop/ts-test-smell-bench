test('should maintain filter model reference integrity', async () => {
      const originalFilterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'test' },
      };

      const mockApi = {
        getFilterModel: jest.fn(() => originalFilterModel),
        getColumnFilterInstance: jest.fn(() => Promise.resolve(null)),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      const result = await getCompleteFilterState(gridRef, []);

      // Should return the same reference
      expect(result.originalFilterModel).toBe(originalFilterModel);
    })