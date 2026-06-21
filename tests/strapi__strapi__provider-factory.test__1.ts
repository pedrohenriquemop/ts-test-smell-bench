test('Can register a new item', async () => {
        const provider = providerFactory();
        const key = 'key';
        const item = { foo: 'bar' };

        await provider.register(key, item);

        expect(provider.get(key)).toEqual(item);
      })