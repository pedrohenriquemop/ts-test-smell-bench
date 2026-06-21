test('success with results', async () => {
      mockRedisXrange.mockResolvedValueOnce(streamReturnValue);
      const cb = jest.fn();
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
      expect(cb).toHaveBeenCalledWith(streamReturnValue);
    })