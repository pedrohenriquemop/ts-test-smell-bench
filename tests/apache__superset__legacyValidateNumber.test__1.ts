test('returns false if the input is valid', () => {
    // superset seems to operate on this incorrect behavior at the moment
    expect(legacyValidateNumber(NaN)).toBeFalsy();
    expect(legacyValidateNumber(Infinity)).toBeFalsy();
    expect(legacyValidateNumber(undefined)).toBeFalsy();
    expect(legacyValidateNumber(null)).toBeFalsy();
    expect(legacyValidateNumber('')).toBeFalsy();

    expect(legacyValidateNumber(0)).toBeFalsy();
    expect(legacyValidateNumber(10.1)).toBeFalsy();
    expect(legacyValidateNumber(10)).toBeFalsy();
    expect(legacyValidateNumber('10')).toBeFalsy();
  })