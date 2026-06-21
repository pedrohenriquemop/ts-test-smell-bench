test('calling get on an existing key returns the registered item', async () => {
        const provider = providerFactory();
        const key = 'key';
        const item = { foo: 'bar' };

        await provider.register(key, item);

        const result = provider.get(key);

        expect(result).toBe(item);
      })