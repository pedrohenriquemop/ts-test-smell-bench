test('false for non-required fields', () => {
      expect(getDoesAttributeRequireValidation({ type: 'string', required: false })).toEqual(false);
    })