it('should prevent race condition between validatePath and file operation', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping race condition prevention test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const racePath = path.join(allowedDir, 'race-file.txt');
      const targetFile = path.join(forbiddenDir, 'target.txt');

      await fs.writeFile(targetFile, 'ORIGINAL CONTENT', 'utf-8');

      // Path validation would pass (file doesn't exist, parent is in allowed dir)
      expect(await fs.access(racePath).then(() => false).catch(() => true)).toBe(true);
      expect(isPathWithinAllowedDirectories(racePath, allowed)).toBe(true);

      // Race condition: symlink created after validation but before write
      await fs.symlink(targetFile, racePath);

      // With exclusive write flag, write should fail on symlink
      await expect(
        fs.writeFile(racePath, 'NEW CONTENT', { encoding: 'utf-8', flag: 'wx' })
      ).rejects.toThrow(/EEXIST/);

      // Verify content unchanged
      const targetContent = await fs.readFile(targetFile, 'utf-8');
      expect(targetContent).toBe('ORIGINAL CONTENT');

      // The symlink exists but write was blocked
      const actualWritePath = await fs.realpath(racePath);
      expect(actualWritePath).toBe(await fs.realpath(targetFile));
      expect(isPathWithinAllowedDirectories(actualWritePath, allowed)).toBe(false);
    })