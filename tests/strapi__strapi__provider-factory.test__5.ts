test('Can delete a registered item by its key', async () => {
        const provider = providerFactory();

        await provider.register(key, item);

        expect(provider.get(key)).toBe(item);

        await provider.delete(key);

        expect(provider.get(key)).toBeUndefined();
      })