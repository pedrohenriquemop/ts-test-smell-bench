test('should return unknown position when active element is not in any condition body', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'test' },
      };

      const mockConditionBody = document.createElement('div');
      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [mockConditionBody],
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

      // Mock activeElement as something outside the filter
      const outsideElement = document.createElement('div');
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: outsideElement,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.UNKNOWN);
      expect(result.lastFilteredColumn).toBeUndefined();
    })