test('requires either idealFontSize or maxHeight', () => {
      expect(() => {
        computeMaxFontSize({
          text: SAMPLE_TEXT[0],
        });
      }).toThrow();
    })