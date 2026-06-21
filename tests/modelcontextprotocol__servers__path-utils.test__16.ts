it('handles UNC paths correctly', () => {
      // UNC paths should preserve the leading double backslash
      const uncPath = '\\\\SERVER\\share\\folder';
      expect(normalizePath(uncPath)).toBe('\\\\SERVER\\share\\folder');
      
      // Test UNC path with double backslashes that need normalization
      const uncPathWithDoubles = '\\\\\\\\SERVER\\\\share\\\\folder';
      expect(normalizePath(uncPathWithDoubles)).toBe('\\\\SERVER\\share\\folder');
    })