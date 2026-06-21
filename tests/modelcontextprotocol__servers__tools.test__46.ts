it('should compress data URI and return resource link', async () => {
      const registeredResources: any[] = [];
      const mockServer = {
        registerTool: vi.fn(),
        registerResource: vi.fn((...args) => {
          registeredResources.push(args);
        }),
      } as unknown as McpServer;

      // Get the handler
      let handler: Function | null = null;
      (mockServer.registerTool as any).mockImplementation(
        (name: string, config: any, h: Function) => {
          handler = h;
        }
      );

      registerGZipFileAsResourceTool(mockServer);

      // Create a data URI with test content
      const testContent = 'Hello, World!';
      const dataUri = `data:text/plain;base64,${Buffer.from(testContent).toString('base64')}`;

      const result = await handler!(
        { name: 'test.txt.gz', data: dataUri, outputType: 'resourceLink' }
      );

      expect(result.content[0].type).toBe('resource_link');
      expect(result.content[0].uri).toContain('test.txt.gz');
    })