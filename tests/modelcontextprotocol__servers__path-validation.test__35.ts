it('handles non-existent paths correctly', async () => {
      const newFilePath = path.join(allowedDir, 'subdir', 'newfile.txt');

      // Parent directory doesn't exist
      try {
        await fs.access(newFilePath);
      } catch (error) {
        expect((error as NodeJS.ErrnoException).code).toBe('ENOENT');
      }

      // After creating parent, validation should work
      await fs.mkdir(path.dirname(newFilePath), { recursive: true });
      const allowed = [allowedDir];
      expect(isPathWithinAllowedDirectories(newFilePath, allowed)).toBe(true);
    })