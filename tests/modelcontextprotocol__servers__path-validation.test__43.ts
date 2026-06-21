it('validates directory creation timing', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping directory creation timing test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const testDir = path.join(allowedDir, 'newdir');

      expect(isPathWithinAllowedDirectories(testDir, allowed)).toBe(true);

      await fs.symlink(forbiddenDir, testDir);

      expect(isPathWithinAllowedDirectories(testDir, allowed)).toBe(true);

      const resolved = await fs.realpath(testDir);
      expect(isPathWithinAllowedDirectories(resolved, allowed)).toBe(false);
    })