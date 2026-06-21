test('falls back to default format if format is undefined', () => {
      registry.setDefaultKey('.1f');
      const formatter = registry.get(undefined);
      expect(formatter.format(100)).toEqual('100.0');
    })