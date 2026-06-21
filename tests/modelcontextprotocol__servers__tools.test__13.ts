it('should return image content with text descriptions', async () => {
      const { mockServer, handlers } = createMockServer();
      registerGetTinyImageTool(mockServer);

      const handler = handlers.get('get-tiny-image')!;
      const result = await handler({});

      expect(result.content).toHaveLength(3);
      expect(result.content[0]).toEqual({
        type: 'text',
        text: "Here's the image you requested:",
      });
      expect(result.content[1]).toEqual({
        type: 'image',
        data: MCP_TINY_IMAGE,
        mimeType: 'image/png',
      });
      expect(result.content[2]).toEqual({
        type: 'text',
        text: 'The image above is the MCP logo.',
      });
    })