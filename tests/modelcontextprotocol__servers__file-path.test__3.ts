it('should return default path when no files exist', async () => {
      const result = await ensureMemoryFilePath();

      expect(result).toBe(defaultMemoryPath);
    })