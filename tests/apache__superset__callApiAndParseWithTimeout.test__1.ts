test('calls parseResponse()', async () => {
      const parseSpy = jest.spyOn(parseResponse, 'default');

      await callApiAndParseWithTimeout({
        url: mockGetUrl,
        method: 'GET',
      });

      expect(parseSpy).toHaveBeenCalledTimes(1);
      parseSpy.mockClear();
    })