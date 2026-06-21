it('handles root directory as allowed', () => {
      const allowed = ['/'];

      // Everything is allowed under root (dangerous configuration)
      expect(isPathWithinAllowedDirectories('/', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/any/path', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/etc/passwd', allowed)).toBe(true);
      expect(isPathWithinAllowedDirectories('/home/user/secret', allowed)).toBe(true);

      // But only on the same filesystem root
      if (path.sep === '\\') {
        expect(isPathWithinAllowedDirectories('D:\\other', ['/'])).toBe(false);
      }
    })