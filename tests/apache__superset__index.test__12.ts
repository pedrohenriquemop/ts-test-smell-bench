test('error', async () => {
      const cb = jest.fn();
      mockRedisXrange.mockRejectedValueOnce(new Error());
      await server.fetchRangeFromStream({
        sessionId: '123',
        startId: '-',
        endId: '+',
        listener: cb,
      });

      expect(mockRedisXrange).toHaveBeenCalledWith(
        'test-async-events-123',
        '-',
        '+',
      );
      expect(cb).not.toHaveBeenCalled();
    })