test('works if margin1 is not defined', () => {
      expect(
        mergeMargin(undefined, {
          top: 2,
          left: 2,
          bottom: 1,
          right: 1,
        }),
      ).toEqual({
        top: 2,
        left: 2,
        bottom: 1,
        right: 1,
      });
    })