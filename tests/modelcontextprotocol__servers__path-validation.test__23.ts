it('rejects paths with null bytes', () => {
      const allowed = ['/home/user/project'];

      expect(isPathWithinAllowedDirectories('/home/user/project\x00/etc/passwd', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project/test\x00.txt', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('\x00/home/user/project', allowed)).toBe(false);
      expect(isPathWithinAllowedDirectories('/home/user/project/\x00', allowed)).toBe(false);
    })