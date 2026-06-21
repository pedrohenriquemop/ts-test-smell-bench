test('stale sockets', () => {
      setReadyState(ws, WebSocket.OPEN);
      socketInstance.pongTs = Date.now() - 60000;
      server.trackClient(channelId, socketInstance);

      server.checkSockets();

      expect(pingSpy).not.toHaveBeenCalled();
      expect(terminateSpy).toHaveBeenCalled();
      expect(Object.keys(server.sockets).length).toBe(0);
    })