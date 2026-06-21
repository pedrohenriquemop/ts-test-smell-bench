test('true for numeric fields with a max', () => {
      expect(getDoesAttributeRequireValidation({ type: 'integer', max: 10 })).toEqual(true);
    })