it('allows paths through both original and resolved symlink directories', async () => {
      try {
        // Setup: Create the actual target directory with content
        const actualTargetDir = path.join(testDir, 'actual-target');
        await fs.mkdir(actualTargetDir, { recursive: true });
        const targetFile = path.join(actualTargetDir, 'file.txt');
        await fs.writeFile(targetFile, 'FILE_CONTENT');

        // Setup: Create symlink directory that points to target (simulates /tmp -> /private/tmp)
        const symlinkDir = path.join(testDir, 'symlink-dir');
        await fs.symlink(actualTargetDir, symlinkDir);

        // Get the resolved path
        const resolvedDir = await fs.realpath(symlinkDir);

        // THE FIX: Store BOTH original symlink path AND resolved path in allowed directories
        // This is what the server should do during startup to fix issue #3253
        const allowedDirsWithBoth = [symlinkDir, resolvedDir];

        // Test 1: Path through original symlink should pass validation
        // (e.g., user requests /tmp/file.txt when /tmp is in allowed dirs)
        const fileViaSymlink = path.join(symlinkDir, 'file.txt');
        expect(isPathWithinAllowedDirectories(fileViaSymlink, allowedDirsWithBoth)).toBe(true);

        // Test 2: Path through resolved directory should also pass validation
        // (e.g., user requests /private/tmp/file.txt)
        const fileViaResolved = path.join(resolvedDir, 'file.txt');
        expect(isPathWithinAllowedDirectories(fileViaResolved, allowedDirsWithBoth)).toBe(true);

        // Test 3: The resolved path of the symlink file should also pass
        const resolvedFile = await fs.realpath(fileViaSymlink);
        expect(isPathWithinAllowedDirectories(resolvedFile, allowedDirsWithBoth)).toBe(true);

        // Verify both paths point to the same actual file
        expect(resolvedFile).toBe(await fs.realpath(fileViaResolved));

      } catch (error) {
        // Skip if no symlink permissions on the system
        if ((error as NodeJS.ErrnoException).code !== 'EPERM') {
          throw error;
        }
      }
    })