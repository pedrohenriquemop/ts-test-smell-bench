it('should register blob resource correctly', () => {
      const mockServer = {
        registerResource: vi.fn(),
      } as unknown as McpServer;

      const resource = {
        uri: 'demo://resource/session/binary-file',
        name: 'binary-file',
        mimeType: 'application/octet-stream',
      };

      const blobContent = Buffer.from('binary data').toString('base64');
      const result = registerSessionResource(mockServer, resource, 'blob', blobContent);

      expect(result.type).toBe('resource_link');
      expect(mockServer.registerResource).toHaveBeenCalled();
    })