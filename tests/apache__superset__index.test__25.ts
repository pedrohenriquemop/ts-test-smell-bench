test('closing sockets', () => {
      setReadyState(ws, WebSocket.CLOSING);
      server.trackClient(channelId, socketInstance);

      server.cleanChannel(channelId);

      expect(server.channels[channelId]).toBeUndefined();
    })