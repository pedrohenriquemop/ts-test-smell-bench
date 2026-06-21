test('ensure idealFontSize is used if the maximum font size calculation goes below zero', () => {
      expect(
        computeMaxFontSize({
          maxWidth: 5,
          idealFontSize: 34,
          text: SAMPLE_TEXT[0],
        }),
      ).toEqual(34);
    })