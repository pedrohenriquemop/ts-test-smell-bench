test('closed sockets', () => {
      setReadyState(ws, WebSocket.CLOSED);
      server.trackClient(channelId, socketInstance);

      server.checkSockets();

      expect(pingSpy).not.toHaveBeenCalled();
      expect(terminateSpy).not.toHaveBeenCalled();
      expect(Object.keys(server.sockets).length).toBe(0);
    })