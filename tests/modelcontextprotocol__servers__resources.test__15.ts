it('should register text and blob resource templates', () => {
      const registeredResources: any[] = [];

      const mockServer = {
        registerResource: vi.fn((...args) => {
          registeredResources.push(args);
        }),
      } as unknown as McpServer;

      registerResourceTemplates(mockServer);

      expect(mockServer.registerResource).toHaveBeenCalledTimes(2);

      // Check text resource registration
      const textRegistration = registeredResources.find((r) =>
        r[0].includes('Text')
      );
      expect(textRegistration).toBeDefined();
      expect(textRegistration[1]).toBeInstanceOf(ResourceTemplate);

      // Check blob resource registration
      const blobRegistration = registeredResources.find((r) =>
        r[0].includes('Blob')
      );
      expect(blobRegistration).toBeDefined();
    })