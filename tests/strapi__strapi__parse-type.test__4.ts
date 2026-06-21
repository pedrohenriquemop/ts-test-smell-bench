it('Supports ISO formats and always returns the right format', () => {
      expect(parseType({ type: 'date', value: '2019-01-01 12:01:11' })).toBe('2019-01-01');

      expect(parseType({ type: 'date', value: '2018-11-02' })).toBe('2018-11-02');

      const isoDateFormat = new Date().toISOString();
      const expectedDateFormat = format(new Date(isoDateFormat), 'yyyy-MM-dd');

      expect(parseType({ type: 'date', value: isoDateFormat })).toBe(expectedDateFormat);
    })