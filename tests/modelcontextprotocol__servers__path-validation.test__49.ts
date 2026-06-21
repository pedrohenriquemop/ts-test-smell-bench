it('should handle symlinks that point within allowed directories', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping symlinks within allowed directories test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const targetFile = path.join(allowedDir, 'target.txt');
      const symlinkPath = path.join(allowedDir, 'symlink.txt');

      // Create target file within allowed directory
      await fs.writeFile(targetFile, 'TARGET CONTENT', 'utf-8');

      // Create symlink pointing to allowed file
      await fs.symlink(targetFile, symlinkPath);

      // Opening symlink with w follows it to the target
      const fd = await fs.open(symlinkPath, 'w');
      try {
        await fd.write('UPDATED VIA SYMLINK', 0, 'utf-8');
      } finally {
        await fd.close();
      }

      // Both symlink and target should show updated content
      const symlinkContent = await fs.readFile(symlinkPath, 'utf-8');
      const targetContent = await fs.readFile(targetFile, 'utf-8');
      expect(symlinkContent).toBe('UPDATED VIA SYMLINK');
      expect(targetContent).toBe('UPDATED VIA SYMLINK');
    })