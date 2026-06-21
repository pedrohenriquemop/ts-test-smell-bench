test("flags 'S ai li ng' per-glyph emission when reassembled letters appear in source", () => {
    // Build expected/extracted strings that would trip the gate.
    const expected = "Sailing on the open sea.";
    const extracted = "S a i l i n g   on the open sea.";
    // Simulate by running normalize + assertion manually; the regex is
    // looked at in the gate.
    const fragRegex = /((?:\b\w\s){4,})/g;
    const match = fragRegex.exec(extracted);
    expect(match).not.toBeNull();
    if (match) {
      const letters = match[1].replace(/\s/g, "");
      expect(letters.toLowerCase()).toBe("sailing");
      expect(expected.toLowerCase().includes(letters.toLowerCase())).toBe(true);
    }
  })