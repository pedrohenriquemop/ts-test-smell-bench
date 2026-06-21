test('if mode=expand, returns the larger margin for each side', () => {
      expect(
        mergeMargin(
          {
            top: 1,
            left: 1,
            bottom: 2,
            right: 2,
          },
          {
            top: 2,
            left: 2,
            bottom: 1,
            right: 1,
          },
          'expand',
        ),
      ).toEqual({
        top: 2,
        left: 2,
        bottom: 2,
        right: 2,
      });
    })