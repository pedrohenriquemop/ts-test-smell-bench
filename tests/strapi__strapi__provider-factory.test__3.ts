test('Can register duplicated key when "throwOnDuplicates" is false', async () => {
        const provider = providerFactory({ throwOnDuplicates: false });
        const key = 'key';
        const itemA = { foo: 'bar' };
        const itemB = { bar: 'foo' };

        await provider.register(key, itemA);

        expect(provider.get(key)).toEqual(itemA);

        await provider.register(key, itemB);

        expect(provider.get(key)).toEqual(itemB);
      })