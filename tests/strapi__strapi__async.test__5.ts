test('Should resolve elements two at a time', async () => {
      const numberPromiseArray = [1, 2, 3, 4, 5, 6];
      const getPromiseDelayed = (speed = 0) =>
        new Promise((resolve) => {
          setTimeout(resolve, speed);
        });
      let maxOperations = 0;
      let operationsCounter = 0;

      const mapFunc = map(numberPromiseArray);
      const result = await mapFunc(
        async (value) => {
          operationsCounter += 1;
          if (operationsCounter > maxOperations) {
            maxOperations = operationsCounter;
          }
          await getPromiseDelayed(20);
          operationsCounter -= 1;
          return value;
        },
        { concurrency: 2 }
      );

      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
      expect(maxOperations).toEqual(2);
    })