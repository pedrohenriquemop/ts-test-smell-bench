test('works if margin2 is not defined', () => {
      expect(
        mergeMargin(
          {
            top: 1,
            left: 1,
            bottom: 2,
            right: 2,
          },
          undefined,
        ),
      ).toEqual({
        top: 1,
        left: 1,
        bottom: 2,
        right: 2,
      });
    })