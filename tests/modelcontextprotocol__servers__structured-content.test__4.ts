it('should return structuredContent.content as a string', async () => {
      const result = await client.callTool({
        name: 'search_files',
        arguments: {
          path: testDir,
          pattern: '*.txt'
        }
      });

      expect(result.structuredContent).toBeDefined();

      const structuredContent = result.structuredContent as { content: unknown };
      expect(typeof structuredContent.content).toBe('string');
      expect(Array.isArray(structuredContent.content)).toBe(false);
    })