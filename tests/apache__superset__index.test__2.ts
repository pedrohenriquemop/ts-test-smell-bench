test('it increments a valid Redis stream ID', () => {
      expect(server.incrementId('1607477697866-0')).toEqual('1607477697866-1');
    })