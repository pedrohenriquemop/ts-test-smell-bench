it('handles Windows paths with trailing separators', () => {
      if (path.sep === '\\') {
        const allowed = ['C:\\Users\\project'];

        // Path with trailing separator
        expect(isPathWithinAllowedDirectories('C:\\Users\\project\\', allowed)).toBe(true);

        // Allowed with trailing separator
        const allowedWithSep = ['C:\\Users\\project\\'];
        expect(isPathWithinAllowedDirectories('C:\\Users\\project', allowedWithSep)).toBe(true);
        expect(isPathWithinAllowedDirectories('C:\\Users\\project\\', allowedWithSep)).toBe(true);

        // Should still block similar names
        expect(isPathWithinAllowedDirectories('C:\\Users\\project2\\', allowed)).toBe(false);
      }
    })