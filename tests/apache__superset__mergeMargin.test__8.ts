test('if there are NaN or null, use another value', () => {
    expect(
      mergeMargin(
        {
          top: 10,
          // @ts-expect-error to let us pass `null` for testing
          left: null,
          bottom: 20,
          right: NaN,
        },
        {
          top: NaN,
          left: 30,
          bottom: null,
          right: 40,
        },
      ),
    ).toEqual({
      top: 10,
      left: 30,
      bottom: 20,
      right: 40,
    });
  })