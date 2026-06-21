it('should return structuredContent.content as a string, not an array', async () => {
      const result = await client.callTool({
        name: 'directory_tree',
        arguments: { path: testDir }
      });

      // The result should have structuredContent
      expect(result.structuredContent).toBeDefined();

      // structuredContent.content should be a string (matching outputSchema: { content: z.string() })
      const structuredContent = result.structuredContent as { content: unknown };
      expect(typeof structuredContent.content).toBe('string');

      // It should NOT be an array
      expect(Array.isArray(structuredContent.content)).toBe(false);

      // The content should be valid JSON representing the tree
      const treeData = JSON.parse(structuredContent.content as string);
      expect(Array.isArray(treeData)).toBe(true);
    })