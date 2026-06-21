test('false for non-unique fields', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string', unique: false })).toEqual(false);
    })