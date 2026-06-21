test('it builds a valid Redis URL with a password', () => {
      expect(
        server.buildRedisOpts({
          port: 6380,
          host: 'redis.local',
          username: 'cool-user',
          password: 'foo',
          db: 1,
          ssl: false,
          validateHostname: false,
        }),
      ).toEqual({
        db: 1,
        host: 'redis.local',
        password: 'foo',
        port: 6380,
        username: 'cool-user',
      });
    })