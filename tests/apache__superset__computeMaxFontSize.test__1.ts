test('computes maximum font size for given maxWidth and maxHeight', () => {
      expect(
        computeMaxFontSize({
          maxWidth: 400,
          maxHeight: 30,
          text: 'sample text',
        }),
      ).toEqual(30);
    })