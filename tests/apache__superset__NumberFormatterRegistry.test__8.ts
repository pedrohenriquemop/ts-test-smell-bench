test('return the value with the specified format', () => {
      expect(registry.format('.2f', 100)).toEqual('100.00');
      expect(registry.format(',d', 100)).toEqual('100');
    })