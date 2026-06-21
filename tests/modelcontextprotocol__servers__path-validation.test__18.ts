it('handles Windows-style paths on Windows', () => {
      if (path.sep === '\\') {
        const allowed = ['C:\\Users\\project'];
        expect(isPathWithinAllowedDirectories('C:\\Users\\project', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('C:\\Users\\project\\src', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('C:\\Users\\project2', allowed)).toBe(false);
        expect(isPathWithinAllowedDirectories('C:\\Users\\project_backup', allowed)).toBe(false);
      }
    })