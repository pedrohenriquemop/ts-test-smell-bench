it('should handle Windows absolute paths', async () => {
      const windowsPath = 'C:\\temp\\memory.jsonl';
      process.env.MEMORY_FILE_PATH = windowsPath;

      const result = await ensureMemoryFilePath();

      // On Windows, should return as-is; on Unix, will be treated as relative
      if (process.platform === 'win32') {
        expect(result).toBe(windowsPath);
      } else {
        expect(path.isAbsolute(result)).toBe(true);
      }
    })