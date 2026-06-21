test('Should return an incremented number', async () => {
      const numberPromiseArray = [Promise.resolve(1), Promise.resolve(2)];

      const reduceFunc = reduce(numberPromiseArray);
      const result = await reduceFunc(
        (previousValue, currentValue) => previousValue + currentValue,
        10
      );

      expect(result).toEqual(13);
    })