it('should create an McpServer instance', () => {
      const { server } = createServer();

      expect(server).toBeDefined();
      expect(server.server).toBeDefined();
    })