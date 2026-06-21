test('has SMART_NUMBER as default formatter out of the box', () => {
    expect(registry.getDefaultKey()).toBe(NumberFormats.SMART_NUMBER);
  })