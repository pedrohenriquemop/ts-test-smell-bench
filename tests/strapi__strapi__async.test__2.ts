test('Should work with mix of promises and values', async () => {
      const numberMixArray = [1, Promise.resolve(2)];

      const mapFunc = map(numberMixArray);
      const result = await mapFunc((number) => number + 1);

      expect(result).toEqual([2, 3]);
    })