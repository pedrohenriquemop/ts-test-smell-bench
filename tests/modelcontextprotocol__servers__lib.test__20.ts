it('resolves relative paths against allowed directories instead of process.cwd()', async () => {
        const relativePath = 'test-file.txt';
        const originalCwd = process.cwd;
        
        // Mock process.cwd to return a directory outside allowed directories
        const disallowedCwd = process.platform === 'win32' ? 'C:\\Windows\\System32' : '/root';
        (process as any).cwd = vi.fn(() => disallowedCwd);
        
        try {
          const result = await validatePath(relativePath);
          
          // Result should be resolved against first allowed directory, not process.cwd()
          const expectedPath = process.platform === 'win32' 
            ? path.resolve('C:\\Users\\test', relativePath)
            : path.resolve('/home/user', relativePath);
          
          expect(result).toBe(expectedPath);
          expect(result).not.toContain(disallowedCwd);
        } finally {
          // Restore original process.cwd
          process.cwd = originalCwd;
        }
      })