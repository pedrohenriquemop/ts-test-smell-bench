it('should migrate from memory.json to memory.jsonl when only old file exists', async () => {
      // Create old memory.json file
      await fs.writeFile(oldMemoryPath, '{"test":"data"}');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await ensureMemoryFilePath();

      expect(result).toBe(defaultMemoryPath);

      // Verify migration happened
      const newFileExists = await fs.access(newMemoryPath).then(() => true).catch(() => false);
      const oldFileExists = await fs.access(oldMemoryPath).then(() => true).catch(() => false);

      expect(newFileExists).toBe(true);
      expect(oldFileExists).toBe(false);

      // Verify console messages
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('DETECTED: Found legacy memory.json file')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('COMPLETED: Successfully migrated')
      );

      consoleErrorSpy.mockRestore();
    })