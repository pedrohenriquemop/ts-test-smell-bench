test('should detect active element in eJoinOrs array', async () => {
      const filterModel = {
        status: {
          filterType: 'text',
          operator: 'OR',
          condition1: { filterType: 'text', type: 'equals', filter: 'active' },
          condition2: { filterType: 'text', type: 'equals', filter: 'pending' },
        },
      };

      const mockInput = document.createElement('input');
      const mockJoinOrGui = document.createElement('div');
      mockJoinOrGui.appendChild(mockInput);

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [
          document.createElement('div'),
          document.createElement('div'),
        ],
        eJoinOrs: [{ eGui: mockJoinOrGui }],
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

      // Mock activeElement in join OR operator
      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockInput,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.lastFilteredColumn).toBe('status');
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.FIRST);
    })