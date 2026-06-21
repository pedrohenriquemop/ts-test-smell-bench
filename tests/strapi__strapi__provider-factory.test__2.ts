test(`Can't register duplicated key by default`, async () => {
        const provider = providerFactory();

        const key = 'key';
        const itemA = { foo: 'bar' };
        const itemB = { bar: 'foo' };

        await provider.register(key, itemA);

        await expect(provider.register(key, itemB)).rejects.toThrowError(
          'Duplicated item key: key'
        );
      })