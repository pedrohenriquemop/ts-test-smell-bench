test('does not create a rejection timer if no timeout passed', () => {
      const rejectionSpy = jest.spyOn(rejectAfterTimeout, 'default');
      callApiAndParseWithTimeout({ url: mockGetUrl, method: 'GET' });

      expect(rejectionSpy).toHaveBeenCalledTimes(0);
      rejectionSpy.mockClear();
    })