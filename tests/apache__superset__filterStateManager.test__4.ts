test('should detect first input position when active element is in first condition body', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'test' },
      };

      const mockInput = document.createElement('input');
      const mockConditionBody1 = document.createElement('div');
      mockConditionBody1.appendChild(mockInput);

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [mockConditionBody1],
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

      // Mock activeElement
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockInput,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.lastFilteredColumn).toBe('name');
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.FIRST);
    })