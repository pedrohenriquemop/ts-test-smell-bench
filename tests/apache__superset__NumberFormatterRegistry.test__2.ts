test('returns an existing formatter if already exists', () => {
      const formatter = registry.get('.2f');
      const formatter2 = registry.get('.2f');
      expect(formatter).toBe(formatter2);
    })