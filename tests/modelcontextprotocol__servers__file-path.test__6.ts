it('should preserve file content during migration', async () => {
      const testContent = '{"entities": [{"name": "test", "type": "person"}]}';
      await fs.writeFile(oldMemoryPath, testContent);

      await ensureMemoryFilePath();

      const migratedContent = await fs.readFile(newMemoryPath, 'utf-8');
      expect(migratedContent).toBe(testContent);
    })