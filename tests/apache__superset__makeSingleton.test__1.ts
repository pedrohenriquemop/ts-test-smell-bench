test('returned function returns same instance across all calls', () => {
      expect(getInstance()).toBe(getInstance());
    })