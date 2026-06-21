test('Register hooks are triggered on item registration', async () => {
        const willRegister = jest.fn(({ value }) => {
          value.bar = 'foo';
        });
        const didRegister = jest.fn();

        const key = 'key';
        const item = { foo: 'bar' };

        const provider = providerFactory();

        provider.hooks.willRegister.register(willRegister);
        provider.hooks.didRegister.register(didRegister);

        await provider.register(key, item);

        expect(willRegister).toHaveBeenCalledWith({ key, value: item });
        expect(didRegister).toHaveBeenCalledWith({ key, value: item });
        expect(item).toMatchObject({ foo: 'bar', bar: 'foo' });
      })