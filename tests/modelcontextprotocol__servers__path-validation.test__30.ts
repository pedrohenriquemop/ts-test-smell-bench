it('handles very long paths', () => {
      const allowed = ['/home/user/project'];

      // Create a very long path that's still valid
      const longSubPath = 'a/'.repeat(1000) + 'file.txt';
      expect(isPathWithinAllowedDirectories(`/home/user/project/${longSubPath}`, allowed)).toBe(true);

      // Very long path that escapes
      const escapePath = 'a/'.repeat(1000) + '../'.repeat(1001) + 'etc/passwd';
      expect(isPathWithinAllowedDirectories(`/home/user/project/${escapePath}`, allowed)).toBe(false);
    })