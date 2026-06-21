test('computes maximum font size for given idealFontSize and maxHeight', () => {
      expect(
        computeMaxFontSize({
          maxHeight: 20,
          idealFontSize: 40,
          text: SAMPLE_TEXT[0],
        }),
      ).toEqual(20);
    })