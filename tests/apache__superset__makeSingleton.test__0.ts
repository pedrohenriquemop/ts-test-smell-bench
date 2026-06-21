test('returns a function for getting singleton instance of a given base class', () => {
      expect(typeof getInstance).toBe('function');
      expect(getInstance()).toBeInstanceOf(Dog);
    })