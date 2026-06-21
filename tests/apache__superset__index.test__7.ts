test('sends data to channel', async () => {
      const ws = new wsMock('localhost');
      const sendMock = jest.spyOn(ws, 'send');
      const socketInstance = { ws: ws, channel: channelId, pongTs: Date.now() };

      expect(statsdIncrementMock).toHaveBeenCalledTimes(0);
      server.trackClient(channelId, socketInstance);
      expect(statsdIncrementMock).toHaveBeenCalledTimes(1);
      expect(statsdIncrementMock).toHaveBeenNthCalledWith(
        1,
        'ws_connected_client',
      );

      server.processStreamResults(streamReturnValue);
      expect(statsdIncrementMock).toHaveBeenCalledTimes(1);

      const message1 = `{"id":"1615426152415-0","channel_id":"${channelId}","job_id":"c9b99965-8f1e-4ce5-aa43-d6fc94d6a510","user_id":"1","status":"done","errors":[],"result_url":"/superset/explore_json/data/ejr-37281682b1282cdb8f25e0de0339b386"}`;
      const message2 = `{"id":"1615426152516-0","channel_id":"${channelId}","job_id":"f1e5bb1f-f2f1-4f21-9b2f-c9b91dcc9b59","user_id":"1","status":"done","errors":[],"result_url":"/api/v1/chart/data/qc-64e8452dc9907dd77746cb75a19202de"}`;
      expect(sendMock).toHaveBeenCalledWith(message1);
      expect(sendMock).toHaveBeenCalledWith(message2);
    })