it('Handles string booleans', () => {
      expect(parseType({ type: 'boolean', value: 'true' })).toBe(true);
      expect(parseType({ type: 'boolean', value: 't' })).toBe(true);
      expect(parseType({ type: 'boolean', value: '1' })).toBe(true);

      expect(parseType({ type: 'boolean', value: 'false' })).toBe(false);
      expect(parseType({ type: 'boolean', value: 'f' })).toBe(false);
      expect(parseType({ type: 'boolean', value: '0' })).toBe(false);

      expect(() => parseType({ type: 'boolean', value: 'test' })).toThrow();
    })