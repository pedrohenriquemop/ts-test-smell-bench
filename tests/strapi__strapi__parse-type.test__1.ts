it('Handles numerical booleans', () => {
      expect(parseType({ type: 'boolean', value: 1 })).toBe(true);

      expect(parseType({ type: 'boolean', value: 0 })).toBe(false);

      expect(() => parseType({ type: 'boolean', value: 12 })).toThrow();
    })