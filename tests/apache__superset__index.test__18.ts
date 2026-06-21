test('valid JWT, no channel', async () => {
      const validToken = jwt.sign({ foo: 'bar' }, config.jwtSecret);
      const request = getRequest(validToken, 'http://localhost');

      server.httpUpgrade(request, socket, Buffer.alloc(5));

      expect(socketDestroySpy).toHaveBeenCalled();
      expect(wssUpgradeSpy).not.toHaveBeenCalled();
    })