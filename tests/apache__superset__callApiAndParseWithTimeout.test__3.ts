test('creates a rejection timer if a timeout passed', () => {
      jest.useFakeTimers(); // prevents the timeout from rejecting + failing test
      const rejectionSpy = jest.spyOn(rejectAfterTimeout, 'default');
      callApiAndParseWithTimeout({
        url: mockGetUrl,
        method: 'GET',
        timeout: 10,
      });

      expect(rejectionSpy).toHaveBeenCalledTimes(1);
      rejectionSpy.mockClear();
    })