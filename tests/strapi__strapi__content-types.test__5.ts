test('true for required fields', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string', required: true })).toEqual(true);
    })