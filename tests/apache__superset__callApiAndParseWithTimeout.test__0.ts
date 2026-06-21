test('calls callApi()', () => {
      const callApiSpy = jest.spyOn(callApi, 'default');
      callApiAndParseWithTimeout({ url: mockGetUrl, method: 'GET' });

      expect(callApiSpy).toHaveBeenCalledTimes(1);
      callApiSpy.mockClear();
    })