it('should have an oninitialized handler set', () => {
      const { server } = createServer();

      expect(server.server.oninitialized).toBeDefined();
    })