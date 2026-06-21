test('Should return a simple array of numbers', async () => {
      const numberPromiseArray = [Promise.resolve(1), Promise.resolve(2)];

      const mapFunc = map(numberPromiseArray);
      const result = await mapFunc((number) => number + 1);

      expect(result).toEqual([2, 3]);
    })