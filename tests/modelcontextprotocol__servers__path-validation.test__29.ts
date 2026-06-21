it('rejects non-string inputs safely', () => {
      const allowed = ['/home/user/project'];

      expect(isPathWithinAllowedDirectories(123 as any, allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories({} as any, allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories([] as any, allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories(null as any, allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories(undefined as any, allowed)).toBe(false);

      // Non-string in allowed directories
      expect(isPathWithinAllowedDirectories('/home/user/project', [123 as any])).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project', [{} as any])).toBe(false);
    })