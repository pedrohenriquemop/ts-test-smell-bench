it('shows timing differences between validation approaches', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping timing validation test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];

      const validation1 = isPathWithinAllowedDirectories(testPath, allowed);
      expect(validation1).toBe(true);

      await fs.symlink(targetFile, testPath);

      const resolvedPath = await fs.realpath(testPath);
      const validation2 = isPathWithinAllowedDirectories(resolvedPath, allowed);
      expect(validation2).toBe(false);

      expect(validation1).not.toBe(validation2);
    })