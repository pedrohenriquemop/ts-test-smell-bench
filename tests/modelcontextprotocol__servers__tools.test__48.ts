it('should reject unsupported URL protocols', async () => {
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

      await expect(
        handler!({ name: 'test.gz', data: 'ftp://example.com/file.txt', outputType: 'resource' })
      ).rejects.toThrow('Unsupported URL protocol');
    })