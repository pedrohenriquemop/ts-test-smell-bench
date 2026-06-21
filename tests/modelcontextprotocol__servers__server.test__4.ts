it('should allow multiple servers to be created', () => {
      const result1 = createServer();
      const result2 = createServer();

      expect(result1.server).toBeDefined();
      expect(result2.server).toBeDefined();
      expect(result1.server).not.toBe(result2.server);
    })