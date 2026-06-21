test('Should pipe several functions', async () => {
      const circleAreaPipe = [(n) => n * n, (n) => Promise.resolve(n * Math.PI), Math.round];

      const circleAreaFunc = pipe(...circleAreaPipe);
      const result = await circleAreaFunc(50);

      expect(result).toEqual(7854);
    })