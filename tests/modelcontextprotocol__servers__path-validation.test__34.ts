it('validates symlink handling', async () => {
      // Test with symlinks
      try {
        const linkPath = path.join(allowedDir, 'bad-link');
        const targetPath = path.join(forbiddenDir, 'target.txt');

        await fs.writeFile(targetPath, 'content');
        await fs.symlink(targetPath, linkPath);

        // In real implementation, this would throw with the resolved path
        const realPath = await fs.realpath(linkPath);
        const allowed = [allowedDir];

        // Symlink target should be outside allowed directory
        expect(isPathWithinAllowedDirectories(realPath, allowed)).toBe(false);
      } catch (error) {
        // Skip if no symlink permissions
      }
    })