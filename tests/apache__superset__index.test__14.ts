test('valid JWT, no lastId', async () => {
      const validToken = jwt.sign({ channel: channelId }, config.jwtSecret);
      const request = getRequest(validToken, 'http://localhost');

      server.wsConnection(ws, request);

      expect(trackClientSpy).toHaveBeenCalledWith(
        channelId,
        socketInstanceExpected,
      );
      expect(fetchRangeFromStreamSpy).not.toHaveBeenCalled();
      expect(wsEventMock).toHaveBeenCalledWith('pong', expect.any(Function));
    })