test('should handle multiple filtered columns and detect the correct one', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'John' },
        age: { filterType: 'number', type: 'greaterThan', filter: 25 },
        status: { filterType: 'text', type: 'equals', filter: 'active' },
      };

      const mockInput = document.createElement('input');
      const mockConditionBodyAge = document.createElement('div');
      mockConditionBodyAge.appendChild(mockInput);

      const mockFilterInstanceName = {
        eGui: document.createElement('div'),
        eConditionBodies: [document.createElement('div')],
      };

      const mockFilterInstanceAge = {
        eGui: document.createElement('div'),
        eConditionBodies: [mockConditionBodyAge],
      };

      const mockFilterInstanceStatus = {
        eGui: document.createElement('div'),
        eConditionBodies: [document.createElement('div')],
      };

      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn((colId: string) => {
          if (colId === 'name') return Promise.resolve(mockFilterInstanceName);
          if (colId === 'age') return Promise.resolve(mockFilterInstanceAge);
          if (colId === 'status')
            return Promise.resolve(mockFilterInstanceStatus);
          return Promise.resolve(null);
        }),
      };

      const gridRef = {
        current: { api: mockApi } as any,
      } as RefObject<AgGridReact>;

      // Mock activeElement in age filter
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockInput,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.lastFilteredColumn).toBe('age');
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.FIRST);
    })