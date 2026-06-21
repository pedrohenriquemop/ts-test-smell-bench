it('handles mixed separators correctly', () => {
      if (path.sep === '\\') {
        const allowed = ['C:\\Users\\project'];

        // Mixed separators should be normalized
        expect(isPathWithinAllowedDirectories('C:/Users/project', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('C:\\Users/project\\src', allowed)).toBe(true);
        expect(isPathWithinAllowedDirectories('C:/Users\\project/src', allowed)).toBe(true);
      }
    })