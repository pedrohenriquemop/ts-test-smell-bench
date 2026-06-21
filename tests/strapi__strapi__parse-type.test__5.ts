it('Throws on invalid formator dates', () => {
      expect(() => parseType({ type: 'date', value: '-1029-11-02' })).toThrow(
        'Invalid format, expected an ISO compatible date'
      );
      expect(() => parseType({ type: 'date', value: '2019-13-02' })).toThrow(
        'Invalid format, expected an ISO compatible date'
      );
      expect(() => parseType({ type: 'date', value: '2019-12-32' })).toThrow(
        'Invalid format, expected an ISO compatible date'
      );
      expect(() => parseType({ type: 'date', value: '2019-02-31' })).toThrow(
        'Invalid format, expected an ISO compatible date'
      );
    })