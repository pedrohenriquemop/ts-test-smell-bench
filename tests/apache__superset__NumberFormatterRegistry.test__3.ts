test('falls back to default format if format is not specified', () => {
      registry.setDefaultKey('.1f');
      const formatter = registry.get();
      expect(formatter.format(100)).toEqual('100.0');
    })