it('Always returns the same time format', () => {
      expect(parseType({ type: 'time', value: '12:31:11' })).toBe('12:31:11.000');
      expect(parseType({ type: 'time', value: '12:31:11.2' })).toBe('12:31:11.200');
      expect(parseType({ type: 'time', value: '12:31:11.31' })).toBe('12:31:11.310');
      expect(parseType({ type: 'time', value: '12:31:11.319' })).toBe('12:31:11.319');
    })