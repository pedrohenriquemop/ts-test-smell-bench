test('works correctly for negative margins', () => {
    expect(
      mergeMargin(
        {
          top: -3,
          left: -3,
          bottom: -2,
          right: -2,
        },
        {
          top: -2,
          left: -2,
          bottom: 0,
          right: -1,
        },
      ),
    ).toEqual({
      top: -2,
      left: -2,
      bottom: 0,
      right: -1,
    });
  })