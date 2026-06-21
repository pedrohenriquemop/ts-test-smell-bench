test('should break detection loop after finding active element', async () => {
      const filterModel = {
        col1: { filterType: 'text', type: 'equals', filter: 'a' },
        col2: { filterType: 'text', type: 'equals', filter: 'b' },
        col3: { filterType: 'text', type: 'equals', filter: 'c' },
      };

      const mockInput = document.createElement('input');
      const mockConditionBody = document.createElement('div');
      mockConditionBody.appendChild(mockInput);

      let callCount = 0;
      const mockApi = {
        getFilterModel: jest.fn(() => filterModel),
        getColumnFilterInstance: jest.fn((colId: string) => {
          callCount += 1;
          // Return match on col2
          if (colId === 'col2') {
            return Promise.resolve({
              eGui: document.createElement('div'),
              eConditionBodies: [mockConditionBody],
            });
          }
          return Promise.resolve({
            eGui: document.createElement('div'),
            eConditionBodies: [document.createElement('div')],
          });
        }),
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

      expect(result.lastFilteredColumn).toBe('col2');
      // Should not call getColumnFilterInstance for col3 after finding match
      expect(callCount).toBeLessThanOrEqual(2);
    })