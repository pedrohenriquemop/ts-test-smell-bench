test('resolves if the request does not exceed the timeout', async () => {
      expect.assertions(1);
      const { json } = await callApiAndParseWithTimeout({
        url: mockGetUrl,
        method: 'GET',
        timeout: 100,
      });
      expect(json).toEqual(mockGetPayload);
    })