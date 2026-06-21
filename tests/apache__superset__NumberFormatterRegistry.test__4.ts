test('falls back to default format if format is null', () => {
      registry.setDefaultKey('.1f');
      // @ts-expect-error
      const formatter = registry.get(null);
      expect(formatter.format(100)).toEqual('100.0');
    })