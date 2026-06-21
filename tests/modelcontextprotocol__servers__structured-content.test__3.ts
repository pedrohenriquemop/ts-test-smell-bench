it('should return structuredContent.content as a string', async () => {
      const result = await client.callTool({
        name: 'list_directory',
        arguments: { path: testDir }
      });

      expect(result.structuredContent).toBeDefined();

      const structuredContent = result.structuredContent as { content: unknown };
      expect(typeof structuredContent.content).toBe('string');
      expect(Array.isArray(structuredContent.content)).toBe(false);
    })