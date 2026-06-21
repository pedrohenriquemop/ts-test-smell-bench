it('should convert relative path to absolute when MEMORY_FILE_PATH is relative', async () => {
      const relativePath = 'custom-memory.jsonl';
      process.env.MEMORY_FILE_PATH = relativePath;

      const result = await ensureMemoryFilePath();

      expect(path.isAbsolute(result)).toBe(true);
      expect(result).toContain('custom-memory.jsonl');
    })