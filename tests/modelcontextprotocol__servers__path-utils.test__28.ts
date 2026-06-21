it('should handle relative path slash conversion based on platform', () => {
      // This test verifies platform-specific behavior naturally without mocking
      // On Windows: forward slashes converted to backslashes
      // On Linux/Unix: forward slashes preserved
      const relativePath = 'some/relative/path';
      const result = normalizePath(relativePath);

      if (originalPlatform === 'win32') {
        expect(result).toBe('some\\relative\\path');
      } else {
        expect(result).toBe('some/relative/path');
      }
    })