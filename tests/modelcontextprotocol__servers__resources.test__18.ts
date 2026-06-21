it('should register text resource and return resource link', () => {
      const registrations: any[] = [];
      const mockServer = {
        registerResource: vi.fn((...args) => {
          registrations.push(args);
        }),
      } as unknown as McpServer;

      const resource = {
        uri: 'demo://resource/session/test-file',
        name: 'test-file',
        mimeType: 'text/plain',
        description: 'A test file',
      };

      const result = registerSessionResource(
        mockServer,
        resource,
        'text',
        'Hello, World!'
      );

      expect(result.type).toBe('resource_link');
      expect(result.uri).toBe(resource.uri);
      expect(result.name).toBe(resource.name);

      expect(mockServer.registerResource).toHaveBeenCalledWith(
        'test-file',
        'demo://resource/session/test-file',
        expect.objectContaining({
          mimeType: 'text/plain',
          description: 'A test file',
        }),
        expect.any(Function)
      );
    })