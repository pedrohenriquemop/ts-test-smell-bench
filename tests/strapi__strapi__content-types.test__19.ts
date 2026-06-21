test('Returns false if attribute does not have a type', () => {
      expect(isTypedAttribute({})).toBe(false);
    })