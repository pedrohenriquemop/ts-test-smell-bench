test('falls back to the default formatter if the format is undefined', () => {
      expect(registry.format(undefined, 1000)).toEqual('1k');
    })