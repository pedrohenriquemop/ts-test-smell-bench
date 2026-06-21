it('demonstrates symlink race condition allows writing outside allowed directories', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping symlink race condition test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];

      await expect(fs.access(testPath)).rejects.toThrow();
      expect(isPathWithinAllowedDirectories(testPath, allowed)).toBe(true);

      await fs.symlink(targetFile, testPath);
      await fs.writeFile(testPath, 'MODIFIED CONTENT', 'utf-8');

      const targetContent = await fs.readFile(targetFile, 'utf-8');
      expect(targetContent).toBe('MODIFIED CONTENT');

      const resolvedPath = await fs.realpath(testPath);
      expect(isPathWithinAllowedDirectories(resolvedPath, allowed)).toBe(false);
    })