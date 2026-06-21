test('active sockets', () => {
      setReadyState(ws, WebSocket.OPEN);
      server.trackClient(channelId, socketInstance);

      server.cleanChannel(channelId);

      expect(server.channels[channelId].sockets.length).toBe(1);
    })