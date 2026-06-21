test('should check condition bodies before join operators', async () => {
      const filterModel = {
        name: { filterType: 'text', type: 'equals', filter: 'test' },
      };

      const mockInput = document.createElement('input');
      const mockConditionBody2 = document.createElement('div');
      mockConditionBody2.appendChild(mockInput);

      const mockJoinAndGui = document.createElement('div');
      // Input is NOT in join operator, only in condition body

      const mockFilterInstance = {
        eGui: document.createElement('div'),
        eConditionBodies: [document.createElement('div'), mockConditionBody2],
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

      Object.defineProperty(document, 'activeElement', {
        writable: true,
        configurable: true,
        value: mockInput,
      });

      const result = await getCompleteFilterState(gridRef, []);

      expect(result.lastFilteredColumn).toBe('name');
      // Should detect SECOND input position, not from join operator
      expect(result.inputPosition).toBe(FILTER_INPUT_POSITIONS.SECOND);
    })