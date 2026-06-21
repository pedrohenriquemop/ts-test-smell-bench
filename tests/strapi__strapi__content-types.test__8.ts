test('true for numeric fields with a min', () => {
      expect(getDoesAttributeRequireValidation({ type: 'integer', min: 10 })).toEqual(true);
    })