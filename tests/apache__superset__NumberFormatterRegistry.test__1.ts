test('creates and returns a new formatter if does not exist', () => {
      const formatter = registry.get('.2f');
      expect(formatter).toBeInstanceOf(NumberFormatter);
      expect(formatter.format(100)).toEqual('100.00');
    })