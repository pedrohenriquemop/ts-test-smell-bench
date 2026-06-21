test('it builds a valid Redis URL with SSL', () => {
      expect(
        server.buildRedisOpts({
          port: 6379,
          host: '127.0.0.1',
          password: '',
          username: 'cool-user',
          db: 0,
          ssl: true,
          validateHostname: false,
        }),
      ).toEqual({
        db: 0,
        host: '127.0.0.1',
        port: 6379,
        tls: { checkServerIdentity: expect.anything() },
      });
    })