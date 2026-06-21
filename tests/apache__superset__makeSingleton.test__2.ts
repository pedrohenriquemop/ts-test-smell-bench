test('returns a function for getting singleton instance of a given base class constructed with the given arguments', () => {
      expect(typeof getInstance).toBe('function');
      expect(getInstance()).toBeInstanceOf(Dog);
      expect(getInstance().name).toBe('Doug');
    })