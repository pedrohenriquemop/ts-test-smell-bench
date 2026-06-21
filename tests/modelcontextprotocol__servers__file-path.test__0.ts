it('should return absolute path when MEMORY_FILE_PATH is absolute', async () => {
      const absolutePath = '/tmp/custom-memory.jsonl';
      process.env.MEMORY_FILE_PATH = absolutePath;

      const result = await ensureMemoryFilePath();

      expect(result).toBe(absolutePath);
    })