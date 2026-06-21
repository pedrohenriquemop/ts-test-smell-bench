it('demonstrates race condition in read operations', async () => {
      const symlinkSupported = await getSymlinkSupport();
      if (!symlinkSupported) {
        console.log('   ⏭️  Skipping race condition in read operations test - symlinks not supported');
        return;
      }

      const allowed = [allowedDir];
      const legitFile = path.join(allowedDir, 'readable.txt');
      const secretFile = path.join(forbiddenDir, 'secret.txt');

      // Create legitimate file
      await fs.writeFile(legitFile, 'PUBLIC CONTENT', 'utf-8');

      // Create secret file in forbidden directory
      await fs.writeFile(secretFile, 'SECRET CONTENT', 'utf-8');

      // Step 1: validatePath would pass for legitimate file
      expect(isPathWithinAllowedDirectories(legitFile, allowed)).toBe(true);

      // Step 2: Race condition - replace file with symlink after validation
      await fs.unlink(legitFile);
      await fs.symlink(secretFile, legitFile);

      // Step 3: Read operation follows symlink to forbidden location
      const content = await fs.readFile(legitFile, 'utf-8');

      // This shows the vulnerability - we read forbidden content
      expect(content).toBe('SECRET CONTENT');
      expect(isPathWithinAllowedDirectories(await fs.realpath(legitFile), allowed)).toBe(false);
    })