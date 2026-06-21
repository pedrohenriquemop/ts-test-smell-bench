test('Calling get on a non-existing key returns undefined', () => {
        const provider = providerFactory();

        const result = provider.get('key');

        expect(result).toBeUndefined();
      })