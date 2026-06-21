it('handles null and undefined inputs gracefully', () => {
      const allowed = ['/home/user/project'];

      // Should return false, not crash
      expect(isPathWithinAllowedDirectories(null as any, allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories(undefined as any, allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/path', null as any)).toBe(false);
      expect(isPathWithinAllowedDirectories('/path', undefined as any)).toBe(false);
    })