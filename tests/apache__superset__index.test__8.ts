test('channel not present', async () => {
      const ws = new wsMock('localhost');
      const sendMock = jest.spyOn(ws, 'send');

      expect(statsdIncrementMock).toHaveBeenCalledTimes(0);
      server.processStreamResults(streamReturnValue);
      expect(statsdIncrementMock).toHaveBeenCalledTimes(0);

      expect(sendMock).not.toHaveBeenCalled();
    })