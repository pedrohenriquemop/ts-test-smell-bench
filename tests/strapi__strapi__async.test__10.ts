test('Should throw an error with proper message when the input array contains a rejected Promise', async () => {
      const numberPromiseArray = [Promise.reject(new Error('input')), Promise.resolve(2)];

      const reduceFunc = reduce(numberPromiseArray);

      await expect(async () => {
        await reduceFunc(() => true, null);
      }).rejects.toThrow('input');
    })