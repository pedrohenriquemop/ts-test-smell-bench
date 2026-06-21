test('true for fields with a min length', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string', minLength: 10 })).toEqual(true);
    })