it('validates symlinked files consistently between path and resolved forms', async () => {
      try {
        // Setup: Create target file in forbidden area
        const targetFile = path.join(forbiddenDir, 'target.txt');
        await fs.writeFile(targetFile, 'TARGET_CONTENT');

        // Create symlink inside allowed directory pointing to forbidden file
        const symlinkPath = path.join(allowedDir, 'link-to-target.txt');
        await fs.symlink(targetFile, symlinkPath);

        // The symlink path itself passes validation (looks like it's in allowed dir)
        expect(isPathWithinAllowedDirectories(symlinkPath, [allowedDir])).toBe(true);

        // But the resolved path should fail validation
        const resolvedPath = await fs.realpath(symlinkPath);
        expect(isPathWithinAllowedDirectories(resolvedPath, [allowedDir])).toBe(false);

        // Verify the resolved path goes to the forbidden location (normalize both paths for macOS temp dirs)
        expect(await fs.realpath(resolvedPath)).toBe(await fs.realpath(targetFile));
      } catch (error) {
        // Skip if no symlink permissions on the system
        if ((error as NodeJS.ErrnoException).code !== 'EPERM') {
          throw error;
        }
      }
    })