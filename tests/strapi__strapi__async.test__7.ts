test('Should work without initial value', async () => {
      const numberPromiseArray = [Promise.resolve(1), Promise.resolve(2)];

      const reduceFunc = reduce(numberPromiseArray);
      const result = await reduceFunc(
        (previousValue, currentValue) => (previousValue || 10) + currentValue
      );

      expect(result).toEqual(13);
    })