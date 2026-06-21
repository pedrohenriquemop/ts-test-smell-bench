test('computes maximum font size for given maxWidth and idealFontSize', () => {
      expect(
        computeMaxFontSize({
          maxWidth: 250,
          idealFontSize: 40,
          text: SAMPLE_TEXT[0],
        }),
      ).toEqual(25);
    })