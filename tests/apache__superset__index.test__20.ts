test('active sockets', () => {
      setReadyState(ws, WebSocket.OPEN);
      server.trackClient(channelId, socketInstance);

      server.checkSockets();

      expect(pingSpy).toHaveBeenCalled();
      expect(terminateSpy).not.toHaveBeenCalled();
      expect(Object.keys(server.sockets).length).toBe(1);
    })