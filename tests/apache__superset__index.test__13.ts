test('invalid JWT', async () => {
      const invalidToken = jwt.sign({ channel: channelId }, 'invalid secret');
      const request = getRequest(invalidToken, 'http://localhost');

      expect(() => {
        server.wsConnection(ws, request);
      }).toThrow();
    })