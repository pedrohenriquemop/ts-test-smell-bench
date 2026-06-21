test('Should throw an error with proper message when the provided callback throws an error', async () => {
      const numberPromiseArray = [Promise.resolve(1), Promise.resolve(2)];

      const reduceFunc = reduce(numberPromiseArray);

      await expect(async () => {
        await reduceFunc(() => {
          throw new Error('test');
        });
      }).rejects.toThrow('test');
    })