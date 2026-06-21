test('Should throw an error 2', async () => {
      const numberPromiseArray = [Promise.reject(new Error('input')), Promise.resolve(2)];

      const mapFunc = map(numberPromiseArray);

      await expect(async () => {
        await mapFunc(() => true);
      }).rejects.toThrow('input');
    })