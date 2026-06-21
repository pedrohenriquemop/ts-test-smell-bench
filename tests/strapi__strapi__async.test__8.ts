test('Should work with mix of promises and values', async () => {
      const numberMixArray = [1, Promise.resolve(2)];

      const reduceFunc = reduce(numberMixArray);
      const result = await reduceFunc(
        (previousValue, currentValue) => previousValue + currentValue,
        10
      );

      expect(result).toEqual(13);
    })