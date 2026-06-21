it('should return valid base64 image data', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetTinyImageTool(mockServer);

      const handler = handlers.get('get-tiny-image')!;
      const result = await handler({});

      const imageContent = result.content[1];
      expect(imageContent.type).toBe('image');
      expect(imageContent.mimeType).toBe('image/png');
      // Verify it's valid base64
      expect(() => Buffer.from(imageContent.data, 'base64')).not.toThrow();
    })