test('false for field without constraints', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string' })).toEqual(false);
    })