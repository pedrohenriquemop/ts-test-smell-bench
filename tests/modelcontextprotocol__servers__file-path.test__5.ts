it('should use new file when both old and new files exist', async () => {
      // Create both files
      await fs.writeFile(oldMemoryPath, '{"old":"data"}');
      await fs.writeFile(newMemoryPath, '{"new":"data"}');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await ensureMemoryFilePath();

      expect(result).toBe(defaultMemoryPath);

      // Verify no migration happened (both files should still exist)
      const newFileExists = await fs.access(newMemoryPath).then(() => true).catch(() => false);
      const oldFileExists = await fs.access(oldMemoryPath).then(() => true).catch(() => false);

      expect(newFileExists).toBe(true);
      expect(oldFileExists).toBe(true);

      // Verify no console messages about migration
      expect(consoleErrorSpy).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    })