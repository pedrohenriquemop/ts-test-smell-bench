it('demonstrates parent directory symlink traversal', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping parent directory symlink traversal test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const deepPath = path.join(allowedDir, 'sub1', 'sub2', 'file.txt');

      expect(isPathWithinAllowedDirectories(deepPath, allowed)).toBe(true);

      const sub1Path = path.join(allowedDir, 'sub1');
      await fs.symlink(forbiddenDir, sub1Path);

      await fs.mkdir(path.join(sub1Path, 'sub2'), { recursive: true });
      await fs.writeFile(deepPath, 'CONTENT', 'utf-8');

      const realPath = await fs.realpath(deepPath);
      const realAllowedDir = await fs.realpath(allowedDir);
      const realForbiddenDir = await fs.realpath(forbiddenDir);

      expect(realPath.startsWith(realAllowedDir)).toBe(false);
      expect(realPath.startsWith(realForbiddenDir)).toBe(true);
    })