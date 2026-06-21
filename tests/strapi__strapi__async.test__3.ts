test('Should throw an error', async () => {
      const numberPromiseArray = [Promise.resolve(1), Promise.resolve(2)];

      const mapFunc = map(numberPromiseArray);

      await expect(async () => {
        await mapFunc(() => {
          throw new Error('test');
        });
      }).rejects.toThrow('test');
    })