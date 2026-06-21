test('Delete hooks are triggered for every item on clear', async () => {
        const willDelete = jest.fn();
        const didDelete = jest.fn();

        const provider = providerFactory();

        provider.hooks.willDelete.register(willDelete);
        provider.hooks.didDelete.register(didDelete);

        const items = [
          { key: 'keyA', value: { foo: 'barA' } },
          { key: 'keyB', value: { foo: 'barB' } },
          { key: 'keyC', value: { foo: 'barC' } },
        ];

        for (const item of items) {
          await provider.register(item.key, item.value);
        }

        expect(provider.size()).toBe(items.length);

        await provider.clear();

        expect(provider.size()).toBe(0);

        expect(willDelete).toHaveBeenCalledTimes(items.length);
        expect(didDelete).toHaveBeenCalledTimes(items.length);
      })