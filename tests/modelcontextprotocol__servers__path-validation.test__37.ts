it('validates paths correctly when allowed directory is resolved from symlink', async () => {
      try {
        // Setup: Create the actual target directory with content
        const actualTargetDir = path.join(testDir, 'actual-target');
        await fs.mkdir(actualTargetDir, { recursive: true });
        const targetFile = path.join(actualTargetDir, 'file.txt');
        await fs.writeFile(targetFile, 'FILE_CONTENT');

        // Setup: Create symlink directory that points to target
        const symlinkDir = path.join(testDir, 'symlink-dir');
        await fs.symlink(actualTargetDir, symlinkDir);

        // Simulate resolved allowed directory (what the server startup should do)
        const resolvedAllowedDir = await fs.realpath(symlinkDir);
        const resolvedTargetDir = await fs.realpath(actualTargetDir);
        expect(resolvedAllowedDir).toBe(resolvedTargetDir);

        // Test 1: File access through original symlink path should pass validation with resolved allowed dir
        const fileViaSymlink = path.join(symlinkDir, 'file.txt');
        const resolvedFile = await fs.realpath(fileViaSymlink);
        expect(isPathWithinAllowedDirectories(resolvedFile, [resolvedAllowedDir])).toBe(true);

        // Test 2: File access through resolved path should also pass validation
        const fileViaResolved = path.join(resolvedTargetDir, 'file.txt');
        expect(isPathWithinAllowedDirectories(fileViaResolved, [resolvedAllowedDir])).toBe(true);

        // Test 3: Demonstrate inconsistent behavior with unresolved allowed directories
        // If allowed dirs were not resolved (storing symlink paths instead):
        const unresolvedAllowedDirs = [symlinkDir];
        // This validation would incorrectly fail for the same content:
        expect(isPathWithinAllowedDirectories(resolvedFile, unresolvedAllowedDirs)).toBe(false);

      } catch (error) {
        // Skip if no symlink permissions on the system
        if ((error as NodeJS.ErrnoException).code !== 'EPERM') {
          throw error;
        }
      }
    })