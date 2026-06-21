test('multiple sockets', () => {
      setReadyState(ws, WebSocket.OPEN);
      server.trackClient(channelId, socketInstance);

      const ws2 = new wsMock('localhost');
      setReadyState(ws2, WebSocket.OPEN);
      const socketInstance2 = {
        ws: ws2,
        channel: channelId,
        pongTs: Date.now(),
      };
      server.trackClient(channelId, socketInstance2);

      server.cleanChannel(channelId);

      expect(server.channels[channelId].sockets.length).toBe(2);

      setReadyState(ws2, WebSocket.CLOSED);
      server.cleanChannel(channelId);

      expect(server.channels[channelId].sockets.length).toBe(1);
    })