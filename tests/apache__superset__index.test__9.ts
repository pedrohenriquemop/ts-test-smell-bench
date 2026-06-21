test('error sending data to client', async () => {
      const ws = new wsMock('localhost');
      const sendMock = jest.spyOn(ws, 'send').mockImplementation(() => {
        throw new Error();
      });
      const cleanChannelMock = jest.spyOn(server, 'cleanChannel');
      const socketInstance = { ws: ws, channel: channelId, pongTs: Date.now() };

      expect(statsdIncrementMock).toHaveBeenCalledTimes(0);
      server.trackClient(channelId, socketInstance);
      expect(statsdIncrementMock).toHaveBeenCalledTimes(1);
      expect(statsdIncrementMock).toHaveBeenNthCalledWith(
        1,
        'ws_connected_client',
      );

      server.processStreamResults(streamReturnValue);
      expect(statsdIncrementMock).toHaveBeenCalledTimes(2);
      expect(statsdIncrementMock).toHaveBeenNthCalledWith(
        2,
        'ws_client_send_error',
      );

      expect(sendMock).toHaveBeenCalled();
      expect(cleanChannelMock).toHaveBeenCalledWith(channelId);

      cleanChannelMock.mockRestore();
    })