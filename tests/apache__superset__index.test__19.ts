test('valid upgrade', async () => {
      const validToken = jwt.sign({ channel: channelId }, config.jwtSecret);
      const request = getRequest(validToken, 'http://localhost');

      server.httpUpgrade(request, socket, Buffer.alloc(5));

      expect(socketDestroySpy).not.toHaveBeenCalled();
      expect(wssUpgradeSpy).toHaveBeenCalled();
    })