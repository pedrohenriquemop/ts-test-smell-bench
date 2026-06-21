it('should not register when client does not support roots', () => {
      const { mockServer } = createMockServer();
      registerGetRootsListTool(mockServer);

      expect(mockServer.registerTool).not.toHaveBeenCalled();
    })