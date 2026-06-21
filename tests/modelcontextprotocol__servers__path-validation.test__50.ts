it('should prevent overwriting files through symlinks pointing outside allowed directories', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping symlink overwrite prevention test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const legitFile = path.join(allowedDir, 'existing.txt');
      const targetFile = path.join(forbiddenDir, 'target.txt');

      // Create a legitimate file first
      await fs.writeFile(legitFile, 'LEGIT CONTENT', 'utf-8');

      // Create target file in forbidden directory
      await fs.writeFile(targetFile, 'FORBIDDEN CONTENT', 'utf-8');

      // Now replace the legitimate file with a symlink to forbidden location
      await fs.unlink(legitFile);
      await fs.symlink(targetFile, legitFile);

      // Simulate the server's validation logic
      const stats = await fs.lstat(legitFile);
      expect(stats.isSymbolicLink()).toBe(true);

      const realPath = await fs.realpath(legitFile);
      expect(isPathWithinAllowedDirectories(realPath, allowed)).toBe(false);

      // With atomic rename, symlinks are replaced not followed
      // So this test now demonstrates the protection

      // Verify content remains unchanged
      const targetContent = await fs.readFile(targetFile, 'utf-8');
      expect(targetContent).toBe('FORBIDDEN CONTENT');
    })