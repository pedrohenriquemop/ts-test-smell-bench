it('resolves nested symlink chains completely', async () => {
      try {
        // Setup: Create target file in forbidden area
        const actualTarget = path.join(forbiddenDir, 'target-file.txt');
        await fs.writeFile(actualTarget, 'FINAL_CONTENT');

        // Create chain of symlinks: allowedFile -> link2 -> link1 -> actualTarget
        const link1 = path.join(testDir, 'intermediate-link1');
        const link2 = path.join(testDir, 'intermediate-link2');
        const allowedFile = path.join(allowedDir, 'seemingly-safe-file');

        await fs.symlink(actualTarget, link1);
        await fs.symlink(link1, link2);
        await fs.symlink(link2, allowedFile);

        // The allowed file path passes basic validation
        expect(isPathWithinAllowedDirectories(allowedFile, [allowedDir])).toBe(true);

        // But complete resolution reveals the forbidden target
        const fullyResolvedPath = await fs.realpath(allowedFile);
        expect(isPathWithinAllowedDirectories(fullyResolvedPath, [allowedDir])).toBe(false);
        expect(await fs.realpath(fullyResolvedPath)).toBe(await fs.realpath(actualTarget));

      } catch (error) {
        // Skip if no symlink permissions on the system
        if ((error as NodeJS.ErrnoException).code !== 'EPERM') {
          throw error;
        }
      }
    })