test('valid JWT, with lastId', async () => {
      const validToken = jwt.sign({ channel: channelId }, config.jwtSecret);
      const lastId = '1615426152415-0';
      const request = getRequest(
        validToken,
        `http://localhost?last_id=${lastId}`,
      );

      server.wsConnection(ws, request);

      expect(trackClientSpy).toHaveBeenCalledWith(
        channelId,
        socketInstanceExpected,
      );
      expect(fetchRangeFromStreamSpy).toHaveBeenCalledWith({
        sessionId: channelId,
        startId: '1615426152415-1',
        endId: '+',
        listener: server.processStreamResults,
      });
      expect(wsEventMock).toHaveBeenCalledWith('pong', expect.any(Function));
    })