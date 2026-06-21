it('demonstrates exclusive file creation behavior', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping exclusive file creation test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];

      await fs.symlink(targetFile, testPath);

      await expect(fs.open(testPath, 'wx')).rejects.toThrow(/EEXIST/);

      await fs.writeFile(testPath, 'NEW CONTENT', 'utf-8');
      const targetContent = await fs.readFile(targetFile, 'utf-8');
      expect(targetContent).toBe('NEW CONTENT');
    })