test('should detect active element in eJoinAnds array', async () => {
      const filterModel = {
        age: {
          filterType: 'number',
          operator: 'AND',
          condition1: { filterType: 'number', type: 'greaterThan', filter: 18 },
          condition2: { filterType: 'number', type: 'lessThan', filter: 65 },
        },
      };

      const mockInput = document.createElement('input');
      const mockJoinAndGui = document.createElement('div');
      mockJoinAndGui.appendChild(mockInput);

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [
          document.createElement('div'),
          document.createElement('div'),
        ],
        eJoinAnds: [{ eGui: mockJoinAndGui }],
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

      // Mock activeElement in join AND operator
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockInput,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.lastFilteredColumn).toBe('age');
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.FIRST);
    })