test('invalid JWT', async () => {
      const invalidToken = jwt.sign({ channel: channelId }, 'invalid secret');
      const request = getRequest(invalidToken, 'http://localhost');

      server.httpUpgrade(request, socket, Buffer.alloc(5));
      expect(socketDestroySpy).toHaveBeenCalled();
      expect(wssUpgradeSpy).not.toHaveBeenCalled();
    })