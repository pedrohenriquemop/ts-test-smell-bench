it('should return structuredContent.content as a string, not an array', async () => {
      const sourcePath = path.join(testDir, 'test.txt');
      const destPath = path.join(testDir, 'moved.txt');

      const result = await client.callTool({
        name: 'move_file',
        arguments: {
          source: sourcePath,
          destination: destPath
        }
      });

      // The result should have structuredContent
      expect(result.structuredContent).toBeDefined();

      // structuredContent.content should be a string (matching outputSchema: { content: z.string() })
      const structuredContent = result.structuredContent as { content: unknown };
      expect(typeof structuredContent.content).toBe('string');

      // It should NOT be an array
      expect(Array.isArray(structuredContent.content)).toBe(false);

      // The content should contain success message
      expect(structuredContent.content).toContain('Successfully moved');
    })