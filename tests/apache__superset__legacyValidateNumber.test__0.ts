test('returns the warning message if invalid', () => {
    expect(legacyValidateNumber('abc')).toBeTruthy();
  })