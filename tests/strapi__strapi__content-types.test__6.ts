test('true for unique fields', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string', unique: true })).toEqual(true);
    })