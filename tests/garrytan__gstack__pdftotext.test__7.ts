test("NFC-normalizes composed glyphs (macOS NFD → Linux NFC)", () => {
    // "é" composed vs decomposed
    const decomposed = "e\u0301";
    const composed = "\u00e9";
    expect(normalize(decomposed)).toBe(composed);
  })