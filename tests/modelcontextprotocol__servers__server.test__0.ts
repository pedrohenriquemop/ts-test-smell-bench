it('should return a ServerFactoryResponse object', () => {
      const result = createServer();

      expect(result).toHaveProperty('server');
      expect(result).toHaveProperty('cleanup');
    })