it('Throws on  invalid time format', () => {
      expect(() => parseType({ type: 'time', value: '25:12:09' })).toThrow();
      expect(() => parseType({ type: 'time', value: '23:78:09' })).toThrow();
      expect(() => parseType({ type: 'time', value: '23:11:99' })).toThrow();

      expect(() => parseType({ type: 'time', value: '12:12' })).toThrow();
      expect(() => parseType({ type: 'time', value: 'test' })).toThrow();
      expect(() => parseType({ type: 'time', value: 122 })).toThrow();
      expect(() => parseType({ type: 'time', value: {} })).toThrow();
      expect(() => parseType({ type: 'time', value: [] })).toThrow();
    })