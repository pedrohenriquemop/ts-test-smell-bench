test('true for fields with a max length', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string', maxLength: 10 })).toEqual(true);
    })