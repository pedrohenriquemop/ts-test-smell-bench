test('should detect second input position when active element is in second condition body', async () => {
      const filterModel = {
        age: {
          filterType: 'number',
          operator: 'AND',
          condition1: { filterType: 'number', type: 'greaterThan', filter: 18 },
          condition2: { filterType: 'number', type: 'lessThan', filter: 65 },
        },
      };

      const mockInput = document.createElement('input');
      const mockConditionBody1 = document.createElement('div');
      const mockConditionBody2 = document.createElement('div');
      mockConditionBody2.appendChild(mockInput);

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [mockConditionBody1, mockConditionBody2],
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

      expect(result.lastFilteredColumn).toBe('age');
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.SECOND);
    })