it('handles UNC paths on Windows', () => {
      if (path.sep === '\\') {
        const allowed = ['\\\\server\\share\\project'];

        expect(isPathWithinAllowedDirectories('\\\\server\\share\\project', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('\\\\server\\share\\project\\file', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('\\\\server\\share\\other', allowed)).toBe(false);
        expect(isPathWithinAllowedDirectories('\\\\other\\share\\project', allowed)).toBe(false);
      }
    })