test('Register hooks are triggered on item registration', async () => {
        const willDelete = jest.fn();
        const didDelete = jest.fn();

        const provider = providerFactory();

        provider.hooks.willDelete.register(willDelete);
        provider.hooks.didDelete.register(didDelete);

        await provider.register(key, item);
        await provider.delete(key);

        expect(willDelete).toHaveBeenCalledWith({ key, value: item });
        expect(didDelete).toHaveBeenCalledWith({ key, value: item });
        expect(item).toEqual({ foo: 'bar' });
      })