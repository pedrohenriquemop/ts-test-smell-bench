test('it handles an invalid Redis stream ID', () => {
      expect(server.incrementId('foo')).toEqual('foo');
    })