test('should handle multiple eJoinAnds elements', async () => {
      const filterModel = {
        score: { filterType: 'number', type: 'greaterThan', filter: 90 },
      };

      const mockInput = document.createElement('input');
      const mockJoinAndGui2 = document.createElement('div');
      mockJoinAndGui2.appendChild(mockInput);

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [document.createElement('div')],
        eJoinAnds: [
          { eGui: document.createElement('div') },
          { eGui: mockJoinAndGui2 },
          { eGui: document.createElement('div') },
        ],
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

      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockInput,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.lastFilteredColumn).toBe('score');
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.FIRST);
    })