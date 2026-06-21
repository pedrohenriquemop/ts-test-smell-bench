it('validates non-existent file paths based on parent directory', async () => {
      const allowed = [allowedDir];

      expect(isPathWithinAllowedDirectories(testPath, allowed)).toBe(true);
      await expect(fs.access(testPath)).rejects.toThrow();

      const parentDir = path.dirname(testPath);
      expect(isPathWithinAllowedDirectories(parentDir, allowed)).toBe(true);
    })