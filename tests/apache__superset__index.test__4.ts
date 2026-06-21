test('it builds a valid Redis URL from defaults', () => {
      expect(
        server.buildRedisOpts({
          port: 6379,
          host: '127.0.0.1',
          username: 'test-user',
          password: '',
          db: 0,
          ssl: false,
          validateHostname: false,
        }),
      ).toEqual({ db: 0, host: '127.0.0.1', port: 6379 });
    })