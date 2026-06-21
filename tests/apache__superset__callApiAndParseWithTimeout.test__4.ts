test('rejects if the request exceeds the timeout', async () => {
      expect.assertions(2);
      jest.useFakeTimers();

      const mockTimeoutUrl = '/mock/timeout/url';
      const unresolvingPromise = new Promise(() => {});
      let error;
      fetchMock.get(mockTimeoutUrl, () => unresolvingPromise);

      try {
        const promise = callApiAndParseWithTimeout({
          url: mockTimeoutUrl,
          method: 'GET',
          timeout: 1,
        });
        jest.advanceTimersByTime(2);
        await promise;
      } catch (err) {
        error = err;
      } finally {
        expect(fetchMock.callHistory.calls(mockTimeoutUrl)).toHaveLength(1);
        expect(error).toEqual({
          error: 'Request timed out',
          statusText: 'timeout',
          timeout: 1,
        });
      }
    })