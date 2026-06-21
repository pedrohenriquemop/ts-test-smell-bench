it('should return resource directly when outputType is resource', async () => {
      const mockServer = {
        registerTool: vi.fn(),
        registerResource: vi.fn(),
      } as unknown as McpServer;

      let handler: Function | null = null;
      (mockServer.registerTool as any).mockImplementation(
        (name: string, config: any, h: Function) => {
          handler = h;
        }
      );

      registerGZipFileAsResourceTool(mockServer);

      const testContent = 'Test content for compression';
      const dataUri = `data:text/plain;base64,${Buffer.from(testContent).toString('base64')}`;

      const result = await handler!(
        { name: 'output.gz', data: dataUri, outputType: 'resource' }
      );

      expect(result.content[0].type).toBe('resource');
      expect(result.content[0].resource.mimeType).toBe('application/gzip');
      expect(result.content[0].resource.blob).toBeDefined();
    })