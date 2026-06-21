it('should register file resources when docs directory exists', () => {
      const mockServer = {
        registerResource: vi.fn(),
      } as unknown as McpServer;

      registerFileResources(mockServer);

      // The docs folder exists in the everything server and contains files
      // so registerResource should have been called
      expect(mockServer.registerResource).toHaveBeenCalled();
    })