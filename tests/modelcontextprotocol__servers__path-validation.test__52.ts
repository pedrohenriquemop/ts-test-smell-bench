it('verifies rename does not follow symlinks', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping rename symlink test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const tempFile = path.join(allowedDir, 'temp.txt');
      const targetSymlink = path.join(allowedDir, 'target-symlink.txt');
      const forbiddenTarget = path.join(forbiddenDir, 'forbidden-target.txt');

      // Create forbidden target
      await fs.writeFile(forbiddenTarget, 'ORIGINAL CONTENT', 'utf-8');

      // Create symlink pointing to forbidden location
      await fs.symlink(forbiddenTarget, targetSymlink);

      // Write temp file
      await fs.writeFile(tempFile, 'NEW CONTENT', 'utf-8');

      // Rename temp file to symlink path
      await fs.rename(tempFile, targetSymlink);

      // Check what happened
      const symlinkExists = await fs.lstat(targetSymlink).then(() => true).catch(() => false);
      const isSymlink = symlinkExists && (await fs.lstat(targetSymlink)).isSymbolicLink();
      const targetContent = await fs.readFile(targetSymlink, 'utf-8');
      const forbiddenContent = await fs.readFile(forbiddenTarget, 'utf-8');

      // Rename should replace the symlink with a regular file
      expect(isSymlink).toBe(false);
      expect(targetContent).toBe('NEW CONTENT');
      expect(forbiddenContent).toBe('ORIGINAL CONTENT'); // Unchanged
    })