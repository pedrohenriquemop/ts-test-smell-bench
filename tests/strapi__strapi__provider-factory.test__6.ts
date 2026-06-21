test('Trying to delete an unregistered item does nothing', async () => {
        const provider = providerFactory();

        expect(provider.get(key)).toBeUndefined();

        await provider.delete(key);

        expect(provider.get(key)).toBeUndefined();

        await provider.register(key, item);

        expect(provider.get(key)).toBe(item);

        await provider.delete(`${key}.${key}`);

        expect(provider.get(key)).toBe(item);
      })