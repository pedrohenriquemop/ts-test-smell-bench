test("does NOT flag 'A B C D' as per-glyph when letters don't appear in source", () => {
    const expected = "The quick brown fox.";
    const extracted = "The quick A B C D brown fox.";
    const fragRegex = /((?:\b\w\s){4,})/g;
    const match = fragRegex.exec(extracted);
    if (match) {
      const letters = match[1].replace(/\s/g, "");
      // "ABCD" is not a substring of expected
      expect(expected.toLowerCase().includes(letters.toLowerCase())).toBe(false);
    }
  })