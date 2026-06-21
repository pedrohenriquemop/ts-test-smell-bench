it('should use resolved parent paths for non-existent files', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping resolved parent paths test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];

      const symlinkDir = path.join(allowedDir, 'link');
      await fs.symlink(forbiddenDir, symlinkDir);

      const fileThroughSymlink = path.join(symlinkDir, 'newfile.txt');

      expect(fileThroughSymlink.startsWith(allowedDir)).toBe(true);

      const parentDir = path.dirname(fileThroughSymlink);
      const resolvedParent = await fs.realpath(parentDir);
      expect(isPathWithinAllowedDirectories(resolvedParent, allowed)).toBe(false);

      const expectedSafePath = path.join(resolvedParent, path.basename(fileThroughSymlink));
      expect(isPathWithinAllowedDirectories(expectedSafePath, allowed)).toBe(false);
    })