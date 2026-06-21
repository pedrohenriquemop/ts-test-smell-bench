test('use 0 for the side that is not specified', () => {
      expect(mergeMargin({}, {})).toEqual({
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      });
    })